/**
 * ルーレット・抽選・サイコロのロジック。
 * 乱数は crypto.getRandomValues（棄却サンプリングで偏りなし）。テストでは randomInt を差し替える。
 */

/** 0以上 max 未満の整数を返す関数 */
export type RandomInt = (max: number) => number;

export const MAX_ITEMS = 100;
export const MAX_DICE_COUNT = 100;
export const MAX_DICE_SIDES = 1000;

export const secureRandomInt: RandomInt = (max) => {
  if (!Number.isInteger(max) || max < 1 || max > 0x100000000) {
    throw new RangeError('max must be an integer between 1 and 2^32');
  }
  const limit = Math.floor(0x100000000 / max) * max;
  const buffer = new Uint32Array(1);
  for (;;) {
    crypto.getRandomValues(buffer);
    if (buffer[0] < limit) return buffer[0] % max;
  }
};

/** 改行区切りの入力から項目を取り出す（前後の空白と空行を除く） */
export function parseItems(text: string): string[] {
  return text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line !== '');
}

/** 項目の中から1つ選び、そのインデックスを返す。項目が空なら -1 */
export function pickIndex(
  itemCount: number,
  randomInt: RandomInt = secureRandomInt,
): number {
  return itemCount < 1 ? -1 : randomInt(itemCount);
}

/** 重複なしで count 個を選ぶ（選んだ順）。count は 0〜項目数に丸める */
export function drawLots<T>(
  items: readonly T[],
  count: number,
  randomInt: RandomInt = secureRandomInt,
): T[] {
  const pool = [...items];
  const n = Math.max(0, Math.min(Math.floor(count), pool.length));
  for (let i = 0; i < n; i++) {
    const j = i + randomInt(pool.length - i);
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  return pool.slice(0, n);
}

/**
 * 項目 index が真上の矢印に止まるための、ホイールの回転角（度・時計回り）を返す。
 * 現在の角度より必ず大きく、extraTurns 周以上回る。jitter は中心からのずれ（度）。
 */
export function targetRotation(
  current: number,
  index: number,
  itemCount: number,
  extraTurns: number,
  jitter = 0,
): number {
  const segment = 360 / itemCount;
  const center = (index + 0.5) * segment;
  const base = Math.ceil(current / 360) * 360 + 360 * extraTurns;
  return base + (360 - center) + jitter;
}

/** 回転角のとき、真上の矢印が指している項目のインデックス */
export function indexAtPointer(rotation: number, itemCount: number): number {
  const angle = (((-rotation % 360) + 360) % 360) / (360 / itemCount);
  return Math.min(itemCount - 1, Math.floor(angle));
}

export interface DiceSpec {
  count: number;
  sides: number;
  modifier: number;
}

export interface DiceResult {
  rolls: number[];
  sum: number;
  total: number;
}

/** 入力値の検証。問題がなければ null、あればエラーの種類を返す */
export function validateDice(
  spec: DiceSpec,
): 'count' | 'sides' | 'modifier' | null {
  if (
    !Number.isInteger(spec.count) ||
    spec.count < 1 ||
    spec.count > MAX_DICE_COUNT
  ) {
    return 'count';
  }
  if (
    !Number.isInteger(spec.sides) ||
    spec.sides < 2 ||
    spec.sides > MAX_DICE_SIDES
  ) {
    return 'sides';
  }
  if (!Number.isInteger(spec.modifier) || Math.abs(spec.modifier) > 1e6) {
    return 'modifier';
  }
  return null;
}

export function rollDice(
  spec: DiceSpec,
  randomInt: RandomInt = secureRandomInt,
): DiceResult {
  const error = validateDice(spec);
  if (error) throw new RangeError(`invalid dice spec: ${error}`);
  const rolls = Array.from(
    { length: spec.count },
    () => randomInt(spec.sides) + 1,
  );
  const sum = rolls.reduce((a, b) => a + b, 0);
  return { rolls, sum, total: sum + spec.modifier };
}

export interface WeightedItem {
  /** 入力した行そのまま（重みの指定を含む） */
  raw: string;
  label: string;
  weight: number;
}

export const MIN_WEIGHT = 0.001;
export const MAX_WEIGHT = 1_000_000;

/**
 * 「項目名*3」「項目名 * 0.5」のように、行末に `*` と正の数を書くと重みを指定できる。
 * 指定がない行・数値として不正な行・重みが0以下や大きすぎる行は、行全体を項目名として重み1で扱う。
 */
export function parseWeightedItems(text: string): WeightedItem[] {
  return parseItems(text).map((raw) => {
    const match = /^(.*\S)\s*[*＊]\s*(\d+(?:\.\d+)?)$/.exec(raw);
    if (match) {
      const weight = Number(match[2]);
      if (weight >= MIN_WEIGHT && weight <= MAX_WEIGHT) {
        return { raw, label: match[1], weight };
      }
    }
    return { raw, label: raw, weight: 1 };
  });
}

/** 入力欄の1行として書き出す（読み戻したとき、項目名と重みが元のとおりになるようにする） */
export function formatItemLine(label: string, weight: number): string {
  const endsWithWeight = /[*＊]\s*\d+(?:\.\d+)?$/.test(label);
  return weight === 1 && !endsWithWeight ? label : `${label}*${weight}`;
}

/** 重みに比例した確率で1つ選び、そのインデックスを返す。項目が空なら -1 */
export function pickWeightedIndex(
  weights: readonly number[],
  randomInt: RandomInt = secureRandomInt,
): number {
  if (weights.length === 0) return -1;
  const total = weights.reduce((a, b) => a + b, 0);
  const point = (randomInt(0x100000000) / 0x100000000) * total;
  let cumulative = 0;
  for (let i = 0; i < weights.length; i++) {
    cumulative += weights[i];
    if (point < cumulative) return i;
  }
  return weights.length - 1;
}

/** 重みに比例した確率で、重複なしに count 個を選ぶ（選んだ順） */
export function drawWeightedLots<T>(
  items: readonly T[],
  weights: readonly number[],
  count: number,
  randomInt: RandomInt = secureRandomInt,
): T[] {
  const pool = items.map((item, i) => ({ item, weight: weights[i] ?? 1 }));
  const n = Math.max(0, Math.min(Math.floor(count), pool.length));
  const result: T[] = [];
  for (let i = 0; i < n; i++) {
    const index = pickWeightedIndex(
      pool.map((p) => p.weight),
      randomInt,
    );
    result.push(pool[index].item);
    pool.splice(index, 1);
  }
  return result;
}

/** 各項目の確率（0〜1） */
export function probabilities(weights: readonly number[]): number[] {
  const total = weights.reduce((a, b) => a + b, 0);
  return weights.map((w) => (total > 0 ? w / total : 0));
}

/** 重み付きホイールで、項目 index の扇形の中心（度・真上から時計回り）と幅 */
export function segmentSpan(
  weights: readonly number[],
  index: number,
): { start: number; width: number } {
  const total = weights.reduce((a, b) => a + b, 0);
  const before = weights.slice(0, index).reduce((a, b) => a + b, 0);
  return {
    start: (before / total) * 360,
    width: (weights[index] / total) * 360,
  };
}

/**
 * 重み付きホイールで項目 index の扇形が真上の矢印に止まる回転角。
 * jitterRatio（-0.5〜0.5）は扇形の幅に対する中心からのずれ。
 */
export function weightedTargetRotation(
  current: number,
  weights: readonly number[],
  index: number,
  extraTurns: number,
  jitterRatio = 0,
): number {
  const { start, width } = segmentSpan(weights, index);
  const center = start + width / 2;
  const base = Math.ceil(current / 360) * 360 + 360 * extraTurns;
  return base + (360 - center) + jitterRatio * width;
}

/** 回転角のとき、真上の矢印が指している項目のインデックス（重み付き） */
export function weightedIndexAtPointer(
  rotation: number,
  weights: readonly number[],
): number {
  const total = weights.reduce((a, b) => a + b, 0);
  const angle = (((-rotation % 360) + 360) % 360) / 360;
  let cumulative = 0;
  for (let i = 0; i < weights.length; i++) {
    cumulative += weights[i] / total;
    if (angle < cumulative) return i;
  }
  return weights.length - 1;
}
