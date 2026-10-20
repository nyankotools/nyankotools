// iCalendar（RFC 5545）の予定ファイル(.ics)と Google カレンダー追加リンクを作る純粋ロジック。

export type TimeZoneMode = 'floating' | 'tzid' | 'utc';
export type Frequency = 'none' | 'daily' | 'weekly' | 'monthly' | 'yearly';
export type RecurrenceEnd = 'never' | 'count' | 'until';
export const WEEKDAY_CODES = [
  'MO',
  'TU',
  'WE',
  'TH',
  'FR',
  'SA',
  'SU',
] as const;

export const MAX_INTERVAL = 999;
export const MAX_COUNT = 999;
export const MAX_REMINDER_MINUTES = 40320; // 4週間

export interface IcsEventInput {
  summary: string;
  description: string;
  location: string;
  url: string;
  allDay: boolean;
  /** YYYY-MM-DD */
  startDate: string;
  /** HH:MM（終日のときは無視） */
  startTime: string;
  /** YYYY-MM-DD（終日のときは最終日を含む） */
  endDate: string;
  endTime: string;
  mode: TimeZoneMode;
  /** IANA タイムゾーン名（mode が tzid / utc のとき使う） */
  timeZone: string;
  freq: Frequency;
  interval: number;
  /** WEEKDAY_CODES の部分集合（毎週のときだけ使う） */
  byDay: string[];
  endType: RecurrenceEnd;
  count: number;
  /** YYYY-MM-DD */
  untilDate: string;
  /** 開始の何分前に通知するか。null は通知なし */
  reminderMinutes: number | null;
}

export type IcsErrorCode =
  | 'summaryRequired'
  | 'startInvalid'
  | 'endInvalid'
  | 'endBeforeStart'
  | 'timeZoneInvalid'
  | 'intervalInvalid'
  | 'countInvalid'
  | 'untilInvalid'
  | 'untilBeforeStart'
  | 'reminderInvalid'
  | 'urlInvalid';

export type IcsResult =
  | { ok: true; ics: string; googleUrl: string; rrule: string | null }
  | { ok: false; error: IcsErrorCode };

interface DateParts {
  y: number;
  m: number;
  d: number;
}
interface TimeParts {
  h: number;
  mi: number;
}

const pad = (n: number, len = 2) => String(n).padStart(len, '0');

export function parseDate(s: string): DateParts | null {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(s.trim());
  if (!m) return null;
  const y = Number(m[1]);
  const mo = Number(m[2]);
  const d = Number(m[3]);
  if (y < 1000) return null;
  const dt = new Date(Date.UTC(y, mo - 1, d));
  if (
    dt.getUTCFullYear() !== y ||
    dt.getUTCMonth() !== mo - 1 ||
    dt.getUTCDate() !== d
  ) {
    return null;
  }
  return { y, m: mo, d };
}

export function parseTime(s: string): TimeParts | null {
  const m = /^(\d{2}):(\d{2})(?::\d{2})?$/.exec(s.trim());
  if (!m) return null;
  const h = Number(m[1]);
  const mi = Number(m[2]);
  if (h > 23 || mi > 59) return null;
  return { h, mi };
}

const dateStr = (p: DateParts) => `${pad(p.y, 4)}${pad(p.m)}${pad(p.d)}`;
const localStr = (p: DateParts, t: TimeParts) =>
  `${dateStr(p)}T${pad(t.h)}${pad(t.mi)}00`;

function addDays(p: DateParts, days: number): DateParts {
  const dt = new Date(Date.UTC(p.y, p.m - 1, p.d + days));
  return {
    y: dt.getUTCFullYear(),
    m: dt.getUTCMonth() + 1,
    d: dt.getUTCDate(),
  };
}

export function isValidTimeZone(tz: string): boolean {
  if (!/^[A-Za-z_]+(\/[A-Za-z0-9_+-]+)*$/.test(tz)) return false;
  try {
    new Intl.DateTimeFormat('en-US', { timeZone: tz });
    return true;
  } catch {
    return false;
  }
}

/** その UTC 時刻における tz の UTC からのずれ（ミリ秒） */
function offsetMs(utcMs: number, tz: string): number {
  const fmt = new Intl.DateTimeFormat('en-US', {
    timeZone: tz,
    hourCycle: 'h23',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
  const get: Record<string, number> = {};
  for (const part of fmt.formatToParts(new Date(utcMs))) {
    if (part.type !== 'literal') get[part.type] = Number(part.value);
  }
  const asUtc = Date.UTC(
    get.year,
    get.month - 1,
    get.day,
    get.hour,
    get.minute,
    get.second,
  );
  return asUtc - Math.floor(utcMs / 1000) * 1000;
}

/** tz の壁時計時刻を UTC のミリ秒に変換する（夏時間の切り替え時刻は近似） */
export function zonedToUtcMs(
  p: DateParts,
  t: TimeParts,
  tz: string,
  seconds = 0,
): number {
  const guess = Date.UTC(p.y, p.m - 1, p.d, t.h, t.mi, seconds);
  const first = guess - offsetMs(guess, tz);
  return guess - offsetMs(first, tz);
}

function utcStr(ms: number): string {
  const d = new Date(ms);
  return `${pad(d.getUTCFullYear(), 4)}${pad(d.getUTCMonth() + 1)}${pad(
    d.getUTCDate(),
  )}T${pad(d.getUTCHours())}${pad(d.getUTCMinutes())}${pad(d.getUTCSeconds())}Z`;
}

/** TEXT 値のエスケープ（バックスラッシュ・セミコロン・カンマ・改行） */
export function escapeText(s: string): string {
  return s
    .replace(/\r\n|\r/g, '\n')
    .replace(/\\/g, '\\\\')
    .replace(/;/g, '\\;')
    .replace(/,/g, '\\,')
    .replace(/\n/g, '\\n');
}

/** 1 行を 75 オクテット以内に折り返す（UTF-8 の文字の途中では切らない） */
export function foldLine(line: string): string {
  const enc = new TextEncoder();
  const parts: string[] = [];
  let current = '';
  let bytes = 0;
  let limit = 75;
  for (const ch of line) {
    const len = enc.encode(ch).length;
    if (bytes + len > limit) {
      parts.push(current);
      current = '';
      bytes = 0;
      limit = 74; // 行頭の空白1オクテットぶん
    }
    current += ch;
    bytes += len;
  }
  parts.push(current);
  return parts.join('\r\n ');
}

/** 通知時刻（開始の何分前か）を TRIGGER の期間表記にする */
export function formatTrigger(minutes: number): string {
  if (minutes === 0) return 'PT0S';
  if (minutes % 10080 === 0) return `-P${minutes / 10080}W`;
  if (minutes % 1440 === 0) return `-P${minutes / 1440}D`;
  if (minutes % 60 === 0) return `-PT${minutes / 60}H`;
  return `-PT${minutes}M`;
}

export function makeUid(random: string, domain = 'nyankotools.com'): string {
  return `${random}@${domain}`;
}

export function icsFileName(summary: string): string {
  const base = Array.from(
    summary
      // eslint-disable-next-line no-control-regex
      .replace(/[\\/:*?"<>|\u0000-\u001f]/g, '-')
      .trim(),
  )
    .slice(0, 50)
    .join('')
    .trim();
  return `${base || 'event'}.ics`;
}

function isIntInRange(n: number, min: number, max: number): boolean {
  return Number.isInteger(n) && n >= min && n <= max;
}

function isHttpUrl(s: string): boolean {
  if (/\s/.test(s)) return false;
  try {
    const u = new URL(s);
    return u.protocol === 'http:' || u.protocol === 'https:';
  } catch {
    return false;
  }
}

const FREQ_NAMES: Record<Exclude<Frequency, 'none'>, string> = {
  daily: 'DAILY',
  weekly: 'WEEKLY',
  monthly: 'MONTHLY',
  yearly: 'YEARLY',
};

export function generateIcs(
  input: IcsEventInput,
  uid: string,
  now: Date = new Date(),
): IcsResult {
  const fail = (error: IcsErrorCode): IcsResult => ({ ok: false, error });
  const summary = input.summary.trim();
  if (!summary) return fail('summaryRequired');

  const url = input.url.trim();
  if (url && !isHttpUrl(url)) return fail('urlInvalid');

  const startD = parseDate(input.startDate);
  if (!startD) return fail('startInvalid');
  const endD = parseDate(input.endDate);
  if (!endD) return fail('endInvalid');

  const allDay = input.allDay;
  const startT = allDay ? { h: 0, mi: 0 } : parseTime(input.startTime);
  if (!startT) return fail('startInvalid');
  const endT = allDay ? { h: 0, mi: 0 } : parseTime(input.endTime);
  if (!endT) return fail('endInvalid');

  const startKey = localStr(startD, startT);
  const endKey = localStr(endD, endT);
  if (endKey < startKey) return fail('endBeforeStart');

  const useZone = !allDay && input.mode !== 'floating';
  const tz = input.timeZone.trim();
  if (useZone && !isValidTimeZone(tz)) return fail('timeZoneInvalid');

  // 繰り返し
  const recurring = input.freq !== 'none';
  if (recurring && !isIntInRange(input.interval, 1, MAX_INTERVAL)) {
    return fail('intervalInvalid');
  }
  if (
    recurring &&
    input.endType === 'count' &&
    !isIntInRange(input.count, 1, MAX_COUNT)
  ) {
    return fail('countInvalid');
  }
  let untilD: DateParts | null = null;
  if (recurring && input.endType === 'until') {
    untilD = parseDate(input.untilDate);
    if (!untilD) return fail('untilInvalid');
    if (dateStr(untilD) < dateStr(startD)) return fail('untilBeforeStart');
  }

  if (input.reminderMinutes !== null) {
    if (!isIntInRange(input.reminderMinutes, 0, MAX_REMINDER_MINUTES)) {
      return fail('reminderInvalid');
    }
  }

  // 日時の文字列
  let dtStart: string;
  let dtEnd: string;
  let startValue: string;
  let endValue: string;
  let googleStart: string;
  let googleEnd: string;
  let ctz = '';

  if (allDay) {
    const exclusiveEnd = addDays(endD, 1);
    if (exclusiveEnd.y > 9999) return fail('endInvalid');
    startValue = dateStr(startD);
    endValue = dateStr(exclusiveEnd);
    dtStart = `DTSTART;VALUE=DATE:${startValue}`;
    dtEnd = `DTEND;VALUE=DATE:${endValue}`;
    googleStart = startValue;
    googleEnd = endValue;
  } else if (input.mode === 'floating') {
    startValue = startKey;
    endValue = endKey;
    dtStart = `DTSTART:${startValue}`;
    dtEnd = `DTEND:${endValue}`;
    googleStart = startValue;
    googleEnd = endValue;
  } else if (input.mode === 'utc') {
    startValue = utcStr(zonedToUtcMs(startD, startT, tz));
    endValue = utcStr(zonedToUtcMs(endD, endT, tz));
    dtStart = `DTSTART:${startValue}`;
    dtEnd = `DTEND:${endValue}`;
    googleStart = startValue;
    googleEnd = endValue;
  } else {
    startValue = startKey;
    endValue = endKey;
    dtStart = `DTSTART;TZID=${tz}:${startValue}`;
    dtEnd = `DTEND;TZID=${tz}:${endValue}`;
    googleStart = startValue;
    googleEnd = endValue;
    ctz = tz;
  }

  // RRULE
  let rrule: string | null = null;
  if (recurring) {
    const parts = [`FREQ=${FREQ_NAMES[input.freq as keyof typeof FREQ_NAMES]}`];
    if (input.interval !== 1) parts.push(`INTERVAL=${input.interval}`);
    if (input.freq === 'weekly') {
      const days = WEEKDAY_CODES.filter((c) => input.byDay.includes(c));
      if (days.length > 0) parts.push(`BYDAY=${days.join(',')}`);
    }
    if (input.endType === 'count') {
      parts.push(`COUNT=${input.count}`);
    } else if (input.endType === 'until' && untilD) {
      if (allDay) {
        parts.push(`UNTIL=${dateStr(untilD)}`);
      } else if (input.mode === 'floating') {
        parts.push(`UNTIL=${dateStr(untilD)}T235959`);
      } else {
        // TZID / UTC の開始時刻に対する UNTIL は UTC で書く必要がある
        parts.push(
          `UNTIL=${utcStr(zonedToUtcMs(untilD, { h: 23, mi: 59 }, tz, 59))}`,
        );
      }
    }
    rrule = parts.join(';');
  }

  const lines: string[] = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//NyankoTools//ICS Generator//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:${uid}`,
    `DTSTAMP:${utcStr(now.getTime())}`,
    dtStart,
    dtEnd,
    `SUMMARY:${escapeText(summary)}`,
  ];
  if (input.description.trim()) {
    lines.push(`DESCRIPTION:${escapeText(input.description)}`);
  }
  if (input.location.trim()) {
    lines.push(`LOCATION:${escapeText(input.location)}`);
  }
  if (url) lines.push(`URL:${url}`);
  if (rrule) lines.push(`RRULE:${rrule}`);
  if (input.reminderMinutes !== null) {
    lines.push(
      'BEGIN:VALARM',
      'ACTION:DISPLAY',
      `DESCRIPTION:${escapeText(summary)}`,
      `TRIGGER:${formatTrigger(input.reminderMinutes)}`,
      'END:VALARM',
    );
  }
  lines.push('END:VEVENT', 'END:VCALENDAR');

  const ics = lines.map(foldLine).join('\r\n') + '\r\n';

  // Google カレンダー追加リンク（通知は設定できない）
  const q = new URLSearchParams();
  q.set('action', 'TEMPLATE');
  q.set('text', summary);
  q.set('dates', `${googleStart}/${googleEnd}`);
  if (input.description.trim()) q.set('details', input.description);
  if (input.location.trim()) q.set('location', input.location);
  if (ctz) q.set('ctz', ctz);
  if (rrule) q.set('recur', `RRULE:${rrule}`);
  const googleUrl = `https://calendar.google.com/calendar/render?${q
    .toString()
    .replace(/%2F/g, '/')}`;

  return { ok: true, ics, googleUrl, rrule };
}
