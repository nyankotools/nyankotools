import { describe, expect, it } from 'vitest';
import {
  buildExportFileName,
  clampScale,
  colorToHex,
  createGrid,
  drawLine,
  exportDimension,
  floodFill,
  getPixel,
  gridsEqual,
  History,
  isEmpty,
  isExportSizeValid,
  linePoints,
  parseHexColor,
  renderRgba,
  resizeGrid,
  setPixel,
} from './pixel-art-editor';

const RED = parseHexColor('#ff0000')!;
const BLUE = parseHexColor('#0000ff')!;

describe('parseHexColor / colorToHex', () => {
  it('6桁・3桁・#なしを解釈する', () => {
    expect(colorToHex(parseHexColor('#FF8800')!)).toBe('#ff8800');
    expect(colorToHex(parseHexColor('#f80')!)).toBe('#ff8800');
    expect(colorToHex(parseHexColor('00ff00')!)).toBe('#00ff00');
  });
  it('不正な値は null、透明は空文字', () => {
    expect(parseHexColor('#12')).toBeNull();
    expect(parseHexColor('zzzzzz')).toBeNull();
    expect(colorToHex(0)).toBe('');
  });
  it('黒も透明(0)と区別される', () => {
    expect(parseHexColor('#000000')).not.toBe(0);
  });
});

describe('setPixel / getPixel', () => {
  it('範囲内に描け、変更有無を返す', () => {
    const g = createGrid(4);
    expect(setPixel(g, 1, 2, RED)).toBe(true);
    expect(getPixel(g, 1, 2)).toBe(RED);
    expect(setPixel(g, 1, 2, RED)).toBe(false);
  });
  it('範囲外・非整数は無視する', () => {
    const g = createGrid(4);
    expect(setPixel(g, -1, 0, RED)).toBe(false);
    expect(setPixel(g, 4, 0, RED)).toBe(false);
    expect(setPixel(g, 0.5, 0, RED)).toBe(false);
    expect(isEmpty(g)).toBe(true);
    expect(getPixel(g, 9, 9)).toBe(0);
  });
  it('消しゴム(0)で透明に戻せる', () => {
    const g = createGrid(4);
    setPixel(g, 0, 0, RED);
    setPixel(g, 0, 0, 0);
    expect(isEmpty(g)).toBe(true);
  });
});

describe('linePoints / drawLine', () => {
  it('同一点は1点', () => {
    expect(linePoints(2, 2, 2, 2)).toEqual([[2, 2]]);
  });
  it('水平・斜め・逆方向を端点込みで返す', () => {
    expect(linePoints(0, 0, 3, 0)).toHaveLength(4);
    expect(linePoints(0, 0, 3, 3)).toEqual([
      [0, 0],
      [1, 1],
      [2, 2],
      [3, 3],
    ]);
    expect(linePoints(3, 0, 0, 0)[0]).toEqual([3, 0]);
  });
  it('隙間なく連続している', () => {
    const pts = linePoints(0, 0, 7, 3);
    for (let i = 1; i < pts.length; i++) {
      expect(Math.abs(pts[i][0] - pts[i - 1][0])).toBeLessThanOrEqual(1);
      expect(Math.abs(pts[i][1] - pts[i - 1][1])).toBeLessThanOrEqual(1);
    }
  });
  it('範囲外にはみ出しても例外にならない', () => {
    const g = createGrid(4);
    expect(drawLine(g, -3, 1, 8, 1, RED)).toBe(true);
    expect(getPixel(g, 0, 1)).toBe(RED);
    expect(getPixel(g, 3, 1)).toBe(RED);
  });
});

describe('floodFill', () => {
  it('同色領域を塗り、境界で止まる', () => {
    const g = createGrid(4);
    for (let y = 0; y < 4; y++) setPixel(g, 2, y, BLUE);
    expect(floodFill(g, 0, 0, RED)).toBe(true);
    expect(getPixel(g, 1, 3)).toBe(RED);
    expect(getPixel(g, 2, 0)).toBe(BLUE);
    expect(getPixel(g, 3, 0)).toBe(0);
  });
  it('斜めには漏れない（4近傍）', () => {
    const g = createGrid(3);
    setPixel(g, 1, 0, BLUE);
    setPixel(g, 0, 1, BLUE);
    floodFill(g, 0, 0, RED);
    expect(getPixel(g, 0, 0)).toBe(RED);
    expect(getPixel(g, 1, 1)).toBe(0);
  });
  it('同じ色・範囲外は何もしない', () => {
    const g = createGrid(3);
    expect(floodFill(g, 0, 0, 0)).toBe(false);
    expect(floodFill(g, 5, 5, RED)).toBe(false);
  });
  it('64x64の全面塗りも完了する', () => {
    const g = createGrid(64);
    floodFill(g, 10, 10, RED);
    expect(g.cells.every((c) => c === RED)).toBe(true);
  });
});

describe('resizeGrid', () => {
  it('拡大で左上を維持する', () => {
    const g = createGrid(2);
    setPixel(g, 1, 1, RED);
    const r = resizeGrid(g, 4);
    expect(r.size).toBe(4);
    expect(getPixel(r, 1, 1)).toBe(RED);
    expect(getPixel(r, 3, 3)).toBe(0);
  });
  it('縮小ではみ出しを切り捨てる', () => {
    const g = createGrid(4);
    setPixel(g, 0, 0, RED);
    setPixel(g, 3, 3, BLUE);
    const r = resizeGrid(g, 2);
    expect(getPixel(r, 0, 0)).toBe(RED);
    expect(r.cells).toHaveLength(4);
  });
});

describe('書き出し', () => {
  it('寸法と上限の判定', () => {
    expect(exportDimension(16, 8)).toBe(128);
    expect(isExportSizeValid(64, 64)).toBe(true);
    expect(isExportSizeValid(64, 65)).toBe(false);
    expect(isExportSizeValid(16, 0)).toBe(false);
    expect(isExportSizeValid(16, 1.5)).toBe(false);
  });
  it('clampScale は上限と最小に収める', () => {
    expect(clampScale(64, 100)).toBe(64);
    expect(clampScale(16, 0)).toBe(1);
    expect(clampScale(16, 3.9)).toBe(3);
    expect(clampScale(16, Number.NaN)).toBe(1);
  });
  it('renderRgba は拡大して透明を保つ', () => {
    const g = createGrid(2);
    setPixel(g, 0, 0, RED);
    const data = renderRgba(g, 2);
    expect(data).toHaveLength(4 * 4 * 4);
    // (1,1) は赤の2x2ブロック内
    const o = (1 * 4 + 1) * 4;
    expect([data[o], data[o + 1], data[o + 2], data[o + 3]]).toEqual([
      255, 0, 0, 255,
    ]);
    // (2,0) は透明
    expect(data[(0 * 4 + 2) * 4 + 3]).toBe(0);
  });
  it('ファイル名', () => {
    expect(buildExportFileName(16, 8)).toBe('pixel-art-16x16-x8.png');
    expect(buildExportFileName(32, 1)).toBe('pixel-art-32x32.png');
  });
});

describe('History', () => {
  it('Undo/Redo が往復できる', () => {
    const h = new History();
    let g = createGrid(2);
    h.push(g);
    setPixel(g, 0, 0, RED);
    expect(h.canUndo()).toBe(true);
    const prev = h.undo(g)!;
    expect(isEmpty(prev)).toBe(true);
    expect(h.canRedo()).toBe(true);
    g = h.redo(prev)!;
    expect(getPixel(g, 0, 0)).toBe(RED);
  });
  it('履歴が空なら null', () => {
    const h = new History();
    const g = createGrid(2);
    expect(h.undo(g)).toBeNull();
    expect(h.redo(g)).toBeNull();
  });
  it('新しい操作でRedoが破棄される', () => {
    const h = new History();
    const g = createGrid(2);
    h.push(g);
    h.undo(g);
    expect(h.canRedo()).toBe(true);
    h.push(g);
    expect(h.canRedo()).toBe(false);
  });
  it('上限を超えた古い履歴は捨てる', () => {
    const h = new History(3);
    const g = createGrid(2);
    for (let i = 0; i < 5; i++) h.push(g);
    let n = 0;
    while (h.undo(g)) n++;
    expect(n).toBe(3);
  });
  it('push は参照ではなくコピーを保存する', () => {
    const h = new History();
    const g = createGrid(2);
    h.push(g);
    setPixel(g, 0, 0, RED);
    const prev = h.undo(g)!;
    expect(gridsEqual(prev, createGrid(2))).toBe(true);
  });
});
