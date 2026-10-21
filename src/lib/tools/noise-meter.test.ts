import { describe, expect, it } from 'vitest';
import {
  DEFAULT_OFFSET,
  MAX_OFFSET,
  MIN_DBFS,
  MIN_OFFSET,
  addSample,
  averageDbfs,
  calculateRmsDbfs,
  classifyNoise,
  clampOffset,
  createStats,
  formatDb,
  historyToPoints,
  offsetForReference,
  pushHistory,
  toDisplayDb,
} from './noise-meter';

describe('calculateRmsDbfs', () => {
  it('空配列・無音は下限', () => {
    expect(calculateRmsDbfs([])).toBe(MIN_DBFS);
    expect(calculateRmsDbfs([0, 0, 0])).toBe(MIN_DBFS);
  });
  it('フルスケールの矩形波は 0 dBFS', () => {
    expect(calculateRmsDbfs([1, -1, 1, -1])).toBeCloseTo(0, 6);
  });
  it('振幅0.1 で約 -20 dBFS', () => {
    expect(calculateRmsDbfs([0.1, -0.1, 0.1, -0.1])).toBeCloseTo(-20, 6);
  });
  it('極小値でも下限を下回らない', () => {
    expect(calculateRmsDbfs([1e-9, -1e-9])).toBe(MIN_DBFS);
  });
  it('大量のサンプル（1秒分×数分）でも計算できる', () => {
    const big = new Float32Array(48000 * 180).fill(0.1);
    expect(calculateRmsDbfs(big)).toBeCloseTo(-20, 4);
  });
  it('Float32Array の入力を受け付ける', () => {
    expect(calculateRmsDbfs(new Float32Array([0.1, -0.1]))).toBeCloseTo(-20, 4);
  });
});

describe('clampOffset / toDisplayDb', () => {
  it('範囲に収め、数値でなければ初期値', () => {
    expect(clampOffset(NaN)).toBe(DEFAULT_OFFSET);
    expect(clampOffset(Infinity)).toBe(DEFAULT_OFFSET);
    expect(clampOffset(0)).toBe(MIN_OFFSET);
    expect(clampOffset(999)).toBe(MAX_OFFSET);
    expect(clampOffset(95)).toBe(95);
  });
  it('dBFS にオフセットを足し、0〜130に収める', () => {
    expect(toDisplayDb(-30, 90)).toBe(60);
    expect(toDisplayDb(-100, 90)).toBe(0);
    expect(toDisplayDb(0, 140)).toBe(130);
  });
  it('基準値からオフセットを逆算する', () => {
    expect(offsetForReference(-30, 65)).toBe(95);
    expect(offsetForReference(-30, 5)).toBe(MIN_OFFSET);
  });
});

describe('統計', () => {
  it('空の統計は平均なし', () => {
    const s = createStats();
    expect(averageDbfs(s)).toBeNull();
    expect(s.maxDbfs).toBeNull();
  });
  it('最大・最小・件数を更新し、元を変更しない', () => {
    const s0 = createStats();
    const s1 = addSample(addSample(s0, -40), -20);
    expect(s0.count).toBe(0);
    expect(s1.maxDbfs).toBe(-20);
    expect(s1.minDbfs).toBe(-40);
    expect(s1.count).toBe(2);
  });
  it('平均はエネルギー平均（同値なら同じ値）', () => {
    const s = addSample(addSample(createStats(), -30), -30);
    expect(averageDbfs(s)).toBeCloseTo(-30, 6);
    const mix = addSample(addSample(createStats(), -10), -100);
    // 算術平均 -55 より大きい値になる
    expect(averageDbfs(mix)!).toBeGreaterThan(-55);
    expect(averageDbfs(mix)!).toBeCloseTo(-13.01, 1);
  });
});

describe('履歴・グラフ', () => {
  it('上限件数を超えたら古いものを捨てる', () => {
    expect(pushHistory([1, 2, 3], 4, 3)).toEqual([2, 3, 4]);
    expect(pushHistory([], 1, 3)).toEqual([1]);
  });
  it('空の履歴は空文字', () => {
    expect(historyToPoints([], 10, 100, 50)).toBe('');
  });
  it('右端詰めで座標を計算し、範囲外は丸める', () => {
    const pts = historyToPoints([0, 130], 3, 100, 130);
    expect(pts).toBe('50.0,130.0 100.0,0.0');
    expect(historyToPoints([500], 2, 100, 130)).toBe('100.0,0.0');
  });
});

describe('classifyNoise', () => {
  it('境界値で区分が切り替わる', () => {
    expect(classifyNoise(0)).toBe('very-quiet');
    expect(classifyNoise(29.9)).toBe('very-quiet');
    expect(classifyNoise(30)).toBe('quiet');
    expect(classifyNoise(45)).toBe('calm');
    expect(classifyNoise(50)).toBe('normal');
    expect(classifyNoise(60)).toBe('loud');
    expect(classifyNoise(70)).toBe('very-loud');
    expect(classifyNoise(85)).toBe('extreme');
    expect(classifyNoise(130)).toBe('extreme');
  });
});

describe('formatDb', () => {
  it('四捨五入して整数にする', () => {
    expect(formatDb(61.5)).toBe('62');
    expect(formatDb(61.4)).toBe('61');
  });
});
