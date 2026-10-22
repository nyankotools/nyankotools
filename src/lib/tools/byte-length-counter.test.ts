import { describe, expect, it } from 'vitest';
import { countBytes, splitAtByteLimit } from './byte-length-counter';
import { encodeText } from './encoding-converter';

describe('countBytes', () => {
  it('空文字は0バイト', () => {
    for (const enc of ['utf-8', 'shift_jis', 'utf-16'] as const) {
      expect(countBytes('', enc).bytes).toBe(0);
    }
  });

  it('ASCII は UTF-8/Shift_JIS で1、UTF-16 で2バイト', () => {
    expect(countBytes('abc', 'utf-8').bytes).toBe(3);
    expect(countBytes('abc', 'shift_jis').bytes).toBe(3);
    expect(countBytes('abc', 'utf-16').bytes).toBe(6);
  });

  it('日本語は UTF-8 で3、Shift_JIS で2、UTF-16 で2バイト', () => {
    expect(countBytes('あ', 'utf-8').bytes).toBe(3);
    expect(countBytes('あ', 'shift_jis').bytes).toBe(2);
    expect(countBytes('あ', 'utf-16').bytes).toBe(2);
  });

  it('半角カナは Shift_JIS で1バイト', () => {
    expect(countBytes('ｱｲｳ', 'shift_jis').bytes).toBe(3);
  });

  it('サロゲートペアは UTF-8 / UTF-16 で4バイト、文字数は1', () => {
    const r = countBytes('😀', 'utf-8');
    expect(r.bytes).toBe(4);
    expect(r.characters).toBe(1);
    expect(countBytes('😀', 'utf-16').bytes).toBe(4);
  });

  it('Shift_JIS で表現できない文字は「?」1バイトとして数え、一覧に出す', () => {
    const r = countBytes('a😀b😀é', 'shift_jis');
    expect(r.bytes).toBe(5);
    expect(r.unmappable).toEqual(['😀', 'é']);
    expect(r.unmappableCount).toBe(3);
  });

  it('UTF-8 / UTF-16 では表現できない文字はない', () => {
    expect(countBytes('😀あ', 'utf-8').unmappable).toEqual([]);
    expect(countBytes('😀あ', 'utf-16').unmappableCount).toBe(0);
  });

  it('BOM 付きは UTF-8 で+3、UTF-16 で+2、Shift_JIS は変わらない', () => {
    expect(countBytes('a', 'utf-8', { bom: true }).bytes).toBe(4);
    expect(countBytes('a', 'utf-16', { bom: true }).bytes).toBe(4);
    expect(countBytes('a', 'shift_jis', { bom: true }).bytes).toBe(1);
  });

  it('改行を CRLF に統一すると改行が2バイトになる', () => {
    expect(countBytes('a\nb', 'utf-8', { newline: 'crlf' }).bytes).toBe(4);
    expect(countBytes('a\r\nb', 'utf-8', { newline: 'lf' }).bytes).toBe(3);
    expect(countBytes('a\nb', 'utf-8', { newline: 'keep' }).bytes).toBe(3);
  });

  it('encodeText の結果とバイト数が一致する', () => {
    const sample = 'テスト abc ｱｲｳ ～−①㈱髙😀é\n';
    expect(countBytes(sample, 'utf-8').bytes).toBe(
      encodeText(sample, 'utf-8').bytes.length,
    );
    expect(countBytes(sample, 'shift_jis').bytes).toBe(
      encodeText(sample, 'shift_jis').bytes.length,
    );
    expect(countBytes(sample, 'utf-16').bytes).toBe(
      encodeText(sample, 'utf-16le').bytes.length,
    );
  });
});

describe('splitAtByteLimit', () => {
  it('上限以内なら全体が head で超過なし', () => {
    const r = splitAtByteLimit('abc', 'utf-8', 3);
    expect(r.head).toBe('abc');
    expect(r.tail).toBe('');
    expect(r.overLimit).toBe(false);
    expect(r.remaining).toBe(0);
  });

  it('超過位置で分割し、超過バイト数を負の remaining で返す', () => {
    const r = splitAtByteLimit('abcdef', 'utf-8', 4);
    expect(r.head).toBe('abcd');
    expect(r.tail).toBe('ef');
    expect(r.overLimit).toBe(true);
    expect(r.remaining).toBe(-2);
    expect(r.headCharacters).toBe(4);
  });

  it('マルチバイト文字の途中では切らない', () => {
    const r = splitAtByteLimit('あいう', 'utf-8', 7);
    expect(r.head).toBe('あい');
    expect(r.headBytes).toBe(6);
    expect(r.tail).toBe('う');
  });

  it('入らない文字より後ろの小さい文字は head に含めない', () => {
    const r = splitAtByteLimit('aあb', 'utf-8', 2);
    expect(r.head).toBe('a');
    expect(r.tail).toBe('あb');
  });

  it('サロゲートペアを分割しない', () => {
    const r = splitAtByteLimit('a😀', 'utf-8', 4);
    expect(r.head).toBe('a');
    expect(r.tail).toBe('😀');
  });

  it('Shift_JIS では2バイト文字で数える', () => {
    const r = splitAtByteLimit('あいう', 'shift_jis', 4);
    expect(r.head).toBe('あい');
    expect(r.overLimit).toBe(true);
  });

  it('BOM 分を上限に含める', () => {
    const r = splitAtByteLimit('abc', 'utf-8', 4, { bom: true });
    expect(r.head).toBe('a');
    expect(r.headBytes).toBe(4);
  });

  it('上限0や不正な値でも落ちない', () => {
    expect(splitAtByteLimit('a', 'utf-8', 0).head).toBe('');
    expect(splitAtByteLimit('a', 'utf-8', -5).overLimit).toBe(true);
    expect(splitAtByteLimit('a', 'utf-8', NaN).head).toBe('');
    expect(splitAtByteLimit('', 'utf-8', 0).overLimit).toBe(false);
  });
});

describe('大量入力', () => {
  it('10万文字でもバイト数を正しく数える', () => {
    const big = 'あ'.repeat(100_000);
    expect(countBytes(big, 'utf-8').bytes).toBe(300_000);
    expect(countBytes(big, 'shift_jis').bytes).toBe(200_000);
    expect(countBytes(big, 'utf-16').characters).toBe(100_000);
  });

  it('長文の上限分割は UTF-8 の文字境界で切る', () => {
    const r = splitAtByteLimit('あ'.repeat(1000), 'utf-8', 255);
    expect(r.headCharacters).toBe(85);
    expect(r.headBytes).toBe(255);
    expect(r.head.length).toBe(85);
    expect(r.tail.length).toBe(915);
  });
});
