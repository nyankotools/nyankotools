import type { OutputFormat, Size } from './image-cropper';

export {
  anchorPosition,
  clampNumber,
  MAX_TILES,
  tileCenters,
  type TextPosition as LogoPosition,
} from './image-text-overlay';

/** ロゴの大きさ（ベース画像の幅に対する割合 %）の範囲 */
export const MIN_SCALE = 1;
export const MAX_SCALE = 200;

/**
 * ロゴの描画サイズ。幅をベース画像の幅の percent% にし、高さはロゴの縦横比を保つ。
 * 結果は最低 1px。ロゴの寸法が不正（0以下・非数）なら 1×1。
 */
export function logoSize(base: Size, logo: Size, percent: number): Size {
  if (
    !Number.isFinite(logo.width) ||
    !Number.isFinite(logo.height) ||
    logo.width <= 0 ||
    logo.height <= 0
  ) {
    return { width: 1, height: 1 };
  }
  const p = Number.isFinite(percent)
    ? Math.min(Math.max(percent, MIN_SCALE), MAX_SCALE)
    : 20;
  const width = Math.max(1, Math.round((base.width * p) / 100));
  const height = Math.max(1, Math.round((width * logo.height) / logo.width));
  return { width, height };
}

export function watermarkFileName(
  sourceName: string | null,
  format: OutputFormat,
): string {
  const base = (sourceName ?? '').replace(/\.[^./\\]*$/, '').trim();
  return `${base || 'image'}-logo.${format === 'jpeg' ? 'jpg' : format}`;
}
