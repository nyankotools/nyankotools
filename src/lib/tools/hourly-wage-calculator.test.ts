import { describe, expect, it } from 'vitest';
import { calculateOvertimePay, convertWage } from './hourly-wage-calculator';

describe('convertWage', () => {
  it('時給を基準に日給・月給・年収を換算する', () => {
    expect(
      convertWage({
        amount: 1200,
        unit: 'hourly',
        hoursPerDay: 8,
        daysPerMonth: 20,
      }),
    ).toEqual({ hourly: 1200, daily: 9600, monthly: 192000, annual: 2304000 });
  });

  it('日給を基準に時給・月給・年収を換算する', () => {
    expect(
      convertWage({
        amount: 9600,
        unit: 'daily',
        hoursPerDay: 8,
        daysPerMonth: 20,
      }),
    ).toEqual({ hourly: 1200, daily: 9600, monthly: 192000, annual: 2304000 });
  });

  it('月給を基準に時給・日給・年収を換算する', () => {
    expect(
      convertWage({
        amount: 192000,
        unit: 'monthly',
        hoursPerDay: 8,
        daysPerMonth: 20,
      }),
    ).toEqual({ hourly: 1200, daily: 9600, monthly: 192000, annual: 2304000 });
  });

  it('年収を基準に時給・日給・月給を換算する', () => {
    expect(
      convertWage({
        amount: 2304000,
        unit: 'annual',
        hoursPerDay: 8,
        daysPerMonth: 20,
      }),
    ).toEqual({ hourly: 1200, daily: 9600, monthly: 192000, annual: 2304000 });
  });

  it('金額が0以下ならnull', () => {
    expect(
      convertWage({
        amount: 0,
        unit: 'hourly',
        hoursPerDay: 8,
        daysPerMonth: 20,
      }),
    ).toBeNull();
    expect(
      convertWage({
        amount: -100,
        unit: 'hourly',
        hoursPerDay: 8,
        daysPerMonth: 20,
      }),
    ).toBeNull();
  });

  it('勤務時間・勤務日数が0以下ならnull', () => {
    expect(
      convertWage({
        amount: 1200,
        unit: 'hourly',
        hoursPerDay: 0,
        daysPerMonth: 20,
      }),
    ).toBeNull();
    expect(
      convertWage({
        amount: 1200,
        unit: 'hourly',
        hoursPerDay: 8,
        daysPerMonth: 0,
      }),
    ).toBeNull();
  });

  it('金額・勤務時間・勤務日数がNaNならnull（無効な入力の防御）', () => {
    expect(
      convertWage({
        amount: NaN,
        unit: 'hourly',
        hoursPerDay: 8,
        daysPerMonth: 20,
      }),
    ).toBeNull();
    expect(
      convertWage({
        amount: 1200,
        unit: 'hourly',
        hoursPerDay: NaN,
        daysPerMonth: 20,
      }),
    ).toBeNull();
  });

  it('割り切れない金額でも小数を保った時給・日給・月給・年収を返す（丸めない）', () => {
    // 月給20万円 ÷ (8時間×21日=168時間) は割り切れない
    const result = convertWage({
      amount: 200000,
      unit: 'monthly',
      hoursPerDay: 8,
      daysPerMonth: 21,
    });
    expect(result?.hourly).toBeCloseTo(1190.476190476, 6);
    expect(result?.daily).toBeCloseTo(9523.809523809, 6);
    // hourly→daily→monthlyと乗算を重ねるため、浮動小数点誤差により
    // 入力値200000ぴったりには戻らないことがある（toBeCloseToで許容）
    expect(result?.monthly).toBeCloseTo(200000, 6);
    expect(result?.annual).toBeCloseTo(2400000, 6);
  });

  it('小数の勤務時間・勤務日数（7.5時間、21.5日）でも計算できる', () => {
    const result = convertWage({
      amount: 1200,
      unit: 'hourly',
      hoursPerDay: 7.5,
      daysPerMonth: 21.5,
    });
    expect(result).toEqual({
      hourly: 1200,
      daily: 9000,
      monthly: 193500,
      annual: 2322000,
    });
  });

  it('高額な年収（例: 1億円）でも精度を保って換算できる', () => {
    const result = convertWage({
      amount: 100000000,
      unit: 'annual',
      hoursPerDay: 8,
      daysPerMonth: 20,
    });
    expect(result?.monthly).toBeCloseTo(8333333.333333, 4);
    expect(result?.hourly).toBeCloseTo(52083.333333, 4);
  });
});

describe('calculateOvertimePay', () => {
  it('区分ごとの割増賃金と合計を計算する', () => {
    const result = calculateOvertimePay(1200, [
      { label: '時間外労働', hours: 10, ratePercent: 25 },
      { label: '法定休日労働', hours: 5, ratePercent: 35 },
    ]);
    expect(result).toEqual({
      categories: [
        {
          label: '時間外労働',
          hours: 10,
          ratePercent: 25,
          premiumPay: 3000,
          totalPay: 15000,
        },
        {
          label: '法定休日労働',
          hours: 5,
          ratePercent: 35,
          premiumPay: 2100,
          totalPay: 8100,
        },
      ],
      totalPremiumPay: 5100,
      totalPay: 23100,
    });
  });

  it('時間数が0の区分は0円として扱う', () => {
    const result = calculateOvertimePay(1200, [
      { label: '深夜労働', hours: 0, ratePercent: 25 },
    ]);
    expect(result?.categories[0]).toEqual({
      label: '深夜労働',
      hours: 0,
      ratePercent: 25,
      premiumPay: 0,
      totalPay: 0,
    });
  });

  it('基礎時給が0以下ならnull', () => {
    expect(
      calculateOvertimePay(0, [
        { label: '時間外労働', hours: 10, ratePercent: 25 },
      ]),
    ).toBeNull();
    expect(
      calculateOvertimePay(-1200, [
        { label: '時間外労働', hours: 10, ratePercent: 25 },
      ]),
    ).toBeNull();
  });

  it('基礎時給がNaNならnull（無効な入力の防御）', () => {
    expect(
      calculateOvertimePay(NaN, [
        { label: '時間外労働', hours: 10, ratePercent: 25 },
      ]),
    ).toBeNull();
  });

  it('割増率が小数（12.5%）でも正しく計算する', () => {
    const result = calculateOvertimePay(1000, [
      { label: '時間外労働', hours: 4, ratePercent: 12.5 },
    ]);
    expect(result?.categories[0]).toEqual({
      label: '時間外労働',
      hours: 4,
      ratePercent: 12.5,
      premiumPay: 500,
      totalPay: 4500,
    });
  });

  it('区分の労働時間や割増率がNaNならnull（無効な入力の防御）', () => {
    expect(
      calculateOvertimePay(1200, [
        { label: '時間外労働', hours: NaN, ratePercent: 25 },
      ]),
    ).toBeNull();
    expect(
      calculateOvertimePay(1200, [
        { label: '時間外労働', hours: 10, ratePercent: NaN },
      ]),
    ).toBeNull();
  });

  it('区分の時間や割増率が負ならnull', () => {
    expect(
      calculateOvertimePay(1200, [
        { label: '時間外労働', hours: -1, ratePercent: 25 },
      ]),
    ).toBeNull();
    expect(
      calculateOvertimePay(1200, [
        { label: '時間外労働', hours: 10, ratePercent: -1 },
      ]),
    ).toBeNull();
  });

  it('区分が空配列でも合計0で計算できる', () => {
    expect(calculateOvertimePay(1200, [])).toEqual({
      categories: [],
      totalPremiumPay: 0,
      totalPay: 0,
    });
  });
});
