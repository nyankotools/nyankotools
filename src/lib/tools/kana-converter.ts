export type KanaDirection = 'toKatakana' | 'toHiragana';

interface KanaRange {
  hiraganaStart: number;
  hiraganaEnd: number;
  katakanaStart: number;
  katakanaEnd: number;
}

const KANA_OFFSET = 0x60;

// ぁ-ゖ / ァ-ヶ（清音・濁音・半濁音・拗音・促音・「ゔ」「ヴ」を含む主要な範囲）
// ゝ-ゞ / ヽ-ヾ（踊り字）
const KANA_RANGES: KanaRange[] = [
  {
    hiraganaStart: 0x3041,
    hiraganaEnd: 0x3096,
    katakanaStart: 0x30a1,
    katakanaEnd: 0x30f6,
  },
  {
    hiraganaStart: 0x309d,
    hiraganaEnd: 0x309e,
    katakanaStart: 0x30fd,
    katakanaEnd: 0x30fe,
  },
];

function convertChar(ch: string, direction: KanaDirection): string {
  const code = ch.codePointAt(0);
  if (code === undefined) return ch;

  for (const range of KANA_RANGES) {
    if (
      direction === 'toKatakana' &&
      code >= range.hiraganaStart &&
      code <= range.hiraganaEnd
    ) {
      return String.fromCodePoint(code + KANA_OFFSET);
    }
    if (
      direction === 'toHiragana' &&
      code >= range.katakanaStart &&
      code <= range.katakanaEnd
    ) {
      return String.fromCodePoint(code - KANA_OFFSET);
    }
  }
  return ch;
}

export function convertKana(text: string, direction: KanaDirection): string {
  return [...text].map((ch) => convertChar(ch, direction)).join('');
}
