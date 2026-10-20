import { describe, it, expect } from 'vitest';
import {
  createRng,
  DEFAULT_OPTIONS,
  digitRange,
  generateProblems,
  pageLayout,
  paginate,
  problemText,
  randomSeed,
  validateOptions,
  type DrillOptions,
} from './math-drill-generator';

const opts = (o: Partial<DrillOptions> = {}): DrillOptions => ({
  ...DEFAULT_OPTIONS,
  ...o,
});

describe('validateOptions', () => {
  it('既定値は有効', () => {
    expect(validateOptions(DEFAULT_OPTIONS)).toBeNull();
  });
  it('演算が空・桁数・問題数・シードの範囲外はエラー', () => {
    expect(validateOptions(opts({ ops: [] }))).toBe('ops');
    expect(validateOptions(opts({ digitsA: 0 }))).toBe('digits');
    expect(validateOptions(opts({ digitsB: 5 }))).toBe('digits');
    expect(validateOptions(opts({ digitsA: 1.5 }))).toBe('digits');
    expect(validateOptions(opts({ count: 0 }))).toBe('count');
    expect(validateOptions(opts({ count: 101 }))).toBe('count');
    expect(validateOptions(opts({ count: Number.NaN }))).toBe('count');
    expect(validateOptions(opts({ seed: -1 }))).toBe('seed');
    expect(validateOptions(opts({ seed: 4294967296 }))).toBe('seed');
    expect(validateOptions(opts({ seed: 1.2 }))).toBe('seed');
  });
});

describe('createRng / randomSeed', () => {
  it('同じシードなら同じ列、違うシードなら違う列', () => {
    const a = createRng(42);
    const b = createRng(42);
    const c = createRng(43);
    const xs = [a(), a(), a()];
    expect(xs).toEqual([b(), b(), b()]);
    expect(xs).not.toEqual([c(), c(), c()]);
    xs.forEach((x) => {
      expect(x).toBeGreaterThanOrEqual(0);
      expect(x).toBeLessThan(1);
    });
  });
  it('randomSeed は範囲内の整数', () => {
    expect(randomSeed(() => 0)).toBe(0);
    expect(randomSeed(() => 0.999999999)).toBeLessThanOrEqual(4294967295);
    expect(Number.isInteger(randomSeed())).toBe(true);
  });
});

describe('digitRange', () => {
  it('1桁は1〜9、2桁以上は桁の範囲', () => {
    expect(digitRange(1)).toEqual([1, 9]);
    expect(digitRange(2)).toEqual([10, 99]);
    expect(digitRange(4)).toEqual([1000, 9999]);
  });
});

describe('generateProblems', () => {
  it('同じオプションなら同じ問題、シードが違えば変わる', () => {
    const a = generateProblems(opts({ seed: 7 }));
    expect(generateProblems(opts({ seed: 7 }))).toEqual(a);
    expect(generateProblems(opts({ seed: 8 }))).not.toEqual(a);
    expect(a).toHaveLength(20);
  });

  it('たし算・かけ算の答えが正しく、桁数が指定どおり', () => {
    for (const p of generateProblems(
      opts({ ops: ['add'], digitsA: 3, digitsB: 2, count: 100 }),
    )) {
      expect(p.answer).toBe(p.a + p.b);
      expect(String(p.a)).toHaveLength(3);
      expect(String(p.b)).toHaveLength(2);
    }
    for (const p of generateProblems(
      opts({ ops: ['mul'], digitsA: 2, digitsB: 1, count: 100 }),
    )) {
      expect(p.answer).toBe(p.a * p.b);
    }
  });

  it('ひき算は既定で負にならず、許可すると負も出る', () => {
    const base = opts({ ops: ['sub'], digitsA: 1, digitsB: 1, count: 100 });
    for (const p of generateProblems({ ...base, seed: 3 })) {
      expect(p.answer).toBeGreaterThanOrEqual(0);
      expect(p.answer).toBe(p.a - p.b);
    }
    const neg = generateProblems({ ...base, allowNegative: true, seed: 3 });
    expect(neg.some((p) => p.answer < 0)).toBe(true);
  });

  it('わり算は必ず割り切れ、わる数は2以上', () => {
    for (const [dA, dB] of [
      [1, 1],
      [2, 1],
      [3, 2],
      [2, 4],
      [4, 4],
      [1, 3],
    ]) {
      for (const p of generateProblems(
        opts({
          ops: ['div'],
          digitsA: dA,
          digitsB: dB,
          count: 100,
          seed: dA * 10 + dB,
        }),
      )) {
        expect(p.b).toBeGreaterThanOrEqual(2);
        expect(p.a % p.b).toBe(0);
        expect(p.a / p.b).toBe(p.answer);
        expect(p.answer).toBeGreaterThanOrEqual(1);
        expect(String(p.a)).toHaveLength(dA);
      }
    }
  });

  it('複数の演算を選ぶと混ざる', () => {
    const ps = generateProblems(
      opts({ ops: ['add', 'sub', 'mul', 'div'], count: 100 }),
    );
    expect(new Set(ps.map((p) => p.op)).size).toBe(4);
  });

  it('組み合わせに余裕があれば重複しない', () => {
    const ps = generateProblems(opts({ digitsA: 2, digitsB: 2, count: 100 }));
    expect(new Set(ps.map((p) => `${p.a}:${p.b}`)).size).toBe(100);
  });

  it('組み合わせが足りなくても指定数を返す', () => {
    const ps = generateProblems(
      opts({ ops: ['div'], digitsA: 1, digitsB: 1, count: 100 }),
    );
    expect(ps).toHaveLength(100);
  });
});

describe('pageLayout / paginate', () => {
  it('A4 横書き2列', () => {
    const l = pageLayout('a4', 'horizontal', 2, true);
    expect(l.widthMm).toBe(210);
    // (297 - 24 - 18) / 14 = 18.2
    expect(l.rows).toBe(18);
    expect(l.perPage).toBe(36);
  });
  it('筆算・用紙・ヘッダ有無で行数が変わる', () => {
    const withHeader = pageLayout('a4', 'vertical', 4, true);
    const without = pageLayout('a4', 'vertical', 4, false);
    expect(withHeader.rows).toBe(6);
    expect(without.rows).toBe(6);
    expect(pageLayout('letter', 'horizontal', 1, false).rows).toBe(18);
    expect(pageLayout('letter', 'horizontal', 1, true).rows).toBe(16);
    expect(without.perPage).toBe(24);
  });
  it('paginate はページごとに分割する', () => {
    expect(paginate([1, 2, 3, 4, 5], 2)).toEqual([[1, 2], [3, 4], [5]]);
    expect(paginate([], 3)).toEqual([]);
  });
});

describe('problemText', () => {
  it('演算記号つきの式', () => {
    expect(problemText({ op: 'sub', a: 12, b: 5, answer: 7 })).toBe('12 − 5 =');
    expect(problemText({ op: 'div', a: 12, b: 4, answer: 3 })).toBe('12 ÷ 4 =');
  });
});
