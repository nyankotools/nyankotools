import type { Locale } from '../../data/tools';

interface GlossaryTerm {
  term: string;
  description: string;
}

export interface MortgageCalculatorPageContent {
  title: string;
  description: string;
  h1: string;
  introHtml: string;
  numberLocale: string;
  /** 期間の表示形式（{y}=年, {m}=月） */
  yearsMonthsFormat: string;
  sectionHeading: string;
  balanceLabel: string;
  balancePlaceholder: string;
  rateLabel: string;
  ratePlaceholder: string;
  termLabel: string;
  yearUnit: string;
  monthUnit: string;
  yearPlaceholder: string;
  monthPlaceholder: string;
  yearAriaLabel: string;
  monthAriaLabel: string;
  prepaymentAmountLabel: string;
  prepaymentAmountPlaceholder: string;
  prepaymentTypeLegend: string;
  prepaymentTypeShorten: string;
  prepaymentTypeReduce: string;
  error: string;
  beforeHeading: string;
  afterHeading: string;
  resultMonthlyPaymentLabel: string;
  resultRemainingTermLabel: string;
  resultTotalPaymentLabel: string;
  resultTotalInterestLabel: string;
  monthsUnit: string;
  summaryHeading: string;
  resultInterestSavedLabel: string;
  resultMonthsShortenedLabel: string;
  resultMonthlyPaymentReducedLabel: string;
  notesHeading: string;
  notes: string[];
  glossaryHeading: string;
  glossaryTerms: GlossaryTerm[];
}

export const mortgageCalculatorContent: Record<
  Locale,
  MortgageCalculatorPageContent
> = {
  ja: {
    title:
      '住宅ローン繰り上げ返済比較シミュレーション（期間短縮型・返済額軽減型）',
    description:
      '借入残高・金利・残りの返済期間と繰り上げ返済額から、「期間短縮型」「返済額軽減型」それぞれの繰り上げ返済効果（利息軽減額・返済期間の短縮・毎月の返済額の軽減）を比較する無料ツールです。データはブラウザ内で処理され、サーバーには送信されません。',
    h1: '住宅ローン繰り上げ返済比較シミュレーション',
    introHtml:
      '借入残高・年利・残りの返済期間・繰り上げ返済額を入力すると、元利均等返済を前提に、繰り上げ返済しなかった場合との比較で「期間短縮型」「返済額軽減型」それぞれの効果（総利息の軽減額、返済期間の短縮月数、毎月の返済額の軽減額）を試算します。フリーランスなど個人事業主の手取り額を試算したい場合は <a href="/tools/freelance-income-calculator/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">フリーランス手取り計算機</a> もあわせてご利用ください。',
    numberLocale: 'ja-JP',
    yearsMonthsFormat: '{y}年{m}ヶ月',
    sectionHeading: 'ローン情報・繰り上げ返済額の入力',
    balanceLabel: '繰り上げ返済前の借入残高（円）',
    balancePlaceholder: '30000000',
    rateLabel: '適用金利（年利、%）',
    ratePlaceholder: '1.0',
    termLabel: '残りの返済期間',
    yearUnit: '年',
    monthUnit: 'ヶ月',
    yearPlaceholder: '25',
    monthPlaceholder: '0',
    yearAriaLabel: '残りの返済期間（年）',
    monthAriaLabel: '残りの返済期間（ヶ月）',
    prepaymentAmountLabel: '繰り上げ返済額（円）',
    prepaymentAmountPlaceholder: '2000000',
    prepaymentTypeLegend: '繰り上げ返済の種類',
    prepaymentTypeShorten: '期間短縮型（毎月の返済額は変えず、期間を短縮）',
    prepaymentTypeReduce: '返済額軽減型（期間は変えず、毎月の返済額を軽減）',
    error:
      '計算できませんでした（借入残高・金利・繰り上げ返済額を確認してください。繰り上げ返済額は0より大きく、借入残高未満である必要があります）',
    beforeHeading: '繰り上げ返済しない場合',
    afterHeading: '繰り上げ返済した場合',
    resultMonthlyPaymentLabel: '毎月の返済額',
    resultRemainingTermLabel: '残りの返済期間',
    resultTotalPaymentLabel: '総返済額（繰り上げ返済額を含む）',
    resultTotalInterestLabel: '総利息',
    monthsUnit: 'ヶ月',
    summaryHeading: '繰り上げ返済の効果',
    resultInterestSavedLabel: '利息軽減額',
    resultMonthsShortenedLabel: '返済期間の短縮',
    resultMonthlyPaymentReducedLabel: '毎月の返済額の軽減',
    notesHeading: '注意事項',
    notes: [
      '返済方式は「元利均等返済」（毎月の返済額が一定になる方式）を前提とした簡易試算です。「元金均等返済」（毎月の元金返済額が一定になる方式）には対応していません。',
      '繰り上げ返済は、試算時点で全額を一括で行うものとして計算しています。実際の金融機関では、繰り上げ返済の受付時期や最低金額、手数料の有無などにルールがあるため、詳細は借入先の金融機関にご確認ください。',
      '金利は試算期間中ずっと一定であることを前提としています。変動金利の場合、将来の金利変動によって実際の利息額は本ツールの試算と異なります。',
      '期間短縮型の「短縮後の返済期間」は、逆算した月数を四捨五入で丸めた概算値です。実際の完済月では端数調整により最終回の返済額が変動する場合があります。',
      '団体信用生命保険料、保証料、繰り上げ返済手数料など、金利以外の諸費用は考慮していません。',
    ],
    glossaryHeading: '用語解説',
    glossaryTerms: [
      {
        term: '繰り上げ返済',
        description:
          '毎月の約定返済とは別に、まとまった金額を借入元金に充当して返済することです。元金が減ることで、その後発生する利息が軽減されます。',
      },
      {
        term: '期間短縮型',
        description:
          '繰り上げ返済後も毎月の返済額を変えず、その分だけ返済期間を短縮する方式です。同じ繰り上げ返済額であれば、一般的に返済額軽減型より利息の軽減効果が大きくなります。',
      },
      {
        term: '返済額軽減型',
        description:
          '繰り上げ返済後も返済期間を変えず、その分だけ毎月の返済額を軽減する方式です。毎月の家計負担をすぐに軽くしたい場合に選ばれます。',
      },
      {
        term: '元利均等返済',
        description:
          '毎月の返済額（元金＋利息）が返済期間を通じて一定になる返済方式です。返済開始当初は利息の割合が多く、返済が進むにつれて元金の割合が増えていきます。日本の住宅ローンで広く採用されています。',
      },
    ],
  },
  en: {
    title: 'Mortgage Prepayment Calculator (Shorten Term or Cut Payment)',
    description:
      'Compare mortgage prepayment by shortening the term or reducing the payment, with interest saved. Runs in your browser; nothing is sent to a server.',
    h1: 'Mortgage Prepayment Comparison Calculator',
    introHtml:
      'Enter your remaining loan balance, annual interest rate, remaining term, and a lump-sum prepayment amount, and this tool estimates — assuming an equal-payment (amortizing) loan — how much interest you\'d save, how many months you\'d shorten the term by, or how much your monthly payment would drop, comparing "shorten the term" against "reduce the payment" prepayment strategies. To estimate a Japanese freelancer\'s take-home pay, try the <a href="/en/tools/freelance-income-calculator/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">Freelancer Take-Home Pay Calculator</a> as well.',
    numberLocale: 'en-US',
    yearsMonthsFormat: '{y}yr {m}mo',
    sectionHeading: 'Loan details and prepayment amount',
    balanceLabel: 'Remaining balance before prepayment (JPY)',
    balancePlaceholder: '30000000',
    rateLabel: 'Annual interest rate (%)',
    ratePlaceholder: '1.0',
    termLabel: 'Remaining term',
    yearUnit: 'yr',
    monthUnit: 'mo',
    yearPlaceholder: '25',
    monthPlaceholder: '0',
    yearAriaLabel: 'Remaining term (years)',
    monthAriaLabel: 'Remaining term (months)',
    prepaymentAmountLabel: 'Prepayment amount (JPY)',
    prepaymentAmountPlaceholder: '2000000',
    prepaymentTypeLegend: 'Prepayment type',
    prepaymentTypeShorten:
      'Shorten term (keep the monthly payment, shorten the term)',
    prepaymentTypeReduce:
      'Reduce payment (keep the term, lower the monthly payment)',
    error:
      'Could not calculate (check the balance, rate, and prepayment amount — the prepayment amount must be greater than 0 and less than the remaining balance)',
    beforeHeading: 'Without prepayment',
    afterHeading: 'With prepayment',
    resultMonthlyPaymentLabel: 'Monthly payment',
    resultRemainingTermLabel: 'Remaining term',
    resultTotalPaymentLabel: 'Total payment (including the prepayment)',
    resultTotalInterestLabel: 'Total interest',
    monthsUnit: 'mo',
    summaryHeading: 'Effect of the prepayment',
    resultInterestSavedLabel: 'Interest saved',
    resultMonthsShortenedLabel: 'Term shortened by',
    resultMonthlyPaymentReducedLabel: 'Monthly payment reduced by',
    notesHeading: 'Notes',
    notes: [
      'This is a simplified estimate assuming an equal-payment (amortizing) loan, where the monthly payment stays constant. It does not support equal-principal repayment, where the principal portion stays constant instead.',
      'The prepayment is assumed to be made in full, in one lump sum, at the time of the calculation. Real lenders have their own rules on prepayment timing, minimum amounts, and fees, so check with your lender for details.',
      'The interest rate is assumed to stay constant for the rest of the loan. With a variable rate, actual future interest will differ from this estimate if rates change.',
      'For the "shorten term" option, the new remaining term is an estimate rounded to the nearest whole month from a reverse calculation; the actual final payment may be adjusted for rounding.',
      'Costs other than interest — such as mortgage life insurance premiums, guarantee fees, or a prepayment handling fee — are not included.',
    ],
    glossaryHeading: 'Glossary',
    glossaryTerms: [
      {
        term: 'Prepayment (lump-sum principal payment)',
        description:
          'A lump-sum payment applied directly to the loan principal, on top of the regular monthly payment. Reducing the principal lowers the interest that accrues afterward.',
      },
      {
        term: 'Shorten term',
        description:
          'A prepayment strategy that keeps the monthly payment the same as before and shortens the remaining term instead. For the same prepayment amount, this generally saves more interest than the "reduce payment" option.',
      },
      {
        term: 'Reduce payment',
        description:
          'A prepayment strategy that keeps the remaining term the same and lowers the monthly payment instead. It is chosen when the priority is easing the monthly household budget right away.',
      },
      {
        term: 'Amortizing (equal-payment) loan',
        description:
          'A repayment method where the total monthly payment (principal + interest) stays constant over the life of the loan. Early payments are weighted toward interest, shifting toward principal over time. This is the standard structure for Japanese mortgages.',
      },
    ],
  },
};
