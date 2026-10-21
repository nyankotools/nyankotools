/**
 * 選日（天赦日・一粒万倍日・寅の日・巳の日・己巳の日・不成就日・鬼宿日）の算出。
 *
 * - 日の干支: 通日（ユリウス日）から60日周期で求める（2000-01-01 = 戊午）
 * - 節月: 二十四節気のうち「節」（立春・啓蟄・清明…）で月を区切る。節入り日から新しい月とする
 * - 旧暦の月日・六曜・節気は rokuyo-calendar のロジックを再利用する
 * - 二十八宿: 旧暦の月ごとの1日の宿から、日ごとに1つずつ進める
 */
import {
  getRokuyoMonth,
  isValidYear,
  MAX_YEAR,
  MIN_YEAR,
  type LunarDate,
  type RokuyoKey,
  type SolarTermKey,
} from './rokuyo-calendar';

export { isValidYear, MAX_YEAR, MIN_YEAR };
export type { RokuyoKey, SolarTermKey };

/** 選日の種類 */
export type SenjitsuKey =
  | 'tensha'
  | 'ichiryumanbai'
  | 'tora'
  | 'mi'
  | 'tsuchinotomi'
  | 'fujoju'
  | 'kishuku';

export const SENJITSU_ORDER: readonly SenjitsuKey[] = [
  'tensha',
  'ichiryumanbai',
  'tora',
  'mi',
  'tsuchinotomi',
  'fujoju',
  'kishuku',
];

/** 吉日・凶日の判定に使う印（選日 + 六曜の一部） */
export type TagKey = SenjitsuKey | 'taian' | 'butsumetsu';

export type OccasionKey = 'all' | 'wedding' | 'opening' | 'wallet' | 'move';

export const OCCASION_ORDER: readonly OccasionKey[] = [
  'all',
  'wedding',
  'opening',
  'wallet',
  'move',
];

interface OccasionRule {
  good: readonly TagKey[];
  avoid: readonly TagKey[];
}

/** 用途ごとの吉日・避ける日 */
export const OCCASION_RULES: Record<OccasionKey, OccasionRule> = {
  all: {
    good: ['tensha', 'ichiryumanbai', 'tora', 'mi', 'tsuchinotomi'],
    avoid: [],
  },
  wedding: {
    good: ['tensha', 'ichiryumanbai', 'taian'],
    avoid: ['fujoju', 'butsumetsu', 'tora', 'kishuku'],
  },
  opening: {
    good: ['tensha', 'ichiryumanbai', 'tora', 'mi', 'tsuchinotomi', 'taian'],
    avoid: ['fujoju', 'butsumetsu'],
  },
  wallet: {
    good: ['tensha', 'ichiryumanbai', 'tora', 'mi', 'tsuchinotomi'],
    avoid: ['fujoju'],
  },
  move: {
    good: ['tensha', 'ichiryumanbai', 'taian'],
    avoid: ['fujoju', 'butsumetsu'],
  },
};

/** 十干の数（甲=0 … 癸=9）と十二支の数（子=0 … 亥=11） */
export const STEM_COUNT = 10;
export const BRANCH_COUNT = 12;

/** 二十八宿の数。鬼宿は 22 番目 */
export const MANSION_COUNT = 28;
const KISHUKU_INDEX = 22;

export interface SenjitsuDay {
  year: number;
  month: number;
  day: number;
  /** YYYY-MM-DD */
  iso: string;
  /** 曜日（日曜=0） */
  dow: number;
  /** 日の干支の通し番号（甲子=0 … 癸亥=59） */
  cycle: number;
  /** 十干（甲=0 … 癸=9） */
  stem: number;
  /** 十二支（子=0 … 亥=11） */
  branch: number;
  /** 節月（寅月=1 … 丑月=12） */
  sekkiMonth: number;
  lunar: LunarDate;
  /** 二十八宿（角=0 … 軫=27） */
  mansion: number;
  tags: SenjitsuKey[];
}

// ---- 日付と通日 -------------------------------------------------------------

function toJdn(year: number, month: number, day: number): number {
  const a = Math.floor((14 - month) / 12);
  const y = year + 4800 - a;
  const m = month + 12 * a - 3;
  return (
    day +
    Math.floor((153 * m + 2) / 5) +
    365 * y +
    Math.floor(y / 4) -
    Math.floor(y / 100) +
    Math.floor(y / 400) -
    32045
  );
}

function daysIn(year: number, month: number): number {
  return (
    toJdn(month === 12 ? year + 1 : year, (month % 12) + 1, 1) -
    toJdn(year, month, 1)
  );
}

function iso(year: number, month: number, day: number): string {
  return `${String(year).padStart(4, '0')}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

const mod = (n: number, m: number) => ((n % m) + m) % m;

// ---- 干支 -------------------------------------------------------------------

/** 日の干支の通し番号（甲子=0 … 癸亥=59）。2000-01-01 は戊午（54） */
export function dayCycle(year: number, month: number, day: number): number {
  return mod(toJdn(year, month, day) - 2451545 + 54, 60);
}

// ---- 節月 -------------------------------------------------------------------

/** 節（月の区切り）の節気と、節月の番号（寅月=1 … 丑月=12） */
const SETSU_MONTH: Partial<Record<SolarTermKey, number>> = {
  risshun: 1,
  keichitsu: 2,
  seimei: 3,
  rikka: 4,
  boushu: 5,
  shousho: 6,
  risshuu: 7,
  hakuro: 8,
  kanro: 9,
  rittou: 10,
  taisetsu: 11,
  shoukan: 12,
};

/** 節月ごとの一粒万倍日の十二支（子=0 … 亥=11） */
export const ICHIRYU_BRANCHES: Record<number, readonly number[]> = {
  1: [1, 6], // 寅月: 丑・午
  2: [9, 2], // 卯月: 酉・寅
  3: [0, 3], // 辰月: 子・卯
  4: [3, 4], // 巳月: 卯・辰
  5: [5, 6], // 午月: 巳・午
  6: [9, 0], // 未月: 酉・子
  7: [3, 6], // 申月: 卯・午
  8: [0, 7], // 酉月: 子・未
  9: [3, 8], // 戌月: 卯・申
  10: [9, 11], // 亥月: 酉・亥
  11: [0, 3], // 子月: 子・卯
  12: [3, 6], // 丑月: 卯・午
};

/** 不成就日: 旧暦の月（1〜12）ごとの日。月番号を 6 で折り返して引く */
const FUJOJU_DAYS: Record<number, readonly number[]> = {
  1: [3, 11, 19, 27],
  2: [2, 10, 18, 26],
  3: [1, 9, 17, 25],
  4: [8, 16, 24],
  5: [7, 15, 23],
  6: [6, 14, 22],
};

/** 旧暦の月ごとの1日の宿（二十八宿の通し番号）。閏月は同じ番号の月として扱う */
const MANSION_START: Record<number, number> = {
  1: 12, // 室
  2: 14, // 奎
  3: 16, // 胃
  4: 18, // 畢
  5: 20, // 参
  6: 22, // 鬼
  7: 25, // 張
  8: 0, // 角
  9: 2, // 氐
  10: 4, // 心
  11: 7, // 斗
  12: 10, // 虚
};

/** 天赦日の干支（戊寅=14・甲午=30・戊申=44・甲子=0）を節月から引く */
function tenshaCycle(sekkiMonth: number): number {
  if (sekkiMonth <= 3) return 14;
  if (sekkiMonth <= 6) return 30;
  if (sekkiMonth <= 9) return 44;
  return 0;
}

export function isFujojuDay(lunarMonth: number, lunarDay: number): boolean {
  const days = FUJOJU_DAYS[((lunarMonth - 1) % 6) + 1];
  return days.includes(lunarDay);
}

export function mansionOf(lunarMonth: number, lunarDay: number): number {
  return (MANSION_START[lunarMonth] + lunarDay - 1) % MANSION_COUNT;
}

// ---- 年ごとの計算 -----------------------------------------------------------

const yearCache = new Map<number, SenjitsuDay[]>();

/** 指定年の全日の選日情報（1/1 から 12/31）。範囲外の年は null */
export function getSenjitsuYear(year: number): SenjitsuDay[] | null {
  if (!isValidYear(year)) return null;
  const cached = yearCache.get(year);
  if (cached) return cached;
  const out: SenjitsuDay[] = [];
  // 年初から小寒の前日までは、前年の大雪から続く子月（11）
  let sekkiMonth = 11;
  for (let month = 1; month <= 12; month++) {
    const days = getRokuyoMonth(year, month);
    if (!days) return null;
    for (const info of days) {
      if (info.term) {
        const next = SETSU_MONTH[info.term];
        if (next !== undefined) sekkiMonth = next;
      }
      const cycle = dayCycle(year, month, info.day);
      const stem = cycle % 10;
      const branch = cycle % 12;
      const lunar = info.lunar;
      const mansion = mansionOf(lunar.month, lunar.day);
      const tags: SenjitsuKey[] = [];
      if (cycle === tenshaCycle(sekkiMonth)) tags.push('tensha');
      if (ICHIRYU_BRANCHES[sekkiMonth].includes(branch)) {
        tags.push('ichiryumanbai');
      }
      if (branch === 2) tags.push('tora');
      if (branch === 5) tags.push('mi');
      if (cycle === 5) tags.push('tsuchinotomi');
      if (isFujojuDay(lunar.month, lunar.day)) tags.push('fujoju');
      if (mansion === KISHUKU_INDEX) tags.push('kishuku');
      out.push({
        year,
        month,
        day: info.day,
        iso: iso(year, month, info.day),
        dow: mod(toJdn(year, month, info.day) + 1, 7),
        cycle,
        stem,
        branch,
        sekkiMonth,
        lunar,
        mansion,
        tags,
      });
    }
  }
  yearCache.set(year, out);
  return out;
}

/** 指定月の各日（添字0 = 1日）。範囲外は null */
export function getSenjitsuMonth(
  year: number,
  month: number,
): SenjitsuDay[] | null {
  if (!Number.isInteger(month) || month < 1 || month > 12) return null;
  const all = getSenjitsuYear(year);
  if (!all) return null;
  const start = toJdn(year, month, 1) - toJdn(year, 1, 1);
  return all.slice(start, start + daysIn(year, month));
}

/** 指定日の選日情報。範囲外・存在しない日付は null */
export function getSenjitsuDay(
  year: number,
  month: number,
  day: number,
): SenjitsuDay | null {
  const days = getSenjitsuMonth(year, month);
  if (!days || !Number.isInteger(day) || day < 1 || day > days.length) {
    return null;
  }
  return days[day - 1];
}

// ---- 用途別の判定 -----------------------------------------------------------

function hasTag(day: SenjitsuDay, key: TagKey): boolean {
  if (key === 'taian' || key === 'butsumetsu') return day.lunar.rokuyo === key;
  return day.tags.includes(key);
}

export interface OccasionMatch {
  /** 当てはまる吉の印 */
  good: TagKey[];
  /** 当てはまる避ける印（天赦日の日は打ち消されて空） */
  avoid: TagKey[];
  /** 吉日として推せる（吉の印が1つ以上あり、避ける印がない） */
  recommended: boolean;
}

export function matchOccasion(
  day: SenjitsuDay,
  occasion: OccasionKey,
): OccasionMatch {
  const rule = OCCASION_RULES[occasion];
  const good = rule.good.filter((k) => hasTag(day, k));
  // 天赦日は他の凶日を打ち消すとされる
  const avoid = day.tags.includes('tensha')
    ? []
    : rule.avoid.filter((k) => hasTag(day, k));
  return { good, avoid, recommended: good.length > 0 && avoid.length === 0 };
}

export interface RecommendedDay {
  day: SenjitsuDay;
  match: OccasionMatch;
}

/** 用途に合う吉日の一覧（渡した日の順） */
export function findRecommended(
  days: SenjitsuDay[],
  occasion: OccasionKey,
): RecommendedDay[] {
  const out: RecommendedDay[] = [];
  for (const day of days) {
    const match = matchOccasion(day, occasion);
    if (match.recommended) out.push({ day, match });
  }
  return out;
}
