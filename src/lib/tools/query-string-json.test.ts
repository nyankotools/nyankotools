import { describe, expect, it } from 'vitest';
import {
  extractQuery,
  jsonToQuery,
  parseQueryToObject,
  queryToJson,
} from './query-string-json';

function q2j(input: string, opts = {}) {
  const r = queryToJson(input, { indent: 0, ...opts });
  if (!r.success) throw new Error('unexpected');
  return r.output;
}
function j2q(input: string, opts = {}) {
  const r = jsonToQuery(input, opts);
  if (!r.success) throw new Error(r.kind);
  return r.output;
}

describe('extractQuery', () => {
  it('先頭の ? や完全URLからクエリを取り出し、フラグメントを除く', () => {
    expect(extractQuery('?a=1')).toBe('a=1');
    expect(extractQuery('https://x.com/p?a=1&b=2#top')).toBe('a=1&b=2');
    expect(extractQuery('a=1')).toBe('a=1');
    expect(extractQuery('https://x.com/p')).toBe('');
    expect(extractQuery('  a=1\n')).toBe('a=1');
  });

  it('値に含まれる ? で前半を切り捨てない', () => {
    expect(extractQuery('a=b?c')).toBe('a=b?c');
    expect(queryKeys('q=what?&x=1')).toEqual(['q', 'x']);
  });
});

function queryKeys(input: string): string[] {
  const r = queryToJson(input, { indent: 0 });
  if (!r.success) throw new Error('unexpected');
  return Object.keys(JSON.parse(r.output));
}

describe('queryToJson', () => {
  it('基本のキーと値', () => {
    expect(q2j('a=1&b=hello')).toBe('{"a":"1","b":"hello"}');
  });
  it('3種の配列表記を解釈する', () => {
    expect(q2j('b[]=2&b[]=3')).toBe('{"b":["2","3"]}');
    expect(q2j('b[0]=2&b[1]=3')).toBe('{"b":["2","3"]}');
    expect(q2j('b=2&b=3')).toBe('{"b":["2","3"]}');
  });
  it('ネストしたキー', () => {
    expect(q2j('a[b][c]=1&a[b][d]=2')).toBe('{"a":{"b":{"c":"1","d":"2"}}}');
    expect(q2j('u[0][n]=x&u[1][n]=y')).toBe('{"u":[{"n":"x"},{"n":"y"}]}');
  });
  it('パーセントエンコードと + の解釈', () => {
    expect(q2j('q=a+b%26c&%E3%81%82=%E3%81%84')).toBe(
      '{"q":"a b&c","あ":"い"}',
    );
    expect(q2j('q=a+b', { plusAsSpace: false })).toBe('{"q":"a+b"}');
    expect(q2j('a%5Bb%5D=1')).toBe('{"a":{"b":"1"}}');
  });
  it('型推論オプション', () => {
    const o = { inferTypes: true };
    expect(q2j('n=1&f=1.5&t=true&x=null&s=007&e=1e3&k', o)).toBe(
      '{"n":1,"f":1.5,"t":true,"x":null,"s":"007","e":"1e3","k":null}',
    );
    expect(q2j('big=12345678901234567890', o)).toBe(
      '{"big":"12345678901234567890"}',
    );
    expect(q2j('n=1&k')).toBe('{"n":"1","k":""}');
  });
  it('不正なパーセントエンコードはそのまま残す', () => {
    expect(q2j('a=%E0%A4%A')).toBe('{"a":"%E0%A4%A"}');
  });
  it('空のペアは無視し、空入力は空のオブジェクト', () => {
    expect(q2j('&&a=1&')).toBe('{"a":"1"}');
    expect(q2j('')).toBe('{}');
  });
  it('値に = を含む場合は最初の = で分割する', () => {
    expect(q2j('a=b=c')).toBe('{"a":"b=c"}');
  });
  it('配列とオブジェクトの混在でも落ちない', () => {
    expect(q2j('a[]=1&a[x]=2')).toBe('{"a":{"0":"1","x":"2"}}');
    expect(q2j('a[x]=2&a[]=1')).toBe('{"a":{"1":"1","x":"2"}}');
    expect(q2j('a=1&a[x]=2')).toBe('{"a":{"x":"2"}}');
  });
  it('閉じていない括弧は通常のキー', () => {
    expect(q2j('a[b=1')).toBe('{"a[b":"1"}');
  });
  it('__proto__ などでプロトタイプ汚染しない', () => {
    const o = parseQueryToObject('__proto__[polluted]=1&constructor[x]=2');
    expect(({} as Record<string, unknown>).polluted).toBeUndefined();
    expect(Object.getPrototypeOf(o)).toBeNull();
    expect(q2j('__proto__[polluted]=1')).toBe('{"__proto__":{"polluted":"1"}}');
    expect(q2j('__proto__=1')).toBe('{"__proto__":"1"}');
  });
  it('大きすぎる添字はキーとして扱う', () => {
    expect(q2j('a[999999999]=1')).toBe('{"a":{"999999999":"1"}}');
  });
  it('深すぎるネストでも落ちない', () => {
    const key = 'a' + '[b]'.repeat(5000);
    expect(() => q2j(`${key}=1`)).not.toThrow();
  });
});

describe('jsonToQuery', () => {
  const json = '{"a":1,"b":["x","y"],"c":{"d":true,"e":null}}';
  it('配列表記の切り替え', () => {
    expect(j2q(json)).toBe('a=1&b[]=x&b[]=y&c[d]=true&c[e]');
    expect(j2q(json, { arrayFormat: 'index' })).toBe(
      'a=1&b[0]=x&b[1]=y&c[d]=true&c[e]',
    );
    expect(j2q(json, { arrayFormat: 'repeat' })).toBe(
      'a=1&b=x&b=y&c[d]=true&c[e]',
    );
  });
  it('オブジェクトを含む配列は添字表記になる', () => {
    expect(j2q('{"u":[{"n":"x"},{"n":"y"}]}')).toBe('u[0][n]=x&u[1][n]=y');
    expect(j2q('{"u":[{"n":"x"}]}', { arrayFormat: 'repeat' })).toBe(
      'u[0][n]=x',
    );
  });
  it('エンコード方式', () => {
    const src = '{"a b":{"k":"あ&=+ 1"}}';
    expect(j2q(src)).toBe('a%20b[k]=%E3%81%82%26%3D%2B%201');
    expect(j2q(src, { encode: 'full' })).toBe(
      'a%20b%5Bk%5D=%E3%81%82%26%3D%2B%201',
    );
    expect(j2q(src, { spaceAsPlus: true })).toBe('a+b[k]=%E3%81%82%26%3D%2B+1');
    expect(j2q('{"a":"x y"}', { encode: 'none' })).toBe('a=x y');
  });
  it('先頭の ? と空配列・空オブジェクト', () => {
    expect(j2q('{"a":1}', { leadingQuestion: true })).toBe('?a=1');
    expect(j2q('{}', { leadingQuestion: true })).toBe('');
    expect(j2q('{"a":[],"b":{}}')).toBe('');
  });
  it('エラー', () => {
    expect(jsonToQuery('{bad', {})).toMatchObject({
      success: false,
      kind: 'parse',
    });
    expect(jsonToQuery('[1]', {})).toMatchObject({
      success: false,
      kind: 'not-object',
    });
    expect(jsonToQuery('"s"', {})).toMatchObject({ kind: 'not-object' });
    const deep = '{"a":' + '['.repeat(150) + ']'.repeat(150) + '}';
    expect(jsonToQuery(deep, {})).toMatchObject({
      success: false,
      kind: 'depth',
    });
  });
  it('ラウンドトリップ（型推論あり）', () => {
    const src = '{"a":1,"b":["x","y"],"c":{"d":true,"e":"z"}}';
    const query = j2q(src);
    expect(JSON.parse(q2j(query, { inferTypes: true }))).toEqual(
      JSON.parse(src),
    );
  });
});
