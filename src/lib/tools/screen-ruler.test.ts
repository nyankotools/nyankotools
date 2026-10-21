import { describe, expect, it } from 'vitest';
import {
  CARD_PX_MAX,
  CARD_PX_MIN,
  CARD_WIDTH_MM,
  DEFAULT_PX_PER_MM,
  MAX_TICKS,
  cardPxFromPxPerMm,
  formatFixed,
  generateTicks,
  parseCalibration,
  ppiFromPxPerMm,
  pxPerMmFromCardPx,
  rulerLengthMm,
  serializeCalibration,
} from './screen-ruler';

describe('calibration', () => {
  it('derives px/mm from the card width', () => {
    expect(pxPerMmFromCardPx(CARD_WIDTH_MM * 4)).toBeCloseTo(4, 10);
  });

  it('default is 96 dpi and round-trips', () => {
    expect(ppiFromPxPerMm(DEFAULT_PX_PER_MM)).toBeCloseTo(96, 10);
    expect(pxPerMmFromCardPx(cardPxFromPxPerMm(DEFAULT_PX_PER_MM))).toBeCloseTo(
      DEFAULT_PX_PER_MM,
      10,
    );
  });

  it('clamps out-of-range card widths and rejects invalid ones', () => {
    expect(pxPerMmFromCardPx(10)).toBeCloseTo(CARD_PX_MIN / CARD_WIDTH_MM);
    expect(pxPerMmFromCardPx(99999)).toBeCloseTo(CARD_PX_MAX / CARD_WIDTH_MM);
    expect(pxPerMmFromCardPx(0)).toBeNull();
    expect(pxPerMmFromCardPx(-5)).toBeNull();
    expect(pxPerMmFromCardPx(NaN)).toBeNull();
  });
});

describe('parseCalibration / serializeCalibration', () => {
  it('accepts valid values', () => {
    expect(parseCalibration('3.7795')).toBeCloseTo(3.7795, 4);
    expect(parseCalibration(serializeCalibration(4.123456))).toBeCloseTo(
      4.1235,
      4,
    );
  });

  it('rejects null, empty, garbage and out of range', () => {
    expect(parseCalibration(null)).toBeNull();
    expect(parseCalibration(undefined)).toBeNull();
    expect(parseCalibration('')).toBeNull();
    expect(parseCalibration('abc')).toBeNull();
    expect(parseCalibration('0')).toBeNull();
    expect(parseCalibration('-3')).toBeNull();
    expect(parseCalibration('1000')).toBeNull();
    expect(parseCalibration('Infinity')).toBeNull();
  });

  it('accepts the exact card-width bounds (100px to 800px)', () => {
    expect(
      parseCalibration(String(CARD_PX_MIN / CARD_WIDTH_MM)),
    ).not.toBeNull();
    expect(
      parseCalibration(String(CARD_PX_MAX / CARD_WIDTH_MM)),
    ).not.toBeNull();
    expect(
      parseCalibration(String(CARD_PX_MIN / CARD_WIDTH_MM - 0.01)),
    ).toBeNull();
    expect(
      parseCalibration(String(CARD_PX_MAX / CARD_WIDTH_MM + 0.01)),
    ).toBeNull();
  });
});

describe('rulerLengthMm', () => {
  it('floors to whole mm', () => {
    expect(rulerLengthMm(100, 4)).toBe(25);
    expect(rulerLengthMm(101, 4)).toBe(25);
  });

  it('returns 0 for invalid input', () => {
    expect(rulerLengthMm(0, 4)).toBe(0);
    expect(rulerLengthMm(100, 0)).toBe(0);
    expect(rulerLengthMm(NaN, 4)).toBe(0);
  });
});

describe('generateTicks (cm)', () => {
  const ticks = generateTicks(30, 'cm', 4);

  it('makes one tick per mm including 0 and the end', () => {
    expect(ticks).toHaveLength(31);
    expect(ticks[0]).toEqual({ level: 0, position: 0, label: 0 });
    expect(ticks[30]?.position).toBe(120);
  });

  it('labels each cm and marks the 5 mm tick', () => {
    expect(ticks[10]).toEqual({ level: 0, position: 40, label: 1 });
    expect(ticks[15]?.level).toBe(1);
    expect(ticks[15]?.label).toBeNull();
    expect(ticks[3]?.level).toBe(3);
  });

  it('ignores a fractional tail', () => {
    expect(generateTicks(10.9, 'cm', 4)).toHaveLength(11);
  });
});

describe('generateTicks (inch)', () => {
  const pxPerMm = 96 / 25.4;
  const ticks = generateTicks(25.4 * 2, 'inch', pxPerMm);

  it('makes 1/16 inch steps', () => {
    expect(ticks).toHaveLength(33);
    expect(ticks[16]?.label).toBe(1);
    expect(ticks[16]?.position).toBeCloseTo(96, 6);
    expect(ticks[32]?.label).toBe(2);
  });

  it('assigns levels by fraction', () => {
    expect(ticks[8]?.level).toBe(1);
    expect(ticks[4]?.level).toBe(2);
    expect(ticks[12]?.level).toBe(2);
    expect(ticks[2]?.level).toBe(3);
    expect(ticks[1]?.level).toBe(3);
  });

  it('does not include a tick beyond the length', () => {
    expect(generateTicks(25.4 + 1, 'inch', pxPerMm)).toHaveLength(17);
  });
});

describe('generateTicks edge cases', () => {
  it('returns nothing for invalid input', () => {
    expect(generateTicks(0, 'cm', 4)).toEqual([]);
    expect(generateTicks(-5, 'cm', 4)).toEqual([]);
    expect(generateTicks(NaN, 'inch', 4)).toEqual([]);
    expect(generateTicks(10, 'cm', 0)).toEqual([]);
  });

  it('caps the tick count', () => {
    expect(generateTicks(1e9, 'cm', 4)).toHaveLength(MAX_TICKS + 1);
    expect(generateTicks(1e9, 'inch', 4)).toHaveLength(MAX_TICKS + 1);
  });
});

describe('formatFixed', () => {
  it('formats and guards non-finite', () => {
    expect(formatFixed(96, 1)).toBe('96.0');
    expect(formatFixed(NaN, 1)).toBe('');
  });
});
