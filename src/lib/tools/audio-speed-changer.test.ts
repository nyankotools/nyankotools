import { describe, expect, it } from 'vitest';
import {
  buildOutputFileName,
  encodeWav,
  encodeWavBlob,
  formatDuration,
  formatFileSize,
  isAcceptedAudioFile,
  parseSemitones,
  parseSpeed,
  processAudio,
  resample,
  semitonesToRatio,
  timeStretch,
} from './audio-speed-changer';

function sine(freq: number, seconds: number, sampleRate: number): Float32Array {
  const n = Math.round(seconds * sampleRate);
  const out = new Float32Array(n);
  for (let i = 0; i < n; i++) {
    out[i] = 0.5 * Math.sin((2 * Math.PI * freq * i) / sampleRate);
  }
  return out;
}

/** 立ち上がりゼロクロス数から周波数を推定する */
function estimateFreq(data: Float32Array, sampleRate: number): number {
  let crossings = 0;
  for (let i = 1; i < data.length; i++) {
    if (data[i - 1] < 0 && data[i] >= 0) crossings++;
  }
  return crossings / (data.length / sampleRate);
}

describe('encodeWav', () => {
  it('44バイトのヘッダとPCMデータを書く', () => {
    const bytes = encodeWav([new Float32Array([0, 1, -1, 0.5])], 8000);
    expect(bytes.length).toBe(44 + 8);
    const view = new DataView(bytes.buffer);
    const str = (o: number, n: number) =>
      String.fromCharCode(...bytes.slice(o, o + n));
    expect(str(0, 4)).toBe('RIFF');
    expect(str(8, 4)).toBe('WAVE');
    expect(str(12, 4)).toBe('fmt ');
    expect(str(36, 4)).toBe('data');
    expect(view.getUint32(4, true)).toBe(36 + 8);
    expect(view.getUint16(20, true)).toBe(1);
    expect(view.getUint16(22, true)).toBe(1);
    expect(view.getUint32(24, true)).toBe(8000);
    expect(view.getUint32(28, true)).toBe(16000);
    expect(view.getUint16(34, true)).toBe(16);
    expect(view.getUint32(40, true)).toBe(8);
    expect(view.getInt16(44, true)).toBe(0);
    expect(view.getInt16(46, true)).toBe(32767);
    expect(view.getInt16(48, true)).toBe(-32768);
    expect(view.getInt16(50, true)).toBe(16384);
  });

  it('ステレオはインターリーブされる', () => {
    const bytes = encodeWav(
      [new Float32Array([1, 0]), new Float32Array([-1, 0])],
      44100,
    );
    const view = new DataView(bytes.buffer);
    expect(view.getUint16(22, true)).toBe(2);
    expect(view.getUint16(32, true)).toBe(4);
    expect(view.getInt16(44, true)).toBe(32767);
    expect(view.getInt16(46, true)).toBe(-32768);
    expect(bytes.length).toBe(44 + 8);
  });

  it('範囲外の値はクリップされる', () => {
    const bytes = encodeWav([new Float32Array([2, -3])], 8000);
    const view = new DataView(bytes.buffer);
    expect(view.getInt16(44, true)).toBe(32767);
    expect(view.getInt16(46, true)).toBe(-32768);
  });

  it('長さの異なるチャンネルは最短に合わせ、空データも書ける', () => {
    const bytes = encodeWav([new Float32Array(3), new Float32Array(2)], 8000);
    expect(bytes.length).toBe(44 + 2 * 2 * 2);
    expect(encodeWav([new Float32Array(0)], 8000).length).toBe(44);
  });

  it('不正な入力は例外', () => {
    expect(() => encodeWav([], 8000)).toThrow();
    expect(() => encodeWav([new Float32Array(1)], 0)).toThrow();
  });

  it('Blob を返せる', () => {
    const blob = encodeWavBlob([new Float32Array(10)], 8000);
    expect(blob.type).toBe('audio/wav');
    expect(blob.size).toBe(44 + 20);
  });
});

describe('resample', () => {
  it('2倍速で長さが半分、周波数が2倍になる', () => {
    const sr = 8000;
    const out = resample([sine(440, 1, sr)], 2)[0];
    expect(out.length).toBe(4000);
    expect(estimateFreq(out, sr)).toBeGreaterThan(870);
    expect(estimateFreq(out, sr)).toBeLessThan(890);
  });

  it('等倍はコピー、0.5倍で長さが2倍', () => {
    const src = new Float32Array([0, 1, 0, -1]);
    const same = resample([src], 1)[0];
    expect(Array.from(same)).toEqual(Array.from(src));
    expect(same).not.toBe(src);
    expect(resample([src], 0.5)[0].length).toBe(8);
  });

  it('不正な比率は例外、空配列は空のまま', () => {
    expect(() => resample([new Float32Array(1)], 0)).toThrow();
    expect(resample([new Float32Array(0)], 2)[0].length).toBe(0);
  });
});

describe('timeStretch', () => {
  const sr = 16000;
  it('2倍速で長さが半分になり、ピッチは保たれる', () => {
    const out = timeStretch([sine(440, 2, sr)], 2, sr)[0];
    expect(out.length).toBe(sr);
    const f = estimateFreq(out.slice(1000, out.length - 1000), sr);
    expect(f).toBeGreaterThan(420);
    expect(f).toBeLessThan(460);
  });

  it('0.5倍速で長さが2倍になり、ピッチは保たれる', () => {
    const out = timeStretch([sine(440, 1, sr)], 0.5, sr)[0];
    expect(out.length).toBe(2 * sr);
    const f = estimateFreq(out.slice(1000, out.length - 1000), sr);
    expect(f).toBeGreaterThan(420);
    expect(f).toBeLessThan(460);
  });

  it('振幅が大きく変わらない', () => {
    const out = timeStretch([sine(440, 1, sr)], 1.5, sr)[0];
    let max = 0;
    for (let i = 2000; i < out.length - 2000; i++)
      max = Math.max(max, Math.abs(out[i]));
    expect(max).toBeGreaterThan(0.4);
    expect(max).toBeLessThan(0.6);
  });

  it('等倍・空入力・複数チャンネル', () => {
    const src = sine(440, 0.1, sr);
    expect(timeStretch([src], 1, sr)[0].length).toBe(src.length);
    expect(timeStretch([new Float32Array(0)], 2, sr)[0].length).toBe(0);
    const stereo = timeStretch([src, src], 2, sr);
    expect(stereo).toHaveLength(2);
    expect(stereo[0].length).toBe(stereo[1].length);
    expect(() => timeStretch([src], 0, sr)).toThrow();
  });

  it('フレームより短い入力でも例外なく動く', () => {
    const out = timeStretch([new Float32Array([0.1, 0.2, 0.3])], 2, sr)[0];
    expect(out.length).toBe(2);
  });
});

describe('processAudio', () => {
  const sr = 16000;
  it('独立モード: 速度のみ変更しピッチ維持', () => {
    const r = processAudio([sine(440, 2, sr)], sr, {
      speed: 2,
      semitones: 0,
      mode: 'independent',
    });
    expect(r.duration).toBeCloseTo(1, 2);
    const f = estimateFreq(r.channels[0].slice(1000, -1000), sr);
    expect(f).toBeGreaterThan(420);
    expect(f).toBeLessThan(460);
  });

  it('独立モード: +12半音で長さそのまま周波数2倍', () => {
    const r = processAudio([sine(440, 1, sr)], sr, {
      speed: 1,
      semitones: 12,
      mode: 'independent',
    });
    expect(r.duration).toBeCloseTo(1, 2);
    const f = estimateFreq(r.channels[0].slice(1000, -1000), sr);
    expect(f).toBeGreaterThan(850);
    expect(f).toBeLessThan(910);
  });

  it('連動モード: 半音指定は無視され、速度に応じてピッチが変わる', () => {
    const r = processAudio([sine(440, 1, sr)], sr, {
      speed: 2,
      semitones: 5,
      mode: 'linked',
    });
    expect(r.duration).toBeCloseTo(0.5, 2);
    expect(estimateFreq(r.channels[0], sr)).toBeGreaterThan(860);
  });

  it('不正な速度は例外', () => {
    expect(() =>
      processAudio([new Float32Array(10)], sr, {
        speed: 0,
        semitones: 0,
        mode: 'linked',
      }),
    ).toThrow();
  });
});

describe('parse', () => {
  it('速度の解釈と範囲', () => {
    expect(parseSpeed('1.5')).toEqual({ ok: true, value: 1.5 });
    expect(parseSpeed(' ０．７５ ')).toEqual({ ok: true, value: 0.75 });
    expect(parseSpeed('1,25')).toEqual({ ok: true, value: 1.25 });
    expect(parseSpeed('')).toEqual({ ok: false, error: 'invalid' });
    expect(parseSpeed('abc')).toEqual({ ok: false, error: 'invalid' });
    expect(parseSpeed('0.1')).toEqual({ ok: false, error: 'outOfRange' });
    expect(parseSpeed('5')).toEqual({ ok: false, error: 'outOfRange' });
  });

  it('半音の解釈と範囲', () => {
    expect(parseSemitones('-3')).toEqual({ ok: true, value: -3 });
    expect(parseSemitones('－２')).toEqual({ ok: true, value: -2 });
    expect(parseSemitones('+4')).toEqual({ ok: true, value: 4 });
    expect(parseSemitones('13')).toEqual({ ok: false, error: 'outOfRange' });
    expect(parseSemitones('x')).toEqual({ ok: false, error: 'invalid' });
  });

  it('半音→比率', () => {
    expect(semitonesToRatio(12)).toBeCloseTo(2);
    expect(semitonesToRatio(-12)).toBeCloseTo(0.5);
    expect(semitonesToRatio(0)).toBe(1);
  });
});

describe('補助関数', () => {
  it('出力ファイル名', () => {
    const base = { speed: 1, semitones: 0, mode: 'independent' as const };
    expect(buildOutputFileName('song.mp3', base)).toBe('song-copy.wav');
    expect(buildOutputFileName('song.mp3', { ...base, speed: 1.5 })).toBe(
      'song-1.5x.wav',
    );
    expect(
      buildOutputFileName('a.b.m4a', { ...base, speed: 0.75, semitones: -2 }),
    ).toBe('a.b-0.75x--2st.wav');
    expect(
      buildOutputFileName('song', { speed: 2, semitones: 3, mode: 'linked' }),
    ).toBe('song-2x.wav');
    expect(buildOutputFileName('.mp3', { ...base, semitones: 2 })).toBe(
      'audio-+2st.wav',
    );
  });

  it('時間表示', () => {
    expect(formatDuration(0)).toBe('0:00');
    expect(formatDuration(65.4)).toBe('1:05');
    expect(formatDuration(3725)).toBe('1:02:05');
  });

  it('対応ファイル判定', () => {
    expect(isAcceptedAudioFile({ name: 'a.mp3', type: '' })).toBe(true);
    expect(isAcceptedAudioFile({ name: 'a', type: 'audio/wav' })).toBe(true);
    expect(isAcceptedAudioFile({ name: 'a.txt', type: 'text/plain' })).toBe(
      false,
    );
  });

  it('拡張子は大文字小文字を問わず、動画コンテナ(mp4など)も対象', () => {
    expect(isAcceptedAudioFile({ name: 'SONG.MP3', type: '' })).toBe(true);
    expect(isAcceptedAudioFile({ name: 'clip.MP4', type: '' })).toBe(true);
    expect(
      isAcceptedAudioFile({ name: 'movie.mkv', type: 'video/x-matroska' }),
    ).toBe(true);
    expect(isAcceptedAudioFile({ name: 'image.png', type: 'image/png' })).toBe(
      false,
    );
  });

  it('出力ファイル名は日本語名でも拡張子だけを置き換える', () => {
    const base = { speed: 1.5, semitones: 0, mode: 'independent' as const };
    expect(buildOutputFileName('歌声テスト.mp3', base)).toBe(
      '歌声テスト-1.5x.wav',
    );
    expect(buildOutputFileName('my.song.v2.flac', base)).toBe(
      'my.song.v2-1.5x.wav',
    );
  });

  it('ファイルサイズの表示単位（B / KB / MB）', () => {
    expect(formatFileSize(0)).toBe('0 B');
    expect(formatFileSize(1023)).toBe('1023 B');
    expect(formatFileSize(1536)).toBe('1.5 KB');
    expect(formatFileSize(5 * 1024 * 1024)).toBe('5.0 MB');
    expect(formatFileSize(200 * 1024 * 1024)).toBe('200.0 MB');
  });

  it('速度の境界値（0.25 と 4 は有効、外側は範囲外）', () => {
    expect(parseSpeed('0.25')).toEqual({ ok: true, value: 0.25 });
    expect(parseSpeed('4')).toEqual({ ok: true, value: 4 });
    expect(parseSpeed('0.2499')).toEqual({ ok: false, error: 'outOfRange' });
    expect(parseSpeed('4.01')).toEqual({ ok: false, error: 'outOfRange' });
    expect(parseSpeed('-1')).toEqual({ ok: false, error: 'outOfRange' });
  });

  it('無音・空の入力でも長さ0で落ちない', () => {
    const empty = processAudio([new Float32Array(0)], 16000, {
      speed: 2,
      semitones: 3,
      mode: 'independent',
    });
    expect(empty.duration).toBe(0);
    const silent = processAudio([new Float32Array(16000)], 16000, {
      speed: 2,
      semitones: 0,
      mode: 'linked',
    });
    expect(silent.duration).toBeCloseTo(0.5, 2);
    expect(Array.from(silent.channels[0]).every((v) => v === 0)).toBe(true);
  });
});
