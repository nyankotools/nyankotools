import { describe, expect, it } from 'vitest';
import { MAX_QUERY_LENGTH, readQueryText } from './query-init';

describe('readQueryText', () => {
  it('text パラメータを取り出す（日本語・エンコード済みも可）', () => {
    expect(readQueryText('?text=hello')).toBe('hello');
    expect(readQueryText('?text=%E3%81%82%20b')).toBe('あ b');
  });

  it('無い・空・他のパラメータのみなら null', () => {
    expect(readQueryText('')).toBeNull();
    expect(readQueryText('?text=')).toBeNull();
    expect(readQueryText('?data=abc')).toBeNull();
  });

  it('上限を超える長さは null', () => {
    expect(
      readQueryText(`?text=${'a'.repeat(MAX_QUERY_LENGTH)}`),
    ).not.toBeNull();
    expect(
      readQueryText(`?text=${'a'.repeat(MAX_QUERY_LENGTH + 1)}`),
    ).toBeNull();
  });
});
