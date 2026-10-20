export interface PassphraseOptions {
  /** 単語数（MIN_WORD_COUNT〜MAX_WORD_COUNT） */
  wordCount: number;
  /** 単語間の区切り文字（空文字可） */
  separator?: string;
  /** 各単語の先頭を大文字にする */
  capitalize?: boolean;
  /** ランダムな1語の末尾に数字1桁（0-9）を付加する */
  appendNumber?: boolean;
}

export type PassphraseStrength = 'weak' | 'fair' | 'strong' | 'very-strong';

export interface PassphraseStrengthResult {
  entropyBits: number;
  strength: PassphraseStrength;
}

export const MIN_WORD_COUNT = 3;
export const MAX_WORD_COUNT = 12;
export const DEFAULT_WORD_COUNT = 6;
export const MIN_COUNT = 1;
export const MAX_COUNT = 50;
export const MAX_SEPARATOR_LENGTH = 5;

export class EmptyWordlistError extends Error {}

export function clampWordCount(value: number): number {
  if (!Number.isFinite(value)) return DEFAULT_WORD_COUNT;
  return Math.min(Math.max(Math.trunc(value), MIN_WORD_COUNT), MAX_WORD_COUNT);
}

export function clampPassphraseCount(value: number): number {
  if (!Number.isFinite(value)) return MIN_COUNT;
  return Math.min(Math.max(Math.trunc(value), MIN_COUNT), MAX_COUNT);
}

/** 区切り文字を最大長に切り詰め、改行・制御文字は取り除く */
export function sanitizeSeparator(separator: string): string {
  // eslint-disable-next-line no-control-regex
  return Array.from(separator.replace(/[\u0000-\u001f\u007f]/g, ''))
    .slice(0, MAX_SEPARATOR_LENGTH)
    .join('');
}

/**
 * 0以上max未満の一様乱数を返す（棄却サンプリングで剰余バイアスを避ける）。
 * maxは1以上2^32以下の整数。
 */
export function randomInt(max: number): number {
  if (!Number.isInteger(max) || max < 1 || max > 0x100000000) {
    throw new RangeError('max must be an integer between 1 and 2^32');
  }
  if (max === 1) return 0;
  // maxの倍数のうち2^32以下で最大のものを上限とし、それ以上の値は捨てる
  const limit = Math.floor(0x100000000 / max) * max;
  const buffer = new Uint32Array(1);
  for (;;) {
    crypto.getRandomValues(buffer);
    const value = buffer[0];
    if (value < limit) return value % max;
  }
}

function capitalizeWord(word: string): string {
  return word.charAt(0).toUpperCase() + word.slice(1);
}

/** パスフレーズを1件生成する */
export function generatePassphrase(
  wordlist: readonly string[],
  options: PassphraseOptions,
): string {
  if (wordlist.length === 0) {
    throw new EmptyWordlistError('Word list is empty');
  }
  const count = clampWordCount(options.wordCount);
  const words: string[] = [];
  for (let i = 0; i < count; i++) {
    const word = wordlist[randomInt(wordlist.length)];
    words.push(options.capitalize ? capitalizeWord(word) : word);
  }
  if (options.appendNumber) {
    const index = randomInt(count);
    words[index] += String(randomInt(10));
  }
  return words.join(sanitizeSeparator(options.separator ?? ''));
}

/** パスフレーズを指定した個数（1〜50）まとめて生成する */
export function generatePassphrases(
  wordlist: readonly string[],
  options: PassphraseOptions & { count: number },
): string[] {
  const count = clampPassphraseCount(options.count);
  return Array.from({ length: count }, () =>
    generatePassphrase(wordlist, options),
  );
}

/**
 * 設定から理論上のエントロピー（ビット）を求める。
 * 単語ごとにlog2(語数)、数字付加は付加先の単語(log2(単語数))と数字(log2(10))を加算する。
 * 大文字化・区切り文字は固定規則のためエントロピーに加算しない。
 */
export function calculatePassphraseEntropy(
  wordlistSize: number,
  options: Pick<PassphraseOptions, 'wordCount' | 'appendNumber'>,
): number {
  if (wordlistSize < 1) return 0;
  const count = clampWordCount(options.wordCount);
  let bits = count * Math.log2(wordlistSize);
  if (options.appendNumber) {
    bits += Math.log2(count) + Math.log2(10);
  }
  return bits;
}

export function evaluatePassphraseStrength(
  entropyBits: number,
): PassphraseStrength {
  if (entropyBits < 40) return 'weak';
  if (entropyBits < 64) return 'fair';
  if (entropyBits < 90) return 'strong';
  return 'very-strong';
}

export function evaluatePassphrase(
  wordlistSize: number,
  options: Pick<PassphraseOptions, 'wordCount' | 'appendNumber'>,
): PassphraseStrengthResult {
  const entropyBits = calculatePassphraseEntropy(wordlistSize, options);
  return { entropyBits, strength: evaluatePassphraseStrength(entropyBits) };
}
