import { describe, expect, it } from 'vitest';
import {
  MAX_DIGITS,
  MAX_LISTED_DIVISORS,
  factorize,
  formatFactorization,
  gcd,
  gcdLcm,
  isPrime,
  lcm,
  listDivisors,
  parseIntegerList,
  parsePositiveInteger,
} from './prime-factorization';

function factorsOf(n: bigint): [bigint, number][] {
  const r = factorize(n);
  if (!r.ok) throw new Error('factorize failed');
  return r.factors.map((f) => [f.prime, f.exponent]);
}

describe('parsePositiveInteger', () => {
  it('整数を BigInt にする（全角・カンマ・空白・先頭ゼロ・+符号）', () => {
    expect(parsePositiveInteger('360')).toEqual({ ok: true, value: 360n });
    expect(parsePositiveInteger('１，２３４')).toEqual({
      ok: true,
      value: 1234n,
    });
    expect(parsePositiveInteger(' 007 ')).toEqual({ ok: true, value: 7n });
    expect(parsePositiveInteger('+12')).toEqual({ ok: true, value: 12n });
  });

  it('空・0・負数・小数・文字はエラー', () => {
    expect(parsePositiveInteger('  ')).toEqual({ ok: false, reason: 'empty' });
    expect(parsePositiveInteger('0')).toEqual({ ok: false, reason: 'zero' });
    expect(parsePositiveInteger('000')).toEqual({ ok: false, reason: 'zero' });
    expect(parsePositiveInteger('-5')).toEqual({
      ok: false,
      reason: 'negative',
    });
    expect(parsePositiveInteger('−5')).toEqual({
      ok: false,
      reason: 'negative',
    });
    expect(parsePositiveInteger('3.5')).toEqual({
      ok: false,
      reason: 'decimal',
    });
    expect(parsePositiveInteger('1e5')).toEqual({
      ok: false,
      reason: 'invalid',
    });
    expect(parsePositiveInteger('abc')).toEqual({
      ok: false,
      reason: 'invalid',
    });
  });

  it('桁数の上限を超えるとエラー', () => {
    expect(parsePositiveInteger('9'.repeat(MAX_DIGITS)).ok).toBe(true);
    expect(parsePositiveInteger('9'.repeat(MAX_DIGITS + 1))).toEqual({
      ok: false,
      reason: 'too-long',
    });
  });
});

describe('parseIntegerList', () => {
  it('カンマ・空白・改行で区切れる', () => {
    expect(parseIntegerList('12, 18\n24 30、36')).toEqual({
      ok: true,
      values: [12n, 18n, 24n, 30n, 36n],
    });
  });

  it('1個だけ・空・不正値の位置を返す', () => {
    expect(parseIntegerList('12')).toEqual({ ok: false, reason: 'too-few' });
    expect(parseIntegerList('')).toEqual({ ok: false, reason: 'empty' });
    expect(parseIntegerList('12, x, 18')).toEqual({
      ok: false,
      reason: 'invalid',
      index: 2,
      token: 'x',
    });
    expect(parseIntegerList('12, 0')).toMatchObject({
      ok: false,
      reason: 'zero',
      index: 2,
    });
  });
});

describe('gcd / lcm', () => {
  it('2値と複数値', () => {
    expect(gcd(12n, 18n)).toBe(6n);
    expect(lcm(4n, 6n)).toBe(12n);
    expect(gcdLcm([12n, 18n, 24n])).toEqual({
      gcd: 6n,
      lcm: 72n,
      coprime: false,
    });
    expect(gcdLcm([8n, 15n])).toEqual({ gcd: 1n, lcm: 120n, coprime: true });
  });

  it('1を含む・BigIntの大きな値', () => {
    expect(gcdLcm([1n, 99n])).toEqual({ gcd: 1n, lcm: 99n, coprime: true });
    const big = 10n ** 40n;
    expect(gcd(big, big * 3n)).toBe(big);
    expect(lcm(big, 3n)).toBe(big * 3n);
  });
});

describe('isPrime', () => {
  it('小さい数と大きな素数', () => {
    expect(isPrime(1n)).toBe(false);
    expect(isPrime(2n)).toBe(true);
    expect(isPrime(97n)).toBe(true);
    expect(isPrime(561n)).toBe(false); // カーマイケル数
    expect(isPrime(2n ** 61n - 1n)).toBe(true);
    expect(isPrime(2n ** 61n + 1n)).toBe(false);
  });
});

describe('factorize', () => {
  it('小さい数', () => {
    expect(factorsOf(12n)).toEqual([
      [2n, 2],
      [3n, 1],
    ]);
    expect(factorsOf(360n)).toEqual([
      [2n, 3],
      [3n, 2],
      [5n, 1],
    ]);
    expect(factorsOf(1024n)).toEqual([[2n, 10]]);
  });

  it('素数・約数の個数と総和', () => {
    const p = factorize(97n);
    expect(p).toMatchObject({
      ok: true,
      isPrime: true,
      divisorCount: 2n,
      divisorSum: 98n,
    });
    const c = factorize(360n);
    expect(c).toMatchObject({
      ok: true,
      isPrime: false,
      divisorCount: 24n,
      divisorSum: 1170n,
    });
    if (c.ok) {
      expect(c.divisors).toHaveLength(24);
      expect(c.divisors?.slice(0, 5)).toEqual([1n, 2n, 3n, 4n, 5n]);
      expect(c.divisors?.at(-1)).toBe(360n);
    }
  });

  it('1未満は too-small', () => {
    expect(factorize(1n)).toEqual({ ok: false, reason: 'too-small' });
    expect(factorize(0n)).toEqual({ ok: false, reason: 'too-small' });
  });

  it('2^53 を超える数でも正確', () => {
    expect(factorsOf(2n ** 61n - 1n)).toEqual([[2n ** 61n - 1n, 1]]);
    expect(factorsOf(2n ** 64n)).toEqual([[2n, 64]]);
    const n = 1000000007n * 998244353n * 1000000009n;
    expect(factorsOf(n)).toEqual([
      [998244353n, 1],
      [1000000007n, 1],
      [1000000009n, 1],
    ]);
  });

  it('大きな素数の累乗と平方数', () => {
    const p = 1000000007n;
    expect(factorsOf(p * p)).toEqual([[p, 2]]);
    expect(factorsOf(p ** 3n)).toEqual([[p, 3]]);
  });

  it('積が元の数に戻る（ランダム風の合成数）', () => {
    for (const n of [
      123456789n,
      9999999967n * 3n,
      600851475143n,
      10n ** 20n + 1n,
    ]) {
      const r = factorize(n);
      expect(r.ok).toBe(true);
      if (r.ok) {
        const product = r.factors.reduce(
          (acc, f) => acc * f.prime ** BigInt(f.exponent),
          1n,
        );
        expect(product).toBe(n);
        expect(r.factors.every((f) => isPrime(f.prime))).toBe(true);
      }
    }
  });

  it('上限を超えたら不完全な結果を返さず gave-up', () => {
    const n = 1000000007n * 998244353n;
    expect(factorize(n, { maxIterations: 0 })).toEqual({
      ok: false,
      reason: 'gave-up',
    });
    // 上限が十分なら分解できる
    expect(factorize(n).ok).toBe(true);
  });

  it('約数が多すぎるときは一覧を省略する', () => {
    // 2^a 3^b 5^c 7^d ... の積で約数が MAX_LISTED_DIVISORS を超える数
    const n =
      2n ** 10n * 3n ** 6n * 5n ** 4n * 7n ** 3n * 11n ** 2n * 13n ** 2n;
    const r = factorize(n);
    expect(r.ok).toBe(true);
    if (r.ok) {
      expect(r.divisorCount > BigInt(MAX_LISTED_DIVISORS)).toBe(true);
      expect(r.divisors).toBeNull();
    }
  });
});

describe('formatFactorization / listDivisors', () => {
  it('積表記と約数一覧', () => {
    const factors = [
      { prime: 2n, exponent: 3 },
      { prime: 3n, exponent: 1 },
      { prime: 5n, exponent: 2 },
    ];
    expect(formatFactorization(factors)).toBe('2^3 × 3 × 5^2');
    expect(listDivisors([{ prime: 2n, exponent: 2 }])).toEqual([1n, 2n, 4n]);
  });
});
