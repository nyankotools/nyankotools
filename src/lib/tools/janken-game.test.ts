import { describe, expect, it } from 'vitest';
import {
  HANDS,
  HISTORY_LIMIT,
  addHistory,
  applyOutcome,
  emptyStats,
  judge,
  parseStats,
  pickCpuHand,
  serializeStats,
} from './janken-game';
import type { Hand, Outcome, Round } from './janken-game';

describe('judge（全9通り）', () => {
  const cases: [Hand, Hand, Outcome][] = [
    ['rock', 'rock', 'draw'],
    ['rock', 'scissors', 'win'],
    ['rock', 'paper', 'lose'],
    ['scissors', 'rock', 'lose'],
    ['scissors', 'scissors', 'draw'],
    ['scissors', 'paper', 'win'],
    ['paper', 'rock', 'win'],
    ['paper', 'scissors', 'lose'],
    ['paper', 'paper', 'draw'],
  ];
  it.each(cases)('%s vs %s = %s', (player, cpu, expected) => {
    expect(judge(player, cpu)).toBe(expected);
  });
});

describe('pickCpuHand', () => {
  it('乱数の値に対応する手を返す', () => {
    expect(HANDS.map((_, i) => pickCpuHand(() => i))).toEqual([...HANDS]);
  });
  it('乱数には 3 を渡す', () => {
    let received = 0;
    pickCpuHand((max) => {
      received = max;
      return 0;
    });
    expect(received).toBe(3);
  });
  it('既定の乱数でも有効な手を返す', () => {
    for (let i = 0; i < 50; i++) {
      expect(HANDS).toContain(pickCpuHand());
    }
  });
});

describe('applyOutcome', () => {
  it('勝つと連勝が増え最高連勝が更新される', () => {
    let state = { stats: emptyStats(), streak: 0 };
    state = applyOutcome(state, 'win');
    state = applyOutcome(state, 'win');
    expect(state.streak).toBe(2);
    expect(state.stats).toEqual({
      wins: 2,
      losses: 0,
      draws: 0,
      bestStreak: 2,
    });
  });
  it('負けると連勝は0に戻るが最高連勝は残る', () => {
    let state = { stats: emptyStats(), streak: 0 };
    state = applyOutcome(state, 'win');
    state = applyOutcome(state, 'win');
    state = applyOutcome(state, 'lose');
    expect(state.streak).toBe(0);
    expect(state.stats.bestStreak).toBe(2);
    expect(state.stats.losses).toBe(1);
  });
  it('あいこは連勝を維持する', () => {
    let state = { stats: emptyStats(), streak: 0 };
    state = applyOutcome(state, 'win');
    state = applyOutcome(state, 'draw');
    expect(state.streak).toBe(1);
    expect(state.stats.draws).toBe(1);
  });
  it('元の状態を書き換えない', () => {
    const state = { stats: emptyStats(), streak: 0 };
    applyOutcome(state, 'win');
    expect(state.stats.wins).toBe(0);
  });
  it('保存済みの最高連勝を超えるまでは更新しない', () => {
    const state = {
      stats: { wins: 10, losses: 0, draws: 0, bestStreak: 5 },
      streak: 0,
    };
    expect(applyOutcome(state, 'win').stats.bestStreak).toBe(5);
  });
});

describe('addHistory', () => {
  const round: Round = { player: 'rock', cpu: 'paper', outcome: 'lose' };
  it('新しいものを先頭に追加する', () => {
    const next: Round = { player: 'paper', cpu: 'rock', outcome: 'win' };
    expect(addHistory([round], next)).toEqual([next, round]);
  });
  it('上限を超えた古い履歴を捨てる', () => {
    let history: Round[] = [];
    for (let i = 0; i < HISTORY_LIMIT + 5; i++) {
      history = addHistory(history, round);
    }
    expect(history).toHaveLength(HISTORY_LIMIT);
  });
});

describe('parseStats / serializeStats', () => {
  it('往復できる', () => {
    const stats = { wins: 3, losses: 2, draws: 1, bestStreak: 3 };
    expect(parseStats(serializeStats(stats))).toEqual(stats);
  });
  it('null・空・壊れたJSON・配列は空の記録', () => {
    expect(parseStats(null)).toEqual(emptyStats());
    expect(parseStats('')).toEqual(emptyStats());
    expect(parseStats('{oops')).toEqual(emptyStats());
    expect(parseStats('[1,2]')).toEqual(emptyStats());
    expect(parseStats('123')).toEqual(emptyStats());
  });
  it('不正な値は0にし、小数は切り捨てる', () => {
    expect(
      parseStats('{"wins":-1,"losses":"x","draws":2.9,"bestStreak":null}'),
    ).toEqual({ wins: 0, losses: 0, draws: 2, bestStreak: 0 });
  });
});

describe('エッジケース（QA追加）', () => {
  it('非有限数（1e400 等）は 0 扱いにする', () => {
    expect(
      parseStats('{"wins":1e400,"losses":5,"draws":0,"bestStreak":1e400}'),
    ).toEqual({ wins: 0, losses: 5, draws: 0, bestStreak: 0 });
  });

  it('値が欠けたオブジェクトは 0 で補う', () => {
    expect(parseStats('{}')).toEqual(emptyStats());
  });

  it('連勝中に引き分けを挟んでも連勝は途切れず、負けで0になる', () => {
    let state = { stats: emptyStats(), streak: 0 };
    state = applyOutcome(state, 'win');
    state = applyOutcome(state, 'draw');
    state = applyOutcome(state, 'win');
    expect(state.streak).toBe(2);
    expect(state.stats.bestStreak).toBe(2);
    state = applyOutcome(state, 'lose');
    expect(state.streak).toBe(0);
  });

  it('履歴は上限ちょうど（20件）で捨てない', () => {
    let history: Round[] = [];
    const round: Round = { player: 'rock', cpu: 'rock', outcome: 'draw' };
    for (let i = 0; i < HISTORY_LIMIT; i++) {
      history = addHistory(history, round);
    }
    expect(history).toHaveLength(HISTORY_LIMIT);
  });
});
