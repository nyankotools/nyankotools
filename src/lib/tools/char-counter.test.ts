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

  it('CRLFの改行コードでも行数を正しく数える', () => {
    expect(countText('foo\r\nbar\r\nbaz').lines).toBe(3);
  });

  it('CR単独の改行コードは1行として数えられる（LF区切りのみに対応）', () => {
    // 実装は text.split(/\n/) でのみ行を分割しているため、
    // 古いMac形式（CRのみ）の改行は行区切りとして認識されない。
    expect(countText('foo\rbar\rbaz').lines).toBe(1);
  });

  it('末尾に改行がある場合、末尾の空行も1行として数える', () => {
    expect(countText('foo\nbar\n').lines).toBe(3);
  });

  it('大量の行・文字数でも正しく数えられる', () => {
    const line = 'a'.repeat(100);
    const bigText = Array(1000).fill(line).join('\n');
    const result = countText(bigText);
    expect(result.lines).toBe(1000);
    expect(result.characters).toBe(100 * 1000 + 999);
  });

  it('絵文字と日本語が混在していても文字数を正しく数える', () => {
    const result = countText('こんにちは🐱世界🌏');
    expect(result.characters).toBe(9);
  });

  it('全角スペースも空白として文字数(空白除く)から除外される', () => {
    // JSの正規表現の \s は全角スペース(U+3000)もホワイトスペースとして扱うため、
    // 全角スペースも charactersNoSpaces から除外される。
    const result = countText('あ　い');
    expect(result.characters).toBe(3);
    expect(result.charactersNoSpaces).toBe(2);
  });
});
