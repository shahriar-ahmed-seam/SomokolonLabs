/**
 * Fixed-window rate limiting that holds across server instances.
 *
 * With Upstash Redis configured it counts in Redis over the REST API, so every
 * serverless instance sees the same numbers. Either pair of env vars works:
 *
 *   UPSTASH_REDIS_REST_URL / UPSTASH_REDIS_REST_TOKEN   (Upstash console)
 *   KV_REST_API_URL / KV_REST_API_TOKEN                 (Vercel Marketplace)
 *
 * Without them, or if Redis can't be reached, it falls back to per-instance
 * memory: fine for local development and a speed bump in production, but not
 * a guarantee.
 *
 * Keys are SHA-256 hashes, so no raw IP address is ever stored, and every
 * counter expires with its window.
 *
 * No imports and erasable-only TypeScript, so the unit test can run it with
 * plain `node` (type stripping) as well as through Next.
 */

export type Rule = {
  /** Short label, part of the key, e.g. "burst". */
  name: string;
  windowSeconds: number;
  max: number;
};

export type Verdict =
  | { limited: false; store: "redis" | "memory" }
  | { limited: true; store: "redis" | "memory"; rule: string; retryAfterSeconds: number };

const PREFIX = "rl:v1";
const REDIS_TIMEOUT_MS = 1500;

function redisConfig(): { url: string; token: string } | null {
  const url = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN;
  return url && token ? { url: url.replace(/\/+$/, ""), token } : null;
}

async function sha256(text: string): Promise<string> {
  const bytes = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text));
  return Array.from(new Uint8Array(bytes).slice(0, 16), (b) => b.toString(16).padStart(2, "0")).join("");
}

type Slot = { key: string; rule: Rule; retryAfterSeconds: number };

async function slots(scope: string, subject: string, rules: Rule[], now: number): Promise<Slot[]> {
  const id = await sha256(`${scope}:${subject}`);
  return rules.map((rule) => {
    const windowMs = rule.windowSeconds * 1000;
    const window = Math.floor(now / windowMs);
    return {
      key: `${PREFIX}:${scope}:${rule.name}:${id}:${window}`,
      rule,
      retryAfterSeconds: Math.max(1, Math.ceil(((window + 1) * windowMs - now) / 1000)),
    };
  });
}

// ------------------------------------------------------------ Redis

/** INCR + EXPIRE for every slot in one round trip. Returns the counts. */
async function redisCount(cfg: { url: string; token: string }, list: Slot[]): Promise<number[]> {
  const commands = list.flatMap((s) => [
    ["INCR", s.key],
    ["EXPIRE", s.key, String(s.rule.windowSeconds)],
  ]);
  const res = await fetch(`${cfg.url}/pipeline`, {
    method: "POST",
    headers: { Authorization: `Bearer ${cfg.token}`, "Content-Type": "application/json" },
    body: JSON.stringify(commands),
    signal: AbortSignal.timeout(REDIS_TIMEOUT_MS),
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`Redis responded ${res.status}`);
  const replies = (await res.json()) as { result?: unknown; error?: string }[];
  return list.map((_, i) => {
    const reply = replies[i * 2];
    if (!reply || reply.error || typeof reply.result !== "number") {
      throw new Error(`Redis INCR failed: ${reply?.error ?? "no result"}`);
    }
    return reply.result;
  });
}

// ------------------------------------------------------------ Memory

const memory = new Map<string, { count: number; expires: number }>();

function memoryCount(list: Slot[], now: number): number[] {
  if (memory.size > 10_000) {
    for (const [k, v] of memory) if (v.expires <= now) memory.delete(k);
  }
  return list.map((s) => {
    const entry = memory.get(s.key);
    const next =
      entry && entry.expires > now
        ? { count: entry.count + 1, expires: entry.expires }
        : { count: 1, expires: now + s.rule.windowSeconds * 1000 };
    memory.set(s.key, next);
    return next.count;
  });
}

// ------------------------------------------------------------ Public

let warned = false;

/**
 * Counts one hit for `subject` (e.g. a client IP, or "site" for a global cap)
 * against every rule, and reports whether any rule is now over its limit.
 */
export async function limit(scope: string, subject: string, rules: Rule[]): Promise<Verdict> {
  const now = Date.now();
  const list = await slots(scope, subject, rules, now);
  const cfg = redisConfig();

  let counts: number[];
  let store: "redis" | "memory" = "memory";
  if (cfg) {
    try {
      counts = await redisCount(cfg, list);
      store = "redis";
    } catch (err) {
      console.error("[rate-limit] Redis unavailable, using memory:", (err as Error).message);
      counts = memoryCount(list, now);
    }
  } else {
    if (!warned && process.env.NODE_ENV === "production") {
      console.warn("[rate-limit] No Redis configured; limits are per instance only.");
      warned = true;
    }
    counts = memoryCount(list, now);
  }

  for (let i = 0; i < list.length; i++) {
    if (counts[i] > list[i].rule.max) {
      return { limited: true, store, rule: list[i].rule.name, retryAfterSeconds: list[i].retryAfterSeconds };
    }
  }
  return { limited: false, store };
}
