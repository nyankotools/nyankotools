import {
  classifyDisplayError,
  type ScreenCaptureErrorKind,
} from './screen-recorder';

export { classifyDisplayError };
export type { ScreenCaptureErrorKind };

/** 撮影までの待ち時間の選択肢（秒）。 */
export const DELAY_OPTIONS = [0, 3, 5, 10] as const;

/** 遅延秒数を選択肢のいずれかに丸める。不正な値は 0。 */
export function normalizeDelay(value: number): number {
  return (DELAY_OPTIONS as readonly number[]).includes(value) ? value : 0;
}

/** 保存ファイル名（screenshot-20261025-123456.png）。 */
export function captureFileName(date: Date): string {
  const p = (n: number) => String(n).padStart(2, '0');
  const stamp = `${date.getFullYear()}${p(date.getMonth() + 1)}${p(date.getDate())}-${p(date.getHours())}${p(date.getMinutes())}${p(date.getSeconds())}`;
  return `screenshot-${stamp}.png`;
}

/** 幅×高さの表示文字列。 */
export function formatDimensions(width: number, height: number): string {
  return `${Math.round(width)} × ${Math.round(height)} px`;
}
