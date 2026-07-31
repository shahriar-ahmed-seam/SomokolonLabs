# Contributing

Thanks for helping improve the Somokolon Labs site.

## Run it locally

Node 22 or newer, npm.

```bash
npm install
cp .env.example .env.local   # optional keys, see README
npm run dev
```

## Branches

Branch off `main` using a `type/short-description` name:

- `feat/products-filter`
- `fix/contact-form-validation`
- `chore/bump-eslint`
- `docs/readme-env-table`

## Commits

Conventional Commits:

```
<type>(<optional scope>): <short imperative summary>
```

Types: `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `build`, `ci`, `chore`.

Example: `feat(services): add MLOps detail page`

## CI must pass

Every pull request runs typecheck, lint, and build. Run them locally before pushing:

```bash
npx tsc --noEmit
npm run lint
npm run build
```

A pull request with a failing CI run will not be merged.

## Code style

- TypeScript in strict mode. No `any` where a real type is possible, no `@ts-ignore` without a
  comment explaining why.
- ESLint (`eslint-config-next`) is the source of truth for formatting and lint rules. Do not
  disable rules inline unless there is no alternative, and explain it in a comment.
- Tailwind v4 utility classes for styling; shared tokens live in `src/app/globals.css`.
- Site copy belongs in `src/lib/content.ts`, not hardcoded in components.
- Keep components server-first; add `"use client"` only when a component needs interactivity.

## Pull requests

Fill in the PR template: what changed, type of change, testing done, and screenshots for UI work.
Keep PRs focused — one concern per PR.
