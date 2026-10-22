import { describe, expect, it } from 'vitest';
import { generateRubyHtml, parseRuby } from './ruby-tag-generator';

const rp = { rp: true, br: false };
const noRp = { rp: false, br: false };

describe('parseRuby', () => {
  it('漢字《かんじ》形式を解析する', () => {
    const r = parseRuby('これは漢字《かんじ》です');
    expect(r.rubyCount).toBe(1);
    expect(r.tokens).toEqual([
      { type: 'text', text: 'これは' },
      { type: 'ruby', base: '漢字', rt: 'かんじ' },
      { type: 'text', text: 'です' },
    ]);
  });

  it('｜親文字《ルビ》形式で漢字以外も親文字にできる', () => {
    const r = parseRuby('｜東京タワー《とうきょうタワー》');
    expect(r.tokens).toEqual([
      { type: 'ruby', base: '東京タワー', rt: 'とうきょうタワー' },
    ]);
  });

  it('半角パイプも使える', () => {
    expect(parseRuby('|ABC《えーびーしー》').rubyCount).toBe(1);
  });

  it('漢字の連続のうち直前の《》に接する部分だけを親文字にする', () => {
    const r = parseRuby('送り仮名漢字《かんじ》');
    expect(r.tokens).toEqual([
      { type: 'text', text: '送り' },
      { type: 'ruby', base: '仮名漢字', rt: 'かんじ' },
    ]);
  });

  it('直前に漢字がない《》はそのまま残す', () => {
    const r = parseRuby('かな《ルビ》');
    expect(r.rubyCount).toBe(0);
    expect(r.tokens).toEqual([{ type: 'text', text: 'かな《ルビ》' }]);
  });

  it('閉じていない・空のルビは変換しない', () => {
    expect(parseRuby('漢字《かん').rubyCount).toBe(0);
    expect(parseRuby('漢字《》').rubyCount).toBe(0);
    expect(parseRuby('漢字《 》').rubyCount).toBe(0);
  });

  it('改行をまたぐルビは変換しない', () => {
    expect(parseRuby('漢字《か\nん》').rubyCount).toBe(0);
  });

  it('空文字は空トークン', () => {
    expect(parseRuby('')).toEqual({ tokens: [], rubyCount: 0 });
  });

  it('々や複数のルビを扱える', () => {
    const r = parseRuby('時々《ときどき》人々《ひとびと》');
    expect(r.rubyCount).toBe(2);
  });
});

describe('generateRubyHtml', () => {
  it('rpありのHTMLを生成する', () => {
    expect(generateRubyHtml('漢字《かんじ》', rp).html).toBe(
      '<ruby>漢字<rp>(</rp><rt>かんじ</rt><rp>)</rp></ruby>',
    );
  });

  it('rpなしのHTMLを生成する', () => {
    expect(generateRubyHtml('漢字《かんじ》', noRp).html).toBe(
      '<ruby>漢字<rt>かんじ</rt></ruby>',
    );
  });

  it('テキストとルビ内のHTML特殊文字をエスケープする', () => {
    const r = generateRubyHtml('<script>alert("x")</script>&|<b>《<i>》', noRp);
    expect(r.html).not.toContain('<script>');
    expect(r.html).toContain('&lt;script&gt;');
    expect(r.html).toContain('<ruby>&lt;b&gt;<rt>&lt;i&gt;</rt></ruby>');
  });

  it('brオプションで改行を<br>にする', () => {
    expect(generateRubyHtml('a\nb', { rp: false, br: true }).html).toBe(
      'a<br>\nb',
    );
    expect(generateRubyHtml('a\r\nb', { rp: false, br: true }).html).toBe(
      'a<br>\nb',
    );
    expect(generateRubyHtml('a\nb', noRp).html).toBe('a\nb');
  });
});
