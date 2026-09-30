import { contact } from "@/lib/content";
import { buildSystemPrompt } from "@/lib/chat-context";
import { limit, type Rule } from "@/lib/rate-limit";

/**
 * Website assistant. Streams a reply from DeepSeek's OpenAI-compatible API as
 * plain text.
 *
 * Env (server-only, see .env.example):
 *   DEEPSEEK_API_KEY   — required; without it the endpoint returns 503
 *   DEEPSEEK_BASE_URL  — defaults to https://api.deepseek.com
 *   DEEPSEEK_MODEL     — defaults to deepseek-chat
 *   CHAT_DAILY_CAP     — replies per day across the whole site (default 1500)
 *   UPSTASH_REDIS_REST_URL / _TOKEN (or KV_REST_API_URL / _TOKEN) — shared
 *                        counters for the limits below; see lib/rate-limit.ts
 *
 * This endpoint is public and every call costs money, so it is fenced:
 *  - same-origin only (browsers on other sites can't call it),
 *  - per-visitor burst and daily limits,
 *  - a site-wide daily cap, which bounds the worst-case bill even if the
 *    per-visitor limits are dodged by rotating addresses,
 *  - bounded history and message length, and a hard cap on reply tokens,
 *  - the client can never send a system message; the prompt is built here.
 *
 * Without Redis the counters are per instance, so on serverless they are a
 * speed bump rather than a guarantee. The DeepSeek account balance is the
 * last line of defence: keep it small and set a low-balance alert.
 */

const MAX_MESSAGES = 12; // history kept per request
const MAX_USER_CHARS = 800;
const MAX_ASSISTANT_CHARS = 2000;
const MAX_REPLY_TOKENS = 400;
const UPSTREAM_TIMEOUT_MS = 30_000;

const FALLBACK = `You can reach the team directly at ${contact.email} or through the contact page.`;

// ------------------------------------------------------------ Rate limit

const DAY = 24 * 60 * 60;
const VISITOR_RULES: Rule[] = [
  { name: "burst", windowSeconds: 60, max: 8 },
  { name: "daily", windowSeconds: DAY, max: 80 },
];

function siteRules(): Rule[] {
  const cap = Number.parseInt(process.env.CHAT_DAILY_CAP ?? "", 10);
  return [{ name: "site-daily", windowSeconds: DAY, max: Number.isFinite(cap) && cap > 0 ? cap : 1500 }];
}

function tooMany(message: string, retryAfterSeconds: number) {
  return Response.json(
    { error: message },
    {
      status: 429,
      headers: { "Cache-Control": "no-store", "Retry-After": String(retryAfterSeconds) },
    }
  );
}

function clientKey(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  return forwarded?.split(",")[0]?.trim() || request.headers.get("x-real-ip") || "unknown";
}

/** Rejects cross-site browser calls. Requests with no Origin (curl, server) pass to the limiter. */
function isCrossOrigin(request: Request): boolean {
  const origin = request.headers.get("origin");
  if (!origin) return false;
  try {
    const host = request.headers.get("x-forwarded-host") ?? request.headers.get("host");
    return new URL(origin).host !== host;
  } catch {
    return true;
  }
}

// ------------------------------------------------------------ Validation

type ChatMessage = { role: "user" | "assistant"; content: string };

function sanitize(body: unknown): ChatMessage[] | null {
  const raw = (body as { messages?: unknown })?.messages;
  if (!Array.isArray(raw) || raw.length === 0) return null;

  const messages: ChatMessage[] = [];
  for (const m of raw.slice(-MAX_MESSAGES)) {
    const role = (m as { role?: unknown })?.role;
    const content = (m as { content?: unknown })?.content;
    if ((role !== "user" && role !== "assistant") || typeof content !== "string") return null;
    const text = content.trim().slice(0, role === "user" ? MAX_USER_CHARS : MAX_ASSISTANT_CHARS);
    if (text) messages.push({ role, content: text });
  }
  // The model must be answering a visitor, not continuing its own turn.
  if (messages.length === 0 || messages[messages.length - 1].role !== "user") return null;
  return messages;
}

function error(status: number, message: string) {
  return Response.json({ error: message }, { status, headers: { "Cache-Control": "no-store" } });
}

// ------------------------------------------------------------ Handler

export async function POST(request: Request) {
  if (isCrossOrigin(request)) return error(403, "Not allowed.");

  const visitor = await limit("chat", clientKey(request), VISITOR_RULES);
  if (visitor.limited) {
    return tooMany(
      `You've sent a lot of messages. Please try again in a little while. ${FALLBACK}`,
      visitor.retryAfterSeconds
    );
  }

  let messages: ChatMessage[] | null;
  try {
    messages = sanitize(await request.json());
  } catch {
    messages = null;
  }
  if (!messages) return error(400, "Please send a message.");

  const apiKey = process.env.DEEPSEEK_API_KEY;
  if (!apiKey) {
    console.error("[chat] DEEPSEEK_API_KEY is not set.");
    return error(503, `The assistant is offline right now. ${FALLBACK}`);
  }

  // Counted only for requests that will actually reach DeepSeek.
  const site = await limit("chat", "site", siteRules());
  if (site.limited) {
    console.warn("[chat] site-wide daily cap reached.");
    return tooMany(`The assistant has reached its limit for today. ${FALLBACK}`, site.retryAfterSeconds);
  }

  const base = (process.env.DEEPSEEK_BASE_URL || "https://api.deepseek.com").replace(/\/+$/, "");
  const model = process.env.DEEPSEEK_MODEL || "deepseek-chat";

  let upstream: Response;
  try {
    upstream = await fetch(`${base}/chat/completions`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model,
        stream: true,
        temperature: 0.3,
        max_tokens: MAX_REPLY_TOKENS,
        messages: [{ role: "system", content: buildSystemPrompt() }, ...messages],
      }),
      signal: AbortSignal.any([request.signal, AbortSignal.timeout(UPSTREAM_TIMEOUT_MS)]),
    });
  } catch (err) {
    console.error("[chat] upstream request failed:", err);
    return error(502, `The assistant couldn't be reached. ${FALLBACK}`);
  }

  if (!upstream.ok || !upstream.body) {
    const detail = await upstream.text().catch(() => "");
    console.error(`[chat] upstream ${upstream.status}: ${detail.slice(0, 300)}`);
    return error(502, `The assistant is having trouble right now. ${FALLBACK}`);
  }

  // Translate the upstream SSE stream into plain text deltas.
  const decoder = new TextDecoder();
  const encoder = new TextEncoder();
  let buffer = "";

  const stream = upstream.body.pipeThrough(
    new TransformStream<Uint8Array, Uint8Array>({
      transform(chunk, controller) {
        buffer += decoder.decode(chunk, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() ?? "";
        for (const line of lines) {
          const data = line.trim();
          if (!data.startsWith("data:")) continue;
          const payload = data.slice(5).trim();
          if (payload === "[DONE]") continue;
          try {
            const delta = JSON.parse(payload)?.choices?.[0]?.delta?.content;
            if (typeof delta === "string" && delta) controller.enqueue(encoder.encode(delta));
          } catch {
            // Partial or keep-alive line; the next chunk completes it.
          }
        }
      },
    })
  );

  return new Response(stream, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-store",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
