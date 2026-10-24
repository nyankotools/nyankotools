// pdf-lib は pdf-merge-split の load() が動的 import するため、PDFを処理するまで読み込まれない
import { displaySize, normalizeRotation } from './pdf-crop';
import { load, parsePageRange, PdfToolError } from './pdf-merge-split';

/** スタンプ（署名・印影）画像のエラー。PDF自体のエラーは PdfToolError */
export type StampErrorCode = 'badImage' | 'noTarget';

export class PdfStampError extends Error {
  code: StampErrorCode;
  constructor(code: StampErrorCode) {
    super(code);
    this.code = code;
  }
}

/**
 * スタンプの配置。ページを表示したときの左上を原点とし、ページ幅・高さを 1 とした正規化座標。
 * x / y は画像の左上、w は画像の幅（ページ幅に対する比）。高さは画像の縦横比から決まる。
 */
export interface StampPlacement {
  x: number;
  y: number;
  w: number;
}

export type ImageType = 'png' | 'jpeg';

export type StampTargetMode = 'all' | 'current' | 'range';

/** 画像の幅の下限（ページ幅に対する比） */
export const MIN_STAMP_WIDTH = 0.03;

export const DEFAULT_PLACEMENT: StampPlacement = { x: 0.55, y: 0.75, w: 0.25 };

function finite(v: number, fallback: number): number {
  return Number.isFinite(v) ? v : fallback;
}

function clamp(v: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, v));
}

/** ファイルの先頭バイトから PNG / JPEG を判定する。どちらでもなければ null */
export function detectImageType(bytes: Uint8Array): ImageType | null {
  if (
    bytes.length >= 8 &&
    bytes[0] === 0x89 &&
    bytes[1] === 0x50 &&
    bytes[2] === 0x4e &&
    bytes[3] === 0x47 &&
    bytes[4] === 0x0d &&
    bytes[5] === 0x0a &&
    bytes[6] === 0x1a &&
    bytes[7] === 0x0a
  )
    return 'png';
  if (
    bytes.length >= 3 &&
    bytes[0] === 0xff &&
    bytes[1] === 0xd8 &&
    bytes[2] === 0xff
  )
    return 'jpeg';
  return null;
}

/** 画像の高さ（ページ高さに対する比）。aspect は 幅 / 高さ */
export function placementHeight(
  w: number,
  aspect: number,
  pageWidth: number,
  pageHeight: number,
): number {
  if (!(aspect > 0) || !(pageHeight > 0)) return 0;
  return (w * pageWidth) / aspect / pageHeight;
}

/** 配置をページ内に収める。幅は MIN_STAMP_WIDTH 以上、高さがページを超える場合は縮める */
export function clampPlacement(
  p: StampPlacement,
  aspect: number,
  pageWidth: number,
  pageHeight: number,
): StampPlacement {
  let w = clamp(finite(p.w, DEFAULT_PLACEMENT.w), MIN_STAMP_WIDTH, 1);
  let h = placementHeight(w, aspect, pageWidth, pageHeight);
  if (h > 1) {
    w = Math.max(MIN_STAMP_WIDTH, w / h);
    h = placementHeight(w, aspect, pageWidth, pageHeight);
  }
  return {
    w,
    x: clamp(finite(p.x, 0), 0, Math.max(0, 1 - w)),
    y: clamp(finite(p.y, 0), 0, Math.max(0, 1 - h)),
  };
}

/** 画像の中心を保ったまま幅を変える */
export function resizeAround(
  p: StampPlacement,
  newWidth: number,
  aspect: number,
  pageWidth: number,
  pageHeight: number,
): StampPlacement {
  const h = placementHeight(p.w, aspect, pageWidth, pageHeight);
  const cx = p.x + p.w / 2;
  const cy = p.y + h / 2;
  const w = clamp(finite(newWidth, p.w), MIN_STAMP_WIDTH, 1);
  const nh = placementHeight(w, aspect, pageWidth, pageHeight);
  return clampPlacement(
    { x: cx - w / 2, y: cy - nh / 2, w },
    aspect,
    pageWidth,
    pageHeight,
  );
}

export interface DisplayRect {
  left: number;
  top: number;
  width: number;
  height: number;
}

/** 配置を、表示上のページ（pt）での矩形にする。左上原点 */
export function placementToRect(
  p: StampPlacement,
  aspect: number,
  pageWidth: number,
  pageHeight: number,
): DisplayRect {
  const c = clampPlacement(p, aspect, pageWidth, pageHeight);
  return {
    left: c.x * pageWidth,
    top: c.y * pageHeight,
    width: c.w * pageWidth,
    height: placementHeight(c.w, aspect, pageWidth, pageHeight) * pageHeight,
  };
}

/**
 * 表示上の点（左上原点・下向きが正）を、回転前のページ内座標（左下原点・上向きが正）にする。
 * W / H は回転前のボックスの幅・高さ、rotation はページの /Rotate。
 */
export function displayToPdf(
  u: number,
  v: number,
  W: number,
  H: number,
  rotation: number,
): { x: number; y: number } {
  switch (normalizeRotation(rotation)) {
    case 90:
      return { x: v, y: u };
    case 180:
      return { x: W - u, y: v };
    case 270:
      return { x: W - v, y: H - u };
    default:
      return { x: u, y: H - v };
  }
}

export interface PdfImagePlacement {
  x: number;
  y: number;
  width: number;
  height: number;
  /** 反時計回りの角度（度） */
  angle: number;
}

/** 表示上の矩形を、pdf-lib の drawImage に渡す位置・大きさ・角度にする。box は CropBox（なければ MediaBox） */
export function rectToPdfImage(
  rect: DisplayRect,
  box: { x: number; y: number; width: number; height: number },
  rotation: number,
): PdfImagePlacement {
  const r = normalizeRotation(rotation);
  // 画像の左下（表示上）を基点に描く
  const origin = displayToPdf(
    rect.left,
    rect.top + rect.height,
    box.width,
    box.height,
    r,
  );
  return {
    x: box.x + origin.x,
    y: box.y + origin.y,
    width: rect.width,
    height: rect.height,
    angle: r,
  };
}

/** スタンプを押すページ（0始まり・昇順・重複なし）を求める。range は "1-3, 5" 形式 */
export function resolveTargetPages(
  mode: StampTargetMode,
  spec: string,
  current: number,
  pageCount: number,
): number[] {
  if (mode === 'all') return Array.from({ length: pageCount }, (_, i) => i);
  if (mode === 'current') {
    if (!Number.isInteger(current) || current < 0 || current >= pageCount)
      throw new PdfToolError('outOfRange');
    return [current];
  }
  const list = parsePageRange(spec, pageCount);
  return [...new Set(list)].sort((a, b) => a - b);
}

export interface StampOptions {
  /** 不透明度 0〜1。既定 1 */
  opacity?: number;
}

/** 指定ページに画像を重ねた新しいPDFを返す。元の内容は変更されない（上に重ねるだけ） */
export async function buildStampedPdf(
  pdfBytes: Uint8Array,
  image: { bytes: Uint8Array; type: ImageType },
  placement: StampPlacement,
  pageIndices: number[],
  options: StampOptions = {},
): Promise<Uint8Array> {
  if (pageIndices.length === 0) throw new PdfStampError('noTarget');
  const doc = await load(pdfBytes);
  const { degrees } = await import('pdf-lib');
  const pages = doc.getPages();
  for (const i of pageIndices) {
    if (!Number.isInteger(i) || i < 0 || i >= pages.length)
      throw new PdfToolError('outOfRange');
  }
  let embedded: Awaited<ReturnType<typeof doc.embedPng>>;
  try {
    embedded =
      image.type === 'png'
        ? await doc.embedPng(image.bytes)
        : await doc.embedJpg(image.bytes);
  } catch {
    throw new PdfStampError('badImage');
  }
  if (!(embedded.width > 0) || !(embedded.height > 0))
    throw new PdfStampError('badImage');
  const aspect = embedded.width / embedded.height;
  const opacity = clamp(finite(options.opacity ?? 1, 1), 0, 1);
  for (const i of [...new Set(pageIndices)]) {
    const page = pages[i];
    const box = page.getCropBox();
    const rotation = page.getRotation().angle;
    const size = displaySize(box.width, box.height, rotation);
    const rect = placementToRect(placement, aspect, size.width, size.height);
    const d = rectToPdfImage(rect, box, rotation);
    page.drawImage(embedded, {
      x: d.x,
      y: d.y,
      width: d.width,
      height: d.height,
      rotate: degrees(d.angle),
      opacity,
    });
  }
  return doc.save();
}

/** 出力ファイル名（例: doc.pdf → doc_stamped.pdf） */
export function stampedFileName(name: string): string {
  const base = name.replace(/\.pdf$/i, '') || 'document';
  return `${base}_stamped.pdf`;
}
