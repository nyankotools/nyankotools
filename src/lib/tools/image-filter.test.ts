import { describe, expect, it } from 'vitest';
import {
  DEFAULT_FILTER_SETTINGS,
  FILTER_PRESETS,
  applyColorAdjustments,
  applyFilters,
  blurRgba,
  buildOutputFileName,
  clampFilterValue,
  formatFileSize,
  getOutputFormatOption,
  hueRotateMatrix,
  isAcceptedImageFile,
  isIdentity,
  presetToSettings,
  sharpenRgba,
  type FilterSettings,
} from './image-filter';

const s = (o: Partial<FilterSettings>): FilterSettings => ({
  ...DEFAULT_FILTER_SETTINGS,
  ...o,
});

describe('clampFilterValue / isIdentity', () => {
  it('範囲内に丸める', () => {
    expect(clampFilterValue('brightness', 500)).toBe(100);
    expect(clampFilterValue('brightness', -500)).toBe(-100);
    expect(clampFilterValue('blur', -3)).toBe(0);
    expect(clampFilterValue('blur', 99)).toBe(20);
    expect(clampFilterValue('hue', 12.6)).toBe(13);
  });
  it('非数は0', () => {
    expect(clampFilterValue('contrast', NaN)).toBe(0);
  });
  it('初期値はidentity', () => {
    expect(isIdentity(DEFAULT_FILTER_SETTINGS)).toBe(true);
    expect(isIdentity(s({ sepia: 1 }))).toBe(false);
  });
});

describe('applyColorAdjustments', () => {
  it('初期値では変化しない', () => {
    expect(
      applyColorAdjustments(10, 120, 250, DEFAULT_FILTER_SETTINGS),
    ).toEqual([10, 120, 250]);
  });
  it('明るさ', () => {
    expect(applyColorAdjustments(100, 100, 100, s({ brightness: 50 }))).toEqual(
      [150, 150, 150],
    );
    expect(
      applyColorAdjustments(200, 200, 200, s({ brightness: 100 })),
    ).toEqual([255, 255, 255]);
    expect(applyColorAdjustments(200, 100, 0, s({ brightness: -100 }))).toEqual(
      [0, 0, 0],
    );
  });
  it('コントラスト', () => {
    const [r] = applyColorAdjustments(200, 200, 200, s({ contrast: 50 }));
    expect(r).toBeGreaterThan(200);
    const [r2] = applyColorAdjustments(200, 200, 200, s({ contrast: -100 }));
    expect(r2).toBe(128);
  });
  it('彩度-100で無彩色、グレースケール100も無彩色', () => {
    const a = applyColorAdjustments(255, 0, 0, s({ saturation: -100 }));
    expect(a[0]).toBe(a[1]);
    expect(a[1]).toBe(a[2]);
    const b = applyColorAdjustments(255, 0, 0, s({ grayscale: 100 }));
    expect(b[0]).toBe(b[1]);
    expect(b[1]).toBe(b[2]);
  });
  it('反転', () => {
    expect(applyColorAdjustments(10, 20, 30, s({ invert: 100 }))).toEqual([
      245, 235, 225,
    ]);
    expect(applyColorAdjustments(10, 20, 30, s({ invert: 50 }))).toEqual([
      128, 128, 128,
    ]);
  });
  it('セピアは赤が最も強い', () => {
    const [r, g, b] = applyColorAdjustments(100, 100, 100, s({ sepia: 100 }));
    expect(r).toBeGreaterThan(g);
    expect(g).toBeGreaterThan(b);
  });
  it('色相360度近くで元に近い・0度行列は単位行列', () => {
    const m = hueRotateMatrix(0);
    expect(m[0]).toBeCloseTo(1);
    expect(m[4]).toBeCloseTo(1);
    expect(m[8]).toBeCloseTo(1);
    expect(m[1]).toBeCloseTo(0);
    const rotated = applyColorAdjustments(255, 0, 0, s({ hue: 180 }));
    expect(rotated[0]).toBeLessThan(100);
  });
});

describe('blurRgba', () => {
  it('半径0は同じ内容のコピー', () => {
    const d = new Uint8ClampedArray([1, 2, 3, 255]);
    const out = blurRgba(d, 1, 1, 0);
    expect(Array.from(out)).toEqual([1, 2, 3, 255]);
    expect(out).not.toBe(d);
  });
  it('単色画像は変化しない', () => {
    const d = new Uint8ClampedArray(4 * 9);
    for (let i = 0; i < d.length; i += 4) d.set([50, 100, 150, 255], i);
    expect(Array.from(blurRgba(d, 3, 3, 2))).toEqual(Array.from(d));
  });
  it('輝点が周囲に広がり、全体の明るさはほぼ保存される', () => {
    const w = 9;
    const d = new Uint8ClampedArray(w * w * 4);
    for (let i = 0; i < d.length; i += 4) d[i + 3] = 255;
    const c = (4 * w + 4) * 4;
    d[c] = 255;
    const out = blurRgba(d, w, w, 1);
    expect(out[c]).toBeLessThan(255);
    expect(out[(4 * w + 5) * 4]).toBeGreaterThan(0);
    let total = 0;
    for (let i = 0; i < out.length; i += 4) total += out[i];
    expect(Math.abs(total - 255)).toBeLessThan(20);
  });
});

describe('sharpenRgba', () => {
  it('単色は変化しない', () => {
    const d = new Uint8ClampedArray(4 * 4);
    for (let i = 0; i < d.length; i += 4) d.set([80, 80, 80, 255], i);
    expect(Array.from(sharpenRgba(d, 2, 2, 100))).toEqual(Array.from(d));
  });
  it('エッジが強調される', () => {
    const d = new Uint8ClampedArray([
      50, 50, 50, 255, 200, 200, 200, 255, 200, 200, 200, 255,
    ]);
    const out = sharpenRgba(d, 3, 1, 100);
    expect(out[0]).toBeLessThanOrEqual(50);
    expect(out[3]).toBe(255);
  });
});

describe('applyFilters', () => {
  it('入力を破壊しない・identityは同一内容', () => {
    const d = new Uint8ClampedArray([10, 20, 30, 255]);
    const out = applyFilters(d, 1, 1, DEFAULT_FILTER_SETTINGS);
    expect(Array.from(out)).toEqual([10, 20, 30, 255]);
    applyFilters(d, 1, 1, s({ invert: 100 }));
    expect(Array.from(d)).toEqual([10, 20, 30, 255]);
  });
  it('アルファは保持される', () => {
    const d = new Uint8ClampedArray([10, 20, 30, 77]);
    const out = applyFilters(d, 1, 1, s({ invert: 100, brightness: 10 }));
    expect(out[3]).toBe(77);
  });
  it('プリセットが適用できる', () => {
    for (const p of FILTER_PRESETS) {
      const st = presetToSettings(p);
      const out = applyFilters(
        new Uint8ClampedArray([10, 20, 30, 255]),
        1,
        1,
        st,
      );
      expect(out).toHaveLength(4);
    }
    const mono = presetToSettings(FILTER_PRESETS[0]);
    const out = applyFilters(
      new Uint8ClampedArray([255, 0, 0, 255]),
      1,
      1,
      mono,
    );
    expect(out[0]).toBe(out[1]);
  });
});

describe('ファイル関連', () => {
  it('出力ファイル名', () => {
    expect(buildOutputFileName('photo.png', 'jpeg')).toBe('photo-filtered.jpg');
    expect(buildOutputFileName('a.b.webp', 'png')).toBe('a.b-filtered.png');
    expect(buildOutputFileName('.png', 'png')).toBe('.png-filtered.png');
    expect(buildOutputFileName('', 'webp')).toBe('image-filtered.webp');
  });
  it('出力形式と入力判定', () => {
    expect(getOutputFormatOption('png').supportsQuality).toBe(false);
    expect(getOutputFormatOption('webp').mimeType).toBe('image/webp');
    expect(() => getOutputFormatOption('gif' as never)).toThrow();
    expect(isAcceptedImageFile({ type: 'image/gif' })).toBe(true);
    expect(isAcceptedImageFile({ type: 'image/svg+xml' })).toBe(false);
  });
  it('ファイルサイズ表記', () => {
    expect(formatFileSize(100)).toBe('100 B');
    expect(formatFileSize(1536)).toBe('1.50 KB');
  });
});
