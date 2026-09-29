import type { FaqContent } from '../faq';

export const faq: FaqContent = {
  ja: [
    {
      question: '手取りの計算にはどの年度の税制を使っていますか？',
      answer:
        '令和6年分の所得税・住民税の税率区分と基礎控除額（所得税48万円、住民税43万円）を使っています。税制改正で数値が変わる場合があり、令和6年分の定額減税は考慮していません。',
    },
    {
      question: '個人事業税や消費税は含まれますか？',
      answer:
        '含まれません。個人事業税、消費税（インボイス制度を含む）、ふるさと納税、iDeCoなどの控除は考慮していません。その他の控除は「その他の所得控除」欄にまとめて入力してください。',
    },
    {
      question: '実際の確定申告の結果とずれることはありますか？',
      answer:
        'あります。住民税の調整控除は考慮しておらず、1,000円未満の端数処理なども簡略化しているため、実際の税額と数千円程度以上ずれることがあります。正確な税額は税理士や税務署に確認してください。',
    },
  ],
  en: [
    {
      question: 'Which tax year does the calculation use?',
      answer:
        'It uses the 2024 (Reiwa 6) Japanese income and resident tax brackets and basic deductions (¥480,000 for income tax, ¥430,000 for resident tax). Later tax reforms are not reflected, and the 2024 flat-rate tax reduction is not applied.',
    },
    {
      question: 'Are business tax and consumption tax included?',
      answer:
        'No. Individual business tax, consumption tax (including the invoice system), hometown tax donations and deductions such as iDeCo are not considered. Enter other deductions together in the "other deductions" field.',
    },
    {
      question: 'Can the result differ from my actual tax return?',
      answer:
        'Yes. The resident tax adjustment credit is not taken into account and rounding rules are simplified, so the result can differ from the actual tax by a few thousand yen or more. For exact amounts, consult a tax professional or the tax office.',
    },
  ],
};
