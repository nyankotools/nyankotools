import { getToolSlug } from './analytics';

const RECENT_KEY = 'recent-tools';

/** 保持する最大件数。トップの「最近使ったツール」とコマンドパレットの先頭に出す */
export const RECENT_LIMIT = 8;

/** slug を先頭に移して重複を除き、上限件数に切り詰めた新しい履歴を返す（純関数） */
export function pushRecent(
  current: string[],
  slug: string,
  limit = RECENT_LIMIT,
): string[] {
  return [slug, ...current.filter((s) => s !== slug)].slice(0, limit);
}

/** 最近使ったツールのslug（新しい順）。localStorageが使えない・壊れている場合は空 */
export function getRecentSlugs(): string[] {
  try {
    const raw = localStorage.getItem(RECENT_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter((item): item is string => typeof item === 'string')
      .slice(0, RECENT_LIMIT);
  } catch {
    return [];
  }
}

/** 表示中のページがツールページなら、そのツールを履歴の先頭に記録する */
export function recordRecentTool(): void {
  const slug = getToolSlug();
  if (!slug) return;
  try {
    localStorage.setItem(
      RECENT_KEY,
      JSON.stringify(pushRecent(getRecentSlugs(), slug)),
    );
  } catch {
    // localStorageが使えない環境では記録しない
  }
}
