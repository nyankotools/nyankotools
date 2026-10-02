import { describe, it, expect } from 'vitest';
import {
  DEFAULT_POMODORO,
  durationFromParts,
  elapsedMs,
  formatDuration,
  nextPomodoroPhase,
  phaseDuration,
  remainingMs,
  validatePomodoro,
} from './timer-stopwatch';

describe('timer-stopwatch', () => {
  it('formatDuration', () => {
    expect(formatDuration(0)).toBe('00:00');
    expect(formatDuration(65_000)).toBe('01:05');
    expect(formatDuration(3_661_000)).toBe('01:01:01');
    expect(formatDuration(1_234, true)).toBe('00:01.23');
    expect(formatDuration(-5)).toBe('00:00');
  });

  it('durationFromParts', () => {
    expect(durationFromParts(0, 5, 0)).toBe(300_000);
    expect(durationFromParts(1, 30, 15)).toBe(5_415_000);
    expect(durationFromParts(0, 0, 0)).toBeNull();
    expect(durationFromParts(-1, 5, 0)).toBeNull();
    expect(durationFromParts(0, 1.5, 0)).toBeNull();
    expect(durationFromParts(100, 0, 0)).toBeNull();
    expect(durationFromParts(NaN, 0, 5)).toBeNull();
  });

  it('elapsedMs / remainingMs', () => {
    expect(elapsedMs(1000, null, 9999)).toBe(1000);
    expect(elapsedMs(1000, 5000, 7500)).toBe(3500);
    expect(elapsedMs(0, 5000, 4000)).toBe(0);
    expect(remainingMs(10_000, 4_000)).toBe(6_000);
    expect(remainingMs(10_000, 12_000)).toBe(0);
  });

  it('ポモドーロのフェーズ遷移', () => {
    const s = DEFAULT_POMODORO;
    expect(nextPomodoroPhase('work', 1, s)).toBe('shortBreak');
    expect(nextPomodoroPhase('work', 3, s)).toBe('shortBreak');
    expect(nextPomodoroPhase('work', 4, s)).toBe('longBreak');
    expect(nextPomodoroPhase('work', 8, s)).toBe('longBreak');
    expect(nextPomodoroPhase('shortBreak', 1, s)).toBe('work');
    expect(nextPomodoroPhase('longBreak', 4, s)).toBe('work');
    expect(phaseDuration('work', s)).toBe(1_500_000);
    expect(phaseDuration('longBreak', s)).toBe(900_000);
  });

  it('validatePomodoro', () => {
    expect(validatePomodoro(DEFAULT_POMODORO)).toBe(true);
    expect(validatePomodoro({ ...DEFAULT_POMODORO, workMinutes: 0 })).toBe(
      false,
    );
    expect(validatePomodoro({ ...DEFAULT_POMODORO, workMinutes: 181 })).toBe(
      false,
    );
    expect(validatePomodoro({ ...DEFAULT_POMODORO, longBreakEvery: 1 })).toBe(
      false,
    );
    expect(
      validatePomodoro({ ...DEFAULT_POMODORO, shortBreakMinutes: 2.5 }),
    ).toBe(false);
  });
});
