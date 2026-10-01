import { describe, it, expect } from 'vitest';
import {
  calculatePeakAmplitude,
  calculateRmsDb,
  extensionForMime,
  formatDuration,
  isClipping,
  pickRecorderMimeType,
  updatePeakHold,
} from './mic-tester';

const silence = new Uint8Array(1024).fill(128);

describe('calculatePeakAmplitude', () => {
  it('無音は0', () => {
    expect(calculatePeakAmplitude(silence)).toBe(0);
  });

  it('最大振幅は1、正負どちらでも拾う', () => {
    expect(calculatePeakAmplitude([128, 255, 128])).toBeCloseTo(127 / 128);
    expect(calculatePeakAmplitude([128, 0, 128])).toBe(1);
  });

  it('空配列は0', () => {
    expect(calculatePeakAmplitude([])).toBe(0);
  });
});

describe('calculateRmsDb', () => {
  it('無音と空配列は下限の-100', () => {
    expect(calculateRmsDb(silence)).toBe(-100);
    expect(calculateRmsDb([])).toBe(-100);
  });

  it('フルスケールの矩形波は約0dB', () => {
    const square = new Uint8Array(1024).map((_, i) => (i % 2 ? 0 : 256 - 1));
    expect(calculateRmsDb(square)).toBeGreaterThan(-0.2);
    expect(calculateRmsDb(square)).toBeLessThanOrEqual(0);
  });

  it('振幅が半分なら約-6dB', () => {
    const half = new Uint8Array(1024).map((_, i) => (i % 2 ? 64 : 192));
    expect(calculateRmsDb(half)).toBeCloseTo(-6.02, 1);
  });
});

describe('isClipping', () => {
  it('しきい値以上でtrue', () => {
    expect(isClipping(0.99)).toBe(true);
    expect(isClipping(1)).toBe(true);
    expect(isClipping(0.98)).toBe(false);
  });
});

describe('updatePeakHold', () => {
  it('現在値が上回れば更新', () => {
    expect(updatePeakHold(30, 50, 2)).toBe(50);
  });

  it('下回れば decay ずつ下がる', () => {
    expect(updatePeakHold(50, 10, 2)).toBe(48);
  });

  it('現在値より下には下がらない', () => {
    expect(updatePeakHold(11, 10, 5)).toBe(10);
  });
});

describe('formatDuration', () => {
  it('m:ss 形式', () => {
    expect(formatDuration(0)).toBe('0:00');
    expect(formatDuration(5.9)).toBe('0:05');
    expect(formatDuration(65)).toBe('1:05');
    expect(formatDuration(300)).toBe('5:00');
  });

  it('負数は0:00', () => {
    expect(formatDuration(-3)).toBe('0:00');
  });
});

describe('pickRecorderMimeType', () => {
  it('対応している最初の候補を返す', () => {
    expect(pickRecorderMimeType((m) => m === 'audio/mp4')).toBe('audio/mp4');
    expect(pickRecorderMimeType(() => true)).toBe('audio/webm;codecs=opus');
  });

  it('どれも非対応ならnull', () => {
    expect(pickRecorderMimeType(() => false)).toBeNull();
  });
});

describe('extensionForMime', () => {
  it('形式に応じた拡張子', () => {
    expect(extensionForMime('audio/webm;codecs=opus')).toBe('webm');
    expect(extensionForMime('audio/mp4')).toBe('m4a');
    expect(extensionForMime('audio/ogg;codecs=opus')).toBe('ogg');
    expect(extensionForMime('')).toBe('webm');
  });
});
