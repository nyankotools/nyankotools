export type CardBrand =
  'visa' | 'mastercard' | 'amex' | 'jcb' | 'diners' | 'discover' | 'unionpay';

export const MIN_LENGTH = 2;
export const MAX_LENGTH = 19;

interface BrandRule {
  brand: CardBrand;
  /** 先頭の桁（IIN/BIN の前方一致）に使う判定 */
  match: (digits: string) => boolean;
  lengths: number[];
}

const prefixInRange = (
  digits: string,
  len: number,
  min: number,
  max: number,
) => {
  if (digits.length < len) return false;
  const n = Number(digits.slice(0, len));
  return n >= min && n <= max;
};

const range = (from: number, to: number) =>
  Array.from({ length: to - from + 1 }, (_, i) => from + i);

const RULES: BrandRule[] = [
  { brand: 'visa', match: (d) => d.startsWith('4'), lengths: [13, 16, 19] },
  {
    brand: 'mastercard',
    match: (d) =>
      prefixInRange(d, 2, 51, 55) || prefixInRange(d, 4, 2221, 2720),
    lengths: [16],
  },
  {
    brand: 'amex',
    match: (d) => d.startsWith('34') || d.startsWith('37'),
    lengths: [15],
  },
  {
    brand: 'jcb',
    match: (d) => prefixInRange(d, 4, 3528, 3589),
    lengths: range(16, 19),
  },
  {
    brand: 'diners',
    match: (d) =>
      prefixInRange(d, 3, 300, 305) ||
      d.startsWith('36') ||
      d.startsWith('38') ||
      d.startsWith('39'),
    lengths: range(14, 19),
  },
  {
    brand: 'unionpay',
    match: (d) => d.startsWith('62'),
    lengths: range(16, 19),
  },
  {
    brand: 'discover',
    match: (d) =>
      d.startsWith('6011') ||
      prefixInRange(d, 3, 644, 649) ||
      d.startsWith('65'),
    lengths: range(16, 19),
  },
];

/** 全角数字を半角にし、空白・ハイフン類を取り除く */
export function normalizeCardInput(input: string): string {
  return input
    .replace(/[０-９]/g, (c) => String.fromCharCode(c.charCodeAt(0) - 0xfee0))
    .replace(/[\s\-‐‑‒–—―－ー]/g, '');
}

/** 末尾が検査桁の番号が Luhn を満たすか（数字のみの文字列前提） */
export function isLuhnValid(digits: string): boolean {
  if (!/^\d{2,}$/.test(digits)) return false;
  return luhnSum(digits) % 10 === 0;
}

function luhnSum(digits: string): number {
  let sum = 0;
  let double = false;
  for (let i = digits.length - 1; i >= 0; i--) {
    let d = Number(digits[i]);
    if (double) {
      d *= 2;
      if (d > 9) d -= 9;
    }
    sum += d;
    double = !double;
  }
  return sum;
}

/** 検査桁を除いた本体から、付けるべき検査桁を求める */
export function calcLuhnCheckDigit(payload: string): number {
  // 検査桁（0）を仮に付けた状態で合計し、10 の倍数になるよう補う
  const sum = luhnSum(payload + '0');
  return (10 - (sum % 10)) % 10;
}

export function detectBrand(digits: string): CardBrand | null {
  const rule = RULES.find((r) => r.match(digits));
  return rule ? rule.brand : null;
}

export function isBrandLength(brand: CardBrand, length: number): boolean {
  const rule = RULES.find((r) => r.brand === brand);
  return rule ? rule.lengths.includes(length) : false;
}

/** 表示用に4桁ずつ区切る（Amex は 4-6-5、Diners 14桁は 4-6-4） */
export function formatCardNumber(digits: string, brand: CardBrand | null) {
  if (brand === 'amex' && digits.length === 15) {
    return `${digits.slice(0, 4)} ${digits.slice(4, 10)} ${digits.slice(10)}`;
  }
  if (brand === 'diners' && digits.length === 14) {
    return `${digits.slice(0, 4)} ${digits.slice(4, 10)} ${digits.slice(10)}`;
  }
  return digits.replace(/(\d{4})(?=\d)/g, '$1 ');
}

export type LuhnResult =
  | { kind: 'empty' }
  | { kind: 'invalidChars' }
  | { kind: 'wrongLength'; length: number }
  | {
      kind: 'checked';
      valid: boolean;
      digits: string;
      formatted: string;
      brand: CardBrand | null;
      /** ブランドが判定でき、桁数もそのブランドの範囲内か（ブランド不明は false） */
      lengthMatchesBrand: boolean;
      actualCheckDigit: number;
      expectedCheckDigit: number;
    };

export function checkLuhn(input: string): LuhnResult {
  const digits = normalizeCardInput(input);
  if (digits === '') return { kind: 'empty' };
  if (!/^\d+$/.test(digits)) return { kind: 'invalidChars' };
  if (digits.length < MIN_LENGTH || digits.length > MAX_LENGTH) {
    return { kind: 'wrongLength', length: digits.length };
  }
  const brand = detectBrand(digits);
  return {
    kind: 'checked',
    valid: isLuhnValid(digits),
    digits,
    formatted: formatCardNumber(digits, brand),
    brand,
    lengthMatchesBrand: brand ? isBrandLength(brand, digits.length) : false,
    actualCheckDigit: Number(digits[digits.length - 1]),
    expectedCheckDigit: calcLuhnCheckDigit(digits.slice(0, -1)),
  };
}

/** 決済事業者が公開しているテスト用番号（実在のカードではない） */
export const TEST_NUMBERS: { brand: CardBrand; number: string }[] = [
  { brand: 'visa', number: '4111111111111111' },
  { brand: 'mastercard', number: '5555555555554444' },
  { brand: 'amex', number: '378282246310005' },
  { brand: 'jcb', number: '3530111333300000' },
  { brand: 'diners', number: '30569309025904' },
  { brand: 'discover', number: '6011111111111117' },
  { brand: 'unionpay', number: '6200000000000005' },
];
