import { describe, expect, it } from 'vitest';
import { parseSnapshot, storageKey } from './input-persist';

describe('storageKey', () => {
  it('ツールslugからキーを作り、ロケールを含まない', () => {
    expect(storageKey('base64')).toBe('nyanko:input:base64');
  });
});

describe('parseSnapshot', () => {
  it('保存内容を復元する', () => {
    expect(
      parseSnapshot('{"last":"b","values":{"a":"1","b":"2","c":""}}'),
    ).toEqual({ last: 'b', values: { a: '1', b: '2', c: '' } });
  });

  it('last が無い・文字列以外なら null にする', () => {
    expect(parseSnapshot('{"values":{"a":"1"}}')?.last).toBeNull();
    expect(parseSnapshot('{"last":1,"values":{}}')?.last).toBeNull();
  });

  it('文字列以外の値は捨てる', () => {
    expect(parseSnapshot('{"values":{"a":1,"b":"x"}}')?.values).toEqual({
      b: 'x',
    });
  });

  it('壊れている・空・形式違いは null', () => {
    expect(parseSnapshot(null)).toBeNull();
    expect(parseSnapshot('')).toBeNull();
    expect(parseSnapshot('{not json')).toBeNull();
    expect(parseSnapshot('{"last":"a"}')).toBeNull();
    expect(parseSnapshot('null')).toBeNull();
  });
});
