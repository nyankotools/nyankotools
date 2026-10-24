import { describe, expect, it } from 'vitest';
import {
  canvasSize,
  cellRects,
  collageFileName,
  coverPlacement,
  hitCell,
  isCanvasWithinLimit,
  moveItem,
  panPosition,
  templatesFor,
} from './photo-collage-maker';

describe('templatesFor', () => {
  it('2〜9枚のどの枚数でも、枠の数が枚数と一致する', () => {
    for (let n = 2; n <= 9; n++) {
      const templates = templatesFor(n);
      expect(templates.length).toBeGreaterThanOrEqual(3);
      for (const t of templates) expect(t.cells).toHaveLength(n);
    }
  });

  it('枠はキャンバス内に収まり、面積の合計が1になる（すき間・重なりなし）', () => {
    for (let n = 2; n <= 9; n++) {
      for (const t of templatesFor(n)) {
        let area = 0;
        for (const c of t.cells) {
          expect(c.x).toBeGreaterThanOrEqual(0);
          expect(c.y).toBeGreaterThanOrEqual(0);
          expect(c.x + c.width).toBeLessThanOrEqual(1 + 1e-9);
          expect(c.y + c.height).toBeLessThanOrEqual(1 + 1e-9);
          area += c.width * c.height;
        }
        expect(area).toBeCloseTo(1, 6);
      }
    }
  });

  it('同じ配置になるテンプレートは重複しない', () => {
    // 2枚では「グリッド」は「横並び」と同じになる
    const kinds = templatesFor(2).map((t) => t.kind);
    expect(kinds).toEqual(['row', 'column', 'main-left', 'main-top']);
    const ids = templatesFor(5).map((t) => t.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('奇数枚のグリッドは最後の行を横に広げる', () => {
    const grid = templatesFor(3).find((t) => t.kind === 'grid')!;
    expect(grid.cells[2]).toEqual({ x: 0, y: 0.5, width: 1, height: 0.5 });
  });

  it('1枚と範囲外の枚数も安全に扱う', () => {
    expect(templatesFor(1)[0].cells).toHaveLength(1);
    expect(templatesFor(0)[0].cells).toHaveLength(1);
    expect(templatesFor(99)[0].cells).toHaveLength(9);
  });
});

describe('canvasSize', () => {
  it('長辺をそろえる', () => {
    expect(canvasSize('1:1', 1200)).toEqual({ width: 1200, height: 1200 });
    expect(canvasSize('4:3', 1200)).toEqual({ width: 1200, height: 900 });
    expect(canvasSize('3:4', 1200)).toEqual({ width: 900, height: 1200 });
    expect(canvasSize('16:9', 1920)).toEqual({ width: 1920, height: 1080 });
    expect(canvasSize('9:16', 1920)).toEqual({ width: 1080, height: 1920 });
  });
});

describe('cellRects', () => {
  const canvas = { width: 1000, height: 1000 };
  const row = templatesFor(2)[0].cells;

  it('間隔・余白なしでは枠がキャンバスを分け合う', () => {
    expect(cellRects(row, canvas, 0, 0)).toEqual([
      { x: 0, y: 0, width: 500, height: 1000 },
      { x: 500, y: 0, width: 500, height: 1000 },
    ]);
  });

  it('間隔は枠どうしの境目にだけ入り、端には入らない', () => {
    expect(cellRects(row, canvas, 0, 10)).toEqual([
      { x: 0, y: 0, width: 495, height: 1000 },
      { x: 505, y: 0, width: 495, height: 1000 },
    ]);
  });

  it('余白は外周に入る', () => {
    const [a, b] = cellRects(row, canvas, 20, 0);
    expect(a).toEqual({ x: 20, y: 20, width: 480, height: 960 });
    expect(b.x + b.width).toBe(980);
  });

  it('範囲外・非数の値でも幅と高さは1以上', () => {
    for (const r of cellRects(row, { width: 10, height: 10 }, 9999, 9999)) {
      expect(r.width).toBeGreaterThanOrEqual(1);
      expect(r.height).toBeGreaterThanOrEqual(1);
    }
    const nan = cellRects(row, canvas, NaN, NaN);
    expect(nan[0].x).toBe(0);
  });
});

describe('coverPlacement', () => {
  const cell = { x: 100, y: 50, width: 200, height: 200 };

  it('横長の画像は高さを合わせ、横方向に動かせる', () => {
    const p = coverPlacement({ width: 400, height: 200 }, cell, 1, 0.5, 0.5);
    expect(p.height).toBe(200);
    expect(p.width).toBe(400);
    expect(p.slackX).toBe(200);
    expect(p.slackY).toBe(0);
    expect(p.x).toBe(0);
    expect(p.y).toBe(50);
  });

  it('位置 0 は左端、1 は右端が枠に揃う', () => {
    const left = coverPlacement({ width: 400, height: 200 }, cell, 1, 0, 0);
    const right = coverPlacement({ width: 400, height: 200 }, cell, 1, 1, 0);
    expect(left.x).toBe(cell.x);
    expect(right.x + right.width).toBe(cell.x + cell.width);
  });

  it('拡大すると動かせる量が増え、範囲外の値は丸められる', () => {
    const p = coverPlacement({ width: 200, height: 200 }, cell, 2, 9, -3);
    expect(p.width).toBe(400);
    expect(p.slackX).toBe(200);
    expect(p.x).toBe(cell.x - 200);
    expect(p.y).toBe(cell.y);
    const small = coverPlacement({ width: 200, height: 200 }, cell, 0.1, 0, 0);
    expect(small.width).toBe(200);
  });
});

describe('panPosition', () => {
  it('右へドラッグすると画像が右へ動く（位置は小さくなる）', () => {
    expect(panPosition(0.5, 50, 200)).toBeCloseTo(0.25);
    expect(panPosition(0.5, -50, 200)).toBeCloseTo(0.75);
  });
  it('0〜1に収め、動かせないときは中央', () => {
    expect(panPosition(0.1, 1000, 200)).toBe(0);
    expect(panPosition(0.9, -1000, 200)).toBe(1);
    expect(panPosition(0.2, 10, 0)).toBe(0.5);
  });
});

describe('hitCell', () => {
  const cells = [
    { x: 0, y: 0, width: 10, height: 10 },
    { x: 10, y: 0, width: 10, height: 10 },
  ];
  it('点の入っている枠を返す', () => {
    expect(hitCell(cells, 5, 5)).toBe(0);
    expect(hitCell(cells, 10, 5)).toBe(1);
    expect(hitCell(cells, 25, 5)).toBe(-1);
  });
});

describe('その他', () => {
  it('moveItem は範囲外では並びを変えない', () => {
    expect(moveItem([1, 2, 3], 0, 2)).toEqual([2, 3, 1]);
    expect(moveItem([1, 2, 3], 0, 3)).toEqual([1, 2, 3]);
  });
  it('出力サイズの上限', () => {
    expect(isCanvasWithinLimit({ width: 3000, height: 3000 })).toBe(true);
    expect(isCanvasWithinLimit({ width: 0, height: 10 })).toBe(false);
  });
  it('ファイル名', () => {
    expect(collageFileName('png')).toBe('collage.png');
    expect(collageFileName('jpeg')).toBe('collage.jpg');
    expect(collageFileName('webp')).toBe('collage.webp');
  });
});
