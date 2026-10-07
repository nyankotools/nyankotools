export interface GachaInput {
  /** 排出率（%）。0〜100 */
  ratePercent: number;
  /** 引く回数（0以上の整数） */
  pulls: number;
  /** 天井（その回数目で必ず排出）。1以上の整数。なしは null */
  ceiling: number | null;
  /** 1回あたりの石数（0以上）。未指定は null */
  costPerPull: number | null;
  /** 所持している石数（0以上）。未指定は null */
  ownedStones: number | null;
}

export interface GachaResult {
  /** N回で1回以上排出される確率（0〜1）。天井を考慮する */
  probabilityAtLeastOne: number;
  /** 回数×排出率の期待排出数（天井は考慮しない） */
  expectedHits: number;
  /** 最初の1体が出るまでの期待回数（天井を考慮）。出ない場合は null */
  expectedPulls: number | null;
  /** 期待回数に必要な石数。石数未指定または期待回数なしは null */
  expectedStones: number | null;
  /** 天井まで引く場合の石数。天井または石数が未指定なら null */
  ceilingStones: number | null;
  /** 所持石数で引ける回数。石数・所持数が未指定または1回0石なら null */
  ownedPulls: number | null;
  /** 所持石数で引いたときに1回以上排出される確率（0〜1） */
  ownedProbability: number | null;
}

export interface ConfidencePulls {
  /** 目標確率（0〜1） */
  confidence: number;
  /** その確率に届くまでに必要な回数。届かない場合は null */
  pulls: number | null;
}

function isNonNegativeInteger(value: number): boolean {
  return Number.isInteger(value) && value >= 0;
}

/** 1 - (1-p)^n を桁落ちしにくく計算する。天井があり n >= ceiling なら 1。 */
export function probabilityWithin(
  rate: number,
  pulls: number,
  ceiling: number | null,
): number {
  if (pulls <= 0) return 0;
  if (ceiling !== null && pulls >= ceiling) return 1;
  if (rate >= 1) return 1;
  if (rate <= 0) return 0;
  return Math.min(1, -Math.expm1(pulls * Math.log1p(-rate)));
}

/** 最初の1体までの期待回数（天井あり: (1-(1-p)^C)/p）。出ない場合は null。 */
export function expectedPullsToFirst(
  rate: number,
  ceiling: number | null,
): number | null {
  if (rate >= 1) return 1;
  if (rate <= 0) return ceiling;
  if (ceiling === null) return 1 / rate;
  return -Math.expm1(ceiling * Math.log1p(-rate)) / rate;
}

/** 目標確率に届く最小の回数。届かない（排出率0で天井なし）場合は null。 */
export function pullsForConfidence(
  rate: number,
  confidence: number,
  ceiling: number | null,
): number | null {
  let needed: number | null;
  if (rate >= 1) needed = 1;
  else if (rate <= 0) needed = null;
  else {
    // 浮動小数点の誤差で ceil が1つ繰り上がるのを避ける
    needed = Math.max(
      1,
      Math.ceil(Math.log1p(-confidence) / Math.log1p(-rate) - 1e-9),
    );
  }
  if (ceiling !== null)
    return needed === null ? ceiling : Math.min(needed, ceiling);
  return needed;
}

export function calculateGacha(input: GachaInput): GachaResult | null {
  const { ratePercent, pulls, ceiling, costPerPull, ownedStones } = input;
  if (!Number.isFinite(ratePercent) || ratePercent < 0 || ratePercent > 100)
    return null;
  if (!isNonNegativeInteger(pulls)) return null;
  if (ceiling !== null && !(Number.isInteger(ceiling) && ceiling >= 1))
    return null;
  if (
    costPerPull !== null &&
    !(Number.isFinite(costPerPull) && costPerPull >= 0)
  )
    return null;
  if (
    ownedStones !== null &&
    !(Number.isFinite(ownedStones) && ownedStones >= 0)
  )
    return null;

  const rate = ratePercent / 100;
  const expectedPulls = expectedPullsToFirst(rate, ceiling);
  const hasCost = costPerPull !== null;

  let ownedPulls: number | null = null;
  let ownedProbability: number | null = null;
  if (hasCost && costPerPull > 0 && ownedStones !== null) {
    ownedPulls = Math.floor(ownedStones / costPerPull);
    ownedProbability = probabilityWithin(rate, ownedPulls, ceiling);
  }

  return {
    probabilityAtLeastOne: probabilityWithin(rate, pulls, ceiling),
    expectedHits: pulls * rate,
    expectedPulls,
    expectedStones:
      hasCost && expectedPulls !== null ? expectedPulls * costPerPull : null,
    ceilingStones: hasCost && ceiling !== null ? ceiling * costPerPull : null,
    ownedPulls,
    ownedProbability,
  };
}

export function calculateConfidencePulls(
  ratePercent: number,
  ceiling: number | null,
  confidences: number[] = [0.5, 0.9, 0.99],
): ConfidencePulls[] | null {
  if (!Number.isFinite(ratePercent) || ratePercent < 0 || ratePercent > 100)
    return null;
  if (ceiling !== null && !(Number.isInteger(ceiling) && ceiling >= 1))
    return null;
  return confidences.map((confidence) => ({
    confidence,
    pulls: pullsForConfidence(ratePercent / 100, confidence, ceiling),
  }));
}

/**
 * 確率（0〜1）を表示用のパーセント値（小数第2位まで）にする。
 * 1未満なのに100に、0超なのに0に丸まって見えないようにする。
 */
export function toDisplayPercent(probability: number): number {
  if (probability <= 0) return 0;
  if (probability >= 1) return 100;
  const rounded = Math.round(probability * 10000) / 100;
  if (rounded >= 100) return 99.99;
  if (rounded <= 0) return 0.01;
  return rounded;
}
