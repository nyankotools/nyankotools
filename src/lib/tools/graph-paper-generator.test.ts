import { describe, it, expect } from 'vitest';
import {
  buildSvg,
  DEFAULT_OPTIONS,
  layoutSheet,
  paperDimensions,
  validateOptions,
  type SheetOptions,
} from './graph-paper-generator';

const opts = (o: Partial<SheetOptions> = {}): SheetOptions => ({
  ...DEFAULT_OPTIONS,
  ...o,
});

describe('paperDimensions', () => {
  it('A4 縦・横', () => {
    expect(paperDimensions('a4', 'portrait')).toEqual({
      widthMm: 210,
      heightMm: 297,
    });
    expect(paperDimensions('a4', 'landscape')).toEqual({
      widthMm: 297,
      heightMm: 210,
    });
  });
});

describe('validateOptions', () => {
  it('既定値は有効', () => {
    expect(validateOptions(DEFAULT_OPTIONS)).toBeNull();
  });
  it('範囲外・非数・不正な色を弾く', () => {
    expect(validateOptions(opts({ cellMm: 1 }))).toBe('cell');
    expect(validateOptions(opts({ cellMm: 51 }))).toBe('cell');
    expect(validateOptions(opts({ cellMm: NaN }))).toBe('cell');
    expect(validateOptions(opts({ marginMm: -1 }))).toBe('margin');
    expect(validateOptions(opts({ lineWidthMm: 0 }))).toBe('lineWidth');
    expect(validateOptions(opts({ color: 'red' }))).toBe('color');
    expect(validateOptions(opts({ color: '#12345"><script>' }))).toBe('color');
  });
  it('最大の余白・マスでも最小の用紙に1マス以上収まる', () => {
    const s = layoutSheet(opts({ paper: 'a5', cellMm: 50, marginMm: 40 }));
    expect(s.columns).toBeGreaterThanOrEqual(1);
    expect(s.rows).toBeGreaterThanOrEqual(1);
  });
  it('境界値は有効', () => {
    expect(validateOptions(opts({ cellMm: 2, marginMm: 0 }))).toBeNull();
    expect(validateOptions(opts({ cellMm: 50, lineWidthMm: 1 }))).toBeNull();
  });
});

describe('layoutSheet', () => {
  it('A4・5mm・余白10mm: 38×55 マス', () => {
    const s = layoutSheet(opts());
    expect(s.columns).toBe(38);
    expect(s.rows).toBe(55);
    // 190mm ちょうど / 277mm は 275mm 分だけ使い、残りは中央寄せ
    expect(s.originX).toBe(10);
    expect(s.originY).toBe(11);
  });
  it('小数のマス寸法でも浮動小数点誤差で1マス減らない', () => {
    // 190 / 0.5 = 380
    expect(layoutSheet(opts({ cellMm: 2.5 })).columns).toBe(76);
    expect(layoutSheet(opts({ cellMm: 3.8 })).columns).toBe(50);
  });
});

describe('buildSvg', () => {
  it('方眼: 縦線・横線を1本のpathにまとめる', () => {
    const svg = buildSvg(opts({ paper: 'a5', cellMm: 10, marginMm: 14 }));
    expect(svg).toContain('viewBox="0 0 148 210"');
    expect(svg).toContain('width="148mm"');
    expect((svg.match(/<path /g) ?? []).length).toBe(1);
    // 12列×18行: 縦線13本+横線19本
    expect((svg.match(/M/g) ?? []).length).toBe(13 + 19);
  });
  it('罫線は横線のみ', () => {
    const svg = buildSvg(opts({ type: 'ruled', cellMm: 10 }));
    expect(svg).not.toContain('V');
    expect(svg).toContain('H');
  });
  it('ドット方眼は circle で描く', () => {
    const svg = buildSvg(opts({ type: 'dot', paper: 'a5', cellMm: 20 }));
    expect(svg).toContain('<circle');
    expect(svg).not.toContain('<path');
  });
  it('原稿用紙風は太い外枠の rect を含む', () => {
    const svg = buildSvg(opts({ type: 'manuscript', lineWidthMm: 0.2 }));
    expect(svg).toContain('stroke-width="0.4"');
  });
  it('罫線は行数+1本の横線になる（A5・10mm・余白10mm: 19行→横線20本）', () => {
    // A5 縦 148×210, 余白10mm → 高さ190mm → 19行 → 横線20本
    const svg = buildSvg(
      opts({ paper: 'a5', type: 'ruled', cellMm: 10, marginMm: 10 }),
    );
    expect((svg.match(/M/g) ?? []).length).toBe(20);
  });
  it('ドット方眼は（列+1）×（行+1）個の点を描く', () => {
    // A5 縦・余白10mm・10mm: 列12（128/10）、行19（190/10）
    const svg = buildSvg(
      opts({ paper: 'a5', type: 'dot', cellMm: 10, marginMm: 10 }),
    );
    expect((svg.match(/<circle /g) ?? []).length).toBe(13 * 20);
  });
  it('ドット半径は線の太さの1.5倍（最小0.15mm）', () => {
    const thin = buildSvg(opts({ type: 'dot', cellMm: 20, lineWidthMm: 0.05 }));
    expect(thin).toContain('r="0.15"');
    const thick = buildSvg(opts({ type: 'dot', cellMm: 20, lineWidthMm: 0.4 }));
    expect(thick).toContain('r="0.6"');
  });
  it('原稿用紙の外枠はマスの範囲と一致する', () => {
    const svg = buildSvg(
      opts({ paper: 'a5', type: 'manuscript', cellMm: 10, marginMm: 14 }),
    );
    // 12列×18行 → 120×180 の外枠
    expect(svg).toMatch(/<rect x="14" y="15" width="120" height="180"/);
  });
  it('指定した色が線（stroke）と点（fill）に反映される', () => {
    expect(buildSvg(opts({ color: '#ff0000' }))).toContain('stroke="#ff0000"');
    expect(buildSvg(opts({ type: 'dot', color: '#00ff00' }))).toContain(
      '<g fill="#00ff00">',
    );
  });
  it('大きな用紙・細いマスでも妥当なSVGになる（A3・2mm）', () => {
    const svg = buildSvg(opts({ paper: 'a3', cellMm: 2 }));
    // 138列×200行 → 縦線139本+横線201本
    expect((svg.match(/M/g) ?? []).length).toBe(139 + 201);
    expect(svg.startsWith('<svg')).toBe(true);
    expect(svg.endsWith('</svg>')).toBe(true);
  });
});

describe('追加の境界・入力検証', () => {
  it('横向きのA4は幅と高さが入れ替わり、マス数も変わる', () => {
    expect(paperDimensions('a4', 'landscape')).toEqual({
      widthMm: 297,
      heightMm: 210,
    });
    // 297-20=277 → 55列、210-20=190 → 38行（5mm）
    const s = layoutSheet(opts({ orientation: 'landscape' }));
    expect(s.columns).toBe(55);
    expect(s.rows).toBe(38);
  });
  it('Letter は 215.9×279.4mm', () => {
    expect(paperDimensions('letter', 'portrait')).toEqual({
      widthMm: 215.9,
      heightMm: 279.4,
    });
  });
  it('余白0mmでは用紙全体にマスを敷き詰め、端数は中央寄せ', () => {
    const s = layoutSheet(opts({ marginMm: 0 }));
    // 210/5=42列、297/5=59.4→59行、残り2mmを上下1mmずつ
    expect(s.columns).toBe(42);
    expect(s.rows).toBe(59);
    expect(s.originX).toBe(0);
    expect(s.originY).toBe(1);
  });
  it('上限・下限の境界（マス50・余白40・線幅1）は有効、その外は無効', () => {
    expect(validateOptions(opts({ cellMm: 50, marginMm: 40 }))).toBeNull();
    expect(validateOptions(opts({ marginMm: 41 }))).toBe('margin');
    expect(validateOptions(opts({ cellMm: 50.5 }))).toBe('cell');
    expect(validateOptions(opts({ lineWidthMm: 0.05 }))).toBeNull();
    expect(validateOptions(opts({ lineWidthMm: 1.01 }))).toBe('lineWidth');
  });
  it('色は #rrggbb のみ有効（大文字可、#なし・3桁は無効）', () => {
    expect(validateOptions(opts({ color: '#ABCDEF' }))).toBeNull();
    expect(validateOptions(opts({ color: 'ABCDEF' }))).toBe('color');
    expect(validateOptions(opts({ color: '#abc' }))).toBe('color');
    expect(validateOptions(opts({ color: '' }))).toBe('color');
  });
  it('数値が Infinity・NaN の線幅・余白は無効', () => {
    expect(validateOptions(opts({ lineWidthMm: NaN }))).toBe('lineWidth');
    expect(validateOptions(opts({ marginMm: Infinity }))).toBe('margin');
  });
});
