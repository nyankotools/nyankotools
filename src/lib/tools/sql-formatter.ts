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

/** # で始まる行コメントを解釈する方言（PostgreSQL 等では # は演算子なので対象外） */
const HASH_COMMENT_DIALECTS: ReadonlySet<SqlDialect> = new Set([
  'mysql',
  'mariadb',
  'bigquery',
]);

/** `$$...$$` / `$tag$...$tag$` のドル引用符文字列を使う方言 */
const DOLLAR_QUOTE_DIALECTS: ReadonlySet<SqlDialect> = new Set(['postgresql']);

export function minifySqlQuery(
  input: string,
  dialect: SqlDialect = 'sql',
): string {
  const allowBackslashEscape = BACKSLASH_ESCAPE_DIALECTS.has(dialect);
  const allowHashComment = HASH_COMMENT_DIALECTS.has(dialect);
  const allowDollarQuote = DOLLAR_QUOTE_DIALECTS.has(dialect);
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

    // 行コメント（# ...。MySQL / MariaDB / BigQuery）
    if (ch === '#' && allowHashComment) {
      i++;
      while (i < input.length && input[i] !== '\n') i++;
      pendingSpace = true;
      continue;
    }

    // ドル引用符文字列（PostgreSQL）。中身の空白・コメント記号はそのまま保持する
    if (ch === '$' && allowDollarQuote) {
      const open = /^\$([A-Za-z_][A-Za-z0-9_]*)?\$/.exec(
        input.slice(i, i + 64),
      );
      if (open) {
        const end = input.indexOf(open[0], i + open[0].length);
        const stop = end === -1 ? input.length : end + open[0].length;
        if (pendingSpace && result.length > 0) result += ' ';
        pendingSpace = false;
        result += input.slice(i, stop);
        i = stop;
        continue;
      }
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
