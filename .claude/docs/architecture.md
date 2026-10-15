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
    tools.ts          # Tool registry ({ slug, category, addedAt, updatedAt, related, flags, translations }) + categories
    updates.ts        # Release notes shown on /updates (a new tool's addedAt must match its first entry)
  i18n/
    ui.ts             # Site-wide UI copy (ui.ja / ui.en)
    shortcuts.ts      # Keyboard shortcut list copy (/shortcuts)
    faq.ts            # Site FAQ (/faq)
    faq/<slug>.ts     # Per-tool FAQ (3-5 items; also drives FAQPage JSON-LD)
    tools/<slug>.ts   # Per-tool page copy (Record<Locale, XxxContent>)
  layouts/
    Layout.astro       # <head>, sidebar shell, GA4 tag, JSON-LD shared by all pages
  components/
    ToolShell.astro    # Tool page skeleton (Layout + h1/intro/badge/HowTo/Notes/Glossary/Faq)
    CategoryPage.astro # Category landing page (/tools/category/<id>/, ja/en)
    HowTo.astro / Notes.astro / Glossary.astro / Faq.astro  # Sections rendered by ToolShell
    FavoriteToggle.astro / ShareButtons.astro               # Favorite star / share buttons
    ShortcutsPage.astro / UpdatesList.astro                 # /shortcuts and /updates bodies
    tool-pages/
      <Slug>Page.astro  # Shared per-tool page (markup + <script>), takes a locale prop
  lib/
    tools/
      <slug>.ts         # Per-tool logic (framework-free pure functions)
    clipboard.ts        # copyText (Clipboard API + execCommand fallback)
    download.ts         # downloadBlob (click-to-save download)
    file-drop.ts        # enableFileDrop (drag & drop onto a file input)
    analytics.ts        # trackEvent (GA4 copy/download/exception; tool slug only, never user input)
    error-boundary.ts   # Error toast + GA4 exception for uncaught errors
    shortcuts.ts        # Ctrl/Cmd+Enter (run), Alt+Shift+C (copy)
    command-palette.ts  # Ctrl/Cmd+K tool search dialog (rankTools + init)
    home-filter.ts      # Homepage search / category filter
    favorites.ts        # Favorite tools (localStorage); favorites-ui.ts is its UI wiring
    layout-nav.ts       # Sidebar open/close (initSidebar)
    back-to-top.ts      # Back-to-top button visibility
    share-buttons.ts    # Share buttons wiring
    contact-form.ts     # /contact form (builds a mailto: link, no server)
    query-init.ts       # ?text= initial value for opted-in (data-query-target) non-sensitive tools
    input-helpers.ts    # Paste / Clear / Sample / char count bar under data-query-target textareas (data-sample, data-no-count)
    input-persist.ts    # sessionStorage save/restore of editable text/number inputs (skipped for sensitive tools, data-no-persist)
    input-scheduler.ts  # onTextInput: immediate below 20k chars, debounced above (use instead of addEventListener('input') for text areas)
    comma-number-input.ts # attachCommaFormatting / stripCommas for amount inputs
    format-template.ts  # fill / count: fill dictionary format templates ({name} placeholders)
    paren.ts            # parenthesize: locale-aware parenthetical (full-width in ja)
    random.ts           # Shared crypto-based random helpers (randomInt can be stubbed in tests)
    regex-runner.ts     # Runs regex-tester matching in a Web Worker with a timeout
    print.ts            # Light theme while printing (print CSS lives in global.css + print:hidden classes)
  pages/
    index.astro         # Homepage (tool grid)
    404.astro
    about/ contact/ faq/ privacy-policy/ terms-of-service/ shortcuts/ updates/  # Static pages (index.astro each)
    tools/
      <slug>/
        index.astro     # ja page: thin wrapper around the shared component
      category/[category].astro  # Category landing pages
    en/                 # en counterparts of the above (same structure)
  styles/
    global.css
public/
  _headers              # HTTP headers (HSTS, frame-ancestors, Permissions-Policy, asset cache)
  robots.txt            # Points to sitemap-index.xml
  theme-init.js / sidebar-category-init.js  # Early-init scripts (avoid theme/sidebar flash)
e2e/                    # Playwright specs (tools-common.spec.ts is generated from the registry)
scripts/
  qa.mjs                # pnpm qa: lint -> test -> check -> build -> scoped E2E
  bundle-budget.mjs     # pnpm run check:bundle: per-page gzip JS budget
```

## Data flow

1. The `tools` array in `src/data/tools.ts` is the single tool registry.
2. `src/layouts/Layout.astro` reads it to build the sidebar navigation.
3. `src/pages/index.astro` builds the homepage tool grid from the same array.
4. Each locale's page (`src/pages/tools/<slug>/index.astro`, `src/pages/en/tools/<slug>/index.astro`) calls the shared component `src/components/tool-pages/<Slug>Page.astro`. The component wraps the tool body in `ToolShell` (which wraps `Layout` and renders the h1, intro, how-to, notes and glossary from the dictionary) and, in its `<script>` tag, calls the pure functions in `src/lib/tools/<slug>.ts` to update the DOM.

A tool page not registered in `tools.ts` does not appear in navigation (the page itself is still reachable by direct URL). See [adding-a-tool.md](./adding-a-tool.md) for the procedure.

## Client-side-only principle

Every tool runs entirely in the browser and sends no data to a server. This is a product prerequisite (privacy pitch + zero hosting cost), not a temporary limitation. Do not add API routes or server-side processing.

## UI framework policy

Astro emits zero JS by default. To preserve that, do not use React/Vue/Svelte islands for tool interactivity. Consider an island for a specific tool only when plain TypeScript / DOM manipulation makes state management practically impossible.

## Role of Layout.astro

`src/layouts/Layout.astro` is the only place that renders the `<head>` meta tags (title/description/OGP/Twitter Card/favicon) and the sidebar shell. Every page goes through it, passing `title` / `description` / optionally `ogImage` as props (never duplicate `<head>` markup per page). The default `og:image` is `https://nyankotools.com/ogp.png` (the file is `public/ogp.png`).
