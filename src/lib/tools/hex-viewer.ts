/** 1行に表示するバイト数 */
export const BYTES_PER_ROW = 16;
/** 仮想スクロールのスペーサー高さの上限（ブラウザの要素高さ上限より十分小さくする） */
export const MAX_SPACER_HEIGHT = 8_000_000;
/** 検索時に1回で読み込むバイト数 */
export const SEARCH_CHUNK_SIZE = 4 * 1024 * 1024;

export type ParseFailure<R extends string> = { ok: false; reason: R };

/** オフセットを8桁以上の16進数（大文字）にする */
export function formatOffset(offset: number): string {
  return offset.toString(16).toUpperCase().padStart(8, '0');
}

/** バイトを2桁の16進数（大文字）にする */
export function byteToHex(byte: number): string {
  return byte.toString(16).toUpperCase().padStart(2, '0');
}

/** ASCII表示用の1文字（表示できないバイトは「.」） */
export function byteToAscii(byte: number): string {
  return byte >= 0x20 && byte <= 0x7e ? String.fromCharCode(byte) : '.';
}

/** 1行分のバイト列を、16進部とASCII部の文字列にする（末尾が欠ける行は空白で埋める） */
export function formatRow(
  bytes: Uint8Array,
  perRow: number = BYTES_PER_ROW,
): { hex: string; ascii: string } {
  let hex = '';
  let ascii = '';
  for (let i = 0; i < perRow; i++) {
    if (i < bytes.length) {
      hex += byteToHex(bytes[i]) + ' ';
      ascii += byteToAscii(bytes[i]);
    } else {
      hex += '   ';
    }
    if (i === perRow / 2 - 1) hex += ' ';
  }
  return { hex, ascii };
}

export function formatFileSize(bytes: number): string {
  const units = ['B', 'KB', 'MB', 'GB', 'TB'];
  let value = bytes;
  let i = 0;
  while (value >= 1024 && i < units.length - 1) {
    value /= 1024;
    i++;
  }
  const text = i === 0 ? String(value) : value.toFixed(value >= 100 ? 0 : 1);
  return `${text} ${units[i]}`;
}

export function totalRows(size: number, perRow: number = BYTES_PER_ROW) {
  return Math.ceil(size / perRow);
}

// ---------- 仮想スクロール ----------

export interface ScrollLayout {
  rows: number;
  rowHeight: number;
  viewportHeight: number;
}

/** スペーサー要素の高さ */
export function spacerHeight(l: ScrollLayout): number {
  return Math.min(l.rows * l.rowHeight, MAX_SPACER_HEIGHT);
}

function isScaled(l: ScrollLayout): boolean {
  return l.rows * l.rowHeight > MAX_SPACER_HEIGHT;
}

function maxFirstRow(l: ScrollLayout): number {
  return Math.max(0, l.rows - Math.ceil(l.viewportHeight / l.rowHeight));
}

/** スクロール位置から、先頭に表示する行番号を求める */
export function rowFromScroll(scrollTop: number, l: ScrollLayout): number {
  if (l.rows <= 0) return 0;
  if (!isScaled(l)) {
    return Math.min(
      Math.max(0, Math.floor(scrollTop / l.rowHeight)),
      l.rows - 1,
    );
  }
  const maxScroll = spacerHeight(l) - l.viewportHeight;
  const ratio = Math.min(1, Math.max(0, scrollTop / maxScroll));
  return Math.round(ratio * maxFirstRow(l));
}

/** 行番号を先頭に表示するためのスクロール位置 */
export function scrollFromRow(row: number, l: ScrollLayout): number {
  const clamped = Math.min(Math.max(0, row), Math.max(0, l.rows - 1));
  if (!isScaled(l)) return clamped * l.rowHeight;
  const maxFirst = maxFirstRow(l);
  if (maxFirst === 0) return 0;
  const ratio = Math.min(1, clamped / maxFirst);
  return Math.round(ratio * (spacerHeight(l) - l.viewportHeight));
}

/** 表示行の描画要素を置く縦位置（スクロール量が縮小されている場合は scrollTop に追従する） */
export function contentTop(
  scrollTop: number,
  firstRow: number,
  l: ScrollLayout,
): number {
  return isScaled(l) ? scrollTop : firstRow * l.rowHeight;
}

// ---------- 入力のパース ----------

export type OffsetResult =
  { ok: true; offset: number } | ParseFailure<'empty' | 'invalid' | 'range'>;

/** オフセット入力を解釈する（0x始まりは16進、それ以外は10進） */
export function parseOffset(input: string, size: number): OffsetResult {
  const text = input.trim().replace(/[_,\s]/g, '');
  if (text === '') return { ok: false, reason: 'empty' };
  let offset: number;
  if (/^0x[0-9a-f]+$/i.test(text)) {
    offset = parseInt(text.slice(2), 16);
  } else if (/^[0-9]+$/.test(text)) {
    offset = parseInt(text, 10);
  } else {
    return { ok: false, reason: 'invalid' };
  }
  if (!Number.isSafeInteger(offset) || offset < 0 || offset >= size) {
    return { ok: false, reason: 'range' };
  }
  return { ok: true, offset };
}

export type PatternResult =
  { ok: true; bytes: Uint8Array } | ParseFailure<'empty' | 'invalid' | 'odd'>;

/** 16進のバイト列入力（「DE AD BE EF」「0xDE,0xAD」「deadbeef」など）を解釈する */
export function parseHexPattern(input: string): PatternResult {
  const text = input.replace(/0x/gi, '').replace(/[\s,:-]/g, '');
  if (text === '') return { ok: false, reason: 'empty' };
  if (!/^[0-9a-fA-F]+$/.test(text)) return { ok: false, reason: 'invalid' };
  if (text.length % 2 !== 0) return { ok: false, reason: 'odd' };
  const bytes = new Uint8Array(text.length / 2);
  for (let i = 0; i < bytes.length; i++) {
    bytes[i] = parseInt(text.slice(i * 2, i * 2 + 2), 16);
  }
  return { ok: true, bytes };
}

export type TextEncoding = 'utf-8' | 'utf-16le' | 'latin1';

export type TextPatternResult =
  { ok: true; bytes: Uint8Array } | ParseFailure<'empty' | 'unmappable'>;

/** 検索文字列を、指定した文字エンコーディングのバイト列にする */
export function encodeTextPattern(
  text: string,
  encoding: TextEncoding,
): TextPatternResult {
  if (text === '') return { ok: false, reason: 'empty' };
  if (encoding === 'utf-8') {
    return { ok: true, bytes: new TextEncoder().encode(text) };
  }
  if (encoding === 'utf-16le') {
    const bytes = new Uint8Array(text.length * 2);
    for (let i = 0; i < text.length; i++) {
      const code = text.charCodeAt(i);
      bytes[i * 2] = code & 0xff;
      bytes[i * 2 + 1] = code >> 8;
    }
    return { ok: true, bytes };
  }
  const bytes = new Uint8Array(text.length);
  for (let i = 0; i < text.length; i++) {
    const code = text.charCodeAt(i);
    if (code > 0xff) return { ok: false, reason: 'unmappable' };
    bytes[i] = code;
  }
  return { ok: true, bytes };
}

// ---------- 検索 ----------

/** haystack の from 以降で最初に needle と一致する位置（無ければ -1） */
export function findInBytes(
  haystack: Uint8Array,
  needle: Uint8Array,
  from = 0,
): number {
  const n = needle.length;
  if (n === 0) return -1;
  const last = haystack.length - n;
  let i = Math.max(0, from);
  while (i <= last) {
    i = haystack.indexOf(needle[0], i);
    if (i === -1 || i > last) return -1;
    let j = 1;
    while (j < n && haystack[i + j] === needle[j]) j++;
    if (j === n) return i;
    i++;
  }
  return -1;
}

/** haystack で、開始位置が maxStart 以下の最後の一致位置（無ければ -1） */
export function findLastInBytes(
  haystack: Uint8Array,
  needle: Uint8Array,
  maxStart = Number.POSITIVE_INFINITY,
): number {
  const n = needle.length;
  if (n === 0) return -1;
  let i = Math.min(maxStart, haystack.length - n);
  while (i >= 0) {
    i = haystack.lastIndexOf(needle[0], i);
    if (i === -1) return -1;
    let j = 1;
    while (j < n && haystack[i + j] === needle[j]) j++;
    if (j === n) return i;
    i--;
  }
  return -1;
}

export type SearchResult =
  | { status: 'found'; offset: number }
  | { status: 'not-found' }
  | { status: 'cancelled' };

export interface SearchOptions {
  chunkSize?: number;
  /** 0〜1 の進捗 */
  onProgress?: (ratio: number) => void;
  isCancelled?: () => boolean;
}

/** [start, end) のバイト列を読む関数（File.slice().arrayBuffer() などを包む） */
export type ReadRange = (start: number, end: number) => Promise<Uint8Array>;

/** from 以降（from を含む）で最初に一致する位置を、チャンクに分けて探す */
export async function searchForward(
  read: ReadRange,
  size: number,
  needle: Uint8Array,
  from: number,
  options: SearchOptions = {},
): Promise<SearchResult> {
  const chunk = options.chunkSize ?? SEARCH_CHUNK_SIZE;
  const n = needle.length;
  const lastStart = size - n; // 開始位置の最大値
  const begin = Math.max(0, from);
  if (n === 0 || lastStart < begin) return { status: 'not-found' };
  for (let s = begin; s <= lastStart; s += chunk) {
    if (options.isCancelled?.()) return { status: 'cancelled' };
    const e = Math.min(s + chunk - 1, lastStart); // このチャンクで調べる開始位置の最大値
    const buf = await read(s, e + n);
    const idx = findInBytes(buf, needle, 0);
    if (idx !== -1 && idx <= e - s) return { status: 'found', offset: s + idx };
    options.onProgress?.(
      Math.min(1, (e + 1 - begin) / (lastStart + 1 - begin)),
    );
  }
  return { status: 'not-found' };
}

/** 開始位置が before より前（before 未満）の最後の一致位置を、チャンクに分けて探す */
export async function searchBackward(
  read: ReadRange,
  size: number,
  needle: Uint8Array,
  before: number,
  options: SearchOptions = {},
): Promise<SearchResult> {
  const chunk = options.chunkSize ?? SEARCH_CHUNK_SIZE;
  const n = needle.length;
  let hi = Math.min(before, size - n + 1); // 開始位置の上限（含まない）
  if (n === 0 || hi <= 0) return { status: 'not-found' };
  const total = hi;
  while (hi > 0) {
    if (options.isCancelled?.()) return { status: 'cancelled' };
    const lo = Math.max(0, hi - chunk);
    const buf = await read(lo, hi - 1 + n);
    const idx = findLastInBytes(buf, needle, hi - 1 - lo);
    if (idx !== -1) return { status: 'found', offset: lo + idx };
    hi = lo;
    options.onProgress?.(Math.min(1, (total - hi) / total));
  }
  return { status: 'not-found' };
}
