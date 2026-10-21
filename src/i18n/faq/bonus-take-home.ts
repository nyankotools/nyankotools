import type { FaqContent } from '../faq';

export const faq: FaqContent = {
  ja: [
    {
      question: '賞与100万円の手取りはいくらになりますか？',
      answer:
        '前月給与30万円・扶養なし・40歳未満の場合、社会保険料が約14.7万円、源泉所得税が約5.2万円で、手取りは約80万円（額面の約80%）が目安です。扶養が増えると源泉所得税の率が下がります。',
    },
    {
      question: '賞与からも社会保険料は引かれますか？',
      answer:
        '引かれます。健康保険・介護保険・厚生年金・雇用保険の保険料が賞与にもかかります。健康保険は年度累計573万円、厚生年金は1回150万円が標準賞与額の上限です。',
    },
    {
      question: '賞与の所得税はどうやって決まりますか？',
      answer:
        '前月の社会保険料等を引いた給与と扶養親族等の数から、国税庁の算出率の表で税率を求め、社会保険料を引いた後の賞与に掛けます。年間の所得税で調整されるため、年末調整で過不足が精算されます。',
    },
    {
      question: '会社の賞与明細と金額が違うのはなぜですか？',
      answer:
        '本ツールは協会けんぽの平均的な料率と近似した算出率の表を使っています。健康保険組合の料率や前月給与の標準報酬、端数処理の違いで数百〜数千円の差が出ることがあります。実際の金額は賞与明細を確認してください。',
    },
  ],
  en: [
    {
      question: 'What is the take-home pay on a ¥1 million bonus?',
      answer:
        'For someone under 40 with no dependents and a ¥300,000 salary last month, about ¥147,000 goes to social insurance and about ¥52,000 to withholding tax, leaving roughly ¥800,000 (about 80% of gross). More dependents lower the withholding rate.',
    },
    {
      question: 'Is social insurance deducted from bonuses too?',
      answer:
        'Yes. Health, nursing care, pension, and employment insurance all apply to bonuses. The standard bonus amount is capped at ¥5.73 million per fiscal year for health insurance and ¥1.5 million per payment for the pension.',
    },
    {
      question: 'How is income tax on a bonus decided?',
      answer:
        'The rate comes from the National Tax Agency bonus table, based on last month’s salary after social insurance and your number of dependents. It is applied to the bonus after social insurance, and any over- or under-withholding is settled in the year-end adjustment.',
    },
    {
      question: 'Why does my bonus payslip show a different amount?',
      answer:
        'This tool uses average Kyokai Kenpo rates and an approximated rate table. Your insurer’s rates, your actual standard monthly remuneration, and rounding rules can cause a difference of a few hundred to a few thousand yen. Check your payslip for the real figure.',
    },
  ],
};
