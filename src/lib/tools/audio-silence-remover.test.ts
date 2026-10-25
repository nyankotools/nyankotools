import { describe, expect, it } from 'vitest';
import {
  amplitudeToDb,
  amplitudeToDisplay,
  applyRemovals,
  buildOutputFileName,
  computeEnvelope,
  computePeaks,
  computeRemovals,
  dbToAmplitude,
  detectSilence,
  formatPreciseDuration,
  keepSegments,
  parseMinSilence,
  parsePadding,
  parseShortenSeconds,
  parseThresholdDb,
  summarize,
  windowFrames,
} from './audio-silence-remover';

const RATE = 1000; // 窓 = 10 フレーム

/** 指定の (長さ秒, 振幅) 列から信号を作る */
function build(parts: Array<[number, number]>): Float32Array {
  const total = parts.reduce((s, [sec]) => s + Math.round(sec * RATE), 0);
  const out = new Float32Array(total);
  let pos = 0;
  for (const [sec, amp] of parts) {
    const n = Math.round(sec * RATE);
    out.fill(amp, pos, pos + n);
    pos += n;
  }
  return out;
}

describe('parse', () => {
  it('しきい値は -100〜0 で、全角・U+2212 も受け付ける', () => {
    expect(parseThresholdDb('-40')).toEqual({ ok: true, value: -40 });
    expect(parseThresholdDb('－３５．５')).toEqual({ ok: true, value: -35.5 });
    expect(parseThresholdDb('−20')).toEqual({ ok: true, value: -20 });
    expect(parseThresholdDb('0')).toEqual({ ok: true, value: 0 });
    expect(parseThresholdDb('-101')).toEqual({
      ok: false,
      error: 'outOfRange',
    });
    expect(parseThresholdDb('5')).toEqual({ ok: false, error: 'outOfRange' });
    expect(parseThresholdDb('')).toEqual({ ok: false, error: 'invalid' });
    expect(parseThresholdDb('abc')).toEqual({ ok: false, error: 'invalid' });
  });

  it('秒数の範囲を検証する', () => {
    expect(parseMinSilence('0,5')).toEqual({ ok: true, value: 0.5 });
    expect(parseMinSilence('0.01')).toEqual({ ok: false, error: 'outOfRange' });
    expect(parseMinSilence('61')).toEqual({ ok: false, error: 'outOfRange' });
    expect(parsePadding('0')).toEqual({ ok: true, value: 0 });
    expect(parsePadding('-1')).toEqual({ ok: false, error: 'outOfRange' });
    expect(parsePadding('6')).toEqual({ ok: false, error: 'outOfRange' });
    expect(parseShortenSeconds('0.3')).toEqual({ ok: true, value: 0.3 });
    expect(parseShortenSeconds('11')).toEqual({
      ok: false,
      error: 'outOfRange',
    });
    expect(parseShortenSeconds('x')).toEqual({ ok: false, error: 'invalid' });
  });

  it('前後の空白は無視し、Infinity・指数表記・空白混じりは不正', () => {
    expect(parseThresholdDb('  -40  ')).toEqual({ ok: true, value: -40 });
    expect(parseThresholdDb('Infinity')).toEqual({
      ok: false,
      error: 'invalid',
    });
    expect(parseThresholdDb('1e1')).toEqual({ ok: false, error: 'invalid' });
    expect(parseThresholdDb('-4 0')).toEqual({ ok: false, error: 'invalid' });
    expect(parseThresholdDb('   ')).toEqual({ ok: false, error: 'invalid' });
  });
});

describe('dB 変換', () => {
  it('相互変換できる', () => {
    expect(dbToAmplitude(0)).toBe(1);
    expect(dbToAmplitude(-20)).toBeCloseTo(0.1, 10);
    expect(amplitudeToDb(0.1)).toBeCloseTo(-20, 10);
    expect(amplitudeToDb(0)).toBe(-Infinity);
  });

  it('表示用の変換は下限で 0、満振幅で 1', () => {
    expect(amplitudeToDisplay(1)).toBe(1);
    expect(amplitudeToDisplay(0)).toBe(0);
    expect(amplitudeToDisplay(dbToAmplitude(-72))).toBe(0);
    expect(amplitudeToDisplay(-1)).toBe(1);
    expect(amplitudeToDisplay(dbToAmplitude(-36))).toBeCloseTo(0.5, 6);
    expect(amplitudeToDisplay(2)).toBe(1);
  });
});

describe('computeEnvelope / computePeaks', () => {
  it('窓ごとの最大絶対値を全チャンネルで取る', () => {
    const a = build([
      [0.02, 0.1],
      [0.01, 0.5],
    ]);
    const b = build([
      [0.01, -0.3],
      [0.02, 0],
    ]);
    const env = computeEnvelope([a, b], windowFrames(RATE));
    expect(Array.from(env).map((v) => Math.round(v * 10) / 10)).toEqual([
      0.3, 0.1, 0.5,
    ]);
  });

  it('端数の窓も1つとして数える', () => {
    const env = computeEnvelope([new Float32Array(25).fill(0.2)], 10);
    expect(env.length).toBe(3);
  });

  it('空配列は空を返す', () => {
    expect(computeEnvelope([], 10).length).toBe(0);
    expect(computePeaks([], 10).length).toBe(0);
  });

  it('ピークを等分して求める', () => {
    const data = new Float32Array(100);
    data[5] = 0.5;
    data[95] = -0.8;
    const peaks = computePeaks([data], 10);
    expect(peaks.length).toBe(10);
    expect(peaks[0]).toBeCloseTo(0.5, 6);
    expect(peaks[9]).toBeCloseTo(0.8, 6);
    expect(peaks[4]).toBe(0);
  });
});

describe('detectSilence', () => {
  const opts = { thresholdDb: -40, minSilenceSeconds: 0.3 };

  it('最小無音長以上の無音だけを検出する', () => {
    // 音1s, 無音0.5s, 音1s, 無音0.2s(短い), 音1s, 無音0.4s(末尾)
    const data = build([
      [1, 0.5],
      [0.5, 0],
      [1, 0.5],
      [0.2, 0],
      [1, 0.5],
      [0.4, 0],
    ]);
    const env = computeEnvelope([data], windowFrames(RATE));
    const ranges = detectSilence(env, 10, data.length, RATE, opts);
    expect(ranges).toEqual([
      { start: 1000, end: 1500 },
      { start: 3700, end: 4100 },
    ]);
  });

  it('しきい値ちょうどは無音、わずかに上は音', () => {
    const at = build([[1, dbToAmplitude(-40)]]);
    const above = build([[1, dbToAmplitude(-39)]]);
    const o = { thresholdDb: -40, minSilenceSeconds: 0.1 };
    expect(
      detectSilence(computeEnvelope([at], 10), 10, at.length, RATE, o),
    ).toEqual([{ start: 0, end: 1000 }]);
    expect(
      detectSilence(computeEnvelope([above], 10), 10, above.length, RATE, o),
    ).toEqual([]);
  });

  it('先頭の無音・全体が無音のケース', () => {
    const lead = build([
      [0.5, 0],
      [0.5, 0.5],
    ]);
    expect(
      detectSilence(computeEnvelope([lead], 10), 10, lead.length, RATE, opts),
    ).toEqual([{ start: 0, end: 500 }]);
    const all = build([[2, 0]]);
    expect(
      detectSilence(computeEnvelope([all], 10), 10, all.length, RATE, opts),
    ).toEqual([{ start: 0, end: 2000 }]);
  });

  it('端数の窓でも終端は総フレーム数を超えない', () => {
    const data = new Float32Array(1005);
    const ranges = detectSilence(computeEnvelope([data], 10), 10, 1005, RATE, {
      thresholdDb: -40,
      minSilenceSeconds: 0.1,
    });
    expect(ranges).toEqual([{ start: 0, end: 1005 }]);
  });

  it('空のエンベロープは無音なし', () => {
    expect(detectSilence(new Float32Array(0), 10, 0, RATE, opts)).toEqual([]);
  });
});

describe('computeRemovals', () => {
  const silences = [
    { start: 0, end: 500 }, // 先頭
    { start: 1000, end: 2000 }, // 中間
    { start: 3000, end: 4000 }, // 末尾
  ];

  it('カット: 音のある側にだけ余白を残す', () => {
    const r = computeRemovals(silences, 4000, RATE, {
      mode: 'cut',
      paddingSeconds: 0.1,
      shortenSeconds: 0,
    });
    expect(r).toEqual([
      { start: 0, end: 400 },
      { start: 1100, end: 1900 },
      { start: 3100, end: 4000 },
    ]);
  });

  it('余白が無音より長いと削除しない', () => {
    const r = computeRemovals([{ start: 1000, end: 1150 }], 4000, RATE, {
      mode: 'cut',
      paddingSeconds: 0.1,
      shortenSeconds: 0,
    });
    expect(r).toEqual([]);
  });

  it('短縮: 指定の長さの半分ずつを両端に残す', () => {
    const r = computeRemovals([{ start: 1000, end: 2000 }], 4000, RATE, {
      mode: 'shorten',
      paddingSeconds: 0,
      shortenSeconds: 0.4,
    });
    expect(r).toEqual([{ start: 1200, end: 1800 }]);
  });
});

describe('keepSegments / applyRemovals', () => {
  it('削除範囲の外側を返す', () => {
    expect(
      keepSegments(100, [
        { start: 0, end: 10 },
        { start: 40, end: 60 },
        { start: 90, end: 100 },
      ]),
    ).toEqual([
      { start: 10, end: 40 },
      { start: 60, end: 90 },
    ]);
    expect(keepSegments(100, [])).toEqual([{ start: 0, end: 100 }]);
    expect(keepSegments(100, [{ start: 0, end: 100 }])).toEqual([]);
  });

  it('削除分だけ短くなり、つなぎ目以外は元の値のまま', () => {
    const data = build([
      [1, 0.5],
      [1, 0],
      [1, 0.5],
    ]);
    const [out] = applyRemovals([data], [{ start: 1000, end: 2000 }], RATE);
    expect(out.length).toBe(2000);
    expect(out[500]).toBeCloseTo(0.5, 6);
    expect(out[1500]).toBeCloseTo(0.5, 6);
    // 先頭は元ファイルの端なのでフェードなし、つなぎ目の前後は 0 に近づく
    expect(out[0]).toBeCloseTo(0.5, 6);
    expect(out[999]).toBe(0);
    expect(out[1000]).toBe(0);
    expect(out[1001]).toBeGreaterThan(0);
    expect(out[1001]).toBeLessThan(0.5);
  });

  it('全チャンネルに同じ処理をし、全削除なら空になる', () => {
    const a = new Float32Array(100).fill(0.3);
    const b = new Float32Array(100).fill(-0.3);
    const out = applyRemovals([a, b], [{ start: 20, end: 60 }], RATE);
    expect(out.length).toBe(2);
    expect(out[0].length).toBe(60);
    expect(out[1][30]).toBeCloseTo(-0.3, 6);
    const empty = applyRemovals([a], [{ start: 0, end: 100 }], RATE);
    expect(empty[0].length).toBe(0);
    expect(applyRemovals([], [], RATE)).toEqual([]);
  });

  it('短いセグメントでもフェードが範囲外に出ない', () => {
    const data = new Float32Array(10).fill(1);
    const [out] = applyRemovals(
      [data],
      [
        { start: 2, end: 4 },
        { start: 5, end: 7 },
      ],
      48000,
    );
    expect(out.length).toBe(6);
    for (const v of out) expect(Number.isFinite(v)).toBe(true);
  });
});

describe('summarize', () => {
  it('削減時間と割合を求める', () => {
    const s = summarize(
      4000,
      RATE,
      [
        { start: 0, end: 500 },
        { start: 1000, end: 2000 },
      ],
      [
        { start: 0, end: 400 },
        { start: 1100, end: 1900 },
      ],
    );
    expect(s.originalSeconds).toBe(4);
    expect(s.removedSeconds).toBeCloseTo(1.2, 6);
    expect(s.resultSeconds).toBeCloseTo(2.8, 6);
    expect(s.removedPercent).toBeCloseTo(30, 6);
    expect(s.silenceCount).toBe(2);
    expect(s.cutCount).toBe(2);
  });

  it('長さ0でも割合は0', () => {
    expect(summarize(0, RATE, [], []).removedPercent).toBe(0);
  });
});

describe('formatPreciseDuration / buildOutputFileName', () => {
  it('0.1秒単位で整形する', () => {
    expect(formatPreciseDuration(0)).toBe('0:00.0');
    expect(formatPreciseDuration(65.34)).toBe('1:05.3');
    expect(formatPreciseDuration(59.96)).toBe('1:00.0');
    expect(formatPreciseDuration(3725.5)).toBe('1:02:05.5');
    expect(formatPreciseDuration(-3)).toBe('0:00.0');
  });

  it('出力ファイル名', () => {
    expect(buildOutputFileName('talk.mp3')).toBe('talk-nosilence.wav');
    expect(buildOutputFileName('a.b.m4a')).toBe('a.b-nosilence.wav');
    expect(buildOutputFileName('.mp3')).toBe('audio-nosilence.wav');
    expect(buildOutputFileName('noext')).toBe('noext-nosilence.wav');
  });
});
