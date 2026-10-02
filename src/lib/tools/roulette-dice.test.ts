import { describe, it, expect } from 'vitest';
import {
  drawLots,
  drawWeightedLots,
  formatItemLine,
  indexAtPointer,
  parseItems,
  parseWeightedItems,
  pickIndex,
  pickWeightedIndex,
  probabilities,
  rollDice,
  secureRandomInt,
  targetRotation,
  validateDice,
  weightedIndexAtPointer,
  weightedTargetRotation,
} from './roulette-dice';

/** 決まった値を順に返す乱数（値は max 未満に収める） */
function sequence(...values: number[]) {
  let i = 0;
  return (max: number) => values[i++ % values.length] % max;
}

describe('secureRandomInt', () => {
  it('範囲内の整数を返し、全ての値が出る', () => {
    const seen = new Set<number>();
    for (let i = 0; i < 500; i++) {
      const v = secureRandomInt(6);
      expect(Number.isInteger(v)).toBe(true);
      expect(v).toBeGreaterThanOrEqual(0);
      expect(v).toBeLessThan(6);
      seen.add(v);
    }
    expect(seen.size).toBe(6);
  });

  it('max=1 は常に0、不正な max は例外', () => {
    expect(secureRandomInt(1)).toBe(0);
    expect(() => secureRandomInt(0)).toThrow(RangeError);
    expect(() => secureRandomInt(1.5)).toThrow(RangeError);
  });
});

describe('parseItems', () => {
  it('改行で分け、前後の空白と空行を除く', () => {
    expect(parseItems(' A \r\n\n  B\n\t\nC ')).toEqual(['A', 'B', 'C']);
    expect(parseItems('')).toEqual([]);
  });
});

describe('pickIndex', () => {
  it('項目数の範囲で選び、空なら -1', () => {
    expect(pickIndex(4, sequence(2))).toBe(2);
    expect(pickIndex(0)).toBe(-1);
  });
});

describe('drawLots', () => {
  it('重複なしで指定数を選ぶ', () => {
    const result = drawLots(['a', 'b', 'c', 'd', 'e'], 3);
    expect(result).toHaveLength(3);
    expect(new Set(result).size).toBe(3);
  });

  it('元の配列を変更しない', () => {
    const items = ['a', 'b', 'c'];
    drawLots(items, 2, sequence(1, 0));
    expect(items).toEqual(['a', 'b', 'c']);
  });

  it('乱数に従って選ぶ（部分フィッシャー–イェーツ）', () => {
    // i=0: j=0+1 → b、i=1: pool=[b,a,c] から j=1+0 → a
    expect(drawLots(['a', 'b', 'c'], 2, sequence(1, 0))).toEqual(['b', 'a']);
  });

  it('count は 0〜項目数に丸める', () => {
    expect(drawLots(['a', 'b'], 5)).toHaveLength(2);
    expect(drawLots(['a', 'b'], -1)).toEqual([]);
  });
});

describe('targetRotation / indexAtPointer', () => {
  it('どの項目・どの現在角度でも、狙った項目に止まる', () => {
    for (const n of [2, 3, 7, 12, 100]) {
      for (const current of [0, 123.4, 720, 1000]) {
        for (let index = 0; index < n; index++) {
          const target = targetRotation(current, index, n, 5);
          expect(target).toBeGreaterThan(current + 360 * 4);
          expect(indexAtPointer(target, n)).toBe(index);
        }
      }
    }
  });

  it('中心から少しずれても同じ項目に止まる', () => {
    const n = 8;
    const margin = (360 / n) * 0.4;
    expect(indexAtPointer(targetRotation(0, 3, n, 5, margin), n)).toBe(3);
    expect(indexAtPointer(targetRotation(0, 3, n, 5, -margin), n)).toBe(3);
  });
});

describe('rollDice', () => {
  it('出目・合計・補正込みの合計を返す', () => {
    const result = rollDice(
      { count: 3, sides: 6, modifier: 2 },
      sequence(0, 2, 5),
    );
    expect(result.rolls).toEqual([1, 3, 6]);
    expect(result.sum).toBe(10);
    expect(result.total).toBe(12);
  });

  it('実際の乱数でも出目は 1〜sides', () => {
    const result = rollDice({ count: 100, sides: 20, modifier: 0 });
    expect(result.rolls.every((v) => v >= 1 && v <= 20)).toBe(true);
  });

  it('不正な指定は例外', () => {
    expect(() => rollDice({ count: 0, sides: 6, modifier: 0 })).toThrow(
      RangeError,
    );
  });
});

describe('validateDice', () => {
  it('範囲外・小数を検出する', () => {
    expect(validateDice({ count: 1, sides: 6, modifier: 0 })).toBeNull();
    expect(validateDice({ count: 101, sides: 6, modifier: 0 })).toBe('count');
    expect(validateDice({ count: 1.5, sides: 6, modifier: 0 })).toBe('count');
    expect(validateDice({ count: 1, sides: 1, modifier: 0 })).toBe('sides');
    expect(validateDice({ count: 1, sides: 1001, modifier: 0 })).toBe('sides');
    expect(validateDice({ count: 1, sides: 6, modifier: NaN })).toBe(
      'modifier',
    );
  });
});

describe('edge cases', () => {
  it('100個以上の項目を処理できる', () => {
    const items = Array.from({ length: 150 }, (_, i) => `Item ${i + 1}`);
    const result = parseItems(items.join('\n'));
    expect(result).toHaveLength(150);
  });

  it('100個の項目から複数を抽選できる', () => {
    const items = Array.from({ length: 100 }, (_, i) => `Item ${i + 1}`);
    const result = drawLots(items, 50);
    expect(result).toHaveLength(50);
    expect(new Set(result).size).toBe(50);
  });

  it('抽選時に0を指定すると空配列を返す', () => {
    const items = ['a', 'b', 'c'];
    const result = drawLots(items, 0);
    expect(result).toEqual([]);
  });

  it('抽選時に負の数を指定すると空配列に丸められる', () => {
    const items = ['a', 'b', 'c'];
    const result = drawLots(items, -10);
    expect(result).toEqual([]);
  });

  it('サイコロで複数の出目をロールできる', () => {
    const result = rollDice({ count: 100, sides: 6, modifier: 0 });
    expect(result.rolls).toHaveLength(100);
    expect(result.rolls.every((v) => v >= 1 && v <= 6)).toBe(true);
    expect(result.sum).toBeGreaterThanOrEqual(100);
    expect(result.sum).toBeLessThanOrEqual(600);
  });

  it('サイコロの合計が正しく計算される', () => {
    const result = rollDice(
      { count: 3, sides: 6, modifier: -5 },
      sequence(2, 3, 5),
    );
    expect(result.rolls).toEqual([3, 4, 6]);
    expect(result.sum).toBe(13);
    expect(result.total).toBe(8);
  });

  it('ターゲット回転がすべてのケースで最小回転数で到達できる', () => {
    for (const n of [2, 3, 5, 10, 50, 100]) {
      for (let index = 0; index < n; index++) {
        const current = 123.4;
        const target = targetRotation(current, index, n, 4);
        expect(target).toBeGreaterThan(current);
        expect(target - current).toBeLessThan(360 * 5 + 360);
      }
    }
  });

  it('大量の項目でも回転計算が安定している', () => {
    const n = 100;
    for (let index = 0; index < Math.min(n, 10); index++) {
      const target = targetRotation(0, index, n, 5);
      expect(indexAtPointer(target, n)).toBe(index);
    }
  });
});

describe('parseWeightedItems', () => {
  it('行末の「*重み」を読み取る', () => {
    expect(parseWeightedItems('A*3\nB * 0.5\nC＊2\nD')).toEqual([
      { raw: 'A*3', label: 'A', weight: 3 },
      { raw: 'B * 0.5', label: 'B', weight: 0.5 },
      { raw: 'C＊2', label: 'C', weight: 2 },
      { raw: 'D', label: 'D', weight: 1 },
    ]);
  });

  it('不正な重みは行全体を項目名として重み1で扱う', () => {
    for (const raw of ['A*0', 'A*-1', 'A*abc', '*3', 'A*2000000', 'A*1e3']) {
      expect(parseWeightedItems(raw)).toEqual([{ raw, label: raw, weight: 1 }]);
    }
  });
});

describe('pickWeightedIndex', () => {
  it('重みに比例した区間で選ぶ', () => {
    const weights = [1, 3];
    // randomInt(2^32) が 0 → 先頭、2^31 → 0.5*4=2 → 2番目
    expect(pickWeightedIndex(weights, () => 0)).toBe(0);
    expect(pickWeightedIndex(weights, () => 0x40000000)).toBe(1);
    expect(pickWeightedIndex(weights, () => 0xffffffff)).toBe(1);
    expect(pickWeightedIndex([], () => 0)).toBe(-1);
  });

  it('実際の乱数の出現比率が重みに近い', () => {
    const counts = [0, 0];
    for (let i = 0; i < 4000; i++) counts[pickWeightedIndex([1, 3])]++;
    expect(counts[1] / 4000).toBeGreaterThan(0.7);
    expect(counts[1] / 4000).toBeLessThan(0.8);
  });
});

describe('drawWeightedLots', () => {
  it('重複なしで指定数を選び、重みの大きい項目が先に出やすい', () => {
    const result = drawWeightedLots(['a', 'b', 'c'], [1, 1, 100], 3);
    expect(new Set(result).size).toBe(3);
    expect(drawWeightedLots(['a', 'b'], [1, 1], 5)).toHaveLength(2);
    expect(drawWeightedLots(['a'], [1], 0)).toEqual([]);
  });
});

describe('probabilities / 重み付きホイール', () => {
  it('確率の合計は1', () => {
    expect(probabilities([1, 3])).toEqual([0.25, 0.75]);
  });

  it('どの項目・重みでも、狙った項目に止まる', () => {
    const weights = [1, 0.1, 5, 2.5, 0.01, 3];
    for (const current of [0, 123.4, 1000]) {
      for (let i = 0; i < weights.length; i++) {
        for (const jitter of [-0.4, 0, 0.4]) {
          const target = weightedTargetRotation(current, weights, i, 5, jitter);
          expect(target).toBeGreaterThan(current + 360 * 4);
          expect(weightedIndexAtPointer(target, weights)).toBe(i);
        }
      }
    }
  });
});

describe('formatItemLine', () => {
  it('重み1の項目は項目名だけ、それ以外は *重み を付ける', () => {
    expect(formatItemLine('A', 1)).toBe('A');
    expect(formatItemLine('A', 3)).toBe('A*3');
    expect(formatItemLine('A', 0.5)).toBe('A*0.5');
  });

  it('項目名が「*数字」で終わるときは *1 を付け、読み戻しても同じになる', () => {
    for (const label of ['R*3', 'x ＊ 2.5', 'a*b*4']) {
      const [item] = parseWeightedItems(formatItemLine(label, 1));
      expect(item).toMatchObject({ label, weight: 1 });
    }
  });
});

describe('重みの下限', () => {
  it('0.001 未満は重みとして扱わず、行全体を項目名にする', () => {
    expect(parseWeightedItems('A*0.001')[0]).toMatchObject({
      label: 'A',
      weight: 0.001,
    });
    expect(parseWeightedItems('A*0.0001')[0]).toMatchObject({
      label: 'A*0.0001',
      weight: 1,
    });
  });
});
