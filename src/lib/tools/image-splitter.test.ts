import { describe, expect, it } from 'vitest';
import {
  MAX_LINES,
  clampLines,
  computeTiles,
  isValidGrid,
  splitZipName,
  tileFileName,
  tileNumber,
} from './image-splitter';

describe('clampLines', () => {
  it('範囲内に丸める', () => {
    expect(clampLines(3)).toBe(3);
    expect(clampLines(0)).toBe(1);
    expect(clampLines(-5)).toBe(1);
    expect(clampLines(999)).toBe(MAX_LINES);
    expect(clampLines(2.6)).toBe(3);
  });
  it('数でなければ 1', () => {
    expect(clampLines(NaN)).toBe(1);
    expect(clampLines(Infinity)).toBe(1);
    expect(clampLines(-Infinity)).toBe(1);
  });
  it('境界値（0.4は1、2.4は2、上限ちょうどはそのまま）', () => {
    expect(clampLines(0.4)).toBe(1);
    expect(clampLines(2.4)).toBe(2);
    expect(clampLines(MAX_LINES)).toBe(MAX_LINES);
    expect(clampLines(MAX_LINES + 1)).toBe(MAX_LINES);
  });
});

describe('isValidGrid', () => {
  it('分割数の上限と1px以上を確認する', () => {
    expect(isValidGrid({ width: 300, height: 300 }, 3, 3)).toBe(true);
    expect(isValidGrid({ width: 300, height: 300 }, 11, 10)).toBe(false);
    expect(isValidGrid({ width: 2, height: 300 }, 1, 3)).toBe(false);
    expect(isValidGrid({ width: 300, height: 2 }, 3, 1)).toBe(false);
    expect(isValidGrid({ width: 300, height: 300 }, 0, 3)).toBe(false);
  });
  it('上限ちょうど（100枚）は許可、101枚からは不可', () => {
    const big = { width: 1000, height: 1000 };
    expect(isValidGrid(big, 10, 10)).toBe(true);
    expect(isValidGrid(big, 20, 5)).toBe(true);
    expect(isValidGrid(big, 20, 6)).toBe(false);
    expect(isValidGrid(big, 1, 101)).toBe(false);
  });
  it('1×1 の画像（1px）は 1×1 だけ有効', () => {
    expect(isValidGrid({ width: 1, height: 1 }, 1, 1)).toBe(true);
    expect(isValidGrid({ width: 1, height: 1 }, 1, 2)).toBe(false);
    expect(isValidGrid({ width: 1, height: 1 }, 2, 1)).toBe(false);
  });
});

describe('computeTiles', () => {
  it('割り切れるときは同じ大きさに分割する', () => {
    const tiles = computeTiles({ width: 300, height: 300 }, 3, 3);
    expect(tiles).toHaveLength(9);
    expect(tiles[0]).toEqual({
      row: 0,
      col: 0,
      x: 0,
      y: 0,
      width: 100,
      height: 100,
    });
    expect(tiles[4]).toMatchObject({ row: 1, col: 1, x: 100, y: 100 });
    expect(tiles[8]).toMatchObject({ x: 200, y: 200, width: 100, height: 100 });
  });

  it('割り切れないときも隙間・重なりなく全体を覆う', () => {
    const size = { width: 100, height: 50 };
    const tiles = computeTiles(size, 2, 3);
    const first = tiles.filter((t) => t.row === 0);
    expect(first.map((t) => t.width)).toEqual([33, 34, 33]);
    expect(first.reduce((s, t) => s + t.width, 0)).toBe(100);
    const area = tiles.reduce((s, t) => s + t.width * t.height, 0);
    expect(area).toBe(100 * 50);
    // 隣り合うタイルの境界が一致する
    expect(first[1].x).toBe(first[0].x + first[0].width);
  });

  it('1×1 は元画像全体', () => {
    expect(computeTiles({ width: 7, height: 5 }, 1, 1)).toEqual([
      { row: 0, col: 0, x: 0, y: 0, width: 7, height: 5 },
    ]);
  });

  it('不正な分割は空配列', () => {
    expect(computeTiles({ width: 2, height: 2 }, 1, 3)).toEqual([]);
    expect(computeTiles({ width: 300, height: 300 }, 0, 0)).toEqual([]);
  });

  it('1pxの画像を1×1に分けても1タイル（1×1）', () => {
    expect(computeTiles({ width: 1, height: 1 }, 1, 1)).toEqual([
      { row: 0, col: 0, x: 0, y: 0, width: 1, height: 1 },
    ]);
  });

  it('幅と同じ列数（1px幅のタイル）でも隙間なく並ぶ', () => {
    const tiles = computeTiles({ width: 3, height: 1 }, 1, 3);
    expect(tiles.map((t) => [t.x, t.width])).toEqual([
      [0, 1],
      [1, 1],
      [2, 1],
    ]);
  });

  it('端数の大きい分割でも全体を覆い、重ならず、大きさの差は最大1px', () => {
    // 幅・高さ・分割数を組み合わせて、覆い漏れ・重なり・大きさのずれを総当たりで確認する
    for (let width = 1; width <= 37; width++) {
      for (let height = 1; height <= 23; height++) {
        for (let rows = 1; rows <= Math.min(height, 7); rows++) {
          for (let cols = 1; cols <= Math.min(width, 7); cols++) {
            const size = { width, height };
            const tiles = computeTiles(size, rows, cols);
            const grid = Array.from({ length: height }, () =>
              Array<number>(width).fill(0),
            );
            for (const t of tiles) {
              for (let y = t.y; y < t.y + t.height; y++) {
                for (let x = t.x; x < t.x + t.width; x++) grid[y][x]++;
              }
            }
            const covered = grid.every((line) => line.every((n) => n === 1));
            if (!covered) {
              throw new Error(
                `覆い漏れ・重なり: ${width}x${height} ${rows}x${cols}`,
              );
            }
            const widths = tiles.map((t) => t.width);
            const heights = tiles.map((t) => t.height);
            expect(
              Math.max(...widths) - Math.min(...widths),
            ).toBeLessThanOrEqual(1);
            expect(
              Math.max(...heights) - Math.min(...heights),
            ).toBeLessThanOrEqual(1);
            expect(tiles).toHaveLength(rows * cols);
          }
        }
      }
    }
  });

  it('大きな画像（1辺16384px、100分割）でも面積が一致する', () => {
    const size = { width: 16384, height: 6101 };
    const tiles = computeTiles(size, 10, 10);
    expect(tiles).toHaveLength(100);
    const area = tiles.reduce((s, t) => s + t.width * t.height, 0);
    expect(area).toBe(16384 * 6101);
  });
});

describe('tileNumber', () => {
  it('通常は左上が1番', () => {
    expect(tileNumber({ row: 0, col: 0 }, 3, 3, false)).toBe(1);
    expect(tileNumber({ row: 2, col: 2 }, 3, 3, false)).toBe(9);
  });
  it('reverse では右下が1番', () => {
    expect(tileNumber({ row: 2, col: 2 }, 3, 3, true)).toBe(1);
    expect(tileNumber({ row: 0, col: 0 }, 3, 3, true)).toBe(9);
    expect(tileNumber({ row: 1, col: 0 }, 2, 3, true)).toBe(3);
  });
  it('1×1 は reverse でも 1 番', () => {
    expect(tileNumber({ row: 0, col: 0 }, 1, 1, false)).toBe(1);
    expect(tileNumber({ row: 0, col: 0 }, 1, 1, true)).toBe(1);
  });
  it('reverse の番号は 1〜枚数を重複なく並べる', () => {
    const rows = 4;
    const cols = 5;
    const numbers = computeTiles({ width: 50, height: 40 }, rows, cols).map(
      (t) => tileNumber(t, rows, cols, true),
    );
    expect([...numbers].sort((a, b) => a - b)).toEqual(
      Array.from({ length: rows * cols }, (_, i) => i + 1),
    );
  });
});

describe('tileFileName / splitZipName', () => {
  it('番号をゼロ埋めして拡張子を出力形式にする', () => {
    expect(tileFileName('photo.JPG', 3, 9, 'png')).toBe('photo_3.png');
    expect(tileFileName('photo.jpg', 3, 12, 'jpeg')).toBe('photo_03.jpg');
    expect(tileFileName('a.b.png', 1, 100, 'webp')).toBe('a.b_001.webp');
  });
  it('元の名前がなければ image', () => {
    expect(tileFileName(null, 1, 4, 'png')).toBe('image_1.png');
    expect(tileFileName('.png', 1, 4, 'png')).toBe('image_1.png');
  });
  it('ファイル名に使えない文字を取り除く', () => {
    expect(tileFileName('a:b*c.png', 1, 4, 'png')).toBe('abc_1.png');
    expect(tileFileName('C:\\dir\\a<b>"c"|?.png', 1, 4, 'png')).toBe(
      'Cdirabc_1.png',
    );
    expect(tileFileName('a/b.png', 1, 4, 'png')).toBe('ab_1.png');
  });
  it('日本語や絵文字（サロゲートペア）の名前はそのまま使う', () => {
    expect(tileFileName('写真 テスト.jpg', 2, 4, 'jpeg')).toBe(
      '写真 テスト_2.jpg',
    );
    expect(tileFileName('猫📷.png', 1, 4, 'png')).toBe('猫📷_1.png');
  });
  it('空白だけの名前は image、拡張子がなくてもそのまま使う', () => {
    expect(tileFileName('   ', 1, 4, 'png')).toBe('image_1.png');
    expect(tileFileName('photo', 1, 4, 'png')).toBe('photo_1.png');
  });
  it('分割数が1桁のときはゼロ埋めしない', () => {
    expect(tileFileName('a.png', 1, 1, 'png')).toBe('a_1.png');
    expect(tileFileName('a.png', 9, 9, 'png')).toBe('a_9.png');
  });
  it('ZIP名に列×行を付ける', () => {
    expect(splitZipName('photo.png', 3, 3)).toBe('photo-3x3.zip');
    expect(splitZipName(null, 1, 3)).toBe('image-3x1.zip');
  });
});
