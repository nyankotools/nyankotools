export const MIN_SIZE = 1;
export const MAX_SIZE = 4096;

export type PlaceholderFormat = 'png' | 'jpeg' | 'webp';

export const FORMAT_INFO: Record<
  PlaceholderFormat,
  { mime: string; extension: string }
> = {
  png: { mime: 'image/png', extension: 'png' },
  jpeg: { mime: 'image/jpeg', extension: 'jpg' },
  webp: { mime: 'image/webp', extension: 'webp' },
};

/** 寸法として有効な整数（1〜MAX_SIZE）かどうか */
export function isValidSize(value: number): boolean {
  return Number.isInteger(value) && value >= MIN_SIZE && value <= MAX_SIZE;
}

/** `#rgb` / `#rrggbb` を `#rrggbb`（小文字）に正規化する。不正なら null */
export function normalizeHexColor(input: string): string | null {
  const m = /^#?([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(input.trim());
  if (!m) return null;
  let hex = m[1].toLowerCase();
  if (hex.length === 3) {
    hex = [...hex].map((c) => c + c).join('');
  }
  return `#${hex}`;
}

/** 背景色に対して読みやすい文字色（黒 or 白）を返す。引数は正規化済みHEX */
export function contrastTextColor(bgHex: string): string {
  const r = parseInt(bgHex.slice(1, 3), 16);
  const g = parseInt(bgHex.slice(3, 5), 16);
  const b = parseInt(bgHex.slice(5, 7), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.6 ? '#000000' : '#ffffff';
}

/** 文字が空のときに表示する既定の文字（例: 600×400） */
export function defaultLabel(width: number, height: number): string {
  return `${width}×${height}`;
}

/** 画像に収まるフォントサイズ(px)を返す。textWidthPerPx は「1pxあたりの文字列幅」 */
export function fitFontSize(
  width: number,
  height: number,
  textWidthPerPx: number,
): number {
  const byHeight = height * 0.5;
  const byWidth =
    textWidthPerPx > 0 ? (width * 0.9) / textWidthPerPx : byHeight;
  return Math.max(1, Math.floor(Math.min(byHeight, byWidth)));
}

/** ダウンロード用のファイル名 */
export function buildFilename(
  width: number,
  height: number,
  format: PlaceholderFormat,
): string {
  return `placeholder-${width}x${height}.${FORMAT_INFO[format].extension}`;
}
