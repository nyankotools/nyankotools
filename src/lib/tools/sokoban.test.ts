import { describe, expect, it } from 'vitest';
import {
  LEVELS,
  boxesOnGoal,
  directionFromDelta,
  directionFromKey,
  isEnclosed,
  isSolved,
  moveCount,
  newGame,
  parseLevel,
  parseRecords,
  pushCount,
  serializeRecords,
  solve,
  step,
  undo,
  updateRecord,
} from './sokoban';

const lv = (rows: string[]) => {
  const parsed = parseLevel(rows);
  return { puzzle: parsed.puzzle, state: newGame(parsed) };
};

describe('parseLevel', () => {
  it('壁・ゴール・箱・プレイヤーを読み取る', () => {
    const { puzzle, state } = lv(['#####', '#@$.#', '#####']);
    expect(puzzle.width).toBe(5);
    expect(puzzle.height).toBe(3);
    expect(state.player).toBe(6);
    expect(state.boxes).toEqual([7]);
    expect(puzzle.goals[8]).toBe(true);
    expect(puzzle.walls[0]).toBe(true);
  });

  it('ゴール上の箱・プレイヤーを扱える', () => {
    const { puzzle, state } = lv(['######', '#+$$.#', '######']);
    expect(puzzle.goals[7]).toBe(true);
    expect(puzzle.goals[10]).toBe(true);
    expect(isSolved(puzzle, state)).toBe(false);
    const done = lv(['####', '#@*#', '####']);
    expect(isSolved(done.puzzle, done.state)).toBe(true);
  });

  it('プレイヤー不在・箱とゴールの数不一致は例外', () => {
    expect(() => parseLevel(['#$.#'])).toThrow();
    expect(() => parseLevel(['#@$$.#'])).toThrow();
    expect(() => parseLevel(['#@$##'])).toThrow();
  });

  it('到達できない床は壁になる', () => {
    const { puzzle } = lv(['#####', '#@$.# ', '#####']);
    expect(puzzle.walls[puzzle.width * 1 + 5]).toBe(true);
  });
});

describe('step / undo', () => {
  it('空きマスへ歩く', () => {
    const { puzzle, state } = lv(['#####', '#@ .#', '# $ #', '#####']);
    const next = step(puzzle, state, 'right');
    expect(next.player).toBe(state.player + 1);
    expect(moveCount(next)).toBe(1);
    expect(pushCount(next)).toBe(0);
  });

  it('壁には進めず、同じ state を返す', () => {
    const { puzzle, state } = lv(['#####', '#@$.#', '#####']);
    expect(step(puzzle, state, 'up')).toBe(state);
    expect(step(puzzle, state, 'left')).toBe(state);
  });

  it('箱を押せる。押した手は push に数える', () => {
    const { puzzle, state } = lv(['######', '#@$ .#', '######']);
    const next = step(puzzle, state, 'right');
    expect(next.boxes).toEqual([state.boxes[0] + 1]);
    expect(pushCount(next)).toBe(1);
    expect(moveCount(next)).toBe(1);
  });

  it('箱の先が壁・箱なら押せない', () => {
    const wall = lv(['#####', '#@$##', '# . #', '#####']);
    expect(step(wall.puzzle, wall.state, 'right')).toBe(wall.state);
    const two = lv(['########', '#@$$ ..#', '########']);
    expect(step(two.puzzle, two.state, 'right')).toBe(two.state);
  });

  it('undo は歩きも押しも元に戻す', () => {
    const { puzzle, state } = lv(['#######', '# @$ .#', '#######']);
    const pushed = step(puzzle, state, 'right');
    expect(pushed).not.toBe(state);
    const back = undo(puzzle, pushed);
    expect(back.player).toBe(state.player);
    expect(back.boxes).toEqual(state.boxes);
    expect(back.history).toHaveLength(0);
    const walked = step(puzzle, state, 'left');
    expect(undo(puzzle, walked).player).toBe(state.player);
  });

  it('履歴が無いときの undo は同じ state', () => {
    const { puzzle, state } = lv(['#####', '#@$.#', '#####']);
    expect(undo(puzzle, state)).toBe(state);
  });

  it('押して進み、全部 undo すると初期状態に戻る', () => {
    const { puzzle, state } = lv([
      '######',
      '#    #',
      '# $@ #',
      '#.   #',
      '######',
    ]);
    let cur = state;
    for (const d of ['left', 'up', 'left', 'down'] as const) {
      cur = step(puzzle, cur, d);
    }
    expect(moveCount(cur)).toBeGreaterThan(0);
    while (cur.history.length > 0) cur = undo(puzzle, cur);
    expect(cur.boxes).toEqual(state.boxes);
    expect(cur.player).toBe(state.player);
  });

  it('クリア判定と箱の配置数', () => {
    const { puzzle, state } = lv(['#####', '#@$.#', '#####']);
    expect(isSolved(puzzle, state)).toBe(false);
    expect(boxesOnGoal(puzzle, state)).toBe(0);
    const done = step(puzzle, state, 'right');
    expect(isSolved(puzzle, done)).toBe(true);
    expect(boxesOnGoal(puzzle, done)).toBe(1);
  });
});

describe('ステージ', () => {
  it('20面ある', () => {
    expect(LEVELS.length).toBe(20);
  });

  it.each(LEVELS.map((rows, i) => [i + 1, rows] as const))(
    'ステージ %i は閉じていて、ソルバーで解け、手順の再生でクリアになる',
    (_n, rows) => {
      expect(isEnclosed(rows)).toBe(true);
      const parsed = parseLevel(rows);
      expect(isSolved(parsed.puzzle, parsed.start)).toBe(false);
      const path = solve(parsed.puzzle, parsed.start);
      expect(path).not.toBeNull();
      let cur = newGame(parsed);
      for (const d of path ?? []) {
        const next = step(parsed.puzzle, cur, d);
        expect(next).not.toBe(cur);
        cur = next;
      }
      expect(isSolved(parsed.puzzle, cur)).toBe(true);
    },
    30000,
  );

  it('ソルバーは解けないステージで null を返す', () => {
    // 箱が上の壁際の行にあり、下へは押せないので解けない
    const dead = lv(['#####', '#@$ #', '#  .#', '#####']);
    expect(solve(dead.puzzle, dead.state)).toBeNull();
  });

  it('ソルバーは最少手の手順を返す', () => {
    const { puzzle, state } = lv(['#####', '#@$.#', '#####']);
    expect(solve(puzzle, state)).toEqual(['right']);
  });
});

describe('入力の解釈', () => {
  it('スワイプ量から方向を決める', () => {
    expect(directionFromDelta(40, 5)).toBe('right');
    expect(directionFromDelta(-40, 5)).toBe('left');
    expect(directionFromDelta(5, 40)).toBe('down');
    expect(directionFromDelta(5, -40)).toBe('up');
    expect(directionFromDelta(10, 10)).toBeNull();
    expect(directionFromDelta(0, 0)).toBeNull();
  });

  it('キーから方向を決める', () => {
    expect(directionFromKey('ArrowUp')).toBe('up');
    expect(directionFromKey('s')).toBe('down');
    expect(directionFromKey('A')).toBe('left');
    expect(directionFromKey('ArrowRight')).toBe('right');
    expect(directionFromKey('Enter')).toBeNull();
  });
});

describe('記録', () => {
  it('不正な保存値は空として扱う', () => {
    expect(parseRecords(null, 5)).toEqual({});
    expect(parseRecords('not json', 5)).toEqual({});
    expect(parseRecords('[1,2]', 5)).toEqual({});
    expect(parseRecords('"x"', 5)).toEqual({});
  });

  it('範囲外・非整数・0以下の値は捨てる', () => {
    expect(
      parseRecords('{"0":12,"1":0,"2":-3,"3":1.5,"9":4,"x":5,"4":"7"}', 5),
    ).toEqual({ 0: 12 });
  });

  it('保存と復元が往復できる', () => {
    const rec = { 0: 10, 3: 42 };
    expect(parseRecords(serializeRecords(rec), 5)).toEqual(rec);
  });

  it('少ない手数のときだけ更新する', () => {
    const first = updateRecord({}, 2, 30);
    expect(first.isNewBest).toBe(true);
    expect(first.records[2]).toBe(30);
    const worse = updateRecord(first.records, 2, 35);
    expect(worse.isNewBest).toBe(false);
    expect(worse.records[2]).toBe(30);
    const same = updateRecord(first.records, 2, 30);
    expect(same.isNewBest).toBe(false);
    const better = updateRecord(first.records, 2, 28);
    expect(better.isNewBest).toBe(true);
    expect(better.records[2]).toBe(28);
  });
});
