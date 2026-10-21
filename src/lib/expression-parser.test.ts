import { describe, expect, it } from 'vitest';
import { compileExpression, factorial } from './expression-parser';

function ev(src: string, opts = {}, scope = {}): number {
  const r = compileExpression(src, opts);
  if (!r.ok) throw new Error(r.error);
  return r.evaluate(scope);
}

describe('expression-parser', () => {
  it('四則演算と優先順位', () => {
    expect(ev('1+2*3')).toBe(7);
    expect(ev('(1+2)*3')).toBe(9);
    expect(ev('10/4')).toBe(2.5);
    expect(ev('10-3-2')).toBe(5);
  });

  it('べき乗は右結合で、単項マイナスより強い', () => {
    expect(ev('2^3^2')).toBe(512);
    expect(ev('-2^2')).toBe(-4);
    expect(ev('2^-1')).toBe(0.5);
  });

  it('暗黙の乗算', () => {
    expect(ev('2pi')).toBeCloseTo(Math.PI * 2);
    expect(ev('2(3+4)')).toBe(14);
    expect(ev('3x^2', { variables: ['x'] }, { x: 2 })).toBe(12);
    expect(ev('(1+1)(2+2)')).toBe(8);
  });

  it('後置 ! と %', () => {
    expect(ev('5!')).toBe(120);
    expect(ev('50%')).toBe(0.5);
    expect(ev('200*10%')).toBe(20);
    expect(factorial(171)).toBeNaN();
    expect(factorial(1.5)).toBeNaN();
  });

  it('全角・記号の別表記', () => {
    expect(ev('１＋２×３')).toBe(7);
    expect(ev('6÷3−1')).toBe(1);
    expect(ev('√(16)')).toBe(4);
  });

  it('プロトタイプ名や全角英字・括弧なし√', () => {
    expect(compileExpression('constructor(1)')).toMatchObject({ ok: false });
    expect(compileExpression('toString')).toMatchObject({ ok: false });
    expect(ev('√2')).toBeCloseTo(Math.SQRT2);
    expect(ev('ｓｉｎ(０)')).toBe(0);
    expect(ev('ｘ+1', { variables: ['x'] }, { x: 1 })).toBe(2);
  });

  it('関数と定数', () => {
    expect(ev('sqrt(16)')).toBe(4);
    expect(ev('log(1000)')).toBeCloseTo(3);
    expect(ev('log(8,2)')).toBeCloseTo(3);
    expect(ev('ln(e)')).toBeCloseTo(1);
    expect(ev('max(1,5,3)')).toBe(5);
    expect(ev('mod(-1,3)')).toBe(2);
  });

  it('度／ラジアン', () => {
    expect(ev('sin(90)', { angle: 'deg' })).toBeCloseTo(1);
    expect(ev('asin(1)', { angle: 'deg' })).toBeCloseTo(90);
    expect(ev('cos(pi)')).toBeCloseTo(-1);
  });

  it('変数は許可したものだけ使える', () => {
    expect(ev('x*2', { variables: ['x'] }, { x: 4 })).toBe(8);
    const r = compileExpression('x+1');
    expect(r).toMatchObject({ ok: false, error: 'unknownName' });
  });

  it('エラーコード', () => {
    expect(compileExpression('')).toMatchObject({ ok: false, error: 'empty' });
    expect(compileExpression('(1+2')).toMatchObject({
      ok: false,
      error: 'paren',
    });
    expect(compileExpression('1+2)')).toMatchObject({
      ok: false,
      error: 'paren',
    });
    // 開き括弧の直後で入力が終わる場合も括弧の閉じ忘れとして扱う
    expect(compileExpression('sin(')).toMatchObject({
      ok: false,
      error: 'paren',
      position: 3,
    });
    expect(compileExpression('(')).toMatchObject({
      ok: false,
      error: 'paren',
      position: 0,
    });
    expect(compileExpression('1+')).toMatchObject({
      ok: false,
      error: 'syntax',
    });
    expect(compileExpression('1 $ 2')).toMatchObject({
      ok: false,
      error: 'syntax',
    });
    expect(compileExpression('sin(1,2)')).toMatchObject({
      ok: false,
      error: 'arity',
    });
    expect(compileExpression('foo(1)')).toMatchObject({
      ok: false,
      error: 'unknownName',
    });
    expect(compileExpression('sin')).toMatchObject({ ok: false });
    expect(compileExpression('1'.repeat(501))).toMatchObject({
      ok: false,
      error: 'tooLong',
    });
  });

  it('深いネストでも例外にならない', () => {
    const r = compileExpression('('.repeat(400) + '1' + ')'.repeat(400));
    expect(r.ok === true || r.ok === false).toBe(true);
  });

  it('0除算は Infinity、評価できない値は NaN', () => {
    expect(ev('1/0')).toBe(Infinity);
    expect(ev('sqrt(-1)')).toBeNaN();
  });
});
