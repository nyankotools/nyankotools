import { describe, it, expect } from 'vitest';
import {
  buildBlobPath,
  buildCssBackground,
  buildSvg,
  buildWavePath,
  clampInt,
  createRng,
  normalizeSeed,
  randomSeed,
  sanitizeColor,
} from './svg-wave-generator';

const wave = {
  seed: 1,
  height: 320,
  amplitude: 20,
  waves: 2,
  randomness: 50,
  side: 'bottom' as const,
};

describe('createRng / normalizeSeed', () => {
  it('同じシードなら同じ乱数列になる', () => {
    const a = createRng(42);
    const b = createRng(42);
    expect([a(), a(), a()]).toEqual([b(), b(), b()]);
  });
  it('異なるシードでは乱数列が変わる', () => {
    expect(createRng(1)()).not.toBe(createRng(2)());
  });
  it('乱数は0以上1未満', () => {
    const r = createRng(7);
    for (let i = 0; i < 100; i++) {
      const v = r();
      expect(v).toBeGreaterThanOrEqual(0);
      expect(v).toBeLessThan(1);
    }
  });
  it('シードを非負整数に正規化する', () => {
    expect(normalizeSeed(-5.7)).toBe(5);
    expect(normalizeSeed(NaN)).toBe(0);
    expect(normalizeSeed(4294967296 + 3)).toBe(3);
  });
  it('無限大の入力は0になり、空入力相当（0）でも乱数列が作れる', () => {
    expect(normalizeSeed(Infinity)).toBe(0);
    expect(normalizeSeed(0)).toBe(0);
    expect(createRng(0)()).toBeLessThan(1);
  });
  it('ランダムシードは0以上100万未満の整数', () => {
    expect(randomSeed(() => 0)).toBe(0);
    expect(randomSeed(() => 0.999999)).toBe(999999);
    const s = randomSeed();
    expect(Number.isInteger(s)).toBe(true);
    expect(s).toBeGreaterThanOrEqual(0);
    expect(s).toBeLessThan(1000000);
  });
});

describe('clampInt', () => {
  it('範囲に丸める', () => {
    expect(clampInt(100, 1, 8)).toBe(8);
    expect(clampInt(-1, 1, 8)).toBe(1);
    expect(clampInt(NaN, 1, 8)).toBe(1);
    expect(clampInt(2.6, 1, 8)).toBe(3);
  });
});

describe('buildWavePath', () => {
  it('ランダム性0なら山谷が一定の波形になる', () => {
    const d = buildWavePath({ ...wave, randomness: 0, waves: 1 });
    expect(d).toBe(
      'M0,96 C360,96 360,224 720,224 C1080,224 1080,96 1440,96 L1440,320 L0,320 Z',
    );
  });
  it('上側塗りつぶしでは上端で閉じる', () => {
    const d = buildWavePath({ ...wave, side: 'top' });
    expect(d.endsWith('L1440,0 L0,0 Z')).toBe(true);
  });
  it('同じパラメータなら同じ結果、シードで変わる', () => {
    expect(buildWavePath(wave)).toBe(buildWavePath(wave));
    expect(buildWavePath(wave)).not.toBe(buildWavePath({ ...wave, seed: 2 }));
  });
  it('山の数に応じた曲線数になる', () => {
    const d = buildWavePath({ ...wave, waves: 3 });
    expect(d.match(/C/g)).toHaveLength(6);
  });
  it('NaNの入力は下限値として扱われ、例外にならない', () => {
    const d = buildWavePath({
      seed: NaN,
      height: NaN,
      amplitude: NaN,
      waves: NaN,
      randomness: NaN,
      side: 'bottom',
    });
    expect(d.match(/C/g)).toHaveLength(2);
    expect(d).toContain('L1440,100 L0,100 Z');
    expect(d).not.toMatch(/NaN|Infinity/);
  });
  it('ランダム性100%でも座標がNaNにならず、高さ範囲内に収まる', () => {
    const d = buildWavePath({ ...wave, randomness: 100, amplitude: 50 });
    expect(d).not.toMatch(/NaN|Infinity/);
    const ys = [...d.matchAll(/,(-?\d+(?:\.\d+)?)/g)].map((m) => Number(m[1]));
    for (const y of ys) {
      expect(y).toBeGreaterThanOrEqual(0);
      expect(y).toBeLessThanOrEqual(320);
    }
  });
  it('範囲外の値は丸められる', () => {
    const d = buildWavePath({
      ...wave,
      waves: 99,
      height: 5000,
      amplitude: 999,
    });
    expect(d.match(/C/g)).toHaveLength(16);
    expect(d).toContain('L1440,600 L0,600 Z');
  });
  it('y座標が0〜高さの範囲に収まる', () => {
    const d = buildWavePath({ ...wave, amplitude: 50, randomness: 0 });
    const ys = [...d.matchAll(/,(-?\d+(?:\.\d+)?)/g)].map((m) => Number(m[1]));
    for (const y of ys) {
      expect(y).toBeGreaterThanOrEqual(0);
      expect(y).toBeLessThanOrEqual(320);
    }
  });
});

describe('buildBlobPath', () => {
  const blob = { seed: 3, points: 6, randomness: 60 };
  it('頂点数だけ曲線を持つ閉じたパスになる', () => {
    const d = buildBlobPath(blob);
    expect(d.startsWith('M')).toBe(true);
    expect(d.endsWith('Z')).toBe(true);
    expect(d.match(/C/g)).toHaveLength(6);
  });
  it('決定的で、シードで変わる', () => {
    expect(buildBlobPath(blob)).toBe(buildBlobPath(blob));
    expect(buildBlobPath(blob)).not.toBe(buildBlobPath({ ...blob, seed: 4 }));
  });
  it('ランダム性0なら先頭頂点は真上の固定位置', () => {
    const d = buildBlobPath({ ...blob, randomness: 0, points: 4 });
    expect(d.startsWith('M200,16 ')).toBe(true);
  });
  it('頂点数は3〜16に丸められる', () => {
    expect(buildBlobPath({ ...blob, points: 1 }).match(/C/g)).toHaveLength(3);
    expect(buildBlobPath({ ...blob, points: 50 }).match(/C/g)).toHaveLength(16);
    expect(buildBlobPath({ ...blob, points: NaN }).match(/C/g)).toHaveLength(3);
  });
  it('ランダム性100%でも座標が盤面（0〜400）に収まる', () => {
    const d = buildBlobPath({ seed: 9, points: 16, randomness: 100 });
    expect(d).not.toMatch(/NaN|Infinity/);
    const nums = [...d.matchAll(/-?\d+(?:\.\d+)?/g)].map((m) => Number(m[0]));
    for (const v of nums) {
      expect(v).toBeGreaterThanOrEqual(-1);
      expect(v).toBeLessThanOrEqual(401);
    }
  });
});

describe('buildSvg / buildCssBackground / sanitizeColor', () => {
  it('波形はpreserveAspectRatio="none"を付ける', () => {
    const svg = buildSvg({
      path: 'M0,0 Z',
      width: 1440,
      height: 320,
      color: '#FF0000',
      stretch: true,
    });
    expect(svg).toBe(
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" preserveAspectRatio="none"><path fill="#ff0000" d="M0,0 Z"/></svg>',
    );
  });
  it('ブロブは引き伸ばさない', () => {
    const svg = buildSvg({
      path: 'M0,0 Z',
      width: 400,
      height: 400,
      color: '#000000',
      stretch: false,
    });
    expect(svg).not.toContain('preserveAspectRatio');
  });
  it('不正な色はデフォルト色になる（属性注入の防止）', () => {
    expect(sanitizeColor('red" onload="x')).toBe('#3b82f6');
    expect(sanitizeColor('#ABCDEF')).toBe('#abcdef');
    expect(sanitizeColor('')).toBe('#3b82f6');
    expect(sanitizeColor('#fff')).toBe('#3b82f6');
    expect(sanitizeColor('#gggggg')).toBe('#3b82f6');
  });
  it('CSSはdata URIでエンコードされる', () => {
    const css = buildCssBackground('<svg a="1"/>', true);
    expect(css).toContain(
      'url("data:image/svg+xml,%3Csvg%20a%3D%221%22%2F%3E")',
    );
    expect(css).toContain('background-size: 100% 100%;');
    expect(buildCssBackground('<svg/>', false)).toContain('contain');
  });
});
