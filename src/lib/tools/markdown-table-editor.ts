export type Align = 'none' | 'left' | 'center' | 'right';

/** 表の状態。cells[0] が見出し行。すべての行は aligns と同じ列数にそろえる */
export interface TableModel {
  cells: string[][];
  aligns: Align[];
}

export interface FormatOptions {
  /** 列幅をそろえて整形する。false ならコンパクト出力 */
  pad: boolean;
}

/** 空の表（見出し1行 + 本文 rows 行、columns 列）を作る */
export function createTable(columns: number, bodyRows: number): TableModel {
  const cols = Math.max(1, columns);
  return {
    cells: Array.from({ length: Math.max(0, bodyRows) + 1 }, () =>
      Array<string>(cols).fill(''),
    ),
    aligns: Array<Align>(cols).fill('none'),
  };
}

/** 表示幅（全角・絵文字などは2、結合文字・ゼロ幅は0として数える） */
export function displayWidth(text: string): number {
  let width = 0;
  for (const char of text) {
    const code = char.codePointAt(0)!;
    if (
      code === 0x200b ||
      code === 0x200d ||
      (code >= 0x0300 && code <= 0x036f) ||
      (code >= 0xfe00 && code <= 0xfe0f)
    ) {
      continue;
    }
    const wide =
      (code >= 0x1100 && code <= 0x115f) ||
      (code >= 0x2e80 && code <= 0xa4cf) ||
      (code >= 0xac00 && code <= 0xd7a3) ||
      (code >= 0xf900 && code <= 0xfaff) ||
      (code >= 0xfe30 && code <= 0xfe6f) ||
      (code >= 0xff00 && code <= 0xff60) ||
      (code >= 0xffe0 && code <= 0xffe6) ||
      (code >= 0x1f300 && code <= 0x1faff) ||
      (code >= 0x20000 && code <= 0x3fffd);
    width += wide ? 2 : 1;
  }
  return width;
}

/** セルをMarkdown用にエスケープする（`|` は `\|`、改行は `<br>`） */
export function escapeCell(value: string): string {
  return value
    .replace(/\\(?=\|)/g, '\\\\')
    .replace(/\|/g, '\\|')
    .replace(/\r\n|\r|\n/g, '<br>')
    .trim();
}

/** escapeCell の逆変換 */
export function unescapeCell(value: string): string {
  return value
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/\\\\(?=\\\|)/g, '\\')
    .replace(/\\\|/g, '|');
}

/** 1行を未エスケープの `|` で分割する（前後の `|` は取り除く） */
export function splitRow(line: string): string[] {
  let text = line.trim();
  if (text.startsWith('|')) text = text.slice(1);
  const cells: string[] = [];
  let current = '';
  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    if (char === '\\' && text[i + 1] === '|') {
      current += '\\|';
      i++;
    } else if (char === '\\' && text.startsWith('\\\\\\|', i)) {
      current += '\\\\\\|';
      i += 3;
    } else if (char === '|') {
      cells.push(current);
      current = '';
    } else {
      current += char;
    }
  }
  // 末尾が `|` で終わる場合は最後の空セルを作らない
  if (current.trim() !== '' || !line.trim().endsWith('|')) {
    cells.push(current);
  }
  return cells.map((cell) => unescapeCell(cell.trim()));
}

const SEPARATOR_CELL = /^:?-+:?$/;

function parseSeparator(line: string): Align[] | null {
  if (!line.includes('-')) return null;
  const cells = splitRow(line);
  if (cells.length === 0 || !cells.every((c) => SEPARATOR_CELL.test(c))) {
    return null;
  }
  return cells.map((cell) => {
    const left = cell.startsWith(':');
    const right = cell.endsWith(':');
    if (left && right) return 'center';
    if (right) return 'right';
    if (left) return 'left';
    return 'none';
  });
}

/** 行数・列数を揃える（足りない分は空セル）。alignsも列数に合わせる */
export function normalizeTable(model: TableModel): TableModel {
  const columns = Math.max(
    1,
    model.aligns.length,
    ...model.cells.map((row) => row.length),
  );
  const cells = model.cells.map((row) => {
    const copy = row.slice(0, columns);
    while (copy.length < columns) copy.push('');
    return copy;
  });
  if (cells.length === 0) cells.push(Array<string>(columns).fill(''));
  const aligns = model.aligns.slice(0, columns);
  while (aligns.length < columns) aligns.push('none');
  return { cells, aligns };
}

/**
 * Markdownテーブルを読み込む。
 * 2行目が区切り行ならその配置を使う。無ければ `|` を含む行を表とみなし、1行目を見出しにする。
 * 表として読める行が無ければ null。
 */
export function parseMarkdownTable(text: string): TableModel | null {
  const lines = text
    .split(/\r\n|\r|\n/)
    .map((line) => line.trim())
    .filter((line) => line !== '');
  if (lines.length === 0) return null;

  const separator = lines.length >= 2 ? parseSeparator(lines[1]) : null;
  if (separator) {
    const rows = [lines[0], ...lines.slice(2)].map(splitRow);
    return normalizeTable({ cells: rows, aligns: separator });
  }

  const tableLines = lines.filter((line) => line.includes('|'));
  if (tableLines.length === 0) return null;
  return normalizeTable({ cells: tableLines.map(splitRow), aligns: [] });
}

function padCell(text: string, width: number, align: Align): string {
  const gap = Math.max(0, width - displayWidth(text));
  if (align === 'right') return ' '.repeat(gap) + text;
  if (align === 'center') {
    const left = Math.floor(gap / 2);
    return ' '.repeat(left) + text + ' '.repeat(gap - left);
  }
  return text + ' '.repeat(gap);
}

function separatorCell(width: number, align: Align): string {
  switch (align) {
    case 'left':
      return ':' + '-'.repeat(width - 1);
    case 'right':
      return '-'.repeat(width - 1) + ':';
    case 'center':
      return ':' + '-'.repeat(width - 2) + ':';
    default:
      return '-'.repeat(width);
  }
}

/** 表を整形したMarkdownにする */
export function formatMarkdownTable(
  model: TableModel,
  options: FormatOptions,
): string {
  const { cells, aligns } = normalizeTable(model);
  const escaped = cells.map((row) => row.map(escapeCell));
  const columns = aligns.length;

  // 区切り行は :--- / :-: / ---: が成立する最小幅（3）を保つ
  const widths = Array.from({ length: columns }, (_, column) => {
    if (!options.pad) return 3;
    return Math.max(3, ...escaped.map((row) => displayWidth(row[column])));
  });

  const formatRow = (row: string[]) =>
    '| ' +
    row
      .map((cell, column) =>
        options.pad ? padCell(cell, widths[column], aligns[column]) : cell,
      )
      .join(' | ') +
    ' |';

  const separator = options.pad
    ? widths.map((w, c) => separatorCell(w, aligns[c]))
    : aligns.map((a) => separatorCell(3, a));

  return [
    formatRow(escaped[0]),
    '| ' + separator.join(' | ') + ' |',
    ...escaped.slice(1).map(formatRow),
  ].join('\n');
}

// ---- 行列操作（すべて新しい TableModel を返す純関数） ----

function clone(model: TableModel): TableModel {
  return {
    cells: model.cells.map((row) => row.slice()),
    aligns: [...model.aligns],
  };
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

/** index の位置に空の本文行を挿入する（1以上。範囲外は丸める） */
export function insertRow(model: TableModel, index: number): TableModel {
  const next = clone(model);
  const at = clamp(index, 1, next.cells.length);
  next.cells.splice(at, 0, Array<string>(next.aligns.length).fill(''));
  return next;
}

/** 本文行を削除する。見出し行（0）と範囲外は変更しない */
export function deleteRow(model: TableModel, index: number): TableModel {
  if (index < 1 || index >= model.cells.length) return clone(model);
  const next = clone(model);
  next.cells.splice(index, 1);
  return next;
}

/** 本文行を direction（-1 上 / 1 下）に移動する。範囲外は変更しない */
export function moveRow(
  model: TableModel,
  index: number,
  direction: -1 | 1,
): TableModel {
  const target = index + direction;
  if (index < 1 || index >= model.cells.length) return clone(model);
  if (target < 1 || target >= model.cells.length) return clone(model);
  const next = clone(model);
  [next.cells[index], next.cells[target]] = [
    next.cells[target],
    next.cells[index],
  ];
  return next;
}

/** index の位置に空の列を挿入する */
export function insertColumn(model: TableModel, index: number): TableModel {
  const next = clone(model);
  const at = clamp(index, 0, next.aligns.length);
  next.cells.forEach((row) => row.splice(at, 0, ''));
  next.aligns.splice(at, 0, 'none');
  return next;
}

/** 列を削除する。最後の1列は残す */
export function deleteColumn(model: TableModel, index: number): TableModel {
  if (model.aligns.length <= 1 || index < 0 || index >= model.aligns.length) {
    return clone(model);
  }
  const next = clone(model);
  next.cells.forEach((row) => row.splice(index, 1));
  next.aligns.splice(index, 1);
  return next;
}

/** 列を direction（-1 左 / 1 右）に移動する。範囲外は変更しない */
export function moveColumn(
  model: TableModel,
  index: number,
  direction: -1 | 1,
): TableModel {
  const target = index + direction;
  const size = model.aligns.length;
  if (index < 0 || index >= size || target < 0 || target >= size) {
    return clone(model);
  }
  const next = clone(model);
  next.cells.forEach((row) => {
    [row[index], row[target]] = [row[target], row[index]];
  });
  [next.aligns[index], next.aligns[target]] = [
    next.aligns[target],
    next.aligns[index],
  ];
  return next;
}

export function setAlign(
  model: TableModel,
  index: number,
  align: Align,
): TableModel {
  const next = clone(model);
  if (index >= 0 && index < next.aligns.length) next.aligns[index] = align;
  return next;
}

export function setCell(
  model: TableModel,
  row: number,
  column: number,
  value: string,
): TableModel {
  const next = clone(model);
  if (next.cells[row] && column >= 0 && column < next.aligns.length) {
    next.cells[row][column] = value;
  }
  return next;
}
