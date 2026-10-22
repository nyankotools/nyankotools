import { detectDelimiter, parseCsvTable } from './csv-viewer';
import { niceStep, formatTick } from './function-grapher';

export { formatTick };

export type ChartType = 'bar' | 'line' | 'pie';

/** データ行（カテゴリ）数と系列数の上限 */
export const MAX_ROWS = 200;
export const MAX_SERIES = 8;

/** 系列ごとの色（白背景で読める濃さ。色だけに頼らず凡例・ラベルも併用する） */
export const SERIES_COLORS: readonly string[] = [
  '#2563eb',
  '#ea580c',
  '#16a34a',
  '#9333ea',
  '#dc2626',
  '#0891b2',
  '#ca8a04',
  '#db2777',
];

export interface ChartSeries {
  name: string;
  /** 空欄のセルは null */
  values: (number | null)[];
}

export interface ChartData {
  labels: string[];
  series: ChartSeries[];
}

export type ChartDataError =
  | { code: 'empty' }
  | { code: 'unterminated-quote' }
  | { code: 'no-series' }
  | { code: 'too-many-rows'; max: number }
  | { code: 'too-many-series'; max: number }
  /** row・column は 1 始まり（ヘッダー行を 1 行目と数える） */
  | { code: 'not-number'; row: number; column: number };

export type ChartDataOutcome =
  | { success: true; data: ChartData }
  | { success: false; error: ChartDataError };

/** 軸計算が破綻しないよう、扱う値の絶対値の上限 */
const MAX_ABS = 1e15;

/**
 * 数値セルの解釈。3桁区切りのカンマ・全角数字・末尾の % を許容する。
 * 空欄は null、数値でなければ undefined（1,5 のような欧州式の小数は誤読を避けるため数値扱いにしない）
 */
export function parseNumberCell(cell: string): number | null | undefined {
  let s = cell
    .trim()
    .replace(/[０-９．－]/g, (c) =>
      c === '．' ? '.' : c === '－' ? '-' : String(c.charCodeAt(0) - 0xff10),
    )
    .replace(/−/g, '-')
    .replace(/%$/, '');
  if (s === '') return null;
  if (/^[+-]?[1-9]\d{0,2}(,\d{3})+(\.\d*)?$/.test(s)) s = s.replace(/,/g, '');
  if (!/^[+-]?(\d+\.?\d*|\.\d+)(e[+-]?\d+)?$/i.test(s)) return undefined;
  const n = Number(s);
  return Number.isFinite(n) && Math.abs(n) <= MAX_ABS ? n : undefined;
}

/** 1行目をヘッダー、1列目をラベル、2列目以降を系列として読む（区切り文字は自動判定） */
export function parseChartData(text: string): ChartDataOutcome {
  const table = parseCsvTable(text, detectDelimiter(text), true);
  if (!table.success) {
    return {
      success: false,
      error: {
        code: table.reason === 'empty' ? 'empty' : 'unterminated-quote',
      },
    };
  }
  const { headers, columnCount, rows } = table.table;
  if (columnCount < 2) return { success: false, error: { code: 'no-series' } };
  if (rows.length === 0) return { success: false, error: { code: 'empty' } };
  if (rows.length > MAX_ROWS) {
    return {
      success: false,
      error: { code: 'too-many-rows', max: MAX_ROWS },
    };
  }
  if (columnCount - 1 > MAX_SERIES) {
    return {
      success: false,
      error: { code: 'too-many-series', max: MAX_SERIES },
    };
  }
  const series: ChartSeries[] = [];
  for (let c = 1; c < columnCount; c++) {
    const values: (number | null)[] = [];
    for (let r = 0; r < rows.length; r++) {
      const v = parseNumberCell(rows[r][c]);
      if (v === undefined) {
        return {
          success: false,
          error: { code: 'not-number', row: r + 2, column: c + 1 },
        };
      }
      values.push(v);
    }
    series.push({ name: headers?.[c]?.trim() || String(c), values });
  }
  return { success: true, data: { labels: rows.map((r) => r[0]), series } };
}

export interface ValueAxis {
  min: number;
  max: number;
  step: number;
  ticks: number[];
}

/**
 * 値軸の範囲と目盛りを求める。棒グラフは 0 を必ず含める（includeZero）。
 * 範囲が 0 幅のときは適当な幅を持たせる。
 */
export function computeValueAxis(
  values: readonly (number | null)[],
  includeZero: boolean,
  targetCount = 6,
): ValueAxis {
  const nums = values.filter((v): v is number => v !== null);
  let lo = nums.length > 0 ? Math.min(...nums) : 0;
  let hi = nums.length > 0 ? Math.max(...nums) : 1;
  if (includeZero) {
    lo = Math.min(lo, 0);
    hi = Math.max(hi, 0);
  }
  if (hi === lo) {
    const pad = Math.abs(hi) > 0 ? Math.abs(hi) * 0.5 : 1;
    lo -= pad;
    hi += pad;
    if (includeZero) lo = Math.min(lo, 0);
  }
  const step = niceStep(hi - lo, targetCount);
  const min = Number((Math.floor(lo / step + 1e-9) * step).toPrecision(12));
  const max = Number((Math.ceil(hi / step - 1e-9) * step).toPrecision(12));
  const ticks: number[] = [];
  const count = Math.round((max - min) / step);
  for (let i = 0; i <= count && i <= 200; i++) {
    ticks.push(Number((min + i * step).toPrecision(12)));
  }
  return { min, max, step, ticks };
}

export type PieError = 'negative' | 'zero-total' | 'no-values';

export interface PieSlice {
  label: string;
  value: number;
  /** 0〜1 */
  fraction: number;
  /** ラジアン。12時の位置から時計回り */
  startAngle: number;
  endAngle: number;
}

export type PieOutcome =
  { success: true; slices: PieSlice[] } | { success: false; error: PieError };

/** 円グラフ用のスライス。0・空欄の値は除き、負値は不可 */
export function computePieSlices(data: ChartData, seriesIndex = 0): PieOutcome {
  const s = data.series[seriesIndex];
  if (!s) return { success: false, error: 'no-values' };
  if (s.values.some((v) => v !== null && v < 0)) {
    return { success: false, error: 'negative' };
  }
  const total = s.values.reduce<number>((sum, v) => sum + (v ?? 0), 0);
  if (!(total > 0)) return { success: false, error: 'zero-total' };
  const slices: PieSlice[] = [];
  let angle = 0;
  s.values.forEach((v, i) => {
    if (!v) return;
    const fraction = v / total;
    const end = angle + fraction * Math.PI * 2;
    slices.push({
      label: data.labels[i],
      value: v,
      fraction,
      startAngle: angle,
      endAngle: end,
    });
    angle = end;
  });
  return { success: true, slices };
}

export function formatPercent(fraction: number): string {
  return `${(fraction * 100).toFixed(1)}%`;
}

export function pngFilename(type: ChartType): string {
  return `chart-${type}.png`;
}
