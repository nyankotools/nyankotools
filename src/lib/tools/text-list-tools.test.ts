import { describe, expect, it } from 'vitest';
import {
  processTextList,
  splitIntoLines,
  type TextListOptions,
} from './text-list-tools';

const baseOptions: TextListOptions = {
  trimLines: false,
  removeEmptyLines: false,
  dedupe: false,
  caseInsensitive: false,
  sortOrder: 'none',
};

describe('splitIntoLines', () => {
  it('空文字は空配列になる', () => {
    expect(splitIntoLines('')).toEqual([]);
  });

  it('LF/CRLF/CRいずれの改行でも分割できる', () => {
    expect(splitIntoLines('a\nb\r\nc\rd')).toEqual(['a', 'b', 'c', 'd']);
  });
});

describe('processTextList', () => {
  it('何も指定しなければ行の内容と順序をそのまま保つ', () => {
    expect(processTextList('b\na\nb', baseOptions)).toEqual(['b', 'a', 'b']);
  });

  it('trimLinesで各行の前後の空白を削除する', () => {
    expect(
      processTextList('  a  \n b ', { ...baseOptions, trimLines: true }),
    ).toEqual(['a', 'b']);
  });

  it('removeEmptyLinesで空行を削除する', () => {
    expect(
      processTextList('a\n\nb\n', { ...baseOptions, removeEmptyLines: true }),
    ).toEqual(['a', 'b']);
  });

  it('dedupeで最初に出現した行を残して重複を削除する', () => {
    expect(
      processTextList('a\nb\na\nc\nb', { ...baseOptions, dedupe: true }),
    ).toEqual(['a', 'b', 'c']);
  });

  it('caseInsensitive指定時、大文字小文字違いも重複とみなす', () => {
    expect(
      processTextList('Apple\napple\nBanana', {
        ...baseOptions,
        dedupe: true,
        caseInsensitive: true,
      }),
    ).toEqual(['Apple', 'Banana']);
  });

  it('sortOrder: ascで昇順ソートする', () => {
    expect(
      processTextList('banana\napple\ncherry', {
        ...baseOptions,
        sortOrder: 'asc',
      }),
    ).toEqual(['apple', 'banana', 'cherry']);
  });

  it('sortOrder: descで降順ソートする', () => {
    expect(
      processTextList('banana\napple\ncherry', {
        ...baseOptions,
        sortOrder: 'desc',
      }),
    ).toEqual(['cherry', 'banana', 'apple']);
  });

  it('sortOrder: ascかつcaseInsensitiveで大文字小文字を無視して並び替える', () => {
    expect(
      processTextList('banana\nApple\ncherry', {
        ...baseOptions,
        sortOrder: 'asc',
        caseInsensitive: true,
      }),
    ).toEqual(['Apple', 'banana', 'cherry']);
  });

  it('sortOrder: numericAscで行内の数値を基準に昇順ソートする', () => {
    expect(
      processTextList('item10\nitem2\nitem1', {
        ...baseOptions,
        sortOrder: 'numericAsc',
      }),
    ).toEqual(['item1', 'item2', 'item10']);
  });

  it('sortOrder: numericDescで行内の数値を基準に降順ソートする', () => {
    expect(
      processTextList('item10\nitem2\nitem1', {
        ...baseOptions,
        sortOrder: 'numericDesc',
      }),
    ).toEqual(['item10', 'item2', 'item1']);
  });

  it('数値を含まない行は数値ソートの末尾に元の順序でまとまる', () => {
    expect(
      processTextList('3\nfoo\n1\nbar', {
        ...baseOptions,
        sortOrder: 'numericAsc',
      }),
    ).toEqual(['1', '3', 'foo', 'bar']);
  });

  it('sortOrder: shuffleでは指定した乱数源に従って決定的に並び替わる', () => {
    // Fisher-Yatesアルゴリズムに常に0を返す乱数源を渡した場合の並び順を固定して検証する
    expect(
      processTextList(
        'a\nb\nc\nd',
        { ...baseOptions, sortOrder: 'shuffle' },
        () => 0,
      ),
    ).toEqual(['b', 'c', 'd', 'a']);
  });

  it('複数のオプションを組み合わせて適用できる', () => {
    expect(
      processTextList('  b  \n\n a \n b \n c ', {
        trimLines: true,
        removeEmptyLines: true,
        dedupe: true,
        caseInsensitive: false,
        sortOrder: 'asc',
      }),
    ).toEqual(['a', 'b', 'c']);
  });
});
