/**
 * Reads the product catalogue out of src/lib/products.ts.
 *
 * Scripts must never keep their own copy of the product list. An earlier version
 * of the health check hardcoded its URLs and immediately drifted from the site —
 * which is exactly the failure mode the health check exists to catch.
 *
 * products.ts is TypeScript, so rather than add a build step for the scripts we
 * parse the handful of fields we need.
 */

import { readFile } from "node:fs/promises";
import path from "node:path";

export async function readCatalogue(cwd = process.cwd()) {
  const source = await readFile(
    path.join(cwd, "src", "lib", "products.ts"),
    "utf8"
  );

  // Scope to the products array — productCategories also has `slug` keys.
  const start = source.indexOf("export const products");
  if (start === -1) {
    throw new Error("could not locate the products array in src/lib/products.ts");
  }

  const products = [];
  const blocks = source.slice(start).split(/\n\s*\{\s*\n\s*slug:/).slice(1);

  for (const block of blocks) {
    const slug = block.match(/^\s*"([^"]+)"/)?.[1];
    const name = block.match(/\n\s*name:\s*"([^"]+)"/)?.[1];
    if (!slug || !name) continue;

    products.push({
      slug,
      name,
      category: block.match(/\n\s*category:\s*"([^"]+)"/)?.[1],
      demoUrl: block.match(/\n\s*demoUrl:\s*"([^"]+)"/)?.[1],
      demoDomain: block.match(/\n\s*demoDomain:\s*"([^"]+)"/)?.[1],
      screenshot: block.match(/\n\s*screenshot:\s*"([^"]+)"/)?.[1],
    });
  }

  if (products.length === 0) {
    throw new Error("parsed zero products — the parser is out of date");
  }

  return products;
}

/** Mirrors demoHref() in src/lib/products.ts. */
export function demoHref(product) {
  if (product.demoDomain) return `https://${product.demoDomain}`;
  return product.demoUrl;
}

/** Loose match: strip everything but letters and digits, then compare. */
export function normalise(value) {
  return value.toLowerCase().replace(/[^a-z0-9]/g, "");
}
