export type ColorId =
  | 'black'
  | 'brown'
  | 'red'
  | 'orange'
  | 'yellow'
  | 'green'
  | 'blue'
  | 'violet'
  | 'gray'
  | 'white'
  | 'gold'
  | 'silver';

export const COLOR_IDS: readonly ColorId[] = [
  'black',
  'brown',
  'red',
  'orange',
  'yellow',
  'green',
  'blue',
  'violet',
  'gray',
  'white',
  'gold',
  'silver',
];

/** 表示用の代表色（スウォッチ用） */
export const COLOR_HEX: Record<ColorId, string> = {
  black: '#111111',
  brown: '#7b4a1e',
  red: '#d62828',
  orange: '#f77f00',
  yellow: '#f4d03f',
  green: '#2e9e4f',
  blue: '#1d5fd1',
  violet: '#8a3ffc',
  gray: '#8d8d8d',
  white: '#f5f5f5',
  gold: '#c9a227',
  silver: '#c0c0c0',
};

export type BandCount = 4 | 5 | 6;
export type BandRole = 'digit' | 'multiplier' | 'tolerance' | 'tempco';

const DIGIT_COLORS: readonly ColorId[] = COLOR_IDS.slice(0, 10);

/** 乗数の指数（10^n）。金は 0.1、銀は 0.01 */
export const MULTIPLIER_EXPONENT: Record<ColorId, number> = {
  black: 0,
  brown: 1,
  red: 2,
  orange: 3,
  yellow: 4,
  green: 5,
  blue: 6,
  violet: 7,
  gray: 8,
  white: 9,
  gold: -1,
  silver: -2,
};

/** 許容差（％） */
export const TOLERANCE_BY_COLOR: Partial<Record<ColorId, number>> = {
  brown: 1,
  red: 2,
  green: 0.5,
  blue: 0.25,
  violet: 0.1,
  gray: 0.05,
  gold: 5,
  silver: 10,
};

/** 温度係数（ppm/℃） */
export const TEMPCO_BY_COLOR: Partial<Record<ColorId, number>> = {
  black: 250,
  brown: 100,
  red: 50,
  orange: 15,
  yellow: 25,
  green: 20,
  blue: 10,
  violet: 5,
  gray: 1,
};

export function bandRoles(count: BandCount): BandRole[] {
  const digits: BandRole[] =
    count === 4 ? ['digit', 'digit'] : ['digit', 'digit', 'digit'];
  const roles: BandRole[] = [...digits, 'multiplier', 'tolerance'];
  if (count === 6) roles.push('tempco');
  return roles;
}

export function colorsForRole(role: BandRole): ColorId[] {
  switch (role) {
    case 'digit':
      return [...DIGIT_COLORS];
    case 'multiplier':
      return [...COLOR_IDS];
    case 'tolerance':
      return COLOR_IDS.filter((c) => TOLERANCE_BY_COLOR[c] !== undefined);
    case 'tempco':
      return COLOR_IDS.filter((c) => TEMPCO_BY_COLOR[c] !== undefined);
  }
}

/** 色帯 → 値で選べる許容差（％）の一覧（値 → 色帯の入力用） */
export const TOLERANCE_VALUES: readonly number[] = [
  0.05, 0.1, 0.25, 0.5, 1, 2, 5, 10,
];

export const TEMPCO_VALUES: readonly number[] = [
  1, 5, 10, 15, 20, 25, 50, 100, 250,
];

function roundSig(value: number, digits = 10): number {
  return Number(value.toPrecision(digits));
}

export type DecodeResult =
  | {
      ok: true;
      ohms: number;
      tolerance: number;
      tempco: number | null;
      min: number;
      max: number;
    }
  | { ok: false; reason: 'bandCount' | 'invalidBand'; index?: number };

/** 色帯（左から順）を読み取る。4本=2桁、5・6本=3桁 */
export function decodeBands(
  count: BandCount,
  colors: readonly ColorId[],
): DecodeResult {
  const roles = bandRoles(count);
  if (colors.length !== roles.length) return { ok: false, reason: 'bandCount' };

  let mantissa = 0;
  let exponent = 0;
  let tolerance = 0;
  let tempco: number | null = null;
  for (let i = 0; i < roles.length; i++) {
    const color = colors[i];
    const role = roles[i];
    if (!colorsForRole(role).includes(color)) {
      return { ok: false, reason: 'invalidBand', index: i };
    }
    if (role === 'digit')
      mantissa = mantissa * 10 + DIGIT_COLORS.indexOf(color);
    else if (role === 'multiplier') exponent = MULTIPLIER_EXPONENT[color];
    else if (role === 'tolerance') tolerance = TOLERANCE_BY_COLOR[color]!;
    else tempco = TEMPCO_BY_COLOR[color]!;
  }
  const ohms =
    exponent >= 0 ? mantissa * 10 ** exponent : mantissa / 10 ** -exponent;
  return {
    ok: true,
    ohms,
    tolerance,
    tempco,
    min: roundSig(ohms * (1 - tolerance / 100)),
    max: roundSig(ohms * (1 + tolerance / 100)),
  };
}

export type EncodeResult =
  | { ok: true; colors: ColorId[]; mantissa: number; exponent: number }
  | {
      ok: false;
      reason:
        'invalid' | 'outOfRange' | 'notRepresentable' | 'tolerance' | 'tempco';
    };

function colorByExponent(exp: number): ColorId {
  return COLOR_IDS.find((c) => MULTIPLIER_EXPONENT[c] === exp)!;
}

/** 抵抗値（Ω）→ 色帯。表せない値は理由付きで失敗する */
export function encodeResistance(
  ohms: number,
  count: BandCount,
  tolerance: number,
  tempco?: number,
): EncodeResult {
  if (!Number.isFinite(ohms) || ohms < 0)
    return { ok: false, reason: 'invalid' };
  const tolColor = COLOR_IDS.find((c) => TOLERANCE_BY_COLOR[c] === tolerance);
  if (!tolColor) return { ok: false, reason: 'tolerance' };
  let tcColor: ColorId | undefined;
  if (count === 6) {
    tcColor = COLOR_IDS.find((c) => TEMPCO_BY_COLOR[c] === tempco);
    if (!tcColor) return { ok: false, reason: 'tempco' };
  }

  const n = count === 4 ? 2 : 3;
  const scaledFloat = ohms * 100;
  const scaled = Math.round(scaledFloat);
  if (scaled > 1e13) return { ok: false, reason: 'outOfRange' };
  if (Math.abs(scaledFloat - scaled) > 1e-6 * Math.max(1, scaledFloat)) {
    return { ok: false, reason: 'notRepresentable' };
  }

  let mantissa: number;
  let exponent: number;
  if (scaled === 0) {
    mantissa = 0;
    exponent = 0;
  } else {
    const len = String(scaled).length;
    if (len < n) return { ok: false, reason: 'notRepresentable' };
    const shift = len - n;
    if (scaled % 10 ** shift !== 0)
      return { ok: false, reason: 'notRepresentable' };
    mantissa = scaled / 10 ** shift;
    exponent = shift - 2;
  }
  if (exponent > 9) return { ok: false, reason: 'outOfRange' };

  const digitStr = String(mantissa).padStart(n, '0');
  const colors: ColorId[] = [...digitStr].map((d) => DIGIT_COLORS[Number(d)]);
  colors.push(colorByExponent(exponent), tolColor);
  if (tcColor) colors.push(tcColor);
  return { ok: true, colors, mantissa, exponent };
}

/**
 * 抵抗値の文字列を数値（Ω）にする。
 * 例: 470 / 4.7k / 4k7 / 2.2MΩ / R47 / 4R7 / 1,000
 */
export function parseResistance(text: string): number | null {
  const s = text
    .normalize('NFKC')
    .replace(/[\s,_]/g, '')
    .replace(/(?:Ω|Ω|ohms?|オーム)$/i, '');
  if (!s) return null;

  const rOnly = /^[rR](\d+)$/.exec(s);
  if (rOnly) return Number(`0.${rOnly[1]}`);

  const m = /^(\d+(?:\.\d+)?)([rkmgRKMG])?(\d+)?$/.exec(s);
  if (!m) return null;
  const [, int, unit, frac] = m;
  if (frac !== undefined && (unit === undefined || int.includes('.')))
    return null;
  const base = frac !== undefined ? Number(`${int}.${frac}`) : Number(int);
  const multiplier =
    unit === undefined
      ? 1
      : { r: 1, k: 1e3, m: 1e6, g: 1e9 }[
          unit.toLowerCase() as 'r' | 'k' | 'm' | 'g'
        ];
  const value = roundSig(base * multiplier);
  return Number.isFinite(value) ? value : null;
}

/** 4.7 kΩ のように読みやすく整形する */
export function formatResistance(ohms: number): string {
  if (ohms === 0) return '0 Ω';
  const units: [number, string][] = [
    [1e9, 'GΩ'],
    [1e6, 'MΩ'],
    [1e3, 'kΩ'],
    [1, 'Ω'],
  ];
  for (const [factor, unit] of units) {
    if (ohms >= factor) return `${roundSig(ohms / factor, 6)} ${unit}`;
  }
  return `${roundSig(ohms, 6)} Ω`;
}

export type ESeriesId = 'E6' | 'E12' | 'E24' | 'E48' | 'E96' | 'E192';

export const E_SERIES_IDS: readonly ESeriesId[] = [
  'E6',
  'E12',
  'E24',
  'E48',
  'E96',
  'E192',
];

const E_SERIES_COUNT: Record<ESeriesId, number> = {
  E6: 6,
  E12: 12,
  E24: 24,
  E48: 48,
  E96: 96,
  E192: 192,
};

const E24_TABLE = [
  10, 11, 12, 13, 15, 16, 18, 20, 22, 24, 27, 30, 33, 36, 39, 43, 47, 51, 56,
  62, 68, 75, 82, 91,
];
const E12_TABLE = [10, 12, 15, 18, 22, 27, 33, 39, 47, 56, 68, 82];
const E6_TABLE = [10, 15, 22, 33, 47, 68];

/** 1 以上 10 未満の基準値（1 デケード分） */
export function eSeriesMantissas(series: ESeriesId): number[] {
  switch (series) {
    case 'E6':
      return E6_TABLE.map((v) => v / 10);
    case 'E12':
      return E12_TABLE.map((v) => v / 10);
    case 'E24':
      return E24_TABLE.map((v) => v / 10);
    default: {
      // E48 / E96 / E192 は 10^(i/N) を3桁に丸めた値（E192 の一部は規格表と1桁違う場合がある）
      const n = E_SERIES_COUNT[series];
      return Array.from(
        { length: n },
        (_, i) => Math.round(10 ** (i / n + 2)) / 100,
      );
    }
  }
}

export interface NearestE {
  series: ESeriesId;
  value: number;
  /** 入力値に対する差（％、符号付き） */
  deviationPercent: number;
  exact: boolean;
  lower: number | null;
  upper: number | null;
}

/** 入力値に最も近い E 系列の値（比率で近い方）と、その上下の値を返す */
export function nearestESeries(
  ohms: number,
  series: ESeriesId,
): NearestE | null {
  if (!Number.isFinite(ohms) || ohms <= 0) return null;
  const mantissas = eSeriesMantissas(series);
  const decade = Math.floor(Math.log10(ohms));
  const values: number[] = [];
  for (let d = decade - 1; d <= decade + 1; d++) {
    for (const m of mantissas) values.push(roundSig(m * 10 ** d));
  }
  values.sort((a, b) => a - b);
  let best = values[0];
  for (const v of values) {
    if (Math.abs(Math.log(v / ohms)) < Math.abs(Math.log(best / ohms)))
      best = v;
  }
  const exact = Math.abs(best - ohms) <= ohms * 1e-9;
  const lower = [...values].reverse().find((v) => v < best) ?? null;
  const upper = values.find((v) => v > best) ?? null;
  return {
    series,
    value: best,
    deviationPercent: roundSig(((best - ohms) / ohms) * 100, 6),
    exact,
    lower,
    upper,
  };
}
