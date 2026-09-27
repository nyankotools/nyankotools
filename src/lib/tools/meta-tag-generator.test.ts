import { describe, expect, it } from 'vitest';
import {
  buildMetaTags,
  escapeHtmlAttribute,
  extractDomain,
  normalizeTwitterHandle,
  type MetaTagInput,
} from './meta-tag-generator';

const baseInput: MetaTagInput = {
  title: '',
  description: '',
  url: '',
  imageUrl: '',
  siteName: '',
  twitterCard: 'summary_large_image',
  twitterSite: '',
  locale: '',
};

describe('escapeHtmlAttribute', () => {
  it('&, <, >, ", \' をエスケープする', () => {
    expect(escapeHtmlAttribute(`<a href="x">O'Reilly & Sons</a>`)).toBe(
      '&lt;a href=&quot;x&quot;&gt;O&#39;Reilly &amp; Sons&lt;/a&gt;',
    );
  });

  it('特殊文字を含まない文字列はそのまま', () => {
    expect(escapeHtmlAttribute('普通のタイトル')).toBe('普通のタイトル');
  });
});

describe('normalizeTwitterHandle', () => {
  it('先頭に@がなければ補う', () => {
    expect(normalizeTwitterHandle('nyankotools')).toBe('@nyankotools');
  });

  it('先頭に@があればそのまま', () => {
    expect(normalizeTwitterHandle('@nyankotools')).toBe('@nyankotools');
  });

  it('前後の空白を除去する', () => {
    expect(normalizeTwitterHandle('  nyankotools  ')).toBe('@nyankotools');
  });

  it('空文字は空文字のまま', () => {
    expect(normalizeTwitterHandle('')).toBe('');
    expect(normalizeTwitterHandle('   ')).toBe('');
  });

  it('@が複数連続していても単一の@に正規化する', () => {
    expect(normalizeTwitterHandle('@@nyankotools')).toBe('@nyankotools');
    expect(normalizeTwitterHandle('@@@nyankotools')).toBe('@nyankotools');
  });
});

describe('extractDomain', () => {
  it('URLからホスト名を取り出す', () => {
    expect(
      extractDomain('https://nyankotools.com/tools/meta-tag-generator/'),
    ).toBe('nyankotools.com');
  });

  it('不正なURLは空文字を返す', () => {
    expect(extractDomain('not a url')).toBe('');
  });

  it('空文字は空文字を返す', () => {
    expect(extractDomain('')).toBe('');
    expect(extractDomain('   ')).toBe('');
  });
});

describe('buildMetaTags', () => {
  it('全項目入力時に基本メタ・OGP・Twitter Cardをすべて生成する', () => {
    const result = buildMetaTags({
      title: 'テストページ',
      description: 'ページの説明文',
      url: 'https://nyankotools.com/',
      imageUrl: 'https://nyankotools.com/ogp.png',
      siteName: 'NyankoTools',
      twitterCard: 'summary_large_image',
      twitterSite: 'nyankotools',
      locale: 'ja_JP',
    });

    expect(result).toContain('<title>テストページ</title>');
    expect(result).toContain(
      '<meta name="description" content="ページの説明文">',
    );
    expect(result).toContain(
      '<link rel="canonical" href="https://nyankotools.com/">',
    );
    expect(result).toContain(
      '<meta property="og:title" content="テストページ">',
    );
    expect(result).toContain(
      '<meta property="og:description" content="ページの説明文">',
    );
    expect(result).toContain('<meta property="og:type" content="website">');
    expect(result).toContain(
      '<meta property="og:url" content="https://nyankotools.com/">',
    );
    expect(result).toContain(
      '<meta property="og:image" content="https://nyankotools.com/ogp.png">',
    );
    expect(result).toContain(
      '<meta property="og:site_name" content="NyankoTools">',
    );
    expect(result).toContain('<meta property="og:locale" content="ja_JP">');
    expect(result).toContain(
      '<meta name="twitter:card" content="summary_large_image">',
    );
    expect(result).toContain(
      '<meta name="twitter:title" content="テストページ">',
    );
    expect(result).toContain(
      '<meta name="twitter:description" content="ページの説明文">',
    );
    expect(result).toContain(
      '<meta name="twitter:image" content="https://nyankotools.com/ogp.png">',
    );
    expect(result).toContain(
      '<meta name="twitter:site" content="@nyankotools">',
    );
  });

  it('未入力項目は行を出力しない', () => {
    const result = buildMetaTags({ ...baseInput, title: 'タイトルのみ' });
    expect(result).toContain('<title>タイトルのみ</title>');
    expect(result).not.toContain('name="description"');
    expect(result).not.toContain('rel="canonical"');
    expect(result).not.toContain('og:image');
    expect(result).not.toContain('og:site_name');
    expect(result).not.toContain('og:locale');
    expect(result).not.toContain('twitter:image');
    expect(result).not.toContain('twitter:site');
  });

  it('title/description/url/imageUrl/siteNameがすべて空ならog:typeも出力しない', () => {
    const result = buildMetaTags(baseInput);
    expect(result).toBe('');
  });

  it('title・description・imageUrl・twitterSiteがすべて空ならTwitter Cardブロックを出力しない', () => {
    const result = buildMetaTags({ ...baseInput, url: 'https://example.com/' });
    expect(result).not.toContain('twitter:card');
  });

  it('twitterSiteのみ入力してもTwitter Cardブロックを出力する', () => {
    const result = buildMetaTags({ ...baseInput, twitterSite: 'nyankotools' });
    expect(result).toContain(
      '<meta name="twitter:card" content="summary_large_image">',
    );
    expect(result).toContain(
      '<meta name="twitter:site" content="@nyankotools">',
    );
    expect(result).not.toContain('twitter:title');
  });

  it('localeのみ入力してもog:typeを出力する', () => {
    const result = buildMetaTags({ ...baseInput, locale: 'ja_JP' });
    expect(result).toContain('<meta property="og:type" content="website">');
    expect(result).toContain('<meta property="og:locale" content="ja_JP">');
  });

  it('HTML特殊文字を含む値はエスケープして出力する', () => {
    const result = buildMetaTags({
      ...baseInput,
      title: '"引用符" & <タグ>',
    });
    expect(result).toContain(
      '<title>&quot;引用符&quot; &amp; &lt;タグ&gt;</title>',
    );
    expect(result).not.toContain('<タグ>');
  });

  it('前後の空白はトリムしてから出力する', () => {
    const result = buildMetaTags({ ...baseInput, title: '  タイトル  ' });
    expect(result).toContain('<title>タイトル</title>');
  });

  it('twitterCardがsummaryのときはsummaryを出力する', () => {
    const result = buildMetaTags({
      ...baseInput,
      title: 'タイトル',
      twitterCard: 'summary',
    });
    expect(result).toContain('<meta name="twitter:card" content="summary">');
  });

  it('ブロック同士は空行で区切られる（基本タグ・OGP・Twitter Cardの3ブロック）', () => {
    const result = buildMetaTags({
      ...baseInput,
      title: 'タイトル',
      description: '説明',
    });
    const blocks = result.split('\n\n');
    expect(blocks.length).toBe(3);
  });
});
