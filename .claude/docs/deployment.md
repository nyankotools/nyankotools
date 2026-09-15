# 設計書: デプロイ

## デプロイ先

Cloudflare Workers（静的アセット配信）。`wrangler.jsonc` で以下を設定している。

```jsonc
{
  "name": "nyankotools",
  "build": {
    "command": "pnpm build",
  },
  "assets": {
    "directory": "./dist",
    "not_found_handling": "404-page",
  },
}
```

- `build.command` により、デプロイ時に `pnpm build` が自動実行され `dist/` が生成される。
- サーバーサイドの Worker コードは持たない（`assets` のみ）。SSR アダプター不要な static 出力構成と一致している。
- `not_found_handling: "404-page"` により `src/pages/404.astro` が 404 時に使われる。

## ローカルでの確認コマンド

```
pnpm build     # dist/ に静的ビルドを生成
pnpm preview   # ビルド結果をローカルでプレビュー
```

## 未対応・既知の課題

- `og:image`（`https://nyankotools.com/ogp.png`）が `public/` に未配置。OGP 画像を追加する場合は `public/ogp.png` を用意する。
