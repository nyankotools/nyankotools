import { describe, it, expect } from 'vitest';
import {
  formatOffset,
  getOffsetMs,
  isValidTimeZone,
  parseDateTimeLocal,
  resolveWallClock,
  toDateTimeLocal,
  viewInZone,
} from './timezone-converter';

const wall = (value: string) => parseDateTimeLocal(value)!;

describe('timezone-converter', () => {
  it('isValidTimeZone', () => {
    expect(isValidTimeZone('Asia/Tokyo')).toBe(true);
    expect(isValidTimeZone('Mars/Base')).toBe(false);
    expect(isValidTimeZone('')).toBe(false);
  });

  it('parseDateTimeLocal は不正な値を弾く', () => {
    expect(parseDateTimeLocal('2026-02-30T10:00')).toBeNull();
    expect(parseDateTimeLocal('2026-02-10T24:00')).toBeNull();
    expect(parseDateTimeLocal('')).toBeNull();
    expect(toDateTimeLocal(wall('2026-10-02T09:05'))).toBe('2026-10-02T09:05');
  });

  it('東京の時刻を UTC に変換する', () => {
    const r = resolveWallClock(wall('2026-10-02T09:00'), 'Asia/Tokyo');
    expect(r.status).toBe('ok');
    expect(new Date(r.ms).toISOString()).toBe('2026-10-02T00:00:00.000Z');
  });

  it('夏時間と冬時間でオフセットが変わる（ニューヨーク）', () => {
    const summer = Date.UTC(2026, 6, 1);
    const winter = Date.UTC(2026, 0, 1);
    expect(getOffsetMs(summer, 'America/New_York')).toBe(-4 * 3_600_000);
    expect(getOffsetMs(winter, 'America/New_York')).toBe(-5 * 3_600_000);
  });

  it('夏時間開始で存在しない時刻は gap', () => {
    // 2026-03-08 02:30 のニューヨークは存在しない
    const r = resolveWallClock(wall('2026-03-08T02:30'), 'America/New_York');
    expect(r.status).toBe('gap');
  });

  it('夏時間終了で2回ある時刻は ambiguous（早いほうを採用）', () => {
    // 2026-11-01 01:30 のニューヨークは2回ある
    const r = resolveWallClock(wall('2026-11-01T01:30'), 'America/New_York');
    expect(r.status).toBe('ambiguous');
    expect(new Date(r.ms).toISOString()).toBe('2026-11-01T05:30:00.000Z');
  });

  it('formatOffset', () => {
    expect(formatOffset(9 * 3_600_000)).toBe('UTC+9');
    expect(formatOffset(5.5 * 3_600_000)).toBe('UTC+5:30');
    expect(formatOffset(-3.5 * 3_600_000)).toBe('UTC-3:30');
    expect(formatOffset(0)).toBe('UTC');
  });

  it('viewInZone: 日付差と時刻', () => {
    const ms = Date.UTC(2026, 9, 2, 20, 0, 0); // 東京では翌日 05:00
    const tokyo = viewInZone(ms, 'Asia/Tokyo', 'UTC', 'en-US');
    expect(tokyo.time).toBe('05:00:00');
    expect(tokyo.dayDiff).toBe(1);
    expect(tokyo.offset).toBe('UTC+9');
    const la = viewInZone(ms, 'America/Los_Angeles', 'UTC', 'en-US');
    expect(la.time).toBe('13:00:00');
    expect(la.dayDiff).toBe(0);
  });
});
