import { describe, it, expect } from 'vitest';
import {
  getLunarDate,
  getLunarNewYear,
  getRokuyoMonth,
  getSolarTerm,
  groupByRokuyo,
  isValidYear,
  MAX_YEAR,
  MIN_YEAR,
} from './rokuyo-calendar';

describe('getLunarDate', () => {
  it('既知の日付の旧暦と六曜', () => {
    expect(getLunarDate(2000, 1, 1)).toEqual({
      month: 11,
      leap: false,
      day: 25,
      rokuyo: 'taian',
    });
    expect(getLunarDate(2024, 1, 1)).toEqual({
      month: 11,
      leap: false,
      day: 20,
      rokuyo: 'shakko',
    });
  });
  it('旧暦1月1日は先勝', () => {
    expect(getLunarDate(2024, 2, 10)).toMatchObject({
      month: 1,
      day: 1,
      rokuyo: 'sensho',
    });
    expect(getLunarDate(2025, 1, 29)).toMatchObject({
      month: 1,
      day: 1,
      rokuyo: 'sensho',
    });
    expect(getLunarDate(2025, 1, 28)).toMatchObject({ month: 12, day: 29 });
  });
  it('閏月を判定する', () => {
    expect(getLunarDate(2023, 3, 22)).toMatchObject({
      month: 2,
      leap: true,
      day: 1,
    });
    expect(getLunarDate(2023, 3, 21)).toMatchObject({
      month: 2,
      leap: false,
      day: 30,
    });
    expect(getLunarDate(2020, 5, 23)).toMatchObject({
      month: 4,
      leap: true,
      day: 1,
    });
    expect(getLunarDate(2025, 7, 25)).toMatchObject({
      month: 6,
      leap: true,
      day: 1,
    });
  });
  it('閏月の六曜は同番号の月と同じ並び', () => {
    // 閏6月1日 = (6+1)%6 = 1 → 赤口
    expect(getLunarDate(2025, 7, 25)?.rokuyo).toBe('shakko');
  });
  it('範囲外・不正な日付は null', () => {
    expect(getLunarDate(1899, 12, 31)).toBeNull();
    expect(getLunarDate(2101, 1, 1)).toBeNull();
    expect(getLunarDate(2023, 2, 29)).toBeNull();
    expect(getLunarDate(2023, 13, 1)).toBeNull();
    expect(getLunarDate(2023.5, 1, 1)).toBeNull();
  });
});

describe('旧暦の連続性（1900〜2100年）', () => {
  it('全日付で旧暦が求まり、日が連続し、月番号は+1か同じ値で進む', () => {
    let prev: { month: number; leap: boolean; day: number } | null = null;
    for (let y = MIN_YEAR; y <= MAX_YEAR; y++) {
      for (let m = 1; m <= 12; m++) {
        const days = getRokuyoMonth(y, m);
        expect(days, `${y}-${m}`).not.toBeNull();
        for (const d of days!) {
          const l = d.lunar;
          expect(l.day).toBeGreaterThanOrEqual(1);
          expect(l.day).toBeLessThanOrEqual(30);
          if (prev) {
            if (l.day === 1) {
              const step = (l.month - prev.month + 12) % 12;
              const ok = step === 1 || (step === 0 && l.leap && !prev.leap);
              expect(ok, `${y}-${m}-${d.day}`).toBe(true);
              expect(prev.day).toBeGreaterThanOrEqual(29);
            } else {
              expect(l.day).toBe(prev.day + 1);
            }
          }
          prev = l;
        }
      }
    }
  });
  it('各年に旧正月があり、1/21〜2/20に収まる', () => {
    for (let y = MIN_YEAR; y <= MAX_YEAR; y++) {
      const d = getLunarNewYear(y);
      expect(d, String(y)).not.toBeNull();
      expect(d! >= `${y}-01-20` && d! <= `${y}-02-21`, `${y} ${d}`).toBe(true);
    }
  });
});

describe('閏月の位置', () => {
  it('既知の閏月（2033年は閏11月）', () => {
    const known: [number, number, number, number][] = [
      [1984, 11, 23, 10],
      [1976, 9, 24, 8],
      [2004, 3, 21, 2],
      [2012, 4, 21, 3],
      [2014, 10, 24, 9],
      [2017, 6, 24, 5],
      [2033, 12, 22, 11],
    ];
    for (const [y, m, d, lm] of known) {
      expect(getLunarDate(y, m, d), `${y}-${m}-${d}`).toMatchObject({
        month: lm,
        leap: true,
        day: 1,
      });
    }
  });
});

describe('getLunarNewYear', () => {
  it('既知の旧正月', () => {
    expect(getLunarNewYear(2020)).toBe('2020-01-25');
    expect(getLunarNewYear(2024)).toBe('2024-02-10');
    expect(getLunarNewYear(2025)).toBe('2025-01-29');
    expect(getLunarNewYear(2026)).toBe('2026-02-17');
  });
});

describe('getSolarTerm', () => {
  it('二十四節気の日', () => {
    expect(getSolarTerm(2024, 3, 20)).toBe('shunbun');
    expect(getSolarTerm(2024, 2, 4)).toBe('risshun');
    expect(getSolarTerm(2024, 12, 21)).toBe('touji');
    expect(getSolarTerm(2024, 6, 21)).toBe('geshi');
    expect(getSolarTerm(2024, 9, 22)).toBe('shuubun');
    expect(getSolarTerm(2024, 3, 19)).toBeNull();
  });
  it('年に24個ある', () => {
    let n = 0;
    for (let m = 1; m <= 12; m++) {
      for (const d of getRokuyoMonth(2025, m)!) if (d.term) n++;
    }
    expect(n).toBe(24);
  });
});

describe('getRokuyoMonth / groupByRokuyo', () => {
  it('月の日数ぶん返す', () => {
    expect(getRokuyoMonth(2024, 2)).toHaveLength(29);
    expect(getRokuyoMonth(2023, 2)).toHaveLength(28);
    expect(getRokuyoMonth(2024, 12)).toHaveLength(31);
  });
  it('範囲外は null', () => {
    expect(getRokuyoMonth(1800, 1)).toBeNull();
    expect(getRokuyoMonth(2024, 0)).toBeNull();
  });
  it('六曜ごとに全日が振り分けられる', () => {
    const days = getRokuyoMonth(2024, 10)!;
    const g = groupByRokuyo(days);
    const total = Object.values(g).reduce((s, a) => s + a.length, 0);
    expect(total).toBe(31);
  });
});

describe('isValidYear', () => {
  it('範囲', () => {
    expect(isValidYear(1900)).toBe(true);
    expect(isValidYear(2100)).toBe(true);
    expect(isValidYear(2101)).toBe(false);
    expect(isValidYear(2000.5)).toBe(false);
  });
});
