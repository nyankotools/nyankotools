---
description: 追加・修正したツールを、独立したQA専任エージェント（tool-qa）に網羅的にテストさせる
argument-hint: [対象ツールのslugや補足指示（省略可）]
allowed-tools: Bash(git status:*), Bash(git diff:*), Bash(git log:*), Bash(pnpm test:*), Bash(pnpm run test:*), Bash(pnpm exec astro check:*), Bash(pnpm run lint:*), Bash(pnpm exec prettier:*), Bash(pnpm run format:*), Bash(pnpm build:*), Bash(pnpm exec playwright:*), Bash(pnpm run test:e2e:*), Agent
---

現在のリポジトリで追加・修正されたツールについて、独立したQA専任サブエージェント `tool-qa`（`.claude/agents/tool-qa.md`）を Agent ツールで起動し、網羅的にテストさせてください。

手順:

1. 必要であれば `git status` / `git diff` で変更範囲をざっと把握する。
2. Agent ツール（`subagent_type: tool-qa`）を起動する。プロンプトには次を含めること。
   - 補足指示: `$ARGUMENTS`（対象ツールの slug や範囲の指定があれば伝える。空なら「現在の未コミット差分全体」を対象にするよう伝える）
   - 実装側の会話ではなく独立した視点で検証してほしいこと
3. エージェントからの報告を受け取ったら、日本語で簡潔に要約してユーザーに伝える。
   - 実行結果（lint / astro check / build / vitest / playwright）
   - 追加・修正したテストファイルとその要点
   - 見つかった問題点と重大度
   - 未解決事項

注意:

- `git commit` は実行しない。
- サブエージェントが実行する `pnpm` 系コマンドはこのコマンドの `allowed-tools` で自動許可済みだが、環境によっては初回のみ確認プロンプトが出ることがある。出た場合はユーザーに承認を求める。
