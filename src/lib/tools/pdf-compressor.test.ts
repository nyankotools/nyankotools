import { PDFDocument } from 'pdf-lib';
import { describe, expect, it } from 'vitest';
import { ImageToPdfError } from './pdf-image-converter';
import {
  COMPRESS_PRESETS,
  compressedFileName,
  rasterPagesToPdf,
  reductionPercent,
} from './pdf-compressor';

// 1x1 の JPEG
const JPEG = Uint8Array.from(
  atob(
    '/9j/4AAQSkZJRgABAQEASABIAAD/2wBDAP//////////////////////////////////////////////////////////////////////////////////////wgALCAABAAEBAREA/8QAFBABAAAAAAAAAAAAAAAAAAAAAP/aAAgBAQABPxA=',
  ),
  (c) => c.charCodeAt(0),
);

describe('rasterPagesToPdf', () => {
  it('元ページのサイズ（pt）でページが作られる', async () => {
    const out = await rasterPagesToPdf([
      { bytes: JPEG, widthPt: 200, heightPt: 300 },
      { bytes: JPEG, widthPt: 595.28, heightPt: 841.89 },
    ]);
    const doc = await PDFDocument.load(out);
    expect(doc.getPageCount()).toBe(2);
    expect(doc.getPage(0).getSize()).toEqual({ width: 200, height: 300 });
    expect(doc.getPage(1).getSize().width).toBeCloseTo(595.28);
  });
  it('ページが空なら noImage', async () => {
    await expect(rasterPagesToPdf([])).rejects.toMatchObject({
      code: 'noImage',
    });
  });
  it('JPEGでないデータは badImage', async () => {
    const err = await rasterPagesToPdf([
      { bytes: new Uint8Array([1, 2, 3]), widthPt: 10, heightPt: 10 },
    ]).catch((e) => e);
    expect(err).toBeInstanceOf(ImageToPdfError);
    expect(err.code).toBe('badImage');
  });
});

describe('reductionPercent', () => {
  it('小さくなれば正の値', () => {
    expect(reductionPercent(1000, 250)).toBe(75);
  });
  it('大きくなれば負の値', () => {
    expect(reductionPercent(1000, 1500)).toBe(-50);
  });
  it('元サイズ0なら0', () => {
    expect(reductionPercent(0, 10)).toBe(0);
  });
});

describe('compressedFileName', () => {
  it('拡張子を置き換えて _compressed を付ける', () => {
    expect(compressedFileName('doc.pdf')).toBe('doc_compressed.pdf');
    expect(compressedFileName('Report.PDF')).toBe('Report_compressed.pdf');
    expect(compressedFileName('.pdf')).toBe('document_compressed.pdf');
  });
});

describe('COMPRESS_PRESETS', () => {
  it('圧縮が強いほど解像度と品質が下がる', () => {
    expect(COMPRESS_PRESETS.high.scale).toBeGreaterThan(
      COMPRESS_PRESETS.low.scale,
    );
    expect(COMPRESS_PRESETS.high.quality).toBeGreaterThan(
      COMPRESS_PRESETS.low.quality,
    );
  });
});
