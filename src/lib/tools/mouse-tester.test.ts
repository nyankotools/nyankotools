import { describe, it, expect } from 'vitest';
import {
  buttonId,
  calculateCps,
  countChatter,
  estimatePollingRate,
  recentCps,
  snapPollingRate,
} from './mouse-tester';

describe('buttonId', () => {
  it('ボタン番号を識別子にする', () => {
    expect(buttonId(0)).toBe('left');
    expect(buttonId(1)).toBe('middle');
    expect(buttonId(2)).toBe('right');
    expect(buttonId(3)).toBe('back');
    expect(buttonId(4)).toBe('forward');
    expect(buttonId(7)).toBe('other');
  });
});

describe('calculateCps', () => {
  it('回数÷秒', () => {
    expect(calculateCps(50, 5000)).toBe(10);
  });
  it('0や不正は0', () => {
    expect(calculateCps(0, 1000)).toBe(0);
    expect(calculateCps(5, 0)).toBe(0);
  });
});

describe('recentCps', () => {
  it('直近1秒以内の数だけ数える', () => {
    expect(recentCps([0, 500, 1200, 1500], 1500)).toBe(3);
  });
});

describe('countChatter', () => {
  it('しきい値未満の間隔を数える', () => {
    expect(countChatter([0, 20, 200, 210], 50)).toBe(2);
    expect(countChatter([0], 50)).toBe(0);
  });
});

describe('estimatePollingRate', () => {
  it('1msごとなら約1000Hz', () => {
    const ts = Array.from({ length: 30 }, (_, i) => i);
    expect(estimatePollingRate(ts)).toBeCloseTo(1000);
  });
  it('8msごとなら約125Hz。長い停止は無視する', () => {
    const ts = Array.from({ length: 20 }, (_, i) => i * 8);
    ts.push(1000, 1008, 1016);
    expect(estimatePollingRate(ts)).toBeCloseTo(125);
  });
  it('サンプル不足は null', () => {
    expect(estimatePollingRate([0, 1, 2])).toBeNull();
    expect(estimatePollingRate([])).toBeNull();
  });
});

describe('snapPollingRate', () => {
  it('近い標準値に丸める', () => {
    expect(snapPollingRate(940)).toBe(1000);
    expect(snapPollingRate(130)).toBe(125);
    expect(snapPollingRate(510)).toBe(500);
  });
  it('どれにも近くなければ四捨五入', () => {
    expect(snapPollingRate(700)).toBe(700);
  });
});
