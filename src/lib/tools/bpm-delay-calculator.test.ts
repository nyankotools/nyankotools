import { describe, expect, it } from 'vitest';
import {
  addTap,
  beatMs,
  bpmFromTaps,
  clampBpm,
  delayTable,
  formatHz,
  formatMs,
  msToHz,
  noteMs,
  reverbGuide,
} from './bpm-delay-calculator';

describe('clampBpm', () => {
  it('範囲内の小数は小数第2位まで保つ', () => {
    expect(clampBpm(128.456)).toBe(128.46);
  });
  it('範囲外は収める', () => {
    expect(clampBpm(5)).toBe(20);
    expect(clampBpm(999)).toBe(300);
  });
  it('数値でなければ 120', () => {
    expect(clampBpm(NaN)).toBe(120);
    expect(clampBpm(Infinity)).toBe(120);
  });
});

describe('noteMs', () => {
  it('120 BPM の四分音符は 500ms', () => {
    expect(beatMs(120)).toBe(500);
    expect(noteMs(120, 4)).toBe(500);
  });
  it('全音符は4拍、64分音符は1/16拍', () => {
    expect(noteMs(120, 1)).toBe(2000);
    expect(noteMs(120, 64)).toBeCloseTo(31.25);
  });
  it('付点は1.5倍、3連符は2/3', () => {
    expect(noteMs(120, 8, 'dotted')).toBe(375);
    expect(noteMs(120, 8, 'triplet')).toBeCloseTo(166.6667, 3);
  });
  it('60 BPM の四分音符は 1000ms', () => {
    expect(noteMs(60, 4)).toBe(1000);
  });
});

describe('msToHz', () => {
  it('500ms は 2Hz', () => {
    expect(msToHz(500)).toBe(2);
  });
  it('0 以下や非有限は 0', () => {
    expect(msToHz(0)).toBe(0);
    expect(msToHz(-1)).toBe(0);
    expect(msToHz(NaN)).toBe(0);
  });
});

describe('delayTable', () => {
  it('7行（全音符〜64分音符）を返す', () => {
    const rows = delayTable(120);
    expect(rows.map((r) => r.denominator)).toEqual([1, 2, 4, 8, 16, 32, 64]);
    expect(rows[2]).toEqual({
      denominator: 4,
      straight: 500,
      dotted: 750,
      triplet: expect.closeTo(333.3333, 3),
    });
  });
});

describe('reverbGuide', () => {
  it('プリディレイとディケイの目安を返す', () => {
    const items = reverbGuide(120);
    expect(items.filter((i) => i.group === 'predelay')).toHaveLength(4);
    expect(items.find((i) => i.denominator === 16)?.ms).toBe(125);
    expect(
      items.find((i) => i.group === 'decay' && i.denominator === 1)?.ms,
    ).toBe(2000);
  });
});

describe('format', () => {
  it('末尾の 0 を省く', () => {
    expect(formatMs(500)).toBe('500');
    expect(formatMs(166.66667)).toBe('166.67');
    expect(formatMs(31.25)).toBe('31.25');
    expect(formatHz(2.5)).toBe('2.5');
  });
  it('非有限は 0', () => {
    expect(formatMs(NaN)).toBe('0');
  });
});

describe('タップテンポ', () => {
  it('500ms 間隔は 120 BPM', () => {
    expect(bpmFromTaps([0, 500, 1000, 1500])).toBeCloseTo(120);
  });
  it('2回未満は null', () => {
    expect(bpmFromTaps([])).toBeNull();
    expect(bpmFromTaps([100])).toBeNull();
    expect(bpmFromTaps([100, 100])).toBeNull();
  });
  it('ちょうど3秒空いた場合も数え直す（境界）', () => {
    expect(addTap([0], 2999)).toEqual([0, 2999]);
    expect(addTap([0], 3000)).toEqual([3000]);
  });
  it('極端に速い・遅いテンポでも BPM 範囲に収まる', () => {
    expect(clampBpm(bpmFromTaps([0, 10])!)).toBe(300);
    expect(clampBpm(bpmFromTaps([0, 2900])!)).toBe(20.69);
  });
  it('3秒以上空くと数え直し、直近8件だけ残す', () => {
    expect(addTap([0, 500], 4000)).toEqual([4000]);
    let taps: number[] = [];
    for (let i = 0; i < 12; i++) taps = addTap(taps, i * 500);
    expect(taps).toHaveLength(8);
    expect(taps[0]).toBe(4 * 500);
  });
});
