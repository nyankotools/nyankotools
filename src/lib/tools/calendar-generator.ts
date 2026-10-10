import { getHolidays, type HolidayKey } from './business-day-calculator';

/** 対応年の範囲。祝日の表示は business-day-calculator の対応範囲（2000〜2099年）のみ */
export const MIN_YEAR = 1900;
export const MAX_YEAR = 2100;

/** 週の開始曜日（0=日曜, 1=月曜） */
export type WeekStart = 0 | 1;

export interface CalendarDay {
  day: number;
  /** 曜日（0=日〜6=土） */
  dow: number;
  /** YYYY-MM-DD */
  iso: string;
  /** 祝日の種別（祝日表示がオフ、または祝日でなければ null） */
  holiday: HolidayKey | null;
}

export interface CalendarWeek {
  /** ISO 8601 の週番号（月曜始まりの週で、木曜日が属する年の第何週か） */
  weekNumber: number;
  /** 7要素。その月に含まれない日は null */
  days: (CalendarDay | null)[];
}

export interface CalendarMonth {
  year: number;
  /** 1〜12 */
  month: number;
  weeks: CalendarWeek[];
  /** その月の祝日（日付順）。祝日表示がオフなら空 */
  holidays: CalendarDay[];
}

export interface CalendarOptions {
  weekStart: WeekStart;
  /** 日本の祝日を付ける */
  holidays: boolean;
}

function pad(n: number): string {
  return String(n).padStart(2, '0');
}

export function isValidYear(year: number): boolean {
  return Number.isInteger(year) && year >= MIN_YEAR && year <= MAX_YEAR;
}

export function isValidMonth(month: number): boolean {
  return Number.isInteger(month) && month >= 1 && month <= 12;
}

/** うるう年かどうか（グレゴリオ暦） */
export function isLeapYear(year: number): boolean {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
}

export function daysInMonth(year: number, month: number): number {
  if (month === 2) return isLeapYear(year) ? 29 : 28;
  return [4, 6, 9, 11].includes(month) ? 30 : 31;
}

/** 曜日（0=日〜6=土）。Date の1900年未満の補正を避けるため Zeller 系の式で求める */
export function dayOfWeek(year: number, month: number, day: number): number {
  const t = [0, 3, 2, 5, 0, 3, 5, 1, 4, 6, 2, 4];
  const y = month < 3 ? year - 1 : year;
  return (
    (y +
      Math.floor(y / 4) -
      Math.floor(y / 100) +
      Math.floor(y / 400) +
      t[month - 1] +
      day) %
    7
  );
}

/** 年内の通し日数（1/1 = 1） */
function dayOfYear(year: number, month: number, day: number): number {
  let n = day;
  for (let m = 1; m < month; m++) n += daysInMonth(year, m);
  return n;
}

/** ISO 8601 の週番号（1〜53） */
export function isoWeekNumber(
  year: number,
  month: number,
  day: number,
): number {
  const isoDow = dayOfWeek(year, month, day) || 7; // 月=1 … 日=7
  const week = Math.floor((dayOfYear(year, month, day) - isoDow + 10) / 7);
  if (week < 1) return weeksInIsoYear(year - 1);
  if (week > weeksInIsoYear(year)) return 1;
  return week;
}

/** ISO 8601 でその年が何週あるか（52 または 53） */
function weeksInIsoYear(year: number): number {
  // 1/1 が木曜、またはうるう年で 1/1 が水曜なら 53 週
  const jan1 = dayOfWeek(year, 1, 1);
  return jan1 === 4 || (isLeapYear(year) && jan1 === 3) ? 53 : 52;
}

/** 指定月の月間カレンダー（週ごとの配列）を作る。範囲外の年月は null */
export function buildMonth(
  year: number,
  month: number,
  options: CalendarOptions,
): CalendarMonth | null {
  if (!isValidYear(year) || !isValidMonth(month)) return null;

  const holidayMap = new Map<string, HolidayKey>();
  if (options.holidays) {
    for (const h of getHolidays(year)) holidayMap.set(h.date, h.key);
  }

  const total = daysInMonth(year, month);
  const offset = (dayOfWeek(year, month, 1) - options.weekStart + 7) % 7;
  const weeks: CalendarWeek[] = [];
  const holidays: CalendarDay[] = [];
  let cells: (CalendarDay | null)[] = Array(offset).fill(null);

  for (let day = 1; day <= total; day++) {
    const iso = `${String(year).padStart(4, '0')}-${pad(month)}-${pad(day)}`;
    const cell: CalendarDay = {
      day,
      dow: dayOfWeek(year, month, day),
      iso,
      holiday: holidayMap.get(iso) ?? null,
    };
    if (cell.holiday) holidays.push(cell);
    cells.push(cell);
    if (cells.length === 7 || day === total) {
      while (cells.length < 7) cells.push(null);
      // 日曜は前の週に属するため、月〜土の日があればそれで週番号を求める
      const present = cells.filter((c): c is CalendarDay => c !== null);
      const ref = present.find((c) => c.dow !== 0) ?? present[0];
      weeks.push({
        weekNumber: isoWeekNumber(year, month, ref.day),
        days: cells,
      });
      cells = [];
    }
  }

  return { year, month, weeks, holidays };
}

/** 指定年の12か月分 */
export function buildYear(
  year: number,
  options: CalendarOptions,
): CalendarMonth[] | null {
  if (!isValidYear(year)) return null;
  return Array.from(
    { length: 12 },
    (_, i) => buildMonth(year, i + 1, options) as CalendarMonth,
  );
}

/** 週の並びに合わせた曜日の並び（0=日〜6=土） */
export function weekdayOrder(weekStart: WeekStart): number[] {
  return Array.from({ length: 7 }, (_, i) => (i + weekStart) % 7);
}
