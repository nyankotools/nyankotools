export type MorseCodeType = 'international' | 'wabun';
/** ascii: `.` `-` / fullwidth: `・` `－` */
export type MorseSymbolStyle = 'ascii' | 'fullwidth';
/** slash: ` / ` / space: 半角スペース3つ */
export type WordSeparator = 'slash' | 'space';

/** 変換できない文字・符号を置き換える印 */
export const UNKNOWN_MARK = '□';

export interface EncodeOptions {
  code: MorseCodeType;
  wordSeparator: WordSeparator;
}

export interface EncodeResult {
  /** `.` と `-` で表したモールス符号（文字間は半角スペース1つ、単語間は区切り記号） */
  morse: string;
  /** 変換できなかった文字（重複なし・出現順） */
  unsupported: string[];
}

export interface DecodeResult {
  text: string;
  /** 解読できなかった符号（重複なし・出現順） */
  unknown: string[];
}

function pairs(source: string): [string, string][] {
  const tokens = source.split(' ').filter(Boolean);
  const result: [string, string][] = [];
  for (let i = 0; i < tokens.length; i += 2) {
    result.push([tokens[i], tokens[i + 1]]);
  }
  return result;
}

function buildTable(source: string): Record<string, string> {
  const table: Record<string, string> = {};
  for (const [char, code] of pairs(source)) table[char] = code;
  return table;
}

/** 符号 → 文字。重複する符号は先に書いたものを優先する */
function reverseTable(table: Record<string, string>): Record<string, string> {
  const reversed: Record<string, string> = {};
  for (const [char, code] of Object.entries(table)) {
    if (!(code in reversed)) reversed[code] = char;
  }
  return reversed;
}

const DIGITS =
  '0 ----- 1 .---- 2 ..--- 3 ...-- 4 ....- 5 ..... 6 -.... 7 --... 8 ---.. 9 ----.';

/** 欧文モールス（ITU）: 英字・数字・主な約物 */
const INTERNATIONAL_TABLE = buildTable(
  'A .- B -... C -.-. D -.. E . F ..-. G --. H .... I .. J .--- K -.- L .-.. ' +
    'M -- N -. O --- P .--. Q --.- R .-. S ... T - U ..- V ...- W .-- X -..- ' +
    'Y -.-- Z --.. ' +
    DIGITS +
    " . .-.-.- , --..-- ? ..--.. ' .----. ! -.-.-- / -..-. ( -.--. ) -.--.- " +
    '& .-... : ---... ; -.-.-. = -...- + .-.-. - -....- _ ..--.- " .-..-. ' +
    '$ ...-..- @ .--.-.',
);

const DAKUTEN = '゛';
const HANDAKUTEN = '゜';
const COMBINING_DAKUTEN = '゙';
const COMBINING_HANDAKUTEN = '゚';

/** 和文モールス: カタカナ・濁点・半濁点・長音・句読点・括弧、数字 */
const WABUN_TABLE = buildTable(
  'ア --.-- イ .- ウ ..- エ -.--- オ .-... ' +
    'カ .-.. キ -.-.. ク ...- ケ -.-- コ ---- ' +
    'サ -.-.- シ --.-. ス ---.- セ .---. ソ ---. ' +
    'タ -. チ ..-. ツ .--. テ .-.-- ト ..-.. ' +
    'ナ .-. ニ -.-. ヌ .... ネ --.- ノ ..-- ' +
    'ハ -... ヒ --..- フ --.. ヘ . ホ -.. ' +
    'マ -..- ミ ..-.- ム - メ -...- モ -..-. ' +
    'ヤ .-- ユ -..-- ヨ -- ' +
    'ラ ... リ --. ル -.--. レ --- ロ .-.- ' +
    'ワ -.- ヰ .-..- ヱ .--.. ヲ .--- ン .-.-. ' +
    `${DAKUTEN} .. ${HANDAKUTEN} ..--. ${COMBINING_DAKUTEN} .. ${COMBINING_HANDAKUTEN} ..--. ` +
    'ー .--.- - .--.- 、 .-.-.- , .-.-.- 。 .-.-.. . .-.-.. ' +
    '( -.--.- ) .-..-. ' +
    DIGITS,
);

const INTERNATIONAL_REVERSE = reverseTable(INTERNATIONAL_TABLE);
const WABUN_REVERSE = reverseTable(WABUN_TABLE);

const SMALL_KANA: Record<string, string> = {
  ァ: 'ア',
  ィ: 'イ',
  ゥ: 'ウ',
  ェ: 'エ',
  ォ: 'オ',
  ッ: 'ツ',
  ャ: 'ヤ',
  ュ: 'ユ',
  ョ: 'ヨ',
  ヮ: 'ワ',
  ヵ: 'カ',
  ヶ: 'ケ',
};

function hiraganaToKatakana(text: string): string {
  let result = '';
  for (const ch of text) {
    const code = ch.charCodeAt(0);
    result +=
      ch.length === 1 && code >= 0x3041 && code <= 0x3096
        ? String.fromCharCode(code + 0x60)
        : ch;
  }
  return result;
}

/** 和文用の正規化。全角/半角・ひらがな・濁点付き文字・小書き文字を、表にある文字へ寄せる */
function normalizeWabun(text: string): string {
  const protectedMarks = text
    .replace(new RegExp(DAKUTEN, 'g'), COMBINING_DAKUTEN)
    .replace(new RegExp(HANDAKUTEN, 'g'), COMBINING_HANDAKUTEN);
  return hiraganaToKatakana(protectedMarks.normalize('NFKC'))
    .normalize('NFD')
    .replace(/[ァィゥェォッャュョヮヵヶ]/g, (c) => SMALL_KANA[c] ?? c);
}

function pushUnique(list: string[], value: string) {
  if (!list.includes(value)) list.push(value);
}

/** 文字列をモールス符号にする。変換できない文字は `□` にして `unsupported` に集める */
export function encodeMorse(
  text: string,
  options: EncodeOptions,
): EncodeResult {
  const wabun = options.code === 'wabun';
  const table = wabun ? WABUN_TABLE : INTERNATIONAL_TABLE;
  const separator = options.wordSeparator === 'space' ? '   ' : ' / ';
  const unsupported: string[] = [];

  const normalized = wabun ? normalizeWabun(text) : text.normalize('NFKC');
  const lines = normalized.split(/\r\n|\r|\n/).map((line) => {
    const words = line.split(/\s+/).filter(Boolean);
    return words
      .map((word) => {
        const codes: string[] = [];
        for (const ch of word) {
          const key = wabun ? ch : ch.toUpperCase();
          const code = key.length === ch.length ? table[key] : undefined;
          if (code === undefined) {
            codes.push(UNKNOWN_MARK);
            pushUnique(unsupported, ch);
          } else {
            codes.push(code);
          }
        }
        return codes.join(' ');
      })
      .join(separator);
  });
  return { morse: lines.join('\n'), unsupported };
}

const DOT_CHARS = /[・･·•．]/g;
const DASH_CHARS = /[－−‐‑–—―ーｰ_]/g;

/** 全角の「・」「－」などを `.` `-` にそろえる */
export function normalizeMorseSymbols(input: string): string {
  return input.replace(DOT_CHARS, '.').replace(DASH_CHARS, '-');
}

/** 1行を単語（符号の並び）に分ける。区切りは `/`・`|` または2つ以上の空白 */
function splitWords(line: string): string[] {
  return line
    .trim()
    .split(/\s*[/／|｜]\s*|\s{2,}/)
    .map((w) => w.trim())
    .filter(Boolean);
}

function letterTokens(word: string): string[] {
  return word.split(/\s+/).filter(Boolean);
}

function composeMark(previous: string, mark: string): string | null {
  const combining = mark === DAKUTEN ? COMBINING_DAKUTEN : COMBINING_HANDAKUTEN;
  const composed = (previous + combining).normalize('NFC');
  return composed.length === 1 && composed !== previous ? composed : null;
}

/** モールス符号を文字に戻す。解読できない符号は `□` にして `unknown` に集める */
export function decodeMorse(input: string, code: MorseCodeType): DecodeResult {
  const wabun = code === 'wabun';
  const reverse = wabun ? WABUN_REVERSE : INTERNATIONAL_REVERSE;
  const unknown: string[] = [];

  const lines = normalizeMorseSymbols(input)
    .split(/\r\n|\r|\n/)
    .map((line) =>
      splitWords(line)
        .map((word) => {
          const chars: string[] = [];
          for (const token of letterTokens(word)) {
            const char = /^[.-]+$/.test(token) ? reverse[token] : undefined;
            if (char === undefined) {
              chars.push(UNKNOWN_MARK);
              pushUnique(unknown, token);
              continue;
            }
            if (wabun && (char === DAKUTEN || char === HANDAKUTEN)) {
              const last = chars[chars.length - 1];
              const composed =
                last !== undefined && last.length === 1
                  ? composeMark(last, char)
                  : null;
              if (composed !== null) chars[chars.length - 1] = composed;
              else chars.push(char);
              continue;
            }
            chars.push(char);
          }
          return chars.join('');
        })
        .join(' '),
    );
  return { text: lines.join('\n'), unknown };
}

/** 出力用に `.` `-` を全角の「・」「－」へ置き換える */
export function formatMorse(morse: string, style: MorseSymbolStyle): string {
  if (style === 'ascii') return morse;
  return morse.replace(/\./g, '・').replace(/-/g, '－');
}

// ---------------------------------------------------------------------------
// 再生（音・光）
// ---------------------------------------------------------------------------

export const MIN_WPM = 5;
export const MAX_WPM = 40;
export const DEFAULT_WPM = 15;
/** 光で再生するときの速度の上限。連続する短点でも点滅が毎秒3回以下になる値 */
export const LIGHT_MAX_WPM = 7;
export const MIN_FREQUENCY = 300;
export const MAX_FREQUENCY = 1000;
export const DEFAULT_FREQUENCY = 600;

export interface MorseSegment {
  on: boolean;
  /** 単位長（短点1つ分）の何個分か */
  units: number;
}

function clamp(value: number, min: number, max: number, fallback: number) {
  if (!Number.isFinite(value)) return fallback;
  return Math.min(max, Math.max(min, Math.round(value)));
}

export function clampWpm(value: number): number {
  return clamp(value, MIN_WPM, MAX_WPM, DEFAULT_WPM);
}

export function clampFrequency(value: number): number {
  return clamp(value, MIN_FREQUENCY, MAX_FREQUENCY, DEFAULT_FREQUENCY);
}

/** 光を使う場合は速度を上限までに抑える */
export function effectiveWpm(wpm: number, withLight: boolean): number {
  const clamped = clampWpm(wpm);
  return withLight ? Math.min(clamped, LIGHT_MAX_WPM) : clamped;
}

/** 短点1つ分の長さ（秒）。標準の「PARIS」基準で 1200ms ÷ WPM */
export function unitSeconds(wpm: number): number {
  return 1.2 / clampWpm(wpm);
}

/** 短点が連続したときの、1秒あたりの点滅回数 */
export function maxFlashesPerSecond(wpm: number): number {
  return 1 / (2 * unitSeconds(wpm));
}

/**
 * モールス符号（`.` `-`、全角表記も可）から、点灯/消灯の区間を作る。
 * 短点1・長点3・符号内の間1・文字間3・単語間7（単位長）。解読できない符号（□ など）は無視する。
 */
export function buildTimeline(morse: string): MorseSegment[] {
  const words = normalizeMorseSymbols(morse)
    .split(/\r\n|\r|\n/)
    .flatMap(splitWords);
  const segments: MorseSegment[] = [];
  let pendingGap = 0;
  const addOn = (units: number) => {
    if (segments.length > 0 && pendingGap > 0) {
      segments.push({ on: false, units: pendingGap });
    }
    segments.push({ on: true, units });
    pendingGap = 0;
  };
  let firstWord = true;
  for (const word of words) {
    const letters = letterTokens(word).filter((t) => /^[.-]+$/.test(t));
    if (letters.length === 0) continue;
    if (!firstWord) pendingGap = 7;
    firstWord = false;
    letters.forEach((letter, letterIndex) => {
      if (letterIndex > 0) pendingGap = 3;
      for (const [symbolIndex, symbol] of Array.from(letter).entries()) {
        if (symbolIndex > 0) pendingGap = 1;
        addOn(symbol === '.' ? 1 : 3);
      }
    });
  }
  return segments;
}

/** 区間全体の長さ（秒） */
export function timelineSeconds(segments: MorseSegment[], wpm: number): number {
  const units = segments.reduce((sum, s) => sum + s.units, 0);
  return units * unitSeconds(wpm);
}
