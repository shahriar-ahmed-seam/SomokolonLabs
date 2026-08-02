/**
 * Sanity-checks captured screenshots so we never ship a blank card.
 *
 * A page that was still loading, or that failed to render, produces a large but
 * almost uniform image. Standard deviation across channels catches that far more
 * reliably than file size does — a flat dark spinner screen compresses small,
 * but so does a legitimately minimal design, so we look at pixel variance.
 *
 * Usage: node scripts/verify-screenshots.mjs
 */

import sharp from "sharp";
import { readdir } from "node:fs/promises";
import path from "node:path";

const DIR = path.join(process.cwd(), "public", "work");

// Below this, the image is almost certainly a spinner, an error page, or blank.
const SUSPECT_STDDEV = 26;

const files = (await readdir(DIR)).filter((f) => f.endsWith(".webp")).sort();
const rows = [];

for (const file of files) {
  const full = path.join(DIR, file);
  const img = sharp(full);
  const meta = await img.metadata();
  const stats = await img.stats();

  const meanStdDev =
    stats.channels.reduce((sum, c) => sum + c.stdev, 0) / stats.channels.length;
  const meanBrightness =
    stats.channels.reduce((sum, c) => sum + c.mean, 0) / stats.channels.length;

  rows.push({
    file,
    dims: `${meta.width}x${meta.height}`,
    stddev: meanStdDev.toFixed(1),
    brightness: meanBrightness.toFixed(0),
    verdict: meanStdDev < SUSPECT_STDDEV ? "SUSPECT" : "ok",
  });
}

const width = Math.max(...rows.map((r) => r.file.length));
for (const r of rows) {
  console.log(
    `${r.verdict.padEnd(8)} ${r.file.padEnd(width)}  ${r.dims.padEnd(11)} stddev=${r.stddev.padStart(6)}  brightness=${r.brightness.padStart(3)}`
  );
}

const suspect = rows.filter((r) => r.verdict === "SUSPECT");
console.log(
  `\n${rows.length} images, ${suspect.length} suspect${suspect.length ? ": " + suspect.map((s) => s.file).join(", ") : ""}`
);
