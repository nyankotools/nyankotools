import { MAX_STATISTICS_VALUES, parseNumbers } from './statistics-calculator';
import { niceStep } from './function-grapher';

export { parseNumbers, MAX_STATISTICS_VALUES };

/** 階級数の上限 */
export const MAX_BINS = 200;

export type HistogramError =
  'empty' | 'tooMany' | 'invalidWidth' | 'invalidStart' | 'tooManyBins';

export interface HistogramOptions {
  /** 階級幅。null なら自動（スタージェスの公式の階級数に近いキリのよい幅） */
  width: number | null;
  /** 最初の階級の下限。null なら自動（階級幅の倍数に切り下げた最小値） */
  start: number | null;
}

export interface HistogramBin {
  /** 階級の下限（含む） */
  lower: number;
  /** 階級の上限（含まない） */
  upper: number;
  midpoint: number;
  count: number;
  /** 相対度数（0〜1） */
  relative: number;
  cumulative: number;
  /** 累積相対度数（0〜1） */
  cumulativeRelative: number;
}

export interface Histogram {
  bins: HistogramBin[];
  width: number;
  start: number;
  /** 集計したデータ数（開始値より小さいデータは含めない） */
  total: number;
  /** 開始値より小さいため集計から除いたデータ数 */
  excluded: number;
  min: number;
  max: number;
}

function tidy(n: number): number {
  return Number(n.toPrecision(12));
}

/** スタージェスの公式による階級数の目安: ceil(log2(n) + 1) */
export function sturgesBinCount(n: number): number {
  if (n < 1) return 1;
  return Math.max(1, Math.ceil(Math.log2(n) + 1));
}

/** 自動の階級幅。データの範囲をスタージェスの階級数で割り、キリのよい値にする。 */
export function autoWidth(min: number, max: number, n: number): number {
  const range = max - min;
  if (!(range > 0)) return 1;
  return tidy(niceStep(range, sturgesBinCount(n)));
}

/**
 * 度数分布表を作る。階級は「下限以上・上限未満」（左閉右開）で、
 * 最大値が必ずいずれかの階級に入るよう、最後の階級まで作る。
 */
export function buildHistogram(
  values: number[],
  options: HistogramOptions,
): Histogram | { error: HistogramError } {
  if (values.length === 0) return { error: 'empty' };
  if (values.length > MAX_STATISTICS_VALUES) return { error: 'tooMany' };
  const { width: w, start: s } = options;
  if (w !== null && !(Number.isFinite(w) && w > 0)) {
    return { error: 'invalidWidth' };
  }
  if (s !== null && !Number.isFinite(s)) return { error: 'invalidStart' };

  let min = values[0];
  let max = values[0];
  for (const v of values) {
    if (v < min) min = v;
    if (v > max) max = v;
  }
  const width = w ?? autoWidth(min, max, values.length);
  const start = s ?? tidy(Math.floor(min / width + 1e-9) * width);
  if (start > max) return { error: 'invalidStart' };

  const binCount = Math.floor((max - start) / width + 1e-9) + 1;
  if (binCount > MAX_BINS) return { error: 'tooManyBins' };

  const counts = new Array<number>(binCount).fill(0);
  let total = 0;
  for (const v of values) {
    if (v < start) continue;
    // 浮動小数点の誤差（0.3 / 0.1 など）で階級がずれないよう微小量を足す
    const i = Math.floor((v - start) / width + 1e-9);
    counts[Math.min(Math.max(i, 0), binCount - 1)]++;
    total++;
  }

  let cumulative = 0;
  const bins: HistogramBin[] = counts.map((count, i) => {
    cumulative += count;
    const lower = tidy(start + i * width);
    const upper = tidy(start + (i + 1) * width);
    return {
      lower,
      upper,
      midpoint: tidy((lower + upper) / 2),
      count,
      relative: count / total,
      cumulative,
      cumulativeRelative: cumulative / total,
    };
  });
  return {
    bins,
    width,
    start,
    total,
    excluded: values.length - total,
    min,
    max,
  };
}

/** 階級の表記。左閉右開を数学の区間記法で表す。 */
export function binLabel(bin: Pick<HistogramBin, 'lower' | 'upper'>): string {
  return `[${bin.lower}, ${bin.upper})`;
}

/** 0〜1 の割合を小数第2位までの百分率（% 記号なし）にする */
export function percentText(fraction: number): string {
  return (Math.round(fraction * 10000) / 100).toFixed(2);
}

export interface HistogramTableHeaders {
  bin: string;
  midpoint: string;
  count: string;
  relative: string;
  cumulative: string;
  cumulativeRelative: string;
}

/** 表を区切り文字付きテキスト（CSV は ','、TSV は '\t'）にする */
export function histogramToDelimited(
  bins: HistogramBin[],
  headers: HistogramTableHeaders,
  delimiter: ',' | '\t',
): string {
  const cell = (s: string) =>
    delimiter === ',' && /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  const rows = [
    [
      headers.bin,
      headers.midpoint,
      headers.count,
      headers.relative,
      headers.cumulative,
      headers.cumulativeRelative,
    ],
    ...bins.map((b) => [
      binLabel(b),
      String(b.midpoint),
      String(b.count),
      percentText(b.relative),
      String(b.cumulative),
      percentText(b.cumulativeRelative),
    ]),
  ];
  return rows.map((r) => r.map(cell).join(delimiter)).join('\n');
}

export function histogramFilename(): string {
  return 'histogram.png';
}
