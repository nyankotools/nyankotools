import { describe, it, expect } from 'vitest';
import {
  atbash,
  caesar,
  caesarBruteForce,
  normalizeShift,
  normalizeVigenereKey,
  rot13,
  rot47,
  transform,
  vigenere,
} from './classical-cipher';

describe('normalizeShift', () => {
  it('負数・26以上・小数・NaNを0〜25に正規化する', () => {
    expect(normalizeShift(-1)).toBe(25);
    expect(normalizeShift(27)).toBe(1);
    expect(normalizeShift(3.9)).toBe(3);
    expect(normalizeShift(NaN)).toBe(0);
    expect(normalizeShift(-26)).toBe(0);
  });
});

describe('caesar', () => {
  it('シフト3で暗号化する', () => {
    expect(caesar('Hello, World!', 3)).toBe('Khoor, Zruog!');
  });
  it('復号で元に戻る', () => {
    expect(caesar('Khoor, Zruog!', 3, 'decrypt')).toBe('Hello, World!');
  });
  it('大文字小文字を保持し、英字以外は通す', () => {
    expect(caesar('xyz XYZ 123 こんにちは 😀', 3)).toBe(
      'abc ABC 123 こんにちは 😀',
    );
  });
  it('シフト0・26は変化しない', () => {
    expect(caesar('Abc', 0)).toBe('Abc');
    expect(caesar('Abc', 26)).toBe('Abc');
  });
  it('負のシフトは逆方向', () => {
    expect(caesar('abc', -1)).toBe('zab');
  });
  it('空文字はそのまま', () => {
    expect(caesar('', 5)).toBe('');
  });
});

describe('rot13', () => {
  it('変換と逆変換が同じ', () => {
    expect(rot13('Hello')).toBe('Uryyb');
    expect(rot13(rot13('Hello, World!'))).toBe('Hello, World!');
  });
});

describe('rot47', () => {
  it('既知の値に変換される', () => {
    expect(rot47('Hello')).toBe('w6==@');
  });
  it('2回で元に戻り、範囲外の文字は通す', () => {
    const s = 'Hello, World! ~ あ 123';
    expect(rot47(rot47(s))).toBe(s);
    expect(rot47('あ ')).toBe('あ ');
  });
});

describe('atbash', () => {
  it('A↔Zに対応する', () => {
    expect(atbash('Hello, World!')).toBe('Svool, Dliow!');
    expect(atbash(atbash('Hello, World!'))).toBe('Hello, World!');
  });
});

describe('vigenere', () => {
  it('定番の例（ATTACKATDAWN / LEMON）', () => {
    const r = vigenere('ATTACKATDAWN', 'LEMON');
    expect(r).toEqual({ success: true, output: 'LXFOPVEFRNHR' });
    expect(vigenere('LXFOPVEFRNHR', 'LEMON', 'decrypt')).toEqual({
      success: true,
      output: 'ATTACKATDAWN',
    });
  });
  it('英字以外では鍵が進まず、大文字小文字を保持する', () => {
    const r = vigenere('Attack at Dawn!', 'lemon');
    expect(r).toEqual({ success: true, output: 'Lxfopv ef Rnhr!' });
  });
  it('鍵の英字以外は無視される', () => {
    expect(normalizeVigenereKey('le-m0 on')).toBe('LEMON');
  });
  it('鍵に英字が無いとエラー', () => {
    expect(vigenere('abc', '')).toEqual({ success: false, error: 'empty-key' });
    expect(vigenere('abc', '123 あ')).toEqual({
      success: false,
      error: 'empty-key',
    });
  });
  it('鍵がAだけなら変化しない', () => {
    expect(vigenere('Hello', 'a')).toEqual({ success: true, output: 'Hello' });
  });
});

describe('transform', () => {
  it('方式ごとに振り分ける', () => {
    expect(transform('caesar', 'encrypt', 'abc', { shift: 1 })).toEqual({
      success: true,
      output: 'bcd',
    });
    expect(transform('caesar', 'decrypt', 'bcd', { shift: 1 })).toEqual({
      success: true,
      output: 'abc',
    });
    expect(transform('rot13', 'decrypt', 'Uryyb')).toEqual({
      success: true,
      output: 'Hello',
    });
    expect(transform('atbash', 'encrypt', 'abc')).toEqual({
      success: true,
      output: 'zyx',
    });
    expect(transform('rot47', 'encrypt', 'Hello')).toEqual({
      success: true,
      output: 'w6==@',
    });
    expect(transform('vigenere', 'encrypt', 'abc')).toEqual({
      success: false,
      error: 'empty-key',
    });
  });
});

describe('caesarBruteForce', () => {
  it('25行返し、正しいシフトの行に平文が含まれる', () => {
    const { rows, truncated } = caesarBruteForce('Khoor, Zruog!');
    expect(rows).toHaveLength(25);
    expect(rows[0].shift).toBe(1);
    expect(rows[24].shift).toBe(25);
    expect(rows.find((r) => r.shift === 3)?.text).toBe('Hello, World!');
    expect(truncated).toBe(false);
  });
  it('長い入力は上限で切り詰める', () => {
    const { rows, truncated } = caesarBruteForce('a'.repeat(30), 10);
    expect(truncated).toBe(true);
    expect(rows[0].text).toHaveLength(10);
  });
});

describe('鍵の正規化（英字以外を先に除去してから大文字化）', () => {
  it('ß・ﬁ などは大文字化で英字に化けず、鍵として無効', () => {
    // 先に大文字化すると 'ß'→'SS'、'ﬁ'→'FI' になってしまうため除去を先に行う
    expect(normalizeVigenereKey('ßﬁ')).toBe('');
    expect(vigenere('abc', 'ß')).toEqual({
      success: false,
      error: 'empty-key',
    });
  });
  it('ı（トルコ語の小文字i）や全角英字は鍵に含まれない', () => {
    expect(normalizeVigenereKey('ıＬemon')).toBe('EMON');
  });
});

describe('大きな入力・サロゲートペア', () => {
  it('ヴィジュネル暗号はサロゲートペアを壊さず、鍵は英字だけで進む', () => {
    expect(vigenere('😀a😀b', 'b')).toEqual({
      success: true,
      output: '😀b😀c',
    });
  });
  it('長い入力（10万文字）でも復号で元に戻る', () => {
    const text = 'Attack at dawn! '.repeat(6250);
    const enc = vigenere(text, 'LEMON');
    expect(enc.success).toBe(true);
    if (enc.success) {
      expect(vigenere(enc.output, 'LEMON', 'decrypt')).toEqual({
        success: true,
        output: text,
      });
    }
  });
  it('総当たりは上限ちょうどでは切り詰めず、1文字超えると切り詰める', () => {
    expect(caesarBruteForce('a'.repeat(1000)).truncated).toBe(false);
    expect(caesarBruteForce('a'.repeat(1001)).truncated).toBe(true);
  });
  it('総当たりの切り詰めはサロゲートペアを数える単位で行う', () => {
    const { rows, truncated } = caesarBruteForce('😀😀😀', 2);
    expect(truncated).toBe(true);
    expect(rows[0].text).toBe('😀😀');
  });
});
