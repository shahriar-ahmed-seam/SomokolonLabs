# Somokolon Labs — somokolonlabs.com

Marketing and product site for Somokolon Labs, an AI & software development studio in Dhaka, Bangladesh.

<!-- Badge URL must match the repo path. Update it if the repository is transferred
     to an organisation (see github-org-profile/SETUP.md). -->
[![CI](https://github.com/shahriar-ahmed-seam/SomokolonLabs/actions/workflows/ci.yml/badge.svg)](https://github.com/shahriar-ahmed-seam/SomokolonLabs/actions/workflows/ci.yml)

## What this repo is

The source for the public website at [somokolonlabs.com](https://somokolonlabs.com): studio
positioning, service pages, a product catalogue with live demos, engineering notes, a contact /
demo-request flow, and a small AI assistant. It is a mostly static Next.js App Router
application with two server routes. Site content lives in `src/lib/content.ts` (products in
`src/lib/products.ts`), so adding a service or product entry propagates to navigation, listing
pages, detail pages, and the assistant's knowledge.

## Tech stack

| Layer | Choice |
| --- | --- |
| Framework | Next.js 16 (App Router) |
| UI | React 19 |
| Language | TypeScript (strict) |
| Styling | Tailwind CSS v4 (via `@tailwindcss/postcss`) |
| Animation | Framer Motion 12 |
| Icons | lucide-react, simple-icons (tech logos, resolved server-side) |
| Assistant | DeepSeek (OpenAI-compatible API), streamed through `/api/chat` |
| Contact email | Resend |
| Tooling | ESLint 9, Playwright (screenshot and health-check scripts), ffmpeg (video script) |
| Hosting | Vercel |

## Getting started

Prerequisites: Node 22 or newer and npm. `ffmpeg` only if you process background videos.

```bash
npm install
cp .env.example .env.local   # then fill in the keys you need
npm run dev
```

The dev server runs at http://localhost:3000.

## Environment variables

All values are optional for local development; the site degrades gracefully without them.
`.env.example` documents each one. Set production values in the Vercel project settings.

| Variable | Needed in production | Purpose |
| --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Recommended | Canonical origin for metadata, sitemap and absolute URLs. Falls back to Vercel's production URL. |
| `RESEND_API_KEY` | Yes, for the contact form | Email delivery. Without it the form returns 503 in production instead of dropping enquiries. |
| `CONTACT_FROM_EMAIL` | Yes, with Resend | Sender address on a domain verified in Resend. |
| `CONTACT_TO_EMAIL` | No | Where enquiries land. Defaults to hello@somokolonlabs.com. |
| `DEEPSEEK_API_KEY` | Yes, for the assistant | Without it the chat says it's offline. |
| `DEEPSEEK_BASE_URL`, `DEEPSEEK_MODEL` | No | Default to `https://api.deepseek.com` and `deepseek-chat`. |
| `CHAT_DAILY_CAP` | No | Assistant replies per day across the whole site (default 1500). Bounds the bill. |
| `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN` | Strongly recommended | Shared counters so the chat rate limits hold across serverless instances. `KV_REST_API_URL` / `KV_REST_API_TOKEN` (Vercel Marketplace) also work. |
| `GOOGLE_SITE_VERIFICATION` | When verifying | Search Console "HTML tag" token. |

Never commit `.env.local`; `.env*` is git-ignored except `.env.example`.

## Project structure

```
src/
  app/
    layout.tsx               # Root layout: fonts, metadata, header/footer, chat
    page.tsx                 # Home
    globals.css              # Tailwind v4 entry + design tokens
    about/  capabilities/  contact/  insights/  privacy/  terms/
    services/  services/[slug]/
    products/  products/[category]/  products/[category]/[product]/
    api/contact/route.ts     # Contact form → Resend
    api/chat/route.ts        # Assistant → DeepSeek (rate-limited, daily cap)
  components/
    Header.tsx  Footer.tsx  Logo.tsx  LogoMark.tsx
    ProductCard.tsx  ProductGrid.tsx  CropMarks.tsx  ContactForm.tsx
    ChatWidget.tsx  LegalPage.tsx
    site/                    # Page sections and shared page parts
      Hero, Process, Work, Services, Industries, TechTabs, FinalCTA, PageHero, …
      Scene.tsx              # Background footage (video, or gradient fallback)
      scene-videos.json      # Which clips exist; written by `npm run video`
    icons/                   # Icon.tsx, BrandIcons.tsx
  lib/
    content.ts               # Services, copy, contact details
    products.ts              # Product catalogue
    insights.ts              # Engineering notes
    chat-context.ts          # Assistant system prompt, built from the content
    rate-limit.ts            # Shared (Upstash) / in-memory rate limiting
public/
  work/                      # Product screenshots
  video/                     # Encoded background clips and posters
docs/                        # Demo domains, monitoring, video brief
scripts/                     # Screenshots, health checks, video processing
```

## Available scripts

| Script | What it does |
| --- | --- |
| `npm run dev` | Start the dev server |
| `npm run build` | Production build |
| `npm run start` | Serve the production build |
| `npm run lint` | ESLint across the project |
| `npm run typecheck` | Typecheck only (also run in CI) |
| `npm run video -- <scene> <file> [--loop] [--portrait] [--darken=0.3]` | Encode a background clip into `public/video/` and register it. See `scripts/prepare-video.mjs` and `docs/video-prompts.md`. |
| `node scripts/capture-screenshots.mjs [slug]` | Recapture product screenshots into `public/work/` |

## Background videos

Page heroes and the home page's "How we work" section play short looping clips. Raw
downloads go in `video-src/` (git-ignored), then `npm run video` strips audio, scales and crops
to 1920×1080 (or 1080×1920 with `--portrait`), makes the loop seamless, writes WebM + MP4 +
poster to `public/video/`, and registers the scene in `scene-videos.json`. Clips only download
once they're on screen and never play under reduced motion.

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
