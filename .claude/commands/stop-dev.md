---
description: pnpm dev で起動している開発サーバー（Astro）のプロセスを停止する
argument-hint: (引数なし)
---

`pnpm dev`（Astro dev サーバー）が起動中であれば停止してください。

手順:

1. Windows 環境なので PowerShell（または Bash 経由の powershell 呼び出し）で稼働中の node.exe プロセス一覧とコマンドラインを取得する。
   例: `Get-CimInstance Win32_Process -Filter "name='node.exe'" | Select-Object ProcessId, CommandLine`
2. `CommandLine` に `astro` と `dev` を含む（= `astro dev` を実行している）プロセスだけを対象にする。無関係な node.exe プロセスは絶対に停止しない。
3. 該当プロセスが見つかったら、その PID に対して `Stop-Process -Id <PID> -Force` を実行して停止する。複数見つかった場合はすべて停止する。
4. 停止後、再度プロセス一覧を取得し、該当プロセスが残っていないことを確認する。
5. 結果を日本語で簡潔に報告する。
   - 停止した場合: 停止した旨と PID
   - 元々起動していなかった場合: 「起動中の開発サーバーは見つかりませんでした」と伝える

注意:

- `git commit` など他の操作は行わない。
- 停止対象は `astro dev`（`pnpm dev`）関連のプロセスのみに限定する。
