import {
  compileExpression,
  type AngleMode,
  type ParseErrorCode,
} from '../expression-parser';

export type { AngleMode };

/** 計算エラーのコード（文言は辞書側） */
export type CalcErrorCode = ParseErrorCode | 'undefined' | 'overflow';

export type CalcResult =
  | { ok: true; value: number; text: string }
  | { ok: false; error: CalcErrorCode; position: number };

/** 履歴の最大件数 */
export const HISTORY_LIMIT = 20;

/** 有効桁数（0.1+0.2 のような浮動小数点誤差を隠す） */
export const SIGNIFICANT_DIGITS = 12;

/** 有効桁数に丸める。-0 は 0 にする */
export function roundSignificant(
  n: number,
  digits = SIGNIFICANT_DIGITS,
): number {
  // 整数は浮動小数点誤差ではなく正確な値なので丸めない（20! など）
  if (!Number.isFinite(n) || Number.isInteger(n)) return n;
  const r = Number(n.toPrecision(digits));
  return r === 0 ? 0 : r;
}

/** 丸めた値を表示用の文字列にする */
export function formatResult(n: number): string {
  return String(roundSignificant(n));
}

const TRIG = /(?:^|[^a-z])(?:sin|cos|tan)h?\s*\(/i;

/** 式を評価する。ans は直前の結果（なければ 0） */
export function calculate(
  expression: string,
  angle: AngleMode,
  ans = 0,
): CalcResult {
  const compiled = compileExpression(expression, {
    angle,
    variables: ['ans'],
  });
  if (!compiled.ok) {
    return { ok: false, error: compiled.error, position: compiled.position };
  }
  const raw = compiled.evaluate({ ans });
  if (Number.isNaN(raw)) return { ok: false, error: 'undefined', position: 0 };
  if (!Number.isFinite(raw)) {
    return { ok: false, error: 'overflow', position: 0 };
  }
  let value = roundSignificant(raw);
  // sin(π) などの 1e-16 程度の丸め誤差を 0 として扱う
  if (
    TRIG.test(expression) &&
    !/\d[eE][+-]?\d/.test(expression) &&
    Math.abs(value) < 1e-14
  )
    value = 0;
  if (!Number.isFinite(value)) {
    return { ok: false, error: 'overflow', position: 0 };
  }
  return { ok: true, value, text: String(value) };
}

/** 入力欄の選択範囲を置き換えて挿入し、新しいテキストとカーソル位置を返す */
export function insertAt(
  text: string,
  selectionStart: number,
  selectionEnd: number,
  insert: string,
): { text: string; cursor: number } {
  const len = text.length;
  const start = Math.min(Math.max(selectionStart, 0), len);
  const end = Math.min(Math.max(selectionEnd, start), len);
  return {
    text: text.slice(0, start) + insert + text.slice(end),
    cursor: start + insert.length,
  };
}

/** カーソルの直前の1文字（選択があれば選択範囲）を削除する */
export function backspaceAt(
  text: string,
  selectionStart: number,
  selectionEnd: number,
): { text: string; cursor: number } {
  const len = text.length;
  const start = Math.min(Math.max(selectionStart, 0), len);
  const end = Math.min(Math.max(selectionEnd, start), len);
  if (end > start) {
    return { text: text.slice(0, start) + text.slice(end), cursor: start };
  }
  if (start === 0) return { text, cursor: 0 };
  return {
    text: text.slice(0, start - 1) + text.slice(end),
    cursor: start - 1,
  };
}

export interface HistoryEntry {
  expression: string;
  result: string;
}

/** 履歴の先頭に追加する（直前と同一なら重複させず、最大 HISTORY_LIMIT 件） */
export function pushHistory(
  history: readonly HistoryEntry[],
  entry: HistoryEntry,
  limit = HISTORY_LIMIT,
): HistoryEntry[] {
  const first = history[0];
  const rest =
    first &&
    first.expression === entry.expression &&
    first.result === entry.result
      ? history.slice(1)
      : history;
  return [entry, ...rest].slice(0, Math.max(limit, 0));
}

export type PadAction = 'insert' | 'clear' | 'backspace' | 'equals';

export interface PadKey {
  id: string;
  /** ボタンの表示 */
  label: string;
  action: PadAction;
  /** action が insert のとき挿入する文字列 */
  insert: string;
  /** 2列分の幅にするか */
  wide?: boolean;
}

function ins(id: string, label: string, insert: string, wide = false): PadKey {
  return { id, label, action: 'insert', insert, wide };
}

/** ボタンパッド（5列。行ごとに並べる） */
export const PAD_KEYS: readonly PadKey[] = [
  ins('sin', 'sin', 'sin('),
  ins('cos', 'cos', 'cos('),
  ins('tan', 'tan', 'tan('),
  ins('log', 'log', 'log('),
  ins('ln', 'ln', 'ln('),
  ins('sqrt', '√', 'sqrt('),
  ins('pow', 'xʸ', '^'),
  ins('fact', 'x!', '!'),
  ins('pi', 'π', 'π'),
  ins('e', 'e', 'e'),
  ins('lp', '(', '('),
  ins('rp', ')', ')'),
  ins('pct', '%', '%'),
  ins('ans', 'ans', 'ans'),
  ins('div', '÷', '/'),
  ins('7', '7', '7'),
  ins('8', '8', '8'),
  ins('9', '9', '9'),
  ins('mul', '×', '*'),
  { id: 'clear', label: 'AC', action: 'clear', insert: '' },
  ins('4', '4', '4'),
  ins('5', '5', '5'),
  ins('6', '6', '6'),
  ins('sub', '−', '-'),
  { id: 'back', label: '⌫', action: 'backspace', insert: '' },
  ins('1', '1', '1'),
  ins('2', '2', '2'),
  ins('3', '3', '3'),
  ins('add', '+', '+'),
  ins('comma', ',', ','),
  ins('0', '0', '0', true),
  ins('dot', '.', '.'),
  { id: 'eq', label: '=', action: 'equals', insert: '', wide: true },
];
