import { describe, expect, it } from 'vitest';
import {
  TUNINGS,
  centsBetween,
  clampA4,
  detectPitch,
  frequencyToNote,
  midiToFrequency,
  nearestStringIndex,
  noteLabel,
  rms,
  tuneState,
} from './instrument-tuner';

const SAMPLE_RATE = 48000;

/** 基音＋倍音の合成波（ギター弦のように倍音が強い音を模す） */
function tone(
  frequency: number,
  harmonics: number[] = [1],
  length = 4096,
): Float32Array {
  const out = new Float32Array(length);
  for (let i = 0; i < length; i++) {
    let v = 0;
    harmonics.forEach((amp, h) => {
      v +=
        amp * Math.sin((2 * Math.PI * frequency * (h + 1) * i) / SAMPLE_RATE);
    });
    out[i] = 0.3 * v;
  }
  return out;
}

describe('midiToFrequency / frequencyToNote', () => {
  it('A4 = 440Hz、基準ピッチを変えられる', () => {
    expect(midiToFrequency(69)).toBeCloseTo(440, 6);
    expect(midiToFrequency(69, 442)).toBeCloseTo(442, 6);
    expect(midiToFrequency(40)).toBeCloseTo(82.4069, 3);
  });

  it('周波数から音名・オクターブ・セントを求める', () => {
    const a = frequencyToNote(440);
    expect(a).toMatchObject({ name: 'A', octave: 4, midi: 69 });
    expect(a.cents).toBeCloseTo(0, 6);
    const sharp = frequencyToNote(445);
    expect(sharp.name).toBe('A');
    expect(sharp.cents).toBeCloseTo(19.56, 1);
    const flat = frequencyToNote(110 * 2 ** (-20 / 1200));
    expect(flat).toMatchObject({ name: 'A', octave: 2 });
    expect(flat.cents).toBeCloseTo(-20, 6);
    expect(frequencyToNote(261.6256)).toMatchObject({ name: 'C', octave: 4 });
  });

  it('基準ピッチが違えば同じ周波数でもずれが変わる', () => {
    expect(frequencyToNote(442, 442).cents).toBeCloseTo(0, 6);
    expect(frequencyToNote(442, 440).cents).toBeGreaterThan(7);
  });

  it('noteLabel', () => {
    expect(noteLabel(40)).toBe('E2');
    expect(noteLabel(61)).toBe('C#4');
    expect(noteLabel(23)).toBe('B0');
    expect(noteLabel(0)).toBe('C-1');
    expect(noteLabel(127)).toBe('G9');
  });

  it('下方向のずれは負のセント、半音の境界で音名が切り替わる', () => {
    const low = frequencyToNote(440 * 2 ** (-30 / 1200));
    expect(low).toMatchObject({ name: 'A', octave: 4 });
    expect(low.cents).toBeCloseTo(-30, 6);
    // 半音の中間（+50セント）を超えると次の音になる
    expect(frequencyToNote(440 * 2 ** (49 / 1200)).name).toBe('A');
    expect(frequencyToNote(440 * 2 ** (51 / 1200)).name).toBe('A#');
  });
});

describe('プリセット', () => {
  it('ギター標準は E2 A2 D3 G3 B3 E4', () => {
    const guitar = TUNINGS.find((t) => t.id === 'guitar')!;
    expect(guitar.strings.map(noteLabel)).toEqual([
      'E2',
      'A2',
      'D3',
      'G3',
      'B3',
      'E4',
    ]);
  });

  it('ベースは E1 A1 D2 G2、ウクレレは G4 C4 E4 A4', () => {
    expect(
      TUNINGS.find((t) => t.id === 'bass')!.strings.map(noteLabel),
    ).toEqual(['E1', 'A1', 'D2', 'G2']);
    expect(
      TUNINGS.find((t) => t.id === 'ukulele')!.strings.map(noteLabel),
    ).toEqual(['G4', 'C4', 'E4', 'A4']);
  });

  it('最も近い弦を選ぶ', () => {
    const strings = TUNINGS.find((t) => t.id === 'guitar')!.strings;
    expect(nearestStringIndex(82, strings)).toBe(0);
    expect(nearestStringIndex(112, strings)).toBe(1);
    expect(nearestStringIndex(330, strings)).toBe(5);
    expect(nearestStringIndex(250, strings)).toBe(4);
  });
});

describe('centsBetween / tuneState', () => {
  it('1オクターブ = 1200セント', () => {
    expect(centsBetween(880, 440)).toBeCloseTo(1200, 6);
    expect(centsBetween(440, 440)).toBe(0);
    expect(centsBetween(220, 440)).toBeCloseTo(-1200, 6);
  });

  it('±5セント以内は合っている', () => {
    expect(tuneState(0)).toBe('in-tune');
    expect(tuneState(5)).toBe('in-tune');
    expect(tuneState(-5)).toBe('in-tune');
    expect(tuneState(5.1)).toBe('high');
    expect(tuneState(-12)).toBe('low');
    expect(tuneState(-5.1)).toBe('low');
    expect(tuneState(50)).toBe('high');
  });
});

describe('rms（音量）', () => {
  it('空の配列は 0', () => {
    expect(rms(new Float32Array(0))).toBe(0);
  });

  it('一定値の波形はその絶対値になる', () => {
    expect(rms(new Float32Array([0.5, -0.5, 0.5, -0.5]))).toBeCloseTo(0.5, 6);
  });

  it('正弦波の実効値は振幅の 1/√2', () => {
    expect(rms(tone(220, [1], 48000))).toBeCloseTo(0.3 / Math.SQRT2, 2);
  });
});

describe('clampA4', () => {
  it('410〜480の整数に収める', () => {
    expect(clampA4(440)).toBe(440);
    expect(clampA4(442.4)).toBe(442);
    expect(clampA4(100)).toBe(410);
    expect(clampA4(900)).toBe(480);
    expect(clampA4(NaN)).toBe(440);
  });

  it('境界値（丸め後の410・480）と無限大の扱い', () => {
    expect(clampA4(409.4)).toBe(410);
    expect(clampA4(480.4)).toBe(480);
    expect(clampA4(410)).toBe(410);
    expect(clampA4(480)).toBe(480);
    expect(clampA4(Infinity)).toBe(440);
    expect(clampA4(-Infinity)).toBe(440);
    expect(clampA4(0)).toBe(410);
  });
});

describe('detectPitch', () => {
  it.each([41.2, 82.41, 110, 196, 329.63, 440, 880])(
    '正弦波 %fHz を ±0.5% 以内で検出する',
    (f) => {
      const result = detectPitch(tone(f), SAMPLE_RATE);
      expect(result).not.toBeNull();
      expect(Math.abs(result!.frequency / f - 1)).toBeLessThan(0.005);
    },
  );

  it('基音より倍音が強くても、基音の周波数を返す（オクターブ誤検出なし）', () => {
    const f = 82.41;
    const result = detectPitch(tone(f, [0.4, 1, 0.8, 0.3]), SAMPLE_RATE);
    expect(result).not.toBeNull();
    expect(Math.abs(result!.frequency / f - 1)).toBeLessThan(0.005);
  });

  it('44.1kHzでも検出できる', () => {
    const f = 110;
    const samples = new Float32Array(4096);
    for (let i = 0; i < samples.length; i++) {
      samples[i] = 0.3 * Math.sin((2 * Math.PI * f * i) / 44100);
    }
    const result = detectPitch(samples, 44100);
    expect(Math.abs(result!.frequency / f - 1)).toBeLessThan(0.005);
  });

  it('1セント程度のずれを区別できる', () => {
    const target = 220;
    const f = target * 2 ** (10 / 1200);
    const result = detectPitch(tone(f), SAMPLE_RATE)!;
    expect(centsBetween(result.frequency, target)).toBeGreaterThan(8);
    expect(centsBetween(result.frequency, target)).toBeLessThan(12);
  });

  it('無音は null', () => {
    expect(detectPitch(new Float32Array(4096), SAMPLE_RATE)).toBeNull();
  });

  it('小さすぎる音は null', () => {
    const quiet = tone(220).map((v) => v * 0.01);
    expect(detectPitch(quiet, SAMPLE_RATE)).toBeNull();
  });

  it('ノイズは null（音程が定まらない）', () => {
    let seed = 12345;
    const noise = new Float32Array(4096);
    for (let i = 0; i < noise.length; i++) {
      seed = (seed * 1103515245 + 12345) & 0x7fffffff;
      noise[i] = (seed / 0x7fffffff - 0.5) * 0.6;
    }
    expect(detectPitch(noise, SAMPLE_RATE)).toBeNull();
  });

  it('短すぎる入力・不正なサンプルレートは null', () => {
    expect(detectPitch(new Float32Array(10), SAMPLE_RATE)).toBeNull();
    expect(detectPitch(tone(220), 0)).toBeNull();
    expect(detectPitch(tone(220), Number.NaN)).toBeNull();
  });

  it.each([30.87, 41.2, 1200])(
    '検出範囲の端に近い %fHz（ベース5弦のB0・高音域）も検出する',
    (f) => {
      const result = detectPitch(tone(f, [1], 8192), SAMPLE_RATE);
      expect(result).not.toBeNull();
      expect(Math.abs(result!.frequency / f - 1)).toBeLessThan(0.01);
    },
  );

  it('検出範囲の外の周波数（3kHz）を返さず、範囲内か null になる', () => {
    const result = detectPitch(tone(3000, [1], 4096), SAMPLE_RATE);
    expect(result === null || result.frequency <= 1400).toBe(true);
  });

  it('長い入力（約0.7秒）でも同じ周波数を返す', () => {
    const result = detectPitch(tone(196, [1], 32768), SAMPLE_RATE);
    expect(result).not.toBeNull();
    expect(Math.abs(result!.frequency / 196 - 1)).toBeLessThan(0.005);
  });

  it('基音が弱く2倍音が強い音でも、1オクターブ上を誤検出しない', () => {
    const f = 110;
    const result = detectPitch(tone(f, [0.2, 0.3, 1]), SAMPLE_RATE);
    expect(result).not.toBeNull();
    expect(Math.abs(result!.frequency / f - 1)).toBeLessThan(0.005);
  });

  it('検出範囲を引数で変えられる', () => {
    const result = detectPitch(tone(440, [1], 4096), SAMPLE_RATE, 400, 500);
    expect(result).not.toBeNull();
    expect(Math.abs(result!.frequency / 440 - 1)).toBeLessThan(0.005);
    // 純音の自己相関は周期の整数倍で繰り返すため、範囲が狭いと 440/3≈146.7Hz を返すことがある。
    // ここでは「返すなら指定範囲内」を確認する
    const narrow = detectPitch(tone(440, [1], 4096), SAMPLE_RATE, 100, 200);
    expect(
      narrow === null || (narrow.frequency >= 100 && narrow.frequency <= 200),
    ).toBe(true);
  });
});
