import { describe, expect, it } from 'vitest';
import {
  flattenJson,
  parsePath,
  sortJsonKeys,
  unflattenJson,
} from './json-sorter';

function ok(r: { success: boolean }): string {
  if (!r.success) throw new Error('expected success: ' + JSON.stringify(r));
  return (r as unknown as { output: string }).output;
}

describe('sortJsonKeys', () => {
  it('キーを昇順に再帰ソートする', () => {
    const out = ok(
      sortJsonKeys('{"b":{"z":1,"y":2},"a":[{"d":1,"c":2}]}', { indent: 0 }),
    );
    expect(out).toBe('{"a":[{"c":2,"d":1}],"b":{"y":2,"z":1}}');
  });

  it('降順にできる', () => {
    expect(
      ok(sortJsonKeys('{"a":1,"c":3,"b":2}', { order: 'desc', indent: 0 })),
    ).toBe('{"c":3,"b":2,"a":1}');
  });

  it('再帰オフでは最上位のみ並べ替える', () => {
    expect(
      ok(
        sortJsonKeys('{"b":{"z":1,"y":2},"a":1}', {
          recursive: false,
          indent: 0,
        }),
      ),
    ).toBe('{"a":1,"b":{"z":1,"y":2}}');
  });

  it('配列の要素順は保持する', () => {
    expect(ok(sortJsonKeys('[3,1,2]', { indent: 0 }))).toBe('[3,1,2]');
  });

  it('整数風のキーも指定した順序で並ぶ', () => {
    expect(ok(sortJsonKeys('{"b":1,"2":1,"10":1,"1":1}', { indent: 0 }))).toBe(
      '{"1":1,"10":1,"2":1,"b":1}',
    );
    expect(
      ok(sortJsonKeys('{"1":1,"2":1,"b":1}', { order: 'desc', indent: 0 })),
    ).toBe('{"b":1,"2":1,"1":1}');
  });

  it('巨大整数・小数表記をそのまま保つ', () => {
    expect(
      ok(
        sortJsonKeys('{"b":12345678901234567890,"a":1.0,"c":1E5}', {
          indent: 0,
        }),
      ),
    ).toBe('{"a":1.0,"b":12345678901234567890,"c":1E5}');
  });

  it('インデントを指定できる', () => {
    expect(ok(sortJsonKeys('{"b":[],"a":{}}', { indent: 2 }))).toBe(
      '{\n  "a": {},\n  "b": []\n}',
    );
    expect(ok(sortJsonKeys('{"a":[1]}', { indent: '\t' }))).toBe(
      '{\n\t"a": [\n\t\t1\n\t]\n}',
    );
  });

  it('__proto__ キーを保持しプロトタイプを汚染しない', () => {
    const out = ok(
      sortJsonKeys('{"b":1,"__proto__":{"polluted":true}}', { indent: 0 }),
    );
    expect(out).toBe('{"__proto__":{"polluted":true},"b":1}');
    expect(({} as Record<string, unknown>).polluted).toBeUndefined();
  });

  it('エスケープ・Unicode文字列を壊さない', () => {
    expect(
      ok(sortJsonKeys('{"b":"a\\"\\n\\u3042","a":"😀"}', { indent: 0 })),
    ).toBe('{"a":"😀","b":"a\\"\\nあ"}');
  });

  it('構文エラーを返す', () => {
    const r = sortJsonKeys('{a:1}');
    expect(r.success).toBe(false);
    if (!r.success) expect(r.kind).toBe('parse');
  });

  it('スカラーのルートも扱える', () => {
    expect(ok(sortJsonKeys('"x"'))).toBe('"x"');
  });
});

describe('flattenJson', () => {
  it('a.b[0] 形式にフラット化する', () => {
    const out = ok(
      flattenJson('{"a":{"b":[1,{"c":2}]},"d":"x"}', { indent: 0 }),
    );
    expect(out).toBe('{"a.b[0]":1,"a.b[1].c":2,"d":"x"}');
  });

  it('空配列・空オブジェクトは値として残す', () => {
    expect(ok(flattenJson('{"a":[],"b":{},"c":null}', { indent: 0 }))).toBe(
      '{"a":[],"b":{},"c":null}',
    );
  });

  it('ドットや記号を含むキー・数字キー・空キーはブラケット表記にする', () => {
    const out = ok(
      flattenJson('{"a.b":{"c d":1,"0":2,"":3,"x[y]":4}}', { indent: 0 }),
    );
    expect(out).toBe(
      '{"[\\"a.b\\"][\\"c d\\"]":1,"[\\"a.b\\"][\\"0\\"]":2,"[\\"a.b\\"][\\"\\"]":3,"[\\"a.b\\"][\\"x[y]\\"]":4}',
    );
  });

  it('ルートが配列なら [0] から始まる', () => {
    expect(ok(flattenJson('[{"a":1},2]', { indent: 0 }))).toBe(
      '{"[0].a":1,"[1]":2}',
    );
  });

  it('ルートがスカラー・空コンテナならそのまま', () => {
    expect(ok(flattenJson('5'))).toBe('5');
    expect(ok(flattenJson('[]'))).toBe('[]');
    expect(ok(flattenJson('{}'))).toBe('{}');
  });

  it('巨大整数を丸めない', () => {
    expect(
      ok(flattenJson('{"a":{"id":9007199254740993}}', { indent: 0 })),
    ).toBe('{"a.id":9007199254740993}');
  });

  it('__proto__ キーを安全に扱う', () => {
    expect(ok(flattenJson('{"__proto__":{"x":1}}', { indent: 0 }))).toBe(
      '{"__proto__.x":1}',
    );
  });
});

describe('parsePath', () => {
  it('各形式を解釈する', () => {
    expect(parsePath('a.b[0].c')).toEqual(['a', 'b', 0, 'c']);
    expect(parsePath('[0][1]')).toEqual([0, 1]);
    expect(parsePath('["a.b"].c')).toEqual(['a.b', 'c']);
    expect(parsePath('["a\\"]"]')).toEqual(['a"]']);
  });

  it('不正なパスは null', () => {
    for (const p of [
      '',
      '.a',
      'a.',
      'a..b',
      'a[',
      'a[x]',
      'a[0]b',
      '["a"',
      'a]',
    ]) {
      expect(parsePath(p), p).toBeNull();
    }
  });
});

describe('unflattenJson', () => {
  it('ネストと配列を復元する', () => {
    const out = ok(
      unflattenJson('{"a.b[0]":1,"a.b[1].c":2,"d":"x"}', { indent: 0 }),
    );
    expect(out).toBe('{"a":{"b":[1,{"c":2}]},"d":"x"}');
  });

  it('flatten と往復して元に戻る', () => {
    const src =
      '{"a.b":{"c d":[1,[2,3],{}],"0":2,"":3},"e":[],"f":null,"g":[{"h":true}]}';
    const flat = ok(flattenJson(src, { indent: 0 }));
    expect(ok(unflattenJson(flat, { indent: 0 }))).toBe(src);
  });

  it('ルートが配列のものを復元する', () => {
    expect(ok(unflattenJson('{"[0].a":1,"[1]":2}', { indent: 0 }))).toBe(
      '[{"a":1},2]',
    );
  });

  it('飛んだインデックスは null で埋める', () => {
    expect(ok(unflattenJson('{"a[2]":1}', { indent: 0 }))).toBe(
      '{"a":[null,null,1]}',
    );
  });

  it('空配列・空オブジェクトの値を保つ', () => {
    expect(ok(unflattenJson('{"a":[],"b":{}}', { indent: 0 }))).toBe(
      '{"a":[],"b":{}}',
    );
  });

  it('空オブジェクトはそのまま', () => {
    expect(ok(unflattenJson('{}'))).toBe('{}');
  });

  it('__proto__ パスでもプロトタイプを汚染しない', () => {
    const out = ok(unflattenJson('{"__proto__.polluted":true}', { indent: 0 }));
    expect(out).toBe('{"__proto__":{"polluted":true}}');
    expect(({} as Record<string, unknown>).polluted).toBeUndefined();
  });

  it('オブジェクト以外はエラー', () => {
    const r = unflattenJson('[1]');
    expect(r.success).toBe(false);
    if (!r.success) expect(r.kind).toBe('not-object');
  });

  it('不正なパスを検出する', () => {
    const r = unflattenJson('{"a..b":1}');
    expect(r.success).toBe(false);
    if (!r.success) {
      expect(r.kind).toBe('invalid-path');
      expect(r.path).toBe('a..b');
    }
  });

  it('型の衝突を検出する', () => {
    for (const src of [
      '{"a":1,"a.b":2}',
      '{"a.b":2,"a":1}',
      '{"a[0]":1,"a.b":2}',
      '{"a":1,"[0]":2}',
    ]) {
      const r = unflattenJson(src);
      expect(r.success, src).toBe(false);
      if (!r.success) expect(r.kind).toBe('conflict');
    }
  });

  it('巨大なインデックスは拒否する', () => {
    const r = unflattenJson('{"a[99999999]":1}');
    expect(r.success).toBe(false);
    if (!r.success) expect(r.kind).toBe('index-too-large');
  });

  it('構文エラーを返す', () => {
    const r = unflattenJson('{');
    expect(r.success).toBe(false);
    if (!r.success) expect(r.kind).toBe('parse');
  });
});

describe('エッジケース', () => {
  it('空入力・空白のみは構文エラー', () => {
    for (const src of ['', '  \n']) {
      const r = sortJsonKeys(src);
      expect(r.success, JSON.stringify(src)).toBe(false);
      if (!r.success) expect(r.kind).toBe('parse');
    }
  });

  it('CRLF の入力でも整形できる', () => {
    expect(ok(sortJsonKeys('{\r\n"b":1,\r\n"a":2\r\n}', { indent: 0 }))).toBe(
      '{"a":2,"b":1}',
    );
  });

  it('日本語・絵文字のキーは UTF-16 コード単位順に並ぶ', () => {
    expect(
      ok(sortJsonKeys('{"😀":3,"い":2,"あ":1,"a":4}', { indent: 0 })),
    ).toBe('{"a":4,"あ":1,"い":2,"😀":3}');
  });

  it('1万キーでも全件ソートされる', () => {
    const keys = Array.from({ length: 10000 }, (_, i) => `k${i}`).reverse();
    const src = '{' + keys.map((k) => `"${k}":0`).join(',') + '}';
    const out = JSON.parse(ok(sortJsonKeys(src, { indent: 0 }))) as Record<
      string,
      number
    >;
    const sorted = Object.keys(out);
    expect(sorted.length).toBe(10000);
    expect(sorted[0]).toBe('k0');
    expect(sorted).toEqual([...sorted].sort());
  });

  it('非常に深いネストは depth エラーになる（クラッシュしない）', () => {
    const deep = '['.repeat(5000) + ']'.repeat(5000);
    const r = sortJsonKeys(deep);
    expect(r.success).toBe(false);
    if (!r.success) expect(r.kind).toBe('depth');
  });

  it('深いネストのフラット化も depth エラーになる', () => {
    const deep = '{"a":'.repeat(5000) + '1' + '}'.repeat(5000);
    const r = flattenJson(deep);
    expect(r.success).toBe(false);
    if (!r.success) expect(r.kind).toBe('depth');
  });

  it('インデックス上限ちょうど（100000）は許可し、超えると拒否する', () => {
    expect(unflattenJson('{"a[100000]":1}').success).toBe(true);
    const r = unflattenJson('{"a[100001]":1}');
    expect(r.success).toBe(false);
    if (!r.success) expect(r.kind).toBe('index-too-large');
  });
});
