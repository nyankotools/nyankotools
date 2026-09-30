import { describe, expect, it } from 'vitest';
import {
  MAX_QUERY_LENGTH,
  readQueryText,
  stripQueryParams,
} from './query-init';

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

describe('stripQueryParams', () => {
  it('対象パラメータだけを消し、utm_* などは残す', () => {
    expect(stripQueryParams('?text=a&utm_source=x', ['text'])).toBe(
      '?utm_source=x',
    );
  });

  it('残りが無ければ空文字、対象が無ければ null', () => {
    expect(stripQueryParams('?text=a', ['text'])).toBe('');
    expect(stripQueryParams('?utm_source=x', ['text'])).toBeNull();
    expect(stripQueryParams('', ['text'])).toBeNull();
  });

  it('複数の対象パラメータをまとめて消す', () => {
    expect(stripQueryParams('?text=a&pattern=b&x=1', ['text', 'pattern'])).toBe(
      '?x=1',
    );
  });
});
