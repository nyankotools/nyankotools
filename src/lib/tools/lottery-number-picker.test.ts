import { describe, it, expect } from 'vitest';
import {
  GAMES,
  MAX_SETS,
  formatTicket,
  formatTickets,
  generateTicket,
  generateTickets,
  getGame,
  isValidSetCount,
} from './lottery-number-picker';

const game = (id: string) => getGame(id)!;

describe('GAMES', () => {
  it('公式の範囲と個数になっている', () => {
    expect(game('loto6')).toMatchObject({ max: 43, pick: 6 });
    expect(game('miniloto')).toMatchObject({ max: 31, pick: 5 });
    expect(game('loto7')).toMatchObject({ max: 37, pick: 7 });
    expect(game('numbers3')).toMatchObject({ digits: 3 });
    expect(game('numbers4')).toMatchObject({ digits: 4 });
    expect(GAMES).toHaveLength(5);
    expect(getGame('unknown')).toBeUndefined();
  });
});

describe('generateTicket', () => {
  it('ロト系は個数が正しく、範囲内・重複なし・昇順', () => {
    for (const id of ['loto6', 'miniloto', 'loto7']) {
      const g = game(id);
      if (g.kind !== 'loto') throw new Error('unexpected');
      for (let i = 0; i < 200; i++) {
        const t = generateTicket(g);
        expect(t).toHaveLength(g.pick);
        expect(new Set(t).size).toBe(g.pick);
        expect(t.every((n) => n >= 1 && n <= g.max)).toBe(true);
        expect([...t].sort((a, b) => a - b)).toEqual(t);
      }
    }
  });

  it('乱数が常に0を返しても重複しない（先頭から順に選ばれる）', () => {
    expect(generateTicket(game('loto6'), () => 0)).toEqual([1, 2, 3, 4, 5, 6]);
  });

  it('乱数が常に最大値を返しても範囲内で重複しない', () => {
    const t = generateTicket(game('miniloto'), (max) => max - 1);
    expect(new Set(t).size).toBe(5);
    expect(t.every((n) => n >= 1 && n <= 31)).toBe(true);
  });

  it('ナンバーズは各桁0〜9で、重複を許す', () => {
    expect(generateTicket(game('numbers3'), () => 7)).toEqual([7, 7, 7]);
    for (let i = 0; i < 200; i++) {
      const t = generateTicket(game('numbers4'));
      expect(t).toHaveLength(4);
      expect(t.every((n) => Number.isInteger(n) && n >= 0 && n <= 9)).toBe(
        true,
      );
    }
  });

  it('ナンバーズは抽選順を保つ（ソートしない）', () => {
    let i = 0;
    const seq = [9, 0, 5];
    expect(generateTicket(game('numbers3'), () => seq[i++])).toEqual([9, 0, 5]);
  });
});

describe('generateTickets', () => {
  it('指定した口数を返す', () => {
    expect(generateTickets(game('loto7'), 5)).toHaveLength(5);
    expect(generateTickets(game('numbers3'), MAX_SETS)).toHaveLength(MAX_SETS);
  });

  it('範囲外・非整数の口数はエラー', () => {
    expect(() => generateTickets(game('loto6'), 0)).toThrow(RangeError);
    expect(() => generateTickets(game('loto6'), MAX_SETS + 1)).toThrow(
      RangeError,
    );
    expect(() => generateTickets(game('loto6'), 1.5)).toThrow(RangeError);
    expect(() => generateTickets(game('loto6'), NaN)).toThrow(RangeError);
  });
});

describe('isValidSetCount', () => {
  it('1〜上限の整数だけ true', () => {
    expect(isValidSetCount(1)).toBe(true);
    expect(isValidSetCount(MAX_SETS)).toBe(true);
    expect(isValidSetCount(0)).toBe(false);
    expect(isValidSetCount(-1)).toBe(false);
    expect(isValidSetCount(MAX_SETS + 1)).toBe(false);
    expect(isValidSetCount(2.5)).toBe(false);
  });
});

describe('formatTicket / formatTickets', () => {
  it('ロトは2桁ゼロ埋めの空白区切り', () => {
    expect(formatTicket(game('loto6'), [1, 5, 12, 30, 41, 43])).toBe(
      '01 05 12 30 41 43',
    );
  });

  it('ナンバーズは先頭の0を残して連結', () => {
    expect(formatTicket(game('numbers3'), [0, 0, 7])).toBe('007');
    expect(formatTicket(game('numbers4'), [0, 1, 2, 3])).toBe('0123');
  });

  it('複数口は1口1行', () => {
    expect(
      formatTickets(game('numbers3'), [
        [1, 2, 3],
        [4, 5, 6],
      ]),
    ).toBe('123\n456');
    expect(formatTickets(game('numbers3'), [])).toBe('');
  });
});
