import { describe, expect, it } from 'vitest';
import { calculateDiscount, calculateTax } from './tax-calculator';

describe('calculateTax', () => {
  it('税抜金額から消費税額・税込金額を計算する（標準税率10%）', () => {
    expect(
      calculateTax({
        amount: 1000,
        taxRatePercent: 10,
        priceIncludesTax: false,
        rounding: 'floor',
      }),
    ).toEqual({
      taxExcludedAmount: 1000,
      taxAmount: 100,
      taxIncludedAmount: 1100,
    });
  });

  it('税込金額から税抜金額・消費税額を逆算する（標準税率10%）', () => {
    expect(
      calculateTax({
        amount: 1100,
        taxRatePercent: 10,
        priceIncludesTax: true,
        rounding: 'floor',
      }),
    ).toEqual({
      taxExcludedAmount: 1000,
      taxAmount: 100,
      taxIncludedAmount: 1100,
    });
  });

  it('軽減税率8%でも計算できる', () => {
    expect(
      calculateTax({
        amount: 1000,
        taxRatePercent: 8,
        priceIncludesTax: false,
        rounding: 'floor',
      }),
    ).toEqual({
      taxExcludedAmount: 1000,
      taxAmount: 80,
      taxIncludedAmount: 1080,
    });
  });

  it('端数処理: 切り捨て', () => {
    // 100円の10%は10円だが、税抜金額が割り切れないケースで確認する
    expect(
      calculateTax({
        amount: 999,
        taxRatePercent: 10,
        priceIncludesTax: false,
        rounding: 'floor',
      })?.taxAmount,
    ).toBe(99); // 999 * 0.1 = 99.9 -> 99
  });

  it('端数処理: 四捨五入', () => {
    expect(
      calculateTax({
        amount: 999,
        taxRatePercent: 10,
        priceIncludesTax: false,
        rounding: 'round',
      })?.taxAmount,
    ).toBe(100); // 999 * 0.1 = 99.9 -> 100
  });

  it('端数処理: 切り上げ', () => {
    expect(
      calculateTax({
        amount: 991,
        taxRatePercent: 10,
        priceIncludesTax: false,
        rounding: 'ceil',
      })?.taxAmount,
    ).toBe(100); // 991 * 0.1 = 99.1 -> 100
  });

  it('税込金額からの逆算でも端数処理が消費税額に適用される', () => {
    // 999 * 10 / 110 = 90.81... -> floorなら消費税額90、税抜は差分の909
    const result = calculateTax({
      amount: 999,
      taxRatePercent: 10,
      priceIncludesTax: true,
      rounding: 'floor',
    });
    expect(result).toEqual({
      taxExcludedAmount: 909,
      taxAmount: 90,
      taxIncludedAmount: 999,
    });
  });

  it('金額が0でも計算できる', () => {
    expect(
      calculateTax({
        amount: 0,
        taxRatePercent: 10,
        priceIncludesTax: false,
        rounding: 'floor',
      }),
    ).toEqual({ taxExcludedAmount: 0, taxAmount: 0, taxIncludedAmount: 0 });
  });

  it('金額が負またはNaNならnull', () => {
    expect(
      calculateTax({
        amount: -100,
        taxRatePercent: 10,
        priceIncludesTax: false,
        rounding: 'floor',
      }),
    ).toBeNull();
    expect(
      calculateTax({
        amount: NaN,
        taxRatePercent: 10,
        priceIncludesTax: false,
        rounding: 'floor',
      }),
    ).toBeNull();
  });

  it('税率が負またはNaNならnull', () => {
    expect(
      calculateTax({
        amount: 1000,
        taxRatePercent: -1,
        priceIncludesTax: false,
        rounding: 'floor',
      }),
    ).toBeNull();
    expect(
      calculateTax({
        amount: 1000,
        taxRatePercent: NaN,
        priceIncludesTax: false,
        rounding: 'floor',
      }),
    ).toBeNull();
  });

  it('カスタム税率（例: 5%の旧税率）でも計算できる', () => {
    expect(
      calculateTax({
        amount: 1000,
        taxRatePercent: 5,
        priceIncludesTax: false,
        rounding: 'floor',
      }),
    ).toEqual({
      taxExcludedAmount: 1000,
      taxAmount: 50,
      taxIncludedAmount: 1050,
    });
  });

  it('小数を含むカスタム税率（例: 5.5%）でも計算できる', () => {
    expect(
      calculateTax({
        amount: 1000,
        taxRatePercent: 5.5,
        priceIncludesTax: false,
        rounding: 'floor',
      }),
    ).toEqual({
      taxExcludedAmount: 1000,
      taxAmount: 55,
      taxIncludedAmount: 1055,
    });
  });

  it('税率が0%なら消費税額は0円', () => {
    expect(
      calculateTax({
        amount: 1000,
        taxRatePercent: 0,
        priceIncludesTax: false,
        rounding: 'floor',
      }),
    ).toEqual({
      taxExcludedAmount: 1000,
      taxAmount: 0,
      taxIncludedAmount: 1000,
    });
  });

  it('税込金額からの逆算で端数処理が四捨五入の場合も正しく計算される', () => {
    // 999 / 1.1 = 908.1818... -> roundなら908、消費税額は差分の91
    expect(
      calculateTax({
        amount: 999,
        taxRatePercent: 10,
        priceIncludesTax: true,
        rounding: 'round',
      }),
    ).toEqual({
      taxExcludedAmount: 908,
      taxAmount: 91,
      taxIncludedAmount: 999,
    });
  });

  it('税込金額からの逆算で端数処理が切り上げの場合も正しく計算される', () => {
    // 999 * 10 / 110 = 90.81... -> ceilなら消費税額91、税抜は差分の908
    expect(
      calculateTax({
        amount: 999,
        taxRatePercent: 10,
        priceIncludesTax: true,
        rounding: 'ceil',
      }),
    ).toEqual({
      taxExcludedAmount: 908,
      taxAmount: 91,
      taxIncludedAmount: 999,
    });
  });
});

describe('calculateDiscount', () => {
  it('パーセント指定で割引額・割引後価格を計算する', () => {
    expect(
      calculateDiscount({
        originalPrice: 1000,
        discountType: 'percent',
        discountValue: 20,
        rounding: 'floor',
      }),
    ).toEqual({
      discountAmount: 200,
      discountedPrice: 800,
      discountRatePercent: 20,
    });
  });

  it('金額指定で割引後価格を計算する', () => {
    expect(
      calculateDiscount({
        originalPrice: 1000,
        discountType: 'amount',
        discountValue: 300,
        rounding: 'floor',
      }),
    ).toEqual({
      discountAmount: 300,
      discountedPrice: 700,
      discountRatePercent: 30,
    });
  });

  it('パーセント指定で割り切れない場合は端数処理が適用される', () => {
    const result = calculateDiscount({
      originalPrice: 999,
      discountType: 'percent',
      discountValue: 10,
      rounding: 'floor',
    });
    expect(result?.discountAmount).toBe(99); // 999 * 0.1 = 99.9 -> 99
    expect(result?.discountedPrice).toBe(900);
  });

  it('割引率0%・割引額0円でも計算できる（割引後価格は元の価格と同じ）', () => {
    expect(
      calculateDiscount({
        originalPrice: 1000,
        discountType: 'percent',
        discountValue: 0,
        rounding: 'floor',
      }),
    ).toEqual({
      discountAmount: 0,
      discountedPrice: 1000,
      discountRatePercent: 0,
    });
  });

  it('割引率100%なら割引後価格は0円', () => {
    expect(
      calculateDiscount({
        originalPrice: 1000,
        discountType: 'percent',
        discountValue: 100,
        rounding: 'floor',
      }),
    ).toEqual({
      discountAmount: 1000,
      discountedPrice: 0,
      discountRatePercent: 100,
    });
  });

  it('元の価格が0以下ならnull', () => {
    expect(
      calculateDiscount({
        originalPrice: 0,
        discountType: 'percent',
        discountValue: 10,
        rounding: 'floor',
      }),
    ).toBeNull();
    expect(
      calculateDiscount({
        originalPrice: -1000,
        discountType: 'percent',
        discountValue: 10,
        rounding: 'floor',
      }),
    ).toBeNull();
  });

  it('割引値が負ならnull', () => {
    expect(
      calculateDiscount({
        originalPrice: 1000,
        discountType: 'percent',
        discountValue: -10,
        rounding: 'floor',
      }),
    ).toBeNull();
  });

  it('割引率が100%を超えるならnull', () => {
    expect(
      calculateDiscount({
        originalPrice: 1000,
        discountType: 'percent',
        discountValue: 101,
        rounding: 'floor',
      }),
    ).toBeNull();
  });

  it('割引額が元の価格を超えるならnull', () => {
    expect(
      calculateDiscount({
        originalPrice: 1000,
        discountType: 'amount',
        discountValue: 1001,
        rounding: 'floor',
      }),
    ).toBeNull();
  });

  it('割引率0%〜100%の端数処理: 四捨五入', () => {
    expect(
      calculateDiscount({
        originalPrice: 999,
        discountType: 'percent',
        discountValue: 10,
        rounding: 'round',
      })?.discountAmount,
    ).toBe(100); // 999 * 0.1 = 99.9 -> 100
  });

  it('割引率0%〜100%の端数処理: 切り上げ', () => {
    expect(
      calculateDiscount({
        originalPrice: 991,
        discountType: 'percent',
        discountValue: 10,
        rounding: 'ceil',
      })?.discountAmount,
    ).toBe(100); // 991 * 0.1 = 99.1 -> 100
  });

  it('割引額指定で割引額が元の価格と等しい場合は割引後価格が0円になる（境界値）', () => {
    expect(
      calculateDiscount({
        originalPrice: 1000,
        discountType: 'amount',
        discountValue: 1000,
        rounding: 'floor',
      }),
    ).toEqual({
      discountAmount: 1000,
      discountedPrice: 0,
      discountRatePercent: 100,
    });
  });

  it('割引額指定では端数処理オプションの値に関わらず割引額はそのまま使われる', () => {
    const inputs = ['floor', 'round', 'ceil'] as const;
    for (const rounding of inputs) {
      expect(
        calculateDiscount({
          originalPrice: 999,
          discountType: 'amount',
          discountValue: 300,
          rounding,
        }),
      ).toEqual({
        discountAmount: 300,
        discountedPrice: 699,
        discountRatePercent: (300 / 999) * 100,
      });
    }
  });

  it('元の価格または割引値がNaNならnull（無効な入力の防御）', () => {
    expect(
      calculateDiscount({
        originalPrice: NaN,
        discountType: 'percent',
        discountValue: 10,
        rounding: 'floor',
      }),
    ).toBeNull();
    expect(
      calculateDiscount({
        originalPrice: 1000,
        discountType: 'percent',
        discountValue: NaN,
        rounding: 'floor',
      }),
    ).toBeNull();
  });
});
