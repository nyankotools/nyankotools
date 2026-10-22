// 正規表現（JavaScript構文）をトークンに分解する自前パーサー。
// 実行はしない。説明文はUI側（辞書）が token.kind から組み立てる。

export type TokenKind =
  | 'literal'
  | 'space'
  | 'any'
  | 'digit'
  | 'notDigit'
  | 'word'
  | 'notWord'
  | 'whitespace'
  | 'notWhitespace'
  | 'wordBoundary'
  | 'notWordBoundary'
  | 'start'
  | 'end'
  | 'escNewline'
  | 'escTab'
  | 'escCR'
  | 'escFF'
  | 'escVT'
  | 'escNul'
  | 'escBackspace'
  | 'codePoint'
  | 'controlLetter'
  | 'unicodeProp'
  | 'notUnicodeProp'
  | 'escapedLiteral'
  | 'backref'
  | 'namedBackref'
  | 'classOpen'
  | 'negClassOpen'
  | 'classRange'
  | 'group'
  | 'namedGroup'
  | 'nonCapture'
  | 'lookahead'
  | 'negLookahead'
  | 'lookbehind'
  | 'negLookbehind'
  | 'modifierGroup'
  | 'alternation'
  | 'qStar'
  | 'qPlus'
  | 'qOptional'
  | 'qExact'
  | 'qAtLeast'
  | 'qRange';

export type ErrorCode =
  | 'unterminatedGroup'
  | 'unmatchedParen'
  | 'unterminatedClass'
  | 'rangeOutOfOrder'
  | 'invalidClassRange'
  | 'nothingToRepeat'
  | 'incompleteQuantifier'
  | 'quantifierOutOfOrder'
  | 'trailingBackslash'
  | 'invalidEscape'
  | 'invalidBackref'
  | 'invalidGroup'
  | 'invalidGroupName'
  | 'undefinedGroupName'
  | 'loneBracket'
  | 'native';

export type FlagErrorCode = 'invalidFlag' | 'duplicateFlag' | 'flagUV';

export interface RegexToken {
  kind: TokenKind;
  /** パターン中の該当部分 */
  source: string;
  start: number;
  end: number;
  /** ネストの深さ（グループ・文字クラスの内側ほど大きい） */
  depth: number;
  /** 説明文テンプレートに差し込む値 */
  p: Record<string, string>;
  /** 量指定子の最短一致（?付き） */
  lazy?: boolean;
}

export interface RegexError {
  code: ErrorCode;
  /** 0始まりの位置。位置が特定できない場合は -1 */
  index: number;
  detail?: string;
}

export interface FlagError {
  code: FlagErrorCode;
  index: number;
  char: string;
}

export interface ExplainResult {
  ok: boolean;
  tokens: RegexToken[];
  error: RegexError | null;
  flagError: FlagError | null;
  /** 有効なフラグ文字（重複除去、入力順） */
  flags: string[];
  groupCount: number;
  groupNames: string[];
}

export const FLAG_LETTERS = 'dgimsuvy';

class RegexParseError extends Error {
  code: ErrorCode;
  index: number;
  detail?: string;
  constructor(code: ErrorCode, index: number, detail?: string) {
    super(code);
    this.code = code;
    this.index = index;
    this.detail = detail;
  }
}

interface Item {
  kind: TokenKind;
  start: number;
  end: number;
  p: Record<string, string>;
  /** 文字クラスの範囲に使える単一コードポイント */
  cp: number | null;
  /** 量指定子を付けられない（アンカー等） */
  assertion?: boolean;
}

type Prev = 'atom' | 'assertion' | 'quantified' | null;

const NAME_RE = /^[\p{ID_Start}$_][\p{ID_Continue}$‌‍]*$/u;

export function displayChar(cp: number): string {
  if (cp === 0x20) return '␠';
  if (
    cp < 0x20 ||
    (cp >= 0x7f && cp < 0xa0) ||
    cp === 0x2028 ||
    cp === 0x2029
  ) {
    return 'U+' + cp.toString(16).toUpperCase().padStart(4, '0');
  }
  return String.fromCodePoint(cp);
}

function hexLabel(cp: number): string {
  return 'U+' + cp.toString(16).toUpperCase().padStart(4, '0');
}

class Parser {
  pos = 0;
  tokens: RegexToken[] = [];
  groupCount = 0;
  groupNames: string[] = [];
  readonly totalGroups: number;
  readonly names = new Set<string>();

  constructor(
    readonly text: string,
    readonly unicode: boolean,
  ) {
    this.totalGroups = this.prescan();
  }

  private prescan(): number {
    const t = this.text;
    let count = 0;
    let inClass = false;
    for (let i = 0; i < t.length; i++) {
      const c = t[i];
      if (c === '\\') {
        i++;
        continue;
      }
      if (inClass) {
        if (c === ']') inClass = false;
        continue;
      }
      if (c === '[') {
        inClass = true;
      } else if (c === '(') {
        if (t[i + 1] !== '?') {
          count++;
        } else if (t[i + 2] === '<' && t[i + 3] !== '=' && t[i + 3] !== '!') {
          count++;
          const end = t.indexOf('>', i + 3);
          if (end > 0) this.names.add(t.slice(i + 3, end));
        }
      }
    }
    return count;
  }

  fail(code: ErrorCode, index: number, detail?: string): never {
    throw new RegexParseError(code, index, detail);
  }

  private push(
    kind: TokenKind,
    start: number,
    end: number,
    depth: number,
    p: Record<string, string> = {},
    lazy?: boolean,
  ) {
    const tok: RegexToken = {
      kind,
      source: this.text.slice(start, end),
      start,
      end,
      depth,
      p,
    };
    if (lazy) tok.lazy = true;
    this.tokens.push(tok);
  }

  private pushItem(item: Item, depth: number) {
    this.push(item.kind, item.start, item.end, depth, item.p);
  }

  run() {
    this.parseDisjunction(0);
    if (this.pos < this.text.length) this.fail('unmatchedParen', this.pos);
  }

  private parseDisjunction(depth: number) {
    for (;;) {
      this.parseAlternative(depth);
      if (this.text[this.pos] === '|') {
        this.push('alternation', this.pos, this.pos + 1, depth);
        this.pos++;
        continue;
      }
      return;
    }
  }

  private parseAlternative(depth: number) {
    const t = this.text;
    let prev: Prev = null;
    while (this.pos < t.length) {
      const c = t[this.pos];
      if (c === '|' || c === ')') return;
      if (c === '*' || c === '+' || c === '?' || c === '{') {
        if (this.tryQuantifier(depth, prev)) {
          prev = 'quantified';
          continue;
        }
        // 量指定子として解釈できない { は非unicodeモードでリテラル扱い
        const start = this.pos;
        this.pos++;
        this.push('literal', start, this.pos, depth, { c: '{' });
        prev = 'atom';
        continue;
      }
      if (c === '^') {
        this.push('start', this.pos, this.pos + 1, depth);
        this.pos++;
        prev = 'assertion';
      } else if (c === '$') {
        this.push('end', this.pos, this.pos + 1, depth);
        this.pos++;
        prev = 'assertion';
      } else if (c === '.') {
        this.push('any', this.pos, this.pos + 1, depth);
        this.pos++;
        prev = 'atom';
      } else if (c === '(') {
        prev = this.parseGroup(depth);
      } else if (c === '[') {
        this.parseClass(depth);
        prev = 'atom';
      } else if (c === '\\') {
        const item = this.parseEscape(false);
        this.pushItem(item, depth);
        prev = item.assertion ? 'assertion' : 'atom';
      } else {
        if ((c === ']' || c === '}') && this.unicode) {
          this.fail('loneBracket', this.pos);
        }
        const cp = t.codePointAt(this.pos)!;
        const start = this.pos;
        this.pos += cp > 0xffff ? 2 : 1;
        this.pushItem(this.literalItem(cp, start), depth);
        prev = 'atom';
      }
    }
  }

  private literalItem(cp: number, start: number): Item {
    return {
      kind: cp === 0x20 ? 'space' : 'literal',
      start,
      end: this.pos,
      p: { c: displayChar(cp) },
      cp,
    };
  }

  private tryQuantifier(depth: number, prev: Prev): boolean {
    const t = this.text;
    const start = this.pos;
    const c = t[start];
    let kind: TokenKind;
    let p: Record<string, string> = {};
    let next = start + 1;
    if (c === '*') kind = 'qStar';
    else if (c === '+') kind = 'qPlus';
    else if (c === '?') kind = 'qOptional';
    else {
      const m = /^\{(\d+)(?:(,)(\d*))?\}/.exec(t.slice(start));
      if (!m) {
        if (this.unicode) this.fail('incompleteQuantifier', start);
        return false;
      }
      next = start + m[0].length;
      if (m[2] === undefined) {
        kind = 'qExact';
        p = { n: m[1] };
      } else if (m[3] === '') {
        kind = 'qAtLeast';
        p = { n: m[1] };
      } else {
        kind = 'qRange';
        p = { min: m[1], max: m[3] };
        if (Number(m[1]) > Number(m[3])) {
          this.fail('quantifierOutOfOrder', start);
        }
      }
    }
    if (prev !== 'atom') this.fail('nothingToRepeat', start);
    let lazy = false;
    if (t[next] === '?') {
      lazy = true;
      next++;
    }
    this.pos = next;
    this.push(kind, start, next, depth, p, lazy);
    return true;
  }

  private parseGroup(depth: number): Prev {
    const t = this.text;
    const s = this.pos;
    this.pos++; // (
    let kind: TokenKind = 'group';
    let p: Record<string, string> = {};
    let prev: Prev = 'atom';
    if (t[this.pos] === '?') {
      const n1 = t[this.pos + 1];
      const n2 = t[this.pos + 2];
      if (n1 === ':') {
        kind = 'nonCapture';
        this.pos += 2;
      } else if (n1 === '=' || n1 === '!') {
        kind = n1 === '=' ? 'lookahead' : 'negLookahead';
        this.pos += 2;
        if (this.unicode) prev = 'assertion';
      } else if (n1 === '<' && (n2 === '=' || n2 === '!')) {
        kind = n2 === '=' ? 'lookbehind' : 'negLookbehind';
        this.pos += 3;
        prev = 'assertion';
      } else if (n1 === '<') {
        const end = t.indexOf('>', this.pos + 2);
        const name = end < 0 ? '' : t.slice(this.pos + 2, end);
        if (end < 0 || !NAME_RE.test(name)) this.fail('invalidGroupName', s);
        kind = 'namedGroup';
        this.groupCount++;
        p = { name, n: String(this.groupCount) };
        this.groupNames.push(name);
        this.pos = end + 1;
      } else {
        const m = /^\?([ims]*)(?:-([ims]*))?:/.exec(t.slice(this.pos));
        if (!m || (!m[1] && !m[2])) this.fail('invalidGroup', s);
        const add = m[1] ? '+' + m[1] : '';
        const remove = m[2] ? '-' + m[2] : '';
        kind = 'modifierGroup';
        p = { flags: [add, remove].filter(Boolean).join(' ') };
        this.pos += m[0].length;
      }
    } else {
      this.groupCount++;
      p = { n: String(this.groupCount) };
    }
    this.push(kind, s, this.pos, depth, p);
    this.parseDisjunction(depth + 1);
    if (t[this.pos] !== ')') this.fail('unterminatedGroup', s);
    this.pos++;
    return prev;
  }

  private parseClass(depth: number) {
    const t = this.text;
    const s = this.pos;
    this.pos++; // [
    const negated = t[this.pos] === '^';
    if (negated) this.pos++;
    this.push(negated ? 'negClassOpen' : 'classOpen', s, this.pos, depth);
    for (;;) {
      if (this.pos >= t.length) this.fail('unterminatedClass', s);
      if (t[this.pos] === ']') {
        this.pos++;
        return;
      }
      const a = this.classAtom();
      if (
        t[this.pos] === '-' &&
        this.pos + 1 < t.length &&
        t[this.pos + 1] !== ']'
      ) {
        const dash = this.pos;
        this.pos++;
        const b = this.classAtom();
        if (a.cp !== null && b.cp !== null) {
          if (a.cp > b.cp) this.fail('rangeOutOfOrder', a.start);
          this.push('classRange', a.start, b.end, depth + 1, {
            from: displayChar(a.cp),
            to: displayChar(b.cp),
          });
        } else if (this.unicode) {
          this.fail('invalidClassRange', a.start);
        } else {
          this.pushItem(a, depth + 1);
          this.push('literal', dash, dash + 1, depth + 1, { c: '-' });
          this.pushItem(b, depth + 1);
        }
        continue;
      }
      this.pushItem(a, depth + 1);
    }
  }

  private classAtom(): Item {
    if (this.text[this.pos] === '\\') return this.parseEscape(true);
    const cp = this.text.codePointAt(this.pos)!;
    const start = this.pos;
    this.pos += cp > 0xffff ? 2 : 1;
    return this.literalItem(cp, start);
  }

  private parseEscape(inClass: boolean): Item {
    const t = this.text;
    const start = this.pos;
    this.pos++; // backslash
    if (this.pos >= t.length) this.fail('trailingBackslash', start);
    const c = t[this.pos];
    const done = (
      kind: TokenKind,
      cp: number | null,
      p: Record<string, string> = {},
      assertion = false,
    ): Item => ({ kind, start, end: this.pos, p, cp, assertion });
    const simple = (kind: TokenKind): Item => {
      this.pos++;
      return done(kind, null);
    };
    const cpItem = (cp: number, kind: TokenKind = 'codePoint'): Item =>
      done(kind, cp, { hex: hexLabel(cp), c: displayChar(cp) });
    const identity = (): Item => {
      const cp = t.codePointAt(this.pos)!;
      this.pos += cp > 0xffff ? 2 : 1;
      return done('escapedLiteral', cp, { c: displayChar(cp) });
    };

    switch (c) {
      case 'd':
        return simple('digit');
      case 'D':
        return simple('notDigit');
      case 'w':
        return simple('word');
      case 'W':
        return simple('notWord');
      case 's':
        return simple('whitespace');
      case 'S':
        return simple('notWhitespace');
      case 'b':
        this.pos++;
        return inClass
          ? done('escBackspace', 8)
          : done('wordBoundary', null, {}, true);
      case 'B':
        if (inClass) {
          if (this.unicode) this.fail('invalidEscape', start);
          return identity();
        }
        this.pos++;
        return done('notWordBoundary', null, {}, true);
      case 'n':
        this.pos++;
        return done('escNewline', 10);
      case 't':
        this.pos++;
        return done('escTab', 9);
      case 'r':
        this.pos++;
        return done('escCR', 13);
      case 'f':
        this.pos++;
        return done('escFF', 12);
      case 'v':
        this.pos++;
        return done('escVT', 11);
      case 'x': {
        const m = /^x([0-9a-fA-F]{2})/.exec(t.slice(this.pos));
        if (!m) {
          if (this.unicode) this.fail('invalidEscape', start);
          return identity();
        }
        this.pos += 3;
        return cpItem(parseInt(m[1], 16));
      }
      case 'u': {
        const rest = t.slice(this.pos);
        const m4 = /^u([0-9a-fA-F]{4})/.exec(rest);
        if (m4) {
          this.pos += 5;
          let cp = parseInt(m4[1], 16);
          if (this.unicode && cp >= 0xd800 && cp <= 0xdbff) {
            const lo = /^\\u([dD][c-fC-F][0-9a-fA-F]{2})/.exec(
              t.slice(this.pos),
            );
            if (lo) {
              cp =
                0x10000 +
                ((cp - 0xd800) << 10) +
                (parseInt(lo[1], 16) - 0xdc00);
              this.pos += 6;
            }
          }
          return cpItem(cp);
        }
        if (this.unicode) {
          const mb = /^u\{([0-9a-fA-F]+)\}/.exec(rest);
          if (mb && parseInt(mb[1], 16) <= 0x10ffff) {
            this.pos += mb[0].length;
            return cpItem(parseInt(mb[1], 16));
          }
          this.fail('invalidEscape', start);
        }
        return identity();
      }
      case 'c': {
        const l = t[this.pos + 1];
        if (l !== undefined && /[A-Za-z]/.test(l)) {
          this.pos += 2;
          return done('controlLetter', l.charCodeAt(0) % 32, { c: l });
        }
        if (this.unicode) this.fail('invalidEscape', start);
        // Annex B: バックスラッシュ自体をリテラルとして扱う
        return done('escapedLiteral', 0x5c, { c: '\\' });
      }
      case 'p':
      case 'P': {
        if (!this.unicode) return identity();
        const m = /^[pP]\{([^}]*)\}/.exec(t.slice(this.pos));
        if (!m || m[1] === '') this.fail('invalidEscape', start);
        this.pos += m[0].length;
        return done(c === 'p' ? 'unicodeProp' : 'notUnicodeProp', null, {
          name: m[1],
        });
      }
      case 'k': {
        if (inClass || (!this.unicode && this.names.size === 0)) {
          if (this.unicode) this.fail('invalidEscape', start);
          return identity();
        }
        const m = /^k<([^>]*)>/.exec(t.slice(this.pos));
        if (!m || !NAME_RE.test(m[1])) this.fail('invalidGroupName', start);
        if (!this.names.has(m[1])) this.fail('undefinedGroupName', start);
        this.pos += m[0].length;
        return done('namedBackref', null, { name: m[1] });
      }
      default:
        break;
    }

    if (c >= '0' && c <= '9') {
      if (c === '0' && !/[0-9]/.test(t[this.pos + 1] ?? '')) {
        this.pos++;
        return done('escNul', 0);
      }
      if (c !== '0' && !inClass) {
        const m = /^\d+/.exec(t.slice(this.pos))!;
        const n = Number(m[0]);
        if (n <= this.totalGroups) {
          this.pos += m[0].length;
          return done('backref', null, { n: String(n) });
        }
      }
      if (this.unicode) this.fail('invalidBackref', start);
      // Annex B: レガシー8進エスケープ / 恒等エスケープ
      if (c === '8' || c === '9') return identity();
      const m = /^[0-7]{1,3}/.exec(t.slice(this.pos))!;
      let digits = m[0];
      if (parseInt(digits, 8) > 0o377) digits = digits.slice(0, 2);
      this.pos += digits.length;
      return cpItem(parseInt(digits, 8));
    }

    if (this.unicode) {
      const allowed = '^$\\.*+?()[]{}|/' + (inClass ? '-' : '');
      if (!allowed.includes(c)) this.fail('invalidEscape', start);
    }
    return identity();
  }
}

export function checkFlags(flags: string): {
  valid: string[];
  error: FlagError | null;
} {
  const valid: string[] = [];
  let error: FlagError | null = null;
  for (let i = 0; i < flags.length; i++) {
    const ch = flags[i];
    if (!FLAG_LETTERS.includes(ch)) {
      error ??= { code: 'invalidFlag', index: i, char: ch };
    } else if (valid.includes(ch)) {
      error ??= { code: 'duplicateFlag', index: i, char: ch };
    } else {
      valid.push(ch);
    }
  }
  if (!error && valid.includes('u') && valid.includes('v')) {
    error = { code: 'flagUV', index: flags.indexOf('v'), char: 'v' };
  }
  return { valid, error };
}

/** `/pattern/flags` 形式なら分解する。そうでなければ null */
export function splitRegexLiteral(
  input: string,
): { pattern: string; flags: string } | null {
  const m = /^\/([\s\S]+)\/([dgimsuvy]*)$/.exec(input.trim());
  return m ? { pattern: m[1], flags: m[2] } : null;
}

export function explainRegex(pattern: string, flagsInput = ''): ExplainResult {
  const { valid, error: flagError } = checkFlags(flagsInput);
  const unicode = valid.includes('u') || valid.includes('v');
  const parser = new Parser(pattern, unicode);
  let error: RegexError | null = null;
  try {
    parser.run();
  } catch (e) {
    if (e instanceof RegexParseError) {
      error = { code: e.code, index: e.index };
    } else {
      throw e;
    }
  }
  if (!error && !flagError) {
    try {
      new RegExp(pattern, valid.join(''));
    } catch (e) {
      error = {
        code: 'native',
        index: -1,
        detail: e instanceof Error ? e.message : String(e),
      };
    }
  }
  const ok = !error && !flagError;
  return {
    ok,
    tokens: ok ? parser.tokens : [],
    error,
    flagError,
    flags: valid,
    groupCount: parser.groupCount,
    groupNames: parser.groupNames,
  };
}

/** 説明文テンプレートの {key} を置換する */
export function fillTemplate(
  template: string,
  values: Record<string, string>,
): string {
  return template.replace(/\{(\w+)\}/g, (_, k: string) => values[k] ?? '');
}
