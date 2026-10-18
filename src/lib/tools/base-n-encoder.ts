export const baseNFormats = [
  'base16',
  'base32',
  'base58',
  'base62',
  'base85',
] as const;

export type BaseNFormat = (typeof baseNFormats)[number];

export type BaseNErrorKind =
  'invalid-char' | 'invalid-length' | 'overflow' | 'invalid-utf8';

export interface BaseNError {
  kind: BaseNErrorKind;
  /** invalid-char のときの該当文字 */
  char?: string;
  /** invalid-char のときの、空白除去後の文字列における位置（0始まり） */
  index?: number;
}

export type BaseNBytesOutcome =
  { success: true; bytes: Uint8Array } | { success: false; error: BaseNError };

export type BaseNTextOutcome =
  { success: true; output: string } | { success: false; error: BaseNError };

const BASE32_ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
const BASE58_ALPHABET =
  '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';
const BASE62_ALPHABET =
  '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';

function stripWhitespace(input: string): string {
  return input.replace(/\s+/g, '');
}

// ---- Base16 ----

function encodeBase16(bytes: Uint8Array): string {
  let out = '';
  for (const b of bytes) out += b.toString(16).padStart(2, '0');
  return out;
}

function decodeBase16(input: string): BaseNBytesOutcome {
  let s = stripWhitespace(input);
  // "0x" や "\x" 付き表記は許容しない（紛らわしいので 0x 先頭のみ除去）
  if (/^0x/i.test(s)) s = s.slice(2);
  for (let i = 0; i < s.length; i++) {
    if (!/[0-9a-fA-F]/.test(s[i])) {
      return {
        success: false,
        error: { kind: 'invalid-char', char: s[i], index: i },
      };
    }
  }
  if (s.length % 2 !== 0) {
    return { success: false, error: { kind: 'invalid-length' } };
  }
  const bytes = new Uint8Array(s.length / 2);
  for (let i = 0; i < bytes.length; i++) {
    bytes[i] = parseInt(s.slice(i * 2, i * 2 + 2), 16);
  }
  return { success: true, bytes };
}

// ---- Base32 (RFC 4648) ----

function encodeBase32(bytes: Uint8Array, padding: boolean): string {
  let out = '';
  let buffer = 0;
  let bits = 0;
  for (const b of bytes) {
    buffer = (buffer << 8) | b;
    bits += 8;
    while (bits >= 5) {
      out += BASE32_ALPHABET[(buffer >>> (bits - 5)) & 31];
      bits -= 5;
    }
    buffer &= (1 << bits) - 1;
  }
  if (bits > 0) out += BASE32_ALPHABET[(buffer << (5 - bits)) & 31];
  if (padding) {
    while (out.length % 8 !== 0) out += '=';
  }
  return out;
}

function decodeBase32(input: string): BaseNBytesOutcome {
  const s = stripWhitespace(input).toUpperCase().replace(/=+$/, '');
  const out: number[] = [];
  let buffer = 0;
  let bits = 0;
  for (let i = 0; i < s.length; i++) {
    const v = BASE32_ALPHABET.indexOf(s[i]);
    if (v < 0) {
      return {
        success: false,
        error: { kind: 'invalid-char', char: s[i], index: i },
      };
    }
    buffer = (buffer << 5) | v;
    bits += 5;
    if (bits >= 8) {
      out.push((buffer >>> (bits - 8)) & 255);
      bits -= 8;
    }
    buffer &= (1 << bits) - 1;
  }
  // 1, 3, 6 文字余りは Base32 として成立しない
  const rem = s.length % 8;
  if (rem === 1 || rem === 3 || rem === 6) {
    return { success: false, error: { kind: 'invalid-length' } };
  }
  return { success: true, bytes: Uint8Array.from(out) };
}

// ---- Base58 / Base62 (big-integer based) ----

function encodeBigBase(bytes: Uint8Array, alphabet: string): string {
  if (bytes.length === 0) return '';
  const base = BigInt(alphabet.length);
  let zeros = 0;
  while (zeros < bytes.length && bytes[zeros] === 0) zeros++;
  let n = 0n;
  for (let i = zeros; i < bytes.length; i++) {
    n = (n << 8n) | BigInt(bytes[i]);
  }
  let digits = '';
  while (n > 0n) {
    digits = alphabet[Number(n % base)] + digits;
    n /= base;
  }
  return alphabet[0].repeat(zeros) + digits;
}

function decodeBigBase(input: string, alphabet: string): BaseNBytesOutcome {
  const s = stripWhitespace(input);
  const base = BigInt(alphabet.length);
  let zeros = 0;
  while (zeros < s.length && s[zeros] === alphabet[0]) zeros++;
  let n = 0n;
  for (let i = 0; i < s.length; i++) {
    const v = alphabet.indexOf(s[i]);
    if (v < 0) {
      return {
        success: false,
        error: { kind: 'invalid-char', char: s[i], index: i },
      };
    }
    n = n * base + BigInt(v);
  }
  const rest: number[] = [];
  while (n > 0n) {
    rest.unshift(Number(n & 255n));
    n >>= 8n;
  }
  const bytes = new Uint8Array(zeros + rest.length);
  bytes.set(rest, zeros);
  return { success: true, bytes };
}

// ---- Base85 (Ascii85) ----

function encodeBase85(bytes: Uint8Array): string {
  let out = '';
  for (let i = 0; i < bytes.length; i += 4) {
    const chunk = Math.min(4, bytes.length - i);
    let value = 0;
    for (let j = 0; j < 4; j++) {
      value = value * 256 + (j < chunk ? bytes[i + j] : 0);
    }
    if (chunk === 4 && value === 0) {
      out += 'z';
      continue;
    }
    const digits: string[] = [];
    for (let j = 0; j < 5; j++) {
      digits.unshift(String.fromCharCode((value % 85) + 33));
      value = Math.floor(value / 85);
    }
    out += digits.slice(0, chunk + 1).join('');
  }
  return out;
}

function decodeBase85(input: string): BaseNBytesOutcome {
  let s = stripWhitespace(input);
  if (s.startsWith('<~')) s = s.slice(2);
  if (s.endsWith('~>')) s = s.slice(0, -2);
  const out: number[] = [];
  let group: number[] = [];
  const flush = (): boolean => {
    const count = group.length;
    while (group.length < 5) group.push(84); // 'u'
    let value = 0;
    for (const d of group) value = value * 85 + d;
    if (value > 0xffffffff) return false;
    for (let j = 0; j < count - 1; j++) {
      out.push(Math.floor(value / 256 ** (3 - j)) % 256);
    }
    group = [];
    return true;
  };
  for (let i = 0; i < s.length; i++) {
    const c = s[i];
    if (c === 'z') {
      if (group.length !== 0) {
        return {
          success: false,
          error: { kind: 'invalid-char', char: c, index: i },
        };
      }
      out.push(0, 0, 0, 0);
      continue;
    }
    const code = c.charCodeAt(0);
    if (code < 33 || code > 117) {
      return {
        success: false,
        error: { kind: 'invalid-char', char: c, index: i },
      };
    }
    group.push(code - 33);
    if (group.length === 5 && !flush()) {
      return { success: false, error: { kind: 'overflow' } };
    }
  }
  if (group.length === 1) {
    return { success: false, error: { kind: 'invalid-length' } };
  }
  if (group.length > 1 && !flush()) {
    return { success: false, error: { kind: 'overflow' } };
  }
  return { success: true, bytes: Uint8Array.from(out) };
}

// ---- Public API ----

export interface EncodeOptions {
  /** Base32 の出力に = パディングを付ける（既定 true） */
  padding?: boolean;
  /** Base16 を大文字にする（既定 false） */
  uppercase?: boolean;
}

export function encodeBytes(
  format: BaseNFormat,
  bytes: Uint8Array,
  options: EncodeOptions = {},
): string {
  switch (format) {
    case 'base16': {
      const hex = encodeBase16(bytes);
      return options.uppercase ? hex.toUpperCase() : hex;
    }
    case 'base32':
      return encodeBase32(bytes, options.padding ?? true);
    case 'base58':
      return encodeBigBase(bytes, BASE58_ALPHABET);
    case 'base62':
      return encodeBigBase(bytes, BASE62_ALPHABET);
    case 'base85':
      return encodeBase85(bytes);
  }
}

export function decodeToBytes(
  format: BaseNFormat,
  input: string,
): BaseNBytesOutcome {
  switch (format) {
    case 'base16':
      return decodeBase16(input);
    case 'base32':
      return decodeBase32(input);
    case 'base58':
      return decodeBigBase(input, BASE58_ALPHABET);
    case 'base62':
      return decodeBigBase(input, BASE62_ALPHABET);
    case 'base85':
      return decodeBase85(input);
  }
}

export function encodeText(
  format: BaseNFormat,
  text: string,
  options: EncodeOptions = {},
): string {
  return encodeBytes(format, new TextEncoder().encode(text), options);
}

export function decodeText(
  format: BaseNFormat,
  input: string,
): BaseNTextOutcome {
  const result = decodeToBytes(format, input);
  if (!result.success) return result;
  try {
    const output = new TextDecoder('utf-8', { fatal: true }).decode(
      result.bytes,
    );
    return { success: true, output };
  } catch {
    return { success: false, error: { kind: 'invalid-utf8' } };
  }
}
