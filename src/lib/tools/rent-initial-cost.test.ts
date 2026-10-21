import { describe, expect, it } from 'vitest';
import {
  calculateRentGuideline,
  calculateRentInitialCost,
  calculateRentToIncomeRatio,
  type RentInitialCostInput,
} from './rent-initial-cost';

const base: RentInitialCostInput = {
  rent: 100000,
  managementFee: 5000,
  depositMonths: 1,
  keyMoneyMonths: 1,
  brokerageMonths: 1,
  occupiedDays: 15,
  prepaidMonths: 1,
  fireInsurance: 20000,
  keyExchange: 15000,
  guaranteePercent: 50,
  moving: 100000,
  other: 0,
};

function amountOf(
  r: NonNullable<ReturnType<typeof calculateRentInitialCost>>,
  id: string,
) {
  return r.items.find((i) => i.id === id)!.amount;
}

describe('calculateRentInitialCost', () => {
  it('項目別に計算して合算する', () => {
    const r = calculateRentInitialCost(base)!;
    expect(amountOf(r, 'deposit')).toBe(100000);
    expect(amountOf(r, 'keyMoney')).toBe(100000);
    expect(amountOf(r, 'brokerage')).toBe(110000);
    expect(amountOf(r, 'proratedRent')).toBe(52500);
    expect(amountOf(r, 'prepaidRent')).toBe(105000);
    expect(amountOf(r, 'guarantee')).toBe(52500);
    expect(r.total).toBe(
      100000 +
        100000 +
        110000 +
        52500 +
        105000 +
        20000 +
        15000 +
        52500 +
        100000,
    );
    expect(r.monthlyPayment).toBe(105000);
    expect(r.totalWithoutDeposit).toBe(r.total - 100000);
    expect(r.totalInRentMonths).toBeCloseTo(r.total / 100000);
  });

  it('仲介手数料は管理費を含まず家賃のみに税込1.1を掛ける', () => {
    const r = calculateRentInitialCost({ ...base, brokerageMonths: 0.5 })!;
    expect(amountOf(r, 'brokerage')).toBe(55000);
  });

  it('敷金礼金なし・日割りなしでも計算できる', () => {
    const r = calculateRentInitialCost({
      ...base,
      depositMonths: 0,
      keyMoneyMonths: 0,
      occupiedDays: 0,
      prepaidMonths: 0,
      guaranteePercent: 0,
      brokerageMonths: 0,
      fireInsurance: 0,
      keyExchange: 0,
      moving: 0,
    })!;
    expect(r.total).toBe(0);
  });

  it('円未満は四捨五入する', () => {
    const r = calculateRentInitialCost({
      ...base,
      rent: 55555,
      managementFee: 0,
      occupiedDays: 10,
    })!;
    expect(amountOf(r, 'proratedRent')).toBe(18518);
  });

  it('日割り31日・敷金24ヶ月・保証料200%の上限ちょうどは受け付ける', () => {
    const r = calculateRentInitialCost({
      ...base,
      rent: 300000,
      managementFee: 0,
      occupiedDays: 31,
      depositMonths: 24,
      guaranteePercent: 200,
    });
    expect(r).not.toBeNull();
    // 300,000円 x 31 / 30 = 310,000円（日割り）
    expect(amountOf(r!, 'proratedRent')).toBe(310000);
  });

  it('不正な入力はnull', () => {
    expect(calculateRentInitialCost({ ...base, rent: 0 })).toBeNull();
    expect(calculateRentInitialCost({ ...base, rent: NaN })).toBeNull();
    expect(calculateRentInitialCost({ ...base, managementFee: -1 })).toBeNull();
    expect(calculateRentInitialCost({ ...base, moving: Infinity })).toBeNull();
    expect(calculateRentInitialCost({ ...base, depositMonths: 25 })).toBeNull();
    expect(calculateRentInitialCost({ ...base, occupiedDays: 32 })).toBeNull();
    expect(
      calculateRentInitialCost({ ...base, guaranteePercent: 201 }),
    ).toBeNull();
  });
});

describe('calculateRentGuideline', () => {
  it('年収から家賃目安を求める', () => {
    const g = calculateRentGuideline(4800000)!;
    expect(g.monthlyGross).toBe(400000);
    expect(g.upperLimit).toBe(133333);
    expect(g.comfortable).toBe(100000);
  });

  it('0以下・NaNはnull', () => {
    expect(calculateRentGuideline(0)).toBeNull();
    expect(calculateRentGuideline(-1)).toBeNull();
    expect(calculateRentGuideline(NaN)).toBeNull();
  });
});

describe('calculateRentToIncomeRatio', () => {
  it('月収に占める割合を%で返す', () => {
    expect(calculateRentToIncomeRatio(100000, 4800000)).toBeCloseTo(25);
  });

  it('不正値はnull', () => {
    expect(calculateRentToIncomeRatio(100000, 0)).toBeNull();
    expect(calculateRentToIncomeRatio(-1, 4800000)).toBeNull();
  });
});
