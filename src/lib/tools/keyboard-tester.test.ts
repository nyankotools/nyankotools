import { describe, it, expect } from 'vitest';
import {
  countCoverage,
  isLayoutKey,
  layoutCodes,
  locationName,
  otherKeyLabel,
} from './keyboard-tester';

describe('layoutCodes', () => {
  it('フルサイズ（ANSI）の104キーで、codeが重複しない', () => {
    const codes = layoutCodes();
    expect(new Set(codes).size).toBe(codes.length);
    expect(codes).toHaveLength(104 - 0);
  });

  it('主要なキーを含む', () => {
    const codes = layoutCodes();
    for (const c of [
      'Escape',
      'KeyA',
      'Digit0',
      'F12',
      'Space',
      'ShiftLeft',
      'ShiftRight',
      'Enter',
      'NumpadEnter',
      'Numpad0',
      'ArrowUp',
      'PrintScreen',
      'MetaLeft',
    ]) {
      expect(codes).toContain(c);
    }
  });
});

describe('isLayoutKey / countCoverage', () => {
  it('配置内外を判定する', () => {
    expect(isLayoutKey('KeyA')).toBe(true);
    expect(isLayoutKey('IntlYen')).toBe(false);
  });

  it('押下済みのうち配置内のキーだけ数え、重複は1回', () => {
    const r = countCoverage(['KeyA', 'KeyA', 'KeyB', 'IntlYen']);
    expect(r.pressed).toBe(2);
    expect(r.total).toBe(layoutCodes().length);
  });

  it('何も押していなければ0', () => {
    expect(countCoverage([]).pressed).toBe(0);
  });
});

describe('locationName', () => {
  it('locationの番号を名前にする', () => {
    expect(locationName(0)).toBe('standard');
    expect(locationName(1)).toBe('left');
    expect(locationName(2)).toBe('right');
    expect(locationName(3)).toBe('numpad');
    expect(locationName(9)).toBe('standard');
  });
});

describe('otherKeyLabel', () => {
  it('印字できるキーは文字とcode', () => {
    expect(otherKeyLabel('IntlYen', '¥')).toBe('¥ (IntlYen)');
  });

  it('印字できないキーはcode、空白文字もcode', () => {
    expect(otherKeyLabel('Convert', 'Convert')).toBe('Convert');
    expect(otherKeyLabel('IntlBackslash', ' ')).toBe('IntlBackslash');
  });

  it('codeが空ならkey、両方空なら?', () => {
    expect(otherKeyLabel('', 'Unidentified')).toBe('Unidentified');
    expect(otherKeyLabel('', '')).toBe('?');
  });
});
