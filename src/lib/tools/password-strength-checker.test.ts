import { describe, expect, it } from 'vitest';
import {
  OFFLINE_GUESSES_PER_SECOND,
  checkPassword,
  describeDuration,
  estimateCrackSeconds,
} from './password-strength-checker';

describe('checkPassword', () => {
  it('空文字は0ビット・スコア0', () => {
    const r = checkPassword('');
    expect(r.bits).toBe(0);
    expect(r.score).toBe(0);
    expect(r.issues).toEqual([]);
  });

  it('よくあるパスワードは最弱になる', () => {
    const r = checkPassword('password');
    expect(r.score).toBe(0);
    expect(r.issues).toContain('common');
    expect(checkPassword('P@ssw0rd').issues).toContain('common');
  });

  it('よくあるパスワードに数字を足しただけの派生を検出する', () => {
    expect(checkPassword('password2024!').issues).toContain('common-base');
  });

  it('数字のみ・8文字未満を検出する', () => {
    const r = checkPassword('4829');
    expect(r.issues).toContain('only-digits');
    expect(r.issues).toContain('too-short');
  });

  it('繰り返し・連番・キーボード配列を検出して割り引く', () => {
    expect(checkPassword('aaaaaaaaaa').issues).toContain('repeated');
    expect(checkPassword('abcdefgh').issues).toContain('sequence');
    expect(checkPassword('13579qwerty').issues).toContain('keyboard');
    const plain = checkPassword('xk3vq9zm');
    const patterned = checkPassword('aaaaaaaa');
    expect(patterned.bits).toBeLessThan(patterned.rawBits);
    expect(plain.bits).toBe(plain.rawBits);
  });

  it('辞書語の埋め込みと同じ並びの繰り返しを割り引く', () => {
    const embedded = checkPassword('MyPassword123');
    expect(embedded.issues).toContain('common-base');
    expect(embedded.score).toBeLessThan(3);
    const doubled = checkPassword('passwordpassword');
    expect(doubled.issues).toContain('repeated');
    expect(doubled.score).toBeLessThan(3);
  });

  it('2文字だけの連続はパターン扱いしない', () => {
    expect(checkPassword('abXk9Zq2').issues).not.toContain('sequence');
  });

  it('長くランダムなパスワードは非常に強い', () => {
    const r = checkPassword('G7#kLq9!vXz2$mRt');
    expect(r.score).toBe(4);
    expect(r.issues).toEqual([]);
    expect(r.hasLowercase && r.hasUppercase && r.hasNumber && r.hasSymbol).toBe(
      true,
    );
  });

  it('日本語などASCII外の文字もプールに加える', () => {
    const r = checkPassword('あいうえおかきく');
    expect(r.rawBits).toBeGreaterThan(8 * Math.log2(100) - 0.001);
  });

  it('サロゲートペアを1文字として数える', () => {
    expect(checkPassword('😀😀').length).toBe(2);
  });
});

describe('estimateCrackSeconds / describeDuration', () => {
  it('ビット数が大きいほど長くなる', () => {
    expect(estimateCrackSeconds(0, 1)).toBe(0);
    expect(estimateCrackSeconds(40, OFFLINE_GUESSES_PER_SECOND)).toBeLessThan(
      estimateCrackSeconds(80, OFFLINE_GUESSES_PER_SECOND),
    );
  });

  it('単位を切り替える', () => {
    expect(describeDuration(0.5)).toEqual({ unit: 'instant', value: 0 });
    expect(describeDuration(30)).toEqual({ unit: 'seconds', value: 30 });
    expect(describeDuration(120)).toEqual({ unit: 'minutes', value: 2 });
    expect(describeDuration(7200)).toEqual({ unit: 'hours', value: 2 });
    expect(describeDuration(86400 * 3)).toEqual({ unit: 'days', value: 3 });
    expect(describeDuration(31_557_600 * 5).unit).toBe('years');
    expect(describeDuration(Infinity).unit).toBe('millionYears');
    expect(describeDuration(1e30).unit).toBe('millionYears');
  });
});
