import type { Locale } from '../../data/tools';

interface GlossaryTerm {
  term: string;
  description: string;
}

export interface ScholarshipRepaymentSimulatorPageContent {
  title: string;
  description: string;
  h1: string;
  introHtml: string;
  numberLocale: string;
  noticeHtml: string;
  sectionHeading: string;
  amountLabel: string;
  amountPlaceholder: string;
  rateLabel: string;
  ratePlaceholder: string;
  yearsLabel: string;
  yearsPlaceholder: string;
  yearsUnit: string;
  methodLegend: string;
  methodFixedLabel: string;
  methodReviewedLabel: string;
  rateChangeLabel: string;
  rateChangeHelp: string;
  rateChangePlaceholder: string;
  error: string;
  resultHeading: string;
  resultInitialMonthlyLabel: string;
  resultFinalMonthlyLabel: string;
  resultRepaymentPeriodLabel: string;
  resultTotalPaymentLabel: string;
  resultTotalInterestLabel: string;
  periodsHeading: string;
  periodsInitialRowLabel: string;
  periodsReviewRowLabelTemplate: string;
  periodsTableReviewHeader: string;
  periodsTableYearHeader: string;
  periodsTableRateHeader: string;
  periodsTableMonthlyHeader: string;
  yearFromSuffix: string;
  installmentsUnit: string;
  notesHeading: string;
  notes: string[];
  glossaryHeading: string;
  glossaryTerms: GlossaryTerm[];
}

export const scholarshipRepaymentSimulatorContent: Record<
  Locale,
  ScholarshipRepaymentSimulatorPageContent
> = {
  ja: {
    title:
      '奨学金返済シミュレーション（JASSO第二種・利率固定方式/利率見直し方式）',
    description:
      'JASSO（日本学生支援機構）第二種奨学金（利子付き）を想定し、貸与総額・利率・返還期間から、利率固定方式と利率見直し方式それぞれの毎月の返済額・総返済額・総利息を簡易試算する無料ツールです。データはブラウザ内で処理され、サーバーには送信されません。',
    h1: '奨学金（第二種）返済シミュレーション',
    introHtml:
      '貸与総額・利率・返還期間を入力すると、元利均等返済を前提に、毎月の返済額・総返済額・総利息を試算します。利率見直し方式では、5年ごとの利率見直しで想定する利率の変化幅も入力でき、見直しのたびに返済額がどう変わるかを確認できます。フリーランスなど個人事業主の手取り額を試算したい場合は <a href="/tools/freelance-income-calculator/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">フリーランス手取り計算機</a> もあわせてご利用ください。',
    numberLocale: 'ja-JP',
    noticeHtml:
      '<strong>在学中（貸与中）は利率が未確定です。</strong>JASSO第二種奨学金の利率は、貸与を受けている間は決まっておらず、貸与終了時（卒業時など）に、その時点の市場金利をもとに確定します。本ツールで入力する「利率」は、貸与終了後に確定した（または確定すると仮定した）利率です。在学中に試算する場合は、あくまで仮の数値として利用してください。',
    sectionHeading: '貸与条件の入力',
    amountLabel: '貸与総額（円）',
    amountPlaceholder: '2400000',
    rateLabel: '貸与終了時に確定する利率（年利、%）',
    ratePlaceholder: '0.5',
    yearsLabel: '返還期間（年）',
    yearsPlaceholder: '15',
    yearsUnit: '年',
    methodLegend: '返還方式',
    methodFixedLabel: '利率固定方式（確定した利率が返還完了まで変わらない）',
    methodReviewedLabel:
      '利率見直し方式（概ね5年ごとに、その時点の市場金利で利率が見直される）',
    rateChangeLabel: '5年ごとの利率見直しで想定する変化幅（年利、%ポイント）',
    rateChangeHelp:
      '実際の利率見直し方式では、将来の市場金利は誰にも分かりません。ここでは「見直しのたびにこれだけ利率が変化し続けたら」という仮の前提を入力して試算します。上昇を仮定する場合は正の値、低下を仮定する場合は負の値を入力してください（0を入力すると利率固定方式と同じ試算になります）。',
    rateChangePlaceholder: '0.1',
    error:
      '計算できませんでした（貸与総額・利率・返還期間を確認してください。貸与総額は0より大きく、利率は0以上、返還期間は1〜20年の整数である必要があります）',
    resultHeading: '試算結果',
    resultInitialMonthlyLabel: '当初（貸与終了時確定）の毎月の返済額',
    resultFinalMonthlyLabel: '最終的な毎月の返済額',
    resultRepaymentPeriodLabel: '返還期間',
    resultTotalPaymentLabel: '総返済額',
    resultTotalInterestLabel: 'うち利息',
    periodsHeading: '利率見直しごとの返済額の推移',
    periodsInitialRowLabel: '当初（貸与終了時）',
    periodsReviewRowLabelTemplate: '第{n}回見直し後',
    periodsTableReviewHeader: '見直し',
    periodsTableYearHeader: '適用開始',
    periodsTableRateHeader: '適用利率',
    periodsTableMonthlyHeader: '毎月の返済額',
    yearFromSuffix: '年目〜',
    installmentsUnit: '回',
    notesHeading: '注意事項',
    notes: [
      'JASSO（日本学生支援機構）第二種奨学金（利子付き）を想定した簡易試算です。無利子の第一種奨学金には対応していません。',
      '在学中（貸与中）は利率が未確定で、貸与終了時（卒業時など）にその時点の市場金利をもとに確定します。在学中に試算する場合、入力する利率はあくまで仮の数値である点にご注意ください。',
      '返済方式は「元利均等返済」（毎月の返済額が一定になる方式）を前提としています。',
      '実際のJASSOの返還回数（返還期間）は、貸与総額に応じた規定の表に基づいて決まります。本ツールでは簡易化のため、返還期間を年数で直接入力する方式にしています。実際の返還期間・返還額はJASSOの通知内容をご確認ください。',
      '利率見直し方式は、実際には貸与終了時の利率を基準に、概ね5年ごとにその時点の市場金利へ見直されます。将来の市場金利は誰にも分からないため、本ツールでは「見直しのたびに一定の幅で変化し続けたら」という仮の前提で試算しており、実際の見直し結果とは異なります。',
      '返還期限猶予制度、所得連動返還方式、延滞金、保証料（保証制度を利用する場合）などは考慮していません。',
    ],
    glossaryHeading: '用語解説',
    glossaryTerms: [
      {
        term: '第二種奨学金',
        description:
          'JASSO（日本学生支援機構）の貸与型奨学金のうち、利息が付くタイプです。無利子の第一種奨学金より選考基準が緩やかで、多くの学生が利用しています。',
      },
      {
        term: '利率固定方式',
        description:
          '貸与終了時に確定した利率が、返還完了まで変わらない方式です。将来の市場金利が上昇しても返済額は変わらない安心感がある一方、市場金利が下がっても恩恵は受けられません。',
      },
      {
        term: '利率見直し方式',
        description:
          '貸与終了時に確定した利率を基準に、概ね5年ごとにその時点の市場金利へ見直される方式です。見直しのたびに毎月の返済額が変わる可能性があります。',
      },
      {
        term: '元利均等返済',
        description:
          '毎月の返済額（元金＋利息）が返還期間を通じて一定になる返済方式です。返済開始当初は利息の割合が多く、返済が進むにつれて元金の割合が増えていきます。',
      },
      {
        term: '返還期限猶予',
        description:
          '災害・傷病・経済困難・失業などの事由がある場合に、一定期間、奨学金の返還を待ってもらえる制度です。本ツールの試算には含まれていません。',
      },
    ],
  },
  en: {
    title: 'JASSO Student Loan Repayment Simulator (Fixed vs. Review)',
    description:
      'Estimate monthly payment and total interest for a JASSO Type 2 student loan, comparing fixed-rate and rate-review methods. Runs in your browser.',
    h1: 'JASSO Student Loan Repayment Simulator',
    introHtml:
      'Enter your total loan amount, interest rate, and repayment term, and this tool estimates the monthly payment, total repayment, and total interest under an equal-payment (amortizing) loan. For the rate-review method, you can also enter an assumed rate change at each 5-year review to see how the payment might shift over time. To estimate a Japanese freelancer\'s take-home pay, try the <a href="/en/tools/freelance-income-calculator/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">Freelancer Take-Home Pay Calculator</a> as well.',
    numberLocale: 'en-US',
    noticeHtml:
      "<strong>While you're still enrolled, the interest rate is not yet fixed.</strong> For a JASSO Type 2 loan, the rate is undetermined while you're receiving disbursements, and is only fixed when disbursement ends (typically at graduation), based on the market rate at that time. The \"interest rate\" you enter below is the rate as fixed after disbursement ends (or an assumed rate). If you're estimating this while still enrolled, treat the result as a rough what-if figure only.",
    sectionHeading: 'Loan details',
    amountLabel: 'Total loan amount (JPY)',
    amountPlaceholder: '2400000',
    rateLabel: 'Interest rate fixed at end of disbursement (annual, %)',
    ratePlaceholder: '0.5',
    yearsLabel: 'Repayment term (years)',
    yearsPlaceholder: '15',
    yearsUnit: 'yr',
    methodLegend: 'Repayment rate method',
    methodFixedLabel: 'Fixed rate (stays the same for the whole term)',
    methodReviewedLabel:
      'Rate review (reviewed against the market rate roughly every 5 years)',
    rateChangeLabel:
      'Assumed rate change at each 5-year review (annual, percentage points)',
    rateChangeHelp:
      'With the real rate-review method, nobody knows future market rates. This estimates a what-if scenario where the rate keeps changing by this amount at every review. Enter a positive value to assume rate increases, a negative value for decreases (0 gives the same result as the fixed-rate method).',
    rateChangePlaceholder: '0.1',
    error:
      'Could not calculate (check the loan amount, rate, and repayment term — the loan amount must be greater than 0, the rate at least 0, and the repayment term a whole number of years from 1 to 20)',
    resultHeading: 'Simulation results',
    resultInitialMonthlyLabel: 'Initial monthly payment',
    resultFinalMonthlyLabel: 'Final monthly payment',
    resultRepaymentPeriodLabel: 'Repayment term',
    resultTotalPaymentLabel: 'Total repayment',
    resultTotalInterestLabel: 'Of which, interest',
    periodsHeading: 'Payment at each rate review',
    periodsInitialRowLabel: 'Initial (rate fixed at end of disbursement)',
    periodsReviewRowLabelTemplate: 'After review #{n}',
    periodsTableReviewHeader: 'Review',
    periodsTableYearHeader: 'Starts at',
    periodsTableRateHeader: 'Rate applied',
    periodsTableMonthlyHeader: 'Monthly payment',
    yearFromSuffix: 'yr',
    installmentsUnit: 'installments',
    notesHeading: 'Notes',
    notes: [
      'This is a simplified estimate for a JASSO (Japan Student Services Organization) Type 2 loan, which carries interest. It does not cover the interest-free Type 1 loan.',
      "While you're still enrolled, the interest rate is undetermined and is only fixed when disbursement ends, based on the market rate at that time. If estimating while still enrolled, treat the entered rate as a rough placeholder.",
      'This assumes an equal-payment (amortizing) loan, where the total monthly payment stays constant for as long as the rate is unchanged.',
      "JASSO's actual number of installments (repayment term) is set from a schedule based on the total loan amount. This tool simplifies that by letting you enter the repayment term directly in years — check your actual JASSO notice for the real term and amounts.",
      'With the rate-review method, the rate is actually reviewed against the market roughly every 5 years, starting from the rate fixed at the end of disbursement. Since future market rates are unknowable, this tool simulates a what-if scenario where the rate keeps changing by a fixed amount at each review; actual results will differ.',
      'Repayment deferment, income-driven repayment, late fees, and guarantee fees (if using a loan guarantee) are not included.',
    ],
    glossaryHeading: 'Glossary',
    glossaryTerms: [
      {
        term: 'Type 2 loan',
        description:
          "One of JASSO's (Japan Student Services Organization) loan-based scholarships — the interest-bearing type. It has more relaxed eligibility criteria than the interest-free Type 1 loan, so most borrowers use it.",
      },
      {
        term: 'Fixed rate method',
        description:
          "The interest rate fixed at the end of disbursement stays the same for the whole repayment term. Your payment won't change even if market rates rise later, but you also won't benefit if they fall.",
      },
      {
        term: 'Rate review method',
        description:
          'Starting from the rate fixed at the end of disbursement, the rate is reviewed against the market roughly every 5 years. Your monthly payment can change at each review.',
      },
      {
        term: 'Amortizing (equal-payment) loan',
        description:
          'A repayment method where the total monthly payment (principal + interest) stays constant while the rate is unchanged. Early payments are weighted toward interest, shifting toward principal over time.',
      },
      {
        term: 'Repayment deferment',
        description:
          'A JASSO program that lets you postpone repayment for a period if you face a disaster, illness, financial hardship, or unemployment. Not included in this simulation.',
      },
    ],
  },
};
