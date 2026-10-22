/**
 * クエリ文字列 ⇔ JSON 変換。
 * オブジェクトは Object.create(null) で作るため、__proto__ などのキーでプロトタイプ汚染は起きない。
 */

export type ArrayFormat = 'bracket' | 'index' | 'repeat';
export type EncodeMode = 'brackets' | 'full' | 'none';

export interface QueryToJsonOptions {
  /** 数値・true/false/null を型変換する */
  inferTypes?: boolean;
  /** + を半角スペースとして解釈する */
  plusAsSpace?: boolean;
  /** JSON.stringify のインデント */
  indent?: number | string;
}

export interface JsonToQueryOptions {
  arrayFormat?: ArrayFormat;
  /** brackets: [] はそのまま残して他をエンコード / full: すべてエンコード / none: エンコードしない */
  encode?: EncodeMode;
  /** スペースを + にする（%20 の代わり） */
  spaceAsPlus?: boolean;
  /** 先頭に ? を付ける */
  leadingQuestion?: boolean;
}

export type QueryJsonOutcome =
  | { success: true; output: string }
  | {
      success: false;
      kind: 'parse' | 'not-object' | 'depth';
      message: string;
    };

type Obj = Record<string, unknown>;
type Seg =
  | { type: 'key'; key: string }
  | { type: 'push' }
  | { type: 'index'; index: number };

const MAX_SEGMENTS = 32;
const MAX_INDEX = 1000;
const MAX_JSON_DEPTH = 100;

function newObj(): Obj {
  return Object.create(null) as Obj;
}

/** 入力から、クエリ部分（? の後ろ・# の前）を取り出す */
export function extractQuery(input: string): string {
  let s = input.replace(/[\r\n]+/g, '').trim();
  const hash = s.indexOf('#');
  if (hash >= 0) s = s.slice(0, hash);
  const q = s.indexOf('?');
  // ? より前に = があれば、? は値の一部（裸のクエリ文字列）とみなす
  if (q >= 0 && !s.slice(0, q).includes('=')) return s.slice(q + 1);
  if (/^[a-z][a-z0-9+.-]*:\/\//i.test(s) || s.startsWith('/')) return '';
  return s;
}

function decode(s: string, plusAsSpace: boolean): string {
  const t = plusAsSpace ? s.replace(/\+/g, ' ') : s;
  try {
    return decodeURIComponent(t);
  } catch {
    return t;
  }
}

function parseKey(key: string): Seg[] {
  const m = /^([^[]*)((?:\[[^\]]*\])*)$/.exec(key);
  if (!m) return [{ type: 'key', key }];
  const segs: Seg[] = [{ type: 'key', key: m[1] }];
  for (const part of m[2].matchAll(/\[([^\]]*)\]/g)) {
    const inner = part[1];
    if (inner === '') segs.push({ type: 'push' });
    else if (/^\d+$/.test(inner) && Number(inner) <= MAX_INDEX)
      segs.push({ type: 'index', index: Number(inner) });
    else segs.push({ type: 'key', key: inner });
  }
  if (segs.length > MAX_SEGMENTS) return [{ type: 'key', key }];
  return segs;
}

function toObject(node: unknown): Obj {
  if (Array.isArray(node)) {
    const o = newObj();
    node.forEach((v, i) => {
      if (v !== undefined) o[String(i)] = v;
    });
    return o;
  }
  if (node !== null && typeof node === 'object') return node as Obj;
  return newObj();
}

function assign(node: unknown, segs: Seg[], value: unknown): unknown {
  if (segs.length === 0) {
    if (node === undefined) return value;
    if (Array.isArray(node)) {
      node.push(value);
      return node;
    }
    if (node !== null && typeof node === 'object') return value;
    return [node, value];
  }
  const [seg, ...rest] = segs;
  if (seg.type === 'key') {
    const obj = toObject(node);
    obj[seg.key] = assign(obj[seg.key], rest, value);
    return obj;
  }
  if (node !== null && typeof node === 'object' && !Array.isArray(node)) {
    const obj = node as Obj;
    const k =
      seg.type === 'push' ? String(Object.keys(obj).length) : String(seg.index);
    obj[k] = assign(obj[k], rest, value);
    return obj;
  }
  const arr: unknown[] = Array.isArray(node)
    ? node
    : node === undefined || node === null
      ? []
      : [node];
  if (seg.type === 'push') {
    arr.push(assign(undefined, rest, value));
  } else {
    arr[seg.index] = assign(arr[seg.index], rest, value);
  }
  return arr;
}

function infer(value: string): unknown {
  if (value === 'true') return true;
  if (value === 'false') return false;
  if (value === 'null') return null;
  if (/^-?(0|[1-9]\d*)(\.\d+)?$/.test(value)) {
    const n = Number(value);
    if (Number.isFinite(n) && String(n) === value) return n;
  }
  return value;
}

/** クエリ文字列を、型付きのオブジェクトに変換する（null プロトタイプ） */
export function parseQueryToObject(
  input: string,
  options: QueryToJsonOptions = {},
): Obj {
  const { inferTypes = false, plusAsSpace = true } = options;
  const root = newObj();
  for (const pair of extractQuery(input).split('&')) {
    if (pair === '') continue;
    const eq = pair.indexOf('=');
    const rawKey = eq < 0 ? pair : pair.slice(0, eq);
    const key = decode(rawKey, plusAsSpace);
    let value: unknown = eq < 0 ? '' : decode(pair.slice(eq + 1), plusAsSpace);
    if (inferTypes) value = eq < 0 ? null : infer(value as string);
    const segs = parseKey(key);
    const first = segs[0] as { type: 'key'; key: string };
    root[first.key] = assign(root[first.key], segs.slice(1), value);
  }
  return root;
}

export function queryToJson(
  input: string,
  options: QueryToJsonOptions = {},
): QueryJsonOutcome {
  const obj = parseQueryToObject(input, options);
  return {
    success: true,
    output: JSON.stringify(obj, null, options.indent ?? 2),
  };
}

function isPrimitive(v: unknown): boolean {
  return v === null || typeof v !== 'object';
}

function depthOf(v: unknown, d = 0): number {
  if (d > MAX_JSON_DEPTH) return d;
  if (v === null || typeof v !== 'object') return d;
  let max = d;
  const children = Array.isArray(v) ? v : Object.values(v as Obj);
  for (const c of children) max = Math.max(max, depthOf(c, d + 1));
  return max;
}

function scalarText(v: unknown): string | null {
  if (v === null) return null;
  return String(v);
}

export function jsonToQuery(
  input: string,
  options: JsonToQueryOptions = {},
): QueryJsonOutcome {
  const {
    arrayFormat = 'bracket',
    encode = 'brackets',
    spaceAsPlus = false,
    leadingQuestion = false,
  } = options;
  let data: unknown;
  try {
    data = JSON.parse(input);
  } catch (e) {
    return {
      success: false,
      kind: 'parse',
      message: e instanceof Error ? e.message : String(e),
    };
  }
  if (data === null || typeof data !== 'object' || Array.isArray(data)) {
    return { success: false, kind: 'not-object', message: '' };
  }
  if (depthOf(data) > MAX_JSON_DEPTH) {
    return { success: false, kind: 'depth', message: '' };
  }

  const enc = (s: string, isKey: boolean): string => {
    if (encode === 'none') return s;
    let r = encodeURIComponent(s);
    if (isKey && encode === 'brackets') {
      r = r.replace(/%5B/gi, '[').replace(/%5D/gi, ']');
    }
    if (spaceAsPlus) r = r.replace(/%20/g, '+');
    return r;
  };
  const pairs: string[] = [];
  const emit = (key: string, value: unknown) => {
    const text = scalarText(value);
    pairs.push(
      text === null ? enc(key, true) : `${enc(key, true)}=${enc(text, false)}`,
    );
  };

  const walk = (prefix: string, value: unknown) => {
    if (Array.isArray(value)) {
      const allPrimitive = value.every(isPrimitive);
      value.forEach((item, i) => {
        if (allPrimitive && arrayFormat === 'repeat') emit(prefix, item);
        else if (allPrimitive && arrayFormat === 'bracket')
          emit(`${prefix}[]`, item);
        else walk(`${prefix}[${i}]`, item);
      });
    } else if (value !== null && typeof value === 'object') {
      for (const [k, v] of Object.entries(value as Obj)) {
        walk(`${prefix}[${k}]`, v);
      }
    } else {
      emit(prefix, value);
    }
  };

  for (const [k, v] of Object.entries(data as Obj)) {
    if (Array.isArray(v) || (v !== null && typeof v === 'object')) walk(k, v);
    else emit(k, v);
  }
  const body = pairs.join('&');
  return {
    success: true,
    output: leadingQuestion && body ? `?${body}` : body,
  };
}
