import type { FaqContent } from '../faq';

export const faq: FaqContent = {
  ja: [
    {
      question: 'どの言語の正規表現に対応していますか？',
      answer:
        'JavaScript（ECMAScript）の正規表現に準拠しています。PHP・Python・Javaなど他言語とは、先読み・後読みの扱いやフラグの書き方などが異なる場合があります。',
    },
    {
      question: 'ブラウザが固まることはありますか？',
      answer:
        '危険なバックトラック（破滅的バックトラッキング）を招く複雑なパターンでは、ブラウザが一時的に固まることがあります。大きなテキストで試す際は、パターンを単純にして確認してください。',
    },
    {
      question: '置換結果もプレビューできますか？',
      answer:
        'はい。置換パターンを指定すると、置換後のテキストをその場でプレビューできます。$1のようにキャプチャグループを参照することもできます。',
    },
  ],
  en: [
    {
      question: 'Which regex flavor does it use?',
      answer:
        'It follows JavaScript (ECMAScript) regular expressions. Lookbehind support, flags and some syntax can differ from PHP, Python or Java.',
    },
    {
      question: 'Can the browser freeze?',
      answer:
        'Patterns that cause catastrophic backtracking can make the browser hang temporarily. Simplify the pattern when testing against large text.',
    },
    {
      question: 'Can I preview replacements?',
      answer:
        'Yes. Enter a replacement pattern to preview the result instantly, and refer to capture groups with $1, $2 and so on.',
    },
  ],
};
