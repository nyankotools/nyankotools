import { describe, it, expect } from 'vitest';
import { formatYaml } from './yaml-formatter';

function ok(input: string, options = {}): string {
  const r = formatYaml(input, options);
  if (!r.success) throw new Error(r.message);
  return r.output;
}

describe('formatYaml 整形', () => {
  it('フロー形式をブロック形式に整形する', () => {
    expect(ok('{a: 1, b: [x, y]}', { expandFlow: true })).toBe(
      'a: 1\nb:\n  - x\n  - y',
    );
    expect(ok('{a: 1, b: [x, y]}')).toBe('{ a: 1, b: [ x, y ] }');
  });

  it('インデント幅を変えられる', () => {
    expect(ok('a:\n b:\n  c: 1', { indent: 4 })).toBe(
      'a:\n    b:\n        c: 1',
    );
  });

  it('コメントを保持する', () => {
    expect(ok('# top\na: 1 # one\n')).toBe('# top\na: 1 # one');
  });

  it('長い文字列を折り返さない', () => {
    const long = 'x'.repeat(200);
    expect(ok(`a: ${long}`)).toBe(`a: ${long}`);
  });

  it('キーソートはネストにも効き、無効なら順序を保つ', () => {
    const src = 'b: 1\na:\n  z: 1\n  y: 2';
    expect(ok(src, { sortKeys: true })).toBe('a:\n  y: 2\n  z: 1\nb: 1');
    expect(ok(src)).toBe('b: 1\na:\n  z: 1\n  y: 2');
  });

  it('複数ドキュメントを --- でつないで整形する', () => {
    const r = formatYaml('a: 1\n---\n{b: 2}\n', { expandFlow: true });
    expect(r).toEqual({
      success: true,
      output: 'a: 1\n---\nb: 2',
      documents: 2,
    });
  });

  it('空入力は空文字を返す', () => {
    expect(ok('')).toBe('');
  });
});

describe('formatYaml エラー', () => {
  it('行・列を返す', () => {
    const r = formatYaml('a: 1\nb: [1, 2\nc: 3\n');
    expect(r.success).toBe(false);
    if (!r.success) {
      expect(r.line).toBeGreaterThanOrEqual(2);
      expect(r.column).toBeGreaterThanOrEqual(1);
      expect(r.message).not.toContain('\n');
    }
  });

  it('重複キーはエラーにする', () => {
    const r = formatYaml('a: 1\na: 2');
    expect(r.success).toBe(false);
    if (!r.success) expect(r.line).toBe(2);
  });

  it('2つ目のドキュメントのエラーはドキュメント番号を返す', () => {
    const r = formatYaml('a: 1\n---\nb: [\n');
    expect(r.success).toBe(false);
    if (!r.success) expect(r.document).toBe(2);
  });
});
