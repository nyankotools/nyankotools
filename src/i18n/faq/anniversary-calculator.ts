import type { FaqContent } from '../faq';

export const faq: FaqContent = {
  ja: [
    {
      question: '100日記念は付き合った日の何日後ですか？',
      answer:
        '数え方によって1日ずれます。付き合った日を1日目として数える場合、100日目は99日後です。付き合った日を0日目とする場合は100日後です。このツールでは「起点日を1日目として数える」で切り替えられます。',
    },
    {
      question: '2月29日が起点のとき、周年はいつになりますか？',
      answer:
        'うるう年でない年は応当日の2月29日がないため、既定では2月28日として計算します。3月1日に切り替えることもできます。うるう年にあたる年は2月29日のままです。',
    },
    {
      question: '1月31日の1か月後は何日になりますか？',
      answer:
        '2月には31日がないため、その月の末日（2月28日、うるう年は2月29日）に丸めます。2か月後は3月31日のように、毎回起点日の日付から計算し直します。',
    },
    {
      question: 'イベントまでの日数に当日は含まれますか？',
      answer:
        '基準日からイベント日までの暦上の差を表示します。今日が12日でイベントが15日なら「あと3日」で、当日は「イベントは今日です」と表示します。',
    },
  ],
  en: [
    {
      question: 'How many days after we met is our 100-day anniversary?',
      answer:
        'It depends on how you count. If the day you met is day 1, day 100 is 99 days later; if it is day 0, the 100-day mark is 100 days later. Use the "Count the start date as day 1" option to switch.',
    },
    {
      question: 'What date is a yearly anniversary of February 29?',
      answer:
        'In years that are not leap years there is no February 29, so February 28 is used by default. You can switch to March 1. In leap years the anniversary stays on February 29.',
    },
    {
      question: 'What is one month after January 31?',
      answer:
        'February has no 31st, so the last day of that month is used (February 28, or 29 in a leap year). Each milestone is calculated from the start date, so two months after January 31 is March 31.',
    },
    {
      question: 'Does the countdown to an event include the event day?',
      answer:
        'It shows the calendar difference from the reference date. If today is the 12th and the event is on the 15th, it says 3 days; on the day itself it says the event is today.',
    },
  ],
};
