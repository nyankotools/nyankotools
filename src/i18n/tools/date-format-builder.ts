import type { Locale } from '../../data/tools';
import type { FormatId, TokenId } from '../../lib/tools/date-format-builder';

interface GlossaryTerm {
  term: string;
  description: string;
}

export interface DateFormatBuilderPageContent {
  title: string;
  description: string;
  h1: string;
  introHtml: string;

  sampleHeading: string;
  sampleLabel: string;
  samplePlaceholder: string;
  sampleDefault: string;
  sampleHint: string;
  noDetect: string;
  ambiguousNote: string;

  convertHeading: string;
  sourceFormatLabel: string;
  formatLabel: string;
  formatPlaceholder: string;
  formatDefault: string;
  previewLabel: string;

  resultsHeading: string;
  /** 書式ごとの表示名 */
  formats: Record<FormatId, string>;
  /** 項目（トークン）の名前。警告文で使う */
  tokenNames: Record<TokenId, string>;
  /** {format} {items} を置き換える */
  warningUnsupported: string;
  warningDropped: string;

  copyButton: string;
  copied: string;
  copyFailed: string;

  howToHeading: string;
  howToSteps: string[];
  notesHeading: string;
  notes: string[];
  glossaryHeading: string;
  glossaryTerms: GlossaryTerm[];
}

export const dateFormatBuilderContent: Record<
  Locale,
  DateFormatBuilderPageContent
> = {
  ja: {
    title: '日付フォーマット文字列ビルダー（strftime・Java・PHP・.NET）',
    description:
      '例文から strftime・Java・PHP・Day.js/Moment.js・.NET の日付書式文字列を生成し、相互変換します。yyyy-MM-dd と %Y-%m-%d の対応も一目で確認。ブラウザ内で処理され、サーバーには送信されません。',
    h1: '日付フォーマット文字列ビルダー',
    introHtml:
      '「2026-10-19 15:04:05」のような例文を入力するだけで、strftime（C・Python・Ruby）、Java の DateTimeFormatter、PHP の date()、Day.js / Moment.js、.NET の ToString に対応した書式文字列をまとめて作ります。すでにある書式文字列を別の言語向けに変換することもできます。タイムスタンプと日時の変換は <a href="/tools/unix-timestamp/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">Unixタイムスタンプ変換</a>、日数の計算は <a href="/tools/date-calculator/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">日付計算</a> をご利用ください。',

    sampleHeading: '例文から書式を作る',
    sampleLabel: '例文（日付・時刻の見本）',
    samplePlaceholder: '例: 2026-10-19 15:04:05',
    sampleDefault: '2026-10-19 15:04:05',
    sampleHint:
      '年月日や時刻を含む文字列を入力すると、数字や月名・曜日名・AM/PM を判別して書式にします。英語の月名・曜日名に対応しています。',
    noDetect: '日付や時刻の項目を見つけられませんでした。',
    ambiguousNote:
      '日と月の並びは推測です（スラッシュ区切りは 月/日/年、ドット区切りは 日.月.年 として扱っています）。違う場合は下の「書式文字列」欄で調整してください。',

    convertHeading: '書式文字列を変換する',
    sourceFormatLabel: '元の書式の種類',
    formatLabel: '書式文字列',
    formatPlaceholder: '例: yyyy-MM-dd HH:mm:ss',
    formatDefault: 'yyyy-MM-dd HH:mm:ss',
    previewLabel: 'プレビュー（現在の日時）',

    resultsHeading: '各言語の書式文字列',
    formats: {
      strftime: 'strftime（C・Python・Ruby）',
      java: 'Java（DateTimeFormatter）',
      php: 'PHP（date）',
      moment: 'JavaScript（Day.js・Moment.js）',
      dotnet: '.NET（ToString）',
    },
    tokenNames: {
      year4: '4桁の年',
      year2: '2桁の年',
      month2: '月（2桁）',
      month1: '月（0埋めなし）',
      monthLong: '月名（英語・フル）',
      monthShort: '月名（英語・短縮）',
      day2: '日（2桁）',
      day1: '日（0埋めなし）',
      weekdayLong: '曜日（英語・フル）',
      weekdayShort: '曜日（英語・短縮）',
      hour24_2: '時（24時間・2桁）',
      hour24_1: '時（24時間・0埋めなし）',
      hour12_2: '時（12時間・2桁）',
      hour12_1: '時（12時間・0埋めなし）',
      minute2: '分',
      second2: '秒',
      millis3: 'ミリ秒（3桁）',
      ampm: 'AM/PM',
      tzOffset: 'UTCとの差（+0900）',
      tzOffsetColon: 'UTCとの差（+09:00）',
      dayOfYear3: '年間通算日',
    },
    warningUnsupported:
      '{format}: 対応する指定がないため省略しました（{items}）',
    warningDropped: '解釈できない指定を省略しました（{items}）',

    copyButton: 'コピー',
    copied: 'コピーしました',
    copyFailed: 'コピーに失敗しました',

    howToHeading: '使い方',
    howToSteps: [
      '「例文」欄に、日付の見本（2026-10-19 15:04:05 など）を入力します。',
      '各言語の書式文字列が表示されるので、使いたいものの「コピー」を押します。',
      'すでにある書式文字列を変換するときは、「元の書式の種類」を選んで「書式文字列」欄に入力します。',
    ],
    notesHeading: '注意事項',
    notes: [
      '例文からの判別は推測です。月と日の順序が曖昧な日付（03/04/2026 など）は、スラッシュ区切りなら 月/日、ドット区切りなら 日.月 として扱います。',
      'strftime の %-d・%-m（ゼロ埋めなし）は Linux / macOS / Ruby の拡張で、Windows の C ランタイムでは %#d のように書きます。ミリ秒の %L は Ruby の指定で、Python の %f はマイクロ秒（6桁）です。',
      'その書式に対応する指定がない項目（PHP の年間通算日、.NET の +0900 形式など）は省略し、その旨を表示します。',
      '.NET の / と : は実行時の地域設定に応じた区切り文字に置き換わります。固定したいときは \\/ や \\: のようにエスケープしてください。',
      '月名・曜日名は英語表記で扱います。日本語の曜日（月曜日など）は書式の対象外です。',
    ],
    glossaryHeading: '用語解説',
    glossaryTerms: [
      {
        term: 'strftime',
        description:
          'C 言語由来の日時書式です。%Y や %m のように % とアルファベットで表し、Python の strftime、Ruby、シェルの date コマンドなど多くの環境で共通です。',
      },
      {
        term: 'DateTimeFormatter（Java）',
        description:
          'Java 8 以降の日時書式です。yyyy・MM・dd のように文字の繰り返しで桁数を表し、MM は月、mm は分のように大文字と小文字で意味が変わります。',
      },
      {
        term: '大文字と小文字の違い',
        description:
          'Java や .NET では MM が月、mm が分、HH が24時間制の時、hh が12時間制の時です。取り違えると日時が崩れるため、変換時は特に注意が必要です。',
      },
      {
        term: 'ISO 8601',
        description:
          '2026-10-19T15:04:05+09:00 のような日時の国際標準の表記です。年月日、時刻、UTC との差を固定の並びで表します。',
      },
    ],
  },
  en: {
    title: 'Date Format String Builder (strftime, Java, PHP, .NET)',
    description:
      'Build date format strings for strftime, Java, PHP, Day.js/Moment.js and .NET from a sample date, and convert between them. Runs in your browser.',
    h1: 'Date Format String Builder',
    introHtml:
      'Type a sample such as "2026-10-19 15:04:05" and get matching format strings for strftime (C, Python, Ruby), Java DateTimeFormatter, PHP date(), Day.js / Moment.js, and .NET ToString at once. You can also translate an existing format string into the other syntaxes. To convert between epoch time and dates, use the <a href="/en/tools/unix-timestamp/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">Unix Timestamp Converter</a>; for counting days, try the <a href="/en/tools/date-calculator/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">Date Calculator</a>.',

    sampleHeading: 'Build a format from a sample',
    sampleLabel: 'Sample date and time',
    samplePlaceholder: 'e.g. 2026-10-19 15:04:05',
    sampleDefault: '2026-10-19 15:04:05',
    sampleHint:
      'Enter any text containing a date or time. Digits, English month and weekday names, and AM/PM are recognized and turned into a format.',
    noDetect: 'No date or time parts were found in the sample.',
    ambiguousNote:
      'The day/month order is a guess: slashes are read as month/day/year and dots as day.month.year. If that is wrong, adjust it in the "Format string" field below.',

    convertHeading: 'Convert a format string',
    sourceFormatLabel: 'Source format type',
    formatLabel: 'Format string',
    formatPlaceholder: 'e.g. yyyy-MM-dd HH:mm:ss',
    formatDefault: 'yyyy-MM-dd HH:mm:ss',
    previewLabel: 'Preview (current date and time)',

    resultsHeading: 'Format strings by language',
    formats: {
      strftime: 'strftime (C, Python, Ruby)',
      java: 'Java (DateTimeFormatter)',
      php: 'PHP (date)',
      moment: 'JavaScript (Day.js, Moment.js)',
      dotnet: '.NET (ToString)',
    },
    tokenNames: {
      year4: '4-digit year',
      year2: '2-digit year',
      month2: 'month (2 digits)',
      month1: 'month (no padding)',
      monthLong: 'month name (full)',
      monthShort: 'month name (short)',
      day2: 'day (2 digits)',
      day1: 'day (no padding)',
      weekdayLong: 'weekday (full)',
      weekdayShort: 'weekday (short)',
      hour24_2: 'hour (24-hour, 2 digits)',
      hour24_1: 'hour (24-hour, no padding)',
      hour12_2: 'hour (12-hour, 2 digits)',
      hour12_1: 'hour (12-hour, no padding)',
      minute2: 'minute',
      second2: 'second',
      millis3: 'milliseconds (3 digits)',
      ampm: 'AM/PM',
      tzOffset: 'UTC offset (+0900)',
      tzOffsetColon: 'UTC offset (+09:00)',
      dayOfYear3: 'day of year',
    },
    warningUnsupported: '{format}: no equivalent, so it was left out ({items})',
    warningDropped: 'Unrecognized specifiers were left out ({items})',

    copyButton: 'Copy',
    copied: 'Copied',
    copyFailed: 'Copy failed',

    howToHeading: 'How to use',
    howToSteps: [
      'Type a sample date such as 2026-10-19 15:04:05 into "Sample date and time".',
      'Format strings for each language appear; press "Copy" next to the one you need.',
      'To translate an existing format string, pick "Source format type" and enter it in "Format string".',
    ],
    notesHeading: 'Notes',
    notes: [
      'Detection from a sample is a best guess. For an ambiguous date such as 03/04/2026, slashes are read as month/day and dots as day.month.',
      "strftime %-d and %-m (no padding) are Linux, macOS and Ruby extensions; the Windows C runtime writes %#d instead. %L for milliseconds is Ruby, while Python's %f means microseconds (6 digits).",
      'Items a syntax has no specifier for (the day of year in PHP, the +0900 style in .NET, and so on) are left out, and a message says so.',
      "In .NET, / and : are replaced by the culture's date and time separators at runtime. Escape them as \\/ and \\: to keep them fixed.",
      'Month and weekday names are English only. Localized names are not part of the format string.',
    ],
    glossaryHeading: 'Glossary',
    glossaryTerms: [
      {
        term: 'strftime',
        description:
          'A date and time format that originated in C. It writes specifiers as a percent sign plus a letter, such as %Y or %m, and is shared by Python, Ruby, the shell date command, and many other environments.',
      },
      {
        term: 'DateTimeFormatter (Java)',
        description:
          'The Java 8+ date and time formatter. Repeated letters set the width (yyyy, MM, dd), and case matters: MM is the month while mm is the minute.',
      },
      {
        term: 'Case sensitivity',
        description:
          'In Java and .NET, MM is the month, mm the minute, HH the 24-hour hour, and hh the 12-hour hour. Mixing them up produces garbled dates, so check these first when converting.',
      },
      {
        term: 'ISO 8601',
        description:
          'The international notation for dates and times, such as 2026-10-19T15:04:05+09:00. It writes the date, the time, and the UTC offset in a fixed order.',
      },
    ],
  },
};
