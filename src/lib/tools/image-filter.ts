export interface FilterSettings {
  /** -100〜100（0で変化なし） */
  brightness: number;
  /** -100〜100（0で変化なし） */
  contrast: number;
  /** -100〜100（-100で白黒、0で変化なし、100で2倍） */
  saturation: number;
  /** -180〜180度 */
  hue: number;
  /** 0〜100 */
  grayscale: number;
  /** 0〜100 */
  sepia: number;
  /** 0〜100 */
  invert: number;
  /** 0〜MAX_BLUR（px） */
  blur: number;
  /** 0〜100 */
  sharpen: number;
}

export const MAX_BLUR = 20;

export const DEFAULT_FILTER_SETTINGS: FilterSettings = {
  brightness: 0,
  contrast: 0,
  saturation: 0,
  hue: 0,
  grayscale: 0,
  sepia: 0,
  invert: 0,
  blur: 0,
  sharpen: 0,
};

export type FilterKey = keyof FilterSettings;

export interface FilterRange {
  key: FilterKey;
  min: number;
  max: number;
}

export const FILTER_RANGES: FilterRange[] = [
  { key: 'brightness', min: -100, max: 100 },
  { key: 'contrast', min: -100, max: 100 },
  { key: 'saturation', min: -100, max: 100 },
  { key: 'hue', min: -180, max: 180 },
  { key: 'grayscale', min: 0, max: 100 },
  { key: 'sepia', min: 0, max: 100 },
  { key: 'invert', min: 0, max: 100 },
  { key: 'blur', min: 0, max: MAX_BLUR },
  { key: 'sharpen', min: 0, max: 100 },
];

/** 値を該当フィルターの範囲内の整数にクランプする（非数は0） */
export function clampFilterValue(key: FilterKey, value: number): number {
  const range = FILTER_RANGES.find((r) => r.key === key);
  if (!range) throw new Error(`Unknown filter: ${key}`);
  if (!Number.isFinite(value)) return 0;
  return Math.min(Math.max(Math.round(value), range.min), range.max);
}

/** すべての値が初期値（何も変化しない）かどうか */
export function isIdentity(settings: FilterSettings): boolean {
  return FILTER_RANGES.every(
    (r) => settings[r.key] === DEFAULT_FILTER_SETTINGS[r.key],
  );
}

function clamp255(v: number): number {
  return v < 0 ? 0 : v > 255 ? 255 : v;
}

/** 色相回転の3x3行列（CSS hue-rotate と同じ係数）。行優先の9要素 */
export function hueRotateMatrix(degrees: number): number[] {
  const rad = (degrees * Math.PI) / 180;
  const c = Math.cos(rad);
  const s = Math.sin(rad);
  return [
    0.213 + c * 0.787 - s * 0.213,
    0.715 - c * 0.715 - s * 0.715,
    0.072 - c * 0.072 + s * 0.928,
    0.213 - c * 0.213 + s * 0.143,
    0.715 + c * 0.285 + s * 0.14,
    0.072 - c * 0.072 - s * 0.283,
    0.213 - c * 0.213 - s * 0.787,
    0.715 - c * 0.715 + s * 0.715,
    0.072 + c * 0.928 + s * 0.072,
  ];
}

/** 1ピクセルの色補正（明るさ・コントラスト・彩度・色相・モノクロ・セピア・反転）。0〜255のRGBを返す */
export function applyColorAdjustments(
  r: number,
  g: number,
  b: number,
  settings: FilterSettings,
): [number, number, number] {
  const brightness = 1 + settings.brightness / 100;
  const contrast = 1 + settings.contrast / 100;
  const saturation = 1 + settings.saturation / 100;
  const gray = settings.grayscale / 100;
  const sepia = settings.sepia / 100;
  const invert = settings.invert / 100;

  r *= brightness;
  g *= brightness;
  b *= brightness;

  r = (r - 127.5) * contrast + 127.5;
  g = (g - 127.5) * contrast + 127.5;
  b = (b - 127.5) * contrast + 127.5;
  r = clamp255(r);
  g = clamp255(g);
  b = clamp255(b);

  if (settings.saturation !== 0) {
    const lum = 0.2126 * r + 0.7152 * g + 0.0722 * b;
    r = clamp255(lum + (r - lum) * saturation);
    g = clamp255(lum + (g - lum) * saturation);
    b = clamp255(lum + (b - lum) * saturation);
  }

  if (settings.hue !== 0) {
    const m = hueRotateMatrix(settings.hue);
    const nr = m[0] * r + m[1] * g + m[2] * b;
    const ng = m[3] * r + m[4] * g + m[5] * b;
    const nb = m[6] * r + m[7] * g + m[8] * b;
    r = clamp255(nr);
    g = clamp255(ng);
    b = clamp255(nb);
  }

  if (gray > 0) {
    const lum = 0.2126 * r + 0.7152 * g + 0.0722 * b;
    r += (lum - r) * gray;
    g += (lum - g) * gray;
    b += (lum - b) * gray;
  }

  if (sepia > 0) {
    const sr = 0.393 * r + 0.769 * g + 0.189 * b;
    const sg = 0.349 * r + 0.686 * g + 0.168 * b;
    const sb = 0.272 * r + 0.534 * g + 0.131 * b;
    r = clamp255(r + (sr - r) * sepia);
    g = clamp255(g + (sg - g) * sepia);
    b = clamp255(b + (sb - b) * sepia);
  }

  if (invert > 0) {
    r += (255 - 2 * r) * invert;
    g += (255 - 2 * g) * invert;
    b += (255 - 2 * b) * invert;
  }

  return [
    Math.round(clamp255(r)),
    Math.round(clamp255(g)),
    Math.round(clamp255(b)),
  ];
}

/** 1方向の箱型ぼかし（端は端の画素を延長）。alphaを含む4チャンネルを処理する */
function boxBlurPass(
  src: Float32Array,
  dst: Float32Array,
  width: number,
  height: number,
  radius: number,
  horizontal: boolean,
): void {
  const outer = horizontal ? height : width;
  const inner = horizontal ? width : height;
  const stride = horizontal ? 4 : width * 4;
  const outerStride = horizontal ? width * 4 : 4;
  const window = radius * 2 + 1;
  for (let o = 0; o < outer; o++) {
    const base = o * outerStride;
    for (let ch = 0; ch < 4; ch++) {
      let sum = 0;
      for (let k = -radius; k <= radius; k++) {
        const idx = Math.min(Math.max(k, 0), inner - 1);
        sum += src[base + idx * stride + ch];
      }
      for (let i = 0; i < inner; i++) {
        dst[base + i * stride + ch] = sum / window;
        const add = Math.min(i + radius + 1, inner - 1);
        const remove = Math.max(i - radius, 0);
        sum += src[base + add * stride + ch] - src[base + remove * stride + ch];
      }
    }
  }
}

/** RGBA配列をぼかす（半径radius px、3回の箱型ぼかしでガウスぼかしに近似）。新しい配列を返す */
export function blurRgba(
  data: Uint8ClampedArray,
  width: number,
  height: number,
  radius: number,
): Uint8ClampedArray<ArrayBuffer> {
  const r = Math.round(radius);
  if (r <= 0 || width <= 0 || height <= 0) return new Uint8ClampedArray(data);
  const a = Float32Array.from(data);
  const b = new Float32Array(data.length);
  for (let pass = 0; pass < 3; pass++) {
    boxBlurPass(a, b, width, height, r, true);
    boxBlurPass(b, a, width, height, r, false);
  }
  return Uint8ClampedArray.from(a, (v) => Math.round(v));
}

/** アンシャープマスクによるシャープ化。amountは0〜100 */
export function sharpenRgba(
  data: Uint8ClampedArray,
  width: number,
  height: number,
  amount: number,
): Uint8ClampedArray<ArrayBuffer> {
  if (amount <= 0) return new Uint8ClampedArray(data);
  const blurred = blurRgba(data, width, height, 1);
  const k = (amount / 100) * 3;
  const out = new Uint8ClampedArray(data.length);
  for (let i = 0; i < data.length; i += 4) {
    out[i] = data[i] + (data[i] - blurred[i]) * k;
    out[i + 1] = data[i + 1] + (data[i + 1] - blurred[i + 1]) * k;
    out[i + 2] = data[i + 2] + (data[i + 2] - blurred[i + 2]) * k;
    out[i + 3] = data[i + 3];
  }
  return out;
}

/**
 * RGBA配列にフィルターを適用した新しい配列を返す（元の配列は変更しない）。
 * 順序: 色補正 → ぼかし → シャープ。ctx.filter非対応のブラウザでも同じ結果になるよう、すべてピクセル操作で行う。
 */
export function applyFilters(
  data: Uint8ClampedArray,
  width: number,
  height: number,
  settings: FilterSettings,
): Uint8ClampedArray<ArrayBuffer> {
  let out = new Uint8ClampedArray(data);
  const colorChanged = FILTER_RANGES.some(
    (r) =>
      r.key !== 'blur' &&
      r.key !== 'sharpen' &&
      settings[r.key] !== DEFAULT_FILTER_SETTINGS[r.key],
  );
  if (colorChanged) {
    for (let i = 0; i < out.length; i += 4) {
      const [r, g, b] = applyColorAdjustments(
        out[i],
        out[i + 1],
        out[i + 2],
        settings,
      );
      out[i] = r;
      out[i + 1] = g;
      out[i + 2] = b;
    }
  }
  if (settings.blur > 0) out = blurRgba(out, width, height, settings.blur);
  if (settings.sharpen > 0)
    out = sharpenRgba(out, width, height, settings.sharpen);
  return out;
}

export interface FilterPreset {
  id: 'mono' | 'sepia' | 'vivid' | 'soft' | 'negative';
  settings: Partial<FilterSettings>;
}

export const FILTER_PRESETS: FilterPreset[] = [
  { id: 'mono', settings: { grayscale: 100, contrast: 10 } },
  { id: 'sepia', settings: { sepia: 100, contrast: 5 } },
  { id: 'vivid', settings: { saturation: 40, contrast: 15, sharpen: 20 } },
  { id: 'soft', settings: { brightness: 8, contrast: -10, blur: 1 } },
  { id: 'negative', settings: { invert: 100 } },
];

export function presetToSettings(preset: FilterPreset): FilterSettings {
  return { ...DEFAULT_FILTER_SETTINGS, ...preset.settings };
}

export type OutputFormat = 'png' | 'jpeg' | 'webp';

export interface OutputFormatOption {
  value: OutputFormat;
  mimeType: string;
  extension: string;
  supportsQuality: boolean;
}

export const OUTPUT_FORMAT_OPTIONS: OutputFormatOption[] = [
  {
    value: 'png',
    mimeType: 'image/png',
    extension: 'png',
    supportsQuality: false,
  },
  {
    value: 'webp',
    mimeType: 'image/webp',
    extension: 'webp',
    supportsQuality: true,
  },
  {
    value: 'jpeg',
    mimeType: 'image/jpeg',
    extension: 'jpg',
    supportsQuality: true,
  },
];

export function getOutputFormatOption(
  format: OutputFormat,
): OutputFormatOption {
  const option = OUTPUT_FORMAT_OPTIONS.find((o) => o.value === format);
  if (!option) throw new Error(`Unknown output format: ${String(format)}`);
  return option;
}

/** メモリ保護のための画素数上限（約4,000万画素） */
export const MAX_PIXELS = 40_000_000;
export const MAX_FILE_SIZE = 25 * 1024 * 1024;

const ACCEPTED_INPUT_MIME_TYPES = new Set([
  'image/png',
  'image/jpeg',
  'image/webp',
  'image/gif',
  'image/bmp',
]);

export function isAcceptedImageFile(file: { type: string }): boolean {
  return ACCEPTED_INPUT_MIME_TYPES.has(file.type);
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  const units = ['KB', 'MB', 'GB'];
  let value = bytes;
  let unitIndex = -1;
  do {
    value /= 1024;
    unitIndex++;
  } while (value >= 1024 && unitIndex < units.length - 1);
  return `${value.toFixed(value < 10 ? 2 : 1)} ${units[unitIndex]}`;
}

/** 元のファイル名の拡張子を出力形式のものに置き換え、`-filtered` を付ける */
export function buildOutputFileName(
  originalName: string,
  format: OutputFormat,
): string {
  const option = getOutputFormatOption(format);
  const lastDot = originalName.lastIndexOf('.');
  const base = lastDot > 0 ? originalName.slice(0, lastDot) : originalName;
  return `${base || 'image'}-filtered.${option.extension}`;
}
