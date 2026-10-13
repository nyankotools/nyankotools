/** ローマ数字で表せる範囲（標準的な表記） */
export const ROMAN_MIN = 1;
export const ROMAN_MAX = 3999;

const SYMBOLS: [number, string][] = [
  [1000, 'M'],
  [900, 'CM'],
  [500, 'D'],
  [400, 'CD'],
  [100, 'C'],
  [90, 'XC'],
  [50, 'L'],
  [40, 'XL'],
  [10, 'X'],
  [9, 'IX'],
  [5, 'V'],
  [4, 'IV'],
  [1, 'I'],
];

const SYMBOL_VALUES: Record<string, number> = {
  I: 1,
  V: 5,
  X: 10,
  L: 50,
  C: 100,
  D: 500,
  M: 1000,
};

/** 標準的な表記（同じ文字の連続は3つまで、減算則は IV IX XL XC CD CM のみ） */
const STRICT_PATTERN =
  /^M{0,3}(CM|CD|D?C{0,3})(XC|XL|L?X{0,3})(IX|IV|V?I{0,3})$/;
/** 繰り返しの回数制限だけを外した表記（IIII・VIIII・XXXX など） */
const LENIENT_PATTERN = /^M*(CM|CD|D?C*)(XC|XL|L?X*)(IX|IV|V?I*)$/;

export interface RomanPart {
  symbol: string;
  value: number;
}

export interface RomanOutputOptions {
  /** Unicode のローマ数字文字（Ⅻ・Ⅹ など）で出力する */
  unicode: boolean;
  /** 小文字（i, ii, iii）で出力する */
  lowercase: boolean;
}

export type ToRomanError = 'invalid' | 'out-of-range';

export type ToRomanResult =
  | {
      ok: true;
      value: number;
      /** ASCII の大文字（MCMXCIV） */
      roman: string;
      /** オプション適用後の表示用文字列 */
      output: string;
      parts: RomanPart[];
    }
  | { ok: false; reason: ToRomanError };

export type FromRomanResult =
  /** 標準的な表記 */
  | { kind: 'ok'; value: number; roman: string; parts: RomanPart[] }
  /** 値は読めるが標準形ではない（IIII など）。roman は正規形 */
  | { kind: 'nonstandard'; value: number; roman: string; parts: RomanPart[] }
  | { kind: 'error'; reason: 'empty' | 'invalid-char' | 'invalid-form' }
  | { kind: 'error'; reason: 'out-of-range'; value: number };

/** 1〜3999 の整数をローマ数字（ASCII大文字）にして、構成要素も返す。範囲外は null */
export function integerToRoman(
  n: number,
): { roman: string; parts: RomanPart[] } | null {
  if (!Number.isInteger(n) || n < ROMAN_MIN || n > ROMAN_MAX) return null;
  let rest = n;
  const parts: RomanPart[] = [];
  for (const [value, symbol] of SYMBOLS) {
    while (rest >= value) {
      parts.push({ symbol, value });
      rest -= value;
    }
  }
  return { roman: parts.map((p) => p.symbol).join(''), parts };
}

/** 標準形のローマ数字（ASCII大文字）を数値化する。数字としての妥当性は呼び出し側が確認する */
function romanValue(roman: string): number {
  let total = 0;
  for (let i = 0; i < roman.length; i++) {
    const current = SYMBOL_VALUES[roman[i]];
    const next = SYMBOL_VALUES[roman[i + 1]] ?? 0;
    total += current < next ? -current : current;
  }
  return total;
}

const UPPER_UNICODE: Record<string, string> = {
  I: 'Ⅰ',
  V: 'Ⅴ',
  X: 'Ⅹ',
  L: 'Ⅼ',
  C: 'Ⅽ',
  D: 'Ⅾ',
  M: 'Ⅿ',
};
const LOWER_UNICODE: Record<string, string> = {
  I: 'ⅰ',
  V: 'ⅴ',
  X: 'ⅹ',
  L: 'ⅼ',
  C: 'ⅽ',
  D: 'ⅾ',
  M: 'ⅿ',
};

/** ASCII大文字のローマ数字を、オプションに従った表示用文字列にする */
export function formatRoman(
  roman: string,
  value: number,
  options: RomanOutputOptions,
): string {
  if (options.unicode) {
    // 1〜12 は合字（Ⅰ〜Ⅻ）を1文字で出す
    if (value >= 1 && value <= 12) {
      return String.fromCodePoint(
        (options.lowercase ? 0x2170 : 0x2160) + value - 1,
      );
    }
    const table = options.lowercase ? LOWER_UNICODE : UPPER_UNICODE;
    return [...roman].map((c) => table[c]).join('');
  }
  return options.lowercase ? roman.toLowerCase() : roman;
}

/** 入力のゆれ（全角・Unicodeローマ数字・空白・大小文字）をそろえる */
function normalizeRomanInput(input: string): string {
  return input.normalize('NFKC').replace(/\s+/g, '').toUpperCase();
}

/** 算用数字（全角・カンマ区切り可）→ ローマ数字 */
export function convertToRoman(
  input: string,
  options: RomanOutputOptions,
): ToRomanResult {
  const cleaned = input.normalize('NFKC').replace(/[\s,_]/g, '');
  if (!/^\d+$/.test(cleaned)) return { ok: false, reason: 'invalid' };
  // 先頭の0は無視。桁数が多すぎる場合は Number 化せず範囲外にする
  const digits = cleaned.replace(/^0+(?=\d)/, '');
  if (digits.length > 7) return { ok: false, reason: 'out-of-range' };
  const value = Number(digits);
  const converted = integerToRoman(value);
  if (!converted) return { ok: false, reason: 'out-of-range' };
  return {
    ok: true,
    value,
    roman: converted.roman,
    output: formatRoman(converted.roman, value, options),
    parts: converted.parts,
  };
}

/** ローマ数字 → 算用数字。IIII など標準形でない表記は値と正規形を添えて返す */
export function convertFromRoman(input: string): FromRomanResult {
  const roman = normalizeRomanInput(input);
  if (roman === '') return { kind: 'error', reason: 'empty' };
  if (!/^[IVXLCDM]+$/.test(roman)) {
    return { kind: 'error', reason: 'invalid-char' };
  }
  if (STRICT_PATTERN.test(roman)) {
    const value = romanValue(roman);
    const converted = integerToRoman(value);
    if (converted) {
      return { kind: 'ok', value, roman, parts: converted.parts };
    }
  }
  if (LENIENT_PATTERN.test(roman)) {
    const value = romanValue(roman);
    const converted = integerToRoman(value);
    if (converted) {
      return {
        kind: 'nonstandard',
        value,
        roman: converted.roman,
        parts: converted.parts,
      };
    }
    return { kind: 'error', reason: 'out-of-range', value };
  }
  return { kind: 'error', reason: 'invalid-form' };
}

/** 構成要素を「M=1000 + CM=900」の形に整形する（言語に依存しない記号表記） */
export function formatParts(parts: RomanPart[]): string {
  return parts.map((p) => `${p.symbol}=${p.value}`).join(' + ');
}
