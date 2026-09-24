const FAVORITES_KEY = 'favorite-tools';

function readFavorites(): string[] {
  try {
    const raw = localStorage.getItem(FAVORITES_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((item): item is string => typeof item === 'string');
  } catch {
    // localStorageが使えない環境や壊れたデータの場合は「お気に入りなし」として扱う
    return [];
  }
}

function writeFavorites(slugs: string[]): void {
  try {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(slugs));
  } catch {
    // localStorageが使えない環境では保存せず今回の表示だけ反映する
  }
}

export function getFavoriteSlugs(): string[] {
  return readFavorites();
}

export function isFavorite(slug: string): boolean {
  return readFavorites().includes(slug);
}

/** お気に入り状態をトグルし、トグル後の状態（true=登録済み）を返す */
export function toggleFavorite(slug: string): boolean {
  const current = readFavorites();
  const isCurrentlyFavorite = current.includes(slug);
  const next = isCurrentlyFavorite
    ? current.filter((s) => s !== slug)
    : [...current, slug];
  writeFavorites(next);
  return !isCurrentlyFavorite;
}

/** お気に入りの並び順を1つ前後に入れ替え、変更後の並び順を返す（対象外・端の場合は変更なし） */
export function moveFavorite(slug: string, direction: 'up' | 'down'): string[] {
  const current = readFavorites();
  const index = current.indexOf(slug);
  const targetIndex = direction === 'up' ? index - 1 : index + 1;
  if (index === -1 || targetIndex < 0 || targetIndex >= current.length) {
    return current;
  }
  const next = [...current];
  [next[index], next[targetIndex]] = [next[targetIndex], next[index]];
  writeFavorites(next);
  return next;
}
