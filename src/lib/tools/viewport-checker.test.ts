import { describe, expect, it } from 'vitest';
import {
  getActiveBreakpoint,
  getOrientation,
  TAILWIND_BREAKPOINTS,
  type BreakpointDefinition,
} from './viewport-checker';

describe('getActiveBreakpoint', () => {
  it('境界値未満は一段階下のブレークポイントを返す', () => {
    expect(getActiveBreakpoint(639)).toBeNull();
    expect(getActiveBreakpoint(767)).toBe('sm');
    expect(getActiveBreakpoint(1023)).toBe('md');
    expect(getActiveBreakpoint(1279)).toBe('lg');
    expect(getActiveBreakpoint(1535)).toBe('xl');
  });

  it('境界値ちょうどはその段階のブレークポイントを返す', () => {
    expect(getActiveBreakpoint(640)).toBe('sm');
    expect(getActiveBreakpoint(768)).toBe('md');
    expect(getActiveBreakpoint(1024)).toBe('lg');
    expect(getActiveBreakpoint(1280)).toBe('xl');
    expect(getActiveBreakpoint(1536)).toBe('2xl');
  });

  it('0や負の値、640px未満はnullを返す', () => {
    expect(getActiveBreakpoint(0)).toBeNull();
    expect(getActiveBreakpoint(375)).toBeNull();
    expect(getActiveBreakpoint(-1)).toBeNull();
  });

  it('1536pxを超える幅も2xlのまま', () => {
    expect(getActiveBreakpoint(3000)).toBe('2xl');
  });

  it('カスタムのbreakpoints配列を渡せば独自の定義で判定できる', () => {
    const custom: BreakpointDefinition[] = [
      { name: 'wide', minWidth: 2000 },
      { name: 'narrow', minWidth: 500 },
    ];
    expect(getActiveBreakpoint(2500, custom)).toBe('wide');
    expect(getActiveBreakpoint(1000, custom)).toBe('narrow');
    expect(getActiveBreakpoint(100, custom)).toBeNull();
  });

  it('TAILWIND_BREAKPOINTSは幅の広い順に並んでいる', () => {
    const widths = TAILWIND_BREAKPOINTS.map((bp) => bp.minWidth);
    const sorted = [...widths].sort((a, b) => b - a);
    expect(widths).toEqual(sorted);
  });

  it('小数の幅でも境界値未満/以上を正しく判定する（ブラウザズーム等でinnerWidthが非整数になるケース）', () => {
    expect(getActiveBreakpoint(639.98)).toBeNull();
    expect(getActiveBreakpoint(640.02)).toBe('sm');
    expect(getActiveBreakpoint(1023.99)).toBe('md');
    expect(getActiveBreakpoint(1024.01)).toBe('lg');
  });

  it('NaNはどのブレークポイントにも一致せずnullを返す', () => {
    expect(getActiveBreakpoint(NaN)).toBeNull();
  });

  it('Infinityは最大のブレークポイント(2xl)を返す', () => {
    expect(getActiveBreakpoint(Infinity)).toBe('2xl');
  });

  it('空のbreakpoints配列を渡すと常にnullを返す', () => {
    expect(getActiveBreakpoint(2000, [])).toBeNull();
  });
});

describe('getOrientation', () => {
  it('幅が高さ以上なら横向き（landscape）', () => {
    expect(getOrientation(1024, 768)).toBe('landscape');
  });

  it('幅が高さ未満なら縦向き（portrait）', () => {
    expect(getOrientation(375, 812)).toBe('portrait');
  });

  it('幅と高さが等しい場合は横向き扱い', () => {
    expect(getOrientation(500, 500)).toBe('landscape');
  });

  it('幅・高さが0の場合も横向き扱い（0 >= 0）', () => {
    expect(getOrientation(0, 0)).toBe('landscape');
  });

  it('NaNを渡した場合は比較が常にfalseになりportraitを返す', () => {
    expect(getOrientation(NaN, 500)).toBe('portrait');
    expect(getOrientation(500, NaN)).toBe('portrait');
  });
});
