import { describe, it, expect } from 'vitest';
import {
  DEFAULT_POMODORO,
  bestChallengeIndex,
  challengeDiffMs,
  challengeTargetMs,
  durationFromParts,
  elapsedMs,
  formatDiffSeconds,
  formatDuration,
  judgeChallenge,
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

describe('ぴったりチャレンジ', () => {
  it('目標秒数は1〜60の整数だけ受け付ける', () => {
    expect(challengeTargetMs(10)).toBe(10_000);
    expect(challengeTargetMs(1)).toBe(1000);
    expect(challengeTargetMs(60)).toBe(60_000);
    expect(challengeTargetMs(0)).toBeNull();
    expect(challengeTargetMs(61)).toBeNull();
    expect(challengeTargetMs(2.5)).toBeNull();
    expect(challengeTargetMs(Number.NaN)).toBeNull();
  });

  it('記録と目標の差を符号付きで返す', () => {
    expect(challengeDiffMs(9870, 10_000)).toBe(-130);
    expect(challengeDiffMs(10_050.4, 10_000)).toBe(50);
    expect(challengeDiffMs(10_000, 10_000)).toBe(0);
    // 表示は1/100秒未満を切り捨てるので、9.996秒は 9.99 として扱う
    expect(challengeDiffMs(9996, 10_000)).toBe(-10);
    expect(challengeDiffMs(10_009, 10_000)).toBe(0);
  });

  it('差を1/100秒単位の文字列にする', () => {
    expect(formatDiffSeconds(130)).toBe('+0.13');
    expect(formatDiffSeconds(-50)).toBe('-0.05');
    expect(formatDiffSeconds(0)).toBe('±0.00');
    expect(formatDiffSeconds(4)).toBe('±0.00');
    expect(formatDiffSeconds(-4)).toBe('±0.00');
    expect(formatDiffSeconds(-1234)).toBe('-1.23');
  });

  it('判定は表示上の差で決まる', () => {
    expect(judgeChallenge(0)).toBe('perfect');
    expect(judgeChallenge(4)).toBe('perfect');
    expect(judgeChallenge(-10)).toBe('great');
    expect(judgeChallenge(50)).toBe('great');
    expect(judgeChallenge(60)).toBe('good');
    expect(judgeChallenge(-150)).toBe('good');
    expect(judgeChallenge(300)).toBe('close');
    expect(judgeChallenge(500)).toBe('close');
    expect(judgeChallenge(510)).toBe('miss');
    expect(judgeChallenge(-3000)).toBe('miss');
  });

  it('差の絶対値が最小の記録を選ぶ（同点は先）', () => {
    expect(bestChallengeIndex([])).toBe(-1);
    expect(bestChallengeIndex([300, -120, 200])).toBe(1);
    expect(bestChallengeIndex([-100, 100])).toBe(0);
  });
});
