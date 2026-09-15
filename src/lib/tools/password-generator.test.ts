import { describe, expect, it } from 'vitest';
import {
  buildCharPool,
  clampPasswordCount,
  clampPasswordLength,
  EmptyCharPoolError,
  evaluatePasswordStrength,
  generatePassword,
  generatePasswords,
} from './password-generator';

describe('clampPasswordLength', () => {
  it('4未満は4に切り上げる', () => {
    expect(clampPasswordLength(0)).toBe(4);
    expect(clampPasswordLength(-5)).toBe(4);
  });

  it('128超は128に切り下げる', () => {
    expect(clampPasswordLength(1000)).toBe(128);
  });

  it('小数は切り捨てる', () => {
    expect(clampPasswordLength(10.7)).toBe(10);
  });

  it('不正な値はデフォルト値にフォールバックする', () => {
    expect(clampPasswordLength(NaN)).toBe(16);
  });
});

describe('clampPasswordCount', () => {
  it('1未満は1に切り上げる', () => {
    expect(clampPasswordCount(0)).toBe(1);
    expect(clampPasswordCount(-5)).toBe(1);
  });

  it('100超は100に切り下げる', () => {
    expect(clampPasswordCount(1000)).toBe(100);
  });

  it('小数は切り捨てる', () => {
    expect(clampPasswordCount(3.7)).toBe(3);
  });

  it('不正な値は1にフォールバックする', () => {
    expect(clampPasswordCount(NaN)).toBe(1);
  });
});

describe('buildCharPool', () => {
  it('選択した文字種だけを含む', () => {
    expect(buildCharPool({ lowercase: true })).toBe(
      'abcdefghijklmnopqrstuvwxyz',
    );
    expect(buildCharPool({ numbers: true })).toBe('0123456789');
  });

  it('何も選択しなければ空文字になる', () => {
    expect(buildCharPool({})).toBe('');
  });

  it('excludeSimilar指定時は紛らわしい文字を除く', () => {
    const pool = buildCharPool({
      lowercase: true,
      uppercase: true,
      numbers: true,
      excludeSimilar: true,
    });
    expect(pool).not.toMatch(/[il1IloO0]/);
  });
});

describe('generatePassword', () => {
  it('指定した長さのパスワードを生成する', () => {
    const password = generatePassword({ length: 20, lowercase: true });
    expect(password).toHaveLength(20);
  });

  it('選択した文字種のみで構成される', () => {
    const password = generatePassword({ length: 50, numbers: true });
    expect(password).toMatch(/^[0-9]+$/);
  });

  it('文字種が1つも選択されていない場合はEmptyCharPoolErrorを投げる', () => {
    expect(() => generatePassword({ length: 10 })).toThrow(EmptyCharPoolError);
  });

  it('長さが範囲外でもクランプされる', () => {
    expect(generatePassword({ length: 0, lowercase: true })).toHaveLength(4);
    expect(generatePassword({ length: 9999, lowercase: true })).toHaveLength(
      128,
    );
  });

  it('生成のたびに異なる結果になる（極めて低い確率でしか一致しない）', () => {
    const a = generatePassword({ length: 32, lowercase: true, symbols: true });
    const b = generatePassword({ length: 32, lowercase: true, symbols: true });
    expect(a).not.toBe(b);
  });
});

describe('generatePasswords', () => {
  it('指定した個数だけ生成する', () => {
    const result = generatePasswords({
      length: 12,
      lowercase: true,
      count: 10,
    });
    expect(result).toHaveLength(10);
  });

  it('個数指定が範囲外でもクランプされる', () => {
    expect(
      generatePasswords({ length: 8, lowercase: true, count: 0 }),
    ).toHaveLength(1);
    expect(
      generatePasswords({ length: 8, lowercase: true, count: 9999 }),
    ).toHaveLength(100);
  });

  it('生成される各パスワードは重複しない', () => {
    const result = generatePasswords({
      length: 20,
      lowercase: true,
      uppercase: true,
      numbers: true,
      count: 50,
    });
    expect(new Set(result).size).toBe(50);
  });

  it('文字種が1つも選択されていない場合はEmptyCharPoolErrorを投げる', () => {
    expect(() => generatePasswords({ length: 10, count: 5 })).toThrow(
      EmptyCharPoolError,
    );
  });
});

describe('evaluatePasswordStrength', () => {
  it('文字種が未選択ならweak・エントロピー0になる', () => {
    const result = evaluatePasswordStrength({ length: 16 });
    expect(result.entropyBits).toBe(0);
    expect(result.strength).toBe('weak');
  });

  it('短く文字種が少ない設定はweakになる', () => {
    const result = evaluatePasswordStrength({
      length: 4,
      lowercase: true,
    });
    expect(result.strength).toBe('weak');
  });

  it('長く多様な文字種を含む設定はvery-strongになる', () => {
    const result = evaluatePasswordStrength({
      length: 20,
      lowercase: true,
      uppercase: true,
      numbers: true,
      symbols: true,
    });
    expect(result.strength).toBe('very-strong');
  });

  it('文字種が増えるほどエントロピーが大きくなる', () => {
    const lowOnly = evaluatePasswordStrength({
      length: 8,
      lowercase: true,
    });
    const mixed = evaluatePasswordStrength({
      length: 8,
      lowercase: true,
      uppercase: true,
    });
    expect(mixed.entropyBits).toBeGreaterThan(lowOnly.entropyBits);
  });
});
