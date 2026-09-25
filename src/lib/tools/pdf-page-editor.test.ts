import { degrees, PDFDocument } from 'pdf-lib';
import { describe, expect, it } from 'vitest';
import {
  addRotation,
  buildEditedPdf,
  editedFileName,
  initialPages,
  moveItem,
} from './pdf-page-editor';

async function makePdf(sizes: [number, number][]): Promise<Uint8Array> {
  const doc = await PDFDocument.create();
  sizes.forEach((s) => doc.addPage(s));
  return doc.save();
}

describe('addRotation', () => {
  it('90度単位で加算し 0〜270 に正規化する', () => {
    expect(addRotation(0, 90)).toBe(90);
    expect(addRotation(270, 90)).toBe(0);
    expect(addRotation(0, -90)).toBe(270);
    expect(addRotation(180, 180)).toBe(0);
  });
});

describe('moveItem', () => {
  it('隣と入れ替える', () => {
    expect(moveItem([1, 2, 3], 0, 1)).toEqual([2, 1, 3]);
    expect(moveItem([1, 2, 3], 2, -1)).toEqual([1, 3, 2]);
  });
  it('範囲外なら変更しない', () => {
    const a = [1, 2, 3];
    expect(moveItem(a, 0, -1)).toBe(a);
    expect(moveItem(a, 2, 1)).toBe(a);
  });
});

describe('initialPages', () => {
  it('全ページを元の順序で返す', () => {
    expect(initialPages(3)).toEqual([
      { index: 0, rotation: 0 },
      { index: 1, rotation: 0 },
      { index: 2, rotation: 0 },
    ]);
  });
});

describe('buildEditedPdf', () => {
  it('削除・並び替え・回転を反映する', async () => {
    const bytes = await makePdf([
      [100, 100],
      [200, 200],
      [300, 300],
    ]);
    const out = await buildEditedPdf(bytes, [
      { index: 2, rotation: 90 },
      { index: 0, rotation: 0 },
    ]);
    const doc = await PDFDocument.load(out);
    expect(doc.getPageCount()).toBe(2);
    expect(doc.getPage(0).getWidth()).toBe(300);
    expect(doc.getPage(0).getRotation().angle).toBe(90);
    expect(doc.getPage(1).getWidth()).toBe(100);
    expect(doc.getPage(1).getRotation().angle).toBe(0);
  });

  it('既存の回転に加算する', async () => {
    const src = await PDFDocument.create();
    const p = src.addPage([100, 100]);
    p.setRotation(degrees(90));
    const out = await buildEditedPdf(await src.save(), [
      { index: 0, rotation: 270 },
    ]);
    expect((await PDFDocument.load(out)).getPage(0).getRotation().angle).toBe(
      0,
    );
  });

  it('ページが空ならエラー', async () => {
    const bytes = await makePdf([[100, 100]]);
    await expect(buildEditedPdf(bytes, [])).rejects.toMatchObject({
      code: 'emptyRange',
    });
  });

  it('範囲外のページ添字はエラー', async () => {
    const bytes = await makePdf([[100, 100]]);
    await expect(
      buildEditedPdf(bytes, [{ index: 5, rotation: 0 }]),
    ).rejects.toMatchObject({ code: 'outOfRange' });
  });

  it('壊れたPDFはエラー', async () => {
    await expect(
      buildEditedPdf(new TextEncoder().encode('nope'), [
        { index: 0, rotation: 0 },
      ]),
    ).rejects.toMatchObject({ code: 'invalid' });
  });

  it('暗号化PDFはencryptedエラーを返す', async () => {
    const doc = await PDFDocument.create();
    doc.addPage();
    // pdf-libで暗号化フラグを付ける
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
      buildEditedPdf(await doc.save(), [{ index: 0, rotation: 0 }]),
    ).rejects.toMatchObject({ code: 'encrypted' });
  });
});

describe('editedFileName', () => {
  it('_edited を付ける', () => {
    expect(editedFileName('doc.pdf')).toBe('doc_edited.pdf');
    expect(editedFileName('.pdf')).toBe('document_edited.pdf');
  });
});
