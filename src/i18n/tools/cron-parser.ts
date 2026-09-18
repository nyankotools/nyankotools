import type { Locale } from '../../data/tools';

interface GlossaryTerm {
  term: string;
  description: string;
}

interface PresetButton {
  value: string;
  label: string;
}

interface SelectOption {
  value: string;
  label: string;
}

interface SyntaxRow {
  position: string;
  field: string;
  allowed: string;
}

export interface CronParserPageContent {
  title: string;
  description: string;
  h1: string;
  introHtml: string;
  cronInputLabel: string;
  presetButtons: PresetButton[];
  errorMessages: Record<string, string>;
  errorFallback: string;
  fieldMinuteLabel: string;
  fieldHourLabel: string;
  fieldDomLabel: string;
  fieldMonthLabel: string;
  fieldDowLabel: string;
  baseDatetimeLabel: string;
  useCurrentTimeButton: string;
  countLabel: string;
  countOptions: SelectOption[];
  upcomingHeading: string;
  copyListButton: string;
  copied: string;
  copyFailed: string;
  noMatchingRun: string;
  syntaxHeading: string;
  syntaxColumnPosition: string;
  syntaxColumnField: string;
  syntaxColumnAllowed: string;
  syntaxRows: SyntaxRow[];
  bulletStarHtml: string;
  bulletCommaHtml: string;
  bulletDashHtml: string;
  bulletSlashHtml: string;
  notesHeading: string;
  note1Html: string;
  note2: string;
  note3: string;
  glossaryHeading: string;
  glossaryTerms: GlossaryTerm[];
}

export const cronParserContent: Record<Locale, CronParserPageContent> = {
  ja: {
    title: 'Cron式シミュレーター（次回実行日時・意味を確認）',
    description:
      'cron式を入力すると、意味を日本語で解説し、次回の実行予定日時を一覧表示します。GitHub ActionsやKubernetes CronJob、crontabの動作確認に。データはブラウザ内で処理され、サーバーには送信されません。',
    h1: 'Cron式スケジュールシミュレーター',
    introHtml:
      'cron式（例: <code class="rounded bg-gray-100 px-1 py-0.5 dark:bg-gray-800">*/15 9-18 * * 1-5</code>）を入力すると、意味を日本語の文章で解説し、次回の実行予定日時を一覧表示します。crontabの設定確認やGitHub Actions・Kubernetes CronJobのスケジュール検証などに便利です。ブラウザ内で処理され、入力内容がサーバーに送信されることはありません。日時の変換が必要な場合は <a href="/tools/unix-timestamp/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">Unixタイムスタンプ変換</a> もあわせてご利用ください。',
    cronInputLabel: 'cron式（分 時 日 月 曜日）',
    presetButtons: [
      { value: '* * * * *', label: '毎分' },
      { value: '0 * * * *', label: '毎時0分' },
      { value: '0 3 * * *', label: '毎日3時' },
      { value: '*/30 9-18 * * 1-5', label: '平日9-18時30分ごと' },
      { value: '0 9 * * 1', label: '毎週月曜9時' },
      { value: '0 0 1 * *', label: '毎月1日0時' },
    ],
    errorMessages: {
      empty: 'cron式を入力してください',
      'field-count':
        'フィールド数が正しくありません。「分 時 日 月 曜日」の5個をスペースで区切って入力してください',
      minute: '分のフィールドが不正です（0〜59の範囲で指定してください）',
      hour: '時のフィールドが不正です（0〜23の範囲で指定してください）',
      dayOfMonth: '日のフィールドが不正です（1〜31の範囲で指定してください）',
      month: '月のフィールドが不正です（1〜12の範囲で指定してください）',
      dayOfWeek: '曜日のフィールドが不正です（0〜7の範囲で指定してください）',
    },
    errorFallback: 'cron式を解析できませんでした',
    fieldMinuteLabel: '分',
    fieldHourLabel: '時',
    fieldDomLabel: '日',
    fieldMonthLabel: '月',
    fieldDowLabel: '曜日',
    baseDatetimeLabel: '基準日時（省略時は現在時刻）',
    useCurrentTimeButton: '現在時刻を使う',
    countLabel: '表示件数',
    countOptions: [
      { value: '5', label: '5件' },
      { value: '10', label: '10件' },
      { value: '20', label: '20件' },
    ],
    upcomingHeading: '次回実行予定',
    copyListButton: '一覧をコピー',
    copied: 'コピーしました',
    copyFailed: 'コピーに失敗しました',
    noMatchingRun: '条件に一致する実行日時が見つかりませんでした',
    syntaxHeading: 'cron式の書き方',
    syntaxColumnPosition: '位置',
    syntaxColumnField: '意味',
    syntaxColumnAllowed: '指定できる値',
    syntaxRows: [
      { position: '1番目', field: '分', allowed: '0〜59' },
      { position: '2番目', field: '時', allowed: '0〜23' },
      { position: '3番目', field: '日（日付）', allowed: '1〜31' },
      { position: '4番目', field: '月', allowed: '1〜12' },
      { position: '5番目', field: '曜日', allowed: '0〜7（0と7は日曜）' },
    ],
    bulletStarHtml:
      '<code class="rounded bg-gray-100 px-1 dark:bg-gray-800">*</code> はすべての値（毎分・毎時など）',
    bulletCommaHtml:
      '<code class="rounded bg-gray-100 px-1 dark:bg-gray-800">,</code> で複数の値を列挙（例: <code class="rounded bg-gray-100 px-1 dark:bg-gray-800">1,15,30</code>）',
    bulletDashHtml:
      '<code class="rounded bg-gray-100 px-1 dark:bg-gray-800">-</code> で範囲を指定（例: <code class="rounded bg-gray-100 px-1 dark:bg-gray-800">9-18</code>）',
    bulletSlashHtml:
      '<code class="rounded bg-gray-100 px-1 dark:bg-gray-800">/</code> で間隔（ステップ）を指定（例: <code class="rounded bg-gray-100 px-1 dark:bg-gray-800">*/15</code> は15分ごと）',
    notesHeading: '注意事項',
    note1Html:
      '標準的な5フィールド形式（分 時 日 月 曜日）と、<code class="rounded bg-gray-100 px-1 dark:bg-gray-800">@daily</code>などの主要なエイリアスに対応しています。秒フィールドを含む6フィールド形式や、Quartz系の<code class="rounded bg-gray-100 px-1 dark:bg-gray-800">L</code>・<code class="rounded bg-gray-100 px-1 dark:bg-gray-800">W</code>・<code class="rounded bg-gray-100 px-1 dark:bg-gray-800">#</code>、曜日・月の英語表記（mon, janなど）には対応していません。',
    note2:
      '次回実行予定は、お使いの端末のタイムゾーン（ローカル時刻）を基準に計算されます。',
    note3:
      '2月30日のような実在しない日付を指定した場合など、条件に一致する日時が見つからない場合は一覧が空になることがあります。',
    glossaryHeading: '用語解説',
    glossaryTerms: [
      {
        term: 'cron式',
        description:
          'Linux/UnixのジョブスケジューラcronやGitHub Actions・Kubernetes CronJobなどで使われる、実行タイミングを表す書式です。「分 時 日 月 曜日」の5つのフィールドをスペースで区切って指定します。',
      },
      {
        term: 'エイリアス（@daily等）',
        description:
          '`@yearly`（毎年1/1 0時）・`@monthly`（毎月1日0時）・`@weekly`（毎週日曜0時）・`@daily`（毎日0時）・`@hourly`（毎時0分）のような、よく使うcron式を短く書ける特殊記法です。',
      },
      {
        term: '曜日フィールドの0〜7',
        description:
          '曜日は0が日曜、1が月曜、…6が土曜を表します。7も日曜として扱われる実装が多く、このツールでも0と同じ扱いにしています。',
      },
      {
        term: 'AND/OR判定（日・曜日フィールド）',
        description:
          '「日」と「曜日」の両方に*以外の値を指定した場合、cronの仕様上はどちらか一方が一致すればマッチするOR判定になります（AND判定ではありません）。片方だけ指定した場合はその条件のみで判定します。',
      },
    ],
  },
  en: {
    title: 'Cron Expression Simulator (Next Run Time & Meaning)',
    description:
      'Enter a cron expression to get a plain-English explanation and a list of upcoming run times. Useful for checking crontab, GitHub Actions, and Kubernetes CronJob schedules. Your data is processed in the browser and never sent to a server.',
    h1: 'Cron Expression Simulator',
    introHtml:
      'Enter a cron expression (e.g. <code class="rounded bg-gray-100 px-1 py-0.5 dark:bg-gray-800">*/15 9-18 * * 1-5</code>) to get a plain-English explanation and a list of upcoming run times. Handy for checking a crontab entry or validating a GitHub Actions or Kubernetes CronJob schedule. Everything happens in your browser, and nothing you type is ever sent to a server. Need to convert a date/time as well? Check out the <a href="/en/tools/unix-timestamp/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">Unix Timestamp Converter</a> too.',
    cronInputLabel: 'Cron expression (minute hour day month weekday)',
    presetButtons: [
      { value: '* * * * *', label: 'Every minute' },
      { value: '0 * * * *', label: 'Every hour' },
      { value: '0 3 * * *', label: 'Daily at 3 AM' },
      { value: '*/30 9-18 * * 1-5', label: 'Every 30 min, 9-18, weekdays' },
      { value: '0 9 * * 1', label: 'Mondays at 9 AM' },
      { value: '0 0 1 * *', label: '1st of the month' },
    ],
    errorMessages: {
      empty: 'Please enter a cron expression',
      'field-count':
        'Wrong number of fields. Please enter 5 space-separated fields: minute hour day month weekday',
      minute: 'The minute field is invalid (must be 0-59)',
      hour: 'The hour field is invalid (must be 0-23)',
      dayOfMonth: 'The day-of-month field is invalid (must be 1-31)',
      month: 'The month field is invalid (must be 1-12)',
      dayOfWeek: 'The day-of-week field is invalid (must be 0-7)',
    },
    errorFallback: 'Could not parse this cron expression',
    fieldMinuteLabel: 'Minute',
    fieldHourLabel: 'Hour',
    fieldDomLabel: 'Day',
    fieldMonthLabel: 'Month',
    fieldDowLabel: 'Weekday',
    baseDatetimeLabel: 'Start date/time (defaults to now)',
    useCurrentTimeButton: 'Use current time',
    countLabel: 'Results',
    countOptions: [
      { value: '5', label: '5' },
      { value: '10', label: '10' },
      { value: '20', label: '20' },
    ],
    upcomingHeading: 'Upcoming run times',
    copyListButton: 'Copy list',
    copied: 'Copied',
    copyFailed: 'Copy failed',
    noMatchingRun: 'No matching run time was found',
    syntaxHeading: 'Cron syntax reference',
    syntaxColumnPosition: 'Position',
    syntaxColumnField: 'Field',
    syntaxColumnAllowed: 'Allowed values',
    syntaxRows: [
      { position: '1st', field: 'Minute', allowed: '0-59' },
      { position: '2nd', field: 'Hour', allowed: '0-23' },
      { position: '3rd', field: 'Day of month', allowed: '1-31' },
      { position: '4th', field: 'Month', allowed: '1-12' },
      {
        position: '5th',
        field: 'Day of week',
        allowed: '0-7 (0 and 7 are Sunday)',
      },
    ],
    bulletStarHtml:
      '<code class="rounded bg-gray-100 px-1 dark:bg-gray-800">*</code> means every value (every minute, every hour, ...)',
    bulletCommaHtml:
      '<code class="rounded bg-gray-100 px-1 dark:bg-gray-800">,</code> lists multiple values (e.g. <code class="rounded bg-gray-100 px-1 dark:bg-gray-800">1,15,30</code>)',
    bulletDashHtml:
      '<code class="rounded bg-gray-100 px-1 dark:bg-gray-800">-</code> specifies a range (e.g. <code class="rounded bg-gray-100 px-1 dark:bg-gray-800">9-18</code>)',
    bulletSlashHtml:
      '<code class="rounded bg-gray-100 px-1 dark:bg-gray-800">/</code> specifies a step (e.g. <code class="rounded bg-gray-100 px-1 dark:bg-gray-800">*/15</code> means every 15 units)',
    notesHeading: 'Notes',
    note1Html:
      'Supports the standard 5-field format (minute hour day month weekday) and common aliases like <code class="rounded bg-gray-100 px-1 dark:bg-gray-800">@daily</code>. It does not support a 6-field seconds format, Quartz-style <code class="rounded bg-gray-100 px-1 dark:bg-gray-800">L</code>, <code class="rounded bg-gray-100 px-1 dark:bg-gray-800">W</code>, or <code class="rounded bg-gray-100 px-1 dark:bg-gray-800">#</code>, or named months/weekdays (mon, jan, etc.).',
    note2:
      "Upcoming run times are calculated using your device's local timezone.",
    note3:
      'If the expression describes a date that never occurs (such as February 30th), the list of upcoming runs may come back empty.',
    glossaryHeading: 'Glossary',
    glossaryTerms: [
      {
        term: 'Cron expression',
        description:
          'A format for describing a recurring schedule, used by Unix/Linux cron, GitHub Actions, Kubernetes CronJob, and more. It has five space-separated fields: minute, hour, day of month, month, and day of week.',
      },
      {
        term: 'Aliases (@daily, etc.)',
        description:
          'Shorthand for common schedules: @yearly (Jan 1st at midnight), @monthly (1st of the month at midnight), @weekly (Sunday at midnight), @daily (every day at midnight), and @hourly (every hour on the hour).',
      },
      {
        term: 'Day-of-week values 0-7',
        description:
          '0 is Sunday, 1 is Monday, ... 6 is Saturday. Many implementations also accept 7 as Sunday, and this tool treats 7 the same as 0.',
      },
      {
        term: 'AND/OR logic for day-of-month and day-of-week',
        description:
          "When both the day-of-month and day-of-week fields are restricted (not *), cron matches a date if EITHER field matches (an OR condition, not AND). If only one is restricted, only that field's condition applies.",
      },
    ],
  },
};
