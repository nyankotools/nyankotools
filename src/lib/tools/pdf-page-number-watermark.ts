import { degrees, PDFDocument, PDFPage, rgb, StandardFonts } from 'pdf-lib';
import { load, PdfToolError } from './pdf-merge-split';

export const PAGE_NUMBER_POSITIONS = [
  'bottom-center',
  'bottom-left',
  'bottom-right',
  'top-center',
  'top-left',
  'top-right',
] as const;
export type PageNumberPosition = (typeof PAGE_NUMBER_POSITIONS)[number];

/** 各成分 0〜255 */
export interface RgbColor {
  r: number;
  g: number;
  b: number;
}

export interface PageNumberOptions {
  position: PageNumberPosition;
  /** {n} が現在の番号、{total} が総ページ数。標準フォントで描けるASCII文字のみ */
  template: string;
  startNumber: number;
  fontSize: number;
  margin: number;
  color: RgbColor;
  skipFirstPage: boolean;
}

export interface WatermarkOptions {
  /** 透かし文字を描いた透過PNG（日本語も扱えるよう、文字は呼び出し側でラスタライズする） */
  png: Uint8Array;
  /** 画像幅 ÷ ページ幅（0.1〜1） */
  widthRatio: number;
  /** 0.02〜1 */
  opacity: number;
  /** 反時計回りの角度（度、-180〜180） */
  angle: number;
  /** true なら全面に敷き詰める */
  tiled: boolean;
}

export interface StampOptions {
  pageNumber: PageNumberOptions | null;
  watermark: WatermarkOptions | null;
}

/** 敷き詰めで1ページに描く透かしの上限（巨大な出力を防ぐ） */
const MAX_TILES_PER_PAGE = 600;

/** "#rrggbb" を RgbColor に変換する。不正なら null */
export function parseHexColor(hex: string): RgbColor | null {
  const m = /^#([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i.exec(hex.trim());
  if (!m) return null;
  return {
    r: parseInt(m[1], 16),
    g: parseInt(m[2], 16),
    b: parseInt(m[3], 16),
  };
}

/** テンプレートの {n} {total} を置換する */
export function formatPageNumber(
  template: string,
  n: number,
  total: number,
): string {
  return template
    .replace(/\{n\}/g, () => String(n))
    .replace(/\{total\}/g, () => String(total));
}

/** 標準フォント（Helvetica）で描ける印字可能ASCIIのみか */
export function isPrintableAscii(text: string): boolean {
  return /^[\x20-\x7e]*$/.test(text);
}

function validatePageNumber(o: PageNumberOptions) {
  if (!isPrintableAscii(o.template)) throw new PdfToolError('unsupportedChar');
  if (
    !(PAGE_NUMBER_POSITIONS as readonly string[]).includes(o.position) ||
    o.template.trim() === '' ||
    !Number.isInteger(o.startNumber) ||
    o.startNumber < 0 ||
    o.startNumber > 999999 ||
    !Number.isFinite(o.fontSize) ||
    o.fontSize < 6 ||
    o.fontSize > 72 ||
    !Number.isFinite(o.margin) ||
    o.margin < 0 ||
    o.margin > 200
  ) {
    throw new PdfToolError('badOption');
  }
}

function validateWatermark(o: WatermarkOptions) {
  if (
    o.png.length === 0 ||
    !(o.widthRatio >= 0.1 && o.widthRatio <= 1) ||
    !(o.opacity >= 0.02 && o.opacity <= 1) ||
    !(o.angle >= -180 && o.angle <= 180)
  ) {
    throw new PdfToolError('badOption');
  }
}

/** 回転済みページの「見た目」座標系（左下原点）と、素の座標系との対応 */
interface Geometry {
  rotation: number;
  /** MediaBox の原点と幅・高さ */
  x0: number;
  y0: number;
  mw: number;
  mh: number;
  /** 見た目の幅・高さ（90/270度回転なら縦横が入れ替わる） */
  vw: number;
  vh: number;
}

function geometry(page: PDFPage): Geometry {
  const box = page.getMediaBox();
  const rotation = (((page.getRotation().angle % 360) + 360) % 360) as number;
  const swap = rotation === 90 || rotation === 270;
  return {
    rotation,
    x0: box.x,
    y0: box.y,
    mw: box.width,
    mh: box.height,
    vw: swap ? box.height : box.width,
    vh: swap ? box.width : box.height,
  };
}

/** 見た目の座標 (vx, vy) を、ページの素の座標へ変換する */
function toPagePoint(g: Geometry, vx: number, vy: number) {
  let x: number;
  let y: number;
  switch (g.rotation) {
    case 90:
      x = g.mw - vy;
      y = vx;
      break;
    case 180:
      x = g.mw - vx;
      y = g.mh - vy;
      break;
    case 270:
      x = vy;
      y = g.mh - vx;
      break;
    default:
      x = vx;
      y = vy;
  }
  return { x: x + g.x0, y: y + g.y0 };
}

/** 透かしを置く見た目上の中心座標の一覧（敷き詰めなら千鳥格子） */
export function watermarkCenters(
  vw: number,
  vh: number,
  drawW: number,
  drawH: number,
  tiled: boolean,
): { x: number; y: number }[] {
  if (!tiled) return [{ x: vw / 2, y: vh / 2 }];
  const stepX = drawW * 1.5;
  const stepY = Math.max(drawH * 3, drawW * 0.5);
  const centers: { x: number; y: number }[] = [];
  let row = 0;
  for (let y = -drawH; y <= vh + drawH; y += stepY, row++) {
    const offset = row % 2 === 0 ? 0 : stepX / 2;
    for (let x = -drawW + offset; x <= vw + drawW; x += stepX) {
      centers.push({ x, y });
      if (centers.length > MAX_TILES_PER_PAGE) {
        throw new PdfToolError('badOption');
      }
    }
  }
  return centers;
}

/** ページ番号・透かしを重ねた新しいPDFを返す。元のページの内容・順序は変えない */
export async function stampPdf(
  bytes: Uint8Array,
  options: StampOptions,
): Promise<Uint8Array> {
  const { pageNumber, watermark } = options;
  if (!pageNumber && !watermark) throw new PdfToolError('noOperation');
  if (pageNumber) validatePageNumber(pageNumber);
  if (watermark) validateWatermark(watermark);

  const doc = await load(bytes);
  const pages = doc.getPages();
  const font = pageNumber
    ? await doc.embedFont(StandardFonts.Helvetica)
    : undefined;
  let image: Awaited<ReturnType<PDFDocument['embedPng']>> | undefined;
  if (watermark) {
    try {
      image = await doc.embedPng(watermark.png);
    } catch {
      throw new PdfToolError('badOption');
    }
  }

  const total = pages.length;
  pages.forEach((page, i) => {
    const g = geometry(page);
    if (watermark && image) {
      const drawW = g.vw * watermark.widthRatio;
      const drawH = (drawW * image.height) / image.width;
      const theta = (watermark.angle * Math.PI) / 180;
      const cos = Math.cos(theta);
      const sin = Math.sin(theta);
      for (const c of watermarkCenters(
        g.vw,
        g.vh,
        drawW,
        drawH,
        watermark.tiled,
      )) {
        // 回転は左下隅が基準なので、中心が c に来るよう原点を逆算する
        const vx = c.x - ((drawW / 2) * cos - (drawH / 2) * sin);
        const vy = c.y - ((drawW / 2) * sin + (drawH / 2) * cos);
        const p = toPagePoint(g, vx, vy);
        page.drawImage(image, {
          x: p.x,
          y: p.y,
          width: drawW,
          height: drawH,
          rotate: degrees(g.rotation + watermark.angle),
          opacity: watermark.opacity,
        });
      }
    }
    if (pageNumber && font && !(pageNumber.skipFirstPage && i === 0)) {
      const text = formatPageNumber(
        pageNumber.template,
        pageNumber.startNumber + i - (pageNumber.skipFirstPage ? 1 : 0),
        total,
      );
      const width = font.widthOfTextAtSize(text, pageNumber.fontSize);
      const [v, h] = pageNumber.position.split('-');
      const vx =
        h === 'left'
          ? pageNumber.margin
          : h === 'right'
            ? g.vw - pageNumber.margin - width
            : (g.vw - width) / 2;
      const vy =
        v === 'top'
          ? g.vh - pageNumber.margin - pageNumber.fontSize * 0.75
          : pageNumber.margin;
      const p = toPagePoint(g, vx, vy);
      page.drawText(text, {
        x: p.x,
        y: p.y,
        size: pageNumber.fontSize,
        font,
        color: rgb(
          pageNumber.color.r / 255,
          pageNumber.color.g / 255,
          pageNumber.color.b / 255,
        ),
        rotate: degrees(g.rotation),
      });
    }
  });
  return doc.save();
}

/** 出力ファイル名（例: doc.pdf → doc_stamped.pdf） */
export function stampedFileName(name: string): string {
  const base = name.replace(/\.pdf$/i, '') || 'document';
  return `${base}_stamped.pdf`;
}
