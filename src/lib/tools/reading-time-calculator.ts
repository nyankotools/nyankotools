export const DEFAULT_JA_CHARS_PER_MIN = 500;
export const DEFAULT_EN_WORDS_PER_MIN = 230;
/** 話す速さの目安（日本語: 1分あたり約300字、英語: 1分あたり約130語） */
export const SPEAKING_JA_CHARS_PER_MIN = 300;
export const SPEAKING_EN_WORDS_PER_MIN = 130;
/** 原稿用紙は1行20字 */
export const MANUSCRIPT_COLUMNS = 20;

export type ManuscriptSize = 400 | 200;

export interface ReadingOptions {
  jaCharsPerMin: number;
  enWordsPerMin: number;
  manuscriptSize: ManuscriptSize;
  /** true: 改行ごとに行頭から書き始める（原稿用紙の実際の書き方） */
  respectLineBreaks: boolean;
}

export interface ReadingResult {
  /** 空白・改行を除いた文字数 */
  nonSpaceChars: number;
  /** 日本語（かな・漢字・全角記号）の文字数 */
  jaChars: number;
  /** 英数字の単語数 */
  enWords: number;
  readingSeconds: number;
  speakingSeconds: number;
  /** 原稿用紙に必要な行数 */
  manuscriptRows: number;
  /** 原稿用紙の枚数（小数） */
  manuscriptSheets: number;
  /** 原稿用紙の枚数（切り上げ） */
  manuscriptSheetsCeil: number;
}

const EN_WORD =
  /[A-Za-z0-9\u00C0-\u024F]+(?:['\u2019-][A-Za-z0-9\u00C0-\u024F]+)*/g;
const JA_CHAR =
  /[\u3001-\u9FFF\uF900-\uFAFF\uFF00-\uFFEF]|[\u{20000}-\u{2FFFF}]/gu;

function positiveOr(value: number, fallback: number): number {
  return Number.isFinite(value) && value > 0 ? value : fallback;
}

function codePointLength(text: string): number {
  return Array.from(text).length;
}

export function calculateReading(
  text: string,
  options: ReadingOptions,
): ReadingResult {
  const jaRate = positiveOr(options.jaCharsPerMin, DEFAULT_JA_CHARS_PER_MIN);
  const enRate = positiveOr(options.enWordsPerMin, DEFAULT_EN_WORDS_PER_MIN);

  const enWords = (text.match(EN_WORD) ?? []).length;
  const jaChars = (text.replace(EN_WORD, ' ').match(JA_CHAR) ?? []).length;
  const nonSpaceChars = codePointLength(text.replace(/\s/g, ''));

  const readingSeconds = (jaChars / jaRate + enWords / enRate) * 60;
  const speakingSeconds =
    (jaChars / SPEAKING_JA_CHARS_PER_MIN +
      enWords / SPEAKING_EN_WORDS_PER_MIN) *
    60;

  const trimmed = text.replace(/(?:\r\n|\r|\n)+$/, '');
  let manuscriptRows = 0;
  if (trimmed !== '') {
    if (options.respectLineBreaks) {
      for (const line of trimmed.split(/\r\n|\r|\n/)) {
        manuscriptRows += Math.max(
          1,
          Math.ceil(codePointLength(line) / MANUSCRIPT_COLUMNS),
        );
      }
    } else {
      const chars = codePointLength(trimmed.replace(/\r\n|\r|\n/g, ''));
      manuscriptRows = Math.ceil(chars / MANUSCRIPT_COLUMNS);
    }
  }
  const rowsPerSheet = options.manuscriptSize / MANUSCRIPT_COLUMNS;
  const manuscriptSheets = manuscriptRows / rowsPerSheet;

  return {
    nonSpaceChars,
    jaChars,
    enWords,
    readingSeconds,
    speakingSeconds,
    manuscriptRows,
    manuscriptSheets,
    manuscriptSheetsCeil: Math.ceil(manuscriptSheets),
  };
}

/** 秒数を四捨五入して「分」「秒」に分ける（60秒は分に繰り上がる） */
export function splitSeconds(seconds: number): {
  minutes: number;
  seconds: number;
} {
  const total = Math.round(Math.max(0, seconds));
  return { minutes: Math.floor(total / 60), seconds: total % 60 };
}
