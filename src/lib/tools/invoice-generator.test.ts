import { describe, expect, it } from 'vitest';
import {
  calculateInvoice,
  isValidRegistrationNumber,
  normalizeRegistrationNumber,
  type InvoiceInput,
  type InvoiceItemInput,
} from './invoice-generator';

function item(
  unitPrice: number,
  taxRate: 10 | 8 | 0 = 10,
  quantity = 1,
): InvoiceItemInput {
  return { name: 'x', quantity, unitPrice, taxRate };
}

function calc(
  overrides: Partial<InvoiceInput> & { items: InvoiceItemInput[] },
) {
  return calculateInvoice({
    priceIncludesTax: false,
    rounding: 'floor',
    ...overrides,
  });
}

describe('calculateInvoice', () => {
  it('税抜単価から税率ごとの課税対象額・消費税額・合計を求める', () => {
    const r = calc({ items: [item(1000, 10, 3), item(500, 8, 2)] });
    expect(r.ok).toBe(true);
    if (!r.ok) return;
    expect(r.result.groups).toEqual([
      {
        taxRate: 10,
        taxableAmount: 3000,
        taxAmount: 300,
        includedAmount: 3300,
      },
      { taxRate: 8, taxableAmount: 1000, taxAmount: 80, includedAmount: 1080 },
    ]);
    expect(r.result.subtotal).toBe(4000);
    expect(r.result.taxAmount).toBe(380);
    expect(r.result.total).toBe(4380);
  });

  it('消費税額は明細ごとではなく税率ごとの合計に対して1回だけ端数処理する', () => {
    // 各行の税額は 9.9 → 切り捨てで9円ずつ（合計27円）だが、合計99×3=297円の10%は29円
    const r = calc({ items: [item(99), item(99), item(99)] });
    expect(r.ok && r.result.taxAmount).toBe(29);
  });

  it('端数処理の方式（切り捨て・四捨五入・切り上げ）を切り替えられる', () => {
    const items = [item(105)];
    const floor = calc({ items, rounding: 'floor' });
    const round = calc({ items, rounding: 'round' });
    const ceil = calc({ items, rounding: 'ceil' });
    expect(floor.ok && floor.result.taxAmount).toBe(10);
    expect(round.ok && round.result.taxAmount).toBe(11);
    expect(ceil.ok && ceil.result.taxAmount).toBe(11);
  });

  it('税込単価の場合は税込合計から消費税額を逆算し、課税対象額は差分で求める', () => {
    const r = calc({
      items: [item(1100, 10), item(108, 8)],
      priceIncludesTax: true,
    });
    expect(r.ok).toBe(true);
    if (!r.ok) return;
    expect(r.result.groups).toEqual([
      {
        taxRate: 10,
        taxableAmount: 1000,
        taxAmount: 100,
        includedAmount: 1100,
      },
      { taxRate: 8, taxableAmount: 100, taxAmount: 8, includedAmount: 108 },
    ]);
    expect(r.result.total).toBe(1208);
  });

  it('非課税（0%）は税額0で、集計の最後に並ぶ', () => {
    const r = calc({ items: [item(300, 0), item(1000, 10)] });
    expect(r.ok).toBe(true);
    if (!r.ok) return;
    expect(r.result.groups.map((g) => g.taxRate)).toEqual([10, 0]);
    expect(r.result.groups[1]).toEqual({
      taxRate: 0,
      taxableAmount: 300,
      taxAmount: 0,
      includedAmount: 300,
    });
  });

  it('小数の数量は明細金額を端数処理する', () => {
    const r = calc({ items: [item(333, 10, 1.5)], rounding: 'floor' });
    expect(r.ok && r.result.lines[0].amount).toBe(499);
  });

  it('値引き行（負の単価）は絶対値で端数処理され、合計から差し引かれる', () => {
    const r = calc({ items: [item(1000), item(-105)], rounding: 'floor' });
    expect(r.ok).toBe(true);
    if (!r.ok) return;
    // 課税対象額 895、税額 floor(89.5)=89
    expect(r.result.groups[0]).toEqual({
      taxRate: 10,
      taxableAmount: 895,
      taxAmount: 89,
      includedAmount: 984,
    });
    const negative = calc({ items: [item(-105)], rounding: 'floor' });
    // 負でも対称に切り捨て: -10.5 → -10
    expect(negative.ok && negative.result.taxAmount).toBe(-10);
  });

  it('浮動小数点の誤差があっても税額がずれない', () => {
    const r = calc({ items: [item(1100)], priceIncludesTax: true });
    expect(r.ok && r.result.taxAmount).toBe(100);
  });

  it('明細が空・多すぎる・不正・大きすぎる場合はエラーを返す', () => {
    expect(calc({ items: [] })).toEqual({
      ok: false,
      error: { kind: 'no-items' },
    });
    expect(calc({ items: Array.from({ length: 51 }, () => item(1)) })).toEqual({
      ok: false,
      error: { kind: 'too-many-items' },
    });
    expect(calc({ items: [item(1), item(NaN)] })).toEqual({
      ok: false,
      error: { kind: 'invalid-item', index: 1 },
    });
    expect(calc({ items: [item(1, 10, -1)] })).toEqual({
      ok: false,
      error: { kind: 'invalid-item', index: 0 },
    });
    expect(calc({ items: [item(Infinity)] })).toEqual({
      ok: false,
      error: { kind: 'invalid-item', index: 0 },
    });
    expect(calc({ items: [item(1e10, 10, 2)] })).toEqual({
      ok: false,
      error: { kind: 'too-large' },
    });
  });
});

describe('calculateInvoice の境界値・追加ケース', () => {
  it('明細は上限の50行まで受け付け、51行目でエラーになる', () => {
    const fifty = Array.from({ length: 50 }, () => item(1));
    const r = calc({ items: fifty });
    expect(r.ok && r.result.total).toBe(55);
    expect(r.ok && r.result.lines.length).toBe(50);
  });

  it('金額の上限（1e10円）ちょうどは通り、1円でも超えると too-large になる', () => {
    const atLimit = calc({ items: [item(1e10, 0)] });
    expect(atLimit.ok && atLimit.result.total).toBe(1e10);
    expect(calc({ items: [item(1e10 + 1, 0)] })).toEqual({
      ok: false,
      error: { kind: 'too-large' },
    });
  });

  it('個々の行は上限内でも、税率ごとの合計が上限を超えると too-large になる', () => {
    expect(calc({ items: [item(4e9, 0), item(4e9, 0), item(4e9, 0)] })).toEqual(
      { ok: false, error: { kind: 'too-large' } },
    );
  });

  it('税込単価の端数処理（切り捨て・四捨五入・切り上げ）が税額に反映される', () => {
    // 1005円（税込）の消費税 = 1005×10/110 = 91.36…
    const items = [item(1005)];
    const floor = calc({ items, priceIncludesTax: true, rounding: 'floor' });
    const round = calc({ items, priceIncludesTax: true, rounding: 'round' });
    const ceil = calc({ items, priceIncludesTax: true, rounding: 'ceil' });
    expect(floor.ok && floor.result.taxAmount).toBe(91);
    expect(round.ok && round.result.taxAmount).toBe(91);
    expect(ceil.ok && ceil.result.taxAmount).toBe(92);
    expect(floor.ok && floor.result.groups[0].taxableAmount).toBe(914);
  });

  it('税込で非課税（0%）のみの場合は税額0・課税対象額は税込額と同じ', () => {
    const r = calc({ items: [item(500, 0)], priceIncludesTax: true });
    expect(r.ok).toBe(true);
    if (!r.ok) return;
    expect(r.result.groups).toEqual([
      { taxRate: 0, taxableAmount: 500, taxAmount: 0, includedAmount: 500 },
    ]);
    expect(r.result.total).toBe(500);
  });

  it('浮動小数点の誤差がある単価でも、四捨五入の境界が正しく判定される', () => {
    // 1.005 × 100 = 100.49999999999999（誤差）→ 正しくは 100.5 → 四捨五入で101
    const r = calc({ items: [item(1.005, 10, 100)], rounding: 'round' });
    expect(r.ok && r.result.lines[0].amount).toBe(101);
  });

  it('マイナス単価の行（返品・取消）は符号付きの税額と合計になる', () => {
    const r = calc({ items: [item(-1000, 10)], rounding: 'floor' });
    expect(r.ok).toBe(true);
    if (!r.ok) return;
    expect(r.result.groups[0]).toEqual({
      taxRate: 10,
      taxableAmount: -1000,
      taxAmount: -100,
      includedAmount: -1100,
    });
    expect(r.result.total).toBe(-1100);
  });

  it('品名が空の行も金額計算に含まれる（品名は必須にしない）', () => {
    const r = calc({
      items: [{ name: '', quantity: 1, unitPrice: 100, taxRate: 10 }],
    });
    expect(r.ok && r.result.total).toBe(110);
  });

  it('数量NaN・税率不正（10/8/0以外）はその行を invalid-item として返す', () => {
    expect(calc({ items: [item(100, 10, NaN)] })).toEqual({
      ok: false,
      error: { kind: 'invalid-item', index: 0 },
    });
    expect(
      calc({
        items: [
          item(100),
          { name: 'x', quantity: 1, unitPrice: 100, taxRate: 5 as never },
        ],
      }),
    ).toEqual({ ok: false, error: { kind: 'invalid-item', index: 1 } });
  });
});

describe('登録番号', () => {
  it('ハイフンの種類や全角スペースを取り除いて判定する', () => {
    expect(normalizeRegistrationNumber('T-1234–5678—9012　3')).toBe(
      'T1234567890123',
    );
    expect(isValidRegistrationNumber('T-1234-5678-9012-3')).toBe(true);
  });

  it('全角・ハイフン・小文字を正規化する', () => {
    expect(normalizeRegistrationNumber(' t-１２３４５６７８９０１２３ ')).toBe(
      'T1234567890123',
    );
  });

  it('T＋13桁の形式だけを有効とし、空欄は未入力として許す', () => {
    expect(isValidRegistrationNumber('T1234567890123')).toBe(true);
    expect(isValidRegistrationNumber('t1234567890123')).toBe(true);
    expect(isValidRegistrationNumber('')).toBe(true);
    expect(isValidRegistrationNumber('1234567890123')).toBe(false);
    expect(isValidRegistrationNumber('T123456789012')).toBe(false);
    expect(isValidRegistrationNumber('T12345678901234')).toBe(false);
    expect(isValidRegistrationNumber('T123456789012A')).toBe(false);
  });
});
