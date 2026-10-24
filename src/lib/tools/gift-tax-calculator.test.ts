import { describe, expect, it } from 'vitest';
import {
  GENERAL_BRACKETS,
  SPECIAL_BRACKETS,
  apportion,
  calculateGiftTax,
  findBracketIndex,
  taxByBrackets,
} from './gift-tax-calculator';

describe('速算表の境界', () => {
  it('特例税率: 各上限ちょうどは下の行、1円超えは次の行', () => {
    expect(findBracketIndex(SPECIAL_BRACKETS, 2_000_000)).toBe(0);
    expect(findBracketIndex(SPECIAL_BRACKETS, 2_000_001)).toBe(1);
    expect(findBracketIndex(SPECIAL_BRACKETS, 4_000_000)).toBe(1);
    expect(findBracketIndex(SPECIAL_BRACKETS, 45_000_000)).toBe(6);
    expect(findBracketIndex(SPECIAL_BRACKETS, 45_000_001)).toBe(7);
  });

  it('一般税率: 3,000万円ちょうどは50%、超えると55%', () => {
    expect(findBracketIndex(GENERAL_BRACKETS, 30_000_000)).toBe(6);
    expect(findBracketIndex(GENERAL_BRACKETS, 30_001_000)).toBe(7);
  });

  it('境界で税額が連続する（上限ちょうどの両税率）', () => {
    // 特例: 400万円 = 15% - 10万 = 50万 / 次の行 20% - 30万 = 50万
    expect(taxByBrackets(SPECIAL_BRACKETS, 4_000_000)).toBe(500_000);
    expect(taxByBrackets(SPECIAL_BRACKETS, 4_001_000)).toBe(500_200);
    // 一般: 200万円 = 10% = 20万、300万円 = 15% - 10万 = 35万
    expect(taxByBrackets(GENERAL_BRACKETS, 2_000_000)).toBe(200_000);
    expect(taxByBrackets(GENERAL_BRACKETS, 3_000_000)).toBe(350_000);
    expect(taxByBrackets(GENERAL_BRACKETS, 30_000_000)).toBe(12_500_000);
    expect(taxByBrackets(GENERAL_BRACKETS, 31_000_000)).toBe(13_050_000);
  });
});

describe('calculateGiftTax', () => {
  it('特例税率のみ: 500万円 → 課税価格390万円・税額48.5万円（国税庁の例）', () => {
    const r = calculateGiftTax({ specialAmount: 5_000_000, generalAmount: 0 })!;
    expect(r.taxablePrice).toBe(3_900_000);
    expect(r.specialBracket?.bracket.ratePercent).toBe(15);
    expect(r.generalBracket).toBeNull();
    expect(r.calculatedTax).toBe(485_000);
    expect(r.payableTax).toBe(485_000);
  });

  it('一般税率のみ: 500万円 → 390万円 × 20% - 25万 = 53万円', () => {
    const r = calculateGiftTax({ specialAmount: 0, generalAmount: 5_000_000 })!;
    expect(r.taxablePrice).toBe(3_900_000);
    expect(r.generalBracket?.bracket.ratePercent).toBe(20);
    expect(r.payableTax).toBe(530_000);
  });

  it('基礎控除以下は税額0円', () => {
    const r = calculateGiftTax({ specialAmount: 1_100_000, generalAmount: 0 })!;
    expect(r.taxablePrice).toBe(0);
    expect(r.payableTax).toBe(0);
    expect(r.specialBracket).toBeNull();
    const r2 = calculateGiftTax({
      specialAmount: 500_000,
      generalAmount: 300_000,
    })!;
    expect(r2.appliedDeduction).toBe(800_000);
    expect(r2.payableTax).toBe(0);
    expect(r2.effectiveRate).toBe(0);
  });

  it('贈与0円は0円で実効税率も0', () => {
    const r = calculateGiftTax({ specialAmount: 0, generalAmount: 0 })!;
    expect(r.payableTax).toBe(0);
    expect(r.effectiveRate).toBe(0);
  });

  it('基礎控除を1円超えても課税価格は1,000円未満切り捨てで0', () => {
    const r = calculateGiftTax({ specialAmount: 1_100_999, generalAmount: 0 })!;
    expect(r.taxablePrice).toBe(0);
    expect(r.payableTax).toBe(0);
    const r2 = calculateGiftTax({
      specialAmount: 1_101_000,
      generalAmount: 0,
    })!;
    expect(r2.taxablePrice).toBe(1_000);
    expect(r2.calculatedTax).toBe(100);
  });

  it('特例と一般の按分: 財産の価額の比で各税率の税額を按分する', () => {
    // 合計800万円、特例500万円・一般300万円、課税価格690万円
    const r = calculateGiftTax({
      specialAmount: 5_000_000,
      generalAmount: 3_000_000,
    })!;
    expect(r.taxablePrice).toBe(6_900_000);
    // 特例全体: 690万 × 30% - 90万 = 117万、一般全体: 690万 × 40% - 125万 = 151万
    expect(r.specialFullTax).toBe(1_170_000);
    expect(r.generalFullTax).toBe(1_510_000);
    expect(r.specialShareTax).toBe(731_250);
    expect(r.generalShareTax).toBe(566_250);
    expect(r.calculatedTax).toBe(1_297_500);
    expect(r.payableTax).toBe(1_297_500);
    expect(r.specialBracket?.index).toBe(3);
    expect(r.generalBracket?.index).toBe(4);
  });

  it('按分で端数が出ると算出税額と納付額（百円未満切捨て）が異なる', () => {
    const r = calculateGiftTax({
      specialAmount: 3_000_000,
      generalAmount: 1_700_000,
    })!;
    expect(r.calculatedTax).toBe(450_851);
    expect(r.payableTax).toBe(450_800);
    expect(r.payableTax).toBe(Math.floor(r.calculatedTax / 100) * 100);
    expect(r.payableTax).toBeLessThanOrEqual(r.calculatedTax);
  });

  it('比較: 特例が有利なとき差が正', () => {
    const r = calculateGiftTax({ specialAmount: 5_000_000, generalAmount: 0 })!;
    expect(r.allSpecialPayable).toBe(485_000);
    expect(r.allGeneralPayable).toBe(530_000);
    expect(r.comparisonDifference).toBe(45_000);
  });

  it('実効税率は贈与額合計に対する納付額の割合', () => {
    const r = calculateGiftTax({ specialAmount: 5_000_000, generalAmount: 0 })!;
    expect(r.effectiveRate).toBeCloseTo(9.7, 5);
  });

  it('不正な入力は null', () => {
    expect(
      calculateGiftTax({ specialAmount: -1, generalAmount: 0 }),
    ).toBeNull();
    expect(
      calculateGiftTax({ specialAmount: NaN, generalAmount: 0 }),
    ).toBeNull();
    expect(
      calculateGiftTax({ specialAmount: 0, generalAmount: Infinity }),
    ).toBeNull();
    expect(
      calculateGiftTax({ specialAmount: 2_000_000_000_000, generalAmount: 0 }),
    ).toBeNull();
  });

  it('非常に大きな額でも按分が安全に計算できる', () => {
    const r = calculateGiftTax({
      specialAmount: 600_000_000_000,
      generalAmount: 400_000_000_000,
    })!;
    expect(Number.isSafeInteger(r.calculatedTax)).toBe(true);
    expect(r.calculatedTax).toBeGreaterThan(0);
  });
});

describe('apportion', () => {
  it('比例配分し1円未満を切り捨てる', () => {
    expect(apportion(1_000, 1, 3)).toBe(333);
    expect(apportion(1_000, 0, 3)).toBe(0);
    expect(apportion(1_000, 3, 3)).toBe(1_000);
  });
});
