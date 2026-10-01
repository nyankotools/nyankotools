export interface ConvertSuccess {
  success: true;
  output: string;
}

export type ConvertFailure =
  | { success: false; reason: 'unterminated-quote' }
  | {
      success: false;
      reason: 'column-mismatch';
      line: number;
      expectedColumns: number;
      actualColumns: number;
    }
  | { success: false; reason: 'invalid-json'; message: string }
  | { success: false; reason: 'not-array' }
  | { success: false; reason: 'not-object'; index: number };

export type ConvertOutcome = ConvertSuccess | ConvertFailure;

class UnterminatedQuoteError extends Error {}

class ColumnMismatchError extends Error {
  constructor(
    public line: number,
    public expectedColumns: number,
    public actualColumns: number,
  ) {
    super('column mismatch');
  }
}

class NotArrayError extends Error {}

class NotObjectError extends Error {
  constructor(public index: number) {
    super('not an object');
  }
}

interface CsvRow {
  fields: string[];
  /** 物理的な空行（引用符なしの空フィールド1つだけ）。`""` の空値は含まない */
  blank: boolean;
}

/** CSVテキストを行×列の文字列配列に分解する（引用符・改行を含むフィールドに対応） */
function parseCsvRows(text: string, delimiter: string): CsvRow[] {
  const rows: CsvRow[] = [];
  let row: string[] = [];
  let field = '';
  let fieldQuoted = false;
  let rowQuoted = false;
  let inQuotes = false;
  let i = 0;
  const len = text.length;

  while (i < len) {
    const char = text[i];

    if (inQuotes) {
      if (char === '"') {
        if (text[i + 1] === '"') {
          field += '"';
          i += 2;
        } else {
          inQuotes = false;
          i += 1;
        }
      } else {
        field += char;
        i += 1;
      }
      continue;
    }

    if (char === '"') {
      inQuotes = true;
      fieldQuoted = true;
      rowQuoted = true;
      i += 1;
    } else if (char === delimiter) {
      row.push(field);
      field = '';
      fieldQuoted = false;
      i += 1;
    } else if (char === '\r') {
      i += 1;
    } else if (char === '\n') {
      row.push(field);
      rows.push({ fields: row, blank: !rowQuoted && isBlankFields(row) });
      row = [];
      field = '';
      fieldQuoted = false;
      rowQuoted = false;
      i += 1;
    } else {
      field += char;
      i += 1;
    }
  }

  if (inQuotes) {
    throw new UnterminatedQuoteError();
  }

  if (field.length > 0 || fieldQuoted || row.length > 0) {
    row.push(field);
    rows.push({ fields: row, blank: !rowQuoted && isBlankFields(row) });
  }

  return rows;
}

function isBlankFields(fields: string[]): boolean {
  return fields.length === 1 && fields[0] === '';
}

function escapeCsvField(
  value: string,
  delimiter: string,
  singleColumn = false,
): string {
  // 1列だけの空値は、そのままだと空行になって読み戻し時に消えるので `""` にする
  if (singleColumn && value === '') return '""';
  if (
    value.includes(delimiter) ||
    value.includes('"') ||
    value.includes('\n') ||
    value.includes('\r')
  ) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

function stringifyCsvValue(value: unknown): string {
  if (value === null || value === undefined) return '';
  if (typeof value === 'object') return JSON.stringify(value);
  return String(value);
}

function toFailure(error: unknown): ConvertFailure {
  if (error instanceof UnterminatedQuoteError) {
    return { success: false, reason: 'unterminated-quote' };
  }
  if (error instanceof ColumnMismatchError) {
    return {
      success: false,
      reason: 'column-mismatch',
      line: error.line,
      expectedColumns: error.expectedColumns,
      actualColumns: error.actualColumns,
    };
  }
  if (error instanceof NotArrayError) {
    return { success: false, reason: 'not-array' };
  }
  if (error instanceof NotObjectError) {
    return { success: false, reason: 'not-object', index: error.index };
  }
  return {
    success: false,
    reason: 'invalid-json',
    message: error instanceof Error ? error.message : String(error),
  };
}

export function csvToJson(input: string, delimiter = ','): ConvertOutcome {
  try {
    // 物理的な空行（引用符なし）は読み飛ばす。`""` の空値行は残す。エラー表示の行番号は元の行位置のまま保つ
    const rows = parseCsvRows(input, delimiter)
      .map(({ fields, blank }, index) => ({
        row: fields,
        blank,
        line: index + 1,
      }))
      .filter(({ blank }) => !blank);
    if (rows.length === 0) {
      return { success: true, output: '[]' };
    }

    const header = rows[0].row;
    const dataRows = rows.slice(1);

    const records = dataRows.map(({ row, line }) => {
      if (row.length !== header.length) {
        throw new ColumnMismatchError(line, header.length, row.length);
      }
      // "__proto__" 列が黙って消えないよう、代入ではなく定義で追加する
      const record: Record<string, string> = {};
      header.forEach((key, columnIndex) => {
        Object.defineProperty(record, key, {
          value: row[columnIndex],
          enumerable: true,
          writable: true,
          configurable: true,
        });
      });
      return record;
    });

    return { success: true, output: JSON.stringify(records, null, 2) };
  } catch (error) {
    return toFailure(error);
  }
}

export function jsonToCsv(input: string, delimiter = ','): ConvertOutcome {
  try {
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

    if (!Array.isArray(parsed)) {
      throw new NotArrayError();
    }

    if (parsed.length === 0) {
      return { success: true, output: '' };
    }

    const columns: string[] = [];
    const seen = new Set<string>();
    parsed.forEach((item, index) => {
      if (typeof item !== 'object' || item === null || Array.isArray(item)) {
        throw new NotObjectError(index);
      }
      for (const key of Object.keys(item)) {
        if (!seen.has(key)) {
          seen.add(key);
          columns.push(key);
        }
      }
    });

    // キーを持たないオブジェクトだけの配列は、ヘッダーも行も作れない（`[]` と同じ扱い）
    if (columns.length === 0) return { success: true, output: '' };

    const singleColumn = columns.length === 1;
    const lines: string[] = [];
    lines.push(
      columns
        .map((column) => escapeCsvField(column, delimiter, singleColumn))
        .join(delimiter),
    );

    for (const item of parsed) {
      const record = item as Record<string, unknown>;
      const line = columns
        .map((column) =>
          escapeCsvField(
            stringifyCsvValue(record[column]),
            delimiter,
            singleColumn,
          ),
        )
        .join(delimiter);
      lines.push(line);
    }

    return { success: true, output: lines.join('\n') + '\n' };
  } catch (error) {
    return toFailure(error);
  }
}
