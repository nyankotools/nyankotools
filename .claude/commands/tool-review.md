---
description: 追加・修正したツールを、独立したレビュー専任エージェント（tool-reviewer）にレビューさせる（コードは変更しない）
argument-hint: [対象ツールのslugや補足指示（省略可）]
allowed-tools: Bash(git status:*), Bash(git diff:*), Bash(git log:*), Bash(pnpm run lint:*), Bash(pnpm exec prettier:*), Bash(pnpm exec astro check:*), Agent
---

現在のリポジトリで追加・修正されたツールについて、独立したレビュー専任サブエージェント `tool-reviewer`（`.claude/agents/tool-reviewer.md`）を Agent ツールで起動し、レビューさせてください。このエージェントはコードを変更せず、指摘のみを行います。

手順:

1. 必要であれば `git status` / `git diff` で変更範囲をざっと把握する。
2. Agent ツール（`subagent_type: tool-reviewer`）を起動する。プロンプトには次を含めること。
   - 補足指示: `$ARGUMENTS`（対象ツールの slug や範囲の指定があれば伝える。空なら「現在の未コミット差分全体」を対象にするよう伝える）
   - 実装側の会話ではなく独立した視点でレビューしてほしいこと
   - コードやテストは変更せず、指摘のみを行うこと
3. エージェントからの報告を受け取ったら、日本語で簡潔に要約してユーザーに伝える（重大度順の指摘一覧、問題なしと確認できた観点）。

注意:

- `git commit` は実行しない。
- テストの実行・不足テストの追加が必要な場合は、代わりに `/qa-test`（`tool-qa` エージェント）を使う。
