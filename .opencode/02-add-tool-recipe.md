# 02. 新規ツール追加のレシピ

`<slug>` は URL とファイル名に使う英小文字ハイフン区切り（例: `text-case-converter`）。`<Slug>` はそのパスカルケース（例: `TextCaseConverter`）。

**コードの雛形はここに複製しない。** 実在する参照実装を開いて、同じ形で作る。迷ったら参照実装が正。

## 事前に決めること（作り始める前）

1. **狙う検索キーワード**を決める（例:「JSON 整形 オンライン 無料」）。これを `title` / `description` / `<h1>` に反映する。
2. **関連する既存ツール**を最低1つ探す（本文からの内部リンク用）。`src/data/tools.ts` を見る。
3. **カテゴリ**は既存のものに揃える。ja: `テキスト` / `変換` / `エンコード/デコード` / `生成` / `計算` / `開発`。en: `Text` / `Convert` / `Encode/Decode` / `Generate` / `Calculate` / `Development`。新設するのは揃えられないときだけ。

## 作るファイルと参照実装

参照実装は `base64`（標準パターンの見本）と `text-case-converter`（直近の追加例）。

| 順  | 作るファイル                                  | 参照実装                                     |
| --- | --------------------------------------------- | -------------------------------------------- |
| 1   | `src/lib/tools/<slug>.ts`                     | `src/lib/tools/base64.ts`                    |
| 2   | `src/lib/tools/<slug>.test.ts`                | `src/lib/tools/text-case-converter.test.ts`  |
| 3   | `src/i18n/tools/<slug>.ts`                    | `src/i18n/tools/base64.ts`                   |
| 4   | `src/components/tool-pages/<Slug>Page.astro`  | `src/components/tool-pages/Base64Page.astro` |
| 5   | `src/pages/tools/<slug>/index.astro`（ja）    | `src/pages/tools/base64/index.astro`         |
| 6   | `src/pages/en/tools/<slug>/index.astro`（en） | `src/pages/en/tools/base64/index.astro`      |
| 7   | `src/data/tools.ts` に追記                    | 同ファイルの `base64` のエントリ             |
| 8   | `e2e/<slug>.spec.ts`                          | `e2e/base64.spec.ts`                         |

## 各ステップの要点

### 1. ロジック `src/lib/tools/<slug>.ts`

- 入力を受けて結果を返す**純粋関数**だけを書く。DOM・Astro・`window` に依存しない。
- **UI文言（エラーメッセージ等）を持たせない。** 失敗は例外や `null` / エラー種別で返し、文言は辞書側で解決する。

### 2. 単体テスト `src/lib/tools/<slug>.test.ts`

- 正常系、空文字、境界値、不正入力、日本語・絵文字などのマルチバイトを入れる。
- 実行: `pnpm exec vitest run src/lib/tools/<slug>.test.ts`

### 3. 文言辞書 `src/i18n/tools/<slug>.ts`

- `Record<Locale, XxxPageContent>`（`Locale` は `'ja' | 'en'`）。**ja と en の両方**を書く。
- 必須項目: `title`、`description`、`h1`、`introHtml`、各ラベル、プレースホルダー、エラーメッセージ、用語解説（専門用語がある場合）。
- `title` / `description` は `tools.ts` の説明文の使い回し禁止。ページ専用に書く。`description` には「データはブラウザ内で処理され、サーバーには送信されません」のようなプライバシー訴求を入れるとよい。
- en は日本語の直訳にせず、英語圏の検索を意識した自然な文にする。
- 文中にリンクがある文は、`<a>` を含む**完結した1本の文字列**（`introHtml`）にする。ja のリンク先は `/tools/...`、en は `/en/tools/...`。`set:html` で描画するので、**ユーザー入力を混ぜない**（固定リテラルのみ）。

### 4. 共有ページ `src/components/tool-pages/<Slug>Page.astro`

- `locale: Locale` を prop で受け取り、辞書から文言を引く。`<Layout title=... description=...>` で全体をラップする。
- `<h1>` は**1つだけ**。ツールの目的が伝わる具体的な文言にする。
- 用語解説は `src/components/Glossary.astro` を使う。注意書きは用語解説より前に置く。
- `<script>` 内で手順1の関数を import して DOM を更新する。
- **`<script>` から frontmatter の変数は読めない。** コピー成功メッセージやエラー文言は `data-*` 属性でDOMに埋め込み、`element.dataset.xxx` で読む（`Base64Page.astro` の `data-copied` / `data-message` を参照）。
- 375px 前後の狭い画面でも崩れないようにする。ボタン等のタップ領域は 44px 四方を目安に確保する。Tailwind はモバイルファーストで書く（`sm:` `md:` で広げる）。

### 5・6. ja / en のラッパー

- 共有コンポーネントを `locale` だけ変えて呼ぶ**薄いラッパー**にする。マークアップは書かない。
- 中身は `base64` のラッパーと同じ形。`import` の相対パス階層が ja と en で1段違うので注意（en は `../../../../components/...`）。

### 7. レジストリ `src/data/tools.ts`

- `tools` 配列に `{ slug, translations: { ja: { name, description, category }, en: { name, description, category } } }` を追加する。
- ここは**トップページ・サイドバー用の短い文言**。ページ本体の辞書とは別物。登録しないとナビに出ない。

### 8. E2E `e2e/<slug>.spec.ts`

- `/tools/<slug>/` に直接アクセスして `<h1>` を確認し、主要な入力→出力を確認する。en 版（`/en/tools/<slug>/`）も確認する。
- 実行: `pnpm exec playwright test e2e/<slug>.spec.ts`（**そのツールの spec だけ**。全体は流さない）

## 完了時のチェックリスト

- [ ] ロジックがフレームワーク非依存で、UI文言を持っていない
- [ ] ja / en の辞書、ja / en のラッパーが両方ある
- [ ] `tools.ts` に `category` 込みで ja / en 両方登録した
- [ ] サーバー通信が一切ない（`fetch` / `XMLHttpRequest` が無い）
- [ ] ページ専用の `title` / `description` があり、`<h1>` が1つ
- [ ] 関連ツールへの内部リンクが本文にある
- [ ] 375px 幅でレイアウトが崩れない
- [ ] `05-commands.md` の型チェック・lint・format・build が通る
- [ ] 予定ツールなら `memo/実装予定一覧.md` を更新した（`01-workflow.md`）

## 関連する元ドキュメント

- `.claude/docs/adding-a-tool.md`、`.claude/docs/growth.md`
