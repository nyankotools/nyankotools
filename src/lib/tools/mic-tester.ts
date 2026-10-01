/** 録音の上限（秒）。メモリに溜め続けないよう、超えたら自動停止する。 */
export const MAX_RECORD_SECONDS = 300;

/** クリッピング（音割れ）とみなす波形のピーク振幅（0〜1）。 */
export const CLIPPING_THRESHOLD = 0.99;

/** 波形のピーク振幅（0〜1）。AnalyserNode.getByteTimeDomainData の値（無音=128）を想定。 */
export function calculatePeakAmplitude(samples: ArrayLike<number>): number {
  let peak = 0;
  for (let i = 0; i < samples.length; i++) {
    peak = Math.max(peak, Math.abs(samples[i] - 128) / 128);
  }
  return Math.min(1, peak);
}

/** RMS（実効値）をdBFSで返す。無音は下限の -100 に丸める。 */
export function calculateRmsDb(samples: ArrayLike<number>): number {
  if (samples.length === 0) return -100;
  let sum = 0;
  for (let i = 0; i < samples.length; i++) {
    const v = (samples[i] - 128) / 128;
    sum += v * v;
  }
  const rms = Math.sqrt(sum / samples.length);
  if (rms <= 0) return -100;
  return Math.max(-100, 20 * Math.log10(rms));
}

export function isClipping(peak: number): boolean {
  return peak >= CLIPPING_THRESHOLD;
}

/** ピークホールド。現在値が上回ればそれに更新し、そうでなければ decay ずつ下げる（下限は現在値）。 */
export function updatePeakHold(
  held: number,
  current: number,
  decay: number,
): number {
  if (current >= held) return current;
  return Math.max(current, held - decay);
}

/** 秒数を m:ss 形式にする。 */
export function formatDuration(seconds: number): string {
  const total = Math.max(0, Math.floor(seconds));
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${m}:${String(s).padStart(2, '0')}`;
}

const MIME_CANDIDATES = [
  'audio/webm;codecs=opus',
  'audio/webm',
  'audio/mp4',
  'audio/ogg;codecs=opus',
];

/** MediaRecorder で使える録音形式を優先順に選ぶ。どれも使えなければ null（ブラウザ既定に任せる）。 */
export function pickRecorderMimeType(
  isTypeSupported: (mime: string) => boolean,
): string | null {
  return MIME_CANDIDATES.find((m) => isTypeSupported(m)) ?? null;
}

/** MIMEタイプから保存時の拡張子を決める。 */
export function extensionForMime(mime: string): string {
  const base = mime.split(';')[0].trim().toLowerCase();
  switch (base) {
    case 'audio/mp4':
    case 'audio/x-m4a':
      return 'm4a';
    case 'audio/ogg':
      return 'ogg';
    case 'audio/wav':
    case 'audio/x-wav':
      return 'wav';
    default:
      return 'webm';
  }
}
