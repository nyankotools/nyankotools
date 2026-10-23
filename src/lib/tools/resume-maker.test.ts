import { describe, expect, it } from 'vitest';
import {
  EMPTY_RESUME,
  HISTORY_ROWS,
  MOTIVATION_LINES,
  buildHistoryRows,
  calcAge,
  formatDateJa,
  formatYearCell,
  layoutResume,
  normalizePostal,
  parseEntries,
  parseIsoDate,
  parseStoredResume,
  serializeResume,
  textWidth,
  toEra,
  todayIso,
  wrapByWidth,
  wrapParagraphs,
} from './resume-maker';

const labels = { education: '学歴', work: '職歴', end: '以上' };

describe('parseIsoDate', () => {
  it('正しい日付を読む', () => {
    expect(parseIsoDate('2024-02-29')).toEqual({
      year: 2024,
      month: 2,
      day: 29,
    });
  });
  it('存在しない日付・形式違いは null', () => {
    expect(parseIsoDate('2023-02-29')).toBeNull();
    expect(parseIsoDate('2023-13-01')).toBeNull();
    expect(parseIsoDate('2023/01/01')).toBeNull();
    expect(parseIsoDate('')).toBeNull();
  });
});

describe('和暦', () => {
  it('改元の境界', () => {
    expect(toEra(2019, 4, 30)).toEqual({ name: '平成', year: 31 });
    expect(toEra(2019, 5, 1)).toEqual({ name: '令和', year: 1 });
    expect(toEra(1989, 1, 7)).toEqual({ name: '昭和', year: 64 });
    expect(toEra(1989, 1, 8)).toEqual({ name: '平成', year: 1 });
    expect(toEra(1926, 12, 25)).toEqual({ name: '昭和', year: 1 });
    expect(toEra(1912, 7, 30)).toEqual({ name: '大正', year: 1 });
    expect(toEra(1867, 1, 1)).toBeNull();
  });
  it('年欄は元年を「元」と書く', () => {
    expect(formatYearCell(2019, 5, 'wareki')).toBe('令和元');
    expect(formatYearCell(2023, 4, 'wareki')).toBe('令和5');
    expect(formatYearCell(2023, 4, 'seireki')).toBe('2023');
    expect(formatYearCell(1800, 4, 'wareki')).toBe('1800');
  });
  it('月だけの境界は月の中ごろで判定する', () => {
    expect(formatYearCell(2019, 4, 'wareki')).toBe('平成31');
    expect(formatYearCell(2019, 5, 'wareki')).toBe('令和元');
    expect(formatYearCell(1989, 1, 'wareki')).toBe('平成元');
  });
  it('日付の表示', () => {
    expect(formatDateJa('2026-10-23', 'wareki')).toBe('令和8年10月23日');
    expect(formatDateJa('2026-10-23', 'seireki')).toBe('2026年10月23日');
    expect(formatDateJa('2019-05-01', 'wareki')).toBe('令和元年5月1日');
    expect(formatDateJa('', 'wareki')).toBe('');
    expect(formatDateJa('xxxx', 'wareki')).toBe('');
  });
});

describe('calcAge', () => {
  it('誕生日の前後で変わる', () => {
    expect(calcAge('1990-04-01', '2026-03-31')).toBe(35);
    expect(calcAge('1990-04-01', '2026-04-01')).toBe(36);
  });
  it('うるう日生まれ', () => {
    expect(calcAge('2000-02-29', '2023-02-28')).toBe(22);
    expect(calcAge('2000-02-29', '2023-03-01')).toBe(23);
  });
  it('未来の生年月日や不正値は null', () => {
    expect(calcAge('2030-01-01', '2026-01-01')).toBeNull();
    expect(calcAge('', '2026-01-01')).toBeNull();
    expect(calcAge('1990-01-01', '')).toBeNull();
  });
});

describe('折り返し', () => {
  it('全角=1、半角=0.5で数える', () => {
    expect(textWidth('あa')).toBe(1.5);
    expect(textWidth('ｱ')).toBe(0.5);
  });
  it('幅を超えたら文字単位で折る', () => {
    expect(wrapByWidth('あいうえお', 2)).toEqual(['あい', 'うえ', 'お']);
    expect(wrapByWidth('abcd', 1)).toEqual(['ab', 'cd']);
  });
  it('空文字列は1行、サロゲートペアを壊さない', () => {
    expect(wrapByWidth('', 5)).toEqual(['']);
    expect(wrapByWidth('𠮷野家', 1)).toEqual(['𠮷', '野', '家']);
  });
  it('段落を保ち末尾の空行は捨てる', () => {
    expect(wrapParagraphs('あ\n\nい\n\n', 5)).toEqual(['あ', '', 'い']);
    expect(wrapParagraphs('  \n', 5)).toEqual([]);
    expect(wrapParagraphs('あ\r\nい', 5)).toEqual(['あ', 'い']);
  });
});

describe('parseEntries', () => {
  it('ハイフン・スラッシュ・年月の書き方を読む', () => {
    const { entries, badLines } = parseEntries(
      '2015-04 ○○高校 入学\n2018/3 卒業\n2018年4月入社\n令和元年5月 転職\n平成31年4月 在籍',
    );
    expect(badLines).toEqual([]);
    expect(entries).toEqual([
      { year: 2015, month: 4, text: '○○高校 入学' },
      { year: 2018, month: 3, text: '卒業' },
      { year: 2018, month: 4, text: '入社' },
      { year: 2019, month: 5, text: '転職' },
      { year: 2019, month: 4, text: '在籍' },
    ]);
  });
  it('日付のない行はそのまま、空行は無視する', () => {
    const { entries } = parseEntries('\n  現在に至る  \n\n');
    expect(entries).toEqual([{ year: null, month: null, text: '現在に至る' }]);
  });
  it('4桁の数字だけで始まる行は日付とみなさない', () => {
    const { entries } = parseEntries('1000人規模の会社');
    expect(entries[0].year).toBeNull();
  });
  it('月が範囲外の行は badLines に入る', () => {
    const { entries, badLines } = parseEntries('2015-13 入学');
    expect(badLines).toEqual(['2015-13 入学']);
    expect(entries[0].year).toBeNull();
  });
});

describe('buildHistoryRows', () => {
  it('見出し・学歴・空行・見出し・職歴・以上の順になる', () => {
    const { rows } = buildHistoryRows(
      '2010-04 ○○高校 入学',
      '2014-04 株式会社A 入社',
      'wareki',
      labels,
    );
    expect(rows.map((r) => r.kind)).toEqual([
      'heading',
      'entry',
      'blank',
      'heading',
      'entry',
      'end',
    ]);
    expect(rows[1]).toMatchObject({ year: '平成22', month: '4' });
    expect(rows[5].text).toBe('以上');
  });
  it('長い行は継続行に折り返す', () => {
    const { rows } = buildHistoryRows(
      '',
      `2020-04 ${'あ'.repeat(40)}`,
      'seireki',
      labels,
    );
    const work = rows.filter((r) => r.kind === 'entry' || r.kind === 'cont');
    expect(work.map((r) => r.kind)).toEqual(['entry', 'cont']);
    expect(work[0].year).toBe('2020');
    expect(work[1].year).toBe('');
  });
  it('空でも見出しと以上は出る', () => {
    const { rows } = buildHistoryRows('', '', 'wareki', labels);
    expect(rows.map((r) => r.text)).toEqual(['学歴', '', '職歴', '以上']);
  });
});

describe('layoutResume', () => {
  it('日付・年齢・生年月日を組み立てる', () => {
    const l = layoutResume(
      {
        ...EMPTY_RESUME,
        date: '2026-10-23',
        birth: '1990-04-01',
      },
      labels,
    );
    expect(l.dateText).toBe('令和8年10月23日');
    expect(l.birthText).toBe('平成2年4月1日生');
    expect(l.age).toBe(36);
    expect(l.issues).toEqual([]);
  });
  it('学歴・職歴が行数を超えると history の問題になる', () => {
    const work = Array.from({ length: HISTORY_ROWS }, (_, i) => `2020-04 ${i}`);
    const l = layoutResume({ ...EMPTY_RESUME, work: work.join('\n') }, labels);
    const issue = l.issues.find((i) => i.code === 'history');
    expect(issue?.limit).toBe(HISTORY_ROWS);
    expect(issue?.actual).toBeGreaterThan(HISTORY_ROWS);
  });
  it('志望動機が行数ちょうどなら問題なし、超えると問題', () => {
    const ok = Array.from({ length: MOTIVATION_LINES }, () => 'あ').join('\n');
    expect(
      layoutResume({ ...EMPTY_RESUME, motivation: ok }, labels).issues,
    ).toEqual([]);
    const over = `${ok}\nあ`;
    const l = layoutResume({ ...EMPTY_RESUME, motivation: over }, labels);
    expect(l.issues.map((i) => i.code)).toEqual(['motivation']);
  });
  it('日付が読めない行は entryDate として返す', () => {
    const l = layoutResume(
      { ...EMPTY_RESUME, licenses: '2020-00 普通自動車免許' },
      labels,
    );
    expect(l.issues).toEqual([
      { code: 'entryDate', line: '2020-00 普通自動車免許' },
    ]);
  });
});

describe('todayIso', () => {
  it('ローカル日付をゼロ埋めで返す', () => {
    expect(todayIso(new Date(2026, 0, 5))).toBe('2026-01-05');
    expect(todayIso(new Date(2026, 11, 31))).toBe('2026-12-31');
  });
});

describe('normalizePostal', () => {
  it('7桁をハイフン形式にそろえる', () => {
    expect(normalizePostal('1000001')).toBe('100-0001');
    expect(normalizePostal('１００－０００１')).toBe('100-0001');
    expect(normalizePostal('')).toBe('');
  });
  it('7桁でなければ null', () => {
    expect(normalizePostal('123')).toBeNull();
    expect(normalizePostal('abcdefg')).toBeNull();
  });
});

describe('保存データ', () => {
  it('往復できる', () => {
    const data = {
      ...EMPTY_RESUME,
      name: '山田 太郎',
      gender: 'male' as const,
      era: 'seireki' as const,
      motivation: '貴社の\n理念に共感',
    };
    expect(parseStoredResume(serializeResume(data))).toEqual(data);
  });
  it('壊れた・別バージョンのデータは null', () => {
    expect(parseStoredResume(null)).toBeNull();
    expect(parseStoredResume('')).toBeNull();
    expect(parseStoredResume('{')).toBeNull();
    expect(parseStoredResume('[]')).toBeNull();
    expect(parseStoredResume('{"v":99,"data":{}}')).toBeNull();
    expect(parseStoredResume('{"v":1}')).toBeNull();
  });
  it('型の違う項目は空にして、不正な列挙値は既定値にする', () => {
    const r = parseStoredResume(
      '{"v":1,"data":{"name":123,"gender":"x","era":"foo","address":"東京"}}',
    );
    expect(r).toEqual({ ...EMPTY_RESUME, address: '東京' });
  });
});

describe('parseEntries 全角数字', () => {
  it('全角数字の年月を日付として読み取る', () => {
    const r = parseEntries('２０１５年４月 入社');
    expect(r.entries[0]).toMatchObject({ year: 2015 });
  });
});
