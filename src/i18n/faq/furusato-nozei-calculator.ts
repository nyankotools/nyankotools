import type { FaqContent } from '../faq';

export const faq: FaqContent = {
  ja: [
    {
      question: '年収500万円だと、ふるさと納税はいくらまでできますか？',
      answer:
        '独身または共働きで扶養家族がいない場合、自己負担2,000円で寄付できる上限は約6万円が目安です。年収が上がるほど上限も大きくなり、年収300万円で約2.9万円、年収800万円で約13万円が目安です。',
    },
    {
      question: '上限額ちょうどまで寄付しても大丈夫ですか？',
      answer:
        '上限ぎりぎりまで寄付すると、住民税額の確定値とのずれや、年内の収入・控除の変動で自己負担が2,000円を超えることがあります。目安の9割程度までに収めると安心です。ワンストップ特例の申請を忘れた場合も控除されません。',
    },
    {
      question: '扶養家族や配偶者がいる場合はどう入力しますか？',
      answer:
        '配偶者控除や扶養控除の合計額を「基礎控除以外の所得控除の合計」に入力してください。控除が増えるほど課税所得が減り、ふるさと納税の上限額も下がります。調整控除は基礎控除分だけを想定した簡易計算です。',
    },
    {
      question: '住宅ローン控除や医療費控除を受けていると上限は変わりますか？',
      answer:
        '医療費控除は所得控除なので、その金額を「その他の所得控除」に加えれば上限に反映できます。一方、住宅ローン控除は住民税から差し引かれる分があると、控除上限が下がることがあります。このツールでは反映できないため、実際の上限はこの試算より低くなる場合があります。',
    },
    {
      question: '自営業やフリーランスでも使えますか？',
      answer:
        '給与収入のみの会社員向けの試算です。事業所得のある方は、所得の計算方法や社会保険料が異なるため、そのままでは正確に出ません。目安として使う場合は、事業所得を年収欄に入力するのではなく、確定申告書の数字をもとに確認してください。',
    },
  ],
  en: [
    {
      question: 'How much can I donate on a ¥5 million salary?',
      answer:
        'For a single person or a couple without dependents, the limit for a ¥2,000 out-of-pocket cost is around ¥60,000. The limit rises with income: roughly ¥29,000 at ¥3 million and ¥130,000 at ¥8 million.',
    },
    {
      question: 'Is it safe to donate exactly up to the limit?',
      answer:
        'Donating right at the limit can leave you paying more than ¥2,000 if your final resident tax or your income and deductions for the year differ from the estimate. Staying around 90% of the estimate is safer. Forgetting the One-Stop application also means no deduction.',
    },
    {
      question: 'How do I enter a spouse or dependents?',
      answer:
        'Add up your spousal and dependent deductions and enter the total under "other income deductions". The more deductions you have, the lower your taxable income and the lower your limit. The adjustment credit is a simplified figure that assumes only the basic-deduction difference.',
    },
    {
      question:
        'Does the housing loan deduction or medical expense deduction change the limit?',
      answer:
        'The medical expense deduction is an income deduction, so add it to "other income deductions" to reflect it. The housing loan deduction, however, can lower your limit if part of it is taken from resident tax. This tool cannot reflect it, so your real limit may be lower than the estimate.',
    },
    {
      question: 'Does this work for freelancers or the self-employed?',
      answer:
        'It is designed for employees whose only income is salary. Business income is calculated differently and has different insurance costs, so the result would not be accurate. Use the figures from your tax return as the basis instead of entering business income as a salary.',
    },
  ],
};
