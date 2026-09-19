# 08. ツール番号（No.xxx）

ユーザーから「**No.045 を実装して**」のように番号で指示されたら、この表で `slug` を引く。番号は `memo/実装予定一覧.md` の各行の `No.xxx` と同じもの。

## ルール

- 番号は**ツール固有の固定ID**。実装済みになっても、Phase を移しても、**変更・再利用しない**（欠番はそのまま）。
- 表に載っているのは番号・`slug`・名称・Phase だけ。**要件・注意点・参考サイトは `memo/実装予定一覧.md` の該当行に書いてある**（`memo/` は git 管理外だが、この PC 上にある）。実装前に必ずその行を読む。
- 実装済みかどうかは、この表ではなく `src/data/tools.ts` で確認する（表の更新漏れを避けるため、状態は持たない）。
- **新規ツールを一覧に追加するとき**は、現在の最大番号の次（`No.081` から）を付け、`memo/実装予定一覧.md` とこの表の**両方**に同じ番号・`slug` で追記する。
- 番号が指す `slug` が表と `memo/` で食い違っていたら、実装せずユーザーに報告する。
- 指示された番号が表にない場合も、推測で決めずユーザーに聞く。

## 実装の進め方（番号で指示されたとき）

1. この表で `slug` と名称を確認する。
2. `memo/実装予定一覧.md` で `No.xxx` の行を探し、要件・注意点を読む。
3. `src/data/tools.ts` に同じ `slug` が既にないか確認する（ある場合は実装済み。ユーザーに報告して止まる）。
4. `02-add-tool-recipe.md` に従って実装 → レビュー → QA（`01-workflow.md`）。
5. 完了したら `memo/実装予定一覧.md` の該当行にチェックを入れ「実装済み」セクションへ移す（番号は変えない）。

## No.001〜038: 2026-09-19 時点で実装済み

| No. | slug                     | 名称                                                               |
| --- | ------------------------ | ------------------------------------------------------------------ |
| 001 | `char-counter`           | 文字数カウント                                                     |
| 002 | `json-formatter`         | JSON整形                                                           |
| 003 | `base64`                 | Base64エンコード/デコード                                          |
| 004 | `url-encode`             | URLエンコード/デコード                                             |
| 005 | `uuid-generator`         | UUID生成                                                           |
| 006 | `password-generator`     | パスワード生成                                                     |
| 007 | `hash-generator`         | ハッシュ生成（MD5/SHA-1/SHA-256）                                  |
| 008 | `qr-generator`           | QRコード生成                                                       |
| 009 | `color-converter`        | カラーコード変換（HEX/RGB/HSL）                                    |
| 010 | `unix-timestamp`         | Unixタイムスタンプ変換                                             |
| 011 | `zenkaku-hankaku`        | 全角/半角変換                                                      |
| 012 | `kana-converter`         | ひらがな/カタカナ変換                                              |
| 013 | `yaml-json-converter`    | YAML ⇔ JSON 変換                                                   |
| 014 | `csv-json-converter`     | CSV ⇔ JSON 変換                                                    |
| 015 | `markdown-preview`       | Markdown ⇔ HTML 変換（プレビュー付き）                             |
| 016 | `html-escape`            | HTML/JS文字列エスケープ・アンエスケープ                            |
| 017 | `kishu-izon-checker`     | 機種依存文字（環境依存文字）チェッカー                             |
| 018 | `regex-tester`           | 正規表現テスター                                                   |
| 019 | `text-diff`              | テキスト差分比較（diff）                                           |
| 020 | `jwt-decoder`            | JWTデコーダー                                                      |
| 021 | `lorem-ipsum`            | ダミーテキスト生成（Lorem ipsum / 日本語版）                       |
| 022 | `text-list-tools`        | 文字列の重複削除・ソート・シャッフル                               |
| 023 | `line-ending-converter`  | 改行コード変換（CRLF/LF/CR）                                       |
| 024 | `cron-parser`            | Cron式スケジュールシミュレーター                                   |
| 025 | `japanese-era-converter` | 和暦⇔西暦変換（元号早見表）                                        |
| 026 | `date-calculator`        | 日数計算機（二つの日付の差・N日後の日付）                          |
| 027 | `age-calculator`         | 年齢計算機                                                         |
| 028 | `hourly-wage-calculator` | 時給・日給換算/残業代計算機                                        |
| 029 | `tax-calculator`         | 消費税・割引計算機                                                 |
| 030 | `sql-formatter`          | SQL整形・ミニファイ                                                |
| 031 | `code-minifier`          | CSS/JS/HTMLミニファイ＆整形                                        |
| 032 | `chmod-calculator`       | Chmodパーミッション計算機                                          |
| 033 | `cidr-calculator`        | ネットワーク計算機（CIDR/Subnet）                                  |
| 034 | `keycode-checker`        | キーコード（e.code/e.key）チェッカー                               |
| 035 | `viewport-checker`       | スクリーンサイズ・Viewportチェッカー                               |
| 036 | `json-path-tester`       | JSON Path / JSON Pointerテスター                                   |
| 037 | `toml-converter`         | TOML ⇔ JSON/YAML変換                                               |
| 038 | `text-case-converter`    | テキストケース変換（camelCase/snake_case/kebab-case/PascalCase等） |

## No.039〜080: 2026-09-19 時点で未実装

| No. | slug                              | 名称                                                          | Phase |
| --- | --------------------------------- | ------------------------------------------------------------- | ----- |
| 039 | `ratio-calculator`                | 割合・比率計算機                                              | C     |
| 040 | `bmi-calculator`                  | BMI計算機                                                     | C     |
| 041 | `freelance-income-calculator`     | フリーランス手取り・税金簡易試算                              | C     |
| 042 | `mortgage-calculator`             | 住宅ローン繰り上げ返済比較                                    | C     |
| 043 | `investment-simulator`            | 資産運用シミュレーション                                      | C     |
| 044 | `scholarship-repayment-simulator` | 奨学金返済シミュレーション                                    | C     |
| 045 | `image-converter`                 | 画像フォーマット変換（PNG/JPEG → WebP）                       | D     |
| 046 | `image-resizer`                   | 画像リサイズ・圧縮                                            | D     |
| 047 | `image-to-base64`                 | 画像のBase64（Data URL）変換                                  | D     |
| 048 | `favicon-generator`               | favicon一括生成                                               | D     |
| 049 | `exif-viewer`                     | EXIF情報表示・削除                                            | D     |
| 050 | `image-pixelart-converter`        | 画像ドット絵化・モザイク・減色処理                            | D     |
| 051 | `image-palette-extractor`         | 画像カラーパレット抽出                                        | D     |
| 052 | `svg-optimizer`                   | SVG最適化（SVGO）                                             | D     |
| 053 | `placeholder-image-generator`     | ダミー画像生成（Placeholder Image）                           | D     |
| 054 | `pdf-merge-split`                 | PDF結合・分割・ページ抽出                                     | D     |
| 055 | `pdf-image-converter`             | PDF ⇔ 画像（PNG/JPEG）変換                                    | D     |
| 056 | `pdf-compressor`                  | PDF圧縮                                                       | D     |
| 057 | `pdf-page-editor`                 | PDFページ操作（回転・削除・並び替え・パスワード解除）         | D     |
| 058 | `image-prompt-builder`            | 画像生成AI（Midjourney/Stable Diffusion）用プロンプトビルダー | E     |
| 059 | `llm-role-prompt-builder`         | ChatGPT等LLM用ロールプレイ・役割定義テンプレート生成          | E     |
| 060 | `encoding-converter`              | 文字コード変換・文字化け診断（Shift-JIS/EUC-JP/UTF-8）        | F     |
| 061 | `kanji-number-converter`          | 漢数字⇔算用数字・大字変換                                     | F     |
| 062 | `romaji-kana-converter`           | ローマ字⇔ひらがな変換                                         | F     |
| 063 | `my-number-checker`               | マイナンバー・法人番号チェックデジット検証                    | F     |
| 064 | `favorites`                       | ツールのお気に入り登録機能                                    | G     |
| 065 | `crypto-encryptor`                | 暗号化・復号化（AES-GCM/RSA）                                 | H     |
| 066 | `hmac-generator`                  | HMAC署名生成                                                  | H     |
| 067 | `totp-generator`                  | TOTP（2段階認証）コード生成・検証                             | H     |
| 068 | `keypair-generator`               | キーペア生成（RSA/ECC/Ed25519）                               | H     |
| 069 | `curl-converter`                  | cURL ⇔ Fetch/Axios変換                                        | I     |
| 070 | `openapi-viewer`                  | OpenAPI（Swagger）/ JSON Schemaビューア                       | I     |
| 071 | `http-header-analyzer`            | HTTPヘッダー解析・構成生成                                    | I     |
| 072 | `json-tree-viewer`                | JSONツリービューア・インタラクティブエクスプローラー          | J     |
| 073 | `media-converter`                 | 動画/音声変換・トリミング・圧縮                               | J     |
| 074 | `data-recipe-builder`             | 多段エンコード/デコード・ハッシュ変換チェーン（レシピ機能）   | J     |
| 075 | `text-merge-tool`                 | テキストマージツール（2バージョンの統合編集）                 | J     |
| 076 | `privacy-script-generator`        | OS別プライバシー・セキュリティ設定スクリプト生成              | J     |
| 077 | `id-photo-maker`                  | 証明写真作成（履歴書・エントリーシート用）                    | K     |
| 078 | `qr-code-reader`                  | QRコード/バーコードリーダー（カメラ読み取り）                 | K     |
| 079 | `webcam-tester`                   | Webカメラ動作確認ツール                                       | K     |
| 080 | `camera-color-picker`             | カメラ映像からカラーコード抽出（リアルタイムスポイト）        | K     |
