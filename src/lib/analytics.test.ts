import { afterEach, describe, expect, it, vi } from 'vitest';
import { getToolSlug, trackEvent } from './analytics';

afterEach(() => vi.unstubAllGlobals());

describe('getToolSlug', () => {
  it('ja/en のツールURLからslugを取り出す', () => {
    expect(getToolSlug('/tools/base64/')).toBe('base64');
    expect(getToolSlug('/en/tools/base64')).toBe('base64');
  });

  it('ツール以外（トップ・カテゴリ一覧）は null', () => {
    expect(getToolSlug('/')).toBeNull();
    expect(getToolSlug('/tools/category/pdf/')).toBeNull();
    expect(getToolSlug('/en/faq/')).toBeNull();
  });
});

describe('trackEvent', () => {
  it('window が無い環境では何もしない', () => {
    expect(() => trackEvent('copy')).not.toThrow();
  });

  it('gtag が無ければ何もしない', () => {
    vi.stubGlobal('window', { location: { pathname: '/tools/base64/' } });
    expect(() => trackEvent('copy')).not.toThrow();
  });

  it('ツールページではslug付きでイベントを送る', () => {
    const gtag = vi.fn();
    vi.stubGlobal('window', { gtag, location: { pathname: '/tools/base64/' } });
    trackEvent('copy');
    expect(gtag).toHaveBeenCalledWith('event', 'copy', { tool: 'base64' });
  });

  it('gtag が例外を投げても呼び出し元へ伝えない', () => {
    const gtag = vi.fn(() => {
      throw new Error('x');
    });
    vi.stubGlobal('window', { gtag, location: { pathname: '/' } });
    expect(() => trackEvent('copy')).not.toThrow();
  });
});
