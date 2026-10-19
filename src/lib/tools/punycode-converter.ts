// Punycode (RFC 3492) と国際化ドメイン名（IDN）の相互変換。
// ブラウザ標準の URL / TextDecoder では取り出せないため自前実装する。

export type PunycodeErrorKind =
  | 'invalid-char'
  | 'invalid-input'
  | 'overflow'
  | 'label-too-long'
  | 'domain-too-long';

export interface PunycodeError {
  kind: PunycodeErrorKind;
  /** invalid-char のときの該当文字 */
  char?: string;
  /** invalid-char のときの、入力文字列（コードポイント単位）での位置（0始まり） */
  index?: number;
}

export type PunycodeOutcome =
  { success: true; output: string } | { success: false; error: PunycodeError };

const BASE = 36;
const T_MIN = 1;
const T_MAX = 26;
const SKEW = 38;
const DAMP = 700;
const INITIAL_BIAS = 72;
const INITIAL_N = 128;
const DELIMITER = '-';
const MAX_INT = 0x7fffffff;
const MAX_LABEL = 63;
const MAX_DOMAIN = 253;
const ACE_PREFIX = 'xn--';

class PunycodeFailure extends Error {
  constructor(public readonly detail: PunycodeError) {
    super(detail.kind);
  }
}

function adapt(delta: number, numPoints: number, first: boolean): number {
  delta = first ? Math.floor(delta / DAMP) : delta >> 1;
  delta += Math.floor(delta / numPoints);
  let k = 0;
  while (delta > ((BASE - T_MIN) * T_MAX) >> 1) {
    delta = Math.floor(delta / (BASE - T_MIN));
    k += BASE;
  }
  return k + Math.floor(((BASE - T_MIN + 1) * delta) / (delta + SKEW));
}

function digitToChar(d: number): string {
  // 0-25 -> a-z, 26-35 -> 0-9
  return String.fromCharCode(d < 26 ? d + 97 : d - 26 + 48);
}

function charToDigit(code: number): number {
  if (code >= 48 && code <= 57) return code - 48 + 26; // 0-9
  if (code >= 65 && code <= 90) return code - 65; // A-Z
  if (code >= 97 && code <= 122) return code - 97; // a-z
  return -1;
}

function threshold(k: number, bias: number): number {
  if (k <= bias) return T_MIN;
  if (k >= bias + T_MAX) return T_MAX;
  return k - bias;
}

function encodeCore(input: string): string {
  const codePoints = Array.from(input, (c) => c.codePointAt(0) as number);
  const lone = codePoints.findIndex((cp) => cp >= 0xd800 && cp <= 0xdfff);
  if (lone >= 0) {
    throw new PunycodeFailure({
      kind: 'invalid-char',
      char: '\\u' + codePoints[lone].toString(16).toUpperCase(),
      index: lone,
    });
  }
  let output = '';
  for (const cp of codePoints) {
    if (cp < 0x80) output += String.fromCharCode(cp);
  }
  const basicLength = output.length;
  let handled = basicLength;
  if (basicLength > 0) output += DELIMITER;

  let n = INITIAL_N;
  let delta = 0;
  let bias = INITIAL_BIAS;

  while (handled < codePoints.length) {
    let m = MAX_INT;
    for (const cp of codePoints) {
      if (cp >= n && cp < m) m = cp;
    }
    const increment = (m - n) * (handled + 1);
    if (increment > MAX_INT - delta) {
      throw new PunycodeFailure({ kind: 'overflow' });
    }
    delta += increment;
    n = m;

    for (const cp of codePoints) {
      if (cp < n) {
        delta++;
        if (delta > MAX_INT) throw new PunycodeFailure({ kind: 'overflow' });
      }
      if (cp === n) {
        let q = delta;
        for (let k = BASE; ; k += BASE) {
          const t = threshold(k, bias);
          if (q < t) break;
          output += digitToChar(t + ((q - t) % (BASE - t)));
          q = Math.floor((q - t) / (BASE - t));
        }
        output += digitToChar(q);
        bias = adapt(delta, handled + 1, handled === basicLength);
        delta = 0;
        handled++;
      }
    }
    delta++;
    n++;
  }
  return output;
}

function decodeCore(input: string): string {
  const chars = Array.from(input);
  const output: number[] = [];

  const delimiterIndex = chars.lastIndexOf(DELIMITER);
  const basicEnd = delimiterIndex < 0 ? 0 : delimiterIndex;
  for (let i = 0; i < basicEnd; i++) {
    const cp = chars[i].codePointAt(0) as number;
    if (cp >= 0x80) {
      throw new PunycodeFailure({
        kind: 'invalid-char',
        char: chars[i],
        index: i,
      });
    }
    output.push(cp);
  }

  let n = INITIAL_N;
  let i = 0;
  let bias = INITIAL_BIAS;

  let pos = delimiterIndex < 0 ? 0 : delimiterIndex + 1;
  while (pos < chars.length) {
    const oldi = i;
    let w = 1;
    for (let k = BASE; ; k += BASE) {
      if (pos >= chars.length) {
        throw new PunycodeFailure({ kind: 'invalid-input' });
      }
      const ch = chars[pos];
      const digit = charToDigit(ch.codePointAt(0) as number);
      if (digit < 0 || ch.length > 1) {
        throw new PunycodeFailure({
          kind: 'invalid-char',
          char: ch,
          index: pos,
        });
      }
      pos++;
      if (digit > Math.floor((MAX_INT - i) / w)) {
        throw new PunycodeFailure({ kind: 'overflow' });
      }
      i += digit * w;
      const t = threshold(k, bias);
      if (digit < t) break;
      if (w > Math.floor(MAX_INT / (BASE - t))) {
        throw new PunycodeFailure({ kind: 'overflow' });
      }
      w *= BASE - t;
    }
    const out = output.length + 1;
    bias = adapt(i - oldi, out, oldi === 0);
    if (Math.floor(i / out) > MAX_INT - n) {
      throw new PunycodeFailure({ kind: 'overflow' });
    }
    n += Math.floor(i / out);
    i %= out;
    if (n > 0x10ffff || (n >= 0xd800 && n <= 0xdfff)) {
      throw new PunycodeFailure({ kind: 'invalid-input' });
    }
    output.splice(i, 0, n);
    i++;
  }
  return output.map((cp) => String.fromCodePoint(cp)).join('');
}

function run(fn: () => string): PunycodeOutcome {
  try {
    return { success: true, output: fn() };
  } catch (e) {
    if (e instanceof PunycodeFailure)
      return { success: false, error: e.detail };
    throw e;
  }
}

/** 生のPunycode（RFC 3492）へ変換する。`xn--` は付かない。 */
export function encodePunycode(input: string): PunycodeOutcome {
  return run(() => encodeCore(input));
}

/** 生のPunycode（RFC 3492）を元の文字列へ戻す。`xn--` は付けない。 */
export function decodePunycode(input: string): PunycodeOutcome {
  return run(() => decodeCore(input.trim()));
}

const DOT_PATTERN = /[.。．｡]/;

function isAscii(s: string): boolean {
  for (let i = 0; i < s.length; i++) {
    if (s.charCodeAt(i) >= 0x80) return false;
  }
  return true;
}

/** ドメイン（またはホスト名）を、ラベル単位で `xn--` 付きのASCII形式にする。 */
export function domainToAscii(input: string): PunycodeOutcome {
  return run(() => {
    const labels = input.trim().split(DOT_PATTERN);
    const result = labels.map((label) => {
      if (isAscii(label)) return label;
      const normalized = label.normalize('NFKC').toLowerCase();
      const ascii = isAscii(normalized)
        ? normalized
        : ACE_PREFIX + encodeCore(normalized);
      if (ascii.length > MAX_LABEL) {
        throw new PunycodeFailure({ kind: 'label-too-long' });
      }
      return ascii;
    });
    const joined = result.join('.');
    if (joined.length > MAX_DOMAIN) {
      throw new PunycodeFailure({ kind: 'domain-too-long' });
    }
    return joined;
  });
}

/** `xn--` 付きのドメインを、ラベル単位で元の文字へ戻す。 */
function decodeAceLabel(body: string): string {
  if (body === '') throw new PunycodeFailure({ kind: 'invalid-input' });
  return decodeCore(body);
}

export function domainToUnicode(input: string): PunycodeOutcome {
  return run(() => {
    const labels = input.trim().split(DOT_PATTERN);
    return labels
      .map((label) =>
        label.toLowerCase().startsWith(ACE_PREFIX)
          ? decodeAceLabel(label.slice(ACE_PREFIX.length))
          : label,
      )
      .join('.');
  });
}
