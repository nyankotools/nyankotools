import type { FaqContent } from '../faq';

export const faq: FaqContent = {
  ja: [
    {
      question: '年収500万円だと手取りはいくらになりますか？',
      answer:
        '独身・扶養なしで40歳未満の場合、手取りはおおむね390万円前後（額面の約78%）、月あたり32万円前後が目安です。社会保険料が約73万円、所得税・住民税が合わせて約36万円差し引かれる計算です。実際は健康保険の料率や扶養の有無で変わります。',
    },
    {
      question: '社会保険料は実際の給与明細と合いますか？',
      answer:
        '協会けんぽの平均的な料率で概算しているため、加入している健康保険組合や都道府県によって差が出ます。給与明細や源泉徴収票の社会保険料の合計がわかる場合は「社会保険料の年間額」に入力すると、税金も含めてより正確になります。',
    },
    {
      question: '月収にボーナスが含まれているときはどう入力しますか？',
      answer:
        '額面の年収には、月給×12か月に賞与を加えた1年間の総支給額を入力してください。月々の手取りは年間の手取りを12で割った平均値で表示するため、賞与月は実際の手取りと差が出ます。',
    },
    {
      question: '住宅ローン控除や扶養控除は反映できますか？',
      answer:
        '扶養控除・配偶者控除・生命保険料控除のような所得控除は「その他の所得控除」に合計額を入力すれば反映できます。住宅ローン控除は税額から直接引く税額控除のため、このツールでは反映できず、実際の所得税はその分だけ少なくなります。',
    },
  ],
  en: [
    {
      question: 'What is the take-home pay on a ¥5 million salary in Japan?',
      answer:
        'For a single person under 40 with no dependents, take-home pay is roughly ¥3.9 million a year (about 78% of gross), or around ¥320,000 a month. About ¥730,000 goes to social insurance and about ¥360,000 to income and resident tax. Your actual figure depends on your insurer’s rates and your dependents.',
    },
    {
      question: 'Will the social insurance figure match my payslip?',
      answer:
        'It is estimated from typical Kyokai Kenpo rates, so it can differ depending on your health insurance society and prefecture. If you know the annual total from your payslip or year-end tax statement, enter it in the social insurance field for a more accurate result including taxes.',
    },
    {
      question: 'How do I enter a salary that includes bonuses?',
      answer:
        'Enter your total gross pay for the year: monthly salary times 12 plus bonuses. The monthly take-home figure is the annual amount divided by 12, so months with a bonus will differ from the average.',
    },
    {
      question: 'Can I include the housing loan deduction or dependents?',
      answer:
        'Income deductions such as dependent, spouse, and life insurance deductions can be entered as a total under "other income deductions". The housing loan deduction is a tax credit subtracted directly from tax, so it cannot be reflected here and your real income tax would be lower by that amount.',
    },
  ],
};
