export type StatisticsError = 'empty' | 'tooMany';

export interface StatisticsParseResult {
  values: number[];
  /** 数値として読めなかったトークンの数 */
  invalidCount: number;
}

export interface StatisticsResult {
  count: number;
  sum: number;
  mean: number;
  median: number;
  /** 最頻値（同数なら全て昇順。全値が1回ずつなら空） */
  modes: number[];
  min: number;
  max: number;
  range: number;
  /** 母分散 */
  populationVariance: number;
  /** 母標準偏差 */
  populationStdDev: number;
  /** 不偏分散（データが1件のときはnull） */
  sampleVariance: number | null;
  /** 標本標準偏差（データが1件のときはnull） */
  sampleStdDev: number | null;
}

export const MAX_STATISTICS_VALUES = 10000;

/** カンマ・空白・改行・読点・全角スペース区切りの数値列を読み取る。全角数字も許容する。 */
export function parseNumbers(text: string): StatisticsParseResult {
  const normalized = text
    .replace(/−/g, '-')
    .replace(/[０-９．－＋]/g, (c) =>
      c === '．'
        ? '.'
        : c === '－'
          ? '-'
          : c === '＋'
            ? '+'
            : String.fromCharCode(c.charCodeAt(0) - 0xfee0),
    );
  // カンマは区切り文字として扱う（1,000 のような桁区切りは未対応）
  const tokens = normalized.split(/[\s,、，;；]+/).filter((t) => t !== '');
  const values: number[] = [];
  let invalidCount = 0;
  for (const token of tokens) {
    const n = /^[+-]?(\d+\.?\d*|\.\d+)(e[+-]?\d+)?$/i.test(token)
      ? Number(token)
      : NaN;
    if (Number.isFinite(n)) values.push(n);
    else invalidCount++;
  }
  return { values, invalidCount };
}

/** 平均・中央値・最頻値・分散・標準偏差などの基本統計量を求める。 */
export function calculateStatistics(
  values: number[],
): StatisticsResult | { error: StatisticsError } {
  const count = values.length;
  if (count === 0) return { error: 'empty' };
  if (count > MAX_STATISTICS_VALUES) return { error: 'tooMany' };

  const sorted = [...values].sort((a, b) => a - b);
  const sum = values.reduce((acc, v) => acc + v, 0);
  const mean = sum / count;
  const mid = Math.floor(count / 2);
  const median =
    count % 2 === 1 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;

  const freq = new Map<number, number>();
  for (const v of sorted) freq.set(v, (freq.get(v) ?? 0) + 1);
  const maxFreq = Math.max(...freq.values());
  const modes =
    maxFreq === 1
      ? []
      : [...freq].filter(([, f]) => f === maxFreq).map(([v]) => v);

  const squaredDiffSum = values.reduce((acc, v) => acc + (v - mean) ** 2, 0);
  const populationVariance = squaredDiffSum / count;
  const sampleVariance = count > 1 ? squaredDiffSum / (count - 1) : null;

  return {
    count,
    sum,
    mean,
    median,
    modes,
    min: sorted[0],
    max: sorted[count - 1],
    range: sorted[count - 1] - sorted[0],
    populationVariance,
    populationStdDev: Math.sqrt(populationVariance),
    sampleVariance,
    sampleStdDev: sampleVariance === null ? null : Math.sqrt(sampleVariance),
  };
}

/**
 * 偏差値 = 50 + 10 × (得点 − 平均) ÷ 母標準偏差。
 * 標準偏差が0（全員同じ得点）のときは計算できないためnullを返す。
 */
export function deviationScore(
  score: number,
  mean: number,
  populationStdDev: number,
): number | null {
  if (!Number.isFinite(score)) return null;
  if (populationStdDev === 0) return null;
  return 50 + (10 * (score - mean)) / populationStdDev;
}
