import type { FaqContent } from '../faq';

export const faq: FaqContent = {
  ja: [
    {
      question: '絵文字が \\uD83D\\uDE00 のように2つに分かれるのはなぜですか？',
      answer:
        'JavaScriptの \\uXXXX は16ビットの値1つを表すため、U+FFFFを超える絵文字などは上位・下位のサロゲートペア2つに分かれます。1つの表記にしたい場合は、ES6形式（\\u{1F600}）やPython形式（\\U0001F600）を選んでください。',
    },
    {
      question: 'ASCII文字（英数字）もエスケープされますか？',
      answer:
        '初期設定では英数字や記号はそのまま残し、日本語などASCII以外だけを変換します。「変換する文字」を「すべての文字」にすると、英数字や改行もエスケープされます。',
    },
    {
      question: '「\\u65e5\\u672c\\u8a9e」のような文字列を元に戻すには？',
      answer:
        '変換方向を「エスケープ → 文字」にして貼り付けてください。\\uXXXX・\\u{...}・U+XXXX・HTML数値参照などを自動で判別して、文字に戻します。',
    },
    {
      question: '\\n や \\" は変換されますか？',
      answer:
        'いいえ。このツールが扱うのはコードポイントを表す表記だけです。改行やクォートのエスケープは「HTML/JS文字列エスケープ」を使ってください。',
    },
  ],
  en: [
    {
      question: 'Why is an emoji split into two escapes like \\uD83D\\uDE00?',
      answer:
        'A JavaScript \\uXXXX escape holds a single 16-bit value, so characters above U+FFFF such as emoji are written as a high and low surrogate pair. Choose ES6 format (\\u{1F600}) or Python format (\\U0001F600) to get a single escape instead.',
    },
    {
      question: 'Are ASCII letters and digits escaped too?',
      answer:
        'By default letters, digits and symbols stay as they are, and only non-ASCII characters such as Japanese are converted. Set "Characters to convert" to "All characters" to escape everything, including line breaks.',
    },
    {
      question: 'How do I decode a string like "\\u65e5\\u672c\\u8a9e"?',
      answer:
        'Switch the direction to "Escape → Text" and paste it. \\uXXXX, \\u{...}, U+XXXX, HTML numeric references and similar forms are detected automatically and turned back into characters.',
    },
    {
      question: 'Are \\n and \\" converted?',
      answer:
        'No. This tool only handles notations that stand for code points. For line-break and quote escapes, use the HTML/JS String Escape tool.',
    },
  ],
};
