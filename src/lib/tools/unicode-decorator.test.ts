import { describe, it, expect } from 'vitest';
import { decorate, decorateAll, decoratorStyleIds } from './unicode-decorator';

describe('decorate', () => {
  it('太字・斜体など数学用英数字記号へ変換する', () => {
    expect(decorate('Abc1', 'bold')).toBe('𝐀𝐛𝐜𝟏');
    expect(decorate('Abc', 'sansBold')).toBe('𝗔𝗯𝗰');
    expect(decorate('Ab', 'monospace')).toBe('𝙰𝚋');
  });

  it('連番から外れる文字は専用の字形に置き換える', () => {
    expect(decorate('h', 'italic')).toBe('ℎ');
    expect(decorate('BEFHILMR', 'script')).toBe('ℬℰℱℋℐℒℳℛ');
    expect(decorate('ego', 'script')).toBe('ℯℊℴ');
    expect(decorate('CHIRZ', 'fraktur')).toBe('ℭℌℑℜℨ');
    expect(decorate('CHNPQRZ', 'doubleStruck')).toBe('ℂℍℕℙℚℝℤ');
  });

  it('日本語・記号・対応のない文字はそのまま残す', () => {
    expect(decorate('こんにちは!', 'bold')).toBe('こんにちは!');
    expect(decorate('1', 'italic')).toBe('1');
  });

  it('絵文字（サロゲートペア）を壊さない', () => {
    expect(decorate('a😀b', 'bold')).toBe('𝐚😀𝐛');
  });

  it('全角・丸文字・小文字大文字', () => {
    expect(decorate('Ab 1!', 'fullwidth')).toBe('Ａｂ　１！');
    expect(decorate('Az09', 'circled')).toBe('Ⓐⓩ⓪⑨');
    expect(decorate('aB', 'negativeSquared')).toBe('🅰🅱');
    expect(decorate('ab1', 'parenthesized')).toBe('⒜⒝⑴');
    expect(decorate('Hello', 'smallCaps')).toBe('ʜᴇʟʟᴏ');
  });

  it('上下反転は文字を入れ替えて逆順にする', () => {
    expect(decorate('abc', 'flipped')).toBe('ɔqɐ');
    expect(decorate('Hello!', 'flipped')).toBe('¡ollǝH');
    expect(decorate('a\nbc', 'flipped')).toBe('ɐ\nɔq');
  });

  it('結合文字を1文字ごとに付ける（改行には付けない）', () => {
    expect(decorate('ab', 'strikethrough')).toBe('a̶b̶');
    expect(decorate('a\nb', 'underline')).toBe('a̲\nb̲');
    expect(decorate('日本', 'slash')).toBe('日̸本̸');
  });

  it('前後に飾りを付ける（空文字列には付けない）', () => {
    expect(decorate('猫', 'wrapKakko')).toBe('『猫』');
    expect(decorate('', 'wrapStar')).toBe('');
  });

  it('空文字列はどの装飾でも空', () => {
    for (const id of decoratorStyleIds) {
      expect(decorate('', id)).toBe('');
    }
  });
});

describe('decorateAll', () => {
  it('全スタイルを定義順に返す', () => {
    const results = decorateAll('Nyanko');
    expect(results.map((r) => r.id)).toEqual([...decoratorStyleIds]);
    expect(results.every((r) => r.output.length > 0)).toBe(true);
  });
});

describe('edge cases', () => {
  it('100文字以上の長いテキストを処理できる', () => {
    const longText = 'a'.repeat(500);
    const result = decorate(longText, 'bold');
    expect(result.length).toBeGreaterThan(500);
    expect(result).not.toContain('a');
  });

  it('複数行のテキストをflipped装飾で処理する', () => {
    const multiline = 'abc\ndef';
    const result = decorate(multiline, 'flipped');
    const lines = result.split('\n');
    expect(lines).toHaveLength(2);
    expect(lines[0]).toBe('ɔqɐ');
    expect(lines[1]).toBe('ɟǝp');
  });

  it('CRLFを含むテキストをflipped装飾で処理する', () => {
    const text = 'ab\r\ncd';
    const result = decorate(text, 'flipped');
    expect(result).toContain('\n');
    const lines = result.split('\n');
    expect(lines).toHaveLength(2);
  });

  it('tab文字を含むテキストを処理する', () => {
    const text = 'a\tb';
    const result = decorate(text, 'bold');
    expect(result).toContain('\t');
  });

  it('数学用英数字記号の「穴」を正しく処理する', () => {
    // CircledNumbers: 0 は ⓪、1-9 は ①-⑨ だが、通常の0-9と異なる
    const digits = '0123456789';
    const result = decorate(digits, 'circled');
    expect(result).toBe('⓪①②③④⑤⑥⑦⑧⑨');
  });

  it('結合文字スタイルで改行以外のすべての文字に装飾を付ける', () => {
    const text = ' a \n b ';
    const result = decorate(text, 'strikethrough');
    // 改行以外の文字（空白も含む）に取り消し線を付ける
    expect(result).toBe(' ̶a̶ ̶\n ̶b̶ ̶');
  });

  it('フルウィジ変換は半角スペースをフルウィジスペースに変換', () => {
    const text = 'A 1 a';
    const result = decorate(text, 'fullwidth');
    expect(result).toBe('Ａ　１　ａ');
  });
});
