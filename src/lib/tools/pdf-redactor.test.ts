import { describe, it, expect } from 'vitest';
import {
  countRedactedPages,
  countRects,
  MIN_RECT_SIZE,
  rectFromPoints,
  rectToPixels,
  redactedFileName,
} from './pdf-redactor';

describe('rectFromPoints', () => {
  it('始点・終点の順序によらず同じ矩形になる', () => {
    const a = rectFromPoints(0.2, 0.3, 0.6, 0.5)!;
    const b = rectFromPoints(0.6, 0.5, 0.2, 0.3)!;
    expect(a).toEqual(b);
    expect(a.x).toBeCloseTo(0.2);
    expect(a.y).toBeCloseTo(0.3);
    expect(a.w).toBeCloseTo(0.4);
    expect(a.h).toBeCloseTo(0.2);
  });

  it('ページ外にはみ出した部分は切り詰める', () => {
    const r = rectFromPoints(-0.5, 0.5, 1.5, 2)!;
    expect(r).toEqual({ x: 0, y: 0.5, w: 1, h: 0.5 });
  });

  it('小さすぎる矩形は null', () => {
    expect(rectFromPoints(0.5, 0.5, 0.5, 0.5)).toBeNull();
    expect(rectFromPoints(0.5, 0.5, 0.5 + MIN_RECT_SIZE / 2, 0.9)).toBeNull();
  });

  it('ページ外だけを指す矩形は null', () => {
    expect(rectFromPoints(1.2, 0.2, 1.8, 0.8)).toBeNull();
  });
});

describe('rectToPixels', () => {
  it('ピクセルに変換する', () => {
    expect(rectToPixels({ x: 0.1, y: 0.2, w: 0.5, h: 0.25 }, 200, 400)).toEqual(
      { x: 20, y: 80, w: 100, h: 100 },
    );
  });

  it('小数は外側へ丸めて隙間を作らない', () => {
    const p = rectToPixels({ x: 0.105, y: 0.105, w: 0.1, h: 0.1 }, 100, 100);
    expect(p).toEqual({ x: 10, y: 10, w: 11, h: 11 });
  });

  it('右端・下端はキャンバスを超えない', () => {
    const p = rectToPixels({ x: 0.5, y: 0.5, w: 0.5, h: 0.5 }, 99, 99);
    expect(p.x + p.w).toBe(99);
    expect(p.y + p.h).toBe(99);
  });
});

describe('集計', () => {
  const pages = [
    [{ x: 0, y: 0, w: 0.1, h: 0.1 }],
    [],
    [
      { x: 0, y: 0, w: 0.1, h: 0.1 },
      { x: 0.5, y: 0.5, w: 0.1, h: 0.1 },
    ],
  ];
  it('黒塗り箇所の合計', () => {
    expect(countRects(pages)).toBe(3);
    expect(countRects([])).toBe(0);
  });
  it('黒塗りのあるページ数', () => {
    expect(countRedactedPages(pages)).toBe(2);
  });
});

describe('redactedFileName', () => {
  it('末尾に _redacted を付ける', () => {
    expect(redactedFileName('doc.pdf')).toBe('doc_redacted.pdf');
    expect(redactedFileName('DOC.PDF')).toBe('DOC_redacted.pdf');
  });
  it('拡張子なし・空でも既定名にする', () => {
    expect(redactedFileName('doc')).toBe('doc_redacted.pdf');
    expect(redactedFileName('.pdf')).toBe('document_redacted.pdf');
  });
});
