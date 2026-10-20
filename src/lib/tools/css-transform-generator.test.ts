import { describe, expect, it } from 'vitest';
import {
  buildCssDeclaration,
  buildOriginValue,
  buildTransformValue,
  clampTransformValue,
  DEFAULT_TRANSFORM,
  getPreset,
  isDefaultTransform,
  normalizeTransform,
  TRANSFORM_PRESETS,
} from './css-transform-generator';

const t = (p: Partial<typeof DEFAULT_TRANSFORM>) => ({
  ...DEFAULT_TRANSFORM,
  ...p,
});

describe('clampTransformValue', () => {
  it('範囲外は丸め、NaN・Infinityは初期値にする', () => {
    expect(clampTransformValue('rotateZ', 999)).toBe(360);
    expect(clampTransformValue('skewX', -200)).toBe(-89);
    expect(clampTransformValue('scaleX', -1)).toBe(0);
    expect(clampTransformValue('scaleX', NaN)).toBe(1);
    expect(clampTransformValue('originX', Infinity)).toBe(50);
  });

  it('scaleは小数第2位、他は整数に丸める', () => {
    expect(clampTransformValue('scaleX', 1.234)).toBe(1.23);
    expect(clampTransformValue('translateX', 2.6)).toBe(3);
  });

  it('-0は0にする', () => {
    expect(Object.is(clampTransformValue('translateX', -0.2), 0)).toBe(true);
  });
});

describe('normalizeTransform', () => {
  it('perspectiveは0か50以上', () => {
    expect(normalizeTransform({ perspective: 10 }).perspective).toBe(50);
    expect(normalizeTransform({ perspective: 0 }).perspective).toBe(0);
    expect(normalizeTransform({ perspective: 5000 }).perspective).toBe(2000);
  });
});

describe('buildTransformValue', () => {
  it('すべて初期値ならnone', () => {
    expect(buildTransformValue(DEFAULT_TRANSFORM)).toBe('none');
    expect(isDefaultTransform(DEFAULT_TRANSFORM)).toBe(true);
  });

  it('初期値の項目は省略される', () => {
    expect(buildTransformValue(t({ rotateZ: 45 }))).toBe('rotate(45deg)');
    expect(buildTransformValue(t({ translateX: 10 }))).toBe('translateX(10px)');
    expect(buildTransformValue(t({ translateY: -10 }))).toBe(
      'translateY(-10px)',
    );
    expect(buildTransformValue(t({ translateX: 10, translateY: 20 }))).toBe(
      'translate(10px, 20px)',
    );
  });

  it('translateZがあればtranslate3dにする', () => {
    expect(buildTransformValue(t({ translateZ: 30 }))).toBe(
      'translate3d(0px, 0px, 30px)',
    );
  });

  it('scaleは同値ならまとめ、異なれば2引数', () => {
    expect(buildTransformValue(t({ scaleX: 1.5, scaleY: 1.5 }))).toBe(
      'scale(1.5)',
    );
    expect(buildTransformValue(t({ scaleX: 2, scaleY: 1 }))).toBe(
      'scale(2, 1)',
    );
  });

  it('skewは片方だけならskewX/skewY', () => {
    expect(buildTransformValue(t({ skewX: -15 }))).toBe('skewX(-15deg)');
    expect(buildTransformValue(t({ skewY: 10 }))).toBe('skewY(10deg)');
    expect(buildTransformValue(t({ skewX: 5, skewY: 10 }))).toBe(
      'skew(5deg, 10deg)',
    );
  });

  it('perspectiveが先頭、順序はtranslate→rotate→scale→skew', () => {
    expect(
      buildTransformValue(
        t({
          perspective: 800,
          translateX: 5,
          rotateX: 20,
          rotateY: -25,
          rotateZ: 3,
          scaleX: 2,
          scaleY: 2,
          skewX: 4,
        }),
      ),
    ).toBe(
      'perspective(800px) translateX(5px) rotateX(20deg) rotateY(-25deg) rotate(3deg) scale(2) skewX(4deg)',
    );
  });

  it('小数点以下で0になる回転は省略され、scale(0, 1)は2引数で出る', () => {
    expect(buildTransformValue(t({ rotateX: -0.4 }))).toBe('none');
    expect(buildTransformValue(t({ scaleX: 0, scaleY: 1 }))).toBe(
      'scale(0, 1)',
    );
  });

  it('perspectiveは50未満を50に上げて出力する', () => {
    expect(buildTransformValue(t({ perspective: 20, rotateY: 10 }))).toBe(
      'perspective(50px) rotateY(10deg)',
    );
  });

  it('範囲外の値はクランプして出力する', () => {
    expect(buildTransformValue(t({ rotateZ: 9999 }))).toBe('rotate(360deg)');
  });
});

describe('buildCssDeclaration / origin', () => {
  it('originが初期値なら省略する', () => {
    expect(buildCssDeclaration(t({ rotateZ: 45 }))).toBe(
      'transform: rotate(45deg);',
    );
    expect(buildCssDeclaration(DEFAULT_TRANSFORM)).toBe('transform: none;');
  });

  it('originが初期値以外なら2行目に出力する', () => {
    expect(
      buildCssDeclaration(t({ rotateZ: 45, originX: 0, originY: 0 })),
    ).toBe('transform: rotate(45deg);\ntransform-origin: 0% 0%;');
    expect(buildOriginValue(t({ originX: 100, originY: 25 }))).toBe('100% 25%');
  });
});

describe('presets', () => {
  it('取得でき、不明IDはundefined', () => {
    expect(getPreset('flip')?.state.rotateY).toBe(180);
    expect(getPreset('nope')).toBeUndefined();
  });

  it('全プリセットが正規化済みで初期値ではない', () => {
    for (const p of TRANSFORM_PRESETS) {
      expect(normalizeTransform(p.state)).toEqual(p.state);
      expect(isDefaultTransform(p.state)).toBe(false);
    }
  });
});
