export {
  MAX_FILE_SIZE,
  buildOutputFileName,
  formatFileSize,
  isAcceptedImageFile,
} from './image-pixelart-converter';

export const MIN_STRENGTH = 0;
export const MAX_STRENGTH = 100;

/** 加工を行うピクセル数の上限（これを超える画像はメモリ・処理時間の都合で受け付けない） */
export const MAX_PIXELS = 16_000_000;

export interface OcrProtectOptions {
  /** ノイズ量（0〜100）。0で無効 */
  noise: number;
  /** 微小な歪み（0〜100）。0で無効 */
  warp: number;
  /** 重畳する細線の量（0〜100）。0で無効 */
  lines: number;
}

export type PresetId = 'light' | 'standard' | 'strong';

export const PRESETS: Record<PresetId, OcrProtectOptions> = {
  light: { noise: 15, warp: 15, lines: 10 },
  standard: { noise: 30, warp: 30, lines: 30 },
  strong: { noise: 55, warp: 55, lines: 55 },
};

export const DEFAULT_OPTIONS: OcrProtectOptions = PRESETS.standard;

/** 強度スライダーの値として妥当な範囲（0〜100の整数）にクランプする */
export function clampStrength(value: number): number {
  if (!Number.isFinite(value)) return MIN_STRENGTH;
  return Math.min(Math.max(Math.round(value), MIN_STRENGTH), MAX_STRENGTH);
}

export function isWithinPixelLimit(width: number, height: number): boolean {
  return width * height <= MAX_PIXELS;
}

/** シード付きの擬似乱数生成器（mulberry32）。同じシードなら同じ加工結果になり、スライダー操作中に模様がちらつかない */
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

function clampByte(v: number): number {
  return v < 0 ? 0 : v > 255 ? 255 : v;
}

/** 画像サイズに応じた拡大率。大きい画像ほど歪みやノイズの粒度を大きくして、見た目の強さを揃える */
function scaleFor(width: number, height: number): number {
  return Math.max(1, Math.max(width, height) / 1000);
}

/**
 * 正弦波の変位場で画像を微小に歪ませる（双一次補間）。
 * 変位量は最大でも画像1000pxあたり約3px程度に収まる。
 */
export function applyWarp(
  src: Uint8ClampedArray,
  width: number,
  height: number,
  strength: number,
  rng: () => number,
): Uint8ClampedArray {
  const s = clampStrength(strength);
  if (s === 0) return src;
  const scale = scaleFor(width, height);
  const amp = (s / 100) * 3 * scale;
  const waveA = (14 + rng() * 10) * scale;
  const waveB = (18 + rng() * 12) * scale;
  const phaseA = rng() * Math.PI * 2;
  const phaseB = rng() * Math.PI * 2;
  const phaseC = rng() * Math.PI * 2;
  const phaseD = rng() * Math.PI * 2;
  const twoPi = Math.PI * 2;
  const out = new Uint8ClampedArray(src.length);

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const dx =
        amp *
        (Math.sin((twoPi * y) / waveA + phaseA) * 0.6 +
          Math.sin((twoPi * x) / waveB + phaseC) * 0.4);
      const dy =
        amp *
        (Math.sin((twoPi * x) / waveA + phaseB) * 0.6 +
          Math.sin((twoPi * y) / waveB + phaseD) * 0.4);
      const sx = Math.min(Math.max(x + dx, 0), width - 1);
      const sy = Math.min(Math.max(y + dy, 0), height - 1);
      const x0 = Math.floor(sx);
      const y0 = Math.floor(sy);
      const x1 = Math.min(x0 + 1, width - 1);
      const y1 = Math.min(y0 + 1, height - 1);
      const fx = sx - x0;
      const fy = sy - y0;
      const w00 = (1 - fx) * (1 - fy);
      const w10 = fx * (1 - fy);
      const w01 = (1 - fx) * fy;
      const w11 = fx * fy;
      const i00 = (y0 * width + x0) * 4;
      const i10 = (y0 * width + x1) * 4;
      const i01 = (y1 * width + x0) * 4;
      const i11 = (y1 * width + x1) * 4;
      const o = (y * width + x) * 4;
      for (let c = 0; c < 4; c++) {
        out[o + c] =
          src[i00 + c] * w00 +
          src[i10 + c] * w10 +
          src[i01 + c] * w01 +
          src[i11 + c] * w11;
      }
    }
  }
  return out;
}

/** 各ピクセルにランダムなノイズを加える（明るさ方向のノイズ＋わずかな色ノイズ）。アルファは変更しない */
export function applyNoise(
  data: Uint8ClampedArray,
  strength: number,
  rng: () => number,
): void {
  const s = clampStrength(strength);
  if (s === 0) return;
  const sigma = (s / 100) * 48;
  for (let i = 0; i < data.length; i += 4) {
    if (data[i + 3] === 0) continue;
    // 一様乱数3つの和で正規分布に近い分布にする（範囲は約±1.5）
    const luma = (rng() + rng() + rng() - 1.5) * 2 * sigma;
    for (let c = 0; c < 3; c++) {
      const chroma = (rng() - 0.5) * sigma * 0.5;
      data[i + c] = clampByte(data[i + c] + luma + chroma);
    }
  }
}

/** 画像全体を横切る半透明の細線をランダムに重ねる。文字の上を線が通ることで文字の輪郭抽出を乱す */
export function applyLines(
  data: Uint8ClampedArray,
  width: number,
  height: number,
  strength: number,
  rng: () => number,
): void {
  const s = clampStrength(strength);
  if (s === 0) return;
  const count = Math.round((s / 100) * Math.min(600, (width * height) / 3000));
  const alpha = 0.25 + (s / 100) * 0.2;
  const thickness = Math.max(1, Math.round(scaleFor(width, height)));

  for (let n = 0; n < count; n++) {
    const x0 = rng() * width;
    const y0 = rng() * height;
    const angle = rng() * Math.PI;
    const length = Math.max(width, height) * (0.3 + rng() * 0.7);
    const color = rng() < 0.5 ? 0 : 255;
    const steps = Math.ceil(length);
    const dxStep = Math.cos(angle);
    const dyStep = Math.sin(angle);
    for (let k = 0; k < steps; k++) {
      const cx = Math.round(x0 + dxStep * k);
      const cy = Math.round(y0 + dyStep * k);
      if (cx < 0 || cy < 0 || cx >= width || cy >= height) continue;
      for (let ty = 0; ty < thickness; ty++) {
        for (let tx = 0; tx < thickness; tx++) {
          const px = cx + tx;
          const py = cy + ty;
          if (px >= width || py >= height) continue;
          const i = (py * width + px) * 4;
          if (data[i + 3] === 0) continue;
          for (let c = 0; c < 3; c++) {
            data[i + c] = data[i + c] * (1 - alpha) + color * alpha;
          }
        }
      }
    }
  }
}

/**
 * RGBAピクセル列にOCR対策の加工（歪み→ノイズ→細線）を施した新しい配列を返す。元の配列は変更しない。
 * 効果の保証はできない（OCRや画像認識の進化により読み取られる可能性がある）。
 */
export function protectImageData(
  src: Uint8ClampedArray,
  width: number,
  height: number,
  options: OcrProtectOptions,
  seed: number,
): Uint8ClampedArray {
  const rng = createRng(seed);
  const warped = applyWarp(src, width, height, options.warp, rng);
  const out = warped === src ? new Uint8ClampedArray(src) : warped;
  applyNoise(out, options.noise, rng);
  applyLines(out, width, height, options.lines, rng);
  return out;
}
