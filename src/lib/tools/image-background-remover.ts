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

export interface Point {
  x: number;
  y: number;
}

export type FillMode = 'global' | 'contiguous';

/** スポイトで指定した1回分の背景。複数回の指定は、それぞれの透過範囲を合わせたものになる */
export interface BackgroundPick {
  /** 透過させる背景色 */
  background: Rgb;
  /** contiguous のときの起点。背景色と合わなければ画像の外周から始める */
  seed: Point | null;
}

export interface RemoveOptions {
  /** 背景の指定。1件以上（空なら何も透過しない） */
  picks: BackgroundPick[];
  /** 許容値 0〜100。背景色からの色の距離がこの割合以内なら背景とみなす */
  tolerance: number;
  /** global: 画像全体の同色を透過 / contiguous: スポイト位置からつながる領域だけを透過 */
  mode: FillMode;
  /** 縁を内側に削る太さ（px）。縁に残る背景色の混ざったピクセルを消す */
  erode: number;
  /** 縁の色を内側の色で置き換える範囲（px）。背景色の滲みを取る */
  defringe: number;
  /** 輪郭の太さ（px）。0 で輪郭なし */
  outlineWidth: number;
  outlineColor: Rgb;
}

/** 処理できる画像の総画素数の上限。距離変換のメモリ使用量を抑える */
export const MAX_PIXELS = 16_000_000;
export const MAX_ERODE = 10;
export const MAX_DEFRINGE = 5;
export const MAX_OUTLINE = 50;

/** RGB空間での最大距離（黒と白の距離） */
const MAX_COLOR_DISTANCE = Math.sqrt(3 * 255 * 255);
/** もともと透明に近いピクセルは背景として扱う */
const TRANSPARENT_ALPHA = 8;
const FAR = 1e9;

export function isWithinPixelLimit(width: number, height: number): boolean {
  return width * height <= MAX_PIXELS;
}

export function colorDistance(a: Rgb, b: Rgb): number {
  return Math.sqrt((a.r - b.r) ** 2 + (a.g - b.g) ** 2 + (a.b - b.b) ** 2);
}

export function hexToRgb(hex: string): Rgb | null {
  const m = /^#?([0-9a-f]{6})$/i.exec(hex.trim());
  if (!m) return null;
  const n = parseInt(m[1], 16);
  return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
}

export function rgbToHex({ r, g, b }: Rgb): string {
  return `#${[r, g, b].map((v) => v.toString(16).padStart(2, '0')).join('')}`;
}

/** 座標のピクセル色を返す。範囲外は null */
export function pixelAt(img: RgbaImage, x: number, y: number): Rgb | null {
  if (x < 0 || y < 0 || x >= img.width || y >= img.height) return null;
  const i = (y * img.width + x) * 4;
  return { r: img.data[i], g: img.data[i + 1], b: img.data[i + 2] };
}

function clampInt(value: number, min: number, max: number): number {
  const n = Number.isFinite(value) ? Math.round(value) : min;
  return Math.min(Math.max(n, min), max);
}

/** 背景と判定したピクセルを 1、それ以外を 0 とするマスクを返す */
export function backgroundMask(
  img: RgbaImage,
  background: Rgb,
  tolerance: number,
  mode: FillMode,
  seed: Point | null,
): Uint8Array {
  const { data, width, height } = img;
  const limit =
    (Math.min(Math.max(tolerance, 0), 100) / 100) * MAX_COLOR_DISTANCE;
  const matches = (p: number) => {
    const i = p * 4;
    if (data[i + 3] < TRANSPARENT_ALPHA) return true;
    return (
      Math.sqrt(
        (data[i] - background.r) ** 2 +
          (data[i + 1] - background.g) ** 2 +
          (data[i + 2] - background.b) ** 2,
      ) <= limit
    );
  };

  const mask = new Uint8Array(width * height);
  if (mode === 'global') {
    for (let p = 0; p < mask.length; p++) mask[p] = matches(p) ? 1 : 0;
    return mask;
  }

  const stack = new Int32Array(width * height);
  let top = 0;
  const push = (p: number) => {
    if (mask[p] === 0 && matches(p)) {
      mask[p] = 1;
      stack[top++] = p;
    }
  };
  const seedOk =
    seed !== null &&
    seed.x >= 0 &&
    seed.y >= 0 &&
    seed.x < width &&
    seed.y < height &&
    matches(seed.y * width + seed.x);
  if (seedOk) {
    push(seed.y * width + seed.x);
  } else {
    for (let x = 0; x < width; x++) {
      push(x);
      push((height - 1) * width + x);
    }
    for (let y = 0; y < height; y++) {
      push(y * width);
      push(y * width + width - 1);
    }
  }
  while (top > 0) {
    const p = stack[--top];
    const x = p % width;
    if (x > 0) push(p - 1);
    if (x < width - 1) push(p + 1);
    if (p >= width) push(p - width);
    if (p < width * (height - 1)) push(p + width);
  }
  return mask;
}

/**
 * target が 1 のピクセルまでの距離（px）を各ピクセルについて求める（3-4チャンファー距離）。
 * target のピクセル自身は 0、target が1つも無いときは非常に大きな値になる。
 */
export function distanceTransform(
  target: Uint8Array,
  width: number,
  height: number,
): Float32Array {
  const dist = new Float32Array(width * height);
  for (let p = 0; p < dist.length; p++) dist[p] = target[p] ? 0 : FAR;
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const p = y * width + x;
      let d = dist[p];
      if (x > 0) d = Math.min(d, dist[p - 1] + 3);
      if (y > 0) {
        d = Math.min(d, dist[p - width] + 3);
        if (x > 0) d = Math.min(d, dist[p - width - 1] + 4);
        if (x < width - 1) d = Math.min(d, dist[p - width + 1] + 4);
      }
      dist[p] = d;
    }
  }
  for (let y = height - 1; y >= 0; y--) {
    for (let x = width - 1; x >= 0; x--) {
      const p = y * width + x;
      let d = dist[p];
      if (x < width - 1) d = Math.min(d, dist[p + 1] + 3);
      if (y < height - 1) {
        d = Math.min(d, dist[p + width] + 3);
        if (x < width - 1) d = Math.min(d, dist[p + width + 1] + 4);
        if (x > 0) d = Math.min(d, dist[p + width - 1] + 4);
      }
      dist[p] = d;
    }
  }
  for (let p = 0; p < dist.length; p++) {
    dist[p] = dist[p] >= FAR ? FAR : dist[p] / 3;
  }
  return dist;
}

/** 前景（マスクが0）のうち、背景から amount px 以内のものを背景に変える */
export function erodeMask(
  mask: Uint8Array,
  width: number,
  height: number,
  amount: number,
): Uint8Array {
  if (amount <= 0) return mask;
  const dist = distanceTransform(mask, width, height);
  const out = new Uint8Array(mask.length);
  // 距離は軸方向が1、斜めが4/3。ちょうど amount の位置にあるものは削る側に含める
  for (let p = 0; p < out.length; p++)
    out[p] = dist[p] <= amount + 0.01 ? 1 : 0;
  return out;
}

function invertMask(mask: Uint8Array): Uint8Array {
  const out = new Uint8Array(mask.length);
  for (let p = 0; p < mask.length; p++) out[p] = 1 - mask[p];
  return out;
}

/** マスクの周囲に pad px の背景を足した、新しいマスクを返す */
function padMask(
  mask: Uint8Array,
  width: number,
  height: number,
  pad: number,
): Uint8Array {
  if (pad === 0) return mask;
  const w = width + pad * 2;
  const out = new Uint8Array(w * (height + pad * 2)).fill(1);
  for (let y = 0; y < height; y++) {
    out.set(mask.subarray(y * width, (y + 1) * width), (y + pad) * w + pad);
  }
  return out;
}

function padRgba(img: RgbaImage, pad: number): RgbaImage {
  if (pad === 0) return { ...img, data: new Uint8ClampedArray(img.data) };
  const width = img.width + pad * 2;
  const height = img.height + pad * 2;
  const data = new Uint8ClampedArray(width * height * 4);
  for (let y = 0; y < img.height; y++) {
    data.set(
      img.data.subarray(y * img.width * 4, (y + 1) * img.width * 4),
      ((y + pad) * width + pad) * 4,
    );
  }
  return { data, width, height };
}

/**
 * 背景に接する前景ピクセル（背景から range px 以内）の色を、内側の色で置き換える。
 * 外側の層から順に、すでに確定した周囲8近傍の色の平均を取ることで、背景色の滲みを内側へ追い込む。
 */
export function defringe(
  img: RgbaImage,
  mask: Uint8Array,
  range: number,
): void {
  if (range <= 0) return;
  const { data, width, height } = img;
  const dist = distanceTransform(mask, width, height);
  const layers: number[][] = Array.from({ length: range }, () => []);
  for (let p = 0; p < mask.length; p++) {
    if (mask[p] === 0 && dist[p] <= range + 0.01) {
      layers[Math.min(range, Math.max(1, Math.ceil(dist[p] - 0.01))) - 1].push(
        p,
      );
    }
  }
  const settled = new Uint8Array(mask.length);
  for (let p = 0; p < mask.length; p++) {
    if (mask[p] === 0 && dist[p] > range + 0.01) settled[p] = 1;
  }
  // 内側（距離の大きい層）から順に確定させる
  for (let layer = range - 1; layer >= 0; layer--) {
    const updates: [number, number, number, number][] = [];
    for (const p of layers[layer]) {
      const x = p % width;
      const y = (p - x) / width;
      let r = 0;
      let g = 0;
      let b = 0;
      let n = 0;
      for (let dy = -1; dy <= 1; dy++) {
        for (let dx = -1; dx <= 1; dx++) {
          if (dx === 0 && dy === 0) continue;
          const nx = x + dx;
          const ny = y + dy;
          if (nx < 0 || ny < 0 || nx >= width || ny >= height) continue;
          const q = ny * width + nx;
          if (!settled[q]) continue;
          r += data[q * 4];
          g += data[q * 4 + 1];
          b += data[q * 4 + 2];
          n++;
        }
      }
      if (n > 0) updates.push([p, r / n, g / n, b / n]);
    }
    for (const [p, r, g, b] of updates) {
      data[p * 4] = r;
      data[p * 4 + 1] = g;
      data[p * 4 + 2] = b;
    }
    for (const p of layers[layer]) settled[p] = 1;
  }
}

export interface RemoveResult extends RgbaImage {
  /** 元画像の四辺に足した余白（輪郭がはみ出さないよう、輪郭の太さと同じ） */
  padding: number;
}

/** 背景を透過し、必要なら縁の処理と輪郭付けを行った画像を返す。入力は変更しない */
export function removeBackground(
  img: RgbaImage,
  options: RemoveOptions,
): RemoveResult {
  const erode = clampInt(options.erode, 0, MAX_ERODE);
  const fringe = clampInt(options.defringe, 0, MAX_DEFRINGE);
  const outline = clampInt(options.outlineWidth, 0, MAX_OUTLINE);

  let mask: Uint8Array = new Uint8Array(img.width * img.height);
  for (const { background, seed } of options.picks) {
    const m = backgroundMask(
      img,
      background,
      options.tolerance,
      options.mode,
      seed,
    );
    for (let p = 0; p < mask.length; p++) mask[p] |= m[p];
  }
  mask = erodeMask(mask, img.width, img.height, erode);

  const out = padRgba(img, outline);
  mask = padMask(mask, img.width, img.height, outline);
  defringe(out, mask, fringe);

  const { data, width, height } = out;
  const outlineDist =
    outline > 0 ? distanceTransform(invertMask(mask), width, height) : null;
  const { r, g, b } = options.outlineColor;
  for (let p = 0; p < mask.length; p++) {
    const i = p * 4;
    if (mask[p] === 0) continue;
    data[i] = 0;
    data[i + 1] = 0;
    data[i + 2] = 0;
    data[i + 3] = 0;
    if (outlineDist) {
      // 1px未満の端数は縁の半透明で表し、輪郭をなめらかにする
      const cover = Math.min(Math.max(outline + 0.5 - outlineDist[p], 0), 1);
      if (cover > 0) {
        data[i] = r;
        data[i + 1] = g;
        data[i + 2] = b;
        data[i + 3] = Math.round(cover * 255);
      }
    }
  }
  return { data, width, height, padding: outline };
}

/** ダウンロード用のファイル名。元のファイル名の拡張子を .png に置き換え、末尾に -transparent を付ける */
export function transparentFileName(sourceName: string | null): string {
  const base = (sourceName ?? '').replace(/\.[^./\\]*$/, '').trim();
  return `${base || 'image'}-transparent.png`;
}
