import type { FaqContent } from '../faq';

export const faq: FaqContent = {
  ja: [
    {
      question: '貼り付けたHTMLの中のスクリプトが実行されることはありますか？',
      answer:
        'ありません。HTMLをブラウザのDOMに挿入せず、文字列として解析してタグを取り除いています。script・style・コメントは中身ごと捨てられます。',
    },
    {
      question: 'リンクのURLを残すことはできますか？',
      answer:
        '「リンクのURLを残す」にチェックすると、「リンクテキスト (URL)」の形で出力します。リンクテキストがURLと同じ場合や、# だけのリンク・javascript: などのリンクは付け足しません。',
    },
    {
      question: '段落やリストの改行は残りますか？',
      answer:
        'はい。p・div・li・h1〜h6・br・テーブルの行などの位置で改行します（段落は空行1つ）。HTMLソース中の改行や連続した空白は、ブラウザの表示と同じく1つの空白として扱います。',
    },
    {
      question: '実際のページ表示と結果が違うのはなぜですか？',
      answer:
        'CSSで非表示にした要素や、JavaScriptで後から挿入される内容は、HTMLの文字列だけでは判別できないためです。表示されている文章が必要な場合は、ブラウザで選択してコピーしてください。',
    },
  ],
  en: [
    {
      question: 'Can scripts in the pasted HTML run?',
      answer:
        'No. The HTML is never inserted into the DOM; it is parsed as a plain string and the tags are removed. The contents of script, style and comments are discarded.',
    },
    {
      question: 'Can I keep link URLs?',
      answer:
        'Tick "Keep link URLs" and links are written as "link text (URL)". Nothing is added when the link text already equals the URL, or for anchors like # and javascript: links.',
    },
    {
      question: 'Are paragraph and list line breaks preserved?',
      answer:
        'Yes. Lines break at p, div, li, h1-h6, br and table rows (paragraphs get one blank line). Line breaks and repeated spaces in the HTML source count as a single space, as in a browser.',
    },
    {
      question: 'Why does the result differ from the rendered page?',
      answer:
        'Elements hidden with CSS and content inserted later by JavaScript cannot be detected from the HTML string alone. If you need exactly what is displayed, select and copy it in the browser.',
    },
  ],
};
