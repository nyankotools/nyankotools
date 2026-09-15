import { describe, expect, it } from 'vitest';
import { convertWidth, type ConversionOptions } from './zenkaku-hankaku';

const allOn: ConversionOptions = {
  alphanumeric: true,
  symbol: true,
  katakana: true,
  space: true,
};

describe('convertWidth toHalf', () => {
  it('全角英数字を半角に変換する', () => {
    expect(convertWidth('ＡＢＣ１２３', 'toHalf', allOn)).toBe('ABC123');
  });

  it('全角記号を半角に変換する', () => {
    expect(convertWidth('！＠＃', 'toHalf', allOn)).toBe('!@#');
  });

  it('全角カタカナを半角カタカナに変換する（濁点・半濁点含む）', () => {
    expect(convertWidth('ガギグゲゴパピプペポ', 'toHalf', allOn)).toBe(
      'ｶﾞｷﾞｸﾞｹﾞｺﾞﾊﾟﾋﾟﾌﾟﾍﾟﾎﾟ',
    );
  });

  it('全角スペースを半角スペースに変換する', () => {
    expect(convertWidth('あ　い', 'toHalf', allOn)).toBe('あ い');
  });

  it('ひらがなや漢字は変換しない', () => {
    expect(convertWidth('こんにちは漢字', 'toHalf', allOn)).toBe(
      'こんにちは漢字',
    );
  });

  it('オプションで無効にしたカテゴリは変換しない', () => {
    const options: ConversionOptions = {
      alphanumeric: true,
      symbol: false,
      katakana: false,
      space: false,
    };
    expect(convertWidth('ＡＢＣ！カナ　', 'toHalf', options)).toBe(
      'ABC！カナ　',
    );
  });
});

describe('convertWidth toFull', () => {
  it('半角英数字を全角に変換する', () => {
    expect(convertWidth('ABC123', 'toFull', allOn)).toBe('ＡＢＣ１２３');
  });

  it('半角記号を全角に変換する', () => {
    expect(convertWidth('!@#', 'toFull', allOn)).toBe('！＠＃');
  });

  it('半角カタカナを全角カタカナに変換する（濁点・半濁点含む）', () => {
    expect(convertWidth('ｶﾞｷﾞｸﾞｹﾞｺﾞﾊﾟﾋﾟﾌﾟﾍﾟﾎﾟ', 'toFull', allOn)).toBe(
      'ガギグゲゴパピプペポ',
    );
  });

  it('半角スペースを全角スペースに変換する', () => {
    expect(convertWidth('あ い', 'toFull', allOn)).toBe('あ　い');
  });
});

describe('convertWidth 往復変換', () => {
  it('半角→全角→半角で元の文字列に戻る', () => {
    const original = 'ABC123!@# ｶﾞｷﾞｸﾞｹﾞｺﾞ';
    const full = convertWidth(original, 'toFull', allOn);
    expect(convertWidth(full, 'toHalf', allOn)).toBe(original);
  });
});
