export const CYCLE_MINUTES = 90;
export const MINUTES_PER_DAY = 1440;
export const DEFAULT_LATENCY_MINUTES = 15;
export const MAX_LATENCY_MINUTES = 120;

/** Cycle counts shown as candidates (6 to 9 hours of sleep). */
export const CYCLE_COUNTS = [4, 5, 6] as const;

export interface SleepCandidate {
  cycles: number;
  /** Sleep duration in minutes (cycles x 90). */
  sleepMinutes: number;
  /** Clock time as minutes since midnight (0-1439). */
  clockMinutes: number;
  /** Clock time formatted as HH:MM. */
  time: string;
  /** -1 = previous day, 0 = same day, 1 = next day (relative to the input time). */
  dayOffset: number;
}

/** Parses "HH:MM" (24h) into minutes since midnight. Returns null if invalid. */
export function parseTime(value: string): number | null {
  const m = /^(\d{1,2}):(\d{2})$/.exec(value.trim());
  if (!m) return null;
  const h = Number(m[1]);
  const min = Number(m[2]);
  if (h > 23 || min > 59) return null;
  return h * 60 + min;
}

/** Formats minutes since midnight (wrapped into one day) as HH:MM. */
export function formatTime(minutes: number): string {
  const wrapped =
    ((minutes % MINUTES_PER_DAY) + MINUTES_PER_DAY) % MINUTES_PER_DAY;
  const h = Math.floor(wrapped / 60);
  const m = wrapped % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

/** Returns true for an integer latency within 0..MAX_LATENCY_MINUTES. */
export function isValidLatency(latency: number): boolean {
  return (
    Number.isInteger(latency) && latency >= 0 && latency <= MAX_LATENCY_MINUTES
  );
}

function build(cycles: number, total: number): SleepCandidate {
  const wrapped =
    ((total % MINUTES_PER_DAY) + MINUTES_PER_DAY) % MINUTES_PER_DAY;
  return {
    cycles,
    sleepMinutes: cycles * CYCLE_MINUTES,
    clockMinutes: wrapped,
    time: formatTime(total),
    dayOffset: Math.floor(total / MINUTES_PER_DAY),
  };
}

/**
 * Bedtimes (when to get into bed) for a given wake-up time.
 * Ordered from the most sleep (6 cycles) to the least (4 cycles).
 * Returns null on invalid input.
 */
export function bedtimesForWake(
  wakeMinutes: number,
  latencyMinutes: number = DEFAULT_LATENCY_MINUTES,
): SleepCandidate[] | null {
  if (!Number.isInteger(wakeMinutes) || wakeMinutes < 0 || wakeMinutes >= 1440)
    return null;
  if (!isValidLatency(latencyMinutes)) return null;
  return [...CYCLE_COUNTS]
    .reverse()
    .map((c) => build(c, wakeMinutes - c * CYCLE_MINUTES - latencyMinutes));
}

/**
 * Wake-up times for a given time of getting into bed.
 * Ordered from the least sleep (4 cycles) to the most (6 cycles).
 * Returns null on invalid input.
 */
export function wakeTimesForBed(
  bedMinutes: number,
  latencyMinutes: number = DEFAULT_LATENCY_MINUTES,
): SleepCandidate[] | null {
  if (!Number.isInteger(bedMinutes) || bedMinutes < 0 || bedMinutes >= 1440)
    return null;
  if (!isValidLatency(latencyMinutes)) return null;
  return CYCLE_COUNTS.map((c) =>
    build(c, bedMinutes + latencyMinutes + c * CYCLE_MINUTES),
  );
}

/** Formats a duration in minutes as hours with a trailing .5 when needed (e.g. 7.5). */
export function formatHours(minutes: number): string {
  const h = minutes / 60;
  return Number.isInteger(h) ? String(h) : h.toFixed(1);
}
