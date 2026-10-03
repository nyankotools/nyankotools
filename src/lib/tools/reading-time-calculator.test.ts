import { describe, it, expect } from 'vitest';
import {
  calculateReading,
  splitSeconds,
  type ReadingOptions,
} from './reading-time-calculator';

const base: ReadingOptions = {
  jaCharsPerMin: 500,
  enWordsPerMin: 200,
  manuscriptSize: 400,
  respectLineBreaks: false,
};

describe('calculateReading', () => {
  it('空文字はすべて0', () => {
    const r = calculateReading('', base);
    expect(r).toMatchObject({
      nonSpaceChars: 0,
      jaChars: 0,
      enWords: 0,
      readingSeconds: 0,
      speakingSeconds: 0,
      manuscriptRows: 0,
      manuscriptSheets: 0,
      manuscriptSheetsCeil: 0,
    });
  });

  it('日本語500字は読了1分・朗読100秒', () => {
    const r = calculateReading('あ'.repeat(500), base);
    expect(r.jaChars).toBe(500);
    expect(r.readingSeconds).toBeCloseTo(60);
    expect(r.speakingSeconds).toBeCloseTo(100);
  });

  it('英語は単語数で数える（アポストロフィ・ハイフン・数字を含む）', () => {
    const r = calculateReading("It's a well-known fact, 100 percent.", base);
    expect(r.enWords).toBe(6);
    expect(r.jaChars).toBe(0);
  });

  it('日英混在: 英単語は日本語文字数に含めない', () => {
    const r = calculateReading('これはTypeScriptです。', base);
    expect(r.enWords).toBe(1);
    expect(r.jaChars).toBe(6); // これは + です + 。
  });

  it('空白・改行を除いた文字数', () => {
    const r = calculateReading('a b\n　あ', base);
    expect(r.nonSpaceChars).toBe(3);
  });

  it('不正な速度値は既定値にフォールバックする', () => {
    const r = calculateReading('あ'.repeat(500), {
      ...base,
      jaCharsPerMin: 0,
    });
    expect(r.readingSeconds).toBeCloseTo(60);
    const r2 = calculateReading('あ'.repeat(500), {
      ...base,
      jaCharsPerMin: NaN,
    });
    expect(r2.readingSeconds).toBeCloseTo(60);
  });

  it('原稿用紙: 400字詰め（改行は無視）', () => {
    const r = calculateReading('あ'.repeat(401), base);
    expect(r.manuscriptRows).toBe(21);
    expect(r.manuscriptSheets).toBeCloseTo(1.05);
    expect(r.manuscriptSheetsCeil).toBe(2);
  });

  it('原稿用紙: 200字詰めは1枚10行', () => {
    const r = calculateReading('あ'.repeat(200), {
      ...base,
      manuscriptSize: 200,
    });
    expect(r.manuscriptSheets).toBe(1);
    expect(r.manuscriptSheetsCeil).toBe(1);
  });

  it('原稿用紙: 改行を考慮すると段落ごとに行が変わる', () => {
    const text = 'あ\n\nい\n';
    const off = calculateReading(text, base);
    const on = calculateReading(text, { ...base, respectLineBreaks: true });
    expect(off.manuscriptRows).toBe(1);
    expect(on.manuscriptRows).toBe(3); // 「あ」「空行」「い」（末尾の改行は無視）
  });

  it('サロゲートペアは1文字として数える', () => {
    const r = calculateReading('𠮷'.repeat(20), base);
    expect(r.manuscriptRows).toBe(1);
    expect(r.jaChars).toBe(20);
  });
});

describe('全角スペース', () => {
  it('日本語の文字数に数えない', () => {
    const r = calculateReading('\u3000あ', base);
    expect(r.jaChars).toBe(1);
    expect(r.nonSpaceChars).toBe(1);
  });
});

describe('splitSeconds', () => {
  it('分と秒に分ける', () => {
    expect(splitSeconds(90)).toEqual({ minutes: 1, seconds: 30 });
  });

  it('四捨五入して60秒は分に繰り上げる', () => {
    expect(splitSeconds(119.6)).toEqual({ minutes: 2, seconds: 0 });
  });

  it('負数は0', () => {
    expect(splitSeconds(-5)).toEqual({ minutes: 0, seconds: 0 });
  });
});
