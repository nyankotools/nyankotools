import { describe, it, expect } from 'vitest';
import {
  DIFFICULTIES,
  LIMITS,
  PRESETS,
  applyResult,
  chord,
  flagCount,
  formatTime,
  getCellView,
  maxMines,
  minesLeft,
  neighbors,
  newGame,
  parseRecords,
  placeMines,
  revealCell,
  serializeRecords,
  toggleFlag,
  validateCustom,
  type GameConfig,
  type GameState,
} from './minesweeper';

// 決定的な疑似乱数（LCG）
function seeded(seed: number) {
  let s = seed;
  return (max: number) => {
    s = (s * 1664525 + 1013904223) % 4294967296;
    return s % max;
  };
}

/** 地雷の位置を直接指定した、開始前（ready）の盤面ではなく進行中の盤面を作る */
function stateWithMines(
  cols: number,
  rows: number,
  mineIndexes: number[],
): GameState {
  const base = newGame({ cols, rows, mines: mineIndexes.length });
  const mines = new Array<boolean>(cols * rows).fill(false);
  for (const i of mineIndexes) mines[i] = true;
  const counts = mines.map((_, i) =>
    neighbors(i, cols, rows).reduce((n, j) => n + (mines[j] ? 1 : 0), 0),
  );
  return { ...base, phase: 'playing', mines, counts };
}

describe('PRESETS / validateCustom', () => {
  it('標準の3難易度', () => {
    expect(PRESETS.beginner).toEqual({ cols: 9, rows: 9, mines: 10 });
    expect(PRESETS.intermediate).toEqual({ cols: 16, rows: 16, mines: 40 });
    expect(PRESETS.expert).toEqual({ cols: 30, rows: 16, mines: 99 });
    for (const d of DIFFICULTIES) {
      const { cols, rows, mines } = PRESETS[d];
      expect(validateCustom(cols, rows, mines).ok).toBe(true);
    }
  });

  it('範囲内なら設定を返す', () => {
    expect(validateCustom(10, 8, 12)).toEqual({
      ok: true,
      config: { cols: 10, rows: 8, mines: 12 },
    });
  });

  it('境界値', () => {
    expect(validateCustom(LIMITS.minCols, LIMITS.minRows, 1).ok).toBe(true);
    expect(validateCustom(LIMITS.maxCols, LIMITS.maxRows, 100).ok).toBe(true);
    expect(validateCustom(LIMITS.minCols - 1, 10, 5)).toEqual({
      ok: false,
      error: 'cols',
    });
    expect(validateCustom(LIMITS.maxCols + 1, 10, 5)).toEqual({
      ok: false,
      error: 'cols',
    });
    expect(validateCustom(10, LIMITS.minRows - 1, 5)).toEqual({
      ok: false,
      error: 'rows',
    });
    expect(validateCustom(10, LIMITS.maxRows + 1, 5)).toEqual({
      ok: false,
      error: 'rows',
    });
  });

  it('地雷数は 1 以上、(マス数 − 9) 以下', () => {
    expect(validateCustom(5, 5, 0)).toEqual({ ok: false, error: 'mines' });
    expect(maxMines(5, 5)).toBe(16);
    expect(validateCustom(5, 5, 16).ok).toBe(true);
    expect(validateCustom(5, 5, 17)).toEqual({ ok: false, error: 'mines' });
  });

  it('整数でない値・NaN は invalid', () => {
    expect(validateCustom(9.5, 9, 10)).toEqual({ ok: false, error: 'invalid' });
    expect(validateCustom(9, 9, NaN)).toEqual({ ok: false, error: 'invalid' });
    expect(validateCustom(Infinity, 9, 10)).toEqual({
      ok: false,
      error: 'invalid',
    });
  });
});

describe('neighbors', () => {
  it('中央は8マス、角は3マス、辺は5マス', () => {
    expect(neighbors(4, 3, 3).sort()).toEqual([0, 1, 2, 3, 5, 6, 7, 8]);
    expect(neighbors(0, 3, 3).sort()).toEqual([1, 3, 4]);
    expect(neighbors(1, 3, 3)).toHaveLength(5);
  });

  it('行をまたいで隣と数えない', () => {
    // 4列の盤面で index 3（右端）の周囲に index 4（次の行の左端）は含まれない
    expect(neighbors(3, 4, 3).sort()).toEqual([2, 6, 7]);
  });
});

describe('placeMines', () => {
  const config: GameConfig = { cols: 9, rows: 9, mines: 10 };

  it('地雷の数が設定どおりで、最初のマスとその周囲に置かない', () => {
    for (let seed = 1; seed <= 20; seed++) {
      const first = (seed * 7) % 81;
      const mines = placeMines(config, first, seeded(seed));
      expect(mines.filter(Boolean)).toHaveLength(10);
      expect(mines[first]).toBe(false);
      for (const n of neighbors(first, 9, 9)) expect(mines[n]).toBe(false);
    }
  });

  it('上限いっぱいの地雷でも最初の周囲を避けられる', () => {
    const full: GameConfig = { cols: 5, rows: 5, mines: maxMines(5, 5) };
    const mines = placeMines(full, 12, seeded(3));
    expect(mines.filter(Boolean)).toHaveLength(16);
    expect(mines[12]).toBe(false);
    for (const n of neighbors(12, 5, 5)) expect(mines[n]).toBe(false);
  });

  it('同じ乱数なら同じ配置になる', () => {
    expect(placeMines(config, 0, seeded(9))).toEqual(
      placeMines(config, 0, seeded(9)),
    );
  });
});

describe('revealCell', () => {
  it('最初の1回で地雷が置かれ、必ず安全に開く', () => {
    for (let seed = 1; seed <= 20; seed++) {
      const first = seed % 81;
      const state = revealCell(newGame(PRESETS.beginner), first, seeded(seed));
      expect(state.mines).not.toBeNull();
      expect(state.phase === 'playing' || state.phase === 'won').toBe(true);
      expect(state.cells[first]).toBe('open');
      expect(state.exploded).toBe(-1);
    }
  });

  it('周囲に地雷のないマスは連鎖して開く', () => {
    // 3×3 の右下角だけが地雷。左上を開くと地雷の隣以外がすべて開く
    const state = revealCell(stateWithMines(3, 3, [8]), 0);
    expect(state.cells.filter((c) => c === 'open')).toHaveLength(8);
    // 8 マスすべて開いたので勝ちとなり、地雷には旗が立つ
    expect(state.phase).toBe('won');
    expect(state.cells[8]).toBe('flag');
  });

  it('数字のマスを開いても連鎖しない', () => {
    const state = revealCell(stateWithMines(3, 3, [8]), 5);
    expect(state.cells[5]).toBe('open');
    expect(state.opened).toBe(1);
    expect(getCellView(state, 5)).toEqual({ kind: 'open', count: 1 });
  });

  it('連鎖は旗の立ったマスを開かない', () => {
    let state = stateWithMines(4, 4, [15]);
    state = toggleFlag(state, 1);
    state = revealCell(state, 0);
    expect(state.cells[1]).toBe('flag');
    expect(state.cells[0]).toBe('open');
  });

  it('地雷を開くと負けになり、爆発したマスを覚える', () => {
    const state = revealCell(stateWithMines(3, 3, [4]), 4);
    expect(state.phase).toBe('lost');
    expect(state.exploded).toBe(4);
    expect(getCellView(state, 4).kind).toBe('exploded');
  });

  it('負けたあとは旗のない地雷と間違った旗が明らかになる', () => {
    let state = stateWithMines(4, 4, [0, 5]);
    state = toggleFlag(state, 5); // 正しい旗
    state = toggleFlag(state, 10); // 間違った旗
    state = revealCell(state, 0);
    expect(state.phase).toBe('lost');
    expect(getCellView(state, 5).kind).toBe('flag');
    expect(getCellView(state, 10).kind).toBe('wrongFlag');
    const other = revealCell(stateWithMines(4, 4, [0, 5]), 5);
    expect(getCellView(other, 0).kind).toBe('mine');
  });

  it('終了後・開封済み・旗・範囲外は何も起きない', () => {
    const lost = revealCell(stateWithMines(3, 3, [4]), 4);
    expect(revealCell(lost, 0)).toBe(lost);
    const playing = stateWithMines(4, 4, [15]);
    const opened = revealCell(playing, 5);
    expect(revealCell(opened, 5)).toBe(opened);
    const flagged = toggleFlag(playing, 0);
    expect(revealCell(flagged, 0)).toBe(flagged);
    expect(revealCell(playing, -1)).toBe(playing);
    expect(revealCell(playing, 16)).toBe(playing);
    expect(revealCell(playing, 1.5)).toBe(playing);
  });

  it('安全なマスをすべて開くと勝ち、残りの地雷に旗が立つ', () => {
    // 2×… ではなく 3×3 で左上の地雷を除く全マスを順に開く
    let state = stateWithMines(3, 3, [0, 8]);
    for (let i = 1; i < 8; i++) state = revealCell(state, i);
    expect(state.phase).toBe('won');
    expect(state.cells[0]).toBe('flag');
    expect(state.cells[8]).toBe('flag');
    expect(minesLeft(state)).toBe(0);
  });
});

describe('toggleFlag', () => {
  it('隠れたマスに旗を立てて外せる', () => {
    let state = stateWithMines(3, 3, [8]);
    state = toggleFlag(state, 2);
    expect(state.cells[2]).toBe('flag');
    expect(flagCount(state)).toBe(1);
    expect(minesLeft(state)).toBe(0);
    state = toggleFlag(state, 2);
    expect(state.cells[2]).toBe('hidden');
  });

  it('開始前（地雷の配置前）でも旗を立てられる', () => {
    const state = toggleFlag(newGame(PRESETS.beginner), 3);
    expect(state.cells[3]).toBe('flag');
    expect(state.phase).toBe('ready');
  });

  it('開いたマス・終了後は変わらない', () => {
    const opened = revealCell(stateWithMines(3, 3, [8]), 5);
    expect(toggleFlag(opened, 5)).toBe(opened);
    const lost = revealCell(stateWithMines(3, 3, [4]), 4);
    expect(toggleFlag(lost, 0)).toBe(lost);
  });

  it('旗を立てすぎると残りの地雷数は負になる', () => {
    let state = stateWithMines(3, 3, [8]);
    state = toggleFlag(toggleFlag(state, 0), 1);
    expect(minesLeft(state)).toBe(-1);
  });
});

describe('chord', () => {
  // 5×5 の中央 (12) の左 (11) に地雷。12 の周囲の地雷数は 1
  const mines = [11];

  it('数字と同じ数の旗があれば、残りの隠れたマスをまとめて開く', () => {
    let state = stateWithMines(5, 5, mines);
    state = revealCell(state, 12);
    state = toggleFlag(state, 11);
    state = chord(state, 12);
    for (const n of neighbors(12, 5, 5)) {
      expect(state.cells[n]).toBe(n === 11 ? 'flag' : 'open');
    }
  });

  it('旗の数が数字と合わなければ何も起きない', () => {
    let state = stateWithMines(5, 5, mines);
    state = revealCell(state, 12);
    expect(chord(state, 12)).toBe(state);
    state = toggleFlag(toggleFlag(state, 11), 13);
    expect(chord(state, 12)).toBe(state);
  });

  it('旗の位置が間違っていると地雷を開いて負ける', () => {
    let state = stateWithMines(5, 5, mines);
    state = revealCell(state, 12);
    state = toggleFlag(state, 13); // 本当の地雷は 11
    state = chord(state, 12);
    expect(state.phase).toBe('lost');
    expect(state.exploded).toBe(11);
  });

  it('隠れたマス・数字 0 のマス・開始前は対象外', () => {
    const state = stateWithMines(5, 5, mines);
    expect(chord(state, 12)).toBe(state);
    const opened = revealCell(state, 0);
    expect(getCellView(opened, 0).count).toBe(0);
    expect(chord(opened, 0)).toBe(opened);
    const ready = newGame(PRESETS.beginner);
    expect(chord(ready, 0)).toBe(ready);
  });
});

describe('ベスト記録', () => {
  it('初回は必ず新記録、速ければ更新、遅ければ据え置き', () => {
    const first = applyResult({}, 'beginner', 30000);
    expect(first).toEqual({ records: { beginner: 30000 }, newBest: true });
    const slower = applyResult(first.records, 'beginner', 40000);
    expect(slower.newBest).toBe(false);
    expect(slower.records).toBe(first.records);
    const same = applyResult(first.records, 'beginner', 30000);
    expect(same.newBest).toBe(false);
    const faster = applyResult(first.records, 'beginner', 25000);
    expect(faster.records.beginner).toBe(25000);
    expect(faster.newBest).toBe(true);
  });

  it('難易度ごとに別々に記録する', () => {
    const a = applyResult({}, 'beginner', 30000);
    const b = applyResult(a.records, 'expert', 200000);
    expect(b.records).toEqual({ beginner: 30000, expert: 200000 });
  });

  it('保存と復元ができる', () => {
    const records = { beginner: 12345, intermediate: 99000 };
    expect(parseRecords(serializeRecords(records))).toEqual(records);
  });

  it('壊れた値・想定外の形は無視する', () => {
    expect(parseRecords(null)).toEqual({});
    expect(parseRecords('')).toEqual({});
    expect(parseRecords('not json')).toEqual({});
    expect(parseRecords('[1,2]')).toEqual({});
    expect(parseRecords('null')).toEqual({});
    expect(
      parseRecords(
        '{"beginner":"fast","intermediate":-5,"expert":0,"custom":100}',
      ),
    ).toEqual({});
    expect(parseRecords('{"beginner":1234.9}')).toEqual({ beginner: 1234 });
  });
});

describe('formatTime', () => {
  it('m:ss.s 形式にする', () => {
    expect(formatTime(0)).toBe('0:00.0');
    expect(formatTime(5300)).toBe('0:05.3');
    expect(formatTime(65300)).toBe('1:05.3');
    expect(formatTime(-10)).toBe('0:00.0');
  });

  it('1時間を超えても分を繰り上げずに表示する', () => {
    expect(formatTime(3600000)).toBe('60:00.0');
    expect(formatTime(3723400)).toBe('62:03.4');
  });
});

describe('大きな盤面（上限 30×24）', () => {
  const big: GameConfig = { cols: 30, rows: 24, mines: maxMines(30, 24) };

  it('上限いっぱいの地雷でも最初の周囲を避けて配置する', () => {
    const mines = placeMines(big, 0, seeded(5));
    expect(mines.filter(Boolean)).toHaveLength(maxMines(30, 24));
    expect(mines[0]).toBe(false);
    for (const n of neighbors(0, 30, 24)) expect(mines[n]).toBe(false);
  });

  it('隅から連鎖で全マスを開いても再帰で壊れず、勝ちになる', () => {
    // 地雷は右下の1マスだけ。左上を開くと0のマスが連鎖して残りを全部開く
    const cols = 30;
    const rows = 24;
    const last = cols * rows - 1;
    const state = revealCell(stateWithMines(cols, rows, [last]), 0);
    expect(state.phase).toBe('won');
    expect(state.opened).toBe(cols * rows - 1);
    expect(state.cells[last]).toBe('flag');
  });
});
