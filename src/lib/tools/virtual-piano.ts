import { midiToFrequency, noteLabel } from './instrument-tuner';

export { midiToFrequency, noteLabel };

export const A4_FREQUENCY = 440;
export const MIN_OCTAVE = 1;
export const MAX_OCTAVE = 6;
export const DEFAULT_OCTAVE = 3;
/** 表示する鍵盤の数（3オクターブ + 最後のC = 37鍵） */
export const KEY_COUNT = 37;
export const DEFAULT_VOLUME = 60;

export interface KeyMapEntry {
  /** KeyboardEvent.code（キー配列に依存しない） */
  code: string;
  /** 鍵盤の左端（C）からの半音数 */
  semitone: number;
  /** 鍵盤に表示するキー名 */
  label: string;
}

function row(codes: readonly string[], start: number): KeyMapEntry[] {
  return codes.map((code, i) => ({
    code,
    semitone: start + i,
    label: code.replace(/^(Key|Digit)/, ''),
  }));
}

/** 下段（Z〜M）が基準のオクターブ、上段（Q〜P）が1オクターブ上。 */
export const KEY_MAP: readonly KeyMapEntry[] = [
  ...row(
    [
      'KeyZ',
      'KeyS',
      'KeyX',
      'KeyD',
      'KeyC',
      'KeyV',
      'KeyG',
      'KeyB',
      'KeyH',
      'KeyN',
      'KeyJ',
      'KeyM',
    ],
    0,
  ),
  ...row(
    [
      'KeyQ',
      'Digit2',
      'KeyW',
      'Digit3',
      'KeyE',
      'KeyR',
      'Digit5',
      'KeyT',
      'Digit6',
      'KeyY',
      'Digit7',
      'KeyU',
      'KeyI',
      'Digit9',
      'KeyO',
      'Digit0',
      'KeyP',
    ],
    12,
  ),
];

const SEMITONE_BY_CODE = new Map(KEY_MAP.map((e) => [e.code, e.semitone]));

/** キーコードに対応する半音数。割り当てがなければ null。 */
export function codeToSemitone(code: string): number | null {
  return SEMITONE_BY_CODE.get(code) ?? null;
}

/** 半音数に割り当てたキー名（なければ null）。 */
export function semitoneToKeyLabel(semitone: number): string | null {
  return KEY_MAP.find((e) => e.semitone === semitone)?.label ?? null;
}

export function clampOctave(value: number): number {
  if (!Number.isFinite(value)) return DEFAULT_OCTAVE;
  return Math.min(MAX_OCTAVE, Math.max(MIN_OCTAVE, Math.round(value)));
}

export function clampVolume(value: number): number {
  if (!Number.isFinite(value)) return DEFAULT_VOLUME;
  return Math.min(100, Math.max(0, Math.round(value)));
}

/** 鍵盤の左端（C）のMIDIノート番号。C4 = 60。 */
export function baseMidi(octave: number): number {
  return 12 * (clampOctave(octave) + 1);
}

export function isBlackKey(midi: number): boolean {
  return [1, 3, 6, 8, 10].includes(((midi % 12) + 12) % 12);
}

export interface PianoKey {
  midi: number;
  /** "C4", "C#4" など */
  name: string;
  black: boolean;
  /** 白鍵は左から数えた位置。黒鍵は直前（左隣）の白鍵の位置 */
  whiteIndex: number;
  /** 鍵盤の左端からの半音数 */
  semitone: number;
}

/** 左端のCから `count` 鍵ぶんの鍵盤を作る。 */
export function buildKeys(octave: number, count = KEY_COUNT): PianoKey[] {
  const start = baseMidi(octave);
  const keys: PianoKey[] = [];
  let whites = 0;
  for (let i = 0; i < count; i++) {
    const midi = start + i;
    const black = isBlackKey(midi);
    keys.push({
      midi,
      name: noteLabel(midi),
      black,
      whiteIndex: black ? whites - 1 : whites,
      semitone: i,
    });
    if (!black) whites++;
  }
  return keys;
}

export function countWhiteKeys(keys: readonly PianoKey[]): number {
  return keys.filter((k) => !k.black).length;
}

export interface Envelope {
  /** 秒 */
  attack: number;
  /** 秒（サステインの音量に落ち着くまでの目安） */
  decay: number;
  /** 0〜1（ピークに対する割合） */
  sustain: number;
  /** 秒 */
  release: number;
}

export type TimbreId = 'piano' | 'sine' | 'square' | 'sawtooth';

export interface Timbre {
  id: TimbreId;
  /** OscillatorNode.type。'custom' は partials から作る倍音合成 */
  wave: 'custom' | 'sine' | 'square' | 'sawtooth';
  /** 倍音の強さ（基音から順）。wave が 'custom' のときだけ使う */
  partials: readonly number[];
  envelope: Envelope;
  /** 音色ごとの音量補正（矩形波・のこぎり波は大きく聞こえるため下げる） */
  gain: number;
}

export const TIMBRES: readonly Timbre[] = [
  {
    id: 'piano',
    wave: 'custom',
    partials: [1, 0.55, 0.32, 0.18, 0.1, 0.06, 0.03],
    envelope: { attack: 0.005, decay: 1.8, sustain: 0.08, release: 0.35 },
    gain: 0.9,
  },
  {
    id: 'sine',
    wave: 'sine',
    partials: [],
    envelope: { attack: 0.01, decay: 0.1, sustain: 0.85, release: 0.25 },
    gain: 1,
  },
  {
    id: 'square',
    wave: 'square',
    partials: [],
    envelope: { attack: 0.01, decay: 0.15, sustain: 0.7, release: 0.15 },
    gain: 0.3,
  },
  {
    id: 'sawtooth',
    wave: 'sawtooth',
    partials: [],
    envelope: { attack: 0.015, decay: 0.2, sustain: 0.7, release: 0.2 },
    gain: 0.35,
  },
];

export function getTimbre(id: string): Timbre {
  return TIMBRES.find((t) => t.id === id) ?? TIMBRES[0];
}

/** PeriodicWave 用の係数（先頭の直流成分は 0）。 */
export function periodicWaveCoefficients(partials: readonly number[]): {
  real: number[];
  imag: number[];
} {
  return {
    real: [0, ...partials.map(() => 0)],
    imag: [0, ...partials],
  };
}

/**
 * 1音のピークの音量（0〜1）。ボリューム（0〜100）は聴感に合わせて2乗で効かせる。
 * 同時に何音か鳴らしても割れにくいよう、全体を抑えめにしている。
 */
export function peakGain(volume: number, timbre: Timbre): number {
  const v = clampVolume(volume) / 100;
  return v * v * 0.35 * timbre.gain;
}

/** 鍵を離してから発音ノードを止めるまでの待ち時間（秒）。 */
export function releaseStopDelay(envelope: Envelope): number {
  return envelope.release * 1.5 + 0.05;
}

export interface KeyTarget {
  tagName: string;
  type?: string;
  isContentEditable?: boolean;
}

export interface KeyModifiers {
  ctrlKey: boolean;
  metaKey: boolean;
  altKey: boolean;
}

const NON_TEXT_INPUT_TYPES = new Set([
  'range',
  'checkbox',
  'radio',
  'button',
  'submit',
  'reset',
  'color',
]);

/**
 * キー入力を演奏として扱わず、ブラウザの動作に任せるべきか。
 * 修飾キー付き（Ctrl+C など）や、文字入力・選択中の要素では無視する。
 */
export function shouldIgnoreKey(
  modifiers: KeyModifiers,
  target: KeyTarget | null,
): boolean {
  if (modifiers.ctrlKey || modifiers.metaKey || modifiers.altKey) return true;
  if (!target) return false;
  if (target.isContentEditable) return true;
  const tag = target.tagName.toUpperCase();
  if (tag === 'TEXTAREA' || tag === 'SELECT') return true;
  if (tag === 'INPUT') {
    return !NON_TEXT_INPUT_TYPES.has((target.type ?? 'text').toLowerCase());
  }
  return false;
}
