import type { Locale } from '../../data/tools';

interface GlossaryTerm {
  term: string;
  description: string;
}

interface Option {
  value: string;
  label: string;
}

export interface DailyProrationPreset {
  value: string;
  label: string;
  /** 結果の見出し（例: 日割り家賃） */
  resultLabel: string;
}

export interface DailyProrationPageContent {
  title: string;
  description: string;
  h1: string;
  introHtml: string;
  numberLocale: string;
  sectionHeading: string;
  presetLabel: string;
  presets: DailyProrationPreset[];
  amountLabel: string;
  modeLabel: string;
  modeDaysLabel: string;
  modeRangeLabel: string;
  monthLabel: string;
  daysLabel: string;
  startLabel: string;
  endLabel: string;
  basisLabel: string;
  basisOptions: Option[];
  roundingLabel: string;
  roundingOptions: Option[];
  errors: Record<
    'amount' | 'days' | 'month' | 'date' | 'order' | 'range',
    string
  >;
  daysResultLabel: string;
  dailyRateLabel: string;
  rawAmountLabel: string;
  formulaLabel: string;
  /** {days} を対象日数に置き換える */
  formulaThirty: string;
  formulaYear365: string;
  segmentsHeading: string;
  /** {year} {month} {days} {dim} を置き換える */
  segmentTemplate: string;
  daysSuffix: string;
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

export const dailyProrationContent: Record<Locale, DailyProrationPageContent> =
  {
    ja: {
      title: '日割り計算機｜家賃・給与・サブスクの日割額を計算',
      description:
        '月額と日数（または開始日・終了日）から日割額を計算する無料ツールです。家賃・給与・サブスクに対応し、暦日数・30日・年換算の基準と端数処理を切り替えられます。データはブラウザ内で処理され、サーバーには送信されません。',
      h1: '日割り計算機（家賃・給与・サブスクの日割額）',
      introHtml:
        '月額と対象日数、または開始日・終了日を入力すると日割額を計算します。うるう年や月末をまたぐ期間にも対応し、基準日数（その月の暦日数・30日・年換算）と端数処理（切り捨て・四捨五入・切り上げ）を選べます。入居月の家賃の目安は <a href="/tools/rent-initial-cost/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">賃貸の初期費用計算</a>、2つの日付の間の日数は <a href="/tools/date-calculator/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">日数計算機</a> も使えます。',
      numberLocale: 'ja-JP',
      sectionHeading: '日割りの条件',
      presetLabel: '用途',
      presets: [
        { value: 'rent', label: '家賃', resultLabel: '日割り家賃' },
        { value: 'salary', label: '給与', resultLabel: '日割り給与' },
        { value: 'subscription', label: 'サブスク', resultLabel: '日割り料金' },
      ],
      amountLabel: '月額（円）',
      modeLabel: '対象期間の指定方法',
      modeDaysLabel: '日数を入力',
      modeRangeLabel: '開始日・終了日を指定',
      monthLabel: '対象月',
      daysLabel: '対象日数',
      startLabel: '開始日',
      endLabel: '終了日',
      basisLabel: '日割りの基準',
      basisOptions: [
        { value: 'calendar', label: 'その月の暦日数で割る' },
        { value: 'thirty', label: '30日で割る' },
        { value: 'year365', label: '年換算（月額×12÷365）' },
      ],
      roundingLabel: '端数処理',
      roundingOptions: [
        { value: 'floor', label: '切り捨て' },
        { value: 'round', label: '四捨五入' },
        { value: 'ceil', label: '切り上げ' },
      ],
      errors: {
        amount: '月額は0より大きい数値で入力してください。',
        days: '対象日数は0以上の整数で入力してください（暦日数基準ではその月の日数以下、それ以外は366以下）。',
        month: '対象月を選んでください。',
        date: '開始日と終了日を実在する日付で入力してください。',
        order: '開始日が終了日より後になっています。',
        range: '期間が長すぎます（最大3,660日、約10年）。',
      },
      daysResultLabel: '対象日数',
      dailyRateLabel: '1日あたりの金額',
      rawAmountLabel: '端数処理前の金額',
      formulaLabel: '計算式',
      formulaThirty: '月額 ÷ 30日 × {days}日',
      formulaYear365: '月額 × 12 ÷ 365日 × {days}日',
      segmentsHeading: '月ごとの内訳',
      segmentTemplate: '{year}年{month}月: {days}日 ÷ {dim}日',
      daysSuffix: '日',
      copyButton: '結果をコピー',
      copied: 'コピーしました',
      copyFailed: 'コピーに失敗しました',
      howToHeading: '使い方',
      howToSteps: [
        '「用途」を選び、「月額（円）」を入力します。',
        '「対象期間の指定方法」で、日数を直接入力するか、開始日・終了日を指定するかを選びます。',
        '「日割りの基準」と「端数処理」を契約や就業規則に合わせて選びます。',
        '日割額と計算の内訳が表示されます。「結果をコピー」で金額をコピーできます。',
      ],
      notesHeading: '注意事項',
      notes: [
        '日割りの基準や端数処理は契約書・賃貸借契約・就業規則・利用規約によって異なります。この結果は一般的な計算方法による目安で、請求額を保証するものではありません。',
        '開始日と終了日はどちらも1日として数えます（例: 1/16〜1/31は16日）。',
        '「その月の暦日数で割る」で複数月にまたがる場合は、月ごとに日数÷その月の日数を計算して合算し、端数処理は最後に1回だけ行います。',
        '年換算は月額×12÷365で1日あたりの金額を求めます。うるう年でも365日で割ります。',
        '給与の日割りには、会社ごとに所定労働日数や暦日数で割る方式があります。欠勤控除などは就業規則を確認してください。',
        '税・社会保険料は考慮しません。金額は日本円を想定していますが、小数点以下の通貨にも使えます。',
      ],
      glossaryHeading: '用語解説',
      glossaryTerms: [
        {
          term: '日割り',
          description:
            '月単位で決まっている金額を、利用した日数分だけに按分して計算する方法です。入居・退去・入社・退職・解約が月の途中のときに使われます。',
        },
        {
          term: '暦日数基準',
          description:
            'その月の実際の日数（28〜31日）で月額を割る方法です。月によって1日あたりの金額が変わります。',
        },
        {
          term: '30日基準',
          description:
            'どの月も30日として月額を割る方法です。賃貸の日割り家賃でよく使われ、月ごとの差が出ません。',
        },
        {
          term: '年換算',
          description:
            '月額を12倍して年額にし、365日で割って1日あたりの金額を求める方法です。1年を通じて1日あたりの金額が一定になります。',
        },
      ],
    },
    en: {
      title: 'Daily Proration Calculator: Rent, Salary, Subscription',
      description:
        'Prorate a monthly rent, salary or subscription by days or a date range. Pick calendar days, 30 days or 365-day basis and a rounding rule. Runs in your browser.',
      h1: 'Daily Proration Calculator for Rent, Salary and Subscriptions',
      introHtml:
        'Enter a monthly amount and either a number of days or a start and end date to get the prorated amount. It handles leap years and periods that cross month ends, and lets you choose the day-count basis (days in the month, 30 days, or annualized over 365 days) and how to round. For move-in costs in Japan, see the <a href="/en/tools/rent-initial-cost/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">Rental Initial Cost Calculator</a>; to count days between two dates, use the <a href="/en/tools/date-calculator/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">Date Calculator</a>.',
      numberLocale: 'en-US',
      sectionHeading: 'Proration settings',
      presetLabel: 'Use case',
      presets: [
        { value: 'rent', label: 'Rent', resultLabel: 'Prorated rent' },
        { value: 'salary', label: 'Salary', resultLabel: 'Prorated salary' },
        {
          value: 'subscription',
          label: 'Subscription',
          resultLabel: 'Prorated fee',
        },
      ],
      amountLabel: 'Monthly amount',
      modeLabel: 'Period input',
      modeDaysLabel: 'Enter days',
      modeRangeLabel: 'Pick start and end dates',
      monthLabel: 'Target month',
      daysLabel: 'Number of days',
      startLabel: 'Start date',
      endLabel: 'End date',
      basisLabel: 'Proration basis',
      basisOptions: [
        { value: 'calendar', label: 'Days in that calendar month' },
        { value: 'thirty', label: '30 days' },
        { value: 'year365', label: 'Annualized (monthly x 12 / 365)' },
      ],
      roundingLabel: 'Rounding',
      roundingOptions: [
        { value: 'floor', label: 'Round down' },
        { value: 'round', label: 'Round to nearest' },
        { value: 'ceil', label: 'Round up' },
      ],
      errors: {
        amount: 'Enter a monthly amount greater than 0.',
        days: 'Enter a whole number of days, 0 or more (at most the days in the month for the calendar basis, otherwise at most 366).',
        month: 'Choose the target month.',
        date: 'Enter a start and end date that actually exist.',
        order: 'The start date is after the end date.',
        range: 'The period is too long (up to 3,660 days, about 10 years).',
      },
      daysResultLabel: 'Days counted',
      dailyRateLabel: 'Amount per day',
      rawAmountLabel: 'Before rounding',
      formulaLabel: 'Formula',
      formulaThirty: 'Monthly / 30 days x {days} days',
      formulaYear365: 'Monthly x 12 / 365 days x {days} days',
      segmentsHeading: 'Breakdown by month',
      segmentTemplate: '{year}-{month}: {days} days / {dim} days',
      daysSuffix: ' days',
      copyButton: 'Copy result',
      copied: 'Copied',
      copyFailed: 'Copy failed',
      howToHeading: 'How to use',
      howToSteps: [
        'Choose a "Use case" and enter the "Monthly amount".',
        'In "Period input", choose whether to enter a number of days or pick start and end dates.',
        'Set the "Proration basis" and "Rounding" to match your contract or payroll rules.',
        'The prorated amount and its breakdown appear. Use "Copy result" to copy the amount.',
      ],
      notesHeading: 'Notes',
      notes: [
        'Proration bases and rounding differ by lease, employment contract and service terms. This result uses common methods as a guide and does not guarantee any billed amount.',
        'Both the start date and the end date count as full days (for example, Jan 16 to Jan 31 is 16 days).',
        'With the calendar basis, a period that spans several months is split by month (days / days in that month), summed, and rounded once at the end.',
        'The annualized basis uses monthly x 12 / 365 per day, and divides by 365 even in leap years.',
        'Payroll proration varies by employer: some divide by scheduled working days, others by calendar days. Check your employment rules for absence deductions.',
        'Taxes and social insurance are not included. Amounts are rounded to whole units, which suits yen; results for currencies with decimals are a rough guide.',
      ],
      glossaryHeading: 'Glossary',
      glossaryTerms: [
        {
          term: 'Proration',
          description:
            'Splitting a monthly amount so you pay or receive only for the days used. It applies when you move in or out, start or leave a job, or cancel partway through a month.',
        },
        {
          term: 'Calendar-day basis',
          description:
            'Dividing the monthly amount by the actual number of days in that month (28 to 31), so the daily amount changes from month to month.',
        },
        {
          term: '30-day basis',
          description:
            'Treating every month as 30 days. It is common for prorated rent in Japan and keeps the daily amount the same each month.',
        },
        {
          term: 'Annualized basis',
          description:
            'Multiplying the monthly amount by 12 and dividing by 365 to get a daily amount that stays constant all year.',
        },
      ],
    },
  };
