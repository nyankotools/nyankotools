import type { FaqContent } from '../faq';

export const faq: FaqContent = {
  ja: [
    {
      question: '103万円の壁は160万円に変わったのですか？',
      answer:
        '所得税がかかり始める年収は、令和7年度税制改正で基礎控除が95万円、給与所得控除の最低保障額が65万円になり、160万円までになりました（令和7・8年分）。ただし社会保険料を払う場合や、勤務先の家族手当の基準、住民税の基準は別です。',
    },
    {
      question: '106万円と130万円の壁は何が違いますか？',
      answer:
        '106万円は従業員51人以上などの勤務先で、週20時間以上・月額賃金8.8万円以上などの要件を満たすと勤務先の社会保険に加入する目安です。130万円は配偶者などの健康保険の被扶養者でいられる上限で、超えると国民健康保険・国民年金などを自分で負担します。',
    },
    {
      question: '年収を増やしたのに手取りが減るのはどのくらいの年収ですか？',
      answer:
        '勤務先が106万円の対象なら、社会保険料の負担が始まる106万円付近で、130万円で扶養を外れる場合はその付近で、年間十数万円〜二十数万円手取りが減ることがあります。元の手取りに戻る年収は、本ツールの手取り逆転チェックで概算できます。',
    },
    {
      question: '配偶者特別控除はいくらまで満額もらえますか？',
      answer:
        '令和7年分以後、配偶者の合計所得が95万円以下（給与収入160万円まで）なら満額38万円です。そこから所得に応じて段階的に減り、133万円（給与収入約201万円）を超えるとなくなります。納税者の所得が900万円を超えると控除額が減ります。',
    },
    {
      question: '勤務先の家族手当は計算に含まれますか？',
      answer:
        '含まれません。家族手当や配偶者手当を103万円や130万円を境に支給する会社では、手当がなくなる分だけ実際の損得が変わります。就業規則や給与規程で支給条件を確認してください。',
    },
  ],
  en: [
    {
      question: 'Did the ¥1.03 million wall become ¥1.6 million?',
      answer:
        'For income tax, yes. The FY2025 tax reform raised the basic deduction to ¥950,000 and the minimum employment income deduction to ¥650,000, so income tax starts above ¥1.6 million (2025 and 2026). Social insurance, employer family allowances, and resident tax use different thresholds.',
    },
    {
      question: 'What is the difference between the ¥1.06M and ¥1.3M walls?',
      answer:
        'The ¥1.06 million wall applies when your employer has 51 or more employees and you work 20 or more hours a week with a monthly wage of ¥88,000 or more: you join the employer’s social insurance. The ¥1.3 million wall is the limit for being a dependent on a spouse’s health insurance; above it you pay National Health Insurance and the National Pension yourself.',
    },
    {
      question: 'How much pay do I lose by earning just over a wall?',
      answer:
        'Just over the ¥1.06 million wall (if it applies to you) or the ¥1.3 million wall, annual take-home can drop by roughly ¥100,000 to ¥250,000. The reversal check shows where your household take-home falls and the pay level at which it recovers.',
    },
    {
      question: 'How much of the special spousal deduction can I get?',
      answer:
        'From 2025, the full ¥380,000 applies when your total income is ¥950,000 or less (pay up to ¥1.6 million). It then phases down and ends above ¥1.33 million of income (pay of about ¥2.01 million). It is reduced when the taxpayer’s own income exceeds ¥9 million.',
    },
    {
      question: 'Are employer family allowances included?',
      answer:
        'No. Some companies stop paying a family or spouse allowance above ¥1.03 million or ¥1.3 million, which changes the real gain or loss. Check your company’s payroll rules for the conditions.',
    },
  ],
};
