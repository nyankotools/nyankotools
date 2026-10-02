/**
 * Unicode装飾文字変換のロジック。
 * 英数字を「数学用英数字記号」「丸付き文字」などの別のコードポイントへ置き換える、
 * 結合文字（取り消し線など）を足す、上下を反転する、前後に飾りを付ける。
 * 日本語など対応する装飾のない文字は、そのまま残す。
 */

export const decoratorStyleIds = [
  'bold',
  'italic',
  'boldItalic',
  'script',
  'boldScript',
  'fraktur',
  'boldFraktur',
  'doubleStruck',
  'sans',
  'sansBold',
  'sansItalic',
  'sansBoldItalic',
  'monospace',
  'fullwidth',
  'circled',
  'negativeCircled',
  'squared',
  'negativeSquared',
  'parenthesized',
  'smallCaps',
  'flipped',
  'strikethrough',
  'underline',
  'doubleUnderline',
  'slash',
  'wrapStar',
  'wrapBracket',
  'wrapKakko',
  'wrapFlower',
  'wrapSparkle',
] as const;

export type DecoratorStyleId = (typeof decoratorStyleIds)[number];

/** 数値はコードポイントの先頭（そこからの連番）、文字列は並び順に1文字ずつ対応させる */
type Source = number | string;

interface LetterMap {
  upper?: Source;
  lower?: Source;
  digit?: Source;
  /** 連番から外れる文字（数学用英数字記号の「穴」）の置き換え */
  exceptions?: Record<string, string>;
}

function pick(source: Source, offset: number): string {
  return typeof source === 'number'
    ? String.fromCodePoint(source + offset)
    : (Array.from(source)[offset] ?? '');
}

function mapLetter(ch: string, map: LetterMap): string {
  const exception = map.exceptions?.[ch];
  if (exception !== undefined) return exception;
  const code = ch.charCodeAt(0);
  if (ch.length === 1) {
    if (code >= 65 && code <= 90 && map.upper !== undefined) {
      return pick(map.upper, code - 65);
    }
    if (code >= 97 && code <= 122 && map.lower !== undefined) {
      return pick(map.lower, code - 97);
    }
    if (code >= 48 && code <= 57 && map.digit !== undefined) {
      return pick(map.digit, code - 48);
    }
  }
  return ch;
}

const LETTER_MAPS: Partial<Record<DecoratorStyleId, LetterMap>> = {
  bold: { upper: 0x1d400, lower: 0x1d41a, digit: 0x1d7ce },
  italic: {
    upper: 0x1d434,
    lower: 0x1d44e,
    exceptions: { h: 'ℎ' },
  },
  boldItalic: { upper: 0x1d468, lower: 0x1d482 },
  script: {
    upper: 0x1d49c,
    lower: 0x1d4b6,
    exceptions: {
      B: 'ℬ',
      E: 'ℰ',
      F: 'ℱ',
      H: 'ℋ',
      I: 'ℐ',
      L: 'ℒ',
      M: 'ℳ',
      R: 'ℛ',
      e: 'ℯ',
      g: 'ℊ',
      o: 'ℴ',
    },
  },
  boldScript: { upper: 0x1d4d0, lower: 0x1d4ea },
  fraktur: {
    upper: 0x1d504,
    lower: 0x1d51e,
    exceptions: {
      C: 'ℭ',
      H: 'ℌ',
      I: 'ℑ',
      R: 'ℜ',
      Z: 'ℨ',
    },
  },
  boldFraktur: { upper: 0x1d56c, lower: 0x1d586 },
  doubleStruck: {
    upper: 0x1d538,
    lower: 0x1d552,
    digit: 0x1d7d8,
    exceptions: {
      C: 'ℂ',
      H: 'ℍ',
      N: 'ℕ',
      P: 'ℙ',
      Q: 'ℚ',
      R: 'ℝ',
      Z: 'ℤ',
    },
  },
  sans: { upper: 0x1d5a0, lower: 0x1d5ba, digit: 0x1d7e2 },
  sansBold: { upper: 0x1d5d4, lower: 0x1d5ee, digit: 0x1d7ec },
  sansItalic: { upper: 0x1d608, lower: 0x1d622 },
  sansBoldItalic: { upper: 0x1d63c, lower: 0x1d656 },
  monospace: { upper: 0x1d670, lower: 0x1d68a, digit: 0x1d7f6 },
  circled: {
    upper: 0x24b6,
    lower: 0x24d0,
    digit: '⓪①②③④⑤⑥⑦⑧⑨',
  },
  negativeCircled: {
    upper: 0x1f150,
    lower: 0x1f150,
    digit: '⓿❶❷❸❹❺❻❼❽❾',
  },
  squared: { upper: 0x1f130, lower: 0x1f130 },
  negativeSquared: { upper: 0x1f170, lower: 0x1f170 },
  parenthesized: {
    upper: 0x1f110,
    lower: 0x249c,
    digit: '0⑴⑵⑶⑷⑸⑹⑺⑻⑼',
  },
  smallCaps: {
    upper: 'ᴀʙᴄᴅᴇꜰɢʜɪᴊᴋʟᴍɴᴏᴘǫʀsᴛᴜᴠᴡxʏᴢ',
    lower: 'ᴀʙᴄᴅᴇꜰɢʜɪᴊᴋʟᴍɴᴏᴘǫʀsᴛᴜᴠᴡxʏᴢ',
  },
};

const COMBINING_MARKS: Partial<Record<DecoratorStyleId, string>> = {
  strikethrough: '̶',
  underline: '̲',
  doubleUnderline: '̳',
  slash: '̸',
};

const WRAPS: Partial<Record<DecoratorStyleId, [string, string]>> = {
  wrapStar: ['★', '★'],
  wrapBracket: ['【', '】'],
  wrapKakko: ['『', '』'],
  wrapFlower: ['꧁', '꧂'],
  wrapSparkle: ['✧･ﾟ: *✧･ﾟ:* ', ' *:･ﾟ✧*:･ﾟ✧'],
};

const FLIP_SOURCE =
  "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789.,'?!()[]{}<>_&";
const FLIP_TARGET =
  "ɐqɔpǝɟƃɥᴉɾʞlɯuodbɹsʇnʌʍxʎz∀ᗺƆᗡƎℲ⅁HIſʞ⅂WNOԀΌᴚS⊥∩ΛMX⅄Z0ƖᄅƐㄣϛ9ㄥ86˙''¿¡)(][}{><‾⅋";

const FLIP_MAP = new Map<string, string>();
{
  const source = Array.from(FLIP_SOURCE);
  const target = Array.from(FLIP_TARGET);
  source.forEach((ch, i) => FLIP_MAP.set(ch, target[i] ?? ch));
}

function fullwidth(ch: string): string {
  if (ch === ' ') return '　';
  const code = ch.codePointAt(0)!;
  return code >= 0x21 && code <= 0x7e
    ? String.fromCodePoint(code + 0xfee0)
    : ch;
}

function flip(text: string): string {
  return text
    .split(/\r?\n/)
    .map((line) =>
      Array.from(line)
        .map((ch) => FLIP_MAP.get(ch) ?? ch)
        .reverse()
        .join(''),
    )
    .join('\n');
}

/** 指定した装飾でテキストを変換する */
export function decorate(text: string, styleId: DecoratorStyleId): string {
  const letterMap = LETTER_MAPS[styleId];
  if (letterMap) {
    return Array.from(text)
      .map((ch) => mapLetter(ch, letterMap))
      .join('');
  }
  if (styleId === 'fullwidth') {
    return Array.from(text).map(fullwidth).join('');
  }
  if (styleId === 'flipped') return flip(text);

  const mark = COMBINING_MARKS[styleId];
  if (mark) {
    return Array.from(text)
      .map((ch) => (ch === '\n' || ch === '\r' ? ch : ch + mark))
      .join('');
  }
  const wrap = WRAPS[styleId];
  if (wrap) return text === '' ? '' : wrap[0] + text + wrap[1];
  return text;
}

export interface DecoratedText {
  id: DecoratorStyleId;
  output: string;
}

/** すべての装飾で変換した結果を、表示順に返す */
export function decorateAll(text: string): DecoratedText[] {
  return decoratorStyleIds.map((id) => ({ id, output: decorate(text, id) }));
}
