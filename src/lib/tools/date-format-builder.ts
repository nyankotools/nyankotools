// 日付フォーマット文字列ビルダーのロジック（DOM・文言に依存しない）。
// 書式文字列 / 例文を共通の「セグメント列」に解釈し、各言語の書式文字列へ描画する。

export const FORMAT_IDS = [
  'strftime',
  'java',
  'php',
  'moment',
  'dotnet',
] as const;
export type FormatId = (typeof FORMAT_IDS)[number];

export const TOKEN_IDS = [
  'year4',
  'year2',
  'month2',
  'month1',
  'monthLong',
  'monthShort',
  'day2',
  'day1',
  'weekdayLong',
  'weekdayShort',
  'hour24_2',
  'hour24_1',
  'hour12_2',
  'hour12_1',
  'minute2',
  'second2',
  'millis3',
  'ampm',
  'tzOffset',
  'tzOffsetColon',
  'dayOfYear3',
] as const;
export type TokenId = (typeof TOKEN_IDS)[number];

export type Segment =
  | { kind: 'token'; token: TokenId }
  | { kind: 'literal'; text: string }
  | { kind: 'unknown'; raw: string };

type TokenTable = Partial<Record<TokenId, string>>;

/** 各書式でのトークンの表記。無いものは「その書式では表せない」 */
export const TOKEN_STRINGS: Record<FormatId, TokenTable> = {
  strftime: {
    year4: '%Y',
    year2: '%y',
    month2: '%m',
    month1: '%-m',
    monthLong: '%B',
    monthShort: '%b',
    day2: '%d',
    day1: '%-d',
    weekdayLong: '%A',
    weekdayShort: '%a',
    hour24_2: '%H',
    hour24_1: '%-H',
    hour12_2: '%I',
    hour12_1: '%-I',
    minute2: '%M',
    second2: '%S',
    millis3: '%L',
    ampm: '%p',
    tzOffset: '%z',
    tzOffsetColon: '%:z',
    dayOfYear3: '%j',
  },
  java: {
    year4: 'yyyy',
    year2: 'yy',
    month2: 'MM',
    month1: 'M',
    monthLong: 'MMMM',
    monthShort: 'MMM',
    day2: 'dd',
    day1: 'd',
    weekdayLong: 'EEEE',
    weekdayShort: 'EEE',
    hour24_2: 'HH',
    hour24_1: 'H',
    hour12_2: 'hh',
    hour12_1: 'h',
    minute2: 'mm',
    second2: 'ss',
    millis3: 'SSS',
    ampm: 'a',
    tzOffset: 'Z',
    tzOffsetColon: 'XXX',
    dayOfYear3: 'DDD',
  },
  php: {
    year4: 'Y',
    year2: 'y',
    month2: 'm',
    month1: 'n',
    monthLong: 'F',
    monthShort: 'M',
    day2: 'd',
    day1: 'j',
    weekdayLong: 'l',
    weekdayShort: 'D',
    hour24_2: 'H',
    hour24_1: 'G',
    hour12_2: 'h',
    hour12_1: 'g',
    minute2: 'i',
    second2: 's',
    millis3: 'v',
    ampm: 'A',
    tzOffset: 'O',
    tzOffsetColon: 'P',
    // PHP の z は 0 始まりの通算日なので 3 桁の通算日（1 始まり）には使えない
  },
  moment: {
    year4: 'YYYY',
    year2: 'YY',
    month2: 'MM',
    month1: 'M',
    monthLong: 'MMMM',
    monthShort: 'MMM',
    day2: 'DD',
    day1: 'D',
    weekdayLong: 'dddd',
    weekdayShort: 'ddd',
    hour24_2: 'HH',
    hour24_1: 'H',
    hour12_2: 'hh',
    hour12_1: 'h',
    minute2: 'mm',
    second2: 'ss',
    millis3: 'SSS',
    ampm: 'A',
    tzOffset: 'ZZ',
    tzOffsetColon: 'Z',
    dayOfYear3: 'DDDD',
  },
  dotnet: {
    year4: 'yyyy',
    year2: 'yy',
    month2: 'MM',
    month1: 'M',
    monthLong: 'MMMM',
    monthShort: 'MMM',
    day2: 'dd',
    day1: 'd',
    weekdayLong: 'dddd',
    weekdayShort: 'ddd',
    hour24_2: 'HH',
    hour24_1: 'H',
    hour12_2: 'hh',
    hour12_1: 'h',
    minute2: 'mm',
    second2: 'ss',
    millis3: 'fff',
    ampm: 'tt',
    tzOffsetColon: 'zzz',
  },
};

/** 読み込み時のみ受け付ける別表記 */
const ALIASES: Partial<Record<FormatId, Record<string, TokenId>>> = {
  java: {
    uuuu: 'year4',
    y: 'year4',
    E: 'weekdayShort',
    EE: 'weekdayShort',
    ZZ: 'tzOffset',
    ZZZ: 'tzOffset',
    xxx: 'tzOffsetColon',
    XX: 'tzOffset',
    xx: 'tzOffset',
  },
};

const LETTER_RE = /[A-Za-z]/;

interface Matcher {
  keys: string[];
  map: Map<string, TokenId>;
}

const matchers = new Map<FormatId, Matcher>();

function getMatcher(format: FormatId): Matcher {
  let m = matchers.get(format);
  if (m) return m;
  const map = new Map<string, TokenId>();
  for (const [token, str] of Object.entries(TOKEN_STRINGS[format])) {
    map.set(str, token as TokenId);
  }
  for (const [str, token] of Object.entries(ALIASES[format] ?? {})) {
    if (!map.has(str)) map.set(str, token);
  }
  const keys = [...map.keys()].sort((a, b) => b.length - a.length);
  m = { keys, map };
  matchers.set(format, m);
  return m;
}

class SegmentBuilder {
  readonly segments: Segment[] = [];

  literal(text: string) {
    if (text === '') return;
    const last = this.segments[this.segments.length - 1];
    if (last && last.kind === 'literal') last.text += text;
    else this.segments.push({ kind: 'literal', text });
  }

  token(token: TokenId) {
    this.segments.push({ kind: 'token', token });
  }

  unknown(raw: string) {
    this.segments.push({ kind: 'unknown', raw });
  }
}

const STRFTIME_SPECS: Record<string, TokenId> = {
  Y: 'year4',
  y: 'year2',
  m: 'month2',
  B: 'monthLong',
  b: 'monthShort',
  h: 'monthShort',
  d: 'day2',
  A: 'weekdayLong',
  a: 'weekdayShort',
  H: 'hour24_2',
  I: 'hour12_2',
  M: 'minute2',
  S: 'second2',
  L: 'millis3',
  p: 'ampm',
  z: 'tzOffset',
  j: 'dayOfYear3',
};
const STRFTIME_NOPAD: Record<string, TokenId> = {
  m: 'month1',
  d: 'day1',
  H: 'hour24_1',
  I: 'hour12_1',
};
const STRFTIME_COMPOSITE: Record<string, (TokenId | string)[]> = {
  F: ['year4', '-', 'month2', '-', 'day2'],
  T: ['hour24_2', ':', 'minute2', ':', 'second2'],
  R: ['hour24_2', ':', 'minute2'],
  D: ['month2', '/', 'day2', '/', 'year2'],
};

function parseStrftime(text: string): Segment[] {
  const b = new SegmentBuilder();
  let i = 0;
  while (i < text.length) {
    const c = text[i];
    if (c !== '%') {
      b.literal(c);
      i++;
      continue;
    }
    const next = text[i + 1];
    if (next === undefined) {
      b.literal('%');
      i++;
      continue;
    }
    if (next === '%') {
      b.literal('%');
      i += 2;
      continue;
    }
    if (next === ':' && text[i + 2] === 'z') {
      b.token('tzOffsetColon');
      i += 3;
      continue;
    }
    if (next === '-' || next === '#') {
      const spec = text[i + 2];
      if (spec !== undefined && STRFTIME_NOPAD[spec]) {
        b.token(STRFTIME_NOPAD[spec]);
      } else if (spec !== undefined && STRFTIME_SPECS[spec]) {
        b.token(STRFTIME_SPECS[spec]);
      } else {
        b.unknown(text.slice(i, i + 3));
      }
      i += 3;
      continue;
    }
    const composite = STRFTIME_COMPOSITE[next];
    if (composite) {
      for (const part of composite) {
        if ((TOKEN_IDS as readonly string[]).includes(part)) {
          b.token(part as TokenId);
        } else {
          b.literal(part);
        }
      }
      i += 2;
      continue;
    }
    if (STRFTIME_SPECS[next]) {
      b.token(STRFTIME_SPECS[next]);
    } else {
      b.unknown(`%${next}`);
    }
    i += 2;
  }
  return b.segments;
}

function parseLetterFormat(
  text: string,
  format: Exclude<FormatId, 'strftime'>,
): Segment[] {
  const { keys, map } = getMatcher(format);
  const b = new SegmentBuilder();
  const n = text.length;
  let i = 0;
  while (i < n) {
    const c = text[i];

    if (format === 'java' && c === "'") {
      if (text[i + 1] === "'") {
        b.literal("'");
        i += 2;
        continue;
      }
      let j = i + 1;
      let quoted = '';
      while (j < n) {
        if (text[j] === "'") {
          if (text[j + 1] === "'") {
            quoted += "'";
            j += 2;
            continue;
          }
          break;
        }
        quoted += text[j];
        j++;
      }
      b.literal(quoted);
      i = j + 1;
      continue;
    }
    if (format === 'dotnet') {
      if (c === "'" || c === '"') {
        const end = text.indexOf(c, i + 1);
        if (end === -1) {
          b.literal(text.slice(i + 1));
          i = n;
        } else {
          b.literal(text.slice(i + 1, end));
          i = end + 1;
        }
        continue;
      }
      if (c === '\\') {
        b.literal(text[i + 1] ?? '');
        i += 2;
        continue;
      }
      if (c === '%') {
        i++;
        continue;
      }
    }
    if (format === 'php' && c === '\\') {
      b.literal(text[i + 1] ?? '');
      i += 2;
      continue;
    }
    if (format === 'moment' && c === '[') {
      const end = text.indexOf(']', i + 1);
      if (end === -1) {
        b.literal('[');
        i++;
      } else {
        b.literal(text.slice(i + 1, end));
        i = end + 1;
      }
      continue;
    }

    const key = keys.find((k) => text.startsWith(k, i));
    if (key) {
      b.token(map.get(key)!);
      i += key.length;
    } else if (LETTER_RE.test(c)) {
      let j = i;
      while (text[j] === c) j++;
      b.unknown(text.slice(i, j));
      i = j;
    } else {
      b.literal(c);
      i++;
    }
  }
  return b.segments;
}

/** 書式文字列をセグメント列に解釈する */
export function parseFormat(text: string, format: FormatId): Segment[] {
  return format === 'strftime'
    ? parseStrftime(text)
    : parseLetterFormat(text, format);
}

function mergeLiterals(segments: Segment[]): Segment[] {
  const out: Segment[] = [];
  for (const s of segments) {
    const last = out[out.length - 1];
    if (s.kind === 'literal' && last && last.kind === 'literal') {
      out[out.length - 1] = { kind: 'literal', text: last.text + s.text };
    } else {
      out.push(s);
    }
  }
  return out;
}

function escapeLiteral(text: string, format: FormatId): string {
  switch (format) {
    case 'strftime':
      return text.replace(/%/g, '%%');
    case 'java': {
      let out = '';
      let open = false;
      for (const ch of text) {
        if (ch === "'") {
          out += "''";
        } else if (LETTER_RE.test(ch)) {
          if (!open) {
            out += "'";
            open = true;
          }
          out += ch;
        } else {
          if (open) {
            out += "'";
            open = false;
          }
          out += ch;
        }
      }
      if (open) out += "'";
      return out;
    }
    case 'php':
      return text.replace(/[A-Za-z\\]/g, (ch) => `\\${ch}`);
    case 'moment':
      return text.replace(/[A-Za-z]+/g, (run) => `[${run}]`);
    case 'dotnet': {
      let out = '';
      let open = false;
      for (const ch of text) {
        if (LETTER_RE.test(ch)) {
          if (!open) {
            out += "'";
            open = true;
          }
          out += ch;
        } else {
          if (open) {
            out += "'";
            open = false;
          }
          if (ch === "'" || ch === '"' || ch === '\\' || ch === '%') {
            out += `\\${ch}`;
          } else {
            out += ch;
          }
        }
      }
      if (open) out += "'";
      return out;
    }
  }
}

export interface RenderResult {
  text: string;
  /** その書式では表せずに省略したトークン */
  unsupported: TokenId[];
  /** 解釈できずに省略した指定（元の表記） */
  dropped: string[];
}

/** セグメント列を指定の書式の文字列に描画する */
export function renderSegments(
  segments: Segment[],
  format: FormatId,
): RenderResult {
  const table = TOKEN_STRINGS[format];
  const unsupported: TokenId[] = [];
  const dropped: string[] = [];
  const kept: Segment[] = [];
  for (const s of segments) {
    if (s.kind === 'token') {
      if (table[s.token] === undefined) {
        if (!unsupported.includes(s.token)) unsupported.push(s.token);
      } else {
        kept.push(s);
      }
    } else if (s.kind === 'unknown') {
      if (!dropped.includes(s.raw)) dropped.push(s.raw);
    } else {
      kept.push(s);
    }
  }
  let text = mergeLiterals(kept)
    .map((s) =>
      s.kind === 'token'
        ? table[s.token]!
        : s.kind === 'literal'
          ? escapeLiteral(s.text, format)
          : '',
    )
    .join('');
  // .NET は 1 文字だけの書式が「標準書式」と解釈されるため % を付ける
  if (format === 'dotnet' && text.length === 1 && /[A-Za-z]/.test(text)) {
    text = `%${text}`;
  }
  return { text, unsupported, dropped };
}

export function renderAll(segments: Segment[]): Record<FormatId, RenderResult> {
  const out = {} as Record<FormatId, RenderResult>;
  for (const f of FORMAT_IDS) out[f] = renderSegments(segments, f);
  return out;
}

// ---- プレビュー（書式で日時を整形） ----

export interface DateParts {
  year: number;
  month: number;
  day: number;
  weekday: number;
  hour: number;
  minute: number;
  second: number;
  millisecond: number;
  dayOfYear: number;
  offsetMinutes: number;
}

export const MONTH_LONG = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];
export const MONTH_SHORT = MONTH_LONG.map((m) => m.slice(0, 3));
export const WEEKDAY_LONG = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
];
export const WEEKDAY_SHORT = WEEKDAY_LONG.map((w) => w.slice(0, 3));

/** offsetMinutes 分ずらした「壁時計」の日時要素を取り出す（UTC は 0） */
export function getDateParts(date: Date, offsetMinutes: number): DateParts {
  const shifted = new Date(date.getTime() + offsetMinutes * 60_000);
  const year = shifted.getUTCFullYear();
  const month = shifted.getUTCMonth() + 1;
  const day = shifted.getUTCDate();
  const startOfYear = Date.UTC(year, 0, 1);
  const today = Date.UTC(year, month - 1, day);
  return {
    year,
    month,
    day,
    weekday: shifted.getUTCDay(),
    hour: shifted.getUTCHours(),
    minute: shifted.getUTCMinutes(),
    second: shifted.getUTCSeconds(),
    millisecond: shifted.getUTCMilliseconds(),
    dayOfYear: Math.round((today - startOfYear) / 86_400_000) + 1,
    offsetMinutes,
  };
}

function pad(n: number, width: number): string {
  return String(n).padStart(width, '0');
}

function formatOffset(minutes: number, colon: boolean): string {
  const sign = minutes < 0 ? '-' : '+';
  const abs = Math.abs(minutes);
  return `${sign}${pad(Math.floor(abs / 60), 2)}${colon ? ':' : ''}${pad(abs % 60, 2)}`;
}

/** セグメント列に従って日時を整形する（月名・曜日名は英語） */
export function formatSegments(segments: Segment[], p: DateParts): string {
  const hour12 = p.hour % 12 === 0 ? 12 : p.hour % 12;
  const values: Record<TokenId, string> = {
    year4: pad(p.year, 4),
    year2: pad(p.year % 100, 2),
    month2: pad(p.month, 2),
    month1: String(p.month),
    monthLong: MONTH_LONG[p.month - 1],
    monthShort: MONTH_SHORT[p.month - 1],
    day2: pad(p.day, 2),
    day1: String(p.day),
    weekdayLong: WEEKDAY_LONG[p.weekday],
    weekdayShort: WEEKDAY_SHORT[p.weekday],
    hour24_2: pad(p.hour, 2),
    hour24_1: String(p.hour),
    hour12_2: pad(hour12, 2),
    hour12_1: String(hour12),
    minute2: pad(p.minute, 2),
    second2: pad(p.second, 2),
    millis3: pad(p.millisecond, 3),
    ampm: p.hour < 12 ? 'AM' : 'PM',
    tzOffset: formatOffset(p.offsetMinutes, false),
    tzOffsetColon: formatOffset(p.offsetMinutes, true),
    dayOfYear3: pad(p.dayOfYear, 3),
  };
  return segments
    .map((s) =>
      s.kind === 'token' ? values[s.token] : s.kind === 'literal' ? s.text : '',
    )
    .join('');
}

// ---- 例文からの検出 ----

export interface DetectResult {
  segments: Segment[];
  /** 検出できた日時の項目数 */
  tokenCount: number;
  /** 日と月の順序などを推測で決めたか */
  ambiguous: boolean;
}

type Item =
  | { t: 'lit'; text: string }
  | { t: 'tok'; token: TokenId }
  | { t: 'num'; text: string }
  | { t: 'hour'; text: string };

const COMPACT_RE =
  /^(?:19|20)\d{2}(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])(?:([01]\d|2[0-3])([0-5]\d)(?:([0-5]\d))?)?(?!\d)/;
const TIME_RE = /^(\d{1,2}):(\d{2})(?::(\d{2})(?:[.,](\d{3})(?!\d))?)?/;
const YEAR4_RE = /^(1[89]|2[01])\d\d$/;

function lookupWord(word: string): TokenId | null {
  const lower = word.toLowerCase();
  const idx = (list: string[]) =>
    list.findIndex((x) => x.toLowerCase() === lower);
  if (idx(MONTH_LONG) >= 0) return 'monthLong';
  if (idx(MONTH_SHORT) >= 0) return 'monthShort';
  if (idx(WEEKDAY_LONG) >= 0) return 'weekdayLong';
  if (idx(WEEKDAY_SHORT) >= 0) return 'weekdayShort';
  if (word === 'AM' || word === 'PM') return 'ampm';
  return null;
}

/** 例文（"2026-10-19 15:04:05" など）から日時の書式を推測する */
export function detectFromSample(rawSample: string): DetectResult {
  // 全角数字は半角に直して判定する（1文字ずつ対応するので位置はずれない）
  const sample = rawSample.replace(/[０-９]/g, (c) =>
    String.fromCharCode(c.charCodeAt(0) - 0xfee0),
  );
  const items: Item[] = [];
  let pos = 0;
  let sawTime = false;

  while (pos < sample.length) {
    const s = sample.slice(pos);
    const prevIsDigit = pos > 0 && /\d/.test(sample[pos - 1]);
    let m: RegExpExecArray | null;

    if (sawTime && (m = /^[+-]\d{2}:\d{2}(?!\d)/.exec(s))) {
      // 符号も書式側のトークンに含まれる
      items.push({ t: 'tok', token: 'tzOffsetColon' });
      pos += m[0].length;
      sawTime = false;
    } else if (sawTime && (m = /^[+-]\d{4}(?!\d)/.exec(s))) {
      items.push({ t: 'tok', token: 'tzOffset' });
      pos += m[0].length;
      sawTime = false;
    } else if (!prevIsDigit && (m = COMPACT_RE.exec(s))) {
      items.push({ t: 'tok', token: 'year4' }, { t: 'tok', token: 'month2' });
      items.push({ t: 'tok', token: 'day2' });
      if (m[3] !== undefined) {
        items.push({ t: 'tok', token: 'hour24_2' });
        items.push({ t: 'tok', token: 'minute2' });
        if (m[5] !== undefined) items.push({ t: 'tok', token: 'second2' });
        sawTime = true;
      }
      pos += m[0].length;
    } else if (!prevIsDigit && (m = TIME_RE.exec(s))) {
      items.push({ t: 'hour', text: m[1] });
      items.push({ t: 'lit', text: ':' });
      items.push({ t: 'tok', token: 'minute2' });
      if (m[3] !== undefined) {
        items.push({ t: 'lit', text: ':' });
        items.push({ t: 'tok', token: 'second2' });
      }
      if (m[4] !== undefined) {
        items.push({ t: 'lit', text: m[0].charAt(m[0].length - 4) });
        items.push({ t: 'tok', token: 'millis3' });
      }
      pos += m[0].length;
      sawTime = true;
    } else if (!prevIsDigit && (m = /^(\d{1,2})(?=時)/.exec(s))) {
      items.push({ t: 'hour', text: m[1] });
      pos += m[0].length;
      sawTime = true;
    } else if (!prevIsDigit && (m = /^(\d{2})(?=分)/.exec(s))) {
      items.push({ t: 'tok', token: 'minute2' });
      pos += m[0].length;
    } else if (!prevIsDigit && (m = /^(\d{2})(?=秒)/.exec(s))) {
      items.push({ t: 'tok', token: 'second2' });
      pos += m[0].length;
    } else if ((m = /^[A-Za-z]+/.exec(s))) {
      const token = lookupWord(m[0]);
      items.push(token ? { t: 'tok', token } : { t: 'lit', text: m[0] });
      pos += m[0].length;
    } else if ((m = /^\d+/.exec(s))) {
      items.push({ t: 'num', text: m[0] });
      pos += m[0].length;
    } else {
      items.push({ t: 'lit', text: s[0] });
      pos += 1;
    }
  }

  let ambiguous = false;
  const hasAmpm = items.some((i) => i.t === 'tok' && i.token === 'ampm');
  const hasName = items.some(
    (i) =>
      i.t === 'tok' && (i.token === 'monthLong' || i.token === 'monthShort'),
  );

  // 時
  items.forEach((it, idx) => {
    if (it.t !== 'hour') return;
    const one = it.text.length === 1;
    items[idx] = {
      t: 'tok',
      token: hasAmpm
        ? one
          ? 'hour12_1'
          : 'hour12_2'
        : one
          ? 'hour24_1'
          : 'hour24_2',
    };
  });

  // 日付の数字
  const numIdx = items
    .map((it, idx) => (it.t === 'num' ? idx : -1))
    .filter((idx) => idx >= 0);
  const text = (idx: number) => (items[idx] as { text: string }).text;
  const yearAt = numIdx.find((idx) => YEAR4_RE.test(text(idx)));
  const restIdx = numIdx.filter(
    (idx) => idx !== yearAt && text(idx).length <= 2,
  );

  const setTok = (idx: number, token: TokenId) => {
    items[idx] = { t: 'tok', token };
  };
  const monthTok = (idx: number): TokenId | null => {
    const v = Number(text(idx));
    if (v < 1 || v > 12) return null;
    return text(idx).length === 1 ? 'month1' : 'month2';
  };
  const dayTok = (idx: number): TokenId | null => {
    const v = Number(text(idx));
    if (v < 1 || v > 31) return null;
    const t = text(idx);
    if (t.length === 1) return 'day1';
    if (t[0] === '0') return 'day2';
    return hasName ? 'day1' : 'day2';
  };
  const assign = (
    idx: number,
    kind: 'month' | 'day' | 'year2',
    ok = true,
  ): void => {
    if (!ok) return;
    if (kind === 'year2') {
      if (text(idx).length === 2) setTok(idx, 'year2');
      return;
    }
    const tok = kind === 'month' ? monthTok(idx) : dayTok(idx);
    if (tok) setTok(idx, tok);
  };
  // 数字の間にある区切りの先頭文字
  const sepBetween = (a: number, b: number): string => {
    let sep = '';
    for (let k = a + 1; k < b; k++) {
      const it = items[k];
      if (it.t === 'lit') sep += it.text;
    }
    return sep[0] ?? '';
  };
  const orderedPair = (
    a: number,
    b: number,
    slashIsMonthFirst: boolean,
  ): ['month' | 'day', 'month' | 'day'] | null => {
    const va = Number(text(a));
    const vb = Number(text(b));
    if (va > 12 && vb <= 12) return ['day', 'month'];
    if (vb > 12 && va <= 12) return ['month', 'day'];
    if (va > 12 && vb > 12) return null;
    ambiguous = true;
    return slashIsMonthFirst ? ['month', 'day'] : ['day', 'month'];
  };

  if (hasName) {
    if (restIdx.length >= 1) assign(restIdx[0], 'day');
    if (yearAt === undefined && restIdx.length >= 2) {
      assign(restIdx[1], 'year2');
    }
  } else if (yearAt !== undefined) {
    const before = restIdx.filter((i) => i < yearAt);
    if (before.length === 0) {
      if (restIdx.length >= 1) assign(restIdx[0], 'month');
      if (restIdx.length >= 2) assign(restIdx[1], 'day');
    } else if (before.length === restIdx.length) {
      if (restIdx.length === 1) {
        assign(restIdx[0], 'month');
      } else if (restIdx.length >= 2) {
        const a = restIdx[restIdx.length - 2];
        const b = restIdx[restIdx.length - 1];
        const order = orderedPair(a, b, sepBetween(a, b) === '/');
        if (order) {
          assign(a, order[0]);
          assign(b, order[1]);
        }
      }
    } else {
      assign(restIdx[0], 'month');
      if (restIdx.length >= 2) assign(restIdx[1], 'day');
    }
  } else if (restIdx.length === 3) {
    const [a, b, c] = restIdx;
    const sep = sepBetween(a, b);
    if (sep === '-') {
      assign(a, 'year2');
      assign(b, 'month');
      assign(c, 'day');
    } else {
      const order = orderedPair(a, b, sep === '/');
      if (order) {
        assign(a, order[0]);
        assign(b, order[1]);
        assign(c, 'year2');
      }
    }
  } else if (restIdx.length === 2) {
    const [a, b] = restIdx;
    const order = orderedPair(a, b, true);
    if (order) {
      assign(a, order[0]);
      assign(b, order[1]);
    }
  }
  if (yearAt !== undefined) setTok(yearAt, 'year4');

  const b = new SegmentBuilder();
  let tokenCount = 0;
  for (const it of items) {
    if (it.t === 'tok') {
      b.token(it.token);
      tokenCount++;
    } else if (it.t === 'lit' || it.t === 'num' || it.t === 'hour') {
      b.literal(it.text);
    }
  }
  return {
    segments: b.segments,
    tokenCount,
    ambiguous: ambiguous && tokenCount > 0,
  };
}
