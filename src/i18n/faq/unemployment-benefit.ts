import type { FaqContent } from '../faq';

export const faq: FaqContent = {
  ja: [
    {
      question: '失業保険の1日あたりの金額（基本手当日額）はどう決まりますか？',
      answer:
        '離職前6か月の賃金合計（賞与を除く）を180で割った賃金日額に、50〜80%の給付率をかけて決まります（60〜64歳は45〜80%）。賃金が低いほど率が高く、賃金日額には年齢別の上限と下限があり、毎年8月に改定されます。このツールでは月額賃金の平均から賃金日額を求めています。',
    },
    {
      question: '自己都合で辞めた場合、いつから受け取れますか？',
      answer:
        '求職の申込みと受給資格の決定のあと、全員に7日間の待期期間があります。自己都合の場合はさらに給付制限があり、令和7年4月1日以降の離職では原則1か月です（5年以内に3回以上自己都合で離職した場合は3か月）。会社都合の場合は給付制限がありません。実際の振込は、待期と給付制限が終わったあとの失業認定を受けてからになります。',
    },
    {
      question: '所定給付日数は何日になりますか？',
      answer:
        '自己都合の場合は年齢に関係なく、被保険者期間が1年以上5年未満・5年以上10年未満で90日、10年以上20年未満で120日、20年以上で150日です。会社都合（特定受給資格者）は年齢と期間で90〜330日になり、たとえば45〜59歳で20年以上なら330日です。',
    },
    {
      question: '何か月働いていれば失業保険をもらえますか？',
      answer:
        '自己都合の場合は、離職前2年間に被保険者期間が通算12か月以上必要です。会社都合や契約満了で更新されなかった場合などは、離職前1年間に6か月以上あれば受給資格があります。被保険者期間は、賃金支払の基礎日数が11日以上ある月を1か月と数えます。',
    },
    {
      question: '65歳以上や、障害のある人の計算はできますか？',
      answer:
        'できません。65歳以上は基本手当ではなく高年齢求職者給付金（基本手当日額の30日分または50日分）の対象で、障害者など就職困難者は給付日数が別に定められています。このツールは65歳未満の一般の被保険者を対象にした目安です。',
    },
  ],
  en: [
    {
      question: 'How is the daily basic allowance calculated?',
      answer:
        'Take your total pay for the last six months (excluding bonuses), divide by 180 to get the daily wage, then apply a benefit rate of 50-80% (45-80% for ages 60-64). Lower earners get a higher rate, and the daily wage has age-based upper and lower limits revised every August. This tool derives the daily wage from your average monthly pay.',
    },
    {
      question: 'How soon can I get paid after resigning?',
      answer:
        'After you register for job seeking and are found eligible, everyone has a 7-day waiting period. If you resigned, there is a further benefit restriction, normally 1 month for separations on or after 1 April 2025 (3 months if you resigned 3 or more times in 5 years). Laid-off workers have no restriction. Payment follows the first unemployment certification after those periods.',
    },
    {
      question: 'How many days of benefit will I get?',
      answer:
        'If you resigned, it does not depend on age: 90 days for 1 to under 10 years of insurance, 120 days for 10 to under 20 years and 150 days for 20 years or more. If you were laid off, it ranges from 90 to 330 days by age and insured period, for example 330 days for ages 45-59 with 20 or more years.',
    },
    {
      question: 'How long do I need to have worked to qualify?',
      answer:
        'If you resigned, you need at least 12 insured months in the last 2 years. If you were laid off or your fixed-term contract was not renewed, 6 insured months in the last year is enough. A month counts as insured if you were paid for 11 or more days in it.',
    },
    {
      question:
        'Can I calculate this if I am 65 or older, or have a disability?',
      answer:
        'No. Workers aged 65 and over receive a lump-sum benefit for older workers (30 or 50 days of the daily allowance) instead, and people with disabilities who have difficulty finding work have separate benefit days. This tool is an estimate for general insured workers under 65.',
    },
  ],
};
