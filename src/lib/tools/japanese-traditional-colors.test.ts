import { describe, it, expect } from 'vitest';
import {
  COLOR_GROUPS,
  TRADITIONAL_COLORS,
  filterColors,
} from './japanese-traditional-colors';

describe('TRADITIONAL_COLORS', () => {
  it('十分な件数があり、全区分に色がある', () => {
    expect(TRADITIONAL_COLORS.length).toBeGreaterThanOrEqual(200);
    for (const g of COLOR_GROUPS) {
      expect(TRADITIONAL_COLORS.some((c) => c.group === g)).toBe(true);
    }
  });

  it('HEX・RGB・読み・ローマ字がすべて整っている', () => {
    for (const c of TRADITIONAL_COLORS) {
      expect(c.hex).toMatch(/^#[0-9a-f]{6}$/);
      expect(c.rgb).toMatch(/^rgb\(\d+, \d+, \d+\)$/);
      expect(c.reading).toMatch(/^[ぁ-ゖー]+$/);
      expect(c.romaji).toMatch(/^[a-z' -]+$/);
    }
  });

  it('色名が重複していない', () => {
    const names = TRADITIONAL_COLORS.map((c) => c.name);
    expect(new Set(names).size).toBe(names.length);
  });

  it('既知の色はHEXからRGBに正しく変換される', () => {
    const beni = TRADITIONAL_COLORS.find((c) => c.name === '紅');
    expect(beni).toMatchObject({
      reading: 'べに',
      hex: '#c1121f',
      rgb: 'rgb(193, 18, 31)',
      group: 'red',
    });
    const shiro = TRADITIONAL_COLORS.find((c) => c.name === '白');
    expect(shiro).toMatchObject({ hex: '#ffffff', rgb: 'rgb(255, 255, 255)' });
  });
});

describe('filterColors', () => {
  it('空クエリは全件', () => {
    expect(filterColors('')).toHaveLength(TRADITIONAL_COLORS.length);
  });

  it('空白だけのクエリは全件扱い（前後の空白は無視）', () => {
    expect(filterColors('   ')).toHaveLength(TRADITIONAL_COLORS.length);
    expect(filterColors('  桜  ').some((c) => c.name === '桜色')).toBe(true);
  });

  it('色名・読み・カタカナ・ローマ字で検索できる', () => {
    expect(filterColors('桜').some((c) => c.name === '桜色')).toBe(true);
    expect(filterColors('さくら').some((c) => c.name === '桜色')).toBe(true);
    expect(filterColors('サクラ').some((c) => c.name === '桜色')).toBe(true);
    expect(filterColors('sakura').some((c) => c.name === '桜色')).toBe(true);
  });

  it('大文字のローマ字でも検索できる', () => {
    expect(filterColors('SAKURA').some((c) => c.name === '桜色')).toBe(true);
  });

  it('HEXは#の有無を問わず検索できる', () => {
    expect(filterColors('#e60012').map((c) => c.name)).toContain('赤');
    expect(filterColors('E60012').map((c) => c.name)).toContain('赤');
  });

  it('HEXは部分一致し、一致しない不正な書式は空配列になる', () => {
    const partial = filterColors('#e6001').map((c) => c.name);
    expect(partial).toContain('赤');
    // #の後ろに16進数でない文字がある場合は、HEXとして解釈されず一致なし
    expect(filterColors('#zzz')).toEqual([]);
    // 「#」だけでは全件にならない
    expect(filterColors('#')).toEqual([]);
  });

  it('区分で絞り込める', () => {
    const r = filterColors('', 'blue');
    expect(r.length).toBeGreaterThan(0);
    expect(r.every((c) => c.group === 'blue')).toBe(true);
  });

  it('区分と検索語を併用すると両方の条件を満たす色だけになる', () => {
    // 「紅」は赤系にあるが、青系では一致しない
    expect(filterColors('紅', 'red').some((c) => c.name === '紅')).toBe(true);
    expect(filterColors('紅', 'blue')).toEqual([]);
    const reds = filterColors('さくら', 'red');
    expect(reds.length).toBeGreaterThan(0);
    expect(reds.every((c) => c.group === 'red')).toBe(true);
  });

  it('区分を指定した全件は、区分ごとの件数の合計と一致する', () => {
    const total = COLOR_GROUPS.reduce(
      (sum, g) => sum + filterColors('', g).length,
      0,
    );
    expect(total).toBe(TRADITIONAL_COLORS.length);
  });

  it('一致なしは空配列', () => {
    expect(filterColors('zzzzqqq')).toEqual([]);
  });

  it('非常に長いクエリでも例外にならず、一致なしは空配列', () => {
    const longQuery = 'あ'.repeat(10000);
    expect(filterColors(longQuery)).toEqual([]);
  });

  it('絵文字・サロゲートペアを含むクエリでも例外にならない', () => {
    expect(filterColors('🌸')).toEqual([]);
    expect(filterColors('🌸桜')).toEqual([]);
  });

  it('正規表現の特殊文字を含むクエリは文字列としてそのまま扱う', () => {
    expect(filterColors('.*')).toEqual([]);
    expect(filterColors('(')).toEqual([]);
  });
});

describe('readableTextColor / 全角入力', () => {
  it('全色で文字色とのコントラスト比が4.5以上になる', async () => {
    const { readableTextColor } = await import('./japanese-traditional-colors');
    const lin = (v: number) => {
      const c = v / 255;
      return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
    };
    const lumOf = (hex: string) => {
      const n = parseInt(hex.slice(1), 16);
      return (
        0.2126 * lin((n >> 16) & 255) +
        0.7152 * lin((n >> 8) & 255) +
        0.0722 * lin(n & 255)
      );
    };
    for (const c of TRADITIONAL_COLORS) {
      const a = lumOf(c.hex);
      const b = lumOf(readableTextColor(c.hex));
      const ratio = (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
      expect(ratio, c.name).toBeGreaterThanOrEqual(4.5);
    }
  });

  it('全角英字のローマ字も検索できる', () => {
    expect(filterColors('ＳＡＫＵＲＡ').some((c) => c.name === '桜色')).toBe(
      true,
    );
  });
});
