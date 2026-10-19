// JSON5 ⇔ JSON 変換。eval / new Function は使わず、自前の再帰下降パーサーで読む。
// オブジェクトのキーは Object.defineProperty で設定し、"__proto__" などでも
// プロトタイプを書き換えない（通常のデータプロパティとして保持する）。

export type Json5ErrorCode =
  | 'unexpectedChar'
  | 'unexpectedEnd'
  | 'invalidNumber'
  | 'invalidEscape'
  | 'unterminatedString'
  | 'unterminatedComment'
  | 'tooDeep';

export interface Json5ErrorInfo {
  code: Json5ErrorCode;
  /** 1始まりの行 */
  line: number;
  /** 1始まりの桁（UTF-16コードユニット単位） */
  column: number;
  /** 問題の文字（unexpectedChar のときのみ。それ以外は空文字） */
  found: string;
}

export class Json5ParseError extends Error {
  info: Json5ErrorInfo;
  constructor(info: Json5ErrorInfo) {
    super(`${info.code} at ${info.line}:${info.column}`);
    this.name = 'Json5ParseError';
    this.info = info;
  }
}

export const MAX_DEPTH = 500;

const WHITESPACE = /[\t\n\v\f\r \u00a0\u2028\u2029\ufeff\p{Zs}]/u;
const ID_START = /^[\p{L}\p{Nl}$_]$/u;
const ID_PART = /^[\p{L}\p{Nl}\p{Nd}\p{Mn}\p{Mc}\p{Pc}$_\u200c\u200d]$/u;
const IDENTIFIER_NAME =
  /^[\p{L}\p{Nl}$_][\p{L}\p{Nl}\p{Nd}\p{Mn}\p{Mc}\p{Pc}$_\u200c\u200d]*$/u;
const HEX4 = /^[0-9a-fA-F]{4}$/;
const HEX2 = /^[0-9a-fA-F]{2}$/;

function isLineTerminator(c: string | undefined): boolean {
  return c === '\n' || c === '\r' || c === '\u2028' || c === '\u2029';
}

function lineColumn(src: string, pos: number) {
  let line = 1;
  let column = 1;
  for (let i = 0; i < pos && i < src.length; i++) {
    const c = src[i];
    if (c === '\r' && src[i + 1] === '\n') {
      // CRLF は続く \n 側で1回だけ改行として数える
      continue;
    }
    if (c === '\r' || c === '\n' || c === '\u2028' || c === '\u2029') {
      line++;
      column = 1;
    } else {
      column++;
    }
  }
  return { line, column };
}

function setOwn(obj: object, key: string, value: unknown) {
  Object.defineProperty(obj, key, {
    value,
    writable: true,
    enumerable: true,
    configurable: true,
  });
}

class Parser {
  src: string;
  pos = 0;
  depth = 0;

  constructor(src: string) {
    this.src = src;
  }

  fail(code: Json5ErrorCode, at: number = this.pos): never {
    let finalCode = code;
    let found = '';
    if (code === 'unexpectedChar') {
      if (at >= this.src.length) {
        finalCode = 'unexpectedEnd';
      } else {
        found = String.fromCodePoint(this.src.codePointAt(at) as number);
      }
    }
    const { line, column } = lineColumn(this.src, at);
    throw new Json5ParseError({ code: finalCode, line, column, found });
  }

  skipWs() {
    const s = this.src;
    for (;;) {
      const c = s[this.pos];
      if (c === undefined) return;
      if (WHITESPACE.test(c)) {
        this.pos++;
      } else if (c === '/' && s[this.pos + 1] === '/') {
        this.pos += 2;
        while (this.pos < s.length && !isLineTerminator(s[this.pos])) {
          this.pos++;
        }
      } else if (c === '/' && s[this.pos + 1] === '*') {
        const end = s.indexOf('*/', this.pos + 2);
        if (end === -1) this.fail('unterminatedComment', this.pos);
        this.pos = end + 2;
      } else {
        return;
      }
    }
  }

  parseValue(): unknown {
    this.skipWs();
    const c = this.src[this.pos];
    if (c === undefined) this.fail('unexpectedEnd');
    if (c === '{') return this.parseObject();
    if (c === '[') return this.parseArray();
    if (c === '"' || c === "'") return this.parseString();
    if (c === '+' || c === '-' || c === '.' || (c >= '0' && c <= '9')) {
      return this.parseNumber();
    }
    if (c === 'I' || c === 'N') return this.parseNumber();
    if (this.matchWord('true')) return true;
    if (this.matchWord('false')) return false;
    if (this.matchWord('null')) return null;
    return this.fail('unexpectedChar');
  }

  matchWord(word: string): boolean {
    if (!this.src.startsWith(word, this.pos)) return false;
    const next = this.src[this.pos + word.length];
    if (next !== undefined && /[\p{L}\p{Nd}$_\\]/u.test(next)) return false;
    this.pos += word.length;
    return true;
  }

  parseNumber(): number {
    const s = this.src;
    const start = this.pos;
    let sign = 1;
    if (s[this.pos] === '+' || s[this.pos] === '-') {
      if (s[this.pos] === '-') sign = -1;
      this.pos++;
    }
    let value: number;
    if (this.matchWord('Infinity')) {
      value = Infinity;
    } else if (this.matchWord('NaN')) {
      value = NaN;
    } else {
      const hex = /0[xX][0-9a-fA-F]+/y;
      hex.lastIndex = this.pos;
      const hexMatch = hex.exec(s);
      if (hexMatch) {
        value = Number(hexMatch[0]);
        this.pos += hexMatch[0].length;
      } else {
        const int = /(?:0|[1-9]\d*)(?:\.\d*)?|\.\d+/y;
        int.lastIndex = this.pos;
        const m = int.exec(s);
        if (!m) {
          // 符号だけ、または先頭が数値として不正
          return this.fail(
            this.pos < s.length ? 'invalidNumber' : 'unexpectedEnd',
            this.pos < s.length ? start : this.pos,
          );
        }
        let text = m[0];
        let end = this.pos + text.length;
        const exp = /[eE][+-]?\d+/y;
        exp.lastIndex = end;
        const em = exp.exec(s);
        if (em) {
          text += em[0];
          end += em[0].length;
        }
        value = Number(text);
        this.pos = end;
      }
    }
    const next = s[this.pos];
    if (next !== undefined && /[\p{L}\p{Nd}$_.\\]/u.test(next)) {
      this.fail('invalidNumber', start);
    }
    return sign * value;
  }

  parseString(): string {
    const s = this.src;
    const start = this.pos;
    const quote = s[this.pos];
    this.pos++;
    let out = '';
    for (;;) {
      const c = s[this.pos];
      if (c === undefined) this.fail('unterminatedString', start);
      if (c === quote) {
        this.pos++;
        return out;
      }
      if (c === '\n' || c === '\r') this.fail('unterminatedString', start);
      if (c === '\\') {
        out += this.parseEscape();
      } else {
        out += c;
        this.pos++;
      }
    }
  }

  /** 現在位置は '\\'。エスケープ列を読み、対応する文字列（行継続は空）を返す */
  parseEscape(): string {
    const s = this.src;
    const at = this.pos;
    const e = s[at + 1];
    if (e === undefined) this.fail('unterminatedString', at);
    this.pos += 2;
    switch (e) {
      case 'b':
        return '\b';
      case 'f':
        return '\f';
      case 'n':
        return '\n';
      case 'r':
        return '\r';
      case 't':
        return '\t';
      case 'v':
        return '\v';
      case '0': {
        const d = s[this.pos];
        if (d !== undefined && d >= '0' && d <= '9') {
          this.fail('invalidEscape', at);
        }
        return '\0';
      }
      case 'x': {
        const h = s.slice(this.pos, this.pos + 2);
        if (!HEX2.test(h)) this.fail('invalidEscape', at);
        this.pos += 2;
        return String.fromCharCode(parseInt(h, 16));
      }
      case 'u': {
        const h = s.slice(this.pos, this.pos + 4);
        if (!HEX4.test(h)) this.fail('invalidEscape', at);
        this.pos += 4;
        return String.fromCharCode(parseInt(h, 16));
      }
      case '\r':
        if (s[this.pos] === '\n') this.pos++;
        return '';
      case '\n':
      case '\u2028':
      case '\u2029':
        return '';
      default:
        if (e >= '1' && e <= '9') this.fail('invalidEscape', at);
        return e;
    }
  }

  parseKey(): string {
    const s = this.src;
    const c = s[this.pos];
    if (c === undefined) this.fail('unexpectedEnd');
    if (c === '"' || c === "'") return this.parseString();
    let out = '';
    let first = true;
    for (;;) {
      const at = this.pos;
      if (at >= s.length) break;
      let ch: string;
      if (s[at] === '\\') {
        if (s[at + 1] !== 'u' || !HEX4.test(s.slice(at + 2, at + 6))) {
          this.fail('invalidEscape', at);
        }
        ch = String.fromCharCode(parseInt(s.slice(at + 2, at + 6), 16));
        if (!(first ? ID_START : ID_PART).test(ch)) {
          this.fail('invalidEscape', at);
        }
        this.pos += 6;
      } else {
        ch = String.fromCodePoint(s.codePointAt(at) as number);
        if (!(first ? ID_START : ID_PART).test(ch)) break;
        this.pos += ch.length;
      }
      out += ch;
      first = false;
    }
    if (first) this.fail('unexpectedChar');
    return out;
  }

  enter() {
    this.depth++;
    if (this.depth > MAX_DEPTH) this.fail('tooDeep');
  }

  parseObject(): object {
    this.enter();
    this.pos++;
    const obj = {};
    for (;;) {
      this.skipWs();
      if (this.src[this.pos] === '}') {
        this.pos++;
        break;
      }
      const key = this.parseKey();
      this.skipWs();
      if (this.src[this.pos] !== ':') this.fail('unexpectedChar');
      this.pos++;
      setOwn(obj, key, this.parseValue());
      this.skipWs();
      const c = this.src[this.pos];
      if (c === ',') {
        this.pos++;
      } else if (c === '}') {
        this.pos++;
        break;
      } else {
        this.fail('unexpectedChar');
      }
    }
    this.depth--;
    return obj;
  }

  parseArray(): unknown[] {
    this.enter();
    this.pos++;
    const arr: unknown[] = [];
    for (;;) {
      this.skipWs();
      if (this.src[this.pos] === ']') {
        this.pos++;
        break;
      }
      arr.push(this.parseValue());
      this.skipWs();
      const c = this.src[this.pos];
      if (c === ',') {
        this.pos++;
      } else if (c === ']') {
        this.pos++;
        break;
      } else {
        this.fail('unexpectedChar');
      }
    }
    this.depth--;
    return arr;
  }
}

/** JSON5（JSONの上位互換）を値に変換する。失敗時は Json5ParseError を投げる */
export function parseJson5(source: string): unknown {
  const parser = new Parser(source);
  const value = parser.parseValue();
  parser.skipWs();
  if (parser.pos < source.length) parser.fail('unexpectedChar');
  return value;
}

export type IndentOption = 0 | 2 | 4 | 'tab';

function indentUnit(indent: IndentOption): string {
  if (indent === 'tab') return '\t';
  return ' '.repeat(indent);
}

export interface ConvertSuccess {
  success: true;
  output: string;
  /** Infinity / NaN を置き換えた数（JSON出力時のみ） */
  nonFiniteCount: number;
}

export interface ConvertFailure {
  success: false;
  error: Json5ErrorInfo;
}

export type ConvertOutcome = ConvertSuccess | ConvertFailure;

export interface ToJsonOptions {
  indent: IndentOption;
  /** Infinity / NaN の扱い。null は null に、string は "Infinity" 等の文字列にする */
  nonFinite: 'null' | 'string';
}

function failure(error: unknown): ConvertFailure {
  if (error instanceof Json5ParseError) {
    return { success: false, error: error.info };
  }
  // 想定外（スタック枯渇など）は深さ超過として扱う
  return {
    success: false,
    error: { code: 'tooDeep', line: 1, column: 1, found: '' },
  };
}

export function json5ToJson(
  input: string,
  options: ToJsonOptions = { indent: 2, nonFinite: 'null' },
): ConvertOutcome {
  try {
    const value = parseJson5(input);
    let nonFiniteCount = 0;
    const replacer = (_key: string, v: unknown) => {
      if (typeof v === 'number' && !Number.isFinite(v)) {
        nonFiniteCount++;
        return options.nonFinite === 'string' ? String(v) : null;
      }
      return v;
    };
    const output = JSON.stringify(
      value,
      replacer,
      options.indent === 0 ? undefined : indentUnit(options.indent),
    );
    return { success: true, output, nonFiniteCount };
  } catch (error) {
    return failure(error);
  }
}

export interface ToJson5Options {
  indent: IndentOption;
  quote: 'single' | 'double';
  /** true: 識別子として書けるキーはクォートを省略する */
  unquoteKeys: boolean;
  trailingComma: boolean;
}

export function quoteJson5String(value: string, quote: "'" | '"'): string {
  let out = quote;
  for (const ch of value) {
    const code = ch.codePointAt(0) as number;
    if (ch === quote || ch === '\\') {
      out += '\\' + ch;
    } else if (ch === '\n') {
      out += '\\n';
    } else if (ch === '\r') {
      out += '\\r';
    } else if (ch === '\t') {
      out += '\\t';
    } else if (ch === '\b') {
      out += '\\b';
    } else if (ch === '\f') {
      out += '\\f';
    } else if (
      code < 0x20 ||
      code === 0x7f ||
      code === 0x2028 ||
      code === 0x2029 ||
      (code >= 0xd800 && code <= 0xdfff)
    ) {
      out += '\\u' + code.toString(16).padStart(4, '0');
    } else {
      out += ch;
    }
  }
  return out + quote;
}

export function formatJson5Number(n: number): string {
  if (Number.isNaN(n)) return 'NaN';
  if (n === Infinity) return 'Infinity';
  if (n === -Infinity) return '-Infinity';
  if (Object.is(n, -0)) return '-0';
  return String(n);
}

export function isIdentifierName(key: string): boolean {
  return IDENTIFIER_NAME.test(key);
}

export function stringifyJson5(
  value: unknown,
  options: ToJson5Options,
): string {
  const q = options.quote === 'single' ? "'" : '"';
  const unit = indentUnit(options.indent);
  const compact = options.indent === 0;

  const fmtKey = (key: string) =>
    options.unquoteKeys && isIdentifierName(key)
      ? key
      : quoteJson5String(key, q);

  const walk = (v: unknown, level: number): string => {
    if (v === null) return 'null';
    if (typeof v === 'string') return quoteJson5String(v, q);
    if (typeof v === 'number') return formatJson5Number(v);
    if (typeof v === 'boolean') return v ? 'true' : 'false';
    const pad = compact ? '' : '\n' + unit.repeat(level + 1);
    const end = compact ? '' : '\n' + unit.repeat(level);
    const comma = options.trailingComma && !compact ? ',' : '';
    if (Array.isArray(v)) {
      if (v.length === 0) return '[]';
      const items = v.map((x) => pad + walk(x, level + 1));
      return '[' + items.join(',') + comma + end + ']';
    }
    const entries = Object.keys(v as object).map((k) => {
      const child = (v as Record<string, unknown>)[k];
      return (
        pad + fmtKey(k) + ':' + (compact ? '' : ' ') + walk(child, level + 1)
      );
    });
    if (entries.length === 0) return '{}';
    return '{' + entries.join(',') + comma + end + '}';
  };

  return walk(value, 0);
}

export function jsonToJson5(
  input: string,
  options: ToJson5Options = {
    indent: 2,
    quote: 'single',
    unquoteKeys: true,
    trailingComma: false,
  },
): ConvertOutcome {
  try {
    const value = parseJson5(input);
    return {
      success: true,
      output: stringifyJson5(value, options),
      nonFiniteCount: 0,
    };
  } catch (error) {
    return failure(error);
  }
}
