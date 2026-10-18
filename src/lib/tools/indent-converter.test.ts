import { describe, expect, it } from 'vitest';
import {
  analyzeIndent,
  convertIndent,
  normalizeWidth,
} from './indent-converter';

describe('convertIndent', () => {
  it('タブをスペースに変換する', () => {
    expect(
      convertIndent('a\n\tb\n\t\tc', { mode: 'tabs-to-spaces', width: 4 }),
    ).toBe('a\n    b\n        c');
  });

  it('スペースをタブに変換し、端数はスペースで残す', () => {
    expect(
      convertIndent('    a\n      b\n  c', {
        mode: 'spaces-to-tabs',
        width: 4,
      }),
    ).toBe('\ta\n\t  b\n  c');
  });

  it('インデント幅を変更する', () => {
    expect(
      convertIndent('a\n  b\n    c\n      d', {
        mode: 'change-width',
        width: 2,
        toWidth: 4,
      }),
    ).toBe('a\n    b\n        c\n            d');
  });

  it('幅を狭める（端数は維持）', () => {
    expect(
      convertIndent('        a\n   b', {
        mode: 'change-width',
        width: 4,
        toWidth: 2,
      }),
    ).toBe('    a\n   b');
  });

  it('タブとスペースが混在していてもタブストップで換算する', () => {
    expect(convertIndent('  \tx', { mode: 'tabs-to-spaces', width: 4 })).toBe(
      '    x',
    );
  });

  it('行中のタブ・スペースは変更しない', () => {
    expect(
      convertIndent('\ta\tb  c', { mode: 'tabs-to-spaces', width: 2 }),
    ).toBe('  a\tb  c');
  });

  it('改行コードを保持する', () => {
    expect(
      convertIndent('\ta\r\n\tb\r\tc\n', { mode: 'tabs-to-spaces', width: 2 }),
    ).toBe('  a\r\n  b\r  c\n');
  });

  it('空文字と空白のみの行を扱える', () => {
    expect(convertIndent('', { mode: 'tabs-to-spaces', width: 4 })).toBe('');
    expect(convertIndent('\t\n\n', { mode: 'tabs-to-spaces', width: 2 })).toBe(
      '  \n\n',
    );
  });

  it('CRLF の文書でも行頭だけを変換する', () => {
    expect(
      convertIndent('\tif (a) {\r\n\t\tb();\r\n\t}\r\n', {
        mode: 'tabs-to-spaces',
        width: 4,
      }),
    ).toBe('    if (a) {\r\n        b();\r\n    }\r\n');
  });

  it('混在インデントを幅の段数と端数に分けて変換する（スペース→タブ）', () => {
    // 幅4: "  \t" は列4（タブストップ）→ 1段、"      " は 6桁 → 1段 + 端数2
    expect(
      convertIndent('  \ta\n      b', { mode: 'spaces-to-tabs', width: 4 }),
    ).toBe('\ta\n\t  b');
  });

  it('大量の行（1万行）でも全行を変換する', () => {
    const text = '\ta\n'.repeat(10000);
    const out = convertIndent(text, { mode: 'tabs-to-spaces', width: 2 });
    expect(out).toBe('  a\n'.repeat(10000));
  });

  it('不正な幅は丸める', () => {
    expect(convertIndent('\ta', { mode: 'tabs-to-spaces', width: 0 })).toBe(
      ' a',
    );
    expect(normalizeWidth(100)).toBe(16);
    expect(normalizeWidth(NaN)).toBe(4);
    expect(normalizeWidth(2.6)).toBe(3);
  });
});

describe('analyzeIndent', () => {
  it('インデントの種類ごとに行数を数える', () => {
    expect(analyzeIndent('a\n\tb\n  c\n \td\n')).toEqual({
      totalLines: 5,
      unindentedLines: 2,
      tabLines: 1,
      spaceLines: 1,
      mixedLines: 1,
    });
  });

  it('空文字はすべて0', () => {
    expect(analyzeIndent('').totalLines).toBe(0);
  });
});
