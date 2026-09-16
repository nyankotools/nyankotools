export interface DateParts {
  year: number;
  month: number;
  day: number;
}

export interface WeeksAndDays {
  weeks: number;
  remainderDays: number;
}

/**
 * 年2000年を経由してUTC日付を構築する。
 * `new Date(year, ...)` や `Date.UTC(year, ...)` に0〜99の年を渡すと
 * 1900年代として解釈される仕様があるため、それを回避する。
 */
function makeUTCDate(year: number, month: number, day: number): Date {
  const date = new Date(Date.UTC(2000, month - 1, day));
  date.setUTCFullYear(year);
  return date;
}

/** 指定した日付が実在するかどうか（うるう年・月末日を考慮） */
export function isValidDate(year: number, month: number, day: number): boolean {
  if (
    !Number.isInteger(year) ||
    !Number.isInteger(month) ||
    !Number.isInteger(day)
  ) {
    return false;
  }
  if (month < 1 || month > 12 || day < 1) return false;
  const date = makeUTCDate(year, month, day);
  return (
    date.getUTCFullYear() === year &&
    date.getUTCMonth() === month - 1 &&
    date.getUTCDate() === day
  );
}

function toUTCDays(year: number, month: number, day: number): number {
  return makeUTCDate(year, month, day).getTime() / 86400000;
}

/**
 * 開始日から終了日までの日数を計算する（終了日 − 開始日）。
 * 終了日が開始日より前の場合は負の値になる。
 * `inclusive` を true にすると、開始日・終了日の両方を1日として数える
 * （民法上の「初日不算入」を採用しない、期間を通算した日数）。
 * どちらかの日付が不正な場合は null。
 */
export function diffInDays(
  start: DateParts,
  end: DateParts,
  inclusive = false,
): number | null {
  if (!isValidDate(start.year, start.month, start.day)) return null;
  if (!isValidDate(end.year, end.month, end.day)) return null;

  const diff =
    toUTCDays(end.year, end.month, end.day) -
    toUTCDays(start.year, start.month, start.day);

  if (!inclusive) return diff;
  if (diff === 0) return 1;
  return diff > 0 ? diff + 1 : diff - 1;
}

/**
 * 基準日に日数を加算した日付を求める（負の値を渡すと過去の日付になる）。
 * 基準日が不正、または日数が整数でない場合は null。
 */
export function addDays(base: DateParts, days: number): DateParts | null {
  if (!isValidDate(base.year, base.month, base.day)) return null;
  if (!Number.isInteger(days)) return null;

  const ms =
    makeUTCDate(base.year, base.month, base.day).getTime() + days * 86400000;
  const result = new Date(ms);
  if (Number.isNaN(result.getTime())) return null;
  return {
    year: result.getUTCFullYear(),
    month: result.getUTCMonth() + 1,
    day: result.getUTCDate(),
  };
}

/** 指定した日付の曜日を返す（0=日曜〜6=土曜）。不正な日付は null。 */
export function getWeekday(
  year: number,
  month: number,
  day: number,
): number | null {
  if (!isValidDate(year, month, day)) return null;
  return makeUTCDate(year, month, day).getUTCDay();
}

/** 日数を「◯週間◯日」に分解する。符号は weeks・remainderDays 両方に反映される。 */
export function toWeeksAndDays(totalDays: number): WeeksAndDays {
  const sign = totalDays < 0 ? -1 : 1;
  const abs = Math.abs(totalDays);
  return {
    weeks: sign * Math.floor(abs / 7),
    remainderDays: sign * (abs % 7),
  };
}
