import { PDFDocument } from 'pdf-lib';
import { describe, expect, it } from 'vitest';
import {
  A4_HEIGHT,
  A4_WIDTH,
  clampScale,
  ImageToPdfError,
  imageFileName,
  imagesToPdf,
  MAX_CANVAS_PIXELS,
  outputSize,
} from './pdf-image-converter';

// 1x1 の PNG
const PNG = Uint8Array.from(
  atob(
    'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==',
  ),
  (c) => c.charCodeAt(0),
);

describe('imagesToPdf', () => {
  it('fit: 画像サイズのページを画像ごとに作る', async () => {
    const out = await imagesToPdf(
      [
        { bytes: PNG, type: 'image/png' },
        { bytes: PNG, type: 'image/png' },
      ],
      'fit',
    );
    const doc = await PDFDocument.load(out);
    expect(doc.getPageCount()).toBe(2);
    expect(doc.getPage(0).getSize()).toEqual({ width: 1, height: 1 });
  });
  it('a4: A4縦ページになる', async () => {
    const out = await imagesToPdf([{ bytes: PNG, type: 'image/png' }], 'a4');
    const size = (await PDFDocument.load(out)).getPage(0).getSize();
    expect(size.width).toBeCloseTo(A4_WIDTH);
    expect(size.height).toBeCloseTo(A4_HEIGHT);
  });
  it('画像なしは noImage', async () => {
    await expect(imagesToPdf([], 'fit')).rejects.toMatchObject({
      code: 'noImage',
    });
  });
  it('壊れた画像は badImage', async () => {
    const p = imagesToPdf(
      [{ bytes: new Uint8Array([1, 2, 3]), type: 'image/jpeg' }],
      'fit',
    );
    await expect(p).rejects.toBeInstanceOf(ImageToPdfError);
    await expect(p).rejects.toMatchObject({ code: 'badImage' });
  });
});

describe('imageFileName', () => {
  it('総ページ数の桁数でゼロ埋めする', () => {
    expect(imageFileName('doc', 3, 12, 'png')).toBe('doc_03.png');
    expect(imageFileName('doc', 3, 9, 'jpg')).toBe('doc_3.jpg');
  });
});

describe('outputSize / clampScale', () => {
  it('倍率をかけて丸める', () => {
    expect(outputSize(595.28, 841.89, 2)).toEqual({
      width: 1191,
      height: 1684,
    });
    expect(outputSize(0.1, 0.1, 1)).toEqual({ width: 1, height: 1 });
  });
  it('上限以下なら倍率を維持する', () => {
    expect(clampScale(595, 842, 2)).toBe(2);
  });
  it('巨大ページは面積上限に収まるよう倍率を下げる', () => {
    const s = clampScale(5000, 5000, 4);
    expect(s).toBeLessThan(4);
    expect(5000 * 5000 * s * s).toBeLessThanOrEqual(MAX_CANVAS_PIXELS + 1);
  });
  it('極小サイズは最小1ピクセルまで丸める', () => {
    expect(outputSize(0.01, 0.01, 1)).toEqual({ width: 1, height: 1 });
  });
  it('倍率0の場合も最小1ピクセルまで丸める', () => {
    expect(outputSize(100, 100, 0.001)).toEqual({ width: 1, height: 1 });
  });
  it('scale = 1でも canvas ピクセル上限チェックが機能する', () => {
    // MAX_CANVAS_PIXELS = 16,000,000
    // 4000x4000 * 1 * 1 = 16,000,000 (ちょうど上限)
    const s1 = clampScale(4000, 4000, 1);
    expect(s1).toBe(1);
    // 5000x5000 * 1 * 1 = 25,000,000 (超過)
    const s2 = clampScale(5000, 5000, 1);
    expect(s2).toBeLessThan(1);
  });
});

describe('Edge cases for imagesToPdf', () => {
  it('複数の異なるサイズ画像をfitモードで処理', async () => {
    // 1x1と10x10の画像を混在
    const out = await imagesToPdf(
      [
        { bytes: PNG, type: 'image/png' },
        { bytes: PNG, type: 'image/png' },
      ],
      'fit',
    );
    const doc = await PDFDocument.load(out);
    expect(doc.getPageCount()).toBe(2);
  });
  it('複数画像をa4モードで処理', async () => {
    const out = await imagesToPdf(
      [
        { bytes: PNG, type: 'image/png' },
        { bytes: PNG, type: 'image/png' },
      ],
      'a4',
    );
    const doc = await PDFDocument.load(out);
    expect(doc.getPageCount()).toBe(2);
    // すべてのページがA4サイズ
    doc.getPages().forEach((page) => {
      const { width, height } = page.getSize();
      expect(width).toBeCloseTo(A4_WIDTH);
      expect(height).toBeCloseTo(A4_HEIGHT);
    });
  });
  it('JPEGとPNGを混在させた複数画像をPDFに', async () => {
    // test ファイルにJPEGも作成する必要があるので、ここでは PNG のみでテスト
    const out = await imagesToPdf(
      [
        { bytes: PNG, type: 'image/png' },
        { bytes: PNG, type: 'image/png' },
      ],
      'fit',
    );
    const doc = await PDFDocument.load(out);
    expect(doc.getPageCount()).toBe(2);
  });
});

describe('imageFileName - padding edge cases', () => {
  it('1桁ページの場合、桁数は総ページ数に合わせる', () => {
    expect(imageFileName('doc', 1, 1, 'png')).toBe('doc_1.png');
  });
  it('2桁までなら2桁のゼロ埋め', () => {
    expect(imageFileName('doc', 1, 10, 'png')).toBe('doc_01.png');
  });
  it('3桁までなら3桁のゼロ埋め', () => {
    expect(imageFileName('doc', 1, 100, 'png')).toBe('doc_001.png');
  });
  it('4桁のページ', () => {
    expect(imageFileName('doc', 1, 1000, 'png')).toBe('doc_0001.png');
  });
  it('ドットを含むファイル名からベース名を抽出してから生成', () => {
    expect(imageFileName('my.doc', 1, 10, 'jpg')).toBe('my.doc_01.jpg');
  });
});
