import { describe, expect, it } from 'vitest';
import { replaceWithRegex, testRegex } from './regex-tester';

describe('testRegex', () => {
  it('パターンが空文字なら空のマッチ結果を返す', () => {
    const result = testRegex('', '', 'こんにちは');
    expect(result).toEqual({ isValid: true, error: null, matches: [] });
  });

  it('不正な正規表現はエラーを返す', () => {
    const result = testRegex('(', '', 'abc');
    expect(result.isValid).toBe(false);
    expect(result.error).not.toBeNull();
    expect(result.matches).toEqual([]);
  });

  it('gフラグがなくても全てのマッチを検出する', () => {
    const result = testRegex('\\d+', '', 'a1 b22 c333');
    expect(result.isValid).toBe(true);
    expect(result.matches.map((m) => m.match)).toEqual(['1', '22', '333']);
  });

  it('マッチ位置を正しく返す', () => {
    const result = testRegex('b', '', 'abc');
    expect(result.matches[0]).toMatchObject({ match: 'b', index: 1 });
  });

  it('iフラグで大文字小文字を区別しない', () => {
    const result = testRegex('abc', 'i', 'ABC def abc');
    expect(result.matches.map((m) => m.match)).toEqual(['ABC', 'abc']);
  });

  it('キャプチャグループを取得する', () => {
    const result = testRegex('(\\d+)-(\\d+)', '', '2024-01');
    expect(result.matches[0].groups).toEqual([
      { name: null, value: '2024' },
      { name: null, value: '01' },
    ]);
  });

  it('名前付きキャプチャグループを取得する', () => {
    const result = testRegex('(?<year>\\d+)-(?<month>\\d+)', '', '2024-01');
    expect(result.matches[0].groups).toEqual([
      { name: 'year', value: '2024' },
      { name: 'month', value: '01' },
    ]);
  });

  it('mフラグで行頭・行末にマッチする', () => {
    const result = testRegex('^b', 'm', 'a\nb\nc');
    expect(result.matches).toHaveLength(1);
  });

  it('sフラグで . が改行にもマッチする', () => {
    const withoutS = testRegex('a.b', '', 'a\nb');
    const withS = testRegex('a.b', 's', 'a\nb');
    expect(withoutS.matches).toHaveLength(0);
    expect(withS.matches).toHaveLength(1);
  });
});

describe('replaceWithRegex', () => {
  it('パターンが空文字なら元のテキストをそのまま返す', () => {
    expect(replaceWithRegex('', '', 'abc', 'X')).toEqual({
      result: 'abc',
      error: null,
    });
  });

  it('マッチした箇所を置換する', () => {
    expect(replaceWithRegex('\\d+', '', 'a1 b22', 'X')).toEqual({
      result: 'aX bX',
      error: null,
    });
  });

  it('後方参照を使った置換ができる', () => {
    const result = replaceWithRegex('(\\d+)-(\\d+)', '', '2024-01', '$2/$1');
    expect(result).toEqual({ result: '01/2024', error: null });
  });

  it('不正な正規表現はエラーを返し元のテキストを維持する', () => {
    const result = replaceWithRegex('(', '', 'abc', 'X');
    expect(result.result).toBe('abc');
    expect(result.error).not.toBeNull();
  });
});
