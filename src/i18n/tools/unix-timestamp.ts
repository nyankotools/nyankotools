import type { Locale } from '../../data/tools';

interface GlossaryTerm {
  term: string;
  description: string;
}

interface SelectOption {
  value: string;
  label: string;
}

export interface UnixTimestampPageContent {
  title: string;
  description: string;
  h1: string;
  introHtml: string;
  nowHeading: string;
  copyButton: string;
  copied: string;
  copyFailed: string;
  timestampToDateHeading: string;
  timestampLabel: string;
  timestampPlaceholder: string;
  unitLabel: string;
  unitOptions: SelectOption[];
  errorInvalidTimestamp: string;
  errorCannotConvert: string;
  localTimeLabel: string;
  utcLabel: string;
  isoLabel: string;
  dateToTimestampHeading: string;
  datetimeLabel: string;
  useCurrentDatetime: string;
  secondsLabel: string;
  millisecondsLabel: string;
  notesHeading: string;
  notes: string[];
  glossaryHeading: string;
  glossaryTerms: GlossaryTerm[];
  numberLocale: string;
}

export const unixTimestampContent: Record<Locale, UnixTimestampPageContent> = {
  ja: {
    title: 'Unixタイムスタンプ変換（unixtime⇔日時）',
    description:
      'Unixタイムスタンプ（エポック秒・ミリ秒）と日時を相互に変換できる無料ツールです。現在時刻の取得にも対応。データはブラウザ内で処理され、サーバーには送信されません。',
    h1: 'Unixタイムスタンプ変換',
    introHtml:
      'Unixタイムスタンプ（エポック秒・ミリ秒）と日時をリアルタイムで相互変換します。秒とミリ秒は桁数から自動判定されますが、手動で切り替えることもできます。ブラウザ内で処理され、入力内容がサーバーに送信されることはありません。ログの日時整形などで文字数を確認したい場合は <a href="/tools/char-counter/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">文字数カウント</a> もあわせてご利用ください。',
    nowHeading: '現在のUnix時間',
    copyButton: 'コピー',
    copied: 'コピーしました',
    copyFailed: 'コピーに失敗しました',
    timestampToDateHeading: 'Unixタイムスタンプ → 日時',
    timestampLabel: 'タイムスタンプ',
    timestampPlaceholder: '1700000000',
    unitLabel: '単位',
    unitOptions: [
      { value: 'auto', label: '自動判定' },
      { value: 'seconds', label: '秒' },
      { value: 'milliseconds', label: 'ミリ秒' },
    ],
    errorInvalidTimestamp:
      '整数のタイムスタンプを入力してください（例: 1700000000）',
    errorCannotConvert: '日時に変換できませんでした',
    localTimeLabel: 'ローカル時刻',
    utcLabel: 'UTC',
    isoLabel: 'ISO 8601',
    dateToTimestampHeading: '日時 → Unixタイムスタンプ',
    datetimeLabel: '日時（ローカル時刻）',
    useCurrentDatetime: '現在日時を使う',
    secondsLabel: '秒',
    millisecondsLabel: 'ミリ秒',
    notesHeading: '注意事項',
    notes: [
      '「単位」を「自動判定」にすると、10桁以下は秒、11桁以上はミリ秒として扱います。マイクロ秒・ナノ秒単位のタイムスタンプには対応していません。',
      '「日時 → Unixタイムスタンプ」の入力欄は、お使いの端末のタイムゾーン（ローカル時刻）として扱われます。',
      '1970年より前の日時は負のタイムスタンプとして扱われます。',
    ],
    glossaryHeading: '用語解説',
    glossaryTerms: [
      {
        term: 'Unixタイムスタンプ（Unix時間・エポック秒）',
        description:
          '協定世界時（UTC）の1970年1月1日 00:00:00 からの経過秒数で日時を表す形式です。タイムゾーンに依存しないため、システム間で日時をやり取りする際によく使われます。',
      },
      {
        term: 'ミリ秒タイムスタンプ',
        description:
          'Unixタイムスタンプを1000倍し、ミリ秒単位で表したものです。JavaScriptの`Date.now()`やログのタイムスタンプなどでよく見られます。13桁前後の数値になります。',
      },
      {
        term: 'UTC（協定世界時）',
        description:
          '世界共通の時刻基準です。日本時間（JST）はUTCより9時間進んでいます（UTC+9）。',
      },
    ],
    numberLocale: 'ja-JP',
  },
  en: {
    title: 'Unix Timestamp Converter',
    description:
      'A free tool to convert between a Unix timestamp (epoch seconds or milliseconds) and a date/time. Also shows the current timestamp. Your data is processed in the browser and never sent to a server.',
    h1: 'Unix Timestamp Converter',
    introHtml:
      'Converts a Unix timestamp (epoch seconds or milliseconds) to a date/time and back, in real time. The unit is auto-detected from the number of digits, but you can also switch it manually. Everything happens in your browser, and nothing you type is ever sent to a server. Need to check the length of a formatted log line? Check out the <a href="/en/tools/char-counter/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">Character Counter</a> as well.',
    nowHeading: 'Current Unix time',
    copyButton: 'Copy',
    copied: 'Copied',
    copyFailed: 'Copy failed',
    timestampToDateHeading: 'Timestamp → Date/time',
    timestampLabel: 'Timestamp',
    timestampPlaceholder: '1700000000',
    unitLabel: 'Unit',
    unitOptions: [
      { value: 'auto', label: 'Auto-detect' },
      { value: 'seconds', label: 'Seconds' },
      { value: 'milliseconds', label: 'Milliseconds' },
    ],
    errorInvalidTimestamp:
      'Please enter an integer timestamp (e.g. 1700000000)',
    errorCannotConvert: 'Could not convert to a date/time',
    localTimeLabel: 'Local time',
    utcLabel: 'UTC',
    isoLabel: 'ISO 8601',
    dateToTimestampHeading: 'Date/time → Timestamp',
    datetimeLabel: 'Date/time (local)',
    useCurrentDatetime: 'Use current date/time',
    secondsLabel: 'Seconds',
    millisecondsLabel: 'Milliseconds',
    notesHeading: 'Notes',
    notes: [
      'With "Auto-detect", values of 10 digits or fewer are treated as seconds and 11 digits or more as milliseconds. Microsecond and nanosecond timestamps are not supported.',
      'The "Date/time → Timestamp" field is interpreted in your device\'s local timezone.',
      'Dates before 1970 result in a negative timestamp.',
    ],
    glossaryHeading: 'Glossary',
    glossaryTerms: [
      {
        term: 'Unix timestamp (Unix time / epoch seconds)',
        description:
          'A way of representing a point in time as the number of seconds elapsed since 00:00:00 UTC on January 1, 1970. Because it does not depend on a timezone, it is commonly used to exchange dates and times between systems.',
      },
      {
        term: 'Millisecond timestamp',
        description:
          "A Unix timestamp multiplied by 1000 and expressed in milliseconds. Commonly seen in JavaScript's Date.now() and in log timestamps, typically around 13 digits long.",
      },
      {
        term: 'UTC (Coordinated Universal Time)',
        description:
          'The global time standard. Local timezones are expressed as an offset from UTC, such as UTC+9 for Japan Standard Time.',
      },
    ],
    numberLocale: 'en-US',
  },
};
