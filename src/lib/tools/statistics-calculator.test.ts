import { describe, it, expect } from 'vitest';
import {
  calculateStatistics,
  deviationScore,
  parseNumbers,
  MAX_STATISTICS_VALUES,
} from './statistics-calculator';

describe('parseNumbers', () => {
  it('カンマ・空白・改行区切りを読み取る', () => {
    expect(parseNumbers('1, 2\n3\t4 5').values).toEqual([1, 2, 3, 4, 5]);
  });

  it('全角数字・全角記号を読み取る', () => {
    expect(parseNumbers('１２．５、－３').values).toEqual([12.5, -3]);
  });

  it('U+2212マイナス記号「−」を読み取る', () => {
    expect(parseNumbers('−5 3.14 −2.5').values).toEqual([-5, 3.14, -2.5]);
  });

  it('数値でないトークンは数を数えて除外する', () => {
    const r = parseNumbers('1 abc 2 3x');
    expect(r.values).toEqual([1, 2]);
    expect(r.invalidCount).toBe(2);
  });

  it('空文字は空配列', () => {
    expect(parseNumbers('  \n ')).toEqual({ values: [], invalidCount: 0 });
  });

  it('指数表記と小数を読み取る', () => {
    expect(parseNumbers('1e3 .5 -2.').values).toEqual([1000, 0.5, -2]);
  });
});

describe('calculateStatistics', () => {
  it('基本統計量を求める', () => {
    const r = calculateStatistics([2, 4, 4, 4, 5, 5, 7, 9]);
    if ('error' in r) throw new Error('unexpected');
    expect(r.count).toBe(8);
    expect(r.sum).toBe(40);
    expect(r.mean).toBe(5);
    expect(r.median).toBe(4.5);
    expect(r.modes).toEqual([4]);
    expect(r.min).toBe(2);
    expect(r.max).toBe(9);
    expect(r.range).toBe(7);
    expect(r.populationVariance).toBe(4);
    expect(r.populationStdDev).toBe(2);
    expect(r.sampleVariance).toBeCloseTo(32 / 7);
  });

  it('奇数個の中央値は中央の値', () => {
    const r = calculateStatistics([9, 1, 5]);
    if ('error' in r) throw new Error('unexpected');
    expect(r.median).toBe(5);
  });

  it('最頻値が複数ある場合は昇順で全て返す', () => {
    const r = calculateStatistics([3, 1, 1, 3, 2]);
    if ('error' in r) throw new Error('unexpected');
    expect(r.modes).toEqual([1, 3]);
  });

  it('全て1回ずつなら最頻値なし', () => {
    const r = calculateStatistics([1, 2, 3]);
    if ('error' in r) throw new Error('unexpected');
    expect(r.modes).toEqual([]);
  });

  it('1件のみは不偏分散がnull', () => {
    const r = calculateStatistics([5]);
    if ('error' in r) throw new Error('unexpected');
    expect(r.populationStdDev).toBe(0);
    expect(r.sampleVariance).toBeNull();
    expect(r.sampleStdDev).toBeNull();
  });

  it('空配列はempty', () => {
    expect(calculateStatistics([])).toEqual({ error: 'empty' });
  });

  it('件数上限を超えるとtooMany', () => {
    const values = new Array(MAX_STATISTICS_VALUES + 1).fill(1);
    expect(calculateStatistics(values)).toEqual({ error: 'tooMany' });
  });
});

describe('deviationScore', () => {
  it('平均点は偏差値50', () => {
    expect(deviationScore(60, 60, 10)).toBe(50);
  });

  it('平均+1標準偏差は偏差値60', () => {
    expect(deviationScore(70, 60, 10)).toBe(60);
  });

  it('標準偏差0はnull', () => {
    expect(deviationScore(50, 50, 0)).toBeNull();
  });

  it('非有限値はnull', () => {
    expect(deviationScore(NaN, 50, 10)).toBeNull();
  });
});
