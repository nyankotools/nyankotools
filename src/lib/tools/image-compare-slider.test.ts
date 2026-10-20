import { describe, expect, it } from 'vitest';
import {
  buildOutputFileName,
  clampPercent,
  containRect,
  fitMaxEdge,
  formatFileSize,
  isAcceptedImageFile,
  percentFromPointer,
  sideBySideLayout,
  splitRegions,
} from './image-compare-slider';

describe('clampPercent', () => {
  it('範囲内はそのまま、範囲外は丸める', () => {
    expect(clampPercent(30)).toBe(30);
    expect(clampPercent(-5)).toBe(0);
    expect(clampPercent(150)).toBe(100);
  });
  it('非数は50', () => {
    expect(clampPercent(NaN)).toBe(50);
    expect(clampPercent(Infinity)).toBe(50);
  });
});

describe('splitRegions', () => {
  it('左右分割', () => {
    const r = splitRegions(25, 200, 100, 'horizontal');
    expect(r.before).toEqual({ x: 0, y: 0, width: 50, height: 100 });
    expect(r.after).toEqual({ x: 50, y: 0, width: 150, height: 100 });
    expect(r.line).toEqual({ x1: 50, y1: 0, x2: 50, y2: 100 });
  });
  it('上下分割', () => {
    const r = splitRegions(50, 200, 100, 'vertical');
    expect(r.before).toEqual({ x: 0, y: 0, width: 200, height: 50 });
    expect(r.after).toEqual({ x: 0, y: 50, width: 200, height: 50 });
  });
  it('端の値でも幅0になるだけ', () => {
    expect(splitRegions(0, 100, 100, 'horizontal').before.width).toBe(0);
    expect(splitRegions(100, 100, 100, 'horizontal').after.width).toBe(0);
    expect(splitRegions(300, 100, 100, 'horizontal').after.width).toBe(0);
  });
});

describe('percentFromPointer', () => {
  const box = { left: 10, top: 20, width: 200, height: 100 };
  it('横方向', () => {
    expect(percentFromPointer(110, 0, box, 'horizontal')).toBe(50);
    expect(percentFromPointer(-100, 0, box, 'horizontal')).toBe(0);
    expect(percentFromPointer(999, 0, box, 'horizontal')).toBe(100);
  });
  it('縦方向', () => {
    expect(percentFromPointer(0, 45, box, 'vertical')).toBe(25);
  });
  it('サイズ0なら50', () => {
    expect(
      percentFromPointer(
        5,
        5,
        { left: 0, top: 0, width: 0, height: 0 },
        'horizontal',
      ),
    ).toBe(50);
  });
});

describe('containRect', () => {
  it('同じ比率なら全面', () => {
    expect(containRect(100, 50, 200, 100)).toEqual({
      x: 0,
      y: 0,
      width: 200,
      height: 100,
    });
  });
  it('縦長は左右に余白', () => {
    expect(containRect(50, 100, 200, 100)).toEqual({
      x: 75,
      y: 0,
      width: 50,
      height: 100,
    });
  });
  it('サイズ0は全面を返す', () => {
    expect(containRect(0, 0, 10, 10)).toEqual({
      x: 0,
      y: 0,
      width: 10,
      height: 10,
    });
  });
});

describe('fitMaxEdge', () => {
  it('小さければ変更なし', () => {
    expect(fitMaxEdge(100, 50, 200)).toEqual({
      width: 100,
      height: 50,
      scale: 1,
    });
  });
  it('長辺で縮小', () => {
    const r = fitMaxEdge(4000, 2000, 1000);
    expect(r).toEqual({ width: 1000, height: 500, scale: 0.25 });
  });
  it('極端な比率でも1px以上', () => {
    expect(fitMaxEdge(10000, 1, 100).height).toBe(1);
  });
});

describe('sideBySideLayout', () => {
  it('横並び', () => {
    const l = sideBySideLayout(100, 50, 'horizontal', 8);
    expect(l.width).toBe(208);
    expect(l.height).toBe(50);
    expect(l.after.x).toBe(108);
  });
  it('縦並び', () => {
    const l = sideBySideLayout(100, 50, 'vertical', 8);
    expect(l.width).toBe(100);
    expect(l.height).toBe(108);
    expect(l.after.y).toBe(58);
  });
});

describe('buildOutputFileName', () => {
  it('拡張子を置換', () => {
    expect(buildOutputFileName('photo.jpg', 'slider')).toBe(
      'photo-compare.png',
    );
    expect(buildOutputFileName('a.b.webp', 'side-by-side')).toBe(
      'a.b-side-by-side.png',
    );
  });
  it('拡張子なし・空・ドット始まり', () => {
    expect(buildOutputFileName('photo', 'slider')).toBe('photo-compare.png');
    expect(buildOutputFileName('', 'slider')).toBe('image-compare.png');
    expect(buildOutputFileName('.hidden', 'slider')).toBe(
      '.hidden-compare.png',
    );
  });
});

describe('isAcceptedImageFile / formatFileSize', () => {
  it('MIMEの判定', () => {
    expect(isAcceptedImageFile({ type: 'image/png' })).toBe(true);
    expect(isAcceptedImageFile({ type: 'image/svg+xml' })).toBe(false);
    expect(isAcceptedImageFile({ type: '' })).toBe(false);
  });
  it('サイズ表記', () => {
    expect(formatFileSize(512)).toBe('512 B');
    expect(formatFileSize(1536)).toBe('1.50 KB');
    expect(formatFileSize(5 * 1024 * 1024)).toBe('5.00 MB');
  });
});
