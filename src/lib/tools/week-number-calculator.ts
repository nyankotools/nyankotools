/**
 * ISO 8601 週番号の計算。すべて UTC 基準の純粋な暦計算で、
 * Date のローカル時刻・タイムゾーンには依存しない。
 */

export interface DateParts {
  year: number;
  month: number;
  day: number;
}

export interface WeekInfo {
  /** ISO週年（暦年と異なる場合がある） */
  isoYear: number;
  /** ISO週番号 1〜53 */
  week: number;
  /** ISO曜日 1=月 … 7=日 */
  isoWeekday: number;
  /** 曜日 0=日 … 6=土 */
  weekday: number;
  /** 年の何日目か（1始まり） */
  dayOfYear: number;
  /** 年の残り日数（当日を含まない） */
  daysRemaining: number;
  daysInYear: number;
  /** 暦上の四半期 1〜4 */
  quarter: number;
  /** その ISO週年の週数（52 または 53） */
  weeksInIsoYear: number;
  /** その週の月曜日・日曜日 */
  weekStart: DateParts;
  weekEnd: DateParts;
}

const MS_PER_DAY = 86_400_000;
const MIN_YEAR = 1;
const MAX_YEAR = 9999;

export function isLeapYear(year: number): boolean {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
}

/** 1970-01-01 からの通算日数（UTC）。0〜99年も正しく扱う */
function toEpochDay(year: number, month: number, day: number): number {
  const d = new Date(0);
  d.setUTCFullYear(year, month - 1, day);
  d.setUTCHours(0, 0, 0, 0);
  return Math.round(d.getTime() / MS_PER_DAY);
}

function fromEpochDay(epochDay: number): DateParts {
  const d = new Date(epochDay * MS_PER_DAY);
  return {
    year: d.getUTCFullYear(),
    month: d.getUTCMonth() + 1,
    day: d.getUTCDate(),
  };
}

export function isValidDate(year: number, month: number, day: number): boolean {
  if (
    !Number.isInteger(year) ||
    !Number.isInteger(month) ||
    !Number.isInteger(day)
  ) {
    return false;
  }
  if (year < MIN_YEAR || year > MAX_YEAR) return false;
  if (month < 1 || month > 12) return false;
  if (day < 1) return false;
  const dim = [
    31,
    isLeapYear(year) ? 29 : 28,
    31,
    30,
    31,
    30,
    31,
    31,
    30,
    31,
    30,
    31,
  ];
  return day <= dim[month - 1];
}

/** 曜日（0=日〜6=土）。不正な日付は null */
export function getWeekday(
  year: number,
  month: number,
  day: number,
): number | null {
  if (!isValidDate(year, month, day)) return null;
  // 1970-01-01 は木曜
  return (((toEpochDay(year, month, day) + 4) % 7) + 7) % 7;
}

function isoWeekdayOfEpochDay(epochDay: number): number {
  const w = (((epochDay + 4) % 7) + 7) % 7;
  return w === 0 ? 7 : w;
}

/** その ISO週年の週数（52 or 53）。12/28 は必ず最終週に含まれる */
export function weeksInIsoYear(isoYear: number): number {
  return computeIso(toEpochDay(isoYear, 12, 28)).week;
}

function computeIso(epochDay: number): { isoYear: number; week: number } {
  const isoWd = isoWeekdayOfEpochDay(epochDay);
  // その週の木曜日が属する年が ISO週年
  const thursday = epochDay - (isoWd - 1) + 3;
  const isoYear = fromEpochDay(thursday).year;
  const week = Math.floor((thursday - toEpochDay(isoYear, 1, 1)) / 7) + 1;
  return { isoYear, week };
}

/** 日付から ISO週番号などを求める。不正な日付は null */
export function getWeekInfo(
  year: number,
  month: number,
  day: number,
): WeekInfo | null {
  if (!isValidDate(year, month, day)) return null;
  const epochDay = toEpochDay(year, month, day);
  const { isoYear, week } = computeIso(epochDay);
  const isoWeekday = isoWeekdayOfEpochDay(epochDay);
  const daysInYear = isLeapYear(year) ? 366 : 365;
  const dayOfYear = epochDay - toEpochDay(year, 1, 1) + 1;
  const mondayDay = epochDay - (isoWeekday - 1);
  return {
    isoYear,
    week,
    isoWeekday,
    weekday: isoWeekday % 7,
    dayOfYear,
    daysRemaining: daysInYear - dayOfYear,
    daysInYear,
    quarter: Math.ceil(month / 3),
    weeksInIsoYear: weeksInIsoYear(isoYear),
    weekStart: fromEpochDay(mondayDay),
    weekEnd: fromEpochDay(mondayDay + 6),
  };
}

/**
 * ISO週年と週番号から、その週の月曜〜日曜を求める。
 * 週番号がその年に存在しない場合や、結果が西暦1〜9999年を外れる場合は null
 */
export function getWeekRange(
  isoYear: number,
  week: number,
): { start: DateParts; end: DateParts } | null {
  if (!Number.isInteger(isoYear) || !Number.isInteger(week)) return null;
  if (isoYear < MIN_YEAR || isoYear > MAX_YEAR) return null;
  if (week < 1 || week > weeksInIsoYear(isoYear)) return null;
  // 1月4日を含む週が第1週
  const jan4 = toEpochDay(isoYear, 1, 4);
  const week1Monday = jan4 - (isoWeekdayOfEpochDay(jan4) - 1);
  const monday = week1Monday + (week - 1) * 7;
  const start = fromEpochDay(monday);
  const end = fromEpochDay(monday + 6);
  if (start.year < MIN_YEAR || end.year > MAX_YEAR) return null;
  return { start, end };
}
