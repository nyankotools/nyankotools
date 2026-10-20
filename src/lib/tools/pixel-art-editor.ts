/** ドット絵エディタの純粋ロジック。ピクセルは不透明色を 0xFFRRGGBB の数値で持ち、0 は透明。 */

export const CANVAS_SIZES = [8, 16, 32, 48, 64] as const;
export const DEFAULT_CANVAS_SIZE = 16;
export const EXPORT_SCALES = [1, 2, 4, 8, 16, 32] as const;
export const DEFAULT_EXPORT_SCALE = 8;
export const MAX_EXPORT_PIXELS = 4096;
export const MAX_HISTORY = 100;

export type Tool = 'pen' | 'eraser' | 'fill' | 'picker';

export interface Grid {
  size: number;
  /** 長さ size*size。0 は透明、それ以外は 0xFF000000 | RGB */
  cells: Uint32Array;
}

export const DEFAULT_PALETTE: readonly string[] = [
  '#000000',
  '#ffffff',
  '#9d9d9d',
  '#be2633',
  '#e06f8b',
  '#a46422',
  '#eb8931',
  '#f7e26b',
  '#44891a',
  '#a3ce27',
  '#2f484e',
  '#1b2632',
  '#005784',
  '#31a2f2',
  '#b2dcef',
  '#493c2b',
];

export function createGrid(size: number): Grid {
  return { size, cells: new Uint32Array(size * size) };
}

export function cloneGrid(grid: Grid): Grid {
  return { size: grid.size, cells: new Uint32Array(grid.cells) };
}

export function inBounds(grid: Grid, x: number, y: number): boolean {
  return (
    Number.isInteger(x) &&
    Number.isInteger(y) &&
    x >= 0 &&
    y >= 0 &&
    x < grid.size &&
    y < grid.size
  );
}

/** "#rrggbb" / "#rgb" をパックした数値にする。不正なら null */
export function parseHexColor(hex: string): number | null {
  const m = /^#?([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(hex.trim());
  if (!m) return null;
  let h = m[1];
  if (h.length === 3) {
    h = h
      .split('')
      .map((c) => c + c)
      .join('');
  }
  const rgb = parseInt(h, 16);
  return (0xff000000 | rgb) >>> 0;
}

export function colorToHex(color: number): string {
  if (color === 0) return '';
  return '#' + (color & 0xffffff).toString(16).padStart(6, '0');
}

export function getPixel(grid: Grid, x: number, y: number): number {
  if (!inBounds(grid, x, y)) return 0;
  return grid.cells[y * grid.size + x];
}

/** 範囲内なら描画して true を返す */
export function setPixel(
  grid: Grid,
  x: number,
  y: number,
  color: number,
): boolean {
  if (!inBounds(grid, x, y)) return false;
  const i = y * grid.size + x;
  if (grid.cells[i] === color) return false;
  grid.cells[i] = color;
  return true;
}

/** 2点間のセル座標（ブレゼンハム）。端点を含む */
export function linePoints(
  x0: number,
  y0: number,
  x1: number,
  y1: number,
): Array<[number, number]> {
  const points: Array<[number, number]> = [];
  let x = x0;
  let y = y0;
  const dx = Math.abs(x1 - x0);
  const dy = -Math.abs(y1 - y0);
  const sx = x0 < x1 ? 1 : -1;
  const sy = y0 < y1 ? 1 : -1;
  let err = dx + dy;
  for (;;) {
    points.push([x, y]);
    if (x === x1 && y === y1) break;
    const e2 = 2 * err;
    if (e2 >= dy) {
      err += dy;
      x += sx;
    }
    if (e2 <= dx) {
      err += dx;
      y += sy;
    }
  }
  return points;
}

/** 線を描き、変更があったら true */
export function drawLine(
  grid: Grid,
  x0: number,
  y0: number,
  x1: number,
  y1: number,
  color: number,
): boolean {
  let changed = false;
  for (const [x, y] of linePoints(x0, y0, x1, y1)) {
    if (setPixel(grid, x, y, color)) changed = true;
  }
  return changed;
}

/** 4近傍の塗りつぶし。変更があったら true */
export function floodFill(
  grid: Grid,
  x: number,
  y: number,
  color: number,
): boolean {
  if (!inBounds(grid, x, y)) return false;
  const target = grid.cells[y * grid.size + x];
  if (target === color) return false;
  const stack: number[] = [y * grid.size + x];
  const size = grid.size;
  while (stack.length > 0) {
    const i = stack.pop()!;
    if (grid.cells[i] !== target) continue;
    grid.cells[i] = color;
    const cx = i % size;
    const cy = (i - cx) / size;
    if (cx > 0) stack.push(i - 1);
    if (cx < size - 1) stack.push(i + 1);
    if (cy > 0) stack.push(i - size);
    if (cy < size - 1) stack.push(i + size);
  }
  return true;
}

/** 左上を基準に重なる範囲を引き継いでサイズ変更する */
export function resizeGrid(grid: Grid, newSize: number): Grid {
  const next = createGrid(newSize);
  const n = Math.min(grid.size, newSize);
  for (let y = 0; y < n; y++) {
    for (let x = 0; x < n; x++) {
      next.cells[y * newSize + x] = grid.cells[y * grid.size + x];
    }
  }
  return next;
}

export function isEmpty(grid: Grid): boolean {
  return grid.cells.every((c) => c === 0);
}

export function gridsEqual(a: Grid, b: Grid): boolean {
  if (a.size !== b.size) return false;
  for (let i = 0; i < a.cells.length; i++) {
    if (a.cells[i] !== b.cells[i]) return false;
  }
  return true;
}

/** 拡大後の1辺のpx数 */
export function exportDimension(size: number, scale: number): number {
  return size * scale;
}

export function isExportSizeValid(size: number, scale: number): boolean {
  return (
    Number.isInteger(scale) &&
    scale >= 1 &&
    exportDimension(size, scale) <= MAX_EXPORT_PIXELS
  );
}

/** 拡大率を書き出し可能な範囲に収める（整数、最小1） */
export function clampScale(size: number, scale: number): number {
  const s = Number.isFinite(scale) ? Math.floor(scale) : 1;
  const max = Math.max(1, Math.floor(MAX_EXPORT_PIXELS / size));
  return Math.min(Math.max(1, s), max);
}

/**
 * 拡大後のRGBAバイト列（ニアレストネイバー）を作る。
 * 戻り値の長さは (size*scale)^2 * 4。
 */
export function renderRgba(grid: Grid, scale: number): Uint8Array {
  const dim = exportDimension(grid.size, scale);
  const out = new Uint8Array(dim * dim * 4);
  for (let y = 0; y < dim; y++) {
    const gy = Math.floor(y / scale);
    for (let x = 0; x < dim; x++) {
      const c = grid.cells[gy * grid.size + Math.floor(x / scale)];
      if (c === 0) continue;
      const o = (y * dim + x) * 4;
      out[o] = (c >>> 16) & 0xff;
      out[o + 1] = (c >>> 8) & 0xff;
      out[o + 2] = c & 0xff;
      out[o + 3] = 255;
    }
  }
  return out;
}

export function buildExportFileName(size: number, scale: number): string {
  return `pixel-art-${size}x${size}${scale > 1 ? `-x${scale}` : ''}.png`;
}

/** 履歴（Undo/Redo）。スナップショット方式 */
export class History {
  private past: Grid[] = [];
  private future: Grid[] = [];

  constructor(private readonly limit = MAX_HISTORY) {}

  /** 変更前の状態を積む。Redoは破棄される */
  push(before: Grid): void {
    this.past.push(cloneGrid(before));
    if (this.past.length > this.limit) this.past.shift();
    this.future = [];
  }

  canUndo(): boolean {
    return this.past.length > 0;
  }

  canRedo(): boolean {
    return this.future.length > 0;
  }

  undo(current: Grid): Grid | null {
    const prev = this.past.pop();
    if (!prev) return null;
    this.future.push(cloneGrid(current));
    return prev;
  }

  redo(current: Grid): Grid | null {
    const next = this.future.pop();
    if (!next) return null;
    this.past.push(cloneGrid(current));
    return next;
  }

  clear(): void {
    this.past = [];
    this.future = [];
  }
}
