import { noteLabel } from './instrument-tuner';

export { noteLabel };

/** ログに残す最大件数。 */
export const MAX_LOG = 200;
export const PITCH_BEND_CENTER = 8192;

export type MidiKind =
  | 'noteOff'
  | 'noteOn'
  | 'polyPressure'
  | 'controlChange'
  | 'programChange'
  | 'channelPressure'
  | 'pitchBend'
  | 'sysex'
  | 'timeCode'
  | 'songPosition'
  | 'songSelect'
  | 'tuneRequest'
  | 'clock'
  | 'start'
  | 'continue'
  | 'stop'
  | 'activeSensing'
  | 'reset'
  | 'unknown';

export interface MidiEvent {
  kind: MidiKind;
  /** 1〜16。システムメッセージは null */
  channel: number | null;
  /** ノート番号（0〜127）。ノート系以外は null */
  note: number | null;
  /** "C4" など */
  noteName: string | null;
  /** ベロシティ / プレッシャー / CC値 / プログラム番号など（0〜127） */
  value: number | null;
  /** コントローラ番号（CCのみ） */
  controller: number | null;
  /** ピッチベンドの符号付きの値（-8192〜8191）。ピッチベンド以外は null */
  bend: number | null;
  /** 元のバイト列（16進表記用） */
  bytes: number[];
}

function base(kind: MidiKind, bytes: number[]): MidiEvent {
  return {
    kind,
    channel: null,
    note: null,
    noteName: null,
    value: null,
    controller: null,
    bend: null,
    bytes,
  };
}

const SYSTEM_KINDS: Record<number, MidiKind> = {
  0xf1: 'timeCode',
  0xf2: 'songPosition',
  0xf3: 'songSelect',
  0xf6: 'tuneRequest',
  0xf8: 'clock',
  0xfa: 'start',
  0xfb: 'continue',
  0xfc: 'stop',
  0xfe: 'activeSensing',
  0xff: 'reset',
};

/**
 * MIDIメッセージのバイト列を解釈する。空・先頭がステータスバイトでない・
 * データが足りない場合は null。ノートオン（ベロシティ0）はノートオフとして扱う。
 */
export function parseMidiMessage(data: ArrayLike<number>): MidiEvent | null {
  const bytes = Array.from(data, (b) => b & 0xff);
  if (bytes.length === 0) return null;
  const status = bytes[0];
  if (status < 0x80) return null;

  if (status >= 0xf0) {
    if (status === 0xf0) return base('sysex', bytes);
    const kind = SYSTEM_KINDS[status];
    return base(kind ?? 'unknown', bytes);
  }

  const type = status & 0xf0;
  const channel = (status & 0x0f) + 1;
  const d1 = bytes[1];
  const d2 = bytes[2];
  const has1 = d1 !== undefined && d1 < 0x80;
  const has2 = d2 !== undefined && d2 < 0x80;

  switch (type) {
    case 0x80:
    case 0x90:
    case 0xa0: {
      if (!has1 || !has2) return null;
      let kind: MidiKind =
        type === 0x80 ? 'noteOff' : type === 0x90 ? 'noteOn' : 'polyPressure';
      if (kind === 'noteOn' && d2 === 0) kind = 'noteOff';
      return {
        ...base(kind, bytes),
        channel,
        note: d1,
        noteName: noteLabel(d1),
        value: d2,
      };
    }
    case 0xb0:
      if (!has1 || !has2) return null;
      return {
        ...base('controlChange', bytes),
        channel,
        controller: d1,
        value: d2,
      };
    case 0xc0:
    case 0xd0:
      if (!has1) return null;
      return {
        ...base(type === 0xc0 ? 'programChange' : 'channelPressure', bytes),
        channel,
        value: d1,
      };
    case 0xe0:
      if (!has1 || !has2) return null;
      return {
        ...base('pitchBend', bytes),
        channel,
        value: d1 | (d2 << 7),
        bend: (d1 | (d2 << 7)) - PITCH_BEND_CENTER,
      };
    default:
      return null;
  }
}

/** バイト列を "90 3C 64" のような16進表記にする。長いSysExは先頭だけ。 */
export function formatBytes(bytes: readonly number[], limit = 16): string {
  const hex = bytes
    .slice(0, limit)
    .map((b) => (b & 0xff).toString(16).toUpperCase().padStart(2, '0'));
  return hex.join(' ') + (bytes.length > limit ? ' …' : '');
}

/** 連続して大量に届くため、既定ではログに出さないメッセージか。 */
export function isNoisy(event: MidiEvent): boolean {
  return event.kind === 'clock' || event.kind === 'activeSensing';
}

/** 主なコントローラ番号の英語名（MIDI規格の呼称）。なければ null。 */
const CONTROLLER_NAMES: Record<number, string> = {
  0: 'Bank Select',
  1: 'Modulation',
  2: 'Breath',
  4: 'Foot Controller',
  5: 'Portamento Time',
  6: 'Data Entry',
  7: 'Volume',
  8: 'Balance',
  10: 'Pan',
  11: 'Expression',
  32: 'Bank Select LSB',
  64: 'Sustain Pedal',
  65: 'Portamento',
  66: 'Sostenuto',
  67: 'Soft Pedal',
  71: 'Resonance',
  72: 'Release Time',
  73: 'Attack Time',
  74: 'Cutoff',
  91: 'Reverb',
  93: 'Chorus',
  120: 'All Sound Off',
  121: 'Reset All Controllers',
  123: 'All Notes Off',
};

export function controllerName(controller: number): string | null {
  return CONTROLLER_NAMES[controller] ?? null;
}

/** 新しいログを先頭に積み、上限を超えた古いものを捨てる。元の配列は変更しない。 */
export function pushLog<T>(log: readonly T[], entry: T, max = MAX_LOG): T[] {
  const limit = Math.max(1, Math.floor(max));
  return [entry, ...log].slice(0, limit);
}

function clamp7(value: number, fallback: number): number {
  if (!Number.isFinite(value)) return fallback;
  return Math.min(127, Math.max(0, Math.round(value)));
}

export function clampChannel(value: number): number {
  if (!Number.isFinite(value)) return 1;
  return Math.min(16, Math.max(1, Math.round(value)));
}

/** ノートオン（channel は 1〜16）。 */
export function noteOnMessage(
  channel: number,
  note: number,
  velocity: number,
): number[] {
  return [
    0x90 | (clampChannel(channel) - 1),
    clamp7(note, 60),
    clamp7(velocity, 100),
  ];
}

export function noteOffMessage(channel: number, note: number): number[] {
  return [0x80 | (clampChannel(channel) - 1), clamp7(note, 60), 0];
}

export const TEST_NOTE = 60;
export const TEST_VELOCITY = 100;
export const TEST_NOTE_MS = 500;
