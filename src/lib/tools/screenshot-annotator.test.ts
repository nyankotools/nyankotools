import { describe, expect, it } from 'vitest';
import {
  addAnnotation,
  arrowHeadPoints,
  badgeRadius,
  buildOutputFileName,
  clampLineWidth,
  clientToImagePoint,
  defaultLineWidth,
  estimateTextWidth,
  formatFileSize,
  hitTest,
  isAcceptedImageFile,
  MAX_ANNOTATIONS,
  MAX_LINE_WIDTH,
  nextBadgeNumber,
  normalizeRect,
  normalizeText,
  removeAnnotation,
  undoAnnotation,
  type Annotation,
} from './screenshot-annotator';

const base = { color: '#ff0000', lineWidth: 4 };
const badge = (x: number, y: number, number: number): Annotation => ({
  ...base,
  kind: 'badge',
  center: { x, y },
  number,
});

describe('clampLineWidth / defaultLineWidth', () => {
  it('範囲内に丸める', () => {
    expect(clampLineWidth(0)).toBe(1);
    expect(clampLineWidth(999)).toBe(MAX_LINE_WIDTH);
    expect(clampLineWidth(4.6)).toBe(5);
    expect(clampLineWidth(NaN)).toBe(1);
  });
  it('画像幅に応じて太くなる', () => {
    expect(defaultLineWidth(375)).toBe(3);
    expect(defaultLineWidth(3000)).toBe(10);
    expect(defaultLineWidth(0)).toBe(4);
  });
});

describe('clientToImagePoint', () => {
  const bounds = { left: 10, top: 20, width: 100, height: 50 };
  it('表示サイズから画像座標へ変換する', () => {
    expect(
      clientToImagePoint(60, 45, bounds, { width: 1000, height: 500 }),
    ).toEqual({ x: 500, y: 250 });
  });
  it('範囲外はクランプし、サイズ0でも落ちない', () => {
    expect(
      clientToImagePoint(0, 999, bounds, { width: 1000, height: 500 }),
    ).toEqual({ x: 0, y: 500 });
    expect(
      clientToImagePoint(
        1,
        1,
        { ...bounds, width: 0 },
        { width: 10, height: 10 },
      ),
    ).toEqual({ x: 0, y: 0 });
  });
});

describe('normalizeRect', () => {
  it('逆方向のドラッグでも正規化する', () => {
    expect(normalizeRect({ x: 50, y: 40 }, { x: 10, y: 10 })).toEqual({
      x: 10,
      y: 10,
      width: 40,
      height: 30,
    });
  });
  it('小さすぎるドラッグは null', () => {
    expect(normalizeRect({ x: 5, y: 5 }, { x: 6, y: 6 })).toBeNull();
  });
  it('片方向に十分長ければ有効', () => {
    expect(normalizeRect({ x: 0, y: 0 }, { x: 100, y: 1 })).not.toBeNull();
  });
});

describe('arrowHeadPoints', () => {
  it('右向きの矢印の頭を計算する', () => {
    const h = arrowHeadPoints({ x: 0, y: 0 }, { x: 100, y: 0 }, 5)!;
    expect(h.tip).toEqual({ x: 100, y: 0 });
    expect(h.base.x).toBeCloseTo(80);
    expect(h.base.y).toBeCloseTo(0);
    expect(h.left.x).toBeCloseTo(80);
    expect(Math.abs(h.left.y)).toBeCloseTo(10);
    expect(h.right.y).toBeCloseTo(-h.left.y);
  });
  it('短い矢印では頭が全長の半分を超えない', () => {
    const h = arrowHeadPoints({ x: 0, y: 0 }, { x: 10, y: 0 }, 20)!;
    expect(h.base.x).toBeCloseTo(5);
  });
  it('長さがほぼ0なら null', () => {
    expect(arrowHeadPoints({ x: 1, y: 1 }, { x: 2, y: 1 }, 4)).toBeNull();
  });
  it('斜めでも左右対称', () => {
    const h = arrowHeadPoints({ x: 0, y: 0 }, { x: 60, y: 80 }, 4)!;
    const mid = {
      x: (h.left.x + h.right.x) / 2,
      y: (h.left.y + h.right.y) / 2,
    };
    expect(mid.x).toBeCloseTo(h.base.x);
    expect(mid.y).toBeCloseTo(h.base.y);
  });
});

describe('連番', () => {
  it('バッジ数 + 1 を返す', () => {
    expect(nextBadgeNumber([])).toBe(1);
    const list = [
      badge(0, 0, 1),
      { ...base, kind: 'rect', rect: { x: 0, y: 0, width: 5, height: 5 } },
      badge(10, 10, 2),
    ] as Annotation[];
    expect(nextBadgeNumber(list)).toBe(3);
  });
  it('途中のバッジを消すと振り直される', () => {
    const list = [badge(0, 0, 1), badge(100, 0, 2), badge(200, 0, 3)];
    const next = removeAnnotation(list, 0);
    expect(next.map((a) => (a.kind === 'badge' ? a.number : 0))).toEqual([
      1, 2,
    ]);
  });
  it('元の配列は変更しない', () => {
    const list = [badge(0, 0, 1), badge(100, 0, 2)];
    removeAnnotation(list, 0);
    expect(list).toHaveLength(2);
  });
});

describe('hitTest', () => {
  const list: Annotation[] = [
    { ...base, kind: 'rect', rect: { x: 0, y: 0, width: 200, height: 100 } },
    badge(50, 50, 1),
    {
      ...base,
      kind: 'arrow',
      from: { x: 300, y: 300 },
      to: { x: 400, y: 300 },
    },
    { ...base, kind: 'text', position: { x: 10, y: 400 }, text: 'abc' },
  ];
  it('最前面の注釈を返す', () => {
    expect(hitTest(list, { x: 50, y: 50 })).toBe(1);
  });
  it('矩形は内部の空白には当たらず、枠線に当たる', () => {
    expect(hitTest(list, { x: 150, y: 80 })).toBe(-1);
    expect(hitTest(list, { x: 100, y: 1 })).toBe(0);
  });
  it('矢印の線上に当たる', () => {
    expect(hitTest(list, { x: 350, y: 302 })).toBe(2);
    expect(hitTest(list, { x: 350, y: 330 })).toBe(-1);
  });
  it('文字に当たる', () => {
    expect(hitTest(list, { x: 20, y: 402 })).toBe(3);
  });
  it('何も無ければ -1', () => {
    expect(hitTest([], { x: 0, y: 0 })).toBe(-1);
    expect(hitTest(list, { x: 900, y: 900 })).toBe(-1);
  });
});

describe('履歴', () => {
  it('追加と取り消し', () => {
    let list: Annotation[] = [];
    list = addAnnotation(list, badge(0, 0, 1));
    list = addAnnotation(list, badge(1, 1, 2));
    expect(list).toHaveLength(2);
    list = undoAnnotation(list);
    expect(list).toHaveLength(1);
    expect(undoAnnotation([])).toEqual([]);
  });
  it('上限を超えたら古いものから捨てる', () => {
    let list: Annotation[] = [];
    for (let i = 0; i < MAX_ANNOTATIONS + 5; i++) {
      list = addAnnotation(list, badge(i, 0, i + 1));
    }
    expect(list).toHaveLength(MAX_ANNOTATIONS);
  });
});

describe('その他', () => {
  it('normalizeText は改行を空白にし、空なら null', () => {
    expect(normalizeText('  a\nb  ')).toBe('a b');
    expect(normalizeText('   ')).toBeNull();
    expect(normalizeText('x'.repeat(500))).toHaveLength(200);
  });
  it('buildOutputFileName', () => {
    expect(buildOutputFileName('shot.final.jpg')).toBe(
      'shot.final-annotated.png',
    );
    expect(buildOutputFileName('')).toBe('screenshot-annotated.png');
    expect(buildOutputFileName('.png')).toBe('screenshot-annotated.png');
  });
  it('isAcceptedImageFile', () => {
    expect(isAcceptedImageFile({ type: 'image/png' })).toBe(true);
    expect(isAcceptedImageFile({ type: 'image/svg+xml' })).toBe(false);
  });
  it('サイズ系の下限', () => {
    expect(badgeRadius(1)).toBe(12);
    expect(estimateTextWidth('ab', 10)).toBeCloseTo(12);
    expect(estimateTextWidth('あ', 10)).toBe(10);
  });

  it('サロゲートペア（絵文字）は1文字として1emで数える', () => {
    expect(estimateTextWidth('😀', 10)).toBe(10);
    expect(estimateTextWidth('😀a', 10)).toBeCloseTo(16);
  });

  it('日本語のファイル名でも拡張子だけを外す', () => {
    expect(buildOutputFileName('スクショ 1.PNG')).toBe(
      'スクショ 1-annotated.png',
    );
  });

  it('ファイルサイズの表示', () => {
    expect(formatFileSize(512)).toBe('512 B');
    expect(formatFileSize(1536)).toBe('1.50 KB');
    expect(formatFileSize(10 * 1024)).toBe('10.0 KB');
    expect(formatFileSize(25 * 1024 * 1024)).toBe('25.0 MB');
  });
});
