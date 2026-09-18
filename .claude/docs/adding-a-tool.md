# 設計書: 新しいツールの追加手順

新規ツールを1つ追加する際に触る必要がある箇所と手順。全体構成は [architecture.md](./architecture.md) を参照。SEO・レスポンシブ対応の詳細ルールは [growth.md](./growth.md) を参照。

## 手順

1. **ロジックを書く**: `src/lib/tools/<slug>.ts` に、入力を受け取って結果を返す純粋関数群を実装する。DOM や Astro に依存しないため、単体で読める・テストできる状態にする。

   例（`char-counter.ts`）:

   ```ts
   export interface CharCounterResult {
     characters: number;
     charactersNoSpaces: number;
     words: number;
     lines: number;
   }

   export function countText(text: string): CharCounterResult {
     // ...
   }
   ```

2. **ツール専用の文言辞書を作る**: `src/i18n/tools/<slug>.ts` に `Record<Locale, XxxContent>`（`Locale` は `'ja' | 'en'`）の形で、そのページに必要な文言（title/description/見出し/ラベル/プレースホルダー/エラーメッセージ/用語解説など）を ja/en 両方ぶん定義する。
   - どちらも `src/data/tools.ts` の説明文とは別に、そのページ専用の meta 情報として `title` / `description` を設計する（想定するロングテール検索キーワードを先に決めてから文言化する。「データはブラウザ内で処理され、サーバーには送信されません」等プライバシー訴求も含めるとよい）。英語版は日本語の直訳ではなく、英語圏での検索を意識した自然な文言にする。
   - 文中にリンクを含む文（関連ツールへの内部リンクなど）は、前後の文字列を分割してJSXで組み立てるのではなく、`<a>` タグを含んだ完結した1本の文字列（例: `introHtml`）として持たせ、テンプレート側で `set:html` で描画する（`src/i18n/tools/base64.ts` を参考にする。ja版のリンク先は `/tools/...`、en版は `/en/tools/...` を指すこと）。

3. **共有ページコンポーネントを作る**: `src/components/tool-pages/<Slug>Page.astro` に、実際のマークアップと `<script>` を1つだけ実装する。`locale: Locale` を prop として受け取り、手順2の辞書から文言を解決して描画する（`src/components/tool-pages/Base64Page.astro` が実装例）。

   - `Layout` コンポーネントで全体をラップし、辞書の `title` / `description` を渡す。
   - `<h1>` は1つだけにし、ツール名・解決する課題が伝わる具体的な文言にする。可能なら関連する既存ツールへの内部リンクを本文中に置く。
   - フォームや結果表示など静的マークアップを Astro テンプレート部分に書く。狭い画面幅（375px前後）でも崩れないか意識する。
   - `<script>` タグ内で手順 1 の関数を import し、`input` イベント等に応じて DOM を更新する。React/Vue/Svelte のアイランドは使わない。`<script>` は frontmatter の変数を直接参照できないため、コピー成功メッセージやエラーメッセージなどロケール依存の文言は `data-*` 属性でDOMに埋め込み、スクリプト側で `element.dataset.xxx` として読み取る（`base64-error` の `data-message` 等を参照）。ロジック層（`src/lib/tools/<slug>.ts`）には文言を持たせない。

4. **ロケール別のページファイルを作る（ja / en 両方）**: `src/pages/tools/<slug>/index.astro`（ja）と `src/pages/en/tools/<slug>/index.astro`（en）を作成する。それぞれ手順3の共有コンポーネントを `locale` だけ変えて呼び出す薄いラッパーにする（マークアップは書かない）。

   ```astro
   ---
   import <Slug>Page from '../../../components/tool-pages/<Slug>Page.astro';
   ---
   <<Slug>Page locale="ja" />
   ```

5. **レジストリに登録する**: `src/data/tools.ts` の `tools` 配列に、`slug` と `translations.ja` / `translations.en`（各 `{ name, description, category }`）を持つエントリを追加する。これはトップページのグリッドやサイドバーナビゲーション用の短い文言で、手順2のページ本体用辞書とは別物。ここに登録しないとトップページのグリッドにもサイドバーナビゲーションにも表示されない。`category` はトップページの検索・カテゴリ絞り込み（`src/lib/home-filter.ts`）に使われる。既存のカテゴリ名と表記を揃えられないか先に確認し、揃えられない場合のみ新しいカテゴリ名にする（`category` も ja/en それぞれで用意する）。

6. **確認する**:
   - `pnpm dev` でローカル起動し、サイドバー・トップページ・`/tools/<slug>/` と `/en/tools/<slug>/` の両方への直接アクセスを確認する。
   - `pnpm exec astro check` で型チェック。
   - `pnpm run lint` / `pnpm run format` でスタイルを揃える。
   - `pnpm build` でビルドが通ることを確認する。
   - 必要に応じて `e2e/<slug>.spec.ts` に Playwright の E2E テストを追加し、`pnpm run test:e2e` で確認する（詳細は [conventions.md](./conventions.md) 参照）。
   - 実装が完了したら、[CLAUDE.md](../../CLAUDE.md) の「レビュー・テストのルール」に従い、独立したレビュー専任エージェント（`tool-reviewer`）にレビューを依頼し、その完了報告を受けてから独立したQA専任エージェント（`tool-qa`）にテスト（lint / 型チェック / ビルド / 単体テスト / E2E・エッジケースの網羅性）を依頼する。`/tool-review` / `/qa-test` コマンドで手動起動することもできる。

補足: この「共有コンポーネント＋辞書＋薄いラッパー」構成は、対応言語を将来さらに増やしていく前提の標準パターン（詳細は [growth.md](./growth.md) の「多言語化」）。既存ツールの一部はまだ ja/en 別ファイルの完全複製のままだが、新規ツールは必ずこの構成で実装する。

## チェックリスト

- [ ] `src/lib/tools/<slug>.ts` にロジックを実装した（UI文言を持たない）
- [ ] `src/i18n/tools/<slug>.ts` に ja/en の文言辞書を実装した
- [ ] `src/components/tool-pages/<Slug>Page.astro` を `Layout` でラップし、辞書から文言を解決するよう実装した
- [ ] `src/pages/tools/<slug>/index.astro`（ja）と `src/pages/en/tools/<slug>/index.astro`（en）を、共有コンポーネントを呼ぶだけの薄いラッパーにした
- [ ] `src/data/tools.ts` に `translations.ja` / `translations.en`（`category` 含む）を登録した
- [ ] クライアントサイドのみで完結し、サーバーに一切データを送っていない
- [ ] ページ専用の `title` / `description` を ja/en それぞれ設計し、`<h1>` は1つだけにした（[growth.md](./growth.md) 参照）
- [ ] 375px前後の狭い画面幅でもレイアウトが崩れないことを確認した
- [ ] `astro check` / `lint` / `format` / `build` が通る
