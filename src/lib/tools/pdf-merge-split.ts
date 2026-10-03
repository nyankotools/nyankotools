import { PDFDocument } from 'pdf-lib';

export type PdfErrorCode =
  | 'invalid'
  | 'encrypted'
  | 'emptyRange'
  | 'badRange'
  | 'outOfRange'
  | 'badCount'
  | 'badOption'
  | 'noOperation'
  | 'unsupportedChar'
  | 'badDate';

export class PdfToolError extends Error {
  code: PdfErrorCode;
  constructor(code: PdfErrorCode) {
    super(code);
    this.code = code;
  }
}

/** PDFを読み込む。暗号化・破損は PdfToolError にする */
export async function load(
  bytes: Uint8Array,
  options?: { updateMetadata?: boolean },
): Promise<PDFDocument> {
  try {
    const doc = await PDFDocument.load(bytes, options);
    // 破損PDFは load が成功しても、カタログが読めず getPageCount で TypeError になることがある
    doc.getPageCount();
    return doc;
  } catch (e) {
    // pdf-lib の EncryptedPDFError は ES5 の継承で instanceof / クラス名が使えない（minifyでも壊れる）ためメッセージで判定する
    const encrypted = e instanceof Error && /is encrypted/.test(e.message);
    throw new PdfToolError(encrypted ? 'encrypted' : 'invalid');
  }
}

export async function getPageCount(bytes: Uint8Array): Promise<number> {
  return (await load(bytes)).getPageCount();
}

/**
 * ページ範囲指定（例: "1-3, 5, 8-"）を 0始まりのページ添字の配列に変換する。
 * "N" / "N-M" / "N-"（Nから最後まで）を、カンマ区切りで指定した順に展開する。
 */
export function parsePageRange(spec: string, pageCount: number): number[] {
  const parts = spec
    .split(/[,、，]/)
    .map((p) => p.trim())
    .filter((p) => p !== '');
  if (parts.length === 0) throw new PdfToolError('emptyRange');
  const indices: number[] = [];
  for (const part of parts) {
    const m = /^(\d+)(?:\s*[-–ー~〜]\s*(\d*))?$/.exec(part);
    if (!m) throw new PdfToolError('badRange');
    const start = Number(m[1]);
    const hasDash = part.length > m[1].length;
    const end = !hasDash ? start : m[2] === '' ? pageCount : Number(m[2]);
    if (start < 1 || end < 1 || start > end) throw new PdfToolError('badRange');
    if (end > pageCount) throw new PdfToolError('outOfRange');
    for (let p = start; p <= end; p++) indices.push(p - 1);
  }
  return indices;
}

export async function mergePdfs(files: Uint8Array[]): Promise<Uint8Array> {
  const out = await PDFDocument.create();
  for (const bytes of files) {
    const src = await load(bytes);
    const pages = await out.copyPages(src, src.getPageIndices());
    pages.forEach((p) => out.addPage(p));
  }
  return out.save();
}

async function copyToNew(
  src: PDFDocument,
  indices: number[],
): Promise<Uint8Array> {
  const out = await PDFDocument.create();
  const pages = await out.copyPages(src, indices);
  pages.forEach((p) => out.addPage(p));
  return out.save();
}

export async function extractPages(
  bytes: Uint8Array,
  indices: number[],
): Promise<Uint8Array> {
  return copyToNew(await load(bytes), indices);
}

/** N ページごとに分割する（最後の1本は端数ページ） */
export async function splitEveryN(
  bytes: Uint8Array,
  n: number,
): Promise<Uint8Array[]> {
  if (!Number.isInteger(n) || n < 1) throw new PdfToolError('badCount');
  const src = await load(bytes);
  const total = src.getPageCount();
  const results: Uint8Array[] = [];
  for (let start = 0; start < total; start += n) {
    const indices: number[] = [];
    for (let i = start; i < Math.min(start + n, total); i++) indices.push(i);
    results.push(await copyToNew(src, indices));
  }
  return results;
}
