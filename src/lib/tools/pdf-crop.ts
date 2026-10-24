// pdf-lib は pdf-merge-split の load() が動的 import するため、PDFを処理するまで読み込まれない
import { load, PdfToolError } from './pdf-merge-split';

/** 各辺から切り落とす長さ（pt）。ページを表示したときの向き（回転後）で上下左右を指す */
export interface Margins {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

/** ページ上の矩形。左上を原点とし、幅・高さを 1 とした正規化座標（0〜1） */
export interface NormalizedRect {
  x: number;
  y: number;
  w: number;
  h: number;
}

/** 画素上の内容の範囲。right / bottom は含まない（幅・高さの計算に使える） */
export interface PixelBounds {
  left: number;
  top: number;
  right: number;
  bottom: number;
}

/** 切り抜き後に最低限残すページの幅・高さ（pt） */
export const MIN_CROP_PT = 10;

const PT_PER_MM = 72 / 25.4;

export const ZERO_MARGINS: Margins = { top: 0, right: 0, bottom: 0, left: 0 };

export function mmToPt(mm: number): number {
  return mm * PT_PER_MM;
}

export function ptToMm(pt: number): number {
  return pt / PT_PER_MM;
}

/** ページ回転角を 0/90/180/270 に正規化する */
export function normalizeRotation(angle: number): 0 | 90 | 180 | 270 {
  const a = (((Math.round(angle / 90) * 90) % 360) + 360) % 360;
  return a as 0 | 90 | 180 | 270;
}

/** 回転を考慮した表示上のページサイズ */
export function displaySize(
  width: number,
  height: number,
  rotation: number,
): { width: number; height: number } {
  const r = normalizeRotation(rotation);
  return r === 90 || r === 270
    ? { width: height, height: width }
    : { width, height };
}

function safe(v: number): number {
  return Number.isFinite(v) && v > 0 ? v : 0;
}

/**
 * 切り落とし量を妥当な範囲に収める。負数・NaN は 0 にし、
 * 左右（上下）の合計がページに MIN_CROP_PT 以上の幅を残すよう比例して縮める。
 */
export function clampMargins(
  m: Margins,
  pageWidth: number,
  pageHeight: number,
): Margins {
  let { top, right, bottom, left } = {
    top: safe(m.top),
    right: safe(m.right),
    bottom: safe(m.bottom),
    left: safe(m.left),
  };
  const maxW = Math.max(0, pageWidth - MIN_CROP_PT);
  const maxH = Math.max(0, pageHeight - MIN_CROP_PT);
  if (left + right > maxW) {
    const k = maxW / (left + right);
    left *= k;
    right *= k;
  }
  if (top + bottom > maxH) {
    const k = maxH / (top + bottom);
    top *= k;
    bottom *= k;
  }
  return { top, right, bottom, left };
}

/** すべての辺が 0 か */
export function isZeroMargins(m: Margins): boolean {
  return m.top <= 0 && m.right <= 0 && m.bottom <= 0 && m.left <= 0;
}

/** 切り抜きが 1 ページ以上にあるか */
export function hasAnyCrop(list: Margins[]): boolean {
  return list.some((m) => !isZeroMargins(m));
}

/** 残す範囲（正規化矩形）を切り落とし量（pt）にする */
export function rectToMargins(
  rect: NormalizedRect,
  pageWidth: number,
  pageHeight: number,
): Margins {
  const x0 = Math.min(1, Math.max(0, rect.x));
  const y0 = Math.min(1, Math.max(0, rect.y));
  const x1 = Math.min(1, Math.max(0, rect.x + rect.w));
  const y1 = Math.min(1, Math.max(0, rect.y + rect.h));
  return clampMargins(
    {
      left: x0 * pageWidth,
      top: y0 * pageHeight,
      right: (1 - x1) * pageWidth,
      bottom: (1 - y1) * pageHeight,
    },
    pageWidth,
    pageHeight,
  );
}

/** 切り落とし量から、残す範囲（正規化矩形）を求める。プレビューの枠表示に使う */
export function marginsToRect(
  m: Margins,
  pageWidth: number,
  pageHeight: number,
): NormalizedRect {
  const c = clampMargins(m, pageWidth, pageHeight);
  return {
    x: c.left / pageWidth,
    y: c.top / pageHeight,
    w: (pageWidth - c.left - c.right) / pageWidth,
    h: (pageHeight - c.top - c.bottom) / pageHeight,
  };
}

/**
 * RGBA 画素データから、白以外の画素がある範囲を求める。
 * いずれかの色成分が threshold 未満なら「内容あり」とみなす（透過は無視。呼び出し側で白下地にしておく）。
 * 1 行（列）に minCount 個以上の内容画素がなければその行（列）は余白として扱い、スキャン時のゴミを無視できる。
 * 全面が白なら null。
 */
export function detectContentBounds(
  data: ArrayLike<number>,
  width: number,
  height: number,
  options: { threshold?: number; minCount?: number } = {},
): PixelBounds | null {
  const threshold = options.threshold ?? 240;
  const minCount = Math.max(1, options.minCount ?? 1);
  if (width <= 0 || height <= 0 || data.length < width * height * 4)
    return null;
  const rows = new Uint32Array(height);
  const cols = new Uint32Array(width);
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const i = (y * width + x) * 4;
      if (
        data[i] < threshold ||
        data[i + 1] < threshold ||
        data[i + 2] < threshold
      ) {
        rows[y]++;
        cols[x]++;
      }
    }
  }
  let top = -1;
  let bottom = -1;
  for (let y = 0; y < height; y++) {
    if (rows[y] >= minCount) {
      if (top < 0) top = y;
      bottom = y;
    }
  }
  let left = -1;
  let right = -1;
  for (let x = 0; x < width; x++) {
    if (cols[x] >= minCount) {
      if (left < 0) left = x;
      right = x;
    }
  }
  if (top < 0 || left < 0) return null;
  return { left, top, right: right + 1, bottom: bottom + 1 };
}

/** 画素上の内容範囲を、内容の周りに padding（pt）を残した切り落とし量にする */
export function boundsToMargins(
  bounds: PixelBounds,
  imageWidth: number,
  imageHeight: number,
  pageWidth: number,
  pageHeight: number,
  paddingPt = 0,
): Margins {
  const sx = pageWidth / imageWidth;
  const sy = pageHeight / imageHeight;
  const pad = safe(paddingPt);
  return clampMargins(
    {
      left: bounds.left * sx - pad,
      top: bounds.top * sy - pad,
      right: (imageWidth - bounds.right) * sx - pad,
      bottom: (imageHeight - bounds.bottom) * sy - pad,
    },
    pageWidth,
    pageHeight,
  );
}

/** 複数ページの内容を全部含む切り落とし量（辺ごとの最小値）。空配列なら 0 */
export function commonMargins(list: Margins[]): Margins {
  if (list.length === 0) return { ...ZERO_MARGINS };
  return {
    top: Math.min(...list.map((m) => m.top)),
    right: Math.min(...list.map((m) => m.right)),
    bottom: Math.min(...list.map((m) => m.bottom)),
    left: Math.min(...list.map((m) => m.left)),
  };
}

/**
 * 表示上の切り落とし量を、PDF 内部（回転前・y 軸が上向き）の CropBox にする。
 * box は現在の CropBox（なければ MediaBox）、rotation はページの /Rotate。
 */
export function marginsToCropBox(
  m: Margins,
  box: { x: number; y: number; width: number; height: number },
  rotation: number,
): { x: number; y: number; width: number; height: number } {
  const r = normalizeRotation(rotation);
  let left: number;
  let top: number;
  let right: number;
  let bottom: number;
  if (r === 90) {
    left = m.top;
    top = m.right;
    right = m.bottom;
    bottom = m.left;
  } else if (r === 180) {
    left = m.right;
    top = m.bottom;
    right = m.left;
    bottom = m.top;
  } else if (r === 270) {
    left = m.bottom;
    top = m.left;
    right = m.top;
    bottom = m.right;
  } else {
    ({ left, top, right, bottom } = m);
  }
  return {
    x: box.x + left,
    y: box.y + bottom,
    width: box.width - left - right,
    height: box.height - top - bottom,
  };
}

/** ページごとの切り落とし量どおりに CropBox を設定した新しいPDFを返す。内容は削除されない */
export async function buildCroppedPdf(
  bytes: Uint8Array,
  margins: Margins[],
): Promise<Uint8Array> {
  const doc = await load(bytes);
  const pages = doc.getPages();
  if (margins.length !== pages.length) throw new PdfToolError('outOfRange');
  if (!hasAnyCrop(margins)) throw new PdfToolError('noOperation');
  pages.forEach((page, i) => {
    if (isZeroMargins(margins[i])) return;
    const box = page.getCropBox();
    const rotation = page.getRotation().angle;
    const size = displaySize(box.width, box.height, rotation);
    const clamped = clampMargins(margins[i], size.width, size.height);
    const next = marginsToCropBox(clamped, box, rotation);
    page.setCropBox(next.x, next.y, next.width, next.height);
  });
  return doc.save();
}

/** 出力ファイル名（例: doc.pdf → doc_cropped.pdf） */
export function croppedFileName(name: string): string {
  const base = name.replace(/\.pdf$/i, '') || 'document';
  return `${base}_cropped.pdf`;
}
