import type { FaqContent } from '../faq';

export const faq: FaqContent = {
  ja: [
    {
      question: 'このツールは正規表現のマッチ判定もできますか？',
      answer:
        'いいえ、パターンを構文要素に分解して意味を説明するだけで、テキストへの一致判定は行いません。実際の入力で試すときは正規表現テスターを使ってください。',
    },
    {
      question: '貪欲（グリーディ）と最短一致（レイジー）の違いは何ですか？',
      answer:
        '* + {n,m} などの量指定子は、通常できるだけ長く一致します（貪欲）。後ろに ? を付けた *? +? {n,m}? はできるだけ短く一致します（最短一致）。解説では最短一致の量指定子に注記を付けて区別します。',
    },
    {
      question: 'PCREやPythonの正規表現も解説できますか？',
      answer:
        'JavaScript（ECMAScript）の構文が対象です。共通する基本要素は同じ意味ですが、所有量指定子 a++、アトミックグループ (?>…)、条件式、\\A \\z などはJavaScriptにないため、エラーまたは別の意味として扱われます。',
    },
    {
      question: 'エラーの「位置」はどう数えますか？',
      answer:
        'パターンの先頭を1文字目として数えた位置で、エラーの原因になった文字をハイライト表示します。閉じていない括弧や文字クラスは、開いた側の位置を示します。',
    },
    {
      question: 'uフラグを付けるとエラーになるのはなぜですか？',
      answer:
        'uフラグ（vフラグも同様）を付けると構文が厳格になり、不要なエスケープ（\\a など）や単独の { ] } がエラーになります。反対に \\p{…} や \\u{…} はこのモードでのみ使えます。',
    },
  ],
  en: [
    {
      question: 'Can this tool test whether a regex matches my text?',
      answer:
        'No. It only splits a pattern into syntax elements and explains them; it never matches against text. To try a pattern on real input, use the Regex Tester.',
    },
    {
      question: 'What is the difference between greedy and lazy quantifiers?',
      answer:
        'Quantifiers such as * + and {n,m} normally match as much as possible (greedy). Adding ? after them (*? +? {n,m}?) makes them match as little as possible (lazy). The explanation marks lazy quantifiers so you can tell them apart.',
    },
    {
      question: 'Does it explain PCRE or Python regular expressions?',
      answer:
        'It targets JavaScript (ECMAScript) syntax. Shared basics mean the same thing, but possessive quantifiers like a++, atomic groups (?>...), conditionals and \\A \\z do not exist in JavaScript, so they are reported as errors or read differently.',
    },
    {
      question: 'How is the error position counted?',
      answer:
        'It counts from 1 at the start of the pattern, and the offending character is highlighted. For an unclosed parenthesis or character class, the position points at the opening one.',
    },
    {
      question: 'Why does adding the u flag cause an error?',
      answer:
        'The u flag (and v) makes the syntax strict, so unnecessary escapes such as \\a and bare { ] } become errors. Conversely, \\p{...} and \\u{...} only work in that mode.',
    },
  ],
};
