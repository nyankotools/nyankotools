import { describe, expect, it } from 'vitest';
import {
  HISTORY_LIMIT,
  PAD_KEYS,
  backspaceAt,
  calculate,
  formatResult,
  insertAt,
  pushHistory,
  roundSignificant,
} from './scientific-calculator';

function text(expr: string, angle: 'rad' | 'deg' = 'rad', ans = 0) {
  const r = calculate(expr, angle, ans);
  return r.ok ? r.text : `error:${r.error}`;
}

describe('roundSignificant / formatResult', () => {
  it('浮動小数点誤差を丸める', () => {
    expect(roundSignificant(0.1 + 0.2)).toBe(0.3);
    expect(formatResult(0.1 + 0.2)).toBe('0.3');
    expect(formatResult(1 / 3)).toBe('0.333333333333');
  });

  it('-0 は 0、非有限値はそのまま', () => {
    expect(formatResult(-0)).toBe('0');
    expect(roundSignificant(Infinity)).toBe(Infinity);
    expect(roundSignificant(NaN)).toBeNaN();
  });

  it('大きい値・小さい値は指数表記になる', () => {
    expect(formatResult(1e21)).toBe('1e+21');
    expect(formatResult(1.5e-9)).toBe('1.5e-9');
  });
});

describe('calculate', () => {
  it('四則演算と優先順位', () => {
    expect(text('1+2*3')).toBe('7');
    expect(text('(1+2)*3')).toBe('9');
    expect(text('0.1+0.2')).toBe('0.3');
    expect(text('2^3^2')).toBe('512');
    expect(text('-2^2')).toBe('-4');
  });

  it('階乗とパーセント', () => {
    expect(text('5!')).toBe('120');
    expect(text('50%')).toBe('0.5');
    expect(text('200*10%')).toBe('20');
  });

  it('度とラジアンの切替', () => {
    expect(text('sin(30)', 'deg')).toBe('0.5');
    expect(text('cos(pi)', 'rad')).toBe('-1');
    expect(text('atan(1)', 'deg')).toBe('45');
  });

  it('sin(π) の丸め誤差を 0 にする', () => {
    expect(text('sin(π)', 'rad')).toBe('0');
    expect(text('sin(180)', 'deg')).toBe('0');
  });

  it('対数・平方根・定数', () => {
    expect(text('log(1000)')).toBe('3');
    expect(text('ln(e)')).toBe('1');
    expect(text('sqrt(16)')).toBe('4');
    expect(text('√16')).toBe('4');
    expect(text('2π')).toBe('6.28318530718');
  });

  it('ans を直前の結果として使う', () => {
    expect(text('ans*2', 'rad', 21)).toBe('42');
    expect(text('ans+1')).toBe('1');
  });

  it('全角演算子も受け付ける', () => {
    expect(text('６×７')).toBe('42');
    expect(text('8÷2')).toBe('4');
  });

  it('0除算は overflow', () => {
    expect(text('1/0')).toBe('error:overflow');
    expect(text('-1/0')).toBe('error:overflow');
    expect(text('1e300*1e300')).toBe('error:overflow');
  });

  it('NaN になる計算は undefined', () => {
    expect(text('0/0')).toBe('error:undefined');
    expect(text('sqrt(-1)')).toBe('error:undefined');
    expect(text('ln(-1)')).toBe('error:undefined');
    expect(text('171!')).toBe('error:undefined');
    expect(text('2.5!')).toBe('error:undefined');
  });

  it('パーサーのエラーコードを返す', () => {
    expect(text('')).toBe('error:empty');
    expect(text('   ')).toBe('error:empty');
    expect(text('1+')).toBe('error:syntax');
    expect(text('(1+2')).toBe('error:paren');
    expect(text('foo+1')).toBe('error:unknownName');
    expect(text('sin(1,2)')).toBe('error:arity');
    expect(text('1+'.repeat(300))).toBe('error:tooLong');
  });

  it('x は未定義の名前', () => {
    expect(text('x+1')).toBe('error:unknownName');
  });
});

describe('insertAt / backspaceAt', () => {
  it('カーソル位置に挿入する', () => {
    expect(insertAt('1+2', 1, 1, 'sin(')).toEqual({
      text: '1sin(+2',
      cursor: 5,
    });
  });

  it('選択範囲を置き換える', () => {
    expect(insertAt('abcdef', 1, 4, 'X')).toEqual({ text: 'aXef', cursor: 2 });
  });

  it('範囲外の位置は丸める', () => {
    expect(insertAt('12', 99, 99, '3')).toEqual({ text: '123', cursor: 3 });
    expect(insertAt('12', -5, -5, '0')).toEqual({ text: '012', cursor: 1 });
  });

  it('バックスペース', () => {
    expect(backspaceAt('123', 2, 2)).toEqual({ text: '13', cursor: 1 });
    expect(backspaceAt('123', 0, 0)).toEqual({ text: '123', cursor: 0 });
    expect(backspaceAt('12345', 1, 3)).toEqual({ text: '145', cursor: 1 });
  });
});

describe('pushHistory', () => {
  it('新しいものを先頭に追加する', () => {
    const h = pushHistory([{ expression: '1+1', result: '2' }], {
      expression: '2+2',
      result: '4',
    });
    expect(h.map((e) => e.expression)).toEqual(['2+2', '1+1']);
  });

  it('直前と同一なら重複させない', () => {
    const e = { expression: '1+1', result: '2' };
    expect(pushHistory([e], { ...e })).toHaveLength(1);
  });

  it('最大件数を超えたら古いものを捨てる', () => {
    let h: ReturnType<typeof pushHistory> = [];
    for (let i = 0; i < HISTORY_LIMIT + 5; i++) {
      h = pushHistory(h, { expression: `${i}+0`, result: String(i) });
    }
    expect(h).toHaveLength(HISTORY_LIMIT);
    expect(h[0].result).toBe(String(HISTORY_LIMIT + 4));
  });

  it('元の配列を変更しない', () => {
    const orig = [{ expression: 'a', result: '1' }];
    pushHistory(orig, { expression: 'b', result: '2' });
    expect(orig).toHaveLength(1);
  });
});

describe('PAD_KEYS', () => {
  it('id が重複しない', () => {
    const ids = PAD_KEYS.map((k) => k.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('挿入する文字列は式として解釈できる断片である', () => {
    for (const k of PAD_KEYS.filter((k) => k.action === 'insert')) {
      expect(k.insert).not.toBe('');
    }
  });

  it('1行5列で埋まっている', () => {
    const cells = PAD_KEYS.reduce((n, k) => n + (k.wide ? 2 : 1), 0);
    expect(cells % 5).toBe(0);
  });
});

describe('精度とエッジケース', () => {
  it('大きな整数を丸めない', () => {
    expect(calculate('20!', 'rad')).toMatchObject({
      ok: true,
      text: '2432902008176640000',
    });
    expect(calculate('12345678901234+0', 'rad')).toMatchObject({
      ok: true,
      value: 12345678901234,
    });
  });
  it('極小の値を三角関数式でも潰さない', () => {
    expect(calculate('sin(30)*1e-20', 'rad')).toMatchObject({ ok: true });
    const r = calculate('sin(30)*1e-20', 'rad');
    expect(r.ok && r.value !== 0).toBe(true);
  });
  it('プロトタイプ名で例外を投げない', () => {
    expect(calculate('constructor(1)', 'rad').ok).toBe(false);
    expect(calculate('constructor', 'rad').ok).toBe(false);
  });
});
