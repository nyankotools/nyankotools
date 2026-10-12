import { secureRandomInt } from '../random';
import type { RandomInt } from '../random';

export type { RandomInt };

/** 盤面の大きさ（セル数）。キーは UI のボタンと対応する */
export const BOARD_SIZES = {
  small: { width: 30, height: 20 },
  medium: { width: 50, height: 30 },
  large: { width: 80, height: 50 },
} as const;
export type BoardSizeId = keyof typeof BOARD_SIZES;
export const BOARD_SIZE_IDS = ['small', 'medium', 'large'] as const;
export const DEFAULT_BOARD_SIZE: BoardSizeId = 'medium';

export const MIN_SPEED = 1;
export const MAX_SPEED = 30;
export const DEFAULT_SPEED = 8;

export const DEFAULT_DENSITY = 0.25;

export interface Grid {
  width: number;
  height: number;
  /** セル (x, y) は index = y * width + x。1 が生、0 が死 */
  cells: Uint8Array;
}

export function createGrid(width: number, height: number): Grid {
  return { width, height, cells: new Uint8Array(width * height) };
}

/** 速度（1秒あたりの世代数）を整数に丸めて範囲に収める。数値でなければ既定値 */
export function clampSpeed(value: number): number {
  if (!Number.isFinite(value)) return DEFAULT_SPEED;
  return Math.min(MAX_SPEED, Math.max(MIN_SPEED, Math.round(value)));
}

export function countAlive(grid: Grid): number {
  let count = 0;
  for (let i = 0; i < grid.cells.length; i++) count += grid.cells[i];
  return count;
}

/**
 * 1世代進めた新しい盤面を返す（元の盤面は変更しない）。
 * wrap が true なら上下左右がつながったトーラス、false なら盤面の外は常に死んだセルとして扱う。
 * ルールは標準の B3/S23（生きたセルは隣が2〜3で生存、死んだセルは隣がちょうど3で誕生）。
 */
export function stepGrid(grid: Grid, wrap: boolean): Grid {
  const { width, height, cells } = grid;
  const next = createGrid(width, height);
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      let neighbors = 0;
      for (let dy = -1; dy <= 1; dy++) {
        for (let dx = -1; dx <= 1; dx++) {
          if (dx === 0 && dy === 0) continue;
          let nx = x + dx;
          let ny = y + dy;
          if (wrap) {
            nx = (nx + width) % width;
            ny = (ny + height) % height;
          } else if (nx < 0 || ny < 0 || nx >= width || ny >= height) {
            continue;
          }
          neighbors += cells[ny * width + nx];
        }
      }
      const alive = cells[y * width + x] === 1;
      next.cells[y * width + x] =
        neighbors === 3 || (alive && neighbors === 2) ? 1 : 0;
    }
  }
  return next;
}

/** 2つの盤面が同じ状態か */
export function gridsEqual(a: Grid, b: Grid): boolean {
  if (a.width !== b.width || a.height !== b.height) return false;
  for (let i = 0; i < a.cells.length; i++) {
    if (a.cells[i] !== b.cells[i]) return false;
  }
  return true;
}

/** セルの生死を設定する。盤面の外なら何もせず false を返す */
export function setCell(
  grid: Grid,
  x: number,
  y: number,
  alive: boolean,
): boolean {
  if (!Number.isInteger(x) || !Number.isInteger(y)) return false;
  if (x < 0 || y < 0 || x >= grid.width || y >= grid.height) return false;
  grid.cells[y * grid.width + x] = alive ? 1 : 0;
  return true;
}

export function getCell(grid: Grid, x: number, y: number): boolean {
  if (x < 0 || y < 0 || x >= grid.width || y >= grid.height) return false;
  return grid.cells[y * grid.width + x] === 1;
}

/** 密度 density（0〜1）で各セルをランダムに生かした盤面を作る */
export function randomGrid(
  width: number,
  height: number,
  density: number = DEFAULT_DENSITY,
  randomInt: RandomInt = secureRandomInt,
): Grid {
  const grid = createGrid(width, height);
  const threshold = Math.round(Math.min(1, Math.max(0, density)) * 1000);
  for (let i = 0; i < grid.cells.length; i++) {
    grid.cells[i] = randomInt(1000) < threshold ? 1 : 0;
  }
  return grid;
}

/** プリセットパターン。'O' が生きたセル、それ以外は死んだセル */
export const PATTERNS = {
  glider: ['.O.', '..O', 'OOO'],
  blinker: ['OOO'],
  toad: ['.OOO', 'OOO.'],
  beacon: ['OO..', 'OO..', '..OO', '..OO'],
  pulsar: [
    '..OOO...OOO..',
    '.............',
    'O....O.O....O',
    'O....O.O....O',
    'O....O.O....O',
    '..OOO...OOO..',
    '.............',
    '..OOO...OOO..',
    'O....O.O....O',
    'O....O.O....O',
    'O....O.O....O',
    '.............',
    '..OOO...OOO..',
  ],
  rpentomino: ['.OO', 'OO.', '.O.'],
  acorn: ['.O.....', '...O...', 'OO..OOO'],
  lwss: ['.O..O', 'O....', 'O...O', 'OOOO.'],
  gosperGun: [
    '........................O...........',
    '......................O.O...........',
    '............OO......OO............OO',
    '...........O...O....OO............OO',
    'OO........O.....O...OO..............',
    'OO........O...O.OO....O.O...........',
    '..........O.....O.......O...........',
    '...........O...O....................',
    '............OO......................',
  ],
} as const;
export type PatternId = keyof typeof PATTERNS;
export const PATTERN_IDS = Object.keys(PATTERNS) as PatternId[];

/** パターンの大きさ（セル数） */
export function patternSize(id: PatternId): {
  width: number;
  height: number;
} {
  const rows: readonly string[] = PATTERNS[id];
  return {
    width: Math.max(...rows.map((row) => row.length)),
    height: rows.length,
  };
}

/** パターンが盤面にはみ出さず置けるか */
export function patternFits(
  id: PatternId,
  width: number,
  height: number,
): boolean {
  const size = patternSize(id);
  return size.width <= width && size.height <= height;
}

/**
 * 盤面を空にして、パターンを中央に置いた新しい盤面を返す。
 * 盤面より大きいパターンははみ出した部分が切り捨てられる。
 */
export function gridWithPattern(
  width: number,
  height: number,
  id: PatternId,
): Grid {
  const grid = createGrid(width, height);
  const rows: readonly string[] = PATTERNS[id];
  const size = patternSize(id);
  const offsetX = Math.floor((width - size.width) / 2);
  const offsetY = Math.floor((height - size.height) / 2);
  rows.forEach((row, y) => {
    for (let x = 0; x < row.length; x++) {
      if (row[x] === 'O') setCell(grid, offsetX + x, offsetY + y, true);
    }
  });
  return grid;
}
