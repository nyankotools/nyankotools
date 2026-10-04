import type { Locale } from '../../data/tools';
import type { ElectricityCostError } from '../../lib/tools/electricity-cost-calculator';

interface GlossaryTerm {
  term: string;
  description: string;
}

interface AppliancePreset {
  label: string;
  watts: number;
}

export interface ElectricityCostCalculatorPageContent {
  title: string;
  description: string;
  h1: string;
  introHtml: string;
  numberLocale: string;
  /** Intl.NumberFormat の通貨コード */
  currency: string;

  presetLabel: string;
  presetPlaceholder: string;
  presets: AppliancePreset[];
  wattsLabel: string;
  defaultWatts: number;
  quantityLabel: string;
  hoursLabel: string;
  defaultHours: number;
  daysLabel: string;
  defaultDays: number;
  priceLabel: string;
  defaultPrice: number;
  priceHint: string;

  errors: Record<ElectricityCostError, string>;

  resultHeading: string;
  periodHeader: string;
  kwhHeader: string;
  costHeader: string;
  periodHour: string;
  periodDay: string;
  periodMonth: string;
  periodYear: string;
  copyButton: string;
  copied: string;
  copyFailed: string;
  /** コピー用のテキスト。{watts} {hours} {month} {year} を置き換える */
  copyTemplate: string;

  notesHeading: string;
  notes: string[];
  glossaryHeading: string;
  glossaryTerms: GlossaryTerm[];
}

export const electricityCostCalculatorContent: Record<
  Locale,
  ElectricityCostCalculatorPageContent
> = {
  ja: {
    title: '電気代計算機（消費電力・使用時間から1日・1か月・1年の電気代）',
    description:
      '家電の消費電力（W）・使用時間・電気料金の単価（円/kWh）から、1時間・1日・1か月・1年あたりの電気代を計算します。エアコンやPCなどの目安ワット数から選べます。データはブラウザ内で処理され、サーバーには送信されません。',
    h1: '電気代計算機（消費電力から1か月・1年の電気代を試算）',
    introHtml:
      '家電の消費電力（W）と1日の使用時間、電気料金の単価（円/kWh）を入力すると、1時間・1日・1か月・1年あたりの電力量（kWh）と電気代を計算します。エアコン・冷蔵庫・PCなどの目安ワット数から選ぶこともでき、台数や1か月の使用日数も指定できます。計算はブラウザ内で行われ、入力内容がサーバーに送信されることはありません。単位の換算は <a href="/tools/unit-converter/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">単位変換</a>、税込・税抜の計算は <a href="/tools/tax-calculator/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">消費税計算機</a> もご利用ください。',
    numberLocale: 'ja-JP',
    currency: 'JPY',

    presetLabel: '家電の目安から選ぶ（任意）',
    presetPlaceholder: '選択して消費電力を入力',
    presets: [
      { label: 'エアコン（冷房・6畳目安）', watts: 500 },
      { label: 'エアコン（暖房・6畳目安）', watts: 700 },
      { label: '冷蔵庫（400L前後・年間平均）', watts: 40 },
      { label: 'テレビ（43型前後）', watts: 100 },
      { label: 'ノートパソコン', watts: 50 },
      { label: 'デスクトップPC', watts: 200 },
      { label: 'ゲーミングPC（高負荷時）', watts: 400 },
      { label: '電子レンジ', watts: 1000 },
      { label: 'ドライヤー', watts: 1200 },
      { label: '電気ケトル', watts: 1200 },
      { label: 'LED電球', watts: 10 },
    ],
    wattsLabel: '消費電力（W）',
    defaultWatts: 500,
    quantityLabel: '台数',
    hoursLabel: '1日の使用時間（時間）',
    defaultHours: 8,
    daysLabel: '1か月の使用日数',
    defaultDays: 30,
    priceLabel: '電気料金の単価（円/kWh）',
    defaultPrice: 31,
    priceHint:
      '単価は電力会社の検針票や契約プランで確認できます。家庭向けの目安は30円/kWh前後です（燃料費調整額・再エネ賦課金を含む実質単価）。',

    errors: {
      invalidWatts:
        '消費電力には0より大きい数値（100万W以下）を入力してください',
      invalidHours: '1日の使用時間は0〜24の数値で入力してください',
      invalidDays: '1か月の使用日数は1〜31の整数で入力してください',
      invalidPrice: '電気料金の単価には0以上の数値を入力してください',
      invalidQuantity: '台数は1〜1000の整数で入力してください',
    },

    resultHeading: '電気代の目安',
    periodHeader: '期間',
    kwhHeader: '電力量（kWh）',
    costHeader: '電気代',
    periodHour: '1時間',
    periodDay: '1日',
    periodMonth: '1か月',
    periodYear: '1年',
    copyButton: '結果をコピー',
    copied: 'コピーしました',
    copyFailed: 'コピーに失敗しました',
    copyTemplate: '{watts}W を1日{hours}時間使用: 1か月 {month} / 1年 {year}',

    notesHeading: '注意事項',
    notes: [
      '消費電力はカタログ値や定格値の目安です。エアコンや冷蔵庫など運転状況で消費電力が変わる家電は、実際の電気代と差が出ます。',
      '待機電力や基本料金は含まれていません。電気代の単価は、燃料費調整額や再エネ賦課金を含めた実質単価を入力すると実際の請求額に近づきます。',
      '1年の電気代は「1か月の電気代×12」で計算しています。季節によって使用状況が変わる家電は、使用日数と時間を調整して試算してください。',
    ],
    glossaryHeading: '用語解説',
    glossaryTerms: [
      {
        term: '消費電力（W）',
        description:
          '家電が1秒あたりに使う電力の大きさです。本体のラベルや取扱説明書に記載されています。1,000Wは1kWです。',
      },
      {
        term: '電力量（kWh）',
        description:
          '消費電力に使用時間を掛けた、使った電気の量です。1,000Wの家電を1時間使うと1kWhで、電気代は「電力量×単価」で決まります。',
      },
      {
        term: '燃料費調整額・再エネ賦課金',
        description:
          '電気料金に上乗せされる項目です。燃料価格の変動や再生可能エネルギーの買取費用に応じて、使用量あたりの金額が加算・減算されます。',
      },
    ],
  },
  en: {
    title: 'Electricity Cost Calculator (Watts to Monthly Cost)',
    description:
      'Estimate appliance running cost per hour, day, month, and year from watts, hours, and your kWh rate. Runs in your browser; nothing is sent.',
    h1: 'Electricity Cost Calculator: Appliance Running Cost per Month and Year',
    introHtml:
      'Enter an appliance’s power draw in watts, how many hours a day you use it, and your electricity rate per kWh to see the energy used and the cost per hour, day, month, and year. Pick a typical wattage for an air conditioner, fridge, or PC if you do not know yours, and set the number of units and days of use per month. Everything is calculated in your browser, and nothing you type is sent to a server. For unit math, try the <a href="/en/tools/unit-converter/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">Unit Converter</a>; for sales tax, try the <a href="/en/tools/tax-calculator/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">Tax Calculator</a>.',
    numberLocale: 'en-US',
    currency: 'USD',

    presetLabel: 'Pick a typical appliance (optional)',
    presetPlaceholder: 'Choose to fill in the wattage',
    presets: [
      { label: 'Air conditioner (cooling, small room)', watts: 500 },
      { label: 'Space heater', watts: 1500 },
      { label: 'Refrigerator (yearly average)', watts: 40 },
      { label: 'TV (about 43 in.)', watts: 100 },
      { label: 'Laptop', watts: 50 },
      { label: 'Desktop PC', watts: 200 },
      { label: 'Gaming PC (under load)', watts: 400 },
      { label: 'Microwave', watts: 1000 },
      { label: 'Hair dryer', watts: 1200 },
      { label: 'Electric kettle', watts: 1200 },
      { label: 'LED bulb', watts: 10 },
    ],
    wattsLabel: 'Power (watts)',
    defaultWatts: 500,
    quantityLabel: 'Units',
    hoursLabel: 'Hours of use per day',
    defaultHours: 8,
    daysLabel: 'Days of use per month',
    defaultDays: 30,
    priceLabel: 'Electricity rate (per kWh)',
    defaultPrice: 0.17,
    priceHint:
      'Find your rate on your utility bill. Use the total rate including delivery and fees for the closest result. The US average is roughly 0.17 USD per kWh.',

    errors: {
      invalidWatts: 'Enter a power value greater than 0 (up to 1,000,000 W)',
      invalidHours: 'Hours per day must be a number from 0 to 24',
      invalidDays: 'Days per month must be a whole number from 1 to 31',
      invalidPrice: 'The electricity rate must be 0 or more',
      invalidQuantity: 'Units must be a whole number from 1 to 1000',
    },

    resultHeading: 'Estimated running cost',
    periodHeader: 'Period',
    kwhHeader: 'Energy (kWh)',
    costHeader: 'Cost',
    periodHour: 'Per hour',
    periodDay: 'Per day',
    periodMonth: 'Per month',
    periodYear: 'Per year',
    copyButton: 'Copy result',
    copied: 'Copied',
    copyFailed: 'Copy failed',
    copyTemplate:
      '{watts} W for {hours} h/day: {month} per month / {year} per year',

    notesHeading: 'Notes',
    notes: [
      'Wattage is a nameplate or typical figure. Appliances such as air conditioners and refrigerators vary their draw while running, so the real bill will differ.',
      'Standby power and fixed monthly charges are not included. Enter an all-in rate (with delivery charges and fees) to get closer to your actual bill.',
      'The yearly cost is the monthly cost times 12. For appliances you use seasonally, adjust the days and hours to match.',
    ],
    glossaryHeading: 'Glossary',
    glossaryTerms: [
      {
        term: 'Watt (W)',
        description:
          'How much power an appliance draws at a given moment. It is printed on the label or in the manual. 1,000 W equals 1 kW.',
      },
      {
        term: 'Kilowatt-hour (kWh)',
        description:
          'The amount of energy used: power multiplied by time. A 1,000 W appliance running for one hour uses 1 kWh, and the cost is kWh times your rate.',
      },
      {
        term: 'Electricity rate',
        description:
          'The price you pay per kWh. Many bills split it into energy, delivery, and fee charges; adding them together gives the effective rate.',
      },
    ],
  },
};
