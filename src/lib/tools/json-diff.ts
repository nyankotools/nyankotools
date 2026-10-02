export type JsonDiffType = 'added' | 'removed' | 'changed';

export interface JsonDiffEntry {
  type: JsonDiffType;
  /** `$.users[0].name` 形式のパス */
  path: string;
  /** 左側の値（JSON文字列）。added では null */
  left: string | null;
  /** 右側の値（JSON文字列）。removed では null */
  right: string | null;
}

export interface JsonDiffOptions {
  /** 配列の要素の並びを無視して、同じ値どうしを対応づける */
  ignoreArrayOrder?: boolean;
}

export interface JsonDiffStats {
  added: number;
  removed: number;
  changed: number;
}

export type JsonDiffResult =
  | { success: true; entries: JsonDiffEntry[]; stats: JsonDiffStats }
  | {
      success: false;
      reason: 'empty' | 'invalid-json' | 'too-deep';
      /** 失敗した側（empty のときは最初に空だった側） */
      side: 'left' | 'right';
    };

const IDENTIFIER_PATTERN = /^[A-Za-z_$][A-Za-z0-9_$]*$/;

function childPath(path: string, key: string): string {
  return IDENTIFIER_PATTERN.test(key)
    ? `${path}.${key}`
    : `${path}[${JSON.stringify(key)}]`;
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

/** キーの順序に依存しない、値の比較用の文字列 */
function canonical(value: unknown): string {
  if (Array.isArray(value)) return `[${value.map(canonical).join(',')}]`;
  if (isPlainObject(value)) {
    const keys = Object.keys(value).sort();
    return `{${keys
      .map((k) => `${JSON.stringify(k)}:${canonical(value[k])}`)
      .join(',')}}`;
  }
  return JSON.stringify(value);
}

function diffArraysUnordered(
  a: unknown[],
  b: unknown[],
  path: string,
  out: JsonDiffEntry[],
): void {
  const remaining = new Map<string, number>();
  for (const item of b) {
    const key = canonical(item);
    remaining.set(key, (remaining.get(key) ?? 0) + 1);
  }
  const unmatchedLeft: number[] = [];
  a.forEach((item, i) => {
    const key = canonical(item);
    const count = remaining.get(key) ?? 0;
    if (count > 0) remaining.set(key, count - 1);
    else unmatchedLeft.push(i);
  });
  // 右側に残った要素（対応づけられなかったもの）を、元の順序のまま列挙する
  const unmatchedRight: number[] = [];
  b.forEach((item, j) => {
    const key = canonical(item);
    const count = remaining.get(key) ?? 0;
    if (count > 0) {
      remaining.set(key, count - 1);
      unmatchedRight.push(j);
    }
  });
  for (const i of unmatchedLeft) {
    out.push({
      type: 'removed',
      path: `${path}[${i}]`,
      left: JSON.stringify(a[i]),
      right: null,
    });
  }
  for (const j of unmatchedRight) {
    out.push({
      type: 'added',
      path: `${path}[${j}]`,
      left: null,
      right: JSON.stringify(b[j]),
    });
  }
}

function walk(
  a: unknown,
  b: unknown,
  path: string,
  options: JsonDiffOptions,
  out: JsonDiffEntry[],
): void {
  if (Array.isArray(a) && Array.isArray(b)) {
    if (options.ignoreArrayOrder) {
      diffArraysUnordered(a, b, path, out);
      return;
    }
    const common = Math.min(a.length, b.length);
    for (let i = 0; i < common; i++) {
      walk(a[i], b[i], `${path}[${i}]`, options, out);
    }
    for (let i = common; i < a.length; i++) {
      out.push({
        type: 'removed',
        path: `${path}[${i}]`,
        left: JSON.stringify(a[i]),
        right: null,
      });
    }
    for (let i = common; i < b.length; i++) {
      out.push({
        type: 'added',
        path: `${path}[${i}]`,
        left: null,
        right: JSON.stringify(b[i]),
      });
    }
    return;
  }
  if (isPlainObject(a) && isPlainObject(b)) {
    for (const key of Object.keys(a)) {
      const here = childPath(path, key);
      if (Object.hasOwn(b, key)) {
        walk(a[key], b[key], here, options, out);
      } else {
        out.push({
          type: 'removed',
          path: here,
          left: JSON.stringify(a[key]),
          right: null,
        });
      }
    }
    for (const key of Object.keys(b)) {
      if (!Object.hasOwn(a, key)) {
        out.push({
          type: 'added',
          path: childPath(path, key),
          left: null,
          right: JSON.stringify(b[key]),
        });
      }
    }
    return;
  }
  // どちらかがプリミティブ、または型（配列/オブジェクト/値）が異なる
  if (canonical(a) !== canonical(b)) {
    out.push({
      type: 'changed',
      path,
      left: JSON.stringify(a),
      right: JSON.stringify(b),
    });
  }
}

/** パース済みの2つのJSON値を構造的に比較する（キーの順序は無視する） */
export function diffJsonValues(
  left: unknown,
  right: unknown,
  options: JsonDiffOptions = {},
): { entries: JsonDiffEntry[]; stats: JsonDiffStats } {
  const entries: JsonDiffEntry[] = [];
  walk(left, right, '$', options, entries);
  const stats: JsonDiffStats = { added: 0, removed: 0, changed: 0 };
  for (const entry of entries) stats[entry.type]++;
  return { entries, stats };
}

/** 2つのJSON文字列を構造的に比較する */
export function diffJson(
  leftText: string,
  rightText: string,
  options: JsonDiffOptions = {},
): JsonDiffResult {
  const sides = [
    ['left', leftText],
    ['right', rightText],
  ] as const;
  for (const [side, text] of sides) {
    if (text.trim() === '') return { success: false, reason: 'empty', side };
  }
  const parsed: unknown[] = [];
  for (const [side, text] of sides) {
    try {
      parsed.push(JSON.parse(text));
    } catch {
      return { success: false, reason: 'invalid-json', side };
    }
  }
  try {
    return { success: true, ...diffJsonValues(parsed[0], parsed[1], options) };
  } catch (error) {
    if (error instanceof RangeError) {
      return { success: false, reason: 'too-deep', side: 'left' };
    }
    throw error;
  }
}
