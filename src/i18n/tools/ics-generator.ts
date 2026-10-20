import type { Locale } from '../../data/tools';
import type { IcsErrorCode } from '../../lib/tools/ics-generator';

interface GlossaryTerm {
  term: string;
  description: string;
}

export interface IcsGeneratorPageContent {
  title: string;
  description: string;
  h1: string;
  introHtml: string;

  summaryLabel: string;
  summaryPlaceholder: string;
  descriptionLabel: string;
  locationLabel: string;
  urlLabel: string;
  allDayLabel: string;
  startDateLabel: string;
  startTimeLabel: string;
  endDateLabel: string;
  endTimeLabel: string;
  timeZoneModeLabel: string;
  modeTzid: string;
  modeUtc: string;
  modeFloating: string;
  timeZoneLabel: string;
  repeatLabel: string;
  repeatNone: string;
  repeatDaily: string;
  repeatWeekly: string;
  repeatMonthly: string;
  repeatYearly: string;
  intervalLabel: string;
  weekdaysLabel: string;
  /** 月曜始まりの 7 つ（MO..SU） */
  weekdayNames: string[];
  repeatEndLabel: string;
  repeatEndNever: string;
  repeatEndCount: string;
  repeatEndUntil: string;
  countLabel: string;
  untilLabel: string;
  reminderLabel: string;
  reminderValueLabel: string;
  reminderUnitLabel: string;
  unitMinutes: string;
  unitHours: string;
  unitDays: string;

  previewLabel: string;
  downloadButton: string;
  copyButton: string;
  copiedMessage: string;
  copyFailedMessage: string;
  googleLinkLabel: string;
  googleOpenButton: string;
  googleCopyButton: string;
  errors: Record<IcsErrorCode, string>;

  howToHeading: string;
  howToSteps: string[];
  notesHeading: string;
  notes: string[];
  glossaryHeading: string;
  glossaryTerms: GlossaryTerm[];
}

export const icsGeneratorContent: Record<Locale, IcsGeneratorPageContent> = {
  ja: {
    title: 'ICSファイル作成（カレンダー予定・Googleカレンダー追加リンク）',
    description:
      '予定の.icsファイルとGoogleカレンダーの追加リンクを作成します。繰り返し・リマインダー・終日・タイムゾーンに対応。データはブラウザ内で処理され、サーバーには送信されません。',
    h1: 'ICSファイル作成（カレンダー予定・Googleカレンダーリンク）',
    introHtml:
      'タイトルと日時を入力するだけで、カレンダーアプリに取り込める予定ファイル（.ics）と、Googleカレンダーに予定を追加するリンクを作成します。毎週・毎月などの繰り返し、開始前のリマインダー、終日の予定にも対応しています。ブラウザ内で作成され、入力内容がサーバーに送信されることはありません。日時の変換には <a href="/tools/unix-timestamp/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">UNIXタイムスタンプ変換</a> もご利用ください。',

    summaryLabel: 'タイトル',
    summaryPlaceholder: '例: 定例ミーティング',
    descriptionLabel: '説明（任意）',
    locationLabel: '場所（任意）',
    urlLabel: 'URL（任意）',
    allDayLabel: '終日の予定にする',
    startDateLabel: '開始日',
    startTimeLabel: '開始時刻',
    endDateLabel: '終了日',
    endTimeLabel: '終了時刻',
    timeZoneModeLabel: 'タイムゾーンの扱い',
    modeTzid: 'タイムゾーンを指定（TZID）',
    modeUtc: 'UTCに変換して書き出す',
    modeFloating: '指定しない（見る人の現地時間）',
    timeZoneLabel: 'タイムゾーン（IANA名）',
    repeatLabel: '繰り返し',
    repeatNone: 'なし',
    repeatDaily: '毎日',
    repeatWeekly: '毎週',
    repeatMonthly: '毎月',
    repeatYearly: '毎年',
    intervalLabel: '間隔',
    weekdaysLabel: '曜日（未選択なら開始日の曜日）',
    weekdayNames: ['月', '火', '水', '木', '金', '土', '日'],
    repeatEndLabel: '繰り返しの終わり',
    repeatEndNever: '終わりなし',
    repeatEndCount: '回数で指定',
    repeatEndUntil: '終了日で指定',
    countLabel: '回数',
    untilLabel: '最終日',
    reminderLabel: 'リマインダーを付ける',
    reminderValueLabel: '通知のタイミング',
    reminderUnitLabel: '単位',
    unitMinutes: '分前',
    unitHours: '時間前',
    unitDays: '日前',

    previewLabel: '.icsの内容',
    downloadButton: 'ICSをダウンロード',
    copyButton: '内容をコピー',
    copiedMessage: 'コピーしました',
    copyFailedMessage: 'コピーできませんでした',
    googleLinkLabel: 'Googleカレンダー追加リンク',
    googleOpenButton: 'Googleカレンダーで開く',
    googleCopyButton: 'リンクをコピー',
    errors: {
      summaryRequired: 'タイトルを入力してください',
      startInvalid: '開始の日付と時刻を正しく入力してください',
      endInvalid: '終了の日付と時刻を正しく入力してください',
      endBeforeStart: '終了は開始以降の日時にしてください',
      timeZoneInvalid:
        'タイムゾーンが正しくありません（例: Asia/Tokyo、America/New_York）',
      intervalInvalid: '間隔は1〜999の整数で入力してください',
      countInvalid: '回数は1〜999の整数で入力してください',
      untilInvalid: '繰り返しの最終日を正しく入力してください',
      untilBeforeStart: '最終日は開始日以降にしてください',
      reminderInvalid:
        'リマインダーは0〜4週間（40320分）の整数で入力してください',
      urlInvalid: 'URLは http:// または https:// で始まる形式にしてください',
    },

    howToHeading: '使い方',
    howToSteps: [
      '「タイトル」と開始・終了の日時を入力します（終日なら「終日の予定にする」をオン）。',
      '必要に応じて「繰り返し」「リマインダーを付ける」を設定します。',
      '「ICSをダウンロード」で.icsファイルを保存し、カレンダーアプリで開きます。Googleカレンダーなら「Googleカレンダーで開く」からも追加できます。',
    ],
    notesHeading: '注意事項',
    notes: [
      '「タイムゾーンを指定（TZID）」ではVTIMEZONE定義を含めません。Google・Apple・Outlookなど主要なアプリは標準のIANA名を理解しますが、古いアプリでは時刻がずれることがあります。確実にしたいときは「UTCに変換して書き出す」を選んでください。',
      '「指定しない」を選ぶと、取り込んだ人の現地時間でその時刻の予定になります。',
      'Googleカレンダーの追加リンクではリマインダーを設定できません。通知を付けたい場合は.icsファイルを使ってください。',
      'リマインダーの扱いはアプリによって異なり、取り込み時に無視されることがあります。',
      '毎月の繰り返しは開始日と同じ日付、毎年の繰り返しは開始日と同じ月日で繰り返します（31日などが無い月は飛ばされることがあります）。',
      '同じ予定を何度も取り込むと重複することがあります。このツールは毎回新しいUIDを付けます。',
    ],
    glossaryHeading: '用語解説',
    glossaryTerms: [
      {
        term: 'ICS（iCalendar）',
        description:
          'RFC 5545で定められた、予定を交換するためのテキスト形式です。拡張子は.icsで、Googleカレンダー・Appleカレンダー・Outlookなど多くのアプリで取り込めます。',
      },
      {
        term: 'RRULE',
        description:
          '繰り返しの規則を表すプロパティです。例えば FREQ=WEEKLY;BYDAY=MO,WE;COUNT=10 は「毎週月・水曜日に10回」を意味します。',
      },
      {
        term: 'VALARM',
        description:
          '予定に付けるリマインダー（アラーム）の定義です。TRIGGER:-PT15M は開始の15分前に通知することを表します。',
      },
      {
        term: 'フローティング時間',
        description:
          'タイムゾーンを持たない日時です。どの地域で開いても同じ壁時計の時刻として扱われます。',
      },
    ],
  },
  en: {
    title: 'ICS File Generator (Calendar Event, Google Link)',
    description:
      'Create an .ics calendar event file or a Google Calendar link with recurrence, reminders, all-day and time zone support. Runs in your browser.',
    h1: 'ICS File Generator: Calendar Event and Google Calendar Link',
    introHtml:
      'Enter a title and a date to make an .ics file you can import into any calendar app, plus a link that adds the event to Google Calendar. Repeating events, reminders before the start, and all-day events are supported. Everything is built in your browser, and nothing you enter is sent to a server. To convert a date to a number, try the <a href="/en/tools/unix-timestamp/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">Unix Timestamp Converter</a>.',

    summaryLabel: 'Title',
    summaryPlaceholder: 'e.g. Weekly meeting',
    descriptionLabel: 'Description (optional)',
    locationLabel: 'Location (optional)',
    urlLabel: 'URL (optional)',
    allDayLabel: 'All-day event',
    startDateLabel: 'Start date',
    startTimeLabel: 'Start time',
    endDateLabel: 'End date',
    endTimeLabel: 'End time',
    timeZoneModeLabel: 'Time zone handling',
    modeTzid: 'Use a time zone (TZID)',
    modeUtc: 'Convert to UTC',
    modeFloating: 'None (viewer’s local time)',
    timeZoneLabel: 'Time zone (IANA name)',
    repeatLabel: 'Repeat',
    repeatNone: 'Does not repeat',
    repeatDaily: 'Daily',
    repeatWeekly: 'Weekly',
    repeatMonthly: 'Monthly',
    repeatYearly: 'Yearly',
    intervalLabel: 'Every',
    weekdaysLabel: 'On (none selected = weekday of the start date)',
    weekdayNames: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    repeatEndLabel: 'Ends',
    repeatEndNever: 'Never',
    repeatEndCount: 'After a number of times',
    repeatEndUntil: 'On a date',
    countLabel: 'Occurrences',
    untilLabel: 'Last date',
    reminderLabel: 'Add a reminder',
    reminderValueLabel: 'How long before the start',
    reminderUnitLabel: 'Unit',
    unitMinutes: 'minutes before',
    unitHours: 'hours before',
    unitDays: 'days before',

    previewLabel: '.ics content',
    downloadButton: 'Download .ics',
    copyButton: 'Copy content',
    copiedMessage: 'Copied',
    copyFailedMessage: 'Could not copy',
    googleLinkLabel: 'Google Calendar link',
    googleOpenButton: 'Open in Google Calendar',
    googleCopyButton: 'Copy link',
    errors: {
      summaryRequired: 'Enter a title.',
      startInvalid: 'Enter a valid start date and time.',
      endInvalid: 'Enter a valid end date and time.',
      endBeforeStart: 'The end must not be before the start.',
      timeZoneInvalid:
        'Unknown time zone. Use an IANA name such as Asia/Tokyo or America/New_York.',
      intervalInvalid: 'Enter a whole number from 1 to 999 for the interval.',
      countInvalid: 'Enter a whole number from 1 to 999 for the occurrences.',
      untilInvalid: 'Enter a valid last date for the repetition.',
      untilBeforeStart: 'The last date must not be before the start date.',
      reminderInvalid:
        'Enter a whole number of minutes from 0 to 40320 (4 weeks) for the reminder.',
      urlInvalid: 'The URL must start with http:// or https://.',
    },

    howToHeading: 'How to use',
    howToSteps: [
      'Enter a "Title" and the start and end date and time (turn on "All-day event" for a full-day entry).',
      'Set "Repeat" and "Add a reminder" if you need them.',
      'Press "Download .ics" and open the saved file in your calendar app. For Google Calendar you can also use "Open in Google Calendar".',
    ],
    notesHeading: 'Notes',
    notes: [
      '"Use a time zone (TZID)" does not embed a VTIMEZONE definition. Google, Apple and Outlook understand standard IANA names, but older apps may shift the time. For the safest result, choose "Convert to UTC".',
      'With "None", the event happens at that clock time in the local time of whoever imports it.',
      'Google Calendar links cannot carry a reminder. Use the .ics file if you need a notification.',
      'Apps handle reminders differently and some ignore them on import.',
      'Monthly repeats use the same day of the month as the start date, and yearly repeats the same month and day. Months without that day (such as the 31st) may be skipped.',
      'Importing the same file more than once can create duplicates. A new UID is generated each time.',
    ],
    glossaryHeading: 'Glossary',
    glossaryTerms: [
      {
        term: 'ICS (iCalendar)',
        description:
          'A text format for exchanging events, defined in RFC 5545. Files use the .ics extension and can be imported by Google Calendar, Apple Calendar, Outlook and many other apps.',
      },
      {
        term: 'RRULE',
        description:
          'The property that describes how an event repeats. For example, FREQ=WEEKLY;BYDAY=MO,WE;COUNT=10 means every Monday and Wednesday, 10 times.',
      },
      {
        term: 'VALARM',
        description:
          'The definition of a reminder (alarm) attached to an event. TRIGGER:-PT15M means notify 15 minutes before the start.',
      },
      {
        term: 'Floating time',
        description:
          'A date and time without a time zone. It is read as the same wall-clock time wherever the file is opened.',
      },
    ],
  },
};
