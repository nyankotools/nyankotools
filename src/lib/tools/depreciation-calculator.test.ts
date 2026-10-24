import { describe, expect, it } from 'vitest';
import {
  DECLINING_TABLE,
  calculateDepreciation,
  getRates,
  isValidDateString,
  judgeSmallAsset,
  lumpSumSchedule,
  straightLineRateMilli,
} from './depreciation-calculator';

const base = {
  cost: 1_000_000,
  usefulLife: 5,
  method: 'declining' as const,
  firstYearMonths: 12,
  startYear: 2026,
};

function ok(input: Parameters<typeof calculateDepreciation>[0]) {
  const r = calculateDepreciation(input);
  if (!r.ok) throw new Error(`unexpected error: ${r.reason}`);
  return r;
}

describe('償却率', () => {
  it('定額法の償却率は 1/耐用年数 を小数第4位で切り上げた値', () => {
    expect(straightLineRateMilli(2)).toBe(500);
    expect(straightLineRateMilli(3)).toBe(334);
    expect(straightLineRateMilli(4)).toBe(250);
    expect(straightLineRateMilli(6)).toBe(167);
    expect(straightLineRateMilli(7)).toBe(143);
    expect(straightLineRateMilli(9)).toBe(112);
    expect(straightLineRateMilli(15)).toBe(67);
    expect(straightLineRateMilli(22)).toBe(46);
    expect(straightLineRateMilli(24)).toBe(42);
    expect(straightLineRateMilli(47)).toBe(22);
    expect(straightLineRateMilli(50)).toBe(20);
  });

  it('定率法の償却率表（200%）: 代表値と、2/耐用年数 の丸めとの整合', () => {
    const row = (n: number) => DECLINING_TABLE.find((r) => r.life === n)!;
    expect(row(2)).toMatchObject({
      rateMilli: 1000,
      revisedMilli: null,
      guaranteeE5: null,
    });
    expect(row(4)).toMatchObject({
      rateMilli: 500,
      revisedMilli: 1000,
      guaranteeE5: 12499,
    });
    expect(row(10)).toMatchObject({
      rateMilli: 200,
      revisedMilli: 250,
      guaranteeE5: 6552,
    });
    expect(row(20)).toMatchObject({
      rateMilli: 100,
      revisedMilli: 112,
      guaranteeE5: 3486,
    });
    expect(DECLINING_TABLE).toHaveLength(19);
    for (const r of DECLINING_TABLE.filter((x) => x.life >= 3)) {
      expect(r.rateMilli).toBe(Math.round(2000 / r.life));
    }
  });

  it('範囲外の耐用年数は null、21年以上は定率法の行がない', () => {
    expect(getRates(1)).toBeNull();
    expect(getRates(51)).toBeNull();
    expect(getRates(5.5)).toBeNull();
    expect(getRates(24)?.declining).toBeNull();
    expect(getRates(20)?.declining?.life).toBe(20);
  });
});

describe('定率法（200%）', () => {
  it('100万円・耐用年数10年: 手計算どおり（200,000 → 160,000 → …、7年目に改定償却率へ）', () => {
    const r = ok({ ...base, usefulLife: 10 });
    expect(r.rows.map((x) => x.depreciation)).toEqual([
      200_000, 160_000, 128_000, 102_400, 81_920, 65_536, 65_536, 65_536,
      65_536, 65_535,
    ]);
    expect(r.guaranteeAmount).toBe(65_520);
    expect(r.rows.findIndex((x) => x.revisedStart)).toBe(6);
    expect(r.rows[9].closingBalance).toBe(1);
    expect(r.years).toBe(10);
  });

  it('耐用年数以内に償却が完了する（2〜20年、通年・期中取得）', () => {
    for (const row of DECLINING_TABLE) {
      for (const months of [12, 6, 1]) {
        const r = ok({
          ...base,
          usefulLife: row.life,
          firstYearMonths: months,
        });
        expect(r.rows[r.rows.length - 1].closingBalance).toBe(1);
        if (months === 12) expect(r.years).toBeLessThanOrEqual(row.life);
        else expect(r.years).toBeLessThanOrEqual(row.life + 1);
      }
    }
  });

  it('100万円・耐用年数5年: 保証額を下回った年に改定償却率で最後の1円を残す', () => {
    const r = ok(base);
    expect(r.rows.map((x) => x.depreciation)).toEqual([
      400_000, 240_000, 144_000, 108_000, 107_999,
    ]);
    expect(r.guaranteeAmount).toBe(108_000);
    expect(r.rows[3].revisedStart).toBe(true);
    expect(r.rows[4].revisedStart).toBe(false);
    expect(r.rows[4].revised).toBe(true);
    expect(r.rows[4].closingBalance).toBe(1);
    expect(r.totalDepreciation).toBe(999_999);
    expect(r.rows.map((x) => x.year)).toEqual([2026, 2027, 2028, 2029, 2030]);
  });

  it('耐用年数4年: 3年目の償却額が保証額を上回り、4年目に改定償却率1.000へ', () => {
    const r = ok({ ...base, usefulLife: 4 });
    expect(r.rows.map((x) => x.depreciation)).toEqual([
      500_000, 250_000, 125_000, 124_999,
    ]);
    expect(r.rows[3].revisedStart).toBe(true);
  });

  it('耐用年数3年: 3年目に改定償却率1.000へ切り替わる', () => {
    const r = ok({ ...base, usefulLife: 3 });
    expect(r.rows.map((x) => x.depreciation)).toEqual([
      667_000, 222_111, 110_888,
    ]);
    expect(r.rows[2].revisedStart).toBe(true);
  });

  it('耐用年数6年: 改定後は同額を続け、最後の年に残りを償却する', () => {
    const r = ok({ ...base, usefulLife: 6 });
    const deps = r.rows.map((x) => x.depreciation);
    expect(deps).toEqual([333_000, 222_111, 148_148, 99_111, 99_111, 98_518]);
    expect(r.rows.findIndex((x) => x.revisedStart)).toBe(3);
    expect(r.rows[r.rows.length - 1].closingBalance).toBe(1);
  });

  it('耐用年数2年: 1年目に備忘価額1円を残して償却する', () => {
    const r = ok({ ...base, usefulLife: 2 });
    expect(r.rows.map((x) => x.depreciation)).toEqual([999_999]);
    expect(r.guaranteeAmount).toBeNull();
    expect(r.revisedMilli).toBeNull();
  });

  it('期中取得（6か月）: 初年度のみ月割りで、翌年は期首残高に率をかける', () => {
    const r = ok({ ...base, firstYearMonths: 6 });
    expect(r.rows.map((x) => x.depreciation)).toEqual([
      200_000, 320_000, 192_000, 115_200, 86_400, 86_399,
    ]);
    expect(r.rows[r.rows.length - 1].closingBalance).toBe(1);
  });

  it('耐用年数21年以上は定率法の対象外エラー', () => {
    expect(calculateDepreciation({ ...base, usefulLife: 24 })).toEqual({
      ok: false,
      reason: 'declining-unsupported',
    });
  });
});

describe('定額法', () => {
  it('100万円・5年: 毎年20万円で、最終年に備忘価額1円を残す', () => {
    const r = ok({ ...base, method: 'straight' });
    expect(r.rows.map((x) => x.depreciation)).toEqual([
      200_000, 200_000, 200_000, 200_000, 199_999,
    ]);
    expect(r.rateMilli).toBe(200);
    expect(r.guaranteeAmount).toBeNull();
  });

  it('100万円・6年: 償却率0.167で5年後の残りを最終年に償却する', () => {
    const r = ok({ ...base, method: 'straight', usefulLife: 6 });
    expect(r.rows.map((x) => x.depreciation)).toEqual([
      167_000, 167_000, 167_000, 167_000, 167_000, 164_999,
    ]);
  });

  it('期中取得（6か月）: 初年度は半分で、償却が1年延びる', () => {
    const r = ok({ ...base, method: 'straight', firstYearMonths: 6 });
    expect(r.rows.map((x) => x.depreciation)).toEqual([
      100_000, 200_000, 200_000, 200_000, 200_000, 99_999,
    ]);
    expect(r.years).toBe(6);
    expect(r.firstYearDepreciation).toBe(100_000);
  });

  it('建物（耐用年数50年・定額法）でも終わりまで計算できる', () => {
    const r = ok({
      ...base,
      method: 'straight',
      usefulLife: 50,
      cost: 30_000_000,
    });
    expect(r.rows[0].depreciation).toBe(600_000);
    expect(r.rows[r.rows.length - 1].closingBalance).toBe(1);
    expect(r.totalDepreciation).toBe(29_999_999);
  });
});

describe('入力チェック・端数', () => {
  it('不正な入力はエラー理由を返す', () => {
    expect(calculateDepreciation({ ...base, cost: 0 })).toEqual({
      ok: false,
      reason: 'cost',
    });
    expect(calculateDepreciation({ ...base, cost: 1 })).toMatchObject({
      reason: 'cost',
    });
    expect(calculateDepreciation({ ...base, cost: 1.5 })).toMatchObject({
      reason: 'cost',
    });
    expect(
      calculateDepreciation({ ...base, cost: 10_000_000_001 }),
    ).toMatchObject({ reason: 'cost' });
    expect(calculateDepreciation({ ...base, cost: NaN })).toMatchObject({
      reason: 'cost',
    });
    expect(calculateDepreciation({ ...base, usefulLife: 1 })).toMatchObject({
      reason: 'life',
    });
    expect(
      calculateDepreciation({ ...base, firstYearMonths: 0 }),
    ).toMatchObject({
      reason: 'months',
    });
    expect(
      calculateDepreciation({ ...base, firstYearMonths: 13 }),
    ).toMatchObject({ reason: 'months' });
    expect(calculateDepreciation({ ...base, startYear: 1800 })).toMatchObject({
      reason: 'year',
    });
  });

  it('2円など極端に小さい取得価額でも必ず終了し、備忘価額1円が残る', () => {
    for (const method of ['straight', 'declining'] as const) {
      for (const cost of [2, 3, 7, 100]) {
        const r = ok({ ...base, cost, method });
        expect(r.rows[r.rows.length - 1].closingBalance).toBe(1);
        expect(r.totalDepreciation).toBe(cost - 1);
        for (const row of r.rows) {
          expect(row.depreciation).toBeGreaterThan(0);
        }
      }
    }
  });

  it('上限額（100億円）でも償却総額が取得価額−1円になる', () => {
    for (const method of ['straight', 'declining'] as const) {
      const r = ok({ ...base, cost: 10_000_000_000, method });
      expect(r.totalDepreciation).toBe(9_999_999_999);
      const sum = r.rows.reduce((s, x) => s + x.depreciation, 0);
      expect(sum).toBe(9_999_999_999);
    }
  });

  it('各行で 期首残高 − 償却費 = 期末残高、次年の期首 = 前年の期末', () => {
    const r = ok({ ...base, usefulLife: 8, firstYearMonths: 9 });
    r.rows.forEach((row, i) => {
      expect(row.openingBalance - row.depreciation).toBe(row.closingBalance);
      if (i > 0) expect(row.openingBalance).toBe(r.rows[i - 1].closingBalance);
    });
  });
});

describe('一括償却資産', () => {
  it('3年均等で端数は最終年に寄せる', () => {
    expect(lumpSumSchedule(150_000)).toEqual([50_000, 50_000, 50_000]);
    expect(lumpSumSchedule(100_001)).toEqual([33_333, 33_333, 33_335]);
  });
});

describe('少額減価償却資産の判定', () => {
  const j = (cost: number, date: string, sme = false) =>
    judgeSmallAsset({ cost, acquisitionDate: date, smallBusiness: sme });

  it('10万円未満は全額損金算入、ちょうど10万円は一括償却資産', () => {
    expect(j(99_999, '2026-01-15')?.options).toEqual(['expense']);
    expect(j(100_000, '2026-01-15')?.options).toEqual(['lump-sum']);
    expect(j(199_999, '2026-01-15')?.options).toEqual(['lump-sum']);
    expect(j(200_000, '2026-01-15')?.options).toEqual([]);
  });

  it('中小企業者等は令和8年3月31日以前の取得なら30万円未満まで特例が選べる', () => {
    expect(j(250_000, '2026-03-31', true)?.options).toEqual([
      'sme-special-old',
    ]);
    expect(j(150_000, '2026-03-31', true)?.options).toEqual([
      'lump-sum',
      'sme-special-old',
    ]);
    expect(j(299_999, '2026-03-31', true)?.options).toEqual([
      'sme-special-old',
    ]);
    expect(j(300_000, '2026-03-31', true)?.options).toEqual([]);
    expect(j(250_000, '2026-03-31', false)?.options).toEqual([]);
  });

  it('令和8年4月1日〜令和11年3月31日の取得は40万円未満まで特例が選べる', () => {
    expect(j(399_999, '2026-04-01', true)?.options).toEqual([
      'sme-special-new',
    ]);
    expect(j(350_000, '2029-03-31', true)?.options).toEqual([
      'sme-special-new',
    ]);
    expect(j(400_000, '2026-04-01', true)?.options).toEqual([]);
    expect(j(350_000, '2026-04-01', false)?.options).toEqual([]);
    expect(j(150_000, '2027-06-01', true)?.options).toEqual([
      'lump-sum',
      'sme-special-new',
    ]);
  });

  it('令和11年4月1日以降の取得は特例なし。10万円・20万円の基準は変わらない', () => {
    expect(j(250_000, '2029-04-01', true)?.options).toEqual([]);
    expect(j(50_000, '2029-04-01', true)?.options).toEqual(['expense']);
    expect(j(50_000, '2026-10-24')?.options).toEqual(['expense']);
    expect(j(100_000, '2026-10-24')?.options).toEqual(['lump-sum']);
  });

  it('不正な取得価額・日付は null', () => {
    expect(j(0, '2026-01-01')).toBeNull();
    expect(j(NaN, '2026-01-01')).toBeNull();
    expect(j(100, '')).toBeNull();
    expect(j(100, '2026-02-30')).toBeNull();
  });

  it('日付文字列の検証', () => {
    expect(isValidDateString('2026-02-28')).toBe(true);
    expect(isValidDateString('2024-02-29')).toBe(true);
    expect(isValidDateString('2026-02-29')).toBe(false);
    expect(isValidDateString('2026-2-1')).toBe(false);
  });
});
