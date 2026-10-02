import { describe, it, expect } from 'vitest';
import {
  clampRect,
  croppedFileName,
  fitAspect,
  fullRect,
  isWithinSourceLimit,
  parseAspect,
  rectFromDrag,
  rotateBy,
  rotatedSize,
} from './image-cropper';

const bounds = { width: 200, height: 100 };

describe('rotatedSize / rotateBy', () => {
  it('90°・270°で縦横が入れ替わる', () => {
    expect(rotatedSize(bounds, 0)).toEqual({ width: 200, height: 100 });
    expect(rotatedSize(bounds, 90)).toEqual({ width: 100, height: 200 });
    expect(rotatedSize(bounds, 180)).toEqual({ width: 200, height: 100 });
    expect(rotatedSize(bounds, 270)).toEqual({ width: 100, height: 200 });
  });

  it('回転は0〜270で循環する', () => {
    expect(rotateBy(270, 90)).toBe(0);
    expect(rotateBy(0, -90)).toBe(270);
    expect(rotateBy(90, 90)).toBe(180);
  });
});

describe('clampRect', () => {
  it('範囲を画像内に収め、整数にそろえる', () => {
    expect(
      clampRect({ x: -5, y: 10.4, width: 500, height: 500 }, bounds),
    ).toEqual({ x: 0, y: 10, width: 200, height: 90 });
  });

  it('幅・高さは最小1px、起点は画像内に収まる', () => {
    expect(clampRect({ x: 999, y: 999, width: 0, height: -3 }, bounds)).toEqual(
      {
        x: 199,
        y: 99,
        width: 1,
        height: 1,
      },
    );
  });

  it('NaNは0として扱う', () => {
    expect(
      clampRect({ x: NaN, y: NaN, width: NaN, height: NaN }, bounds),
    ).toEqual({ x: 0, y: 0, width: 1, height: 1 });
  });
});

describe('parseAspect', () => {
  it('比率文字列を数値にする', () => {
    expect(parseAspect('16:9')).toBeCloseTo(16 / 9);
    expect(parseAspect('1:1')).toBe(1);
    expect(parseAspect('4/3')).toBeCloseTo(4 / 3);
    expect(parseAspect('1.5')).toBe(1.5);
  });

  it('free・不正値・0 は null', () => {
    expect(parseAspect('free')).toBeNull();
    expect(parseAspect('')).toBeNull();
    expect(parseAspect('0:5')).toBeNull();
  });
});

describe('fitAspect', () => {
  it('幅を基準に高さを合わせる', () => {
    expect(fitAspect({ x: 0, y: 0, width: 80, height: 10 }, 2, bounds)).toEqual(
      {
        x: 0,
        y: 0,
        width: 80,
        height: 40,
      },
    );
  });

  it('画像からはみ出す場合は縮める', () => {
    const r = fitAspect({ x: 0, y: 50, width: 200, height: 10 }, 1, bounds);
    expect(r.height).toBe(50);
    expect(r.width).toBe(50);
  });
});

describe('rectFromDrag', () => {
  it('右下へのドラッグで始点が左上になる', () => {
    expect(
      rectFromDrag({ x: 10, y: 10 }, { x: 60, y: 40 }, bounds, null),
    ).toEqual({ x: 10, y: 10, width: 50, height: 30 });
  });

  it('左上へのドラッグでも正しい矩形になる', () => {
    expect(
      rectFromDrag({ x: 60, y: 40 }, { x: 10, y: 10 }, bounds, null),
    ).toEqual({ x: 10, y: 10, width: 50, height: 30 });
  });

  it('画像の外までドラッグしても内側に収まる', () => {
    const r = rectFromDrag({ x: 150, y: 50 }, { x: 999, y: 999 }, bounds, null);
    expect(r).toEqual({ x: 150, y: 50, width: 50, height: 50 });
  });

  it('比率を指定すると縦横比が保たれる', () => {
    const r = rectFromDrag({ x: 0, y: 0 }, { x: 100, y: 90 }, bounds, 2);
    expect(r.width / r.height).toBeCloseTo(2, 1);
    expect(r.width).toBe(100);
    expect(r.height).toBe(50);
  });

  it('比率指定で画像端に届く場合も比率を保って収まる', () => {
    const r = rectFromDrag({ x: 100, y: 0 }, { x: 999, y: 999 }, bounds, 1);
    expect(r.x + r.width).toBeLessThanOrEqual(200);
    expect(r.y + r.height).toBeLessThanOrEqual(100);
    expect(r.width).toBe(r.height);
  });
});

describe('fullRect / isWithinSourceLimit / croppedFileName', () => {
  it('fullRect は画像全体', () => {
    expect(fullRect(bounds)).toEqual({ x: 0, y: 0, width: 200, height: 100 });
  });

  it('上限を超える画像を判定する', () => {
    expect(isWithinSourceLimit({ width: 4000, height: 3000 })).toBe(true);
    expect(isWithinSourceLimit({ width: 20000, height: 10 })).toBe(false);
    expect(isWithinSourceLimit({ width: 10000, height: 10000 })).toBe(false);
  });

  it('ファイル名の拡張子を出力形式に置き換える', () => {
    expect(croppedFileName('photo.heic.JPG', 'png')).toBe(
      'photo.heic-cropped.png',
    );
    expect(croppedFileName('a.png', 'jpeg')).toBe('a-cropped.jpg');
    expect(croppedFileName(null, 'webp')).toBe('image-cropped.webp');
  });
});
