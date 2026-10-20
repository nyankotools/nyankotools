import { describe, expect, it } from 'vitest';
import {
  KEY_COUNT,
  KEY_MAP,
  TIMBRES,
  baseMidi,
  buildKeys,
  clampOctave,
  clampVolume,
  codeToSemitone,
  countWhiteKeys,
  getTimbre,
  isBlackKey,
  midiToFrequency,
  peakGain,
  periodicWaveCoefficients,
  releaseStopDelay,
  semitoneToKeyLabel,
  shouldIgnoreKey,
} from './virtual-piano';

const none = { ctrlKey: false, metaKey: false, altKey: false };

describe('キー割り当て', () => {
  it('Z が最初の C、Q が1オクターブ上の C', () => {
    expect(codeToSemitone('KeyZ')).toBe(0);
    expect(codeToSemitone('KeyS')).toBe(1);
    expect(codeToSemitone('KeyM')).toBe(11);
    expect(codeToSemitone('KeyQ')).toBe(12);
    expect(codeToSemitone('Digit2')).toBe(13);
    expect(codeToSemitone('KeyP')).toBe(28);
  });

  it('割り当てのないキーは null', () => {
    expect(codeToSemitone('KeyA')).toBeNull();
    expect(codeToSemitone('Space')).toBeNull();
  });

  it('半音数が重複せず、鍵盤の範囲内に収まる', () => {
    const semitones = KEY_MAP.map((e) => e.semitone);
    expect(new Set(semitones).size).toBe(semitones.length);
    expect(Math.max(...semitones)).toBeLessThan(KEY_COUNT);
    expect(new Set(KEY_MAP.map((e) => e.code)).size).toBe(KEY_MAP.length);
  });

  it('キー名の表示', () => {
    expect(semitoneToKeyLabel(0)).toBe('Z');
    expect(semitoneToKeyLabel(13)).toBe('2');
    expect(semitoneToKeyLabel(30)).toBeNull();
  });
});

describe('周波数と音名', () => {
  it('A4 は 440Hz、C4 は約 261.63Hz', () => {
    expect(midiToFrequency(69)).toBe(440);
    expect(midiToFrequency(60)).toBeCloseTo(261.626, 2);
    expect(midiToFrequency(81)).toBeCloseTo(880, 6);
  });

  it('オクターブの左端 C の MIDI 番号', () => {
    expect(baseMidi(4)).toBe(60);
    expect(baseMidi(3)).toBe(48);
    expect(baseMidi(99)).toBe(baseMidi(6));
  });

  it('黒鍵の判定', () => {
    expect(
      [60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71].map(isBlackKey),
    ).toEqual([
      false,
      true,
      false,
      true,
      false,
      false,
      true,
      false,
      true,
      false,
      true,
      false,
    ]);
  });
});

describe('鍵盤の生成', () => {
  it('37鍵・白鍵22・黒鍵15で、C から C まで', () => {
    const keys = buildKeys(3);
    expect(keys).toHaveLength(KEY_COUNT);
    expect(keys[0].name).toBe('C3');
    expect(keys[36].name).toBe('C6');
    expect(countWhiteKeys(keys)).toBe(22);
    expect(keys.filter((k) => k.black)).toHaveLength(15);
  });

  it('白鍵の位置は連番で、黒鍵は左隣の白鍵の位置を指す', () => {
    const keys = buildKeys(4, 13);
    const whites = keys.filter((k) => !k.black).map((k) => k.whiteIndex);
    expect(whites).toEqual([0, 1, 2, 3, 4, 5, 6, 7]);
    const cSharp = keys[1];
    expect(cSharp.name).toBe('C#4');
    expect(cSharp.whiteIndex).toBe(0);
    expect(keys[3].name).toBe('D#4');
    expect(keys[3].whiteIndex).toBe(1);
  });

  it('範囲外のオクターブは丸める', () => {
    expect(clampOctave(0)).toBe(1);
    expect(clampOctave(9)).toBe(6);
    expect(clampOctave(Number.NaN)).toBe(3);
    expect(buildKeys(6)[36].midi).toBe(120);
  });
});

describe('音色とエンベロープ', () => {
  it('4種類の音色があり、未知の ID は先頭（ピアノ）になる', () => {
    expect(TIMBRES.map((t) => t.id)).toEqual([
      'piano',
      'sine',
      'square',
      'sawtooth',
    ]);
    expect(getTimbre('nope').id).toBe('piano');
    expect(getTimbre('square').wave).toBe('square');
  });

  it('エンベロープの値が妥当', () => {
    for (const t of TIMBRES) {
      const e = t.envelope;
      expect(e.attack).toBeGreaterThan(0);
      expect(e.decay).toBeGreaterThan(0);
      expect(e.release).toBeGreaterThan(0);
      expect(e.sustain).toBeGreaterThanOrEqual(0);
      expect(e.sustain).toBeLessThanOrEqual(1);
      expect(releaseStopDelay(e)).toBeGreaterThan(e.release);
    }
  });

  it('倍音の係数は先頭に直流成分 0 を持つ', () => {
    const { real, imag } = periodicWaveCoefficients([1, 0.5]);
    expect(real).toEqual([0, 0, 0]);
    expect(imag).toEqual([0, 1, 0.5]);
    const piano = getTimbre('piano');
    expect(piano.wave).toBe('custom');
    expect(piano.partials.length).toBeGreaterThan(1);
  });
});

describe('音量', () => {
  it('0 で無音、大きくするほど増え、1 を超えない', () => {
    const piano = getTimbre('piano');
    expect(peakGain(0, piano)).toBe(0);
    expect(peakGain(50, piano)).toBeLessThan(peakGain(100, piano));
    for (const t of TIMBRES) expect(peakGain(100, t)).toBeLessThanOrEqual(0.4);
  });

  it('範囲外・不正な値を丸める', () => {
    expect(clampVolume(-5)).toBe(0);
    expect(clampVolume(500)).toBe(100);
    expect(clampVolume(Number.NaN)).toBe(60);
  });
});

describe('キー入力を無視する条件', () => {
  it('修飾キーが押されていれば無視する', () => {
    expect(shouldIgnoreKey({ ...none, ctrlKey: true }, null)).toBe(true);
    expect(shouldIgnoreKey({ ...none, metaKey: true }, null)).toBe(true);
    expect(shouldIgnoreKey({ ...none, altKey: true }, null)).toBe(true);
  });

  it('文字入力できる要素では無視する', () => {
    expect(shouldIgnoreKey(none, { tagName: 'TEXTAREA' })).toBe(true);
    expect(shouldIgnoreKey(none, { tagName: 'SELECT' })).toBe(true);
    expect(shouldIgnoreKey(none, { tagName: 'INPUT', type: 'text' })).toBe(
      true,
    );
    expect(shouldIgnoreKey(none, { tagName: 'INPUT' })).toBe(true);
    expect(
      shouldIgnoreKey(none, { tagName: 'DIV', isContentEditable: true }),
    ).toBe(true);
  });

  it('スライダー・チェックボックス・ボタンやページ本体では演奏できる', () => {
    expect(shouldIgnoreKey(none, { tagName: 'INPUT', type: 'range' })).toBe(
      false,
    );
    expect(shouldIgnoreKey(none, { tagName: 'input', type: 'checkbox' })).toBe(
      false,
    );
    expect(shouldIgnoreKey(none, { tagName: 'BUTTON' })).toBe(false);
    expect(shouldIgnoreKey(none, { tagName: 'BODY' })).toBe(false);
    expect(shouldIgnoreKey(none, null)).toBe(false);
  });
});
