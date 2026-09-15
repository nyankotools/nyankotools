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

## ツールロジックの書き方

- 各ツールの実処理（パース、変換、計算など）は `src/lib/tools/<slug>.ts` に「フレームワーク非依存の素の TypeScript 関数」として書く。
- ページ側の `<script>` タグはこの関数を import して DOM 更新に専念させる。ロジックをページ内に直接書かない。
- テストは Vitest（`pnpm test` / `pnpm run test:watch`）。Astro ページではなく `src/lib/tools/*.ts` の純粋ロジックを対象にする（例: `src/lib/tools/char-counter.test.ts`）。

## コミットメッセージ

- 日本語で、変更内容を簡潔に要約する（例: `wrangler.jsoncにbuild.commandを追加してデプロイ前ビルドを自動化`）。
- 既存の `git log` のスタイル（体言止め・「〜を追加」「〜を修正」等）に合わせる。

## 権限設定について

`.claude/settings.json` は現状ファイル読み書き系ツール（Read/Edit/Write/MultiEdit/Glob/Grep）のみ自動許可している。git や pnpm などのシェルコマンドは意図的に毎回確認を求める設定にしており、これは見落としではない。変更する場合はユーザーに確認すること。
