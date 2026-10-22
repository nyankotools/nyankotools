import { describe, expect, it } from 'vitest';
import { transform, upsideDownModeIds } from './upside-down-text';

describe('transform: upsideDown', () => {
  it('英字を反転して逆順に並べる', () => {
    const r = transform('hello', 'upsideDown');
    expect(r.output).toBe('ollǝɥ');
  });

  it('数字と記号を反転する', () => {
    expect(transform('1,2!', 'upsideDown').output).toBe('¡ᄅ‘Ɩ');
    expect(transform('(a)', 'upsideDown').output).toBe('(ɐ)');
  });

  it('日本語は残り、変換できなかった文字数を数える', () => {
    const r = transform('ab こんにちは', 'upsideDown');
    expect(r.output).toBe('はちにんこ qɐ');
    expect(r.converted).toBe(2);
    expect(r.unconverted).toBe(5);
  });

  it('空白と改行は数えず、行ごとに逆順にする', () => {
    const r = transform('ab\ncd', 'upsideDown');
    expect(r.output).toBe('qɐ\npɔ');
    expect(r.converted).toBe(4);
    expect(r.unconverted).toBe(0);
  });

  it('CRLFも行として扱う', () => {
    expect(transform('a\r\nb', 'upsideDown').output).toBe('ɐ\nq');
  });

  it('空文字は空を返す', () => {
    expect(transform('', 'upsideDown')).toEqual({
      output: '',
      converted: 0,
      unconverted: 0,
    });
  });

  it('大文字も反転する', () => {
    expect(transform('Nyanko', 'upsideDown').output).toBe('oʞuɐʎN');
  });
});

describe('transform: mirror', () => {
  it('左右反転した文字を逆順に並べる', () => {
    expect(transform('bad', 'mirror').output).toBe('bɒd');
    expect(transform('<a>', 'mirror').output).toBe('<ɒ>');
  });

  it('対応のない文字は残して数える', () => {
    const r = transform('a9日', 'mirror');
    expect(r.output).toBe('日9ɒ');
    expect(r.converted).toBe(1);
    expect(r.unconverted).toBe(2);
  });
});

describe('transform: reverse', () => {
  it('文字の置き換えをせず逆順にするだけ', () => {
    const r = transform('abc あい', 'reverse');
    expect(r.output).toBe('いあ cba');
    expect(r.unconverted).toBe(0);
  });

  it('絵文字（サロゲートペア）を壊さない', () => {
    expect(transform('a😀b', 'reverse').output).toBe('b😀a');
  });

  it('結合した絵文字を1文字として扱う', () => {
    expect(transform('a👨‍👩‍👧b', 'reverse').output).toBe('b👨‍👩‍👧a');
  });
});

it('モードIDは3種類', () => {
  expect(upsideDownModeIds).toHaveLength(3);
});

describe('大量入力・境界', () => {
  it('長文（1万文字）を逆順に変換できる', () => {
    const r = transform('a'.repeat(10_000), 'reverse');
    expect(r.output).toBe('a'.repeat(10_000));
    const m = transform('a'.repeat(10_000), 'mirror');
    expect(m.converted).toBe(10_000);
    expect(m.output.length).toBe(10_000);
  });

  it('全角空白だけの行は変換も数えもしない', () => {
    const r = transform('\u3000\u3000', 'upsideDown');
    expect(r.output).toBe('\u3000\u3000');
    expect(r.unconverted).toBe(0);
  });
});
