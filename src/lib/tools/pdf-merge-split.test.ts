import { PDFDocument } from 'pdf-lib';
import { describe, expect, it } from 'vitest';
import {
  extractPages,
  getPageCount,
  mergePdfs,
  parsePageRange,
  PdfToolError,
  splitEveryN,
} from './pdf-merge-split';

async function makePdf(pages: number): Promise<Uint8Array> {
  const doc = await PDFDocument.create();
  for (let i = 0; i < pages; i++) doc.addPage([200 + i, 300]);
  return doc.save();
}

function codeOf(fn: () => unknown): string | undefined {
  try {
    fn();
  } catch (e) {
    return e instanceof PdfToolError ? e.code : 'other';
  }
}

describe('parsePageRange', () => {
  it('単一・範囲・開放範囲を展開する', () => {
    expect(parsePageRange('1-3, 5, 8-', 9)).toEqual([0, 1, 2, 4, 7, 8]);
  });
  it('指定順を保つ', () => {
    expect(parsePageRange('3,1', 5)).toEqual([2, 0]);
  });
  it('全角ダッシュ・読点を許容する', () => {
    expect(parsePageRange('1〜2、4', 5)).toEqual([0, 1, 3]);
  });
  it('エラーコードを返す', () => {
    expect(codeOf(() => parsePageRange('  ', 5))).toBe('emptyRange');
    expect(codeOf(() => parsePageRange('a', 5))).toBe('badRange');
    expect(codeOf(() => parsePageRange('0', 5))).toBe('badRange');
    expect(codeOf(() => parsePageRange('4-2', 5))).toBe('badRange');
    expect(codeOf(() => parsePageRange('6', 5))).toBe('outOfRange');
    expect(codeOf(() => parsePageRange('2-9', 5))).toBe('outOfRange');
  });
});

describe('PDF操作', () => {
  it('結合するとページ数が合計になる', async () => {
    const merged = await mergePdfs([await makePdf(2), await makePdf(3)]);
    expect(await getPageCount(merged)).toBe(5);
  });
  it('ページを抽出する', async () => {
    const out = await extractPages(await makePdf(5), [4, 0]);
    const doc = await PDFDocument.load(out);
    expect(doc.getPageCount()).toBe(2);
    expect(doc.getPage(0).getWidth()).toBe(204);
    expect(doc.getPage(1).getWidth()).toBe(200);
  });
  it('N ページごとに分割する', async () => {
    const parts = await splitEveryN(await makePdf(5), 2);
    const counts = await Promise.all(parts.map(getPageCount));
    expect(counts).toEqual([2, 2, 1]);
  });
  it('不正な分割数はエラー', async () => {
    await expect(splitEveryN(await makePdf(1), 0)).rejects.toMatchObject({
      code: 'badCount',
    });
  });
  it('暗号化PDFはencrypted', async () => {
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
    await expect(getPageCount(await doc.save())).rejects.toMatchObject({
      code: 'encrypted',
    });
  });
  it('PDFでないデータはinvalid', async () => {
    await expect(
      getPageCount(new TextEncoder().encode('hello')),
    ).rejects.toMatchObject({ code: 'invalid' });
  });
  it('ヘッダだけあって中身が壊れたPDFもinvalid', async () => {
    await expect(
      getPageCount(new TextEncoder().encode('%PDF-1.4\nthis is broken')),
    ).rejects.toMatchObject({ code: 'invalid' });
  });
});
