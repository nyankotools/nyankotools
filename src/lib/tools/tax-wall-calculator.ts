import {
  RECONSTRUCTION_TAX_RATE,
  RESIDENT_TAX_INCOME_LEVY_RATE,
  basicDeductionIncomeTax,
  salaryIncomeDeduction,
} from './japan-income-tax';
import {
  calculateSalaryTax,
  estimateSocialInsurance,
} from './salary-take-home-calculator';

/**
 * 年収の壁の判定に使う制度の基準年。令和7年度税制改正後（所得税は令和7・8年分、住民税は令和8年度）。
 * 制度改正（基礎控除・配偶者控除・社会保険の適用拡大・被扶養者の認定基準など）があったら
 * このファイルの定数と表を見直し、辞書（notes）の基準年の記述も更新すること。
 */
export const TAX_WALL_BASIS_LABEL = '令和7年度税制改正後（令和7・8年分）';

/** 106万円の壁: 社会保険（厚生年金・健康保険）の加入対象になる年収の目安（月額賃金8.8万円×12≒105.6万円） */
export const SOCIAL_INSURANCE_WALL = 1_060_000;
/** 130万円の壁: 被扶養者の認定基準（年間収入130万円未満） */
export const DEPENDENT_WALL = 1_300_000;
/** 住民税の非課税ライン（単身・1級地の目安。令和8年度から110万円） */
export const RESIDENT_TAX_EXEMPT_LIMIT = 1_100_000;
/** 配偶者控除の対象になる配偶者の合計所得金額の上限（令和7年分以後は58万円） */
export const SPOUSE_DEDUCTION_INCOME_LIMIT = 580_000;
/** 配偶者特別控除が満額（38万円）になる配偶者の合計所得金額の上限（95万円） */
export const SPOUSE_SPECIAL_FULL_INCOME_LIMIT = 950_000;
/** 配偶者特別控除が0になる配偶者の合計所得金額の上限（133万円） */
export const SPOUSE_SPECIAL_END_INCOME_LIMIT = 1_330_000;

/** 国民年金保険料（令和8年度、月額17,920円）の年額 */
export const NATIONAL_PENSION_ANNUAL = 17_920 * 12;
/** 国民健康保険料の概算: 均等割（年額）と所得割率（概算。自治体で大きく異なる） */
export const NATIONAL_HEALTH_PER_CAPITA_ESTIMATE = 50_000;
export const NATIONAL_HEALTH_INCOME_RATE_ESTIMATE = 0.1;
export const NATIONAL_HEALTH_INCOME_RATE_ESTIMATE_AGE40 = 0.12;
/** 国民健康保険の所得割の基礎控除（43万円） */
const NATIONAL_HEALTH_BASIC_DEDUCTION = 430_000;

/** 手取りの減少がこの額以上のとき「逆転」として扱う */
export const MIN_CLIFF_DROP = 5_000;
/** 逆転を探す年収の範囲と刻み */
export const SCAN_FROM = 500_000;
export const SCAN_TO = 2_500_000;
export const SCAN_STEP = 1_000;

/** 納税者本人（配偶者）の合計所得金額の区分 */
export type SpouseIncomeClass = 'none' | 'upTo9m' | 'upTo9_5m' | 'upTo10m';

export const SPOUSE_INCOME_CLASSES: readonly SpouseIncomeClass[] = [
  'none',
  'upTo9m',
  'upTo9_5m',
  'upTo10m',
];

/** 区分ごとの控除額の倍率（900万円以下を1とする） */
const SPOUSE_CLASS_RATIO: Record<SpouseIncomeClass, number> = {
  none: 0,
  upTo9m: 1,
  upTo9_5m: 2 / 3,
  upTo10m: 1 / 3,
};

/**
 * 配偶者特別控除の表（配偶者の合計所得金額の上限、納税者の合計所得 900万円以下／950万円以下／1,000万円以下の控除額）。
 * 58万円超95万円以下は38/26/13万円
 */
const SPOUSE_SPECIAL_TABLE: readonly (readonly [
  number,
  number,
  number,
  number,
])[] = [
  [950_000, 380_000, 260_000, 130_000],
  [1_000_000, 360_000, 240_000, 120_000],
  [1_050_000, 310_000, 210_000, 110_000],
  [1_100_000, 260_000, 180_000, 90_000],
  [1_150_000, 210_000, 140_000, 70_000],
  [1_200_000, 160_000, 110_000, 60_000],
  [1_250_000, 110_000, 80_000, 40_000],
  [1_300_000, 60_000, 40_000, 20_000],
  [1_330_000, 30_000, 20_000, 10_000],
];

const SPOUSE_CLASS_COLUMN: Record<
  Exclude<SpouseIncomeClass, 'none'>,
  1 | 2 | 3
> = {
  upTo9m: 1,
  upTo9_5m: 2,
  upTo10m: 3,
};

/**
 * 配偶者控除・配偶者特別控除の額（所得税、円）。totalIncome は配偶者（このツールの本人）の合計所得金額。
 * 納税者の所得区分が 900万円超の場合は区分ごとの控除額に減額される（配偶者控除 26/13万円など）。
 */
export function spouseDeductionIncomeTax(
  totalIncome: number,
  spouseClass: SpouseIncomeClass,
): number {
  if (spouseClass === 'none') return 0;
  const col = SPOUSE_CLASS_COLUMN[spouseClass];
  if (totalIncome <= SPOUSE_DEDUCTION_INCOME_LIMIT) {
    return SPOUSE_SPECIAL_TABLE[0][col];
  }
  for (const row of SPOUSE_SPECIAL_TABLE) {
    if (totalIncome <= row[0]) return row[col];
  }
  return 0;
}

/** 住民税の配偶者控除・配偶者特別控除の額の概算。基本は所得税と同額で、満額は33万円 */
export function spouseDeductionResidentTax(
  totalIncome: number,
  spouseClass: SpouseIncomeClass,
): number {
  const ratio = SPOUSE_CLASS_RATIO[spouseClass];
  if (ratio === 0) return 0;
  const income = spouseDeductionIncomeTax(totalIncome, spouseClass);
  return Math.min(income, Math.round(330_000 * ratio));
}

/** 給与所得（給与収入－給与所得控除）が limit 以下に収まる最大の給与収入（円） */
export function salaryAtIncomeLimit(limit: number): number {
  let lo = 0;
  let hi = 20_000_000;
  while (lo < hi) {
    const mid = Math.ceil((lo + hi + 1) / 2);
    if (mid - salaryIncomeDeduction(mid) <= limit) lo = mid;
    else hi = mid - 1;
  }
  return lo;
}

export type InsuranceStatus = 'dependent' | 'employer' | 'national';

export interface TaxWallInput {
  /** 本人の年間給与収入（額面、円） */
  grossSalary: number;
  /** 40歳以上（介護保険料の対象）か */
  age40OrOver: boolean;
  /** 勤務先が106万円の壁の対象（従業員51人以上など）で、年収106万円以上から社会保険に加入するか */
  employerInsuranceFrom106: boolean;
  /** 配偶者（納税者）の合計所得金額の区分。none は配偶者控除を考慮しない */
  spouseClass: SpouseIncomeClass;
  /** 配偶者（納税者）の所得税の限界税率（0〜0.45） */
  spouseMarginalRate: number;
  /** 国民健康保険料の年額がわかっている場合の実額。null なら概算する */
  nationalHealthOverride: number | null;
}

export interface TaxWallBreakdown {
  grossSalary: number;
  insuranceStatus: InsuranceStatus;
  /** 本人負担の社会保険料等（社保、または国民健康保険料＋国民年金保険料） */
  socialInsurance: number;
  incomeTax: number;
  residentTax: number;
  /** 本人の手取り（年額） */
  takeHome: number;
  /** 配偶者（納税者）側で受ける配偶者控除・配偶者特別控除による税の軽減額（概算） */
  spouseTaxSaving: number;
  /** 本人の手取り＋配偶者側の税の軽減額 */
  householdTakeHome: number;
  /** 所得税の配偶者控除・配偶者特別控除の額 */
  spouseDeduction: number;
}

function validInput(input: TaxWallInput): boolean {
  return (
    Number.isFinite(input.grossSalary) &&
    input.grossSalary >= 0 &&
    Number.isFinite(input.spouseMarginalRate) &&
    input.spouseMarginalRate >= 0 &&
    input.spouseMarginalRate <= 0.45 &&
    SPOUSE_INCOME_CLASSES.includes(input.spouseClass) &&
    (input.nationalHealthOverride === null ||
      (Number.isFinite(input.nationalHealthOverride) &&
        input.nationalHealthOverride >= 0))
  );
}

/** 国民年金保険料と国民健康保険料の概算（年額） */
function estimateNationalInsurance(
  salaryIncome: number,
  age40OrOver: boolean,
  healthOverride: number | null,
): number {
  const rate = age40OrOver
    ? NATIONAL_HEALTH_INCOME_RATE_ESTIMATE_AGE40
    : NATIONAL_HEALTH_INCOME_RATE_ESTIMATE;
  const health =
    healthOverride ??
    Math.floor(
      Math.max(0, salaryIncome - NATIONAL_HEALTH_BASIC_DEDUCTION) * rate +
        NATIONAL_HEALTH_PER_CAPITA_ESTIMATE,
    );
  return Math.floor(health) + NATIONAL_PENSION_ANNUAL;
}

/** 入力が妥当である前提で、指定した年収での手取りなどを計算する（内部用） */
function evaluate(gross: number, input: TaxWallInput): TaxWallBreakdown {
  const salaryIncome = Math.max(0, gross - salaryIncomeDeduction(gross));

  let insuranceStatus: InsuranceStatus = 'dependent';
  let socialInsurance = 0;
  if (input.employerInsuranceFrom106 && gross >= SOCIAL_INSURANCE_WALL) {
    insuranceStatus = 'employer';
    socialInsurance = estimateSocialInsurance(gross, input.age40OrOver);
  } else if (gross >= DEPENDENT_WALL) {
    insuranceStatus = 'national';
    socialInsurance = estimateNationalInsurance(
      salaryIncome,
      input.age40OrOver,
      input.nationalHealthOverride,
    );
  }

  const tax = calculateSalaryTax({
    grossSalary: gross,
    age40OrOver: input.age40OrOver,
    socialInsuranceOverride: socialInsurance,
    otherDeductions: 0,
  })!;
  const incomeTax = tax.incomeTax + tax.reconstructionTax;
  // 住民税は年収が非課税ライン以下なら均等割も含めて0
  const residentTax = gross <= RESIDENT_TAX_EXEMPT_LIMIT ? 0 : tax.residentTax;
  const takeHome = gross - socialInsurance - incomeTax - residentTax;

  const spouseDeduction = spouseDeductionIncomeTax(
    salaryIncome,
    input.spouseClass,
  );
  const spouseResidentDeduction = spouseDeductionResidentTax(
    salaryIncome,
    input.spouseClass,
  );
  const spouseTaxSaving =
    Math.floor(
      spouseDeduction *
        input.spouseMarginalRate *
        (1 + RECONSTRUCTION_TAX_RATE),
    ) + Math.floor(spouseResidentDeduction * RESIDENT_TAX_INCOME_LEVY_RATE);

  return {
    grossSalary: gross,
    insuranceStatus,
    socialInsurance,
    incomeTax,
    residentTax,
    takeHome,
    spouseTaxSaving,
    householdTakeHome: takeHome + spouseTaxSaving,
    spouseDeduction,
  };
}

export type WallId =
  | 'resident-tax'
  | 'social-insurance'
  | 'spouse-deduction'
  | 'dependent'
  | 'income-tax'
  | 'spouse-special-full'
  | 'spouse-special-end';

export interface WallStatus {
  id: WallId;
  /** 壁の年収（円） */
  threshold: number;
  /** 入力した年収が壁に達した（または超えた）か */
  exceeded: boolean;
  /** 入力条件に照らして関係する壁か（配偶者なし・106万円の対象外なら false） */
  applicable: boolean;
}

export function wallStatuses(
  gross: number,
  input: Pick<TaxWallInput, 'spouseClass' | 'employerInsuranceFrom106'>,
): WallStatus[] {
  const hasSpouse = input.spouseClass !== 'none';
  const incomeTaxLine = salaryAtIncomeLimit(basicDeductionIncomeTax(0));
  return [
    {
      id: 'resident-tax',
      threshold: RESIDENT_TAX_EXEMPT_LIMIT,
      exceeded: gross > RESIDENT_TAX_EXEMPT_LIMIT,
      applicable: true,
    },
    {
      id: 'social-insurance',
      threshold: SOCIAL_INSURANCE_WALL,
      exceeded: gross >= SOCIAL_INSURANCE_WALL,
      applicable: input.employerInsuranceFrom106,
    },
    {
      id: 'spouse-deduction',
      threshold: salaryAtIncomeLimit(SPOUSE_DEDUCTION_INCOME_LIMIT),
      exceeded: gross > salaryAtIncomeLimit(SPOUSE_DEDUCTION_INCOME_LIMIT),
      applicable: hasSpouse,
    },
    {
      id: 'dependent',
      threshold: DEPENDENT_WALL,
      exceeded: gross >= DEPENDENT_WALL,
      applicable: true,
    },
    {
      id: 'income-tax',
      threshold: incomeTaxLine,
      exceeded: gross > incomeTaxLine,
      applicable: true,
    },
    {
      id: 'spouse-special-full',
      threshold: salaryAtIncomeLimit(SPOUSE_SPECIAL_FULL_INCOME_LIMIT),
      exceeded: gross > salaryAtIncomeLimit(SPOUSE_SPECIAL_FULL_INCOME_LIMIT),
      applicable: hasSpouse,
    },
    {
      id: 'spouse-special-end',
      threshold: salaryAtIncomeLimit(SPOUSE_SPECIAL_END_INCOME_LIMIT),
      exceeded: gross > salaryAtIncomeLimit(SPOUSE_SPECIAL_END_INCOME_LIMIT),
      applicable: hasSpouse,
    },
  ];
}

export interface TakeHomeCliff {
  /** 手取り（世帯）が最も高かった、壁の直前の年収 */
  beforeIncome: number;
  /** 手取りが下がり始める年収 */
  afterIncome: number;
  /** 壁の直前の手取り（世帯） */
  beforeTakeHome: number;
  /** 最大の手取りの減少額 */
  drop: number;
  /** 壁の直前の手取りを再び上回る年収。範囲内に無ければ null */
  recoverIncome: number | null;
}

/** 年収を増やしたのに世帯の手取りが減る区間（逆転）を探す */
export function findTakeHomeCliffs(
  input: TaxWallInput,
): TakeHomeCliff[] | null {
  if (!validInput(input)) return null;
  const points: { income: number; net: number }[] = [];
  for (let income = SCAN_FROM; income <= SCAN_TO; income += SCAN_STEP) {
    points.push({
      income,
      net: evaluate(income, input).householdTakeHome,
    });
  }
  const cliffs: TakeHomeCliff[] = [];
  let i = 0;
  while (i < points.length - 1) {
    if (points[i + 1].net < points[i].net) {
      const peak = i;
      let j = i + 1;
      while (j < points.length - 1 && points[j + 1].net < points[j].net) j++;
      const drop = points[peak].net - points[j].net;
      if (drop >= MIN_CLIFF_DROP) {
        let k = j + 1;
        while (k < points.length && points[k].net < points[peak].net) k++;
        cliffs.push({
          beforeIncome: points[peak].income,
          afterIncome: points[peak + 1].income,
          beforeTakeHome: points[peak].net,
          drop,
          recoverIncome: k < points.length ? points[k].income : null,
        });
      }
      i = j;
    } else {
      i++;
    }
  }
  return cliffs;
}

export interface TaxWallResult extends TaxWallBreakdown {
  walls: WallStatus[];
  cliffs: TakeHomeCliff[];
}

/** 年収の壁を判定し、手取り・逆転区間を概算する。入力が不正ならnull */
export function calculateTaxWall(input: TaxWallInput): TaxWallResult | null {
  if (!validInput(input)) return null;
  const cliffs = findTakeHomeCliffs(input);
  if (cliffs === null) return null;
  return {
    ...evaluate(input.grossSalary, input),
    walls: wallStatuses(input.grossSalary, input),
    cliffs,
  };
}
