# AGENTS.md

NyankoTools（`nyankotools.com`）は、ブラウザ完結型の小さなユーティリティツール集（Astro 静的サイト）。

作業を始める前に、必ず `.opencode/README.md` を読むこと。タスク種別ごとに読むべきファイルが書いてある。

## 絶対に守ること

- **日本語で応答する**（コード・コマンド・技術用語を除く）。UI文言・コードコメント・コミットメッセージも日本語。
- **`git commit` / `git push` は、ユーザーが明示的に指示するまで実行しない。**
- **サーバー通信を一切追加しない。** `fetch` / `XMLHttpRequest` / 外部API呼び出し禁止（静的サイト・クライアントサイド完結が製品の前提）。
- React / Vue / Svelte などの UI フレームワークを導入しない。
- 実装 → レビュー → QA の順で進める。並行しない。

詳細な規約は `.opencode/` に、Claude Code 向けの元ドキュメントは `CLAUDE.md` と `.claude/docs/` にある（ローカルLLMは通常 `.opencode/` だけ読めばよい）。
