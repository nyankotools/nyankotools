import { describe, expect, it } from 'vitest';
import {
  buildCssDeclaration,
  buildGradientValue,
  clampAngle,
  clampPosition,
  sortStops,
  suggestNewStopPosition,
} from './css-gradient-generator';

describe('clampPosition', () => {
  it('0〜100の範囲内はそのまま（四捨五入）', () => {
    expect(clampPosition(50.4)).toBe(50);
    expect(clampPosition(50.6)).toBe(51);
  });

  it('範囲外は0または100に丸める', () => {
    expect(clampPosition(-10)).toBe(0);
    expect(clampPosition(150)).toBe(100);
  });
});

describe('clampAngle', () => {
  it('0〜359の範囲内はそのまま', () => {
    expect(clampAngle(90)).toBe(90);
    expect(clampAngle(0)).toBe(0);
  });

  it('負の値や360以上は0〜359に正規化する', () => {
    expect(clampAngle(-90)).toBe(270);
    expect(clampAngle(360)).toBe(0);
    expect(clampAngle(725)).toBe(5);
  });
});

describe('sortStops', () => {
  it('positionの昇順に並べ替える（元配列は変更しない）', () => {
    const stops = [
      { color: '#000000', position: 100 },
      { color: '#ffffff', position: 0 },
    ];
    expect(sortStops(stops)).toEqual([
      { color: '#ffffff', position: 0 },
      { color: '#000000', position: 100 },
    ]);
    expect(stops[0].position).toBe(100);
  });
});

describe('suggestNewStopPosition', () => {
  it('2つの停止（0%と100%）の間なら中央の50を提案する', () => {
    const stops = [
      { color: '#3b82f6', position: 0 },
      { color: '#a855f7', position: 100 },
    ];
    expect(suggestNewStopPosition(stops)).toBe(50);
  });

  it('最も広い隙間の中央を提案する', () => {
    const stops = [
      { color: '#000000', position: 0 },
      { color: '#111111', position: 20 },
      { color: '#ffffff', position: 100 },
    ];
    expect(suggestNewStopPosition(stops)).toBe(60);
  });

  it('停止が1つだけの場合は50%離れた位置を提案する', () => {
    expect(suggestNewStopPosition([{ color: '#000000', position: 0 }])).toBe(
      50,
    );
    expect(suggestNewStopPosition([{ color: '#000000', position: 80 }])).toBe(
      30,
    );
  });
});

describe('buildGradientValue', () => {
  it('linearはangle・positionの昇順に並んだ停止でグラデーションを組み立てる', () => {
    const value = buildGradientValue({
      type: 'linear',
      angle: 90,
      shape: 'circle',
      stops: [
        { color: '#a855f7', position: 100 },
        { color: '#3b82f6', position: 0 },
      ],
    });
    expect(value).toBe('linear-gradient(90deg, #3b82f6 0%, #a855f7 100%)');
  });

  it('radialはshapeを使い、angleは無視する', () => {
    const value = buildGradientValue({
      type: 'radial',
      angle: 45,
      shape: 'ellipse',
      stops: [
        { color: '#000000', position: 0 },
        { color: '#ffffff', position: 100 },
      ],
    });
    expect(value).toBe('radial-gradient(ellipse, #000000 0%, #ffffff 100%)');
  });
});

describe('buildCssDeclaration', () => {
  it('background:宣言として組み立てる', () => {
    const value = buildCssDeclaration({
      type: 'linear',
      angle: 0,
      shape: 'circle',
      stops: [
        { color: '#000000', position: 0 },
        { color: '#ffffff', position: 100 },
      ],
    });
    expect(value).toBe(
      'background: linear-gradient(0deg, #000000 0%, #ffffff 100%);',
    );
  });
});
