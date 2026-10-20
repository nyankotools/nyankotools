import { describe, expect, it } from 'vitest';
import {
  DEFAULT_PATTERN,
  PATTERN_PRESETS,
  applicableFields,
  buildPattern,
  clampPattern,
  normalizeHex,
  svgToDataUri,
  type PatternParams,
} from './css-pattern-background';

const base = (over: Partial<PatternParams> = {}): PatternParams => ({
  ...DEFAULT_PATTERN,
  ...over,
});

describe('normalizeHex', () => {
  it('3桁を6桁にし、小文字化する', () => {
    expect(normalizeHex('#ABC', '#000000')).toBe('#aabbcc');
    expect(normalizeHex('FF0000', '#000000')).toBe('#ff0000');
  });
  it('不正値は fallback', () => {
    expect(normalizeHex('red;}', '#123456')).toBe('#123456');
    expect(normalizeHex('', '#123456')).toBe('#123456');
  });
});

describe('clampPattern', () => {
  it('範囲外を補正する', () => {
    const p = clampPattern(base({ size: 1, ratio: 99, angle: -45 }));
    expect(p.size).toBe(4);
    expect(p.ratio).toBe(90);
    expect(p.angle).toBe(315);
  });
  it('NaNや不正な種類・色を既定値にする', () => {
    const p = clampPattern({
      kind: 'x' as never,
      baseColor: 'zzz',
      patternColor: '#fff',
      size: NaN,
      angle: NaN,
      ratio: NaN,
    });
    expect(p.kind).toBe('stripe');
    expect(p.baseColor).toBe('#ffffff');
    expect(p.patternColor).toBe('#ffffff');
    expect(p.size).toBe(4);
    expect(p.angle).toBe(0);
  });
  it('角度は360で一周する', () => {
    expect(clampPattern(base({ angle: 405 })).angle).toBe(45);
  });
});

describe('buildPattern', () => {
  it('ストライプはrepeating-linear-gradientになる', () => {
    const r = buildPattern(base({ size: 20, ratio: 50, angle: 45 }));
    expect(r.css).toContain(
      'repeating-linear-gradient(45deg, #2563eb 0 10px, #ffffff 10px 20px)',
    );
    expect(r.css).toContain('background-color: #ffffff;');
    expect(r.css).not.toContain('background-size');
  });
  it('ストライプの太さはタイル未満・1px以上に収まる', () => {
    expect(buildPattern(base({ size: 4, ratio: 10 })).css).toContain('0 1px');
    expect(buildPattern(base({ size: 4, ratio: 90 })).css).toContain('0 3px');
  });
  it('ドットはradial-gradientとbackground-sizeを出す', () => {
    const r = buildPattern(base({ kind: 'dot', size: 20, ratio: 50 }));
    expect(r.css).toContain(
      'radial-gradient(circle, #2563eb 5px, #ffffff 6px)',
    );
    expect(r.css).toContain('background-size: 20px 20px;');
  });
  it('チェックは1マスの2倍のタイルになる', () => {
    const r = buildPattern(base({ kind: 'check', size: 16 }));
    expect(r.css).toContain('conic-gradient(');
    expect(r.css).toContain('background-size: 32px 32px;');
    expect(r.svg).toContain("width='32' height='32'");
  });
  it('SVGは角度に応じてpatternTransformを持つ', () => {
    expect(buildPattern(base({ angle: 90 })).svg).not.toContain(
      'patternTransform',
    );
    expect(buildPattern(base({ angle: 45 })).svg).toContain(
      "patternTransform='rotate(315)'",
    );
    expect(buildPattern(base({ angle: 0 })).svg).toContain('rotate(270)');
  });
  it('ドットのSVGは円を含む', () => {
    const r = buildPattern(base({ kind: 'dot', size: 10, ratio: 40 }));
    expect(r.svg).toContain("<circle cx='5' cy='5' r='2'");
  });
  it('data URIには生の < > # " が残らない', () => {
    const r = buildPattern(base());
    const body = r.svgDataUri.replace('data:image/svg+xml,', '');
    expect(body).not.toMatch(/[<>#"]/);
    expect(body).toContain('%23');
    expect(r.svgCss).toMatch(/^background-image: url\("data:image\/svg\+xml,/);
    expect(r.svgCss.endsWith('");')).toBe(true);
  });
  it('不正な色はCSS/SVGに混入しない', () => {
    const r = buildPattern(
      base({
        patternColor: 'red;} body{display:none',
        baseColor: '"><script>',
      }),
    );
    expect(r.css).not.toContain('body');
    expect(r.svg).not.toContain('script');
    expect(r.css).toContain('#2563eb');
  });
  it('プリセットはすべて有効な出力になる', () => {
    for (const preset of PATTERN_PRESETS) {
      const r = buildPattern(base(preset.params));
      expect(r.css).toContain('background-image:');
      expect(r.svg.startsWith('<svg')).toBe(true);
    }
  });
});

describe('svgToDataUri', () => {
  it('空白を詰め、二重引用符を単一引用符にする', () => {
    expect(svgToDataUri('<svg a="1">\n  <g/>\n</svg>')).toBe(
      "data:image/svg+xml,%3Csvg a='1'%3E%3Cg/%3E%3C/svg%3E",
    );
  });
  it('%を先にエスケープする', () => {
    expect(svgToDataUri("<svg width='100%'/>")).toContain('100%25');
  });
});

describe('applicableFields', () => {
  it('種類ごとに表示項目が変わる', () => {
    expect(applicableFields('stripe')).toEqual({ angle: true, ratio: true });
    expect(applicableFields('dot')).toEqual({ angle: false, ratio: true });
    expect(applicableFields('check')).toEqual({ angle: false, ratio: false });
  });
});
