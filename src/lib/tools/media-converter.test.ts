import { describe, expect, it } from 'vitest';
import {
  buildOutputFileName,
  formatDuration,
  formatFileSize,
  isAcceptedMediaFile,
  limitedHeight,
  parseTimeInput,
  resolveTrim,
} from './media-converter';

describe('parseTimeInput', () => {
  it('空文字は null', () => {
    expect(parseTimeInput('')).toBeNull();
    expect(parseTimeInput('  ')).toBeNull();
  });
  it('秒・分:秒・時:分:秒・小数を解釈する', () => {
    expect(parseTimeInput('90')).toBe(90);
    expect(parseTimeInput('1:30')).toBe(90);
    expect(parseTimeInput('1:02:03')).toBe(3723);
    expect(parseTimeInput('0:01.5')).toBe(1.5);
    expect(parseTimeInput('12.25')).toBe(12.25);
  });
  it('不正な形式は NaN', () => {
    expect(parseTimeInput('abc')).toBeNaN();
    expect(parseTimeInput('-1')).toBeNaN();
    expect(parseTimeInput('1:75')).toBeNaN();
    expect(parseTimeInput('1:2:3:4')).toBeNaN();
    expect(parseTimeInput('1:')).toBeNaN();
  });
});

describe('resolveTrim', () => {
  it('両方空なら全体', () => {
    expect(resolveTrim('', '', 60)).toEqual({ ok: true, range: null });
  });
  it('開始のみ・終了のみ', () => {
    expect(resolveTrim('10', '', 60)).toEqual({
      ok: true,
      range: { start: 10, end: 60 },
    });
    expect(resolveTrim('', '0:30', 60)).toEqual({
      ok: true,
      range: { start: 0, end: 30 },
    });
  });
  it('全体を指定した場合は null', () => {
    expect(resolveTrim('0', '60', 60)).toEqual({ ok: true, range: null });
  });
  it('エラーを判定する', () => {
    expect(resolveTrim('x', '', 60)).toEqual({ ok: false, error: 'invalid' });
    expect(resolveTrim('60', '', 60)).toEqual({
      ok: false,
      error: 'outOfRange',
    });
    expect(resolveTrim('', '90', 60)).toEqual({
      ok: false,
      error: 'outOfRange',
    });
    expect(resolveTrim('30', '10', 60)).toEqual({ ok: false, error: 'order' });
    expect(resolveTrim('10', '10', 60)).toEqual({ ok: false, error: 'order' });
  });
});

describe('formatDuration', () => {
  it('表示形式', () => {
    expect(formatDuration(0)).toBe('0:00');
    expect(formatDuration(65)).toBe('1:05');
    expect(formatDuration(3723)).toBe('1:02:03');
    expect(formatDuration(1.5)).toBe('0:01.5');
    expect(formatDuration(Number.NaN)).toBe('0:00');
  });
});

describe('formatFileSize', () => {
  it('単位を切り替える', () => {
    expect(formatFileSize(500)).toBe('500 B');
    expect(formatFileSize(1536)).toBe('1.5 KB');
    expect(formatFileSize(5 * 1024 * 1024)).toBe('5.0 MB');
    expect(formatFileSize(2 * 1024 * 1024 * 1024)).toBe('2.00 GB');
  });
});

describe('limitedHeight', () => {
  it('上限を超える場合だけ縮小する', () => {
    expect(limitedHeight(1080, 720)).toBe(720);
    expect(limitedHeight(480, 720)).toBeUndefined();
    expect(limitedHeight(720, 720)).toBeUndefined();
    expect(limitedHeight(1080, 0)).toBeUndefined();
  });
});

describe('buildOutputFileName', () => {
  it('拡張子を差し替える', () => {
    expect(buildOutputFileName('movie.mov', 'mp4')).toBe('movie.mp4');
    expect(buildOutputFileName('a.b.wav', 'mp3', '-converted')).toBe(
      'a.b-converted.mp3',
    );
    expect(buildOutputFileName('noext', 'webm')).toBe('noext.webm');
    expect(buildOutputFileName('.mp4', 'm4a')).toBe('.mp4.m4a');
  });
});

describe('isAcceptedMediaFile', () => {
  it('MIME または拡張子で判定する', () => {
    expect(isAcceptedMediaFile({ name: 'a.bin', type: 'video/mp4' })).toBe(
      true,
    );
    expect(isAcceptedMediaFile({ name: 'a.MKV', type: '' })).toBe(true);
    expect(isAcceptedMediaFile({ name: 'a.png', type: 'image/png' })).toBe(
      false,
    );
    expect(isAcceptedMediaFile({ name: 'noext', type: '' })).toBe(false);
  });
});
