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

/**
 * 希望休を入力欄の書式（「名前: 3, 10, 15-17」）に戻す。
 * 希望休が無いメンバーの行は出さない。parseDayOffRequests の逆変換。
 */
export function formatDayOffs(members: string[], dayOffs: number[][]): string {
  const lines: string[] = [];
  members.forEach((name, i) => {
    const days = [...new Set(dayOffs[i] ?? [])].sort((a, b) => a - b);
    if (days.length === 0) return;
    const parts: string[] = [];
    for (let k = 0; k < days.length;) {
      let end = k;
      while (end + 1 < days.length && days[end + 1] === days[end] + 1) end++;
      parts.push(
        end - k >= 2
          ? `${days[k]}-${days[end]}`
          : days.slice(k, end + 1).join(', '),
      );
      k = end + 1;
    }
    lines.push(`${name}: ${parts.join(', ')}`);
  });
  return lines.join('\n');
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

type Cell = NonNullable<
  NonNullable<ReturnType<typeof buildMonth>>['weeks'][number]['days'][number]
>;

interface GreedyContext {
  input: ShiftInput;
  cells: Cell[];
  offSets: Set<number>[];
}

const isClosed = (input: ShiftInput, cell: Cell) =>
  input.closedOnOffDays &&
  (cell.dow === 0 || cell.dow === 6 || cell.holiday !== null);

/**
 * 日付順の貪欲法で1回割り当てる（初期解）。
 * 各日、希望休・連勤上限で出られない人を除き、
 * 「担当日数が少ない順 → 最後に担当した日が古い順（ラウンドロビン）→ 名簿順」で必要人数を選ぶ。
 * 戻り値は日ごとの担当者（添字）。
 */
function runGreedy(ctx: GreedyContext): number[][] {
  const { input, cells, offSets } = ctx;
  const { members, perDay, maxConsecutive } = input;
  const counts = members.map(() => 0);
  const lastWorked = members.map(() => -1);
  const streak = members.map(() => 0);
  const result: number[][] = [];

  for (const cell of cells) {
    let assigned: number[] = [];
    if (!isClosed(input, cell)) {
      const candidates: number[] = [];
      for (let i = 0; i < members.length; i++) {
        if (!offSets[i].has(cell.day) && streak[i] < maxConsecutive)
          candidates.push(i);
      }
      candidates.sort(
        (a, b) =>
          counts[a] - counts[b] || lastWorked[a] - lastWorked[b] || a - b,
      );
      assigned = candidates.slice(0, perDay).sort((a, b) => a - b);
    }
    const worked = new Set(assigned);
    for (let i = 0; i < members.length; i++) {
      if (worked.has(i)) {
        counts[i]++;
        lastWorked[i] = cell.day;
        streak[i]++;
      } else {
        streak[i] = 0;
      }
    }
    result.push(assigned);
  }
  return result;
}

/** 改善探索の反復回数（人数不足がある場合だけ使う） */
const SEARCH_ITERATIONS = 300000;
/** 不足・連勤超過 1 件あたりの重み（公平さ・連勤の短さより圧倒的に重い） */
const HARD_WEIGHT = 300;

/** 乱数（シード固定なので同じ入力なら同じ結果になる） */
function makeRng(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

type Change = { i: number; d: number; to: number }[];

/**
 * 貪欲法の結果に人数不足がある場合に、焼きなまし法で割り当てを組み替えて不足を減らす。
 * 希望休・休業日は絶対に動かさず、連勤上限を守ったうえで
 * 「不足人数 → 担当日数の偏り → 連勤の長さ」の順に良い解を探す。
 * 連勤上限を超える解は返さない（見つからなければ初期解のまま）。
 */
function improve(
  ctx: GreedyContext,
  initial: number[][],
  lowerBound: number,
): number[][] {
  const { input, cells, offSets } = ctx;
  const M = input.members.length;
  const N = cells.length;
  const max = input.maxConsecutive;
  const req = cells.map((c) => (isClosed(input, c) ? 0 : input.perDay));
  const free = (i: number, d: number) =>
    req[d] > 0 && !offSets[i].has(cells[d].day);

  const work = Array.from({ length: M }, () => new Uint8Array(N));
  const cnt = new Array<number>(N).fill(0);
  const total = new Array<number>(M).fill(0);
  initial.forEach((list, d) => {
    for (const i of list) {
      work[i][d] = 1;
      cnt[d]++;
      total[i]++;
    }
  });

  /** メンバー i の（連勤超過日数, 連勤の長さの二乗和） */
  const runCost = (i: number) => {
    let excess = 0;
    let sq = 0;
    let len = 0;
    for (let d = 0; d <= N; d++) {
      if (d < N && work[i][d]) {
        len++;
      } else if (len > 0) {
        if (len > max) excess += len - max;
        sq += len * len;
        len = 0;
      }
    }
    return { excess, sq };
  };

  let shortage = 0;
  for (let d = 0; d < N; d++) shortage += Math.max(0, req[d] - cnt[d]);
  const excessOf = new Array<number>(M);
  const sqOf = new Array<number>(M);
  let excess = 0;
  let sq = 0;
  let fair = 0;
  for (let i = 0; i < M; i++) {
    const c = runCost(i);
    excessOf[i] = c.excess;
    sqOf[i] = c.sq;
    excess += c.excess;
    sq += c.sq;
    fair += total[i] * total[i];
  }

  // 解の良さ: ハード（不足+連勤超過）を最優先、次に担当日数の偏り、最後に連勤の短さ
  const soft = () => 4 * fair + sq;
  const cost = () => HARD_WEIGHT * (shortage + excess) + soft();

  let best = work.map((row) => row.slice());
  let bestShortage = shortage;
  let bestSoft = soft();
  const rng = makeRng(
    (input.year * 12 + input.month) * 1000 + M * 31 + input.perDay,
  );
  const pick = (n: number) => Math.floor(rng() * n);

  // 変更を適用する（元に戻すときは元の値を渡し直す）
  const apply = (changes: Change) => {
    const touched = new Set<number>();
    for (const { i, d, to } of changes) {
      if (work[i][d] === to) continue;
      work[i][d] = to;
      const delta = to ? 1 : -1;
      shortage -= Math.max(0, req[d] - cnt[d]);
      cnt[d] += delta;
      shortage += Math.max(0, req[d] - cnt[d]);
      fair += 2 * total[i] * delta + 1;
      total[i] += delta;
      touched.add(i);
    }
    for (const i of touched) {
      const c = runCost(i);
      excess += c.excess - excessOf[i];
      sq += c.sq - sqOf[i];
      excessOf[i] = c.excess;
      sqOf[i] = c.sq;
    }
  };

  let doneAt = -1;
  for (let it = 0; it < SEARCH_ITERATIONS; it++) {
    const temp = 120 * Math.pow(0.02, it / SEARCH_ITERATIONS);
    const before = cost();
    const r = rng();
    let changes: Change;
    if (r < 0.4) {
      // 不足している日に、空いている人を追加する
      const deficits: number[] = [];
      for (let d = 0; d < N; d++) if (cnt[d] < req[d]) deficits.push(d);
      if (deficits.length === 0) continue;
      const d = deficits[pick(deficits.length)];
      const i = pick(M);
      if (!free(i, d) || work[i][d]) continue;
      changes = [{ i, d, to: 1 }];
    } else if (r < 0.7) {
      // 同じ人の出勤日を別の日に移す
      const i = pick(M);
      const a = pick(N);
      const b = pick(N);
      if (!work[i][a] || work[i][b] || !free(i, b) || cnt[b] >= req[b])
        continue;
      changes = [
        { i, d: a, to: 0 },
        { i, d: b, to: 1 },
      ];
    } else {
      // 同じ日の担当者を入れ替える
      const d = pick(N);
      const i = pick(M);
      const k = pick(M);
      if (!work[i][d] || work[k][d] || !free(k, d)) continue;
      changes = [
        { i, d, to: 0 },
        { i: k, d, to: 1 },
      ];
    }
    const undo: Change = changes.map(({ i, d }) => ({ i, d, to: work[i][d] }));
    apply(changes);
    const delta = cost() - before;
    if (delta > 0 && rng() >= Math.exp(-delta / temp)) {
      apply(undo);
      continue;
    }
    if (
      excess === 0 &&
      (shortage < bestShortage ||
        (shortage === bestShortage && soft() < bestSoft))
    ) {
      best = work.map((row) => row.slice());
      bestShortage = shortage;
      bestSoft = soft();
    }
    if (doneAt < 0 && excess === 0 && shortage <= lowerBound) doneAt = it;
    if (doneAt >= 0 && it - doneAt > 8000) break;
  }

  return Array.from({ length: N }, (_, d) => {
    const list: number[] = [];
    for (let i = 0; i < M; i++) if (best[i][d]) list.push(i);
    return list;
  });
}

/**
 * シフトを自動割り当てする（同じ入力なら同じ結果）。
 * まず貪欲法（担当日数が少ない順 → 最後に担当した日が古い順 → 名簿順）で割り当て、
 * 必要人数に届かない日があれば、希望休を最優先に守ったまま割り当てを組み替えて不足を減らす。
 * それでも届かない日は warnings に入れる。
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
  const ctx: GreedyContext = { input, cells, offSets };

  const shortageOf = (a: number[][]) =>
    a.reduce(
      (sum, list, d) =>
        sum +
        Math.max(0, (isClosed(input, cells[d]) ? 0 : perDay) - list.length),
      0,
    );
  // 希望休だけで決まる不足の下限（これ以上は減らせない）
  const lowerBound = cells.reduce((sum, cell) => {
    if (isClosed(input, cell)) return sum;
    const avail = members.filter((_, i) => !offSets[i].has(cell.day)).length;
    return sum + Math.max(0, perDay - avail);
  }, 0);

  let assignment = runGreedy(ctx);
  if (shortageOf(assignment) > lowerBound) {
    const improved = improve(ctx, assignment, lowerBound);
    if (shortageOf(improved) < shortageOf(assignment)) assignment = improved;
  }

  const counts = members.map(() => 0);
  const maxStreak = members.map(() => 0);
  const streak = members.map(() => 0);
  const days: ShiftDay[] = [];
  const warnings: ShiftWarning[] = [];
  const workedOn = members.map(() => new Uint8Array(cells.length));
  assignment.forEach((list, d) => list.forEach((i) => (workedOn[i][d] = 1)));

  cells.forEach((cell, d) => {
    const closed = isClosed(input, cell);
    const assigned = assignment[d];
    const day: ShiftDay = {
      day: cell.day,
      iso: cell.iso,
      dow: cell.dow,
      holiday: cell.holiday,
      closed,
      assigned,
      required: closed ? 0 : perDay,
      unavailableOff: 0,
      unavailableStreak: 0,
    };
    if (!closed) {
      for (let i = 0; i < members.length; i++) {
        if (workedOn[i][d]) continue;
        if (offSets[i].has(cell.day)) {
          day.unavailableOff++;
          continue;
        }
        // この日に入れると連勤上限を超える人
        let run = 1;
        for (let k = d - 1; k >= 0 && workedOn[i][k]; k--) run++;
        for (let k = d + 1; k < cells.length && workedOn[i][k]; k++) run++;
        if (run > maxConsecutive) day.unavailableStreak++;
      }
      if (assigned.length < perDay) {
        warnings.push({
          kind: 'shortage',
          day: cell.day,
          required: perDay,
          assigned: assigned.length,
          unavailableOff: day.unavailableOff,
          unavailableStreak: day.unavailableStreak,
        });
      }
    }
    for (let i = 0; i < members.length; i++) {
      if (workedOn[i][d]) {
        counts[i]++;
        streak[i]++;
        if (streak[i] > maxStreak[i]) maxStreak[i] = streak[i];
      } else {
        streak[i] = 0;
      }
    }
    days.push(day);
  });

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

export type ShiftHint =
  /** 連勤上限を value 日にすれば必要人数を満たせる */
  | { kind: 'maxConsecutive'; value: number }
  /** 必要人数を value 人にすれば満たせる */
  | { kind: 'perDay'; value: number }
  /** メンバーを count 人増やせば満たせる */
  | { kind: 'addMembers'; count: number }
  /** 土日祝を休みにすれば満たせる */
  | { kind: 'closed' }
  /** 人数不足の日に希望休が重なっている（日付と該当メンバー） */
  | { kind: 'dayOffs'; days: number[]; members: string[] }
  /** 1つの設定変更だけでは解消しない */
  | { kind: 'combine' };

const MAX_ADD_MEMBERS = 10;

/**
 * 人数不足の警告があるとき、どう直せば必要人数を満たせるかのヒントを返す。
 * 各ヒントは実際に条件を変えて再計算し、不足が解消することを確かめたものだけを出す。
 * 警告が無ければ空配列。
 */
export function suggestHints(
  input: ShiftInput,
  schedule: ShiftSchedule,
): ShiftHint[] {
  if (schedule.warnings.length === 0) return [];
  const solves = (changed: ShiftInput) => {
    const r = generateSchedule(changed);
    return r.ok && r.schedule.warnings.length === 0;
  };
  const hints: ShiftHint[] = [];

  for (let v = input.maxConsecutive + 1; v <= MAX_CONSECUTIVE_LIMIT; v++) {
    if (solves({ ...input, maxConsecutive: v })) {
      hints.push({ kind: 'maxConsecutive', value: v });
      break;
    }
  }
  for (let v = input.perDay - 1; v >= 1; v--) {
    if (solves({ ...input, perDay: v })) {
      // 解消する最大の人数（下げ幅が最小）を探す
      hints.push({ kind: 'perDay', value: v });
      break;
    }
  }
  const room = Math.min(MAX_ADD_MEMBERS, MAX_MEMBERS - input.members.length);
  for (let k = 1; k <= room; k++) {
    const extra = Array.from({ length: k }, (_, i) => `+${i + 1}`);
    if (
      solves({
        ...input,
        members: [...input.members, ...extra],
        dayOffs: [...input.dayOffs, ...extra.map(() => [] as number[])],
      })
    ) {
      hints.push({ kind: 'addMembers', count: k });
      break;
    }
  }
  if (!input.closedOnOffDays && solves({ ...input, closedOnOffDays: true })) {
    hints.push({ kind: 'closed' });
  }

  const shortDays = schedule.warnings
    .filter((w) => w.unavailableOff > 0)
    .map((w) => w.day);
  if (shortDays.length > 0) {
    const names = schedule.members
      .filter((m) => m.offRequests.some((d) => shortDays.includes(d)))
      .map((m) => m.name);
    hints.push({ kind: 'dayOffs', days: shortDays, members: names });
  }

  if (!hints.some((h) => h.kind !== 'dayOffs')) hints.push({ kind: 'combine' });
  return hints;
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
        return s === 'work' ? labels.workMark : labels.offMark;
      }),
      String(m.workDays),
    ]);
  });
  return rows
    .map((r, ri) => r.map((c, ci) => csvCell(c, ri > 0 && ci === 0)).join(','))
    .join('\n');
}
