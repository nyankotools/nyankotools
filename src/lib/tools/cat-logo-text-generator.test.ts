import { describe, expect, it } from 'vitest';
import {
  DECOR_INFO,
  EAR_TRIANGLE,
  MAX_SCALE,
  MIN_SCALE,
  buildFilename,
  canvasLayout,
  clampPosition,
  clampScale,
  decorRadius,
  handleHit,
  hitTest,
  isValidFontSize,
  isValidOutline,
  newDecorAt,
  normalizeRotation,
  rotateHandlePos,
  rotationFromPointer,
  scaleFromPointer,
  scaleHandlePos,
  shrinkTriangle,
  splitGlyphs,
  type Decor,
  type NewDecor,
} from './cat-logo-text-generator';

const withId = (d: NewDecor, id: number): Decor => ({ ...d, id });

describe('splitGlyphs', () => {
  it('絵文字や結合文字を1文字として数える', () => {
    expect(splitGlyphs('にゃ🐱')).toEqual(['に', 'ゃ', '🐱']);
    expect(splitGlyphs('👨‍👩‍👧')).toHaveLength(1);
  });
  it('前後の空白・改行を除く', () => {
    expect(splitGlyphs('  ab\n')).toEqual(['a', 'b']);
    expect(splitGlyphs('   ')).toEqual([]);
  });
});

describe('validation', () => {
  it('フォントサイズと縁取りの範囲を検証する', () => {
    expect(isValidFontSize(120)).toBe(true);
    expect(isValidFontSize(39)).toBe(false);
    expect(isValidFontSize(241)).toBe(false);
    expect(isValidFontSize(100.5)).toBe(false);
    expect(isValidOutline(0)).toBe(true);
    expect(isValidOutline(-1)).toBe(false);
    expect(isValidOutline(41)).toBe(false);
  });
});

describe('geometry helpers', () => {
  it('shrinkTriangleは重心を保ったまま縮める', () => {
    const tri = [
      { x: 0, y: 0 },
      { x: 30, y: 0 },
      { x: 0, y: 30 },
    ];
    const small = shrinkTriangle(tri, 0.5);
    expect(small[0]).toEqual({ x: 5, y: 5 });
    expect(small[1]).toEqual({ x: 20, y: 5 });
  });
  it('猫耳の三角形は単位円に収まる', () => {
    for (const p of EAR_TRIANGLE) expect(Math.hypot(p.x, p.y)).toBeLessThan(1);
  });
  it('normalizeRotationは(-180,180]に丸める', () => {
    expect(normalizeRotation(190)).toBe(-170);
    expect(normalizeRotation(-190)).toBe(170);
    expect(normalizeRotation(360)).toBe(0);
    expect(normalizeRotation(180)).toBe(180);
    expect(normalizeRotation(-180)).toBe(180);
  });
  it('clampScale / clampPosition', () => {
    expect(clampScale(0)).toBe(MIN_SCALE);
    expect(clampScale(99)).toBe(MAX_SCALE);
    expect(clampPosition(-9, 9, 4)).toEqual({ x: -1.2, y: 1.2 });
    expect(clampPosition(9, -9, 4)).toEqual({ x: 5.2, y: -2 });
  });
});

describe('newDecorAt', () => {
  it('文字列の上の空き領域に置き、呼ぶたびにずらす', () => {
    const a = newDecorAt('heart', 4, 0);
    const b = newDecorAt('heart', 4, 1);
    expect(a.kind).toBe('heart');
    expect(a.x).not.toBe(b.x);
    expect(Math.abs(a.x - 2)).toBeLessThanOrEqual(1);
    // 文字（ベースライン基準で上端 -0.8em 付近）より上に置く
    expect(a.y).toBeLessThan(-0.9);
  });
});

describe('hitTest', () => {
  const items = [
    withId({ ...newDecorAt('heart', 4, 2), x: 1, y: 0 }, 1),
    withId({ ...newDecorAt('star', 4, 2), x: 1.1, y: 0 }, 2),
  ];
  it('重なっていれば最前面（後ろの要素）を返す', () => {
    expect(hitTest(items, 1.05, 0)).toBe(2);
  });
  it('外れたらnull、最小半径で掴みやすくできる', () => {
    expect(hitTest(items, 3, 3)).toBeNull();
    expect(hitTest(items, 1, 0.3)).toBeNull();
    expect(hitTest(items, 1, 0.3, 0.4)).toBe(2);
  });
});

describe('handles', () => {
  const d = withId(
    { ...newDecorAt('star', 4, 2), x: 2, y: 0, rotation: 0, scale: 2 },
    1,
  );
  it('回転ハンドルは上、拡大ハンドルは右下にある', () => {
    const rot = rotateHandlePos(d);
    expect(rot.x).toBeCloseTo(2);
    expect(rot.y).toBeLessThan(-decorRadius(d));
    const sc = scaleHandlePos(d);
    expect(sc.x).toBeGreaterThan(2);
    expect(sc.y).toBeGreaterThan(0);
  });
  it('90度回転すると回転ハンドルは右に来る', () => {
    const rot = rotateHandlePos({ ...d, rotation: 90 });
    expect(rot.x).toBeGreaterThan(2);
    expect(rot.y).toBeCloseTo(0);
  });
  it('handleHitはハンドル付近だけ反応する', () => {
    const rot = rotateHandlePos(d);
    expect(handleHit(d, rot.x, rot.y, 0.05)).toBe('rotate');
    const sc = scaleHandlePos(d);
    expect(handleHit(d, sc.x, sc.y, 0.05)).toBe('scale');
    expect(handleHit(d, 2, 0, 0.05)).toBeNull();
  });
  it('scaleFromPointerは中心からの距離に比例する', () => {
    const r = DECOR_INFO.star.radius;
    expect(scaleFromPointer(d, 2 + r * 3, 0)).toBeCloseTo(3);
    expect(scaleFromPointer(d, 2, 0)).toBe(MIN_SCALE);
    expect(scaleFromPointer(d, 2 + 99, 0)).toBe(MAX_SCALE);
  });
  it('rotationFromPointerは上=0度、右=90度。snapで丸める', () => {
    expect(rotationFromPointer(d, 2, -1)).toBe(0);
    expect(rotationFromPointer(d, 3, 0)).toBe(90);
    expect(rotationFromPointer(d, 2, 1)).toBe(180);
    expect(rotationFromPointer(d, 3, -0.9, 15)).toBe(45);
  });
});

describe('canvasLayout', () => {
  const base = { width: 400, height: 200 };
  it('はみ出しがなければ基準寸法のまま', () => {
    const items = [withId({ ...newDecorAt('heart', 4, 2), x: 1, y: -0.3 }, 1)];
    const l = canvasLayout(base, { x: 60, y: 120 }, items, 100, 4);
    expect(l).toEqual({ width: 400, height: 200, originX: 60, originY: 120 });
  });
  it('左上にはみ出すと範囲を広げ、原点をずらす', () => {
    const items = [withId({ ...newDecorAt('heart', 4, 2), x: -1, y: -1.5 }, 1)];
    const l = canvasLayout(base, { x: 60, y: 120 }, items, 100, 0);
    expect(l.originX).toBeGreaterThan(60);
    expect(l.originY).toBeGreaterThan(120);
    expect(l.width).toBeGreaterThan(400);
    expect(l.height).toBeGreaterThan(200);
  });
  it('右下にはみ出すと原点は動かず範囲だけ広がる', () => {
    const items = [withId({ ...newDecorAt('moon', 4, 2), x: 5, y: 1.2 }, 1)];
    const l = canvasLayout(base, { x: 60, y: 120 }, items, 100, 0);
    expect(l.originX).toBe(60);
    expect(l.originY).toBe(120);
    expect(l.width).toBeGreaterThan(400);
    expect(l.height).toBeGreaterThan(200);
  });
});

describe('buildFilename', () => {
  it('ファイル名に使えない文字を置換する', () => {
    expect(buildFilename('にゃんこ ツール')).toBe('にゃんこ-ツール-logo.png');
    expect(buildFilename('a/b:c')).toBe('a-b-c-logo.png');
  });
  it('空なら既定名', () => {
    expect(buildFilename('  ')).toBe('cat-logo.png');
  });
});
