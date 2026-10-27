import { describe, expect, it } from 'vitest';
import { resultSeed } from './compose';
import { unitHash } from './hash';
import { DEFAULT_RARITY_RATES, rarityRank, rollRarity } from './rarity';
import { randomInput, testRandom } from './test-theme';
import { RARITIES, type Rarity } from './types';

describe('rarity', () => {
  it('累積閾値で判定する（LR<0.015 / UR<0.060 / SSR<0.150 / SR<0.320 / R<0.600）', () => {
    const r = (u: number) => rollRarity(u, DEFAULT_RARITY_RATES);
    expect(r(0.0149)).toBe('LR');
    expect(r(0.015)).toBe('UR');
    expect(r(0.0599)).toBe('UR');
    expect(r(0.06)).toBe('SSR');
    expect(r(0.1499)).toBe('SSR');
    expect(r(0.15)).toBe('SR');
    expect(r(0.3199)).toBe('SR');
    expect(r(0.32)).toBe('R');
    expect(r(0.5999)).toBe('R');
    expect(r(0.6)).toBe('N');
    expect(r(0.9999)).toBe('N');
  });

  it('端の値: u=0 は最希少（LR）、1 に近い値は N', () => {
    expect(rollRarity(0, DEFAULT_RARITY_RATES)).toBe('LR');
    expect(rollRarity(1 - 2 ** -53, DEFAULT_RARITY_RATES)).toBe('N');
  });

  it('出現率0のレア度は出ない（0のみの表は全部 N、LR 100% なら全部 LR）', () => {
    const allN = { N: 1000, R: 0, SR: 0, SSR: 0, UR: 0, LR: 0 };
    const allLR = { N: 0, R: 0, SR: 0, SSR: 0, UR: 0, LR: 1000 };
    for (const u of [0, 0.25, 0.5, 0.999]) {
      expect(rollRarity(u, allN)).toBe('N');
      expect(rollRarity(u, allLR)).toBe('LR');
    }
  });

  it('rarityRank は N が最小、LR が最大', () => {
    expect(rarityRank('N')).toBe(0);
    expect(rarityRank('LR')).toBe(5);
  });

  it('10万件で各レア度が設計値 ±0.5pt 以内', () => {
    const rand = testRandom(42);
    const counts = Object.fromEntries(RARITIES.map((r) => [r, 0])) as Record<
      Rarity,
      number
    >;
    const n = 100000;
    for (let i = 0; i < n; i++) {
      const { answers, variant } = randomInput(rand);
      const seed = resultSeed('test', answers, variant);
      counts[rollRarity(unitHash(seed, 'rarity'), DEFAULT_RARITY_RATES)]++;
    }
    for (const r of RARITIES) {
      expect(
        Math.abs((counts[r] / n) * 100 - DEFAULT_RARITY_RATES[r] / 10),
      ).toBeLessThan(0.5);
    }
  });
});
