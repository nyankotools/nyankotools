import { describe, expect, it } from 'vitest';
import {
  clampTimerMinutes,
  fadeGain,
  fadeSeconds,
  formatTimer,
  generateLoopableNoise,
  generateNoise,
  outputGain,
} from './noise-generator';

/** 再現性のある簡易乱数（mulberry32） */
function seeded(seed: number) {
  let a = seed;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** 隣接サンプルの差の平均（高域が多いほど大きい） */
function roughness(data: Float32Array): number {
  let sum = 0;
  for (let i = 1; i < data.length; i++) sum += Math.abs(data[i] - data[i - 1]);
  return sum / (data.length - 1);
}

describe('generateNoise', () => {
  it('指定した長さで -1〜1 に収まる', () => {
    for (const type of ['white', 'pink', 'brown'] as const) {
      const data = generateNoise(type, 5000, seeded(1));
      expect(data.length).toBe(5000);
      expect(Math.max(...data)).toBeLessThanOrEqual(1);
      expect(Math.min(...data)).toBeGreaterThanOrEqual(-1);
    }
  });

  it('ピンク・ブラウンはピークが 1 に正規化される', () => {
    for (const type of ['pink', 'brown'] as const) {
      const data = generateNoise(type, 5000, seeded(2));
      const peak = Math.max(...Array.from(data, Math.abs));
      expect(peak).toBeCloseTo(1, 5);
    }
  });

  it('高域の多さは ホワイト > ピンク > ブラウン', () => {
    const w = roughness(generateNoise('white', 20000, seeded(3)));
    const p = roughness(generateNoise('pink', 20000, seeded(3)));
    const b = roughness(generateNoise('brown', 20000, seeded(3)));
    expect(w).toBeGreaterThan(p);
    expect(p).toBeGreaterThan(b);
  });

  it('同じ乱数列なら同じ結果になる', () => {
    expect(generateNoise('pink', 100, seeded(9))).toEqual(
      generateNoise('pink', 100, seeded(9)),
    );
  });

  it('長さ 0 や負数は空配列', () => {
    expect(generateNoise('white', 0).length).toBe(0);
    expect(generateNoise('brown', -5).length).toBe(0);
  });

  it('乱数が常に 0.5（無音）でもNaNにならない', () => {
    const data = generateNoise('pink', 10, () => 0.5);
    expect(Array.from(data).every((v) => v === 0)).toBe(true);
  });
});

describe('generateLoopableNoise', () => {
  it('長さが指定どおりで、つなぎ目の段差が小さい', () => {
    const data = generateLoopableNoise('brown', 4000, 400, seeded(4));
    expect(data.length).toBe(4000);
    const seam = Math.abs(data[0] - data[data.length - 1]);
    expect(seam).toBeLessThan(0.2);
  });

  it('フェード長が全体より長くても壊れない', () => {
    const data = generateLoopableNoise('white', 10, 100, seeded(5));
    expect(data.length).toBe(10);
    expect(Array.from(data).every(Number.isFinite)).toBe(true);
  });

  it('フェード長 0 は通常のノイズ', () => {
    expect(generateLoopableNoise('white', 50, 0, seeded(6)).length).toBe(50);
  });
});

describe('formatTimer', () => {
  it('分:秒 と 時:分:秒', () => {
    expect(formatTimer(0)).toBe('0:00');
    expect(formatTimer(65)).toBe('1:05');
    expect(formatTimer(3600)).toBe('1:00:00');
    expect(formatTimer(3725)).toBe('1:02:05');
  });

  it('小数は切り上げ、負数・非数は 0', () => {
    expect(formatTimer(59.2)).toBe('1:00');
    expect(formatTimer(-3)).toBe('0:00');
    expect(formatTimer(NaN)).toBe('0:00');
    expect(formatTimer(Infinity)).toBe('0:00');
  });
});

describe('clampTimerMinutes', () => {
  it('範囲内の整数にする', () => {
    expect(clampTimerMinutes(30.4)).toBe(30);
    expect(clampTimerMinutes(-1)).toBe(0);
    expect(clampTimerMinutes(9999)).toBe(480);
    expect(clampTimerMinutes(NaN)).toBe(0);
  });
});

describe('fade', () => {
  it('フェード長は最大10秒、短いタイマーでは半分', () => {
    expect(fadeSeconds(3600)).toBe(10);
    expect(fadeSeconds(8)).toBe(4);
    expect(fadeSeconds(0)).toBe(0);
    expect(fadeSeconds(Infinity)).toBe(0);
  });

  it('残り時間に比例してゲインが下がる', () => {
    expect(fadeGain(30, 10)).toBe(1);
    expect(fadeGain(10, 10)).toBe(1);
    expect(fadeGain(5, 10)).toBeCloseTo(0.5);
    expect(fadeGain(0, 10)).toBe(0);
    expect(fadeGain(-2, 10)).toBe(0);
    expect(fadeGain(5, 0)).toBe(1);
  });

  it('出力ゲインは音量カーブとフェードの積', () => {
    expect(outputGain(100, 1)).toBe(1);
    expect(outputGain(50, 0.5)).toBeCloseTo(0.125);
    expect(outputGain(50, 2)).toBeCloseTo(0.25);
    expect(outputGain(0, 1)).toBe(0);
  });
});
