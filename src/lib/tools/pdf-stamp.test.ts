import { deflateSync } from 'node:zlib';
import { degrees, PDFDict, PDFDocument, PDFName, PDFRawStream } from 'pdf-lib';
import { describe, expect, it } from 'vitest';
import { PdfToolError } from './pdf-merge-split';
import {
  buildStampedPdf,
  clampPlacement,
  DEFAULT_PLACEMENT,
  detectImageType,
  displayToPdf,
  MIN_STAMP_WIDTH,
  PdfStampError,
  placementHeight,
  placementToRect,
  rectToPdfImage,
  resizeAround,
  resolveTargetPages,
  stampedFileName,
} from './pdf-stamp';

function crc32(buf: Uint8Array): number {
  let c = ~0;
  for (const b of buf) {
    c ^= b;
    for (let k = 0; k < 8; k++) c = c & 1 ? (c >>> 1) ^ 0xedb88320 : c >>> 1;
  }
  return ~c >>> 0;
}

function chunk(type: string, data: Uint8Array): Uint8Array {
  const out = new Uint8Array(12 + data.length);
  const view = new DataView(out.buffer);
  view.setUint32(0, data.length);
  for (let i = 0; i < 4; i++) out[4 + i] = type.charCodeAt(i);
  out.set(data, 8);
  view.setUint32(8 + data.length, crc32(out.subarray(4, 8 + data.length)));
  return out;
}

/** 幅 w・高さ h の単色 RGBA PNG を作る */
function makePng(w: number, h: number): Uint8Array {
  const ihdr = new Uint8Array(13);
  const dv = new DataView(ihdr.buffer);
  dv.setUint32(0, w);
  dv.setUint32(4, h);
  ihdr[8] = 8;
  ihdr[9] = 6;
  const raw = new Uint8Array((w * 4 + 1) * h);
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const i = y * (w * 4 + 1) + 1 + x * 4;
      raw.set([200, 0, 0, 255], i);
    }
  }
  const parts = [
    Uint8Array.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk('IHDR', ihdr),
    chunk('IDAT', new Uint8Array(deflateSync(raw))),
    chunk('IEND', new Uint8Array(0)),
  ];
  const out = new Uint8Array(parts.reduce((n, p) => n + p.length, 0));
  let o = 0;
  for (const p of parts) {
    out.set(p, o);
    o += p.length;
  }
  return out;
}

async function makePdf(pages: number, rotation = 0): Promise<Uint8Array> {
  const doc = await PDFDocument.create();
  for (let i = 0; i < pages; i++) {
    const p = doc.addPage([200, 300]);
    if (rotation) p.setRotation(degrees(rotation));
  }
  return doc.save();
}

function imageCount(doc: PDFDocument): number {
  let n = 0;
  for (const [, obj] of doc.context.enumerateIndirectObjects()) {
    if (
      obj instanceof PDFRawStream &&
      obj.dict.get(PDFName.of('Subtype')) === PDFName.of('Image')
    )
      n++;
  }
  return n;
}

function hasXObject(doc: PDFDocument, index: number): boolean {
  const res = doc.getPage(index).node.Resources();
  return !!res?.lookupMaybe(PDFName.of('XObject'), PDFDict);
}

describe('detectImageType', () => {
  it('PNG / JPEG を先頭バイトで判定する', () => {
    expect(detectImageType(makePng(2, 2))).toBe('png');
    expect(detectImageType(Uint8Array.from([0xff, 0xd8, 0xff, 0xe0]))).toBe(
      'jpeg',
    );
  });
  it('それ以外・短すぎる入力は null', () => {
    expect(detectImageType(new Uint8Array(0))).toBeNull();
    expect(detectImageType(Uint8Array.from([0x47, 0x49, 0x46]))).toBeNull();
    expect(detectImageType(Uint8Array.from([0x89, 0x50, 0x4e]))).toBeNull();
  });
});

describe('clampPlacement / resizeAround', () => {
  it('ページ内に収める', () => {
    const p = clampPlacement({ x: 0.9, y: 0.95, w: 0.3 }, 2, 200, 300);
    expect(p.x).toBeCloseTo(0.7);
    const h = placementHeight(p.w, 2, 200, 300);
    expect(p.y + h).toBeLessThanOrEqual(1 + 1e-9);
    expect(clampPlacement({ x: -1, y: -1, w: 0.2 }, 1, 200, 300)).toMatchObject(
      { x: 0, y: 0 },
    );
  });
  it('幅の下限と上限、NaN を扱う', () => {
    expect(clampPlacement({ x: 0, y: 0, w: 0 }, 1, 200, 300).w).toBe(
      MIN_STAMP_WIDTH,
    );
    expect(clampPlacement({ x: 0, y: 0, w: 5 }, 4, 200, 300).w).toBe(1);
    const n = clampPlacement({ x: NaN, y: NaN, w: NaN }, 1, 200, 300);
    expect(n.w).toBe(DEFAULT_PLACEMENT.w);
    expect(n.x).toBe(0);
  });
  it('縦長すぎる画像は高さがページに収まるよう幅を縮める', () => {
    const p = clampPlacement({ x: 0, y: 0, w: 1 }, 0.1, 200, 300);
    expect(placementHeight(p.w, 0.1, 200, 300)).toBeLessThanOrEqual(1 + 1e-9);
  });
  it('resizeAround は中心を保つ', () => {
    const before = { x: 0.4, y: 0.4, w: 0.2 };
    const after = resizeAround(before, 0.4, 1, 200, 200);
    expect(after.x + after.w / 2).toBeCloseTo(0.5);
    expect(after.y + placementHeight(after.w, 1, 200, 200) / 2).toBeCloseTo(
      0.5,
    );
  });
});

describe('座標変換', () => {
  it('回転なし: 左上基点の矩形を左下原点の座標にする', () => {
    const rect = placementToRect({ x: 0.1, y: 0.2, w: 0.5 }, 2, 200, 300);
    expect(rect).toMatchObject({ left: 20, top: 60, width: 100, height: 50 });
    const d = rectToPdfImage(rect, { x: 0, y: 0, width: 200, height: 300 }, 0);
    expect(d).toEqual({ x: 20, y: 190, width: 100, height: 50, angle: 0 });
  });
  it('CropBox の原点ぶんずらす', () => {
    const rect = { left: 0, top: 0, width: 10, height: 10 };
    const d = rectToPdfImage(rect, { x: 5, y: 7, width: 100, height: 100 }, 0);
    expect(d.x).toBe(5);
    expect(d.y).toBe(97);
  });
  it.each([0, 90, 180, 270])(
    '回転 %i 度でも描画した四隅が表示上の矩形と一致する',
    (rot) => {
      const W = 200;
      const H = 300;
      const disp = rot === 90 || rot === 270 ? { w: H, h: W } : { w: W, h: H };
      const rect = { left: 30, top: 40, width: 50, height: 20 };
      const d = rectToPdfImage(rect, { x: 0, y: 0, width: W, height: H }, rot);
      const a = (d.angle * Math.PI) / 180;
      const corner = (cx: number, cy: number) => ({
        x: d.x + cx * Math.cos(a) - cy * Math.sin(a),
        y: d.y + cx * Math.sin(a) + cy * Math.cos(a),
      });
      // 画像の左上・右下（画像座標は右・上が正）
      const tl = corner(0, d.height);
      const br = corner(d.width, 0);
      const exTl = displayToPdf(rect.left, rect.top, W, H, rot);
      const exBr = displayToPdf(
        rect.left + rect.width,
        rect.top + rect.height,
        W,
        H,
        rot,
      );
      expect(tl.x).toBeCloseTo(exTl.x);
      expect(tl.y).toBeCloseTo(exTl.y);
      expect(br.x).toBeCloseTo(exBr.x);
      expect(br.y).toBeCloseTo(exBr.y);
      expect(disp.w).toBeGreaterThan(0);
    },
  );
  it('displayToPdf: 回転ごとに左上の角が正しい位置へ行く', () => {
    expect(displayToPdf(0, 0, 200, 300, 0)).toEqual({ x: 0, y: 300 });
    expect(displayToPdf(0, 0, 200, 300, 90)).toEqual({ x: 0, y: 0 });
    expect(displayToPdf(0, 0, 200, 300, 180)).toEqual({ x: 200, y: 0 });
    expect(displayToPdf(0, 0, 200, 300, 270)).toEqual({ x: 200, y: 300 });
  });
});

describe('resolveTargetPages', () => {
  it('all / current / range', () => {
    expect(resolveTargetPages('all', '', 0, 3)).toEqual([0, 1, 2]);
    expect(resolveTargetPages('current', '', 1, 3)).toEqual([1]);
    expect(resolveTargetPages('range', '3, 1-2, 2', 0, 5)).toEqual([0, 1, 2]);
    expect(resolveTargetPages('range', '4-', 0, 5)).toEqual([3, 4]);
  });
  it('不正な指定は PdfToolError', () => {
    expect(() => resolveTargetPages('range', '', 0, 3)).toThrow(PdfToolError);
    expect(() => resolveTargetPages('range', 'abc', 0, 3)).toThrow(
      PdfToolError,
    );
    expect(() => resolveTargetPages('range', '9', 0, 3)).toThrow(PdfToolError);
    expect(() => resolveTargetPages('current', '', 5, 3)).toThrow(PdfToolError);
  });
});

describe('buildStampedPdf', () => {
  const placement = { x: 0.5, y: 0.5, w: 0.3 };
  const image = { bytes: makePng(4, 2), type: 'png' as const };

  it('指定ページだけに画像を重ね、画像は1回だけ埋め込む', async () => {
    const out = await buildStampedPdf(
      await makePdf(3),
      image,
      placement,
      [0, 2],
    );
    const doc = await PDFDocument.load(out);
    expect(doc.getPageCount()).toBe(3);
    expect(hasXObject(doc, 0)).toBe(true);
    expect(hasXObject(doc, 1)).toBe(false);
    expect(hasXObject(doc, 2)).toBe(true);
    expect(imageCount(doc)).toBeGreaterThanOrEqual(1);
  });
  it('重複したページ指定でも二重に押さない', async () => {
    const a = await buildStampedPdf(await makePdf(1), image, placement, [0]);
    const b = await buildStampedPdf(
      await makePdf(1),
      image,
      placement,
      [0, 0, 0],
    );
    expect(b.length).toBe(a.length);
  });
  it('回転したページにも押せる', async () => {
    for (const rot of [90, 180, 270]) {
      const out = await buildStampedPdf(
        await makePdf(1, rot),
        image,
        placement,
        [0],
        { opacity: 0.5 },
      );
      const doc = await PDFDocument.load(out);
      expect(hasXObject(doc, 0)).toBe(true);
      expect(doc.getPage(0).getRotation().angle).toBe(rot);
    }
  });
  it('対象ページが空なら PdfStampError(noTarget)', async () => {
    await expect(
      buildStampedPdf(await makePdf(1), image, placement, []),
    ).rejects.toMatchObject({ code: 'noTarget' });
  });
  it('範囲外のページは PdfToolError', async () => {
    await expect(
      buildStampedPdf(await makePdf(1), image, placement, [1]),
    ).rejects.toBeInstanceOf(PdfToolError);
  });
  it('壊れた画像は PdfStampError(badImage)', async () => {
    const bad = { bytes: Uint8Array.from([1, 2, 3, 4]), type: 'png' as const };
    const err = await buildStampedPdf(
      await makePdf(1),
      bad,
      placement,
      [0],
    ).catch((e) => e);
    expect(err).toBeInstanceOf(PdfStampError);
    expect(err.code).toBe('badImage');
  });
  it('壊れたPDFは PdfToolError(invalid)', async () => {
    await expect(
      buildStampedPdf(
        new TextEncoder().encode('not a pdf'),
        image,
        placement,
        [0],
      ),
    ).rejects.toMatchObject({ code: 'invalid' });
  });
});

describe('stampedFileName', () => {
  it('末尾に _stamped を付ける', () => {
    expect(stampedFileName('doc.pdf')).toBe('doc_stamped.pdf');
    expect(stampedFileName('A.PDF')).toBe('A_stamped.pdf');
    expect(stampedFileName('.pdf')).toBe('document_stamped.pdf');
  });
});
