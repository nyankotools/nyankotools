import type { Locale } from '../../data/tools';
import type { CostItemId } from '../../lib/tools/rent-initial-cost';

interface GlossaryTerm {
  term: string;
  description: string;
}

export interface RentInitialCostPageContent {
  title: string;
  description: string;
  h1: string;
  introHtml: string;
  numberLocale: string;
  sectionHeading: string;
  rentLabel: string;
  managementFeeLabel: string;
  depositLabel: string;
  keyMoneyLabel: string;
  brokerageLabel: string;
  occupiedDaysLabel: string;
  prepaidLabel: string;
  fireInsuranceLabel: string;
  keyExchangeLabel: string;
  guaranteeLabel: string;
  movingLabel: string;
  otherLabel: string;
  incomeSectionHeading: string;
  incomeLabel: string;
  incomeHint: string;
  error: string;
  resultHeading: string;
  itemLabels: Record<CostItemId, string>;
  totalLabel: string;
  totalInRentMonthsLabel: string;
  monthsUnit: string;
  totalWithoutDepositLabel: string;
  monthlyPaymentLabel: string;
  guidelineHeading: string;
  monthlyGrossLabel: string;
  upperLimitLabel: string;
  comfortableLabel: string;
  ratioLabel: string;
  guidelineNote: string;
  notesHeading: string;
  notes: string[];
  glossaryHeading: string;
  glossaryTerms: GlossaryTerm[];
}

export const rentInitialCostContent: Record<
  Locale,
  RentInitialCostPageContent
> = {
  ja: {
    title: '賃貸の初期費用計算｜敷金礼金・仲介手数料・家賃の目安を試算',
    description:
      '家賃・敷金・礼金・仲介手数料・前家賃・保証料・引越し費用などから賃貸の初期費用の総額と内訳を試算し、年収別の家賃の目安も確認できる無料ツールです。データはブラウザ内で処理され、サーバーには送信されません。',
    h1: '賃貸の初期費用計算（敷金礼金・仲介手数料・家賃の目安）',
    introHtml:
      '家賃と各項目の月数・金額を入力すると、賃貸の入居時にかかる初期費用の総額と内訳を試算します。年収を入力すると、家賃の目安（月収の1/3・1/4）も確認できます。試算はあくまで目安です。物件ごとの正確な金額は、重要事項説明書や見積書で確認してください。住宅購入を検討している場合は <a href="/tools/mortgage-calculator/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">住宅ローン繰り上げ返済シミュレーション</a> もご利用ください。',
    numberLocale: 'ja-JP',
    sectionHeading: '物件の条件・初期費用の入力',
    rentLabel: '月額家賃（円）',
    managementFeeLabel: '管理費・共益費（円/月）',
    depositLabel: '敷金（家賃の何ヶ月分）',
    keyMoneyLabel: '礼金（家賃の何ヶ月分）',
    brokerageLabel: '仲介手数料（家賃の何ヶ月分、税抜）',
    occupiedDaysLabel: '入居月の日割り日数（30日換算、0で日割りなし）',
    prepaidLabel: '前家賃（家賃＋管理費の何ヶ月分）',
    fireInsuranceLabel: '火災保険料（円）',
    keyExchangeLabel: '鍵交換費用（円）',
    guaranteeLabel: '保証会社の初回保証料（家賃＋管理費に対する%）',
    movingLabel: '引越し費用（円）',
    otherLabel: 'その他（家具家電・清掃など、円）',
    incomeSectionHeading: '家賃の目安（任意）',
    incomeLabel: '年収（額面、円）',
    incomeHint:
      '空欄のままでも初期費用は計算されます。入力した内容はブラウザ内でのみ処理されます。',
    error:
      '計算できませんでした（家賃は0より大きい値にし、各金額・月数は0以上で入力してください。月数は24以下、保証料は200%以下、日割り日数は0〜31です）',
    resultHeading: '初期費用の内訳',
    itemLabels: {
      deposit: '敷金',
      keyMoney: '礼金',
      brokerage: '仲介手数料（税込）',
      proratedRent: '日割り家賃（入居月分）',
      prepaidRent: '前家賃',
      fireInsurance: '火災保険料',
      keyExchange: '鍵交換費用',
      guarantee: '保証会社の保証料',
      moving: '引越し費用',
      other: 'その他',
    },
    totalLabel: '初期費用の総額',
    totalInRentMonthsLabel: '家賃の何ヶ月分か',
    monthsUnit: 'ヶ月分',
    totalWithoutDepositLabel: '敷金を除いた総額',
    monthlyPaymentLabel: '入居後の毎月の支払い（家賃＋管理費）',
    guidelineHeading: '年収から見た家賃の目安',
    monthlyGrossLabel: '額面の月収',
    upperLimitLabel: '家賃の上限目安（月収の1/3）',
    comfortableLabel: '余裕のある家賃の目安（月収の1/4）',
    ratioLabel: '入力した家賃＋管理費が月収に占める割合',
    guidelineNote:
      '「家賃は月収の1/3以内」はよく知られた経験則にすぎません。手取り・貯蓄・ほかの支出によって適切な家賃は変わります。',
    notesHeading: '注意事項',
    notes: [
      'この試算は目安であり、契約内容や金額を保証するものではなく、不動産・金融に関する助言でもありません。実際の金額は不動産会社の見積書や重要事項説明書で確認してください。',
      '仲介手数料は家賃（管理費を除く）に月数と消費税10%（税込1.1倍）を掛けて計算しています。宅建業法上の上限は貸主・借主の合計で家賃の1ヶ月分（税別）が目安です。',
      '日割り家賃は、入居月の家賃と管理費を30日換算で日割りしています。実際の暦日数や起算日は契約によって異なります。',
      '敷金は退去時の原状回復費用を差し引いて返還される預け金のため、初期費用の総額には含めたうえで「敷金を除いた総額」も表示しています。礼金は返還されません。',
      '保証料・火災保険料・鍵交換費用は物件や会社によって大きく異なります。初期値は一例です。更新料や退去時の費用は含みません。',
      '年収は額面で計算しています。「月収の1/3」は一般的な経験則で、収入や生活費の状況によって無理のない家賃は変わります。',
    ],
    glossaryHeading: '用語解説',
    glossaryTerms: [
      {
        term: '敷金',
        description:
          '家賃の滞納や退去時の原状回復費用に備えて貸主に預けるお金です。退去時に未払い分や修繕費を差し引いた残りが返還されます。',
      },
      {
        term: '礼金',
        description:
          '貸主へのお礼として支払うお金で、敷金と異なり退去時に返還されません。近年は礼金なしの物件も増えています。',
      },
      {
        term: '仲介手数料',
        description:
          '物件を紹介・契約手続きした不動産会社に支払う手数料です。上限は貸主・借主合計で家賃の1ヶ月分（税別）とされ、借主の負担は原則として半額（0.5ヶ月分）が目安です。',
      },
      {
        term: '前家賃',
        description:
          '入居時に翌月分などの家賃を前払いするものです。入居月の日割り家賃と合わせて請求されるのが一般的です。',
      },
      {
        term: '保証会社',
        description:
          '連帯保証人の代わりに家賃の保証をする会社です。初回保証料は家賃と管理費の合計の50〜100%程度が一例で、1年ごとの更新料がかかる場合もあります。',
      },
    ],
  },
  en: {
    title: 'Rental Initial Cost Calculator (Japan: Deposit, Key Money)',
    description:
      'Estimate upfront costs for renting in Japan: deposit, key money, agent fee, prepaid rent and more, plus a rent guide from income. Runs in your browser.',
    h1: 'Rental Initial Cost Calculator for Japan (Deposit, Key Money, Agent Fee)',
    introHtml:
      'Renting in Japan usually means paying a deposit, key money, an agent fee and prepaid rent before you move in. Enter the monthly rent and each item to estimate the total and a breakdown. Add your annual income to see a rule-of-thumb rent range (one-third or one-quarter of monthly gross income). This is only an estimate; check the quote and the contract explanation for the exact amounts. If you are thinking about buying instead, try the <a href="/en/tools/mortgage-calculator/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">Mortgage Prepayment Calculator</a>.',
    numberLocale: 'en-US',
    sectionHeading: 'Property terms and upfront costs',
    rentLabel: 'Monthly rent (JPY)',
    managementFeeLabel: 'Management / common fee (JPY per month)',
    depositLabel: 'Security deposit (months of rent)',
    keyMoneyLabel: 'Key money (months of rent)',
    brokerageLabel: 'Agent fee (months of rent, before tax)',
    occupiedDaysLabel:
      'Prorated days in the move-in month (30-day basis, 0 for none)',
    prepaidLabel: 'Prepaid rent (months of rent + fee)',
    fireInsuranceLabel: 'Fire insurance (JPY)',
    keyExchangeLabel: 'Lock change (JPY)',
    guaranteeLabel: 'Guarantor company initial fee (% of rent + fee)',
    movingLabel: 'Moving cost (JPY)',
    otherLabel: 'Other (furniture, appliances, cleaning, JPY)',
    incomeSectionHeading: 'Rent guide (optional)',
    incomeLabel: 'Annual gross income (JPY)',
    incomeHint:
      'The upfront cost is calculated even if this is blank. Everything you enter is processed in your browser.',
    error:
      'Could not calculate. Rent must be greater than 0, and amounts and months must be 0 or more (months up to 24, guarantee fee up to 200%, prorated days 0 to 31).',
    resultHeading: 'Upfront cost breakdown',
    itemLabels: {
      deposit: 'Security deposit',
      keyMoney: 'Key money',
      brokerage: 'Agent fee (tax incl.)',
      proratedRent: 'Prorated rent (move-in month)',
      prepaidRent: 'Prepaid rent',
      fireInsurance: 'Fire insurance',
      keyExchange: 'Lock change',
      guarantee: 'Guarantor company fee',
      moving: 'Moving cost',
      other: 'Other',
    },
    totalLabel: 'Total upfront cost',
    totalInRentMonthsLabel: 'In months of rent',
    monthsUnit: 'months',
    totalWithoutDepositLabel: 'Total excluding the deposit',
    monthlyPaymentLabel: 'Monthly payment after moving in (rent + fee)',
    guidelineHeading: 'Rent guide from your income',
    monthlyGrossLabel: 'Monthly gross income',
    upperLimitLabel: 'Upper rent guide (1/3 of monthly income)',
    comfortableLabel: 'Comfortable rent guide (1/4 of monthly income)',
    ratioLabel: 'Entered rent + fee as a share of monthly income',
    guidelineNote:
      'Keeping rent within one-third of monthly income is only a well-known rule of thumb. The right rent depends on your take-home pay, savings and other expenses.',
    notesHeading: 'Notes',
    notes: [
      'This is an estimate, not a guarantee of any contract or amount, and not real estate or financial advice. Check the quote and the contract explanation from the agent for the actual figures.',
      'The agent fee is rent (excluding the management fee) times the number of months times 1.1 for 10% consumption tax. As a guide, Japanese law caps the combined fee from landlord and tenant at one month of rent plus tax.',
      'Prorated rent is the move-in month rent plus management fee divided over 30 days. The actual day count and start date depend on the contract.',
      'The deposit is returned after deducting restoration costs when you move out, so it is included in the total and a total excluding the deposit is shown too. Key money is not returned.',
      'Guarantee fees, fire insurance and lock change costs vary widely by property and company. The defaults are only examples. Renewal fees and move-out costs are not included.',
      'Income is treated as gross. One-third of monthly income is a general rule of thumb; a comfortable rent depends on your income and living costs.',
    ],
    glossaryHeading: 'Glossary',
    glossaryTerms: [
      {
        term: 'Security deposit (shikikin)',
        description:
          'Money left with the landlord to cover unpaid rent and restoration costs. The balance is returned at move-out after deductions.',
      },
      {
        term: 'Key money (reikin)',
        description:
          'A non-refundable payment to the landlord. Unlike the deposit, it is not returned. Many properties now advertise no key money.',
      },
      {
        term: 'Agent fee (chukai tesuryo)',
        description:
          'A fee paid to the real estate agent who arranged the contract. The legal cap is one month of rent plus tax in total, and the tenant normally pays about half of that unless agreed otherwise.',
      },
      {
        term: 'Prepaid rent (mae-yachin)',
        description:
          'Rent paid in advance at move-in, typically for the following month, on top of the prorated rent for the move-in month.',
      },
      {
        term: 'Guarantor company',
        description:
          'A company that guarantees your rent in place of a personal guarantor. A typical initial fee is 50 to 100% of one month of rent plus fee, and some charge yearly renewals.',
      },
    ],
  },
};
