import { describe, it, expect } from 'vitest';
import {
  backgroundMask,
  colorDistance,
  distanceTransform,
  erodeMask,
  hexToRgb,
  isWithinPixelLimit,
  pixelAt,
  removeBackground,
  rgbToHex,
  transparentFileName,
  type Rgb,
  type RemoveOptions,
  type RgbaImage,
} from './image-background-remover';

const WHITE: Rgb = { r: 255, g: 255, b: 255 };
const RED: Rgb = { r: 255, g: 0, b: 0 };
const BLACK: Rgb = { r: 0, g: 0, b: 0 };

/** rows の文字: W=白, R=赤, K=黒。幅・高さは rows から決まる */
function makeImage(rows: string[]): RgbaImage {
  const height = rows.length;
  const width = rows[0].length;
  const data = new Uint8ClampedArray(width * height * 4);
  const colors: Record<string, Rgb> = { W: WHITE, R: RED, K: BLACK };
  rows.forEach((row, y) =>
    [...row].forEach((ch, x) => {
      const c = colors[ch];
      const i = (y * width + x) * 4;
      data[i] = c.r;
      data[i + 1] = c.g;
      data[i + 2] = c.b;
      data[i + 3] = 255;
    }),
  );
  return { data, width, height };
}

const alphaAt = (img: RgbaImage, x: number, y: number) =>
  img.data[(y * img.width + x) * 4 + 3];

const baseOptions: RemoveOptions = {
  picks: [{ background: WHITE, seed: null }],
  tolerance: 10,
  mode: 'global',
  erode: 0,
  defringe: 0,
  outlineWidth: 0,
  outlineColor: BLACK,
};

describe('色ユーティリティ', () => {
  it('hexToRgb / rgbToHex が往復できる', () => {
    expect(hexToRgb('#ff8000')).toEqual({ r: 255, g: 128, b: 0 });
    expect(rgbToHex({ r: 255, g: 128, b: 0 })).toBe('#ff8000');
    expect(hexToRgb('zzz')).toBeNull();
  });

  it('colorDistance は同色で0、黒白で最大', () => {
    expect(colorDistance(WHITE, WHITE)).toBe(0);
    expect(colorDistance(BLACK, WHITE)).toBeCloseTo(441.67, 1);
  });

  it('pixelAt は範囲外で null', () => {
    const img = makeImage(['WR']);
    expect(pixelAt(img, 1, 0)).toEqual(RED);
    expect(pixelAt(img, 2, 0)).toBeNull();
    expect(pixelAt(img, 0, -1)).toBeNull();
  });

  it('画素数の上限判定', () => {
    expect(isWithinPixelLimit(4000, 4000)).toBe(true);
    expect(isWithinPixelLimit(5000, 5000)).toBe(false);
  });
});

describe('backgroundMask', () => {
  const img = makeImage(['WWWWW', 'WRRRW', 'WRWRW', 'WRRRW', 'WWWWW']);

  it('global は離れた同色の領域（内側の穴）も透過対象にする', () => {
    const m = backgroundMask(img, WHITE, 10, 'global', null);
    expect(m[2 * 5 + 2]).toBe(1);
    expect(m[0]).toBe(1);
    expect(m[1 * 5 + 1]).toBe(0);
  });

  it('contiguous は起点からつながる領域だけを対象にする', () => {
    const m = backgroundMask(img, WHITE, 10, 'contiguous', { x: 0, y: 0 });
    expect(m[0]).toBe(1);
    expect(m[2 * 5 + 2]).toBe(0);
  });

  it('contiguous で起点が背景色と合わなければ外周から始める', () => {
    const m = backgroundMask(img, WHITE, 10, 'contiguous', { x: 1, y: 1 });
    expect(m[0]).toBe(1);
    expect(m[2 * 5 + 2]).toBe(0);
  });

  it('許容値が大きいと近い色も背景になる', () => {
    const near: RgbaImage = makeImage(['WR']);
    near.data[0] = 240; // 白に近い灰色
    expect(backgroundMask(near, WHITE, 0, 'global', null)[0]).toBe(0);
    expect(backgroundMask(near, WHITE, 10, 'global', null)[0]).toBe(1);
    expect(backgroundMask(near, WHITE, 100, 'global', null)[1]).toBe(1);
  });

  it('もともと透明なピクセルは背景として扱う', () => {
    const t = makeImage(['R']);
    t.data[3] = 0;
    expect(backgroundMask(t, WHITE, 0, 'global', null)[0]).toBe(1);
  });
});

describe('distanceTransform / erodeMask', () => {
  it('ターゲットまでの距離を返す', () => {
    const target = new Uint8Array([1, 0, 0, 0]);
    const d = distanceTransform(target, 4, 1);
    expect(Array.from(d).map((v) => Math.round(v * 100) / 100)).toEqual([
      0, 1, 2, 3,
    ]);
  });

  it('ターゲットが無いときは非常に大きな値', () => {
    const d = distanceTransform(new Uint8Array(4), 2, 2);
    expect(d[0]).toBeGreaterThan(1e6);
  });

  it('erode は背景に接した前景を指定px分だけ背景にする', () => {
    // 1行: 背景 前景×4
    const mask = new Uint8Array([1, 0, 0, 0, 0]);
    expect(Array.from(erodeMask(mask, 5, 1, 1))).toEqual([1, 1, 0, 0, 0]);
    expect(Array.from(erodeMask(mask, 5, 1, 2))).toEqual([1, 1, 1, 0, 0]);
    expect(erodeMask(mask, 5, 1, 0)).toBe(mask);
  });
});

describe('removeBackground', () => {
  const img = makeImage(['WWWWW', 'WRRRW', 'WRRRW', 'WRRRW', 'WWWWW']);

  it('背景が透明になり、前景は不透明のまま残る', () => {
    const out = removeBackground(img, baseOptions);
    expect(out.width).toBe(5);
    expect(out.padding).toBe(0);
    expect(alphaAt(out, 0, 0)).toBe(0);
    expect(alphaAt(out, 2, 2)).toBe(255);
  });

  it('複数回の指定は、それぞれの透過範囲を合わせたものになる', () => {
    const out = removeBackground(img, {
      ...baseOptions,
      picks: [
        { background: WHITE, seed: null },
        { background: RED, seed: null },
      ],
    });
    expect(alphaAt(out, 0, 0)).toBe(0);
    expect(alphaAt(out, 2, 2)).toBe(0);
  });

  it('指定が空なら何も透過しない', () => {
    const out = removeBackground(img, { ...baseOptions, picks: [] });
    expect(alphaAt(out, 0, 0)).toBe(255);
  });

  it('入力画像は変更されない', () => {
    const before = Uint8ClampedArray.from(img.data);
    removeBackground(img, { ...baseOptions, outlineWidth: 2, defringe: 1 });
    expect(Array.from(img.data)).toEqual(Array.from(before));
  });

  it('erode で縁が削れる', () => {
    const out = removeBackground(img, { ...baseOptions, erode: 1 });
    expect(alphaAt(out, 1, 1)).toBe(0);
    expect(alphaAt(out, 2, 2)).toBe(255);
  });

  it('輪郭を付けると余白が足され、前景の外側が輪郭色になる', () => {
    const out = removeBackground(img, {
      ...baseOptions,
      outlineWidth: 2,
      outlineColor: BLACK,
    });
    expect(out.padding).toBe(2);
    expect(out.width).toBe(9);
    expect(out.height).toBe(9);
    // 前景(元の1,1)は余白分ずれて(3,3)。その1px外側(2,3)は輪郭
    expect(alphaAt(out, 3, 3)).toBe(255);
    expect(alphaAt(out, 2, 3)).toBe(255);
    // 輪郭の太さの外側は透明
    expect(alphaAt(out, 0, 0)).toBe(0);
  });

  it('輪郭色が反映される', () => {
    const out = removeBackground(img, {
      ...baseOptions,
      outlineWidth: 1,
      outlineColor: { r: 0, g: 128, b: 255 },
    });
    // 元(1,1)は余白1で(2,2)。左隣(1,2)が輪郭
    const i = (2 * out.width + 1) * 4;
    expect([out.data[i], out.data[i + 1], out.data[i + 2]]).toEqual([
      0, 128, 255,
    ]);
  });

  it('defringe で縁の色が内側の色になる', () => {
    // 前景の縁に背景と混ざった灰色(許容値の外)が1px付いている
    const fringed = makeImage(['WWWWW', 'WRRRW', 'WRRRW', 'WRRRW', 'WWWWW']);
    const i = (2 * 5 + 1) * 4;
    fringed.data[i + 1] = 100;
    fringed.data[i + 2] = 100;
    const out = removeBackground(fringed, { ...baseOptions, defringe: 1 });
    expect([out.data[i], out.data[i + 1], out.data[i + 2]]).toEqual([
      255, 0, 0,
    ]);
  });
});

describe('transparentFileName', () => {
  it('拡張子を .png に置き換え -transparent を付ける', () => {
    expect(transparentFileName('photo.jpg')).toBe('photo-transparent.png');
    expect(transparentFileName(null)).toBe('image-transparent.png');
  });
});
