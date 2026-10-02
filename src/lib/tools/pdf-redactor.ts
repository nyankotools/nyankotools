/** ページ上の黒塗り範囲。ページの左上を原点とし、幅・高さを 1 とした正規化座標（0〜1） */
export interface RedactRect {
  x: number;
  y: number;
  w: number;
  h: number;
}

/** 黒塗りとして採用する最小サイズ（ページ幅・高さに対する割合）。誤クリック程度の動きは捨てる */
export const MIN_RECT_SIZE = 0.005;

/** 書き出し解像度。scale は 1 = 72dpi、quality は JPEG 品質（0〜1） */
export type RedactQuality = 'standard' | 'high';

export const REDACT_QUALITIES: Record<
  RedactQuality,
  { scale: number; quality: number }
> = {
  standard: { scale: 2, quality: 0.85 },
  high: { scale: 3, quality: 0.92 },
};

function clamp01(v: number): number {
  return Math.min(1, Math.max(0, v));
}

/** ドラッグの始点・終点（正規化座標）から、ページ内に収めた矩形を作る。小さすぎる場合は null */
export function rectFromPoints(
  x0: number,
  y0: number,
  x1: number,
  y1: number,
): RedactRect | null {
  const left = clamp01(Math.min(x0, x1));
  const top = clamp01(Math.min(y0, y1));
  const right = clamp01(Math.max(x0, x1));
  const bottom = clamp01(Math.max(y0, y1));
  const w = right - left;
  const h = bottom - top;
  if (w < MIN_RECT_SIZE || h < MIN_RECT_SIZE) return null;
  return { x: left, y: top, w, h };
}

/** 正規化矩形を、指定サイズのキャンバス上のピクセル矩形にする（端の隙間が出ないよう外側へ丸める） */
export function rectToPixels(
  rect: RedactRect,
  width: number,
  height: number,
): { x: number; y: number; w: number; h: number } {
  const x = Math.floor(rect.x * width);
  const y = Math.floor(rect.y * height);
  const right = Math.min(width, Math.ceil((rect.x + rect.w) * width));
  const bottom = Math.min(height, Math.ceil((rect.y + rect.h) * height));
  return { x, y, w: right - x, h: bottom - y };
}

/** 全ページの黒塗り箇所の合計 */
export function countRects(pages: RedactRect[][]): number {
  return pages.reduce((sum, rects) => sum + rects.length, 0);
}

/** 黒塗りのあるページ数 */
export function countRedactedPages(pages: RedactRect[][]): number {
  return pages.filter((rects) => rects.length > 0).length;
}

/** 出力ファイル名（例: doc.pdf → doc_redacted.pdf） */
export function redactedFileName(name: string): string {
  const base = name.replace(/\.pdf$/i, '') || 'document';
  return `${base}_redacted.pdf`;
}
