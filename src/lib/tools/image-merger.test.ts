import { describe, it, expect } from 'vitest';
import {
  isLayoutWithinLimit,
  layoutImages,
  mergedFileName,
  moveItem,
  type MergeOptions,
} from './image-merger';

const base: MergeOptions = {
  direction: 'horizontal',
  columns: 2,
  gap: 0,
  margin: 0,
  fit: false,
  align: 'start',
};
const sizes = [
  { width: 100, height: 50 },
  { width: 60, height: 80 },
];

describe('layoutImages', () => {
  it('空なら大きさ0', () => {
    expect(layoutImages([], base)).toEqual({ width: 0, height: 0, items: [] });
  });

  it('横並び: 幅は合計、高さは最大。間隔と余白が入る', () => {
    const l = layoutImages(sizes, { ...base, gap: 10, margin: 5 });
    expect(l.width).toBe(100 + 60 + 10 + 10);
    expect(l.height).toBe(80 + 10);
    expect(l.items[1]).toMatchObject({ x: 5 + 100 + 10, y: 5 });
  });

  it('横並びの揃え位置（上・中央・下）', () => {
    const y = (align: 'start' | 'center' | 'end') =>
      layoutImages(sizes, { ...base, align }).items[0].y;
    expect(y('start')).toBe(0);
    expect(y('center')).toBe(15);
    expect(y('end')).toBe(30);
  });

  it('横並びで大きさをそろえると高さが最大に合う', () => {
    const l = layoutImages(sizes, { ...base, fit: true });
    expect(l.height).toBe(80);
    expect(l.items[0]).toMatchObject({ width: 160, height: 80 });
    expect(l.items[1]).toMatchObject({ width: 60, height: 80 });
    expect(l.width).toBe(220);
  });

  it('縦並び: 高さは合計、幅は最大。そろえると幅に合う', () => {
    const l = layoutImages(sizes, { ...base, direction: 'vertical' });
    expect(l).toMatchObject({ width: 100, height: 130 });
    const f = layoutImages(sizes, {
      ...base,
      direction: 'vertical',
      fit: true,
    });
    expect(f.items[1]).toMatchObject({ width: 100, height: 133 });
  });

  it('グリッド: 最大サイズを1マスとして行・列に並べる', () => {
    const four = [...sizes, ...sizes];
    const l = layoutImages(four, {
      ...base,
      direction: 'grid',
      columns: 2,
      gap: 4,
    });
    expect(l.width).toBe(100 * 2 + 4);
    expect(l.height).toBe(80 * 2 + 4);
    expect(l.items[2]).toMatchObject({ x: 0, y: 84 });
    expect(l.items[3].x).toBe(104);
  });

  it('グリッドで大きさをそろえるとマスに収まる', () => {
    const l = layoutImages(sizes, {
      ...base,
      direction: 'grid',
      columns: 2,
      fit: true,
      align: 'center',
    });
    const [a, b] = l.items;
    expect(a.width).toBeLessThanOrEqual(100);
    expect(a.height).toBeLessThanOrEqual(80);
    expect(a).toMatchObject({ width: 100, height: 50 });
    expect(b).toMatchObject({ width: 60, height: 80 });
    expect(b.x).toBeGreaterThanOrEqual(100);
  });

  it('列数は画像の枚数と範囲に収まる', () => {
    const l = layoutImages(sizes, { ...base, direction: 'grid', columns: 99 });
    expect(l.items[1].y).toBe(0);
    const one = layoutImages(sizes, { ...base, direction: 'grid', columns: 0 });
    expect(one.items[1].x).toBe(0);
  });

  it('不正な数値（NaN・負）でも落ちない', () => {
    const l = layoutImages(sizes, { ...base, gap: NaN, margin: -5 });
    expect(l.width).toBe(160);
  });
});

describe('isLayoutWithinLimit / moveItem / mergedFileName', () => {
  it('大きさの上限を判定する', () => {
    expect(isLayoutWithinLimit({ width: 100, height: 100 })).toBe(true);
    expect(isLayoutWithinLimit({ width: 20000, height: 10 })).toBe(false);
    expect(isLayoutWithinLimit({ width: 0, height: 10 })).toBe(false);
  });

  it('要素を動かす。範囲外は何もしない', () => {
    expect(moveItem([1, 2, 3], 0, 1)).toEqual([2, 1, 3]);
    expect(moveItem([1, 2, 3], 2, 0)).toEqual([3, 1, 2]);
    expect(moveItem([1, 2, 3], 0, -1)).toEqual([1, 2, 3]);
    expect(moveItem([1, 2, 3], 3, 0)).toEqual([1, 2, 3]);
  });

  it('ファイル名の拡張子', () => {
    expect(mergedFileName('png')).toBe('merged.png');
    expect(mergedFileName('jpeg')).toBe('merged.jpg');
  });
});
