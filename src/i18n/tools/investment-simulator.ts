import type { Locale } from '../../data/tools';

interface GlossaryTerm {
  term: string;
  description: string;
}

export type SimulationMode =
  'futureValue' | 'monthlyContribution' | 'months' | 'initialInvestment';

export type WithdrawalMode = 'byYears' | 'byAmount' | 'byRate';

export interface InvestmentSimulatorPageContent {
  title: string;
  description: string;
  h1: string;
  introHtml: string;
  numberLocale: string;

  sectionHeading: string;
  modeLegend: string;
  modeLabels: Record<SimulationMode, string>;

  rateLabel: string;
  ratePlaceholder: string;
  initialLabel: string;
  initialPlaceholder: string;
  monthlyLabel: string;
  monthlyPlaceholder: string;
  yearsLabel: string;
  yearsPlaceholder: string;
  targetLabel: string;
  targetPlaceholder: string;

  error: string;

  primaryResultLabels: Record<SimulationMode, string>;

  resultHeading: string;
  finalBalanceLabel: string;
  totalPrincipalLabel: string;
  totalGainLabel: string;

  chartHeading: string;
  chartAriaLabelTemplate: string;
  principalLegendLabel: string;
  gainLegendLabel: string;

  trendChartHeading: string;
  trendChartAriaLabelTemplate: string;

  tableHeading: string;
  tableYearHeader: string;
  tablePrincipalHeader: string;
  tableGainHeader: string;
  tableBalanceHeader: string;

  withdrawalHeading: string;
  withdrawalIntro: string;
  withdrawalModeLegend: string;
  withdrawalModeLabels: Record<WithdrawalMode, string>;

  withdrawalYearsLabel: string;
  withdrawalSimulationYearsLabel: string;
  withdrawalYearsPlaceholder: string;
  withdrawalError: string;

  withdrawalAmountLabel: string;
  withdrawalAmountPlaceholder: string;
  withdrawalAmountError: string;

  withdrawalRateLabel: string;
  withdrawalRatePlaceholder: string;
  withdrawalRateError: string;

  withdrawalPrimaryLabels: Record<WithdrawalMode, string>;
  withdrawalNotDepletedText: string;
  withdrawalTotalLabel: string;

  withdrawalChartHeading: string;
  withdrawalChartAriaLabelTemplate: string;
  withdrawalTableHeading: string;
  withdrawalTableYearHeader: string;
  withdrawalTableBalanceHeader: string;

  notesHeading: string;
  notes: string[];
  glossaryHeading: string;
  glossaryTerms: GlossaryTerm[];
}

export const investmentSimulatorContent: Record<
  Locale,
  InvestmentSimulatorPageContent
> = {
  ja: {
    title: '資産運用シミュレーション（積立・複利計算／取り崩し試算つき）',
    description:
      '初期投資額・毎月の積立額・想定利回り（年率）・積立期間のうち3つを入力すると、残る1つ（将来の資産額／毎月の積立額／積立期間／初期投資額）を複利計算で試算する無料ツールです。積立元本と運用益の内訳をグラフと年別の表で確認でき、取り崩し可能額（毎月）もあわせて試算できます。データはブラウザ内で処理され、サーバーには送信されません。',
    h1: '資産運用シミュレーション',
    introHtml:
      '「初期投資額」「毎月の積立額」「想定利回り（年率）」「積立期間」のうち、求めたい項目以外の3つを入力すると、複利運用を前提に残る1つを試算します。積立元本の累計と運用益の内訳をグラフと年別の推移表で確認できるほか、試算した資産額をもとに毎月の取り崩し可能額もシミュレーションできます。住宅ローンの繰り上げ返済効果を試算したい場合は <a href="/tools/mortgage-calculator/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">住宅ローン繰り上げ返済比較シミュレーション</a> もあわせてご利用ください。',
    numberLocale: 'ja-JP',

    sectionHeading: '計算したい項目と条件の入力',
    modeLegend: '計算したい項目',
    modeLabels: {
      futureValue: '将来の資産額を計算する',
      monthlyContribution: '毎月の積立額を計算する',
      months: '積立期間を計算する',
      initialInvestment: '初期投資額を計算する',
    },

    rateLabel: '想定利回り（年率、%）',
    ratePlaceholder: '5',
    initialLabel: '初期投資額（円）',
    initialPlaceholder: '1000000',
    monthlyLabel: '毎月の積立額（円）',
    monthlyPlaceholder: '30000',
    yearsLabel: '積立期間（年）',
    yearsPlaceholder: '20',
    targetLabel: '目標の資産額（円）',
    targetPlaceholder: '20000000',

    error:
      '計算できませんでした（入力値を確認してください。金額は0以上、想定利回りは0〜50%、期間は1〜60年の範囲で入力し、初期投資額と毎月の積立額の少なくとも一方は0より大きい値にしてください）',

    primaryResultLabels: {
      futureValue: '将来の資産額（積立終了時点）',
      monthlyContribution: '必要な毎月の積立額',
      months: '目標達成までに必要な期間',
      initialInvestment: '必要な初期投資額',
    },

    resultHeading: '試算結果の内訳',
    finalBalanceLabel: '将来の資産額（積立終了時点）',
    totalPrincipalLabel: '元本合計（初期投資額＋積立累計額）',
    totalGainLabel: '運用益',

    chartHeading: '資産の内訳（元本と運用益）',
    chartAriaLabelTemplate: '元本合計 {principal}、運用益 {gain}',
    principalLegendLabel: '元本合計',
    gainLegendLabel: '運用益',

    trendChartHeading: '年別の推移（グラフ）',
    trendChartAriaLabelTemplate:
      '元本合計と資産評価額の年別推移グラフ。積立終了時点で元本合計{principal}、資産評価額{balance}。',

    tableHeading: '年別の推移',
    tableYearHeader: '経過期間',
    tablePrincipalHeader: '元本合計',
    tableGainHeader: '運用益',
    tableBalanceHeader: '資産評価額',

    withdrawalHeading: '取り崩しシミュレーション',
    withdrawalIntro:
      '上記で試算した「将来の資産額」を運用しながら取り崩す場合のシミュレーションです。想定利回りは上記の値をそのまま使用します。取り崩し方式を選んで、それぞれの条件を入力してください。',
    withdrawalModeLegend: '取り崩し方式',
    withdrawalModeLabels: {
      byYears: '利用年数から毎月の取り崩し額を計算する',
      byAmount: '毎月の取り崩し額を指定する（定額取り崩し）',
      byRate: '取り崩し率を指定する（定率取り崩し）',
    },

    withdrawalYearsLabel: '取り崩し期間（利用年数）',
    withdrawalSimulationYearsLabel: 'シミュレーション期間（年）',
    withdrawalYearsPlaceholder: '30',
    withdrawalError:
      '計算できませんでした（取り崩し期間は1〜60年の整数で入力してください）',

    withdrawalAmountLabel: '毎月の取り崩し額（円）',
    withdrawalAmountPlaceholder: '100000',
    withdrawalAmountError:
      '計算できませんでした（毎月の取り崩し額は0より大きい値で入力してください）',

    withdrawalRateLabel: '取り崩し率（年率、%）',
    withdrawalRatePlaceholder: '4',
    withdrawalRateError:
      '計算できませんでした（取り崩し率は0より大きく100%以下、シミュレーション期間は1〜60年の整数で入力してください）',

    withdrawalPrimaryLabels: {
      byYears: '毎月の取り崩し可能額（定額）',
      byAmount: '資産が尽きるまでの期間',
      byRate: '1ヶ月目の取り崩し額',
    },
    withdrawalNotDepletedText:
      '60年以内に資産は尽きません（運用益が取り崩し額を上回っています）',
    withdrawalTotalLabel: '取り崩し総額',

    withdrawalChartHeading: '残り資産額の推移（グラフ）',
    withdrawalChartAriaLabelTemplate:
      '残り資産評価額の推移グラフ。{years}年後の残高は{balance}。',
    withdrawalTableHeading: '残り資産額の推移',
    withdrawalTableYearHeader: '経過期間',
    withdrawalTableBalanceHeader: '残り資産評価額',

    notesHeading: '注意事項',
    notes: [
      '想定利回りは、積立期間・取り崩し期間を通じて入力した利率が一定であることを前提とした簡易試算です。将来の運用成果を保証するものではなく、実際の投資では市場変動により元本割れすることもあります。',
      '複利計算は「毎月の積立額を月初に投入し、その月の運用益をその積立額にも加える」方式（年金終価、期首払い）を前提としています。初期投資額は積立開始時点から運用されるものとして計算します。',
      '「積立期間を計算する」では、目標の資産額にちょうど届く月数を切り上げて求めています。そのため試算結果の資産額は目標の資産額と完全には一致せず、わずかに上回ります。',
      '取り崩しシミュレーションは、毎月末に運用益を加えたうえで取り崩す前提です。「利用年数から計算」は指定した年数でちょうど残高が0になる毎月均等額を（元利均等返済と同じ計算方式で）算出し、「定額取り崩し」は指定した毎月の取り崩し額で残高が0になるまでの期間を算出し、「定率取り崩し」は毎月の残高に取り崩し率を掛けた額を取り崩すため理論上は残高が0にはならず徐々に減っていきます。実際の取り崩しでは、取り崩しのタイミングや手数料、市場変動によって結果が異なります。',
      '運用益にかかる税金（通常20.315%）や、投資信託の信託報酬などの利回り以外のコストは考慮していません。NISA（少額投資非課税制度）など非課税制度を利用する場合、税金の面では本ツールの試算結果が手取りの目安になります（信託報酬などのコストは別途差し引いて考えてください）。',
    ],
    glossaryHeading: '用語解説',
    glossaryTerms: [
      {
        term: '複利',
        description:
          '運用で得た利益（運用益）を元本に組み入れて再投資し、その利益にも次の期間の運用益がつく仕組みです。単利（元本にのみ利益がつく方式）に比べて、運用期間が長いほど資産の増え方が大きくなります。',
      },
      {
        term: '積立投資（ドルコスト平均法）',
        description:
          '毎月など定期的に一定額を投資商品に投じる投資手法です。価格が高いときは少なく、安いときは多く購入することになるため、一括投資に比べて平均購入価格を平準化しやすいとされています。',
      },
      {
        term: '想定利回り（年率）',
        description:
          'シミュレーションの前提として設定する、1年あたりの運用利回りです。過去の株価指数の実績等を参考に設定することが多いですが、将来も同じ利回りが続く保証はありません。',
      },
      {
        term: '取り崩し（定額取り崩し）',
        description:
          '運用を続けながら、資産の一部を定期的に売却・引き出して生活費などに充てることです。毎月の取り崩し額を一定に保つ方式を定額取り崩しといいます。取り崩す金額が運用益を上回るペースだと資産は徐々に減っていき、いずれ尽きます。',
      },
      {
        term: '定率取り崩し',
        description:
          '取り崩し額を一定にするのではなく、その時点の残高に対して一定の割合（取り崩し率）を毎月・毎年取り崩す方式です。残高が減れば取り崩し額も自動的に減るため、定額取り崩しに比べて資産が尽きにくい一方、生活費として使える金額が徐々に減っていく点に注意が必要です。',
      },
      {
        term: 'NISA（少額投資非課税制度）',
        description:
          '一定の投資額の範囲内で得た運用益（値上がり益・分配金）が非課税になる日本の制度です。通常の課税口座では運用益に約20.315%の税金がかかりますが、NISA口座ではかかりません。本ツールの試算では税金を考慮していないため、課税口座で運用する場合は運用益から税金分を差し引いて考える必要があります。',
      },
    ],
  },
  en: {
    title: 'Investment Growth & Withdrawal Simulator (Compound Interest)',
    description:
      'Enter any 3 of "initial investment," "monthly contribution," "assumed annual return," and "time horizon," and this free tool solves for the remaining one (future value, monthly contribution, time horizon, or initial investment) under compound interest. See the split between contributions and investment gains in a chart and a year-by-year table, and estimate a sustainable monthly withdrawal amount from the resulting balance. Your data is processed in the browser and never sent to a server.',
    h1: 'Investment Growth Simulator (Compound Interest & Withdrawal)',
    introHtml:
      'Enter 3 of "initial investment," "monthly contribution," "assumed annual return," and "time horizon," and this tool solves for the remaining one under compound interest (dollar-cost averaging). See the split between total contributions and investment gains in a chart and a year-by-year breakdown table, then estimate a sustainable monthly withdrawal amount from that future value. To estimate the effect of a lump-sum mortgage prepayment, try the <a href="/en/tools/mortgage-calculator/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">Mortgage Prepayment Comparison Calculator</a> as well.',
    numberLocale: 'en-US',

    sectionHeading: 'Choose what to calculate',
    modeLegend: 'What do you want to calculate?',
    modeLabels: {
      futureValue: 'Future value',
      monthlyContribution: 'Monthly contribution',
      months: 'Time horizon',
      initialInvestment: 'Initial investment',
    },

    rateLabel: 'Assumed annual return (%)',
    ratePlaceholder: '5',
    initialLabel: 'Initial investment (JPY)',
    initialPlaceholder: '1000000',
    monthlyLabel: 'Monthly contribution (JPY)',
    monthlyPlaceholder: '30000',
    yearsLabel: 'Time horizon (years)',
    yearsPlaceholder: '20',
    targetLabel: 'Target future value (JPY)',
    targetPlaceholder: '20000000',

    error:
      'Could not calculate (check the values below — amounts must be 0 or more, the annual return must be between 0 and 50%, the horizon must be between 1 and 60 years, and at least one of the initial investment or monthly contribution must be greater than 0)',

    primaryResultLabels: {
      futureValue: 'Future value (at the end of the period)',
      monthlyContribution: 'Required monthly contribution',
      months: 'Time needed to reach the goal',
      initialInvestment: 'Required initial investment',
    },

    resultHeading: 'Breakdown',
    finalBalanceLabel: 'Future value (at the end of the period)',
    totalPrincipalLabel: 'Total principal (initial + contributions)',
    totalGainLabel: 'Investment gain',

    chartHeading: 'Breakdown (principal vs. investment gain)',
    chartAriaLabelTemplate:
      'Total principal {principal}, investment gain {gain}',
    principalLegendLabel: 'Total principal',
    gainLegendLabel: 'Investment gain',

    trendChartHeading: 'Year-by-year trend (chart)',
    trendChartAriaLabelTemplate:
      'Chart of total principal and future value by year. At the end of the period: total principal {principal}, future value {balance}.',

    tableHeading: 'Year-by-year breakdown',
    tableYearHeader: 'Elapsed time',
    tablePrincipalHeader: 'Total principal',
    tableGainHeader: 'Investment gain',
    tableBalanceHeader: 'Future value',

    withdrawalHeading: 'Withdrawal simulation',
    withdrawalIntro:
      'Simulates withdrawing from the future value calculated above while you keep investing the rest. It reuses the annual return entered above. Choose a withdrawal method and enter its inputs below.',
    withdrawalModeLegend: 'Withdrawal method',
    withdrawalModeLabels: {
      byYears: 'Solve for a fixed monthly amount from a withdrawal period',
      byAmount: 'Enter a fixed monthly amount (fixed-amount withdrawal)',
      byRate: 'Enter a withdrawal rate (fixed-percentage withdrawal)',
    },

    withdrawalYearsLabel: 'Withdrawal period (years)',
    withdrawalSimulationYearsLabel: 'Simulation period (years)',
    withdrawalYearsPlaceholder: '30',
    withdrawalError:
      'Could not calculate (the withdrawal period must be a whole number of years between 1 and 60)',

    withdrawalAmountLabel: 'Fixed monthly withdrawal (JPY)',
    withdrawalAmountPlaceholder: '100000',
    withdrawalAmountError:
      'Could not calculate (the monthly withdrawal amount must be greater than 0)',

    withdrawalRateLabel: 'Withdrawal rate (annual, %)',
    withdrawalRatePlaceholder: '4',
    withdrawalRateError:
      'Could not calculate (the withdrawal rate must be greater than 0 and at most 100%, and the simulation period must be a whole number of years between 1 and 60)',

    withdrawalPrimaryLabels: {
      byYears: 'Sustainable monthly withdrawal (fixed amount)',
      byAmount: 'Time until the balance is depleted',
      byRate: 'Withdrawal amount in month 1',
    },
    withdrawalNotDepletedText:
      "The balance won't be depleted within 60 years (investment gains outpace the withdrawal amount)",
    withdrawalTotalLabel: 'Total withdrawn',

    withdrawalChartHeading: 'Remaining balance over time (chart)',
    withdrawalChartAriaLabelTemplate:
      'Chart of the remaining balance over time. After {years} years, the balance is {balance}.',
    withdrawalTableHeading: 'Remaining balance over time',
    withdrawalTableYearHeader: 'Elapsed time',
    withdrawalTableBalanceHeader: 'Remaining balance',

    notesHeading: 'Notes',
    notes: [
      'This is a simplified estimate that assumes the entered rate of return stays constant for the whole accumulation and withdrawal period. It does not guarantee future results, and real investments can lose value due to market fluctuations.',
      "The compound interest calculation assumes each monthly contribution is made at the start of the month and earns that month's return as well (an annuity-due). The initial investment is assumed to start earning returns from the very beginning of the period.",
      'For "time horizon," the required number of months is rounded up to the nearest whole month, so the resulting future value is slightly above (never below) your target.',
      'The withdrawal simulation assumes withdrawals happen at the end of each month, after that month\'s return is added. "Solve from a withdrawal period" computes the fixed monthly amount that brings the balance to exactly zero at the end of the chosen period (the same math as a fully amortizing loan payment); "fixed-amount withdrawal" computes how long a chosen fixed monthly amount lasts; "fixed-percentage withdrawal" withdraws a percentage of the balance each month, so the balance shrinks gradually but never mathematically reaches zero. Actual withdrawal timing, fees, and market fluctuations will change the real result.',
      "Taxes on investment gains (typically about 20.315% in Japan) and costs other than the rate of return, such as fund management fees, are not included. If you're using a tax-advantaged account such as NISA, this estimate is close to your take-home amount as far as taxes go (fees such as fund management costs still need to be deducted separately).",
    ],
    glossaryHeading: 'Glossary',
    glossaryTerms: [
      {
        term: 'Compound interest',
        description:
          'Reinvesting investment gains back into the principal so that future returns are earned on those gains too, not just the original principal. Compared to simple interest (where only the original principal earns a return), this makes growth accelerate the longer the money stays invested.',
      },
      {
        term: 'Dollar-cost averaging (DCA)',
        description:
          'Investing a fixed amount at regular intervals, such as monthly, rather than all at once. Because the fixed amount buys fewer shares when prices are high and more when prices are low, it tends to smooth out the average purchase price compared to a lump-sum investment.',
      },
      {
        term: 'Assumed annual return',
        description:
          'The yearly rate of return assumed for the simulation, often based on the historical average of a stock index or similar benchmark. There is no guarantee that the same return will continue in the future.',
      },
      {
        term: 'Withdrawal (systematic withdrawal)',
        description:
          'Periodically selling or withdrawing part of an invested balance, typically to cover living expenses, while the rest stays invested. Withdrawing the same amount every month is called a fixed-amount withdrawal. If withdrawals outpace investment gains, the balance gradually shrinks and is eventually depleted.',
      },
      {
        term: 'Fixed-percentage withdrawal',
        description:
          'Instead of withdrawing a fixed amount, this withdraws a fixed percentage of the current balance each month or year. Because the withdrawal amount automatically shrinks along with the balance, the balance is less likely to be fully depleted than with a fixed-amount withdrawal — but the usable income gradually decreases over time.',
      },
      {
        term: "NISA (Japan's tax-free investment account)",
        description:
          "A Japanese account type where investment gains — capital gains and dividends — are exempt from tax up to certain contribution limits. Gains in an ordinary taxable account are normally taxed at about 20.315%. This tool's estimate does not subtract taxes, so in a taxable account your actual take-home gain would be lower.",
      },
    ],
  },
};
