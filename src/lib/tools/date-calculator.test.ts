import { describe, expect, it } from 'vitest';
import {
  addDays,
  diffInDays,
  getWeekday,
  isValidDate,
  toWeeksAndDays,
} from './date-calculator';

describe('isValidDate', () => {
  it('実在する日付はtrue', () => {
    expect(isValidDate(2024, 2, 29)).toBe(true); // うるう年
    expect(isValidDate(2024, 1, 31)).toBe(true);
    expect(isValidDate(2000, 2, 29)).toBe(true); // 400で割り切れるうるう年
  });

  it('実在しない日付はfalse', () => {
    expect(isValidDate(2023, 2, 29)).toBe(false); // 平年
    expect(isValidDate(2024, 4, 31)).toBe(false);
    expect(isValidDate(2024, 13, 1)).toBe(false);
    expect(isValidDate(2024, 1, 0)).toBe(false);
    expect(isValidDate(1900, 2, 29)).toBe(false); // 100で割り切れるが400では割り切れない
  });

  it('非整数の値はfalse', () => {
    expect(isValidDate(2024.5, 1, 1)).toBe(false);
    expect(isValidDate(2024, 1.5, 1)).toBe(false);
    expect(isValidDate(2024, 1, 1.5)).toBe(false);
    expect(isValidDate(NaN, 1, 1)).toBe(false);
  });

  it('2桁以下の年も1900年代に丸められず正しく判定する', () => {
    expect(isValidDate(50, 1, 1)).toBe(true);
    expect(isValidDate(1, 1, 1)).toBe(true);
    expect(isValidDate(0, 1, 1)).toBe(true);
  });

  it('月が0以下、日が負の値の場合はfalse', () => {
    expect(isValidDate(2024, 0, 1)).toBe(false);
    expect(isValidDate(2024, -1, 1)).toBe(false);
    expect(isValidDate(2024, 1, -1)).toBe(false);
  });
});

describe('diffInDays', () => {
  it('終了日が開始日より後なら正の日数', () => {
    expect(
      diffInDays(
        { year: 2024, month: 1, day: 1 },
        { year: 2024, month: 1, day: 31 },
      ),
    ).toBe(30);
  });

  it('終了日が開始日より前なら負の日数', () => {
    expect(
      diffInDays(
        { year: 2024, month: 1, day: 31 },
        { year: 2024, month: 1, day: 1 },
      ),
    ).toBe(-30);
  });

  it('同じ日付なら0', () => {
    expect(
      diffInDays(
        { year: 2024, month: 1, day: 1 },
        { year: 2024, month: 1, day: 1 },
      ),
    ).toBe(0);
  });

  it('うるう年をまたぐ日数を正しく計算する', () => {
    expect(
      diffInDays(
        { year: 2024, month: 2, day: 28 },
        { year: 2024, month: 3, day: 1 },
      ),
    ).toBe(2); // 2/28→2/29→3/1
    expect(
      diffInDays(
        { year: 2023, month: 2, day: 28 },
        { year: 2023, month: 3, day: 1 },
      ),
    ).toBe(1); // 平年は2/29が無い
  });

  it('年をまたぐ日数を正しく計算する', () => {
    expect(
      diffInDays(
        { year: 2023, month: 12, day: 31 },
        { year: 2024, month: 1, day: 1 },
      ),
    ).toBe(1);
  });

  it('inclusiveがtrueなら両端を含めて数える', () => {
    expect(
      diffInDays(
        { year: 2024, month: 1, day: 1 },
        { year: 2024, month: 1, day: 31 },
        true,
      ),
    ).toBe(31);
  });

  it('inclusiveがtrueで同じ日付なら1', () => {
    expect(
      diffInDays(
        { year: 2024, month: 1, day: 1 },
        { year: 2024, month: 1, day: 1 },
        true,
      ),
    ).toBe(1);
  });

  it('inclusiveがtrueで終了日が前でも符号を保った両端算入になる', () => {
    expect(
      diffInDays(
        { year: 2024, month: 1, day: 31 },
        { year: 2024, month: 1, day: 1 },
        true,
      ),
    ).toBe(-31);
  });

  it('どちらかの日付が不正ならnull', () => {
    expect(
      diffInDays(
        { year: 2024, month: 2, day: 30 },
        { year: 2024, month: 3, day: 1 },
      ),
    ).toBeNull();
    expect(
      diffInDays(
        { year: 2024, month: 1, day: 1 },
        { year: 2024, month: 2, day: 30 },
      ),
    ).toBeNull();
  });

  it('隣り合う日付でinclusiveがtrueかつ終了日が前の場合は-2になる', () => {
    // 両端算入で隣り合う2日を数えると2日間。終了日が開始日より前なので符号は負。
    expect(
      diffInDays(
        { year: 2024, month: 1, day: 2 },
        { year: 2024, month: 1, day: 1 },
        true,
      ),
    ).toBe(-2);
  });

  it('入力可能範囲の両端（西暦0001年〜9999年）でも正しく計算できる', () => {
    // 独立実装（Howard HinnantのdayFromCivilアルゴリズム）で事前検証した値
    expect(
      diffInDays(
        { year: 1, month: 1, day: 1 },
        { year: 9999, month: 12, day: 31 },
      ),
    ).toBe(3652058);
  });
});

describe('addDays', () => {
  it('日数を加算して月末をまたぐ日付を計算する', () => {
    expect(addDays({ year: 2024, month: 1, day: 31 }, 1)).toEqual({
      year: 2024,
      month: 2,
      day: 1,
    });
  });

  it('日数を加算して年末をまたぐ日付を計算する', () => {
    expect(addDays({ year: 2023, month: 12, day: 31 }, 1)).toEqual({
      year: 2024,
      month: 1,
      day: 1,
    });
  });

  it('負の日数を渡すと過去の日付を計算する', () => {
    expect(addDays({ year: 2024, month: 1, day: 1 }, -1)).toEqual({
      year: 2023,
      month: 12,
      day: 31,
    });
  });

  it('うるう年の2/29をまたぐ加算ができる', () => {
    expect(addDays({ year: 2024, month: 2, day: 28 }, 1)).toEqual({
      year: 2024,
      month: 2,
      day: 29,
    });
    expect(addDays({ year: 2023, month: 2, day: 28 }, 1)).toEqual({
      year: 2023,
      month: 3,
      day: 1,
    });
  });

  it('0日を加算すると同じ日付になる', () => {
    expect(addDays({ year: 2024, month: 6, day: 15 }, 0)).toEqual({
      year: 2024,
      month: 6,
      day: 15,
    });
  });

  it('基準日が不正ならnull', () => {
    expect(addDays({ year: 2024, month: 2, day: 30 }, 1)).toBeNull();
  });

  it('日数が非整数ならnull', () => {
    expect(addDays({ year: 2024, month: 1, day: 1 }, 1.5)).toBeNull();
  });

  it('Dateの表現範囲を超える巨大な日数はnull（NaNを返さない）', () => {
    expect(addDays({ year: 2024, month: 1, day: 1 }, 1e11)).toBeNull();
    expect(addDays({ year: 2024, month: 1, day: 1 }, -1e11)).toBeNull();
  });

  it('100で割り切れるが400で割り切れない年（世紀年）はうるう年として扱われない', () => {
    expect(addDays({ year: 1900, month: 2, day: 28 }, 1)).toEqual({
      year: 1900,
      month: 3,
      day: 1,
    });
  });

  it('400で割り切れる世紀年はうるう年として扱われる', () => {
    expect(addDays({ year: 2000, month: 2, day: 28 }, 1)).toEqual({
      year: 2000,
      month: 2,
      day: 29,
    });
  });
});

describe('getWeekday', () => {
  it('既知の日付の曜日を正しく返す', () => {
    expect(getWeekday(2024, 1, 1)).toBe(1); // 2024/1/1は月曜日
    expect(getWeekday(2024, 1, 7)).toBe(0); // 日曜日
    expect(getWeekday(2024, 1, 6)).toBe(6); // 土曜日
  });

  it('不正な日付はnull', () => {
    expect(getWeekday(2024, 2, 30)).toBeNull();
  });

  it('入力可能範囲の両端（西暦0001年〜9999年）でも正しい曜日を返す', () => {
    // 独立実装（Sakamotoのアルゴリズム）で事前検証した値
    expect(getWeekday(1, 1, 1)).toBe(1); // 月曜日
    expect(getWeekday(9999, 12, 31)).toBe(5); // 金曜日
  });
});

describe('toWeeksAndDays', () => {
  it('正の日数を週と余りに分解する', () => {
    expect(toWeeksAndDays(10)).toEqual({ weeks: 1, remainderDays: 3 });
    expect(toWeeksAndDays(7)).toEqual({ weeks: 1, remainderDays: 0 });
    expect(toWeeksAndDays(0)).toEqual({ weeks: 0, remainderDays: 0 });
  });

  it('負の日数は符号を保ったまま分解する', () => {
    expect(toWeeksAndDays(-10)).toEqual({ weeks: -1, remainderDays: -3 });
  });
});
