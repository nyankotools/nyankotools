import type { FaqContent } from '../faq';

export const faq: FaqContent = {
  ja: [
    {
      question: 'シミュレーションの結果は将来の運用成果を保証しますか？',
      answer:
        '保証しません。入力した利回りが期間中ずっと一定という前提の簡易試算です。実際の投資では市場の変動により、元本割れすることもあります。',
    },
    {
      question: '税金や手数料は考慮されていますか？',
      answer:
        '考慮されていません。運用益にかかる税金（通常20.315%）や信託報酬などのコストは含みません。NISAなどの非課税制度を使う場合は、税金の面では結果が手取りの目安になります（コストは別途かかります）。',
    },
    {
      question: '求める項目を選ぶとどうなりますか？',
      answer:
        '「将来の資産額」「毎月の積立額」「積立期間」「初期投資額」のうち計算したい項目を選び、必要な条件を入力すると、複利運用を前提に試算します。積立期間を求める場合は月数を切り上げるため、結果は目標額をわずかに上回ります。',
    },
  ],
  en: [
    {
      question: 'Does the result guarantee future returns?',
      answer:
        'No. It is a simplified estimate assuming the yield stays constant throughout. Real investments fluctuate and may lose principal.',
    },
    {
      question: 'Are taxes and fees included?',
      answer:
        'No. Taxes on gains (typically 20.315% in Japan) and fund fees are not reflected. If you use tax-free accounts such as NISA, the result is close to your take-home estimate as far as tax is concerned (costs still apply).',
    },
    {
      question: 'What happens when I choose which value to solve for?',
      answer:
        'Choose what to calculate (future value, monthly contribution, period, or initial investment) and enter the other conditions; the tool works it out with compound interest. When solving for the period, months are rounded up, so the result slightly exceeds your target.',
    },
  ],
};
