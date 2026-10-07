# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

NyankoTools (`nyankotools.com`) is a growing collection of small, browser-only utility tools (text/data converters, calculators, generators, etc.) for developers and creators, in Japanese and English. Every tool runs entirely client-side — no backend, no API routes, no data ever sent to a server. This is a deliberate product constraint (privacy pitch + zero hosting cost), not just a current limitation: do not introduce server-side logic.

Each tool has its own indexable URL (`/tools/<slug>/`, `/en/tools/<slug>/`) for SEO, and users also navigate via a persistent sidebar. NyankoTools aims for future monetization, so SEO, responsive design, and i18n are first-class — see [`growth.md`](.claude/docs/growth.md) for the rules to follow when adding or changing pages.

## 基本原則

- **日本語で応答すること**（コード・コマンド・技術用語を除く）

## ファイル編集のルール

- この環境（Windows）では `python3` はMicrosoft Storeのスタブで失敗する。`python`（3.10）と `py` は使える。**`python3` を呼ばないこと。** 「Pythonが使えないためnodeで行う」といった遠回りを防ぐため、以下に従う。
  - 通常の編集は `Edit` / `Write` ツールを使う。
  - 複数ファイルへの一括置換など、スクリプトが必要な場合は最初から `node` か `python`（`python3` ではない）を使う（バックスラッシュを含む文字列は `Edit` で直す）。

## 動作確認のルール

- 実装が完了したら、ユーザー自身がブラウザで動作を確認できる状態にすること（`pnpm dev` を起動し、確認用URL（例: http://localhost:4321）を伝える等）。
- 起動した開発サーバーなどのプロセスは、ユーザーから明示的に停止の指示があるまで終了しないこと。

## レビュー・テストのルール

- コード変更を伴う実装（ツールの追加・修正など）が完了したら、まず独立したレビュー専任エージェント（`tool-reviewer`、`.claude/agents/tool-reviewer.md`）にレビューを依頼すること。
- レビューエージェントから完了報告を受け取ったら、続けて独立したQA専任エージェント（`tool-qa`、`.claude/agents/tool-qa.md`）にテストを依頼すること。順序は 実装 → レビュー → テスト で、並行実行はしない。
- レビューでバグ・セキュリティ上の懸念など重大な指摘があった場合は、テスト依頼の前に対応（修正）するか、ユーザーに報告して方針を確認する。指摘が軽微な提案のみであれば、そのままテスト依頼に進んでよい。
- `/tool-review` と `/qa-test` で、これらのエージェントを手動起動することもできる。
- **例外（軽量チェックで代替してよいケース）**: `src/lib/tools/*.ts` のロジックやテストに影響しない変更（文言修正、CSS微調整、docsのみの変更など）は、reviewer/QAを呼ばず、自分で `pnpm exec astro check` / `pnpm run lint` / `pnpm build` を実行して確認すればよい。ロジック・新規ツール追加が絡む変更は、これまで通り必ずフルパイプライン（reviewer→QA）を通すこと。
- 同一ツールに対する複数の小修正を続けて行う場合、都度reviewer/QAを呼ばず、ひとまとまりの実装が完了した単位で1回だけ依頼してよい。

## 複数ツールの同時実装（バッチ）

- 未実装ツールを複数まとめて実装するときは [`parallel-implementation.md`](.claude/docs/parallel-implementation.md) に従う。ツール固有ファイルは `tool-implementer`（`.claude/agents/tool-implementer.md`）をツール1件につき1体、同一メッセージで並列起動して作らせ、共有ファイル（`src/data/tools.ts`・`e2e/how-to.spec.ts`・`astro.config.mjs`・`scripts/bundle-budget.mjs`・`package.json`・`memo/実装予定一覧.md` など）は**メインセッションだけ**が編集する。
- ワーカーのプロンプトには「git禁止・共有ファイル編集禁止・build/E2E禁止」を毎回明記し、完了後に `git status` / `git log` / `ListAgents` で逸脱が無いか確認する。
- レビュー・QAはバッチ単位で1回ずつ（実装 → `tool-reviewer` → `tool-qa` の順。QAは `pnpm qa <slug…>` で対象specのみ）。1バッチは3〜4件、新規依存・heavy系は1件まで。バッチ候補は `memo/実装予定一覧.md` の「並列実装バッチ候補」を参照。

## コミットのルール

- ユーザーから明示的に指示されるまで `git commit` を実行しないこと。実装が完了しても、コミットはせずユーザーの確認・指示を待つこと。
- コミットを実行する際は、その変更にnote記事のネタ（つまずき・原因と対処・設計判断・プロセス改善・トークン節約など）があるか確認し、あれば `memo/note記事用（開発ふりかえり）/03_ネタ帳.md` に日付・コミットハッシュ付きで追記すること（コミット後にハッシュを入れて追記してよい）。通常のツール追加でネタが無ければ追記不要。コミットメッセージ自体は従来通りで、note向けの記述は加えない。`D:\AI\Note\` 側は編集しない。

## mainへの反映ルール

- `main` はブランチ保護されており、直接 push できない。`develop` を push して、`develop` → `main` のPRを作り、PRのCI（`check`）が成功したらマージコミット方式（Create a merge commit）でマージする。squash / rebase は無効。
- PRがマージされたら、続けて `develop` に切り替え、`git fetch` のうえ `git merge --ff-only origin/main` で `main` に追いつかせ、`develop` も push すること（確認は不要）。あわせて、ローカルの `main` も `git fetch origin main:main`（fast-forwardのみ。`develop` にいる状態で実行する）で `origin/main` に追いつかせること（Sourcetree等で遅れ表示になるのを防ぐ）。最終的に `develop` ブランチにいる状態で終える。
- Dependabot PR など `main` に直接マージされた変更がある場合は、`develop` が `main` と分岐していて `--ff-only` が失敗することがある。その場合は `git merge origin/main`（通常のマージ）で `develop` に取り込んでから push する。
- ただし PRの作成・マージ（`main` への反映）自体は、これまで通りユーザーの明示的な指示があるときだけ行う。
- **更新情報（`src/data/updates.ts`、ツールの `updatedAt` など）はデプロイ時点の情報なので、`develop` → `main` のPRを作成する前に作成・反映すること。** 実装やコミットの都度ではなく、PR作成の直前にまとめて更新し、そのコミットを含めた状態でPRを作る。

## memo更新のルール

- `memo/実装予定一覧.md` に載っている予定ツールの実装が完了したら、該当行のチェックボックスにチェックを入れ、「実装済み」セクションへ移動すること（`src/data/tools.ts` への登録と合わせて行う）。各行の `No.xxx`（ツール固有の通し番号）は固定IDなので、移動時も変更せず、新規ツールには最大番号の次を付与すること。
- `memo/実装予定一覧.md` に実装予定のツールを追加するときは、ツール名の前に `〔カテゴリ〕` を同時に設定すること（`src/data/tools.ts` の `categories`（ja表示名）に対応。既存カテゴリで収まらない場合は新設カテゴリ（ID・ja/en表示名）を決め、冒頭のカテゴリ説明にも追記する）。
- 「実装済み」セクションのツール一覧は `No.xxx` の昇順に並べること。実装済みへ移動するときは、末尾に足さず番号順の位置に挿入する。

## Commands

Package manager is **pnpm** (via Corepack).

```
pnpm dev               # dev server (http://localhost:4321)
pnpm build             # production build to dist/ (static output)
pnpm exec astro check  # type-check .astro/.ts files
pnpm run lint          # ESLint
pnpm run format        # Prettier --write
pnpm test              # Vitest (pure logic in src/lib/tools/*.ts)
pnpm run test:e2e      # Playwright (e2e/*.spec.ts)
```

## Architecture essentials

Astro (static output, no SSR adapter) + Tailwind CSS v4 (`@tailwindcss/vite`) + TypeScript, deployed to Cloudflare Workers as static assets. Details: [`architecture.md`](.claude/docs/architecture.md).

- **Tools are registered in `src/data/tools.ts`** — this single registry drives the homepage grid and the sidebar. Adding a tool involves several files (logic, i18n dictionary, shared page component, ja/en page files, registry); follow [`adding-a-tool.md`](.claude/docs/adding-a-tool.md), don't improvise the structure.
- **Tool logic stays framework-free** in `src/lib/tools/<slug>.ts` (plain, testable TypeScript). No React/Vue/Svelte islands for tool interactivity.
- **`src/layouts/Layout.astro` is the only place that renders `<head>` meta and the sidebar shell.** All pages go through it; never duplicate `<head>` markup per page.
- **E2E**: sidebar navigation, 375px overflow, and h1 display are covered for all tools by `e2e/tools-common.spec.ts` (generated from the registry); per-tool specs only test tool-specific behavior.
- Don't bump `typescript` past 6.x (`astro check` / `typescript-eslint` don't support 7.x yet). Line endings are LF (`.gitattributes`).

## Detailed docs

More detailed rules and design docs live under `.claude/docs/`:

- [`architecture.md`](.claude/docs/architecture.md) — stack, directory layout, data flow, static-only principle
- [`conventions.md`](.claude/docs/conventions.md) — coding style, tool-logic structure, testing, commit style, `.claude/settings.json` policy
- [`adding-a-tool.md`](.claude/docs/adding-a-tool.md) — step-by-step checklist for adding a new tool
- [`deployment.md`](.claude/docs/deployment.md) — Cloudflare Workers static-asset deploy config
- [`growth.md`](.claude/docs/growth.md) — monetization-driven rules for SEO, responsive design, and i18n
