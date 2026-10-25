import type { Locale } from '../../data/tools';

interface GlossaryTerm {
  term: string;
  description: string;
}

/** 結果表示の文言 */
export interface WeekResultFormat {
  /** 日曜始まりの7要素 */
  weekdayLabels: string[];
  /** {y} {m} {d}（{mm} {dd} は0埋め） */
  date: string;
  /** {iso} {ww}（0埋め2桁） {w} */
  week: string;
  /** {n} */
  dayOfYear: string;
  /** {n} */
  remaining: string;
  /** {q} */
  quarter: string;
  /** {start} {end} */
  range: string;
  /** {n} */
  weeksInYear: string;
}

export interface WeekNumberCalculatorPageContent {
  resultFormat: WeekResultFormat;
  title: string;
  description: string;
  h1: string;
  introHtml: string;
  howToHeading: string;
  howToSteps: string[];
  lookupHeading: string;
  dateLabel: string;
  yearAriaLabel: string;
  monthAriaLabel: string;
  dayAriaLabel: string;
  yearUnit: string;
  monthUnit: string;
  dayUnit: string;
  yearPlaceholder: string;
  monthPlaceholder: string;
  dayPlaceholder: string;
  todayButton: string;
  errorNonexistentDate: string;
  weekNumberLabel: string;
  isoYearLabel: string;
  weekdayLabel: string;
  dayOfYearLabel: string;
  remainingLabel: string;
  quarterLabel: string;
  weekRangeLabel: string;
  weeksInYearLabel: string;
  reverseHeading: string;
  reverseYearLabel: string;
  reverseWeekLabel: string;
  reverseYearPlaceholder: string;
  reverseWeekPlaceholder: string;
  reverseResultLabel: string;
  errorInvalidWeek: string;
  notesHeading: string;
  notes: string[];
  glossaryHeading: string;
  glossaryTerms: GlossaryTerm[];
}

export const weekNumberCalculatorContent: Record<
  Locale,
  WeekNumberCalculatorPageContent
> = {
  ja: {
    resultFormat: {
      weekdayLabels: [
        '日曜日',
        '月曜日',
        '火曜日',
        '水曜日',
        '木曜日',
        '金曜日',
        '土曜日',
      ],
      date: '{y}年{m}月{d}日',
      week: '第{w}週（{iso}-W{ww}）',
      dayOfYear: '{n}日目',
      remaining: '残り{n}日',
      quarter: '第{q}四半期（Q{q}）',
      range: '{start}（月）〜 {end}（日）',
      weeksInYear: '{n}週',
    },
    title: '週番号計算（ISO週番号・年の何日目）',
    description:
      '日付からISO 8601の週番号・ISO週年・曜日・年の何日目・残り日数・四半期を調べられる無料ツールです。年と週番号から月曜〜日曜の日付も逆引き可能。データはブラウザ内で処理され、サーバーには送信されません。',
    h1: '週番号計算（ISO週番号・年の何日目）',
    introHtml:
      '日付を入力すると、ISO 8601の週番号（W01〜W53）とISO週年、曜日、年の何日目か、年末までの残り日数、四半期を表示します。2024年12月30日が2025年の第1週になるような年末年始の境界も正しく扱えます。年と週番号からその週の月曜〜日曜の日付を調べる逆引きにも対応。印刷用のカレンダーが欲しいときは <a href="/tools/calendar-generator/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">カレンダー作成</a>、日数の差やN日後の計算は <a href="/tools/date-calculator/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">日数計算機</a> をご利用ください。ブラウザ内で処理され、入力内容がサーバーに送信されることはありません。',
    howToHeading: '使い方',
    howToSteps: [
      '「日付から調べる」に年・月・日を入力するか、「今日」ボタンを押します。',
      'ISO週番号、ISO週年、曜日、年の何日目、残り日数、四半期が表示されます。',
      '週番号から日付を知りたいときは「週番号から日付範囲を調べる」に年と週番号を入力します。',
    ],
    lookupHeading: '日付から調べる',
    dateLabel: '日付',
    yearAriaLabel: '年（西暦）',
    monthAriaLabel: '月',
    dayAriaLabel: '日',
    yearUnit: '年',
    monthUnit: '月',
    dayUnit: '日',
    yearPlaceholder: '2025',
    monthPlaceholder: '1',
    dayPlaceholder: '1',
    todayButton: '今日',
    errorNonexistentDate: '存在しない日付です',
    weekNumberLabel: 'ISO週番号',
    isoYearLabel: 'ISO週年',
    weekdayLabel: '曜日',
    dayOfYearLabel: '年の何日目',
    remainingLabel: '年末までの残り日数',
    quarterLabel: '四半期',
    weekRangeLabel: 'この週の範囲',
    weeksInYearLabel: 'ISO週年の週数',
    reverseHeading: '週番号から日付範囲を調べる',
    reverseYearLabel: 'ISO週年（西暦）',
    reverseWeekLabel: '週番号',
    reverseYearPlaceholder: '2025',
    reverseWeekPlaceholder: '1',
    reverseResultLabel: '範囲',
    errorInvalidWeek:
      'その年に存在しない週番号です（年は1〜9999、週番号は1〜52または53）',
    notesHeading: '注意事項',
    notes: [
      'ISO 8601の週は月曜始まりで、その週の木曜日が属する年を「ISO週年」とします。そのため1月上旬が前年の第52・53週、12月下旬が翌年の第1週になることがあります。',
      '米国などで使われる、日曜始まりで1月1日を含む週を第1週とする方式（US式）の週番号とは一致しない場合があります。本ツールはISO 8601方式のみ対応です。',
      '計算は日付そのものを使った暦計算で、お使いの端末のタイムゾーンや現在時刻の設定には影響されません（「今日」ボタンだけは端末の日付を使います）。',
      '日付の入力範囲は西暦0001年〜9999年で、グレゴリオ暦を前提にしています。',
    ],
    glossaryHeading: '用語解説',
    glossaryTerms: [
      {
        term: 'ISO週番号（ISO 8601）',
        description:
          '国際規格ISO 8601で定められた週の数え方です。週は月曜日に始まり、その年の最初の木曜日を含む週を第1週とします（1月4日を含む週と同じ）。1年は52週または53週になります。',
      },
      {
        term: 'ISO週年',
        description:
          '週番号とセットで使う「週ベースの年」です。その週の木曜日が属する暦年がISO週年になり、年初・年末の数日は暦年と1年ずれることがあります。',
      },
    ],
  },
  en: {
    resultFormat: {
      weekdayLabels: [
        'Sunday',
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday',
      ],
      date: '{y}-{mm}-{dd}',
      week: 'Week {w} ({iso}-W{ww})',
      dayOfYear: 'Day {n}',
      remaining: '{n} days left',
      quarter: 'Q{q}',
      range: '{start} (Mon) to {end} (Sun)',
      weeksInYear: '{n} weeks',
    },
    title: 'Week Number Calculator: ISO Week of Any Date',
    description:
      'Find the ISO 8601 week number, ISO year, weekday, day of year and quarter for any date, or look up a week’s Monday-to-Sunday dates. Runs in your browser.',
    h1: 'ISO Week Number Calculator',
    introHtml:
      'Enter a date to see its ISO 8601 week number (W01 to W53), ISO year, weekday, day of the year, days left in the year and quarter. Year-boundary cases are handled correctly, such as December 30, 2024 falling in week 1 of 2025. You can also work backwards from a year and week number to the Monday-to-Sunday dates. For a printable calendar, try the <a href="/en/tools/calendar-generator/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">Calendar Generator</a>; for the gap between two dates or the date N days later, use the <a href="/en/tools/date-calculator/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">Date Calculator</a>. Everything runs in your browser, and nothing you type is sent to a server.',
    howToHeading: 'How to use',
    howToSteps: [
      'Enter a year, month and day under "Look up a date", or press the "Today" button.',
      'The ISO week number, ISO year, weekday, day of the year, days left and quarter appear.',
      'To go the other way, enter a year and week number under "Find the dates of a week".',
    ],
    lookupHeading: 'Look up a date',
    dateLabel: 'Date',
    yearAriaLabel: 'Year',
    monthAriaLabel: 'Month',
    dayAriaLabel: 'Day',
    yearUnit: '-',
    monthUnit: '-',
    dayUnit: '',
    yearPlaceholder: '2025',
    monthPlaceholder: '1',
    dayPlaceholder: '1',
    todayButton: 'Today',
    errorNonexistentDate: 'That date does not exist',
    weekNumberLabel: 'ISO week number',
    isoYearLabel: 'ISO year',
    weekdayLabel: 'Weekday',
    dayOfYearLabel: 'Day of the year',
    remainingLabel: 'Days left in the year',
    quarterLabel: 'Quarter',
    weekRangeLabel: 'This week',
    weeksInYearLabel: 'Weeks in this ISO year',
    reverseHeading: 'Find the dates of a week',
    reverseYearLabel: 'ISO year',
    reverseWeekLabel: 'Week number',
    reverseYearPlaceholder: '2025',
    reverseWeekPlaceholder: '1',
    reverseResultLabel: 'Dates',
    errorInvalidWeek:
      'That week does not exist in that year (year 1-9999, week 1-52 or 53)',
    notesHeading: 'Notes',
    notes: [
      'ISO 8601 weeks start on Monday, and the ISO year is the year that contains the week’s Thursday. Because of this, early January can belong to week 52 or 53 of the previous year, and late December to week 1 of the next.',
      'US-style week numbers (weeks start on Sunday and week 1 contains January 1) can differ from ISO numbers. This tool supports ISO 8601 only.',
      'Calculations use the calendar date itself, so your device’s time zone does not affect them (only the "Today" button reads your device’s date).',
      'Dates from year 0001 to 9999 are accepted, using the Gregorian calendar throughout.',
    ],
    glossaryHeading: 'Glossary',
    glossaryTerms: [
      {
        term: 'ISO week number (ISO 8601)',
        description:
          'The international standard for numbering weeks. Weeks start on Monday, and week 1 is the week containing the first Thursday of the year (equivalently, the week containing January 4). A year has 52 or 53 weeks.',
      },
      {
        term: 'ISO year',
        description:
          'The week-based year that goes with a week number. It is the calendar year of the week’s Thursday, so a few days at the start or end of a year can belong to the neighboring ISO year.',
      },
    ],
  },
};
