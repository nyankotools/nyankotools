export const bitWidths = [8, 16, 32, 64] as const;
export type BitWidth = (typeof bitWidths)[number];

export const bitOps = [
  'and',
  'or',
  'xor',
  'nand',
  'nor',
  'xnor',
  'not',
  'shl',
  'shr',
  'sar',
  'rol',
  'ror',
] as const;
export type BitOp = (typeof bitOps)[number];

/** B（右オペランド）を使わない演算 */
export function isUnary(op: BitOp): boolean {
  return op === 'not';
}

/** B をシフト量・回転量として使う演算 */
export function isShift(op: BitOp): boolean {
  return (
    op === 'shl' || op === 'shr' || op === 'sar' || op === 'rol' || op === 'ror'
  );
}

export type ParseError = 'empty' | 'invalid' | 'out-of-range';

export type ParseResult =
  { ok: true; value: bigint } | { ok: false; reason: ParseError };

function mask(width: number): bigint {
  return (1n << BigInt(width)) - 1n;
}

/**
 * 整数表記を幅 width のビット列（符号なし値）として解釈する。
 * 10進・0x16進・0b2進・0o8進、先頭の-（2の補数に変換）を受け付ける。
 * 符号なし範囲 0..2^w-1、または符号付き範囲 -2^(w-1)..-1 に収まらなければ out-of-range。
 */
export function parseOperand(text: string, width: BitWidth): ParseResult {
  let s = text.trim().replace(/[_\s]/g, '');
  if (s === '') return { ok: false, reason: 'empty' };
  let negative = false;
  if (s.startsWith('-')) {
    negative = true;
    s = s.slice(1);
  } else if (s.startsWith('+')) {
    s = s.slice(1);
  }
  let digits: string;
  let radix: 2 | 8 | 10 | 16;
  const lower = s.toLowerCase();
  if (lower.startsWith('0x')) {
    radix = 16;
    digits = lower.slice(2);
  } else if (lower.startsWith('0b')) {
    radix = 2;
    digits = lower.slice(2);
  } else if (lower.startsWith('0o')) {
    radix = 8;
    digits = lower.slice(2);
  } else {
    radix = 10;
    digits = lower;
  }
  const pattern =
    radix === 16
      ? /^[0-9a-f]+$/
      : radix === 8
        ? /^[0-7]+$/
        : radix === 2
          ? /^[01]+$/
          : /^[0-9]+$/;
  if (!pattern.test(digits)) return { ok: false, reason: 'invalid' };
  if (digits.length > 1000) return { ok: false, reason: 'out-of-range' };
  let n = 0n;
  for (const ch of digits) n = n * BigInt(radix) + BigInt(parseInt(ch, 16));
  if (negative) n = -n;
  const max = mask(width);
  const minSigned = -(1n << BigInt(width - 1));
  if (n > max || n < minSigned) return { ok: false, reason: 'out-of-range' };
  return { ok: true, value: n < 0n ? n + (1n << BigInt(width)) : n };
}

/** 符号なし値を2の補数の符号付き値として読み替える */
export function toSigned(value: bigint, width: BitWidth): bigint {
  return value >= 1n << BigInt(width - 1)
    ? value - (1n << BigInt(width))
    : value;
}

/**
 * 演算を実行し、幅 width に切り詰めた符号なし値を返す。
 * a, b は符号なし値（parseOperand の戻り値）。シフト系では b がシフト量（符号なしの値）。
 */
export function compute(
  op: BitOp,
  a: bigint,
  b: bigint,
  width: BitWidth,
): bigint {
  const m = mask(width);
  const w = BigInt(width);
  switch (op) {
    case 'and':
      return a & b & m;
    case 'or':
      return (a | b) & m;
    case 'xor':
      return (a ^ b) & m;
    case 'nand':
      return ~(a & b) & m;
    case 'nor':
      return ~(a | b) & m;
    case 'xnor':
      return ~(a ^ b) & m;
    case 'not':
      return ~a & m;
    case 'shl':
      return b >= w ? 0n : (a << b) & m;
    case 'shr':
      return b >= w ? 0n : a >> b;
    case 'sar': {
      const signed = toSigned(a, width);
      const count = b >= w ? w - 1n : b;
      return (signed >> count) & m;
    }
    case 'rol': {
      const k = b % w;
      return ((a << k) | (a >> (w - k))) & m;
    }
    case 'ror': {
      const k = b % w;
      return ((a >> k) | (a << (w - k))) & m;
    }
  }
}

export interface BitView {
  /** 符号なし10進 */
  unsigned: string;
  /** 2の補数としての符号付き10進 */
  signed: string;
  /** 0x付き大文字16進（幅に合わせてゼロ埋め） */
  hex: string;
  /** 0o付き8進 */
  octal: string;
  /** 幅ぶんの2進（ゼロ埋め、区切りなし） */
  bits: string;
}

export function describeValue(value: bigint, width: BitWidth): BitView {
  const bits = value.toString(2).padStart(width, '0');
  return {
    unsigned: value.toString(10),
    signed: toSigned(value, width).toString(10),
    hex:
      '0x' +
      value
        .toString(16)
        .toUpperCase()
        .padStart(width / 4, '0'),
    octal: '0o' + value.toString(8),
    bits,
  };
}

/** 4桁ごとにスペースで区切った2進表記 */
export function groupBits(bits: string): string {
  return bits.replace(/(.{4})(?=.)/g, '$1 ');
}

/** 立っているビット数（popcount） */
export function popCount(value: bigint): number {
  let count = 0;
  let v = value;
  while (v > 0n) {
    if (v & 1n) count++;
    v >>= 1n;
  }
  return count;
}
