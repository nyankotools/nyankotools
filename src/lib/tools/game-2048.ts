import { secureRandomInt } from '../random';
import type { RandomInt } from '../random';

export type { RandomInt };

export const SIZES = [4, 5, 6] as const;
export type BoardSize = (typeof SIZES)[number];
export const DEFAULT_SIZE: BoardSize = 4;

/** このタイルを作ったら「達成」とする値 */
export const WIN_TILE = 2048;

/** 空きマスを表す値 */
export const EMPTY = 0;

export type Direction = 'up' | 'down' | 'left' | 'right';

export interface GameState {
  size: number;
  /** 各マスの数値。空きマスは EMPTY。左上から行方向に並ぶ */
  board: readonly number[];
  score: number;
  /** 盤面が変わった操作の回数 */
  moves: number;
  /** 一度でも WIN_TILE 以上のタイルを作ったか */
  won: boolean;
}

export function maxTile(board: readonly number[]): number {
  return board.reduce((max, v) => (v > max ? v : max), 0);
}

/** 空きマスの1つにランダムで 2（90%）または 4（10%）を置いた新しい盤面を返す。空きがなければそのまま返す */
export function spawnTile(
  board: readonly number[],
  randomInt: RandomInt = secureRandomInt,
): number[] {
  const next = [...board];
  const empties: number[] = [];
  next.forEach((v, i) => {
    if (v === EMPTY) empties.push(i);
  });
  if (empties.length === 0) return next;
  const index = empties[randomInt(empties.length)];
  next[index] = randomInt(10) === 0 ? 4 : 2;
  return next;
}

/** 新しいゲーム（タイル2枚から始まる） */
export function newGame(
  size: number,
  randomInt: RandomInt = secureRandomInt,
): GameState {
  if (!Number.isInteger(size) || size < 2) {
    throw new RangeError('size must be an integer of 2 or more');
  }
  let board: number[] = new Array<number>(size * size).fill(EMPTY);
  board = spawnTile(board, randomInt);
  board = spawnTile(board, randomInt);
  return { size, board, score: 0, moves: 0, won: false };
}

/** 1行（または1列）を先頭側へ詰めて、同じ数を1回だけ合体させる。gained は合体で増えた点数 */
export function slideLine(line: readonly number[]): {
  line: number[];
  gained: number;
} {
  const tiles = line.filter((v) => v !== EMPTY);
  const merged: number[] = [];
  let gained = 0;
  for (let i = 0; i < tiles.length; i++) {
    if (i + 1 < tiles.length && tiles[i] === tiles[i + 1]) {
      const value = tiles[i] * 2;
      merged.push(value);
      gained += value;
      i++;
    } else {
      merged.push(tiles[i]);
    }
  }
  while (merged.length < line.length) merged.push(EMPTY);
  return { line: merged, gained };
}

/** 動かす向きに対して、タイルが寄る側を先頭にした各行・列のマス番号 */
function lineIndexes(size: number, direction: Direction): number[][] {
  const lines: number[][] = [];
  for (let a = 0; a < size; a++) {
    const line: number[] = [];
    for (let b = 0; b < size; b++) {
      if (direction === 'left') line.push(a * size + b);
      if (direction === 'right') line.push(a * size + (size - 1 - b));
      if (direction === 'up') line.push(b * size + a);
      if (direction === 'down') line.push((size - 1 - b) * size + a);
    }
    lines.push(line);
  }
  return lines;
}

/**
 * 盤面を指定の向きへ寄せ、変化があれば新しいタイルを1枚置く。
 * 何も動かなければ（無効な操作）同じ state を返す。
 */
export function move(
  state: GameState,
  direction: Direction,
  randomInt: RandomInt = secureRandomInt,
): GameState {
  const { size, board } = state;
  const next = [...board];
  let gained = 0;
  for (const indexes of lineIndexes(size, direction)) {
    const result = slideLine(indexes.map((i) => board[i]));
    indexes.forEach((boardIndex, k) => {
      next[boardIndex] = result.line[k];
    });
    gained += result.gained;
  }
  if (next.every((v, i) => v === board[i])) return state;
  const spawned = spawnTile(next, randomInt);
  return {
    size,
    board: spawned,
    score: state.score + gained,
    moves: state.moves + 1,
    won: state.won || maxTile(spawned) >= WIN_TILE,
  };
}

/** どの向きにも動かせない（空きマスがなく、隣り合う同じ数もない）状態か */
export function isGameOver(state: GameState): boolean {
  const { size, board } = state;
  if (board.includes(EMPTY)) return false;
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      const v = board[r * size + c];
      if (c + 1 < size && board[r * size + c + 1] === v) return false;
      if (r + 1 < size && board[(r + 1) * size + c] === v) return false;
    }
  }
  return true;
}

export interface BestRecord {
  /** 最高スコア */
  score: number;
  /** 作った最大のタイル */
  maxTile: number;
}

export type BestRecords = Partial<Record<BoardSize, BestRecord>>;

/**
 * いまの盤面の結果をベスト記録に反映する（スコアと最大タイルは別々に更新する）。
 * 更新がなければ同じ records を返す。
 */
export function updateBest(
  records: BestRecords,
  size: BoardSize,
  score: number,
  tile: number,
): BestRecords {
  const current = records[size];
  const bestScore = Math.max(current?.score ?? 0, score);
  const bestTile = Math.max(current?.maxTile ?? 0, tile);
  if (current && bestScore === current.score && bestTile === current.maxTile) {
    return records;
  }
  if (!current && bestScore === 0 && bestTile === 0) return records;
  return { ...records, [size]: { score: bestScore, maxTile: bestTile } };
}

function isNonNegativeNumber(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value) && value >= 0;
}

/** localStorage の文字列からベスト記録を復元する。壊れた値・想定外の形は無視する */
export function parseRecords(raw: string | null): BestRecords {
  if (!raw) return {};
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return {};
  }
  if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) {
    return {};
  }
  const result: BestRecords = {};
  for (const s of SIZES) {
    const entry = (parsed as Record<string, unknown>)[String(s)];
    if (typeof entry !== 'object' || entry === null) continue;
    const { score, maxTile: tile } = entry as Record<string, unknown>;
    if (isNonNegativeNumber(score) && isNonNegativeNumber(tile)) {
      result[s] = { score: Math.floor(score), maxTile: Math.floor(tile) };
    }
  }
  return result;
}

export function serializeRecords(records: BestRecords): string {
  return JSON.stringify(records);
}

/** スワイプの移動量から向きを決める。しきい値未満なら null */
export function swipeDirection(
  dx: number,
  dy: number,
  threshold = 24,
): Direction | null {
  if (Math.max(Math.abs(dx), Math.abs(dy)) < threshold) return null;
  if (Math.abs(dx) >= Math.abs(dy)) return dx > 0 ? 'right' : 'left';
  return dy > 0 ? 'down' : 'up';
}
