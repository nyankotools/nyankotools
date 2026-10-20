import { describe, expect, it } from 'vitest';
import { ADS_ENABLED, shouldShowAds } from './ads';

describe('shouldShowAds', () => {
  it('マスタースイッチは出荷時 false', () => {
    expect(ADS_ENABLED).toBe(false);
    expect(shouldShowAds({ tool: {} })).toBe(false);
  });

  it('無効時はどのページでも出さない', () => {
    expect(shouldShowAds({ enabled: false, isAdPage: true })).toBe(false);
  });

  it('一般ツールには出す。ads:false と sensitive は除外', () => {
    expect(shouldShowAds({ enabled: true, tool: {} })).toBe(true);
    expect(shouldShowAds({ enabled: true, tool: { ads: false } })).toBe(false);
    expect(shouldShowAds({ enabled: true, tool: { sensitive: true } })).toBe(
      false,
    );
  });

  it('ツール以外は isAdPage のときだけ。noindex は常に除外', () => {
    expect(shouldShowAds({ enabled: true })).toBe(false);
    expect(shouldShowAds({ enabled: true, isAdPage: true })).toBe(true);
    expect(
      shouldShowAds({ enabled: true, isAdPage: true, noindex: true }),
    ).toBe(false);
  });
});
