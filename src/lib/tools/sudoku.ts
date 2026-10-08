/** 数独（ナンプレ）のソルバー・問題生成・検証・ヒント。盤面は長さ81の配列で、0が空きマス。 */

export type Grid = number[];
export type Difficulty = 'easy' | 'normal' | 'hard';
export type Rng = () => number;

export const SIZE = 9;
export const CELLS = 81;
export const DIFFICULTIES: readonly Difficulty[] = ['easy', 'normal', 'hard'];

/** 難易度ごとの目標ヒント数（初期配置の数）。少ないほど難しい */
export const TARGET_CLUES: Record<Difficulty, number> = {
  easy: 40,
  normal: 32,
  hard: 26,
};

const ALL = 0x3fe; // 1〜9のビット

export function rowOf(index: number): number {
  return Math.floor(index / SIZE);
}

export function colOf(index: number): number {
  return index % SIZE;
}

export function boxOf(index: number): number {
  return Math.floor(rowOf(index) / 3) * 3 + Math.floor(colOf(index) / 3);
}

/** 同じ行・列・ブロックにあるマス（自分自身を除く） */
export function peersOf(index: number): number[] {
  const r = rowOf(index);
  const c = colOf(index);
  const b = boxOf(index);
  const out: number[] = [];
  for (let i = 0; i < CELLS; i++) {
    if (i === index) continue;
    if (rowOf(i) === r || colOf(i) === c || boxOf(i) === b) out.push(i);
  }
  return out;
}

export function emptyGrid(): Grid {
  return new Array<number>(CELLS).fill(0);
}

export function countClues(grid: Grid): number {
  return grid.filter((v) => v !== 0).length;
}

function popcount(mask: number): number {
  let n = 0;
  while (mask) {
    mask &= mask - 1;
    n++;
  }
  return n;
}

interface Masks {
  rows: number[];
  cols: number[];
  boxes: number[];
}

function buildMasks(grid: Grid): Masks | null {
  const rows = new Array<number>(SIZE).fill(0);
  const cols = new Array<number>(SIZE).fill(0);
  const boxes = new Array<number>(SIZE).fill(0);
  for (let i = 0; i < CELLS; i++) {
    const v = grid[i];
    if (!v) continue;
    const bit = 1 << v;
    const r = rowOf(i);
    const c = colOf(i);
    const b = boxOf(i);
    if (rows[r] & bit || cols[c] & bit || boxes[b] & bit) return null;
    rows[r] |= bit;
    cols[c] |= bit;
    boxes[b] |= bit;
  }
  return { rows, cols, boxes };
}

/**
 * 解を最大 limit 個まで数える。矛盾した盤面は0。
 * 最も候補の少ないマスから試す（MRV）ので、通常の問題は一瞬で終わる。
 * 見つかった最初の解は state.first に入る。rng があれば試す順をランダムにする。
 */
function search(
  grid: Grid,
  masks: Masks,
  limit: number,
  rng: Rng | null,
  state: { count: number; first: Grid | null },
): void {
  let best = -1;
  let bestMask = 0;
  let bestCount = 10;
  for (let i = 0; i < CELLS; i++) {
    if (grid[i]) continue;
    const used =
      masks.rows[rowOf(i)] | masks.cols[colOf(i)] | masks.boxes[boxOf(i)];
    const avail = ALL & ~used;
    const n = popcount(avail);
    if (n < bestCount) {
      best = i;
      bestMask = avail;
      bestCount = n;
      if (n <= 1) break;
    }
  }
  if (best === -1) {
    state.count++;
    state.first ??= grid.slice();
    return;
  }
  if (bestCount === 0) return;
  const values: number[] = [];
  for (let v = 1; v <= 9; v++) if (bestMask & (1 << v)) values.push(v);
  if (rng) shuffle(values, rng);
  const r = rowOf(best);
  const c = colOf(best);
  const b = boxOf(best);
  for (const v of values) {
    const bit = 1 << v;
    grid[best] = v;
    masks.rows[r] |= bit;
    masks.cols[c] |= bit;
    masks.boxes[b] |= bit;
    search(grid, masks, limit, rng, state);
    masks.rows[r] &= ~bit;
    masks.cols[c] &= ~bit;
    masks.boxes[b] &= ~bit;
    grid[best] = 0;
    if (state.count >= limit) return;
  }
}

/** 解の数を limit（既定2）まで数える。0=解なし/矛盾、1=唯一解 */
export function countSolutions(grid: Grid, limit = 2): number {
  if (grid.length !== CELLS) return 0;
  const work = grid.slice();
  const masks = buildMasks(work);
  if (!masks) return 0;
  const state = { count: 0, first: null as Grid | null };
  search(work, masks, limit, null, state);
  return state.count;
}

/** 解を1つ返す。解がなければ null */
export function solve(grid: Grid): Grid | null {
  if (grid.length !== CELLS) return null;
  const work = grid.slice();
  const masks = buildMasks(work);
  if (!masks) return null;
  const state = { count: 0, first: null as Grid | null };
  search(work, masks, 1, null, state);
  return state.first;
}

export function shuffle<T>(items: T[], rng: Rng): T[] {
  for (let i = items.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [items[i], items[j]] = [items[j], items[i]];
  }
  return items;
}

/** 完成した盤面をランダムに作る */
export function generateSolved(rng: Rng = Math.random): Grid {
  const grid = emptyGrid();
  const masks = buildMasks(grid) as Masks;
  const state = { count: 0, first: null as Grid | null };
  search(grid, masks, 1, rng, state);
  return state.first as Grid;
}

export interface Puzzle {
  /** 初期配置（0=空き） */
  puzzle: Grid;
  /** 唯一の解 */
  solution: Grid;
}

/** 唯一解が保証された問題を作る。マスを1つずつ消し、解が複数になる消し方は戻す */
export function generatePuzzle(
  difficulty: Difficulty,
  rng: Rng = Math.random,
): Puzzle {
  const solution = generateSolved(rng);
  const puzzle = solution.slice();
  const target = TARGET_CLUES[difficulty];
  const order = shuffle(
    Array.from({ length: CELLS }, (_, i) => i),
    rng,
  );
  let clues = CELLS;
  for (const i of order) {
    if (clues <= target) break;
    const saved = puzzle[i];
    puzzle[i] = 0;
    if (countSolutions(puzzle, 2) !== 1) puzzle[i] = saved;
    else clues--;
  }
  return { puzzle, solution };
}

/** 同じ行・列・ブロックに同じ数字がある（重複している）マスの番号 */
export function findConflicts(grid: Grid): number[] {
  const out: number[] = [];
  for (let i = 0; i < CELLS; i++) {
    const v = grid[i];
    if (!v) continue;
    if (peersOf(i).some((p) => grid[p] === v)) out.push(i);
  }
  return out;
}

/** 全マスが埋まり、重複がない（＝正しく完成している） */
export function isSolved(grid: Grid): boolean {
  if (grid.length !== CELLS) return false;
  if (grid.some((v) => !Number.isInteger(v) || v < 1 || v > 9)) return false;
  return findConflicts(grid).length === 0;
}

/** 入力済みで、正解（solution）と異なるマス */
export function findMistakes(grid: Grid, solution: Grid): number[] {
  const out: number[] = [];
  for (let i = 0; i < CELLS; i++) {
    if (grid[i] && grid[i] !== solution[i]) out.push(i);
  }
  return out;
}

/** マスに入れられる候補（行・列・ブロックと重複しない数字） */
export function candidatesFor(grid: Grid, index: number): number[] {
  const used = new Set<number>();
  for (const p of peersOf(index)) if (grid[p]) used.add(grid[p]);
  const out: number[] = [];
  for (let v = 1; v <= 9; v++) if (!used.has(v)) out.push(v);
  return out;
}

export interface Hint {
  index: number;
  value: number;
  /** 候補がそのマスで1つだけ（人間が論理的に埋められる）か */
  forced: boolean;
}

/**
 * ヒントを1つ返す。候補が1つしかない空きマスを優先し、なければ候補が最も少ない空きマス。
 * selected が空きマスならそれを優先する。埋まっていれば null。
 */
export function getHint(
  grid: Grid,
  solution: Grid,
  selected: number | null = null,
): Hint | null {
  if (selected !== null && grid[selected] === 0) {
    return {
      index: selected,
      value: solution[selected],
      forced: candidatesFor(grid, selected).length === 1,
    };
  }
  let best = -1;
  let bestCount = 10;
  for (let i = 0; i < CELLS; i++) {
    if (grid[i]) continue;
    const n = candidatesFor(grid, i).length;
    if (n < bestCount) {
      best = i;
      bestCount = n;
      if (n === 1) break;
    }
  }
  if (best === -1) return null;
  return { index: best, value: solution[best], forced: bestCount === 1 };
}

/** 文字列(81文字、空きは0か.)から盤面を作る。不正なら null */
export function parseGrid(text: string): Grid | null {
  const chars = text.replace(/\s+/g, '');
  if (chars.length !== CELLS) return null;
  const grid: Grid = [];
  for (const ch of chars) {
    if (ch === '.' || ch === '0') grid.push(0);
    else if (ch >= '1' && ch <= '9') grid.push(Number(ch));
    else return null;
  }
  return grid;
}

export function formatGrid(grid: Grid): string {
  return grid.map((v) => (v === 0 ? '.' : String(v))).join('');
}
