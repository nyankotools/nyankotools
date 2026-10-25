export const DEFAULT_A4 = 440;
export const MIN_A4 = 400;
export const MAX_A4 = 480;
export const MIN_MIDI = 0;
export const MAX_MIDI = 127;
/** 周波数入力として受け付ける範囲（Hz） */
export const MIN_FREQUENCY = 1;
export const MAX_FREQUENCY = 30000;
/** 一覧表に出す音域（科学的ピッチ表記のオクターブ） */
export const TABLE_MIN_OCTAVE = 0;
export const TABLE_MAX_OCTAVE = 8;
/** よく使われる基準ピッチ（A4, Hz） */
export const A4_PRESETS: readonly number[] = [415, 432, 435, 440, 442, 444];

export type Accidental = 'sharp' | 'flat';

const SHARP_NAMES = [
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
const FLAT_NAMES = [
  'C',
  'Db',
  'D',
  'Eb',
  'E',
  'F',
  'Gb',
  'G',
  'Ab',
  'A',
  'Bb',
  'B',
] as const;

/** 基準ピッチ（A4）を範囲内に収める。小数第2位まで。数値でなければ 440。 */
export function clampA4(value: number): number {
  if (!Number.isFinite(value)) return DEFAULT_A4;
  const clamped = Math.min(MAX_A4, Math.max(MIN_A4, value));
  return Math.round(clamped * 100) / 100;
}

/** MIDIノート番号（小数可）から周波数（Hz）を求める。A4 = 69。 */
export function midiToFrequency(midi: number, a4 = DEFAULT_A4): number {
  return a4 * 2 ** ((midi - 69) / 12);
}

/** 周波数（Hz）から、小数を含むMIDIノート番号を求める。 */
export function frequencyToMidi(frequency: number, a4 = DEFAULT_A4): number {
  return 69 + 12 * Math.log2(frequency / a4);
}

/** 2つの周波数の差（セント）。b を基準にした a のずれ。 */
export function centsBetween(a: number, b: number): number {
  return 1200 * Math.log2(a / b);
}

/** 整数のMIDIノート番号の音名（オクターブなし）。 */
export function pitchClassName(
  midi: number,
  accidental: Accidental = 'sharp',
): string {
  const index = ((Math.round(midi) % 12) + 12) % 12;
  return (accidental === 'flat' ? FLAT_NAMES : SHARP_NAMES)[index];
}

/** 科学的ピッチ表記のオクターブ（C4 = 中央のド = MIDI 60）。 */
export function octaveOf(midi: number): number {
  return Math.floor(Math.round(midi) / 12) - 1;
}

/** 音名とオクターブの表記（例: "C#4"）。小数は最も近い整数に丸める。 */
export function noteLabel(
  midi: number,
  accidental: Accidental = 'sharp',
): string {
  return `${pitchClassName(midi, accidental)}${octaveOf(midi)}`;
}

const NATURAL_SEMITONES: Record<string, number> = {
  C: 0,
  D: 2,
  E: 4,
  F: 5,
  G: 7,
  A: 9,
  B: 11,
};

/**
 * "C#4" "Db4" "A4" "B♭3" "bb2" などをMIDIノート番号にする。
 * 全角文字も受け付ける。解釈できない・MIDI範囲（0〜127）外は null。
 */
export function parseNoteName(text: string): number | null {
  const normalized = text
    .normalize('NFKC')
    .replace(/\s+/g, '')
    .replace(/♯/g, '#')
    .replace(/♭/g, 'b')
    .replace(/[−–—]/g, '-');
  const match = /^([A-Ga-g])([#b]?)(-?\d{1,2})$/.exec(normalized);
  if (!match) return null;
  const base = NATURAL_SEMITONES[match[1].toUpperCase()];
  const shift = match[2] === '#' ? 1 : match[2] === 'b' ? -1 : 0;
  const midi = (Number(match[3]) + 1) * 12 + base + shift;
  if (midi < MIN_MIDI || midi > MAX_MIDI) return null;
  return midi;
}

export interface FrequencyAnalysis {
  /** 最も近い音のMIDIノート番号 */
  midi: number;
  name: string;
  octave: number;
  /** 最も近い音からのずれ（セント）。-50〜+50 */
  cents: number;
  /** 最も近い音の周波数（Hz） */
  nearestFrequency: number;
}

/** 周波数から、最も近い音名とそこからのずれ（セント）を求める。範囲外は null。 */
export function analyzeFrequency(
  frequency: number,
  a4 = DEFAULT_A4,
  accidental: Accidental = 'sharp',
): FrequencyAnalysis | null {
  if (
    !Number.isFinite(frequency) ||
    frequency < MIN_FREQUENCY ||
    frequency > MAX_FREQUENCY
  ) {
    return null;
  }
  const exact = frequencyToMidi(frequency, a4);
  const midi = Math.round(exact);
  const nearestFrequency = midiToFrequency(midi, a4);
  return {
    midi,
    name: pitchClassName(midi, accidental),
    octave: octaveOf(midi),
    cents: (exact - midi) * 100,
    nearestFrequency,
  };
}

/** 周波数の表示用整形。小数第2位までで、末尾の0は落とす。 */
export function formatFrequency(frequency: number): string {
  if (!Number.isFinite(frequency)) return '';
  return String(Math.round(frequency * 100) / 100);
}

/** セントの表示用整形（符号つき、小数第1位）。 */
export function formatCents(cents: number): string {
  const rounded = Math.round(cents * 10) / 10;
  const value = Object.is(rounded, -0) ? 0 : rounded;
  return `${value > 0 ? '+' : ''}${value.toFixed(1)}`;
}

export interface TableRow {
  octave: number;
  cells: { midi: number; name: string; frequency: number }[];
}

/** オクターブ × 12音の周波数一覧。 */
export function frequencyTable(
  a4 = DEFAULT_A4,
  accidental: Accidental = 'sharp',
): TableRow[] {
  const rows: TableRow[] = [];
  for (let octave = TABLE_MIN_OCTAVE; octave <= TABLE_MAX_OCTAVE; octave++) {
    const cells = [];
    for (let i = 0; i < 12; i++) {
      const midi = (octave + 1) * 12 + i;
      cells.push({
        midi,
        name: pitchClassName(midi, accidental),
        frequency: midiToFrequency(midi, a4),
      });
    }
    rows.push({ octave, cells });
  }
  return rows;
}

/** 一覧表のタブ区切りテキスト（行=オクターブ、列=音名）。 */
export function tableToTsv(rows: TableRow[]): string {
  if (rows.length === 0) return '';
  const header = ['', ...rows[0].cells.map((c) => c.name)].join('\t');
  const lines = rows.map((row) =>
    [
      String(row.octave),
      ...row.cells.map((c) => formatFrequency(c.frequency)),
    ].join('\t'),
  );
  return [header, ...lines].join('\n');
}
