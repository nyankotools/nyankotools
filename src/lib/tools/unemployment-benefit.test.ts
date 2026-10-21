import { describe, expect, it } from 'vitest';
import {
  WAGE_DAILY_MAX,
  WAGE_DAILY_MIN,
  ageGroupOf,
  benefitDays,
  benefitRate,
  calculateUnemploymentBenefit,
  clampWageDaily,
  dailyAllowanceOf,
  isError,
  wageDailyFromMonthly,
  type UnemploymentBenefitInput,
  type UnemploymentBenefitResult,
} from './unemployment-benefit';

const base: UnemploymentBenefitInput = {
  age: 35,
  monthlyWage: 300_000,
  insuredYears: 8,
  insuredMonthsPart: 0,
  reason: 'self',
  repeatedSelfLeave: false,
};

function ok(input: UnemploymentBenefitInput): UnemploymentBenefitResult {
  const r = calculateUnemploymentBenefit(input);
  if (isError(r)) throw new Error(`unexpected error ${r.error}`);
  return r;
}

describe('ageGroupOf', () => {
  it('年齢区分の境界', () => {
    expect(ageGroupOf(29)).toBe('under30');
    expect(ageGroupOf(30)).toBe('30to44');
    expect(ageGroupOf(44)).toBe('30to44');
    expect(ageGroupOf(45)).toBe('45to59');
    expect(ageGroupOf(59)).toBe('45to59');
    expect(ageGroupOf(60)).toBe('60to64');
    expect(ageGroupOf(64)).toBe('60to64');
  });
  it('範囲外・小数は null', () => {
    expect(ageGroupOf(14)).toBeNull();
    expect(ageGroupOf(65)).toBeNull();
    expect(ageGroupOf(30.5)).toBeNull();
  });
});

describe('賃金日額', () => {
  it('月額の6か月分を180で割る（円未満切捨て）', () => {
    expect(wageDailyFromMonthly(300_000)).toBe(10_000);
    expect(wageDailyFromMonthly(250_001)).toBe(8_333);
  });
  it('上下限を適用する', () => {
    expect(clampWageDaily(1_000, '30to44')).toBe(WAGE_DAILY_MIN);
    expect(clampWageDaily(99_999, '30to44')).toBe(WAGE_DAILY_MAX['30to44']);
    expect(clampWageDaily(99_999, '60to64')).toBe(WAGE_DAILY_MAX['60to64']);
  });
});

describe('給付率と基本手当日額', () => {
  it('低賃金帯は80%', () => {
    expect(benefitRate(5_000, 'under30')).toBe(0.8);
    expect(dailyAllowanceOf(5_000, 'under30')).toBe(4_000);
    expect(dailyAllowanceOf(WAGE_DAILY_MIN, '30to44')).toBe(2_562);
  });
  it('中間帯は80%から50%へ下がる', () => {
    // 0.8*10000 - 0.3*(10000-5480)*10000/(13490-5480) = 6307.1
    expect(dailyAllowanceOf(10_000, '30to44')).toBe(6_307);
    const rate = benefitRate(10_000, '30to44');
    expect(rate).toBeGreaterThan(0.5);
    expect(rate).toBeLessThan(0.8);
  });
  it('上限帯は50%（60〜64歳は45%）', () => {
    expect(benefitRate(14_000, '45to59')).toBe(0.5);
    expect(dailyAllowanceOf(WAGE_DAILY_MAX.under30, 'under30')).toBe(7_450);
    expect(dailyAllowanceOf(WAGE_DAILY_MAX['30to44'], '30to44')).toBe(8_270);
    expect(dailyAllowanceOf(WAGE_DAILY_MAX['45to59'], '45to59')).toBe(9_110);
    expect(dailyAllowanceOf(WAGE_DAILY_MAX['60to64'], '60to64')).toBe(7_830);
    expect(benefitRate(17_000, '60to64')).toBe(0.45);
  });
  it('60歳未満は賃金日額が上がっても日額はほぼ減らない（端数1円まで許容）', () => {
    for (const group of ['under30', '45to59'] as const) {
      let prev = 0;
      for (let w = WAGE_DAILY_MIN; w <= WAGE_DAILY_MAX[group]; w += 10) {
        const v = dailyAllowanceOf(w, group);
        expect(v).toBeGreaterThanOrEqual(prev - 1);
        prev = Math.max(prev, v);
      }
    }
  });
  it('60〜64歳は傾斜式と「0.05w+区切り額×0.4」の低い方になる', () => {
    // 傾斜式 5337.3 / 一次式 5248.0 → 低い方
    expect(dailyAllowanceOf(8_000, '60to64')).toBe(5_248);
    // 低賃金側は傾斜式の方が低い
    expect(dailyAllowanceOf(6_000, '60to64')).toBe(4_635);
    // 区切り額で 45% に一致し、それ以上は 0.45w
    expect(dailyAllowanceOf(12_120, '60to64')).toBe(5_454);
    expect(dailyAllowanceOf(15_000, '60to64')).toBe(6_750);
  });
  it('区分の境界で給付率が連続する', () => {
    expect(benefitRate(5_480, '30to44')).toBe(0.8);
    expect(benefitRate(13_490, '30to44')).toBe(0.5);
    expect(dailyAllowanceOf(13_489, '30to44')).toBeGreaterThanOrEqual(6_743);
    expect(dailyAllowanceOf(13_489, '30to44')).toBeLessThanOrEqual(6_745);
  });
});

describe('所定給付日数', () => {
  it('自己都合（一般離職者）は全年齢共通', () => {
    expect(benefitDays(35, 12, 'self')).toBe(90);
    expect(benefitDays(35, 5 * 12, 'self')).toBe(90);
    expect(benefitDays(35, 10 * 12, 'self')).toBe(120);
    expect(benefitDays(50, 20 * 12, 'self')).toBe(150);
  });
  it('自己都合は12か月未満だと0', () => {
    expect(benefitDays(35, 11, 'self')).toBe(0);
  });
  it('会社都合は年齢と期間で決まる', () => {
    expect(benefitDays(45, 20 * 12, 'company')).toBe(330);
    expect(benefitDays(45, 10 * 12, 'company')).toBe(270);
    expect(benefitDays(32, 3 * 12, 'company')).toBe(120);
    expect(benefitDays(38, 3 * 12, 'company')).toBe(150);
    expect(benefitDays(25, 10 * 12, 'company')).toBe(180);
    expect(benefitDays(62, 3 * 12, 'company')).toBe(150);
  });
  it('会社都合は6か月以上あれば90日', () => {
    expect(benefitDays(40, 6, 'company')).toBe(90);
    expect(benefitDays(40, 5, 'company')).toBe(0);
  });
  it('契約満了は特定受給資格者と同じ表、正当な理由は一般の表（6か月から）', () => {
    expect(benefitDays(45, 10 * 12, 'contract-end')).toBe(270);
    expect(benefitDays(45, 10 * 12, 'justified')).toBe(120);
    expect(benefitDays(45, 8, 'justified')).toBe(90);
  });
  it('期間の区分は年の境界ちょうどで次の区分になる', () => {
    expect(benefitDays(45, 59, 'company')).toBe(180);
    expect(benefitDays(45, 60, 'company')).toBe(240);
  });
});

describe('calculateUnemploymentBenefit', () => {
  it('自己都合・35歳・月30万円・8年: 日額6,307円×90日', () => {
    const r = ok(base);
    expect(r.wageDaily).toBe(10_000);
    expect(r.dailyAllowance).toBe(6_307);
    expect(r.days).toBe(90);
    expect(r.totalAmount).toBe(6_307 * 90);
    expect(r.perCertification).toBe(6_307 * 28);
    expect(r.waitingDays).toBe(7);
    expect(r.restrictionMonths).toBe(1);
    expect(r.eligible).toBe(true);
    expect(r.wageClamp).toBeNull();
  });
  it('自己都合で5年以内に3回以上なら給付制限3か月', () => {
    expect(ok({ ...base, repeatedSelfLeave: true }).restrictionMonths).toBe(3);
  });
  it('会社都合なら給付制限なし（回数のチェックも無視）', () => {
    const r = ok({ ...base, reason: 'company', repeatedSelfLeave: true });
    expect(r.restrictionMonths).toBe(0);
    expect(r.days).toBe(180);
  });
  it('高賃金は上限で頭打ちになり wageClamp が max', () => {
    const r = ok({ ...base, monthlyWage: 1_000_000 });
    expect(r.wageClamp).toBe('max');
    expect(r.wageDaily).toBe(WAGE_DAILY_MAX['30to44']);
    expect(r.dailyAllowance).toBe(8_270);
  });
  it('低賃金は下限が適用され wageClamp が min', () => {
    const r = ok({ ...base, monthlyWage: 50_000 });
    expect(r.wageClamp).toBe('min');
    expect(r.wageDaily).toBe(WAGE_DAILY_MIN);
    expect(r.dailyAllowance).toBe(2_562);
  });
  it('被保険者期間が足りないと eligible=false、日数0', () => {
    const r = ok({ ...base, insuredYears: 0, insuredMonthsPart: 9 });
    expect(r.eligible).toBe(false);
    expect(r.days).toBe(0);
    expect(r.totalAmount).toBe(0);
    expect(r.requiredMonths).toBe(12);
    // 会社都合なら6か月で足りる
    const s = ok({
      ...base,
      insuredYears: 0,
      insuredMonthsPart: 9,
      reason: 'company',
    });
    expect(s.eligible).toBe(true);
    expect(s.days).toBe(90);
  });
  it('330日の場合は受給期間が30日延びる', () => {
    const r = ok({
      ...base,
      age: 50,
      insuredYears: 22,
      reason: 'company',
    });
    expect(r.days).toBe(330);
    expect(r.extraValidityDays).toBe(30);
    expect(ok(base).extraValidityDays).toBe(0);
  });
  it('60〜64歳は上限が低く給付率45%', () => {
    const r = ok({ ...base, age: 62, monthlyWage: 800_000 });
    expect(r.ageGroup).toBe('60to64');
    expect(r.rate).toBe(0.45);
    expect(r.dailyAllowance).toBe(7_830);
  });
  it('不正な入力はエラーコードを返す', () => {
    expect(calculateUnemploymentBenefit({ ...base, age: 65 })).toEqual({
      error: 'age',
    });
    expect(calculateUnemploymentBenefit({ ...base, monthlyWage: 0 })).toEqual({
      error: 'wage',
    });
    expect(
      calculateUnemploymentBenefit({ ...base, monthlyWage: Number.NaN }),
    ).toEqual({ error: 'wage' });
    expect(
      calculateUnemploymentBenefit({ ...base, insuredMonthsPart: 12 }),
    ).toEqual({ error: 'period' });
    expect(
      calculateUnemploymentBenefit({
        ...base,
        insuredYears: 0,
        insuredMonthsPart: 0,
      }),
    ).toEqual({ error: 'period' });
    expect(
      calculateUnemploymentBenefit({ ...base, age: 25, insuredYears: 12 }),
    ).toEqual({ error: 'ageService' });
  });
});
