export const MAX_COLUMN = 16384; // XFD
export const MAX_ROW = 1048576;

export type ConvertError = 'empty' | 'invalid' | 'out-of-range';

export type Result<T> =
  { ok: true; value: T } | { ok: false; error: ConvertError };

/** 列記号（A, AZ, xfd など）を列番号に変換する。大文字小文字は区別しない。 */
export function columnToNumber(input: string): Result<number> {
  const s = input.trim();
  if (s === '') return { ok: false, error: 'empty' };
  if (!/^[A-Za-z]+$/.test(s)) return { ok: false, error: 'invalid' };
  // 4文字以上は XFD(3文字)を必ず超える
  if (s.length > 3) return { ok: false, error: 'out-of-range' };
  let n = 0;
  for (const ch of s.toUpperCase()) {
    n = n * 26 + (ch.charCodeAt(0) - 64);
  }
  if (n > MAX_COLUMN) return { ok: false, error: 'out-of-range' };
  return { ok: true, value: n };
}

/** 列番号（1〜16384）を列記号に変換する。 */
export function numberToColumn(input: string | number): Result<string> {
  let n: number;
  if (typeof input === 'number') {
    if (!Number.isInteger(input)) return { ok: false, error: 'invalid' };
    n = input;
  } else {
    const s = input.trim();
    if (s === '') return { ok: false, error: 'empty' };
    if (!/^[+-]?\d+$/.test(s)) return { ok: false, error: 'invalid' };
    n = Number(s);
  }
  if (n < 1 || n > MAX_COLUMN) return { ok: false, error: 'out-of-range' };
  let name = '';
  while (n > 0) {
    const rem = (n - 1) % 26;
    name = String.fromCharCode(65 + rem) + name;
    n = Math.floor((n - 1) / 26);
  }
  return { ok: true, value: name };
}

export interface CellRef {
  column: string;
  columnNumber: number;
  row: number;
  absoluteColumn: boolean;
  absoluteRow: boolean;
}

/** A1形式のセル参照（$B$3 なども可）を分解する。 */
export function parseCellRef(input: string): Result<CellRef> {
  const s = input.trim();
  if (s === '') return { ok: false, error: 'empty' };
  const m = /^(\$?)([A-Za-z]+)(\$?)(\d+)$/.exec(s);
  if (!m) return { ok: false, error: 'invalid' };
  const col = columnToNumber(m[2]);
  if (!col.ok) return col;
  const row = Number(m[4]);
  if (row < 1 || row > MAX_ROW) return { ok: false, error: 'out-of-range' };
  return {
    ok: true,
    value: {
      column: m[2].toUpperCase(),
      columnNumber: col.value,
      row,
      absoluteColumn: m[1] === '$',
      absoluteRow: m[3] === '$',
    },
  };
}

export interface RangeInfo {
  start: CellRef;
  end: CellRef;
  columns: number;
  rows: number;
  cells: number;
}

/** A1:C10 形式の範囲の列数・行数・セル数を求める。逆向きの範囲（C10:A1）も扱う。 */
export function parseRange(input: string): Result<RangeInfo> {
  const s = input.trim();
  if (s === '') return { ok: false, error: 'empty' };
  const parts = s.split(':');
  if (parts.length !== 2) return { ok: false, error: 'invalid' };
  const a = parseCellRef(parts[0]);
  if (!a.ok) return a;
  const b = parseCellRef(parts[1]);
  if (!b.ok) return b;
  const columns = Math.abs(a.value.columnNumber - b.value.columnNumber) + 1;
  const rows = Math.abs(a.value.row - b.value.row) + 1;
  return {
    ok: true,
    value: {
      start: a.value,
      end: b.value,
      columns,
      rows,
      cells: columns * rows,
    },
  };
}

/** 単一セルか範囲かを判定して解析する。 */
export type ParsedReference =
  { kind: 'cell'; cell: CellRef } | { kind: 'range'; range: RangeInfo };

export function parseReference(input: string): Result<ParsedReference> {
  if (input.includes(':')) {
    const r = parseRange(input);
    return r.ok ? { ok: true, value: { kind: 'range', range: r.value } } : r;
  }
  const c = parseCellRef(input);
  return c.ok ? { ok: true, value: { kind: 'cell', cell: c.value } } : c;
}

/** 対応表に載せる代表的な列。 */
export const REFERENCE_COLUMNS: readonly string[] = [
  'A',
  'Z',
  'AA',
  'AZ',
  'BA',
  'IV',
  'IW',
  'ZZ',
  'AAA',
  'XFD',
];

export function referenceTable(): { column: string; number: number }[] {
  return REFERENCE_COLUMNS.map((column) => {
    const r = columnToNumber(column);
    return { column, number: r.ok ? r.value : 0 };
  });
}
