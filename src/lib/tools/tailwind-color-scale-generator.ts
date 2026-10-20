import {
  hexToRgb,
  hslToRgb,
  normalizeHex,
  rgbToHex,
  rgbToHsl,
} from './color-converter';

export const scaleSteps = [
  50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950,
] as const;

export type ScaleStep = (typeof scaleSteps)[number];

/** 各段階の目標明度（HSL の L、%） */
const stepLightness: Record<ScaleStep, number> = {
  50: 97,
  100: 94,
  200: 86,
  300: 76,
  400: 64,
  500: 52,
  600: 43,
  700: 35,
  800: 28,
  900: 22,
  950: 13,
};

export interface ScaleEntry {
  step: ScaleStep;
  hex: string;
}

export interface ColorScale {
  entries: ScaleEntry[];
  /** 基準色をそのまま配置した段階 */
  baseStep: ScaleStep | null;
}

/**
 * 基準色の色相・彩度を保ったまま、明度を11段階に振ったスケールを作る。
 * keepBase が true なら、明度が最も近い段階に基準色そのもの（正規化HEX）を置く。
 * 不正なHEXはnull。
 */
export function generateScale(
  baseHex: string,
  keepBase = true,
): ColorScale | null {
  const base = normalizeHex(baseHex);
  if (!base) return null;
  const hsl = rgbToHsl(hexToRgb(base)!);

  let baseStep: ScaleStep | null = null;
  if (keepBase) {
    let best = Infinity;
    for (const step of scaleSteps) {
      const diff = Math.abs(stepLightness[step] - hsl.l);
      if (diff < best) {
        best = diff;
        baseStep = step;
      }
    }
  }

  const entries = scaleSteps.map((step) => ({
    step,
    hex:
      step === baseStep
        ? base
        : rgbToHex(hslToRgb({ ...hsl, l: stepLightness[step] })),
  }));
  return { entries, baseStep };
}

/** 色名として使える形（英小文字・数字・ハイフン）に整える。空になれば fallback */
export function sanitizeName(name: string, fallback = 'brand'): string {
  const cleaned = name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
  return cleaned || fallback;
}

/** CSSカスタムプロパティ形式（--brand-50: #…;） */
export function toCssVariables(entries: ScaleEntry[], name: string): string {
  const n = sanitizeName(name);
  const lines = entries.map((e) => `  --${n}-${e.step}: ${e.hex};`);
  return `:root {\n${lines.join('\n')}\n}`;
}

/** Tailwind CSS v4 の @theme 形式（--color-brand-50: #…;） */
export function toTailwindTheme(entries: ScaleEntry[], name: string): string {
  const n = sanitizeName(name);
  const lines = entries.map((e) => `  --color-${n}-${e.step}: ${e.hex};`);
  return `@theme {\n${lines.join('\n')}\n}`;
}

/** Tailwind CSS v3 の tailwind.config.js 形式 */
export function toTailwindConfig(entries: ScaleEntry[], name: string): string {
  const n = sanitizeName(name);
  const key = /^[a-z_$][a-z0-9_$]*$/.test(n) ? n : `'${n}'`;
  const lines = entries.map((e) => `          ${e.step}: '${e.hex}',`);
  return [
    'module.exports = {',
    '  theme: {',
    '    extend: {',
    '      colors: {',
    `        ${key}: {`,
    ...lines,
    '        },',
    '      },',
    '    },',
    '  },',
    '};',
  ].join('\n');
}
