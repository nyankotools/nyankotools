import type { Locale } from '../../data/tools';

interface GlossaryTerm {
  term: string;
  description: string;
}

export interface AgeCalculatorPageContent {
  title: string;
  description: string;
  h1: string;
  introHtml: string;
  birthLabel: string;
  birthYearAriaLabel: string;
  birthMonthAriaLabel: string;
  birthDayAriaLabel: string;
  referenceLabel: string;
  referenceYearAriaLabel: string;
  referenceMonthAriaLabel: string;
  referenceDayAriaLabel: string;
  yearUnit: string;
  monthUnit: string;
  dayUnit: string;
  yearPlaceholder: string;
  birthMonthPlaceholder: string;
  birthDayPlaceholder: string;
  referenceYearPlaceholder: string;
  errorInvalidDate: string;
  fullAgeLabel: string;
  kazoedoshiLabel: string;
  daysLivedLabel: string;
  weekdayLabel: string;
  nextBirthdayLabel: string;
  weekdayLabels: string[];
  notesHeading: string;
  notes: string[];
  glossaryHeading: string;
  glossaryTerms: GlossaryTerm[];
}

export const ageCalculatorContent: Record<Locale, AgeCalculatorPageContent> = {
  ja: {
    title: '年齢計算機（満年齢・数え年・生まれてからの日数）',
    description:
      '生年月日と基準日を入力するだけで、満年齢・数え年・生まれてから経過した日数・次の誕生日までの日数を無料で計算できるツールです。データはブラウザ内で処理され、サーバーには送信されません。',
    h1: '年齢計算機',
    introHtml:
      '生年月日を入力すると、満年齢・数え年・生まれてから経過した日数・次の誕生日までの日数をリアルタイムで計算します。基準日は今日の日付が初期値ですが、変更すると「〇年〇月〇日時点で何歳か」も確認できます。ブラウザ内で処理され、入力内容がサーバーに送信されることはありません。二つの日付の日数差を計算したい場合は <a href="/tools/date-calculator/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">日数計算機</a>、生年月日を和暦で確認したい場合は <a href="/tools/japanese-era-converter/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">和暦⇔西暦変換</a> もあわせてご利用ください。',
    birthLabel: '生年月日',
    birthYearAriaLabel: '生年（西暦）',
    birthMonthAriaLabel: '生まれ月',
    birthDayAriaLabel: '生まれた日',
    referenceLabel: '基準日',
    referenceYearAriaLabel: '基準日の年（西暦）',
    referenceMonthAriaLabel: '基準日の月',
    referenceDayAriaLabel: '基準日の日',
    yearUnit: '年',
    monthUnit: '月',
    dayUnit: '日',
    yearPlaceholder: '1990',
    birthMonthPlaceholder: '6',
    birthDayPlaceholder: '15',
    referenceYearPlaceholder: '2024',
    errorInvalidDate:
      '計算できませんでした（生年月日は基準日以前の実在する日付を入力してください）',
    fullAgeLabel: '満年齢',
    kazoedoshiLabel: '数え年',
    daysLivedLabel: '生まれてから経過した日数',
    weekdayLabel: '生まれた曜日',
    nextBirthdayLabel: '次の誕生日',
    weekdayLabels: ['日', '月', '火', '水', '木', '金', '土'],
    notesHeading: '注意事項',
    notes: [
      '本ツールの満年齢は「誕生日当日に加齢する」一般的な数え方です。法律上の加齢日（誕生日の前日）を厳密に扱うものではありません（詳細は「早生まれ」の用語解説を参照）。',
      '本ツールはグレゴリオ暦を前提に計算しています。',
      '日付の入力範囲は西暦0001年〜9999年です。',
    ],
    glossaryHeading: '用語解説',
    glossaryTerms: [
      {
        term: '数え年（かぞえどし）',
        description:
          '生まれた年を1歳とし、誕生日に関わらず元日（1月1日）を迎えるたびに1歳加算する伝統的な年齢の数え方です。七五三や厄年、長寿祝いなどで使われることがあります。満年齢とは異なり、誕生日を迎えたかどうかは関係ありません。',
      },
      {
        term: '早生まれ',
        description:
          '「年齢計算ニ関スル法律」により、満年齢は誕生日の前日の終了時点（実質的に誕生日の前日）に加算されます。この規定により、4月1日生まれの人は3月31日に加齢したものとして扱われるため、同学年の中で最も早く生まれた「早生まれ」（1月〜4月1日生まれ）として扱われます。本ツールが表示する満年齢は誕生日当日に加齢する一般的な数え方であり、この法律上の1日のズレは反映していません。',
      },
      {
        term: 'うるう年（閏年）',
        description:
          '4年に一度、2月に29日が追加される年です。ただし100で割り切れる年はうるう年にならず、さらに400で割り切れる年は例外的にうるう年になります。2月29日生まれの方の誕生日は、うるう年でない年では便宜上2月28日として計算しています。',
      },
    ],
  },
  en: {
    title: 'Age Calculator (Exact Age, Days Since Birth, Next Birthday)',
    description:
      'A free tool to calculate your exact age, the traditional East Asian age, the number of days since birth, and the days remaining until your next birthday, just from your date of birth. Your data is processed in the browser and never sent to a server.',
    h1: 'Age Calculator',
    introHtml:
      'Enter a date of birth to instantly calculate the exact age, the traditional East Asian age (kazoedoshi), the number of days lived since birth, and the days remaining until the next birthday. The reference date defaults to today, but you can change it to check "how old will this person be on such-and-such date". Everything happens in your browser, and nothing you type is ever sent to a server. To calculate the difference between two arbitrary dates, check out the <a href="/en/tools/date-calculator/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">Date Calculator</a>, or to convert a date to the Japanese era calendar, the <a href="/en/tools/japanese-era-converter/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">Japanese Era Converter</a>.',
    birthLabel: 'Date of birth',
    birthYearAriaLabel: 'Birth year',
    birthMonthAriaLabel: 'Birth month',
    birthDayAriaLabel: 'Birth day',
    referenceLabel: 'Reference date',
    referenceYearAriaLabel: 'Reference year',
    referenceMonthAriaLabel: 'Reference month',
    referenceDayAriaLabel: 'Reference day',
    yearUnit: '-',
    monthUnit: '-',
    dayUnit: '',
    yearPlaceholder: '1990',
    birthMonthPlaceholder: '6',
    birthDayPlaceholder: '15',
    referenceYearPlaceholder: '2024',
    errorInvalidDate:
      'Could not calculate (please enter a date of birth that actually exists and is on or before the reference date)',
    fullAgeLabel: 'Exact age',
    kazoedoshiLabel: 'Kazoedoshi (traditional age)',
    daysLivedLabel: 'Days lived',
    weekdayLabel: 'Day of the week born',
    nextBirthdayLabel: 'Next birthday',
    weekdayLabels: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    notesHeading: 'Notes',
    notes: [
      'The exact age uses the common convention of incrementing on the birthday itself, not Japan\'s legal age-increment rule (see the "Age increment law" glossary entry for details).',
      'This tool assumes the Gregorian calendar throughout.',
      'The supported date range is year 0001 through 9999.',
    ],
    glossaryHeading: 'Glossary',
    glossaryTerms: [
      {
        term: 'Kazoedoshi (traditional East Asian age)',
        description:
          "A traditional way of counting age used in Japan, where a person is 1 year old at birth and gains a year on every New Year's Day (January 1), regardless of their actual birthday. It is unrelated to whether the birthday has been reached yet, and still appears in some traditional ceremonies.",
      },
      {
        term: 'Age increment law (Japan)',
        description:
          'Under Japanese law, a person\'s age legally increases at the end of the day before their birthday, not on the birthday itself. Combined with the Japanese school year starting April 1, this is why children born on April 1 are grouped with the older school-year cohort ("early-born", or hayaumare). This tool\'s age uses the everyday convention of incrementing on the birthday itself, not this legal one-day offset.',
      },
      {
        term: 'Leap year',
        description:
          'A year with an extra day (February 29), occurring every 4 years — except years divisible by 100, which are not leap years unless also divisible by 400. For someone born on February 29, this tool treats February 28 as their birthday in non-leap years.',
      },
    ],
  },
};
