export interface EraDefinition {
  /** 元号（例: 令和） */
  name: string;
  /** ローマ字表記（例: Reiwa） */
  romaji: string;
  /** 元号開始日（この日を含む） */
  start: { year: number; month: number; day: number };
}

/** 明治以降の元号定義。開始日は改元日（この日から新元号）。 */
export const ERAS: EraDefinition[] = [
  { name: '明治', romaji: 'Meiji', start: { year: 1868, month: 1, day: 25 } },
  { name: '大正', romaji: 'Taisho', start: { year: 1912, month: 7, day: 30 } },
  { name: '昭和', romaji: 'Showa', start: { year: 1926, month: 12, day: 25 } },
  { name: '平成', romaji: 'Heisei', start: { year: 1989, month: 1, day: 8 } },
  { name: '令和', romaji: 'Reiwa', start: { year: 2019, month: 5, day: 1 } },
];

function toComparable(year: number, month: number, day: number): number {
  return year * 10000 + month * 100 + day;
}

/** 指定した日付が実在するかどうか（うるう年・月末日を考慮） */
export function isValidDate(year: number, month: number, day: number): boolean {
  if (
    !Number.isInteger(year) ||
    !Number.isInteger(month) ||
    !Number.isInteger(day)
  ) {
    return false;
  }
  if (month < 1 || month > 12 || day < 1) return false;
  const date = new Date(year, month - 1, day);
  return (
    date.getFullYear() === year &&
    date.getMonth() === month - 1 &&
    date.getDate() === day
  );
}

export interface WarekiResult {
  era: EraDefinition;
  /** 元号内の年数（元年は1） */
  eraYear: number;
}

/**
 * 西暦の年月日を和暦（元号・元号年）に変換する。
 * 明治より前の日付、または不正な日付は null。
 */
export function westernToWareki(
  year: number,
  month: number,
  day: number,
): WarekiResult | null {
  if (!isValidDate(year, month, day)) return null;

  const target = toComparable(year, month, day);
  let matched: EraDefinition | null = null;
  for (const era of ERAS) {
    const eraStart = toComparable(
      era.start.year,
      era.start.month,
      era.start.day,
    );
    if (target >= eraStart) {
      matched = era;
    }
  }
  if (!matched) return null;

  const eraYear = year - matched.start.year + 1;
  return { era: matched, eraYear };
}

/**
 * 和暦（元号名・元号年・月日）を西暦の年に変換する。
 * 元号名が不明、元号年が1未満、次の元号の開始日を超える、または不正な日付は null。
 */
export function warekiToWestern(
  eraName: string,
  eraYear: number,
  month: number,
  day: number,
): number | null {
  const eraIndex = ERAS.findIndex((e) => e.name === eraName);
  if (eraIndex === -1) return null;
  if (!Number.isInteger(eraYear) || eraYear < 1) return null;

  const era = ERAS[eraIndex];
  const year = era.start.year + eraYear - 1;
  if (!isValidDate(year, month, day)) return null;

  const target = toComparable(year, month, day);
  const eraStart = toComparable(era.start.year, era.start.month, era.start.day);
  if (target < eraStart) return null;

  const nextEra = ERAS[eraIndex + 1];
  if (nextEra) {
    const nextStart = toComparable(
      nextEra.start.year,
      nextEra.start.month,
      nextEra.start.day,
    );
    if (target >= nextStart) return null;
  }

  return year;
}

/** 元号年の表示用フォーマット（元年は「元年」、それ以外は数字+年） */
export function formatEraYear(eraYear: number): string {
  return eraYear === 1 ? '元年' : `${eraYear}年`;
}
