/**
 * JSON キーソート・フラット化（flatten）・復元（unflatten）。
 *
 * JSON.parse を経由すると「整数風のキーが先頭に並び替わる」「巨大整数が丸められる」ため、
 * 自前の軽量ツリー（キー順と数値表記をそのまま保持）で処理する。
 * オブジェクトは Map で保持するので `__proto__` などのキーでもプロトタイプ汚染は起きない。
 */

export type SortOrder = 'asc' | 'desc';

type LitNode = { t: 'lit'; text: string };
type ObjNode = { t: 'obj'; entries: Map<string, Node> };
type ArrNode = { t: 'arr'; items: Node[] };
type Node = LitNode | ObjNode | ArrNode;

export type JsonToolErrorKind =
  | 'parse'
  | 'depth'
  | 'not-object'
  | 'invalid-path'
  | 'conflict'
  | 'index-too-large';

export interface JsonToolFailure {
  success: false;
  kind: JsonToolErrorKind;
  /** parse のときは JSON.parse のエラーメッセージ */
  message: string;
  /** invalid-path / conflict / index-too-large のときの対象キー */
  path?: string;
}

export interface JsonToolSuccess {
  success: true;
  output: string;
}

export type JsonToolOutcome = JsonToolSuccess | JsonToolFailure;

/** unflatten で許可する配列インデックスの上限（メモリ保護） */
export const MAX_ARRAY_INDEX = 100000;

const NULL_NODE: LitNode = { t: 'lit', text: 'null' };

// ---------- パーサ（入力は JSON.parse で検証済みである前提） ----------

const LITERAL_RE = /-?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?|true|false|null/y;

function parseTree(src: string): Node {
  let i = 0;

  const skipWs = () => {
    while (
      src[i] === ' ' ||
      src[i] === '\t' ||
      src[i] === '\n' ||
      src[i] === '\r'
    ) {
      i++;
    }
  };

  const readString = (): string => {
    const start = i;
    i++;
    while (src[i] !== '"') {
      i += src[i] === '\\' ? 2 : 1;
    }
    i++;
    return JSON.parse(src.slice(start, i)) as string;
  };

  const readValue = (): Node => {
    skipWs();
    const c = src[i];
    if (c === '{') {
      i++;
      const entries = new Map<string, Node>();
      skipWs();
      if (src[i] === '}') {
        i++;
        return { t: 'obj', entries };
      }
      for (;;) {
        skipWs();
        const key = readString();
        skipWs();
        i++; // ':'
        entries.set(key, readValue());
        skipWs();
        if (src[i] === ',') {
          i++;
          continue;
        }
        i++; // '}'
        return { t: 'obj', entries };
      }
    }
    if (c === '[') {
      i++;
      const items: Node[] = [];
      skipWs();
      if (src[i] === ']') {
        i++;
        return { t: 'arr', items };
      }
      for (;;) {
        items.push(readValue());
        skipWs();
        if (src[i] === ',') {
          i++;
          continue;
        }
        i++; // ']'
        return { t: 'arr', items };
      }
    }
    if (c === '"') {
      return { t: 'lit', text: JSON.stringify(readString()) };
    }
    LITERAL_RE.lastIndex = i;
    const m = LITERAL_RE.exec(src);
    const text = m ? m[0] : 'null';
    i += text.length;
    return { t: 'lit', text };
  };

  return readValue();
}

function parseInput(
  input: string,
): { ok: true; node: Node } | { ok: false; failure: JsonToolFailure } {
  try {
    JSON.parse(input);
  } catch (error) {
    return {
      ok: false,
      failure: {
        success: false,
        kind: 'parse',
        message: error instanceof Error ? error.message : String(error),
      },
    };
  }
  try {
    return { ok: true, node: parseTree(input) };
  } catch (error) {
    if (error instanceof RangeError) {
      return {
        ok: false,
        failure: { success: false, kind: 'depth', message: '' },
      };
    }
    throw error;
  }
}

// ---------- シリアライザ ----------

/** number は半角スペース数、文字列はそのままインデント文字。0 / 空文字は1行（圧縮） */
export function resolveIndent(indent: number | string): string {
  if (typeof indent === 'number') {
    return ' '.repeat(Math.max(0, Math.min(10, Math.floor(indent))));
  }
  return indent.slice(0, 10);
}

function serialize(node: Node, indent: string, depth = 0): string {
  if (node.t === 'lit') return node.text;
  const pretty = indent !== '';
  const pad = (n: number) => '\n' + indent.repeat(n);
  if (node.t === 'arr') {
    if (node.items.length === 0) return '[]';
    const body = node.items.map(
      (v) => (pretty ? pad(depth + 1) : '') + serialize(v, indent, depth + 1),
    );
    return '[' + body.join(',') + (pretty ? pad(depth) : '') + ']';
  }
  if (node.entries.size === 0) return '{}';
  const body: string[] = [];
  for (const [k, v] of node.entries) {
    body.push(
      (pretty ? pad(depth + 1) : '') +
        JSON.stringify(k) +
        (pretty ? ': ' : ':') +
        serialize(v, indent, depth + 1),
    );
  }
  return '{' + body.join(',') + (pretty ? pad(depth) : '') + '}';
}

function finish(node: Node, indent: number | string): JsonToolOutcome {
  try {
    return { success: true, output: serialize(node, resolveIndent(indent)) };
  } catch (error) {
    if (error instanceof RangeError) {
      return { success: false, kind: 'depth', message: '' };
    }
    throw error;
  }
}

// ---------- キーソート ----------

function compareKeys(a: string, b: string): number {
  return a < b ? -1 : a > b ? 1 : 0;
}

function sortNode(node: Node, order: SortOrder, recursive: boolean): Node {
  if (node.t === 'lit') return node;
  if (node.t === 'arr') {
    return recursive
      ? {
          t: 'arr',
          items: node.items.map((v) => sortNode(v, order, recursive)),
        }
      : node;
  }
  const keys = [...node.entries.keys()].sort(compareKeys);
  if (order === 'desc') keys.reverse();
  const entries = new Map<string, Node>();
  for (const k of keys) {
    const v = node.entries.get(k)!;
    entries.set(k, recursive ? sortNode(v, order, recursive) : v);
  }
  return { t: 'obj', entries };
}

export interface SortOptions {
  order?: SortOrder;
  recursive?: boolean;
  indent?: number | string;
}

/** キーを辞書順（UTF-16コード単位）に並べ替える。配列の要素順は常に保持する。 */
export function sortJsonKeys(
  input: string,
  options: SortOptions = {},
): JsonToolOutcome {
  const { order = 'asc', recursive = true, indent = 2 } = options;
  const parsed = parseInput(input);
  if (!parsed.ok) return parsed.failure;
  try {
    return finish(sortNode(parsed.node, order, recursive), indent);
  } catch (error) {
    if (error instanceof RangeError) {
      return { success: false, kind: 'depth', message: '' };
    }
    throw error;
  }
}

// ---------- フラット化 ----------

/** そのままドット記法で書けるキーか（空・数字のみ・記号/空白を含むものは [""] 形式にする） */
function isPlainKey(key: string): boolean {
  return /^[^.[\]"\\\s]+$/u.test(key) && !/^\d+$/.test(key);
}

function appendKey(path: string, key: string): string {
  if (isPlainKey(key)) return path === '' ? key : `${path}.${key}`;
  return `${path}[${JSON.stringify(key)}]`;
}

function collectLeaves(node: Node, path: string, out: Map<string, Node>): void {
  if (node.t === 'obj' && node.entries.size > 0) {
    for (const [k, v] of node.entries)
      collectLeaves(v, appendKey(path, k), out);
    return;
  }
  if (node.t === 'arr' && node.items.length > 0) {
    node.items.forEach((v, i) => collectLeaves(v, `${path}[${i}]`, out));
    return;
  }
  out.set(path, node);
}

/**
 * ネストを `a.b[0]` 形式のパスをキーにした1階層のオブジェクトへ変換する。
 * 空配列・空オブジェクトは値としてそのまま残す。ルートがスカラー/空コンテナの場合は変換せず返す。
 */
export function flattenJson(
  input: string,
  options: { indent?: number | string } = {},
): JsonToolOutcome {
  const { indent = 2 } = options;
  const parsed = parseInput(input);
  if (!parsed.ok) return parsed.failure;
  const root = parsed.node;
  try {
    const leaves = new Map<string, Node>();
    collectLeaves(root, '', leaves);
    if (leaves.size === 1 && leaves.has('')) return finish(root, indent);
    return finish({ t: 'obj', entries: leaves }, indent);
  } catch (error) {
    if (error instanceof RangeError) {
      return { success: false, kind: 'depth', message: '' };
    }
    throw error;
  }
}

// ---------- 復元 ----------

export type PathToken = string | number;

/** パス文字列をトークン列へ。不正なら null。数字は配列インデックス、文字列はオブジェクトキー。 */
export function parsePath(path: string): PathToken[] | null {
  if (path === '') return null;
  const tokens: PathToken[] = [];
  let i = 0;
  let first = true;
  while (i < path.length) {
    const c = path[i];
    if (c === '[') {
      if (path[i + 1] === '"') {
        let j = i + 2;
        while (j < path.length && path[j] !== '"') {
          j += path[j] === '\\' ? 2 : 1;
        }
        if (j >= path.length || path[j + 1] !== ']') return null;
        try {
          tokens.push(JSON.parse(path.slice(i + 1, j + 1)) as string);
        } catch {
          return null;
        }
        i = j + 2;
      } else {
        const close = path.indexOf(']', i);
        if (close < 0) return null;
        const digits = path.slice(i + 1, close);
        if (!/^\d+$/.test(digits)) return null;
        tokens.push(Number(digits));
        i = close + 1;
      }
    } else {
      if (c === '.') {
        if (first) return null;
        i++;
      } else if (!first) {
        return null; // `a[0]b` のようにセパレータ無しで続く形は不正
      }
      let j = i;
      while (j < path.length && path[j] !== '.' && path[j] !== '[') j++;
      const key = path.slice(i, j);
      if (key === '' || key.includes(']')) return null;
      tokens.push(key);
      i = j;
    }
    first = false;
  }
  return tokens.length > 0 ? tokens : null;
}

function createContainer(token: PathToken): ObjNode | ArrNode {
  return typeof token === 'number'
    ? { t: 'arr', items: [] }
    : { t: 'obj', entries: new Map() };
}

function getChild(
  parent: ObjNode | ArrNode,
  token: PathToken,
): Node | undefined {
  return parent.t === 'arr'
    ? parent.items[token as number]
    : parent.entries.get(token as string);
}

function setChild(
  parent: ObjNode | ArrNode,
  token: PathToken,
  value: Node,
): void {
  if (parent.t === 'arr') parent.items[token as number] = value;
  else parent.entries.set(token as string, value);
}

function fillHoles(node: Node): Node {
  if (node.t === 'lit') return node;
  if (node.t === 'obj') {
    for (const [k, v] of node.entries) node.entries.set(k, fillHoles(v));
    return node;
  }
  const items: Node[] = [];
  for (let i = 0; i < node.items.length; i++) {
    items.push(fillHoles(node.items[i] ?? NULL_NODE));
  }
  return { t: 'arr', items };
}

/** フラット化されたオブジェクト（`a.b[0]` 形式のキー）を元のネスト構造へ戻す。 */
export function unflattenJson(
  input: string,
  options: { indent?: number | string } = {},
): JsonToolOutcome {
  const { indent = 2 } = options;
  const parsed = parseInput(input);
  if (!parsed.ok) return parsed.failure;
  const flat = parsed.node;
  if (flat.t !== 'obj') {
    return { success: false, kind: 'not-object', message: '' };
  }
  if (flat.entries.size === 0) return finish(flat, indent);

  let root: ObjNode | ArrNode | undefined;
  // 穴埋め(null)で生成される要素数の上限。インデックスの総和で見積もる
  let indexBudget = MAX_ARRAY_INDEX * 10;
  for (const [key, value] of flat.entries) {
    const tokens = parsePath(key);
    if (!tokens) {
      return { success: false, kind: 'invalid-path', message: '', path: key };
    }
    for (const tok of tokens) {
      if (typeof tok === 'number') indexBudget -= tok;
      if (
        typeof tok === 'number' &&
        (tok > MAX_ARRAY_INDEX || indexBudget < 0)
      ) {
        return {
          success: false,
          kind: 'index-too-large',
          message: '',
          path: key,
        };
      }
    }
    const conflict: JsonToolFailure = {
      success: false,
      kind: 'conflict',
      message: '',
      path: key,
    };
    const rootKind = typeof tokens[0] === 'number' ? 'arr' : 'obj';
    if (!root) root = createContainer(tokens[0]);
    else if (root.t !== rootKind) return conflict;

    let cur: ObjNode | ArrNode = root;
    for (let j = 0; j < tokens.length; j++) {
      const tok = tokens[j];
      const existing = getChild(cur, tok);
      if (j === tokens.length - 1) {
        if (existing !== undefined) return conflict;
        setChild(cur, tok, value);
        break;
      }
      const nextKind = typeof tokens[j + 1] === 'number' ? 'arr' : 'obj';
      if (existing === undefined) {
        const created = createContainer(tokens[j + 1]);
        setChild(cur, tok, created);
        cur = created;
      } else if (existing.t === nextKind) {
        cur = existing;
      } else {
        return conflict;
      }
    }
  }
  return finish(fillHoles(root!), indent);
}
