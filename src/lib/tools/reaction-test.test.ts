import { describe, expect, it } from 'vitest';
import {
  MAX_WAIT_MS,
  MIN_WAIT_MS,
  formatMs,
  generateWaitMs,
  rankOf,
  summarize,
} from './reaction-test';

describe('generateWaitMs', () => {
  it('最小値と最大値を含む範囲で返す', () => {
    expect(generateWaitMs(() => 0)).toBe(MIN_WAIT_MS);
    expect(generateWaitMs((max) => max - 1)).toBe(MAX_WAIT_MS);
  });
  it('既定の乱数でも範囲内', () => {
    for (let i = 0; i < 200; i++) {
      const w = generateWaitMs();
      expect(w).toBeGreaterThanOrEqual(MIN_WAIT_MS);
      expect(w).toBeLessThanOrEqual(MAX_WAIT_MS);
    }
  });
  it('範囲が不正なら例外', () => {
    expect(() => generateWaitMs(() => 0, 100, 50)).toThrow(RangeError);
    expect(() => generateWaitMs(() => 0, -1, 50)).toThrow(RangeError);
  });
});

describe('summarize', () => {
  it('空配列は null', () => {
    expect(summarize([])).toBeNull();
  });
  it('平均・最速・最遅・中央値（奇数件）', () => {
    expect(summarize([300, 200, 250])).toEqual({
      count: 3,
      average: 250,
      best: 200,
      worst: 300,
      median: 250,
    });
  });
  it('中央値（偶数件）', () => {
    expect(summarize([100, 200, 300, 400])?.median).toBe(250);
  });
  it('1件だけでも計算できる', () => {
    const s = summarize([231.5]);
    expect(s?.average).toBe(231.5);
    expect(s?.best).toBe(231.5);
    expect(s?.worst).toBe(231.5);
  });
  it('負数・NaN・Infinity は除外する', () => {
    expect(summarize([NaN, -5, Infinity, 200])?.count).toBe(1);
    expect(summarize([NaN])).toBeNull();
  });
  it('入力配列を変更しない', () => {
    const input = [3, 1, 2];
    summarize(input);
    expect(input).toEqual([3, 1, 2]);
  });
});

describe('rankOf', () => {
  it('境界値', () => {
    expect(rankOf(150)).toBe('excellent');
    expect(rankOf(199.9)).toBe('excellent');
    expect(rankOf(200)).toBe('good');
    expect(rankOf(250)).toBe('average');
    expect(rankOf(300)).toBe('slow');
    expect(rankOf(400)).toBe('verySlow');
    expect(rankOf(2000)).toBe('verySlow');
  });
});

describe('formatMs', () => {
  it('整数に丸める', () => {
    expect(formatMs(231.6)).toBe('232');
    expect(formatMs(0)).toBe('0');
  });
});
