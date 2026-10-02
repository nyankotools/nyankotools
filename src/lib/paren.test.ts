import { describe, expect, it } from 'vitest';
import { parenthesize } from './paren';

describe('parenthesize', () => {
  it('日本語は全角括弧', () => {
    expect(parenthesize('3ページ', 'ja')).toBe('（3ページ）');
  });
  it('英語は先頭にスペースを置いた半角括弧', () => {
    expect(parenthesize('3 pages', 'en')).toBe(' (3 pages)');
  });
});
