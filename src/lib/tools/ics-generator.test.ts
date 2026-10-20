import { describe, expect, it } from 'vitest';
import {
  escapeText,
  foldLine,
  formatTrigger,
  generateIcs,
  icsFileName,
  isValidTimeZone,
  makeUid,
  parseDate,
  parseTime,
  zonedToUtcMs,
  type IcsEventInput,
} from './ics-generator';

const NOW = new Date(Date.UTC(2026, 9, 20, 1, 2, 3));

const base: IcsEventInput = {
  summary: '定例会議',
  description: '',
  location: '',
  url: '',
  allDay: false,
  startDate: '2026-10-21',
  startTime: '10:00',
  endDate: '2026-10-21',
  endTime: '11:30',
  mode: 'tzid',
  timeZone: 'Asia/Tokyo',
  freq: 'none',
  interval: 1,
  byDay: [],
  endType: 'never',
  count: 10,
  untilDate: '',
  reminderMinutes: null,
};

function gen(over: Partial<IcsEventInput> = {}) {
  return generateIcs({ ...base, ...over }, makeUid('abc'), NOW);
}

function ok(over: Partial<IcsEventInput> = {}) {
  const r = gen(over);
  if (!r.ok) throw new Error(r.error);
  return r;
}

describe('parse', () => {
  it('日付と時刻を検証する', () => {
    expect(parseDate('2026-02-29')).toBeNull();
    expect(parseDate('2028-02-29')).toEqual({ y: 2028, m: 2, d: 29 });
    expect(parseDate('')).toBeNull();
    expect(parseTime('24:00')).toBeNull();
    expect(parseTime('09:05')).toEqual({ h: 9, mi: 5 });
  });
  it('タイムゾーン名を検証する', () => {
    expect(isValidTimeZone('Asia/Tokyo')).toBe(true);
    expect(isValidTimeZone('Mars/Base')).toBe(false);
    expect(isValidTimeZone('')).toBe(false);
  });
});

describe('escapeText / foldLine', () => {
  it('特殊文字をエスケープする', () => {
    expect(escapeText('a,b;c\\d\ne')).toBe('a\\,b\\;c\\\\d\\ne');
    expect(escapeText('x\r\ny')).toBe('x\\ny');
  });
  it('75オクテットで折り返し、継続行は空白で始まる', () => {
    const folded = foldLine('SUMMARY:' + 'a'.repeat(200));
    const lines = folded.split('\r\n');
    expect(new TextEncoder().encode(lines[0]).length).toBe(75);
    for (const l of lines.slice(1)) {
      expect(l.startsWith(' ')).toBe(true);
      expect(new TextEncoder().encode(l).length).toBeLessThanOrEqual(75);
    }
    expect(lines.map((l, i) => (i ? l.slice(1) : l)).join('')).toBe(
      'SUMMARY:' + 'a'.repeat(200),
    );
  });
  it('マルチバイト文字の途中では切らない', () => {
    const text = 'SUMMARY:' + 'あ'.repeat(60);
    const folded = foldLine(text);
    const lines = folded.split('\r\n');
    for (const l of lines) {
      expect(new TextEncoder().encode(l).length).toBeLessThanOrEqual(75);
    }
    expect(lines.map((l, i) => (i ? l.slice(1) : l)).join('')).toBe(text);
  });
  it('短い行はそのまま', () => {
    expect(foldLine('BEGIN:VEVENT')).toBe('BEGIN:VEVENT');
  });
});

describe('formatTrigger', () => {
  it('単位を選ぶ', () => {
    expect(formatTrigger(0)).toBe('PT0S');
    expect(formatTrigger(15)).toBe('-PT15M');
    expect(formatTrigger(90)).toBe('-PT90M');
    expect(formatTrigger(120)).toBe('-PT2H');
    expect(formatTrigger(1440)).toBe('-P1D');
    expect(formatTrigger(20160)).toBe('-P2W');
  });
});

describe('zonedToUtcMs', () => {
  it('東京は UTC+9', () => {
    const ms = zonedToUtcMs(
      { y: 2026, m: 10, d: 21 },
      { h: 10, mi: 0 },
      'Asia/Tokyo',
    );
    expect(new Date(ms).toISOString()).toBe('2026-10-21T01:00:00.000Z');
  });
  it('ニューヨークは夏時間を考慮する', () => {
    const summer = zonedToUtcMs(
      { y: 2026, m: 7, d: 1 },
      { h: 9, mi: 0 },
      'America/New_York',
    );
    expect(new Date(summer).toISOString()).toBe('2026-07-01T13:00:00.000Z');
    const winter = zonedToUtcMs(
      { y: 2026, m: 1, d: 1 },
      { h: 9, mi: 0 },
      'America/New_York',
    );
    expect(new Date(winter).toISOString()).toBe('2026-01-01T14:00:00.000Z');
  });
});

describe('generateIcs', () => {
  it('TZID 指定の基本イベント（CRLF・必須プロパティ）', () => {
    const r = ok();
    expect(r.ics.startsWith('BEGIN:VCALENDAR\r\n')).toBe(true);
    expect(r.ics.endsWith('END:VCALENDAR\r\n')).toBe(true);
    expect(r.ics).not.toMatch(/[^\r]\n/);
    expect(r.ics).toContain('VERSION:2.0\r\n');
    expect(r.ics).toContain('UID:abc@nyankotools.com\r\n');
    expect(r.ics).toContain('DTSTAMP:20261020T010203Z\r\n');
    expect(r.ics).toContain('DTSTART;TZID=Asia/Tokyo:20261021T100000\r\n');
    expect(r.ics).toContain('DTEND;TZID=Asia/Tokyo:20261021T113000\r\n');
    expect(r.ics).not.toContain('RRULE');
    expect(r.ics).not.toContain('VALARM');
    expect(r.rrule).toBeNull();
  });

  it('UTC 指定は変換して Z 付きにする', () => {
    const r = ok({ mode: 'utc' });
    expect(r.ics).toContain('DTSTART:20261021T010000Z\r\n');
    expect(r.ics).toContain('DTEND:20261021T023000Z\r\n');
    expect(r.googleUrl).toContain('dates=20261021T010000Z/20261021T023000Z');
    expect(r.googleUrl).not.toContain('ctz=');
  });

  it('フローティングはタイムゾーンなし', () => {
    const r = ok({ mode: 'floating', timeZone: 'invalid' });
    expect(r.ics).toContain('DTSTART:20261021T100000\r\n');
    expect(r.googleUrl).not.toContain('ctz=');
  });

  it('終日は VALUE=DATE で、DTEND は最終日の翌日', () => {
    const r = ok({ allDay: true, endDate: '2026-10-23', startTime: '' });
    expect(r.ics).toContain('DTSTART;VALUE=DATE:20261021\r\n');
    expect(r.ics).toContain('DTEND;VALUE=DATE:20261024\r\n');
    expect(r.googleUrl).toContain('dates=20261021/20261024');
  });

  it('終日の月またぎ・年またぎ', () => {
    const r = ok({
      allDay: true,
      startDate: '2026-12-30',
      endDate: '2026-12-31',
    });
    expect(r.ics).toContain('DTEND;VALUE=DATE:20270101\r\n');
  });

  it('説明・場所・URLを出力しエスケープする', () => {
    const r = ok({
      summary: 'A, B; C',
      description: '1行目\n2行目',
      location: '東京, 渋谷',
      url: 'https://example.com/a?b=1',
    });
    expect(r.ics).toContain('SUMMARY:A\\, B\\; C\r\n');
    expect(r.ics).toContain('DESCRIPTION:1行目\\n2行目\r\n');
    expect(r.ics).toContain('LOCATION:東京\\, 渋谷\r\n');
    expect(r.ics).toContain('URL:https://example.com/a?b=1\r\n');
  });

  it('長い説明は折り返され、どの行も75オクテット以内', () => {
    const r = ok({ description: 'これは長い説明です。'.repeat(20) });
    const enc = new TextEncoder();
    for (const l of r.ics.split('\r\n')) {
      expect(enc.encode(l).length).toBeLessThanOrEqual(75);
    }
  });

  it('毎週・曜日指定・回数', () => {
    const r = ok({
      freq: 'weekly',
      byDay: ['FR', 'MO'],
      interval: 2,
      endType: 'count',
      count: 5,
    });
    expect(r.rrule).toBe('FREQ=WEEKLY;INTERVAL=2;BYDAY=MO,FR;COUNT=5');
    expect(r.ics).toContain('RRULE:FREQ=WEEKLY;INTERVAL=2;BYDAY=MO,FR;COUNT=5');
    expect(r.googleUrl).toContain('recur=RRULE%3AFREQ%3DWEEKLY');
  });

  it('毎日・終わりなしは INTERVAL を省く', () => {
    expect(ok({ freq: 'daily' }).rrule).toBe('FREQ=DAILY');
    expect(ok({ freq: 'monthly' }).rrule).toBe('FREQ=MONTHLY');
    expect(ok({ freq: 'yearly' }).rrule).toBe('FREQ=YEARLY');
  });

  it('UNTIL: TZID は UTC、終日は DATE、フローティングはローカル', () => {
    const until = { freq: 'daily', endType: 'until', untilDate: '2026-10-31' };
    expect(ok(until as Partial<IcsEventInput>).rrule).toBe(
      'FREQ=DAILY;UNTIL=20261031T145959Z',
    );
    expect(ok({ ...until, allDay: true } as Partial<IcsEventInput>).rrule).toBe(
      'FREQ=DAILY;UNTIL=20261031',
    );
    expect(
      ok({ ...until, mode: 'floating' } as Partial<IcsEventInput>).rrule,
    ).toBe('FREQ=DAILY;UNTIL=20261031T235959');
  });

  it('通知(VALARM)を出力する', () => {
    const r = ok({ reminderMinutes: 30 });
    expect(r.ics).toContain(
      'BEGIN:VALARM\r\nACTION:DISPLAY\r\nDESCRIPTION:定例会議\r\nTRIGGER:-PT30M\r\nEND:VALARM\r\n',
    );
    expect(ok({ reminderMinutes: 0 }).ics).toContain('TRIGGER:PT0S');
  });

  it('Google リンクにタイトル・場所・ctz が入る', () => {
    const r = ok({ location: '渋谷', description: 'メモ' });
    const u = new URL(r.googleUrl);
    expect(u.origin + u.pathname).toBe(
      'https://calendar.google.com/calendar/render',
    );
    expect(u.searchParams.get('text')).toBe('定例会議');
    expect(u.searchParams.get('location')).toBe('渋谷');
    expect(u.searchParams.get('details')).toBe('メモ');
    expect(u.searchParams.get('ctz')).toBe('Asia/Tokyo');
    expect(u.searchParams.get('dates')).toBe('20261021T100000/20261021T113000');
  });

  it('エラー: 入力検証', () => {
    const err = (over: Partial<IcsEventInput>) => {
      const r = gen(over);
      return r.ok ? 'ok' : r.error;
    };
    expect(err({ summary: '  ' })).toBe('summaryRequired');
    expect(err({ startDate: '2026-13-01' })).toBe('startInvalid');
    expect(err({ startTime: '' })).toBe('startInvalid');
    expect(err({ endDate: 'x' })).toBe('endInvalid');
    expect(err({ endTime: '25:00' })).toBe('endInvalid');
    expect(err({ endTime: '09:00' })).toBe('endBeforeStart');
    expect(err({ allDay: true, endDate: '2026-10-20' })).toBe('endBeforeStart');
    expect(err({ timeZone: 'Mars/Base' })).toBe('timeZoneInvalid');
    expect(err({ freq: 'daily', interval: 0 })).toBe('intervalInvalid');
    expect(err({ freq: 'daily', endType: 'count', count: 1000 })).toBe(
      'countInvalid',
    );
    expect(err({ freq: 'daily', endType: 'until', untilDate: '' })).toBe(
      'untilInvalid',
    );
    expect(
      err({ freq: 'daily', endType: 'until', untilDate: '2026-10-01' }),
    ).toBe('untilBeforeStart');
    expect(err({ reminderMinutes: -1 })).toBe('reminderInvalid');
    expect(err({ reminderMinutes: 1.5 })).toBe('reminderInvalid');
    expect(err({ url: 'javascript:alert(1)' })).toBe('urlInvalid');
  });

  it('繰り返しなしのときは回数等が不正でもエラーにしない', () => {
    expect(gen({ interval: 0, count: 0 }).ok).toBe(true);
  });

  it('同時刻の開始・終了は許可する', () => {
    expect(gen({ endTime: '10:00' }).ok).toBe(true);
  });
});

describe('generateIcs edge cases', () => {
  it('終日で終了日が9999-12-31なら不正な日付を出さずエラーにする', () => {
    const r = gen({
      allDay: true,
      startDate: '9999-12-31',
      endDate: '9999-12-31',
    });
    expect(r.ok).toBe(false);
  });

  it('URLに改行・空白を含む場合はエラーにする', () => {
    const r = gen({ url: 'https://a.com/x\nATTENDEE:evil' });
    expect(r.ok).toBe(false);
  });

  it('IANA形式でないタイムゾーンはエラーにする', () => {
    const r = gen({ timeZone: '+09:00' });
    expect(r.ok).toBe(false);
  });
});

describe('icsFileName', () => {
  it('使えない文字を置き換える', () => {
    expect(icsFileName('a/b:c')).toBe('a-b-c.ics');
    expect(icsFileName('  ')).toBe('event.ics');
    expect(icsFileName('x'.repeat(80)).length).toBe(54);
  });

  it('絵文字の途中で切らない', () => {
    const name = icsFileName('a'.repeat(49) + '😀😀');
    expect(name).toBe('a'.repeat(49) + '😀.ics');
  });
});
