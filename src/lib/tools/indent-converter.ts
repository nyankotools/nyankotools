export type IndentMode = 'tabs-to-spaces' | 'spaces-to-tabs' | 'change-width';

export interface IndentOptions {
  mode: IndentMode;
  /**
   * tabs-to-spaces: タブ1つの幅 / spaces-to-tabs: タブ1つにまとめるスペース数 /
   * change-width: 変換前のインデント幅
   */
  width: number;
  /** change-width のときの変換後のインデント幅 */
  toWidth?: number;
}

export interface IndentStats {
  totalLines: number;
  /** インデントが無い行（空行を含む） */
  unindentedLines: number;
  /** 行頭がタブのみのインデントの行数 */
  tabLines: number;
  /** 行頭がスペースのみのインデントの行数 */
  spaceLines: number;
  /** 行頭にタブとスペースが混在している行数 */
  mixedLines: number;
}

export const MIN_WIDTH = 1;
export const MAX_WIDTH = 16;

/** 幅を整数 1〜16 に丸める（不正な値は fallback） */
export function normalizeWidth(value: number, fallback = 4): number {
  if (!Number.isFinite(value)) return fallback;
  return Math.min(MAX_WIDTH, Math.max(MIN_WIDTH, Math.round(value)));
}

/** 行頭の空白（スペースとタブ）を、タブストップを考慮した桁数に換算する */
function leadingColumns(indent: string, tabWidth: number): number {
  let col = 0;
  for (const ch of indent) {
    col += ch === '\t' ? tabWidth - (col % tabWidth) : 1;
  }
  return col;
}

function convertIndentOfLine(line: string, options: IndentOptions): string {
  const match = /^[ \t]*/.exec(line);
  const indent = match ? match[0] : '';
  if (indent === '') return line;
  const rest = line.slice(indent.length);
  const width = normalizeWidth(options.width);
  const col = leadingColumns(indent, width);

  switch (options.mode) {
    case 'tabs-to-spaces':
      return ' '.repeat(col) + rest;
    case 'spaces-to-tabs':
      return (
        '\t'.repeat(Math.floor(col / width)) + ' '.repeat(col % width) + rest
      );
    case 'change-width': {
      const toWidth = normalizeWidth(options.toWidth ?? width);
      const levels = Math.floor(col / width);
      return ' '.repeat(levels * toWidth + (col % width)) + rest;
    }
  }
}

/** 行頭のインデントだけを変換する。行中のタブ・スペースと改行コードは変更しない */
export function convertIndent(text: string, options: IndentOptions): string {
  // 改行コードも含めて分割し、そのまま残す
  const parts = text.split(/(\r\n|\r|\n)/);
  return parts
    .map((part, i) => (i % 2 === 1 ? part : convertIndentOfLine(part, options)))
    .join('');
}

/** 行頭インデントの種類ごとの行数を数える */
export function analyzeIndent(text: string): IndentStats {
  const stats: IndentStats = {
    totalLines: 0,
    unindentedLines: 0,
    tabLines: 0,
    spaceLines: 0,
    mixedLines: 0,
  };
  if (text === '') return stats;
  for (const line of text.split(/\r\n|\r|\n/)) {
    stats.totalLines++;
    const indent = /^[ \t]*/.exec(line)?.[0] ?? '';
    if (indent === '') stats.unindentedLines++;
    else if (!indent.includes(' ')) stats.tabLines++;
    else if (!indent.includes('\t')) stats.spaceLines++;
    else stats.mixedLines++;
  }
  return stats;
}
