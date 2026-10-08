import {
  hexToRgb,
  hslToRgb,
  normalizeHex,
  rgbToHex,
  rgbToHsl,
} from './color-converter';

export const harmonyTypes = [
  'complementary',
  'analogous',
  'triadic',
  'split-complementary',
  'tetradic',
  'square',
  'monochromatic',
] as const;

export type HarmonyType = (typeof harmonyTypes)[number];

/** 基準色からの色相オフセット（度）。monochromatic は別処理 */
const hueOffsets: Record<Exclude<HarmonyType, 'monochromatic'>, number[]> = {
  complementary: [0, 180],
  analogous: [-30, 0, 30],
  triadic: [0, 120, 240],
  'split-complementary': [0, 150, 210],
  tetradic: [0, 60, 180, 240],
  square: [0, 90, 180, 270],
};

/**
 * 基準色から配色パレット（HEX配列）を生成する。
 * 基準色自体は入力のHEX（正規化後）のまま含める。不正なHEXはnull。
 * analogous は [基準-30°, 基準, 基準+30°]、monochromatic は明度違いの5色。
 */
export function generatePalette(
  baseHex: string,
  type: HarmonyType,
): string[] | null {
  const base = normalizeHex(baseHex);
  if (!base) return null;
  const rgb = hexToRgb(base)!;
  const hsl = rgbToHsl(rgb);

  if (type === 'monochromatic') {
    return [20, 35, 50, 65, 80].map((l) => rgbToHex(hslToRgb({ ...hsl, l })));
  }

  return hueOffsets[type].map((offset) =>
    offset === 0 ? base : rgbToHex(hslToRgb({ ...hsl, h: hsl.h + offset })),
  );
}

/** CSSカスタムプロパティ形式で書き出す */
export function toCssVariables(colors: string[], prefix = 'color'): string {
  const lines = colors.map((c, i) => `  --${prefix}-${i + 1}: ${c};`);
  return `:root {\n${lines.join('\n')}\n}`;
}

/** JSON配列形式で書き出す */
export function toJson(colors: string[]): string {
  return JSON.stringify(colors, null, 2);
}
