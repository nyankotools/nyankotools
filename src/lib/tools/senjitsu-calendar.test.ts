import { describe, expect, it } from 'vitest';
import {
  dayCycle,
  findRecommended,
  getSenjitsuDay,
  getSenjitsuMonth,
  getSenjitsuYear,
  isFujojuDay,
  mansionOf,
  matchOccasion,
} from './senjitsu-calendar';

const tagsOf = (y: number, m: number, d: number) =>
  getSenjitsuDay(y, m, d)!.tags;

describe('日の干支', () => {
  it('2000-01-01 は戊午（54）、2024-01-01 は甲子（0）', () => {
    expect(dayCycle(2000, 1, 1)).toBe(54);
    expect(dayCycle(2024, 1, 1)).toBe(0);
    expect(dayCycle(2024, 1, 6)).toBe(5); // 己巳
  });
  it('十干・十二支に分解される', () => {
    const d = getSenjitsuDay(2024, 3, 15)!; // 戊寅
    expect(d.stem).toBe(4);
    expect(d.branch).toBe(2);
  });
});

describe('天赦日', () => {
  const tensha = (year: number) =>
    getSenjitsuYear(year)!
      .filter((d) => d.tags.includes('tensha'))
      .map((d) => d.iso);

  it('2024年: 元日（甲子）・3/15・5/30・8/12 が天赦日', () => {
    const list = tensha(2024);
    expect(list).toContain('2024-01-01');
    expect(list).toContain('2024-03-15');
    expect(list).toContain('2024-05-30');
    expect(list).toContain('2024-08-12');
  });
  it('2026年: 3/5・5/4・5/20・7/19・10/1・12/16', () => {
    expect(tensha(2026)).toEqual([
      '2026-03-05',
      '2026-05-04',
      '2026-05-20',
      '2026-07-19',
      '2026-10-01',
      '2026-12-16',
    ]);
  });
  it('季節が合わない戊寅・甲子は天赦日にならない', () => {
    // 2026-01-04 は戊寅だが小寒前の冬（子月）
    expect(tagsOf(2026, 1, 4)).not.toContain('tensha');
    // 2026-08-02 は戊申だが立秋前の夏
    expect(tagsOf(2026, 8, 2)).not.toContain('tensha');
  });
  it('どの年も年に4〜7回ある', () => {
    for (const y of [1900, 1999, 2025, 2033, 2100]) {
      const n = tensha(y).length;
      expect(n).toBeGreaterThanOrEqual(4);
      expect(n).toBeLessThanOrEqual(7);
    }
  });
});

describe('一粒万倍日（節月と日の十二支）', () => {
  it('2026-03-05（啓蟄入り・戊寅）は卯月の寅の日なので一粒万倍日', () => {
    const d = getSenjitsuDay(2026, 3, 5)!;
    expect(d.sekkiMonth).toBe(2);
    expect(d.tags).toContain('ichiryumanbai');
  });
  it('節入り日の前日までは前の月の規則を使う', () => {
    expect(getSenjitsuDay(2026, 2, 3)!.sekkiMonth).toBe(12);
    expect(getSenjitsuDay(2026, 2, 4)!.sekkiMonth).toBe(1); // 立春
    expect(getSenjitsuDay(2026, 1, 1)!.sekkiMonth).toBe(11);
    expect(getSenjitsuDay(2026, 1, 5)!.sekkiMonth).toBe(12); // 小寒
    expect(getSenjitsuDay(2026, 12, 31)!.sekkiMonth).toBe(11);
  });
  it('2024-01-01（子月の子の日）は天赦日かつ一粒万倍日', () => {
    expect(tagsOf(2024, 1, 1)).toEqual(
      expect.arrayContaining(['tensha', 'ichiryumanbai']),
    );
  });
  it('毎月だいたい4〜6日ある', () => {
    for (let m = 1; m <= 12; m++) {
      const n = getSenjitsuMonth(2026, m)!.filter((d) =>
        d.tags.includes('ichiryumanbai'),
      ).length;
      expect(n).toBeGreaterThanOrEqual(3);
      expect(n).toBeLessThanOrEqual(7);
    }
  });
});

describe('寅の日・巳の日・己巳の日', () => {
  it('12日ごとに寅の日・巳の日が来る', () => {
    const days = getSenjitsuYear(2026)!;
    const tora = days.filter((d) => d.tags.includes('tora'));
    expect(tora.length).toBeGreaterThanOrEqual(30);
    expect(tora.every((d) => d.branch === 2)).toBe(true);
    expect(
      days.filter((d) => d.tags.includes('mi')).every((d) => d.branch === 5),
    ).toBe(true);
  });
  it('己巳の日は巳の日でもあり、60日おき', () => {
    const d = getSenjitsuDay(2024, 1, 6)!;
    expect(d.tags).toEqual(expect.arrayContaining(['mi', 'tsuchinotomi']));
    expect(tagsOf(2024, 3, 6)).toContain('tsuchinotomi');
  });
});

describe('不成就日・二十八宿', () => {
  it('旧暦1月1日（2024-02-10）から数えて3日目（2/12）が不成就日', () => {
    expect(getSenjitsuDay(2024, 2, 10)!.lunar).toMatchObject({
      month: 1,
      day: 1,
    });
    expect(tagsOf(2024, 2, 12)).toContain('fujoju');
    expect(tagsOf(2024, 2, 11)).not.toContain('fujoju');
  });
  it('旧暦の月ごとの日の表', () => {
    expect(isFujojuDay(1, 27)).toBe(true);
    expect(isFujojuDay(7, 27)).toBe(true);
    expect(isFujojuDay(6, 22)).toBe(true);
    expect(isFujojuDay(12, 14)).toBe(true);
    expect(isFujojuDay(4, 25)).toBe(false);
    expect(isFujojuDay(10, 24)).toBe(true);
  });
  it('二十八宿は旧暦1日の宿から順に進む', () => {
    expect(mansionOf(1, 1)).toBe(12); // 室
    expect(mansionOf(6, 1)).toBe(22); // 鬼
    expect(mansionOf(6, 2)).toBe(23);
    expect(mansionOf(7, 1)).toBe(25);
    expect(mansionOf(12, 30)).toBe((10 + 29) % 28);
  });
  it('旧暦6月1日は鬼宿日', () => {
    const d = getSenjitsuYear(2024)!.find(
      (x) => x.lunar.month === 6 && x.lunar.day === 1 && !x.lunar.leap,
    )!;
    expect(d.tags).toContain('kishuku');
  });
});

describe('用途別の吉日', () => {
  it('結婚: 仏滅・不成就日・寅の日は避け、天赦日は凶日を打ち消す', () => {
    const days = getSenjitsuYear(2026)!;
    const wedding = findRecommended(days, 'wedding');
    expect(wedding.length).toBeGreaterThan(20);
    for (const { day, match } of wedding) {
      if (!day.tags.includes('tensha')) {
        expect(day.lunar.rokuyo).not.toBe('butsumetsu');
        expect(day.tags).not.toContain('fujoju');
        expect(day.tags).not.toContain('tora');
      }
      expect(match.good.length).toBeGreaterThan(0);
    }
    const tensha = getSenjitsuDay(2026, 3, 5)!; // 戊寅（寅の日）でも天赦日
    expect(matchOccasion(tensha, 'wedding').recommended).toBe(true);
  });
  it('財布: 寅の日・巳の日・一粒万倍日が吉日、不成就日は除く', () => {
    const days = getSenjitsuYear(2026)!;
    const list = findRecommended(days, 'wallet');
    expect(list.every((r) => r.match.avoid.length === 0)).toBe(true);
    const tora = days.find(
      (d) => d.tags.includes('tora') && !d.tags.includes('fujoju'),
    )!;
    expect(matchOccasion(tora, 'wallet').recommended).toBe(true);
    const plain = days.find((d) => d.tags.length === 0)!;
    expect(matchOccasion(plain, 'wallet').recommended).toBe(false);
  });
});

describe('範囲と入力検証', () => {
  it('範囲外の年・月・日は null', () => {
    expect(getSenjitsuYear(1899)).toBeNull();
    expect(getSenjitsuYear(2101)).toBeNull();
    expect(getSenjitsuYear(2024.5)).toBeNull();
    expect(getSenjitsuMonth(2024, 0)).toBeNull();
    expect(getSenjitsuMonth(2024, 13)).toBeNull();
    expect(getSenjitsuDay(2023, 2, 29)).toBeNull();
    expect(getSenjitsuDay(2024, 2, 29)).not.toBeNull();
  });
  it('月の日数が正しく、年の端（1900・2100）も計算できる', () => {
    expect(getSenjitsuMonth(2024, 2)).toHaveLength(29);
    expect(getSenjitsuMonth(2023, 2)).toHaveLength(28);
    expect(getSenjitsuYear(1900)).toHaveLength(365);
    expect(getSenjitsuYear(2100)).toHaveLength(365);
    expect(getSenjitsuMonth(1900, 1)![0].iso).toBe('1900-01-01');
  });
  it('曜日が正しい（2024-01-01 は月曜）', () => {
    expect(getSenjitsuDay(2024, 1, 1)!.dow).toBe(1);
  });
});
