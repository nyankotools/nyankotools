import type { FaqContent } from '../faq';

export const faq: FaqContent = {
  ja: [
    {
      question: 'セルを結合する方法と、結合を解除する方法を教えてください。',
      answer:
        '「開始行」「終了行」「開始列」「終了列」で範囲を指定して「セルを結合」を押すと、範囲の左上のセルに colspan と rowspan が付きます。解除は範囲内のセルを指定して「結合を解除」を押します。結合した範囲の左上以外の文字は消えます。',
    },
    {
      question: 'セルに「<」や「&」を入れても大丈夫ですか？',
      answer:
        'はい。セルの文字は「&lt;」「&amp;」などに自動でエスケープして出力するため、HTMLタグとして解釈されることはありません。改行は br タグに置き換わります。',
    },
    {
      question: 'styleタグ方式とインライン方式のどちらを選べばよいですか？',
      answer:
        'ふつうのWebページでは、見た目をまとめて管理できるstyleタグ＋クラスが向いています。HTMLメールやCMSの入力欄など、styleタグが使えない場所では、各要素にstyle属性を付けるインライン方式を選んでください。',
    },
    {
      question: '見出し行を有効にすると、1行目の縦結合ができません。',
      answer:
        'thead は本文の行と分けて出力されるため、見出し行の rowspan は無効にしています。縦に結合したい場合は、見出し行の設定をオフにしてください。横方向の結合（colspan）は使えます。',
    },
  ],
  en: [
    {
      question: 'How do I merge cells, and how do I undo it?',
      answer:
        'Enter the range with "From row", "To row", "From column" and "To column", then press "Merge cells". The top-left cell gets colspan and rowspan. To undo, pick any cell in the range and press "Unmerge". The text of the other cells in the range is cleared when you merge.',
    },
    {
      question: 'Is it safe to type "<" or "&" in a cell?',
      answer:
        'Yes. Cell text is escaped to entities like &lt; and &amp; in the output, so it is never read as HTML. Line breaks become br tags.',
    },
    {
      question: 'Should I use a style tag or inline styles?',
      answer:
        'For a normal web page, a style tag with a class is easier to maintain. Choose inline styles where a style tag is not allowed, such as HTML email or some CMS fields; each element then gets its own style attribute.',
    },
    {
      question: 'Why can I not merge the header row vertically?',
      answer:
        'The header row is written inside thead, separate from the body rows, so its rowspan is ignored. Turn off the header option if you need a vertical merge there. Horizontal merges (colspan) still work.',
    },
  ],
};
