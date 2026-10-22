/** エンコード方式。url=最小限のURLエスケープ / base64=Base64 */
export type EncodeMethod = 'url' | 'base64';
export const ENCODE_METHODS: EncodeMethod[] = ['url', 'base64'];

export const SVG_NS = 'http://www.w3.org/2000/svg';

export type PrepareResult =
  { ok: true; svg: string } | { ok: false; error: 'empty' | 'not-svg' };

/**
 * 貼り付けられたSVGを整える。XML宣言・DOCTYPE・コメントを除き、空白を詰め、
 * xmlns が無ければ補う（data URIの画像ではxmlnsが無いと表示されない）。
 */
export function prepareSvg(raw: string): PrepareResult {
  const stripped = raw
    .replace(/<\?xml[\s\S]*?\?>/gi, '')
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/<!DOCTYPE[^[>]*(\[[\s\S]*?\])?\s*>/gi, '')
    .trim();
  if (stripped === '') return { ok: false, error: 'empty' };

  const start = stripped.search(/<svg[\s>/]/i);
  if (start < 0) return { ok: false, error: 'not-svg' };
  let svg = stripped.slice(start);

  const openTag = /^<svg\b[^>]*>/i.exec(svg);
  if (!openTag) return { ok: false, error: 'not-svg' };
  const selfClosing = /\/\s*>$/.test(openTag[0]);
  if (!selfClosing) {
    const end = svg.search(/<\/svg\s*>\s*$/i);
    if (end < 0) return { ok: false, error: 'not-svg' };
  }

  svg = svg.replace(/\s+/g, ' ').replace(/>\s+</g, '><');
  if (!/^<svg\b[^>]*\sxmlns\s*=/i.test(svg)) {
    svg = svg.replace(/^<svg\b/i, `<svg xmlns="${SVG_NS}"`);
  }
  return { ok: true, svg };
}

/**
 * 最小限のエスケープでdata URIにする。`url("...")` の中に入れる前提。
 * エスケープ対象は % # < > \ と引用符、非ASCII文字のみ。
 */
export function encodeSvgUrl(svg: string): string {
  // 属性値に ' が無ければ " を ' に置き換えて短くする。あれば %22 にする
  const quote = svg.includes("'") ? '%22' : "'";
  const body = svg
    .replace(/%/g, '%25')
    .replace(/#/g, '%23')
    .replace(/</g, '%3C')
    .replace(/>/g, '%3E')
    .replace(/\\/g, '%5C')
    .replace(/"/g, quote)
    .replace(/[^\x20-\x7e]/gu, (ch) =>
      /^[\ud800-\udfff]$/.test(ch) ? '%EF%BF%BD' : encodeURIComponent(ch),
    );
  return `data:image/svg+xml,${body}`;
}

/** UTF-8としてBase64化したdata URIにする */
export function encodeSvgBase64(svg: string): string {
  const bytes = new TextEncoder().encode(svg);
  let binary = '';
  const chunk = 0x8000;
  for (let i = 0; i < bytes.length; i += chunk) {
    binary += String.fromCharCode(...bytes.subarray(i, i + chunk));
  }
  return `data:image/svg+xml;base64,${btoa(binary)}`;
}

export function encodeSvg(svg: string, method: EncodeMethod): string {
  return method === 'base64' ? encodeSvgBase64(svg) : encodeSvgUrl(svg);
}

/** data URIを背景に指定するCSS */
export function buildCss(dataUri: string, includeLayout: boolean): string {
  const lines = [`background-image: url("${dataUri}");`];
  if (includeLayout) {
    lines.push(
      'background-repeat: no-repeat;',
      'background-position: center;',
      'background-size: contain;',
    );
  }
  return lines.join('\n');
}

export type ConvertResult =
  | {
      ok: true;
      /** 整形後のSVG */
      svg: string;
      dataUri: string;
      css: string;
      /** 整形後SVGのバイト数（UTF-8） */
      originalBytes: number;
      /** data URIの文字数 */
      outputLength: number;
      /** 出力文字数 / 元バイト数 の百分率（整数） */
      ratio: number;
    }
  | { ok: false; error: 'empty' | 'not-svg' };

export function convertSvg(
  raw: string,
  method: EncodeMethod,
  includeLayout: boolean,
): ConvertResult {
  const prepared = prepareSvg(raw);
  if (!prepared.ok) return prepared;
  const dataUri = encodeSvg(prepared.svg, method);
  const originalBytes = new TextEncoder().encode(prepared.svg).length;
  return {
    ok: true,
    svg: prepared.svg,
    dataUri,
    css: buildCss(dataUri, includeLayout),
    originalBytes,
    outputLength: dataUri.length,
    ratio: Math.round((dataUri.length / originalBytes) * 100),
  };
}
