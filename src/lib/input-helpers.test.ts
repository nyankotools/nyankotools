import { describe, expect, it } from 'vitest';
import { countChars, formatCount } from './input-helpers';

describe('countChars', () => {
  it('空文字は0', () => {
    expect(countChars('')).toBe(0);
  });

  it('サロゲートペアを1文字と数える', () => {
    expect('𠮷a'.length).toBe(3);
    expect(countChars('𠮷a')).toBe(2);
  });

  it('改行も1文字と数える', () => {
    expect(countChars('a\nb')).toBe(3);
  });
});

describe('formatCount', () => {
  it('{n} を3桁区切りの数値に置き換える', () => {
    expect(formatCount('{n}文字', 1234567)).toBe('1,234,567文字');
    expect(formatCount('{n} chars', 0)).toBe('0 chars');
  });
});
