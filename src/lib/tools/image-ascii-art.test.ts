import { describe, it, expect } from 'vitest';
import {
  brightnessToChar,
  buildTextFileName,
  CHARSETS,
  CHARSET_IDS,
  clampColumns,
  computeAsciiGrid,
  DEFAULT_COLUMNS,
  isAcceptedImageFile,
  isCharsetId,
  MAX_COLUMNS,
  MAX_ROWS,
  MIN_COLUMNS,
  pixelBrightness,
  pixelsToAscii,
} from './image-ascii-art';

describe('clampColumns', () => {
  it('範囲内の値は整数に丸めて返す', () => {
    expect(clampColumns(80)).toBe(80);
    expect(clampColumns(80.6)).toBe(81);
  });
  it('下限・上限ちょうどの値はそのまま返す（境界値）', () => {
    expect(clampColumns(MIN_COLUMNS)).toBe(10);
    expect(clampColumns(MAX_COLUMNS)).toBe(300);
    expect(clampColumns(9.4)).toBe(MIN_COLUMNS);
    expect(clampColumns(300.4)).toBe(MAX_COLUMNS);
  });
  it('-Infinityも既定値になる', () => {
    expect(clampColumns(-Infinity)).toBe(DEFAULT_COLUMNS);
  });
  it('範囲外は上限・下限にクランプする', () => {
    expect(clampColumns(1)).toBe(MIN_COLUMNS);
    expect(clampColumns(9999)).toBe(MAX_COLUMNS);
  });
  it('NaN・Infinityは既定値になる', () => {
    expect(clampColumns(NaN)).toBe(DEFAULT_COLUMNS);
    expect(clampColumns(Infinity)).toBe(DEFAULT_COLUMNS);
  });
});

describe('computeAsciiGrid', () => {
  it('文字の縦長比率（0.5）を考慮して行数を決める', () => {
    expect(computeAsciiGrid({ width: 200, height: 100 }, 80)).toEqual({
      width: 80,
      height: 20,
    });
  });
  it('極端に横長でも行数は最低1', () => {
    expect(computeAsciiGrid({ width: 5000, height: 1 }, 40).height).toBe(1);
  });
  it('極端に縦長でも行数は上限（MAX_ROWS）に収まる', () => {
    expect(computeAsciiGrid({ width: 1, height: 100000 }, 300).height).toBe(
      MAX_ROWS,
    );
  });
  it('サイズ0の画像でも例外にならない', () => {
    expect(computeAsciiGrid({ width: 0, height: 0 }, 50)).toEqual({
      width: 50,
      height: 1,
    });
  });
  it('正方形の画像は文字の縦長比率で行数が半分になる', () => {
    expect(computeAsciiGrid({ width: 100, height: 100 }, 80)).toEqual({
      width: 80,
      height: 40,
    });
  });
  it('横の文字数は範囲外でもクランプしてから計算する', () => {
    expect(computeAsciiGrid({ width: 100, height: 100 }, 5000).width).toBe(
      MAX_COLUMNS,
    );
    expect(computeAsciiGrid({ width: 100, height: 100 }, 1).width).toBe(
      MIN_COLUMNS,
    );
  });
  it('文字の縦横比（charAspect）を変えると行数が比例して変わる', () => {
    expect(computeAsciiGrid({ width: 100, height: 100 }, 80, 1).height).toBe(
      80,
    );
  });
  it('上限ちょうど（MAX_ROWS）と、その1つ手前の行数は上限で丸められない', () => {
    // 行数 = height/width * cols * 0.5。width=5, cols=10 なら height 行（height/5*10*0.5）
    expect(
      computeAsciiGrid({ width: 5, height: MAX_ROWS - 1 }, 10).height,
    ).toBe(MAX_ROWS - 1);
    expect(computeAsciiGrid({ width: 5, height: MAX_ROWS }, 10).height).toBe(
      MAX_ROWS,
    );
    expect(
      computeAsciiGrid({ width: 5, height: MAX_ROWS + 1 }, 10).height,
    ).toBe(MAX_ROWS);
  });
  it('極端に横長（横2000×縦10）でも行数は1行になる', () => {
    expect(computeAsciiGrid({ width: 2000, height: 10 }, 80)).toEqual({
      width: 80,
      height: 1,
    });
  });
});

describe('pixelBrightness', () => {
  it('黒は0、白は1', () => {
    expect(pixelBrightness(0, 0, 0)).toBe(0);
    expect(pixelBrightness(255, 255, 255)).toBeCloseTo(1, 10);
  });
  it('完全透過は白（1）として扱う', () => {
    expect(pixelBrightness(0, 0, 0, 0)).toBeCloseTo(1, 10);
  });
  it('半透明は白背景との合成として明るくなる（alpha=128は中間付近）', () => {
    const v = pixelBrightness(0, 0, 0, 128);
    expect(v).toBeGreaterThan(0.4);
    expect(v).toBeLessThan(0.6);
  });
  it('緑は赤・青より明るい', () => {
    expect(pixelBrightness(0, 255, 0)).toBeGreaterThan(
      pixelBrightness(255, 0, 0),
    );
    expect(pixelBrightness(255, 0, 0)).toBeGreaterThan(
      pixelBrightness(0, 0, 255),
    );
  });
});

describe('brightnessToChar', () => {
  it('暗いほど先頭（濃い）文字、明るいほど末尾（薄い）文字になる', () => {
    expect(brightnessToChar(0, '@. ')).toBe('@');
    expect(brightnessToChar(1, '@. ')).toBe(' ');
    expect(brightnessToChar(0.5, '@. ')).toBe('.');
  });
  it('invertで明暗が反転する', () => {
    expect(brightnessToChar(0, '@. ', true)).toBe(' ');
    expect(brightnessToChar(1, '@. ', true)).toBe('@');
  });
  it('範囲外の明るさはクランプされる', () => {
    expect(brightnessToChar(-1, '@. ')).toBe('@');
    expect(brightnessToChar(2, '@. ')).toBe(' ');
  });
  it('サロゲートペアを含む文字セットも1文字単位で扱う', () => {
    expect(brightnessToChar(0, '😀 ')).toBe('😀');
  });
  it('空の文字セットは空文字', () => {
    expect(brightnessToChar(0.5, '')).toBe('');
  });
});

describe('pixelsToAscii', () => {
  // 2x2: 黒, 白 / 白, 黒
  const data = new Uint8ClampedArray([
    0, 0, 0, 255, 255, 255, 255, 255, 255, 255, 255, 255, 0, 0, 0, 255,
  ]);
  it('行ごとに改行で区切った文字列を返す', () => {
    expect(pixelsToAscii(data, 2, 2, { charset: 'mono', invert: false })).toBe(
      '# \n #',
    );
  });
  it('invertで文字が入れ替わる', () => {
    expect(pixelsToAscii(data, 2, 2, { charset: 'mono', invert: true })).toBe(
      ' #\n# ',
    );
  });
  it('各行の長さは幅と一致する', () => {
    const out = pixelsToAscii(data, 2, 2, {
      charset: 'standard',
      invert: false,
    });
    expect(out.split('\n').map((l) => l.length)).toEqual([2, 2]);
  });
  it('透過画素（alpha=0）は白として空白になる', () => {
    const transparent = new Uint8ClampedArray([0, 0, 0, 0]);
    expect(
      pixelsToAscii(transparent, 1, 1, { charset: 'mono', invert: false }),
    ).toBe(' ');
  });
  it('高さ0のときは空文字、幅0のときは例外にならず空の行だけを返す', () => {
    expect(
      pixelsToAscii(new Uint8ClampedArray(0), 0, 3, {
        charset: 'mono',
        invert: false,
      }).split('\n'),
    ).toEqual(['', '', '']);
    expect(
      pixelsToAscii(new Uint8ClampedArray(0), 3, 0, {
        charset: 'mono',
        invert: false,
      }),
    ).toBe('');
  });
  it('1行目と2行目の境界で画素の並びがずれない（幅3×高さ2）', () => {
    // 行1: 黒白黒 / 行2: 白白黒
    const px = new Uint8ClampedArray([
      0, 0, 0, 255, 255, 255, 255, 255, 0, 0, 0, 255, 255, 255, 255, 255, 255,
      255, 255, 255, 0, 0, 0, 255,
    ]);
    expect(pixelsToAscii(px, 3, 2, { charset: 'mono', invert: false })).toBe(
      '# #\n  #',
    );
  });
});

describe('文字セット', () => {
  it('全IDの文字セットが2文字以上ある', () => {
    for (const id of CHARSET_IDS) {
      expect(Array.from(CHARSETS[id]).length).toBeGreaterThanOrEqual(2);
    }
  });
  it('isCharsetIdが判定できる', () => {
    expect(isCharsetId('standard')).toBe(true);
    expect(isCharsetId('nope')).toBe(false);
  });
  it('詳細セットは UI の表記どおり70階調ある', () => {
    expect(Array.from(CHARSETS.detailed).length).toBe(70);
  });
  it('詳細セットは最も暗い端が「$」、最も明るい端が空白', () => {
    expect(brightnessToChar(0, CHARSETS.detailed)).toBe('$');
    expect(brightnessToChar(1, CHARSETS.detailed)).toBe(' ');
  });
});

describe('isAcceptedImageFile', () => {
  it('対応する画像MIMEタイプを受け付ける（GIF・BMPを含む）', () => {
    for (const type of [
      'image/png',
      'image/jpeg',
      'image/webp',
      'image/gif',
      'image/bmp',
    ]) {
      expect(isAcceptedImageFile({ type })).toBe(true);
    }
  });
  it('SVG・HEIC・テキスト・空のMIMEタイプは拒否する', () => {
    for (const type of ['image/svg+xml', 'image/heic', 'text/plain', '']) {
      expect(isAcceptedImageFile({ type })).toBe(false);
    }
  });
});

describe('buildTextFileName', () => {
  it('拡張子を.txtに置き換える', () => {
    expect(buildTextFileName('photo.jpeg')).toBe('photo.txt');
  });
  it('拡張子がなければ付け足す', () => {
    expect(buildTextFileName('photo')).toBe('photo.txt');
  });
  it('ドット始まりのファイル名もそのままベース名にする', () => {
    expect(buildTextFileName('.png')).toBe('.png.txt');
  });
  it('ドットが複数あるときは最後の拡張子だけを置き換える', () => {
    expect(buildTextFileName('my.photo.final.png')).toBe('my.photo.final.txt');
  });
  it('日本語のファイル名もそのまま使う', () => {
    expect(buildTextFileName('写真 2026.jpg')).toBe('写真 2026.txt');
  });
  it('空のファイル名は ascii-art.txt になる', () => {
    expect(buildTextFileName('')).toBe('ascii-art.txt');
  });
});
