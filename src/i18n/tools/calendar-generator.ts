import type { Locale } from '../../data/tools';

interface GlossaryTerm {
  term: string;
  description: string;
}

export interface CalendarGeneratorPageContent {
  title: string;
  description: string;
  h1: string;
  introHtml: string;
  /** Intl.DateTimeFormat に渡すロケール */
  dateLocale: string;

  modeLabel: string;
  modeMonth: string;
  modeYear: string;
  yearLabel: string;
  monthLabel: string;
  weekStartLabel: string;
  weekStartSun: string;
  weekStartMon: string;
  holidaysLabel: string;
  /** 祝日表示の初期値（日本語は ON、英語は OFF） */
  holidaysDefault: boolean;
  weekNumbersLabel: string;
  todayLabel: string;
  weekNumberHeader: string;
  printButton: string;
  /** {year} を置き換える */
  yearTitle: string;
  holidayListHeading: string;
  /** {min} {max} を置き換える */
  errorYear: string;

  howToHeading: string;
  howToSteps: string[];
  notesHeading: string;
  notes: string[];
  glossaryHeading: string;
  glossaryTerms: GlossaryTerm[];
}

export const calendarGeneratorContent: Record<
  Locale,
  CalendarGeneratorPageContent
> = {
  ja: {
    title: 'カレンダー生成（月間・年間・祝日・週番号・印刷用）',
    description:
      '好きな年月の月間カレンダー・年間カレンダーを作成して印刷できます。日本の祝日・振替休日、ISO週番号、日曜／月曜始まりの切り替えに対応。データはブラウザ内で処理され、サーバーには送信されません。',
    h1: 'カレンダー生成（月間・年間・印刷用）',
    introHtml:
      '年と月を選ぶだけで、月間カレンダーや年間カレンダーを作成します。日本の祝日・振替休日の表示、週番号の表示、日曜／月曜始まりの切り替えができ、そのまま印刷やPDF保存に使えます。ブラウザ内で作成され、入力内容がサーバーに送信されることはありません。祝日を除いた日数を数えたいときは <a href="/tools/business-day-calculator/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">営業日計算</a> もご利用ください。',
    dateLocale: 'ja-JP',

    modeLabel: '表示',
    modeMonth: '月間',
    modeYear: '年間',
    yearLabel: '年（1900〜2100）',
    monthLabel: '月',
    weekStartLabel: '週の始まり',
    weekStartSun: '日曜日',
    weekStartMon: '月曜日',
    holidaysLabel: '日本の祝日・振替休日を表示する',
    holidaysDefault: true,
    weekNumbersLabel: '週番号（ISO 8601）を表示する',
    todayLabel: '今日の日付に印を付ける',
    weekNumberHeader: '週',
    printButton: '印刷する',
    yearTitle: '{year}年',
    holidayListHeading: '祝日',
    errorYear: '{min}〜{max}の整数で年を入力してください',

    howToHeading: '使い方',
    howToSteps: [
      '「表示」で月間か年間かを選び、年（と月）を指定します。',
      '週の始まり、祝日・週番号の表示を必要に応じて切り替えます。',
      '「印刷する」を押すと、カレンダーだけが印刷されます（PDFとして保存することもできます）。',
    ],
    notesHeading: '注意事項',
    notes: [
      '祝日の表示は2000〜2099年の範囲です。それ以外の年ではカレンダーのみが表示されます。',
      '祝日は現行の祝日法のルールから計算しており、今後の法改正や臨時の祝日は反映されません。',
      '年間カレンダーを1枚に収めたいときは、印刷ダイアログで用紙を横向きにし、余白を小さめにしてください。',
      '日付はグレゴリオ暦（現在の暦）で計算しています。',
    ],
    glossaryHeading: '用語解説',
    glossaryTerms: [
      {
        term: 'ISO週番号',
        description:
          '国際規格ISO 8601で決められた週の数え方です。週は月曜日から始まり、その年で最初の木曜日を含む週を第1週とします。そのため、1月上旬が前年の最終週（52週・53週）になったり、12月下旬が翌年の第1週になったりすることがあります。',
      },
      {
        term: '振替休日',
        description:
          '祝日が日曜日にあたるとき、その日のあとの最初の平日（祝日でない日）を休日とする制度です。',
      },
    ],
  },
  en: {
    title: 'Calendar Generator (Monthly & Yearly, Printable)',
    description:
      'Create a printable monthly or yearly calendar with optional Japanese holidays, ISO week numbers and a Sunday or Monday start. Runs in your browser.',
    h1: 'Printable Calendar Generator (Monthly & Yearly)',
    introHtml:
      'Pick a year and month to make a monthly or yearly calendar you can print or save as a PDF. You can start the week on Sunday or Monday, show ISO week numbers, and mark Japanese national holidays. Everything runs in your browser, and nothing you enter is sent to a server. To count days between two dates, try the <a href="/en/tools/date-calculator/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">Date Calculator</a>.',
    dateLocale: 'en-US',

    modeLabel: 'View',
    modeMonth: 'Monthly',
    modeYear: 'Yearly',
    yearLabel: 'Year (1900–2100)',
    monthLabel: 'Month',
    weekStartLabel: 'Week starts on',
    weekStartSun: 'Sunday',
    weekStartMon: 'Monday',
    holidaysLabel: 'Show Japanese national holidays',
    holidaysDefault: false,
    weekNumbersLabel: 'Show ISO 8601 week numbers',
    todayLabel: "Mark today's date",
    weekNumberHeader: 'Wk',
    printButton: 'Print',
    yearTitle: '{year}',
    holidayListHeading: 'Holidays',
    errorYear: 'Enter a whole-number year from {min} to {max}.',

    howToHeading: 'How to use',
    howToSteps: [
      'Choose Monthly or Yearly under “View”, then set the year (and month).',
      'Switch the week start, holidays and week numbers as needed.',
      'Press “Print” to print just the calendar (you can also save it as a PDF).',
    ],
    notesHeading: 'Notes',
    notes: [
      'Holidays are shown for 2000–2099 only. For other years you get the plain calendar.',
      'Holidays follow current Japanese law; future legal changes and one-off holidays are not reflected.',
      'To fit a yearly calendar on one sheet, set the paper to landscape and use small margins in the print dialog.',
      'Dates are calculated in the Gregorian calendar.',
    ],
    glossaryHeading: 'Glossary',
    glossaryTerms: [
      {
        term: 'ISO week number',
        description:
          'The week numbering defined by ISO 8601. Weeks start on Monday, and week 1 is the week containing the first Thursday of the year. As a result, early January can belong to week 52 or 53 of the previous year, and late December can belong to week 1 of the next.',
      },
      {
        term: 'Substitute holiday',
        description:
          'When a Japanese national holiday falls on a Sunday, the next weekday that is not a holiday becomes a day off.',
      },
    ],
  },
};
