import type { FaqContent } from '../faq';

export const faq: FaqContent = {
  ja: [
    {
      question: '贈与税がかからない金額はいくらまでですか？',
      answer:
        '暦年課税では、受贈者1人あたり1年間（1月1日〜12月31日）の贈与の合計が110万円以下なら贈与税はかかりません。複数の人からもらった分は合計して判定します。ただし、110万円以下でも申告が必要になる特例もあります。',
    },
    {
      question: '500万円を親からもらった場合の贈与税はいくらですか？',
      answer:
        '18歳以上の子が親から受け取る場合は特例税率で、500万円から基礎控除110万円を引いた390万円に15%をかけて控除額10万円を引き、48万5,000円です。一般税率だと53万円になります。',
    },
    {
      question: '特例税率と一般税率の贈与が両方あるときはどう計算しますか？',
      answer:
        '合計額から基礎控除を引いた課税価格全体に、特例税率と一般税率をそれぞれ当てはめて税額を出し、基礎控除前の贈与額の割合で按分して足します。国税庁が示す方法で、このツールもこの手順で計算しています。',
    },
    {
      question: '算出税額と納付額が違うのはなぜですか？',
      answer:
        '課税価格は1,000円未満、納付する税額は100円未満をそれぞれ切り捨てます。按分で端数が出た場合などに、算出税額と納付額の目安に最大99円の差が出ます。',
    },
    {
      question: '相続時精算課税や教育資金の非課税特例も計算できますか？',
      answer:
        'できません。このツールは暦年課税の基礎控除と速算表だけを扱います。相続時精算課税、住宅取得等資金や教育資金などの非課税特例、配偶者控除は含まれないため、税務署や税理士にご確認ください。',
    },
  ],
  en: [
    {
      question: 'How much can I receive without paying gift tax?',
      answer:
        'Under calendar-year taxation, no gift tax is due if the total you receive in one year (January 1 to December 31) is ¥1.1 million or less. Gifts from several donors are added together. Some special exemptions still require a return even below that amount.',
    },
    {
      question: 'What is the gift tax on ¥5 million from a parent?',
      answer:
        'For a child aged 18 or older, the special rate applies. ¥5 million minus the ¥1.1 million deduction is ¥3.9 million; 15% of that minus the ¥100,000 table deduction is ¥485,000. With the general rate it would be ¥530,000.',
    },
    {
      question:
        'How is tax calculated if I have both special and general gifts?',
      answer:
        'The tool applies both rate tables to the whole taxable amount after the basic deduction, then splits each result by the share of gifts before the deduction and adds the two parts. This is the National Tax Agency method.',
    },
    {
      question: 'Why do calculated tax and the payment differ?',
      answer:
        'The taxable amount is rounded down to ¥1,000 and the tax to be paid is rounded down to ¥100. After proration the calculated tax can have leftover yen, so the estimated payment can be up to ¥99 lower.',
    },
    {
      question:
        'Does this cover settlement taxation or education-fund exemptions?',
      answer:
        'No. It covers only the calendar-year basic deduction and rate tables. Settlement taxation, tax-exempt gifts for housing, education and marriage funds, and the spousal exemption are not included, so confirm with the tax office or a tax accountant.',
    },
  ],
};
