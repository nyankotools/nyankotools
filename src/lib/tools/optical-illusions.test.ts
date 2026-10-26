import { describe, expect, it } from 'vitest';
import {
  CHECKER_DARK,
  CHECKER_LIGHT,
  CHECKER_SHADOW_OPACITY,
  DEFAULT_STRENGTH,
  FRASER_RADII,
  ILLUSION_IDS,
  VIEW_HEIGHT,
  VIEW_WIDTH,
  buildIllusion,
  cafeWallShift,
  clampStrength,
  ebbinghausRadii,
  fraserSegmentCount,
  grayHex,
  hasInducers,
  hermannGap,
  isIllusionId,
  nextIllusion,
  poggendorffBarWidth,
  poggendorffLineY,
  ponzoHalfGap,
  shadowedGray,
  usesStrength,
  visibleShapes,
  type Shape,
} from './optical-illusions';

const lines = (shapes: Shape[], role: Shape['role']) =>
  shapes.filter(
    (s): s is Extract<Shape, { kind: 'line' }> =>
      s.kind === 'line' && s.role === role,
  );

describe('基本', () => {
  it('全ての錯視が図形を返し、範囲内に収まる', () => {
    for (const id of ILLUSION_IDS) {
      for (const s of [0, DEFAULT_STRENGTH, 100]) {
        const ill = buildIllusion(id, s);
        expect(ill.id).toBe(id);
        expect(ill.shapes.length).toBeGreaterThan(3);
        for (const sh of ill.shapes) {
          if (sh.kind === 'circle' && sh.role !== 'guide') {
            expect(sh.cx - sh.r).toBeGreaterThanOrEqual(0);
            expect(sh.cx + sh.r).toBeLessThanOrEqual(VIEW_WIDTH);
            expect(sh.cy - sh.r).toBeGreaterThanOrEqual(0);
            expect(sh.cy + sh.r).toBeLessThanOrEqual(VIEW_HEIGHT);
          }
          if (sh.kind === 'rect') {
            expect(sh.x).toBeGreaterThanOrEqual(0);
            expect(sh.x + sh.w).toBeLessThanOrEqual(VIEW_WIDTH + 1e-9);
            expect(sh.y + sh.h).toBeLessThanOrEqual(VIEW_HEIGHT + 1e-9);
          }
        }
      }
    }
  });

  it('isIllusionId / clampStrength / nextIllusion', () => {
    expect(isIllusionId('ponzo')).toBe(true);
    expect(isIllusionId('nope')).toBe(false);
    expect(clampStrength(-5)).toBe(0);
    expect(clampStrength(250)).toBe(100);
    expect(clampStrength(33.6)).toBe(34);
    expect(clampStrength(Number.NaN)).toBe(DEFAULT_STRENGTH);
    expect(clampStrength(Number.POSITIVE_INFINITY)).toBe(DEFAULT_STRENGTH);
    expect(nextIllusion('muller-lyer')).toBe('ponzo');
    expect(nextIllusion(ILLUSION_IDS[ILLUSION_IDS.length - 1])).toBe(
      ILLUSION_IDS[0],
    );
  });

  it('範囲外の強さでも壊れない', () => {
    expect(buildIllusion('zollner', 9999).shapes).toEqual(
      buildIllusion('zollner', 100).shapes,
    );
  });

  it('visibleShapes は役割で絞り込み、順序を保つ', () => {
    const shapes = buildIllusion('muller-lyer', 50).shapes;
    const none = visibleShapes(shapes, {
      showGuides: false,
      hideInducers: true,
    });
    expect(none.every((s) => s.role === 'main')).toBe(true);
    const all = visibleShapes(shapes, {
      showGuides: true,
      hideInducers: false,
    });
    expect(all).toEqual(shapes);
    const guided = visibleShapes(shapes, {
      showGuides: true,
      hideInducers: true,
    });
    expect(guided.some((s) => s.role === 'guide')).toBe(true);
    expect(guided.some((s) => s.role === 'inducer')).toBe(false);
  });

  it('inducer を持たない錯視は inducer 図形が無い', () => {
    for (const id of ILLUSION_IDS) {
      const has = buildIllusion(id, 50).shapes.some(
        (s) => s.role === 'inducer',
      );
      expect(has).toBe(hasInducers(id));
    }
    expect(usesStrength('checker-shadow')).toBe(false);
    expect(usesStrength('ponzo')).toBe(true);
  });
});

describe('ミュラー・リヤー', () => {
  it('2本の軸線は同じ長さで、補助線は両端に立つ', () => {
    const shapes = buildIllusion('muller-lyer', 70).shapes;
    const shafts = lines(shapes, 'main');
    expect(shafts).toHaveLength(2);
    const lens = shafts.map((l) => Math.hypot(l.x2 - l.x1, l.y2 - l.y1));
    expect(lens[0]).toBeCloseTo(lens[1]);
    const guides = lines(shapes, 'guide');
    expect(guides.map((g) => g.x1).sort((a, b) => a - b)).toEqual([100, 300]);
  });

  it('矢羽根は強さに応じて長くなる', () => {
    const fin = (s: number) => {
      const l = lines(buildIllusion('muller-lyer', s).shapes, 'inducer')[0];
      return Math.hypot(l.x2 - l.x1, l.y2 - l.y1);
    };
    expect(fin(100)).toBeGreaterThan(fin(0));
  });
});

describe('ポンゾ', () => {
  it('2本の横棒は同じ長さ・同じ x 範囲', () => {
    const bars = lines(buildIllusion('ponzo', 80).shapes, 'main');
    expect(bars).toHaveLength(2);
    expect(bars[0].x1).toBe(bars[1].x1);
    expect(bars[0].x2).toBe(bars[1].x2);
  });

  it('強さ0で平行、強さが増すと上が狭まる', () => {
    expect(ponzoHalfGap(20, 0)).toBeCloseTo(ponzoHalfGap(250, 0));
    expect(ponzoHalfGap(20, 100)).toBeCloseTo(10);
    expect(ponzoHalfGap(250, 100)).toBeCloseTo(80);
  });
});

describe('ツェルナー', () => {
  it('主線は全て水平（平行）', () => {
    const main = lines(buildIllusion('zollner', 90).shapes, 'main');
    expect(main).toHaveLength(4);
    for (const l of main) expect(l.y1).toBe(l.y2);
  });

  it('短線の傾きは行ごとに反転する', () => {
    const inducers = lines(buildIllusion('zollner', 60).shapes, 'inducer');
    const perRow = inducers.length / 4;
    const a = inducers[0];
    const b = inducers[perRow];
    expect(Math.sign(a.x2 - a.x1)).toBe(-Math.sign(b.x2 - b.x1));
  });
});

describe('エビングハウス', () => {
  it('中央の円は同じ半径、補助線は両方に接する', () => {
    const shapes = buildIllusion('ebbinghaus', 70).shapes;
    const centers = shapes.filter(
      (s): s is Extract<Shape, { kind: 'circle' }> =>
        s.kind === 'circle' && s.role === 'main',
    );
    expect(centers).toHaveLength(2);
    expect(centers[0].r).toBe(centers[1].r);
    const guides = lines(shapes, 'guide').map((g) => g.y1);
    expect(guides).toEqual([centers[0].cy - 18, centers[0].cy + 18]);
  });

  it('周囲の円は互いに重ならない', () => {
    for (const s of [0, 50, 100]) {
      const circles = buildIllusion('ebbinghaus', s).shapes.filter(
        (x): x is Extract<Shape, { kind: 'circle' }> =>
          x.kind === 'circle' && x.role === 'inducer',
      );
      for (let i = 0; i < circles.length; i++) {
        for (let j = i + 1; j < circles.length; j++) {
          const d = Math.hypot(
            circles[i].cx - circles[j].cx,
            circles[i].cy - circles[j].cy,
          );
          expect(d).toBeGreaterThanOrEqual(circles[i].r + circles[j].r - 1e-9);
        }
      }
    }
    expect(ebbinghausRadii(100).large).toBeGreaterThan(
      ebbinghausRadii(100).small,
    );
  });
});

describe('カフェウォール', () => {
  it('強さ0では行がずれず、強さが増すとずれる', () => {
    expect(cafeWallShift(0)).toBe(0);
    expect(cafeWallShift(100)).toBe(12);
  });

  it('タイルは描画領域（40〜360）からはみ出さない', () => {
    for (const s of [0, 50, 100]) {
      const tiles = buildIllusion('cafe-wall', s).shapes.filter(
        (x) => x.kind === 'rect' && x.role === 'inducer',
      );
      expect(tiles.length).toBeGreaterThan(30);
      for (const t of tiles) {
        if (t.kind !== 'rect') continue;
        expect(t.x).toBeGreaterThanOrEqual(40 - 1e-9);
        expect(t.x + t.w).toBeLessThanOrEqual(360 + 1e-9);
      }
    }
  });

  it('補助線は水平で5本', () => {
    const g = lines(buildIllusion('cafe-wall', 70).shapes, 'guide');
    expect(g).toHaveLength(5);
    for (const l of g) expect(l.y1).toBe(l.y2);
  });
});

describe('チェッカーシャドウ', () => {
  it('影の中の明るいマスと影の外の暗いマスは同じグレーになる', () => {
    expect(shadowedGray(CHECKER_LIGHT, CHECKER_SHADOW_OPACITY)).toBe(
      CHECKER_DARK,
    );
    expect(grayHex(CHECKER_DARK)).toBe('#787878');
  });

  it('A と B を結ぶ補助線は同じ色', () => {
    const shapes = buildIllusion('checker-shadow', 50).shapes;
    const guide = shapes.find((s) => s.role === 'guide');
    expect(guide?.kind).toBe('polygon');
    if (guide?.kind === 'polygon') expect(guide.fill).toBe('#787878');
    expect(
      shapes
        .filter((s) => s.kind === 'text')
        .map((s) => s.kind === 'text' && s.text),
    ).toEqual(['A', 'B']);
  });

  it('grayHex は範囲に丸める', () => {
    expect(grayHex(-10)).toBe('#000000');
    expect(grayHex(300)).toBe('#ffffff');
  });
});

describe('ヘルマン格子', () => {
  it('隙間は強さで広がり、交点の補助円は9個', () => {
    expect(hermannGap(100)).toBeGreaterThan(hermannGap(0));
    const dots = buildIllusion('hermann-grid', 70).shapes.filter(
      (s) => s.kind === 'circle' && s.role === 'guide',
    );
    expect(dots).toHaveLength(9);
  });

  it('格子は常に描画領域に収まる', () => {
    for (const s of [0, 100]) {
      const rects = buildIllusion('hermann-grid', s).shapes.filter(
        (x) => x.kind === 'rect' && x.fill === '#111111',
      );
      expect(rects).toHaveLength(16);
      for (const r of rects) {
        if (r.kind !== 'rect') continue;
        expect(r.x).toBeGreaterThanOrEqual(0);
        expect(r.y).toBeGreaterThanOrEqual(0);
        expect(r.y + r.h).toBeLessThanOrEqual(VIEW_HEIGHT);
      }
    }
  });
});

describe('ポッゲンドルフ', () => {
  it('左右の線分は同一直線上にあり、補助線も同じ直線', () => {
    const shapes = buildIllusion('poggendorff', 70).shapes;
    const segs = lines(shapes, 'main');
    expect(segs).toHaveLength(2);
    const slope = (l: (typeof segs)[number]) => (l.y2 - l.y1) / (l.x2 - l.x1);
    expect(slope(segs[0])).toBeCloseTo(0.7);
    expect(slope(segs[1])).toBeCloseTo(0.7);
    expect(segs[1].y1).toBeCloseTo(poggendorffLineY(segs[1].x1));
    const g = lines(shapes, 'guide')[0];
    expect(g.y1).toBeCloseTo(poggendorffLineY(g.x1));
    expect(g.y2).toBeCloseTo(poggendorffLineY(g.x2));
  });

  it('遮へい板は強さで広がる', () => {
    expect(poggendorffBarWidth(100)).toBeGreaterThan(poggendorffBarWidth(0));
  });
});

describe('フレーザー', () => {
  it('円ごとの線分数は偶数で、半径が大きいほど多い', () => {
    let prev = 0;
    for (const r of FRASER_RADII) {
      const n = fraserSegmentCount(r);
      expect(n % 2).toBe(0);
      expect(n).toBeGreaterThan(prev);
      prev = n;
    }
  });

  it('補助円は同心円で、中心が一致する', () => {
    const circles = buildIllusion('fraser-spiral', 70).shapes.filter(
      (s): s is Extract<Shape, { kind: 'circle' }> => s.kind === 'circle',
    );
    expect(circles.map((c) => c.r)).toEqual([...FRASER_RADII]);
    expect(new Set(circles.map((c) => `${c.cx},${c.cy}`)).size).toBe(1);
  });
});
