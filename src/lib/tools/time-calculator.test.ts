import { describe, expect, it } from 'vitest';
import {
  addSubtractTime,
  decimalHoursToMinutes,
  formatDuration,
  hoursMinutesToMinutes,
  minutesToDecimalHours,
  parseDuration,
  parseTime,
  sumWork,
  workedMinutes,
} from './time-calculator';

describe('parseTime', () => {
  it('H:mm / HH:mm を分に変換する', () => {
    expect(parseTime('9:05')).toBe(545);
    expect(parseTime('18:00')).toBe(1080);
    expect(parseTime('24:00')).toBe(1440);
  });
  it('不正な値はnull', () => {
    expect(parseTime('')).toBeNull();
    expect(parseTime('25:00')).toBeNull();
    expect(parseTime('9:60')).toBeNull();
    expect(parseTime('24:01')).toBeNull();
    expect(parseTime('abc')).toBeNull();
  });
});

describe('formatDuration', () => {
  it('h:mm 形式にする', () => {
    expect(formatDuration(0)).toBe('0:00');
    expect(formatDuration(465)).toBe('7:45');
    expect(formatDuration(1500)).toBe('25:00');
    expect(formatDuration(-90)).toBe('-1:30');
  });
});

describe('minutesToDecimalHours', () => {
  it('小数時間に変換する', () => {
    expect(minutesToDecimalHours(465)).toBe(7.75);
    expect(minutesToDecimalHours(20)).toBe(0.33);
    expect(minutesToDecimalHours(20, 4)).toBe(0.3333);
  });
});

describe('workedMinutes', () => {
  it('休憩を引いた実働を返す', () => {
    expect(
      workedMinutes({ start: '9:00', end: '18:00', breakMinutes: 60 }),
    ).toBe(480);
  });
  it('日付をまたぐ勤務は翌日扱い', () => {
    expect(
      workedMinutes({ start: '22:00', end: '6:00', breakMinutes: 60 }),
    ).toBe(420);
  });
  it('開始と終了が同じなら0分', () => {
    expect(workedMinutes({ start: '9:00', end: '9:00', breakMinutes: 0 })).toBe(
      0,
    );
  });
  it('休憩が拘束時間を超える・負数・時刻不正はnull', () => {
    expect(
      workedMinutes({ start: '9:00', end: '10:00', breakMinutes: 90 }),
    ).toBeNull();
    expect(
      workedMinutes({ start: '9:00', end: '10:00', breakMinutes: -1 }),
    ).toBeNull();
    expect(
      workedMinutes({ start: 'x', end: '10:00', breakMinutes: 0 }),
    ).toBeNull();
    expect(
      workedMinutes({ start: '9:00', end: '10:00', breakMinutes: NaN }),
    ).toBeNull();
  });
  it('終了24:00を許容する', () => {
    expect(
      workedMinutes({ start: '18:00', end: '24:00', breakMinutes: 0 }),
    ).toBe(360);
  });
});

describe('sumWork', () => {
  it('合計し、不正行を検出する', () => {
    const ok = sumWork([
      { start: '9:00', end: '18:00', breakMinutes: 60 },
      { start: '9:00', end: '17:30', breakMinutes: 45 },
    ]);
    expect(ok.totalMinutes).toBe(480 + 465);
    expect(ok.hasError).toBe(false);

    const bad = sumWork([
      { start: '9:00', end: '18:00', breakMinutes: 60 },
      { start: '', end: '17:30', breakMinutes: 0 },
    ]);
    expect(bad.hasError).toBe(true);
    expect(bad.perRow[1]).toBeNull();
    expect(bad.totalMinutes).toBe(480);
  });
  it('空配列は0', () => {
    expect(sumWork([])).toEqual({
      perRow: [],
      totalMinutes: 0,
      hasError: false,
    });
  });
});

describe('addSubtractTime', () => {
  it('加算', () => {
    expect(addSubtractTime('9:00', 90, 1)).toEqual({
      minutes: 630,
      dayOffset: 0,
    });
  });
  it('日付をまたぐ加算', () => {
    expect(addSubtractTime('23:00', 120, 1)).toEqual({
      minutes: 60,
      dayOffset: 1,
    });
    expect(addSubtractTime('23:00', 24 * 60 * 2, 1)).toEqual({
      minutes: 23 * 60,
      dayOffset: 2,
    });
  });
  it('日付をまたぐ減算', () => {
    expect(addSubtractTime('1:00', 120, -1)).toEqual({
      minutes: 23 * 60,
      dayOffset: -1,
    });
  });
  it('ちょうど0:00になる減算は日またぎなし', () => {
    expect(addSubtractTime('1:00', 60, -1)).toEqual({
      minutes: 0,
      dayOffset: 0,
    });
  });
  it('不正入力はnull', () => {
    expect(addSubtractTime('', 10, 1)).toBeNull();
    expect(addSubtractTime('24:00', 10, 1)).toBeNull();
    expect(addSubtractTime('9:00', -5, 1)).toBeNull();
    expect(addSubtractTime('9:00', Infinity, 1)).toBeNull();
  });
});

describe('時間(h:mm)と小数時間の換算', () => {
  it('hoursMinutesToMinutes', () => {
    expect(hoursMinutesToMinutes(2, 30)).toBe(150);
    expect(hoursMinutesToMinutes(0, 90)).toBe(90);
    expect(hoursMinutesToMinutes(-1, 0)).toBeNull();
    expect(hoursMinutesToMinutes(NaN, 0)).toBeNull();
  });
  it('parseDuration', () => {
    expect(parseDuration('7:45')).toBe(465);
    expect(parseDuration('100:05')).toBe(6005);
    expect(parseDuration('7:60')).toBeNull();
    expect(parseDuration('7')).toBeNull();
  });
  it('decimalHoursToMinutes', () => {
    expect(decimalHoursToMinutes(7.75)).toBe(465);
    expect(decimalHoursToMinutes(0.33)).toBe(20);
    expect(decimalHoursToMinutes(-1)).toBeNull();
    expect(decimalHoursToMinutes(NaN)).toBeNull();
  });
});
