import { secureRandomInt } from '../random';
import type { RandomInt } from '../random';

export type { RandomInt };

export const MIN_SIZE = 5;
export const MAX_SIZE = 50;
export const DEFAULT_SIZE = 15;

export const DIFFICULTIES = ['easy', 'normal', 'hard'] as const;
export type Difficulty = (typeof DIFFICULTIES)[number];
export const DEFAULT_DIFFICULTY: Difficulty = 'normal';

/** 通路の向きを表すビット（セルの open に OR で格納する） */
export const NORTH = 1;
export const EAST = 2;
export const SOUTH = 4;
export const WEST = 8;

export interface Maze {
  width: number;
  height: number;
  /** セル (x, y) は index = y * width + x。各要素は通路が開いている向きのビット和 */
  open: number[];
}

/** 壁の線分（セル単位の座標。(0,0) が左上の角） */
export type Segment = readonly [x1: number, y1: number, x2: number, y2: number];

/** 整数に丸めて MIN_SIZE〜MAX_SIZE に収める。数値でなければ既定値を返す */
export function clampSize(value: number): number {
  if (!Number.isFinite(value)) return DEFAULT_SIZE;
  return Math.min(MAX_SIZE, Math.max(MIN_SIZE, Math.round(value)));
}

const DX: Record<number, number> = {
  [NORTH]: 0,
  [EAST]: 1,
  [SOUTH]: 0,
  [WEST]: -1,
};
const DY: Record<number, number> = {
  [NORTH]: -1,
  [EAST]: 0,
  [SOUTH]: 1,
  [WEST]: 0,
};
const OPPOSITE: Record<number, number> = {
  [NORTH]: SOUTH,
  [EAST]: WEST,
  [SOUTH]: NORTH,
  [WEST]: EAST,
};
const DIRS = [NORTH, EAST, SOUTH, WEST] as const;

function neighbor(
  width: number,
  height: number,
  index: number,
  dir: number,
): number {
  const x = (index % width) + DX[dir];
  const y = Math.floor(index / width) + DY[dir];
  if (x < 0 || y < 0 || x >= width || y >= height) return -1;
  return y * width + x;
}

function carve(open: number[], from: number, to: number, dir: number): void {
  open[from] |= dir;
  open[to] |= OPPOSITE[dir];
}

function pick<T>(items: readonly T[], randomInt: RandomInt): T {
  return items[randomInt(items.length)];
}

/** 再帰バックトラッカー（深さ優先）。長くうねる通路になり、難しい */
function generateBacktracker(
  width: number,
  height: number,
  open: number[],
  randomInt: RandomInt,
): void {
  const visited = new Array<boolean>(width * height).fill(false);
  const stack = [0];
  visited[0] = true;
  while (stack.length > 0) {
    const current = stack[stack.length - 1];
    const options: [number, number][] = [];
    for (const dir of DIRS) {
      const next = neighbor(width, height, current, dir);
      if (next >= 0 && !visited[next]) options.push([dir, next]);
    }
    if (options.length === 0) {
      stack.pop();
      continue;
    }
    const [dir, next] = pick(options, randomInt);
    carve(open, current, next, dir);
    visited[next] = true;
    stack.push(next);
  }
}

/** ランダム化したプリム法。短い枝分かれが多く、標準的な難しさになる */
function generatePrim(
  width: number,
  height: number,
  open: number[],
  randomInt: RandomInt,
): void {
  const inMaze = new Array<boolean>(width * height).fill(false);
  // 迷路に入っているセルと、まだ入っていない隣のセルを結ぶ壁
  const frontier: [number, number, number][] = [];
  const addFrontier = (cell: number) => {
    for (const dir of DIRS) {
      const next = neighbor(width, height, cell, dir);
      if (next >= 0 && !inMaze[next]) frontier.push([cell, dir, next]);
    }
  };
  inMaze[0] = true;
  addFrontier(0);
  while (frontier.length > 0) {
    const i = randomInt(frontier.length);
    const [from, dir, to] = frontier[i];
    frontier[i] = frontier[frontier.length - 1];
    frontier.pop();
    if (inMaze[to]) continue;
    carve(open, from, to, dir);
    inMaze[to] = true;
    addFrontier(to);
  }
}

/**
 * バイナリツリー法。各セルは下か右のどちらかへだけ通路を開くため、
 * スタートからゴールへは下と右だけで進める（簡単）
 */
function generateBinaryTree(
  width: number,
  height: number,
  open: number[],
  randomInt: RandomInt,
): void {
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const index = y * width + x;
      const dirs: number[] = [];
      if (x < width - 1) dirs.push(EAST);
      if (y < height - 1) dirs.push(SOUTH);
      if (dirs.length === 0) continue;
      const dir = pick(dirs, randomInt);
      carve(open, index, neighbor(width, height, index, dir), dir);
    }
  }
}

/**
 * 迷路を生成する。どの2セルの間にもちょうど1本の道がある「完全迷路」で、
 * スタートは左上セルの上辺、ゴールは右下セルの下辺。
 */
export function generateMaze(
  width: number,
  height: number,
  difficulty: Difficulty = DEFAULT_DIFFICULTY,
  randomInt: RandomInt = secureRandomInt,
): Maze {
  const w = clampSize(width);
  const h = clampSize(height);
  const open = new Array<number>(w * h).fill(0);
  if (difficulty === 'easy') generateBinaryTree(w, h, open, randomInt);
  else if (difficulty === 'hard') generateBacktracker(w, h, open, randomInt);
  else generatePrim(w, h, open, randomInt);
  return { width: w, height: h, open };
}

/** スタート（左上）からゴール（右下）までのセル番号の並び（両端を含む） */
export function solveMaze(maze: Maze): number[] {
  const { width, height, open } = maze;
  const total = width * height;
  const goal = total - 1;
  const previous = new Array<number>(total).fill(-2);
  previous[0] = -1;
  const queue = [0];
  for (let head = 0; head < queue.length && previous[goal] === -2; head++) {
    const current = queue[head];
    for (const dir of DIRS) {
      if (!(open[current] & dir)) continue;
      const next = neighbor(width, height, current, dir);
      if (next < 0 || previous[next] !== -2) continue;
      previous[next] = current;
      queue.push(next);
    }
  }
  if (previous[goal] === -2) return [];
  const path: number[] = [];
  for (let cell = goal; cell !== -1; cell = previous[cell]) path.push(cell);
  return path.reverse();
}

/** 描画する壁の線分。スタートとゴールの外壁は開けてある */
export function wallSegments(maze: Maze): Segment[] {
  const { width, height, open } = maze;
  const segments: Segment[] = [];
  const goal = width * height - 1;
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const index = y * width + x;
      const cell = open[index];
      // 上と左は全セルで、下と右は外周のセルだけが描く（内側の壁は隣と共有）
      if (!(cell & NORTH) && index !== 0) segments.push([x, y, x + 1, y]);
      if (!(cell & WEST)) segments.push([x, y, x, y + 1]);
      if (y === height - 1 && index !== goal)
        segments.push([x, y + 1, x + 1, y + 1]);
      if (x === width - 1) segments.push([x + 1, y, x + 1, y + 1]);
    }
  }
  return segments;
}
