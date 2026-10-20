import { describe, expect, it } from 'vitest';
import {
  DEFAULT_OUTPUT_WIDTH,
  DEVICE_DEFAULT_COLORS,
  DEVICE_TYPES,
  MAX_OUTPUT_WIDTH,
  MIN_OUTPUT_WIDTH,
  fitImage,
  mockupFileName,
  planMockup,
  supportsOrientation,
  type DeviceType,
  type MockupOptions,
} from './device-mockup';

function opts(
  device: DeviceType,
  extra: Partial<MockupOptions> = {},
): MockupOptions {
  return {
    device,
    landscape: false,
    fit: 'cover',
    bodyColor: DEVICE_DEFAULT_COLORS[device],
    transparentBackground: true,
    backgroundColor: '#ffffff',
    shadow: false,
    padding: 0,
    outputWidth: 1000,
    ...extra,
  };
}

const src = { width: 1170, height: 2532 };

describe('fitImage', () => {
  it('coverは画面の比率で中央を切り抜く', () => {
    const d = fitImage(
      { width: 200, height: 100 },
      { x: 10, y: 20, width: 50, height: 100 },
      'cover',
    );
    expect(d.sh).toBe(100);
    expect(d.sw).toBe(50);
    expect(d.sx).toBe(75);
    expect(d.sy).toBe(0);
    expect(d).toMatchObject({ dx: 10, dy: 20, dw: 50, dh: 100 });
  });
  it('coverで縦長の元画像は上下を切る', () => {
    const d = fitImage(
      { width: 100, height: 400 },
      { x: 0, y: 0, width: 100, height: 100 },
      'cover',
    );
    expect(d.sw).toBe(100);
    expect(d.sh).toBe(100);
    expect(d.sy).toBe(150);
  });
  it('containは全体を収めて中央に置く', () => {
    const d = fitImage(
      { width: 200, height: 100 },
      { x: 0, y: 0, width: 100, height: 100 },
      'contain',
    );
    expect(d).toMatchObject({ sx: 0, sy: 0, sw: 200, sh: 100 });
    expect(d.dw).toBe(100);
    expect(d.dh).toBe(50);
    expect(d.dy).toBe(25);
  });
  it('寸法0でも例外にならない', () => {
    const d = fitImage(
      { width: 0, height: 0 },
      { x: 0, y: 0, width: 10, height: 10 },
      'cover',
    );
    expect(Number.isFinite(d.sw)).toBe(true);
  });
});

describe('planMockup', () => {
  it('どのデバイスでも出力幅と一致し、画面が出力内に収まる', () => {
    for (const device of DEVICE_TYPES) {
      const plan = planMockup(src, opts(device, { padding: 8 }));
      expect(plan.canvas.width).toBe(1000);
      expect(plan.canvas.height).toBeGreaterThan(0);
      const s = plan.screen;
      expect(s.x).toBeGreaterThan(0);
      expect(s.y).toBeGreaterThan(0);
      expect(s.x + s.width).toBeLessThan(plan.canvas.width);
      expect(s.y + s.height).toBeLessThan(plan.canvas.height);
      expect(plan.shapes.length).toBeGreaterThan(1);
    }
  });
  it('スマホは縦長で、横向きにすると縦横が入れ替わる', () => {
    const portrait = planMockup(src, opts('phone'));
    const land = planMockup(src, opts('phone', { landscape: true }));
    expect(portrait.canvas.height).toBeGreaterThan(portrait.canvas.width);
    expect(land.canvas.width).toBe(1000);
    expect(land.canvas.height).toBeLessThan(land.canvas.width);
    expect(land.screen.width).toBeGreaterThan(land.screen.height);
  });
  it('ノートPCとブラウザは横向き指定を無視する', () => {
    expect(supportsOrientation('laptop')).toBe(false);
    expect(planMockup(src, opts('laptop', { landscape: true }))).toEqual(
      planMockup(src, opts('laptop')),
    );
  });
  it('余白を増やすと画面が小さくなる', () => {
    const a = planMockup(src, opts('tablet', { padding: 0 }));
    const b = planMockup(src, opts('tablet', { padding: 15 }));
    expect(b.screen.width).toBeLessThan(a.screen.width);
    expect(b.canvas.height).toBeGreaterThan(0);
  });
  it('背景は透明なら null、そうでなければ指定色', () => {
    expect(planMockup(src, opts('phone')).background).toBeNull();
    expect(
      planMockup(
        src,
        opts('phone', {
          transparentBackground: false,
          backgroundColor: '#ff0000',
        }),
      ).background,
    ).toBe('#ff0000');
    expect(
      planMockup(
        src,
        opts('phone', {
          transparentBackground: false,
          backgroundColor: 'oops',
        }),
      ).background,
    ).toBe('#ffffff');
  });
  it('影はオンのときだけ付く', () => {
    const off = planMockup(src, opts('laptop'));
    expect(off.shadow).toBeNull();
    expect(off.shadowShapes).toEqual([]);
    const on = planMockup(src, opts('laptop', { shadow: true }));
    expect(on.shadow?.blur).toBeGreaterThan(0);
    expect(on.shadowShapes.length).toBe(2);
  });
  it('出力幅は範囲に丸められ、不正値は既定値になる', () => {
    expect(
      planMockup(src, opts('phone', { outputWidth: 10 })).canvas.width,
    ).toBe(MIN_OUTPUT_WIDTH);
    expect(
      planMockup(src, opts('phone', { outputWidth: 99999 })).canvas.width,
    ).toBe(MAX_OUTPUT_WIDTH);
    expect(
      planMockup(src, opts('phone', { outputWidth: NaN })).canvas.width,
    ).toBe(DEFAULT_OUTPUT_WIDTH);
  });
  it('不正な本体色でも落ちない', () => {
    const plan = planMockup(src, opts('browser', { bodyColor: 'zzz' }));
    expect(plan.shapes[1].color).toBe('#111827');
  });
  it('画像の描画先は画面と一致する（cover）', () => {
    const plan = planMockup(src, opts('phone'));
    expect(plan.image.dx).toBe(plan.screen.x);
    expect(plan.image.dw).toBe(plan.screen.width);
  });
});

describe('mockupFileName', () => {
  it('拡張子をpngに置き換えて -mockup を付ける', () => {
    expect(mockupFileName('shot.jpeg')).toBe('shot-mockup.png');
    expect(mockupFileName('a.b.webp')).toBe('a.b-mockup.png');
  });
  it('名前がなければ screenshot', () => {
    expect(mockupFileName(null)).toBe('screenshot-mockup.png');
    expect(mockupFileName('.png')).toBe('screenshot-mockup.png');
  });
});
