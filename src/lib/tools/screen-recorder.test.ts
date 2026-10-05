import { describe, expect, it } from 'vitest';
import {
  classifyDisplayError,
  pickVideoMimeType,
  recordingFileName,
  videoExtensionForMime,
} from './screen-recorder';

describe('classifyDisplayError', () => {
  it('例外名を種別に分類する', () => {
    expect(classifyDisplayError('NotAllowedError')).toBe('cancelled');
    expect(classifyDisplayError('NotSupportedError')).toBe('unsupported');
    expect(classifyDisplayError('TypeError')).toBe('insecure');
    expect(classifyDisplayError('Foo')).toBe('unknown');
    expect(classifyDisplayError(undefined)).toBe('unknown');
  });
});

describe('pickVideoMimeType', () => {
  it('優先順に最初に使える形式を返す', () => {
    expect(pickVideoMimeType(() => true)).toBe('video/webm;codecs=vp9,opus');
    expect(pickVideoMimeType((m) => m === 'video/mp4')).toBe('video/mp4');
  });
  it('どれも使えなければ null', () => {
    expect(pickVideoMimeType(() => false)).toBeNull();
  });
});

describe('videoExtensionForMime', () => {
  it('MIMEタイプから拡張子を決める', () => {
    expect(videoExtensionForMime('video/mp4;codecs=avc1')).toBe('mp4');
    expect(videoExtensionForMime('video/webm;codecs=vp9')).toBe('webm');
    expect(videoExtensionForMime('')).toBe('webm');
  });
});

describe('recordingFileName', () => {
  it('日時入りのファイル名にする', () => {
    expect(recordingFileName(new Date(2026, 9, 5, 9, 3, 7), 'webm')).toBe(
      'screen-recording-20261005-090307.webm',
    );
  });
});
