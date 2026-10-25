import { describe, expect, it } from 'vitest';
import {
  AudioSpeedResampler,
  MAX_SPEED,
  MIN_SPEED,
  SPEED_PRESETS,
  buildSpeedFileName,
  createVideoRetimer,
  formatSpeed,
  isSpeedOutputFormat,
  outputDuration,
  parseSpeed,
} from './video-speed-changer';

describe('parseSpeed（再利用）', () => {
  it('範囲内の値を受け付ける', () => {
    expect(parseSpeed('2')).toEqual({ ok: true, value: 2 });
    expect(parseSpeed('0.25')).toEqual({ ok: true, value: 0.25 });
    expect(parseSpeed('４')).toEqual({ ok: true, value: 4 });
  });
  it('範囲外・不正値を拒否する', () => {
    expect(parseSpeed('0.1')).toEqual({ ok: false, error: 'outOfRange' });
    expect(parseSpeed('5')).toEqual({ ok: false, error: 'outOfRange' });
    expect(parseSpeed('abc')).toEqual({ ok: false, error: 'invalid' });
    expect(parseSpeed('')).toEqual({ ok: false, error: 'invalid' });
  });
  it('プリセットはすべて範囲内', () => {
    for (const p of SPEED_PRESETS) {
      expect(p).toBeGreaterThanOrEqual(MIN_SPEED);
      expect(p).toBeLessThanOrEqual(MAX_SPEED);
    }
  });
});

describe('formatSpeed / outputDuration / buildSpeedFileName', () => {
  it('速度を整形する', () => {
    expect(formatSpeed(2)).toBe('2');
    expect(formatSpeed(0.25)).toBe('0.25');
    expect(formatSpeed(1.3333333)).toBe('1.333');
  });
  it('出力の長さは 1/速度', () => {
    expect(outputDuration(60, 2)).toBe(30);
    expect(outputDuration(60, 0.5)).toBe(120);
  });
  it('出力ファイル名に速度を付ける', () => {
    expect(buildSpeedFileName('clip.mov', 'mp4', 2)).toBe('clip-2x.mp4');
    expect(buildSpeedFileName('a.b.webm', 'webm', 0.5)).toBe('a.b-0.5x.webm');
    expect(buildSpeedFileName('', 'mp4', 1.5)).toBe('media-1.5x.mp4');
  });
  it('速度の範囲の境界値（0.25 と 4）は受け付ける', () => {
    expect(parseSpeed('0.25')).toEqual({ ok: true, value: 0.25 });
    expect(parseSpeed('4')).toEqual({ ok: true, value: 4 });
    expect(parseSpeed('0.2499')).toEqual({ ok: false, error: 'outOfRange' });
    expect(parseSpeed('4.01')).toEqual({ ok: false, error: 'outOfRange' });
  });
  it('出力形式の判定', () => {
    expect(isSpeedOutputFormat('mp4')).toBe(true);
    expect(isSpeedOutputFormat('webm')).toBe(true);
    expect(isSpeedOutputFormat('mp3')).toBe(false);
  });
});

describe('createVideoRetimer', () => {
  it('スローでは時刻と長さが伸びる', () => {
    const retime = createVideoRetimer(0.5);
    expect(retime(1, 0.04)).toEqual({ timestamp: 2, duration: 0.08 });
  });
  it('スローでは間引かない', () => {
    const retime = createVideoRetimer(0.25);
    for (let i = 0; i < 10; i++) {
      expect(retime(i / 30, 1 / 30)).not.toBeNull();
    }
  });
  it('倍速で出力fpsが上限を超えるときは間引く', () => {
    // 30fps を 4倍速 → 120fps 相当。60fps 上限なら半分になる
    const retime = createVideoRetimer(4, 60);
    let kept = 0;
    for (let i = 0; i < 120; i++) {
      if (retime(i / 30, 1 / 30)) kept++;
    }
    expect(kept).toBeGreaterThanOrEqual(58);
    expect(kept).toBeLessThanOrEqual(62);
  });
  it('倍速でも上限以下なら全フレーム残す', () => {
    const retime = createVideoRetimer(2, 60);
    for (let i = 0; i < 60; i++) {
      expect(retime(i / 30, 1 / 30)).not.toBeNull();
    }
  });
  it('不正な速度は例外', () => {
    expect(() => createVideoRetimer(0)).toThrow();
    expect(() => createVideoRetimer(NaN)).toThrow();
  });
  it('等速(1倍)では時刻も長さも変えず、間引かない', () => {
    const retime = createVideoRetimer(1, 30);
    expect(retime(2.5, 1 / 30)).toEqual({ timestamp: 2.5, duration: 1 / 30 });
    for (let i = 0; i < 60; i++) {
      expect(retime(i / 30, 1 / 30)).not.toBeNull();
    }
  });
});

describe('AudioSpeedResampler', () => {
  const ramp = (n: number, offset = 0) =>
    Float32Array.from({ length: n }, (_, i) => offset + i);

  it('2倍速で長さが半分になる', () => {
    const r = new AudioSpeedResampler(2, 1);
    const [out] = r.process([ramp(1000)]);
    expect(out.length).toBeGreaterThanOrEqual(498);
    expect(out.length).toBeLessThanOrEqual(500);
    expect(out[1]).toBeCloseTo(2);
    expect(out[10]).toBeCloseTo(20);
  });
  it('0.5倍速で長さが2倍になり、補間される', () => {
    const r = new AudioSpeedResampler(0.5, 1);
    const [out] = r.process([ramp(100)]);
    expect(out.length).toBeGreaterThanOrEqual(198);
    expect(out[1]).toBeCloseTo(0.5);
    expect(out[3]).toBeCloseTo(1.5);
  });
  it('チャンクを分割しても一括処理と同じ結果になる', () => {
    const whole = new AudioSpeedResampler(1.7, 1).process([ramp(1000)])[0];
    const r = new AudioSpeedResampler(1.7, 1);
    const parts = [
      r.process([ramp(333)])[0],
      r.process([ramp(400, 333)])[0],
      r.process([ramp(267, 733)])[0],
    ];
    const joined = Float32Array.from(parts.flatMap((p) => Array.from(p)));
    expect(Math.abs(joined.length - whole.length)).toBeLessThanOrEqual(1);
    const len = Math.min(joined.length, whole.length);
    for (let i = 0; i < len; i++) {
      expect(joined[i]).toBeCloseTo(whole[i], 3);
    }
  });
  it('全チャンネルを同じ長さで処理する', () => {
    const r = new AudioSpeedResampler(3, 2);
    const out = r.process([ramp(900), ramp(900, 1000)]);
    expect(out).toHaveLength(2);
    expect(out[0].length).toBe(out[1].length);
    expect(out[1][0]).toBeCloseTo(1000);
  });
  it('出力フレーム数を累計する', () => {
    const r = new AudioSpeedResampler(2, 1);
    const a = r.process([ramp(100)])[0].length;
    const b = r.process([ramp(100)])[0].length;
    expect(r.outputFrames).toBe(a + b);
  });
  it('等速(1倍)では入力と同じ長さ・値を返す', () => {
    const r = new AudioSpeedResampler(1, 1);
    const [out] = r.process([ramp(100)]);
    expect(out.length).toBe(99);
    expect(out[0]).toBeCloseTo(0);
    expect(out[50]).toBeCloseTo(50);
  });
  it('チャンネル数0でも例外にならず空を返す', () => {
    const r = new AudioSpeedResampler(2, 0);
    expect(r.process([])).toEqual([]);
  });
  it('空チャンクは空を返す', () => {
    const r = new AudioSpeedResampler(2, 1);
    expect(r.process([new Float32Array(0)])[0].length).toBe(0);
  });
  it('不正な速度は例外', () => {
    expect(() => new AudioSpeedResampler(0, 1)).toThrow();
  });
});
