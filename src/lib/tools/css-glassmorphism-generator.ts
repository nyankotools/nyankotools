/** グラスモーフィズム（すりガラス）の設定 */
export interface GlassParams {
  /** 6桁の16進数カラー（#rrggbb） */
  color: string;
  /** 背景色の不透明度（0-100%） */
  opacity: number;
  /** backdrop-filter: blur()（0-40px） */
  blur: number;
  /** backdrop-filter: saturate()（100-250%） */
  saturate: number;
  /** 枠線の不透明度（0-100%） */
  borderOpacity: number;
  /** border-radius（0-100px） */
  radius: number;
  /** 影の濃さ（0-100%） */
  shadowOpacity: number;
}

export type GlassPresetId = 'light' | 'dark' | 'tinted' | 'frosted';

export const GLASS_PRESET_IDS: GlassPresetId[] = [
  'light',
  'dark',
  'tinted',
  'frosted',
];

export const GLASS_PRESETS: Record<GlassPresetId, GlassParams> = {
  light: {
    color: '#ffffff',
    opacity: 25,
    blur: 10,
    saturate: 150,
    borderOpacity: 30,
    radius: 16,
    shadowOpacity: 20,
  },
  dark: {
    color: '#000000',
    opacity: 30,
    blur: 12,
    saturate: 120,
    borderOpacity: 15,
    radius: 16,
    shadowOpacity: 35,
  },
  tinted: {
    color: '#6366f1',
    opacity: 25,
    blur: 14,
    saturate: 180,
    borderOpacity: 35,
    radius: 20,
    shadowOpacity: 25,
  },
  frosted: {
    color: '#ffffff',
    opacity: 12,
    blur: 24,
    saturate: 100,
    borderOpacity: 45,
    radius: 12,
    shadowOpacity: 10,
  },
};

/** プレビュー用の背景（外部画像は使わずCSSグラデーションのみ） */
export type GlassBackgroundId =
  'sunset' | 'ocean' | 'aurora' | 'candy' | 'night';

export const GLASS_BACKGROUND_IDS: GlassBackgroundId[] = [
  'sunset',
  'ocean',
  'aurora',
  'candy',
  'night',
];

export const GLASS_BACKGROUNDS: Record<GlassBackgroundId, string> = {
  sunset: 'linear-gradient(135deg, #f97316 0%, #ec4899 50%, #8b5cf6 100%)',
  ocean: 'linear-gradient(135deg, #0ea5e9 0%, #2563eb 50%, #1e1b4b 100%)',
  aurora: 'linear-gradient(135deg, #10b981 0%, #06b6d4 50%, #6366f1 100%)',
  candy: 'linear-gradient(135deg, #fde68a 0%, #f9a8d4 50%, #a5b4fc 100%)',
  night: 'linear-gradient(135deg, #0f172a 0%, #312e81 60%, #be185d 100%)',
};

export type NeuShape = 'flat' | 'pressed' | 'concave' | 'convex';
export const NEU_SHAPES: NeuShape[] = ['flat', 'pressed', 'concave', 'convex'];

export type NeuLight =
  'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
export const NEU_LIGHTS: NeuLight[] = [
  'top-left',
  'top-right',
  'bottom-left',
  'bottom-right',
];

/** ニューモーフィズムの設定 */
export interface NeuParams {
  /** 要素と背景に共通の基準色（#rrggbb） */
  color: string;
  shape: NeuShape;
  light: NeuLight;
  /** 影のオフセット距離（1-50px） */
  distance: number;
  /** 影のぼかし（0-100px） */
  blur: number;
  /** 明暗の強さ（1-40%） */
  intensity: number;
  /** border-radius（0-100px） */
  radius: number;
}

export const DEFAULT_NEU: NeuParams = {
  color: '#e0e5ec',
  shape: 'flat',
  light: 'top-left',
  distance: 10,
  blur: 20,
  intensity: 15,
  radius: 24,
};

export const DEFAULT_GLASS: GlassParams = GLASS_PRESETS.light;

function clampInt(value: number, min: number, max: number): number {
  if (!Number.isFinite(value)) return min;
  return Math.min(max, Math.max(min, Math.round(value)));
}

export function clampGlass(p: GlassParams): GlassParams {
  return {
    color: normalizeHex(p.color, '#ffffff'),
    opacity: clampInt(p.opacity, 0, 100),
    blur: clampInt(p.blur, 0, 40),
    saturate: clampInt(p.saturate, 100, 250),
    borderOpacity: clampInt(p.borderOpacity, 0, 100),
    radius: clampInt(p.radius, 0, 100),
    shadowOpacity: clampInt(p.shadowOpacity, 0, 100),
  };
}

export function clampNeu(p: NeuParams): NeuParams {
  return {
    color: normalizeHex(p.color, DEFAULT_NEU.color),
    shape: NEU_SHAPES.includes(p.shape) ? p.shape : 'flat',
    light: NEU_LIGHTS.includes(p.light) ? p.light : 'top-left',
    distance: clampInt(p.distance, 1, 50),
    blur: clampInt(p.blur, 0, 100),
    intensity: clampInt(p.intensity, 1, 40),
    radius: clampInt(p.radius, 0, 100),
  };
}

/** `#rgb` / `#rrggbb` を小文字の `#rrggbb` に正規化する。不正値は fallback */
export function normalizeHex(value: string, fallback: string): string {
  const m = /^#?([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(value.trim());
  if (!m) return fallback;
  let hex = m[1].toLowerCase();
  if (hex.length === 3) {
    hex = hex
      .split('')
      .map((c) => c + c)
      .join('');
  }
  return `#${hex}`;
}

export function hexToRgb(hex: string): [number, number, number] {
  const h = normalizeHex(hex, '#000000').slice(1);
  return [
    parseInt(h.slice(0, 2), 16),
    parseInt(h.slice(2, 4), 16),
    parseInt(h.slice(4, 6), 16),
  ];
}

function toHex(n: number): string {
  return Math.min(255, Math.max(0, Math.round(n)))
    .toString(16)
    .padStart(2, '0');
}

/**
 * 色を明るく（amount > 0: 白へ近づける）または暗く（amount < 0: 黒へ近づける）する。
 * amount は -1〜1。
 */
export function shade(hex: string, amount: number): string {
  const [r, g, b] = hexToRgb(hex);
  const a = Math.min(1, Math.max(-1, amount));
  const f = (c: number) => (a >= 0 ? c + (255 - c) * a : c * (1 + a));
  return `#${toHex(f(r))}${toHex(f(g))}${toHex(f(b))}`;
}

function alpha(percent: number): string {
  // 小数点以下2桁まで。末尾の0は落とす
  return String(Math.round(percent) / 100);
}

export function rgba(hex: string, percent: number): string {
  const [r, g, b] = hexToRgb(hex);
  return `rgba(${r}, ${g}, ${b}, ${alpha(percent)})`;
}

/** グラスモーフィズムのCSS宣言（1行1宣言）。ベンダープレフィックス付き */
export function buildGlassDeclarations(params: GlassParams): string[] {
  const p = clampGlass(params);
  const filter = `blur(${p.blur}px) saturate(${p.saturate}%)`;
  return [
    `background: ${rgba(p.color, p.opacity)};`,
    `backdrop-filter: ${filter};`,
    `-webkit-backdrop-filter: ${filter};`,
    `border: 1px solid ${rgba('#ffffff', p.borderOpacity)};`,
    `border-radius: ${p.radius}px;`,
    `box-shadow: 0 8px 32px ${rgba('#1f2687', p.shadowOpacity)};`,
  ];
}

export function buildGlassCss(params: GlassParams): string {
  return buildGlassDeclarations(params).join('\n');
}

function gradientAngle(light: NeuLight): number {
  switch (light) {
    case 'top-left':
      return 145;
    case 'top-right':
      return 225;
    case 'bottom-left':
      return 45;
    case 'bottom-right':
      return 315;
  }
}

/** ニューモーフィズムのCSS宣言（1行1宣言）。親要素の背景は同じ基準色にする */
export function buildNeuDeclarations(params: NeuParams): string[] {
  const p = clampNeu(params);
  const lighter = shade(p.color, p.intensity / 100);
  const darker = shade(p.color, -p.intensity / 100);
  const sx = p.light.endsWith('left') ? 1 : -1;
  const sy = p.light.startsWith('top') ? 1 : -1;
  const dx = sx * p.distance;
  const dy = sy * p.distance;
  const inset = p.shape === 'pressed' ? 'inset ' : '';
  const angle = gradientAngle(p.light);

  let background = p.color;
  if (p.shape === 'concave') {
    background = `linear-gradient(${angle}deg, ${shade(p.color, -0.06)}, ${shade(p.color, 0.06)})`;
  } else if (p.shape === 'convex') {
    background = `linear-gradient(${angle}deg, ${shade(p.color, 0.06)}, ${shade(p.color, -0.06)})`;
  }

  return [
    `background: ${background};`,
    `border-radius: ${p.radius}px;`,
    `box-shadow: ${inset}${dx}px ${dy}px ${p.blur}px ${darker}, ${inset}${-dx}px ${-dy}px ${p.blur}px ${lighter};`,
  ];
}

export function buildNeuCss(params: NeuParams): string {
  return buildNeuDeclarations(params).join('\n');
}
