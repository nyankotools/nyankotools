/**
 * 共有カード画像の描画（設計書8.2・16.11）。Canvas 2D に描くだけで、ブラウザの外には何も送らない。
 * レイアウト計算（fitTitle 等）は計測関数を受け取る純粋関数にしてテストする。
 */
import type { Rarity } from './types';

export type CardShape = 'landscape' | 'portrait';

export const CARD_SIZES: Record<CardShape, { width: number; height: number }> =
  {
    landscape: { width: 1200, height: 630 },
    portrait: { width: 1080, height: 1350 },
  };

export const CARD_FONT =
  '"M PLUS Rounded 1c", "Hiragino Maru Gothic ProN", "Meiryo", sans-serif';

export type CardData = {
  rarity: Rarity;
  rarityLabel: string;
  titleSegments: string[];
  /** 例: あなたを猫に例えると「ロシアンブルー」タイプ */
  typeLine: string;
  axes: { poleLabel: string; stars: 1 | 2 | 3 }[];
  /** 本人が載せると選んだときだけ（例: たまさんの結果） */
  nameLine?: string;
  sectionName: string;
  /** 表示用のURL（https:// なし） */
  siteLine: string;
};

export type CardStyle = {
  /** 背景グラデーション（左上 → 右下） */
  background: string[];
  /** 枠のグラデーション（なしなら枠なし） */
  frame?: string[];
  title: string;
  text: string;
  sub: string;
  badgeBackground: string;
  badgeText: string;
  holo?: boolean;
};

const INK = '#4a2f63';
const MUTED = '#6b5a7c';

/** レア度別の意匠（16.11）。どの意匠でも文字のコントラスト比 4.5 以上（テストで確認） */
export const CARD_STYLES: Record<Rarity, CardStyle> = {
  N: {
    background: ['#f3eefb', '#fbeef5'],
    title: INK,
    text: INK,
    sub: MUTED,
    badgeBackground: '#e4d8f5',
    badgeText: INK,
  },
  R: {
    background: ['#f3eefb', '#fbeef5'],
    frame: ['#8b5cf6', '#a78bfa'],
    title: INK,
    text: INK,
    sub: MUTED,
    badgeBackground: '#ffffff',
    badgeText: '#5b21b6',
  },
  SR: {
    background: ['#f8fafc', '#e2e8f0'],
    frame: ['#e2e8f0', '#94a3b8', '#f1f5f9', '#64748b'],
    title: INK,
    text: INK,
    sub: '#475569',
    badgeBackground: '#cbd5e1',
    badgeText: '#0f172a',
  },
  SSR: {
    background: ['#fffbeb', '#fef3c7'],
    frame: ['#fde68a', '#d97706', '#fcd34d', '#b45309'],
    title: INK,
    text: INK,
    sub: '#6b4c1e',
    badgeBackground: '#fbbf24',
    badgeText: '#451a03',
  },
  UR: {
    background: ['#fce7f3', '#ede9fe', '#e0f2fe', '#dcfce7'],
    frame: ['#f9a8d4', '#c4b5fd', '#7dd3fc', '#86efac'],
    title: INK,
    text: INK,
    sub: MUTED,
    badgeBackground: '#ffffff',
    badgeText: '#6d28d9',
  },
  LR: {
    background: ['#1f1235', '#0f0a1a'],
    frame: ['#fde68a', '#b45309', '#fcd34d', '#92400e'],
    title: '#fcd34d',
    text: '#f5f3ff',
    sub: '#d8cfe6',
    badgeBackground: '#fcd34d',
    badgeText: '#1f1235',
    holo: true,
  },
};

/** 文字幅の計測（size は px） */
export type Measure = (text: string, size: number) => number;

/**
 * 区切りを貪欲に詰めて行に分ける。1区切りが幅を超えるときは文字単位で折り返す（split = true）。
 */
export function packSegments(
  segments: readonly string[],
  maxWidth: number,
  measure: (text: string) => number,
): { lines: string[]; split: boolean } {
  const lines: string[] = [];
  let current = '';
  let split = false;
  for (const segment of segments) {
    if (measure(current + segment) <= maxWidth) {
      current += segment;
      continue;
    }
    // 収まらない区切りは新しい行から始める
    if (current !== '') lines.push(current);
    current = '';
    if (measure(segment) <= maxWidth) {
      current = segment;
      continue;
    }
    split = true;
    for (const ch of Array.from(segment)) {
      if (current !== '' && measure(current + ch) > maxWidth) {
        lines.push(current);
        current = ch;
      } else {
        current += ch;
      }
    }
  }
  if (current !== '') lines.push(current);
  return { lines, split };
}

/**
 * 称号が maxLines 行に収まる最大の文字サイズを探す。
 * まず区切りの途中で改行しないサイズを探し、無ければ文字単位の折り返しを許して探す。
 * 最小サイズでも収まらなければ、最小サイズで折り返した行を返す。
 */
export function fitTitle(
  segments: readonly string[],
  measure: Measure,
  options: {
    maxWidth: number;
    maxLines: number;
    maxSize: number;
    minSize: number;
  },
): { size: number; lines: string[] } {
  const { maxWidth, maxLines, maxSize, minSize } = options;
  const pack = (size: number) =>
    packSegments(segments, maxWidth, (t) => measure(t, size));
  for (const allowSplit of [false, true]) {
    for (let size = maxSize; size >= minSize; size -= 2) {
      const { lines, split } = pack(size);
      if (lines.length <= maxLines && (allowSplit || !split)) {
        return { size, lines };
      }
    }
  }
  return { size: minSize, lines: pack(minSize).lines };
}

/** カードに描く全文字（フォントの読み込みに使う） */
export function cardText(data: CardData): string {
  return [
    data.rarity,
    data.rarityLabel,
    ...data.titleSegments,
    data.typeLine,
    ...data.axes.map((a) => `${a.poleLabel}★`),
    data.nameLine ?? '',
    data.sectionName,
    data.siteLine,
  ].join('');
}

type Layout = {
  image: { x: number; y: number; size: number };
  column: { x: number; width: number; top: number };
  align: 'left' | 'center';
  title: { maxSize: number; minSize: number; maxLines: number };
};

const LAYOUTS: Record<CardShape, Layout> = {
  // 右の列は最も長い場合（名前あり・称号3行）でも下端 約565px。フッターは画像の下に置く
  landscape: {
    image: { x: 64, y: 60, size: 480 },
    column: { x: 600, width: 540, top: 80 },
    align: 'left',
    title: { maxSize: 64, minSize: 40, maxLines: 3 },
  },
  // 本文は最も長い場合でも下端 約1265px
  portrait: {
    image: { x: 250, y: 84, size: 580 },
    column: { x: 90, width: 900, top: 710 },
    align: 'center',
    title: { maxSize: 72, minSize: 44, maxLines: 3 },
  },
};

function linearGradient(
  ctx: CanvasRenderingContext2D,
  x0: number,
  y0: number,
  x1: number,
  y1: number,
  colors: readonly string[],
) {
  const gradient = ctx.createLinearGradient(x0, y0, x1, y1);
  colors.forEach((color, i) =>
    gradient.addColorStop(
      colors.length === 1 ? 0 : i / (colors.length - 1),
      color,
    ),
  );
  return gradient;
}

function roundRectPath(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

/** 4方向に伸びるキラキラ */
function sparkle(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  r: number,
  color: string,
) {
  ctx.beginPath();
  ctx.moveTo(cx, cy - r);
  ctx.quadraticCurveTo(cx, cy, cx + r, cy);
  ctx.quadraticCurveTo(cx, cy, cx, cy + r);
  ctx.quadraticCurveTo(cx, cy, cx - r, cy);
  ctx.quadraticCurveTo(cx, cy, cx, cy - r);
  ctx.fillStyle = color;
  ctx.fill();
}

function font(weight: 500 | 800, size: number) {
  return `${weight} ${size}px ${CARD_FONT}`;
}

/**
 * カードを描く。image は同一オリジンの猫画像（Canvas を汚染しない）。
 * フォントは呼び出し側で読み込み済みであること（未読込なら代替フォントで描かれる）。
 */
export function drawCard(
  ctx: CanvasRenderingContext2D,
  shape: CardShape,
  data: CardData,
  image: CanvasImageSource,
): void {
  const { width, height } = CARD_SIZES[shape];
  const layout = LAYOUTS[shape];
  const style = CARD_STYLES[data.rarity];

  ctx.save();
  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = linearGradient(ctx, 0, 0, width, height, style.background);
  ctx.fillRect(0, 0, width, height);

  if (style.holo) {
    // ホログラム風: 斜めの半透明の帯
    ctx.globalAlpha = 0.12;
    const colors = ['#f9a8d4', '#a5b4fc', '#67e8f9', '#fde68a'];
    for (let i = -height; i < width; i += 90) {
      ctx.fillStyle =
        colors[(((i / 90) % colors.length) + colors.length) % colors.length];
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i + 40, 0);
      ctx.lineTo(i + 40 + height, height);
      ctx.lineTo(i + height, height);
      ctx.closePath();
      ctx.fill();
    }
    ctx.globalAlpha = 1;
  }

  if (style.frame) {
    const inset = 14;
    ctx.lineWidth = 14;
    ctx.strokeStyle = linearGradient(ctx, 0, 0, width, height, style.frame);
    roundRectPath(ctx, inset, inset, width - inset * 2, height - inset * 2, 36);
    ctx.stroke();
  }

  // キラキラの飾り
  const sparkleColor = style.holo ? '#fcd34d' : '#c4b5fd';
  sparkle(ctx, width - 70, 64, 18, sparkleColor);
  sparkle(ctx, width - 110, 104, 10, sparkleColor);
  sparkle(ctx, width - 64, height - 70, 14, sparkleColor);

  // 猫の画像（角丸の写真枠）
  const { image: box } = layout;
  ctx.save();
  roundRectPath(ctx, box.x, box.y, box.size, box.size, 40);
  ctx.clip();
  ctx.drawImage(image, box.x, box.y, box.size, box.size);
  ctx.restore();
  ctx.lineWidth = 6;
  ctx.strokeStyle = '#ffffff';
  roundRectPath(ctx, box.x, box.y, box.size, box.size, 40);
  ctx.stroke();

  const { column, align } = layout;
  const anchorX = align === 'left' ? column.x : column.x + column.width / 2;
  ctx.textAlign = align;
  ctx.textBaseline = 'alphabetic';
  let y = column.top;

  if (data.nameLine) {
    // 長い名前は横に潰さず、まず文字を小さくして収める（それでも超える分だけ maxWidth で縮める）
    let nameSize = 28;
    ctx.font = font(800, nameSize);
    while (
      nameSize > 18 &&
      ctx.measureText(data.nameLine).width > column.width
    ) {
      nameSize -= 2;
      ctx.font = font(800, nameSize);
    }
    ctx.fillStyle = style.sub;
    y += 28;
    ctx.fillText(data.nameLine, anchorX, y, column.width);
    y += 20;
  }

  // レア度バッジ + ラベル
  const badgeSize = 34;
  ctx.font = font(800, badgeSize);
  const badgeTextWidth = ctx.measureText(data.rarity).width;
  const badgeW = badgeTextWidth + 36;
  const badgeH = badgeSize + 20;
  ctx.font = font(800, 30);
  const labelWidth = ctx.measureText(data.rarityLabel).width;
  const rowWidth = badgeW + 16 + labelWidth;
  const badgeX = align === 'left' ? column.x : anchorX - rowWidth / 2;
  ctx.fillStyle = style.badgeBackground;
  roundRectPath(ctx, badgeX, y, badgeW, badgeH, 12);
  ctx.fill();
  ctx.textAlign = 'left';
  ctx.font = font(800, badgeSize);
  ctx.fillStyle = style.badgeText;
  ctx.fillText(data.rarity, badgeX + 18, y + badgeH / 2 + badgeSize * 0.36);
  ctx.font = font(800, 30);
  ctx.fillStyle = style.text;
  ctx.fillText(
    data.rarityLabel,
    badgeX + badgeW + 16,
    y + badgeH / 2 + 30 * 0.36,
  );
  ctx.textAlign = align;
  y += badgeH + 24;

  // 称号（最大の文字）
  const fitted = fitTitle(
    data.titleSegments,
    (text, size) => {
      ctx.font = font(800, size);
      return ctx.measureText(text).width;
    },
    { maxWidth: column.width, ...layout.title },
  );
  ctx.font = font(800, fitted.size);
  ctx.fillStyle = style.title;
  const lineHeight = Math.round(fitted.size * 1.25);
  for (const line of fitted.lines) {
    y += lineHeight;
    ctx.fillText(line, anchorX, y, column.width);
  }
  y += 24;

  // 猫のタイプ
  ctx.font = font(500, 28);
  ctx.fillStyle = style.text;
  y += 30;
  ctx.fillText(data.typeLine, anchorX, y, column.width);
  y += 22;

  // 4つの傾向（2列）
  ctx.font = font(800, 26);
  const cellWidth = column.width / 2;
  data.axes.forEach((axis, i) => {
    const row = Math.floor(i / 2);
    const col = i % 2;
    const cellY = y + 40 + row * 42;
    const label = `${axis.poleLabel} `;
    const stars = '★'.repeat(axis.stars);
    const textWidth = ctx.measureText(label + stars).width;
    const cellX =
      align === 'left'
        ? column.x + col * cellWidth
        : column.x + col * cellWidth + (cellWidth - textWidth) / 2;
    ctx.textAlign = 'left';
    ctx.fillStyle = style.text;
    ctx.fillText(label, cellX, cellY);
    ctx.fillStyle = style.holo ? '#fcd34d' : '#b45309';
    ctx.fillText(stars, cellX + ctx.measureText(label).width, cellY);
  });
  ctx.textAlign = align;

  // フッター（セクション名とURLを1行で。横長は画像の下、縦長は中央）
  const footerY = height - 36;
  const sectionFont = font(800, 28);
  const siteFont = font(500, 22);
  ctx.font = sectionFont;
  const sectionWidth = ctx.measureText(data.sectionName).width;
  ctx.font = siteFont;
  const footerWidth = sectionWidth + 20 + ctx.measureText(data.siteLine).width;
  const footerX = align === 'left' ? box.x : (width - footerWidth) / 2;
  ctx.textAlign = 'left';
  ctx.font = sectionFont;
  ctx.fillStyle = style.title;
  ctx.fillText(data.sectionName, footerX, footerY);
  ctx.font = siteFont;
  ctx.fillStyle = style.sub;
  ctx.fillText(data.siteLine, footerX + sectionWidth + 20, footerY);
  ctx.restore();
}
