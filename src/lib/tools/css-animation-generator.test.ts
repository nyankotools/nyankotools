import { describe, expect, it } from 'vitest';
import {
  DEFAULT_CONFIG,
  EASING_BEZIERS,
  EASING_IDS,
  PRESET_IDS,
  buildAnimationValue,
  buildCss,
  buildCurvePath,
  buildKeyframesRule,
  buildTimingFunction,
  clampBezier,
  clampDelay,
  clampDuration,
  clampIterations,
  formatNumber,
  sanitizeAnimationName,
  toWebAnimationKeyframes,
  type AnimationConfig,
} from './css-animation-generator';

const config = (patch: Partial<AnimationConfig> = {}): AnimationConfig => ({
  ...DEFAULT_CONFIG,
  ...patch,
});

describe('formatNumber', () => {
  it('浮動小数点誤差を除く', () => {
    expect(formatNumber(0.1 + 0.2)).toBe('0.3');
    expect(formatNumber(2)).toBe('2');
    expect(formatNumber(-0)).toBe('0');
  });
});

describe('clamp 系', () => {
  it('duration は 0.05〜60 秒', () => {
    expect(clampDuration(0)).toBe(0.05);
    expect(clampDuration(999)).toBe(60);
    expect(clampDuration(NaN)).toBe(1);
    expect(clampDuration(1.234)).toBe(1.23);
  });
  it('delay は -60〜60 秒', () => {
    expect(clampDelay(-100)).toBe(-60);
    expect(clampDelay(100)).toBe(60);
    expect(clampDelay(Infinity)).toBe(0);
  });
  it('iterations は 1〜100 の整数', () => {
    expect(clampIterations(0)).toBe(1);
    expect(clampIterations(2.6)).toBe(3);
    expect(clampIterations(1000)).toBe(100);
  });
  it('bezier の x は 0〜1、y は -3〜3', () => {
    expect(clampBezier({ x1: -1, y1: 9, x2: 2, y2: -9 })).toEqual({
      x1: 0,
      y1: 3,
      x2: 1,
      y2: -3,
    });
  });
});

describe('sanitizeAnimationName', () => {
  it('通常の名前はそのまま', () => {
    expect(sanitizeAnimationName('fade-in')).toBe('fade-in');
  });
  it('空白はハイフンにし、不正な文字は除く', () => {
    expect(sanitizeAnimationName(' my anim! ')).toBe('my-anim');
  });
  it('数字始まりは先頭の数字を除く', () => {
    expect(sanitizeAnimationName('1bounce')).toBe('bounce');
    expect(sanitizeAnimationName('-2x')).toBe('x');
  });
  it('空・無効ならフォールバック', () => {
    expect(sanitizeAnimationName('')).toBe('my-animation');
    expect(sanitizeAnimationName('日本語')).toBe('my-animation');
    expect(sanitizeAnimationName('123', 'spin')).toBe('spin');
  });
  it('ショートハンドのキーワードと衝突する名前は避ける', () => {
    expect(sanitizeAnimationName('infinite')).toBe('infinite-anim');
    expect(sanitizeAnimationName('Ease')).toBe('Ease-anim');
  });
});

describe('buildTimingFunction', () => {
  it('キーワードはそのまま出力', () => {
    expect(buildTimingFunction('ease-in-out', EASING_BEZIERS.ease)).toBe(
      'ease-in-out',
    );
  });
  it('名前付きプリセットは cubic-bezier として出力', () => {
    expect(buildTimingFunction('ease-out-back', EASING_BEZIERS.ease)).toBe(
      'cubic-bezier(0.34, 1.56, 0.64, 1)',
    );
  });
  it('custom は範囲内に丸める', () => {
    expect(
      buildTimingFunction('custom', { x1: 2, y1: 0.5, x2: -1, y2: 1 }),
    ).toBe('cubic-bezier(1, 0.5, 0, 1)');
  });
  it('全イージングIDが有効な値を返す', () => {
    for (const id of EASING_IDS) {
      expect(buildTimingFunction(id, EASING_BEZIERS.ease)).toMatch(
        /^(ease|linear|ease-in|ease-out|ease-in-out|cubic-bezier\(.+\))$/,
      );
    }
  });
});

describe('buildKeyframesRule', () => {
  it('同じ宣言のオフセットをまとめ、昇順に並べる', () => {
    expect(buildKeyframesRule('bounce', 'bounce')).toBe(
      [
        '@keyframes bounce {',
        '  0%, 100% { transform: translateY(0); }',
        '  50% { transform: translateY(-30px); }',
        '}',
      ].join('\n'),
    );
  });
  it('複数プロパティを出力する', () => {
    expect(buildKeyframesRule('x', 'fade-in')).toContain('0% { opacity: 0; }');
    expect(buildKeyframesRule('x', 'slide-in-left')).toContain(
      '0% { transform: translateX(-100%); opacity: 0; }',
    );
  });
  it('全プリセットが 0% と 100% を含む', () => {
    for (const id of PRESET_IDS) {
      const rule = buildKeyframesRule('a', id);
      expect(rule).toMatch(/\b0%/);
      expect(rule).toMatch(/100%/);
    }
  });
});

describe('buildAnimationValue / buildCss', () => {
  it('ショートハンドを既定値で組み立てる', () => {
    expect(buildAnimationValue(config())).toBe(
      'bounce 1s ease 0s infinite normal none',
    );
  });
  it('各値を反映する', () => {
    expect(
      buildAnimationValue(
        config({
          name: 'wobble',
          duration: 2.5,
          delay: -0.5,
          iterations: 3,
          direction: 'alternate',
          fillMode: 'both',
          easing: 'custom',
          bezier: { x1: 0.1, y1: 0.7, x2: 0.3, y2: 1.2 },
        }),
      ),
    ).toBe(
      'wobble 2.5s cubic-bezier(0.1, 0.7, 0.3, 1.2) -0.5s 3 alternate both',
    );
  });
  it('名前が空ならプリセットIDを使う', () => {
    expect(buildAnimationValue(config({ name: '', preset: 'spin' }))).toMatch(
      /^spin 1s/,
    );
  });
  it('reducedMotion が有効なら media クエリを含む', () => {
    const css = buildCss(config());
    expect(css).toContain('@keyframes bounce');
    expect(css).toContain(
      '.animated-element {\n  animation: bounce 1s ease 0s infinite normal none;\n}',
    );
    expect(css).toContain(
      '@media (prefers-reduced-motion: reduce) {\n  .animated-element {\n    animation: none;\n  }\n}',
    );
  });
  it('reducedMotion が無効なら media クエリを含まない', () => {
    expect(buildCss(config({ reducedMotion: false }))).not.toContain(
      'prefers-reduced-motion',
    );
  });
});

describe('toWebAnimationKeyframes', () => {
  it('オフセットを昇順に 0〜1 へ変換し、イージングを付ける', () => {
    const frames = toWebAnimationKeyframes('bounce', 'ease-in');
    expect(frames.map((f) => f.offset)).toEqual([0, 0.5, 1]);
    expect(frames.every((f) => f.easing === 'ease-in')).toBe(true);
    expect(frames[1].transform).toBe('translateY(-30px)');
  });
});

describe('buildCurvePath', () => {
  it('linear は左下から右上への直線ベジェ', () => {
    expect(buildCurvePath(EASING_BEZIERS.linear)).toBe(
      'M20,100 C20,100 100,20 100,20',
    );
  });
});
