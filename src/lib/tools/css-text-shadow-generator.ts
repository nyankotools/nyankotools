export interface TextShadowLayer {
  offsetX: number;
  offsetY: number;
  blur: number;
  color: string;
}

export const MIN_SHADOWS = 1;
export const MAX_SHADOWS = 8;

export const DEFAULT_SHADOW_COLORS = [
  '#000000',
  '#3b82f6',
  '#a855f7',
  '#ec4899',
  '#f59e0b',
  '#10b981',
];

const FALLBACK_COLOR = '#000000';

function toFiniteInt(value: number): number {
  return Number.isFinite(value) ? Math.round(value) : 0;
}

export function clampOffset(value: number): number {
  return Math.min(100, Math.max(-100, toFiniteInt(value)));
}

export function clampBlur(value: number): number {
  return Math.min(100, Math.max(0, toFiniteInt(value)));
}

/** `#rgb` / `#rrggbb` のみ受け付け、小文字の6桁に正規化する。不正な値は黒にフォールバックする */
export function normalizeColor(value: string): string {
  const v = value.trim().toLowerCase();
  if (/^#[0-9a-f]{6}$/.test(v)) return v;
  const m = /^#([0-9a-f])([0-9a-f])([0-9a-f])$/.exec(v);
  if (m) return `#${m[1]}${m[1]}${m[2]}${m[2]}${m[3]}${m[3]}`;
  return FALLBACK_COLOR;
}

/** 追加するレイヤーの初期値。既存レイヤー数に応じてオフセット・ぼかしを段階的に広げる */
export function suggestNewShadow(existingCount: number): TextShadowLayer {
  return {
    offsetX: clampOffset(2 + existingCount * 2),
    offsetY: clampOffset(2 + existingCount * 2),
    blur: clampBlur(4 + existingCount * 2),
    color: DEFAULT_SHADOW_COLORS[existingCount % DEFAULT_SHADOW_COLORS.length],
  };
}

function formatShadow(layer: TextShadowLayer): string {
  return [
    `${clampOffset(layer.offsetX)}px`,
    `${clampOffset(layer.offsetY)}px`,
    `${clampBlur(layer.blur)}px`,
    normalizeColor(layer.color),
  ].join(' ');
}

/** `text-shadow:`は含まない値部分。複数レイヤーはカンマ区切りで連結する */
export function buildTextShadowValue(layers: TextShadowLayer[]): string {
  return layers.map(formatShadow).join(', ');
}

/** コピー用に整形した `text-shadow: ...;` 宣言全体 */
export function buildCssDeclaration(layers: TextShadowLayer[]): string {
  return `text-shadow: ${buildTextShadowValue(layers)};`;
}

export type TextShadowPresetId =
  'soft' | 'neon' | 'outline' | 'emboss' | 'retro' | 'glow';

export interface TextShadowPreset {
  id: TextShadowPresetId;
  layers: TextShadowLayer[];
  textColor: string;
  backgroundColor: string;
}

export const TEXT_SHADOW_PRESETS: TextShadowPreset[] = [
  {
    id: 'soft',
    layers: [{ offsetX: 2, offsetY: 2, blur: 4, color: '#000000' }],
    textColor: '#111827',
    backgroundColor: '#f3f4f6',
  },
  {
    id: 'neon',
    layers: [
      { offsetX: 0, offsetY: 0, blur: 4, color: '#ffffff' },
      { offsetX: 0, offsetY: 0, blur: 10, color: '#ffffff' },
      { offsetX: 0, offsetY: 0, blur: 20, color: '#ff00de' },
      { offsetX: 0, offsetY: 0, blur: 40, color: '#ff00de' },
      { offsetX: 0, offsetY: 0, blur: 80, color: '#ff00de' },
    ],
    textColor: '#ffffff',
    backgroundColor: '#0b0b1a',
  },
  {
    id: 'outline',
    layers: [
      { offsetX: -1, offsetY: -1, blur: 0, color: '#000000' },
      { offsetX: 1, offsetY: -1, blur: 0, color: '#000000' },
      { offsetX: -1, offsetY: 1, blur: 0, color: '#000000' },
      { offsetX: 1, offsetY: 1, blur: 0, color: '#000000' },
    ],
    textColor: '#ffffff',
    backgroundColor: '#6b7280',
  },
  {
    id: 'emboss',
    layers: [
      { offsetX: 1, offsetY: 1, blur: 0, color: '#ffffff' },
      { offsetX: -1, offsetY: -1, blur: 0, color: '#6b7280' },
    ],
    textColor: '#9ca3af',
    backgroundColor: '#d1d5db',
  },
  {
    id: 'retro',
    layers: [
      { offsetX: 3, offsetY: 3, blur: 0, color: '#ec4899' },
      { offsetX: 6, offsetY: 6, blur: 0, color: '#3b82f6' },
    ],
    textColor: '#ffffff',
    backgroundColor: '#1f2937',
  },
  {
    id: 'glow',
    layers: [
      { offsetX: 0, offsetY: 0, blur: 8, color: '#fde047' },
      { offsetX: 0, offsetY: 0, blur: 20, color: '#f59e0b' },
    ],
    textColor: '#ffffff',
    backgroundColor: '#1f2937',
  },
];

export function getPreset(id: string): TextShadowPreset | undefined {
  return TEXT_SHADOW_PRESETS.find((p) => p.id === id);
}
