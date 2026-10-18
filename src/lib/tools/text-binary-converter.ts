import { decodeBytes, encodeText, type Encoding } from './encoding-converter';

/** このツールで扱う文字コード（Shift_JIS は encoding-converter の逆引きテーブル実装を利用する） */
export type TextBinaryEncoding = Extract<
  Encoding,
  'utf-8' | 'utf-16le' | 'utf-16be' | 'shift_jis'
>;

export const TEXT_BINARY_ENCODINGS: readonly TextBinaryEncoding[] = [
  'utf-8',
  'utf-16le',
  'utf-16be',
  'shift_jis',
];

export type Radix = 2 | 8 | 16;

export const RADIXES: readonly Radix[] = [2, 8, 16];

export type Separator = 'space' | 'none';

/** 1バイトを表す桁数 */
export function digitsPerByte(radix: Radix): number {
  return radix === 2 ? 8 : radix === 8 ? 3 : 2;
}

export interface EncodeOptions {
  separator?: Separator;
  /** 16進数の英字を大文字にする（既定: 大文字） */
  uppercase?: boolean;
  /** UTF-8 / UTF-16 の先頭にBOMを付ける */
  bom?: boolean;
}

export interface TextToRadixResult {
  output: string;
  byteCount: number;
  /** 指定した文字コードで表現できず「?」に置き換えた文字 */
  unmappable: string[];
}

export function bytesToRadix(
  bytes: Uint8Array,
  radix: Radix,
  options: EncodeOptions = {},
): string {
  const width = digitsPerByte(radix);
  const uppercase = options.uppercase ?? true;
  const parts: string[] = [];
  for (let i = 0; i < bytes.length; i++) {
    let s = bytes[i].toString(radix).padStart(width, '0');
    if (radix === 16 && uppercase) s = s.toUpperCase();
    parts.push(s);
  }
  return parts.join(options.separator === 'none' ? '' : ' ');
}

/** テキストを指定した文字コードのバイト列にして、2/8/16進数の文字列にする */
export function textToRadix(
  text: string,
  encoding: TextBinaryEncoding,
  radix: Radix,
  options: EncodeOptions = {},
): TextToRadixResult {
  if (text === '') return { output: '', byteCount: 0, unmappable: [] };
  const { bytes, unmappable } = encodeText(text, encoding, {
    bom: options.bom,
  });
  return {
    output: bytesToRadix(bytes, radix, options),
    byteCount: bytes.length,
    unmappable,
  };
}

export type ParseError =
  | { reason: 'invalid-char'; token: string }
  | { reason: 'out-of-range'; token: string }
  | { reason: 'bad-length'; token: string };

export type ParseResult =
  { ok: true; bytes: Uint8Array } | ({ ok: false } & ParseError);

const DIGIT_PATTERNS: Record<Radix, RegExp> = {
  2: /^[01]+$/,
  8: /^[0-7]+$/,
  16: /^[0-9a-fA-F]+$/,
};

/** 区切り（空白・カンマ・セミコロン）ありでも、区切りなしの連続でも読める */
export function parseRadixBytes(input: string, radix: Radix): ParseResult {
  const width = digitsPerByte(radix);
  const rawTokens = input.split(/[\s,;]+/).filter((t) => t !== '');
  const tokens = rawTokens.map((t) => {
    if (radix === 16) return t.replace(/^(0x|\\x)/i, '');
    if (radix === 2) return t.replace(/^0b/i, '');
    return t.replace(/^0o/i, '');
  });
  const pattern = DIGIT_PATTERNS[radix];
  const bytes: number[] = [];
  const chunked = tokens.length === 1 && tokens[0].length > width;
  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];
    if (!pattern.test(token)) {
      return { ok: false, reason: 'invalid-char', token: rawTokens[i] };
    }
    if (chunked) {
      if (token.length % width !== 0) {
        return { ok: false, reason: 'bad-length', token: rawTokens[i] };
      }
      for (let p = 0; p < token.length; p += width) {
        const value = parseInt(token.slice(p, p + width), radix);
        if (value > 0xff) {
          return {
            ok: false,
            reason: 'out-of-range',
            token: token.slice(p, p + width),
          };
        }
        bytes.push(value);
      }
    } else {
      const value = parseInt(token, radix);
      if (value > 0xff) {
        return { ok: false, reason: 'out-of-range', token: rawTokens[i] };
      }
      bytes.push(value);
    }
  }
  return { ok: true, bytes: Uint8Array.from(bytes) };
}

export type RadixToTextResult =
  { ok: true; text: string; errorCount: number } | ({ ok: false } & ParseError);

/** 2/8/16進数のバイト列を、指定した文字コードとして解釈してテキストに戻す */
export function radixToText(
  input: string,
  encoding: TextBinaryEncoding,
  radix: Radix,
): RadixToTextResult {
  const parsed = parseRadixBytes(input, radix);
  if (!parsed.ok) return parsed;
  const { text, errorCount } = decodeBytes(parsed.bytes, encoding);
  return { ok: true, text, errorCount };
}
