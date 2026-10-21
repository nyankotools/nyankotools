/** 仲介手数料にかかる消費税率（税込 1.1 倍） */
export const BROKERAGE_TAX_MULTIPLIER = 1.1;
/** 日割り家賃の計算に使う月の日数（30日換算） */
export const PRORATE_DAYS_IN_MONTH = 30;

export interface RentInitialCostInput {
  /** 月額家賃（円） */
  rent: number;
  /** 管理費・共益費（円/月） */
  managementFee: number;
  /** 敷金（家賃の何ヶ月分か） */
  depositMonths: number;
  /** 礼金（家賃の何ヶ月分か） */
  keyMoneyMonths: number;
  /** 仲介手数料（家賃の何ヶ月分か、税抜） */
  brokerageMonths: number;
  /** 入居月に住む日数（日割り家賃の対象日数、0〜31。0なら日割りなし） */
  occupiedDays: number;
  /** 前家賃（入居時に前払いする家賃・管理費の月数） */
  prepaidMonths: number;
  /** 火災保険料（円） */
  fireInsurance: number;
  /** 鍵交換費用（円） */
  keyExchange: number;
  /** 保証会社の初回保証料（家賃＋管理費に対する%） */
  guaranteePercent: number;
  /** 引越し費用（円） */
  moving: number;
  /** その他（家具家電・清掃・消毒など、円） */
  other: number;
}

export type CostItemId =
  | 'deposit'
  | 'keyMoney'
  | 'brokerage'
  | 'proratedRent'
  | 'prepaidRent'
  | 'fireInsurance'
  | 'keyExchange'
  | 'guarantee'
  | 'moving'
  | 'other';

export interface CostItem {
  id: CostItemId;
  amount: number;
}

export interface RentInitialCostResult {
  items: CostItem[];
  total: number;
  /** 総額が家賃の何ヶ月分か（家賃のみで割る） */
  totalInRentMonths: number;
  /** 敷金のように退去時に戻る可能性のある分を除いた総額（目安） */
  totalWithoutDeposit: number;
  /** 入居後の毎月の支払い（家賃＋管理費） */
  monthlyPayment: number;
}

const MAX_MONTHS = 24;
const MAX_GUARANTEE_PERCENT = 200;

function isNonNegative(n: number): boolean {
  return Number.isFinite(n) && n >= 0;
}

/**
 * 賃貸の初期費用を項目別に試算する。
 * 家賃は0より大きく、他の金額・月数・%は0以上の有限値である必要がある
 * （月数は24以下、保証料は200%以下、日割り日数は0〜31）。満たさない場合はnull。
 * 各項目は円未満を四捨五入して合算する。
 */
export function calculateRentInitialCost(
  input: RentInitialCostInput,
): RentInitialCostResult | null {
  const {
    rent,
    managementFee,
    depositMonths,
    keyMoneyMonths,
    brokerageMonths,
    occupiedDays,
    prepaidMonths,
    fireInsurance,
    keyExchange,
    guaranteePercent,
    moving,
    other,
  } = input;

  if (!(Number.isFinite(rent) && rent > 0)) return null;
  if (
    ![
      managementFee,
      depositMonths,
      keyMoneyMonths,
      brokerageMonths,
      occupiedDays,
      prepaidMonths,
      fireInsurance,
      keyExchange,
      guaranteePercent,
      moving,
      other,
    ].every(isNonNegative)
  )
    return null;
  if (
    depositMonths > MAX_MONTHS ||
    keyMoneyMonths > MAX_MONTHS ||
    brokerageMonths > MAX_MONTHS ||
    prepaidMonths > MAX_MONTHS ||
    guaranteePercent > MAX_GUARANTEE_PERCENT ||
    occupiedDays > 31
  )
    return null;

  const monthlyPayment = rent + managementFee;

  const items: CostItem[] = [
    { id: 'deposit', amount: Math.round(rent * depositMonths) },
    { id: 'keyMoney', amount: Math.round(rent * keyMoneyMonths) },
    {
      id: 'brokerage',
      amount: Math.round(rent * brokerageMonths * BROKERAGE_TAX_MULTIPLIER),
    },
    {
      id: 'proratedRent',
      amount: Math.round(
        (monthlyPayment * occupiedDays) / PRORATE_DAYS_IN_MONTH,
      ),
    },
    { id: 'prepaidRent', amount: Math.round(monthlyPayment * prepaidMonths) },
    { id: 'fireInsurance', amount: Math.round(fireInsurance) },
    { id: 'keyExchange', amount: Math.round(keyExchange) },
    {
      id: 'guarantee',
      amount: Math.round((monthlyPayment * guaranteePercent) / 100),
    },
    { id: 'moving', amount: Math.round(moving) },
    { id: 'other', amount: Math.round(other) },
  ];

  const total = items.reduce((sum, item) => sum + item.amount, 0);
  if (!Number.isFinite(total)) return null;
  const deposit = items[0].amount;

  return {
    items,
    total,
    totalInRentMonths: total / rent,
    totalWithoutDeposit: total - deposit,
    monthlyPayment,
  };
}

export interface RentGuideline {
  /** 額面の月収（円） */
  monthlyGross: number;
  /** 家賃の上限目安（月収の1/3） */
  upperLimit: number;
  /** 余裕を持った目安（月収の1/4） */
  comfortable: number;
}

/**
 * 年収（額面）から家賃の目安を求める。月収の1/3を上限、1/4を余裕のある目安とする経験則。
 * 年収が0以下・非有限の場合はnull。金額は円未満を切り捨てる。
 */
export function calculateRentGuideline(
  annualIncome: number,
): RentGuideline | null {
  if (!(Number.isFinite(annualIncome) && annualIncome > 0)) return null;
  const monthlyGross = annualIncome / 12;
  return {
    monthlyGross: Math.floor(monthlyGross),
    upperLimit: Math.floor(monthlyGross / 3),
    comfortable: Math.floor(monthlyGross / 4),
  };
}

/**
 * 月々の住居費（家賃＋管理費）が額面月収に占める割合（%）。
 * 年収が0以下、住居費が負・非有限の場合はnull。
 */
export function calculateRentToIncomeRatio(
  monthlyHousingCost: number,
  annualIncome: number,
): number | null {
  if (!(Number.isFinite(annualIncome) && annualIncome > 0)) return null;
  if (!(Number.isFinite(monthlyHousingCost) && monthlyHousingCost >= 0))
    return null;
  return (monthlyHousingCost / (annualIncome / 12)) * 100;
}
