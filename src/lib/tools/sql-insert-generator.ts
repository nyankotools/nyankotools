import { parseCsvRows, UnterminatedQuoteError } from './csv-json-converter';

export type SqlDialect =
  'mysql' | 'postgresql' | 'sqlite' | 'sqlserver' | 'oracle';
export type SqlSource = 'csv' | 'json';

export interface SqlInsertOptions {
  source: SqlSource;
  dialect: SqlDialect;
  tableName: string;
  /** CSV: 区切り文字（`,` または `\t`） */
  delimiter: string;
  /** CSV: 1行目をヘッダー（カラム名）として扱う */
  hasHeader: boolean;
  /** CSV: 空のフィールドを NULL にする（false なら空文字列） */
  emptyAsNull: boolean;
  /** 複数行VALUESにまとめる（false なら1行1文） */
  multiRow: boolean;
  /** CREATE TABLE 文（推定した型つき）を先頭に付ける */
  includeCreateTable: boolean;
  /** CREATE TABLE のカラム型の上書き（カラム名 → 型）。空・未指定なら推定値 */
  columnTypes?: ReadonlyMap<string, string>;
}

export interface SqlColumn {
  name: string;
  /** CREATE TABLE に使う型（上書きがあればその値） */
  type: string;
  /** 値から推定した型 */
  inferredType: string;
}

/**
 * 型の入力欄に出す候補（各DBの公式ドキュメントのデータ型一覧に基づく）。
 * 公式が推奨する型（PostgreSQL の TEXT / TIMESTAMPTZ、SQL Server の DATETIME2 など）を先に並べる
 */
export function typeSuggestions(dialect: SqlDialect): string[] {
  switch (dialect) {
    case 'mysql':
      return [
        'INT',
        'BIGINT',
        'SMALLINT',
        'TINYINT',
        'MEDIUMINT',
        'DECIMAL(10,2)',
        'DOUBLE',
        'FLOAT',
        'BOOLEAN',
        'BIT(1)',
        'VARCHAR(255)',
        'CHAR(10)',
        'TEXT',
        'TINYTEXT',
        'MEDIUMTEXT',
        'LONGTEXT',
        'DATE',
        'DATETIME',
        'TIMESTAMP',
        'TIME',
        'YEAR',
        'JSON',
        'BLOB',
        'VARBINARY(255)',
        'BINARY(16)',
      ];
    case 'postgresql':
      return [
        'INTEGER',
        'BIGINT',
        'SMALLINT',
        'NUMERIC(10,2)',
        'DOUBLE PRECISION',
        'REAL',
        'BOOLEAN',
        'TEXT',
        'VARCHAR(255)',
        'CHAR(10)',
        'TIMESTAMPTZ',
        'TIMESTAMP',
        'DATE',
        'TIME',
        'INTERVAL',
        'UUID',
        'JSONB',
        'JSON',
        'BYTEA',
        'INET',
        'BIGSERIAL',
        'SERIAL',
      ];
    case 'sqlite':
      return [
        'INTEGER',
        'REAL',
        'TEXT',
        'NUMERIC',
        'BLOB',
        'BOOLEAN',
        'DATE',
        'DATETIME',
      ];
    case 'sqlserver':
      return [
        'INT',
        'BIGINT',
        'SMALLINT',
        'TINYINT',
        'DECIMAL(10,2)',
        'NUMERIC(10,2)',
        'FLOAT',
        'REAL',
        'MONEY',
        'BIT',
        'NVARCHAR(255)',
        'NVARCHAR(MAX)',
        'VARCHAR(255)',
        'VARCHAR(MAX)',
        'NCHAR(10)',
        'CHAR(10)',
        'DATETIME2',
        'DATETIMEOFFSET',
        'DATE',
        'TIME',
        'SMALLDATETIME',
        'DATETIME',
        'UNIQUEIDENTIFIER',
        'VARBINARY(MAX)',
        'XML',
      ];
    case 'oracle':
      return [
        'NUMBER(10)',
        'NUMBER(19)',
        'NUMBER(10,2)',
        'BINARY_DOUBLE',
        'BINARY_FLOAT',
        'FLOAT',
        'VARCHAR2(255 CHAR)',
        'NVARCHAR2(255)',
        'CHAR(10)',
        'CLOB',
        'NCLOB',
        'DATE',
        'TIMESTAMP',
        'TIMESTAMP WITH TIME ZONE',
        'BLOB',
        'RAW(16)',
        'JSON',
        'BOOLEAN',
      ];
  }
}

export type SqlInsertFailure =
  | { success: false; reason: 'unterminated-quote' }
  | { success: false; reason: 'empty' }
  | {
      success: false;
      reason: 'column-mismatch';
      line: number;
      expectedColumns: number;
      actualColumns: number;
    }
  | { success: false; reason: 'duplicate-column'; name: string }
  | { success: false; reason: 'invalid-json'; message: string }
  | { success: false; reason: 'not-array' }
  | { success: false; reason: 'not-object'; index: number };

export type SqlInsertOutcome =
  | { success: true; sql: string; columns: SqlColumn[]; rowCount: number }
  | SqlInsertFailure;

/** 複数行VALUESを分割する行数（巨大な1文によるパケット上限などを避ける） */
export const MULTI_ROW_BATCH_SIZE = 1000;

export const DEFAULT_TABLE_NAME = 'my_table';

type Hint = 'num' | 'bool' | 'str';

/** `null` は SQL の NULL。それ以外は元の値の文字列表現と、型推定用のヒント */
type Cell = null | { raw: string; hint: Hint };

type ColumnKind = 'integer' | 'float' | 'boolean' | 'text';

const NUMBER_PATTERN = /^-?(0|[1-9]\d*)(\.\d+)?([eE][+-]?\d+)?$/;
const INTEGER_PATTERN = /^-?(0|[1-9]\d*)$/;
const BOOLEAN_PATTERN = /^(true|false)$/i;
/** BIGINT に収まる桁数の上限（これを超える整数列は文字列として扱う） */
const MAX_INTEGER_DIGITS = 18;
/** これ以下の桁数なら INT（32bit）に収まる */
const INT_DIGITS = 9;

function classifyText(value: string): Hint {
  if (NUMBER_PATTERN.test(value)) return 'num';
  if (BOOLEAN_PATTERN.test(value)) return 'bool';
  return 'str';
}

function digitsOf(raw: string): number {
  return raw.replace('-', '').length;
}

function inferKind(cells: Cell[]): ColumnKind {
  const values = cells.filter((c): c is NonNullable<Cell> => c !== null);
  if (values.length === 0) return 'text';
  if (values.every((c) => c.hint === 'bool')) return 'boolean';
  if (values.every((c) => c.hint === 'num')) {
    if (values.every((c) => INTEGER_PATTERN.test(c.raw))) {
      return values.some((c) => digitsOf(c.raw) > MAX_INTEGER_DIGITS)
        ? 'text'
        : 'integer';
    }
    return 'float';
  }
  return 'text';
}

function typeName(
  kind: ColumnKind,
  dialect: SqlDialect,
  cells: Cell[],
): string {
  switch (kind) {
    case 'integer': {
      const wide = cells.some(
        (c) => c !== null && digitsOf(c.raw) > INT_DIGITS,
      );
      switch (dialect) {
        case 'sqlite':
          return 'INTEGER';
        case 'mysql':
        case 'sqlserver':
          return wide ? 'BIGINT' : 'INT';
        case 'oracle':
          return wide ? 'NUMBER(19)' : 'NUMBER(10)';
        case 'postgresql':
          return wide ? 'BIGINT' : 'INTEGER';
      }
      break;
    }
    case 'float':
      switch (dialect) {
        case 'sqlite':
          return 'REAL';
        case 'mysql':
          return 'DOUBLE';
        case 'sqlserver':
          return 'FLOAT';
        case 'oracle':
          return 'BINARY_DOUBLE';
        case 'postgresql':
          return 'DOUBLE PRECISION';
      }
      break;
    case 'boolean':
      switch (dialect) {
        case 'sqlite':
          return 'INTEGER';
        case 'sqlserver':
          return 'BIT';
        case 'oracle':
          return 'NUMBER(1)';
        default:
          return 'BOOLEAN';
      }
    case 'text': {
      if (dialect === 'postgresql' || dialect === 'sqlite') return 'TEXT';
      // SQL Server の NVARCHAR は UTF-16 コードユニット数、他はコードポイント数で数える
      const lengthOf = (raw: string) =>
        dialect === 'sqlserver' ? raw.length : [...raw].length;
      const maxLength = Math.max(
        0,
        ...cells.map((c) => (c === null ? 0 : lengthOf(c.raw))),
      );
      const fits = maxLength <= 255;
      switch (dialect) {
        case 'mysql':
          return fits ? 'VARCHAR(255)' : 'TEXT';
        case 'sqlserver':
          return fits ? 'NVARCHAR(255)' : 'NVARCHAR(MAX)';
        default:
          return fits ? 'VARCHAR2(255 CHAR)' : 'CLOB';
      }
    }
  }
  return 'TEXT';
}

export function quoteIdentifier(name: string, dialect: SqlDialect): string {
  if (dialect === 'mysql') return `\`${name.replace(/`/g, '``')}\``;
  if (dialect === 'sqlserver') return `[${name.replace(/]/g, ']]')}]`;
  return `"${name.replace(/"/g, '""')}"`;
}

/** `schema.table` 形式は `.` で分割してそれぞれ引用する */
export function quoteTableName(name: string, dialect: SqlDialect): string {
  const trimmed = name.trim() || DEFAULT_TABLE_NAME;
  return trimmed
    .split('.')
    .map((part) =>
      quoteIdentifier(part === '' ? DEFAULT_TABLE_NAME : part, dialect),
    )
    .join('.');
}

export function quoteString(value: string, dialect: SqlDialect): string {
  // MySQL は既定でバックスラッシュもエスケープ文字として扱う
  const escaped = dialect === 'mysql' ? value.replace(/\\/g, '\\\\') : value;
  const quoted = `'${escaped.replace(/'/g, "''")}'`;
  // SQL Server は N プレフィックスがないと Unicode 文字が化ける
  return dialect === 'sqlserver' ? `N${quoted}` : quoted;
}

function renderCell(cell: Cell, kind: ColumnKind, dialect: SqlDialect): string {
  if (cell === null) return 'NULL';
  switch (kind) {
    case 'integer':
    case 'float':
      return cell.raw;
    case 'boolean': {
      const isTrue = cell.raw.toLowerCase() === 'true';
      if (
        dialect === 'sqlite' ||
        dialect === 'sqlserver' ||
        dialect === 'oracle'
      )
        return isTrue ? '1' : '0';
      return isTrue ? 'TRUE' : 'FALSE';
    }
    case 'text':
      return quoteString(cell.raw, dialect);
  }
}

interface Table {
  names: string[];
  rows: Cell[][];
}

function dedupeCheck(names: string[]): string | null {
  const seen = new Set<string>();
  for (const name of names) {
    if (seen.has(name)) return name;
    seen.add(name);
  }
  return null;
}

function tableFromCsv(
  input: string,
  options: SqlInsertOptions,
): Table | SqlInsertFailure {
  let parsed;
  try {
    parsed = parseCsvRows(
      input.charCodeAt(0) === 0xfeff ? input.slice(1) : input,
      options.delimiter,
    );
  } catch (error) {
    if (error instanceof UnterminatedQuoteError) {
      return { success: false, reason: 'unterminated-quote' };
    }
    throw error;
  }
  // 物理的な空行は読み飛ばす（エラー表示の行番号は元の行位置のまま）
  const rows = parsed
    .map(({ fields, blank }, index) => ({ fields, blank, line: index + 1 }))
    .filter(({ blank }) => !blank);
  if (rows.length === 0) return { success: false, reason: 'empty' };

  const width = rows[0].fields.length;
  let names: string[];
  let dataRows = rows;
  if (options.hasHeader) {
    names = rows[0].fields.map((name, i) =>
      name.trim() === '' ? `column${i + 1}` : name,
    );
    dataRows = rows.slice(1);
  } else {
    names = Array.from({ length: width }, (_, i) => `column${i + 1}`);
  }
  if (dataRows.length === 0) return { success: false, reason: 'empty' };
  const duplicate = dedupeCheck(names);
  if (duplicate !== null) {
    return { success: false, reason: 'duplicate-column', name: duplicate };
  }

  const cells: Cell[][] = [];
  for (const { fields, line } of dataRows) {
    if (fields.length !== width) {
      return {
        success: false,
        reason: 'column-mismatch',
        line,
        expectedColumns: width,
        actualColumns: fields.length,
      };
    }
    cells.push(
      fields.map((value): Cell => {
        if (value === '' && options.emptyAsNull) return null;
        return { raw: value, hint: classifyText(value) };
      }),
    );
  }
  return { names, rows: cells };
}

function jsonCell(value: unknown): Cell {
  if (value === null || value === undefined) return null;
  if (typeof value === 'number') {
    return Number.isFinite(value) ? { raw: String(value), hint: 'num' } : null;
  }
  if (typeof value === 'boolean') {
    return { raw: String(value), hint: 'bool' };
  }
  if (typeof value === 'string') return { raw: value, hint: 'str' };
  return { raw: JSON.stringify(value), hint: 'str' };
}

function tableFromJson(input: string): Table | SqlInsertFailure {
  let parsed: unknown;
  try {
    parsed = JSON.parse(input);
  } catch (error) {
    return {
      success: false,
      reason: 'invalid-json',
      message: error instanceof Error ? error.message : String(error),
    };
  }
  const items = Array.isArray(parsed) ? parsed : [parsed];
  if (
    !Array.isArray(parsed) &&
    (typeof parsed !== 'object' || parsed === null)
  ) {
    return { success: false, reason: 'not-array' };
  }
  if (items.length === 0) return { success: false, reason: 'empty' };

  const names: string[] = [];
  const seen = new Set<string>();
  for (let index = 0; index < items.length; index += 1) {
    const item = items[index];
    if (typeof item !== 'object' || item === null || Array.isArray(item)) {
      return { success: false, reason: 'not-object', index };
    }
    for (const key of Object.keys(item)) {
      if (!seen.has(key)) {
        seen.add(key);
        names.push(key);
      }
    }
  }
  if (names.length === 0) return { success: false, reason: 'empty' };

  const rows = (items as Record<string, unknown>[]).map((item) =>
    names.map((name) =>
      jsonCell(
        Object.prototype.hasOwnProperty.call(item, name)
          ? item[name]
          : undefined,
      ),
    ),
  );
  // 空文字のキーは識別子にできないので、CSVと同様に連番名へ置き換える
  const outNames = names.map((n, i) => (n === '' ? `column${i + 1}` : n));
  return { names: outNames, rows };
}

export function generateSqlInsert(
  input: string,
  options: SqlInsertOptions,
): SqlInsertOutcome {
  const table =
    options.source === 'csv'
      ? tableFromCsv(input, options)
      : tableFromJson(input);
  if ('success' in table) return table;

  const { dialect } = options;
  const { names, rows } = table;
  const tableSql = quoteTableName(options.tableName, dialect);
  const columnsSql = names.map((n) => quoteIdentifier(n, dialect)).join(', ');

  const kinds: ColumnKind[] = [];
  const columns: SqlColumn[] = names.map((name, index) => {
    const cells = rows.map((row) => row[index]);
    const kind = inferKind(cells);
    kinds.push(kind);
    const inferredType = typeName(kind, dialect, cells);
    const override = options.columnTypes?.get(name)?.trim();
    return { name, type: override || inferredType, inferredType };
  });

  const rowSql = rows.map(
    (row) =>
      `(${row.map((cell, i) => renderCell(cell, kinds[i], dialect)).join(', ')})`,
  );

  const blocks: string[] = [];
  if (options.includeCreateTable) {
    const defs = columns
      .map((c) => `  ${quoteIdentifier(c.name, dialect)} ${c.type}`)
      .join(',\n');
    blocks.push(`CREATE TABLE ${tableSql} (\n${defs}\n);`);
  }

  const insertHead = `INSERT INTO ${tableSql} (${columnsSql})`;
  if (options.multiRow && dialect === 'oracle') {
    // Oracle（23c未満）は複数行VALUESが使えないので INSERT ALL にする
    for (let i = 0; i < rowSql.length; i += MULTI_ROW_BATCH_SIZE) {
      const chunk = rowSql.slice(i, i + MULTI_ROW_BATCH_SIZE);
      const intos = chunk
        .map((r) => `  INTO ${tableSql} (${columnsSql}) VALUES ${r}`)
        .join('\n');
      blocks.push(`INSERT ALL\n${intos}\nSELECT 1 FROM DUAL;`);
    }
  } else if (options.multiRow) {
    for (let i = 0; i < rowSql.length; i += MULTI_ROW_BATCH_SIZE) {
      const chunk = rowSql.slice(i, i + MULTI_ROW_BATCH_SIZE);
      blocks.push(`${insertHead} VALUES\n  ${chunk.join(',\n  ')};`);
    }
  } else {
    blocks.push(rowSql.map((r) => `${insertHead} VALUES ${r};`).join('\n'));
  }

  return {
    success: true,
    sql: blocks.join('\n\n') + '\n',
    columns,
    rowCount: rows.length,
  };
}
