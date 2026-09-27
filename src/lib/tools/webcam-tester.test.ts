import { describe, expect, it } from 'vitest';
import {
  calculateAudioLevel,
  calculateFps,
  classifyMediaError,
  formatResolution,
  getResolutionLabel,
  trimTimestamps,
} from './webcam-tester';

describe('classifyMediaError', () => {
  it('権限拒否・デバイスなし・使用中・制約エラーを分類する', () => {
    expect(classifyMediaError('NotAllowedError')).toBe('permission-denied');
    expect(classifyMediaError('NotFoundError')).toBe('not-found');
    expect(classifyMediaError('NotReadableError')).toBe('in-use');
    expect(classifyMediaError('OverconstrainedError')).toBe('constraints');
    expect(classifyMediaError('TypeError')).toBe('insecure');
  });
  it('未知の名前・undefined は unknown', () => {
    expect(classifyMediaError('Foo')).toBe('unknown');
    expect(classifyMediaError(undefined)).toBe('unknown');
  });
});

describe('resolution', () => {
  it('規格名を返す（縦向きも判定）', () => {
    expect(getResolutionLabel(1920, 1080)).toBe('Full HD (1080p)');
    expect(getResolutionLabel(1080, 1920)).toBe('Full HD (1080p)');
    expect(getResolutionLabel(1234, 567)).toBeNull();
  });
  it('表示用に整形する', () => {
    expect(formatResolution(1280, 720)).toBe('1280 × 720 (HD (720p))');
    expect(formatResolution(1000, 500)).toBe('1000 × 500');
  });
});

describe('calculateFps', () => {
  it('平均FPSを計算する', () => {
    const ts = Array.from({ length: 31 }, (_, i) => i * (1000 / 30));
    expect(calculateFps(ts)).toBeCloseTo(30, 5);
  });
  it('2点未満や経過0は null', () => {
    expect(calculateFps([])).toBeNull();
    expect(calculateFps([100])).toBeNull();
    expect(calculateFps([100, 100])).toBeNull();
  });
});

describe('trimTimestamps', () => {
  it('窓より古いものを除く', () => {
    expect(trimTimestamps([0, 500, 1500, 2000], 2000, 1000)).toEqual([
      1500, 2000,
    ]);
  });
});

describe('calculateAudioLevel', () => {
  it('無音は0、空配列も0', () => {
    expect(calculateAudioLevel(new Uint8Array(64).fill(128))).toBe(0);
    expect(calculateAudioLevel([])).toBe(0);
  });
  it('最大振幅は100', () => {
    const s = Array.from({ length: 64 }, (_, i) => (i % 2 ? 0 : 255));
    expect(calculateAudioLevel(s)).toBeGreaterThanOrEqual(99);
    expect(calculateAudioLevel(s)).toBeLessThanOrEqual(100);
  });
  it('小さな音は0より大きく100未満', () => {
    const s = Array.from({ length: 64 }, (_, i) => (i % 2 ? 118 : 138));
    const level = calculateAudioLevel(s);
    expect(level).toBeGreaterThan(0);
    expect(level).toBeLessThan(100);
  });
});
