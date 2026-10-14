import { describe, expect, it } from 'vitest';
import {
  clampRadiusPercent,
  clampSquare,
  defaultSquare,
  insideShape,
  outputSize,
  roundFileName,
  roundFormat,
  shapeGeometry,
  squareAround,
} from './image-round-crop';

describe('defaultSquare', () => {
  it('横長の画像では中央の最大正方形になる', () => {
    expect(defaultSquare({ width: 400, height: 200 })).toEqual({
      x: 100,
      y: 0,
      size: 200,
    });
  });
  it('縦長の画像では中央の最大正方形になる', () => {
    expect(defaultSquare({ width: 100, height: 300 })).toEqual({
      x: 0,
      y: 100,
      size: 100,
    });
  });
});

describe('clampSquare', () => {
  const b = { width: 100, height: 60 };
  it('画像の外にはみ出さない', () => {
    expect(clampSquare({ x: 90, y: 50, size: 30 }, b)).toEqual({
      x: 70,
      y: 30,
      size: 30,
    });
  });
  it('1辺は短辺以下・1px以上に収まる', () => {
    expect(clampSquare({ x: 0, y: 0, size: 500 }, b).size).toBe(60);
    expect(clampSquare({ x: 0, y: 0, size: 0 }, b).size).toBe(1);
  });
  it('NaNや負の座標を0にする', () => {
    expect(clampSquare({ x: NaN, y: -5, size: 10 }, b)).toEqual({
      x: 0,
      y: 0,
      size: 10,
    });
  });
});

describe('squareAround', () => {
  it('中心の周りに置き、端では内側へ寄せる', () => {
    const b = { width: 100, height: 100 };
    expect(squareAround({ x: 50, y: 50 }, 20, b)).toEqual({
      x: 40,
      y: 40,
      size: 20,
    });
    expect(squareAround({ x: 0, y: 100 }, 20, b)).toEqual({
      x: 0,
      y: 80,
      size: 20,
    });
  });
});

describe('shapeGeometry', () => {
  it('円は楕円', () => {
    expect(shapeGeometry('circle', { width: 10, height: 10 }, 0)).toEqual({
      kind: 'ellipse',
    });
  });
  it('角丸は短辺の半分に割合を掛けた半径', () => {
    expect(shapeGeometry('rounded', { width: 200, height: 100 }, 40)).toEqual({
      kind: 'rect',
      radius: 20,
    });
    expect(shapeGeometry('rounded', { width: 100, height: 100 }, 100)).toEqual({
      kind: 'rect',
      radius: 50,
    });
  });
  it('割合は0〜100に丸める', () => {
    expect(clampRadiusPercent(-5)).toBe(0);
    expect(clampRadiusPercent(250)).toBe(100);
    expect(clampRadiusPercent(NaN)).toBe(0);
  });
});

describe('outputSize', () => {
  it('0や非数は原寸', () => {
    expect(outputSize({ width: 300, height: 200 }, 0)).toEqual({
      width: 300,
      height: 200,
    });
    expect(outputSize({ width: 300, height: 200 }, NaN)).toEqual({
      width: 300,
      height: 200,
    });
  });
  it('長辺を基準に縦横比を保って縮める', () => {
    expect(outputSize({ width: 300, height: 200 }, 150)).toEqual({
      width: 150,
      height: 100,
    });
  });
  it('拡大はしない', () => {
    expect(outputSize({ width: 100, height: 100 }, 512)).toEqual({
      width: 100,
      height: 100,
    });
  });
  it('極端な縦横比でも最小1px', () => {
    expect(outputSize({ width: 1000, height: 2 }, 10).height).toBe(1);
  });
});

describe('insideShape', () => {
  const size = { width: 100, height: 100 };
  it('円: 中心は内側、角は外側', () => {
    const g = shapeGeometry('circle', size, 0);
    expect(insideShape(50, 50, size, g)).toBe(true);
    expect(insideShape(1, 1, size, g)).toBe(false);
    expect(insideShape(50, 1, size, g)).toBe(true);
  });
  it('角丸: 半径0なら角も内側、半径があれば角は外側', () => {
    expect(insideShape(1, 1, size, shapeGeometry('rounded', size, 0))).toBe(
      true,
    );
    expect(insideShape(1, 1, size, shapeGeometry('rounded', size, 50))).toBe(
      false,
    );
    expect(insideShape(50, 1, size, shapeGeometry('rounded', size, 50))).toBe(
      true,
    );
  });
  it('範囲外は外側', () => {
    expect(insideShape(-1, 50, size, { kind: 'rect', radius: 0 })).toBe(false);
  });
});

describe('roundFileName / roundFormat', () => {
  it('拡張子を置き換えて -round を付ける', () => {
    expect(roundFileName('me.photo.jpg', 'png')).toBe('me.photo-round.png');
    expect(roundFileName('a', 'webp')).toBe('a-round.webp');
  });
  it('名前が無ければ image', () => {
    expect(roundFileName(null, 'png')).toBe('image-round.png');
    expect(roundFileName('.png', 'png')).toBe('image-round.png');
  });
  it('MIME', () => {
    expect(roundFormat('webp').mime).toBe('image/webp');
  });
});
