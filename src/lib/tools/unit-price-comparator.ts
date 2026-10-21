export type PriceUnit = 'g' | 'kg' | 'ml' | 'l' | 'piece';
export type UnitDimension = 'weight' | 'volume' | 'count';
/** 税込のまま / 税抜(10%) / 税抜(8%) */
export type TaxMode = 'included' | 'excl10' | 'excl8';

export const PRICE_UNITS: PriceUnit[] = ['g', 'kg', 'ml', 'l', 'piece'];
export const TAX_MODES: TaxMode[] = ['included', 'excl10', 'excl8'];

const UNIT_INFO: Record<
  PriceUnit,
  { dimension: UnitDimension; factor: number }
> = {
  g: { dimension: 'weight', factor: 1 },
  kg: { dimension: 'weight', factor: 1000 },
  ml: { dimension: 'volume', factor: 1 },
  l: { dimension: 'volume', factor: 1000 },
  piece: { dimension: 'count', factor: 1 },
};

const TAX_RATE: Record<TaxMode, number> = {
  included: 0,
  excl10: 0.1,
  excl8: 0.08,
};

export interface UnitPriceRowInput {
  name: string;
  /** 価格（文字列のまま。空欄は未入力扱い） */
  price: string;
  /** 内容量（1パックあたり） */
  quantity: string;
  /** パック・個数（空欄なら 1） */
  count: string;
  unit: PriceUnit;
  taxMode: TaxMode;
}

export type RowIssue = 'invalid' | 'dimensionMismatch';

export interface UnitPriceItem {
  /** 入力行の番号（0始まり） */
  index: number;
  name: string;
  /** 税込価格 */
  taxIncludedPrice: number;
  /** 合計量（基準単位: g / ml / 個） */
  totalAmount: number;
  /** 基準単位あたりの価格（重さ・容量は100あたり、個数は1個あたり） */
  unitPrice: number;
  /** 最安との差（%）。最安は 0 */
  diffPercent: number;
  isCheapest: boolean;
  /** 安い順の順位（1始まり。同価格は同順位） */
  rank: number;
}

export interface UnitPriceIssue {
  index: number;
  issue: RowIssue;
}

export type UnitPriceResult =
  | {
      dimension: UnitDimension;
      /** 入力順 */
      items: UnitPriceItem[];
      cheapestIndexes: number[];
      issues: UnitPriceIssue[];
    }
  | { error: 'tooFew'; issues: UnitPriceIssue[] };

export function unitDimension(unit: PriceUnit): UnitDimension {
  return UNIT_INFO[unit].dimension;
}

/** 重さ・容量は100あたり、個数は1あたりで比較する */
export function baseAmount(dimension: UnitDimension): number {
  return dimension === 'count' ? 1 : 100;
}

function parsePositive(text: string): number | null {
  const trimmed = text.trim();
  if (trimmed === '') return null;
  const n = Number(trimmed);
  return Number.isFinite(n) && n > 0 ? n : null;
}

function isBlank(row: UnitPriceRowInput): boolean {
  return row.price.trim() === '' && row.quantity.trim() === '';
}

/** 価格・内容量・個数から単価を求めて最安を判定する。空行は無視する。 */
export function compareUnitPrices(rows: UnitPriceRowInput[]): UnitPriceResult {
  const issues: UnitPriceIssue[] = [];
  interface Valid {
    index: number;
    row: UnitPriceRowInput;
    price: number;
    amount: number;
  }
  const valid: Valid[] = [];

  rows.forEach((row, index) => {
    if (isBlank(row)) return;
    const price = parsePositive(row.price);
    const quantity = parsePositive(row.quantity);
    const countText = row.count.trim();
    const count = countText === '' ? 1 : parsePositive(countText);
    if (price === null || quantity === null || count === null) {
      issues.push({ index, issue: 'invalid' });
      return;
    }
    valid.push({
      index,
      row,
      price: price * (1 + TAX_RATE[row.taxMode]),
      amount: quantity * count * UNIT_INFO[row.unit].factor,
    });
  });

  if (valid.length === 0) return { error: 'tooFew', issues };
  const dimension = UNIT_INFO[valid[0].row.unit].dimension;
  const usable = valid.filter((v) => {
    if (UNIT_INFO[v.row.unit].dimension === dimension) return true;
    issues.push({ index: v.index, issue: 'dimensionMismatch' });
    return false;
  });
  issues.sort((a, b) => a.index - b.index);
  if (usable.length < 2) return { error: 'tooFew', issues };

  const base = baseAmount(dimension);
  const unitPrices = usable.map((v) => (v.price / v.amount) * base);
  const min = Math.min(...unitPrices);
  const EPS = 1e-9;

  const items: UnitPriceItem[] = usable.map((v, i) => {
    const unitPrice = unitPrices[i];
    const isCheapest = unitPrice - min <= min * EPS;
    return {
      index: v.index,
      name: v.row.name.trim(),
      taxIncludedPrice: v.price,
      totalAmount: v.amount,
      unitPrice,
      diffPercent: isCheapest ? 0 : ((unitPrice - min) / min) * 100,
      isCheapest,
      rank: 1 + unitPrices.filter((u) => u < unitPrice - min * EPS).length,
    };
  });

  return {
    dimension,
    items,
    cheapestIndexes: items.filter((x) => x.isCheapest).map((x) => x.index),
    issues,
  };
}
