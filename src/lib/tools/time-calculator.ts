export const MINUTES_PER_DAY = 24 * 60;

/**
 * "H:mm" / "HH:mm" 形式の時刻を0時からの経過分に変換する。
 * 24:00 のみ許容（終業時刻の表記用）。不正な値はnull。
 */
export function parseTime(value: string): number | null {
  const m = /^(\d{1,2}):(\d{2})$/.exec(value.trim());
  if (!m) return null;
  const h = Number(m[1]);
  const min = Number(m[2]);
  if (min > 59) return null;
  if (h > 24 || (h === 24 && min !== 0)) return null;
  return h * 60 + min;
}

/** 分数を "h:mm" 形式にする（負数は先頭に "-"）。分は四捨五入で整数化する。 */
export function formatDuration(totalMinutes: number): string {
  const rounded = Math.round(totalMinutes);
  const sign = rounded < 0 ? '-' : '';
  const abs = Math.abs(rounded);
  const h = Math.floor(abs / 60);
  const m = abs % 60;
  return `${sign}${h}:${String(m).padStart(2, '0')}`;
}

/** 分数を小数時間に変換する（デフォルトは小数第2位まで四捨五入）。 */
export function minutesToDecimalHours(
  totalMinutes: number,
  digits = 2,
): number {
  const factor = 10 ** digits;
  return Math.round((totalMinutes / 60) * factor) / factor;
}

export interface WorkEntryInput {
  /** "H:mm"。空文字の行は呼び出し側で除外しておく。 */
  start: string;
  end: string;
  /** 休憩（分）。 */
  breakMinutes: number;
}

/**
 * 1行ぶんの実働分を返す。終了が開始より前なら翌日にまたぐものとして扱う。
 * 開始と終了が同じ場合は0分。時刻が不正・休憩が負数または拘束時間を超える場合はnull。
 */
export function workedMinutes(entry: WorkEntryInput): number | null {
  const start = parseTime(entry.start);
  const end = parseTime(entry.end);
  if (start === null || end === null) return null;
  if (!Number.isFinite(entry.breakMinutes) || entry.breakMinutes < 0)
    return null;
  const gross = end >= start ? end - start : end + MINUTES_PER_DAY - start;
  if (entry.breakMinutes > gross) return null;
  return gross - entry.breakMinutes;
}

export interface WorkSumResult {
  /** 各行の実働分（不正な行はnull）。 */
  perRow: (number | null)[];
  /** 有効行の合計分。 */
  totalMinutes: number;
  /** 不正な行が1つでもあればtrue。 */
  hasError: boolean;
}

export function sumWork(entries: WorkEntryInput[]): WorkSumResult {
  const perRow = entries.map(workedMinutes);
  return {
    perRow,
    totalMinutes: perRow.reduce<number>((sum, v) => sum + (v ?? 0), 0),
    hasError: perRow.some((v) => v === null),
  };
}

export interface AddSubtractResult {
  /** 0:00〜23:59 に正規化した時刻（分）。 */
  minutes: number;
  /** 日付の繰り上がり(+)・繰り下がり(-)。 */
  dayOffset: number;
}

/**
 * 時刻に時間を加算(sign=1)・減算(sign=-1)する。
 * 日をまたぐ場合は dayOffset に何日ずれたかを返す。
 * 時刻が不正、または加減する分が負数・非有限の場合はnull。
 */
export function addSubtractTime(
  base: string,
  deltaMinutes: number,
  sign: 1 | -1,
): AddSubtractResult | null {
  const baseMin = parseTime(base);
  if (baseMin === null || baseMin === MINUTES_PER_DAY) return null;
  if (!Number.isFinite(deltaMinutes) || deltaMinutes < 0) return null;
  const raw = baseMin + sign * Math.round(deltaMinutes);
  const dayOffset = Math.floor(raw / MINUTES_PER_DAY);
  const minutes = raw - dayOffset * MINUTES_PER_DAY;
  return { minutes, dayOffset };
}

/** 時間と分から合計分を返す。負数・非有限はnull。 */
export function hoursMinutesToMinutes(
  hours: number,
  minutes: number,
): number | null {
  if (!Number.isFinite(hours) || !Number.isFinite(minutes)) return null;
  if (hours < 0 || minutes < 0) return null;
  return hours * 60 + minutes;
}

/** "h:mm"（例 "7:45" や "7:45:30"は不可）を分に変換。分は0〜59。 */
export function parseDuration(value: string): number | null {
  const m = /^(\d+):(\d{2})$/.exec(value.trim());
  if (!m) return null;
  const min = Number(m[2]);
  if (min > 59) return null;
  return Number(m[1]) * 60 + min;
}

/** 小数時間（例 7.75）を分に変換（四捨五入で整数分）。負数・非有限はnull。 */
export function decimalHoursToMinutes(decimal: number): number | null {
  if (!Number.isFinite(decimal) || decimal < 0) return null;
  return Math.round(decimal * 60);
}
