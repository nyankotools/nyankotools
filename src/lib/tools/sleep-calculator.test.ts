import { describe, expect, it } from 'vitest';
import {
  bedtimesForWake,
  formatHours,
  formatTime,
  isValidLatency,
  parseTime,
  wakeTimesForBed,
} from './sleep-calculator';

describe('parseTime', () => {
  it('parses valid times', () => {
    expect(parseTime('07:00')).toBe(420);
    expect(parseTime('7:05')).toBe(425);
    expect(parseTime('23:59')).toBe(1439);
    expect(parseTime('00:00')).toBe(0);
  });
  it('rejects invalid times', () => {
    expect(parseTime('')).toBeNull();
    expect(parseTime('24:00')).toBeNull();
    expect(parseTime('12:60')).toBeNull();
    expect(parseTime('abc')).toBeNull();
  });
});

describe('formatTime', () => {
  it('wraps around midnight', () => {
    expect(formatTime(-30)).toBe('23:30');
    expect(formatTime(1440 + 65)).toBe('01:05');
    expect(formatTime(0)).toBe('00:00');
  });
});

describe('bedtimesForWake', () => {
  it('computes bedtimes with 15 minute latency', () => {
    const r = bedtimesForWake(7 * 60)!;
    expect(r.map((c) => c.cycles)).toEqual([6, 5, 4]);
    expect(r.map((c) => c.time)).toEqual(['21:45', '23:15', '00:45']);
    expect(r.map((c) => c.sleepMinutes)).toEqual([540, 450, 360]);
  });
  it('flags previous-day bedtimes', () => {
    const r = bedtimesForWake(7 * 60)!;
    expect(r.map((c) => c.dayOffset)).toEqual([-1, -1, 0]);
    const noon = bedtimesForWake(12 * 60, 0)!;
    expect(noon.map((c) => c.dayOffset)).toEqual([0, 0, 0]);
  });
  it('handles wake time right after midnight', () => {
    const r = bedtimesForWake(0, 0)!;
    expect(r.map((c) => c.time)).toEqual(['15:00', '16:30', '18:00']);
  });
  it('returns null for invalid input', () => {
    expect(bedtimesForWake(-1)).toBeNull();
    expect(bedtimesForWake(1440)).toBeNull();
    expect(bedtimesForWake(420, -5)).toBeNull();
    expect(bedtimesForWake(420, 121)).toBeNull();
    expect(bedtimesForWake(420, 1.5)).toBeNull();
  });
});

describe('wakeTimesForBed', () => {
  it('computes wake times from bedtime', () => {
    const r = wakeTimesForBed(23 * 60)!;
    expect(r.map((c) => c.cycles)).toEqual([4, 5, 6]);
    expect(r.map((c) => c.time)).toEqual(['05:15', '06:45', '08:15']);
    expect(r.map((c) => c.dayOffset)).toEqual([1, 1, 1]);
  });
  it('stays on the same day when it does not cross midnight', () => {
    const r = wakeTimesForBed(0, 0)!;
    expect(r.map((c) => c.time)).toEqual(['06:00', '07:30', '09:00']);
    expect(r.map((c) => c.dayOffset)).toEqual([0, 0, 0]);
  });
  it('supports zero latency crossing midnight exactly', () => {
    const r = wakeTimesForBed(18 * 60, 0)!;
    expect(r[0].time).toBe('00:00');
    expect(r[0].dayOffset).toBe(1);
  });
  it('returns null for invalid input', () => {
    expect(wakeTimesForBed(2000)).toBeNull();
    expect(wakeTimesForBed(60, 500)).toBeNull();
  });
});

describe('isValidLatency / formatHours', () => {
  it('validates latency', () => {
    expect(isValidLatency(0)).toBe(true);
    expect(isValidLatency(120)).toBe(true);
    expect(isValidLatency(NaN)).toBe(false);
  });
  it('formats hours', () => {
    expect(formatHours(360)).toBe('6');
    expect(formatHours(450)).toBe('7.5');
  });
});

describe('sleep-calculator 境界値', () => {
  it('parseTime: 前後の空白は許容し、桁数不足・区切り違いは拒否', () => {
    expect(parseTime(' 07:00 ')).toBe(420);
    expect(parseTime('7:5')).toBeNull();
    expect(parseTime('07-00')).toBeNull();
    expect(parseTime('12:0')).toBeNull();
    expect(parseTime('24:00')).toBeNull();
  });

  it('formatTime: 1440分は00:00に戻る', () => {
    expect(formatTime(1440)).toBe('00:00');
    expect(formatTime(-1)).toBe('23:59');
  });

  it('bedtimesForWake: 最大の入眠までの時間(120分)と23:59の起床は有効', () => {
    expect(bedtimesForWake(1439, 120)).not.toBeNull();
    expect(bedtimesForWake(1439, 120)!.map((c) => c.time)).toEqual([
      '12:59',
      '14:29',
      '15:59',
    ]);
  });

  it('wakeTimesForBed: 23:59の就寝でも日付またぎを正しく扱う', () => {
    const r = wakeTimesForBed(1439, 0)!;
    expect(r.map((c) => c.time)).toEqual(['05:59', '07:29', '08:59']);
    expect(r.every((c) => c.dayOffset === 1)).toBe(true);
  });

  it('latency 0 の bedtimesForWake は境界で日付をまたぐ', () => {
    const r = bedtimesForWake(0, 0)!;
    expect(r[0].dayOffset).toBe(-1);
    expect(r[2].dayOffset).toBe(-1);
  });
});
