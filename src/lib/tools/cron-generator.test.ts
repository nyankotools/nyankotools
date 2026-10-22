import { describe, expect, it } from 'vitest';
import {
  buildCron,
  buildField,
  defaultSpec,
  expandField,
  toQuartz,
  type CronFieldName,
  type FieldSpec,
} from './cron-generator';

const spec = (p: Partial<FieldSpec>): FieldSpec => ({ ...defaultSpec(), ...p });

describe('buildField', () => {
  it('every -> *', () => {
    expect(buildField('minute', spec({}))).toEqual({ ok: true, value: '*' });
  });
  it('single value', () => {
    expect(buildField('hour', spec({ mode: 'single', a: '9' }))).toEqual({
      ok: true,
      value: '9',
    });
  });
  it('rejects out of range and non-numbers', () => {
    expect(buildField('hour', spec({ mode: 'single', a: '24' }))).toEqual({
      ok: false,
      error: 'out-of-range',
    });
    expect(buildField('hour', spec({ mode: 'single', a: 'x' }))).toEqual({
      ok: false,
      error: 'not-a-number',
    });
    expect(buildField('hour', spec({ mode: 'single', a: '' }))).toEqual({
      ok: false,
      error: 'not-a-number',
    });
    expect(buildField('dayOfMonth', spec({ mode: 'single', a: '0' }))).toEqual({
      ok: false,
      error: 'out-of-range',
    });
  });
  it('range', () => {
    expect(
      buildField('hour', spec({ mode: 'range', a: '9', b: '18' })),
    ).toEqual({ ok: true, value: '9-18' });
    expect(buildField('hour', spec({ mode: 'range', a: '5', b: '5' }))).toEqual(
      { ok: true, value: '5' },
    );
    expect(
      buildField('hour', spec({ mode: 'range', a: '18', b: '9' })),
    ).toEqual({ ok: false, error: 'range-order' });
  });
  it('step', () => {
    expect(buildField('minute', spec({ mode: 'step', a: '5' }))).toEqual({
      ok: true,
      value: '*/5',
    });
    expect(buildField('minute', spec({ mode: 'step', a: '1' }))).toEqual({
      ok: true,
      value: '*',
    });
    expect(buildField('minute', spec({ mode: 'step', a: '0' }))).toEqual({
      ok: false,
      error: 'step-zero',
    });
    expect(buildField('minute', spec({ mode: 'step', a: '60' }))).toEqual({
      ok: false,
      error: 'out-of-range',
    });
  });
  it('list is sorted and de-duplicated', () => {
    expect(
      buildField('minute', spec({ mode: 'list', list: '30, 0 15,15' })),
    ).toEqual({ ok: true, value: '0,15,30' });
    expect(buildField('minute', spec({ mode: 'list', list: ' , ' }))).toEqual({
      ok: false,
      error: 'empty-list',
    });
    expect(buildField('minute', spec({ mode: 'list', list: '1,60' }))).toEqual({
      ok: false,
      error: 'out-of-range',
    });
  });
});

describe('buildCron', () => {
  const base = (): Record<CronFieldName, FieldSpec> => ({
    minute: spec({}),
    hour: spec({}),
    dayOfMonth: spec({}),
    month: spec({}),
    dayOfWeek: spec({}),
  });

  it('builds every-minute by default', () => {
    const r = buildCron(base());
    expect(r).toMatchObject({ ok: true, expression: '* * * * *' });
  });
  it('builds a weekday schedule', () => {
    const s = base();
    s.minute = spec({ mode: 'step', a: '15' });
    s.hour = spec({ mode: 'range', a: '9', b: '18' });
    s.dayOfWeek = spec({ mode: 'range', a: '1', b: '5' });
    expect(buildCron(s)).toMatchObject({
      ok: true,
      expression: '*/15 9-18 * * 1-5',
    });
  });
  it('collects errors per field', () => {
    const s = base();
    s.minute = spec({ mode: 'single', a: '99' });
    s.month = spec({ mode: 'single', a: '' });
    expect(buildCron(s)).toEqual({
      ok: false,
      errors: { minute: 'out-of-range', month: 'not-a-number' },
    });
  });
});

describe('expandField', () => {
  it('expands steps, ranges and lists', () => {
    expect(expandField('*/20', 'minute')).toEqual([0, 20, 40]);
    expect(expandField('1-3', 'month')).toEqual([1, 2, 3]);
    expect(expandField('0,7,3', 'dayOfWeek')).toEqual([0, 3]);
  });
});

describe('toQuartz', () => {
  const f = (o: Partial<Record<CronFieldName, string>>) => ({
    minute: '*',
    hour: '*',
    dayOfMonth: '*',
    month: '*',
    dayOfWeek: '*',
    ...o,
  });
  it('prepends seconds and uses ? for day-of-week when unrestricted', () => {
    expect(toQuartz(f({ minute: '0', hour: '3' }))).toEqual({
      ok: true,
      expression: '0 0 3 * * ?',
    });
  });
  it('shifts weekdays to 1-7 (1 = Sunday)', () => {
    expect(toQuartz(f({ minute: '0', hour: '9', dayOfWeek: '1-5' }))).toEqual({
      ok: true,
      expression: '0 0 9 ? * 2,3,4,5,6',
    });
    expect(toQuartz(f({ dayOfWeek: '0,7' }))).toEqual({
      ok: true,
      expression: '0 * * ? * 1',
    });
  });
  it('keeps day-of-month and uses ? for weekday', () => {
    expect(toQuartz(f({ dayOfMonth: '1' }))).toEqual({
      ok: true,
      expression: '0 * * 1 * ?',
    });
  });
  it('fails when both day fields are restricted', () => {
    expect(toQuartz(f({ dayOfMonth: '1', dayOfWeek: '1' }))).toEqual({
      ok: false,
      reason: 'both-day-fields',
    });
  });
  it('曜日のステップと範囲も Quartz の 1-7 に変換する', () => {
    expect(toQuartz(f({ dayOfWeek: '*/2' }))).toEqual({
      ok: true,
      expression: '0 * * ? * 1,3,5,7',
    });
    expect(toQuartz(f({ dayOfWeek: '5-7' }))).toEqual({
      ok: true,
      expression: '0 * * ? * 1,6,7',
    });
  });
  it('日のステップは日付側に残し、曜日は ? にする', () => {
    expect(toQuartz(f({ minute: '0', dayOfMonth: '*/2' }))).toEqual({
      ok: true,
      expression: '0 0 * */2 * ?',
    });
  });
});

describe('全角・日本語の区切りの扱い', () => {
  it('リストは読点や全角カンマ・空白で区切れる', () => {
    expect(
      buildField('minute', spec({ mode: 'list', list: '1、2，3  4' })),
    ).toEqual({ ok: true, value: '1,2,3,4' });
  });
  it('全角数字は数値として扱わず not-a-number', () => {
    expect(buildField('hour', spec({ mode: 'single', a: '９' }))).toEqual({
      ok: false,
      error: 'not-a-number',
    });
    expect(buildField('minute', spec({ mode: 'list', list: '１,2' }))).toEqual({
      ok: false,
      error: 'not-a-number',
    });
  });
});
