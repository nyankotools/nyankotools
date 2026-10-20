export type FilterKey =
  | 'blur'
  | 'brightness'
  | 'contrast'
  | 'grayscale'
  | 'hueRotate'
  | 'invert'
  | 'opacity'
  | 'saturate'
  | 'sepia';

export interface FilterDef {
  key: FilterKey;
  /** CSS filter 関数名 */
  fn: string;
  unit: 'px' | '%' | 'deg';
  min: number;
  max: number;
  /** この値のとき出力から省略する（効果なし） */
  neutral: number;
}

/** 出力順（CSSの filter は左から順に適用される） */
export const FILTER_DEFS: FilterDef[] = [
  { key: 'blur', fn: 'blur', unit: 'px', min: 0, max: 50, neutral: 0 },
  {
    key: 'brightness',
    fn: 'brightness',
    unit: '%',
    min: 0,
    max: 300,
    neutral: 100,
  },
  {
    key: 'contrast',
    fn: 'contrast',
    unit: '%',
    min: 0,
    max: 300,
    neutral: 100,
  },
  {
    key: 'grayscale',
    fn: 'grayscale',
    unit: '%',
    min: 0,
    max: 100,
    neutral: 0,
  },
  {
    key: 'hueRotate',
    fn: 'hue-rotate',
    unit: 'deg',
    min: 0,
    max: 360,
    neutral: 0,
  },
  { key: 'invert', fn: 'invert', unit: '%', min: 0, max: 100, neutral: 0 },
  { key: 'opacity', fn: 'opacity', unit: '%', min: 0, max: 100, neutral: 100 },
  {
    key: 'saturate',
    fn: 'saturate',
    unit: '%',
    min: 0,
    max: 300,
    neutral: 100,
  },
  { key: 'sepia', fn: 'sepia', unit: '%', min: 0, max: 100, neutral: 0 },
];

export interface DropShadow {
  enabled: boolean;
  offsetX: number;
  offsetY: number;
  blur: number;
  color: string;
}

export interface FilterState {
  values: Record<FilterKey, number>;
  dropShadow: DropShadow;
}

const FALLBACK_COLOR = '#000000';

function toFiniteInt(value: number): number {
  return Number.isFinite(value) ? Math.round(value) : 0;
}

export function getDef(key: FilterKey): FilterDef {
  return FILTER_DEFS.find((d) => d.key === key)!;
}

export function clampFilterValue(key: FilterKey, value: number): number {
  const def = getDef(key);
  if (!Number.isFinite(value)) return def.neutral;
  return Math.min(def.max, Math.max(def.min, Math.round(value)));
}

export function clampShadowOffset(value: number): number {
  return Math.min(100, Math.max(-100, toFiniteInt(value)));
}

export function clampShadowBlur(value: number): number {
  return Math.min(100, Math.max(0, toFiniteInt(value)));
}

/** `#rgb` / `#rrggbb` のみ受け付け、小文字6桁に正規化する。不正な値は黒 */
export function normalizeColor(value: string): string {
  const v = value.trim().toLowerCase();
  if (/^#[0-9a-f]{6}$/.test(v)) return v;
  const m = /^#([0-9a-f])([0-9a-f])([0-9a-f])$/.exec(v);
  if (m) return `#${m[1]}${m[1]}${m[2]}${m[2]}${m[3]}${m[3]}`;
  return FALLBACK_COLOR;
}

export function defaultDropShadow(): DropShadow {
  return {
    enabled: false,
    offsetX: 4,
    offsetY: 4,
    blur: 6,
    color: '#000000',
  };
}

export function defaultFilterState(): FilterState {
  const values = {} as Record<FilterKey, number>;
  for (const d of FILTER_DEFS) values[d.key] = d.neutral;
  return { values, dropShadow: defaultDropShadow() };
}

/** `filter:` を含まない値部分。効果のない関数は省略し、何も無ければ `none` */
export function buildFilterValue(state: FilterState): string {
  const parts: string[] = [];
  for (const d of FILTER_DEFS) {
    const v = clampFilterValue(d.key, state.values[d.key]);
    if (v === d.neutral) continue;
    parts.push(`${d.fn}(${v}${d.unit})`);
  }
  const s = state.dropShadow;
  if (s.enabled) {
    parts.push(
      `drop-shadow(${clampShadowOffset(s.offsetX)}px ${clampShadowOffset(s.offsetY)}px ${clampShadowBlur(s.blur)}px ${normalizeColor(s.color)})`,
    );
  }
  return parts.length > 0 ? parts.join(' ') : 'none';
}

export function buildCssDeclaration(state: FilterState): string {
  return `filter: ${buildFilterValue(state)};`;
}

export type FilterPresetId =
  'vintage' | 'noir' | 'dreamy' | 'vivid' | 'invert' | 'shadow';

export interface FilterPreset {
  id: FilterPresetId;
  values: Partial<Record<FilterKey, number>>;
  dropShadow?: Partial<DropShadow>;
}

export const FILTER_PRESETS: FilterPreset[] = [
  {
    id: 'vintage',
    values: { sepia: 60, contrast: 110, brightness: 90, saturate: 120 },
  },
  { id: 'noir', values: { grayscale: 100, contrast: 130, brightness: 90 } },
  { id: 'dreamy', values: { blur: 2, brightness: 115, saturate: 130 } },
  { id: 'vivid', values: { saturate: 180, contrast: 115 } },
  { id: 'invert', values: { invert: 100, hueRotate: 180 } },
  {
    id: 'shadow',
    values: {},
    dropShadow: {
      enabled: true,
      offsetX: 6,
      offsetY: 8,
      blur: 8,
      color: '#000000',
    },
  },
];

export function getPreset(id: string): FilterPreset | undefined {
  return FILTER_PRESETS.find((p) => p.id === id);
}

/** プリセットを初期状態に重ねた完全な状態を返す */
export function applyPreset(preset: FilterPreset): FilterState {
  const state = defaultFilterState();
  for (const d of FILTER_DEFS) {
    const v = preset.values[d.key];
    if (v !== undefined) state.values[d.key] = clampFilterValue(d.key, v);
  }
  if (preset.dropShadow) {
    state.dropShadow = { ...state.dropShadow, ...preset.dropShadow };
  }
  return state;
}
