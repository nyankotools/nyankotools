import type { Locale } from '../../data/tools';

export type SavingsMode = 'target' | 'monthly' | 'period';

export interface SavingsGoalCalculatorPageContent {
  title: string;
  description: string;
  h1: string;
  introHtml: string;
  numberLocale: string;
  /** 期間の表示形式（{y}=年, {m}=月） */
  yearsMonthsFormat: string;

  sectionHeading: string;
  modeLegend: string;
  modeLabels: Record<SavingsMode, string>;

  initialLabel: string;
  initialPlaceholder: string;
  monthlyLabel: string;
  monthlyPlaceholder: string;
  targetLabel: string;
  targetPlaceholder: string;
  periodLegend: string;
  yearsLabel: string;
  yearsPlaceholder: string;
  monthsLabel: string;
  monthsPlaceholder: string;
  rateLabel: string;
  ratePlaceholder: string;

  error: string;
  /** 目標額に到達しない（期間が最大を超える）場合の文言 */
  unreachableError: string;

  primaryResultLabels: Record<SavingsMode, string>;
  alreadyReachedText: string;

  resultHeading: string;
  finalBalanceLabel: string;
  totalDepositLabel: string;
  totalInterestLabel: string;

  tableHeading: string;
  tableYearHeader: string;
  tableDepositHeader: string;
  tableInterestHeader: string;
  tableBalanceHeader: string;

  notesHeading: string;
  notes: string[];
}

export const savingsGoalCalculatorContent: Record<
  Locale,
  SavingsGoalCalculatorPageContent
> = {
  ja: {
    title: '貯金目標計算機｜目標額・期間・毎月の積立額を逆算',
    description:
      '目標額・期間・毎月の貯金額のうち2つを入力すると残る1つを逆算する無料ツールです。初期残高や利息（0%も可）に対応し、年別の推移表つき。データはブラウザ内で処理され、サーバーには送信されません。',
    h1: '貯金目標計算機',
    introHtml:
      '「いくら貯めたいか」「何年で貯めたいか」「毎月いくら貯金できるか」のうち、わかっている2つを入力すると、残る1つを逆算します。現在の貯金額（初期残高）や年利も設定でき、利息がつかない場合は年利を0%にしてください。年別の推移表で、預入額と利息の内訳も確認できます。運用による増加を詳しく試算したい場合は <a href="/tools/investment-simulator/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">資産運用シミュレーション</a> もご利用ください。',
    numberLocale: 'ja-JP',
    yearsMonthsFormat: '{y}年{m}ヶ月',

    sectionHeading: '計算したい項目と条件の入力',
    modeLegend: '計算したい項目',
    modeLabels: {
      target: '貯まる金額を計算する',
      monthly: '毎月の貯金額を計算する',
      period: '目標達成までの期間を計算する',
    },

    initialLabel: '現在の貯金額（円）',
    initialPlaceholder: '0',
    monthlyLabel: '毎月の貯金額（円）',
    monthlyPlaceholder: '30000',
    targetLabel: '目標額（円）',
    targetPlaceholder: '3000000',
    periodLegend: '貯金する期間',
    yearsLabel: '期間（年）',
    yearsPlaceholder: '5',
    monthsLabel: '期間（ヶ月）',
    monthsPlaceholder: '0',
    rateLabel: '年利（%、0も可）',
    ratePlaceholder: '0',

    error:
      '計算できませんでした（入力値を確認してください。金額は0以上、年利は0〜50%、期間は1ヶ月〜60年の範囲で入力し、現在の貯金額と毎月の貯金額の少なくとも一方は0より大きい値にしてください）',
    unreachableError:
      '60年以内に目標額に届きません（毎月の貯金額を増やすか、目標額を見直してください）',

    primaryResultLabels: {
      target: '貯まる金額（期間終了時点）',
      monthly: '必要な毎月の貯金額',
      period: '目標達成までに必要な期間',
    },
    alreadyReachedText: 'すでに目標額に達しています（0ヶ月）',

    resultHeading: '試算結果の内訳',
    finalBalanceLabel: '期間終了時点の残高',
    totalDepositLabel: '預入合計（現在の貯金額＋積立累計）',
    totalInterestLabel: '利息合計',

    tableHeading: '年別の推移',
    tableYearHeader: '経過期間',
    tableDepositHeader: '預入合計',
    tableInterestHeader: '利息合計',
    tableBalanceHeader: '残高',

    notesHeading: '注意事項',
    notes: [
      '結果はあくまで目安の試算です。利息にかかる税金（預金利子には通常20.315%の源泉分離課税）や手数料は考慮していません。税引き後の金額はこの結果より少なくなります。',
      '毎月の貯金は各月末に行い、利息は年利を12で割った月利で月次複利として計算します。実際の金融機関の利息計算方法（日割り・半年ごとの付利など）とは異なる場合があります。',
      '期間を求める場合は、目標額に初めて届く月数を整数月で表示します。毎月の貯金額は期間を通じて一定、年利も一定と仮定しています。',
      '入力した内容はブラウザ内でのみ処理され、サーバーには送信されません。',
    ],
  },
  en: {
    title: 'Savings Goal Calculator: Target, Time & Monthly Amount',
    description:
      'Enter two of target amount, time frame and monthly savings to solve the third. Handles a starting balance and 0% interest, with a yearly table. Runs in-browser.',
    h1: 'Savings Goal Calculator',
    introHtml:
      'Know what you want to save, how long you have, or how much you can set aside each month? Enter any two and this calculator works out the third. You can also add a starting balance and an annual interest rate (use 0% for a plain savings account with no interest). A year-by-year table shows how much is your own deposits and how much is interest. For a deeper look at investment growth, try the <a href="/en/tools/investment-simulator/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">Investment Growth Simulator</a>.',
    numberLocale: 'en-US',
    yearsMonthsFormat: '{y}yr {m}mo',

    sectionHeading: 'Choose what to calculate',
    modeLegend: 'What do you want to calculate?',
    modeLabels: {
      target: 'How much I will have saved',
      monthly: 'Monthly savings needed',
      period: 'Time needed to reach my goal',
    },

    initialLabel: 'Current savings (JPY)',
    initialPlaceholder: '0',
    monthlyLabel: 'Monthly savings (JPY)',
    monthlyPlaceholder: '30000',
    targetLabel: 'Target amount (JPY)',
    targetPlaceholder: '3000000',
    periodLegend: 'Time frame',
    yearsLabel: 'Years',
    yearsPlaceholder: '5',
    monthsLabel: 'Months',
    monthsPlaceholder: '0',
    rateLabel: 'Annual interest rate (%, 0 is fine)',
    ratePlaceholder: '0',

    error:
      'Could not calculate. Check your inputs: amounts must be 0 or more, the rate between 0 and 50%, the time frame between 1 month and 60 years, and at least one of current savings or monthly savings must be above 0.',
    unreachableError:
      'The goal cannot be reached within 60 years. Try a larger monthly amount or a lower target.',

    primaryResultLabels: {
      target: 'Balance at the end of the period',
      monthly: 'Monthly savings needed',
      period: 'Time needed to reach the goal',
    },
    alreadyReachedText: 'You have already reached the goal (0 months)',

    resultHeading: 'Breakdown',
    finalBalanceLabel: 'Balance at the end of the period',
    totalDepositLabel: 'Total deposits (starting balance + contributions)',
    totalInterestLabel: 'Total interest',

    tableHeading: 'Year-by-year breakdown',
    tableYearHeader: 'Elapsed time',
    tableDepositHeader: 'Total deposits',
    tableInterestHeader: 'Total interest',
    tableBalanceHeader: 'Balance',

    notesHeading: 'Notes',
    notes: [
      'Results are estimates only. Taxes on interest (deposit interest in Japan is normally subject to 20.315% withholding tax) and fees are not included, so your after-tax amount will be lower.',
      'Deposits are made at the end of each month, and interest compounds monthly at the annual rate divided by 12. Actual banks may calculate interest differently (daily accrual, semiannual crediting, and so on).',
      'When solving for time, the result is the first whole month in which the balance reaches your target. The monthly amount and the interest rate are assumed to stay constant throughout.',
      'Everything you enter is processed in your browser and never sent to a server.',
    ],
  },
};
