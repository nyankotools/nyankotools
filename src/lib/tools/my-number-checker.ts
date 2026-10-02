export type NumberKind = 'myNumber' | 'corporate';

export type CheckResult =
  | { kind: 'empty' }
  | { kind: 'invalidChars' }
  | { kind: 'wrongLength'; length: number; expected: number }
  /** 桁数が揃っていて、検査用数字（チェックデジット）を照合した */
  | {
      kind: 'verified';
      valid: boolean;
      /** 正規化した全桁 */
      digits: string;
      actualCheckDigit: number;
      expectedCheckDigit: number;
    }
  /** 検査用数字の1桁手前まで入力されていて、検査用数字を補って全桁を作った */
  | { kind: 'computed'; digits: string; checkDigit: number };

const MY_NUMBER_LENGTH = 12;
const CORPORATE_NUMBER_LENGTH = 13;

/** 全角数字を半角にし、空白・ハイフン類・（法人番号のとき）先頭の「T」を取り除く */
export function normalizeNumberInput(input: string, kind: NumberKind): string {
  let s = input
    .replace(/[０-９Ａ-Ｚａ-ｚ]/g, (c) =>
      String.fromCharCode(c.charCodeAt(0) - 0xfee0),
    )
    .replace(/[\s\-‐‑‒–—―－ー]/g, '');
  if (kind === 'corporate') s = s.replace(/^[Tt]/, '');
  return s;
}

/** 個人番号の検査用数字を、上位11桁から求める */
export function calcMyNumberCheckDigit(first11: string): number {
  let sum = 0;
  for (let n = 1; n <= 11; n++) {
    // n=1 が検査用数字のすぐ左（11桁目）
    const p = Number(first11[11 - n]);
    const q = n <= 6 ? n + 1 : n - 5;
    sum += p * q;
  }
  const remainder = sum % 11;
  return remainder <= 1 ? 0 : 11 - remainder;
}

/** 法人番号の検査用数字を、基礎番号（下位12桁）から求める */
export function calcCorporateCheckDigit(base12: string): number {
  let sum = 0;
  for (let n = 1; n <= 12; n++) {
    // n=1 が最下位（12桁目）。奇数桁×1、偶数桁×2
    const p = Number(base12[12 - n]);
    sum += p * (n % 2 === 1 ? 1 : 2);
  }
  return 9 - (sum % 9);
}

export function checkNumber(input: string, kind: NumberKind): CheckResult {
  const digits = normalizeNumberInput(input, kind);
  if (digits === '') return { kind: 'empty' };
  if (!/^\d+$/.test(digits)) return { kind: 'invalidChars' };

  const fullLength =
    kind === 'myNumber' ? MY_NUMBER_LENGTH : CORPORATE_NUMBER_LENGTH;

  if (digits.length === fullLength) {
    const actual = kind === 'myNumber' ? Number(digits[11]) : Number(digits[0]);
    const expected =
      kind === 'myNumber'
        ? calcMyNumberCheckDigit(digits.slice(0, 11))
        : calcCorporateCheckDigit(digits.slice(1));
    return {
      kind: 'verified',
      valid: actual === expected,
      digits,
      actualCheckDigit: actual,
      expectedCheckDigit: expected,
    };
  }

  if (digits.length === fullLength - 1) {
    if (kind === 'myNumber') {
      const checkDigit = calcMyNumberCheckDigit(digits);
      return { kind: 'computed', digits: digits + checkDigit, checkDigit };
    }
    const checkDigit = calcCorporateCheckDigit(digits);
    return { kind: 'computed', digits: checkDigit + digits, checkDigit };
  }

  return { kind: 'wrongLength', length: digits.length, expected: fullLength };
}
