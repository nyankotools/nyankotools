import type { FaqContent } from '../faq';

export const faq: FaqContent = {
  ja: [
    {
      question: '育児休業給付金は月給30万円でいくらもらえますか？',
      answer:
        '休業前6か月の賃金が月平均30万円なら賃金日額は1万円で、180日目までは30日あたり約20.1万円（67%）、181日目以降は約15万円（50%）です。出生後休業支援給付金の対象なら、最大28日分が13%上乗せされます。',
    },
    {
      question: '育児休業給付金の上限額はいくらですか？',
      answer:
        '賃金日額に上限があり、令和8年8月1日改定で16,540円です。67%の期間は30日あたり約33.2万円、50%の期間は約24.8万円が上限の目安になります。上限・下限は毎年8月に見直されます。',
    },
    {
      question: '出産手当金はいつからいつまで、いくらもらえますか？',
      answer:
        '出産日以前42日（多胎は98日）と出産日の翌日以後56日のうち、会社を休んだ日に、標準報酬日額の3分の2が支給されます。出産が予定日より遅れた場合は、その日数分が産前に加算されます。',
    },
    {
      question: '傷病手当金の待期期間とは何ですか？',
      answer:
        '連続して3日間仕事を休んだ期間のことで、この間は支給されません。4日目以降が支給の対象で、標準報酬日額の3分の2を、支給開始日から通算1年6か月まで受け取れます。',
    },
    {
      question: 'この計算結果と実際の支給額が違うのはなぜですか？',
      answer:
        '本ツールは入力した賃金や標準報酬月額から簡易に計算する概算です。実際は支給単位期間ごとの賃金の確認、会社からの給与の有無、標準報酬月額の12か月平均などで額が変わります。申請先の審査結果をご確認ください。',
    },
  ],
  en: [
    {
      question: 'How much is the childcare leave benefit on a ¥300,000 salary?',
      answer:
        'If your average pay over the six months before leave is ¥300,000, your daily wage is ¥10,000. That gives about ¥201,000 per 30 days up to day 180 (67%) and about ¥150,000 from day 181 (50%). With the post-birth support benefit, up to 28 days get an extra 13%.',
    },
    {
      question: 'Is there a cap on the childcare leave benefit?',
      answer:
        'Yes. The daily wage is capped at ¥16,540 (revised 1 August 2026), which works out to about ¥332,000 per 30 days at 67% and about ¥248,000 at 50%. The cap and the floor are reviewed every August.',
    },
    {
      question: 'How long is the maternity allowance paid, and how much?',
      answer:
        'It covers days you take off within 42 days before the birth (98 for multiple births) and 56 days after, at two-thirds of your standard daily remuneration. If the birth is later than the due date, the extra days are added to the pre-birth period.',
    },
    {
      question: 'What is the waiting period for the sickness allowance?',
      answer:
        'It is the first three consecutive days off work, which are not paid. From the fourth day you receive two-thirds of the standard daily remuneration, for up to 1.5 years in total from the first payment.',
    },
    {
      question: 'Why can my actual payment differ from this estimate?',
      answer:
        'This tool is a simple estimate from the pay or standard remuneration you enter. The real amount depends on the wage check for each payment period, any wages from your employer, and the 12-month average of your standard remuneration. Confirm with the office that processes your claim.',
    },
  ],
};
