import { describe, it, expect } from 'vitest';
import {
  DIFFICULTIES,
  EAST,
  MAX_SIZE,
  MIN_SIZE,
  NORTH,
  SOUTH,
  WEST,
  clampSize,
  generateMaze,
  solveMaze,
  wallSegments,
  type Maze,
} from './maze-generator';

function seeded(seed: number) {
  let s = seed;
  return (max: number) => {
    s = (s * 1664525 + 1013904223) % 4294967296;
    return Math.floor((s / 4294967296) * max);
  };
}

/** 開いている通路の本数（双方向なので2で割る）と、通路の対称性を調べる */
function edgeCount(maze: Maze): number {
  const { width, height, open } = maze;
  let bits = 0;
  for (let i = 0; i < open.length; i++) {
    const x = i % width;
    const y = Math.floor(i / width);
    if (open[i] & NORTH) {
      expect(y).toBeGreaterThan(0);
      expect(open[i - width] & SOUTH).toBeTruthy();
      bits++;
    }
    if (open[i] & SOUTH) {
      expect(y).toBeLessThan(height - 1);
      expect(open[i + width] & NORTH).toBeTruthy();
      bits++;
    }
    if (open[i] & EAST) {
      expect(x).toBeLessThan(width - 1);
      expect(open[i + 1] & WEST).toBeTruthy();
      bits++;
    }
    if (open[i] & WEST) {
      expect(x).toBeGreaterThan(0);
      expect(open[i - 1] & EAST).toBeTruthy();
      bits++;
    }
  }
  return bits / 2;
}

describe('clampSize', () => {
  it('範囲内に収め、整数に丸める', () => {
    expect(clampSize(1)).toBe(MIN_SIZE);
    expect(clampSize(999)).toBe(MAX_SIZE);
    expect(clampSize(12.4)).toBe(12);
    expect(clampSize(NaN)).toBe(15);
  });

  it('無限大や負の値、0 も範囲内に収まる（無限大は既定値）', () => {
    expect(clampSize(Infinity)).toBe(15);
    expect(clampSize(-Infinity)).toBe(15);
    expect(clampSize(-10)).toBe(MIN_SIZE);
    expect(clampSize(0)).toBe(MIN_SIZE);
    expect(clampSize(4.5)).toBe(5);
    expect(clampSize(MAX_SIZE + 0.4)).toBe(MAX_SIZE);
  });
});

describe('generateMaze', () => {
  for (const difficulty of DIFFICULTIES) {
    for (const [w, h] of [
      [5, 5],
      [15, 10],
      [MAX_SIZE, MIN_SIZE],
    ]) {
      it(`${difficulty} ${w}x${h}: 全セルがつながった完全迷路（通路数 = セル数 - 1）`, () => {
        const maze = generateMaze(w, h, difficulty, seeded(w * 31 + h));
        expect(maze.width).toBe(w);
        expect(maze.height).toBe(h);
        expect(edgeCount(maze)).toBe(w * h - 1);
        // 全セルに到達できる
        const seen = new Set<number>([0]);
        const queue = [0];
        while (queue.length > 0) {
          const i = queue.shift() as number;
          const next: number[] = [];
          if (maze.open[i] & NORTH) next.push(i - w);
          if (maze.open[i] & SOUTH) next.push(i + w);
          if (maze.open[i] & EAST) next.push(i + 1);
          if (maze.open[i] & WEST) next.push(i - 1);
          for (const n of next) {
            if (!seen.has(n)) {
              seen.add(n);
              queue.push(n);
            }
          }
        }
        expect(seen.size).toBe(w * h);
      });
    }
  }

  for (const difficulty of DIFFICULTIES) {
    it(`${difficulty} 最大サイズ 50x50 でも完全迷路になる`, () => {
      const maze = generateMaze(MAX_SIZE, MAX_SIZE, difficulty, seeded(99));
      expect(maze.open.length).toBe(MAX_SIZE * MAX_SIZE);
      expect(edgeCount(maze)).toBe(MAX_SIZE * MAX_SIZE - 1);
      expect(solveMaze(maze).length).toBeGreaterThan(1);
    });
  }

  it('小数のサイズは四捨五入してから生成される', () => {
    const maze = generateMaze(12.6, 7.2, 'normal', seeded(11));
    expect(maze.width).toBe(13);
    expect(maze.height).toBe(7);
    expect(edgeCount(maze)).toBe(13 * 7 - 1);
  });

  it('乱数関数を省略しても（既定の乱数）正しい迷路になる', () => {
    const maze = generateMaze(8, 8);
    expect(maze.width).toBe(8);
    expect(edgeCount(maze)).toBe(8 * 8 - 1);
  });

  it('同じ乱数列なら同じ迷路になる', () => {
    const a = generateMaze(12, 12, 'normal', seeded(7));
    const b = generateMaze(12, 12, 'normal', seeded(7));
    expect(a).toEqual(b);
  });

  it('範囲外のサイズは丸められる', () => {
    const maze = generateMaze(1, 500, 'easy', seeded(1));
    expect(maze.width).toBe(MIN_SIZE);
    expect(maze.height).toBe(MAX_SIZE);
  });

  it('easy はスタートから下と右だけでゴールに着く', () => {
    const maze = generateMaze(20, 20, 'easy', seeded(3));
    const path = solveMaze(maze);
    for (let i = 1; i < path.length; i++) {
      const diff = path[i] - path[i - 1];
      expect(diff === 1 || diff === 20).toBe(true);
    }
  });
});

describe('solveMaze', () => {
  it('左上から右下までの隣接するセルの並びを返す', () => {
    for (const difficulty of DIFFICULTIES) {
      const maze = generateMaze(18, 14, difficulty, seeded(42));
      const path = solveMaze(maze);
      expect(path[0]).toBe(0);
      expect(path[path.length - 1]).toBe(18 * 14 - 1);
      for (let i = 1; i < path.length; i++) {
        const a = path[i - 1];
        const b = path[i];
        const dir =
          b === a - 18
            ? NORTH
            : b === a + 18
              ? SOUTH
              : b === a + 1
                ? EAST
                : b === a - 1
                  ? WEST
                  : 0;
        expect(dir).not.toBe(0);
        expect(maze.open[a] & dir).toBeTruthy();
      }
      expect(new Set(path).size).toBe(path.length);
    }
  });

  it('つながっていない迷路では空配列を返す', () => {
    const maze: Maze = { width: 5, height: 5, open: new Array(25).fill(0) };
    expect(solveMaze(maze)).toEqual([]);
  });
});

describe('wallSegments', () => {
  it('壁がない迷路は外周から入口と出口を除いた線分を返す', () => {
    const w = 5;
    const h = 5;
    const open = new Array<number>(w * h).fill(0);
    // 全ての内側の壁を取り除く
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        if (x < w - 1) {
          open[y * w + x] |= EAST;
          open[y * w + x + 1] |= WEST;
        }
        if (y < h - 1) {
          open[y * w + x] |= SOUTH;
          open[(y + 1) * w + x] |= NORTH;
        }
      }
    }
    const segments = wallSegments({ width: w, height: h, open });
    // 外周 (5+5+5+5) から入口とゴールの2辺を引く
    expect(segments.length).toBe(18);
    expect(segments).not.toContainEqual([0, 0, 1, 0]);
    expect(segments).not.toContainEqual([4, 5, 5, 5]);
  });

  it('壁の本数は「全ての辺 - 通路 - 入口・出口」と一致する', () => {
    const maze = generateMaze(10, 8, 'normal', seeded(5));
    const totalEdges = 10 * 9 + 8 * 11; // 横線 + 縦線
    const passages = 10 * 8 - 1;
    expect(wallSegments(maze).length).toBe(totalEdges - passages - 2);
  });
});
