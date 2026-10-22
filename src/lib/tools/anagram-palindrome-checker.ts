export interface NormalizeOptions {
  /** NFKC正規化（全角英数→半角、半角カナ→全角カナなど） */
  nfkc: boolean;
  /** 大文字小文字を区別しない */
  ignoreCase: boolean;
  /** 空白（半角・全角・改行など）を無視する */
  ignoreSpaces: boolean;
  /** 記号・句読点を無視する */
  ignorePunctuation: boolean;
  /** カタカナをひらがなとして扱う */
  unifyKana: boolean;
  /** 長音符「ー」を無視する */
  ignoreLongVowel: boolean;
  /** 濁点・半濁点を無視する（が→か、ぱ→は） */
  ignoreDakuten: boolean;
}

export const defaultOptions: NormalizeOptions = {
  nfkc: true,
  ignoreCase: true,
  ignoreSpaces: true,
  ignorePunctuation: true,
  unifyKana: true,
  ignoreLongVowel: false,
  ignoreDakuten: false,
};

const SPACE_RE = /^[\p{White_Space}\u200B-\u200D\u2060\uFEFF]$/u;
const PUNCT_RE = /^[\p{P}\p{S}]$/u;

function isKatakana(cp: number): boolean {
  // ァ〜ヶ（ヷ〜ヺ は濁点付き合成済み。ひらがなに対応が無いので除外）
  return cp >= 0x30a1 && cp <= 0x30f6;
}

function isKana(cp: number): boolean {
  return (
    (cp >= 0x3041 && cp <= 0x3096) ||
    (cp >= 0x30a1 && cp <= 0x30fa) ||
    cp === 0x309d ||
    cp === 0x309e ||
    cp === 0x30fd ||
    cp === 0x30fe
  );
}

/** 文字列を正規化し、コードポイント単位の配列で返す */
export function normalizeChars(
  text: string,
  options: NormalizeOptions,
): string[] {
  let s = text;
  if (options.nfkc) s = s.normalize('NFKC');
  if (options.ignoreCase) s = s.toLowerCase();

  const out: string[] = [];
  for (const original of s) {
    let ch = original;
    let cp = ch.codePointAt(0)!;

    if (options.ignoreSpaces && SPACE_RE.test(ch)) continue;
    if (options.ignoreLongVowel && (cp === 0x30fc || cp === 0xff70)) continue;

    if (options.unifyKana && isKatakana(cp)) {
      ch = String.fromCodePoint(cp - 0x60);
      cp = ch.codePointAt(0)!;
    } else if (options.unifyKana && (cp === 0x30fd || cp === 0x30fe)) {
      ch = String.fromCodePoint(cp - 0x60);
      cp = ch.codePointAt(0)!;
    }

    if (options.ignoreDakuten) {
      if (cp === 0x3099 || cp === 0x309a || cp === 0x309b || cp === 0x309c)
        continue;
      if (isKana(cp)) {
        const base = [...ch.normalize('NFD')]
          .filter((c) => c !== '゙' && c !== '゚')
          .join('');
        if (base !== '') {
          ch = base;
          cp = ch.codePointAt(0)!;
        }
      }
    }

    // 記号判定は、長音符など言語的に意味のある文字を巻き込まないよう最後に行う
    if (
      options.ignorePunctuation &&
      PUNCT_RE.test(ch) &&
      cp !== 0x30fc &&
      cp !== 0xff70
    )
      continue;

    out.push(ch);
  }
  return out;
}

export interface CharCount {
  char: string;
  count: number;
}

export type AnagramStatus = 'empty' | 'anagram' | 'identical' | 'different';

export interface AnagramResult {
  status: AnagramStatus;
  /** 正規化後の文字列 */
  normalizedA: string;
  normalizedB: string;
  lengthA: number;
  lengthB: number;
  /** Aにだけ多く含まれる文字（過剰） */
  extraInA: CharCount[];
  /** Bにだけ多く含まれる文字（Aには不足） */
  extraInB: CharCount[];
}

function countChars(chars: string[]): Map<string, number> {
  const map = new Map<string, number>();
  for (const c of chars) map.set(c, (map.get(c) ?? 0) + 1);
  return map;
}

function diffCounts(
  from: Map<string, number>,
  to: Map<string, number>,
): CharCount[] {
  const result: CharCount[] = [];
  for (const [char, count] of from) {
    const diff = count - (to.get(char) ?? 0);
    if (diff > 0) result.push({ char, count: diff });
  }
  return result.sort(
    (a, b) =>
      b.count - a.count || (a.char < b.char ? -1 : a.char > b.char ? 1 : 0),
  );
}

export function checkAnagram(
  a: string,
  b: string,
  options: NormalizeOptions = defaultOptions,
): AnagramResult {
  const ca = normalizeChars(a, options);
  const cb = normalizeChars(b, options);
  const normalizedA = ca.join('');
  const normalizedB = cb.join('');
  const base = {
    normalizedA,
    normalizedB,
    lengthA: ca.length,
    lengthB: cb.length,
  };
  if (ca.length === 0 || cb.length === 0) {
    return { status: 'empty', ...base, extraInA: [], extraInB: [] };
  }
  const ma = countChars(ca);
  const mb = countChars(cb);
  const extraInA = diffCounts(ma, mb);
  const extraInB = diffCounts(mb, ma);
  let status: AnagramStatus;
  if (extraInA.length > 0 || extraInB.length > 0) status = 'different';
  else status = normalizedA === normalizedB ? 'identical' : 'anagram';
  return { status, ...base, extraInA, extraInB };
}

export type PalindromeStatus = 'empty' | 'palindrome' | 'not';

export interface PalindromeResult {
  status: PalindromeStatus;
  normalized: string;
  reversed: string;
  length: number;
}

export function checkPalindrome(
  text: string,
  options: NormalizeOptions = defaultOptions,
): PalindromeResult {
  const chars = normalizeChars(text, options);
  const normalized = chars.join('');
  const reversed = [...chars].reverse().join('');
  if (chars.length === 0) {
    return { status: 'empty', normalized, reversed, length: 0 };
  }
  return {
    status: normalized === reversed ? 'palindrome' : 'not',
    normalized,
    reversed,
    length: chars.length,
  };
}
