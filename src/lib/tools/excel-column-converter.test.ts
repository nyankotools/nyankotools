import { describe, expect, it } from 'vitest';
import {
  columnToNumber,
  numberToColumn,
  parseCellRef,
  parseRange,
  parseReference,
  referenceTable,
} from './excel-column-converter';

describe('columnToNumber', () => {
  it('converts known columns', () => {
    expect(columnToNumber('A')).toEqual({ ok: true, value: 1 });
    expect(columnToNumber('Z')).toEqual({ ok: true, value: 26 });
    expect(columnToNumber('AA')).toEqual({ ok: true, value: 27 });
    expect(columnToNumber('AZ')).toEqual({ ok: true, value: 52 });
    expect(columnToNumber('XFD')).toEqual({ ok: true, value: 16384 });
  });
  it('is case-insensitive and trims', () => {
    expect(columnToNumber(' xfd ')).toEqual({ ok: true, value: 16384 });
  });
  it('rejects bad input', () => {
    expect(columnToNumber('')).toEqual({ ok: false, error: 'empty' });
    expect(columnToNumber('A1')).toEqual({ ok: false, error: 'invalid' });
    expect(columnToNumber('XFE')).toEqual({ ok: false, error: 'out-of-range' });
    expect(columnToNumber('AAAA')).toEqual({
      ok: false,
      error: 'out-of-range',
    });
  });
});

describe('numberToColumn', () => {
  it('converts known numbers', () => {
    expect(numberToColumn('1')).toEqual({ ok: true, value: 'A' });
    expect(numberToColumn('26')).toEqual({ ok: true, value: 'Z' });
    expect(numberToColumn('27')).toEqual({ ok: true, value: 'AA' });
    expect(numberToColumn('52')).toEqual({ ok: true, value: 'AZ' });
    expect(numberToColumn('702')).toEqual({ ok: true, value: 'ZZ' });
    expect(numberToColumn('703')).toEqual({ ok: true, value: 'AAA' });
    expect(numberToColumn('16384')).toEqual({ ok: true, value: 'XFD' });
  });
  it('rejects out of range and invalid', () => {
    expect(numberToColumn('0')).toEqual({ ok: false, error: 'out-of-range' });
    expect(numberToColumn('-3')).toEqual({ ok: false, error: 'out-of-range' });
    expect(numberToColumn('16385')).toEqual({
      ok: false,
      error: 'out-of-range',
    });
    expect(numberToColumn('1.5')).toEqual({ ok: false, error: 'invalid' });
    expect(numberToColumn('abc')).toEqual({ ok: false, error: 'invalid' });
    expect(numberToColumn('')).toEqual({ ok: false, error: 'empty' });
  });
  it('round-trips every column', () => {
    for (let n = 1; n <= 16384; n++) {
      const c = numberToColumn(n);
      expect(c.ok).toBe(true);
      if (c.ok) expect(columnToNumber(c.value)).toEqual({ ok: true, value: n });
    }
  });
});

describe('parseCellRef', () => {
  it('parses plain and absolute references', () => {
    expect(parseCellRef('B3')).toEqual({
      ok: true,
      value: {
        column: 'B',
        columnNumber: 2,
        row: 3,
        absoluteColumn: false,
        absoluteRow: false,
      },
    });
    const abs = parseCellRef('$b$3');
    expect(abs.ok && abs.value.absoluteColumn && abs.value.absoluteRow).toBe(
      true,
    );
    const mixed = parseCellRef('AZ$10');
    expect(
      mixed.ok && !mixed.value.absoluteColumn && mixed.value.absoluteRow,
    ).toBe(true);
  });
  it('rejects bad references', () => {
    expect(parseCellRef('')).toEqual({ ok: false, error: 'empty' });
    expect(parseCellRef('3B')).toEqual({ ok: false, error: 'invalid' });
    expect(parseCellRef('A')).toEqual({ ok: false, error: 'invalid' });
    expect(parseCellRef('A0')).toEqual({ ok: false, error: 'out-of-range' });
    expect(parseCellRef('A1048577')).toEqual({
      ok: false,
      error: 'out-of-range',
    });
    expect(parseCellRef('XFE1')).toEqual({ ok: false, error: 'out-of-range' });
  });
});

describe('parseRange', () => {
  it('counts columns, rows and cells', () => {
    const r = parseRange('A1:C10');
    expect(r.ok && [r.value.columns, r.value.rows, r.value.cells]).toEqual([
      3, 10, 30,
    ]);
  });
  it('handles reversed ranges and absolute refs', () => {
    const r = parseRange('$C$10:$A$1');
    expect(r.ok && r.value.cells).toBe(30);
  });
  it('handles a single-cell range', () => {
    const r = parseRange('B2:B2');
    expect(r.ok && r.value.cells).toBe(1);
  });
  it('rejects invalid ranges', () => {
    expect(parseRange('A1:B2:C3')).toEqual({ ok: false, error: 'invalid' });
    expect(parseRange('A1:')).toEqual({ ok: false, error: 'empty' });
    expect(parseRange('A1:XFE2')).toEqual({ ok: false, error: 'out-of-range' });
  });
});

describe('parseReference', () => {
  it('distinguishes cell and range', () => {
    const c = parseReference('A1');
    expect(c.ok && c.value.kind).toBe('cell');
    const r = parseReference('A1:B2');
    expect(r.ok && r.value.kind).toBe('range');
    expect(parseReference('').ok).toBe(false);
  });
});

describe('referenceTable', () => {
  it('includes XFD = 16384', () => {
    expect(referenceTable()).toContainEqual({ column: 'XFD', number: 16384 });
    expect(referenceTable()).toContainEqual({ column: 'IV', number: 256 });
  });
});
