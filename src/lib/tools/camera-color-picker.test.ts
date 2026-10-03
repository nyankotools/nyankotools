import { describe, expect, it } from 'vitest';
import {
  addColorToHistory,
  averageColor,
  describeColor,
  mapPointToSource,
  readableTextColor,
  sampleRegion,
} from './camera-color-picker';

describe('mapPointToSource', () => {
  it('同じ縦横比ならそのまま拡大率で割った座標になる', () => {
    expect(mapPointToSource(160, 90, 320, 180, 1280, 720)).toEqual({
      x: 640,
      y: 360,
    });
  });

  it('左上・右下の端を正しく扱う', () => {
    expect(mapPointToSource(0, 0, 320, 180, 640, 360)).toEqual({ x: 0, y: 0 });
    expect(mapPointToSource(319.9, 179.9, 320, 180, 640, 360)).toEqual({
      x: 639,
      y: 359,
    });
    expect(mapPointToSource(320, 90, 320, 180, 640, 360)).toBeNull();
  });

  it('レターボックスの余白は null', () => {
    // 4:3 の映像を 16:9 の枠に表示 → 左右に余白
    expect(mapPointToSource(5, 90, 320, 180, 640, 480)).toBeNull();
    expect(mapPointToSource(160, 90, 320, 180, 640, 480)).toEqual({
      x: 320,
      y: 240,
    });
  });

  it('サイズ未確定（0）は null', () => {
    expect(mapPointToSource(1, 1, 320, 180, 0, 0)).toBeNull();
    expect(mapPointToSource(1, 1, 0, 0, 640, 480)).toBeNull();
  });
});

describe('sampleRegion', () => {
  it('半径0は1画素', () => {
    expect(sampleRegion(10, 10, 0, 100, 100)).toEqual({
      sx: 10,
      sy: 10,
      sw: 1,
      sh: 1,
    });
  });

  it('範囲内なら (2r+1) 四方', () => {
    expect(sampleRegion(10, 10, 2, 100, 100)).toEqual({
      sx: 8,
      sy: 8,
      sw: 5,
      sh: 5,
    });
  });

  it('端では映像の範囲内に切り詰める', () => {
    expect(sampleRegion(0, 0, 2, 100, 100)).toEqual({
      sx: 0,
      sy: 0,
      sw: 3,
      sh: 3,
    });
    expect(sampleRegion(99, 99, 2, 100, 100)).toEqual({
      sx: 97,
      sy: 97,
      sw: 3,
      sh: 3,
    });
  });
});

describe('averageColor', () => {
  it('単一画素はその色（アルファ無視）', () => {
    expect(averageColor([10, 20, 30, 0])).toEqual({ r: 10, g: 20, b: 30 });
  });

  it('複数画素は平均を四捨五入する', () => {
    expect(averageColor([0, 0, 0, 255, 255, 255, 255, 255])).toEqual({
      r: 128,
      g: 128,
      b: 128,
    });
  });

  it('空は黒', () => {
    expect(averageColor([])).toEqual({ r: 0, g: 0, b: 0 });
  });
});

describe('describeColor', () => {
  it('HEXは大文字、RGB/HSLは文字列で返す', () => {
    const c = describeColor({ r: 255, g: 0, b: 128 });
    expect(c.hex).toBe('#FF0080');
    expect(c.rgb).toContain('255');
    expect(c.hsl).toContain('hsl');
  });
});

describe('readableTextColor', () => {
  it('明るい色は黒、暗い色は白', () => {
    expect(readableTextColor({ r: 255, g: 255, b: 255 })).toBe('#000000');
    expect(readableTextColor({ r: 0, g: 0, b: 0 })).toBe('#ffffff');
    expect(readableTextColor({ r: 0, g: 0, b: 255 })).toBe('#ffffff');
  });
});

describe('addColorToHistory', () => {
  it('先頭に追加し、重複は先頭へ移動する', () => {
    expect(addColorToHistory(['#111111', '#222222'], '#333333')).toEqual([
      '#333333',
      '#111111',
      '#222222',
    ]);
    expect(addColorToHistory(['#111111', '#222222'], '#222222')).toEqual([
      '#222222',
      '#111111',
    ]);
  });

  it('上限を超えた分は古いものから捨てる', () => {
    expect(addColorToHistory(['#1', '#2', '#3'], '#4', 3)).toEqual([
      '#4',
      '#1',
      '#2',
    ]);
  });
});
