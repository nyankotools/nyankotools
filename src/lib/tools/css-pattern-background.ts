/** パターンの種類 */
export type PatternKind = 'stripe' | 'dot' | 'check';
export const PATTERN_KINDS: PatternKind[] = ['stripe', 'dot', 'check'];

/** 出力形式。css=グラデーションのCSS / svg=SVG（data URI付き） */
export type OutputMode = 'css' | 'svg';
export const OUTPUT_MODES: OutputMode[] = ['css', 'svg'];

export interface PatternParams {
  kind: PatternKind;
  /** 背景色（#rrggbb） */
  baseColor: string;
  /** パターンの色（#rrggbb） */
  patternColor: string;
  /** 1タイルの大きさpx（checkは1マスの大きさ） */
  size: number;
  /** ストライプの角度（0〜359度。CSSのlinear-gradientと同じ向き） */
  angle: number;
  /** ストライプの太さ / ドットの直径（タイルに対する%） */
  ratio: number;
}

export const SIZE_MIN = 4;
export const SIZE_MAX = 100;
export const RATIO_MIN = 10;
export const RATIO_MAX = 90;

export const DEFAULT_PATTERN: PatternParams = {
  kind: 'stripe',
  baseColor: '#ffffff',
  patternColor: '#2563eb',
  size: 20,
  angle: 45,
  ratio: 50,
};

export interface PatternPreset {
  id: string;
  params: Partial<PatternParams>;
}

export const PATTERN_PRESETS: PatternPreset[] = [
  {
    id: 'diagonal',
    params: {
      kind: 'stripe',
      angle: 45,
      size: 20,
      ratio: 50,
      baseColor: '#ffffff',
      patternColor: '#2563eb',
    },
  },
  {
    id: 'horizontal',
    params: {
      kind: 'stripe',
      angle: 0,
      size: 16,
      ratio: 30,
      baseColor: '#f1f5f9',
      patternColor: '#94a3b8',
    },
  },
  {
    id: 'polka',
    params: {
      kind: 'dot',
      size: 24,
      ratio: 40,
      baseColor: '#fff7ed',
      patternColor: '#fb923c',
    },
  },
  {
    id: 'dots-fine',
    params: {
      kind: 'dot',
      size: 10,
      ratio: 30,
      baseColor: '#0f172a',
      patternColor: '#64748b',
    },
  },
  {
    id: 'checker',
    params: {
      kind: 'check',
      size: 20,
      baseColor: '#ffffff',
      patternColor: '#e2e8f0',
    },
  },
];

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

/** 不正値を補正する。色は#hex検証済みの値だけが残る */
export function clampPattern(p: PatternParams): PatternParams {
  const angle = Number.isFinite(p.angle) ? Math.round(p.angle) : 0;
  return {
    kind: PATTERN_KINDS.includes(p.kind) ? p.kind : DEFAULT_PATTERN.kind,
    baseColor: normalizeHex(p.baseColor, DEFAULT_PATTERN.baseColor),
    patternColor: normalizeHex(p.patternColor, DEFAULT_PATTERN.patternColor),
    size: clampInt(p.size, SIZE_MIN, SIZE_MAX),
    angle: ((angle % 360) + 360) % 360,
    ratio: clampInt(p.ratio, RATIO_MIN, RATIO_MAX),
  };
}

/** 種類ごとに有効なオプション（UIの表示切替用） */
export function applicableFields(kind: PatternKind): {
  angle: boolean;
  ratio: boolean;
} {
  return { angle: kind === 'stripe', ratio: kind !== 'check' };
}

/** 数値を小数第2位までの文字列にする（末尾の0は落とす） */
function num(n: number): string {
  return String(Math.round(n * 100) / 100);
}

/** プレビュー用のスタイル（CSSOMで直接設定する値） */
export interface PatternStyle {
  backgroundColor: string;
  backgroundImage: string;
  /** 空文字なら指定なし */
  backgroundSize: string;
}

export interface PatternResult {
  /** グラデーション方式のCSS */
  css: string;
  style: PatternStyle;
  /** 単体で使えるSVG（幅・高さは100%。パターンは固定pxで繰り返す） */
  svg: string;
  /** SVGをdata URIにしたもの（`data:image/svg+xml,...`） */
  svgDataUri: string;
  /** data URIを背景に指定するCSS */
  svgCss: string;
}

/** SVG文字列をCSSの `url("...")` に入れられるdata URIにする */
export function svgToDataUri(svg: string): string {
  const body = svg
    .replace(/\s+/g, ' ')
    .replace(/> </g, '><')
    .trim()
    .replace(/"/g, "'")
    .replace(/%/g, '%25')
    .replace(/#/g, '%23')
    .replace(/</g, '%3C')
    .replace(/>/g, '%3E');
  return `data:image/svg+xml,${body}`;
}

function buildStyle(p: PatternParams): PatternStyle {
  const { baseColor: c1, patternColor: c2, size } = p;
  switch (p.kind) {
    case 'stripe': {
      const w = Math.min(
        size - 1,
        Math.max(1, Math.round((size * p.ratio) / 100)),
      );
      return {
        backgroundColor: c1,
        backgroundImage: `repeating-linear-gradient(${p.angle}deg, ${c2} 0 ${w}px, ${c1} ${w}px ${size}px)`,
        backgroundSize: '',
      };
    }
    case 'dot': {
      const r = (size * p.ratio) / 200;
      return {
        backgroundColor: c1,
        backgroundImage: `radial-gradient(circle, ${c2} ${num(r)}px, ${c1} ${num(r + 1)}px)`,
        backgroundSize: `${size}px ${size}px`,
      };
    }
    case 'check': {
      const tile = size * 2;
      return {
        backgroundColor: c1,
        backgroundImage: `conic-gradient(${c2} 25%, ${c1} 0 50%, ${c2} 0 75%, ${c1} 0)`,
        backgroundSize: `${tile}px ${tile}px`,
      };
    }
  }
}

function buildSvg(p: PatternParams): string {
  const { baseColor: c1, patternColor: c2, size } = p;
  let tile: number;
  let shapes: string;
  let transform = '';
  switch (p.kind) {
    case 'stripe': {
      const w = Math.min(
        size - 1,
        Math.max(1, Math.round((size * p.ratio) / 100)),
      );
      tile = size;
      shapes = `<rect width='${w}' height='${size}' fill='${c2}'/>`;
      const rot = (((p.angle - 90) % 360) + 360) % 360;
      if (rot !== 0) transform = ` patternTransform='rotate(${rot})'`;
      break;
    }
    case 'dot': {
      tile = size;
      const r = (size * p.ratio) / 200;
      shapes = `<circle cx='${num(size / 2)}' cy='${num(size / 2)}' r='${num(r)}' fill='${c2}'/>`;
      break;
    }
    case 'check': {
      tile = size * 2;
      shapes =
        `<rect x='${size}' width='${size}' height='${size}' fill='${c2}'/>` +
        `<rect y='${size}' width='${size}' height='${size}' fill='${c2}'/>`;
      break;
    }
  }
  return (
    `<svg xmlns='http://www.w3.org/2000/svg' width='100%' height='100%'>` +
    `<defs><pattern id='p' width='${tile}' height='${tile}' patternUnits='userSpaceOnUse'${transform}>` +
    `<rect width='${tile}' height='${tile}' fill='${c1}'/>${shapes}</pattern></defs>` +
    `<rect width='100%' height='100%' fill='url(#p)'/></svg>`
  );
}

/** CSSとSVGを生成する。入力は必ず {@link clampPattern} を通す */
export function buildPattern(params: PatternParams): PatternResult {
  const p = clampPattern(params);
  const style = buildStyle(p);
  const lines = [
    `background-color: ${style.backgroundColor};`,
    `background-image: ${style.backgroundImage};`,
  ];
  if (style.backgroundSize)
    lines.push(`background-size: ${style.backgroundSize};`);
  const svg = buildSvg(p);
  const svgDataUri = svgToDataUri(svg);
  return {
    css: lines.join('\n'),
    style,
    svg,
    svgDataUri,
    svgCss: `background-image: url("${svgDataUri}");`,
  };
}
