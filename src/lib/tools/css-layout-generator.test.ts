import { describe, it, expect } from 'vitest';
import {
  buildCss,
  buildFlexDeclarations,
  buildGridDeclarations,
  clampInt,
  DEFAULT_FLEX,
  DEFAULT_GRID,
} from './css-layout-generator';

describe('clampInt', () => {
  it('範囲内に丸める', () => {
    expect(clampInt(5.6, 0, 10)).toBe(6);
    expect(clampInt(-3, 0, 10)).toBe(0);
    expect(clampInt(99, 0, 10)).toBe(10);
  });
  it('数値でない入力は最小値になる', () => {
    expect(clampInt(NaN, 1, 10)).toBe(1);
    expect(clampInt(Infinity, 1, 10)).toBe(1);
  });
});

describe('buildFlexDeclarations', () => {
  it('既定値からdisplay:flexとgapを含む宣言を作る', () => {
    expect(buildCss(buildFlexDeclarations(DEFAULT_FLEX))).toBe(
      [
        '.container {',
        '  display: flex;',
        '  flex-direction: row;',
        '  flex-wrap: nowrap;',
        '  justify-content: flex-start;',
        '  align-items: stretch;',
        '  gap: 8px;',
        '}',
      ].join('\n'),
    );
  });
  it('nowrapではalign-contentを出力しない', () => {
    const props = buildFlexDeclarations(DEFAULT_FLEX).map((d) => d.property);
    expect(props).not.toContain('align-content');
  });
  it('wrapではalign-contentを出力する', () => {
    const decls = buildFlexDeclarations({
      ...DEFAULT_FLEX,
      wrap: 'wrap',
      alignContent: 'space-between',
    });
    expect(decls).toContainEqual({
      property: 'align-content',
      value: 'space-between',
    });
  });
  it('gapが0なら出力しない・範囲外はクランプする', () => {
    expect(
      buildFlexDeclarations({ ...DEFAULT_FLEX, gap: 0 }).map((d) => d.property),
    ).not.toContain('gap');
    expect(buildFlexDeclarations({ ...DEFAULT_FLEX, gap: 999 }).at(-1)).toEqual(
      { property: 'gap', value: '100px' },
    );
  });
});

describe('buildGridDeclarations', () => {
  it('列数からrepeat()を作り、行は未指定なら出力しない', () => {
    const decls = buildGridDeclarations(DEFAULT_GRID);
    expect(decls).toContainEqual({
      property: 'grid-template-columns',
      value: 'repeat(3, 1fr)',
    });
    expect(decls.map((d) => d.property)).not.toContain('grid-template-rows');
  });
  it('行数を指定するとgrid-template-rowsを出力する', () => {
    const decls = buildGridDeclarations({ ...DEFAULT_GRID, rows: 2 });
    expect(decls).toContainEqual({
      property: 'grid-template-rows',
      value: 'repeat(2, 1fr)',
    });
  });
  it('行間と列間が同じなら1値、異なれば「行 列」の2値で出力する', () => {
    expect(buildGridDeclarations(DEFAULT_GRID)).toContainEqual({
      property: 'gap',
      value: '8px',
    });
    expect(
      buildGridDeclarations({ ...DEFAULT_GRID, rowGap: 4, columnGap: 16 }),
    ).toContainEqual({ property: 'gap', value: '4px 16px' });
  });
  it('gapが両方0ならgapを出力しない', () => {
    const decls = buildGridDeclarations({
      ...DEFAULT_GRID,
      rowGap: 0,
      columnGap: 0,
    });
    expect(decls.map((d) => d.property)).not.toContain('gap');
  });
  it('列数は1〜12にクランプする', () => {
    expect(
      buildGridDeclarations({ ...DEFAULT_GRID, columns: 0 })[1].value,
    ).toBe('repeat(1, 1fr)');
    expect(
      buildGridDeclarations({ ...DEFAULT_GRID, columns: 50 })[1].value,
    ).toBe('repeat(12, 1fr)');
  });
  it('列数がNaNなら1列になる', () => {
    expect(
      buildGridDeclarations({ ...DEFAULT_GRID, columns: NaN })[1].value,
    ).toBe('repeat(1, 1fr)');
  });
  it('行数は0〜12にクランプし、負数や0なら行を出力しない', () => {
    expect(
      buildGridDeclarations({ ...DEFAULT_GRID, rows: 99 }).find(
        (d) => d.property === 'grid-template-rows',
      ),
    ).toEqual({ property: 'grid-template-rows', value: 'repeat(12, 1fr)' });
    expect(
      buildGridDeclarations({ ...DEFAULT_GRID, rows: -1 }).map(
        (d) => d.property,
      ),
    ).not.toContain('grid-template-rows');
  });
  it('行間だけ0の場合は「0px 列間」の2値で出力する', () => {
    expect(
      buildGridDeclarations({ ...DEFAULT_GRID, rowGap: 0, columnGap: 8 }),
    ).toContainEqual({ property: 'gap', value: '0px 8px' });
  });
  it('gapの値は0〜100にクランプする', () => {
    expect(
      buildGridDeclarations({ ...DEFAULT_GRID, rowGap: 500, columnGap: 500 }),
    ).toContainEqual({ property: 'gap', value: '100px' });
    expect(
      buildGridDeclarations({ ...DEFAULT_GRID, rowGap: -5, columnGap: -5 }).map(
        (d) => d.property,
      ),
    ).not.toContain('gap');
  });
});

describe('clampInt 追加ケース', () => {
  it('小数は四捨五入し、負の小数の0付近も0になる', () => {
    expect(clampInt(2.5, 0, 10)).toBe(3);
    expect(clampInt(-0.4, 0, 10)).toBe(0);
  });
});

describe('buildFlexDeclarations 追加ケース', () => {
  it('wrap-reverseでもalign-contentを出力する', () => {
    const decls = buildFlexDeclarations({
      ...DEFAULT_FLEX,
      wrap: 'wrap-reverse',
      alignContent: 'center',
    });
    expect(decls).toContainEqual({
      property: 'align-content',
      value: 'center',
    });
  });
  it('負のgapは0として扱い、gapを出力しない', () => {
    expect(
      buildFlexDeclarations({ ...DEFAULT_FLEX, gap: -10 }).map(
        (d) => d.property,
      ),
    ).not.toContain('gap');
  });
  it('gapが小数なら四捨五入して px を付ける', () => {
    expect(buildFlexDeclarations({ ...DEFAULT_FLEX, gap: 7.6 }).at(-1)).toEqual(
      { property: 'gap', value: '8px' },
    );
  });
});

describe('buildCss 追加ケース', () => {
  it('セレクタを指定できる', () => {
    expect(buildCss([{ property: 'display', value: 'grid' }], '#app')).toBe(
      '#app {\n  display: grid;\n}',
    );
  });
  it('宣言が空でも空ブロックを返す', () => {
    expect(buildCss([])).toBe('.container {\n\n}');
  });
});
