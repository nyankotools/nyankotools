import { describe, expect, it } from 'vitest';
import {
  getBirthdayInfo,
  getSexagenaryIndex,
  getZodiacIndex,
} from './birthday-info';

describe('getSexagenaryIndex', () => {
  it('西暦4年・1984年は甲子（0）', () => {
    expect(getSexagenaryIndex(4)).toBe(0);
    expect(getSexagenaryIndex(1984)).toBe(0);
  });
  it('2000年は庚辰（16）', () => {
    expect(getSexagenaryIndex(2000)).toBe(16);
    expect(getSexagenaryIndex(2000) % 10).toBe(6); // 庚
    expect(getSexagenaryIndex(2000) % 12).toBe(4); // 辰
  });
  it('4年未満でも0〜59に収まる', () => {
    expect(getSexagenaryIndex(1)).toBe(57);
    expect(getSexagenaryIndex(3)).toBe(59);
  });
});

describe('getZodiacIndex', () => {
  it('境界日の判定', () => {
    expect(getZodiacIndex(3, 20)).toBe(11); // 魚座
    expect(getZodiacIndex(3, 21)).toBe(0); // 牡羊座
    expect(getZodiacIndex(12, 21)).toBe(8); // 射手座
    expect(getZodiacIndex(12, 22)).toBe(9); // 山羊座
    expect(getZodiacIndex(1, 1)).toBe(9); // 山羊座
    expect(getZodiacIndex(1, 19)).toBe(9);
    expect(getZodiacIndex(1, 20)).toBe(10); // 水瓶座
    expect(getZodiacIndex(2, 18)).toBe(10);
    expect(getZodiacIndex(2, 19)).toBe(11);
    expect(getZodiacIndex(12, 31)).toBe(9);
  });
  it('2/29 は魚座', () => {
    expect(getZodiacIndex(2, 29)).toBe(11);
  });
});

describe('getBirthdayInfo', () => {
  const ref = { year: 2026, month: 10, day: 13 };

  it('2000-01-01 の各項目', () => {
    const info = getBirthdayInfo({ year: 2000, month: 1, day: 1 }, ref)!;
    expect(info.branchIndex).toBe(4); // 辰
    expect(info.stemIndex).toBe(6); // 庚
    expect(info.zodiacIndex).toBe(9);
    expect(info.monthIndex).toBe(0);
    expect(info.weekday).toBe(6); // 土曜
    expect(info.fullAge).toBe(26);
  });

  it('年男・年女の判定と次の干支年', () => {
    const horse = getBirthdayInfo({ year: 1990, month: 5, day: 5 }, ref)!;
    // 2026年は午年、1990年も午年
    expect(horse.isEtoYear).toBe(true);
    expect(horse.nextEtoYear).toBe(2038);
    expect(horse.ageInNextEtoYear).toBe(48);

    const other = getBirthdayInfo({ year: 2000, month: 1, day: 1 }, ref)!;
    expect(other.isEtoYear).toBe(false);
    expect(other.nextEtoYear).toBe(2036);
    expect(other.ageInNextEtoYear).toBe(36);
  });

  it('基準日が生年月日より前なら満年齢は null で他は計算される', () => {
    const info = getBirthdayInfo({ year: 2030, month: 3, day: 1 }, ref)!;
    expect(info.fullAge).toBeNull();
    expect(info.isEtoYear).toBe(false);
    expect(info.nextEtoYear).toBeGreaterThan(2030);
  });

  it('うるう日を扱える', () => {
    const info = getBirthdayInfo({ year: 2000, month: 2, day: 29 }, ref)!;
    expect(info.zodiacIndex).toBe(11);
    expect(info.weekday).toBe(2); // 火曜
  });

  it('存在しない日付は null', () => {
    expect(getBirthdayInfo({ year: 2001, month: 2, day: 29 }, ref)).toBeNull();
    expect(getBirthdayInfo({ year: 2000, month: 13, day: 1 }, ref)).toBeNull();
    expect(
      getBirthdayInfo({ year: 2000, month: 1, day: 1 }, { ...ref, day: 40 }),
    ).toBeNull();
  });
});

describe('getBirthdayInfo の境界', () => {
  it('西暦1年1月1日は辛酉（十二支: 酉）', () => {
    const info = getBirthdayInfo(
      { year: 1, month: 1, day: 1 },
      {
        year: 2026,
        month: 10,
        day: 13,
      },
    )!;
    expect(info.sexagenaryIndex).toBe(57);
    expect(info.branchIndex).toBe(9);
    expect(info.stemIndex).toBe(7);
    expect(info.fullAge).toBe(2025);
  });

  it('同じ日（当日生まれ）は満年齢0', () => {
    const info = getBirthdayInfo(
      { year: 2026, month: 10, day: 13 },
      {
        year: 2026,
        month: 10,
        day: 13,
      },
    )!;
    expect(info.fullAge).toBe(0);
    expect(info.isEtoYear).toBe(true);
  });
});
