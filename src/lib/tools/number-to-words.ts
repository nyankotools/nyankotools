export type NumberToWordsError = 'empty' | 'invalid' | 'tooLong';

export type CheckCurrency = 'dollars' | 'pounds' | 'euros';

export interface NumberToWordsOptions {
  /** 100の位の後などに and を入れる（英国式。101 → one hundred and one） */
  british: boolean;
  /** 小切手表記の通貨 */
  currency: CheckCurrency;
}

export interface NumberToWordsSuccess {
  ok: true;
  /** 正規化した数（カンマ除去・先頭ゼロ除去。例: -1234.50） */
  normalized: string;
  /** 英語の基数表記（one hundred twenty-three） */
  cardinal: string;
  /** 英語の序数表記（整数のみ。小数・負数は null） */
  ordinal: string | null;
  /** 序数の数字表記（21st。整数のみ） */
  ordinalDigits: string | null;
  /** 小切手表記（0以上で小数2桁以内のみ。それ以外は null） */
  check: string | null;
  /** ひらがなの日本語読み */
  reading: string;
}

export interface NumberToWordsFailure {
  ok: false;
  error: NumberToWordsError;
}

export type NumberToWordsResult = NumberToWordsSuccess | NumberToWordsFailure;

/** 整数部の最大桁数（英語は decillion=10^33 の位まで、日本語は 溝=10^32 の位まで） */
export const MAX_INT_DIGITS = 36;
/** 小数部の最大桁数 */
export const MAX_FRAC_DIGITS = 30;

const ONES = [
  'zero',
  'one',
  'two',
  'three',
  'four',
  'five',
  'six',
  'seven',
  'eight',
  'nine',
  'ten',
  'eleven',
  'twelve',
  'thirteen',
  'fourteen',
  'fifteen',
  'sixteen',
  'seventeen',
  'eighteen',
  'nineteen',
];
const TENS = [
  '',
  '',
  'twenty',
  'thirty',
  'forty',
  'fifty',
  'sixty',
  'seventy',
  'eighty',
  'ninety',
];
const SCALES = [
  '',
  'thousand',
  'million',
  'billion',
  'trillion',
  'quadrillion',
  'quintillion',
  'sextillion',
  'septillion',
  'octillion',
  'nonillion',
  'decillion',
];

/** 0〜99 */
function below100(n: number): string {
  if (n < 20) return ONES[n];
  const t = TENS[Math.floor(n / 10)];
  const o = n % 10;
  return o === 0 ? t : `${t}-${ONES[o]}`;
}

/** 1〜999 */
function below1000(n: number, british: boolean): string {
  const h = Math.floor(n / 100);
  const r = n % 100;
  const parts: string[] = [];
  if (h > 0) parts.push(`${ONES[h]} hundred`);
  if (r > 0) {
    if (h > 0 && british) parts.push('and');
    parts.push(below100(r));
  }
  return parts.join(' ');
}

/** 先頭ゼロなしの整数文字列 → 英語の基数 */
export function integerToEnglish(digits: string, british: boolean): string {
  if (digits === '0') return 'zero';
  const groups: number[] = [];
  for (let end = digits.length; end > 0; end -= 3) {
    groups.push(Number(digits.slice(Math.max(0, end - 3), end)));
  }
  const parts: string[] = [];
  for (let i = groups.length - 1; i >= 0; i--) {
    const g = groups[i];
    if (g === 0) continue;
    let words = below1000(g, british);
    // 英国式: 1,001 → one thousand and one（最下位が100未満で上位に値がある）
    if (british && i === 0 && g < 100 && parts.length > 0) {
      words = `and ${words}`;
    }
    parts.push(SCALES[i] ? `${words} ${SCALES[i]}` : words);
  }
  return parts.join(' ');
}

const ORDINAL_IRREGULAR: Record<string, string> = {
  one: 'first',
  two: 'second',
  three: 'third',
  five: 'fifth',
  eight: 'eighth',
  nine: 'ninth',
  twelve: 'twelfth',
};

/** 英語の基数表記 → 序数表記（最後の語を序数にする） */
export function cardinalToOrdinal(cardinal: string): string {
  const m = /^(.*?)([a-z]+)$/.exec(cardinal);
  if (!m) return cardinal;
  const [, head, last] = m;
  let ord: string;
  if (ORDINAL_IRREGULAR[last]) ord = ORDINAL_IRREGULAR[last];
  else if (last.endsWith('y')) ord = `${last.slice(0, -1)}ieth`;
  else ord = `${last}th`;
  return head + ord;
}

/** 21 → 21st, 112 → 112th */
export function ordinalSuffix(digits: string): string {
  const last2 = Number(digits.slice(-2));
  const last = last2 % 10;
  if (last2 >= 11 && last2 <= 13) return `${digits}th`;
  if (last === 1) return `${digits}st`;
  if (last === 2) return `${digits}nd`;
  if (last === 3) return `${digits}rd`;
  return `${digits}th`;
}

const KANA_DIGITS = [
  '',
  'いち',
  'に',
  'さん',
  'よん',
  'ご',
  'ろく',
  'なな',
  'はち',
  'きゅう',
];
const KANA_HUNDREDS = [
  '',
  'ひゃく',
  'にひゃく',
  'さんびゃく',
  'よんひゃく',
  'ごひゃく',
  'ろっぴゃく',
  'ななひゃく',
  'はっぴゃく',
  'きゅうひゃく',
];
const KANA_THOUSANDS = [
  '',
  'せん',
  'にせん',
  'さんぜん',
  'よんせん',
  'ごせん',
  'ろくせん',
  'ななせん',
  'はっせん',
  'きゅうせん',
];
const KANA_BIG_UNITS = [
  '',
  'まん',
  'おく',
  'ちょう',
  'けい',
  'がい',
  'じょ',
  'じょう',
  'こう',
];
const KANA_FRAC_DIGITS = [
  'れい',
  'いち',
  'に',
  'さん',
  'よん',
  'ご',
  'ろく',
  'なな',
  'はち',
  'きゅう',
];

/** 1〜9999 の読み */
function kanaBelow10000(n: number): string {
  const th = Math.floor(n / 1000);
  const h = Math.floor(n / 100) % 10;
  const t = Math.floor(n / 10) % 10;
  const o = n % 10;
  let tens = '';
  if (t === 1) tens = 'じゅう';
  else if (t > 1) tens = `${KANA_DIGITS[t]}じゅう`;
  return KANA_THOUSANDS[th] + KANA_HUNDREDS[h] + tens + KANA_DIGITS[o];
}

/** 先頭ゼロなしの整数文字列 → ひらがな読み */
export function integerToKana(digits: string): string {
  if (digits === '0') return 'ぜろ';
  const groups: number[] = [];
  for (let end = digits.length; end > 0; end -= 4) {
    groups.push(Number(digits.slice(Math.max(0, end - 4), end)));
  }
  let out = '';
  for (let i = groups.length - 1; i >= 0; i--) {
    const g = groups[i];
    if (g === 0) continue;
    let reading = kanaBelow10000(g);
    const unit = KANA_BIG_UNITS[i];
    // 兆・京は直前の音が促音になる（いっちょう・はっちょう・じゅっちょう）
    if (unit === 'ちょう' || unit === 'けい') {
      if (g % 10 === 1) reading = `${reading.slice(0, -2)}いっ`;
      else if (g % 10 === 8) reading = `${reading.slice(0, -2)}はっ`;
      else if (g % 100 === 10) reading = `${reading.slice(0, -3)}じゅっ`;
      else if (g % 10 === 0 && g % 100 >= 20) {
        reading = `${reading.slice(0, -3)}じゅっ`;
      }
    }
    out += reading + unit;
  }
  return out;
}

interface Parsed {
  negative: boolean;
  intPart: string;
  fracPart: string;
}

function parse(input: string): Parsed | NumberToWordsError {
  const normalized = input
    .normalize('NFKC')
    .replace(/[−‐‑–—－]/g, '-')
    .replace(/\s+/g, '');
  if (normalized === '') return 'empty';
  // カンマは3桁区切りの位置にあるときだけ受け付ける（1,5 を15と誤読しない）
  const m = /^([+-]?)(\d{1,3}(?:,\d{3})+|\d+)(?:\.(\d+))?$/.exec(normalized);
  if (!m) return 'invalid';
  const intPart = m[2].replace(/,/g, '').replace(/^0+(?=\d)/, '');
  const fracPart = m[3] ?? '';
  if (intPart.length > MAX_INT_DIGITS || fracPart.length > MAX_FRAC_DIGITS) {
    return 'tooLong';
  }
  return { negative: m[1] === '-', intPart, fracPart };
}

export function convertNumberToWords(
  input: string,
  options: NumberToWordsOptions,
): NumberToWordsResult {
  const parsed = parse(input);
  if (typeof parsed === 'string') return { ok: false, error: parsed };
  const { negative, intPart, fracPart } = parsed;
  const isZero = /^0*$/.test(intPart + fracPart);
  const neg = negative && !isZero;

  const intWords = integerToEnglish(intPart, options.british);
  let cardinal = intWords;
  let reading = integerToKana(intPart);
  if (fracPart !== '') {
    cardinal += ` point ${[...fracPart].map((d) => ONES[Number(d)]).join(' ')}`;
    reading += `てん${[...fracPart].map((d) => KANA_FRAC_DIGITS[Number(d)]).join('')}`;
  }
  if (neg) {
    cardinal = `minus ${cardinal}`;
    reading = `マイナス${reading}`;
  }

  const integerOnly = fracPart === '' && !neg;

  let check: string | null = null;
  if (!neg && fracPart.length <= 2) {
    const cents = fracPart.padEnd(2, '0');
    check = `${intWords[0].toUpperCase()}${intWords.slice(1)} and ${cents}/100 ${options.currency}`;
  }

  return {
    ok: true,
    normalized: `${neg ? '-' : ''}${intPart}${fracPart ? `.${fracPart}` : ''}`,
    cardinal,
    ordinal: integerOnly ? cardinalToOrdinal(intWords) : null,
    ordinalDigits: integerOnly ? ordinalSuffix(intPart) : null,
    check,
    reading,
  };
}
