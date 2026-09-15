# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

NyankoTools (`nyankotools.com`) is a growing collection of small, browser-only utility tools (text/data converters, calculators, generators, etc.) for developers and creators, in Japanese. Every tool runs entirely client-side — no backend, no API routes, no data ever sent to a server. This is a deliberate product constraint (privacy pitch + zero hosting cost), not just a current limitation: do not introduce server-side logic.

Users navigate via a persistent sidebar; each tool also has its own indexable URL (`/tools/<slug>/`) for SEO (long-tail keyword search traffic is a primary acquisition channel).

NyankoTools aims for future monetization (ads/affiliate). Organic search traffic and user experience are the foundation for that, so SEO, responsive design, and (eventually) i18n are treated as first-class, not optional polish — see [`growth.md`](.claude/docs/growth.md) for the concrete rules to follow when adding or changing pages.

## 基本原則

- **日本語で応答すること**（コード・コマンド・技術用語を除く）

## 動作確認のルール

- 実装が完了したら、ユーザー自身がブラウザで動作を確認できる状態にすること（`pnpm dev` を起動し、確認用URL（例: http://localhost:4321）を伝える等）。
- 起動した開発サーバーなどのプロセスは、ユーザーから明示的に停止の指示があるまで終了しないこと。

## コミットのルール

- ユーザーから明示的に指示されるまで `git commit` を実行しないこと。実装が完了しても、コミットはせずユーザーの確認・指示を待つこと。

## memo更新のルール

- `memo/実装予定一覧.md` に載っている予定ツールの実装が完了したら、該当行のチェックボックスにチェックを入れ、「実装済み」セクションへ移動すること（`src/data/tools.ts` への登録と合わせて行う）。

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
pnpm test             # Vitest (run once)
pnpm run test:watch    # Vitest (watch mode)
```

Tests use **Vitest**. They target the pure logic in `src/lib/tools/*.ts` (e.g. `src/lib/tools/char-counter.test.ts`), not the Astro pages themselves — no config file is needed since there's no DOM/Astro dependency to set up for these unit tests.

## Architecture

**Stack:** Astro (static output, no SSR adapter) + Tailwind CSS v4 (via `@tailwindcss/vite`, not the older `@astrojs/tailwind` integration) + TypeScript. Deployed to Cloudflare Workers as static assets (see `wrangler.jsonc`), which runs `pnpm build` and serves `dist/` directly — no Cloudflare adapter is needed since there is no server runtime.

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
- Line endings are LF everywhere (enforced via `.gitattributes`: `* text=auto eol=lf`), regardless of the OS used for editing. Windows' `core.autocrlf=true` can still check files out with CRLF locally, but `.gitattributes` normalizes what's actually committed — don't rely on editor/OS defaults.

## Detailed docs

More detailed rules and design docs live under `.claude/docs/`:

- [`architecture.md`](.claude/docs/architecture.md) — stack, directory layout, data flow, static-only principle
- [`conventions.md`](.claude/docs/conventions.md) — coding style, tool-logic structure, commit style
- [`adding-a-tool.md`](.claude/docs/adding-a-tool.md) — step-by-step checklist for adding a new tool
- [`deployment.md`](.claude/docs/deployment.md) — Cloudflare Workers static-asset deploy config
- [`growth.md`](.claude/docs/growth.md) — monetization-driven rules for SEO, responsive design, and future i18n
