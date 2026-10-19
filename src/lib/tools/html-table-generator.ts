export interface TableCell {
  text: string;
  colspan: number;
  rowspan: number;
}

export interface TableModel {
  cells: TableCell[][];
}

export type StylePreset = 'none' | 'simple' | 'striped' | 'minimal';
export type CssMode = 'style' | 'inline';

export interface HtmlTableOptions {
  headerRow: boolean;
  preset: StylePreset;
  cssMode: CssMode;
  padding: number;
  borderColor: string;
  fullWidth: boolean;
  className: string;
  caption: string;
}

export const DEFAULT_OPTIONS: HtmlTableOptions = {
  headerRow: true,
  preset: 'simple',
  cssMode: 'style',
  padding: 8,
  borderColor: '#cccccc',
  fullWidth: false,
  className: 'data-table',
  caption: '',
};

export const MAX_ROWS = 50;
export const MAX_COLUMNS = 20;

function emptyCell(): TableCell {
  return { text: '', colspan: 1, rowspan: 1 };
}

function clampInt(value: number, min: number, max: number): number {
  if (!Number.isFinite(value)) return min;
  return Math.min(max, Math.max(min, Math.floor(value)));
}

export function createTable(rows: number, columns: number): TableModel {
  const r = clampInt(rows, 1, MAX_ROWS);
  const c = clampInt(columns, 1, MAX_COLUMNS);
  return {
    cells: Array.from({ length: r }, () =>
      Array.from({ length: c }, () => emptyCell()),
    ),
  };
}

/** 行列数を変更する。既存セルは保持し、はみ出す結合は範囲内に収める */
export function resizeTable(
  model: TableModel,
  rows: number,
  columns: number,
): TableModel {
  const r = clampInt(rows, 1, MAX_ROWS);
  const c = clampInt(columns, 1, MAX_COLUMNS);
  const cells = Array.from({ length: r }, (_, ri) =>
    Array.from({ length: c }, (_, ci) => {
      const old = model.cells[ri]?.[ci];
      if (!old) return emptyCell();
      return {
        text: old.text,
        colspan: Math.min(old.colspan, c - ci),
        rowspan: Math.min(old.rowspan, r - ri),
      };
    }),
  );
  return { cells };
}

export function setCellText(
  model: TableModel,
  row: number,
  column: number,
  text: string,
): TableModel {
  if (!model.cells[row]?.[column]) return model;
  return {
    cells: model.cells.map((line, ri) =>
      ri === row
        ? line.map((cell, ci) => (ci === column ? { ...cell, text } : cell))
        : line,
    ),
  };
}

/** 指定範囲（両端含む、0始まり）を結合する。既存の結合と交わる場合は範囲を広げる */
export function mergeCells(
  model: TableModel,
  rowA: number,
  columnA: number,
  rowB: number,
  columnB: number,
): TableModel {
  const rows = model.cells.length;
  const columns = model.cells[0]?.length ?? 0;
  let r1 = clampInt(Math.min(rowA, rowB), 0, rows - 1);
  let r2 = clampInt(Math.max(rowA, rowB), 0, rows - 1);
  let c1 = clampInt(Math.min(columnA, columnB), 0, columns - 1);
  let c2 = clampInt(Math.max(columnA, columnB), 0, columns - 1);

  let changed = true;
  while (changed) {
    changed = false;
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < columns; c++) {
        const cell = model.cells[r][c];
        if (cell.colspan === 1 && cell.rowspan === 1) continue;
        const endRow = r + cell.rowspan - 1;
        const endColumn = c + cell.colspan - 1;
        const intersects =
          r <= r2 && endRow >= r1 && c <= c2 && endColumn >= c1;
        if (!intersects) continue;
        const nr1 = Math.min(r1, r);
        const nr2 = Math.max(r2, endRow);
        const nc1 = Math.min(c1, c);
        const nc2 = Math.max(c2, endColumn);
        if (nr1 !== r1 || nr2 !== r2 || nc1 !== c1 || nc2 !== c2) {
          r1 = nr1;
          r2 = nr2;
          c1 = nc1;
          c2 = nc2;
          changed = true;
        }
      }
    }
  }

  if (r1 === r2 && c1 === c2) return model;

  return {
    cells: model.cells.map((line, ri) =>
      line.map((cell, ci) => {
        if (ri < r1 || ri > r2 || ci < c1 || ci > c2) return cell;
        if (ri === r1 && ci === c1) {
          return {
            text: cell.text,
            colspan: c2 - c1 + 1,
            rowspan: r2 - r1 + 1,
          };
        }
        return emptyCell();
      }),
    ),
  };
}

/** 指定セルが結合の起点または内部なら、その結合を解除する */
export function unmergeCell(
  model: TableModel,
  row: number,
  column: number,
): TableModel {
  const rows = model.cells.length;
  const columns = model.cells[0]?.length ?? 0;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < columns; c++) {
      const cell = model.cells[r][c];
      if (cell.colspan === 1 && cell.rowspan === 1) continue;
      if (
        row >= r &&
        row <= r + cell.rowspan - 1 &&
        column >= c &&
        column <= c + cell.colspan - 1
      ) {
        return {
          cells: model.cells.map((line, ri) =>
            ri === r
              ? line.map((x, ci) =>
                  ci === c ? { ...x, colspan: 1, rowspan: 1 } : x,
                )
              : line,
          ),
        };
      }
    }
  }
  return model;
}

export interface CellLayout {
  /** 他のセルの結合に隠されている（出力しない） */
  covered: boolean;
  colspan: number;
  rowspan: number;
}

/** 見出し行の設定を踏まえた、実際の結合状態を求める */
export function layoutTable(
  model: TableModel,
  headerRow: boolean,
): CellLayout[][] {
  const rows = model.cells.length;
  const columns = model.cells[0]?.length ?? 0;
  const layout: CellLayout[][] = Array.from({ length: rows }, () =>
    Array.from({ length: columns }, () => ({
      covered: false,
      colspan: 1,
      rowspan: 1,
    })),
  );
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < columns; c++) {
      if (layout[r][c].covered) continue;
      const cell = model.cells[r][c];
      let colspan = Math.min(Math.max(1, cell.colspan), columns - c);
      let rowspan = Math.min(Math.max(1, cell.rowspan), rows - r);
      if (headerRow && r === 0) rowspan = 1;
      // 既に隠れているセルにぶつかる場合は縮める（不整合な入力への保険）
      for (let rr = r; rr < r + rowspan; rr++) {
        for (let cc = c; cc < c + colspan; cc++) {
          if ((rr !== r || cc !== c) && layout[rr][cc].covered) {
            colspan = Math.min(colspan, cc - c || 1);
          }
        }
      }
      layout[r][c].colspan = colspan;
      layout[r][c].rowspan = rowspan;
      for (let rr = r; rr < r + rowspan; rr++) {
        for (let cc = c; cc < c + colspan; cc++) {
          if (rr !== r || cc !== c) layout[rr][cc].covered = true;
        }
      }
    }
  }
  return layout;
}

export function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/** セル本文をHTML用にする（エスケープ後、改行を br に） */
export function cellToHtml(text: string): string {
  return escapeHtml(text.replace(/\r\n?/g, '\n')).replace(/\n/g, '<br>');
}

export function sanitizeClassName(value: string): string {
  const cleaned = value.trim().replace(/[^A-Za-z0-9_-]/g, '');
  if (!cleaned || /^[0-9]/.test(cleaned) || /^-[0-9-]/.test(cleaned)) {
    return DEFAULT_OPTIONS.className;
  }
  return cleaned;
}

export function sanitizeColor(value: string): string {
  const v = value.trim();
  return /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(v)
    ? v.toLowerCase()
    : DEFAULT_OPTIONS.borderColor;
}

export interface TableStyles {
  table: string[];
  cell: string[];
  th: string[];
  /** 縞模様の偶数行（本文の2行目、4行目…）に付けるスタイル */
  stripe: string[];
}

export function buildStyles(options: HtmlTableOptions): TableStyles {
  const padding = clampInt(options.padding, 0, 64);
  const color = sanitizeColor(options.borderColor);
  const styles: TableStyles = { table: [], cell: [], th: [], stripe: [] };
  if (options.preset === 'none') return styles;

  styles.table.push('border-collapse: collapse');
  if (options.fullWidth) styles.table.push('width: 100%');
  if (options.preset === 'minimal') {
    styles.cell.push(`border-bottom: 1px solid ${color}`);
    styles.th.push(`border-bottom: 2px solid ${color}`);
  } else {
    styles.cell.push(`border: 1px solid ${color}`);
  }
  styles.cell.push(`padding: ${padding}px`);
  styles.cell.push('text-align: left');
  if (options.preset !== 'minimal') {
    styles.th.push('background-color: #f3f4f6');
  }
  if (options.preset === 'striped') {
    styles.stripe.push('background-color: #f9fafb');
  }
  return styles;
}

function declarations(list: string[]): string {
  return list.map((d) => `${d};`).join(' ');
}

export function buildCss(options: HtmlTableOptions): string {
  const styles = buildStyles(options);
  const cls = `.${sanitizeClassName(options.className)}`;
  const blocks: string[] = [];
  const block = (selector: string, list: string[]) => {
    if (list.length === 0) return;
    blocks.push(`${selector} {\n${list.map((d) => `  ${d};`).join('\n')}\n}`);
  };
  block(cls, styles.table);
  block(`${cls} th,\n${cls} td`, styles.cell);
  block(`${cls} th`, styles.th);
  block(`${cls} tbody tr:nth-child(even)`, styles.stripe);
  return blocks.join('\n');
}

export function generateHtml(
  model: TableModel,
  partial: Partial<HtmlTableOptions> = {},
): string {
  const options: HtmlTableOptions = { ...DEFAULT_OPTIONS, ...partial };
  const layout = layoutTable(model, options.headerRow);
  const styles = buildStyles(options);
  const inline = options.preset !== 'none' && options.cssMode === 'inline';
  const useStyleTag = options.preset !== 'none' && options.cssMode === 'style';
  const className = sanitizeClassName(options.className);

  const styleAttr = (list: string[]) =>
    inline && list.length > 0 ? ` style="${declarations(list)}"` : '';

  const lines: string[] = [];
  if (useStyleTag) {
    lines.push('<style>');
    lines.push(buildCss(options));
    lines.push('</style>');
  }
  lines.push(
    `<table${useStyleTag ? ` class="${className}"` : ''}${styleAttr(styles.table)}>`,
  );
  if (options.caption.trim()) {
    lines.push(`  <caption>${cellToHtml(options.caption.trim())}</caption>`);
  }

  const rowLines = (r: number, isHeader: boolean, bodyIndex: number) => {
    const tag = isHeader ? 'th' : 'td';
    const out: string[] = [];
    const stripeRow = bodyIndex % 2 === 1;
    const trStyle =
      inline && !isHeader && stripeRow ? styleAttr(styles.stripe) : '';
    out.push(`<tr${trStyle}>`);
    model.cells[r].forEach((cell, c) => {
      const info = layout[r][c];
      if (info.covered) return;
      const attrs: string[] = [];
      if (isHeader)
        attrs.push(info.colspan > 1 ? 'scope="colgroup"' : 'scope="col"');
      if (info.colspan > 1) attrs.push(`colspan="${info.colspan}"`);
      if (info.rowspan > 1) attrs.push(`rowspan="${info.rowspan}"`);
      const cellStyle = styleAttr(
        isHeader ? [...styles.cell, ...styles.th] : styles.cell,
      );
      const open = `<${tag}${attrs.length ? ` ${attrs.join(' ')}` : ''}${cellStyle}>`;
      out.push(`  ${open}${cellToHtml(cell.text)}</${tag}>`);
    });
    out.push('</tr>');
    return out;
  };

  const indent = (list: string[], depth: number) =>
    list.map((l) => '  '.repeat(depth) + l);

  const rowCount = model.cells.length;
  if (options.headerRow) {
    lines.push('  <thead>');
    lines.push(...indent(rowLines(0, true, 0), 2));
    lines.push('  </thead>');
  }
  const startBody = options.headerRow ? 1 : 0;
  if (rowCount > startBody) {
    lines.push('  <tbody>');
    for (let r = startBody; r < rowCount; r++) {
      lines.push(...indent(rowLines(r, false, r - startBody), 2));
    }
    lines.push('  </tbody>');
  }
  lines.push('</table>');
  return lines.join('\n');
}

/** タブ区切り（ExcelやGoogleスプレッドシートからのコピー）を表にする */
export function parseTabular(text: string): TableModel | null {
  const lines = text
    .replace(/\r\n?/g, '\n')
    .split('\n')
    .filter((line, i, all) => line !== '' || i < all.length - 1);
  while (lines.length > 0 && lines[lines.length - 1] === '') lines.pop();
  if (lines.length === 0) return null;
  const rows = lines.slice(0, MAX_ROWS).map((line) => line.split('\t'));
  const columns = Math.min(
    MAX_COLUMNS,
    Math.max(...rows.map((row) => row.length)),
  );
  return {
    cells: rows.map((row) =>
      Array.from({ length: columns }, (_, c) => ({
        text: row[c] ?? '',
        colspan: 1,
        rowspan: 1,
      })),
    ),
  };
}
