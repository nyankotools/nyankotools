import type { FaqContent } from '../faq';

export const faq: FaqContent = {
  ja: [
    {
      question: '「初日を含めて数える」はどんなときに使いますか？',
      answer:
        '開始日と終了日の両方を1日として数えたいときに使います。民法上の期間計算は初日不算入が原則ですが、契約期間や工期の計算では初日を含める運用も一般的です。',
    },
    {
      question: '土日祝日を除いた営業日数は計算できますか？',
      answer:
        'いいえ。このツールはカレンダー上の日数を計算するもので、土日祝日や会社の休業日は考慮しません。営業日で数える場合は、別途カレンダーで確認してください。',
    },
    {
      question: '何年前の日付まで計算できますか？',
      answer:
        '西暦0001年〜9999年の範囲で入力できます。ただしグレゴリオ暦を前提にしているため、1582年より前の日付は実際の暦と一致しない場合があります。',
    },
  ],
  en: [
    {
      question: 'When should I use "include the first day"?',
      answer:
        'Use it when both the start and end dates should count as full days, such as project schedules and contract periods. Many legal systems exclude the first day by default, so choose based on your rules.',
    },
    {
      question:
        'Can it calculate business days excluding weekends and holidays?',
      answer:
        'No. It counts calendar days and does not account for weekends, public holidays or company closures.',
    },
    {
      question: 'How far back can I calculate?',
      answer:
        'Dates from year 0001 to 9999 are accepted. Calculations assume the Gregorian calendar, so dates before 1582 may not match the calendar actually in use then.',
    },
  ],
};
