export interface IsoDuration {
  negative: boolean;
  years: number;
  months: number;
  weeks: number;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export type IsoDurationError = 'empty' | 'format' | 'noComponents' | 'tooLarge';

export type ParseIsoDurationResult =
  { ok: true; value: IsoDuration } | { ok: false; error: IsoDurationError };

/** 1日 = 86400秒（夏時間などは考慮しない） */
export const SECONDS_PER_DAY = 86400;
/** 1年 = 365.2425日（グレゴリオ暦の平均）= 31,556,952秒 */
export const SECONDS_PER_YEAR = 31556952;
/** 1か月 = 1年の12分の1 = 2,629,746秒 */
export const SECONDS_PER_MONTH = SECONDS_PER_YEAR / 12;

const MAX_ABS_SECONDS = 1e15;

const NUM = '(\\d+(?:[.,]\\d+)?)';
const DURATION_PATTERN = new RegExp(
  `^([+-])?P(?:${NUM}Y)?(?:${NUM}M)?(?:${NUM}W)?(?:${NUM}D)?(?:T(?:${NUM}H)?(?:${NUM}M)?(?:${NUM}S)?)?$`,
);

function toNumber(raw: string | undefined): number {
  return raw === undefined ? 0 : Number(raw.replace(',', '.'));
}

/** ISO 8601 期間文字列（例: PT1H30M, P1Y2M3DT4H5M6.5S, P2W）をパースする */
export function parseIsoDuration(input: string): ParseIsoDurationResult {
  const text = input.trim().toUpperCase();
  if (text === '') return { ok: false, error: 'empty' };
  const match = text.match(DURATION_PATTERN);
  if (!match) return { ok: false, error: 'format' };
  const [, sign, y, mo, w, d, h, mi, s] = match;
  const parts = [y, mo, w, d, h, mi, s];
  if (parts.every((p) => p === undefined)) {
    return { ok: false, error: 'noComponents' };
  }
  // 「P1DT」のように T の後ろに何も無い形式は不正
  if (text.endsWith('T')) return { ok: false, error: 'format' };
  const value: IsoDuration = {
    negative: sign === '-',
    years: toNumber(y),
    months: toNumber(mo),
    weeks: toNumber(w),
    days: toNumber(d),
    hours: toNumber(h),
    minutes: toNumber(mi),
    seconds: toNumber(s),
  };
  const total = durationToSeconds(value).seconds;
  if (!Number.isFinite(total) || Math.abs(total) > MAX_ABS_SECONDS) {
    return { ok: false, error: 'tooLarge' };
  }
  return { ok: true, value };
}

function roundMicro(n: number): number {
  return Math.round(n * 1e6) / 1e6;
}

export interface DurationSeconds {
  /** 符号つきの合計秒（年・月は平均値で換算） */
  seconds: number;
  /** 年または月を含み、秒換算が概算になる */
  approximate: boolean;
}

export function durationToSeconds(d: IsoDuration): DurationSeconds {
  const abs =
    d.years * SECONDS_PER_YEAR +
    d.months * SECONDS_PER_MONTH +
    d.weeks * 7 * SECONDS_PER_DAY +
    d.days * SECONDS_PER_DAY +
    d.hours * 3600 +
    d.minutes * 60 +
    d.seconds;
  const seconds = roundMicro(d.negative ? -abs : abs);
  return {
    seconds: seconds === 0 ? 0 : seconds,
    approximate: d.years !== 0 || d.months !== 0,
  };
}

/** 数値を指数表記にせず文字列化する（小数は最大6桁） */
export function formatNumber(n: number): string {
  if (!Number.isFinite(n)) return '';
  const rounded = roundMicro(n);
  if (Number.isInteger(rounded)) return String(rounded);
  return rounded.toFixed(6).replace(/0+$/, '');
}

export interface DurationTotals {
  seconds: string;
  minutes: string;
  hours: string;
  days: string;
}

export function secondsToTotals(seconds: number): DurationTotals {
  return {
    seconds: formatNumber(seconds),
    minutes: formatNumber(seconds / 60),
    hours: formatNumber(seconds / 3600),
    days: formatNumber(seconds / SECONDS_PER_DAY),
  };
}

/** 入力された成分をそのまま並べた分解結果（ゼロの成分は省く） */
export function breakdownComponents(
  d: IsoDuration,
): { unit: keyof Omit<IsoDuration, 'negative'>; value: string }[] {
  const units = [
    'years',
    'months',
    'weeks',
    'days',
    'hours',
    'minutes',
    'seconds',
  ] as const;
  return units
    .filter((u) => d[u] !== 0)
    .map((u) => ({ unit: u, value: formatNumber(d[u]) }));
}

/** 秒数の入力（整数または小数、負数可）をパースする。不正はnull */
export function parseSecondsInput(input: string): number | null {
  const text = input.trim().replace(/,/g, '');
  if (!/^[+-]?(\d+(\.\d+)?|\.\d+)$/.test(text)) return null;
  const n = Number(text);
  if (!Number.isFinite(n) || Math.abs(n) > MAX_ABS_SECONDS) return null;
  return n;
}

export interface SecondsBreakdown {
  negative: boolean;
  days: number;
  hours: number;
  minutes: number;
  /** 小数部を含む秒（最大6桁） */
  seconds: string;
}

export function secondsToBreakdown(totalSeconds: number): SecondsBreakdown {
  const negative = totalSeconds < 0;
  const abs = Math.abs(totalSeconds);
  let whole = Math.floor(abs);
  let frac = Math.round((abs - whole) * 1e6);
  if (frac === 1e6) {
    whole += 1;
    frac = 0;
  }
  const days = Math.floor(whole / SECONDS_PER_DAY);
  const rest = whole - days * SECONDS_PER_DAY;
  const hours = Math.floor(rest / 3600);
  const minutes = Math.floor((rest % 3600) / 60);
  const sec = rest % 60;
  const fracText =
    frac === 0 ? '' : `.${String(frac).padStart(6, '0')}`.replace(/0+$/, '');
  const isZero = whole === 0 && frac === 0;
  return {
    negative: negative && !isZero,
    days,
    hours,
    minutes,
    seconds: `${sec}${fracText}`,
  };
}

/** 秒数から ISO 8601 期間文字列を作る（最大の単位は日。例: 5400 → PT1H30M） */
export function secondsToIsoDuration(totalSeconds: number): string {
  const b = secondsToBreakdown(totalSeconds);
  const hasTime = b.hours !== 0 || b.minutes !== 0 || b.seconds !== '0';
  let out = b.days !== 0 ? `${b.days}D` : '';
  if (hasTime) {
    out += 'T';
    if (b.hours !== 0) out += `${b.hours}H`;
    if (b.minutes !== 0) out += `${b.minutes}M`;
    if (b.seconds !== '0') out += `${b.seconds}S`;
  }
  if (out === '') out = 'T0S';
  return `${b.negative ? '-' : ''}P${out}`;
}

function addMonthsClamped(date: Date, months: number): Date {
  const result = new Date(date.getTime());
  const day = result.getDate();
  result.setDate(1);
  result.setMonth(result.getMonth() + months);
  const lastDay = new Date(
    result.getFullYear(),
    result.getMonth() + 1,
    0,
  ).getDate();
  result.setDate(Math.min(day, lastDay));
  return result;
}

/**
 * 基準日時（ローカル時刻）に期間を加算する（負の期間は減算）。
 * 年・月はカレンダー通りに加算し、月末は月の最終日に丸める。
 * 年・月が小数の場合はカレンダー加算できないためnullを返す。
 */
export function addDurationToDate(base: Date, d: IsoDuration): Date | null {
  if (!Number.isInteger(d.years) || !Number.isInteger(d.months)) return null;
  const sign = d.negative ? -1 : 1;
  let result = addMonthsClamped(base, sign * (d.years * 12 + d.months));
  const dayMs = (d.weeks * 7 + d.days) * SECONDS_PER_DAY * 1000;
  const timeMs = (d.hours * 3600 + d.minutes * 60 + d.seconds) * 1000;
  // 日数はカレンダー日で加算（夏時間をまたいでも同じ時刻になる）
  const wholeDays = Math.trunc(dayMs / (SECONDS_PER_DAY * 1000));
  const restMs = dayMs - wholeDays * SECONDS_PER_DAY * 1000 + timeMs;
  result = new Date(result.getTime());
  result.setDate(result.getDate() + sign * wholeDays);
  result = new Date(result.getTime() + sign * Math.round(restMs));
  return Number.isNaN(result.getTime()) ? null : result;
}
