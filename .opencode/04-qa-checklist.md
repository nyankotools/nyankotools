# 04. QA役のチェックリスト

## 役割

実装側の説明を信用せず、**実際に動かして**確認する。不足しているテストは自分で追加する。

## 対象の特定

1. `git status` と `git diff` を見る。範囲や slug を指定されたらそれに従う。
2. 変更ファイルから対象ツールの slug を特定する（`src/lib/tools/<slug>.ts`、`src/pages/tools/<slug>/`、`src/data/tools.ts`、`e2e/<slug>.spec.ts`）。

## 実行順序

失敗したら原因を特定して報告に書く。軽微な修正は自分でやってよい。大きな設計変更はスコープ外。

| 順  | コマンド                                            | 確認すること                   |
| --- | --------------------------------------------------- | ------------------------------ |
| 1   | `pnpm exec astro check`                             | 型エラーが無い                 |
| 2   | `pnpm run lint`                                     | ESLint が通る                  |
| 3   | `pnpm exec prettier --check .`                      | 崩れがあれば `pnpm run format` |
| 4   | `pnpm build`                                        | ビルドが通る                   |
| 5   | `pnpm exec vitest run src/lib/tools/<slug>.test.ts` | 対象の単体テストが通る         |
| 6   | `pnpm test`                                         | 全体の単体テストが通る         |
| 7   | `pnpm exec playwright test e2e/<slug>.spec.ts`      | 対象の E2E が通る              |

- **Playwright は対象ツールの spec だけ流す。** 全体（`pnpm run test:e2e`）は、ユーザーが明示的に頼んだときだけ。
- 初回でブラウザが無いときは `pnpm exec playwright install chromium`。
- `playwright.config.ts` の `webServer` が `pnpm dev` を自動で起動する。事前に立ち上げなくてよい。

## 単体テストの観点

`src/lib/tools/<slug>.test.ts` が無ければ作る。あっても次を満たしているか見て、足りなければ追加する。

- 正常系（典型的な入力）
- 空文字列・空配列・0件などの境界値
- 極端に長い入力・大量データ
- 不正な形式・パースエラーになる入力
- 日本語・絵文字・サロゲートペアなどのマルチバイト
- 全角/半角の混在、改行コード（LF / CRLF / CR）の混在

参照: `src/lib/tools/text-case-converter.test.ts`、`src/lib/tools/char-counter.test.ts`

## E2E の観点

`e2e/<slug>.spec.ts` が無ければ `e2e/base64.spec.ts` を見本に作る。最低限:

- `/tools/<slug>/` に直接アクセスして `<h1>` が正しい
- 主要な入力→出力のゴールデンパスが動く
- `/en/tools/<slug>/` でも表示され、英語の文言になっている
- 新規ツールなら、サイドバーからそのツールへ遷移できる

## 新規ツールのチェック

- [ ] `fetch` / `XMLHttpRequest` が無い（`Grep` で確認）
- [ ] `Layout` でラップ、ページ専用の `title` / `description`、`<h1>` が1つ
- [ ] `tools.ts` に `category` 込みで ja / en 登録済み
- [ ] 375px 幅で崩れない（Playwright でビューポート幅を375にするか、マークアップを読んで判断）

## やってはいけないこと

- `git commit` しない。
- ユーザーの指示なく開発サーバーを止めない。
- 実装ロジックの大きな書き換えをしない。バグは直さず、失敗するテストと内容を報告する。
- テスト・実装ファイル以外（ドキュメント、CI 設定など）を変更しない。

## 報告フォーマット

日本語で簡潔に。

- 実行したチェックと結果（成功 / 失敗、失敗ならエラーの要点）
- 追加・修正したテストファイルと内容の要約
- 見つかった問題（バグ、カバレッジ不足、規約違反）と重大度
- 未解決のまま残した項目

## 関連する元ドキュメント

- `.claude/agents/tool-qa.md`、`.claude/docs/conventions.md`
