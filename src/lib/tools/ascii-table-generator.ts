import { parseCsvRows, UnterminatedQuoteError } from './csv-json-converter';

export type DelimiterOption = 'auto' | ',' | '\t' | ';';
export type Align = 'left' | 'center' | 'right';
export type BorderStyle = 'ascii' | 'single' | 'rounded' | 'double';

export interface AsciiTableOptions {
  delimiter: DelimiterOption;
  style: BorderStyle;
  align: Align;
  /** 先頭行を見出しとして、下に区切り線を引く */
  header: boolean;
  /** すべての行の間に区切り線を引く */
  rowSeparators: boolean;
}

export type AsciiTableOutcome =
  | { success: true; output: string; rows: number; columns: number }
  | { success: false; reason: 'unterminated-quote' };

interface Chars {
  h: string;
  v: string;
  tl: string;
  tc: string;
  tr: string;
  ml: string;
  mc: string;
  mr: string;
  bl: string;
  bc: string;
  br: string;
}

export const BORDER_CHARS: Record<BorderStyle, Chars> = {
  ascii: {
    h: '-',
    v: '|',
    tl: '+',
    tc: '+',
    tr: '+',
    ml: '+',
    mc: '+',
    mr: '+',
    bl: '+',
    bc: '+',
    br: '+',
  },
  single: {
    h: '─',
    v: '│',
    tl: '┌',
    tc: '┬',
    tr: '┐',
    ml: '├',
    mc: '┼',
    mr: '┤',
    bl: '└',
    bc: '┴',
    br: '┘',
  },
  rounded: {
    h: '─',
    v: '│',
    tl: '╭',
    tc: '┬',
    tr: '╮',
    ml: '├',
    mc: '┼',
    mr: '┤',
    bl: '╰',
    bc: '┴',
    br: '╯',
  },
  double: {
    h: '═',
    v: '║',
    tl: '╔',
    tc: '╦',
    tr: '╗',
    ml: '╠',
    mc: '╬',
    mr: '╣',
    bl: '╚',
    bc: '╩',
    br: '╝',
  },
};

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
      (code >= 0x3099 && code <= 0x309a) ||
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

function padCell(text: string, width: number, align: Align): string {
  const gap = Math.max(0, width - displayWidth(text));
  if (align === 'right') return ' '.repeat(gap) + text;
  if (align === 'center') {
    const left = Math.floor(gap / 2);
    return ' '.repeat(left) + text + ' '.repeat(gap - left);
  }
  return text + ' '.repeat(gap);
}

export function csvToAsciiTable(
  input: string,
  options: AsciiTableOptions,
): AsciiTableOutcome {
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
  // セルは行ごとに分割し、セル内改行は複数行の表示にする
  const rows = data.map((row) => {
    const cells = row.map((cell) => cell.split(/\r\n|\r|\n/));
    while (cells.length < columns) cells.push(['']);
    return cells;
  });

  const widths = Array.from({ length: columns }, (_, column) =>
    Math.max(
      0,
      ...rows.flatMap((row) => row[column].map((line) => displayWidth(line))),
    ),
  );

  const c = BORDER_CHARS[options.style];
  const rule = (left: string, mid: string, right: string) =>
    left + widths.map((w) => c.h.repeat(w + 2)).join(mid) + right;

  const lines: string[] = [rule(c.tl, c.tc, c.tr)];
  rows.forEach((row, index) => {
    const height = Math.max(...row.map((cell) => cell.length));
    for (let line = 0; line < height; line++) {
      lines.push(
        c.v +
          row
            .map(
              (cell, column) =>
                ' ' +
                padCell(cell[line] ?? '', widths[column], options.align) +
                ' ',
            )
            .join(c.v) +
          c.v,
      );
    }
    const isLast = index === rows.length - 1;
    if (!isLast && (options.rowSeparators || (options.header && index === 0))) {
      lines.push(rule(c.ml, c.mc, c.mr));
    }
  });
  lines.push(rule(c.bl, c.bc, c.br));

  return {
    success: true,
    output: lines.join('\n'),
    rows: rows.length,
    columns,
  };
}
