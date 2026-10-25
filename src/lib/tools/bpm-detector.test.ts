import { describe, expect, it } from 'vitest';
import {
  computeOnsetEnvelope,
  confidenceLevel,
  detectBpm,
  formatBpm,
  formatDuration,
  formatFileSize,
  isAcceptedAudioFile,
  mixToMono,
} from './bpm-detector';

const SR = 22050;

/** 指定BPMのクリック列（減衰するサイン波バースト）を作る。subAmp>0 なら裏拍にも弱いクリックを入れる */
function clickTrack(
  bpm: number,
  seconds: number,
  opts: { offset?: number; subAmp?: number; noise?: number } = {},
): Float32Array {
  const out = new Float32Array(Math.floor(seconds * SR));
  const period = (60 / bpm) * SR;
  const burst = (at: number, amp: number) => {
    const start = Math.round(at);
    for (let i = 0; i < 1500 && start + i < out.length; i++) {
      out[start + i] +=
        amp * Math.exp(-i / 250) * Math.sin((2 * Math.PI * 1000 * i) / SR);
    }
  };
  for (let t = (opts.offset ?? 0.1) * SR; t < out.length; t += period) {
    burst(t, 0.9);
    if (opts.subAmp) burst(t + period / 2, opts.subAmp);
  }
  if (opts.noise) {
    let seed = 12345;
    for (let i = 0; i < out.length; i++) {
      seed = (seed * 1664525 + 1013904223) >>> 0;
      out[i] += (seed / 0xffffffff - 0.5) * opts.noise;
    }
  }
  return out;
}

describe('detectBpm', () => {
  it.each([75, 90, 100, 120, 128, 140, 174])(
    '%i BPMのクリック列を±1以内で推定する',
    (bpm) => {
      const result = detectBpm(clickTrack(bpm, 20), SR);
      expect(result).not.toBeNull();
      expect(Math.abs(result!.bpm - bpm)).toBeLessThanOrEqual(1);
    },
  );

  it('開始位置がずれていても同じBPMになる', () => {
    const result = detectBpm(clickTrack(110, 20, { offset: 0.37 }), SR);
    expect(Math.abs(result!.bpm - 110)).toBeLessThanOrEqual(1);
  });

  it('裏拍に弱い音があっても拍のテンポを返す', () => {
    const result = detectBpm(clickTrack(100, 24, { subAmp: 0.2 }), SR);
    expect(Math.abs(result!.bpm - 100)).toBeLessThanOrEqual(1.5);
  });

  it('ノイズが重なっていても推定できる', () => {
    const result = detectBpm(clickTrack(120, 24, { noise: 0.1 }), SR);
    expect(Math.abs(result!.bpm - 120)).toBeLessThanOrEqual(1.5);
  });

  it('長い音声は中央付近だけを解析しても推定できる', () => {
    const result = detectBpm(clickTrack(130, 60), SR, {
      maxAnalyzeSeconds: 15,
    });
    expect(Math.abs(result!.bpm - 130)).toBeLessThanOrEqual(1);
  });

  it('半分・2倍の候補を返す', () => {
    const result = detectBpm(clickTrack(120, 20), SR)!;
    expect(result.alternatives[0]).toBeCloseTo(result.bpm / 2, 5);
    expect(result.alternatives[1]).toBeCloseTo(result.bpm * 2, 5);
    expect(result.confidence).toBeGreaterThan(0.3);
    expect(result.confidence).toBeLessThanOrEqual(1);
  });

  it('無音は null', () => {
    expect(detectBpm(new Float32Array(SR * 10), SR)).toBeNull();
  });

  it('短すぎる音声は null', () => {
    expect(detectBpm(clickTrack(120, 2), SR)).toBeNull();
  });

  it('不正なサンプルレートや範囲は null', () => {
    const x = clickTrack(120, 10);
    expect(detectBpm(x, 0)).toBeNull();
    expect(detectBpm(x, SR, { minBpm: 100, maxBpm: 100 })).toBeNull();
  });

  it('空配列やサンプルレートが NaN のときは null', () => {
    expect(detectBpm(new Float32Array(0), SR)).toBeNull();
    expect(detectBpm(clickTrack(120, 10), Number.NaN)).toBeNull();
  });

  it('周期のないホワイトノイズは高い信頼度を返さない', () => {
    const noise = new Float32Array(SR * 20);
    let seed = 987654;
    for (let i = 0; i < noise.length; i++) {
      seed = (seed * 1664525 + 1013904223) >>> 0;
      noise[i] = seed / 0xffffffff - 0.5;
    }
    const result = detectBpm(noise, SR);
    if (result) expect(result.confidence).toBeLessThan(0.5);
  });

  it('大きめの入力（5分・ステレオ相当の長さ）でも中央90秒だけを解析して完了する', () => {
    const long = clickTrack(100, 300);
    const start = Date.now();
    const result = detectBpm(long, SR);
    expect(Date.now() - start).toBeLessThan(10000);
    expect(Math.abs(result!.bpm - 100)).toBeLessThanOrEqual(1);
  });

  it('範囲指定で探索範囲を絞れる', () => {
    const result = detectBpm(clickTrack(150, 20), SR, {
      minBpm: 100,
      maxBpm: 180,
    });
    expect(Math.abs(result!.bpm - 150)).toBeLessThanOrEqual(1);
  });
});

describe('computeOnsetEnvelope', () => {
  it('無音は全て0', () => {
    const env = computeOnsetEnvelope(new Float32Array(2000), 100);
    expect(env.length).toBe(20);
    expect(Array.from(env).every((v) => v === 0)).toBe(true);
  });

  it('音が立ち上がるフレームで値が大きい', () => {
    const x = new Float32Array(1000);
    x.fill(0.8, 500);
    const env = computeOnsetEnvelope(x, 100);
    const max = Math.max(...env);
    expect(env.indexOf(max)).toBeGreaterThanOrEqual(3);
    expect(env.indexOf(max)).toBeLessThanOrEqual(5);
  });
});

describe('mixToMono', () => {
  it('チャンネルを平均する', () => {
    const out = mixToMono([
      new Float32Array([1, 0, 1]),
      new Float32Array([0, 0, 1]),
    ]);
    expect(Array.from(out)).toEqual([0.5, 0, 1]);
  });

  it('1chはそのまま、0chは空', () => {
    const one = new Float32Array([1, 2]);
    expect(mixToMono([one])).toBe(one);
    expect(mixToMono([]).length).toBe(0);
  });
});

describe('表示ヘルパー', () => {
  it('formatBpm', () => {
    expect(formatBpm(120.02)).toBe('120');
    expect(formatBpm(127.96)).toBe('128');
    expect(formatBpm(98.46)).toBe('98.5');
  });

  it('confidenceLevel', () => {
    expect(confidenceLevel(0.8)).toBe('high');
    expect(confidenceLevel(0.3)).toBe('medium');
    expect(confidenceLevel(0.1)).toBe('low');
  });

  it('isAcceptedAudioFile', () => {
    expect(isAcceptedAudioFile({ name: 'a.bin', type: 'audio/mpeg' })).toBe(
      true,
    );
    expect(isAcceptedAudioFile({ name: 'a.FLAC', type: '' })).toBe(true);
    expect(isAcceptedAudioFile({ name: 'a.txt', type: 'text/plain' })).toBe(
      false,
    );
  });

  it('formatDuration / formatFileSize', () => {
    expect(formatDuration(65)).toBe('1:05');
    expect(formatDuration(3725)).toBe('1:02:05');
    expect(formatFileSize(512)).toBe('512 B');
    expect(formatFileSize(1536)).toBe('1.5 KB');
    expect(formatFileSize(3 * 1024 * 1024)).toBe('3.0 MB');
  });

  it('表示ヘルパーの境界値（0・負数・単位の切り替わり）', () => {
    expect(formatDuration(0)).toBe('0:00');
    expect(formatDuration(-5)).toBe('0:00');
    expect(formatDuration(59.6)).toBe('1:00');
    expect(formatFileSize(0)).toBe('0 B');
    expect(formatFileSize(1023)).toBe('1023 B');
    expect(formatFileSize(1024)).toBe('1.0 KB');
    expect(formatFileSize(1024 * 1024)).toBe('1.0 MB');
    expect(formatBpm(98.44)).toBe('98.4');
    expect(isAcceptedAudioFile({ name: '', type: '' })).toBe(false);
  });

  it('チャンネル長が違う場合は短い方に合わせる', () => {
    const out = mixToMono([new Float32Array([1, 1, 1]), new Float32Array([1])]);
    expect(out.length).toBe(1);
    expect(out[0]).toBe(1);
  });
});
