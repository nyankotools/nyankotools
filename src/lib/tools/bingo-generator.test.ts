import { describe, expect, it } from 'vitest';
import {
  CARD_SIZE,
  clampCardCount,
  clampDrawMax,
  columnLetter,
  createPool,
  DEFAULT_DRAW_MAX,
  drawNumber,
  generateCard,
  generateCards,
  MAX_CARDS,
  MAX_DRAW_MAX,
  MIN_DRAW_MAX,
} from './bingo-generator';

function seeded(seed: number) {
  let s = seed;
  return (max: number) => {
    s = (s * 1664525 + 1013904223) % 4294967296;
    return Math.floor((s / 4294967296) * max);
  };
}

describe('clamp', () => {
  it('抽選範囲を丸める', () => {
    expect(clampDrawMax(75)).toBe(75);
    expect(clampDrawMax(1)).toBe(MIN_DRAW_MAX);
    expect(clampDrawMax(9999)).toBe(MAX_DRAW_MAX);
    expect(clampDrawMax(20.9)).toBe(20);
    expect(clampDrawMax(NaN)).toBe(DEFAULT_DRAW_MAX);
  });
  it('枚数を丸める', () => {
    expect(clampCardCount(0)).toBe(1);
    expect(clampCardCount(1000)).toBe(MAX_CARDS);
    expect(clampCardCount(NaN)).toBe(10);
  });
});

describe('drawNumber', () => {
  it('1〜maxの山を作る', () => {
    const pool = createPool(75);
    expect(pool).toHaveLength(75);
    expect(pool[0]).toBe(1);
    expect(pool[74]).toBe(75);
  });

  it('差し替えた乱数で決まった番号を引き、山から取り除く', () => {
    const result = drawNumber([1, 2, 3, 4, 5], () => 2)!;
    expect(result.drawn).toBe(3);
    expect(result.remaining).toEqual([1, 2, 4, 5]);
  });

  it('元の配列を変更しない', () => {
    const pool = [1, 2, 3];
    drawNumber(pool, () => 0);
    expect(pool).toEqual([1, 2, 3]);
  });

  it('山が空なら null', () => {
    expect(drawNumber([])).toBeNull();
  });

  it('全部引くと重複なく全番号が出る', () => {
    const rand = seeded(7);
    let pool = createPool(75);
    const drawn: number[] = [];
    for (;;) {
      const r = drawNumber(pool, rand);
      if (!r) break;
      drawn.push(r.drawn);
      pool = r.remaining;
    }
    expect(drawn).toHaveLength(75);
    expect([...drawn].sort((a, b) => a - b)).toEqual(createPool(75));
  });

  it('実乱数でも範囲内の整数', () => {
    const r = drawNumber(createPool(75))!;
    expect(r.drawn).toBeGreaterThanOrEqual(1);
    expect(r.drawn).toBeLessThanOrEqual(75);
  });
});

describe('columnLetter', () => {
  it('境界で列見出しが変わる', () => {
    expect(columnLetter(1)).toBe('B');
    expect(columnLetter(15)).toBe('B');
    expect(columnLetter(16)).toBe('I');
    expect(columnLetter(45)).toBe('N');
    expect(columnLetter(60)).toBe('G');
    expect(columnLetter(75)).toBe('O');
  });
  it('範囲外は空文字', () => {
    expect(columnLetter(0)).toBe('');
    expect(columnLetter(76)).toBe('');
    expect(columnLetter(1.5)).toBe('');
  });
});

describe('generateCard', () => {
  it('5×5で中央だけFREE(null)', () => {
    const card = generateCard(seeded(1));
    expect(card).toHaveLength(CARD_SIZE);
    card.forEach((row) => expect(row).toHaveLength(CARD_SIZE));
    expect(card[2][2]).toBeNull();
    expect(card.flat().filter((v) => v === null)).toHaveLength(1);
  });

  it('各列は列の範囲内で重複しない', () => {
    for (let seed = 1; seed <= 50; seed++) {
      const card = generateCard(seeded(seed));
      for (let c = 0; c < 5; c++) {
        const col = card.map((row) => row[c]).filter((v) => v !== null);
        expect(new Set(col).size).toBe(col.length);
        col.forEach((v) => {
          expect(v).toBeGreaterThanOrEqual(c * 15 + 1);
          expect(v).toBeLessThanOrEqual(c * 15 + 15);
        });
        expect(col).toHaveLength(c === 2 ? 4 : 5);
      }
    }
  });

  it('実乱数でも成立する', () => {
    const nums = generateCard()
      .flat()
      .filter((v) => v !== null);
    expect(nums).toHaveLength(24);
    expect(new Set(nums).size).toBe(24);
  });
});

describe('generateCards', () => {
  it('指定枚数を作る（上限で丸める）', () => {
    expect(generateCards(3)).toHaveLength(3);
    expect(generateCards(5000)).toHaveLength(MAX_CARDS);
    expect(generateCards(0)).toHaveLength(1);
  });
  it('同じ乱数列なら同じカード、続けて作ると別のカード', () => {
    const a = generateCards(2, seeded(3));
    const b = generateCards(2, seeded(3));
    expect(a).toEqual(b);
    expect(a[0]).not.toEqual(a[1]);
  });
});
