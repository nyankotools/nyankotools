/**
 * 結果発表の演出（6.3・9章）。称号 → レア度 → 詳細 の順に段階表示し、
 * UR以上は全画面の演出、LRは紙吹雪を足す。演出は合計3秒以内・スキップ可能で、
 * prefers-reduced-motion のときは呼び出し側で演出ごと省く。
 */
import { unitHash } from './hash';
import type { Rarity } from './types';

export type RevealPlan = {
  /** 全画面演出の長さ（ms。0 なら出さない）。段階表示はこの後に始まる */
  overlayMs: number;
  /** 紙吹雪の数 */
  confetti: number;
};

export const REVEAL_PLANS: Record<Rarity, RevealPlan> = {
  N: { overlayMs: 0, confetti: 0 },
  R: { overlayMs: 0, confetti: 0 },
  SR: { overlayMs: 0, confetti: 0 },
  SSR: { overlayMs: 0, confetti: 0 },
  UR: { overlayMs: 1000, confetti: 0 },
  LR: { overlayMs: 1500, confetti: 40 },
};

/** 段階表示の各段の開始（全画面演出の後から数えた ms）。称号・レア度・詳細の順 */
export const STAGE_DELAYS_MS = [0, 350, 700] as const;
/** 1段のアニメーションの長さ（ms） */
export const STAGE_ANIMATION_MS = 400;

/** 演出全体の長さ（ms）。全画面演出 + 最後の段が出きるまで */
export function revealDuration(rarity: Rarity): number {
  return (
    REVEAL_PLANS[rarity].overlayMs +
    STAGE_DELAYS_MS[STAGE_DELAYS_MS.length - 1] +
    STAGE_ANIMATION_MS
  );
}

export type ConfettiPiece = {
  /** 横位置（%） */
  left: number;
  /** 開始の遅れ（ms） */
  delay: number;
  /** 落ちる時間（ms） */
  duration: number;
  /** 回転（deg） */
  rotate: number;
  color: string;
};

const CONFETTI_COLORS = ['#fcd34d', '#f9a8d4', '#c4b5fd', '#7dd3fc', '#fde68a'];

/**
 * 紙吹雪の配置。結果の seed から決めるので、同じ結果なら同じ配置になる（テストで再現できる）。
 * 落ち切るまでの時間（delay + duration）は totalMs に収める。
 */
export function confettiPieces(
  count: number,
  seed: number,
  totalMs: number,
): ConfettiPiece[] {
  return Array.from({ length: count }, (_, i) => {
    const u = (key: string) => unitHash(seed, `confetti|${i}|${key}`);
    const delay = Math.floor(u('delay') * totalMs * 0.3);
    // delay ≤ 30%・duration ≤ 70% なので、落ち切るまでが totalMs を超えない
    const duration = Math.floor(totalMs * (0.5 + u('duration') * 0.2));
    return {
      left: Math.round(u('left') * 1000) / 10,
      delay,
      duration,
      rotate: Math.floor(u('rotate') * 720) - 360,
      color: CONFETTI_COLORS[Math.floor(u('color') * CONFETTI_COLORS.length)],
    };
  });
}
