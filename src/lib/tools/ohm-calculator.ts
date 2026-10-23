/**
 * オームの法則・電力、直列／並列の合成抵抗、LEDの電流制限抵抗の計算。
 * 単位は V / A / Ω / W を基準にし、入力では SI 接頭辞（p n u µ m k M G）を受け付ける。
 */

const PREFIX_EXPONENT: Record<string, number> = {
  p: -12,
  n: -9,
  u: -6,
  µ: -6,
  μ: -6,
  m: -3,
  '': 0,
  k: 3,
  K: 3,
  M: 6,
  G: 9,
};

const SI_PATTERN =
  /^([+-]?(?:\d+\.?\d*|\.\d+)(?:[eE][+-]?\d+)?)\s*([pnuµμmkKMG]?)\s*(?:Ω|[oO][hH][mM][sS]?|[VvAaWwRr])?$/;

/** "4.7k" "100m" "5V" "2.2kΩ" などを数値にする。解釈できなければ null */
export function parseSiNumber(text: string): number | null {
  const m = SI_PATTERN.exec(text.trim());
  if (!m) return null;
  const value = Number(m[1]) * 10 ** PREFIX_EXPONENT[m[2]];
  return Number.isFinite(value) ? Number(value.toPrecision(12)) : null;
}

const OUTPUT_PREFIXES: { exp: number; symbol: string }[] = [
  { exp: 9, symbol: 'G' },
  { exp: 6, symbol: 'M' },
  { exp: 3, symbol: 'k' },
  { exp: 0, symbol: '' },
  { exp: -3, symbol: 'm' },
  { exp: -6, symbol: 'µ' },
  { exp: -9, symbol: 'n' },
  { exp: -12, symbol: 'p' },
];

/** 4桁程度の有効数字で SI 接頭辞付きにする（例: 4700 -> "4.7k"）。単位記号は付けない */
export function formatSi(value: number): string {
  if (!Number.isFinite(value)) return '-';
  if (value === 0) return '0';
  const abs = Math.abs(value);
  let chosen = OUTPUT_PREFIXES[OUTPUT_PREFIXES.length - 1];
  for (const p of OUTPUT_PREFIXES) {
    if (abs >= 10 ** p.exp * 0.9995) {
      chosen = p;
      break;
    }
  }
  const scaled = value / 10 ** chosen.exp;
  const text = String(Number(scaled.toPrecision(4)));
  return `${text}${chosen.symbol}`;
}

// ---------- オームの法則 ----------

export type OhmKey = 'voltage' | 'current' | 'resistance' | 'power';

export interface OhmTextInput {
  voltage: string;
  current: string;
  resistance: string;
  power: string;
}

export interface OhmValues {
  voltage: number;
  current: number;
  resistance: number;
  power: number;
}

export type OhmError = 'few' | 'many' | 'invalid' | 'negative' | 'zero';

export type OhmOutcome =
  | { ok: true; values: OhmValues; given: OhmKey[] }
  | { ok: false; error: OhmError; key?: OhmKey };

const OHM_KEYS: OhmKey[] = ['voltage', 'current', 'resistance', 'power'];

/** V・I・R・P のうち 2 つ（文字列）から残りを求める */
export function solveOhm(input: OhmTextInput): OhmOutcome {
  const given: OhmKey[] = [];
  const nums: Partial<Record<OhmKey, number>> = {};
  for (const key of OHM_KEYS) {
    const raw = input[key].trim();
    if (raw === '') continue;
    const n = parseSiNumber(raw);
    if (n === null) return { ok: false, error: 'invalid', key };
    if (n < 0) return { ok: false, error: 'negative', key };
    given.push(key);
    nums[key] = n;
  }
  if (given.length < 2) return { ok: false, error: 'few' };
  if (given.length > 2) return { ok: false, error: 'many' };

  const has = (a: OhmKey, b: OhmKey) => given.includes(a) && given.includes(b);
  const { voltage: v, current: i, resistance: r, power: p } = nums;
  let values: OhmValues;

  if (has('voltage', 'current')) {
    values = { voltage: v!, current: i!, resistance: v! / i!, power: v! * i! };
  } else if (has('voltage', 'resistance')) {
    values = {
      voltage: v!,
      current: v! / r!,
      resistance: r!,
      power: (v! * v!) / r!,
    };
  } else if (has('voltage', 'power')) {
    values = {
      voltage: v!,
      current: p! / v!,
      resistance: (v! * v!) / p!,
      power: p!,
    };
  } else if (has('current', 'resistance')) {
    values = {
      voltage: i! * r!,
      current: i!,
      resistance: r!,
      power: i! * i! * r!,
    };
  } else if (has('current', 'power')) {
    values = {
      voltage: p! / i!,
      current: i!,
      resistance: p! / (i! * i!),
      power: p!,
    };
  } else {
    values = {
      voltage: Math.sqrt(p! * r!),
      current: Math.sqrt(p! / r!),
      resistance: r!,
      power: p!,
    };
  }

  const finite = OHM_KEYS.every((k) => Number.isFinite(values[k]));
  if (!finite) return { ok: false, error: 'zero' };
  return { ok: true, values, given };
}

// ---------- 直列・並列 ----------

export type ResistorListError = 'empty' | 'few' | 'invalid' | 'negative';

export type CombineOutcome =
  | {
      ok: true;
      values: number[];
      series: number;
      /** 0Ωを含む場合は 0（短絡） */
      parallel: number;
    }
  | { ok: false; error: ResistorListError; token?: string };

/** 抵抗値のリスト（改行・カンマ・セミコロン・空白区切り）から合成抵抗を求める */
export function combineResistors(text: string): CombineOutcome {
  const tokens = text.split(/[\s,;、]+/).filter((t) => t !== '');
  if (tokens.length === 0) return { ok: false, error: 'empty' };
  const values: number[] = [];
  for (const token of tokens) {
    const n = parseSiNumber(token);
    if (n === null) return { ok: false, error: 'invalid', token };
    if (n < 0) return { ok: false, error: 'negative', token };
    values.push(n);
  }
  if (values.length < 2) return { ok: false, error: 'few' };
  const series = values.reduce((a, b) => a + b, 0);
  const parallel = values.includes(0)
    ? 0
    : 1 / values.reduce((a, b) => a + 1 / b, 0);
  return { ok: true, values, series, parallel };
}

// ---------- LED電流制限抵抗 ----------

export const E24_MANTISSAS = [
  1.0, 1.1, 1.2, 1.3, 1.5, 1.6, 1.8, 2.0, 2.2, 2.4, 2.7, 3.0, 3.3, 3.6, 3.9,
  4.3, 4.7, 5.1, 5.6, 6.2, 6.8, 7.5, 8.2, 9.1,
];

/** r 以上で最も小さい E24 系列の値 */
export function nextE24(r: number): number {
  if (!(r > 0) || !Number.isFinite(r)) return NaN;
  const decade = Math.floor(Math.log10(r));
  for (let d = decade - 1; d <= decade + 1; d++) {
    for (const m of E24_MANTISSAS) {
      const value = Number((m * 10 ** d).toPrecision(10));
      if (value >= r * (1 - 1e-9)) return value;
    }
  }
  return NaN;
}

export interface LedInput {
  supplyVoltage: string;
  forwardVoltage: string;
  current: string;
}

export type LedError = 'few' | 'invalid' | 'negative' | 'supply' | 'current';

export interface LedResult {
  /** 計算上の抵抗値 (Ω) */
  resistance: number;
  /** 抵抗での消費電力 (W) */
  resistorPower: number;
  /** 抵抗での電圧降下 (V) */
  drop: number;
  /** 次に大きい E24 系列の抵抗値 (Ω) */
  standard: number;
  /** E24 を使ったときの実際の電流 (A) */
  actualCurrent: number;
  /** E24 を使ったときの抵抗の消費電力 (W) */
  actualPower: number;
}

export type LedOutcome =
  | { ok: true; result: LedResult }
  | { ok: false; error: LedError; key?: keyof LedInput };

export function calculateLedResistor(input: LedInput): LedOutcome {
  const keys: (keyof LedInput)[] = [
    'supplyVoltage',
    'forwardVoltage',
    'current',
  ];
  if (keys.some((k) => input[k].trim() === '')) {
    return { ok: false, error: 'few' };
  }
  const nums: Record<string, number> = {};
  for (const key of keys) {
    const n = parseSiNumber(input[key]);
    if (n === null) return { ok: false, error: 'invalid', key };
    if (n < 0) return { ok: false, error: 'negative', key };
    nums[key] = n;
  }
  const { supplyVoltage, forwardVoltage, current } = nums;
  if (current <= 0) return { ok: false, error: 'current', key: 'current' };
  if (supplyVoltage <= forwardVoltage) {
    return { ok: false, error: 'supply', key: 'supplyVoltage' };
  }
  const drop = supplyVoltage - forwardVoltage;
  const resistance = drop / current;
  const standard = nextE24(resistance);
  // 電流が極小だと抵抗値が無限大になるため、有限な結果にならない場合は電流の入力エラーにする
  if (!Number.isFinite(resistance) || !Number.isFinite(standard)) {
    return { ok: false, error: 'current', key: 'current' };
  }
  const actualCurrent = drop / standard;
  return {
    ok: true,
    result: {
      resistance,
      resistorPower: drop * current,
      drop,
      standard,
      actualCurrent,
      actualPower: drop * actualCurrent,
    },
  };
}
