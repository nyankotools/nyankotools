import { describe, expect, it } from 'vitest';
import { countText } from './char-counter';

describe('countText', () => {
  it('空文字列はすべて0になる', () => {
    expect(countText('')).toEqual({
      characters: 0,
      charactersNoSpaces: 0,
      words: 0,
      lines: 0,
    });
  });

  it('文字数・単語数・行数を正しく数える', () => {
    expect(countText('hello world\nfoo')).toEqual({
      characters: 15,
      charactersNoSpaces: 13,
      words: 3,
      lines: 2,
    });
  });

  it('サロゲートペア文字も1文字として数える', () => {
    const result = countText('🐱🐶');
    expect(result.characters).toBe(2);
    expect(result.charactersNoSpaces).toBe(2);
  });

  it('前後の空白は単語数の計算から除外される', () => {
    expect(countText('  spaced out  ').words).toBe(2);
  });

  it('スペースのない日本語文でも単語数を正しく数える', () => {
    expect(countText('これはテストです').words).toBeGreaterThan(1);
  });
});
