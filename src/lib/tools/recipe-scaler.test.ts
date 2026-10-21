import { describe, expect, it } from 'vitest';
import {
  formatQuantity,
  parseQuantity,
  scaleFactor,
  scaleRecipe,
  type ScaleOptions,
} from './recipe-scaler';

function run(
  text: string,
  from: number,
  to: number,
  extra: Partial<ScaleOptions> = {},
): string {
  const r = scaleRecipe(text, {
    fromServings: from,
    toServings: to,
    ...extra,
  });
  if (!r) throw new Error('null result');
  return r.text;
}

describe('parseQuantity', () => {
  it('整数・小数・分数・帯分数・特殊分数を解釈する', () => {
    expect(parseQuantity('3')).toBe(3);
    expect(parseQuantity('1.5')).toBe(1.5);
    expect(parseQuantity('1,000')).toBe(1000);
    expect(parseQuantity('1/2')).toBe(0.5);
    expect(parseQuantity('1と1/2')).toBe(1.5);
    expect(parseQuantity('1 1/2')).toBe(1.5);
    expect(parseQuantity('½')).toBe(0.5);
    expect(parseQuantity('1½')).toBe(1.5);
    expect(parseQuantity('1と½')).toBe(1.5);
  });

  it('分母0や数値でない文字列は null', () => {
    expect(parseQuantity('1/0')).toBeNull();
    expect(parseQuantity('abc')).toBeNull();
  });
});

describe('formatQuantity', () => {
  it('分数モード', () => {
    expect(formatQuantity(0.5, 'fraction')).toBe('1/2');
    expect(formatQuantity(1.5, 'fraction')).toBe('1 1/2');
    expect(formatQuantity(1.5, 'fraction', 'と')).toBe('1と1/2');
    expect(formatQuantity(1 / 3, 'fraction')).toBe('1/3');
    expect(formatQuantity(2.25, 'fraction')).toBe('2 1/4');
    expect(formatQuantity(3, 'fraction')).toBe('3');
    expect(formatQuantity(0.97, 'fraction')).toBe('1');
    expect(formatQuantity(0.45, 'fraction')).toBe('1/2');
    expect(formatQuantity(12.4, 'fraction')).toBe('12');
    expect(formatQuantity(0.01, 'fraction')).toBe('0.01');
  });

  it('小数モード', () => {
    expect(formatQuantity(1.25, 'decimal')).toBe('1.3');
    expect(formatQuantity(1.5, 'decimal')).toBe('1.5');
    expect(formatQuantity(0.333, 'decimal')).toBe('0.33');
    expect(formatQuantity(250.6, 'decimal')).toBe('251');
    expect(formatQuantity(2, 'decimal')).toBe('2');
  });

  it('整数モード', () => {
    expect(formatQuantity(2.6, 'integer')).toBe('3');
    expect(formatQuantity(0.3, 'integer')).toBe('0.3');
  });
});

describe('scaleFactor', () => {
  it('不正な人数は null', () => {
    expect(scaleFactor(0, 2)).toBeNull();
    expect(scaleFactor(2, -1)).toBeNull();
    expect(scaleFactor(NaN, 2)).toBeNull();
    expect(scaleFactor(2, 6)).toBe(3);
  });
});

describe('scaleRecipe', () => {
  it('単位を保持して比例換算する', () => {
    expect(run('鶏もも肉 300g\n玉ねぎ 1個\n水 200ml', 2, 4)).toBe(
      '鶏もも肉 600g\n玉ねぎ 2個\n水 400ml',
    );
  });

  it('縮小時に分数へ丸める', () => {
    expect(run('玉ねぎ 1個', 2, 1)).toBe('玉ねぎ 1/2個');
    expect(run('大さじ1', 4, 1, { rounding: 'fraction' })).toBe('大さじ1/4');
  });

  it('分数・帯分数・特殊分数を解釈する', () => {
    expect(run('小麦粉 1/2カップ', 2, 4)).toBe('小麦粉 1カップ');
    expect(run('砂糖 1と1/2カップ', 2, 4, { mixedJoin: 'と' })).toBe(
      '砂糖 3カップ',
    );
    expect(run('牛乳 ½ cup', 1, 3)).toBe('牛乳 1 1/2 cup');
    expect(run('milk 1 1/2 cups', 2, 1)).toBe('milk 3/4 cups');
  });

  it('全角数字は半角に直して計算する', () => {
    expect(run('砂糖　大さじ１', 1, 2)).toBe('砂糖　大さじ2');
    expect(run('卵 １／２個', 1, 4)).toBe('卵 2個');
    expect(run('水 ２．５カップ', 1, 2)).toBe('水 5カップ');
  });

  it('範囲を両端とも換算する', () => {
    expect(run('卵 2〜3個', 2, 4)).toBe('卵 4〜6個');
    expect(run('salt 1-2 tsp', 1, 2)).toBe('salt 2-4 tsp');
  });

  it('数値のない行・空行はそのまま', () => {
    expect(run('塩 少々\n\nこしょう 適量', 2, 6)).toBe(
      '塩 少々\n\nこしょう 適量',
    );
  });

  it('時間・温度・長さは換算しない', () => {
    expect(run('200℃で10分焼く', 2, 4)).toBe('200℃で10分焼く');
    expect(run('Bake at 180°C for 20 minutes', 2, 4)).toBe(
      'Bake at 180°C for 20 minutes',
    );
    expect(run('にんじん 2cm角 1本', 2, 4)).toBe('にんじん 2cm角 2本');
  });

  it('英数字に付いた数字や行頭の手順番号は換算しない', () => {
    expect(run('A4の紙 1枚', 1, 2)).toBe('A4の紙 2枚');
    expect(run('1. 玉ねぎを切る', 1, 2)).toBe('1. 玉ねぎを切る');
    expect(run('2. 水 100ml', 1, 2)).toBe('2. 水 200ml');
  });

  it('人数表記は目標人数に置き換える', () => {
    expect(run('材料（2人分）\n卵 2個', 2, 4)).toBe('材料（4人分）\n卵 4個');
    expect(run('Serves 2\negg 2', 2, 6)).toBe('Serves 6\negg 6');
    expect(run('2 servings', 2, 5)).toBe('5 servings');
  });

  it('3桁区切りの数値を扱う', () => {
    expect(run('小麦粉 1,000g', 2, 4)).toBe('小麦粉 2000g');
  });

  it('丸めモードを切り替えられる', () => {
    expect(run('卵 1個', 3, 4, { rounding: 'decimal' })).toBe('卵 1.3個');
    expect(run('卵 1個', 3, 4, { rounding: 'integer' })).toBe('卵 1個');
    expect(run('卵 1個', 3, 4, { rounding: 'fraction' })).toBe('卵 1 1/3個');
  });

  it('倍率1のときは文面を変えない', () => {
    expect(run('卵 １個\n砂糖 ½', 2, 2)).toBe('卵 １個\n砂糖 ½');
  });

  it('CRLFの改行を扱い、換算数を数える', () => {
    const r = scaleRecipe('卵 1個\r\n塩 少々\r\n水 2カップ', {
      fromServings: 1,
      toServings: 2,
    });
    expect(r?.text).toBe('卵 2個\n塩 少々\n水 4カップ');
    expect(r?.scaledCount).toBe(2);
    expect(r?.lines[1].scaledCount).toBe(0);
    expect(r?.factor).toBe(2);
  });

  it('人数が不正なら null', () => {
    expect(
      scaleRecipe('卵 1個', { fromServings: 0, toServings: 2 }),
    ).toBeNull();
    expect(
      scaleRecipe('卵 1個', { fromServings: 2, toServings: NaN }),
    ).toBeNull();
  });

  it('分母0の分数は触らない', () => {
    expect(run('謎 1/0個', 1, 2)).toBe('謎 1/0個');
  });
});

describe('エッジケース（QA追加）', () => {
  it('分数の範囲を両端とも換算する', () => {
    expect(run('醤油 1/2〜1カップ', 2, 4)).toBe('醤油 1〜2カップ');
  });
  it('縮小で分数が分数のまま換算される', () => {
    expect(run('牛乳 1/3カップ', 1, 2)).toBe('牛乳 2/3カップ');
  });
  it('9.9 は 9 7/8 と表示される（分数の近似）', () => {
    expect(formatQuantity(9.9, 'fraction')).toBe('9 7/8');
    expect(formatQuantity(1.3, 'fraction')).toBe('1 1/3');
  });
  it('空文字・空白のみは空のまま', () => {
    expect(run('', 1, 2)).toBe('');
    expect(run('   ', 1, 2)).toBe('   ');
  });
  it('長い入力でも換算でき、行数を保つ', () => {
    const text = '卵 1個\n'.repeat(20000) + '塩 少々';
    const r = scaleRecipe(text, { fromServings: 1, toServings: 3 });
    expect(r?.lines).toHaveLength(20001);
    expect(r?.scaledCount).toBe(20000);
    expect(r?.text.endsWith('塩 少々')).toBe(true);
  });
});

describe('レビュー指摘の回帰', () => {
  it('全角・空白なしの手順番号は換算しない', () => {
    expect(run('1.玉ねぎを切る', 2, 4)).toBe('1.玉ねぎを切る');
    expect(run('１．玉ねぎを切る', 2, 4)).toBe('１．玉ねぎを切る');
  });
  it('1.5 のような小数は手順番号扱いしない', () => {
    expect(run('1.5カップ', 2, 4)).not.toBe('1.5カップ');
  });
  it('Makes の数量は人数置換せず倍率換算する', () => {
    expect(run('Makes 12 cookies', 2, 4)).toBe('Makes 24 cookies');
  });
});
