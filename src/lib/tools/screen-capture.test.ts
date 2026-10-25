import { describe, expect, it } from 'vitest';
import {
  captureFileName,
  classifyDisplayError,
  formatDimensions,
  normalizeDelay,
} from './screen-capture';

describe('classifyDisplayError', () => {
  it('許可拒否・非対応・不明を分類する', () => {
    expect(classifyDisplayError('NotAllowedError')).toBe('cancelled');
    expect(classifyDisplayError('NotSupportedError')).toBe('unsupported');
    expect(classifyDisplayError('SecurityError')).toBe('insecure');
    expect(classifyDisplayError(undefined)).toBe('unknown');
  });
  it('中断(AbortError)・権限の別名は許可拒否扱い、TypeError は非安全コンテキスト扱い', () => {
    expect(classifyDisplayError('AbortError')).toBe('cancelled');
    expect(classifyDisplayError('PermissionDeniedError')).toBe('cancelled');
    expect(classifyDisplayError('TypeError')).toBe('insecure');
    expect(classifyDisplayError('SomethingElse')).toBe('unknown');
  });
});

describe('normalizeDelay', () => {
  it('選択肢の値はそのまま返す', () => {
    expect(normalizeDelay(5)).toBe(5);
    expect(normalizeDelay(0)).toBe(0);
  });
  it('不正な値は 0 にする', () => {
    expect(normalizeDelay(7)).toBe(0);
    expect(normalizeDelay(NaN)).toBe(0);
    expect(normalizeDelay(-3)).toBe(0);
  });
});

describe('captureFileName', () => {
  it('日時入りのPNGファイル名にする', () => {
    expect(captureFileName(new Date(2026, 9, 5, 9, 3, 7))).toBe(
      'screenshot-20261005-090307.png',
    );
  });
});

describe('formatDimensions', () => {
  it('幅×高さを整数で表示する', () => {
    expect(formatDimensions(1920, 1080)).toBe('1920 × 1080 px');
    expect(formatDimensions(100.4, 50.6)).toBe('100 × 51 px');
  });
});
