export type UnsignedBase = 2 | 8 | 16;
export type BitWidth = 8 | 16 | 32 | 64;

export interface BaseConverterResult {
  binary: string;
  octal: string;
  decimal: string;
  hex: string;
}

export interface SignedRange {
  min: bigint;
  max: bigint;
}

function twoPow(exponent: number): bigint {
  return 1n << BigInt(exponent);
}

/** 指定ビット幅の2の補数表現で表せる符号付き整数の範囲（下限・上限） */
export function signedRange(bitWidth: BitWidth): SignedRange {
  const max = twoPow(bitWidth - 1) - 1n;
  return { min: -twoPow(bitWidth - 1), max };
}

/** 指定ビット幅の生ビット値（非負）として表せる最大値（2^ビット幅 - 1） */
export function unsignedMax(bitWidth: BitWidth): bigint {
  return twoPow(bitWidth) - 1n;
}

/** 符号付き整数を、指定ビット幅の2の補数表現における非負の生ビット値に変換する */
export function signedToRawBits(value: bigint, bitWidth: BitWidth): bigint {
  return value < 0n ? value + twoPow(bitWidth) : value;
}

/** 指定ビット幅の2の補数表現の生ビット値を、符号付き整数に変換する */
export function rawBitsToSigned(raw: bigint, bitWidth: BitWidth): bigint {
  const half = twoPow(bitWidth - 1);
  return raw >= half ? raw - twoPow(bitWidth) : raw;
}

const UNSIGNED_DIGIT_PATTERNS: Record<UnsignedBase, RegExp> = {
  2: /^[01]+$/,
  8: /^[0-7]+$/,
  16: /^[0-9a-fA-F]+$/,
};

const UNSIGNED_PREFIXES: Record<UnsignedBase, string> = {
  2: '0b',
  8: '0o',
  16: '0x',
};

function stripPrefix(input: string, base: UnsignedBase): string {
  const prefix = UNSIGNED_PREFIXES[base];
  return input.slice(0, 2).toLowerCase() === prefix ? input.slice(2) : input;
}

/**
 * 2/8/16進の文字列を、ビット幅を考慮せずに生ビット値（非負）としてパースする。
 * ビット列を表す入力のため符号（+/-）は受け付けない。0x/0b/0oプレフィックスは許容する。
 * 空文字・不正な形式はnull。
 */
export function parseUnsignedDigits(
  input: string,
  base: UnsignedBase,
): bigint | null {
  const trimmed = input.trim();
  if (trimmed.startsWith('-') || trimmed.startsWith('+')) return null;

  const digits = stripPrefix(trimmed, base);
  if (digits === '' || !UNSIGNED_DIGIT_PATTERNS[base].test(digits)) {
    return null;
  }

  return BigInt(`${UNSIGNED_PREFIXES[base]}${digits}`);
}

/**
 * 2/8/16進の文字列を、指定ビット幅の生ビット値（非負）としてパースする。
 * 形式が不正な場合、および指定ビット幅で表せない値の場合はnull。
 */
export function parseUnsignedInBase(
  input: string,
  base: UnsignedBase,
  bitWidth: BitWidth,
): bigint | null {
  const value = parseUnsignedDigits(input, base);
  if (value === null) return null;
  return value <= unsignedMax(bitWidth) ? value : null;
}

/**
 * 10進数の文字列を、ビット幅を考慮せずに符号付き整数としてパースする。
 * 先頭の+/-を許容する。空文字・不正な形式はnull。
 */
export function parseSignedDigits(input: string): bigint | null {
  const trimmed = input.trim();
  if (!/^[+-]?[0-9]+$/.test(trimmed)) return null;
  return BigInt(trimmed);
}

/**
 * 10進数の文字列を符号付き整数としてパースする。先頭の+/-を許容する。
 * 形式が不正な場合、および指定ビット幅の2の補数表現で表せる範囲を超える値はnull。
 */
export function parseSignedDecimal(
  input: string,
  bitWidth: BitWidth,
): bigint | null {
  const value = parseSignedDigits(input);
  if (value === null) return null;
  const { min, max } = signedRange(bitWidth);
  return value >= min && value <= max ? value : null;
}

/**
 * 符号付き整数を、指定ビット幅の2の補数表現による2進数・8進数・10進数・16進数の文字列に変換する。
 * 2進数・16進数はビット幅に応じて0埋めする（例: 8bitの-1は2進数で"11111111"、16進数で"FF"）。
 */
export function convertToAllBases(
  value: bigint,
  bitWidth: BitWidth,
): BaseConverterResult {
  const raw = signedToRawBits(value, bitWidth);
  return {
    binary: raw.toString(2).padStart(bitWidth, '0'),
    octal: raw.toString(8),
    decimal: value.toString(10),
    hex: raw
      .toString(16)
      .toUpperCase()
      .padStart(bitWidth / 4, '0'),
  };
}
