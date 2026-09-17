import { JSONPath } from 'jsonpath-plus';

export interface JsonParseResult {
  success: boolean;
  value?: unknown;
  error?: string;
}

export function parseJsonInput(input: string): JsonParseResult {
  try {
    return { success: true, value: JSON.parse(input) };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

export interface JsonPathMatch {
  path: string;
  pointer: string;
  value: unknown;
}

export interface JsonPathEvalResult {
  success: boolean;
  error: string | null;
  matches: JsonPathMatch[];
}

export function evaluateJsonPath(
  json: unknown,
  path: string,
): JsonPathEvalResult {
  if (path.trim() === '') {
    return { success: true, error: null, matches: [] };
  }

  try {
    const rawResults = JSONPath({
      path,
      json: json as null | boolean | number | string | object | unknown[],
      resultType: 'all',
      wrap: true,
    }) as Array<{ path: string; pointer: string; value: unknown }> | undefined;

    // jsonpath-plus returns `undefined` (instead of `[]`) whenever the root
    // JSON value itself is falsy (null/false/0/""), regardless of the query.
    // Handle the common "$" (root itself) case explicitly; any other query
    // genuinely has no match against a non-object/array root.
    const results = Array.isArray(rawResults)
      ? rawResults
      : path.trim() === '$'
        ? [{ path: '$', pointer: '', value: json }]
        : [];

    return {
      success: true,
      error: null,
      matches: results.map((r) => ({
        path: r.path,
        pointer: r.pointer,
        value: r.value,
      })),
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error),
      matches: [],
    };
  }
}

export interface JsonPointerSuccess {
  success: true;
  value: unknown;
}

export type JsonPointerFailure =
  | { success: false; reason: 'invalid-format' }
  | { success: false; reason: 'trailing-dash'; path: string }
  | {
      success: false;
      reason: 'invalid-array-index';
      path: string;
      token: string;
    }
  | {
      success: false;
      reason: 'index-out-of-range';
      path: string;
      index: number;
      length: number;
    }
  | { success: false; reason: 'key-not-found'; path: string; key: string }
  | { success: false; reason: 'not-traversable'; path: string };

export type JsonPointerEvalResult = JsonPointerSuccess | JsonPointerFailure;

/**
 * RFC 6901 (JSON Pointer) に従ってトークンをパースし、対象の値をたどって取得する。
 * 先頭の "#" は URI フラグメント識別子表記（`$ref: "#/foo/bar"` 等）として読み飛ばす。
 */
export function evaluateJsonPointer(
  json: unknown,
  pointerInput: string,
): JsonPointerEvalResult {
  const pointer = pointerInput.startsWith('#')
    ? pointerInput.slice(1)
    : pointerInput;

  if (pointer === '') {
    return { success: true, value: json };
  }
  if (!pointer.startsWith('/')) {
    return { success: false, reason: 'invalid-format' };
  }

  const tokens = pointer
    .split('/')
    .slice(1)
    .map((token) => token.replace(/~1/g, '/').replace(/~0/g, '~'));

  let current: unknown = json;
  let currentPath = '';
  for (const token of tokens) {
    currentPath += `/${token}`;
    if (Array.isArray(current)) {
      if (token === '-') {
        return { success: false, reason: 'trailing-dash', path: currentPath };
      }
      if (!/^(0|[1-9]\d*)$/.test(token)) {
        return {
          success: false,
          reason: 'invalid-array-index',
          path: currentPath,
          token,
        };
      }
      const index = Number(token);
      if (index >= current.length) {
        return {
          success: false,
          reason: 'index-out-of-range',
          path: currentPath,
          index,
          length: current.length,
        };
      }
      current = current[index];
    } else if (current !== null && typeof current === 'object') {
      if (!Object.prototype.hasOwnProperty.call(current, token)) {
        return {
          success: false,
          reason: 'key-not-found',
          path: currentPath,
          key: token,
        };
      }
      current = (current as Record<string, unknown>)[token];
    } else {
      return { success: false, reason: 'not-traversable', path: currentPath };
    }
  }

  return { success: true, value: current };
}
