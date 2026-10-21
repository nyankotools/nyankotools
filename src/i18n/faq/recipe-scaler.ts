import type { FaqContent } from '../faq';

export const faq: FaqContent = {
  ja: [
    {
      question: '「適量」や「少々」の行はどうなりますか？',
      answer:
        '数値のない行は変更せずそのまま出力します。人数を変えても「塩 少々」は「塩 少々」のままなので、味を見ながら調整してください。',
    },
    {
      question: '焼き時間や温度も人数に合わせて変わりますか？',
      answer:
        '「10分」「200℃」「2cm」のように、分・秒・時間・度・cm・mmが付く数値は換算しません。調理時間は人数に比例しないことが多いためです。「2人分」などの人数表記は目標の人数に置き換わります。',
    },
    {
      question: '1/2や1と1/2、½のような分数は読み取れますか？',
      answer:
        '半角・全角の数字、1/2、1と1/2、1 1/2、½などの分数、3桁区切りの数、「2〜3個」のような範囲を読み取ります。範囲は両端をそれぞれ換算します。',
    },
    {
      question:
        '結果が「1/4」ではなく「0.25」のように表示されるのはなぜですか？',
      answer:
        '「丸め方」で小数を選んでいる場合は小数1桁（1未満は2桁）で表示します。計量スプーンに合わせたいときは「分数」を選ぶと、1/4・1/3・1/2・3/4のように表示されます。',
    },
  ],
  en: [
    {
      question: 'What happens to lines like "salt to taste"?',
      answer:
        'Lines without a number are copied through unchanged. "Salt, to taste" stays the same at any serving size, so adjust it by taste.',
    },
    {
      question: 'Are baking times and temperatures scaled too?',
      answer:
        'No. Numbers followed by min, hours, sec, °C, cm or mm are skipped because they do not grow in proportion to servings. Serving counts like "serves 4" are replaced with your target.',
    },
    {
      question: 'Can it read fractions such as 1/2, 1 1/2 or ½?',
      answer:
        'Yes. It understands whole numbers, decimals, 1/2, 1 1/2, ½, thousands separators, full-width digits and ranges like "2-3". Both ends of a range are scaled.',
    },
    {
      question: 'Why do I see 0.25 instead of 1/4?',
      answer:
        'With "Decimals" selected, results show one decimal place (two below 1). Choose "Fractions" to get measuring-spoon friendly values such as 1/4, 1/3, 1/2 and 3/4.',
    },
  ],
};
