import { describe, expect, it } from 'vitest';
import {
  applyHalfRule,
  calculateRetirementAllowanceTax,
  countServiceYears,
  determineHalfRule,
  retirementDeduction,
  type RetirementAllowanceInput,
} from './retirement-allowance-tax';

const base: RetirementAllowanceInput = {
  retirementPay: 20_000_000,
  serviceYears: 30,
  serviceMonths: 0,
  disability: false,
  kind: 'regular',
};

describe('countServiceYears', () => {
  it('1年未満の端数は切り上げる', () => {
    expect(countServiceYears(10, 0)).toBe(10);
    expect(countServiceYears(10, 1)).toBe(11);
    expect(countServiceYears(0, 3)).toBe(1);
  });
});

describe('retirementDeduction', () => {
  it('20年以下は40万円×年', () => {
    expect(retirementDeduction(10, false)).toBe(4_000_000);
    expect(retirementDeduction(20, false)).toBe(8_000_000);
  });
  it('20年超は800万円+70万円×(年-20)', () => {
    expect(retirementDeduction(21, false)).toBe(8_700_000);
    expect(retirementDeduction(38, false)).toBe(20_600_000);
  });
  it('最低80万円を保障する', () => {
    expect(retirementDeduction(1, false)).toBe(800_000);
    expect(retirementDeduction(2, false)).toBe(800_000);
    expect(retirementDeduction(3, false)).toBe(1_200_000);
  });
  it('障害退職は100万円加算', () => {
    expect(retirementDeduction(30, true)).toBe(16_000_000);
    expect(retirementDeduction(1, true)).toBe(1_800_000);
  });
});

describe('determineHalfRule / applyHalfRule', () => {
  it('勤続5年超は全額に2分の1', () => {
    expect(determineHalfRule('regular', 6)).toBe('full');
    expect(determineHalfRule('officer', 6)).toBe('full');
  });
  it('勤続5年以下は一般が partial、役員等が none', () => {
    expect(determineHalfRule('regular', 5)).toBe('partial');
    expect(determineHalfRule('officer', 5)).toBe('none');
  });
  it('partial は300万円超の部分に2分の1を適用しない', () => {
    expect(applyHalfRule(3_000_000, 'partial')).toBe(1_500_000);
    expect(applyHalfRule(5_000_000, 'partial')).toBe(3_500_000);
    expect(applyHalfRule(2_000_000, 'partial')).toBe(1_000_000);
  });
  it('none は2分の1にしない', () => {
    expect(applyHalfRule(5_000_000, 'none')).toBe(5_000_000);
  });
});

describe('calculateRetirementAllowanceTax', () => {
  it('勤続30年・2,000万円の例', () => {
    const r = calculateRetirementAllowanceTax(base)!;
    expect(r.deduction).toBe(15_000_000);
    expect(r.afterDeduction).toBe(5_000_000);
    expect(r.taxableIncome).toBe(2_500_000);
    expect(r.incomeTaxBase).toBe(152_500);
    expect(r.reconstructionTax).toBe(3_202);
    expect(r.incomeTax).toBe(155_702);
    expect(r.residentTax).toBe(250_000);
    expect(r.totalTax).toBe(405_702);
    expect(r.takeHome).toBe(19_594_298);
  });

  it('控除額以下なら税金は0', () => {
    const r = calculateRetirementAllowanceTax({
      ...base,
      retirementPay: 15_000_000,
    })!;
    expect(r.afterDeduction).toBe(0);
    expect(r.totalTax).toBe(0);
    expect(r.takeHome).toBe(15_000_000);
  });

  it('課税退職所得は1,000円未満を切り捨てる', () => {
    const r = calculateRetirementAllowanceTax({
      ...base,
      retirementPay: 15_005_999,
    })!;
    // 5,999 / 2 = 2,999.5 -> 2,000
    expect(r.taxableIncome).toBe(2_000);
  });

  it('勤続5年以下の一般: 300万円超の部分は2分の1にならない', () => {
    const r = calculateRetirementAllowanceTax({
      ...base,
      retirementPay: 10_000_000,
      serviceYears: 3,
    })!;
    expect(r.halfRule).toBe('partial');
    expect(r.afterDeduction).toBe(8_800_000);
    expect(r.taxableIncome).toBe(7_300_000);
    expect(r.incomeTaxBase).toBe(1_043_000);
  });

  it('役員等の勤続5年以下は2分の1にならない', () => {
    const r = calculateRetirementAllowanceTax({
      ...base,
      retirementPay: 10_000_000,
      serviceYears: 3,
      kind: 'officer',
    })!;
    expect(r.halfRule).toBe('none');
    expect(r.taxableIncome).toBe(8_800_000);
    expect(r.incomeTaxBase).toBe(1_388_000);
    expect(r.reconstructionTax).toBe(29_148);
  });

  it('役員等でも勤続6年以上なら通常どおり2分の1', () => {
    const r = calculateRetirementAllowanceTax({
      ...base,
      kind: 'officer',
      serviceYears: 6,
    })!;
    expect(r.halfRule).toBe('full');
  });

  it('端数の月で勤続年数が切り上がる', () => {
    const r = calculateRetirementAllowanceTax({
      ...base,
      serviceYears: 4,
      serviceMonths: 1,
    })!;
    expect(r.countedYears).toBe(5);
    const r2 = calculateRetirementAllowanceTax({
      ...base,
      serviceYears: 5,
      serviceMonths: 1,
    })!;
    expect(r2.countedYears).toBe(6);
    expect(r2.halfRule).toBe('full');
  });

  it('障害退職で控除が増え税が減る', () => {
    const a = calculateRetirementAllowanceTax(base)!;
    const b = calculateRetirementAllowanceTax({ ...base, disability: true })!;
    expect(b.deduction).toBe(a.deduction + 1_000_000);
    expect(b.totalTax).toBeLessThan(a.totalTax);
  });

  it('不正な入力は null', () => {
    expect(
      calculateRetirementAllowanceTax({ ...base, retirementPay: -1 }),
    ).toBeNull();
    expect(
      calculateRetirementAllowanceTax({ ...base, retirementPay: NaN }),
    ).toBeNull();
    expect(
      calculateRetirementAllowanceTax({ ...base, serviceYears: 0 }),
    ).toBeNull();
    expect(
      calculateRetirementAllowanceTax({ ...base, serviceYears: 1.5 }),
    ).toBeNull();
    expect(
      calculateRetirementAllowanceTax({ ...base, serviceMonths: 12 }),
    ).toBeNull();
    expect(
      calculateRetirementAllowanceTax({ ...base, serviceYears: 81 }),
    ).toBeNull();
  });

  it('収入0円でも計算できる', () => {
    const r = calculateRetirementAllowanceTax({ ...base, retirementPay: 0 })!;
    expect(r.totalTax).toBe(0);
    expect(r.effectiveRate).toBe(0);
  });
});
