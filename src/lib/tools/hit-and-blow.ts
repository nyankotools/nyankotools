/**
 * 数当て（Hit & Blow）のロジック。
 * 隠された数字列を推理する。位置も数字も合っていれば Hit、数字だけ合っていれば Blow。
 */
import { secureRandomInt, shuffle, type RandomInt } from '../random';

export type { RandomInt };

export const MIN_DIGITS = 3;
export const MAX_DIGITS = 5;
export const DEFAULT_DIGITS = 4;

export interface GameConfig {
  /** 桁数（3〜5） */
  digits: number;
  /** 同じ数字を複数回使えるか */
  allowRepeat: boolean;
}

export interface GuessResult {
  digits: number[];
  hit: number;
  blow: number;
}

export type Phase = 'playing' | 'won' | 'gaveUp';

export interface GameState {
  config: GameConfig;
  secret: number[];
  guesses: GuessResult[];
  phase: Phase;
}

export type GuessError =
  'empty' | 'nonDigit' | 'length' | 'repeat' | 'finished';

export type ParseResult =
  | { ok: true; digits: number[] }
  | { ok: false; error: Exclude<GuessError, 'finished'> };

/** 設定を正規化する（桁数は3〜5の整数に丸める） */
export function normalizeConfig(config: GameConfig): GameConfig {
  const n = Number.isFinite(config.digits)
    ? Math.round(config.digits)
    : DEFAULT_DIGITS;
  return {
    digits: Math.min(MAX_DIGITS, Math.max(MIN_DIGITS, n)),
    allowRepeat: config.allowRepeat,
  };
}

/** 答えを作る。重複なしのときは 0〜9 から重複せずに選ぶ */
export function generateSecret(
  config: GameConfig,
  randomInt: RandomInt = secureRandomInt,
): number[] {
  const { digits, allowRepeat } = normalizeConfig(config);
  if (allowRepeat) {
    return Array.from({ length: digits }, () => randomInt(10));
  }
  const pool = shuffle([0, 1, 2, 3, 4, 5, 6, 7, 8, 9], randomInt);
  return pool.slice(0, digits);
}

/** 入力文字列を桁の配列にする。全角数字と前後の空白は受け付ける */
export function parseGuess(text: string, config: GameConfig): ParseResult {
  const cleaned = text.normalize('NFKC').trim();
  if (cleaned === '') return { ok: false, error: 'empty' };
  if (!/^[0-9]+$/.test(cleaned)) return { ok: false, error: 'nonDigit' };
  if (cleaned.length !== config.digits) return { ok: false, error: 'length' };
  const digits = Array.from(cleaned, Number);
  if (!config.allowRepeat && new Set(digits).size !== digits.length) {
    return { ok: false, error: 'repeat' };
  }
  return { ok: true, digits };
}

/** Hit（位置と数字が一致）と Blow（数字のみ一致）を数える。重複ありでも二重に数えない */
export function evaluate(
  secret: readonly number[],
  guess: readonly number[],
): { hit: number; blow: number } {
  let hit = 0;
  const secretCounts = new Array<number>(10).fill(0);
  const guessCounts = new Array<number>(10).fill(0);
  const length = Math.min(secret.length, guess.length);
  for (let i = 0; i < length; i++) {
    if (secret[i] === guess[i]) {
      hit++;
    } else {
      secretCounts[secret[i]]++;
      guessCounts[guess[i]]++;
    }
  }
  let blow = 0;
  for (let d = 0; d < 10; d++)
    blow += Math.min(secretCounts[d], guessCounts[d]);
  return { hit, blow };
}

export function newGame(
  config: GameConfig,
  randomInt: RandomInt = secureRandomInt,
): GameState {
  const normalized = normalizeConfig(config);
  return {
    config: normalized,
    secret: generateSecret(normalized, randomInt),
    guesses: [],
    phase: 'playing',
  };
}

export type SubmitResult =
  { ok: true; state: GameState } | { ok: false; error: GuessError };

/** 推測を1回行う。全桁が Hit になれば勝ち */
export function submitGuess(state: GameState, text: string): SubmitResult {
  if (state.phase !== 'playing') return { ok: false, error: 'finished' };
  const parsed = parseGuess(text, state.config);
  if (!parsed.ok) return parsed;
  const { hit, blow } = evaluate(state.secret, parsed.digits);
  const won = hit === state.config.digits;
  return {
    ok: true,
    state: {
      ...state,
      guesses: [...state.guesses, { digits: parsed.digits, hit, blow }],
      phase: won ? 'won' : 'playing',
    },
  };
}

/** ギブアップ。すでに終わっているゲームはそのまま返す */
export function giveUp(state: GameState): GameState {
  return state.phase === 'playing' ? { ...state, phase: 'gaveUp' } : state;
}

export function formatDigits(digits: readonly number[]): string {
  return digits.join('');
}

/** 組み合わせの総数（重複なし: 10P桁、重複あり: 10^桁） */
export function countPatterns(config: GameConfig): number {
  const { digits, allowRepeat } = normalizeConfig(config);
  if (allowRepeat) return 10 ** digits;
  let n = 1;
  for (let i = 0; i < digits; i++) n *= 10 - i;
  return n;
}
