import { describe, expect, it } from 'vitest';
import {
  analyzeNormalization,
  computeStats,
  formatCodePoints,
  normalizeText,
} from './unicode-normalizer';

const DECOMPOSED_GA = 'が'; // か + 濁点
const COMPOSED_GA = 'が';

describe('normalizeText', () => {
  it('NFCで分離した濁点を合成する', () => {
    expect(normalizeText(DECOMPOSED_GA, 'NFC')).toBe(COMPOSED_GA);
  });
  it('NFDで濁点を分離する', () => {
    expect(normalizeText(COMPOSED_GA, 'NFD')).toBe(DECOMPOSED_GA);
  });
  it('NFKCで半角カナ・全角英数を変換する', () => {
    expect(normalizeText('ﾊﾞｲﾄ', 'NFKC')).toBe('バイト');
    expect(normalizeText('ＡＢＣ１２３', 'NFKC')).toBe('ABC123');
  });
  it('NFCでは互換文字を変えない', () => {
    expect(normalizeText('ＡＢＣ', 'NFC')).toBe('ＡＢＣ');
  });
  it('NFKDは互換分解もする', () => {
    expect(normalizeText('㌔', 'NFKD')).toBe('キロ'.normalize('NFD'));
  });
  it('空文字はそのまま', () => {
    expect(normalizeText('', 'NFC')).toBe('');
  });
});

describe('computeStats', () => {
  it('分離濁点を数える', () => {
    const s = computeStats(DECOMPOSED_GA + 'ぱ');
    expect(s.decomposedKana).toBe(2);
    expect(s.codePoints).toBe(4);
  });
  it('サロゲートペアをコードポイントとして数える', () => {
    const s = computeStats('😀');
    expect(s.codePoints).toBe(1);
    expect(s.utf16Length).toBe(2);
  });
});

describe('formatCodePoints', () => {
  it('U+XXXX 形式で並べる', () => {
    expect(formatCodePoints(DECOMPOSED_GA)).toBe('U+304B U+3099');
    expect(formatCodePoints('😀')).toBe('U+1F600');
  });
});

describe('analyzeNormalization', () => {
  it('変化がなければ changed=false で一覧も空', () => {
    const r = analyzeNormalization('abc あいう', 'NFC');
    expect(r.changed).toBe(false);
    expect(r.changes).toEqual([]);
    expect(r.changeCount).toBe(0);
  });
  it('分離濁点の合成を一覧化する', () => {
    const r = analyzeNormalization('x' + DECOMPOSED_GA + 'y', 'NFC');
    expect(r.output).toBe('x' + COMPOSED_GA + 'y');
    expect(r.changes).toHaveLength(1);
    expect(r.changes[0].beforeCodes).toBe('U+304B U+3099');
    expect(r.changes[0].afterCodes).toBe('U+304C');
    expect(r.before.decomposedKana).toBe(1);
    expect(r.after.decomposedKana).toBe(0);
  });
  it('半角カナ+半角濁点を1単位として扱う', () => {
    const r = analyzeNormalization('ﾊﾞ', 'NFKC');
    expect(r.output).toBe('バ');
    expect(r.changeCount).toBe(1);
    expect(r.changes[0].before).toBe('ﾊﾞ');
  });
  it('一覧は上限で切り詰め、総数は保持する', () => {
    const r = analyzeNormalization(DECOMPOSED_GA.repeat(10), 'NFC', 3);
    expect(r.changes).toHaveLength(3);
    expect(r.changeCount).toBe(10);
  });
  it('先頭の孤立した結合文字でも例外にならない', () => {
    const r = analyzeNormalization('゙a', 'NFC');
    expect(r.output).toBe('゙a');
  });
  it('改行を挟んでも変換箇所を1件ずつ数える', () => {
    const r = analyzeNormalization(
      `${DECOMPOSED_GA}\r\n${DECOMPOSED_GA}\r${DECOMPOSED_GA}\n`,
      'NFC',
    );
    expect(r.changeCount).toBe(3);
    expect(r.output).toBe(`${COMPOSED_GA}\r\n${COMPOSED_GA}\r${COMPOSED_GA}\n`);
  });
  it('大量の変換箇所（1万件）でも総数と上限を正しく扱う', () => {
    const r = analyzeNormalization(DECOMPOSED_GA.repeat(10000), 'NFC');
    expect(r.changeCount).toBe(10000);
    expect(r.changes).toHaveLength(50);
    expect(r.after.codePoints).toBe(10000);
  });
});

describe('ハングル字母の合成', () => {
  it('分解済みハングルのNFC変換が変更一覧に出る', () => {
    const r = analyzeNormalization('각', 'NFC');
    expect(r.output).toBe('각');
    expect(r.changeCount).toBe(1);
    expect(r.changes[0].after).toBe('각');
  });
});
