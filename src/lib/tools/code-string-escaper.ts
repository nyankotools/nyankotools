export type EscapeLanguage =
  'shell' | 'regex' | 'sql' | 'sql-mysql' | 'csv' | 'json';
export type EscapeDirection = 'escape' | 'unescape';

export type EscapeError = 'unterminated-quote' | 'invalid-json' | 'invalid-csv';

export type EscapeResult =
  { ok: true; value: string } | { ok: false; error: EscapeError };

export const ESCAPE_LANGUAGES: EscapeLanguage[] = [
  'shell',
  'regex',
  'sql',
  'sql-mysql',
  'csv',
  'json',
];

function ok(value: string): EscapeResult {
  return { ok: true, value };
}

// ---- シェル（POSIX sh / bash）: 単一引用符で囲む方式 ----

export function escapeShell(text: string): string {
  return `'${text.replace(/'/g, `'\\''`)}'`;
}

export function unescapeShell(text: string): EscapeResult {
  let out = '';
  let i = 0;
  while (i < text.length) {
    const ch = text[i];
    if (ch === "'") {
      const end = text.indexOf("'", i + 1);
      if (end === -1) return { ok: false, error: 'unterminated-quote' };
      out += text.slice(i + 1, end);
      i = end + 1;
    } else if (ch === '"') {
      i++;
      let closed = false;
      while (i < text.length) {
        const c = text[i];
        if (c === '"') {
          closed = true;
          i++;
          break;
        }
        if (c === '\\' && i + 1 < text.length) {
          const next = text[i + 1];
          if (next === '$' || next === '`' || next === '"' || next === '\\') {
            out += next;
            i += 2;
            continue;
          }
          if (next === '\n') {
            i += 2;
            continue;
          }
        }
        out += c;
        i++;
      }
      if (!closed) return { ok: false, error: 'unterminated-quote' };
    } else if (ch === '\\') {
      if (i + 1 < text.length) {
        if (text[i + 1] !== '\n') out += text[i + 1];
        i += 2;
      } else {
        i++;
      }
    } else {
      out += ch;
      i++;
    }
  }
  return ok(out);
}

// ---- 正規表現 ----

export function escapeRegex(text: string): string {
  return text.replace(/[.*+?^${}()|[\]\\/]/g, '\\$&');
}

export function unescapeRegex(text: string): string {
  return text.replace(/\\([\s\S])/g, (match, ch: string) =>
    /[A-Za-z0-9]/.test(ch) ? match : ch,
  );
}

// ---- SQL ----

export function escapeSql(text: string): string {
  return text.replace(/'/g, "''");
}

export function unescapeSql(text: string): string {
  return text.replace(/''/g, "'");
}

const MYSQL_ESCAPE_MAP: Record<string, string> = {
  '\0': '\\0',
  '\n': '\\n',
  '\r': '\\r',
  '\x1a': '\\Z',
  '\\': '\\\\',
  "'": "\\'",
  '"': '\\"',
};

export function escapeSqlMysql(text: string): string {
  // eslint-disable-next-line no-control-regex
  return text.replace(/[\0\n\r\x1a\\'"]/g, (ch) => MYSQL_ESCAPE_MAP[ch]);
}

const MYSQL_UNESCAPE_MAP: Record<string, string> = {
  '0': '\0',
  b: '\b',
  n: '\n',
  r: '\r',
  t: '\t',
  Z: '\x1a',
};

export function unescapeSqlMysql(text: string): string {
  return text.replace(/\\([\s\S])|''/g, (match, ch: string | undefined) => {
    if (ch === undefined) return "'";
    if (ch === '%' || ch === '_') return match;
    return MYSQL_UNESCAPE_MAP[ch] ?? ch;
  });
}

// ---- CSV（テキスト全体を1フィールドとして扱う） ----

export function escapeCsv(text: string): string {
  if (/[",\r\n]/.test(text)) return `"${text.replace(/"/g, '""')}"`;
  return text;
}

export function unescapeCsv(text: string): EscapeResult {
  if (!text.startsWith('"')) return ok(text.replace(/""/g, '"'));
  if (text.length < 2 || !text.endsWith('"')) {
    return { ok: false, error: 'invalid-csv' };
  }
  const inner = text.slice(1, -1);
  // 引用符は2連続でのみ現れるはず
  if (/(^|[^"])("")*"([^"]|$)/.test(inner)) {
    return { ok: false, error: 'invalid-csv' };
  }
  return ok(inner.replace(/""/g, '"'));
}

// ---- JSON 文字列 ----

export function escapeJson(text: string): string {
  return JSON.stringify(text).slice(1, -1);
}

export function unescapeJson(text: string): EscapeResult {
  const trimmed = text.trim();
  const inner =
    trimmed.length >= 2 && trimmed.startsWith('"') && trimmed.endsWith('"')
      ? trimmed.slice(1, -1)
      : text;
  try {
    const parsed: unknown = JSON.parse(`"${inner}"`);
    return ok(String(parsed));
  } catch {
    return { ok: false, error: 'invalid-json' };
  }
}

export function convertCodeString(
  text: string,
  language: EscapeLanguage,
  direction: EscapeDirection,
): EscapeResult {
  if (direction === 'escape') {
    switch (language) {
      case 'shell':
        return ok(escapeShell(text));
      case 'regex':
        return ok(escapeRegex(text));
      case 'sql':
        return ok(escapeSql(text));
      case 'sql-mysql':
        return ok(escapeSqlMysql(text));
      case 'csv':
        return ok(escapeCsv(text));
      case 'json':
        return ok(escapeJson(text));
    }
  }
  switch (language) {
    case 'shell':
      return unescapeShell(text);
    case 'regex':
      return ok(unescapeRegex(text));
    case 'sql':
      return ok(unescapeSql(text));
    case 'sql-mysql':
      return ok(unescapeSqlMysql(text));
    case 'csv':
      return unescapeCsv(text);
    case 'json':
      return unescapeJson(text);
  }
}
