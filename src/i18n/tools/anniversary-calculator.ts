import type { Locale } from '../../data/tools';

interface GlossaryTerm {
  term: string;
  description: string;
}

/** 結果表示の文言。[単数形, 複数形] の組は、件数が1のとき前者を使う（日本語は同じ文言） */
export interface AnniversaryFormat {
  /** 日曜始まりの7要素 */
  weekdayLabels: string[];
  days: [string, string];
  weeks: [string, string];
  /** {y} {m} {d}（{mm} {dd} は0埋め） */
  date: string;
  /** {date} {w} */
  dateWithWeekday: string;
  /** {n}。初日を1日目として数える場合 */
  labelDaysInclusive: string;
  /** {n}。初日を0日目として数える場合 */
  labelDaysExclusive: string;
  labelMonths: string;
  labelYears: string;
  /** {days} */
  remainFuture: string;
  remainToday: string;
  remainPast: string;
  /** {days} {n} */
  elapsed: string;
  /** {days} */
  beforeStart: string;
  elapsedToday: string;
  /** {label} {date} {days} */
  nextFuture: string;
  /** {label} {date} */
  nextToday: string;
  nextNone: string;
  /** {label} {date} {remain} */
  custom: string;
  /** {days} {date} */
  countdownFuture: string;
  /** {date} */
  countdownToday: string;
  /** {days} {date} */
  countdownPast: string;
  /** {weeks} {days} */
  weeksAndDays: string;
}

export interface AnniversaryCalculatorPageContent {
  format: AnniversaryFormat;
  title: string;
  description: string;
  h1: string;
  introHtml: string;
  settingsHeading: string;
  startLabel: string;
  baseLabel: string;
  todayButton: string;
  inclusiveLabel: string;
  leapLabel: string;
  leapFeb28: string;
  leapMar1: string;
  startEmptyHint: string;
  listHeading: string;
  kindLabel: string;
  kindDays: string;
  kindMonths: string;
  kindYears: string;
  colMilestone: string;
  colDate: string;
  colRemaining: string;
  nextBadge: string;
  customHeading: string;
  customLabel: string;
  customPlaceholder: string;
  errorCustomDays: string;
  errorOutOfRange: string;
  countdownHeading: string;
  eventLabel: string;
  eventEmptyHint: string;
  howToHeading: string;
  howToSteps: string[];
  notesHeading: string;
  notes: string[];
  glossaryHeading: string;
  glossaryTerms: GlossaryTerm[];
}

export const anniversaryCalculatorContent: Record<
  Locale,
  AnniversaryCalculatorPageContent
> = {
  ja: {
    format: {
      weekdayLabels: ['日', '月', '火', '水', '木', '金', '土'],
      days: ['{n}日', '{n}日'],
      weeks: ['{n}週間', '{n}週間'],
      date: '{y}年{m}月{d}日',
      dateWithWeekday: '{date}（{w}）',
      labelDaysInclusive: '{n}日目',
      labelDaysExclusive: '{n}日後',
      labelMonths: '{n}か月',
      labelYears: '{n}周年',
      remainFuture: 'あと{days}',
      remainToday: '今日',
      remainPast: '{days}前',
      elapsed: '基準日は起点日から{days}経過（起点日を1日目として{n}日目）',
      beforeStart: '基準日は起点日の{days}前です',
      elapsedToday: '基準日は起点日当日です（1日目）',
      nextFuture: '次の記念日は {label}（{date}）まで、あと{days}',
      nextToday: '今日は {label} の記念日です（{date}）',
      nextNone: '基準日以降の記念日は一覧にありません',
      custom: '{label}は {date}（{remain}）',
      countdownFuture: 'イベント（{date}）まで、あと{days}',
      countdownToday: 'イベントは今日です（{date}）',
      countdownPast: 'イベント（{date}）から{days}経過しました',
      weeksAndDays: '＝ {weeks}{days}',
    },
    title: '記念日計算（100日記念・周年・カウントダウン）',
    description:
      '起点日から100日・200日・1000日記念、○か月・○周年の日付を一覧で計算し、今日からの残り日数も表示。イベントまであと何日かのカウントダウンも。うるう日（2/29）の扱いも選択可。データはブラウザ内で処理され、サーバーには送信されません。',
    h1: '記念日計算（○日記念・周年・カウントダウン）',
    introHtml:
      '付き合った日・結婚した日・開業日などの起点日を入れると、100日・200日…1000日記念、○か月記念、○周年の日付と曜日、今日からの残り日数を一覧にします。ライブやクリスマスなどイベントまであと何日かのカウントダウンにも使えます。入力内容はブラウザ内だけで処理されます。二つの日付の日数差だけを知りたいときは <a href="/tools/date-calculator/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">日数計算機</a>、土日祝日を除く日数は <a href="/tools/business-day-calculator/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">営業日計算</a> をご利用ください。',
    settingsHeading: '起点日と基準日',
    startLabel: '起点日（記念日の元になる日）',
    baseLabel: '基準日（通常は今日）',
    todayButton: '今日に戻す',
    inclusiveLabel: '起点日を1日目として数える（○日目）',
    leapLabel: '2月29日起点で、うるう年でない年の周年',
    leapFeb28: '2月28日とする',
    leapMar1: '3月1日とする',
    startEmptyHint: '起点日を入力すると、記念日の一覧が表示されます。',
    listHeading: '記念日の一覧',
    kindLabel: '一覧の種類',
    kindDays: '日数（100日・1000日…）',
    kindMonths: 'か月（1〜36か月）',
    kindYears: '周年（1〜50年）',
    colMilestone: '記念日',
    colDate: '日付',
    colRemaining: '今日（基準日）から',
    nextBadge: '次',
    customHeading: '好きな日数で調べる',
    customLabel: '起点日から何日目（後）か',
    customPlaceholder: '例: 777',
    errorCustomDays: '日数には1以上の整数を入力してください',
    errorOutOfRange: '計算できる範囲（西暦1〜9999年）を超えています',
    countdownHeading: 'イベントまでのカウントダウン',
    eventLabel: 'イベント日',
    eventEmptyHint: 'イベント日を入力すると、基準日からの日数が表示されます。',
    howToHeading: '使い方',
    howToSteps: [
      '「起点日」に付き合った日や開業日などを入力します（基準日は初期値が今日です）。',
      '「一覧の種類」で日数・か月・周年を切り替え、記念日の日付と残り日数を確認します。',
      '数え方が違うときは「起点日を1日目として数える」を切り替えます。',
      'イベントの日付を入れると、あと何日かが表示されます。',
    ],
    notesHeading: '注意事項',
    notes: [
      '「起点日を1日目として数える」をオンにすると、起点日が1日目、100日目は起点日の99日後になります。オフにすると起点日が0日目で、100日後は起点日の100日後です。恋人の記念日などでは前者がよく使われます。',
      '○周年は起点日と同じ月日で、数え方の設定には影響されません。起点日が2月29日でうるう年でない年は、既定で2月28日（月末日）とします。3月1日にも切り替えられます。',
      '○か月後に同じ日がない場合（1月31日の1か月後など）は、その月の末日に丸めます。',
      '日付はすべてカレンダー上の日で計算するため、サマータイムやタイムゾーンの影響は受けません。グレゴリオ暦で西暦1〜9999年の範囲に対応します。',
    ],
    glossaryHeading: '用語解説',
    glossaryTerms: [
      {
        term: '初日算入・初日不算入',
        description:
          '起点日を1日目に数えるのが初日算入、翌日を1日目とするのが初日不算入です。民法の期間計算は初日不算入が原則ですが、記念日では起点日を1日目とする数え方も多く使われます。',
      },
      {
        term: '応当日（おうとうび）',
        description:
          '起点日から見て同じ月日にあたる日のことです。○周年や○か月後の日付がこれにあたります。該当する日がない月は末日とみなすのが一般的です。',
      },
    ],
  },
  en: {
    format: {
      weekdayLabels: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
      days: ['{n} day', '{n} days'],
      weeks: ['{n} week', '{n} weeks'],
      date: '{y}-{mm}-{dd}',
      dateWithWeekday: '{date} ({w})',
      labelDaysInclusive: 'Day {n}',
      labelDaysExclusive: '{n} days after',
      labelMonths: '{n}-month mark',
      labelYears: '{n}-year anniversary',
      remainFuture: 'in {days}',
      remainToday: 'Today',
      remainPast: '{days} ago',
      elapsed: 'The reference date is {days} after the start date (day {n})',
      beforeStart: 'The reference date is {days} before the start date',
      elapsedToday: 'The reference date is the start date itself (day 1)',
      nextFuture: 'Next up: {label} on {date}, in {days}',
      nextToday: 'Today is the {label} ({date})',
      nextNone: 'No milestones in the list on or after the reference date',
      custom: '{label}: {date} ({remain})',
      countdownFuture: '{days} until the event ({date})',
      countdownToday: 'The event is today ({date})',
      countdownPast: 'The event ({date}) was {days} ago',
      weeksAndDays: '= {weeks} {days}',
    },
    title: 'Anniversary Calculator (100 Days, Years, Countdown)',
    description:
      'List 100-day, 1000-day, monthly and yearly anniversary dates from a start date, with days remaining. Also counts down to an event. Runs in your browser.',
    h1: 'Anniversary Calculator and Countdown',
    introHtml:
      'Enter a start date such as the day you met, married or opened a business, and get the dates and weekdays of the 100-day, 200-day … 1000-day, monthly and yearly milestones, plus how far away each one is from today. You can also count down the days to an event like a concert or holiday. Everything is processed in your browser. To simply measure the gap between two dates, use the <a href="/en/tools/date-calculator/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">Date Calculator</a>; for working days only, try the <a href="/en/tools/business-day-calculator/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">Business Day Calculator</a>.',
    settingsHeading: 'Start date and reference date',
    startLabel: 'Start date (the day to count from)',
    baseLabel: 'Reference date (usually today)',
    todayButton: 'Reset to today',
    inclusiveLabel: 'Count the start date as day 1',
    leapLabel: 'Yearly anniversaries of Feb 29 in non-leap years',
    leapFeb28: 'Use February 28',
    leapMar1: 'Use March 1',
    startEmptyHint: 'Enter a start date to see the list of milestones.',
    listHeading: 'Milestone list',
    kindLabel: 'List type',
    kindDays: 'Days (100, 1000 …)',
    kindMonths: 'Months (1-36)',
    kindYears: 'Years (1-50)',
    colMilestone: 'Milestone',
    colDate: 'Date',
    colRemaining: 'From reference date',
    nextBadge: 'Next',
    customHeading: 'Look up any number of days',
    customLabel: 'Number of days from the start date',
    customPlaceholder: 'e.g. 777',
    errorCustomDays: 'Please enter an integer of 1 or greater',
    errorOutOfRange: 'That is beyond the supported range (years 1-9999)',
    countdownHeading: 'Countdown to an event',
    eventLabel: 'Event date',
    eventEmptyHint:
      'Enter an event date to see how many days it is from the reference date.',
    howToHeading: 'How to use',
    howToSteps: [
      'Enter the "Start date" such as the day you met or opened; the reference date defaults to today.',
      'Switch the list between days, months and years to see each milestone date and how far away it is.',
      'Toggle "Count the start date as day 1" if you count days a different way.',
      'Enter an event date to see how many days are left.',
    ],
    notesHeading: 'Notes',
    notes: [
      'With "Count the start date as day 1" on, the start date is day 1 and day 100 is 99 days later. With it off, the start date is day 0 and 100 days after is exactly 100 days later.',
      'Yearly anniversaries fall on the same month and day as the start date and do not depend on that setting. For a Feb 29 start in a non-leap year, February 28 is used by default; you can switch to March 1.',
      'When a later month has no matching day (for example one month after January 31), the last day of that month is used.',
      'All calculations use calendar dates, so daylight saving time and time zones do not affect the result. The Gregorian calendar and years 1 to 9999 are supported.',
    ],
    glossaryHeading: 'Glossary',
    glossaryTerms: [
      {
        term: 'Inclusive vs. exclusive counting',
        description:
          'Inclusive counting treats the start date as day 1; exclusive counting treats the following day as day 1. Legal period calculations often exclude the first day, while personal anniversaries are frequently counted inclusively.',
      },
      {
        term: 'Corresponding day',
        description:
          'The day that has the same day-of-month as the start date in a later month or year. When the month has no such day, the last day of that month is normally used.',
      },
    ],
  },
};
