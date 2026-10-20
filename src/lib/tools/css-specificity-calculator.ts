// CSS詳細度（specificity）計算。外部依存なしの自前トークナイザ。
// 詳細度は [a, b, c] = [IDセレクタ数, クラス・属性・疑似クラス数, 要素・疑似要素数]。

export type Specificity = [number, number, number];

export type SpecificityErrorCode =
  | 'empty'
  | 'unclosedBracket'
  | 'unclosedParen'
  | 'unclosedString'
  | 'unexpectedChar'
  | 'emptyName'
  | 'danglingCombinator'
  | 'unmatchedParen'
  | 'emptyAttribute';

export interface SpecificityError {
  code: SpecificityErrorCode;
  /** エラーに関係する文字（unexpectedChar 等）。 */
  detail?: string;
}

export type SelectorResult =
  { ok: true; spec: Specificity } | ({ ok: false } & SpecificityError);

export interface SelectorRow {
  /** 入力上の行番号（1始まり）。 */
  line: number;
  selector: string;
  result: SelectorResult;
}

export interface AnalysisResult {
  rows: SelectorRow[];
  /** 勝つ行の rows 内インデックス。有効なセレクタが無ければ null。 */
  winnerIndex: number | null;
  /** 勝者と同じ詳細度の有効な行が他にもあるか（同点のため後勝ち）。 */
  tie: boolean;
  /** &の親セレクタが不正な場合のエラー。 */
  parentError: SpecificityError | null;
}

class SpecError extends Error {
  code: SpecificityErrorCode;
  detail?: string;
  constructor(code: SpecificityErrorCode, detail?: string) {
    super(code);
    this.code = code;
    this.detail = detail;
  }
}

interface Ctx {
  parent: Specificity | null;
}

const ZERO: Specificity = [0, 0, 0];

export function compareSpecificity(x: Specificity, y: Specificity): number {
  for (let i = 0; i < 3; i++) {
    if (x[i] !== y[i]) return x[i] > y[i] ? 1 : -1;
  }
  return 0;
}

export function formatSpecificity(s: Specificity): string {
  return `(${s[0]}, ${s[1]}, ${s[2]})`;
}

function add(x: Specificity, y: Specificity): Specificity {
  return [x[0] + y[0], x[1] + y[1], x[2] + y[2]];
}

function maxSpec(list: Specificity[]): Specificity {
  let best: Specificity = ZERO;
  for (const s of list) if (compareSpecificity(s, best) > 0) best = s;
  return best;
}

function isIdentChar(ch: string): boolean {
  return (
    /[A-Za-z0-9_-]/.test(ch) || (ch.charCodeAt(0) >= 0x80 && !/\s/.test(ch))
  );
}

function isIdentStart(ch: string): boolean {
  return (
    /[A-Za-z_-]/.test(ch) ||
    (ch.charCodeAt(0) >= 0x80 && !/\s/.test(ch)) ||
    ch === '\\'
  );
}

function readIdent(s: string, i: number): number {
  let j = i;
  while (j < s.length) {
    const ch = s[j];
    if (ch === '\\') {
      if (j + 1 >= s.length) throw new SpecError('unexpectedChar', '\\');
      j += 2;
    } else if (isIdentChar(ch)) {
      j++;
    } else break;
  }
  if (j === i) throw new SpecError('emptyName');
  return j;
}

/** s[i] が ( か [ のとき、対応する閉じ括弧の次の位置を返す。 */
function skipBalanced(s: string, i: number): number {
  const stack: string[] = [];
  let j = i;
  while (j < s.length) {
    const ch = s[j];
    if (ch === '\\') {
      j += 2;
      continue;
    }
    if (ch === '"' || ch === "'") {
      j++;
      while (j < s.length && s[j] !== ch) j += s[j] === '\\' ? 2 : 1;
      if (j >= s.length) throw new SpecError('unclosedString');
      j++;
      continue;
    }
    if (ch === '(' || ch === '[') {
      stack.push(ch === '(' ? ')' : ']');
    } else if (ch === ')' || ch === ']') {
      const expected = stack.pop();
      if (expected !== ch) {
        throw new SpecError(
          stack.length === 0 && expected === undefined
            ? 'unmatchedParen'
            : expected === ']'
              ? 'unclosedBracket'
              : 'unclosedParen',
        );
      }
      if (stack.length === 0) return j + 1;
    }
    j++;
  }
  throw new SpecError(s[i] === '[' ? 'unclosedBracket' : 'unclosedParen');
}

/** 最上位のカンマで分割する（括弧・属性・文字列内は無視）。 */
function splitTopLevel(s: string): string[] {
  const parts: string[] = [];
  let depth = 0;
  let start = 0;
  let j = 0;
  while (j < s.length) {
    const ch = s[j];
    if (ch === '\\') {
      j += 2;
      continue;
    }
    if (ch === '"' || ch === "'") {
      j++;
      while (j < s.length && s[j] !== ch) j += s[j] === '\\' ? 2 : 1;
      if (j >= s.length) throw new SpecError('unclosedString');
    } else if (ch === '(' || ch === '[') {
      depth++;
    } else if (ch === ')' || ch === ']') {
      depth--;
      if (depth < 0) throw new SpecError('unmatchedParen');
    } else if (ch === ',' && depth === 0) {
      parts.push(s.slice(start, j));
      start = j + 1;
    }
    j++;
  }
  parts.push(s.slice(start));
  return parts;
}

function listSpecificity(
  s: string,
  ctx: Ctx,
  relative: boolean,
  allowLeading: boolean,
  implicitParent = false,
): Specificity {
  const parts = splitTopLevel(s);
  return maxSpec(
    parts.map((p) =>
      complexSpecificity(p, ctx, relative || allowLeading, implicitParent),
    ),
  );
}

const LEGACY_PSEUDO_ELEMENTS = new Set([
  'before',
  'after',
  'first-line',
  'first-letter',
]);
const MAX_ARG_PSEUDOS = new Set([
  'is',
  'not',
  'has',
  'matches',
  '-webkit-any',
  '-moz-any',
  'any',
]);
const NTH_OF_PSEUDOS = new Set(['nth-child', 'nth-last-child']);
const HOST_PSEUDOS = new Set(['host', 'host-context']);

function complexSpecificity(
  s: string,
  ctx: Ctx,
  allowLeadingCombinator: boolean,
  implicitParent = false,
): Specificity {
  if (s.trim() === '') throw new SpecError('empty');
  let total: Specificity = [0, 0, 0];
  let needCompound = false;
  let seenAny = false;
  let sawAmp = false;
  const n = s.length;
  let i = 0;

  const mark = () => {
    needCompound = false;
    seenAny = true;
  };
  const combinator = (len: number) => {
    if (needCompound) throw new SpecError('danglingCombinator');
    if (!seenAny && !allowLeadingCombinator) {
      throw new SpecError('danglingCombinator');
    }
    needCompound = true;
    i += len;
  };
  const nsFollows = (j: number) =>
    s[j] === '|' && s[j + 1] !== '|' && s[j + 1] !== '=';

  while (i < n) {
    const ch = s[i];
    if (/\s/.test(ch)) {
      i++;
    } else if (ch === '>' || ch === '+' || ch === '~') {
      combinator(1);
    } else if (ch === '|' && s[i + 1] === '|') {
      combinator(2);
    } else if (ch === '|') {
      i++;
      mark();
    } else if (ch === '*') {
      i++;
      if (nsFollows(i)) i++;
      mark();
    } else if (ch === '&') {
      sawAmp = true;
      if (ctx.parent) total = add(total, ctx.parent);
      i++;
      mark();
    } else if (ch === '#') {
      if (i + 1 >= s.length || !isIdentStart(s[i + 1]))
        throw new SpecError('emptyName');
      i = readIdent(s, i + 1);
      total = add(total, [1, 0, 0]);
      mark();
    } else if (ch === '.') {
      if (i + 1 >= s.length || !isIdentStart(s[i + 1]))
        throw new SpecError('emptyName');
      i = readIdent(s, i + 1);
      total = add(total, [0, 1, 0]);
      mark();
    } else if (ch === '[') {
      const end = skipBalanced(s, i);
      if (s.slice(i + 1, end - 1).trim() === '') {
        throw new SpecError('emptyAttribute');
      }
      total = add(total, [0, 1, 0]);
      i = end;
      mark();
    } else if (ch === ':') {
      const isElement = s[i + 1] === ':';
      const nameStart = i + (isElement ? 2 : 1);
      const nameEnd = readIdent(s, nameStart);
      const name = s.slice(nameStart, nameEnd).toLowerCase();
      let args: string | null = null;
      i = nameEnd;
      if (s[i] === '(') {
        const end = skipBalanced(s, i);
        args = s.slice(i + 1, end - 1);
        i = end;
      }
      if (isElement || (args === null && LEGACY_PSEUDO_ELEMENTS.has(name))) {
        total = add(total, [0, 0, 1]);
        if (isElement && name === 'slotted' && args !== null) {
          total = add(total, listSpecificity(args, ctx, false, false));
        }
      } else if (name === 'where' && args !== null) {
        // :where() は常に0。ただし引数の構文は検証する。
        if (args.trim() !== '') listSpecificity(args, ctx, false, false);
      } else if (MAX_ARG_PSEUDOS.has(name) && args !== null) {
        if (args.trim() === '' && name !== 'has' && name !== 'not') {
          // 空の :is() は何にもマッチしないが詳細度は0
        } else {
          total = add(
            total,
            listSpecificity(args, ctx, name === 'has', name === 'has'),
          );
        }
      } else if (NTH_OF_PSEUDOS.has(name) && args !== null) {
        total = add(total, [0, 1, 0]);
        const m = /\sof\s/i.exec(args);
        if (m) {
          const sel = args.slice(m.index + m[0].length);
          total = add(total, listSpecificity(sel, ctx, false, false));
        }
      } else if (HOST_PSEUDOS.has(name) && args !== null) {
        total = add(total, [0, 1, 0]);
        total = add(total, listSpecificity(args, ctx, false, false));
      } else {
        total = add(total, [0, 1, 0]);
      }
      mark();
    } else if (isIdentStart(ch)) {
      const end = readIdent(s, i);
      if (nsFollows(end)) {
        // ns|element の名前空間接頭辞は数えない
        i = end + 1;
      } else {
        total = add(total, [0, 0, 1]);
        i = end;
      }
      mark();
    } else if (ch === ')' || ch === ']') {
      throw new SpecError('unmatchedParen');
    } else {
      throw new SpecError('unexpectedChar', ch);
    }
  }
  if (needCompound) throw new SpecError('danglingCombinator');
  // ネスト内で & を含まないセレクタは先頭に暗黙の & が付く
  if (implicitParent && ctx.parent && !sawAmp) total = add(total, ctx.parent);
  return total;
}

/**
 * セレクタ（カンマ区切りは最大値）の詳細度を計算する。
 * parent を渡すと & を :is(parent) として扱う（CSSネスト）。
 */
export function calculateSpecificity(
  selector: string,
  parent: Specificity | null = null,
): SelectorResult {
  try {
    const ctx: Ctx = { parent };
    const spec = listSpecificity(selector, ctx, false, parent !== null, true);
    return { ok: true, spec };
  } catch (e) {
    if (e instanceof SpecError) {
      return { ok: false, code: e.code, detail: e.detail };
    }
    throw e;
  }
}

/** 1行1セレクタのテキストを解析し、比較・勝敗判定まで行う。 */
export function analyzeSelectors(
  text: string,
  parentSelector = '',
): AnalysisResult {
  let parent: Specificity | null = null;
  let parentError: SpecificityError | null = null;
  if (parentSelector.trim() !== '') {
    const p = calculateSpecificity(parentSelector);
    if (p.ok) parent = p.spec;
    else parentError = { code: p.code, detail: p.detail };
  }

  const rows: SelectorRow[] = [];
  text.split(/\r\n|\r|\n/).forEach((raw, idx) => {
    const selector = raw.trim();
    if (selector === '') return;
    rows.push({
      line: idx + 1,
      selector,
      result: calculateSpecificity(selector, parent),
    });
  });

  let winnerIndex: number | null = null;
  let bestSpec: Specificity | null = null;
  for (let i = 0; i < rows.length; i++) {
    const res = rows[i].result;
    if (!res.ok) continue;
    // 同点は後勝ち（>= 0）
    if (bestSpec === null || compareSpecificity(res.spec, bestSpec) >= 0) {
      bestSpec = res.spec;
      winnerIndex = i;
    }
  }

  let tie = false;
  if (winnerIndex !== null && bestSpec !== null) {
    const w: Specificity = bestSpec;
    const wi: number = winnerIndex;
    tie = rows.some((r, i) => {
      const res = r.result;
      return i !== wi && res.ok && compareSpecificity(res.spec, w) === 0;
    });
  }

  return { rows, winnerIndex, tie, parentError };
}
