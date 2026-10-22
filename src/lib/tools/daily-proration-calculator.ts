export type ProrationBasis = 'calendar' | 'thirty' | 'year365';
export type ProrationRounding = 'floor' | 'round' | 'ceil';

export type ProrationError =
  'amount' | 'days' | 'month' | 'date' | 'order' | 'range';

export type ProrationPeriod =
  | {
      kind: 'days';
      /** 対象日数（整数） */
      days: number;
      /** 対象月（"YYYY-MM"）。基準が「その月の暦日数」のとき必須 */
      month: string;
    }
  | {
      kind: 'range';
      /** 開始日（"YYYY-MM-DD"、当日を含む） */
      start: string;
      /** 終了日（"YYYY-MM-DD"、当日を含む） */
      end: string;
    };

export interface ProrationInput {
  /** 月額（円など。0より大きい有限値） */
  amount: number;
  basis: ProrationBasis;
  rounding: ProrationRounding;
  period: ProrationPeriod;
}

export interface ProrationSegment {
  year: number;
  month: number;
  days: number;
  daysInMonth: number;
}

export interface ProrationResult {
  /** 端数処理後の日割額 */
  amount: number;
  /** 端数処理前の日割額 */
  rawAmount: number;
  /** 対象日数（開始日・終了日を含む） */
  days: number;
  /** 1日あたりの金額（端数処理前）。期間が複数月にまたがる暦日数基準では null */
  dailyRate: number | null;
  /** 月ごとの内訳（暦日数基準でのみ。それ以外は空） */
  segments: ProrationSegment[];
}

export type ProrationOutcome =
  { ok: true; result: ProrationResult } | { ok: false; error: ProrationError };

/** 年換算の日数 */
export const DAYS_IN_YEAR = 365;
/** 30日基準の日数 */
export const DAYS_IN_MONTH_FIXED = 30;
/** 開始日・終了日の指定で許す最大日数（約10年） */
export const MAX_RANGE_DAYS = 3660;
/** 日数を直接入力するときの上限 */
export const MAX_DIRECT_DAYS = 366;

export function isLeapYear(year: number): boolean {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
}

/** month は 1〜12 */
export function daysInMonth(year: number, month: number): number {
  if (month === 2) return isLeapYear(year) ? 29 : 28;
  return [4, 6, 9, 11].includes(month) ? 30 : 31;
}

function parseMonth(value: string): { year: number; month: number } | null {
  const m = /^(\d{4})-(\d{2})$/.exec(value.trim());
  if (!m) return null;
  const year = Number(m[1]);
  const month = Number(m[2]);
  if (year < 1 || month < 1 || month > 12) return null;
  return { year, month };
}

function parseDate(
  value: string,
): { year: number; month: number; day: number } | null {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value.trim());
  if (!m) return null;
  const year = Number(m[1]);
  const month = Number(m[2]);
  const day = Number(m[3]);
  if (year < 1 || month < 1 || month > 12 || day < 1) return null;
  if (day > daysInMonth(year, month)) return null;
  return { year, month, day };
}

/** 年月日から通し日数（UTC基準の日番号）を返す */
function dayNumber(year: number, month: number, day: number): number {
  const d = new Date(0);
  d.setUTCFullYear(year, month - 1, day);
  d.setUTCHours(0, 0, 0, 0);
  return Math.round(d.getTime() / 86400000);
}

/** 浮動小数点の誤差（例: 2.9999999999）で切捨て・切上げがずれないよう丸める */
function applyRounding(value: number, rounding: ProrationRounding): number {
  const v = Math.round(value * 1e6) / 1e6;
  if (rounding === 'floor') return Math.floor(v);
  if (rounding === 'ceil') return Math.ceil(v);
  return Math.round(v);
}

/**
 * 月額から日割額を求める。
 * - 基準 calendar: その月の暦日数で割る（開始日・終了日が複数月にまたがる場合は月ごとに按分して合算）
 * - 基準 thirty: 月額 ÷ 30 × 日数
 * - 基準 year365: 月額 × 12 ÷ 365 × 日数（年換算）
 * 端数処理は最後に1回だけ行う。入力が不正な場合は理由付きで失敗を返す。
 */
export function calculateProration(input: ProrationInput): ProrationOutcome {
  const { amount, basis, rounding, period } = input;
  if (!(Number.isFinite(amount) && amount > 0)) {
    return { ok: false, error: 'amount' };
  }

  let days: number;
  let segments: ProrationSegment[] = [];

  if (period.kind === 'days') {
    if (
      !Number.isInteger(period.days) ||
      period.days < 0 ||
      period.days > MAX_DIRECT_DAYS
    ) {
      return { ok: false, error: 'days' };
    }
    days = period.days;
    if (basis === 'calendar') {
      const ym = parseMonth(period.month);
      if (!ym) return { ok: false, error: 'month' };
      const dim = daysInMonth(ym.year, ym.month);
      if (days > dim) return { ok: false, error: 'days' };
      segments = [{ year: ym.year, month: ym.month, days, daysInMonth: dim }];
    }
  } else {
    const start = parseDate(period.start);
    const end = parseDate(period.end);
    if (!start || !end) return { ok: false, error: 'date' };
    const startNum = dayNumber(start.year, start.month, start.day);
    const endNum = dayNumber(end.year, end.month, end.day);
    if (startNum > endNum) return { ok: false, error: 'order' };
    days = endNum - startNum + 1;
    if (days > MAX_RANGE_DAYS) return { ok: false, error: 'range' };
    if (basis === 'calendar') {
      let { year, month } = start;
      for (;;) {
        const dim = daysInMonth(year, month);
        const first = year === start.year && month === start.month;
        const last = year === end.year && month === end.month;
        const from = first ? start.day : 1;
        const to = last ? end.day : dim;
        segments.push({ year, month, days: to - from + 1, daysInMonth: dim });
        if (last) break;
        month += 1;
        if (month > 12) {
          month = 1;
          year += 1;
        }
      }
    }
  }

  let rawAmount: number;
  let dailyRate: number | null;
  if (basis === 'calendar') {
    rawAmount = segments.reduce(
      (sum, s) => sum + (amount * s.days) / s.daysInMonth,
      0,
    );
    dailyRate = segments.length === 1 ? amount / segments[0].daysInMonth : null;
  } else if (basis === 'thirty') {
    rawAmount = (amount * days) / DAYS_IN_MONTH_FIXED;
    dailyRate = amount / DAYS_IN_MONTH_FIXED;
  } else {
    rawAmount = (amount * 12 * days) / DAYS_IN_YEAR;
    dailyRate = (amount * 12) / DAYS_IN_YEAR;
  }

  return {
    ok: true,
    result: {
      amount: applyRounding(rawAmount, rounding),
      rawAmount,
      days,
      dailyRate,
      segments,
    },
  };
}
