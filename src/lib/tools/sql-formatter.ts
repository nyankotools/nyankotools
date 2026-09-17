import {
  format as formatSql,
  type FormatOptionsWithLanguage,
} from 'sql-formatter';

export type SqlDialect =
  | 'sql'
  | 'mysql'
  | 'mariadb'
  | 'postgresql'
  | 'sqlite'
  | 'bigquery'
  | 'transactsql'
  | 'plsql';

export type SqlKeywordCase = 'preserve' | 'upper' | 'lower';

export interface FormatSqlOptions {
  dialect?: SqlDialect;
  tabWidth?: number;
  useTabs?: boolean;
  keywordCase?: SqlKeywordCase;
}

export interface SqlOutcomeSuccess {
  success: true;
  output: string;
}

export interface SqlOutcomeFailure {
  success: false;
  message: string;
}

export type SqlOutcome = SqlOutcomeSuccess | SqlOutcomeFailure;

export function formatSqlQuery(
  input: string,
  options: FormatSqlOptions = {},
): SqlOutcome {
  const {
    dialect = 'sql',
    tabWidth = 2,
    useTabs = false,
    keywordCase = 'upper',
  } = options;
  try {
    const cfg: FormatOptionsWithLanguage = {
      language: dialect,
      tabWidth,
      useTabs,
      keywordCase,
    };
    return { success: true, output: formatSql(input, cfg) };
  } catch (error) {
    const raw = error instanceof Error ? error.message : String(error);
    return { success: false, message: raw.split('\n')[0] };
  }
}

/** バックスラッシュエスケープ（\'）を文字列リテラル内で解釈する方言。それ以外の方言では \ を特別扱いしない（例: 標準SQL・PostgreSQL・SQL Server・Oracle） */
const BACKSLASH_ESCAPE_DIALECTS: ReadonlySet<SqlDialect> = new Set([
  'mysql',
  'mariadb',
  'bigquery',
]);

export function minifySqlQuery(
  input: string,
  dialect: SqlDialect = 'sql',
): string {
  const allowBackslashEscape = BACKSLASH_ESCAPE_DIALECTS.has(dialect);
  let result = '';
  let pendingSpace = false;
  let i = 0;

  while (i < input.length) {
    const ch = input[i];

    // 行コメント（-- ...）
    if (ch === '-' && input[i + 1] === '-') {
      i += 2;
      while (i < input.length && input[i] !== '\n') i++;
      pendingSpace = true;
      continue;
    }

    // ブロックコメント（/* ... */）
    if (ch === '/' && input[i + 1] === '*') {
      i += 2;
      while (i < input.length && !(input[i] === '*' && input[i + 1] === '/')) {
        i++;
      }
      i += 2;
      pendingSpace = true;
      continue;
    }

    // 空白（連続する空白・改行はまとめて1個のスペースにする）
    if (ch === ' ' || ch === '\t' || ch === '\n' || ch === '\r') {
      pendingSpace = true;
      i++;
      continue;
    }

    // 文字列・識別子リテラル（中身の空白はそのまま保持する）
    const quote = matchQuoteStart(ch, allowBackslashEscape);
    if (quote) {
      if (pendingSpace && result.length > 0) result += ' ';
      pendingSpace = false;
      const [literal, nextIndex] = readQuoted(input, i, quote);
      result += literal;
      i = nextIndex;
      continue;
    }

    if (pendingSpace && result.length > 0) result += ' ';
    pendingSpace = false;
    result += ch;
    i++;
  }

  return result;
}

interface QuotePair {
  open: string;
  close: string;
  allowBackslashEscape: boolean;
}

function matchQuoteStart(
  ch: string,
  allowBackslashEscape: boolean,
): QuotePair | null {
  if (ch === "'") return { open: "'", close: "'", allowBackslashEscape };
  if (ch === '"') return { open: '"', close: '"', allowBackslashEscape: false };
  if (ch === '`') return { open: '`', close: '`', allowBackslashEscape: false };
  if (ch === '[') return { open: '[', close: ']', allowBackslashEscape: false };
  return null;
}

/** クォート開始位置から対応する終端までを読み取る（クォートを二重にするエスケープ・バックスラッシュエスケープに対応） */
function readQuoted(
  input: string,
  start: number,
  quote: QuotePair,
): [string, number] {
  let i = start + 1;
  let literal = quote.open;
  while (i < input.length) {
    const ch = input[i];
    if (quote.allowBackslashEscape && ch === '\\') {
      literal += ch + (input[i + 1] ?? '');
      i += 2;
      continue;
    }
    if (ch === quote.close) {
      if (input[i + 1] === quote.close) {
        literal += quote.close + quote.close;
        i += 2;
        continue;
      }
      literal += quote.close;
      i++;
      break;
    }
    literal += ch;
    i++;
  }
  return [literal, i];
}
