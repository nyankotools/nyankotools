import { describe, expect, it } from 'vitest';
import {
  cellState,
  formatDayOffs,
  generateSchedule,
  parseDayOffRequests,
  parseMembers,
  scheduleToCsv,
  suggestHints,
  validateShiftInput,
  type ShiftInput,
  type ShiftSchedule,
} from './shift-schedule-maker';

function base(over: Partial<ShiftInput> = {}): ShiftInput {
  const members = over.members ?? ['A', 'B', 'C'];
  return {
    members,
    year: 2026,
    month: 10,
    perDay: 1,
    maxConsecutive: 5,
    closedOnOffDays: false,
    dayOffs: members.map(() => []),
    ...over,
  };
}

function run(over: Partial<ShiftInput> = {}): ShiftSchedule {
  const r = generateSchedule(base(over));
  if (!r.ok) throw new Error(r.error);
  return r.schedule;
}

describe('parseMembers', () => {
  it('空行・前後空白・重複を除く', () => {
    expect(parseMembers(' A \n\nB\r\nA\n  \nＡ\nC')).toEqual(['A', 'B', 'C']);
  });
  it('空文字は空配列', () => {
    expect(parseMembers('')).toEqual([]);
  });
});

describe('parseDayOffRequests', () => {
  const members = ['田中', '佐藤', 'Lee'];
  it('単日・範囲・全角区切りを解釈する', () => {
    const r = parseDayOffRequests(
      '田中: 3, 10, 15-17\n佐藤：５、６\nLee:\t1 2',
      members,
      31,
    );
    expect(r.issues).toEqual([]);
    expect(r.dayOffs).toEqual([
      [3, 10, 15, 16, 17],
      [5, 6],
      [1, 2],
    ]);
  });
  it('重複は1つにまとめ昇順にする', () => {
    const r = parseDayOffRequests('田中: 5,3,5,3-4', members, 31);
    expect(r.dayOffs[0]).toEqual([3, 4, 5]);
  });
  it('未登録の名前・不正な日付・範囲外・区切りなしを報告する', () => {
    const r = parseDayOffRequests(
      '山田: 1\n田中: abc, 0, 32, 9-5, 30-33\n名前だけ',
      members,
      31,
    );
    expect(r.issues.map((i) => i.kind)).toEqual([
      'unknownMember',
      'badDay',
      'outOfRange',
      'outOfRange',
      'badDay',
      'outOfRange',
      'badLine',
    ]);
    // 30-33 は範囲内の 30,31 だけ有効
    expect(r.dayOffs[0]).toEqual([30, 31]);
  });
  it('月の日数が少ない月では範囲外になる', () => {
    const r = parseDayOffRequests('田中: 30', members, 28);
    expect(r.dayOffs[0]).toEqual([]);
    expect(r.issues[0].kind).toBe('outOfRange');
  });
});

describe('validateShiftInput', () => {
  it('入力エラーを返す', () => {
    expect(validateShiftInput(base({ members: [] }))).toBe('noMembers');
    expect(
      validateShiftInput(
        base({ members: Array.from({ length: 61 }, (_, i) => `m${i}`) }),
      ),
    ).toBe('tooManyMembers');
    expect(validateShiftInput(base({ year: 1800 }))).toBe('invalidYear');
    expect(validateShiftInput(base({ month: 13 }))).toBe('invalidMonth');
    expect(validateShiftInput(base({ perDay: 0 }))).toBe('invalidPerDay');
    expect(validateShiftInput(base({ perDay: 1.5 }))).toBe('invalidPerDay');
    expect(validateShiftInput(base({ maxConsecutive: 0 }))).toBe(
      'invalidMaxConsecutive',
    );
    expect(validateShiftInput(base())).toBeNull();
  });
  it('generateSchedule は不正入力で ok:false', () => {
    expect(generateSchedule(base({ month: 0 }))).toEqual({
      ok: false,
      error: 'invalidMonth',
    });
  });
});

describe('generateSchedule', () => {
  it('3人・1日1人・連勤上限1ならA,B,Cの順に回る', () => {
    const s = run({ maxConsecutive: 1 });
    expect(s.days).toHaveLength(31);
    expect(s.days.slice(0, 6).map((d) => d.assigned[0])).toEqual([
      0, 1, 2, 0, 1, 2,
    ]);
    expect(s.warnings).toEqual([]);
  });

  it('担当回数が均等になる（差は最大1）', () => {
    const s = run({ members: ['A', 'B', 'C', 'D'], perDay: 2 });
    expect(s.spread).toBeLessThanOrEqual(1);
    const total = s.members.reduce((a, m) => a + m.workDays, 0);
    expect(total).toBe(31 * 2);
  });

  it('同じ入力なら同じ結果（決定的）', () => {
    const a = run({ members: ['A', 'B', 'C', 'D', 'E'], perDay: 2 });
    const b = run({ members: ['A', 'B', 'C', 'D', 'E'], perDay: 2 });
    expect(a).toEqual(b);
  });

  it('希望休の日には割り当てない', () => {
    const s = run({
      dayOffs: [[1, 2, 3], [], []],
    });
    for (const d of s.days.slice(0, 3)) {
      expect(d.assigned).not.toContain(0);
      expect(d.unavailableOff).toBe(1);
    }
    expect(s.members[0].offRequests).toEqual([1, 2, 3]);
  });

  it('連勤上限を超えない', () => {
    const s = run({
      members: ['A', 'B'],
      perDay: 1,
      maxConsecutive: 2,
      dayOffs: [[], []],
    });
    for (const m of s.members) expect(m.maxStreak).toBeLessThanOrEqual(2);
    expect(s.warnings).toEqual([]);
  });

  it('必要人数を満たせない日は警告になる（人数不足）', () => {
    const s = run({ members: ['A', 'B'], perDay: 3 });
    expect(s.warnings).toHaveLength(31);
    expect(s.warnings[0]).toMatchObject({
      kind: 'shortage',
      day: 1,
      required: 3,
      assigned: 2,
    });
  });

  it('全員が希望休の日は0人で警告、理由は希望休', () => {
    const s = run({ dayOffs: [[5], [5], [5]] });
    const w = s.warnings.find((x) => x.day === 5)!;
    expect(w.assigned).toBe(0);
    expect(w.unavailableOff).toBe(3);
    expect(s.days[4].assigned).toEqual([]);
  });

  it('連勤上限で埋まらない日は警告（理由は連勤上限）', () => {
    // 1人で毎日必要、上限3 → 4日目が不足
    const s = run({
      members: ['A'],
      maxConsecutive: 3,
      dayOffs: [[]],
    });
    const w = s.warnings.find((x) => x.day === 4)!;
    expect(w.unavailableStreak).toBe(1);
    expect(s.members[0].maxStreak).toBe(3);
  });

  it('土日祝を休みにすると該当日は割り当てなし・警告なし', () => {
    const s = run({ closedOnOffDays: true });
    // 2026-10-03(土), 04(日), 10(土), 11(日), 12(スポーツの日)
    for (const day of [3, 4, 10, 11, 12]) {
      const d = s.days[day - 1];
      expect(d.closed).toBe(true);
      expect(d.assigned).toEqual([]);
      expect(d.required).toBe(0);
    }
    expect(s.days[11].holiday).toBe('sports');
    expect(s.days[0].closed).toBe(false);
    expect(s.warnings).toEqual([]);
  });

  it('休みの日を挟むと連勤がリセットされる', () => {
    const s = run({
      members: ['A'],
      maxConsecutive: 5,
      closedOnOffDays: true,
      dayOffs: [[]],
    });
    // 10/1(木),2(金) の2連勤のあと土日で切れる。10/5〜9は5連勤で上限ちょうど
    expect(s.members[0].maxStreak).toBe(5);
    expect(s.warnings).toEqual([]);
  });

  it('うるう年2月は29日分', () => {
    expect(run({ year: 2028, month: 2 }).days).toHaveLength(29);
    expect(run({ year: 2027, month: 2 }).days).toHaveLength(28);
  });

  it('範囲外の希望休は無視される', () => {
    const s = run({ month: 2, year: 2027, dayOffs: [[30, 0], [], []] });
    expect(s.members[0].offRequests).toEqual([]);
  });

  it('祝日の対応外の年（1999）でも動く', () => {
    const s = run({ year: 1999, month: 5, closedOnOffDays: true });
    expect(s.days.every((d) => d.holiday === null)).toBe(true);
  });
});

describe('cellState / scheduleToCsv', () => {
  const s = run({
    members: ['A', '=B', 'C,"x"'],
    maxConsecutive: 1,
    closedOnOffDays: true,
    dayOffs: [[], [2], []],
  });
  it('マスの状態を返す', () => {
    expect(cellState(s, 0, 0)).toBe('work');
    expect(cellState(s, 1, 1)).toBe('off');
    expect(cellState(s, 0, 2)).toBe('closed');
    expect(cellState(s, 2, 0)).toBe('rest');
  });
  it('CSVはヘッダ・印・合計を含み、特殊文字をエスケープする', () => {
    const csv = scheduleToCsv(s, {
      nameHeader: '名前',
      totalHeader: '計',
      weekdays: ['日', '月', '火', '水', '木', '金', '土'],
      workMark: '○',
      offMark: '休',
    });
    const lines = csv.split('\n');
    expect(lines).toHaveLength(4);
    expect(lines[0].startsWith('名前,1(木),2(金),3(土)')).toBe(true);
    expect(lines[0].endsWith(',計')).toBe(true);
    expect(lines[1].startsWith('A,○,')).toBe(true);
    expect(lines[2].startsWith("'=B,")).toBe(true);
    expect(lines[3].startsWith('"C,""x""",')).toBe(true);
    expect(lines[2].split(',')[2]).toBe('休');
  });
  it('CSVの日付欄は出勤が○、それ以外（希望休・自動の休み・土日祝）はすべて休', () => {
    const csv = scheduleToCsv(s, {
      nameHeader: '名前',
      totalHeader: '計',
      weekdays: ['日', '月', '火', '水', '木', '金', '土'],
      workMark: '○',
      offMark: '休',
    });
    const lines = csv.split('\n');
    // 名前にカンマを含まない行（A, =B）は split で日付欄を取り出せる
    for (const mi of [0, 1]) {
      const fields = lines[mi + 1].split(',').slice(1, 1 + s.days.length);
      expect(fields).toHaveLength(s.days.length);
      fields.forEach((f, di) => {
        const st = cellState(s, mi, di);
        expect(f).toBe(st === 'work' ? '○' : '休');
      });
    }
    // 名前にカンマを含む行（C,"x"）も、自動の休み（rest）が空欄にならない
    expect(cellState(s, 2, 0)).toBe('rest');
    expect(lines[3]).toContain(',休,');
  });
});

describe('formatDayOffs', () => {
  it('連続する3日以上は範囲にまとめ、空のメンバーは出さない', () => {
    expect(
      formatDayOffs(['田中', '佐藤', '鈴木'], [[1, 2, 3, 10, 15, 16], [], [5]]),
    ).toBe('田中: 1-3, 10, 15, 16\n鈴木: 5');
  });

  it('parseDayOffRequests と往復しても同じ', () => {
    const members = ['田中', '佐藤'];
    const dayOffs = [
      [1, 2, 3, 4, 9],
      [7, 8],
    ];
    const text = formatDayOffs(members, dayOffs);
    expect(parseDayOffRequests(text, members, 31).dayOffs).toEqual(dayOffs);
  });
});

describe('suggestHints', () => {
  const base: ShiftInput = {
    members: ['A', 'B'],
    year: 2026,
    month: 10,
    perDay: 2,
    maxConsecutive: 5,
    closedOnOffDays: false,
    dayOffs: [[], []],
  };
  const run = (input: ShiftInput) => {
    const r = generateSchedule(input);
    if (!r.ok) throw new Error('invalid');
    return r.schedule;
  };

  it('警告が無ければヒントも無い', () => {
    const input = { ...base, maxConsecutive: 31 };
    expect(suggestHints(input, run(input))).toEqual([]);
  });

  it('連勤上限で不足するときは、解消する連勤上限を提案する', () => {
    const hints = suggestHints(base, run(base));
    const h = hints.find((x) => x.kind === 'maxConsecutive');
    expect(h).toBeDefined();
    if (h?.kind === 'maxConsecutive') {
      expect(run({ ...base, maxConsecutive: h.value }).warnings).toEqual([]);
      expect(
        run({ ...base, maxConsecutive: h.value - 1 }).warnings.length,
      ).toBeGreaterThan(0);
    }
  });

  it('メンバーが必要人数に足りないときは、増員・人数引き下げを提案する', () => {
    const input = {
      ...base,
      members: ['A'],
      dayOffs: [[]],
      maxConsecutive: 31,
    };
    const hints = suggestHints(input, run(input));
    expect(hints).toContainEqual({ kind: 'addMembers', count: 1 });
    expect(hints).toContainEqual({ kind: 'perDay', value: 1 });
  });

  it('希望休が重なった日はメンバーと日付を示す', () => {
    const input = {
      ...base,
      maxConsecutive: 31,
      dayOffs: [[3], []],
    };
    const hints = suggestHints(input, run(input));
    expect(hints).toContainEqual({
      kind: 'dayOffs',
      days: [3],
      members: ['A'],
    });
  });

  it('土日祝休みで解消するならそれを提案する', () => {
    // 2人のうち1人が毎日希望休だと平日・休日とも不足するが、休日を閉じても平日は不足する
    const input = {
      ...base,
      perDay: 1,
      members: ['A'],
      dayOffs: [[1]],
      maxConsecutive: 31,
    };
    const hints = suggestHints(input, run(input));
    expect(hints.some((h) => h.kind === 'closed')).toBe(false);
  });

  it('どの1つの変更でも解消しないときは combine を返す', () => {
    const input: ShiftInput = {
      ...base,
      members: ['A'],
      perDay: 60,
      maxConsecutive: 1,
      dayOffs: [[]],
    };
    const hints = suggestHints(input, run(input));
    expect(hints).toContainEqual({ kind: 'combine' });
  });
});

describe('割り当ての最適化', () => {
  const input: ShiftInput = {
    members: ['m0', 'm1', 'm2'],
    year: 2026,
    month: 10,
    perDay: 2,
    maxConsecutive: 5,
    closedOnOffDays: false,
    dayOffs: [
      [23, 25, 13, 2, 7],
      [21, 22, 14, 20, 8],
      [10, 1, 28, 30, 4],
    ],
  };

  it('日付順の割り当てでは不足する条件でも、組み替えて警告なしにできる', () => {
    const r = generateSchedule(input);
    if (!r.ok) throw new Error('invalid');
    const s = r.schedule;
    expect(s.warnings).toEqual([]);
    for (const m of s.members) expect(m.maxStreak).toBeLessThanOrEqual(5);
    for (const day of s.days) {
      s.members.forEach((m, i) => {
        if (m.offRequests.includes(day.day))
          expect(day.assigned).not.toContain(i);
      });
    }
  });

  it('同じ入力なら毎回同じ結果になる', () => {
    expect(generateSchedule(input)).toEqual(generateSchedule(input));
  });

  it('希望休で物理的に足りない日は警告のまま、希望休は守られる', () => {
    const r = generateSchedule({
      ...input,
      perDay: 3,
      dayOffs: [[1], [], []],
    });
    if (!r.ok) throw new Error('invalid');
    expect(r.schedule.warnings.map((w) => w.day)).toContain(1);
    expect(r.schedule.days[0].assigned).not.toContain(0);
  });
});
