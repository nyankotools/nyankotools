import { describe, expect, it } from 'vitest';
import {
  analyzeFrequency,
  centsBetween,
  clampA4,
  formatCents,
  formatFrequency,
  frequencyTable,
  frequencyToMidi,
  midiToFrequency,
  noteLabel,
  parseNoteName,
  pitchClassName,
  tableToTsv,
} from './note-frequency-converter';

describe('midiToFrequency / frequencyToMidi', () => {
  it('A4 = 440Hz', () => {
    expect(midiToFrequency(69)).toBe(440);
    expect(frequencyToMidi(440)).toBe(69);
  });
  it('中央のド C4 は約 261.63Hz', () => {
    expect(midiToFrequency(60)).toBeCloseTo(261.6256, 3);
  });
  it('基準ピッチを変えると全体が比例する', () => {
    expect(midiToFrequency(69, 442)).toBe(442);
    expect(midiToFrequency(81, 432)).toBeCloseTo(864, 6);
  });
  it('往復で元に戻る', () => {
    expect(frequencyToMidi(midiToFrequency(57.3, 415), 415)).toBeCloseTo(
      57.3,
      9,
    );
  });
});

describe('clampA4', () => {
  it('範囲内はそのまま、小数第2位まで', () => {
    expect(clampA4(442)).toBe(442);
    expect(clampA4(432.456)).toBe(432.46);
  });
  it('範囲外は収める', () => {
    expect(clampA4(100)).toBe(400);
    expect(clampA4(900)).toBe(480);
  });
  it('数値でなければ 440', () => {
    expect(clampA4(NaN)).toBe(440);
    expect(clampA4(Infinity)).toBe(440);
  });
});

describe('noteLabel / pitchClassName', () => {
  it('MIDI 60 は C4、69 は A4、0 は C-1', () => {
    expect(noteLabel(60)).toBe('C4');
    expect(noteLabel(69)).toBe('A4');
    expect(noteLabel(0)).toBe('C-1');
    expect(noteLabel(127)).toBe('G9');
  });
  it('シャープとフラットを切り替えられる', () => {
    expect(noteLabel(61)).toBe('C#4');
    expect(noteLabel(61, 'flat')).toBe('Db4');
    expect(pitchClassName(70, 'flat')).toBe('Bb');
  });
  it('負の値でも音名が崩れない', () => {
    expect(pitchClassName(-1)).toBe('B');
  });
});

describe('parseNoteName', () => {
  it('基本の表記', () => {
    expect(parseNoteName('A4')).toBe(69);
    expect(parseNoteName('C4')).toBe(60);
    expect(parseNoteName('c4')).toBe(60);
    expect(parseNoteName('C-1')).toBe(0);
    expect(parseNoteName('G9')).toBe(127);
  });
  it('シャープ・フラット（記号・全角も可）', () => {
    expect(parseNoteName('C#4')).toBe(61);
    expect(parseNoteName('Db4')).toBe(61);
    expect(parseNoteName('B♭3')).toBe(58);
    expect(parseNoteName('F♯2')).toBe(42);
    expect(parseNoteName('Ａ＃４')).toBe(70);
  });
  it('小文字 b は音名にもフラットにもなる', () => {
    expect(parseNoteName('b4')).toBe(71);
    expect(parseNoteName('bb4')).toBe(70);
  });
  it('前後の空白は許す', () => {
    expect(parseNoteName('  A4 ')).toBe(69);
  });
  it('不正な表記や範囲外は null', () => {
    expect(parseNoteName('')).toBeNull();
    expect(parseNoteName('H4')).toBeNull();
    expect(parseNoteName('A')).toBeNull();
    expect(parseNoteName('A#')).toBeNull();
    expect(parseNoteName('C-2')).toBeNull();
    expect(parseNoteName('G#9')).toBeNull();
    expect(parseNoteName('A4x')).toBeNull();
  });
  it('境界の音名（Cb・E#・B#・MIDI 0 と 127 の外側）', () => {
    expect(parseNoteName('Cb4')).toBe(59);
    expect(parseNoteName('E#4')).toBe(65);
    expect(parseNoteName('B#4')).toBe(72);
    expect(parseNoteName('Cb-1')).toBeNull();
    expect(parseNoteName('G#9')).toBeNull();
    expect(parseNoteName('A10')).toBeNull();
    expect(parseNoteName('A－1')).toBe(9);
  });
  it('全角スペース・ハイフン付きの入力を正規化する', () => {
    expect(parseNoteName('　A4　')).toBe(69);
    expect(parseNoteName('C−1')).toBe(0);
  });
});

describe('周波数の境界値', () => {
  it('入力範囲の端（1Hz・30000Hz）は有効、その外は null', () => {
    expect(analyzeFrequency(1)).not.toBeNull();
    expect(analyzeFrequency(30000)).not.toBeNull();
    expect(analyzeFrequency(0.5)).toBeNull();
    expect(analyzeFrequency(30000.1)).toBeNull();
  });
  it('A4 基準ピッチの下限・上限（400Hz・480Hz）', () => {
    expect(clampA4(400)).toBe(400);
    expect(clampA4(480)).toBe(480);
    expect(clampA4(479.999)).toBe(480);
    expect(clampA4(-Infinity)).toBe(440);
  });
  it('大きな周波数の整形は小数第2位まで', () => {
    expect(formatFrequency(30000)).toBe('30000');
    expect(formatFrequency(0.001)).toBe('0');
  });
});

describe('analyzeFrequency', () => {
  it('440Hz は A4 でずれ 0', () => {
    const r = analyzeFrequency(440)!;
    expect(r.name).toBe('A');
    expect(r.octave).toBe(4);
    expect(r.midi).toBe(69);
    expect(r.cents).toBeCloseTo(0, 9);
    expect(r.nearestFrequency).toBe(440);
  });
  it('少しずれた周波数のセントを求める', () => {
    // 440 * 2^(10/1200) ≒ 442.55Hz は +10 セント
    const r = analyzeFrequency(440 * 2 ** (10 / 1200))!;
    expect(r.midi).toBe(69);
    expect(r.cents).toBeCloseTo(10, 6);
  });
  it('半音の半分を超えると隣の音になる', () => {
    const r = analyzeFrequency(440 * 2 ** (60 / 1200))!;
    expect(r.midi).toBe(70);
    expect(r.cents).toBeCloseTo(-40, 6);
  });
  it('基準ピッチ 432Hz なら 432Hz が A4', () => {
    const r = analyzeFrequency(432, 432)!;
    expect(r.name).toBe('A');
    expect(r.cents).toBeCloseTo(0, 9);
  });
  it('フラット表記を選べる', () => {
    expect(analyzeFrequency(midiToFrequency(61), 440, 'flat')!.name).toBe('Db');
  });
  it('範囲外・不正値は null', () => {
    expect(analyzeFrequency(0)).toBeNull();
    expect(analyzeFrequency(-5)).toBeNull();
    expect(analyzeFrequency(NaN)).toBeNull();
    expect(analyzeFrequency(100000)).toBeNull();
  });
});

describe('centsBetween', () => {
  it('1オクターブは 1200 セント、半音は 100 セント', () => {
    expect(centsBetween(880, 440)).toBeCloseTo(1200, 9);
    expect(centsBetween(midiToFrequency(70), 440)).toBeCloseTo(100, 9);
    expect(centsBetween(220, 440)).toBeCloseTo(-1200, 9);
  });
});

describe('formatFrequency / formatCents', () => {
  it('周波数は小数第2位まで、末尾の0なし', () => {
    expect(formatFrequency(440)).toBe('440');
    expect(formatFrequency(261.6256)).toBe('261.63');
    expect(formatFrequency(27.5)).toBe('27.5');
    expect(formatFrequency(NaN)).toBe('');
  });
  it('セントは符号つき小数第1位', () => {
    expect(formatCents(12.34)).toBe('+12.3');
    expect(formatCents(-4.96)).toBe('-5.0');
    expect(formatCents(0)).toBe('0.0');
    expect(formatCents(-0.001)).toBe('0.0');
  });
});

describe('frequencyTable / tableToTsv', () => {
  const rows = frequencyTable();
  it('オクターブ0〜8の9行・各12音', () => {
    expect(rows).toHaveLength(9);
    expect(rows.every((r) => r.cells.length === 12)).toBe(true);
    expect(rows[0].octave).toBe(0);
    expect(rows[8].octave).toBe(8);
  });
  it('A4 のセルは 440Hz、A0 は 27.5Hz', () => {
    const a4 = rows[4].cells[9];
    expect(a4.name).toBe('A');
    expect(a4.midi).toBe(69);
    expect(a4.frequency).toBe(440);
    expect(formatFrequency(rows[0].cells[9].frequency)).toBe('27.5');
  });
  it('基準ピッチとフラット表記が反映される', () => {
    const r = frequencyTable(442, 'flat');
    expect(r[4].cells[9].frequency).toBe(442);
    expect(r[4].cells[1].name).toBe('Db');
  });
  it('TSV は見出し行 + 9行', () => {
    const lines = tableToTsv(rows).split('\n');
    expect(lines).toHaveLength(10);
    expect(lines[0]).toBe('\tC\tC#\tD\tD#\tE\tF\tF#\tG\tG#\tA\tA#\tB');
    expect(lines[5].split('\t')[10]).toBe('440');
    expect(tableToTsv([])).toBe('');
  });
});
