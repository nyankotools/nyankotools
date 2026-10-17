import { roundBy, type RoundingMode } from './tax-calculator';

export type { RoundingMode };

export type DocumentType = 'invoice' | 'quote' | 'receipt' | 'delivery';

/** 明細1行あたり・合計の上限（円）。浮動小数点の誤差が整数部に出ない範囲に収める */
export const MAX_AMOUNT = 1e10;
export const MAX_ITEMS = 50;

/** 税率（%）。10=標準、8=軽減、0=非課税・免税など */
export type TaxRate = 10 | 8 | 0;
export const TAX_RATES: readonly TaxRate[] = [10, 8, 0];

export interface InvoiceItemInput {
  name: string;
  quantity: number;
  /** 単価。値引き行のために負の値も許す */
  unitPrice: number;
  taxRate: TaxRate;
}

export interface InvoiceInput {
  items: InvoiceItemInput[];
  /** true: 単価は税込 / false: 単価は税抜 */
  priceIncludesTax: boolean;
  /** 明細金額（数量×単価）と消費税額の端数処理方法 */
  rounding: RoundingMode;
}

export interface InvoiceLine {
  name: string;
  quantity: number;
  unitPrice: number;
  taxRate: TaxRate;
  /** 数量×単価（端数処理後）。単価が税込なら税込、税抜なら税抜の金額 */
  amount: number;
}

export interface TaxGroup {
  taxRate: TaxRate;
  /** 税抜の合計 */
  taxableAmount: number;
  taxAmount: number;
  /** 税込の合計 */
  includedAmount: number;
}

export interface InvoiceResult {
  lines: InvoiceLine[];
  /** 税率ごとの集計（10%・8%・0%の順。該当する明細がある税率のみ） */
  groups: TaxGroup[];
  subtotal: number;
  taxAmount: number;
  total: number;
}

export type InvoiceError =
  | { kind: 'no-items' }
  | { kind: 'too-many-items' }
  | { kind: 'invalid-item'; index: number }
  | { kind: 'too-large' };

/** 負の値は絶対値で端数処理して符号を戻す（値引き行でも切り捨て・切り上げが対称になる） */
function roundAmount(value: number, rounding: RoundingMode): number {
  const rounded = roundBy(Math.abs(value), rounding);
  return value < 0 ? -rounded : rounded;
}

/**
 * 明細から、税率ごとの課税対象額・消費税額と合計を計算する。
 * 適格請求書では「税率ごとに区分して合計した対価の額」に対して消費税額を1回だけ端数処理するため、
 * 明細ごとではなく税率ごとの合計に対して税額を求める。
 * 数量が0未満・単価や数量がNaN/無限・上限超過などは error を返す。
 */
export function calculateInvoice(
  input: InvoiceInput,
): { ok: true; result: InvoiceResult } | { ok: false; error: InvoiceError } {
  const { items, priceIncludesTax, rounding } = input;
  if (items.length === 0) return { ok: false, error: { kind: 'no-items' } };
  if (items.length > MAX_ITEMS)
    return { ok: false, error: { kind: 'too-many-items' } };

  const lines: InvoiceLine[] = [];
  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    if (
      !Number.isFinite(item.quantity) ||
      !(item.quantity >= 0) ||
      !Number.isFinite(item.unitPrice) ||
      !TAX_RATES.includes(item.taxRate)
    ) {
      return { ok: false, error: { kind: 'invalid-item', index: i } };
    }
    const raw = item.quantity * item.unitPrice;
    if (Math.abs(raw) > MAX_AMOUNT)
      return { ok: false, error: { kind: 'too-large' } };
    lines.push({
      name: item.name,
      quantity: item.quantity,
      unitPrice: item.unitPrice,
      taxRate: item.taxRate,
      amount: roundAmount(raw, rounding),
    });
  }

  const groups: TaxGroup[] = [];
  for (const taxRate of TAX_RATES) {
    const inRate = lines.filter((l) => l.taxRate === taxRate);
    if (inRate.length === 0) continue;
    const sum = inRate.reduce((acc, l) => acc + l.amount, 0);
    if (Math.abs(sum) > MAX_AMOUNT)
      return { ok: false, error: { kind: 'too-large' } };
    if (priceIncludesTax) {
      const taxAmount = roundAmount(
        (sum * taxRate) / (100 + taxRate),
        rounding,
      );
      groups.push({
        taxRate,
        taxableAmount: sum - taxAmount,
        taxAmount,
        includedAmount: sum,
      });
    } else {
      const taxAmount = roundAmount((sum * taxRate) / 100, rounding);
      groups.push({
        taxRate,
        taxableAmount: sum,
        taxAmount,
        includedAmount: sum + taxAmount,
      });
    }
  }

  const subtotal = groups.reduce((acc, g) => acc + g.taxableAmount, 0);
  const taxAmount = groups.reduce((acc, g) => acc + g.taxAmount, 0);
  const total = groups.reduce((acc, g) => acc + g.includedAmount, 0);
  if (Math.abs(total) > MAX_AMOUNT)
    return { ok: false, error: { kind: 'too-large' } };

  return { ok: true, result: { lines, groups, subtotal, taxAmount, total } };
}

/** 全角英数字・ハイフン類を半角にし、空白とハイフンを除いて大文字にする */
export function normalizeRegistrationNumber(value: string): string {
  return value
    .normalize('NFKC')
    .replace(/[\s\-−‐‑–—ー]/g, '')
    .toUpperCase();
}

/**
 * 適格請求書発行事業者の登録番号の形式（T＋13桁の数字）かどうか。
 * 国税庁の登録有無までは確認できない（形式のみ）。空欄は未入力として true。
 */
export function isValidRegistrationNumber(value: string): boolean {
  const normalized = normalizeRegistrationNumber(value);
  return normalized === '' || /^T\d{13}$/.test(normalized);
}
