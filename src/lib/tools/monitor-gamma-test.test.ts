import { describe, it, expect } from 'vitest';
import {
  PATTERN_IDS,
  GAMMA_VALUES,
  cycleIndex,
  clampLevel,
  grayHex,
  gammaMatchLevel,
  estimateGamma,
  stepLevels,
  nearBlackLevels,
  nearWhiteLevels,
  rampLevel,
  splitRanges,
  labelColor,
} from './monitor-gamma-test';

describe('cycleIndex', () => {
  it('回り込む', () => {
    expect(cycleIndex(4, 1, 5)).toBe(0);
    expect(cycleIndex(0, -1, 5)).toBe(4);
    expect(cycleIndex(1, -12, 5)).toBe(4);
  });
  it('長さ0なら0', () => {
    expect(cycleIndex(2, 1, 0)).toBe(0);
  });
});

describe('clampLevel / grayHex', () => {
  it('範囲に丸める', () => {
    expect(clampLevel(-5)).toBe(0);
    expect(clampLevel(300)).toBe(255);
    expect(clampLevel(127.5)).toBe(128);
    expect(clampLevel(NaN)).toBe(0);
  });
  it('#rrggbb に変換する', () => {
    expect(grayHex(0)).toBe('#000000');
    expect(grayHex(255)).toBe('#ffffff');
    expect(grayHex(15)).toBe('#0f0f0f');
    expect(grayHex(300)).toBe('#ffffff');
  });
});

describe('gammaMatchLevel / estimateGamma', () => {
  it('ガンマ2.2で186、2.0で180付近', () => {
    expect(gammaMatchLevel(2.2)).toBe(186);
    expect(gammaMatchLevel(2.0)).toBe(180);
    expect(gammaMatchLevel(1.0)).toBe(128);
  });
  it('ガンマが大きいほど明るい階調で一致する', () => {
    const levels = GAMMA_VALUES.map(gammaMatchLevel);
    expect([...levels].sort((a, b) => a - b)).toEqual(levels);
  });
  it('不正なガンマは0', () => {
    expect(gammaMatchLevel(0)).toBe(0);
    expect(gammaMatchLevel(-1)).toBe(0);
    expect(gammaMatchLevel(NaN)).toBe(0);
  });
  it('往復でほぼ元のガンマに戻る', () => {
    expect(estimateGamma(186)).toBeCloseTo(2.2, 1);
    expect(estimateGamma(128)).toBeCloseTo(1.0, 1);
  });
  it('0・255・範囲外はnull', () => {
    expect(estimateGamma(0)).toBeNull();
    expect(estimateGamma(255)).toBeNull();
    expect(estimateGamma(-3)).toBeNull();
    expect(estimateGamma(NaN)).toBeNull();
  });
});

describe('stepLevels', () => {
  it('両端が0と255で単調増加', () => {
    const s = stepLevels(16);
    expect(s).toHaveLength(16);
    expect(s[0]).toBe(0);
    expect(s[15]).toBe(255);
    expect(s[1]).toBe(17);
    for (let i = 1; i < s.length; i++) expect(s[i]).toBeGreaterThan(s[i - 1]);
  });
  it('段数が1以下・不正なら[0]', () => {
    expect(stepLevels(1)).toEqual([0]);
    expect(stepLevels(0)).toEqual([0]);
    expect(stepLevels(NaN)).toEqual([0]);
  });
  it('2段なら黒と白', () => {
    expect(stepLevels(2)).toEqual([0, 255]);
  });
});

describe('nearBlackLevels / nearWhiteLevels', () => {
  it('黒側は1から昇順', () => {
    expect(nearBlackLevels(4)).toEqual([1, 2, 3, 4]);
    expect(nearBlackLevels()).toHaveLength(16);
  });
  it('白側は254から降順', () => {
    expect(nearWhiteLevels(3)).toEqual([254, 253, 252]);
  });
  it('個数は0〜254に制限される', () => {
    expect(nearBlackLevels(-1)).toEqual([]);
    expect(nearWhiteLevels(1000)).toHaveLength(254);
  });
});

describe('rampLevel', () => {
  it('左端0、右端255、中央付近128', () => {
    expect(rampLevel(0, 1000)).toBe(0);
    expect(rampLevel(999, 1000)).toBe(255);
    expect(rampLevel(500, 1001)).toBe(128);
  });
  it('幅が1以下なら0', () => {
    expect(rampLevel(0, 1)).toBe(0);
    expect(rampLevel(5, 0)).toBe(0);
  });
});

describe('splitRanges', () => {
  it('隙間・重なりなしで全体を覆う', () => {
    const r = splitRanges(100, 3);
    expect(r).toEqual([
      { start: 0, end: 34 },
      { start: 34, end: 67 },
      { start: 67, end: 100 },
    ]);
  });
  it('割り切れる場合は等分', () => {
    expect(splitRanges(10, 5).every((x) => x.end - x.start === 2)).toBe(true);
  });
  it('不正な入力は空配列', () => {
    expect(splitRanges(10, 0)).toEqual([]);
    expect(splitRanges(-1, 3)).toEqual([]);
  });
});

describe('labelColor / PATTERN_IDS', () => {
  it('暗い背景は白文字、明るい背景は黒文字', () => {
    expect(labelColor(0)).toBe('#ffffff');
    expect(labelColor(255)).toBe('#000000');
  });
  it('パターンIDが重複しない', () => {
    expect(new Set(PATTERN_IDS).size).toBe(PATTERN_IDS.length);
  });
});
