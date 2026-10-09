import { describe, expect, it } from 'vitest';
import { countText, countXWeighted } from './char-counter';

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

describe('countXWeighted', () => {
  it('空文字列は0で残りは上限と同じ', () => {
    expect(countXWeighted('')).toEqual({
      weighted: 0,
      remaining: 280,
      overLimit: false,
    });
  });

  it('半角は1、全角は2として数える', () => {
    expect(countXWeighted('abc').weighted).toBe(3);
    expect(countXWeighted('あいう').weighted).toBe(6);
    expect(countXWeighted('aあ').weighted).toBe(3);
  });

  it('改行は1として数える', () => {
    expect(countXWeighted('a\nb').weighted).toBe(3);
  });

  it('URLは長さによらず23として数える', () => {
    expect(countXWeighted('https://example.com/').weighted).toBe(23);
    expect(
      countXWeighted('https://example.com/' + 'a'.repeat(200)).weighted,
    ).toBe(23);
    expect(countXWeighted('見て https://example.com/a。').weighted).toBe(
      4 + 1 + 23 + 2,
    );
  });

  it('URL直後に続く日本語はURLに含めない', () => {
    expect(countXWeighted('https://x.com/abc続き').weighted).toBe(23 + 4);
  });

  it('キーキャップ絵文字は2として数える', () => {
    expect(countXWeighted('1️⃣').weighted).toBe(2);
    expect(countXWeighted('1').weighted).toBe(1);
  });

  it('大文字のスキームもURLとして数える', () => {
    expect(countXWeighted('HTTPS://EXAMPLE.COM/').weighted).toBe(23);
  });

  it('©や®は絵文字扱いにせず1として数える', () => {
    expect(countXWeighted('©2026').weighted).toBe(5);
    expect(countXWeighted('®').weighted).toBe(1);
  });

  it('絵文字は結合列も含めて2として数える', () => {
    expect(countXWeighted('🐱').weighted).toBe(2);
    expect(countXWeighted('👨‍👩‍👧').weighted).toBe(2);
    expect(countXWeighted('👍🏽').weighted).toBe(2);
  });

  it('上限ちょうどは超過にならず、1超えると超過になる', () => {
    expect(countXWeighted('a'.repeat(280))).toMatchObject({
      remaining: 0,
      overLimit: false,
    });
    expect(countXWeighted('a'.repeat(281))).toMatchObject({
      remaining: -1,
      overLimit: true,
    });
  });

  it('上限を指定できる', () => {
    expect(countXWeighted('あ'.repeat(3), 5).overLimit).toBe(true);
  });

  it('絵文字表示のシンボル（©️・❤️）はFE0F付きなら絵文字として2と数える', () => {
    expect(countXWeighted('©️').weighted).toBe(2);
    expect(countXWeighted('❤️').weighted).toBe(2);
  });

  it('結合文字（分解形のé）はNFCに正規化して1と数える', () => {
    expect(countXWeighted('é').weighted).toBe(1);
  });

  it('半角カナ・全角英数字は全角扱いで2と数える', () => {
    expect(countXWeighted('ｱ').weighted).toBe(2);
    expect(countXWeighted('ａ').weighted).toBe(2);
  });

  it('空白のみの入力は半角空白として数える（Xと同じ）', () => {
    expect(countXWeighted('   ').weighted).toBe(3);
  });

  it('CRLFの改行はそれぞれ1として数える', () => {
    expect(countXWeighted('a\r\nb').weighted).toBe(4);
  });

  it('大量の全角文字でも上限判定を正しく行える', () => {
    const result = countXWeighted('あ'.repeat(100000));
    expect(result.weighted).toBe(200000);
    expect(result.overLimit).toBe(true);
  });
});
