export type EnvelopeId = 'nagagata3' | 'nagagata4' | 'youkei2' | 'youkei4';
export type Writing = 'vertical' | 'horizontal';
export type Numerals = 'tcy' | 'kanji' | 'asis';
export type HonorificId =
  'sama' | 'onchu' | 'yuki' | 'dono' | 'sensei' | 'none';

/** 封筒の寸法（mm）。印刷時の用紙サイズ（横向き）= 幅 × 高さ。JIS規格の寸法 */
export const ENVELOPES: Record<
  EnvelopeId,
  { widthMm: number; heightMm: number }
> = {
  nagagata3: { widthMm: 235, heightMm: 120 },
  nagagata4: { widthMm: 205, heightMm: 90 },
  youkei2: { widthMm: 162, heightMm: 114 },
  youkei4: { widthMm: 235, heightMm: 105 },
};

export const ENVELOPE_IDS = Object.keys(ENVELOPES) as EnvelopeId[];

export const HONORIFICS: Record<HonorificId, string> = {
  sama: '様',
  onchu: '御中',
  yuki: '行',
  dono: '殿',
  sensei: '先生',
  none: '',
};

export const ADDRESS_SIZE_MIN = 3;
export const ADDRESS_SIZE_MAX = 10;
export const NAME_SIZE_MIN = 4;
export const NAME_SIZE_MAX = 14;
export const SENDER_SIZE_MIN = 2.5;
export const SENDER_SIZE_MAX = 8;

/** 郵便番号枠（宛先用・差出人用）の寸法とピッチ（mm） */
export const RECIPIENT_FRAME = { widthMm: 6, heightMm: 8, pitchMm: 7 };
export const SENDER_FRAME = { widthMm: 4, heightMm: 5, pitchMm: 5 };
export const POSTAL_DIGITS = 7;

export interface EnvelopeOptions {
  envelope: EnvelopeId;
  writing: Writing;
  numerals: Numerals;
  recipientPostal: string;
  recipientAddress: string;
  recipientName: string;
  honorific: HonorificId;
  senderPostal: string;
  senderAddress: string;
  senderName: string;
  addressSizeMm: number;
  nameSizeMm: number;
  senderSizeMm: number;
  showFrames: boolean;
}

export const DEFAULT_OPTIONS: EnvelopeOptions = {
  envelope: 'nagagata3',
  writing: 'vertical',
  numerals: 'tcy',
  recipientPostal: '',
  recipientAddress: '',
  recipientName: '',
  honorific: 'sama',
  senderPostal: '',
  senderAddress: '',
  senderName: '',
  addressSizeMm: 4.5,
  nameSizeMm: 7,
  senderSizeMm: 3.5,
  showFrames: true,
};

export type OptionsError =
  | 'recipientPostal'
  | 'senderPostal'
  | 'addressSize'
  | 'nameSize'
  | 'senderSize';

/** 全角数字を半角にする */
function toHalfDigits(text: string): string {
  return text.replace(/[０-９]/g, (c) =>
    String.fromCharCode(c.charCodeAt(0) - 0xfee0),
  );
}

/**
 * 郵便番号を7桁の数字にする。空欄は有効（枠だけ印刷）。
 * 〒・ハイフン・空白・全角数字を許容し、7桁でなければ valid: false。
 */
export function parsePostal(input: string): { digits: string; valid: boolean } {
  const cleaned = toHalfDigits(input).replace(/[〒\s\-‐‑‒–—―−－ー]/g, '');
  if (cleaned === '') return { digits: '', valid: true };
  if (/^\d{7}$/.test(cleaned)) return { digits: cleaned, valid: true };
  return { digits: '', valid: false };
}

const KANJI_DIGITS = [
  '〇',
  '一',
  '二',
  '三',
  '四',
  '五',
  '六',
  '七',
  '八',
  '九',
];

/** 数字を位取りの漢数字にする（10 → 一〇）。全角数字も対象 */
export function toKanjiDigits(text: string): string {
  return toHalfDigits(text).replace(/\d/g, (d) => KANJI_DIGITS[Number(d)]);
}

export type SegmentKind = 'plain' | 'tcy' | 'upright';
export interface TextSegment {
  text: string;
  kind: SegmentKind;
}

const HYPHENS_BETWEEN_DIGITS = /(?<=\d)[-‐‑‒–—―−－](?=\d)/g;

/**
 * 縦書き用に文字列を分割する。
 * - tcy: 算用数字。1〜2桁は縦中横（kind: 'tcy'）、3桁以上は正立（'upright'）で縦に並べる
 * - kanji: 数字を漢数字にする
 * - asis: 変換しない
 * 数字に挟まれたハイフンは、縦書きで読める「ー」にする（asis 以外）。
 */
export function verticalSegments(
  text: string,
  numerals: Numerals,
): TextSegment[] {
  if (text === '') return [];
  if (numerals === 'asis') return [{ text, kind: 'plain' }];
  const ascii = toHalfDigits(text).replace(HYPHENS_BETWEEN_DIGITS, 'ー');
  if (numerals === 'kanji')
    return [{ text: toKanjiDigits(ascii), kind: 'plain' }];
  const segments: TextSegment[] = [];
  for (const part of ascii.split(/(\d+)/)) {
    if (part === '') continue;
    if (/^\d+$/.test(part)) {
      segments.push({ text: part, kind: part.length <= 2 ? 'tcy' : 'upright' });
    } else {
      segments.push({ text: part, kind: 'plain' });
    }
  }
  return segments;
}

/** 改行で行に分け、前後の空白と空行を除く */
export function splitLines(text: string): string[] {
  return text
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter((l) => l !== '');
}

/** 宛名に敬称を付ける（間に全角空白）。宛名が空なら空文字 */
export function composeRecipientName(
  name: string,
  honorific: HonorificId,
): string {
  const n = name.trim();
  if (n === '') return '';
  const h = HONORIFICS[honorific];
  return h === '' ? n : `${n}\u3000${h}`;
}

export function validateOptions(o: EnvelopeOptions): OptionsError | null {
  if (!parsePostal(o.recipientPostal).valid) return 'recipientPostal';
  if (!parsePostal(o.senderPostal).valid) return 'senderPostal';
  const inRange = (v: number, min: number, max: number) =>
    Number.isFinite(v) && v >= min && v <= max;
  if (!inRange(o.addressSizeMm, ADDRESS_SIZE_MIN, ADDRESS_SIZE_MAX))
    return 'addressSize';
  if (!inRange(o.nameSizeMm, NAME_SIZE_MIN, NAME_SIZE_MAX)) return 'nameSize';
  if (!inRange(o.senderSizeMm, SENDER_SIZE_MIN, SENDER_SIZE_MAX))
    return 'senderSize';
  return null;
}

export interface Box {
  leftMm: number;
  topMm: number;
  widthMm: number;
  heightMm: number;
}
export interface Frame {
  xMm: number;
  yMm: number;
  widthMm: number;
  heightMm: number;
  /** 枠に入れる数字（空欄・無効なら空文字） */
  digit: string;
}

export interface EnvelopeLayout {
  widthMm: number;
  heightMm: number;
  recipientPostal: Frame[];
  senderPostal: Frame[];
  recipientAddress: Box;
  recipientName: Box;
  sender: Box;
}

function frames(
  startX: number,
  y: number,
  spec: { widthMm: number; heightMm: number; pitchMm: number },
  digits: string,
): Frame[] {
  return Array.from({ length: POSTAL_DIGITS }, (_, i) => ({
    xMm: round(startX + i * spec.pitchMm),
    yMm: y,
    widthMm: spec.widthMm,
    heightMm: spec.heightMm,
    digit: digits[i] ?? '',
  }));
}

function round(n: number): number {
  return Math.round(n * 100) / 100;
}

function frameSpan(spec: { widthMm: number; pitchMm: number }): number {
  return (POSTAL_DIGITS - 1) * spec.pitchMm + spec.widthMm;
}

/**
 * 封筒上の各要素の位置（mm）を求める。目安の配置で、実際の封筒の規格枠位置とは数mm前後ずれうる。
 * 縦書きの Box は、右端が「1行目の位置」になる（writing-mode: vertical-rl で右から左へ並ぶ）。
 */
export function layoutEnvelope(o: EnvelopeOptions): EnvelopeLayout {
  const { widthMm: w, heightMm: h } = ENVELOPES[o.envelope];
  const rDigits = parsePostal(o.recipientPostal).digits;
  const sDigits = parsePostal(o.senderPostal).digits;
  const base = { widthMm: w, heightMm: h };

  if (o.writing === 'vertical') {
    const nameWidth = round(o.nameSizeMm * 1.5);
    const nameLeft = round(w / 2 - nameWidth / 2);
    const addressRight = w - 22;
    const addressLeft = round(nameLeft + nameWidth + 4);
    return {
      ...base,
      recipientPostal: frames(
        w - 12 - frameSpan(RECIPIENT_FRAME),
        10,
        RECIPIENT_FRAME,
        rDigits,
      ),
      senderPostal: frames(10, h - 13, SENDER_FRAME, sDigits),
      recipientAddress: {
        leftMm: addressLeft,
        topMm: 24,
        widthMm: round(addressRight - addressLeft),
        heightMm: h - 24 - 8,
      },
      recipientName: {
        leftMm: nameLeft,
        topMm: 30,
        widthMm: nameWidth,
        heightMm: h - 30 - 8,
      },
      sender: {
        leftMm: 10,
        topMm: 30,
        widthMm: 34,
        heightMm: h - 30 - 15,
      },
    };
  }

  const nameHeight = round(o.nameSizeMm * 1.5);
  const nameTop = round(h * 0.5 - nameHeight / 2);
  const senderPostalY = round(h * 0.62);
  return {
    ...base,
    recipientPostal: frames(12, 10, RECIPIENT_FRAME, rDigits),
    senderPostal: frames(
      w - 10 - frameSpan(SENDER_FRAME),
      senderPostalY,
      SENDER_FRAME,
      sDigits,
    ),
    recipientAddress: {
      leftMm: 20,
      topMm: 24,
      widthMm: w - 40,
      heightMm: round(nameTop - 24 - 1),
    },
    recipientName: {
      leftMm: 20,
      topMm: nameTop,
      widthMm: w - 40,
      heightMm: nameHeight,
    },
    sender: {
      leftMm: 20,
      topMm: round(senderPostalY + SENDER_FRAME.heightMm + 2),
      widthMm: w - 30,
      heightMm: round(h - 6 - (senderPostalY + SENDER_FRAME.heightMm + 2)),
    },
  };
}
