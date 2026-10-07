import type { FaqContent } from '../faq';

export const faq: FaqContent = {
  ja: [
    {
      question: '燃費は km/L と L/100km のどちらで入力できますか？',
      answer:
        'どちらにも対応しています。日本のカタログ燃費は km/L、欧州などでは L/100km が一般的です。単位を切り替えるだけで同じ計算ができます（20L/100km は 5km/L に相当）。',
    },
    {
      question: '割り勘の金額はなぜ切り上げているのですか？',
      answer:
        '総費用を人数で割ると端数が出るため、1円単位に切り上げた金額も表示しています。切り上げておくと、全員から同じ額を集めても総費用に足りなくなることがありません。端数を含む正確な金額も併記しています。',
    },
    {
      question: '高速道路料金や駐車場代も含めて計算できますか？',
      answer:
        '「高速料金・駐車場代など」の欄に合計額を入力すると、燃料代に加えた総費用と、その総費用での1km当たりのコスト・1人当たりの金額を計算します。燃料代だけの1km当たりコストも別に表示されます。',
    },
    {
      question: '実際のガソリン代と差が出るのはなぜですか？',
      answer:
        'カタログ燃費は一定条件で測定した値で、渋滞・エアコン・積載量・坂道などで実燃費は変わります。給油時に満タン法で測った実燃費を入力すると、より現実に近い金額になります。',
    },
  ],
  en: [
    {
      question: 'Can I enter fuel economy as km/L or L/100km?',
      answer:
        'Both are supported. Switch the unit and the same calculation applies (20 L/100 km equals 5 km/L). MPG is not supported, so convert it to km/L first if needed.',
    },
    {
      question: 'Why is the split amount rounded up?',
      answer:
        'Dividing the total by the number of people usually leaves a fraction, so the per-person amount is also shown rounded up to the next whole yen. If everyone pays that amount, the total is always covered. The exact unrounded figure is shown alongside it.',
    },
    {
      question: 'Can I include tolls and parking?',
      answer:
        'Yes. Enter the combined amount in the tolls and parking field. The total cost, the cost per km including those extras, and the per-person share are all calculated. Fuel cost per km on its own is shown separately.',
    },
    {
      question: 'Why does the result differ from what I actually pay?',
      answer:
        'Rated fuel economy is measured under fixed conditions. Traffic, air conditioning, load and hills change real consumption. For a more realistic estimate, enter the economy you measured by filling the tank each time.',
    },
  ],
};
