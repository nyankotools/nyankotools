import { describe, expect, it } from 'vitest';
import {
  addParam,
  buildQuery,
  buildUrl,
  findDuplicateKeys,
  moveParam,
  parseUrl,
  removeParam,
  sortParams,
  updateParam,
} from './url-parser';

describe('parseUrl', () => {
  it('URLを各要素に分解する', () => {
    const r = parseUrl(
      'https://user:pw@example.com:8080/a/b?x=1&y=%E3%81%82#top',
    );
    expect(r.success).toBe(true);
    if (!r.success) return;
    expect(r.parts).toEqual({
      protocol: 'https',
      username: 'user',
      password: 'pw',
      hostname: 'example.com',
      port: '8080',
      pathname: '/a/b',
      hash: 'top',
    });
    expect(r.params).toEqual([
      { key: 'x', value: '1' },
      { key: 'y', value: 'あ' },
    ]);
    expect(r.origin).toBe('https://example.com:8080');
    expect(r.resolvedFromBase).toBe(false);
  });

  it('重複キーを順序つきで保持する', () => {
    const r = parseUrl('https://e.com/?a=1&a=2&b=');
    if (!r.success) throw new Error('fail');
    expect(r.params).toEqual([
      { key: 'a', value: '1' },
      { key: 'a', value: '2' },
      { key: 'b', value: '' },
    ]);
  });

  it('空入力・不正URL', () => {
    expect(parseUrl('  ')).toEqual({ success: false, error: 'empty' });
    expect(parseUrl('/path?x=1')).toEqual({ success: false, error: 'invalid' });
  });

  it('相対URLはbaseで解決する', () => {
    const r = parseUrl('../c?x=1', 'https://example.com/a/b/');
    expect(r.success).toBe(true);
    if (!r.success) return;
    expect(r.href).toBe('https://example.com/a/c?x=1');
    expect(r.resolvedFromBase).toBe(true);
  });

  it('baseが不正ならinvalidBase', () => {
    expect(parseUrl('/x', 'not a url')).toEqual({
      success: false,
      error: 'invalidBase',
    });
  });

  it('絶対URLではbaseを無視する', () => {
    const r = parseUrl('https://a.com/', 'not a url');
    expect(r.success).toBe(true);
  });
});

describe('buildQuery', () => {
  it('スペースは既定で%20、plusForSpaceで+', () => {
    const p = [{ key: 'q', value: 'a b+c' }];
    expect(buildQuery(p)).toBe('q=a%20b%2Bc');
    expect(buildQuery(p, true)).toBe('q=a+b%2Bc');
  });

  it('空配列は空文字列', () => {
    expect(buildQuery([])).toBe('');
  });
});

describe('buildUrl', () => {
  const href = 'https://example.com/a?x=1#top';
  const base = {
    protocol: 'https',
    username: '',
    password: '',
    hostname: 'example.com',
    port: '',
    pathname: '/a',
    hash: 'top',
  };

  it('変更なしで元のURLと一致する', () => {
    expect(buildUrl(href, base, [{ key: 'x', value: '1' }])).toEqual({
      success: true,
      url: href,
    });
  });

  it('要素とクエリを差し替えられる', () => {
    const r = buildUrl(
      href,
      {
        ...base,
        hostname: 'foo.test',
        port: '3000',
        pathname: '/b c',
        hash: '',
      },
      [
        { key: 'a', value: '1' },
        { key: 'a', value: '日本' },
      ],
    );
    expect(r).toEqual({
      success: true,
      url: 'https://foo.test:3000/b%20c?a=1&a=%E6%97%A5%E6%9C%AC',
    });
  });

  it('クエリが空なら?を付けない', () => {
    expect(buildUrl(href, { ...base, hash: '' }, [])).toEqual({
      success: true,
      url: 'https://example.com/a',
    });
  });

  it('ハッシュはクエリの後ろに付く', () => {
    const r = buildUrl(href, base, [{ key: 'k', value: 'v' }]);
    expect(r).toEqual({ success: true, url: 'https://example.com/a?k=v#top' });
  });

  it('不正なポート・プロトコルはエラー', () => {
    expect(buildUrl(href, { ...base, port: '99999' }, [])).toEqual({
      success: false,
      error: 'invalid',
    });
    expect(buildUrl(href, { ...base, port: 'abc' }, [])).toEqual({
      success: false,
      error: 'invalid',
    });
    expect(buildUrl(href, { ...base, protocol: '1x' }, [])).toEqual({
      success: false,
      error: 'invalid',
    });
  });

  it('special同士のスキーム変更は可能、非specialへの変更はエラー', () => {
    const ok = buildUrl(href, { ...base, protocol: 'http' }, []);
    expect(ok).toEqual({ success: true, url: 'http://example.com/a#top' });
    expect(buildUrl(href, { ...base, protocol: 'foo' }, []).success).toBe(
      false,
    );
  });

  it('不正なホスト名はエラー', () => {
    expect(buildUrl(href, { ...base, hostname: 'a b' }, []).success).toBe(
      false,
    );
  });

  it('認証情報を設定できる', () => {
    const r = buildUrl(href, { ...base, username: 'u', password: 'p' }, []);
    expect(r).toEqual({
      success: true,
      url: 'https://u:p@example.com/a#top',
    });
  });
});

describe('パラメータ操作', () => {
  const p = [
    { key: 'b', value: '1' },
    { key: 'a', value: '2' },
    { key: 'b', value: '3' },
  ];

  it('追加・削除・更新', () => {
    expect(addParam(p, 'c', '4')).toHaveLength(4);
    expect(removeParam(p, 1).map((x) => x.key)).toEqual(['b', 'b']);
    expect(updateParam(p, 0, { value: 'z' })[0]).toEqual({
      key: 'b',
      value: 'z',
    });
    expect(p[0].value).toBe('1');
  });

  it('移動と範囲外', () => {
    expect(moveParam(p, 1, -1).map((x) => x.key)).toEqual(['a', 'b', 'b']);
    expect(moveParam(p, 0, -1)).toBe(p);
    expect(moveParam(p, 2, 1)).toBe(p);
  });

  it('キーで安定ソートする', () => {
    expect(sortParams(p)).toEqual([
      { key: 'a', value: '2' },
      { key: 'b', value: '1' },
      { key: 'b', value: '3' },
    ]);
  });

  it('重複キーを検出する', () => {
    expect(findDuplicateKeys(p)).toEqual(['b']);
    expect(findDuplicateKeys([])).toEqual([]);
  });
});

describe('parseUrl: スキームなし入力', () => {
  it('localhost:3000/x は missingScheme を立てる', () => {
    const r = parseUrl('localhost:3000/x');
    expect(r.success && r.missingScheme).toBe(true);
  });

  it('通常のURLでは missingScheme は false', () => {
    const r = parseUrl('https://example.com/x');
    expect(r.success && r.missingScheme).toBe(false);
  });
});

describe('buildUrl: 編集していないクエリは元の表記を保つ', () => {
  it('?q や空要素をそのまま残す', () => {
    const r = parseUrl('https://example.com/p?q&&a=b~#h');
    if (!r.success) throw new Error('parse failed');
    const built = buildUrl(r.href, r.parts, r.params, false, {
      params: r.params,
      raw: r.rawQuery,
    });
    expect(built).toEqual({
      success: true,
      url: 'https://example.com/p?q&&a=b~#h',
    });
  });

  it('編集すると再エンコードされる', () => {
    const r = parseUrl('https://example.com/p?q&a=b');
    if (!r.success) throw new Error('parse failed');
    const edited = [...r.params, { key: 'c', value: 'd' }];
    const built = buildUrl(r.href, r.parts, edited, false, {
      params: r.params,
      raw: r.rawQuery,
    });
    expect(built).toEqual({
      success: true,
      url: 'https://example.com/p?q=&a=b&c=d',
    });
  });
});
