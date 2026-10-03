import {
  isWithinSourceLimit,
  type OutputFormat,
  type Size,
} from './image-cropper';

export type MergeDirection = 'horizontal' | 'vertical' | 'grid';
export type MergeAlign = 'start' | 'center' | 'end';

export interface MergeOptions {
  direction: MergeDirection;
  /** grid のときの列数 */
  columns: number;
  /** 画像どうしの間隔（px） */
  gap: number;
  /** 外側の余白（px） */
  margin: number;
  /** 画像の大きさをそろえる（横並びは高さ、縦並びは幅、グリッドは1マスに収める） */
  fit: boolean;
  /** 並べる方向と直角の向きの揃え（グリッドではマスの中の位置） */
  align: MergeAlign;
}

export interface Placement {
  /** 入力順の番号 */
  index: number;
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface MergeLayout extends Size {
  items: Placement[];
}

export const MAX_IMAGES = 50;
export const MAX_GAP = 500;
export const MAX_COLUMNS = 20;

const clampInt = (v: number, min: number, max: number) =>
  Math.min(Math.max(Number.isFinite(v) ? Math.round(v) : min, min), max);

const offsetFor = (align: MergeAlign, space: number) =>
  align === 'start' ? 0 : align === 'end' ? space : Math.round(space / 2);

/** 結合結果の配置を計算する。描画はしない（画像の枚数は MAX_IMAGES まで） */
export function layoutImages(
  sizes: Size[],
  options: MergeOptions,
): MergeLayout {
  if (sizes.length === 0) return { width: 0, height: 0, items: [] };
  const gap = clampInt(options.gap, 0, MAX_GAP);
  const margin = clampInt(options.margin, 0, MAX_GAP);
  const items: Placement[] = [];
  let innerW: number;
  let innerH: number;

  if (options.direction === 'grid') {
    const cols = clampInt(
      options.columns,
      1,
      Math.min(MAX_COLUMNS, sizes.length),
    );
    const rows = Math.ceil(sizes.length / cols);
    const cellW = Math.max(...sizes.map((s) => s.width));
    const cellH = Math.max(...sizes.map((s) => s.height));
    sizes.forEach((s, index) => {
      const scale = options.fit
        ? Math.min(cellW / s.width, cellH / s.height)
        : 1;
      const width = Math.max(1, Math.round(s.width * scale));
      const height = Math.max(1, Math.round(s.height * scale));
      const col = index % cols;
      const row = Math.floor(index / cols);
      items.push({
        index,
        x:
          margin +
          col * (cellW + gap) +
          offsetFor(options.align, cellW - width),
        y:
          margin +
          row * (cellH + gap) +
          offsetFor(options.align, cellH - height),
        width,
        height,
      });
    });
    innerW = cols * cellW + (cols - 1) * gap;
    innerH = rows * cellH + (rows - 1) * gap;
  } else if (options.direction === 'horizontal') {
    const rowH = Math.max(...sizes.map((s) => s.height));
    const scaled = sizes.map((s) =>
      options.fit
        ? {
            width: Math.max(1, Math.round((s.width * rowH) / s.height)),
            height: rowH,
          }
        : s,
    );
    let x = margin;
    scaled.forEach((s, index) => {
      items.push({
        index,
        x,
        y: margin + offsetFor(options.align, rowH - s.height),
        width: s.width,
        height: s.height,
      });
      x += s.width + gap;
    });
    innerW = x - margin - gap;
    innerH = rowH;
  } else {
    const colW = Math.max(...sizes.map((s) => s.width));
    const scaled = sizes.map((s) =>
      options.fit
        ? {
            width: colW,
            height: Math.max(1, Math.round((s.height * colW) / s.width)),
          }
        : s,
    );
    let y = margin;
    scaled.forEach((s, index) => {
      items.push({
        index,
        x: margin + offsetFor(options.align, colW - s.width),
        y,
        width: s.width,
        height: s.height,
      });
      y += s.height + gap;
    });
    innerW = colW;
    innerH = y - margin - gap;
  }

  return { width: innerW + margin * 2, height: innerH + margin * 2, items };
}

/** 結合後の画像を書き出せる大きさか（1辺・総画素数の上限は読み込み時と同じ） */
export function isLayoutWithinLimit(layout: Size): boolean {
  return layout.width > 0 && layout.height > 0 && isWithinSourceLimit(layout);
}

/** 配列の要素を1つ動かした新しい配列を返す。範囲外の移動は何もしない */
export function moveItem<T>(list: T[], from: number, to: number): T[] {
  if (from < 0 || from >= list.length || to < 0 || to >= list.length) {
    return [...list];
  }
  const next = [...list];
  const [item] = next.splice(from, 1);
  next.splice(to, 0, item);
  return next;
}

export function mergedFileName(format: OutputFormat): string {
  return `merged.${format === 'jpeg' ? 'jpg' : format}`;
}
