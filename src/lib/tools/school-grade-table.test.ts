import { describe, expect, it } from 'vitest';
import {
  birthRangeOf,
  birthSchoolYear,
  birthYearForGrade,
  gradeFromBirth,
  gradeInSchoolYear,
  gradeTable,
  isEarlyBorn,
  milestonesOf,
  schoolYearOf,
} from './school-grade-table';

describe('birthSchoolYear / isEarlyBorn', () => {
  it('4月2日生まれはその年の学年生まれ年度', () => {
    expect(birthSchoolYear({ year: 2000, month: 4, day: 2 })).toBe(2000);
    expect(isEarlyBorn({ year: 2000, month: 4, day: 2 })).toBe(false);
  });

  it('4月1日生まれは早生まれで前年度', () => {
    expect(birthSchoolYear({ year: 2001, month: 4, day: 1 })).toBe(2000);
    expect(isEarlyBorn({ year: 2001, month: 4, day: 1 })).toBe(true);
  });

  it('1月1日・3月31日生まれは早生まれ', () => {
    expect(birthSchoolYear({ year: 2001, month: 1, day: 1 })).toBe(2000);
    expect(isEarlyBorn({ year: 2001, month: 3, day: 31 })).toBe(true);
  });

  it('12月31日生まれは遅生まれ', () => {
    expect(birthSchoolYear({ year: 2000, month: 12, day: 31 })).toBe(2000);
    expect(isEarlyBorn({ year: 2000, month: 12, day: 31 })).toBe(false);
  });

  it('存在しない日付はnull', () => {
    expect(birthSchoolYear({ year: 2001, month: 2, day: 29 })).toBeNull();
    expect(isEarlyBorn({ year: 2001, month: 13, day: 1 })).toBeNull();
  });

  it('うるう日(2/29)も早生まれとして扱える', () => {
    expect(birthSchoolYear({ year: 2000, month: 2, day: 29 })).toBe(1999);
  });
});

describe('schoolYearOf', () => {
  it('3月31日は前年度、4月1日は新年度', () => {
    expect(schoolYearOf({ year: 2026, month: 3, day: 31 })).toBe(2025);
    expect(schoolYearOf({ year: 2026, month: 4, day: 1 })).toBe(2026);
    expect(schoolYearOf({ year: 2026, month: 10, day: 13 })).toBe(2026);
  });
});

describe('gradeInSchoolYear', () => {
  it('2000年4月2日〜2001年4月1日生まれは2007年度に小学1年', () => {
    expect(gradeInSchoolYear(2000, 2007)).toEqual({
      stage: 'elementary',
      grade: 1,
    });
    expect(gradeInSchoolYear(2000, 2012)).toEqual({
      stage: 'elementary',
      grade: 6,
    });
  });

  it('中学・高校・大学の学年', () => {
    expect(gradeInSchoolYear(2000, 2013)).toEqual({
      stage: 'junior-high',
      grade: 1,
    });
    expect(gradeInSchoolYear(2000, 2018)).toEqual({
      stage: 'high-school',
      grade: 3,
    });
    expect(gradeInSchoolYear(2000, 2019)).toEqual({
      stage: 'university',
      grade: 1,
    });
    expect(gradeInSchoolYear(2000, 2022)).toEqual({
      stage: 'university',
      grade: 4,
    });
    expect(gradeInSchoolYear(2000, 2023)).toEqual({
      stage: 'graduated',
      grade: 0,
    });
  });

  it('幼稚園（年少・年中・年長）と未就学・未誕生', () => {
    expect(gradeInSchoolYear(2000, 2004)).toEqual({
      stage: 'kindergarten',
      grade: 1,
    });
    expect(gradeInSchoolYear(2000, 2006)).toEqual({
      stage: 'kindergarten',
      grade: 3,
    });
    expect(gradeInSchoolYear(2000, 2003)).toEqual({
      stage: 'preschool',
      grade: 0,
    });
    expect(gradeInSchoolYear(2000, 1999)).toEqual({
      stage: 'unborn',
      grade: 0,
    });
  });

  it('範囲外の年はnull', () => {
    expect(gradeInSchoolYear(0, 2000)).toBeNull();
    expect(gradeInSchoolYear(2000, 10000)).toBeNull();
    expect(gradeInSchoolYear(2000.5, 2010)).toBeNull();
  });
});

describe('gradeFromBirth', () => {
  it('早生まれは同じ暦年の遅生まれより1学年上', () => {
    const early = gradeFromBirth({ year: 2015, month: 2, day: 1 }, 2026);
    const late = gradeFromBirth({ year: 2015, month: 5, day: 1 }, 2026);
    expect(early).toEqual({ stage: 'elementary', grade: 6 });
    expect(late).toEqual({ stage: 'elementary', grade: 5 });
  });

  it('不正な生年月日はnull', () => {
    expect(gradeFromBirth({ year: 2015, month: 2, day: 30 }, 2026)).toBeNull();
  });
});

describe('birthRangeOf', () => {
  it('4月2日〜翌年4月1日と4月1日時点の年齢', () => {
    expect(birthRangeOf(2019, 2026)).toEqual({
      birthSchoolYear: 2019,
      from: { year: 2019, month: 4, day: 2 },
      to: { year: 2020, month: 4, day: 1 },
      ageAtApril1: 6,
    });
  });

  it('9999年度生まれは翌年が範囲外のためnull', () => {
    expect(birthRangeOf(9999, 9999)).toBeNull();
  });
});

describe('birthYearForGrade', () => {
  it('2026年度の小学1年は2019年度生まれ', () => {
    expect(birthYearForGrade('elementary', 1, 2026)).toBe(2019);
  });

  it('2026年度の高校3年は2008年度生まれ', () => {
    expect(birthYearForGrade('high-school', 3, 2026)).toBe(2008);
  });

  it('学年が範囲外ならnull', () => {
    expect(birthYearForGrade('elementary', 7, 2026)).toBeNull();
    expect(birthYearForGrade('elementary', 0, 2026)).toBeNull();
  });

  it('往復で一致する', () => {
    const by = birthYearForGrade('junior-high', 2, 2030)!;
    expect(gradeInSchoolYear(by, 2030)).toEqual({
      stage: 'junior-high',
      grade: 2,
    });
  });
});

describe('milestonesOf', () => {
  it('2000年度生まれの入学・卒業年', () => {
    const m = milestonesOf(2000)!;
    const get = (s: string) => m.find((x) => x.stage === s)!;
    expect(get('kindergarten')).toMatchObject({
      entryYear: 2004,
      graduationYear: 2007,
    });
    expect(get('elementary')).toMatchObject({
      entryYear: 2007,
      graduationYear: 2013,
    });
    expect(get('junior-high')).toMatchObject({
      entryYear: 2013,
      graduationYear: 2016,
    });
    expect(get('high-school')).toMatchObject({
      entryYear: 2016,
      graduationYear: 2019,
    });
    expect(get('university')).toMatchObject({
      entryYear: 2019,
      graduationYear: 2023,
    });
  });

  it('範囲外はnull', () => {
    expect(milestonesOf(0)).toBeNull();
  });
});

describe('gradeTable', () => {
  it('年少〜大学4年の19行', () => {
    const rows = gradeTable(2026)!;
    expect(rows).toHaveLength(19);
    expect(rows[0]).toMatchObject({ stage: 'kindergarten', grade: 1 });
    expect(rows[0].range.birthSchoolYear).toBe(2022);
    expect(rows[18]).toMatchObject({ stage: 'university', grade: 4 });
    expect(rows[18].range.birthSchoolYear).toBe(2004);
  });

  it('年度が小さい場合は生年が1未満の行を除く', () => {
    const rows = gradeTable(5)!;
    expect(rows.length).toBeLessThan(19);
    expect(rows.every((r) => r.range.birthSchoolYear >= 1)).toBe(true);
  });

  it('範囲外の年度はnull', () => {
    expect(gradeTable(0)).toBeNull();
  });
});

describe('境界の年（西暦1年・9999年）', () => {
  it('西暦1年1月1日・4月1日生まれは学年生まれ年度が0になる（範囲外）', () => {
    expect(birthSchoolYear({ year: 1, month: 1, day: 1 })).toBe(0);
    expect(birthSchoolYear({ year: 1, month: 4, day: 2 })).toBe(1);
  });

  it('9999年12月31日生まれは基準年度9999で就学前扱い', () => {
    expect(gradeFromBirth({ year: 9999, month: 12, day: 31 }, 9999)).toEqual({
      stage: 'preschool',
      grade: 0,
    });
  });

  it('基準年度9999の早見表は19行で、年少の行は9995年度生まれ', () => {
    const rows = gradeTable(9999)!;
    expect(rows).toHaveLength(19);
    expect(rows[0].range.birthSchoolYear).toBe(9995);
    expect(rows[18].range.birthSchoolYear).toBe(9977);
  });
});
