import {
  decodePDFRawStream,
  degrees,
  PDFArray,
  PDFDocument,
  PDFName,
  PDFNumber,
  PDFRawStream,
} from 'pdf-lib';
import { describe, expect, it } from 'vitest';
import {
  computeLayout,
  effectiveBox,
  fitInCell,
  nupFileName,
  nupPdf,
  resolveOrientation,
  sheetCount,
  type NupOptions,
} from './pdf-nup';

const base: NupOptions = {
  perSheet: 4,
  sheetSize: 'a4',
  orientation: 'auto',
  order: 'row',
  margin: 20,
  gap: 10,
  border: false,
};

async function makePdf(
  count: number,
  rotations: number[] = [],
): Promise<Uint8Array> {
  const doc = await PDFDocument.create();
  for (let i = 0; i < count; i++) {
    const p = doc.addPage([200, 300]);
    p.drawRectangle({ x: 10, y: 10, width: 100, height: 50 });
    if (rotations[i]) p.setRotation(degrees(rotations[i]));
  }
  return doc.save();
}

async function contentOf(bytes: Uint8Array, index: number): Promise<string> {
  const doc = await PDFDocument.load(bytes);
  const contents = doc.getPage(index).node.Contents();
  const streams = contents
    ? 'asArray' in contents
      ? (contents as unknown as { asArray(): unknown[] }).asArray()
      : [contents]
    : [];
  return streams
    .map((s) => {
      const obj = doc.context.lookup(s as never) as PDFRawStream;
      return Buffer.from(decodePDFRawStream(obj).decode()).toString('latin1');
    })
    .join('\n');
}

describe('resolveOrientation', () => {
  it('auto は横並びの配置なら横向き', () => {
    expect(resolveOrientation(2, 'auto')).toBe('landscape');
    expect(resolveOrientation(4, 'auto')).toBe('portrait');
    expect(resolveOrientation(9, 'auto')).toBe('portrait');
    expect(resolveOrientation(2, 'portrait')).toBe('portrait');
    expect(resolveOrientation(4, 'landscape')).toBe('landscape');
  });
});

describe('computeLayout', () => {
  it('2in1 は横向きで2列1行', () => {
    const l = computeLayout({ ...base, perSheet: 2 });
    expect(l.sheetWidth).toBeCloseTo(841.89);
    expect(l.sheetHeight).toBeCloseTo(595.28);
    expect([l.cols, l.rows]).toEqual([2, 1]);
    expect(l.cells).toHaveLength(2);
    expect(l.cells[0].x).toBeLessThan(l.cells[1].x);
    expect(l.cells[0].y).toBeCloseTo(l.cells[1].y);
  });

  it('縦向きの2in1は1列2行で、1ページ目が上', () => {
    const l = computeLayout({ ...base, perSheet: 2, orientation: 'portrait' });
    expect([l.cols, l.rows]).toEqual([1, 2]);
    expect(l.cells[0].y).toBeGreaterThan(l.cells[1].y);
  });

  it('4in1 の row / column の並び順', () => {
    const row = computeLayout(base).cells;
    expect(row[1].x).toBeGreaterThan(row[0].x);
    expect(row[1].y).toBeCloseTo(row[0].y);
    const col = computeLayout({ ...base, order: 'column' }).cells;
    expect(col[1].x).toBeCloseTo(col[0].x);
    expect(col[1].y).toBeLessThan(col[0].y);
    expect(col[2].x).toBeGreaterThan(col[0].x);
  });

  it('セルは余白・間隔を除いて均等で、用紙内に収まる', () => {
    for (const perSheet of [2, 4, 6, 8, 9] as const) {
      const l = computeLayout({ ...base, perSheet });
      expect(l.cells).toHaveLength(perSheet);
      for (const c of l.cells) {
        expect(c.x).toBeGreaterThanOrEqual(20 - 1e-9);
        expect(c.y).toBeGreaterThanOrEqual(20 - 1e-9);
        expect(c.x + c.width).toBeLessThanOrEqual(l.sheetWidth - 20 + 1e-9);
        expect(c.y + c.height).toBeLessThanOrEqual(l.sheetHeight - 20 + 1e-9);
      }
    }
  });

  it('不正な設定は badOption', () => {
    for (const bad of [
      { margin: -1 },
      { gap: 101 },
      { margin: NaN },
      { perSheet: 3 as never },
      { sheetSize: 'a0' as never },
      { order: 'x' as never },
      { orientation: 'x' as never },
    ]) {
      expect(() => computeLayout({ ...base, ...bad })).toThrowError(
        expect.objectContaining({ code: 'badOption' }),
      );
    }
  });
});

describe('fitInCell / sheetCount', () => {
  it('縦横比を保ってセル中央に収める', () => {
    const f = fitInCell({ x: 0, y: 0, width: 200, height: 100 }, 100, 100);
    expect(f.scale).toBeCloseTo(1);
    expect(f.width).toBeCloseTo(100);
    expect(f.x).toBeCloseTo(50);
  });
  it('用紙枚数は切り上げ', () => {
    expect(sheetCount(5, 4)).toBe(2);
    expect(sheetCount(8, 4)).toBe(2);
    expect(sheetCount(1, 9)).toBe(1);
  });
});

describe('nupPdf', () => {
  it('5ページを4in1にすると2枚になり、用紙サイズが A4', async () => {
    const out = await nupPdf(await makePdf(5), base);
    const doc = await PDFDocument.load(out);
    expect(doc.getPageCount()).toBe(2);
    expect(doc.getPage(0).getWidth()).toBeCloseTo(595.28);
    expect((await contentOf(out, 0)).match(/ Do/g)?.length).toBe(4);
    expect((await contentOf(out, 1)).match(/ Do/g)?.length).toBe(1);
  });

  it('2in1 は横向きの用紙になる', async () => {
    const out = await nupPdf(await makePdf(2), { ...base, perSheet: 2 });
    const doc = await PDFDocument.load(out);
    expect(doc.getPageCount()).toBe(1);
    expect(doc.getPage(0).getWidth()).toBeGreaterThan(
      doc.getPage(0).getHeight(),
    );
  });

  it('枠線の有無が反映される', async () => {
    const without = await contentOf(await nupPdf(await makePdf(2), base), 0);
    const withBorder = await contentOf(
      await nupPdf(await makePdf(2), { ...base, border: true }),
      0,
    );
    expect(without).not.toMatch(/\nS\n/);
    expect(withBorder.match(/\nS\n/g)?.length).toBe(2);
  });

  it('回転済みページでも例外なく処理できる', async () => {
    const out = await nupPdf(await makePdf(4, [0, 90, 180, 270]), {
      ...base,
      border: true,
    });
    const doc = await PDFDocument.load(out);
    expect(doc.getPageCount()).toBe(1);
    expect((await contentOf(out, 0)).match(/ Do/g)?.length).toBe(4);
  });

  it('白紙ページ（内容なし）が混ざっていても処理できる', async () => {
    const doc = await PDFDocument.create();
    doc.addPage([200, 300]);
    const filled = doc.addPage([200, 300]);
    filled.drawRectangle({ x: 1, y: 1, width: 10, height: 10 });
    const out = await nupPdf(await doc.save(), { ...base, border: true });
    const result = await PDFDocument.load(out);
    expect(result.getPageCount()).toBe(1);
    const content = await contentOf(out, 0);
    expect(content.match(/ Do/g)?.length).toBe(1);
    expect(content.match(/\nS\n/g)?.length).toBe(2);
  });

  it('CropBox 付きPDFは CropBox の範囲で埋め込まれる', async () => {
    const doc = await PDFDocument.create();
    const p = doc.addPage([200, 300]);
    p.drawRectangle({ x: 10, y: 10, width: 100, height: 50 });
    p.setCropBox(20, 30, 100, 150);
    const bytes = await doc.save();
    const out = await nupPdf(bytes, { ...base, perSheet: 2 });
    const result = await PDFDocument.load(out);
    expect(result.getPageCount()).toBe(1);
    // 埋め込まれたフォームの BBox が CropBox と一致する
    const forms = result.context
      .enumerateIndirectObjects()
      .map(([, o]) => o)
      .filter((o) => 'dict' in o)
      .map((o) => (o as unknown as { dict: { get(k: unknown): unknown } }).dict)
      .filter((d) => String(d.get(PDFName.of('Subtype'))) === '/Form');
    expect(forms).toHaveLength(1);
    const bbox = (forms[0].get(PDFName.of('BBox')) as PDFArray)
      .asArray()
      .map((n) => (n as PDFNumber).asNumber());
    expect(bbox).toEqual([20, 30, 120, 180]);
  });

  it('CropBox が MediaBox からはみ出すと交差に丸める', () => {
    const media = { x: 0, y: 0, width: 200, height: 300 };
    expect(
      effectiveBox({ x: -50, y: 100, width: 150, height: 500 }, media),
    ).toEqual({ x: 0, y: 100, width: 100, height: 200 });
    // 交差が空なら MediaBox
    expect(
      effectiveBox({ x: 500, y: 500, width: 10, height: 10 }, media),
    ).toEqual(media);
    expect(effectiveBox(media, media)).toEqual(media);
  });

  it('白紙ページも CropBox の寸法で枠線が描かれ、回転しても寸法が入れ替わる', async () => {
    const doc = await PDFDocument.create();
    const p = doc.addPage([200, 300]);
    p.setCropBox(0, 0, 100, 50);
    p.setRotation(degrees(90));
    const out = await nupPdf(await doc.save(), { ...base, border: true });
    const content = await contentOf(out, 0);
    // 枠は「0 0 m → 0 h l → w h l」の順で描かれる
    const m = content.match(/0 0 m\n0 ([\d.]+) l\n([\d.]+) ([\d.]+) l/);
    expect(m).not.toBeNull();
    // 90度回転した 100x50 は 50x100 の見た目 → 縦長の枠（MediaBox 基準なら 200x300 で縦横比が違う）
    const h = Number(m![1]);
    const w = Number(m![2]);
    expect(h / w).toBeCloseTo(2, 3);
  });

  it('1ページのPDFでも動く', async () => {
    const doc = await PDFDocument.load(
      await nupPdf(await makePdf(1), { ...base, perSheet: 9 }),
    );
    expect(doc.getPageCount()).toBe(1);
  });

  it('不正な設定・壊れたPDF・暗号化PDFはエラー', async () => {
    await expect(
      nupPdf(await makePdf(1), { ...base, gap: -5 }),
    ).rejects.toMatchObject({ code: 'badOption' });
    await expect(
      nupPdf(new TextEncoder().encode('nope'), base),
    ).rejects.toMatchObject({ code: 'invalid' });
    const doc = await PDFDocument.create();
    doc.addPage();
    doc.context.trailerInfo.Encrypt = doc.context.register(
      doc.context.obj({
        Filter: 'Standard',
        V: 1,
        R: 2,
        O: '(x)',
        U: '(x)',
        P: -4,
      }),
    );
    await expect(nupPdf(await doc.save(), base)).rejects.toMatchObject({
      code: 'encrypted',
    });
  });
});

describe('nupFileName', () => {
  it('_nup を付ける', () => {
    expect(nupFileName('doc.pdf')).toBe('doc_nup.pdf');
    expect(nupFileName('.pdf')).toBe('document_nup.pdf');
  });
});
