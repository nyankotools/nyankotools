import { describe, it, expect } from 'vitest';
import { generateSlug, generateSlugs, truncateSlug } from './slug-generator';

describe('generateSlug', () => {
  it('英語をハイフン区切りの小文字にする', () => {
    expect(generateSlug('Hello, World!  Foo')).toBe('hello-world-foo');
  });

  it('記号と連続した区切りを1つにまとめ、前後を除く', () => {
    expect(generateSlug('  --Hello___World--  ')).toBe('hello-world');
  });

  it('アンダースコア区切りを選べる', () => {
    expect(generateSlug('Hello World', { separator: '_' })).toBe('hello_world');
  });

  it('ひらがな・カタカナをヘボン式ローマ字にする', () => {
    expect(generateSlug('こんにちは 世界')).toBe('konnichiha');
    expect(generateSlug('ラーメン たべたい')).toBe('ramen-tabetai');
    expect(generateSlug('東京タワー')).toBe('tawa');
  });

  it('漢字を残すオプション', () => {
    expect(generateSlug('東京タワー', { kanji: 'keep' })).toBe('東京tawa');
    expect(generateSlug('2024年 まとめ', { kanji: 'keep' })).toBe(
      '2024年-matome',
    );
  });

  it('かな変換を切ると、かなは取り除かれる', () => {
    expect(generateSlug('abc ひらがな def', { convertKana: false })).toBe(
      'abc-def',
    );
  });

  it('全角英数字と半角カナを正規化する', () => {
    expect(generateSlug('ＡＢＣ１２３')).toBe('abc123');
    expect(generateSlug('ｶﾀｶﾅ')).toBe('katakana');
  });

  it('アクセント記号を取り除く', () => {
    expect(generateSlug('Café Résumé')).toBe('cafe-resume');
  });

  it('アポストロフィは詰める', () => {
    expect(generateSlug("Don't Stop")).toBe('dont-stop');
  });

  it('空文字や記号のみは空文字', () => {
    expect(generateSlug('')).toBe('');
    expect(generateSlug('！？…')).toBe('');
  });
});

describe('truncateSlug', () => {
  it('単語の区切りで切る', () => {
    expect(truncateSlug('hello-world-foo', 13, '-', true)).toBe('hello-world');
  });

  it('ちょうど区切りの手前なら単語を残す', () => {
    expect(truncateSlug('hello-world-foo', 11, '-', true)).toBe('hello-world');
  });

  it('単語の途中でも切れる', () => {
    expect(truncateSlug('hello-world-foo', 8, '-', false)).toBe('hello-wo');
  });

  it('切り口の区切りは除く', () => {
    expect(truncateSlug('hello-world', 6, '-', false)).toBe('hello');
  });

  it('1語しかなければ途中で切る', () => {
    expect(truncateSlug('abcdefghij', 5, '-', true)).toBe('abcde');
  });

  it('0以下は無制限', () => {
    expect(truncateSlug('hello-world', 0, '-', true)).toBe('hello-world');
  });
});

describe('generateSlugs', () => {
  it('行ごとに変換し、空行は保持する', () => {
    expect(generateSlugs('Hello World\n\nFoo Bar')).toEqual([
      'hello-world',
      '',
      'foo-bar',
    ]);
  });

  it('maxLength を各行に適用する', () => {
    expect(generateSlugs('aaa bbb ccc', { maxLength: 7 })).toEqual(['aaa-bbb']);
  });

  it('CRLF・CR の改行でも行ごとに変換する', () => {
    expect(generateSlugs('a b\r\nc d\re f')).toEqual(['a-b', 'c-d', 'e-f']);
  });
});

describe('generateSlug の入力パターン', () => {
  it('絵文字は取り除く', () => {
    expect(generateSlug('Hello 😀 World')).toBe('hello-world');
  });

  it('漢字を残すとき、最大文字数はコードポイント単位で数える', () => {
    expect(generateSlug('𠮷野家 abc', { kanji: 'keep', maxLength: 3 })).toBe(
      '𠮷野家',
    );
  });

  it('非常に長い入力でも最大文字数に収まる', () => {
    const result = generateSlug('a'.repeat(5000) + ' b', { maxLength: 10 });
    expect(result).toBe('a'.repeat(10));
  });
});
