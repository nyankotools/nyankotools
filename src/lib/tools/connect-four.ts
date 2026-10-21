import { secureRandomInt } from '../random';
import type { RandomInt } from '../random';

export type { RandomInt };

export const COLS = 7;
export const ROWS = 6;
const CELLS = COLS * ROWS;

/** 0: 空き、1: 先手、2: 後手。index = row * COLS + col（row 0 が最上段） */
export type Disc = 0 | 1 | 2;
export type Player = 1 | 2;
export type Board = readonly Disc[];

export const LEVELS = ['easy', 'normal', 'hard'] as const;
export type Level = (typeof LEVELS)[number];
export const DEFAULT_LEVEL: Level = 'normal';

/** 先読みの手数（easy は読まずにランダムに打つ） */
const DEPTH: Record<Level, number> = {
  easy: 0,
  normal: 4,
  hard: 7,
};

/** 中央から外側へ（枝刈りが効きやすい） */
const COLUMN_ORDER = [3, 2, 4, 1, 5, 0, 6] as const;

export function opponent(player: Player): Player {
  return player === 1 ? 2 : 1;
}

export function emptyBoard(): Board {
  return new Array<Disc>(CELLS).fill(0);
}

/** 列に石を落としたときに止まる行。満杯・範囲外なら -1 */
export function dropRow(board: Board, col: number): number {
  if (!Number.isInteger(col) || col < 0 || col >= COLS) return -1;
  for (let row = ROWS - 1; row >= 0; row--) {
    if (board[row * COLS + col] === 0) return row;
  }
  return -1;
}

export function legalColumns(board: Board): number[] {
  const cols: number[] = [];
  for (let c = 0; c < COLS; c++) {
    if (dropRow(board, c) >= 0) cols.push(c);
  }
  return cols;
}

export function isFull(board: Board): boolean {
  return legalColumns(board).length === 0;
}

/** 石を落とした新しい盤面と置いた位置。落とせない列なら null */
export function applyDrop(
  board: Board,
  col: number,
  player: Player,
): { board: Board; index: number } | null {
  const row = dropRow(board, col);
  if (row < 0) return null;
  const index = row * COLS + col;
  const next = board.slice();
  next[index] = player;
  return { board: next, index };
}

const DIRS: readonly (readonly [number, number])[] = [
  [0, 1],
  [1, 0],
  [1, 1],
  [1, -1],
];

/** index の石を含む4つ以上の連なり（なければ null）。連なり全体の位置を返す */
export function winLineAt(board: Board, index: number): number[] | null {
  const player = board[index];
  if (!player) return null;
  const row = Math.floor(index / COLS);
  const col = index % COLS;
  for (const [dr, dc] of DIRS) {
    const line = [index];
    for (const sign of [1, -1]) {
      let r = row + dr * sign;
      let c = col + dc * sign;
      while (
        r >= 0 &&
        r < ROWS &&
        c >= 0 &&
        c < COLS &&
        board[r * COLS + c] === player
      ) {
        line.push(r * COLS + c);
        r += dr * sign;
        c += dc * sign;
      }
    }
    if (line.length >= 4) return line.sort((a, b) => a - b);
  }
  return null;
}

/** 盤面全体から勝ちラインを探す（なければ null） */
export function findWinLine(board: Board): number[] | null {
  for (let i = 0; i < CELLS; i++) {
    if (board[i] !== 0) {
      const line = winLineAt(board, i);
      if (line) return line;
    }
  }
  return null;
}

export interface GameState {
  board: Board;
  /** 次に打つ側。終局後は最後に打った側のまま */
  turn: Player;
  /** 直前に置いた位置（開始時は -1） */
  lastMove: number;
  winner: Player | null;
  /** 勝ちが決まったときの連なり */
  line: number[];
  /** 勝敗が付いたか、盤面が埋まって引き分け */
  over: boolean;
}

export function newGame(): GameState {
  return {
    board: emptyBoard(),
    turn: 1,
    lastMove: -1,
    winner: null,
    line: [],
    over: false,
  };
}

/** 現在の手番で col に落とす。落とせない列・終局後は同じ state を返す */
export function playMove(state: GameState, col: number): GameState {
  if (state.over) return state;
  const dropped = applyDrop(state.board, col, state.turn);
  if (!dropped) return state;
  const line = winLineAt(dropped.board, dropped.index);
  if (line) {
    return {
      board: dropped.board,
      turn: state.turn,
      lastMove: dropped.index,
      winner: state.turn,
      line,
      over: true,
    };
  }
  if (isFull(dropped.board)) {
    return {
      board: dropped.board,
      turn: state.turn,
      lastMove: dropped.index,
      winner: null,
      line: [],
      over: true,
    };
  }
  return {
    board: dropped.board,
    turn: opponent(state.turn),
    lastMove: dropped.index,
    winner: null,
    line: [],
    over: false,
  };
}

// 4マスの窓（横・縦・斜め）
const WINDOWS: number[][] = (() => {
  const windows: number[][] = [];
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      for (const [dr, dc] of DIRS) {
        const er = r + dr * 3;
        const ec = c + dc * 3;
        if (er < 0 || er >= ROWS || ec < 0 || ec >= COLS) continue;
        windows.push([0, 1, 2, 3].map((k) => (r + dr * k) * COLS + c + dc * k));
      }
    }
  }
  return windows;
})();

const WIN_SCORE = 100000;
const INF = 1_000_000;

/** player から見た評価値（3連・2連の窓と中央列の石） */
function evaluate(board: Board, player: Player): number {
  const other = opponent(player);
  let score = 0;
  for (let r = 0; r < ROWS; r++) {
    const d = board[r * COLS + 3];
    if (d === player) score += 3;
    else if (d === other) score -= 3;
  }
  for (const w of WINDOWS) {
    let mine = 0;
    let theirs = 0;
    for (const i of w) {
      if (board[i] === player) mine++;
      else if (board[i] === other) theirs++;
    }
    if (mine > 0 && theirs > 0) continue;
    if (mine === 3) score += 5;
    else if (mine === 2) score += 2;
    if (theirs === 3) score -= 5;
    else if (theirs === 2) score -= 2;
  }
  return score;
}

/** player が次に打つ局面の評価。lastIndex は直前（相手）が置いた位置 */
function negamax(
  board: Board,
  player: Player,
  depth: number,
  alpha: number,
  beta: number,
  lastIndex: number,
): number {
  if (lastIndex >= 0 && winLineAt(board, lastIndex)) {
    // 直前の手で相手が勝った（早く勝つほど、遅く負けるほど良い）
    return -(WIN_SCORE + depth);
  }
  const cols = COLUMN_ORDER.filter((c) => dropRow(board, c) >= 0);
  if (cols.length === 0) return 0;
  if (depth === 0) return evaluate(board, player);
  let best = -INF;
  for (const col of cols) {
    const dropped = applyDrop(board, col, player) as {
      board: Board;
      index: number;
    };
    const score = -negamax(
      dropped.board,
      opponent(player),
      depth - 1,
      -beta,
      -alpha,
      dropped.index,
    );
    if (score > best) best = score;
    if (best > alpha) alpha = best;
    if (alpha >= beta) break;
  }
  return best;
}

/**
 * AI が落とす列を選ぶ。落とせる列がなければ -1。
 * 同じ評価の手が複数あるときは randomInt で選ぶ（毎回同じ展開にならない）。
 */
export function chooseMove(
  board: Board,
  player: Player,
  level: Level,
  randomInt: RandomInt = secureRandomInt,
): number {
  const cols = COLUMN_ORDER.filter((c) => dropRow(board, c) >= 0);
  if (cols.length === 0) return -1;
  const depth = DEPTH[level];
  if (depth === 0) return cols[randomInt(cols.length)];
  let bestScore = -INF;
  let best: number[] = [];
  for (const col of cols) {
    const dropped = applyDrop(board, col, player) as {
      board: Board;
      index: number;
    };
    // 現在の最善より1つ下を下限にして、同点の手も正確な値で拾う
    const score = -negamax(
      dropped.board,
      opponent(player),
      depth - 1,
      -INF,
      -(bestScore - 1),
      dropped.index,
    );
    if (score > bestScore) {
      bestScore = score;
      best = [col];
    } else if (score === bestScore) {
      best.push(col);
    }
  }
  return best[randomInt(best.length)];
}
