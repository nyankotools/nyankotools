import { describe, it, expect } from 'vitest';
import {
  BOARD_SIZES,
  BOARD_SIZE_IDS,
  DEFAULT_SPEED,
  MAX_SPEED,
  MIN_SPEED,
  PATTERNS,
  PATTERN_IDS,
  clampSpeed,
  countAlive,
  createGrid,
  getCell,
  gridWithPattern,
  gridsEqual,
  patternFits,
  patternSize,
  randomGrid,
  setCell,
  stepGrid,
  type Grid,
} from './game-of-life';

/** 生きたセルの座標を "x,y" の昇順で返す */
function aliveCells(grid: Grid): string[] {
  const out: string[] = [];
  for (let y = 0; y < grid.height; y++) {
    for (let x = 0; x < grid.width; x++) {
      if (getCell(grid, x, y)) out.push(`${x},${y}`);
    }
  }
  return out;
}

function fromCoords(width: number, height: number, coords: number[][]): Grid {
  const grid = createGrid(width, height);
  for (const [x, y] of coords) setCell(grid, x, y, true);
  return grid;
}

describe('stepGrid', () => {
  it('空の盤面は空のまま', () => {
    const grid = createGrid(5, 5);
    expect(countAlive(stepGrid(grid, false))).toBe(0);
  });

  it('孤立したセルは過疎で死ぬ', () => {
    const grid = fromCoords(5, 5, [[2, 2]]);
    expect(countAlive(stepGrid(grid, false))).toBe(0);
  });

  it('2×2のブロックは変化しない（静物）', () => {
    const grid = fromCoords(6, 6, [
      [2, 2],
      [3, 2],
      [2, 3],
      [3, 3],
    ]);
    expect(gridsEqual(stepGrid(grid, false), grid)).toBe(true);
  });

  it('ブリンカーは2世代で元に戻る（周期2）', () => {
    const grid = gridWithPattern(7, 7, 'blinker');
    const once = stepGrid(grid, false);
    expect(gridsEqual(once, grid)).toBe(false);
    expect(aliveCells(once)).toEqual(['3,2', '3,3', '3,4']);
    expect(gridsEqual(stepGrid(once, false), grid)).toBe(true);
  });

  it('グライダーは4世代で斜めに1マス移動する', () => {
    const grid = gridWithPattern(20, 20, 'glider');
    let g = grid;
    for (let i = 0; i < 4; i++) g = stepGrid(g, false);
    const shifted = aliveCells(grid).map((key) => {
      const [x, y] = key.split(',').map(Number);
      return `${x + 1},${y + 1}`;
    });
    expect(aliveCells(g).sort()).toEqual(shifted.sort());
  });

  it('元の盤面は変更されない', () => {
    const grid = gridWithPattern(7, 7, 'blinker');
    const before = [...grid.cells];
    stepGrid(grid, true);
    expect([...grid.cells]).toEqual(before);
  });

  it('壁あり: 盤面の外は死んだセルとして扱う', () => {
    // 左端の縦3つ。壁ありでは左側に誕生せず、右側（x=1）にだけ広がる
    const grid = fromCoords(5, 5, [
      [0, 1],
      [0, 2],
      [0, 3],
    ]);
    expect(aliveCells(stepGrid(grid, false))).toEqual(['0,2', '1,2']);
  });

  it('壁なし（ループ）: 端から反対側へつながる', () => {
    const grid = fromCoords(5, 5, [
      [0, 1],
      [0, 2],
      [0, 3],
    ]);
    expect(aliveCells(stepGrid(grid, true)).sort()).toEqual(
      ['0,2', '1,2', '4,2'].sort(),
    );
  });

  it('壁なしでは盤面が小さくても自分自身を隣として二重に数えない', () => {
    // 3×3 のトーラスで中央1つだけ。隣の8マスは全て異なるセルで、どれも生きていない
    const grid = fromCoords(3, 3, [[1, 1]]);
    expect(countAlive(stepGrid(grid, true))).toBe(0);
  });

  it('過密（隣が4つ以上）の生きたセルは死ぬ', () => {
    // 中央 (2,2) の上下左右に生きたセルが4つある十字形
    const grid = fromCoords(5, 5, [
      [2, 2],
      [1, 2],
      [3, 2],
      [2, 1],
      [2, 3],
    ]);
    expect(getCell(stepGrid(grid, false), 2, 2)).toBe(false);
  });

  it('生存は隣が2つか3つのとき、誕生は隣がちょうど3つのときだけ', () => {
    // 隣が3つの生きたセルは生き残る
    const alive3 = fromCoords(3, 3, [
      [1, 1],
      [0, 1],
      [2, 1],
      [1, 0],
    ]);
    expect(getCell(stepGrid(alive3, false), 1, 1)).toBe(true);

    // 死んだセルは隣が2つでは誕生しない
    const dead2 = fromCoords(3, 3, [
      [0, 1],
      [2, 1],
    ]);
    expect(getCell(stepGrid(dead2, false), 1, 1)).toBe(false);

    // 死んだセルは隣が4つでも誕生しない
    const dead4 = fromCoords(3, 3, [
      [0, 0],
      [1, 0],
      [2, 0],
      [0, 1],
    ]);
    expect(getCell(stepGrid(dead4, false), 1, 1)).toBe(false);

    // 死んだセルは隣がちょうど3つなら誕生する
    const dead3 = fromCoords(3, 3, [
      [0, 1],
      [2, 1],
      [1, 0],
    ]);
    expect(getCell(stepGrid(dead3, false), 1, 1)).toBe(true);
  });

  it('縦方向の端もループでつながる（上端の外は下端）', () => {
    // 幅5・高さ5の上端に横3つ。ループなら上の外（下端）にも生まれる
    const grid = fromCoords(5, 5, [
      [1, 0],
      [2, 0],
      [3, 0],
    ]);
    expect(aliveCells(stepGrid(grid, true))).toEqual(['2,0', '2,1', '2,4']);
    expect(aliveCells(stepGrid(grid, false))).toEqual(['2,0', '2,1']);
  });

  it('0×0 の盤面でも例外にならない', () => {
    expect(countAlive(stepGrid(createGrid(0, 0), true))).toBe(0);
    expect(countAlive(stepGrid(createGrid(0, 0), false))).toBe(0);
  });

  it('大きな盤面でも世代を進めた後のセルは0か1だけ', () => {
    let g = randomGrid(200, 150, 0.3);
    for (let i = 0; i < 50; i++) g = stepGrid(g, true);
    expect(g.width).toBe(200);
    expect(g.height).toBe(150);
    expect(g.cells.length).toBe(200 * 150);
    for (const v of g.cells) expect([0, 1]).toContain(v);
  });
});

describe('setCell / getCell', () => {
  it('範囲外・非整数の座標は無視する', () => {
    const grid = createGrid(4, 4);
    expect(setCell(grid, -1, 0, true)).toBe(false);
    expect(setCell(grid, 0, 4, true)).toBe(false);
    expect(setCell(grid, 1.5, 0, true)).toBe(false);
    expect(countAlive(grid)).toBe(0);
    expect(getCell(grid, 99, 99)).toBe(false);
  });

  it('生かす・殺すを切り替えられる', () => {
    const grid = createGrid(4, 4);
    expect(setCell(grid, 1, 2, true)).toBe(true);
    expect(getCell(grid, 1, 2)).toBe(true);
    setCell(grid, 1, 2, false);
    expect(getCell(grid, 1, 2)).toBe(false);
  });
});

describe('randomGrid', () => {
  it('密度0なら全て死、1なら全て生', () => {
    expect(countAlive(randomGrid(10, 10, 0))).toBe(0);
    expect(countAlive(randomGrid(10, 10, 1))).toBe(100);
  });

  it('範囲外の密度は丸められる', () => {
    expect(countAlive(randomGrid(4, 4, -5))).toBe(0);
    expect(countAlive(randomGrid(4, 4, 5))).toBe(16);
  });

  it('乱数関数に従って決まる', () => {
    let i = 0;
    // 0, 999, 0, 999 ... を返す。しきい値 500 なら偶数番目だけ生きる
    const grid = randomGrid(4, 1, 0.5, () => (i++ % 2 === 0 ? 0 : 999));
    expect([...grid.cells]).toEqual([1, 0, 1, 0]);
  });
});

describe('clampSpeed', () => {
  it('範囲内に丸める', () => {
    expect(clampSpeed(0)).toBe(MIN_SPEED);
    expect(clampSpeed(999)).toBe(MAX_SPEED);
    expect(clampSpeed(5.4)).toBe(5);
  });

  it('数値でなければ既定値', () => {
    expect(clampSpeed(NaN)).toBe(DEFAULT_SPEED);
    expect(clampSpeed(Infinity)).toBe(DEFAULT_SPEED);
  });
});

describe('patternFits', () => {
  it('ガンは小さい盤面には収まらず、標準なら収まる', () => {
    expect(patternFits('gosperGun', 30, 20)).toBe(false);
    expect(patternFits('gosperGun', 50, 30)).toBe(true);
    expect(patternFits('glider', 3, 3)).toBe(true);
  });
});

describe('PATTERNS', () => {
  it('全パターンが長方形で、1つ以上の生きたセルを持つ', () => {
    for (const id of PATTERN_IDS) {
      const rows: readonly string[] = PATTERNS[id];
      const width = rows[0].length;
      for (const row of rows) {
        expect(row.length).toBe(width);
        expect(row).toMatch(/^[.O]+$/);
      }
      expect(rows.join('')).toContain('O');
    }
  });

  it('全パターンが標準の盤面に収まる', () => {
    const { width, height } = BOARD_SIZES.medium;
    for (const id of PATTERN_IDS) {
      const size = patternSize(id);
      expect(size.width).toBeLessThanOrEqual(width);
      expect(size.height).toBeLessThanOrEqual(height);
    }
  });

  it('gridWithPattern は中央に置き、セル数がパターンと一致する', () => {
    for (const boardId of BOARD_SIZE_IDS) {
      const { width, height } = BOARD_SIZES[boardId];
      for (const id of PATTERN_IDS) {
        if (!patternFits(id, width, height)) continue;
        const rows: readonly string[] = PATTERNS[id];
        const expected = rows.join('').replace(/\./g, '').length;
        expect(countAlive(gridWithPattern(width, height, id))).toBe(expected);
      }
    }
  });

  it('盤面より大きいパターンははみ出した部分だけ切り捨てられる', () => {
    // 幅20の盤面にはガン（幅36）が入りきらない。例外は出ず、一部だけ残る
    const count = countAlive(gridWithPattern(20, 10, 'gosperGun'));
    expect(count).toBeGreaterThan(0);
    expect(count).toBeLessThan(36);
  });

  it('サイズが違う盤面は等しくない', () => {
    expect(gridsEqual(createGrid(3, 3), createGrid(3, 4))).toBe(false);
    expect(gridsEqual(createGrid(3, 3), createGrid(3, 3))).toBe(true);
  });

  it('パルサーは周期3で元に戻る', () => {
    const grid = gridWithPattern(30, 20, 'pulsar');
    let g = grid;
    for (let i = 0; i < 3; i++) g = stepGrid(g, false);
    expect(gridsEqual(g, grid)).toBe(true);
    expect(gridsEqual(stepGrid(grid, false), grid)).toBe(false);
  });

  it('ガンは30世代ごとにグライダーを1つ放つ（生きたセルが増え続ける）', () => {
    const { width, height } = BOARD_SIZES.medium;
    let g = gridWithPattern(width, height, 'gosperGun');
    const start = countAlive(g);
    for (let i = 0; i < 60; i++) g = stepGrid(g, false);
    expect(countAlive(g)).toBeGreaterThan(start);
  });
});
