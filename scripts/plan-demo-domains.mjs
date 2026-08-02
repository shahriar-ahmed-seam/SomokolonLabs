/**
 * Prints the subdomain plan for moving product demos onto somokolonlabs.com.
 *
 * Reads the catalogue through the shared reader, so the list can never drift
 * from what the site actually shows. See docs/demo-domains.md for the DNS and
 * Vercel steps.
 *
 * Usage: node scripts/plan-demo-domains.mjs
 */

import { readCatalogue } from "./lib/read-catalogue.mjs";

const entries = await readCatalogue();

// A subdomain only makes sense for deployments we control. Vector Vault's
// "demo" is its PyPI page, which is not ours to rehost.
const isOurDeployment = (url) => Boolean(url) && url.includes("vercel.app");

const needsDomain = entries.filter(
  (e) => isOurDeployment(e.demoUrl) && !e.demoDomain
);
const done = entries.filter((e) => e.demoDomain);
const external = entries.filter(
  (e) => e.demoUrl && !isOurDeployment(e.demoUrl) && !e.demoDomain
);

console.log(`Catalogue: ${entries.length} products\n`);

console.log("DNS — one wildcard record covers all of these:");
console.log("  CNAME   *   cname.vercel-dns.com\n");

if (done.length) {
  console.log(`Already on our domain (${done.length}):`);
  for (const e of done) console.log(`  ${e.demoDomain}`);
  console.log();
}

console.log(`Still on *.vercel.app (${needsDomain.length}):`);
const pad = Math.max(...needsDomain.map((e) => e.slug.length)) + 22;
for (const e of needsDomain) {
  const target = `${e.slug}.somokolonlabs.com`;
  console.log(`  ${target.padEnd(pad)} -> replaces ${e.demoUrl}`);
}

console.log("\nVercel CLI, run once per project directory:");
for (const e of needsDomain) {
  console.log(`  vercel domains add ${e.slug}.somokolonlabs.com`);
}

if (external.length) {
  console.log(`\nLeave as-is — not our deployment (${external.length}):`);
  for (const e of external) console.log(`  ${e.name} -> ${e.demoUrl}`);
}

console.log(
  "\nThen set demoDomain on each product in src/lib/products.ts. demoHref()" +
    "\nfalls back to demoUrl, so migrate them one at a time safely."
);
