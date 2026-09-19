# 00. プロジェクト概要と絶対制約

## これは何か

- **NyankoTools**（https://nyankotools.com）: 開発者・クリエイター向けの小さなユーティリティツール集（文字数カウント、JSON整形、Base64 など。約38個）。
- 日本語圏のロングテール検索（例:「JSON 整形 オンライン 無料」）からの流入が主な獲得経路。将来は広告・アフィリエイトで収益化する予定。
- 日本語（`ja`、デフォルト）と英語（`en`）の2言語対応。

## 絶対に破らない制約

1. **完全クライアントサイド。** すべてのツールはブラウザ内で完結する。入力データをサーバーに送らない。`fetch` / `XMLHttpRequest` / 外部API呼び出しを書かない。CSP `connect-src 'none'` で外部通信を遮断している（`astro.config.mjs`）。
2. **静的サイト。** Astro `output: static`。API ルート・SSR・DB を追加しない。
3. **UI フレームワーク禁止。** React / Vue / Svelte のアイランドを使わない。素の TypeScript と DOM 操作で書く。
4. **ロジックと UI 文言を分離する。** 処理は `src/lib/tools/<slug>.ts`（純粋関数）、文言は `src/i18n/tools/<slug>.ts`。ロジック層に文言を持たせない。
5. **日本語で書く。** UI文言・コードコメント・コミットメッセージは日本語。変数名・関数名は英語。
6. **改行は LF。** `.gitattributes` で強制されているが、自分で書くファイルも LF にする。
7. **`typescript` を 7.x に上げない。** `6.0.3` 固定（`astro check` と `typescript-eslint` が未対応のため）。

## 技術スタック

| 項目           | 内容                                   |
| -------------- | -------------------------------------- |
| フレームワーク | Astro（静的出力、SSR アダプターなし）  |
| スタイル       | Tailwind CSS v4（`@tailwindcss/vite`） |
| 言語           | TypeScript                             |
| テスト         | Vitest（単体）、Playwright（E2E）      |
| Lint / Format  | ESLint（flat config）、Prettier        |
| パッケージ管理 | pnpm                                   |
| デプロイ       | Cloudflare Workers の静的アセット配信  |

## ディレクトリ（要点）

```
src/
  data/tools.ts                  # ツール一覧の唯一のレジストリ（ナビ・トップの元データ）
  layouts/Layout.astro           # 全ページ共通の <head> とサイドバー（メタタグはここだけ）
  lib/tools/<slug>.ts            # ツールのロジック（純粋関数）と <slug>.test.ts
  i18n/tools/<slug>.ts           # ツール専用の ja/en 文言辞書
  i18n/ui.ts                     # サイト共通UIの文言
  components/tool-pages/<Slug>Page.astro  # 共有ページ（マークアップと <script>）
  components/Glossary.astro      # 用語解説コンポーネント
  pages/tools/<slug>/index.astro          # ja の薄いラッパー
  pages/en/tools/<slug>/index.astro       # en の薄いラッパー
e2e/<slug>.spec.ts               # Playwright の E2E
docs/spec.md                     # プロダクト仕様書
memo/                            # ローカルメモ（git 管理外。読むのは可、コミット対象ではない）
```

## 関連する元ドキュメント

- `CLAUDE.md`、`.claude/docs/architecture.md`、`.claude/docs/conventions.md`、`docs/spec.md`
