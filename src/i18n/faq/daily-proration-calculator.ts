import type { FaqContent } from '../faq';

export const faq: FaqContent = {
  ja: [
    {
      question: '日割り計算は30日と暦日数のどちらで割るのが正しいですか？',
      answer:
        '法律で一つに決まっているわけではなく、契約によります。賃貸の日割り家賃は30日基準やその月の暦日数がよく使われ、給与は所定労働日数で割る会社もあります。契約書や規則で確認し、同じ基準を選んでください。',
    },
    {
      question: '開始日と終了日は日数に含まれますか？',
      answer:
        'このツールでは開始日も終了日も1日として数えます。たとえば1月16日から1月31日までは16日です。入居日や解約日を含めない契約の場合は、日付を1日ずらして入力してください。',
    },
    {
      question: '月をまたぐ期間はどう計算されますか？',
      answer:
        '「その月の暦日数」基準では、月ごとに日数÷その月の日数を計算して合算します。うるう年の2月は29日で割ります。30日基準と年換算は、通算の日数で計算します。',
    },
    {
      question: '端数処理はいつ行われますか？',
      answer:
        '月ごとの按分をすべて合算した最後に1回だけ行います。途中で丸めないため、月をまたいでも誤差が積み上がりません。端数処理前の金額も結果に表示します。',
    },
  ],
  en: [
    {
      question: 'Should I divide by 30 days or the days in the month?',
      answer:
        'No law fixes one method; it depends on your contract. Prorated rent in Japan often uses 30 days or the actual days in the month, and some employers divide salary by scheduled working days. Check your agreement and pick the same basis.',
    },
    {
      question: 'Are the start and end dates counted?',
      answer:
        'Yes, both are counted as full days. January 16 to January 31 is 16 days. If your contract excludes the move-in or cancellation day, shift the date by one day before entering it.',
    },
    {
      question: 'How is a period across several months calculated?',
      answer:
        'With the calendar basis, each month is calculated as days / days in that month and the results are added up. February in a leap year uses 29 days. The 30-day and annualized bases use the total day count.',
    },
    {
      question: 'When is the rounding applied?',
      answer:
        'Once, after all the monthly parts are added together. Nothing is rounded along the way, so errors do not build up across months. The amount before rounding is shown in the result too.',
    },
  ],
};
