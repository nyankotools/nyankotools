/**
 * fetch() / axios の呼び出しコード（JavaScript）を curl コマンドに変換する。
 *
 * コードは eval / Function で評価せず、自前の字句解析・構文解析だけで
 * リテラル（文字列・数値・オブジェクト・配列・テンプレート）と
 * 同じコード内の const / let / var の値だけを読み取る。
 */

/** 変換時の警告。文言は呼び出し側（UI）で辞書から引く */
export type FetchToCurlWarning =
  | { code: 'unsupported-option'; option: string }
  | { code: 'unresolved'; expr: string }
  | { code: 'multiple-requests'; count: number }
  | { code: 'body-not-allowed'; method: string }
  | { code: 'credentials' }
  | { code: 'body-object' }
  | { code: 'relative-url'; url: string }
  | { code: 'file-reference'; name: string };

export interface CurlRequest {
  url: string;
  method: string;
  /** 同名ヘッダ（大文字小文字無視）は後勝ち。順序は最初の出現順 */
  headers: [string, string][];
  body: string | null;
  /** マルチパート。name / value / ファイル参照かどうか */
  form: [string, string, boolean][] | null;
  basicAuth: { username: string; password: string } | null;
  followRedirects: boolean;
  timeoutSeconds: number | null;
  referer: string | null;
}

export type FetchToCurlFailureReason =
  'empty' | 'syntax-error' | 'no-request' | 'no-url';

export type FetchToCurlResult =
  | { success: true; command: string; warnings: FetchToCurlWarning[] }
  | { success: false; reason: FetchToCurlFailureReason };

export interface FetchToCurlOptions {
  /** 1オプション1行（行末 `\` 区切り）で出力する */
  multiline: boolean;
}

// ---------------------------------------------------------------------------
// 字句解析
// ---------------------------------------------------------------------------

class SyntaxFail extends Error {}

type TokenType = 'str' | 'num' | 'id' | 'tpl' | 'punct' | 'eof';

interface Token {
  type: TokenType;
  value: string;
  start: number;
  end: number;
  cooked?: string[];
  exprs?: string[];
}

const MULTI_PUNCTS = [
  '>>>',
  '...',
  '===',
  '!==',
  '**=',
  '<<=',
  '>>=',
  '&&=',
  '||=',
  '??=',
  '=>',
  '?.',
  '??',
  '&&',
  '||',
  '==',
  '!=',
  '<=',
  '>=',
  '++',
  '--',
  '**',
  '+=',
  '-=',
  '*=',
  '/=',
  '%=',
  '<<',
  '>>',
];
const SINGLE_PUNCTS = '(){}[],:;.?+-*/%<>=!&|^~@#';

function decodeEscape(src: string, i: number): [string, number] {
  if (i >= src.length) throw new SyntaxFail();
  const c = src[i];
  switch (c) {
    case 'n':
      return ['\n', i + 1];
    case 'r':
      return ['\r', i + 1];
    case 't':
      return ['\t', i + 1];
    case 'b':
      return ['\b', i + 1];
    case 'f':
      return ['\f', i + 1];
    case 'v':
      return ['\v', i + 1];
    case '0':
      return ['\0', i + 1];
    case 'x': {
      const m = /^[0-9a-fA-F]{2}/.exec(src.slice(i + 1, i + 3));
      if (!m) throw new SyntaxFail();
      return [String.fromCharCode(parseInt(m[0], 16)), i + 3];
    }
    case 'u': {
      if (src[i + 1] === '{') {
        const close = src.indexOf('}', i + 2);
        const hex = close === -1 ? '' : src.slice(i + 2, close);
        if (!/^[0-9a-fA-F]{1,6}$/.test(hex)) throw new SyntaxFail();
        const code = parseInt(hex, 16);
        if (code > 0x10ffff) throw new SyntaxFail();
        return [String.fromCodePoint(code), close + 1];
      }
      const m = /^[0-9a-fA-F]{4}/.exec(src.slice(i + 1, i + 5));
      if (!m) throw new SyntaxFail();
      return [String.fromCharCode(parseInt(m[0], 16)), i + 5];
    }
    case '\r':
      return ['', src[i + 1] === '\n' ? i + 2 : i + 1];
    case '\n':
      return ['', i + 1];
    default:
      return [c, i + 1];
  }
}

/** 引用符で始まる文字列リテラルの終端の次の位置を返す（中身は解釈しない） */
function skipString(src: string, i: number): number {
  const quote = src[i];
  let j = i + 1;
  while (j < src.length) {
    const c = src[j];
    if (c === '\\') j += 2;
    else if (c === quote) return j + 1;
    else if (c === '\n') throw new SyntaxFail();
    else j++;
  }
  throw new SyntaxFail();
}

/** バッククォートの直後（i）から、テンプレートリテラルを読む */
function scanTemplate(
  src: string,
  i: number,
): { end: number; cooked: string[]; exprs: string[] } {
  const cooked = [''];
  const exprs: string[] = [];
  while (true) {
    if (i >= src.length) throw new SyntaxFail();
    const c = src[i];
    if (c === '`') return { end: i + 1, cooked, exprs };
    if (c === '\\') {
      const [text, next] = decodeEscape(src, i + 1);
      cooked[cooked.length - 1] += text;
      i = next;
      continue;
    }
    if (c === '$' && src[i + 1] === '{') {
      const start = i + 2;
      let depth = 1;
      let j = start;
      while (j < src.length) {
        const d = src[j];
        if (d === '{') depth++;
        else if (d === '}') {
          depth--;
          if (depth === 0) break;
        } else if (d === '"' || d === "'") j = skipString(src, j) - 1;
        else if (d === '`') j = scanTemplate(src, j + 1).end - 1;
        j++;
      }
      if (depth !== 0) throw new SyntaxFail();
      exprs.push(src.slice(start, j));
      cooked.push('');
      i = j + 1;
      continue;
    }
    cooked[cooked.length - 1] += c;
    i++;
  }
}

const ID_START = /[\p{L}_$]/u;
const ID_PART = /[\p{L}\p{N}_$]/u;
const NUMBER_RE =
  /^(?:0[xX][0-9a-fA-F_]+|0[bB][01_]+|0[oO][0-7_]+|(?:\d[\d_]*\.?[\d_]*|\.\d[\d_]*)(?:[eE][+-]?\d+)?)n?/;

function lex(src: string): Token[] {
  const tokens: Token[] = [];
  let i = 0;
  const n = src.length;
  while (i < n) {
    const c = src[i];
    if (/\s/.test(c) || c === '﻿') {
      i++;
      continue;
    }
    if (c === '/' && src[i + 1] === '/') {
      while (i < n && src[i] !== '\n') i++;
      continue;
    }
    if (c === '/' && src[i + 1] === '*') {
      const end = src.indexOf('*/', i + 2);
      if (end === -1) throw new SyntaxFail();
      i = end + 2;
      continue;
    }
    if (c === '"' || c === "'") {
      let j = i + 1;
      let value = '';
      let closed = false;
      while (j < n) {
        const d = src[j];
        if (d === c) {
          closed = true;
          j++;
          break;
        }
        if (d === '\n') throw new SyntaxFail();
        if (d === '\\') {
          const [text, next] = decodeEscape(src, j + 1);
          value += text;
          j = next;
          continue;
        }
        value += d;
        j++;
      }
      if (!closed) throw new SyntaxFail();
      tokens.push({ type: 'str', value, start: i, end: j });
      i = j;
      continue;
    }
    if (c === '`') {
      const { end, cooked, exprs } = scanTemplate(src, i + 1);
      tokens.push({
        type: 'tpl',
        value: '',
        start: i,
        end,
        cooked,
        exprs,
      });
      i = end;
      continue;
    }
    if (/\d/.test(c) || (c === '.' && /\d/.test(src[i + 1] ?? ''))) {
      const m = NUMBER_RE.exec(src.slice(i));
      if (!m) throw new SyntaxFail();
      const text = m[0].replace(/_/g, '').replace(/n$/, '');
      const value = Number(text);
      tokens.push({
        type: 'num',
        value: String(Number.isNaN(value) ? 0 : value),
        start: i,
        end: i + m[0].length,
      });
      i += m[0].length;
      continue;
    }
    if (ID_START.test(c)) {
      let j = i + 1;
      while (j < n && ID_PART.test(src[j])) j++;
      tokens.push({ type: 'id', value: src.slice(i, j), start: i, end: j });
      i = j;
      continue;
    }
    const multi = MULTI_PUNCTS.find((p) => src.startsWith(p, i));
    if (multi) {
      tokens.push({
        type: 'punct',
        value: multi,
        start: i,
        end: i + multi.length,
      });
      i += multi.length;
      continue;
    }
    if (SINGLE_PUNCTS.includes(c)) {
      tokens.push({ type: 'punct', value: c, start: i, end: i + 1 });
      i++;
      continue;
    }
    throw new SyntaxFail();
  }
  tokens.push({ type: 'eof', value: '', start: n, end: n });
  return tokens;
}

// ---------------------------------------------------------------------------
// 構文解析（式の一部だけを木にする。理解できない式は unknown としてソースを保持する）
// ---------------------------------------------------------------------------

type PropNode =
  { key: string | Node; computed: boolean; value: Node } | { spread: Node };

type Node =
  | { t: 'str'; v: string }
  | { t: 'num'; v: number }
  | { t: 'bool'; v: boolean }
  | { t: 'null' }
  | { t: 'undef' }
  | { t: 'tpl'; cooked: string[]; exprs: Node[] }
  | { t: 'id'; name: string }
  | { t: 'member'; obj: Node; prop: string; src: string }
  | { t: 'index'; obj: Node; index: Node; src: string }
  | { t: 'call'; callee: Node; args: Node[]; src: string }
  | { t: 'new'; callee: Node; args: Node[]; src: string }
  | { t: 'await'; arg: Node }
  | { t: 'spread'; arg: Node }
  | { t: 'bin'; l: Node; r: Node; src: string }
  | { t: 'obj'; props: PropNode[] }
  | { t: 'arr'; items: Node[] }
  | { t: 'unknown'; src: string };

type Stmt =
  | { kind: 'decl'; name: string; init: Node | null }
  | { kind: 'expr'; node: Node };

const BINARY_OPS = new Set([
  '+',
  '-',
  '*',
  '/',
  '%',
  '**',
  '||',
  '&&',
  '??',
  '==',
  '===',
  '!=',
  '!==',
  '<',
  '>',
  '<=',
  '>=',
  '&',
  '|',
  '^',
  '<<',
  '>>',
  '>>>',
]);
const ASSIGN_OPS = new Set([
  '=',
  '+=',
  '-=',
  '*=',
  '/=',
  '%=',
  '**=',
  '<<=',
  '>>=',
  '&&=',
  '||=',
  '??=',
]);
const OPEN = new Set(['(', '[', '{']);
const CLOSE = new Set([')', ']', '}']);

class Parser {
  private tokens: Token[];
  private pos = 0;

  constructor(private src: string) {
    this.tokens = lex(src);
  }

  private peek(offset = 0): Token {
    return this.tokens[Math.min(this.pos + offset, this.tokens.length - 1)];
  }
  private tokenAt(index: number): Token {
    return this.tokens[Math.min(Math.max(index, 0), this.tokens.length - 1)];
  }
  private next(): Token {
    const token = this.peek();
    if (token.type !== 'eof') this.pos++;
    return token;
  }
  private isP(value: string, offset = 0): boolean {
    const t = this.peek(offset);
    return t.type === 'punct' && t.value === value;
  }
  private isId(value: string, offset = 0): boolean {
    const t = this.peek(offset);
    return t.type === 'id' && t.value === value;
  }
  private expectP(value: string): void {
    if (!this.isP(value)) throw new SyntaxFail();
    this.pos++;
  }
  atEnd(): boolean {
    return this.peek().type === 'eof';
  }
  private sliceFrom(startPos: number): string {
    if (this.pos <= startPos) return '';
    return this.src.slice(
      this.tokens[startPos].start,
      this.tokens[this.pos - 1].end,
    );
  }
  private unknownFrom(startPos: number): Node {
    return { t: 'unknown', src: this.sliceFrom(startPos) };
  }

  /** 位置 index の開き括弧に対応する閉じ括弧の位置（なければ -1） */
  private matchClose(index: number): number {
    let depth = 0;
    for (let i = index; i < this.tokens.length; i++) {
      const t = this.tokens[i];
      if (t.type !== 'punct') continue;
      if (OPEN.has(t.value)) depth++;
      else if (CLOSE.has(t.value)) {
        depth--;
        if (depth === 0) return i;
      }
    }
    return -1;
  }

  private skipGroup(): void {
    const close = this.matchClose(this.pos);
    if (close === -1) throw new SyntaxFail();
    this.pos = close + 1;
  }

  /** 関数式（function / アロー関数）の先頭か */
  private isFunctionStart(): boolean {
    let p = this.pos;
    if (this.tokenAt(p).type === 'id' && this.tokenAt(p).value === 'async') {
      const after = this.tokenAt(p + 1);
      if (
        (after.type === 'id' && after.value === 'function') ||
        (after.type === 'punct' && after.value === '(') ||
        (after.type === 'id' && this.isArrowAt(p + 2))
      ) {
        p++;
      }
    }
    const t = this.tokenAt(p);
    if (t.type === 'id' && t.value === 'function') return true;
    if (t.type === 'id') return this.isArrowAt(p + 1);
    if (t.type === 'punct' && t.value === '(') {
      const close = this.matchClose(p);
      return close !== -1 && this.isArrowAt(close + 1);
    }
    return false;
  }
  private isArrowAt(index: number): boolean {
    const t = this.tokenAt(index);
    return t.type === 'punct' && t.value === '=>';
  }

  /** 関数式を丸ごと読み飛ばす */
  private skipFunctionLike(): void {
    if (this.isId('async')) this.pos++;
    if (this.isId('function')) {
      this.pos++;
      if (this.isP('*')) this.pos++;
      if (this.peek().type === 'id') this.pos++;
      if (!this.isP('(')) throw new SyntaxFail();
      this.skipGroup();
      if (!this.isP('{')) throw new SyntaxFail();
      this.skipGroup();
      return;
    }
    if (this.isP('(')) this.skipGroup();
    else this.pos++;
    this.expectP('=>');
    if (this.isP('{')) {
      this.skipGroup();
      return;
    }
    // 式本体: 区切りまで読み飛ばす
    let depth = 0;
    while (!this.atEnd()) {
      const t = this.peek();
      if (t.type === 'punct') {
        if (OPEN.has(t.value)) depth++;
        else if (CLOSE.has(t.value)) {
          if (depth === 0) break;
          depth--;
        } else if (depth === 0 && (t.value === ',' || t.value === ';')) break;
      }
      this.pos++;
    }
  }

  /**
   * 文の先頭が `function (...) {` / `(async () => {` / `async () => {` などなら、
   * `{` の直後の位置を返す（本体の文を順に読むため）。該当しなければ -1。
   */
  private functionBodyStart(): number {
    let p = this.pos;
    if (this.tokenAt(p).value === '(' && this.tokenAt(p).type === 'punct') p++;
    if (this.tokenAt(p).type === 'id' && this.tokenAt(p).value === 'async') p++;
    const t = this.tokenAt(p);
    if (t.type === 'id' && t.value === 'function') {
      p++;
      if (this.tokenAt(p).value === '*') p++;
      if (this.tokenAt(p).type === 'id') p++;
      if (this.tokenAt(p).value !== '(') return -1;
      const close = this.matchClose(p);
      if (close === -1) return -1;
      p = close + 1;
    } else if (t.type === 'punct' && t.value === '(') {
      const close = this.matchClose(p);
      if (close === -1 || !this.isArrowAt(close + 1)) return -1;
      p = close + 2;
    } else if (t.type === 'id' && this.isArrowAt(p + 1)) {
      p += 2;
    } else {
      return -1;
    }
    const brace = this.tokenAt(p);
    return brace.type === 'punct' && brace.value === '{' ? p + 1 : -1;
  }

  // --- 式 ---

  parseAssign(): Node {
    const start = this.pos;
    if (this.isFunctionStart()) {
      this.skipFunctionLike();
      return this.unknownFrom(start);
    }
    const left = this.parseBinary();
    if (this.isP('?')) {
      this.pos++;
      this.parseAssign();
      this.expectP(':');
      this.parseAssign();
      return this.unknownFrom(start);
    }
    const t = this.peek();
    if (t.type === 'punct' && ASSIGN_OPS.has(t.value)) {
      this.pos++;
      this.parseAssign();
      return this.unknownFrom(start);
    }
    return left;
  }

  private isBinaryOp(): boolean {
    const t = this.peek();
    if (t.type === 'punct') return BINARY_OPS.has(t.value);
    return t.type === 'id' && (t.value === 'in' || t.value === 'instanceof');
  }

  private parseBinary(): Node {
    const start = this.pos;
    let left = this.parseUnary();
    while (this.isBinaryOp()) {
      const op = this.next().value;
      const right = this.parseUnary();
      left =
        op === '+'
          ? { t: 'bin', l: left, r: right, src: this.sliceFrom(start) }
          : this.unknownFrom(start);
    }
    return left;
  }

  private parseUnary(): Node {
    const start = this.pos;
    const t = this.peek();
    if (t.type === 'id') {
      if (t.value === 'await') {
        this.pos++;
        return { t: 'await', arg: this.parseUnary() };
      }
      if (t.value === 'typeof' || t.value === 'void' || t.value === 'delete') {
        this.pos++;
        this.parseUnary();
        return this.unknownFrom(start);
      }
      if (t.value === 'new') return this.parseNew();
    }
    if (t.type === 'punct') {
      if (t.value === '-' || t.value === '+') {
        this.pos++;
        const arg = this.parseUnary();
        if (arg.t === 'num') {
          return t.value === '-' ? { t: 'num', v: -arg.v } : arg;
        }
        return this.unknownFrom(start);
      }
      if (
        t.value === '!' ||
        t.value === '~' ||
        t.value === '++' ||
        t.value === '--'
      ) {
        this.pos++;
        this.parseUnary();
        return this.unknownFrom(start);
      }
    }
    return this.parsePostfix();
  }

  private parseNew(): Node {
    const start = this.pos;
    this.pos++; // new
    if (this.isP('.')) throw new SyntaxFail(); // new.target
    const calleeStart = this.pos;
    let callee: Node;
    if (this.peek().type !== 'id') throw new SyntaxFail();
    callee = { t: 'id', name: this.next().value };
    while (this.isP('.') && this.peek(1).type === 'id') {
      this.pos++;
      callee = {
        t: 'member',
        obj: callee,
        prop: this.next().value,
        src: this.sliceFrom(calleeStart),
      };
    }
    const args = this.isP('(') ? this.parseArgs() : [];
    const node: Node = {
      t: 'new',
      callee,
      args,
      src: this.sliceFrom(start),
    };
    return this.parsePostfix(node, start);
  }

  private parsePostfix(base?: Node, startPos?: number): Node {
    const start = startPos ?? this.pos;
    let node = base ?? this.parsePrimary();
    for (;;) {
      if (this.isP('.') || this.isP('?.')) {
        const optional = this.isP('?.');
        if (optional && this.isP('(', 1)) {
          this.pos++;
          const args = this.parseArgs();
          node = { t: 'call', callee: node, args, src: this.sliceFrom(start) };
          continue;
        }
        if (optional && this.isP('[', 1)) {
          this.pos++;
          continue;
        }
        this.pos++;
        const nameToken = this.next();
        if (nameToken.type !== 'id') throw new SyntaxFail();
        node = {
          t: 'member',
          obj: node,
          prop: nameToken.value,
          src: this.sliceFrom(start),
        };
        continue;
      }
      if (this.isP('[')) {
        this.pos++;
        const index = this.parseAssign();
        this.expectP(']');
        node = { t: 'index', obj: node, index, src: this.sliceFrom(start) };
        continue;
      }
      if (this.isP('(')) {
        const args = this.parseArgs();
        node = { t: 'call', callee: node, args, src: this.sliceFrom(start) };
        continue;
      }
      break;
    }
    return node;
  }

  private parseArgs(): Node[] {
    this.expectP('(');
    const args: Node[] = [];
    while (!this.isP(')')) {
      if (this.isP('...')) {
        this.pos++;
        args.push({ t: 'spread', arg: this.parseAssign() });
      } else {
        args.push(this.parseAssign());
      }
      if (this.isP(',')) this.pos++;
      else break;
    }
    this.expectP(')');
    return args;
  }

  private parsePrimary(): Node {
    const t = this.peek();
    switch (t.type) {
      case 'str':
        this.pos++;
        return { t: 'str', v: t.value };
      case 'num':
        this.pos++;
        return { t: 'num', v: Number(t.value) };
      case 'tpl': {
        this.pos++;
        const exprs = (t.exprs ?? []).map((source) =>
          parseSubExpression(source),
        );
        return { t: 'tpl', cooked: t.cooked ?? [''], exprs };
      }
      case 'id':
        this.pos++;
        switch (t.value) {
          case 'true':
            return { t: 'bool', v: true };
          case 'false':
            return { t: 'bool', v: false };
          case 'null':
            return { t: 'null' };
          case 'undefined':
            return { t: 'undef' };
          default:
            return { t: 'id', name: t.value };
        }
      case 'punct':
        if (t.value === '(') {
          this.pos++;
          if (this.isP(')')) throw new SyntaxFail();
          let node = this.parseAssign();
          while (this.isP(',')) {
            this.pos++;
            node = this.parseAssign();
          }
          this.expectP(')');
          return node;
        }
        if (t.value === '{') return this.parseObject();
        if (t.value === '[') return this.parseArray();
        throw new SyntaxFail();
      default:
        throw new SyntaxFail();
    }
  }

  private parseObject(): Node {
    this.expectP('{');
    const props: PropNode[] = [];
    while (!this.isP('}')) {
      if (this.isP('...')) {
        this.pos++;
        props.push({ spread: this.parseAssign() });
      } else {
        let keyToken = this.next();
        // async / get / set の接頭辞
        if (
          keyToken.type === 'id' &&
          (keyToken.value === 'async' ||
            keyToken.value === 'get' ||
            keyToken.value === 'set') &&
          (this.peek().type === 'id' ||
            this.peek().type === 'str' ||
            this.isP('['))
        ) {
          keyToken = this.next();
        }
        let key: string | Node;
        let computed = false;
        if (keyToken.type === 'str' || keyToken.type === 'id') {
          key = keyToken.value;
        } else if (keyToken.type === 'num') {
          key = keyToken.value;
        } else if (keyToken.type === 'punct' && keyToken.value === '[') {
          computed = true;
          key = this.parseAssign();
          this.expectP(']');
        } else {
          throw new SyntaxFail();
        }
        if (this.isP(':')) {
          this.pos++;
          props.push({ key, computed, value: this.parseAssign() });
        } else if (this.isP('(')) {
          // メソッド定義は読み飛ばす
          const start = this.pos;
          this.skipGroup();
          if (!this.isP('{')) throw new SyntaxFail();
          this.skipGroup();
          props.push({
            key,
            computed,
            value: { t: 'unknown', src: this.sliceFrom(start) },
          });
        } else if (keyToken.type === 'id' && !computed) {
          props.push({
            key,
            computed: false,
            value: { t: 'id', name: keyToken.value },
          });
        } else {
          throw new SyntaxFail();
        }
      }
      if (this.isP(',')) this.pos++;
      else break;
    }
    this.expectP('}');
    return { t: 'obj', props };
  }

  private parseArray(): Node {
    this.expectP('[');
    const items: Node[] = [];
    while (!this.isP(']')) {
      if (this.isP(',')) {
        this.pos++;
        items.push({ t: 'undef' });
        continue;
      }
      if (this.isP('...')) {
        this.pos++;
        items.push({ t: 'spread', arg: this.parseAssign() });
      } else {
        items.push(this.parseAssign());
      }
      if (this.isP(',')) this.pos++;
      else break;
    }
    this.expectP(']');
    return { t: 'arr', items };
  }

  // --- 文 ---

  parseProgram(): { stmts: Stmt[]; failed: boolean } {
    const stmts: Stmt[] = [];
    try {
      while (!this.atEnd()) this.parseStatement(stmts);
      return { stmts, failed: false };
    } catch (error) {
      if (error instanceof SyntaxFail) return { stmts, failed: true };
      throw error;
    }
  }

  private parseStatement(stmts: Stmt[]): void {
    const t = this.peek();

    if (t.type === 'punct') {
      if (t.value === ';' || t.value === '{' || t.value === '}') {
        this.pos++;
        return;
      }
      if (t.value === ')') {
        this.pos++;
        return;
      }
    }

    // 関数本体（アロー関数・IIFE など）の中の文を順に読む
    const bodyStart = this.functionBodyStart();
    if (bodyStart !== -1) {
      this.pos = bodyStart;
      return;
    }
    if (t.type === 'punct' && t.value === '(' && this.isP(')', 1)) {
      this.pos += 2;
      return;
    }

    if (t.type === 'id') {
      switch (t.value) {
        case 'try':
        case 'finally':
        case 'else':
        case 'do':
        case 'export':
        case 'default':
        case 'return':
          this.pos++;
          return;
        case 'catch':
        case 'if':
        case 'for':
        case 'while':
        case 'switch':
          this.pos++;
          if (this.isP('(')) this.skipGroup();
          return;
        case 'import':
          if (!this.isP('(', 1) && !this.isP('.', 1)) {
            this.pos++;
            while (!this.atEnd() && this.peek().type !== 'str') this.pos++;
            if (!this.atEnd()) this.pos++;
            return;
          }
          break;
        case 'const':
        case 'let':
        case 'var':
          this.pos++;
          this.parseDeclarations(stmts);
          return;
        case 'function':
          // 本体が `{` で始まらない形（宣言の誤り）は式として扱わない
          throw new SyntaxFail();
        default:
          break;
      }
    }

    const before = this.pos;
    const node = this.parseAssign();
    while (this.isP(',')) {
      this.pos++;
      stmts.push({ kind: 'expr', node });
      this.parseAssign();
    }
    if (this.pos === before) throw new SyntaxFail();
    stmts.push({ kind: 'expr', node });
    if (this.isP(';')) this.pos++;
  }

  private parseDeclarations(stmts: Stmt[]): void {
    for (;;) {
      const t = this.peek();
      if (t.type === 'id') {
        this.pos++;
        let init: Node | null = null;
        if (this.isP('=')) {
          this.pos++;
          const bodyStart = this.functionBodyStart();
          if (bodyStart !== -1) {
            this.pos = bodyStart;
          } else {
            init = this.parseAssign();
          }
        }
        stmts.push({ kind: 'decl', name: t.value, init });
      } else if (t.type === 'punct' && (t.value === '{' || t.value === '[')) {
        // 分割代入: 名前は追跡しないが、右辺は読む（リクエストを含む場合があるため）
        this.skipGroup();
        if (this.isP('=')) {
          this.pos++;
          stmts.push({ kind: 'expr', node: this.parseAssign() });
        }
      } else {
        throw new SyntaxFail();
      }
      if (this.isP(',')) {
        this.pos++;
        continue;
      }
      break;
    }
    if (this.isP(';')) this.pos++;
  }
}

function parseSubExpression(source: string): Node {
  try {
    const parser = new Parser(source);
    const node = parser.parseAssign();
    if (parser.atEnd()) return node;
  } catch (error) {
    if (!(error instanceof SyntaxFail)) throw error;
  }
  return { t: 'unknown', src: source.trim() };
}

// ---------------------------------------------------------------------------
// 評価（リテラルと変数参照だけを解決する。関数は呼ばない）
// ---------------------------------------------------------------------------

type ObjKind = 'plain' | 'headers' | 'params' | 'form' | 'request' | 'file';

type Val =
  | { k: 'str'; v: string }
  | { k: 'num'; v: number }
  | { k: 'bool'; v: boolean }
  | { k: 'null' }
  | { k: 'undef' }
  | { k: 'arr'; items: Val[] }
  | { k: 'obj'; kind: ObjKind; entries: [string, Val][] }
  | { k: 'unknown'; src: string };

const UNDEF: Val = { k: 'undef' };

function plainObject(entries: [string, Val][] = []): Val {
  return { k: 'obj', kind: 'plain', entries };
}

function lastEntry(entries: [string, Val][], key: string): Val | undefined {
  for (let i = entries.length - 1; i >= 0; i--) {
    if (entries[i][0] === key) return entries[i][1];
  }
  return undefined;
}

function nameOf(node: Node): string | null {
  if (node.t === 'id') return node.name;
  if (node.t === 'member') {
    const base = nameOf(node.obj);
    return base === null ? null : `${base}.${node.prop}`;
  }
  return null;
}

function fromPlain(value: unknown): Val {
  if (value === null) return { k: 'null' };
  if (typeof value === 'string') return { k: 'str', v: value };
  if (typeof value === 'number') return { k: 'num', v: value };
  if (typeof value === 'boolean') return { k: 'bool', v: value };
  if (Array.isArray(value)) return { k: 'arr', items: value.map(fromPlain) };
  if (typeof value === 'object') {
    return plainObject(
      Object.entries(value as Record<string, unknown>).map(([k, v]) => [
        k,
        fromPlain(v),
      ]),
    );
  }
  return UNDEF;
}

function paramsToString(entries: [string, string][]): string {
  return new URLSearchParams(entries).toString();
}

class Evaluator {
  warnings: FetchToCurlWarning[] = [];
  private seen = new Set<string>();
  private env = new Map<
    string,
    { node: Node | null; val?: Val; busy?: boolean }
  >();

  warn(warning: FetchToCurlWarning): void {
    const key = JSON.stringify(warning);
    if (this.seen.has(key)) return;
    this.seen.add(key);
    this.warnings.push(warning);
  }

  declare(name: string, init: Node | null): void {
    this.env.set(name, { node: init });
  }

  /** 値を文字列にする。解決できない値は `<ソース>` のプレースホルダにして警告する */
  toStr(val: Val): string {
    switch (val.k) {
      case 'str':
        return val.v;
      case 'num':
        return String(val.v);
      case 'bool':
        return String(val.v);
      case 'null':
        return 'null';
      case 'undef':
        return 'undefined';
      case 'arr':
        return val.items
          .map((item) =>
            item.k === 'null' || item.k === 'undef' ? '' : this.toStr(item),
          )
          .join(',');
      case 'obj':
        if (val.kind === 'params') {
          return paramsToString(
            val.entries.map(([k, v]) => [k, this.toStr(v)]),
          );
        }
        return '[object Object]';
      case 'unknown':
        return this.placeholder(val.src);
    }
  }

  placeholder(src: string): string {
    const expr = src.replace(/\s+/g, ' ').trim();
    this.warn({ code: 'unresolved', expr });
    return `<${expr}>`;
  }

  toPlain(val: Val): unknown {
    switch (val.k) {
      case 'str':
      case 'num':
      case 'bool':
        return val.v;
      case 'null':
        return null;
      case 'undef':
        return undefined;
      case 'unknown':
        return this.placeholder(val.src);
      case 'arr':
        return val.items.map((item) => {
          const plain = this.toPlain(item);
          return plain === undefined ? null : plain;
        });
      case 'obj': {
        const out: Record<string, unknown> = Object.create(null);
        for (const [k, v] of val.entries) {
          const plain = this.toPlain(v);
          if (plain !== undefined) out[k] = plain;
          else delete out[k];
        }
        return out;
      }
    }
  }

  evalNode(node: Node): Val {
    switch (node.t) {
      case 'str':
        return { k: 'str', v: node.v };
      case 'num':
        return { k: 'num', v: node.v };
      case 'bool':
        return { k: 'bool', v: node.v };
      case 'null':
        return { k: 'null' };
      case 'undef':
        return UNDEF;
      case 'tpl': {
        let out = node.cooked[0];
        node.exprs.forEach((expr, i) => {
          out += this.toStr(this.evalNode(expr)) + node.cooked[i + 1];
        });
        return { k: 'str', v: out };
      }
      case 'id': {
        const entry = this.env.get(node.name);
        if (!entry || entry.node === null || entry.busy) {
          return { k: 'unknown', src: node.name };
        }
        if (entry.val) return entry.val;
        entry.busy = true;
        const val = this.evalNode(entry.node);
        entry.busy = false;
        entry.val = val;
        return val;
      }
      case 'await':
        return this.evalNode(node.arg);
      case 'spread':
        return this.evalNode(node.arg);
      case 'unknown':
        return { k: 'unknown', src: node.src };
      case 'arr': {
        const items: Val[] = [];
        for (const item of node.items) {
          if (item.t === 'spread') {
            const inner = this.evalNode(item.arg);
            if (inner.k === 'arr') items.push(...inner.items);
            else
              items.push({ k: 'unknown', src: `...${this.srcOf(item.arg)}` });
          } else {
            items.push(this.evalNode(item));
          }
        }
        return { k: 'arr', items };
      }
      case 'obj': {
        const entries: [string, Val][] = [];
        for (const prop of node.props) {
          if ('spread' in prop) {
            const inner = this.evalNode(prop.spread);
            if (inner.k === 'obj') entries.push(...inner.entries);
            else if (inner.k !== 'null' && inner.k !== 'undef') {
              this.warn({
                code: 'unresolved',
                expr: `...${this.srcOf(prop.spread)}`,
              });
            }
            continue;
          }
          let key: string;
          if (prop.computed) {
            const keyVal = this.evalNode(prop.key as Node);
            if (keyVal.k === 'str' || keyVal.k === 'num') {
              key = String(keyVal.v);
            } else {
              this.warn({
                code: 'unresolved',
                expr: `[${this.srcOf(prop.key as Node)}]`,
              });
              continue;
            }
          } else {
            key = prop.key as string;
          }
          entries.push([key, this.evalNode(prop.value)]);
        }
        return plainObject(entries);
      }
      case 'bin': {
        const l = this.evalNode(node.l);
        const r = this.evalNode(node.r);
        if (l.k === 'str' || r.k === 'str') {
          return { k: 'str', v: this.toStr(l) + this.toStr(r) };
        }
        if (l.k === 'num' && r.k === 'num') return { k: 'num', v: l.v + r.v };
        return { k: 'unknown', src: node.src };
      }
      case 'member': {
        const obj = this.evalNode(node.obj);
        return this.lookup(obj, node.prop, node.src);
      }
      case 'index': {
        const obj = this.evalNode(node.obj);
        const idx = this.evalNode(node.index);
        if (idx.k === 'str' || idx.k === 'num') {
          return this.lookup(obj, String(idx.v), node.src);
        }
        return { k: 'unknown', src: node.src };
      }
      case 'call':
        return this.evalCall(node);
      case 'new':
        return this.evalNew(node);
    }
  }

  private srcOf(node: Node): string {
    switch (node.t) {
      case 'id':
        return node.name;
      case 'unknown':
      case 'member':
      case 'index':
      case 'call':
      case 'new':
      case 'bin':
        return node.src;
      default:
        return '…';
    }
  }

  private lookup(obj: Val, prop: string, src: string): Val {
    if (obj.k === 'obj') {
      if (obj.kind === 'headers') {
        const lower = prop.toLowerCase();
        for (let i = obj.entries.length - 1; i >= 0; i--) {
          if (obj.entries[i][0].toLowerCase() === lower)
            return obj.entries[i][1];
        }
        return UNDEF;
      }
      return lastEntry(obj.entries, prop) ?? UNDEF;
    }
    if (obj.k === 'arr') {
      if (prop === 'length') return { k: 'num', v: obj.items.length };
      if (/^\d+$/.test(prop)) return obj.items[Number(prop)] ?? UNDEF;
    }
    if (obj.k === 'str' && prop === 'length') {
      return { k: 'num', v: obj.v.length };
    }
    return { k: 'unknown', src };
  }

  private evalCall(node: Extract<Node, { t: 'call' }>): Val {
    const name = nameOf(node.callee);
    const arg = (i: number): Val =>
      node.args[i] ? this.evalNode(node.args[i]) : UNDEF;

    switch (name) {
      case 'JSON.stringify': {
        const value = arg(0);
        const space = arg(2);
        const plain = this.toPlain(value);
        if (plain === undefined) return UNDEF;
        const indent =
          space.k === 'num'
            ? Math.min(10, Math.max(0, space.v))
            : space.k === 'str'
              ? space.v.slice(0, 10)
              : undefined;
        return { k: 'str', v: JSON.stringify(plain, null, indent) };
      }
      case 'JSON.parse': {
        const value = arg(0);
        if (value.k !== 'str') return { k: 'unknown', src: node.src };
        try {
          return fromPlain(JSON.parse(value.v));
        } catch {
          return { k: 'unknown', src: node.src };
        }
      }
      case 'String': {
        const value = arg(0);
        return value.k === 'unknown'
          ? { k: 'unknown', src: node.src }
          : { k: 'str', v: this.toStr(value) };
      }
      case 'encodeURIComponent':
      case 'encodeURI': {
        const value = arg(0);
        if (value.k === 'unknown' || value.k === 'obj' || value.k === 'arr') {
          return { k: 'unknown', src: node.src };
        }
        try {
          const text = this.toStr(value);
          return {
            k: 'str',
            v:
              name === 'encodeURI' ? encodeURI(text) : encodeURIComponent(text),
          };
        } catch {
          return { k: 'unknown', src: node.src };
        }
      }
      case 'btoa': {
        const value = arg(0);
        if (value.k !== 'str') return { k: 'unknown', src: node.src };
        try {
          return { k: 'str', v: btoa(value.v) };
        } catch {
          return { k: 'unknown', src: node.src };
        }
      }
      default:
        break;
    }

    if (node.callee.t === 'member') {
      const method = node.callee.prop;
      if (method === 'append' || method === 'set' || method === 'delete') {
        const target = this.evalNode(node.callee.obj);
        if (
          target.k === 'obj' &&
          (target.kind === 'headers' ||
            target.kind === 'params' ||
            target.kind === 'form')
        ) {
          const key = this.toStr(arg(0));
          if (method === 'delete') {
            target.entries = target.entries.filter(([k]) => k !== key);
          } else {
            if (method === 'set') {
              target.entries = target.entries.filter(([k]) => k !== key);
            }
            target.entries.push([key, arg(1)]);
          }
          return UNDEF;
        }
      }
      if (method === 'toString' && node.args.length === 0) {
        const target = this.evalNode(node.callee.obj);
        if (target.k === 'str') return target;
        if (target.k === 'obj' && target.kind === 'params') {
          return { k: 'str', v: this.toStr(target) };
        }
      }
      if (
        (method === 'toUpperCase' ||
          method === 'toLowerCase' ||
          method === 'trim') &&
        node.args.length === 0
      ) {
        const target = this.evalNode(node.callee.obj);
        if (target.k === 'str') {
          return {
            k: 'str',
            v:
              method === 'toUpperCase'
                ? target.v.toUpperCase()
                : method === 'toLowerCase'
                  ? target.v.toLowerCase()
                  : target.v.trim(),
          };
        }
      }
    }
    return { k: 'unknown', src: node.src };
  }

  private entriesOf(val: Val): [string, Val][] {
    if (val.k === 'obj') return val.entries;
    if (val.k === 'arr') {
      const out: [string, Val][] = [];
      for (const item of val.items) {
        if (item.k === 'arr' && item.items.length >= 2) {
          out.push([this.toStr(item.items[0]), item.items[1]]);
        }
      }
      return out;
    }
    if (val.k === 'str') {
      return [...new URLSearchParams(val.v).entries()].map(([k, v]) => [
        k,
        { k: 'str', v } as Val,
      ]);
    }
    if (val.k === 'unknown') {
      this.placeholder(val.src);
    }
    return [];
  }

  private evalNew(node: Extract<Node, { t: 'new' }>): Val {
    const name = nameOf(node.callee);
    const arg = (i: number): Val =>
      node.args[i] ? this.evalNode(node.args[i]) : UNDEF;
    switch (name) {
      case 'URLSearchParams':
        return {
          k: 'obj',
          kind: 'params',
          entries: this.entriesOf(arg(0)).map(([k, v]): [string, Val] => [
            k,
            v,
          ]),
        };
      case 'Headers':
        return {
          k: 'obj',
          kind: 'headers',
          entries: this.entriesOf(arg(0)).map(([k, v]): [string, Val] => [
            k,
            v,
          ]),
        };
      case 'FormData':
        return { k: 'obj', kind: 'form', entries: [] };
      case 'Blob':
      case 'File': {
        const fileName = name === 'File' ? arg(1) : UNDEF;
        return {
          k: 'obj',
          kind: 'file',
          entries: [['name', fileName.k === 'str' ? fileName : UNDEF]],
        };
      }
      case 'URL': {
        const url = arg(0);
        const base = arg(1);
        if (url.k !== 'str' || (base.k !== 'undef' && base.k !== 'str')) {
          return { k: 'unknown', src: node.src };
        }
        try {
          const href =
            base.k === 'str'
              ? new URL(url.v, base.v).href
              : new URL(url.v).href;
          return { k: 'str', v: href };
        } catch {
          return { k: 'unknown', src: node.src };
        }
      }
      case 'Request': {
        const init = arg(1);
        return {
          k: 'obj',
          kind: 'request',
          entries: [['url', arg(0)], ...(init.k === 'obj' ? init.entries : [])],
        };
      }
      default:
        return { k: 'unknown', src: node.src };
    }
  }
}

// ---------------------------------------------------------------------------
// リクエストの組み立て
// ---------------------------------------------------------------------------

function setHeader(headers: [string, string][], name: string, value: string) {
  const lower = name.toLowerCase();
  const existing = headers.findIndex(([n]) => n.toLowerCase() === lower);
  if (existing >= 0) headers[existing] = [headers[existing][0], value];
  else headers.push([name, value]);
}

function hasHeader(headers: [string, string][], name: string): boolean {
  const lower = name.toLowerCase();
  return headers.some(([n]) => n.toLowerCase() === lower);
}

function removeHeader(headers: [string, string][], name: string) {
  const lower = name.toLowerCase();
  const index = headers.findIndex(([n]) => n.toLowerCase() === lower);
  if (index >= 0) headers.splice(index, 1);
}

const AXIOS_NESTED_HEADER_KEYS = new Set([
  'common',
  'get',
  'post',
  'put',
  'patch',
  'delete',
  'head',
  'options',
]);

function readHeaders(ev: Evaluator, val: Val): [string, string][] {
  const headers: [string, string][] = [];
  if (val.k === 'undef' || val.k === 'null') return headers;
  if (val.k === 'unknown') {
    ev.placeholder(val.src);
    return headers;
  }
  const entries: [string, Val][] =
    val.k === 'obj'
      ? val.entries
      : val.k === 'arr'
        ? val.items.flatMap((item): [string, Val][] =>
            item.k === 'arr' && item.items.length >= 2
              ? [[ev.toStr(item.items[0]), item.items[1]]]
              : [],
          )
        : [];
  for (const [name, value] of entries) {
    if (value.k === 'undef') continue;
    if (value.k === 'obj' && AXIOS_NESTED_HEADER_KEYS.has(name)) {
      ev.warn({ code: 'unsupported-option', option: `headers.${name}` });
      continue;
    }
    setHeader(headers, name, ev.toStr(value));
  }
  return headers;
}

function isFileLike(val: Val): boolean {
  if (val.k === 'obj') return val.kind === 'file';
  return val.k === 'unknown' && /files?\b|blob/i.test(val.src);
}

function readForm(ev: Evaluator, entries: [string, Val][]) {
  const out: [string, string, boolean][] = [];
  for (const [name, value] of entries) {
    if (isFileLike(value)) {
      let label: string;
      if (value.k === 'obj') {
        const fileName = lastEntry(value.entries, 'name');
        label = fileName?.k === 'str' ? fileName.v : 'file';
      } else {
        label = value.k === 'unknown' ? value.src.replace(/\s+/g, ' ') : 'file';
      }
      ev.warn({ code: 'file-reference', name: label });
      out.push([name, `@${label}`, true]);
    } else {
      out.push([name, ev.toStr(value), false]);
    }
  }
  return out;
}

interface Draft {
  url: string | null;
  method: string | null;
  headers: [string, string][];
  body: string | null;
  form: [string, string, boolean][] | null;
  defaultContentType: string | null;
  basicAuth: CurlRequest['basicAuth'];
  followRedirects: boolean;
  timeoutSeconds: number | null;
  referer: string | null;
}

function newDraft(): Draft {
  return {
    url: null,
    method: null,
    headers: [],
    body: null,
    form: null,
    defaultContentType: null,
    basicAuth: null,
    followRedirects: false,
    timeoutSeconds: null,
    referer: null,
  };
}

function setBody(ev: Evaluator, draft: Draft, val: Val, axios: boolean) {
  draft.body = null;
  draft.form = null;
  draft.defaultContentType = null;
  switch (val.k) {
    case 'undef':
    case 'null':
      return;
    case 'str':
      draft.body = val.v;
      draft.defaultContentType = axios ? null : 'text/plain;charset=UTF-8';
      return;
    case 'num':
    case 'bool':
      draft.body = ev.toStr(val);
      draft.defaultContentType = axios ? null : 'text/plain;charset=UTF-8';
      return;
    case 'unknown':
      draft.body = ev.placeholder(val.src);
      return;
    case 'arr':
      if (axios) {
        draft.body = JSON.stringify(ev.toPlain(val));
        draft.defaultContentType = 'application/json';
      } else {
        draft.body = ev.toStr(val);
        draft.defaultContentType = 'text/plain;charset=UTF-8';
      }
      return;
    case 'obj':
      if (val.kind === 'params') {
        draft.body = ev.toStr(val);
        draft.defaultContentType =
          'application/x-www-form-urlencoded;charset=UTF-8';
      } else if (val.kind === 'form') {
        draft.form = readForm(ev, val.entries);
      } else if (axios) {
        draft.body = JSON.stringify(ev.toPlain(val));
        draft.defaultContentType = 'application/json';
      } else {
        ev.warn({ code: 'body-object' });
        draft.body = '[object Object]';
        draft.defaultContentType = 'text/plain;charset=UTF-8';
      }
      return;
  }
}

const FETCH_IGNORED = new Set([
  'mode',
  'cache',
  'referrerPolicy',
  'keepalive',
  'priority',
  'signal',
  'integrity',
  'duplex',
  'window',
]);

function buildFetch(ev: Evaluator, args: Val[]): Draft {
  const draft = newDraft();
  let urlVal = args[0] ?? UNDEF;
  const init = args[1] ?? UNDEF;
  let entries: [string, Val][] = [];

  if (urlVal.k === 'obj' && urlVal.kind === 'request') {
    entries = urlVal.entries.filter(([k]) => k !== 'url');
    urlVal = lastEntry(urlVal.entries, 'url') ?? UNDEF;
  }
  if (init.k === 'obj') entries = [...entries, ...init.entries];
  else if (init.k === 'unknown') ev.placeholder(init.src);

  if (urlVal.k === 'undef') return draft;
  draft.url = ev.toStr(urlVal);

  for (const [key, value] of entries) {
    switch (key) {
      case 'method':
        draft.method = ev.toStr(value).toUpperCase();
        break;
      case 'headers':
        for (const [name, v] of readHeaders(ev, value)) {
          setHeader(draft.headers, name, v);
        }
        break;
      case 'body':
        setBody(ev, draft, value, false);
        break;
      case 'credentials':
        if (value.k === 'str' && value.v === 'include') {
          ev.warn({ code: 'credentials' });
        }
        break;
      case 'redirect':
        draft.followRedirects = value.k === 'str' && value.v === 'follow';
        break;
      case 'referrer':
        if (value.k === 'str' && value.v !== '' && value.v !== 'about:client') {
          draft.referer = value.v;
        }
        break;
      default:
        if (!FETCH_IGNORED.has(key)) {
          ev.warn({ code: 'unsupported-option', option: key });
        }
    }
  }
  return draft;
}

const AXIOS_IGNORED = new Set([
  'responseType',
  'responseEncoding',
  'validateStatus',
  'signal',
  'decompress',
  'maxContentLength',
  'maxBodyLength',
  'maxRedirects',
  'onUploadProgress',
  'onDownloadProgress',
  'cancelToken',
  'xsrfCookieName',
  'xsrfHeaderName',
]);

function axiosEncode(text: string): string {
  return encodeURIComponent(text)
    .replace(/%3A/gi, ':')
    .replace(/%24/g, '$')
    .replace(/%2C/gi, ',')
    .replace(/%20/g, '+')
    .replace(/%5B/gi, '[')
    .replace(/%5D/gi, ']');
}

function serializeAxiosParams(ev: Evaluator, val: Val): string {
  if (val.k === 'obj' && val.kind === 'params') return ev.toStr(val);
  if (val.k === 'unknown') {
    ev.placeholder(val.src);
    return '';
  }
  if (val.k !== 'obj') return '';
  const parts: string[] = [];
  for (const [key, value] of val.entries) {
    if (value.k === 'undef' || value.k === 'null') continue;
    if (value.k === 'arr') {
      for (const item of value.items) {
        parts.push(`${axiosEncode(`${key}[]`)}=${axiosEncode(ev.toStr(item))}`);
      }
    } else if (value.k === 'obj') {
      parts.push(
        `${axiosEncode(key)}=${axiosEncode(JSON.stringify(ev.toPlain(value)))}`,
      );
    } else {
      parts.push(`${axiosEncode(key)}=${axiosEncode(ev.toStr(value))}`);
    }
  }
  return parts.join('&');
}

type AxiosCall =
  | { kind: 'generic' }
  | { kind: 'request' }
  | { kind: 'verb'; method: string; hasData: boolean };

function buildAxios(ev: Evaluator, call: AxiosCall, args: Val[]): Draft {
  const draft = newDraft();
  let urlVal: Val = UNDEF;
  let dataVal: Val = UNDEF;
  let config: Val;

  if (call.kind === 'verb') {
    urlVal = args[0] ?? UNDEF;
    if (call.hasData) {
      dataVal = args[1] ?? UNDEF;
      config = args[2] ?? UNDEF;
    } else {
      config = args[1] ?? UNDEF;
    }
    draft.method = call.method;
  } else if (call.kind === 'request') {
    config = args[0] ?? UNDEF;
  } else if (args[0] && args[0].k === 'str') {
    urlVal = args[0];
    config = args[1] ?? UNDEF;
  } else {
    config = args[0] ?? UNDEF;
  }

  const entries: [string, Val][] = [];
  if (config.k === 'obj') entries.push(...config.entries);
  else if (config.k === 'unknown') ev.placeholder(config.src);

  let baseURL = '';
  let params: Val = UNDEF;
  let configUrl: Val = UNDEF;

  for (const [key, value] of entries) {
    switch (key) {
      case 'url':
        configUrl = value;
        break;
      case 'method':
        if (call.kind !== 'verb') {
          draft.method = ev.toStr(value).toUpperCase();
        }
        break;
      case 'baseURL':
        baseURL = ev.toStr(value);
        break;
      case 'headers':
        for (const [name, v] of readHeaders(ev, value)) {
          setHeader(draft.headers, name, v);
        }
        break;
      case 'data':
        dataVal = value;
        break;
      case 'params':
        params = value;
        break;
      case 'auth':
        if (value.k === 'obj') {
          const username = lastEntry(value.entries, 'username');
          const password = lastEntry(value.entries, 'password');
          draft.basicAuth = {
            username: username ? ev.toStr(username) : '',
            password: password ? ev.toStr(password) : '',
          };
        } else if (value.k === 'unknown') {
          ev.placeholder(value.src);
        }
        break;
      case 'timeout':
        if (value.k === 'num' && value.v > 0) {
          draft.timeoutSeconds = value.v / 1000;
        }
        break;
      case 'withCredentials':
        if (value.k === 'bool' && value.v) ev.warn({ code: 'credentials' });
        break;
      default:
        if (!AXIOS_IGNORED.has(key)) {
          ev.warn({ code: 'unsupported-option', option: key });
        }
    }
  }

  if (urlVal.k === 'undef') urlVal = configUrl;
  const rawUrl = urlVal.k === 'undef' ? '' : ev.toStr(urlVal);
  if (rawUrl === '' && baseURL === '') return draft;

  let url = rawUrl;
  if (baseURL !== '' && !/^[a-zA-Z][a-zA-Z0-9+.-]*:\/\//.test(rawUrl)) {
    url =
      rawUrl === ''
        ? baseURL
        : `${baseURL.replace(/\/+$/, '')}/${rawUrl.replace(/^\/+/, '')}`;
  }
  const query = serializeAxiosParams(ev, params);
  if (query !== '') {
    const hashIndex = url.indexOf('#');
    const hash = hashIndex === -1 ? '' : url.slice(hashIndex);
    const base = hashIndex === -1 ? url : url.slice(0, hashIndex);
    url = `${base}${base.includes('?') ? '&' : '?'}${query}${hash}`;
  }
  draft.url = url;

  setBody(ev, draft, dataVal, true);
  return draft;
}

function finalizeRequest(ev: Evaluator, draft: Draft): CurlRequest {
  const headers = [...draft.headers];
  const method = draft.method ?? 'GET';
  const hasBody = draft.body !== null || draft.form !== null;

  if (draft.form) {
    // multipart の Content-Type（boundary 付き）は curl に任せる
    removeHeader(headers, 'Content-Type');
  } else if (
    draft.body !== null &&
    draft.defaultContentType !== null &&
    !hasHeader(headers, 'Content-Type')
  ) {
    headers.push(['Content-Type', draft.defaultContentType]);
  }

  const url = draft.url ?? '';
  if (!/^[a-zA-Z][a-zA-Z0-9+.-]*:\/\//.test(url) && !url.startsWith('<')) {
    ev.warn({ code: 'relative-url', url });
  }
  if (hasBody && (method === 'GET' || method === 'HEAD')) {
    ev.warn({ code: 'body-not-allowed', method });
  }

  return {
    url,
    method,
    headers,
    body: draft.body,
    form: draft.form,
    basicAuth: draft.basicAuth,
    followRedirects: draft.followRedirects,
    timeoutSeconds: draft.timeoutSeconds,
    referer: draft.referer,
  };
}

// ---------------------------------------------------------------------------
// リクエスト呼び出しの検出
// ---------------------------------------------------------------------------

type RequestCall =
  | { type: 'fetch'; node: Extract<Node, { t: 'call' }> }
  | { type: 'axios'; call: AxiosCall; node: Extract<Node, { t: 'call' }> };

const AXIOS_VERBS: Record<string, { method: string; hasData: boolean }> = {
  get: { method: 'GET', hasData: false },
  delete: { method: 'DELETE', hasData: false },
  head: { method: 'HEAD', hasData: false },
  options: { method: 'OPTIONS', hasData: false },
  post: { method: 'POST', hasData: true },
  put: { method: 'PUT', hasData: true },
  patch: { method: 'PATCH', hasData: true },
};
const FETCH_NAMES = new Set([
  'fetch',
  'window.fetch',
  'globalThis.fetch',
  'self.fetch',
]);

function classifyCall(node: Extract<Node, { t: 'call' }>): RequestCall | null {
  const name = nameOf(node.callee);
  if (name === null) return null;
  if (FETCH_NAMES.has(name)) return { type: 'fetch', node };
  if (name === 'axios')
    return { type: 'axios', call: { kind: 'generic' }, node };
  if (name === 'axios.request') {
    return { type: 'axios', call: { kind: 'request' }, node };
  }
  if (name.startsWith('axios.')) {
    const verb = AXIOS_VERBS[name.slice('axios.'.length)];
    if (verb) return { type: 'axios', call: { kind: 'verb', ...verb }, node };
  }
  return null;
}

/** `fetch(...).then(...).catch(...)` のような連鎖の根にあるリクエスト呼び出しを探す */
function findRequestCall(node: Node): RequestCall | null {
  let current: Node = node;
  for (let guard = 0; guard < 200; guard++) {
    switch (current.t) {
      case 'await':
        current = current.arg;
        break;
      case 'call': {
        const found = classifyCall(current);
        if (found) return found;
        current = current.callee;
        break;
      }
      case 'member':
      case 'index':
        current = current.obj;
        break;
      default:
        return null;
    }
  }
  return null;
}

// ---------------------------------------------------------------------------
// curl コマンドの生成
// ---------------------------------------------------------------------------

function shellQuote(text: string): string {
  return `'${text.replace(/'/g, `'\\''`)}'`;
}

export function generateCurl(
  request: CurlRequest,
  options: FetchToCurlOptions = { multiline: true },
): string {
  const parts: string[] = [`curl ${shellQuote(request.url)}`];

  if (request.method === 'HEAD') parts.push('-I');
  else if (
    request.method !== 'GET' ||
    request.body !== null ||
    request.form !== null
  ) {
    parts.push(
      `-X ${/^[A-Z]+$/.test(request.method) ? request.method : shellQuote(request.method)}`,
    );
  }
  for (const [name, value] of request.headers) {
    parts.push(`-H ${shellQuote(`${name}: ${value}`)}`);
  }
  if (request.form) {
    for (const [name, value, isFile] of request.form) {
      const needsString = !isFile && /^[@<]/.test(value);
      parts.push(
        needsString
          ? `--form-string ${shellQuote(`${name}=${value}`)}`
          : `-F ${shellQuote(`${name}=${value}`)}`,
      );
    }
  } else if (request.body !== null) {
    parts.push(`--data-raw ${shellQuote(request.body)}`);
  }
  if (request.basicAuth) {
    parts.push(
      `-u ${shellQuote(`${request.basicAuth.username}:${request.basicAuth.password}`)}`,
    );
  }
  if (request.referer !== null) parts.push(`-e ${shellQuote(request.referer)}`);
  if (request.timeoutSeconds !== null) {
    parts.push(`--max-time ${Number(request.timeoutSeconds.toFixed(3))}`);
  }
  if (request.followRedirects) parts.push('-L');

  return parts.join(options.multiline ? ' \\\n  ' : ' ');
}

// ---------------------------------------------------------------------------
// 公開API
// ---------------------------------------------------------------------------

export function convertToCurl(
  input: string,
  options: FetchToCurlOptions = { multiline: true },
): FetchToCurlResult {
  if (input.trim() === '') return { success: false, reason: 'empty' };

  try {
    const parser = new Parser(input);
    const { stmts, failed } = parser.parseProgram();

    const ev = new Evaluator();
    const state: {
      request: CurlRequest | null;
      urlMissing: boolean;
      others: number;
    } = { request: null, urlMissing: false, others: 0 };

    const handle = (node: Node) => {
      const found = findRequestCall(node);
      if (!found) return;
      if (state.request !== null || state.urlMissing) {
        state.others++;
        return;
      }
      const args = found.node.args.map((a) => ev.evalNode(a));
      const draft =
        found.type === 'fetch'
          ? buildFetch(ev, args)
          : buildAxios(ev, found.call, args);
      if (draft.url === null) {
        state.urlMissing = true;
        return;
      }
      state.request = finalizeRequest(ev, draft);
    };

    for (const stmt of stmts) {
      if (stmt.kind === 'decl') {
        ev.declare(stmt.name, stmt.init);
        if (stmt.init) handle(stmt.init);
        continue;
      }
      let inner = stmt.node;
      while (inner.t === 'await') inner = inner.arg;
      if (
        inner.t === 'call' &&
        inner.callee.t === 'member' &&
        ['append', 'set', 'delete'].includes(inner.callee.prop)
      ) {
        ev.evalNode(inner);
        continue;
      }
      handle(stmt.node);
    }

    const request = state.request;
    if (request === null) {
      if (state.urlMissing) return { success: false, reason: 'no-url' };
      return {
        success: false,
        reason: failed ? 'syntax-error' : 'no-request',
      };
    }
    if (state.others > 0) {
      ev.warn({ code: 'multiple-requests', count: state.others });
    }

    return {
      success: true,
      command: generateCurl(request, options),
      warnings: ev.warnings,
    };
  } catch (error) {
    if (error instanceof SyntaxFail || error instanceof RangeError) {
      return { success: false, reason: 'syntax-error' };
    }
    throw error;
  }
}
