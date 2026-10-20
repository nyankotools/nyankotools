import {
  MAX_DIMENSION,
  MAX_PIXELS,
  isWithinLimit,
  type Size,
} from './image-padding';
import {
  clampNumber,
  hexToRgba,
  parseHex,
  shadeColor,
} from './image-frame-maker';

export { MAX_DIMENSION, MAX_PIXELS, isWithinLimit, clampNumber, parseHex };
export type { Size };

export type DeviceType = 'phone' | 'tablet' | 'laptop' | 'browser';
export type FitMode = 'cover' | 'contain';

export const DEVICE_TYPES: DeviceType[] = [
  'phone',
  'tablet',
  'laptop',
  'browser',
];
export const FIT_MODES: FitMode[] = ['cover', 'contain'];

/** 出力幅(px)・余白(%)の範囲 */
export const MIN_OUTPUT_WIDTH = 300;
export const MAX_OUTPUT_WIDTH = 4000;
export const DEFAULT_OUTPUT_WIDTH = 1200;
export const MAX_PADDING = 20;
/** プレビューcanvasの長辺の上限（実寸の描画は保存時だけ行う） */
export const PREVIEW_MAX_EDGE = 800;

/** デバイスを選んだときに設定へ入れる本体色 */
export const DEVICE_DEFAULT_COLORS: Record<DeviceType, string> = {
  phone: '#111827',
  tablet: '#111827',
  laptop: '#1f2937',
  browser: '#e5e7eb',
};

/** 向きを変えられるのは縦長のデバイスだけ */
export function supportsOrientation(device: DeviceType): boolean {
  return device === 'phone' || device === 'tablet';
}

export interface MockupOptions {
  device: DeviceType;
  /** 画面を横向きにする（phone / tablet のみ） */
  landscape: boolean;
  fit: FitMode;
  /** 本体の色（#rrggbb） */
  bodyColor: string;
  /** 背景を塗らず透明にする */
  transparentBackground: boolean;
  /** 背景色（#rrggbb） */
  backgroundColor: string;
  /** 本体の影 */
  shadow: boolean;
  /** デバイスの幅に対する余白（%、0〜20） */
  padding: number;
  /** 出力画像の幅（px） */
  outputWidth: number;
}

export interface Shape {
  x: number;
  y: number;
  width: number;
  height: number;
  radius: number;
  color: string;
}

export interface Rect {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface ScreenRect extends Rect {
  radius: number;
}

export interface ShadowSpec {
  blur: number;
  offsetY: number;
  color: string;
}

export interface ImageDraw {
  sx: number;
  sy: number;
  sw: number;
  sh: number;
  dx: number;
  dy: number;
  dw: number;
  dh: number;
}

export interface MockupPlan {
  canvas: Size;
  /** 背景色。透明なら null */
  background: string | null;
  /** 本体・画面の下地（描画順。後のものが上に重なる） */
  shapes: Shape[];
  /** 影を落とす形 */
  shadowShapes: Shape[];
  shadow: ShadowSpec | null;
  /** 画像を表示する画面 */
  screen: ScreenRect;
  /** 画像の切り出しと描画先 */
  image: ImageDraw;
  /** 画像より上に描く部品（ノッチ・カメラ・ボタンなど） */
  overlays: Shape[];
}

/** デバイス1台ぶんの形（幅1を基準にした相対座標） */
interface Layout {
  width: number;
  height: number;
  shapes: Shape[];
  shadowShapes: Shape[];
  screen: ScreenRect;
  overlays: Shape[];
}

function shape(
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number,
  color: string,
): Shape {
  return { x, y, width, height, radius, color };
}

function circle(cx: number, cy: number, r: number, color: string): Shape {
  return shape(cx - r, cy - r, r * 2, r * 2, r, color);
}

function buildPhone(body: string): Layout {
  const W = 1;
  const H = 2.05;
  const edge = 0.008;
  const bezel = 0.04;
  const outer = shape(0, 0, W, H, 0.14, shadeColor(body, 0.25));
  const screen: ScreenRect = {
    x: bezel,
    y: bezel,
    width: W - bezel * 2,
    height: H - bezel * 2,
    radius: 0.1,
  };
  return {
    width: W,
    height: H,
    shapes: [
      outer,
      shape(edge, edge, W - edge * 2, H - edge * 2, 0.14 - edge, body),
      shape(
        screen.x,
        screen.y,
        screen.width,
        screen.height,
        screen.radius,
        '#000000',
      ),
    ],
    shadowShapes: [outer],
    screen,
    overlays: [shape(0.5 - 0.14, bezel + 0.022, 0.28, 0.04, 0.02, '#000000')],
  };
}

function buildTablet(body: string): Layout {
  const W = 1;
  const H = 1.36;
  const edge = 0.006;
  const bezel = 0.05;
  const outer = shape(0, 0, W, H, 0.07, shadeColor(body, 0.25));
  const screen: ScreenRect = {
    x: bezel,
    y: bezel,
    width: W - bezel * 2,
    height: H - bezel * 2,
    radius: 0.02,
  };
  return {
    width: W,
    height: H,
    shapes: [
      outer,
      shape(edge, edge, W - edge * 2, H - edge * 2, 0.07 - edge, body),
      shape(
        screen.x,
        screen.y,
        screen.width,
        screen.height,
        screen.radius,
        '#000000',
      ),
    ],
    shadowShapes: [outer],
    screen,
    overlays: [circle(0.5, bezel / 2, 0.008, shadeColor(body, 0.3))],
  };
}

function buildLaptop(body: string): Layout {
  const lidW = 1;
  const lidH = 0.64;
  const off = 0.07;
  const W = lidW + off * 2;
  const bezel = 0.028;
  const edge = 0.005;
  const baseColor = shadeColor(body, 0.35);
  const base = shape(0, lidH - 0.005, W, 0.04, 0.02, baseColor);
  const lid = shape(off, 0, lidW, lidH, 0.03, shadeColor(body, 0.25));
  const screen: ScreenRect = {
    x: off + bezel,
    y: bezel,
    width: lidW - bezel * 2,
    height: lidH - bezel * 2,
    radius: 0.008,
  };
  return {
    width: W,
    height: lidH - 0.005 + 0.04,
    shapes: [
      base,
      lid,
      shape(
        off + edge,
        edge,
        lidW - edge * 2,
        lidH - edge * 2,
        0.03 - edge,
        body,
      ),
      shape(
        screen.x,
        screen.y,
        screen.width,
        screen.height,
        screen.radius,
        '#000000',
      ),
    ],
    shadowShapes: [base, lid],
    screen,
    overlays: [
      circle(off + lidW / 2, bezel / 2, 0.004, shadeColor(body, 0.4)),
      shape(
        W / 2 - 0.09,
        lidH - 0.005,
        0.18,
        0.014,
        0.007,
        shadeColor(baseColor, -0.25),
      ),
    ],
  };
}

function buildBrowser(body: string): Layout {
  const W = 1;
  const bar = 0.07;
  const inner = 0.006;
  const screenH = 0.624;
  const H = bar + screenH + inner;
  const outer = shape(0, 0, W, H, 0.02, shadeColor(body, -0.15));
  const screen: ScreenRect = {
    x: inner,
    y: bar,
    width: W - inner * 2,
    height: screenH,
    radius: 0.012,
  };
  return {
    width: W,
    height: H,
    shapes: [
      outer,
      shape(0.003, 0.003, W - 0.006, H - 0.006, 0.017, body),
      shape(
        screen.x,
        screen.y,
        screen.width,
        screen.height,
        screen.radius,
        '#000000',
      ),
    ],
    shadowShapes: [outer],
    screen,
    overlays: [
      circle(0.03, bar / 2, 0.009, '#ff5f57'),
      circle(0.058, bar / 2, 0.009, '#febc2e'),
      circle(0.086, bar / 2, 0.009, '#28c840'),
      shape(0.14, bar / 2 - 0.017, 0.6, 0.034, 0.017, shadeColor(body, 0.12)),
    ],
  };
}

function buildDevice(device: DeviceType, body: string): Layout {
  switch (device) {
    case 'phone':
      return buildPhone(body);
    case 'tablet':
      return buildTablet(body);
    case 'laptop':
      return buildLaptop(body);
    case 'browser':
      return buildBrowser(body);
  }
}

/** x と y を入れ替える（縦長デバイスを横向きにする） */
function transposeShape(s: Shape): Shape {
  return { ...s, x: s.y, y: s.x, width: s.height, height: s.width };
}

function transposeLayout(l: Layout): Layout {
  return {
    width: l.height,
    height: l.width,
    shapes: l.shapes.map(transposeShape),
    shadowShapes: l.shadowShapes.map(transposeShape),
    screen: {
      x: l.screen.y,
      y: l.screen.x,
      width: l.screen.height,
      height: l.screen.width,
      radius: l.screen.radius,
    },
    overlays: l.overlays.map(transposeShape),
  };
}

function scaleShape(s: Shape, k: number, dx: number, dy: number): Shape {
  return {
    ...s,
    x: Math.round(s.x * k + dx),
    y: Math.round(s.y * k + dy),
    width: Math.max(1, Math.round(s.width * k)),
    height: Math.max(1, Math.round(s.height * k)),
    radius: Math.max(0, Math.round(s.radius * k)),
  };
}

/**
 * 画面(screen)に画像をはめ込む描画範囲を決める。
 * cover は画面いっぱいに中央で切り抜き、contain は全体を収めて余りを下地の色にする。
 */
export function fitImage(source: Size, screen: Rect, fit: FitMode): ImageDraw {
  const sw0 = Math.max(1, source.width);
  const sh0 = Math.max(1, source.height);
  const screenRatio = screen.width / screen.height;
  const srcRatio = sw0 / sh0;
  if (fit === 'cover') {
    let sw = sw0;
    let sh = sh0;
    if (srcRatio > screenRatio) sw = sh0 * screenRatio;
    else sh = sw0 / screenRatio;
    return {
      sx: (sw0 - sw) / 2,
      sy: (sh0 - sh) / 2,
      sw,
      sh,
      dx: screen.x,
      dy: screen.y,
      dw: screen.width,
      dh: screen.height,
    };
  }
  let dw = screen.width;
  let dh = screen.height;
  if (srcRatio > screenRatio) dh = screen.width / srcRatio;
  else dw = screen.height * srcRatio;
  return {
    sx: 0,
    sy: 0,
    sw: sw0,
    sh: sh0,
    dx: screen.x + (screen.width - dw) / 2,
    dy: screen.y + (screen.height - dh) / 2,
    dw,
    dh,
  };
}

/** 画像の大きさと設定から、出力サイズ・各部品の位置・画像の描画範囲を決める */
export function planMockup(source: Size, options: MockupOptions): MockupPlan {
  const body = parseHex(options.bodyColor) ? options.bodyColor : '#111827';
  let layout = buildDevice(options.device, body);
  if (options.landscape && supportsOrientation(options.device)) {
    layout = transposeLayout(layout);
  }
  const padUnits =
    (clampNumber(options.padding, 0, MAX_PADDING, 0) / 100) * layout.width;
  const totalW = layout.width + padUnits * 2;
  const totalH = layout.height + padUnits * 2;
  const outW = Math.round(
    clampNumber(
      options.outputWidth,
      MIN_OUTPUT_WIDTH,
      MAX_OUTPUT_WIDTH,
      DEFAULT_OUTPUT_WIDTH,
    ),
  );
  const k = outW / totalW;
  const off = padUnits * k;
  const canvas = { width: outW, height: Math.max(1, Math.round(totalH * k)) };

  const screenShape = scaleShape({ ...layout.screen, color: '' }, k, off, off);
  const screen: ScreenRect = {
    x: screenShape.x,
    y: screenShape.y,
    width: screenShape.width,
    height: screenShape.height,
    radius: screenShape.radius,
  };
  const bgColor = parseHex(options.backgroundColor)
    ? options.backgroundColor
    : '#ffffff';
  return {
    canvas,
    background: options.transparentBackground ? null : bgColor,
    shapes: layout.shapes.map((s) => scaleShape(s, k, off, off)),
    shadowShapes: options.shadow
      ? layout.shadowShapes.map((s) => scaleShape(s, k, off, off))
      : [],
    shadow: options.shadow
      ? {
          blur: Math.max(1, Math.round(layout.width * k * 0.05)),
          offsetY: Math.round(layout.width * k * 0.02),
          color: hexToRgba('#000000', 0.35),
        }
      : null,
    screen,
    image: fitImage(source, screen, options.fit),
    overlays: layout.overlays.map((s) => scaleShape(s, k, off, off)),
  };
}

/** ダウンロード用のファイル名。拡張子をpngにし、末尾に -mockup を付ける */
export function mockupFileName(sourceName: string | null): string {
  const base = (sourceName ?? '').replace(/\.[^./\\]*$/, '').trim();
  return `${base || 'screenshot'}-mockup.png`;
}
