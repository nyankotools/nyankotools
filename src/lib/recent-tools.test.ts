import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  getRecentSlugs,
  pushRecent,
  recordRecentTool,
  RECENT_LIMIT,
} from './recent-tools';

function stubStorage(initial?: string) {
  const store = new Map<string, string>();
  if (initial !== undefined) store.set('recent-tools', initial);
  vi.stubGlobal('localStorage', {
    getItem: (k: string) => store.get(k) ?? null,
    setItem: (k: string, v: string) => void store.set(k, v),
  });
  return store;
}

function stubToolPage(slug?: string) {
  vi.stubGlobal('document', {
    querySelector: vi.fn(() => (slug ? { dataset: { toolPage: slug } } : null)),
  });
}

afterEach(() => vi.unstubAllGlobals());

describe('pushRecent', () => {
  it('先頭に追加し、重複は先頭へ移す', () => {
    expect(pushRecent(['a', 'b'], 'c')).toEqual(['c', 'a', 'b']);
    expect(pushRecent(['a', 'b', 'c'], 'b')).toEqual(['b', 'a', 'c']);
  });

  it('上限件数を超えた古いものから捨てる', () => {
    const many = Array.from({ length: RECENT_LIMIT }, (_, i) => `t${i}`);
    const next = pushRecent(many, 'new');
    expect(next).toHaveLength(RECENT_LIMIT);
    expect(next[0]).toBe('new');
    expect(next).not.toContain(`t${RECENT_LIMIT - 1}`);
  });
});

describe('getRecentSlugs', () => {
  it('保存が無い・壊れている・配列でない場合は空', () => {
    stubStorage();
    expect(getRecentSlugs()).toEqual([]);
    stubStorage('{oops');
    expect(getRecentSlugs()).toEqual([]);
    stubStorage('{"a":1}');
    expect(getRecentSlugs()).toEqual([]);
  });

  it('文字列以外の要素は除外する', () => {
    stubStorage('["a",1,null,"b"]');
    expect(getRecentSlugs()).toEqual(['a', 'b']);
  });

  it('localStorage が例外を投げても空', () => {
    vi.stubGlobal('localStorage', {
      getItem: () => {
        throw new Error('blocked');
      },
    });
    expect(getRecentSlugs()).toEqual([]);
  });
});

describe('recordRecentTool', () => {
  it('ツールページでは先頭に記録する', () => {
    const store = stubStorage('["a"]');
    stubToolPage('base64');
    recordRecentTool();
    expect(JSON.parse(store.get('recent-tools') ?? '[]')).toEqual([
      'base64',
      'a',
    ]);
  });

  it('ツールページ以外では何も記録しない', () => {
    const store = stubStorage();
    stubToolPage();
    recordRecentTool();
    expect(store.has('recent-tools')).toBe(false);
  });

  it('保存に失敗しても例外を出さない', () => {
    vi.stubGlobal('localStorage', {
      getItem: () => null,
      setItem: () => {
        throw new Error('quota');
      },
    });
    stubToolPage('base64');
    expect(() => recordRecentTool()).not.toThrow();
  });
});
