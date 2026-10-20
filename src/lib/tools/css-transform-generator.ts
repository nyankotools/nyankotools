export interface TransformState {
  translateX: number;
  translateY: number;
  translateZ: number;
  rotateX: number;
  rotateY: number;
  /** Z軸まわりの回転（CSSの`rotate()`） */
  rotateZ: number;
  scaleX: number;
  scaleY: number;
  skewX: number;
  skewY: number;
  /** 0は指定なし */
  perspective: number;
  originX: number;
  originY: number;
}

export type TransformKey = keyof TransformState;

export const DEFAULT_TRANSFORM: TransformState = {
  translateX: 0,
  translateY: 0,
  translateZ: 0,
  rotateX: 0,
  rotateY: 0,
  rotateZ: 0,
  scaleX: 1,
  scaleY: 1,
  skewX: 0,
  skewY: 0,
  perspective: 0,
  originX: 50,
  originY: 50,
};

export const TRANSFORM_RANGES: Record<
  TransformKey,
  { min: number; max: number; step: number }
> = {
  translateX: { min: -500, max: 500, step: 1 },
  translateY: { min: -500, max: 500, step: 1 },
  translateZ: { min: -500, max: 500, step: 1 },
  rotateX: { min: -360, max: 360, step: 1 },
  rotateY: { min: -360, max: 360, step: 1 },
  rotateZ: { min: -360, max: 360, step: 1 },
  scaleX: { min: 0, max: 5, step: 0.05 },
  scaleY: { min: 0, max: 5, step: 0.05 },
  skewX: { min: -89, max: 89, step: 1 },
  skewY: { min: -89, max: 89, step: 1 },
  perspective: { min: 0, max: 2000, step: 10 },
  originX: { min: 0, max: 100, step: 1 },
  originY: { min: 0, max: 100, step: 1 },
};

function round2(n: number): number {
  const r = Math.round(n * 100) / 100;
  return r === 0 ? 0 : r;
}

/** 範囲内に丸め、小数第2位までにする。NaN・Infinityは初期値にする */
export function clampTransformValue(key: TransformKey, value: number): number {
  if (!Number.isFinite(value)) return DEFAULT_TRANSFORM[key];
  const { min, max } = TRANSFORM_RANGES[key];
  const clamped = Math.min(max, Math.max(min, value));
  if (key === 'scaleX' || key === 'scaleY') return round2(clamped);
  return round2(Math.round(clamped));
}

/** 全項目を範囲内に正規化する。perspectiveは0（なし）か50以上のみ */
export function normalizeTransform(
  state: Partial<TransformState>,
): TransformState {
  const out = { ...DEFAULT_TRANSFORM };
  for (const key of Object.keys(DEFAULT_TRANSFORM) as TransformKey[]) {
    const v = state[key];
    if (v !== undefined) out[key] = clampTransformValue(key, v);
  }
  if (out.perspective > 0 && out.perspective < 50) out.perspective = 50;
  return out;
}

function num(n: number): string {
  return String(round2(n));
}

export function isDefaultTransform(state: TransformState): boolean {
  const s = normalizeTransform(state);
  return (Object.keys(DEFAULT_TRANSFORM) as TransformKey[])
    .filter((k) => k !== 'originX' && k !== 'originY')
    .every((k) => s[k] === DEFAULT_TRANSFORM[k]);
}

/** `transform`プロパティの値。初期値の項目は省略し、何もなければ`none` */
export function buildTransformValue(input: TransformState): string {
  const s = normalizeTransform(input);
  const parts: string[] = [];

  if (s.perspective > 0) parts.push(`perspective(${num(s.perspective)}px)`);

  if (s.translateZ !== 0) {
    parts.push(
      `translate3d(${num(s.translateX)}px, ${num(s.translateY)}px, ${num(s.translateZ)}px)`,
    );
  } else if (s.translateX !== 0 && s.translateY !== 0) {
    parts.push(`translate(${num(s.translateX)}px, ${num(s.translateY)}px)`);
  } else if (s.translateX !== 0) {
    parts.push(`translateX(${num(s.translateX)}px)`);
  } else if (s.translateY !== 0) {
    parts.push(`translateY(${num(s.translateY)}px)`);
  }

  if (s.rotateX !== 0) parts.push(`rotateX(${num(s.rotateX)}deg)`);
  if (s.rotateY !== 0) parts.push(`rotateY(${num(s.rotateY)}deg)`);
  if (s.rotateZ !== 0) parts.push(`rotate(${num(s.rotateZ)}deg)`);

  if (s.scaleX !== 1 || s.scaleY !== 1) {
    parts.push(
      s.scaleX === s.scaleY
        ? `scale(${num(s.scaleX)})`
        : `scale(${num(s.scaleX)}, ${num(s.scaleY)})`,
    );
  }

  if (s.skewX !== 0 && s.skewY !== 0) {
    parts.push(`skew(${num(s.skewX)}deg, ${num(s.skewY)}deg)`);
  } else if (s.skewX !== 0) {
    parts.push(`skewX(${num(s.skewX)}deg)`);
  } else if (s.skewY !== 0) {
    parts.push(`skewY(${num(s.skewY)}deg)`);
  }

  return parts.length > 0 ? parts.join(' ') : 'none';
}

/** `transform-origin`の値（例: `50% 50%`） */
export function buildOriginValue(input: TransformState): string {
  const s = normalizeTransform(input);
  return `${num(s.originX)}% ${num(s.originY)}%`;
}

export function isDefaultOrigin(input: TransformState): boolean {
  const s = normalizeTransform(input);
  return s.originX === 50 && s.originY === 50;
}

/** コピー用のCSS。originが初期値(50% 50%)なら`transform-origin`行を省略する */
export function buildCssDeclaration(input: TransformState): string {
  const lines = [`transform: ${buildTransformValue(input)};`];
  if (!isDefaultOrigin(input)) {
    lines.push(`transform-origin: ${buildOriginValue(input)};`);
  }
  return lines.join('\n');
}

export type TransformPresetId =
  'rotate45' | 'zoom' | 'italic' | 'tiltCard' | 'flip' | 'isometric';

export interface TransformPreset {
  id: TransformPresetId;
  state: TransformState;
}

function preset(
  id: TransformPresetId,
  partial: Partial<TransformState>,
): TransformPreset {
  return { id, state: normalizeTransform(partial) };
}

export const TRANSFORM_PRESETS: TransformPreset[] = [
  preset('rotate45', { rotateZ: 45 }),
  preset('zoom', { scaleX: 1.5, scaleY: 1.5 }),
  preset('italic', { skewX: -15 }),
  preset('tiltCard', { perspective: 800, rotateX: 20, rotateY: -25 }),
  preset('flip', { perspective: 800, rotateY: 180 }),
  preset('isometric', { rotateX: 60, rotateZ: -45 }),
];

export function getPreset(id: string): TransformPreset | undefined {
  return TRANSFORM_PRESETS.find((p) => p.id === id);
}
