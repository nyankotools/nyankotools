import { isValidDate, type DateParts } from './date-calculator';

/**
 * 日本の学校制度（4月始まり）を前提にした学年早見表のロジック。
 *
 * 「学年生まれ年度」(birthSchoolYear) は、その年の4月2日〜翌年4月1日に生まれた子の
 * 共通の基準となる年。4月1日生まれは法律上の加齢日（誕生日の前日）の関係で
 * 前年度の学年に属するため、4/1以前は前年扱いになる。
 * 学年 = 基準年度 - 学年生まれ年度 で決まる（n: 7 → 小1、13 → 中1、16 → 高1、19 → 大1）。
 */

export type SchoolStage =
  | 'unborn'
  | 'preschool'
  | 'kindergarten'
  | 'elementary'
  | 'junior-high'
  | 'high-school'
  | 'university'
  | 'graduated';

export interface SchoolGrade {
  stage: SchoolStage;
  /** 学校段階内の学年（幼稚園は年少=1・年中=2・年長=3）。段階外は0 */
  grade: number;
}

export interface StageDefinition {
  stage:
    | 'kindergarten'
    | 'elementary'
    | 'junior-high'
    | 'high-school'
    | 'university';
  /** 学年生まれ年度から入学（4月）までの年数 */
  entryOffset: number;
  years: number;
}

export const STAGES: readonly StageDefinition[] = [
  { stage: 'kindergarten', entryOffset: 4, years: 3 },
  { stage: 'elementary', entryOffset: 7, years: 6 },
  { stage: 'junior-high', entryOffset: 13, years: 3 },
  { stage: 'high-school', entryOffset: 16, years: 3 },
  { stage: 'university', entryOffset: 19, years: 4 },
];

const MIN_YEAR = 1;
const MAX_YEAR = 9999;

function isValidYear(year: number): boolean {
  return Number.isInteger(year) && year >= MIN_YEAR && year <= MAX_YEAR;
}

/** 日付が属する年度（4月始まり）。4月1日は新年度の初日。 */
export function schoolYearOf(date: DateParts): number | null {
  if (!isValidDate(date.year, date.month, date.day)) return null;
  return date.month >= 4 ? date.year : date.year - 1;
}

/**
 * 生年月日から「学年生まれ年度」を求める。
 * 4月2日〜翌4月1日生まれが同じ学年（4月1日生まれは早生まれ扱いで前年度）。
 */
export function birthSchoolYear(birth: DateParts): number | null {
  if (!isValidDate(birth.year, birth.month, birth.day)) return null;
  const earlyBorn = birth.month < 4 || (birth.month === 4 && birth.day === 1);
  return earlyBorn ? birth.year - 1 : birth.year;
}

/** 早生まれ（1月1日〜4月1日生まれ）かどうか。不正な日付はnull。 */
export function isEarlyBorn(birth: DateParts): boolean | null {
  if (!isValidDate(birth.year, birth.month, birth.day)) return null;
  return birth.month < 4 || (birth.month === 4 && birth.day === 1);
}

/** 学年生まれ年度と基準年度から、その年度の学年を返す。 */
export function gradeInSchoolYear(
  birthYear: number,
  baseYear: number,
): SchoolGrade | null {
  if (!isValidYear(birthYear) || !isValidYear(baseYear)) return null;
  const n = baseYear - birthYear;
  if (n < 0) return { stage: 'unborn', grade: 0 };
  for (const def of STAGES) {
    if (n >= def.entryOffset && n < def.entryOffset + def.years) {
      return { stage: def.stage, grade: n - def.entryOffset + 1 };
    }
  }
  const last = STAGES[STAGES.length - 1];
  if (n >= last.entryOffset + last.years)
    return { stage: 'graduated', grade: 0 };
  return { stage: 'preschool', grade: 0 };
}

/** 生年月日と基準年度から学年を求める。 */
export function gradeFromBirth(
  birth: DateParts,
  baseYear: number,
): SchoolGrade | null {
  const by = birthSchoolYear(birth);
  if (by === null) return null;
  return gradeInSchoolYear(by, baseYear);
}

export interface BirthRange {
  /** 学年生まれ年度 */
  birthSchoolYear: number;
  /** 生まれた範囲の開始日（4月2日） */
  from: DateParts;
  /** 生まれた範囲の終了日（翌年4月1日） */
  to: DateParts;
  /** 4月1日時点の満年齢（新年度の開始時点） */
  ageAtApril1: number;
}

/** 学年生まれ年度から、その学年に該当する生年月日の範囲を求める。 */
export function birthRangeOf(
  birthYear: number,
  baseYear: number,
): BirthRange | null {
  if (!isValidYear(birthYear) || !isValidYear(baseYear)) return null;
  if (birthYear + 1 > MAX_YEAR) return null;
  return {
    birthSchoolYear: birthYear,
    from: { year: birthYear, month: 4, day: 2 },
    to: { year: birthYear + 1, month: 4, day: 1 },
    ageAtApril1: baseYear - birthYear - 1,
  };
}

/** 学校段階・学年・基準年度から、該当する学年生まれ年度を求める。範囲外はnull。 */
export function birthYearForGrade(
  stage: StageDefinition['stage'],
  grade: number,
  baseYear: number,
): number | null {
  const def = STAGES.find((s) => s.stage === stage);
  if (!def || !Number.isInteger(grade) || grade < 1 || grade > def.years) {
    return null;
  }
  if (!isValidYear(baseYear)) return null;
  const by = baseYear - (def.entryOffset + grade - 1);
  return isValidYear(by) ? by : null;
}

export interface Milestone {
  stage: StageDefinition['stage'];
  /** 入学する年（4月） */
  entryYear: number;
  /** 卒業・修了する年（3月） */
  graduationYear: number;
}

/** 学年生まれ年度から、各学校の入学年・卒業年（標準的に進学した場合）を返す。 */
export function milestonesOf(birthYear: number): Milestone[] | null {
  if (!isValidYear(birthYear)) return null;
  return STAGES.map((def) => ({
    stage: def.stage,
    entryYear: birthYear + def.entryOffset,
    graduationYear: birthYear + def.entryOffset + def.years,
  }));
}

export interface GradeTableRow {
  stage: StageDefinition['stage'];
  grade: number;
  range: BirthRange;
}

/** 基準年度における学年早見表（年少〜大学4年）を返す。生年が1年未満になる行は除く。 */
export function gradeTable(baseYear: number): GradeTableRow[] | null {
  if (!isValidYear(baseYear)) return null;
  const rows: GradeTableRow[] = [];
  for (const def of STAGES) {
    for (let g = 1; g <= def.years; g++) {
      const by = baseYear - (def.entryOffset + g - 1);
      const range = birthRangeOf(by, baseYear);
      if (range) rows.push({ stage: def.stage, grade: g, range });
    }
  }
  return rows;
}
