export type GradientKind = 'linear' | 'radial' | 'conic';
export type WallpaperFormat = 'png' | 'jpeg';

export interface ColorStop {
  /** #rrggbb */
  color: string;
  /** 0〜100（%） */
  position: number;
}

export const MIN_STOPS = 2;
export const MAX_STOPS = 5;
export const MIN_SIDE = 16;
export const MAX_SIDE = 8192;
/** Canvas の面積上限（Safari の約1677万ピクセルに合わせる） */
export const MAX_PIXELS = 16_777_216;
export const MAX_NOISE = 100;

export const SIZE_PRESETS: { id: string; width: number; height: number }[] = [
  { id: 'phone', width: 1080, height: 2400 },
  { id: 'phone-hd', width: 1440, height: 3120 },
  { id: 'tablet', width: 2048, height: 2732 },
  { id: 'fhd', width: 1920, height: 1080 },
  { id: 'qhd', width: 2560, height: 1440 },
  { id: '4k', width: 3840, height: 2160 },
  { id: 'square', width: 2000, height: 2000 },
];

export const FORMAT_INFO: Record<
  WallpaperFormat,
  { mime: string; extension: string }
> = {
  png: { mime: 'image/png', extension: 'png' },
  jpeg: { mime: 'image/jpeg', extension: 'jpg' },
};

export type SizeError = 'integer' | 'range' | 'pixels';

/** 解像度の検証。問題なければ null */
export function validateSize(width: number, height: number): SizeError | null {
  if (!Number.isInteger(width) || !Number.isInteger(height)) return 'integer';
  if (
    width < MIN_SIDE ||
    height < MIN_SIDE ||
    width > MAX_SIDE ||
    height > MAX_SIDE
  ) {
    return 'range';
  }
  if (width * height > MAX_PIXELS) return 'pixels';
  return null;
}

/** `#rgb` / `#rrggbb` を `#rrggbb`（小文字）に正規化。不正なら null */
export function normalizeHexColor(input: string): string | null {
  const m = /^#?([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(input.trim());
  if (!m) return null;
  let hex = m[1].toLowerCase();
  if (hex.length === 3) hex = [...hex].map((c) => c + c).join('');
  return `#${hex}`;
}

export function hexToRgb(hex: string): [number, number, number] {
  return [
    parseInt(hex.slice(1, 3), 16),
    parseInt(hex.slice(3, 5), 16),
    parseInt(hex.slice(5, 7), 16),
  ];
}

/** n 個の色を 0〜100% に等間隔で並べる位置 */
export function evenPositions(count: number): number[] {
  if (count <= 1) return [0];
  return Array.from({ length: count }, (_, i) =>
    Math.round((i / (count - 1)) * 100),
  );
}

/** 位置を 0〜100 に丸めて昇順に並べ替える（同位置は元の順序を保つ） */
export function normalizeStops(stops: ColorStop[]): ColorStop[] {
  return stops
    .map((s, i) => ({
      color: s.color,
      position: Number.isFinite(s.position)
        ? Math.min(100, Math.max(0, s.position))
        : 0,
      i,
    }))
    .sort((a, b) => a.position - b.position || a.i - b.i)
    .map(({ color, position }) => ({ color, position }));
}

/** 位置 t（0〜1）での色を線形補間で求める。ストップは normalizeStops 済みを想定 */
export function colorAt(stops: ColorStop[], t: number): string {
  if (stops.length === 0) return '#000000';
  const p = Math.min(1, Math.max(0, t)) * 100;
  if (p <= stops[0].position) return stops[0].color;
  const last = stops[stops.length - 1];
  if (p >= last.position) return last.color;
  for (let i = 0; i < stops.length - 1; i++) {
    const a = stops[i];
    const b = stops[i + 1];
    if (p >= a.position && p <= b.position) {
      const span = b.position - a.position;
      const k = span === 0 ? 0 : (p - a.position) / span;
      const ca = hexToRgb(a.color);
      const cb = hexToRgb(b.color);
      const mixed = ca.map((v, j) => Math.round(v + (cb[j] - v) * k));
      return `#${mixed.map((v) => v.toString(16).padStart(2, '0')).join('')}`;
    }
  }
  return last.color;
}

export interface LinearLine {
  x0: number;
  y0: number;
  x1: number;
  y1: number;
}

/** CSS の linear-gradient と同じ向き（0deg=上向き、時計回り）の始点・終点 */
export function linearGradientLine(
  width: number,
  height: number,
  angleDeg: number,
): LinearLine {
  const rad = (angleDeg * Math.PI) / 180;
  const dx = Math.sin(rad);
  const dy = -Math.cos(rad);
  const length = Math.abs(width * dx) + Math.abs(height * dy);
  const cx = width / 2;
  const cy = height / 2;
  return {
    x0: cx - (dx * length) / 2,
    y0: cy - (dy * length) / 2,
    x1: cx + (dx * length) / 2,
    y1: cy + (dy * length) / 2,
  };
}

/** 放射状の半径（farthest-corner） */
export function radialRadius(width: number, height: number): number {
  return Math.hypot(width / 2, height / 2);
}

/** 円錐グラデーションの開始角（Canvas は右が0なので、CSS の「上が0」から -90° ずらす） */
export function conicStartAngle(angleDeg: number): number {
  return ((angleDeg - 90) * Math.PI) / 180;
}

/** 決定的な疑似乱数（mulberry32） */
export function createRng(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * RGBA 配列（ImageData.data）に粒状ノイズを加える（破壊的）。
 * amount は 0〜100。100 で各チャンネル最大 ±32 ほど揺らす。アルファは変えない。
 */
export function applyNoise(
  data: Uint8ClampedArray,
  amount: number,
  seed = 1,
): void {
  const a = Math.min(MAX_NOISE, Math.max(0, amount));
  if (a === 0) return;
  const range = (a / MAX_NOISE) * 32;
  const rng = createRng(seed);
  for (let i = 0; i < data.length; i += 4) {
    // 1ピクセルに同じ揺らぎを RGB へ加え、色相がずれないようにする
    const d = Math.round((rng() * 2 - 1) * range);
    data[i] += d;
    data[i + 1] += d;
    data[i + 2] += d;
  }
}

export function buildFilename(
  width: number,
  height: number,
  format: WallpaperFormat,
): string {
  return `gradient-wallpaper-${width}x${height}.${FORMAT_INFO[format].extension}`;
}
