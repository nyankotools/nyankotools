import { PDFDocument } from 'pdf-lib';

export type ImageToPdfErrorCode = 'noImage' | 'badImage';

export class ImageToPdfError extends Error {
  code: ImageToPdfErrorCode;
  constructor(code: ImageToPdfErrorCode) {
    super(code);
    this.code = code;
  }
}

export interface PdfImageInput {
  bytes: Uint8Array;
  /** PNG または JPEG のみ（それ以外は呼び出し側でPNGへ変換しておく） */
  type: 'image/png' | 'image/jpeg';
}

export type PageSizeMode = 'fit' | 'a4';

/** A4 縦（pt） */
export const A4_WIDTH = 595.28;
export const A4_HEIGHT = 841.89;
const A4_MARGIN = 28;

/** 画像を1枚1ページで並べたPDFを作る。'fit' は画像サイズのページ、'a4' はA4縦に余白付きで収める */
export async function imagesToPdf(
  images: PdfImageInput[],
  pageSize: PageSizeMode,
): Promise<Uint8Array> {
  if (images.length === 0) throw new ImageToPdfError('noImage');
  const doc = await PDFDocument.create();
  for (const img of images) {
    let embedded;
    try {
      embedded =
        img.type === 'image/png'
          ? await doc.embedPng(img.bytes)
          : await doc.embedJpg(img.bytes);
    } catch {
      throw new ImageToPdfError('badImage');
    }
    if (pageSize === 'fit') {
      const page = doc.addPage([embedded.width, embedded.height]);
      page.drawImage(embedded, {
        x: 0,
        y: 0,
        width: embedded.width,
        height: embedded.height,
      });
    } else {
      const page = doc.addPage([A4_WIDTH, A4_HEIGHT]);
      const scale = Math.min(
        (A4_WIDTH - A4_MARGIN * 2) / embedded.width,
        (A4_HEIGHT - A4_MARGIN * 2) / embedded.height,
        1,
      );
      const width = embedded.width * scale;
      const height = embedded.height * scale;
      page.drawImage(embedded, {
        x: (A4_WIDTH - width) / 2,
        y: (A4_HEIGHT - height) / 2,
        width,
        height,
      });
    }
  }
  return doc.save();
}

/** 出力画像の連番ファイル名（例: doc_01.png）。桁数は総ページ数に合わせる */
export function imageFileName(
  base: string,
  pageNumber: number,
  totalPages: number,
  ext: 'png' | 'jpg',
): string {
  const width = String(totalPages).length;
  return `${base}_${String(pageNumber).padStart(width, '0')}.${ext}`;
}

/** 1ページのレンダリング倍率（1 = 72dpi）から出力ピクセル数を求める */
export function outputSize(
  pageWidthPt: number,
  pageHeightPt: number,
  scale: number,
): { width: number; height: number } {
  return {
    width: Math.max(1, Math.round(pageWidthPt * scale)),
    height: Math.max(1, Math.round(pageHeightPt * scale)),
  };
}

/** Canvas の面積上限（ブラウザにより異なるが、iOS Safari など多くで超えると描画に失敗する）を超えないよう倍率を下げる */
export const MAX_CANVAS_PIXELS = 16_000_000;

export function clampScale(
  pageWidthPt: number,
  pageHeightPt: number,
  scale: number,
): number {
  const area = pageWidthPt * pageHeightPt * scale * scale;
  return area > MAX_CANVAS_PIXELS
    ? Math.sqrt(MAX_CANVAS_PIXELS / (pageWidthPt * pageHeightPt))
    : scale;
}
