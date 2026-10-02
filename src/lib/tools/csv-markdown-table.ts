import { parseCsvRows, UnterminatedQuoteError } from './csv-json-converter';

export type DelimiterOption = 'auto' | ',' | '\t' | ';';
export type Align = 'none' | 'left' | 'center' | 'right';

export interface MarkdownTableOptions {
  delimiter: DelimiterOption;
  /** 先頭行を見出し行として使う。false なら空の見出し行を補う */
  header: boolean;
  align: Align;
  /** 列幅をそろえて整形する */
  pad: boolean;
}

export type MarkdownTableOutcome =
  | { success: true; output: string; rows: number; columns: number }
  | { success: false; reason: 'unterminated-quote' };

/** 1行目にタブがあればタブ、なければカンマとみなす */
export function detectDelimiter(text: string): ',' | '\t' {
  const firstLine = text.split('\n', 1)[0];
  return firstLine.includes('\t') ? '\t' : ',';
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

/** セルをMarkdownテーブル用にエスケープする（`|` と改行） */
export function escapeCell(value: string): string {
  return value
    .replace(/\\(?=\|)/g, '\\\\')
    .replace(/\|/g, '\\|')
    .replace(/\r\n|\r|\n/g, '<br>');
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

export function csvToMarkdownTable(
  input: string,
  options: MarkdownTableOptions,
): MarkdownTableOutcome {
  const delimiter =
    options.delimiter === 'auto' ? detectDelimiter(input) : options.delimiter;

  let parsed;
  try {
    parsed = parseCsvRows(input, delimiter);
  } catch (error) {
    if (error instanceof UnterminatedQuoteError) {
      return { success: false, reason: 'unterminated-quote' };
    }
    throw error;
  }

  const data = parsed.filter(({ blank }) => !blank).map(({ fields }) => fields);
  if (data.length === 0) {
    return { success: true, output: '', rows: 0, columns: 0 };
  }

  const columns = Math.max(...data.map((row) => row.length));
  const normalized = data.map((row) => {
    const cells = row.map(escapeCell);
    while (cells.length < columns) cells.push('');
    return cells;
  });

  const header = options.header ? normalized[0] : Array(columns).fill('');
  const body = options.header ? normalized.slice(1) : normalized;

  // 区切り行は :--- / :-: / ---: が成立する最小幅（3）を保つ
  const widths = Array.from({ length: columns }, (_, column) => {
    if (!options.pad) return 3;
    const cellWidths = [header, ...body].map((row) =>
      displayWidth(row[column]),
    );
    return Math.max(3, ...cellWidths);
  });

  const formatRow = (cells: string[]) =>
    '| ' +
    cells
      .map((cell, column) =>
        options.pad ? padCell(cell, widths[column], options.align) : cell,
      )
      .join(' | ') +
    ' |';

  const lines = [
    formatRow(header),
    '| ' +
      widths.map((width) => separatorCell(width, options.align)).join(' | ') +
      ' |',
    ...body.map(formatRow),
  ];

  return {
    success: true,
    output: lines.join('\n'),
    rows: body.length,
    columns,
  };
}
