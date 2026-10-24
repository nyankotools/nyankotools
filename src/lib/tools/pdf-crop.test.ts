import { degrees, PDFDocument } from 'pdf-lib';
import { describe, expect, it } from 'vitest';
import {
  boundsToMargins,
  buildCroppedPdf,
  clampMargins,
  commonMargins,
  croppedFileName,
  detectContentBounds,
  displaySize,
  hasAnyCrop,
  isZeroMargins,
  marginsToCropBox,
  marginsToRect,
  mmToPt,
  normalizeRotation,
  ptToMm,
  rectToMargins,
  ZERO_MARGINS,
} from './pdf-crop';
import { PdfToolError } from './pdf-merge-split';

const m = (top: number, right: number, bottom: number, left: number) => ({
  top,
  right,
  bottom,
  left,
});

describe('単位・回転', () => {
  it('mm と pt を相互変換する', () => {
    expect(mmToPt(25.4)).toBeCloseTo(72);
    expect(ptToMm(72)).toBeCloseTo(25.4);
  });
  it('回転角を正規化する', () => {
    expect(normalizeRotation(0)).toBe(0);
    expect(normalizeRotation(450)).toBe(90);
    expect(normalizeRotation(-90)).toBe(270);
    expect(normalizeRotation(360)).toBe(0);
  });
  it('90/270度では幅と高さを入れ替える', () => {
    expect(displaySize(200, 300, 0)).toEqual({ width: 200, height: 300 });
    expect(displaySize(200, 300, 90)).toEqual({ width: 300, height: 200 });
    expect(displaySize(200, 300, 180)).toEqual({ width: 200, height: 300 });
  });
});

describe('clampMargins', () => {
  it('負数・NaN は 0 にする', () => {
    expect(clampMargins(m(-5, NaN, 3, Infinity), 200, 300)).toEqual(
      m(0, 0, 3, 0),
    );
  });
  it('範囲内ならそのまま', () => {
    expect(clampMargins(m(10, 20, 30, 40), 200, 300)).toEqual(
      m(10, 20, 30, 40),
    );
  });
  it('左右の合計がページ幅を超えたら最低幅を残して比例縮小する', () => {
    const c = clampMargins(m(0, 150, 0, 150), 200, 300);
    expect(c.left + c.right).toBeCloseTo(190);
    expect(c.left).toBeCloseTo(c.right);
  });
  it('上下も同様に縮める', () => {
    const c = clampMargins(m(400, 0, 100, 0), 200, 300);
    expect(c.top + c.bottom).toBeCloseTo(290);
    expect(c.top / c.bottom).toBeCloseTo(4);
  });
});

describe('isZeroMargins / hasAnyCrop', () => {
  it('判定する', () => {
    expect(isZeroMargins(ZERO_MARGINS)).toBe(true);
    expect(isZeroMargins(m(0, 0, 1, 0))).toBe(false);
    expect(hasAnyCrop([ZERO_MARGINS, ZERO_MARGINS])).toBe(false);
    expect(hasAnyCrop([ZERO_MARGINS, m(1, 0, 0, 0)])).toBe(true);
    expect(hasAnyCrop([])).toBe(false);
  });
});

describe('rectToMargins / marginsToRect', () => {
  it('正規化矩形を切り落とし量にする', () => {
    const r = rectToMargins({ x: 0.1, y: 0.2, w: 0.5, h: 0.4 }, 200, 300);
    expect(r.left).toBeCloseTo(20);
    expect(r.top).toBeCloseTo(60);
    expect(r.right).toBeCloseTo(80);
    expect(r.bottom).toBeCloseTo(120);
  });
  it('はみ出した矩形はページ内に収める', () => {
    const r = rectToMargins({ x: -0.5, y: -1, w: 3, h: 5 }, 200, 300);
    expect(r).toEqual(m(0, 0, 0, 0));
  });
  it('往復で元に戻る', () => {
    const rect = marginsToRect(m(30, 20, 60, 10), 200, 300);
    expect(rect.x).toBeCloseTo(0.05);
    expect(rect.y).toBeCloseTo(0.1);
    expect(rect.w).toBeCloseTo(0.85);
    expect(rect.h).toBeCloseTo(0.7);
    const back = rectToMargins(rect, 200, 300);
    expect(back.top).toBeCloseTo(30);
    expect(back.bottom).toBeCloseTo(60);
    expect(back.left).toBeCloseTo(10);
    expect(back.right).toBeCloseTo(20);
  });
});

/** 白地に黒い矩形を描いた RGBA データ */
function makeImage(
  w: number,
  h: number,
  rect?: { x: number; y: number; w: number; h: number },
  value = 0,
): Uint8Array {
  const data = new Uint8Array(w * h * 4).fill(255);
  if (rect) {
    for (let y = rect.y; y < rect.y + rect.h; y++) {
      for (let x = rect.x; x < rect.x + rect.w; x++) {
        const i = (y * w + x) * 4;
        data[i] = data[i + 1] = data[i + 2] = value;
      }
    }
  }
  return data;
}

describe('detectContentBounds', () => {
  it('内容の外接矩形を返す（right / bottom は含まない）', () => {
    const data = makeImage(20, 10, { x: 5, y: 2, w: 8, h: 4 });
    expect(detectContentBounds(data, 20, 10)).toEqual({
      left: 5,
      top: 2,
      right: 13,
      bottom: 6,
    });
  });
  it('全面白なら null', () => {
    expect(detectContentBounds(makeImage(10, 10), 10, 10)).toBeNull();
  });
  it('薄い灰色（しきい値以上）は余白として扱う', () => {
    const data = makeImage(10, 10, { x: 2, y: 2, w: 3, h: 3 }, 250);
    expect(detectContentBounds(data, 10, 10)).toBeNull();
    const dark = makeImage(10, 10, { x: 2, y: 2, w: 3, h: 3 }, 200);
    expect(detectContentBounds(dark, 10, 10)).not.toBeNull();
  });
  it('minCount より少ない孤立ノイズは無視する', () => {
    const data = makeImage(20, 20, { x: 8, y: 8, w: 4, h: 4 });
    // 端に 1 画素のゴミ
    const i = (0 * 20 + 0) * 4;
    data[i] = data[i + 1] = data[i + 2] = 0;
    expect(detectContentBounds(data, 20, 20)).toEqual({
      left: 0,
      top: 0,
      right: 12,
      bottom: 12,
    });
    expect(detectContentBounds(data, 20, 20, { minCount: 2 })).toEqual({
      left: 8,
      top: 8,
      right: 12,
      bottom: 12,
    });
  });
  it('不正なサイズ・データ不足は null', () => {
    expect(detectContentBounds(new Uint8Array(0), 0, 0)).toBeNull();
    expect(detectContentBounds(new Uint8Array(8), 10, 10)).toBeNull();
  });
  it('1画素だけの内容も検出する', () => {
    const data = makeImage(5, 5, { x: 4, y: 4, w: 1, h: 1 });
    expect(detectContentBounds(data, 5, 5)).toEqual({
      left: 4,
      top: 4,
      right: 5,
      bottom: 5,
    });
  });
});

describe('boundsToMargins', () => {
  const bounds = { left: 10, top: 20, right: 90, bottom: 180 };
  it('画素座標をページ上の pt に直す', () => {
    // 画像 100x200 → ページ 200x400（2倍）
    const r = boundsToMargins(bounds, 100, 200, 200, 400);
    expect(r).toEqual(m(40, 20, 40, 20));
  });
  it('padding の分だけ内容の周りを残す', () => {
    const r = boundsToMargins(bounds, 100, 200, 200, 400, 5);
    expect(r).toEqual(m(35, 15, 35, 15));
  });
  it('padding が大きくても負にならない', () => {
    const r = boundsToMargins(bounds, 100, 200, 200, 400, 1000);
    expect(r).toEqual(ZERO_MARGINS);
  });
});

describe('commonMargins', () => {
  it('辺ごとの最小値を返す', () => {
    expect(commonMargins([m(10, 20, 30, 40), m(5, 25, 35, 10)])).toEqual(
      m(5, 20, 30, 10),
    );
  });
  it('空配列は 0', () => {
    expect(commonMargins([])).toEqual(ZERO_MARGINS);
  });
});

describe('marginsToCropBox', () => {
  const box = { x: 0, y: 0, width: 200, height: 300 };
  const mm = m(10, 20, 30, 40); // top right bottom left
  it('回転0度は表示と同じ向き', () => {
    expect(marginsToCropBox(mm, box, 0)).toEqual({
      x: 40,
      y: 30,
      width: 140,
      height: 260,
    });
  });
  it('90度回転: 表示の上は回転前の左', () => {
    // left_u = top(10), top_u = right(20), right_u = bottom(30), bottom_u = left(40)
    expect(marginsToCropBox(mm, box, 90)).toEqual({
      x: 10,
      y: 40,
      width: 160,
      height: 240,
    });
  });
  it('180度回転', () => {
    // left_u = right(20), top_u = bottom(30), right_u = left(40), bottom_u = top(10)
    expect(marginsToCropBox(mm, box, 180)).toEqual({
      x: 20,
      y: 10,
      width: 140,
      height: 260,
    });
  });
  it('270度回転', () => {
    // left_u = bottom(30), top_u = left(40), right_u = top(10), bottom_u = right(20)
    expect(marginsToCropBox(mm, box, 270)).toEqual({
      x: 30,
      y: 20,
      width: 160,
      height: 240,
    });
  });
  it('原点がずれた既存の CropBox にも対応する', () => {
    const r = marginsToCropBox(
      m(10, 0, 0, 5),
      { x: 100, y: 50, width: 200, height: 300 },
      0,
    );
    expect(r).toEqual({ x: 105, y: 50, width: 195, height: 290 });
  });
});

async function makePdf(
  sizes: [number, number][],
  rotations: number[] = [],
): Promise<Uint8Array> {
  const doc = await PDFDocument.create();
  sizes.forEach((s, i) => {
    const page = doc.addPage(s);
    if (rotations[i]) page.setRotation(degrees(rotations[i]));
  });
  return doc.save();
}

describe('buildCroppedPdf', () => {
  it('ページごとに CropBox を設定し、MediaBox は変えない', async () => {
    const src = await makePdf([
      [200, 300],
      [200, 300],
    ]);
    const out = await buildCroppedPdf(src, [m(10, 20, 30, 40), ZERO_MARGINS]);
    const doc = await PDFDocument.load(out);
    expect(doc.getPageCount()).toBe(2);
    const p0 = doc.getPage(0);
    expect(p0.getCropBox()).toEqual({ x: 40, y: 30, width: 140, height: 260 });
    expect(p0.getMediaBox()).toEqual({ x: 0, y: 0, width: 200, height: 300 });
    expect(doc.getPage(1).getCropBox()).toEqual({
      x: 0,
      y: 0,
      width: 200,
      height: 300,
    });
  });
  it('回転ページでは表示の向きで切り抜く', async () => {
    const src = await makePdf([[200, 300]], [90]);
    const out = await buildCroppedPdf(src, [m(10, 0, 0, 0)]);
    const doc = await PDFDocument.load(out);
    // 表示の上 10pt = 回転前の左 10pt
    expect(doc.getPage(0).getCropBox()).toEqual({
      x: 10,
      y: 0,
      width: 190,
      height: 300,
    });
    expect(doc.getPage(0).getRotation().angle).toBe(90);
  });
  it('既存の CropBox の内側をさらに切り抜く', async () => {
    const doc = await PDFDocument.create();
    const page = doc.addPage([200, 300]);
    page.setCropBox(20, 20, 160, 260);
    const src = await doc.save();
    const out = await buildCroppedPdf(src, [m(10, 10, 10, 10)]);
    expect((await PDFDocument.load(out)).getPage(0).getCropBox()).toEqual({
      x: 30,
      y: 30,
      width: 140,
      height: 240,
    });
  });
  it('大きすぎる切り落としは最低サイズを残す', async () => {
    const src = await makePdf([[200, 300]]);
    const out = await buildCroppedPdf(src, [m(0, 500, 0, 500)]);
    const box = (await PDFDocument.load(out)).getPage(0).getCropBox();
    expect(box.width).toBeCloseTo(10);
    expect(box.height).toBe(300);
  });
  it('切り抜きが 1 つもなければ noOperation', async () => {
    const src = await makePdf([[200, 300]]);
    await expect(buildCroppedPdf(src, [ZERO_MARGINS])).rejects.toMatchObject({
      code: 'noOperation',
    });
  });
  it('ページ数が合わなければ outOfRange', async () => {
    const src = await makePdf([[200, 300]]);
    await expect(
      buildCroppedPdf(src, [m(1, 1, 1, 1), m(1, 1, 1, 1)]),
    ).rejects.toMatchObject({ code: 'outOfRange' });
  });
  it('壊れたPDFは invalid の PdfToolError', async () => {
    const bad = new TextEncoder().encode('not a pdf');
    const err = await buildCroppedPdf(bad, [m(1, 1, 1, 1)]).catch((e) => e);
    expect(err).toBeInstanceOf(PdfToolError);
    expect(err.code).toBe('invalid');
  });
});

describe('croppedFileName', () => {
  it('末尾に _cropped を付ける', () => {
    expect(croppedFileName('doc.pdf')).toBe('doc_cropped.pdf');
    expect(croppedFileName('DOC.PDF')).toBe('DOC_cropped.pdf');
    expect(croppedFileName('.pdf')).toBe('document_cropped.pdf');
    expect(croppedFileName('a.b.pdf')).toBe('a.b_cropped.pdf');
  });
});
