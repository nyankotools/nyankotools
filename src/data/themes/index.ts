/**
 * 診断テーマの登録簿。/shindan/ の一覧と /shindan/<id>/ のページ生成に使う。
 * テーマの追加 = 構造データ（./<id>.ts）・文言（src/i18n/shindan/<id>.ts）・画像を用意してここに登録する。
 */
import type { ShindanThemeTexts } from '../../i18n/shindan/types';
import { nekoTextsJa } from '../../i18n/shindan/neko';
import type { ThemeSpec } from '../../lib/shindan/types';
import { nekoCatImages, nekoTheme, type CatImage } from './neko';

export type ShindanTheme = {
  spec: ThemeSpec;
  texts: { ja: ShindanThemeTexts };
  /** 結果タイプID → 画像 */
  images: Record<string, CatImage>;
};

export const shindanThemes: ShindanTheme[] = [
  { spec: nekoTheme, texts: { ja: nekoTextsJa }, images: nekoCatImages },
];
