/** 部品の種類 */
export type PartKind = 'button' | 'toggle' | 'triangle' | 'arrow';
export const PART_KINDS: PartKind[] = ['button', 'toggle', 'triangle', 'arrow'];

export type ButtonStyle = 'solid' | 'outline' | 'soft';
export const BUTTON_STYLES: ButtonStyle[] = ['solid', 'outline', 'soft'];

/** ホバー時の変化。none=なし / color=色の変化 / lift=浮き上がり / both=両方 */
export type HoverEffect = 'none' | 'color' | 'lift' | 'both';
export const HOVER_EFFECTS: HoverEffect[] = ['none', 'color', 'lift', 'both'];

export type Direction = 'up' | 'right' | 'down' | 'left';
export const DIRECTIONS: Direction[] = ['up', 'right', 'down', 'left'];

export interface PartParams {
  kind: PartKind;
  /** テーマ色（#rrggbb） */
  color: string;
  /** ボタンのスタイル（buttonのみ） */
  buttonStyle: ButtonStyle;
  hover: HoverEffect;
  /** 角丸px（button / toggle） */
  radius: number;
  /** 大きさpx。範囲は種類ごと（{@link sizeRange}） */
  size: number;
  /** 向き（triangle / arrow） */
  direction: Direction;
  /** 矢印の線の太さpx（arrowのみ） */
  thickness: number;
  /** ラベル文字（button / toggle）。最大30文字 */
  label: string;
}

/** 出力CSSのクラス名の接頭辞（他のCSSと衝突しにくくする） */
export const CLASS_PREFIX = 'nk';

export const DEFAULT_PART: PartParams = {
  kind: 'button',
  color: '#2563eb',
  buttonStyle: 'solid',
  hover: 'both',
  radius: 8,
  size: 16,
  direction: 'right',
  thickness: 3,
  label: 'Button',
};

export interface SizeRange {
  min: number;
  max: number;
  default: number;
}

export function sizeRange(kind: PartKind): SizeRange {
  switch (kind) {
    case 'button':
      return { min: 12, max: 32, default: 16 };
    case 'toggle':
      return { min: 20, max: 48, default: 28 };
    case 'triangle':
      return { min: 8, max: 80, default: 40 };
    case 'arrow':
      return { min: 8, max: 48, default: 20 };
  }
}

/** プリセット（種類を切り替えたときの初期値） */
export interface PartPreset {
  id: string;
  params: Partial<PartParams>;
}

export const PART_PRESETS: Record<PartKind, PartPreset[]> = {
  button: [
    { id: 'solid', params: { buttonStyle: 'solid', radius: 8, hover: 'both' } },
    {
      id: 'outline',
      params: { buttonStyle: 'outline', radius: 8, hover: 'color' },
    },
    { id: 'soft', params: { buttonStyle: 'soft', radius: 8, hover: 'color' } },
    { id: 'pill', params: { buttonStyle: 'solid', radius: 60, hover: 'lift' } },
  ],
  toggle: [
    { id: 'round', params: { radius: 50, hover: 'color' } },
    { id: 'square', params: { radius: 4, hover: 'color' } },
  ],
  triangle: [
    { id: 'up', params: { direction: 'up' } },
    { id: 'down', params: { direction: 'down' } },
    { id: 'left', params: { direction: 'left' } },
    { id: 'right', params: { direction: 'right' } },
  ],
  arrow: [
    { id: 'right', params: { direction: 'right', thickness: 3 } },
    { id: 'down', params: { direction: 'down', thickness: 3 } },
    { id: 'thick', params: { direction: 'right', thickness: 6 } },
  ],
};

function clampInt(value: number, min: number, max: number): number {
  if (!Number.isFinite(value)) return min;
  return Math.min(max, Math.max(min, Math.round(value)));
}

/** `#rgb` / `#rrggbb` を小文字の `#rrggbb` に正規化する。不正値は fallback */
export function normalizeHex(value: string, fallback: string): string {
  const m = /^#?([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(String(value).trim());
  if (!m) return fallback;
  let hex = m[1].toLowerCase();
  if (hex.length === 3) {
    hex = hex
      .split('')
      .map((c) => c + c)
      .join('');
  }
  return `#${hex}`;
}

export function hexToRgb(hex: string): [number, number, number] {
  const h = normalizeHex(hex, '#000000').slice(1);
  return [
    parseInt(h.slice(0, 2), 16),
    parseInt(h.slice(2, 4), 16),
    parseInt(h.slice(4, 6), 16),
  ];
}

function toHex(n: number): string {
  return Math.min(255, Math.max(0, Math.round(n)))
    .toString(16)
    .padStart(2, '0');
}

/** amount > 0 で白へ、< 0 で黒へ近づける（-1〜1） */
export function shade(hex: string, amount: number): string {
  const [r, g, b] = hexToRgb(hex);
  const a = Math.min(1, Math.max(-1, amount));
  const f = (c: number) => (a >= 0 ? c + (255 - c) * a : c * (1 + a));
  return `#${toHex(f(r))}${toHex(f(g))}${toHex(f(b))}`;
}

function rgba(hex: string, alpha: number): string {
  const [r, g, b] = hexToRgb(hex);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

/** 相対輝度（WCAG 2.x） */
export function relativeLuminance(hex: string): number {
  const [r, g, b] = hexToRgb(hex).map((c) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/** コントラスト比（1〜21、小数第2位まで） */
export function contrastRatio(a: string, b: string): number {
  const la = relativeLuminance(a);
  const lb = relativeLuminance(b);
  const hi = Math.max(la, lb);
  const lo = Math.min(la, lb);
  return Math.round(((hi + 0.05) / (lo + 0.05)) * 100) / 100;
}

const DARK_TEXT = '#111827';
const LIGHT_TEXT = '#ffffff';

/** 背景色の上で読みやすい方の文字色（白 or 濃紺グレー） */
export function pickTextColor(bg: string): string {
  return contrastRatio(bg, LIGHT_TEXT) >= contrastRatio(bg, DARK_TEXT)
    ? LIGHT_TEXT
    : DARK_TEXT;
}

export function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/** 不正値を補正する。色は#hex検証済みの値だけが残る */
export function clampPart(p: PartParams): PartParams {
  const kind = PART_KINDS.includes(p.kind) ? p.kind : DEFAULT_PART.kind;
  const range = sizeRange(kind);
  const label = String(p.label ?? '')
    .replace(/[\r\n]+/g, ' ')
    .trim()
    .slice(0, 30);
  return {
    kind,
    color: normalizeHex(p.color, DEFAULT_PART.color),
    buttonStyle: BUTTON_STYLES.includes(p.buttonStyle)
      ? p.buttonStyle
      : 'solid',
    hover: HOVER_EFFECTS.includes(p.hover) ? p.hover : 'none',
    radius: clampInt(p.radius, 0, 60),
    size: clampInt(p.size, range.min, range.max),
    direction: DIRECTIONS.includes(p.direction) ? p.direction : 'right',
    thickness: clampInt(p.thickness, 1, 10),
    label,
  };
}

/** 部品に適用できるオプション（UIの表示切替用） */
export function applicableFields(kind: PartKind): {
  buttonStyle: boolean;
  radius: boolean;
  direction: boolean;
  thickness: boolean;
  label: boolean;
  lift: boolean;
} {
  return {
    buttonStyle: kind === 'button',
    radius: kind === 'button' || kind === 'toggle',
    direction: kind === 'triangle' || kind === 'arrow',
    thickness: kind === 'arrow',
    label: kind === 'button' || kind === 'toggle',
    lift: kind !== 'toggle',
  };
}

export interface PartCode {
  html: string;
  css: string;
}

function hasColorHover(h: HoverEffect): boolean {
  return h === 'color' || h === 'both';
}
function hasLiftHover(h: HoverEffect, kind: PartKind): boolean {
  return kind !== 'toggle' && (h === 'lift' || h === 'both');
}

/** ブロックを組み立てる（宣言は2スペースインデント） */
function block(selector: string, decls: string[]): string {
  return `${selector} {\n${decls.map((d) => `  ${d}`).join('\n')}\n}`;
}

const REDUCED_MOTION = (selectors: string) =>
  `@media (prefers-reduced-motion: reduce) {\n  ${selectors} {\n    transition: none;\n  }\n}`;

interface ButtonColors {
  bg: string;
  text: string;
  border: string;
  hoverBg: string;
  hoverText: string;
  hoverBorder: string;
}

export function buttonColors(color: string, style: ButtonStyle): ButtonColors {
  if (style === 'outline') {
    return {
      bg: '#ffffff',
      text: color,
      border: color,
      hoverBg: color,
      hoverText: pickTextColor(color),
      hoverBorder: color,
    };
  }
  if (style === 'soft') {
    const bg = shade(color, 0.85);
    const hoverBg = shade(color, 0.7);
    const text = shade(color, -0.55);
    return {
      bg,
      text,
      border: bg,
      hoverBg,
      hoverText: text,
      hoverBorder: hoverBg,
    };
  }
  const dark = shade(color, -0.15);
  return {
    bg: color,
    text: pickTextColor(color),
    border: color,
    hoverBg: dark,
    hoverText: pickTextColor(dark),
    hoverBorder: dark,
  };
}

function buildButton(p: PartParams): PartCode {
  const c = `${CLASS_PREFIX}-btn`;
  const col = buttonColors(p.color, p.buttonStyle);
  const padY = Math.round(p.size * 0.6);
  const padX = Math.round(p.size * 1.4);
  const parts: string[] = [
    block(`.${c}`, [
      'display: inline-block;',
      `padding: ${padY}px ${padX}px;`,
      'font-family: inherit;',
      `font-size: ${p.size}px;`,
      'font-weight: 600;',
      'line-height: 1.2;',
      `color: ${col.text};`,
      `background-color: ${col.bg};`,
      `border: 2px solid ${col.border};`,
      `border-radius: ${p.radius}px;`,
      'cursor: pointer;',
      'transition: background-color 0.2s, color 0.2s, border-color 0.2s, transform 0.2s, box-shadow 0.2s;',
    ]),
  ];
  const hoverDecls: string[] = [];
  if (hasColorHover(p.hover)) {
    hoverDecls.push(
      `color: ${col.hoverText};`,
      `background-color: ${col.hoverBg};`,
      `border-color: ${col.hoverBorder};`,
    );
  }
  const lift = hasLiftHover(p.hover, p.kind);
  if (lift) {
    hoverDecls.push(
      'transform: translateY(-2px);',
      `box-shadow: 0 6px 14px ${rgba(p.color, 0.35)};`,
    );
  }
  if (hoverDecls.length > 0) parts.push(block(`.${c}:hover`, hoverDecls));
  if (lift) parts.push(block(`.${c}:active`, ['transform: translateY(0);']));
  parts.push(
    block(`.${c}:focus-visible`, [
      `outline: 3px solid ${rgba(p.color, 0.45)};`,
      'outline-offset: 2px;',
    ]),
  );
  parts.push(REDUCED_MOTION(`.${c}`));
  const label = escapeHtml(p.label || DEFAULT_PART.label);
  return {
    html: `<button type="button" class="${c}">${label}</button>`,
    css: parts.join('\n\n'),
  };
}

function buildToggle(p: PartParams): PartCode {
  const root = `${CLASS_PREFIX}-toggle`;
  const input = `${root}__input`;
  const track = `${root}__track`;
  const height = p.size;
  const width = Math.round(p.size * 1.8);
  const pad = 3;
  const knob = height - pad * 2;
  const shift = width - height;
  const trackRadius = Math.min(p.radius, Math.floor(height / 2));
  const knobRadius = Math.max(0, trackRadius - pad);
  const off = '#cbd5e1';
  const offHover = '#94a3b8';
  const onHover = shade(p.color, -0.15);
  const parts: string[] = [
    block(`.${root}`, [
      'position: relative;',
      'display: inline-flex;',
      'align-items: center;',
      'gap: 10px;',
      'cursor: pointer;',
    ]),
    block(`.${input}`, [
      'position: absolute;',
      'width: 1px;',
      'height: 1px;',
      'opacity: 0;',
    ]),
    block(`.${track}`, [
      'position: relative;',
      'flex-shrink: 0;',
      `width: ${width}px;`,
      `height: ${height}px;`,
      `background-color: ${off};`,
      `border-radius: ${trackRadius}px;`,
      'transition: background-color 0.2s;',
    ]),
    block(`.${track}::after`, [
      'content: "";',
      'position: absolute;',
      `top: ${pad}px;`,
      `left: ${pad}px;`,
      `width: ${knob}px;`,
      `height: ${knob}px;`,
      'background-color: #ffffff;',
      `border-radius: ${knobRadius}px;`,
      'box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);',
      'transition: transform 0.2s;',
    ]),
    block(`.${input}:checked + .${track}`, [`background-color: ${p.color};`]),
    block(`.${input}:checked + .${track}::after`, [
      `transform: translateX(${shift}px);`,
    ]),
  ];
  if (hasColorHover(p.hover)) {
    parts.push(
      block(`.${root}:hover .${track}`, [`background-color: ${offHover};`]),
      block(`.${root}:hover .${input}:checked + .${track}`, [
        `background-color: ${onHover};`,
      ]),
    );
  }
  parts.push(
    block(`.${input}:focus-visible + .${track}`, [
      `outline: 3px solid ${rgba(p.color, 0.45)};`,
      'outline-offset: 2px;',
    ]),
    REDUCED_MOTION(`.${track},\n  .${track}::after`),
  );
  const text = p.label ? `\n  <span>${escapeHtml(p.label)}</span>` : '';
  const aria = p.label ? '' : ' aria-label="Toggle"';
  const html = `<label class="${root}">\n  <input type="checkbox" class="${input}"${aria}>\n  <span class="${track}"></span>${text}\n</label>`;
  return { html, css: parts.join('\n\n') };
}

function buildTriangle(p: PartParams): PartCode {
  const c = `${CLASS_PREFIX}-triangle`;
  const half = Math.round(p.size / 2);
  const depth = Math.round(p.size * 0.866);
  const t = 'transparent';
  let width: string;
  let colors: string;
  switch (p.direction) {
    case 'up':
      width = `0 ${half}px ${depth}px ${half}px`;
      colors = `${t} ${t} ${p.color} ${t}`;
      break;
    case 'down':
      width = `${depth}px ${half}px 0 ${half}px`;
      colors = `${p.color} ${t} ${t} ${t}`;
      break;
    case 'left':
      width = `${half}px ${depth}px ${half}px 0`;
      colors = `${t} ${p.color} ${t} ${t}`;
      break;
    case 'right':
      width = `${half}px 0 ${half}px ${depth}px`;
      colors = `${t} ${t} ${t} ${p.color}`;
      break;
  }
  const parts: string[] = [
    block(`.${c}`, [
      'display: inline-block;',
      'width: 0;',
      'height: 0;',
      'border-style: solid;',
      `border-width: ${width};`,
      `border-color: ${colors};`,
      'transition: border-color 0.2s, translate 0.2s;',
    ]),
  ];
  const hoverDecls: string[] = [];
  if (hasColorHover(p.hover)) {
    const d = shade(p.color, -0.2);
    const hovered = colors.split(p.color).join(d);
    hoverDecls.push(`border-color: ${hovered};`);
  }
  if (hasLiftHover(p.hover, p.kind)) hoverDecls.push('translate: 0 -3px;');
  if (hoverDecls.length > 0) parts.push(block(`.${c}:hover`, hoverDecls));
  parts.push(REDUCED_MOTION(`.${c}`));
  return {
    html: `<span class="${c}" aria-hidden="true"></span>`,
    css: parts.join('\n\n'),
  };
}

function buildArrow(p: PartParams): PartCode {
  const c = `${CLASS_PREFIX}-arrow`;
  const angle: Record<Direction, number> = {
    up: -45,
    right: 45,
    down: 135,
    left: 225,
  };
  const parts: string[] = [
    block(`.${c}`, [
      'display: inline-block;',
      `width: ${p.size}px;`,
      `height: ${p.size}px;`,
      `border-top: ${p.thickness}px solid ${p.color};`,
      `border-right: ${p.thickness}px solid ${p.color};`,
      `transform: rotate(${angle[p.direction]}deg);`,
      'transition: border-color 0.2s, translate 0.2s;',
    ]),
  ];
  const hoverDecls: string[] = [];
  if (hasColorHover(p.hover)) {
    const d = shade(p.color, -0.2);
    hoverDecls.push(`border-top-color: ${d};`, `border-right-color: ${d};`);
  }
  if (hasLiftHover(p.hover, p.kind)) hoverDecls.push('translate: 0 -3px;');
  if (hoverDecls.length > 0) parts.push(block(`.${c}:hover`, hoverDecls));
  parts.push(REDUCED_MOTION(`.${c}`));
  return {
    html: `<span class="${c}" aria-hidden="true"></span>`,
    css: parts.join('\n\n'),
  };
}

/** HTMLとCSSを生成する。入力は必ず {@link clampPart} を通す */
export function buildPartCode(params: PartParams): PartCode {
  const p = clampPart(params);
  switch (p.kind) {
    case 'button':
      return buildButton(p);
    case 'toggle':
      return buildToggle(p);
    case 'triangle':
      return buildTriangle(p);
    case 'arrow':
      return buildArrow(p);
  }
}

export interface ContrastReport {
  /** 通常時の比率 */
  normal: number;
  /** ホバー時の比率（色が変わらない場合は null） */
  hover: number | null;
  /** 合格の目安（文字=4.5 / 図形=3） */
  threshold: 4.5 | 3;
}

/**
 * コントラストの簡易判定。
 * button: 文字色と背景色（outline は白背景を想定）。それ以外: 図形の色と白背景。
 */
export function contrastReport(params: PartParams): ContrastReport {
  const p = clampPart(params);
  if (p.kind === 'button') {
    const col = buttonColors(p.color, p.buttonStyle);
    return {
      normal: contrastRatio(col.text, col.bg),
      hover: hasColorHover(p.hover)
        ? contrastRatio(col.hoverText, col.hoverBg)
        : null,
      threshold: 4.5,
    };
  }
  const white = '#ffffff';
  const hoverColor =
    p.kind === 'toggle' ? shade(p.color, -0.15) : shade(p.color, -0.2);
  return {
    normal: contrastRatio(p.color, white),
    hover: hasColorHover(p.hover) ? contrastRatio(hoverColor, white) : null,
    threshold: 3,
  };
}
