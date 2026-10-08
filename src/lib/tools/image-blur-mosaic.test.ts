import { describe, it, expect } from 'vitest';
import {
  applyBlur,
  applyFill,
  applyMosaic,
  applyRegion,
  applyRegions,
  buildOutputFileName,
  clampStrength,
  clientToImagePoint,
  clipRect,
  formatFileSize,
  isAcceptedImageFile,
  normalizeRect,
  parseHexColor,
  type Region,
} from './image-blur-mosaic';

/** 横方向グラデーション(R=x*10)の RGBA 画像を作る */
function makeImage(w: number, h: number): Uint8ClampedArray {
  const d = new Uint8ClampedArray(w * h * 4);
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const i = (y * w + x) * 4;
      d[i] = x * 10;
      d[i + 1] = y * 10;
      d[i + 2] = 50;
      d[i + 3] = 255;
    }
  }
  return d;
}

function px(d: Uint8ClampedArray, w: number, x: number, y: number) {
  const i = (y * w + x) * 4;
  return [d[i], d[i + 1], d[i + 2], d[i + 3]];
}

describe('clampStrength', () => {
  it('範囲内に丸める', () => {
    expect(clampStrength(1)).toBe(2);
    expect(clampStrength(1000)).toBe(80);
    expect(clampStrength(10.4)).toBe(10);
    expect(clampStrength(NaN)).toBe(2);
  });
});

describe('clientToImagePoint', () => {
  const box = { left: 100, top: 50, width: 200, height: 100 };
  const img = { width: 400, height: 300 };
  it('表示座標を画像座標へ変換する', () => {
    expect(clientToImagePoint(200, 100, box, img)).toEqual({ x: 200, y: 150 });
  });
  it('範囲外は端に丸める', () => {
    expect(clientToImagePoint(0, 0, box, img)).toEqual({ x: 0, y: 0 });
    expect(clientToImagePoint(999, 999, box, img)).toEqual({ x: 400, y: 300 });
  });
  it('表示サイズ0でも例外にならない', () => {
    expect(
      clientToImagePoint(1, 1, { left: 0, top: 0, width: 0, height: 0 }, img),
    ).toEqual({ x: 0, y: 0 });
  });
});

describe('normalizeRect', () => {
  const img = { width: 100, height: 80 };
  it('逆方向のドラッグも正規化する', () => {
    expect(normalizeRect({ x: 50, y: 40 }, { x: 10, y: 20 }, img)).toEqual({
      x: 10,
      y: 20,
      width: 40,
      height: 20,
    });
  });
  it('画像外にはみ出した分は切り詰める', () => {
    expect(normalizeRect({ x: -20, y: -5 }, { x: 150, y: 90 }, img)).toEqual({
      x: 0,
      y: 0,
      width: 100,
      height: 80,
    });
  });
  it('小さすぎる範囲は null', () => {
    expect(normalizeRect({ x: 10, y: 10 }, { x: 11, y: 50 }, img)).toBeNull();
    expect(normalizeRect({ x: 10, y: 10 }, { x: 10, y: 10 }, img)).toBeNull();
  });
});

describe('clipRect', () => {
  it('画像外の矩形は null', () => {
    expect(
      clipRect(
        { x: 200, y: 0, width: 10, height: 10 },
        { width: 100, height: 100 },
      ),
    ).toBeNull();
  });
  it('一部はみ出す矩形は切り詰める', () => {
    expect(
      clipRect(
        { x: 90, y: 90, width: 30, height: 30 },
        { width: 100, height: 100 },
      ),
    ).toEqual({ x: 90, y: 90, width: 10, height: 10 });
  });
});

describe('parseHexColor', () => {
  it('6桁・3桁を解釈する', () => {
    expect(parseHexColor('#ff8000')).toEqual([255, 128, 0]);
    expect(parseHexColor('#f80')).toEqual([255, 136, 0]);
  });
  it('不正値は黒', () => {
    expect(parseHexColor('xyz')).toEqual([0, 0, 0]);
    expect(parseHexColor('')).toEqual([0, 0, 0]);
  });
});

describe('applyMosaic', () => {
  it('範囲内がブロック平均になり範囲外は変わらない', () => {
    const w = 8;
    const d = makeImage(w, 8);
    const orig = d.slice();
    applyMosaic(d, w, { x: 2, y: 2, width: 4, height: 4 }, 4);
    // x=2..5 の R 平均は (20+30+40+50)/4 = 35
    expect(px(d, w, 2, 2)[0]).toBe(35);
    expect(px(d, w, 5, 5)[0]).toBe(35);
    // 範囲外
    expect(px(d, w, 1, 2)).toEqual(px(orig, w, 1, 2));
    expect(px(d, w, 6, 6)).toEqual(px(orig, w, 6, 6));
  });
  it('端の半端なブロックも処理できる', () => {
    const w = 5;
    const d = makeImage(w, 5);
    applyMosaic(d, w, { x: 0, y: 0, width: 5, height: 5 }, 4);
    // 右端の幅1ブロックは x=4 の値そのまま
    expect(px(d, w, 4, 0)[0]).toBe(40);
    // 左のブロックは x=0..3 の平均 15
    expect(px(d, w, 0, 0)[0]).toBe(15);
  });
  it('ブロックサイズが範囲より大きくても1ブロックとして処理する', () => {
    const w = 4;
    const d = makeImage(w, 4);
    applyMosaic(d, w, { x: 0, y: 0, width: 4, height: 4 }, 80);
    expect(px(d, w, 0, 0)).toEqual(px(d, w, 3, 3));
  });
});

describe('applyFill', () => {
  it('範囲を不透明な単色にする', () => {
    const w = 6;
    const d = makeImage(w, 6);
    d[3] = 10;
    applyFill(d, w, { x: 0, y: 0, width: 3, height: 3 }, [1, 2, 3]);
    expect(px(d, w, 0, 0)).toEqual([1, 2, 3, 255]);
    expect(px(d, w, 2, 2)).toEqual([1, 2, 3, 255]);
    expect(px(d, w, 3, 3)).toEqual(px(makeImage(w, 6), w, 3, 3));
  });
});

describe('applyBlur', () => {
  it('単色の領域は変化しない', () => {
    const w = 10;
    const d = new Uint8ClampedArray(w * w * 4).fill(120);
    applyBlur(d, w, { x: 1, y: 1, width: 8, height: 8 }, 3);
    expect(px(d, w, 4, 4)).toEqual([120, 120, 120, 120]);
  });
  it('範囲外は変わらず、範囲内の鋭いエッジがなだらかになる', () => {
    const w = 20;
    const d = new Uint8ClampedArray(w * w * 4);
    for (let y = 0; y < w; y++) {
      for (let x = 0; x < w; x++) {
        const i = (y * w + x) * 4;
        const v = x < 10 ? 0 : 255;
        d[i] = v;
        d[i + 1] = v;
        d[i + 2] = v;
        d[i + 3] = 255;
      }
    }
    applyBlur(d, w, { x: 5, y: 5, width: 10, height: 10 }, 2);
    const edgeLeft = px(d, w, 9, 10)[0];
    const edgeRight = px(d, w, 10, 10)[0];
    expect(edgeLeft).toBeGreaterThan(0);
    expect(edgeRight).toBeLessThan(255);
    expect(px(d, w, 0, 0)[0]).toBe(0);
    expect(px(d, w, 19, 19)[0]).toBe(255);
  });
  it('1px幅の範囲でも例外にならない', () => {
    const w = 4;
    const d = makeImage(w, 4);
    expect(() =>
      applyBlur(d, w, { x: 1, y: 0, width: 1, height: 4 }, 5),
    ).not.toThrow();
  });
});

describe('applyRegion / applyRegions', () => {
  const img = { width: 8, height: 8 };
  const fill: Region = {
    rect: { x: 0, y: 0, width: 4, height: 4 },
    mode: 'fill',
    strength: 10,
    color: '#ff0000',
  };
  it('画像外の領域は何もしない', () => {
    const d = makeImage(8, 8);
    const orig = d.slice();
    applyRegion(d, img, {
      ...fill,
      rect: { x: 100, y: 100, width: 5, height: 5 },
    });
    expect(d).toEqual(orig);
  });
  it('複数領域を順に適用する', () => {
    const d = makeImage(8, 8);
    applyRegions(d, img, [
      fill,
      {
        rect: { x: 4, y: 4, width: 4, height: 4 },
        mode: 'mosaic',
        strength: 4,
        color: '#000000',
      },
    ]);
    expect(px(d, 8, 1, 1)).toEqual([255, 0, 0, 255]);
    expect(px(d, 8, 4, 4)).toEqual(px(d, 8, 7, 7));
  });
  it('空配列なら何もしない', () => {
    const d = makeImage(8, 8);
    const orig = d.slice();
    applyRegions(d, img, []);
    expect(d).toEqual(orig);
  });
});

describe('ファイル関連', () => {
  it('対応形式を判定する', () => {
    expect(isAcceptedImageFile({ type: 'image/png' })).toBe(true);
    expect(isAcceptedImageFile({ type: 'image/svg+xml' })).toBe(false);
    expect(isAcceptedImageFile({ type: '' })).toBe(false);
  });
  it('出力ファイル名を作る', () => {
    expect(buildOutputFileName('photo.JPG', 'png')).toBe('photo-masked.png');
    expect(buildOutputFileName('a.b.png', 'jpeg')).toBe('a.b-masked.jpg');
    expect(buildOutputFileName('noext', 'webp')).toBe('noext-masked.webp');
    expect(buildOutputFileName('.png', 'png')).toBe('.png-masked.png');
  });
  it('ファイルサイズを整形する', () => {
    expect(formatFileSize(500)).toBe('500 B');
    expect(formatFileSize(1536)).toBe('1.50 KB');
    expect(formatFileSize(5 * 1024 * 1024)).toBe('5.00 MB');
  });
});
