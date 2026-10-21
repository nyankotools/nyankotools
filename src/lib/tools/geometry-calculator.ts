export const SHAPE_IDS = [
  'circle',
  'triangle',
  'rectangle',
  'trapezoid',
  'cylinder',
  'cone',
  'sphere',
  'cuboid',
] as const;
export type ShapeId = (typeof SHAPE_IDS)[number];

export const UNIT_IDS = ['mm', 'cm', 'm', 'km', 'in', 'ft'] as const;
export type UnitId = (typeof UNIT_IDS)[number];

/** 各図形の入力パラメータ（記号は言語非依存。表示ラベルは辞書側） */
export const SHAPE_PARAMS: Record<ShapeId, readonly string[]> = {
  circle: ['r'],
  triangle: ['b', 'h'],
  rectangle: ['w', 'h'],
  trapezoid: ['a', 'b', 'h'],
  cylinder: ['r', 'h'],
  cone: ['r', 'h'],
  sphere: ['r'],
  cuboid: ['w', 'd', 'h'],
};

export type MetricKey =
  'area' | 'circumference' | 'perimeter' | 'slant' | 'volume' | 'surfaceArea';

/** 1: 長さ / 2: 面積 / 3: 体積 */
export type Dimension = 1 | 2 | 3;

export interface GeometryMetric {
  key: MetricKey;
  dimension: Dimension;
  value: number;
  /** 例: "π × r²" */
  formula: string;
  /** 例: "π × 3² = 28.274334"（単位なし） */
  substitution: string;
}

export type GeometryError = 'empty' | 'invalid' | 'nonPositive';

export type GeometryOutcome =
  { ok: true; metrics: GeometryMetric[] } | { ok: false; error: GeometryError };

export interface GeometryOptions {
  /** πの小数桁数。nullなら Math.PI をそのまま使う */
  piDigits: number | null;
}

/** 数値を最大6桁の小数に丸め、末尾の0を除いた文字列にする */
export function formatNumber(value: number): string {
  if (!Number.isFinite(value)) return String(value);
  const rounded = Number(value.toFixed(6));
  return String(Object.is(rounded, -0) ? 0 : rounded);
}

/** 単位記号（累乗付き）。例: ('cm', 2) -> "cm²" */
export function unitSymbol(unit: UnitId, dimension: Dimension): string {
  return dimension === 1 ? unit : unit + (dimension === 2 ? '²' : '³');
}

/** 指定した小数桁数のπ。digitsがnullまたは範囲外ならMath.PI */
export function piValue(digits: number | null): number {
  if (digits === null || !Number.isInteger(digits) || digits < 0 || digits > 15)
    return Math.PI;
  return Number(Math.PI.toFixed(digits));
}

function validate(
  shape: ShapeId,
  params: Record<string, number | null | undefined>,
): GeometryError | null {
  const keys = SHAPE_PARAMS[shape];
  if (keys.some((k) => params[k] === null || params[k] === undefined))
    return 'empty';
  const values = keys.map((k) => params[k] as number);
  if (values.some((v) => typeof v !== 'number' || !Number.isFinite(v)))
    return 'invalid';
  if (values.some((v) => v <= 0)) return 'nonPositive';
  return null;
}

export function calculateGeometry(
  shape: ShapeId,
  params: Record<string, number | null | undefined>,
  options: GeometryOptions = { piDigits: null },
): GeometryOutcome {
  const error = validate(shape, params);
  if (error) return { ok: false, error };

  const p = (k: string) => params[k] as number;
  const pi = piValue(options.piDigits);
  const piText = options.piDigits === null ? 'π' : String(pi);
  const n = formatNumber;
  const metrics: GeometryMetric[] = [];
  const add = (
    key: MetricKey,
    dimension: Dimension,
    value: number,
    formula: string,
    expression: string,
  ) => {
    metrics.push({
      key,
      dimension,
      value,
      formula,
      substitution: `${expression} = ${n(value)}`,
    });
  };

  switch (shape) {
    case 'circle': {
      const r = p('r');
      add('area', 2, pi * r * r, 'π × r²', `${piText} × ${n(r)}²`);
      add(
        'circumference',
        1,
        2 * pi * r,
        '2 × π × r',
        `2 × ${piText} × ${n(r)}`,
      );
      break;
    }
    case 'triangle': {
      const b = p('b');
      const h = p('h');
      add('area', 2, (b * h) / 2, 'b × h ÷ 2', `${n(b)} × ${n(h)} ÷ 2`);
      break;
    }
    case 'rectangle': {
      const w = p('w');
      const h = p('h');
      add('area', 2, w * h, 'w × h', `${n(w)} × ${n(h)}`);
      add(
        'perimeter',
        1,
        2 * (w + h),
        '2 × (w + h)',
        `2 × (${n(w)} + ${n(h)})`,
      );
      break;
    }
    case 'trapezoid': {
      const a = p('a');
      const b = p('b');
      const h = p('h');
      add(
        'area',
        2,
        ((a + b) * h) / 2,
        '(a + b) × h ÷ 2',
        `(${n(a)} + ${n(b)}) × ${n(h)} ÷ 2`,
      );
      break;
    }
    case 'cylinder': {
      const r = p('r');
      const h = p('h');
      add(
        'volume',
        3,
        pi * r * r * h,
        'π × r² × h',
        `${piText} × ${n(r)}² × ${n(h)}`,
      );
      add(
        'surfaceArea',
        2,
        2 * pi * r * (r + h),
        '2 × π × r × (r + h)',
        `2 × ${piText} × ${n(r)} × (${n(r)} + ${n(h)})`,
      );
      break;
    }
    case 'cone': {
      const r = p('r');
      const h = p('h');
      const l = Math.sqrt(r * r + h * h);
      add('slant', 1, l, '√(r² + h²)', `√(${n(r)}² + ${n(h)}²)`);
      add(
        'volume',
        3,
        (pi * r * r * h) / 3,
        'π × r² × h ÷ 3',
        `${piText} × ${n(r)}² × ${n(h)} ÷ 3`,
      );
      add(
        'surfaceArea',
        2,
        pi * r * (r + l),
        'π × r × (r + l)',
        `${piText} × ${n(r)} × (${n(r)} + ${n(l)})`,
      );
      break;
    }
    case 'sphere': {
      const r = p('r');
      add(
        'volume',
        3,
        (4 * pi * r * r * r) / 3,
        '4 ÷ 3 × π × r³',
        `4 ÷ 3 × ${piText} × ${n(r)}³`,
      );
      add(
        'surfaceArea',
        2,
        4 * pi * r * r,
        '4 × π × r²',
        `4 × ${piText} × ${n(r)}²`,
      );
      break;
    }
    case 'cuboid': {
      const w = p('w');
      const d = p('d');
      const h = p('h');
      add('volume', 3, w * d * h, 'w × d × h', `${n(w)} × ${n(d)} × ${n(h)}`);
      add(
        'surfaceArea',
        2,
        2 * (w * d + d * h + w * h),
        '2 × (w×d + d×h + w×h)',
        `2 × (${n(w)}×${n(d)} + ${n(d)}×${n(h)} + ${n(w)}×${n(h)})`,
      );
      break;
    }
  }

  if (metrics.some((m) => !Number.isFinite(m.value))) {
    return { ok: false, error: 'invalid' };
  }
  return { ok: true, metrics };
}
