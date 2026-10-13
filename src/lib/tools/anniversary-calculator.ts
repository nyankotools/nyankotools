import {
  addDays,
  diffInDays,
  getWeekday,
  isValidDate,
  type DateParts,
} from './date-calculator';

export type { DateParts };

export type MilestoneKind = 'days' | 'months' | 'years';

/**
 * 2月29日起点の「年」記念日で、平年に応当日がないときの扱い。
 * - `feb28`: 2月28日（月末日。民法143条2項の「応当日がなければ月末」に倣う）
 * - `mar1`: 3月1日
 */
export type LeapDayPolicy = 'feb28' | 'mar1';

export interface Milestone {
  /** 日数・か月数・年数 */
  n: number;
  date: DateParts;
  /** 0=日曜〜6=土曜 */
  weekday: number;
  /** 基準日から記念日までの日数（未来は正、過去は負、当日は0） */
  daysFromBase: number;
}

export interface MilestoneOptions {
  /** true: 起点日を1日目として数える（N日目 = 起点日 + N-1日） */
  inclusive: boolean;
  leapDayPolicy: LeapDayPolicy;
}

export const DEFAULT_DAY_MILESTONES = [
  50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 1000, 1500, 2000, 3000, 5000,
  10000,
];
export const DEFAULT_MONTH_MILESTONES = [
  1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 18, 24, 30, 36,
];
export const DEFAULT_YEAR_MILESTONES = Array.from(
  { length: 50 },
  (_, i) => i + 1,
);

const MIN_YEAR = 1;
const MAX_YEAR = 9999;

function inRange(d: DateParts | null): d is DateParts {
  return d !== null && d.year >= MIN_YEAR && d.year <= MAX_YEAR;
}

/** `YYYY-MM-DD`（`<input type="date">` の値）を解析する。不正・範囲外は null。 */
export function parseISODate(value: string): DateParts | null {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value.trim());
  if (!m) return null;
  const year = Number(m[1]);
  const month = Number(m[2]);
  const day = Number(m[3]);
  if (year < MIN_YEAR || !isValidDate(year, month, day)) return null;
  return { year, month, day };
}

/** `YYYY-MM-DD` に整形する */
export function formatISODate(d: DateParts): string {
  const p = (n: number, w: number) => String(n).padStart(w, '0');
  return `${p(d.year, 4)}-${p(d.month, 2)}-${p(d.day, 2)}`;
}

/** 月の日数（うるう年を考慮） */
export function daysInMonth(year: number, month: number): number {
  for (let d = 31; d >= 28; d--) {
    if (isValidDate(year, month, d)) return d;
  }
  return 28;
}

/**
 * 起点日から N 日目の日付。
 * `inclusive` が true なら起点日が1日目（起点日 + N-1日）、false なら起点日が0日目（起点日 + N日）。
 * N が1以上の整数でない場合、または範囲外（西暦1〜9999年の外）は null。
 */
export function dayMilestone(
  start: DateParts,
  n: number,
  inclusive: boolean,
): DateParts | null {
  if (!Number.isInteger(n) || n < 1) return null;
  const result = addDays(start, inclusive ? n - 1 : n);
  return inRange(result) ? result : null;
}

/**
 * 起点日から Nか月後の応当日。応当日がない月（1/31の1か月後など）は月末日に丸める。
 * 範囲外は null。
 */
export function monthMilestone(
  start: DateParts,
  months: number,
): DateParts | null {
  if (!isValidDate(start.year, start.month, start.day)) return null;
  if (!Number.isInteger(months) || months < 1) return null;
  const total = start.year * 12 + (start.month - 1) + months;
  const year = Math.floor(total / 12);
  const month = (total % 12) + 1;
  if (year > MAX_YEAR) return null;
  const day = Math.min(start.day, daysInMonth(year, month));
  return { year, month, day };
}

/**
 * 起点日から N年後（N周年）の日付。通常は同じ月日。
 * 2月29日起点で平年になる場合のみ `leapDayPolicy` に従う（2/28 または 3/1）。
 */
export function yearMilestone(
  start: DateParts,
  years: number,
  leapDayPolicy: LeapDayPolicy = 'feb28',
): DateParts | null {
  if (!Number.isInteger(years) || years < 1) return null;
  const r = monthMilestone(start, years * 12);
  if (!r) return null;
  if (leapDayPolicy === 'mar1' && r.day !== start.day) {
    return { year: r.year, month: 3, day: 1 };
  }
  return r;
}

function makeMilestone(
  n: number,
  date: DateParts | null,
  base: DateParts,
): Milestone | null {
  if (!date) return null;
  const daysFromBase = diffInDays(base, date);
  const weekday = getWeekday(date.year, date.month, date.day);
  if (daysFromBase === null || weekday === null) return null;
  return { n, date, weekday, daysFromBase };
}

/**
 * 記念日の一覧を作る。範囲外・不正な値の行は除外する。
 * `values` を省略すると種類ごとの既定値（日数: 50〜10000、か月: 1〜36、年: 1〜50）を使う。
 */
export function buildMilestones(
  kind: MilestoneKind,
  start: DateParts,
  base: DateParts,
  options: MilestoneOptions,
  values?: number[],
): Milestone[] {
  if (!isValidDate(start.year, start.month, start.day)) return [];
  if (!isValidDate(base.year, base.month, base.day)) return [];
  const list =
    values ??
    (kind === 'days'
      ? DEFAULT_DAY_MILESTONES
      : kind === 'months'
        ? DEFAULT_MONTH_MILESTONES
        : DEFAULT_YEAR_MILESTONES);
  const out: Milestone[] = [];
  for (const n of list) {
    const date =
      kind === 'days'
        ? dayMilestone(start, n, options.inclusive)
        : kind === 'months'
          ? monthMilestone(start, n)
          : yearMilestone(start, n, options.leapDayPolicy);
    const m = makeMilestone(n, date, base);
    if (m) out.push(m);
  }
  return out;
}

/** 基準日以降（当日含む）で最も近い記念日。なければ null。 */
export function findNextMilestone(milestones: Milestone[]): Milestone | null {
  let best: Milestone | null = null;
  for (const m of milestones) {
    if (m.daysFromBase >= 0 && (!best || m.daysFromBase < best.daysFromBase)) {
      best = m;
    }
  }
  return best;
}

export interface Elapsed {
  /** 起点日から基準日までの暦上の日数（基準日が過去なら負） */
  days: number;
  /** 起点日を1日目としたときの日数（基準日が起点日より前なら null） */
  dayNumber: number | null;
}

/** 起点日から基準日までの経過日数。日付が不正なら null。 */
export function elapsedSince(
  start: DateParts,
  base: DateParts,
): Elapsed | null {
  const days = diffInDays(start, base);
  if (days === null) return null;
  return { days, dayNumber: days >= 0 ? days + 1 : null };
}

export interface Countdown {
  /** イベント日 − 基準日（未来は正、過去は負、当日は0） */
  days: number;
  weekday: number;
}

/** 基準日からイベント日までの日数。日付が不正なら null。 */
export function countdownTo(
  base: DateParts,
  event: DateParts,
): Countdown | null {
  const days = diffInDays(base, event);
  const weekday = getWeekday(event.year, event.month, event.day);
  if (days === null || weekday === null) return null;
  return { days, weekday };
}
