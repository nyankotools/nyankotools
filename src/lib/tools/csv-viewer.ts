import {
  escapeCsvField,
  parseCsvRows,
  UnterminatedQuoteError,
} from './csv-json-converter';

export interface CsvTable {
  /** 1行目をヘッダーとして使わない場合は null（表示側で「列N」を補う） */
  headers: string[] | null;
  columnCount: number;
  /** すべての行は columnCount 列に揃える（足りない列は空文字で埋める） */
  rows: string[][];
}

export type CsvTableOutcome =
  | { success: true; table: CsvTable }
  | { success: false; reason: 'empty' | 'unterminated-quote' };

export type SortDirection = 'asc' | 'desc';

export interface SortSpec {
  column: number;
  direction: SortDirection;
}

const DELIMITER_CANDIDATES = [',', '\t', ';'];

/** 最初の行（引用符内を除く）で最も多く現れる区切り文字を返す。見つからなければカンマ */
export function detectDelimiter(text: string): string {
  const counts = new Map<string, number>(
    DELIMITER_CANDIDATES.map((d) => [d, 0]),
  );
  let inQuotes = false;
  for (const char of text) {
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (!inQuotes) {
      if (char === '\n') break;
      const count = counts.get(char);
      if (count !== undefined) counts.set(char, count + 1);
    }
  }
  let best = ',';
  let bestCount = 0;
  for (const [delimiter, count] of counts) {
    if (count > bestCount) {
      best = delimiter;
      bestCount = count;
    }
  }
  return best;
}

export function parseCsvTable(
  text: string,
  delimiter: string,
  hasHeader: boolean,
): CsvTableOutcome {
  const source = text.charCodeAt(0) === 0xfeff ? text.slice(1) : text;
  let parsed;
  try {
    parsed = parseCsvRows(source, delimiter);
  } catch (error) {
    if (error instanceof UnterminatedQuoteError) {
      return { success: false, reason: 'unterminated-quote' };
    }
    throw error;
  }
  const lines = parsed.filter((row) => !row.blank).map((row) => row.fields);
  if (lines.length === 0) return { success: false, reason: 'empty' };

  const columnCount = lines.reduce((max, f) => Math.max(max, f.length), 0);
  const pad = (fields: string[]) =>
    fields.length < columnCount
      ? fields.concat(new Array<string>(columnCount - fields.length).fill(''))
      : fields;
  const padded = lines.map(pad);
  return {
    success: true,
    table: hasHeader
      ? { headers: padded[0], columnCount, rows: padded.slice(1) }
      : { headers: null, columnCount, rows: padded },
  };
}

/**
 * 絞り込みに合う行の添字を返す（大文字小文字を区別しない部分一致）。
 * column が null なら searchColumns のいずれかの列に一致すればよい。
 */
export function filterRowIndices(
  rows: string[][],
  query: string,
  column: number | null,
  searchColumns: number[],
): number[] {
  const indices: number[] = [];
  const needle = query.toLowerCase();
  const columns = column === null ? searchColumns : [column];
  rows.forEach((row, index) => {
    if (
      needle === '' ||
      columns.some((c) => (row[c] ?? '').toLowerCase().includes(needle))
    ) {
      indices.push(index);
    }
  });
  return indices;
}

const NUMBER_PATTERN = /^[+-]?(\d+\.?\d*|\.\d+)(e[+-]?\d+)?$/i;

function isNumeric(value: string): boolean {
  return NUMBER_PATTERN.test(value.trim());
}

/**
 * indices を列で並べ替えた新しい配列を返す（安定ソート）。
 * 空欄は昇順・降順どちらでも末尾。空欄以外がすべて数値なら数値順、それ以外は自然順の文字列比較。
 */
export function sortRowIndices(
  rows: string[][],
  indices: number[],
  sort: SortSpec,
): number[] {
  const { column, direction } = sort;
  const sign = direction === 'asc' ? 1 : -1;
  const values = indices.map((i) => rows[i][column] ?? '');
  const numeric = values.every((v) => v.trim() === '' || isNumeric(v));
  const collator = new Intl.Collator(undefined, {
    numeric: true,
    sensitivity: 'base',
  });
  const order = indices.map((_, position) => position);
  order.sort((a, b) => {
    const va = values[a];
    const vb = values[b];
    const emptyA = va.trim() === '';
    const emptyB = vb.trim() === '';
    if (emptyA || emptyB) {
      if (emptyA && emptyB) return a - b;
      return emptyA ? 1 : -1;
    }
    const diff = numeric
      ? Number(va.trim()) - Number(vb.trim())
      : collator.compare(va, vb);
    return diff !== 0 ? sign * diff : a - b;
  });
  return order.map((position) => indices[position]);
}

export interface BuildCsvOptions {
  delimiter: string;
  /** 出力に含めるヘッダー行。null ならヘッダー行を出力しない */
  headers: string[] | null;
}

/** 表示中の行・列（並び順どおり）をCSVに書き出す。改行は LF */
export function buildCsv(
  rows: string[][],
  rowIndices: number[],
  columns: number[],
  options: BuildCsvOptions,
): string {
  const { delimiter, headers } = options;
  const single = columns.length === 1;
  const toLine = (cells: string[]) =>
    cells.map((c) => escapeCsvField(c, delimiter, single)).join(delimiter);
  const lines: string[] = [];
  if (headers) lines.push(toLine(columns.map((c) => headers[c] ?? '')));
  for (const index of rowIndices) {
    lines.push(toLine(columns.map((c) => rows[index][c] ?? '')));
  }
  return lines.length === 0 ? '' : lines.join('\n') + '\n';
}
