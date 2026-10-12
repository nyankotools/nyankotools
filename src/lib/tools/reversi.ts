import { secureRandomInt } from '../random';
import type { RandomInt } from '../random';

export type { RandomInt };

export const SIZE = 8;
const CELLS = SIZE * SIZE;

/** 0: 空き、1: 黒、2: 白 */
export type Disc = 0 | 1 | 2;
export type Player = 1 | 2;
export type Board = readonly Disc[];

export const LEVELS = ['easy', 'normal', 'hard', 'expert'] as const;
export type Level = (typeof LEVELS)[number];
export const DEFAULT_LEVEL: Level = 'normal';

/** 先読みの手数（easy は読まずにランダムに打つ） */
const DEPTH: Record<Level, number> = {
  easy: 0,
  normal: 2,
  hard: 4,
  expert: 6,
};

const DIRECTIONS: readonly (readonly [number, number])[] = [
  [-1, -1],
  [-1, 0],
  [-1, 1],
  [0, -1],
  [0, 1],
  [1, -1],
  [1, 0],
  [1, 1],
];

export function opponent(player: Player): Player {
  return player === 1 ? 2 : 1;
}

export function initialBoard(): Board {
  const board = new Array<Disc>(CELLS).fill(0);
  const mid = SIZE / 2;
  board[(mid - 1) * SIZE + (mid - 1)] = 2;
  board[(mid - 1) * SIZE + mid] = 1;
  board[mid * SIZE + (mid - 1)] = 1;
  board[mid * SIZE + mid] = 2;
  return board;
}

/** index に player が置いたときに裏返る石の位置。置けない（埋まっている・挟めない）なら空配列 */
export function flipsFor(
  board: Board,
  index: number,
  player: Player,
): number[] {
  if (!Number.isInteger(index) || index < 0 || index >= CELLS) return [];
  if (board[index] !== 0) return [];
  const row = Math.floor(index / SIZE);
  const col = index % SIZE;
  const other = opponent(player);
  const flips: number[] = [];
  for (const [dr, dc] of DIRECTIONS) {
    const line: number[] = [];
    let r = row + dr;
    let c = col + dc;
    while (r >= 0 && r < SIZE && c >= 0 && c < SIZE) {
      const i = r * SIZE + c;
      if (board[i] === other) {
        line.push(i);
      } else {
        if (board[i] === player) flips.push(...line);
        break;
      }
      r += dr;
      c += dc;
    }
  }
  return flips;
}

export function legalMoves(board: Board, player: Player): number[] {
  const moves: number[] = [];
  for (let i = 0; i < CELLS; i++) {
    if (board[i] === 0 && flipsFor(board, i, player).length > 0) moves.push(i);
  }
  return moves;
}

/** 石を置いて裏返した新しい盤面。置けない手なら null */
export function applyMove(
  board: Board,
  index: number,
  player: Player,
): Board | null {
  const flips = flipsFor(board, index, player);
  if (flips.length === 0) return null;
  const next = board.slice();
  next[index] = player;
  for (const i of flips) next[i] = player;
  return next;
}

export function countDiscs(board: Board): { black: number; white: number } {
  let black = 0;
  let white = 0;
  for (const d of board) {
    if (d === 1) black++;
    else if (d === 2) white++;
  }
  return { black, white };
}

export type Winner = 'black' | 'white' | 'draw';

export function winnerOf(board: Board): Winner {
  const { black, white } = countDiscs(board);
  if (black === white) return 'draw';
  return black > white ? 'black' : 'white';
}

export interface GameState {
  board: Board;
  /** 次に打つ側。終局後は最後に打った側のまま */
  turn: Player;
  /** 直前に置いた位置（開始時は -1） */
  lastMove: number;
  /** 直前の手で裏返った位置 */
  flipped: number[];
  /** 直前の手のあと、相手に打てる場所がなく手番が戻った（パスした側） */
  passed: Player | null;
  over: boolean;
}

export function newGame(): GameState {
  return {
    board: initialBoard(),
    turn: 1,
    lastMove: -1,
    flipped: [],
    passed: null,
    over: false,
  };
}

/** 現在の手番で index に打つ。置けない手・終局後は同じ state を返す */
export function playMove(state: GameState, index: number): GameState {
  if (state.over) return state;
  const flips = flipsFor(state.board, index, state.turn);
  if (flips.length === 0) return state;
  const board = applyMove(state.board, index, state.turn) as Board;
  const other = opponent(state.turn);
  if (legalMoves(board, other).length > 0) {
    return {
      board,
      turn: other,
      lastMove: index,
      flipped: flips,
      passed: null,
      over: false,
    };
  }
  if (legalMoves(board, state.turn).length > 0) {
    // 相手はパス。同じ側がもう一度打つ
    return {
      board,
      turn: state.turn,
      lastMove: index,
      flipped: flips,
      passed: other,
      over: false,
    };
  }
  return {
    board,
    turn: state.turn,
    lastMove: index,
    flipped: flips,
    passed: null,
    over: true,
  };
}

// 位置の価値（角は大きく、角の隣は小さく）
const WEIGHTS: readonly number[] = [
  100, -20, 10, 5, 5, 10, -20, 100, -20, -50, -2, -2, -2, -2, -50, -20, 10, -2,
  -1, -1, -1, -1, -2, 10, 5, -2, -1, -1, -1, -1, -2, 5, 5, -2, -1, -1, -1, -1,
  -2, 5, 10, -2, -1, -1, -1, -1, -2, 10, -20, -50, -2, -2, -2, -2, -50, -20,
  100, -20, 10, 5, 5, 10, -20, 100,
];

const WIN_SCORE = 100000;
const INF = 1_000_000;

/** player から見た評価値。終局なら石数の差に大きな重みを付ける */
function evaluate(board: Board, player: Player): number {
  const other = opponent(player);
  const mine = legalMoves(board, player).length;
  const theirs = legalMoves(board, other).length;
  if (mine === 0 && theirs === 0) {
    const { black, white } = countDiscs(board);
    const diff = player === 1 ? black - white : white - black;
    return diff === 0 ? 0 : Math.sign(diff) * WIN_SCORE + diff;
  }
  let positional = 0;
  for (let i = 0; i < CELLS; i++) {
    if (board[i] === player) positional += WEIGHTS[i];
    else if (board[i] === other) positional -= WEIGHTS[i];
  }
  return positional + (mine - theirs) * 8;
}

/** 価値の高い位置から試すと枝刈りが効きやすい */
function orderedMoves(board: Board, player: Player): number[] {
  return legalMoves(board, player).sort((a, b) => WEIGHTS[b] - WEIGHTS[a]);
}

function negamax(
  board: Board,
  player: Player,
  depth: number,
  alpha: number,
  beta: number,
): number {
  const moves = orderedMoves(board, player);
  if (moves.length === 0) {
    if (legalMoves(board, opponent(player)).length === 0) {
      return evaluate(board, player);
    }
    // パス（深さは消費しない）
    return -negamax(board, opponent(player), depth, -beta, -alpha);
  }
  if (depth === 0) return evaluate(board, player);
  let best = -INF;
  for (const move of moves) {
    const next = applyMove(board, move, player) as Board;
    const score = -negamax(next, opponent(player), depth - 1, -beta, -alpha);
    if (score > best) best = score;
    if (best > alpha) alpha = best;
    if (alpha >= beta) break;
  }
  return best;
}

/**
 * AI が打つ手を選ぶ。打てる場所がなければ -1。
 * 同じ評価の手が複数あるときは randomInt で選ぶ（毎回同じ展開にならない）。
 */
export function chooseMove(
  board: Board,
  player: Player,
  level: Level,
  randomInt: RandomInt = secureRandomInt,
): number {
  const moves = orderedMoves(board, player);
  if (moves.length === 0) return -1;
  const depth = DEPTH[level];
  if (depth === 0) return moves[randomInt(moves.length)];
  let bestScore = -INF;
  let best: number[] = [];
  for (const move of moves) {
    const next = applyMove(board, move, player) as Board;
    // 現在の最善より1つ下を下限にして、同点の手も正確な値で拾う
    const score = -negamax(
      next,
      opponent(player),
      depth - 1,
      -INF,
      -(bestScore - 1),
    );
    if (score > bestScore) {
      bestScore = score;
      best = [move];
    } else if (score === bestScore) {
      best.push(move);
    }
  }
  return best[randomInt(best.length)];
}
