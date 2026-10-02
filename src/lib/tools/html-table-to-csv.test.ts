import { describe, it, expect } from 'vitest';
import { buildGrid, rowsToCsv, type RawTable } from './html-table-to-csv';

const cell = (text: string, colspan = 1, rowspan = 1) => ({
  text,
  colspan,
  rowspan,
});

describe('buildGrid', () => {
  it('結合のない表はそのまま二次元配列になる', () => {
    const table: RawTable = [
      [cell('a'), cell('b')],
      [cell('1'), cell('2')],
    ];
    expect(buildGrid(table, false)).toEqual([
      ['a', 'b'],
      ['1', '2'],
    ]);
  });

  it('colspan を展開する', () => {
    const table: RawTable = [[cell('t', 2)], [cell('a'), cell('b')]];
    expect(buildGrid(table, false)).toEqual([
      ['t', ''],
      ['a', 'b'],
    ]);
    expect(buildGrid(table, true)[0]).toEqual(['t', 't']);
  });

  it('rowspan を展開し、下の行の列位置をずらす', () => {
    const table: RawTable = [[cell('x', 1, 2), cell('a')], [cell('b')]];
    expect(buildGrid(table, false)).toEqual([
      ['x', 'a'],
      ['', 'b'],
    ]);
    expect(buildGrid(table, true)[1]).toEqual(['x', 'b']);
  });

  it('表の行数を超える rowspan は打ち切る', () => {
    expect(buildGrid([[cell('x', 1, 5)]], true)).toEqual([['x']]);
  });

  it('行ごとに列数が違う場合は最大幅にそろえる', () => {
    expect(buildGrid([[cell('a'), cell('b')], [cell('c')]], false)).toEqual([
      ['a', 'b'],
      ['c', ''],
    ]);
  });

  it('空の表は空配列', () => {
    expect(buildGrid([], false)).toEqual([]);
  });
});

describe('rowsToCsv', () => {
  it('区切り文字・引用符・改行を含む値をクォートする', () => {
    expect(
      rowsToCsv([
        ['a,b', 'say "hi"', 'x\ny'],
        ['1', '2', '3'],
      ]),
    ).toBe('"a,b","say ""hi""","x\ny"\n1,2,3\n');
  });

  it('区切り文字を切り替えられる', () => {
    expect(rowsToCsv([['a,b', 'c']], '\t')).toBe('a,b\tc\n');
    expect(rowsToCsv([['a;b', 'c']], ';')).toBe('"a;b";c\n');
  });

  it('1列だけの空値は "" にして行を消さない', () => {
    expect(rowsToCsv([['a'], ['']])).toBe('a\n""\n');
  });

  it('行がなければ空文字', () => {
    expect(rowsToCsv([])).toBe('');
  });
});
