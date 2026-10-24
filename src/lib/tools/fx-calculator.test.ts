import { describe, expect, it } from 'vitest';
import {
  PAIRS,
  calculateFx,
  pipSizeOf,
  quoteCurrency,
  type FxInput,
  type FxResult,
} from './fx-calculator';

const base: FxInput = {
  pair: 'USD/JPY',
  lots: 1,
  lotSize: 100000,
  leverage: 25,
  direction: 'buy',
  entry: 150,
  exit: 150.5,
  quoteJpyRate: 0,
};

function calc(over: Partial<FxInput> = {}): FxResult {
  const r = calculateFx({ ...base, ...over });
  if (!r.ok) throw new Error(`error: ${r.field}`);
  return r.result;
}

describe('pair helpers', () => {
  it('クォート通貨とpipの大きさ', () => {
    expect(quoteCurrency('EUR/USD')).toBe('USD');
    expect(pipSizeOf('USD/JPY')).toBe(0.01);
    expect(pipSizeOf('EUR/USD')).toBe(0.0001);
    expect(PAIRS.length).toBeGreaterThan(10);
  });
});

describe('calculateFx: 円ペア', () => {
  it('買いで利益が出る', () => {
    const r = calc();
    expect(r.pips).toBe(50);
    expect(r.profitJpy).toBe(50000);
    expect(r.pipValueJpy).toBe(1000);
    expect(r.marginJpy).toBe(600000);
    expect(r.notionalJpy).toBe(15000000);
    expect(r.units).toBe(100000);
  });

  it('売りは方向が逆になる', () => {
    expect(calc({ direction: 'sell' }).pips).toBe(-50);
    expect(calc({ direction: 'sell' }).profitJpy).toBe(-50000);
    expect(calc({ direction: 'sell', exit: 149 }).profitJpy).toBe(100000);
  });

  it('1万通貨ロットと小数ロット', () => {
    const r = calc({ lotSize: 10000, lots: 2.5 });
    expect(r.units).toBe(25000);
    expect(r.profitJpy).toBe(12500);
  });

  it('浮動小数誤差が出ない（0.1刻み・0.001刻み）', () => {
    const r = calc({ entry: 150.1, exit: 150.3 });
    expect(r.pips).toBe(20);
    expect(r.profitJpy).toBe(20000);
    const s = calc({ entry: 110.123, exit: 110.124, lots: 0.01 });
    expect(s.pips).toBe(0.1);
    expect(s.units).toBe(1000);
    expect(s.profitJpy).toBe(1);
  });

  it('同値は0で、-0にならない', () => {
    const r = calc({ exit: 150 });
    expect(r.pips).toBe(0);
    expect(Object.is(r.profitJpy, 0)).toBe(true);
  });

  it('必要証拠金は1円未満切り上げ', () => {
    // 1000通貨 x 150.003 / 25 = 6000.12
    const r = calc({ lots: 0.01, entry: 150.003, exit: 150.003 });
    expect(r.marginJpy).toBe(6001);
  });

  it('レバレッジ1倍・100倍', () => {
    expect(calc({ leverage: 1 }).marginJpy).toBe(15000000);
    expect(calc({ leverage: 100 }).marginJpy).toBe(150000);
  });
});

describe('calculateFx: 円以外のクォート通貨', () => {
  const eurusd: Partial<FxInput> = {
    pair: 'EUR/USD',
    lots: 1,
    lotSize: 10000,
    entry: 1.1,
    exit: 1.105,
    quoteJpyRate: 150,
  };

  it('pipsと円換算の損益・証拠金', () => {
    const r = calc(eurusd);
    expect(r.pips).toBe(50);
    expect(r.profitQuote).toBe(50);
    expect(r.profitJpy).toBe(7500);
    expect(r.pipValueJpy).toBeCloseTo(150, 9);
    expect(r.marginJpy).toBe(66000);
    expect(r.notionalJpy).toBe(1650000);
  });

  it('損失（売りで上昇）', () => {
    const r = calc({ ...eurusd, direction: 'sell' });
    expect(r.pips).toBe(-50);
    expect(r.profitJpy).toBe(-7500);
  });

  it('5桁目（0.1pip）まで扱える', () => {
    const r = calc({ ...eurusd, entry: 1.10001, exit: 1.10011 });
    expect(r.pips).toBe(1);
  });

  it('クォート円レートが無いとエラー', () => {
    expect(calculateFx({ ...base, ...eurusd, quoteJpyRate: 0 })).toEqual({
      ok: false,
      field: 'quoteRate',
    });
  });

  it('円ペアでは円レートを無視する', () => {
    expect(calc({ quoteJpyRate: 0 }).profitJpy).toBe(50000);
    expect(calc({ quoteJpyRate: 999 }).profitJpy).toBe(50000);
  });
});

describe('calculateFx: 入力検証', () => {
  it('不正な値は該当フィールドを返す', () => {
    expect(calculateFx({ ...base, lots: 0 })).toEqual({
      ok: false,
      field: 'units',
    });
    expect(calculateFx({ ...base, lots: 0.000001 })).toEqual({
      ok: false,
      field: 'units',
    });
    expect(calculateFx({ ...base, lots: NaN })).toEqual({
      ok: false,
      field: 'units',
    });
    expect(calculateFx({ ...base, leverage: 0 })).toEqual({
      ok: false,
      field: 'leverage',
    });
    expect(calculateFx({ ...base, entry: -1 })).toEqual({
      ok: false,
      field: 'entry',
    });
    expect(calculateFx({ ...base, exit: 0 })).toEqual({
      ok: false,
      field: 'exit',
    });
    expect(calculateFx({ ...base, pair: 'XXX/YYY' }).ok).toBe(false);
  });

  it('丸めると0になるレートはエラー', () => {
    expect(calculateFx({ ...base, entry: 0.0001 })).toEqual({
      ok: false,
      field: 'entry',
    });
  });
});
