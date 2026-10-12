import { secureRandomInt } from '../random';
import type { RandomInt } from '../random';

export type { RandomInt };

/** 制限時間（ミリ秒） */
export const TIME_LIMIT_MS = 60_000;
/** 間違えたときに引かれる時間（ミリ秒） */
export const PENALTY_MS = 3_000;
/** タイルの一辺の最大数 */
export const MAX_GRID = 7;
/** 色の差（明るさのパーセント点）の最大・最小 */
const START_DIFF = 22;
const MIN_DIFF = 1.5;
/** 1ステージごとに差を掛ける係数 */
const DIFF_DECAY = 0.89;

export const RANK_IDS = [
  'beginner',
  'average',
  'good',
  'great',
  'master',
] as const;
export type RankId = (typeof RANK_IDS)[number];

/** ランクの下限（正解数以上でそのランク）。昇順 */
const RANK_FLOORS: readonly [RankId, number][] = [
  ['beginner', 0],
  ['average', 15],
  ['good', 25],
  ['great', 35],
  ['master', 45],
];

export interface Round {
  /** 一辺のタイル数 */
  size: number;
  /** 色の違うタイルの位置（0〜size*size-1） */
  oddIndex: number;
  /** 通常のタイルの色（CSSの hsl() 文字列） */
  baseColor: string;
  /** 違う色のタイルの色（CSSの hsl() 文字列） */
  oddColor: string;
  /** 2色の明るさの差（パーセント点） */
  diff: number;
}

/** ステージ（1始まり）に応じた一辺のタイル数。2→3→…→MAX_GRID と増える */
export function gridSizeFor(stage: number): number {
  const s = Math.max(1, Math.floor(stage));
  return Math.min(MAX_GRID, 2 + Math.floor((s - 1) / 2));
}

/** ステージ（1始まり）に応じた明るさの差。進むほど小さくなる */
export function diffFor(stage: number): number {
  const s = Math.max(1, Math.floor(stage));
  return Math.max(MIN_DIFF, START_DIFF * DIFF_DECAY ** (s - 1));
}

function hsl(h: number, s: number, l: number): string {
  return `hsl(${h} ${s}% ${l}%)`;
}

/** そのステージの問題を作る */
export function createRound(
  stage: number,
  randomInt: RandomInt = secureRandomInt,
): Round {
  const size = gridSizeFor(stage);
  const diff = diffFor(stage);
  const hue = randomInt(360);
  const saturation = 45 + randomInt(31); // 45〜75
  const lightness = 35 + randomInt(31); // 35〜65
  // 明るさは 35〜65% で差は最大22なので、足しても引いても 0〜100% に収まる
  const sign = randomInt(2) === 0 ? 1 : -1;
  const oddLightness = Math.round((lightness + sign * diff) * 10) / 10;
  return {
    size,
    oddIndex: randomInt(size * size),
    baseColor: hsl(hue, saturation, lightness),
    oddColor: hsl(hue, saturation, oddLightness),
    diff,
  };
}

/** 経過時間とミスの回数から、残り時間（ミリ秒、0未満にはならない）を求める */
export function remainingMs(elapsedMs: number, mistakes: number): number {
  const elapsed = Number.isFinite(elapsedMs) ? Math.max(0, elapsedMs) : 0;
  const count = Number.isFinite(mistakes)
    ? Math.max(0, Math.floor(mistakes))
    : 0;
  const penalty = count * PENALTY_MS;
  return Math.max(0, TIME_LIMIT_MS - elapsed - penalty);
}

/** 正解数からランクを決める（娯楽用の目安であり、色覚の診断ではない） */
export function rankFor(score: number): RankId {
  let result: RankId = 'beginner';
  for (const [id, floor] of RANK_FLOORS) {
    if (score >= floor) result = id;
  }
  return result;
}

/** localStorage の文字列からベストスコアを復元する。壊れた値は 0 とする */
export function parseBest(raw: string | null): number {
  if (!raw) return 0;
  const value = Number(raw);
  if (!Number.isFinite(value) || value < 0) return 0;
  return Math.floor(value);
}

/** 秒を m:ss 形式にする（切り上げ） */
export function formatSeconds(ms: number): string {
  const total = Math.max(0, Math.ceil(ms / 1000));
  return `${Math.floor(total / 60)}:${String(total % 60).padStart(2, '0')}`;
}
