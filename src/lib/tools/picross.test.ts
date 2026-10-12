import { describe, it, expect } from 'vitest';
import {
  PUZZLE_SIZES,
  PUZZLE_SIZE_IDS,
  checkUniqueness,
  clueEquals,
  computeClues,
  createSolution,
  generatePuzzle,
  isSolved,
  lineClue,
  solveLine,
  solvePuzzle,
  solutionFromBrightness,
  type Solution,
} from './picross';

function fromRows(rows: string[]): Solution {
  const height = rows.length;
  const width = rows[0].length;
  const solution = createSolution(width, height);
  rows.forEach((row, y) =>
    [...row].forEach((ch, x) => {
      solution.cells[y * width + x] = ch === '#' ? 1 : 0;
    }),
  );
  return solution;
}

/** 決定的な疑似乱数（テスト用） */
function seeded(seed: number) {
  let s = seed;
  return (max: number) => {
    s = (s * 1664525 + 1013904223) % 4294967296;
    return Math.floor((s / 4294967296) * max);
  };
}

describe('lineClue', () => {
  it('連続する黒の長さを並べる', () => {
    expect(lineClue([1, 1, 0, 1, 0, 0, 1, 1, 1])).toEqual([2, 1, 3]);
  });

  it('黒がなければ [0]', () => {
    expect(lineClue([0, 0, 0])).toEqual([0]);
  });

  it('全部黒なら全体の長さ', () => {
    expect(lineClue([1, 1, 1, 1])).toEqual([4]);
  });
});

describe('computeClues', () => {
  it('行と列のヒントを求める', () => {
    const clues = computeClues(fromRows(['##.', '.#.', '#.#']));
    expect(clues.rows).toEqual([[2], [1], [1, 1]]);
    expect(clues.cols).toEqual([[1, 1], [2], [1]]);
  });
});

describe('solveLine', () => {
  it('ヒントが線の長さぴったりなら全マス確定する', () => {
    expect(solveLine([2, 1], [-1, -1, -1, -1])).toEqual([1, 1, 0, 1]);
  });

  it('重なる部分だけ確定する', () => {
    expect(solveLine([4], [-1, -1, -1, -1, -1, -1])).toEqual([
      -1, -1, 1, 1, -1, -1,
    ]);
  });

  it('[0] は全マス白', () => {
    expect(solveLine([0], [-1, -1, -1])).toEqual([0, 0, 0]);
  });

  it('既知のセルを考慮して絞り込む', () => {
    expect(solveLine([2], [-1, -1, -1, 0, -1])).toEqual([-1, 1, -1, 0, 0]);
    expect(solveLine([3], [1, -1, -1, -1, -1])).toEqual([1, 1, 1, 0, 0]);
  });

  it('矛盾するときは null', () => {
    expect(solveLine([3], [-1, -1, 0, -1])).toBeNull();
    expect(solveLine([1], [1, -1, 1])).toBeNull();
  });
});

describe('solvePuzzle / checkUniqueness', () => {
  it('唯一解の問題を解ける', () => {
    const solution = fromRows(['#.#.#', '.###.', '##.##', '.#.#.', '#...#']);
    const result = solvePuzzle(computeClues(solution), 5, 5);
    expect(result.count).toBe(1);
    expect(Array.from(result.first!.cells)).toEqual(Array.from(solution.cells));
  });

  it('斜めの2通りがある絵は複数解と判定する', () => {
    expect(checkUniqueness(fromRows(['#.', '.#']))).toBe('multiple');
  });

  it('黒がない絵は empty', () => {
    expect(checkUniqueness(createSolution(5, 5))).toBe('empty');
  });

  it('全部黒の絵は唯一解', () => {
    const solution = createSolution(3, 3);
    solution.cells.fill(1);
    expect(checkUniqueness(solution)).toBe('unique');
  });

  it('矛盾するヒントは解なし', () => {
    const result = solvePuzzle({ rows: [[2], [0]], cols: [[1], [0]] }, 2, 2);
    expect(result.count).toBe(0);
  });
});

describe('isSolved', () => {
  const solution = fromRows(['##.', '.#.', '#.#']);
  const clues = computeClues(solution);

  it('ヒントを満たす配置なら true', () => {
    expect(isSolved(clues, 3, 3, solution.cells)).toBe(true);
  });

  it('×印（2）は黒として数えない', () => {
    const cells = Array.from(solution.cells).map((v) => (v === 1 ? 1 : 2));
    expect(isSolved(clues, 3, 3, cells)).toBe(true);
  });

  it('1マス違えば false', () => {
    const cells = Array.from(solution.cells);
    cells[2] = 1;
    expect(isSolved(clues, 3, 3, cells)).toBe(false);
  });
});

describe('generatePuzzle', () => {
  for (const id of PUZZLE_SIZE_IDS) {
    it(`${id}（${PUZZLE_SIZES[id]}×${PUZZLE_SIZES[id]}）は唯一解の問題を作る`, () => {
      const size = PUZZLE_SIZES[id];
      for (let seed = 1; seed <= 5; seed++) {
        const puzzle = generatePuzzle(size, seeded(seed));
        expect(puzzle.width).toBe(size);
        expect(puzzle.height).toBe(size);
        expect(checkUniqueness(puzzle)).toBe('unique');
      }
    });
  }

  it('15×15 でも実用的な時間で作れる', () => {
    const start = Date.now();
    generatePuzzle(15, seeded(99));
    expect(Date.now() - start).toBeLessThan(5000);
  });
});

describe('solutionFromBrightness', () => {
  it('しきい値より暗い画素を黒にする', () => {
    const solution = solutionFromBrightness(2, [0, 200, 127, 128]);
    expect(Array.from(solution.cells)).toEqual([1, 0, 1, 0]);
  });
});

describe('clueEquals', () => {
  it('同じ並びなら true', () => {
    expect(clueEquals([1, 2], [1, 2])).toBe(true);
    expect(clueEquals([1, 2], [2, 1])).toBe(false);
    expect(clueEquals([1], [1, 1])).toBe(false);
  });
});

describe('solveLine（総当たりとの照合）', () => {
  /** 長さ n の 0/1 列すべて */
  const allLines = (n: number) =>
    Array.from({ length: 1 << n }, (_, bits) =>
      Array.from({ length: n }, (_, i) => (bits >> i) & 1),
    );

  it('長さ6以下のすべてのヒント・既知セルの組で、列挙した共通部分と一致する', () => {
    for (let n = 1; n <= 6; n++) {
      const lines = allLines(n);
      const clues = new Map<string, number[]>();
      for (const line of lines)
        clues.set(lineClue(line).join(','), lineClue(line));
      for (const clue of clues.values()) {
        const matching = lines.filter((l) => clueEquals(lineClue(l), clue));
        // 既知セルのパターン: 各セルを不明/白/黒のいずれかにする（3^n）
        for (let code = 0; code < 3 ** n; code++) {
          const known: number[] = [];
          let c = code;
          for (let i = 0; i < n; i++) {
            known.push(c % 3 === 0 ? -1 : (c % 3) - 1);
            c = Math.floor(c / 3);
          }
          const fit = matching.filter((l) =>
            known.every((v, i) => v === -1 || v === l[i]),
          );
          const expected = fit.length
            ? known.map((v, i) =>
                v !== -1
                  ? v
                  : fit.every((l) => l[i] === fit[0][i])
                    ? fit[0][i]
                    : -1,
              )
            : null;
          expect(solveLine(clue, known)).toEqual(expected);
        }
      }
    }
  });
});
