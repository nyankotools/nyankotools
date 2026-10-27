/**
 * 結果の履歴（16.9）。localStorage に1つのキーで全テーマ分を持つ。
 * 保存するのはテーマID・共有コード・日時だけで、名前は保存しない（共有コードから結果を再現できる）。
 * ここは純粋関数のみ。storage の読み書き（try/catch）は呼び出し側で行う。
 */
import { parseShareCode } from './codec';

export const HISTORY_KEY = 'shindan:history';
export const HISTORY_MAX = 20;

export type HistoryEntry = {
  themeId: string;
  code: string;
  /** 保存した日時（エポックミリ秒） */
  at: number;
};

function isEntry(value: unknown): value is HistoryEntry {
  if (typeof value !== 'object' || value === null) return false;
  const { themeId, code, at } = value as Record<string, unknown>;
  return (
    typeof themeId === 'string' &&
    /^[a-z0-9-]+$/.test(themeId) &&
    typeof code === 'string' &&
    parseShareCode(code) !== null &&
    typeof at === 'number' &&
    Number.isFinite(at) &&
    // Date で表せる範囲（外れると「Invalid Date」と表示されるため）
    Math.abs(at) <= 8.64e15
  );
}

/** 保存された文字列を読む。壊れた値・形式の違う項目は捨てる（例外は出さない） */
export function parseHistory(raw: string | null): HistoryEntry[] {
  if (!raw) return [];
  let value: unknown;
  try {
    value = JSON.parse(raw);
  } catch {
    return [];
  }
  if (!Array.isArray(value)) return [];
  const seen = new Set<string>();
  const entries: HistoryEntry[] = [];
  for (const item of value) {
    if (!isEntry(item)) continue;
    const key = `${item.themeId}|${item.code}`;
    if (seen.has(key)) continue;
    seen.add(key);
    entries.push({ themeId: item.themeId, code: item.code, at: item.at });
    if (entries.length >= HISTORY_MAX) break;
  }
  return entries;
}

/** 先頭に追加する。同じ結果（テーマ・コード）が既にあれば先頭へ移し、上限を超えた古いものは捨てる */
export function addHistory(
  entries: readonly HistoryEntry[],
  entry: HistoryEntry,
): HistoryEntry[] {
  return [
    entry,
    ...entries.filter(
      (e) => !(e.themeId === entry.themeId && e.code === entry.code),
    ),
  ].slice(0, HISTORY_MAX);
}

export function removeHistory(
  entries: readonly HistoryEntry[],
  themeId: string,
  code: string,
): HistoryEntry[] {
  return entries.filter((e) => !(e.themeId === themeId && e.code === code));
}
