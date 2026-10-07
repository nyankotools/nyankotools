import { describe, expect, it } from 'vitest';
import {
  calcOtherSide,
  formatDecimal,
  formatRatio,
  gcd,
  nearestPreset,
  parseRatio,
  ratioValue,
  resolutionTable,
  simplifyRatio,
} from './aspect-ratio-calculator';

describe('gcd', () => {
  it('最大公約数を返す', () => {
    expect(gcd(1920, 1080)).toBe(120);
    expect(gcd(7, 3)).toBe(1);
  });
});

describe('simplifyRatio', () => {
  it('1920x1080 は 16:9', () => {
    expect(simplifyRatio(1920, 1080)).toEqual({ w: 16, h: 9 });
  });
  it('正方形は 1:1', () => {
    expect(simplifyRatio(500, 500)).toEqual({ w: 1, h: 1 });
  });
  it('縦長も約分できる', () => {
    expect(simplifyRatio(1080, 1920)).toEqual({ w: 9, h: 16 });
  });
  it('互いに素なら約分されない', () => {
    expect(simplifyRatio(1366, 768)).toEqual({ w: 683, h: 384 });
  });
  it('小数を整数比に直す', () => {
    expect(simplifyRatio(1.6, 0.9)).toEqual({ w: 16, h: 9 });
    expect(formatRatio(simplifyRatio(2.5, 1)!)).toBe('5:2');
  });
  it('0・負数・NaN・Infinity は null', () => {
    expect(simplifyRatio(0, 10)).toBeNull();
    expect(simplifyRatio(10, -1)).toBeNull();
    expect(simplifyRatio(NaN, 10)).toBeNull();
    expect(simplifyRatio(Infinity, 10)).toBeNull();
  });
  it('極端に大きい値は null', () => {
    expect(simplifyRatio(1e12, 1)).toBeNull();
  });
});

describe('parseRatio', () => {
  it('各種区切り文字を受け付ける', () => {
    expect(parseRatio('16:9')).toEqual({ w: 16, h: 9 });
    expect(parseRatio(' 4 / 3 ')).toEqual({ w: 4, h: 3 });
    expect(parseRatio('21x9')).toEqual({ w: 21, h: 9 });
    expect(parseRatio('16：10')).toEqual({ w: 16, h: 10 });
    expect(parseRatio('3×2')).toEqual({ w: 3, h: 2 });
    expect(parseRatio('1.85:1')).toEqual({ w: 1.85, h: 1 });
  });
  it('不正な文字列は null', () => {
    expect(parseRatio('')).toBeNull();
    expect(parseRatio('abc')).toBeNull();
    expect(parseRatio('16:')).toBeNull();
    expect(parseRatio('0:9')).toBeNull();
    expect(parseRatio('-4:3')).toBeNull();
  });
});

describe('formatDecimal / ratioValue', () => {
  it('末尾の0を除いて丸める', () => {
    expect(formatDecimal(16 / 9)).toBe('1.78');
    expect(formatDecimal(1.5)).toBe('1.5');
    expect(formatDecimal(2)).toBe('2');
  });
  it('比率の値', () => {
    expect(ratioValue(1920, 1080)).toBeCloseTo(1.7778, 3);
    expect(ratioValue(1, 0)).toBeNull();
  });
});

describe('nearestPreset', () => {
  it('一致するプリセットを exact で返す', () => {
    const r = nearestPreset(1920, 1080)!;
    expect(r.preset.value).toBe('16:9');
    expect(r.exact).toBe(true);
  });
  it('1366x768 は 16:9 に近い', () => {
    const r = nearestPreset(1366, 768)!;
    expect(r.preset.value).toBe('16:9');
    expect(r.exact).toBe(false);
    expect(r.diffPercent).toBeLessThan(0.2);
  });
  it('縦長のプリセットも選ばれる', () => {
    expect(nearestPreset(1080, 1920)!.preset.value).toBe('9:16');
  });
  it('不正値は null', () => {
    expect(nearestPreset(0, 100)).toBeNull();
  });
});

describe('calcOtherSide', () => {
  it('幅から高さを求める', () => {
    const r = calcOtherSide({ w: 16, h: 9 }, 'width', 1280)!;
    expect(r.exact).toBe(720);
    expect(r.rounded).toBe(720);
    expect(r.isInteger).toBe(true);
  });
  it('高さから幅を求める', () => {
    expect(calcOtherSide({ w: 16, h: 9 }, 'height', 1080)!.rounded).toBe(1920);
  });
  it('割り切れない場合は四捨五入と isInteger=false', () => {
    const r = calcOtherSide({ w: 16, h: 9 }, 'width', 1000)!;
    expect(r.exact).toBeCloseTo(562.5, 5);
    expect(r.rounded).toBe(563);
    expect(r.isInteger).toBe(false);
  });
  it('小数の比率でも計算できる', () => {
    expect(calcOtherSide({ w: 1.85, h: 1 }, 'width', 1850)!.rounded).toBe(1000);
  });
  it('不正値は null', () => {
    expect(calcOtherSide({ w: 0, h: 9 }, 'width', 100)).toBeNull();
    expect(calcOtherSide({ w: 16, h: 9 }, 'width', -5)).toBeNull();
    expect(calcOtherSide({ w: 16, h: 9 }, 'width', NaN)).toBeNull();
  });
});

describe('resolutionTable', () => {
  it('代表的な幅ごとの高さを返す', () => {
    const rows = resolutionTable({ w: 16, h: 9 });
    expect(rows.find((r) => r.width === 1920)).toEqual({
      width: 1920,
      height: 1080,
      isInteger: true,
    });
    expect(rows.find((r) => r.width === 3840)!.height).toBe(2160);
  });
  it('割り切れない行は isInteger=false', () => {
    const rows = resolutionTable({ w: 4, h: 3 }, [1000]);
    expect(rows).toEqual([{ width: 1000, height: 750, isInteger: true }]);
    const odd = resolutionTable({ w: 16, h: 9 }, [1000]);
    expect(odd[0].isInteger).toBe(false);
  });
});
