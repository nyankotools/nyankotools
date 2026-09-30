import { diffInDays, isValidDate, type DateParts } from './date-calculator';

export interface PreciseAge {
  years: number;
  months: number;
  days: number;
}

export interface NextBirthday {
  date: DateParts;
  daysUntil: number;
  ageAtNextBirthday: number;
}

/** birthを基準に、うるう年の2/29が存在しない年ではday-1（2/28）に丸めた誕生日相当の日付を作る */
function birthdayInYear(birth: DateParts, year: number): DateParts {
  if (isValidDate(year, birth.month, birth.day)) {
    return { year, month: birth.month, day: birth.day };
  }
  return { year, month: birth.month, day: birth.day - 1 };
}

const DAYS_IN_MONTH = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

function isLeapYear(year: number): boolean {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
}

function daysInMonth(year: number, month: number): number {
  if (month === 2) return isLeapYear(year) ? 29 : 28;
  return DAYS_IN_MONTH[month - 1];
}

function addMonthsClamped(date: DateParts, months: number): DateParts {
  const totalMonths = date.year * 12 + (date.month - 1) + months;
  const year = Math.floor(totalMonths / 12);
  const month = (totalMonths % 12) + 1;
  const day = Math.min(date.day, daysInMonth(year, month));
  return { year, month, day };
}

function isValidPair(birth: DateParts, reference: DateParts): boolean {
  return (
    isValidDate(birth.year, birth.month, birth.day) &&
    isValidDate(reference.year, reference.month, reference.day)
  );
}

/**
 * 満年齢（誕生日を迎えたかどうかで判定する一般的な数え方）を計算する。
 * 基準日が生年月日より前の場合や、日付が不正な場合はnull。
 */
export function calculateFullAge(
  birth: DateParts,
  reference: DateParts,
): number | null {
  if (!isValidPair(birth, reference)) return null;
  const diff = diffInDays(birth, reference, false);
  if (diff === null || diff < 0) return null;

  // 2/29生まれはbirthdayInYearが非うるう年で2/28に丸めるため、
  // 「誕生日を迎えたか」の判定もbirth.month/dayの単純比較ではなく
  // 同じ丸め後の日付を基準に行う（2/28を誕生日相当として扱う）。
  const birthdayThisYear = birthdayInYear(birth, reference.year);
  const hasHadBirthdayThisYear =
    diffInDays(birthdayThisYear, reference, false)! >= 0;
  return hasHadBirthdayThisYear
    ? reference.year - birth.year
    : reference.year - birth.year - 1;
}

/** 満年齢を「◯歳◯ヶ月◯日」の形で細かく計算する */
export function calculatePreciseAge(
  birth: DateParts,
  reference: DateParts,
): PreciseAge | null {
  const years = calculateFullAge(birth, reference);
  if (years === null) return null;

  const afterYears = birthdayInYear(birth, birth.year + years);
  let cursor = afterYears;
  let months = 0;
  while (true) {
    // 月末クランプ後の日付を起点に足すと日付がずれていくため、常に誕生日（起点）から数える
    const next = addMonthsClamped(afterYears, months + 1);
    const diff = diffInDays(next, reference, false)!;
    if (diff < 0) break;
    cursor = next;
    months++;
  }
  const days = diffInDays(cursor, reference, false)!;
  return { years, months, days };
}

/**
 * 数え年（生まれた年を1歳とし、以後元日ごとに加齢する伝統的な数え方）を計算する。
 * 誕生日を迎えたかどうかに関わらず、暦年の差 + 1 で求まる。
 */
export function calculateKazoedoshi(
  birth: DateParts,
  reference: DateParts,
): number | null {
  if (!isValidPair(birth, reference)) return null;
  const diff = diffInDays(birth, reference, false);
  if (diff === null || diff < 0) return null;
  return reference.year - birth.year + 1;
}

/** 生まれた日を1日目として、基準日までに生きてきた日数を計算する */
export function calculateDaysLived(
  birth: DateParts,
  reference: DateParts,
): number | null {
  if (!isValidPair(birth, reference)) return null;
  const diff = diffInDays(birth, reference, false);
  if (diff === null || diff < 0) return null;
  return diff + 1;
}

/**
 * 基準日以降で直近の誕生日（うるう年の2/29生まれは非うるう年では2/28扱い）を求める。
 * 基準日自体が誕生日ならdaysUntilは0になる。
 */
export function calculateNextBirthday(
  birth: DateParts,
  reference: DateParts,
): NextBirthday | null {
  if (!isValidPair(birth, reference)) return null;
  if (diffInDays(birth, reference, false)! < 0) return null;

  for (const yearOffset of [0, 1]) {
    const candidate = birthdayInYear(birth, reference.year + yearOffset);
    const daysUntil = diffInDays(reference, candidate, false)!;
    if (daysUntil >= 0) {
      const ageAtNextBirthday = calculateFullAge(birth, candidate)!;
      return { date: candidate, daysUntil, ageAtNextBirthday };
    }
  }
  return null;
}
