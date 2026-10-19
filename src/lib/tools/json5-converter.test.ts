import { describe, it, expect } from 'vitest';
import {
  parseJson5,
  json5ToJson,
  jsonToJson5,
  stringifyJson5,
  quoteJson5String,
  isIdentifierName,
  Json5ParseError,
  MAX_DEPTH,
  type ToJson5Options,
} from './json5-converter';

const J5: ToJson5Options = {
  indent: 2,
  quote: 'single',
  unquoteKeys: true,
  trailingComma: false,
};

function errorOf(src: string) {
  try {
    parseJson5(src);
  } catch (e) {
    if (e instanceof Json5ParseError) return e.info;
    throw e;
  }
  throw new Error('should have failed');
}

describe('parseJson5', () => {
  it('通常のJSONを読める', () => {
    expect(parseJson5('{"a":[1,2,{"b":null}],"c":true}')).toEqual({
      a: [1, 2, { b: null }],
      c: true,
    });
  });

  it('コメント・末尾カンマ・クォート無しキー・シングルクォートを許容する', () => {
    const src = `{
      // line comment
      name: 'Taro', /* block */
      $id_1: "x",
      list: [1, 2, 3,],
    }`;
    expect(parseJson5(src)).toEqual({
      name: 'Taro',
      $id_1: 'x',
      list: [1, 2, 3],
    });
  });

  it('数値の各種表記', () => {
    expect(parseJson5('[0xFF, -0x10, +1, .5, 5., 1e3, 1.5E-2, 0]')).toEqual([
      255, -16, 1, 0.5, 5, 1000, 0.015, 0,
    ]);
    expect(parseJson5('[Infinity, -Infinity, +Infinity]')).toEqual([
      Infinity,
      -Infinity,
      Infinity,
    ]);
    expect(Number.isNaN(parseJson5('NaN'))).toBe(true);
    expect(Object.is(parseJson5('-0'), -0)).toBe(true);
  });

  it('先頭ゼロや不正な数値はエラー', () => {
    expect(errorOf('01').code).toBe('invalidNumber');
    expect(errorOf('1.2.3').code).toBe('invalidNumber');
    expect(errorOf('0x').code).toBe('invalidNumber');
    expect(errorOf('-').code).toBe('unexpectedEnd');
    expect(errorOf('Infinityx').code).toBe('invalidNumber');
  });

  it('文字列のエスケープと行継続', () => {
    expect(parseJson5(String.raw`'a\x41B\n\0\'\q'`)).toBe("aAB\n\0'q");
    expect(parseJson5('"line1\\\nline2"')).toBe('line1line2');
    expect(parseJson5('"a\\\r\nb"')).toBe('ab');
  });

  it('不正なエスケープ・未終端文字列', () => {
    expect(errorOf(String.raw`"\1"`).code).toBe('invalidEscape');
    expect(errorOf(String.raw`"\u12"`).code).toBe('invalidEscape');
    expect(errorOf(String.raw`"\00"`).code).toBe('invalidEscape');
    expect(errorOf('"abc').code).toBe('unterminatedString');
    expect(errorOf('"ab\ncd"').code).toBe('unterminatedString');
  });

  it('キーのバリエーション', () => {
    expect(
      parseJson5(String.raw`{ ab: 1, 'x y': 2, "z": 3, 日本語: 4 }`),
    ).toEqual({
      ab: 1,
      'x y': 2,
      z: 3,
      日本語: 4,
    });
    expect(errorOf('{1: 2}').code).toBe('unexpectedChar');
    expect(errorOf('{a b}').code).toBe('unexpectedChar');
  });

  it('予約語もキーに使える', () => {
    expect(parseJson5('{null: 1, true: 2, if: 3}')).toEqual({
      null: 1,
      true: 2,
      if: 3,
    });
  });

  it('重複キーは後勝ち', () => {
    expect(parseJson5('{a:1,a:2}')).toEqual({ a: 2 });
  });

  it('空白の種類（BOM・NBSP・U+2028）を許容する', () => {
    expect(parseJson5('\ufeff\u00a0[1,\u2028 2]')).toEqual([1, 2]);
  });

  it('__proto__ キーでプロトタイプ汚染しない', () => {
    const v = parseJson5('{"__proto__": {"polluted": true}, a: 1}') as Record<
      string,
      unknown
    >;
    expect(Object.getPrototypeOf(v)).toBe(Object.prototype);
    expect(Object.keys(v)).toEqual(['__proto__', 'a']);
    expect(({} as Record<string, unknown>).polluted).toBeUndefined();
    expect(v.polluted).toBeUndefined();
    const v2 = parseJson5('{__proto__: 1}') as Record<string, unknown>;
    expect(Object.getPrototypeOf(v2)).toBe(Object.prototype);
  });

  it('エラーの行・桁', () => {
    const e = errorOf('{\n  a: 1,\n  b: @\n}');
    expect(e.code).toBe('unexpectedChar');
    expect(e.line).toBe(3);
    expect(e.column).toBe(6);
    expect(e.found).toBe('@');
  });

  it('CRLFでも行数が正しい', () => {
    const e = errorOf('[\r\n1,\r\n@]');
    expect(e.line).toBe(3);
    expect(e.column).toBe(1);
  });

  it('入力の途中終了・余分な内容・未終端コメント', () => {
    expect(errorOf('').code).toBe('unexpectedEnd');
    expect(errorOf('{a:1').code).toBe('unexpectedEnd');
    expect(errorOf('[1 2]').code).toBe('unexpectedChar');
    expect(errorOf('1 2').code).toBe('unexpectedChar');
    expect(errorOf('[1,,2]').code).toBe('unexpectedChar');
    expect(errorOf('{,}').code).toBe('unexpectedChar');
    const c = errorOf('1 /* abc');
    expect(c.code).toBe('unterminatedComment');
    expect(c.column).toBe(3);
  });

  it('深すぎるネストはエラー（スタックを溢れさせない）', () => {
    const deep = '['.repeat(MAX_DEPTH + 1) + ']'.repeat(MAX_DEPTH + 1);
    expect(errorOf(deep).code).toBe('tooDeep');
    const ok = '['.repeat(MAX_DEPTH) + ']'.repeat(MAX_DEPTH);
    expect(() => parseJson5(ok)).not.toThrow();
  });
});

describe('json5ToJson', () => {
  it('JSON5をJSONにする', () => {
    const r = json5ToJson("{a: 'x', b: [1,2,], /* c */}", {
      indent: 2,
      nonFinite: 'null',
    });
    expect(r).toEqual({
      success: true,
      output: '{\n  "a": "x",\n  "b": [\n    1,\n    2\n  ]\n}',
      nonFiniteCount: 0,
    });
  });

  it('インデント指定（4・tab・圧縮）', () => {
    const o = (indent: 0 | 4 | 'tab') => {
      const r = json5ToJson('{a:1}', { indent, nonFinite: 'null' });
      return r.success ? r.output : '';
    };
    expect(o(4)).toBe('{\n    "a": 1\n}');
    expect(o('tab')).toBe('{\n\t"a": 1\n}');
    expect(o(0)).toBe('{"a":1}');
  });

  it('Infinity / NaN は null か文字列にして件数を返す', () => {
    const a = json5ToJson('[Infinity, -Infinity, NaN, 1]', {
      indent: 0,
      nonFinite: 'null',
    });
    expect(a).toMatchObject({
      output: '[null,null,null,1]',
      nonFiniteCount: 3,
    });
    const b = json5ToJson('[Infinity, -Infinity, NaN]', {
      indent: 0,
      nonFinite: 'string',
    });
    expect(b).toMatchObject({
      output: '["Infinity","-Infinity","NaN"]',
      nonFiniteCount: 3,
    });
  });

  it('16進数は10進に変換される', () => {
    const r = json5ToJson('0xFF');
    expect(r).toMatchObject({ success: true, output: '255' });
  });

  it('__proto__ キーはJSON出力にも残る', () => {
    const r = json5ToJson('{"__proto__": 1}', { indent: 0, nonFinite: 'null' });
    expect(r).toMatchObject({ output: '{"__proto__":1}' });
  });

  it('エラーは行・桁つきで返す', () => {
    const r = json5ToJson('{\n a: ,\n}');
    expect(r.success).toBe(false);
    if (!r.success) {
      expect(r.error.line).toBe(2);
      expect(r.error.column).toBe(5);
    }
  });
});

describe('jsonToJson5', () => {
  it('キーのクォート省略とシングルクォート', () => {
    const r = jsonToJson5('{"name":"Taro","a-b":1,"list":[1,"x"]}', J5);
    expect(r).toMatchObject({
      success: true,
      output:
        "{\n  name: 'Taro',\n  'a-b': 1,\n  list: [\n    1,\n    'x'\n  ]\n}",
    });
  });

  it('ダブルクォート・キーのクォート維持・末尾カンマ', () => {
    const out = stringifyJson5(
      { a: [1], b: {} },
      { indent: 2, quote: 'double', unquoteKeys: false, trailingComma: true },
    );
    expect(out).toBe('{\n  "a": [\n    1,\n  ],\n  "b": {},\n}');
  });

  it('圧縮・タブ', () => {
    expect(stringifyJson5({ a: [1, 2] }, { ...J5, indent: 0 })).toBe(
      '{a:[1,2]}',
    );
    expect(
      stringifyJson5({ a: 1 }, { ...J5, indent: 0, trailingComma: true }),
    ).toBe('{a:1}');
    expect(stringifyJson5({ a: 1 }, { ...J5, indent: 'tab' })).toBe(
      '{\n\ta: 1\n}',
    );
  });

  it('空配列・空オブジェクト・プリミティブ', () => {
    expect(stringifyJson5([], J5)).toBe('[]');
    expect(stringifyJson5({}, J5)).toBe('{}');
    expect(stringifyJson5(null, J5)).toBe('null');
    expect(stringifyJson5(true, J5)).toBe('true');
    expect(stringifyJson5(12.5, J5)).toBe('12.5');
  });

  it('JSON5入力でも整形でき、Infinity / NaN / -0 を保持する', () => {
    const r = jsonToJson5('[Infinity,-Infinity,NaN,-0]', { ...J5, indent: 0 });
    expect(r).toMatchObject({ output: '[Infinity,-Infinity,NaN,-0]' });
  });

  it('数字始まり・ハイフン入りのキーはクォートする', () => {
    expect(
      stringifyJson5({ '1a': 1, 'a b': 2, '': 3 }, { ...J5, indent: 0 }),
    ).toBe("{'1a':1,'a b':2,'':3}");
  });

  it('__proto__ キーを安全に出力する', () => {
    const v = parseJson5('{"__proto__": {"x": 1}}');
    expect(stringifyJson5(v, { ...J5, indent: 0 })).toBe('{__proto__:{x:1}}');
  });

  it('出力を再パースすると元の値に戻る', () => {
    const src =
      '{"s":"it\'s \\"q\\"\\n\\u2028 \\u0001 😀","n":[1.5,-2,1e21],"e":{}}';
    for (const quote of ['single', 'double'] as const) {
      const r = jsonToJson5(src, { ...J5, quote });
      expect(r.success).toBe(true);
      if (r.success) {
        expect(parseJson5(r.output)).toEqual(parseJson5(src));
      }
    }
  });

  it('エラーを返す', () => {
    const r = jsonToJson5('{"a":}');
    expect(r.success).toBe(false);
  });
});

describe('quoteJson5String / isIdentifierName', () => {
  it('エスケープ', () => {
    expect(quoteJson5String("a'b", "'")).toBe("'a\\'b'");
    expect(quoteJson5String('a"b', "'")).toBe("'a\"b'");
    expect(quoteJson5String('a"b', '"')).toBe('"a\\"b"');
    expect(quoteJson5String('\\\t\v\0\u2029', '"')).toBe(
      '"\\\\\\t\\u000b\\u0000\\u2029"',
    );
    expect(quoteJson5String('\ud800', '"')).toBe('"\\ud800"');
    expect(quoteJson5String('😀', '"')).toBe('"😀"');
  });

  it('識別子判定', () => {
    expect(isIdentifierName('abc')).toBe(true);
    expect(isIdentifierName('$_a1')).toBe(true);
    expect(isIdentifierName('日本語')).toBe(true);
    expect(isIdentifierName('1a')).toBe(false);
    expect(isIdentifierName('a-b')).toBe(false);
    expect(isIdentifierName('')).toBe(false);
  });
});

describe('エッジケース（QA追加）', () => {
  it('1e400 は Infinity として扱われ null に置き換わる', () => {
    expect(
      json5ToJson('[1e400]', { indent: 0, nonFinite: 'null' }),
    ).toMatchObject({
      output: '[null]',
      nonFiniteCount: 1,
    });
  });

  it('CRのみの改行でも行番号が正しい', () => {
    const e = errorOf('{\r a: 1,\r b: @\r}');
    expect(e.line).toBe(3);
    expect(e.column).toBe(5);
  });

  it('エスケープされたサロゲート対は1文字にまとまる', () => {
    expect(parseJson5('"\ud83d\ude00"')).toBe('😀');
  });

  it('文字列中の生のU+2028・U+2029は許容される', () => {
    expect(parseJson5('"a b "')).toBe('a b ');
  });

  it('空のオブジェクト・配列のみの入力を整形できる', () => {
    expect(json5ToJson('{}', { indent: 2, nonFinite: 'null' })).toMatchObject({
      output: '{}',
    });
    expect(json5ToJson('[[]]', { indent: 0, nonFinite: 'null' })).toMatchObject(
      {
        output: '[[]]',
      },
    );
  });

  it('大きな配列（10万要素）でも変換できる', () => {
    const src = '[' + '1,'.repeat(99999) + '1]';
    const r = json5ToJson(src, { indent: 0, nonFinite: 'null' });
    expect(r.success).toBe(true);
    if (r.success) expect(r.output.length).toBeGreaterThan(100000);
  });

  it('JSON→JSON5 の結果は JSON5 として再パースできる（シングルクォート・末尾カンマ）', () => {
    const src = '{"k":["a\'b",1.5,null,true]}';
    const r = jsonToJson5(src, {
      indent: 4,
      quote: 'single',
      unquoteKeys: true,
      trailingComma: true,
    });
    expect(r.success).toBe(true);
    if (r.success) expect(parseJson5(r.output)).toEqual(parseJson5(src));
  });

  it('全角スペース（Zs）は空白として許容される', () => {
    expect(parseJson5('[1,　]')).toEqual([1]);
  });
});
