import { afterEach, describe, expect, it, vi } from 'vitest';
import { getToolSlug, trackEvent } from './analytics';

function stubDocument(slug?: string) {
  vi.stubGlobal('document', {
    querySelector: vi.fn(() => (slug ? { dataset: { toolSlug: slug } } : null)),
  });
}

afterEach(() => vi.unstubAllGlobals());

describe('getToolSlug', () => {
  it('document が無い環境では null', () => {
    expect(getToolSlug()).toBeNull();
  });

  it('data-tool-slug があればそのslug、無ければ null', () => {
    stubDocument('base64');
    expect(getToolSlug()).toBe('base64');
    stubDocument();
    expect(getToolSlug()).toBeNull();
  });
});

describe('trackEvent', () => {
  it('window が無い環境では何もしない', () => {
    expect(() => trackEvent('copy')).not.toThrow();
  });

  it('gtag が無ければ何もしない', () => {
    stubDocument('base64');
    vi.stubGlobal('window', {});
    expect(() => trackEvent('copy')).not.toThrow();
  });

  it('ツールページではslug付きでイベントを送る', () => {
    const gtag = vi.fn();
    stubDocument('base64');
    vi.stubGlobal('window', { gtag });
    trackEvent('copy');
    expect(gtag).toHaveBeenCalledWith('event', 'copy', { tool: 'base64' });
  });

  it('ツール以外のページではslugを付けない', () => {
    const gtag = vi.fn();
    stubDocument();
    vi.stubGlobal('window', { gtag });
    trackEvent('copy');
    expect(gtag).toHaveBeenCalledWith('event', 'copy', {});
  });

  it('gtag が例外を投げても呼び出し元へ伝えない', () => {
    const gtag = vi.fn(() => {
      throw new Error('x');
    });
    stubDocument();
    vi.stubGlobal('window', { gtag });
    expect(() => trackEvent('copy')).not.toThrow();
  });
});
