# NyankoTools

[nyankotools.com](https://nyankotools.com) — ブラウザだけで完結する、開発者・クリエイター向けの小さなツール集です。テキスト変換、データフォーマット、計算機、ジェネレーターなど41個以上のツールを日本語・英語で提供しています。

**すべての処理はブラウザ内（クライアントサイド）で完結し、入力データが外部サーバーに送信されることは一切ありません。** バックエンドを持たない静的サイトです。

詳しい仕様は [`docs/spec.md`](./docs/spec.md) を、開発ガイドラインは [`CLAUDE.md`](./CLAUDE.md) および [`.claude/docs/`](./.claude/docs/) 配下を参照してください。

## 特徴

- **完全クライアントサイド**: API・バックエンドなし。プライバシー保護とゼロホスティングコストを両立。
- **41以上のツール**: テキスト処理・データ変換・エンコード/デコード・生成系・開発support・計算機など。
- **日本語 / 英語対応**: 全ページが `ja`（`/tools/...`）・`en`（`/en/tools/...`）の両ロケールを提供。
- **SEO志向**: ツールごとに個別の title/description、内部リンク、構造化データ、サイトマップを整備。
- **レスポンシブ**: モバイル（375px前後）でも崩れないレイアウト。

## スタック

| レイヤー       | 技術                                                                 |
| -------------- | -------------------------------------------------------------------- |
| フレームワーク | [Astro](https://astro.build/)（`output: static`、SSRアダプターなし） |
| スタイリング   | Tailwind CSS v4（`@tailwindcss/vite`）                               |
| 言語           | TypeScript                                                           |
| テスト         | Vitest（ユニット） / Playwright（E2E）                               |
| デプロイ先     | Cloudflare Workers（静的アセット配信）                               |
| パッケージ管理 | pnpm（Corepack 経由）                                                |

詳細は [`.claude/docs/architecture.md`](./.claude/docs/architecture.md) を参照。

## セットアップ

```bash
pnpm install
```

Node.js `>=22.13.0` が必要です（`package.json` の `engines` 参照）。

## コマンド

```bash
pnpm dev              # 開発サーバー起動 (http://localhost:4321)
pnpm build            # 本番ビルド（dist/ に出力）
pnpm preview          # ビルド結果をローカルでプレビュー
pnpm exec astro check # 型チェック
pnpm run lint         # ESLint
pnpm run format       # Prettier --write
pnpm test             # Vitest（一括実行）
pnpm run test:watch   # Vitest（ウォッチモード）
pnpm run test:e2e     # Playwright E2E
pnpm run test:e2e:ui  # Playwright E2E（UIモード）
```

## ディレクトリ構成

```
src/
  data/tools.ts              # ツールレジストリ（ja/en の name/description/category）
  i18n/
    ui.ts                    # サイト共通UI文言（サイドバー・フッター等）
    tools/<slug>.ts          # ツールページ専用の文言辞書（ja/en）
  components/
    tool-pages/<Slug>Page.astro  # 各ツールの共有マークアップ + <script>（locale prop で出し分け）
    Glossary.astro, ShareButtons.astro
  layouts/
    Layout.astro              # 全ページ共通の <head>（SEO/OGP/hreflang）とサイドバーシェル
  lib/
    tools/<slug>.ts           # 各ツールのロジック（フレームワーク非依存の純粋関数、テスト対象）
  pages/
    index.astro                # トップページ（ja）
    en/                        # 英語版ページ群
    tools/<slug>/index.astro   # 各ツールのページ（ja、共有コンポーネントの薄いラッパー）
    about/, contact/, faq/, privacy-policy/, terms-of-service/
  styles/global.css
e2e/                          # Playwright E2E テスト（*.spec.ts）
docs/spec.md                  # 仕様書
```

新規ツール追加の手順は [`.claude/docs/adding-a-tool.md`](./.claude/docs/adding-a-tool.md) を参照してください。

## 開発フロー（このリポジトリ固有のルール）

このリポジトリを Claude Code で扱う場合、ツールの追加・修正後は **実装 → レビュー（`tool-reviewer`）→ テスト（`tool-qa`）** の順で確認する運用になっています。人手で開発する場合も、コミット前に以下を通すことを推奨します。

```bash
pnpm exec astro check && pnpm run lint && pnpm test && pnpm build
```

詳細は [`CLAUDE.md`](./CLAUDE.md) を参照してください。

## デプロイ

Cloudflare Workers（静的アセット配信）に `pnpm build` の成果物（`dist/`）をデプロイします。設定は `wrangler.jsonc` を参照。詳細は [`.claude/docs/deployment.md`](./.claude/docs/deployment.md)。

## ライセンス

未定（このリポジトリは現時点でオープンソースライセンスを付与していません）。
