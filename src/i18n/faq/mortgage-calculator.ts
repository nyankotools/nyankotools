import type { FaqContent } from '../faq';

export const faq: FaqContent = {
  ja: [
    {
      question: '期間短縮型と返済額軽減型の違いは何ですか？',
      answer:
        '期間短縮型は毎月の返済額をそのままに完済時期を早める方法で、利息の軽減効果が大きくなりやすいです。返済額軽減型は返済期間を変えず毎月の返済額を減らす方法で、家計の負担を軽くできます。',
    },
    {
      question: '元金均等返済には対応していますか？',
      answer:
        'いいえ。毎月の返済額が一定になる元利均等返済を前提とした簡易試算です。元金均等返済には対応していません。',
    },
    {
      question: '保証料や手数料は含まれていますか？',
      answer:
        '含まれません。団体信用生命保険料、保証料、繰り上げ返済手数料など、金利以外の諸費用は考慮していません。変動金利の場合も、金利は一定として試算します。',
    },
  ],
  en: [
    {
      question:
        'What is the difference between shortening the term and reducing payments?',
      answer:
        'Shortening the term keeps monthly payments and finishes earlier, usually saving more interest. Reducing payments keeps the term and lowers each monthly payment, easing cash flow.',
    },
    {
      question: 'Does it support equal-principal repayment?',
      answer:
        'No. It assumes equal total payments (annuity style) each month and does not support equal-principal repayment.',
    },
    {
      question: 'Are guarantee fees and charges included?',
      answer:
        'No. Costs other than interest, such as life insurance premiums, guarantee fees and prepayment fees, are not considered. Rates are assumed constant even for variable-rate loans.',
    },
  ],
};
