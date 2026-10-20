import { describe, expect, it } from 'vitest';
import {
  calculatePassphraseEntropy,
  clampPassphraseCount,
  clampWordCount,
  EmptyWordlistError,
  evaluatePassphrase,
  generatePassphrase,
  generatePassphrases,
  randomInt,
  sanitizeSeparator,
} from './passphrase-generator';
import { PASSPHRASE_WORDLIST } from './passphrase-wordlist';

const SMALL = ['alpha', 'bravo', 'charlie', 'delta'];

describe('PASSPHRASE_WORDLIST', () => {
  it('EFF大型リストの7,776語で重複がない', () => {
    expect(PASSPHRASE_WORDLIST).toHaveLength(7776);
    expect(new Set(PASSPHRASE_WORDLIST).size).toBe(7776);
  });

  it('先頭と末尾がEFFリストと一致する', () => {
    expect(PASSPHRASE_WORDLIST[0]).toBe('abacus');
    expect(PASSPHRASE_WORDLIST[7775]).toBe('zoom');
  });

  it('各語は小文字英字（一部ハイフン）で空要素がない', () => {
    for (const word of PASSPHRASE_WORDLIST) {
      expect(word).toMatch(/^[a-z]+(-[a-z]+)?$/);
    }
  });
});

describe('clamp', () => {
  it('単語数を3〜12に丸める', () => {
    expect(clampWordCount(0)).toBe(3);
    expect(clampWordCount(99)).toBe(12);
    expect(clampWordCount(5.9)).toBe(5);
    expect(clampWordCount(NaN)).toBe(6);
  });

  it('個数を1〜50に丸める', () => {
    expect(clampPassphraseCount(0)).toBe(1);
    expect(clampPassphraseCount(999)).toBe(50);
    expect(clampPassphraseCount(NaN)).toBe(1);
  });
});

describe('sanitizeSeparator', () => {
  it('制御文字を除き5文字までに切り詰める', () => {
    expect(sanitizeSeparator('-\n')).toBe('-');
    expect(sanitizeSeparator('abcdefgh')).toBe('abcde');
    expect(sanitizeSeparator('')).toBe('');
  });
});

describe('randomInt', () => {
  it('範囲内の整数を返す', () => {
    for (let i = 0; i < 500; i++) {
      const v = randomInt(7);
      expect(Number.isInteger(v)).toBe(true);
      expect(v).toBeGreaterThanOrEqual(0);
      expect(v).toBeLessThan(7);
    }
  });

  it('max=1は常に0', () => {
    expect(randomInt(1)).toBe(0);
  });

  it('全ての値が出現する（偏りの目安）', () => {
    const seen = new Set<number>();
    for (let i = 0; i < 1000; i++) seen.add(randomInt(6));
    expect(seen.size).toBe(6);
  });

  it('不正なmaxはRangeError', () => {
    expect(() => randomInt(0)).toThrow(RangeError);
    expect(() => randomInt(1.5)).toThrow(RangeError);
  });
});

describe('generatePassphrase', () => {
  it('指定語数を区切り文字で連結する', () => {
    const p = generatePassphrase(SMALL, { wordCount: 5, separator: '-' });
    const parts = p.split('-');
    expect(parts).toHaveLength(5);
    for (const part of parts) expect(SMALL).toContain(part);
  });

  it('区切り文字なしでも生成できる', () => {
    const p = generatePassphrase(SMALL, { wordCount: 3 });
    expect(p).toMatch(/^(alpha|bravo|charlie|delta)+$/);
  });

  it('capitalizeで各語の先頭が大文字になる', () => {
    const p = generatePassphrase(SMALL, {
      wordCount: 8,
      separator: ' ',
      capitalize: true,
    });
    for (const part of p.split(' ')) expect(part).toMatch(/^[A-Z][a-z]+$/);
  });

  it('appendNumberで数字がちょうど1つ付く', () => {
    const p = generatePassphrase(SMALL, {
      wordCount: 4,
      separator: ' ',
      appendNumber: true,
    });
    expect(p.match(/[0-9]/g)).toHaveLength(1);
    expect(p).toMatch(/[a-z][0-9]( |$)/);
  });

  it('語数が範囲外でもクランプされる', () => {
    expect(
      generatePassphrase(SMALL, { wordCount: 1, separator: ' ' }).split(' '),
    ).toHaveLength(3);
    expect(
      generatePassphrase(SMALL, { wordCount: 100, separator: ' ' }).split(' '),
    ).toHaveLength(12);
  });

  it('空の単語リストはEmptyWordlistError', () => {
    expect(() => generatePassphrase([], { wordCount: 4 })).toThrow(
      EmptyWordlistError,
    );
  });

  it('実リストから生成すると実在語のみになる', () => {
    const set = new Set(PASSPHRASE_WORDLIST);
    const p = generatePassphrase(PASSPHRASE_WORDLIST, {
      wordCount: 6,
      separator: ' ',
    });
    for (const w of p.split(' ')) expect(set.has(w)).toBe(true);
  });
});

describe('generatePassphrases', () => {
  it('指定個数を生成し、範囲外はクランプする', () => {
    const o = { wordCount: 4, separator: '-' };
    expect(generatePassphrases(SMALL, { ...o, count: 5 })).toHaveLength(5);
    expect(generatePassphrases(SMALL, { ...o, count: 0 })).toHaveLength(1);
    expect(generatePassphrases(SMALL, { ...o, count: 999 })).toHaveLength(50);
  });

  it('実リストでは重複しない', () => {
    const r = generatePassphrases(PASSPHRASE_WORDLIST, {
      wordCount: 6,
      separator: '-',
      count: 30,
    });
    expect(new Set(r).size).toBe(30);
  });
});

describe('entropy', () => {
  it('6語で約77.5ビット', () => {
    expect(calculatePassphraseEntropy(7776, { wordCount: 6 })).toBeCloseTo(
      77.55,
      1,
    );
  });

  it('数字付加でlog2(語数*10)だけ増える', () => {
    const base = calculatePassphraseEntropy(7776, { wordCount: 4 });
    const withNum = calculatePassphraseEntropy(7776, {
      wordCount: 4,
      appendNumber: true,
    });
    expect(withNum - base).toBeCloseTo(Math.log2(40), 6);
  });

  it('空リストは0ビット', () => {
    expect(calculatePassphraseEntropy(0, { wordCount: 6 })).toBe(0);
  });

  it('強度が語数に応じて上がる', () => {
    expect(evaluatePassphrase(7776, { wordCount: 3 }).strength).toBe('weak');
    expect(evaluatePassphrase(7776, { wordCount: 4 }).strength).toBe('fair');
    expect(evaluatePassphrase(7776, { wordCount: 6 }).strength).toBe('strong');
    expect(evaluatePassphrase(7776, { wordCount: 8 }).strength).toBe(
      'very-strong',
    );
  });
});
