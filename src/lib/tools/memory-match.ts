import { secureRandomInt, shuffle } from '../random';
import type { RandomInt } from '../random';

export type { RandomInt };

export const DIFFICULTIES = ['easy', 'normal', 'hard'] as const;
export type Difficulty = (typeof DIFFICULTIES)[number];

export interface BoardSize {
  cols: number;
  rows: number;
}

/** 難易度ごとの盤面サイズ（枚数は cols × rows で必ず偶数） */
export const BOARD_SIZES: Record<Difficulty, BoardSize> = {
  easy: { cols: 4, rows: 3 },
  normal: { cols: 4, rows: 4 },
  hard: { cols: 6, rows: 5 },
};

/** カードの絵柄。最大ペア数（hard の15ペア）以上の数を用意する */
export const EMOJIS = [
  '🐱',
  '🐶',
  '🐰',
  '🦊',
  '🐻',
  '🐼',
  '🐸',
  '🐵',
  '🐧',
  '🐯',
  '🦁',
  '🐮',
  '🐷',
  '🐨',
  '🐔',
  '🐙',
  '🦄',
  '🐢',
] as const;

/** 不一致の2枚を見せておく時間（ミリ秒） */
export const MISMATCH_DELAY_MS = 800;

export function pairCount(difficulty: Difficulty): number {
  const { cols, rows } = BOARD_SIZES[difficulty];
  return (cols * rows) / 2;
}

/** 盤面に並べるカード（絵柄）を、ペアにしてシャッフルして返す */
export function createDeck(
  difficulty: Difficulty,
  randomInt: RandomInt = secureRandomInt,
  pool: readonly string[] = EMOJIS,
): string[] {
  const pairs = pairCount(difficulty);
  if (pool.length < pairs) {
    throw new RangeError('絵柄の数がペア数に足りません');
  }
  const picked = shuffle(pool, randomInt).slice(0, pairs);
  return shuffle([...picked, ...picked], randomInt);
}

export interface GameState {
  /** 各位置の絵柄 */
  deck: readonly string[];
  /** 揃って確定したカード */
  matched: readonly boolean[];
  /** いま表向きで、まだ判定が済んでいないカードの位置（0〜2枚） */
  faceUp: readonly number[];
  /** めくった組の数（2枚めくるごとに1手） */
  moves: number;
}

export function newGame(deck: readonly string[]): GameState {
  return {
    deck,
    matched: deck.map(() => false),
    faceUp: [],
    moves: 0,
  };
}

/** 不一致の2枚が表向きのまま、次の操作を待っている状態か */
export function isMismatchPending(state: GameState): boolean {
  return (
    state.faceUp.length === 2 &&
    state.deck[state.faceUp[0]] !== state.deck[state.faceUp[1]]
  );
}

export function isComplete(state: GameState): boolean {
  return state.matched.every(Boolean);
}

export function matchedPairs(state: GameState): number {
  return state.matched.filter(Boolean).length / 2;
}

/** 不一致の2枚を裏返す。不一致待ちでなければ何もしない */
export function resolveMismatch(state: GameState): GameState {
  if (!isMismatchPending(state)) return state;
  return { ...state, faceUp: [] };
}

/**
 * index のカードをめくる。範囲外・確定済み・すでに表向きのカードは無視する。
 * 不一致の2枚が待機中なら先に裏返してからめくる。2枚目で一致すれば確定する。
 */
export function flipCard(state: GameState, index: number): GameState {
  if (!Number.isInteger(index) || index < 0 || index >= state.deck.length) {
    return state;
  }
  if (state.matched[index]) return state;
  const base = resolveMismatch(state);
  if (base.faceUp.includes(index)) return state;
  if (base.faceUp.length === 0) {
    return { ...base, faceUp: [index] };
  }
  const first = base.faceUp[0];
  const moves = base.moves + 1;
  if (base.deck[first] === base.deck[index]) {
    const matched = base.matched.map((m, i) => m || i === first || i === index);
    return { ...base, matched, faceUp: [], moves };
  }
  return { ...base, faceUp: [first, index], moves };
}

export interface BestRecord {
  /** 最少の手数 */
  moves: number;
  /** 最短のクリア時間（ミリ秒） */
  timeMs: number;
}

export type BestRecords = Partial<Record<Difficulty, BestRecord>>;

export interface RecordUpdate {
  records: BestRecords;
  newBestMoves: boolean;
  newBestTime: boolean;
}

/** クリア結果をベスト記録に反映する（手数と時間は別々に更新する） */
export function applyResult(
  records: BestRecords,
  difficulty: Difficulty,
  moves: number,
  timeMs: number,
): RecordUpdate {
  const current = records[difficulty];
  const newBestMoves = !current || moves < current.moves;
  const newBestTime = !current || timeMs < current.timeMs;
  const next: BestRecord = {
    moves: newBestMoves ? moves : (current?.moves ?? moves),
    timeMs: newBestTime ? timeMs : (current?.timeMs ?? timeMs),
  };
  return {
    records: { ...records, [difficulty]: next },
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
  for (const d of DIFFICULTIES) {
    const entry = (parsed as Record<string, unknown>)[d];
    if (typeof entry !== 'object' || entry === null) continue;
    const { moves, timeMs } = entry as Record<string, unknown>;
    if (isPositiveNumber(moves) && isPositiveNumber(timeMs)) {
      const m = Math.floor(moves);
      const t = Math.floor(timeMs);
      if (m > 0 && t > 0) result[d] = { moves: m, timeMs: t };
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
