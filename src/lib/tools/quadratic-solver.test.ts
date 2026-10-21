import { describe, expect, it } from 'vitest';
import {
  formatNumber,
  solveLinearSystem,
  solveQuadratic,
} from './quadratic-solver';

describe('formatNumber', () => {
  it('末尾の0・浮動小数点誤差を丸める', () => {
    expect(formatNumber(0.1 + 0.2)).toBe('0.3');
    expect(formatNumber(2)).toBe('2');
    expect(formatNumber(-0)).toBe('0');
    expect(formatNumber(1e-15)).toBe('0');
  });
});

describe('solveQuadratic', () => {
  it('異なる2つの実数解', () => {
    const r = solveQuadratic(1, -3, 2)!;
    expect(r.kind).toBe('two-real');
    expect(r.discriminant).toBe(1);
    expect(r.roots.map((x) => x.re)).toEqual([2, 1]);
    expect(r.steps.map((s) => s.key)).toEqual([
      'equation',
      'discriminant',
      'formula',
      'solution',
    ]);
    expect(r.steps[0].math).toContain('x² - 3x + 2 = 0');
    expect(r.steps[1].math).toBe('D = b² - 4ac = (-3)² - 4·1·2 = 1');
  });

  it('重解', () => {
    const r = solveQuadratic(1, -2, 1)!;
    expect(r.kind).toBe('double');
    expect(r.roots).toHaveLength(1);
    expect(r.roots[0].re).toBe(1);
  });

  it('虚数解（共役な2つ）', () => {
    const r = solveQuadratic(1, 2, 5)!;
    expect(r.kind).toBe('complex');
    expect(r.discriminant).toBe(-16);
    expect(r.roots.map((x) => x.text)).toEqual(['-1 + 2i', '-1 - 2i']);
  });

  it('実部が0の虚数解は i / -i と表示する', () => {
    const r = solveQuadratic(1, 0, 1)!;
    expect(r.roots.map((x) => x.text)).toEqual(['i', '-i']);
  });

  it('aが負でも正しく解ける', () => {
    const r = solveQuadratic(-1, 0, 1)!;
    expect(r.kind).toBe('two-real');
    expect(r.roots.map((x) => x.re)).toEqual([-1, 1]);
  });

  it('a=0 のときは一次方程式として解く', () => {
    const r = solveQuadratic(0, 2, -4)!;
    expect(r.kind).toBe('linear');
    expect(r.roots[0].re).toBe(2);
    expect(r.discriminant).toBeNull();
  });

  it('a=b=0 のとき c=0 なら恒等式、それ以外は解なし', () => {
    expect(solveQuadratic(0, 0, 0)!.kind).toBe('identity');
    expect(solveQuadratic(0, 0, 3)!.kind).toBe('linear-none');
  });

  it('有限でない入力は null', () => {
    expect(solveQuadratic(NaN, 1, 1)).toBeNull();
    expect(solveQuadratic(1, Infinity, 1)).toBeNull();
  });

  it('小数係数でも浮動小数点誤差で判別式が壊れない', () => {
    const r = solveQuadratic(0.1, 0.2, 0.1)!;
    expect(r.kind).toBe('double');
  });
});

describe('solveLinearSystem（2元）', () => {
  it('一意な解を求める', () => {
    const r = solveLinearSystem(
      [
        [2, 1],
        [1, -1],
      ],
      [5, 1],
    )!;
    expect(r.kind).toBe('unique');
    expect(r.determinant).toBe(-3);
    expect(r.solutions.map((s) => s.value)).toEqual([2, 1]);
    expect(r.steps[0].math).toBe('2x + y = 5\nx - y = 1');
    expect(r.steps[1].math).toBe('D = 2·(-1) - 1·1 = -3');
  });

  it('割り切れない解は既約分数も返す', () => {
    const r = solveLinearSystem(
      [
        [1, 1],
        [1, -2],
      ],
      [1, 0],
    )!;
    expect(r.solutions.map((s) => s.fraction)).toEqual(['2/3', '1/3']);
  });

  it('負の分母は分子側に符号を寄せる', () => {
    const r = solveLinearSystem(
      [
        [1, 2],
        [3, -1],
      ],
      [-1, 0],
    )!;
    // D=-7, Dx=-1 → 1/7, Dy=-3·... 符号が正規化されていること
    for (const s of r.solutions) {
      expect(s.fraction === null || !s.fraction.endsWith('/-')).toBe(true);
      expect(s.fraction === null || /^-?\d+\/\d+$/.test(s.fraction)).toBe(true);
    }
  });

  it('解なし（平行）', () => {
    const r = solveLinearSystem(
      [
        [1, 1],
        [2, 2],
      ],
      [1, 3],
    )!;
    expect(r.kind).toBe('none');
    expect(r.steps.at(-1)!.math).toBe('rank A = 1, rank [A | b] = 2');
  });

  it('不定（同一直線）', () => {
    const r = solveLinearSystem(
      [
        [1, 1],
        [2, 2],
      ],
      [1, 2],
    )!;
    expect(r.kind).toBe('infinite');
    expect(r.solutions).toEqual([]);
  });
});

describe('solveLinearSystem（3元）', () => {
  it('一意な解を求める', () => {
    const r = solveLinearSystem(
      [
        [1, 1, 1],
        [0, 2, 5],
        [2, 5, -1],
      ],
      [6, -4, 27],
    )!;
    expect(r.kind).toBe('unique');
    expect(r.size).toBe(3);
    expect(r.solutions.map((s) => s.value)).toEqual([5, 3, -2]);
    // 方程式 + D + (Dk と解) × 3
    expect(r.steps).toHaveLength(2 + 6);
  });

  it('不定', () => {
    const r = solveLinearSystem(
      [
        [1, 1, 1],
        [2, 2, 2],
        [3, 3, 3],
      ],
      [1, 2, 3],
    )!;
    expect(r.kind).toBe('infinite');
  });

  it('解なし', () => {
    const r = solveLinearSystem(
      [
        [1, 1, 1],
        [1, 1, 1],
        [1, -1, 0],
      ],
      [1, 2, 0],
    )!;
    expect(r.kind).toBe('none');
  });

  it('係数が0の項は式から省略される', () => {
    const r = solveLinearSystem(
      [
        [1, 0, 0],
        [0, 1, 0],
        [0, 0, 1],
      ],
      [1, 2, 3],
    )!;
    expect(r.steps[0].math).toBe('x = 1\ny = 2\nz = 3');
    expect(r.solutions.map((s) => s.value)).toEqual([1, 2, 3]);
  });

  it('サイズ不正・非有限値は null', () => {
    expect(solveLinearSystem([[1]], [1])).toBeNull();
    expect(
      solveLinearSystem(
        [
          [1, 2],
          [3, 4],
        ],
        [1],
      ),
    ).toBeNull();
    expect(
      solveLinearSystem(
        [
          [1, NaN],
          [3, 4],
        ],
        [1, 2],
      ),
    ).toBeNull();
  });
});

describe('solveLinearSystem: 定数項が大きい系', () => {
  it('行列式が小さくても定数項が大きければ一意解として扱う', () => {
    const r = solveLinearSystem(
      [
        [1, 2],
        [3, 5],
      ],
      [100000, 300001],
    );
    expect(r?.kind).toBe('unique');
    expect(r?.solutions[0].value).toBeCloseTo(2 * 300001 - 100000 * 5, 6);
  });
});

describe('solveQuadratic: 小さい係数', () => {
  it('係数が 1e-7 でも判別式を相対判定する', () => {
    expect(solveQuadratic(1e-7, 1e-7, 1e-7)?.kind).not.toBe('double');
  });
});
