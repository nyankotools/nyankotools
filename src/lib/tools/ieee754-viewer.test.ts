import { describe, expect, it } from 'vitest';
import { analyze, decodeBits } from './ieee754-viewer';

describe('analyze: float64', () => {
  it('0.1 を分解する', () => {
    const r = analyze('0.1', 64)!;
    expect(r.hex).toBe('0x3FB999999999999A');
    expect(r.binary).toBe(
      '0 01111111011 1001100110011001100110011001100110011001100110011010',
    );
    expect(r.category).toBe('normal');
    expect(r.exponent).toBe(-4);
    expect(r.exact).toBe(
      '0.1000000000000000055511151231257827021181583404541015625',
    );
    expect(r.shortest).toBe('0.1');
  });

  it('0.1+0.2 は 0.30000000000000004', () => {
    const r = analyze('0.1+0.2', 64)!;
    expect(r.kind).toBe('expression');
    expect(r.shortest).toBe('0.30000000000000004');
    expect(r.hex).toBe('0x3FD3333333333334');
  });

  it('1 の各フィールド', () => {
    const r = analyze('1', 64)!;
    expect(r.sign).toBe(0);
    expect(r.exponentField).toBe(1023);
    expect(r.exponent).toBe(0);
    expect(r.exact).toBe('1');
    expect(r.leadingBit).toBe(1);
  });

  it('-0 と +0', () => {
    const neg = analyze('-0', 64)!;
    expect(neg.hex).toBe('0x8000000000000000');
    expect(neg.category).toBe('zero');
    expect(neg.exact).toBe('-0');
    expect(neg.shortest).toBe('-0');
    expect(analyze('0', 64)!.hex).toBe('0x0000000000000000');
  });

  it('Infinity / NaN', () => {
    expect(analyze('Infinity', 64)!.category).toBe('infinity');
    const ninf = analyze('-inf', 64)!;
    expect(ninf.hex).toBe('0xFFF0000000000000');
    expect(ninf.exact).toBeNull();
    const nan = analyze('NaN', 64)!;
    expect(nan.category).toBe('nan-quiet');
    expect(nan.hex).toBe('0x7FF8000000000000');
    expect(analyze('0x7FF0000000000001', 64)!.category).toBe('nan-signaling');
  });

  it('最小の非正規化数と最大値', () => {
    const sub = analyze('5e-324', 64)!;
    expect(sub.category).toBe('subnormal');
    expect(sub.hex).toBe('0x0000000000000001');
    expect(sub.leadingBit).toBe(0);
    expect(sub.exponent).toBe(-1022);
    expect(sub.exact!.startsWith('0.000')).toBe(true);
    const max = analyze('1.7976931348623157e308', 64)!;
    expect(max.hex).toBe('0x7FEFFFFFFFFFFFFF');
    expect(max.exact!.length).toBe(309);
  });

  it('オーバーフローは Infinity になる', () => {
    expect(analyze('1e999', 64)!.category).toBe('infinity');
  });
});

describe('analyze: float32', () => {
  it('0.1 は 0x3DCCCCCD', () => {
    const r = analyze('0.1', 32)!;
    expect(r.hex).toBe('0x3DCCCCCD');
    expect(r.binary).toBe('0 01111011 10011001100110011001101');
    expect(r.exact).toBe('0.100000001490116119384765625');
    expect(r.shortest).toBe('0.1');
  });

  it('0.1+0.2 は float32 では 0.3 に丸まる', () => {
    const r = analyze('0.1+0.2', 32)!;
    expect(r.shortest).toBe('0.3');
  });

  it('最小の非正規化数', () => {
    const r = analyze('0x00000001', 32)!;
    expect(r.category).toBe('subnormal');
    expect(r.shortest).toBe('1e-45');
  });

  it('範囲外は Infinity', () => {
    expect(analyze('1e39', 32)!.category).toBe('infinity');
  });

  it('16進・2進から逆変換できる', () => {
    expect(analyze('0x40490FDB', 32)!.shortest).toBe('3.1415927');
    expect(analyze('01000000010010010000111111011011', 32)!.hex).toBe(
      '0x40490FDB',
    );
    expect(analyze('0 10000000 10010010000111111011011', 32)!.kind).toBe(
      'binary',
    );
    expect(analyze('0b1', 32)!.hex).toBe('0x00000001');
  });
});

describe('analyze: 不正入力', () => {
  it('空・不正な文字列は null', () => {
    expect(analyze('', 64)).toBeNull();
    expect(analyze('abc', 64)).toBeNull();
    expect(analyze('0xZZ', 32)).toBeNull();
    expect(analyze('0x123456789', 32)).toBeNull();
    expect(analyze('0b12', 32)).toBeNull();
    expect(analyze('1+', 64)).toBeNull();
  });

  it('演算子付き指数表記は数値として扱う', () => {
    expect(analyze('1e+2', 64)!.kind).toBe('decimal');
    expect(analyze('2*3', 64)!.shortest).toBe('6');
    expect(analyze('1/3', 64)!.kind).toBe('expression');
  });
});

describe('decodeBits', () => {
  it('64bit全ビット1は NaN', () => {
    const r = decodeBits(0xffffffffffffffffn, 64, 'hex');
    expect(r.category).toBe('nan-quiet');
    expect(r.sign).toBe(1);
  });
});

describe('analyze: 数値表記の境界（NUM 正規表現）', () => {
  it('小数点の前後が省略された表記を受け付ける', () => {
    expect(analyze('.5', 64)!.shortest).toBe('0.5');
    expect(analyze('5.', 64)!.shortest).toBe('5');
    expect(analyze('1.e3', 64)!.shortest).toBe('1000');
    expect(analyze('-.5', 64)!.shortest).toBe('-0.5');
  });

  it('符号・指数を含む式を評価する', () => {
    expect(analyze('-1*-2', 64)!.shortest).toBe('2');
    expect(analyze('1e3+1', 64)!.shortest).toBe('1001');
    expect(analyze('.5/.25', 64)!.shortest).toBe('2');
  });

  it('長く壊れた入力でも null を返す（ReDoS 回帰防止）', () => {
    expect(analyze('1.'.repeat(50000) + 'x', 64)).toBeNull();
    expect(analyze('1'.repeat(5000) + '+', 64)).toBeNull();
    expect(analyze('1e' + '1'.repeat(100000) + '+', 64)).toBeNull();
    expect(analyze(' '.repeat(100000) + 'x', 64)).toBeNull();
  });
});
