import { describe, it, expect } from 'vitest';
import {
  addBusinessDays,
  countBusinessDays,
  getHolidays,
  isBusinessDay,
  parseIso,
} from './business-day-calculator';

const all = { excludeHolidays: true, excludeYearEnd: false };
const dates = (year: number) => getHolidays(year).map((h) => h.date);

describe('getHolidays', () => {
  it('2026年: 振替休日と国民の休日を含む', () => {
    expect(getHolidays(2026).map((h) => `${h.date} ${h.key}`)).toEqual([
      '2026-01-01 newYear',
      '2026-01-12 comingOfAge',
      '2026-02-11 foundation',
      '2026-02-23 emperorBirthday',
      '2026-03-20 springEquinox',
      '2026-04-29 showa',
      '2026-05-03 constitution',
      '2026-05-04 greenery',
      '2026-05-05 children',
      '2026-05-06 substitute',
      '2026-07-20 marine',
      '2026-08-11 mountain',
      '2026-09-21 respect',
      '2026-09-22 citizen',
      '2026-09-23 autumnEquinox',
      '2026-10-12 sports',
      '2026-11-03 culture',
      '2026-11-23 laborThanks',
    ]);
  });

  it('2019年: 退位・即位関連の祝日と国民の休日', () => {
    const d = dates(2019);
    expect(d).toContain('2019-04-30');
    expect(d).toContain('2019-05-01');
    expect(d).toContain('2019-05-02');
    expect(d).toContain('2019-10-22');
    expect(d).not.toContain('2019-02-23');
    expect(d).toContain('2019-09-23');
  });

  it('2020・2021年: 東京五輪による移動', () => {
    expect(dates(2020)).toEqual(
      expect.arrayContaining(['2020-07-23', '2020-07-24', '2020-08-10']),
    );
    expect(dates(2020)).not.toContain('2020-10-12');
    expect(dates(2021)).toEqual(
      expect.arrayContaining([
        '2021-07-22',
        '2021-07-23',
        '2021-08-08',
        '2021-08-09',
      ]),
    );
  });

  it('2009年: 9/22 が国民の休日', () => {
    expect(getHolidays(2009).find((h) => h.date === '2009-09-22')?.key).toBe(
      'citizen',
    );
  });

  it('2006年以前: 5/4 は国民の休日、4/29 はみどりの日', () => {
    const h = getHolidays(2004);
    expect(h.find((x) => x.date === '2004-05-04')?.key).toBe('citizen');
    expect(h.find((x) => x.date === '2004-04-29')?.key).toBe('greenery');
  });

  it('春分・秋分の日（2030年）と範囲外の年', () => {
    expect(dates(2030)).toEqual(
      expect.arrayContaining(['2030-03-20', '2030-09-23']),
    );
    expect(getHolidays(1999)).toEqual([]);
    expect(getHolidays(2100)).toEqual([]);
  });
});

describe('営業日計算', () => {
  it('parseIso は実在しない日付を弾く', () => {
    expect(parseIso('2026-02-30')).toBeNull();
    expect(parseIso('abc')).toBeNull();
    expect(parseIso('2024-02-29')).not.toBeNull();
  });

  it('isBusinessDay: 平日・土日・祝日・年末年始', () => {
    expect(isBusinessDay('2026-10-02', all)).toBe(true);
    expect(isBusinessDay('2026-10-03', all)).toBe(false);
    expect(isBusinessDay('2026-11-03', all)).toBe(false);
    expect(
      isBusinessDay('2026-11-03', { ...all, excludeHolidays: false }),
    ).toBe(true);
    expect(isBusinessDay('2026-12-29', all)).toBe(true);
    expect(isBusinessDay('2026-12-29', { ...all, excludeYearEnd: true })).toBe(
      false,
    );
  });

  it('addBusinessDays: ゴールデンウィークをまたぐ', () => {
    // 2026-05-01(金)の1営業日後は 5/7(木)（5/2〜5/6 が休み）
    expect(addBusinessDays('2026-05-01', 1, all)).toEqual({
      date: '2026-05-07',
    });
    expect(addBusinessDays('2026-05-07', -1, all)).toEqual({
      date: '2026-05-01',
    });
    expect(addBusinessDays('2026-10-02', 0, all)).toEqual({
      date: '2026-10-02',
    });
  });

  it('addBusinessDays: 範囲外・不正入力', () => {
    expect(addBusinessDays('2099-12-30', 5, all)).toEqual({
      error: 'outOfRange',
    });
    expect(addBusinessDays('2026-13-01', 1, all)).toEqual({
      error: 'invalidDate',
    });
    expect(addBusinessDays('2026-01-01', 1.5, all)).toEqual({
      error: 'invalidDays',
    });
  });

  it('countBusinessDays: 両端を含み、逆順でも数えられる', () => {
    const r = countBusinessDays('2026-05-01', '2026-05-07', all);
    expect(r).toEqual({
      calendarDays: 7,
      businessDays: 2,
      weekendDays: 2,
      holidayDays: 3,
    });
    expect(countBusinessDays('2026-05-07', '2026-05-01', all)).toEqual(r);
  });
});
