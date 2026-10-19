import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  getFavoriteSlugs,
  isFavorite,
  moveFavorite,
  setFavoriteOrder,
  toggleFavorite,
} from './favorites';

class MemoryStorage {
  private store = new Map<string, string>();
  getItem(key: string): string | null {
    return this.store.get(key) ?? null;
  }
  setItem(key: string, value: string): void {
    this.store.set(key, value);
  }
  removeItem(key: string): void {
    this.store.delete(key);
  }
  clear(): void {
    this.store.clear();
  }
}

beforeEach(() => {
  vi.stubGlobal('localStorage', new MemoryStorage());
});

describe('getFavoriteSlugs / isFavorite', () => {
  it('何も登録されていなければ空配列を返す', () => {
    expect(getFavoriteSlugs()).toEqual([]);
    expect(isFavorite('char-counter')).toBe(false);
  });

  it('localStorageの値が配列でない場合は空配列として扱う', () => {
    localStorage.setItem('favorite-tools', JSON.stringify({ foo: 'bar' }));
    expect(getFavoriteSlugs()).toEqual([]);
  });

  it('localStorageの値が壊れたJSONの場合は空配列として扱う', () => {
    localStorage.setItem('favorite-tools', '{not valid json');
    expect(getFavoriteSlugs()).toEqual([]);
  });

  it('文字列以外の要素は除外する', () => {
    localStorage.setItem(
      'favorite-tools',
      JSON.stringify(['char-counter', 1, null]),
    );
    expect(getFavoriteSlugs()).toEqual(['char-counter']);
  });
});

describe('toggleFavorite', () => {
  it('未登録のツールをトグルすると登録され、trueを返す', () => {
    expect(toggleFavorite('char-counter')).toBe(true);
    expect(getFavoriteSlugs()).toEqual(['char-counter']);
    expect(isFavorite('char-counter')).toBe(true);
  });

  it('登録済みのツールをトグルすると解除され、falseを返す', () => {
    toggleFavorite('char-counter');
    expect(toggleFavorite('char-counter')).toBe(false);
    expect(getFavoriteSlugs()).toEqual([]);
    expect(isFavorite('char-counter')).toBe(false);
  });

  it('複数のツールを独立して登録できる', () => {
    toggleFavorite('char-counter');
    toggleFavorite('json-formatter');
    expect(getFavoriteSlugs()).toEqual(['char-counter', 'json-formatter']);

    toggleFavorite('char-counter');
    expect(getFavoriteSlugs()).toEqual(['json-formatter']);
  });
});

describe('moveFavorite', () => {
  beforeEach(() => {
    toggleFavorite('a');
    toggleFavorite('b');
    toggleFavorite('c');
  });

  it('upで1つ前の要素と入れ替わる', () => {
    expect(moveFavorite('b', 'up')).toEqual(['b', 'a', 'c']);
    expect(getFavoriteSlugs()).toEqual(['b', 'a', 'c']);
  });

  it('downで1つ後ろの要素と入れ替わる', () => {
    expect(moveFavorite('b', 'down')).toEqual(['a', 'c', 'b']);
    expect(getFavoriteSlugs()).toEqual(['a', 'c', 'b']);
  });

  it('先頭要素をupしても変化しない', () => {
    expect(moveFavorite('a', 'up')).toEqual(['a', 'b', 'c']);
  });

  it('末尾要素をdownしても変化しない', () => {
    expect(moveFavorite('c', 'down')).toEqual(['a', 'b', 'c']);
  });

  it('登録されていないslugを指定しても変化しない', () => {
    expect(moveFavorite('not-registered', 'up')).toEqual(['a', 'b', 'c']);
  });
});

describe('setFavoriteOrder', () => {
  beforeEach(() => {
    toggleFavorite('a');
    toggleFavorite('b');
    toggleFavorite('c');
  });

  it('指定した並び順で保存される', () => {
    expect(setFavoriteOrder(['c', 'a', 'b'])).toEqual(['c', 'a', 'b']);
    expect(getFavoriteSlugs()).toEqual(['c', 'a', 'b']);
  });

  it('未登録slugと重複は無視され、指定に含まれない登録済みslugは末尾に残る', () => {
    expect(setFavoriteOrder(['c', 'x', 'c'])).toEqual(['c', 'a', 'b']);
  });

  it('空配列を指定すると現在の並びがそのまま保たれる', () => {
    expect(setFavoriteOrder([])).toEqual(['a', 'b', 'c']);
    expect(getFavoriteSlugs()).toEqual(['a', 'b', 'c']);
  });
});

describe('localStorage exceptions', () => {
  it('getItemが例外を投げる場合、空配列を返す', () => {
    const throwingStorage = {
      getItem: () => {
        throw new Error('QuotaExceededError');
      },
      setItem: () => {},
      removeItem: () => {},
      clear: () => {},
    };
    vi.stubGlobal('localStorage', throwingStorage);

    expect(getFavoriteSlugs()).toEqual([]);
    expect(isFavorite('char-counter')).toBe(false);
  });

  it('setItemが例外を投げる場合、例外は無視され、トグルは成功を返す', () => {
    const throwingStorage = {
      getItem: () => null,
      setItem: () => {
        throw new Error('QuotaExceededError');
      },
      removeItem: () => {},
      clear: () => {},
    };
    vi.stubGlobal('localStorage', throwingStorage);

    // setItemが例外を投げても、トグルは成功を返す
    expect(toggleFavorite('char-counter')).toBe(true);
    // ただし、次のgetItemも例外を投げるので、isFavoriteは空配列を返す
    expect(isFavorite('char-counter')).toBe(false);
  });
});
