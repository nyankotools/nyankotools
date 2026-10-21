import { describe, expect, it } from 'vitest';
import {
  BACKGROUNDS,
  SPEEDS,
  analyzeFrames,
  pixelsPerFrame,
  positionAt,
  stepSpeed,
  wrap,
} from './ufo-motion-test';

describe('wrap', () => {
  it('範囲内に折り返す', () => {
    expect(wrap(5, 10)).toBe(5);
    expect(wrap(25, 10)).toBe(5);
    expect(wrap(-3, 10)).toBe(7);
  });
  it('不正なspanや値は0', () => {
    expect(wrap(5, 0)).toBe(0);
    expect(wrap(5, -1)).toBe(0);
    expect(wrap(NaN, 10)).toBe(0);
    expect(wrap(5, Infinity)).toBe(0);
  });
});

describe('positionAt', () => {
  it('開始時は画面左外（-objectWidth）', () => {
    expect(positionAt(0, 480, 1000, 100)).toBe(-100);
  });
  it('速度に比例して右へ進む', () => {
    expect(positionAt(1000, 480, 1000, 100)).toBe(380);
  });
  it('1周すると元の位置に戻る', () => {
    // span=1100, 速度1100px/s なら1秒で1周
    expect(positionAt(1000, 1100, 1000, 100)).toBeCloseTo(-100, 9);
  });
  it('右→左は開始時に右端', () => {
    expect(positionAt(0, 480, 1000, 100, -1)).toBe(1000);
    expect(positionAt(1000, 480, 1000, 100, -1)).toBe(520);
  });
  it('常に -objectWidth 以上 viewWidth 未満', () => {
    for (let t = 0; t < 5000; t += 37) {
      const x = positionAt(t, 1920, 800, 60);
      expect(x).toBeGreaterThanOrEqual(-60);
      expect(x).toBeLessThan(800);
    }
  });
  it('幅0でも例外にならない', () => {
    expect(positionAt(100, 480, 0, 0)).toBe(0);
  });
});

describe('pixelsPerFrame', () => {
  it('速度/レート', () => {
    expect(pixelsPerFrame(960, 60)).toBe(16);
    expect(pixelsPerFrame(960, 120)).toBe(8);
  });
  it('不正なレートはnull', () => {
    expect(pixelsPerFrame(960, 0)).toBeNull();
    expect(pixelsPerFrame(960, NaN)).toBeNull();
    expect(pixelsPerFrame(960, -60)).toBeNull();
  });
});

describe('stepSpeed', () => {
  it('1段階上げ下げする', () => {
    expect(stepSpeed(480, 1)).toBe(960);
    expect(stepSpeed(480, -1)).toBe(240);
  });
  it('端でクランプする', () => {
    expect(stepSpeed(SPEEDS[0], -1)).toBe(SPEEDS[0]);
    expect(stepSpeed(SPEEDS[SPEEDS.length - 1], 1)).toBe(
      SPEEDS[SPEEDS.length - 1],
    );
  });
  it('未知の速度は最も近い段階から動く', () => {
    expect(stepSpeed(500, 1)).toBe(960);
  });
});

describe('analyzeFrames', () => {
  const make = (intervals: number[]) => {
    const ts = [0];
    for (const d of intervals) ts.push(ts[ts.length - 1] + d);
    return ts;
  };

  it('間隔が足りなければnull', () => {
    expect(analyzeFrames([])).toBeNull();
    expect(analyzeFrames([0, 16])).toBeNull();
  });
  it('一定間隔ならsmooth', () => {
    const a = analyzeFrames(make(Array(120).fill(1000 / 60)))!;
    expect(a.verdict).toBe('smooth');
    expect(a.skippedFrames).toBe(0);
    expect(a.hz).toBeCloseTo(60, 5);
    expect(a.skipRatio).toBe(0);
  });
  it('2倍の間隔は1フレーム飛びとして数える', () => {
    const a = analyzeFrames(
      make([...Array(50).fill(10), 20, ...Array(50).fill(10)]),
    )!;
    expect(a.skippedFrames).toBe(1);
    expect(a.skipEvents).toBe(1);
    expect(a.worstSkip).toBe(1);
  });
  it('4倍の間隔は3フレーム飛び、worstSkipに反映される', () => {
    const a = analyzeFrames(
      make([...Array(50).fill(10), 40, ...Array(50).fill(10)]),
    )!;
    expect(a.skippedFrames).toBe(3);
    expect(a.worstSkip).toBe(3);
  });
  it('1.5倍以内の揺らぎは飛びとしない', () => {
    const a = analyzeFrames(make([10, 10, 14, 10, 10]))!;
    expect(a.skippedFrames).toBe(0);
  });
  it('飛びが1%未満ならminor', () => {
    const a = analyzeFrames(make([...Array(300).fill(10), 20]))!;
    expect(a.verdict).toBe('minor');
  });
  it('飛びが多ければstutter', () => {
    const a = analyzeFrames(make([...Array(20).fill(10), 30, 30, 30]))!;
    expect(a.verdict).toBe('stutter');
  });
  it('250ms超の中断と逆行タイムスタンプは除外する', () => {
    const a = analyzeFrames([0, 10, 20, 30, 1000, 1010, 1020, 1010, 1020])!;
    expect(a.skippedFrames).toBe(0);
    expect(a.frames).toBe(6);
  });
  it('入力配列を変更しない', () => {
    const ts = [0, 10, 20, 30];
    analyzeFrames(ts);
    expect(ts).toEqual([0, 10, 20, 30]);
  });
});

describe('BACKGROUNDS', () => {
  it('3種類あり図形色は背景と異なる', () => {
    expect(BACKGROUNDS).toHaveLength(3);
    for (const b of BACKGROUNDS) expect(b.fg).not.toBe(b.bg);
  });
});
