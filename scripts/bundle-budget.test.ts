import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { tools } from '../src/data/tools';
import {
  budgets,
  findImports,
  findScripts,
  readHeavySlugs,
  toolSlugOf,
} from './bundle-budget.mjs';

describe('bundle-budget', () => {
  it('静的importと動的importを区別して取り出す', () => {
    const src =
      'import{a as e}from"./a.js";import"./b.js";const x=()=>import("./c.js");';
    expect(findImports(src)).toEqual({
      static: ['./a.js', './b.js'],
      dynamic: ['./c.js'],
    });
  });

  it('同じファイルが静的・動的の両方で参照されるときは静的として扱う', () => {
    const src = 'import{a}from"./a.js";const x=()=>import("./a.js");';
    expect(findImports(src).static).toEqual(['./a.js']);
  });

  it('HTMLから /_astro/ のJSだけを取り出す（外部スクリプト・インラインは除外）', () => {
    const html = [
      '<script src="/theme-init.js"></script>',
      '<script async src="https://www.googletagmanager.com/gtag/js?id=G-X"></script>',
      '<script type="module" src="/_astro/page.abc.js"></script>',
      '<script>console.log(1)</script>',
    ].join('');
    expect(findScripts(html)).toEqual(['/_astro/page.abc.js']);
  });

  it('tools.ts から heavy のslugを読み取る', () => {
    const source = `export const tools: Tool[] = [
  {
    slug: 'a',
    heavy: true,
    sensitive: true,
  },
  {
    slug: 'b',
    sensitive: true,
  },
  {
    slug: 'c',
    heavy: true,
  },
];`;
    expect([...readHeavySlugs(source)]).toEqual(['a', 'c']);
  });

  it('ツールページのURLからslugを取り出す（ja/en。それ以外は null）', () => {
    expect(toolSlugOf('/tools/base64/')).toBe('base64');
    expect(toolSlugOf('/en/tools/base64/')).toBe('base64');
    expect(toolSlugOf('/tools/category/text/')).toBeNull();
    expect(toolSlugOf('/')).toBeNull();
  });

  it('実際の tools.ts から、heavy: true のツールを過不足なく読み取れる', () => {
    const source = readFileSync(
      new URL('../src/data/tools.ts', import.meta.url),
      'utf8',
    );
    const expected = tools.filter((t) => t.heavy).map((t) => t.slug);
    expect(expected.length).toBeGreaterThan(0);
    expect([...readHeavySlugs(source)].sort()).toEqual(expected.sort());
  });

  it('heavy の予算は通常より大きい', () => {
    expect(budgets.heavy).toBeGreaterThan(budgets.normal);
  });
});
