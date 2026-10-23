import type { Locale } from '../../data/tools';

interface GlossaryTerm {
  term: string;
  description: string;
}

export interface UnitSuffixes {
  years: string;
  months: string;
  weeks: string;
  days: string;
  hours: string;
  minutes: string;
  seconds: string;
}

export interface IsoDurationConverterPageContent {
  title: string;
  description: string;
  h1: string;
  introHtml: string;
  isoHeading: string;
  isoLabel: string;
  isoPlaceholder: string;
  errorFormat: string;
  errorNoComponents: string;
  errorTooLarge: string;
  breakdownLabel: string;
  totalSecondsLabel: string;
  totalMinutesLabel: string;
  totalHoursLabel: string;
  totalDaysLabel: string;
  approximateNotice: string;
  unitSuffixes: UnitSuffixes;
  unitSeparator: string;
  negativeLabel: string;
  copyButton: string;
  copied: string;
  copyFailed: string;
  secondsHeading: string;
  secondsLabel: string;
  secondsPlaceholder: string;
  errorSecondsInvalid: string;
  isoResultLabel: string;
  addHeading: string;
  addHint: string;
  baseLabel: string;
  useCurrentDatetime: string;
  endLabel: string;
  errorFractionalCalendar: string;
  endPlaceholder: string;
  notesHeading: string;
  notes: string[];
  glossaryHeading: string;
  glossaryTerms: GlossaryTerm[];
  numberLocale: string;
}

export const isoDurationConverterContent: Record<
  Locale,
  IsoDurationConverterPageContent
> = {
  ja: {
    title: 'ISO 8601 期間（duration）変換｜PT1H30Mを秒・分・時間に',
    description:
      'ISO 8601の期間（PT1H30M、P1Y2M3D、P2Wなど）を秒・分・時間・日に変換し、秒数からの逆変換や日時への加算もできる無料ツール。データはブラウザ内で処理され、サーバーには送信されません。',
    h1: 'ISO 8601 期間（duration）変換',
    introHtml:
      'YouTube API・OpenAPI・iCalendarなどで見かける ISO 8601 の期間表記（<code>PT1H30M</code>、<code>P1Y2M3DT4H5M6S</code>、<code>P2W</code> など）を、秒・分・時間・日に変換して成分ごとに分解します。秒数から期間文字列を作る逆変換や、基準日時に期間を足す計算もできます。ブラウザ内で処理され、入力内容がサーバーに送信されることはありません。日時とエポック秒の変換は <a href="/tools/unix-timestamp/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">Unixタイムスタンプ変換</a> もご利用ください。',
    isoHeading: 'ISO 8601期間 → 秒・分・時間',
    isoLabel: 'ISO 8601期間',
    isoPlaceholder: 'PT1H30M',
    errorFormat:
      'ISO 8601期間として読み取れません。P で始め、時間・分・秒は T の後ろに書きます（例: PT1H30M、P1DT2H、P2W）',
    errorNoComponents:
      '数値と単位がありません。P の後ろに 1Y・2M・3D・T4H などを続けてください',
    errorTooLarge: '値が大きすぎて計算できません',
    breakdownLabel: '分解',
    totalSecondsLabel: '合計（秒）',
    totalMinutesLabel: '合計（分）',
    totalHoursLabel: '合計（時間）',
    totalDaysLabel: '合計（日）',
    approximateNotice:
      '年・月を含むため、合計は概算です（1年=365.2425日、1か月=その12分の1で換算）。',
    unitSuffixes: {
      years: '年',
      months: 'か月',
      weeks: '週間',
      days: '日',
      hours: '時間',
      minutes: '分',
      seconds: '秒',
    },
    unitSeparator: ' ',
    negativeLabel: 'マイナス',
    copyButton: 'コピー',
    copied: 'コピーしました',
    copyFailed: 'コピーに失敗しました',
    secondsHeading: '秒数 → ISO 8601期間',
    secondsLabel: '秒数',
    secondsPlaceholder: '5400',
    errorSecondsInvalid:
      '秒数は数値で入力してください（小数・負数も可。例: 5400、1.5）',
    isoResultLabel: 'ISO 8601期間',
    addHeading: '基準日時に期間を足す',
    addHint:
      '上の「ISO 8601期間」欄の値を、基準日時にカレンダー通りに足し引きします。',
    baseLabel: '基準日時（ローカル時刻）',
    useCurrentDatetime: '現在日時を使う',
    endLabel: '結果の日時',
    errorFractionalCalendar:
      '年・月が小数の期間はカレンダー上で加算できません。整数にするか、日数や時間で指定してください',
    endPlaceholder: '-',
    notesHeading: '注意事項',
    notes: [
      '年と月の長さは固定ではないため、秒・分・時間・日への換算は概算です（1年=365.2425日、1か月=その12分の1）。正確な日時を求めたい場合は、基準日時に期間を足す機能を使ってください。',
      '週（W）は7日として換算します。仕様上は週を他の単位と併記できないとされますが、このツールではP1W2Dのような併記も読み取ります。',
      '小数は最小の単位に付けるのが仕様ですが、このツールは任意の単位の小数（小数点はドットまたはカンマ）を読み取ります。',
      '1日は24時間（86400秒）として計算します。夏時間による日の長さの変化は、秒への換算では考慮しません。',
      '入力の英字は大文字・小文字どちらでも読み取れます。先頭に - を付けると負の期間として扱います。',
    ],
    glossaryHeading: '用語解説',
    glossaryTerms: [
      {
        term: 'ISO 8601 期間（duration）',
        description:
          '「P」で始まり、年Y・月M・週W・日D、続けて「T」の後ろに時間H・分M・秒Sを並べて時間の長さを表す形式です。PT1H30Mは1時間30分、P1Y2M3Dは1年2か月3日を意味します。',
      },
      {
        term: 'T（時刻区切り）',
        description:
          '日付側の単位と時刻側の単位を分ける文字です。Mは月と分の両方に使われるため、P1Mは1か月、PT1Mは1分と区別されます。',
      },
      {
        term: 'iCalendar の DURATION',
        description:
          'カレンダーのアラーム（VALARM）などで使われる期間表記です。-PT15Mのように負の値で「15分前」を表します。',
      },
    ],
    numberLocale: 'ja-JP',
  },
  en: {
    title: 'ISO 8601 Duration Converter (PT1H30M to Seconds)',
    description:
      'Convert ISO 8601 durations (PT1H30M, P1Y2M3D, P2W) to seconds, minutes and hours, or back. Add a duration to a date. Runs in your browser.',
    h1: 'ISO 8601 Duration Converter',
    introHtml:
      'Paste an ISO 8601 duration such as <code>PT1H30M</code>, <code>P1Y2M3DT4H5M6S</code> or <code>P2W</code> (as seen in the YouTube API, OpenAPI and iCalendar) to get the total in seconds, minutes, hours and days, plus a breakdown by component. You can also turn a number of seconds into a duration string, or add a duration to a date. Everything happens in your browser, and nothing you type is sent to a server. For epoch times, see the <a href="/en/tools/unix-timestamp/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">Unix Timestamp Converter</a>.',
    isoHeading: 'ISO 8601 duration → seconds, minutes, hours',
    isoLabel: 'ISO 8601 duration',
    isoPlaceholder: 'PT1H30M',
    errorFormat:
      'Not a valid ISO 8601 duration. Start with P and put hours, minutes and seconds after a T (e.g. PT1H30M, P1DT2H, P2W)',
    errorNoComponents:
      'No amount or unit found. Follow the P with something like 1Y, 2M, 3D or T4H',
    errorTooLarge: 'The value is too large to calculate',
    breakdownLabel: 'Breakdown',
    totalSecondsLabel: 'Total (seconds)',
    totalMinutesLabel: 'Total (minutes)',
    totalHoursLabel: 'Total (hours)',
    totalDaysLabel: 'Total (days)',
    approximateNotice:
      'The duration contains years or months, so the totals are approximate (1 year = 365.2425 days, 1 month = one twelfth of that).',
    unitSuffixes: {
      years: 'y',
      months: 'mo',
      weeks: 'w',
      days: 'd',
      hours: 'h',
      minutes: 'min',
      seconds: 's',
    },
    unitSeparator: ' ',
    negativeLabel: 'minus',
    copyButton: 'Copy',
    copied: 'Copied',
    copyFailed: 'Copy failed',
    secondsHeading: 'Seconds → ISO 8601 duration',
    secondsLabel: 'Seconds',
    secondsPlaceholder: '5400',
    errorSecondsInvalid:
      'Enter the seconds as a number (decimals and negatives are fine, e.g. 5400 or 1.5)',
    isoResultLabel: 'ISO 8601 duration',
    addHeading: 'Add the duration to a date',
    addHint:
      'Adds (or subtracts) the value from the ISO 8601 duration field above to the start date, following the calendar.',
    baseLabel: 'Start date/time (local)',
    useCurrentDatetime: 'Use current date/time',
    endLabel: 'Resulting date/time',
    errorFractionalCalendar:
      'A duration with fractional years or months cannot be added on a calendar. Use whole numbers, or express it in days or hours',
    endPlaceholder: '-',
    notesHeading: 'Notes',
    notes: [
      'Years and months do not have a fixed length, so converting them to seconds, minutes, hours or days is only an estimate (1 year = 365.2425 days, 1 month = one twelfth of that). For an exact result, use the date addition section instead.',
      'A week (W) counts as 7 days. The standard says weeks should not be combined with other units, but this tool also reads forms such as P1W2D.',
      'The standard puts a decimal only on the smallest unit, but this tool accepts decimals (dot or comma) on any unit.',
      'A day is treated as 24 hours (86,400 seconds). Daylight saving changes are not taken into account when converting to seconds.',
      'Letters can be upper or lower case. A leading minus sign makes the duration negative.',
    ],
    glossaryHeading: 'Glossary',
    glossaryTerms: [
      {
        term: 'ISO 8601 duration',
        description:
          'A format that starts with P, followed by years (Y), months (M), weeks (W) and days (D), then a T and hours (H), minutes (M) and seconds (S). PT1H30M means 1 hour 30 minutes, and P1Y2M3D means 1 year 2 months 3 days.',
      },
      {
        term: 'T (time designator)',
        description:
          'The letter that separates date units from time units. Because M means both month and minute, P1M is one month and PT1M is one minute.',
      },
      {
        term: 'iCalendar DURATION',
        description:
          'The duration notation used for calendar alarms (VALARM) and similar properties. A negative value such as -PT15M means 15 minutes before.',
      },
    ],
    numberLocale: 'en-US',
  },
};
