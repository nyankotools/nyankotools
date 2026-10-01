import { describe, expect, it } from 'vitest';
import {
  isWithinOutputLimit,
  parseSvgSize,
  pngFileName,
  prepareSvg,
  scaleSize,
} from './svg-to-png';

describe('parseSvgSize', () => {
  it('width/height 属性（px・単位なし）を読む', () => {
    expect(parseSvgSize('<svg width="120" height="80"></svg>')).toEqual({
      width: 120,
      height: 80,
    });
    expect(parseSvgSize('<svg width="10px" height="20px"/>')).toEqual({
      width: 10,
      height: 20,
    });
  });

  it('単位を px に換算する', () => {
    const size = parseSvgSize('<svg width="1in" height="12pt"></svg>');
    expect(size?.width).toBeCloseTo(96);
    expect(size?.height).toBeCloseTo(16);
  });

  it('width/height が無ければ viewBox を使う', () => {
    expect(parseSvgSize('<svg viewBox="0 0 24 16"></svg>')).toEqual({
      width: 24,
      height: 16,
    });
    expect(parseSvgSize('<svg viewBox="0,0,24,16"></svg>')).toEqual({
      width: 24,
      height: 16,
    });
  });

  it('片方だけの指定や % 指定は viewBox の比率で補う', () => {
    expect(parseSvgSize('<svg width="100" viewBox="0 0 50 25"></svg>')).toEqual(
      { width: 100, height: 50 },
    );
    expect(
      parseSvgSize('<svg width="100%" height="100%" viewBox="0 0 8 4"></svg>'),
    ).toEqual({ width: 8, height: 4 });
  });

  it('stroke-width など別の属性を width と取り違えない', () => {
    expect(
      parseSvgSize('<svg stroke-width="9" viewBox="0 0 10 10"></svg>'),
    ).toEqual({ width: 10, height: 10 });
  });

  it('XML宣言・コメント・DOCTYPE があってもよい', () => {
    const svg =
      '<?xml version="1.0"?><!-- <svg width="1" height="1"> --><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "x"><svg width="5" height="6"></svg>';
    expect(parseSvgSize(svg)).toEqual({ width: 5, height: 6 });
  });

  it('SVGでない入力・サイズ不明は null', () => {
    expect(parseSvgSize('')).toBeNull();
    expect(parseSvgSize('<div width="1" height="1"></div>')).toBeNull();
    expect(parseSvgSize('hello')).toBeNull();
    expect(parseSvgSize('<svg></svg>')).toBeNull();
    expect(parseSvgSize('<svg width="0" height="0"></svg>')).toBeNull();
    expect(parseSvgSize('<svg viewBox="0 0 0 10"></svg>')).toBeNull();
  });
});

describe('prepareSvg', () => {
  const size = { width: 10, height: 20 };

  it('xmlns・viewBox を補い、width/height を出力サイズに置き換える', () => {
    const out = prepareSvg('<svg width="10" height="20"><rect/></svg>', size, {
      width: 30,
      height: 60,
    });
    expect(out).toBe(
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 10 20" width="30" height="60"><rect/></svg>',
    );
  });

  it('既存の xmlns・viewBox は維持する', () => {
    const out = prepareSvg(
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 5 5" width="10" height="20"></svg>',
      size,
      { width: 20, height: 40 },
    )!;
    expect(out.match(/xmlns=/g)).toHaveLength(1);
    expect(out.match(/viewBox=/g)).toHaveLength(1);
    expect(out).toContain('width="20" height="40"');
    expect(out).not.toContain('width="10"');
  });

  it('自己終了タグも扱える', () => {
    expect(prepareSvg('<svg width="1" height="1"/>', size, size)).toMatch(
      /^<svg[^>]*\/>$/,
    );
  });

  it('SVGでなければ null', () => {
    expect(prepareSvg('<html></html>', size, size)).toBeNull();
  });
});

describe('scaleSize / isWithinOutputLimit', () => {
  it('倍率をかけて整数に丸める（最小1）', () => {
    expect(scaleSize({ width: 10.4, height: 5 }, 2)).toEqual({
      width: 21,
      height: 10,
    });
    expect(scaleSize({ width: 0.1, height: 0.1 }, 1)).toEqual({
      width: 1,
      height: 1,
    });
  });

  it('1辺と総画素数の上限を判定する', () => {
    expect(isWithinOutputLimit({ width: 8192, height: 1000 })).toBe(true);
    expect(isWithinOutputLimit({ width: 8193, height: 10 })).toBe(false);
    expect(isWithinOutputLimit({ width: 4100, height: 4100 })).toBe(false);
  });
});

describe('pngFileName', () => {
  it('拡張子を .png に置き換える', () => {
    expect(pngFileName('logo.svg')).toBe('logo.png');
    expect(pngFileName('my.icon.svg')).toBe('my.icon.png');
  });

  it('名前が無ければ image.png', () => {
    expect(pngFileName(null)).toBe('image.png');
    expect(pngFileName('.svg')).toBe('image.png');
  });
});
