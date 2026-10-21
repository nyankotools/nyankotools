/** 行列計算機のロジック。要素は BigInt の有理数（既約分数）で厳密に扱う。 */

export const MAX_MATRIX_SIZE = 6;
export const DECIMAL_DIGITS = 6;

export interface Fraction {
  /** 分子（符号を持つ） */
  n: bigint;
  /** 分母（常に正） */
  d: bigint;
}

export type Matrix = Fraction[][];

export type MatrixError =
  'sizeMismatch' | 'notSquare' | 'singular' | 'empty' | 'invalid';

export type MatrixResult =
  { ok: true; matrix: Matrix } | { ok: false; error: MatrixError };

export type ScalarResult =
  { ok: true; value: Fraction } | { ok: false; error: MatrixError };

export type ParseMatrixResult =
  | { ok: true; matrix: Matrix }
  | { ok: false; error: 'empty' | 'invalid'; row: number; col: number };

function abs(x: bigint): bigint {
  return x < 0n ? -x : x;
}

function gcd(a: bigint, b: bigint): bigint {
  a = abs(a);
  b = abs(b);
  while (b !== 0n) {
    [a, b] = [b, a % b];
  }
  return a;
}

export function makeFraction(n: bigint, d: bigint = 1n): Fraction {
  if (d === 0n) throw new RangeError('denominator is zero');
  if (d < 0n) {
    n = -n;
    d = -d;
  }
  const g = gcd(n, d);
  if (g > 1n) {
    n /= g;
    d /= g;
  }
  if (n === 0n) d = 1n;
  return { n, d };
}

const ZERO: Fraction = { n: 0n, d: 1n };
const ONE: Fraction = { n: 1n, d: 1n };

export function add(a: Fraction, b: Fraction): Fraction {
  return makeFraction(a.n * b.d + b.n * a.d, a.d * b.d);
}

export function sub(a: Fraction, b: Fraction): Fraction {
  return makeFraction(a.n * b.d - b.n * a.d, a.d * b.d);
}

export function mul(a: Fraction, b: Fraction): Fraction {
  return makeFraction(a.n * b.n, a.d * b.d);
}

export function div(a: Fraction, b: Fraction): Fraction {
  return makeFraction(a.n * b.d, a.d * b.n);
}

export function isZero(a: Fraction): boolean {
  return a.n === 0n;
}

function parseDecimalPart(s: string): Fraction | null {
  const m = /^(\d*)(?:\.(\d*))?$/.exec(s);
  if (!m) return null;
  const intPart = m[1];
  const fracPart = m[2] ?? '';
  if (intPart === '' && fracPart === '') return null;
  const digits = BigInt(intPart + fracPart);
  return makeFraction(digits, 10n ** BigInt(fracPart.length));
}

/**
 * 「3」「-2.5」「3/4」「-1.5/2」形式の文字列を有理数にする。
 * 全角数字・全角スラッシュ・「−」も受け付ける。不正なら null。
 */
export function parseFraction(input: string): Fraction | null {
  const s = input
    .normalize('NFKC')
    .replace(/[−‐-―ー]/g, '-')
    .replace(/\s+/g, '');
  if (s === '') return null;
  let sign = 1n;
  let body = s;
  if (body[0] === '-' || body[0] === '+') {
    if (body[0] === '-') sign = -1n;
    body = body.slice(1);
  }
  const parts = body.split('/');
  if (parts.length > 2) return null;
  const num = parseDecimalPart(parts[0]);
  if (!num) return null;
  if (parts.length === 1) return makeFraction(sign * num.n, num.d);
  const den = parseDecimalPart(parts[1]);
  if (!den || den.n === 0n) return null;
  const q = div(num, den);
  return makeFraction(sign * q.n, q.d);
}

/** 文字列セルの2次元配列を行列にする。空欄は 0 として扱う。 */
export function parseMatrix(cells: string[][]): ParseMatrixResult {
  if (cells.length === 0 || cells[0].length === 0) {
    return { ok: false, error: 'empty', row: 0, col: 0 };
  }
  const matrix: Matrix = [];
  for (let r = 0; r < cells.length; r++) {
    const row: Fraction[] = [];
    for (let c = 0; c < cells[r].length; c++) {
      if (cells[r][c].trim() === '') {
        row.push(ZERO);
        continue;
      }
      const f = parseFraction(cells[r][c]);
      if (!f) return { ok: false, error: 'invalid', row: r, col: c };
      row.push(f);
    }
    matrix.push(row);
  }
  return { ok: true, matrix };
}

function dims(m: Matrix): [number, number] {
  return [m.length, m.length === 0 ? 0 : m[0].length];
}

export function addMatrices(a: Matrix, b: Matrix): MatrixResult {
  const [ar, ac] = dims(a);
  const [br, bc] = dims(b);
  if (ar !== br || ac !== bc) return { ok: false, error: 'sizeMismatch' };
  return {
    ok: true,
    matrix: a.map((row, i) => row.map((v, j) => add(v, b[i][j]))),
  };
}

export function subtractMatrices(a: Matrix, b: Matrix): MatrixResult {
  const [ar, ac] = dims(a);
  const [br, bc] = dims(b);
  if (ar !== br || ac !== bc) return { ok: false, error: 'sizeMismatch' };
  return {
    ok: true,
    matrix: a.map((row, i) => row.map((v, j) => sub(v, b[i][j]))),
  };
}

export function multiplyMatrices(a: Matrix, b: Matrix): MatrixResult {
  const [ar, ac] = dims(a);
  const [br, bc] = dims(b);
  if (ac !== br) return { ok: false, error: 'sizeMismatch' };
  const result: Matrix = [];
  for (let i = 0; i < ar; i++) {
    const row: Fraction[] = [];
    for (let j = 0; j < bc; j++) {
      let sum = ZERO;
      for (let k = 0; k < ac; k++) sum = add(sum, mul(a[i][k], b[k][j]));
      row.push(sum);
    }
    result.push(row);
  }
  return { ok: true, matrix: result };
}

export function scaleMatrix(a: Matrix, k: Fraction): Matrix {
  return a.map((row) => row.map((v) => mul(v, k)));
}

export function transposeMatrix(a: Matrix): Matrix {
  const [r, c] = dims(a);
  const result: Matrix = [];
  for (let j = 0; j < c; j++) {
    const row: Fraction[] = [];
    for (let i = 0; i < r; i++) row.push(a[i][j]);
    result.push(row);
  }
  return result;
}

export function determinant(a: Matrix): ScalarResult {
  const [r, c] = dims(a);
  if (r === 0 || r !== c) return { ok: false, error: 'notSquare' };
  const m = a.map((row) => row.slice());
  let det = ONE;
  for (let col = 0; col < r; col++) {
    let pivot = -1;
    for (let i = col; i < r; i++) {
      if (!isZero(m[i][col])) {
        pivot = i;
        break;
      }
    }
    if (pivot === -1) return { ok: true, value: ZERO };
    if (pivot !== col) {
      [m[pivot], m[col]] = [m[col], m[pivot]];
      det = makeFraction(-det.n, det.d);
    }
    det = mul(det, m[col][col]);
    for (let i = col + 1; i < r; i++) {
      if (isZero(m[i][col])) continue;
      const factor = div(m[i][col], m[col][col]);
      for (let j = col; j < r; j++) {
        m[i][j] = sub(m[i][j], mul(factor, m[col][j]));
      }
    }
  }
  return { ok: true, value: det };
}

/** ガウス・ジョルダン法による逆行列。特異行列は 'singular'。 */
export function inverseMatrix(a: Matrix): MatrixResult {
  const [r, c] = dims(a);
  if (r === 0 || r !== c) return { ok: false, error: 'notSquare' };
  const m = a.map((row, i) =>
    row.concat(Array.from({ length: r }, (_, j) => (i === j ? ONE : ZERO))),
  );
  for (let col = 0; col < r; col++) {
    let pivot = -1;
    for (let i = col; i < r; i++) {
      if (!isZero(m[i][col])) {
        pivot = i;
        break;
      }
    }
    if (pivot === -1) return { ok: false, error: 'singular' };
    if (pivot !== col) [m[pivot], m[col]] = [m[col], m[pivot]];
    const p = m[col][col];
    m[col] = m[col].map((v) => div(v, p));
    for (let i = 0; i < r; i++) {
      if (i === col || isZero(m[i][col])) continue;
      const factor = m[i][col];
      m[i] = m[i].map((v, j) => sub(v, mul(factor, m[col][j])));
    }
  }
  return { ok: true, matrix: m.map((row) => row.slice(r)) };
}

/** 分数表示。整数は分母を省略する（例: 3/4, -2）。 */
export function formatFraction(f: Fraction): string {
  return f.d === 1n ? f.n.toString() : `${f.n}/${f.d}`;
}

/** 小数表示。指定桁で四捨五入し、末尾の 0 は落とす。 */
export function formatDecimal(
  f: Fraction,
  digits: number = DECIMAL_DIGITS,
): string {
  const negative = f.n < 0n;
  const scale = 10n ** BigInt(digits);
  const q = (abs(f.n) * scale * 2n + f.d) / (2n * f.d);
  const intPart = q / scale;
  const fracPart = (q % scale)
    .toString()
    .padStart(digits, '0')
    .replace(/0+$/, '');
  const body = fracPart === '' ? intPart.toString() : `${intPart}.${fracPart}`;
  return negative && q !== 0n ? `-${body}` : body;
}

export type DisplayMode = 'fraction' | 'decimal';

export function formatValue(f: Fraction, mode: DisplayMode): string {
  return mode === 'fraction' ? formatFraction(f) : formatDecimal(f);
}

/** コピー用: 行をタブ区切り、行間を改行にしたテキスト。 */
export function matrixToText(m: Matrix, mode: DisplayMode): string {
  return m
    .map((row) => row.map((v) => formatValue(v, mode)).join('\t'))
    .join('\n');
}
