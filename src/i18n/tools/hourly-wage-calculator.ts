import type { Locale } from '../../data/tools';

interface GlossaryTerm {
  term: string;
  description: string;
}

interface OvertimeCategoryDefault {
  label: string;
  ratePercent: number;
}

export interface HourlyWageCalculatorPageContent {
  title: string;
  description: string;
  h1: string;
  introHtml: string;
  numberLocale: string;
  section1Heading: string;
  unitLegend: string;
  unitHourly: string;
  unitDaily: string;
  unitMonthly: string;
  unitAnnual: string;
  amountLabel: string;
  amountPlaceholder: string;
  hoursPerDayLabel: string;
  hoursPerDayPlaceholder: string;
  hoursUnit: string;
  daysPerMonthLabel: string;
  daysPerMonthPlaceholder: string;
  daysUnit: string;
  errorConversion: string;
  resultHourlyLabel: string;
  resultDailyLabel: string;
  resultMonthlyLabel: string;
  resultAnnualLabel: string;
  section2Heading: string;
  baseHourlyLabel: string;
  baseHourlyNote: string;
  overtimeCategoryDefaults: OvertimeCategoryDefault[];
  /** `{label}` を置換して使うテンプレート */
  ariaHoursTemplate: string;
  /** `{label}` を置換して使うテンプレート */
  ariaRateTemplate: string;
  columnCategory: string;
  columnHours: string;
  columnRate: string;
  columnPremiumPay: string;
  errorOvertime: string;
  totalPremiumLabel: string;
  totalPayLabel: string;
  notesHeading: string;
  notes: string[];
  glossaryHeading: string;
  glossaryTerms: GlossaryTerm[];
}

export const hourlyWageCalculatorContent: Record<
  Locale,
  HourlyWageCalculatorPageContent
> = {
  ja: {
    title: '時給・日給・月給換算＆残業代計算機',
    description:
      '時給を入力するだけで日給・月給・年収に自動換算し、時間外労働・法定休日労働・深夜労働の割増賃金（残業代）もまとめてシミュレーションできる無料ツールです。データはブラウザ内で処理され、サーバーには送信されません。',
    h1: '時給・日給・月給換算＆残業代計算機',
    introHtml:
      '時給・日給・月給・年収のいずれか1つを入力するだけで、残りをまとめて自動計算します。さらに、割増賃金（残業代）の区分ごとに労働時間と割増率を入力すれば、時間外労働・法定休日労働・深夜労働の割増賃金もシミュレーションできます。ブラウザ内で処理され、入力内容がサーバーに送信されることはありません。',
    numberLocale: 'ja-JP',
    section1Heading: '1. 給与換算',
    unitLegend: '給与形態',
    unitHourly: '時給',
    unitDaily: '日給',
    unitMonthly: '月給',
    unitAnnual: '年収',
    amountLabel: '金額（円）',
    amountPlaceholder: '1200',
    hoursPerDayLabel: '1日の労働時間',
    hoursPerDayPlaceholder: '8',
    hoursUnit: '時間',
    daysPerMonthLabel: '1ヶ月の労働日数',
    daysPerMonthPlaceholder: '20',
    daysUnit: '日',
    errorConversion:
      '計算できませんでした（金額・労働時間・労働日数はすべて0より大きい値を入力してください）',
    resultHourlyLabel: '時給',
    resultDailyLabel: '日給',
    resultMonthlyLabel: '月給',
    resultAnnualLabel: '年収',
    section2Heading: '2. 割増賃金（残業代）シミュレーター',
    baseHourlyLabel: '基礎時給（円）',
    baseHourlyNote:
      '上の「1. 給与換算」で時給が計算されると自動入力されます（編集可能）。',
    overtimeCategoryDefaults: [
      { label: '時間外労働（月60時間以内）', ratePercent: 25 },
      { label: '時間外労働（月60時間超過分）', ratePercent: 50 },
      { label: '法定休日労働', ratePercent: 35 },
      { label: '深夜労働（22時〜5時）', ratePercent: 25 },
    ],
    ariaHoursTemplate: '{label}の労働時間',
    ariaRateTemplate: '{label}の割増率',
    columnCategory: '区分',
    columnHours: '労働時間',
    columnRate: '割増率',
    columnPremiumPay: '割増賃金',
    errorOvertime:
      '計算できませんでした（基礎時給は0より大きく、労働時間・割増率は0以上の値を入力してください）',
    totalPremiumLabel: '割増分の合計',
    totalPayLabel: '基礎時給分を含めた合計支給額',
    notesHeading: '注意事項',
    notes: [
      '割増賃金の各区分は独立して計算しています。同じ時間帯が複数の区分（例: 時間外労働の時間帯がそのまま深夜労働にも該当する場合）に重複するときは、対象の時間を区分ごとに振り分けるか、該当する割増率を合算した区分として時間を入力してください。',
      '表示している割増率（25%・35%・50%）は労働基準法が定める最低ラインです。実際の支給額は会社の就業規則や雇用契約によって異なる場合があります。',
      '年収は月給を単純に12倍した金額で、賞与（ボーナス）や各種手当は含みません。',
      '本ツールは概算のシミュレーションであり、実際の給与計算・税務・労務手続きの根拠資料としては利用できません。',
    ],
    glossaryHeading: '用語解説',
    glossaryTerms: [
      {
        term: '割増賃金',
        description:
          '法定時間外労働・休日労働・深夜労働をした場合に、通常の賃金に上乗せして支払うことが労働基準法で義務付けられている賃金です。上乗せする割合（割増率）は労働の種類ごとに法律で最低ラインが定められており、会社の就業規則でそれ以上の率を定めることもできます。',
      },
      {
        term: '法定時間外労働と60時間ルール',
        description:
          '1日8時間・週40時間（法定労働時間）を超えた労働のことで、原則25%以上の割増賃金が必要です。さらに1ヶ月の時間外労働が60時間を超えた部分については50%以上の割増率になります。この60時間ルールは以前は大企業のみ適用でしたが、2023年4月から中小企業にも適用されています。',
      },
      {
        term: '法定休日労働',
        description:
          '労働基準法で「週に1日以上」与えることが義務付けられている休日（法定休日）に働いた場合の労働です。割増率は35%以上。会社独自の休日（法定外休日）の労働は、週の労働時間次第で時間外労働（25%以上）として扱われる場合があり、法定休日労働とは区別されます。',
      },
      {
        term: '深夜労働',
        description:
          '22時から翌5時までの間に行った労働です。割増率は25%以上で、時間外労働や休日労働と重なる時間帯はそれぞれの割増率を合算して計算します（例: 深夜の時間外労働は25%+25%=50%以上）。',
      },
    ],
  },
  en: {
    title: 'Hourly Wage Converter & Overtime Pay Calculator',
    description:
      'Convert an hourly wage to daily, monthly, and annual pay, and simulate overtime and late-night premium pay. Runs in your browser; nothing is sent to a server.',
    h1: 'Hourly Wage Converter & Overtime Pay Calculator',
    introHtml:
      'Enter just one of hourly, daily, monthly, or annual wage and the rest are calculated automatically. You can also enter hours and premium rates for each overtime pay category to simulate premium pay (overtime pay) for statutory overtime, statutory holiday work, and late-night work. Everything happens in your browser, and nothing you type is ever sent to a server.',
    numberLocale: 'en-US',
    section1Heading: '1. Wage conversion',
    unitLegend: 'Wage type',
    unitHourly: 'Hourly',
    unitDaily: 'Daily',
    unitMonthly: 'Monthly',
    unitAnnual: 'Annual',
    amountLabel: 'Amount (JPY)',
    amountPlaceholder: '1200',
    hoursPerDayLabel: 'Hours per day',
    hoursPerDayPlaceholder: '8',
    hoursUnit: 'hrs',
    daysPerMonthLabel: 'Days per month',
    daysPerMonthPlaceholder: '20',
    daysUnit: 'days',
    errorConversion:
      'Could not calculate (amount, hours per day, and days per month must all be greater than 0)',
    resultHourlyLabel: 'Hourly',
    resultDailyLabel: 'Daily',
    resultMonthlyLabel: 'Monthly',
    resultAnnualLabel: 'Annual',
    section2Heading: '2. Overtime (premium) pay simulator',
    baseHourlyLabel: 'Base hourly wage (JPY)',
    baseHourlyNote:
      'Automatically filled once the hourly wage above is calculated (you can still edit it).',
    overtimeCategoryDefaults: [
      { label: 'Overtime (up to 60 hrs/month)', ratePercent: 25 },
      { label: 'Overtime (over 60 hrs/month)', ratePercent: 50 },
      { label: 'Statutory holiday work', ratePercent: 35 },
      { label: 'Late-night work (10 PM-5 AM)', ratePercent: 25 },
    ],
    ariaHoursTemplate: '{label} hours',
    ariaRateTemplate: '{label} premium rate',
    columnCategory: 'Category',
    columnHours: 'Hours',
    columnRate: 'Premium rate',
    columnPremiumPay: 'Premium pay',
    errorOvertime:
      'Could not calculate (base hourly wage must be greater than 0, and hours/premium rates must be 0 or more)',
    totalPremiumLabel: 'Total premium pay',
    totalPayLabel: 'Total pay including base wage',
    notesHeading: 'Notes',
    notes: [
      'Each premium pay category is calculated independently. If the same hours fall into more than one category (for example, overtime hours that are also late-night hours), split the hours between categories or enter a combined premium rate for the overlapping hours yourself.',
      "The displayed premium rates (25% / 35% / 50%) are the statutory minimums under Japan's Labor Standards Act. Actual pay may differ depending on a company's work rules or employment contract.",
      'Annual wage is simply the monthly wage multiplied by 12, and does not include bonuses or allowances.',
      'This tool provides a rough simulation only and cannot be used as a basis for actual payroll, tax, or labor procedures.',
    ],
    glossaryHeading: 'Glossary',
    glossaryTerms: [
      {
        term: 'Premium pay (wariwashi chingin)',
        description:
          "Under Japan's Labor Standards Act, employers must pay a premium on top of the regular wage for statutory overtime, holiday work, and late-night work. The minimum premium rate is set by law for each category, though a company's work rules can set a higher rate.",
      },
      {
        term: 'Statutory overtime and the 60-hour rule',
        description:
          'Work beyond 8 hours a day or 40 hours a week (the statutory working hours) requires a premium of at least 25%. For the portion of monthly overtime that exceeds 60 hours, the premium rises to at least 50%. This 60-hour rule used to apply only to large companies, but has applied to small and medium-sized businesses as well since April 2023.',
      },
      {
        term: 'Statutory holiday work',
        description:
          "Work performed on a statutory holiday — at least one day off per week, guaranteed by law — requires a premium of at least 35%. Work on a company's own non-statutory days off is instead treated as overtime (at least 25%) depending on weekly hours, and is distinct from statutory holiday work.",
      },
      {
        term: 'Late-night work',
        description:
          'Work performed between 10 PM and 5 AM requires a premium of at least 25%. When late-night work overlaps with overtime or holiday work, the premium rates are added together (for example, late-night overtime is at least 25% + 25% = 50%).',
      },
    ],
  },
};
