import { describe, expect, it } from 'vitest';
import {
  DIFFICULTIES,
  DIFFICULTY_SPECS,
  canFinish,
  createGame,
  createRng,
  currentVertex,
  degrees,
  findEdge,
  generatePuzzle,
  getHint,
  hasEulerTrail,
  isConnected,
  isDeadEnd,
  isDifficulty,
  isSolved,
  move,
  oddVertices,
  start,
  startVertices,
  undo,
} from './one-stroke-puzzle';
import type { GameState, Puzzle } from './one-stroke-puzzle';

const pts = (n: number) =>
  Array.from({ length: n }, (_, i) => ({ x: i / n, y: 0.5 }));

// 三角形 0-1-2 に頂点 3 がぶら下がる形: 次数 0:3 1:2 2:3 3:2? 下で個別に定義
const triangle: Puzzle = {
  points: pts(3),
  edges: [
    [0, 1],
    [1, 2],
    [0, 2],
  ],
};
// 蝶ネクタイ（頂点2が中心、次数4）。奇点なし
const bowtie: Puzzle = {
  points: pts(5),
  edges: [
    [0, 1],
    [1, 2],
    [0, 2],
    [2, 3],
    [3, 4],
    [2, 4],
  ],
};
// 奇点が4個（K4）
const k4: Puzzle = {
  points: pts(4),
  edges: [
    [0, 1],
    [0, 2],
    [0, 3],
    [1, 2],
    [1, 3],
    [2, 3],
  ],
};
// 非連結（奇点なしの三角形2つ）
const disconnected: Puzzle = {
  points: pts(6),
  edges: [
    [0, 1],
    [1, 2],
    [0, 2],
    [3, 4],
    [4, 5],
    [3, 5],
  ],
};
// 家の形: 奇点2個（0と1）
const house: Puzzle = {
  points: pts(5),
  edges: [
    [0, 1],
    [0, 2],
    [1, 3],
    [2, 3],
    [0, 3],
    [1, 2],
    [2, 4],
    [3, 4],
  ],
};

function play(game: GameState, vertices: number[]): GameState {
  let g = start(game, vertices[0]!)!;
  for (const v of vertices.slice(1)) {
    const next = move(g, v);
    if (!next) throw new Error(`cannot move to ${v}`);
    g = next;
  }
  return g;
}

describe('createRng / isDifficulty', () => {
  it('同じシードなら同じ列、値は0以上1未満', () => {
    const a = createRng(42);
    const b = createRng(42);
    for (let i = 0; i < 20; i++) {
      const x = a();
      expect(x).toBe(b());
      expect(x).toBeGreaterThanOrEqual(0);
      expect(x).toBeLessThan(1);
    }
  });
  it('難易度の判定', () => {
    expect(isDifficulty('easy')).toBe(true);
    expect(isDifficulty('x')).toBe(false);
    expect(isDifficulty(null)).toBe(false);
  });
});

describe('奇点・連結・オイラー路判定', () => {
  it('三角形は奇点なしで一筆書きできる', () => {
    expect(oddVertices(triangle)).toEqual([]);
    expect(degrees(triangle)).toEqual([2, 2, 2]);
    expect(hasEulerTrail(triangle)).toBe(true);
    expect(startVertices(triangle)).toEqual([0, 1, 2]);
  });
  it('奇点が2個なら始点はその2つに限られる', () => {
    expect(oddVertices(house)).toEqual([0, 1]);
    expect(hasEulerTrail(house)).toBe(true);
    expect(startVertices(house)).toEqual([0, 1]);
  });
  it('奇点が4個だと一筆書きできない', () => {
    expect(oddVertices(k4)).toHaveLength(4);
    expect(hasEulerTrail(k4)).toBe(false);
    expect(startVertices(k4)).toEqual([]);
  });
  it('非連結だと奇点が無くても一筆書きできない', () => {
    expect(isConnected(disconnected)).toBe(false);
    expect(hasEulerTrail(disconnected)).toBe(false);
  });
  it('辺が無い盤面は一筆書き対象外、連結判定は真', () => {
    const empty: Puzzle = { points: pts(2), edges: [] };
    expect(isConnected(empty)).toBe(true);
    expect(hasEulerTrail(empty)).toBe(false);
  });
  it('辺の部分集合でも連結判定できる', () => {
    expect(isConnected(bowtie, [0, 1, 2])).toBe(true);
    expect(isConnected(bowtie, [0, 4])).toBe(false);
  });
});

describe('generatePuzzle', () => {
  for (const level of DIFFICULTIES) {
    it(`${level}: 多数のシードで必ず一筆書き可能な盤面になる`, () => {
      const spec = DIFFICULTY_SPECS[level];
      for (let seed = 1; seed <= 40; seed++) {
        const p = generatePuzzle(level, createRng(seed));
        expect(p.edges).toHaveLength(spec.edges);
        expect(p.points.length).toBeLessThanOrEqual(spec.vertices);
        expect(hasEulerTrail(p)).toBe(true);
        expect(degrees(p).every((d) => d > 0)).toBe(true);
        const keys = p.edges.map((e) => `${e[0]}-${e[1]}`);
        expect(new Set(keys).size).toBe(keys.length);
        for (const [a, b] of p.edges) expect(a).toBeLessThan(b);
        for (const q of p.points) {
          expect(q.x).toBeGreaterThanOrEqual(0);
          expect(q.x).toBeLessThanOrEqual(1);
          expect(q.y).toBeGreaterThanOrEqual(0);
          expect(q.y).toBeLessThanOrEqual(1);
        }
      }
    });
  }
  it('同じシードなら同じ盤面（乱数を注入できる）', () => {
    expect(generatePuzzle('normal', createRng(7))).toEqual(
      generatePuzzle('normal', createRng(7)),
    );
  });
  it('rng が常に0を返す極端な場合でも終了し、盤面を返す', () => {
    const p = generatePuzzle('easy', () => 0);
    expect(p.edges.length).toBeGreaterThan(0);
    expect(hasEulerTrail(p)).toBe(true);
  });
  it('rng が1に近い値を返し続けても範囲外にならない', () => {
    const p = generatePuzzle('hard', () => 0.999999);
    expect(p.edges.length).toBeGreaterThan(0);
    expect(hasEulerTrail(p)).toBe(true);
  });
});

describe('操作（開始・移動・戻す・クリア）', () => {
  it('始点を選び、辺をたどれる', () => {
    let g = createGame(triangle);
    expect(currentVertex(g)).toBeNull();
    g = start(g, 0)!;
    expect(currentVertex(g)).toBe(0);
    g = move(g, 1)!;
    expect(currentVertex(g)).toBe(1);
    expect(g.used).toHaveLength(1);
  });
  it('辺の無い頂点や、すでに始点がある状態では start できない', () => {
    const lone: Puzzle = { points: pts(3), edges: [[0, 1]] };
    expect(start(createGame(lone), 2)).toBeNull();
    const g = start(createGame(triangle), 0)!;
    expect(start(g, 1)).toBeNull();
  });
  it('つながっていない頂点・自分自身・使用済みの辺へは進めない', () => {
    const g = start(createGame(house), 0)!;
    expect(move(g, 4)).toBeNull();
    expect(move(g, 0)).toBeNull();
    const g2 = move(g, 1)!;
    expect(move(g2, 0)).toBeNull();
    expect(findEdge(g2, 0)).toBe(-1);
    expect(findEdge(g2, 3)).toBeGreaterThanOrEqual(0);
  });
  it('始点未選択では移動できない', () => {
    expect(move(createGame(triangle), 1)).toBeNull();
  });
  it('盤面にない頂点番号では始点を選べない', () => {
    expect(start(createGame(house), 99)).toBeNull();
    expect(start(createGame(house), -1)).toBeNull();
  });
  it('辺が無い盤面（生成失敗相当）でも操作は例外にならない', () => {
    const empty: Puzzle = { points: pts(2), edges: [] };
    expect(start(createGame(empty), 0)).toBeNull();
    expect(getHint(createGame(empty))).toBeNull();
  });
  it('1手戻すと辺が未使用に戻り、始点だけなら選択が解除される', () => {
    let g = play(createGame(triangle), [0, 1]);
    g = undo(g);
    expect(g.path).toEqual([0]);
    expect(g.used).toEqual([]);
    expect(move(g, 1)).not.toBeNull();
    g = undo(g);
    expect(g.path).toEqual([]);
    expect(undo(g)).toBe(g);
  });
  it('途中ではクリアにならない', () => {
    const g = play(createGame(house), [0, 2, 1, 3]);
    expect(isSolved(g)).toBe(false);
  });
  it('家の形を一筆書きで完成させられる', () => {
    const g = play(createGame(house), [0, 1, 2, 0, 3, 4, 2, 3, 1]);
    expect(g.used).toHaveLength(8);
    expect(isSolved(g)).toBe(true);
  });
});

describe('行き止まり・完成可能判定', () => {
  it('完成できない始点（偶点だけの盤面ではなく奇点盤面で偶点から開始）は canFinish が偽', () => {
    const g = start(createGame(house), 2)!;
    expect(canFinish(g)).toBe(false);
    expect(getHint(g)).toBeNull();
  });
  it('正しい始点なら canFinish は真', () => {
    expect(canFinish(start(createGame(house), 0)!)).toBe(true);
    expect(canFinish(createGame(house))).toBe(true);
    expect(canFinish(createGame(k4))).toBe(false);
  });
  it('橋を渡ると戻れなくなる手は完成不能になる', () => {
    // 三角形(0,1,2)に頂点2から橋でつながる三角形(3,4,5)。奇点は2と3
    const p: Puzzle = {
      points: pts(6),
      edges: [
        [0, 1],
        [0, 2],
        [1, 2],
        [2, 3],
        [3, 4],
        [3, 5],
        [4, 5],
      ],
    };
    expect(startVertices(p)).toEqual([2, 3]);
    const g = start(createGame(p), 2)!;
    // 橋(2-3)を先に渡すと左の三角形が残る
    expect(canFinish(move(g, 3)!)).toBe(false);
    // 三角形を先に回れば完成できる
    expect(canFinish(move(g, 0)!)).toBe(true);
  });
  it('行き止まりを検出する', () => {
    const p: Puzzle = {
      points: pts(4),
      edges: [
        [0, 1],
        [1, 2],
        [1, 3],
      ],
    };
    // 奇点は 0,2,3,1(次数3) の4個だが、操作としては行き止まりを作れる
    const g = play(createGame(p), [0, 1, 2]);
    expect(isDeadEnd(g)).toBe(true);
    expect(isSolved(g)).toBe(false);
    expect(isDeadEnd(createGame(p))).toBe(false);
  });
  it('クリア後は行き止まり扱いにならない', () => {
    const g = play(createGame(triangle), [0, 1, 2, 0]);
    expect(isSolved(g)).toBe(true);
    expect(isDeadEnd(g)).toBe(false);
    expect(getHint(g)).toBeNull();
  });
});

describe('getHint', () => {
  it('始点未選択なら始点を返す', () => {
    expect(getHint(createGame(house))).toEqual({ kind: 'start', vertex: 0 });
  });
  it('一筆書き不能な盤面では null', () => {
    expect(getHint(createGame(k4))).toBeNull();
  });
  it('橋を避けて三角形を先に回るよう促す', () => {
    const p: Puzzle = {
      points: pts(6),
      edges: [
        [2, 3],
        [0, 1],
        [0, 2],
        [1, 2],
        [3, 4],
        [3, 5],
        [4, 5],
      ],
    };
    const g = start(createGame(p), 2)!;
    const hint = getHint(g)!;
    expect(hint.kind).toBe('edge');
    if (hint.kind === 'edge') {
      expect(hint.to).not.toBe(3);
      expect(canFinish(move(g, hint.to)!)).toBe(true);
    }
  });
  it('ヒントに従い続ければ生成盤面を必ず完成できる', () => {
    for (const level of DIFFICULTIES) {
      for (let seed = 1; seed <= 15; seed++) {
        let g = createGame(generatePuzzle(level, createRng(seed)));
        let guard = 0;
        while (!isSolved(g) && guard++ < 100) {
          const h = getHint(g);
          expect(h).not.toBeNull();
          if (!h) break;
          g = h.kind === 'start' ? start(g, h.vertex)! : move(g, h.to)!;
        }
        expect(isSolved(g)).toBe(true);
      }
    }
  });
});
