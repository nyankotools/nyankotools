import { describe, expect, it } from 'vitest';
import { nameVariant, normalizeName, VARIANT_MAX } from './normalize';

describe('normalize', () => {
  it('全角・半角、大文字・小文字、空白の違いを吸収する', () => {
    expect(normalizeName(' Ｎｙａｎｋｏ　Ｔａｒｏ ')).toBe('nyankotaro');
    expect(normalizeName('ﾈｺ')).toBe('ネコ');
    for (const invisible of ['200B', '00AD', '200E', '3164', 'FE0F']) {
      const ch = String.fromCharCode(parseInt(invisible, 16));
      expect(normalizeName(`ね${ch}こ`)).toBe('ねこ');
    }
  });

  it('濁点の分解形と合成形、半角カナの濁点・半濁点は同じ名前になる', () => {
    expect(normalizeName('ゔ')).toBe(normalizeName('ゔ'));
    expect(normalizeName('が')).toBe(normalizeName('が'));
    expect(normalizeName('ｶﾞ')).toBe('ガ');
    expect(normalizeName('ﾊﾟ')).toBe('パ');
  });

  it('全角の英数字・記号は半角と同じ名前になる', () => {
    expect(normalizeName('１２３－ＡＢＣ')).toBe('123-abc');
    expect(normalizeName('ＮＹＡＮＫＯ')).toBe(normalizeName('nyanko'));
  });

  it('正規化を繰り返しても結果が変わらない（冪等）', () => {
    for (const s of [
      'İstanbul',
      'ｶﾞ',
      'ゔ',
      '１２３',
      ' Ｎｙａｎｋｏ　',
      'ねこ​たま',
    ]) {
      const once = normalizeName(s);
      expect(normalizeName(once)).toBe(once);
    }
  });

  it('ひらがなとカタカナは別の名前として扱う', () => {
    expect(normalizeName('ねこ')).not.toBe(normalizeName('ネコ'));
  });

  it('名前なし（空白・見えない文字のみ）は variant 0', () => {
    expect(nameVariant('')).toBe(0);
    expect(nameVariant(' 　\n')).toBe(0);
    expect(nameVariant('​‍')).toBe(0);
  });

  it('名前ありは 1〜4095 で、表記ゆれでは変わらない', () => {
    const v = nameVariant('たま');
    expect(v).toBeGreaterThanOrEqual(1);
    expect(v).toBeLessThanOrEqual(VARIANT_MAX);
    expect(nameVariant(' たま ')).toBe(v);
    expect(nameVariant('TAMA')).toBe(nameVariant('ｔａｍａ'));
    expect(nameVariant('ゔ')).toBe(nameVariant('ゔ'));
  });

  it('多数の名前で 1〜4095 に散らばる', () => {
    const seen = new Set<number>();
    for (let i = 0; i < 20000; i++) {
      const v = nameVariant(`name${i}`);
      expect(v).toBeGreaterThanOrEqual(1);
      expect(v).toBeLessThanOrEqual(VARIANT_MAX);
      seen.add(v);
    }
    expect(seen.size).toBeGreaterThan(4000);
  });
});
