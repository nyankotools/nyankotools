import type { Locale } from '../../data/tools';

interface GlossaryTerm {
  term: string;
  description: string;
}

export interface RealEstateYieldPageContent {
  title: string;
  description: string;
  h1: string;
  introHtml: string;
  numberLocale: string;
  propertyHeading: string;
  priceLabel: string;
  monthlyRentLabel: string;
  vacancyLabel: string;
  expenseHeading: string;
  managementLabel: string;
  repairsLabel: string;
  propertyTaxLabel: string;
  otherExpensesLabel: string;
  purchaseCostLabel: string;
  financeHeading: string;
  equityLabel: string;
  equityHint: string;
  rateLabel: string;
  yearsLabel: string;
  error: string;
  resultHeading: string;
  grossYieldLabel: string;
  netYieldLabel: string;
  annualRentLabel: string;
  effectiveRentLabel: string;
  expensesLabel: string;
  noiLabel: string;
  totalInvestmentLabel: string;
  loanAmountLabel: string;
  monthlyLoanLabel: string;
  annualCashFlowLabel: string;
  monthlyCashFlowLabel: string;
  cashOnCashLabel: string;
  dscrLabel: string;
  totalInterestLabel: string;
  notAvailable: string;
  notesHeading: string;
  notes: string[];
  glossaryHeading: string;
  glossaryTerms: GlossaryTerm[];
}

export const realEstateYieldContent: Record<
  Locale,
  RealEstateYieldPageContent
> = {
  ja: {
    title: '不動産投資の利回り計算｜表面利回り・実質利回り・キャッシュフロー',
    description:
      '物件価格・家賃・空室率・諸経費・ローン条件から、不動産投資の表面利回り・実質利回りとローン返済後の年間・月間キャッシュフローを試算する無料ツールです。データはブラウザ内で処理され、サーバーには送信されません。',
    h1: '不動産投資の利回り計算（表面利回り・実質利回り・キャッシュフロー）',
    introHtml:
      '物件価格と家賃、経費、ローン条件を入力すると、表面利回り・実質利回り（NOI利回り）とローン返済後のキャッシュフローを試算します。ローンの返済額は <a href="/tools/loan-calculator/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">ローン・リボ払い返済シミュレーター</a> と同じ元利均等の計算で求めています。この試算は目安であり、投資の助言ではありません。自宅用のローンは <a href="/tools/mortgage-calculator/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">住宅ローン繰り上げ返済シミュレーション</a> もご利用ください。',
    numberLocale: 'ja-JP',
    propertyHeading: '物件と家賃収入',
    priceLabel: '物件価格（円）',
    monthlyRentLabel: '満室時の月額家賃収入（円）',
    vacancyLabel: '空室率（%）',
    expenseHeading: '経費・購入時の費用',
    managementLabel: '管理費・手数料（家賃収入に対する%）',
    repairsLabel: '修繕費・積立金（円/年）',
    propertyTaxLabel: '固定資産税・都市計画税（円/年）',
    otherExpensesLabel: 'その他の経費（保険料など、円/年）',
    purchaseCostLabel: '購入時の諸費用（物件価格に対する%）',
    financeHeading: '自己資金とローン',
    equityLabel: '自己資金（円）',
    equityHint:
      '物件価格と諸費用の合計から自己資金を引いた額を借入れる前提です。自己資金が合計以上なら借入なしで計算します。',
    rateLabel: 'ローンの金利（年率%）',
    yearsLabel: '返済期間（年）',
    error:
      '計算できませんでした（物件価格は0より大きい値にし、家賃・経費・自己資金は0以上で入力してください。空室率・管理費は0〜100%、諸費用は0〜30%、金利は0〜30%、返済期間は借入がある場合に1〜50年の整数です）',
    resultHeading: '試算結果',
    grossYieldLabel: '表面利回り',
    netYieldLabel: '実質利回り（NOI利回り）',
    annualRentLabel: '満室時の年間家賃収入',
    effectiveRentLabel: '空室を見込んだ年間家賃収入',
    expensesLabel: '年間の運営経費',
    noiLabel: '年間の純収益（NOI）',
    totalInvestmentLabel: '購入に必要な総額（物件価格＋諸費用）',
    loanAmountLabel: '借入額',
    monthlyLoanLabel: '毎月のローン返済額',
    annualCashFlowLabel: '年間キャッシュフロー（ローン返済後）',
    monthlyCashFlowLabel: '月間キャッシュフロー（ローン返済後）',
    cashOnCashLabel: '自己資金に対する年間キャッシュフロー率',
    dscrLabel: '返済余裕率（DSCR）',
    totalInterestLabel: 'ローンの利息総額（全期間）',
    notAvailable: '―',
    notesHeading: '注意事項',
    notes: [
      'この試算は目安であり、将来の収益や物件の価値を保証するものではなく、投資・税務・融資に関する助言でもありません。実際の判断は不動産会社・金融機関・税理士などの専門家にご相談ください。',
      '表面利回りは満室時の年間家賃収入を物件価格で割った値、実質利回りは年間家賃収入から空室と運営経費を引いたNOIを、物件価格と購入時の諸費用の合計で割った値です。',
      'キャッシュフローは、NOIから元利均等返済の年間返済額を引いた値です。金利は返済期間中ずっと一定とし、所得税・住民税、減価償却、大規模修繕、売却時の損益は含みません。',
      '返済余裕率（DSCR）はNOIを年間返済額で割った値で、1を下回ると家賃収入だけでは返済できないことを意味します。金融機関が重視する指標ですが、基準は機関によって異なります。',
      '入力した収入・借入などの情報は、ブラウザ内でのみ処理されます。',
    ],
    glossaryHeading: '用語解説',
    glossaryTerms: [
      {
        term: '表面利回り',
        description:
          '満室時の年間家賃収入を物件価格で割った利回りです。経費や空室を考慮しないため、物件を比べる大まかな指標として使われます。',
      },
      {
        term: '実質利回り',
        description:
          '年間の家賃収入から空室・管理費・修繕費・税金などの経費を引いた額（NOI）を、物件価格と購入諸費用の合計で割った利回りです。表面利回りより低くなるのが一般的です。',
      },
      {
        term: 'NOI（純収益）',
        description:
          'Net Operating Income の略で、家賃収入から運営経費を引いた額です。ローンの返済額や所得税は含みません。',
      },
      {
        term: 'キャッシュフロー',
        description:
          'ここではNOIからローン返済額を引いた、実際に手元に残るお金の年間・月間の額を指します。マイナスなら持ち出しになります。',
      },
    ],
  },
  en: {
    title: 'Rental Property Yield & Cash Flow Calculator',
    description:
      'Estimate gross yield, net yield (NOI) and monthly cash flow after loan payments from price, rent, expenses and loan terms. Runs in your browser.',
    h1: 'Rental Property Yield Calculator (Gross Yield, Net Yield, Cash Flow)',
    introHtml:
      'Enter the purchase price, rent, expenses and loan terms to estimate the gross yield, net yield (NOI yield) and cash flow after the mortgage payment. The loan payment uses the same level-payment formula as the <a href="/en/tools/loan-calculator/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">Loan &amp; Revolving Payment Calculator</a>. This is a rough estimate, not investment advice. For a home loan, see also the <a href="/en/tools/mortgage-calculator/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">Mortgage Prepayment Calculator</a>.',
    numberLocale: 'en-US',
    propertyHeading: 'Property and rental income',
    priceLabel: 'Purchase price (JPY)',
    monthlyRentLabel: 'Monthly rent at full occupancy (JPY)',
    vacancyLabel: 'Vacancy rate (%)',
    expenseHeading: 'Expenses and purchase costs',
    managementLabel: 'Management fee (% of rental income)',
    repairsLabel: 'Repairs and reserve fund (JPY per year)',
    propertyTaxLabel: 'Property tax (JPY per year)',
    otherExpensesLabel: 'Other expenses, e.g. insurance (JPY per year)',
    purchaseCostLabel: 'Closing costs (% of purchase price)',
    financeHeading: 'Down payment and loan',
    equityLabel: 'Down payment / own funds (JPY)',
    equityHint:
      'The loan is assumed to cover price plus closing costs minus your own funds. If your funds cover the total, no loan is used.',
    rateLabel: 'Loan interest rate (% per year)',
    yearsLabel: 'Loan term (years)',
    error:
      'Could not calculate. The price must be greater than 0, and rent, expenses and own funds must be 0 or more. Vacancy and management fee are 0 to 100%, closing costs and interest rate 0 to 30%, and the loan term is a whole number from 1 to 50 years when borrowing.',
    resultHeading: 'Results',
    grossYieldLabel: 'Gross yield',
    netYieldLabel: 'Net yield (NOI yield)',
    annualRentLabel: 'Annual rent at full occupancy',
    effectiveRentLabel: 'Annual rent after vacancy',
    expensesLabel: 'Annual operating expenses',
    noiLabel: 'Annual net operating income (NOI)',
    totalInvestmentLabel: 'Total purchase cost (price + closing costs)',
    loanAmountLabel: 'Loan amount',
    monthlyLoanLabel: 'Monthly loan payment',
    annualCashFlowLabel: 'Annual cash flow (after loan payments)',
    monthlyCashFlowLabel: 'Monthly cash flow (after loan payments)',
    cashOnCashLabel: 'Cash-on-cash return on own funds',
    dscrLabel: 'Debt service coverage ratio (DSCR)',
    totalInterestLabel: 'Total loan interest (full term)',
    notAvailable: '-',
    notesHeading: 'Notes',
    notes: [
      'This is a rough estimate. It does not guarantee future income or property value and is not investment, tax or lending advice. Consult a real estate agent, lender or tax adviser before deciding.',
      'Gross yield is annual rent at full occupancy divided by the price. Net yield is NOI (rent after vacancy and operating expenses) divided by the price plus closing costs.',
      'Cash flow is NOI minus the annual level-payment loan repayment. The interest rate is assumed fixed for the whole term, and income tax, depreciation, major renovations and sale gains or losses are not included.',
      'DSCR is NOI divided by the annual loan payment. A value below 1 means the rent alone does not cover the loan. Lenders watch this figure, but their thresholds differ.',
      'The income and loan figures you enter are processed only in your browser.',
    ],
    glossaryHeading: 'Glossary',
    glossaryTerms: [
      {
        term: 'Gross yield',
        description:
          'Annual rent at full occupancy divided by the purchase price. It ignores vacancy and expenses, so it is mainly a quick way to compare properties.',
      },
      {
        term: 'Net yield',
        description:
          'NOI divided by the purchase price plus closing costs. NOI is rent after vacancy, management, repairs, taxes and other costs. It is usually lower than the gross yield.',
      },
      {
        term: 'NOI (net operating income)',
        description:
          'Rental income minus operating expenses. Loan payments and income tax are not included.',
      },
      {
        term: 'Cash flow',
        description:
          'Here, NOI minus the loan payment: the money actually left each year or month. A negative figure means you pay out of pocket.',
      },
    ],
  },
};
