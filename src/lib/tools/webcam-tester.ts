export type MediaErrorKind =
  | 'permission-denied'
  | 'not-found'
  | 'in-use'
  | 'constraints'
  | 'insecure'
  | 'unsupported'
  | 'unknown';

/** getUserMedia の例外を、UI側で文言を引き当てるための種別に分類する。 */
export function classifyMediaError(name: string | undefined): MediaErrorKind {
  switch (name) {
    case 'NotAllowedError':
    case 'PermissionDeniedError':
    case 'SecurityError':
      return 'permission-denied';
    case 'NotFoundError':
    case 'DevicesNotFoundError':
      return 'not-found';
    case 'NotReadableError':
    case 'TrackStartError':
    case 'AbortError':
      return 'in-use';
    case 'OverconstrainedError':
    case 'ConstraintNotSatisfiedError':
      return 'constraints';
    case 'TypeError':
      return 'insecure';
    default:
      return 'unknown';
  }
}

const RESOLUTION_LABELS: { width: number; height: number; label: string }[] = [
  { width: 320, height: 240, label: 'QVGA' },
  { width: 640, height: 360, label: 'nHD' },
  { width: 640, height: 480, label: 'VGA' },
  { width: 1280, height: 720, label: 'HD (720p)' },
  { width: 1920, height: 1080, label: 'Full HD (1080p)' },
  { width: 2560, height: 1440, label: 'QHD (1440p)' },
  { width: 3840, height: 2160, label: '4K UHD' },
];

/** 幅×高さが一般的な規格名に一致すれば名前を返す（縦横どちらの向きでも判定）。 */
export function getResolutionLabel(
  width: number,
  height: number,
): string | null {
  const w = Math.max(width, height);
  const h = Math.min(width, height);
  const hit = RESOLUTION_LABELS.find((r) => r.width === w && r.height === h);
  return hit ? hit.label : null;
}

export function formatResolution(width: number, height: number): string {
  const label = getResolutionLabel(width, height);
  const base = `${width} × ${height}`;
  return label ? `${base} (${label})` : base;
}

/** フレーム到着時刻（ミリ秒）の列から平均FPSを求める。2点未満・経過0なら null。 */
export function calculateFps(timestamps: number[]): number | null {
  if (timestamps.length < 2) return null;
  const elapsed = timestamps[timestamps.length - 1] - timestamps[0];
  if (elapsed <= 0) return null;
  return ((timestamps.length - 1) * 1000) / elapsed;
}

/** 直近 windowMs ミリ秒より古いタイムスタンプを取り除く（元の配列は変更しない）。 */
export function trimTimestamps(
  timestamps: number[],
  now: number,
  windowMs: number,
): number[] {
  return timestamps.filter((t) => now - t <= windowMs);
}

/**
 * AnalyserNode.getByteTimeDomainData の値（0〜255、無音=128）から
 * 音量レベル（0〜100）を求める。RMSを平方根で持ち上げて小さな音も見えるようにする。
 */
export function calculateAudioLevel(samples: ArrayLike<number>): number {
  if (samples.length === 0) return 0;
  let sum = 0;
  for (let i = 0; i < samples.length; i++) {
    const v = (samples[i] - 128) / 128;
    sum += v * v;
  }
  const rms = Math.sqrt(sum / samples.length);
  return Math.min(100, Math.round(Math.sqrt(rms) * 100));
}
