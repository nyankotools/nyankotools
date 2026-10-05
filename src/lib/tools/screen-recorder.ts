/** 録画の上限（秒）。メモリに溜め続けないよう、超えたら自動停止する。 */
export const MAX_RECORD_SECONDS = 1800;

export type ScreenCaptureErrorKind =
  'cancelled' | 'unsupported' | 'insecure' | 'unknown';

/** getDisplayMedia の例外を、UI側で文言を引き当てるための種別に分類する。 */
export function classifyDisplayError(
  name: string | undefined,
): ScreenCaptureErrorKind {
  switch (name) {
    case 'NotAllowedError':
    case 'PermissionDeniedError':
    case 'AbortError':
      return 'cancelled';
    case 'NotSupportedError':
      return 'unsupported';
    case 'SecurityError':
    case 'TypeError':
      return 'insecure';
    default:
      return 'unknown';
  }
}

const MIME_CANDIDATES = [
  'video/webm;codecs=vp9,opus',
  'video/webm;codecs=vp8,opus',
  'video/webm',
  'video/mp4',
];

/** MediaRecorder で使える録画形式を優先順に選ぶ。どれも使えなければ null（ブラウザ既定に任せる）。 */
export function pickVideoMimeType(
  isTypeSupported: (mime: string) => boolean,
): string | null {
  return MIME_CANDIDATES.find((m) => isTypeSupported(m)) ?? null;
}

/** MIMEタイプから保存時の拡張子を決める。 */
export function videoExtensionForMime(mime: string): string {
  const base = mime.split(';')[0].trim().toLowerCase();
  return base === 'video/mp4' ? 'mp4' : 'webm';
}

/** 保存ファイル名（screen-recording-20261005-123456.webm）。 */
export function recordingFileName(date: Date, extension: string): string {
  const p = (n: number) => String(n).padStart(2, '0');
  const stamp = `${date.getFullYear()}${p(date.getMonth() + 1)}${p(date.getDate())}-${p(date.getHours())}${p(date.getMinutes())}${p(date.getSeconds())}`;
  return `screen-recording-${stamp}.${extension}`;
}
