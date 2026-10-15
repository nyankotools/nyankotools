import { describe, expect, it } from 'vitest';
import { cssClipPathGeneratorContent } from '../../i18n/tools/css-clip-path-generator';
import {
  addPoint,
  buildCircleValue,
  buildClipPathDeclaration,
  buildClipPathWithPrefix,
  buildEllipseValue,
  buildInsetValue,
  buildPolygonValue,
  clampPercent,
  formatPercent,
  MAX_POINTS,
  movePoint,
  pointFromPointer,
  POLYGON_PRESETS,
  removePoint,
  snapValue,
} from './css-clip-path-generator';

describe('clampPercent / formatPercent', () => {
  it('0〜100に収め、小数第1位に丸める', () => {
    expect(clampPercent(-5)).toBe(0);
    expect(clampPercent(120)).toBe(100);
    expect(clampPercent(33.333)).toBe(33.3);
    expect(clampPercent(NaN)).toBe(0);
  });

  it('整数は小数点なしで整形する', () => {
    expect(formatPercent(50)).toBe('50%');
    expect(formatPercent(12.5)).toBe('12.5%');
    expect(formatPercent(0)).toBe('0%');
  });
});

describe('snapValue', () => {
  it('step刻みに丸め、stepが0以下なら何もしない', () => {
    expect(snapValue(47, 5)).toBe(45);
    expect(snapValue(48, 5)).toBe(50);
    expect(snapValue(47.3, 0)).toBe(47.3);
  });
});

describe('build*Value', () => {
  it('polygonを組み立てる', () => {
    expect(
      buildPolygonValue([
        { x: 50, y: 0 },
        { x: 0, y: 100 },
        { x: 100, y: 100 },
      ]),
    ).toBe('polygon(50% 0%, 0% 100%, 100% 100%)');
  });

  it('circle / ellipseを組み立てる', () => {
    expect(buildCircleValue({ radius: 40, cx: 50, cy: 50 })).toBe(
      'circle(40% at 50% 50%)',
    );
    expect(buildEllipseValue({ rx: 50, ry: 35, cx: 50, cy: 50 })).toBe(
      'ellipse(50% 35% at 50% 50%)',
    );
  });

  it('insetは角丸が0なら round を省略する', () => {
    const base = { top: 10, right: 20, bottom: 10, left: 20 };
    expect(buildInsetValue({ ...base, round: 0 })).toBe(
      'inset(10% 20% 10% 20%)',
    );
    expect(buildInsetValue({ ...base, round: 8 })).toBe(
      'inset(10% 20% 10% 20% round 8%)',
    );
  });

  it('宣言文を組み立てる', () => {
    expect(buildClipPathDeclaration('circle(50% at 50% 50%)')).toBe(
      'clip-path: circle(50% at 50% 50%);',
    );
    expect(buildClipPathWithPrefix('circle(50% at 50% 50%)')).toBe(
      '-webkit-clip-path: circle(50% at 50% 50%);\nclip-path: circle(50% at 50% 50%);',
    );
  });
});

describe('頂点の編集', () => {
  const tri = POLYGON_PRESETS[0].points;

  it('addPointは末尾と先頭の中点を追加する', () => {
    const next = addPoint(tri);
    expect(next).toHaveLength(4);
    expect(next[3]).toEqual({ x: 75, y: 50 });
  });

  it('addPointは上限を超えない', () => {
    let points = tri;
    for (let i = 0; i < MAX_POINTS + 5; i++) points = addPoint(points);
    expect(points).toHaveLength(MAX_POINTS);
  });

  it('removePointは3点未満にならない', () => {
    expect(removePoint(tri, 0)).toBe(tri);
    const four = addPoint(tri);
    expect(removePoint(four, 3)).toHaveLength(3);
    expect(removePoint(four, 9)).toBe(four);
  });

  it('movePointは範囲内に収める', () => {
    const moved = movePoint(tri, 0, 150, -20);
    expect(moved[0]).toEqual({ x: 100, y: 0 });
    expect(moved[1]).toEqual(tri[1]);
    expect(movePoint(tri, 5, 1, 1)).toBe(tri);
  });
});

describe('pointFromPointer', () => {
  const rect = { left: 100, top: 50, width: 200, height: 100 };

  it('座標をパーセントへ変換する', () => {
    expect(pointFromPointer(200, 100, rect)).toEqual({ x: 50, y: 50 });
  });

  it('領域外は端に丸め、スナップできる', () => {
    expect(pointFromPointer(0, 500, rect)).toEqual({ x: 0, y: 100 });
    expect(pointFromPointer(247, 100, rect, 5)).toEqual({ x: 75, y: 50 });
  });

  it('サイズ0でも例外にならない', () => {
    expect(
      pointFromPointer(1, 1, { left: 0, top: 0, width: 0, height: 0 }),
    ).toEqual({ x: 0, y: 0 });
  });
});

describe('境界・異常値・追加ケース', () => {
  it('clampPercentは小数の丸めを行い、負の0は0になる', () => {
    expect(clampPercent(12.345)).toBe(12.3);
    expect(clampPercent(-0)).toBe(0);
    expect(clampPercent(99.96)).toBe(100);
  });

  it('circle / ellipse / insetの値も0〜100に収める', () => {
    expect(buildCircleValue({ radius: 150, cx: -10, cy: 50 })).toBe(
      'circle(100% at 0% 50%)',
    );
    expect(buildEllipseValue({ rx: -1, ry: NaN, cx: 50, cy: 50 })).toBe(
      'ellipse(0% 0% at 50% 50%)',
    );
    expect(
      buildInsetValue({ top: 0, right: 0, bottom: 0, left: 0, round: 150 }),
    ).toBe('inset(0% 0% 0% 0% round 100%)');
  });

  it('insetの角丸が負なら round を省略する', () => {
    expect(
      buildInsetValue({ top: 5, right: 5, bottom: 5, left: 5, round: -3 }),
    ).toBe('inset(5% 5% 5% 5%)');
  });

  it('頂点が最大数の polygon も正しく組み立てる', () => {
    const many = Array.from({ length: MAX_POINTS }, (_, i) => ({
      x: (i * 100) / MAX_POINTS,
      y: 50,
    }));
    const value = buildPolygonValue(many);
    expect(value.startsWith('polygon(')).toBe(true);
    expect(value.split(', ')).toHaveLength(MAX_POINTS);
  });

  it('各プリセットの polygon は頂点数と同じ数の座標を持つ', () => {
    for (const preset of POLYGON_PRESETS) {
      const value = buildPolygonValue(preset.points);
      expect(value.split(', '), preset.id).toHaveLength(preset.points.length);
    }
  });

  it('プリセットのid は ja / en の表示名をすべて持つ', () => {
    for (const preset of POLYGON_PRESETS) {
      expect(
        cssClipPathGeneratorContent.ja.presetNames[preset.id],
        `ja:${preset.id}`,
      ).toBeTruthy();
      expect(
        cssClipPathGeneratorContent.en.presetNames[preset.id],
        `en:${preset.id}`,
      ).toBeTruthy();
    }
  });

  it('範囲外・負のインデックスの removePoint / movePoint は変更しない', () => {
    const four = addPoint(POLYGON_PRESETS[0].points);
    expect(removePoint(four, -1)).toBe(four);
    expect(movePoint(four, -1, 10, 10)).toBe(four);
  });

  it('movePointは小数第1位に丸める', () => {
    const moved = movePoint(POLYGON_PRESETS[0].points, 1, 12.345, 66.66);
    expect(moved[1]).toEqual({ x: 12.3, y: 66.7 });
  });

  it('addPointの中点も小数第1位に丸める', () => {
    const next = addPoint([
      { x: 0, y: 0 },
      { x: 33.3, y: 0 },
      { x: 0, y: 10 },
    ]);
    expect(next[3]).toEqual({ x: 0, y: 5 });
  });

  it('snapValueは負のstepでは値をそのまま返し、NaN stepも無効扱い', () => {
    expect(snapValue(47.3, -5)).toBe(47.3);
    expect(snapValue(47.3, Number.NaN)).toBe(47.3);
  });

  it('pointFromPointerはy方向にもスナップし、範囲外は端に丸める', () => {
    const rect = { left: 0, top: 0, width: 100, height: 100 };
    expect(pointFromPointer(33, 52, rect, 5)).toEqual({ x: 35, y: 50 });
    expect(pointFromPointer(-50, 300, rect, 5)).toEqual({ x: 0, y: 100 });
  });
});

describe('POLYGON_PRESETS', () => {
  it('idが一意で、3〜24点、座標は0〜100', () => {
    const ids = POLYGON_PRESETS.map((p) => p.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const preset of POLYGON_PRESETS) {
      expect(preset.points.length).toBeGreaterThanOrEqual(3);
      expect(preset.points.length).toBeLessThanOrEqual(MAX_POINTS);
      for (const p of preset.points) {
        expect(p.x).toBeGreaterThanOrEqual(0);
        expect(p.x).toBeLessThanOrEqual(100);
        expect(p.y).toBeGreaterThanOrEqual(0);
        expect(p.y).toBeLessThanOrEqual(100);
      }
    }
  });
});
