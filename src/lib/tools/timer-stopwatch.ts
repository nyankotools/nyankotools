export type PomodoroPhase = 'work' | 'shortBreak' | 'longBreak';

export interface PomodoroSettings {
  workMinutes: number;
  shortBreakMinutes: number;
  longBreakMinutes: number;
  /** 何回の作業ごとに長い休憩を挟むか */
  longBreakEvery: number;
}

export const DEFAULT_POMODORO: PomodoroSettings = {
  workMinutes: 25,
  shortBreakMinutes: 5,
  longBreakMinutes: 15,
  longBreakEvery: 4,
};

/** ミリ秒を `HH:MM:SS`（1時間未満は `MM:SS`）にする。centis が true なら 1/100 秒まで表示 */
export function formatDuration(ms: number, centis = false): string {
  const safe = Math.max(0, Math.floor(ms));
  const totalSeconds = Math.floor(safe / 1000);
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;
  const pad = (n: number) => String(n).padStart(2, '0');
  const base = h > 0 ? `${pad(h)}:${pad(m)}:${pad(s)}` : `${pad(m)}:${pad(s)}`;
  return centis ? `${base}.${pad(Math.floor((safe % 1000) / 10))}` : base;
}

/** 時・分・秒の入力をミリ秒にする。不正（負・小数・非数・合計0・100時間以上）なら null */
export function durationFromParts(
  hours: number,
  minutes: number,
  seconds: number,
): number | null {
  const parts = [hours, minutes, seconds];
  if (parts.some((n) => !Number.isInteger(n) || n < 0)) return null;
  const total = (hours * 3600 + minutes * 60 + seconds) * 1000;
  if (total <= 0 || total >= 100 * 3_600_000) return null;
  return total;
}

/** ストップウォッチの経過時間。accumulated は停止中までの累計、startedAt は動作中の開始時刻 */
export function elapsedMs(
  accumulated: number,
  startedAt: number | null,
  now: number,
): number {
  return accumulated + (startedAt === null ? 0 : Math.max(0, now - startedAt));
}

/** 動作中のタイマーの残り時間 */
export function remainingMs(endAt: number, now: number): number {
  return Math.max(0, endAt - now);
}

/** フェーズごとの長さ（ミリ秒） */
export function phaseDuration(
  phase: PomodoroPhase,
  settings: PomodoroSettings,
): number {
  const minutes =
    phase === 'work'
      ? settings.workMinutes
      : phase === 'shortBreak'
        ? settings.shortBreakMinutes
        : settings.longBreakMinutes;
  return minutes * 60_000;
}

/** 設定値が妥当か（すべて正の整数、作業は最大180分、休憩は最大60分、周期は2〜12） */
export function validatePomodoro(s: PomodoroSettings): boolean {
  const ints = [
    s.workMinutes,
    s.shortBreakMinutes,
    s.longBreakMinutes,
    s.longBreakEvery,
  ];
  return (
    ints.every((n) => Number.isInteger(n) && n > 0) &&
    s.workMinutes <= 180 &&
    s.shortBreakMinutes <= 60 &&
    s.longBreakMinutes <= 60 &&
    s.longBreakEvery >= 2 &&
    s.longBreakEvery <= 12
  );
}

/**
 * フェーズ完了後の次のフェーズ。completedWork は今回の作業を含めた完了済みの作業回数。
 * 休憩のあとは作業に戻る。
 */
export function nextPomodoroPhase(
  current: PomodoroPhase,
  completedWork: number,
  settings: PomodoroSettings,
): PomodoroPhase {
  if (current !== 'work') return 'work';
  return completedWork % settings.longBreakEvery === 0
    ? 'longBreak'
    : 'shortBreak';
}
