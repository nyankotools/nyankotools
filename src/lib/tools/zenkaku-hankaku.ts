export type ConversionDirection = 'toHalf' | 'toFull';

export interface ConversionOptions {
  alphanumeric: boolean;
  symbol: boolean;
  katakana: boolean;
  space: boolean;
}

const FULLWIDTH_SPACE = String.fromCharCode(0x3000);

const KATAKANA_PAIRS: [full: string, half: string][] = [
  ['ガ', 'ｶﾞ'],
  ['ギ', 'ｷﾞ'],
  ['グ', 'ｸﾞ'],
  ['ゲ', 'ｹﾞ'],
  ['ゴ', 'ｺﾞ'],
  ['ザ', 'ｻﾞ'],
  ['ジ', 'ｼﾞ'],
  ['ズ', 'ｽﾞ'],
  ['ゼ', 'ｾﾞ'],
  ['ゾ', 'ｿﾞ'],
  ['ダ', 'ﾀﾞ'],
  ['ヂ', 'ﾁﾞ'],
  ['ヅ', 'ﾂﾞ'],
  ['デ', 'ﾃﾞ'],
  ['ド', 'ﾄﾞ'],
  ['バ', 'ﾊﾞ'],
  ['ビ', 'ﾋﾞ'],
  ['ブ', 'ﾌﾞ'],
  ['ベ', 'ﾍﾞ'],
  ['ボ', 'ﾎﾞ'],
  ['パ', 'ﾊﾟ'],
  ['ピ', 'ﾋﾟ'],
  ['プ', 'ﾌﾟ'],
  ['ペ', 'ﾍﾟ'],
  ['ポ', 'ﾎﾟ'],
  ['ヴ', 'ｳﾞ'],
  ['ア', 'ｱ'],
  ['イ', 'ｲ'],
  ['ウ', 'ｳ'],
  ['エ', 'ｴ'],
  ['オ', 'ｵ'],
  ['カ', 'ｶ'],
  ['キ', 'ｷ'],
  ['ク', 'ｸ'],
  ['ケ', 'ｹ'],
  ['コ', 'ｺ'],
  ['サ', 'ｻ'],
  ['シ', 'ｼ'],
  ['ス', 'ｽ'],
  ['セ', 'ｾ'],
  ['ソ', 'ｿ'],
  ['タ', 'ﾀ'],
  ['チ', 'ﾁ'],
  ['ツ', 'ﾂ'],
  ['テ', 'ﾃ'],
  ['ト', 'ﾄ'],
  ['ナ', 'ﾅ'],
  ['ニ', 'ﾆ'],
  ['ヌ', 'ﾇ'],
  ['ネ', 'ﾈ'],
  ['ノ', 'ﾉ'],
  ['ハ', 'ﾊ'],
  ['ヒ', 'ﾋ'],
  ['フ', 'ﾌ'],
  ['ヘ', 'ﾍ'],
  ['ホ', 'ﾎ'],
  ['マ', 'ﾏ'],
  ['ミ', 'ﾐ'],
  ['ム', 'ﾑ'],
  ['メ', 'ﾒ'],
  ['モ', 'ﾓ'],
  ['ヤ', 'ﾔ'],
  ['ユ', 'ﾕ'],
  ['ヨ', 'ﾖ'],
  ['ラ', 'ﾗ'],
  ['リ', 'ﾘ'],
  ['ル', 'ﾙ'],
  ['レ', 'ﾚ'],
  ['ロ', 'ﾛ'],
  ['ワ', 'ﾜ'],
  ['ヲ', 'ｦ'],
  ['ン', 'ﾝ'],
  ['ァ', 'ｧ'],
  ['ィ', 'ｨ'],
  ['ゥ', 'ｩ'],
  ['ェ', 'ｪ'],
  ['ォ', 'ｫ'],
  ['ッ', 'ｯ'],
  ['ャ', 'ｬ'],
  ['ュ', 'ｭ'],
  ['ョ', 'ｮ'],
  ['ー', 'ｰ'],
  ['、', '､'],
  ['。', '｡'],
  ['「', '｢'],
  ['」', '｣'],
  ['・', '･'],
];

const FULL_TO_HALF_KATAKANA = new Map(KATAKANA_PAIRS);
const HALF_TO_FULL_KATAKANA = new Map(
  KATAKANA_PAIRS.map(([full, half]) => [half, full]),
);

function isAsciiAlnum(code: number): boolean {
  return (
    (code >= 0x30 && code <= 0x39) ||
    (code >= 0x41 && code <= 0x5a) ||
    (code >= 0x61 && code <= 0x7a)
  );
}

function convertAlnumSymbol(
  text: string,
  alphanumeric: boolean,
  symbol: boolean,
  direction: ConversionDirection,
): string {
  if (!alphanumeric && !symbol) return text;
  const pattern = direction === 'toHalf' ? /[！-～]/g : /[\x21-\x7e]/g;
  return text.replace(pattern, (ch) => {
    const halfCode =
      direction === 'toHalf' ? ch.charCodeAt(0) - 0xfee0 : ch.charCodeAt(0);
    const isAlnum = isAsciiAlnum(halfCode);
    if ((isAlnum && !alphanumeric) || (!isAlnum && !symbol)) return ch;
    return direction === 'toHalf'
      ? String.fromCharCode(halfCode)
      : String.fromCharCode(halfCode + 0xfee0);
  });
}

function toHalfKatakana(text: string): string {
  return [...text].map((ch) => FULL_TO_HALF_KATAKANA.get(ch) ?? ch).join('');
}

function toFullKatakana(text: string): string {
  const chars = [...text];
  let result = '';
  let i = 0;
  while (i < chars.length) {
    const pair = chars[i] + (chars[i + 1] ?? '');
    const pairMatch = HALF_TO_FULL_KATAKANA.get(pair);
    if (pairMatch !== undefined) {
      result += pairMatch;
      i += 2;
      continue;
    }
    result += HALF_TO_FULL_KATAKANA.get(chars[i]) ?? chars[i];
    i += 1;
  }
  return result;
}

export function convertWidth(
  text: string,
  direction: ConversionDirection,
  options: ConversionOptions,
): string {
  let result = text;
  if (options.katakana) {
    result =
      direction === 'toHalf' ? toHalfKatakana(result) : toFullKatakana(result);
  }
  result = convertAlnumSymbol(
    result,
    options.alphanumeric,
    options.symbol,
    direction,
  );
  if (options.space) {
    result =
      direction === 'toHalf'
        ? result.split(FULLWIDTH_SPACE).join(' ')
        : result.split(' ').join(FULLWIDTH_SPACE);
  }
  return result;
}
