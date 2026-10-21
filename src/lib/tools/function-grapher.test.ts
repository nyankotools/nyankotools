import { describe, expect, it } from 'vitest';
import {
  compileCurve,
  DEFAULT_VIEW,
  formatTick,
  fromPixel,
  makeTicks,
  niceStep,
  normalizeSource,
  panView,
  pngFilename,
  sampleCurve,
  toPixel,
  validateView,
  zoomView,
} from './function-grapher';

describe('validateView', () => {
  it('既定値は有効', () => {
    expect(validateView(DEFAULT_VIEW)).toBeNull();
  });
  it('NaN・順序逆転・範囲過大を検出する', () => {
    expect(validateView({ ...DEFAULT_VIEW, xMin: NaN })).toBe('notNumber');
    expect(validateView({ ...DEFAULT_VIEW, xMin: 5, xMax: 5 })).toBe('order');
    expect(validateView({ ...DEFAULT_VIEW, yMin: 3, yMax: -3 })).toBe('order');
    expect(validateView({ ...DEFAULT_VIEW, xMin: -1e10, xMax: 1e10 })).toBe(
      'span',
    );
    expect(validateView({ ...DEFAULT_VIEW, xMin: 0, xMax: 1e-9 })).toBe('span');
  });
});

describe('zoomView / panView', () => {
  it('中心固定でズームインする', () => {
    const v = zoomView(DEFAULT_VIEW, 0.5);
    expect(v).toEqual({ xMin: -5, xMax: 5, yMin: -3, yMax: 3 });
  });
  it('端の点を固定してズームする', () => {
    const v = zoomView({ xMin: 0, xMax: 10, yMin: 0, yMax: 10 }, 0.5, 0, 1);
    expect(v).toEqual({ xMin: 0, xMax: 5, yMin: 0, yMax: 5 });
  });
  it('限界を超えるズームは元に戻す', () => {
    const tiny = { xMin: 0, xMax: 2e-6, yMin: 0, yMax: 2e-6 };
    expect(zoomView(tiny, 0.1)).toBe(tiny);
    expect(zoomView(DEFAULT_VIEW, 0)).toBe(DEFAULT_VIEW);
  });
  it('右へドラッグすると表示範囲は左へ、下へドラッグすると上へ動く', () => {
    const v = panView(DEFAULT_VIEW, 100, 50, 400, 200);
    expect(v.xMin).toBeCloseTo(-15);
    expect(v.xMax).toBeCloseTo(5);
    expect(v.yMin).toBeCloseTo(-6 + 3);
    expect(v.yMax).toBeCloseTo(6 + 3);
  });
  it('サイズ0なら動かさない', () => {
    expect(panView(DEFAULT_VIEW, 10, 10, 0, 0)).toBe(DEFAULT_VIEW);
  });
});

describe('座標変換', () => {
  it('toPixel と fromPixel は逆変換', () => {
    const p = toPixel(DEFAULT_VIEW, 400, 240, 0, 0);
    expect(p).toEqual({ px: 200, py: 120 });
    const m = fromPixel(DEFAULT_VIEW, 400, 240, 200, 120);
    expect(m.x).toBeCloseTo(0);
    expect(m.y).toBeCloseTo(0);
    expect(toPixel(DEFAULT_VIEW, 400, 240, -10, 6)).toEqual({ px: 0, py: 0 });
  });
});

describe('目盛り', () => {
  it('niceStep は 1・2・5 系列', () => {
    expect(niceStep(20)).toBe(2);
    expect(niceStep(10)).toBe(1);
    expect(niceStep(100, 10)).toBe(10);
    expect(niceStep(0)).toBe(1);
  });
  it('makeTicks は範囲内の誤差のない値を返す', () => {
    const t = makeTicks(-1, 1, 10);
    expect(t.step).toBeCloseTo(0.2);
    expect(t.values).toContain(0.6);
    expect(t.values).toContain(0);
    expect(t.values[0]).toBe(-1);
    expect(t.values[t.values.length - 1]).toBe(1);
  });
  it('極端な範囲でも値の数が暴走しない', () => {
    expect(makeTicks(0, 1e9, 8).values.length).toBeLessThan(30);
    expect(makeTicks(0, 1e-5, 8).values.length).toBeLessThan(30);
  });
  it('formatTick', () => {
    expect(formatTick(0, 1)).toBe('0');
    expect(formatTick(2, 1)).toBe('2');
    expect(formatTick(0.25, 0.05)).toBe('0.25');
    expect(formatTick(-1.5, 0.5)).toBe('-1.5');
    expect(formatTick(2e7, 5e6)).toBe('2e7');
    expect(formatTick(0.00002, 0.00001)).toBe('2e-5');
  });
});

describe('normalizeSource / compileCurve', () => {
  it('y= や f(x)= を取り除く', () => {
    expect(normalizeSource('y=x^2')).toBe('x^2');
    expect(normalizeSource(' Y = x')).toBe(' x');
    expect(normalizeSource('f(x)=sin(x)')).toBe('sin(x)');
    expect(normalizeSource('x+y')).toBe('x+y');
  });
  it('空・成功・エラーを区別する', () => {
    expect(compileCurve('  ', 'rad')).toEqual({ status: 'empty' });
    expect(compileCurve('y=', 'rad')).toEqual({ status: 'empty' });
    const ok = compileCurve('y=2x+1', 'rad');
    expect(ok.status).toBe('ok');
    if (ok.status === 'ok') expect(ok.evaluate(3)).toBe(7);
    const bad = compileCurve('foo(x)', 'rad');
    expect(bad.status).toBe('error');
    if (bad.status === 'error') expect(bad.error).toBe('unknownName');
    const unknownVar = compileCurve('x+y', 'rad');
    expect(unknownVar.status).toBe('error');
  });
  it('度数モードが反映される', () => {
    const deg = compileCurve('sin(x)', 'deg');
    const rad = compileCurve('sin(x)', 'rad');
    if (deg.status !== 'ok' || rad.status !== 'ok') throw new Error('ng');
    expect(deg.evaluate(90)).toBeCloseTo(1);
    expect(rad.evaluate(90)).not.toBeCloseTo(1);
  });
});

describe('sampleCurve', () => {
  const view = { xMin: -5, xMax: 5, yMin: -5, yMax: 5 };
  it('連続な関数は1本の区間になる', () => {
    const segs = sampleCurve((x) => x, view, 100);
    expect(segs).toHaveLength(1);
    expect(segs[0]).toHaveLength(101);
    expect(segs[0][0].x).toBe(-5);
    expect(segs[0][100].x).toBe(5);
  });
  it('定義域外（NaN）で区間を切る', () => {
    const segs = sampleCurve(Math.sqrt, view, 100);
    expect(segs).toHaveLength(1);
    expect(segs[0][0].x).toBeGreaterThanOrEqual(0);
  });
  it('全域が定義域外なら空', () => {
    expect(sampleCurve(() => NaN, view, 50)).toEqual([]);
  });
  it('Infinity でも切る（1/x は 0 の前後で2区間）', () => {
    const segs = sampleCurve((x) => 1 / x, view, 100);
    // x=0 を含むサンプル（偶数分割）で Infinity、または符号反転の大ジャンプで分割
    expect(segs.length).toBe(2);
    expect(Math.max(...segs[0].map((p) => p.x))).toBeLessThanOrEqual(0);
    expect(Math.min(...segs[1].map((p) => p.x))).toBeGreaterThanOrEqual(0);
  });
  it('漸近線をまたぐ大きなジャンプで切る（tan）', () => {
    const segs = sampleCurve(Math.tan, view, 400);
    expect(segs.length).toBeGreaterThanOrEqual(3);
    for (const s of segs) {
      for (let i = 1; i < s.length; i++) {
        const crossesAsymptote =
          s[i].y * s[i - 1].y < 0 && Math.abs(s[i].y - s[i - 1].y) > 20;
        expect(crossesAsymptote).toBe(false);
      }
    }
  });
  it('例外を投げる評価関数でも落ちない', () => {
    const segs = sampleCurve(
      (x) => {
        if (x > 0) throw new Error('x');
        return x;
      },
      view,
      20,
    );
    expect(segs).toHaveLength(1);
  });
  it('サンプル数は下限・上限に収まる', () => {
    expect(sampleCurve((x) => x, view, 0)[0]).toHaveLength(3);
    expect(sampleCurve((x) => x, view, 1e9)[0]).toHaveLength(5001);
  });
});

describe('pngFilename', () => {
  it('本数入りのファイル名', () => {
    expect(pngFilename(2)).toBe('function-graph-2.png');
  });
});
