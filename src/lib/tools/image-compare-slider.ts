export type CompareOrientation = 'horizontal' | 'vertical';
export type CompareOutputKind = 'slider' | 'side-by-side';

export interface Rect {
  x: number;
  y: number;
  width: number;
  height: number;
}

export const MAX_FILE_SIZE = 25 * 1024 * 1024;
export const MAX_PIXELS = 40_000_000;
/** 画面表示用キャンバスの長辺上限 */
export const PREVIEW_MAX_EDGE = 1200;
/** 保存画像の1枚あたりの長辺上限 */
export const OUTPUT_MAX_EDGE = 4096;
/** 出力 Canvas の面積上限（Safari の約16.7Mピクセルに合わせる） */
export const OUTPUT_MAX_PIXELS = 16_000_000;
export const SIDE_BY_SIDE_GAP = 8;

const ACCEPTED_MIME_TYPES = new Set([
  'image/png',
  'image/jpeg',
  'image/webp',
  'image/gif',
  'image/bmp',
]);

export function isAcceptedImageFile(file: { type: string }): boolean {
  return ACCEPTED_MIME_TYPES.has(file.type);
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

/** 0〜100 に丸める。数値でなければ 50 */
export function clampPercent(value: number): number {
  if (!Number.isFinite(value)) return 50;
  return Math.min(100, Math.max(0, value));
}

/** 比較の境界位置（%）から、ビフォー／アフターの描画範囲と境界線を求める */
export function splitRegions(
  percent: number,
  width: number,
  height: number,
  orientation: CompareOrientation,
): {
  before: Rect;
  after: Rect;
  line: { x1: number; y1: number; x2: number; y2: number };
} {
  const p = clampPercent(percent) / 100;
  if (orientation === 'horizontal') {
    const x = width * p;
    return {
      before: { x: 0, y: 0, width: x, height },
      after: { x, y: 0, width: width - x, height },
      line: { x1: x, y1: 0, x2: x, y2: height },
    };
  }
  const y = height * p;
  return {
    before: { x: 0, y: 0, width, height: y },
    after: { x: 0, y, width, height: height - y },
    line: { x1: 0, y1: y, x2: width, y2: y },
  };
}

/** ポインター位置から境界位置（%）を求める */
export function percentFromPointer(
  clientX: number,
  clientY: number,
  box: { left: number; top: number; width: number; height: number },
  orientation: CompareOrientation,
): number {
  if (orientation === 'horizontal') {
    if (box.width <= 0) return 50;
    return clampPercent(((clientX - box.left) / box.width) * 100);
  }
  if (box.height <= 0) return 50;
  return clampPercent(((clientY - box.top) / box.height) * 100);
}

/** src を dst の中にアスペクト比を保って収める（中央寄せ） */
export function containRect(
  srcWidth: number,
  srcHeight: number,
  dstWidth: number,
  dstHeight: number,
): Rect {
  if (srcWidth <= 0 || srcHeight <= 0) {
    return { x: 0, y: 0, width: dstWidth, height: dstHeight };
  }
  const scale = Math.min(dstWidth / srcWidth, dstHeight / srcHeight);
  const width = srcWidth * scale;
  const height = srcHeight * scale;
  return {
    x: (dstWidth - width) / 2,
    y: (dstHeight - height) / 2,
    width,
    height,
  };
}

/** 長辺が max を超えないように縮小したサイズ（拡大はしない） */
export function fitMaxEdge(
  width: number,
  height: number,
  maxEdge: number,
): { width: number; height: number; scale: number } {
  const longest = Math.max(width, height);
  const scale = longest > maxEdge ? maxEdge / longest : 1;
  return {
    width: Math.max(1, Math.round(width * scale)),
    height: Math.max(1, Math.round(height * scale)),
    scale,
  };
}

/** 並置画像のレイアウト（1枚あたり width×height、間隔 gap） */
export function sideBySideLayout(
  width: number,
  height: number,
  orientation: CompareOrientation,
  gap: number,
): { width: number; height: number; before: Rect; after: Rect } {
  if (orientation === 'horizontal') {
    return {
      width: width * 2 + gap,
      height,
      before: { x: 0, y: 0, width, height },
      after: { x: width + gap, y: 0, width, height },
    };
  }
  return {
    width,
    height: height * 2 + gap,
    before: { x: 0, y: 0, width, height },
    after: { x: 0, y: height + gap, width, height },
  };
}

/** 保存ファイル名。元名（ビフォー側）の拡張子を外して接尾辞と .png を付ける */
export function buildOutputFileName(
  originalName: string,
  kind: CompareOutputKind,
): string {
  const lastDot = originalName.lastIndexOf('.');
  const base = lastDot > 0 ? originalName.slice(0, lastDot) : originalName;
  const suffix = kind === 'slider' ? 'compare' : 'side-by-side';
  return `${base || 'image'}-${suffix}.png`;
}
