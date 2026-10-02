import { escapeCsvField } from './csv-json-converter';

export interface RawCell {
  text: string;
  colspan: number;
  rowspan: number;
}

export type RawTable = RawCell[][];

const MAX_COLSPAN = 1000;

/**
 * rowspan / colspan を展開して、行×列がそろった二次元配列にする。
 * repeatMerged が true なら結合セルの値を覆われたセルにも繰り返し、false なら空にする。
 */
export function buildGrid(table: RawTable, repeatMerged: boolean): string[][] {
  const grid: (string | undefined)[][] = table.map(() => []);

  table.forEach((cells, rowIndex) => {
    let column = 0;
    for (const cell of cells) {
      while (grid[rowIndex][column] !== undefined) column += 1;
      const colspan = Math.min(Math.max(1, cell.colspan), MAX_COLSPAN);
      // 表の行数を超える rowspan は、ブラウザと同様に最終行までで打ち切る
      const rowspan = Math.min(
        Math.max(1, cell.rowspan),
        table.length - rowIndex,
      );
      for (let dr = 0; dr < rowspan; dr += 1) {
        for (let dc = 0; dc < colspan; dc += 1) {
          grid[rowIndex + dr][column + dc] =
            dr === 0 && dc === 0 ? cell.text : repeatMerged ? cell.text : '';
        }
      }
      column += colspan;
    }
  });

  const width = Math.max(0, ...grid.map((row) => row.length));
  return grid.map((row) =>
    Array.from({ length: width }, (_, column) => row[column] ?? ''),
  );
}

export function rowsToCsv(rows: string[][], delimiter = ','): string {
  if (rows.length === 0) return '';
  const singleColumn = (rows[0]?.length ?? 0) === 1;
  return (
    rows
      .map((row) =>
        row
          .map((cell) => escapeCsvField(cell, delimiter, singleColumn))
          .join(delimiter),
      )
      .join('\n') + '\n'
  );
}

function cellText(cell: Element): string {
  const clone = cell.cloneNode(true) as Element;
  for (const script of clone.querySelectorAll('script, style')) {
    script.remove();
  }
  // 改行を表す要素は、隣のテキストとくっつかないよう空白に置き換える
  for (const br of clone.querySelectorAll('br')) {
    br.replaceWith(' ');
  }
  for (const block of clone.querySelectorAll('p, div, li')) {
    block.append(' ');
  }
  return (clone.textContent ?? '').replace(/\s+/g, ' ').trim();
}

function spanOf(cell: Element, name: 'colspan' | 'rowspan'): number {
  const value = Number.parseInt(cell.getAttribute(name) ?? '', 10);
  return Number.isFinite(value) && value > 0 ? value : 1;
}

/**
 * HTML文字列に含まれる <table> を取り出す。ブラウザ環境専用（DOMParserが必要）。
 * DOMParser で作る文書は不活性なので、スクリプトの実行や画像の読み込みは起きない。
 */
export function readTables(html: string): RawTable[] {
  const doc = new DOMParser().parseFromString(html, 'text/html');
  return Array.from(doc.querySelectorAll('table')).map((table) =>
    Array.from(table.querySelectorAll('tr'))
      // 入れ子の表の行は、その表側で扱う
      .filter((row) => row.closest('table') === table)
      .map((row) =>
        Array.from(row.children)
          .filter((child) => child.tagName === 'TD' || child.tagName === 'TH')
          .map((cell) => ({
            text: cellText(cell),
            colspan: spanOf(cell, 'colspan'),
            rowspan: spanOf(cell, 'rowspan'),
          })),
      ),
  );
}
