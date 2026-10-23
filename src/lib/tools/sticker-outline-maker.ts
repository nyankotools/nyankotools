export interface RgbaImage {
  data: Uint8ClampedArray;
  width: number;
  height: number;
}

export interface Rgb {
  r: number;
  g: number;
  b: number;
}

export interface StickerOptions {
  /** 内側の縁取りの太さ(px)。0で縁取りなし */
  width: number;
  color: Rgb;
  /** 外側にもう一重付ける縁取りの太さ(px)。0で二重縁なし */
  outerWidth: number;
  outerColor: Rgb;
  /** 輪郭に囲まれた内側の透明部分を縁取りの色で埋める */
  fillHoles: boolean;
  /** 影の濃さ(0-100)。0で影なし */
  shadowOpacity: number;
  shadowOffsetX: number;
  shadowOffsetY: number;
  shadowColor: Rgb;
  /** この値以上のアルファを「図形の一部」とみなす(1-255) */
  alphaThreshold: number;
}

export interface StickerResult extends RgbaImage {
  /** 元画像の左上が出力のどの位置に来るか */
  offsetX: number;
  offsetY: number;
}

export const MAX_OUTLINE = 100;
export const MAX_SHADOW_OFFSET = 50;
/** 読み込み時にこの長辺を超える画像は縮小する */
export const MAX_SIDE = 2000;

export const DEFAULT_OPTIONS: StickerOptions = {
  width: 12,
  color: { r: 255, g: 255, b: 255 },
  outerWidth: 0,
  outerColor: { r: 0, g: 0, b: 0 },
  fillHoles: false,
  shadowOpacity: 0,
  shadowOffsetX: 4,
  shadowOffsetY: 4,
  shadowColor: { r: 0, g: 0, b: 0 },
  alphaThreshold: 16,
};

function clamp(v: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, v));
}

function clampInt(v: number, min: number, max: number): number {
  return Math.round(clamp(Number.isFinite(v) ? v : 0, min, max));
}

export function hexToRgb(hex: string): Rgb | null {
  const m = /^#?([0-9a-fA-F]{6})$/.exec(hex.trim());
  if (!m) return null;
  const n = parseInt(m[1], 16);
  return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
}

export function rgbToHex({ r, g, b }: Rgb): string {
  return `#${[r, g, b].map((v) => clampInt(v, 0, 255).toString(16).padStart(2, '0')).join('')}`;
}

/** 長辺が maxSide を超えるときだけ、縦横比を保って縮小したサイズを返す */
export function fitWithin(
  width: number,
  height: number,
  maxSide: number = MAX_SIDE,
): { width: number; height: number; scaled: boolean } {
  const longest = Math.max(width, height);
  if (longest <= maxSide) return { width, height, scaled: false };
  const ratio = maxSide / longest;
  return {
    width: Math.max(1, Math.round(width * ratio)),
    height: Math.max(1, Math.round(height * ratio)),
    scaled: true,
  };
}

/** 画像の端から到達できない「透明の穴」を埋めたマスクを返す(4近傍) */
export function fillHolesMask(
  mask: Uint8Array,
  width: number,
  height: number,
): Uint8Array {
  const outside = new Uint8Array(width * height);
  const stack = new Int32Array(width * height);
  let sp = 0;
  const push = (x: number, y: number) => {
    const i = y * width + x;
    if (mask[i] || outside[i]) return;
    outside[i] = 1;
    stack[sp++] = i;
  };
  for (let x = 0; x < width; x++) {
    push(x, 0);
    push(x, height - 1);
  }
  for (let y = 0; y < height; y++) {
    push(0, y);
    push(width - 1, y);
  }
  while (sp > 0) {
    const i = stack[--sp];
    const x = i % width;
    const y = (i - x) / width;
    if (x > 0) push(x - 1, y);
    if (x < width - 1) push(x + 1, y);
    if (y > 0) push(x, y - 1);
    if (y < height - 1) push(x, y + 1);
  }
  const filled = new Uint8Array(width * height);
  for (let i = 0; i < filled.length; i++) filled[i] = outside[i] ? 0 : 1;
  return filled;
}

const INF = 1e20;

function edt1d(
  f: Float64Array,
  n: number,
  d: Float64Array,
  v: Int32Array,
  z: Float64Array,
): void {
  let k = 0;
  v[0] = 0;
  z[0] = -INF;
  z[1] = INF;
  for (let q = 1; q < n; q++) {
    let s = (f[q] + q * q - (f[v[k]] + v[k] * v[k])) / (2 * q - 2 * v[k]);
    while (s <= z[k]) {
      k--;
      s = (f[q] + q * q - (f[v[k]] + v[k] * v[k])) / (2 * q - 2 * v[k]);
    }
    k++;
    v[k] = q;
    z[k] = s;
    z[k + 1] = INF;
  }
  k = 0;
  for (let q = 0; q < n; q++) {
    while (z[k + 1] < q) k++;
    d[q] = (q - v[k]) * (q - v[k]) + f[v[k]];
  }
}

/**
 * 各画素から最も近い mask=1 の画素までの距離の2乗(ユークリッド)を返す。
 * mask が全て0のときは非常に大きな値になる。
 */
export function squaredDistanceTransform(
  mask: Uint8Array,
  width: number,
  height: number,
): Float32Array {
  const size = Math.max(width, height);
  const grid = new Float32Array(width * height);
  for (let i = 0; i < grid.length; i++) grid[i] = mask[i] ? 0 : INF;
  const f = new Float64Array(size);
  const d = new Float64Array(size);
  const v = new Int32Array(size);
  const z = new Float64Array(size + 1);
  for (let x = 0; x < width; x++) {
    for (let y = 0; y < height; y++) f[y] = grid[y * width + x];
    edt1d(f, height, d, v, z);
    for (let y = 0; y < height; y++) grid[y * width + x] = d[y];
  }
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) f[x] = grid[y * width + x];
    edt1d(f, width, d, v, z);
    for (let x = 0; x < width; x++) grid[y * width + x] = d[x];
  }
  return grid;
}

/** 半径 r の円形カーネルによる膨張の被覆率(0-1)。縁は1px弱でなめらかにする */
function coverage(distSq: number, r: number): number {
  if (distSq <= 0) return 1;
  if (r <= 0) return 0;
  return clamp(r + 0.5 - Math.sqrt(distSq), 0, 1);
}

export function makeSticker(
  img: RgbaImage,
  options: Partial<StickerOptions> = {},
): StickerResult {
  const o = { ...DEFAULT_OPTIONS, ...options };
  const w1 = clampInt(o.width, 0, MAX_OUTLINE);
  const w2 = clampInt(o.outerWidth, 0, MAX_OUTLINE);
  const opacity = clampInt(o.shadowOpacity, 0, 100) / 100;
  const sx = clampInt(o.shadowOffsetX, -MAX_SHADOW_OFFSET, MAX_SHADOW_OFFSET);
  const sy = clampInt(o.shadowOffsetY, -MAX_SHADOW_OFFSET, MAX_SHADOW_OFFSET);
  const threshold = clampInt(o.alphaThreshold, 1, 255);
  const ring = w1 + w2;
  const shadowPad = opacity > 0 ? Math.max(Math.abs(sx), Math.abs(sy)) : 0;
  const pad = ring + shadowPad;
  const outW = img.width + pad * 2;
  const outH = img.height + pad * 2;

  const mask = new Uint8Array(outW * outH);
  for (let y = 0; y < img.height; y++) {
    for (let x = 0; x < img.width; x++) {
      if (img.data[(y * img.width + x) * 4 + 3] >= threshold) {
        mask[(y + pad) * outW + x + pad] = 1;
      }
    }
  }
  const shape = o.fillHoles ? fillHolesMask(mask, outW, outH) : mask;
  const drawRing = ring > 0 || o.fillHoles;
  const dist = drawRing
    ? squaredDistanceTransform(shape, outW, outH)
    : new Float32Array(0);

  const out = new Uint8ClampedArray(outW * outH * 4);
  // 非乗算の "over" 合成。dst は out の 1 画素
  const over = (i: number, c: Rgb, a: number) => {
    if (a <= 0) return;
    const da = out[i + 3] / 255;
    const oa = a + da * (1 - a);
    const k = (da * (1 - a)) / oa;
    out[i] = (c.r * a) / oa + out[i] * k;
    out[i + 1] = (c.g * a) / oa + out[i + 1] * k;
    out[i + 2] = (c.b * a) / oa + out[i + 2] * k;
    out[i + 3] = oa * 255;
  };

  // 影・外側の縁取り・内側の縁取り・元画像の順に重ねる
  for (let y = 0; y < outH; y++) {
    for (let x = 0; x < outW; x++) {
      const p = y * outW + x;
      const i = p * 4;
      if (opacity > 0 && drawRing) {
        const qx = x - sx;
        const qy = y - sy;
        if (qx >= 0 && qx < outW && qy >= 0 && qy < outH) {
          over(
            i,
            o.shadowColor,
            coverage(dist[qy * outW + qx], ring) * opacity,
          );
        }
      } else if (opacity > 0) {
        const qx = x - sx - pad;
        const qy = y - sy - pad;
        if (qx >= 0 && qx < img.width && qy >= 0 && qy < img.height) {
          const a = img.data[(qy * img.width + qx) * 4 + 3] / 255;
          over(i, o.shadowColor, a * opacity);
        }
      }
      if (drawRing) {
        const dsq = dist[p];
        if (w2 > 0) over(i, o.outerColor, coverage(dsq, ring));
        if (w1 > 0 || (o.fillHoles && shape[p])) {
          over(i, o.color, coverage(dsq, w1));
        }
      }
    }
  }
  // 元画像を上に重ねる
  for (let y = 0; y < img.height; y++) {
    for (let x = 0; x < img.width; x++) {
      const s = (y * img.width + x) * 4;
      const a = img.data[s + 3] / 255;
      if (a <= 0) continue;
      const i = ((y + pad) * outW + x + pad) * 4;
      over(i, { r: img.data[s], g: img.data[s + 1], b: img.data[s + 2] }, a);
    }
  }
  return { data: out, width: outW, height: outH, offsetX: pad, offsetY: pad };
}

export function stickerFileName(sourceName: string | null): string {
  const base = (sourceName ?? '').replace(/\.[^./\\]*$/, '').trim();
  return `${base || 'image'}-sticker.png`;
}
