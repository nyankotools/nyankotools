import { isValidDate, type DateParts } from './date-calculator';
import {
  getSolarTerm,
  MAX_YEAR,
  MIN_YEAR,
  type SolarTermKey,
} from './rokuyo-calendar';

/** 対応する西暦の範囲（立春・節入りの天文計算が使える範囲） */
export const KIGAKU_MIN_YEAR = MIN_YEAR;
export const KIGAKU_MAX_YEAR = MAX_YEAR;

/** 五行（表示名は辞書側で持つ） */
export type FiveElement = 'wood' | 'fire' | 'earth' | 'metal' | 'water';

/** 九星の五行。インデックス0=一白水星〜8=九紫火星 */
export const STAR_ELEMENTS: readonly FiveElement[] = [
  'water',
  'earth',
  'wood',
  'wood',
  'earth',
  'metal',
  'metal',
  'earth',
  'fire',
];

/** 月命星の月（寅月=1 … 丑月=12）を始める節（二十四節気のうち「節」） */
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

export interface MonthDay {
  month: number;
  day: number;
}

export interface KigakuResult {
  /** 本命星（1=一白水星〜9=九紫火星） */
  honmei: number;
  /** 月命星（1〜9） */
  getsumei: number;
  /** 九星の年（立春前の生まれは前年） */
  starYear: number;
  /** 立春前のため前年扱いになったか */
  beforeRisshun: boolean;
  /** 入力年の立春の日付 */
  risshun: MonthDay;
  /** 入力日が立春当日か */
  isRisshunDay: boolean;
  /** 入力日が月の切り替わり（節入り）の日か */
  isSetsuDay: boolean;
  /** 月命星の月（1=寅月〜12=丑月） */
  monthIndex: number;
  /** この月が始まる節入りの日（その年に節がない1月上旬は null） */
  setsuStart: MonthDay | null;
}

/** 九星の年 → 本命星（1〜9）。年の各桁の和を1桁にした数を11から引く */
export function getYearStar(starYear: number): number {
  const root = starYear % 9 === 0 ? 9 : starYear % 9;
  const star = 11 - root;
  return star > 9 ? star - 9 : star;
}

/** 本命星 → 寅月（2月）の月命星 */
function toraMonthStar(honmei: number): number {
  if (honmei === 1 || honmei === 4 || honmei === 7) return 8;
  if (honmei === 3 || honmei === 6 || honmei === 9) return 2;
  return 5;
}

/** 本命星と月（1=寅月〜12=丑月）から月命星（1〜9）を返す */
export function getMonthStar(honmei: number, monthIndex: number): number {
  const start = toraMonthStar(honmei);
  return ((((start - 1 - (monthIndex - 1)) % 9) + 9) % 9) + 1;
}

/** その年の節入りの一覧（日付順）。範囲外の年は空 */
function listSetsu(year: number): Array<MonthDay & { monthIndex: number }> {
  const out: Array<MonthDay & { monthIndex: number }> = [];
  if (year < KIGAKU_MIN_YEAR || year > KIGAKU_MAX_YEAR) return out;
  for (let month = 1; month <= 12; month++) {
    for (let day = 1; day <= 10; day++) {
      const term = getSolarTerm(year, month, day);
      const monthIndex = term ? SETSU_MONTH[term] : undefined;
      if (monthIndex) out.push({ month, day, monthIndex });
    }
  }
  return out;
}

/** その年の立春の日付（2/3〜2/5）。範囲外は null */
export function getRisshun(year: number): MonthDay | null {
  for (let day = 1; day <= 7; day++) {
    if (getSolarTerm(year, 2, day) === 'risshun') return { month: 2, day };
  }
  return null;
}

/**
 * 生年月日から本命星・月命星を求める。立春の日から新しい年、各節入りの日から新しい月として日単位で判定する
 * （節入りの時刻までは見ない）。日付が実在しない・対応範囲外の場合は null。
 */
export function getKigaku(date: DateParts): KigakuResult | null {
  const { year, month, day } = date;
  if (year < KIGAKU_MIN_YEAR || year > KIGAKU_MAX_YEAR) return null;
  if (!isValidDate(year, month, day)) return null;

  const risshun = getRisshun(year);
  if (!risshun) return null;
  const beforeRisshun =
    month < risshun.month || (month === risshun.month && day < risshun.day);
  const starYear = beforeRisshun ? year - 1 : year;
  const honmei = getYearStar(starYear);

  let monthIndex = 11; // 1月上旬の最初の節（小寒）より前は前年の子月
  let setsuStart: MonthDay | null = null;
  let isSetsuDay = false;
  for (const s of listSetsu(year)) {
    if (s.month < month || (s.month === month && s.day <= day)) {
      monthIndex = s.monthIndex;
      setsuStart = { month: s.month, day: s.day };
      isSetsuDay = s.month === month && s.day === day;
    }
  }

  return {
    honmei,
    getsumei: getMonthStar(honmei, monthIndex),
    starYear,
    beforeRisshun,
    risshun,
    isRisshunDay: month === risshun.month && day === risshun.day,
    isSetsuDay,
    monthIndex,
    setsuStart,
  };
}

export interface StarTableRow {
  /** 本命星（1〜9） */
  star: number;
  /** その本命星にあたる年（立春〜翌年の節分まで）。昇順 */
  years: number[];
}

/** 年→星の早見表。本命星ごとに年を並べる（fromYear〜toYear は九星の年） */
export function getStarTable(fromYear: number, toYear: number): StarTableRow[] {
  const rows: StarTableRow[] = Array.from({ length: 9 }, (_, i) => ({
    star: i + 1,
    years: [],
  }));
  for (let y = fromYear; y <= toYear; y++) {
    rows[getYearStar(y) - 1].years.push(y);
  }
  return rows;
}
