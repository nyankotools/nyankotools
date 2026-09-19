# 05. コマンド一覧と環境の注意

パッケージマネージャーは **pnpm**（Corepack 経由）。`npm` / `yarn` は使わない。

## よく使うコマンド

| 目的                        | コマンド                                            |
| --------------------------- | --------------------------------------------------- |
| 依存のインストール          | `pnpm install`                                      |
| 開発サーバー起動            | `pnpm dev`（http://localhost:4321）                 |
| 本番ビルド（`dist/` 出力）  | `pnpm build`                                        |
| ビルドのプレビュー          | `pnpm preview`                                      |
| 型チェック                  | `pnpm exec astro check`                             |
| Lint                        | `pnpm run lint`                                     |
| 整形（書き換える）          | `pnpm run format`                                   |
| 整形の確認（書き換えない）  | `pnpm exec prettier --check .`                      |
| 単体テスト（全体）          | `pnpm test`                                         |
| 単体テスト（1ファイル）     | `pnpm exec vitest run src/lib/tools/<slug>.test.ts` |
| 単体テスト（監視）          | `pnpm run test:watch`                               |
| E2E（1ファイル）            | `pnpm exec playwright test e2e/<slug>.spec.ts`      |
| E2E（全体・要ユーザー指示） | `pnpm run test:e2e`                                 |
| E2E 用ブラウザ（初回のみ）  | `pnpm exec playwright install chromium`             |

## 使い分けの注意

- **単体テストは対象だけ流す。** 全体を流すのは最後の確認のときだけ。
- **E2E は対象ツールの spec だけ。** 全体（35ファイル前後）はユーザーが頼んだときだけ。時間もトークンも大きい。
- `pnpm run format` はファイルを書き換える。レビュー役は使わない（`--check` を使う）。
- `pnpm dev` は起動したままにする。ユーザーが止めてと言うまで終了しない。バックグラウンドで起動して、URL を伝える。
- Playwright の `webServer` が `pnpm dev` を自動起動するので、E2E のために手動で立ち上げる必要はない。ポート 4321 が既に使われていると起動に失敗することがある。

## Windows 11 での注意

- OS は Windows 11。シェルは PowerShell や Git Bash など環境により異なる。
- 使っているシェルの構文で書く。分からないときは、コマンドを `&&` でつながず1つずつ実行する。
- パスは `\` と `/` の両方が通る場面が多いが、コード中の import は必ず `/` を使う。
- ファイルは **LF** で保存する。CRLF で書き込むツール・エディタ設定に注意（`.gitattributes` で正規化されるが、差分にノイズが出る）。
- ファイルの読み書きは、可能な限りシェルのリダイレクトではなく、opencode のファイル編集ツールを使う（エンコーディング崩れを避けるため）。文字コードは UTF-8。

## コマンドが失敗したとき

1. エラーメッセージを最初から最後まで読む。
2. `node_modules` が無い・古いなら `pnpm install`。
3. `astro check` / `lint` が古いキャッシュで失敗するように見えるときは、`.astro/` は自動生成物なので消さずにまずコマンドを再実行する。
4. 同じコマンドを同じ引数で繰り返さない。原因を特定してから再実行する。
5. 原因が分からなければ、実行したコマンドとエラー全文をユーザーに報告する。

## 関連する元ドキュメント

- `CLAUDE.md`（Commands）、`.claude/docs/conventions.md`
