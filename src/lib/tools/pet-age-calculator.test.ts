import { describe, expect, it } from 'vitest';
import {
  buildConversionTable,
  convertPetAge,
  petYearsToHumanAge,
} from './pet-age-calculator';

describe('petYearsToHumanAge', () => {
  it('1歳は15歳、2歳は24歳', () => {
    expect(petYearsToHumanAge(1, 'cat')).toBe(15);
    expect(petYearsToHumanAge(2, 'large')).toBe(24);
  });
  it('2歳以降は区分ごとの増分', () => {
    expect(petYearsToHumanAge(10, 'cat')).toBe(56);
    expect(petYearsToHumanAge(10, 'small')).toBe(56);
    expect(petYearsToHumanAge(10, 'medium')).toBe(64);
    expect(petYearsToHumanAge(10, 'large')).toBe(72);
  });
  it('1歳未満は線形補間', () => {
    expect(petYearsToHumanAge(0.5, 'cat')).toBe(7.5);
    expect(petYearsToHumanAge(0, 'cat')).toBe(0);
  });
  it('負数・非有限はnull', () => {
    expect(petYearsToHumanAge(-1, 'cat')).toBeNull();
    expect(petYearsToHumanAge(NaN, 'cat')).toBeNull();
  });
});

describe('convertPetAge', () => {
  it('猫3歳 = 28歳', () => {
    const r = convertPetAge({ species: 'cat', years: 3, months: 0 })!;
    expect(r.humanAge).toBe(28);
    expect(r.humanYears).toBe(28);
    expect(r.humanMonths).toBe(0);
    expect(r.totalMonths).toBe(36);
  });
  it('猫1歳6ヶ月は年と月に分けられる', () => {
    const r = convertPetAge({ species: 'cat', years: 1, months: 6 })!;
    expect(r.humanAge).toBe(19.5);
    expect(r.humanYears).toBe(19);
    expect(r.humanMonths).toBe(6);
  });
  it('犬は体格で差が出て、未指定は中型犬', () => {
    const base = { species: 'dog' as const, years: 8, months: 0 };
    expect(convertPetAge({ ...base, size: 'small' })!.humanAge).toBe(48);
    expect(convertPetAge({ ...base, size: 'large' })!.humanAge).toBe(60);
    expect(convertPetAge(base)!.humanAge).toBe(54);
  });
  it('猫ではsizeが無視される', () => {
    expect(
      convertPetAge({ species: 'cat', size: 'large', years: 6, months: 0 })!
        .humanAge,
    ).toBe(40);
  });
  it('0歳0ヶ月は0', () => {
    expect(
      convertPetAge({ species: 'cat', years: 0, months: 0 })!.humanAge,
    ).toBe(0);
  });
  it('不正な入力はnull', () => {
    expect(convertPetAge({ species: 'cat', years: -1, months: 0 })).toBeNull();
    expect(convertPetAge({ species: 'cat', years: 1, months: 12 })).toBeNull();
    expect(convertPetAge({ species: 'cat', years: 1.5, months: 0 })).toBeNull();
    expect(convertPetAge({ species: 'cat', years: 41, months: 0 })).toBeNull();
    expect(convertPetAge({ species: 'cat', years: 40, months: 1 })).toBeNull();
    expect(convertPetAge({ species: 'cat', years: NaN, months: 0 })).toBeNull();
  });
});

describe('buildConversionTable', () => {
  it('指定年数ぶんの行を返す', () => {
    const rows = buildConversionTable(5);
    expect(rows).toHaveLength(5);
    expect(rows[0]).toEqual({
      petYears: 1,
      cat: 15,
      small: 15,
      medium: 15,
      large: 15,
    });
    expect(rows[4]).toEqual({
      petYears: 5,
      cat: 36,
      small: 36,
      medium: 39,
      large: 42,
    });
  });
});

describe('convertPetAge 境界値', () => {
  it('上限40歳0ヶ月は有効（大型犬は252歳）', () => {
    const r = convertPetAge({
      species: 'dog',
      size: 'large',
      years: 40,
      months: 0,
    });
    expect(r).not.toBeNull();
    expect(r!.humanAge).toBe(252);
  });

  it('11ヶ月は有効、非有限の年数はnull', () => {
    expect(
      convertPetAge({ species: 'cat', years: 0, months: 11 }),
    ).not.toBeNull();
    expect(
      convertPetAge({ species: 'cat', years: Infinity, months: 0 }),
    ).toBeNull();
    expect(convertPetAge({ species: 'cat', years: 0, months: -1 })).toBeNull();
  });

  it('0歳1ヶ月は年・月に分けて表示される（15ヶ月相当の1年3ヶ月）', () => {
    const r = convertPetAge({ species: 'cat', years: 0, months: 1 })!;
    expect(r.humanYears).toBe(1);
    expect(r.humanMonths).toBe(3);
  });
});
