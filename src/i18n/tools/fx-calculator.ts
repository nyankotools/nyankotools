import type { Locale } from '../../data/tools';

interface GlossaryTerm {
  term: string;
  description: string;
}

export interface FxCalculatorPageContent {
  title: string;
  description: string;
  h1: string;
  introHtml: string;
  numberLocale: string;
  disclaimer: string;
  sectionHeading: string;
  pairLabel: string;
  lotsLabel: string;
  lotSizeLabel: string;
  lotSize100k: string;
  lotSize10k: string;
  leverageLabel: string;
  leverageHint: string;
  directionLabel: string;
  directionBuy: string;
  directionSell: string;
  entryLabel: string;
  exitLabel: string;
  /** {quote} をクォート通貨コードに置き換える */
  quoteRateLabel: string;
  quoteRateHint: string;
  errorUnits: string;
  errorLeverage: string;
  errorEntry: string;
  errorExit: string;
  errorQuoteRate: string;
  resultHeading: string;
  unitsLabel: string;
  pipsLabel: string;
  profitJpyLabel: string;
  /** {quote} をクォート通貨コードに置き換える */
  profitQuoteLabel: string;
  pipValueLabel: string;
  marginLabel: string;
  notionalLabel: string;
  unitsSuffix: string;
  pipsSuffix: string;
  yenSuffix: string;
  notesHeading: string;
  notes: string[];
  glossaryHeading: string;
  glossaryTerms: GlossaryTerm[];
}

export const fxCalculatorContent: Record<Locale, FxCalculatorPageContent> = {
  ja: {
    title: 'FX計算機｜pips・ロット・必要証拠金・損益を計算',
    description:
      '通貨ペア・ロット・レバレッジ・売買方向・エントリー/決済レートから、損益（pips・円）と必要証拠金を計算。クロス円以外にも対応。データはブラウザ内で処理され、サーバーには送信されません。',
    h1: 'FX計算機（pips・ロット・必要証拠金・損益を計算）',
    introHtml:
      '通貨ペア、ロット、レバレッジ、売買方向、エントリーレートと決済レートを入力すると、損益（pips・円）、1pipあたりの金額、必要証拠金を計算します。ドル円などの円ペアはそのまま、EUR/USDなど円ペア以外はクォート通貨の円レートを手入力して円に換算します。レートは自分で入力する方式で、外部のレート配信は使いません。複利での資産の増え方は <a href="/tools/investment-simulator/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">資産運用シミュレーション</a> で確認できます。',
    numberLocale: 'ja-JP',
    disclaimer:
      'このツールは計算の補助であり、投資助言や売買の推奨ではありません。スプレッド・スワップポイント・手数料・ロスカットは含みません。実際の損益や必要証拠金は、利用する会社の約定・証拠金ルールで異なります。',
    sectionHeading: '取引条件',
    pairLabel: '通貨ペア',
    lotsLabel: '取引量（ロット）',
    lotSizeLabel: '1ロットの通貨数',
    lotSize100k: '10万通貨',
    lotSize10k: '1万通貨',
    leverageLabel: 'レバレッジ（倍）',
    leverageHint: '国内の個人口座は最大25倍が上限です。',
    directionLabel: '売買方向',
    directionBuy: '買い（ロング）',
    directionSell: '売り（ショート）',
    entryLabel: 'エントリーレート',
    exitLabel: '決済レート',
    quoteRateLabel: '{quote}/円レート（1{quote}あたりの円）',
    quoteRateHint:
      '円ペア以外は、損益と証拠金を円に換算するためのレートを入力します。たとえばEUR/USDなら、ドル円のレートです。',
    errorUnits:
      '取引量は0より大きい数にしてください（1通貨未満になる値は計算できません）',
    errorLeverage: 'レバレッジは0より大きい数にしてください',
    errorEntry: 'エントリーレートは0より大きい数値で入力してください',
    errorExit: '決済レートは0より大きい数値で入力してください',
    errorQuoteRate: 'クォート通貨の円レートを0より大きい数値で入力してください',
    resultHeading: '計算結果',
    unitsLabel: '取引通貨数',
    pipsLabel: '損益（pips）',
    profitJpyLabel: '損益（円）',
    profitQuoteLabel: '損益（{quote}）',
    pipValueLabel: '1pipあたりの金額',
    marginLabel: '必要証拠金',
    notionalLabel: '建玉の評価額',
    unitsSuffix: '通貨',
    pipsSuffix: 'pips',
    yenSuffix: '円',
    notesHeading: '注意事項',
    notes: [
      'スプレッド、スワップポイント、取引手数料、ロスカットは計算に含みません。実際の損益はこれらの分だけ変わります。',
      '1pipは、円ペアで0.01円、それ以外で0.0001です。表示のpipsは0.1pip（1/10 pip）単位まで扱います。',
      '必要証拠金は「取引通貨数 × エントリーレート ÷ レバレッジ」を円に換算し、1円未満を切り上げた目安です。会社によっては、証拠金の計算に別の基準レートを使います。',
      '円ペア以外は、損益と証拠金の円換算に、入力したクォート通貨/円レートを1つだけ使います。実際には決済時と約定時でレートが違うため、結果は目安です。',
      '損益（円）は1円未満を四捨五入しています。レートは手入力で、リアルタイムの相場は取得しません。',
    ],
    glossaryHeading: '用語解説',
    glossaryTerms: [
      {
        term: 'pips（ピップス）',
        description:
          '為替レートの変動幅の単位です。円ペアは0.01円、ユーロドルなどは0.0001が1pipです。',
      },
      {
        term: 'ロット',
        description:
          '取引量の単位です。1ロットは10万通貨の会社が多く、1万通貨や1000通貨の会社もあります。',
      },
      {
        term: 'レバレッジ',
        description:
          '証拠金の何倍の取引ができるかを表す倍率です。25倍なら、取引額の4%の証拠金が必要です。',
      },
      {
        term: '必要証拠金',
        description:
          '取引を始めるときに口座へ預けておく必要がある担保金です。取引額をレバレッジで割って求めます。',
      },
      {
        term: 'クォート通貨',
        description:
          '通貨ペアの右側の通貨です。USD/JPYならJPYで、為替レートはクォート通貨で表されます。',
      },
    ],
  },
  en: {
    title: 'FX Calculator: Pips, Lot Size, Margin and Profit',
    description:
      'Calculate forex profit in pips and yen plus required margin from the pair, lots, leverage, direction, entry and exit rate. Runs in your browser.',
    h1: 'FX Calculator for Pips, Lot Size, Margin and Profit/Loss',
    introHtml:
      'Enter the currency pair, lots, leverage, direction, entry rate and exit rate to get the profit or loss in pips and yen, the value of one pip and the required margin. Yen pairs such as USD/JPY work as they are; for other pairs such as EUR/USD, type in the yen rate of the quote currency so the result can be converted into yen. All rates are typed by hand and no live feed is used. To project how savings grow over time, try the <a href="/en/tools/investment-simulator/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">Investment Growth Simulator</a>.',
    numberLocale: 'en-US',
    disclaimer:
      "This tool is a calculation aid, not investment advice or a trade recommendation. Spread, swap points, commissions and stop-out are not included. Real profit and margin depend on your broker's execution and margin rules.",
    sectionHeading: 'Trade settings',
    pairLabel: 'Currency pair',
    lotsLabel: 'Position size (lots)',
    lotSizeLabel: 'Units per lot',
    lotSize100k: '100,000 units',
    lotSize10k: '10,000 units',
    leverageLabel: 'Leverage (x)',
    leverageHint:
      'Individual accounts in Japan are capped at 25x. Other countries differ.',
    directionLabel: 'Direction',
    directionBuy: 'Buy (long)',
    directionSell: 'Sell (short)',
    entryLabel: 'Entry rate',
    exitLabel: 'Exit rate',
    quoteRateLabel: '{quote}/JPY rate (yen per 1 {quote})',
    quoteRateHint:
      'For non-yen pairs, enter the rate used to convert profit and margin into yen. For EUR/USD, that is the USD/JPY rate.',
    errorUnits:
      'Enter a position size above 0 (anything under 1 unit cannot be calculated)',
    errorLeverage: 'Enter a leverage above 0',
    errorEntry: 'Enter the entry rate as a number above 0',
    errorExit: 'Enter the exit rate as a number above 0',
    errorQuoteRate:
      'Enter the yen rate of the quote currency as a number above 0',
    resultHeading: 'Result',
    unitsLabel: 'Units traded',
    pipsLabel: 'Profit / loss (pips)',
    profitJpyLabel: 'Profit / loss (JPY)',
    profitQuoteLabel: 'Profit / loss ({quote})',
    pipValueLabel: 'Value of 1 pip',
    marginLabel: 'Required margin',
    notionalLabel: 'Position value',
    unitsSuffix: 'units',
    pipsSuffix: 'pips',
    yenSuffix: 'JPY',
    notesHeading: 'Notes',
    notes: [
      'Spread, swap points, commissions and stop-out are not included, so real results will differ by those amounts.',
      'One pip is 0.01 for yen pairs and 0.0001 for the others. Pips are handled down to 0.1 pip (a tenth of a pip).',
      'Required margin is units x entry rate / leverage, converted into yen and rounded up to a whole yen. Some brokers use a different reference rate for margin.',
      'For non-yen pairs, the single quote-currency/JPY rate you enter is used to convert both profit and margin. Real fills use different rates at entry and exit, so treat the result as an estimate.',
      'Profit in yen is rounded to the nearest yen. Rates are typed by hand; no live market data is fetched.',
    ],
    glossaryHeading: 'Glossary',
    glossaryTerms: [
      {
        term: 'Pip',
        description:
          'The unit of an exchange-rate move. One pip is 0.01 for yen pairs and 0.0001 for pairs like EUR/USD.',
      },
      {
        term: 'Lot',
        description:
          'The unit of position size. One lot is 100,000 units at many brokers; some use 10,000 or 1,000.',
      },
      {
        term: 'Leverage',
        description:
          'The multiple of your margin you can trade. At 25x you need a margin of 4% of the position value.',
      },
      {
        term: 'Required margin',
        description:
          'The collateral you must hold in the account to open a position. It is the position value divided by leverage.',
      },
      {
        term: 'Quote currency',
        description:
          'The currency on the right side of a pair. For USD/JPY it is JPY, and the exchange rate is expressed in it.',
      },
    ],
  },
};
