export const MIN_FREQUENCY = 20;
export const MAX_FREQUENCY = 20000;
/** 周波数スイープ全体の長さ（秒） */
export const SWEEP_SECONDS = 20;

export type Channel = 'left' | 'right' | 'both';
export type WaveType = 'sine' | 'square' | 'triangle' | 'sawtooth';

/** チャンネルを StereoPannerNode.pan の値にする。 */
export function channelPan(channel: Channel): number {
  return channel === 'left' ? -1 : channel === 'right' ? 1 : 0;
}

/** 周波数を可聴範囲（20〜20000 Hz）に収める。数値でなければ 440。 */
export function clampFrequency(value: number): number {
  if (!Number.isFinite(value)) return 440;
  return Math.min(MAX_FREQUENCY, Math.max(MIN_FREQUENCY, value));
}

/** 音量スライダー（0〜100）を、聴感に近い二乗カーブのゲイン（0〜1）にする。 */
export function volumeToGain(percent: number): number {
  const p = Math.min(100, Math.max(0, percent)) / 100;
  return p * p;
}

/** スイープの進行度（0〜1）を周波数にする。対数スケールなので各オクターブに同じ時間をかける。 */
export function sweepFrequency(
  progress: number,
  from = MIN_FREQUENCY,
  to = MAX_FREQUENCY,
): number {
  const p = Math.min(1, Math.max(0, progress));
  return from * Math.pow(to / from, p);
}

/** スライダー位置（0〜1000）を周波数（対数）にする。 */
export function sliderToFrequency(position: number): number {
  return clampFrequency(sweepFrequency(position / 1000));
}

/** 周波数をスライダー位置（0〜1000）にする。 */
export function frequencyToSlider(frequency: number): number {
  const f = clampFrequency(frequency);
  return Math.round(
    (Math.log(f / MIN_FREQUENCY) / Math.log(MAX_FREQUENCY / MIN_FREQUENCY)) *
      1000,
  );
}

const NOTE_NAMES = [
  'C',
  'C♯',
  'D',
  'D♯',
  'E',
  'F',
  'F♯',
  'G',
  'G♯',
  'A',
  'A♯',
  'B',
];

/** 最も近い音名（A4=440Hz）。例: 440 → "A4"。 */
export function nearestNote(frequency: number): string {
  const midi = Math.round(69 + 12 * Math.log2(clampFrequency(frequency) / 440));
  const name = NOTE_NAMES[((midi % 12) + 12) % 12];
  return `${name}${Math.floor(midi / 12) - 1}`;
}

/** 周波数の表示（1000 Hz 以上は kHz）。 */
export function formatFrequency(frequency: number): string {
  const f = clampFrequency(frequency);
  return f >= 1000
    ? `${(f / 1000).toFixed(2).replace(/\.?0+$/, '')} kHz`
    : `${Math.round(f)} Hz`;
}
