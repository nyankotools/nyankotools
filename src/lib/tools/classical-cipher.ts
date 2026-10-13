/** 古典暗号（シーザー・ROT13・ROT47・ヴィジュネル・アトバシュ）の変換ロジック */

export type CipherMethod = 'caesar' | 'rot13' | 'rot47' | 'vigenere' | 'atbash';

export type CipherDirection = 'encrypt' | 'decrypt';

export const CIPHER_METHODS: readonly CipherMethod[] = [
  'caesar',
  'rot13',
  'rot47',
  'vigenere',
  'atbash',
];

export type CipherResult =
  { success: true; output: string } | { success: false; error: 'empty-key' };

/** 総当たり表示で処理する入力の最大文字数 */
export const BRUTE_FORCE_LIMIT = 1000;

const A = 65;
const a = 97;

/** 整数に丸めて 0〜25 に正規化する（負数・26以上・NaN も許容） */
export function normalizeShift(shift: number): number {
  if (!Number.isFinite(shift)) return 0;
  return ((Math.trunc(shift) % 26) + 26) % 26;
}

/** 英字（A-Z / a-z）だけを shift 文字ずらす。それ以外はそのまま通す */
function shiftLetter(code: number, shift: number): number {
  if (code >= A && code <= A + 25) return A + ((code - A + shift) % 26);
  if (code >= a && code <= a + 25) return a + ((code - a + shift) % 26);
  return code;
}

/** シーザー暗号。shift は暗号化時に進める文字数（復号時は逆方向） */
export function caesar(
  text: string,
  shift: number,
  direction: CipherDirection = 'encrypt',
): string {
  const n = normalizeShift(shift);
  const s = direction === 'encrypt' ? n : (26 - n) % 26;
  let out = '';
  for (const ch of text) {
    const code = ch.codePointAt(0)!;
    out += String.fromCodePoint(shiftLetter(code, s));
  }
  return out;
}

/** ROT13（暗号化と復号は同じ操作） */
export function rot13(text: string): string {
  return caesar(text, 13, 'encrypt');
}

/** ROT47（ASCIIの印字可能文字 33〜126 を47ずらす。暗号化と復号は同じ操作） */
export function rot47(text: string): string {
  let out = '';
  for (const ch of text) {
    const code = ch.codePointAt(0)!;
    out +=
      code >= 33 && code <= 126
        ? String.fromCodePoint(33 + ((code - 33 + 47) % 94))
        : ch;
  }
  return out;
}

/** アトバシュ暗号（A↔Z, B↔Y ...。暗号化と復号は同じ操作） */
export function atbash(text: string): string {
  let out = '';
  for (const ch of text) {
    const code = ch.codePointAt(0)!;
    if (code >= A && code <= A + 25)
      out += String.fromCharCode(A + 25 - (code - A));
    else if (code >= a && code <= a + 25)
      out += String.fromCharCode(a + 25 - (code - a));
    else out += ch;
  }
  return out;
}

/** ヴィジュネル暗号の鍵として使える文字（A-Z、大文字化）だけを取り出す */
export function normalizeVigenereKey(key: string): string {
  return key.replace(/[^A-Za-z]/g, '').toUpperCase();
}

/** ヴィジュネル暗号。鍵は英字以外の文字では進まない。鍵に英字が無ければエラー */
export function vigenere(
  text: string,
  key: string,
  direction: CipherDirection = 'encrypt',
): CipherResult {
  const k = normalizeVigenereKey(key);
  if (k.length === 0) return { success: false, error: 'empty-key' };
  let index = 0;
  let out = '';
  for (const ch of text) {
    const code = ch.codePointAt(0)!;
    const isLetter =
      (code >= A && code <= A + 25) || (code >= a && code <= a + 25);
    if (!isLetter) {
      out += ch;
      continue;
    }
    const keyShift = k.charCodeAt(index % k.length) - A;
    index++;
    const s = direction === 'encrypt' ? keyShift : (26 - keyShift) % 26;
    out += String.fromCharCode(shiftLetter(code, s));
  }
  return { success: true, output: out };
}

export interface CipherOptions {
  shift?: number;
  key?: string;
}

/** 方式を指定して変換する */
export function transform(
  method: CipherMethod,
  direction: CipherDirection,
  text: string,
  options: CipherOptions = {},
): CipherResult {
  switch (method) {
    case 'caesar':
      return {
        success: true,
        output: caesar(text, options.shift ?? 0, direction),
      };
    case 'rot13':
      return { success: true, output: rot13(text) };
    case 'rot47':
      return { success: true, output: rot47(text) };
    case 'atbash':
      return { success: true, output: atbash(text) };
    case 'vigenere':
      return vigenere(text, options.key ?? '', direction);
  }
}

export interface BruteForceRow {
  /** 復号時に戻したシフト数（1〜25） */
  shift: number;
  text: string;
}

/** シーザー暗号の総当たり。入力を shift = 1〜25 で復号した結果を返す */
export function caesarBruteForce(
  text: string,
  limit: number = BRUTE_FORCE_LIMIT,
): { rows: BruteForceRow[]; truncated: boolean } {
  const chars = Array.from(text);
  const truncated = chars.length > limit;
  const target = truncated ? chars.slice(0, limit).join('') : text;
  const rows: BruteForceRow[] = [];
  for (let shift = 1; shift <= 25; shift++) {
    rows.push({ shift, text: caesar(target, shift, 'decrypt') });
  }
  return { rows, truncated };
}
