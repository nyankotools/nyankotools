import { kanaToRomaji } from './romaji-kana-converter';

export type SlugSeparator = '-' | '_';
/** 漢字の扱い。keep: そのまま残す / remove: 取り除く */
export type KanjiMode = 'keep' | 'remove';

export interface SlugOptions {
  separator: SlugSeparator;
  /** ひらがな・カタカナをヘボン式ローマ字にする。false の場合、かなは取り除く */
  convertKana: boolean;
  kanji: KanjiMode;
  /** 最大文字数。0 以下は無制限 */
  maxLength: number;
  /** 最大文字数で切るとき、単語の途中ではなく直前の区切りで切る */
  cutAtWord: boolean;
}

export const DEFAULT_SLUG_OPTIONS: SlugOptions = {
  separator: '-',
  convertKana: true,
  kanji: 'remove',
  maxLength: 0,
  cutAtWord: true,
};

function trimSeparator(text: string, separator: string): string {
  let start = 0;
  let end = text.length;
  while (start < end && text[start] === separator) start++;
  while (end > start && text[end - 1] === separator) end--;
  return text.slice(start, end);
}

/** スラッグを最大文字数に収める。 */
export function truncateSlug(
  slug: string,
  maxLength: number,
  separator: string,
  cutAtWord: boolean,
): string {
  if (!Number.isFinite(maxLength) || maxLength <= 0) return slug;
  const chars = Array.from(slug);
  if (chars.length <= maxLength) return slug;
  let cut = chars.slice(0, maxLength);
  if (cutAtWord && chars[maxLength] !== separator) {
    const last = cut.lastIndexOf(separator);
    if (last > 0) cut = cut.slice(0, last);
  }
  return trimSeparator(cut.join(''), separator);
}

/** 1 行の文字列からスラッグを作る。 */
export function generateSlug(
  input: string,
  options: Partial<SlugOptions> = {},
): string {
  const opt = { ...DEFAULT_SLUG_OPTIONS, ...options };
  let text = input.normalize('NFKC');

  if (opt.convertKana) {
    text = kanaToRomaji(text, {
      style: 'hepburn',
      longVowel: 'omit',
      letterCase: 'lower',
    });
  }

  // アクセント付きラテン文字（é → e）の記号部分を取り除く
  text = text
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
    .normalize('NFC')
    .toLowerCase()
    // アポストロフィは区切らずに詰める（don't → dont）
    .replace(/['’]/g, '');

  const allowed = opt.kanji === 'keep' ? 'a-z0-9\\p{Script=Han}々〆' : 'a-z0-9';
  const sep = opt.separator;
  const pattern = new RegExp(`[^${allowed}]+`, 'gu');
  const joined = trimSeparator(text.replace(pattern, sep), sep);
  return truncateSlug(joined, opt.maxLength, sep, opt.cutAtWord);
}

/** 複数行の入力を行ごとにスラッグ化する（空行は空行のまま）。 */
export function generateSlugs(
  input: string,
  options: Partial<SlugOptions> = {},
): string[] {
  return input.split(/\r\n|\r|\n/).map((line) => generateSlug(line, options));
}
