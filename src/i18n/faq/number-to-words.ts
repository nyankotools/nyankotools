import type { FaqContent } from '../faq';

export const faq: FaqContent = {
  ja: [
    {
      question: '小切手に書く金額表記はどう作りますか？',
      answer:
        '数字を入力すると「小切手・契約書の金額表記」に、整数部の英語表記と、端数を100分の何かで表した「and 50/100 dollars」の形で表示されます。通貨はドル・ポンド・ユーロから選べます。小数部が3桁以上の数や負の数では表示されません。',
    },
    {
      question: '101は one hundred one と one hundred and one のどちらですか？',
      answer:
        '米国式は and を入れない one hundred one、英国式は one hundred and one です。「英国式」のチェックで切り替えられます。小切手の「and 50/100」の and は、どちらの形式でも入ります。',
    },
    {
      question: '序数（1st・2nd・3rd）も表示できますか？',
      answer:
        '0以上の整数であれば、first・twenty-first などの序数と、21st などの数字表記を表示します。11・12・13は 11th・12th・13th になります。小数や負の数には序数はありません。',
    },
    {
      question: '日本語読みの「し」「しち」「く」は表示されますか？',
      answer:
        '表示されません。四は「よん」、七は「なな」、九は「きゅう」の読みで統一しています。百・千の位や兆の位では「さんびゃく」「ろっぴゃく」「はっせん」「いっちょう」などの音の変化も反映します。',
    },
    {
      question: 'どのくらい大きな数まで変換できますか？',
      answer:
        '整数部は36桁（英語は decillion の位）、小数部は30桁までです。それ以上は桁数が多すぎるというエラーになります。',
    },
  ],
  en: [
    {
      question: 'How do I write an amount on a check?',
      answer:
        'Enter the amount and use the "Check / contract amount" row. It shows the whole part in words followed by the cents as a fraction of 100, such as "and 50/100 dollars". You can pick dollars, pounds or euros. It is not shown for amounts with three or more decimals or for negative numbers.',
    },
    {
      question: 'Is 101 "one hundred one" or "one hundred and one"?',
      answer:
        'American English omits "and" (one hundred one) and British English includes it (one hundred and one). Toggle the British style option to switch. The "and" before the cents on a check is included in both styles.',
    },
    {
      question: 'Does it show ordinals like 1st, 2nd and 3rd?',
      answer:
        'For integers of zero or more it shows the ordinal in words (first, twenty-first) and in digits (21st). 11, 12 and 13 become 11th, 12th and 13th. Decimals and negative numbers have no ordinal.',
    },
    {
      question: 'Does the Japanese reading include し, しち and く?',
      answer:
        'No. 4 is always よん, 7 is なな and 9 is きゅう. Sound changes such as さんびゃく, ろっぴゃく, はっせん and いっちょう are applied.',
    },
    {
      question: 'How large a number can it convert?',
      answer:
        'Up to 36 integer digits (decillions in English) and 30 decimal digits. Longer input shows a "too long" error.',
    },
  ],
};
