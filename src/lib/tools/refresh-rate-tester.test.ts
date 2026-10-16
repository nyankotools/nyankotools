import { describe, expect, it } from 'vitest';
import {
  computeStats,
  nearestStandardRate,
  toIntervals,
} from './refresh-rate-tester';

describe('toIntervals', () => {
  it('隣接差を返す', () => {
    expect(toIntervals([0, 10, 25])).toEqual([10, 15]);
  });
  it('0以下と250ms超は除外する', () => {
    expect(toIntervals([0, 0, 16, 1000, 1016])).toEqual([16, 16]);
  });
  it('要素が1つ以下なら空', () => {
    expect(toIntervals([])).toEqual([]);
    expect(toIntervals([5])).toEqual([]);
  });
});

describe('nearestStandardRate', () => {
  it('近い標準値を返す', () => {
    expect(nearestStandardRate(59.94)).toBe(60);
    expect(nearestStandardRate(143.5)).toBe(144);
    expect(nearestStandardRate(119.9)).toBe(120);
  });
  it('許容誤差外はnull', () => {
    expect(nearestStandardRate(110)).toBeNull();
    expect(nearestStandardRate(0)).toBeNull();
    expect(nearestStandardRate(NaN)).toBeNull();
  });
  it('許容誤差(4%)の境界: 内側は一致、外側はnull', () => {
    expect(nearestStandardRate(62)).toBe(60); // 約3.3%
    expect(nearestStandardRate(63)).toBeNull(); // 5%
  });
  it('負値・Infinityはnull、範囲外の高レートもnull', () => {
    expect(nearestStandardRate(-60)).toBeNull();
    expect(nearestStandardRate(Infinity)).toBeNull();
    expect(nearestStandardRate(500)).toBeNull();
  });
  it('標準値そのものは完全一致する', () => {
    for (const rate of [30, 240, 360]) {
      expect(nearestStandardRate(rate)).toBe(rate);
    }
  });
});

describe('computeStats', () => {
  it('空はnull', () => {
    expect(computeStats([])).toBeNull();
  });
  it('一定間隔60Hz', () => {
    const s = computeStats(Array(60).fill(1000 / 60))!;
    expect(s.hz).toBeCloseTo(60, 5);
    expect(s.nearestStandard).toBe(60);
    expect(s.stdDevMs).toBeCloseTo(0, 5);
    expect(s.droppedFrames).toBe(0);
    expect(s.samples).toBe(60);
  });
  it('中央値は外れ値に強く、フレーム落ちを数える', () => {
    const s = computeStats([...Array(20).fill(1000 / 144), (1000 / 144) * 3])!;
    expect(s.nearestStandard).toBe(144);
    expect(s.droppedFrames).toBe(1);
    expect(s.maxIntervalMs).toBeCloseTo(3000 / 144, 5);
    expect(s.averageHz).toBeLessThan(s.hz);
  });
  it('偶数個の中央値は中間2値の平均', () => {
    const s = computeStats([10, 20])!;
    expect(s.medianIntervalMs).toBe(15);
  });
  it('1サンプルでは標準偏差0・最短=最長', () => {
    const s = computeStats([1000 / 60])!;
    expect(s.samples).toBe(1);
    expect(s.stdDevMs).toBe(0);
    expect(s.minIntervalMs).toBe(s.maxIntervalMs);
    expect(s.droppedFrames).toBe(0);
    expect(s.nearestStandard).toBe(60);
  });
  it('標準値から外れる測定値はnearestStandardがnull', () => {
    const s = computeStats([110, 110, 110])!;
    expect(s.hz).toBeCloseTo(1000 / 110, 5);
    expect(s.nearestStandard).toBeNull();
  });
  it('入力配列を破壊しない（ソートしない）', () => {
    const input = [30, 10, 20];
    computeStats(input);
    expect(input).toEqual([30, 10, 20]);
  });
  it('大量サンプル（ウィンドウ相当の240件）でも有限値を返す', () => {
    const intervals = Array.from({ length: 240 }, (_, i) => 16 + (i % 3) * 0.1);
    const s = computeStats(intervals)!;
    expect(s.samples).toBe(240);
    expect(Number.isFinite(s.hz)).toBe(true);
    expect(s.nearestStandard).toBe(60);
  });
});

describe('toIntervals 追加ケース', () => {
  it('単調増加でない（同一・逆行）タイムスタンプは除外する', () => {
    expect(toIntervals([10, 10, 5, 21])).toEqual([16]);
  });
});
