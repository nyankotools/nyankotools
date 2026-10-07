import { describe, expect, it } from 'vitest';
import {
  inspectCodePoint,
  inspectText,
  lookupName,
  parseCodePoints,
  utf8Bytes,
  utf16Units,
} from './unicode-inspector';

describe('utf8Bytes / utf16Units', () => {
  it('ASCII・日本語・絵文字のバイト列', () => {
    expect(utf8Bytes(0x41)).toEqual([0x41]);
    expect(utf8Bytes(0x3042)).toEqual([0xe3, 0x81, 0x82]);
    expect(utf8Bytes(0xe9)).toEqual([0xc3, 0xa9]);
    expect(utf8Bytes(0x1f600)).toEqual([0xf0, 0x9f, 0x98, 0x80]);
    expect(utf16Units(0x1f600)).toEqual([0xd83d, 0xde00]);
    expect(utf16Units(0x3042)).toEqual([0x3042]);
  });
});

describe('inspectCodePoint', () => {
  it('ひらがな', () => {
    const i = inspectCodePoint('あ');
    expect(i.notation).toBe('U+3042');
    expect(i.utf8).toBe('E3 81 82');
    expect(i.utf16).toBe('3042');
    expect(i.category).toBe('Lo');
    expect(i.script).toBe('Hiragana');
    expect(i.block).toBe('Hiragana');
    expect(i.display).toBe('あ');
  });
  it('ASCII大文字は名称を持つ', () => {
    const i = inspectCodePoint('A');
    expect(i.category).toBe('Lu');
    expect(i.name).toBe('LATIN CAPITAL LETTER A');
  });
  it('絵文字', () => {
    const i = inspectCodePoint('😀');
    expect(i.notation).toBe('U+1F600');
    expect(i.utf16).toBe('D83D DE00');
    expect(i.isEmoji).toBe(true);
    expect(i.category).toBe('So');
  });
  it('数字や記号は絵文字扱いしない', () => {
    expect(inspectCodePoint('1').isEmoji).toBe(false);
    expect(inspectCodePoint('©').isEmoji).toBe(false);
  });
  it('制御文字・不可視文字', () => {
    expect(inspectCodePoint('\n').name).toBe('LINE FEED');
    expect(inspectCodePoint('\n').display).toBe('␊');
    const zwj = inspectCodePoint('‍');
    expect(zwj.category).toBe('Cf');
    expect(zwj.display).toBeNull();
    expect(zwj.isJoiner).toBe(true);
    expect(inspectCodePoint(' ').display).toBe('␣');
    expect(inspectCodePoint('　').display).toBeNull();
  });
  it('結合文字', () => {
    const i = inspectCodePoint('́');
    expect(i.category).toBe('Mn');
    expect(i.isJoiner).toBe(true);
    expect(i.display).toBe('◌́');
  });
  it('単独サロゲート', () => {
    const [i] = inspectText('\ud83d').chars;
    expect(i.category).toBe('Cs');
    expect(i.utf8).toBe('EF BF BD');
    expect(i.display).toBeNull();
  });
  it('私用領域・未割り当て', () => {
    expect(inspectCodePoint('').category).toBe('Co');
    expect(inspectCodePoint(String.fromCodePoint(0x10ffff)).category).toBe(
      'Cn',
    );
  });
});

describe('lookupName', () => {
  it('テーブルに無ければ null', () => {
    expect(lookupName(0x3042)).toBeNull();
    expect(lookupName(0x30)).toBe('DIGIT ZERO');
    expect(lookupName(0x1f1ef)).toBe('REGIONAL INDICATOR SYMBOL LETTER J');
    expect(lookupName(0xfe0f)).toBe('VARIATION SELECTOR-16');
  });
});

describe('inspectText', () => {
  it('ZWJ絵文字列をコードポイント単位に分解する', () => {
    const r = inspectText('👨‍👩‍👧');
    expect(r.chars.map((c) => c.notation)).toEqual([
      'U+1F468',
      'U+200D',
      'U+1F469',
      'U+200D',
      'U+1F467',
    ]);
    expect(r.summary.codePoints).toBe(5);
    expect(r.summary.utf16Length).toBe(8);
    expect(r.summary.graphemes).toBe(1);
  });
  it('結合文字の字素数', () => {
    const r = inspectText('é');
    expect(r.summary.codePoints).toBe(2);
    expect(r.summary.graphemes).toBe(1);
    expect(r.summary.utf8Length).toBe(3);
  });
  it('空文字', () => {
    const r = inspectText('');
    expect(r.chars).toEqual([]);
    expect(r.summary.codePoints).toBe(0);
  });
  it('上限を超えると切り捨てるが集計は全体', () => {
    const r = inspectText('abcde', 3);
    expect(r.chars).toHaveLength(3);
    expect(r.truncated).toBe(true);
    expect(r.summary.codePoints).toBe(5);
  });
});

describe('parseCodePoints', () => {
  it('各種表記を文字に戻す', () => {
    expect(
      parseCodePoints('U+3042 u+1F600 0x41 \\u{1F431} &#x30A2; 3044').text,
    ).toBe('あ😀A🐱アい');
  });
  it('カンマ・改行区切り', () => {
    expect(parseCodePoints('U+41,U+42\nU+43').text).toBe('ABC');
  });
  it('不正トークンと範囲外を invalid に集める', () => {
    const r = parseCodePoints('U+41 zzz U+110000 U+42');
    expect(r.text).toBe('AB');
    expect(r.invalid).toEqual(['zzz', 'U+110000']);
  });
  it('空入力', () => {
    expect(parseCodePoints('  ')).toEqual({ text: '', invalid: [] });
  });
});
