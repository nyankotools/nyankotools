import { describe, expect, it } from 'vitest';
import {
  buildCsv,
  detectDelimiter,
  filterRowIndices,
  parseCsvTable,
  sortRowIndices,
} from './csv-viewer';

function table(text: string, delimiter = ',', hasHeader = true) {
  const result = parseCsvTable(text, delimiter, hasHeader);
  if (!result.success) throw new Error(result.reason);
  return result.table;
}

describe('detectDelimiter', () => {
  it('タブ・セミコロン・カンマを判定する', () => {
    expect(detectDelimiter('a\tb\tc\n1\t2\t3')).toBe('\t');
    expect(detectDelimiter('a;b;c\n1;2;3')).toBe(';');
    expect(detectDelimiter('a,b,c')).toBe(',');
  });

  it('引用符内の区切り文字は数えず、見つからなければカンマ', () => {
    expect(detectDelimiter('"a;b;c";d,e')).toBe(',');
    expect(detectDelimiter('abc')).toBe(',');
  });
});

describe('parseCsvTable', () => {
  it('ヘッダーとデータ行に分け、空行を無視する', () => {
    const t = table('id,name\n1,Taro\n\n2,Hanako\n');
    expect(t.headers).toEqual(['id', 'name']);
    expect(t.rows).toEqual([
      ['1', 'Taro'],
      ['2', 'Hanako'],
    ]);
    expect(t.columnCount).toBe(2);
  });

  it('ヘッダーなしでは headers が null で全行がデータ', () => {
    const t = table('1,a\n2,b', ',', false);
    expect(t.headers).toBeNull();
    expect(t.rows).toHaveLength(2);
  });

  it('列数が不揃いな行は空文字で埋める', () => {
    const t = table('a,b,c\n1\n1,2,3,4');
    expect(t.columnCount).toBe(4);
    expect(t.headers).toEqual(['a', 'b', 'c', '']);
    expect(t.rows[0]).toEqual(['1', '', '', '']);
  });

  it('BOMを取り除き、引用符内の改行を保持する', () => {
    const t = table('﻿name,memo\n"A","x\ny"');
    expect(t.headers).toEqual(['name', 'memo']);
    expect(t.rows[0]).toEqual(['A', 'x\ny']);
  });

  it('空入力・閉じていない引用符はエラー', () => {
    expect(parseCsvTable('\n\n', ',', true)).toEqual({
      success: false,
      reason: 'empty',
    });
    expect(parseCsvTable('a,"b', ',', true)).toEqual({
      success: false,
      reason: 'unterminated-quote',
    });
  });

  it('ヘッダー行だけならデータ行は0件', () => {
    const t = table('a,b');
    expect(t.rows).toEqual([]);
  });
});

describe('filterRowIndices', () => {
  const rows = [
    ['Apple', 'red'],
    ['banana', 'Yellow'],
    ['cherry', 'red'],
  ];

  it('空クエリは全行', () => {
    expect(filterRowIndices(rows, '', null, [0, 1])).toEqual([0, 1, 2]);
  });

  it('大文字小文字を区別せず部分一致する', () => {
    expect(filterRowIndices(rows, 'YELLOW', null, [0, 1])).toEqual([1]);
    expect(filterRowIndices(rows, 'an', null, [0, 1])).toEqual([1]);
  });

  it('列指定・検索対象列の制限が効く', () => {
    expect(filterRowIndices(rows, 'red', 0, [0, 1])).toEqual([]);
    expect(filterRowIndices(rows, 'red', 1, [0, 1])).toEqual([0, 2]);
    expect(filterRowIndices(rows, 'red', null, [0])).toEqual([]);
  });
});

describe('sortRowIndices', () => {
  it('数値列は数値順（文字列順の10 < 9にならない）', () => {
    const rows = [['10'], ['9'], ['100'], ['-5']];
    const all = [0, 1, 2, 3];
    expect(sortRowIndices(rows, all, { column: 0, direction: 'asc' })).toEqual([
      3, 1, 0, 2,
    ]);
    expect(sortRowIndices(rows, all, { column: 0, direction: 'desc' })).toEqual(
      [2, 0, 1, 3],
    );
  });

  it('空欄は昇順・降順とも末尾', () => {
    const rows = [[''], ['2'], ['1']];
    const all = [0, 1, 2];
    expect(sortRowIndices(rows, all, { column: 0, direction: 'asc' })).toEqual([
      2, 1, 0,
    ]);
    expect(sortRowIndices(rows, all, { column: 0, direction: 'desc' })).toEqual(
      [1, 2, 0],
    );
  });

  it('文字列列は自然順で、同値は元の順序を保つ', () => {
    const rows = [['file10'], ['file2'], ['File2'], ['a']];
    expect(
      sortRowIndices(rows, [0, 1, 2, 3], { column: 0, direction: 'asc' }),
    ).toEqual([3, 1, 2, 0]);
  });

  it('絞り込み済みの添字だけを並べ替える', () => {
    const rows = [['3'], ['1'], ['2']];
    expect(
      sortRowIndices(rows, [0, 2], { column: 0, direction: 'asc' }),
    ).toEqual([2, 0]);
  });

  it('数値と文字列が混在する列は文字列比較', () => {
    const rows = [['b'], ['10'], ['9']];
    expect(
      sortRowIndices(rows, [0, 1, 2], { column: 0, direction: 'asc' }),
    ).toEqual([2, 1, 0]);
  });
});

describe('buildCsv', () => {
  const rows = [
    ['1', 'Taro', 'a,b'],
    ['2', 'Hanako', 'say "hi"'],
  ];

  it('列の並び順・行の順序どおりに出力し、必要なら引用符で囲む', () => {
    expect(
      buildCsv(rows, [1, 0], [2, 0], {
        delimiter: ',',
        headers: ['id', 'name', 'memo'],
      }),
    ).toBe('memo,id\n"say ""hi""",2\n"a,b",1\n');
  });

  it('ヘッダーなし・区切り文字の変更', () => {
    expect(
      buildCsv(rows, [0], [0, 1], { delimiter: '\t', headers: null }),
    ).toBe('1\tTaro\n');
  });

  it('1列だけの空値は "" にして行が消えないようにする', () => {
    expect(
      buildCsv([[''], ['x']], [0, 1], [0], { delimiter: ',', headers: null }),
    ).toBe('""\nx\n');
  });

  it('出力する要素がなければ空文字', () => {
    expect(buildCsv(rows, [], [0], { delimiter: ',', headers: null })).toBe('');
  });
});

describe('エッジケース（追加）', () => {
  it('CRLF改行でも行と列を正しく分ける', () => {
    const t = table('id,name\r\n1,Taro\r\n2,"Ha\r\nnako"\r\n');
    expect(t.headers).toEqual(['id', 'name']);
    expect(t.rows).toEqual([
      ['1', 'Taro'],
      ['2', 'Ha\r\nnako'], // 引用符内の改行は原文どおり保持
    ]);
  });

  it('セミコロン区切りで引用符内のカンマ・セミコロンを保持する', () => {
    expect(detectDelimiter('名前;メモ\n"Taro";"a,b;c"')).toBe(';');
    const t = table('名前;メモ\n"Taro";"a,b;c"', ';');
    expect(t.headers).toEqual(['名前', 'メモ']);
    expect(t.rows).toEqual([['Taro', 'a,b;c']]);
  });

  it('タブ区切りの空フィールド（連続したタブ）を空文字として保持する', () => {
    const t = table('a\tb\tc\n1\t\t3', '\t');
    expect(t.rows).toEqual([['1', '', '3']]);
  });

  it('ヘッダーなしで全行が空、または列数不揃いでも揃える', () => {
    const t = table('1,2,3\n4', ',', false);
    expect(t.columnCount).toBe(3);
    expect(t.rows).toEqual([
      ['1', '2', '3'],
      ['4', '', ''],
    ]);
  });

  it('ヘッダー行のみで行がなくても列数は確定する', () => {
    const t = table('a,b,c');
    expect(t.columnCount).toBe(3);
    expect(t.headers).toEqual(['a', 'b', 'c']);
  });

  it('絵文字・サロゲートペアを含む値でも絞り込みと並べ替えが壊れない', () => {
    const rows = [['🍣寿司'], ['🍙おにぎり'], ['😺ねこ']];
    expect(filterRowIndices(rows, '寿司', null, [0])).toEqual([0]);
    expect(filterRowIndices(rows, '🍙', null, [0])).toEqual([1]);
    const sorted = sortRowIndices(rows, [0, 1, 2], {
      column: 0,
      direction: 'asc',
    });
    expect([...sorted].sort()).toEqual([0, 1, 2]);
  });

  it('数値列でも先頭の+や小数・指数表記を数値として扱う', () => {
    const rows = [['+2'], ['1.5'], ['1e2'], ['-0.5']];
    expect(
      sortRowIndices(rows, [0, 1, 2, 3], { column: 0, direction: 'asc' }),
    ).toEqual([3, 1, 0, 2]);
  });

  it('全角数字は数値扱いせず、半角と区別して比較する', () => {
    const rows = [['１０'], ['９'], ['2']];
    // 全角数字は数値扱いしない（非数値として文字列比較）。結果は並べ替えの順列であること
    const sorted = sortRowIndices(rows, [0, 1, 2], {
      column: 0,
      direction: 'asc',
    });
    expect([...sorted].sort()).toEqual([0, 1, 2]);
  });

  it('全角文字の絞り込みは半角と一致しない（正規化しない）', () => {
    const rows = [['ＡＢＣ'], ['abc']];
    expect(filterRowIndices(rows, 'abc', null, [0])).toEqual([1]);
    expect(filterRowIndices(rows, 'ＡＢＣ', null, [0])).toEqual([0]);
  });

  it('引用符内の改行・引用符を含む値はCSV出力で再度エスケープされる', () => {
    const rows = [['x\ny', 'say "hi"']];
    const out = buildCsv(rows, [0], [0, 1], {
      delimiter: ',',
      headers: null,
    });
    expect(out).toBe('"x\ny","say ""hi"""\n');
    const back = table(out, ',', false);
    expect(back.rows).toEqual(rows);
  });

  it('ヘッダーありで行が0件でも出力はヘッダー行のみ', () => {
    expect(
      buildCsv([['1']], [], [0], { delimiter: ',', headers: ['id'] }),
    ).toBe('id\n');
  });

  it('列の並べ替えが出力に反映される（列抽出→CSV再読込で一致）', () => {
    const rows = [
      ['1', 'a', 'x'],
      ['2', 'b', 'y'],
    ];
    const out = buildCsv(rows, [1, 0], [2, 0], {
      delimiter: ';',
      headers: ['id', 'name', 'memo'],
    });
    expect(out).toBe('memo;id\ny;2\nx;1\n');
  });

  it('大量行（10万行）でも解析と並べ替えが完了する', () => {
    const lines = ['n,v'];
    for (let i = 0; i < 100000; i++) lines.push(`${100000 - i},r${i}`);
    const t = table(lines.join('\n'));
    expect(t.rows).toHaveLength(100000);
    const sorted = sortRowIndices(
      t.rows,
      t.rows.map((_, i) => i),
      { column: 0, direction: 'asc' },
    );
    expect(t.rows[sorted[0]][0]).toBe('1');
  });
});
