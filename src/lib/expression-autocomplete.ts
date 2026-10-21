import { CONSTANT_NAMES, FUNCTION_NAMES } from './expression-parser';

export type CompletionKind = 'variable' | 'constant' | 'function';

export interface Completion {
  /** 候補の表示名（関数は括弧なし） */
  name: string;
  kind: CompletionKind;
  /** 確定時に入力欄へ入れる文字列。関数は開き括弧まで入れる */
  insert: string;
}

export interface WordAtCursor {
  /** 単語の開始位置（入力欄の文字インデックス） */
  start: number;
  /** カーソル位置（単語の終端） */
  end: number;
  prefix: string;
}

/** 候補の最大表示件数 */
export const MAX_SUGGESTIONS = 8;

/** カーソル直前にある識別子（英字・_ で始まり英数字・_ が続く）を返す。なければ null */
export function wordAtCursor(
  text: string,
  cursor: number,
): WordAtCursor | null {
  const end = Math.min(Math.max(cursor, 0), text.length);
  const m = /[A-Za-z_][A-Za-z0-9_]*$/.exec(text.slice(0, end));
  if (!m) return null;
  return { start: end - m[0].length, end, prefix: m[0] };
}

/** 前方一致する候補を、変数 → 定数 → 関数の順で返す。入力済みの名前と完全に同じだけなら空 */
export function suggestCompletions(
  prefix: string,
  variables: readonly string[] = [],
): Completion[] {
  const p = prefix.toLowerCase();
  if (p === '') return [];
  const all: Completion[] = [
    ...variables.map((name) => ({
      name,
      kind: 'variable' as const,
      insert: name,
    })),
    ...CONSTANT_NAMES.map((name) => ({
      name,
      kind: 'constant' as const,
      insert: name,
    })),
    ...FUNCTION_NAMES.map((name) => ({
      name,
      kind: 'function' as const,
      insert: `${name}(`,
    })),
  ];
  return all
    .filter((c) => c.name.startsWith(p))
    .filter((c) => c.insert.toLowerCase() !== p)
    .slice(0, MAX_SUGGESTIONS);
}

/** 候補を確定した後の文字列とカーソル位置を返す */
export function applyCompletion(
  text: string,
  word: WordAtCursor,
  completion: Completion,
): { text: string; cursor: number } {
  // カーソルが単語の途中にあるときは、後ろに続く識別子文字も置き換える
  const tail = /^[A-Za-z0-9_]*/.exec(text.slice(word.end))![0].length;
  const next =
    text.slice(0, word.start) + completion.insert + text.slice(word.end + tail);
  return { text: next, cursor: word.start + completion.insert.length };
}
