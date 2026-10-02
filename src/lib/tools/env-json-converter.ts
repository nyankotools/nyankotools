export interface ConvertSuccess {
  success: true;
  output: string;
}

export interface ConvertFailure {
  success: false;
  message: string;
}

export type ConvertOutcome = ConvertSuccess | ConvertFailure;

export interface EnvConvertOptions {
  indent?: number;
  /** true のとき、数値・真偽値らしい値を JSON の number / boolean に変換する */
  parseValues?: boolean;
}

const KEY_PATTERN = /^[A-Za-z_][A-Za-z0-9_.-]*$/;

function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

function unescapeDoubleQuoted(raw: string): string {
  return raw.replace(/\\(.)/g, (_, c: string) => {
    if (c === 'n') return '\n';
    if (c === 'r') return '\r';
    if (c === 't') return '\t';
    if (c === '\\' || c === '"') return c;
    return '\\' + c; // 未知のエスケープ（C:\Users など）はそのまま残す
  });
}

/** 値部分（`=` の右側）を解釈する。解釈できなければ null。 */
function parseValue(raw: string): string | null {
  const value = raw.trimStart();
  const quote = value[0];
  if (quote === '"' || quote === "'" || quote === '`') {
    let i = 1;
    while (i < value.length) {
      if (quote === '"' && value[i] === '\\') {
        i += 2;
        continue;
      }
      if (value[i] === quote) break;
      i++;
    }
    if (i >= value.length) return null; // 閉じ引用符がない
    const rest = value.slice(i + 1).trim();
    if (rest !== '' && !rest.startsWith('#')) return null;
    const inner = value.slice(1, i);
    return quote === '"' ? unescapeDoubleQuoted(inner) : inner;
  }
  // 引用符なし: 空白＋# 以降はコメント
  const commentAt = raw.search(/(^|\s)#/);
  return (commentAt === -1 ? raw : raw.slice(0, commentAt)).trim();
}

export function parseEnv(
  input: string,
):
  | { ok: true; values: Record<string, string> }
  | { ok: false; message: string } {
  const values: Record<string, string> = Object.create(null);
  const lines = (input.charCodeAt(0) === 0xfeff ? input.slice(1) : input).split(
    /\r\n|\r|\n/,
  );
  for (let index = 0; index < lines.length; index++) {
    const line = lines[index].trim();
    if (line === '' || line.startsWith('#')) continue;
    const match = /^(?:export\s+)?([^=\s]+)\s*=(.*)$/.exec(line);
    if (!match) {
      return { ok: false, message: `${index + 1}: ${lines[index]}` };
    }
    const [, key, rawValue] = match;
    if (!KEY_PATTERN.test(key)) {
      return { ok: false, message: `${index + 1}: ${key}` };
    }
    const startLine = index + 1;
    let raw = rawValue;
    let value = parseValue(raw);
    // 複数行の引用符付き値（"..." が行をまたぐ）
    const opensQuote = /^["'`]/.test(raw.trimStart());
    while (value === null && opensQuote && index + 1 < lines.length) {
      index++;
      raw += '\n' + lines[index];
      value = parseValue(raw);
    }
    if (value === null) {
      return { ok: false, message: `${startLine}: ${key}` };
    }
    values[key] = value;
  }
  return { ok: true, values: { ...values } };
}

function toTyped(value: string): string | number | boolean {
  if (value === 'true') return true;
  if (value === 'false') return false;
  if (/^-?(0|[1-9]\d*)(\.\d+)?$/.test(value)) {
    const n = Number(value);
    if (Number.isSafeInteger(n) || !/^-?\d+$/.test(value)) return n;
  }
  return value;
}

export function envToJson(
  input: string,
  { indent = 2, parseValues = false }: EnvConvertOptions = {},
): ConvertOutcome {
  const result = parseEnv(input);
  if (!result.ok) return { success: false, message: result.message };
  const out = Object.fromEntries(
    Object.entries(result.values).map(([key, value]) => [
      key,
      parseValues ? toTyped(value) : value,
    ]),
  );
  return { success: true, output: JSON.stringify(out, null, indent) };
}

function formatEnvValue(value: string): string {
  if (value === '') return '';
  if (/^[A-Za-z0-9_./:@%+,-]+$/.test(value)) return value;
  const escaped = value
    .replace(/\\/g, '\\\\')
    .replace(/"/g, '\\"')
    .replace(/\n/g, '\\n')
    .replace(/\r/g, '\\r')
    .replace(/\t/g, '\\t');
  return `"${escaped}"`;
}

export function jsonToEnv(input: string): ConvertOutcome {
  try {
    const parsed: unknown = JSON.parse(input);
    if (
      parsed === null ||
      typeof parsed !== 'object' ||
      Array.isArray(parsed)
    ) {
      return { success: false, message: 'JSON must be an object' };
    }
    const lines: string[] = [];
    for (const [key, value] of Object.entries(parsed)) {
      if (!KEY_PATTERN.test(key)) {
        return { success: false, message: `Invalid variable name: ${key}` };
      }
      if (typeof value === 'object' && value !== null) {
        return {
          success: false,
          message: `Nested values (objects/arrays) are not supported: ${key}`,
        };
      }
      lines.push(
        `${key}=${formatEnvValue(value === null ? '' : String(value))}`,
      );
    }
    return { success: true, output: lines.join('\n') };
  } catch (error) {
    return { success: false, message: errorMessage(error) };
  }
}
