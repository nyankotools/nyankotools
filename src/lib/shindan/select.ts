import { unitHash } from './hash';
import { rarityRank } from './rarity';
import type { AxisResult, Part, Rarity, Slot } from './types';

export function isCandidate(
  part: Part,
  axes: Record<string, AxisResult>,
  rarity: Rarity,
): boolean {
  if (part.rarityMin && rarityRank(rarity) < rarityRank(part.rarityMin)) {
    return false;
  }
  return (part.when ?? []).every((cond) => axes[cond.axis]?.pole === cond.pole);
}

/**
 * 重み付き rendezvous hashing（HRW）で部品を選ぶ（16.5）。
 * 部品ごとに独立したハッシュで順位を付けるため、部品の追加・削除で結果が変わるのは
 * その部品が勝つ（勝っていた）人だけになる。
 */
export function selectParts(
  slot: Slot,
  seed: number,
  axes: Record<string, AxisResult>,
  rarity: Rarity,
): string[] {
  if (slot.rarityMin && rarityRank(rarity) < rarityRank(slot.rarityMin)) {
    return [];
  }
  return slot.parts
    .filter((part) => isCandidate(part, axes, rarity))
    .map((part) => ({
      id: part.id,
      score:
        -Math.log(unitHash(seed, `${slot.id}|${part.id}`)) / (part.weight ?? 1),
    }))
    .sort((a, b) => a.score - b.score || (a.id < b.id ? -1 : 1))
    .slice(0, slot.count)
    .map((p) => p.id);
}
