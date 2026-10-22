export type OcrLanguage = 'jpn' | 'eng' | 'jpn+eng';

export const OCR_LANGUAGES: readonly OcrLanguage[] = ['jpn', 'eng', 'jpn+eng'];

/** 読み込める画像の最大サイズ（バイト）。巨大な画像でタブのメモリを使い切らないための上限 */
export const MAX_OCR_FILE_SIZE = 20 * 1024 * 1024;

export type OcrFileError = 'notImage' | 'tooLarge';

export type OcrConfidenceLevel = 'high' | 'medium' | 'low';

/** 言語指定を Tesseract に渡す言語コードの配列にする（'jpn+eng' → ['jpn', 'eng']） */
export function languageCodes(language: OcrLanguage): string[] {
  return language.split('+');
}

export function isOcrLanguage(value: string): value is OcrLanguage {
  return (OCR_LANGUAGES as readonly string[]).includes(value);
}

/** 選択されたファイルが処理対象かを検査する。問題がなければ null */
export function validateOcrFile(file: {
  type: string;
  size: number;
}): OcrFileError | null {
  if (!file.type.startsWith('image/')) return 'notImage';
  if (file.size > MAX_OCR_FILE_SIZE) return 'tooLarge';
  return null;
}

// ひらがな・カタカナ・漢字・全角記号・全角英数（日本語の文字間に入った空白の除去対象）
const CJK = '\u3000-\u303f\u3040-\u30ff\u3400-\u4dbf\u4e00-\u9fff\uff00-\uffef';
const CJK_GAP = new RegExp(`([${CJK}])[ \t]+(?=[${CJK}])`, 'g');

/**
 * Tesseract の出力を読みやすく整える。
 * - 改行を LF に統一し、行末の空白を除く
 * - 日本語を含むとき、日本語文字どうしの間に入った不要な空白を除く
 * - 3行以上連続する空行を1つの空行にまとめ、前後の空白を除く
 */
export function cleanOcrText(raw: string, language: OcrLanguage): string {
  let text = raw.replace(/\r\n?/g, '\n').replace(/[ \t]+$/gm, '');
  if (language !== 'eng') text = text.replace(CJK_GAP, '$1');
  return text.replace(/\n{3,}/g, '\n\n').trim();
}

/** 認識の信頼度（0〜100）を3段階に分ける。画面の注意表示の出し分けに使う */
export function confidenceLevel(confidence: number): OcrConfidenceLevel {
  if (confidence >= 80) return 'high';
  if (confidence >= 60) return 'medium';
  return 'low';
}
