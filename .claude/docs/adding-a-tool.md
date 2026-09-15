# 設計書: 新しいツールの追加手順

新規ツールを1つ追加する際に触る必要がある箇所と手順。全体構成は [architecture.md](./architecture.md) を参照。

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

   - `Layout` コンポーネントで全体をラップし、`title` と `description`（SEO 用の説明文。「データはブラウザ内で処理され、サーバーには送信されません」等プライバシー訴求も含めるとよい）を渡す。
   - フォームや結果表示など静的マークアップを Astro テンプレート部分に書く。
   - `<script>` タグ内で手順 1 の関数を import し、`input` イベント等に応じて DOM を更新する。React/Vue/Svelte のアイランドは使わない。

3. **レジストリに登録する**: `src/data/tools.ts` の `tools` 配列に `{ slug, name, description }` を追加する。ここに登録しないとトップページのグリッドにもサイドバーナビゲーションにも表示されない。

4. **確認する**:
   - `pnpm dev` でローカル起動し、サイドバー・トップページ・`/tools/<slug>/` の直接アクセスを確認する。
   - `pnpm exec astro check` で型チェック。
   - `pnpm run lint` / `pnpm run format` でスタイルを揃える。
   - `pnpm build` でビルドが通ることを確認する。

## チェックリスト

- [ ] `src/lib/tools/<slug>.ts` にロジックを実装した
- [ ] `src/pages/tools/<slug>/index.astro` を `Layout` でラップした
- [ ] `src/data/tools.ts` に登録した
- [ ] クライアントサイドのみで完結し、サーバーに一切データを送っていない
- [ ] `astro check` / `lint` / `format` / `build` が通る
