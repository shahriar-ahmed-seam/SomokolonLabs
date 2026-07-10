# Somokolon Labs

The official website for **Somokolon Labs** — an AI and software development studio building
LLM systems, web applications, and cloud infrastructure, engineered for production.

🌐 Live site: [somokolonlabs.com](https://somokolonlabs.com) · Deployed on Vercel

## Overview

A modern, corporate marketing site for the studio, built as a fast, statically-rendered
Next.js application. It presents the studio's services, product catalogue, and an engagement
model, with a working contact/demo-request flow.

### Pages

- **Home** — hero, service overview, differentiators, engagement model, and tech stack.
- **About** — the studio's mission, approach, and how it works.
- **Services** — four service areas (AI & LLM, Web & Full-Stack, Cloud & MLOps, QA & System
  Design), each with a dedicated detail page.
- **Products** — a categorised product catalogue (AI Products, Business Software, Developer
  Infrastructure) with individual product pages and a **Request a demo** flow.
- **Contact** — a validated contact form with a demo-request pre-fill.

## Tech Stack

- [Next.js 16](https://nextjs.org/) (App Router)
- [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS v4](https://tailwindcss.com/)
- [Framer Motion](https://www.framer.com/motion/) for restrained scroll animations
- [lucide-react](https://lucide.dev/) icons
- [Unsplash API](https://unsplash.com/developers) for section imagery (server-side)

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Environment variables

Create a `.env.local` file:

```
UNSPLASH_ACCESS_KEY=your_unsplash_access_key
```

The key is read only on the server and is never exposed to the client. If it's absent,
image sections fall back to a gradient placeholder.

## Project structure

```
src/
  app/            # App Router pages (home, about, services, products, contact, api)
  components/     # Header, Footer, ContactForm, CTABand, icons, motion
  lib/
    content.ts    # Single source of truth: services, products, copy
    unsplash.ts   # Server-side image helper
```

All site copy — services, products, categories — lives in `src/lib/content.ts`. Add an entry
there and it automatically appears in the navigation, listing pages, and detail pages.

## Build

```bash
npm run build
npm run start
```

---

© Somokolon Labs. All rights reserved.
