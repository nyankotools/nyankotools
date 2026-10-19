export type Precision = 32 | 64;

export type InputKind = 'decimal' | 'expression' | 'hex' | 'binary';

export type FloatCategory =
  'zero' | 'subnormal' | 'normal' | 'infinity' | 'nan-quiet' | 'nan-signaling';

export interface Ieee754Result {
  precision: Precision;
  kind: InputKind;
  /** 全ビットを表す整数 */
  bits: bigint;
  /** 0x付き大文字16進（桁数固定） */
  hex: string;
  /** 符号・指数部・仮数部をスペースで区切った2進文字列 */
  binary: string;
  sign: 0 | 1;
  exponentBits: string;
  mantissaBits: string;
  exponentField: number;
  /** 指数部のバイアス（float32: 127、float64: 1023） */
  bias: number;
  /** 実効指数。無限大・NaNでは null */
  exponent: number | null;
  /** 暗黙の先頭ビット（正規化数 1、非正規化数・ゼロ 0、特殊値 null） */
  leadingBit: 0 | 1 | null;
  category: FloatCategory;
  /** この精度で表される値（JSのnumber。float32は float64 で正確に表現できる） */
  value: number;
  /** 2進数としての正確な10進展開。無限大・NaNでは null */
  exact: string | null;
  /** 往復できる最短の10進表記 */
  shortest: string;
}

const SPECS = {
  32: { exp: 8, man: 23, bias: 127 },
  64: { exp: 11, man: 52, bias: 1023 },
} as const;

const NUM = String.raw`[+-]?(?:\d+(?:\.\d*)?|\.\d+)(?:e[+-]?\d+)?`;
const NUMBER_RE = new RegExp(`^${NUM}$`, 'i');
const EXPR_RE = new RegExp(`^(${NUM})\\s*([+\\-*/])\\s*(${NUM})$`, 'i');

function round(value: number, precision: Precision): number {
  return precision === 32 ? Math.fround(value) : value;
}

/** number を指定精度のビット列に変換する */
export function numberToBits(value: number, precision: Precision): bigint {
  const view = new DataView(new ArrayBuffer(8));
  if (precision === 32) {
    view.setFloat32(0, value);
    return BigInt(view.getUint32(0));
  }
  view.setFloat64(0, value);
  return view.getBigUint64(0);
}

/** ビット列を number に変換する */
export function bitsToNumber(bits: bigint, precision: Precision): number {
  const view = new DataView(new ArrayBuffer(8));
  if (precision === 32) {
    view.setUint32(0, Number(bits));
    return view.getFloat32(0);
  }
  view.setBigUint64(0, bits);
  return view.getFloat64(0);
}

function exactDecimal(
  negative: boolean,
  mantissaInt: bigint,
  exponent: number,
): string {
  const sign = negative ? '-' : '';
  if (mantissaInt === 0n) return `${sign}0`;
  if (exponent >= 0)
    return `${sign}${(mantissaInt << BigInt(exponent)).toString()}`;
  const k = -exponent;
  const n = mantissaInt * 5n ** BigInt(k);
  const digits = n.toString().padStart(k + 1, '0');
  const intPart = digits.slice(0, digits.length - k);
  const frac = digits.slice(digits.length - k).replace(/0+$/, '');
  return `${sign}${intPart}${frac ? `.${frac}` : ''}`;
}

function shortestRepr(value: number, precision: Precision): string {
  if (precision === 64 || !Number.isFinite(value) || value === 0) {
    return Object.is(value, -0) ? '-0' : String(value);
  }
  for (let digits = 1; digits <= 9; digits++) {
    const s = value.toPrecision(digits);
    if (Math.fround(Number(s)) === value) return String(Number(s));
  }
  return String(value);
}

/** ビット列から全フィールドを分解する */
export function decodeBits(
  bits: bigint,
  precision: Precision,
  kind: InputKind,
): Ieee754Result {
  const { exp, man, bias } = SPECS[precision];
  const mask = (1n << BigInt(man)) - 1n;
  const mantissa = bits & mask;
  const exponentField = Number(
    (bits >> BigInt(man)) & ((1n << BigInt(exp)) - 1n),
  );
  const sign = Number(bits >> BigInt(precision - 1)) & 1;
  const maxExp = (1 << exp) - 1;

  let category: FloatCategory;
  let exponent: number | null;
  let leadingBit: 0 | 1 | null;
  if (exponentField === maxExp) {
    exponent = null;
    leadingBit = null;
    if (mantissa === 0n) category = 'infinity';
    else if ((mantissa >> BigInt(man - 1)) & 1n) category = 'nan-quiet';
    else category = 'nan-signaling';
  } else if (exponentField === 0) {
    exponent = 1 - bias;
    leadingBit = 0;
    category = mantissa === 0n ? 'zero' : 'subnormal';
  } else {
    exponent = exponentField - bias;
    leadingBit = 1;
    category = 'normal';
  }

  const value = bitsToNumber(bits, precision);
  const exact =
    exponent === null
      ? null
      : exactDecimal(
          sign === 1,
          (BigInt(leadingBit ?? 0) << BigInt(man)) | mantissa,
          exponent - man,
        );

  const full = bits.toString(2).padStart(precision, '0');
  const exponentBits = full.slice(1, 1 + exp);
  const mantissaBits = full.slice(1 + exp);
  return {
    precision,
    kind,
    bits,
    hex: `0x${bits
      .toString(16)
      .toUpperCase()
      .padStart(precision / 4, '0')}`,
    binary: `${full[0]} ${exponentBits} ${mantissaBits}`,
    sign: sign as 0 | 1,
    exponentBits,
    mantissaBits,
    exponentField,
    bias,
    exponent,
    leadingBit,
    category,
    value,
    exact,
    shortest: shortestRepr(value, precision),
  };
}

function parseSpecial(text: string): number | null {
  const m = /^([+-]?)(nan|inf|infinity)$/i.exec(text);
  if (!m) return null;
  if (m[2].toLowerCase() === 'nan') return NaN;
  return m[1] === '-' ? -Infinity : Infinity;
}

function applyOp(a: number, op: string, b: number, precision: Precision) {
  const x = round(a, precision);
  const y = round(b, precision);
  switch (op) {
    case '+':
      return round(x + y, precision);
    case '-':
      return round(x - y, precision);
    case '*':
      return round(x * y, precision);
    default:
      return round(x / y, precision);
  }
}

/**
 * 入力文字列を解釈して分解結果を返す。解釈できない場合は null。
 * - 10進数 / NaN / Infinity / 「0.1+0.2」のような2項の四則演算
 * - 0x付き16進（桁数は precision/4 以下）
 * - 2進ビット列（ぴったり precision 桁、または0b付きで precision 桁以下）
 */
export function analyze(
  input: string,
  precision: Precision,
): Ieee754Result | null {
  const text = input.trim();
  if (text === '') return null;

  if (/^0x/i.test(text)) {
    const digits = text.slice(2).replace(/[\s_]/g, '');
    if (!/^[0-9a-f]+$/i.test(digits) || digits.length > precision / 4) {
      return null;
    }
    return decodeBits(BigInt(`0x${digits}`), precision, 'hex');
  }

  const prefixed = /^0b/i.test(text);
  const compact = (prefixed ? text.slice(2) : text).replace(/[\s_]/g, '');
  if (/^[01]+$/.test(compact)) {
    const ok = prefixed
      ? compact.length <= precision
      : compact.length === precision;
    if (ok) return decodeBits(BigInt(`0b${compact}`), precision, 'binary');
    if (prefixed) return null;
  } else if (prefixed) {
    return null;
  }

  const special = parseSpecial(text);
  if (special !== null) {
    const v = Number.isNaN(special) ? NaN : special;
    return decodeBits(numberToBits(v, precision), precision, 'decimal');
  }
  if (NUMBER_RE.test(text)) {
    const v = Number(text);
    if (!Number.isFinite(v) && !/e/i.test(text)) return null;
    return decodeBits(numberToBits(v, precision), precision, 'decimal');
  }
  const expr = EXPR_RE.exec(text);
  if (expr) {
    const v = applyOp(Number(expr[1]), expr[2], Number(expr[3]), precision);
    return decodeBits(numberToBits(v, precision), precision, 'expression');
  }
  return null;
}
