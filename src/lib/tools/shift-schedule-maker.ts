import {
  buildMonth,
  daysInMonth,
  isValidMonth,
  isValidYear,
} from './calendar-generator';
import type { HolidayKey } from './business-day-calculator';

export const MAX_MEMBERS = 60;
export const MAX_PER_DAY = 60;
export const MAX_CONSECUTIVE_LIMIT = 31;

export interface ShiftInput {
  members: string[];
  year: number;
  month: number;
  /** 1日あたりの必要人数 */
  perDay: number;
  /** 連勤の上限（この日数を超えて連続では割り当てない） */
  maxConsecutive: number;
  /** 土日祝は休み（割り当てない） */
  closedOnOffDays: boolean;
  /** メンバーごとの希望休（日）。members と同じ並び */
  dayOffs: number[][];
}

export type ShiftError =
  | 'noMembers'
  | 'tooManyMembers'
  | 'invalidYear'
  | 'invalidMonth'
  | 'invalidPerDay'
  | 'invalidMaxConsecutive';

export interface ShiftDay {
  day: number;
  iso: string;
  /** 0=日〜6=土 */
  dow: number;
  holiday: HolidayKey | null;
  /** 土日祝休みの設定で割り当て対象外の日 */
  closed: boolean;
  /** 割り当てられたメンバーの添字（昇順） */
  assigned: number[];
  /** 必要人数（休みの日は 0） */
  required: number;
  /** 希望休で割り当てられなかった人数 */
  unavailableOff: number;
  /** 連勤上限で割り当てられなかった人数 */
  unavailableStreak: number;
}

export interface MemberSummary {
  name: string;
  workDays: number;
  /** 最大連勤日数 */
  maxStreak: number;
  /** 有効な希望休（昇順・重複なし） */
  offRequests: number[];
}

export interface ShiftWarning {
  kind: 'shortage';
  day: number;
  required: number;
  assigned: number;
  unavailableOff: number;
  unavailableStreak: number;
}

export interface ShiftSchedule {
  year: number;
  month: number;
  days: ShiftDay[];
  members: MemberSummary[];
  warnings: ShiftWarning[];
  /** 担当日数の最大 − 最小（公平さの目安） */
  spread: number;
}

export type ShiftResult =
  { ok: true; schedule: ShiftSchedule } | { ok: false; error: ShiftError };

const normalize = (s: string) => s.normalize('NFKC').trim();

/** 改行区切りのメンバー名を整える（空行・重複を除く） */
export function parseMembers(text: string): string[] {
  const seen = new Set<string>();
  const list: string[] = [];
  for (const line of text.split(/\r?\n/)) {
    const name = line.trim();
    if (name === '') continue;
    const key = normalize(name);
    if (seen.has(key)) continue;
    seen.add(key);
    list.push(name);
  }
  return list;
}

export interface DayOffIssue {
  kind: 'badLine' | 'unknownMember' | 'badDay' | 'outOfRange';
  /** 該当した行または日付の文字列 */
  detail: string;
}

export interface DayOffParse {
  /** members と同じ並びの希望休（昇順・重複なし） */
  dayOffs: number[][];
  issues: DayOffIssue[];
}

/**
 * 希望休の入力を解析する。1行1人で「名前: 3, 10, 15-17」の形式。
 * 区切りは「:」「：」「タブ」、日付は「,」「、」「空白」で区切る。
 */
export function parseDayOffRequests(
  text: string,
  members: string[],
  monthDays: number,
): DayOffParse {
  const sets: Set<number>[] = members.map(() => new Set<number>());
  const issues: DayOffIssue[] = [];
  const keys = members.map(normalize);

  for (const rawLine of text.split(/\r?\n/)) {
    const line = rawLine.normalize('NFKC').trim();
    if (line === '') continue;
    const m = /^(.+?)\s*[:\t]\s*(.*)$/.exec(line);
    if (!m) {
      issues.push({ kind: 'badLine', detail: rawLine.trim() });
      continue;
    }
    const idx = keys.indexOf(m[1].trim());
    if (idx < 0) {
      issues.push({ kind: 'unknownMember', detail: m[1].trim() });
      continue;
    }
    for (const token of m[2].split(/[,、，\s]+/)) {
      if (token === '') continue;
      const single = /^(\d{1,2})$/.exec(token);
      const range = /^(\d{1,2})[-~〜～]+(\d{1,2})$/.exec(token);
      let from: number;
      let to: number;
      if (single) {
        from = to = Number(single[1]);
      } else if (range) {
        from = Number(range[1]);
        to = Number(range[2]);
        if (from > to) {
          issues.push({ kind: 'badDay', detail: token });
          continue;
        }
      } else {
        issues.push({ kind: 'badDay', detail: token });
        continue;
      }
      if (from < 1 || to > monthDays) {
        issues.push({ kind: 'outOfRange', detail: token });
        // 範囲内の部分だけは有効にする
        from = Math.max(from, 1);
        to = Math.min(to, monthDays);
        if (from > to) continue;
      }
      for (let d = from; d <= to; d++) sets[idx].add(d);
    }
  }

  return {
    dayOffs: sets.map((s) => [...s].sort((a, b) => a - b)),
    issues,
  };
}

export function validateShiftInput(input: ShiftInput): ShiftError | null {
  if (input.members.length === 0) return 'noMembers';
  if (input.members.length > MAX_MEMBERS) return 'tooManyMembers';
  if (!isValidYear(input.year)) return 'invalidYear';
  if (!isValidMonth(input.month)) return 'invalidMonth';
  if (
    !Number.isInteger(input.perDay) ||
    input.perDay < 1 ||
    input.perDay > MAX_PER_DAY
  ) {
    return 'invalidPerDay';
  }
  if (
    !Number.isInteger(input.maxConsecutive) ||
    input.maxConsecutive < 1 ||
    input.maxConsecutive > MAX_CONSECUTIVE_LIMIT
  ) {
    return 'invalidMaxConsecutive';
  }
  return null;
}

/**
 * シフトを自動割り当てする（乱数なし・同じ入力なら同じ結果）。
 * 各日、希望休・連勤上限で出られない人を除き、
 * 「担当日数が少ない順 → 最後に担当した日が古い順（ラウンドロビン）→ 名簿順」で必要人数を選ぶ。
 * 必要人数に届かない日は warnings に入れる。
 */
export function generateSchedule(input: ShiftInput): ShiftResult {
  const error = validateShiftInput(input);
  if (error) return { ok: false, error };

  const { members, year, month, perDay, maxConsecutive } = input;
  const cal = buildMonth(year, month, { weekStart: 0, holidays: true });
  if (!cal) return { ok: false, error: 'invalidMonth' };
  const cells = cal.weeks.flatMap((w) => w.days).filter((c) => c !== null);
  const total = daysInMonth(year, month);

  const offSets = members.map(
    (_, i) =>
      new Set(
        (input.dayOffs[i] ?? []).filter(
          (d) => Number.isInteger(d) && d >= 1 && d <= total,
        ),
      ),
  );

  const counts = members.map(() => 0);
  const lastWorked = members.map(() => -1);
  const streak = members.map(() => 0);
  const maxStreak = members.map(() => 0);
  const days: ShiftDay[] = [];
  const warnings: ShiftWarning[] = [];

  for (const cell of cells) {
    const closed =
      input.closedOnOffDays &&
      (cell.dow === 0 || cell.dow === 6 || cell.holiday !== null);
    const day: ShiftDay = {
      day: cell.day,
      iso: cell.iso,
      dow: cell.dow,
      holiday: cell.holiday,
      closed,
      assigned: [],
      required: closed ? 0 : perDay,
      unavailableOff: 0,
      unavailableStreak: 0,
    };

    const candidates: number[] = [];
    if (!closed) {
      for (let i = 0; i < members.length; i++) {
        if (offSets[i].has(cell.day)) day.unavailableOff++;
        else if (streak[i] >= maxConsecutive) day.unavailableStreak++;
        else candidates.push(i);
      }
      candidates.sort(
        (a, b) =>
          counts[a] - counts[b] || lastWorked[a] - lastWorked[b] || a - b,
      );
      day.assigned = candidates.slice(0, perDay).sort((a, b) => a - b);
      if (day.assigned.length < perDay) {
        warnings.push({
          kind: 'shortage',
          day: cell.day,
          required: perDay,
          assigned: day.assigned.length,
          unavailableOff: day.unavailableOff,
          unavailableStreak: day.unavailableStreak,
        });
      }
    }

    const worked = new Set(day.assigned);
    for (let i = 0; i < members.length; i++) {
      if (worked.has(i)) {
        counts[i]++;
        lastWorked[i] = cell.day;
        streak[i]++;
        if (streak[i] > maxStreak[i]) maxStreak[i] = streak[i];
      } else {
        streak[i] = 0;
      }
    }
    days.push(day);
  }

  const summaries: MemberSummary[] = members.map((name, i) => ({
    name,
    workDays: counts[i],
    maxStreak: maxStreak[i],
    offRequests: [...offSets[i]].sort((a, b) => a - b),
  }));

  return {
    ok: true,
    schedule: {
      year,
      month,
      days,
      members: summaries,
      warnings,
      spread: Math.max(...counts) - Math.min(...counts),
    },
  };
}

export type CellState = 'work' | 'off' | 'rest' | 'closed';

/** 表（メンバー×日付）の1マスの状態 */
export function cellState(
  schedule: ShiftSchedule,
  memberIndex: number,
  dayIndex: number,
): CellState {
  const day = schedule.days[dayIndex];
  if (day.assigned.includes(memberIndex)) return 'work';
  if (schedule.members[memberIndex].offRequests.includes(day.day)) return 'off';
  if (day.closed) return 'closed';
  return 'rest';
}

export interface CsvLabels {
  nameHeader: string;
  totalHeader: string;
  /** 0=日〜6=土 の曜日表記 */
  weekdays: string[];
  workMark: string;
  offMark: string;
}

function csvCell(value: string, guard = false): string {
  let v = value;
  // 表計算ソフトで数式として解釈されないようにする
  if (guard && /^[=+\-@\t\r]/.test(v)) v = `'${v}`;
  return /[",\r\n]/.test(v) ? `"${v.replace(/"/g, '""')}"` : v;
}

/** 表（メンバー×日付）をCSV文字列にする（改行は LF） */
export function scheduleToCsv(
  schedule: ShiftSchedule,
  labels: CsvLabels,
): string {
  const rows: string[][] = [];
  rows.push([
    labels.nameHeader,
    ...schedule.days.map((d) => `${d.day}(${labels.weekdays[d.dow]})`),
    labels.totalHeader,
  ]);
  schedule.members.forEach((m, mi) => {
    rows.push([
      m.name,
      ...schedule.days.map((_, di) => {
        const s = cellState(schedule, mi, di);
        return s === 'work'
          ? labels.workMark
          : s === 'off'
            ? labels.offMark
            : '';
      }),
      String(m.workDays),
    ]);
  });
  return rows
    .map((r, ri) => r.map((c, ci) => csvCell(c, ri > 0 && ci === 0)).join(','))
    .join('\n');
}
