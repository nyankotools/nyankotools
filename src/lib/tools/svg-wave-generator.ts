export type WaveSide = 'bottom' | 'top';

export const WAVE_WIDTH = 1440;
export const BLOB_SIZE = 400;

export const LIMITS = {
  waveHeight: { min: 100, max: 600 },
  amplitude: { min: 5, max: 50 },
  waves: { min: 1, max: 8 },
  points: { min: 3, max: 16 },
  randomness: { min: 0, max: 100 },
} as const;

export const DEFAULT_COLOR = '#3b82f6';

export interface WaveParams {
  seed: number;
  height: number;
  /** 高さに対する振幅（%） */
  amplitude: number;
  /** 山の数 */
  waves: number;
  /** ばらつき（%） */
  randomness: number;
  /** 塗りつぶす側 */
  side: WaveSide;
}

export interface BlobParams {
  seed: number;
  points: number;
  randomness: number;
}

export function clampInt(value: number, min: number, max: number): number {
  if (!Number.isFinite(value)) return min;
  return Math.min(max, Math.max(min, Math.round(value)));
}

/** シード入力を 0〜2^32-1 の整数に正規化する */
export function normalizeSeed(value: number): number {
  if (!Number.isFinite(value)) return 0;
  const n = Math.trunc(Math.abs(value));
  return n % 4294967296;
}

export function randomSeed(random: () => number = Math.random): number {
  return Math.floor(random() * 1000000);
}

/** mulberry32: シードから 0以上1未満の乱数列を作る */
export function createRng(seed: number): () => number {
  let a = normalizeSeed(seed) >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function fmt(n: number): string {
  return String(Math.round(n * 10) / 10);
}

export function isHexColor(value: string): boolean {
  return /^#[0-9a-fA-F]{6}$/.test(value);
}

export function sanitizeColor(value: string): string {
  return isHexColor(value) ? value.toLowerCase() : DEFAULT_COLOR;
}

/** 波形のpath（viewBox: 0 0 1440 height）。指定した側を塗りつぶす閉じたパス */
export function buildWavePath(params: WaveParams): string {
  const height = clampInt(
    params.height,
    LIMITS.waveHeight.min,
    LIMITS.waveHeight.max,
  );
  const amplitude = clampInt(
    params.amplitude,
    LIMITS.amplitude.min,
    LIMITS.amplitude.max,
  );
  const waves = clampInt(params.waves, LIMITS.waves.min, LIMITS.waves.max);
  const randomness =
    clampInt(params.randomness, LIMITS.randomness.min, LIMITS.randomness.max) /
    100;
  const rng = createRng(params.seed);

  const intervals = waves * 2;
  const step = WAVE_WIDTH / intervals;
  const mid = height / 2;
  const amp = (height * amplitude) / 100;

  const ys: number[] = [];
  for (let i = 0; i <= intervals; i++) {
    const scale = 1 - randomness * 0.7 * rng();
    const sign = i % 2 === 0 ? -1 : 1;
    ys.push(mid + sign * amp * scale);
  }

  let d = `M0,${fmt(ys[0])}`;
  for (let i = 1; i <= intervals; i++) {
    const x0 = (i - 1) * step;
    const x1 = i * step;
    const cx = (x0 + x1) / 2;
    d += ` C${fmt(cx)},${fmt(ys[i - 1])} ${fmt(cx)},${fmt(ys[i])} ${fmt(x1)},${fmt(ys[i])}`;
  }
  const edge = params.side === 'top' ? 0 : height;
  d += ` L${WAVE_WIDTH},${edge} L0,${edge} Z`;
  return d;
}

/** ブロブのpath（viewBox: 0 0 400 400）。Catmull-Rom曲線を3次ベジェに変換した閉じたパス */
export function buildBlobPath(params: BlobParams): string {
  const n = clampInt(params.points, LIMITS.points.min, LIMITS.points.max);
  const randomness =
    clampInt(params.randomness, LIMITS.randomness.min, LIMITS.randomness.max) /
    100;
  const rng = createRng(params.seed);
  const c = BLOB_SIZE / 2;
  const maxR = BLOB_SIZE * 0.46;

  const pts: { x: number; y: number }[] = [];
  for (let i = 0; i < n; i++) {
    const angle = (i / n) * Math.PI * 2 - Math.PI / 2;
    const r = maxR * (1 - randomness * 0.55 * rng());
    pts.push({ x: c + r * Math.cos(angle), y: c + r * Math.sin(angle) });
  }

  let d = `M${fmt(pts[0].x)},${fmt(pts[0].y)}`;
  for (let i = 0; i < n; i++) {
    const p0 = pts[(i - 1 + n) % n];
    const p1 = pts[i];
    const p2 = pts[(i + 1) % n];
    const p3 = pts[(i + 2) % n];
    const c1x = p1.x + (p2.x - p0.x) / 6;
    const c1y = p1.y + (p2.y - p0.y) / 6;
    const c2x = p2.x - (p3.x - p1.x) / 6;
    const c2y = p2.y - (p3.y - p1.y) / 6;
    d += ` C${fmt(c1x)},${fmt(c1y)} ${fmt(c2x)},${fmt(c2y)} ${fmt(p2.x)},${fmt(p2.y)}`;
  }
  return `${d} Z`;
}

export interface SvgOptions {
  path: string;
  width: number;
  height: number;
  color: string;
  /** 波形のように横幅いっぱいに引き伸ばす用途では true */
  stretch: boolean;
}

export function buildSvg(options: SvgOptions): string {
  const color = sanitizeColor(options.color);
  const aspect = options.stretch ? ' preserveAspectRatio="none"' : '';
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${options.width} ${options.height}"${aspect}><path fill="${color}" d="${options.path}"/></svg>`;
}

/** SVGをCSSの背景画像（data URI）として使う宣言を返す */
export function buildCssBackground(svg: string, stretch: boolean): string {
  const size = stretch ? '100% 100%' : 'contain';
  return [
    `background-image: url("data:image/svg+xml,${encodeURIComponent(svg)}");`,
    `background-size: ${size};`,
    'background-repeat: no-repeat;',
  ].join('\n');
}
