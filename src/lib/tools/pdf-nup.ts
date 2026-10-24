// pdf-lib は大きいため、PDFを実際に処理するまで読み込まない（ページ初期表示のJSを小さく保つ）
import type { PDFEmbeddedPage } from 'pdf-lib';
import { load, PdfToolError } from './pdf-merge-split';

/** 1枚に載せるページ数 */
export const PER_SHEET_OPTIONS = [2, 4, 6, 8, 9] as const;
export type PerSheet = (typeof PER_SHEET_OPTIONS)[number];

/** 用紙サイズ（縦向きの pt 単位、幅×高さ） */
export const SHEET_SIZES = {
  a4: [595.28, 841.89],
  a3: [841.89, 1190.55],
  b5: [498.9, 708.66],
  b4: [708.66, 1000.63],
  letter: [612, 792],
} as const;
export type SheetSize = keyof typeof SHEET_SIZES;
export const SHEET_SIZE_IDS = Object.keys(SHEET_SIZES) as SheetSize[];

export type NupOrientation = 'auto' | 'portrait' | 'landscape';
/** row: 左→右、上→下 / column: 上→下、左→右 */
export type NupOrder = 'row' | 'column';

export interface NupOptions {
  perSheet: PerSheet;
  sheetSize: SheetSize;
  orientation: NupOrientation;
  order: NupOrder;
  /** 用紙の端からの余白（pt） */
  margin: number;
  /** ページ同士の間隔（pt） */
  gap: number;
  /** 各ページの外周に枠線を描く */
  border: boolean;
}

export interface NupCell {
  /** 左下原点 */
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface NupLayout {
  sheetWidth: number;
  sheetHeight: number;
  cols: number;
  rows: number;
  /** order に沿った並び順（index 0 が1ページ目の位置） */
  cells: NupCell[];
}

/** 横向きにしたときの列×行 */
const GRID: Record<PerSheet, [number, number]> = {
  2: [2, 1],
  4: [2, 2],
  6: [3, 2],
  8: [4, 2],
  9: [3, 3],
};

/** 最終的な用紙の向き。auto は、横に並べる配置（2・6・8枚）なら横向き */
export function resolveOrientation(
  perSheet: PerSheet,
  orientation: NupOrientation,
): 'portrait' | 'landscape' {
  if (orientation !== 'auto') return orientation;
  const [c, r] = GRID[perSheet];
  return c > r ? 'landscape' : 'portrait';
}

function validate(o: NupOptions) {
  if (
    !(PER_SHEET_OPTIONS as readonly number[]).includes(o.perSheet) ||
    !(o.sheetSize in SHEET_SIZES) ||
    !['auto', 'portrait', 'landscape'].includes(o.orientation) ||
    !['row', 'column'].includes(o.order) ||
    !Number.isFinite(o.margin) ||
    o.margin < 0 ||
    o.margin > 100 ||
    !Number.isFinite(o.gap) ||
    o.gap < 0 ||
    o.gap > 100
  ) {
    throw new PdfToolError('badOption');
  }
}

/** 用紙1枚あたりのセル配置を計算する */
export function computeLayout(o: NupOptions): NupLayout {
  validate(o);
  const [pw, ph] = SHEET_SIZES[o.sheetSize];
  const landscape =
    resolveOrientation(o.perSheet, o.orientation) === 'landscape';
  const sheetWidth = landscape ? ph : pw;
  const sheetHeight = landscape ? pw : ph;
  const [gc, gr] = GRID[o.perSheet];
  // 横向きは列が多く、縦向きは行が多い配置にする
  const cols = landscape ? Math.max(gc, gr) : Math.min(gc, gr);
  const rows = landscape ? Math.min(gc, gr) : Math.max(gc, gr);
  const cellW = (sheetWidth - o.margin * 2 - o.gap * (cols - 1)) / cols;
  const cellH = (sheetHeight - o.margin * 2 - o.gap * (rows - 1)) / rows;
  if (!(cellW > 1 && cellH > 1)) throw new PdfToolError('badOption');
  const cells: NupCell[] = [];
  for (let i = 0; i < cols * rows; i++) {
    const col = o.order === 'row' ? i % cols : Math.floor(i / rows);
    const row = o.order === 'row' ? Math.floor(i / cols) : i % rows;
    cells.push({
      x: o.margin + col * (cellW + o.gap),
      // row 0 が上
      y: sheetHeight - o.margin - (row + 1) * cellH - row * o.gap,
      width: cellW,
      height: cellH,
    });
  }
  return { sheetWidth, sheetHeight, cols, rows, cells };
}

/** 用紙の枚数 */
export function sheetCount(pageCount: number, perSheet: number): number {
  return Math.ceil(pageCount / perSheet);
}

/**
 * 幅 w・高さ h のコンテンツを、セルに縦横比を保って収めたときの
 * 倍率と、セル内で中央に置いた左下座標を返す
 */
export function fitInCell(
  cell: NupCell,
  w: number,
  h: number,
): { scale: number; x: number; y: number; width: number; height: number } {
  const scale = Math.min(cell.width / w, cell.height / h);
  const width = w * scale;
  const height = h * scale;
  return {
    scale,
    x: cell.x + (cell.width - width) / 2,
    y: cell.y + (cell.height - height) / 2,
    width,
    height,
  };
}

export interface PageRect {
  x: number;
  y: number;
  width: number;
  height: number;
}

/**
 * ページの有効な矩形。CropBox（なければ MediaBox）を、MediaBox との交差に丸めて返す。
 * 交差が空（不正な CropBox）なら MediaBox を使う
 */
export function effectiveBox(crop: PageRect, media: PageRect): PageRect {
  const left = Math.max(crop.x, media.x);
  const bottom = Math.max(crop.y, media.y);
  const right = Math.min(crop.x + crop.width, media.x + media.width);
  const top = Math.min(crop.y + crop.height, media.y + media.height);
  if (!(right - left > 0 && top - bottom > 0)) return media;
  return { x: left, y: bottom, width: right - left, height: top - bottom };
}

/** 複数ページを1枚にまとめた新しいPDFを返す。元のPDFは変更しない */
export async function nupPdf(
  bytes: Uint8Array,
  options: NupOptions,
): Promise<Uint8Array> {
  const layout = computeLayout(options);
  const src = await load(bytes);
  const total = src.getPageCount();
  if (total === 0) throw new PdfToolError('invalid');

  const { PDFDocument, degrees, grayscale } = await import('pdf-lib');
  const out = await PDFDocument.create();
  const srcPages = src.getPages();
  // 内容（Contents）の無い白紙ページは pdf-lib が埋め込めないため、描画を省き枠だけ置く
  const withContent = srcPages
    .map((p, i) => (p.node.Contents() ? i : -1))
    .filter((i) => i >= 0);
  // 各ページの表示範囲（CropBox。なければ MediaBox）
  const boxes = srcPages.map((p) =>
    effectiveBox(p.getCropBox(), p.getMediaBox()),
  );
  const embeddedByIndex = new Map<number, PDFEmbeddedPage>();
  if (withContent.length > 0) {
    try {
      const list = await out.embedPages(
        withContent.map((i) => srcPages[i]),
        withContent.map((i) => ({
          left: boxes[i].x,
          bottom: boxes[i].y,
          right: boxes[i].x + boxes[i].width,
          top: boxes[i].y + boxes[i].height,
        })),
      );
      withContent.forEach((srcIndex, n) => {
        embeddedByIndex.set(srcIndex, list[n]);
      });
    } catch {
      throw new PdfToolError('invalid');
    }
  }

  for (let start = 0; start < total; start += options.perSheet) {
    const sheet = out.addPage([layout.sheetWidth, layout.sheetHeight]);
    for (let k = 0; k < options.perSheet && start + k < total; k++) {
      const idx = start + k;
      const cell = layout.cells[k];
      const e = embeddedByIndex.get(idx);
      const box = boxes[idx];
      const w = e ? e.width : box.width;
      const h = e ? e.height : box.height;
      const rotation = (((srcPages[idx].getRotation().angle % 360) + 360) %
        360) as number;
      const swap = rotation === 90 || rotation === 270;
      // 見た目の寸法（回転を反映）
      const vw = swap ? h : w;
      const vh = swap ? w : h;
      if (!(vw > 0 && vh > 0)) continue;
      const fit = fitInCell(cell, vw, vh);
      const cw = w * fit.scale;
      const ch = h * fit.scale;
      let x = fit.x;
      let y = fit.y;
      // 時計回りの回転は、描画の反時計回り角 -rotation で表し、原点を補正する
      if (rotation === 90) y += cw;
      else if (rotation === 180) {
        x += cw;
        y += ch;
      } else if (rotation === 270) x += ch;
      if (e) {
        sheet.drawPage(e, {
          x,
          y,
          width: cw,
          height: ch,
          rotate: degrees(-rotation),
        });
      }
      if (options.border) {
        sheet.drawRectangle({
          x: fit.x,
          y: fit.y,
          width: fit.width,
          height: fit.height,
          borderColor: grayscale(0.4),
          borderWidth: 0.5,
        });
      }
    }
  }
  return out.save();
}

/** 出力ファイル名（例: doc.pdf → doc_nup.pdf） */
export function nupFileName(name: string): string {
  const base = name.replace(/\.pdf$/i, '') || 'document';
  return `${base}_nup.pdf`;
}
