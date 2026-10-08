import { describe, expect, it } from 'vitest';
import {
  MAX_NAMES,
  MAX_TEAMS,
  formatTeamsText,
  isSplitError,
  planSplit,
  splitTeams,
} from './team-splitter';

/** 常に0を返す（shuffle は逆順にならず決定的になる） */
const zero = () => 0;

function plan(n: number, mode: 'teams' | 'size', v: number) {
  const p = planSplit(n, mode, v);
  if (isSplitError(p)) throw new Error(p);
  return p;
}

describe('planSplit', () => {
  it('チーム数で分けると余りが均等に分散される', () => {
    expect(plan(10, 'teams', 3)).toEqual({ teamCount: 3, sizes: [4, 3, 3] });
    expect(plan(9, 'teams', 3).sizes).toEqual([3, 3, 3]);
    expect(plan(2, 'teams', 2).sizes).toEqual([1, 1]);
  });

  it('人数で分けるとチーム数は切り上げ、余りは均等に分散される', () => {
    expect(plan(10, 'size', 3)).toEqual({ teamCount: 4, sizes: [3, 3, 2, 2] });
    expect(plan(10, 'size', 5).sizes).toEqual([5, 5]);
    expect(plan(7, 'size', 6)).toEqual({ teamCount: 2, sizes: [4, 3] });
  });

  it('人数の合計は名簿と一致し、差は1以下', () => {
    for (let n = 2; n <= 30; n++) {
      for (let v = 1; v <= n; v++) {
        for (const mode of ['teams', 'size'] as const) {
          const p = planSplit(n, mode, v);
          if (isSplitError(p)) continue;
          expect(p.sizes.reduce((a, b) => a + b, 0)).toBe(n);
          expect(
            Math.max(...p.sizes) - Math.min(...p.sizes),
          ).toBeLessThanOrEqual(1);
        }
      }
    }
  });

  it('不正な入力はエラーを返す', () => {
    expect(planSplit(1, 'teams', 2)).toBe('tooFewNames');
    expect(planSplit(0, 'size', 1)).toBe('tooFewNames');
    expect(planSplit(MAX_NAMES + 1, 'teams', 2)).toBe('tooManyNames');
    expect(planSplit(5, 'teams', 1)).toBe('invalidValue');
    expect(planSplit(5, 'teams', 6)).toBe('invalidValue');
    expect(planSplit(5, 'teams', 2.5)).toBe('invalidValue');
    expect(planSplit(5, 'teams', NaN)).toBe('invalidValue');
    expect(planSplit(5, 'size', 0)).toBe('invalidValue');
    expect(planSplit(5, 'size', 6)).toBe('invalidValue');
    // 1チームに全員が入る（チームが1つ）指定は不可
    expect(planSplit(5, 'size', 5)).toBe('invalidValue');
  });

  it('チーム数の上限を超える指定はエラー', () => {
    expect(planSplit(MAX_NAMES, 'teams', MAX_TEAMS + 1)).toBe('invalidValue');
    expect(isSplitError(planSplit(MAX_NAMES, 'teams', MAX_TEAMS))).toBe(false);
    expect(planSplit(MAX_NAMES, 'size', 1)).toBe('invalidValue');
  });
});

describe('splitTeams', () => {
  const names = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];

  it('全員がちょうど1回ずつ振り分けられる', () => {
    const teams = splitTeams(names, plan(7, 'teams', 3));
    expect(teams).toHaveLength(3);
    expect(teams.flat().sort()).toEqual([...names]);
    const sizes = teams.map((t) => t.length).sort();
    expect(sizes).toEqual([2, 2, 3]);
  });

  it('同名の参加者も別々に数える', () => {
    const teams = splitTeams(
      ['太郎', '太郎', '太郎', '花子'],
      plan(4, 'teams', 2),
    );
    expect(teams.flat().filter((n) => n === '太郎')).toHaveLength(3);
    expect(teams.flat()).toHaveLength(4);
  });

  it('入力の配列は変更されない', () => {
    const copy = [...names];
    splitTeams(copy, plan(7, 'teams', 2));
    expect(copy).toEqual(names);
  });

  it('randomInt を固定すると結果が決まる', () => {
    const a = splitTeams(names, plan(7, 'teams', 3), zero);
    const b = splitTeams(names, plan(7, 'teams', 3), zero);
    expect(a).toEqual(b);
  });

  it('乱数が違えば並びも変わる', () => {
    const a = splitTeams(names, plan(7, 'teams', 2), zero);
    const b = splitTeams(names, plan(7, 'teams', 2), (max) => max - 1);
    expect(a).not.toEqual(b);
  });
});

describe('formatTeamsText', () => {
  it('チームごとに見出しと名前を並べ、空行で区切る', () => {
    expect(formatTeamsText([['A', 'B'], ['C']], ['Team 1', 'Team 2'])).toBe(
      'Team 1\nA\nB\n\nTeam 2\nC',
    );
  });

  it('空の配列は空文字列', () => {
    expect(formatTeamsText([], [])).toBe('');
  });
});
