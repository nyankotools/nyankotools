import { describe, expect, it } from 'vitest';
import {
  MAX_COUNT,
  formatDate,
  formatNumber,
  generateDateSequence,
  generateNumberSequence,
  joinValues,
  parseDate,
  weekdayOf,
} from './sequence-generator';

const ok = (r: { ok: boolean; values?: string[] }) =>
  r.ok ? (r.values as string[]) : null;

describe('generateNumberSequence', () => {
  it('件数指定で連番を作る', () => {
    const r = generateNumberSequence({
      start: 1,
      step: 1,
      limit: { kind: 'count', count: 3 },
      pad: 0,
    });
    expect(ok(r)).toEqual(['1', '2', '3']);
  });

  it('ゼロ埋め・接頭辞・接尾辞', () => {
    const r = generateNumberSequence({
      start: 8,
      step: 1,
      limit: { kind: 'count', count: 3 },
      pad: 3,
      prefix: 'img_',
      suffix: '.jpg',
    });
    expect(ok(r)).toEqual(['img_008.jpg', 'img_009.jpg', 'img_010.jpg']);
  });

  it('終了値指定・増分を超えない', () => {
    const r = generateNumberSequence({
      start: 0,
      step: 5,
      limit: { kind: 'end', end: 12 },
      pad: 0,
    });
    expect(ok(r)).toEqual(['0', '5', '10']);
  });

  it('負の増分で減らす', () => {
    const r = generateNumberSequence({
      start: 3,
      step: -1,
      limit: { kind: 'end', end: 1 },
      pad: 2,
    });
    expect(ok(r)).toEqual(['03', '02', '01']);
  });

  it('負数は符号の後ろをゼロ埋めする', () => {
    const r = generateNumberSequence({
      start: -1,
      step: 1,
      limit: { kind: 'count', count: 3 },
      pad: 2,
    });
    expect(ok(r)).toEqual(['-01', '00', '01']);
  });

  it('開始と終了が同じなら1件', () => {
    const r = generateNumberSequence({
      start: 5,
      step: 2,
      limit: { kind: 'end', end: 5 },
      pad: 0,
    });
    expect(ok(r)).toEqual(['5']);
  });

  it('エラーを返す', () => {
    const base = { start: 1, step: 1, pad: 0 };
    const err = (o: Parameters<typeof generateNumberSequence>[0]) => {
      const r = generateNumberSequence(o);
      return r.ok ? null : r.error;
    };
    expect(err({ ...base, step: 0, limit: { kind: 'count', count: 1 } })).toBe(
      'zeroStep',
    );
    expect(
      err({ ...base, step: 1.5, limit: { kind: 'count', count: 1 } }),
    ).toBe('invalidStep');
    expect(
      err({ ...base, start: NaN, limit: { kind: 'count', count: 1 } }),
    ).toBe('invalidStart');
    expect(err({ ...base, limit: { kind: 'count', count: 0 } })).toBe(
      'invalidCount',
    );
    expect(
      err({ ...base, limit: { kind: 'count', count: MAX_COUNT + 1 } }),
    ).toBe('invalidCount');
    expect(err({ ...base, limit: { kind: 'end', end: 0 } })).toBe(
      'unreachableEnd',
    );
    expect(err({ ...base, limit: { kind: 'end', end: 1e6 } })).toBe('tooMany');
    expect(err({ ...base, pad: 21, limit: { kind: 'count', count: 1 } })).toBe(
      'invalidPad',
    );
    expect(err({ ...base, limit: { kind: 'end', end: NaN } })).toBe(
      'invalidEnd',
    );
  });

  it('上限ちょうどは許可する', () => {
    const r = generateNumberSequence({
      start: 1,
      step: 1,
      limit: { kind: 'count', count: MAX_COUNT },
      pad: 0,
    });
    expect(ok(r)).toHaveLength(MAX_COUNT);
  });
});

describe('date helpers', () => {
  it('parseDate は不正な日付を弾く', () => {
    expect(parseDate('2026-02-29')).toBeNull();
    expect(parseDate('2024-02-29')).toEqual({ y: 2024, m: 2, d: 29 });
    expect(parseDate('2026-13-01')).toBeNull();
    expect(parseDate('abc')).toBeNull();
  });

  it('weekdayOf', () => {
    // 1970-01-01 は木曜
    expect(weekdayOf(0)).toBe(4);
    expect(weekdayOf(-1)).toBe(3);
  });

  it('formatDate', () => {
    const d = { y: 2026, m: 3, d: 5 };
    expect(formatDate(d, 'YYYY-MM-DD')).toBe('2026-03-05');
    expect(formatDate(d, 'YY/M/D')).toBe('26/3/5');
    expect(formatDate(d, 'YYYY年M月D日')).toBe('2026年3月5日');
  });
});

describe('generateDateSequence', () => {
  const base = {
    format: 'YYYY-MM-DD',
    interval: 1,
    unit: 'day' as const,
    skipWeekends: false,
  };

  it('日単位・件数指定', () => {
    const r = generateDateSequence({
      ...base,
      start: '2026-02-27',
      limit: { kind: 'count', count: 3 },
    });
    expect(ok(r)).toEqual(['2026-02-27', '2026-02-28', '2026-03-01']);
  });

  it('週単位・終了日指定（終了日を含む）', () => {
    const r = generateDateSequence({
      ...base,
      unit: 'week',
      start: '2026-10-01',
      limit: { kind: 'end', end: '2026-10-15' },
    });
    expect(ok(r)).toEqual(['2026-10-01', '2026-10-08', '2026-10-15']);
  });

  it('月単位は月末にクランプし、ずれが蓄積しない', () => {
    const r = generateDateSequence({
      ...base,
      unit: 'month',
      start: '2026-01-31',
      limit: { kind: 'count', count: 4 },
    });
    expect(ok(r)).toEqual([
      '2026-01-31',
      '2026-02-28',
      '2026-03-31',
      '2026-04-30',
    ]);
  });

  it('曜日付き', () => {
    const r = generateDateSequence({
      ...base,
      start: '2026-10-14',
      limit: { kind: 'count', count: 2 },
      weekdayNames: ['日', '月', '火', '水', '木', '金', '土'],
      weekdayTemplate: '{date}（{weekday}）',
    });
    expect(ok(r)).toEqual(['2026-10-14（水）', '2026-10-15（木）']);
  });

  it('土日を除外して件数を満たす', () => {
    const r = generateDateSequence({
      ...base,
      start: '2026-10-16', // 金
      skipWeekends: true,
      limit: { kind: 'count', count: 3 },
    });
    expect(ok(r)).toEqual(['2026-10-16', '2026-10-19', '2026-10-20']);
  });

  it('土曜開始・7日間隔の土日除外は結果なし', () => {
    const r = generateDateSequence({
      ...base,
      unit: 'week',
      start: '2026-10-17',
      skipWeekends: true,
      limit: { kind: 'count', count: 3 },
    });
    expect(r).toEqual({ ok: false, error: 'notEnough' });
  });

  it('エラー', () => {
    const e = (o: Parameters<typeof generateDateSequence>[0]) => {
      const r = generateDateSequence(o);
      return r.ok ? null : r.error;
    };
    expect(e({ ...base, start: 'x', limit: { kind: 'count', count: 1 } })).toBe(
      'invalidStart',
    );
    expect(
      e({ ...base, start: '2026-01-01', limit: { kind: 'end', end: 'x' } }),
    ).toBe('invalidEnd');
    expect(
      e({
        ...base,
        start: '2026-01-02',
        limit: { kind: 'end', end: '2026-01-01' },
      }),
    ).toBe('unreachableEnd');
    expect(
      e({
        ...base,
        interval: 0,
        start: '2026-01-01',
        limit: { kind: 'count', count: 1 },
      }),
    ).toBe('invalidInterval');
    expect(
      e({
        ...base,
        start: '2026-01-01',
        limit: { kind: 'count', count: MAX_COUNT + 1 },
      }),
    ).toBe('invalidCount');
    expect(
      e({
        ...base,
        start: '2000-01-01',
        limit: { kind: 'end', end: '2100-01-01' },
      }),
    ).toBe('tooMany');
  });

  it('9999年を超える生成は足りない扱い', () => {
    const r = generateDateSequence({
      ...base,
      start: '9999-12-30',
      limit: { kind: 'count', count: 5 },
    });
    expect(r).toEqual({ ok: false, error: 'notEnough' });
  });
});

describe('joinValues', () => {
  it('区切りを切り替える', () => {
    expect(joinValues(['a', 'b'], 'newline')).toBe('a\nb');
    expect(joinValues(['a', 'b'], 'comma')).toBe('a, b');
    expect(joinValues(['a', 'b'], 'space')).toBe('a b');
    expect(joinValues(['a', 'b'], 'tab')).toBe('a\tb');
  });
});

describe('境界値・エッジケース', () => {
  const base = {
    format: 'YYYY-MM-DD',
    interval: 1,
    unit: 'day' as const,
    skipWeekends: false,
  };

  it('連番: 安全な整数の上限を超える値は outOfRange', () => {
    const r = generateNumberSequence({
      start: Number.MAX_SAFE_INTEGER,
      step: 1,
      limit: { kind: 'count', count: 2 },
      pad: 0,
    });
    expect(r).toEqual({ ok: false, error: 'outOfRange' });
  });

  it('連番: 負の接頭辞と負数の組み合わせ', () => {
    expect(formatNumber(-7, 3, 'x', 'y')).toBe('x-007y');
    expect(formatNumber(0, 0)).toBe('0');
  });

  it('日付: 件数の上限ちょうど（10000件）は許可する', () => {
    const r = generateDateSequence({
      ...base,
      start: '2000-01-01',
      limit: { kind: 'count', count: MAX_COUNT },
    });
    expect(ok(r)).toHaveLength(MAX_COUNT);
  });

  it('日付: 終了日が10000件目（2027-05-18）までは許可し、1日超えると tooMany', () => {
    const within = generateDateSequence({
      ...base,
      start: '2000-01-01',
      limit: { kind: 'end', end: '2027-05-18' },
    });
    expect(ok(within)).toHaveLength(MAX_COUNT);
    const over = generateDateSequence({
      ...base,
      start: '2000-01-01',
      limit: { kind: 'end', end: '2027-05-19' },
    });
    expect(over).toEqual({ ok: false, error: 'tooMany' });
  });

  it('日付: 月単位は元の日付から計算し、月末クランプが蓄積しない', () => {
    const r = generateDateSequence({
      ...base,
      unit: 'month',
      start: '2023-08-31',
      limit: { kind: 'count', count: 5 },
    });
    expect(ok(r)).toEqual([
      '2023-08-31',
      '2023-09-30',
      '2023-10-31',
      '2023-11-30',
      '2023-12-31',
    ]);
  });

  it('日付: 12か月間隔の2月29日は、閏年以外で2月28日になる', () => {
    const r = generateDateSequence({
      ...base,
      unit: 'month',
      interval: 12,
      start: '2024-02-29',
      limit: { kind: 'count', count: 3 },
    });
    expect(ok(r)).toEqual(['2024-02-29', '2025-02-28', '2026-02-28']);
  });

  it('日付: 曜日名が7要素でなければ曜日は付けない', () => {
    const r = generateDateSequence({
      ...base,
      start: '2026-10-14',
      limit: { kind: 'count', count: 1 },
      weekdayNames: ['日', '月'],
      weekdayTemplate: '{date}（{weekday}）',
    });
    expect(ok(r)).toEqual(['2026-10-14']);
  });

  it('日付: 終了日が開始日と同じなら1件', () => {
    const r = generateDateSequence({
      ...base,
      start: '2026-10-14',
      limit: { kind: 'end', end: '2026-10-14' },
    });
    expect(ok(r)).toEqual(['2026-10-14']);
  });
});
