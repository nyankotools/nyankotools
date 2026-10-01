import { describe, it, expect } from 'vitest';
import { diffJson, diffJsonValues } from './json-diff';

describe('diffJsonValues', () => {
  it('同一なら差分なし（キーの順序は無視）', () => {
    const { entries } = diffJsonValues(
      { a: 1, b: [1, 2] },
      { b: [1, 2], a: 1 },
    );
    expect(entries).toEqual([]);
  });

  it('追加・削除・変更をパスつきで返す', () => {
    const { entries, stats } = diffJsonValues(
      { a: 1, b: { c: 'x' }, d: true },
      { a: 2, b: { c: 'x', e: null }, f: 1 },
    );
    expect(entries).toEqual([
      { type: 'changed', path: '$.a', left: '1', right: '2' },
      { type: 'added', path: '$.b.e', left: null, right: 'null' },
      { type: 'removed', path: '$.d', left: 'true', right: null },
      { type: 'added', path: '$.f', left: null, right: '1' },
    ]);
    expect(stats).toEqual({ added: 2, removed: 1, changed: 1 });
  });

  it('型が変わった値は changed になる', () => {
    const { entries } = diffJsonValues(
      { a: 1, b: [1], c: null },
      { a: '1', b: { 0: 1 }, c: [] },
    );
    expect(entries.map((e) => [e.path, e.type])).toEqual([
      ['$.a', 'changed'],
      ['$.b', 'changed'],
      ['$.c', 'changed'],
    ]);
  });

  it('配列は添字で比較し、長さの差を追加・削除にする', () => {
    const { entries } = diffJsonValues([1, 2, 3], [1, 9]);
    expect(entries).toEqual([
      { type: 'changed', path: '$[1]', left: '2', right: '9' },
      { type: 'removed', path: '$[2]', left: '3', right: null },
    ]);
  });

  it('識別子でないキーは角括弧で表す', () => {
    const { entries } = diffJsonValues({ 'a-b': 1 }, { 'a-b': 2 });
    expect(entries[0].path).toBe('$["a-b"]');
  });

  it('ignoreArrayOrder で並び替えだけなら差分なし', () => {
    const { entries } = diffJsonValues(
      [1, { a: 1, b: 2 }, 3],
      [3, { b: 2, a: 1 }, 1],
      {
        ignoreArrayOrder: true,
      },
    );
    expect(entries).toEqual([]);
  });

  it('ignoreArrayOrder で重複を個数まで数えて対応づける', () => {
    const { entries } = diffJsonValues([1, 1, 2], [1, 2, 2], {
      ignoreArrayOrder: true,
    });
    expect(entries.map((e) => [e.type, e.left ?? e.right])).toEqual([
      ['removed', '1'],
      ['added', '2'],
    ]);
  });

  it('__proto__ キーを通常のキーとして比較する', () => {
    const a = JSON.parse('{"__proto__":1}');
    const b = JSON.parse('{"__proto__":2}');
    expect(diffJsonValues(a, b).entries).toHaveLength(1);
  });
});

describe('diffJson', () => {
  it('文字列から比較する', () => {
    const result = diffJson('{"a":1}', '{"a":2}');
    expect(result.success && result.stats.changed).toBe(1);
  });

  it('空・不正な入力は失敗した側つきで返す', () => {
    expect(diffJson('', '{}')).toMatchObject({ reason: 'empty', side: 'left' });
    expect(diffJson('{}', ' ')).toMatchObject({
      reason: 'empty',
      side: 'right',
    });
    expect(diffJson('{}', '{a')).toMatchObject({
      reason: 'invalid-json',
      side: 'right',
    });
    expect(diffJson('[', '{}')).toMatchObject({
      reason: 'invalid-json',
      side: 'left',
    });
  });
});

describe('エッジケース - diffJson', () => {
  it('null値・空オブジェクト・空配列の比較', () => {
    const result = diffJsonValues({ a: null }, { a: null });
    expect(result.entries).toHaveLength(0);
  });

  it('複雑にネストされたJSON', () => {
    const left = {
      level1: { level2: { level3: { level4: { value: 1 } } } },
    };
    const right = {
      level1: { level2: { level3: { level4: { value: 2 } } } },
    };
    const { entries } = diffJsonValues(left, right);
    expect(entries).toHaveLength(1);
    expect(entries[0].path).toBe('$.level1.level2.level3.level4.value');
  });

  it('大量のキーを持つオブジェクト', () => {
    const left: Record<string, number> = {};
    const right: Record<string, number> = {};
    for (let i = 0; i < 50; i++) {
      left[`key${i}`] = i;
      right[`key${i}`] = i + 1;
    }
    const { stats } = diffJsonValues(left, right);
    expect(stats.changed).toBe(50);
  });

  it('絵文字を含むキー・値の比較', () => {
    const left = JSON.parse('{"emoji_😀": "value1"}');
    const right = JSON.parse('{"emoji_😀": "value2"}');
    const { entries } = diffJsonValues(left, right);
    expect(entries).toHaveLength(1);
    expect(entries[0].path).toContain('emoji_');
  });

  it('配列内に異なる型が混在', () => {
    const left = [1, 'a', true, null, { x: 1 }];
    const right = [1, 'a', true, null, { x: 2 }];
    const { entries } = diffJsonValues(left, right);
    expect(entries).toHaveLength(1);
    expect(entries[0].path).toBe('$[4].x');
  });

  it('配列の要素削除・追加・変更が混在', () => {
    const left = [1, 2, 3, 4, 5];
    const right = [1, 20, 3, 40];
    const { stats } = diffJsonValues(left, right);
    expect(stats.changed).toBe(2);
    expect(stats.removed).toBe(1);
  });

  it('配列の重複要素で ignoreArrayOrder が正しく機能', () => {
    const left = [1, 1, 1];
    const right = [1, 1];
    const { entries, stats } = diffJsonValues(left, right, {
      ignoreArrayOrder: true,
    });
    expect(stats.removed).toBe(1);
    expect(entries).toHaveLength(1);
  });

  it('深いネストの配列と ignoreArrayOrder', () => {
    const left = { arr: [{ x: 1 }, { x: 2 }] };
    const right = { arr: [{ x: 2 }, { x: 1 }] };
    const { entries: ordered } = diffJsonValues(left, right);
    expect(ordered.length).toBeGreaterThan(0);

    const { entries: unordered } = diffJsonValues(left, right, {
      ignoreArrayOrder: true,
    });
    expect(unordered).toHaveLength(0);
  });
});
