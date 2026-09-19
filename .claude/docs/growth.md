# 開発ルール: 収益化に向けた成長戦略（SEO・レスポンシブ・多言語化）

NyankoTools は将来的な収益化（広告掲載・アフィリエイト等を想定）を目指している。収益化の前提はオーガニック検索からの継続的な流入とユーザー体験であり、新しいツール・ページを追加する際は以下を必ず意識すること。プロジェクト全体の前提は [CLAUDE.md](../../CLAUDE.md) を参照。

## SEO

- **ページごとに `title` / `description` を個別に設計する。** `src/data/tools.ts` の `description` はトップページ・サイドバー用の短い説明であり、ツールページ本体の `<Layout description=...>` にはそれとは別に、meta description として適切な長さ・文言のものを渡す（使い回さない）。
- **ロングテールキーワードを最初に言語化する。** 新規ツールを追加する前に「どんな検索語で流入してほしいか」（例:「JSON 整形 オンライン 無料」等）を決め、それを `title` / `description` / 本文の見出しに反映する。一般的すぎる語だけに頼らない。
- **見出し構造。** 各ページの `<h1>` は1つだけにし、ツール名や解決する課題を具体的に表す文言にする。`<h2>` 以下で使い方・注意点などを補足すると内容の厚みが増しSEO上も有利。
- **内部リンク。** 関連する既存ツールへのリンクをページ本文中に設置し、クローラビリティとユーザーの回遊性を高める。新規ツール追加時は関連しそうな既存ツールを最低1つは探してリンクする。
- **OGP画像。** `og:image` の既定は `https://nyankotools.com/ogp.png`（実体は `public/ogp.png`）。ツール専用のOGP画像を用意できる場合は `ogImage` prop で個別に渡す。共通画像のままでも構わないが、参照先の画像ファイル自体は必ず存在させる。
- **サイトマップ・robots.txt。** `astro.config.mjs` の `site` は設定済みなので、`@astrojs/sitemap` 等でサイトマップを生成し `public/robots.txt` を整備することを検討する（未導入の場合は提案する）。
- **構造化データ（JSON-LD）。** ツールの性質に応じて `SoftwareApplication` や `FAQPage` 等のスキーマ追加を検討する。

## レスポンシブ対応

- Tailwind のブレークポイントはモバイルファーストで書く（既存の `sm:` `md:` の使い方に倣う。`src/layouts/Layout.astro` のサイドバー/ハンバーガーメニューの実装がお手本）。
- 新しいUIを追加する際は、375px前後の狭い画面幅でもレイアウト崩れ・意図しない横スクロールが発生しないことを確認する。
- タップで操作する要素（ボタン・リンク・チェックボックス等）は十分なタップ領域（目安 44px 四方以上）を確保する。
- `pnpm dev` でブラウザの幅を変えながら実機確認する。375px幅での横スクロール有無は、`e2e/tools-common.spec.ts` が `src/data/tools.ts` の登録簿から全ツール（日英）分を自動検証するため、ツール個別の E2E には書かなくてよい。

## 多言語化

- 日本語（`ja`、デフォルトロケール）と英語（`en`）に対応済み。Astro 組み込みの `i18n` ルーティング機能を使用し、`astro.config.mjs` で `defaultLocale: 'ja'` / `locales: ['ja', 'en']` / `routing.prefixDefaultLocale: false` を設定している。ja はプレフィックスなし（`/tools/<slug>/`）、en は `/en/` 配下（`/en/tools/<slug>/`）という URL 構成。
- **ルーティングはロケール別ディレクトリ。** `src/pages/tools/<slug>/index.astro`（ja）と `src/pages/en/tools/<slug>/index.astro`（en）が実URLに対応する（Astro の i18n ルーティング機能が前提とする構成）。トップページや利用規約等の静的ページも同様に `src/pages/en/` 配下に対になるページを置く。将来 3言語目以降を追加する場合も、ロケールコードのディレクトリを増やすだけでよい。
- **ページの中身は「共有コンポーネント＋ロケール別の薄いルートファイル」で1ツール1箇所にまとめる（対応言語を増やしていく前提のための方針）。** 言語ごとに `.astro` ファイルを丸ごと複製すると、マークアップの変更を言語数ぶん手作業で反映する必要があり、対応言語が増えるほどコストが線形に増える。そのため以下の構成を標準とする（`base64` が実装例 = `src/i18n/tools/base64.ts` + `src/components/tool-pages/Base64Page.astro` + `src/pages/tools/base64/index.astro` + `src/pages/en/tools/base64/index.astro`）。
  - `src/i18n/tools/<slug>.ts`: そのツールのページ専用の文言（title/description/見出し/ラベル/プレースホルダー/エラーメッセージ/用語解説など）を `Record<Locale, XxxContent>` の辞書として持つ。文単位で保持し、文中にリンクを含む場合は文字列を分割して前後をJSXで組み立てるのではなく、`introHtml` のように `<a>` タグを含んだ完結した文字列を1本持たせ、テンプレート側は `set:html` で描画する（言語によって語順・リンク位置が変わっても破綻しないようにするため）。
  - `src/components/tool-pages/<Slug>Page.astro`: 実際のマークアップと `<script>` を1つだけ持つ共有コンポーネント。`locale` を prop として受け取り、`src/i18n/tools/<slug>.ts` の辞書から文言を解決して描画する。`<script>` 側でロケール別の文言（コピー成功/失敗メッセージ等）が必要な場合は、frontmatter から直接渡せないため `data-*` 属性経由でDOMに埋め込み、クライアント側スクリプトで読み取る。
  - `src/pages/tools/<slug>/index.astro` と `src/pages/en/tools/<slug>/index.astro` は、この共有コンポーネントを `locale` を変えて呼び出すだけの薄いラッパーにする。
  - 既存ツールはこの構成への移行を順次進めている途中で、未移行のツールは引き続き ja/en 別ファイルの完全複製のままになっている（移行済みかどうかは `src/components/tool-pages/` の有無で判別できる）。新規ツールを追加する場合はこの新しい構成で実装すること（詳細は [adding-a-tool.md](./adding-a-tool.md)）。
- **サイト共通UI文言**: サイドバー・フッター・トップページの見出し等、ツールをまたいで使う文言は `src/i18n/ui.ts` の `ui.ja` / `ui.en` 辞書に集約し、`useTranslations(locale)` が返す `t()` 関数経由で参照する（ツール固有文言の `src/i18n/tools/<slug>.ts` とは別の辞書）。
- **ツール名・説明文（ホーム/サイドバー用）**: `src/data/tools.ts` の `Tool.translations` に `{ ja: { name, description, category }, en: { name, description, category } }` の形で両ロケール分を持つ。`getLocalizedTools(locale)` で解決した配列がトップページ・サイドバーの表示に使われる（ツールページ本体の文言は上記の `src/i18n/tools/<slug>.ts` が別途持つ）。
- `src/lib/tools/<slug>.ts` のロジック関数はUI文言を持たない設計を保つ（既存の「フレームワーク非依存の純粋関数」方針と一致）。エラーメッセージ等どうしても文言が必要な場合は、`src/i18n/tools/<slug>.ts` の辞書に持たせ、ロジック層を文言から独立させる。
- **SEOメタ情報**: `src/layouts/Layout.astro` が以下をロケールに応じて自動的に出し分ける。個別ページ側で追加対応は不要。
  - `<html lang={lang}>`
  - 自己参照の `canonical`（ロケール版を1つのURLに集約しない）
  - `hreflang`（ja⇔enの相互参照＋自己参照＋`x-default`＝ja。`noindex` ページでは出力しない）
  - `og:locale` / `og:locale:alternate`（`ja_JP` / `en_US`）
  - JSON-LD の `inLanguage`
  - `astro.config.mjs` の `@astrojs/sitemap` 側 `i18n` オプションで、サイトマップにも hreflang alternate を出力している。
- ブラウザの `Accept-Language` やIPジオロケーションによる自動リダイレクトは行わない（Googleが非推奨とする方式のため）。ロケール切り替えはサイドバー/ヘッダーの言語スイッチャーからユーザーが明示的に行う。
