import { describe, expect, it } from 'vitest';
import {
  buildFilename,
  contrastTextColor,
  defaultLabel,
  fitFontSize,
  isValidSize,
  normalizeHexColor,
  FORMAT_INFO,
  MAX_SIZE,
  MIN_SIZE,
} from './placeholder-image-generator';

describe('isValidSize', () => {
  it('1〜4096の整数のみ有効', () => {
    expect(isValidSize(1)).toBe(true);
    expect(isValidSize(4096)).toBe(true);
    expect(isValidSize(0)).toBe(false);
    expect(isValidSize(4097)).toBe(false);
    expect(isValidSize(10.5)).toBe(false);
    expect(isValidSize(NaN)).toBe(false);
  });
  it('負の数は無効', () => {
    expect(isValidSize(-1)).toBe(false);
    expect(isValidSize(-100)).toBe(false);
  });
  it('無限大は無効', () => {
    expect(isValidSize(Infinity)).toBe(false);
    expect(isValidSize(-Infinity)).toBe(false);
  });
  it('1と4096の境界値は有効', () => {
    expect(isValidSize(MIN_SIZE)).toBe(true);
    expect(isValidSize(MAX_SIZE)).toBe(true);
    expect(isValidSize(MIN_SIZE - 1)).toBe(false);
    expect(isValidSize(MAX_SIZE + 1)).toBe(false);
  });
});

describe('normalizeHexColor', () => {
  it('3桁・6桁・#なしを正規化する', () => {
    expect(normalizeHexColor('#ABC')).toBe('#aabbcc');
    expect(normalizeHexColor('cccccc')).toBe('#cccccc');
    expect(normalizeHexColor(' #FF0000 ')).toBe('#ff0000');
  });
  it('大文字・小文字混在の入力を小文字に正規化する', () => {
    expect(normalizeHexColor('#AbCdEf')).toBe('#abcdef');
    expect(normalizeHexColor('AbC')).toBe('#aabbcc');
  });
  it('白・黒・グレースケールなど標準色を正規化する', () => {
    expect(normalizeHexColor('#ffffff')).toBe('#ffffff');
    expect(normalizeHexColor('#000000')).toBe('#000000');
    expect(normalizeHexColor('#888')).toBe('#888888');
  });
  it('不正な値はnull', () => {
    expect(normalizeHexColor('')).toBeNull();
    expect(normalizeHexColor('#12')).toBeNull();
    expect(normalizeHexColor('#gggggg')).toBeNull();
    expect(normalizeHexColor('#')).toBeNull();
    expect(normalizeHexColor('##ffffff')).toBeNull();
  });
});

describe('contrastTextColor', () => {
  it('明るい背景は黒、暗い背景は白', () => {
    expect(contrastTextColor('#ffffff')).toBe('#000000');
    expect(contrastTextColor('#000000')).toBe('#ffffff');
  });
  it('グレースケール中間値付近での切り替わりが正しく機能する', () => {
    // luminance > 0.6 で黒、そうでなければ白
    // 白いグレー（#cccccc）は明るいので黒
    expect(contrastTextColor('#cccccc')).toBe('#000000');
    // 暗いグレー（#333333）は暗いので白
    expect(contrastTextColor('#333333')).toBe('#ffffff');
  });
  it('原色系の色に対して適切なコントラストを選択する', () => {
    // 赤は比較的暗いので白テキスト
    expect(contrastTextColor('#ff0000')).toBe('#ffffff');
    // 黄は明るいので黒テキスト
    expect(contrastTextColor('#ffff00')).toBe('#000000');
    // 青は比較的暗いので白テキスト
    expect(contrastTextColor('#0000ff')).toBe('#ffffff');
  });
});

describe('defaultLabel / buildFilename', () => {
  it('寸法から生成する', () => {
    expect(defaultLabel(600, 400)).toBe('600×400');
    expect(buildFilename(600, 400, 'jpeg')).toBe('placeholder-600x400.jpg');
  });
});

describe('fitFontSize', () => {
  it('高さの50%を上限に、幅に収まるよう縮小する', () => {
    expect(fitFontSize(1000, 100, 2)).toBe(50);
    expect(fitFontSize(100, 100, 5)).toBe(18);
  });
  it('最小1px', () => {
    expect(fitFontSize(1, 1, 100)).toBe(1);
  });
  it('textWidthPerPx が 0 の場合は高さの50%を使用する', () => {
    expect(fitFontSize(1000, 200, 0)).toBe(100);
  });
  it('最大サイズ（4096x4096）でも計算できる', () => {
    const result = fitFontSize(4096, 4096, 1);
    expect(result).toBeGreaterThan(0);
    expect(result).toBeLessThanOrEqual(2048); // 4096 * 0.5
  });
  it('非常に細い画像（1x4096）でも計算できる', () => {
    const result = fitFontSize(1, 4096, 1);
    expect(result).toBeGreaterThan(0);
  });
});

describe('FORMAT_INFO', () => {
  it('サポートされているすべてのフォーマットに対応している', () => {
    expect(FORMAT_INFO['png'].mime).toBe('image/png');
    expect(FORMAT_INFO['jpeg'].mime).toBe('image/jpeg');
    expect(FORMAT_INFO['webp'].mime).toBe('image/webp');
  });
  it('ファイル拡張子が正しい', () => {
    expect(FORMAT_INFO['png'].extension).toBe('png');
    expect(FORMAT_INFO['jpeg'].extension).toBe('jpg');
    expect(FORMAT_INFO['webp'].extension).toBe('webp');
  });
});
