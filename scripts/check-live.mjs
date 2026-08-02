/**
 * One-off: check which candidate deployment URLs are actually reachable.
 *
 * A dead Vercel project still has a URL in the repo's homepage field, so this
 * separates "deployed" from "was deployed once". Only live ones are worth
 * showcasing — a broken demo link is worse than no demo link.
 *
 * Usage: node scripts/check-live.mjs
 */

const targets = [
  ["arbiter", "https://arbiter.somokolonlabs.com"],
  ["verity", "https://verity-app.vercel.app"],
  ["cartograph", "https://cartograph-code.vercel.app"],
  ["forge", "https://forge-console-mocha.vercel.app"],
  ["autoresearch-ai", "https://autoresearch-ai-rho.vercel.app"],
  ["lumos", "https://lumos-cyan.vercel.app"],
  ["bhasha", "https://bhasha.vercel.app"],
  ["sentinel", "https://sentinel-console-xi.vercel.app"],
  ["deepcut", "https://deepcut.vercel.app"],
  ["ragarena", "https://ragarena.vercel.app"],
  ["coregrid", "https://coregrid.vercel.app"],
  ["ledger-core-banking", "https://ledger-core-banking.vercel.app"],
  ["care-connect-emr", "https://care-connect-emr.vercel.app/"],
  ["fleet-command-center", "https://fleet-command-center-eight.vercel.app"],
  ["stockpilot", "https://stockpilot-tau-virid.vercel.app/"],
  ["helpflow-ticketing", "https://helpflow-ticketing.vercel.app"],
  ["counterflow", "https://counterflow-pi.vercel.app/"],
  ["bikri", "https://bikri-one.vercel.app"],
  ["hilltrack-pulse", "https://frontend-rho-seven-22.vercel.app"],
  ["shonalichain", "https://shonalichain.vercel.app"],
  ["flywheel", "https://flywheel-console.vercel.app"],
  ["kubepulse", "https://kubepulse.vercel.app"],
  ["blast-notify-engine", "https://blast-notify-engine.vercel.app"],
  ["ai-code-sandbox", "https://ai-code-sandbox-one.vercel.app/"],
  ["streammind", "https://streammind-topaz.vercel.app/"],
  ["local-cloud-control-plane", "https://lccp-control-plane.vercel.app"],
  ["edge-surveillance-node", "https://frontend-six-psi-55.vercel.app/"],
  ["kestrel", "https://kestrel-vision.vercel.app"],
  ["leafwise", "https://leafwise-scan.vercel.app"],
  ["kinetix", "https://kinetix-pose.vercel.app"],
  ["polyglot-voice-stream", "https://polyglot-voice-stream.vercel.app"],
  ["sentinel-api", "https://sentinel-api-pi.vercel.app/"],
  ["prohori", "https://prohori-ruby.vercel.app"],
  ["aignis", "https://a-ignis.vercel.app"],
  ["sync-canvas-editor", "https://sync-canvas-editor-web.vercel.app"],
  ["vector-vault-db", "https://pypi.org/project/vector-vault-db/"],
];

const results = [];

await Promise.all(
  targets.map(async ([name, url]) => {
    const started = Date.now();
    try {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 25_000);
      const res = await fetch(url, {
        redirect: "follow",
        signal: controller.signal,
        headers: { "User-Agent": "Mozilla/5.0 (compatible; site-audit)" },
      });
      clearTimeout(timer);
      const body = await res.text();
      const ms = Date.now() - started;

      // Vercel serves a 404 shell for deleted projects; detect the obvious ones.
      const looksDead =
        /DEPLOYMENT_NOT_FOUND|The deployment could not be found|404: NOT_FOUND/i.test(
          body
        );

      results.push({
        name,
        url,
        status: res.status,
        bytes: body.length,
        ms,
        verdict: res.ok && !looksDead ? "LIVE" : looksDead ? "DEAD-SHELL" : "BAD",
      });
    } catch (err) {
      results.push({
        name,
        url,
        status: 0,
        bytes: 0,
        ms: Date.now() - started,
        verdict: `ERROR: ${err.name}`,
      });
    }
  })
);

results.sort((a, b) => a.verdict.localeCompare(b.verdict) || a.name.localeCompare(b.name));

for (const r of results) {
  console.log(
    `${r.verdict.padEnd(12)} ${String(r.status).padEnd(4)} ${String(r.bytes).padEnd(8)} ${r.name}`
  );
}

const live = results.filter((r) => r.verdict === "LIVE");
console.log(`\nLIVE: ${live.length} / ${results.length}`);
console.log(live.map((r) => `${r.name}=${r.url}`).join("\n"));
