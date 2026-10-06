import { describe, it, expect } from 'vitest';
import {
  MAX_PIXELS,
  applyLines,
  applyNoise,
  applyWarp,
  clampStrength,
  createRng,
  isWithinPixelLimit,
  protectImageData,
} from './ocr-protect-image';

function solid(width: number, height: number, value = 128, alpha = 255) {
  const data = new Uint8ClampedArray(width * height * 4);
  for (let i = 0; i < data.length; i += 4) {
    data[i] = value;
    data[i + 1] = value;
    data[i + 2] = value;
    data[i + 3] = alpha;
  }
  return data;
}

function stripes(width: number, height: number) {
  const data = solid(width, height, 255);
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x += 2) {
      const i = (y * width + x) * 4;
      data[i] = data[i + 1] = data[i + 2] = 0;
    }
  }
  return data;
}

describe('clampStrength', () => {
  it('範囲内に丸める', () => {
    expect(clampStrength(-5)).toBe(0);
    expect(clampStrength(250)).toBe(100);
    expect(clampStrength(33.6)).toBe(34);
  });
  it('非数は0にする', () => {
    expect(clampStrength(NaN)).toBe(0);
    expect(clampStrength(Infinity)).toBe(0);
  });
});

describe('isWithinPixelLimit', () => {
  it('上限ちょうどは許可し、超えると拒否する', () => {
    expect(isWithinPixelLimit(4000, 4000)).toBe(true);
    expect(isWithinPixelLimit(4000, 4001)).toBe(false);
    expect(MAX_PIXELS).toBe(16_000_000);
  });
});

describe('createRng', () => {
  it('同じシードなら同じ列、違うシードなら違う列になる', () => {
    const a = createRng(1);
    const b = createRng(1);
    const c = createRng(2);
    const seqA = [a(), a(), a()];
    expect(seqA).toEqual([b(), b(), b()]);
    expect(seqA).not.toEqual([c(), c(), c()]);
  });
  it('値は0以上1未満', () => {
    const r = createRng(42);
    for (let i = 0; i < 1000; i++) {
      const v = r();
      expect(v).toBeGreaterThanOrEqual(0);
      expect(v).toBeLessThan(1);
    }
  });
});

describe('applyWarp', () => {
  it('強度0なら入力をそのまま返す', () => {
    const src = stripes(16, 16);
    expect(applyWarp(src, 16, 16, 0, createRng(1))).toBe(src);
  });
  it('強度があると画素が変わり、元配列は変更されない', () => {
    const src = stripes(64, 64);
    const copy = new Uint8ClampedArray(src);
    const out = applyWarp(src, 64, 64, 100, createRng(1));
    expect(out).not.toBe(src);
    expect(out.length).toBe(src.length);
    expect(Array.from(out)).not.toEqual(Array.from(src));
    expect(Array.from(src)).toEqual(Array.from(copy));
  });
  it('1x1画像でも例外なく動く', () => {
    const out = applyWarp(solid(1, 1), 1, 1, 100, createRng(1));
    expect(Array.from(out)).toEqual([128, 128, 128, 255]);
  });
});

describe('applyNoise', () => {
  it('強度0なら変更しない', () => {
    const d = solid(8, 8);
    applyNoise(d, 0, createRng(1));
    expect(Array.from(d)).toEqual(Array.from(solid(8, 8)));
  });
  it('RGBを変化させ、アルファは変更しない', () => {
    const d = solid(32, 32);
    applyNoise(d, 100, createRng(1));
    let changed = 0;
    for (let i = 0; i < d.length; i += 4) {
      if (d[i] !== 128) changed++;
      expect(d[i + 3]).toBe(255);
    }
    expect(changed).toBeGreaterThan(32 * 32 * 0.5);
  });
  it('完全透明の画素には触れない', () => {
    const d = solid(8, 8, 128, 0);
    applyNoise(d, 100, createRng(1));
    expect(Array.from(d)).toEqual(Array.from(solid(8, 8, 128, 0)));
  });
});

describe('applyLines', () => {
  it('強度0なら変更しない', () => {
    const d = solid(100, 100);
    applyLines(d, 100, 100, 0, createRng(1));
    expect(Array.from(d)).toEqual(Array.from(solid(100, 100)));
  });
  it('線が重なり画素が変わる', () => {
    const d = solid(200, 200);
    applyLines(d, 200, 200, 100, createRng(1));
    expect(Array.from(d)).not.toEqual(Array.from(solid(200, 200)));
  });
  it('非常に小さい画像（線の本数が0）でも例外なく動く', () => {
    const d = solid(4, 4);
    expect(() => applyLines(d, 4, 4, 100, createRng(1))).not.toThrow();
  });
});

describe('protectImageData', () => {
  const opts = { noise: 50, warp: 50, lines: 50 };
  it('元の配列を変更せず、同じシードなら同じ結果になる', () => {
    const src = stripes(64, 64);
    const copy = new Uint8ClampedArray(src);
    const a = protectImageData(src, 64, 64, opts, 7);
    const b = protectImageData(src, 64, 64, opts, 7);
    expect(Array.from(src)).toEqual(Array.from(copy));
    expect(Array.from(a)).toEqual(Array.from(b));
    expect(Array.from(a)).not.toEqual(Array.from(src));
  });
  it('シードが違えば結果も変わる', () => {
    const src = stripes(64, 64);
    const a = protectImageData(src, 64, 64, opts, 1);
    const b = protectImageData(src, 64, 64, opts, 2);
    expect(Array.from(a)).not.toEqual(Array.from(b));
  });
  it('すべて0なら元と同じ内容のコピーを返す', () => {
    const src = stripes(16, 16);
    const out = protectImageData(
      src,
      16,
      16,
      { noise: 0, warp: 0, lines: 0 },
      1,
    );
    expect(out).not.toBe(src);
    expect(Array.from(out)).toEqual(Array.from(src));
  });
  it('アルファチャンネルは保持される（歪み・ノイズ・線のみ）', () => {
    const src = solid(32, 32, 100, 200);
    const out = protectImageData(src, 32, 32, opts, 3);
    for (let i = 3; i < out.length; i += 4) expect(out[i]).toBe(200);
  });
});
