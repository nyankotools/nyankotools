import { describe, expect, it } from 'vitest';
import {
  fillHolesMask,
  fitWithin,
  hexToRgb,
  makeSticker,
  rgbToHex,
  squaredDistanceTransform,
  stickerFileName,
  type RgbaImage,
} from './sticker-outline-maker';

/** rows: '#' = 不透明の赤, '.' = 透明 */
function fromRows(rows: string[]): RgbaImage {
  const height = rows.length;
  const width = rows[0].length;
  const data = new Uint8ClampedArray(width * height * 4);
  rows.forEach((row, y) => {
    [...row].forEach((ch, x) => {
      if (ch === '#') {
        const i = (y * width + x) * 4;
        data[i] = 255;
        data[i + 3] = 255;
      }
    });
  });
  return { data, width, height };
}

function px(img: RgbaImage, x: number, y: number) {
  const i = (y * img.width + x) * 4;
  return [img.data[i], img.data[i + 1], img.data[i + 2], img.data[i + 3]];
}

const white = { r: 255, g: 255, b: 255 };

describe('squaredDistanceTransform', () => {
  it('計算結果が総当たりと一致する', () => {
    const w = 7;
    const h = 5;
    const mask = new Uint8Array(w * h);
    mask[1 * w + 2] = 1;
    mask[4 * w + 6] = 1;
    const d = squaredDistanceTransform(mask, w, h);
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        const expected = Math.min(
          (x - 2) ** 2 + (y - 1) ** 2,
          (x - 6) ** 2 + (y - 4) ** 2,
        );
        expect(d[y * w + x]).toBe(expected);
      }
    }
  });
});

describe('fillHolesMask', () => {
  it('端からつながらない穴だけ埋める', () => {
    const rows = ['#####', '#...#', '#.#.#', '#...#', '#####', '.....'];
    const mask = new Uint8Array(30);
    rows.forEach((r, y) =>
      [...r].forEach((c, x) => (mask[y * 5 + x] = c === '#' ? 1 : 0)),
    );
    const filled = fillHolesMask(mask, 5, 6);
    expect(filled[1 * 5 + 1]).toBe(1);
    expect(filled[5 * 5 + 2]).toBe(0);
  });

  it('端が開いている凹みは埋めない', () => {
    const mask = Uint8Array.from([1, 0, 1, 1, 0, 1, 1, 1, 1]);
    const filled = fillHolesMask(mask, 3, 3);
    expect(filled[4]).toBe(0);
  });
});

describe('makeSticker', () => {
  it('四辺に縁取りの太さ分の余白が付く', () => {
    const r = makeSticker(fromRows(['#']), { width: 3, color: white });
    expect(r.width).toBe(7);
    expect(r.height).toBe(7);
    expect(r.offsetX).toBe(3);
  });

  it('縁取りは円形に広がる(斜めは短い)', () => {
    const r = makeSticker(fromRows(['#']), { width: 3, color: white });
    // 半径3: 距離2は完全に不透明、距離3は縁のなめらか処理で約半分
    expect(px(r, 5, 3)[3]).toBe(255);
    expect(px(r, 3, 5)[3]).toBe(255);
    expect(px(r, 6, 3)[3]).toBe(128);
    // 斜め(+2,+2)は距離2.83で縁取り内、(+3,+3)は4.24で外
    expect(px(r, 5, 5)[3]).toBeGreaterThan(100);
    expect(px(r, 6, 6)[3]).toBe(0);
  });

  it('縁取りの色が付き、元画像は上に残る', () => {
    const r = makeSticker(fromRows(['#']), {
      width: 2,
      color: { r: 0, g: 0, b: 255 },
    });
    expect(px(r, 2, 2)).toEqual([255, 0, 0, 255]);
    expect(px(r, 1, 2)).toEqual([0, 0, 255, 255]);
  });

  it('太さ0なら縁取りなしで元画像と同じ', () => {
    const img = fromRows(['#.', '.#']);
    const r = makeSticker(img, { width: 0 });
    expect(r.width).toBe(2);
    expect(Array.from(r.data)).toEqual(Array.from(img.data));
  });

  it('穴を埋めるオプション', () => {
    const rows = ['#####', '#...#', '#...#', '#...#', '#####'];
    const base = { width: 0, color: { r: 0, g: 255, b: 0 } };
    const open = makeSticker(fromRows(rows), base);
    const filled = makeSticker(fromRows(rows), { ...base, fillHoles: true });
    expect(px(open, 2, 2)[3]).toBe(0);
    expect(px(filled, 2, 2)).toEqual([0, 255, 0, 255]);
  });

  it('二重縁は外側に別の色で付く', () => {
    const r = makeSticker(fromRows(['#']), {
      width: 2,
      color: white,
      outerWidth: 2,
      outerColor: { r: 0, g: 0, b: 0 },
    });
    expect(r.width).toBe(9);
    expect(px(r, 5, 4)).toEqual([255, 255, 255, 255]);
    expect(px(r, 7, 4)).toEqual([0, 0, 0, 255]);
  });

  it('影はオフセット側に半透明で付き、余白も増える', () => {
    const r = makeSticker(fromRows(['#']), {
      width: 0,
      shadowOpacity: 50,
      shadowOffsetX: 2,
      shadowOffsetY: 0,
    });
    expect(r.width).toBe(5);
    expect(px(r, 4, 2)[3]).toBe(128);
    expect(px(r, 0, 2)[3]).toBe(0);
  });

  it('半透明の画素はしきい値未満だと縁取りの対象にならない', () => {
    const img = fromRows(['#']);
    img.data[3] = 10;
    const r = makeSticker(img, { width: 2, alphaThreshold: 16 });
    expect(px(r, 4, 2)[3]).toBe(0);
  });

  it('範囲外の値は丸められる', () => {
    const r = makeSticker(fromRows(['#']), { width: 9999 });
    expect(r.width).toBe(201);
  });

  it('全部透明な画像でも落ちない', () => {
    const r = makeSticker(fromRows(['..', '..']), { width: 3 });
    expect(r.data.every((v) => v === 0)).toBe(true);
  });
});

describe('補助関数', () => {
  it('fitWithin は長辺が上限を超えるときだけ縮小する', () => {
    expect(fitWithin(100, 50, 200)).toEqual({
      width: 100,
      height: 50,
      scaled: false,
    });
    expect(fitWithin(4000, 1000, 2000)).toEqual({
      width: 2000,
      height: 500,
      scaled: true,
    });
  });

  it('色の相互変換', () => {
    expect(hexToRgb('#ff8000')).toEqual({ r: 255, g: 128, b: 0 });
    expect(hexToRgb('zzz')).toBeNull();
    expect(rgbToHex({ r: 255, g: 128, b: 0 })).toBe('#ff8000');
  });

  it('保存ファイル名', () => {
    expect(stickerFileName('cat.photo.png')).toBe('cat.photo-sticker.png');
    expect(stickerFileName(null)).toBe('image-sticker.png');
  });
});
