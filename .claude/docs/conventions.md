# 開発ルール: コーディング規約・コミット規則

日々の開発で従うべきルール。プロジェクト全体の前提は [CLAUDE.md](../../CLAUDE.md) を参照。

## 言語

- UI 文言、コミットメッセージ、コードコメントはすべて日本語（既存の履歴に合わせる）。
- 変数名・関数名などの識別子は英語。

## コーディングスタイル

- Lint: ESLint（`eslint.config.js`、flat config）。`typescript-eslint` + `eslint-plugin-astro` + `eslint-config-prettier` の組み合わせ。
- Format: Prettier（`.prettierrc.json`、`prettier-plugin-astro` 併用）。`singleQuote: true`。
- コミット前に `pnpm run lint` と `pnpm run format` を実行すること。
- `typescript` は `6.0.3` に固定（`^6.0.3`）。`astro check` と `typescript-eslint` が TypeScript 7 系のネイティブ（Go 製）コンパイラ API に未対応のため。両ツールの対応を確認するまで 7.x へ上げない。
- 改行コードは LF（世界標準）に統一する。ルートの `.gitattributes`（`* text=auto eol=lf`）で強制しているため、Windows で `core.autocrlf=true` になっていてもコミットされる内容は常に LF。エディタやOSのデフォルトに任せない。

## ツールロジックの書き方

- 各ツールの実処理（パース、変換、計算など）は `src/lib/tools/<slug>.ts` に「フレームワーク非依存の素の TypeScript 関数」として書く。
- ページ側の `<script>` タグはこの関数を import して DOM 更新に専念させる。ロジックをページ内に直接書かない。
- テストは Vitest（`pnpm test` / `pnpm run test:watch`）。Astro ページではなく `src/lib/tools/*.ts` の純粋ロジックを対象にする（例: `src/lib/tools/char-counter.test.ts`）。
- ブラウザ上の実際の挙動（ページ遷移、DOM 更新など）を確認する E2E テストは Playwright（`pnpm run test:e2e` / `pnpm run test:e2e:ui`）。テストファイルはリポジトリ直下の `e2e/*.spec.ts` に置く。`playwright.config.ts` の `webServer` が自動で `pnpm dev`（`http://localhost:4321`）を起動するため、事前にサーバーを立ち上げておく必要はない。初回実行前にブラウザ本体が必要なら `pnpm exec playwright install chromium` を実行する。
- 追加・修正したツールを網羅的にテストしたい場合は `/qa-test` コマンドを使う。実装した会話とは別の独立したQA専任サブエージェント（`.claude/agents/tool-qa.md`）が lint / 型チェック / ビルド / Vitest / Playwright を実行し、不足しているテストがあれば自分で追加実装したうえで結果を報告する。
- コードレビューをしたい場合は `/tool-review` コマンドを使う。独立したレビュー専任サブエージェント（`.claude/agents/tool-reviewer.md`）が正確性・簡潔性・規約準拠・静的サイト制約・SEO/レスポンシブ・セキュリティの観点で指摘のみを行う（コードは変更しない）。

## コミットメッセージ

- 日本語で、変更内容を簡潔に要約する（例: `wrangler.jsoncにbuild.commandを追加してデプロイ前ビルドを自動化`）。
- 既存の `git log` のスタイル（体言止め・「〜を追加」「〜を修正」等）に合わせる。

## 権限設定について

`.claude/settings.json` は現状ファイル読み書き系ツール（Read/Edit/Write/MultiEdit/Glob/Grep）のみ自動許可している。git や pnpm などのシェルコマンドは意図的に毎回確認を求める設定にしており、これは見落としではない。変更する場合はユーザーに確認すること。
