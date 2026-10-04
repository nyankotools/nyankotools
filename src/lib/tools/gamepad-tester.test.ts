import { describe, it, expect } from 'vitest';
import {
  applyDeadzone,
  buttonLabel,
  buttonPercent,
  formatAxis,
  groupAxes,
  isDrifting,
  stickMagnitude,
} from './gamepad-tester';

describe('buttonLabel', () => {
  it('standard 配置は名前付き', () => {
    expect(buttonLabel(0, 'standard')).toBe('A / ✕');
    expect(buttonLabel(16, 'standard')).toBe('Home / PS');
  });
  it('standard の範囲外・非standardは番号', () => {
    expect(buttonLabel(17, 'standard')).toBe('#17');
    expect(buttonLabel(0, '')).toBe('#0');
  });
});

describe('applyDeadzone', () => {
  it('デッドゾーン内は0', () => {
    expect(applyDeadzone(0.05, 0.1)).toBe(0);
    expect(applyDeadzone(-0.09, 0.1)).toBe(0);
  });
  it('境界以上はそのまま、範囲外は丸める', () => {
    expect(applyDeadzone(0.1, 0.1)).toBe(0.1);
    expect(applyDeadzone(1.5, 0.1)).toBe(1);
    expect(applyDeadzone(-2, 0)).toBe(-1);
  });
});

describe('stickMagnitude / isDrifting', () => {
  it('斜め最大は1に収まる', () => {
    expect(stickMagnitude(1, 1)).toBe(1);
    expect(stickMagnitude(0.3, 0.4)).toBeCloseTo(0.5);
  });
  it('しきい値超でドリフト', () => {
    expect(isDrifting(0.2, 0, 0.15)).toBe(true);
    expect(isDrifting(0.1, 0.1, 0.15)).toBe(false);
  });
});

describe('formatAxis', () => {
  it('小数2桁、-0.00は0.00', () => {
    expect(formatAxis(0.456)).toBe('0.46');
    expect(formatAxis(-0.001)).toBe('0.00');
    expect(formatAxis(-1)).toBe('-1.00');
  });
});

describe('buttonPercent', () => {
  it('0〜100に丸める', () => {
    expect(buttonPercent(0.5)).toBe(50);
    expect(buttonPercent(1.2)).toBe(100);
    expect(buttonPercent(-1)).toBe(0);
  });
});

describe('groupAxes', () => {
  it('2本ずつまとめ、奇数本は末尾が1軸', () => {
    expect(groupAxes([0, 1, 2, 3])).toEqual([
      [0, 1],
      [2, 3],
    ]);
    expect(groupAxes([0, 1, 2])).toEqual([
      [0, 1],
      [2, undefined],
    ]);
    expect(groupAxes([])).toEqual([]);
  });
});
