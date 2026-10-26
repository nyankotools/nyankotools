import { describe, expect, it } from 'vitest';
import {
  MAX_DIGITS,
  displayMs,
  generateDigits,
  isCorrect,
  normalizeAnswer,
  parseBest,
  updateBest,
} from './number-memory-test';

describe('displayMs', () => {
  it('桁数が増えるほど長くなる', () => {
    expect(displayMs(1)).toBe(1000);
    expect(displayMs(2)).toBe(1400);
    expect(displayMs(10)).toBe(4600);
  });
  it('不正な桁数は例外', () => {
    expect(() => displayMs(0)).toThrow(RangeError);
    expect(() => displayMs(1.5)).toThrow(RangeError);
  });
});

describe('generateDigits', () => {
  it('指定桁数の文字列を作り、先頭0も許可する', () => {
    expect(generateDigits(4, () => 0)).toBe('0000');
    expect(generateDigits(3, () => 9)).toBe('999');
  });
  it('乱数の順に並ぶ', () => {
    let i = 0;
    expect(generateDigits(5, () => i++)).toBe('01234');
  });
  it('既定の乱数でも数字だけ', () => {
    for (let n = 1; n <= MAX_DIGITS; n++) {
      expect(generateDigits(n)).toMatch(new RegExp(`^[0-9]{${n}}$`));
    }
  });
  it('範囲外は例外', () => {
    expect(() => generateDigits(0)).toThrow(RangeError);
    expect(() => generateDigits(MAX_DIGITS + 1)).toThrow(RangeError);
  });
});

describe('normalizeAnswer / isCorrect', () => {
  it('全角数字と空白を正規化する', () => {
    expect(normalizeAnswer(' １２ 3-4 ')).toBe('1234');
  });
  it('先頭0を保ったまま比較する', () => {
    expect(isCorrect('0123', '0123')).toBe(true);
    expect(isCorrect('0123', '123')).toBe(false);
  });
  it('全角入力でも正解になる', () => {
    expect(isCorrect('0123', '０１２３')).toBe(true);
  });
  it('空入力や桁違いは不正解', () => {
    expect(isCorrect('12', '')).toBe(false);
    expect(isCorrect('12', '123')).toBe(false);
    expect(isCorrect('', '')).toBe(false);
  });
});

describe('parseBest / updateBest', () => {
  it('不正な保存値は0', () => {
    expect(parseBest(null)).toBe(0);
    expect(parseBest('abc')).toBe(0);
    expect(parseBest('-1')).toBe(0);
    expect(parseBest('2.5')).toBe(0);
    expect(parseBest('999')).toBe(0);
  });
  it('正しい値は読める', () => {
    expect(parseBest('7')).toBe(7);
  });
  it('高い方を残す', () => {
    expect(updateBest(5, 7)).toBe(7);
    expect(updateBest(5, 3)).toBe(5);
    expect(updateBest(0, 0)).toBe(0);
  });
});
