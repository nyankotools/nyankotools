import { describe, expect, it } from 'vitest';
import {
  byteLength,
  defaultSvgOptimizeOptions,
  optimizeSvg,
} from './svg-optimizer';

const sample = `<?xml version="1.0" encoding="UTF-8"?>
<!-- comment -->
<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100">
  <metadata>junk</metadata>
  <rect x="10.000000" y="10.000000" width="80" height="80" fill="#ff0000"/>
</svg>`;

describe('optimizeSvg', () => {
  it('コメント・メタデータを削除してサイズを減らす', () => {
    const r = optimizeSvg(sample);
    expect(r.success).toBe(true);
    if (!r.success) return;
    expect(r.output).not.toContain('comment');
    expect(r.output).not.toContain('metadata');
    expect(r.optimizedBytes).toBeLessThan(r.originalBytes);
    expect(r.savedPercent).toBeGreaterThan(0);
    expect(r.originalBytes).toBe(byteLength(sample));
  });

  it('removeDimensionsでwidth/heightを削除する', () => {
    const r = optimizeSvg(sample, {
      ...defaultSvgOptimizeOptions,
      removeDimensions: true,
    });
    expect(r.success).toBe(true);
    if (!r.success) return;
    expect(r.output).toContain('viewBox');
    expect(r.output).not.toMatch(/<svg[^>]* width=/);
  });

  it('prettyで改行を含む出力になる', () => {
    const r = optimizeSvg(sample, {
      ...defaultSvgOptimizeOptions,
      pretty: true,
    });
    expect(r.success && r.output.includes('\n')).toBe(true);
  });

  it('空入力はemptyエラー', () => {
    expect(optimizeSvg('  ')).toEqual({ success: false, error: 'empty' });
  });

  it('不正なSVGはinvalidエラー', () => {
    expect(optimizeSvg('<svg><rect></svg>')).toEqual({
      success: false,
      error: 'invalid',
    });
  });

  it('マルチバイト文字をバイト数で数える', () => {
    expect(byteLength('あ')).toBe(3);
  });
});
