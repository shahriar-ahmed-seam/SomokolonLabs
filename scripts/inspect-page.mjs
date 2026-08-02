/**
 * Reports what a page actually rendered — headings, visible text length, and
 * image count. Used to decide whether a dark, low-variance screenshot is a
 * legitimate dark design or an empty shell.
 *
 * Usage: node scripts/inspect-page.mjs <url> [url...]
 */

import { chromium } from "playwright";

const urls = process.argv.slice(2);
if (urls.length === 0) {
  console.error("usage: node scripts/inspect-page.mjs <url> [url...]");
  process.exit(1);
}

const browser = await chromium.launch();
const context = await browser.newContext({
  viewport: { width: 1440, height: 900 },
  reducedMotion: "reduce",
});

for (const url of urls) {
  const page = await context.newPage();
  try {
    await page.goto(url, { waitUntil: "domcontentloaded", timeout: 45_000 });
    await page.waitForLoadState("networkidle", { timeout: 15_000 }).catch(() => {});
    await page.waitForTimeout(6_000);

    const info = await page.evaluate(() => {
      const text = document.body?.innerText?.trim() ?? "";
      return {
        title: document.title,
        headings: Array.from(document.querySelectorAll("h1,h2,h3"))
          .map((h) => h.textContent?.trim())
          .filter(Boolean)
          .slice(0, 6),
        textLength: text.length,
        firstText: text.slice(0, 160).replace(/\s+/g, " "),
        images: document.querySelectorAll("img,svg,canvas").length,
      };
    });

    console.log(`\n=== ${url}`);
    console.log(`title:    ${info.title}`);
    console.log(`headings: ${info.headings.join(" | ") || "(none)"}`);
    console.log(`text len: ${info.textLength}`);
    console.log(`visuals:  ${info.images}`);
    console.log(`preview:  ${info.firstText}`);
  } catch (err) {
    console.log(`\n=== ${url}\nFAILED: ${err.message.split("\n")[0]}`);
  } finally {
    await page.close();
  }
}

await browser.close();
