import type { Locale } from '../../data/tools';

interface GlossaryTerm {
  term: string;
  description: string;
}

export interface TimezoneConverterPageContent {
  title: string;
  description: string;
  h1: string;
  introHtml: string;
  /** Intl.DateTimeFormat に渡すロケール */
  dateLocale: string;

  inputLabel: string;
  sourceZoneLabel: string;
  nowButton: string;
  liveLabel: string;
  gapNote: string;
  ambiguousNote: string;
  invalidInput: string;

  targetsHeading: string;
  addZoneLabel: string;
  addZonePlaceholder: string;
  addZoneButton: string;
  invalidZone: string;
  removeLabel: string;
  /** [単数, 複数]。{n} には符号付きの日数が入る */
  dayDiffForms: [string, string];
  sameDay: string;
  /** IANA ID → 表示名 */
  zoneLabels: Record<string, string>;

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

export const timezoneConverterContent: Record<
  Locale,
  TimezoneConverterPageContent
> = {
  ja: {
    title: 'タイムゾーン変換・世界時計（時差を一括で確認）',
    description:
      '日時を入力して、東京・ニューヨーク・ロンドンなど世界各地の現地時刻に一括変換するタイムゾーン変換ツールです。サマータイム（夏時間）に対応し、現在時刻の世界時計としても使えます。データはブラウザ内で処理され、サーバーには送信されません。',
    h1: 'タイムゾーン変換・世界時計',
    introHtml:
      '日時と基準のタイムゾーンを選ぶと、世界各地の現地時刻をまとめて表示します。オンライン会議の日程調整や海外とのやりとりで、相手の都市が何時になるかをすぐに確認できます。サマータイム（夏時間）の切り替えはブラウザの <code>Intl</code> 機能で自動的に反映されるため、時差を手計算する必要はありません。「現在時刻」を使えば世界時計としても利用できます。ブラウザ内で計算され、入力内容がサーバーに送信されることはありません。UNIX時間との変換は <a href="/tools/unix-timestamp/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">Unixタイムスタンプ変換</a> もご利用ください。',
    dateLocale: 'ja-JP',

    inputLabel: '日時',
    sourceZoneLabel: '基準のタイムゾーン',
    nowButton: '現在時刻',
    liveLabel: 'リアルタイムで更新',
    gapNote:
      'この日時はサマータイムの切り替えで存在しない時刻のため、切り替え前の時差で換算しています。',
    ambiguousNote:
      'この日時はサマータイムの終了で2回あります。早いほう（サマータイム中）で換算しています。',
    invalidInput: '日時を正しく入力してください',

    targetsHeading: '変換先の都市・タイムゾーン',
    addZoneLabel: 'タイムゾーンを追加（IANA名）',
    addZonePlaceholder: '例: Europe/Madrid',
    addZoneButton: '追加',
    invalidZone:
      'このタイムゾーン名は使えません。Asia/Tokyo のような形式で入力してください',
    removeLabel: '{zone}を削除',
    dayDiffForms: ['{n}日', '{n}日'],
    sameDay: '同じ日',
    zoneLabels: {
      'Asia/Tokyo': '東京',
      'Asia/Seoul': 'ソウル',
      'Asia/Shanghai': '上海・北京',
      'Asia/Hong_Kong': '香港',
      'Asia/Singapore': 'シンガポール',
      'Asia/Bangkok': 'バンコク',
      'Asia/Kolkata': 'インド（デリー・ムンバイ）',
      'Asia/Dubai': 'ドバイ',
      'Europe/Moscow': 'モスクワ',
      'Europe/Istanbul': 'イスタンブール',
      'Europe/Berlin': 'ベルリン',
      'Europe/Paris': 'パリ',
      'Europe/London': 'ロンドン',
      UTC: '協定世界時（UTC）',
      'America/Sao_Paulo': 'サンパウロ',
      'America/New_York': 'ニューヨーク',
      'America/Chicago': 'シカゴ',
      'America/Denver': 'デンバー',
      'America/Los_Angeles': 'ロサンゼルス',
      'America/Anchorage': 'アンカレッジ',
      'Pacific/Honolulu': 'ホノルル',
      'Australia/Sydney': 'シドニー',
      'Pacific/Auckland': 'オークランド',
      'Africa/Cairo': 'カイロ',
      'Africa/Johannesburg': 'ヨハネスブルグ',
    },

    copyButton: '結果をコピー',
    copied: 'コピーしました',
    copyFailed: 'コピーに失敗しました',

    howToHeading: '使い方',
    howToSteps: [
      '「日時」と「基準のタイムゾーン」を選びます（初期値は現在時刻とお使いの端末のタイムゾーン）。',
      '変換先の一覧に、各地の現地時刻・曜日・UTCとの時差が表示されます。',
      '「タイムゾーンを追加」に Europe/Madrid のようなIANA名を入れると、一覧に都市を追加できます。',
    ],
    notesHeading: '注意事項',
    notes: [
      '時差とサマータイムは、お使いのブラウザに内蔵されたタイムゾーンデータで計算します。各国の制度が最近変わった場合、古いブラウザでは反映が遅れることがあります。',
      '変換先の一覧は、このページを開き直すと初期状態に戻ります。',
      '日付の差は、基準のタイムゾーンの日付と比べて何日ずれるかを表します。',
    ],
    glossaryHeading: '用語解説',
    glossaryTerms: [
      {
        term: 'IANAタイムゾーン名',
        description:
          'Asia/Tokyo や America/New_York のように「地域/都市」の形で表すタイムゾーンの識別子です。サマータイムの履歴も含んでおり、UTC+9 のような固定の時差よりも正確です。',
      },
      {
        term: 'UTC（協定世界時）',
        description:
          '世界の標準となる時刻で、各地の時刻はUTCからの時差で表されます。日本標準時はUTC+9です。',
      },
      {
        term: 'サマータイム（夏時間）',
        description:
          '夏の間だけ時計を1時間進める制度です。切り替えの日は、存在しない時刻や2回ある時刻が生まれます。日本では採用されていません。',
      },
    ],
  },
  en: {
    title: 'Time Zone Converter & World Clock (Compare Time Differences)',
    description:
      'Convert a date and time to local times in Tokyo, New York, London, and more, with daylight saving support. Runs in your browser; nothing is sent to a server.',
    h1: 'Time Zone Converter and World Clock',
    introHtml:
      'Pick a date, time, and starting time zone to see the local time in cities around the world side by side. It is handy for scheduling online meetings or calls across countries: you can tell at a glance what time it is for the other person. Daylight saving time changes are applied automatically by your browser’s <code>Intl</code> support, so there is no need to calculate offsets by hand. Use “Now” to turn it into a world clock. Everything runs in your browser, and nothing you type is sent to a server. To convert epoch values, try the <a href="/en/tools/unix-timestamp/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">Unix Timestamp Converter</a>.',
    dateLocale: 'en-US',

    inputLabel: 'Date and time',
    sourceZoneLabel: 'Starting time zone',
    nowButton: 'Now',
    liveLabel: 'Update in real time',
    gapNote:
      'This time does not exist because of a daylight saving change, so it was converted with the offset from before the change.',
    ambiguousNote:
      'This time occurs twice when daylight saving ends. The earlier one (during daylight saving) was used.',
    invalidInput: 'Enter a valid date and time',

    targetsHeading: 'Cities and time zones to convert to',
    addZoneLabel: 'Add a time zone (IANA name)',
    addZonePlaceholder: 'e.g. Europe/Madrid',
    addZoneButton: 'Add',
    invalidZone:
      'That time zone name is not valid. Use a format like Asia/Tokyo.',
    removeLabel: 'Remove {zone}',
    dayDiffForms: ['{n} day', '{n} days'],
    sameDay: 'Same day',
    zoneLabels: {
      'Asia/Tokyo': 'Tokyo',
      'Asia/Seoul': 'Seoul',
      'Asia/Shanghai': 'Shanghai / Beijing',
      'Asia/Hong_Kong': 'Hong Kong',
      'Asia/Singapore': 'Singapore',
      'Asia/Bangkok': 'Bangkok',
      'Asia/Kolkata': 'India (Delhi / Mumbai)',
      'Asia/Dubai': 'Dubai',
      'Europe/Moscow': 'Moscow',
      'Europe/Istanbul': 'Istanbul',
      'Europe/Berlin': 'Berlin',
      'Europe/Paris': 'Paris',
      'Europe/London': 'London',
      UTC: 'Coordinated Universal Time (UTC)',
      'America/Sao_Paulo': 'São Paulo',
      'America/New_York': 'New York',
      'America/Chicago': 'Chicago',
      'America/Denver': 'Denver',
      'America/Los_Angeles': 'Los Angeles',
      'America/Anchorage': 'Anchorage',
      'Pacific/Honolulu': 'Honolulu',
      'Australia/Sydney': 'Sydney',
      'Pacific/Auckland': 'Auckland',
      'Africa/Cairo': 'Cairo',
      'Africa/Johannesburg': 'Johannesburg',
    },

    copyButton: 'Copy results',
    copied: 'Copied',
    copyFailed: 'Copy failed',

    howToHeading: 'How to use',
    howToSteps: [
      'Choose the date and time and the starting time zone (they default to now and your device’s time zone).',
      'The list shows the local time, weekday, and UTC offset for each city.',
      'Type an IANA name such as Europe/Madrid under “Add a time zone” to add a city to the list.',
    ],
    notesHeading: 'Notes',
    notes: [
      'Offsets and daylight saving rules come from the time zone data built into your browser. If a country changed its rules recently, an older browser may be slow to reflect it.',
      'The list of cities returns to its default when you reload the page.',
      'The day difference compares each city’s date with the date in the starting time zone.',
    ],
    glossaryHeading: 'Glossary',
    glossaryTerms: [
      {
        term: 'IANA time zone name',
        description:
          'An identifier in the form Region/City, such as Asia/Tokyo or America/New_York. It carries the daylight saving history, so it is more accurate than a fixed offset like UTC+9.',
      },
      {
        term: 'UTC (Coordinated Universal Time)',
        description:
          'The world’s reference time. Local times are expressed as an offset from UTC; Japan Standard Time is UTC+9.',
      },
      {
        term: 'Daylight saving time (DST)',
        description:
          'The practice of moving clocks forward an hour during summer. On the switch days some local times do not exist and others occur twice. Japan does not use DST.',
      },
    ],
  },
};
