export interface BoxShadowLayer {
  offsetX: number;
  offsetY: number;
  blur: number;
  spread: number;
  color: string;
  inset: boolean;
}

export const MIN_SHADOWS = 1;
export const MAX_SHADOWS = 6;

export const DEFAULT_SHADOW_COLORS = [
  '#000000',
  '#3b82f6',
  '#a855f7',
  '#ec4899',
  '#f59e0b',
  '#10b981',
];

export function clampOffset(value: number): number {
  return Math.min(200, Math.max(-200, Math.round(value)));
}

export function clampBlur(value: number): number {
  return Math.min(200, Math.max(0, Math.round(value)));
}

export function clampSpread(value: number): number {
  return Math.min(200, Math.max(-200, Math.round(value)));
}

/** 追加するシャドウレイヤーの初期値。既存レイヤーの数に応じてオフセット・ぼかしを段階的に広げ、重ねた時に立体感が出るようにする */
export function suggestNewShadow(existingCount: number): BoxShadowLayer {
  return {
    offsetX: 0,
    offsetY: clampOffset(4 + existingCount * 4),
    blur: clampBlur(8 + existingCount * 4),
    spread: 0,
    color: DEFAULT_SHADOW_COLORS[existingCount % DEFAULT_SHADOW_COLORS.length],
    inset: false,
  };
}

function formatShadow(layer: BoxShadowLayer): string {
  const parts = [
    `${clampOffset(layer.offsetX)}px`,
    `${clampOffset(layer.offsetY)}px`,
    `${clampBlur(layer.blur)}px`,
    `${clampSpread(layer.spread)}px`,
    layer.color,
  ].join(' ');
  return layer.inset ? `inset ${parts}` : parts;
}

/** `box-shadow:`は含まない値部分。複数レイヤーはカンマ区切りで連結する */
export function buildBoxShadowValue(layers: BoxShadowLayer[]): string {
  return layers.map(formatShadow).join(', ');
}

/** コピー用に整形した `box-shadow: ...;` 宣言全体 */
export function buildCssDeclaration(layers: BoxShadowLayer[]): string {
  return `box-shadow: ${buildBoxShadowValue(layers)};`;
}
