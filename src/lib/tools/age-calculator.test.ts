import { describe, expect, it } from 'vitest';
import {
  calculateDaysLived,
  calculateFullAge,
  calculateKazoedoshi,
  calculateNextBirthday,
  calculatePreciseAge,
} from './age-calculator';

describe('calculateFullAge', () => {
  it('誕生日を迎えていれば年齢が上がる', () => {
    expect(
      calculateFullAge(
        { year: 2000, month: 6, day: 15 },
        { year: 2024, month: 6, day: 15 },
      ),
    ).toBe(24);
  });

  it('誕生日前日はまだ年齢が上がらない', () => {
    expect(
      calculateFullAge(
        { year: 2000, month: 6, day: 15 },
        { year: 2024, month: 6, day: 14 },
      ),
    ).toBe(23);
  });

  it('誕生日翌日は年齢が上がっている', () => {
    expect(
      calculateFullAge(
        { year: 2000, month: 6, day: 15 },
        { year: 2024, month: 6, day: 16 },
      ),
    ).toBe(24);
  });

  it('生まれた当日は0歳', () => {
    expect(
      calculateFullAge(
        { year: 2024, month: 6, day: 15 },
        { year: 2024, month: 6, day: 15 },
      ),
    ).toBe(0);
  });

  it('基準日が生年月日より前ならnull', () => {
    expect(
      calculateFullAge(
        { year: 2024, month: 6, day: 15 },
        { year: 2024, month: 6, day: 14 },
      ),
    ).toBeNull();
  });

  it('不正な日付ならnull', () => {
    expect(
      calculateFullAge(
        { year: 2000, month: 2, day: 30 },
        { year: 2024, month: 6, day: 15 },
      ),
    ).toBeNull();
  });

  it('うるう年の2/29生まれでも計算できる', () => {
    expect(
      calculateFullAge(
        { year: 2000, month: 2, day: 29 },
        { year: 2024, month: 2, day: 29 },
      ),
    ).toBe(24);
    expect(
      calculateFullAge(
        { year: 2000, month: 2, day: 29 },
        { year: 2023, month: 3, day: 1 },
      ),
    ).toBe(23);
  });

  it('うるう年の2/29生まれは、非うるう年では2/28時点で加齢済みとして扱う', () => {
    expect(
      calculateFullAge(
        { year: 2000, month: 2, day: 29 },
        { year: 2025, month: 2, day: 28 },
      ),
    ).toBe(25);
    expect(
      calculateFullAge(
        { year: 2000, month: 2, day: 29 },
        { year: 2025, month: 2, day: 27 },
      ),
    ).toBe(24);
  });
});

describe('calculatePreciseAge', () => {
  it('年・月・日を正しく分解する', () => {
    expect(
      calculatePreciseAge(
        { year: 2000, month: 6, day: 15 },
        { year: 2024, month: 9, day: 20 },
      ),
    ).toEqual({ years: 24, months: 3, days: 5 });
  });

  it('誕生日当日はちょうど◯歳0ヶ月0日', () => {
    expect(
      calculatePreciseAge(
        { year: 2000, month: 6, day: 15 },
        { year: 2024, month: 6, day: 15 },
      ),
    ).toEqual({ years: 24, months: 0, days: 0 });
  });

  it('月末生まれで月末が短い月をまたいでも正しく計算する', () => {
    // 1/31生まれ→3/1基準日: 1歳(誕生日基準ではなく年単位)ではなく年数0、
    // 1/31→2/28(2月は28日までしかない)で1ヶ月、2/28→3/1で1日
    expect(
      calculatePreciseAge(
        { year: 2023, month: 1, day: 31 },
        { year: 2023, month: 3, day: 1 },
      ),
    ).toEqual({ years: 0, months: 1, days: 1 });
  });

  it('基準日が生年月日より前ならnull', () => {
    expect(
      calculatePreciseAge(
        { year: 2024, month: 6, day: 15 },
        { year: 2024, month: 6, day: 14 },
      ),
    ).toBeNull();
  });

  it('うるう年の2/29生まれは、非うるう年の2/28時点で◯歳0ヶ月0日になる', () => {
    expect(
      calculatePreciseAge(
        { year: 2000, month: 2, day: 29 },
        { year: 2025, month: 2, day: 28 },
      ),
    ).toEqual({ years: 25, months: 0, days: 0 });
  });
});

describe('calculateKazoedoshi', () => {
  it('誕生日前でも暦年の差+1になる', () => {
    expect(
      calculateKazoedoshi(
        { year: 2000, month: 12, day: 31 },
        { year: 2001, month: 1, day: 1 },
      ),
    ).toBe(2);
  });

  it('生まれた年は1', () => {
    expect(
      calculateKazoedoshi(
        { year: 2024, month: 6, day: 15 },
        { year: 2024, month: 6, day: 15 },
      ),
    ).toBe(1);
  });

  it('基準日が生年月日より前ならnull', () => {
    expect(
      calculateKazoedoshi(
        { year: 2024, month: 6, day: 15 },
        { year: 2024, month: 6, day: 14 },
      ),
    ).toBeNull();
  });
});

describe('calculateDaysLived', () => {
  it('生まれた当日は1日目', () => {
    expect(
      calculateDaysLived(
        { year: 2024, month: 6, day: 15 },
        { year: 2024, month: 6, day: 15 },
      ),
    ).toBe(1);
  });

  it('経過日数を正しく計算する', () => {
    expect(
      calculateDaysLived(
        { year: 2024, month: 1, day: 1 },
        { year: 2024, month: 1, day: 31 },
      ),
    ).toBe(31);
  });

  it('基準日が生年月日より前ならnull', () => {
    expect(
      calculateDaysLived(
        { year: 2024, month: 6, day: 15 },
        { year: 2024, month: 6, day: 14 },
      ),
    ).toBeNull();
  });
});

describe('calculateNextBirthday', () => {
  it('誕生日前なら今年の誕生日までの日数を返す', () => {
    const result = calculateNextBirthday(
      { year: 2000, month: 12, day: 25 },
      { year: 2024, month: 12, day: 1 },
    );
    expect(result).toEqual({
      date: { year: 2024, month: 12, day: 25 },
      daysUntil: 24,
      ageAtNextBirthday: 24,
    });
  });

  it('誕生日を過ぎていたら来年の誕生日までの日数を返す', () => {
    const result = calculateNextBirthday(
      { year: 2000, month: 1, day: 1 },
      { year: 2024, month: 12, day: 1 },
    );
    expect(result).toEqual({
      date: { year: 2025, month: 1, day: 1 },
      daysUntil: 31,
      ageAtNextBirthday: 25,
    });
  });

  it('基準日当日が誕生日ならdaysUntilは0', () => {
    const result = calculateNextBirthday(
      { year: 2000, month: 6, day: 15 },
      { year: 2024, month: 6, day: 15 },
    );
    expect(result).toEqual({
      date: { year: 2024, month: 6, day: 15 },
      daysUntil: 0,
      ageAtNextBirthday: 24,
    });
  });

  it('うるう年の2/29生まれは非うるう年では2/28が誕生日扱いになる', () => {
    const result = calculateNextBirthday(
      { year: 2000, month: 2, day: 29 },
      { year: 2023, month: 3, day: 1 },
    );
    expect(result).toEqual({
      date: { year: 2024, month: 2, day: 29 },
      daysUntil: 365,
      ageAtNextBirthday: 24,
    });
  });

  it('基準日が生年月日より前ならnull', () => {
    expect(
      calculateNextBirthday(
        { year: 2024, month: 6, day: 15 },
        { year: 2024, month: 6, day: 14 },
      ),
    ).toBeNull();
  });

  it('うるう年の2/29生まれは、非うるう年の2/28当日が誕生日として一致する（年齢の整合性）', () => {
    const result = calculateNextBirthday(
      { year: 2000, month: 2, day: 29 },
      { year: 2025, month: 2, day: 28 },
    );
    expect(result).toEqual({
      date: { year: 2025, month: 2, day: 28 },
      daysUntil: 0,
      ageAtNextBirthday: 25,
    });
  });
});
