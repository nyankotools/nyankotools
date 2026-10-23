import { describe, expect, it } from 'vitest';
import {
  SECONDS_PER_MONTH,
  SECONDS_PER_YEAR,
  addDurationToDate,
  breakdownComponents,
  durationToSeconds,
  formatNumber,
  parseIsoDuration,
  parseSecondsInput,
  secondsToBreakdown,
  secondsToIsoDuration,
  secondsToTotals,
  type IsoDuration,
} from './iso-duration-converter';

function parse(input: string): IsoDuration {
  const r = parseIsoDuration(input);
  if (!r.ok) throw new Error(`parse failed: ${r.error}`);
  return r.value;
}

describe('parseIsoDuration', () => {
  it('PT1H30M を時間と分に分解する', () => {
    const d = parse('PT1H30M');
    expect(d.hours).toBe(1);
    expect(d.minutes).toBe(30);
    expect(d.days).toBe(0);
    expect(durationToSeconds(d)).toEqual({ seconds: 5400, approximate: false });
  });

  it('P1Y2M3DT4H5M6S の全成分を分解する', () => {
    const d = parse('P1Y2M3DT4H5M6S');
    expect([d.years, d.months, d.days, d.hours, d.minutes, d.seconds]).toEqual([
      1, 2, 3, 4, 5, 6,
    ]);
    expect(durationToSeconds(d).approximate).toBe(true);
  });

  it('P後のMは月、T後のMは分', () => {
    expect(parse('P1M').months).toBe(1);
    expect(parse('PT1M').minutes).toBe(1);
  });

  it('週を扱う', () => {
    const d = parse('P2W');
    expect(d.weeks).toBe(2);
    expect(durationToSeconds(d).seconds).toBe(14 * 86400);
  });

  it('小数秒（ドット・カンマ）を扱う', () => {
    expect(parse('PT0.5S').seconds).toBe(0.5);
    expect(parse('PT1,5S').seconds).toBe(1.5);
    expect(durationToSeconds(parse('PT1M0.25S')).seconds).toBe(60.25);
  });

  it('小文字・前後の空白を許容する', () => {
    expect(durationToSeconds(parse('  pt90s ')).seconds).toBe(90);
  });

  it('負の期間を扱う', () => {
    const d = parse('-PT1H');
    expect(d.negative).toBe(true);
    expect(durationToSeconds(d).seconds).toBe(-3600);
    expect(durationToSeconds(parse('+PT1H')).seconds).toBe(3600);
  });

  it('年・月は平均値で換算する', () => {
    expect(durationToSeconds(parse('P1Y')).seconds).toBe(SECONDS_PER_YEAR);
    expect(durationToSeconds(parse('P1M')).seconds).toBe(SECONDS_PER_MONTH);
  });

  it('ゼロ期間は-0にならない', () => {
    expect(durationToSeconds(parse('-PT0S')).seconds).toBe(0);
    expect(Object.is(durationToSeconds(parse('-PT0S')).seconds, 0)).toBe(true);
  });

  it('不正な入力はエラー', () => {
    expect(parseIsoDuration('')).toEqual({ ok: false, error: 'empty' });
    expect(parseIsoDuration('   ')).toEqual({ ok: false, error: 'empty' });
    expect(parseIsoDuration('P')).toEqual({ ok: false, error: 'noComponents' });
    expect(parseIsoDuration('PT')).toEqual({
      ok: false,
      error: 'noComponents',
    });
    for (const bad of [
      '1H30M',
      'PT1H30',
      'P1DT',
      'PT1D',
      'P1H',
      'PT30M1H',
      'P-1D',
      'PT1.S',
      'hello',
      'P1Y2M3',
    ]) {
      expect(parseIsoDuration(bad)).toEqual({ ok: false, error: 'format' });
    }
  });

  it('大きすぎる値はエラー', () => {
    expect(parseIsoDuration('P99999999999999999999Y')).toEqual({
      ok: false,
      error: 'tooLarge',
    });
  });

  it('全角数字や日本語の混じった入力は形式エラー', () => {
    expect(parseIsoDuration('PT１H30M')).toEqual({
      ok: false,
      error: 'format',
    });
    expect(parseIsoDuration('１時間30分')).toEqual({
      ok: false,
      error: 'format',
    });
  });

  it('非常に長い入力でも例外や長時間停止にならず判定できる', () => {
    const digits = '1'.repeat(20000);
    expect(parseIsoDuration(`P${digits}`)).toEqual({
      ok: false,
      error: 'format',
    });
    expect(parseIsoDuration(`PT${digits}S`).ok).toBe(false);
    expect(parseIsoDuration(`P${'9'.repeat(5000)}Y`)).toEqual({
      ok: false,
      error: 'tooLarge',
    });
  });
});

describe('breakdownComponents / secondsToTotals', () => {
  it('ゼロの成分を省く', () => {
    expect(breakdownComponents(parse('P1DT0H30M'))).toEqual([
      { unit: 'days', value: '1' },
      { unit: 'minutes', value: '30' },
    ]);
  });

  it('合計を各単位に換算する', () => {
    expect(secondsToTotals(5400)).toEqual({
      seconds: '5400',
      minutes: '90',
      hours: '1.5',
      days: '0.0625',
    });
  });
});

describe('formatNumber', () => {
  it('指数表記にせず末尾のゼロを除く', () => {
    expect(formatNumber(1e15)).toBe('1000000000000000');
    expect(formatNumber(0.1 + 0.2)).toBe('0.3');
    expect(formatNumber(2.5)).toBe('2.5');
  });
});

describe('parseSecondsInput', () => {
  it('整数・小数・負数・カンマ区切りを受け付ける', () => {
    expect(parseSecondsInput('5400')).toBe(5400);
    expect(parseSecondsInput('1.5')).toBe(1.5);
    expect(parseSecondsInput('-30')).toBe(-30);
    expect(parseSecondsInput('1,000')).toBe(1000);
    expect(parseSecondsInput(' .5 ')).toBe(0.5);
  });

  it('不正な入力はnull', () => {
    for (const bad of ['', 'abc', '1e3', '1.', '--1', '1 2', '1e20']) {
      expect(parseSecondsInput(bad)).toBeNull();
    }
    expect(parseSecondsInput('99999999999999999999')).toBeNull();
  });
});

describe('secondsToIsoDuration', () => {
  it('秒数をISO 8601期間に変換する', () => {
    expect(secondsToIsoDuration(5400)).toBe('PT1H30M');
    expect(secondsToIsoDuration(45)).toBe('PT45S');
    expect(secondsToIsoDuration(60)).toBe('PT1M');
    expect(secondsToIsoDuration(86400)).toBe('P1D');
    expect(secondsToIsoDuration(90061)).toBe('P1DT1H1M1S');
    expect(secondsToIsoDuration(0)).toBe('PT0S');
  });

  it('小数秒を扱う', () => {
    expect(secondsToIsoDuration(1.5)).toBe('PT1.5S');
    expect(secondsToIsoDuration(0.000001)).toBe('PT0.000001S');
    expect(secondsToIsoDuration(59.9999999)).toBe('PT1M');
  });

  it('負数は先頭にマイナスを付ける', () => {
    expect(secondsToIsoDuration(-3600)).toBe('-PT1H');
    expect(secondsToIsoDuration(-0.0000001)).toBe('PT0S');
  });

  it('往復で元に戻る', () => {
    for (const s of [1, 59, 3600, 5400.25, 123456789, -42]) {
      const iso = secondsToIsoDuration(s);
      expect(durationToSeconds(parse(iso)).seconds).toBe(s);
    }
  });
});

describe('secondsToBreakdown', () => {
  it('日・時・分・秒に分解する', () => {
    expect(secondsToBreakdown(93784)).toEqual({
      negative: false,
      days: 1,
      hours: 2,
      minutes: 3,
      seconds: '4',
    });
  });
});

describe('addDurationToDate', () => {
  it('年・月をカレンダー通りに加算する', () => {
    const base = new Date(2024, 0, 31, 10, 0, 0);
    const r = addDurationToDate(base, parse('P1M'))!;
    // 2月末（うるう年）に丸める
    expect([r.getFullYear(), r.getMonth(), r.getDate()]).toEqual([2024, 1, 29]);
  });

  it('日・時間・分を加算する', () => {
    const base = new Date(2024, 0, 1, 23, 0, 0);
    const r = addDurationToDate(base, parse('P1DT2H30M'))!;
    expect(r.getTime()).toBe(new Date(2024, 0, 3, 1, 30, 0).getTime());
  });

  it('週を加算する', () => {
    const r = addDurationToDate(new Date(2024, 0, 1), parse('P2W'))!;
    expect(r.getDate()).toBe(15);
  });

  it('負の期間は減算する', () => {
    const r = addDurationToDate(new Date(2024, 2, 1, 0, 0, 0), parse('-P1D'))!;
    expect([r.getMonth(), r.getDate()]).toEqual([1, 29]);
  });

  it('小数の年・月はnull', () => {
    expect(addDurationToDate(new Date(2024, 0, 1), parse('P0.5Y'))).toBeNull();
    expect(addDurationToDate(new Date(2024, 0, 1), parse('P1.5M'))).toBeNull();
  });

  it('小数秒を加算する', () => {
    const base = new Date(2024, 0, 1, 0, 0, 0, 0);
    const r = addDurationToDate(base, parse('PT1.5S'))!;
    expect(r.getTime() - base.getTime()).toBe(1500);
  });

  it('Dateの表現範囲を超える場合はnull', () => {
    expect(
      addDurationToDate(new Date(2024, 0, 1), parse('P300000Y')),
    ).toBeNull();
  });

  it('閏年の2月末から年を足すと2月末に丸める', () => {
    const r = addDurationToDate(new Date(2024, 1, 29), parse('P1Y'))!;
    expect([r.getFullYear(), r.getMonth(), r.getDate()]).toEqual([2025, 1, 28]);
  });
});
