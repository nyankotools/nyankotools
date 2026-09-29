import type { FaqContent } from '../faq';

export const faq: FaqContent = {
  ja: [
    {
      question: '消費税の端数処理は選べますか？',
      answer:
        'はい。切り捨て・四捨五入・切り上げから選べます。実際のレシートや請求書は事業者ごとに端数処理の方式が異なるため、結果が一致しない場合は方式を切り替えて確認してください。',
    },
    {
      question: '軽減税率の8%はどんなときに使いますか？',
      answer:
        '飲食料品（外食・酒類を除く）や定期購読の新聞などに適用される税率です。適用対象かどうかは品目によって異なるため、国税庁の案内で確認してください。',
    },
    {
      question: '割引後の価格に消費税を加算するにはどうしますか？',
      answer:
        '割引率・割引額はそれぞれ単独で計算されます。割引後の価格に消費税を加える場合は、その価格を税抜金額の欄に入力してください。',
    },
  ],
  en: [
    {
      question: 'Can I choose how consumption tax is rounded?',
      answer:
        'Yes: round down, round to nearest, or round up. Businesses use different methods on receipts and invoices, so switch the method if your figures do not match.',
    },
    {
      question: 'When does the 8% reduced rate apply?',
      answer:
        'In Japan it applies to food and non-alcoholic beverages (excluding dining out) and subscription newspapers, among others. Check the National Tax Agency guidance for specific items.',
    },
    {
      question: 'How do I add tax to a discounted price?',
      answer:
        'Percentage and amount discounts are calculated separately. To add tax afterward, enter the discounted price as the pre-tax amount.',
    },
  ],
};
