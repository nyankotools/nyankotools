// 文字名データベースは同梱せず、カテゴリ・スクリプトは \p{...} で判定する。
// 名称は ASCII・制御文字・主要な不可視文字・国旗/肌色修飾子など小さな範囲に限る。

export const GENERAL_CATEGORIES = [
  'Lu',
  'Ll',
  'Lt',
  'Lm',
  'Lo',
  'Mn',
  'Mc',
  'Me',
  'Nd',
  'Nl',
  'No',
  'Pc',
  'Pd',
  'Ps',
  'Pe',
  'Pi',
  'Pf',
  'Po',
  'Sm',
  'Sc',
  'Sk',
  'So',
  'Zs',
  'Zl',
  'Zp',
  'Cc',
  'Cf',
  'Cs',
  'Co',
  'Cn',
] as const;

export type GeneralCategory = (typeof GENERAL_CATEGORIES)[number];

const CATEGORY_PATTERNS: [GeneralCategory, RegExp][] = GENERAL_CATEGORIES.map(
  (c) => [c, new RegExp(`^\\p{${c}}$`, 'u')],
);

const SCRIPTS = [
  'Latin',
  'Greek',
  'Cyrillic',
  'Hiragana',
  'Katakana',
  'Han',
  'Hangul',
  'Arabic',
  'Hebrew',
  'Thai',
  'Devanagari',
  'Armenian',
  'Georgian',
  'Bopomofo',
  'Common',
  'Inherited',
] as const;

const SCRIPT_PATTERNS: [string, RegExp][] = SCRIPTS.map((s) => [
  s,
  new RegExp(`^\\p{Script=${s}}$`, 'u'),
]);

/** 主要ブロックの簡易テーブル（網羅ではない） */
const BLOCKS: [number, number, string][] = [
  [0x0000, 0x007f, 'Basic Latin'],
  [0x0080, 0x00ff, 'Latin-1 Supplement'],
  [0x0100, 0x024f, 'Latin Extended-A/B'],
  [0x0300, 0x036f, 'Combining Diacritical Marks'],
  [0x0370, 0x03ff, 'Greek and Coptic'],
  [0x0400, 0x04ff, 'Cyrillic'],
  [0x0590, 0x05ff, 'Hebrew'],
  [0x0600, 0x06ff, 'Arabic'],
  [0x0e00, 0x0e7f, 'Thai'],
  [0x1100, 0x11ff, 'Hangul Jamo'],
  [0x2000, 0x206f, 'General Punctuation'],
  [0x2070, 0x209f, 'Superscripts and Subscripts'],
  [0x20a0, 0x20cf, 'Currency Symbols'],
  [0x2100, 0x214f, 'Letterlike Symbols'],
  [0x2190, 0x21ff, 'Arrows'],
  [0x2200, 0x22ff, 'Mathematical Operators'],
  [0x2300, 0x23ff, 'Miscellaneous Technical'],
  [0x2400, 0x243f, 'Control Pictures'],
  [0x2460, 0x24ff, 'Enclosed Alphanumerics'],
  [0x2500, 0x257f, 'Box Drawing'],
  [0x25a0, 0x25ff, 'Geometric Shapes'],
  [0x2600, 0x26ff, 'Miscellaneous Symbols'],
  [0x2700, 0x27bf, 'Dingbats'],
  [0x3000, 0x303f, 'CJK Symbols and Punctuation'],
  [0x3040, 0x309f, 'Hiragana'],
  [0x30a0, 0x30ff, 'Katakana'],
  [0x3400, 0x4dbf, 'CJK Unified Ideographs Extension A'],
  [0x4e00, 0x9fff, 'CJK Unified Ideographs'],
  [0xac00, 0xd7af, 'Hangul Syllables'],
  [0xd800, 0xdfff, 'Surrogates'],
  [0xe000, 0xf8ff, 'Private Use Area'],
  [0xf900, 0xfaff, 'CJK Compatibility Ideographs'],
  [0xfe00, 0xfe0f, 'Variation Selectors'],
  [0xff00, 0xffef, 'Halfwidth and Fullwidth Forms'],
  [0x1f000, 0x1f02f, 'Mahjong Tiles'],
  [0x1f1e6, 0x1f1ff, 'Regional Indicator Symbols'],
  [0x1f300, 0x1f5ff, 'Miscellaneous Symbols and Pictographs'],
  [0x1f600, 0x1f64f, 'Emoticons'],
  [0x1f680, 0x1f6ff, 'Transport and Map Symbols'],
  [0x1f900, 0x1f9ff, 'Supplemental Symbols and Pictographs'],
  [0x20000, 0x2a6df, 'CJK Unified Ideographs Extension B'],
  [0xe0000, 0xe007f, 'Tags'],
  [0xe0100, 0xe01ef, 'Variation Selectors Supplement'],
  [0xf0000, 0xffffd, 'Supplementary Private Use Area-A'],
  [0x100000, 0x10fffd, 'Supplementary Private Use Area-B'],
];

const CONTROL_NAMES = [
  'NULL',
  'START OF HEADING',
  'START OF TEXT',
  'END OF TEXT',
  'END OF TRANSMISSION',
  'ENQUIRY',
  'ACKNOWLEDGE',
  'BELL',
  'BACKSPACE',
  'CHARACTER TABULATION',
  'LINE FEED',
  'LINE TABULATION',
  'FORM FEED',
  'CARRIAGE RETURN',
  'SHIFT OUT',
  'SHIFT IN',
  'DATA LINK ESCAPE',
  'DEVICE CONTROL ONE',
  'DEVICE CONTROL TWO',
  'DEVICE CONTROL THREE',
  'DEVICE CONTROL FOUR',
  'NEGATIVE ACKNOWLEDGE',
  'SYNCHRONOUS IDLE',
  'END OF TRANSMISSION BLOCK',
  'CANCEL',
  'END OF MEDIUM',
  'SUBSTITUTE',
  'ESCAPE',
  'INFORMATION SEPARATOR FOUR',
  'INFORMATION SEPARATOR THREE',
  'INFORMATION SEPARATOR TWO',
  'INFORMATION SEPARATOR ONE',
];

const ASCII_PUNCT_NAMES: Record<string, string> = {
  ' ': 'SPACE',
  '!': 'EXCLAMATION MARK',
  '"': 'QUOTATION MARK',
  '#': 'NUMBER SIGN',
  $: 'DOLLAR SIGN',
  '%': 'PERCENT SIGN',
  '&': 'AMPERSAND',
  "'": 'APOSTROPHE',
  '(': 'LEFT PARENTHESIS',
  ')': 'RIGHT PARENTHESIS',
  '*': 'ASTERISK',
  '+': 'PLUS SIGN',
  ',': 'COMMA',
  '-': 'HYPHEN-MINUS',
  '.': 'FULL STOP',
  '/': 'SOLIDUS',
  ':': 'COLON',
  ';': 'SEMICOLON',
  '<': 'LESS-THAN SIGN',
  '=': 'EQUALS SIGN',
  '>': 'GREATER-THAN SIGN',
  '?': 'QUESTION MARK',
  '@': 'COMMERCIAL AT',
  '[': 'LEFT SQUARE BRACKET',
  '\\': 'REVERSE SOLIDUS',
  ']': 'RIGHT SQUARE BRACKET',
  '^': 'CIRCUMFLEX ACCENT',
  _: 'LOW LINE',
  '`': 'GRAVE ACCENT',
  '{': 'LEFT CURLY BRACKET',
  '|': 'VERTICAL LINE',
  '}': 'RIGHT CURLY BRACKET',
  '~': 'TILDE',
};

const DIGIT_NAMES = [
  'ZERO',
  'ONE',
  'TWO',
  'THREE',
  'FOUR',
  'FIVE',
  'SIX',
  'SEVEN',
  'EIGHT',
  'NINE',
];

const SPECIAL_NAMES: Record<number, string> = {
  0x7f: 'DELETE',
  0x85: 'NEXT LINE',
  0xa0: 'NO-BREAK SPACE',
  0xad: 'SOFT HYPHEN',
  0x200b: 'ZERO WIDTH SPACE',
  0x200c: 'ZERO WIDTH NON-JOINER',
  0x200d: 'ZERO WIDTH JOINER',
  0x200e: 'LEFT-TO-RIGHT MARK',
  0x200f: 'RIGHT-TO-LEFT MARK',
  0x2028: 'LINE SEPARATOR',
  0x2029: 'PARAGRAPH SEPARATOR',
  0x202f: 'NARROW NO-BREAK SPACE',
  0x2060: 'WORD JOINER',
  0x20e3: 'COMBINING ENCLOSING KEYCAP',
  0x3000: 'IDEOGRAPHIC SPACE',
  0xfe0e: 'VARIATION SELECTOR-15',
  0xfe0f: 'VARIATION SELECTOR-16',
  0xfeff: 'ZERO WIDTH NO-BREAK SPACE (BOM)',
  0xfffd: 'REPLACEMENT CHARACTER',
  0x1f3fb: 'EMOJI MODIFIER FITZPATRICK TYPE-1-2',
  0x1f3fc: 'EMOJI MODIFIER FITZPATRICK TYPE-3',
  0x1f3fd: 'EMOJI MODIFIER FITZPATRICK TYPE-4',
  0x1f3fe: 'EMOJI MODIFIER FITZPATRICK TYPE-5',
  0x1f3ff: 'EMOJI MODIFIER FITZPATRICK TYPE-6',
  0x1f600: 'GRINNING FACE',
  0x1f602: 'FACE WITH TEARS OF JOY',
  0x1f44d: 'THUMBS UP SIGN',
  0x2764: 'HEAVY BLACK HEART',
  0x1f431: 'CAT FACE',
  0x1f408: 'CAT',
};

/** 名称テーブルにある文字だけ名称を返す。無ければ null */
export function lookupName(cp: number): string | null {
  if (cp >= 0 && cp < 0x20) return CONTROL_NAMES[cp];
  if (cp in SPECIAL_NAMES) return SPECIAL_NAMES[cp];
  if (cp >= 0x20 && cp < 0x7f) {
    const ch = String.fromCharCode(cp);
    if (ch in ASCII_PUNCT_NAMES) return ASCII_PUNCT_NAMES[ch];
    if (cp >= 0x30 && cp <= 0x39) return `DIGIT ${DIGIT_NAMES[cp - 0x30]}`;
    if (cp >= 0x41 && cp <= 0x5a) return `LATIN CAPITAL LETTER ${ch}`;
    if (cp >= 0x61 && cp <= 0x7a)
      return `LATIN SMALL LETTER ${ch.toUpperCase()}`;
  }
  if (cp >= 0x1f1e6 && cp <= 0x1f1ff) {
    return `REGIONAL INDICATOR SYMBOL LETTER ${String.fromCharCode(0x41 + cp - 0x1f1e6)}`;
  }
  if (cp >= 0xfe00 && cp <= 0xfe0d) {
    return `VARIATION SELECTOR-${cp - 0xfe00 + 1}`;
  }
  return null;
}

export function lookupBlock(cp: number): string | null {
  for (const [start, end, name] of BLOCKS) {
    if (cp >= start && cp <= end) return name;
  }
  return null;
}

export function getCategory(ch: string): GeneralCategory {
  for (const [code, re] of CATEGORY_PATTERNS) {
    if (re.test(ch)) return code;
  }
  return 'Cn';
}

export function getScript(ch: string): string | null {
  for (const [name, re] of SCRIPT_PATTERNS) {
    if (re.test(ch)) return name;
  }
  return null;
}

/** コードポイント1つ分をUTF-8のバイト列にする（単独サロゲートも3バイトで表す） */
export function utf8Bytes(cp: number): number[] {
  if (cp < 0x80) return [cp];
  // 単独サロゲートは TextEncoder と同じく U+FFFD に置き換わる
  if (cp >= 0xd800 && cp <= 0xdfff) return [0xef, 0xbf, 0xbd];
  if (cp < 0x800) return [0xc0 | (cp >> 6), 0x80 | (cp & 0x3f)];
  if (cp < 0x10000) {
    return [0xe0 | (cp >> 12), 0x80 | ((cp >> 6) & 0x3f), 0x80 | (cp & 0x3f)];
  }
  return [
    0xf0 | (cp >> 18),
    0x80 | ((cp >> 12) & 0x3f),
    0x80 | ((cp >> 6) & 0x3f),
    0x80 | (cp & 0x3f),
  ];
}

export function utf16Units(cp: number): number[] {
  if (cp < 0x10000) return [cp];
  const offset = cp - 0x10000;
  return [0xd800 + (offset >> 10), 0xdc00 + (offset & 0x3ff)];
}

export function formatCodePoint(cp: number): string {
  return `U+${cp.toString(16).toUpperCase().padStart(4, '0')}`;
}

function hexUnits(values: number[], pad: number): string {
  return values
    .map((v) => v.toString(16).toUpperCase().padStart(pad, '0'))
    .join(' ');
}

export interface CharInfo {
  char: string;
  codePoint: number;
  /** U+XXXX */
  notation: string;
  /** 画面表示用。不可視文字は null */
  display: string | null;
  utf8: string;
  utf16: string;
  utf8Length: number;
  category: GeneralCategory;
  script: string | null;
  block: string | null;
  name: string | null;
  /** 絵文字（Extended_Pictographic または国旗の地域指示子） */
  isEmoji: boolean;
  /** 結合・合成に関わる文字（ZWJ・異体字セレクタ・結合記号・肌色修飾子など） */
  isJoiner: boolean;
}

const EXT_PICT = /^\p{Extended_Pictographic}$/u;
const EMOJI_MODIFIER = /^\p{Emoji_Modifier}$/u;

function displayOf(
  ch: string,
  cp: number,
  cat: GeneralCategory,
): string | null {
  if (cat === 'Cc') {
    if (cp < 0x20) return String.fromCodePoint(0x2400 + cp);
    if (cp === 0x7f) return '␡';
    return null;
  }
  if (cat === 'Cf' || cat === 'Zl' || cat === 'Zp' || cat === 'Cn') return null;
  if (cat === 'Cs' || cat === 'Co') return null;
  if (cat === 'Zs') return cp === 0x20 ? '␣' : null;
  if (cat === 'Mn' || cat === 'Me') return `◌${ch}`;
  return ch;
}

export function inspectCodePoint(ch: string): CharInfo {
  const cp = ch.codePointAt(0)!;
  const category = getCategory(ch);
  const utf8 = utf8Bytes(cp);
  return {
    char: ch,
    codePoint: cp,
    notation: formatCodePoint(cp),
    display: displayOf(ch, cp, category),
    utf8: hexUnits(utf8, 2),
    utf16: hexUnits(utf16Units(cp), 4),
    utf8Length: utf8.length,
    category,
    script: getScript(ch),
    block: lookupBlock(cp),
    name: lookupName(cp),
    isEmoji:
      (EXT_PICT.test(ch) && cp > 0xff) || (cp >= 0x1f1e6 && cp <= 0x1f1ff),
    isJoiner:
      cp === 0x200d ||
      (cp >= 0xfe00 && cp <= 0xfe0f) ||
      (cp >= 0xe0100 && cp <= 0xe01ef) ||
      cat(category) ||
      EMOJI_MODIFIER.test(ch),
  };
}

function cat(c: GeneralCategory): boolean {
  return c === 'Mn' || c === 'Mc' || c === 'Me';
}

export interface TextSummary {
  codePoints: number;
  utf16Length: number;
  utf8Length: number;
  graphemes: number;
}

export interface InspectResult {
  chars: CharInfo[];
  summary: TextSummary;
  /** maxChars を超えて切り捨てたか */
  truncated: boolean;
}

export function countGraphemes(text: string): number {
  if (typeof Intl !== 'undefined' && 'Segmenter' in Intl) {
    const segmenter = new Intl.Segmenter(undefined, {
      granularity: 'grapheme',
    });
    return Array.from(segmenter.segment(text)).length;
  }
  return Array.from(text).length;
}

export function inspectText(text: string, maxChars = 2000): InspectResult {
  const all = Array.from(text);
  let utf8Length = 0;
  for (const ch of all) utf8Length += utf8Bytes(ch.codePointAt(0)!).length;
  const shown = all.slice(0, maxChars);
  return {
    chars: shown.map(inspectCodePoint),
    summary: {
      codePoints: all.length,
      utf16Length: text.length,
      utf8Length,
      graphemes: countGraphemes(text),
    },
    truncated: all.length > maxChars,
  };
}

export interface ParsedCodePoints {
  text: string;
  /** 解釈できなかったトークン */
  invalid: string[];
}

const TOKEN_PATTERNS: RegExp[] = [
  /^[uU]\+([0-9a-fA-F]{1,8})$/,
  /^0[xX]([0-9a-fA-F]{1,8})$/,
  /^\\[uU]\{([0-9a-fA-F]{1,8})\}$/,
  /^\\u([0-9a-fA-F]{4})$/,
  /^\\U([0-9a-fA-F]{8})$/,
  /^&#[xX]([0-9a-fA-F]{1,8});?$/,
  /^([0-9a-fA-F]{1,8})$/,
];

/** U+3042 / 0x3042 / \u{3042} / &#x3042; / 3042 などをスペース・カンマ区切りで受け取り文字列にする */
export function parseCodePoints(input: string): ParsedCodePoints {
  const tokens = input.split(/[\s,、]+/).filter((t) => t !== '');
  const invalid: string[] = [];
  let text = '';
  for (const token of tokens) {
    let cp: number | null = null;
    for (const re of TOKEN_PATTERNS) {
      const m = re.exec(token);
      if (m) {
        cp = parseInt(m[1], 16);
        break;
      }
    }
    if (cp === null || cp > 0x10ffff) {
      invalid.push(token);
    } else {
      text += String.fromCodePoint(cp);
    }
  }
  return { text, invalid };
}
