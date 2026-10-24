import { describe, expect, it } from 'vitest';
import {
  DOC_TYPE_IDS,
  RELIEF_DEADLINE,
  calculateStampDuty,
  getDocTypeTraits,
  isDocTypeId,
  type DocTypeId,
  type StampDutyInput,
} from './stamp-duty-calculator';

function tax(input: StampDutyInput): number {
  const r = calculateStampDuty(input);
  if (r === null) throw new Error('null result');
  return r.tax;
}

function check(docType: DocTypeId, cases: [number, number][], extra = {}) {
  for (const [amount, expected] of cases) {
    expect(tax({ docType, amount, ...extra }), `${docType} ${amount}`).toBe(
      expected,
    );
  }
}

describe('第1号文書', () => {
  it('境界値（超/以下）', () => {
    check('no1-other', [
      [0, 0],
      [9_999, 0],
      [10_000, 200],
      [100_000, 200],
      [100_001, 400],
      [500_000, 400],
      [500_001, 1_000],
      [1_000_000, 1_000],
      [1_000_001, 2_000],
      [5_000_000, 2_000],
      [5_000_001, 10_000],
      [10_000_000, 10_000],
      [10_000_001, 20_000],
      [50_000_000, 20_000],
      [50_000_001, 60_000],
      [100_000_000, 60_000],
      [100_000_001, 100_000],
      [500_000_000, 100_000],
      [500_000_001, 200_000],
      [1_000_000_000, 200_000],
      [1_000_000_001, 400_000],
      [5_000_000_000, 400_000],
      [5_000_000_001, 600_000],
    ]);
  });
  it('記載なしは200円', () => {
    expect(tax({ docType: 'no1-other', amount: null, noAmount: true })).toBe(
      200,
    );
  });
});

describe('第2号文書', () => {
  it('境界値。100万円ちょうどは200円', () => {
    check('no2-other', [
      [9_999, 0],
      [10_000, 200],
      [1_000_000, 200],
      [1_000_001, 400],
      [2_000_000, 400],
      [2_000_001, 1_000],
      [3_000_000, 1_000],
      [3_000_001, 2_000],
      [5_000_000, 2_000],
      [5_000_001, 10_000],
      [10_000_000, 10_000],
      [10_000_001, 20_000],
      [50_000_001, 60_000],
      [100_000_001, 100_000],
      [500_000_001, 200_000],
      [1_000_000_001, 400_000],
      [5_000_000_001, 600_000],
    ]);
  });
  it('記載なしは200円', () => {
    expect(
      tax({ docType: 'no2-construction', amount: null, noAmount: true }),
    ).toBe(200);
  });
});

describe('軽減措置', () => {
  it('不動産譲渡契約書', () => {
    check(
      'no1-real-estate',
      [
        [9_999, 0],
        [10_000, 200],
        [100_000, 200],
        [100_001, 200],
        [500_000, 200],
        [500_001, 500],
        [1_000_000, 500],
        [1_000_001, 1_000],
        [5_000_000, 1_000],
        [5_000_001, 5_000],
        [10_000_000, 5_000],
        [10_000_001, 10_000],
        [50_000_000, 10_000],
        [50_000_001, 30_000],
        [100_000_000, 30_000],
        [100_000_001, 60_000],
        [500_000_000, 60_000],
        [500_000_001, 160_000],
        [1_000_000_000, 160_000],
        [1_000_000_001, 320_000],
        [5_000_000_000, 320_000],
        [5_000_000_001, 480_000],
      ],
      { relief: true },
    );
  });
  it('建設工事請負契約書', () => {
    check(
      'no2-construction',
      [
        [1_000_000, 200],
        [1_000_001, 200],
        [2_000_000, 200],
        [2_000_001, 500],
        [3_000_000, 500],
        [3_000_001, 1_000],
        [5_000_000, 1_000],
        [5_000_001, 5_000],
        [10_000_000, 5_000],
        [10_000_001, 10_000],
        [50_000_001, 30_000],
        [100_000_001, 60_000],
        [500_000_001, 160_000],
        [1_000_000_001, 320_000],
        [5_000_000_001, 480_000],
      ],
      { relief: true },
    );
  });
  it('結果に本則の税額と適用有無が入る', () => {
    const r = calculateStampDuty({
      docType: 'no1-real-estate',
      amount: 10_000_000,
      relief: true,
      createdOn: RELIEF_DEADLINE,
    });
    expect(r).toMatchObject({
      tax: 5_000,
      normalTax: 10_000,
      reliefApplied: true,
      reliefExpired: false,
    });
  });
  it('期限の翌日以降は軽減しない', () => {
    const r = calculateStampDuty({
      docType: 'no1-real-estate',
      amount: 10_000_000,
      relief: true,
      createdOn: '2027-04-01',
    });
    expect(r).toMatchObject({
      tax: 10_000,
      reliefApplied: false,
      reliefExpired: true,
    });
  });
  it('対象外の文書やチェックなしでは軽減しない', () => {
    expect(
      tax({ docType: 'no1-other', amount: 10_000_000, relief: true }),
    ).toBe(10_000);
    expect(tax({ docType: 'no1-real-estate', amount: 10_000_000 })).toBe(
      10_000,
    );
  });
  it('記載なしは軽減有無にかかわらず200円', () => {
    expect(
      tax({
        docType: 'no1-real-estate',
        amount: null,
        noAmount: true,
        relief: true,
      }),
    ).toBe(200);
  });
});

describe('第3号文書（手形）', () => {
  it('境界値', () => {
    check('no3', [
      [99_999, 0],
      [100_000, 200],
      [1_000_000, 200],
      [1_000_001, 400],
      [2_000_000, 400],
      [2_000_001, 600],
      [3_000_000, 600],
      [3_000_001, 1_000],
      [5_000_000, 1_000],
      [5_000_001, 2_000],
      [10_000_000, 2_000],
      [10_000_001, 4_000],
      [20_000_000, 4_000],
      [20_000_001, 6_000],
      [30_000_000, 6_000],
      [30_000_001, 10_000],
      [50_000_000, 10_000],
      [50_000_001, 20_000],
      [100_000_000, 20_000],
      [100_000_001, 40_000],
      [200_000_000, 40_000],
      [200_000_001, 60_000],
      [300_000_000, 60_000],
      [300_000_001, 100_000],
      [500_000_000, 100_000],
      [500_000_001, 150_000],
      [1_000_000_000, 150_000],
      [1_000_000_001, 200_000],
    ]);
  });
  it('一覧払等は10万円以上で一律200円、未満は非課税', () => {
    check(
      'no3',
      [
        [99_999, 0],
        [100_000, 200],
        [500_000_000, 200],
      ],
      { demandPayment: true },
    );
  });
});

describe('第4号文書（株券等）', () => {
  it('境界値', () => {
    check('no4', [
      [5_000_000, 200],
      [5_000_001, 1_000],
      [10_000_000, 1_000],
      [10_000_001, 2_000],
      [50_000_000, 2_000],
      [50_000_001, 10_000],
      [100_000_000, 10_000],
      [100_000_001, 20_000],
    ]);
  });
});

describe('第15号・第16号文書', () => {
  it('第15号: 1万円未満は非課税、以上と記載なしは200円', () => {
    check('no15', [
      [9_999, 0],
      [10_000, 200],
      [1_000_000_000, 200],
    ]);
    expect(tax({ docType: 'no15', amount: null, noAmount: true })).toBe(200);
  });
  it('第16号: 3千円未満は非課税', () => {
    check('no16', [
      [2_999, 0],
      [3_000, 200],
    ]);
  });
});

describe('第17号文書（受取書）', () => {
  it('売上代金の境界値', () => {
    check('no17-sales', [
      [49_999, 0],
      [50_000, 200],
      [1_000_000, 200],
      [1_000_001, 400],
      [2_000_001, 600],
      [3_000_001, 1_000],
      [5_000_001, 2_000],
      [10_000_001, 4_000],
      [20_000_001, 6_000],
      [30_000_001, 10_000],
      [50_000_001, 20_000],
      [100_000_001, 40_000],
      [200_000_001, 60_000],
      [300_000_001, 100_000],
      [500_000_001, 150_000],
      [1_000_000_001, 200_000],
    ]);
  });
  it('売上代金の記載なしは200円', () => {
    expect(tax({ docType: 'no17-sales', amount: null, noAmount: true })).toBe(
      200,
    );
  });
  it('売上代金以外は5万円未満が非課税、以上は一律200円', () => {
    check('no17-other', [
      [49_999, 0],
      [50_000, 200],
      [1_000_000_000, 200],
    ]);
  });
});

describe('定額の文書', () => {
  it('金額に関係なく決まった税額', () => {
    const expected: [DocTypeId, number][] = [
      ['no5', 40_000],
      ['no6', 40_000],
      ['no7', 4_000],
      ['no8', 200],
      ['no9', 200],
      ['no10', 200],
      ['no11', 200],
      ['no12', 200],
      ['no13', 200],
      ['no14', 200],
      ['no18', 200],
      ['no19', 400],
      ['no20', 4_000],
    ];
    for (const [docType, t] of expected) {
      expect(tax({ docType, amount: null }), docType).toBe(t);
      expect(calculateStampDuty({ docType, amount: null })?.basis).toBe(
        'fixed',
      );
    }
  });
});

describe('入力の検証と結果の種別', () => {
  it('金額が必要な文書で金額がなければ null', () => {
    expect(
      calculateStampDuty({ docType: 'no2-other', amount: null }),
    ).toBeNull();
    expect(calculateStampDuty({ docType: 'no3', amount: NaN })).toBeNull();
    expect(calculateStampDuty({ docType: 'no4', amount: -1 })).toBeNull();
    expect(calculateStampDuty({ docType: 'no4', amount: Infinity })).toBeNull();
  });
  it('記載なしを選べない文書では noAmount を無視する', () => {
    expect(
      calculateStampDuty({ docType: 'no4', amount: null, noAmount: true }),
    ).toBeNull();
  });
  it('小数は切り捨てる', () => {
    expect(tax({ docType: 'no1-other', amount: 9_999.9 })).toBe(0);
    expect(tax({ docType: 'no1-other', amount: 10_000.5 })).toBe(200);
  });
  it('basis が正しい', () => {
    expect(
      calculateStampDuty({ docType: 'no1-other', amount: 5_000 })?.basis,
    ).toBe('nonTaxable');
    expect(
      calculateStampDuty({ docType: 'no1-other', amount: 50_000 })?.basis,
    ).toBe('bracket');
    expect(
      calculateStampDuty({ docType: 'no1-other', amount: null, noAmount: true })
        ?.basis,
    ).toBe('noAmount');
    expect(
      calculateStampDuty({
        docType: 'no3',
        amount: 200_000,
        demandPayment: true,
      })?.basis,
    ).toBe('demandBill');
  });
  it('文書の種類の判定と特性', () => {
    expect(isDocTypeId('no5')).toBe(true);
    expect(isDocTypeId('no99')).toBe(false);
    expect(DOC_TYPE_IDS).toHaveLength(23);
    expect(getDocTypeTraits('no5').needsAmount).toBe(false);
    expect(getDocTypeTraits('no3').allowsDemandPayment).toBe(true);
    expect(getDocTypeTraits('no2-construction').reliefEligible).toBe(true);
    expect(getDocTypeTraits('no2-other').reliefEligible).toBe(false);
    expect(getDocTypeTraits('no17-sales').allowsNoAmount).toBe(true);
  });
});
