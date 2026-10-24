import {
  MAX_FILE_SIZE,
  MAX_PIXELS,
  OUTPUT_FORMAT_OPTIONS,
  formatFileSize,
  getOutputFormatOption,
  isAcceptedImageFile,
  type OutputFormat,
} from './image-filter';

export {
  MAX_FILE_SIZE,
  MAX_PIXELS,
  OUTPUT_FORMAT_OPTIONS,
  formatFileSize,
  getOutputFormatOption,
  isAcceptedImageFile,
};
export type { OutputFormat };

export type ScanMode = 'color' | 'gray' | 'bw';

export const SCAN_MODES: ScanMode[] = ['color', 'gray', 'bw'];

export interface ScanSettings {
  mode: ScanMode;
  /** 影・照明ムラの除去の強さ 0〜100 */
  shadow: number;
  /** 紙の白さ・文字の締まり 0〜100 */
  contrast: number;
  /** 白黒モードのしきい値を自動（大津の方法）で決めるか */
  autoThreshold: boolean;
  /** 白黒モードの手動しきい値 1〜254（この値以下を黒にする） */
  threshold: number;
}

export const DEFAULT_SCAN_SETTINGS: ScanSettings = {
  mode: 'color',
  shadow: 80,
  contrast: 40,
  autoThreshold: true,
  threshold: 140,
};

export interface ScanPreset {
  id: 'color' | 'gray' | 'bw';
  settings: ScanSettings;
}

export const SCAN_PRESETS: ScanPreset[] = [
  {
    id: 'color',
    settings: { ...DEFAULT_SCAN_SETTINGS, mode: 'color' },
  },
  {
    id: 'gray',
    settings: { ...DEFAULT_SCAN_SETTINGS, mode: 'gray' },
  },
  {
    id: 'bw',
    settings: {
      ...DEFAULT_SCAN_SETTINGS,
      mode: 'bw',
      shadow: 100,
      contrast: 30,
    },
  },
];

function clamp(v: number, min: number, max: number): number {
  return v < min ? min : v > max ? max : v;
}

/** 設定値を範囲内に丸める（不正な値は既定値へ） */
export function normalizeSettings(s: Partial<ScanSettings>): ScanSettings {
  const num = (v: unknown, fallback: number, min: number, max: number) =>
    typeof v === 'number' && Number.isFinite(v)
      ? clamp(Math.round(v), min, max)
      : fallback;
  const d = DEFAULT_SCAN_SETTINGS;
  return {
    mode: SCAN_MODES.includes(s.mode as ScanMode)
      ? (s.mode as ScanMode)
      : d.mode,
    shadow: num(s.shadow, d.shadow, 0, 100),
    contrast: num(s.contrast, d.contrast, 0, 100),
    autoThreshold:
      typeof s.autoThreshold === 'boolean' ? s.autoThreshold : d.autoThreshold,
    threshold: num(s.threshold, d.threshold, 1, 254),
  };
}

/** 処理時の最大辺（px）。これを超える画像は縮小して処理する */
export const MAX_WORK_EDGE = 3000;

export function computeWorkSize(
  width: number,
  height: number,
  maxEdge: number = MAX_WORK_EDGE,
): { width: number; height: number; scale: number } {
  const longest = Math.max(width, height);
  const scale = longest > maxEdge ? maxEdge / longest : 1;
  return {
    width: Math.max(1, Math.round(width * scale)),
    height: Math.max(1, Math.round(height * scale)),
    scale,
  };
}

/** 透過を白と合成した輝度（0〜255）を返す */
export function computeLuma(
  data: ArrayLike<number>,
  width: number,
  height: number,
): Uint8Array {
  const n = width * height;
  const luma = new Uint8Array(n);
  for (let i = 0; i < n; i++) {
    const p = i * 4;
    const a = data[p + 3] / 255;
    const r = data[p] * a + 255 * (1 - a);
    const g = data[p + 1] * a + 255 * (1 - a);
    const b = data[p + 2] * a + 255 * (1 - a);
    luma[i] = Math.round(0.2126 * r + 0.7152 * g + 0.0722 * b);
  }
  return luma;
}

export interface BackgroundGrid {
  cell: number;
  gw: number;
  gh: number;
  values: Float32Array;
}

/**
 * 紙の地色（背景の明るさ）を粗いグリッドで推定する。
 * 各セルで「平均より明るい画素の平均」を取り、文字の影響を抑えたうえで平滑化する。
 */
export function estimateBackground(
  luma: ArrayLike<number>,
  width: number,
  height: number,
): BackgroundGrid {
  const cell = Math.max(4, Math.ceil(Math.max(width, height) / 48));
  const gw = Math.max(1, Math.ceil(width / cell));
  const gh = Math.max(1, Math.ceil(height / cell));
  let values = new Float32Array(gw * gh);
  for (let gy = 0; gy < gh; gy++) {
    for (let gx = 0; gx < gw; gx++) {
      const x0 = gx * cell;
      const y0 = gy * cell;
      const x1 = Math.min(x0 + cell, width);
      const y1 = Math.min(y0 + cell, height);
      let sum = 0;
      let count = 0;
      for (let y = y0; y < y1; y++) {
        for (let x = x0; x < x1; x++) {
          sum += luma[y * width + x];
          count++;
        }
      }
      const mean = count > 0 ? sum / count : 255;
      let bright = 0;
      let brightCount = 0;
      for (let y = y0; y < y1; y++) {
        for (let x = x0; x < x1; x++) {
          const v = luma[y * width + x];
          if (v >= mean) {
            bright += v;
            brightCount++;
          }
        }
      }
      values[gy * gw + gx] = brightCount > 0 ? bright / brightCount : mean;
    }
  }
  for (let pass = 0; pass < 2; pass++) {
    const next = new Float32Array(values.length);
    for (let gy = 0; gy < gh; gy++) {
      for (let gx = 0; gx < gw; gx++) {
        let s = 0;
        let c = 0;
        for (let dy = -1; dy <= 1; dy++) {
          for (let dx = -1; dx <= 1; dx++) {
            const nx = gx + dx;
            const ny = gy + dy;
            if (nx < 0 || ny < 0 || nx >= gw || ny >= gh) continue;
            s += values[ny * gw + nx];
            c++;
          }
        }
        next[gy * gw + gx] = s / c;
      }
    }
    values = next;
  }
  return { cell, gw, gh, values };
}

/** グリッドを双線形補間して画素(x, y)の背景輝度を返す */
export function sampleBackground(
  grid: BackgroundGrid,
  x: number,
  y: number,
): number {
  const fx = clamp((x + 0.5) / grid.cell - 0.5, 0, grid.gw - 1);
  const fy = clamp((y + 0.5) / grid.cell - 0.5, 0, grid.gh - 1);
  const x0 = Math.floor(fx);
  const y0 = Math.floor(fy);
  const x1 = Math.min(x0 + 1, grid.gw - 1);
  const y1 = Math.min(y0 + 1, grid.gh - 1);
  const tx = fx - x0;
  const ty = fy - y0;
  const v = grid.values;
  const top = v[y0 * grid.gw + x0] * (1 - tx) + v[y0 * grid.gw + x1] * tx;
  const bottom = v[y1 * grid.gw + x0] * (1 - tx) + v[y1 * grid.gw + x1] * tx;
  return top * (1 - ty) + bottom * ty;
}

/** 大津の方法。256階級のヒストグラムから「この値以下を黒」とするしきい値を返す */
export function otsuThreshold(histogram: ArrayLike<number>): number {
  let total = 0;
  let sumAll = 0;
  for (let i = 0; i < 256; i++) {
    total += histogram[i];
    sumAll += i * histogram[i];
  }
  if (total === 0) return 128;
  let wB = 0;
  let sumB = 0;
  let best = -1;
  let threshold = 128;
  for (let t = 0; t < 256; t++) {
    wB += histogram[t];
    if (wB === 0) continue;
    const wF = total - wB;
    if (wF === 0) break;
    sumB += t * histogram[t];
    const mB = sumB / wB;
    const mF = (sumAll - sumB) / wF;
    const between = wB * wF * (mB - mF) * (mB - mF);
    if (between > best) {
      best = between;
      threshold = t;
    }
  }
  return best > 0 ? threshold : 128;
}

/** コントラスト値から黒点・白点を求める（白点未満の紙の灰色を白に飛ばす） */
export function levelsFor(contrast: number): { black: number; white: number } {
  const c = clamp(contrast, 0, 100);
  return { black: c * 0.5, white: 255 - c * 0.6 };
}

/** 影の除去で掛ける倍率の上限（暗すぎる領域を無理に持ち上げない） */
const MAX_SHADOW_GAIN = 4;

/**
 * 書類スキャン風の補正を適用した新しいRGBA配列を返す（元の配列は変更しない）。
 * 出力のalphaは常に255（透過は白と合成）。
 */
export function applyDocumentScan(
  data: Uint8ClampedArray,
  width: number,
  height: number,
  settings: ScanSettings,
): Uint8ClampedArray<ArrayBuffer> {
  const s = normalizeSettings(settings);
  const out = new Uint8ClampedArray(width * height * 4);
  const luma = computeLuma(data, width, height);
  const strength = s.shadow / 100;
  const grid = strength > 0 ? estimateBackground(luma, width, height) : null;
  const { black, white } = levelsFor(s.contrast);
  const span = Math.max(white - black, 1);
  const level = (v: number) => clamp(((v - black) / span) * 255, 0, 255);
  const histogram = new Uint32Array(256);

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const i = y * width + x;
      const p = i * 4;
      const a = data[p + 3] / 255;
      let r = data[p] * a + 255 * (1 - a);
      let g = data[p + 1] * a + 255 * (1 - a);
      let b = data[p + 2] * a + 255 * (1 - a);
      if (grid) {
        const bg = Math.max(sampleBackground(grid, x, y), 1);
        const full = Math.min(255 / bg, MAX_SHADOW_GAIN);
        const gain = 1 + (full - 1) * strength;
        r = Math.min(r * gain, 255);
        g = Math.min(g * gain, 255);
        b = Math.min(b * gain, 255);
      }
      if (s.mode === 'color') {
        out[p] = Math.round(level(r));
        out[p + 1] = Math.round(level(g));
        out[p + 2] = Math.round(level(b));
      } else {
        const v = Math.round(level(0.2126 * r + 0.7152 * g + 0.0722 * b));
        out[p] = v;
        out[p + 1] = v;
        out[p + 2] = v;
        if (s.mode === 'bw') histogram[v]++;
      }
      out[p + 3] = 255;
    }
  }

  if (s.mode === 'bw') {
    const t = s.autoThreshold ? otsuThreshold(histogram) : s.threshold;
    for (let p = 0; p < out.length; p += 4) {
      const v = out[p] <= t ? 0 : 255;
      out[p] = v;
      out[p + 1] = v;
      out[p + 2] = v;
    }
  }
  return out;
}

/** 元のファイル名の拡張子を出力形式のものに置き換え、`-scan` を付ける */
export function buildOutputFileName(
  originalName: string,
  format: OutputFormat,
): string {
  const option = getOutputFormatOption(format);
  const lastDot = originalName.lastIndexOf('.');
  const base = lastDot > 0 ? originalName.slice(0, lastDot) : originalName;
  return `${base || 'image'}-scan.${option.extension}`;
}
