import { describe, it, expect } from 'vitest';
import {
  GRID_COLS,
  GRID_ROWS,
  cellIndex,
  coveragePercent,
  createState,
  pointerDown,
  pointerMove,
  pointerUp,
  type PointerInfo,
} from './touch-tester';

const W = 800;
const H = 1200;
const p = (id: number, x: number, y: number): PointerInfo => ({
  id,
  x,
  y,
  pointerType: 'touch',
  pressure: 0.5,
});

describe('cellIndex', () => {
  it('左上・右下のセルを返す', () => {
    expect(cellIndex(0, 0, W, H)).toBe(0);
    expect(cellIndex(W - 1, H - 1, W, H)).toBe(GRID_COLS * GRID_ROWS - 1);
  });
  it('領域外の座標は範囲内に丸める', () => {
    expect(cellIndex(-50, -50, W, H)).toBe(0);
    expect(cellIndex(W + 100, H + 100, W, H)).toBe(GRID_COLS * GRID_ROWS - 1);
  });
  it('サイズが0以下なら0', () => {
    expect(cellIndex(10, 10, 0, 0)).toBe(0);
  });
});

describe('タッチ状態の追跡', () => {
  it('同時押下の最大数と押下回数を数える', () => {
    const s = createState();
    pointerDown(s, p(1, 10, 10), W, H);
    pointerDown(s, p(2, 400, 600), W, H);
    pointerDown(s, p(3, 700, 1100), W, H);
    expect(s.active.size).toBe(3);
    expect(s.maxSimultaneous).toBe(3);
    pointerUp(s, 2);
    pointerUp(s, 3);
    pointerDown(s, p(4, 100, 100), W, H);
    expect(s.active.size).toBe(2);
    expect(s.maxSimultaneous).toBe(3);
    expect(s.totalTouches).toBe(4);
  });

  it('押下中でないポインターの移動は無視する', () => {
    const s = createState();
    pointerMove(s, p(1, 400, 600), W, H);
    expect(s.active.size).toBe(0);
    expect(s.touchedCells.size).toBe(0);
  });

  it('移動すると座標が更新されセルが記録される', () => {
    const s = createState();
    pointerDown(s, p(1, 10, 10), W, H);
    pointerMove(s, p(1, 790, 10), W, H);
    expect(s.active.get(1)?.x).toBe(790);
    expect(s.touchedCells.size).toBe(2);
  });

  it('存在しないidのpointerUpは何もしない', () => {
    const s = createState();
    pointerUp(s, 99);
    expect(s.active.size).toBe(0);
  });

  it('指を離した後の移動は無視する（軌跡・セルを更新しない）', () => {
    const s = createState();
    pointerDown(s, p(1, 10, 10), W, H);
    pointerUp(s, 1);
    const cellsBefore = s.touchedCells.size;
    pointerMove(s, p(1, 790, 1190), W, H);
    expect(s.active.size).toBe(0);
    expect(s.touchedCells.size).toBe(cellsBefore);
  });

  it('同じセルを何度触っても touchedCells は増えない', () => {
    const s = createState();
    pointerDown(s, p(1, 10, 10), W, H);
    pointerUp(s, 1);
    pointerDown(s, p(2, 20, 20), W, H);
    pointerUp(s, 2);
    expect(s.touchedCells.size).toBe(1);
    expect(s.totalTouches).toBe(2);
  });

  it('高さ0の領域ではセル0になり例外を投げない', () => {
    expect(cellIndex(10, 10, W, 0)).toBe(0);
  });
});

describe('coveragePercent', () => {
  it('未タッチは0、全セルで100', () => {
    const s = createState();
    expect(coveragePercent(s)).toBe(0);
    for (let r = 0; r < GRID_ROWS; r++) {
      for (let c = 0; c < GRID_COLS; c++) {
        pointerDown(
          s,
          p(1, ((c + 0.5) / GRID_COLS) * W, ((r + 0.5) / GRID_ROWS) * H),
          W,
          H,
        );
        pointerUp(s, 1);
      }
    }
    expect(coveragePercent(s)).toBe(100);
  });
  it('1セルは96分の1（1.0%）', () => {
    const s = createState();
    pointerDown(s, p(1, 1, 1), W, H);
    expect(coveragePercent(s)).toBe(1);
  });
});
