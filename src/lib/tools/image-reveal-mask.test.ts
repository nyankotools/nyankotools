import { describe, it, expect } from 'vitest';
import {
  buildOutputFileName,
  changeShapeKind,
  clampOpacity,
  createShape,
  duplicateShape,
  findHandleAt,
  findShapeAt,
  fitWithin,
  getHandlePositions,
  hitTestShape,
  moveShape,
  pointInPolygon,
  resizeShape,
  rotateShape,
  SHAPE_KINDS,
  shapePolygon,
  shapeWorldPolygon,
  toLocal,
  type Shape,
} from './image-reveal-mask';

const image = { width: 400, height: 300 };

function shape(partial: Partial<Shape> = {}): Shape {
  return {
    id: 1,
    kind: 'rect',
    cx: 200,
    cy: 150,
    width: 100,
    height: 60,
    rotation: 0,
    ...partial,
  };
}

describe('shapePolygon', () => {
  it('全種類が3点以上の多角形で、境界ボックス内に収まる', () => {
    for (const kind of SHAPE_KINDS) {
      const poly = shapePolygon(kind, 100, 60);
      expect(poly.length).toBeGreaterThanOrEqual(3);
      for (const p of poly) {
        expect(Math.abs(p.x)).toBeLessThanOrEqual(50.001);
        expect(Math.abs(p.y)).toBeLessThanOrEqual(30.001);
      }
    }
  });

  it('ハートは中心付近を含み、四隅は含まない', () => {
    const poly = shapePolygon('heart', 100, 100);
    expect(pointInPolygon({ x: 0, y: 0 }, poly)).toBe(true);
    expect(pointInPolygon({ x: 48, y: -48 }, poly)).toBe(false);
  });
});

describe('当たり判定', () => {
  it('回転した図形の内外を判定する', () => {
    const s = shape({ width: 100, height: 20, rotation: 90 });
    expect(hitTestShape(s, { x: 200, y: 190 })).toBe(true);
    expect(hitTestShape(s, { x: 240, y: 150 })).toBe(false);
  });

  it('findShapeAt は手前(後ろの要素)を優先する', () => {
    const a = shape({ id: 1 });
    const b = shape({ id: 2 });
    expect(findShapeAt([a, b], { x: 200, y: 150 })).toBe(2);
    expect(findShapeAt([a, b], { x: 0, y: 0 })).toBeNull();
  });

  it('toLocal は回転を打ち消す', () => {
    const s = shape({ rotation: 90 });
    const p = toLocal(s, { x: 200, y: 200 });
    expect(p.x).toBeCloseTo(50);
    expect(p.y).toBeCloseTo(0);
  });
});

describe('ハンドル', () => {
  it('回転ハンドルは上端の外側にある', () => {
    const pos = getHandlePositions(shape(), 20);
    expect(pos.rotate.x).toBeCloseTo(200);
    expect(pos.rotate.y).toBeCloseTo(150 - 30 - 20);
  });

  it('近い位置のハンドルを返す', () => {
    const s = shape();
    expect(findHandleAt(s, { x: 150, y: 120 }, 8, 20)).toBe('nw');
    expect(findHandleAt(s, { x: 200, y: 100 }, 8, 20)).toBe('rotate');
    expect(findHandleAt(s, { x: 200, y: 150 }, 8, 20)).toBeNull();
  });
});

describe('変形', () => {
  it('resizeShape は中心固定で縦横を決め、最小サイズを守る', () => {
    const r = resizeShape(shape(), { x: 260, y: 200 }, image);
    expect(r.width).toBeCloseTo(120);
    expect(r.height).toBeCloseTo(100);
    const tiny = resizeShape(shape(), { x: 201, y: 151 }, image);
    expect(tiny.width).toBe(16);
    expect(tiny.height).toBe(16);
  });

  it('円は縦横を揃える', () => {
    const r = resizeShape(shape({ kind: 'circle' }), { x: 260, y: 160 }, image);
    expect(r.width).toBe(r.height);
    expect(r.width).toBeCloseTo(120);
  });

  it('changeShapeKind は円にすると正方形になる', () => {
    const r = changeShapeKind(shape(), 'circle');
    expect(r.width).toBe(100);
    expect(r.height).toBe(100);
  });

  it('rotateShape は真上で0度、真右で90度、15度刻みにスナップできる', () => {
    expect(rotateShape(shape(), { x: 200, y: 50 }).rotation).toBeCloseTo(0);
    expect(rotateShape(shape(), { x: 300, y: 150 }).rotation).toBeCloseTo(90);
    expect(rotateShape(shape(), { x: 300, y: 130 }, true).rotation % 15).toBe(
      0,
    );
  });

  it('moveShape は中心を画像内に丸める', () => {
    const r = moveShape(shape(), -50, 999, image);
    expect(r.cx).toBe(0);
    expect(r.cy).toBe(300);
  });

  it('duplicateShape は別IDでずらして複製する', () => {
    const d = duplicateShape(shape(), 5, image);
    expect(d.id).toBe(5);
    expect(d.cx).toBeGreaterThan(200);
    expect(d.kind).toBe('rect');
  });
});

describe('createShape / fitWithin / clampOpacity', () => {
  it('createShape は画像の中央付近に作る', () => {
    const s = createShape(3, 'star', image);
    expect(s.cx).toBe(200);
    expect(s.cy).toBe(150);
    expect(s.width).toBeGreaterThan(0);
    expect(shapeWorldPolygon(s).length).toBe(10);
  });

  it('fitWithin は長辺が上限を超える場合のみ縮小する', () => {
    expect(fitWithin(1000, 500, 4096)).toEqual({ width: 1000, height: 500 });
    expect(fitWithin(8000, 4000, 4000)).toEqual({ width: 4000, height: 2000 });
  });

  it('clampOpacity は0〜100に丸める', () => {
    expect(clampOpacity(150)).toBe(100);
    expect(clampOpacity(-5)).toBe(0);
    expect(clampOpacity(NaN)).toBe(100);
    expect(clampOpacity(40.4)).toBe(40);
  });

  it('createShape は連続追加で少しずつずらし、画像外に出さない', () => {
    const a = createShape(1, 'rect', image, 0);
    const b = createShape(2, 'rect', image, 1);
    expect(b.cx).toBeGreaterThan(a.cx);
    const edge = createShape(3, 'rect', { width: 10, height: 10 }, 4);
    expect(edge.cx).toBeLessThanOrEqual(10);
    expect(edge.cy).toBeLessThanOrEqual(10);
    expect(edge.width).toBeGreaterThanOrEqual(16);
  });

  it('fitWithin は極端に小さい辺も1px未満にしない', () => {
    expect(fitWithin(10000, 1, 4096)).toEqual({ width: 4096, height: 1 });
  });
});

describe('出力ファイル名', () => {
  it('元の拡張子を外し、形式ごとの拡張子を付ける', () => {
    expect(buildOutputFileName('photo.jpg', 'png')).toBe('photo-reveal.png');
    expect(buildOutputFileName('photo.jpg', 'jpeg')).toBe('photo-reveal.jpg');
    expect(buildOutputFileName('photo.jpeg', 'webp')).toBe('photo-reveal.webp');
  });

  it('拡張子が無い・ドットを含む名前でも壊れない', () => {
    expect(buildOutputFileName('photo', 'png')).toBe('photo-reveal.png');
    expect(buildOutputFileName('my.photo.v2.png', 'png')).toBe(
      'my.photo.v2-reveal.png',
    );
    expect(buildOutputFileName('', 'png')).toBe('image-reveal.png');
  });

  it('日本語のファイル名もそのまま使う', () => {
    expect(buildOutputFileName('猫の写真.png', 'webp')).toBe(
      '猫の写真-reveal.webp',
    );
  });
});

describe('星・ハートの外接矩形', () => {
  it('星は指定サイズの外接矩形にぴったり収まる', () => {
    const poly = shapePolygon('star', 120, 80);
    const xs = poly.map((p) => p.x);
    const ys = poly.map((p) => p.y);
    expect(Math.max(...xs) - Math.min(...xs)).toBeCloseTo(120);
    expect(Math.max(...ys) - Math.min(...ys)).toBeCloseTo(80);
  });

  it('ハートは指定サイズの外接矩形にぴったり収まる', () => {
    const poly = shapePolygon('heart', 120, 80);
    const xs = poly.map((p) => p.x);
    const ys = poly.map((p) => p.y);
    expect(Math.max(...xs) - Math.min(...xs)).toBeCloseTo(120);
    expect(Math.max(...ys) - Math.min(...ys)).toBeCloseTo(80);
  });
});
