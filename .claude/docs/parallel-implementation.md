# Design doc: Implementing several tools in parallel

How to implement a batch of unimplemented tools (from `memo/実装予定一覧.md`) at the same time without the workers colliding. Single-tool steps are in [adding-a-tool.md](./adding-a-tool.md); this doc only adds the batch-level rules.

## Principle: split by file ownership

Adding one tool touches two kinds of files.

| Kind                        | Files                                                                                                                                                                                                                                                                      | Owner                                        |
| --------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------- |
| **Per-tool (disjoint)**     | `src/lib/tools/<slug>.ts` + `.test.ts`, `src/i18n/tools/<slug>.ts`, `src/i18n/faq/<slug>.ts`, `src/components/tool-pages/<Slug>Page.astro`, `src/pages/tools/<slug>/index.astro`, `src/pages/en/tools/<slug>/index.astro`, `e2e/<slug>.spec.ts`                            | one **worker** (`tool-implementer`) per tool |
| **Shared (conflict-prone)** | `src/data/tools.ts`, `src/data/updates.ts`, `e2e/how-to.spec.ts`, `astro.config.mjs` (`optimizeDeps.include`, CSP), `scripts/bundle-budget.mjs` (`slugBudgets`), `package.json` / lockfile, `memo/実装予定一覧.md`, `src/styles/global.css`, any shared `src/lib/*` helper | the **main session only**                    |

Workers never edit shared files. They return an **integration report** (below) and the main session applies it serially. This removes every write-write conflict, so no worktrees are needed.

## Workflow

1. **Pick the batch (main).** 3-4 tools per batch (see "Batch sizing"). Prefer tools from the same batch group in `実装予定一覧.md`. Resolve every "着手前に確認" note (duplicate check, user decision) _before_ spawning; an unresolved one means the tool is not ready for the batch. Assign the `No.` / slug / category / sibling tools to reuse.
2. **Prepare shared prerequisites (main).** If a tool needs a new npm package, add it (`pnpm add`), put it in `vite.optimizeDeps.include`, and decide the `slugBudgets` entry/CSP change now, so workers can import it. If tools in the batch should share new logic, write that shared module first and tell the workers to import it (do not let two workers create the same helper).
3. **Spawn workers (main), one `tool-implementer` per tool, in a single message** so they run concurrently. Each prompt must contain: the slug, `No.`, category, the memo line (purpose / notes), the siblings to imitate, the new-dependency decision, and the restated rules **"do not run git, do not edit shared files, do not run pnpm build / dev / E2E"**.
4. **Integrate (main).** For each report, in `No.` order: add the registry entry to `tools.ts` (fix `related` to include batch siblings that now exist), add the slug to `how-to.spec.ts` if the report says so, apply the other requested shared-file changes. Then verify `git status` shows only expected paths (no commit by a worker).
5. **Check once (main).** `pnpm exec astro check`, `pnpm run lint`, `pnpm test`. Fix cross-cutting errors yourself or send them back to the owning worker.
6. **Review once per batch.** `tool-reviewer` gets the whole batch (paste `git diff --stat` and the slug list), then **after** its report `tool-qa` gets the batch. Reviewer then QA, never in parallel (CLAUDE.md rule unchanged). Fix major findings before QA.
7. **QA once per batch.** `tool-qa` runs `pnpm qa <slug1> <slug2> …` (one build, then only those specs; scoped, not the full E2E). QA is the only phase that builds / uses port 4322, which is why it must not run concurrently with another QA or `pnpm dev`-based check.
8. **Memo (main).** Move each finished tool to 実装済み in `No.` order, update the summary counts. Do not commit until the user says so (CLAUDE.md).

## Integration report (what a worker returns)

A worker's final message must contain exactly these, in this order, so the main session can paste them:

1. **Files created**: the list of paths.
2. **Registry entry**: the full `tools.ts` object (`slug`, `category`, `addedAt` / `updatedAt` = today, `related`, flags, `translations.ja/en`).
3. **Shared-file requests**: `how-to.spec.ts` yes/no; new npm package (name, and whether it is imported from `<script>` or `src/lib`); `slugBudgets` / CSP needs; anything else. "None" if none.
4. **Local checks run**: only `pnpm exec vitest run src/lib/tools/<slug>.test.ts` and `pnpm exec prettier --check <own files>` (both are safe to run concurrently). No build, no E2E, no lint over the whole repo.
5. **Open questions** (design decisions the memo left open).

## Batch sizing and what to keep out of a batch

- **3-4 tools**: the main-session integration and one review/QA pass are the serial part; more tools make the review prompt too large and one bad tool blocks the batch.
- **At most one `heavy` / new-dependency tool per batch**, and it should not share a batch with tools that need the same shared change. New dependencies, wasm, workers, CSP changes, and `slugBudgets` raises are main-session work; verify them on the production build (port 4322).
- **Do not put two tools that would share a new helper into different workers' hands.** Either write the helper first (step 2) or implement them sequentially.
- **Do not batch site features** (No.155, No.179) or tasks that edit `Layout.astro` / `global.css`.
- Related tools in one batch can link to each other via `related`; the main session sets this at integration because the siblings do not exist when a worker starts.

## Why not forks / worktrees

Background `fork` agents have previously committed on their own and kept running after a failure (see the project memory). `tool-implementer` is a normal (non-fork) agent with no git access in its prompt rules, and file ownership already prevents conflicts, so worktrees only add merge work. After a batch, run `git status` / `git log` and `ListAgents` to confirm nothing committed and nothing is still running.
