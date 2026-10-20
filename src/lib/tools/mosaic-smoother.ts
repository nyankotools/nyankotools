import {
  clipRect,
  OUTPUT_FORMATS,
  type Dimensions,
  type OutputFormat,
  type Rect,
} from './image-blur-mosaic';

export {
  clientToImagePoint,
  formatFileSize,
  isAcceptedImageFile,
  MAX_FILE_SIZE,
  normalizeRect,
  OUTPUT_FORMATS,
  type Dimensions,
  type OutputFormat,
  type Point,
  type Rect,
} from './image-blur-mosaic';

/** 元ファイル名から "<名前>-smoothed.<拡張子>" を作る */
export function buildOutputFileName(
  originalName: string,
  format: OutputFormat,
): string {
  const dot = originalName.lastIndexOf('.');
  const base = dot > 0 ? originalName.slice(0, dot) : originalName;
  return `${base || 'image'}-smoothed.${OUTPUT_FORMATS[format].extension}`;
}

export interface SmoothOptions {
  /** モザイクのブロックサイズ(px)。null で自動検出 */
  blockSize: number | null;
  /** モザイク色の反映度 0〜100(0で周囲の色のみから補間) */
  influence: number;
  /** 粒状感 0〜100(周囲のノイズ量に対する割合%) */
  grain: number;
  /** 粒状ノイズの乱数シード(再描画しても同じ結果にする) */
  seed: number;
}

export interface Region {
  rect: Rect;
  options: SmoothOptions;
}

export interface BlockGrid {
  size: number;
  offsetX: number;
  offsetY: number;
}

export interface SmoothResult {
  /** 使ったブロック格子。検出できず使わなかった場合は null */
  grid: BlockGrid | null;
}

/** 読み込める画素数の上限(メモリ枯渇を避ける) */
export const MAX_PIXELS = 16_000_000;
export const MIN_BLOCK = 3;
export const MAX_BLOCK = 64;
export const DEFAULT_INFLUENCE = 40;
export const DEFAULT_GRAIN = 100;

const CH = 4;
const MAX_ITERATIONS = 40;
/** 最細レベルのセル数×反復回数の上限(巨大な範囲で固まらないようにする) */
const WORK_BUDGET = 24_000_000;
const SOR_OMEGA = 1.5;
const COARSEST = 12;
/** 軸ごとの「ブロック境界らしさ」の最小スコア。これ未満は検出失敗 */
const DETECT_MIN_SCORE = 5;

export function clampPercent(value: number, fallback: number): number {
  if (!Number.isFinite(value)) return fallback;
  return Math.min(100, Math.max(0, Math.round(value)));
}

export function clampBlockSize(value: number): number {
  if (!Number.isFinite(value)) return MIN_BLOCK;
  return Math.min(MAX_BLOCK, Math.max(MIN_BLOCK, Math.round(value)));
}

/** 反映度(0〜100)を画面方程式の重み λ に変換する */
export function influenceToLambda(influence: number): number {
  const t = clampPercent(influence, DEFAULT_INFLUENCE) / 100;
  return 0.5 * t * t * t;
}

/** 隣り合う画素の差の絶対値(RGB合計)の、境界位置ごとの合計を返す */
function diffProfile(
  data: Uint8ClampedArray,
  imageWidth: number,
  rect: Rect,
  axis: 'x' | 'y',
): Float64Array {
  const len = axis === 'x' ? rect.width : rect.height;
  const profile = new Float64Array(len);
  const cross = axis === 'x' ? rect.height : rect.width;
  for (let k = 1; k < len; k++) {
    let sum = 0;
    for (let c = 0; c < cross; c++) {
      const x = axis === 'x' ? rect.x + k : rect.x + c;
      const y = axis === 'x' ? rect.y + c : rect.y + k;
      const px = axis === 'x' ? x - 1 : x;
      const py = axis === 'x' ? y : y - 1;
      const i = (y * imageWidth + x) * 4;
      const j = (py * imageWidth + px) * 4;
      sum +=
        Math.abs(data[i] - data[j]) +
        Math.abs(data[i + 1] - data[j + 1]) +
        Math.abs(data[i + 2] - data[j + 2]);
    }
    profile[k] = sum;
  }
  return profile;
}

/** サイズ s の格子で、境界位置が最も目立つ位相とそのスコアを返す */
function bestPhase(
  profile: Float64Array,
  size: number,
  overallMean: number,
): { phase: number; score: number } {
  const eps = overallMean * 0.05;
  let best = { phase: 0, score: -1 };
  for (let phase = 0; phase < size; phase++) {
    let edgeSum = 0;
    let edgeCount = 0;
    let otherSum = 0;
    let otherCount = 0;
    for (let k = 1; k < profile.length; k++) {
      if (k % size === phase) {
        edgeSum += profile[k];
        edgeCount++;
      } else {
        otherSum += profile[k];
        otherCount++;
      }
    }
    if (edgeCount === 0 || otherCount === 0) continue;
    const score = edgeSum / edgeCount / (otherSum / otherCount + eps);
    if (score > best.score) best = { phase, score };
  }
  return best;
}

/**
 * 範囲内のモザイクのブロック格子(サイズと位相)を推定する。
 * fixedSize を渡すとサイズは固定して位相だけ推定する(失敗扱いにはしない)。
 * 検出できない場合は null。
 */
export function estimateBlockGrid(
  data: Uint8ClampedArray,
  imageWidth: number,
  rect: Rect,
  fixedSize?: number,
): BlockGrid | null {
  const minSide = Math.min(rect.width, rect.height);
  const profX = diffProfile(data, imageWidth, rect, 'x');
  const profY = diffProfile(data, imageWidth, rect, 'y');
  const meanOf = (p: Float64Array) =>
    p.length > 1 ? p.reduce((a, b) => a + b, 0) / (p.length - 1) : 0;
  const meanX = meanOf(profX);
  const meanY = meanOf(profY);
  if (meanX < 1e-6 && meanY < 1e-6) return null;

  const sizes =
    fixedSize !== undefined
      ? [fixedSize]
      : Array.from(
          {
            length: Math.max(
              0,
              Math.min(MAX_BLOCK, Math.floor(minSide / 2)) - MIN_BLOCK + 1,
            ),
          },
          (_, i) => MIN_BLOCK + i,
        );

  let best: (BlockGrid & { score: number }) | null = null;
  for (const size of sizes) {
    const px = bestPhase(profX, size, meanX);
    const py = bestPhase(profY, size, meanY);
    // 平坦で差が無い軸は評価から外す(もう一方の軸だけで判定する)
    const sx = meanX < 1e-6 ? null : px.score;
    const sy = meanY < 1e-6 ? null : py.score;
    if (fixedSize === undefined) {
      if (sx !== null && sx < DETECT_MIN_SCORE) continue;
      if (sy !== null && sy < DETECT_MIN_SCORE) continue;
    }
    const score = Math.sqrt((sx ?? sy ?? 1) * (sy ?? sx ?? 1));
    if (!best || score > best.score) {
      // プロファイルは範囲の左上基準なので、画像の絶対座標の位相に直す
      best = {
        size,
        offsetX: (rect.x + px.phase) % size,
        offsetY: (rect.y + py.phase) % size,
        score,
      };
    }
  }
  if (!best) return null;
  return { size: best.size, offsetX: best.offsetX, offsetY: best.offsetY };
}

/** ブロック平均色を中心点で双線形補間した、範囲内の目標色(RGBA float) */
function buildGuide(
  data: Uint8ClampedArray,
  imageWidth: number,
  rect: Rect,
  grid: BlockGrid,
): Float32Array {
  const { size, offsetX, offsetY } = grid;
  const bx0 = Math.floor((rect.x - offsetX) / size);
  const bx1 = Math.floor((rect.x + rect.width - 1 - offsetX) / size);
  const by0 = Math.floor((rect.y - offsetY) / size);
  const by1 = Math.floor((rect.y + rect.height - 1 - offsetY) / size);
  const nbx = bx1 - bx0 + 1;
  const nby = by1 - by0 + 1;
  const means = new Float32Array(nbx * nby * CH);
  for (let by = 0; by < nby; by++) {
    for (let bx = 0; bx < nbx; bx++) {
      const xs = Math.max(rect.x, offsetX + (bx0 + bx) * size);
      const xe = Math.min(rect.x + rect.width, offsetX + (bx0 + bx + 1) * size);
      const ys = Math.max(rect.y, offsetY + (by0 + by) * size);
      const ye = Math.min(
        rect.y + rect.height,
        offsetY + (by0 + by + 1) * size,
      );
      const sum = [0, 0, 0, 0];
      for (let y = ys; y < ye; y++) {
        for (let x = xs; x < xe; x++) {
          const i = (y * imageWidth + x) * 4;
          for (let c = 0; c < CH; c++) sum[c] += data[i + c];
        }
      }
      const n = (xe - xs) * (ye - ys);
      for (let c = 0; c < CH; c++) means[(by * nbx + bx) * CH + c] = sum[c] / n;
    }
  }

  const guide = new Float32Array(rect.width * rect.height * CH);
  const interp = (pos: number, origin: number, count: number) => {
    const f = (pos - origin) / size - 0.5;
    const i0 = Math.floor(f);
    const t = f - i0;
    return {
      a: Math.min(count - 1, Math.max(0, i0)),
      b: Math.min(count - 1, Math.max(0, i0 + 1)),
      t,
    };
  };
  for (let y = 0; y < rect.height; y++) {
    const fy = interp(rect.y + y + 0.5, offsetY + by0 * size, nby);
    for (let x = 0; x < rect.width; x++) {
      const fx = interp(rect.x + x + 0.5, offsetX + bx0 * size, nbx);
      const o = (y * rect.width + x) * CH;
      for (let c = 0; c < CH; c++) {
        const v00 = means[(fy.a * nbx + fx.a) * CH + c];
        const v10 = means[(fy.a * nbx + fx.b) * CH + c];
        const v01 = means[(fy.b * nbx + fx.a) * CH + c];
        const v11 = means[(fy.b * nbx + fx.b) * CH + c];
        const top = v00 + (v10 - v00) * fx.t;
        const bottom = v01 + (v11 - v01) * fx.t;
        guide[o + c] = top + (bottom - top) * fy.t;
      }
    }
  }
  return guide;
}

interface Level {
  w: number;
  h: number;
  guide: Float32Array;
  /** 範囲の外側1画素ぶんの境界値。範囲が画像端に接する辺は undefined(ノイマン条件) */
  top?: Float32Array;
  bottom?: Float32Array;
  left?: Float32Array;
  right?: Float32Array;
  lambda: number;
}

function ringFromImage(
  data: Uint8ClampedArray,
  imageWidth: number,
  rect: Rect,
  image: Dimensions,
): Pick<Level, 'top' | 'bottom' | 'left' | 'right'> {
  // 外側2画素までの平均(画像端で1画素になる場合はそれだけ)
  const sample = (
    cells: Array<[number, number]>,
    out: Float32Array,
    index: number,
  ) => {
    let n = 0;
    const sum = [0, 0, 0, 0];
    for (const [x, y] of cells) {
      if (x < 0 || y < 0 || x >= image.width || y >= image.height) continue;
      const i = (y * imageWidth + x) * 4;
      for (let c = 0; c < CH; c++) sum[c] += data[i + c];
      n++;
    }
    for (let c = 0; c < CH; c++) out[index * CH + c] = sum[c] / n;
  };
  const result: Pick<Level, 'top' | 'bottom' | 'left' | 'right'> = {};
  const { x, y, width, height } = rect;
  if (y > 0) {
    result.top = new Float32Array(width * CH);
    for (let k = 0; k < width; k++)
      sample(
        [
          [x + k, y - 1],
          [x + k, y - 2],
        ],
        result.top,
        k,
      );
  }
  if (y + height < image.height) {
    result.bottom = new Float32Array(width * CH);
    for (let k = 0; k < width; k++)
      sample(
        [
          [x + k, y + height],
          [x + k, y + height + 1],
        ],
        result.bottom,
        k,
      );
  }
  if (x > 0) {
    result.left = new Float32Array(height * CH);
    for (let k = 0; k < height; k++)
      sample(
        [
          [x - 1, y + k],
          [x - 2, y + k],
        ],
        result.left,
        k,
      );
  }
  if (x + width < image.width) {
    result.right = new Float32Array(height * CH);
    for (let k = 0; k < height; k++)
      sample(
        [
          [x + width, y + k],
          [x + width + 1, y + k],
        ],
        result.right,
        k,
      );
  }
  return result;
}

function halveRing(
  ring: Float32Array | undefined,
  length: number,
): Float32Array | undefined {
  if (!ring) return undefined;
  const half = Math.ceil(length / 2);
  const out = new Float32Array(half * CH);
  for (let k = 0; k < half; k++) {
    const a = 2 * k;
    const b = Math.min(length - 1, 2 * k + 1);
    for (let c = 0; c < CH; c++)
      out[k * CH + c] = (ring[a * CH + c] + ring[b * CH + c]) / 2;
  }
  return out;
}

function halveLevel(level: Level): Level {
  const w = Math.ceil(level.w / 2);
  const h = Math.ceil(level.h / 2);
  const guide = new Float32Array(w * h * CH);
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const x1 = Math.min(level.w - 1, 2 * x + 1);
      const y1 = Math.min(level.h - 1, 2 * y + 1);
      for (let c = 0; c < CH; c++) {
        guide[(y * w + x) * CH + c] =
          (level.guide[(2 * y * level.w + 2 * x) * CH + c] +
            level.guide[(2 * y * level.w + x1) * CH + c] +
            level.guide[(y1 * level.w + 2 * x) * CH + c] +
            level.guide[(y1 * level.w + x1) * CH + c]) /
          4;
      }
    }
  }
  return {
    w,
    h,
    guide,
    top: halveRing(level.top, level.w),
    bottom: halveRing(level.bottom, level.w),
    left: halveRing(level.left, level.h),
    right: halveRing(level.right, level.h),
    lambda: level.lambda * 4,
  };
}

/** 粗い格子の解を細かい格子へ双線形補間で引き継ぐ */
function prolong(
  coarse: Float32Array,
  cw: number,
  ch: number,
  w: number,
  h: number,
) {
  const out = new Float32Array(w * h * CH);
  for (let y = 0; y < h; y++) {
    const fy = (y + 0.5) / 2 - 0.5;
    const y0 = Math.floor(fy);
    const ty = fy - y0;
    const ya = Math.min(ch - 1, Math.max(0, y0));
    const yb = Math.min(ch - 1, Math.max(0, y0 + 1));
    for (let x = 0; x < w; x++) {
      const fx = (x + 0.5) / 2 - 0.5;
      const x0 = Math.floor(fx);
      const tx = fx - x0;
      const xa = Math.min(cw - 1, Math.max(0, x0));
      const xb = Math.min(cw - 1, Math.max(0, x0 + 1));
      for (let c = 0; c < CH; c++) {
        const v00 = coarse[(ya * cw + xa) * CH + c];
        const v10 = coarse[(ya * cw + xb) * CH + c];
        const v01 = coarse[(yb * cw + xa) * CH + c];
        const v11 = coarse[(yb * cw + xb) * CH + c];
        const top = v00 + (v10 - v00) * tx;
        const bottom = v01 + (v11 - v01) * tx;
        out[(y * w + x) * CH + c] = top + (bottom - top) * ty;
      }
    }
  }
  return out;
}

/** 境界値と目標色から、画面ポアソン方程式を SOR 法で解く */
function relax(level: Level, u: Float32Array, iterations: number): void {
  const { w, h, guide, lambda } = level;
  for (let iter = 0; iter < iterations; iter++) {
    let maxDelta = 0;
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        const o = (y * w + x) * CH;
        for (let c = 0; c < CH; c++) {
          let sum = 0;
          let n = 0;
          if (y > 0) {
            sum += u[o - w * CH + c];
            n++;
          } else if (level.top) {
            sum += level.top[x * CH + c];
            n++;
          }
          if (y < h - 1) {
            sum += u[o + w * CH + c];
            n++;
          } else if (level.bottom) {
            sum += level.bottom[x * CH + c];
            n++;
          }
          if (x > 0) {
            sum += u[o - CH + c];
            n++;
          } else if (level.left) {
            sum += level.left[y * CH + c];
            n++;
          }
          if (x < w - 1) {
            sum += u[o + CH + c];
            n++;
          } else if (level.right) {
            sum += level.right[y * CH + c];
            n++;
          }
          const denom = n + lambda;
          if (denom === 0) continue;
          const target = (sum + lambda * guide[o + c]) / denom;
          const delta = (target - u[o + c]) * SOR_OMEGA;
          u[o + c] += delta;
          const abs = Math.abs(delta);
          if (abs > maxDelta) maxDelta = abs;
        }
      }
    }
    if (maxDelta < 0.02) break;
  }
}

function initialValue(level: Level): Float32Array {
  const u = new Float32Array(level.w * level.h * CH);
  const sum = [0, 0, 0, 0];
  let n = 0;
  for (const ring of [level.top, level.bottom, level.left, level.right]) {
    if (!ring) continue;
    for (let k = 0; k < ring.length; k += CH) {
      for (let c = 0; c < CH; c++) sum[c] += ring[k + c];
      n++;
    }
  }
  for (let i = 0; i < u.length; i += CH) {
    for (let c = 0; c < CH; c++)
      u[i + c] = n > 0 ? sum[c] / n : level.guide[i + c];
  }
  return u;
}

/** 粗い格子から順に解いて細かい格子へ引き継ぐ(カスケード型マルチグリッド) */
function solve(fine: Level): Float32Array {
  const levels = [fine];
  while (
    Math.max(levels[levels.length - 1].w, levels[levels.length - 1].h) >
    COARSEST
  ) {
    levels.push(halveLevel(levels[levels.length - 1]));
  }
  let u = initialValue(levels[levels.length - 1]);
  for (let i = levels.length - 1; i >= 0; i--) {
    const level = levels[i];
    if (i < levels.length - 1) {
      const coarse = levels[i + 1];
      u = prolong(u, coarse.w, coarse.h, level.w, level.h);
    }
    const iterations = Math.max(
      4,
      Math.min(MAX_ITERATIONS, Math.floor(WORK_BUDGET / (level.w * level.h))),
    );
    relax(level, u, iterations);
  }
  return u;
}

/**
 * 範囲の外側(範囲の縁から3〜8画素目)から、ノイズの標準偏差(輝度)を推定する。
 * 模様やエッジに引きずられないよう、ラプラシアン残差の絶対値の中央値(MAD)を使う。
 */
export function estimateNoiseSigma(
  data: Uint8ClampedArray,
  image: Dimensions,
  rect: Rect,
): number {
  const x0 = Math.max(1, rect.x - 8);
  const y0 = Math.max(1, rect.y - 8);
  const x1 = Math.min(image.width - 1, rect.x + rect.width + 8);
  const y1 = Math.min(image.height - 1, rect.y + rect.height + 8);
  const luma = (x: number, y: number) => {
    const i = (y * image.width + x) * 4;
    return 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
  };
  const BIN = 4;
  const hist = new Uint32Array(256 * BIN + 1);
  let n = 0;
  for (let y = y0; y < y1; y++) {
    for (let x = x0; x < x1; x++) {
      // 範囲の内側と、その隣(近傍が範囲に触れる画素)は除く
      const dx = Math.max(rect.x - 1 - x, x - (rect.x + rect.width), 0);
      const dy = Math.max(rect.y - 1 - y, y - (rect.y + rect.height), 0);
      if (dx < 1 && dy < 1) continue;
      if (Math.max(dx, dy) < 2) continue;
      const lap =
        luma(x, y) -
        (luma(x - 1, y) + luma(x + 1, y) + luma(x, y - 1) + luma(x, y + 1)) / 4;
      hist[Math.min(256 * BIN, Math.round(Math.abs(lap) * BIN))]++;
      n++;
    }
  }
  if (n === 0) return 0;
  let acc = 0;
  let median = 0;
  for (let b = 0; b < hist.length; b++) {
    acc += hist[b];
    if (acc >= n / 2) {
      median = b / BIN;
      break;
    }
  }
  // 残差の標準偏差 = σ√(1 + 1/4)。正規分布なら MAD = 0.6745 × 標準偏差
  return median / 0.6745 / Math.sqrt(1.25);
}

function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function gaussian(random: () => number): number {
  const u = Math.max(random(), 1e-12);
  const v = random();
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
}

/**
 * 矩形内のモザイクを、周囲の色とモザイクの色から作った滑らかな色面に置き換える。
 * data を直接書き換える。
 */
export function applyMosaicSmooth(
  data: Uint8ClampedArray,
  image: Dimensions,
  rectInput: Rect,
  options: SmoothOptions,
): SmoothResult {
  const rect = clipRect(rectInput, image);
  if (!rect) return { grid: null };

  const lambdaBase = influenceToLambda(options.influence);
  const grid =
    options.blockSize === null
      ? estimateBlockGrid(data, image.width, rect)
      : estimateBlockGrid(
          data,
          image.width,
          rect,
          clampBlockSize(options.blockSize),
        );
  const useGuide = grid !== null && lambdaBase > 0;

  const ring = ringFromImage(data, image.width, rect, image);
  // 四辺とも画像端に接すると境界値が無く、解が一意に決まらない。範囲の平均色を弱い目標にする
  const noRing = !ring.top && !ring.bottom && !ring.left && !ring.right;
  let guide: Float32Array;
  let lambda = useGuide ? lambdaBase : 0;
  if (useGuide) {
    guide = buildGuide(data, image.width, rect, grid);
  } else {
    guide = new Float32Array(rect.width * rect.height * CH);
    if (noRing) {
      const mean = [0, 0, 0, 0];
      for (let y = 0; y < rect.height; y++) {
        for (let x = 0; x < rect.width; x++) {
          const i = ((rect.y + y) * image.width + rect.x + x) * 4;
          for (let c = 0; c < CH; c++) mean[c] += data[i + c];
        }
      }
      const n = rect.width * rect.height;
      for (let i = 0; i < guide.length; i += CH)
        for (let c = 0; c < CH; c++) guide[i + c] = mean[c] / n;
    }
  }
  if (noRing && lambda === 0) lambda = 0.05;
  const level: Level = {
    w: rect.width,
    h: rect.height,
    guide,
    ...ring,
    lambda,
  };
  const u = solve(level);

  const grain = clampPercent(options.grain, DEFAULT_GRAIN) / 100;
  const sigma = grain > 0 ? estimateNoiseSigma(data, image, rect) * grain : 0;
  const random = mulberry32(options.seed);

  for (let y = 0; y < rect.height; y++) {
    for (let x = 0; x < rect.width; x++) {
      const o = (y * rect.width + x) * CH;
      const i = ((rect.y + y) * image.width + rect.x + x) * 4;
      const noise = sigma > 0 ? gaussian(random) * sigma : 0;
      data[i] = Math.round(u[o] + noise);
      data[i + 1] = Math.round(u[o + 1] + noise);
      data[i + 2] = Math.round(u[o + 2] + noise);
      data[i + 3] = Math.round(u[o + 3]);
    }
  }
  return { grid };
}

/** 複数領域を順に適用する */
export function applyRegions(
  data: Uint8ClampedArray,
  image: Dimensions,
  regions: Region[],
): void {
  for (const region of regions)
    applyMosaicSmooth(data, image, region.rect, region.options);
}
