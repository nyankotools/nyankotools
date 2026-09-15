export type TimestampUnit = 'seconds' | 'milliseconds';

/** この絶対値以上（11桁以上）は秒ではなくミリ秒と判定する */
const MILLISECONDS_THRESHOLD = 1e10;

/** タイムスタンプの数値から単位（秒/ミリ秒）を推定する */
export function detectTimestampUnit(value: number): TimestampUnit {
  return Math.abs(value) >= MILLISECONDS_THRESHOLD ? 'milliseconds' : 'seconds';
}

/** 整数のみを受け付けてタイムスタンプ値をパースする。不正な形式はnull */
export function parseTimestampInput(input: string): number | null {
  const trimmed = input.trim();
  if (!/^-?\d+$/.test(trimmed)) return null;
  const value = Number(trimmed);
  return Number.isSafeInteger(value) ? value : null;
}

export function timestampToDate(
  value: number,
  unit: TimestampUnit,
): Date | null {
  const ms = unit === 'seconds' ? value * 1000 : value;
  const date = new Date(ms);
  return Number.isNaN(date.getTime()) ? null : date;
}

export interface TimestampParts {
  seconds: number;
  milliseconds: number;
}

export function dateToTimestamp(date: Date): TimestampParts {
  const ms = date.getTime();
  return { seconds: Math.floor(ms / 1000), milliseconds: ms };
}

function pad(value: number, length = 2): string {
  return String(value).padStart(length, '0');
}

/** <input type="datetime-local"> にそのまま設定できる形式（ローカル時刻）に整形する */
export function formatDateTimeLocalValue(date: Date): string {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(
    date.getDate(),
  )}T${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
}

/** <input type="datetime-local"> の値（ローカル時刻、秒は省略可）をDateにパースする */
export function parseDateTimeLocalValue(value: string): Date | null {
  const match = value
    .trim()
    .match(/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})(?::(\d{2}))?$/);
  if (!match) return null;
  const [, y, mo, d, h, mi, s] = match;
  const date = new Date(
    Number(y),
    Number(mo) - 1,
    Number(d),
    Number(h),
    Number(mi),
    s ? Number(s) : 0,
  );
  return Number.isNaN(date.getTime()) ? null : date;
}
