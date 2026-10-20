export type AvatarMode = 'initials' | 'identicon';
export type AvatarShape = 'square' | 'rounded' | 'circle';
export type AvatarFont = 'sans' | 'serif' | 'mono' | 'rounded';

export const AVATAR_SIZES = [128, 256, 512, 1024] as const;
export const DEFAULT_SIZE = 512;
export const IDENTICON_GRID = 5;

export const FONT_STACKS: Record<AvatarFont, string> = {
  sans: '"Helvetica Neue", Arial, "Hiragino Kaku Gothic ProN", "Yu Gothic", Meiryo, sans-serif',
  serif:
    'Georgia, "Times New Roman", "Hiragino Mincho ProN", "Yu Mincho", serif',
  mono: 'Consolas, Menlo, "Courier New", monospace',
  rounded:
    'ui-rounded, "Hiragino Maru Gothic ProN", "M PLUS Rounded 1c", "Arial Rounded MT Bold", sans-serif',
};

/** 文字列を書記素単位（絵文字・結合文字を1文字として）に分割する */
export function graphemes(text: string): string[] {
  if (typeof Intl !== 'undefined' && 'Segmenter' in Intl) {
    const seg = new Intl.Segmenter(undefined, { granularity: 'grapheme' });
    return Array.from(seg.segment(text), (s) => s.segment);
  }
  return Array.from(text);
}

/**
 * 名前からイニシャルを作る。
 * 複数の語がある場合は先頭の語と末尾の語の頭文字、1語だけなら先頭から count 文字。
 */
export function makeInitials(name: string, count: 1 | 2): string {
  const words = name.split(/[\s\u3000]+/).filter((w) => w !== '');
  if (words.length === 0) return '';
  let result: string[];
  if (words.length === 1) {
    result = graphemes(words[0]).slice(0, count);
  } else if (count === 1) {
    result = [graphemes(words[0])[0]];
  } else {
    result = [graphemes(words[0])[0], graphemes(words[words.length - 1])[0]];
  }
  return result.join('').toUpperCase();
}

/** FNV-1a 32bit。同じ文字列からは常に同じ値になる */
export function hashString(text: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < text.length; i++) {
    h ^= text.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return h >>> 0;
}

/** シード付きの疑似乱数（mulberry32）。0以上1未満を返す関数を作る */
export function seededRandom(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function toHex(n: number): string {
  return Math.round(Math.min(255, Math.max(0, n)))
    .toString(16)
    .padStart(2, '0');
}

/** h: 0-360, s/l: 0-100 */
export function hslToHex(h: number, s: number, l: number): string {
  const sat = s / 100;
  const lig = l / 100;
  const k = (n: number) => (n + h / 30) % 12;
  const a = sat * Math.min(lig, 1 - lig);
  const f = (n: number) =>
    lig - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
  return `#${toHex(f(0) * 255)}${toHex(f(8) * 255)}${toHex(f(4) * 255)}`;
}

export function isHexColor(value: string): boolean {
  return /^#[0-9a-fA-F]{6}$/.test(value);
}

export function hexToRgb(hex: string): [number, number, number] {
  if (!isHexColor(hex)) return [0, 0, 0];
  return [
    parseInt(hex.slice(1, 3), 16),
    parseInt(hex.slice(3, 5), 16),
    parseInt(hex.slice(5, 7), 16),
  ];
}

function luminance(hex: string): number {
  const [r, g, b] = hexToRgb(hex).map((v) => {
    const c = v / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

export function contrastRatio(a: string, b: string): number {
  const la = luminance(a);
  const lb = luminance(b);
  return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05);
}

/** 背景色の上で読みやすい文字色（白か黒）を選ぶ */
export function contrastColor(background: string): '#ffffff' | '#111827' {
  return contrastRatio(background, '#ffffff') >=
    contrastRatio(background, '#111827')
    ? '#ffffff'
    : '#111827';
}

export interface AvatarColors {
  background: string;
  foreground: string;
}

/** 文字列から決まる配色。同じ文字列なら同じ色になる */
export function autoColors(seed: string, mode: AvatarMode): AvatarColors {
  const hue = hashString(seed) % 360;
  if (mode === 'identicon') {
    return {
      background: hslToHex(hue, 40, 92),
      foreground: hslToHex(hue, 60, 42),
    };
  }
  const background = hslToHex(hue, 55, 42);
  return { background, foreground: contrastColor(background) };
}

/**
 * GitHub風のidenticon。5×5の左右対称パターン。
 * 左3列（中央列を含む）を乱数で決め、右2列に反転コピーする。
 */
export function identiconGrid(seed: string): boolean[][] {
  const rand = seededRandom(hashString(seed));
  const half = Math.ceil(IDENTICON_GRID / 2);
  const grid: boolean[][] = [];
  for (let r = 0; r < IDENTICON_GRID; r++) {
    const row: boolean[] = new Array(IDENTICON_GRID).fill(false);
    for (let c = 0; c < half; c++) {
      const on = rand() < 0.5;
      row[c] = on;
      row[IDENTICON_GRID - 1 - c] = on;
    }
    grid.push(row);
  }
  // 真っ白になった場合は中央を塗る
  if (!grid.some((row) => row.some(Boolean))) {
    grid[2][2] = true;
  }
  return grid;
}

export type ShapeGeometry =
  { kind: 'rect'; radius: number } | { kind: 'ellipse' };

export function shapeGeometry(shape: AvatarShape, size: number): ShapeGeometry {
  if (shape === 'circle') return { kind: 'ellipse' };
  if (shape === 'rounded') return { kind: 'rect', radius: size * 0.2 };
  return { kind: 'rect', radius: 0 };
}

/** 文字数に応じた文字の大きさの目安（px） */
export function initialsFontSize(length: number, size: number): number {
  if (length <= 1) return size * 0.5;
  if (length === 2) return size * 0.42;
  return size * 0.3;
}

export function clampSize(value: number): number {
  if (!Number.isFinite(value)) return DEFAULT_SIZE;
  return Math.min(2048, Math.max(16, Math.round(value)));
}

export function avatarFileName(
  mode: AvatarMode,
  text: string,
  size: number,
): string {
  const slug = text
    .trim()
    .replace(/[\\/:*?"<>|\s]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 30);
  return `${mode}-${slug || 'avatar'}-${size}.png`;
}
