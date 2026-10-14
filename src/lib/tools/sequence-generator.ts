/** 1回に生成できる最大件数 */
export const MAX_COUNT = 10000;
/** ゼロ埋め桁数の上限 */
export const MAX_PAD = 20;
/** 日付の間隔の上限 */
export const MAX_INTERVAL = 1000;

export type SequenceError =
  | 'invalidStart'
  | 'invalidStep'
  | 'zeroStep'
  | 'invalidCount'
  | 'invalidEnd'
  | 'invalidPad'
  | 'invalidInterval'
  | 'unreachableEnd'
  | 'tooMany'
  | 'outOfRange'
  | 'notEnough';

export type SequenceResult =
  { ok: true; values: string[] } | { ok: false; error: SequenceError };

export interface NumberSequenceOptions {
  start: number;
  step: number;
  limit: { kind: 'count'; count: number } | { kind: 'end'; end: number };
  /** ゼロ埋めの最小桁数（0 で埋めない。符号は桁数に含めない） */
  pad: number;
  prefix?: string;
  suffix?: string;
}

function isInt(n: number): boolean {
  return Number.isSafeInteger(n);
}

function isValidCount(n: number): boolean {
  return isInt(n) && n >= 1 && n <= MAX_COUNT;
}

export function formatNumber(
  value: number,
  pad: number,
  prefix = '',
  suffix = '',
): string {
  const sign = value < 0 ? '-' : '';
  const digits = String(Math.abs(value)).padStart(pad, '0');
  return `${prefix}${sign}${digits}${suffix}`;
}

export function generateNumberSequence(
  options: NumberSequenceOptions,
): SequenceResult {
  const { start, step, limit, pad, prefix = '', suffix = '' } = options;
  if (!isInt(start)) return { ok: false, error: 'invalidStart' };
  if (!isInt(step)) return { ok: false, error: 'invalidStep' };
  if (step === 0) return { ok: false, error: 'zeroStep' };
  if (!isInt(pad) || pad < 0 || pad > MAX_PAD) {
    return { ok: false, error: 'invalidPad' };
  }
  let count: number;
  if (limit.kind === 'count') {
    if (!isValidCount(limit.count)) return { ok: false, error: 'invalidCount' };
    count = limit.count;
  } else {
    if (!isInt(limit.end)) return { ok: false, error: 'invalidEnd' };
    const span = limit.end - start;
    if (span !== 0 && Math.sign(span) !== Math.sign(step)) {
      return { ok: false, error: 'unreachableEnd' };
    }
    count = Math.floor(span / step) + 1;
    if (count > MAX_COUNT) return { ok: false, error: 'tooMany' };
  }
  const values: string[] = [];
  for (let i = 0; i < count; i++) {
    const v = start + i * step;
    if (!isInt(v)) return { ok: false, error: 'outOfRange' };
    values.push(formatNumber(v, pad, prefix, suffix));
  }
  return { ok: true, values };
}

export type DateUnit = 'day' | 'week' | 'month';

export interface DateSequenceOptions {
  /** YYYY-MM-DD */
  start: string;
  limit: { kind: 'count'; count: number } | { kind: 'end'; end: string };
  interval: number;
  unit: DateUnit;
  /** YYYY / YY / MM / M / DD / D を置換する */
  format: string;
  /** 曜日名（日曜始まりの7要素）。指定すると weekdayTemplate で曜日を付ける */
  weekdayNames?: string[];
  /** {date} と {weekday} を含むテンプレート */
  weekdayTemplate?: string;
  skipWeekends: boolean;
}

interface Ymd {
  y: number;
  m: number;
  d: number;
}

export function parseDate(text: string): Ymd | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(text.trim());
  if (!match) return null;
  const y = Number(match[1]);
  const m = Number(match[2]);
  const d = Number(match[3]);
  if (y < 1 || m < 1 || m > 12 || d < 1) return null;
  if (d > daysInMonth(y, m)) return null;
  return { y, m, d };
}

export function daysInMonth(y: number, m: number): number {
  const date = new Date(0);
  date.setUTCFullYear(y, m, 0);
  return date.getUTCDate();
}

function toDayNumber({ y, m, d }: Ymd): number {
  const date = new Date(0);
  date.setUTCFullYear(y, m - 1, d);
  return Math.round(date.getTime() / 86400000);
}

function fromDayNumber(n: number): Ymd | null {
  const date = new Date(n * 86400000);
  const y = date.getUTCFullYear();
  if (Number.isNaN(y) || y < 1 || y > 9999) return null;
  return { y, m: date.getUTCMonth() + 1, d: date.getUTCDate() };
}

/** 0=日曜 */
export function weekdayOf(n: number): number {
  return (((n + 4) % 7) + 7) % 7;
}

export function formatDate({ y, m, d }: Ymd, format: string): string {
  const p2 = (n: number) => String(n).padStart(2, '0');
  return format.replace(/YYYY|YY|MM|DD|M|D/g, (token) => {
    switch (token) {
      case 'YYYY':
        return String(y).padStart(4, '0');
      case 'YY':
        return p2(y % 100);
      case 'MM':
        return p2(m);
      case 'M':
        return String(m);
      case 'DD':
        return p2(d);
      default:
        return String(d);
    }
  });
}

function nthDate(
  start: Ymd,
  startDay: number,
  index: number,
  interval: number,
  unit: DateUnit,
): { ymd: Ymd; day: number } | null {
  if (unit === 'month') {
    const total = start.m - 1 + index * interval;
    const y = start.y + Math.floor(total / 12);
    const m = (total % 12) + 1;
    if (y > 9999) return null;
    const d = Math.min(start.d, daysInMonth(y, m));
    const ymd = { y, m, d };
    return { ymd, day: toDayNumber(ymd) };
  }
  const day = startDay + index * interval * (unit === 'week' ? 7 : 1);
  const ymd = fromDayNumber(day);
  return ymd ? { ymd, day } : null;
}

export function generateDateSequence(
  options: DateSequenceOptions,
): SequenceResult {
  const { limit, interval, unit, format, skipWeekends } = options;
  const start = parseDate(options.start);
  if (!start) return { ok: false, error: 'invalidStart' };
  if (!isInt(interval) || interval < 1 || interval > MAX_INTERVAL) {
    return { ok: false, error: 'invalidInterval' };
  }
  const startDay = toDayNumber(start);
  let maxCount = MAX_COUNT + 1;
  let endDay = Infinity;
  if (limit.kind === 'count') {
    if (!isValidCount(limit.count)) return { ok: false, error: 'invalidCount' };
    maxCount = limit.count;
  } else {
    const end = parseDate(limit.end);
    if (!end) return { ok: false, error: 'invalidEnd' };
    endDay = toDayNumber(end);
    if (endDay < startDay) return { ok: false, error: 'unreachableEnd' };
  }
  const names = options.weekdayNames;
  const template = options.weekdayTemplate ?? '{date} ({weekday})';
  const values: string[] = [];
  // 土日除外で永久に進まない設定（例: 土曜開始・7日間隔）を打ち切る
  const iterationCap = MAX_COUNT * 10;
  for (let i = 0; i < iterationCap && values.length < maxCount; i++) {
    const item = nthDate(start, startDay, i, interval, unit);
    if (!item) break;
    if (item.day > endDay) break;
    const wd = weekdayOf(item.day);
    if (skipWeekends && (wd === 0 || wd === 6)) continue;
    const base = formatDate(item.ymd, format);
    const text =
      names && names.length === 7
        ? template
            .replace('{date}', () => base)
            .replace('{weekday}', () => names[wd])
        : base;
    values.push(text);
  }
  if (values.length > MAX_COUNT) return { ok: false, error: 'tooMany' };
  if (values.length === 0) return { ok: false, error: 'notEnough' };
  if (limit.kind === 'count' && values.length < maxCount) {
    return { ok: false, error: 'notEnough' };
  }
  return { ok: true, values };
}

export type Separator = 'newline' | 'comma' | 'space' | 'tab';

export function joinValues(values: string[], separator: Separator): string {
  switch (separator) {
    case 'comma':
      return values.join(', ');
    case 'space':
      return values.join(' ');
    case 'tab':
      return values.join('\t');
    default:
      return values.join('\n');
  }
}
