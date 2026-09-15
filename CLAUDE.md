# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

NyankoTools (`nyankotools.com`) is a growing collection of small, browser-only utility tools (text/data converters, calculators, generators, etc.) for developers and creators, in Japanese. Every tool runs entirely client-side — no backend, no API routes, no data ever sent to a server. This is a deliberate product constraint (privacy pitch + zero hosting cost), not just a current limitation: do not introduce server-side logic.

Users navigate via a persistent sidebar; each tool also has its own indexable URL (`/tools/<slug>/`) for SEO (long-tail keyword search traffic is a primary acquisition channel).

## Commands

Package manager is **pnpm** (via Corepack).

```
pnpm install        # install dependencies
pnpm dev            # start dev server (http://localhost:4321)
pnpm build           # production build to dist/ (static output)
pnpm preview          # preview the production build locally
pnpm exec astro check # type-check .astro/.ts files
pnpm run lint          # ESLint
pnpm run format        # Prettier --write
```

There is no test suite yet. When adding one, prefer testing the pure logic in `src/lib/tools/*.ts` directly rather than the Astro pages.

## Architecture

**Stack:** Astro (static output, no SSR adapter) + Tailwind CSS v4 (via `@tailwindcss/vite`, not the older `@astrojs/tailwind` integration) + TypeScript. Deployed to Cloudflare Pages, which builds `pnpm build` and serves `dist/` directly — no Cloudflare adapter is needed since there is no server runtime.

**Adding a new tool** touches two places:

1. `src/pages/tools/<slug>/index.astro` — the page. Wrap it in `<Layout title=... description=...>` and put interactive logic in a `<script>` tag that imports from `src/lib/tools/<slug>.ts`.
2. `src/data/tools.ts` — register `{ slug, name, description }` here. This single registry drives both the homepage tool grid (`src/pages/index.astro`) and the sidebar nav (`src/layouts/Layout.astro`); a tool page that isn't registered here won't appear in navigation.

**Tool logic stays framework-free.** Each tool's actual behavior (parsing, converting, calculating) lives in `src/lib/tools/<slug>.ts` as plain, testable TypeScript functions, imported by that tool's page-level `<script>`. Do not reach for React/Vue/Svelte islands for a tool's interactivity — Astro ships zero JS by default and this keeps it that way; only introduce a UI framework island if a specific tool's state management genuinely can't be done reasonably in vanilla TS/DOM.

**`src/layouts/Layout.astro`** is the only place that renders `<head>` meta tags (title/description/OGP/Twitter Card/favicon) and the sidebar shell. All pages must go through it so SEO/OGP metadata stays consistent — pass `title`, `description`, and optionally `ogImage` as props rather than duplicating `<head>` markup per page.

Note: `og:image` currently points at `https://nyankotools.com/ogp.png`, which doesn't exist yet in `public/`.

## Conventions

- UI copy, commit messages, and code comments are in Japanese, matching existing history.
- ESLint (`eslint.config.js`, flat config: `typescript-eslint` + `eslint-plugin-astro` + `eslint-config-prettier`) and Prettier (`.prettierrc.json`, with `prettier-plugin-astro`) enforce style. Run both before committing.
- `typescript` is pinned to `6.0.3` (not the newer `7.x` line) because `astro check` and `typescript-eslint` do not yet support TypeScript 7's native/Go-based compiler API — don't bump past the 6.x line without checking that both tools have caught up.
- `.claude/settings.json` currently auto-allows only file read/edit tools; shell commands (git, pnpm, etc.) intentionally still prompt for confirmation each time — this was an explicit choice, not an oversight.
