# Monitoring

What is actually monitored, and what still isn't. Kept honest deliberately — an
overstated infrastructure story is worse than a modest accurate one.

## In place

### Demo link health — `scripts/health-check.mjs`

Runs every six hours via `.github/workflows/uptime.yml`, and on any push that
touches the catalogue or the checker. Opens a GitHub issue when a demo breaks,
comments on it if it stays broken, and closes it automatically when everything
recovers.

It checks three things per product, because a `200` on its own proves nothing:

| Verdict | Meaning |
| --- | --- |
| `OK` | Responded, and the page identifies itself as our product |
| `HTTP_4xx` / `HTTP_5xx` | Deployment is erroring |
| `UNREACHABLE` / `TIMEOUT` | DNS gone, or the host is not answering |
| `NOT_FOUND_SHELL` | Vercel reports the deployment does not exist |
| `WRONG_CONTENT` | **200, but the page is not ours.** Usually a released subdomain that somebody else now owns |
| `BOT_CHALLENGED` | Third-party host served a bot challenge. Not a failure, just unverifiable |
| `NO_DEMO` | Product has no demo URL — expected, not an error |

`WRONG_CONTENT` is the reason this exists. One of our demo URLs was reclaimed
after the project was deleted and quietly served an unrelated third-party site
under a `200`, while somokolonlabs.com kept linking to it. A plain uptime pinger
would have reported that as healthy forever.

The checker reads the product list through `scripts/lib/read-catalogue.mjs` rather
than keeping its own copy. An earlier version hardcoded its URLs and drifted
within a day, which is precisely the class of bug it is meant to catch.

### Build and dependency health

- `ci.yml` — typecheck, lint, and build on every push and pull request.
- `dependabot.yml` — weekly npm and Actions updates, minor/patch grouped.
- `lighthouse.yml` — weekly performance, accessibility, and SEO audit of the
  production site.

### Web analytics

Vercel Analytics for page views and traffic. Worth being clear: this is
**analytics, not monitoring**. It tells you what visitors did, not whether a
service is up.

## Not in place

Listed so nobody claims otherwise:

- **Application error tracking.** No Sentry or equivalent, so a runtime exception
  for a real visitor is currently invisible. This is the biggest remaining gap
  and the cheapest to close.
- **Uptime monitoring of somokolonlabs.com itself.** The health check covers the
  product demos; the marketing site is not yet checked.
- **Metrics and dashboards.** No Prometheus or Grafana anywhere. The product
  repos list Prometheus in their stacks, but none of those deployments export
  metrics to a dashboard we watch.
- **Log aggregation.** Vercel's per-deployment logs only, with no retention or
  search beyond what the dashboard offers.
- **Alerting beyond GitHub issues.** A broken demo raises an issue; it does not
  page anyone.

## Verified vs. asserted

- The Dockerfile has **never been built**. Docker is not installed on the
  development machine, so "containerized" is a claim about the file, not a tested
  property. Run `docker build -t somokolon-labs-site .` before repeating it
  anywhere that matters.

## Next steps, cheapest first

1. Add `https://www.somokolonlabs.com` to the health check so the site itself is
   covered, not just the demos.
2. Add Sentry (free tier) for client and server error tracking. Closes the
   largest real gap.
3. Build the Docker image once and confirm it serves, so the containerization
   claim is verified rather than assumed.
4. If a status page is wanted, have the uptime workflow commit its `--json`
   output and render `/status` from it. Only worth it once there are users who
   would look at it.
