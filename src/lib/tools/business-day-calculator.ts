/** 対応年の範囲（祝日の判定ルールと春分・秋分の近似式が成り立つ範囲） */
export const MIN_YEAR = 2000;
export const MAX_YEAR = 2099;

export type HolidayKey =
  | 'newYear'
  | 'comingOfAge'
  | 'foundation'
  | 'emperorBirthday'
  | 'springEquinox'
  | 'showa'
  | 'constitution'
  | 'greenery'
  | 'children'
  | 'marine'
  | 'mountain'
  | 'respect'
  | 'autumnEquinox'
  | 'sports'
  | 'culture'
  | 'laborThanks'
  | 'abdication'
  | 'accession'
  | 'enthronement'
  | 'substitute'
  | 'citizen';

export interface Holiday {
  /** YYYY-MM-DD */
  date: string;
  key: HolidayKey;
}

export interface BusinessDayOptions {
  /** 土日祝を休業日とする代わりに、祝日を営業日として扱う場合は false */
  excludeHolidays: boolean;
  /** 12/29〜1/3 を休業日にする */
  excludeYearEnd: boolean;
}

export type BusinessDayError = 'invalidDate' | 'outOfRange' | 'invalidDays';

const DAY_MS = 86_400_000;

function pad(n: number): string {
  return String(n).padStart(2, '0');
}

/** UTC基準の日付を YYYY-MM-DD にする */
function toIso(ms: number): string {
  const d = new Date(ms);
  return `${String(d.getUTCFullYear()).padStart(4, '0')}-${pad(d.getUTCMonth() + 1)}-${pad(d.getUTCDate())}`;
}

/** YYYY-MM-DD を UTC の ms に変換する。実在しない日付は null */
export function parseIso(iso: string): number | null {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
  if (!m) return null;
  const [y, mo, d] = [Number(m[1]), Number(m[2]), Number(m[3])];
  const date = new Date(Date.UTC(2000, mo - 1, d));
  date.setUTCFullYear(y);
  if (
    date.getUTCFullYear() !== y ||
    date.getUTCMonth() !== mo - 1 ||
    date.getUTCDate() !== d
  )
    return null;
  return date.getTime();
}

function utc(year: number, month: number, day: number): number {
  return Date.UTC(year, month - 1, day);
}

/** 第n月曜日の日付（1〜31） */
function nthMonday(year: number, month: number, n: number): number {
  const firstDow = new Date(utc(year, month, 1)).getUTCDay();
  const firstMonday = 1 + ((8 - firstDow) % 7);
  return firstMonday + (n - 1) * 7;
}

/** 春分日・秋分日（1980〜2099年で有効な近似式） */
function equinoxDay(year: number, spring: boolean): number {
  const base = spring ? 20.8431 : 23.2488;
  return Math.floor(
    base + 0.242194 * (year - 1980) - Math.floor((year - 1980) / 4),
  );
}

const holidayCache = new Map<number, Holiday[]>();

/** 指定年の祝日（振替休日・国民の休日を含む）を日付順で返す。範囲外の年は空配列 */
export function getHolidays(year: number): Holiday[] {
  if (!Number.isInteger(year) || year < MIN_YEAR || year > MAX_YEAR) return [];
  const cached = holidayCache.get(year);
  if (cached) return cached;

  const base = new Map<number, HolidayKey>();
  const add = (month: number, day: number, key: HolidayKey) =>
    base.set(utc(year, month, day), key);

  add(1, 1, 'newYear');
  add(1, nthMonday(year, 1, 2), 'comingOfAge');
  add(2, 11, 'foundation');
  if (year <= 2018) add(12, 23, 'emperorBirthday');
  if (year >= 2020) add(2, 23, 'emperorBirthday');
  add(3, equinoxDay(year, true), 'springEquinox');
  add(4, 29, year >= 2007 ? 'showa' : 'greenery');
  add(5, 3, 'constitution');
  if (year >= 2007) add(5, 4, 'greenery');
  add(5, 5, 'children');
  if (year === 2020) add(7, 23, 'marine');
  else if (year === 2021) add(7, 22, 'marine');
  else add(7, year <= 2002 ? 20 : nthMonday(year, 7, 3), 'marine');
  if (year >= 2016) {
    if (year === 2020) add(8, 10, 'mountain');
    else if (year === 2021) add(8, 8, 'mountain');
    else add(8, 11, 'mountain');
  }
  add(9, year <= 2002 ? 15 : nthMonday(year, 9, 3), 'respect');
  add(9, equinoxDay(year, false), 'autumnEquinox');
  if (year === 2020) add(7, 24, 'sports');
  else if (year === 2021) add(7, 23, 'sports');
  else add(10, nthMonday(year, 10, 2), 'sports');
  add(11, 3, 'culture');
  add(11, 23, 'laborThanks');
  if (year === 2019) {
    add(4, 30, 'abdication');
    add(5, 1, 'accession');
    add(10, 22, 'enthronement');
  }

  const all = new Map(base);
  // 振替休日: 祝日が日曜なら、翌日（2007年以降は祝日でない最初の日）
  for (const ms of base.keys()) {
    if (new Date(ms).getUTCDay() !== 0) continue;
    let next = ms + DAY_MS;
    if (year >= 2007) {
      while (base.has(next)) next += DAY_MS;
      all.set(next, 'substitute');
    } else if (!base.has(next)) {
      all.set(next, 'substitute');
    }
  }
  // 国民の休日: 前日と翌日がともに祝日の平日
  for (const ms of base.keys()) {
    const mid = ms + DAY_MS;
    if (
      base.has(mid + DAY_MS) &&
      !base.has(mid) &&
      new Date(mid).getUTCDay() !== 0
    )
      all.set(mid, 'citizen');
  }

  const result = [...all.entries()]
    .sort((a, b) => a[0] - b[0])
    .map(([ms, key]) => ({ date: toIso(ms), key }));
  holidayCache.set(year, result);
  return result;
}

function holidaySet(year: number): Set<string> {
  return new Set(getHolidays(year).map((h) => h.date));
}

/** 営業日かどうか（土日・祝日・年末年始を除く）。ms は UTC の日付 */
function isBusinessDayMs(ms: number, options: BusinessDayOptions): boolean {
  const d = new Date(ms);
  const dow = d.getUTCDay();
  if (dow === 0 || dow === 6) return false;
  const month = d.getUTCMonth() + 1;
  const day = d.getUTCDate();
  if (
    options.excludeYearEnd &&
    ((month === 12 && day >= 29) || (month === 1 && day <= 3))
  )
    return false;
  if (options.excludeHolidays && holidaySet(d.getUTCFullYear()).has(toIso(ms)))
    return false;
  return true;
}

export function isBusinessDay(
  iso: string,
  options: BusinessDayOptions,
): boolean {
  const ms = parseIso(iso);
  return ms !== null && isBusinessDayMs(ms, options);
}

function inRange(ms: number): boolean {
  const y = new Date(ms).getUTCFullYear();
  return y >= MIN_YEAR && y <= MAX_YEAR;
}

/** 開始日から days 営業日後（負なら前）の日付。開始日自体は数えない */
export function addBusinessDays(
  startIso: string,
  days: number,
  options: BusinessDayOptions,
): { date: string } | { error: BusinessDayError } {
  const start = parseIso(startIso);
  if (start === null || !inRange(start)) return { error: 'invalidDate' };
  if (!Number.isInteger(days) || Math.abs(days) > 10000)
    return { error: 'invalidDays' };
  const step = days < 0 ? -DAY_MS : DAY_MS;
  let ms = start;
  let remaining = Math.abs(days);
  while (remaining > 0) {
    ms += step;
    if (!inRange(ms)) return { error: 'outOfRange' };
    if (isBusinessDayMs(ms, options)) remaining--;
  }
  return { date: toIso(ms) };
}

export interface BusinessDayCount {
  /** 開始日・終了日を含む暦日数 */
  calendarDays: number;
  businessDays: number;
  /** 休業日の内訳 */
  weekendDays: number;
  holidayDays: number;
}

/** 開始日〜終了日（両端を含む）の営業日数。開始日が終了日より後なら入れ替えて数える */
export function countBusinessDays(
  startIso: string,
  endIso: string,
  options: BusinessDayOptions,
): BusinessDayCount | { error: BusinessDayError } {
  let a = parseIso(startIso);
  let b = parseIso(endIso);
  if (a === null || b === null || !inRange(a) || !inRange(b))
    return { error: 'invalidDate' };
  if (a > b) [a, b] = [b, a];
  let businessDays = 0;
  let weekendDays = 0;
  let holidayDays = 0;
  for (let ms = a; ms <= b; ms += DAY_MS) {
    const dow = new Date(ms).getUTCDay();
    if (dow === 0 || dow === 6) weekendDays++;
    else if (isBusinessDayMs(ms, options)) businessDays++;
    else holidayDays++;
  }
  return {
    calendarDays: Math.round((b - a) / DAY_MS) + 1,
    businessDays,
    weekendDays,
    holidayDays,
  };
}

/** 曜日（0=日〜6=土） */
export function weekdayOf(iso: string): number | null {
  const ms = parseIso(iso);
  return ms === null ? null : new Date(ms).getUTCDay();
}
