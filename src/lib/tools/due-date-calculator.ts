import {
  addDays,
  diffInDays,
  getWeekday,
  isValidDate,
  type DateParts,
} from './date-calculator';

/** 起点の種類。lmp=最終月経開始日、ovulation=排卵日（受精日）、due=分娩予定日（逆算） */
export type DueDateMode = 'lmp' | 'ovulation' | 'due';

export const PREGNANCY_DAYS = 280;
export const OVULATION_OFFSET_DAYS = 266;
export const STANDARD_CYCLE_DAYS = 28;
export const MIN_CYCLE_DAYS = 21;
export const MAX_CYCLE_DAYS = 45;
export const MIN_YEAR = 1900;
export const MAX_YEAR = 2100;

export type MilestoneKey =
  | 'week4'
  | 'week12'
  | 'week16'
  | 'week22'
  | 'week28'
  | 'week37'
  | 'week40'
  | 'week42';

/** 妊娠週数（0日起算）と節目の対応。文言は i18n 側で持つ */
export const MILESTONES: { key: MilestoneKey; week: number }[] = [
  { key: 'week4', week: 4 },
  { key: 'week12', week: 12 },
  { key: 'week16', week: 16 },
  { key: 'week22', week: 22 },
  { key: 'week28', week: 28 },
  { key: 'week37', week: 37 },
  { key: 'week40', week: 40 },
  { key: 'week42', week: 42 },
];

export interface DueDateInput {
  mode: DueDateMode;
  /** mode に応じた起点の日付（最終月経開始日／排卵日／分娩予定日） */
  date: DateParts;
  /** 月経周期の日数。mode が lmp のときだけ補正に使う（既定28日） */
  cycleLength?: number;
}

export interface DueDateResult {
  /** 分娩予定日 */
  dueDate: DateParts;
  dueWeekday: number;
  /** 妊娠0週0日にあたる日（周期補正後の最終月経開始日に相当） */
  startDate: DateParts;
  /** 排卵（受精）推定日 = 妊娠0週0日 + 14日 */
  ovulationDate: DateParts;
}

export interface GestationalAge {
  /** 妊娠0週0日からの通算日数。負なら妊娠前（起点日より前） */
  totalDays: number;
  weeks: number;
  days: number;
  /** 妊娠月数（1〜10。妊娠0週〜3週が1ヶ月、4週ごとに加算し10で頭打ち） */
  month: number;
  /** 分娩予定日までの日数。過ぎていれば負 */
  daysToDue: number;
  status: 'beforeStart' | 'ongoing' | 'overdue';
}

export interface MilestoneEntry {
  key: MilestoneKey;
  week: number;
  date: DateParts;
  /** 基準日から節目の日までの日数。過ぎていれば負、当日は0 */
  daysFromReference: number;
}

function isUsableDate(date: DateParts): boolean {
  return (
    isValidDate(date.year, date.month, date.day) &&
    date.year >= MIN_YEAR &&
    date.year <= MAX_YEAR
  );
}

/**
 * 起点から分娩予定日などを求める。
 * - lmp: 最終月経開始日 + 280日（ネーゲレ式と同等）。周期が28日でない場合は (周期 − 28) 日ずらす
 * - ovulation: 排卵日 + 266日
 * - due: 分娩予定日そのもの（妊娠0週0日は予定日 − 280日）
 * 日付が不正・範囲外、周期が範囲外（lmp のみ検査）の場合は null。
 */
export function calculateDueDate(input: DueDateInput): DueDateResult | null {
  const { mode, date } = input;
  if (!isUsableDate(date)) return null;

  let startDate: DateParts | null;
  let dueDate: DateParts | null;

  if (mode === 'lmp') {
    const cycle = input.cycleLength ?? STANDARD_CYCLE_DAYS;
    if (
      !Number.isInteger(cycle) ||
      cycle < MIN_CYCLE_DAYS ||
      cycle > MAX_CYCLE_DAYS
    ) {
      return null;
    }
    startDate = addDays(date, cycle - STANDARD_CYCLE_DAYS);
    dueDate = startDate && addDays(startDate, PREGNANCY_DAYS);
  } else if (mode === 'ovulation') {
    dueDate = addDays(date, OVULATION_OFFSET_DAYS);
    startDate = addDays(date, -(PREGNANCY_DAYS - OVULATION_OFFSET_DAYS));
  } else {
    dueDate = date;
    startDate = addDays(date, -PREGNANCY_DAYS);
  }
  if (!startDate || !dueDate) return null;

  const ovulationDate = addDays(
    startDate,
    PREGNANCY_DAYS - OVULATION_OFFSET_DAYS,
  );
  const dueWeekday = getWeekday(dueDate.year, dueDate.month, dueDate.day);
  if (!ovulationDate || dueWeekday === null) return null;
  return { dueDate, dueWeekday, startDate, ovulationDate };
}

/** 基準日時点の妊娠週数・日数・月数。日付が不正なら null。 */
export function calculateGestationalAge(
  result: DueDateResult,
  reference: DateParts,
): GestationalAge | null {
  if (!isValidDate(reference.year, reference.month, reference.day)) return null;
  const totalDays = diffInDays(result.startDate, reference, false);
  const daysToDue = diffInDays(reference, result.dueDate, false);
  if (totalDays === null || daysToDue === null) return null;

  const weeks = totalDays < 0 ? 0 : Math.floor(totalDays / 7);
  const days = totalDays < 0 ? 0 : totalDays % 7;
  const month = Math.min(10, Math.floor(weeks / 4) + 1);
  const status =
    totalDays < 0 ? 'beforeStart' : totalDays >= 42 * 7 ? 'overdue' : 'ongoing';
  return { totalDays, weeks, days, month, daysToDue, status };
}

/** 主な節目（妊娠週数）の日付と、基準日からの日数 */
export function calculateMilestones(
  result: DueDateResult,
  reference: DateParts,
): MilestoneEntry[] {
  const entries: MilestoneEntry[] = [];
  for (const { key, week } of MILESTONES) {
    const date = addDays(result.startDate, week * 7);
    if (!date) continue;
    const daysFromReference = diffInDays(reference, date, false);
    if (daysFromReference === null) continue;
    entries.push({ key, week, date, daysFromReference });
  }
  return entries;
}
