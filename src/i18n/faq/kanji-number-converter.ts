import type { FaqContent } from '../faq';

export const faq: FaqContent = {
  ja: [
    {
      question: '契約書や領収書の金額（壱萬円など）に使えますか？',
      answer:
        '「算用数字→漢数字」で書き方に「大字」を選ぶと、12000 が「壱萬弐千」のように壱・弐・参・拾・萬で出力されます。ただし書式は提出先の指定に従ってください。',
    },
    {
      question: '「一緒」や「三日月」の漢数字も変換されますか？',
      answer:
        'はい。このツールは漢数字をすべて数として扱うため、熟語の一部の漢数字も変換されます。「漢数字→算用数字」では、結果を確認してから使ってください。',
    },
    {
      question: '二〇二四と二千二十四は、どちらも変換できますか？',
      answer:
        'どちらも2024に変換できます。〇一二三…だけを並べた位取り記法と、十・百・千・万を使う単位記法の両方に対応しています。',
    },
    {
      question: 'どのくらい大きな数まで変換できますか？',
      answer:
        '単位記法と大字は、垓（10の20乗）を含む24桁までの整数に対応します。位取り記法（二〇二四）は桁数の制限なく変換できます。',
    },
  ],
  en: [
    {
      question: 'Can I use it for amounts on contracts and receipts?',
      answer:
        'Choose "Formal daiji" under "Digits → kanji" and 12000 becomes 壱萬弐千, using 壱, 弐, 参, 拾 and 萬. Always follow the format your recipient asks for.',
    },
    {
      question: 'Will kanji numerals inside words like 一緒 be converted?',
      answer:
        'Yes. Every kanji numeral is treated as a number, including those that are part of a word, so review the result of "Kanji → digits" before using it.',
    },
    {
      question: 'Does it handle both 二〇二四 and 二千二十四?',
      answer:
        'Both become 2024. The tool supports digit-by-digit notation (〇一二三…) and notation with the units 十, 百, 千 and 万.',
    },
    {
      question: 'How large a number can it convert?',
      answer:
        'Notation with units and daiji support integers up to 24 digits, including 垓 (10^20). Digit-by-digit notation has no length limit.',
    },
  ],
};
