export const MIN_A4 = 410;
export const MAX_A4 = 480;
export const DEFAULT_A4 = 440;
/** 検出する周波数の範囲（ベースの低音〜ギターの高音の倍音域まで） */
export const MIN_FREQUENCY = 30;
export const MAX_FREQUENCY = 1400;
/** この音量（RMS, 0〜1）に満たない入力は無音として扱う */
export const SILENCE_RMS = 0.005;
/** 検出の確からしさ（0〜1）がこの値に満たなければ、音程なしとして扱う */
export const MIN_CLARITY = 0.85;
/** 「合っている」とみなすセントの範囲 */
export const IN_TUNE_CENTS = 5;

const NOTE_NAMES = [
  'C',
  'C#',
  'D',
  'D#',
  'E',
  'F',
  'F#',
  'G',
  'G#',
  'A',
  'A#',
  'B',
] as const;

export interface PitchResult {
  frequency: number;
  /** 0〜1。1に近いほど周期的で、はっきりした音程 */
  clarity: number;
}

export interface NoteInfo {
  /** MIDIノート番号（A4 = 69） */
  midi: number;
  /** "A", "C#" など */
  name: string;
  octave: number;
  /** 最も近い音からのずれ（セント）。-50〜+50 */
  cents: number;
}

export interface Tuning {
  id: string;
  /** 低い弦から順の MIDI ノート番号 */
  strings: readonly number[];
}

/** 楽器プリセット。弦は低い方から。 */
export const TUNINGS: readonly Tuning[] = [
  { id: 'guitar', strings: [40, 45, 50, 55, 59, 64] },
  { id: 'guitar-drop-d', strings: [38, 45, 50, 55, 59, 64] },
  { id: 'guitar-half-down', strings: [39, 44, 49, 54, 58, 63] },
  { id: 'bass', strings: [28, 33, 38, 43] },
  { id: 'bass-5', strings: [23, 28, 33, 38, 43] },
  { id: 'ukulele', strings: [67, 60, 64, 69] },
];

export function clampA4(value: number): number {
  if (!Number.isFinite(value)) return DEFAULT_A4;
  return Math.min(MAX_A4, Math.max(MIN_A4, Math.round(value)));
}

/** MIDIノート番号から周波数（Hz）を求める。 */
export function midiToFrequency(midi: number, a4 = DEFAULT_A4): number {
  return a4 * 2 ** ((midi - 69) / 12);
}

/** 音名とオクターブの表記（例: "E2"）。 */
export function noteLabel(midi: number): string {
  const note = noteFromMidi(midi);
  return `${note.name}${note.octave}`;
}

function noteFromMidi(midi: number): { name: string; octave: number } {
  const index = ((midi % 12) + 12) % 12;
  return { name: NOTE_NAMES[index], octave: Math.floor(midi / 12) - 1 };
}

/** 周波数から、最も近い音名とそこからのずれ（セント）を求める。 */
export function frequencyToNote(frequency: number, a4 = DEFAULT_A4): NoteInfo {
  const exact = 69 + 12 * Math.log2(frequency / a4);
  const midi = Math.round(exact);
  const { name, octave } = noteFromMidi(midi);
  return { midi, name, octave, cents: (exact - midi) * 100 };
}

/** 基準の周波数に対するずれ（セント）。 */
export function centsBetween(frequency: number, target: number): number {
  return 1200 * Math.log2(frequency / target);
}

/** プリセットの弦のうち、周波数に最も近いもの（セント差が最小）の位置を返す。 */
export function nearestStringIndex(
  frequency: number,
  strings: readonly number[],
  a4 = DEFAULT_A4,
): number {
  let best = 0;
  let bestDiff = Infinity;
  strings.forEach((midi, i) => {
    const diff = Math.abs(centsBetween(frequency, midiToFrequency(midi, a4)));
    if (diff < bestDiff) {
      bestDiff = diff;
      best = i;
    }
  });
  return best;
}

export type TuneState = 'in-tune' | 'low' | 'high';

export function tuneState(cents: number): TuneState {
  if (Math.abs(cents) <= IN_TUNE_CENTS) return 'in-tune';
  return cents < 0 ? 'low' : 'high';
}

/** 音量（RMS, 0〜1）。 */
export function rms(samples: Float32Array): number {
  if (samples.length === 0) return 0;
  let sum = 0;
  for (const s of samples) sum += s * s;
  return Math.sqrt(sum / samples.length);
}

/**
 * 波形からピッチ（基本周波数）を検出する。
 * 正規化した自己相関（McLeod法のNSDF）の山のうち、最初に十分大きいものを周期とする。
 * 倍音の方が強いギター弦でも、1オクターブ高く誤検出しにくい。
 * 無音・雑音など音程がはっきりしないときは null。
 */
export function detectPitch(
  samples: Float32Array,
  sampleRate: number,
  minFrequency = MIN_FREQUENCY,
  maxFrequency = MAX_FREQUENCY,
): PitchResult | null {
  const n = samples.length;
  if (n < 64 || !(sampleRate > 0)) return null;
  if (rms(samples) < SILENCE_RMS) return null;

  const minLag = Math.max(2, Math.floor(sampleRate / maxFrequency));
  const maxLag = Math.min(n >> 1, Math.ceil(sampleRate / minFrequency));
  if (maxLag <= minLag + 2) return null;

  // nsdf[tau] = 2 * r(tau) / m(tau)
  const nsdf = new Float32Array(maxLag + 1);
  for (let tau = 0; tau <= maxLag; tau++) {
    let acf = 0;
    let energy = 0;
    for (let i = 0; i < n - tau; i++) {
      const a = samples[i];
      const b = samples[i + tau];
      acf += a * b;
      energy += a * a + b * b;
    }
    nsdf[tau] = energy > 0 ? (2 * acf) / energy : 0;
  }

  // 正の区間ごとの最大値（キー・マキシマ）を集める
  const keys: number[] = [];
  let tau = 1;
  while (tau < maxLag && nsdf[tau] > 0) tau++; // 最初の山（tau=0付近）を飛ばす
  while (tau < maxLag) {
    while (tau < maxLag && nsdf[tau] <= 0) tau++;
    let best = -1;
    while (tau < maxLag && nsdf[tau] > 0) {
      if (tau >= minLag && (best < 0 || nsdf[tau] > nsdf[best])) best = tau;
      tau++;
    }
    if (best >= 0) keys.push(best);
  }
  if (keys.length === 0) return null;

  const highest = Math.max(...keys.map((k) => nsdf[k]));
  const chosen = keys.find((k) => nsdf[k] >= 0.9 * highest)!;
  if (nsdf[chosen] < MIN_CLARITY) return null;

  // 放物線補間でサンプル間の位置を求める
  let period = chosen;
  if (chosen > 0 && chosen < maxLag) {
    const a = nsdf[chosen - 1];
    const b = nsdf[chosen];
    const c = nsdf[chosen + 1];
    const denom = a - 2 * b + c;
    if (denom !== 0) period = chosen + (0.5 * (a - c)) / denom;
  }
  return { frequency: sampleRate / period, clarity: nsdf[chosen] };
}
