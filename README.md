# Somokolon Labs — somokolonlabs.com

Marketing and product site for Somokolon Labs, an AI & software development studio in Dhaka, Bangladesh.

<!-- Badge URL must match the final repo path. Update the org/repo segment if this
     repository is renamed or transferred (currently assumes Somokolon-Labs/somokolonlabs.com). -->
[![CI](https://github.com/Somokolon-Labs/somokolonlabs.com/actions/workflows/ci.yml/badge.svg)](https://github.com/Somokolon-Labs/somokolonlabs.com/actions/workflows/ci.yml)

## What this repo is

The source for the public website at [somokolonlabs.com](https://somokolonlabs.com): studio
positioning, service pages, a product catalogue, and a contact / demo-request flow. It is a
statically rendered Next.js App Router application with a small set of server routes. Site
content lives in `src/lib/content.ts`, so adding a service or product entry propagates to
navigation, listing pages, and detail pages.

## Tech stack

| Layer | Choice |
| --- | --- |
| Framework | Next.js 16.2.10 (App Router) |
| UI | React 19.2.4 |
| Language | TypeScript (strict) |
| Styling | Tailwind CSS v4 (via `@tailwindcss/postcss`) |
| Animation | Framer Motion |
| Icons | lucide-react |
| Linting | ESLint 9 with `eslint-config-next` |
| Package manager | npm |
| Hosting | Vercel |

## Getting started

Prerequisites: Node 22 or newer and npm.

```bash
npm install
cp .env.example .env.local   # then fill in the keys you need
npm run dev
```

The dev server runs at http://localhost:3000.

<!-- TODO(you): commit a .env.example listing the variables below (with empty values) so this
     step works out of the box for new contributors. -->

## Environment variables

All values are optional for local development — the site degrades gracefully without them.

| Variable | Required | Purpose |
| --- | --- | --- |
| `UNSPLASH_ACCESS_KEY` | No | Build-time image sourcing for section imagery. Server-side only; sections fall back to a gradient when absent. |
| `RESEND_API_KEY` | No | Email delivery for the contact form. Without it, submissions are not emailed. |
| `CONTACT_TO_EMAIL` | No | Destination address for contact-form submissions. Defaults to hello@somokolonlabs.com. |
| `NEXT_PUBLIC_SITE_URL` | No | Canonical site origin used for metadata and absolute URLs (e.g. `https://somokolonlabs.com`). |

Never commit `.env.local`; `.env*` is git-ignored.

## Project structure

```
src/
  app/
    layout.tsx              # Root layout, fonts, metadata
    page.tsx                # Home
    globals.css             # Tailwind v4 entry + design tokens
    about/page.tsx
    contact/page.tsx
    services/page.tsx
    services/[slug]/page.tsx
    products/page.tsx
    products/[category]/page.tsx
    products/[category]/[product]/page.tsx
    api/contact/route.ts    # Contact form handler
  components/
    Header.tsx  Footer.tsx  ContactForm.tsx  CTABand.tsx
    LogoMark.tsx  Reveal.tsx
    icons/                  # Icon.tsx, BrandIcons.tsx
  lib/
    content.ts              # Single source of truth for services, products, copy
    unsplash.ts             # Server-side image helper
```

## Available scripts

| Script | What it does |
| --- | --- |
| `npm run dev` | Start the dev server |
| `npm run build` | Production build |
| `npm run start` | Serve the production build |
| `npm run lint` | ESLint across the project |
| `npx tsc --noEmit` | Typecheck only (also run in CI) |

## Docker

The Dockerfile builds a multi-stage production image and runs the Next.js standalone server as
a non-root user. It requires `output: "standalone"` in `next.config.ts`.

```bash
docker build -t somokolon-labs-site .
docker run --rm -p 3000:3000 somokolon-labs-site
```

Or with Compose:

```bash
docker compose up --build
```

## Deployment

Production deploys run through Vercel's Git integration: pushes to `main` deploy to production,
pull requests get preview deployments. Environment variables are managed in the Vercel project
settings, not in this repo. CI (typecheck, lint, build) runs on every push and pull request to
`main`.

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md). Security reports: [SECURITY.md](SECURITY.md).

## License

MIT — see [LICENSE](LICENSE).
