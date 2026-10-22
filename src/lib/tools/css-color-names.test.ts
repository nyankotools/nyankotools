import { describe, it, expect } from 'vitest';
import {
  COLOR_GROUPS,
  CSS_COLORS,
  classifyColor,
  filterColors,
  readableTextColor,
} from './css-color-names';

describe('CSS_COLORS', () => {
  it('148色あり、transparent / currentColor を含まない', () => {
    expect(CSS_COLORS).toHaveLength(148);
    const names = CSS_COLORS.map((c) => c.name);
    expect(names).not.toContain('transparent');
    expect(names).not.toContain('currentcolor');
  });

  it('色名が重複せず、HEX・RGBの書式が整っている', () => {
    const names = CSS_COLORS.map((c) => c.name);
    expect(new Set(names).size).toBe(148);
    for (const c of CSS_COLORS) {
      expect(c.name).toMatch(/^[a-z]+$/);
      expect(c.hex).toMatch(/^#[0-9a-f]{6}$/);
      expect(c.rgb).toMatch(/^rgb\(\d+, \d+, \d+\)$/);
    }
  });

  it('既知の色が正しい', () => {
    const get = (n: string) => CSS_COLORS.find((c) => c.name === n);
    expect(get('rebeccapurple')).toMatchObject({
      hex: '#663399',
      rgb: 'rgb(102, 51, 153)',
    });
    expect(get('tomato')).toMatchObject({ hex: '#ff6347' });
    expect(get('red')).toMatchObject({ rgb: 'rgb(255, 0, 0)', group: 'red' });
    expect(get('white')).toMatchObject({ group: 'neutral' });
  });

  it('gray/grey 系の別名は同じ色になる', () => {
    const pairs = ['gray', 'darkgray', 'dimgray', 'lightgray', 'slategray'];
    for (const p of pairs) {
      const a = CSS_COLORS.find((c) => c.name === p)!;
      const b = CSS_COLORS.find((c) => c.name === p.replace('gray', 'grey'))!;
      expect(b.hex).toBe(a.hex);
    }
    expect(CSS_COLORS.find((c) => c.name === 'darkslategrey')).toBeTruthy();
    expect(CSS_COLORS.find((c) => c.name === 'lightslategrey')).toBeTruthy();
  });

  it('全区分に色があり、合計が全件と一致する', () => {
    let total = 0;
    for (const g of COLOR_GROUPS) {
      const n = filterColors('', g).length;
      expect(n).toBeGreaterThan(0);
      total += n;
    }
    expect(total).toBe(148);
  });
});

describe('classifyColor', () => {
  it('代表色の系統', () => {
    expect(classifyColor('#ff0000')).toBe('red');
    expect(classifyColor('#ffa500')).toBe('orange');
    expect(classifyColor('#ffff00')).toBe('yellow');
    expect(classifyColor('#008000')).toBe('green');
    expect(classifyColor('#0000ff')).toBe('blue');
    expect(classifyColor('#800080')).toBe('purple');
    expect(classifyColor('#808080')).toBe('neutral');
    expect(classifyColor('#000000')).toBe('neutral');
  });
});

describe('filterColors', () => {
  it('空クエリ・空白のみは全件', () => {
    expect(filterColors('')).toHaveLength(148);
    expect(filterColors('   ')).toHaveLength(148);
  });

  it('色名の部分一致、大文字小文字・全角を無視する', () => {
    expect(filterColors('rebecca').map((c) => c.name)).toEqual([
      'rebeccapurple',
    ]);
    expect(filterColors('REBECCA')).toHaveLength(1);
    expect(filterColors('ｒｅｂｅｃｃａ')).toHaveLength(1);
  });

  it('空白・ハイフン区切りでも一致する', () => {
    expect(filterColors('dark blue').map((c) => c.name)).toContain('darkblue');
    expect(filterColors('dark-slate-gray').map((c) => c.name)).toContain(
      'darkslategray',
    );
  });

  it('HEXは#の有無を問わず部分一致する', () => {
    expect(filterColors('#663399').map((c) => c.name)).toEqual([
      'rebeccapurple',
    ]);
    expect(filterColors('663399')).toHaveLength(1);
    expect(filterColors('#6633')).toHaveLength(1);
  });

  it('英字のみの短い文字列はHEXではなく色名として扱う', () => {
    // "bad" は16進数だけで構成されるが数字を含まないため色名検索
    expect(filterColors('bad')).toEqual([]);
    expect(filterColors('#')).toEqual([]);
  });

  it('区分と検索語の併用', () => {
    const r = filterColors('blue', 'blue');
    expect(r.length).toBeGreaterThan(0);
    expect(r.every((c) => c.group === 'blue')).toBe(true);
    expect(filterColors('rebecca', 'green')).toEqual([]);
  });

  it('一致なし・長いクエリ・特殊文字は空配列で例外にならない', () => {
    expect(filterColors('zzzzqqq')).toEqual([]);
    expect(filterColors('a'.repeat(10000))).toEqual([]);
    expect(filterColors('.*')).toEqual([]);
    expect(filterColors('🌸')).toEqual([]);
  });
});

describe('readableTextColor', () => {
  it('全色で文字色とのコントラスト比が4.5以上になる', () => {
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
    for (const c of CSS_COLORS) {
      const a = lumOf(c.hex);
      const b = lumOf(readableTextColor(c.hex));
      expect(
        (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05),
        c.name,
      ).toBeGreaterThanOrEqual(4.5);
    }
  });
});
