/**
 * 数式パーサー（関数グラフ・電卓で共有）。`eval` / `new Function` は使わず、
 * トークナイザ → 再帰下降パーサー → クロージャにコンパイル、の順で評価する。
 *
 * 対応: + - * / ^ （右結合）、単項 +/-、後置 ! と %、暗黙の乗算（2x, 2(x+1), 2pi）、
 * 全角の数字・英字・演算子（× ÷ − ＋ ＾ 等。NFKC で半角化）、関数呼び出し、定数、変数。
 */

export type AngleMode = 'rad' | 'deg';

export type ParseErrorCode =
  'empty' | 'syntax' | 'paren' | 'unknownName' | 'arity' | 'tooLong';

export interface CompileOptions {
  /** 三角関数の角度単位（既定: rad） */
  angle?: AngleMode;
  /** 使用を許可する変数名（例: ['x'], ['ans']） */
  variables?: readonly string[];
}

export type Scope = Readonly<Record<string, number>>;

export type CompileResult =
  | { ok: true; evaluate: (scope?: Scope) => number }
  | { ok: false; error: ParseErrorCode; position: number };

export const MAX_EXPRESSION_LENGTH = 500;

const CONSTANTS: Record<string, number> = {
  pi: Math.PI,
  π: Math.PI,
  e: Math.E,
  tau: Math.PI * 2,
};

interface FunctionDef {
  min: number;
  max: number;
  /** angle: 'in' = 引数が角度、'out' = 戻り値が角度 */
  angle?: 'in' | 'out';
  fn: (...args: number[]) => number;
}

export function factorial(n: number): number {
  if (!Number.isInteger(n) || n < 0 || n > 170) return NaN;
  let r = 1;
  for (let i = 2; i <= n; i++) r *= i;
  return r;
}

const FUNCTIONS: Record<string, FunctionDef> = {
  sin: { min: 1, max: 1, angle: 'in', fn: Math.sin },
  cos: { min: 1, max: 1, angle: 'in', fn: Math.cos },
  tan: { min: 1, max: 1, angle: 'in', fn: Math.tan },
  asin: { min: 1, max: 1, angle: 'out', fn: Math.asin },
  acos: { min: 1, max: 1, angle: 'out', fn: Math.acos },
  atan: { min: 1, max: 1, angle: 'out', fn: Math.atan },
  atan2: { min: 2, max: 2, angle: 'out', fn: Math.atan2 },
  sinh: { min: 1, max: 1, fn: Math.sinh },
  cosh: { min: 1, max: 1, fn: Math.cosh },
  tanh: { min: 1, max: 1, fn: Math.tanh },
  sqrt: { min: 1, max: 1, fn: Math.sqrt },
  cbrt: { min: 1, max: 1, fn: Math.cbrt },
  abs: { min: 1, max: 1, fn: Math.abs },
  exp: { min: 1, max: 1, fn: Math.exp },
  ln: { min: 1, max: 1, fn: Math.log },
  log: {
    min: 1,
    max: 2,
    fn: (x, b) => (b === undefined ? Math.log10(x) : Math.log(x) / Math.log(b)),
  },
  log10: { min: 1, max: 1, fn: Math.log10 },
  log2: { min: 1, max: 1, fn: Math.log2 },
  floor: { min: 1, max: 1, fn: Math.floor },
  ceil: { min: 1, max: 1, fn: Math.ceil },
  round: { min: 1, max: 1, fn: Math.round },
  trunc: { min: 1, max: 1, fn: Math.trunc },
  sign: { min: 1, max: 1, fn: Math.sign },
  fact: { min: 1, max: 1, fn: factorial },
  pow: { min: 2, max: 2, fn: Math.pow },
  mod: { min: 2, max: 2, fn: (a, b) => ((a % b) + b) % b },
  min: { min: 1, max: 8, fn: Math.min },
  max: { min: 1, max: 8, fn: Math.max },
};

/** 定数名の一覧（補完用。全角の π は除く） */
export const CONSTANT_NAMES: readonly string[] = Object.keys(CONSTANTS).filter(
  (n) => n !== 'π',
);

/** 関数名の一覧（補完・ヘルプ表示用） */
export const FUNCTION_NAMES: readonly string[] = Object.keys(FUNCTIONS);

type Token =
  | { kind: 'num'; value: number; pos: number }
  | { kind: 'id'; name: string; pos: number }
  | { kind: 'op'; op: string; pos: number }
  | { kind: 'end'; pos: number };

class ParseError extends Error {
  constructor(
    readonly code: ParseErrorCode,
    readonly position: number,
  ) {
    super(code);
  }
}

const OP_ALIASES: Record<string, string> = {
  '×': '*',
  '·': '*',
  '⋅': '*',
  '＊': '*',
  '÷': '/',
  '／': '/',
  '−': '-',
  '–': '-',
  '－': '-',
  '＋': '+',
  '＾': '^',
  '（': '(',
  '）': ')',
  '，': ',',
  '、': ',',
  '！': '!',
  '％': '%',
  '√': 'sqrt',
};

function tokenize(src: string): Token[] {
  const tokens: Token[] = [];
  let i = 0;
  const s = src.normalize('NFKC');
  while (i < s.length) {
    const ch = s[i];
    if (/\s/.test(ch)) {
      i++;
      continue;
    }
    const num = /^(?:\d+\.?\d*|\.\d+)(?:[eE][+-]?\d+)?/.exec(s.slice(i));
    if (num) {
      tokens.push({ kind: 'num', value: Number(num[0]), pos: i });
      i += num[0].length;
      continue;
    }
    const id = /^[A-Za-z_π][A-Za-z_0-9]*/.exec(s.slice(i));
    if (id) {
      tokens.push({ kind: 'id', name: id[0].toLowerCase(), pos: i });
      i += id[0].length;
      continue;
    }
    const op = OP_ALIASES[ch] ?? ch;
    if (op === 'sqrt') {
      tokens.push({ kind: 'id', name: 'sqrt', pos: i });
      i++;
      continue;
    }
    if (/^[+\-*/^(),!%]$/.test(op)) {
      tokens.push({ kind: 'op', op, pos: i });
      i++;
      continue;
    }
    throw new ParseError('syntax', i);
  }
  tokens.push({ kind: 'end', pos: s.length });
  return tokens;
}

type Node = (scope: Scope) => number;

class Parser {
  private index = 0;

  constructor(
    private readonly tokens: Token[],
    private readonly angle: AngleMode,
    private readonly variables: ReadonlySet<string>,
  ) {}

  private get tok(): Token {
    return this.tokens[this.index];
  }

  private isOp(op: string): boolean {
    const t = this.tok;
    return t.kind === 'op' && t.op === op;
  }

  parseAll(): Node {
    if (this.tokens[0].kind === 'end') throw new ParseError('empty', 0);
    const node = this.parseSum();
    const rest = this.tok;
    if (rest.kind !== 'end') {
      throw new ParseError(this.isOp(')') ? 'paren' : 'syntax', rest.pos);
    }
    return node;
  }

  private parseSum(): Node {
    let left = this.parseTerm();
    while (this.isOp('+') || this.isOp('-')) {
      const plus = this.isOp('+');
      this.index++;
      const l = left;
      const r = this.parseTerm();
      left = plus ? (s) => l(s) + r(s) : (s) => l(s) - r(s);
    }
    return left;
  }

  /** 暗黙の乗算の開始になれるトークンか */
  private startsFactor(): boolean {
    const t = this.tok;
    return (
      t.kind === 'num' || t.kind === 'id' || (t.kind === 'op' && t.op === '(')
    );
  }

  private parseTerm(): Node {
    let left = this.parseUnary();
    for (;;) {
      if (this.isOp('*') || this.isOp('/')) {
        const mul = this.isOp('*');
        this.index++;
        const l = left;
        const r = this.parseUnary();
        left = mul ? (s) => l(s) * r(s) : (s) => l(s) / r(s);
      } else if (this.startsFactor()) {
        const l = left;
        const r = this.parsePower();
        left = (s) => l(s) * r(s);
      } else {
        return left;
      }
    }
  }

  private parseUnary(): Node {
    if (this.isOp('-')) {
      this.index++;
      const n = this.parseUnary();
      return (s) => -n(s);
    }
    if (this.isOp('+')) {
      this.index++;
      return this.parseUnary();
    }
    return this.parsePower();
  }

  private parsePower(): Node {
    const base = this.parsePostfix();
    if (this.isOp('^')) {
      this.index++;
      // 右結合。指数の先頭には単項符号を許す（2^-3）
      const exp = this.parseUnary();
      return (s) => Math.pow(base(s), exp(s));
    }
    return base;
  }

  private parsePostfix(): Node {
    let node = this.parsePrimary();
    for (;;) {
      if (this.isOp('!')) {
        this.index++;
        const n = node;
        node = (s) => factorial(n(s));
      } else if (this.isOp('%')) {
        this.index++;
        const n = node;
        node = (s) => n(s) / 100;
      } else {
        return node;
      }
    }
  }

  private parsePrimary(): Node {
    const t = this.tok;
    if (t.kind === 'num') {
      this.index++;
      const v = t.value;
      return () => v;
    }
    if (t.kind === 'op' && t.op === '(') {
      this.index++;
      // "(" で入力が終わった場合は式の不完全さより括弧の閉じ忘れを指摘する
      if (this.tok.kind === 'end') throw new ParseError('paren', t.pos);
      const inner = this.parseSum();
      this.expectClose(t.pos);
      return inner;
    }
    if (t.kind === 'id') {
      this.index++;
      const def = Object.hasOwn(FUNCTIONS, t.name)
        ? FUNCTIONS[t.name]
        : undefined;
      if (def && this.isOp('(')) return this.parseCall(def, t.pos);
      if (t.name === 'sqrt' && def && !this.isOp('(')) {
        // √2 のように括弧なしの平方根
        const arg = this.parsePostfix();
        return (s) => Math.sqrt(arg(s));
      }
      if (this.variables.has(t.name)) {
        const name = t.name;
        return (s) => s[name] ?? NaN;
      }
      if (Object.hasOwn(CONSTANTS, t.name)) {
        const v = CONSTANTS[t.name];
        return () => v;
      }
      throw new ParseError(def ? 'syntax' : 'unknownName', t.pos);
    }
    throw new ParseError('syntax', t.pos);
  }

  private expectClose(openPos: number): void {
    if (!this.isOp(')')) throw new ParseError('paren', openPos);
    this.index++;
  }

  private parseCall(def: FunctionDef, pos: number): Node {
    const open = this.tok.pos;
    this.index++; // (
    if (this.tok.kind === 'end') throw new ParseError('paren', open);
    const args: Node[] = [];
    if (!this.isOp(')')) {
      args.push(this.parseSum());
      while (this.isOp(',')) {
        this.index++;
        args.push(this.parseSum());
      }
    }
    this.expectClose(open);
    if (args.length < def.min || args.length > def.max)
      throw new ParseError('arity', pos);
    const toRad = this.angle === 'deg' ? Math.PI / 180 : 1;
    const { fn } = def;
    if (def.angle === 'in') {
      const a = args[0];
      return (s) => fn(a(s) * toRad);
    }
    if (def.angle === 'out') {
      return (s) => fn(...args.map((a) => a(s))) / toRad;
    }
    if (args.length === 1) {
      const a = args[0];
      return (s) => fn(a(s));
    }
    return (s) => fn(...args.map((a) => a(s)));
  }
}

/** 式をコンパイルする。失敗時は原因コードと文字位置を返す（文言は呼び出し側が持つ） */
export function compileExpression(
  src: string,
  options: CompileOptions = {},
): CompileResult {
  if (src.length > MAX_EXPRESSION_LENGTH)
    return { ok: false, error: 'tooLong', position: 0 };
  try {
    const tokens = tokenize(src);
    const parser = new Parser(
      tokens,
      options.angle ?? 'rad',
      new Set((options.variables ?? []).map((v) => v.toLowerCase())),
    );
    const node = parser.parseAll();
    return { ok: true, evaluate: (scope = {}) => node(scope) };
  } catch (e) {
    if (e instanceof ParseError)
      return { ok: false, error: e.code, position: e.position };
    if (e instanceof RangeError)
      return { ok: false, error: 'syntax', position: 0 };
    throw e;
  }
}
