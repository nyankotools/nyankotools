import { describe, it, expect } from 'vitest';
import {
  anchorPosition,
  buildFont,
  clampNumber,
  MAX_TILES,
  overlayFileName,
  textLines,
  tileCenters,
} from './image-text-overlay';

const image = { width: 400, height: 200 };
const box = { width: 100, height: 40 };

describe('textLines', () => {
  it('改行で分け、末尾の空行を捨てる', () => {
    expect(textLines('a\r\nb\n\n')).toEqual(['a', 'b']);
  });
  it('空白だけなら空配列', () => {
    expect(textLines('  \n ')).toEqual([]);
    expect(textLines('')).toEqual([]);
  });
});

describe('anchorPosition', () => {
  it('9方向の左上座標', () => {
    expect(anchorPosition('top-left', image, box, 10)).toEqual({
      x: 10,
      y: 10,
    });
    expect(anchorPosition('bottom-right', image, box, 10)).toEqual({
      x: 290,
      y: 150,
    });
    expect(anchorPosition('center', image, box, 10)).toEqual({ x: 150, y: 80 });
    expect(anchorPosition('top-center', image, box, 0)).toEqual({
      x: 150,
      y: 0,
    });
    expect(anchorPosition('middle-left', image, box, 5)).toEqual({
      x: 5,
      y: 80,
    });
    expect(anchorPosition('middle-right', image, box, 5)).toEqual({
      x: 295,
      y: 80,
    });
    expect(anchorPosition('bottom-left', image, box, 0)).toEqual({
      x: 0,
      y: 160,
    });
    expect(anchorPosition('bottom-center', image, box, 0)).toEqual({
      x: 150,
      y: 160,
    });
    expect(anchorPosition('top-right', image, box, 0)).toEqual({
      x: 300,
      y: 0,
    });
  });
  it('負の余白は0として扱う', () => {
    expect(anchorPosition('top-left', image, box, -9)).toEqual({ x: 0, y: 0 });
  });
});

describe('tileCenters', () => {
  it('画像の四隅まで覆い、1行おきに半マスずれる', () => {
    const { points, stepX } = tileCenters(image, box, 20);
    expect(stepX).toBe(120);
    const radius = Math.hypot(400, 200) / 2;
    expect(Math.min(...points.map((p) => p.x))).toBeLessThanOrEqual(-radius);
    expect(Math.max(...points.map((p) => p.x))).toBeGreaterThanOrEqual(radius);
    const rowYs = [...new Set(points.map((p) => p.y))].sort((a, b) => a - b);
    const firstX = (y: number) =>
      Math.min(...points.filter((p) => p.y === y).map((p) => p.x));
    expect(firstX(rowYs[1]) - firstX(rowYs[0])).toBeCloseTo(-60);
  });

  it('個数が上限を超えるときは間隔を広げて抑える', () => {
    const { points, stepX } = tileCenters(
      { width: 4000, height: 3000 },
      { width: 4, height: 4 },
      0,
    );
    expect(points.length).toBeLessThanOrEqual(MAX_TILES);
    expect(stepX).toBeGreaterThan(4);
  });
});

describe('その他', () => {
  it('clampNumber は範囲に収め、NaN は代替値', () => {
    expect(clampNumber(5, 0, 3)).toBe(3);
    expect(clampNumber(-1, 0, 3)).toBe(0);
    expect(clampNumber(NaN, 0, 3, 2)).toBe(2);
  });
  it('buildFont は太字とサイズを含む', () => {
    expect(buildFont(24.4, true, 'serif')).toMatch(/^bold 24px /);
    expect(buildFont(24, false, 'mono')).toMatch(/^24px /);
    expect(buildFont(NaN, false, 'sans')).toMatch(/^16px /);
  });
  it('ファイル名', () => {
    expect(overlayFileName('photo.jpg', 'png')).toBe('photo-text.png');
    expect(overlayFileName(null, 'jpeg')).toBe('image-text.jpg');
  });
});
