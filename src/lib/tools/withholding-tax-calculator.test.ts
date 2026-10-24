import { describe, expect, it } from 'vitest';
import {
  MAX_AMOUNT,
  calculateWithholding,
  consumptionTaxOf,
  withholdingTax,
} from './withholding-tax-calculator';

describe('withholdingTax', () => {
  it('100万円以下は10.21%', () => {
    expect(withholdingTax(100_000, false)).toBe(10_210);
    expect(withholdingTax(0, false)).toBe(0);
  });

  it('100万円ちょうどは102,100円', () => {
    expect(withholdingTax(1_000_000, false)).toBe(102_100);
  });

  it('100万1円は超過分が1円未満なので102,100円のまま', () => {
    expect(withholdingTax(1_000_001, false)).toBe(102_100);
    expect(withholdingTax(1_000_004, false)).toBe(102_100);
    expect(withholdingTax(1_000_005, false)).toBe(102_101);
  });

  it('100万円超は超過分に20.42%を加える', () => {
    expect(withholdingTax(2_000_000, false)).toBe(306_300);
  });

  it('1円未満は切り捨てる', () => {
    expect(withholdingTax(12_345, false)).toBe(1260);
    expect(withholdingTax(9, false)).toBe(0);
    expect(withholdingTax(10, false)).toBe(1);
  });

  it('司法書士等は1万円を控除してから計算する', () => {
    expect(withholdingTax(100_000, true)).toBe(9189);
    expect(withholdingTax(5000, true)).toBe(0);
    expect(withholdingTax(10_000, true)).toBe(0);
  });

  it('司法書士等は控除後の金額で100万円超を判定する', () => {
    expect(withholdingTax(1_010_000, true)).toBe(102_100);
    expect(withholdingTax(1_020_000, true)).toBe(104_142);
    // 控除前は100万円超でも、控除後に100万円以下なら低い率
    expect(withholdingTax(1_005_000, true)).toBe(
      Math.floor((995_000 * 1021) / 10000),
    );
  });
});

describe('consumptionTaxOf', () => {
  it('1円未満は切り捨てる', () => {
    expect(consumptionTaxOf(100_000)).toBe(10_000);
    expect(consumptionTaxOf(99_999)).toBe(9999);
  });
});

describe('calculateWithholding', () => {
  it('税抜報酬: 消費税を区分し、税抜額にだけ源泉徴収する', () => {
    const r = calculateWithholding({
      mode: 'excl',
      amount: 100_000,
      judicial: false,
    })!;
    expect(r.targetAmount).toBe(100_000);
    expect(r.consumptionTax).toBe(10_000);
    expect(r.invoiceTotal).toBe(110_000);
    expect(r.withholding).toBe(10_210);
    expect(r.payment).toBe(99_790);
    expect(r.taxSeparated).toBe(true);
    expect(r.overThreshold).toBe(false);
  });

  it('税込金額: 区分なしなので税込額全体が対象になる', () => {
    const r = calculateWithholding({
      mode: 'incl',
      amount: 110_000,
      judicial: false,
    })!;
    expect(r.consumptionTax).toBe(0);
    expect(r.invoiceTotal).toBe(110_000);
    expect(r.withholding).toBe(11_231);
    expect(r.payment).toBe(98_769);
    expect(r.taxSeparated).toBe(false);
  });

  it('100万円ちょうどと100万1円の区分', () => {
    const a = calculateWithholding({
      mode: 'incl',
      amount: 1_000_000,
      judicial: false,
    })!;
    const b = calculateWithholding({
      mode: 'incl',
      amount: 1_000_001,
      judicial: false,
    })!;
    expect(a.overThreshold).toBe(false);
    expect(b.overThreshold).toBe(true);
    expect(a.withholding).toBe(102_100);
    expect(b.withholding).toBe(102_100);
    expect(b.payment).toBe(a.payment + 1);
  });

  it('司法書士モードでは取り分けが変わる', () => {
    const r = calculateWithholding({
      mode: 'incl',
      amount: 100_000,
      judicial: true,
    })!;
    expect(r.taxBase).toBe(90_000);
    expect(r.withholding).toBe(9189);
    expect(r.payment).toBe(90_811);
  });

  it('金額0は全て0', () => {
    const r = calculateWithholding({
      mode: 'excl',
      amount: 0,
      judicial: false,
    })!;
    expect(r.withholding).toBe(0);
    expect(r.payment).toBe(0);
    expect(r.effectiveRate).toBe(0);
  });

  it('小数は切り捨てて扱う', () => {
    const r = calculateWithholding({
      mode: 'incl',
      amount: 1000.9,
      judicial: false,
    })!;
    expect(r.invoiceTotal).toBe(1000);
  });

  it('不正な入力は null', () => {
    for (const amount of [-1, NaN, Infinity, MAX_AMOUNT + 1]) {
      expect(
        calculateWithholding({ mode: 'excl', amount, judicial: false }),
      ).toBeNull();
    }
  });
});

describe('手取りからの逆算', () => {
  const targets = [
    1, 9, 10, 10_000, 12_345, 99_999, 100_000, 500_000, 999_999, 1_000_000,
    1_000_001, 1_000_005, 1_234_567, 2_000_000, 50_000_000,
  ];

  it('net-incl: 順計算した支払額から元の請求額に戻る', () => {
    for (const judicial of [false, true]) {
      for (const total of targets) {
        const forward = calculateWithholding({
          mode: 'incl',
          amount: total,
          judicial,
        })!;
        const back = calculateWithholding({
          mode: 'net-incl',
          amount: forward.payment,
          judicial,
        })!;
        expect(back.payment).toBe(forward.payment);
        expect(back.exact).toBe(true);
        // 同じ手取りになる最小の請求額
        expect(back.invoiceTotal).toBeLessThanOrEqual(total);
        const smaller = calculateWithholding({
          mode: 'incl',
          amount: back.invoiceTotal - 1,
          judicial,
        })!;
        expect(smaller.payment).toBeLessThan(forward.payment);
      }
    }
  });

  it('net-excl: 順計算した支払額から税抜報酬に戻る', () => {
    for (const price of targets) {
      const forward = calculateWithholding({
        mode: 'excl',
        amount: price,
        judicial: false,
      })!;
      const back = calculateWithholding({
        mode: 'net-excl',
        amount: forward.payment,
        judicial: false,
      })!;
      expect(back.payment).toBe(forward.payment);
      expect(back.targetAmount).toBeLessThanOrEqual(price);
      expect(back.taxSeparated).toBe(true);
    }
  });

  it('手取り10万円から逆算した結果が手取りと一致する', () => {
    const r = calculateWithholding({
      mode: 'net-incl',
      amount: 100_000,
      judicial: false,
    })!;
    expect(r.payment).toBe(100_000);
    expect(r.invoiceTotal - r.withholding).toBe(100_000);
    // 100,000 / (1 - 0.1021) = 111,370.3...
    expect(r.invoiceTotal).toBeGreaterThanOrEqual(111_370);
    expect(r.invoiceTotal).toBeLessThanOrEqual(111_372);
  });

  it('100万円をまたぐ手取りでも逆算できる', () => {
    const r = calculateWithholding({
      mode: 'net-incl',
      amount: 1_000_000,
      judicial: false,
    })!;
    expect(r.payment).toBe(1_000_000);
    expect(r.overThreshold).toBe(true);
  });

  it('手取り0は報酬0', () => {
    const r = calculateWithholding({
      mode: 'net-incl',
      amount: 0,
      judicial: false,
    })!;
    expect(r.invoiceTotal).toBe(0);
  });

  it('大きな金額でも収束する', () => {
    const r = calculateWithholding({
      mode: 'net-excl',
      amount: MAX_AMOUNT,
      judicial: true,
    })!;
    expect(r.payment).toBeGreaterThanOrEqual(MAX_AMOUNT);
  });
});
