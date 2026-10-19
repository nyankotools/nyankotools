import { describe, expect, it } from 'vitest';
import {
  createTable,
  deleteColumn,
  deleteRow,
  displayWidth,
  escapeCell,
  formatMarkdownTable,
  insertColumn,
  insertRow,
  moveColumn,
  moveRow,
  parseMarkdownTable,
  setAlign,
  setCell,
  splitRow,
  unescapeCell,
  type TableModel,
} from './markdown-table-editor';

const sample: TableModel = {
  cells: [
    ['name', 'age'],
    ['Tanaka', '30'],
    ['Sato', '25'],
  ],
  aligns: ['left', 'right'],
};

describe('formatMarkdownTable', () => {
  it('列幅をそろえて整形する', () => {
    expect(formatMarkdownTable(sample, { pad: true })).toBe(
      [
        '| name   | age |',
        '| :----- | --: |',
        '| Tanaka |  30 |',
        '| Sato   |  25 |',
      ].join('\n'),
    );
  });

  it('コンパクト出力は余白を入れない', () => {
    expect(formatMarkdownTable(sample, { pad: false })).toBe(
      '| name | age |\n| :-- | --: |\n| Tanaka | 30 |\n| Sato | 25 |',
    );
  });

  it('全角は幅2で数える', () => {
    const model: TableModel = {
      cells: [['名前'], ['a']],
      aligns: ['none'],
    };
    expect(formatMarkdownTable(model, { pad: true })).toBe(
      '| 名前 |\n| ---- |\n| a    |',
    );
  });

  it('中央揃えは区切り行が :-: になる', () => {
    const model: TableModel = { cells: [['a'], ['b']], aligns: ['center'] };
    expect(formatMarkdownTable(model, { pad: true })).toBe(
      '|  a  |\n| :-: |\n|  b  |',
    );
  });

  it('| と改行をエスケープする', () => {
    const model: TableModel = {
      cells: [['h'], ['a|b\nc']],
      aligns: ['none'],
    };
    expect(formatMarkdownTable(model, { pad: false })).toBe(
      '| h |\n| --- |\n| a\\|b<br>c |',
    );
  });

  it('列数が足りない行を補う', () => {
    const model: TableModel = { cells: [['a', 'b'], ['1']], aligns: [] };
    expect(formatMarkdownTable(model, { pad: false })).toBe(
      '| a | b |\n| --- | --- |\n| 1 |  |',
    );
  });
});

describe('parse', () => {
  it('配置付きのテーブルを読み込む', () => {
    const text =
      '| a | b | c | d |\n| :-- | :-: | --: | --- |\n| 1 | 2 | 3 | 4 |';
    expect(parseMarkdownTable(text)).toEqual({
      cells: [
        ['a', 'b', 'c', 'd'],
        ['1', '2', '3', '4'],
      ],
      aligns: ['left', 'center', 'right', 'none'],
    });
  });

  it('外側のパイプが無い表も読める', () => {
    expect(parseMarkdownTable('a | b\n--- | ---\n1 | 2')).toEqual({
      cells: [
        ['a', 'b'],
        ['1', '2'],
      ],
      aligns: ['none', 'none'],
    });
  });

  it('区切り行が無ければ1行目を見出しにする', () => {
    expect(parseMarkdownTable('| a | b |\n| 1 | 2 |')).toEqual({
      cells: [
        ['a', 'b'],
        ['1', '2'],
      ],
      aligns: ['none', 'none'],
    });
  });

  it('\\| と <br> を元に戻す', () => {
    const model = parseMarkdownTable('| a |\n| --- |\n| x\\|y<br>z |');
    expect(model?.cells[1][0]).toBe('x|y\nz');
  });

  it('空セルと列不足を保つ', () => {
    const model = parseMarkdownTable('| a | b |\n| - | - |\n| | x |\n| y |');
    expect(model?.cells).toEqual([
      ['a', 'b'],
      ['', 'x'],
      ['y', ''],
    ]);
  });

  it('表でない入力は null', () => {
    expect(parseMarkdownTable('')).toBeNull();
    expect(parseMarkdownTable('just text')).toBeNull();
  });

  it('整形→読み込みで元に戻る', () => {
    const model: TableModel = {
      cells: [
        ['x', '日本'],
        ['a|b', 'c\\|d'],
        ['', 'line1\nline2'],
      ],
      aligns: ['center', 'right'],
    };
    const text = formatMarkdownTable(model, { pad: true });
    expect(parseMarkdownTable(text)).toEqual(model);
  });
});

describe('helpers', () => {
  it('escape/unescape', () => {
    expect(escapeCell('a|b')).toBe('a\\|b');
    expect(unescapeCell('a\\|b<BR/>c')).toBe('a|b\nc');
  });

  it('splitRow は末尾の | で空セルを作らない', () => {
    expect(splitRow('| a | b |')).toEqual(['a', 'b']);
    expect(splitRow('| a | |')).toEqual(['a', '']);
  });

  it('displayWidth', () => {
    expect(displayWidth('abc')).toBe(3);
    expect(displayWidth('あい')).toBe(4);
    expect(displayWidth('')).toBe(0);
  });
});

describe('operations', () => {
  it('createTable', () => {
    const t = createTable(3, 2);
    expect(t.cells).toHaveLength(3);
    expect(t.aligns).toEqual(['none', 'none', 'none']);
    expect(createTable(0, -1).cells).toEqual([['']]);
  });

  it('行の挿入と削除', () => {
    const inserted = insertRow(sample, 2);
    expect(inserted.cells[2]).toEqual(['', '']);
    expect(inserted.cells).toHaveLength(4);
    expect(insertRow(sample, 0).cells[1]).toEqual(['', '']);
    expect(deleteRow(sample, 1).cells[1]).toEqual(['Sato', '25']);
    expect(deleteRow(sample, 0).cells).toHaveLength(3);
    expect(deleteRow(sample, 9).cells).toHaveLength(3);
  });

  it('行の移動は見出し行を越えない', () => {
    expect(moveRow(sample, 2, -1).cells[1]).toEqual(['Sato', '25']);
    expect(moveRow(sample, 1, -1)).toEqual(sample);
    expect(moveRow(sample, 2, 1)).toEqual(sample);
    expect(moveRow(sample, 1, 1).cells[2]).toEqual(['Tanaka', '30']);
  });

  it('列の挿入・削除・移動', () => {
    const inserted = insertColumn(sample, 1);
    expect(inserted.cells[0]).toEqual(['name', '', 'age']);
    expect(inserted.aligns).toEqual(['left', 'none', 'right']);
    const deleted = deleteColumn(sample, 0);
    expect(deleted.cells[1]).toEqual(['30']);
    expect(deleted.aligns).toEqual(['right']);
    expect(deleteColumn(deleted, 0).aligns).toHaveLength(1);
    const moved = moveColumn(sample, 0, 1);
    expect(moved.cells[0]).toEqual(['age', 'name']);
    expect(moved.aligns).toEqual(['right', 'left']);
    expect(moveColumn(sample, 0, -1)).toEqual(sample);
  });

  it('操作は元のモデルを変更しない', () => {
    const copy = JSON.parse(JSON.stringify(sample));
    insertRow(sample, 1);
    moveColumn(sample, 0, 1);
    setCell(sample, 1, 0, 'x');
    setAlign(sample, 0, 'center');
    expect(sample).toEqual(copy);
  });

  it('setCell / setAlign', () => {
    expect(setCell(sample, 1, 1, '99').cells[1][1]).toBe('99');
    expect(setCell(sample, 9, 1, 'x')).toEqual(sample);
    expect(setAlign(sample, 0, 'center').aligns[0]).toBe('center');
  });
});

describe('エッジケース（QA追加）', () => {
  it('| の直前のバックスラッシュも往復で保持する', () => {
    const model: TableModel = {
      cells: [['h'], ['a\\|b']],
      aligns: ['none'],
    };
    const text = formatMarkdownTable(model, { pad: true });
    expect(parseMarkdownTable(text)).toEqual(model);
  });

  it('CR のみの改行でも読み込める', () => {
    expect(parseMarkdownTable('| a | b |\r| --- | --- |\r| 1 | 2 |')).toEqual({
      cells: [
        ['a', 'b'],
        ['1', '2'],
      ],
      aligns: ['none', 'none'],
    });
  });

  it('空文字と空白だけの入力は null', () => {
    expect(parseMarkdownTable('\n\n   \n')).toBeNull();
  });

  it('空セルだけの表は整形でき、読み戻せる', () => {
    const model = createTable(2, 1);
    const text = formatMarkdownTable(model, { pad: true });
    expect(text).toBe('|     |     |\n| --- | --- |\n|     |     |');
    expect(parseMarkdownTable(text)).toEqual(model);
  });

  it('外側パイプなしの区切り行に配置が付く', () => {
    expect(parseMarkdownTable('a | b\n:-: | --:\n1 | 2')?.aligns).toEqual([
      'center',
      'right',
    ]);
  });

  it('絵文字（幅2）と結合文字（幅0）の表示幅', () => {
    expect(displayWidth('😀')).toBe(2);
    expect(displayWidth('é')).toBe(1);
    expect(displayWidth('a​b')).toBe(2);
  });

  it('大きな表（500行×10列）を整形して読み戻せる', () => {
    const model = createTable(10, 500);
    model.cells = model.cells.map((row, r) => row.map((_, c) => `r${r}c${c}`));
    const text = formatMarkdownTable(model, { pad: false });
    expect(parseMarkdownTable(text)).toEqual(model);
  });

  it('行・列の操作を境界値で行っても表が壊れない', () => {
    const one: TableModel = { cells: [['a']], aligns: ['none'] };
    expect(deleteRow(one, 0)).toEqual(one);
    expect(moveRow(one, 0, 1)).toEqual(one);
    expect(deleteColumn(one, 0)).toEqual(one);
    expect(insertRow(one, 99).cells).toHaveLength(2);
    expect(insertColumn(one, -5).aligns).toHaveLength(2);
  });
});

describe('既知の挙動（QA確認）', () => {
  it('セル内の文字列 <br> は往復で改行に変わる（仕様上の制限として記録）', () => {
    const model: TableModel = { cells: [['h'], ['x<br>y']], aligns: ['none'] };
    const parsed = parseMarkdownTable(
      formatMarkdownTable(model, { pad: false }),
    );
    expect(parsed?.cells[1][0]).toBe('x\ny');
  });
});
