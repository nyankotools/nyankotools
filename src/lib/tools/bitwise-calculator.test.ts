import { describe, expect, it } from 'vitest';
import {
  compute,
  describeValue,
  groupBits,
  isShift,
  isUnary,
  parseOperand,
  popCount,
  toSigned,
} from './bitwise-calculator';

function val(text: string, width: 8 | 16 | 32 | 64 = 32): bigint {
  const r = parseOperand(text, width);
  if (!r.ok) throw new Error(r.reason);
  return r.value;
}

describe('parseOperand', () => {
  it('10進・16進・2進・8進を読み取る', () => {
    expect(val('255')).toBe(255n);
    expect(val('0xFF')).toBe(255n);
    expect(val('0b1010_1010')).toBe(170n);
    expect(val('0o17')).toBe(15n);
  });

  it('負数は2の補数に変換する', () => {
    expect(val('-1', 8)).toBe(255n);
    expect(val('-128', 8)).toBe(128n);
    expect(val('-1', 64)).toBe(0xffffffffffffffffn);
  });

  it('範囲外・不正・空を判定する', () => {
    expect(parseOperand('256', 8)).toEqual({
      ok: false,
      reason: 'out-of-range',
    });
    expect(parseOperand('-129', 8)).toEqual({
      ok: false,
      reason: 'out-of-range',
    });
    expect(parseOperand('0x', 8)).toEqual({ ok: false, reason: 'invalid' });
    expect(parseOperand('0b102', 8)).toEqual({ ok: false, reason: 'invalid' });
    expect(parseOperand('abc', 8)).toEqual({ ok: false, reason: 'invalid' });
    expect(parseOperand('  ', 8)).toEqual({ ok: false, reason: 'empty' });
  });

  it('64bitの最大値を精度を失わず扱う', () => {
    expect(val('18446744073709551615', 64)).toBe(0xffffffffffffffffn);
    expect(parseOperand('18446744073709551616', 64).ok).toBe(false);
  });
});

describe('parseOperand: 入力の桁数と符号', () => {
  it('1000桁ちょうどは読み取り、1001桁以上は out-of-range', () => {
    expect(parseOperand('0'.repeat(999) + '5', 8)).toEqual({
      ok: true,
      value: 5n,
    });
    expect(parseOperand('0'.repeat(1000) + '5', 8)).toEqual({
      ok: false,
      reason: 'out-of-range',
    });
    expect(parseOperand('0x' + '0'.repeat(1000) + '1', 64)).toEqual({
      ok: false,
      reason: 'out-of-range',
    });
  });

  it('符号だけや + 付きの入力を扱う', () => {
    expect(parseOperand('-', 8)).toEqual({ ok: false, reason: 'invalid' });
    expect(parseOperand('+5', 8)).toEqual({ ok: true, value: 5n });
    expect(parseOperand('-0x10', 8)).toEqual({ ok: true, value: 240n });
  });
});

describe('compute', () => {
  it('AND / OR / XOR', () => {
    expect(compute('and', 0b1100n, 0b1010n, 8)).toBe(0b1000n);
    expect(compute('or', 0b1100n, 0b1010n, 8)).toBe(0b1110n);
    expect(compute('xor', 0b1100n, 0b1010n, 8)).toBe(0b0110n);
  });

  it('NAND / NOR / XNOR / NOT は幅で切り詰める', () => {
    expect(compute('nand', 0b1100n, 0b1010n, 8)).toBe(0b11110111n);
    expect(compute('nor', 0b1100n, 0b1010n, 8)).toBe(0b11110001n);
    expect(compute('xnor', 0b1100n, 0b1010n, 8)).toBe(0b11111001n);
    expect(compute('not', 0n, 0n, 8)).toBe(255n);
    expect(compute('not', 0n, 0n, 64)).toBe(0xffffffffffffffffn);
  });

  it('論理シフト', () => {
    expect(compute('shl', 1n, 3n, 8)).toBe(8n);
    expect(compute('shl', 0x81n, 1n, 8)).toBe(0x02n);
    expect(compute('shr', 0x80n, 7n, 8)).toBe(1n);
    expect(compute('shl', 1n, 8n, 8)).toBe(0n);
    expect(compute('shr', 255n, 100n, 8)).toBe(0n);
  });

  it('算術右シフトは符号を保つ', () => {
    expect(compute('sar', 0x80n, 1n, 8)).toBe(0xc0n);
    expect(compute('sar', 0x80n, 20n, 8)).toBe(0xffn);
    expect(compute('sar', 0x40n, 1n, 8)).toBe(0x20n);
    expect(compute('sar', 0x40n, 20n, 8)).toBe(0n);
  });

  it('ローテート', () => {
    expect(compute('rol', 0x81n, 1n, 8)).toBe(0x03n);
    expect(compute('ror', 0x81n, 1n, 8)).toBe(0xc0n);
    expect(compute('rol', 0x81n, 0n, 8)).toBe(0x81n);
    expect(compute('rol', 0x81n, 9n, 8)).toBe(0x03n);
  });
});

describe('補助関数', () => {
  it('toSigned', () => {
    expect(toSigned(255n, 8)).toBe(-1n);
    expect(toSigned(127n, 8)).toBe(127n);
    expect(toSigned(0x8000000000000000n, 64)).toBe(-(1n << 63n));
  });

  it('describeValue', () => {
    const v = describeValue(0xf0n, 8);
    expect(v.unsigned).toBe('240');
    expect(v.signed).toBe('-16');
    expect(v.hex).toBe('0xF0');
    expect(v.bits).toBe('11110000');
    expect(describeValue(1n, 16).hex).toBe('0x0001');
  });

  it('groupBits / popCount', () => {
    expect(groupBits('11110000')).toBe('1111 0000');
    expect(popCount(0xffn)).toBe(8);
    expect(popCount(0n)).toBe(0);
  });

  it('演算の分類', () => {
    expect(isUnary('not')).toBe(true);
    expect(isUnary('and')).toBe(false);
    expect(isShift('rol')).toBe(true);
    expect(isShift('xor')).toBe(false);
  });
});
