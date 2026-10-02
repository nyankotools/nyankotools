import type { Locale } from '../../data/tools';
import type {
  RoundingMode,
  SplitBillError,
} from '../../lib/tools/split-bill-calculator';

interface GlossaryTerm {
  term: string;
  description: string;
}

export interface SplitBillCalculatorPageContent {
  title: string;
  description: string;
  h1: string;
  introHtml: string;
  numberLocale: string;
  /** Intl.NumberFormat の通貨コード */
  currency: string;

  totalLabel: string;
  totalPlaceholder: string;
  peopleLabel: string;
  peoplePlaceholder: string;
  roundingUnitLabel: string;
  roundingUnits: number[];
  defaultRoundingUnit: number;
  roundingModeLabel: string;
  roundingModes: Record<RoundingMode, string>;
  higherLegend: string;
  higherCountLabel: string;
  higherRatioLabel: string;
  higherHint: string;

  errors: Record<SplitBillError, string>;

  perPersonLabel: string;
  /** {count} を人数に置き換える */
  groupHigherLabel: string;
  groupRegularLabel: string;
  groupAllLabel: string;
  collectedLabel: string;
  differenceLabel: string;
  surplusText: string;
  shortageText: string;
  noDifferenceText: string;
  copyButton: string;
  copied: string;
  copyFailed: string;
  /** コピー用のテキスト。{each} {people} {collected} を置き換える */
  copyTemplate: string;

  notesHeading: string;
  notes: string[];
  glossaryHeading: string;
  glossaryTerms: GlossaryTerm[];
}

export const splitBillCalculatorContent: Record<
  Locale,
  SplitBillCalculatorPageContent
> = {
  ja: {
    title: '割り勘計算機（端数・多めに払う人にも対応）',
    description:
      '合計金額と人数から1人あたりの金額を計算する割り勘ツールです。100円単位などの端数処理（切り上げ・切り捨て・四捨五入）や、上司・幹事が多めに払う傾斜割り勘にも対応。データはブラウザ内で処理され、サーバーには送信されません。',
    h1: '割り勘計算機（端数処理・傾斜割り勘つき）',
    introHtml:
      '飲み会や旅行の合計金額と人数を入力すると、1人あたりの金額を計算します。100円単位・500円単位などの端数処理（切り上げ・切り捨て・四捨五入）を選べるため、集金しやすい金額にそろえられます。丸めたことで生じる「余り」や「不足」も表示します。上司や幹事など一部の人が多めに払う傾斜割り勘にも対応しています。ブラウザ内で計算され、入力内容がサーバーに送信されることはありません。税込・税抜の金額計算は <a href="/tools/tax-calculator/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">消費税計算機</a>、比率の計算は <a href="/tools/ratio-calculator/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">比率計算機</a> もご利用ください。',
    numberLocale: 'ja-JP',
    currency: 'JPY',

    totalLabel: '合計金額',
    totalPlaceholder: '12000',
    peopleLabel: '人数',
    peoplePlaceholder: '5',
    roundingUnitLabel: '端数の丸め単位',
    roundingUnits: [1, 10, 100, 500, 1000],
    defaultRoundingUnit: 100,
    roundingModeLabel: '丸め方',
    roundingModes: {
      up: '切り上げ（不足しない）',
      down: '切り捨て',
      nearest: '四捨五入',
    },
    higherLegend: '多めに払う人がいる（傾斜割り勘）',
    higherCountLabel: '多めに払う人数',
    higherRatioLabel: '負担の倍率',
    higherHint:
      '例: 上司2人が1.5倍払うなら、人数2・倍率1.5。0人なら均等割りになります。',

    errors: {
      invalidTotal: '合計金額には0より大きい数値を入力してください',
      invalidPeople: '人数は1〜1000の整数で入力してください',
      invalidHigherCount:
        '多めに払う人数は、0以上かつ全体の人数以下の整数で入力してください',
      invalidRatio: '負担の倍率には0より大きい数値を入力してください',
      invalidUnit: '丸め単位が正しくありません',
    },

    perPersonLabel: '1人あたりの金額',
    groupHigherLabel: '多めに払う人（{count}人）',
    groupRegularLabel: 'ほかの人（{count}人）',
    groupAllLabel: '全員（{count}人）',
    collectedLabel: '集まる金額の合計',
    differenceLabel: '合計金額との差',
    surplusText: '{amount}の余り（幹事の手元に残ります）',
    shortageText: '{amount}の不足（幹事が立て替えます）',
    noDifferenceText: 'ぴったりです',
    copyButton: '結果をコピー',
    copied: 'コピーしました',
    copyFailed: 'コピーに失敗しました',
    copyTemplate: '1人 {each}（{people}人・合計 {collected}）',

    notesHeading: '注意事項',
    notes: [
      '「切り上げ」を選ぶと集まる金額が合計以上になり、差額は余りとして表示されます。「切り捨て」「四捨五入」では不足が出ることがあります。',
      '多めに払う人の金額は、倍率を掛けた重みで按分してから丸めています。全員が多めに払う設定にした場合は、均等割りと同じ結果になります。',
      '人数は1〜1000人まで、金額は日本円を前提に表示しています（ほかの通貨でも数値としては計算できます）。',
    ],
    glossaryHeading: '用語解説',
    glossaryTerms: [
      {
        term: '傾斜割り勘',
        description:
          '全員が同額を払うのではなく、役職や飲食量などに応じて負担額に差をつける割り勘の方法です。ここでは「多めに払う人」の人数と倍率を指定して、重みづけで按分します。',
      },
      {
        term: '端数処理（切り上げ・切り捨て・四捨五入）',
        description:
          '1人あたりの金額が割り切れないときに、100円単位などへ丸める処理です。切り上げは幹事が損をしにくく、切り捨てはキリのよい金額にそろいますが不足が出る点が違います。',
      },
    ],
  },
  en: {
    title: 'Split Bill Calculator (with Rounding & Uneven Splits)',
    description:
      'Split a bill by total and headcount, with rounding and an option for some people to pay more. Runs in your browser; nothing is sent to a server.',
    h1: 'Split Bill Calculator with Rounding and Uneven Shares',
    introHtml:
      'Enter the total and the number of people to see what each person owes. You can round each share up, down, or to the nearest 0.01, 0.1, 1, 5, or 10, so collecting the money is easy, and the leftover or shortfall from rounding is shown. If some people should pay more (for example a boss covering 1.5 times the share), set how many pay extra and by what multiple. Everything is calculated in your browser, and nothing you type is sent to a server. For sales tax, try the <a href="/en/tools/tax-calculator/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">Tax Calculator</a>; for proportions, try the <a href="/en/tools/ratio-calculator/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">Ratio Calculator</a>.',
    numberLocale: 'en-US',
    currency: 'USD',

    totalLabel: 'Total amount',
    totalPlaceholder: '120',
    peopleLabel: 'Number of people',
    peoplePlaceholder: '5',
    roundingUnitLabel: 'Round to',
    roundingUnits: [0.01, 0.1, 1, 5, 10],
    defaultRoundingUnit: 0.01,
    roundingModeLabel: 'Rounding',
    roundingModes: {
      up: 'Round up (never short)',
      down: 'Round down',
      nearest: 'Round to nearest',
    },
    higherLegend: 'Some people pay more (uneven split)',
    higherCountLabel: 'People paying more',
    higherRatioLabel: 'Share multiplier',
    higherHint:
      'Example: two bosses paying 1.5 times the share means 2 people at 1.5. Leave it at 0 for an even split.',

    errors: {
      invalidTotal: 'Enter a total amount greater than 0',
      invalidPeople: 'Enter a whole number of people from 1 to 1000',
      invalidHigherCount:
        'People paying more must be a whole number from 0 up to the total number of people',
      invalidRatio: 'The multiplier must be greater than 0',
      invalidUnit: 'Invalid rounding unit',
    },

    perPersonLabel: 'Amount per person',
    groupHigherLabel: 'Paying more ({count})',
    groupRegularLabel: 'Everyone else ({count})',
    groupAllLabel: 'Everyone ({count})',
    collectedLabel: 'Total collected',
    differenceLabel: 'Difference from the total',
    surplusText: '{amount} extra (left with the organizer)',
    shortageText: '{amount} short (covered by the organizer)',
    noDifferenceText: 'Exact',
    copyButton: 'Copy result',
    copied: 'Copied',
    copyFailed: 'Copy failed',
    copyTemplate: '{each} each ({people} people, {collected} total)',

    notesHeading: 'Notes',
    notes: [
      'Rounding up collects at least the total, and the difference is shown as extra. Rounding down or to the nearest can leave you short.',
      'People paying more are weighted by the multiplier before rounding. If everyone is set to pay more, the result is the same as an even split.',
      'The number of people can be 1 to 1000. Amounts are shown in US dollars, but the math works for any currency.',
    ],
    glossaryHeading: 'Glossary',
    glossaryTerms: [
      {
        term: 'Uneven (weighted) split',
        description:
          'A way of splitting a bill where people pay different amounts, for example by seniority or what they ordered. Here you set how many people pay extra and by what multiple, and the total is divided by those weights.',
      },
      {
        term: 'Rounding up, down, and to the nearest',
        description:
          "Used when the per-person amount doesn't divide evenly. Rounding up never leaves the organizer short, while rounding down gives tidy amounts but can leave a shortfall.",
      },
    ],
  },
};
