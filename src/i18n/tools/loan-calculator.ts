import type { Locale } from '../../data/tools';

interface GlossaryTerm {
  term: string;
  description: string;
}

export interface LoanCalculatorPageContent {
  title: string;
  description: string;
  h1: string;
  introHtml: string;
  numberLocale: string;
  /** 期間の表示形式（{y}=年, {m}=月） */
  yearsMonthsFormat: string;
  howToHeading: string;
  howToSteps: string[];
  sectionHeading: string;
  methodLegend: string;
  methodEqualPayment: string;
  methodEqualPrincipal: string;
  methodRevolving: string;
  principalLabel: string;
  principalPlaceholder: string;
  rateLabel: string;
  ratePlaceholder: string;
  termLabel: string;
  yearUnit: string;
  monthUnit: string;
  yearPlaceholder: string;
  monthPlaceholder: string;
  yearAriaLabel: string;
  monthAriaLabel: string;
  monthlyPaymentLabel: string;
  monthlyPaymentPlaceholder: string;
  error: string;
  revolvingError: string;
  resultHeading: string;
  firstPaymentLabel: string;
  lastPaymentLabel: string;
  termResultLabel: string;
  totalPaymentLabel: string;
  totalInterestLabel: string;
  scheduleHeading: string;
  colMonth: string;
  colPayment: string;
  colPrincipal: string;
  colInterest: string;
  colBalance: string;
  notesHeading: string;
  notes: string[];
  glossaryHeading: string;
  glossaryTerms: GlossaryTerm[];
}

export const loanCalculatorContent: Record<Locale, LoanCalculatorPageContent> =
  {
    ja: {
      title:
        'ローン・リボ払い返済シミュレーター（元利均等・元金均等・リボ手数料）',
      description:
        'カードローン・自動車ローン・リボ払いの返済額・総利息・完済までの期間を、元利均等・元金均等・リボ払い（定額方式）で試算し、返済計画表も表示する無料ツールです。データはブラウザ内で処理され、サーバーには送信されません。',
      h1: 'ローン・リボ払い返済シミュレーター',
      introHtml:
        '借入額・実質年率と、返済回数（元利均等・元金均等）または毎月の支払額（リボ払い）を入力すると、毎月の返済額・総返済額・総利息（手数料）・完済までの期間と月ごとの返済計画表を試算します。住宅ローンの繰り上げ返済を比較したい場合は <a href="/tools/mortgage-calculator/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">住宅ローン繰り上げ返済比較シミュレーション</a> をご利用ください。',
      numberLocale: 'ja-JP',
      yearsMonthsFormat: '{y}年{m}ヶ月',
      howToHeading: '使い方',
      howToSteps: [
        '返済方式（元利均等・元金均等・リボ払い）を選びます。',
        '借入額と実質年率（%）を入力します。',
        '元利均等・元金均等では返済期間、リボ払いでは毎月の支払額を入力します。',
        '毎月の返済額・総利息・返済計画表が表示されます。',
      ],
      sectionHeading: '借入条件の入力',
      methodLegend: '返済方式',
      methodEqualPayment: '元利均等（毎月の返済額が一定）',
      methodEqualPrincipal: '元金均等（毎月の元金が一定）',
      methodRevolving: 'リボ払い（毎月の支払額が一定）',
      principalLabel: '借入額・利用残高（円）',
      principalPlaceholder: '1000000',
      rateLabel: '実質年率（%）',
      ratePlaceholder: '15.0',
      termLabel: '返済期間',
      yearUnit: '年',
      monthUnit: 'ヶ月',
      yearPlaceholder: '3',
      monthPlaceholder: '0',
      yearAriaLabel: '返済期間（年）',
      monthAriaLabel: '返済期間（ヶ月）',
      monthlyPaymentLabel: '毎月の支払額（円）',
      monthlyPaymentPlaceholder: '20000',
      error:
        '計算できませんでした（借入額は0より大きく、金利は0以上、返済期間は1ヶ月〜50年の範囲で入力してください）',
      revolvingError:
        '完済できません。毎月の支払額が毎月の手数料以下、または完済まで50年を超えます。支払額を増やしてください。',
      resultHeading: '試算結果',
      firstPaymentLabel: '初回の支払額',
      lastPaymentLabel: '最終回の支払額',
      termResultLabel: '完済までの期間',
      totalPaymentLabel: '総支払額',
      totalInterestLabel: '総利息・手数料',
      scheduleHeading: '返済計画表',
      colMonth: '回',
      colPayment: '支払額',
      colPrincipal: '元金',
      colInterest: '利息・手数料',
      colBalance: '残高',
      notesHeading: '注意事項',
      notes: [
        '金利は返済期間中ずっと一定、毎月同じ日に返済し、利息は残高×年率÷12で計算する簡易試算です。実際の金融機関では日割り計算や約定日により、金額が数円〜数百円異なる場合があります。',
        'リボ払いは毎月の支払額が一定の定額方式を前提としています。元金定額方式・残高スライド方式・元利定額方式など、カード会社ごとの方式には対応していません。',
        '借入額・年率が同じでも、リボ払いは支払額を低く設定すると完済まで長期化し、総利息が大きく膨らみます。支払額を変えて比較してください。',
        '保証料・事務手数料・年会費・遅延損害金などは考慮していません。実際の条件は契約書や利用明細でご確認ください。',
        '試算結果は参考値であり、融資や支払いを保証するものではありません。',
      ],
      glossaryHeading: '用語解説',
      glossaryTerms: [
        {
          term: '元利均等返済',
          description:
            '毎月の返済額（元金＋利息）が一定になる返済方式です。当初は利息の割合が多く、返済が進むと元金の割合が増えます。計画が立てやすい一方、元金均等より総利息は多くなります。',
        },
        {
          term: '元金均等返済',
          description:
            '毎月返済する元金が一定で、利息は残高に応じて減っていくため、返済額が徐々に少なくなる方式です。初期の負担は大きいものの、総利息は元利均等より少なくなります。',
        },
        {
          term: 'リボ払い（リボルビング払い）',
          description:
            '利用額にかかわらず毎月の支払額を一定にする方式です。月々の負担は軽くなりますが、残高に手数料（金利）がかかり続けるため、完済までの期間と総手数料が大きくなりやすい点に注意が必要です。',
        },
        {
          term: '実質年率',
          description:
            '利息や手数料を含めた、1年あたりの借入コストの割合です。カードローンやリボ払いでは、15%前後が一般的な水準です。',
        },
      ],
    },
    en: {
      title: 'Loan & Revolving Payment Calculator (Schedule)',
      description:
        'Estimate monthly payments, total interest and payoff time for loans and revolving credit, with a schedule. Runs in your browser; nothing is sent to a server.',
      h1: 'Loan & Revolving Payment Calculator',
      introHtml:
        'Enter the amount, annual rate and either the number of payments (amortizing or equal-principal loans) or a fixed monthly payment (revolving credit), and this tool estimates the monthly payment, total interest, time to pay off and a month-by-month schedule. For comparing mortgage prepayments, try the <a href="/en/tools/mortgage-calculator/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">Mortgage Prepayment Comparison Calculator</a>.',
      numberLocale: 'en-US',
      yearsMonthsFormat: '{y}yr {m}mo',
      howToHeading: 'How to use',
      howToSteps: [
        'Choose a repayment method: amortizing, equal principal or revolving.',
        'Enter the amount and the annual interest rate (%).',
        'Enter the term for loans, or the fixed monthly payment for revolving credit.',
        'See the monthly payment, total interest and repayment schedule.',
      ],
      sectionHeading: 'Loan details',
      methodLegend: 'Repayment method',
      methodEqualPayment: 'Amortizing (equal total payment each month)',
      methodEqualPrincipal: 'Equal principal (same principal each month)',
      methodRevolving: 'Revolving (fixed monthly payment)',
      principalLabel: 'Amount / balance (JPY)',
      principalPlaceholder: '1000000',
      rateLabel: 'Annual interest rate (%)',
      ratePlaceholder: '15.0',
      termLabel: 'Term',
      yearUnit: 'yr',
      monthUnit: 'mo',
      yearPlaceholder: '3',
      monthPlaceholder: '0',
      yearAriaLabel: 'Term (years)',
      monthAriaLabel: 'Term (months)',
      monthlyPaymentLabel: 'Monthly payment (JPY)',
      monthlyPaymentPlaceholder: '20000',
      error:
        'Could not calculate (the amount must be greater than 0, the rate 0 or more, and the term between 1 month and 50 years)',
      revolvingError:
        'This will never be paid off: the monthly payment is not above the monthly interest, or payoff takes more than 50 years. Increase the payment.',
      resultHeading: 'Result',
      firstPaymentLabel: 'First payment',
      lastPaymentLabel: 'Last payment',
      termResultLabel: 'Time to pay off',
      totalPaymentLabel: 'Total paid',
      totalInterestLabel: 'Total interest / fees',
      scheduleHeading: 'Repayment schedule',
      colMonth: '#',
      colPayment: 'Payment',
      colPrincipal: 'Principal',
      colInterest: 'Interest / fee',
      colBalance: 'Balance',
      notesHeading: 'Notes',
      notes: [
        'This is a simplified estimate: a constant rate, payments on the same day each month, and monthly interest of balance × annual rate ÷ 12. Real lenders use daily accrual and due dates, so amounts may differ slightly.',
        'Revolving credit assumes the fixed-payment method. Other card-issuer schemes, such as fixed principal or balance-sliding payments, are not modeled.',
        'With the same amount and rate, a low revolving payment stretches payoff out and inflates total interest. Try several payment amounts to compare.',
        'Guarantee fees, handling fees, annual fees and late charges are not included. Check your contract or statement for real terms.',
        'Results are for reference only and are not a guarantee of any loan or payment.',
      ],
      glossaryHeading: 'Glossary',
      glossaryTerms: [
        {
          term: 'Amortizing loan (equal payment)',
          description:
            'A loan where the total monthly payment (principal + interest) is constant. Early payments are mostly interest, shifting toward principal over time. Easy to budget, but total interest is higher than with equal principal.',
        },
        {
          term: 'Equal-principal repayment',
          description:
            'A loan where the principal repaid each month is constant and interest falls with the balance, so payments shrink over time. The early burden is heavier, but total interest is lower than amortizing.',
        },
        {
          term: 'Revolving credit',
          description:
            'A scheme where the monthly payment stays fixed regardless of the balance. Monthly burden is light, but fees keep accruing on the remaining balance, so payoff takes long and total fees grow.',
        },
        {
          term: 'Effective annual rate',
          description:
            'The yearly cost of borrowing including interest and fees. Card loans and revolving credit in Japan commonly run around 15%.',
        },
      ],
    },
  };
