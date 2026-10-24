import {
  isWithinSourceLimit,
  type OutputFormat,
  type Rect,
  type Size,
} from './image-cropper';

export type TemplateKind = 'row' | 'column' | 'grid' | 'main-left' | 'main-top';

/** 0〜1 に正規化した枠（キャンバス内側に対する割合） */
export interface FracRect {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface CollageTemplate {
  /** 同じ枚数の中で一意のID（表示名は辞書側で kind から引く） */
  id: string;
  kind: TemplateKind;
  cells: FracRect[];
}

export const MIN_IMAGES = 2;
export const MAX_IMAGES = 9;
export const MAX_GAP = 200;
export const MAX_BORDER = 50;
export const MAX_RADIUS = 300;
export const MIN_ZOOM = 1;
export const MAX_ZOOM = 4;

export const ASPECTS = ['1:1', '4:3', '3:4', '16:9', '9:16'] as const;
export type AspectId = (typeof ASPECTS)[number];
export const LONG_SIDES = [1200, 2000, 3000] as const;

const EPS = 1e-6;

const clamp = (v: number, min: number, max: number) =>
  Math.min(Math.max(Number.isFinite(v) ? v : min, min), max);
const clampInt = (v: number, min: number, max: number) =>
  Math.round(clamp(v, min, max));

function rowCells(n: number, y: number, height: number): FracRect[] {
  return Array.from({ length: n }, (_, i) => ({
    x: i / n,
    y,
    width: 1 / n,
    height,
  }));
}

function columnCells(n: number, x: number, width: number): FracRect[] {
  return Array.from({ length: n }, (_, i) => ({
    x,
    y: i / n,
    width,
    height: 1 / n,
  }));
}

function gridCells(n: number): FracRect[] {
  const cols = Math.ceil(Math.sqrt(n));
  const rows = Math.ceil(n / cols);
  const cells: FracRect[] = [];
  for (let r = 0; r < rows; r++) {
    // 最後の行が余るときは、その行の枠を横に広げて埋める
    const inRow = Math.min(cols, n - r * cols);
    for (let c = 0; c < inRow; c++) {
      cells.push({
        x: c / inRow,
        y: r / rows,
        width: 1 / inRow,
        height: 1 / rows,
      });
    }
  }
  return cells;
}

/** 枚数に合わせたテンプレート候補。同じ配置になるものは1つにまとめる */
export function templatesFor(count: number): CollageTemplate[] {
  const n = clampInt(count, 1, MAX_IMAGES);
  const full: FracRect = { x: 0, y: 0, width: 1, height: 1 };
  if (n === 1) return [{ id: 'grid', kind: 'grid', cells: [full] }];
  const candidates: CollageTemplate[] = [
    { id: 'row', kind: 'row', cells: rowCells(n, 0, 1) },
    { id: 'column', kind: 'column', cells: columnCells(n, 0, 1) },
    { id: 'grid', kind: 'grid', cells: gridCells(n) },
    {
      id: 'main-left',
      kind: 'main-left',
      cells: [
        { x: 0, y: 0, width: 0.6, height: 1 },
        ...columnCells(n - 1, 0.6, 0.4),
      ],
    },
    {
      id: 'main-top',
      kind: 'main-top',
      cells: [
        { x: 0, y: 0, width: 1, height: 0.6 },
        ...rowCells(n - 1, 0.6, 0.4),
      ],
    },
  ];
  const seen = new Set<string>();
  return candidates.filter((t) => {
    const key = JSON.stringify(
      t.cells.map((c) =>
        [c.x, c.y, c.width, c.height].map((v) => +v.toFixed(5)),
      ),
    );
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

/** キャンバスの大きさ（長辺を longSide にそろえる） */
export function canvasSize(aspect: AspectId, longSide: number): Size {
  const [aw, ah] = aspect.split(':').map(Number);
  const long = clampInt(longSide, 100, 8000);
  return aw >= ah
    ? { width: long, height: Math.max(1, Math.round((long * ah) / aw)) }
    : { width: Math.max(1, Math.round((long * aw) / ah)), height: long };
}

/**
 * 正規化した枠を、余白（margin）と枠どうしの間隔（gap）を反映したピクセルの矩形にする。
 * 間隔はキャンバスの端に接していない辺だけ、半分ずつ内側へ縮める。
 */
export function cellRects(
  fracs: FracRect[],
  canvas: Size,
  margin: number,
  gap: number,
): Rect[] {
  const m = clampInt(margin, 0, MAX_GAP);
  const g = clampInt(gap, 0, MAX_GAP);
  const innerW = Math.max(1, canvas.width - m * 2);
  const innerH = Math.max(1, canvas.height - m * 2);
  return fracs.map((f) => {
    const left =
      Math.round(m + f.x * innerW) + (f.x > EPS ? Math.round(g / 2) : 0);
    const top =
      Math.round(m + f.y * innerH) + (f.y > EPS ? Math.round(g / 2) : 0);
    const right =
      Math.round(m + (f.x + f.width) * innerW) -
      (f.x + f.width < 1 - EPS ? Math.round(g / 2) : 0);
    const bottom =
      Math.round(m + (f.y + f.height) * innerH) -
      (f.y + f.height < 1 - EPS ? Math.round(g / 2) : 0);
    return {
      x: left,
      y: top,
      width: Math.max(1, right - left),
      height: Math.max(1, bottom - top),
    };
  });
}

export interface CoverPlacement extends Rect {
  /** 枠からはみ出している量（0なら動かせない） */
  slackX: number;
  slackY: number;
}

/**
 * 画像を枠いっぱいに敷く（cover）ときの描画位置。
 * posX / posY は 0〜1（0.5 が中央）、zoom は 1 以上で拡大する。
 */
export function coverPlacement(
  image: Size,
  cell: Rect,
  zoom: number,
  posX: number,
  posY: number,
): CoverPlacement {
  const scale =
    Math.max(cell.width / image.width, cell.height / image.height) *
    clamp(zoom, MIN_ZOOM, MAX_ZOOM);
  const width = image.width * scale;
  const height = image.height * scale;
  const slackX = Math.max(0, width - cell.width);
  const slackY = Math.max(0, height - cell.height);
  return {
    x: cell.x - slackX * clamp(posX, 0, 1),
    y: cell.y - slackY * clamp(posY, 0, 1),
    width,
    height,
    slackX,
    slackY,
  };
}

/** ドラッグで画像を delta px 動かしたときの新しい位置（0〜1）。画像は指に追従する向き */
export function panPosition(pos: number, deltaPx: number, slack: number) {
  if (!(slack > 0)) return 0.5;
  return clamp(pos - deltaPx / slack, 0, 1);
}

/** 点 (x, y) が入っている枠の番号。どこにも入らなければ -1 */
export function hitCell(cells: Rect[], x: number, y: number): number {
  for (let i = cells.length - 1; i >= 0; i--) {
    const c = cells[i];
    if (x >= c.x && x < c.x + c.width && y >= c.y && y < c.y + c.height) {
      return i;
    }
  }
  return -1;
}

/** 出力サイズが書き出せる範囲か */
export function isCanvasWithinLimit(size: Size): boolean {
  return size.width > 0 && size.height > 0 && isWithinSourceLimit(size);
}

/** 配列の要素を1つ動かした新しい配列を返す。範囲外の移動は何もしない */
export function moveItem<T>(list: T[], from: number, to: number): T[] {
  if (from < 0 || from >= list.length || to < 0 || to >= list.length) {
    return [...list];
  }
  const next = [...list];
  const [item] = next.splice(from, 1);
  next.splice(to, 0, item);
  return next;
}

export function collageFileName(format: OutputFormat): string {
  return `collage.${format === 'jpeg' ? 'jpg' : format}`;
}
