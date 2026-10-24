/**
 * FX計算機のロジック。
 * レートは「最小変動（1/10 pip）」の整数に直してから差を取り、浮動小数の誤差を避ける。
 */

export const PAIRS = [
  'USD/JPY',
  'EUR/JPY',
  'GBP/JPY',
  'AUD/JPY',
  'NZD/JPY',
  'CAD/JPY',
  'CHF/JPY',
  'ZAR/JPY',
  'MXN/JPY',
  'TRY/JPY',
  'EUR/USD',
  'GBP/USD',
  'AUD/USD',
  'NZD/USD',
  'USD/CAD',
  'USD/CHF',
  'EUR/GBP',
  'EUR/AUD',
  'EUR/CHF',
  'GBP/AUD',
  'GBP/CHF',
  'AUD/NZD',
] as const;

export type Pair = (typeof PAIRS)[number];
export type Direction = 'buy' | 'sell';
export type FxField = 'units' | 'leverage' | 'entry' | 'exit' | 'quoteRate';

export interface FxInput {
  pair: string;
  /** 取引量（ロット）。小数可（0.01ロットなど） */
  lots: number;
  /** 1ロットあたりの通貨数（100000 または 10000 など） */
  lotSize: number;
  leverage: number;
  direction: Direction;
  entry: number;
  exit: number;
  /** クォート通貨→円のレート。クォート通貨が円のときは無視する */
  quoteJpyRate: number;
}

export interface FxResult {
  pair: string;
  quote: string;
  units: number;
  /** 1pipの大きさ（クォート通貨）。円ペアは0.01、それ以外は0.0001 */
  pipSize: number;
  /** 損益（pips）。1/10 pip単位まで */
  pips: number;
  /** 1pipあたりの損益額（円） */
  pipValueJpy: number;
  /** 損益（クォート通貨） */
  profitQuote: number;
  /** 損益（円・1円未満四捨五入） */
  profitJpy: number;
  /** 必要証拠金（円・1円未満切り上げ） */
  marginJpy: number;
  /** 建玉の評価額（円・1円未満四捨五入） */
  notionalJpy: number;
}

export type FxOutcome =
  { ok: true; result: FxResult } | { ok: false; field: FxField };

export function quoteCurrency(pair: string): string {
  return pair.split('/')[1] ?? '';
}

export function pipSizeOf(pair: string): number {
  return quoteCurrency(pair) === 'JPY' ? 0.01 : 0.0001;
}

function isPositive(n: number): boolean {
  return Number.isFinite(n) && n > 0;
}

/** 浮動小数の微小誤差を除いて四捨五入する */
function roundHalfUp(n: number): number {
  const sign = n < 0 ? -1 : 1;
  return sign * Math.round(Math.abs(n) * (1 + 1e-12));
}

function ceilSafe(n: number): number {
  return Math.ceil(n - 1e-7);
}

export function calculateFx(input: FxInput): FxOutcome {
  const quote = quoteCurrency(input.pair);
  if (!(PAIRS as readonly string[]).includes(input.pair)) {
    return { ok: false, field: 'entry' };
  }
  const units = isPositive(input.lots * input.lotSize)
    ? Math.round(input.lots * input.lotSize)
    : 0;
  if (units < 1 || units > 1e10) return { ok: false, field: 'units' };
  if (!isPositive(input.leverage) || input.leverage > 10000) {
    return { ok: false, field: 'leverage' };
  }
  if (!isPositive(input.entry)) return { ok: false, field: 'entry' };
  if (!isPositive(input.exit)) return { ok: false, field: 'exit' };
  const isJpyQuote = quote === 'JPY';
  const quoteRate = isJpyQuote ? 1 : input.quoteJpyRate;
  if (!isPositive(quoteRate)) return { ok: false, field: 'quoteRate' };

  const pipSize = pipSizeOf(input.pair);
  // 1/10 pip を1とする整数。円ペアは0.001、それ以外は0.00001
  const pointsPerUnit = isJpyQuote ? 1000 : 100000;
  const entryPoints = Math.round(input.entry * pointsPerUnit);
  const exitPoints = Math.round(input.exit * pointsPerUnit);
  if (entryPoints < 1 || exitPoints < 1) {
    return { ok: false, field: entryPoints < 1 ? 'entry' : 'exit' };
  }

  const diffPoints =
    input.direction === 'buy'
      ? exitPoints - entryPoints
      : entryPoints - exitPoints;
  const pips = diffPoints / 10;
  const profitQuote = (units * diffPoints) / pointsPerUnit;
  const profitJpy = roundHalfUp(profitQuote * quoteRate);
  const pipValueJpy = units * pipSize * quoteRate;
  const notionalQuote = (units * entryPoints) / pointsPerUnit;
  const notionalJpy = roundHalfUp(notionalQuote * quoteRate);
  const marginJpy = ceilSafe((notionalQuote * quoteRate) / input.leverage);

  return {
    ok: true,
    result: {
      pair: input.pair,
      quote,
      units,
      pipSize,
      pips,
      pipValueJpy,
      profitQuote,
      profitJpy: profitJpy === 0 ? 0 : profitJpy,
      marginJpy,
      notionalJpy,
    },
  };
}
