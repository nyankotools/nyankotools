import { describe, expect, it } from 'vitest';
import {
  calcAccuracy,
  formatPercent,
  generateTargetPosition,
  isNewBest,
  parseBest,
  parseTargetSize,
  serializeBest,
  summarize,
} from './aim-trainer';

describe('generateTargetPosition', () => {
  it('的が的場の中に収まる', () => {
    const max = (n: number) => n - 1;
    const min = () => 0;
    expect(generateTargetPosition(400, 300, 50, null, max)).toEqual({
      left: 350,
      top: 250,
    });
    expect(generateTargetPosition(400, 300, 50, null, min)).toEqual({
      left: 0,
      top: 0,
    });
  });

  it('的場が的より小さくても0を返す', () => {
    expect(generateTargetPosition(30, 20, 50, null, () => 0)).toEqual({
      left: 0,
      top: 0,
    });
  });

  it('直前の的に近すぎる候補は避ける', () => {
    const seq = [10, 10, 200, 100];
    let i = 0;
    const rnd = () => seq[i++];
    const pos = generateTargetPosition(
      400,
      300,
      50,
      { left: 10, top: 10 },
      rnd,
    );
    expect(pos).toEqual({ left: 200, top: 100 });
  });

  it('条件を満たせなくても無限ループせず値を返す', () => {
    const pos = generateTargetPosition(
      50,
      50,
      50,
      { left: 0, top: 0 },
      () => 0,
    );
    expect(pos).toEqual({ left: 0, top: 0 });
  });

  it('不正なサイズは RangeError', () => {
    expect(() => generateTargetPosition(NaN, 100, 50)).toThrow(RangeError);
    expect(() => generateTargetPosition(100, 100, 0)).toThrow(RangeError);
  });
});

describe('calcAccuracy', () => {
  it('命中率を%で返す', () => {
    expect(calcAccuracy(20, 0)).toBe(100);
    expect(calcAccuracy(15, 5)).toBe(75);
  });
  it('クリックが無ければ null', () => {
    expect(calcAccuracy(0, 0)).toBeNull();
  });
  it('ミスのみなら0', () => {
    expect(calcAccuracy(0, 3)).toBe(0);
  });
});

describe('summarize', () => {
  it('平均・最速・最遅・中央値・精度を求める', () => {
    const s = summarize([500, 300, 400, 600], 1)!;
    expect(s.hits).toBe(4);
    expect(s.misses).toBe(1);
    expect(s.accuracy).toBe(80);
    expect(s.average).toBe(450);
    expect(s.best).toBe(300);
    expect(s.worst).toBe(600);
    expect(s.median).toBe(450);
  });
  it('奇数件の中央値', () => {
    expect(summarize([300, 100, 200], 0)!.median).toBe(200);
  });
  it('空や無効値のみなら null', () => {
    expect(summarize([], 3)).toBeNull();
    expect(summarize([NaN, -1], 0)).toBeNull();
  });
  it('無効値は除外し、ミス数の異常値は0扱い', () => {
    const s = summarize([100, NaN, 300], -2)!;
    expect(s.hits).toBe(2);
    expect(s.misses).toBe(0);
    expect(s.average).toBe(200);
  });
});

describe('ベスト記録', () => {
  it('parseBest は不正値を null にする', () => {
    expect(parseBest(null)).toBeNull();
    expect(parseBest('abc')).toBeNull();
    expect(parseBest('0')).toBeNull();
    expect(parseBest('-5')).toBeNull();
    expect(parseBest('423.5')).toBe(423.5);
  });
  it('serializeBest は小数1桁に丸める', () => {
    expect(serializeBest(423.456)).toBe('423.5');
    expect(serializeBest(400)).toBe('400');
  });
  it('isNewBest は短いほど更新', () => {
    expect(isNewBest(null, 500)).toBe(true);
    expect(isNewBest(500, 450)).toBe(true);
    expect(isNewBest(500, 500)).toBe(false);
    expect(isNewBest(500, 600)).toBe(false);
    expect(isNewBest(null, NaN)).toBe(false);
  });
});

describe('formatPercent', () => {
  it('表示用に整形する', () => {
    expect(formatPercent(null)).toBe('-');
    expect(formatPercent(66.666)).toBe('66.7%');
    expect(formatPercent(100)).toBe('100%');
  });
});

describe('parseTargetSize', () => {
  it('選べる大きさはそのまま返す', () => {
    expect(parseTargetSize('56')).toBe(56);
    expect(parseTargetSize('16')).toBe(16);
  });
  it('選べない値・不正値は既定値の24にする', () => {
    expect(parseTargetSize('30')).toBe(24);
    expect(parseTargetSize('abc')).toBe(24);
    expect(parseTargetSize('')).toBe(24);
    expect(parseTargetSize(null)).toBe(24);
    expect(parseTargetSize(undefined)).toBe(24);
  });
});
