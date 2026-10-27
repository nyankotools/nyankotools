import { describe, expect, it } from 'vitest';
import { findType, isValidAnswers, scoreAxes } from './scoring';
import type { ScoringTable } from './types';

const table: ScoringTable = {
  axes: [
    { id: 'x', stars: [2, 4] },
    { id: 'y', stars: [2, 4] },
  ],
  questions: [
    {
      id: 'q1',
      choices: [
        { id: 'a', effects: { x: 2 } },
        { id: 'b', effects: { x: -2 } },
        { id: 'c', effects: {} },
      ],
    },
    {
      id: 'q2',
      choices: [
        { id: 'a', effects: { x: 2, y: 1 } },
        { id: 'b', effects: { x: -2, y: -1 } },
      ],
    },
  ],
  types: [
    { id: 'pp', poles: { x: '+', y: '+' } },
    { id: 'pm', poles: { x: '+', y: '-' } },
    { id: 'mp', poles: { x: '-', y: '+' } },
    { id: 'mm', poles: { x: '-', y: '-' } },
  ],
  rarityRates: { N: 1000, R: 0, SR: 0, SSR: 0, UR: 0, LR: 0 },
};

describe('scoring', () => {
  it('回答の問数・選択肢の範囲を検証する', () => {
    expect(isValidAnswers(table, [0, 1])).toBe(true);
    expect(isValidAnswers(table, [2, 0])).toBe(true);
    expect(isValidAnswers(table, [0])).toBe(false);
    expect(isValidAnswers(table, [0, 2])).toBe(false);
    expect(isValidAnswers(table, [-1, 0])).toBe(false);
    expect(isValidAnswers(table, [0.5, 0])).toBe(false);
    expect(isValidAnswers(table, [NaN, 0])).toBe(false);
    expect(isValidAnswers(table, [Infinity, 0])).toBe(false);
    expect(isValidAnswers(table, [0, 0, 0])).toBe(false);
  });

  it('effects を合計し、符号で極、絶対値で★を決める', () => {
    const axes = scoreAxes(table, [0, 0]);
    expect(axes.x).toEqual({ score: 4, pole: '+', stars: 3 });
    expect(axes.y).toEqual({ score: 1, pole: '+', stars: 1 });
    expect(scoreAxes(table, [2, 1]).x).toEqual({
      score: -2,
      pole: '-',
      stars: 2,
    });
  });

  it('★の境界: 下限ちょうどは上の★、1つ下は下の★（★2=2・★3=4 の表）', () => {
    // 1問に選択肢の配点 2・3・4・-4 を置いた表。★2=2 / ★3=4
    const stars: ScoringTable = {
      axes: [{ id: 'x', stars: [2, 4] }],
      questions: [
        {
          id: 'q',
          choices: [2, 3, 4, -4, -1].map((v, i) => ({
            id: `c${i}`,
            effects: { x: v },
          })),
        },
      ],
      types: [],
      rarityRates: { N: 1000, R: 0, SR: 0, SSR: 0, UR: 0, LR: 0 },
    };
    const at = (choice: number) => scoreAxes(stars, [choice]).x;
    expect(at(0)).toEqual({ score: 2, pole: '+', stars: 2 }); // ★2 ちょうど
    expect(at(1)).toEqual({ score: 3, pole: '+', stars: 2 }); // ★2 と ★3 の間
    expect(at(2)).toEqual({ score: 4, pole: '+', stars: 3 }); // ★3 ちょうど
    expect(at(3)).toEqual({ score: -4, pole: '-', stars: 3 }); // − 側も絶対値で ★3
    expect(at(4)).toEqual({ score: -1, pole: '-', stars: 1 }); // ★1
  });

  it('同点(0)はその軸に寄与した最後の回答の向きに倒す', () => {
    // x: +2 (q1) と -2 (q2) で0 → 最後に寄与した q2 の − 側
    expect(scoreAxes(table, [0, 1]).x.pole).toBe('-');
    // 逆順なら + 側
    expect(scoreAxes(table, [1, 0]).x.pole).toBe('+');
  });

  it('同点の判定では、その軸に寄与しない（配点なし・別の軸だけの）回答を飛ばす', () => {
    // q1: a=+2, b=0 / q2: a=-2, b=0 / q3: a=0, b=y のみ
    const tie: ScoringTable = {
      axes: [{ id: 'x', stars: [2, 4] }],
      questions: [
        {
          id: 'q1',
          choices: [
            { id: 'a', effects: { x: 2 } },
            { id: 'b', effects: {} },
          ],
        },
        {
          id: 'q2',
          choices: [
            { id: 'a', effects: { x: -2 } },
            { id: 'b', effects: {} },
          ],
        },
        {
          id: 'q3',
          choices: [
            { id: 'a', effects: {} },
            { id: 'b', effects: { y: 1 } },
          ],
        },
      ],
      types: [],
      rarityRates: { N: 1000, R: 0, SR: 0, SSR: 0, UR: 0, LR: 0 },
    };
    // 最後の q3 は x に寄与しないので、q2 の − 側
    expect(scoreAxes(tie, [0, 0, 1]).x).toEqual({
      score: 0,
      pole: '-',
      stars: 1,
    });
    expect(scoreAxes(tie, [0, 0, 0]).x.pole).toBe('-');
    // どの回答も寄与しない同点は + 側
    expect(scoreAxes(tie, [1, 1, 1]).x.pole).toBe('+');
  });

  it('どの回答も寄与しない軸は + 側', () => {
    const only: ScoringTable = { ...table, questions: [table.questions[0]] };
    expect(scoreAxes(only, [2]).y).toEqual({ score: 0, pole: '+', stars: 1 });
  });

  it('極の組み合わせからタイプを引く（対応するタイプがなければ undefined）', () => {
    expect(findType(table, scoreAxes(table, [2, 1]))?.id).toBe('mm');
    expect(findType(table, scoreAxes(table, [0, 0]))?.id).toBe('pp');
    const partial: ScoringTable = { ...table, types: [table.types[0]] };
    expect(findType(partial, scoreAxes(table, [2, 1]))).toBeUndefined();
  });
});
