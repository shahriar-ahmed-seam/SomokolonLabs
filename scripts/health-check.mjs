/**
 * Verifies every demo link in the catalogue still points at our own product.
 *
 * A 200 is not enough, and this is not theoretical — all three of these have
 * already happened to us:
 *
 *   1. A released Vercel subdomain was reclaimed by someone else and served an
 *      unrelated site, under a 200, with our old product name still in the title.
 *   2. A "demo" turned out to be a sign-in wall with nothing a visitor could see.
 *   3. A repo advertised a homepage URL that returned 404.
 *
 * So we check three things: the response is OK, the page does not look like a
 * failure or login shell, and the product's own name appears in the markup.
 *
 * Exit code is non-zero if anything fails, so CI can alert on it.
 *
 * Usage:
 *   node scripts/health-check.mjs           # human-readable
 *   node scripts/health-check.mjs --json    # machine-readable
 */

import { readCatalogue, demoHref, normalise } from "./lib/read-catalogue.mjs";

const TIMEOUT_MS = 25_000;
const asJson = process.argv.includes("--json");

/**
 * Vercel-specific and unambiguous only.
 *
 * Do NOT add generic strings like "This page could not be found" or
 * "404: NOT_FOUND" here. Next.js ships those inside its client bundle, so they
 * appear on perfectly healthy pages and every Next.js demo reports as broken.
 * HTTP status plus the product-name check does the real work.
 */
const FAILURE_MARKERS = [
  "DEPLOYMENT_NOT_FOUND",
  "The deployment could not be found",
];

/**
 * Hosts we do not control sometimes answer scripted requests with a bot
 * challenge instead of the page. PyPI does this. That is not a broken link, so
 * it is reported separately rather than counted as a failure — but it is
 * reported, because "we cannot check this" is worth knowing.
 */
const CHALLENGE_MARKERS = [
  "Client Challenge",
  "Just a moment...",
  "Attention Required!",
  "Enable JavaScript and cookies to continue",
];

async function check(product) {
  const url = demoHref(product);
  if (!url) return { ...product, url: null, verdict: "NO_DEMO" };

  const started = Date.now();
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
    const res = await fetch(url, {
      redirect: "follow",
      signal: controller.signal,
      headers: { "User-Agent": "somokolonlabs-health-check" },
    });
    clearTimeout(timer);

    const body = await res.text();
    const ms = Date.now() - started;
    const haystack = normalise(body);

    const failureShell = FAILURE_MARKERS.some((m) => body.includes(m));
    const challenged = CHALLENGE_MARKERS.some((m) => body.includes(m));
    // The product name should appear somewhere — usually the <title>. Its
    // absence means we are almost certainly looking at somebody else's page.
    const identifies = haystack.includes(normalise(product.name));

    let verdict = "OK";
    if (!res.ok) verdict = `HTTP_${res.status}`;
    else if (failureShell) verdict = "NOT_FOUND_SHELL";
    else if (challenged) verdict = "BOT_CHALLENGED";
    else if (!identifies) verdict = "WRONG_CONTENT";

    return { ...product, url, status: res.status, ms, bytes: body.length, verdict };
  } catch (err) {
    return {
      ...product,
      url,
      status: 0,
      ms: Date.now() - started,
      bytes: 0,
      verdict: err.name === "AbortError" ? "TIMEOUT" : "UNREACHABLE",
    };
  }
}

const catalogue = await readCatalogue();
const results = await Promise.all(catalogue.map(check));

const NON_FAILURES = new Set(["OK", "NO_DEMO", "BOT_CHALLENGED"]);
const failures = results.filter((r) => !NON_FAILURES.has(r.verdict));

if (asJson) {
  console.log(
    JSON.stringify(
      {
        checkedAt: new Date().toISOString(),
        total: results.length,
        healthy: results.filter((r) => r.verdict === "OK").length,
        failing: failures.length,
        results: results.map(({ slug, name, url, status, ms, verdict }) => ({
          slug,
          name,
          url,
          status,
          ms,
          verdict,
        })),
      },
      null,
      2
    )
  );
} else {
  const pad = Math.max(...results.map((r) => r.slug.length)) + 2;
  for (const r of results.sort((a, b) => a.verdict.localeCompare(b.verdict))) {
    const detail = r.url ? `${String(r.status).padStart(3)}  ${r.ms}ms` : "-";
    console.log(`${r.verdict.padEnd(16)} ${r.slug.padEnd(pad)} ${detail}`);
  }
  console.log(
    `\n${results.filter((r) => r.verdict === "OK").length}/${results.length} healthy` +
      (failures.length ? `, ${failures.length} FAILING` : "")
  );
  for (const f of failures) {
    console.log(`  ${f.verdict}: ${f.name} -> ${f.url}`);
  }
}

process.exit(failures.length > 0 ? 1 : 0);
