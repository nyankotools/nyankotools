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

/** CSVテキストを行×列の文字列配列に分解する（引用符・改行を含むフィールドに対応） */
function parseCsvRows(text: string, delimiter: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = '';
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
      i += 1;
    } else if (char === delimiter) {
      row.push(field);
      field = '';
      i += 1;
    } else if (char === '\r') {
      i += 1;
    } else if (char === '\n') {
      row.push(field);
      rows.push(row);
      row = [];
      field = '';
      i += 1;
    } else {
      field += char;
      i += 1;
    }
  }

  if (inQuotes) {
    throw new UnterminatedQuoteError();
  }

  if (field.length > 0 || row.length > 0) {
    row.push(field);
    rows.push(row);
  }

  return rows;
}

function escapeCsvField(value: string, delimiter: string): string {
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
    const rows = parseCsvRows(input, delimiter);
    if (rows.length === 0) {
      return { success: true, output: '[]' };
    }

    const header = rows[0];
    const dataRows = rows.slice(1);

    const records = dataRows.map((row, index) => {
      if (row.length !== header.length) {
        throw new ColumnMismatchError(index + 2, header.length, row.length);
      }
      const record: Record<string, string> = {};
      header.forEach((key, columnIndex) => {
        record[key] = row[columnIndex];
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

    const lines: string[] = [];
    lines.push(
      columns
        .map((column) => escapeCsvField(column, delimiter))
        .join(delimiter),
    );

    for (const item of parsed) {
      const record = item as Record<string, unknown>;
      const line = columns
        .map((column) =>
          escapeCsvField(stringifyCsvValue(record[column]), delimiter),
        )
        .join(delimiter);
      lines.push(line);
    }

    return { success: true, output: lines.join('\n') + '\n' };
  } catch (error) {
    return toFailure(error);
  }
}
