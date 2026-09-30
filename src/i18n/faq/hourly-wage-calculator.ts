import type { FaqContent } from '../faq';

export const faq: FaqContent = {
  ja: [
    {
      question: '残業代の割増率は何％で計算されますか？',
      answer:
        '労働基準法の最低ラインである、時間外労働25%、月60時間を超える時間外労働50%、法定休日労働35%、深夜労働25%を初期値にしています。実際の支給額は就業規則や雇用契約で異なる場合があります。',
    },
    {
      question: '年収にはボーナスが含まれますか？',
      answer:
        '含まれません。年収は月給を単純に12倍した金額で、賞与（ボーナス）や各種手当は含みません。',
    },
    {
      question: '時給・日給・月給の換算はどう計算していますか？',
      answer:
        '時給・日給・月給・年収のいずれか1つを入力し、1日の労働時間と月の労働日数を指定すると、残りを自動で換算します。会社ごとに計算方法が異なるため、給与の根拠資料としてではなく目安としてお使いください。',
    },
  ],
  en: [
    {
      question: 'What overtime premium rates are used?',
      answer:
        "The defaults are the statutory minimums under Japan's Labor Standards Act: 25% for overtime, 50% for overtime beyond 60 hours a month, 35% for work on legal holidays and 25% for late-night work. Actual pay may differ under your employment contract.",
    },
    {
      question: 'Does annual income include bonuses?',
      answer:
        'No. Annual income is simply the monthly pay multiplied by 12, excluding bonuses and allowances.',
    },
    {
      question: 'How are hourly, daily and monthly pay converted?',
      answer:
        'Enter any one of hourly, daily, monthly or annual pay, plus hours per day and days per month, and the rest are derived. Employers calculate this differently, so use the result as a guide, not as an official basis.',
    },
  ],
};
