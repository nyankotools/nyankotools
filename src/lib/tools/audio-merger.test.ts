import { describe, expect, it } from 'vitest';
import {
  MAX_FILE_SIZE,
  applyEdgeFades,
  buildOutputFileName,
  computeLayout,
  estimateDuration,
  mergeClips,
  moveItem,
  parseSeconds,
  removeItem,
  toChannelCount,
  type MergeOptions,
} from './audio-merger';

const RATE = 100;

const base: MergeOptions = {
  transition: 'gap',
  gapSeconds: 0,
  crossfadeSeconds: 0,
  fadeInSeconds: 0,
  fadeOutSeconds: 0,
};

function constant(value: number, frames: number): Float32Array {
  return new Float32Array(frames).fill(value);
}

describe('parseSeconds', () => {
  it('小数・全角・カンマ小数点を受け付ける', () => {
    expect(parseSeconds('1.5', 10)).toEqual({ ok: true, value: 1.5 });
    expect(parseSeconds('０．５', 10)).toEqual({ ok: true, value: 0.5 });
    expect(parseSeconds('2,5', 10)).toEqual({ ok: true, value: 2.5 });
    expect(parseSeconds('0', 10)).toEqual({ ok: true, value: 0 });
  });
  it('空欄・文字・負数は invalid、上限超えは outOfRange', () => {
    expect(parseSeconds('', 10)).toEqual({ ok: false, error: 'invalid' });
    expect(parseSeconds('abc', 10)).toEqual({ ok: false, error: 'invalid' });
    expect(parseSeconds('-1', 10)).toEqual({ ok: false, error: 'invalid' });
    expect(parseSeconds('11', 10)).toEqual({ ok: false, error: 'outOfRange' });
  });
});

describe('computeLayout', () => {
  it('ギャップなしなら単純に連結する', () => {
    const l = computeLayout([100, 50], RATE, base);
    expect(l.starts).toEqual([0, 100]);
    expect(l.total).toBe(150);
  });
  it('ギャップ秒数ぶん無音を挟む', () => {
    const l = computeLayout([100, 50, 20], RATE, { ...base, gapSeconds: 0.5 });
    expect(l.starts).toEqual([0, 150, 250]);
    expect(l.total).toBe(270);
  });
  it('クロスフェードは重ねて総長が縮む', () => {
    const l = computeLayout([100, 100], RATE, {
      ...base,
      transition: 'crossfade',
      crossfadeSeconds: 0.2,
    });
    expect(l.starts).toEqual([0, 80]);
    expect(l.overlaps).toEqual([0, 20]);
    expect(l.total).toBe(180);
  });
  it('クロスフェードは短いクリップの半分までに制限される', () => {
    const l = computeLayout([100, 10], RATE, {
      ...base,
      transition: 'crossfade',
      crossfadeSeconds: 5,
    });
    expect(l.overlaps[1]).toBe(5);
    expect(l.total).toBe(105);
  });
  it('1クリップだけならそのまま、0クリップは空', () => {
    expect(computeLayout([30], RATE, base).total).toBe(30);
    expect(computeLayout([], RATE, base).total).toBe(0);
  });
});

describe('estimateDuration', () => {
  it('秒単位で見積もる', () => {
    expect(estimateDuration([2, 3], { ...base, gapSeconds: 1 })).toBeCloseTo(6);
    expect(
      estimateDuration([2, 3], {
        ...base,
        transition: 'crossfade',
        crossfadeSeconds: 1,
      }),
    ).toBeCloseTo(4);
  });
});

describe('toChannelCount', () => {
  it('モノラルを複製し、3ch以上は先頭2chにする', () => {
    const m = constant(1, 3);
    const out = toChannelCount([m], 2);
    expect(out).toHaveLength(2);
    expect(out[1]).toBe(m);
    const six = [0, 1, 2, 3, 4, 5].map((v) => constant(v, 2));
    expect(toChannelCount(six, 2)).toEqual([six[0], six[1]]);
  });
});

describe('mergeClips', () => {
  it('ギャップなしで連結する', () => {
    const r = mergeClips(
      [
        { channels: [constant(0.5, 100)], sampleRate: RATE },
        { channels: [constant(-0.5, 50)], sampleRate: RATE },
      ],
      base,
    );
    expect(r.channels).toHaveLength(1);
    expect(r.channels[0]).toHaveLength(150);
    expect(r.channels[0][99]).toBeCloseTo(0.5);
    expect(r.channels[0][100]).toBeCloseTo(-0.5);
    expect(r.duration).toBeCloseTo(1.5);
  });
  it('ギャップ部分は無音になる', () => {
    const r = mergeClips(
      [
        { channels: [constant(1, 10)], sampleRate: RATE },
        { channels: [constant(1, 10)], sampleRate: RATE },
      ],
      { ...base, gapSeconds: 0.1 },
    );
    expect(r.channels[0]).toHaveLength(30);
    expect(r.channels[0][10]).toBe(0);
    expect(r.channels[0][19]).toBe(0);
    expect(r.channels[0][20]).toBe(1);
  });
  it('クロスフェードでは重なり部分の音量が滑らかにつながる', () => {
    const r = mergeClips(
      [
        { channels: [constant(1, 100)], sampleRate: RATE },
        { channels: [constant(1, 100)], sampleRate: RATE },
      ],
      { ...base, transition: 'crossfade', crossfadeSeconds: 0.4 },
    );
    const out = r.channels[0];
    expect(out).toHaveLength(160);
    expect(out[0]).toBe(1);
    expect(out[159]).toBeCloseTo(1, 1);
    // 重なりの中央（等パワー）は約 sin(45)+cos(45) = 1.414
    expect(out[60 + 20]).toBeCloseTo(Math.SQRT2, 1);
    for (const v of out) expect(Number.isFinite(v)).toBe(true);
  });
  it('チャンネル数が違うときは多い方に合わせる', () => {
    const r = mergeClips(
      [
        { channels: [constant(0.5, 10)], sampleRate: RATE },
        { channels: [constant(0.1, 10), constant(0.2, 10)], sampleRate: RATE },
      ],
      base,
    );
    expect(r.channels).toHaveLength(2);
    expect(r.channels[1][0]).toBeCloseTo(0.5);
    expect(r.channels[1][10]).toBeCloseTo(0.2);
  });
  it('サンプルレートは先頭クリップに揃える', () => {
    const r = mergeClips(
      [
        { channels: [constant(0.5, 100)], sampleRate: 100 },
        { channels: [constant(0.5, 200)], sampleRate: 200 },
      ],
      base,
    );
    expect(r.sampleRate).toBe(100);
    expect(r.channels[0]).toHaveLength(200);
  });
  it('先頭フェードインと末尾フェードアウトを適用する', () => {
    const r = mergeClips([{ channels: [constant(1, 100)], sampleRate: RATE }], {
      ...base,
      fadeInSeconds: 0.5,
      fadeOutSeconds: 0.5,
    });
    const out = r.channels[0];
    expect(out[0]).toBe(0);
    expect(out[25]).toBeCloseTo(0.5);
    expect(out[50]).toBeGreaterThan(0.95);
    expect(out[99]).toBe(0);
  });
  it('クリップが無いとエラー', () => {
    expect(() => mergeClips([], base)).toThrow();
  });
});

describe('applyEdgeFades', () => {
  it('音声より長いフェードでも範囲外に書き込まない', () => {
    const ch = [constant(1, 10)];
    applyEdgeFades(ch, 1000, 1000);
    expect(ch[0]).toHaveLength(10);
    for (const v of ch[0]) expect(v).toBeGreaterThanOrEqual(0);
  });
});

describe('moveItem / removeItem', () => {
  it('順序を入れ替える', () => {
    expect(moveItem(['a', 'b', 'c'], 1, -1)).toEqual(['b', 'a', 'c']);
    expect(moveItem(['a', 'b', 'c'], 1, 1)).toEqual(['a', 'c', 'b']);
  });
  it('端や範囲外では変更しない', () => {
    expect(moveItem(['a', 'b'], 0, -1)).toEqual(['a', 'b']);
    expect(moveItem(['a', 'b'], 1, 1)).toEqual(['a', 'b']);
    expect(moveItem(['a', 'b'], 5, -1)).toEqual(['a', 'b']);
  });
  it('削除する', () => {
    expect(removeItem(['a', 'b', 'c'], 1)).toEqual(['a', 'c']);
    expect(removeItem(['a'], 3)).toEqual(['a']);
  });
});

describe('buildOutputFileName', () => {
  it('先頭ファイル名に -merged.wav を付ける', () => {
    expect(buildOutputFileName(['song.mp3', 'b.wav'])).toBe('song-merged.wav');
    expect(buildOutputFileName([])).toBe('audio-merged.wav');
    expect(buildOutputFileName(['.mp3'])).toBe('audio-merged.wav');
  });
  it('拡張子が無い・ドットを含む・日本語のファイル名を扱う', () => {
    expect(buildOutputFileName(['song'])).toBe('song-merged.wav');
    expect(buildOutputFileName(['my.song.mp3'])).toBe('my.song-merged.wav');
    expect(buildOutputFileName(['音声ファイル.m4a'])).toBe(
      '音声ファイル-merged.wav',
    );
  });
});

describe('入力値と上限（回帰）', () => {
  it('parseSeconds: 上限ちょうどは受け付け、形式が不正な数値は invalid', () => {
    expect(parseSeconds('10', 10)).toEqual({ ok: true, value: 10 });
    expect(parseSeconds('.5', 10)).toEqual({ ok: true, value: 0.5 });
    expect(parseSeconds('1.2.3', 10)).toEqual({ ok: false, error: 'invalid' });
    expect(parseSeconds('1e2', 1000)).toEqual({ ok: false, error: 'invalid' });
  });
  it('1ファイルの上限は 50MB（200MB ではない）', () => {
    expect(MAX_FILE_SIZE).toBe(50 * 1024 * 1024);
  });
  it('estimateDuration: 空なら 0', () => {
    expect(estimateDuration([], base)).toBe(0);
  });
});
