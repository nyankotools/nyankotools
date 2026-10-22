import type { FaqContent } from '../faq';

export const faq: FaqContent = {
  ja: [
    {
      question: '名前付き参照と数値参照はどちらを使うべきですか？',
      answer:
        '読みやすさなら &copy; のような名前付き参照、確実さなら &#169; や &#xA9; のような数値参照が向いています。数値参照は名前のない文字にも使えます。',
    },
    {
      question: '&nbsp; と普通のスペースは何が違いますか？',
      answer:
        '&nbsp; は改行されず、連続して並べても1つにまとめられない空白です。通常のスペースは連続すると1つに詰められ、行末で折り返されることがあります。',
    },
    {
      question: '一覧にない文字参照はどうすればよいですか？',
      answer:
        '数値参照ならコードポイントさえ分かれば書けます。文字から調べたいときは文字を検索欄に貼るか、Unicode検査ツールでコードポイントを確認してください。',
    },
    {
      question: '&lt; や &amp; はいつ必要ですか？',
      answer:
        '本文に < や & をそのまま書くとタグや参照と解釈されるため、&lt; や &amp; と書きます。文字列をまとめて変換するにはHTMLエスケープツールが便利です。',
    },
  ],
  en: [
    {
      question: 'Should I use a named or a numeric reference?',
      answer:
        'Named references like &copy; are easier to read, while numeric ones like &#169; or &#xA9; are the safer choice and work even for characters with no name.',
    },
    {
      question: 'What is the difference between &nbsp; and a normal space?',
      answer:
        '&nbsp; is a non-breaking space: it will not wrap and is not collapsed when repeated. Ordinary spaces collapse into one and can wrap at the end of a line.',
    },
    {
      question: 'What if the entity I need is not in the list?',
      answer:
        'You can still write it as a numeric reference if you know the code point. Paste the character into the search box, or check its code point with the Unicode Inspector.',
    },
    {
      question: 'When do I need &lt; and &amp;?',
      answer:
        'A bare < or & in body text can be read as a tag or a reference, so write &lt; and &amp; instead. The HTML Escape tool converts whole strings at once.',
    },
  ],
};
