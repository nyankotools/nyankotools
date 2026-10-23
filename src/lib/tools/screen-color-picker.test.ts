import { describe, expect, it } from 'vitest';
import {
  addColorToHistory,
  describeColor,
  describeHex,
  getEyeDropper,
  isEyeDropperAbort,
  mapPointToPixel,
  parseEyeDropperHex,
  pixelColorAt,
  readableTextColor,
} from './screen-color-picker';

describe('getEyeDropper', () => {
  it('対応していれば constructor を返す', () => {
    class Fake {
      open() {
        return Promise.resolve({ sRGBHex: '#000000' });
      }
    }
    expect(getEyeDropper({ EyeDropper: Fake })).toBe(Fake);
  });
  it('未対応は null', () => {
    expect(getEyeDropper({})).toBeNull();
    expect(getEyeDropper({ EyeDropper: 1 })).toBeNull();
  });
});

describe('parseEyeDropperHex', () => {
  it('大文字へ正規化する', () => {
    expect(parseEyeDropperHex('#ff8000')).toBe('#FF8000');
  });
  it('不正は null', () => {
    expect(parseEyeDropperHex('red')).toBeNull();
    expect(parseEyeDropperHex('')).toBeNull();
  });
});

describe('isEyeDropperAbort', () => {
  it('AbortError を判定する', () => {
    expect(isEyeDropperAbort(new DOMException('x', 'AbortError'))).toBe(true);
    expect(isEyeDropperAbort(new Error('x'))).toBe(false);
    expect(isEyeDropperAbort(null)).toBe(false);
    expect(isEyeDropperAbort('AbortError')).toBe(false);
  });
});

describe('describeColor / describeHex', () => {
  it('3形式を返す', () => {
    expect(describeColor({ r: 255, g: 0, b: 0 })).toEqual({
      hex: '#FF0000',
      rgb: 'rgb(255, 0, 0)',
      hsl: 'hsl(0, 100%, 50%)',
    });
  });
  it('HEXから変換し、不正はnull', () => {
    expect(describeHex('#fff')?.hex).toBe('#FFFFFF');
    expect(describeHex('zzz')).toBeNull();
  });
});

describe('readableTextColor', () => {
  it('明るい色は黒、暗い色は白', () => {
    expect(readableTextColor({ r: 255, g: 255, b: 255 })).toBe('#000000');
    expect(readableTextColor({ r: 0, g: 0, b: 0 })).toBe('#ffffff');
  });
});

describe('mapPointToPixel', () => {
  it('表示サイズを画像座標へ換算する', () => {
    expect(mapPointToPixel(50, 25, 100, 50, 200, 100)).toEqual({
      x: 100,
      y: 50,
    });
  });
  it('右下端は最後の画素に収める', () => {
    expect(mapPointToPixel(100, 50, 100, 50, 200, 100)).toEqual({
      x: 199,
      y: 99,
    });
  });
  it('範囲外・不正サイズは null', () => {
    expect(mapPointToPixel(-1, 0, 100, 50, 200, 100)).toBeNull();
    expect(mapPointToPixel(101, 0, 100, 50, 200, 100)).toBeNull();
    expect(mapPointToPixel(0, 0, 0, 50, 200, 100)).toBeNull();
    expect(mapPointToPixel(0, 0, 100, 50, 0, 100)).toBeNull();
  });
});

describe('pixelColorAt', () => {
  const data = [1, 2, 3, 255, 4, 5, 6, 255, 7, 8, 9, 255, 10, 11, 12, 255];
  it('座標の色を返す', () => {
    expect(pixelColorAt(data, 2, 1, 1)).toEqual({ r: 10, g: 11, b: 12 });
    expect(pixelColorAt(data, 2, 0, 1)).toEqual({ r: 7, g: 8, b: 9 });
  });
  it('範囲外は null', () => {
    expect(pixelColorAt(data, 2, 2, 0)).toBeNull();
    expect(pixelColorAt(data, 2, 0, 2)).toBeNull();
    expect(pixelColorAt(data, 2, -1, 0)).toBeNull();
    expect(pixelColorAt(data, 0, 0, 0)).toBeNull();
  });
});

describe('addColorToHistory', () => {
  it('先頭に追加し大文字化する', () => {
    expect(addColorToHistory(['#000000'], '#ff0000')).toEqual([
      '#FF0000',
      '#000000',
    ]);
  });
  it('重複は先頭へ移動する', () => {
    expect(addColorToHistory(['#111111', '#222222'], '#222222')).toEqual([
      '#222222',
      '#111111',
    ]);
  });
  it('上限を超えた分は捨てる（既定30件）', () => {
    let h: string[] = [];
    for (let i = 0; i < 40; i++) {
      h = addColorToHistory(h, `#${i.toString(16).padStart(6, '0')}`);
    }
    expect(h).toHaveLength(30);
    expect(h[0]).toBe('#000027');
  });
  it('max 指定が効く', () => {
    expect(addColorToHistory(['#111111', '#222222'], '#333333', 2)).toEqual([
      '#333333',
      '#111111',
    ]);
  });
});
