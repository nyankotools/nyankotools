/** よく使うタイムゾーン（IANA ID）。表示名は辞書側で持つ */
export const POPULAR_ZONES = [
  'Asia/Tokyo',
  'Asia/Seoul',
  'Asia/Shanghai',
  'Asia/Hong_Kong',
  'Asia/Singapore',
  'Asia/Bangkok',
  'Asia/Kolkata',
  'Asia/Dubai',
  'Europe/Moscow',
  'Europe/Istanbul',
  'Europe/Berlin',
  'Europe/Paris',
  'Europe/London',
  'UTC',
  'America/Sao_Paulo',
  'America/New_York',
  'America/Chicago',
  'America/Denver',
  'America/Los_Angeles',
  'America/Anchorage',
  'Pacific/Honolulu',
  'Australia/Sydney',
  'Pacific/Auckland',
  'Africa/Cairo',
  'Africa/Johannesburg',
] as const;

export interface WallClock {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
  second: number;
}

/** IANA タイムゾーン ID として使えるか */
export function isValidTimeZone(timeZone: string): boolean {
  if (timeZone.trim() === '') return false;
  try {
    new Intl.DateTimeFormat('en-US', { timeZone });
    return true;
  } catch {
    return false;
  }
}

const formatterCache = new Map<string, Intl.DateTimeFormat>();

function partsFormatter(timeZone: string): Intl.DateTimeFormat {
  let f = formatterCache.get(timeZone);
  if (!f) {
    f = new Intl.DateTimeFormat('en-US', {
      timeZone,
      hourCycle: 'h23',
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
    });
    formatterCache.set(timeZone, f);
  }
  return f;
}

/** 瞬間（UTC ms）を、指定タイムゾーンの壁時計に分解する */
export function getWallClock(ms: number, timeZone: string): WallClock {
  const out: Record<string, number> = {};
  for (const p of partsFormatter(timeZone).formatToParts(new Date(ms))) {
    if (p.type !== 'literal') out[p.type] = Number(p.value);
  }
  return {
    year: out.year,
    month: out.month,
    day: out.day,
    hour: out.hour === 24 ? 0 : out.hour,
    minute: out.minute,
    second: out.second,
  };
}

function wallToUtcMs(w: WallClock): number {
  const d = new Date(
    Date.UTC(2000, w.month - 1, w.day, w.hour, w.minute, w.second),
  );
  d.setUTCFullYear(w.year);
  return d.getTime();
}

/** その瞬間の UTC からのオフセット（ミリ秒）。サマータイム中は標準時より進む */
export function getOffsetMs(ms: number, timeZone: string): number {
  const floored = Math.floor(ms / 1000) * 1000;
  return wallToUtcMs(getWallClock(ms, timeZone)) - floored;
}

export type ResolveStatus = 'ok' | 'gap' | 'ambiguous';

/**
 * 指定タイムゾーンの壁時計（年月日時分）を、UTC の瞬間に変換する。
 * サマータイムで存在しない時刻（gap）は切り替え前のオフセットで解釈し、
 * 2回現れる時刻（ambiguous）は早いほうを返す。
 */
export function resolveWallClock(
  wall: WallClock,
  timeZone: string,
): { ms: number; status: ResolveStatus } {
  const guess = wallToUtcMs(wall);
  const before = getOffsetMs(guess - 86_400_000, timeZone);
  const after = getOffsetMs(guess + 86_400_000, timeZone);
  const candidates = [...new Set([before, after])]
    .map((offset) => guess - offset)
    .filter((ms) => getOffsetMs(ms, timeZone) === guess - ms);
  if (candidates.length === 0) return { ms: guess - before, status: 'gap' };
  if (candidates.length === 1) return { ms: candidates[0], status: 'ok' };
  return { ms: Math.min(...candidates), status: 'ambiguous' };
}

/** `datetime-local` の値（YYYY-MM-DDTHH:mm[:ss]）を壁時計に分解する。不正なら null */
export function parseDateTimeLocal(value: string): WallClock | null {
  const m = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})(?::(\d{2}))?$/.exec(
    value,
  );
  if (!m) return null;
  const w: WallClock = {
    year: Number(m[1]),
    month: Number(m[2]),
    day: Number(m[3]),
    hour: Number(m[4]),
    minute: Number(m[5]),
    second: m[6] ? Number(m[6]) : 0,
  };
  const check = new Date(wallToUtcMs(w));
  if (
    check.getUTCFullYear() !== w.year ||
    check.getUTCMonth() !== w.month - 1 ||
    check.getUTCDate() !== w.day ||
    w.hour > 23 ||
    w.minute > 59 ||
    w.second > 59
  )
    return null;
  return w;
}

function pad(n: number): string {
  return String(n).padStart(2, '0');
}

/** 壁時計を `datetime-local` の値（YYYY-MM-DDTHH:mm）にする */
export function toDateTimeLocal(w: WallClock): string {
  return `${String(w.year).padStart(4, '0')}-${pad(w.month)}-${pad(w.day)}T${pad(w.hour)}:${pad(w.minute)}`;
}

/** オフセットを `UTC+9` / `UTC+5:30` / `UTC` の形式にする */
export function formatOffset(offsetMs: number): string {
  const totalMinutes = Math.round(offsetMs / 60_000);
  if (totalMinutes === 0) return 'UTC';
  const sign = totalMinutes > 0 ? '+' : '-';
  const abs = Math.abs(totalMinutes);
  const h = Math.floor(abs / 60);
  const m = abs % 60;
  return `UTC${sign}${h}${m ? `:${pad(m)}` : ''}`;
}

export interface ZonedView {
  /** 日付（ロケールに合わせた表記） */
  date: string;
  weekday: string;
  /** HH:mm:ss */
  time: string;
  offset: string;
  /** 基準タイムゾーンの日付との差（日） */
  dayDiff: number;
}

/** 瞬間を、指定タイムゾーンでの表示用の値にする。dayDiff は baseZone の日付との差 */
export function viewInZone(
  ms: number,
  timeZone: string,
  baseZone: string,
  locale: string,
): ZonedView {
  const w = getWallClock(ms, timeZone);
  const base = getWallClock(ms, baseZone);
  const day = (x: WallClock) =>
    Math.round(Date.UTC(x.year, x.month - 1, x.day) / 86_400_000);
  return {
    date: new Intl.DateTimeFormat(locale, {
      timeZone,
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(new Date(ms)),
    weekday: new Intl.DateTimeFormat(locale, {
      timeZone,
      weekday: 'short',
    }).format(new Date(ms)),
    time: `${pad(w.hour)}:${pad(w.minute)}:${pad(w.second)}`,
    offset: formatOffset(getOffsetMs(ms, timeZone)),
    dayDiff: day(w) - day(base),
  };
}
