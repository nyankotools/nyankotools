/** 英語圏（short scale）の接尾辞。index n は 10^(3n) に対応する（0 は接尾辞なし） */
export const SHORT_SUFFIXES = [
  { suffix: '', name: '' },
  { suffix: 'K', name: 'Thousand' },
  { suffix: 'M', name: 'Million' },
  { suffix: 'B', name: 'Billion' },
  { suffix: 'T', name: 'Trillion' },
  { suffix: 'Qa', name: 'Quadrillion' },
  { suffix: 'Qi', name: 'Quintillion' },
  { suffix: 'Sx', name: 'Sextillion' },
  { suffix: 'Sp', name: 'Septillion' },
  { suffix: 'Oc', name: 'Octillion' },
  { suffix: 'No', name: 'Nonillion' },
  { suffix: 'Dc', name: 'Decillion' },
  { suffix: 'UDc', name: 'Undecillion' },
  { suffix: 'DDc', name: 'Duodecillion' },
  { suffix: 'TDc', name: 'Tredecillion' },
  { suffix: 'QaDc', name: 'Quattuordecillion' },
  { suffix: 'QiDc', name: 'Quindecillion' },
  { suffix: 'SxDc', name: 'Sexdecillion' },
  { suffix: 'SpDc', name: 'Septendecillion' },
  { suffix: 'OcDc', name: 'Octodecillion' },
  { suffix: 'NoDc', name: 'Novemdecillion' },
  { suffix: 'Vg', name: 'Vigintillion' },
] as const;

/** 日本語の大きな数の単位。index n は 10^(4n) に対応する（0 は単位なし） */
export const JA_UNITS = [
  '',
  '万',
  '億',
  '兆',
  '京',
  '垓',
  '秭',
  '穣',
  '溝',
  '澗',
  '正',
  '載',
  '極',
  '恒河沙',
  '阿僧祇',
  '那由他',
  '不可思議',
  '無量大数',
] as const;

/** JA_UNITS と同じ順の読み方（index 0 は単位なし） */
export const JA_UNIT_READINGS = {
  ja: [
    '',
    'まん',
    'おく',
    'ちょう',
    'けい',
    'がい',
    'じょ',
    'じょう',
    'こう',
    'かん',
    'せい',
    'さい',
    'ごく',
    'ごうがしゃ',
    'あそうぎ',
    'なゆた',
    'ふかしぎ',
    'むりょうたいすう',
  ],
  en: [
    '',
    'man',
    'oku',
    'cho',
    'kei',
    'gai',
    'jo',
    'jō',
    'ko',
    'kan',
    'sei',
    'sai',
    'goku',
    'gōgasha',
    'asōgi',
    'nayuta',
    'fukashigi',
    'muryōtaisū',
  ],
} as const;

/** 入力として受け付ける最大桁数（巨大な指数でブラウザが固まるのを防ぐ） */
export const MAX_DIGITS = 1000;

const MAX_SHORT_INDEX = SHORT_SUFFIXES.length - 1;
const MAX_JA_INDEX = JA_UNITS.length - 1;

export type ParseError = 'empty' | 'invalid' | 'fraction' | 'tooLarge';

export type ParseResult =
  { ok: true; value: bigint } | { ok: false; error: ParseError };

/** 整数をカンマ3桁区切りにする（例: 1234567 → "1,234,567"） */
export function formatWithCommas(value: bigint): string {
  const s = value.toString();
  const negative = s.startsWith('-');
  const digits = negative ? s.slice(1) : s;
  const grouped = digits.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return negative ? `-${grouped}` : grouped;
}

/** 科学的記数法（例: 12345678 → "1.2345678e+7"）。0 は "0" */
export function formatScientific(value: bigint): string {
  if (value === 0n) return '0';
  const s = (value < 0n ? -value : value).toString();
  const exponent = s.length - 1;
  const mantissa = s.slice(1).replace(/0+$/, '');
  const head = mantissa === '' ? s[0] : `${s[0]}.${mantissa}`;
  return `${value < 0n ? '-' : ''}${head}e+${exponent}`;
}

/**
 * 値を10のべき乗で割った商を小数 `fractionDigits` 桁まで（切り捨て）で表す。
 * 末尾の 0 は落とす（例: 1500 / 1000 → "1.5"）。
 */
function divideToDecimal(
  value: bigint,
  divisorExponent: number,
  fractionDigits: number,
): string {
  const divisor = 10n ** BigInt(divisorExponent);
  const whole = value / divisor;
  if (fractionDigits <= 0 || divisorExponent === 0) return whole.toString();
  const remainder = value % divisor;
  const scale = Math.min(fractionDigits, divisorExponent);
  const fraction = (remainder / 10n ** BigInt(divisorExponent - scale))
    .toString()
    .padStart(scale, '0')
    .replace(/0+$/, '');
  return fraction === '' ? whole.toString() : `${whole}.${fraction}`;
}

/**
 * K/M/B/T… 表記（例: 1234567 → "1.23M"）。小数は切り捨て。
 * 1000 未満はそのまま。対応する最大の接尾辞（Vg = 10^63）より大きい値は、
 * 最大の接尾辞のまま 1000 以上の数で表す。負数は未対応のため null。
 */
export function formatShort(value: bigint, fractionDigits = 2): string | null {
  if (value < 0n) return null;
  const length = value.toString().length;
  const index = Math.min(Math.floor((length - 1) / 3), MAX_SHORT_INDEX);
  if (index === 0) return value.toString();
  const [whole, fraction] = divideToDecimal(
    value,
    index * 3,
    fractionDigits,
  ).split('.');
  const grouped = formatWithCommas(BigInt(whole));
  return `${grouped}${fraction ? `.${fraction}` : ''}${SHORT_SUFFIXES[index].suffix}`;
}

/**
 * 日本語の位取り表記（例: 123456789 → "1億2345万6789"）。
 * 無量大数（10^68）を超える部分は「無量大数」の係数として桁数をそのまま増やす。
 */
export function formatJa(value: bigint): string | null {
  if (value < 0n) return null;
  if (value === 0n) return '0';
  const parts: string[] = [];
  let rest = value;
  const top = 10n ** BigInt(MAX_JA_INDEX * 4);
  if (rest >= top) {
    parts.push(`${rest / top}${JA_UNITS[MAX_JA_INDEX]}`);
    rest %= top;
  }
  for (let i = MAX_JA_INDEX - 1; i >= 0; i--) {
    const unit = 10n ** BigInt(i * 4);
    const group = rest / unit;
    rest %= unit;
    if (group > 0n) parts.push(`${group}${JA_UNITS[i]}`);
  }
  return parts.join('');
}

/** "12" "1.5" のような非負の小数文字列に 10^exponent を掛けて整数にする */
function scaleDecimal(text: string, exponent: number): ParseResult {
  const [intPart, fracPart = ''] = text.split('.');
  const digits = `${intPart}${fracPart}`.replace(/^0+(?=\d)/, '');
  const shift = exponent - fracPart.length;
  if (shift >= 0) {
    if (digits.replace(/^0+/, '').length + shift > MAX_DIGITS) {
      return { ok: false, error: 'tooLarge' };
    }
    return { ok: true, value: BigInt(digits) * 10n ** BigInt(shift) };
  }
  // 小数点以下が残る場合は、残りがすべて 0 のときだけ整数として扱う
  const cut = digits.length + shift;
  const tail = cut >= 0 ? digits.slice(cut) : digits;
  if (/[1-9]/.test(tail)) return { ok: false, error: 'fraction' };
  if (cut > MAX_DIGITS) return { ok: false, error: 'tooLarge' };
  return { ok: true, value: cut > 0 ? BigInt(digits.slice(0, cut)) : 0n };
}

const SUFFIX_INDEX = new Map<string, number>(
  SHORT_SUFFIXES.map((s, i) => [s.suffix.toLowerCase(), i] as const).filter(
    ([key]) => key !== '',
  ),
);
const JA_UNIT_INDEX = new Map<string, number>(
  JA_UNITS.map((u, i) => [u, i] as const).filter(([key]) => key !== ''),
);

const NUMBER = String.raw`\d+(?:\.\d+)?`;
const SHORT_PATTERN = new RegExp(`^(${NUMBER})\\s*([a-z]+)$`, 'i');
const SCI_PATTERN = new RegExp(`^(${NUMBER})e\\+?(\\d+)$`, 'i');
const PLAIN_PATTERN = new RegExp(`^(${NUMBER})$`);
const JA_TERM_PATTERN = new RegExp(
  `(${NUMBER})\\s*(${[...JA_UNIT_INDEX.keys()]
    .sort((a, b) => b.length - a.length)
    .join('|')})?`,
  'gy',
);

function parseJa(text: string): ParseResult {
  JA_TERM_PATTERN.lastIndex = 0;
  let total = 0n;
  let position = 0;
  let sawUnit = false;
  while (position < text.length) {
    JA_TERM_PATTERN.lastIndex = position;
    const match = JA_TERM_PATTERN.exec(text);
    if (!match) return { ok: false, error: 'invalid' };
    const unitIndex = match[2] ? (JA_UNIT_INDEX.get(match[2]) ?? 0) : 0;
    if (match[2]) sawUnit = true;
    const term = scaleDecimal(match[1], unitIndex * 4);
    if (!term.ok) return term;
    total += term.value;
    position = JA_TERM_PATTERN.lastIndex;
    if (total.toString().length > MAX_DIGITS) {
      return { ok: false, error: 'tooLarge' };
    }
  }
  return sawUnit ? { ok: true, value: total } : { ok: false, error: 'invalid' };
}

/**
 * 入力文字列を整数に変換する。次の書式を受け付ける（非負のみ）。
 * - 整数（カンマ・空白・アンダースコア区切り可）: `1,234,567`
 * - 指数表記: `1e50` `1.5e12`
 * - 英語接尾辞: `1.5M` `3 Qa`（大文字小文字は区別しない）
 * - 日本語の位取り: `3億` `2億3000万` `1.5兆`
 */
export function parseLargeNumber(input: string): ParseResult {
  let text = input.normalize('NFKC').replace(/[,_]/g, '').trim();
  if (/^\d[\d ]*$/.test(text)) text = text.replace(/ /g, '');
  if (text === '') return { ok: false, error: 'empty' };
  if (text.length > MAX_DIGITS * 2) return { ok: false, error: 'tooLarge' };

  const plain = PLAIN_PATTERN.exec(text);
  if (plain) return scaleDecimal(plain[1], 0);

  const sci = SCI_PATTERN.exec(text);
  if (sci) {
    const exponent = Number(sci[2]);
    if (exponent > MAX_DIGITS) return { ok: false, error: 'tooLarge' };
    return scaleDecimal(sci[1], exponent);
  }

  const short = SHORT_PATTERN.exec(text);
  if (short) {
    const index = SUFFIX_INDEX.get(short[2].toLowerCase());
    if (index === undefined) return { ok: false, error: 'invalid' };
    return scaleDecimal(short[1], index * 3);
  }

  if (
    /[万億兆京垓秭穣溝澗正載極恒河沙阿僧祇那由他不可思議無量大数]/.test(text)
  ) {
    return parseJa(text.replace(/ /g, ''));
  }
  return { ok: false, error: 'invalid' };
}

export interface ChartRow {
  exponent: number;
  value: bigint;
  commas: string;
  short: string;
  ja: string;
}

/** 10^from 〜 10^to の早見表の行を作る */
export function buildChartRows(from = 3, to = 68): ChartRow[] {
  const rows: ChartRow[] = [];
  for (let exponent = from; exponent <= to; exponent++) {
    const value = 10n ** BigInt(exponent);
    rows.push({
      exponent,
      value,
      commas: formatWithCommas(value),
      short: formatShort(value) ?? '',
      ja: formatJa(value) ?? '',
    });
  }
  return rows;
}

/** formatJa の結果の各単位に読み方を付ける（例: "1億" → "1億（おく）"） */
export function annotateJaReadings(
  text: string,
  locale: keyof typeof JA_UNIT_READINGS,
): string {
  const readings = JA_UNIT_READINGS[locale];
  return text.replace(
    new RegExp(JA_UNITS.slice(1).join('|'), 'g'),
    (unit) => `${unit}（${readings[JA_UNIT_INDEX.get(unit) ?? 0]}）`,
  );
}
