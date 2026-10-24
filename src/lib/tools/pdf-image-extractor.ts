import { zipSync, type Zippable } from 'fflate';

/** pdf.js の ImageKind（pdfjs-dist の util.js と同じ値） */
export const IMAGE_KIND = {
  GRAYSCALE_1BPP: 1,
  RGB_24BPP: 2,
  RGBA_32BPP: 3,
} as const;

/** 抽出に使う pdf.js の演算子コード（pdfjs.OPS から渡す。ロジック層は pdf.js に依存しない） */
export interface ImageOps {
  paintImageXObject: number;
  paintInlineImageXObject: number;
}

export type ImageRef =
  { type: 'object'; name: string } | { type: 'inline'; data: unknown };

/**
 * 演算子リストから、描画されている画像（画像XObject・インライン画像）への参照を出現順に取り出す。
 * 同じ名前の画像XObjectが同じページで複数回描かれても1回だけ数える。
 * 型抜きマスク（paintImageMaskXObject）は色を持たない描画用の型なので対象外。
 */
export function collectImageRefs(
  fnArray: ArrayLike<number>,
  argsArray: ArrayLike<unknown>,
  ops: ImageOps,
): ImageRef[] {
  const refs: ImageRef[] = [];
  const seen = new Set<string>();
  for (let i = 0; i < fnArray.length; i++) {
    const fn = fnArray[i];
    const args = argsArray[i];
    if (fn === ops.paintImageXObject) {
      const name = Array.isArray(args) ? args[0] : undefined;
      if (typeof name !== 'string' || seen.has(name)) continue;
      seen.add(name);
      refs.push({ type: 'object', name });
    } else if (fn === ops.paintInlineImageXObject) {
      const data = Array.isArray(args) ? args[0] : undefined;
      if (data && typeof data === 'object') refs.push({ type: 'inline', data });
    }
  }
  return refs;
}

/** pdf.js が共有（複数ページで使い回す）画像に付ける名前かどうか。共有画像は commonObjs から取得する */
export function isCommonObjectName(name: string): boolean {
  return name.startsWith('g_');
}

/** 短辺が minSize px 未満の画像を除外するかの判定（minSize が 0 なら常に採用） */
export function passesSizeFilter(
  width: number,
  height: number,
  minSize: number,
): boolean {
  if (minSize <= 0) return true;
  return Math.min(width, height) >= minSize;
}

export class ImageDataError extends Error {
  constructor(message = 'unsupported image data') {
    super(message);
  }
}

/**
 * pdf.js のデコード済み画像（kind + ピクセル配列）を RGBA に揃える。
 * 1bpp は行ごとに1バイト境界へパディングされ、1 が白。長さが合わない場合は ImageDataError。
 */
export function toRgba(
  kind: number,
  width: number,
  height: number,
  data: ArrayLike<number>,
) {
  if (!(width > 0) || !(height > 0)) throw new ImageDataError();
  const pixels = width * height;
  const out = new Uint8ClampedArray(pixels * 4);
  if (kind === IMAGE_KIND.RGBA_32BPP) {
    if (data.length < pixels * 4) throw new ImageDataError();
    for (let i = 0; i < pixels * 4; i++) out[i] = data[i];
  } else if (kind === IMAGE_KIND.RGB_24BPP) {
    if (data.length < pixels * 3) throw new ImageDataError();
    for (let i = 0, s = 0, d = 0; i < pixels; i++, s += 3, d += 4) {
      out[d] = data[s];
      out[d + 1] = data[s + 1];
      out[d + 2] = data[s + 2];
      out[d + 3] = 255;
    }
  } else if (kind === IMAGE_KIND.GRAYSCALE_1BPP) {
    const rowBytes = Math.ceil(width / 8);
    if (data.length < rowBytes * height) throw new ImageDataError();
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const bit = (data[y * rowBytes + (x >> 3)] >> (7 - (x & 7))) & 1;
        const d = (y * width + x) * 4;
        const v = bit ? 255 : 0;
        out[d] = v;
        out[d + 1] = v;
        out[d + 2] = v;
        out[d + 3] = 255;
      }
    }
  } else {
    throw new ImageDataError();
  }
  return out;
}

/** RGBA のうち1画素でも不透明でない（alpha < 255）ものがあるか */
export function hasTransparency(rgba: ArrayLike<number>): boolean {
  for (let i = 3; i < rgba.length; i += 4) if (rgba[i] < 255) return true;
  return false;
}

/** 連番ファイル名（例: doc_p03_img2.png）。ページ番号は総ページ数の桁、画像番号は2桁以上に揃える */
export function imageEntryName(
  base: string,
  pageNumber: number,
  imageNumber: number,
  totalPages: number,
): string {
  const pageWidth = String(totalPages).length;
  return `${base}_p${String(pageNumber).padStart(pageWidth, '0')}_img${String(imageNumber).padStart(2, '0')}.png`;
}

/** 拡張子を除いたファイル名（空になる場合は "pdf"） */
export function baseNameOf(fileName: string): string {
  const base = fileName.replace(/\.[^.]+$/, '').trim();
  return base === '' ? 'pdf' : base;
}

/** 抽出した画像が多すぎてメモリを圧迫しないための上限 */
export const MAX_EXTRACTED_IMAGES = 300;

export interface ZipEntry {
  name: string;
  data: Uint8Array;
}

/** PNG は既に圧縮済みなので無圧縮（store）で ZIP にまとめる。同名は連番を付けて衝突を避ける */
export function buildZip(entries: ZipEntry[]): Uint8Array {
  const files: Zippable = {};
  for (const e of entries) {
    let name = e.name;
    for (let n = 2; name in files; n++) {
      name = e.name.replace(/(\.[^.]+)?$/, `_${n}$1`);
    }
    files[name] = [e.data, { level: 0 }];
  }
  return zipSync(files);
}

export function formatBytes(bytes: number): string {
  return bytes < 1024
    ? `${bytes} B`
    : bytes < 1048576
      ? `${(bytes / 1024).toFixed(1)} KB`
      : `${(bytes / 1048576).toFixed(2)} MB`;
}
