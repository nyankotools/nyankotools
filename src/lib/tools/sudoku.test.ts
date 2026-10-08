import { describe, expect, it } from 'vitest';
import {
  CELLS,
  TARGET_CLUES,
  candidatesFor,
  countClues,
  countSolutions,
  emptyGrid,
  findConflicts,
  findMistakes,
  formatGrid,
  generatePuzzle,
  generateSolved,
  getHint,
  isSolved,
  parseGrid,
  peersOf,
  solve,
  type Difficulty,
} from './sudoku';

function seeded(seed: number) {
  let a = seed;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const SAMPLE =
  '53..7....6..195....98....6.8...6...34..8.3..17...2...6.6....28....419..5....8..79';
const SAMPLE_SOLUTION =
  '534678912672195348198342567859761423426853791713924856961537284287419635345286179';

describe('parseGrid / formatGrid', () => {
  it('往復できる', () => {
    const g = parseGrid(SAMPLE);
    expect(g).not.toBeNull();
    expect(formatGrid(g!)).toBe(SAMPLE);
  });
  it('長さや文字が不正なら null', () => {
    expect(parseGrid('123')).toBeNull();
    expect(parseGrid('x'.repeat(81))).toBeNull();
  });
});

describe('peersOf', () => {
  it('各マスの関係マスは20個', () => {
    for (let i = 0; i < CELLS; i++) expect(peersOf(i)).toHaveLength(20);
  });
});

describe('solve / countSolutions', () => {
  it('既知の問題を解ける', () => {
    const g = parseGrid(SAMPLE)!;
    expect(formatGrid(solve(g)!)).toBe(SAMPLE_SOLUTION);
    expect(countSolutions(g)).toBe(1);
  });
  it('空盤面は解が複数（limitで打ち切る）', () => {
    expect(countSolutions(emptyGrid(), 2)).toBe(2);
  });
  it('矛盾した盤面は解なし', () => {
    const g = emptyGrid();
    g[0] = 5;
    g[1] = 5;
    expect(countSolutions(g)).toBe(0);
    expect(solve(g)).toBeNull();
  });
  it('行き詰まる盤面は解なし', () => {
    // 1行目に1〜8を置くと(0,0)は9しか入らないが、同じ列に9がある
    const g = emptyGrid();
    for (let v = 1; v <= 8; v++) g[v] = v;
    g[9 * 4 + 0] = 9;
    expect(countSolutions(g)).toBe(0);
  });
  it('長さが違えば0', () => {
    expect(countSolutions([1, 2, 3])).toBe(0);
  });
});

describe('generateSolved', () => {
  it('完成した正しい盤面を作る', () => {
    const g = generateSolved(seeded(1));
    expect(isSolved(g)).toBe(true);
  });
  it('シードが違えば別の盤面になる', () => {
    expect(formatGrid(generateSolved(seeded(1)))).not.toBe(
      formatGrid(generateSolved(seeded(2))),
    );
  });
});

describe('generatePuzzle', () => {
  const cases: Difficulty[] = ['easy', 'normal', 'hard'];
  for (const d of cases) {
    it(`${d}: 唯一解で、解がsolutionと一致し、ヒント数が目標付近`, () => {
      const { puzzle, solution } = generatePuzzle(d, seeded(42));
      expect(countSolutions(puzzle, 2)).toBe(1);
      expect(formatGrid(solve(puzzle)!)).toBe(formatGrid(solution));
      expect(isSolved(solution)).toBe(true);
      expect(countClues(puzzle)).toBeLessThanOrEqual(TARGET_CLUES[d] + 6);
      // 初期配置は解と矛盾しない
      puzzle.forEach((v, i) => {
        if (v) expect(v).toBe(solution[i]);
      });
    });
  }
  it('難しいほどヒントが少ない', () => {
    const easy = countClues(generatePuzzle('easy', seeded(7)).puzzle);
    const hard = countClues(generatePuzzle('hard', seeded(7)).puzzle);
    expect(hard).toBeLessThan(easy);
  });
  it('生成は十分速い（10問で3秒未満）', () => {
    const start = Date.now();
    for (let i = 0; i < 10; i++) generatePuzzle('hard', seeded(100 + i));
    expect(Date.now() - start).toBeLessThan(3000);
  });
});

describe('findConflicts / isSolved / findMistakes', () => {
  it('重複したマスを両方返す', () => {
    const g = emptyGrid();
    g[0] = 3;
    g[8] = 3; // 同じ行
    g[40] = 3; // 無関係
    expect(findConflicts(g).sort((a, b) => a - b)).toEqual([0, 8]);
  });
  it('列・ブロックの重複も検出', () => {
    const g = emptyGrid();
    g[0] = 4;
    g[9 * 8] = 4; // 同じ列
    g[10] = 4; // 同じブロック
    expect(findConflicts(g)).toEqual(expect.arrayContaining([0, 72, 10]));
  });
  it('空きがあれば未完成', () => {
    const g = parseGrid(SAMPLE_SOLUTION)!;
    expect(isSolved(g)).toBe(true);
    g[0] = 0;
    expect(isSolved(g)).toBe(false);
  });
  it('埋まっていても重複があれば未完成', () => {
    const g = parseGrid(SAMPLE_SOLUTION)!;
    g[0] = g[1];
    expect(isSolved(g)).toBe(false);
  });
  it('正解と違うマスを返す。空きは含まない', () => {
    const sol = parseGrid(SAMPLE_SOLUTION)!;
    const g = emptyGrid();
    g[0] = sol[0];
    g[1] = sol[1] === 9 ? 1 : 9;
    expect(findMistakes(g, sol)).toEqual([1]);
  });
});

describe('candidatesFor / getHint', () => {
  it('候補は関係マスにない数字', () => {
    const g = parseGrid(SAMPLE)!;
    expect(candidatesFor(g, 2)).toEqual([1, 2, 4]);
  });
  it('選択マスが空きならそのマスの正解を返す', () => {
    const g = parseGrid(SAMPLE)!;
    const sol = parseGrid(SAMPLE_SOLUTION)!;
    const hint = getHint(g, sol, 2);
    expect(hint).toEqual({ index: 2, value: 4, forced: false });
  });
  it('選択がなければ候補が1つのマスを優先する', () => {
    const g = parseGrid(SAMPLE)!;
    const sol = parseGrid(SAMPLE_SOLUTION)!;
    const hint = getHint(g, sol)!;
    expect(hint.forced).toBe(true);
    expect(sol[hint.index]).toBe(hint.value);
    expect(g[hint.index]).toBe(0);
  });
  it('選択マスが埋まっていれば別の空きマスを探す', () => {
    const g = parseGrid(SAMPLE)!;
    const sol = parseGrid(SAMPLE_SOLUTION)!;
    const hint = getHint(g, sol, 0)!;
    expect(g[hint.index]).toBe(0);
  });
  it('全部埋まっていれば null', () => {
    const sol = parseGrid(SAMPLE_SOLUTION)!;
    expect(getHint(sol, sol)).toBeNull();
  });
});
