import { secureRandomInt } from '../random';
import type { RandomInt } from '../random';

export type { RandomInt };

export const SIZE = 15;
const CELLS = SIZE * SIZE;

/** 0: 空き、1: 黒（先手）、2: 白（後手） */
export type Stone = 0 | 1 | 2;
export type Player = 1 | 2;
export type Board = readonly Stone[];

export const LEVELS = ['easy', 'normal', 'hard', 'expert'] as const;
export type Level = (typeof LEVELS)[number];
export const DEFAULT_LEVEL: Level = 'normal';

/** 先読みの手数と、各局面で読む候補手の数（easy / normal は読まない） */
const SEARCH: Record<Level, { depth: number; width: number }> = {
  easy: { depth: 0, width: 0 },
  normal: { depth: 1, width: CELLS },
  hard: { depth: 2, width: 8 },
  expert: { depth: 4, width: 6 },
};

const DIRECTIONS: readonly (readonly [number, number])[] = [
  [0, 1],
  [1, 0],
  [1, 1],
  [1, -1],
];

export function opponent(player: Player): Player {
  return player === 1 ? 2 : 1;
}

export function initialBoard(): Board {
  return new Array<Stone>(CELLS).fill(0);
}

export const CENTER = Math.floor(SIZE / 2) * SIZE + Math.floor(SIZE / 2);

/** index に player の石を置いた新しい盤面。置けない（範囲外・埋まっている）なら null */
export function placeStone(
  board: Board,
  index: number,
  player: Player,
): Board | null {
  if (!Number.isInteger(index) || index < 0 || index >= CELLS) return null;
  if (board[index] !== 0) return null;
  const next = board.slice();
  next[index] = player;
  return next;
}

/**
 * index の石を含む5つ以上の連（縦横斜め）の位置。禁じ手はなく、6つ以上でも勝ち。
 * 複数の方向で連ができたときはすべて返す。連がなければ空配列
 */
export function findFive(board: Board, index: number): number[] {
  if (!Number.isInteger(index) || index < 0 || index >= CELLS) return [];
  const player = board[index];
  if (player === 0) return [];
  const row = Math.floor(index / SIZE);
  const col = index % SIZE;
  const result = new Set<number>();
  for (const [dr, dc] of DIRECTIONS) {
    const line = [index];
    for (const sign of [1, -1]) {
      let r = row + dr * sign;
      let c = col + dc * sign;
      while (
        r >= 0 &&
        r < SIZE &&
        c >= 0 &&
        c < SIZE &&
        board[r * SIZE + c] === player
      ) {
        line.push(r * SIZE + c);
        r += dr * sign;
        c += dc * sign;
      }
    }
    if (line.length >= 5) for (const i of line) result.add(i);
  }
  return [...result].sort((a, b) => a - b);
}

export function isFull(board: Board): boolean {
  return board.every((s) => s !== 0);
}

export function countStones(board: Board): { black: number; white: number } {
  let black = 0;
  let white = 0;
  for (const s of board) {
    if (s === 1) black++;
    else if (s === 2) white++;
  }
  return { black, white };
}

export interface GameState {
  board: Board;
  /** 次に打つ側。終局後は最後に打った側のまま */
  turn: Player;
  /** 直前に置いた位置（開始時は -1） */
  lastMove: number;
  winner: Player | null;
  /** 勝った連の位置（勝者がいなければ空） */
  winLine: number[];
  /** 盤面が埋まって引き分け、または勝負がついた */
  over: boolean;
}

export function newGame(): GameState {
  return {
    board: initialBoard(),
    turn: 1,
    lastMove: -1,
    winner: null,
    winLine: [],
    over: false,
  };
}

/** 現在の手番で index に打つ。置けない手・終局後は同じ state を返す */
export function playMove(state: GameState, index: number): GameState {
  if (state.over) return state;
  const board = placeStone(state.board, index, state.turn);
  if (!board) return state;
  const winLine = findFive(board, index);
  if (winLine.length > 0) {
    return {
      board,
      turn: state.turn,
      lastMove: index,
      winner: state.turn,
      winLine,
      over: true,
    };
  }
  if (isFull(board)) {
    return {
      board,
      turn: state.turn,
      lastMove: index,
      winner: null,
      winLine: [],
      over: true,
    };
  }
  return {
    board,
    turn: opponent(state.turn),
    lastMove: index,
    winner: null,
    winLine: [],
    over: false,
  };
}

// ---- AI ----

const FIVE = 100000;
const WIN_VALUE = 10_000_000;
const INF = 1_000_000_000;
/** 5マスの枠に自分の石が n 個あるときの点（相手の石がない枠だけ数える） */
const WINDOW_SCORE: readonly number[] = [0, 1, 8, 60, 700, FIVE];

/**
 * index に player の石を置いたとき、その石を通る4方向の並びの点。
 * 連続していなくても、5マスの枠に相手の石がなければ数える（飛びの三なども評価できる）
 */
function lineScore(board: number[], index: number, player: Player): number {
  const row = Math.floor(index / SIZE);
  const col = index % SIZE;
  let total = 0;
  const cells = new Array<number>(9);
  for (const [dr, dc] of DIRECTIONS) {
    for (let k = -4; k <= 4; k++) {
      const r = row + dr * k;
      const c = col + dc * k;
      if (r < 0 || r >= SIZE || c < 0 || c >= SIZE) cells[k + 4] = 3;
      else cells[k + 4] = k === 0 ? player : board[r * SIZE + c];
    }
    for (let s = 0; s <= 4; s++) {
      let own = 0;
      let blocked = false;
      for (let j = s; j < s + 5; j++) {
        const v = cells[j];
        if (v === player) own++;
        else if (v !== 0) {
          blocked = true;
          break;
        }
      }
      if (!blocked) total += WINDOW_SCORE[own];
    }
  }
  return total;
}

interface Candidate {
  index: number;
  attack: number;
  /** 攻撃と防御を合わせた、その手単体の価値 */
  value: number;
}

/** 石から2マス以内の空きマスを、価値の高い順に並べる。石がなければ中央のみ */
function candidates(board: number[], player: Player): Candidate[] {
  const near = new Set<number>();
  for (let i = 0; i < CELLS; i++) {
    if (board[i] === 0) continue;
    const row = Math.floor(i / SIZE);
    const col = i % SIZE;
    for (let dr = -2; dr <= 2; dr++) {
      for (let dc = -2; dc <= 2; dc++) {
        const r = row + dr;
        const c = col + dc;
        if (r < 0 || r >= SIZE || c < 0 || c >= SIZE) continue;
        if (board[r * SIZE + c] === 0) near.add(r * SIZE + c);
      }
    }
  }
  if (near.size === 0) {
    if (board.every((s) => s === 0)) {
      return [{ index: CENTER, attack: 0, value: 0 }];
    }
    return [];
  }
  const other = opponent(player);
  const list: Candidate[] = [];
  for (const index of near) {
    const attack = lineScore(board, index, player);
    const defense = lineScore(board, index, other);
    list.push({ index, attack, value: attack * 10 + defense * 9 });
  }
  return list.sort((a, b) => b.value - a.value || a.index - b.index);
}

/** player から見た局面の価値（各手の単体価値の差し引きを先読みする） */
function search(
  board: number[],
  player: Player,
  depth: number,
  width: number,
  alpha: number,
  beta: number,
): number {
  const list = candidates(board, player).slice(0, width);
  if (list.length === 0) return 0;
  let best = -INF;
  for (const cand of list) {
    if (cand.attack >= FIVE) return WIN_VALUE + depth;
    let v = cand.value;
    if (depth > 1) {
      board[cand.index] = player;
      v -= search(
        board,
        opponent(player),
        depth - 1,
        width,
        cand.value - beta,
        cand.value - alpha,
      );
      board[cand.index] = 0;
    }
    if (v > best) best = v;
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
  const work = board.slice() as number[];
  const all = candidates(work, player);
  if (all.length === 0) return -1;
  // 5つ並べられるなら、どの強さでも必ず打つ
  const winning = all.filter((c) => c.attack >= FIVE);
  if (winning.length > 0) return winning[randomInt(winning.length)].index;
  const { depth, width } = SEARCH[level];
  if (depth === 0) return all[randomInt(all.length)].index;
  const list = all.slice(0, width);
  let bestScore = -INF;
  let best: number[] = [];
  for (const cand of list) {
    let v = cand.value;
    if (depth > 1) {
      work[cand.index] = player;
      v -= search(work, opponent(player), depth - 1, width, -INF, INF);
      work[cand.index] = 0;
    }
    if (v > bestScore) {
      bestScore = v;
      best = [cand.index];
    } else if (v === bestScore) {
      best.push(cand.index);
    }
  }
  return best[randomInt(best.length)];
}
