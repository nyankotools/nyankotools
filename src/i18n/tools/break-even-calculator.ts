import type { Locale } from '../../data/tools';
import type { BreakEvenError } from '../../lib/tools/break-even-calculator';

interface GlossaryTerm {
  term: string;
  description: string;
}

export interface BreakEvenCalculatorPageContent {
  title: string;
  description: string;
  h1: string;
  introHtml: string;
  numberLocale: string;
  /** Intl.NumberFormat の通貨コード */
  currency: string;

  priceLabel: string;
  defaultPrice: number;
  variableCostLabel: string;
  defaultVariableCost: number;
  fixedCostLabel: string;
  defaultFixedCost: number;
  targetProfitLabel: string;
  defaultTargetProfit: number;
  expectedUnitsLabel: string;
  expectedUnitsHint: string;

  errors: Record<BreakEvenError, string>;

  resultHeading: string;
  labelContribution: string;
  labelContributionRatio: string;
  labelBreakEvenUnits: string;
  labelBreakEvenSales: string;
  labelTargetUnits: string;
  labelTargetSales: string;
  labelExpectedProfit: string;
  labelMarginOfSafety: string;
  unitsSuffix: string;
  copyButton: string;
  copied: string;
  copyFailed: string;

  notesHeading: string;
  notes: string[];
  glossaryHeading: string;
  glossaryTerms: GlossaryTerm[];
}

export const breakEvenCalculatorContent: Record<
  Locale,
  BreakEvenCalculatorPageContent
> = {
  ja: {
    title: '損益分岐点計算機（販売数量・売上高・目標利益の達成ライン）',
    description:
      '販売単価・変動費・固定費から損益分岐点の販売数量と売上高を計算します。目標利益を達成するのに必要な数量・売上高や、安全余裕率も算出できます。データはブラウザ内で処理され、サーバーには送信されません。',
    h1: '損益分岐点計算機（損益分岐点売上高・販売数量を算出）',
    introHtml:
      '販売単価・1個あたりの変動費・固定費を入力すると、赤字と黒字の境目になる損益分岐点の販売数量と売上高を計算します。目標利益を入力すれば、それを達成するために必要な数量・売上高も分かり、予想販売数量を入れると利益と安全余裕率も確認できます。計算はブラウザ内で行われ、入力内容がサーバーに送信されることはありません。割合の計算は <a href="/tools/ratio-calculator/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">比率計算機</a>、税込・税抜の計算は <a href="/tools/tax-calculator/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">消費税計算機</a> もご利用ください。',
    numberLocale: 'ja-JP',
    currency: 'JPY',

    priceLabel: '販売単価（円）',
    defaultPrice: 1000,
    variableCostLabel: '1個あたりの変動費（円）',
    defaultVariableCost: 400,
    fixedCostLabel: '固定費の合計（円）',
    defaultFixedCost: 300000,
    targetProfitLabel: '目標利益（円・任意）',
    defaultTargetProfit: 100000,
    expectedUnitsLabel: '予想販売数量（個・任意）',
    expectedUnitsHint: '入力すると、その数量での利益と安全余裕率を表示します。',

    errors: {
      invalidPrice: '販売単価には0より大きい数値を入力してください',
      invalidVariableCost: '変動費には0以上の数値を入力してください',
      invalidFixedCost: '固定費には0以上の数値を入力してください',
      invalidTargetProfit: '目標利益には0以上の数値を入力してください',
      invalidExpectedUnits: '予想販売数量には0以上の数値を入力してください',
      noContribution:
        '変動費が販売単価以上のため、販売しても固定費を回収できず損益分岐点は存在しません',
    },

    resultHeading: '計算結果',
    labelContribution: '1個あたりの限界利益',
    labelContributionRatio: '限界利益率',
    labelBreakEvenUnits: '損益分岐点の販売数量',
    labelBreakEvenSales: '損益分岐点売上高',
    labelTargetUnits: '目標利益に必要な販売数量',
    labelTargetSales: '目標利益に必要な売上高',
    labelExpectedProfit: '予想販売数量での利益',
    labelMarginOfSafety: '安全余裕率',
    unitsSuffix: '個',
    copyButton: '結果をコピー',
    copied: 'コピーしました',
    copyFailed: 'コピーに失敗しました',

    notesHeading: '注意事項',
    notes: [
      '販売数量は端数を切り上げた整数で表示します（例: 500.2個なら501個）。売上高は切り上げ前の数量ではなく、固定費÷限界利益率で計算しています。',
      '販売単価や変動費が数量によって変わる場合（割引・仕入れ値の変動など）や、固定費が売上に応じて増える場合は、そのまま使えません。平均的な値で試算してください。',
      '変動費と固定費の区分は事業によって異なります。人件費や広告費をどちらに入れるかで結果が変わるため、自社の実態に合わせて分類してください。',
    ],
    glossaryHeading: '用語解説',
    glossaryTerms: [
      {
        term: '損益分岐点',
        description:
          '売上と費用が等しく、利益がちょうど0円になる販売数量や売上高のことです。これを超えると黒字、下回ると赤字になります。',
      },
      {
        term: '変動費・固定費',
        description:
          '変動費は仕入れ・材料費・配送料など販売数量に比例して増える費用、固定費は家賃・人件費・減価償却費など販売数量に関係なくかかる費用です。',
      },
      {
        term: '限界利益',
        description:
          '販売単価から変動費を引いた、1個売るごとに固定費の回収と利益に回せる金額です。限界利益率は限界利益を販売単価で割った割合です。',
      },
      {
        term: '安全余裕率',
        description:
          '実際の（または予想の）売上が損益分岐点売上高をどれだけ上回っているかを示す割合です。高いほど、売上が落ちても赤字になりにくいことを表します。',
      },
    ],
  },
  en: {
    title: 'Break-Even Calculator (Units, Sales & Target Profit)',
    description:
      'Find break-even units and sales from price, variable cost, and fixed costs, plus target-profit volume and margin of safety. Runs in your browser.',
    h1: 'Break-Even Point Calculator: Units and Sales to Cover Your Costs',
    introHtml:
      'Enter the selling price, the variable cost per unit, and your total fixed costs to see how many units, and how much in sales, you need to break even. Add a target profit to see the volume required to reach it, and an expected sales volume to see your profit and margin of safety. Everything is calculated in your browser, and nothing you type is sent to a server. For percentages, try the <a href="/en/tools/ratio-calculator/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">Ratio Calculator</a>; for sales tax, try the <a href="/en/tools/tax-calculator/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">Tax Calculator</a>.',
    numberLocale: 'en-US',
    currency: 'USD',

    priceLabel: 'Selling price per unit',
    defaultPrice: 25,
    variableCostLabel: 'Variable cost per unit',
    defaultVariableCost: 10,
    fixedCostLabel: 'Total fixed costs',
    defaultFixedCost: 6000,
    targetProfitLabel: 'Target profit (optional)',
    defaultTargetProfit: 3000,
    expectedUnitsLabel: 'Expected units sold (optional)',
    expectedUnitsHint:
      'Enter a number to see the profit and margin of safety at that volume.',

    errors: {
      invalidPrice: 'The selling price must be greater than 0',
      invalidVariableCost: 'Variable cost must be 0 or more',
      invalidFixedCost: 'Fixed costs must be 0 or more',
      invalidTargetProfit: 'Target profit must be 0 or more',
      invalidExpectedUnits: 'Expected units must be 0 or more',
      noContribution:
        'Variable cost is not below the selling price, so each sale cannot cover fixed costs and there is no break-even point',
    },

    resultHeading: 'Results',
    labelContribution: 'Contribution margin per unit',
    labelContributionRatio: 'Contribution margin ratio',
    labelBreakEvenUnits: 'Break-even units',
    labelBreakEvenSales: 'Break-even sales',
    labelTargetUnits: 'Units needed for target profit',
    labelTargetSales: 'Sales needed for target profit',
    labelExpectedProfit: 'Profit at expected units',
    labelMarginOfSafety: 'Margin of safety',
    unitsSuffix: ' units',
    copyButton: 'Copy results',
    copied: 'Copied',
    copyFailed: 'Copy failed',

    notesHeading: 'Notes',
    notes: [
      'Unit counts are rounded up to a whole number (for example, 500.2 becomes 501). Break-even sales are fixed costs divided by the contribution margin ratio, not the rounded unit count times the price.',
      'This does not fit cases where price or variable cost changes with volume (discounts, supplier tiers) or where fixed costs step up as sales grow. Use average figures.',
      'What counts as fixed or variable differs by business. Whether labor or advertising goes in one group or the other changes the result, so classify costs to match your situation.',
    ],
    glossaryHeading: 'Glossary',
    glossaryTerms: [
      {
        term: 'Break-even point',
        description:
          'The sales volume or revenue at which total revenue equals total cost and profit is exactly zero. Above it you make a profit; below it you lose money.',
      },
      {
        term: 'Variable and fixed costs',
        description:
          'Variable costs, like materials and shipping, rise with each unit sold. Fixed costs, like rent and salaries, stay the same regardless of volume.',
      },
      {
        term: 'Contribution margin',
        description:
          'Selling price minus variable cost: the amount each sale contributes toward fixed costs and profit. The ratio divides it by the selling price.',
      },
      {
        term: 'Margin of safety',
        description:
          'How far actual or expected sales are above break-even sales, as a share of sales. The higher it is, the more sales can fall before you lose money.',
      },
    ],
  },
};
