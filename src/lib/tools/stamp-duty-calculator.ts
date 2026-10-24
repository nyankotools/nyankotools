/**
 * 印紙税額の計算（課税文書の種類と記載金額から税額を求める）。
 * 国税庁「印紙税額の一覧表」（令和8年4月1日現在）に基づく。
 * 税制改正・軽減措置の期限が変わったら、下の定数を見直す。
 */

/** 区分の上限（この金額以下）と税額。upTo が null なら上限なし */
export interface StampBracket {
  upTo: number | null;
  tax: number;
}

/** 金額表。nonTaxableBelow 未満は非課税 */
export interface StampTable {
  nonTaxableBelow: number;
  brackets: StampBracket[];
}

/** 1億円超の区分（第1号・第2号・軽減前で共通） */
const HIGH_BRACKETS_NORMAL: StampBracket[] = [
  { upTo: 10_000_000, tax: 10_000 },
  { upTo: 50_000_000, tax: 20_000 },
  { upTo: 100_000_000, tax: 60_000 },
  { upTo: 500_000_000, tax: 100_000 },
  { upTo: 1_000_000_000, tax: 200_000 },
  { upTo: 5_000_000_000, tax: 400_000 },
  { upTo: null, tax: 600_000 },
];

/** 軽減措置の高額帯（500万円超の部分） */
const HIGH_BRACKETS_RELIEF: StampBracket[] = [
  { upTo: 10_000_000, tax: 5_000 },
  { upTo: 50_000_000, tax: 10_000 },
  { upTo: 100_000_000, tax: 30_000 },
  { upTo: 500_000_000, tax: 60_000 },
  { upTo: 1_000_000_000, tax: 160_000 },
  { upTo: 5_000_000_000, tax: 320_000 },
  { upTo: null, tax: 480_000 },
];

/** 第1号文書（不動産譲渡・地上権設定・土地賃借権譲渡・消費貸借・運送） */
export const TABLE_NO1: StampTable = {
  nonTaxableBelow: 10_000,
  brackets: [
    { upTo: 100_000, tax: 200 },
    { upTo: 500_000, tax: 400 },
    { upTo: 1_000_000, tax: 1_000 },
    { upTo: 5_000_000, tax: 2_000 },
    ...HIGH_BRACKETS_NORMAL,
  ],
};

/** 第2号文書（請負） */
export const TABLE_NO2: StampTable = {
  nonTaxableBelow: 10_000,
  brackets: [
    { upTo: 1_000_000, tax: 200 },
    { upTo: 2_000_000, tax: 400 },
    { upTo: 3_000_000, tax: 1_000 },
    { upTo: 5_000_000, tax: 2_000 },
    ...HIGH_BRACKETS_NORMAL,
  ],
};

/** 軽減措置: 不動産譲渡契約書（第1号の1。10万円以下は本則どおり200円） */
export const TABLE_RELIEF_REAL_ESTATE: StampTable = {
  nonTaxableBelow: 10_000,
  brackets: [
    { upTo: 500_000, tax: 200 },
    { upTo: 1_000_000, tax: 500 },
    { upTo: 5_000_000, tax: 1_000 },
    ...HIGH_BRACKETS_RELIEF,
  ],
};

/** 軽減措置: 建設工事請負契約書（第2号。100万円以下は本則どおり200円） */
export const TABLE_RELIEF_CONSTRUCTION: StampTable = {
  nonTaxableBelow: 10_000,
  brackets: [
    { upTo: 2_000_000, tax: 200 },
    { upTo: 3_000_000, tax: 500 },
    { upTo: 5_000_000, tax: 1_000 },
    ...HIGH_BRACKETS_RELIEF,
  ],
};

/** 第3号文書（約束手形・為替手形）。10万円未満は非課税 */
export const TABLE_NO3: StampTable = {
  nonTaxableBelow: 100_000,
  brackets: [
    { upTo: 1_000_000, tax: 200 },
    { upTo: 2_000_000, tax: 400 },
    { upTo: 3_000_000, tax: 600 },
    { upTo: 5_000_000, tax: 1_000 },
    { upTo: 10_000_000, tax: 2_000 },
    { upTo: 20_000_000, tax: 4_000 },
    { upTo: 30_000_000, tax: 6_000 },
    { upTo: 50_000_000, tax: 10_000 },
    { upTo: 100_000_000, tax: 20_000 },
    { upTo: 200_000_000, tax: 40_000 },
    { upTo: 300_000_000, tax: 60_000 },
    { upTo: 500_000_000, tax: 100_000 },
    { upTo: 1_000_000_000, tax: 150_000 },
    { upTo: null, tax: 200_000 },
  ],
};

/** 第4号文書（株券等。券面金額）。非課税の区分なし */
export const TABLE_NO4: StampTable = {
  nonTaxableBelow: 0,
  brackets: [
    { upTo: 5_000_000, tax: 200 },
    { upTo: 10_000_000, tax: 1_000 },
    { upTo: 50_000_000, tax: 2_000 },
    { upTo: 100_000_000, tax: 10_000 },
    { upTo: null, tax: 20_000 },
  ],
};

/** 第17号文書 売上代金の受取書。5万円未満は非課税 */
export const TABLE_NO17_SALES: StampTable = {
  nonTaxableBelow: 50_000,
  brackets: TABLE_NO3.brackets,
};

/** 第17号文書 売上代金以外の受取書。5万円未満は非課税、以上は200円 */
export const TABLE_NO17_OTHER: StampTable = {
  nonTaxableBelow: 50_000,
  brackets: [{ upTo: null, tax: 200 }],
};

/** 第15号文書（債権譲渡・債務引受）。1万円未満は非課税、以上は200円 */
export const TABLE_NO15: StampTable = {
  nonTaxableBelow: 10_000,
  brackets: [{ upTo: null, tax: 200 }],
};

/** 第16号文書（配当金領収証・支払通知書）。3千円未満は非課税、以上は200円 */
export const TABLE_NO16: StampTable = {
  nonTaxableBelow: 3_000,
  brackets: [{ upTo: null, tax: 200 }],
};

/** 契約金額の記載がない文書の税額（第1号・第2号・第15号・第17号の売上代金） */
export const NO_AMOUNT_TAX = 200;
/** 一覧払等の手形の税額（10万円以上） */
export const DEMAND_BILL_TAX = 200;
/** 軽減措置の対象となる文書の作成期限（この日までに作成されたもの） */
export const RELIEF_DEADLINE = '2027-03-31';

/** 文書の種類（辞書の docTypes の id と対応させる） */
export const DOC_TYPE_IDS = [
  'no1-real-estate',
  'no1-other',
  'no2-construction',
  'no2-other',
  'no3',
  'no4',
  'no5',
  'no6',
  'no7',
  'no8',
  'no9',
  'no10',
  'no11',
  'no12',
  'no13',
  'no14',
  'no15',
  'no16',
  'no17-sales',
  'no17-other',
  'no18',
  'no19',
  'no20',
] as const;

export type DocTypeId = (typeof DOC_TYPE_IDS)[number];

interface DocTypeConfig {
  /** 金額表。null なら定額 */
  table: StampTable | null;
  /** 定額文書の税額 */
  fixedTax: number;
  /** 軽減措置の金額表。対象外なら null */
  reliefTable: StampTable | null;
  /** 契約金額の記載なしを選べるか */
  allowsNoAmount: boolean;
  /** 一覧払等のチェックを選べるか（手形） */
  allowsDemandPayment: boolean;
}

function table(
  t: StampTable,
  options: Partial<DocTypeConfig> = {},
): DocTypeConfig {
  return {
    table: t,
    fixedTax: 0,
    reliefTable: null,
    allowsNoAmount: false,
    allowsDemandPayment: false,
    ...options,
  };
}

function fixed(tax: number): DocTypeConfig {
  return {
    table: null,
    fixedTax: tax,
    reliefTable: null,
    allowsNoAmount: false,
    allowsDemandPayment: false,
  };
}

const DOC_TYPES: Record<DocTypeId, DocTypeConfig> = {
  'no1-real-estate': table(TABLE_NO1, {
    reliefTable: TABLE_RELIEF_REAL_ESTATE,
    allowsNoAmount: true,
  }),
  'no1-other': table(TABLE_NO1, { allowsNoAmount: true }),
  'no2-construction': table(TABLE_NO2, {
    reliefTable: TABLE_RELIEF_CONSTRUCTION,
    allowsNoAmount: true,
  }),
  'no2-other': table(TABLE_NO2, { allowsNoAmount: true }),
  no3: table(TABLE_NO3, { allowsDemandPayment: true }),
  no4: table(TABLE_NO4),
  no5: fixed(40_000),
  no6: fixed(40_000),
  no7: fixed(4_000),
  no8: fixed(200),
  no9: fixed(200),
  no10: fixed(200),
  no11: fixed(200),
  no12: fixed(200),
  no13: fixed(200),
  no14: fixed(200),
  no15: table(TABLE_NO15, { allowsNoAmount: true }),
  no16: table(TABLE_NO16),
  'no17-sales': table(TABLE_NO17_SALES, { allowsNoAmount: true }),
  'no17-other': table(TABLE_NO17_OTHER),
  no18: fixed(200),
  no19: fixed(400),
  no20: fixed(4_000),
};

/** 文書の種類ごとの入力要件（UIの出し分け用） */
export interface DocTypeTraits {
  /** 金額の入力が必要か */
  needsAmount: boolean;
  allowsNoAmount: boolean;
  allowsDemandPayment: boolean;
  /** 軽減措置の対象か */
  reliefEligible: boolean;
}

export function isDocTypeId(value: string): value is DocTypeId {
  return (DOC_TYPE_IDS as readonly string[]).includes(value);
}

export function getDocTypeTraits(id: DocTypeId): DocTypeTraits {
  const c = DOC_TYPES[id];
  return {
    needsAmount: c.table !== null,
    allowsNoAmount: c.allowsNoAmount,
    allowsDemandPayment: c.allowsDemandPayment,
    reliefEligible: c.reliefTable !== null,
  };
}

/** 金額表から税額を引く。非課税なら 0 */
export function lookupTable(t: StampTable, amount: number): number {
  if (amount < t.nonTaxableBelow) return 0;
  for (const b of t.brackets) {
    if (b.upTo === null || amount <= b.upTo) return b.tax;
  }
  return t.brackets[t.brackets.length - 1].tax;
}

export type StampBasis =
  /** 金額が非課税の基準未満 */
  | 'nonTaxable'
  /** 契約金額の記載なし */
  | 'noAmount'
  /** 一覧払等の手形 */
  | 'demandBill'
  /** 金額区分から決まる */
  | 'bracket'
  /** 定額 */
  | 'fixed';

export interface StampDutyInput {
  docType: DocTypeId;
  /** 記載金額（税抜・円）。金額が不要な文書や記載なしのときは null でよい */
  amount: number | null;
  /** 契約金額の記載がない */
  noAmount?: boolean;
  /** 一覧払等の手形 */
  demandPayment?: boolean;
  /** 軽減措置を適用したい */
  relief?: boolean;
  /** 文書の作成日（YYYY-MM-DD）。期限を過ぎていれば軽減しない */
  createdOn?: string;
}

export interface StampDutyResult {
  /** 印紙税額（円）。非課税は 0 */
  tax: number;
  /** 軽減がない場合の税額 */
  normalTax: number;
  basis: StampBasis;
  /** 軽減措置を実際に適用したか */
  reliefApplied: boolean;
  /** 軽減を求められたが作成日が期限を過ぎていた */
  reliefExpired: boolean;
}

function isValidDate(value: string): boolean {
  return /^\d{4}-\d{2}-\d{2}$/.test(value);
}

export function calculateStampDuty(
  input: StampDutyInput,
): StampDutyResult | null {
  const config = DOC_TYPES[input.docType] as DocTypeConfig | undefined;
  if (!config) return null;

  if (config.table === null) {
    return {
      tax: config.fixedTax,
      normalTax: config.fixedTax,
      basis: 'fixed',
      reliefApplied: false,
      reliefExpired: false,
    };
  }

  const useNoAmount = config.allowsNoAmount && input.noAmount === true;
  let amount = 0;
  if (!useNoAmount) {
    if (
      input.amount === null ||
      !Number.isFinite(input.amount) ||
      input.amount < 0
    ) {
      return null;
    }
    amount = Math.floor(input.amount);
  }

  // 軽減措置の可否（対象文書で、作成日が期限内）
  let reliefTable: StampTable | null = null;
  let reliefExpired = false;
  if (config.reliefTable !== null && input.relief === true) {
    if (
      input.createdOn !== undefined &&
      isValidDate(input.createdOn) &&
      input.createdOn > RELIEF_DEADLINE
    ) {
      reliefExpired = true;
    } else {
      reliefTable = config.reliefTable;
    }
  }

  if (useNoAmount) {
    return {
      tax: NO_AMOUNT_TAX,
      normalTax: NO_AMOUNT_TAX,
      basis: 'noAmount',
      reliefApplied: false,
      reliefExpired,
    };
  }

  if (config.allowsDemandPayment && input.demandPayment === true) {
    const tax = amount < config.table.nonTaxableBelow ? 0 : DEMAND_BILL_TAX;
    return {
      tax,
      normalTax: tax,
      basis: tax === 0 ? 'nonTaxable' : 'demandBill',
      reliefApplied: false,
      reliefExpired: false,
    };
  }

  const normalTax = lookupTable(config.table, amount);
  const tax = reliefTable ? lookupTable(reliefTable, amount) : normalTax;
  return {
    tax,
    normalTax,
    basis: normalTax === 0 ? 'nonTaxable' : 'bracket',
    reliefApplied: reliefTable !== null && tax !== normalTax,
    reliefExpired,
  };
}
