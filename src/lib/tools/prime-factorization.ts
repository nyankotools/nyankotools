/** 入力できる桁数の上限 */
export const MAX_DIGITS = 60;
/** GCD/LCM で受け付ける値の個数の上限 */
export const MAX_LIST_ITEMS = 1000;
/** 約数を一覧表示する個数の上限（これを超えたら個数と総和のみ） */
export const MAX_LISTED_DIVISORS = 5000;
/** 既定の打ち切り（Pollard's rho の反復回数・ミリ秒） */
export const DEFAULT_MAX_ITERATIONS = 20_000_000;
export const DEFAULT_TIMEOUT_MS = 2500;
/** Miller-Rabin が決定的になる上限（この値未満は確実な判定） */
export const DETERMINISTIC_LIMIT = 3317044064679887385961981n;

export type ParseError =
  'empty' | 'invalid' | 'decimal' | 'negative' | 'zero' | 'too-long';

export type ParseResult =
  { ok: true; value: bigint } | { ok: false; reason: ParseError };

/** 全角・符号のゆれをそろえる */
function normalizeNumber(input: string): string {
  return input
    .normalize('NFKC')
    .replace(/[−‐‑–—ー]/g, '-')
    .trim();
}

/** 正の整数（1以上）を BigInt として読み取る。桁区切りのカンマ・空白・_ は無視する */
export function parsePositiveInteger(input: string): ParseResult {
  const cleaned = normalizeNumber(input).replace(/[\s,_]/g, '');
  if (cleaned === '') return { ok: false, reason: 'empty' };
  if (/^[+-]?\d*\.\d*$/.test(cleaned) && /\d/.test(cleaned)) {
    return { ok: false, reason: 'decimal' };
  }
  const m = /^([+-]?)(\d+)$/.exec(cleaned);
  if (!m) return { ok: false, reason: 'invalid' };
  const digits = m[2].replace(/^0+(?=\d)/, '');
  if (digits.length > MAX_DIGITS) return { ok: false, reason: 'too-long' };
  const value = BigInt(digits);
  if (value === 0n) return { ok: false, reason: 'zero' };
  if (m[1] === '-') return { ok: false, reason: 'negative' };
  return { ok: true, value };
}

export type ListParseResult =
  | { ok: true; values: bigint[] }
  | {
      ok: false;
      reason: ParseError | 'too-few' | 'too-many';
      /** 1始まりの位置と、問題の入力（reason が個別の値のエラーのとき） */
      index?: number;
      token?: string;
    };

/** カンマ・空白・改行・読点区切りの整数リストを読み取る */
export function parseIntegerList(input: string): ListParseResult {
  const tokens = normalizeNumber(input)
    .split(/[\s,;、，]+/)
    .filter((s) => s !== '');
  if (tokens.length === 0) return { ok: false, reason: 'empty' };
  if (tokens.length > MAX_LIST_ITEMS) return { ok: false, reason: 'too-many' };
  const values: bigint[] = [];
  for (let i = 0; i < tokens.length; i++) {
    const r = parsePositiveInteger(tokens[i]);
    if (!r.ok) {
      return { ok: false, reason: r.reason, index: i + 1, token: tokens[i] };
    }
    values.push(r.value);
  }
  if (values.length < 2) return { ok: false, reason: 'too-few' };
  return { ok: true, values };
}

export function gcd(a: bigint, b: bigint): bigint {
  let x = a < 0n ? -a : a;
  let y = b < 0n ? -b : b;
  while (y !== 0n) {
    [x, y] = [y, x % y];
  }
  return x;
}

export function lcm(a: bigint, b: bigint): bigint {
  if (a === 0n || b === 0n) return 0n;
  return (a / gcd(a, b)) * b;
}

export interface GcdLcmResult {
  gcd: bigint;
  lcm: bigint;
  coprime: boolean;
}

export function gcdLcm(values: bigint[]): GcdLcmResult {
  let g = values[0] ?? 0n;
  let l = values[0] ?? 0n;
  for (let i = 1; i < values.length; i++) {
    g = gcd(g, values[i]);
    l = lcm(l, values[i]);
  }
  return { gcd: g, lcm: l, coprime: g === 1n };
}

function modPow(base: bigint, exp: bigint, mod: bigint): bigint {
  let result = 1n;
  let b = base % mod;
  let e = exp;
  while (e > 0n) {
    if (e & 1n) result = (result * b) % mod;
    b = (b * b) % mod;
    e >>= 1n;
  }
  return result;
}

const SMALL_PRIMES = [
  2n,
  3n,
  5n,
  7n,
  11n,
  13n,
  17n,
  19n,
  23n,
  29n,
  31n,
  37n,
  41n,
  43n,
  47n,
  53n,
  59n,
  61n,
  67n,
  71n,
  73n,
  79n,
  83n,
  89n,
  97n,
];

/** 素数判定（Miller-Rabin）。DETERMINISTIC_LIMIT 未満は確実、それ以上は確率的 */
export function isPrime(n: bigint): boolean {
  if (n < 2n) return false;
  for (const p of SMALL_PRIMES) {
    if (n === p) return true;
    if (n % p === 0n) return false;
  }
  let d = n - 1n;
  let r = 0;
  while ((d & 1n) === 0n) {
    d >>= 1n;
    r++;
  }
  const bases =
    n < DETERMINISTIC_LIMIT ? SMALL_PRIMES.slice(0, 13) : SMALL_PRIMES;
  for (const a of bases) {
    let x = modPow(a, d, n);
    if (x === 1n || x === n - 1n) continue;
    let composite = true;
    for (let i = 1; i < r; i++) {
      x = (x * x) % n;
      if (x === n - 1n) {
        composite = false;
        break;
      }
    }
    if (composite) return false;
  }
  return true;
}

export interface PrimeFactor {
  prime: bigint;
  exponent: number;
}

export interface FactorizeOptions {
  maxIterations?: number;
  timeoutMs?: number;
}

class GiveUp extends Error {}

interface Budget {
  iterations: number;
  maxIterations: number;
  deadline: number;
}

function isqrt(n: bigint): bigint {
  if (n < 2n) return n;
  // 平方根以上の値から、ニュートン法で単調に下げて整数平方根に収束させる
  let x = 1n << BigInt(Math.ceil(n.toString(2).length / 2));
  for (;;) {
    const y = (x + n / x) >> 1n;
    if (y >= x) break;
    x = y;
  }
  return x;
}

/** n（奇数の合成数）の非自明な約数を Pollard's rho で探す */
function findFactor(n: bigint, budget: Budget): bigint {
  const root = isqrt(n);
  if (root * root === n) return root;
  for (let c = 1n; c < 200n; c++) {
    let x = 2n;
    let y = 2n;
    for (;;) {
      const sx = x;
      const sy = y;
      let q = 1n;
      for (let i = 0; i < 128; i++) {
        x = (x * x + c) % n;
        y = (y * y + c) % n;
        y = (y * y + c) % n;
        const diff = x > y ? x - y : y - x;
        q = (q * diff) % n;
      }
      budget.iterations += 128;
      if (
        budget.iterations > budget.maxIterations ||
        Date.now() > budget.deadline
      ) {
        throw new GiveUp();
      }
      let d = gcd(q, n);
      if (d === 1n) continue;
      if (d === n) {
        // バッチ内で一致した: 1ステップずつやり直して約数を特定する
        x = sx;
        y = sy;
        do {
          x = (x * x + c) % n;
          y = (y * y + c) % n;
          y = (y * y + c) % n;
          d = gcd(x > y ? x - y : y - x, n);
        } while (d === 1n);
      }
      if (d !== n) return d;
      break; // 失敗: 次の c で再挑戦
    }
  }
  throw new GiveUp();
}

function collect(n: bigint, budget: Budget, out: Map<bigint, number>): void {
  if (n === 1n) return;
  if (isPrime(n)) {
    out.set(n, (out.get(n) ?? 0) + 1);
    return;
  }
  const d = findFactor(n, budget);
  collect(d, budget, out);
  collect(n / d, budget, out);
}

export type FactorizeResult =
  | {
      ok: true;
      value: bigint;
      factors: PrimeFactor[];
      isPrime: boolean;
      /** 素因数に DETERMINISTIC_LIMIT 以上の素数が含まれ、素数判定が確率的であるとき true */
      probable: boolean;
      divisorCount: bigint;
      divisorSum: bigint;
      /** 約数の個数が多すぎるときは null */
      divisors: bigint[] | null;
    }
  | { ok: false; reason: 'too-small' | 'gave-up' };

/** 2以上の整数を素因数分解する。時間・反復回数の上限を超えたら gave-up を返す */
export function factorize(
  value: bigint,
  options: FactorizeOptions = {},
): FactorizeResult {
  if (value < 2n) return { ok: false, reason: 'too-small' };
  const budget: Budget = {
    iterations: 0,
    maxIterations: options.maxIterations ?? DEFAULT_MAX_ITERATIONS,
    deadline: Date.now() + (options.timeoutMs ?? DEFAULT_TIMEOUT_MS),
  };
  const found = new Map<bigint, number>();
  let rest = value;
  // 小さい素数での試し割り（ここで大半の数は片付く）
  for (let p = 2n; p < 1000n && p * p <= rest; p += p === 2n ? 1n : 2n) {
    while (rest % p === 0n) {
      found.set(p, (found.get(p) ?? 0) + 1);
      rest /= p;
    }
  }
  try {
    collect(rest, budget, found);
  } catch (e) {
    if (e instanceof GiveUp) return { ok: false, reason: 'gave-up' };
    throw e;
  }
  const factors = [...found.entries()]
    .map(([prime, exponent]) => ({ prime, exponent }))
    .sort((a, b) => (a.prime < b.prime ? -1 : a.prime > b.prime ? 1 : 0));

  let divisorCount = 1n;
  let divisorSum = 1n;
  for (const f of factors) {
    divisorCount *= BigInt(f.exponent + 1);
    divisorSum *= (f.prime ** BigInt(f.exponent + 1) - 1n) / (f.prime - 1n);
  }
  return {
    ok: true,
    value,
    factors,
    isPrime: factors.length === 1 && factors[0].exponent === 1,
    probable: factors.some((f) => f.prime >= DETERMINISTIC_LIMIT),
    divisorCount,
    divisorSum,
    divisors:
      divisorCount <= BigInt(MAX_LISTED_DIVISORS)
        ? listDivisors(factors)
        : null,
  };
}

/** 素因数分解から約数を昇順で列挙する */
export function listDivisors(factors: PrimeFactor[]): bigint[] {
  let divisors: bigint[] = [1n];
  for (const { prime, exponent } of factors) {
    const next: bigint[] = [];
    let power = 1n;
    for (let e = 0; e <= exponent; e++) {
      for (const d of divisors) next.push(d * power);
      power *= prime;
    }
    divisors = next;
  }
  return divisors.sort((a, b) => (a < b ? -1 : a > b ? 1 : 0));
}

/** 「2^3 × 3 × 5^2」形式の積表記 */
export function formatFactorization(factors: PrimeFactor[]): string {
  return factors
    .map((f) => (f.exponent === 1 ? `${f.prime}` : `${f.prime}^${f.exponent}`))
    .join(' × ');
}
