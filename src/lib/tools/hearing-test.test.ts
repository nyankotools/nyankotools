import { describe, it, expect } from 'vitest';
import {
  MAX_VOLUME_PERCENT,
  ageGuide,
  clampVolumePercent,
  envelopeGain,
  formatHz,
  frequencyList,
  hearingGain,
  isPlayable,
  maxPlayableFrequency,
  normalizeStep,
  toneSchedule,
} from './hearing-test';

describe('frequencyList', () => {
  it('1kHz刻みで8k〜20k', () => {
    const list = frequencyList(1000);
    expect(list[0]).toBe(8000);
    expect(list[list.length - 1]).toBe(20000);
    expect(list).toHaveLength(13);
  });
  it('500Hz刻み・2kHz刻み', () => {
    expect(frequencyList(500)).toHaveLength(25);
    expect(frequencyList(2000)).toEqual([
      8000, 10000, 12000, 14000, 16000, 18000, 20000,
    ]);
  });
  it('不正な間隔は既定値(1kHz)', () => {
    expect(normalizeStep(0)).toBe(1000);
    expect(normalizeStep(NaN)).toBe(1000);
    expect(frequencyList(-5)).toHaveLength(13);
  });
});

describe('音量', () => {
  it('上限と下限に収める', () => {
    expect(clampVolumePercent(100)).toBe(MAX_VOLUME_PERCENT);
    expect(clampVolumePercent(-3)).toBe(0);
    expect(clampVolumePercent(NaN)).toBe(10);
  });
  it('ゲインは0〜上限で単調増加', () => {
    expect(hearingGain(0)).toBe(0);
    expect(hearingGain(10)).toBeLessThan(hearingGain(20));
    expect(hearingGain(100)).toBe(hearingGain(MAX_VOLUME_PERCENT));
    expect(hearingGain(100)).toBeLessThanOrEqual(0.25);
  });
});

describe('再生可能な周波数', () => {
  it('サンプルレートの半分未満まで', () => {
    expect(maxPlayableFrequency(44100)).toBe(21609);
    expect(isPlayable(20000, 44100)).toBe(true);
    expect(isPlayable(20000, 32000)).toBe(false);
    expect(isPlayable(8000, 16000)).toBe(false);
  });
  it('不正なレートは0', () => {
    expect(maxPlayableFrequency(NaN)).toBe(0);
    expect(maxPlayableFrequency(-1)).toBe(0);
  });
});

describe('フェード', () => {
  it('スケジュール', () => {
    expect(toneSchedule(2, 0.15)).toEqual({
      attackEnd: 0.15,
      releaseStart: 1.85,
      end: 2,
    });
  });
  it('短い音ではフェードを半分ずつに縮める', () => {
    expect(toneSchedule(0.2, 0.5)).toEqual({
      attackEnd: 0.1,
      releaseStart: 0.1,
      end: 0.2,
    });
  });
  it('包絡は両端0・中間1', () => {
    expect(envelopeGain(0)).toBe(0);
    expect(envelopeGain(2)).toBe(0);
    expect(envelopeGain(0.075)).toBeCloseTo(0.5);
    expect(envelopeGain(1)).toBe(1);
    expect(envelopeGain(1.925)).toBeCloseTo(0.5);
    expect(envelopeGain(-1)).toBe(0);
    expect(envelopeGain(5)).toBe(0);
  });
});

describe('formatHz', () => {
  it('kHz表記', () => {
    expect(formatHz(8000)).toBe('8 kHz');
    expect(formatHz(12500)).toBe('12.5 kHz');
  });
});

describe('ageGuide', () => {
  it('未選択', () => {
    expect(ageGuide([])).toEqual({ highest: null, maxAge: null, kind: 'none' });
  });
  it('最高周波数で判定', () => {
    expect(ageGuide([8000, 12000, 16000]).maxAge).toBe(30);
    expect(ageGuide([8000, 20000]).maxAge).toBe(20);
    expect(ageGuide([17000]).maxAge).toBe(25);
    expect(ageGuide([14000, 8000]).maxAge).toBe(50);
    expect(ageGuide([12000]).maxAge).toBe(60);
  });
  it('12kHz未満は目安なし', () => {
    expect(ageGuide([8000, 11000])).toEqual({
      highest: 11000,
      maxAge: null,
      kind: 'low',
    });
  });
  it('境界値', () => {
    expect(ageGuide([18999]).maxAge).toBe(25);
    expect(ageGuide([19000]).maxAge).toBe(20);
  });
});
