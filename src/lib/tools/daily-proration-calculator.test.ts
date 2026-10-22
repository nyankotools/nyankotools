import { describe, expect, it } from 'vitest';
import {
  calculateProration,
  daysInMonth,
  isLeapYear,
  type ProrationInput,
} from './daily-proration-calculator';

function run(input: Partial<ProrationInput> & Pick<ProrationInput, 'period'>) {
  return calculateProration({
    amount: 100000,
    basis: 'calendar',
    rounding: 'floor',
    ...input,
  });
}

describe('isLeapYear / daysInMonth', () => {
  it('うるう年を判定する', () => {
    expect(isLeapYear(2024)).toBe(true);
    expect(isLeapYear(2023)).toBe(false);
    expect(isLeapYear(1900)).toBe(false);
    expect(isLeapYear(2000)).toBe(true);
  });
  it('月の日数を返す', () => {
    expect(daysInMonth(2024, 2)).toBe(29);
    expect(daysInMonth(2023, 2)).toBe(28);
    expect(daysInMonth(2024, 4)).toBe(30);
    expect(daysInMonth(2024, 12)).toBe(31);
  });
});

describe('日数を直接入力', () => {
  it('その月の暦日数で割る（31日の月）', () => {
    const r = run({ period: { kind: 'days', days: 10, month: '2024-01' } });
    expect(r.ok && r.result.rawAmount).toBeCloseTo(32258.0645, 3);
    expect(r.ok && r.result.amount).toBe(32258);
  });

  it('うるう年の2月は29日で割る', () => {
    const period = { kind: 'days', days: 10, month: '2024-02' } as const;
    const floor = run({ period, rounding: 'floor' });
    const round = run({ period, rounding: 'round' });
    const ceil = run({ period, rounding: 'ceil' });
    expect(floor.ok && floor.result.amount).toBe(34482);
    expect(round.ok && round.result.amount).toBe(34483);
    expect(ceil.ok && ceil.result.amount).toBe(34483);
    expect(floor.ok && floor.result.dailyRate).toBeCloseTo(3448.2759, 3);
  });

  it('平年の2月は28日で割る', () => {
    const r = run({
      period: { kind: 'days', days: 14, month: '2023-02' },
      amount: 56000,
    });
    expect(r.ok && r.result.amount).toBe(28000);
  });

  it('月全体の日数なら月額と一致する', () => {
    const r = run({ period: { kind: 'days', days: 29, month: '2024-02' } });
    expect(r.ok && r.result.amount).toBe(100000);
  });

  it('30日基準では月に依存しない', () => {
    const r = run({
      basis: 'thirty',
      period: { kind: 'days', days: 15, month: '' },
    });
    expect(r.ok && r.result.amount).toBe(50000);
    expect(r.ok && r.result.segments).toEqual([]);
  });

  it('年換算（月額×12÷365）で計算する', () => {
    const r = run({
      basis: 'year365',
      period: { kind: 'days', days: 30, month: '' },
    });
    expect(r.ok && r.result.rawAmount).toBeCloseTo(98630.137, 2);
    expect(r.ok && r.result.amount).toBe(98630);
    const up = run({
      basis: 'year365',
      rounding: 'ceil',
      period: { kind: 'days', days: 30, month: '' },
    });
    expect(up.ok && up.result.amount).toBe(98631);
  });

  it('0日は0円', () => {
    const r = run({ period: { kind: 'days', days: 0, month: '2024-01' } });
    expect(r.ok && r.result.amount).toBe(0);
  });

  it('割り切れる値は浮動小数点誤差で切捨てがずれない', () => {
    const r = run({
      amount: 30000,
      basis: 'thirty',
      period: { kind: 'days', days: 7, month: '' },
    });
    expect(r.ok && r.result.amount).toBe(7000);
  });

  it('暦日数基準で月の日数を超えるとエラー', () => {
    expect(
      run({ period: { kind: 'days', days: 30, month: '2024-02' } }),
    ).toEqual({ ok: false, error: 'days' });
  });

  it('暦日数基準で対象月が不正だとエラー、他の基準では不要', () => {
    expect(
      run({ period: { kind: 'days', days: 3, month: '2024-13' } }),
    ).toEqual({ ok: false, error: 'month' });
    expect(run({ period: { kind: 'days', days: 3, month: '' } })).toEqual({
      ok: false,
      error: 'month',
    });
    expect(
      run({ basis: 'thirty', period: { kind: 'days', days: 3, month: '' } }).ok,
    ).toBe(true);
  });

  it('日数が負・小数・上限超過ならエラー', () => {
    for (const days of [-1, 1.5, 367, NaN]) {
      expect(
        run({ basis: 'thirty', period: { kind: 'days', days, month: '' } }),
      ).toEqual({ ok: false, error: 'days' });
    }
  });

  it('金額が0以下・非有限ならエラー', () => {
    for (const amount of [0, -1, NaN, Infinity]) {
      expect(
        run({ amount, period: { kind: 'days', days: 1, month: '2024-01' } }),
      ).toEqual({ ok: false, error: 'amount' });
    }
  });
});

describe('開始日・終了日', () => {
  it('開始日と終了日を両方含めて数える', () => {
    const r = run({
      period: { kind: 'range', start: '2024-01-16', end: '2024-01-31' },
    });
    expect(r.ok && r.result.days).toBe(16);
    expect(r.ok && r.result.segments).toEqual([
      { year: 2024, month: 1, days: 16, daysInMonth: 31 },
    ]);
  });

  it('同じ日なら1日', () => {
    const r = run({
      basis: 'thirty',
      period: { kind: 'range', start: '2024-05-10', end: '2024-05-10' },
    });
    expect(r.ok && r.result.days).toBe(1);
  });

  it('月をまたぐ場合は月ごとに按分して合算する', () => {
    // 1/16-1/31 = 16日/31日、2/1-2/10 = 10日/29日（うるう年）
    const r = run({
      period: { kind: 'range', start: '2024-01-16', end: '2024-02-10' },
    });
    expect(r.ok && r.result.days).toBe(26);
    expect(r.ok && r.result.segments).toHaveLength(2);
    expect(r.ok && r.result.dailyRate).toBeNull();
    const expected = (100000 * 16) / 31 + (100000 * 10) / 29;
    expect(r.ok && r.result.rawAmount).toBeCloseTo(expected, 6);
    expect(r.ok && r.result.amount).toBe(Math.floor(expected));
  });

  it('年をまたいでも数えられる', () => {
    const r = run({
      period: { kind: 'range', start: '2023-12-20', end: '2024-01-05' },
    });
    expect(r.ok && r.result.days).toBe(17);
    expect(
      r.ok && r.result.segments.map((s) => `${s.year}-${s.month}`),
    ).toEqual(['2023-12', '2024-1']);
  });

  it('丸1か月ぶんは月額と一致する', () => {
    const r = run({
      period: { kind: 'range', start: '2024-02-01', end: '2024-02-29' },
    });
    expect(r.ok && r.result.amount).toBe(100000);
    const multi = run({
      period: { kind: 'range', start: '2024-01-01', end: '2024-03-31' },
    });
    expect(multi.ok && multi.result.amount).toBe(300000);
  });

  it('30日基準・年換算は通算日数で計算する', () => {
    const thirty = run({
      basis: 'thirty',
      period: { kind: 'range', start: '2024-01-16', end: '2024-02-10' },
    });
    expect(thirty.ok && thirty.result.amount).toBe(86666);
    expect(thirty.ok && thirty.result.segments).toEqual([]);
    const year = run({
      basis: 'year365',
      period: { kind: 'range', start: '2024-01-01', end: '2024-12-31' },
    });
    // 366日 x 月額x12/365
    expect(year.ok && year.result.days).toBe(366);
    expect(year.ok && year.result.amount).toBe(1203287);
  });

  it('開始日が終了日より後ならエラー', () => {
    expect(
      run({
        period: { kind: 'range', start: '2024-02-10', end: '2024-02-09' },
      }),
    ).toEqual({ ok: false, error: 'order' });
  });

  it('存在しない日付・空欄はエラー', () => {
    expect(
      run({
        period: { kind: 'range', start: '2023-02-29', end: '2023-03-01' },
      }),
    ).toEqual({ ok: false, error: 'date' });
    expect(
      run({ period: { kind: 'range', start: '', end: '2023-03-01' } }),
    ).toEqual({ ok: false, error: 'date' });
  });

  it('長すぎる期間はエラー', () => {
    expect(
      run({
        period: { kind: 'range', start: '2000-01-01', end: '2024-01-01' },
      }),
    ).toEqual({ ok: false, error: 'range' });
  });
});
