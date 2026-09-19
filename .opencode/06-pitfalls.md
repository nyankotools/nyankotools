# 06. ハマりどころ集

既存のドキュメントとコードから拾った、間違えやすい点。実装・レビューの前に目を通す。

## 実装で間違えやすい点

| 症状・間違い                                     | 正しいやり方                                                                                                          |
| ------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------- |
| `<script>` から frontmatter の変数を使おうとする | `<script>` は frontmatter の変数を直接参照できない。文言は `data-*` 属性でDOMに埋め込み、`element.dataset.xxx` で読む |
| リンク入りの文を文字列分割して組み立てる         | `<a>` 入りの完結した1本の文字列（`introHtml`）にして、`set:html` で描画する                                           |
| en のリンク先が `/tools/...` になっている        | ja は `/tools/...`、en は `/en/tools/...`                                                                             |
| ロジックにエラー文言を書く                       | `src/lib/tools/` に文言を置かない。文言は `src/i18n/tools/<slug>.ts` の辞書へ                                         |
| ja だけ作って en を忘れる                        | 辞書もラッパー（`src/pages/en/tools/<slug>/index.astro`）も必ず両方作る                                               |
| `tools.ts` に登録しない                          | ナビとトップに出ない。`translations.ja` / `.en`（`category` 含む）を登録する                                          |
| `tools.ts` の説明をページの `description` に流用 | ページ専用の `title` / `description` を辞書に別途書く                                                                 |
| `<h1>` を複数書く                                | 1ページに1つだけ                                                                                                      |
| ページの `.astro` にロジックを直接書く           | `src/lib/tools/<slug>.ts` に純粋関数で書き、`<script>` から import する                                               |
| ja / en ラッパーの import パスをコピペで間違える | en は階層が1段深い（`../../../../components/...`）                                                                    |
| 新しいカテゴリ名を勝手に作る                     | 既存カテゴリに揃える（`02-add-tool-recipe.md` 参照）                                                                  |

## 環境・依存で間違えやすい点

- **`typescript` を 7.x に上げない。** `6.0.3` 固定。`astro check` と `typescript-eslint` が未対応。
- **Tailwind は v4。** `@tailwindcss/vite` を使う。古い `@astrojs/tailwind` 統合や `tailwind.config.js` 前提の書き方をしない。
- **`og:image` の実体が無い。** `https://nyankotools.com/ogp.png` を指すが、`public/` にまだ無い。既知の課題なので、勝手に直さず必要ならユーザーに確認する。
- **`<head>` は `Layout.astro` だけが書く。** ページごとにメタタグを複製しない。`title` / `description` / `ogImage` を props で渡す。
- **依存を勝手に追加しない。** 新しいライブラリが必要なら、理由を添えてユーザーに確認する（クライアントに配信される JS の量に直結する）。
- 既存ツールの一部は、まだ「ja / en 別ファイルの完全複製」のまま（`src/components/tool-pages/` に対応ファイルが無いツール）。**新規ツールは必ず共有コンポーネント方式**。既存の複製方式を真似しない。

## 進め方で間違えやすい点

- 参照実装を読まずに、記憶だけで雛形を書く → 参照実装のパスは `02-add-tool-recipe.md`。まず開いて読む。
- 存在しないパス・関数名を想像で書く → 書く前に `Glob` / `Grep` で実在を確認する。
- 「動くはず」で完了報告する → 実行したコマンドと結果を必ず添える。実行していないなら、していないと書く。
- 頼まれていない改善やリファクタを混ぜる → スコープ外は提案として報告するだけにする。
- `git commit` を勝手にする → ユーザーの明示指示があるまで禁止。

## 関連する元ドキュメント

- `.claude/docs/adding-a-tool.md`、`.claude/docs/growth.md`、`.claude/docs/conventions.md`
