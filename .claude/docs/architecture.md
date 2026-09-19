# 設計書: アーキテクチャ

NyankoTools の技術構成とディレクトリ構造について。概要は [CLAUDE.md](../../CLAUDE.md) を参照。

## スタック

| レイヤー       | 技術                                          |
| -------------- | --------------------------------------------- |
| フレームワーク | Astro（`output: static`、SSR アダプターなし） |
| スタイリング   | Tailwind CSS v4（`@tailwindcss/vite`）        |
| 言語           | TypeScript                                    |
| デプロイ先     | Cloudflare Workers 静的アセット配信           |
| パッケージ管理 | pnpm（Corepack 経由）                         |

Cloudflare 側は `wrangler.jsonc` で `pnpm build` を `build.command` に指定し、`dist/` を静的アセットとして配信する構成。サーバーランタイムを使わないため Cloudflare アダプターは不要。

## ディレクトリ構成

```
src/
  data/
    tools.ts          # ツール一覧のレジストリ（{ slug, name, description }）
  layouts/
    Layout.astro       # 全ページ共通の <head> とサイドバー
  lib/
    tools/
      <slug>.ts         # 各ツールのロジック（フレームワーク非依存の純粋関数）
  pages/
    index.astro         # トップページ（ツール一覧グリッド）
    404.astro
    tools/
      <slug>/
        index.astro     # 各ツールのページ本体
  styles/
    global.css
```

## データフロー

1. `src/data/tools.ts` の `tools` 配列が唯一のツールレジストリ。
2. `src/layouts/Layout.astro` がこの配列を読んでサイドバーナビゲーションを生成。
3. `src/pages/index.astro` が同じ配列からトップページのツール一覧グリッドを生成。
4. 各ツールページ（`src/pages/tools/<slug>/index.astro`）は `Layout` でラップし、`<script>` タグ内で `src/lib/tools/<slug>.ts` の純粋関数を呼び出して DOM を更新する。

`tools.ts` に登録していないツールページはナビゲーションに出現しない（ページ自体は URL 直打ちで到達可能）。新規ツール追加の手順は [adding-a-tool.md](./adding-a-tool.md) を参照。

## クライアントサイド完結の原則

すべてのツールはブラウザ内で完結し、サーバーには一切データを送信しない。これはプロダクトの前提条件（プライバシー訴求 + ホスティングコストゼロ）であり、一時的な制約ではない。API ルートやサーバーサイド処理を追加しないこと。

## UI フレームワーク方針

Astro はデフォルトで JS をゼロ出力する。この特性を維持するため、ツールのインタラクティブ性に React/Vue/Svelte などの UI フレームワークアイランドを使わない。素の TypeScript / DOM 操作で状態管理が現実的に不可能な場合のみ、個別ツール単位でアイランド導入を検討する。

## Layout.astro の役割

`src/layouts/Layout.astro` が `<head>` のメタタグ（title/description/OGP/Twitter Card/favicon）とサイドバーシェルを描画する唯一の場所。すべてのページはこれを経由し、`title` / `description` / 任意で `ogImage` を props として渡す（`<head>` マークアップをページごとに複製しない）。`og:image` の既定は `https://nyankotools.com/ogp.png`（実体は `public/ogp.png`）。
