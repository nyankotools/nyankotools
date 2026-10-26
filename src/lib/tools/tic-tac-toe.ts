import { secureRandomInt } from '../random';
import type { RandomInt } from '../random';

export type { RandomInt };

export const SIZE = 3;
export const CELLS = SIZE * SIZE;

/** 0: 空き、1: 先手（×）、2: 後手（○）。index = row * 3 + col */
export type Mark = 0 | 1 | 2;
export type Player = 1 | 2;
export type Board = readonly Mark[];

export const LEVELS = ['easy', 'normal', 'hard'] as const;
export type Level = (typeof LEVELS)[number];
export const DEFAULT_LEVEL: Level = 'normal';

export const LINES: readonly (readonly [number, number, number])[] = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

export function opponent(player: Player): Player {
  return player === 1 ? 2 : 1;
}

export function emptyBoard(): Board {
  return new Array<Mark>(CELLS).fill(0);
}

export function legalMoves(board: Board): number[] {
  const moves: number[] = [];
  for (let i = 0; i < CELLS; i++) {
    if (board[i] === 0) moves.push(i);
  }
  return moves;
}

export function isFull(board: Board): boolean {
  return legalMoves(board).length === 0;
}

/** 3つ揃ったライン（なければ null） */
export function findWinLine(board: Board): number[] | null {
  for (const [a, b, c] of LINES) {
    if (board[a] !== 0 && board[a] === board[b] && board[b] === board[c]) {
      return [a, b, c];
    }
  }
  return null;
}

export interface GameState {
  board: Board;
  /** 次に打つ側。終局後は最後に打った側のまま */
  turn: Player;
  /** 直前に置いたマス（開始時は -1） */
  lastMove: number;
  winner: Player | null;
  line: number[];
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

/** 現在の手番で index に置く。置けないマス・終局後は同じ state を返す */
export function playMove(state: GameState, index: number): GameState {
  if (state.over) return state;
  if (!Number.isInteger(index) || index < 0 || index >= CELLS) return state;
  if (state.board[index] !== 0) return state;
  const board = state.board.slice();
  board[index] = state.turn;
  const line = findWinLine(board);
  if (line) {
    return {
      board,
      turn: state.turn,
      lastMove: index,
      winner: state.turn,
      line,
      over: true,
    };
  }
  if (isFull(board)) {
    return {
      board,
      turn: state.turn,
      lastMove: index,
      winner: null,
      line: [],
      over: true,
    };
  }
  return {
    board,
    turn: opponent(state.turn),
    lastMove: index,
    winner: null,
    line: [],
    over: false,
  };
}

/** player が次に打つ局面の最善値（勝ち 1 / 引き分け 0 / 負け -1 を、早い勝ち・遅い負けほど大きく） */
function minimax(
  board: Board,
  player: Player,
  me: Player,
  depth: number,
): number {
  const line = findWinLine(board);
  if (line) {
    return board[line[0]] === me ? 10 - depth : depth - 10;
  }
  const moves = legalMoves(board);
  if (moves.length === 0) return 0;
  const maximizing = player === me;
  let best = maximizing ? -Infinity : Infinity;
  for (const m of moves) {
    const next = board.slice();
    next[m] = player;
    const score = minimax(next, opponent(player), me, depth + 1);
    best = maximizing ? Math.max(best, score) : Math.min(best, score);
  }
  return best;
}

/** player が次に1手で勝てるマス */
function winningMoves(board: Board, player: Player): number[] {
  return legalMoves(board).filter((m) => {
    const next = board.slice();
    next[m] = player;
    return findWinLine(next) !== null;
  });
}

/**
 * AI が置くマスを選ぶ。置けるマスがなければ -1。
 * easy: ランダム / normal: 勝てるなら勝ち、負けそうなら防ぎ、他はランダム / hard: 全探索（最善手の中からランダム）
 */
export function chooseMove(
  board: Board,
  player: Player,
  level: Level,
  randomInt: RandomInt = secureRandomInt,
): number {
  const moves = legalMoves(board);
  if (moves.length === 0) return -1;
  if (level === 'easy') return moves[randomInt(moves.length)];
  if (level === 'normal') {
    const win = winningMoves(board, player);
    if (win.length > 0) return win[randomInt(win.length)];
    const block = winningMoves(board, opponent(player));
    if (block.length > 0) return block[randomInt(block.length)];
    return moves[randomInt(moves.length)];
  }
  let bestScore = -Infinity;
  let best: number[] = [];
  for (const m of moves) {
    const next = board.slice();
    next[m] = player;
    const score = minimax(next, opponent(player), player, 1);
    if (score > bestScore) {
      bestScore = score;
      best = [m];
    } else if (score === bestScore) {
      best.push(m);
    }
  }
  return best[randomInt(best.length)];
}
