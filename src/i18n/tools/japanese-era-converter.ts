import type { Locale } from '../../data/tools';

interface GlossaryTerm {
  term: string;
  description: string;
}

export interface JapaneseEraConverterPageContent {
  title: string;
  description: string;
  h1: string;
  introHtml: string;
  westernToJapaneseHeading: string;
  westernDateLabel: string;
  westernYearAriaLabel: string;
  westernMonthAriaLabel: string;
  westernDayAriaLabel: string;
  yearUnit: string;
  monthUnit: string;
  dayUnit: string;
  yearPlaceholder: string;
  monthPlaceholder: string;
  dayPlaceholder: string;
  errorW2J: string;
  japaneseToWesternHeading: string;
  eraLabel: string;
  j2wYearLabel: string;
  j2wMonthLabel: string;
  j2wDayLabel: string;
  j2wYearPlaceholder: string;
  errorJ2W: string;
  tableHeading: string;
  tableColEra: string;
  tableColStartDate: string;
  tableColYear1: string;
  notesHeading: string;
  notes: string[];
  glossaryHeading: string;
  glossaryTerms: GlossaryTerm[];
}

export const japaneseEraConverterContent: Record<
  Locale,
  JapaneseEraConverterPageContent
> = {
  ja: {
    title: '和暦⇔西暦変換（元号早見表）',
    description:
      '令和・平成・昭和・大正・明治の和暦と西暦を相互に変換できる無料ツールです。改元日をまたぐ日付にも対応。データはブラウザ内で処理され、サーバーには送信されません。',
    h1: '和暦⇔西暦変換',
    introHtml:
      '明治・大正・昭和・平成・令和の和暦と西暦をリアルタイムで相互変換します。改元日（例: 昭和64年1月7日→平成元年1月8日）をまたぐ日付も正しく判定します。ブラウザ内で処理され、入力内容がサーバーに送信されることはありません。生年月日から年齢を計算したい場合は <a href="/tools/unix-timestamp/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">Unixタイムスタンプ変換</a> もあわせてご利用ください。',
    westernToJapaneseHeading: '西暦 → 和暦',
    westernDateLabel: '西暦の日付',
    westernYearAriaLabel: '西暦の年',
    westernMonthAriaLabel: '西暦の月',
    westernDayAriaLabel: '西暦の日',
    yearUnit: '年',
    monthUnit: '月',
    dayUnit: '日',
    yearPlaceholder: '2024',
    monthPlaceholder: '6',
    dayPlaceholder: '15',
    errorW2J:
      '変換できませんでした（明治元年1868年1月25日以降の日付を指定してください）',
    japaneseToWesternHeading: '和暦 → 西暦',
    eraLabel: '元号',
    j2wYearLabel: '年',
    j2wMonthLabel: '月',
    j2wDayLabel: '日',
    j2wYearPlaceholder: '6',
    errorJ2W:
      '変換できませんでした（存在しない日付か、その元号の期間外の日付です）',
    tableHeading: '元号早見表',
    tableColEra: '元号',
    tableColStartDate: '開始日',
    tableColYear1: '元年の西暦',
    notesHeading: '注意事項',
    notes: [
      '対応範囲は明治元年（1868年1月25日）以降です。それより前の日付は変換できません。',
      '改元日の前後（例: 昭和64年1月7日と平成元年1月8日）は特に間違えやすいため、日付単位で正確に判定しています。',
      '元号年の1年目は「元年」と表示されます（例: 令和元年）。',
    ],
    glossaryHeading: '用語解説',
    glossaryTerms: [
      {
        term: '元号（げんごう）',
        description:
          '日本独自の紀年法で、天皇の即位などを機に定められる年の呼び方です。現在の元号は「令和」で、2019年5月1日の改元により始まりました。',
      },
      {
        term: '和暦（われき）',
        description:
          '元号と元号年（例: 令和6年）で年を表す方式です。西暦と対比して使われます。',
      },
      {
        term: '元年（がんねん）',
        description:
          'その元号が始まった最初の年のことです。「令和元年」のように、1年目は「1年」ではなく「元年」と表記します。',
      },
    ],
  },
  en: {
    title: 'Japanese Era Converter (Wareki ⇔ Western Year)',
    description:
      'A free tool to convert between the Japanese era calendar (Reiwa, Heisei, Showa, Taisho, Meiji) and the Western (Gregorian) year, including dates around an era transition. Your data is processed in the browser and never sent to a server.',
    h1: 'Japanese Era Converter',
    introHtml:
      'Converts between the Japanese era calendar (Meiji, Taisho, Showa, Heisei, Reiwa) and the Western year in real time, correctly handling dates around an era transition (e.g. Showa 64 / January 7 → Heisei 1 / January 8). Everything happens in your browser, and nothing you type is ever sent to a server. If you need to calculate an age from a date of birth, check out the <a href="/en/tools/unix-timestamp/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">Unix Timestamp Converter</a> as well.',
    westernToJapaneseHeading: 'Western year → Japanese era',
    westernDateLabel: 'Western date',
    westernYearAriaLabel: 'Western year',
    westernMonthAriaLabel: 'Western month',
    westernDayAriaLabel: 'Western day',
    yearUnit: '-',
    monthUnit: '-',
    dayUnit: '',
    yearPlaceholder: '2024',
    monthPlaceholder: '6',
    dayPlaceholder: '15',
    errorW2J:
      'Could not convert (please enter a date on or after Meiji 1 / January 25, 1868)',
    japaneseToWesternHeading: 'Japanese era → Western year',
    eraLabel: 'Era',
    j2wYearLabel: 'Year',
    j2wMonthLabel: 'Month',
    j2wDayLabel: 'Day',
    j2wYearPlaceholder: '6',
    errorJ2W:
      'Could not convert (the date does not exist, or falls outside that era)',
    tableHeading: 'Era reference table',
    tableColEra: 'Era',
    tableColStartDate: 'Start date',
    tableColYear1: 'Year 1 (Western)',
    notesHeading: 'Notes',
    notes: [
      'Supported range starts at Meiji 1 (January 25, 1868). Dates before that cannot be converted.',
      'Dates right around an era transition (e.g. Showa 64 / January 7 vs. Heisei 1 / January 8) are especially easy to get wrong, so conversion is determined at the day level.',
      'The first year of an era is displayed as "gannen" on the Japanese version of this tool (e.g. Reiwa gannen = Reiwa 1).',
    ],
    glossaryHeading: 'Glossary',
    glossaryTerms: [
      {
        term: 'Gengo (Japanese era name)',
        description:
          'A Japanese calendar era, traditionally set at the start of an emperor\'s reign. The current era is "Reiwa," which began on May 1, 2019.',
      },
      {
        term: 'Wareki (Japanese calendar year)',
        description:
          'A way of expressing a year using the era name and era year (e.g. "Reiwa 6"), used alongside the Western (Gregorian) year.',
      },
      {
        term: 'Gannen (first year of an era)',
        description:
          'The first year of an era. Rather than being written as "year 1," it is written as "gannen" (e.g. "Reiwa gannen").',
      },
    ],
  },
};
