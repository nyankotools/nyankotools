import { describe, expect, it } from 'vitest';
import { BACK_TO_TOP_THRESHOLD, shouldShowBackToTop } from './back-to-top';

describe('shouldShowBackToTop', () => {
  it('しきい値以下では表示しない', () => {
    expect(shouldShowBackToTop(0)).toBe(false);
    expect(shouldShowBackToTop(BACK_TO_TOP_THRESHOLD)).toBe(false);
  });
  it('しきい値を超えたら表示する', () => {
    expect(shouldShowBackToTop(BACK_TO_TOP_THRESHOLD + 1)).toBe(true);
  });
});
