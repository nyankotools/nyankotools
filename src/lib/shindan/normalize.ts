import { cyrb53 } from './hash';

/** variant の最大値（12bit） */
export const VARIANT_MAX = 4095;

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
