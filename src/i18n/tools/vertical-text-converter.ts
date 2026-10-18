import type { Locale } from '../../data/tools';

export interface VerticalTextConverterPageContent {
  title: string;
  description: string;
  h1: string;
  /** set:html で描画するため、開発者管理の固定リテラルのみを入れること（ユーザー入力を混ぜない） */
  introHtml: string;
  inputLabel: string;
  inputPlaceholder: string;
  sampleText: string;
  layoutLabel: string;
  layoutChars: string;
  layoutColumns: string;
  maxPerColumnLabel: string;
  maxPerColumnHint: string;
  glyphsLabel: string;
  fullWidthLabel: string;
  outputLabel: string;
  previewLabel: string;
  previewEmpty: string;
  copy: string;
  copied: string;
  copyFailed: string;
  emptyHint: string;
  notesHeading: string;
  notes: string[];
}

export const verticalTextConverterContent: Record<
  Locale,
  VerticalTextConverterPageContent
> = {
  ja: {
    title: '縦書き変換 - SNS用の縦書き文字を作成・プレビュー',
    description:
      '横書きの文章をSNSに貼れる縦書き文字に変換する無料ツールです。句読点・長音・括弧を縦書き用の字形にし、1文字1行や右から左の列にも整形。データはブラウザ内で処理され、サーバーには送信されません。',
    h1: '縦書き変換（SNS用の縦書き文字・プレビュー付き）',
    introHtml:
      '横書きの文章を、X（旧Twitter）やInstagramなどにそのまま貼れる縦書き文字に変換します。「、。」や長音「ー」、かぎ括弧を縦書き用の字形に置き換え、1文字ずつ改行するか、右から左へ列を並べる形に整えます。下のプレビューでは縦書きの見え方も確認できます。文字の正規化は<a href="/tools/unicode-normalizer/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">Unicode正規化</a>もご利用ください。',
    inputLabel: '入力（横書きの文章）',
    inputPlaceholder: '例: 吾輩は猫である。名前はまだ無い。',
    sampleText: '吾輩は猫である。\n名前はまだ無い。',
    layoutLabel: '整形方法',
    layoutChars: '1文字1行（改行は空行）',
    layoutColumns: '右から左へ列を並べる',
    maxPerColumnLabel: '1列の最大文字数',
    maxPerColumnHint: '0 で折り返さない・列を並べる場合のみ有効',
    glyphsLabel: '句読点・長音・括弧を縦書き用の字形にする',
    fullWidthLabel: '半角の英数字・記号を全角にする',
    outputLabel: '縦書き変換結果（コピー用）',
    previewLabel: '縦書きプレビュー',
    previewEmpty: '入力するとここに縦書きで表示されます',
    copy: 'コピー',
    copied: 'コピーしました',
    copyFailed: 'コピーに失敗しました',
    emptyHint: '入力するとここに変換結果が表示されます',
    notesHeading: '注意事項',
    notes: [
      '縦書き用の字形（Unicodeの縦書き形）は、フォントによっては表示されず空白や豆腐になることがあります。投稿前に実際の投稿画面で表示を確認してください。',
      '1文字1行や列の並びは、等幅でない環境や行間の広いアプリでは崩れて見えることがあります。',
      '「縦書きプレビュー」はCSSの縦書き表示を使うため、整形前の入力文を縦に組んで表示します。コピー用の変換結果とは見た目が異なる場合があります。',
      '長音「ー」は縦棒（︱）に置き換えます。拗音（っ・ゃなど）の位置の調整や、縦中横（数字の横並び）には対応していません。',
    ],
  },
  en: {
    title: 'Vertical Text Converter - Japanese Tategaki for Social Posts',
    description:
      'Turn horizontal Japanese into vertical text for social posts: vertical punctuation and brackets, one character per line, or right-to-left columns.',
    h1: 'Vertical Text Converter (Japanese Tategaki with Preview)',
    introHtml:
      'Convert horizontal Japanese text into vertical text you can paste straight into X (Twitter), Instagram and other apps. Punctuation, the long vowel mark and brackets are swapped for their vertical forms, and the text is laid out one character per line or in right-to-left columns. The preview below shows how it looks when set vertically. To clean up character forms first, see the <a href="/en/tools/unicode-normalizer/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">Unicode Normalizer</a>.',
    inputLabel: 'Input (horizontal text)',
    inputPlaceholder: 'e.g. 吾輩は猫である。名前はまだ無い。',
    sampleText: '吾輩は猫である。\n名前はまだ無い。',
    layoutLabel: 'Layout',
    layoutChars: 'One character per line (line breaks become blank lines)',
    layoutColumns: 'Right-to-left columns',
    maxPerColumnLabel: 'Max characters per column',
    maxPerColumnHint: '0 means no wrapping; columns layout only',
    glyphsLabel:
      'Use vertical forms for punctuation, long vowel mark and brackets',
    fullWidthLabel:
      'Convert half-width letters, digits and symbols to full-width',
    outputLabel: 'Converted text (for copying)',
    previewLabel: 'Vertical preview',
    previewEmpty: 'Your text appears here set vertically',
    copy: 'Copy',
    copied: 'Copied',
    copyFailed: 'Copy failed',
    emptyHint: 'The converted text appears here as you type',
    notesHeading: 'Notes',
    notes: [
      'Unicode vertical forms may not exist in every font, so some characters can show as blanks or boxes. Check how the post looks in the actual app before publishing.',
      'One-per-line and column layouts can look uneven in non-monospaced environments or apps with wide line spacing.',
      'The "Vertical preview" uses CSS vertical writing on your raw input, so it can differ from the converted text you copy.',
      'The long vowel mark is replaced with a vertical bar (︱). Small kana positioning and tate-chu-yoko (horizontal digits inside vertical text) are not handled.',
    ],
  },
};
