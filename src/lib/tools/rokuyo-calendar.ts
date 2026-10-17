/**
 * 六曜・旧暦・二十四節気の計算（天保暦の規則を天文計算で再現）。
 *
 * - 朔（新月）: Meeus "Astronomical Algorithms" 第49章の主要項
 * - 太陽黄経: Meeus 第25章（見かけの黄経）
 * - 旧暦の月: 朔から次の朔の前日までを1か月とし、含まれる中気（太陽黄経が30度の倍数になる日）で月番号を決める。
 *   中気を含まない月は閏月（直前の月と同じ番号）。日付はすべて日本標準時（JST）の暦日で判定する。
 */

export const MIN_YEAR = 1900;
export const MAX_YEAR = 2100;

export type RokuyoKey =
  'taian' | 'shakko' | 'sensho' | 'tomobiki' | 'senbu' | 'butsumetsu';

/** (旧暦の月 + 旧暦の日) を6で割った余りの順 */
export const ROKUYO_ORDER: readonly RokuyoKey[] = [
  'taian',
  'shakko',
  'sensho',
  'tomobiki',
  'senbu',
  'butsumetsu',
];

export type SolarTermKey =
  | 'shunbun'
  | 'seimei'
  | 'kokuu'
  | 'rikka'
  | 'shouman'
  | 'boushu'
  | 'geshi'
  | 'shousho'
  | 'taisho'
  | 'risshuu'
  | 'shosho'
  | 'hakuro'
  | 'shuubun'
  | 'kanro'
  | 'soukou'
  | 'rittou'
  | 'shousetsu'
  | 'taisetsu'
  | 'touji'
  | 'shoukan'
  | 'daikan'
  | 'risshun'
  | 'usui'
  | 'keichitsu';

/** 太陽黄経 0°, 15°, 30° … 345° に対応する二十四節気 */
export const SOLAR_TERM_ORDER: readonly SolarTermKey[] = [
  'shunbun',
  'seimei',
  'kokuu',
  'rikka',
  'shouman',
  'boushu',
  'geshi',
  'shousho',
  'taisho',
  'risshuu',
  'shosho',
  'hakuro',
  'shuubun',
  'kanro',
  'soukou',
  'rittou',
  'shousetsu',
  'taisetsu',
  'touji',
  'shoukan',
  'daikan',
  'risshun',
  'usui',
  'keichitsu',
];

export interface LunarDate {
  /** 旧暦の月（1〜12） */
  month: number;
  /** 閏月かどうか */
  leap: boolean;
  /** 旧暦の日（1〜30） */
  day: number;
  rokuyo: RokuyoKey;
}

export function isValidYear(year: number): boolean {
  return Number.isInteger(year) && year >= MIN_YEAR && year <= MAX_YEAR;
}

// ---- 日付と通日 -------------------------------------------------------------

/** グレゴリオ暦の日付 → 通日（ユリウス日の整数部。その日の正午の値） */
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

function fromJdn(jdn: number): { year: number; month: number; day: number } {
  const a = jdn + 32044;
  const b = Math.floor((4 * a + 3) / 146097);
  const c = a - Math.floor((146097 * b) / 4);
  const d = Math.floor((4 * c + 3) / 1461);
  const e = c - Math.floor((1461 * d) / 4);
  const m = Math.floor((5 * e + 2) / 153);
  return {
    day: e - Math.floor((153 * m + 2) / 5) + 1,
    month: m + 3 - 12 * Math.floor(m / 10),
    year: 100 * b + d - 4800 + Math.floor(m / 10),
  };
}

function iso(jdn: number): string {
  const { year, month, day } = fromJdn(jdn);
  return `${String(year).padStart(4, '0')}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

// ---- 天文計算 ---------------------------------------------------------------

const RAD = Math.PI / 180;

function sinDeg(deg: number): number {
  return Math.sin(deg * RAD);
}

/** ΔT（秒）= TT − UT。Espenak & Meeus の近似式（1900〜2150年） */
function deltaT(decimalYear: number): number {
  const y = decimalYear;
  if (y < 1920) {
    const t = y - 1900;
    return (
      -2.79 +
      1.494119 * t -
      0.0598939 * t ** 2 +
      0.0061966 * t ** 3 -
      0.000197 * t ** 4
    );
  }
  if (y < 1941) {
    const t = y - 1920;
    return 21.2 + 0.84493 * t - 0.0761 * t ** 2 + 0.0020936 * t ** 3;
  }
  if (y < 1961) {
    const t = y - 1950;
    return 29.07 + 0.407 * t - t ** 2 / 233 + t ** 3 / 2547;
  }
  if (y < 1986) {
    const t = y - 1975;
    return 45.45 + 1.067 * t - t ** 2 / 260 - t ** 3 / 718;
  }
  if (y < 2005) {
    const t = y - 2000;
    return (
      63.86 +
      0.3345 * t -
      0.060374 * t ** 2 +
      0.0017275 * t ** 3 +
      0.000651814 * t ** 4 +
      0.00002373599 * t ** 5
    );
  }
  if (y < 2050) {
    const t = y - 2000;
    return 62.92 + 0.32217 * t + 0.005589 * t ** 2;
  }
  return -20 + 32 * ((y - 1820) / 100) ** 2 - 0.5628 * (2150 - y);
}

/** 力学時のユリウス日 → JST の暦日の通日 */
function jdeToJstDay(jde: number): number {
  const decimalYear = 2000 + (jde - 2451545) / 365.25;
  const jdUt = jde - deltaT(decimalYear) / 86400;
  return Math.floor(jdUt + 0.5 + 9 / 24);
}

/** k 番目の朔（k=0 が 2000年1月6日ごろ）の力学時ユリウス日 */
function newMoonJde(k: number): number {
  const t = k / 1236.85;
  const jde =
    2451550.09766 +
    29.530588861 * k +
    0.00015437 * t ** 2 -
    0.00000015 * t ** 3 +
    0.00000000073 * t ** 4;
  const e = 1 - 0.002516 * t - 0.0000074 * t ** 2;
  const m = 2.5534 + 29.1053567 * k - 0.0000014 * t ** 2 - 0.00000011 * t ** 3;
  const mp =
    201.5643 +
    385.81693528 * k +
    0.0107582 * t ** 2 +
    0.00001238 * t ** 3 -
    0.000000058 * t ** 4;
  const f =
    160.7108 +
    390.67050284 * k -
    0.0016118 * t ** 2 -
    0.00000227 * t ** 3 +
    0.000000011 * t ** 4;
  const om =
    124.7746 - 1.56375588 * k + 0.0020672 * t ** 2 + 0.00000215 * t ** 3;

  const corr =
    -0.4072 * sinDeg(mp) +
    0.17241 * e * sinDeg(m) +
    0.01608 * sinDeg(2 * mp) +
    0.01039 * sinDeg(2 * f) +
    0.00739 * e * sinDeg(mp - m) -
    0.00514 * e * sinDeg(mp + m) +
    0.00208 * e * e * sinDeg(2 * m) -
    0.00111 * sinDeg(mp - 2 * f) -
    0.00057 * sinDeg(mp + 2 * f) +
    0.00056 * e * sinDeg(2 * mp + m) -
    0.00042 * sinDeg(3 * mp) +
    0.00042 * e * sinDeg(m + 2 * f) +
    0.00038 * e * sinDeg(m - 2 * f) -
    0.00024 * e * sinDeg(2 * mp - m) -
    0.00017 * sinDeg(om) -
    0.00007 * sinDeg(mp + 2 * m) +
    0.00004 * sinDeg(2 * mp - 2 * f) +
    0.00004 * sinDeg(3 * m) +
    0.00003 * sinDeg(mp + m - 2 * f) +
    0.00003 * sinDeg(2 * mp + 2 * f) -
    0.00003 * sinDeg(mp + m + 2 * f) +
    0.00003 * sinDeg(mp - m + 2 * f) -
    0.00002 * sinDeg(mp - m - 2 * f) -
    0.00002 * sinDeg(3 * mp + m) +
    0.00002 * sinDeg(4 * mp);
  return jde + corr;
}

/** 太陽の見かけの黄経（度、0〜360） */
function solarLongitude(jde: number): number {
  const t = (jde - 2451545) / 36525;
  const l0 = 280.46646 + 36000.76983 * t + 0.0003032 * t ** 2;
  const m = 357.52911 + 35999.05029 * t - 0.0001537 * t ** 2;
  const c =
    (1.914602 - 0.004817 * t - 0.000014 * t ** 2) * sinDeg(m) +
    (0.019993 - 0.000101 * t) * sinDeg(2 * m) +
    0.000289 * sinDeg(3 * m);
  const om = 125.04 - 1934.136 * t;
  const apparent = l0 + c - 0.00569 - 0.00478 * sinDeg(om);
  return ((apparent % 360) + 360) % 360;
}

/** 太陽黄経が target 度になる力学時ユリウス日（guess 付近） */
function solveSolarLongitude(target: number, guess: number): number {
  let jde = guess;
  for (let i = 0; i < 8; i++) {
    let diff = target - solarLongitude(jde);
    diff = ((diff + 540) % 360) - 180;
    jde += diff / 0.9856;
    if (Math.abs(diff) < 1e-7) break;
  }
  return jde;
}

// ---- 旧暦テーブル -----------------------------------------------------------

interface LunarMonth {
  /** 朔日の通日 */
  start: number;
  /** 次の朔日の通日（この月に含まれない） */
  end: number;
  month: number;
  leap: boolean;
}

interface YearTable {
  months: LunarMonth[];
  /** 通日 → 二十四節気 */
  terms: Map<number, SolarTermKey>;
}

const tableCache = new Map<number, YearTable>();

function buildTable(year: number): YearTable {
  // 二十四節気: 前年・当年・翌年の春分から1周ぶん
  const terms = new Map<number, SolarTermKey>();
  /** 中気（黄経30度の倍数）の通日 */
  const mainTerms = new Set<number>();
  /** 冬至（黄経270度）の通日 */
  const solstices: number[] = [];
  for (let g = year - 1; g <= year + 1; g++) {
    const springEquinoxGuess = toJdn(g, 3, 20) - 0.5;
    for (let i = 0; i < 24; i++) {
      const target = i * 15;
      const guess = springEquinoxGuess + (target / 360) * 365.2422;
      const day = jdeToJstDay(solveSolarLongitude(target, guess));
      terms.set(day, SOLAR_TERM_ORDER[i]);
      if (i % 2 === 0) mainTerms.add(day);
      if (target === 270) solstices.push(day);
    }
  }

  // 朔: 前年10月ごろ〜翌々年1月ごろ
  const kStart = Math.floor((year - 1 + 0.75 - 2000) * 12.3685);
  const kEnd = Math.ceil((year + 2 + 0.1 - 2000) * 12.3685);
  const starts: number[] = [];
  for (let k = kStart; k <= kEnd; k++) {
    const day = jdeToJstDay(newMoonJde(k));
    if (starts[starts.length - 1] !== day) starts.push(day);
  }

  // 冬至を含む月を11月とし、次の冬至の月までが13か月なら、最初の中気のない月を閏月にする
  const hasMainTerm = (i: number) => {
    for (let d = starts[i]; d < starts[i + 1]; d++) {
      if (mainTerms.has(d)) return true;
    }
    return false;
  };
  const anchors = solstices
    .map((day) =>
      starts.findIndex(
        (s, i) => i + 1 < starts.length && day >= s && day < starts[i + 1],
      ),
    )
    .filter((i) => i >= 0);
  const months: LunarMonth[] = [];
  for (let n = 0; n + 1 < anchors.length; n++) {
    const a = anchors[n];
    const b = anchors[n + 1];
    let leapIndex = -1;
    if (b - a >= 13) {
      for (let i = a + 1; i < b; i++) {
        if (!hasMainTerm(i)) {
          leapIndex = i;
          break;
        }
      }
      if (leapIndex < 0) leapIndex = b - 1;
    }
    let month = 11;
    for (let i = a; i < b; i++) {
      const leap = i === leapIndex;
      if (i > a && !leap) month = (month % 12) + 1;
      months.push({ start: starts[i], end: starts[i + 1], month, leap });
    }
  }
  return { months, terms };
}

function getTable(year: number): YearTable {
  let table = tableCache.get(year);
  if (!table) {
    table = buildTable(year);
    tableCache.set(year, table);
  }
  return table;
}

function lunarOf(table: YearTable, jdn: number): LunarDate | null {
  const m = table.months.find((x) => jdn >= x.start && jdn < x.end);
  if (!m) return null;
  const day = jdn - m.start + 1;
  return {
    month: m.month,
    leap: m.leap,
    day,
    rokuyo: ROKUYO_ORDER[(m.month + day) % 6],
  };
}

/** 指定日の旧暦・六曜。範囲外の年や存在しない日付は null */
export function getLunarDate(
  year: number,
  month: number,
  day: number,
): LunarDate | null {
  const jdn = validJdn(year, month, day);
  if (jdn === null) return null;
  return lunarOf(getTable(year), jdn);
}

/** 指定日がその年の二十四節気の日ならそのキー */
export function getSolarTerm(
  year: number,
  month: number,
  day: number,
): SolarTermKey | null {
  const jdn = validJdn(year, month, day);
  if (jdn === null) return null;
  return getTable(year).terms.get(jdn) ?? null;
}

function validJdn(year: number, month: number, day: number): number | null {
  if (!isValidYear(year)) return null;
  if (!Number.isInteger(month) || month < 1 || month > 12) return null;
  if (!Number.isInteger(day) || day < 1) return null;
  const jdn = toJdn(year, month, day);
  const back = fromJdn(jdn);
  if (back.year !== year || back.month !== month || back.day !== day) {
    return null;
  }
  return jdn;
}

export interface RokuyoDay {
  day: number;
  lunar: LunarDate;
  term: SolarTermKey | null;
}

/** 指定月の各日の旧暦・六曜・二十四節気（添字0 = 1日）。範囲外は null */
export function getRokuyoMonth(
  year: number,
  month: number,
): RokuyoDay[] | null {
  if (!isValidYear(year) || !Number.isInteger(month)) return null;
  if (month < 1 || month > 12) return null;
  const table = getTable(year);
  const first = toJdn(year, month, 1);
  const total =
    toJdn(month === 12 ? year + 1 : year, (month % 12) + 1, 1) - first;
  const out: RokuyoDay[] = [];
  for (let i = 0; i < total; i++) {
    const lunar = lunarOf(table, first + i);
    if (!lunar) return null;
    out.push({ day: i + 1, lunar, term: table.terms.get(first + i) ?? null });
  }
  return out;
}

/** 指定月の日を六曜ごとにまとめる */
export function groupByRokuyo(days: RokuyoDay[]): Record<RokuyoKey, number[]> {
  const out: Record<RokuyoKey, number[]> = {
    taian: [],
    shakko: [],
    sensho: [],
    tomobiki: [],
    senbu: [],
    butsumetsu: [],
  };
  for (const d of days) out[d.lunar.rokuyo].push(d.day);
  return out;
}

/** 指定年の旧暦1月1日（旧正月）のグレゴリオ暦の日付（YYYY-MM-DD） */
export function getLunarNewYear(year: number): string | null {
  if (!isValidYear(year)) return null;
  const m = getTable(year).months.find((x) => {
    if (x.month !== 1 || x.leap) return false;
    return fromJdn(x.start).year === year;
  });
  return m ? iso(m.start) : null;
}
