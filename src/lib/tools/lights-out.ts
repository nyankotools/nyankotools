/** ライツアウト（消灯パズル）のロジック。盤面は行優先の boolean 配列（true = 点灯）。 */

export const SIZES = [3, 4, 5, 6, 7] as const;
export type LightsOutSize = (typeof SIZES)[number];
export const DEFAULT_SIZE: LightsOutSize = 5;

export type Board = boolean[];

export interface PuzzleState {
  size: number;
  /** 現在の盤面 */
  board: Board;
  /** 開始時の盤面（やり直し用） */
  initial: Board;
  moves: number;
}

/** 0以上1未満の乱数を返す関数 */
export type Rng = () => number;

/** 指定マスを押す。そのマスと上下左右のマスが反転した新しい盤面を返す。範囲外なら同じ配列を返す。 */
export function press(board: Board, size: number, index: number): Board {
  if (!Number.isInteger(index) || index < 0 || index >= size * size) {
    return board;
  }
  const next = board.slice();
  const r = Math.floor(index / size);
  const c = index % size;
  next[index] = !next[index];
  if (r > 0) next[index - size] = !next[index - size];
  if (r < size - 1) next[index + size] = !next[index + size];
  if (c > 0) next[index - 1] = !next[index - 1];
  if (c < size - 1) next[index + 1] = !next[index + 1];
  return next;
}

/** すべて消灯していれば true */
export function isSolved(board: Board): boolean {
  return board.every((v) => !v);
}

export function countLit(board: Board): number {
  return board.reduce((n, v) => n + (v ? 1 : 0), 0);
}

/**
 * 必ず解ける盤面を作る。全消灯の盤面から、ランダムに選んだマスを押して（＝解からの逆操作）シャッフルする。
 * 全消灯のまま（完成済み）にはならない。
 */
export function createBoard(size: number, rng: Rng = Math.random): Board {
  const total = size * size;
  for (let attempt = 0; attempt < 50; attempt++) {
    let board: Board = new Array<boolean>(total).fill(false);
    for (let i = 0; i < total; i++) {
      if (rng() < 0.5) board = press(board, size, i);
    }
    if (!isSolved(board)) return board;
  }
  // 乱数が偏って全消灯が続いた場合の保険（中央を1回押す）
  return press(new Array<boolean>(total).fill(false), size, total >> 1);
}

export function newGame(size: number, rng: Rng = Math.random): PuzzleState {
  const board = createBoard(size, rng);
  return { size, board, initial: board.slice(), moves: 0 };
}

/** 押して手数を増やす。完成済みや範囲外のときは同じ状態を返す。 */
export function applyPress(state: PuzzleState, index: number): PuzzleState {
  if (isSolved(state.board)) return state;
  if (!Number.isInteger(index) || index < 0 || index >= state.size ** 2) {
    return state;
  }
  return {
    ...state,
    board: press(state.board, state.size, index),
    moves: state.moves + 1,
  };
}

/** 開始時の盤面に戻す（手数は0） */
export function restart(state: PuzzleState): PuzzleState {
  return { ...state, board: state.initial.slice(), moves: 0 };
}

/**
 * GF(2) 上の連立方程式 A x = b を解く（A は「j を押すと i が反転する」行列）。
 * 解があれば、特殊解と零空間の基底を返す。解がなければ null。
 */
function solveLinear(
  board: Board,
  size: number,
): { particular: number[]; nullBasis: number[][] } | null {
  const n = size * size;
  // 拡大係数行列 [A | b]
  const m: number[][] = [];
  for (let i = 0; i < n; i++) {
    const row = new Array<number>(n + 1).fill(0);
    row[i] = 1;
    const r = Math.floor(i / size);
    const c = i % size;
    if (r > 0) row[i - size] = 1;
    if (r < size - 1) row[i + size] = 1;
    if (c > 0) row[i - 1] = 1;
    if (c < size - 1) row[i + 1] = 1;
    row[n] = board[i] ? 1 : 0;
    m.push(row);
  }
  const pivotCols: number[] = [];
  let rank = 0;
  for (let col = 0; col < n && rank < n; col++) {
    let pivot = -1;
    for (let r = rank; r < n; r++) {
      if (m[r][col] === 1) {
        pivot = r;
        break;
      }
    }
    if (pivot === -1) continue;
    [m[rank], m[pivot]] = [m[pivot], m[rank]];
    for (let r = 0; r < n; r++) {
      if (r !== rank && m[r][col] === 1) {
        for (let k = col; k <= n; k++) m[r][k] ^= m[rank][k];
      }
    }
    pivotCols.push(col);
    rank++;
  }
  for (let r = rank; r < n; r++) {
    if (m[r][n] === 1) return null;
  }
  const pivotSet = new Set(pivotCols);
  const freeCols: number[] = [];
  for (let c = 0; c < n; c++) if (!pivotSet.has(c)) freeCols.push(c);

  const particular = new Array<number>(n).fill(0);
  pivotCols.forEach((col, r) => {
    particular[col] = m[r][n];
  });
  const nullBasis = freeCols.map((f) => {
    const v = new Array<number>(n).fill(0);
    v[f] = 1;
    pivotCols.forEach((col, r) => {
      v[col] = m[r][f];
    });
    return v;
  });
  return { particular, nullBasis };
}

/**
 * 押すマスの最少の組み合わせ（マスのインデックス昇順）を返す。解けない盤面は null。
 * 零空間が大きい盤面（4×4 など）は全組み合わせを調べて最少手数の解を選ぶ。
 */
export function solve(board: Board, size: number): number[] | null {
  if (board.length !== size * size) return null;
  const sys = solveLinear(board, size);
  if (!sys) return null;
  const { particular, nullBasis } = sys;
  const k = nullBasis.length;
  let best: number[] = particular;
  let bestWeight = particular.reduce((a, b) => a + b, 0);
  for (let mask = 1; mask < 1 << k; mask++) {
    const x = particular.slice();
    for (let b = 0; b < k; b++) {
      if (mask & (1 << b)) {
        for (let i = 0; i < x.length; i++) x[i] ^= nullBasis[b][i];
      }
    }
    const w = x.reduce((a, c) => a + c, 0);
    if (w < bestWeight) {
      best = x;
      bestWeight = w;
    }
  }
  const result: number[] = [];
  best.forEach((v, i) => {
    if (v === 1) result.push(i);
  });
  return result;
}

/** ヒントとして次に押すマスを1つ返す。完成済み・解なしなら null。 */
export function hint(board: Board, size: number): number | null {
  const sol = solve(board, size);
  if (!sol || sol.length === 0) return null;
  return sol[0];
}

/** 盤面を文字列化（テスト・デバッグ用）。点灯 = "#"、消灯 = "." */
export function boardToString(board: Board, size: number): string {
  const rows: string[] = [];
  for (let r = 0; r < size; r++) {
    rows.push(
      board
        .slice(r * size, r * size + size)
        .map((v) => (v ? '#' : '.'))
        .join(''),
    );
  }
  return rows.join('\n');
}
