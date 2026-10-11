import { secureRandomInt, shuffle } from '../random';
import type { RandomInt } from '../random';

export type { RandomInt };

export const SIZES = [3, 4, 5] as const;
export type PuzzleSize = (typeof SIZES)[number];
export const DEFAULT_SIZE: PuzzleSize = 4;

/** 空きマスを表す値。タイルは 1〜(size*size-1) */
export const BLANK = 0;

export type Direction = 'up' | 'down' | 'left' | 'right';

export interface PuzzleState {
  size: number;
  /** 各マスのタイル。空きマスは BLANK。左上から行方向に並ぶ */
  board: readonly number[];
  /** 動かしたタイルの数（複数枚をまとめて滑らせたら枚数分を加算する） */
  moves: number;
}

/** 完成形（1,2,3,…と並び、右下が空きマス） */
export function solvedBoard(size: number): number[] {
  const board = Array.from({ length: size * size }, (_, i) => i + 1);
  board[board.length - 1] = BLANK;
  return board;
}

export function isSolvedBoard(board: readonly number[]): boolean {
  const last = board.length - 1;
  return board.every((v, i) => (i === last ? v === BLANK : v === i + 1));
}

/** 完成形にたどり着ける並びか（転倒数と空きマスの行による標準的な判定） */
export function isSolvable(board: readonly number[], size: number): boolean {
  const tiles = board.filter((v) => v !== BLANK);
  let inversions = 0;
  for (let i = 0; i < tiles.length; i++) {
    for (let j = i + 1; j < tiles.length; j++) {
      if (tiles[i] > tiles[j]) inversions++;
    }
  }
  if (size % 2 === 1) return inversions % 2 === 0;
  const blankRowFromBottom = size - Math.floor(board.indexOf(BLANK) / size);
  return (inversions + blankRowFromBottom) % 2 === 1;
}

/** 解ける並びで、かつ完成済みでない盤面をランダムに作る */
export function createBoard(
  size: number,
  randomInt: RandomInt = secureRandomInt,
): number[] {
  if (!Number.isInteger(size) || size < 2) {
    throw new RangeError('size must be an integer of 2 or more');
  }
  const base = solvedBoard(size);
  for (;;) {
    const board = shuffle(base, randomInt);
    if (!isSolvable(board, size)) {
      // 空きマス以外の2枚を入れ替えると転倒数の偶奇が変わり、解ける並びになる
      const a = board.findIndex((v) => v !== BLANK);
      const b = board.findIndex((v, i) => i > a && v !== BLANK);
      [board[a], board[b]] = [board[b], board[a]];
    }
    if (!isSolvedBoard(board)) return board;
  }
}

export function newGame(board: readonly number[], size: number): PuzzleState {
  return { size, board, moves: 0 };
}

/**
 * index のタイルを空きマスの方向へ動かす。空きマスと同じ行・列にあれば、間のタイルもまとめて滑らせる。
 * 動かせない（範囲外・空きマス自身・空きマスと別の行列）場合は同じ state を返す。
 */
export function moveTile(state: PuzzleState, index: number): PuzzleState {
  const { size, board } = state;
  if (!Number.isInteger(index) || index < 0 || index >= board.length) {
    return state;
  }
  const blank = board.indexOf(BLANK);
  if (index === blank) return state;
  const sameRow = Math.floor(index / size) === Math.floor(blank / size);
  const sameCol = index % size === blank % size;
  if (!sameRow && !sameCol) return state;

  const step = sameRow ? 1 : size;
  const dir = index > blank ? 1 : -1;
  const next = [...board];
  let count = 0;
  for (let pos = blank; pos !== index; pos += dir * step) {
    next[pos] = next[pos + dir * step];
    count++;
  }
  next[index] = BLANK;
  return { size, board: next, moves: state.moves + count };
}

/**
 * 矢印キーの向きにタイルを1枚動かす（「左」なら空きマスの右にあるタイルが左へ動く）。
 * 動かせる位置にタイルがなければ同じ state を返す。
 */
export function moveByDirection(
  state: PuzzleState,
  direction: Direction,
): PuzzleState {
  const { size, board } = state;
  const blank = board.indexOf(BLANK);
  const row = Math.floor(blank / size);
  const col = blank % size;
  let target = -1;
  if (direction === 'left' && col < size - 1) target = blank + 1;
  if (direction === 'right' && col > 0) target = blank - 1;
  if (direction === 'up' && row < size - 1) target = blank + size;
  if (direction === 'down' && row > 0) target = blank - size;
  return target === -1 ? state : moveTile(state, target);
}

export function isComplete(state: PuzzleState): boolean {
  return isSolvedBoard(state.board);
}

/** 正しい位置にあるタイルの数（空きマスは数えない） */
export function correctTiles(state: PuzzleState): number {
  return state.board.filter((v, i) => v !== BLANK && v === i + 1).length;
}

export interface BestRecord {
  /** 最少の手数 */
  moves: number;
  /** 最短のクリア時間（ミリ秒） */
  timeMs: number;
}

export type BestRecords = Partial<Record<PuzzleSize, BestRecord>>;

export interface RecordUpdate {
  records: BestRecords;
  newBestMoves: boolean;
  newBestTime: boolean;
}

/** クリア結果をベスト記録に反映する（手数と時間は別々に更新する） */
export function applyResult(
  records: BestRecords,
  size: PuzzleSize,
  moves: number,
  timeMs: number,
): RecordUpdate {
  const current = records[size];
  const newBestMoves = !current || moves < current.moves;
  const newBestTime = !current || timeMs < current.timeMs;
  const next: BestRecord = {
    moves: newBestMoves ? moves : (current?.moves ?? moves),
    timeMs: newBestTime ? timeMs : (current?.timeMs ?? timeMs),
  };
  return {
    records: { ...records, [size]: next },
    newBestMoves,
    newBestTime,
  };
}

function isPositiveNumber(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value) && value > 0;
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
    const { moves, timeMs } = entry as Record<string, unknown>;
    if (isPositiveNumber(moves) && isPositiveNumber(timeMs)) {
      const m = Math.floor(moves);
      const t = Math.floor(timeMs);
      if (m > 0 && t > 0) result[s] = { moves: m, timeMs: t };
    }
  }
  return result;
}

export function serializeRecords(records: BestRecords): string {
  return JSON.stringify(records);
}

/** ミリ秒を m:ss.s 形式（例: 1:05.3）にする */
export function formatTime(ms: number): string {
  const tenths = Math.max(0, Math.floor(ms / 100));
  const totalSeconds = Math.floor(tenths / 10);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${String(seconds).padStart(2, '0')}.${tenths % 10}`;
}

/** 画像の中央を正方形に切り取るための領域（元画像上の座標とサイズ） */
export function centerSquare(
  width: number,
  height: number,
): { x: number; y: number; side: number } {
  const side = Math.min(width, height);
  return {
    x: Math.floor((width - side) / 2),
    y: Math.floor((height - side) / 2),
    side,
  };
}
