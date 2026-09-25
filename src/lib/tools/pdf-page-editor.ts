import { degrees, PDFDocument } from 'pdf-lib';
import { PdfToolError } from './pdf-merge-split';

/** 編集中の1ページ。index は元PDFの0始まりのページ添字、rotation は追加する回転角（0/90/180/270） */
export interface EditPage {
  index: number;
  rotation: number;
}

/** 元PDFの全ページを、回転なし・元の順序で並べた編集リストを作る */
export function initialPages(pageCount: number): EditPage[] {
  return Array.from({ length: pageCount }, (_, index) => ({
    index,
    rotation: 0,
  }));
}

/** 回転角を 0/90/180/270 に正規化して加算する（delta は 90 の倍数、負も可） */
export function addRotation(current: number, delta: number): number {
  return (((current + delta) % 360) + 360) % 360;
}

/** 配列内の要素を delta だけ移動した新しい配列を返す（範囲外なら元のまま） */
export function moveItem<T>(items: T[], from: number, delta: number): T[] {
  const to = from + delta;
  if (from < 0 || from >= items.length || to < 0 || to >= items.length) {
    return items;
  }
  const next = items.slice();
  [next[from], next[to]] = [next[to], next[from]];
  return next;
}

/** 編集リスト（順序・回転・削除済み）どおりに新しいPDFを作る */
export async function buildEditedPdf(
  bytes: Uint8Array,
  pages: EditPage[],
): Promise<Uint8Array> {
  if (pages.length === 0) throw new PdfToolError('emptyRange');
  let src: PDFDocument;
  try {
    src = await PDFDocument.load(bytes);
  } catch (e) {
    const encrypted = e instanceof Error && /is encrypted/.test(e.message);
    throw new PdfToolError(encrypted ? 'encrypted' : 'invalid');
  }
  if (pages.some((p) => p.index < 0 || p.index >= src.getPageCount())) {
    throw new PdfToolError('outOfRange');
  }
  const out = await PDFDocument.create();
  const copied = await out.copyPages(
    src,
    pages.map((p) => p.index),
  );
  copied.forEach((page, i) => {
    const rotation = pages[i].rotation;
    if (rotation !== 0) {
      page.setRotation(
        degrees(addRotation(page.getRotation().angle, rotation)),
      );
    }
    out.addPage(page);
  });
  return out.save();
}

/** 出力ファイル名（例: doc.pdf → doc_edited.pdf） */
export function editedFileName(name: string): string {
  const base = name.replace(/\.pdf$/i, '') || 'document';
  return `${base}_edited.pdf`;
}
