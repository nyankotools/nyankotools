import { describe, it, expect } from 'vitest';
import {
  VISION_TYPES,
  buildOutputFileName,
  clampSeverity,
  contrastRatio,
  getMatrix,
  simulateHex,
  simulateImageData,
  simulatePixel,
} from './color-blindness-simulator';

describe('getMatrix', () => {
  it('重症度0は単位行列になる', () => {
    expect(getMatrix('protanopia', 0)).toEqual([1, 0, 0, 0, 1, 0, 0, 0, 1]);
  });

  it('各行の和が約1（白が白のまま）', () => {
    for (const id of ['protanopia', 'deuteranopia', 'tritanopia'] as const) {
      const m = getMatrix(id, 100);
      for (let row = 0; row < 3; row++) {
        const sum = m[row * 3] + m[row * 3 + 1] + m[row * 3 + 2];
        expect(sum).toBeGreaterThan(0.99);
        expect(sum).toBeLessThan(1.01);
      }
    }
  });

  it('全色盲は輝度係数の行が3つ並ぶ', () => {
    const m = getMatrix('achromatopsia', 50);
    expect(m.slice(0, 3)).toEqual(m.slice(3, 6));
    expect(m.slice(3, 6)).toEqual(m.slice(6, 9));
  });

  it('重症度50%は単位行列と完全行列の中間になる', () => {
    const half = getMatrix('protanopia', 50);
    const full = getMatrix('protanopia', 100);
    // (1 + 0.152286) / 2 = 0.576143
    expect(half[0]).toBeCloseTo(0.576143, 5);
    expect(half[0]).toBeGreaterThan(full[0]);
    expect(half[0]).toBeLessThan(1);
  });
});

describe('clampSeverity', () => {
  it('範囲内に収め、非数は100', () => {
    expect(clampSeverity(-5)).toBe(0);
    expect(clampSeverity(150)).toBe(100);
    expect(clampSeverity(33.4)).toBe(33);
    expect(clampSeverity(NaN)).toBe(100);
    expect(clampSeverity(Infinity)).toBe(100);
    expect(clampSeverity(-Infinity)).toBe(100);
  });
});

describe('simulatePixel / simulateHex', () => {
  it('白・黒・灰色は変化しない', () => {
    for (const v of [0, 128, 255]) {
      for (const t of VISION_TYPES) {
        const [r, g, b] = simulatePixel(v, v, v, getMatrix(t.id, 100));
        expect(Math.abs(r - v)).toBeLessThanOrEqual(2);
        expect(Math.abs(g - v)).toBeLessThanOrEqual(2);
        expect(Math.abs(b - v)).toBeLessThanOrEqual(2);
      }
    }
  });

  it('P型では赤が暗く変化する', () => {
    const red = simulateHex('#ff0000', 'protanopia', 100)!;
    expect(parseInt(red.slice(1, 3), 16)).toBeLessThan(120);
  });

  it('全色盲は無彩色になる', () => {
    const out = simulateHex('#3366cc', 'achromatopsia', 100)!;
    expect(out.slice(1, 3)).toBe(out.slice(3, 5));
    expect(out.slice(3, 5)).toBe(out.slice(5, 7));
  });

  it('重症度0では元の色のまま', () => {
    expect(simulateHex('#3366cc', 'deuteranopia', 0)).toBe('#3366cc');
  });

  it('3桁表記を受け付け、不正はnull', () => {
    expect(simulateHex('#fff', 'tritanopia', 100)).toBe('#ffffff');
    expect(simulateHex('xyz', 'tritanopia', 100)).toBeNull();
  });

  it('大文字の16進数も小文字と同じ結果になる', () => {
    expect(simulateHex('#FF0000', 'protanopia', 100)).toBe(
      simulateHex('#ff0000', 'protanopia', 100),
    );
  });

  it('空文字・#だけの入力はnull', () => {
    expect(simulateHex('', 'protanopia', 100)).toBeNull();
    expect(simulateHex('#', 'protanopia', 100)).toBeNull();
  });
});

describe('simulateImageData', () => {
  it('アルファを保持し、元の配列を変更しない', () => {
    const src = new Uint8ClampedArray([255, 0, 0, 128, 0, 255, 0, 255]);
    const out = simulateImageData(src, 'deuteranopia', 100);
    expect(out.length).toBe(8);
    expect(out[3]).toBe(128);
    expect(out[7]).toBe(255);
    expect(src[0]).toBe(255);
  });

  it('空の配列は空の配列を返す', () => {
    const out = simulateImageData(new Uint8ClampedArray(0), 'tritanopia', 100);
    expect(out.length).toBe(0);
  });

  it('重症度0なら色は変わらない', () => {
    const src = new Uint8ClampedArray([10, 200, 30, 255]);
    expect(Array.from(simulateImageData(src, 'protanopia', 0))).toEqual([
      10, 200, 30, 255,
    ]);
  });
});

describe('contrastRatio', () => {
  it('白黒は21、同色は1', () => {
    expect(contrastRatio('#000000', '#ffffff')).toBeCloseTo(21, 5);
    expect(contrastRatio('#336699', '#336699')).toBeCloseTo(1, 5);
  });

  it('引数の順序によらず同じ値になり、3桁表記も受け付ける', () => {
    expect(contrastRatio('#000', '#fff')).toBeCloseTo(21, 5);
    expect(contrastRatio('#fff', '#000')).toBeCloseTo(21, 5);
    expect(contrastRatio('#e53935', '#43a047')).toBeCloseTo(
      contrastRatio('#43a047', '#e53935')!,
      10,
    );
  });

  it('不正入力はnull', () => {
    expect(contrastRatio('abc!', '#fff')).toBeNull();
    expect(contrastRatio('#fff', '')).toBeNull();
  });
});

describe('buildOutputFileName', () => {
  it('拡張子をpngにし種別を付ける', () => {
    expect(buildOutputFileName('photo.jpg', 'protanopia')).toBe(
      'photo-protanopia.png',
    );
    expect(buildOutputFileName('', 'tritanopia')).toBe('image-tritanopia.png');
  });

  it('拡張子がない・大文字・日本語・ドットを含むファイル名', () => {
    expect(buildOutputFileName('photo', 'achromatopsia')).toBe(
      'photo-achromatopsia.png',
    );
    expect(buildOutputFileName('IMG.JPEG', 'deuteranopia')).toBe(
      'IMG-deuteranopia.png',
    );
    expect(buildOutputFileName('写真.webp', 'protanopia')).toBe(
      '写真-protanopia.png',
    );
    expect(buildOutputFileName('a.b.png', 'tritanopia')).toBe(
      'a.b-tritanopia.png',
    );
  });
});
