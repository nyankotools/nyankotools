import { PDFDict, PDFHexString, PDFName, PDFRef, PDFString } from 'pdf-lib';
import { load, PdfToolError } from './pdf-merge-split';

/** 編集対象の文書情報。日付は datetime-local 形式（YYYY-MM-DDTHH:mm、ローカル時刻）、空文字は「なし」 */
export interface PdfMetadata {
  title: string;
  author: string;
  subject: string;
  keywords: string;
  creator: string;
  producer: string;
  creationDate: string;
  modificationDate: string;
}

export const TEXT_FIELDS = [
  ['title', 'Title'],
  ['author', 'Author'],
  ['subject', 'Subject'],
  ['keywords', 'Keywords'],
  ['creator', 'Creator'],
  ['producer', 'Producer'],
] as const;

export const DATE_FIELDS = [
  ['creationDate', 'CreationDate'],
  ['modificationDate', 'ModDate'],
] as const;

const pad = (n: number, width = 2) => String(n).padStart(width, '0');

/** Date を datetime-local 形式（ローカル時刻）にする。不正な日付は空文字 */
export function dateToLocalInput(date: Date | undefined): string {
  if (!date || Number.isNaN(date.getTime())) return '';
  return `${pad(date.getFullYear(), 4)}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

/** datetime-local 形式を Date にする。空文字は undefined、不正なら PdfToolError('badDate') */
export function localInputToDate(value: string): Date | undefined {
  const v = value.trim();
  if (v === '') return undefined;
  const m = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})(?::(\d{2}))?$/.exec(v);
  if (!m) throw new PdfToolError('badDate');
  const [y, mo, d, h, mi, s] = m.slice(1).map((x) => Number(x ?? 0));
  const date = new Date(y, mo - 1, d, h, mi, s);
  if (
    date.getFullYear() !== y ||
    date.getMonth() !== mo - 1 ||
    date.getDate() !== d ||
    date.getHours() !== h ||
    date.getMinutes() !== mi
  ) {
    throw new PdfToolError('badDate');
  }
  return date;
}

/** PDFの文書情報（Info辞書）を読む。読み込みでは Producer などを書き換えない */
export async function readMetadata(
  bytes: Uint8Array,
): Promise<{ metadata: PdfMetadata; pageCount: number }> {
  const doc = await load(bytes, { updateMetadata: false });
  return {
    pageCount: doc.getPageCount(),
    metadata: {
      title: doc.getTitle() ?? '',
      author: doc.getAuthor() ?? '',
      subject: doc.getSubject() ?? '',
      keywords: doc.getKeywords() ?? '',
      creator: doc.getCreator() ?? '',
      producer: doc.getProducer() ?? '',
      creationDate: dateToLocalInput(doc.getCreationDate()),
      modificationDate: dateToLocalInput(doc.getModificationDate()),
    },
  };
}

/**
 * 文書情報を書き換えた新しいPDFを返す。空欄の項目はInfo辞書から削除する。
 * removeXmp が true なら、古い値が残りうるXMPメタデータ（カタログの /Metadata）も削除する。
 */
export async function writeMetadata(
  bytes: Uint8Array,
  metadata: PdfMetadata,
  options: { removeXmp: boolean },
): Promise<Uint8Array> {
  // 日付の検証は読み込み前に行い、不正入力は先に弾く
  const dates = DATE_FIELDS.map(
    ([field, key]) => [key, localInputToDate(metadata[field])] as const,
  );
  const doc = await load(bytes, { updateMetadata: false });
  // getInfoDict は pdf-lib 上 private だが、Info辞書の削除・生書き込みに必要なため型だけ迂回する
  const info = (doc as unknown as { getInfoDict(): PDFDict }).getInfoDict();
  for (const [field, key] of TEXT_FIELDS) {
    const value = metadata[field];
    if (value === '') info.delete(PDFName.of(key));
    else info.set(PDFName.of(key), PDFHexString.fromText(value));
  }
  for (const [key, date] of dates) {
    if (date) info.set(PDFName.of(key), PDFString.fromDate(date));
    else info.delete(PDFName.of(key));
  }
  if (options.removeXmp) {
    // 参照を外すだけでは実体が出力に残るため、ストリーム本体も context から削除する
    const ref = doc.catalog.get(PDFName.of('Metadata'));
    doc.catalog.delete(PDFName.of('Metadata'));
    if (ref instanceof PDFRef) doc.context.delete(ref);
  }
  return doc.save();
}

/** すべての項目を空にした文書情報 */
export function emptyMetadata(): PdfMetadata {
  return {
    title: '',
    author: '',
    subject: '',
    keywords: '',
    creator: '',
    producer: '',
    creationDate: '',
    modificationDate: '',
  };
}

/** 出力ファイル名（例: doc.pdf → doc_metadata.pdf） */
export function metadataFileName(name: string): string {
  const base = name.replace(/\.pdf$/i, '') || 'document';
  return `${base}_metadata.pdf`;
}
