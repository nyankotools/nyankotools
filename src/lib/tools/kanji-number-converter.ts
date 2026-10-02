export type KanjiDirection = 'toArabic' | 'toKanji';

/** 算用数字→漢数字の書き方 */
export type KanjiStyle = 'plain' | 'unit' | 'daiji';

export interface KanjiNumberOptions {
  direction: KanjiDirection;
  /** toKanji のときの書き方 */
  style: KanjiStyle;
  /** toArabic のとき、4桁以上の整数を3桁区切りにする */
  comma: boolean;
}

export interface KanjiNumberResult {
  output: string;
  /** 変換した数の個数 */
  converted: number;
  /** 数として解釈できず、そのまま残した漢数字の並びの個数（toArabic のみ） */
  skipped: number;
}

/** 位取りの上限（この桁数以上は変換しない）。垓（10^20）の次の位 秭（10^24）の手前まで */
const MAX_DIGITS = 24;

const PLAIN_DIGITS = [
  '〇',
  '一',
  '二',
  '三',
  '四',
  '五',
  '六',
  '七',
  '八',
  '九',
];
const DAIJI_DIGITS = [
  '零',
  '壱',
  '弐',
  '参',
  '四',
  '五',
  '六',
  '七',
  '八',
  '九',
];

const SMALL_UNITS_PLAIN = ['', '十', '百', '千'];
const SMALL_UNITS_DAIJI = ['', '拾', '百', '千'];
const BIG_UNITS_PLAIN = ['', '万', '億', '兆', '京', '垓'];
const BIG_UNITS_DAIJI = ['', '萬', '億', '兆', '京', '垓'];

/** 漢数字の文字 → 数字（0〜9） */
const DIGIT_CHARS: Record<string, number> = {
  〇: 0,
  零: 0,
  一: 1,
  壱: 1,
  壹: 1,
  二: 2,
  弐: 2,
  貳: 2,
  三: 3,
  参: 3,
  參: 3,
  四: 4,
  五: 5,
  六: 6,
  七: 7,
  八: 8,
  九: 9,
};

/** 十・百・千 → 10^n */
const SMALL_UNIT_CHARS: Record<string, bigint> = {
  十: 10n,
  拾: 10n,
  百: 100n,
  佰: 100n,
  千: 1000n,
  仟: 1000n,
  阡: 1000n,
};

/** 万・億・兆・京・垓 → 10^n */
const BIG_UNIT_CHARS: Record<string, bigint> = {
  万: 10n ** 4n,
  萬: 10n ** 4n,
  億: 10n ** 8n,
  兆: 10n ** 12n,
  京: 10n ** 16n,
  垓: 10n ** 20n,
};

const KANJI_RUN_CHARS = [
  ...Object.keys(DIGIT_CHARS),
  ...Object.keys(SMALL_UNIT_CHARS),
  ...Object.keys(BIG_UNIT_CHARS),
].join('');

const KANJI_RUN_PATTERN = new RegExp(`[${KANJI_RUN_CHARS}]+`, 'g');

// 全角数字・3桁区切りのカンマ・小数部を含む算用数字の並び
const ARABIC_RUN_PATTERN =
  /[0-9０-９]+(?:[,，][0-9０-９]+)*(?:[.．][0-9０-９]+)?/g;

function toHalfWidthDigits(s: string): string {
  return s.replace(/[０-９]/g, (c) =>
    String.fromCharCode(c.charCodeAt(0) - 0xfee0),
  );
}

/** 位取りの記号を含まない（〇一二三…だけの）並びか */
function isPositional(run: string): boolean {
  return [...run].every((ch) => ch in DIGIT_CHARS);
}

/**
 * 漢数字の並びを整数に変換する。数として成り立たないときは null。
 * 位取り記法（二〇二四）と単位記法（二千二十四・弐阡…）の両方に対応する。
 */
export function parseKanjiNumber(run: string): string | null {
  if (run.length === 0) return null;

  if (isPositional(run)) {
    return [...run].map((ch) => String(DIGIT_CHARS[ch])).join('');
  }

  let total = 0n;
  let section = 0n;
  let digit: number | null = null;
  let lastSmall = 10000n;
  let lastBig = 10n ** 24n;
  let zeroPending = false;

  for (const ch of run) {
    if (ch in DIGIT_CHARS) {
      const value = DIGIT_CHARS[ch];
      // 単位記法の中の「零」「〇」は読み飛ばす（千〇五 など）
      if (value === 0) {
        zeroPending = true;
        continue;
      }
      if (digit !== null) return null;
      digit = value;
    } else if (ch in SMALL_UNIT_CHARS) {
      const unit = SMALL_UNIT_CHARS[ch];
      if (unit >= lastSmall) return null;
      section += BigInt(digit ?? 1) * unit;
      digit = null;
      lastSmall = unit;
    } else {
      const unit = BIG_UNIT_CHARS[ch];
      if (unit >= lastBig) return null;
      // 「万」だけ・「億」だけのように係数がない場合は 1 とみなす（万円 など）
      let group = section + BigInt(digit ?? 0);
      if (group === 0n) {
        if (zeroPending) return null;
        group = 1n;
      }
      total += group * unit;
      section = 0n;
      digit = null;
      zeroPending = false;
      lastSmall = 10000n;
      lastBig = unit;
    }
  }
  total += section + BigInt(digit ?? 0);
  return total.toString();
}

function addCommas(digits: string): string {
  return digits.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

/** 整数の数字列（先頭ゼロなし）を漢数字にする。変換できない（桁が大きすぎる）ときは null */
export function toKanjiNumber(
  digits: string,
  style: KanjiStyle,
): string | null {
  if (!/^\d+$/.test(digits)) return null;

  if (style === 'plain') {
    return [...digits].map((d) => PLAIN_DIGITS[Number(d)]).join('');
  }

  const trimmed = digits.replace(/^0+(?=\d)/, '');
  if (trimmed.length > MAX_DIGITS) return null;

  const daiji = style === 'daiji';
  const digitChars = daiji ? DAIJI_DIGITS : PLAIN_DIGITS;
  const smallUnits = daiji ? SMALL_UNITS_DAIJI : SMALL_UNITS_PLAIN;
  const bigUnits = daiji ? BIG_UNITS_DAIJI : BIG_UNITS_PLAIN;

  if (trimmed === '0') return '零';

  // 4桁ごとに区切る（下位から）
  const groups: string[] = [];
  for (let end = trimmed.length; end > 0; end -= 4) {
    groups.push(trimmed.slice(Math.max(0, end - 4), end));
  }

  let result = '';
  for (let g = groups.length - 1; g >= 0; g--) {
    const group = groups[g].padStart(4, '0');
    if (group === '0000') continue;

    let part = '';
    for (let i = 0; i < 4; i++) {
      const d = Number(group[i]);
      if (d === 0) continue;
      const pos = 3 - i; // 3:千 2:百 1:十 0:一
      const unit = smallUnits[pos];
      if (pos === 0) {
        part += digitChars[d];
        continue;
      }
      // 大字は改ざん防止のため「壱」も省略しない。通常の単位記法は 十・百 の「一」を省略し、
      // 千 は先頭の位（万より上の位がない）ときだけ省略する
      const omitOne =
        d === 1 &&
        !daiji &&
        (pos === 1 || pos === 2 || (pos === 3 && groups.length === 1));
      part += (omitOne ? '' : digitChars[d]) + unit;
    }
    result += part + bigUnits[g];
  }
  return result;
}

function convertFraction(fraction: string, style: KanjiStyle): string {
  const chars = style === 'daiji' ? DAIJI_DIGITS : PLAIN_DIGITS;
  return [...fraction].map((d) => chars[Number(d)]).join('');
}

function convertToKanji(
  text: string,
  style: KanjiStyle,
): { output: string; converted: number } {
  let converted = 0;
  const output = text.replace(ARABIC_RUN_PATTERN, (match) => {
    const normalized = toHalfWidthDigits(match);
    const [intPart, fraction] = normalized.split(/[.．]/);
    const kanji = toKanjiNumber(intPart.replace(/[,，]/g, ''), style);
    if (kanji === null) return match;
    converted++;
    if (fraction === undefined) return kanji;
    // 小数部は常に位取り記法（三点一四）
    return `${kanji}点${convertFraction(fraction, style)}`;
  });
  return { output, converted };
}

function convertToArabic(
  text: string,
  comma: boolean,
): { output: string; converted: number; skipped: number } {
  let converted = 0;
  let skipped = 0;
  const output = text.replace(KANJI_RUN_PATTERN, (run) => {
    // 〇〜九を含まない並び（京都・千葉・十分・万歳 など）は数として扱わない
    if (![...run].some((ch) => ch in DIGIT_CHARS)) return run;
    const parsed = parseKanjiNumber(run);
    if (parsed === null) {
      skipped++;
      return run;
    }
    converted++;
    // 位取り記法（二〇二四）は年号・番号のことが多いので区切らない
    return comma && !isPositional(run) ? addCommas(parsed) : parsed;
  });
  return { output, converted, skipped };
}

export function convertKanjiNumbers(
  text: string,
  options: KanjiNumberOptions,
): KanjiNumberResult {
  if (options.direction === 'toKanji') {
    const { output, converted } = convertToKanji(text, options.style);
    return { output, converted, skipped: 0 };
  }
  return convertToArabic(text, options.comma);
}
