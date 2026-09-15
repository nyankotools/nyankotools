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

2. **ページを作る**: `src/pages/tools/<slug>/index.astro` を作成する。

   - `Layout` コンポーネントで全体をラップし、`title` と `description` を渡す。どちらも `src/data/tools.ts` の説明文とは別に、そのページ専用の meta 情報として設計する（想定するロングテール検索キーワードを先に決めてから文言化する。「データはブラウザ内で処理され、サーバーには送信されません」等プライバシー訴求も含めるとよい）。
   - `<h1>` は1つだけにし、ツール名・解決する課題が伝わる具体的な文言にする。可能なら関連する既存ツールへの内部リンクを本文中に置く。
   - フォームや結果表示など静的マークアップを Astro テンプレート部分に書く。狭い画面幅（375px前後）でも崩れないか意識する。
   - `<script>` タグ内で手順 1 の関数を import し、`input` イベント等に応じて DOM を更新する。React/Vue/Svelte のアイランドは使わない。

3. **レジストリに登録する**: `src/data/tools.ts` の `tools` 配列に `{ slug, name, description, category }` を追加する。ここに登録しないとトップページのグリッドにもサイドバーナビゲーションにも表示されない。`category` はトップページの検索・カテゴリ絞り込み（`src/lib/home-filter.ts`）に使われる。既存のカテゴリ名と表記を揃えられないか先に確認し、揃えられない場合のみ新しいカテゴリ名にする。

4. **確認する**:
   - `pnpm dev` でローカル起動し、サイドバー・トップページ・`/tools/<slug>/` の直接アクセスを確認する。
   - `pnpm exec astro check` で型チェック。
   - `pnpm run lint` / `pnpm run format` でスタイルを揃える。
   - `pnpm build` でビルドが通ることを確認する。
   - 必要に応じて `e2e/<slug>.spec.ts` に Playwright の E2E テストを追加し、`pnpm run test:e2e` で確認する（詳細は [conventions.md](./conventions.md) 参照）。

## チェックリスト

- [ ] `src/lib/tools/<slug>.ts` にロジックを実装した
- [ ] `src/pages/tools/<slug>/index.astro` を `Layout` でラップした
- [ ] `src/data/tools.ts` に `category` を含めて登録した
- [ ] クライアントサイドのみで完結し、サーバーに一切データを送っていない
- [ ] ページ専用の `title` / `description` を設計し、`<h1>` は1つだけにした（[growth.md](./growth.md) 参照）
- [ ] 375px前後の狭い画面幅でもレイアウトが崩れないことを確認した
- [ ] `astro check` / `lint` / `format` / `build` が通る
