/**
 * Captures landing-page screenshots of our deployed products and writes them to
 * public/work/<slug>.webp for use on the site.
 *
 * Why a script and not manual screenshots: consistency. Every shot is the same
 * viewport, the same scale, and the same settle time, so the cards on the site
 * look like a set rather than a scrapbook. Re-run it when a product's UI changes.
 *
 * Usage:
 *   node scripts/capture-screenshots.mjs            # all targets
 *   node scripts/capture-screenshots.mjs verity     # one target by slug
 *
 * Requires: npm i -D playwright && npx playwright install chromium
 */

import { chromium } from "playwright";
import sharp from "sharp";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const OUT_DIR = path.join(process.cwd(), "public", "work");

// Capture wide, then downscale — gives crisp text without shipping huge files.
const VIEWPORT = { width: 1440, height: 900 };
const SCALE = 2;
const OUTPUT_WIDTH = 1600;

/** slug -> live URL. Slugs must match `Product.slug` in src/lib/content.ts. */
const TARGETS = {
  // AI & LLM platforms
  verity: "https://verity-app.vercel.app",
  cartograph: "https://cartograph-code.vercel.app",
  forge: "https://forge-console-mocha.vercel.app",
  sentinel: "https://sentinel-console-xi.vercel.app",
  "autoresearch-ai": "https://autoresearch-ai-rho.vercel.app",
  lumos: "https://lumos-cyan.vercel.app",

  // Business systems
  coregrid: "https://coregrid.vercel.app",
  stockpilot: "https://stockpilot-tau-virid.vercel.app/",
  counterflow: "https://counterflow-pi.vercel.app/",
  "ledger-core": "https://ledger-core-banking.vercel.app",
  "care-connect": "https://care-connect-emr.vercel.app/",
  "fleet-command": "https://fleet-command-center-eight.vercel.app",

  // Developer infrastructure
  flywheel: "https://flywheel-console.vercel.app",
  "blast-notify": "https://blast-notify-engine.vercel.app",
  "code-sandbox": "https://ai-code-sandbox-one.vercel.app/",
  kubepulse: "https://kubepulse.vercel.app",
  streammind: "https://streammind-topaz.vercel.app/",

  // Vision & edge
  kestrel: "https://kestrel-vision.vercel.app",
  leafwise: "https://leafwise-scan.vercel.app",
  "edge-surveillance": "https://frontend-six-psi-55.vercel.app/",
  kinetix: "https://kinetix-pose.vercel.app",
};

// Some client-rendered apps need longer than the default to paint. Raise this
// per-run rather than slowing every capture down: SETTLE_MS=9000 node ...
const SETTLE_MS = Number(process.env.SETTLE_MS ?? 3_000);

const only = process.argv.slice(2);
const entries = Object.entries(TARGETS).filter(
  ([slug]) => only.length === 0 || only.includes(slug)
);

await mkdir(OUT_DIR, { recursive: true });

const browser = await chromium.launch();
const context = await browser.newContext({
  viewport: VIEWPORT,
  deviceScaleFactor: SCALE,
  // Stop entry animations mid-flight so we capture the settled layout.
  reducedMotion: "reduce",
  colorScheme: "dark",
});

const report = [];

for (const [slug, url] of entries) {
  const page = await context.newPage();
  try {
    await page.goto(url, { waitUntil: "domcontentloaded", timeout: 45_000 });

    // Client-rendered apps need a beat after DOM ready; networkidle can never
    // fire on pages with polling, so treat it as best-effort.
    await page
      .waitForLoadState("networkidle", { timeout: 15_000 })
      .catch(() => {});
    await page.waitForTimeout(SETTLE_MS);

    const png = await page.screenshot({ type: "png" });

    const webp = await sharp(png)
      .resize({ width: OUTPUT_WIDTH, withoutEnlargement: true })
      .webp({ quality: 82 })
      .toBuffer();

    const file = path.join(OUT_DIR, `${slug}.webp`);
    await writeFile(file, webp);

    report.push(`OK      ${slug.padEnd(20)} ${(webp.length / 1024).toFixed(0)} KB`);
  } catch (err) {
    report.push(`FAILED  ${slug.padEnd(20)} ${err.message.split("\n")[0]}`);
  } finally {
    await page.close();
  }
}

await browser.close();

console.log(report.join("\n"));
console.log(
  `\n${report.filter((r) => r.startsWith("OK")).length} / ${entries.length} captured into public/work/`
);
