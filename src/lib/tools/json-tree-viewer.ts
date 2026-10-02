export type JsonNodeKind =
  'object' | 'array' | 'string' | 'number' | 'boolean' | 'null';

export type JsonPathSegment = string | number;
export type JsonPathStyle = 'jsonpath' | 'pointer' | 'javascript';

export type JsonTreeParseResult =
  | { success: true; value: unknown }
  | { success: false; reason: 'empty' | 'invalid-json' };

export interface JsonTreeEntry {
  key: JsonPathSegment;
  value: unknown;
}

export interface JsonTreeMatch {
  path: JsonPathSegment[];
  /** キーが一致したか */
  keyMatched: boolean;
  /** 値（プリミティブ）が一致したか */
  valueMatched: boolean;
}

export interface JsonTreeSearchResult {
  matches: JsonTreeMatch[];
  /** 上限を超えて打ち切ったか */
  truncated: boolean;
}

export function parseJsonTree(input: string): JsonTreeParseResult {
  if (input.trim() === '') return { success: false, reason: 'empty' };
  try {
    return { success: true, value: JSON.parse(input) };
  } catch {
    return { success: false, reason: 'invalid-json' };
  }
}

export function getKind(value: unknown): JsonNodeKind {
  if (value === null) return 'null';
  if (Array.isArray(value)) return 'array';
  switch (typeof value) {
    case 'string':
      return 'string';
    case 'number':
      return 'number';
    case 'boolean':
      return 'boolean';
  }
  return 'object';
}

/** オブジェクト・配列の子要素。プリミティブは空 */
export function getEntries(value: unknown): JsonTreeEntry[] {
  if (Array.isArray(value)) {
    return value.map((v, i) => ({ key: i, value: v }));
  }
  if (value !== null && typeof value === 'object') {
    return Object.entries(value).map(([key, v]) => ({ key, value: v }));
  }
  return [];
}

/** 折りたたみ時に表示する要約（オブジェクトは {3}、配列は [5]） */
export function summarize(value: unknown): string {
  const kind = getKind(value);
  if (kind === 'array') return `[${(value as unknown[]).length}]`;
  if (kind === 'object') return `{${Object.keys(value as object).length}}`;
  return '';
}

const IDENTIFIER_PATTERN = /^[A-Za-z_$][A-Za-z0-9_$]*$/;

/** パスを JSONPath / JSON Pointer / JavaScript 式のいずれかの表記にする */
export function formatPath(
  path: JsonPathSegment[],
  style: JsonPathStyle,
): string {
  if (style === 'pointer') {
    return path
      .map((s) => `/${String(s).replace(/~/g, '~0').replace(/\//g, '~1')}`)
      .join('');
  }
  let out = style === 'jsonpath' ? '$' : 'data';
  for (const segment of path) {
    if (typeof segment === 'number') out += `[${segment}]`;
    else if (IDENTIFIER_PATTERN.test(segment)) out += `.${segment}`;
    else out += `[${JSON.stringify(segment)}]`;
  }
  return out;
}

/** プリミティブ値の表示用文字列（JSON表記） */
export function formatPrimitive(value: unknown): string {
  return JSON.stringify(value);
}

/** キー名・プリミティブ値に query（大文字小文字を区別しない部分一致）を含むノードを探す */
export function searchTree(
  root: unknown,
  query: string,
  limit = 200,
): JsonTreeSearchResult {
  const needle = query.toLowerCase();
  const matches: JsonTreeMatch[] = [];
  if (needle === '') return { matches, truncated: false };

  let truncated = false;
  // 深いJSONでもスタックを使い切らないよう、明示的なスタックで走査する
  const stack: { value: unknown; path: JsonPathSegment[] }[] = [
    { value: root, path: [] },
  ];
  while (stack.length > 0) {
    const { value, path } = stack.pop()!;
    const kind = getKind(value);
    const isContainer = kind === 'object' || kind === 'array';
    const key = path.length > 0 ? path[path.length - 1] : undefined;
    const keyMatched =
      typeof key === 'string' && key.toLowerCase().includes(needle);
    const valueMatched =
      !isContainer && String(value).toLowerCase().includes(needle);
    if (keyMatched || valueMatched) {
      if (matches.length >= limit) {
        truncated = true;
        break;
      }
      matches.push({ path, keyMatched, valueMatched });
    }
    const entries = getEntries(value);
    for (let i = entries.length - 1; i >= 0; i--) {
      stack.push({
        value: entries[i].value,
        path: [...path, entries[i].key],
      });
    }
  }
  return { matches, truncated };
}

/** パスをたどって値を取り出す（存在しなければ undefined） */
export function getValueAtPath(
  root: unknown,
  path: JsonPathSegment[],
): unknown {
  let current = root;
  for (const segment of path) {
    if (current === null || typeof current !== 'object') return undefined;
    current = (current as Record<string, unknown>)[segment];
  }
  return current;
}
