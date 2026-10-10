import { describe, expect, it } from 'vitest';
import { MAX_GIF_WIDTH } from './gif-maker';
import {
  buildFrameFileName,
  buildGifFileName,
  DEFAULT_GIF_SECONDS,
  DEFAULT_WIDTH,
  MAX_GIF_FRAMES,
  planGif,
  resolveFrameTime,
  resolveGifRange,
} from './video-to-gif';

describe('resolveGifRange', () => {
  it('両方空なら先頭から既定の秒数', () => {
    expect(resolveGifRange('', '', 60)).toEqual({
      ok: true,
      start: 0,
      end: DEFAULT_GIF_SECONDS,
    });
  });
  it('短い動画は動画の長さまで', () => {
    expect(resolveGifRange('', '', 4)).toEqual({ ok: true, start: 0, end: 4 });
  });
  it('開始のみは開始から既定の秒数後（動画の長さまで）', () => {
    expect(resolveGifRange('5', '', 60)).toEqual({
      ok: true,
      start: 5,
      end: 5 + DEFAULT_GIF_SECONDS,
    });
    expect(resolveGifRange('55', '', 60)).toEqual({
      ok: true,
      start: 55,
      end: 60,
    });
  });
  it('開始・終了を分:秒で指定できる', () => {
    expect(resolveGifRange('0:10', '0:15.5', 60)).toEqual({
      ok: true,
      start: 10,
      end: 15.5,
    });
  });
  it('終了は動画の長さ（誤差0.05秒まで）を許容し、長さで切り詰める', () => {
    expect(resolveGifRange('0', '60', 60)).toEqual({
      ok: true,
      start: 0,
      end: 60,
    });
    expect(resolveGifRange('0', '60.04', 60)).toEqual({
      ok: true,
      start: 0,
      end: 60,
    });
    expect(resolveGifRange('0', '60.2', 60)).toEqual({
      ok: false,
      error: 'outOfRange',
    });
  });
  it('不正な形式・範囲外・順序エラー', () => {
    expect(resolveGifRange('abc', '', 60)).toEqual({
      ok: false,
      error: 'invalid',
    });
    expect(resolveGifRange('60', '', 60)).toEqual({
      ok: false,
      error: 'outOfRange',
    });
    expect(resolveGifRange('0', '90', 60)).toEqual({
      ok: false,
      error: 'outOfRange',
    });
    expect(resolveGifRange('20', '10', 60)).toEqual({
      ok: false,
      error: 'order',
    });
    expect(resolveGifRange('10', '10', 60)).toEqual({
      ok: false,
      error: 'order',
    });
  });
});

describe('resolveFrameTime', () => {
  it('空欄は 0 秒', () => {
    expect(resolveFrameTime('', 10)).toEqual({ ok: true, time: 0 });
  });
  it('時刻を解釈する', () => {
    expect(resolveFrameTime('1:05.5', 100)).toEqual({ ok: true, time: 65.5 });
  });
  it('不正・範囲外', () => {
    expect(resolveFrameTime('x', 10)).toEqual({ ok: false, error: 'invalid' });
    expect(resolveFrameTime('10', 10)).toEqual({
      ok: false,
      error: 'outOfRange',
    });
  });
});

describe('planGif', () => {
  const source = { width: 1920, height: 1080 };

  it('FPS と範囲からコマの時刻を作る', () => {
    const plan = planGif({ start: 2, end: 4, fps: 10, source, width: 480 });
    expect(plan.ok).toBe(true);
    if (!plan.ok) return;
    expect(plan.timestamps).toHaveLength(20);
    expect(plan.timestamps[0]).toBe(2);
    expect(plan.timestamps[1]).toBeCloseTo(2.1);
    expect(plan.timestamps[19]).toBeLessThan(4);
    expect(plan.width).toBe(480);
    expect(plan.height).toBe(270);
  });
  it('範囲が1コマ分より短くても最低1コマ', () => {
    const plan = planGif({ start: 1, end: 1.05, fps: 10, source, width: 480 });
    expect(plan.ok && plan.timestamps).toEqual([1]);
  });
  it('幅が未指定・極端な値でも既定・下限・上限の範囲に収まる', () => {
    const widthOf = (width: number) => {
      const plan = planGif({ start: 0, end: 1, fps: 5, source, width });
      if (!plan.ok) throw new Error('plan should be ok');
      return plan.width;
    };
    expect(widthOf(0)).toBe(DEFAULT_WIDTH);
    expect(widthOf(Number.NaN)).toBe(DEFAULT_WIDTH);
    expect(widthOf(5)).toBe(16);
    expect(widthOf(99999)).toBe(MAX_GIF_WIDTH);
  });
  it('元の動画より大きな幅にはしない', () => {
    const plan = planGif({
      start: 0,
      end: 1,
      fps: 5,
      source: { width: 320, height: 240 },
      width: 800,
    });
    expect(plan.ok && [plan.width, plan.height]).toEqual([320, 240]);
  });
  it('コマ数が上限を超えるとエラー', () => {
    const plan = planGif({ start: 0, end: 30, fps: 20, source, width: 320 });
    expect(plan).toEqual({
      ok: false,
      error: 'tooManyFrames',
      max: MAX_GIF_FRAMES,
    });
  });
  it('総画素数が上限を超えるとエラー', () => {
    const plan = planGif({ start: 0, end: 15, fps: 20, source, width: 1200 });
    expect(plan.ok).toBe(false);
    if (!plan.ok) expect(plan.error).toBe('tooLarge');
  });
});

describe('ファイル名', () => {
  it('GIFは元の名前の拡張子を .gif に替える', () => {
    expect(buildGifFileName('clip.mp4')).toBe('clip.gif');
    expect(buildGifFileName('my.video.mov')).toBe('my.video.gif');
    expect(buildGifFileName('noext')).toBe('noext.gif');
    expect(buildGifFileName('.mp4')).toBe('.mp4.gif');
  });
  it('フレームPNGは時刻を含める', () => {
    expect(buildFrameFileName('clip.mp4', 12.5)).toBe('clip-12.5s.png');
    expect(buildFrameFileName('clip.mp4', 3)).toBe('clip-3s.png');
    expect(buildFrameFileName('clip.mp4', 0.5)).toBe('clip-0.5s.png');
    expect(buildFrameFileName('clip.mp4', 0.04)).toBe('clip-0s.png');
  });
  it('日本語のファイル名もそのまま使う', () => {
    expect(buildGifFileName('動画テスト.mp4')).toBe('動画テスト.gif');
    expect(buildFrameFileName('動画テスト.mp4', 1)).toBe('動画テスト-1s.png');
  });
});
