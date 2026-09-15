import { describe, expect, it } from 'vitest';
import { formatJson, minifyJson } from './json-formatter';

describe('formatJson', () => {
  it('JSONを指定したインデント幅で整形する', () => {
    const result = formatJson('{"b":2,"a":1}', 2);
    expect(result).toEqual({
      success: true,
      output: '{\n  "b": 2,\n  "a": 1\n}',
    });
  });

  it('インデント幅を省略すると2スペースになる', () => {
    const result = formatJson('[1,2,3]');
    expect(result).toEqual({ success: true, output: '[\n  1,\n  2,\n  3\n]' });
  });

  it('不正なJSONの場合はエラーメッセージを返す', () => {
    const result = formatJson('{invalid}');
    expect(result.success).toBe(false);
    expect(result.success === false && result.message.length).toBeGreaterThan(
      0,
    );
  });

  it('空文字列の場合はエラーになる', () => {
    const result = formatJson('');
    expect(result.success).toBe(false);
  });
});

describe('minifyJson', () => {
  it('JSONから不要な空白を取り除く', () => {
    const result = minifyJson('{\n  "a": 1,\n  "b": [1, 2, 3]\n}');
    expect(result).toEqual({ success: true, output: '{"a":1,"b":[1,2,3]}' });
  });

  it('不正なJSONの場合はエラーメッセージを返す', () => {
    const result = minifyJson('not json');
    expect(result.success).toBe(false);
  });
});
