/**
 * じゃんけん（CPU対戦・連勝記録）のロジック。
 * CPUの手は roulette-dice の暗号論的乱数（secureRandomInt）で偏りなく選ぶ。
 */
import { secureRandomInt } from './roulette-dice';
import type { RandomInt } from './roulette-dice';

export const HANDS = ['rock', 'scissors', 'paper'] as const;
export type Hand = (typeof HANDS)[number];
export type Outcome = 'win' | 'lose' | 'draw';

/** 各手が勝つ相手の手 */
const BEATS: Record<Hand, Hand> = {
  rock: 'scissors',
  scissors: 'paper',
  paper: 'rock',
};

/** プレイヤー視点の勝敗 */
export function judge(player: Hand, cpu: Hand): Outcome {
  if (player === cpu) return 'draw';
  return BEATS[player] === cpu ? 'win' : 'lose';
}

export function pickCpuHand(randomInt: RandomInt = secureRandomInt): Hand {
  return HANDS[randomInt(HANDS.length)];
}

export interface Stats {
  wins: number;
  losses: number;
  draws: number;
  /** 保存対象の最高連勝 */
  bestStreak: number;
}

export interface GameState {
  stats: Stats;
  /** 現在の連勝数（ページを開いている間のみ） */
  streak: number;
}

export interface Round {
  player: Hand;
  cpu: Hand;
  outcome: Outcome;
}

export const HISTORY_LIMIT = 20;

export function emptyStats(): Stats {
  return { wins: 0, losses: 0, draws: 0, bestStreak: 0 };
}

/**
 * 1回の結果を反映した新しい状態を返す。
 * 勝つと連勝+1、負けると0に戻る。あいこは連勝を維持する。
 */
export function applyOutcome(state: GameState, outcome: Outcome): GameState {
  const { stats } = state;
  if (outcome === 'win') {
    const streak = state.streak + 1;
    return {
      streak,
      stats: {
        ...stats,
        wins: stats.wins + 1,
        bestStreak: Math.max(stats.bestStreak, streak),
      },
    };
  }
  if (outcome === 'lose') {
    return { streak: 0, stats: { ...stats, losses: stats.losses + 1 } };
  }
  return { streak: state.streak, stats: { ...stats, draws: stats.draws + 1 } };
}

/** 履歴に追加する（新しいものが先頭、最大 HISTORY_LIMIT 件） */
export function addHistory(history: readonly Round[], round: Round): Round[] {
  return [round, ...history].slice(0, HISTORY_LIMIT);
}

function nonNegativeInt(value: unknown): number | null {
  return typeof value === 'number' && Number.isFinite(value) && value >= 0
    ? Math.floor(value)
    : null;
}

/** localStorage の文字列を読み取る。壊れた値は空の記録にする */
export function parseStats(raw: string | null): Stats {
  if (!raw) return emptyStats();
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return emptyStats();
  }
  if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) {
    return emptyStats();
  }
  const o = parsed as Record<string, unknown>;
  return {
    wins: nonNegativeInt(o.wins) ?? 0,
    losses: nonNegativeInt(o.losses) ?? 0,
    draws: nonNegativeInt(o.draws) ?? 0,
    bestStreak: nonNegativeInt(o.bestStreak) ?? 0,
  };
}

export function serializeStats(stats: Stats): string {
  return JSON.stringify(stats);
}
