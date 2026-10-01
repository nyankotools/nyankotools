export interface SvgSize {
  width: number;
  height: number;
}

/** 出力PNGの1辺の上限（px）。iOS Safariのcanvas面積上限（約1677万px）を超えて空画像になるのを防ぐ */
export const MAX_OUTPUT_DIMENSION = 8192;
/** 出力PNGの総画素数の上限。メモリ不足によるタブのクラッシュを防ぐ */
export const MAX_OUTPUT_PIXELS = 16_000_000;

const SVG_NAMESPACE = 'http://www.w3.org/2000/svg';
const ROOT_RE = /^<svg(?=[\s>/])((?:"[^"]*"|'[^']*'|[^>"'])*)>/i;

/** 長さ属性（width/height）の単位をpxへ換算する係数。% や未知の単位は対象外 */
const UNIT_TO_PX: Record<string, number> = {
  '': 1,
  px: 1,
  pt: 4 / 3,
  pc: 16,
  mm: 96 / 25.4,
  cm: 96 / 2.54,
  in: 96,
  em: 16,
  rem: 16,
  ex: 8,
};

/** コメント・XML宣言・DOCTYPEを除いた、`<svg` から始まる本体を返す。SVGでなければ null */
function extractSvgBody(svg: string): string | null {
  const body = svg
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/<\?xml[\s\S]*?\?>/gi, '')
    .replace(/<!DOCTYPE[^[>]*(\[[\s\S]*?\])?\s*>/gi, '')
    .trim();
  return ROOT_RE.test(body) ? body : null;
}

function getAttr(attrs: string, name: string): string | null {
  const m = new RegExp(`(?:^|\\s)${name}\\s*=\\s*(?:"([^"]*)"|'([^']*)')`, 'i');
  const r = m.exec(attrs);
  return r ? (r[1] ?? r[2]) : null;
}

function parseLength(value: string | null): number | null {
  if (value === null) return null;
  const m = /^\s*(\d*\.?\d+(?:e[+-]?\d+)?)\s*([a-z%]*)\s*$/i.exec(value);
  if (!m) return null;
  const factor = UNIT_TO_PX[m[2].toLowerCase()];
  if (factor === undefined) return null;
  const px = parseFloat(m[1]) * factor;
  return Number.isFinite(px) && px > 0 ? px : null;
}

function parseViewBox(value: string | null): SvgSize | null {
  if (value === null) return null;
  const parts = value
    .trim()
    .split(/[\s,]+/)
    .map(Number);
  if (parts.length !== 4 || parts.some((n) => !Number.isFinite(n))) return null;
  const [, , width, height] = parts;
  return width > 0 && height > 0 ? { width, height } : null;
}

/**
 * SVGの本来のサイズ（px）を求める。width/height 属性を優先し、
 * 片方または両方が無い・%指定のときは viewBox から補う。判定できなければ null。
 */
export function parseSvgSize(svg: string): SvgSize | null {
  const body = extractSvgBody(svg);
  if (!body) return null;
  const attrs = ROOT_RE.exec(body)![1];
  const width = parseLength(getAttr(attrs, 'width'));
  const height = parseLength(getAttr(attrs, 'height'));
  if (width && height) return { width, height };
  const vb = parseViewBox(getAttr(attrs, 'viewBox'));
  if (!vb) return null;
  if (width) return { width, height: (width * vb.height) / vb.width };
  if (height) return { width: (height * vb.width) / vb.height, height };
  return vb;
}

/**
 * <img> で確実に読み込めるよう、ルートの <svg> に xmlns・viewBox・width/height を整えたSVGを返す。
 * `size` は元のサイズ、`target` は描画したいサイズ。SVGでなければ null。
 */
export function prepareSvg(
  svg: string,
  size: SvgSize,
  target: SvgSize,
): string | null {
  const body = extractSvgBody(svg);
  if (!body) return null;
  const m = ROOT_RE.exec(body)!;
  let attrs = m[1];
  const selfClosing = /\/\s*$/.test(attrs);
  if (selfClosing) attrs = attrs.replace(/\/\s*$/, '');
  const hadViewBox = getAttr(attrs, 'viewBox') !== null;
  const hadNamespace = /(?:^|\s)xmlns\s*=/.test(attrs);
  attrs = attrs
    .replace(/(?:^|\s)(?:width|height)\s*=\s*(?:"[^"]*"|'[^']*')/gi, ' ')
    .trimEnd();
  const extra = [
    hadNamespace ? '' : ` xmlns="${SVG_NAMESPACE}"`,
    hadViewBox ? '' : ` viewBox="0 0 ${size.width} ${size.height}"`,
    ` width="${target.width}" height="${target.height}"`,
  ].join('');
  return `<svg${attrs}${extra}${selfClosing ? '/' : ''}>${body.slice(m[0].length)}`;
}

/** 元サイズに倍率をかけた出力サイズ（整数px、最小1） */
export function scaleSize(size: SvgSize, scale: number): SvgSize {
  return {
    width: Math.max(1, Math.round(size.width * scale)),
    height: Math.max(1, Math.round(size.height * scale)),
  };
}

export function isWithinOutputLimit(size: SvgSize): boolean {
  return (
    size.width <= MAX_OUTPUT_DIMENSION &&
    size.height <= MAX_OUTPUT_DIMENSION &&
    size.width * size.height <= MAX_OUTPUT_PIXELS
  );
}

/** ダウンロード用のファイル名。元のファイル名があれば拡張子だけ .png に置き換える */
export function pngFileName(sourceName: string | null): string {
  const base = (sourceName ?? '').replace(/\.[^./\\]*$/, '').trim();
  return `${base || 'image'}.png`;
}
