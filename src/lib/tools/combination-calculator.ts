/** n・r に許す上限（計算量と全桁表示のDOM描画で固まらない範囲） */
export const COMBINATION_MAX = 10000;

export type ParseCountError =
  'empty' | 'invalid' | 'negative' | 'not-integer' | 'too-large';

export type ParseCountResult =
  { ok: true; value: number } | { ok: false; reason: ParseCountError };

/** 0 以上の整数（全角・カンマ区切り・空白可）を読み取る */
export function parseCount(input: string): ParseCountResult {
  const cleaned = input.normalize('NFKC').replace(/[\s,_]/g, '');
  if (cleaned === '') return { ok: false, reason: 'empty' };
  if (/^[-−]\d+(\.\d+)?$/.test(cleaned)) {
    return { ok: false, reason: 'negative' };
  }
  if (/^\d*\.\d*$/.test(cleaned) && /\d/.test(cleaned)) {
    // 12.0 のように小数部が 0 だけなら整数として扱う
    const [intPart, fracPart] = cleaned.split('.');
    if (/^0*$/.test(fracPart) && intPart !== '') {
      return parseCount(intPart);
    }
    return { ok: false, reason: 'not-integer' };
  }
  if (!/^\d+$/.test(cleaned)) return { ok: false, reason: 'invalid' };
  const digits = cleaned.replace(/^0+(?=\d)/, '');
  if (digits.length > 5) return { ok: false, reason: 'too-large' };
  const value = Number(digits);
  if (value > COMBINATION_MAX) return { ok: false, reason: 'too-large' };
  return { ok: true, value };
}

/** n! */
export function factorial(n: number): bigint {
  let result = 1n;
  for (let i = 2; i <= n; i++) result *= BigInt(i);
  return result;
}

/** nPr = n × (n−1) × … × (n−r+1)。r > n は null */
export function permutation(n: number, r: number): bigint | null {
  if (r > n) return null;
  let result = 1n;
  for (let i = n - r + 1; i <= n; i++) result *= BigInt(i);
  return result;
}

/** nCr。r > n は null */
export function combination(n: number, r: number): bigint | null {
  if (r > n) return null;
  const k = Math.min(r, n - r);
  let result = 1n;
  for (let i = 1; i <= k; i++) {
    result = (result * BigInt(n - k + i)) / BigInt(i);
  }
  return result;
}

/** 重複順列 n^r（0^0 は 1） */
export function repeatedPermutation(n: number, r: number): bigint {
  return BigInt(n) ** BigInt(r);
}

/** 重複組合せ nHr = (n+r−1)Cr（n = 0 は r = 0 のときだけ 1） */
export function repeatedCombination(n: number, r: number): bigint {
  if (n === 0) return r === 0 ? 1n : 0n;
  return combination(n + r - 1, r) ?? 0n;
}

export interface CombinationResult {
  n: number;
  r: number;
  factorial: bigint;
  /** r > n のとき null */
  permutation: bigint | null;
  /** r > n のとき null */
  combination: bigint | null;
  repeatedPermutation: bigint;
  repeatedCombination: bigint;
}

export function calculate(n: number, r: number): CombinationResult {
  return {
    n,
    r,
    factorial: factorial(n),
    permutation: permutation(n, r),
    combination: combination(n, r),
    repeatedPermutation: repeatedPermutation(n, r),
    repeatedCombination: repeatedCombination(n, r),
  };
}

/** 有効数字6桁の科学的記法（1.23457e+12）。mantissa は先頭の1桁＋小数部 */
function toScientific(digits: string, exponent: number): string {
  const head = digits[0];
  const tail = digits.slice(1, 6).replace(/0+$/, '');
  const sign = exponent < 0 ? '-' : '+';
  return `${head}${tail ? `.${tail}` : ''}e${sign}${Math.abs(exponent)}`;
}

export interface NumberDescription {
  /** 全桁の10進表記 */
  digits: string;
  /** 桁数 */
  length: number;
  /** 科学的記法（0 は "0"） */
  scientific: string;
}

export function describeNumber(value: bigint): NumberDescription {
  const digits = value.toString();
  if (value === 0n) return { digits, length: 1, scientific: '0' };
  return {
    digits,
    length: digits.length,
    scientific: toScientific(digits, digits.length - 1),
  };
}

/** 1 / value の近似を科学的記法で返す（value ≥ 1）。value が 0 以下は null */
export function reciprocalScientific(value: bigint): string | null {
  if (value <= 0n) return null;
  const length = value.toString().length;
  // 商が 7 桁以上になるようにスケールしてから先頭数桁だけ使う
  const shift = length + 8;
  const scaled = 10n ** BigInt(shift) / value;
  const digits = scaled.toString();
  return toScientific(digits, digits.length - 1 - shift);
}
