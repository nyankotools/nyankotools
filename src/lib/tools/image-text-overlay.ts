import type { OutputFormat, Point, Size } from './image-cropper';

export type TextPosition =
  | 'top-left'
  | 'top-center'
  | 'top-right'
  | 'middle-left'
  | 'center'
  | 'middle-right'
  | 'bottom-left'
  | 'bottom-center'
  | 'bottom-right'
  | 'tile';

export type FontFamilyKey = 'sans' | 'serif' | 'mono';

export const FONT_STACKS: Record<FontFamilyKey, string> = {
  sans: '"Hiragino Sans", "Yu Gothic", "Meiryo", "Noto Sans JP", system-ui, sans-serif',
  serif:
    '"Hiragino Mincho ProN", "Yu Mincho", "Noto Serif JP", "Times New Roman", serif',
  mono: '"SFMono-Regular", Consolas, "Courier New", monospace',
};

/** 敷き詰めるときの文字の最大個数。大きな画像に小さな文字を敷き詰めたときの描画負荷を抑える */
export const MAX_TILES = 1500;
export const MAX_FONT_SIZE = 2000;
export const MAX_STROKE = 100;

export function clampNumber(
  value: number,
  min: number,
  max: number,
  fallback = min,
): number {
  if (!Number.isFinite(value)) return fallback;
  return Math.min(Math.max(value, min), max);
}

/** 入力欄の改行区切りの文字列を行に分ける。末尾の空行は捨て、全部空なら空配列 */
export function textLines(text: string): string[] {
  const lines = text.replace(/\r\n?/g, '\n').split('\n');
  while (lines.length > 0 && lines[lines.length - 1].trim() === '') {
    lines.pop();
  }
  return lines.some((l) => l.trim() !== '') ? lines : [];
}

export function buildFont(
  size: number,
  bold: boolean,
  family: FontFamilyKey,
): string {
  const px = Math.round(clampNumber(size, 1, MAX_FONT_SIZE, 16));
  return `${bold ? 'bold ' : ''}${px}px ${FONT_STACKS[family]}`;
}

/** 9方向のどれかに置く文字ブロック（box）の左上座標 */
export function anchorPosition(
  position: Exclude<TextPosition, 'tile'>,
  image: Size,
  box: Size,
  margin: number,
): Point {
  const m = Math.max(0, margin);
  const [v, h] =
    position === 'center' ? ['middle', 'center'] : position.split('-');
  const x =
    h === 'left'
      ? m
      : h === 'right'
        ? image.width - box.width - m
        : (image.width - box.width) / 2;
  const y =
    v === 'top'
      ? m
      : v === 'bottom'
        ? image.height - box.height - m
        : (image.height - box.height) / 2;
  return { x: Math.round(x), y: Math.round(y) };
}

/**
 * 透かしを敷き詰めるときの文字ブロックの中心座標（画像の中心が原点）。
 * 画像を回転して描く前提で、回転しても隅まで届くよう画像の対角線の半分を半径に覆う。
 * 1行おきに半マスずらす。個数が MAX_TILES を超えるときは間隔を広げて抑える。
 */
export function tileCenters(
  image: Size,
  box: Size,
  gap: number,
): { points: Point[]; stepX: number; stepY: number } {
  const radius = Math.hypot(image.width, image.height) / 2;
  let stepX = Math.max(1, box.width + Math.max(0, gap));
  let stepY = Math.max(1, box.height + Math.max(0, gap));
  // 下のループが実際に作る個数の上限（列・行とも余白ぶんの +3 を見込む）
  const count = (sx: number, sy: number) =>
    (Math.ceil((radius * 2) / sx) + 3) * (Math.ceil((radius * 2) / sy) + 3);
  while (count(stepX, stepY) > MAX_TILES) {
    stepX *= 1.05;
    stepY *= 1.05;
  }
  const points: Point[] = [];
  let row = 0;
  for (let y = -radius; y <= radius + stepY; y += stepY, row++) {
    const shift = row % 2 === 1 ? stepX / 2 : 0;
    for (let x = -radius - shift; x <= radius + stepX; x += stepX) {
      points.push({ x, y });
    }
  }
  return { points, stepX, stepY };
}

export function overlayFileName(
  sourceName: string | null,
  format: OutputFormat,
): string {
  const base = (sourceName ?? '').replace(/\.[^./\\]*$/, '').trim();
  return `${base || 'image'}-text.${format === 'jpeg' ? 'jpg' : format}`;
}
