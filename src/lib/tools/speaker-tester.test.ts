import { describe, it, expect } from 'vitest';
import {
  channelPan,
  clampFrequency,
  formatFrequency,
  frequencyToSlider,
  nearestNote,
  sliderToFrequency,
  sweepFrequency,
  volumeToGain,
} from './speaker-tester';

describe('channelPan', () => {
  it('左右と両方', () => {
    expect(channelPan('left')).toBe(-1);
    expect(channelPan('right')).toBe(1);
    expect(channelPan('both')).toBe(0);
  });
});

describe('clampFrequency', () => {
  it('範囲に収め、不正値は440', () => {
    expect(clampFrequency(5)).toBe(20);
    expect(clampFrequency(30000)).toBe(20000);
    expect(clampFrequency(1000)).toBe(1000);
    expect(clampFrequency(NaN)).toBe(440);
  });
});

describe('volumeToGain', () => {
  it('二乗カーブで0〜1', () => {
    expect(volumeToGain(0)).toBe(0);
    expect(volumeToGain(50)).toBeCloseTo(0.25);
    expect(volumeToGain(100)).toBe(1);
    expect(volumeToGain(200)).toBe(1);
  });
});

describe('sweepFrequency', () => {
  it('始点・終点・対数中点', () => {
    expect(sweepFrequency(0)).toBeCloseTo(20);
    expect(sweepFrequency(1)).toBeCloseTo(20000);
    expect(sweepFrequency(0.5)).toBeCloseTo(632.46, 1);
  });
});

describe('slider 変換', () => {
  it('往復してほぼ元に戻る', () => {
    expect(sliderToFrequency(0)).toBeCloseTo(20);
    expect(sliderToFrequency(1000)).toBeCloseTo(20000);
    const restored = sliderToFrequency(frequencyToSlider(1000));
    expect(restored).toBeGreaterThan(950);
    expect(restored).toBeLessThan(1050);
  });
});

describe('nearestNote', () => {
  it('音名を返す', () => {
    expect(nearestNote(440)).toBe('A4');
    expect(nearestNote(261.63)).toBe('C4');
    expect(nearestNote(20)).toBe('D♯0');
  });
});

describe('formatFrequency', () => {
  it('Hz と kHz', () => {
    expect(formatFrequency(440)).toBe('440 Hz');
    expect(formatFrequency(1000)).toBe('1 kHz');
    expect(formatFrequency(12500)).toBe('12.5 kHz');
  });
});
