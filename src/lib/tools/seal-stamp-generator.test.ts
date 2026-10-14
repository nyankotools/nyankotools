import { describe, it, expect } from 'vitest';
import {
  clampSize,
  computeStampLayout,
  formatStampDate,
  isStampEmpty,
  normalizeStampColor,
  parseIsoDate,
  stampFileName,
  stampLines,
  textWidthEm,
  toLocalIsoDate,
  verticalColumns,
  DEFAULT_STAMP_COLOR,
  MAX_STAMP_SIZE,
  MIN_STAMP_SIZE,
  type StampSpec,
} from './seal-stamp-generator';

const base: StampSpec = {
  kind: 'round',
  text: '山田',
  subText: '',
  dateText: '',
  orientation: 'vertical',
  thickness: 'normal',
  size: 300,
};

describe('stampLines / textWidthEm', () => {
  it('空行と前後の空白を除く', () => {
    expect(stampLines(' 山田 \r\n\n太郎\n')).toEqual(['山田', '太郎']);
    expect(stampLines('  \n ')).toEqual([]);
  });
  it('全角は1、半角は小さく見積もる', () => {
    expect(textWidthEm('山田')).toBe(2);
    expect(textWidthEm('ab')).toBeCloseTo(1.16);
  });
});

describe('verticalColumns', () => {
  it('角印の4文字は右列が先の2列に分ける', () => {
    expect(verticalColumns(['株式会社'], 'square')).toEqual([
      ['株', '式'],
      ['会', '社'],
    ]);
    expect(verticalColumns(['ABCDE'], 'square')).toEqual([
      ['A', 'B', 'C'],
      ['D', 'E'],
    ]);
  });
  it('丸印や改行ありはそのまま列にする', () => {
    expect(verticalColumns(['山田太郎'], 'round')).toEqual([
      ['山', '田', '太', '郎'],
    ]);
    expect(verticalColumns(['山田', '太郎'], 'square')).toEqual([
      ['山', '田'],
      ['太', '郎'],
    ]);
  });
  it('サロゲートペアを1文字として扱う', () => {
    expect(verticalColumns(['𠮷田'], 'round')).toEqual([['𠮷', '田']]);
  });
});

describe('computeStampLayout', () => {
  it('丸印の縦書きは1列で中央に並ぶ', () => {
    const l = computeStampLayout(base);
    expect(l.shape.type).toBe('circle');
    expect(l.texts.map((t) => t.text)).toEqual(['山', '田']);
    expect(l.texts[0].x).toBeCloseTo(150);
    expect(l.texts[0].y).toBeLessThan(l.texts[1].y);
  });
  it('縦書きの2列は1行目が右', () => {
    const l = computeStampLayout({
      ...base,
      kind: 'square',
      text: '山田\n太郎',
    });
    const right = l.texts.find((t) => t.text === '山')!;
    const left = l.texts.find((t) => t.text === '太')!;
    expect(right.x).toBeGreaterThan(left.x);
  });
  it('横書きは行ごとに上から並び、全て図形内に収まる', () => {
    const l = computeStampLayout({
      ...base,
      orientation: 'horizontal',
      text: '株式会社サンプル商事\n代表取締役',
    });
    expect(l.texts).toHaveLength(2);
    expect(l.texts[0].y).toBeLessThan(l.texts[1].y);
    for (const t of l.texts) {
      expect(t.fontSize).toBeGreaterThan(0);
      const w = textWidthEm(t.text) * t.fontSize;
      expect(w / 2).toBeLessThanOrEqual(150);
    }
  });
  it('日付印は横線2本と上中下の文字を持つ', () => {
    const l = computeStampLayout({
      ...base,
      kind: 'date',
      text: '山田',
      subText: '営業部',
      dateText: '2026.10.14',
    });
    expect(l.rules).toHaveLength(2);
    expect(l.texts.map((t) => t.text).sort()).toEqual(
      ['2026.10.14', '営業部', '山田'].sort(),
    );
    const top = l.texts.find((t) => t.text === '山田')!;
    const mid = l.texts.find((t) => t.text === '2026.10.14')!;
    const bottom = l.texts.find((t) => t.text === '営業部')!;
    expect(top.y).toBeLessThan(mid.y);
    expect(mid.y).toBeLessThan(bottom.y);
  });
  it('日付印の下段が空なら描かない', () => {
    const l = computeStampLayout({
      ...base,
      kind: 'date',
      text: '山田',
      dateText: '2026.10.14',
    });
    expect(l.texts).toHaveLength(2);
  });
  it('サイズは範囲に丸められる', () => {
    expect(computeStampLayout({ ...base, size: 5 }).size).toBe(MIN_STAMP_SIZE);
    expect(computeStampLayout({ ...base, size: 99999 }).size).toBe(
      MAX_STAMP_SIZE,
    );
  });
  it('文字が空でも枠は返る', () => {
    const l = computeStampLayout({ ...base, text: ' ' });
    expect(l.texts).toEqual([]);
    expect(l.lineWidth).toBeGreaterThan(0);
  });
});

describe('日付', () => {
  it('parseIsoDate は不正な日付を弾く', () => {
    expect(parseIsoDate('2026-10-14')).toEqual({
      year: 2026,
      month: 10,
      day: 14,
    });
    expect(parseIsoDate('2026-02-30')).toBeNull();
    expect(parseIsoDate('abc')).toBeNull();
    expect(parseIsoDate('')).toBeNull();
  });
  it('各形式に整形する', () => {
    expect(formatStampDate('2026-01-05', 'dot')).toBe('2026.01.05');
    expect(formatStampDate('2026-01-05', 'slash')).toBe('2026/01/05');
    expect(formatStampDate('2026-01-05', 'kanji')).toBe('2026年1月5日');
    expect(formatStampDate('2026-01-05', 'era')).toBe('令和8年1月5日');
    expect(formatStampDate('bad', 'dot')).toBe('');
  });
  it('元号の切り替わりと元年', () => {
    expect(formatStampDate('2019-05-01', 'era')).toBe('令和元年5月1日');
    expect(formatStampDate('2019-04-30', 'era')).toBe('平成31年4月30日');
    expect(formatStampDate('1989-01-08', 'era')).toBe('平成元年1月8日');
    expect(formatStampDate('1989-01-07', 'era')).toBe('昭和64年1月7日');
    expect(formatStampDate('1900-01-01', 'era')).toBe('1900年1月1日');
  });
  it('toLocalIsoDate はゼロ埋めする', () => {
    expect(toLocalIsoDate(new Date(2026, 0, 5))).toBe('2026-01-05');
  });
});

describe('その他', () => {
  it('色を正規化する', () => {
    expect(normalizeStampColor('#ABC')).toBe('#aabbcc');
    expect(normalizeStampColor('d7261e')).toBe('#d7261e');
    expect(normalizeStampColor('red')).toBe(DEFAULT_STAMP_COLOR);
  });
  it('clampSize', () => {
    expect(clampSize(NaN)).toBe(300);
    expect(clampSize(250.4)).toBe(250);
  });
  it('ファイル名と空判定', () => {
    expect(stampFileName('date')).toBe('seal-date.png');
    expect(isStampEmpty({ ...base, text: '' })).toBe(true);
    expect(
      isStampEmpty({ ...base, kind: 'date', text: '', dateText: '2026.1.1' }),
    ).toBe(false);
  });
});
