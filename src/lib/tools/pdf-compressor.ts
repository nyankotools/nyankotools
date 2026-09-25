import { PDFDocument } from 'pdf-lib';
import { ImageToPdfError } from './pdf-image-converter';

export type CompressPreset = 'high' | 'medium' | 'low';

/** scale: レンダリング倍率（1 = 72dpi）、quality: JPEG品質（0〜1） */
export const COMPRESS_PRESETS: Record<
  CompressPreset,
  { scale: number; quality: number }
> = {
  high: { scale: 2, quality: 0.8 },
  medium: { scale: 1.5, quality: 0.6 },
  low: { scale: 1, quality: 0.4 },
};

export interface RasterPage {
  /** JPEG画像のバイト列 */
  bytes: Uint8Array;
  /** 元ページのサイズ（pt）。画像の解像度によらずこの大きさのページになる */
  widthPt: number;
  heightPt: number;
}

/** ページごとのJPEG画像を、元ページと同じ大きさのページに敷き詰めたPDFを作る */
export async function rasterPagesToPdf(
  pages: RasterPage[],
): Promise<Uint8Array> {
  if (pages.length === 0) throw new ImageToPdfError('noImage');
  const doc = await PDFDocument.create();
  for (const p of pages) {
    let embedded;
    try {
      embedded = await doc.embedJpg(p.bytes);
    } catch {
      throw new ImageToPdfError('badImage');
    }
    const page = doc.addPage([p.widthPt, p.heightPt]);
    page.drawImage(embedded, {
      x: 0,
      y: 0,
      width: p.widthPt,
      height: p.heightPt,
    });
  }
  return doc.save();
}

/** 削減率（%）。増えた場合は負の値。小数点以下は四捨五入 */
export function reductionPercent(
  originalSize: number,
  outputSize: number,
): number {
  if (originalSize <= 0) return 0;
  return Math.round((1 - outputSize / originalSize) * 100);
}

/** 出力ファイル名（例: doc.pdf → doc_compressed.pdf） */
export function compressedFileName(name: string): string {
  const base = name.replace(/\.pdf$/i, '') || 'document';
  return `${base}_compressed.pdf`;
}
