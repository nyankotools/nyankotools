import type { Locale } from '../../data/tools';

interface GlossaryTerm {
  term: string;
  description: string;
}

/** 結果表示の文言。[単数形, 複数形] の組は、件数が1のとき前者を使う（日本語は同じ文言） */
export interface DateResultFormat {
  /** 日曜始まりの7要素 */
  weekdayLabels: string[];
  days: [string, string];
  weeks: [string, string];
  /** {n} = 日数（終了日を含める場合の表記） */
  inclusivePeriod: string;
  sameDay: string;
  /** {days} */
  endAfter: string;
  endBefore: string;
  /** {weeks} {days} */
  weeksAndDays: string;
  /** {y} {m} {d}（{mm} {dd} は0埋め） */
  date: string;
  /** {w} */
  addWeekday: string;
}

export interface DateCalculatorPageContent {
  resultFormat: DateResultFormat;
  title: string;
  description: string;
  h1: string;
  introHtml: string;
  diffHeading: string;
  startLabel: string;
  startYearAriaLabel: string;
  startMonthAriaLabel: string;
  startDayAriaLabel: string;
  endLabel: string;
  endYearAriaLabel: string;
  endMonthAriaLabel: string;
  endDayAriaLabel: string;
  yearUnit: string;
  monthUnit: string;
  dayUnit: string;
  yearPlaceholder: string;
  monthPlaceholder: string;
  dayPlaceholder: string;
  inclusiveLabel: string;
  errorNonexistentDate: string;
  addHeading: string;
  baseLabel: string;
  baseYearAriaLabel: string;
  baseMonthAriaLabel: string;
  baseDayAriaLabel: string;
  daysLabel: string;
  daysPlaceholder: string;
  directionLabel: string;
  directionAfter: string;
  directionBefore: string;
  errorInvalidDays: string;
  errorAddCalculation: string;
  notesHeading: string;
  notes: string[];
  glossaryHeading: string;
  glossaryTerms: GlossaryTerm[];
}

export const dateCalculatorContent: Record<Locale, DateCalculatorPageContent> =
  {
    ja: {
      resultFormat: {
        weekdayLabels: ['日', '月', '火', '水', '木', '金', '土'],
        days: ['{n}日', '{n}日'],
        weeks: ['{n}週間', '{n}週間'],
        inclusivePeriod: '{n}日間',
        sameDay: '開始日と終了日は同じ日です',
        endAfter: '終了日は開始日の{days}後です',
        endBefore: '終了日は開始日の{days}前です',
        weeksAndDays: '＝ {weeks}{days}',
        date: '{y}年{m}月{d}日',
        addWeekday: '（{w}）',
      },
      title: '日数計算機（二つの日付の差・N日後の日付）',
      description:
        '二つの日付の差（日数）や、指定した日から○日後・○日前の日付を計算できる無料ツールです。初日を含めて数えるかどうかも選択可能。データはブラウザ内で処理され、サーバーには送信されません。',
      h1: '日数計算機',
      introHtml:
        '二つの日付の差（日数）や、指定した日から○日後・○日前の日付をリアルタイムで計算します。契約期間の日数確認や、納期・締切日の算出などに便利です。ブラウザ内で処理され、入力内容がサーバーに送信されることはありません。年月日を和暦で確認したい場合は <a href="/tools/japanese-era-converter/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">和暦⇔西暦変換</a> もあわせてご利用ください。',
      diffHeading: '二つの日付の差',
      startLabel: '開始日',
      startYearAriaLabel: '開始日の年（西暦）',
      startMonthAriaLabel: '開始日の月',
      startDayAriaLabel: '開始日の日',
      endLabel: '終了日',
      endYearAriaLabel: '終了日の年（西暦）',
      endMonthAriaLabel: '終了日の月',
      endDayAriaLabel: '終了日の日',
      yearUnit: '年',
      monthUnit: '月',
      dayUnit: '日',
      yearPlaceholder: '2024',
      monthPlaceholder: '6',
      dayPlaceholder: '15',
      inclusiveLabel: '初日を含めて数える',
      errorNonexistentDate: '存在しない日付です',
      addHeading: '日付から計算（○日後・○日前）',
      baseLabel: '基準日',
      baseYearAriaLabel: '基準日の年（西暦）',
      baseMonthAriaLabel: '基準日の月',
      baseDayAriaLabel: '基準日の日',
      daysLabel: '日数',
      daysPlaceholder: '7',
      directionLabel: '方向',
      directionAfter: '後',
      directionBefore: '前',
      errorInvalidDays: '日数には0以上の整数を入力してください',
      errorAddCalculation:
        '計算できませんでした（基準日または日数を確認してください）',
      notesHeading: '注意事項',
      notes: [
        '本ツールはグレゴリオ暦を前提に計算しています。1582年より前の日付（改暦前）は実際の暦と一致しない場合があります。',
        '「初日を含めて数える」は、開始日・終了日の両方を1日として数える設定です（民法の原則は初日不算入ですが、契約期間や工期の計算では初日を含める運用も一般的です）。',
        '日付の入力範囲は西暦0001年〜9999年です。',
      ],
      glossaryHeading: '用語解説',
      glossaryTerms: [
        {
          term: '初日不算入（しょじつふさんにゅう）',
          description:
            '民法140条の原則で、期間を計算するとき開始日（初日）は含めず翌日から数えるという考え方です。日常の日数計算では「初日を含めるかどうか」で迷いやすいため、本ツールでは両方の数え方を選べるようにしています。',
        },
        {
          term: 'うるう年（閏年）',
          description:
            '4年に一度、2月に29日が追加される年です。ただし100で割り切れる年はうるう年にならず、さらに400で割り切れる年は例外的にうるう年になります（例: 1900年はうるう年でないが2000年はうるう年）。',
        },
      ],
    },
    en: {
      resultFormat: {
        weekdayLabels: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
        days: ['{n} day', '{n} days'],
        weeks: ['{n} week', '{n} weeks'],
        inclusivePeriod: '{n}-day period',
        sameDay: 'The start date and end date are the same day',
        endAfter: 'The end date is {days} after the start date',
        endBefore: 'The end date is {days} before the start date',
        weeksAndDays: '= {weeks} {days}',
        date: '{y}-{mm}-{dd}',
        addWeekday: ' ({w})',
      },
      title: 'Date Calculator (Difference Between Dates, Days From a Date)',
      description:
        'Calculate the days between two dates, or the date N days before or after a date. Runs in your browser; nothing is sent to a server.',
      h1: 'Date Calculator',
      introHtml:
        'Calculates the difference in days between two dates, or the date a set number of days before or after a given date, in real time. Handy for checking contract periods or working out deadlines. Everything happens in your browser, and nothing you type is ever sent to a server. If you need to convert a date to the Japanese era calendar, check out the <a href="/en/tools/japanese-era-converter/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">Japanese Era Converter</a> as well.',
      diffHeading: 'Difference between two dates',
      startLabel: 'Start date',
      startYearAriaLabel: 'Start year',
      startMonthAriaLabel: 'Start month',
      startDayAriaLabel: 'Start day',
      endLabel: 'End date',
      endYearAriaLabel: 'End year',
      endMonthAriaLabel: 'End month',
      endDayAriaLabel: 'End day',
      yearUnit: '-',
      monthUnit: '-',
      dayUnit: '',
      yearPlaceholder: '2024',
      monthPlaceholder: '6',
      dayPlaceholder: '15',
      inclusiveLabel: 'Count both dates (inclusive)',
      errorNonexistentDate: 'That date does not exist',
      addHeading: 'Date from a starting point',
      baseLabel: 'Base date',
      baseYearAriaLabel: 'Base year',
      baseMonthAriaLabel: 'Base month',
      baseDayAriaLabel: 'Base day',
      daysLabel: 'Days',
      daysPlaceholder: '7',
      directionLabel: 'Direction',
      directionAfter: 'After',
      directionBefore: 'Before',
      errorInvalidDays: 'Please enter an integer of 0 or greater',
      errorAddCalculation:
        'Could not calculate (please check the base date and days)',
      notesHeading: 'Notes',
      notes: [
        'This tool assumes the Gregorian calendar throughout. Dates before its adoption (pre-1582) may not match the calendar actually in use at the time.',
        '"Count both dates (inclusive)" counts both the start date and end date as full days — commonly used for contract periods or project durations.',
        'The supported date range is year 0001 through 9999.',
      ],
      glossaryHeading: 'Glossary',
      glossaryTerms: [
        {
          term: 'Inclusive counting',
          description:
            'Counting both the start date and end date as full days. Many everyday date calculations (contract periods, project durations) count this way, while some legal contexts count only from the day after the start date. This tool lets you choose either.',
        },
        {
          term: 'Leap year',
          description:
            'A year with an extra day (February 29), occurring every 4 years — except years divisible by 100, which are not leap years unless also divisible by 400 (e.g. 1900 is not a leap year, but 2000 is).',
        },
      ],
    },
  };
