import { rgbToHsl, type RgbColor } from './color-converter';

export interface CmykColor {
  c: number;
  m: number;
  y: number;
  k: number;
}

export interface HwbColor {
  h: number;
  w: number;
  b: number;
}

/** CIE Lab（CSS の lab() と同じ D50 白色点） */
export interface LabColor {
  l: number;
  a: number;
  b: number;
}

/** OKLab の極座標表現（L: 0〜1、C: 彩度、h: 色相角 0〜360） */
export interface OklchColor {
  l: number;
  c: number;
  h: number;
}

/** 変換結果。sRGBの範囲外だった色は範囲内に丸めたうえで clipped を true にする */
export interface RgbResult {
  rgb: RgbColor;
  clipped: boolean;
}

// 色域外判定の許容誤差（線形RGBでの値。丸め誤差で誤検知しないための余裕）
const GAMUT_EPSILON = 0.002;

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function round(value: number, digits: number): number {
  const factor = 10 ** digits;
  // -0 を 0 に揃える
  return Math.round(value * factor) / factor + 0;
}

// ---- sRGB ⇔ 線形RGB ----

function toLinear(channel: number): number {
  const c = channel / 255;
  return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
}

function fromLinear(value: number): number {
  const v =
    value <= 0.0031308 ? 12.92 * value : 1.055 * value ** (1 / 2.4) - 0.055;
  return v * 255;
}

type Vec3 = [number, number, number];
type Mat3 = [Vec3, Vec3, Vec3];

function mul(m: Mat3, v: Vec3): Vec3 {
  return [
    m[0][0] * v[0] + m[0][1] * v[1] + m[0][2] * v[2],
    m[1][0] * v[0] + m[1][1] * v[1] + m[1][2] * v[2],
    m[2][0] * v[0] + m[2][1] * v[1] + m[2][2] * v[2],
  ];
}

/** 線形RGB（0〜1。範囲外もあり得る）を、範囲内に丸めた8bitのRGBにする */
function linearToResult(linear: Vec3): RgbResult {
  const out = linear.map((v) => fromLinearSafe(v));
  const clipped = linear.some(
    (v) => v < -GAMUT_EPSILON || v > 1 + GAMUT_EPSILON,
  );
  const [r, g, b] = out.map((v) => clamp(Math.round(v), 0, 255));
  return { rgb: { r, g, b }, clipped };
}

function fromLinearSafe(value: number): number {
  return fromLinear(clamp(value, 0, 1));
}

function rgbToLinear({ r, g, b }: RgbColor): Vec3 {
  return [toLinear(r), toLinear(g), toLinear(b)];
}

// ---- CMYK（ICCプロファイルを使わない簡易換算） ----

export function rgbToCmyk({ r, g, b }: RgbColor): CmykColor {
  const rn = clamp(r, 0, 255) / 255;
  const gn = clamp(g, 0, 255) / 255;
  const bn = clamp(b, 0, 255) / 255;
  const k = 1 - Math.max(rn, gn, bn);
  if (k >= 1) return { c: 0, m: 0, y: 0, k: 100 };
  return {
    c: round(((1 - rn - k) / (1 - k)) * 100, 0),
    m: round(((1 - gn - k) / (1 - k)) * 100, 0),
    y: round(((1 - bn - k) / (1 - k)) * 100, 0),
    k: round(k * 100, 0),
  };
}

export function cmykToRgb({ c, m, y, k }: CmykColor): RgbColor {
  const kn = 1 - clamp(k, 0, 100) / 100;
  const channel = (v: number) =>
    Math.round(255 * (1 - clamp(v, 0, 100) / 100) * kn);
  return { r: channel(c), g: channel(m), b: channel(y) };
}

// ---- HWB ----

export function rgbToHwb(rgb: RgbColor): HwbColor {
  const max = Math.max(rgb.r, rgb.g, rgb.b) / 255;
  const min = Math.min(rgb.r, rgb.g, rgb.b) / 255;
  return {
    h: rgbToHsl(rgb).h,
    w: round(min * 100, 0),
    b: round((1 - max) * 100, 0),
  };
}

export function hwbToRgb({ h, w, b }: HwbColor): RgbColor {
  const wn = clamp(w, 0, 100) / 100;
  const bn = clamp(b, 0, 100) / 100;
  if (wn + bn >= 1) {
    const gray = Math.round((wn / (wn + bn)) * 255);
    return { r: gray, g: gray, b: gray };
  }
  const hue = (((h % 360) + 360) % 360) / 60;
  // 純色（彩度100%・明度50%のHSL）の各チャンネル
  const pure = [5, 3, 1].map((n) => {
    const k = (n + hue) % 6;
    return 1 - Math.max(0, Math.min(k, 4 - k, 1));
  });
  const [r, g, bl] = pure.map((v) =>
    Math.round((v * (1 - wn - bn) + wn) * 255),
  );
  return { r, g, b: bl };
}

// ---- CIE Lab（D50） ----

const SRGB_TO_XYZ_D65: Mat3 = [
  [0.41239079926595934, 0.357584339383878, 0.1804807884018343],
  [0.21263900587151027, 0.715168678767756, 0.07219231536073371],
  [0.01933081871559182, 0.11919477979462598, 0.9505321522496607],
];
const XYZ_D65_TO_SRGB: Mat3 = [
  [3.2409699419045226, -1.537383177570094, -0.4986107602930034],
  [-0.9692436362808796, 1.8759675015077202, 0.04155505740717559],
  [0.05563007969699366, -0.20397695888897652, 1.0569715142428786],
];
const XYZ_D65_TO_D50: Mat3 = [
  [1.0479297925449969, 0.022946870601609652, -0.05019226628920524],
  [0.02962780877005599, 0.9904344267538799, -0.017073799063418826],
  [-0.009243040646204504, 0.015055191490298152, 0.7518742814281371],
];
const XYZ_D50_TO_D65: Mat3 = [
  [0.955473421488075, -0.02309845494876471, 0.06325924320057072],
  [-0.0283697093338637, 1.0099953980813041, 0.021041441191917323],
  [0.012314014864481998, -0.020507649298898964, 1.330365926242124],
];
const D50_WHITE: Vec3 = [0.3457 / 0.3585, 1, (1 - 0.3457 - 0.3585) / 0.3585];

const LAB_EPSILON = 216 / 24389;
const LAB_KAPPA = 24389 / 27;

function labF(t: number): number {
  return t > LAB_EPSILON ? Math.cbrt(t) : (LAB_KAPPA * t + 16) / 116;
}

function labFInverse(f: number): number {
  const cubed = f ** 3;
  return cubed > LAB_EPSILON ? cubed : (116 * f - 16) / LAB_KAPPA;
}

export function rgbToLab(rgb: RgbColor): LabColor {
  const xyz = mul(XYZ_D65_TO_D50, mul(SRGB_TO_XYZ_D65, rgbToLinear(rgb)));
  const [fx, fy, fz] = xyz.map((v, i) => labF(v / D50_WHITE[i]));
  return { l: 116 * fy - 16, a: 500 * (fx - fy), b: 200 * (fy - fz) };
}

export function labToRgb({ l, a, b }: LabColor): RgbResult {
  const fy = (l + 16) / 116;
  const fx = fy + a / 500;
  const fz = fy - b / 200;
  const xyz = [fx, fy, fz].map((f, i) => labFInverse(f) * D50_WHITE[i]) as Vec3;
  return linearToResult(mul(XYZ_D65_TO_SRGB, mul(XYZ_D50_TO_D65, xyz)));
}

// ---- OKLCH ----

const ACHROMATIC_CHROMA = 0.0001;

export function rgbToOklch(rgb: RgbColor): OklchColor {
  const [r, g, b] = rgbToLinear(rgb);
  const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b);
  const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b);
  const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);
  const okL = 0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s;
  const okA = 1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s;
  const okB = 0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s;
  const chroma = Math.hypot(okA, okB);
  let hue =
    chroma < ACHROMATIC_CHROMA ? 0 : (Math.atan2(okB, okA) * 180) / Math.PI;
  if (hue < 0) hue += 360;
  return { l: okL, c: chroma, h: hue };
}

export function oklchToRgb({ l, c, h }: OklchColor): RgbResult {
  const rad = (h * Math.PI) / 180;
  const a = c * Math.cos(rad);
  const b = c * Math.sin(rad);
  const lp = (l + 0.3963377774 * a + 0.2158037573 * b) ** 3;
  const mp = (l - 0.1055613458 * a - 0.0638541728 * b) ** 3;
  const sp = (l - 0.0894841775 * a - 1.291485548 * b) ** 3;
  return linearToResult([
    4.0767416621 * lp - 3.3077115913 * mp + 0.2309699292 * sp,
    -1.2684380046 * lp + 2.6097574011 * mp - 0.3413193965 * sp,
    -0.0041960863 * lp - 0.7034186147 * mp + 1.707614701 * sp,
  ]);
}

// ---- 文字列の解釈 ----

interface Component {
  value: number;
  percent: boolean;
}

/**
 * "fn(1 2 3)" "fn(1, 2, 3)" "1, 2, 3" "1 2 3" を数値列にする。
 * "/" 以降（アルファ値）は無視する。解釈できなければ null
 */
function parseComponents(
  input: string,
  fn: string,
  count: number,
): Component[] | null {
  const trimmed = input.trim();
  const wrapped = trimmed.match(new RegExp(`^${fn}\\(([^()]*)\\)$`, 'i'));
  const body = wrapped ? wrapped[1] : trimmed;
  if (body.includes('(') || body.includes(')')) return null;
  const tokens = body
    .split('/')[0]
    .split(/[\s,]+/)
    .filter(Boolean);
  if (tokens.length !== count) return null;

  const components: Component[] = [];
  for (const token of tokens) {
    const match = token.match(/^([+-]?(?:\d+\.?\d*|\.\d+))(%|deg)?$/i);
    if (!match) return null;
    components.push({
      value: Number(match[1]),
      percent: match[2] === '%',
    });
  }
  return components;
}

function inRange(value: number, min: number, max: number): boolean {
  return value >= min && value <= max;
}

/** "cmyk(0%, 100%, 100%, 0%)" "0, 100, 100, 0" など */
export function parseCmykString(input: string): CmykColor | null {
  const parts = parseComponents(input, 'cmyk', 4);
  if (!parts) return null;
  const [c, m, y, k] = parts.map((p) => p.value);
  if (![c, m, y, k].every((v) => inRange(v, 0, 100))) return null;
  return { c, m, y, k };
}

/** "hwb(217 23% 4%)" "hwb(217, 23%, 4%)" "217, 23, 4" など */
export function parseHwbString(input: string): HwbColor | null {
  const parts = parseComponents(input, 'hwb', 3);
  if (!parts) return null;
  const [h, w, b] = parts.map((p) => p.value);
  if (!inRange(w, 0, 100) || !inRange(b, 0, 100)) return null;
  return { h: normalizeHue(h), w, b };
}

/** "lab(54.29 80.8 69.89)" "54.29, 80.8, 69.89" など。L は 0〜100 */
export function parseLabString(input: string): LabColor | null {
  const parts = parseComponents(input, 'lab', 3);
  if (!parts) return null;
  const [l, a, b] = parts.map((p) => p.value);
  if (!inRange(l, 0, 100) || !inRange(a, -160, 160) || !inRange(b, -160, 160)) {
    return null;
  }
  return { l, a, b };
}

/** "oklch(0.628 0.2577 29.23)" "oklch(62.8% 0.2577 29.23)" など。L は 0〜1 または 0〜100% */
export function parseOklchString(input: string): OklchColor | null {
  const parts = parseComponents(input, 'oklch', 3);
  if (!parts) return null;
  const [lp, cp, hp] = parts;
  const l = lp.percent ? lp.value / 100 : lp.value;
  // CSS では彩度の 100% が 0.4
  const c = cp.percent ? (cp.value / 100) * 0.4 : cp.value;
  if (!inRange(l, 0, 1) || !inRange(c, 0, 0.5)) return null;
  return { l, c, h: normalizeHue(hp.value) };
}

// ---- 表示用の整形 ----

export function formatCmyk({ c, m, y, k }: CmykColor): string {
  return `cmyk(${c}%, ${m}%, ${y}%, ${k}%)`;
}

export function formatHwb({ h, w, b }: HwbColor): string {
  return `hwb(${h} ${w}% ${b}%)`;
}

export function formatLab({ l, a, b }: LabColor): string {
  return `lab(${round(l, 2)} ${round(a, 2)} ${round(b, 2)})`;
}

export function formatOklch({ l, c, h }: OklchColor): string {
  return `oklch(${round(l, 4)} ${round(c, 4)} ${round(h, 2)})`;
}

/** 色相角を 0以上360未満にする（範囲内の値は誤差を出さずそのまま返す） */
function normalizeHue(h: number): number {
  const mod = h % 360;
  return mod < 0 ? mod + 360 : mod;
}
