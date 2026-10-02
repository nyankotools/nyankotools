export type UnitCategory =
  'length' | 'mass' | 'area' | 'volume' | 'temperature' | 'data';

export const unitCategories: UnitCategory[] = [
  'length',
  'mass',
  'area',
  'volume',
  'temperature',
  'data',
];

/** 各単位の基準単位（長さ=m、質量=g、面積=m²、体積=mL、データ=byte）に対する倍率 */
const factors: Record<
  Exclude<UnitCategory, 'temperature'>,
  Record<string, number>
> = {
  length: {
    mm: 0.001,
    cm: 0.01,
    m: 1,
    km: 1000,
    in: 0.0254,
    ft: 0.3048,
    yd: 0.9144,
    mi: 1609.344,
    shaku: 10 / 33,
    sun: 1 / 33,
    ken: 20 / 11,
  },
  mass: {
    mg: 0.001,
    g: 1,
    kg: 1000,
    t: 1_000_000,
    oz: 28.349523125,
    lb: 453.59237,
    monme: 3.75,
    kan: 3750,
  },
  area: {
    cm2: 0.0001,
    m2: 1,
    a: 100,
    ha: 10_000,
    km2: 1_000_000,
    in2: 0.00064516,
    ft2: 0.09290304,
    acre: 4046.8564224,
    tsubo: 400 / 121,
    jo: 1.62,
  },
  volume: {
    ml: 1,
    l: 1000,
    m3: 1_000_000,
    tspJp: 5,
    tbspJp: 15,
    cupJp: 200,
    go: 180.39,
    sho: 1803.9,
    tspUs: 4.92892159375,
    tbspUs: 14.78676478125,
    flozUs: 29.5735295625,
    cupUs: 236.5882365,
    galUs: 3785.411784,
  },
  data: {
    bit: 1 / 8,
    B: 1,
    KB: 1000,
    MB: 1000 ** 2,
    GB: 1000 ** 3,
    TB: 1000 ** 4,
    PB: 1000 ** 5,
    KiB: 1024,
    MiB: 1024 ** 2,
    GiB: 1024 ** 3,
    TiB: 1024 ** 4,
  },
};

const temperatureUnits = ['c', 'f', 'k'];

/** カテゴリに属する単位IDの一覧（表示順） */
export function getUnits(category: UnitCategory): string[] {
  return category === 'temperature'
    ? [...temperatureUnits]
    : Object.keys(factors[category]);
}

function toCelsius(unit: string, value: number): number {
  if (unit === 'f') return ((value - 32) * 5) / 9;
  if (unit === 'k') return value - 273.15;
  return value;
}

function fromCelsius(unit: string, celsius: number): number {
  if (unit === 'f') return (celsius * 9) / 5 + 32;
  if (unit === 'k') return celsius + 273.15;
  return celsius;
}

/**
 * 値を単位間で変換する。数値が有限でない、単位が不明、
 * 絶対零度を下回る温度の場合は null。
 */
export function convert(
  category: UnitCategory,
  from: string,
  to: string,
  value: number,
): number | null {
  if (!isFinite(value)) return null;
  const units = getUnits(category);
  if (!units.includes(from) || !units.includes(to)) return null;

  if (category === 'temperature') {
    const celsius = toCelsius(from, value);
    if (celsius < -273.15 - 1e-9) return null;
    return fromCelsius(to, celsius);
  }

  const table = factors[category];
  const result = (value * table[from]) / table[to];
  return isFinite(result) ? result : null;
}

export interface ConversionRow {
  unit: string;
  value: number;
}

/** 入力値を、カテゴリ内の全単位へ変換した一覧（入力した単位自身を除く） */
export function convertAll(
  category: UnitCategory,
  from: string,
  value: number,
): ConversionRow[] {
  const rows: ConversionRow[] = [];
  for (const unit of getUnits(category)) {
    if (unit === from) continue;
    const converted = convert(category, from, unit, value);
    if (converted !== null) rows.push({ unit, value: converted });
  }
  return rows;
}

/**
 * 変換結果を表示用の文字列にする。有効数字10桁で丸めて浮動小数点の誤差を隠し、
 * 極端に大きい／小さい値は指数表記にする。
 */
export function formatNumber(value: number, numberLocale: string): string {
  if (value === 0) return '0';
  const abs = Math.abs(value);
  if (abs >= 1e15 || abs < 1e-6) {
    return Number(value.toPrecision(7))
      .toExponential()
      .replace('e+', '×10^')
      .replace('e', '×10^');
  }
  return new Intl.NumberFormat(numberLocale, {
    maximumSignificantDigits: 10,
    maximumFractionDigits: 12,
  }).format(value);
}
