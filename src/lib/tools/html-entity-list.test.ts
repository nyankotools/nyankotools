import { describe, it, expect } from 'vitest';
import {
  ENTITY_CATEGORIES,
  HTML_ENTITIES,
  filterEntities,
  isInvisible,
  makeEntity,
  previewChar,
} from './html-entity-list';

describe('HTML_ENTITIES', () => {
  it('数百件を収録し、名前が重複しない', () => {
    expect(HTML_ENTITIES.length).toBeGreaterThan(300);
    const names = HTML_ENTITIES.map((e) => e.name);
    expect(new Set(names).size).toBe(names.length);
  });

  it('全カテゴリに1件以上ある', () => {
    for (const c of ENTITY_CATEGORIES) {
      expect(HTML_ENTITIES.some((e) => e.category === c)).toBe(true);
    }
  });

  it('代表的な参照が正しい', () => {
    const copy = HTML_ENTITIES.find((e) => e.name === 'copy')!;
    expect(copy.char).toBe('©');
    expect(copy.named).toBe('&copy;');
    expect(copy.decimal).toBe('&#169;');
    expect(copy.hex).toBe('&#xA9;');
    expect(HTML_ENTITIES.find((e) => e.name === 'euro')!.char).toBe('€');
    expect(HTML_ENTITIES.find((e) => e.name === 'Aacute')!.char).toBe('Á');
    expect(HTML_ENTITIES.find((e) => e.name === 'szlig')!.char).toBe('ß');
    expect(HTML_ENTITIES.find((e) => e.name === 'yuml')!.char).toBe('ÿ');
    expect(HTML_ENTITIES.find((e) => e.name === 'rarr')!.char).toBe('→');
    expect(HTML_ENTITIES.find((e) => e.name === 'Omega')!.char).toBe('Ω');
  });

  it('Latin-1 の乗除記号は数学記号側に1件ずつだけある', () => {
    expect(HTML_ENTITIES.filter((e) => e.codePoint === 0xd7)).toHaveLength(1);
    expect(HTML_ENTITIES.filter((e) => e.codePoint === 0xf7)).toHaveLength(1);
  });

  it('文字が空でなく、コードポイントが一致する', () => {
    for (const e of HTML_ENTITIES) {
      expect(e.char.codePointAt(0)).toBe(e.codePoint);
    }
  });
});

describe('makeEntity', () => {
  it('16進は大文字で出力する', () => {
    expect(makeEntity('x', 0x2192, 'arrows').hex).toBe('&#x2192;');
    expect(makeEntity('x', 0xab, 'symbols').hex).toBe('&#xAB;');
  });
});

describe('filterEntities', () => {
  it('空の検索語は全件', () => {
    expect(filterEntities('', 'all')).toHaveLength(HTML_ENTITIES.length);
    expect(filterEntities('   ', 'all')).toHaveLength(HTML_ENTITIES.length);
  });

  it('&名前; 形式でも名前でも検索できる', () => {
    expect(filterEntities('&copy;', 'all').map((e) => e.name)).toContain(
      'copy',
    );
    expect(filterEntities('COPY', 'all').map((e) => e.name)).toContain('copy');
  });

  it('10進・16進の数値参照で完全一致検索できる', () => {
    expect(filterEntities('&#169;', 'all').map((e) => e.name)).toEqual([
      'copy',
    ]);
    expect(filterEntities('169', 'all').map((e) => e.name)).toContain('copy');
    expect(filterEntities('&#xA9;', 'all').map((e) => e.name)).toEqual([
      'copy',
    ]);
    expect(filterEntities('U+00a9', 'all').map((e) => e.name)).toEqual([
      'copy',
    ]);
    expect(filterEntities('0xA9', 'all').map((e) => e.name)).toEqual(['copy']);
  });

  it('文字そのもので検索できる', () => {
    expect(filterEntities('€', 'all').map((e) => e.name)).toEqual(['euro']);
    expect(filterEntities('→', 'all').map((e) => e.name)).toEqual(['rarr']);
  });

  it('カテゴリで絞り込める', () => {
    const greek = filterEntities('', 'greek');
    expect(greek.every((e) => e.category === 'greek')).toBe(true);
    expect(filterEntities('copy', 'greek')).toHaveLength(0);
  });

  it('一致なしは空配列', () => {
    expect(filterEntities('zzzzqqq', 'all')).toEqual([]);
  });
});

describe('previewChar', () => {
  it('見えない文字は可視の記号に置き換える', () => {
    const nbsp = HTML_ENTITIES.find((e) => e.name === 'nbsp')!;
    expect(isInvisible(nbsp.codePoint)).toBe(true);
    expect(previewChar(nbsp)).toBe('␣');
    const copy = HTML_ENTITIES.find((e) => e.name === 'copy')!;
    expect(previewChar(copy)).toBe('©');
  });
});
