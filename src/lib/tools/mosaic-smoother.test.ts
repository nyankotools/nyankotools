import { describe, expect, it } from 'vitest';
import { applyMosaic } from './image-blur-mosaic';
import {
  applyMosaicSmooth,
  applyRegions,
  buildOutputFileName,
  clampBlockSize,
  clampPercent,
  estimateBlockGrid,
  estimateNoiseSigma,
  influenceToLambda,
  MAX_PIXELS,
  type SmoothOptions,
} from './mosaic-smoother';

const OPTS: SmoothOptions = {
  blockSize: null,
  influence: 40,
  grain: 0,
  seed: 1,
};

/** 左上が暗く右下が明るい、なだらかなグラデーション画像 */
function makeGradient(width: number, height: number) {
  const data = new Uint8ClampedArray(width * height * 4);
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const i = (y * width + x) * 4;
      data[i] = Math.round((x / (width - 1)) * 200);
      data[i + 1] = Math.round((y / (height - 1)) * 200);
      data[i + 2] = 100;
      data[i + 3] = 255;
    }
  }
  return data;
}

function meanAbsError(
  a: Uint8ClampedArray,
  b: Uint8ClampedArray,
  width: number,
  rect: { x: number; y: number; width: number; height: number },
) {
  let sum = 0;
  let n = 0;
  for (let y = rect.y; y < rect.y + rect.height; y++) {
    for (let x = rect.x; x < rect.x + rect.width; x++) {
      const i = (y * width + x) * 4;
      sum +=
        Math.abs(a[i] - b[i]) +
        Math.abs(a[i + 1] - b[i + 1]) +
        Math.abs(a[i + 2] - b[i + 2]);
      n += 3;
    }
  }
  return sum / n;
}

describe('clamp / 変換', () => {
  it('clampPercent は 0〜100 に丸め、不正値は既定値', () => {
    expect(clampPercent(-5, 40)).toBe(0);
    expect(clampPercent(150, 40)).toBe(100);
    expect(clampPercent(NaN, 40)).toBe(40);
    expect(clampPercent(33.6, 40)).toBe(34);
  });

  it('clampBlockSize は 3〜64 に丸める', () => {
    expect(clampBlockSize(1)).toBe(3);
    expect(clampBlockSize(500)).toBe(64);
    expect(clampBlockSize(NaN)).toBe(3);
    expect(clampBlockSize(15.4)).toBe(15);
  });

  it('influenceToLambda は 0 で 0、単調増加', () => {
    expect(influenceToLambda(0)).toBe(0);
    expect(influenceToLambda(50)).toBeGreaterThan(0);
    expect(influenceToLambda(100)).toBeGreaterThan(influenceToLambda(50));
    expect(influenceToLambda(100)).toBeCloseTo(0.5);
  });
});

describe('estimateBlockGrid', () => {
  const W = 128;
  const H = 96;

  it('ブロックサイズと位相を検出する(領域がブロック格子とずれていても)', () => {
    const data = makeGradient(W, H);
    // 格子を座標(0,0)基準で作る(applyMosaic は矩形の左上基準なので全体に適用)
    applyMosaic(data, W, { x: 0, y: 0, width: W, height: H }, 8);
    const grid = estimateBlockGrid(data, W, {
      x: 13,
      y: 11,
      width: 70,
      height: 60,
    });
    expect(grid).not.toBeNull();
    expect(grid!.size).toBe(8);
    expect(grid!.offsetX).toBe(0);
    expect(grid!.offsetY).toBe(0);
  });

  it('矩形の左上基準のモザイクでは位相が矩形位置に一致する', () => {
    const data = makeGradient(W, H);
    const rect = { x: 21, y: 17, width: 64, height: 48 };
    applyMosaic(data, W, rect, 16);
    const grid = estimateBlockGrid(data, W, rect);
    expect(grid).not.toBeNull();
    expect(grid!.size).toBe(16);
    expect(grid!.offsetX).toBe(21 % 16);
    expect(grid!.offsetY).toBe(17 % 16);
  });

  it('モザイクでない滑らかな画像では検出しない', () => {
    const data = makeGradient(W, H);
    expect(
      estimateBlockGrid(data, W, { x: 10, y: 10, width: 80, height: 60 }),
    ).toBeNull();
  });

  it('単色では検出しない', () => {
    const data = new Uint8ClampedArray(W * H * 4).fill(128);
    expect(
      estimateBlockGrid(data, W, { x: 0, y: 0, width: W, height: H }),
    ).toBeNull();
  });

  it('サイズ固定のときはそのサイズで位相だけ推定する', () => {
    const data = makeGradient(W, H);
    const rect = { x: 8, y: 8, width: 64, height: 64 };
    applyMosaic(data, W, rect, 8);
    const grid = estimateBlockGrid(data, W, rect, 8);
    expect(grid).toEqual({ size: 8, offsetX: 0, offsetY: 0 });
  });
});

describe('applyMosaicSmooth', () => {
  const W = 128;
  const H = 96;
  const rect = { x: 32, y: 24, width: 64, height: 48 };

  it('モザイクをかけたグラデーションを元に近い色面へ戻す(モザイクより誤差が小さい)', () => {
    const original = makeGradient(W, H);
    const mosaic = new Uint8ClampedArray(original);
    applyMosaic(mosaic, W, rect, 16);
    const errBefore = meanAbsError(original, mosaic, W, rect);

    const out = new Uint8ClampedArray(mosaic);
    const result = applyMosaicSmooth(out, { width: W, height: H }, rect, OPTS);
    const errAfter = meanAbsError(original, out, W, rect);

    expect(result.grid?.size).toBe(16);
    expect(errAfter).toBeLessThan(errBefore);
    expect(errAfter).toBeLessThan(2);
  });

  it('範囲外の画素は変更しない', () => {
    const mosaic = makeGradient(W, H);
    applyMosaic(mosaic, W, rect, 16);
    const out = new Uint8ClampedArray(mosaic);
    applyMosaicSmooth(out, { width: W, height: H }, rect, OPTS);
    for (let y = 0; y < H; y++) {
      for (let x = 0; x < W; x++) {
        const inside =
          x >= rect.x &&
          x < rect.x + rect.width &&
          y >= rect.y &&
          y < rect.y + rect.height;
        if (inside) continue;
        const i = (y * W + x) * 4;
        expect([out[i], out[i + 1], out[i + 2], out[i + 3]]).toEqual([
          mosaic[i],
          mosaic[i + 1],
          mosaic[i + 2],
          mosaic[i + 3],
        ]);
      }
    }
  });

  it('反映度0では周囲の色だけから補間する(ブロックの色は使わない)', () => {
    const data = new Uint8ClampedArray(W * H * 4);
    for (let i = 0; i < data.length; i += 4) {
      data[i] = 100;
      data[i + 1] = 100;
      data[i + 2] = 100;
      data[i + 3] = 255;
    }
    // 中央に真っ赤なモザイク領域がある
    for (let y = rect.y; y < rect.y + rect.height; y++) {
      for (let x = rect.x; x < rect.x + rect.width; x++) {
        const i = (y * W + x) * 4;
        data[i] = 255;
        data[i + 1] = 0;
        data[i + 2] = 0;
      }
    }
    applyMosaicSmooth(data, { width: W, height: H }, rect, {
      ...OPTS,
      influence: 0,
    });
    const c = ((rect.y + 24) * W + rect.x + 32) * 4;
    expect(data[c]).toBeCloseTo(100, -1);
    expect(data[c + 1]).toBeCloseTo(100, -1);
    expect(data[c + 2]).toBeCloseTo(100, -1);
  });

  it('領域の縁は周囲の画素と連続する', () => {
    const original = makeGradient(W, H);
    const out = new Uint8ClampedArray(original);
    // 周囲と全く違う色の領域を作ってから置換する
    for (let y = rect.y; y < rect.y + rect.height; y++) {
      for (let x = rect.x; x < rect.x + rect.width; x++) {
        const i = (y * W + x) * 4;
        out[i] = 0;
        out[i + 1] = 255;
        out[i + 2] = 0;
      }
    }
    applyMosaicSmooth(out, { width: W, height: H }, rect, {
      ...OPTS,
      influence: 0,
    });
    for (let x = rect.x; x < rect.x + rect.width; x += 8) {
      const inner = (rect.y * W + x) * 4;
      const outer = ((rect.y - 1) * W + x) * 4;
      expect(Math.abs(out[inner] - out[outer])).toBeLessThan(8);
      expect(Math.abs(out[inner + 1] - out[outer + 1])).toBeLessThan(8);
    }
  });

  it('画像全体を指定してもクラッシュせず、値は 0〜255 に収まる', () => {
    const data = makeGradient(W, H);
    applyMosaic(data, W, { x: 0, y: 0, width: W, height: H }, 8);
    expect(() =>
      applyMosaicSmooth(
        data,
        { width: W, height: H },
        { x: 0, y: 0, width: W, height: H },
        OPTS,
      ),
    ).not.toThrow();
    for (const v of data) expect(v >= 0 && v <= 255).toBe(true);
  });

  it('画像端に接する範囲も処理できる', () => {
    const original = makeGradient(W, H);
    const edgeRect = { x: 0, y: 0, width: 40, height: 40 };
    const data = new Uint8ClampedArray(original);
    applyMosaic(data, W, edgeRect, 8);
    applyMosaicSmooth(data, { width: W, height: H }, edgeRect, OPTS);
    expect(meanAbsError(original, data, W, edgeRect)).toBeLessThan(3);
  });

  it('極小の範囲(1×1)でも動く', () => {
    const data = makeGradient(W, H);
    expect(() =>
      applyMosaicSmooth(
        data,
        { width: W, height: H },
        { x: 10, y: 10, width: 1, height: 1 },
        OPTS,
      ),
    ).not.toThrow();
  });

  it('画像外の範囲は何もしない', () => {
    const data = makeGradient(W, H);
    const copy = new Uint8ClampedArray(data);
    const result = applyMosaicSmooth(
      data,
      { width: W, height: H },
      { x: 500, y: 500, width: 10, height: 10 },
      OPTS,
    );
    expect(result.grid).toBeNull();
    expect(data).toEqual(copy);
  });

  it('透過も含めて処理する(アルファは周囲から補間)', () => {
    const data = makeGradient(W, H);
    for (let i = 3; i < data.length; i += 4) data[i] = 128;
    applyMosaicSmooth(data, { width: W, height: H }, rect, {
      ...OPTS,
      influence: 0,
    });
    const c = ((rect.y + 10) * W + rect.x + 10) * 4;
    expect(data[c + 3]).toBe(128);
  });

  it('粒状感: 同じシードなら同じ結果、粒状感0とは異なる', () => {
    const base = makeGradient(W, H);
    // 周囲にノイズを乗せる
    let s = 7;
    for (let i = 0; i < base.length; i += 4) {
      s = (s * 1103515245 + 12345) & 0x7fffffff;
      const n = (s % 11) - 5;
      base[i] = Math.min(255, Math.max(0, base[i] + n));
      base[i + 1] = Math.min(255, Math.max(0, base[i + 1] + n));
    }
    const image = { width: W, height: H };
    const a = new Uint8ClampedArray(base);
    const b = new Uint8ClampedArray(base);
    const c = new Uint8ClampedArray(base);
    const grainy = { ...OPTS, influence: 0, grain: 100, seed: 42 };
    applyMosaicSmooth(a, image, rect, grainy);
    applyMosaicSmooth(b, image, rect, grainy);
    applyMosaicSmooth(c, image, rect, { ...grainy, grain: 0 });
    expect(a).toEqual(b);
    expect(a).not.toEqual(c);
  });
});

describe('estimateNoiseSigma', () => {
  it('ノイズの無い画像では 0 に近い', () => {
    const W = 64;
    const H = 64;
    const data = makeGradient(W, H);
    const sigma = estimateNoiseSigma(
      data,
      { width: W, height: H },
      { x: 20, y: 20, width: 20, height: 20 },
    );
    expect(sigma).toBeLessThan(1);
  });

  it('一様ノイズの大きさをおおよそ推定する', () => {
    const W = 96;
    const H = 96;
    const data = new Uint8ClampedArray(W * H * 4);
    let s = 3;
    // 標準偏差 ≈ 8 の一様ノイズ(幅±14)
    for (let i = 0; i < data.length; i += 4) {
      s = (s * 1103515245 + 12345) & 0x7fffffff;
      const n = (s % 29) - 14;
      data[i] = data[i + 1] = data[i + 2] = 128 + n;
      data[i + 3] = 255;
    }
    const sigma = estimateNoiseSigma(
      data,
      { width: W, height: H },
      { x: 30, y: 30, width: 30, height: 30 },
    );
    expect(sigma).toBeGreaterThan(6);
    expect(sigma).toBeLessThan(10);
  });
});

describe('applyRegions', () => {
  it('複数の領域を順に適用する', () => {
    const W = 128;
    const H = 96;
    const data = makeGradient(W, H);
    const r1 = { x: 10, y: 10, width: 30, height: 30 };
    const r2 = { x: 70, y: 40, width: 40, height: 40 };
    applyMosaic(data, W, r1, 8);
    applyMosaic(data, W, r2, 8);
    const original = makeGradient(W, H);
    applyRegions(data, { width: W, height: H }, [
      { rect: r1, options: OPTS },
      { rect: r2, options: OPTS },
    ]);
    expect(meanAbsError(original, data, W, r1)).toBeLessThan(3);
    expect(meanAbsError(original, data, W, r2)).toBeLessThan(3);
  });
});

describe('境界が無い(四辺とも画像端に接する)範囲', () => {
  it('ブロック未検出・反映度0でも黒にならず、元の平均色付近になる', () => {
    const W = 32;
    const H = 32;
    const data = new Uint8ClampedArray(W * H * 4);
    for (let i = 0; i < data.length; i += 4) {
      data[i] = 200;
      data[i + 1] = 100;
      data[i + 2] = 50;
      data[i + 3] = 255;
    }
    applyMosaicSmooth(
      data,
      { width: W, height: H },
      { x: 0, y: 0, width: W, height: H },
      { ...OPTS, influence: 0 },
    );
    const c = (16 * W + 16) * 4;
    expect(data[c]).toBeCloseTo(200, -1);
    expect(data[c + 1]).toBeCloseTo(100, -1);
    expect(data[c + 3]).toBe(255);
  });

  it('全面選択で反映度が既定(40)でも黒にならず、モザイクの平均色付近になる', () => {
    const W = 64;
    const H = 64;
    // 赤と黄の8pxブロック市松(平均色は約 (255,128,0))
    const data = new Uint8ClampedArray(W * H * 4);
    for (let y = 0; y < H; y++)
      for (let x = 0; x < W; x++) {
        const i = (y * W + x) * 4;
        const yellow = (Math.floor(x / 8) + Math.floor(y / 8)) % 2 === 1;
        data[i] = 255;
        data[i + 1] = yellow ? 255 : 0;
        data[i + 2] = 0;
        data[i + 3] = 255;
      }
    applyMosaicSmooth(
      data,
      { width: W, height: H },
      { x: 0, y: 0, width: W, height: H },
      OPTS,
    );
    const c = (32 * W + 32) * 4;
    // 黒一色(旧バグ)ではなく、平均色の付近に収まる
    expect(data[c]).toBeGreaterThan(225);
    expect(data[c + 1]).toBeGreaterThan(90);
    expect(data[c + 1]).toBeLessThan(165);
    expect(data[c + 2]).toBeLessThan(20);
  });

  it('画像外にはみ出した範囲は画像内にクリップされ、はみ出し分の外は変えない', () => {
    const W = 40;
    const H = 40;
    const data = makeGradient(W, H);
    applyMosaic(data, W, { x: 0, y: 0, width: 20, height: 20 }, 8);
    const before = new Uint8ClampedArray(data);
    applyMosaicSmooth(
      data,
      { width: W, height: H },
      { x: -10, y: -10, width: 30, height: 30 },
      OPTS,
    );
    // 範囲(-10..19)のうち画像内の 0..19 だけが変わる。20以降は不変
    for (let y = 0; y < H; y++) {
      for (let x = 0; x < W; x++) {
        if (x < 20 && y < 20) continue;
        const i = (y * W + x) * 4;
        expect(data[i]).toBe(before[i]);
        expect(data[i + 1]).toBe(before[i + 1]);
      }
    }
  });

  it('1px幅の細長い範囲でも例外にならず、値は範囲内に収まる', () => {
    const W = 64;
    const H = 64;
    const data = makeGradient(W, H);
    expect(() =>
      applyMosaicSmooth(
        data,
        { width: W, height: H },
        { x: 30, y: 0, width: 1, height: 64 },
        { ...OPTS, grain: 100 },
      ),
    ).not.toThrow();
    for (const v of data) expect(v >= 0 && v <= 255).toBe(true);
  });

  it('透過のアルファ勾配は周囲のアルファから連続して補間される', () => {
    const W = 64;
    const H = 64;
    const data = new Uint8ClampedArray(W * H * 4);
    for (let y = 0; y < H; y++)
      for (let x = 0; x < W; x++) {
        const i = (y * W + x) * 4;
        data[i] = data[i + 1] = data[i + 2] = 120;
        // 左端は不透明、右端は透明に近い
        data[i + 3] = Math.round(255 - (x / (W - 1)) * 200);
      }
    const r = { x: 24, y: 24, width: 16, height: 16 };
    applyMosaicSmooth(data, { width: W, height: H }, r, {
      ...OPTS,
      influence: 0,
    });
    const left = (32 * W + 23) * 4 + 3;
    const mid = (32 * W + 32) * 4 + 3;
    const right = (32 * W + 40) * 4 + 3;
    expect(data[mid]).toBeLessThan(data[left]);
    expect(data[mid]).toBeGreaterThan(data[right]);
  });

  it('既定の最大画素数は 4000万', () => {
    expect(MAX_PIXELS).toBe(16_000_000);
  });
});

describe('buildOutputFileName', () => {
  it('拡張子を差し替えて -smoothed を付ける', () => {
    expect(buildOutputFileName('photo.png', 'png')).toBe('photo-smoothed.png');
    expect(buildOutputFileName('photo.final.jpeg', 'jpeg')).toBe(
      'photo.final-smoothed.jpg',
    );
    expect(buildOutputFileName('a.jpg', 'webp')).toBe('a-smoothed.webp');
  });

  it('拡張子が無い・先頭のみのドットでも壊れない', () => {
    expect(buildOutputFileName('noext', 'png')).toBe('noext-smoothed.png');
    expect(buildOutputFileName('.hidden', 'png')).toBe('.hidden-smoothed.png');
    expect(buildOutputFileName('', 'png')).toBe('image-smoothed.png');
  });

  it('日本語のファイル名もそのまま使う', () => {
    expect(buildOutputFileName('写真 その1.jpg', 'png')).toBe(
      '写真 その1-smoothed.png',
    );
  });
});
