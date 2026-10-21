import { describe, expect, it } from 'vitest';
import {
  calculateRegression,
  parsePairs,
  predictY,
  type RegressionResult,
} from './linear-regression';

function ok(r: ReturnType<typeof calculateRegression>): RegressionResult {
  if ('error' in r) throw new Error(r.error);
  return r;
}

describe('parsePairs', () => {
  it('カンマ・タブ・スペース区切りを読む', () => {
    const r = parsePairs('1,2\n3\t4\n5 6');
    expect(r.points).toEqual([
      { x: 1, y: 2 },
      { x: 3, y: 4 },
      { x: 5, y: 6 },
    ]);
    expect(r.invalidCount).toBe(0);
  });

  it('不正な行は数えて無視し、空行は無視する', () => {
    const r = parsePairs('x,y\n1,2\n\n3\n4,5,6\n7,abc\n８，９');
    expect(r.points).toEqual([
      { x: 1, y: 2 },
      { x: 8, y: 9 },
    ]);
    expect(r.invalidCount).toBe(4);
  });

  it('CRLFと負数・小数を扱える', () => {
    const r = parsePairs('-1.5, 2e1\r\n−2 .5');
    expect(r.points).toEqual([
      { x: -1.5, y: 20 },
      { x: -2, y: 0.5 },
    ]);
  });
});

describe('calculateRegression', () => {
  it('完全な直線', () => {
    const r = ok(
      calculateRegression([
        { x: 1, y: 3 },
        { x: 2, y: 5 },
        { x: 3, y: 7 },
      ]),
    );
    expect(r.slope).toBeCloseTo(2);
    expect(r.intercept).toBeCloseTo(1);
    expect(r.r).toBeCloseTo(1);
    expect(r.r2).toBeCloseTo(1);
  });

  it('負の相関', () => {
    const r = ok(
      calculateRegression([
        { x: 1, y: 6 },
        { x: 2, y: 4 },
        { x: 3, y: 2 },
      ]),
    );
    expect(r.slope).toBeCloseTo(-2);
    expect(r.r).toBeCloseTo(-1);
  });

  it('既知のデータ', () => {
    const r = ok(
      calculateRegression([
        { x: 1, y: 2 },
        { x: 2, y: 3 },
        { x: 3, y: 5 },
        { x: 4, y: 4 },
        { x: 5, y: 6 },
      ]),
    );
    expect(r.slope).toBeCloseTo(0.9);
    expect(r.intercept).toBeCloseTo(1.3);
    expect(r.r2).toBeCloseTo(0.81);
  });

  it('点が足りない', () => {
    expect(calculateRegression([])).toEqual({ error: 'tooFew' });
    expect(calculateRegression([{ x: 1, y: 1 }])).toEqual({
      error: 'tooFew',
    });
  });

  it('xが全て同値', () => {
    expect(
      calculateRegression([
        { x: 2, y: 1 },
        { x: 2, y: 5 },
      ]),
    ).toEqual({ error: 'xConstant' });
  });

  it('yが全て同値なら傾き0でrはnull', () => {
    const r = ok(
      calculateRegression([
        { x: 1, y: 4 },
        { x: 2, y: 4 },
        { x: 3, y: 4 },
      ]),
    );
    expect(r.slope).toBe(0);
    expect(r.intercept).toBe(4);
    expect(r.r).toBeNull();
    expect(r.r2).toBeNull();
  });

  it('件数上限', () => {
    const pts = Array.from({ length: 10001 }, (_, i) => ({ x: i, y: i }));
    expect(calculateRegression(pts)).toEqual({ error: 'tooMany' });
  });
});

describe('predictY', () => {
  it('予測値を返す', () => {
    expect(predictY({ slope: 2, intercept: 1 }, 10)).toBe(21);
  });
  it('非有限値はnull', () => {
    expect(predictY({ slope: 2, intercept: 1 }, NaN)).toBeNull();
  });
});

describe('calculateRegression: 同じ小数のx', () => {
  it('x が全て 0.1 なら xConstant', () => {
    expect(
      calculateRegression([
        { x: 0.1, y: 1 },
        { x: 0.1, y: 2 },
        { x: 0.1, y: 3 },
      ]),
    ).toEqual({ error: 'xConstant' });
  });
});

describe('y 一定・CR 改行', () => {
  it('x が小数で y 一定なら傾き 0・r は null', () => {
    const r = calculateRegression([
      { x: 0.1, y: 0.7 },
      { x: 0.2, y: 0.7 },
      { x: 0.3, y: 0.7 },
    ]);
    expect(r).toMatchObject({ slope: 0, r: null, r2: null });
  });
  it('CR 単独改行を解釈する', () => {
    expect(parsePairs('1,2\r3,4\r5,6').points).toHaveLength(3);
  });
});
