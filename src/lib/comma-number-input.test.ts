import { describe, expect, it } from 'vitest';
import { formatNumberWithCommas, stripCommas } from './comma-number-input';

describe('formatNumberWithCommas', () => {
  it('returns an empty string for empty input', () => {
    expect(formatNumberWithCommas('')).toBe('');
  });

  it('returns empty string for whitespace only', () => {
    expect(formatNumberWithCommas('   ')).toBe('');
  });

  it('leaves numbers under 1000 unchanged', () => {
    expect(formatNumberWithCommas('123')).toBe('123');
  });

  it('inserts commas every 3 digits', () => {
    expect(formatNumberWithCommas('1234567')).toBe('1,234,567');
  });

  it('preserves the decimal part without adding commas to it', () => {
    expect(formatNumberWithCommas('1234567.891')).toBe('1,234,567.891');
  });

  it('preserves a trailing decimal point while typing', () => {
    expect(formatNumberWithCommas('1234.')).toBe('1,234.');
  });

  it('preserves a negative sign', () => {
    expect(formatNumberWithCommas('-1234567')).toBe('-1,234,567');
  });

  it('strips non-digit characters other than a single decimal point', () => {
    expect(formatNumberWithCommas('12a3b4')).toBe('1,234');
  });

  it('handles full-width numbers (full-width zero is not digits, should be stripped)', () => {
    expect(formatNumberWithCommas('１２３４')).toBe('');
  });

  it('handles very large numbers', () => {
    expect(formatNumberWithCommas('1234567890123456')).toBe(
      '1,234,567,890,123,456',
    );
  });

  it('handles negative decimal numbers', () => {
    expect(formatNumberWithCommas('-1234.56')).toBe('-1,234.56');
  });

  it('handles zero', () => {
    expect(formatNumberWithCommas('0')).toBe('0');
  });

  it('handles multiple decimal points (keeps only first)', () => {
    expect(formatNumberWithCommas('12.34.56')).toBe('12.3456');
  });

  it('handles decimal point at start', () => {
    expect(formatNumberWithCommas('.123')).toBe('.123');
  });
});

describe('stripCommas', () => {
  it('removes all commas from a string', () => {
    expect(stripCommas('1,234,567')).toBe('1234567');
  });

  it('is a no-op on a string without commas', () => {
    expect(stripCommas('1234.5')).toBe('1234.5');
  });

  it('handles negative numbers with commas', () => {
    expect(stripCommas('-1,234,567')).toBe('-1234567');
  });

  it('handles empty string', () => {
    expect(stripCommas('')).toBe('');
  });
});
