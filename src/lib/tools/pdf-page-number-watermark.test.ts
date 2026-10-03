import {
  decodePDFRawStream,
  degrees,
  PDFDocument,
  PDFName,
  PDFRawStream,
} from 'pdf-lib';
import { describe, expect, it } from 'vitest';
import {
  formatPageNumber,
  isPrintableAscii,
  parseHexColor,
  stampedFileName,
  stampPdf,
  watermarkCenters,
  type PageNumberOptions,
  type WatermarkOptions,
} from './pdf-page-number-watermark';

// 1x1 の透過PNG
const PNG = Uint8Array.from(
  atob(
    'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==',
  ),
  (c) => c.charCodeAt(0),
);

async function makePdf(
  count: number,
  rotations: number[] = [],
): Promise<Uint8Array> {
  const doc = await PDFDocument.create();
  for (let i = 0; i < count; i++) {
    const p = doc.addPage([200, 300]);
    if (rotations[i]) p.setRotation(degrees(rotations[i]));
  }
  return doc.save();
}

const numberOptions: PageNumberOptions = {
  position: 'bottom-center',
  template: '{n} / {total}',
  startNumber: 1,
  fontSize: 12,
  margin: 24,
  color: { r: 0, g: 0, b: 0 },
  skipFirstPage: false,
};

const watermarkOptions: WatermarkOptions = {
  png: PNG,
  widthRatio: 0.5,
  opacity: 0.3,
  angle: 45,
  tiled: false,
};

/** ページのコンテンツストリームを連結した文字列 */
async function contentOf(bytes: Uint8Array, index: number): Promise<string> {
  const doc = await PDFDocument.load(bytes);
  const page = doc.getPage(index);
  const contents = page.node.Contents();
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

describe('formatPageNumber', () => {
  it('{n} と {total} を置換する', () => {
    expect(formatPageNumber('{n} / {total}', 2, 10)).toBe('2 / 10');
    expect(formatPageNumber('- {n} -', 5, 9)).toBe('- 5 -');
    expect(formatPageNumber('{n}{n}', 3, 9)).toBe('33');
  });
});

describe('isPrintableAscii / parseHexColor', () => {
  it('ASCII判定', () => {
    expect(isPrintableAscii('Page {n}')).toBe(true);
    expect(isPrintableAscii('ページ')).toBe(false);
    expect(isPrintableAscii('a\nb')).toBe(false);
  });
  it('色を変換する', () => {
    expect(parseHexColor('#ff8000')).toEqual({ r: 255, g: 128, b: 0 });
    expect(parseHexColor('red')).toBeNull();
  });
});

describe('watermarkCenters', () => {
  it('敷き詰めなしなら中心の1点', () => {
    expect(watermarkCenters(200, 300, 100, 20, false)).toEqual([
      { x: 100, y: 150 },
    ]);
  });
  it('敷き詰めなら複数点で、ページ内を覆う', () => {
    const c = watermarkCenters(200, 300, 40, 10, true);
    expect(c.length).toBeGreaterThan(10);
    expect(Math.min(...c.map((p) => p.x))).toBeLessThanOrEqual(0);
    expect(Math.max(...c.map((p) => p.x))).toBeGreaterThanOrEqual(200);
  });
});

describe('stampPdf', () => {
  it('ページ数と順序を変えずページ番号を描く', async () => {
    const out = await stampPdf(await makePdf(3), {
      pageNumber: numberOptions,
      watermark: null,
    });
    const doc = await PDFDocument.load(out);
    expect(doc.getPageCount()).toBe(3);
    expect(doc.getPage(0).getWidth()).toBe(200);
    expect(
      doc.getPage(0).node.Resources()?.lookup(PDFName.of('Font')),
    ).toBeDefined();
    // Helvetica の "1 / 3" と "3 / 3"（16進文字列）
    expect(await contentOf(out, 0)).toContain('<31202F2033>');
    expect(await contentOf(out, 2)).toContain('<33202F2033>');
  });

  it('開始番号と最初のページを除く指定を反映する', async () => {
    const out = await stampPdf(await makePdf(3), {
      pageNumber: {
        ...numberOptions,
        template: '{n}',
        startNumber: 5,
        skipFirstPage: true,
      },
      watermark: null,
    });
    expect(await contentOf(out, 0)).not.toContain('Tj');
    expect(await contentOf(out, 1)).toContain('<35>');
    expect(await contentOf(out, 2)).toContain('<36>');
  });

  it('透かし画像を描く（1枚／敷き詰め）', async () => {
    const single = await stampPdf(await makePdf(2), {
      pageNumber: null,
      watermark: watermarkOptions,
    });
    expect((await contentOf(single, 0)).match(/ Do/g)?.length).toBe(1);
    const tiled = await stampPdf(await makePdf(1), {
      pageNumber: null,
      watermark: { ...watermarkOptions, widthRatio: 0.2, tiled: true },
    });
    expect(
      (await contentOf(tiled, 0)).match(/ Do/g)?.length ?? 0,
    ).toBeGreaterThan(5);
  });

  it('回転済みページでも例外なく処理できる', async () => {
    const out = await stampPdf(await makePdf(4, [0, 90, 180, 270]), {
      pageNumber: { ...numberOptions, position: 'top-right' },
      watermark: watermarkOptions,
    });
    const doc = await PDFDocument.load(out);
    expect(doc.getPageCount()).toBe(4);
    expect(doc.getPage(1).getRotation().angle).toBe(90);
  });

  it('何も指定しなければ noOperation', async () => {
    await expect(
      stampPdf(await makePdf(1), { pageNumber: null, watermark: null }),
    ).rejects.toMatchObject({ code: 'noOperation' });
  });

  it('不正な設定はエラー', async () => {
    const bytes = await makePdf(1);
    await expect(
      stampPdf(bytes, {
        pageNumber: { ...numberOptions, template: 'ページ{n}' },
        watermark: null,
      }),
    ).rejects.toMatchObject({ code: 'unsupportedChar' });
    for (const bad of [
      { fontSize: 2 },
      { startNumber: 1.5 },
      { startNumber: -1 },
      { margin: -1 },
      { template: '  ' },
    ]) {
      await expect(
        stampPdf(bytes, {
          pageNumber: { ...numberOptions, ...bad },
          watermark: null,
        }),
      ).rejects.toMatchObject({ code: 'badOption' });
    }
    for (const bad of [
      { opacity: 0 },
      { widthRatio: 2 },
      { angle: 400 },
      { angle: NaN },
      { png: new Uint8Array() },
      { png: new Uint8Array([1, 2, 3]) },
    ]) {
      await expect(
        stampPdf(bytes, {
          pageNumber: null,
          watermark: { ...watermarkOptions, ...bad },
        }),
      ).rejects.toMatchObject({ code: 'badOption' });
    }
  });

  it('壊れたPDF・暗号化PDFはエラー', async () => {
    await expect(
      stampPdf(new TextEncoder().encode('nope'), {
        pageNumber: numberOptions,
        watermark: null,
      }),
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
    await expect(
      stampPdf(await doc.save(), {
        pageNumber: numberOptions,
        watermark: null,
      }),
    ).rejects.toMatchObject({ code: 'encrypted' });
  });

  it('敷き詰めでタイル数が上限を超えるとエラー', async () => {
    // MAX_TILES_PER_PAGE (600) を超える敷き詰め設定
    // widthRatio が極めて小さいと、大量のタイルが配置されてエラー
    await expect(
      stampPdf(await makePdf(1), {
        pageNumber: null,
        watermark: { ...watermarkOptions, widthRatio: 0.01, tiled: true },
      }),
    ).rejects.toMatchObject({ code: 'badOption' });
  });
});

describe('stampedFileName', () => {
  it('_stamped を付ける', () => {
    expect(stampedFileName('doc.pdf')).toBe('doc_stamped.pdf');
    expect(stampedFileName('.pdf')).toBe('document_stamped.pdf');
  });
});
