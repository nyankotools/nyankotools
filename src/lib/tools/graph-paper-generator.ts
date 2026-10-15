/** 用紙サイズ（縦向きの幅×高さ, mm） */
export const PAPER_SIZES = {
  a3: [297, 420],
  a4: [210, 297],
  a5: [148, 210],
  b4: [257, 364],
  b5: [182, 257],
  letter: [215.9, 279.4],
} as const;

export type PaperId = keyof typeof PAPER_SIZES;
export const PAPER_IDS = Object.keys(PAPER_SIZES) as PaperId[];

/** grid=方眼, ruled=罫線, dot=ドット方眼, manuscript=原稿用紙（外枠つきのマス目） */
export type SheetType = 'grid' | 'ruled' | 'dot' | 'manuscript';
export const SHEET_TYPES: SheetType[] = ['grid', 'ruled', 'dot', 'manuscript'];

export type Orientation = 'portrait' | 'landscape';

export const CELL_MIN = 2;
export const CELL_MAX = 50;
export const MARGIN_MIN = 0;
export const MARGIN_MAX = 40;
export const LINE_WIDTH_MIN = 0.05;
export const LINE_WIDTH_MAX = 1;

export interface SheetOptions {
  paper: PaperId;
  orientation: Orientation;
  type: SheetType;
  /** マス・行間の寸法（mm） */
  cellMm: number;
  /** 用紙の四辺の余白（mm） */
  marginMm: number;
  /** 線の太さ（mm） */
  lineWidthMm: number;
  /** #rrggbb */
  color: string;
}

export const DEFAULT_OPTIONS: SheetOptions = {
  paper: 'a4',
  orientation: 'portrait',
  type: 'grid',
  cellMm: 5,
  marginMm: 10,
  lineWidthMm: 0.15,
  color: '#9ca3af',
};

export type OptionsError = 'cell' | 'margin' | 'lineWidth' | 'color';

export interface Sheet {
  widthMm: number;
  heightMm: number;
  /** 線を引く範囲の左上（mm） */
  originX: number;
  originY: number;
  columns: number;
  rows: number;
}

export function paperDimensions(
  paper: PaperId,
  orientation: Orientation,
): { widthMm: number; heightMm: number } {
  const [w, h] = PAPER_SIZES[paper];
  return orientation === 'landscape'
    ? { widthMm: h, heightMm: w }
    : { widthMm: w, heightMm: h };
}

const inRange = (v: number, min: number, max: number) =>
  Number.isFinite(v) && v >= min && v <= max;

export function validateOptions(o: SheetOptions): OptionsError | null {
  if (!inRange(o.cellMm, CELL_MIN, CELL_MAX)) return 'cell';
  if (!inRange(o.marginMm, MARGIN_MIN, MARGIN_MAX)) return 'margin';
  if (!inRange(o.lineWidthMm, LINE_WIDTH_MIN, LINE_WIDTH_MAX))
    return 'lineWidth';
  if (!/^#[0-9a-fA-F]{6}$/.test(o.color)) return 'color';
  // 最小の用紙（A5 横の短辺148mm）でも、余白40mm＋マス50mmは収まる
  return null;
}

/** 余白の内側に収まる整数個のマスを、中央寄せで配置する（検証済みの入力が前提） */
export function layoutSheet(o: SheetOptions): Sheet {
  const { widthMm, heightMm } = paperDimensions(o.paper, o.orientation);
  const usableW = widthMm - o.marginMm * 2;
  const usableH = heightMm - o.marginMm * 2;
  // 浮動小数点の誤差（例: 190 / 5 = 37.99999…）で1マス減らないよう微小量を足す
  const columns = Math.floor(usableW / o.cellMm + 1e-9);
  const rows = Math.floor(usableH / o.cellMm + 1e-9);
  const gridW = columns * o.cellMm;
  const gridH = rows * o.cellMm;
  return {
    widthMm,
    heightMm,
    originX: round((widthMm - gridW) / 2),
    originY: round((heightMm - gridH) / 2),
    columns,
    rows,
  };
}

function round(n: number): number {
  return Math.round(n * 1000) / 1000;
}

/** 線の座標を path の d 属性にまとめる（1本の path にして SVG を小さく保つ） */
function linesPath(
  sheet: Sheet,
  cellMm: number,
  type: SheetType,
): { d: string; dots: [number, number][] } {
  const { originX: x0, originY: y0, columns, rows } = sheet;
  const x1 = round(x0 + columns * cellMm);
  const y1 = round(y0 + rows * cellMm);
  const parts: string[] = [];
  const dots: [number, number][] = [];

  if (type === 'ruled') {
    for (let r = 0; r <= rows; r++) {
      const y = round(y0 + r * cellMm);
      parts.push(`M${x0} ${y}H${x1}`);
    }
  } else if (type === 'dot') {
    for (let r = 0; r <= rows; r++) {
      for (let c = 0; c <= columns; c++) {
        dots.push([round(x0 + c * cellMm), round(y0 + r * cellMm)]);
      }
    }
  } else {
    for (let r = 0; r <= rows; r++) {
      const y = round(y0 + r * cellMm);
      parts.push(`M${x0} ${y}H${x1}`);
    }
    for (let c = 0; c <= columns; c++) {
      const x = round(x0 + c * cellMm);
      parts.push(`M${x} ${y0}V${y1}`);
    }
  }
  return { d: parts.join(''), dots };
}

/** 用紙1枚分の SVG 文字列を作る。SVG の単位は mm（viewBox = 用紙サイズ）。 */
export function buildSvg(o: SheetOptions): string {
  const sheet = layoutSheet(o);
  const { widthMm: w, heightMm: h } = sheet;
  const { d, dots } = linesPath(sheet, o.cellMm, o.type);
  const stroke = `stroke="${o.color}" stroke-width="${o.lineWidthMm}" fill="none"`;
  const body: string[] = [`<rect width="${w}" height="${h}" fill="#ffffff"/>`];

  if (o.type === 'dot') {
    const r = round(Math.max(o.lineWidthMm * 1.5, 0.15));
    const circles = dots
      .map(([x, y]) => `<circle cx="${x}" cy="${y}" r="${r}"/>`)
      .join('');
    body.push(`<g fill="${o.color}">${circles}</g>`);
  } else if (o.type === 'manuscript') {
    // 内側のマス線は細く、外枠は2倍の太さにして原稿用紙らしくする
    body.push(`<path d="${d}" ${stroke}/>`);
    const bw = round(sheet.columns * o.cellMm);
    const bh = round(sheet.rows * o.cellMm);
    body.push(
      `<rect x="${sheet.originX}" y="${sheet.originY}" width="${bw}" height="${bh}" stroke="${o.color}" stroke-width="${round(o.lineWidthMm * 2)}" fill="none"/>`,
    );
  } else {
    body.push(`<path d="${d}" ${stroke}/>`);
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}mm" height="${h}mm">${body.join('')}</svg>`;
}
