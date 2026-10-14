import { describe, expect, it } from 'vitest';
import {
  appendPoint,
  clampPadding,
  clampPenWidth,
  exportLayout,
  midpoint,
  normalizeColor,
  parseScale,
  signatureFileName,
  strokeBounds,
  type Stroke,
} from './signature-pad';

const stroke = (pts: [number, number][], width = 4): Stroke => ({
  points: pts.map(([x, y]) => ({ x, y })),
  width,
  color: '#000000',
});

describe('strokeBounds', () => {
  it('点が無ければ null', () => {
    expect(strokeBounds([])).toBeNull();
    expect(strokeBounds([stroke([])])).toBeNull();
  });
  it('線の太さの半分を含む', () => {
    expect(strokeBounds([stroke([[10, 20]], 4)])).toEqual({
      x: 8,
      y: 18,
      width: 4,
      height: 4,
    });
  });
  it('複数ストロークをまとめる', () => {
    const b = strokeBounds([
      stroke([
        [0, 0],
        [10, 5],
      ]),
      stroke([[30, 40]]),
    ]);
    expect(b).toEqual({ x: -2, y: -2, width: 34, height: 44 });
  });
});

describe('exportLayout', () => {
  const base = {
    trim: true,
    padding: 10,
    scale: 2,
    canvasWidth: 300,
    canvasHeight: 200,
  };
  it('空なら empty', () => {
    expect(exportLayout([], base)).toEqual({ ok: false, reason: 'empty' });
  });
  it('トリムして余白と倍率を反映する', () => {
    const r = exportLayout(
      [
        stroke(
          [
            [50, 50],
            [100, 80],
          ],
          2,
        ),
      ],
      base,
    );
    expect(r.ok).toBe(true);
    if (r.ok) {
      expect(r.layout.originX).toBe(39);
      expect(r.layout.originY).toBe(39);
      expect(r.layout.width).toBe((101 + 10 - 39) * 2);
      expect(r.layout.height).toBe((81 + 10 - 39) * 2);
    }
  });
  it('トリムなしなら描画面全体', () => {
    const r = exportLayout([stroke([[5, 5]])], { ...base, trim: false });
    expect(r.ok && r.layout.width).toBe(600);
    expect(r.ok && r.layout.height).toBe(400);
  });
  it('大きすぎると too-large', () => {
    const r = exportLayout(
      [
        stroke([
          [0, 0],
          [5000, 5000],
        ]),
      ],
      {
        ...base,
        scale: 3,
      },
    );
    expect(r).toEqual({ ok: false, reason: 'too-large' });
  });
  it('描画面の左上端の線はマイナス座標へ余白を足して切れない', () => {
    const r = exportLayout([stroke([[0, 0]], 4)], base);
    expect(r.ok).toBe(true);
    if (r.ok) {
      // 外接矩形は x=-2〜2。余白10を左右に足すと originX=-12、幅は24px×2倍
      expect(r.layout.originX).toBe(-12);
      expect(r.layout.originY).toBe(-12);
      expect(r.layout.width).toBe(48);
      expect(r.layout.height).toBe(48);
    }
  });
  it('出力の1辺がちょうど上限(8192px)なら成功し、1px超えると too-large', () => {
    const ok = exportLayout([stroke([[5, 5]])], {
      ...base,
      trim: false,
      scale: 2,
      canvasWidth: 4096,
      canvasHeight: 100,
    });
    expect(ok.ok && ok.layout.width).toBe(8192);
    const ng = exportLayout([stroke([[5, 5]])], {
      ...base,
      trim: false,
      scale: 2,
      canvasWidth: 4097,
      canvasHeight: 100,
    });
    expect(ng).toEqual({ ok: false, reason: 'too-large' });
  });
});

describe('補助関数', () => {
  it('clampPenWidth', () => {
    expect(clampPenWidth(0)).toBe(1);
    expect(clampPenWidth(100)).toBe(24);
    expect(clampPenWidth(NaN)).toBe(3);
  });
  it('clampPadding', () => {
    expect(clampPadding(-5)).toBe(0);
    expect(clampPadding(999)).toBe(200);
    expect(clampPadding(NaN)).toBe(8);
  });
  it('parseScale', () => {
    expect(parseScale(3)).toBe(3);
    expect(parseScale(5)).toBe(2);
  });
  it('midpoint', () => {
    expect(midpoint({ x: 0, y: 0 }, { x: 4, y: 2 })).toEqual({ x: 2, y: 1 });
  });
  it('appendPoint は近すぎる点を捨てる', () => {
    const a = [{ x: 0, y: 0 }];
    expect(appendPoint(a, { x: 0.1, y: 0.1 })).toBe(a);
    expect(appendPoint(a, { x: 5, y: 0 })).toHaveLength(2);
    expect(appendPoint([], { x: 1, y: 1 })).toHaveLength(1);
  });
  it('normalizeColor', () => {
    expect(normalizeColor('#ABC')).toBe('#aabbcc');
    expect(normalizeColor('#123456')).toBe('#123456');
    expect(normalizeColor('red')).toBe('#000000');
  });
  it('signatureFileName', () => {
    expect(signatureFileName()).toBe('signature.png');
  });
});
