import { describe, expect, it } from 'vitest';
import {
  REVEAL_PLANS,
  STAGE_DELAYS_MS,
  confettiPieces,
  revealDuration,
} from './reveal';
import { RARITIES } from './types';

describe('結果発表の演出', () => {
  it('どのレア度でも演出は3秒以内（6.3）', () => {
    for (const rarity of RARITIES) {
      expect(revealDuration(rarity), rarity).toBeLessThanOrEqual(3000);
    }
  });

  it('全画面演出はUR以上、紙吹雪はLRのみ', () => {
    expect(RARITIES.filter((r) => REVEAL_PLANS[r].overlayMs > 0)).toEqual([
      'UR',
      'LR',
    ]);
    expect(RARITIES.filter((r) => REVEAL_PLANS[r].confetti > 0)).toEqual([
      'LR',
    ]);
  });

  it('段階表示は 称号 → レア度 → 詳細 の順に遅れる', () => {
    expect([...STAGE_DELAYS_MS]).toEqual(
      [...STAGE_DELAYS_MS].sort((a, b) => a - b),
    );
    expect(STAGE_DELAYS_MS[0]).toBe(0);
  });

  it('紙吹雪は同じ seed なら同じ配置で、落ち切るまでが演出の長さに収まる', () => {
    const total = revealDuration('LR');
    const pieces = confettiPieces(40, 12345, total);
    expect(pieces).toHaveLength(40);
    expect(confettiPieces(40, 12345, total)).toEqual(pieces);
    expect(confettiPieces(40, 54321, total)).not.toEqual(pieces);
    for (const p of pieces) {
      expect(p.left).toBeGreaterThanOrEqual(0);
      expect(p.left).toBeLessThanOrEqual(100);
      expect(p.delay).toBeGreaterThanOrEqual(0);
      expect(p.duration).toBeGreaterThan(0);
      expect(p.delay + p.duration).toBeLessThanOrEqual(total);
      expect(p.color).toMatch(/^#[0-9a-f]{6}$/);
    }
  });
});
