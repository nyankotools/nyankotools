import type { OutputFormat, Size } from './image-padding';
import { outputFormat } from './image-padding';

/** 行数・列数それぞれの上限 */
export const MAX_LINES = 20;
/** 分割数（行×列）の上限。ZIPにまとめるためメモリを抑える */
export const MAX_TILES = 100;

export interface Tile {
  row: number;
  col: number;
  x: number;
  y: number;
  width: number;
  height: number;
}

/** 行数・列数を 1〜MAX_LINES の整数にそろえる。数でなければ 1 */
export function clampLines(value: number): number {
  if (!Number.isFinite(value)) return 1;
  return Math.min(Math.max(Math.round(value), 1), MAX_LINES);
}

/** 分割数が上限内で、1タイルが1px以上になるか */
export function isValidGrid(size: Size, rows: number, cols: number): boolean {
  return (
    rows >= 1 &&
    cols >= 1 &&
    rows * cols <= MAX_TILES &&
    cols <= size.width &&
    rows <= size.height
  );
}

/**
 * 画像を rows × cols に分割したタイルの位置と大きさを返す（行ごとに左から右）。
 * 割り切れない分は端数を各タイルに散らし、隙間や重なりが出ないようにする。
 */
export function computeTiles(size: Size, rows: number, cols: number): Tile[] {
  if (!isValidGrid(size, rows, cols)) return [];
  const tiles: Tile[] = [];
  for (let row = 0; row < rows; row++) {
    const y0 = Math.round((row * size.height) / rows);
    const y1 = Math.round(((row + 1) * size.height) / rows);
    for (let col = 0; col < cols; col++) {
      const x0 = Math.round((col * size.width) / cols);
      const x1 = Math.round(((col + 1) * size.width) / cols);
      tiles.push({
        row,
        col,
        x: x0,
        y: y0,
        width: x1 - x0,
        height: y1 - y0,
      });
    }
  }
  return tiles;
}

/**
 * タイルの通し番号（1始まり）。reverse が true のときは右下を1番にする。
 * Instagramは最後に投稿した画像が左上に並ぶため、その順に投稿するための番号。
 */
export function tileNumber(
  tile: Pick<Tile, 'row' | 'col'>,
  rows: number,
  cols: number,
  reverse: boolean,
): number {
  const index = tile.row * cols + tile.col;
  return reverse ? rows * cols - index : index + 1;
}

function baseOf(sourceName: string | null): string {
  const base = (sourceName ?? '').replace(/\.[^./\\]*$/, '').trim();
  return (base || 'image').replace(/[\\/:*?"<>|]/g, '');
}

/** 各タイルのファイル名。番号の桁数は分割数にそろえてゼロ埋めする（例: photo_03.png） */
export function tileFileName(
  sourceName: string | null,
  number: number,
  total: number,
  format: OutputFormat,
): string {
  const digits = String(total).length;
  const num = String(number).padStart(digits, '0');
  return `${baseOf(sourceName) || 'image'}_${num}.${outputFormat(format).ext}`;
}

/** ZIPのファイル名 */
export function splitZipName(
  sourceName: string | null,
  rows: number,
  cols: number,
): string {
  return `${baseOf(sourceName) || 'image'}-${cols}x${rows}.zip`;
}
