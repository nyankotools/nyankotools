import { RARITIES, type Rarity } from './types';

/** 既定の出現率（千分率。診断上の設計値。6.1） */
export const DEFAULT_RARITY_RATES: Record<Rarity, number> = {
  N: 400,
  R: 280,
  SR: 170,
  SSR: 90,
  UR: 45,
  LR: 15,
};

export function rarityRank(rarity: Rarity): number {
  return RARITIES.indexOf(rarity);
}

/** (0, 1) の値からレア度を決める（希少な順に累積して判定） */
export function rollRarity(u: number, rates: Record<Rarity, number>): Rarity {
  const point = u * 1000;
  let acc = 0;
  for (let i = RARITIES.length - 1; i > 0; i--) {
    acc += rates[RARITIES[i]];
    if (point < acc) return RARITIES[i];
  }
  return RARITIES[0];
}
