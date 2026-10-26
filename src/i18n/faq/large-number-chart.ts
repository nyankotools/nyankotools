import type { FaqContent } from '../faq';

export const faq: FaqContent = {
  ja: [
    {
      question: '1億は何M（メガ）ですか？',
      answer:
        '1億は10の8乗なので100Mです。日本語は4桁ごと、英語表記は3桁ごとに単位が変わるため、億や兆はMやBの端数になります（1兆 = 1T = 1,000B）。早見表で10のべき乗ごとに確認できます。',
    },
    {
      question: 'K・M・B・T の次の略称は何ですか？',
      answer:
        'このツールではQa（10の15乗）、Qi（18乗）、Sx（21乗）、Sp（24乗）、Oc（27乗）、No（30乗）、Dc（33乗）と続き、Vg（63乗）まで対応しています。Qa以降の略称はゲームによって異なることがあるため、遊んでいるゲームの表記も確認してください。',
    },
    {
      question: '小数を含む数（1.5Mなど）は入力できますか？',
      answer:
        '接尾辞や単位を付けて整数になる場合は入力できます（1.5M = 1,500,000、1.5兆 = 1,500,000,000,000）。1.5のように整数にならない値はエラーになります。また、表示側の「1.23M」などは小数第2位までの切り捨てです。',
    },
    {
      question: '何桁の数まで扱えますか？',
      answer:
        '1000桁までの0以上の整数に対応しています。内部でBigIntを使うため、JavaScriptの通常の数値では桁が崩れる10の20乗以上の数も正確に変換できます。',
    },
  ],
  en: [
    {
      question: 'How many M (million) is 1 oku (億)?',
      answer:
        '1億 is 10^8, which is 100M. Japanese units change every 4 digits and English suffixes every 3, so 億 and 兆 land on fractions of M and B (1兆 = 1T = 1,000B). The chart lists every power of ten.',
    },
    {
      question: 'What comes after K, M, B and T?',
      answer:
        'This tool continues with Qa (10^15), Qi (10^18), Sx (10^21), Sp (10^24), Oc (10^27), No (10^30), Dc (10^33) and so on up to Vg (10^63). Abbreviations from Qa onward differ between games, so compare them with your game.',
    },
    {
      question: 'Can I enter decimals such as 1.5M?',
      answer:
        'Yes, as long as the result is a whole number (1.5M = 1,500,000). A plain 1.5 is rejected. The results shown, such as "1.23M", are truncated to two decimal places.',
    },
    {
      question: 'How large a number can it handle?',
      answer:
        'Non-negative integers up to 1000 digits. BigInt is used internally, so numbers above 10^20, which ordinary JavaScript numbers cannot represent exactly, are converted precisely.',
    },
  ],
};
