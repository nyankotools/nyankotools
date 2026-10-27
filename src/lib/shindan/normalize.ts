import { cyrb53 } from './hash';

/** variant の最大値（12bit） */
export const VARIANT_MAX = 4095;

/** 名前の最大文字数（見た目の1文字 = 書記素で数える） */
export const NAME_MAX_LENGTH = 30;

/**
 * 見た目の文字数（書記素）で max 文字に切り詰める。
 * maxlength 属性は UTF-16 単位で数えるため、絵文字や結合文字が少ない文字数で打ち止めになるのを避ける。
 */
export function truncateGraphemes(text: string, max: number): string {
  const segments = [
    ...new Intl.Segmenter(undefined, { granularity: 'grapheme' }).segment(text),
  ];
  if (segments.length <= max) return text;
  return segments
    .slice(0, max)
    .map((s) => s.segment)
    .join('');
}

/**
 * 名前の表記ゆれを吸収する（NFKC・小文字化・空白と見えない文字の除去）。
 * 見えない文字は Default_Ignorable_Code_Point（ゼロ幅文字・方向制御・ソフトハイフン・異体字セレクタ等）。
 */
export function normalizeName(name: string): string {
  return name
    .normalize('NFKC')
    .toLowerCase()
    .replace(/[\s\p{Default_Ignorable_Code_Point}]/gu, '');
}

/**
 * 名前から 0〜4095 の variant を作る（名前なしは 0）。
 * 12bit に絞るのは、URL に入った値から名前を逆算できないようにするため（16.4）。
 */
export function nameVariant(name: string): number {
  const normalized = normalizeName(name);
  if (normalized === '') return 0;
  return (cyrb53(normalized) % VARIANT_MAX) + 1;
}
