import { describe, expect, it } from 'vitest';
import {
  MAX_PIXELS,
  applyNoise,
  buildFilename,
  colorAt,
  conicStartAngle,
  createRng,
  evenPositions,
  linearGradientLine,
  normalizeHexColor,
  normalizeStops,
  radialRadius,
  validateSize,
} from './gradient-wallpaper';

describe('validateSize', () => {
  it('通常の解像度は有効', () => {
    expect(validateSize(1920, 1080)).toBeNull();
    expect(validateSize(3840, 2160)).toBeNull();
  });
  it('小数・NaN は integer エラー', () => {
    expect(validateSize(100.5, 100)).toBe('integer');
    expect(validateSize(NaN, 100)).toBe('integer');
  });
  it('範囲外は range エラー', () => {
    expect(validateSize(8, 100)).toBe('range');
    expect(validateSize(9000, 100)).toBe('range');
  });
  it('面積超過は pixels エラー', () => {
    expect(validateSize(8192, 8192)).toBe('pixels');
    expect(8192 * 2048).toBe(MAX_PIXELS);
    expect(validateSize(8192, 2048)).toBeNull();
    expect(validateSize(8192, 2049)).toBe('pixels');
  });
});

describe('normalizeHexColor', () => {
  it('短縮形と大文字を正規化する', () => {
    expect(normalizeHexColor('#ABC')).toBe('#aabbcc');
    expect(normalizeHexColor('ff0000')).toBe('#ff0000');
  });
  it('不正値は null', () => {
    expect(normalizeHexColor('#12')).toBeNull();
    expect(normalizeHexColor('red')).toBeNull();
  });
});

describe('evenPositions', () => {
  it('等間隔に並べる', () => {
    expect(evenPositions(2)).toEqual([0, 100]);
    expect(evenPositions(3)).toEqual([0, 50, 100]);
    expect(evenPositions(5)).toEqual([0, 25, 50, 75, 100]);
  });
});

describe('normalizeStops / colorAt', () => {
  it('昇順に並べ替え、範囲外を丸める', () => {
    const r = normalizeStops([
      { color: '#ffffff', position: 150 },
      { color: '#000000', position: -10 },
    ]);
    expect(r).toEqual([
      { color: '#000000', position: 0 },
      { color: '#ffffff', position: 100 },
    ]);
  });
  it('同位置は入力順を保つ', () => {
    const r = normalizeStops([
      { color: '#111111', position: 50 },
      { color: '#222222', position: 50 },
    ]);
    expect(r.map((s) => s.color)).toEqual(['#111111', '#222222']);
  });
  it('中間色を補間する', () => {
    const s = normalizeStops([
      { color: '#000000', position: 0 },
      { color: '#ffffff', position: 100 },
    ]);
    expect(colorAt(s, 0)).toBe('#000000');
    expect(colorAt(s, 1)).toBe('#ffffff');
    expect(colorAt(s, 0.5)).toBe('#808080');
  });
  it('端の外側は端の色', () => {
    const s = normalizeStops([
      { color: '#ff0000', position: 20 },
      { color: '#0000ff', position: 80 },
    ]);
    expect(colorAt(s, 0.1)).toBe('#ff0000');
    expect(colorAt(s, 0.9)).toBe('#0000ff');
    expect(colorAt(s, 2)).toBe('#0000ff');
  });
});

describe('linearGradientLine', () => {
  it('0deg は下から上', () => {
    const l = linearGradientLine(200, 100, 0);
    expect(l.x0).toBeCloseTo(100);
    expect(l.x1).toBeCloseTo(100);
    expect(l.y0).toBeCloseTo(100);
    expect(l.y1).toBeCloseTo(0);
  });
  it('90deg は左から右', () => {
    const l = linearGradientLine(200, 100, 90);
    expect(l.x0).toBeCloseTo(0);
    expect(l.x1).toBeCloseTo(200);
    expect(l.y0).toBeCloseTo(50);
  });
  it('135deg は対角で、長さが CSS の式と一致する', () => {
    const l = linearGradientLine(100, 100, 135);
    const len = Math.hypot(l.x1 - l.x0, l.y1 - l.y0);
    expect(len).toBeCloseTo(Math.SQRT2 * 100);
    expect(l.x0).toBeCloseTo(0);
    expect(l.y0).toBeCloseTo(0);
  });
});

describe('radialRadius / conicStartAngle', () => {
  it('対角の半分', () => {
    expect(radialRadius(600, 800)).toBeCloseTo(500);
  });
  it('0deg は Canvas で上向き（-90°）', () => {
    expect(conicStartAngle(0)).toBeCloseTo(-Math.PI / 2);
    expect(conicStartAngle(90)).toBeCloseTo(0);
  });
});

describe('applyNoise', () => {
  const make = () =>
    new Uint8ClampedArray([128, 128, 128, 255, 10, 20, 30, 77]);
  it('amount 0 は何も変えない', () => {
    const d = make();
    applyNoise(d, 0);
    expect(Array.from(d)).toEqual(Array.from(make()));
  });
  it('アルファは変えず、同じシードなら同じ結果', () => {
    const a = new Uint8ClampedArray(4000).fill(128);
    const b = new Uint8ClampedArray(4000).fill(128);
    applyNoise(a, 50, 7);
    applyNoise(b, 50, 7);
    expect(Array.from(a)).toEqual(Array.from(b));
    for (let i = 3; i < a.length; i += 4) expect(a[i]).toBe(128);
    expect(a.some((v, i) => i % 4 !== 3 && v !== 128)).toBe(true);
  });
  it('揺らぎは範囲内に収まり、0/255 で飽和する', () => {
    const d = new Uint8ClampedArray(4000).fill(255);
    applyNoise(d, 100, 3);
    for (let i = 0; i < d.length; i++) expect(d[i]).toBeLessThanOrEqual(255);
    const e = new Uint8ClampedArray(4000).fill(100);
    applyNoise(e, 100, 3);
    for (let i = 0; i < e.length; i += 4) {
      expect(Math.abs(e[i] - 100)).toBeLessThanOrEqual(32);
    }
  });
});

describe('createRng / buildFilename', () => {
  it('0以上1未満', () => {
    const r = createRng(1);
    for (let i = 0; i < 100; i++) {
      const v = r();
      expect(v).toBeGreaterThanOrEqual(0);
      expect(v).toBeLessThan(1);
    }
  });
  it('ファイル名', () => {
    expect(buildFilename(1920, 1080, 'png')).toBe(
      'gradient-wallpaper-1920x1080.png',
    );
    expect(buildFilename(1080, 2400, 'jpeg')).toBe(
      'gradient-wallpaper-1080x2400.jpg',
    );
  });
});
