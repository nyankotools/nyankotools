# Design doc: Architecture

NyankoTools' tech stack and directory structure. See [CLAUDE.md](../../CLAUDE.md) for the overview.

## Stack

| Layer           | Technology                               |
| --------------- | ---------------------------------------- |
| Framework       | Astro (`output: static`, no SSR adapter) |
| Styling         | Tailwind CSS v4 (`@tailwindcss/vite`)    |
| Language        | TypeScript                               |
| Deploy target   | Cloudflare Workers static asset serving  |
| Package manager | pnpm (via Corepack)                      |

On the Cloudflare side, `wrangler.jsonc` sets `pnpm build` as `build.command` and serves `dist/` as static assets. No server runtime is used, so no Cloudflare adapter is needed.

## Directory layout

```
src/
  data/
    tools.ts          # Tool registry ({ slug, category, addedAt, updatedAt, related, flags, translations })
  i18n/
    ui.ts             # Site-wide UI copy (ui.ja / ui.en)
    tools/<slug>.ts   # Per-tool page copy (Record<Locale, XxxContent>)
  layouts/
    Layout.astro       # <head> and sidebar shared by all pages
  components/
    tool-pages/
      <Slug>Page.astro  # Shared per-tool page (markup + <script>), takes a locale prop
  lib/
    tools/
      <slug>.ts         # Per-tool logic (framework-free pure functions)
  pages/
    index.astro         # Homepage (tool grid)
    404.astro
    tools/
      <slug>/
        index.astro     # ja page: thin wrapper around the shared component
    en/                 # en counterparts of the above (same structure)
  styles/
    global.css
```

## Data flow

1. The `tools` array in `src/data/tools.ts` is the single tool registry.
2. `src/layouts/Layout.astro` reads it to build the sidebar navigation.
3. `src/pages/index.astro` builds the homepage tool grid from the same array.
4. Each locale's page (`src/pages/tools/<slug>/index.astro`, `src/pages/en/tools/<slug>/index.astro`) calls the shared component `src/components/tool-pages/<Slug>Page.astro`. The component wraps everything in `Layout` and, in its `<script>` tag, calls the pure functions in `src/lib/tools/<slug>.ts` to update the DOM.

A tool page not registered in `tools.ts` does not appear in navigation (the page itself is still reachable by direct URL). See [adding-a-tool.md](./adding-a-tool.md) for the procedure.

## Client-side-only principle

Every tool runs entirely in the browser and sends no data to a server. This is a product prerequisite (privacy pitch + zero hosting cost), not a temporary limitation. Do not add API routes or server-side processing.

## UI framework policy

Astro emits zero JS by default. To preserve that, do not use React/Vue/Svelte islands for tool interactivity. Consider an island for a specific tool only when plain TypeScript / DOM manipulation makes state management practically impossible.

## Role of Layout.astro

`src/layouts/Layout.astro` is the only place that renders the `<head>` meta tags (title/description/OGP/Twitter Card/favicon) and the sidebar shell. Every page goes through it, passing `title` / `description` / optionally `ogImage` as props (never duplicate `<head>` markup per page). The default `og:image` is `https://nyankotools.com/ogp.png` (the file is `public/ogp.png`).
