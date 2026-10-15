# NyankoTools 仕様書

最終更新: 2026-10-15

このドキュメントは NyankoTools（`nyankotools.com`）というプロダクトの機能・非機能仕様をまとめたものです。開発時のコーディング規約・アーキテクチャ詳細は [`CLAUDE.md`](../CLAUDE.md) と [`.claude/docs/`](../.claude/docs/) を参照してください（このドキュメントはそれらを重複させず、プロダクト仕様の観点でまとめ直したものです）。

## 1. プロダクト概要

- **名称**: NyankoTools
- **URL**: https://nyankotools.com
- **概要**: 開発者・クリエイター向けの、ブラウザ完結型の小さなユーティリティツールを集めたコレクションサイト。テキスト/データ変換・計算・生成・画像・PDF 系ツールなどを、日本語圏の長尾検索キーワード（例:「JSON 整形 オンライン 無料」）からの流入を主な獲得チャネルとして提供する。
- **対象ユーザー**: プログラマー・エンジニア・デザイナー・ライター・学生など、日常的にちょっとした変換・計算・整形作業を必要とする個人。
- **提供形態**: 会員登録・ログイン不要。インストール不要。すべてのツールは単一の静的サイト内で完結。
- **収益化方針**: 将来的に広告掲載・アフィリエイトによる収益化を想定（現時点では未実装）。そのため SEO・レスポンシブ対応・多言語化を継続的な投資対象として扱う。詳細は [`.claude/docs/growth.md`](../.claude/docs/growth.md)。

## 2. コア制約（プロダクトの前提）

- **完全クライアントサイド処理**: すべてのツールはブラウザ内の JavaScript（および wasm）のみで動作し、ユーザーが入力・選択したデータ（テキスト・ファイル・画像・カメラ映像など）をサーバーに送信しない。バックエンド API・DB を持たない。これはプライバシー訴求とゼロホスティングコストを両立させるための恒久的な設計方針であり、将来的にも変更しない。
- **静的サイト**: Astro の `output: static` でビルドし、Cloudflare Workers の静的アセット配信としてホストする。SSR・サーバーランタイムは存在しない。
- **CSP**: 厳格な Content-Security-Policy を適用する（`astro.config.mjs` の `security.csp`、`public/_headers`）。`connect-src` は同一オリジンと、アクセス解析（GA4・Cloudflare Web Analytics）の送信先のみに限定しており、それ以外の外部サーバーへの通信は仕組みとして遮断される。解析に送るのはイベント名とツールの slug 等に限り、ユーザーの入力内容は含めない。

## 3. 情報構造・ページ一覧

### 3.1 サイト共通UI・機能

- **サイドバー**: 常設のナビゲーション。カテゴリ別にツールを一覧表示し、カテゴリの開閉状態を localStorage で保持する。
- **トップページ**（`/`, `/en/`）: 全ツールをカードグリッドで一覧表示。キーワード検索（ツールごとの別名 `keywords` も対象）・カテゴリ絞り込み・新着表示を持つ（`src/lib/home-filter.ts`）。
- **コマンドパレット**: `Ctrl/⌘+K` でツールを横断検索して移動する。
- **お気に入り**: ツールを星印で登録し、サイドバー等から素早く開ける（localStorage、端末内のみ）。
- **キーボードショートカット**: `Ctrl/⌘+Enter`（実行）、`Alt+Shift+C`（コピー）など。一覧は `/shortcuts`。
- **入力補助**: 入力欄の貼り付け・クリア・サンプル挿入・文字数表示、URLクエリ（`?text=`）による初期値指定、入力値の sessionStorage 保持（再読込・言語切替後の復元）。秘密情報を扱うツール（`sensitive`）では初期値指定・保持を行わない。
- **ロケール切り替え**: サイドバー/ヘッダーの言語スイッチャーからユーザーが明示的に切り替える（Accept-Language 等による自動リダイレクトは行わない）。
- **テーマ**: ライト/ダークの切り替えに対応する。
- **その他**: 「ブラウザ内で処理」バッジ、ページトップへ戻るボタン、SNS共有ボタン、印刷用スタイル、エラートースト。

### 3.2 静的ページ

| パス                    | 内容                                                      |
| ----------------------- | --------------------------------------------------------- |
| `/about`                | サイト運営者情報（個人運営、実名は非公開）                |
| `/contact`              | お問い合わせ                                              |
| `/faq`                  | よくある質問                                              |
| `/privacy-policy`       | プライバシーポリシー                                      |
| `/terms-of-service`     | 利用規約                                                  |
| `/shortcuts`            | キーボードショートカット一覧                              |
| `/updates`              | 更新情報（新規ツール・改修の履歴。`src/data/updates.ts`） |
| `/tools/category/<id>/` | カテゴリ別ランディングページ（カテゴリ内のツール一覧）    |
| `/404`                  | 404エラーページ                                           |

各ページは `en/` 配下に英語版が対になって存在する（`/404` を除く）。

### 3.3 ツールページ

各ツールは `/tools/<slug>/`（日本語）と `/en/tools/<slug>/`（英語）の2つのURLを持ち、SEO上インデックス対象の独立したページとして提供される。ページは共通の骨格（見出し・導入文・ツール本体・使い方・注意事項・用語集・ツール別FAQ・関連ツール）で構成される。

## 4. ツールカタログ

2026-10-15 時点で **220個** のツールを **15カテゴリ** で提供している。ツールの追加は頻繁なため、**個々のツール一覧は本書に転記せず、`src/data/tools.ts`（レジストリ）を正とする**。カテゴリID・表示名・件数・代表的なツールは次のとおり。

| カテゴリID | 表示名（ja / en）                   | 件数 | 代表的なツール（slug）                                                                                                |
| ---------- | ----------------------------------- | ---: | --------------------------------------------------------------------------------------------------------------------- |
| `text`     | テキスト / Text                     |   26 | `char-counter`, `zenkaku-hankaku`, `kana-converter`, `text-diff`, `encoding-converter`, `morse-code-converter`        |
| `data`     | データ変換 / Data Formats           |   19 | `json-formatter`, `yaml-json-converter`, `csv-json-converter`, `sql-formatter`, `markdown-preview`, `json-diff`       |
| `encode`   | エンコード/デコード / Encode/Decode |    6 | `base64`, `url-encode`, `html-escape`, `jwt-decoder`                                                                  |
| `datetime` | 日付・時間 / Date & Time            |   13 | `unix-timestamp`, `cron-parser`, `japanese-era-converter`, `date-calculator`, `timezone-converter`                    |
| `image`    | 画像・デザイン / Image & Design     |   33 | `color-converter`, `image-converter`, `image-resizer`, `svg-optimizer`, `contrast-checker`, `heic-converter`          |
| `pdf`      | PDF                                 |    9 | `pdf-merge-split`, `pdf-compressor`, `pdf-page-editor`, `pdf-password-protector`, `pdf-to-markdown`                   |
| `calc`     | 計算 / Calculate                    |   28 | `hourly-wage-calculator`, `tax-calculator`, `bmi-calculator`, `unit-converter`, `mortgage-calculator`                 |
| `dev`      | 開発 / Development                  |   27 | `regex-tester`, `chmod-calculator`, `cidr-calculator`, `json-path-tester`, `css-gradient-generator`, `curl-converter` |
| `generate` | 生成 / Generate                     |   10 | `uuid-generator`, `password-generator`, `hash-generator`, `qr-generator`, `barcode-generator`                         |
| `camera`   | カメラ / Camera                     |    4 | `webcam-tester`, `qr-code-reader`, `id-photo-maker`, `camera-color-picker`                                            |
| `security` | セキュリティ / Security             |   10 | `password-strength-checker`, `crypto-encryptor`, `hmac-generator`, `totp-generator`, `bcrypt-generator`               |
| `file`     | ファイル / File                     |    3 | `file-hash-calculator`, `zip-tool`, `file-type-detector`                                                              |
| `hardware` | ハードウェア / Hardware             |    7 | `mic-tester`, `keyboard-tester`, `dead-pixel-checker`, `gamepad-tester`, `screen-recorder`                            |
| `media`    | 動画・音声 / Video & Audio          |    3 | `media-converter`, `video-to-gif`, `metronome-bpm`                                                                    |
| `games`    | ゲーム・エンタメ / Games & Fun      |   22 | `roulette-dice`, `amidakuji-generator`, `typing-test`, `sudoku`, `reversi`, `picross`                                 |

- サイドバー・トップの表示順は、レジストリ上のツール登録順での各カテゴリの初出順。
- ツールのフラグ: `sensitive`（秘密・個人情報・健康・収入を扱う。URL初期値・入力保持の対象外）、`heavy`（wasm・PDF処理等の重いライブラリを読み込む）、`needsCamera`（カメラ・マイク権限を要求）、`ads`（広告表示可否）。
- 各ツールの厳密な入出力仕様・エッジケースの扱いは、対応する `src/lib/tools/<slug>.ts`（ロジック）とそのテスト（`src/lib/tools/<slug>.test.ts`）を正とする。本ドキュメントは概要のサマリであり、詳細実装追従はしない。

## 5. 機能横断の仕様

- **言語**: 日本語（デフォルト、パスプレフィックスなし）・英語（`/en/` 配下）。将来的な多言語追加はロケールディレクトリを増やすだけで対応できる設計（[`.claude/docs/growth.md`](../.claude/docs/growth.md)）。
- **SEO**: ツールごとに個別の `title`/`description`、`<h1>` は1つのみ、関連ツールへの内部リンク、hreflang・canonical・OGP・JSON-LD（`SoftwareApplication` / `BreadcrumbList` / `FAQPage`）・サイトマップ・robots.txt を整備。
- **コンテンツの厚み**: 全ツールに導入文・使い方・注意事項・ツール別FAQ（用語が多いツールは用語集）を持たせ、薄いテンプレートページを避ける。
- **レスポンシブ**: モバイルファースト。375px前後の狭い画面幅でもレイアウト崩れ・意図しない横スクロールが発生しないこと。タップ領域は目安44px四方以上。
- **アクセシビリティ/UX**: 入力に対してリアルタイム（デバウンス等を用いつつ即時に近い形）で結果を更新するインタラクションを基本とする。エラー時は分かりやすいメッセージを表示する。WCAG 2.x A/AA（コントラスト比・ラベル・フォーカス等）を axe による自動検査で担保する。
- **セキュリティ**: 厳格な CSP を適用。ユーザー入力を innerHTML 等で描画する箇所は XSS 対策（サニタイズ、例: `dompurify`）を行う。HTML として描画するツールは URL クエリでの初期値指定の対象外とする。

## 6. 非機能要件

| 項目           | 方針                                                                                                                                                                                                                                         |
| -------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| ホスティング   | Cloudflare Workers（静的アセット配信）。サーバーランタイムなし。GitHub Actions（`main` へのマージ後に CI 成功でデプロイ）                                                                                                                    |
| パフォーマンス | Astro の既定でJSゼロ出力を維持し、ツールごとに必要な最小限のスクリプトのみ読み込む。リンクホバー時の prefetch でページ遷移を高速化。ページ別JSバンドルサイズに予算を設ける（通常 gzip 120KB、`heavy` ツール 520KB。`pnpm run check:bundle`） |
| ブラウザ対応   | モダンブラウザを想定。prefetch 非対応ブラウザ等でのグレースフルデグラデーションは許容                                                                                                                                                        |
| データ保存     | サーバー側にユーザーデータを保存しない。ブラウザの localStorage（サイドバー開閉・テーマ・お気に入り等）と sessionStorage（入力値の一時保持）をUI状態保持の範囲でのみ使用                                                                     |
| アクセス解析   | GA4 と Cloudflare Web Analytics を利用。送信するのはコピー/ダウンロード/例外などのイベント名とツール slug のみで、ユーザーの入力内容は送信しない                                                                                             |
| テスト         | ツールロジック（`src/lib/tools/*.ts`）は Vitest による単体テスト、ブラウザ挙動・CSP・375px幅・アクセシビリティは Playwright による E2E テストでカバー。CI は lint・型チェック・単体テスト・ビルド・バンドル予算・E2E（3分割）を実行          |

## 7. 技術スタック（サマリ）

| レイヤー             | 技術                                                              |
| -------------------- | ----------------------------------------------------------------- |
| フレームワーク       | Astro（`output: static`）                                         |
| スタイリング         | Tailwind CSS v4                                                   |
| 言語                 | TypeScript                                                        |
| UIインタラクティブ層 | 素の DOM 操作（React/Vue/Svelte 等のアイランドは原則使用しない）  |
| テスト               | Vitest（単体）/ Playwright（E2E、axe によるアクセシビリティ検査） |
| デプロイ             | Cloudflare Workers（`wrangler.jsonc`）                            |

詳細は [`.claude/docs/architecture.md`](../.claude/docs/architecture.md) を参照。

## 8. スコープ外（現時点で対応しない事項）

- ユーザーアカウント・ログイン機能
- サーバーサイドでのデータ処理・保存・API提供
- ツール間でのデータ連携・サーバー保存の履歴機能（入力値の端末内一時保持を除き、ブラウザを閉じると状態は失われる想定）
- ネイティブアプリ / PWAオフライン対応（現時点では未計画）
- 日本語・英語以外の言語（将来的な拡張余地はあるが未着手）

## 9. 変更管理

本ドキュメントは主要な機能追加（新カテゴリの新設、共通機能の追加、対応言語の追加など）があった際に更新する。個々のツール追加は本書の更新不要で、ツール数・一覧の正は常に `src/data/tools.ts` とする（カテゴリ別件数は新カテゴリ追加時や大きな増減のときに見直す）。
