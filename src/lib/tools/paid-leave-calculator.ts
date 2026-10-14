import { diffInDays, isValidDate, type DateParts } from './date-calculator';

export const MIN_YEAR = 1900;
export const MAX_YEAR = 2100;

/** 通常の労働者（週5日以上、または週30時間以上）の付与日数。継続勤務 0.5, 1.5, … 6.5年以上 */
export const FULL_TABLE: readonly number[] = [10, 11, 12, 14, 16, 18, 20];

/** 比例付与の付与日数（労基法39条3項・施行規則24条の3）。キーは週所定労働日数 */
export const PROPORTIONAL_TABLE: Readonly<Record<number, readonly number[]>> = {
  4: [7, 8, 9, 10, 12, 13, 15],
  3: [5, 6, 6, 8, 9, 10, 11],
  2: [3, 4, 4, 5, 6, 6, 7],
  1: [1, 2, 2, 2, 3, 3, 3],
};

/** 週所定労働時間がこの値以上なら、週の日数にかかわらず通常付与 */
export const FULL_HOURS_THRESHOLD = 30;
/** 週所定労働日数がこの値以上なら通常付与 */
export const FULL_DAYS_THRESHOLD = 5;
/** 年5日の取得義務の対象になる付与日数 */
export const MANDATORY_TAKE_THRESHOLD = 10;
export const MANDATORY_TAKE_DAYS = 5;

export type LeaveCategory = 'full' | 'proportional';
export type GrantStatus = 'past' | 'current' | 'next' | 'future';

export interface PaidLeaveInput {
  hireDate: DateParts;
  /** 基準日（今日など） */
  reference: DateParts;
  /** 週所定労働日数（1〜7） */
  daysPerWeek: number;
  /** 週所定労働時間。未入力は null */
  hoursPerWeek: number | null;
}

export interface GrantEntry {
  /** 0始まり。0 = 6か月経過時 */
  index: number;
  /** 雇入れからの継続勤務月数（6, 18, 30, …） */
  serviceMonths: number;
  grantDate: DateParts;
  days: number;
  /** 時効により消滅する日（付与日の2年後） */
  expiryDate: DateParts;
  /** 年5日の取得義務の対象（付与日数10日以上） */
  mustTakeFive: boolean;
  status: GrantStatus;
  /** 基準日から付与日までの日数。過ぎていれば負、当日は0 */
  daysFromReference: number;
}

export interface PaidLeaveResult {
  category: LeaveCategory;
  grants: GrantEntry[];
  current: GrantEntry | null;
  next: GrantEntry | null;
  /** 基準日時点で時効にかかっていない付与分の合計（未消化の場合の最大保有日数） */
  maxHeldDays: number;
}

function isUsableDate(date: DateParts): boolean {
  return (
    isValidDate(date.year, date.month, date.day) &&
    date.year >= MIN_YEAR &&
    date.year <= MAX_YEAR
  );
}

function daysInMonth(year: number, month: number): number {
  const d = new Date(Date.UTC(2000, month, 0));
  d.setUTCFullYear(year, month, 0);
  return d.getUTCDate();
}

/** 月を加算する。移動先に同じ日がなければ月末日にする（8/31 + 6か月 = 2/28 or 2/29）。 */
export function addMonths(base: DateParts, months: number): DateParts {
  const total = base.year * 12 + (base.month - 1) + months;
  const year = Math.floor(total / 12);
  const month = (total % 12) + 1;
  return {
    year,
    month,
    day: Math.min(base.day, daysInMonth(year, month)),
  };
}

/**
 * 付与日を求める。応当日がない月（8/31 + 6か月 など）は、期間が月末日に満了するため
 * 付与日は満了の翌日（翌月1日）とする（民法143条）。
 */
export function addMonthsForGrant(base: DateParts, months: number): DateParts {
  const moved = addMonths(base, months);
  if (moved.day === base.day) return moved;
  const next = new Date(Date.UTC(2000, 0, 1));
  next.setUTCFullYear(moved.year, moved.month - 1, moved.day + 1);
  return {
    year: next.getUTCFullYear(),
    month: next.getUTCMonth() + 1,
    day: next.getUTCDate(),
  };
}

/** 週所定労働日数・時間から、通常付与か比例付与かを判定する。範囲外は null。 */
export function classifyWorkPattern(
  daysPerWeek: number,
  hoursPerWeek: number | null,
): LeaveCategory | null {
  if (!Number.isInteger(daysPerWeek) || daysPerWeek < 1 || daysPerWeek > 7) {
    return null;
  }
  if (hoursPerWeek !== null) {
    if (
      !Number.isFinite(hoursPerWeek) ||
      hoursPerWeek <= 0 ||
      hoursPerWeek > 168
    ) {
      return null;
    }
    if (hoursPerWeek >= FULL_HOURS_THRESHOLD) return 'full';
  }
  return daysPerWeek >= FULL_DAYS_THRESHOLD ? 'full' : 'proportional';
}

/**
 * 入社日・勤務形態から、付与日（6か月後、以後1年ごと）と付与日数を求める。
 * 勤務形態は全期間で一定と仮定する。入力が不正なら null。
 * 出勤率8割の要件は満たしている前提で計算する。
 */
export function calculatePaidLeave(
  input: PaidLeaveInput,
): PaidLeaveResult | null {
  const { hireDate, reference, daysPerWeek, hoursPerWeek } = input;
  if (!isUsableDate(hireDate) || !isUsableDate(reference)) return null;
  const category = classifyWorkPattern(daysPerWeek, hoursPerWeek);
  if (!category) return null;
  const table =
    category === 'full' ? FULL_TABLE : PROPORTIONAL_TABLE[daysPerWeek];

  // 法定表の7回分は必ず作り、基準日を過ぎた分とその次の1回まで（6.5年以降は毎年同じ日数）続ける
  const grants: GrantEntry[] = [];
  for (let index = 0; index < 200; index++) {
    const previous = grants[index - 1];
    if (index >= table.length && previous && previous.daysFromReference > 0) {
      break;
    }
    const days = table[Math.min(index, table.length - 1)];
    const serviceMonths = 6 + index * 12;
    const grantDate = addMonthsForGrant(hireDate, serviceMonths);
    const expiryDate = addMonths(grantDate, 24);
    const daysFromReference = diffInDays(reference, grantDate, false) ?? 0;
    grants.push({
      index,
      serviceMonths,
      grantDate,
      days,
      expiryDate,
      mustTakeFive: days >= MANDATORY_TAKE_THRESHOLD,
      status: 'future',
      daysFromReference,
    });
  }

  let currentIdx = -1;
  grants.forEach((g, i) => {
    if (g.daysFromReference <= 0) currentIdx = i;
  });
  const nextIdx = currentIdx + 1 < grants.length ? currentIdx + 1 : -1;
  grants.forEach((g, i) => {
    if (i < currentIdx) g.status = 'past';
    else if (i === currentIdx) g.status = 'current';
    else if (i === nextIdx) g.status = 'next';
  });

  let maxHeldDays = 0;
  for (const g of grants) {
    if (g.daysFromReference > 0) continue;
    const untilExpiry = diffInDays(reference, g.expiryDate, false) ?? 0;
    // 付与日から2年後の同日に時効消滅する（その日は含まない）
    if (untilExpiry > 0) maxHeldDays += g.days;
  }

  return {
    category,
    grants,
    current: currentIdx >= 0 ? grants[currentIdx] : null,
    next: nextIdx >= 0 ? grants[nextIdx] : null,
    maxHeldDays,
  };
}
