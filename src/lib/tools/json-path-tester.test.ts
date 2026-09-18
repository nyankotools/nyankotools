import { describe, expect, it } from 'vitest';
import {
  evaluateJsonPath,
  evaluateJsonPointer,
  parseJsonInput,
} from './json-path-tester';

const sample = {
  store: {
    book: [
      { title: 'A', price: 10 },
      { title: 'B', price: 25 },
    ],
  },
};

describe('parseJsonInput', () => {
  it('正しいJSONをパースする', () => {
    const result = parseJsonInput('{"a": 1}');
    expect(result).toEqual({ success: true, value: { a: 1 } });
  });

  it('不正なJSONはエラーを返す', () => {
    const result = parseJsonInput('{a: 1}');
    expect(result.success).toBe(false);
    expect(result.error).toBeTruthy();
  });
});

describe('evaluateJsonPath', () => {
  it('クエリが空文字なら空のマッチ結果を返す', () => {
    const result = evaluateJsonPath(sample, '');
    expect(result).toEqual({ success: true, error: null, matches: [] });
  });

  it('単純なパスでマッチする', () => {
    const result = evaluateJsonPath(sample, '$.store.book[0].title');
    expect(result.success).toBe(true);
    expect(result.matches).toEqual([
      {
        path: "$['store']['book'][0]['title']",
        pointer: '/store/book/0/title',
        value: 'A',
      },
    ]);
  });

  it('ワイルドカードで複数マッチする', () => {
    const result = evaluateJsonPath(sample, '$.store.book[*].title');
    expect(result.matches.map((m) => m.value)).toEqual(['A', 'B']);
  });

  it('再帰下降（..）でマッチする', () => {
    const result = evaluateJsonPath(sample, '$..price');
    expect(result.matches.map((m) => m.value)).toEqual([10, 25]);
  });

  it('フィルタ式でマッチする', () => {
    const result = evaluateJsonPath(sample, '$..book[?(@.price>10)].title');
    expect(result.matches.map((m) => m.value)).toEqual(['B']);
  });

  it('マッチしない場合は空配列を返す', () => {
    const result = evaluateJsonPath(sample, '$.store.nope');
    expect(result).toEqual({ success: true, error: null, matches: [] });
  });

  it('構文的に不正なパスはエラーを返す', () => {
    const result = evaluateJsonPath(sample, '$[?(@.a===)]');
    expect(result.success).toBe(false);
    expect(result.error).toBeTruthy();
    expect(result.matches).toEqual([]);
  });
});

describe('evaluateJsonPointer', () => {
  it('空文字列はルート全体を返す', () => {
    const result = evaluateJsonPointer(sample, '');
    expect(result).toEqual({ success: true, value: sample });
  });

  it('オブジェクト・配列をたどって値を取得する', () => {
    const result = evaluateJsonPointer(sample, '/store/book/1/title');
    expect(result).toEqual({ success: true, value: 'B' });
  });

  it('先頭の "#" （URIフラグメント識別子表記）を読み飛ばす', () => {
    const result = evaluateJsonPointer(sample, '#/store/book/1/title');
    expect(result).toEqual({ success: true, value: 'B' });
  });

  it('"/" で始まらない場合はエラーを返す', () => {
    const result = evaluateJsonPointer(sample, 'store/book');
    expect(result).toEqual({ success: false, reason: 'invalid-format' });
  });

  it('~1 は "/" に、~0 は "~" にデコードする', () => {
    const target = { 'a/b': { 'c~d': 1 } };
    const result = evaluateJsonPointer(target, '/a~1b/c~0d');
    expect(result).toEqual({ success: true, value: 1 });
  });

  it('存在しないキーはエラーを返す', () => {
    const result = evaluateJsonPointer(sample, '/store/nope');
    expect(result).toEqual({
      success: false,
      reason: 'key-not-found',
      path: '/store/nope',
      key: 'nope',
    });
  });

  it('範囲外の配列インデックスはエラーを返す', () => {
    const result = evaluateJsonPointer(sample, '/store/book/5');
    expect(result).toEqual({
      success: false,
      reason: 'index-out-of-range',
      path: '/store/book/5',
      index: 5,
      length: 2,
    });
  });

  it('プリミティブ値の配下はエラーを返す', () => {
    const result = evaluateJsonPointer(sample, '/store/book/0/title/x');
    expect(result).toEqual({
      success: false,
      reason: 'not-traversable',
      path: '/store/book/0/title/x',
    });
  });

  it('不正な配列インデックスはエラーを返す', () => {
    const result = evaluateJsonPointer(sample, '/store/book/01');
    expect(result).toEqual({
      success: false,
      reason: 'invalid-array-index',
      path: '/store/book/01',
      token: '01',
    });
  });

  it('"-" は末尾追加位置のためエラーを返す', () => {
    const result = evaluateJsonPointer(sample, '/store/book/-');
    expect(result).toEqual({
      success: false,
      reason: 'trailing-dash',
      path: '/store/book/-',
    });
  });

  it('"#" のみ（フラグメント全体が空）はルート全体を返す', () => {
    const result = evaluateJsonPointer(sample, '#');
    expect(result).toEqual({ success: true, value: sample });
  });

  it('負の配列インデックスは invalid-array-index を返す', () => {
    const result = evaluateJsonPointer({ arr: [1, 2, 3] }, '/arr/-1');
    expect(result).toEqual({
      success: false,
      reason: 'invalid-array-index',
      path: '/arr/-1',
      token: '-1',
    });
  });

  it('オブジェクトのキーが "-" でも通常のキーとして解決できる（配列文脈のみ特別扱い）', () => {
    const result = evaluateJsonPointer({ '-': 'dash-value' }, '/-');
    expect(result).toEqual({ success: true, value: 'dash-value' });
  });

  it('オブジェクトの数値風キーは配列インデックスと誤認しない', () => {
    const result = evaluateJsonPointer({ '0': 'zero-value' }, '/0');
    expect(result).toEqual({ success: true, value: 'zero-value' });
  });

  it('絵文字・サロゲートペアを含むキーと値を扱える', () => {
    const target = { '😀emoji': '猫🐱の絵文字' };
    const result = evaluateJsonPointer(target, '/😀emoji');
    expect(result).toEqual({ success: true, value: '猫🐱の絵文字' });
  });
});

describe('evaluateJsonPath: ルートがプリミティブ値の場合', () => {
  it('ルートが文字列の場合、$ で文字列自体にマッチする', () => {
    const result = evaluateJsonPath('hello', '$');
    expect(result.success).toBe(true);
    expect(result.matches).toEqual([
      { path: '$', pointer: '', value: 'hello' },
    ]);
  });

  it('ルートが数値の場合、$ で数値自体にマッチする', () => {
    const result = evaluateJsonPath(42, '$');
    expect(result.success).toBe(true);
    expect(result.matches).toEqual([{ path: '$', pointer: '', value: 42 }]);
  });

  it('ルートが真偽値（truthy）の場合、$ で真偽値自体にマッチする', () => {
    const result = evaluateJsonPath(true, '$');
    expect(result.success).toBe(true);
    expect(result.matches).toEqual([{ path: '$', pointer: '', value: true }]);
  });

  it('ルートが配列自体の場合、$[*] で全要素にマッチする', () => {
    const result = evaluateJsonPath([1, 2, 3], '$[*]');
    expect(result.matches.map((m) => m.value)).toEqual([1, 2, 3]);
  });

  // jsonpath-plusはルート自体がfalsyな値（null / false / 0 / ""）だと
  // 内部でundefinedを返す（マッチ0件の空配列ではなく）。evaluateJsonPath側で
  // "$"（ルート自体を指すクエリ）についてはこれを補正し、他のプリミティブ値と
  // 同様にfalsy値自体へのマッチとして扱う。
  it('ルートがnullの場合、$ はnull自体にマッチする', () => {
    const result = evaluateJsonPath(null, '$');
    expect(result.success).toBe(true);
    expect(result.matches).toEqual([{ path: '$', pointer: '', value: null }]);
  });

  it('ルートがfalseの場合、$ はfalse自体にマッチする', () => {
    const result = evaluateJsonPath(false, '$');
    expect(result.success).toBe(true);
    expect(result.matches).toEqual([{ path: '$', pointer: '', value: false }]);
  });

  it('ルートが0の場合、$ は0自体にマッチする', () => {
    const result = evaluateJsonPath(0, '$');
    expect(result.success).toBe(true);
    expect(result.matches).toEqual([{ path: '$', pointer: '', value: 0 }]);
  });

  it('ルートが空文字列の場合、$ は空文字列自体にマッチする', () => {
    const result = evaluateJsonPath('', '$');
    expect(result.success).toBe(true);
    expect(result.matches).toEqual([{ path: '$', pointer: '', value: '' }]);
  });

  it('ルートがfalsy値でも $.* / $..* はマッチなしで正常終了する（プリミティブに子要素はない）', () => {
    for (const root of [null, false, 0, '']) {
      expect(evaluateJsonPath(root, '$.*')).toEqual({
        success: true,
        error: null,
        matches: [],
      });
      expect(evaluateJsonPath(root, '$..*')).toEqual({
        success: true,
        error: null,
        matches: [],
      });
    }
  });

  it('ネストしたプロパティの値がfalsy（false/0/null/空文字）でも問題なくマッチする', () => {
    const target = { a: false, b: 0, c: null, d: '' };
    expect(evaluateJsonPath(target, '$.a').matches[0].value).toBe(false);
    expect(evaluateJsonPath(target, '$.b').matches[0].value).toBe(0);
    expect(evaluateJsonPath(target, '$.c').matches[0].value).toBe(null);
    expect(evaluateJsonPath(target, '$.d').matches[0].value).toBe('');
  });
});

describe('evaluateJsonPath: マルチバイト文字とパフォーマンス', () => {
  it('絵文字・サロゲートペアを含むキーと値を扱える', () => {
    const target = { '😀emoji': '猫🐱の絵文字' };
    const result = evaluateJsonPath(target, "$['😀emoji']");
    expect(result.success).toBe(true);
    expect(result.matches).toEqual([
      { path: "$['😀emoji']", pointer: '/😀emoji', value: '猫🐱の絵文字' },
    ]);
  });

  it('日本語キーをドット記法で扱える', () => {
    const target = { 名前: '田中太郎', 年齢: 30 };
    const result = evaluateJsonPath(target, '$.名前');
    expect(result.matches.map((m) => m.value)).toEqual(['田中太郎']);
  });

  it('大きめの配列（5000件）でも正しくマッチし、破綻しない', () => {
    const largeArray = Array.from({ length: 5000 }, (_, i) => ({
      id: i,
      value: i * 2,
    }));
    const result = evaluateJsonPath(largeArray, '$[*].id');
    expect(result.success).toBe(true);
    expect(result.matches).toHaveLength(5000);
    expect(result.matches[0].value).toBe(0);
    expect(result.matches[4999].value).toBe(4999);
  });
});
