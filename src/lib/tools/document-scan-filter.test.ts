import { describe, expect, it } from 'vitest';
import {
  DEFAULT_SCAN_SETTINGS,
  SCAN_PRESETS,
  applyDocumentScan,
  buildOutputFileName,
  computeLuma,
  computeWorkSize,
  estimateBackground,
  levelsFor,
  normalizeSettings,
  otsuThreshold,
  sampleBackground,
  type ScanSettings,
} from './document-scan-filter';

const s = (o: Partial<ScanSettings>): ScanSettings => ({
  ...DEFAULT_SCAN_SETTINGS,
  ...o,
});

/** 左→右に明るさが落ちる影つきの紙 + 中央付近に黒い文字（縦線）を描く */
function makeShadowedPage(w: number, h: number) {
  const data = new Uint8ClampedArray(w * h * 4);
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const p = (y * w + x) * 4;
      const paper = 250 - (x / w) * 110; // 250 → 140
      const isInk = x % 10 === 5 && y > h / 4 && y < (h * 3) / 4;
      const v = isInk ? paper * 0.2 : paper;
      data[p] = v;
      data[p + 1] = v;
      data[p + 2] = v;
      data[p + 3] = 255;
    }
  }
  return data;
}

describe('normalizeSettings', () => {
  it('範囲外・不正値を丸める', () => {
    const n = normalizeSettings({
      mode: 'x' as never,
      shadow: 500,
      contrast: -5,
      threshold: 999,
    });
    expect(n.mode).toBe('color');
    expect(n.shadow).toBe(100);
    expect(n.contrast).toBe(0);
    expect(n.threshold).toBe(254);
    expect(normalizeSettings({ shadow: NaN }).shadow).toBe(80);
  });
});

describe('computeWorkSize', () => {
  it('上限以下はそのまま', () => {
    expect(computeWorkSize(1000, 500)).toEqual({
      width: 1000,
      height: 500,
      scale: 1,
    });
  });
  it('長辺を上限へ縮小する', () => {
    const r = computeWorkSize(6000, 3000, 3000);
    expect(r.width).toBe(3000);
    expect(r.height).toBe(1500);
    expect(r.scale).toBe(0.5);
  });
  it('極端な縦横比でも1px以上', () => {
    expect(computeWorkSize(100000, 1, 1000).height).toBe(1);
  });
});

describe('computeLuma', () => {
  it('透過は白と合成される', () => {
    const luma = computeLuma(new Uint8ClampedArray([0, 0, 0, 0]), 1, 1);
    expect(luma[0]).toBe(255);
  });
  it('黒は0', () => {
    expect(computeLuma(new Uint8ClampedArray([0, 0, 0, 255]), 1, 1)[0]).toBe(0);
  });
});

describe('estimateBackground / sampleBackground', () => {
  it('均一な画像では背景も同じ値', () => {
    const luma = new Uint8Array(40 * 30).fill(200);
    const grid = estimateBackground(luma, 40, 30);
    expect(sampleBackground(grid, 0, 0)).toBeCloseTo(200, 3);
    expect(sampleBackground(grid, 39, 29)).toBeCloseTo(200, 3);
  });
  it('1x1でも動く', () => {
    const grid = estimateBackground(new Uint8Array([123]), 1, 1);
    expect(sampleBackground(grid, 0, 0)).toBeCloseTo(123, 3);
  });
});

describe('otsuThreshold', () => {
  it('二峰性のヒストグラムでは二つの山の間になる', () => {
    const h = new Uint32Array(256);
    h[30] = 100;
    h[220] = 400;
    const t = otsuThreshold(h);
    expect(t).toBeGreaterThanOrEqual(30);
    expect(t).toBeLessThan(220);
  });
  it('空や単一値では128', () => {
    expect(otsuThreshold(new Uint32Array(256))).toBe(128);
    const h = new Uint32Array(256);
    h[255] = 10;
    expect(otsuThreshold(h)).toBe(128);
  });
});

describe('levelsFor', () => {
  it('コントラスト0では変化なし、上げるほど白点が下がる', () => {
    expect(levelsFor(0)).toEqual({ black: 0, white: 255 });
    expect(levelsFor(100).white).toBeLessThan(levelsFor(50).white);
    expect(levelsFor(100).black).toBeGreaterThan(0);
  });
});

describe('applyDocumentScan', () => {
  const w = 60;
  const h = 40;

  it('元の配列を変更せず、alphaは255になる', () => {
    const src = makeShadowedPage(w, h);
    const copy = new Uint8ClampedArray(src);
    const out = applyDocumentScan(src, w, h, DEFAULT_SCAN_SETTINGS);
    expect(src).toEqual(copy);
    expect(out.length).toBe(src.length);
    expect(out[3]).toBe(255);
  });

  it('影を除去すると暗い側の紙も明るくなる', () => {
    const src = makeShadowedPage(w, h);
    const probe = (x: number, y: number) => (y * w + x) * 4;
    const dark = probe(w - 3, 2);
    expect(src[dark]).toBeLessThan(160);
    const out = applyDocumentScan(src, w, h, s({ shadow: 100 }));
    expect(out[dark]).toBeGreaterThan(235);
    const off = applyDocumentScan(src, w, h, s({ shadow: 0, contrast: 0 }));
    expect(off[dark]).toBe(src[dark]);
  });

  it('文字（暗い画素）は暗いまま残る', () => {
    const src = makeShadowedPage(w, h);
    const ink = (20 * w + 5) * 4;
    const out = applyDocumentScan(src, w, h, s({ shadow: 100 }));
    expect(out[ink]).toBeLessThan(120);
  });

  it('グレースケールモードはR=G=B', () => {
    const src = new Uint8ClampedArray([200, 100, 50, 255, 10, 200, 90, 255]);
    const out = applyDocumentScan(src, 2, 1, s({ mode: 'gray', shadow: 0 }));
    expect(out[0]).toBe(out[1]);
    expect(out[1]).toBe(out[2]);
    expect(out[4]).toBe(out[5]);
  });

  it('カラーモードは色味を保つ', () => {
    const src = new Uint8ClampedArray([200, 50, 50, 255]);
    const out = applyDocumentScan(
      src,
      1,
      1,
      s({ mode: 'color', shadow: 0, contrast: 0 }),
    );
    expect(Array.from(out)).toEqual([200, 50, 50, 255]);
  });

  it('白黒モードは0か255だけになる（自動・手動とも）', () => {
    const src = makeShadowedPage(w, h);
    for (const opt of [
      s({ mode: 'bw', autoThreshold: true }),
      s({ mode: 'bw', autoThreshold: false, threshold: 100 }),
    ]) {
      const out = applyDocumentScan(src, w, h, opt);
      for (let p = 0; p < out.length; p += 4) {
        expect([0, 255]).toContain(out[p]);
        expect(out[p + 1]).toBe(out[p]);
      }
    }
  });

  it('白黒モードで影の側の紙が黒く潰れない', () => {
    const src = makeShadowedPage(w, h);
    const out = applyDocumentScan(src, w, h, SCAN_PRESETS[2].settings);
    expect(out[(2 * w + (w - 3)) * 4]).toBe(255);
    expect(out[(20 * w + 5) * 4]).toBe(0);
  });

  it('手動しきい値は境界値以下を黒にする', () => {
    const src = new Uint8ClampedArray([100, 100, 100, 255, 101, 101, 101, 255]);
    const out = applyDocumentScan(
      src,
      2,
      1,
      s({
        mode: 'bw',
        shadow: 0,
        contrast: 0,
        autoThreshold: false,
        threshold: 100,
      }),
    );
    expect(out[0]).toBe(0);
    expect(out[4]).toBe(255);
  });

  it('透過画素は白になる', () => {
    const src = new Uint8ClampedArray([0, 0, 0, 0]);
    const out = applyDocumentScan(src, 1, 1, s({ shadow: 0, contrast: 0 }));
    expect(Array.from(out)).toEqual([255, 255, 255, 255]);
  });

  it('真っ黒な画像でも例外にならない', () => {
    const src = new Uint8ClampedArray(4 * 4 * 4);
    for (let i = 3; i < src.length; i += 4) src[i] = 255;
    const out = applyDocumentScan(src, 4, 4, SCAN_PRESETS[0].settings);
    expect(out.length).toBe(src.length);
  });
});

describe('buildOutputFileName', () => {
  it('拡張子を置換して -scan を付ける', () => {
    expect(buildOutputFileName('photo.heic.jpg', 'png')).toBe(
      'photo.heic-scan.png',
    );
    expect(buildOutputFileName('doc.png', 'jpeg')).toBe('doc-scan.jpg');
    expect(buildOutputFileName('.png', 'webp')).toBe('.png-scan.webp');
    expect(buildOutputFileName('', 'png')).toBe('image-scan.png');
  });
});
