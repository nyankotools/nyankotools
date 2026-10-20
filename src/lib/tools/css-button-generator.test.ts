import { describe, expect, it } from 'vitest';
import {
  applicableFields,
  buildPartCode,
  buttonColors,
  clampPart,
  contrastRatio,
  contrastReport,
  DEFAULT_PART,
  escapeHtml,
  normalizeHex,
  PART_KINDS,
  PART_PRESETS,
  pickTextColor,
  shade,
  sizeRange,
  type PartParams,
} from './css-button-generator';

const base = (over: Partial<PartParams>): PartParams => ({
  ...DEFAULT_PART,
  ...over,
});

describe('色ユーティリティ', () => {
  it('normalizeHexは3桁展開・小文字化・不正値フォールバック', () => {
    expect(normalizeHex('#ABC', '#000000')).toBe('#aabbcc');
    expect(normalizeHex('red; } body { x:', '#123456')).toBe('#123456');
    expect(normalizeHex('', '#123456')).toBe('#123456');
  });

  it('shadeは白/黒へ近づける', () => {
    expect(shade('#000000', 0.5)).toBe('#808080');
    expect(shade('#ffffff', -1)).toBe('#000000');
  });

  it('contrastRatioは黒白で21、同色で1', () => {
    expect(contrastRatio('#000000', '#ffffff')).toBe(21);
    expect(contrastRatio('#336699', '#336699')).toBe(1);
  });

  it('pickTextColorは明るい背景で暗い文字、暗い背景で白', () => {
    expect(pickTextColor('#ffff00')).toBe('#111827');
    expect(pickTextColor('#1e3a8a')).toBe('#ffffff');
  });

  it('escapeHtmlは記号をエスケープする', () => {
    expect(escapeHtml(`<a href="x">&'`)).toBe(
      '&lt;a href=&quot;x&quot;&gt;&amp;&#39;',
    );
  });
});

describe('clampPart', () => {
  it('範囲外・不正値を補正する', () => {
    const c = clampPart({
      kind: 'x' as never,
      color: 'url(evil)',
      buttonStyle: 'y' as never,
      hover: 'z' as never,
      radius: 999,
      size: Number.NaN,
      direction: 'w' as never,
      thickness: 0,
      label: '  a\nb  ',
    });
    expect(c).toMatchObject({
      kind: 'button',
      color: DEFAULT_PART.color,
      buttonStyle: 'solid',
      hover: 'none',
      radius: 60,
      size: 12,
      direction: 'right',
      thickness: 1,
      label: 'a b',
    });
  });

  it('サイズは種類ごとの範囲に収める', () => {
    expect(clampPart(base({ kind: 'toggle', size: 5 })).size).toBe(20);
    expect(clampPart(base({ kind: 'triangle', size: 500 })).size).toBe(80);
  });

  it('ラベルは30文字まで', () => {
    expect(clampPart(base({ label: 'x'.repeat(50) })).label).toHaveLength(30);
  });
});

describe('ボタン', () => {
  it('solidの出力にクラス名・色・ホバー・focus-visibleが含まれる', () => {
    const { html, css } = buildPartCode(base({}));
    expect(html).toBe('<button type="button" class="nk-btn">Button</button>');
    expect(css).toContain('.nk-btn {');
    expect(css).toContain('background-color: #2563eb;');
    expect(css).toContain('color: #ffffff;');
    expect(css).toContain('border-radius: 8px;');
    expect(css).toContain('.nk-btn:hover {');
    expect(css).toContain(`background-color: ${shade('#2563eb', -0.15)};`);
    expect(css).toContain('transform: translateY(-2px);');
    expect(css).toContain('.nk-btn:focus-visible {');
    expect(css).toContain('prefers-reduced-motion');
  });

  it('hover=noneなら:hoverブロックを出さない', () => {
    const { css } = buildPartCode(base({ hover: 'none' }));
    expect(css).not.toContain(':hover');
  });

  it('hover=colorならtransformを出さない', () => {
    const { css } = buildPartCode(base({ hover: 'color' }));
    expect(css).toContain(':hover');
    expect(css).not.toContain('translateY');
  });

  it('outlineはホバーで塗りつぶす', () => {
    const col = buttonColors('#2563eb', 'outline');
    expect(col.bg).toBe('#ffffff');
    expect(col.hoverBg).toBe('#2563eb');
  });

  it('ラベルはエスケープされ、空ならデフォルトに戻る', () => {
    expect(buildPartCode(base({ label: '<b>&' })).html).toContain(
      '&lt;b&gt;&amp;',
    );
    expect(buildPartCode(base({ label: '' })).html).toContain('>Button<');
  });

  it('不正な色はCSSに埋め込まれない（インジェクション対策）', () => {
    const { css } = buildPartCode(base({ color: 'red;} body{display:none' }));
    expect(css).not.toContain('body');
    expect(css).not.toContain('display:none');
    expect(css).toContain(DEFAULT_PART.color);
  });
});

describe('トグルスイッチ', () => {
  const p = base({ kind: 'toggle', size: 28, radius: 50, label: 'On' });

  it('checkbox+labelでJS不要の構造になる', () => {
    const { html, css } = buildPartCode(p);
    expect(html).toContain('<label class="nk-toggle">');
    expect(html).toContain('type="checkbox"');
    expect(html).toContain('<span>On</span>');
    expect(css).toContain('.nk-toggle__input:checked + .nk-toggle__track {');
    expect(css).toContain('width: 50px;');
    expect(css).toContain('transform: translateX(22px);');
  });

  it('角丸は高さの半分までに制限される', () => {
    const { css } = buildPartCode(p);
    expect(css).toContain('border-radius: 14px;');
  });

  it('ラベルが空ならaria-labelを付ける', () => {
    const { html } = buildPartCode(base({ kind: 'toggle', label: '' }));
    expect(html).toContain('aria-label="Toggle"');
    expect(html).not.toContain('<span>');
  });

  it('liftを指定しても浮き上がりは出力しない', () => {
    const { css } = buildPartCode(base({ kind: 'toggle', hover: 'lift' }));
    expect(css).not.toContain('translateY(-');
    expect(css).not.toContain(':hover');
  });
});

describe('三角形', () => {
  it.each([
    [
      'up',
      'border-width: 0 20px 35px 20px;',
      'transparent transparent #2563eb transparent',
    ],
    [
      'down',
      'border-width: 35px 20px 0 20px;',
      '#2563eb transparent transparent transparent',
    ],
    [
      'left',
      'border-width: 20px 35px 20px 0;',
      'transparent #2563eb transparent transparent',
    ],
    [
      'right',
      'border-width: 20px 0 20px 35px;',
      'transparent transparent transparent #2563eb',
    ],
  ] as const)('%s 向き', (direction, width, colors) => {
    const { css, html } = buildPartCode(
      base({ kind: 'triangle', size: 40, direction }),
    );
    expect(css).toContain(width);
    expect(css).toContain(`border-color: ${colors};`);
    expect(html).toContain('aria-hidden="true"');
  });

  it('ホバー色は色の辺だけが変わる', () => {
    const { css } = buildPartCode(
      base({ kind: 'triangle', direction: 'up', hover: 'color' }),
    );
    const dark = shade('#2563eb', -0.2);
    expect(css).toContain(
      `border-color: transparent transparent ${dark} transparent;`,
    );
  });
});

describe('矢印', () => {
  it('向きごとに回転角が変わり、太さが反映される', () => {
    const r = buildPartCode(
      base({ kind: 'arrow', direction: 'down', thickness: 5 }),
    );
    expect(r.css).toContain('rotate(135deg)');
    expect(r.css).toContain('border-top: 5px solid #2563eb;');
    const l = buildPartCode(base({ kind: 'arrow', direction: 'left' }));
    expect(l.css).toContain('rotate(225deg)');
  });
});

describe('コントラスト', () => {
  it('標準色のボタンは4.5以上', () => {
    const r = contrastReport(base({}));
    expect(r.threshold).toBe(4.5);
    expect(r.normal).toBeGreaterThanOrEqual(4.5);
    expect(r.hover).not.toBeNull();
  });

  it('ホバーで色が変わらなければhoverはnull', () => {
    expect(contrastReport(base({ hover: 'lift' })).hover).toBeNull();
  });

  it('薄い色の図形は3未満になる', () => {
    const r = contrastReport(base({ kind: 'triangle', color: '#ffff99' }));
    expect(r.threshold).toBe(3);
    expect(r.normal).toBeLessThan(3);
  });
});

describe('定義の整合性', () => {
  it('全種類にサイズ範囲・プリセットがある', () => {
    for (const k of PART_KINDS) {
      const r = sizeRange(k);
      expect(r.min).toBeLessThanOrEqual(r.default);
      expect(r.default).toBeLessThanOrEqual(r.max);
      expect(PART_PRESETS[k].length).toBeGreaterThan(0);
      expect(typeof applicableFields(k).label).toBe('boolean');
    }
  });

  it('全プリセットでCSSが生成できる', () => {
    for (const k of PART_KINDS) {
      for (const pr of PART_PRESETS[k]) {
        const { css, html } = buildPartCode(
          base({ kind: k, size: sizeRange(k).default, ...pr.params }),
        );
        expect(css).toContain('.nk-');
        expect(html).toContain('nk-');
      }
    }
  });
});
