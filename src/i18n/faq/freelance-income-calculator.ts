import type { FaqContent } from '../faq';

export const faq: FaqContent = {
  ja: [
    {
      question: '手取りの計算にはどの年度の税制を使っていますか？',
      answer:
        '令和7・8年分の所得税の税率区分と基礎控除額（令和7年度税制改正後の58万円＋特例加算、住民税は43万円）を使っています。今後の税制改正で数値が変わる場合があります。',
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
        'It uses the Japanese income tax brackets and basic deductions for tax years 2025-2026 (Reiwa 7-8), as amended by the FY2025 tax reform (¥580,000 plus special additions for lower incomes; ¥430,000 for resident tax). Future tax reforms are not reflected.',
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
