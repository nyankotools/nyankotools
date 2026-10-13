export const PRESET_IDS = [
  'fade-in',
  'fade-out',
  'slide-in-left',
  'slide-in-up',
  'zoom-in',
  'bounce',
  'pulse',
  'shake',
  'swing',
  'spin',
  'flip',
] as const;
export type PresetId = (typeof PRESET_IDS)[number];

/** 同じ宣言を持つキーフレームのオフセット（%）をまとめて保持する */
export interface PresetKeyframe {
  offsets: number[];
  props: Record<string, string>;
}

export const PRESETS: Record<PresetId, PresetKeyframe[]> = {
  'fade-in': [
    { offsets: [0], props: { opacity: '0' } },
    { offsets: [100], props: { opacity: '1' } },
  ],
  'fade-out': [
    { offsets: [0], props: { opacity: '1' } },
    { offsets: [100], props: { opacity: '0' } },
  ],
  'slide-in-left': [
    { offsets: [0], props: { transform: 'translateX(-100%)', opacity: '0' } },
    { offsets: [100], props: { transform: 'translateX(0)', opacity: '1' } },
  ],
  'slide-in-up': [
    { offsets: [0], props: { transform: 'translateY(40px)', opacity: '0' } },
    { offsets: [100], props: { transform: 'translateY(0)', opacity: '1' } },
  ],
  'zoom-in': [
    { offsets: [0], props: { transform: 'scale(0.3)', opacity: '0' } },
    { offsets: [100], props: { transform: 'scale(1)', opacity: '1' } },
  ],
  bounce: [
    { offsets: [0, 100], props: { transform: 'translateY(0)' } },
    { offsets: [50], props: { transform: 'translateY(-30px)' } },
  ],
  pulse: [
    { offsets: [0, 100], props: { transform: 'scale(1)' } },
    { offsets: [50], props: { transform: 'scale(1.15)' } },
  ],
  shake: [
    { offsets: [0, 100], props: { transform: 'translateX(0)' } },
    { offsets: [20, 60], props: { transform: 'translateX(-10px)' } },
    { offsets: [40, 80], props: { transform: 'translateX(10px)' } },
  ],
  swing: [
    { offsets: [0, 100], props: { transform: 'rotate(0deg)' } },
    { offsets: [20], props: { transform: 'rotate(15deg)' } },
    { offsets: [40], props: { transform: 'rotate(-10deg)' } },
    { offsets: [60], props: { transform: 'rotate(5deg)' } },
    { offsets: [80], props: { transform: 'rotate(-5deg)' } },
  ],
  spin: [
    { offsets: [0], props: { transform: 'rotate(0deg)' } },
    { offsets: [100], props: { transform: 'rotate(360deg)' } },
  ],
  flip: [
    { offsets: [0], props: { transform: 'perspective(400px) rotateY(0deg)' } },
    {
      offsets: [100],
      props: { transform: 'perspective(400px) rotateY(360deg)' },
    },
  ],
};

export interface CubicBezier {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

export const EASING_IDS = [
  'ease',
  'linear',
  'ease-in',
  'ease-out',
  'ease-in-out',
  'ease-out-back',
  'ease-in-out-back',
  'ease-out-expo',
  'ease-in-out-cubic',
  'custom',
] as const;
export type EasingId = (typeof EASING_IDS)[number];
export type PresetEasingId = Exclude<EasingId, 'custom'>;

/** CSSキーワードで書けるイージング（それ以外はcubic-bezier()として出力する） */
const KEYWORD_EASINGS: readonly EasingId[] = [
  'ease',
  'linear',
  'ease-in',
  'ease-out',
  'ease-in-out',
];

export const EASING_BEZIERS: Record<PresetEasingId, CubicBezier> = {
  ease: { x1: 0.25, y1: 0.1, x2: 0.25, y2: 1 },
  linear: { x1: 0, y1: 0, x2: 1, y2: 1 },
  'ease-in': { x1: 0.42, y1: 0, x2: 1, y2: 1 },
  'ease-out': { x1: 0, y1: 0, x2: 0.58, y2: 1 },
  'ease-in-out': { x1: 0.42, y1: 0, x2: 0.58, y2: 1 },
  'ease-out-back': { x1: 0.34, y1: 1.56, x2: 0.64, y2: 1 },
  'ease-in-out-back': { x1: 0.68, y1: -0.6, x2: 0.32, y2: 1.6 },
  'ease-out-expo': { x1: 0.16, y1: 1, x2: 0.3, y2: 1 },
  'ease-in-out-cubic': { x1: 0.65, y1: 0, x2: 0.35, y2: 1 },
};

export const DIRECTIONS = [
  'normal',
  'reverse',
  'alternate',
  'alternate-reverse',
] as const;
export type Direction = (typeof DIRECTIONS)[number];

export const FILL_MODES = ['none', 'forwards', 'backwards', 'both'] as const;
export type FillMode = (typeof FILL_MODES)[number];

export interface AnimationConfig {
  preset: PresetId;
  name: string;
  /** 秒 */
  duration: number;
  /** 秒（負の値は途中から開始） */
  delay: number;
  iterations: number | 'infinite';
  direction: Direction;
  fillMode: FillMode;
  easing: EasingId;
  /** easing が custom のときに使うcubic-bezier */
  bezier: CubicBezier;
  /** prefers-reduced-motion: reduce 時にアニメーションを無効化する記述を含める */
  reducedMotion: boolean;
}

export const MIN_DURATION = 0.05;
export const MAX_DURATION = 60;
export const MIN_DELAY = -60;
export const MAX_DELAY = 60;
export const MAX_ITERATIONS = 100;

export const DEFAULT_CONFIG: AnimationConfig = {
  preset: 'bounce',
  name: 'bounce',
  duration: 1,
  delay: 0,
  iterations: 'infinite',
  direction: 'normal',
  fillMode: 'none',
  easing: 'ease',
  bezier: EASING_BEZIERS.ease,
  reducedMotion: true,
};

function finiteOr(value: number, fallback: number): number {
  return Number.isFinite(value) ? value : fallback;
}

/** 小数の浮動小数点誤差を除いて短く表記する（例: 0.30000000000000004 -> 0.3） */
export function formatNumber(value: number): string {
  const rounded = Number(value.toFixed(3));
  return String(Object.is(rounded, -0) ? 0 : rounded);
}

export function clampDuration(value: number): number {
  const v = finiteOr(value, 1);
  return Math.min(MAX_DURATION, Math.max(MIN_DURATION, Number(v.toFixed(2))));
}

export function clampDelay(value: number): number {
  const v = finiteOr(value, 0);
  return Math.min(MAX_DELAY, Math.max(MIN_DELAY, Number(v.toFixed(2))));
}

export function clampIterations(value: number): number {
  const v = finiteOr(value, 1);
  return Math.min(MAX_ITERATIONS, Math.max(1, Math.round(v)));
}

/** cubic-bezier の x は仕様上 0〜1 に制限される。y は極端な値を避けるため -3〜3 に丸める */
export function clampBezierX(value: number): number {
  return Math.min(1, Math.max(0, Number(finiteOr(value, 0).toFixed(2))));
}

export function clampBezierY(value: number): number {
  return Math.min(3, Math.max(-3, Number(finiteOr(value, 0).toFixed(2))));
}

export function clampBezier(b: CubicBezier): CubicBezier {
  return {
    x1: clampBezierX(b.x1),
    y1: clampBezierY(b.y1),
    x2: clampBezierX(b.x2),
    y2: clampBezierY(b.y2),
  };
}

/** animation ショートハンドの他の値と衝突するキーワード（名前として使うと解釈が変わる） */
const RESERVED_NAMES = new Set([
  'none',
  'infinite',
  'normal',
  'reverse',
  'alternate',
  'alternate-reverse',
  'forwards',
  'backwards',
  'both',
  'running',
  'paused',
  'ease',
  'ease-in',
  'ease-out',
  'ease-in-out',
  'linear',
  'step-start',
  'step-end',
  'initial',
  'inherit',
  'unset',
  'revert',
  'revert-layer',
  'default',
]);

/** keyframes名として安全な識別子に整える（英数字・ハイphen・アンダースコアのみ） */
export function sanitizeAnimationName(raw: string, fallback = 'my-animation') {
  let name = raw
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^A-Za-z0-9_-]/g, '');
  // 数字始まり・ハイフン+数字・"--"始まりはそのままでは識別子にならない
  name = name.replace(/^[-_]*[0-9][-_0-9]*/, '').replace(/^--+/, '-');
  name = name.replace(/^-+$/, '');
  if (name === '') return fallback;
  if (RESERVED_NAMES.has(name.toLowerCase())) return `${name}-anim`;
  return name;
}

export function buildTimingFunction(
  easing: EasingId,
  bezier: CubicBezier,
): string {
  if (KEYWORD_EASINGS.includes(easing)) return easing;
  const b =
    easing === 'custom'
      ? clampBezier(bezier)
      : EASING_BEZIERS[easing as PresetEasingId];
  return `cubic-bezier(${formatNumber(b.x1)}, ${formatNumber(b.y1)}, ${formatNumber(b.x2)}, ${formatNumber(b.y2)})`;
}

function expandKeyframes(
  preset: PresetId,
): { offset: number; props: Record<string, string> }[] {
  const out: { offset: number; props: Record<string, string> }[] = [];
  for (const kf of PRESETS[preset]) {
    for (const offset of kf.offsets) out.push({ offset, props: kf.props });
  }
  return out.sort((a, b) => a.offset - b.offset);
}

function formatDeclarations(props: Record<string, string>): string {
  return Object.entries(props)
    .map(([k, v]) => `${k}: ${v};`)
    .join(' ');
}

/** `@keyframes name { ... }` ブロック */
export function buildKeyframesRule(name: string, preset: PresetId): string {
  const lines = PRESETS[preset]
    .map((kf) => ({ kf, first: Math.min(...kf.offsets) }))
    .sort((a, b) => a.first - b.first)
    .map(({ kf }) => {
      const selector = [...kf.offsets]
        .sort((a, b) => a - b)
        .map((o) => `${o}%`)
        .join(', ');
      return `  ${selector} { ${formatDeclarations(kf.props)} }`;
    });
  return `@keyframes ${name} {\n${lines.join('\n')}\n}`;
}

export function buildIterationValue(iterations: number | 'infinite'): string {
  return iterations === 'infinite'
    ? 'infinite'
    : String(clampIterations(iterations));
}

/** `animation: ...` ショートハンドの値部分 */
export function buildAnimationValue(config: AnimationConfig): string {
  const name = sanitizeAnimationName(config.name, config.preset);
  return [
    name,
    `${formatNumber(clampDuration(config.duration))}s`,
    buildTimingFunction(config.easing, config.bezier),
    `${formatNumber(clampDelay(config.delay))}s`,
    buildIterationValue(config.iterations),
    config.direction,
    config.fillMode,
  ].join(' ');
}

export const TARGET_SELECTOR = '.animated-element';

/** コピー用のCSS全体（@keyframes + クラス + 任意で prefers-reduced-motion） */
export function buildCss(config: AnimationConfig): string {
  const name = sanitizeAnimationName(config.name, config.preset);
  const parts = [
    buildKeyframesRule(name, config.preset),
    `${TARGET_SELECTOR} {\n  animation: ${buildAnimationValue(config)};\n}`,
  ];
  if (config.reducedMotion) {
    parts.push(
      `@media (prefers-reduced-motion: reduce) {\n  ${TARGET_SELECTOR} {\n    animation: none;\n  }\n}`,
    );
  }
  return parts.join('\n\n');
}

function toCamelCase(prop: string): string {
  return prop.replace(/-([a-z])/g, (_, c: string) => c.toUpperCase());
}

/** Web Animations API の `element.animate()` に渡すキーフレーム。CSSと同様に区間ごとにイージングを適用する */
export function toWebAnimationKeyframes(
  preset: PresetId,
  timingFunction: string,
): Record<string, string | number>[] {
  return expandKeyframes(preset).map(({ offset, props }) => {
    const frame: Record<string, string | number> = {
      offset: offset / 100,
      easing: timingFunction,
    };
    for (const [k, v] of Object.entries(props)) frame[toCamelCase(k)] = v;
    return frame;
  });
}

/** イージングカーブを描くSVGパス。size四方、パディングpadの内側に描き、yは上向きが正 */
export function buildCurvePath(b: CubicBezier, size = 120, pad = 20): string {
  const inner = size - pad * 2;
  const px = (x: number) => formatNumber(pad + x * inner);
  const py = (y: number) => formatNumber(pad + (1 - y) * inner);
  return `M${px(0)},${py(0)} C${px(b.x1)},${py(b.y1)} ${px(b.x2)},${py(b.y2)} ${px(1)},${py(1)}`;
}
