import { describe, expect, it } from 'vitest';
import { convertKana } from './kana-converter';

describe('convertKana toKatakana', () => {
  it('ひらがなをカタカナに変換する', () => {
    expect(convertKana('ひらがな', 'toKatakana')).toBe('ヒラガナ');
  });

  it('濁音・半濁音・拗音・促音を変換する', () => {
    expect(convertKana('がっこう　しゃしん　ぱん', 'toKatakana')).toBe(
      'ガッコウ　シャシン　パン',
    );
  });

  it('「ゔ」を「ヴ」に変換する', () => {
    expect(convertKana('ゔぁいおりん', 'toKatakana')).toBe('ヴァイオリン');
  });

  it('踊り字「ゝ」「ゞ」を変換する', () => {
    expect(convertKana('ひゝ もゞ', 'toKatakana')).toBe('ヒヽ モヾ');
  });

  it('漢字・英数字・記号は変換しない', () => {
    expect(convertKana('漢字123abc！', 'toKatakana')).toBe('漢字123abc！');
  });

  it('長音符「ー」はそのまま', () => {
    expect(convertKana('らーめん', 'toKatakana')).toBe('ラーメン');
  });
});

describe('convertKana toHiragana', () => {
  it('カタカナをひらがなに変換する', () => {
    expect(convertKana('カタカナ', 'toHiragana')).toBe('かたかな');
  });

  it('濁音・半濁音・拗音・促音を変換する', () => {
    expect(convertKana('ガッコウ　シャシン　パン', 'toHiragana')).toBe(
      'がっこう　しゃしん　ぱん',
    );
  });

  it('「ヴ」を「ゔ」に変換する', () => {
    expect(convertKana('ヴァイオリン', 'toHiragana')).toBe('ゔぁいおりん');
  });

  it('踊り字「ヽ」「ヾ」を変換する', () => {
    expect(convertKana('ヒヽ モヾ', 'toHiragana')).toBe('ひゝ もゞ');
  });

  it('漢字・ひらがな・記号は変換しない', () => {
    expect(convertKana('漢字とひらがな123', 'toHiragana')).toBe(
      '漢字とひらがな123',
    );
  });

  it('長音符「ー」はそのまま', () => {
    expect(convertKana('ラーメン', 'toHiragana')).toBe('らーめん');
  });
});

describe('convertKana 往復変換', () => {
  it('ひらがな→カタカナ→ひらがなで元の文字列に戻る', () => {
    const original = 'がっこうへ行く。ゔぁいおりんを弾く。';
    const katakana = convertKana(original, 'toKatakana');
    expect(convertKana(katakana, 'toHiragana')).toBe(original);
  });
});
