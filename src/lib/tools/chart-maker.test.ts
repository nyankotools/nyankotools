import { describe, it, expect } from 'vitest';
import {
  computePieSlices,
  computeValueAxis,
  formatPercent,
  parseChartData,
  parseNumberCell,
  pngFilename,
} from './chart-maker';

describe('parseNumberCell', () => {
  it('数値・カンマ・%・全角数字を読む', () => {
    expect(parseNumberCell('12')).toBe(12);
    expect(parseNumberCell(' 1,234.5 ')).toBe(1234.5);
    expect(parseNumberCell('-3')).toBe(-3);
    expect(parseNumberCell('45%')).toBe(45);
    expect(parseNumberCell('１２．５')).toBe(12.5);
    expect(parseNumberCell('1e3')).toBe(1000);
    expect(parseNumberCell('−3')).toBe(-3);
  });
  it('空欄は null、数値でなければ undefined', () => {
    expect(parseNumberCell('')).toBeNull();
    expect(parseNumberCell('  ')).toBeNull();
    expect(parseNumberCell('abc')).toBeUndefined();
    expect(parseNumberCell('1.2.3')).toBeUndefined();
    expect(parseNumberCell('Infinity')).toBeUndefined();
    expect(parseNumberCell('1,5')).toBeUndefined();
    expect(parseNumberCell('0,500')).toBeUndefined();
    expect(parseNumberCell('1,23')).toBeUndefined();
    expect(parseNumberCell('1e300')).toBeUndefined();
  });
});

describe('parseChartData', () => {
  it('CSVを系列に変換する', () => {
    const r = parseChartData('月,売上,費用\n1月,100,60\n2月,150,\n');
    expect(r.success).toBe(true);
    if (!r.success) return;
    expect(r.data.labels).toEqual(['1月', '2月']);
    expect(r.data.series).toEqual([
      { name: '売上', values: [100, 150] },
      { name: '費用', values: [60, null] },
    ]);
  });
  it('TSVを自動判定する', () => {
    const r = parseChartData('a\tb\nx\t1');
    expect(r.success && r.data.series[0].values).toEqual([1]);
  });
  it('空入力・列不足・データ行なし', () => {
    expect(parseChartData('')).toEqual({
      success: false,
      error: { code: 'empty' },
    });
    expect(parseChartData('a\nb')).toEqual({
      success: false,
      error: { code: 'no-series' },
    });
    expect(parseChartData('a,b')).toEqual({
      success: false,
      error: { code: 'empty' },
    });
  });
  it('数値でないセルは行・列を返す', () => {
    expect(parseChartData('a,b\nx,1\ny,zz')).toEqual({
      success: false,
      error: { code: 'not-number', row: 3, column: 2 },
    });
  });
  it('閉じていない引用符', () => {
    expect(parseChartData('a,b\n"x,1')).toEqual({
      success: false,
      error: { code: 'unterminated-quote' },
    });
  });
  it('行数・系列数の上限', () => {
    const rows = Array.from({ length: 201 }, (_, i) => `r${i},1`).join('\n');
    expect(parseChartData(`a,b\n${rows}`)).toEqual({
      success: false,
      error: { code: 'too-many-rows', max: 200 },
    });
    const wide = parseChartData(`a,${'s,'.repeat(8)}s\nx,${'1,'.repeat(8)}1`);
    expect(wide).toEqual({
      success: false,
      error: { code: 'too-many-series', max: 8 },
    });
  });
});

describe('computeValueAxis', () => {
  it('棒グラフは0を含み、きりのよい範囲になる', () => {
    const a = computeValueAxis([12, 87, 45], true);
    expect(a.min).toBe(0);
    expect(a.max).toBeGreaterThanOrEqual(87);
    expect(a.ticks[0]).toBe(0);
    expect(a.ticks.at(-1)).toBe(a.max);
  });
  it('負値を含む場合は負側まで広げる', () => {
    const a = computeValueAxis([-30, 10], true);
    expect(a.min).toBeLessThanOrEqual(-30);
    expect(a.ticks).toContain(0);
  });
  it('折れ線は0を含めない', () => {
    const a = computeValueAxis([1000, 1020, 1010], false);
    expect(a.min).toBeGreaterThan(900);
    expect(a.max).toBeGreaterThanOrEqual(1020);
  });
  it('全て同じ値・空でも壊れない', () => {
    const same = computeValueAxis([5, 5], false);
    expect(same.max).toBeGreaterThan(same.min);
    const empty = computeValueAxis([null], true);
    expect(empty.max).toBeGreaterThan(empty.min);
    const zero = computeValueAxis([0, 0], true);
    expect(zero.max).toBeGreaterThan(zero.min);
  });
});

describe('computePieSlices', () => {
  const data = (values: (number | null)[]) => ({
    labels: values.map((_, i) => `L${i}`),
    series: [{ name: 's', values }],
  });
  it('割合と角度を計算し、0・空欄は除く', () => {
    const r = computePieSlices(data([1, 3, 0, null]));
    expect(r.success).toBe(true);
    if (!r.success) return;
    expect(r.slices.map((s) => s.label)).toEqual(['L0', 'L1']);
    expect(r.slices[0].fraction).toBeCloseTo(0.25);
    expect(r.slices[1].endAngle).toBeCloseTo(Math.PI * 2);
    expect(r.slices[1].startAngle).toBeCloseTo(r.slices[0].endAngle);
  });
  it('負値・合計0はエラー', () => {
    expect(computePieSlices(data([1, -1]))).toEqual({
      success: false,
      error: 'negative',
    });
    expect(computePieSlices(data([0, null]))).toEqual({
      success: false,
      error: 'zero-total',
    });
  });
});

describe('pngFilename', () => {
  it('種類を含む', () => {
    expect(pngFilename('pie')).toBe('chart-pie.png');
  });
});

describe('parseNumberCell（境界・追加の表記）', () => {
  it('3桁区切り・小数・先頭ドットを読む', () => {
    expect(parseNumberCell('1,000,000')).toBe(1000000);
    expect(parseNumberCell('-1,234,567.89')).toBe(-1234567.89);
    expect(parseNumberCell('.5')).toBe(0.5);
    expect(parseNumberCell('1e-7')).toBe(1e-7);
  });
  it('絶対値1e15は許容し、超えると不可', () => {
    expect(parseNumberCell('1000000000000000')).toBe(1e15);
    expect(parseNumberCell('-1000000000000000')).toBe(-1e15);
    expect(parseNumberCell('1000000000000001')).toBeUndefined();
  });
  it('記号だけ・不正な桁区切りは数値でない', () => {
    expect(parseNumberCell('.')).toBeUndefined();
    expect(parseNumberCell('+')).toBeUndefined();
    expect(parseNumberCell('1,2345')).toBeUndefined();
  });
});

describe('parseChartData（改行・文字種・構造の境界）', () => {
  it('CRLF改行とBOMを読める', () => {
    const crlf = parseChartData('a,b\r\nx,1\r\ny,2\r\n');
    expect(crlf.success && crlf.data.labels).toEqual(['x', 'y']);
    expect(crlf.success && crlf.data.series[0].values).toEqual([1, 2]);
    const bom = parseChartData('﻿a,b\nx,1');
    expect(bom.success && bom.data.labels).toEqual(['x']);
  });
  it('引用符内のカンマ・絵文字・全角数字を扱える', () => {
    const quoted = parseChartData('name,v\n"東京, 大阪",3');
    expect(quoted.success && quoted.data.labels).toEqual(['東京, 大阪']);
    const emoji = parseChartData('カテゴリ,値\n🍣,1\n🍙,2');
    expect(emoji.success && emoji.data.labels).toEqual(['🍣', '🍙']);
    const wide = parseChartData('a,b\nx,１２');
    expect(wide.success && wide.data.series[0].values).toEqual([12]);
  });
  it('系列名が空欄なら列番号、欠けたセルは空欄扱い', () => {
    const blankHeader = parseChartData('a,,\nx,1,2');
    expect(
      blankHeader.success && blankHeader.data.series.map((s) => s.name),
    ).toEqual(['1', '2']);
    const ragged = parseChartData('a,b,c\nx,1\n');
    expect(ragged.success && ragged.data.series[1].values).toEqual([null]);
  });
  it('200行・8系列ちょうどは成功する', () => {
    const rows = Array.from({ length: 200 }, (_, i) => `r${i},${i}`).join('\n');
    const r = parseChartData(`a,b\n${rows}`);
    expect(r.success && r.data.labels.length).toBe(200);
    const cols = Array.from({ length: 8 }, (_, i) => `s${i}`).join(',');
    const vals = Array.from({ length: 8 }, () => '1').join(',');
    const eight = parseChartData(`x,${cols}\ny,${vals}`);
    expect(eight.success && eight.data.series.length).toBe(8);
  });
  it('エラー位置は行・列とも1始まり（ヘッダーを1行目と数える）', () => {
    expect(parseChartData('a,b,c\nx,1,2\ny,3,z')).toEqual({
      success: false,
      error: { code: 'not-number', row: 3, column: 3 },
    });
  });
});

describe('computeValueAxis（極端な値）', () => {
  it('非常に小さい値・大きい値でも有限で昇順の目盛りになる', () => {
    const tiny = computeValueAxis([1e-6, 3e-6], false);
    expect(tiny.min).toBeLessThanOrEqual(1e-6);
    expect(tiny.max).toBeGreaterThanOrEqual(3e-6);
    const huge = computeValueAxis([1e15, -1e15], true);
    expect(huge.min).toBeLessThanOrEqual(-1e15);
    expect(huge.max).toBeGreaterThanOrEqual(1e15);
    for (const a of [tiny, huge]) {
      expect(a.ticks.every(Number.isFinite)).toBe(true);
      expect(a.ticks.length).toBeLessThanOrEqual(201);
      expect(a.ticks).toEqual([...a.ticks].sort((x, y) => x - y));
    }
  });
  it('棒グラフで全て負の値なら0で終わる', () => {
    const a = computeValueAxis([-5, -2], true);
    expect(a.max).toBe(0);
    expect(a.ticks.at(-1)).toBe(0);
  });
  it('乱数的な入力でも全ての値が範囲内に収まる（性質テスト）', () => {
    let seed = 42;
    const rand = () => {
      seed = (seed * 1103515245 + 12345) % 2147483648;
      return seed / 2147483648;
    };
    for (let trial = 0; trial < 200; trial++) {
      const values = Array.from({ length: 1 + Math.floor(rand() * 10) }, () =>
        Math.round((rand() - 0.5) * Math.pow(10, Math.floor(rand() * 8))),
      );
      for (const includeZero of [true, false]) {
        const a = computeValueAxis(values, includeZero);
        expect(a.min).toBeLessThanOrEqual(Math.min(...values));
        expect(a.max).toBeGreaterThanOrEqual(Math.max(...values));
        expect(a.max).toBeGreaterThan(a.min);
      }
    }
  });
});

describe('computePieSlices（境界）', () => {
  it('系列が1つだけなら全体を1つのスライスにする', () => {
    const r = computePieSlices({
      labels: ['A'],
      series: [{ name: 's', values: [7] }],
    });
    expect(r.success).toBe(true);
    if (!r.success) return;
    expect(r.slices[0].fraction).toBe(1);
    expect(r.slices[0].endAngle).toBeCloseTo(Math.PI * 2);
  });
  it('全て空欄・存在しない系列番号はエラー', () => {
    const data = {
      labels: ['A', 'B'],
      series: [{ name: 's', values: [null, null] }],
    };
    expect(computePieSlices(data)).toEqual({
      success: false,
      error: 'zero-total',
    });
    expect(computePieSlices(data, 3)).toEqual({
      success: false,
      error: 'no-values',
    });
  });
  it('割合の合計は1になる', () => {
    const r = computePieSlices({
      labels: ['A', 'B', 'C'],
      series: [{ name: 's', values: [1, 2, 4] }],
    });
    expect(r.success).toBe(true);
    if (!r.success) return;
    const sum = r.slices.reduce((s, x) => s + x.fraction, 0);
    expect(sum).toBeCloseTo(1);
  });
});

describe('formatPercent', () => {
  it('小数第1位で四捨五入し%を付ける', () => {
    expect(formatPercent(0.12345)).toBe('12.3%');
    expect(formatPercent(1)).toBe('100.0%');
  });
});
