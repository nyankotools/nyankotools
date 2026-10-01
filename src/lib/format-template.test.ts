import { describe, expect, it } from 'vitest';
import { count, fill } from './format-template';

describe('fill', () => {
  it('プレースホルダーを値で置き換える', () => {
    expect(fill('{y}年{m}ヶ月', { y: '3', m: '2' })).toBe('3年2ヶ月');
  });

  it('同じキーが複数あってもすべて置き換える', () => {
    expect(fill('{n}-{n}', { n: '1' })).toBe('1-1');
  });

  it('未指定のキーは空文字になる', () => {
    expect(fill('a{x}b', {})).toBe('ab');
  });

  it('プレースホルダーがなければそのまま返す', () => {
    expect(fill('abc', { n: '1' })).toBe('abc');
  });
});

describe('count', () => {
  const forms: [string, string] = ['{n} day', '{n} days'];

  it('1 のときは単数形', () => {
    expect(count(forms, 1)).toBe('1 day');
  });

  it('1 以外（0・負数含む）は複数形', () => {
    expect(count(forms, 0)).toBe('0 days');
    expect(count(forms, 2)).toBe('2 days');
    expect(count(forms, -1)).toBe('-1 days');
  });

  it('display を渡すと {n} の表示だけ差し替え、単複は n で決まる', () => {
    expect(count(forms, 1, '1')).toBe('1 day');
    expect(count(forms, 1000, '1,000')).toBe('1,000 days');
  });
});
