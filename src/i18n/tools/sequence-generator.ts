import type { Locale } from '../../data/tools';

export interface SequenceGeneratorPageContent {
  title: string;
  description: string;
  h1: string;
  /** set:html で描画するため、開発者管理の固定リテラルのみを入れること（ユーザー入力を混ぜない） */
  introHtml: string;
  modeLabel: string;
  modeNumber: string;
  modeDate: string;
  limitLabel: string;
  limitCount: string;
  limitEnd: string;
  startLabel: string;
  stepLabel: string;
  countLabel: string;
  endLabel: string;
  padLabel: string;
  prefixLabel: string;
  suffixLabel: string;
  startDateLabel: string;
  endDateLabel: string;
  intervalLabel: string;
  unitLabel: string;
  unitDay: string;
  unitWeek: string;
  unitMonth: string;
  formatLabel: string;
  formatHint: string;
  weekdayLabel: string;
  weekdayNone: string;
  weekdayShort: string;
  weekdayLong: string;
  /** 日曜始まりの7要素 */
  weekdaysShort: string[];
  weekdaysLong: string[];
  /** {date} と {weekday} を含む */
  weekdayTemplate: string;
  skipWeekends: string;
  separatorLabel: string;
  sepNewline: string;
  sepComma: string;
  sepSpace: string;
  sepTab: string;
  generate: string;
  resultLabel: string;
  /** {count} を置換して表示する */
  resultSummary: string;
  copy: string;
  copied: string;
  copyFailed: string;
  download: string;
  invalidStart: string;
  invalidStep: string;
  zeroStep: string;
  /** {max} を置換して表示する */
  invalidCount: string;
  invalidEnd: string;
  /** {max} を置換して表示する */
  invalidPad: string;
  /** {max} を置換して表示する */
  invalidInterval: string;
  unreachableEnd: string;
  /** {max} を置換して表示する */
  tooMany: string;
  outOfRange: string;
  notEnough: string;
  howToHeading: string;
  howToSteps: string[];
  notesHeading: string;
  notes: string[];
}

export const sequenceGeneratorContent: Record<
  Locale,
  SequenceGeneratorPageContent
> = {
  ja: {
    title: '連番・日付リスト生成ツール｜ゼロ埋め・接頭辞・曜日付きで一括作成',
    description:
      '連番（ゼロ埋め・接頭辞・接尾辞・増分指定）と日付リスト（日・週・月間隔、曜日付き、土日除外）を最大10000件まとめて作成し、コピー・ダウンロードできる無料ツールです。ファイル名リストや日程表の素材に。データはブラウザ内で処理され、サーバーには送信されません。',
    h1: '連番・日付リスト生成ツール',
    introHtml:
      'ファイル名の連番（img_001, img_002…）や、日程表・スケジュールの日付リストをまとめて作れます。ゼロ埋め・接頭辞・接尾辞・増分、日付の間隔（日・週・月）や曜日付き、土日除外に対応しています。ランダムな値が欲しいときは<a href="/tools/random-generator/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">ランダム文字列・乱数生成</a>、カレンダー形式で見たいときは<a href="/tools/calendar-generator/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">カレンダー作成</a>をご利用ください。',
    modeLabel: '種類',
    modeNumber: '数値の連番',
    modeDate: '日付リスト',
    limitLabel: '終わり方',
    limitCount: '件数で指定',
    limitEnd: '終了値・終了日で指定',
    startLabel: '開始値',
    stepLabel: '増分',
    countLabel: '件数',
    endLabel: '終了値',
    padLabel: 'ゼロ埋め桁数',
    prefixLabel: '接頭辞',
    suffixLabel: '接尾辞',
    startDateLabel: '開始日',
    endDateLabel: '終了日',
    intervalLabel: '間隔',
    unitLabel: '間隔の単位',
    unitDay: '日ごと',
    unitWeek: '週ごと',
    unitMonth: 'か月ごと',
    formatLabel: '日付の書式',
    formatHint: 'YYYY=年4桁、MM=月2桁、M=月、DD=日2桁、D=日、YY=年2桁',
    weekdayLabel: '曜日',
    weekdayNone: '付けない',
    weekdayShort: '短い（月）',
    weekdayLong: '長い（月曜日）',
    weekdaysShort: ['日', '月', '火', '水', '木', '金', '土'],
    weekdaysLong: [
      '日曜日',
      '月曜日',
      '火曜日',
      '水曜日',
      '木曜日',
      '金曜日',
      '土曜日',
    ],
    weekdayTemplate: '{date}（{weekday}）',
    skipWeekends: '土日を除く',
    separatorLabel: '区切り',
    sepNewline: '改行',
    sepComma: 'カンマ',
    sepSpace: 'スペース',
    sepTab: 'タブ',
    generate: '生成する',
    resultLabel: '生成結果',
    resultSummary: '{count}件を生成しました',
    copy: '結果をコピー',
    copied: 'コピーしました',
    copyFailed: 'コピーに失敗しました',
    download: 'テキストでダウンロード',
    invalidStart: '開始値（開始日）を正しく入力してください。',
    invalidStep: '増分は整数で入力してください。',
    zeroStep: '増分には0以外の整数を入力してください。',
    invalidCount: '件数は1〜{max}の整数で入力してください。',
    invalidEnd: '終了値（終了日）を正しく入力してください。',
    invalidPad: 'ゼロ埋め桁数は0〜{max}の整数で入力してください。',
    invalidInterval: '間隔は1〜{max}の整数で入力してください。',
    unreachableEnd:
      '開始から終了まで到達できません。終了値（終了日）と増分の向きを確認してください。',
    tooMany:
      '生成結果が{max}件を超えます。範囲を狭めるか増分・間隔を広げてください。',
    outOfRange:
      '扱える数値の範囲を超えました。開始値や増分を小さくしてください。',
    notEnough:
      '条件に合う日付が指定の件数分ありません。土日除外の設定や間隔、終了日を確認してください。',
    howToHeading: '使い方',
    howToSteps: [
      '「種類」で、数値の連番か日付リストのどちらかを選びます。',
      '開始値（開始日）と増分・間隔を入れ、「終わり方」で件数か終了値（終了日）を指定します。',
      '接頭辞・ゼロ埋め桁数、日付なら書式・曜日・「土日を除く」を必要に応じて設定し、「生成する」を押します。',
      '「結果をコピー」またはダウンロードで取り出します。「区切り」で改行やカンマ区切りに変えられます。',
    ],
    notesHeading: '注意事項',
    notes: [
      '1回に生成できるのは最大10000件です。',
      '数値の連番は整数のみ対応しています。負の数は、符号の後ろの数字をゼロ埋めします（例: -01）。',
      '月ごとの日付は、開始日の日が存在しない月では月末に寄せます（1/31の次は2/28または2/29）。',
      '日付は西暦1〜9999年のグレゴリオ暦で計算します。祝日や休業日は考慮しません（土日のみ除外できます）。',
      '日付の書式は、YYYY・YY・MM・M・DD・D の文字を置き換えます。年や/などそれ以外の文字はそのまま出力されます。',
      '入力した内容や生成結果はブラウザ内だけで処理し、サーバーには送信しません。',
    ],
  },
  en: {
    title: 'Number Sequence & Date List Generator – Padding, Weekdays',
    description:
      'Make number sequences with zero padding and prefixes, or date lists by day, week or month with weekdays. Skip weekends. Up to 10,000 items, in your browser.',
    h1: 'Number Sequence & Date List Generator',
    introHtml:
      'Create numbered file names (img_001, img_002…) or lists of dates for schedules in one go. Set zero padding, a prefix and suffix, the step, the date interval (days, weeks, months), weekday labels, and skip weekends. For random values use the <a href="/en/tools/random-generator/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">Random String & Number Generator</a>; for a calendar layout use the <a href="/en/tools/calendar-generator/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">Calendar Generator</a>.',
    modeLabel: 'Type',
    modeNumber: 'Number sequence',
    modeDate: 'Date list',
    limitLabel: 'Stop by',
    limitCount: 'Count',
    limitEnd: 'End value / end date',
    startLabel: 'Start value',
    stepLabel: 'Step',
    countLabel: 'Count',
    endLabel: 'End value',
    padLabel: 'Zero padding digits',
    prefixLabel: 'Prefix',
    suffixLabel: 'Suffix',
    startDateLabel: 'Start date',
    endDateLabel: 'End date',
    intervalLabel: 'Interval',
    unitLabel: 'Interval unit',
    unitDay: 'day(s)',
    unitWeek: 'week(s)',
    unitMonth: 'month(s)',
    formatLabel: 'Date format',
    formatHint:
      'YYYY = 4-digit year, MM = 2-digit month, M = month, DD = 2-digit day, D = day, YY = 2-digit year',
    weekdayLabel: 'Weekday',
    weekdayNone: 'None',
    weekdayShort: 'Short (Mon)',
    weekdayLong: 'Long (Monday)',
    weekdaysShort: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    weekdaysLong: [
      'Sunday',
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
    ],
    weekdayTemplate: '{date} ({weekday})',
    skipWeekends: 'Skip weekends',
    separatorLabel: 'Separator',
    sepNewline: 'New line',
    sepComma: 'Comma',
    sepSpace: 'Space',
    sepTab: 'Tab',
    generate: 'Generate',
    resultLabel: 'Result',
    resultSummary: 'Generated {count} item(s)',
    copy: 'Copy result',
    copied: 'Copied',
    copyFailed: 'Copy failed',
    download: 'Download as text',
    invalidStart: 'Enter a valid start value (start date).',
    invalidStep: 'Enter the step as a whole number.',
    zeroStep: 'Enter a non-zero whole number for the step.',
    invalidCount: 'Enter a whole number from 1 to {max} for the count.',
    invalidEnd: 'Enter a valid end value (end date).',
    invalidPad: 'Enter a whole number from 0 to {max} for the padding digits.',
    invalidInterval: 'Enter a whole number from 1 to {max} for the interval.',
    unreachableEnd:
      'The end cannot be reached from the start. Check the end value (end date) and the direction of the step.',
    tooMany:
      'The result would exceed {max} items. Narrow the range or use a larger step or interval.',
    outOfRange:
      'The numbers went beyond the supported range. Use a smaller start value or step.',
    notEnough:
      'There are not enough matching dates for the count. Check the weekend setting, the interval and the end date.',
    howToHeading: 'How to use',
    howToSteps: [
      'Choose "Number sequence" or "Date list" under "Type".',
      'Enter the start value (start date) and step or interval, then set the count or end value (end date) under "Stop by".',
      'Set the prefix and padding, or for dates the format, weekday and "Skip weekends", then press "Generate".',
      'Take the result with "Copy result" or the download button. "Separator" switches between new lines and commas.',
    ],
    notesHeading: 'Notes',
    notes: [
      'You can generate up to 10,000 items at a time.',
      'Number sequences are whole numbers only. For negative numbers the digits after the sign are zero-padded (for example -01).',
      'For monthly steps, a day that does not exist in a month moves to the last day of that month (Jan 31 is followed by Feb 28 or 29).',
      'Dates use the Gregorian calendar for years 1 to 9999. Public holidays are not considered; only weekends can be skipped.',
      'In the date format, the letters YYYY, YY, MM, M, DD and D are replaced; any other characters such as slashes are output as they are.',
      'Your settings and results are processed only in your browser and never sent to a server.',
    ],
  },
};
