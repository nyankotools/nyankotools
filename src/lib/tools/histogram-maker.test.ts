import { describe, expect, it } from 'vitest';
import {
  autoWidth,
  binLabel,
  buildHistogram,
  histogramToDelimited,
  parseNumbers,
  percentText,
  sturgesBinCount,
  type Histogram,
} from './histogram-maker';

function ok(r: ReturnType<typeof buildHistogram>): Histogram {
  if ('error' in r) throw new Error(r.error);
  return r;
}

describe('buildHistogram', () => {
  it('左閉右開で度数を数える', () => {
    const h = ok(buildHistogram([0, 9, 10, 19, 20], { width: 10, start: 0 }));
    expect(h.bins.map((b) => b.count)).toEqual([2, 2, 1]);
    expect(h.bins[1].lower).toBe(10);
    expect(h.bins[1].upper).toBe(20);
  });

  it('最大値が階級の境界上でも最後の階級に含まれる', () => {
    const h = ok(buildHistogram([1, 10], { width: 3, start: 1 }));
    // [1,4) [4,7) [7,10) [10,13)
    expect(h.bins.map((b) => b.count)).toEqual([1, 0, 0, 1]);
  });

  it('相対度数・累積度数・累積相対度数を求める', () => {
    const h = ok(buildHistogram([1, 2, 3, 11], { width: 10, start: 0 }));
    expect(h.bins[0].relative).toBeCloseTo(0.75);
    expect(h.bins[1].cumulative).toBe(4);
    expect(h.bins[1].cumulativeRelative).toBe(1);
    expect(h.bins[0].midpoint).toBe(5);
  });

  it('小数の階級幅でも誤差で階級がずれない', () => {
    const h = ok(buildHistogram([0.3, 0.1, 0.2], { width: 0.1, start: 0 }));
    expect(h.bins.map((b) => b.count)).toEqual([0, 1, 1, 1]);
    expect(h.bins[3].lower).toBe(0.3);
  });

  it('自動指定では階級幅の倍数から始まる', () => {
    const h = ok(
      buildHistogram([23, 47, 58, 61, 79, 95], { width: 10, start: null }),
    );
    expect(h.start).toBe(20);
    expect(h.bins[h.bins.length - 1].upper).toBe(100);
  });

  it('階級幅も自動のときはデータ数に応じた階級数になる', () => {
    const values = Array.from({ length: 100 }, (_, i) => i);
    const h = ok(buildHistogram(values, { width: null, start: null }));
    expect(h.width).toBe(10);
    expect(h.bins).toHaveLength(10);
    expect(h.bins.reduce((s, b) => s + b.count, 0)).toBe(100);
  });

  it('全て同じ値でも1階級になる', () => {
    const h = ok(buildHistogram([5, 5, 5], { width: null, start: null }));
    expect(h.bins).toHaveLength(1);
    expect(h.bins[0].count).toBe(3);
  });

  it('開始値が NaN・無限大のときはエラーになる', () => {
    expect(buildHistogram([1], { width: 1, start: NaN })).toEqual({
      error: 'invalidStart',
    });
    expect(buildHistogram([1], { width: 1, start: Infinity })).toEqual({
      error: 'invalidStart',
    });
  });

  it('開始値より小さいデータは除外して数える', () => {
    const h = ok(buildHistogram([1, 5, 15], { width: 10, start: 5 }));
    expect(h.excluded).toBe(1);
    expect(h.total).toBe(2);
  });

  it('負の値も扱える', () => {
    const h = ok(buildHistogram([-15, -5, 5], { width: 10, start: null }));
    expect(h.start).toBe(-20);
    expect(h.bins.map((b) => b.count)).toEqual([1, 1, 1]);
  });

  it('エラーを返す', () => {
    expect(buildHistogram([], { width: null, start: null })).toEqual({
      error: 'empty',
    });
    expect(buildHistogram([1], { width: 0, start: null })).toEqual({
      error: 'invalidWidth',
    });
    expect(buildHistogram([1], { width: -1, start: null })).toEqual({
      error: 'invalidWidth',
    });
    expect(buildHistogram([1], { width: 1, start: 5 })).toEqual({
      error: 'invalidStart',
    });
    expect(buildHistogram([0, 1000], { width: 1, start: null })).toEqual({
      error: 'tooManyBins',
    });
    expect(
      buildHistogram(new Array(10001).fill(1), { width: 1, start: null }),
    ).toEqual({ error: 'tooMany' });
  });
});

describe('helpers', () => {
  it('スタージェスの階級数', () => {
    expect(sturgesBinCount(1)).toBe(1);
    expect(sturgesBinCount(8)).toBe(4);
    expect(sturgesBinCount(100)).toBe(8);
  });

  it('autoWidth は範囲0で1を返す', () => {
    expect(autoWidth(3, 3, 5)).toBe(1);
  });

  it('binLabel と percentText', () => {
    expect(binLabel({ lower: 0, upper: 10 })).toBe('[0, 10)');
    expect(percentText(1 / 3)).toBe('33.33');
    expect(percentText(1)).toBe('100.00');
  });

  it('CSV/TSV に変換する', () => {
    const h = ok(buildHistogram([1, 2, 11], { width: 10, start: 0 }));
    const headers = {
      bin: 'bin',
      midpoint: 'mid',
      count: 'n',
      relative: 'rel',
      cumulative: 'cum',
      cumulativeRelative: 'cumrel',
    };
    const tsv = histogramToDelimited(h.bins, headers, '\t');
    expect(tsv.split('\n')[1]).toBe('[0, 10)\t5\t2\t66.67\t2\t66.67');
    const csv = histogramToDelimited(h.bins, headers, ',');
    expect(csv.split('\n')[1]).toBe('"[0, 10)",5,2,66.67,2,66.67');
  });

  it('CSV はダブルクォートとカンマを含むセルをエスケープする', () => {
    const h = ok(buildHistogram([1], { width: 10, start: 0 }));
    const headers = {
      bin: 'a,"b"',
      midpoint: 'm',
      count: 'n',
      relative: 'r',
      cumulative: 'c',
      cumulativeRelative: 'cr',
    };
    const csv = histogramToDelimited(h.bins, headers, ',');
    expect(csv.split('\n')[0]).toBe('"a,""b""",m,n,r,c,cr');
  });

  it('TSV ではカンマやクォートをエスケープしない', () => {
    const h = ok(buildHistogram([1], { width: 10, start: 0 }));
    const headers = {
      bin: 'a,"b"',
      midpoint: 'm',
      count: 'n',
      relative: 'r',
      cumulative: 'c',
      cumulativeRelative: 'cr',
    };
    const tsv = histogramToDelimited(h.bins, headers, '\t');
    expect(tsv.split('\n')[0]).toBe('a,"b"\tm\tn\tr\tc\tcr');
  });

  it('parseNumbers を再利用している', () => {
    expect(parseNumbers('1, 2 x').values).toEqual([1, 2]);
  });
});
