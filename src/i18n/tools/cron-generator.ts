import type { Locale } from '../../data/tools';

interface GlossaryTerm {
  term: string;
  description: string;
}

interface SelectOption {
  value: string;
  label: string;
}

export interface CronGeneratorPageContent {
  title: string;
  description: string;
  h1: string;
  introHtml: string;
  fieldLabels: Record<
    'minute' | 'hour' | 'dayOfMonth' | 'month' | 'dayOfWeek',
    string
  >;
  modeLabel: string;
  modeOptions: SelectOption[];
  labelValue: string;
  labelFrom: string;
  labelTo: string;
  labelStep: string;
  labelList: string;
  listPlaceholder: string;
  errorMessages: Record<
    | 'not-a-number'
    | 'out-of-range'
    | 'range-order'
    | 'step-zero'
    | 'empty-list',
    string
  >;
  resultLabel: string;
  copyButton: string;
  copied: string;
  copyFailed: string;
  quartzLabel: string;
  quartzUnavailable: string;
  parserLinkHtml: string;
  notesHeading: string;
  notes: string[];
  glossaryHeading: string;
  glossaryTerms: GlossaryTerm[];
}

export const cronGeneratorContent: Record<Locale, CronGeneratorPageContent> = {
  ja: {
    title: 'Cron式ジェネレーター（GUIで作成・*/5・範囲・列挙）',
    description:
      '分・時・日・月・曜日をGUIで選ぶだけでcron式を作成。*/5の間隔・範囲・列挙に対応し、Quartz形式も表示。データはブラウザ内で処理され、サーバーには送信されません。',
    h1: 'Cron式ジェネレーター',
    introHtml:
      '分・時・日・月・曜日をそれぞれ選ぶだけで、crontabやGitHub Actions、Kubernetes CronJobで使えるcron式を作成します。「毎時」「5分ごと」「9〜18時」「1,15日」のような指定に対応し、Quartz（Spring）形式への変換結果も表示します。入力内容はブラウザ内で処理され、サーバーには送信されません。作った式の次回実行日時を確認するには <a href="/tools/cron-parser/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">Cron式シミュレーター</a> をご利用ください。',
    fieldLabels: {
      minute: '分（0〜59）',
      hour: '時（0〜23）',
      dayOfMonth: '日（1〜31）',
      month: '月（1〜12）',
      dayOfWeek: '曜日（0〜7、0と7は日曜）',
    },
    modeLabel: '指定方法',
    modeOptions: [
      { value: 'every', label: '毎回（*）' },
      { value: 'single', label: '特定の値' },
      { value: 'list', label: '複数の値（列挙）' },
      { value: 'range', label: '範囲' },
      { value: 'step', label: '間隔（*/N）' },
    ],
    labelValue: '値',
    labelFrom: '開始',
    labelTo: '終了',
    labelStep: '間隔（N ごと）',
    labelList: '値（カンマ区切り）',
    listPlaceholder: '例: 1,15,30',
    errorMessages: {
      'not-a-number': '半角の整数を入力してください',
      'out-of-range': '指定できる範囲外の値です',
      'range-order': '開始は終了以下の値にしてください',
      'step-zero': '間隔は1以上にしてください',
      'empty-list': '値を1つ以上入力してください',
    },
    resultLabel: '生成されたcron式',
    copyButton: 'コピー',
    copied: 'コピーしました',
    copyFailed: 'コピーに失敗しました',
    quartzLabel: 'Quartz形式（秒フィールド付き）',
    quartzUnavailable:
      '日と曜日の両方を指定しているため、Quartz形式には変換できません（どちらかを「毎回」にしてください）。',
    parserLinkHtml:
      '作成した式の次回実行日時は <a href="/tools/cron-parser/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">Cron式シミュレーター</a> で確認できます。',
    notesHeading: '注意事項',
    notes: [
      '生成する式は標準的な5フィールド形式（分 時 日 月 曜日）です。Linuxのcrontab、GitHub Actions、Kubernetes CronJobなどで使えます。',
      'Quartz（Spring @Scheduled など）は先頭に秒フィールドがあり、曜日は1〜7（1が日曜）で、日と曜日のどちらかを ? にする必要があります。Quartz形式の欄は、この規則に沿って自動変換した参考値です。',
      '日と曜日の両方に値を指定すると、標準cronでは「どちらかに一致すれば実行」になります。意図しない日に実行されないよう注意してください。',
      'GitHub ActionsのスケジュールはUTC基準です。日本時間（JST）から9時間引いた時刻で指定してください。',
    ],
    glossaryHeading: '用語解説',
    glossaryTerms: [
      {
        term: 'cron式',
        description:
          'ジョブの実行タイミングを表す書式です。「分 時 日 月 曜日」の5つをスペースで区切って指定します。',
      },
      {
        term: 'ステップ（*/N）',
        description:
          '「N ごと」を表す指定です。分に */15 と書くと0・15・30・45分に実行されます。',
      },
      {
        term: 'Quartz',
        description:
          'Javaのジョブスケジューラです。秒を含む6〜7フィールドで、曜日の番号や ? の扱いが標準cronと異なります。',
      },
    ],
  },
  en: {
    title: 'Cron Expression Generator (Build Cron Schedules Visually)',
    description:
      'Build a cron expression by picking minute, hour, day, month and weekday: steps like */5, ranges and lists, plus Quartz output. Runs in your browser.',
    h1: 'Cron Expression Generator',
    introHtml:
      'Pick the minute, hour, day, month and weekday, and get a cron expression ready for crontab, GitHub Actions or a Kubernetes CronJob. It handles steps like every 5 minutes, ranges like 9 to 18, and lists like the 1st and 15th, and it also shows a Quartz (Spring) version. Everything runs in your browser and nothing is sent to a server. To see when your expression will actually fire, open the <a href="/en/tools/cron-parser/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">Cron Expression Simulator</a>.',
    fieldLabels: {
      minute: 'Minute (0-59)',
      hour: 'Hour (0-23)',
      dayOfMonth: 'Day of month (1-31)',
      month: 'Month (1-12)',
      dayOfWeek: 'Day of week (0-7, 0 and 7 are Sunday)',
    },
    modeLabel: 'Mode',
    modeOptions: [
      { value: 'every', label: 'Every (*)' },
      { value: 'single', label: 'Specific value' },
      { value: 'list', label: 'List of values' },
      { value: 'range', label: 'Range' },
      { value: 'step', label: 'Interval (*/N)' },
    ],
    labelValue: 'Value',
    labelFrom: 'From',
    labelTo: 'To',
    labelStep: 'Every N',
    labelList: 'Values (comma separated)',
    listPlaceholder: 'e.g. 1,15,30',
    errorMessages: {
      'not-a-number': 'Enter a whole number',
      'out-of-range': 'This value is outside the allowed range',
      'range-order': 'From must be less than or equal to To',
      'step-zero': 'The interval must be at least 1',
      'empty-list': 'Enter at least one value',
    },
    resultLabel: 'Generated cron expression',
    copyButton: 'Copy',
    copied: 'Copied',
    copyFailed: 'Copy failed',
    quartzLabel: 'Quartz format (with seconds)',
    quartzUnavailable:
      'Quartz cannot express a schedule that restricts both day of month and day of week. Set one of them to Every.',
    parserLinkHtml:
      'Check the next run times of your expression in the <a href="/en/tools/cron-parser/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">Cron Expression Simulator</a>.',
    notesHeading: 'Notes',
    notes: [
      'The main output is the standard 5-field format (minute hour day month weekday), used by Linux crontab, GitHub Actions and Kubernetes CronJob.',
      'Quartz (such as Spring @Scheduled) adds a leading seconds field, numbers weekdays 1-7 (1 is Sunday), and requires ? in either day of month or day of week. The Quartz field is an automatic conversion for reference.',
      'If you restrict both day of month and day of week, standard cron runs the job when either one matches, so watch for unexpected runs.',
      'GitHub Actions schedules use UTC, so convert from your local time before entering the hour.',
    ],
    glossaryHeading: 'Glossary',
    glossaryTerms: [
      {
        term: 'Cron expression',
        description:
          'A format that describes a recurring schedule as five space-separated fields: minute, hour, day of month, month, and day of week.',
      },
      {
        term: 'Step (*/N)',
        description:
          'Means every N units. */15 in the minute field runs at minutes 0, 15, 30 and 45.',
      },
      {
        term: 'Quartz',
        description:
          'A Java job scheduler. Its 6 to 7 field format includes seconds and differs from standard cron in weekday numbers and the use of ?.',
      },
    ],
  },
};
