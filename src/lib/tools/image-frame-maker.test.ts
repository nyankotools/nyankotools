import { describe, expect, it } from 'vitest';
import {
  FRAME_PRESETS,
  PRESET_DEFAULTS,
  clampNumber,
  framedFileName,
  hexToRgba,
  isWithinLimit,
  parseHex,
  planFrame,
  shadeColor,
  thicknessPx,
  type FrameOptions,
  type FramePreset,
} from './image-frame-maker';

function opts(preset: FramePreset, extra: Partial<FrameOptions> = {}) {
  return {
    preset,
    ...PRESET_DEFAULTS[preset],
    transparentBackground: false,
    ...extra,
  } satisfies FrameOptions;
}

describe('thicknessPx', () => {
  it('短辺に対する%をpxにする', () => {
    expect(thicknessPx({ width: 400, height: 200 }, 10)).toBe(20);
  });
  it('最低1pxで、範囲外や不正値は丸める', () => {
    expect(thicknessPx({ width: 10, height: 10 }, 1)).toBe(1);
    expect(thicknessPx({ width: 100, height: 100 }, 999)).toBe(30);
    expect(thicknessPx({ width: 100, height: 100 }, NaN)).toBe(1);
  });
});

describe('色の補助関数', () => {
  it('parseHexは3桁・6桁を読み、不正値はnull', () => {
    expect(parseHex('#fff')).toEqual([255, 255, 255]);
    expect(parseHex('#8b5a2b')).toEqual([139, 90, 43]);
    expect(parseHex('red')).toBeNull();
  });
  it('shadeColorで暗く・明るくできる', () => {
    expect(shadeColor('#ffffff', -0.5)).toBe('#808080');
    expect(shadeColor('#000000', 1)).toBe('#ffffff');
    expect(shadeColor('zzz', 0)).toBe('#000000');
  });
  it('hexToRgba', () => {
    expect(hexToRgba('#000000', 0.45)).toBe('rgba(0, 0, 0, 0.45)');
    expect(hexToRgba('nope', 2)).toBe('rgba(0, 0, 0, 1)');
  });
  it('clampNumber', () => {
    expect(clampNumber(5, 0, 3)).toBe(3);
    expect(clampNumber(NaN, 0, 3, 2)).toBe(2);
  });
});

describe('planFrame', () => {
  const src = { width: 200, height: 100 };

  it('シンプル枠は四方に同じ太さを足す', () => {
    const p = planFrame(src, opts('simple', { thickness: 10 }));
    expect(p.border).toEqual({ top: 10, right: 10, bottom: 10, left: 10 });
    expect(p.canvas).toEqual({ width: 220, height: 120 });
    expect(p.image).toEqual({ x: 10, y: 10, width: 200, height: 100 });
    expect(p.ops).toHaveLength(1);
    expect(p.imageRadius).toBe(0);
  });

  it('ポラロイドは下だけ広い', () => {
    const p = planFrame(src, opts('polaroid', { thickness: 10 }));
    expect(p.border.top).toBe(10);
    expect(p.border.bottom).toBe(32);
    expect(p.canvas).toEqual({ width: 220, height: 142 });
    expect(p.image.y).toBe(10);
  });

  it('二重枠は外線・地・内線の3枚を重ねる', () => {
    const p = planFrame(src, opts('double', { thickness: 10 }));
    expect(p.ops).toHaveLength(3);
    expect(p.ops[0].color).toBe(PRESET_DEFAULTS.double.accent);
    expect(p.ops[1].color).toBe(PRESET_DEFAULTS.double.color);
    expect(p.ops[1].x).toBe(2);
    expect(p.ops[2].x).toBe(8);
    expect(p.ops[2].color).toBe(PRESET_DEFAULTS.double.accent);
  });

  it('額縁風は枠・縁・マット・内側の影線を重ねる', () => {
    const p = planFrame(src, opts('frame', { thickness: 20 }));
    expect(p.ops).toHaveLength(4);
    expect(p.ops[2].color).toBe(PRESET_DEFAULTS.frame.accent);
    expect(p.ops[2].x).toBe(14);
    expect(p.ops[3].x).toBe(18);
    // どの塗りも画像の外側に収まる
    for (const op of p.ops) {
      expect(op.x).toBeLessThanOrEqual(p.image.x);
    }
  });

  it('角丸は外側の半径と、画像の半径（半径-太さ）を返す', () => {
    const p = planFrame(src, opts('rounded', { thickness: 10, radius: 20 }));
    // 出力の短辺120 * 20% = 24
    expect(p.outerRadius).toBe(24);
    expect(p.ops[0].radius).toBe(24);
    expect(p.imageRadius).toBe(14);
  });

  it('角丸は出力の短辺の半分までに収まる', () => {
    const p = planFrame(src, opts('rounded', { thickness: 10, radius: 50 }));
    expect(p.outerRadius).toBe(60);
    const p2 = planFrame(src, opts('rounded', { radius: 9999 }));
    expect(p2.outerRadius).toBeLessThanOrEqual(
      Math.floor(Math.min(p2.canvas.width, p2.canvas.height) / 2),
    );
  });

  it('影付きは影の指定を返し、透明背景なら背景を塗らない', () => {
    const p = planFrame(src, opts('shadow', { thickness: 20 }));
    expect(p.shadow).toEqual({
      blur: 10,
      offsetY: 5,
      color: 'rgba(0, 0, 0, 0.45)',
    });
    expect(p.ops).toHaveLength(1);
    const t = planFrame(
      src,
      opts('shadow', { thickness: 20, transparentBackground: true }),
    );
    expect(t.ops).toHaveLength(0);
    expect(t.canvas).toEqual({ width: 240, height: 140 });
  });

  it('影以外のプリセットは影を持たない', () => {
    for (const preset of FRAME_PRESETS) {
      if (preset !== 'shadow') {
        expect(planFrame(src, opts(preset)).shadow).toBeNull();
      }
    }
  });

  it('極小の画像でも壊れない', () => {
    for (const preset of FRAME_PRESETS) {
      const p = planFrame(
        { width: 1, height: 1 },
        opts(preset, { radius: 50 }),
      );
      expect(p.canvas.width).toBeGreaterThanOrEqual(3);
      for (const op of p.ops) {
        expect(op.width).toBeGreaterThan(0);
        expect(op.height).toBeGreaterThan(0);
        expect(op.radius).toBeGreaterThanOrEqual(0);
      }
    }
  });

  it('全プリセットで画像が出力内に収まる', () => {
    for (const preset of FRAME_PRESETS) {
      const p = planFrame(src, opts(preset));
      expect(p.image.x + p.image.width + p.border.right).toBe(p.canvas.width);
      expect(p.image.y + p.image.height + p.border.bottom).toBe(
        p.canvas.height,
      );
    }
  });
});

describe('isWithinLimit', () => {
  it('上限を超える出力を弾く', () => {
    expect(isWithinLimit({ width: 4000, height: 3000 })).toBe(true);
    expect(isWithinLimit({ width: 16385, height: 10 })).toBe(false);
  });
});

describe('framedFileName', () => {
  it('拡張子を置き換えて -framed を付ける', () => {
    expect(framedFileName('photo.jpeg', 'png')).toBe('photo-framed.png');
    expect(framedFileName('a.b.png', 'jpeg')).toBe('a.b-framed.jpg');
    expect(framedFileName(null, 'webp')).toBe('image-framed.webp');
    expect(framedFileName('', 'png')).toBe('image-framed.png');
  });
});
