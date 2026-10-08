import { secureRandomInt } from '../random';
import type { RandomInt } from '../random';

export type { RandomInt };

export const FORTUNE_IDS = [
  'daikichi',
  'kichi',
  'chukichi',
  'shokichi',
  'suekichi',
  'kyo',
  'daikyo',
] as const;
export type FortuneId = (typeof FORTUNE_IDS)[number];

export const ITEM_IDS = [
  'wish',
  'love',
  'work',
  'study',
  'health',
  'money',
] as const;
export type ItemId = (typeof ITEM_IDS)[number];

export const TIERS = ['good', 'normal', 'bad'] as const;
export type Tier = (typeof TIERS)[number];

export const COLOR_IDS = [
  'red',
  'orange',
  'yellow',
  'green',
  'blue',
  'purple',
  'pink',
  'white',
] as const;
export type ColorId = (typeof COLOR_IDS)[number];

/** 運勢文・項目文それぞれの文例数（辞書側の配列の長さと揃える） */
export const VARIANTS = 2;
export const MAX_LUCKY_NUMBER = 99;
export const MAX_NAME_LENGTH = 50;

/** 運勢ごとの出現率（合計100）。大吉・大凶は少なめ */
export const FORTUNE_WEIGHTS: Record<FortuneId, number> = {
  daikichi: 15,
  kichi: 25,
  chukichi: 20,
  shokichi: 15,
  suekichi: 15,
  kyo: 8,
  daikyo: 2,
};

/** 運勢ごとの、各項目が [good, normal, bad] になる重み */
export const TIER_WEIGHTS: Record<
  FortuneId,
  readonly [number, number, number]
> = {
  daikichi: [85, 15, 0],
  kichi: [60, 35, 5],
  chukichi: [45, 45, 10],
  shokichi: [30, 55, 15],
  suekichi: [20, 50, 30],
  kyo: [5, 40, 55],
  daikyo: [0, 15, 85],
};

export interface ItemFortune {
  item: ItemId;
  tier: Tier;
  variant: number;
}

export interface OmikujiResult {
  fortune: FortuneId;
  /** 運勢文の文例番号 */
  message: number;
  items: ItemFortune[];
  luckyColor: ColorId;
  luckyNumber: number;
}

/** 重みに比例してインデックスを選ぶ */
export function pickWeighted(
  weights: readonly number[],
  randomInt: RandomInt,
): number {
  const total = weights.reduce((sum, w) => sum + w, 0);
  if (total <= 0) throw new RangeError('total weight must be positive');
  let n = randomInt(total);
  for (let i = 0; i < weights.length; i++) {
    if (n < weights[i]) return i;
    n -= weights[i];
  }
  return weights.length - 1;
}

/** おみくじ1回分を引く。乱数は差し替え可能 */
export function drawOmikuji(
  randomInt: RandomInt = secureRandomInt,
): OmikujiResult {
  const fortune =
    FORTUNE_IDS[
      pickWeighted(
        FORTUNE_IDS.map((id) => FORTUNE_WEIGHTS[id]),
        randomInt,
      )
    ];
  const message = randomInt(VARIANTS);
  const items = ITEM_IDS.map((item) => {
    const tier = TIERS[pickWeighted(TIER_WEIGHTS[fortune], randomInt)];
    return { item, tier, variant: randomInt(VARIANTS) };
  });
  const luckyColor = COLOR_IDS[randomInt(COLOR_IDS.length)];
  const luckyNumber = randomInt(MAX_LUCKY_NUMBER) + 1;
  return { fortune, message, items, luckyColor, luckyNumber };
}

/** 端末ローカル日付を YYYY-MM-DD にする */
export function localDateKey(date: Date): string {
  const y = String(date.getFullYear()).padStart(4, '0');
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

/** 名前の表記ゆれ（前後空白・全角半角・大文字小文字）をそろえる */
export function normalizeName(name: string): string {
  return name.normalize('NFKC').trim().toLowerCase().slice(0, MAX_NAME_LENGTH);
}

/** 文字列 → 32bitハッシュ（FNV-1a） */
export function hashString(text: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < text.length; i++) {
    h ^= text.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return h >>> 0;
}

/** 決定的な乱数生成器（mulberry32）。0以上1未満を返す */
export function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** シードから決定的な RandomInt を作る */
export function seededRandomInt(seed: number): RandomInt {
  const rng = mulberry32(seed);
  return (max) => {
    if (!Number.isInteger(max) || max < 1) {
      throw new RangeError('max must be a positive integer');
    }
    return Math.floor(rng() * max);
  };
}

/** 「今日の運勢」: 日付と名前から決まる（同じ日・同じ名前なら同じ結果） */
export function drawDaily(date: Date, name = ''): OmikujiResult {
  const seed = hashString(
    `omikuji|${localDateKey(date)}|${normalizeName(name)}`,
  );
  return drawOmikuji(seededRandomInt(seed));
}

/** 共有・コピー用の整形はUI側（辞書）で行うため、ここでは順位のみ返す（大吉=6 … 大凶=0） */
export function fortuneRank(id: FortuneId): number {
  return FORTUNE_IDS.length - 1 - FORTUNE_IDS.indexOf(id);
}
