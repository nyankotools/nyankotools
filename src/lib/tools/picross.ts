import { secureRandomInt } from '../random';
import type { RandomInt } from '../random';

export type { RandomInt };

/** 盤面の大きさ（正方形）。キーは UI のボタンと対応する */
export const PUZZLE_SIZES = {
  small: 5,
  medium: 10,
  large: 15,
} as const;
export type PuzzleSizeId = keyof typeof PUZZLE_SIZES;
export const PUZZLE_SIZE_IDS = ['small', 'medium', 'large'] as const;
export const DEFAULT_PUZZLE_SIZE: PuzzleSizeId = 'medium';

/** 問題生成で、解が1通りになる絵を探す最大試行回数 */
const MAX_GENERATE_ATTEMPTS = 300;
/** 解の数え上げで探索するノード数の上限。メインスレッドで同期実行するため小さく抑える */
const NODE_BUDGET = 2000;

/** セルの状態。-1: 不明、0: 白、1: 黒 */
const UNKNOWN = -1;

export interface Solution {
  width: number;
  height: number;
  /** セル (x, y) は index = y * width + x。1 が黒 */
  cells: Uint8Array;
}

export interface Clues {
  rows: number[][];
  cols: number[][];
}

export type UniquenessResult =
  | 'unique'
  | 'multiple'
  | 'none'
  | 'empty'
  /** 探索の上限に達して判定できなかった */
  | 'unknown';

export function createSolution(width: number, height: number): Solution {
  return { width, height, cells: new Uint8Array(width * height) };
}

/** 1行（または1列）のヒント数字。黒が1つもなければ [0] */
export function lineClue(line: ArrayLike<number>): number[] {
  const clue: number[] = [];
  let run = 0;
  for (let i = 0; i < line.length; i++) {
    if (line[i] === 1) {
      run++;
    } else if (run > 0) {
      clue.push(run);
      run = 0;
    }
  }
  if (run > 0) clue.push(run);
  return clue.length > 0 ? clue : [0];
}

function extractRow(cells: ArrayLike<number>, width: number, y: number) {
  const row: number[] = [];
  for (let x = 0; x < width; x++) row.push(cells[y * width + x]);
  return row;
}

function extractCol(
  cells: ArrayLike<number>,
  width: number,
  height: number,
  x: number,
) {
  const col: number[] = [];
  for (let y = 0; y < height; y++) col.push(cells[y * width + x]);
  return col;
}

/** 絵（黒マスの配置）から、行・列のヒントを求める */
export function computeClues(solution: Solution): Clues {
  const { width, height, cells } = solution;
  const rows: number[][] = [];
  const cols: number[][] = [];
  for (let y = 0; y < height; y++) {
    rows.push(lineClue(extractRow(cells, width, y)));
  }
  for (let x = 0; x < width; x++) {
    cols.push(lineClue(extractCol(cells, width, height, x)));
  }
  return { rows, cols };
}

/** プレイヤーの盤面（1 が黒、それ以外は黒でない）が、すべてのヒントを満たしているか */
export function isSolved(
  clues: Clues,
  width: number,
  height: number,
  cells: ArrayLike<number>,
): boolean {
  for (let y = 0; y < height; y++) {
    const line = extractRow(cells, width, y);
    if (!clueEquals(lineClue(line), clues.rows[y])) return false;
  }
  for (let x = 0; x < width; x++) {
    const line = extractCol(cells, width, height, x);
    if (!clueEquals(lineClue(line), clues.cols[x])) return false;
  }
  return true;
}

export function clueEquals(a: number[], b: number[]): boolean {
  return a.length === b.length && a.every((v, i) => v === b[i]);
}

/**
 * 1本の線について、ヒントと既知のセルに矛盾しない並べ方すべての共通部分を返す。
 * line は -1（不明）/0（白）/1（黒）。矛盾する（並べ方が1つもない）場合は null。
 */
export function solveLine(clue: number[], line: number[]): number[] | null {
  const n = line.length;
  const blocks = clue.filter((v) => v > 0);
  const k = blocks.length;

  const memo = new Map<number, boolean>();
  const feasible = (i: number, j: number): boolean => {
    if (j === k) {
      for (let p = i; p < n; p++) if (line[p] === 1) return false;
      return true;
    }
    if (i >= n) return false;
    const key = i * (k + 1) + j;
    const cached = memo.get(key);
    if (cached !== undefined) return cached;
    let ok = false;
    if (line[i] !== 1 && feasible(i + 1, j)) ok = true;
    if (!ok && canPlace(i, blocks[j])) {
      ok = feasible(Math.min(i + blocks[j] + 1, n), j + 1);
    }
    memo.set(key, ok);
    return ok;
  };

  /** i から len マスの黒を置け、その直後が黒でないか */
  const canPlace = (i: number, len: number): boolean => {
    if (i + len > n) return false;
    for (let p = i; p < i + len; p++) if (line[p] === 0) return false;
    return i + len >= n || line[i + len] !== 1;
  };

  if (!feasible(0, 0)) return null;

  const canBeWhite = new Uint8Array(n);
  const canBeBlack = new Uint8Array(n);
  const visited = new Set<number>();
  const walk = (i: number, j: number) => {
    const key = i * (k + 1) + j;
    if (visited.has(key)) return;
    visited.add(key);
    if (j === k) {
      for (let p = i; p < n; p++) canBeWhite[p] = 1;
      return;
    }
    if (i >= n) return;
    if (line[i] !== 1 && feasible(i + 1, j)) {
      canBeWhite[i] = 1;
      walk(i + 1, j);
    }
    if (canPlace(i, blocks[j])) {
      const next = Math.min(i + blocks[j] + 1, n);
      if (feasible(next, j + 1)) {
        for (let p = i; p < i + blocks[j]; p++) canBeBlack[p] = 1;
        if (i + blocks[j] < n) canBeWhite[i + blocks[j]] = 1;
        walk(next, j + 1);
      }
    }
  };
  walk(0, 0);

  return line.map((value, p) => {
    if (value !== UNKNOWN) return value;
    if (canBeBlack[p] && !canBeWhite[p]) return 1;
    if (canBeWhite[p] && !canBeBlack[p]) return 0;
    return UNKNOWN;
  });
}

/**
 * 行と列のヒントだけで確定できるセルを、変化がなくなるまで埋める（cells を直接更新）。
 * 矛盾が見つかったら false を返す。
 */
function propagate(
  clues: Clues,
  width: number,
  height: number,
  cells: Int8Array,
): boolean {
  let changed = true;
  while (changed) {
    changed = false;
    for (let y = 0; y < height; y++) {
      const line = extractRow(cells, width, y);
      const solved = solveLine(clues.rows[y], line);
      if (!solved) return false;
      for (let x = 0; x < width; x++) {
        if (solved[x] !== line[x]) {
          cells[y * width + x] = solved[x];
          changed = true;
        }
      }
    }
    for (let x = 0; x < width; x++) {
      const line = extractCol(cells, width, height, x);
      const solved = solveLine(clues.cols[x], line);
      if (!solved) return false;
      for (let y = 0; y < height; y++) {
        if (solved[y] !== line[y]) {
          cells[y * width + x] = solved[y];
          changed = true;
        }
      }
    }
  }
  return true;
}

export interface SolveResult {
  /** 見つかった解の数（limit で打ち切る） */
  count: number;
  /** 最初に見つかった解（なければ null） */
  first: Solution | null;
  /** 探索の上限に達して打ち切ったか */
  exhausted: boolean;
}

/** ヒントを満たす絵を探し、limit 個まで数える（唯一解の判定は limit=2） */
export function solvePuzzle(
  clues: Clues,
  width: number,
  height: number,
  limit = 2,
): SolveResult {
  const result: SolveResult = { count: 0, first: null, exhausted: false };
  let nodes = 0;

  const search = (cells: Int8Array) => {
    if (result.count >= limit || result.exhausted) return;
    if (++nodes > NODE_BUDGET) {
      result.exhausted = true;
      return;
    }
    if (!propagate(clues, width, height, cells)) return;
    const unknown = cells.indexOf(UNKNOWN);
    if (unknown === -1) {
      result.count++;
      result.first ??= {
        width,
        height,
        cells: Uint8Array.from(cells, (v) => (v === 1 ? 1 : 0)),
      };
      return;
    }
    for (const value of [1, 0]) {
      const next = Int8Array.from(cells);
      next[unknown] = value;
      search(next);
    }
  };

  search(new Int8Array(width * height).fill(UNKNOWN));
  return result;
}

/** 絵から作る問題の解が1通りかどうか */
export function checkUniqueness(solution: Solution): UniquenessResult {
  if (!solution.cells.some((v) => v === 1)) return 'empty';
  const { width, height } = solution;
  const result = solvePuzzle(computeClues(solution), width, height, 2);
  if (result.count >= 2) return 'multiple';
  if (result.exhausted) return 'unknown';
  return result.count === 1 ? 'unique' : 'none';
}

/**
 * 解が1通りになるランダムな問題を作る。
 * 黒の割合を変えながら、唯一解になる絵が見つかるまで繰り返す。
 */
export function generatePuzzle(
  size: number,
  randomInt: RandomInt = secureRandomInt,
): Solution {
  let last = createSolution(size, size);
  for (let attempt = 0; attempt < MAX_GENERATE_ATTEMPTS; attempt++) {
    // 黒の割合は 50〜70%（唯一解になりやすく、絵として偏りすぎない範囲）
    const percent = 50 + randomInt(21);
    const candidate = createSolution(size, size);
    for (let i = 0; i < candidate.cells.length; i++) {
      candidate.cells[i] = randomInt(100) < percent ? 1 : 0;
    }
    last = candidate;
    if (checkUniqueness(candidate) === 'unique') return candidate;
  }
  return last;
}

/**
 * 画像の各画素の明るさ（0〜255、透明は白扱い済み）から、size×size の絵を作る。
 * 暗い画素（しきい値未満）を黒にする。pixels は size*size 個の明るさ。
 */
export function solutionFromBrightness(
  size: number,
  brightness: ArrayLike<number>,
  threshold = 128,
): Solution {
  const solution = createSolution(size, size);
  for (let i = 0; i < solution.cells.length; i++) {
    solution.cells[i] = brightness[i] < threshold ? 1 : 0;
  }
  return solution;
}
