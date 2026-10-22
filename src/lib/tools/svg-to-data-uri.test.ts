import { describe, expect, it } from 'vitest';
import {
  buildCss,
  convertSvg,
  encodeSvgBase64,
  encodeSvgUrl,
  prepareSvg,
} from './svg-to-data-uri';

const SAMPLE =
  '<svg xmlns="http://www.w3.org/2000/svg" width="10" height="10">\n  <rect width="10" height="10" fill="#f00"/>\n</svg>';

describe('prepareSvg', () => {
  it('空入力はempty', () => {
    expect(prepareSvg('  \n ')).toEqual({ ok: false, error: 'empty' });
  });

  it('SVGでない入力はnot-svg', () => {
    expect(prepareSvg('hello')).toEqual({ ok: false, error: 'not-svg' });
    expect(prepareSvg('<div></div>')).toEqual({ ok: false, error: 'not-svg' });
    expect(prepareSvg('<svg width="1">')).toEqual({
      ok: false,
      error: 'not-svg',
    });
  });

  it('XML宣言・DOCTYPE・コメントを除き空白を詰める', () => {
    const raw = `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">
<!-- comment -->
${SAMPLE}`;
    const r = prepareSvg(raw);
    expect(r).toEqual({
      ok: true,
      svg: '<svg xmlns="http://www.w3.org/2000/svg" width="10" height="10"><rect width="10" height="10" fill="#f00"/></svg>',
    });
  });

  it('CRLFの改行を含むSVGも整形できる', () => {
    const r = prepareSvg('<svg width="1">\r\n  <path d="M0 0"/>\r\n</svg>\r\n');
    expect(r.ok && r.svg).toBe(
      '<svg xmlns="http://www.w3.org/2000/svg" width="1"><path d="M0 0"/></svg>',
    );
  });

  it('xmlnsが無ければ補う', () => {
    const r = prepareSvg('<svg width="1"><path d="M0 0"/></svg>');
    expect(r.ok && r.svg).toBe(
      '<svg xmlns="http://www.w3.org/2000/svg" width="1"><path d="M0 0"/></svg>',
    );
  });

  it('自己閉じのsvgも受け付ける', () => {
    const r = prepareSvg('<svg width="1"/>');
    expect(r.ok && r.svg).toContain('xmlns=');
  });
});

describe('encodeSvgUrl', () => {
  it('必要な文字だけをエスケープし、二重引用符を単一引用符にする', () => {
    const uri = encodeSvgUrl('<svg a="1" fill="#f00" w="100%"/>');
    expect(uri).toBe(
      "data:image/svg+xml,%3Csvg a='1' fill='%23f00' w='100%25'/%3E",
    );
  });

  it('単一引用符を含む場合は二重引用符を%22にする', () => {
    const uri = encodeSvgUrl(`<svg font-family="'A'"/>`);
    expect(uri).toBe("data:image/svg+xml,%3Csvg font-family=%22'A'%22/%3E");
    expect(uri).not.toContain('"');
  });

  it('バックスラッシュと非ASCII文字をエスケープする', () => {
    const uri = encodeSvgUrl('<text>\\あ</text>');
    expect(uri).toContain('%5C');
    expect(uri).toContain('%E3%81%82');
    expect(uri).not.toMatch(/[^\x20-\x7e]/u);
  });

  it('絵文字（サロゲートペア）を欠けずにUTF-8のパーセントエンコードにする', () => {
    const uri = encodeSvgUrl('<text>😀</text>');
    expect(uri).toContain('%F0%9F%98%80');
    expect(decodeURIComponent(uri.replace('data:image/svg+xml,', ''))).toBe(
      '<text>😀</text>',
    );
  });

  it('decodeすると元のSVG（引用符変換後）に戻る', () => {
    const svg = '<svg a="1" b="50%" c="#abc">あ</svg>';
    const body = encodeSvgUrl(svg).replace('data:image/svg+xml,', '');
    expect(decodeURIComponent(body)).toBe(svg.replace(/"/g, "'"));
  });
});

describe('encodeSvgBase64', () => {
  it('UTF-8でBase64化できる', () => {
    const svg = '<svg>あ</svg>';
    const uri = encodeSvgBase64(svg);
    expect(uri.startsWith('data:image/svg+xml;base64,')).toBe(true);
    const b64 = uri.split(',')[1];
    const bytes = Uint8Array.from(atob(b64), (c) => c.charCodeAt(0));
    expect(new TextDecoder().decode(bytes)).toBe(svg);
  });

  it('大きな入力でもエラーにならない', () => {
    const svg = `<svg>${'a'.repeat(200000)}</svg>`;
    const uri = encodeSvgBase64(svg);
    expect(uri.length).toBeGreaterThan(200000);
  });
});

describe('buildCss', () => {
  it('background-imageを出力する', () => {
    expect(buildCss('data:x', false)).toBe('background-image: url("data:x");');
  });

  it('レイアウト指定を追加できる', () => {
    expect(buildCss('data:x', true).split('\n')).toEqual([
      'background-image: url("data:x");',
      'background-repeat: no-repeat;',
      'background-position: center;',
      'background-size: contain;',
    ]);
  });
});

describe('convertSvg', () => {
  it('urlとbase64で変換結果を返す', () => {
    const url = convertSvg(SAMPLE, 'url', false);
    expect(url.ok).toBe(true);
    if (!url.ok) return;
    expect(url.dataUri.startsWith('data:image/svg+xml,')).toBe(true);
    expect(url.css).toBe(`background-image: url("${url.dataUri}");`);
    expect(url.originalBytes).toBe(url.svg.length);
    expect(url.ratio).toBe(
      Math.round((url.outputLength / url.originalBytes) * 100),
    );

    const b64 = convertSvg(SAMPLE, 'base64', true);
    expect(b64.ok && b64.dataUri).toContain(';base64,');
    expect(b64.ok && b64.css).toContain('background-size: contain;');
  });

  it('エラーを伝える', () => {
    expect(convertSvg('', 'url', false)).toEqual({ ok: false, error: 'empty' });
    expect(convertSvg('abc', 'url', false)).toEqual({
      ok: false,
      error: 'not-svg',
    });
  });
});

describe('lone surrogate', () => {
  it('孤立サロゲートでも例外を投げない', () => {
    expect(() => encodeSvgUrl('<svg>\ud800</svg>')).not.toThrow();
  });
});
