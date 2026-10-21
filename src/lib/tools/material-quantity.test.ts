import { describe, expect, it } from 'vitest';
import {
  calculateArea,
  calculateMaterial,
  ceilSafe,
  sqmToTatami,
  type MaterialInput,
  type RoomInput,
} from './material-quantity';

const room: RoomInput = {
  mode: 'dims',
  width: 4,
  depth: 3,
  height: 2.4,
  area: 0,
  doors: 1,
  doorArea: 1.6,
  windows: 1,
  windowArea: 1.5,
};

describe('ceilSafe', () => {
  it('浮動小数点誤差で繰り上がらない', () => {
    expect(ceilSafe(10.0000000001)).toBe(10);
    expect(ceilSafe(10.01)).toBe(11);
  });
});

describe('calculateArea', () => {
  it('寸法から壁面積を求め、開口部を引く', () => {
    const r = calculateArea(room, 'wall', 10)!;
    // 2*(4+3)*2.4 = 33.6、開口 3.1
    expect(r.grossArea).toBeCloseTo(33.6);
    expect(r.openingArea).toBeCloseTo(3.1);
    expect(r.netArea).toBeCloseTo(30.5);
    expect(r.areaWithLoss).toBeCloseTo(33.55);
    expect(r.tatami).toBeCloseTo(30.5 / 1.62);
  });

  it('床面積は幅×奥行で、開口部を引かない', () => {
    const r = calculateArea(room, 'floor', 0)!;
    expect(r.netArea).toBeCloseTo(12);
    expect(r.openingArea).toBe(0);
  });

  it('面積の直接入力で高さは不要', () => {
    const r = calculateArea(
      { ...room, mode: 'area', area: 20, height: 0 },
      'wall',
      0,
    )!;
    expect(r.netArea).toBeCloseTo(16.9);
  });

  it('不正な入力は null', () => {
    expect(calculateArea({ ...room, width: 0 }, 'wall', 10)).toBeNull();
    expect(calculateArea({ ...room, height: -1 }, 'wall', 10)).toBeNull();
    expect(calculateArea({ ...room, doors: 1.5 }, 'wall', 10)).toBeNull();
    expect(calculateArea({ ...room, windowArea: -1 }, 'wall', 10)).toBeNull();
    expect(calculateArea(room, 'wall', -1)).toBeNull();
    expect(calculateArea(room, 'wall', Number.NaN)).toBeNull();
    expect(
      calculateArea({ ...room, mode: 'area', area: 0 }, 'wall', 0),
    ).toBeNull();
  });

  it('開口部が壁面以上なら null、床なら高さ不要', () => {
    expect(calculateArea({ ...room, doors: 100 }, 'wall', 0)).toBeNull();
    expect(calculateArea({ ...room, height: 0 }, 'floor', 0)).not.toBeNull();
  });
});

describe('calculateMaterial', () => {
  const wallpaper: MaterialInput = {
    room,
    lossPercent: 10,
    material: { kind: 'wallpaper', rollWidthM: 0.93, rollLengthM: 10 },
  };

  it('壁紙のロール数を切り上げて求める', () => {
    const r = calculateMaterial(wallpaper)!;
    if (r.kind !== 'wallpaper') throw new Error('kind');
    expect(r.rollAreaSqm).toBeCloseTo(9.3);
    // 33.55 / 9.3 = 3.607 → 4
    expect(r.rolls).toBe(4);
  });

  it('塗料の必要量と缶数を求める', () => {
    const r = calculateMaterial({
      room,
      lossPercent: 10,
      material: { kind: 'paint', coveragePerL: 6, coats: 2, canLiters: 4 },
    })!;
    if (r.kind !== 'paint') throw new Error('kind');
    // 33.55 * 2 / 6 = 11.18L → 3缶
    expect(r.litersNeeded).toBeCloseTo(11.183, 2);
    expect(r.cans).toBe(3);
    expect(r.litersPurchased).toBe(12);
  });

  it('タイルの枚数と箱数を求める', () => {
    const r = calculateMaterial({
      room,
      lossPercent: 10,
      material: {
        kind: 'tile',
        pieceWidthCm: 30,
        pieceLengthCm: 30,
        piecesPerBox: 11,
      },
    })!;
    if (r.kind !== 'tile') throw new Error('kind');
    expect(r.pieceAreaSqm).toBeCloseTo(0.09);
    // 12 * 1.1 / 0.09 = 146.67 → 147
    expect(r.pieces).toBe(147);
    expect(r.boxes).toBe(14);
  });

  it('ちょうど割り切れる場合は繰り上がらない', () => {
    const r = calculateMaterial({
      room: { ...room, width: 3, depth: 3 },
      lossPercent: 0,
      material: {
        kind: 'tile',
        pieceWidthCm: 50,
        pieceLengthCm: 50,
        piecesPerBox: 4,
      },
    })!;
    if (r.kind !== 'tile') throw new Error('kind');
    expect(r.pieces).toBe(36);
    expect(r.boxes).toBe(9);
  });

  it('素材パラメータが不正なら null', () => {
    expect(
      calculateMaterial({
        ...wallpaper,
        material: { kind: 'wallpaper', rollWidthM: 0, rollLengthM: 10 },
      }),
    ).toBeNull();
    expect(
      calculateMaterial({
        ...wallpaper,
        material: { kind: 'paint', coveragePerL: 6, coats: 0, canLiters: 4 },
      }),
    ).toBeNull();
    expect(
      calculateMaterial({
        ...wallpaper,
        material: {
          kind: 'tile',
          pieceWidthCm: 30,
          pieceLengthCm: 30,
          piecesPerBox: 0,
        },
      }),
    ).toBeNull();
  });
});

describe('sqmToTatami', () => {
  it('1畳=1.62㎡で換算する', () => {
    expect(sqmToTatami(16.2)).toBeCloseTo(10);
  });
});
