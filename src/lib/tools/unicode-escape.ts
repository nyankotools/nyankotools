export type UnicodeEscapeFormat =
  'js' | 'es6' | 'python' | 'codepoint' | 'html-hex' | 'html-dec';

export type UnicodeEscapeScope = 'non-ascii' | 'all';

export interface UnicodeEscapeOptions {
  format: UnicodeEscapeFormat;
  /** non-ascii: ASCII（U+0000〜U+007F）はそのまま残す / all: すべての文字を変換する */
  scope: UnicodeEscapeScope;
  /** 16進数を大文字にするか */
  uppercase: boolean;
}

function hex(value: number, pad: number, uppercase: boolean): string {
  const s = value.toString(16).padStart(pad, '0');
  return uppercase ? s.toUpperCase() : s;
}

function escapeCodePoint(
  cp: number,
  format: UnicodeEscapeFormat,
  uppercase: boolean,
): string {
  switch (format) {
    case 'js':
      if (cp > 0xffff) {
        const offset = cp - 0x10000;
        const high = 0xd800 + (offset >> 10);
        const low = 0xdc00 + (offset & 0x3ff);
        return `\\u${hex(high, 4, uppercase)}\\u${hex(low, 4, uppercase)}`;
      }
      return `\\u${hex(cp, 4, uppercase)}`;
    case 'es6':
      return `\\u{${hex(cp, 1, uppercase)}}`;
    case 'python':
      return cp > 0xffff
        ? `\\U${hex(cp, 8, uppercase)}`
        : `\\u${hex(cp, 4, uppercase)}`;
    case 'codepoint':
      return `U+${hex(cp, 4, true)}`;
    case 'html-hex':
      return `&#x${hex(cp, 1, uppercase)};`;
    case 'html-dec':
      return `&#${cp};`;
  }
}

export function escapeUnicode(
  text: string,
  options: UnicodeEscapeOptions,
): string {
  let result = '';
  for (const ch of text) {
    const cp = ch.codePointAt(0)!;
    if (options.scope === 'non-ascii' && cp < 0x80) {
      result += ch;
    } else {
      result += escapeCodePoint(cp, options.format, options.uppercase);
    }
  }
  return result;
}

// 先頭の `\\`（バックスラッシュ自体のエスケープ）は、直後の `u…` を展開しないよう丸ごと温存する
const UNESCAPE_PATTERN =
  /\\\\|\\u\{([0-9a-fA-F]{1,6})\}|\\U([0-9a-fA-F]{8})|\\u([0-9a-fA-F]{4})|\\x([0-9a-fA-F]{2})|(?<![A-Za-z0-9])U\+([0-9a-fA-F]{4,6})|&#[xX]([0-9a-fA-F]{1,6});|&#([0-9]{1,7});/g;

export function unescapeUnicode(text: string): string {
  return text.replace(
    UNESCAPE_PATTERN,
    (
      match: string,
      brace?: string,
      long?: string,
      short?: string,
      byte?: string,
      plus?: string,
      htmlHex?: string,
      htmlDec?: string,
    ) => {
      if (match === '\\\\') return match;
      if (short !== undefined) {
        // サロゲート単体も保持する（連続する 😀 は連結で絵文字に戻る）
        return String.fromCharCode(parseInt(short, 16));
      }
      if (byte !== undefined) return String.fromCharCode(parseInt(byte, 16));
      const digits = brace ?? long ?? plus ?? htmlHex;
      const cp =
        digits !== undefined ? parseInt(digits, 16) : parseInt(htmlDec!, 10);
      return cp <= 0x10ffff ? String.fromCodePoint(cp) : match;
    },
  );
}
