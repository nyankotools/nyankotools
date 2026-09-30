import { describe, expect, it } from 'vitest';
import { describeError, shouldReport } from './error-boundary';

const ORIGIN = 'https://nyankotools.com';

describe('shouldReport', () => {
  it('自サイトのスクリプトのエラーは通知する', () => {
    expect(
      shouldReport('x is not defined', `${ORIGIN}/_astro/a.js`, ORIGIN),
    ).toBe(true);
  });

  it('別オリジン（拡張機能・GA等）のエラーは通知しない', () => {
    expect(
      shouldReport('boom', 'https://www.googletagmanager.com/gtag/js', ORIGIN),
    ).toBe(false);
    expect(shouldReport('boom', 'chrome-extension://abc/x.js', ORIGIN)).toBe(
      false,
    );
  });

  it('ResizeObserver の無害な警告と、詳細不明の Script error. は通知しない', () => {
    expect(
      shouldReport(
        'ResizeObserver loop completed with undelivered notifications.',
        undefined,
        ORIGIN,
      ),
    ).toBe(false);
    expect(shouldReport('Script error.', undefined, ORIGIN)).toBe(false);
  });
});

describe('describeError', () => {
  it('種別とファイル名・行番号だけを返す（メッセージは含めない）', () => {
    expect(describeError('TypeError', `${ORIGIN}/_astro/a.B1.js?v=1`, 42)).toBe(
      'TypeError @a.B1.js:42',
    );
  });

  it('位置が無ければ種別のみ', () => {
    expect(describeError('UnhandledRejection', undefined, undefined)).toBe(
      'UnhandledRejection',
    );
  });
});
