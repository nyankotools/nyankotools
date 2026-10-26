import { secureRandomInt } from '../random';
import type { RandomInt } from '../random';

export type { RandomInt };

/** 制限時間（ミリ秒） */
export const DURATION_MS = 30000;
/** 穴の数（3x3） */
export const HOLE_COUNT = 9;
/** 最初に出現するまでの時間（ミリ秒） */
export const FIRST_SPAWN_MS = 500;

/** 出現間隔（ミリ秒）。開始時 → 終了時で線形に短くなる */
export const SPAWN_INTERVAL_START_MS = 900;
export const SPAWN_INTERVAL_END_MS = 380;
/** 1匹が顔を出している時間（ミリ秒）。開始時 → 終了時で線形に短くなる */
export const VISIBLE_START_MS = 1200;
export const VISIBLE_END_MS = 650;

export interface Mole {
  hole: number;
  /** 引っ込む時刻（開始からの経過ミリ秒） */
  expiresAt: number;
}

export interface GameState {
  moles: Mole[];
  /** 次に出現させる時刻（開始からの経過ミリ秒） */
  nextSpawnAt: number;
  hits: number;
  /** 空の穴を叩いた回数 */
  misses: number;
  /** 叩かれずに引っ込んだ数 */
  escaped: number;
}

function clamp01(v: number): number {
  if (!Number.isFinite(v)) return 0;
  return Math.min(1, Math.max(0, v));
}

function lerp(from: number, to: number, ratio: number): number {
  return Math.round(from + (to - from) * clamp01(ratio));
}

/** 経過時間に応じた出現間隔。時間が進むほど短くなる */
export function spawnIntervalMs(elapsedMs: number): number {
  return lerp(
    SPAWN_INTERVAL_START_MS,
    SPAWN_INTERVAL_END_MS,
    elapsedMs / DURATION_MS,
  );
}

/** 経過時間に応じた、顔を出している時間。時間が進むほど短くなる */
export function visibleMs(elapsedMs: number): number {
  return lerp(VISIBLE_START_MS, VISIBLE_END_MS, elapsedMs / DURATION_MS);
}

export function createGame(): GameState {
  return {
    moles: [],
    nextSpawnAt: FIRST_SPAWN_MS,
    hits: 0,
    misses: 0,
    escaped: 0,
  };
}

/** 空いている穴からランダムに1つ選ぶ。空きが無ければ null */
export function pickHole(
  occupied: readonly number[],
  randomInt: RandomInt = secureRandomInt,
  holeCount = HOLE_COUNT,
): number | null {
  const free: number[] = [];
  for (let i = 0; i < holeCount; i++) {
    if (!occupied.includes(i)) free.push(i);
  }
  if (free.length === 0) return null;
  return free[randomInt(free.length)];
}

/**
 * 時間を elapsedMs まで進める（引っ込んだモグラの処理と、新しい出現）。
 * 元の state は書き換えず、新しい state を返す。
 */
export function advance(
  state: GameState,
  elapsedMs: number,
  randomInt: RandomInt = secureRandomInt,
): GameState {
  const limit = Math.min(elapsedMs, DURATION_MS);
  let moles = state.moles;
  let escaped = state.escaped;
  let nextSpawnAt = state.nextSpawnAt;

  // 出現時刻ごとに処理して、時刻が飛んでも取りこぼさないようにする
  while (nextSpawnAt <= limit && nextSpawnAt < DURATION_MS) {
    const at = nextSpawnAt;
    const stillOut = moles.filter((m) => m.expiresAt > at);
    escaped += moles.length - stillOut.length;
    moles = stillOut;
    const hole = pickHole(
      moles.map((m) => m.hole),
      randomInt,
    );
    if (hole !== null) {
      moles = [...moles, { hole, expiresAt: at + visibleMs(at) }];
    }
    nextSpawnAt = at + spawnIntervalMs(at);
  }

  // 終了後は残っているモグラもすべて引っ込む
  const cutoff = elapsedMs >= DURATION_MS ? Infinity : limit;
  const stillOut = moles.filter((m) => m.expiresAt > cutoff);
  escaped += moles.length - stillOut.length;

  return { ...state, moles: stillOut, nextSpawnAt, escaped };
}

export interface WhackResult {
  state: GameState;
  hit: boolean;
}

/** 穴を叩く。モグラがいれば命中、いなければミス。 */
export function whack(
  state: GameState,
  hole: number,
  elapsedMs: number,
): WhackResult {
  if (elapsedMs >= DURATION_MS) return { state, hit: false };
  const target = state.moles.find(
    (m) => m.hole === hole && m.expiresAt > elapsedMs,
  );
  if (!target) {
    return { state: { ...state, misses: state.misses + 1 }, hit: false };
  }
  return {
    state: {
      ...state,
      moles: state.moles.filter((m) => m !== target),
      hits: state.hits + 1,
    },
    hit: true,
  };
}

export function isFinished(elapsedMs: number): boolean {
  return elapsedMs >= DURATION_MS;
}

export function remainingMs(elapsedMs: number): number {
  return Math.max(0, DURATION_MS - Math.max(0, elapsedMs));
}

/** 命中率（0〜100 の整数）。叩いていなければ 0 */
export function accuracyPercent(state: GameState): number {
  const total = state.hits + state.misses;
  if (total === 0) return 0;
  return Math.round((state.hits / total) * 100);
}

/** 保存値を読み取る。壊れた値は 0 として扱う */
export function parseBest(raw: string | null | undefined): number {
  if (!raw) return 0;
  const n = Number(raw);
  return Number.isInteger(n) && n > 0 && n < 100000 ? n : 0;
}

export function isNewBest(score: number, best: number): boolean {
  return score > 0 && score > best;
}
