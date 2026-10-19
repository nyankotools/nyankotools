import { describe, expect, it } from 'vitest';
import {
  buildCss,
  cellToHtml,
  createTable,
  generateHtml,
  layoutTable,
  mergeCells,
  parseTabular,
  resizeTable,
  sanitizeClassName,
  sanitizeColor,
  setCellText,
  unmergeCell,
} from './html-table-generator';

function filled(rows: number, cols: number) {
  let model = createTable(rows, cols);
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      model = setCellText(model, r, c, `${r}${c}`);
    }
  }
  return model;
}

describe('createTable / resizeTable', () => {
  it('指定サイズの空の表を作る', () => {
    const m = createTable(2, 3);
    expect(m.cells).toHaveLength(2);
    expect(m.cells[0]).toHaveLength(3);
  });

  it('範囲外は上限・下限に収める', () => {
    expect(createTable(0, 0).cells).toHaveLength(1);
    expect(createTable(999, 999).cells).toHaveLength(50);
    expect(createTable(999, 999).cells[0]).toHaveLength(20);
  });

  it('拡大縮小しても既存セルを保持し結合を収める', () => {
    let m = filled(3, 3);
    m = mergeCells(m, 1, 1, 2, 2);
    const small = resizeTable(m, 2, 2);
    expect(small.cells[1][1].text).toBe('11');
    expect(small.cells[1][1].rowspan).toBe(1);
    expect(small.cells[1][1].colspan).toBe(1);
    const big = resizeTable(m, 4, 4);
    expect(big.cells[3][3].text).toBe('');
    expect(big.cells[1][1].rowspan).toBe(2);
  });
});

describe('mergeCells / unmergeCell', () => {
  it('範囲を起点セルのcolspan/rowspanにする', () => {
    const m = mergeCells(filled(3, 3), 0, 0, 1, 2);
    expect(m.cells[0][0]).toEqual({ text: '00', colspan: 3, rowspan: 2 });
    expect(m.cells[0][1].text).toBe('');
  });

  it('逆順の指定でも結合できる', () => {
    const m = mergeCells(filled(2, 2), 1, 1, 0, 0);
    expect(m.cells[0][0].colspan).toBe(2);
  });

  it('単一セルの結合は何もしない', () => {
    const m = filled(2, 2);
    expect(mergeCells(m, 0, 0, 0, 0)).toBe(m);
  });

  it('既存の結合と交わる場合は範囲を広げる', () => {
    let m = mergeCells(filled(3, 3), 0, 0, 1, 1);
    m = mergeCells(m, 1, 1, 2, 2);
    expect(m.cells[0][0]).toMatchObject({ colspan: 3, rowspan: 3 });
  });

  it('結合を解除する（内部のセルを指定しても解除できる）', () => {
    let m = mergeCells(filled(2, 2), 0, 0, 1, 1);
    m = unmergeCell(m, 1, 1);
    expect(m.cells[0][0]).toMatchObject({ colspan: 1, rowspan: 1 });
  });

  it('結合が無いセルの解除は何もしない', () => {
    const m = filled(2, 2);
    expect(unmergeCell(m, 0, 0)).toBe(m);
  });
});

describe('layoutTable', () => {
  it('結合に隠されたセルをcoveredにする', () => {
    const m = mergeCells(filled(3, 3), 1, 0, 2, 1);
    const l = layoutTable(m, true);
    expect(l[1][0]).toMatchObject({ covered: false, colspan: 2, rowspan: 2 });
    expect(l[1][1].covered).toBe(true);
    expect(l[2][0].covered).toBe(true);
    expect(l[2][1].covered).toBe(true);
    expect(l[2][2].covered).toBe(false);
  });

  it('見出し行ありのとき1行目のrowspanは1にする', () => {
    const m = mergeCells(filled(3, 2), 0, 0, 1, 0);
    expect(layoutTable(m, true)[0][0].rowspan).toBe(1);
    expect(layoutTable(m, true)[1][0].covered).toBe(false);
    expect(layoutTable(m, false)[0][0].rowspan).toBe(2);
  });
});

describe('cellToHtml', () => {
  it('特殊文字をエスケープし改行をbrにする', () => {
    expect(cellToHtml('<b>"a" & \'b\'</b>')).toBe(
      '&lt;b&gt;&quot;a&quot; &amp; &#39;b&#39;&lt;/b&gt;',
    );
    expect(cellToHtml('a\r\nb\nc')).toBe('a<br>b<br>c');
  });

  it('スクリプトタグが生で出力されない', () => {
    const html = generateHtml(
      setCellText(createTable(1, 1), 0, 0, '<script>alert(1)</script>'),
      { preset: 'none' },
    );
    expect(html).not.toContain('<script>');
    expect(html).toContain('&lt;script&gt;');
  });
});

describe('generateHtml', () => {
  it('見出し行をthead/th、本文をtbody/tdで出力する（スタイルなし）', () => {
    const html = generateHtml(filled(2, 2), { preset: 'none' });
    expect(html).toBe(
      [
        '<table>',
        '  <thead>',
        '    <tr>',
        '      <th scope="col">00</th>',
        '      <th scope="col">01</th>',
        '    </tr>',
        '  </thead>',
        '  <tbody>',
        '    <tr>',
        '      <td>10</td>',
        '      <td>11</td>',
        '    </tr>',
        '  </tbody>',
        '</table>',
      ].join('\n'),
    );
  });

  it('見出し行なしならtheadを出さない', () => {
    const html = generateHtml(filled(1, 1), {
      preset: 'none',
      headerRow: false,
    });
    expect(html).not.toContain('<thead>');
    expect(html).toContain('<td>00</td>');
  });

  it('colspan/rowspanを出力し、隠れたセルは出さない', () => {
    const m = mergeCells(filled(3, 3), 1, 0, 2, 1);
    const html = generateHtml(m, { preset: 'none' });
    expect(html).toContain('<td colspan="2" rowspan="2">10</td>');
    expect(html).not.toContain('>11<');
    expect(html).not.toContain('>20<');
    expect(html).toContain('>12<');
    expect(html).toContain('>22<');
  });

  it('見出しの結合はscope="colgroup"になる', () => {
    const m = mergeCells(filled(2, 3), 0, 0, 0, 1);
    expect(generateHtml(m, { preset: 'none' })).toContain(
      '<th scope="colgroup" colspan="2">00</th>',
    );
  });

  it('styleタグ方式ではクラスとCSSを出力する', () => {
    const html = generateHtml(filled(2, 2), {
      preset: 'striped',
      className: 'my-table',
      padding: 4,
      borderColor: '#ff0000',
    });
    expect(html.startsWith('<style>')).toBe(true);
    expect(html).toContain('.my-table {');
    expect(html).toContain('border: 1px solid #ff0000;');
    expect(html).toContain('padding: 4px;');
    expect(html).toContain('.my-table tbody tr:nth-child(even)');
    expect(html).toContain('<table class="my-table">');
  });

  it('インライン方式ではstyle属性を付け、styleタグは出さない', () => {
    const html = generateHtml(filled(3, 1), {
      preset: 'striped',
      cssMode: 'inline',
    });
    expect(html).not.toContain('<style>');
    expect(html).not.toContain('class=');
    expect(html).toContain('<table style="border-collapse: collapse;">');
    expect(html).toContain('<th scope="col" style="border: 1px solid');
    // 本文の2行目だけ縞模様
    const rows = html.split('\n').filter((l) => l.includes('<tr'));
    expect(rows[0]).toBe('    <tr>');
    expect(rows[1]).toBe('    <tr>');
    expect(rows[2]).toContain('background-color: #f9fafb');
  });

  it('キャプションを出力しエスケープする', () => {
    const html = generateHtml(filled(1, 1), {
      preset: 'none',
      caption: '売上 <2025>',
    });
    expect(html).toContain('<caption>売上 &lt;2025&gt;</caption>');
  });

  it('幅100%の指定が反映される', () => {
    expect(buildCss({ ...baseOptions(), fullWidth: true })).toContain(
      'width: 100%;',
    );
  });

  it('不正なクラス名・色は既定値に戻す（属性への注入を防ぐ）', () => {
    const html = generateHtml(filled(1, 1), {
      className: '"><script>',
      borderColor: 'red;} body{display:none',
    });
    expect(html).not.toContain('<script');
    expect(html).toContain('#cccccc');
  });
});

function baseOptions() {
  return {
    headerRow: true,
    preset: 'simple' as const,
    cssMode: 'style' as const,
    padding: 8,
    borderColor: '#cccccc',
    fullWidth: false,
    className: 'data-table',
    caption: '',
  };
}

describe('sanitize', () => {
  it('クラス名', () => {
    expect(sanitizeClassName(' my_table-1 ')).toBe('my_table-1');
    expect(sanitizeClassName('1abc')).toBe('data-table');
    expect(sanitizeClassName('')).toBe('data-table');
    expect(sanitizeClassName('a b')).toBe('ab');
  });

  it('色', () => {
    expect(sanitizeColor('#ABC')).toBe('#abc');
    expect(sanitizeColor('#12345')).toBe('#cccccc');
  });
});

describe('parseTabular', () => {
  it('タブ区切りを表にする', () => {
    const m = parseTabular('a\tb\nc\td\n');
    expect(m?.cells.map((r) => r.map((c) => c.text))).toEqual([
      ['a', 'b'],
      ['c', 'd'],
    ]);
  });

  it('列数が揃わない行は空セルで埋める', () => {
    const m = parseTabular('a\tb\tc\nd');
    expect(m?.cells[1].map((c) => c.text)).toEqual(['d', '', '']);
  });

  it('空文字はnull', () => {
    expect(parseTabular('')).toBeNull();
    expect(parseTabular('\n\n')).toBeNull();
  });
});
