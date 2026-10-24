/**
 * 減価償却費の計算（定額法・200%定率法）と少額減価償却資産の判定（令和8年時点の整理）。
 * 平成24年4月1日以後に取得した減価償却資産の償却率表（国税庁「減価償却資産の償却率表」別表第十）に基づく。
 * 定率法は定額法の償却率の2倍（200%定率法）。平成24年3月以前取得の250%定率法・旧200%定率法は対象外。
 * 償却率は整数（千分率・十万分率）で持ち、浮動小数点の誤差を避ける。税制改正のたびに下の定数を見直す。
 */

/** 解説の基準日（令和8年） */
export const DEPRECIATION_BASIS_YEAR = 2026;
/** 備忘価額（償却の最後に帳簿に残す金額） */
export const MEMORANDUM_VALUE = 1;
/** 入力できる取得価額の上限（桁あふれを避ける） */
export const MAX_COST = 10_000_000_000;
/** 耐用年数の下限・上限 */
export const MIN_USEFUL_LIFE = 2;
export const MAX_USEFUL_LIFE = 50;
/** 定率法の償却率表を収録している耐用年数の上限 */
export const MAX_DECLINING_LIFE = 20;

/** 少額の減価償却資産（全額を使用供用年度の損金に算入）: 10万円未満 */
export const SMALL_ASSET_LIMIT = 100_000;
/** 一括償却資産（3年で均等償却）: 20万円未満 */
export const LUMP_SUM_LIMIT = 200_000;
/** 中小企業者等の少額減価償却資産の特例（令和8年3月31日以前の取得）: 30万円未満（従業員500人以下） */
export const SME_SPECIAL_LIMIT_OLD = 300_000;
/** 旧規定の適用期限（この日までに取得・事業供用） */
export const SME_SPECIAL_DEADLINE_OLD = '2026-03-31';
/** 令和8年度改正後（令和8年4月1日〜令和11年3月31日の取得）: 40万円未満（従業員400人以下） */
export const SME_SPECIAL_LIMIT_NEW = 400_000;
export const SME_SPECIAL_FROM_NEW = '2026-04-01';
/** 改正後の特例の適用期限 */
export const SME_SPECIAL_DEADLINE_NEW = '2029-03-31';
/** 年間の合計上限（据え置き） */
export const SME_SPECIAL_ANNUAL_CAP = 3_000_000;

export type DepreciationMethod = 'straight' | 'declining';

export interface DecliningRow {
  /** 耐用年数 */
  life: number;
  /** 償却率（千分率の整数。0.250 → 250） */
  rateMilli: number;
  /** 改定償却率（千分率）。なければ null */
  revisedMilli: number | null;
  /** 保証率（十万分率の整数。0.04448 → 4448）。なければ null */
  guaranteeE5: number | null;
}

/** 200%定率法の償却率表（国税庁 別表第十。平成24年4月1日以後取得、耐用年数2〜20年） */
export const DECLINING_TABLE: readonly DecliningRow[] = [
  { life: 2, rateMilli: 1000, revisedMilli: null, guaranteeE5: null },
  { life: 3, rateMilli: 667, revisedMilli: 1000, guaranteeE5: 11089 },
  { life: 4, rateMilli: 500, revisedMilli: 1000, guaranteeE5: 12499 },
  { life: 5, rateMilli: 400, revisedMilli: 500, guaranteeE5: 10800 },
  { life: 6, rateMilli: 333, revisedMilli: 334, guaranteeE5: 9911 },
  { life: 7, rateMilli: 286, revisedMilli: 334, guaranteeE5: 8680 },
  { life: 8, rateMilli: 250, revisedMilli: 334, guaranteeE5: 7909 },
  { life: 9, rateMilli: 222, revisedMilli: 250, guaranteeE5: 7126 },
  { life: 10, rateMilli: 200, revisedMilli: 250, guaranteeE5: 6552 },
  { life: 11, rateMilli: 182, revisedMilli: 200, guaranteeE5: 5992 },
  { life: 12, rateMilli: 167, revisedMilli: 200, guaranteeE5: 5566 },
  { life: 13, rateMilli: 154, revisedMilli: 167, guaranteeE5: 5180 },
  { life: 14, rateMilli: 143, revisedMilli: 167, guaranteeE5: 4854 },
  { life: 15, rateMilli: 133, revisedMilli: 143, guaranteeE5: 4565 },
  { life: 16, rateMilli: 125, revisedMilli: 143, guaranteeE5: 4294 },
  { life: 17, rateMilli: 118, revisedMilli: 125, guaranteeE5: 4038 },
  { life: 18, rateMilli: 111, revisedMilli: 112, guaranteeE5: 3884 },
  { life: 19, rateMilli: 105, revisedMilli: 112, guaranteeE5: 3693 },
  { life: 20, rateMilli: 100, revisedMilli: 112, guaranteeE5: 3486 },
];

/** 定額法の償却率（千分率の整数）。1/耐用年数 を小数第4位で切り上げた値（0.334, 0.167 など） */
export function straightLineRateMilli(life: number): number {
  return Math.ceil(1000 / life);
}

export interface DepreciationRates {
  /** 定額法の償却率（千分率） */
  straightMilli: number;
  /** 定率法の行。耐用年数が表の範囲外なら null */
  declining: DecliningRow | null;
}

export function getRates(life: number): DepreciationRates | null {
  if (
    !Number.isInteger(life) ||
    life < MIN_USEFUL_LIFE ||
    life > MAX_USEFUL_LIFE
  ) {
    return null;
  }
  return {
    straightMilli: straightLineRateMilli(life),
    declining: DECLINING_TABLE.find((r) => r.life === life) ?? null,
  };
}

export interface DepreciationInput {
  /** 取得価額（円） */
  cost: number;
  /** 耐用年数（年） */
  usefulLife: number;
  method: DepreciationMethod;
  /** 初年度の償却月数（事業供用した月から期末まで、1〜12） */
  firstYearMonths: number;
  /** 初年度の事業年度（西暦。表の見出し用） */
  startYear: number;
}

export interface DepreciationRow {
  year: number;
  /** 期首未償却残高 */
  openingBalance: number;
  /** その年の償却費 */
  depreciation: number;
  /** 期末未償却残高 */
  closingBalance: number;
  /** 定率法で改定償却率に切り替わった後の年か */
  revised: boolean;
  /** 改定償却率に切り替わった最初の年か */
  revisedStart: boolean;
}

export type DepreciationErrorReason =
  'cost' | 'life' | 'months' | 'year' | 'declining-unsupported';

export type DepreciationResult =
  | { ok: false; reason: DepreciationErrorReason }
  | {
      ok: true;
      cost: number;
      usefulLife: number;
      method: DepreciationMethod;
      /** 適用した償却率（千分率）。定額法なら定額法の率、定率法なら定率法の率 */
      rateMilli: number;
      /** 改定償却率（千分率）。定額法・該当なしは null */
      revisedMilli: number | null;
      /** 保証率（十万分率）。定額法・該当なしは null */
      guaranteeE5: number | null;
      /** 償却保証額（取得価額×保証率、1円未満切り捨て）。該当なしは null */
      guaranteeAmount: number | null;
      rows: DepreciationRow[];
      /** 初年度の償却費 */
      firstYearDepreciation: number;
      /** 償却総額（取得価額 − 備忘価額） */
      totalDepreciation: number;
      /** 償却が終わるまでの年数（行数） */
      years: number;
    };

const MAX_YEARS = 150;

function validInt(n: number): boolean {
  return Number.isFinite(n) && Number.isInteger(n);
}

export function calculateDepreciation(
  input: DepreciationInput,
): DepreciationResult {
  const { cost, usefulLife, method, firstYearMonths, startYear } = input;
  if (!validInt(cost) || cost < MEMORANDUM_VALUE + 1 || cost > MAX_COST) {
    return { ok: false, reason: 'cost' };
  }
  const rates = getRates(usefulLife);
  if (!rates) return { ok: false, reason: 'life' };
  if (
    !validInt(firstYearMonths) ||
    firstYearMonths < 1 ||
    firstYearMonths > 12
  ) {
    return { ok: false, reason: 'months' };
  }
  if (!validInt(startYear) || startYear < 1900 || startYear > 2200) {
    return { ok: false, reason: 'year' };
  }
  if (method === 'declining' && !rates.declining) {
    return { ok: false, reason: 'declining-unsupported' };
  }

  const dec = rates.declining;
  const rateMilli =
    method === 'straight'
      ? rates.straightMilli
      : (dec as DecliningRow).rateMilli;
  const revisedMilli =
    method === 'declining' ? (dec?.revisedMilli ?? null) : null;
  const guaranteeE5 =
    method === 'declining' ? (dec?.guaranteeE5 ?? null) : null;
  const guaranteeAmount =
    guaranteeE5 === null ? null : Math.floor((cost * guaranteeE5) / 100_000);

  const rows: DepreciationRow[] = [];
  let balance = cost;
  let revisedBase: number | null = null; // 改定取得価額（改定後の償却の基準額）
  let revisedCount = 0; // 改定償却率で償却した年数
  // 改定償却率で残額を償却し切るまでの年数（例: 0.200 → 5年、0.334 → 3年）
  const revisedYears =
    revisedMilli === null ? 0 : Math.ceil(1000 / revisedMilli);

  for (let i = 0; i < MAX_YEARS && balance > MEMORANDUM_VALUE; i++) {
    const opening = balance;
    const monthFactor = i === 0 ? firstYearMonths : 12;
    let dep: number;
    let revisedNow = false;

    if (method === 'straight') {
      dep = Math.floor((cost * rates.straightMilli * monthFactor) / 12000);
    } else if (revisedBase !== null) {
      revisedCount++;
      dep = Math.floor((revisedBase * (revisedMilli as number)) / 1000);
    } else {
      const pre = Math.floor((opening * rateMilli * monthFactor) / 12000);
      const preAnnual = Math.floor((opening * rateMilli) / 1000);
      if (guaranteeAmount !== null && preAnnual < guaranteeAmount) {
        revisedBase = opening;
        revisedNow = true;
        revisedCount = 1;
        dep = Math.floor((revisedBase * (revisedMilli as number)) / 1000);
      } else {
        dep = pre;
      }
    }

    // 備忘価額1円を残す。0円の年が続いて終わらないことを防ぐため最低1円は進める
    const maxDep = opening - MEMORANDUM_VALUE;
    dep = Math.min(Math.max(dep, 1), maxDep);
    // 改定後の最終年は、端数の差を含めて残額から備忘価額1円を除いた全額を償却する
    if (revisedBase !== null && revisedCount >= revisedYears) dep = maxDep;
    balance = opening - dep;
    rows.push({
      year: startYear + i,
      openingBalance: opening,
      depreciation: dep,
      closingBalance: balance,
      revised: revisedBase !== null,
      revisedStart: revisedNow,
    });
  }

  return {
    ok: true,
    cost,
    usefulLife,
    method,
    rateMilli,
    revisedMilli,
    guaranteeE5,
    guaranteeAmount,
    rows,
    firstYearDepreciation: rows[0]?.depreciation ?? 0,
    totalDepreciation: cost - balance,
    years: rows.length,
  };
}

/** 一括償却資産（3年均等）の年別償却費。月割はしない。端数は最終年に寄せる */
export function lumpSumSchedule(cost: number): [number, number, number] {
  const part = Math.floor(cost / 3);
  return [part, part, cost - part * 2];
}

/**
 * sme-special-old: 令和8年3月31日以前の取得（30万円未満・従業員500人以下）
 * sme-special-new: 令和8年4月1日〜令和11年3月31日の取得（40万円未満・従業員400人以下）
 */
export type SmallAssetOption =
  'expense' | 'lump-sum' | 'sme-special-old' | 'sme-special-new';

export interface SmallAssetJudgement {
  /** 使える扱い（通常の減価償却は常に選べるため含めない） */
  options: SmallAssetOption[];
}

export const DATE_PATTERN = /^(\d{4})-(\d{2})-(\d{2})$/;

export function isValidDateString(value: string): boolean {
  const m = DATE_PATTERN.exec(value);
  if (!m) return false;
  const y = Number(m[1]);
  const mo = Number(m[2]);
  const d = Number(m[3]);
  const dt = new Date(Date.UTC(y, mo - 1, d));
  return (
    dt.getUTCFullYear() === y &&
    dt.getUTCMonth() === mo - 1 &&
    dt.getUTCDate() === d
  );
}

/**
 * 取得価額と取得日から、少額減価償却資産の扱いを判定する。
 * 中小企業者等の特例は取得日で場合分けする（令和8年度改正）。
 *  - 令和8年3月31日以前: 30万円未満
 *  - 令和8年4月1日〜令和11年3月31日: 40万円未満
 *  - それ以降: 特例なし
 * 取得価額は、税抜経理なら税抜、税込経理なら税込の金額を入力する前提。
 */
export function judgeSmallAsset(input: {
  cost: number;
  acquisitionDate: string;
  smallBusiness: boolean;
}): SmallAssetJudgement | null {
  const { cost, acquisitionDate, smallBusiness } = input;
  if (!validInt(cost) || cost < 1 || cost > MAX_COST) return null;
  if (!isValidDateString(acquisitionDate)) return null;
  const options: SmallAssetOption[] = [];
  if (cost < SMALL_ASSET_LIMIT) options.push('expense');
  else if (cost < LUMP_SUM_LIMIT) options.push('lump-sum');
  if (smallBusiness) {
    if (
      acquisitionDate <= SME_SPECIAL_DEADLINE_OLD &&
      cost < SME_SPECIAL_LIMIT_OLD
    ) {
      options.push('sme-special-old');
    } else if (
      acquisitionDate >= SME_SPECIAL_FROM_NEW &&
      acquisitionDate <= SME_SPECIAL_DEADLINE_NEW &&
      cost < SME_SPECIAL_LIMIT_NEW
    ) {
      options.push('sme-special-new');
    }
  }
  return { options };
}
