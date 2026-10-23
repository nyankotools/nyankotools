import {
  A_SERIES,
  B_SERIES,
  MM_PER_INCH,
  convert,
  type PaperSize,
} from './print-size-converter';

export type ImageDpiFormat = 'png' | 'jpeg';

export type ImageDpiErrorCode =
  'unsupported-format' | 'corrupt' | 'invalid-dpi';

export const MIN_DPI = 1;
export const MAX_DPI = 65535;
/** 読み込むファイルサイズの上限（バイト） */
export const MAX_FILE_SIZE = 100 * 1024 * 1024;

export interface ImageDpiInfo {
  format: ImageDpiFormat;
  widthPx: number;
  heightPx: number;
  /** 埋め込み済みのDPI。未設定・単位不明なら null */
  dpiX: number | null;
  dpiY: number | null;
}

export type ReadResult =
  ({ ok: true } & ImageDpiInfo) | { ok: false; error: ImageDpiErrorCode };

export type WriteResult =
  | { ok: true; data: Uint8Array<ArrayBuffer>; format: ImageDpiFormat }
  | { ok: false; error: ImageDpiErrorCode };

const PNG_SIGNATURE = [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a];
const INCH_PER_METER = 0.0254;

/** pHYsはメートル単位の整数のため、DPIは小数第1位に丸めて返す */
function round2(value: number): number {
  return Math.round(value * 10) / 10;
}

function u16(bytes: Uint8Array, offset: number): number {
  return (bytes[offset] << 8) | bytes[offset + 1];
}

function u32(bytes: Uint8Array, offset: number): number {
  return (
    ((bytes[offset] << 24) |
      (bytes[offset + 1] << 16) |
      (bytes[offset + 2] << 8) |
      bytes[offset + 3]) >>>
    0
  );
}

function setU32(bytes: Uint8Array, offset: number, value: number): void {
  bytes[offset] = (value >>> 24) & 0xff;
  bytes[offset + 1] = (value >>> 16) & 0xff;
  bytes[offset + 2] = (value >>> 8) & 0xff;
  bytes[offset + 3] = value & 0xff;
}

function setU16(bytes: Uint8Array, offset: number, value: number): void {
  bytes[offset] = (value >>> 8) & 0xff;
  bytes[offset + 1] = value & 0xff;
}

let crcTable: Uint32Array | null = null;

/** PNGチャンクのCRC-32（種別4バイト + データ） */
export function crc32(bytes: Uint8Array): number {
  if (!crcTable) {
    crcTable = new Uint32Array(256);
    for (let n = 0; n < 256; n++) {
      let c = n;
      for (let k = 0; k < 8; k++) {
        c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
      }
      crcTable[n] = c >>> 0;
    }
  }
  let crc = 0xffffffff;
  for (let i = 0; i < bytes.length; i++) {
    crc = crcTable[(crc ^ bytes[i]) & 0xff] ^ (crc >>> 8);
  }
  return (crc ^ 0xffffffff) >>> 0;
}

export function detectFormat(bytes: Uint8Array): ImageDpiFormat | null {
  if (
    bytes.length >= 8 &&
    PNG_SIGNATURE.every((value, index) => bytes[index] === value)
  ) {
    return 'png';
  }
  if (bytes.length >= 3 && bytes[0] === 0xff && bytes[1] === 0xd8) {
    return 'jpeg';
  }
  return null;
}

/** DPI入力が1〜65535の整数か（PNGのpHYs・JPEGのJFIFの両方で表現できる範囲） */
export function isValidDpi(dpi: number): boolean {
  return Number.isInteger(dpi) && dpi >= MIN_DPI && dpi <= MAX_DPI;
}

// ---------------------------------------------------------------- PNG

interface PngChunk {
  type: string;
  /** チャンク先頭（長さフィールド）のオフセット */
  start: number;
  length: number;
}

function typeAt(bytes: Uint8Array, offset: number): string {
  return String.fromCharCode(
    bytes[offset],
    bytes[offset + 1],
    bytes[offset + 2],
    bytes[offset + 3],
  );
}

function listPngChunks(bytes: Uint8Array): PngChunk[] | null {
  const chunks: PngChunk[] = [];
  let pos = 8;
  while (pos + 12 <= bytes.length) {
    const length = u32(bytes, pos);
    const type = typeAt(bytes, pos + 4);
    if (pos + 12 + length > bytes.length) return null;
    chunks.push({ type, start: pos, length });
    pos += 12 + length;
    if (type === 'IEND') break;
  }
  const first = chunks[0];
  if (!first || first.type !== 'IHDR' || first.length !== 13) return null;
  return chunks;
}

function readPng(bytes: Uint8Array): ReadResult {
  const chunks = listPngChunks(bytes);
  if (!chunks) return { ok: false, error: 'corrupt' };
  const ihdr = chunks[0];
  const widthPx = u32(bytes, ihdr.start + 8);
  const heightPx = u32(bytes, ihdr.start + 12);
  if (widthPx === 0 || heightPx === 0) return { ok: false, error: 'corrupt' };

  let dpiX: number | null = null;
  let dpiY: number | null = null;
  const phys = chunks.find((c) => c.type === 'pHYs' && c.length === 9);
  if (phys) {
    const unit = bytes[phys.start + 8 + 8];
    if (unit === 1) {
      dpiX = round2(u32(bytes, phys.start + 8) * INCH_PER_METER);
      dpiY = round2(u32(bytes, phys.start + 12) * INCH_PER_METER);
    }
  }
  return { ok: true, format: 'png', widthPx, heightPx, dpiX, dpiY };
}

function writePng(bytes: Uint8Array, dpi: number): WriteResult {
  const chunks = listPngChunks(bytes);
  if (!chunks) return { ok: false, error: 'corrupt' };
  const ppm = Math.round(dpi / INCH_PER_METER);

  const chunk = new Uint8Array(21);
  setU32(chunk, 0, 9);
  chunk.set([0x70, 0x48, 0x59, 0x73], 4); // "pHYs"
  setU32(chunk, 8, ppm);
  setU32(chunk, 12, ppm);
  chunk[16] = 1;
  setU32(chunk, 17, crc32(chunk.subarray(4, 17)));

  const existing = chunks.find((c) => c.type === 'pHYs');
  const ihdr = chunks[0];
  const insertAt = ihdr.start + 12 + ihdr.length;
  const removeStart = existing ? existing.start : insertAt;
  const removeEnd = existing ? existing.start + 12 + existing.length : insertAt;

  const out = new Uint8Array(bytes.length - (removeEnd - removeStart) + 21);
  out.set(bytes.subarray(0, removeStart), 0);
  out.set(chunk, removeStart);
  out.set(bytes.subarray(removeEnd), removeStart + 21);
  return { ok: true, data: out, format: 'png' };
}

// ---------------------------------------------------------------- JPEG

interface JpegLayout {
  widthPx: number;
  heightPx: number;
  /** 先頭近くにあるJFIF APP0 のマーカー(0xFF)位置。無ければ null */
  jfifOffset: number | null;
}

function parseJpeg(bytes: Uint8Array): JpegLayout | null {
  let pos = 2;
  let jfifOffset: number | null = null;
  while (pos + 4 <= bytes.length) {
    if (bytes[pos] !== 0xff) return null;
    let marker = bytes[pos + 1];
    while (marker === 0xff && pos + 2 < bytes.length) {
      pos++;
      marker = bytes[pos + 1];
    }
    if (marker === 0xd9 || marker === 0xda) return null; // SOFが見つからないまま画像データへ
    if (marker === 0x01 || (marker >= 0xd0 && marker <= 0xd8)) {
      pos += 2;
      continue;
    }
    const length = u16(bytes, pos + 2);
    if (length < 2 || pos + 2 + length > bytes.length) return null;
    if (
      marker === 0xe0 &&
      jfifOffset === null &&
      length >= 16 &&
      bytes[pos + 4] === 0x4a &&
      bytes[pos + 5] === 0x46 &&
      bytes[pos + 6] === 0x49 &&
      bytes[pos + 7] === 0x46 &&
      bytes[pos + 8] === 0x00
    ) {
      jfifOffset = pos;
    }
    const isSof =
      marker >= 0xc0 &&
      marker <= 0xcf &&
      marker !== 0xc4 &&
      marker !== 0xc8 &&
      marker !== 0xcc;
    if (isSof) {
      if (length < 8) return null;
      const heightPx = u16(bytes, pos + 5);
      const widthPx = u16(bytes, pos + 7);
      if (widthPx === 0 || heightPx === 0) return null;
      return { widthPx, heightPx, jfifOffset };
    }
    pos += 2 + length;
  }
  return null;
}

function readJpeg(bytes: Uint8Array): ReadResult {
  const layout = parseJpeg(bytes);
  if (!layout) return { ok: false, error: 'corrupt' };
  let dpiX: number | null = null;
  let dpiY: number | null = null;
  if (layout.jfifOffset !== null) {
    const o = layout.jfifOffset;
    const units = bytes[o + 11];
    const x = u16(bytes, o + 12);
    const y = u16(bytes, o + 14);
    if (units === 1) {
      dpiX = x;
      dpiY = y;
    } else if (units === 2) {
      dpiX = round2(x * 2.54);
      dpiY = round2(y * 2.54);
    }
  }
  return {
    ok: true,
    format: 'jpeg',
    widthPx: layout.widthPx,
    heightPx: layout.heightPx,
    dpiX,
    dpiY,
  };
}

function writeJpeg(bytes: Uint8Array, dpi: number): WriteResult {
  const layout = parseJpeg(bytes);
  if (!layout) return { ok: false, error: 'corrupt' };

  if (layout.jfifOffset !== null) {
    const out = new Uint8Array(bytes);
    const o = layout.jfifOffset;
    out[o + 11] = 1;
    setU16(out, o + 12, dpi);
    setU16(out, o + 14, dpi);
    return { ok: true, data: out, format: 'jpeg' };
  }

  // JFIFが無いJPEG（Exifのみ等）: SOIの直後にJFIF APP0を挿入する
  const segment = new Uint8Array(18);
  segment.set([0xff, 0xe0, 0x00, 0x10, 0x4a, 0x46, 0x49, 0x46, 0x00]);
  segment[9] = 1; // version 1.01
  segment[10] = 1;
  segment[11] = 1; // units = dpi
  setU16(segment, 12, dpi);
  setU16(segment, 14, dpi);
  const out = new Uint8Array(bytes.length + 18);
  out.set(bytes.subarray(0, 2), 0);
  out.set(segment, 2);
  out.set(bytes.subarray(2), 20);
  return { ok: true, data: out, format: 'jpeg' };
}

// ---------------------------------------------------------------- public

export function readImageDpi(bytes: Uint8Array): ReadResult {
  const format = detectFormat(bytes);
  if (format === 'png') return readPng(bytes);
  if (format === 'jpeg') return readJpeg(bytes);
  return { ok: false, error: 'unsupported-format' };
}

/** ピクセルデータには触れず、DPIメタデータだけを書き換えた新しいバイト列を返す */
export function setImageDpi(bytes: Uint8Array, dpi: number): WriteResult {
  if (!isValidDpi(dpi)) return { ok: false, error: 'invalid-dpi' };
  const format = detectFormat(bytes);
  if (format === 'png') return writePng(bytes, dpi);
  if (format === 'jpeg') return writeJpeg(bytes, dpi);
  return { ok: false, error: 'unsupported-format' };
}

export interface PrintSize {
  widthMm: number;
  heightMm: number;
}

function roundTo(value: number, decimals: number): number {
  const factor = 10 ** decimals;
  return Math.round(value * factor) / factor;
}

/** ピクセル数とDPIから印刷サイズ(mm)を求める（小数第1位まで） */
export function printSizeMm(
  widthPx: number,
  heightPx: number,
  dpi: number,
): PrintSize {
  return {
    widthMm: roundTo(convert(widthPx, 'px', 'mm', dpi), 1),
    heightMm: roundTo(convert(heightPx, 'px', 'mm', dpi), 1),
  };
}

export interface PaperFit {
  name: string;
  widthMm: number;
  heightMm: number;
  /** 画像を用紙に収める（はみ出さない）ために必要な最低DPI（小数第1位） */
  fitDpi: number;
  /** 指定DPIの印刷サイズが用紙に収まるか（縦横は自動で合わせる） */
  fitsAtDpi: boolean;
}

export const PAPER_FIT_TARGETS: PaperSize[] = [
  ...A_SERIES.filter((p) => ['A3', 'A4', 'A5', 'A6'].includes(p.name)),
  ...B_SERIES.filter((p) => ['B4', 'B5', 'B6'].includes(p.name)),
];

/** ピクセル丸めによる誤差（2480x3508pxはA4より約0.01mm大きい）を許容する */
const FIT_TOLERANCE_MM = 0.5;

/** 主要な用紙に対して、画像の向きを自動で合わせた収まり具合を返す */
export function paperFits(
  widthPx: number,
  heightPx: number,
  dpi: number,
  papers: PaperSize[] = PAPER_FIT_TARGETS,
): PaperFit[] {
  const shortPx = Math.min(widthPx, heightPx);
  const longPx = Math.max(widthPx, heightPx);
  return papers.map((paper) => {
    const shortInch = paper.widthMm / MM_PER_INCH;
    const longInch = paper.heightMm / MM_PER_INCH;
    const fitDpi = Math.max(shortPx / shortInch, longPx / longInch);
    const printShortMm = (shortPx / dpi) * MM_PER_INCH;
    const printLongMm = (longPx / dpi) * MM_PER_INCH;
    return {
      name: paper.name,
      widthMm: paper.widthMm,
      heightMm: paper.heightMm,
      fitDpi: roundTo(fitDpi, 1),
      fitsAtDpi:
        printShortMm <= paper.widthMm + FIT_TOLERANCE_MM &&
        printLongMm <= paper.heightMm + FIT_TOLERANCE_MM,
    };
  });
}

/** 出力ファイル名: `photo.png` -> `photo-300dpi.png` */
export function buildOutputName(
  name: string,
  dpi: number,
  format: ImageDpiFormat,
): string {
  const dot = name.lastIndexOf('.');
  const base = dot > 0 ? name.slice(0, dot) : name || 'image';
  const ext = dot > 0 ? name.slice(dot) : format === 'png' ? '.png' : '.jpg';
  return `${base}-${dpi}dpi${ext}`;
}

export function mimeTypeOf(format: ImageDpiFormat): string {
  return format === 'png' ? 'image/png' : 'image/jpeg';
}
