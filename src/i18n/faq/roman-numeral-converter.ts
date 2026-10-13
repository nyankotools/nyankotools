import type { FaqContent } from '../faq';

export const faq: FaqContent = {
  ja: [
    {
      question: 'ローマ数字で 4000 以上や 0 は書けますか？',
      answer:
        '標準的なローマ数字は 1〜3999 までで、0 を表す文字もありません。4000 以上は数字の上に線を引く拡張表記になりますが、このツールでは扱わず、範囲外として表示します。',
    },
    {
      question: '4 は IIII と IV のどちらが正しいですか？',
      answer:
        '現在の標準は IV です。ただし時計の文字盤などでは見た目のバランスのために IIII がよく使われます。このツールは IIII を入力すると値（4）と正規形（IV）を表示します。',
    },
    {
      question: 'IC や VX が変換できないのはなぜですか？',
      answer:
        '減算の書き方は IV・IX・XL・XC・CD・CM の6通りだけで、IC（99）や VX（5）はこのルールに外れるためです。99 は XCIX、5 は V と書きます。',
    },
    {
      question: 'Ⅻ のようなUnicodeのローマ数字と通常のアルファベットの違いは？',
      answer:
        'Ⅻ は1文字で12を表す専用の文字で、アルファベットの XII とは別の文字コードです。見た目はほぼ同じですが、検索や並べ替えでは別物になります。このツールはどちらの入力も読み取れ、出力はオプションで切り替えられます。',
    },
    {
      question: '年号（2024年など）はどう書きますか？',
      answer:
        '2024 は MMXXIV です。1999 は MCMXCIX、2000 は MM になります。下の一覧に近年の西暦年の例を載せています。',
    },
  ],
  en: [
    {
      question: 'Can Roman numerals show 0 or numbers of 4000 and above?',
      answer:
        'Standard Roman numerals run from 1 to 3999, and there is no symbol for zero. Values of 4000 and above use an overline extension, which this tool does not handle, so they are reported as out of range.',
    },
    {
      question: 'Is 4 written IIII or IV?',
      answer:
        'IV is the modern standard. Clock faces often use IIII for visual balance, though. If you enter IIII, the tool shows its value (4) and the standard form (IV).',
    },
    {
      question: 'Why are IC and VX rejected?',
      answer:
        'Only six subtractive pairs exist: IV, IX, XL, XC, CD and CM. IC (99) and VX (5) break that rule. Write 99 as XCIX and 5 as V.',
    },
    {
      question: 'What is the difference between Ⅻ and the letters XII?',
      answer:
        'Ⅻ is a single dedicated character for 12 with its own code point, separate from the Latin letters XII. They look nearly identical, but behave differently in search and sorting. The tool reads both, and the output style is a checkbox.',
    },
    {
      question: 'How do I write a year such as 2024?',
      answer:
        '2024 is MMXXIV, 1999 is MCMXCIX and 2000 is MM. The table below the converter lists examples for recent years.',
    },
  ],
};
