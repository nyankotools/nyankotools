# Development rules: growth strategy for monetization (SEO, responsive, i18n)

NyankoTools aims to monetize in the future (ads, affiliate, etc.). Monetization depends on sustained organic search traffic and good UX, so keep the following in mind whenever adding new tools or pages. See [CLAUDE.md](../../CLAUDE.md) for the project-wide premises.

## SEO

- **Design `title` / `description` per page.** The `description` in `src/data/tools.ts` is the short blurb for the homepage/sidebar. Give the tool page's dictionary `description` (ToolShell passes it to `Layout`) a separate text of proper meta-description length and wording (don't reuse it).
- **Write down the long-tail keywords first.** Before adding a tool, decide which search terms should bring traffic (e.g. 「JSON 整形 オンライン 無料」) and reflect them in `title` / `description` / body headings. Don't rely on overly generic terms alone.
- **Heading structure.** Exactly one `<h1>` per page, specific about the tool name or the problem it solves. Supplementing usage and cautions under `<h2>` and below adds substance and helps SEO.
- **Internal links.** Link to related existing tools in the page body to improve crawlability and user circulation. When adding a tool, find and link at least one related existing tool.
- **OGP image.** The default `og:image` is `https://nyankotools.com/ogp.png` (the file is `public/ogp.png`). If a tool-specific OGP image is available, pass it via the `ogImage` prop. Keeping the shared image is fine, but the referenced image file must exist.
- **Sitemap / robots.txt.** `site` in `astro.config.mjs` is already set, so consider generating a sitemap with `@astrojs/sitemap` and maintaining `public/robots.txt` (propose it if not yet in place).
- **Structured data (JSON-LD).** `Layout.astro` emits `SoftwareApplication` and `BreadcrumbList` for tool pages, and `FAQPage` automatically when `src/i18n/faq/<slug>.ts` exists (every tool must have one; see [adding-a-tool.md](./adding-a-tool.md)).
- **Body content depth.** Every tool page should carry substantive body copy: intro (with an internal link), notes on limits, a tool-specific FAQ, and a glossary where jargon is used. Avoid thin, template-like pages.

## Responsive

- Write Tailwind breakpoints mobile-first (follow the existing use of `sm:` `md:`; the sidebar/hamburger menu in `src/layouts/Layout.astro` is the model).
- When adding UI, confirm there is no layout breakage or unintended horizontal scroll at narrow widths (~375px).
- Tap targets (buttons, links, checkboxes, etc.) need enough tap area (guideline: at least 44px square).
- Check on a real viewport with `pnpm dev`, varying the browser width. Horizontal scroll at 375px is verified for all tools (ja and en) automatically by `e2e/tools-common.spec.ts` from the `src/data/tools.ts` registry, so don't write it in per-tool E2E.

## Internationalization

- Japanese (`ja`, the default locale) and English (`en`) are supported. Uses Astro's built-in `i18n` routing, with `astro.config.mjs` setting `defaultLocale: 'ja'` / `locales: ['ja', 'en']` / `routing.prefixDefaultLocale: false`. URLs: ja has no prefix (`/tools/<slug>/`), en lives under `/en/` (`/en/tools/<slug>/`).
- **Routing is per-locale directories.** `src/pages/tools/<slug>/index.astro` (ja) and `src/pages/en/tools/<slug>/index.astro` (en) map to the real URLs (the structure Astro's i18n routing assumes). Static pages such as the homepage and terms of service likewise get counterparts under `src/pages/en/`. Adding a third or later language only requires adding a locale-code directory.
- **Page content is consolidated in one place per tool via "shared component + thin per-locale route files" (a policy for the premise that supported languages will grow).** Duplicating a whole `.astro` file per language means every markup change must be applied by hand once per language, so cost grows linearly with language count. The standard structure is therefore as follows (`base64` is the reference = `src/i18n/tools/base64.ts` + `src/components/tool-pages/Base64Page.astro` + `src/pages/tools/base64/index.astro` + `src/pages/en/tools/base64/index.astro`). All existing tools have been migrated to it.
  - `src/i18n/tools/<slug>.ts`: holds the tool's page-specific copy (title/description/headings/labels/placeholders/error messages/glossary, etc.) as a `Record<Locale, XxxContent>` dictionary. Keep it per sentence. For a sentence containing a link, don't split the string and assemble it in JSX; keep one complete string containing the `<a>` tag, like `introHtml`, and render it with `set:html` in the template (so it doesn't break when word order or link position differs by language).
  - `src/components/tool-pages/<Slug>Page.astro`: the shared component holding the markup and `<script>` exactly once. Takes `locale` as a prop and resolves copy from the `src/i18n/tools/<slug>.ts` dictionary. When the `<script>` needs locale-specific copy (copy success/failure messages, etc.), it cannot be passed from frontmatter directly, so embed it in the DOM via `data-*` attributes and read it in the client-side script.
  - `src/pages/tools/<slug>/index.astro` and `src/pages/en/tools/<slug>/index.astro` are thin wrappers that only call the shared component with a different `locale`.
  - Implement new tools with this structure (details in [adding-a-tool.md](./adding-a-tool.md)).
- **Site-wide UI copy**: copy used across tools (sidebar, footer, homepage headings, etc.) is consolidated in the `ui.ja` / `ui.en` dictionaries in `src/i18n/ui.ts` and referenced via the `t()` function returned by `useTranslations(locale)` (a separate dictionary from the per-tool `src/i18n/tools/<slug>.ts`).
- **Tool name and description (for home/sidebar)**: `Tool.translations` in `src/data/tools.ts` holds both locales as `{ ja: { name, description, keywords }, en: { name, description, keywords } }`; the category is a top-level ID (`Tool.category`) whose display names come from `categories`. The array resolved by `getLocalizedTools(locale)` (with `categoryId` and the localized `category` label) drives the homepage and sidebar display (the tool page body's copy is held separately by `src/i18n/tools/<slug>.ts` above).
- Keep the logic functions in `src/lib/tools/<slug>.ts` free of UI copy (consistent with the existing "framework-free pure functions" policy). If copy such as error messages is unavoidable, put it in the `src/i18n/tools/<slug>.ts` dictionary and keep the logic layer independent of copy.
- **SEO meta**: `src/layouts/Layout.astro` emits the following per locale automatically; no per-page work is needed.
  - `<html lang={lang}>`
  - Self-referencing `canonical` (don't collapse locale versions into one URL)
  - `hreflang` (ja⇔en cross-references + self-reference + `x-default` = ja; not emitted on `noindex` pages)
  - `og:locale` / `og:locale:alternate` (`ja_JP` / `en_US`)
  - JSON-LD `inLanguage`
  - The `i18n` option of `@astrojs/sitemap` in `astro.config.mjs` also emits hreflang alternates in the sitemap.
- No automatic redirects based on the browser's `Accept-Language` or IP geolocation (Google discourages this). Users switch locale explicitly via the language switcher in the sidebar/header.
