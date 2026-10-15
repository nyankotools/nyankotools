import { hexToRgb, rgbToHex } from './color-converter';

export type VisionTypeId =
  'protanopia' | 'deuteranopia' | 'tritanopia' | 'achromatopsia';

export interface VisionType {
  id: VisionTypeId;
  /** 色の一般的な呼び名（P型=1型色覚、D型=2型色覚、T型=3型色覚） */
  code: 'P' | 'D' | 'T' | 'A';
  /** 重症度スライダーが効くか（全色盲は常に完全） */
  supportsSeverity: boolean;
}

export const VISION_TYPES: VisionType[] = [
  { id: 'protanopia', code: 'P', supportsSeverity: true },
  { id: 'deuteranopia', code: 'D', supportsSeverity: true },
  { id: 'tritanopia', code: 'T', supportsSeverity: true },
  { id: 'achromatopsia', code: 'A', supportsSeverity: false },
];

/** Machado et al. (2009) の重症度1.0の3x3行列（線形RGBに適用、行優先） */
const FULL_MATRICES: Record<
  Exclude<VisionTypeId, 'achromatopsia'>,
  readonly number[]
> = {
  protanopia: [
    0.152286, 1.052583, -0.204868, 0.114503, 0.786281, 0.099216, -0.003882,
    -0.048116, 1.051998,
  ],
  deuteranopia: [
    0.367322, 0.860646, -0.227968, 0.280085, 0.672501, 0.047413, -0.01182,
    0.04294, 0.968881,
  ],
  tritanopia: [
    1.255528, -0.076749, -0.178779, -0.078411, 0.930809, 0.147602, 0.004733,
    0.691367, 0.3039,
  ],
};

/** 線形RGBでの輝度係数（Rec.709） */
const LUMA: readonly number[] = [0.2126, 0.7152, 0.0722];

const IDENTITY: readonly number[] = [1, 0, 0, 0, 1, 0, 0, 0, 1];

export const MIN_SEVERITY = 0;
export const MAX_SEVERITY = 100;
export const DEFAULT_SEVERITY = 100;

export function clampSeverity(value: number): number {
  if (!Number.isFinite(value)) return DEFAULT_SEVERITY;
  return Math.min(Math.max(Math.round(value), MIN_SEVERITY), MAX_SEVERITY);
}

/**
 * 見え方の変換行列を返す。severity は 0〜100（%）。100で2色覚（完全）、
 * それより小さい値は単位行列との線形補間（異常3色覚の近似）。
 */
export function getMatrix(id: VisionTypeId, severity: number): number[] {
  if (id === 'achromatopsia') {
    return [...LUMA, ...LUMA, ...LUMA];
  }
  const full = FULL_MATRICES[id];
  const s = clampSeverity(severity) / 100;
  return full.map((v, i) => IDENTITY[i] + (v - IDENTITY[i]) * s);
}

function srgbToLinear(v: number): number {
  const c = v / 255;
  return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
}

function linearToSrgb(v: number): number {
  const c = Math.min(Math.max(v, 0), 1);
  const s = c <= 0.0031308 ? c * 12.92 : 1.055 * Math.pow(c, 1 / 2.4) - 0.055;
  return Math.round(s * 255);
}

const LINEAR_TABLE: Float32Array = (() => {
  const t = new Float32Array(256);
  for (let i = 0; i < 256; i++) t[i] = srgbToLinear(i);
  return t;
})();

/** RGBピクセル1つを変換する（0〜255の整数を返す） */
export function simulatePixel(
  r: number,
  g: number,
  b: number,
  matrix: readonly number[],
): [number, number, number] {
  const lr = LINEAR_TABLE[r];
  const lg = LINEAR_TABLE[g];
  const lb = LINEAR_TABLE[b];
  return [
    linearToSrgb(matrix[0] * lr + matrix[1] * lg + matrix[2] * lb),
    linearToSrgb(matrix[3] * lr + matrix[4] * lg + matrix[5] * lb),
    linearToSrgb(matrix[6] * lr + matrix[7] * lg + matrix[8] * lb),
  ];
}

/** RGBA配列（ImageData.data）全体を変換した新しい配列を返す。アルファは保持する */
export function simulateImageData(
  data: Uint8ClampedArray,
  id: VisionTypeId,
  severity: number,
): Uint8ClampedArray<ArrayBuffer> {
  const matrix = getMatrix(id, severity);
  const out = new Uint8ClampedArray(data.length);
  for (let i = 0; i < data.length; i += 4) {
    const [r, g, b] = simulatePixel(data[i], data[i + 1], data[i + 2], matrix);
    out[i] = r;
    out[i + 1] = g;
    out[i + 2] = b;
    out[i + 3] = data[i + 3];
  }
  return out;
}

/** カラーコード（#rgb / #rrggbb）を変換し #rrggbb で返す。不正な入力はnull */
export function simulateHex(
  hex: string,
  id: VisionTypeId,
  severity: number,
): string | null {
  const rgb = hexToRgb(hex);
  if (!rgb) return null;
  const [r, g, b] = simulatePixel(rgb.r, rgb.g, rgb.b, getMatrix(id, severity));
  return rgbToHex({ r, g, b });
}

/** WCAG相対輝度（0〜1） */
function relativeLuminance(hex: string): number | null {
  const rgb = hexToRgb(hex);
  if (!rgb) return null;
  return (
    0.2126 * srgbToLinear(rgb.r) +
    0.7152 * srgbToLinear(rgb.g) +
    0.0722 * srgbToLinear(rgb.b)
  );
}

/** WCAGのコントラスト比（1〜21）。不正な入力はnull */
export function contrastRatio(hexA: string, hexB: string): number | null {
  const a = relativeLuminance(hexA);
  const b = relativeLuminance(hexB);
  if (a === null || b === null) return null;
  const [hi, lo] = a >= b ? [a, b] : [b, a];
  return (hi + 0.05) / (lo + 0.05);
}

export const MAX_PIXELS = 40_000_000;
export const MAX_FILE_SIZE = 25 * 1024 * 1024;

/** 元のファイル名の拡張子をpngに置き換え、`-<type>` を付ける */
export function buildOutputFileName(
  originalName: string,
  id: VisionTypeId,
): string {
  const lastDot = originalName.lastIndexOf('.');
  const base = lastDot > 0 ? originalName.slice(0, lastDot) : originalName;
  return `${base || 'image'}-${id}.png`;
}
