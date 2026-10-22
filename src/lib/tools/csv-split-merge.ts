import {
  escapeCsvField,
  parseCsvRows,
  UnterminatedQuoteError,
} from './csv-json-converter';

/** これを超えるファイルは読み込まない（メモリに全て載せるため） */
export const MAX_FILE_BYTES = 100 * 1024 * 1024;
/** これを超えるファイルは処理に時間がかかる旨を警告する */
export const WARN_FILE_BYTES = 20 * 1024 * 1024;
/** 分割後のファイル数の上限 */
export const MAX_PARTS = 1000;

export type FileSizeStatus = 'ok' | 'warn' | 'too-large';

export function checkFileSize(bytes: number): FileSizeStatus {
  if (bytes > MAX_FILE_BYTES) return 'too-large';
  if (bytes > WARN_FILE_BYTES) return 'warn';
  return 'ok';
}

export type CsvEncoding = 'utf-8' | 'shift_jis';

/** バイト列を文字列にする。UTF-8 の BOM は取り除く */
export function decodeCsvBytes(
  bytes: Uint8Array,
  encoding: CsvEncoding = 'utf-8',
): string {
  const text = new TextDecoder(encoding).decode(bytes);
  return text.charCodeAt(0) === 0xfeff ? text.slice(1) : text;
}

/** 文字列を UTF-8 のバイト列にする。withBom なら先頭に BOM を付ける（Excel対策） */
export function encodeCsvText(text: string, withBom: boolean): Uint8Array {
  const body = new TextEncoder().encode(text);
  if (!withBom) return body;
  const out = new Uint8Array(body.length + 3);
  out.set([0xef, 0xbb, 0xbf], 0);
  out.set(body, 3);
  return out;
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

export interface CsvData {
  /** hasHeader=false のときは null */
  header: string[] | null;
  rows: string[][];
}

export type ParseOutcome =
  | { success: true; data: CsvData }
  | { success: false; reason: 'empty' | 'unterminated-quote' };

/** CSVテキストを解析する。完全な空行は無視し、行ごとの列数は変更しない */
export function parseCsvData(
  text: string,
  delimiter: string,
  hasHeader: boolean,
): ParseOutcome {
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
  return {
    success: true,
    data: hasHeader
      ? { header: lines[0], rows: lines.slice(1) }
      : { header: null, rows: lines },
  };
}

/** 最も列数の多い行の列数 */
export function columnCount(data: CsvData): number {
  let max = data.header?.length ?? 0;
  for (const row of data.rows) if (row.length > max) max = row.length;
  return max;
}

/** CSV文字列にする。改行は LF、末尾にも改行を付ける。行が無ければ空文字 */
export function serializeCsv(
  header: string[] | null,
  rows: string[][],
  delimiter: string,
): string {
  const lines: string[] = [];
  const toLine = (cells: string[]) => {
    const single = cells.length === 1;
    return cells
      .map((c) => escapeCsvField(c, delimiter, single))
      .join(delimiter);
  };
  if (header) lines.push(toLine(header));
  for (const row of rows) lines.push(toLine(row));
  return lines.length === 0 ? '' : lines.join('\n') + '\n';
}

// ---------- 分割 ----------

export type SplitSpec =
  { mode: 'rows'; value: number } | { mode: 'parts'; value: number };

export type SplitOutcome =
  | { success: true; chunks: string[][][] }
  | {
      success: false;
      reason: 'invalid-value' | 'too-many-parts' | 'no-rows';
    };

/**
 * データ行を分割する（ヘッダーは含まない）。
 * rows: 1ファイルあたり value 行。parts: value 個にできるだけ均等に分ける
 * （行数より多い個数を指定した場合は行数と同じ個数になり、空のファイルは作らない）。
 */
export function splitRows(rows: string[][], spec: SplitSpec): SplitOutcome {
  const { mode, value } = spec;
  if (!Number.isInteger(value) || value < 1) {
    return { success: false, reason: 'invalid-value' };
  }
  if (rows.length === 0) return { success: false, reason: 'no-rows' };

  const chunks: string[][][] = [];
  if (mode === 'rows') {
    if (Math.ceil(rows.length / value) > MAX_PARTS) {
      return { success: false, reason: 'too-many-parts' };
    }
    for (let i = 0; i < rows.length; i += value) {
      chunks.push(rows.slice(i, i + value));
    }
  } else {
    if (value > MAX_PARTS) return { success: false, reason: 'too-many-parts' };
    const parts = Math.min(value, rows.length);
    const base = Math.floor(rows.length / parts);
    const extra = rows.length % parts;
    let start = 0;
    for (let p = 0; p < parts; p++) {
      const size = base + (p < extra ? 1 : 0);
      chunks.push(rows.slice(start, start + size));
      start += size;
    }
  }
  return { success: true, chunks };
}

/** 拡張子を除いたファイル名。空になる場合は fallback */
export function stripExtension(fileName: string, fallback = 'data'): string {
  const base = fileName.replace(/^.*[\\/]/, '');
  const dot = base.lastIndexOf('.');
  const stem = dot > 0 ? base.slice(0, dot) : base;
  return stem.trim() === '' ? fallback : stem;
}

/** 分割後のファイル名（連番は全体の桁数でゼロ埋め）。例: data_01.csv */
export function splitFileName(
  stem: string,
  index: number,
  total: number,
  extension = 'csv',
): string {
  const width = Math.max(2, String(total).length);
  return `${stem}_${String(index + 1).padStart(width, '0')}.${extension}`;
}

// ---------- 結合 ----------

export interface MergeInput {
  name: string;
  data: CsvData;
}

export type MergeOutcome =
  | { success: true; data: CsvData; rowCount: number }
  | {
      success: false;
      reason: 'too-few-files' | 'header-mismatch';
      /** header-mismatch のとき、最初のファイルと見出しが違うファイルの添字 */
      fileIndex?: number;
    };

function sameHeader(a: string[], b: string[]): boolean {
  return a.length === b.length && a.every((v, i) => v === b[i]);
}

/**
 * 複数のCSVを上から順に結合する。
 * validateHeader が true なら、最初のファイルと見出しが一致しないファイルがあれば失敗にする
 * （見出しなしの場合は検証しない）。
 */
export function mergeCsvData(
  inputs: MergeInput[],
  validateHeader: boolean,
): MergeOutcome {
  if (inputs.length < 2) return { success: false, reason: 'too-few-files' };
  const header = inputs[0].data.header;
  if (validateHeader && header) {
    for (let i = 1; i < inputs.length; i++) {
      const other = inputs[i].data.header;
      if (!other || !sameHeader(header, other)) {
        return { success: false, reason: 'header-mismatch', fileIndex: i };
      }
    }
  }
  const rows: string[][] = [];
  inputs.forEach((input, i) => {
    // 検証しない場合、2ファイル目以降の見出し行は捨てずデータ行として残す
    if (i > 0 && !validateHeader && input.data.header) {
      rows.push(input.data.header);
    }
    for (const row of input.data.rows) rows.push(row);
  });
  return { success: true, data: { header, rows }, rowCount: rows.length };
}

// ---------- 重複削除 ----------

export interface DedupeOptions {
  /** 重複判定に使う列（0始まり）。空なら行全体 */
  keyColumns: number[];
  /** 重複のうち残す行 */
  keep: 'first' | 'last';
  ignoreCase: boolean;
  trim: boolean;
}

export interface DedupeResult {
  rows: string[][];
  removed: number;
}

function rowKey(row: string[], options: DedupeOptions, width: number): string {
  const columns =
    options.keyColumns.length > 0
      ? options.keyColumns
      : Array.from({ length: width }, (_, i) => i);
  const values = columns.map((c) => {
    let v = row[c] ?? '';
    if (options.trim) v = v.trim();
    if (options.ignoreCase) v = v.toLowerCase();
    return v;
  });
  return JSON.stringify(values);
}

/** キー列（または行全体）が同じ行を取り除く。残った行の順序は元のまま */
export function dedupeRows(
  rows: string[][],
  options: DedupeOptions,
): DedupeResult {
  const width = rows.reduce((max, r) => Math.max(max, r.length), 0);
  const keys = rows.map((row) => rowKey(row, options, width));
  const kept: string[][] = [];
  if (options.keep === 'first') {
    const seen = new Set<string>();
    rows.forEach((row, i) => {
      if (!seen.has(keys[i])) {
        seen.add(keys[i]);
        kept.push(row);
      }
    });
  } else {
    const lastIndex = new Map<string, number>();
    keys.forEach((key, i) => lastIndex.set(key, i));
    rows.forEach((row, i) => {
      if (lastIndex.get(keys[i]) === i) kept.push(row);
    });
  }
  return { rows: kept, removed: rows.length - kept.length };
}
