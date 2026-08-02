# Serving product demos from somokolonlabs.com

Right now every "Open live demo" button sends visitors to a `*.vercel.app` URL.
This is how to move them onto our own domain.

## Why not `somokolonlabs.com/cartograph`

A path like that would have to proxy the product app through this site with a
rewrite. It breaks, and it breaks in a way that is tedious to debug:

The proxied HTML still references its own assets at absolute paths — `/_next/...`,
`/api/...`, `/favicon.ico`. The browser resolves those against
`somokolonlabs.com`, not against the product's deployment, so it requests
`somokolonlabs.com/_next/static/...`, hits *this* app, and gets a 404. The page
arrives as unstyled HTML with no JavaScript.

Making it work would require setting `basePath` and `assetPrefix` in all twenty
product apps and redeploying each one. With twenty apps, `/_next/*` also collides
— there is only one such path on this domain and every app wants it.

## Use subdomains instead

`cartograph.somokolonlabs.com` works because the app is at the root of its own
host, so every absolute asset path resolves correctly. Nothing in the product app
changes. This is what everyone does, and it looks equally branded.

## Setup

### 1. One wildcard DNS record

Because we control the whole zone, a single wildcard covers every product. Add
this at the DNS host (nameservers are `ns1`/`ns2.sitechai.com`):

| Type  | Name | Value                  |
| ----- | ---- | ---------------------- |
| CNAME | `*`  | `cname.vercel-dns.com` |

<!-- TODO(you): confirm the DNS panel allows a wildcard CNAME. Some hosts don't;
     if so, add one CNAME per subdomain instead — same value. -->

This does not affect the apex or `www`, which already point at this site.

### 2. Attach the domain in each product's Vercel project

Per product, in the Vercel dashboard: **Project → Settings → Domains → Add**,
then enter `<slug>.somokolonlabs.com`. Vercel issues the certificate
automatically once the wildcard resolves.

Or with the CLI, from each project directory:

```bash
vercel domains add cartograph.somokolonlabs.com
```

Run `node scripts/plan-demo-domains.mjs` to print the full list of subdomains and
the current deployment each one should replace.

### 3. Flip the catalogue over, one product at a time

In `src/lib/products.ts`, set `demoDomain` on the product:

```ts
{
  slug: "cartograph",
  demoUrl: "https://cartograph-code.vercel.app",   // keep as fallback
  demoDomain: "cartograph.somokolonlabs.com",      // now used by the site
}
```

Every link in the UI goes through `demoHref()`, which prefers `demoDomain` and
falls back to `demoUrl`. So you can migrate products individually as each
subdomain goes live — nothing breaks in between, and a subdomain that is not
ready yet simply isn't referenced.

### 4. Verify before committing

```bash
node scripts/check-live.mjs      # confirms each URL still resolves
node scripts/inspect-page.mjs https://cartograph.somokolonlabs.com
```

Check the *content*, not just the status code. A `200` can be a Vercel
placeholder, a login wall, or — as happened with the old Verity deployment — an
entirely unrelated site that took over a released subdomain.

## Priority

`arbiter.somokolonlabs.com` is already set as the Arbiter repo's homepage but has
no DNS record, so it currently resolves to nothing. Fixing that one first also
gets the wildcard in place for everything else.
