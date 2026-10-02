import type { Locale } from '../../data/tools';
import type {
  BusinessDayError,
  HolidayKey,
} from '../../lib/tools/business-day-calculator';

interface GlossaryTerm {
  term: string;
  description: string;
}

export interface BusinessDayCalculatorPageContent {
  title: string;
  description: string;
  h1: string;
  introHtml: string;
  /** Intl.DateTimeFormat に渡すロケール */
  dateLocale: string;

  optionsLegend: string;
  excludeHolidaysLabel: string;
  excludeYearEndLabel: string;

  addHeading: string;
  startDateLabel: string;
  daysLabel: string;
  daysHint: string;
  /** {date} {weekday} を置き換える */
  addResult: string;
  addNote: string;

  countHeading: string;
  endDateLabel: string;
  countBusinessLabel: string;
  countCalendarLabel: string;
  countWeekendLabel: string;
  countHolidayLabel: string;
  countUnit: string;

  holidaysHeading: string;
  yearLabel: string;
  holidayNames: Record<HolidayKey, string>;
  holidayEmpty: string;

  errors: Record<BusinessDayError, string>;

  howToHeading: string;
  howToSteps: string[];
  notesHeading: string;
  notes: string[];
  glossaryHeading: string;
  glossaryTerms: GlossaryTerm[];
}

export const businessDayCalculatorContent: Record<
  Locale,
  BusinessDayCalculatorPageContent
> = {
  ja: {
    title: '営業日計算（日本の祝日対応・N営業日後・営業日数）',
    description:
      '日本の祝日・土日を除いた営業日を計算します。「◯営業日後（前）の日付」「期間内の営業日数」「祝日一覧」に対応し、振替休日・国民の休日も反映。年末年始の休業日も指定できます。データはブラウザ内で処理され、サーバーには送信されません。',
    h1: '営業日計算（日本の祝日・振替休日対応）',
    introHtml:
      '日本の祝日と土日を除いた営業日を計算します。納期や支払期日の「◯営業日後」の日付、2つの日付のあいだの営業日数、年ごとの祝日一覧を調べられます。祝日は振替休日・国民の休日を含め、法律のルール（春分・秋分の日の計算を含む）から算出しています。ブラウザ内で計算され、入力内容がサーバーに送信されることはありません。暦日どうしの差を知りたいときは <a href="/tools/date-calculator/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">日付計算</a> もご利用ください。',
    dateLocale: 'ja-JP',

    optionsLegend: '休業日の設定',
    excludeHolidaysLabel: '日本の祝日・振替休日を休業日にする',
    excludeYearEndLabel: '年末年始（12/29〜1/3）を休業日にする',

    addHeading: '◯営業日後（前）の日付',
    startDateLabel: '起算日',
    daysLabel: '営業日数',
    daysHint: '未来は正の数、過去はマイナスで入力します（例: -5）。',
    addResult: '{date}（{weekday}）',
    addNote: '起算日そのものは数えません。',

    countHeading: '期間内の営業日数',
    endDateLabel: '終了日',
    countBusinessLabel: '営業日',
    countCalendarLabel: '暦日（開始日・終了日を含む）',
    countWeekendLabel: '土日',
    countHolidayLabel: '祝日・年末年始（平日の休業日）',
    countUnit: '{n}日',

    holidaysHeading: '祝日一覧',
    yearLabel: '年（2000〜2099）',
    holidayNames: {
      newYear: '元日',
      comingOfAge: '成人の日',
      foundation: '建国記念の日',
      emperorBirthday: '天皇誕生日',
      springEquinox: '春分の日',
      showa: '昭和の日',
      constitution: '憲法記念日',
      greenery: 'みどりの日',
      children: 'こどもの日',
      marine: '海の日',
      mountain: '山の日',
      respect: '敬老の日',
      autumnEquinox: '秋分の日',
      sports: 'スポーツの日（体育の日）',
      culture: '文化の日',
      laborThanks: '勤労感謝の日',
      abdication: '天皇の退位の日',
      accession: '天皇の即位の日',
      enthronement: '即位礼正殿の儀の行われる日',
      substitute: '振替休日',
      citizen: '国民の休日',
    },
    holidayEmpty: '2000〜2099年の範囲で入力してください。',

    errors: {
      invalidDate: '2000〜2099年の正しい日付を入力してください',
      outOfRange: '計算結果が対応範囲（2000〜2099年）を超えました',
      invalidDays: '営業日数は-10000〜10000の整数で入力してください',
    },

    howToHeading: '使い方',
    howToSteps: [
      '「休業日の設定」で、祝日や年末年始を休業日に含めるかを選びます。',
      '「◯営業日後（前）の日付」に起算日と営業日数を入力すると、期日が表示されます。',
      '「期間内の営業日数」に開始日と終了日を入れると、営業日・土日・祝日の日数がわかります。',
    ],
    notesHeading: '注意事項',
    notes: [
      '祝日は2000〜2099年の範囲で、現行の祝日法のルールから計算しています。2020・2021年の東京オリンピックに伴う祝日の移動や、2019年の改元に伴う臨時の祝日にも対応しています。',
      '今後の法改正や臨時の祝日（新設・移動）は反映されません。重要な期日は、内閣府が公表する国民の祝日の一覧でも確認してください。',
      '土曜・日曜は常に休業日として扱います。会社ごとの独自の休業日（創立記念日、お盆休みなど）は反映されません。',
      '期間内の営業日数は、開始日・終了日の両方を含めて数えます。開始日が終了日より後のときは、自動的に入れ替えて計算します。',
    ],
    glossaryHeading: '用語解説',
    glossaryTerms: [
      {
        term: '振替休日',
        description:
          '祝日が日曜日にあたるとき、その日のあとの最初の平日（祝日でない日）を休日とする制度です。たとえば5月3日（憲法記念日）が日曜日なら、みどりの日・こどもの日を飛ばして5月6日が振替休日になります。',
      },
      {
        term: '国民の休日',
        description:
          '前日と翌日がどちらも祝日である平日が、休日になる制度です。秋分の日の前日が敬老の日にあたる年の9月などに現れます。',
      },
      {
        term: 'ハッピーマンデー',
        description:
          '成人の日・海の日・敬老の日・スポーツの日を、特定の日付ではなく「第◯月曜日」にして連休を作る制度です。',
      },
    ],
  },
  en: {
    title: 'Japan Business Day Calculator (Holidays, Add Days, Count)',
    description:
      'Find the date N business days away, count business days in a range, and list Japanese holidays by year. Runs in your browser; nothing is sent to a server.',
    h1: 'Japan Business Day Calculator with National Holidays',
    introHtml:
      'Work out business days in Japan, skipping weekends and national holidays. Find the due date that is N business days after (or before) a date, count the business days between two dates, or list the holidays of any year from 2000 to 2099. Substitute holidays and “citizens’ holidays” are included, and the holidays are computed from the rules of Japanese law, including the spring and autumn equinoxes. Everything runs in your browser, and nothing you type is sent to a server. To count plain calendar days, use the <a href="/en/tools/date-calculator/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">Date Calculator</a>.',
    dateLocale: 'en-US',

    optionsLegend: 'Non-working days',
    excludeHolidaysLabel: 'Treat Japanese national holidays as days off',
    excludeYearEndLabel:
      'Treat the year-end break (Dec 29 – Jan 3) as days off',

    addHeading: 'Date N business days from a date',
    startDateLabel: 'Start date',
    daysLabel: 'Business days',
    daysHint:
      'Use a positive number for the future and a negative one for the past (for example -5).',
    addResult: '{date} ({weekday})',
    addNote: 'The start date itself is not counted.',

    countHeading: 'Business days in a date range',
    endDateLabel: 'End date',
    countBusinessLabel: 'Business days',
    countCalendarLabel: 'Calendar days (both ends included)',
    countWeekendLabel: 'Weekend days',
    countHolidayLabel: 'Holidays and year-end break (on weekdays)',
    countUnit: '{n}',

    holidaysHeading: 'Holidays by year',
    yearLabel: 'Year (2000–2099)',
    holidayNames: {
      newYear: 'New Year’s Day',
      comingOfAge: 'Coming of Age Day',
      foundation: 'National Foundation Day',
      emperorBirthday: 'Emperor’s Birthday',
      springEquinox: 'Vernal Equinox Day',
      showa: 'Showa Day',
      constitution: 'Constitution Memorial Day',
      greenery: 'Greenery Day',
      children: 'Children’s Day',
      marine: 'Marine Day',
      mountain: 'Mountain Day',
      respect: 'Respect for the Aged Day',
      autumnEquinox: 'Autumnal Equinox Day',
      sports: 'Sports Day (Health and Sports Day)',
      culture: 'Culture Day',
      laborThanks: 'Labor Thanksgiving Day',
      abdication: 'Day of the Emperor’s abdication',
      accession: 'Day of the Emperor’s accession',
      enthronement: 'Day of the Enthronement Ceremony',
      substitute: 'Substitute holiday',
      citizen: 'Citizens’ holiday',
    },
    holidayEmpty: 'Enter a year from 2000 to 2099.',

    errors: {
      invalidDate: 'Enter a valid date between 2000 and 2099',
      outOfRange: 'The result is outside the supported range (2000–2099)',
      invalidDays: 'Enter a whole number of business days from -10000 to 10000',
    },

    howToHeading: 'How to use',
    howToSteps: [
      'Under “Non-working days”, choose whether holidays and the year-end break count as days off.',
      'In “Date N business days from a date”, enter a start date and a number of business days to see the due date.',
      'In “Business days in a date range”, enter a start and end date to see business days, weekends, and holidays.',
    ],
    notesHeading: 'Notes',
    notes: [
      'Holidays are computed from the current Japanese holiday law for 2000–2099, including the 2020 and 2021 Tokyo Olympics shifts and the special holidays of the 2019 imperial transition.',
      'Future legal changes and one-off holidays are not reflected. For important deadlines, also check the Cabinet Office’s list of national holidays.',
      'Saturdays and Sundays are always treated as days off. Company-specific closures (founding anniversaries, Obon, etc.) are not included.',
      'The range count includes both the start and end dates. If the start is after the end, the two are swapped automatically.',
    ],
    glossaryHeading: 'Glossary',
    glossaryTerms: [
      {
        term: 'Substitute holiday (furikae kyujitsu)',
        description:
          'When a national holiday falls on a Sunday, the next weekday that is not itself a holiday becomes a day off. For example, if May 3 is a Sunday, May 6 becomes the substitute holiday, skipping Greenery Day and Children’s Day.',
      },
      {
        term: 'Citizens’ holiday (kokumin no kyujitsu)',
        description:
          'A weekday sandwiched between two national holidays becomes a day off. It appears in September in years when Respect for the Aged Day falls two days before the autumnal equinox.',
      },
      {
        term: 'Happy Monday system',
        description:
          'Coming of Age Day, Marine Day, Respect for the Aged Day, and Sports Day fall on a set Monday of the month instead of a fixed date, creating three-day weekends.',
      },
    ],
  },
};
