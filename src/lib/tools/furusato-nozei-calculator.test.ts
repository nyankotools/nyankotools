import { describe, expect, it } from 'vitest';
import { calculateFurusatoLimit } from './furusato-nozei-calculator';

const base = {
  grossSalary: 5_000_000,
  age40OrOver: false,
  socialInsuranceOverride: null,
  otherDeductions: 0,
};

describe('calculateFurusatoLimit', () => {
  it('年収500万円・独身の上限が一般的な目安（約6万円）に近い', () => {
    const r = calculateFurusatoLimit(base)!;
    expect(r.donationLimit).toBeGreaterThan(55_000);
    expect(r.donationLimit).toBeLessThan(68_000);
    expect(r.deductibleTotal).toBe(r.donationLimit - 2000);
  });
  it('年収が高いほど上限が大きい', () => {
    const low = calculateFurusatoLimit(base)!;
    const high = calculateFurusatoLimit({ ...base, grossSalary: 8_000_000 })!;
    expect(high.donationLimit).toBeGreaterThan(low.donationLimit);
  });
  it('所得控除が増えると上限が下がる', () => {
    const a = calculateFurusatoLimit(base)!;
    const b = calculateFurusatoLimit({ ...base, otherDeductions: 380_000 })!;
    expect(b.donationLimit).toBeLessThan(a.donationLimit);
  });
  it('住民税所得割がかからない低収入では0円', () => {
    expect(
      calculateFurusatoLimit({ ...base, grossSalary: 1_000_000 })!
        .donationLimit,
    ).toBe(0);
    expect(
      calculateFurusatoLimit({ ...base, grossSalary: 0 })!.donationLimit,
    ).toBe(0);
  });
  it('不正な入力はnull', () => {
    expect(calculateFurusatoLimit({ ...base, grossSalary: -1 })).toBeNull();
  });
  it('非常に大きい年収（十億円超）でも計算できる', () => {
    const r = calculateFurusatoLimit({
      ...base,
      grossSalary: 10_000_000_000,
    })!;
    expect(r).not.toBeNull();
    expect(r.donationLimit).toBeGreaterThan(0);
  });
  it('社会保険料実額を0円で指定できる', () => {
    const r = calculateFurusatoLimit({
      ...base,
      socialInsuranceOverride: 0,
    })!;
    expect(r).not.toBeNull();
    expect(r.donationLimit).toBeGreaterThan(0);
  });
});
