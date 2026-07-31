import { NextResponse } from "next/server";
import { contact, company } from "@/lib/content";

/**
 * Contact / demo-request endpoint.
 *
 * Delivery goes through Resend's REST API over plain fetch — no SDK, because
 * this is one HTTP POST and a dependency is not worth it.
 *
 * Required env for delivery:
 *   RESEND_API_KEY    — API key from resend.com
 *   CONTACT_FROM_EMAIL— verified sender on your domain, e.g. site@somokolonlabs.com
 *   CONTACT_TO_EMAIL  — where enquiries land (defaults to the published address)
 *
 * If the key is missing we fail loudly in production rather than accepting the
 * message and dropping it. A contact form that silently discards leads is worse
 * than one that is honestly unavailable.
 */

const MAX = { name: 120, email: 200, company: 160, message: 5000 } as const;

// Best-effort abuse throttle. This is per-instance memory, so on serverless it
// is a speed bump, not a guarantee. Put a real limiter at the edge if the form
// ever gets targeted.
const WINDOW_MS = 60_000;
const MAX_PER_WINDOW = 5;
const hits = new Map<string, number[]>();

function isRateLimited(key: string): boolean {
  const now = Date.now();
  const recent = (hits.get(key) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(key, recent);

  // Keep the map from growing without bound on a long-lived instance.
  if (hits.size > 5000) {
    for (const [k, times] of hits) {
      if (times.every((t) => now - t >= WINDOW_MS)) hits.delete(k);
    }
  }

  return recent.length > MAX_PER_WINDOW;
}

function clientKey(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  return forwarded?.split(",")[0]?.trim() || "unknown";
}

function field(value: unknown, limit: number): string {
  return String(value ?? "")
    .trim()
    .slice(0, limit);
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

async function sendEmail(payload: {
  name: string;
  email: string;
  companyName: string;
  message: string;
}): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) throw new Error("RESEND_API_KEY is not set");

  const from =
    process.env.CONTACT_FROM_EMAIL ?? `${company.name} <onboarding@resend.dev>`;
  const to = process.env.CONTACT_TO_EMAIL ?? contact.email;

  const rows: [string, string][] = [
    ["Name", payload.name],
    ["Email", payload.email],
    ["Company", payload.companyName || "—"],
  ];

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: [to],
      reply_to: payload.email,
      subject: `New enquiry — ${payload.name}`,
      text: [
        ...rows.map(([k, v]) => `${k}: ${v}`),
        "",
        payload.message,
      ].join("\n"),
      html: [
        "<h2>New enquiry</h2>",
        "<ul>",
        ...rows.map(
          ([k, v]) => `<li><strong>${k}:</strong> ${escapeHtml(v)}</li>`
        ),
        "</ul>",
        `<p style="white-space:pre-wrap">${escapeHtml(payload.message)}</p>`,
      ].join(""),
    }),
  });

  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    throw new Error(`Resend responded ${res.status}: ${detail.slice(0, 300)}`);
  }
}

export async function POST(request: Request) {
  try {
    if (isRateLimited(clientKey(request))) {
      return NextResponse.json(
        { ok: false, error: "Too many messages. Please try again in a minute." },
        { status: 429 }
      );
    }

    const body = await request.json();

    // Honeypot: a real person never fills a hidden field. Accept silently so
    // bots get a success response and do not retry.
    if (field(body?.website, 200)) {
      return NextResponse.json({ ok: true });
    }

    const name = field(body?.name, MAX.name);
    const email = field(body?.email, MAX.email);
    const companyName = field(body?.company, MAX.company);
    const message = field(body?.message, MAX.message);

    if (!name || !email || !message) {
      return NextResponse.json(
        { ok: false, error: "Please fill in your name, email, and message." },
        { status: 400 }
      );
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { ok: false, error: "Please enter a valid email address." },
        { status: 400 }
      );
    }

    if (!process.env.RESEND_API_KEY) {
      if (process.env.NODE_ENV === "production") {
        console.error(
          "[contact] RESEND_API_KEY missing — refusing to accept a message we cannot deliver."
        );
        return NextResponse.json(
          {
            ok: false,
            error: `Our form is temporarily unavailable. Please email ${contact.email} directly.`,
          },
          { status: 503 }
        );
      }

      console.warn(
        `[contact] No RESEND_API_KEY in development — logging instead of sending. From: ${email}`
      );
      return NextResponse.json({ ok: true });
    }

    await sendEmail({ name, email, companyName, message });
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[contact] failed:", error);
    return NextResponse.json(
      {
        ok: false,
        error: `Something went wrong sending your message. Please email ${contact.email} directly.`,
      },
      { status: 500 }
    );
  }
}
