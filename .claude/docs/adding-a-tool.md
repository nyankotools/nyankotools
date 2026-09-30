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

2b. **Create the FAQ dictionary**: in `src/i18n/faq/<slug>.ts`, export `faq: FaqContent` (`Record<Locale, { question, answer }[]>`) with 3-5 items per locale. Write questions specific to this tool (format boundaries, precision limits, common pitfalls); do not pad with site-wide generic questions ("Is it free?"). `Layout.astro` looks the file up by slug and automatically renders the FAQ section (`src/components/Faq.astro`) and the `FAQPage` JSON-LD, so the page component needs no changes. `src/i18n/faq.test.ts` and `e2e/tool-faq.spec.ts` fail if a registered tool has no FAQ. For tools that need a multi-step operation (choose a mode, upload a file, adjust options, download), also add `howToHeading` / `howToSteps` (3-4 short steps that match the UI labels; ja heading 使い方, en heading How to use) to the copy dictionary and render them with `src/components/HowTo.astro` just before the notes (if the notes live inside the tool UI, as in pdf-compressor and pdf-password-protector, place it just before the glossary). Skip it for tools whose UI is self-evident (type text, see the result), and add the slug to `e2e/how-to.spec.ts` when you add it. Put `notesHeading` / `notes` (the tool's limits and prerequisites) in the step 2 copy dictionary (`src/i18n/tools/<slug>.ts`), not in the FAQ dictionary, and render them in the page component with `src/components/Notes.astro`. If the notes need HTML (`<code>`, links), split them into separate dictionary fields and either render them with `set:html` (e.g. cron-parser, json-path-tester) or place the text fields before/after a `<code>` written in the page JSX (e.g. jwt-decoder, toml-converter; this split works only for `<code>`, never for a sentence containing a link, which always uses `set:html`; standalone link lists like `relatedLinks` in `CharCounterPage.astro` are the exception), since `Notes.astro` is text-only.

3. **Create the shared page component**: in `src/components/tool-pages/<Slug>Page.astro`, implement the markup and the `<script>` exactly once. It takes `locale: Locale` as a prop and resolves copy from the step 2 dictionary (`src/components/tool-pages/Base64Page.astro` is the reference).

   - Wrap the tool body in `<ToolShell t={t}>` (`src/components/ToolShell.astro`), which wraps `Layout` with the dictionary's `title` / `description`. ToolShell renders the `<h1>` (`h1`), the intro (`introHtml`), then the tool body (default slot), then the how-to (`howToHeading` + `howToSteps`), notes (`notesHeading` + `notes`), and glossary (`glossaryHeading` + `glossaryTerms`) sections, then `<slot name="after">` (e.g. `<Fragment slot="after">` for a related-links block that must come last). Do **not** write the h1 / intro / HowTo / Notes / Glossary in the page. Each section is rendered only when **both** its heading and body keys exist, so a misspelled key (e.g. `noteHeading`) silently drops the section. If a page needs custom notes markup, keep `notes` out of the dictionary and render it in the body.
   - The `<h1>` (from `h1`) must be specific enough to convey the tool name and the problem it solves. Where possible, put internal links to related existing tools in the body.
   - Use the UI primitives in `src/styles/global.css` (`ui-label`, `ui-btn`, `ui-btn-primary`, `ui-input`, `ui-error`, `ui-seg` / `ui-seg-btn`, `ui-dropzone`, `ui-file`, `ui-check`) instead of repeating long Tailwind class lists; add sizing (`h-11 w-24`) and background colors as utilities on the element.
   - Use the shared helpers: `copyText(text)` from `src/lib/clipboard.ts` for copying (returns whether it succeeded; show the result yourself), and `downloadBlob(blob, filename)` from `src/lib/download.ts` for click-to-save downloads. Do not call `navigator.clipboard.writeText` or build `<a download>` by hand.
   - Write static markup (forms, result display) in the Astro template part. Keep it intact at narrow widths (~375px).
   - **Site-wide features you get for free** (no per-page code): the "runs in your browser" badge (rendered by ToolShell), copy/download analytics (`copyText` / `downloadBlob` send only the event name and the tool slug), the error toast, the `Ctrl/⌘+K` command palette, and shortcuts (`Ctrl/⌘+Enter` clicks the first visible `.ui-btn-primary` or `*-generate-button`; `Alt+Shift+C` clicks the first visible button whose id contains `copy`). Name the copy button `<prefix>-copy-button` so the shortcut finds it.
   - **URL query initial value (`?text=`)**: add `data-query-target="<param>"` (the attribute value is the query parameter name; use `text` for the main input, other names for additional inputs) to a text input/textarea to let `?<param>=...` prefill it (an `input` event is dispatched, then that parameter is removed from the URL). Opt in only for non-`sensitive` tools (`sensitive` tools are ignored at runtime even if the attribute is present). If you use a parameter name other than `text`, also add it to the GA4 `page_location` exclusion in `Layout.astro`. **Never opt in a tool that renders its input as HTML** (`innerHTML` / `set:html` / DOMPurify output, e.g. markdown-preview): a crafted link could overlay the whole page with fake content using site CSS classes.
   - **Input helpers / persistence / large input**: a `data-query-target` textarea automatically gets Paste / Clear / char count; add `data-sample={t.sampleText}` (a `sampleText` dictionary field per locale) to show a "Insert sample" button, or `data-no-count` if the tool already shows counts. Editable inputs with an `id` (text/number/color/range/checkbox/radio/select) are snapshotted to `sessionStorage` on every `input`/`change` and restored after reload/language switch (except `sensitive` tools; add `data-no-persist` to opt a field out, e.g. anything that may hold secrets like the QR input). Only fields whose value changed from the page-load value are saved, so JS-set defaults such as "now" are not frozen. Radios without an `id` are keyed by `name#value`, checkboxes by `data-option`. Restore runs on DOMContentLoaded and dispatches `input` and `change` (the last-edited field last, so linked fields follow it), so the tool must recompute in an `input` or `change` listener. For text areas that feed heavy processing, register with `onTextInput(el, handler)` from `src/lib/input-scheduler.ts` instead of `addEventListener('input', …)`.
   - **File selection UI**: for any tool that takes a file, wrap the `<input type="file" class="ui-file">` and its hint text in a `ui-dropzone` element and call `enableFileDrop(dropzone, fileInput)` (`src/lib/file-drop.ts`). Drops are written to `input.files` and a `change` event is dispatched, so handle only the `change` event (take the file(s), then reset `fileInput.value = ''` so the same file can be picked again). Mention drag & drop in the hint text in both ja and en. References: `ImageToBase64Page.astro`, `EncodingConverterPage.astro`.
   - In the `<script>` tag, import the step 1 functions and update the DOM on `input` events etc. No React/Vue/Svelte islands. `<script>` cannot read frontmatter variables directly, so embed locale-dependent copy (copy-success message, error messages, etc.) in the DOM via `data-*` attributes and read it with `element.dataset.xxx` (see `data-message` on `base64-error`). Keep copy out of the logic layer (`src/lib/tools/<slug>.ts`).

4. **Create the per-locale page files (both ja and en)**: `src/pages/tools/<slug>/index.astro` (ja) and `src/pages/en/tools/<slug>/index.astro` (en). Each is a thin wrapper that calls the step 3 component with only `locale` changed (no markup).

   ```astro
   ---
   import <Slug>Page from '../../../components/tool-pages/<Slug>Page.astro';
   ---
   <<Slug>Page locale="ja" />
   ```

5. **Register in the registry**: add an entry to the `tools` array in `src/data/tools.ts`. This is the short copy and metadata for the homepage grid and sidebar nav, separate from the step 2 page dictionary. Without registration the tool appears in neither the homepage grid nor the sidebar. Fields:
   - `slug`
   - `category`: a category ID (`CategoryId`, e.g. `'text'` / `'dev'`). The display names live in `categories` in the same file. Reuse an existing ID; to add a new category, append it to both `categoryIds` and `categories` (ja/en). It drives the homepage category filter and the sidebar grouping/open-state persistence.
   - `addedAt` / `updatedAt` (`YYYY-MM-DD`; the same value at first release; `addedAt` must match the date the tool first appears in `src/data/updates.ts`, which `tools.test.ts` checks)
   - `related`: 1-3 slugs of related tools (they must exist, no self-reference or duplicates)
   - Optional flags: `sensitive` (handles secrets, personal data including photos/documents, health, or income; when unsure, set it), `heavy` (loads wasm/PDF/large JS libraries), `needsCamera`, `ads`
   - `translations.ja` / `translations.en`: each `{ name, description, keywords }`. `keywords` (2-8 items) are search aliases for the homepage search (abbreviations, alternate spellings, English terms); only list things the tool actually does.

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
- [ ] For multi-step tools: added `howToHeading` / `howToSteps` (ja/en) to the copy dictionary, rendered them with `HowTo.astro`, and added the slug to `e2e/how-to.spec.ts`
- [ ] Implemented `src/components/tool-pages/<Slug>Page.astro` wrapped in `ToolShell`, resolving copy from the dictionary
- [ ] Made `src/pages/tools/<slug>/index.astro` (ja) and `src/pages/en/tools/<slug>/index.astro` (en) thin wrappers that only call the shared component
- [ ] Registered the tool in `src/data/tools.ts`: `category` (ID), `addedAt` / `updatedAt`, `related` (1-3), flags if applicable, and `translations.ja` / `translations.en` (`name` / `description` / `keywords`)
- [ ] If the tool takes a file: it uses the dashed-border dropzone and works by both file picker and drag & drop (see step 3)
- [ ] Runs entirely client-side; sends no data to any server
- [ ] Designed page-specific `title` / `description` for ja and en, and exactly one `<h1>` (see [growth.md](./growth.md))
- [ ] Confirmed the layout holds at narrow widths (~375px)
- [ ] `astro check` / `lint` / `format` / `build` pass
- [ ] `pnpm test` passes, including `scripts/check-optimize-deps.test.ts` — if the tool imports a new external npm package (not already used by another tool) into `<script>` or `src/lib`, that test fails until the package is added to `vite.optimizeDeps.include` in `astro.config.mjs`; do that rather than ignoring the failure (see the comment above that list for why — a missing entry causes an E2E-only "504 (Outdated Optimize Dep)" failure in CI)
- [ ] If the tool loads wasm, fetches a file at runtime, or otherwise touches something the CSP restricts (`security.csp` in `astro.config.mjs`): its per-tool e2e spec exercises the real action (e.g. actually run the conversion/encryption and check the output), not just the UI wiring. E2E runs against the built output (port 4322), which enforces the CSP; `astro dev` does not, so a manual check on `pnpm dev` proves nothing about the CSP. If you change the CSP itself, update `e2e/csp-headers.spec.ts` in the same commit.
