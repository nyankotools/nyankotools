# Design doc: Adding a new tool

Where to touch and in what order when adding one tool. See [architecture.md](./architecture.md) for the overall structure and [growth.md](./growth.md) for detailed SEO/responsive rules.

## Steps

1. **Write the logic**: in `src/lib/tools/<slug>.ts`, implement pure functions that take input and return a result. No DOM or Astro dependency, so it can be read and tested standalone.

   Example (`char-counter.ts`):

   ```ts
   export interface CharCounterResult {
     characters: number;
     charactersNoSpaces: number;
     words: number;
     lines: number;
   }

   export function countText(text: string): CharCounterResult {
     // ...
   }
   ```

2. **Create the tool's copy dictionary**: in `src/i18n/tools/<slug>.ts`, define all page copy (title/description/headings/labels/placeholders/error messages/glossary, etc.) for both ja and en as `Record<Locale, XxxContent>` (`Locale` is `'ja' | 'en'`).
   - Design `title` / `description` as page-specific meta, separate from the description in `src/data/tools.ts`. Decide the target long-tail search keywords first, then write the copy. Including the privacy pitch is recommended (ja: 「データはブラウザ内で処理され、サーバーには送信されません」 and an equivalent English line). The English copy must not be a literal translation of the Japanese; write it naturally for English-language search.
   - For a sentence containing a link (e.g. an internal link to a related tool), do not split the string and assemble it in JSX. Keep one complete string containing the `<a>` tag (e.g. `introHtml`) and render it with `set:html` in the template (see `src/i18n/tools/base64.ts`). The ja link targets `/tools/...`; the en link targets `/en/tools/...`.

2b. **Create the FAQ dictionary**: in `src/i18n/faq/<slug>.ts`, export `faq: FaqContent` (`Record<Locale, { question, answer }[]>`) with 3-5 items per locale. Write questions specific to this tool (format boundaries, precision limits, common pitfalls); do not pad with site-wide generic questions ("Is it free?"). `Layout.astro` looks the file up by slug and automatically renders the FAQ section (`src/components/Faq.astro`) and the `FAQPage` JSON-LD, so the page component needs no changes. `src/i18n/faq.test.ts` and `e2e/tool-faq.spec.ts` fail if a registered tool has no FAQ. Put `notesHeading` / `notes` (the tool's limits and prerequisites) in the step 2 copy dictionary (`src/i18n/tools/<slug>.ts`), not in the FAQ dictionary, and render them in the page component with `src/components/Notes.astro`. If the notes need HTML (`<code>`, links), split them into separate dictionary fields and either render them with `set:html` (e.g. cron-parser, json-path-tester) or place the text fields before/after a `<code>` written in the page JSX (e.g. jwt-decoder, toml-converter; this split works only for `<code>`, never for a sentence containing a link, which always uses `set:html`; standalone link lists like `relatedLinks` in `CharCounterPage.astro` are the exception), since `Notes.astro` is text-only.

3. **Create the shared page component**: in `src/components/tool-pages/<Slug>Page.astro`, implement the markup and the `<script>` exactly once. It takes `locale: Locale` as a prop and resolves copy from the step 2 dictionary (`src/components/tool-pages/Base64Page.astro` is the reference).

   - Wrap everything in `Layout` and pass the dictionary's `title` / `description`.
   - Exactly one `<h1>`, specific enough to convey the tool name and the problem it solves. Where possible, put internal links to related existing tools in the body.
   - Write static markup (forms, result display) in the Astro template part. Keep it intact at narrow widths (~375px).
   - **File selection UI**: for any tool that takes a file, wrap the `<input type="file">` and its hint text in a dashed-border dropzone (`rounded-lg border-2 border-dashed border-gray-300 p-4 text-center transition-colors dark:border-gray-700`) that also accepts drag & drop. Handle `dragover` / `dragleave` / `drop` on the dropzone (highlight with `border-blue-400 bg-blue-50` while dragging, `preventDefault()` on `dragover` and `drop`), and route both the `change` event and the `drop` event through one shared `handleFile(file)` function. Mention drag & drop in the hint text in both ja and en. References: `ImageToBase64Page.astro`, `EncodingConverterPage.astro`.
   - In the `<script>` tag, import the step 1 functions and update the DOM on `input` events etc. No React/Vue/Svelte islands. `<script>` cannot read frontmatter variables directly, so embed locale-dependent copy (copy-success message, error messages, etc.) in the DOM via `data-*` attributes and read it with `element.dataset.xxx` (see `data-message` on `base64-error`). Keep copy out of the logic layer (`src/lib/tools/<slug>.ts`).

4. **Create the per-locale page files (both ja and en)**: `src/pages/tools/<slug>/index.astro` (ja) and `src/pages/en/tools/<slug>/index.astro` (en). Each is a thin wrapper that calls the step 3 component with only `locale` changed (no markup).

   ```astro
   ---
   import <Slug>Page from '../../../components/tool-pages/<Slug>Page.astro';
   ---
   <<Slug>Page locale="ja" />
   ```

5. **Register in the registry**: add an entry to the `tools` array in `src/data/tools.ts` with `slug` and `translations.ja` / `translations.en` (each `{ name, description, category }`). This is the short copy for the homepage grid and sidebar nav, separate from the step 2 page dictionary. Without registration the tool appears in neither the homepage grid nor the sidebar. `category` drives the homepage search/category filter (`src/lib/home-filter.ts`). Check first whether you can reuse an existing category name and spelling; only introduce a new one if you can't (provide `category` for both ja and en).

6. **Verify**:
   - Run `pnpm dev` and check the sidebar, the homepage, and direct access to both `/tools/<slug>/` and `/en/tools/<slug>/`.
   - `pnpm exec astro check` for type checking.
   - `pnpm run lint` / `pnpm run format` for style.
   - `pnpm build` must pass.
   - Add a Playwright E2E test in `e2e/<slug>.spec.ts` if needed and run it with `pnpm run test:e2e` (see [conventions.md](./conventions.md)). Sidebar navigation, 375px horizontal overflow, and `<h1>` display are verified automatically for ja and en by `e2e/tools-common.spec.ts` once the tool is registered in `src/data/tools.ts`. Don't repeat them in the per-tool spec; write only tool-specific input→output, error display, copy, etc.
   - When implementation is done, follow "レビュー・テストのルール" in [CLAUDE.md](../../CLAUDE.md): ask the independent review agent (`tool-reviewer`) to review first, and only after its completion report ask the independent QA agent (`tool-qa`) to test (lint / type check / build / unit tests / E2E and edge-case coverage). They can also be launched manually with `/tool-review` / `/qa-test`.

Note: this "shared component + dictionary + thin wrapper" structure is the standard pattern, designed so that more languages can be added later (details in "Internationalization" in [growth.md](./growth.md)). All tools follow it; implement new tools this way.

## Checklist

- [ ] Implemented the logic in `src/lib/tools/<slug>.ts` (no UI copy)
- [ ] Implemented the ja/en copy dictionary in `src/i18n/tools/<slug>.ts`
- [ ] Implemented the ja/en FAQ (3-5 tool-specific items) in `src/i18n/faq/<slug>.ts` and `notes` in the copy dictionary
- [ ] Implemented `src/components/tool-pages/<Slug>Page.astro` wrapped in `Layout`, resolving copy from the dictionary
- [ ] Made `src/pages/tools/<slug>/index.astro` (ja) and `src/pages/en/tools/<slug>/index.astro` (en) thin wrappers that only call the shared component
- [ ] Registered `translations.ja` / `translations.en` (including `category`) in `src/data/tools.ts`
- [ ] If the tool takes a file: it uses the dashed-border dropzone and works by both file picker and drag & drop (see step 3)
- [ ] Runs entirely client-side; sends no data to any server
- [ ] Designed page-specific `title` / `description` for ja and en, and exactly one `<h1>` (see [growth.md](./growth.md))
- [ ] Confirmed the layout holds at narrow widths (~375px)
- [ ] `astro check` / `lint` / `format` / `build` pass
- [ ] `pnpm test` passes, including `scripts/check-optimize-deps.test.ts` — if the tool imports a new external npm package (not already used by another tool) into `<script>` or `src/lib`, that test fails until the package is added to `vite.optimizeDeps.include` in `astro.config.mjs`; do that rather than ignoring the failure (see the comment above that list for why — a missing entry causes an E2E-only "504 (Outdated Optimize Dep)" failure in CI)
- [ ] If the tool loads wasm, fetches a file at runtime, or otherwise touches something the CSP restricts (`security.csp` in `astro.config.mjs`): its per-tool e2e spec exercises the real action (e.g. actually run the conversion/encryption and check the output), not just the UI wiring. E2E runs against the built output (port 4322), which enforces the CSP; `astro dev` does not, so a manual check on `pnpm dev` proves nothing about the CSP. If you change the CSP itself, update `e2e/csp-headers.spec.ts` in the same commit.
