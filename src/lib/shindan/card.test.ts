import { describe, expect, it } from 'vitest';
import {
  CARD_SIZES,
  CARD_STYLES,
  cardText,
  drawCard,
  fitTitle,
  packSegments,
  type CardData,
  type CardShape,
} from './card';
import { RARITIES } from './types';

/** 1文字 = size px として測る */
const measure = (text: string, size: number) => Array.from(text).length * size;

/** 文字の位置を記録するだけの Canvas 2D の代わり（測定は 1文字 = 0.9 × size px） */
function recordingContext() {
  const texts: { text: string; x: number; y: number }[] = [];
  const noop = () => {};
  const ctx = {
    font: '',
    fillStyle: '',
    strokeStyle: '',
    lineWidth: 1,
    globalAlpha: 1,
    textAlign: 'left',
    textBaseline: 'alphabetic',
    save: noop,
    restore: noop,
    clearRect: noop,
    fillRect: noop,
    beginPath: noop,
    moveTo: noop,
    lineTo: noop,
    arcTo: noop,
    closePath: noop,
    quadraticCurveTo: noop,
    fill: noop,
    stroke: noop,
    clip: noop,
    drawImage: noop,
    createLinearGradient: () => ({ addColorStop: noop }),
    measureText(this: { font: string }, text: string) {
      const size = Number(/(\d+)px/.exec(this.font)?.[1] ?? 10);
      return { width: Array.from(text).length * size * 0.9 };
    },
    fillText(this: { font: string }, text: string, x: number, y: number) {
      texts.push({ text, x, y });
    },
  };
  return { ctx: ctx as unknown as CanvasRenderingContext2D, texts };
}

const cardBase: CardData = {
  rarity: 'N',
  rarityLabel: '王道',
  titleSegments: ['夜更かし好きの', '社交派', 'ロシアンブルー'],
  typeLine: 'あなたを猫に例えると「ロシアンブルー」タイプ',
  axes: [
    { poleLabel: 'のんびり', stars: 1 },
    { poleLabel: 'せっかち', stars: 2 },
    { poleLabel: '社交的', stars: 3 },
    { poleLabel: 'ひとり好き', stars: 1 },
  ],
  sectionName: 'にゃんこ診断',
  siteLine: 'nyankotools.com/shindan/neko/',
};

describe('packSegments', () => {
  const byChar = (text: string) => Array.from(text).length;

  it('収まる限り区切りを同じ行に詰める', () => {
    expect(packSegments(['あいう', 'えお', 'かきくけ'], 5, byChar)).toEqual({
      lines: ['あいうえお', 'かきくけ'],
      split: false,
    });
  });

  it('幅を超える区切りは文字単位で折り返す', () => {
    expect(packSegments(['あい', 'かきくけこさし'], 4, byChar)).toEqual({
      lines: ['あい', 'かきくけ', 'こさし'],
      split: true,
    });
  });

  it('空の区切りしかなければ行なし', () => {
    expect(packSegments([], 4, byChar).lines).toEqual([]);
  });
});

describe('fitTitle', () => {
  const options = { maxWidth: 400, maxLines: 2, maxSize: 64, minSize: 40 };

  it('収まる最大サイズを選ぶ', () => {
    // 6文字 × 64 = 384 → 1行
    expect(fitTitle(['夜更かしの', '猫'], measure, options)).toEqual({
      size: 64,
      lines: ['夜更かしの猫'],
    });
  });

  it('区切りの途中で改行しないサイズを優先する', () => {
    // 「社交派ロシアンブルー」10文字は 40px で 400px に収まる
    const fitted = fitTitle(
      ['夜更かし好きの', '社交派ロシアンブルー'],
      measure,
      options,
    );
    expect(fitted).toEqual({
      size: 40,
      lines: ['夜更かし好きの', '社交派ロシアンブルー'],
    });
  });

  it('区切りのままでは収まらなければ、文字単位の折り返しを許す', () => {
    // 12文字は 33px 以下でないと1行に収まらない → 折り返しを許した 64px（6文字×2行）
    const fitted = fitTitle(['あ'.repeat(12)], measure, options);
    expect(fitted).toEqual({
      size: 64,
      lines: ['あ'.repeat(6), 'あ'.repeat(6)],
    });
    expect(fitted.lines.join('')).toBe('あ'.repeat(12));
  });

  it('最小サイズでも収まらなければ最小サイズで返す（文字は欠けない）', () => {
    const fitted = fitTitle(['あ'.repeat(40)], measure, options);
    expect(fitted.size).toBe(40);
    expect(fitted.lines.join('')).toBe('あ'.repeat(40));
  });
});

/** 相対輝度（WCAG 2.x） */
function luminance(hex: string): number {
  const [r, g, b] = [1, 3, 5].map((i) => {
    const c = parseInt(hex.slice(i, i + 2), 16) / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function contrast(a: string, b: string): number {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

describe('CARD_STYLES', () => {
  it.each(RARITIES)(
    '%s: 文字色は背景のどの色に対してもコントラスト比4.5以上',
    (rarity) => {
      const style = CARD_STYLES[rarity];
      for (const bg of style.background) {
        expect(contrast(style.title, bg)).toBeGreaterThanOrEqual(4.5);
        expect(contrast(style.text, bg)).toBeGreaterThanOrEqual(4.5);
        expect(contrast(style.sub, bg)).toBeGreaterThanOrEqual(4.5);
      }
      expect(
        contrast(style.badgeText, style.badgeBackground),
      ).toBeGreaterThanOrEqual(4.5);
    },
  );
});

describe('サロゲートペア・空の入力', () => {
  it('絵文字（サロゲートペア）を途中で割らずに折り返す', () => {
    const { lines, split } = packSegments(['🐱🐾👨‍👩‍👧'], 2, (t) => t.length);
    expect(split).toBe(true);
    expect(lines.join('')).toBe('🐱🐾👨‍👩‍👧');
    const loneSurrogate =
      /[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?<![\uD800-\uDBFF])[\uDC00-\uDFFF]/;
    for (const line of lines) expect(line).not.toMatch(loneSurrogate);
  });

  it('称号の区切りが空なら、最大サイズ・行なしで返す', () => {
    expect(
      fitTitle([], measure, {
        maxWidth: 400,
        maxLines: 2,
        maxSize: 64,
        minSize: 40,
      }),
    ).toEqual({ size: 64, lines: [] });
  });
});

describe('drawCard', () => {
  const shapes: CardShape[] = ['landscape', 'portrait'];

  it.each(
    RARITIES.flatMap((rarity) =>
      shapes.flatMap((shape) =>
        [false, true].map((withName) => [rarity, shape, withName] as const),
      ),
    ),
  )(
    '%s・%s（名前あり: %s）を例外なく描き、文字はすべてキャンバス内に収まる',
    (rarity, shape, withName) => {
      const { ctx, texts } = recordingContext();
      const { width, height } = CARD_SIZES[shape];
      drawCard(
        ctx,
        shape,
        {
          ...cardBase,
          rarity,
          rarityLabel: '王道',
          nameLine: withName ? 'たまさんの結果' : undefined,
        },
        {} as CanvasImageSource,
      );
      expect(texts.length).toBeGreaterThan(0);
      for (const { x, y } of texts) {
        expect(x).toBeGreaterThanOrEqual(0);
        expect(x).toBeLessThanOrEqual(width);
        expect(y).toBeGreaterThan(0);
        expect(y).toBeLessThanOrEqual(height);
      }
      // 称号・タイプ・フッターのどれも描かれている
      const drawn = texts.map((t) => t.text).join('|');
      expect(drawn).toContain('夜更かし好きの');
      expect(drawn).toContain('にゃんこ診断');
      expect(drawn.includes('たまさんの結果')).toBe(withName);
    },
  );

  it('絵文字だけの名前・30文字の名前でも例外なく描ける', () => {
    for (const name of ['🐱🐾'.repeat(15), 'あ'.repeat(30)]) {
      const { ctx } = recordingContext();
      expect(() =>
        drawCard(
          ctx,
          'landscape',
          { ...cardBase, nameLine: `${name}さんの結果` },
          {} as CanvasImageSource,
        ),
      ).not.toThrow();
    }
  });
});

describe('cardText', () => {
  it('カードに描く文字をすべて含む（フォント読み込み用）', () => {
    const data: CardData = {
      rarity: 'SSR',
      rarityLabel: '人気者',
      titleSegments: ['きらめく', '夜更かし好きの', '社交派ロシアンブルー'],
      typeLine: 'あなたを猫に例えると「ロシアンブルー」タイプ',
      axes: [{ poleLabel: 'のんびり', stars: 3 }],
      nameLine: 'たまさんの結果',
      sectionName: 'にゃんこ診断',
      siteLine: 'nyankotools.com/shindan/neko/',
    };
    const text = cardText(data);
    for (const part of [
      'SSR',
      '人気者',
      'きらめく',
      '社交派',
      '「ロシアンブルー」',
      'のんびり★',
      'たま',
      'にゃんこ診断',
      'nyankotools.com',
    ]) {
      expect(text).toContain(part);
    }
  });
});
