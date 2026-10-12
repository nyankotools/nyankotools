import { secureRandomInt, shuffle } from '../random';
import type { RandomInt } from '../random';

export type { RandomInt };

export const DIFFICULTIES = ['beginner', 'intermediate', 'expert'] as const;
export type Difficulty = (typeof DIFFICULTIES)[number];
export const DEFAULT_DIFFICULTY: Difficulty = 'beginner';

export interface GameConfig {
  cols: number;
  rows: number;
  mines: number;
}

export const PRESETS: Record<Difficulty, GameConfig> = {
  beginner: { cols: 9, rows: 9, mines: 10 },
  intermediate: { cols: 16, rows: 16, mines: 40 },
  expert: { cols: 30, rows: 16, mines: 99 },
};

export const LIMITS = {
  minCols: 5,
  maxCols: 30,
  minRows: 5,
  maxRows: 24,
  minMines: 1,
} as const;

/** 最初に開く場所とその周囲8マスは地雷を置かない（地雷の数はこの分を除いた範囲に限る） */
const SAFE_ZONE = 9;

export function maxMines(cols: number, rows: number): number {
  return cols * rows - SAFE_ZONE;
}

export type CustomError = 'invalid' | 'cols' | 'rows' | 'mines';

export type CustomResult =
  { ok: true; config: GameConfig } | { ok: false; error: CustomError };

/** カスタム設定（列・行・地雷数）を検証する。整数でない・範囲外ならエラーの種類を返す */
export function validateCustom(
  cols: number,
  rows: number,
  mines: number,
): CustomResult {
  if (![cols, rows, mines].every((n) => Number.isInteger(n))) {
    return { ok: false, error: 'invalid' };
  }
  if (cols < LIMITS.minCols || cols > LIMITS.maxCols) {
    return { ok: false, error: 'cols' };
  }
  if (rows < LIMITS.minRows || rows > LIMITS.maxRows) {
    return { ok: false, error: 'rows' };
  }
  if (mines < LIMITS.minMines || mines > maxMines(cols, rows)) {
    return { ok: false, error: 'mines' };
  }
  return { ok: true, config: { cols, rows, mines } };
}

export type Phase = 'ready' | 'playing' | 'won' | 'lost';
export type CellMark = 'hidden' | 'open' | 'flag';

export interface GameState {
  config: GameConfig;
  /** ready: 最初のマスを開く前（地雷は未配置）、playing: 進行中 */
  phase: Phase;
  /** 各マスの状態（左上から行方向に並ぶ） */
  cells: readonly CellMark[];
  /** 地雷の位置。最初のマスを開くまでは null */
  mines: readonly boolean[] | null;
  /** 各マスの周囲8マスにある地雷の数。最初のマスを開くまでは null */
  counts: readonly number[] | null;
  /** 地雷を開いてしまったマス（なければ -1） */
  exploded: number;
  /** 開いた安全なマスの数 */
  opened: number;
}

/** index の周囲（最大8マス）のインデックス */
export function neighbors(index: number, cols: number, rows: number): number[] {
  const row = Math.floor(index / cols);
  const col = index % cols;
  const result: number[] = [];
  for (let dr = -1; dr <= 1; dr++) {
    for (let dc = -1; dc <= 1; dc++) {
      if (dr === 0 && dc === 0) continue;
      const r = row + dr;
      const c = col + dc;
      if (r >= 0 && r < rows && c >= 0 && c < cols) result.push(r * cols + c);
    }
  }
  return result;
}

export function newGame(config: GameConfig): GameState {
  return {
    config,
    phase: 'ready',
    cells: new Array<CellMark>(config.cols * config.rows).fill('hidden'),
    mines: null,
    counts: null,
    exploded: -1,
    opened: 0,
  };
}

/** safeIndex とその周囲を避けて地雷をランダムに置く */
export function placeMines(
  config: GameConfig,
  safeIndex: number,
  randomInt: RandomInt = secureRandomInt,
): boolean[] {
  const { cols, rows, mines } = config;
  const total = cols * rows;
  let excluded = new Set([safeIndex, ...neighbors(safeIndex, cols, rows)]);
  // 周囲を除くと置き場所が足りない場合（範囲外の設定）は、開いたマスだけを避ける
  if (total - excluded.size < mines) excluded = new Set([safeIndex]);
  const candidates: number[] = [];
  for (let i = 0; i < total; i++) {
    if (!excluded.has(i)) candidates.push(i);
  }
  const result = new Array<boolean>(total).fill(false);
  for (const i of shuffle(candidates, randomInt).slice(0, mines)) {
    result[i] = true;
  }
  return result;
}

function countAdjacent(
  mines: readonly boolean[],
  cols: number,
  rows: number,
): number[] {
  return mines.map((_, i) =>
    neighbors(i, cols, rows).reduce((n, j) => n + (mines[j] ? 1 : 0), 0),
  );
}

/**
 * targets を開く。最初の1回なら targets[0] を避けて地雷を置く。
 * 周囲に地雷のないマスは連鎖して開く。旗の立ったマスは開かない。
 */
function openCells(
  state: GameState,
  targets: number[],
  randomInt: RandomInt,
): GameState {
  const { cols, rows, mines: mineCount } = state.config;
  const mines = state.mines ?? placeMines(state.config, targets[0], randomInt);
  const counts = state.counts ?? countAdjacent(mines, cols, rows);
  const cells = [...state.cells];
  let opened = state.opened;
  let exploded = -1;
  const stack = [...targets];
  while (stack.length > 0) {
    const i = stack.pop() as number;
    if (cells[i] !== 'hidden') continue;
    if (mines[i]) {
      exploded = i;
      break;
    }
    cells[i] = 'open';
    opened++;
    if (counts[i] === 0) stack.push(...neighbors(i, cols, rows));
  }
  if (exploded >= 0) {
    return { ...state, phase: 'lost', cells, mines, counts, exploded, opened };
  }
  if (opened === cols * rows - mineCount) {
    // 勝ったら残りの地雷すべてに旗を立てる
    mines.forEach((isMine, i) => {
      if (isMine) cells[i] = 'flag';
    });
    return { ...state, phase: 'won', cells, mines, counts, opened };
  }
  return { ...state, phase: 'playing', cells, mines, counts, opened };
}

function isActive(state: GameState): boolean {
  return state.phase === 'ready' || state.phase === 'playing';
}

function isValidIndex(state: GameState, index: number): boolean {
  return Number.isInteger(index) && index >= 0 && index < state.cells.length;
}

/** 隠れているマスを開く。開けない（範囲外・開封済み・旗・終了後）場合は同じ state を返す */
export function revealCell(
  state: GameState,
  index: number,
  randomInt: RandomInt = secureRandomInt,
): GameState {
  if (!isActive(state) || !isValidIndex(state, index)) return state;
  if (state.cells[index] !== 'hidden') return state;
  return openCells(state, [index], randomInt);
}

/** 隠れているマスに旗を立てる／外す。それ以外のマス・終了後は同じ state を返す */
export function toggleFlag(state: GameState, index: number): GameState {
  if (!isActive(state) || !isValidIndex(state, index)) return state;
  const mark = state.cells[index];
  if (mark === 'open') return state;
  const cells = [...state.cells];
  cells[index] = mark === 'flag' ? 'hidden' : 'flag';
  return { ...state, cells };
}

/**
 * 開いた数字のマスの周囲に、数字と同じ数の旗があるとき、残りの隠れたマスをまとめて開く。
 * 旗の位置が間違っていれば地雷を開いて負けになる。条件を満たさなければ同じ state を返す。
 */
export function chord(
  state: GameState,
  index: number,
  randomInt: RandomInt = secureRandomInt,
): GameState {
  if (state.phase !== 'playing' || !isValidIndex(state, index)) return state;
  if (state.cells[index] !== 'open' || !state.counts) return state;
  const count = state.counts[index];
  if (count === 0) return state;
  const around = neighbors(index, state.config.cols, state.config.rows);
  const flags = around.filter((i) => state.cells[i] === 'flag').length;
  if (flags !== count) return state;
  const targets = around.filter((i) => state.cells[i] === 'hidden');
  if (targets.length === 0) return state;
  return openCells(state, targets, randomInt);
}

/** 立てた旗の数 */
export function flagCount(state: GameState): number {
  return state.cells.filter((c) => c === 'flag').length;
}

/** 残りの地雷数の目安（地雷の数 − 旗の数。旗を立てすぎると負になる） */
export function minesLeft(state: GameState): number {
  return state.config.mines - flagCount(state);
}

export type CellKind =
  | 'hidden'
  | 'flag'
  /** 開いた安全なマス（周囲の地雷数は count） */
  | 'open'
  /** 負けたときに明らかになる、旗のない地雷 */
  | 'mine'
  /** 負けた原因の地雷 */
  | 'exploded'
  /** 負けたときに明らかになる、地雷のない場所に立てた旗 */
  | 'wrongFlag';

export interface CellView {
  kind: CellKind;
  /** kind が open のときの、周囲の地雷数（0〜8） */
  count: number;
}

/** 画面に出すマスの見え方。負けたあとは地雷と旗の間違いも明らかにする */
export function getCellView(state: GameState, index: number): CellView {
  const mark = state.cells[index];
  const isMine = state.mines?.[index] ?? false;
  if (state.phase === 'lost') {
    if (index === state.exploded) return { kind: 'exploded', count: 0 };
    if (mark === 'flag') {
      return { kind: isMine ? 'flag' : 'wrongFlag', count: 0 };
    }
    if (mark === 'hidden' && isMine) return { kind: 'mine', count: 0 };
  }
  if (mark === 'open') {
    return { kind: 'open', count: state.counts?.[index] ?? 0 };
  }
  return { kind: mark, count: 0 };
}

/** 難易度（初級・中級・上級）ごとの最短クリア時間（ミリ秒）。カスタムは記録しない */
export type BestRecords = Partial<Record<Difficulty, number>>;

export interface RecordUpdate {
  records: BestRecords;
  newBest: boolean;
}

/** クリア時間をベスト記録に反映する */
export function applyResult(
  records: BestRecords,
  difficulty: Difficulty,
  timeMs: number,
): RecordUpdate {
  // 保存値は1ms以上の整数（parseRecords が0以下を捨てるため、0msに丸めない）
  const time = Math.max(1, Math.floor(timeMs));
  const current = records[difficulty];
  if (current !== undefined && current <= time) {
    return { records, newBest: false };
  }
  return { records: { ...records, [difficulty]: time }, newBest: true };
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
    const value = (parsed as Record<string, unknown>)[d];
    if (typeof value === 'number' && Number.isFinite(value) && value >= 1) {
      result[d] = Math.floor(value);
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
