import { describe, it, expect } from 'vitest';
import {
  MAX_BPM,
  MAX_TAPS,
  MIN_BPM,
  TAP_RESET_MS,
  addTap,
  beatSeconds,
  bpmFromTaps,
  clampBeatsPerBar,
  clampBpm,
  tempoTerm,
  tickInfo,
  tickSeconds,
} from './metronome-bpm';

describe('clampBpm', () => {
  it('範囲内の値は整数に丸める', () => {
    expect(clampBpm(120)).toBe(120);
    expect(clampBpm(120.6)).toBe(121);
  });
  it('範囲外は上下限に収める', () => {
    expect(clampBpm(5)).toBe(MIN_BPM);
    expect(clampBpm(9999)).toBe(MAX_BPM);
  });
  it('数値でなければ 120', () => {
    expect(clampBpm(NaN)).toBe(120);
    expect(clampBpm(Infinity)).toBe(120);
  });
});

describe('clampBeatsPerBar', () => {
  it('1〜12 に収める', () => {
    expect(clampBeatsPerBar(0)).toBe(1);
    expect(clampBeatsPerBar(4)).toBe(4);
    expect(clampBeatsPerBar(20)).toBe(12);
    expect(clampBeatsPerBar(NaN)).toBe(4);
  });
});

describe('beatSeconds / tickSeconds', () => {
  it('120BPM は1拍0.5秒', () => {
    expect(beatSeconds(120)).toBeCloseTo(0.5);
  });
  it('分割数で割った長さになる', () => {
    expect(tickSeconds(120, 2)).toBeCloseTo(0.25);
    expect(tickSeconds(60, 3)).toBeCloseTo(1 / 3);
  });
});

describe('tickInfo', () => {
  it('4拍子・分割なしは1拍目だけアクセント', () => {
    const infos = [0, 1, 2, 3, 4].map((n) => tickInfo(n, 4, 1));
    expect(infos.map((i) => i.beat)).toEqual([1, 2, 3, 4, 1]);
    expect(infos.map((i) => i.accent)).toEqual([
      true,
      false,
      false,
      false,
      true,
    ]);
  });
  it('八分分割では拍の頭と裏を区別する', () => {
    expect(tickInfo(0, 3, 2)).toEqual({ beat: 1, sub: 0, accent: true });
    expect(tickInfo(1, 3, 2)).toEqual({ beat: 1, sub: 1, accent: false });
    expect(tickInfo(2, 3, 2)).toEqual({ beat: 2, sub: 0, accent: false });
    expect(tickInfo(6, 3, 2)).toEqual({ beat: 1, sub: 0, accent: true });
  });
  it('1拍子では毎拍アクセント', () => {
    expect(tickInfo(3, 1, 1).accent).toBe(true);
  });
  it('12拍子では12拍目の後に1拍目へ戻る（小節をまたぐ）', () => {
    expect(tickInfo(11, 12, 1)).toEqual({ beat: 12, sub: 0, accent: false });
    expect(tickInfo(12, 12, 1)).toEqual({ beat: 1, sub: 0, accent: true });
  });
  it('負の番号は0打目として扱う', () => {
    expect(tickInfo(-3, 4, 1)).toEqual({ beat: 1, sub: 0, accent: true });
  });
  it('三連符（分割3）では拍の頭だけ sub=0 になる', () => {
    expect(tickInfo(3, 4, 3)).toEqual({ beat: 2, sub: 0, accent: false });
    expect(tickInfo(4, 4, 3)).toEqual({ beat: 2, sub: 1, accent: false });
  });
});

describe('beatSeconds の範囲外入力', () => {
  it('範囲外のBPMは上下限に収めてから計算する', () => {
    expect(beatSeconds(5)).toBeCloseTo(3); // 20BPM
    expect(beatSeconds(1000)).toBeCloseTo(0.2); // 300BPM
    expect(tickSeconds(300, 4)).toBeCloseTo(0.05);
  });
});

describe('addTap', () => {
  it('間隔が短ければ追加される', () => {
    expect(addTap([0, 500], 1000)).toEqual([0, 500, 1000]);
  });
  it('TAP_RESET_MS 以上空くと数え直す', () => {
    expect(addTap([0, 500], 500 + TAP_RESET_MS)).toEqual([500 + TAP_RESET_MS]);
  });
  it('直近 MAX_TAPS 件だけ残す', () => {
    let taps: number[] = [];
    for (let i = 0; i < MAX_TAPS + 5; i++) taps = addTap(taps, i * 400);
    expect(taps).toHaveLength(MAX_TAPS);
    expect(taps[taps.length - 1]).toBe((MAX_TAPS + 4) * 400);
  });
  it('空の列に最初のタップを加えられる', () => {
    expect(addTap([], 100)).toEqual([100]);
  });
  it('TAP_RESET_MS の直前（差が1ms少ない）ではまだ数え直さない', () => {
    expect(addTap([0], TAP_RESET_MS - 1)).toEqual([0, TAP_RESET_MS - 1]);
  });
});

describe('bpmFromTaps', () => {
  it('2回未満は null', () => {
    expect(bpmFromTaps([])).toBeNull();
    expect(bpmFromTaps([100])).toBeNull();
  });
  it('500ms 間隔は 120BPM', () => {
    expect(bpmFromTaps([0, 500, 1000, 1500])).toBeCloseTo(120);
  });
  it('間隔のばらつきは平均される', () => {
    expect(bpmFromTaps([0, 480, 1000])).toBeCloseTo(120);
  });
  it('同時刻だけなら null', () => {
    expect(bpmFromTaps([100, 100])).toBeNull();
  });
  it('間隔の平均から BPM を計算する（丸めない）', () => {
    // 1000ms 間隔で3回 → 2000ms / 2 = 1000ms → 60BPM
    expect(bpmFromTaps([0, 1000, 2000])).toBeCloseTo(60);
    // 400ms 間隔で2回 → 150BPM
    expect(bpmFromTaps([0, 400])).toBeCloseTo(150);
  });
});

describe('tempoTerm', () => {
  it('代表的な値の速度標語', () => {
    expect(tempoTerm(60)).toBe('Larghetto');
    expect(tempoTerm(72)).toBe('Adagio');
    expect(tempoTerm(100)).toBe('Andante');
    expect(tempoTerm(120)).toBe('Allegro');
    expect(tempoTerm(140)).toBe('Allegro');
    expect(tempoTerm(180)).toBe('Presto');
    expect(tempoTerm(250)).toBe('Prestissimo');
  });
  it('境界値の速度標語（上限は含まない）', () => {
    expect(tempoTerm(39)).toBe('Grave');
    expect(tempoTerm(40)).toBe('Largo');
    expect(tempoTerm(199)).toBe('Presto');
    expect(tempoTerm(200)).toBe('Prestissimo');
  });
  it('範囲外のBPMは上下限に収めてから判定する', () => {
    expect(tempoTerm(5)).toBe('Grave');
    expect(tempoTerm(9999)).toBe('Prestissimo');
  });
});
