// SVG path の d 属性をコマンド別に分解し、制御点・始終点を可視化するための純粋ロジック。

export interface Point {
  x: number;
  y: number;
}

export interface ControlPoint extends Point {
  /** 制御点がつながる側の端点（from: 始点側 / to: 終点側） */
  anchor: 'from' | 'to';
  /** S / T で前のセグメントから自動計算された制御点 */
  implicit: boolean;
}

export interface PathSegment {
  index: number;
  /** 記述どおりのコマンド文字（c, L など。M の2組目以降は暗黙の l / L） */
  command: string;
  /** 大文字のコマンド文字 */
  type: string;
  relative: boolean;
  /** 記述どおりの引数 */
  args: number[];
  /** 絶対座標に直した引数（H / V は1個、A は rx ry rot large sweep x y） */
  absArgs: number[];
  from: Point;
  to: Point;
  controls: ControlPoint[];
}

export type ParseErrorCode =
  | 'empty'
  | 'invalid-char'
  | 'must-start-with-move'
  | 'missing-args'
  | 'invalid-flag'
  | 'unexpected-number';

export interface ParseError {
  code: ParseErrorCode;
  /** d 文字列内の位置（0始まり） */
  position: number;
}

export interface ParseResult {
  segments: PathSegment[];
  error: ParseError | null;
}

export const ARG_COUNTS: Readonly<Record<string, number>> = {
  M: 2,
  L: 2,
  H: 1,
  V: 1,
  C: 6,
  S: 4,
  Q: 4,
  T: 2,
  A: 7,
  Z: 0,
};

const NUMBER_RE = /[+-]?(?:\d+\.?\d*|\.\d+)(?:[eE][+-]?\d+)?/y;
const NUMBER_START = /[0-9.+-]/;

function isSpace(ch: string): boolean {
  return ch === ' ' || ch === '\t' || ch === '\n' || ch === '\r' || ch === '\f';
}

function isCommandLetter(ch: string): boolean {
  return /^[MmLlHhVvCcSsQqTtAaZz]$/.test(ch);
}

/** d 属性をパースする。エラー時もそれまでに読めたセグメントを返す。 */
export function parsePath(d: string): ParseResult {
  const segments: PathSegment[] = [];
  const len = d.length;
  let pos = 0;

  const skipSep = () => {
    while (pos < len && (isSpace(d[pos]) || d[pos] === ',')) pos++;
  };
  const fail = (code: ParseErrorCode, position = pos): ParseResult => ({
    segments,
    error: { code, position },
  });

  skipSep();
  if (pos >= len) return fail('empty', 0);

  let cur: Point = { x: 0, y: 0 };
  let start: Point = { x: 0, y: 0 };
  let prevType = '';
  let prevCubic: Point | null = null;
  let prevQuad: Point | null = null;
  let first = true;

  while (pos < len) {
    const ch = d[pos];
    if (NUMBER_START.test(ch)) return fail('unexpected-number');
    if (!isCommandLetter(ch)) return fail('invalid-char');
    let command = ch;
    pos++;
    if (first && command.toUpperCase() !== 'M') {
      return fail('must-start-with-move', pos - 1);
    }
    first = false;

    if (command.toUpperCase() === 'Z') {
      segments.push({
        index: segments.length,
        command,
        type: 'Z',
        relative: command === 'z',
        args: [],
        absArgs: [],
        from: { ...cur },
        to: { ...start },
        controls: [],
      });
      cur = { ...start };
      prevType = 'Z';
      prevCubic = null;
      prevQuad = null;
      skipSep();
      if (pos < len && NUMBER_START.test(d[pos])) {
        return fail('unexpected-number');
      }
      continue;
    }

    let groupNo = 0;
    for (;;) {
      skipSep();
      if (groupNo > 0 && (pos >= len || !NUMBER_START.test(d[pos]))) break;
      const upper = command.toUpperCase();
      const count = ARG_COUNTS[upper];
      const args: number[] = [];
      for (let i = 0; i < count; i++) {
        skipSep();
        if (pos >= len) return fail('missing-args');
        if (upper === 'A' && (i === 3 || i === 4)) {
          const flag = d[pos];
          if (flag !== '0' && flag !== '1') return fail('invalid-flag');
          args.push(Number(flag));
          pos++;
          continue;
        }
        NUMBER_RE.lastIndex = pos;
        const m = NUMBER_RE.exec(d);
        if (!m) return fail('missing-args');
        args.push(Number(m[0]));
        pos += m[0].length;
      }
      const seg = buildSegment(
        segments.length,
        command,
        upper,
        command !== upper,
        args,
        cur,
        prevType,
        prevCubic,
        prevQuad,
      );
      segments.push(seg);
      cur = { ...seg.to };
      if (upper === 'M') start = { ...seg.to };
      prevType = upper;
      prevCubic =
        upper === 'C' || upper === 'S'
          ? { x: seg.controls[1].x, y: seg.controls[1].y }
          : null;
      prevQuad =
        upper === 'Q' || upper === 'T'
          ? { x: seg.controls[0].x, y: seg.controls[0].y }
          : null;
      // M の後ろに座標が続く場合は暗黙の L
      if (upper === 'M') command = command === 'm' ? 'l' : 'L';
      groupNo++;
    }
  }
  return { segments, error: null };
}

function buildSegment(
  index: number,
  command: string,
  type: string,
  relative: boolean,
  args: number[],
  cur: Point,
  prevType: string,
  prevCubic: Point | null,
  prevQuad: Point | null,
): PathSegment {
  // 最初の m は原点からの相対（cur が原点なのでそのまま足せる）
  const ox = relative ? cur.x : 0;
  const oy = relative ? cur.y : 0;
  const from = { ...cur };
  let to: Point = { ...cur };
  let absArgs: number[] = [];
  const controls: ControlPoint[] = [];
  const ctrl = (
    p: Point,
    anchor: 'from' | 'to',
    implicit = false,
  ): ControlPoint => ({ x: p.x, y: p.y, anchor, implicit });

  switch (type) {
    case 'M':
    case 'L':
      to = { x: args[0] + ox, y: args[1] + oy };
      absArgs = [to.x, to.y];
      break;
    case 'T': {
      to = { x: args[0] + ox, y: args[1] + oy };
      absArgs = [to.x, to.y];
      const c =
        (prevType === 'Q' || prevType === 'T') && prevQuad
          ? { x: 2 * cur.x - prevQuad.x, y: 2 * cur.y - prevQuad.y }
          : { ...cur };
      controls.push(ctrl(c, 'from', true));
      break;
    }
    case 'H':
      to = { x: args[0] + ox, y: cur.y };
      absArgs = [to.x];
      break;
    case 'V':
      to = { x: cur.x, y: args[0] + oy };
      absArgs = [to.y];
      break;
    case 'C': {
      const c1 = { x: args[0] + ox, y: args[1] + oy };
      const c2 = { x: args[2] + ox, y: args[3] + oy };
      to = { x: args[4] + ox, y: args[5] + oy };
      absArgs = [c1.x, c1.y, c2.x, c2.y, to.x, to.y];
      controls.push(ctrl(c1, 'from'), ctrl(c2, 'to'));
      break;
    }
    case 'S': {
      const c1 =
        (prevType === 'C' || prevType === 'S') && prevCubic
          ? { x: 2 * cur.x - prevCubic.x, y: 2 * cur.y - prevCubic.y }
          : { ...cur };
      const c2 = { x: args[0] + ox, y: args[1] + oy };
      to = { x: args[2] + ox, y: args[3] + oy };
      absArgs = [c2.x, c2.y, to.x, to.y];
      controls.push(ctrl(c1, 'from', true), ctrl(c2, 'to'));
      break;
    }
    case 'Q': {
      const c = { x: args[0] + ox, y: args[1] + oy };
      to = { x: args[2] + ox, y: args[3] + oy };
      absArgs = [c.x, c.y, to.x, to.y];
      controls.push(ctrl(c, 'from'));
      break;
    }
    case 'A':
      to = { x: args[5] + ox, y: args[6] + oy };
      absArgs = [args[0], args[1], args[2], args[3], args[4], to.x, to.y];
      break;
  }
  return { index, command, type, relative, args, absArgs, from, to, controls };
}

// ---------------------------------------------------------------------------
// シリアライズ・最適化
// ---------------------------------------------------------------------------

/** 小数を指定桁で丸め、末尾の0と -0 を取り除いた文字列にする */
export function formatNumber(n: number, precision: number): string {
  if (!Number.isFinite(n)) return '0';
  const p = Math.min(Math.max(Math.round(precision), 0), 10);
  let s = n.toFixed(p);
  if (s.includes('.')) s = s.replace(/0+$/, '').replace(/\.$/, '');
  if (s === '-0' || s === '') s = '0';
  return s;
}

export interface SerializeOptions {
  /** 小数桁数（0〜10） */
  precision: number;
  /** 相対コマンドも絶対座標に直す */
  absolute?: boolean;
  /** 区切りを詰め、0.5 を .5 と書くなどサイズ優先で出力する */
  compact?: boolean;
}

function shortNumber(s: string): string {
  return s.replace(/^(-?)0\./, '$1.');
}

/** セグメント列を d 文字列に戻す */
export function serializePath(
  segments: readonly PathSegment[],
  options: SerializeOptions,
): string {
  const compact = options.compact === true;
  const absolute = options.absolute === true;
  let out = '';
  let lastToken = '';
  let prevCmd = '';

  for (const seg of segments) {
    const cmd = absolute ? seg.type : seg.command;
    const values = absolute ? seg.absArgs : seg.args;
    const omitLetter =
      compact && cmd === prevCmd && cmd.toUpperCase() !== 'M' && cmd !== 'Z';
    if (!omitLetter) {
      out += (out !== '' && !compact ? ' ' : '') + cmd;
      lastToken = '';
    }
    values.forEach((v, i) => {
      let s = formatNumber(v, options.precision);
      if (compact) s = shortNumber(s);
      const flagRelated = seg.type === 'A' && i >= 3 && i <= 5;
      let sep = ' ';
      if (i === 0 && !omitLetter) {
        sep = ''; // コマンド文字の直後
      } else if (compact && !flagRelated && s.startsWith('-')) {
        sep = '';
      } else if (
        compact &&
        !flagRelated &&
        s.startsWith('.') &&
        lastToken.includes('.')
      ) {
        sep = '';
      }
      out += sep + s;
      lastToken = s;
    });
    prevCmd = cmd;
  }
  return out;
}

export interface OptimizeResult {
  d: string;
  before: number;
  after: number;
}

/** 小数桁削減などでサイズを減らす。パースできない場合は null */
export function optimizePath(
  d: string,
  options: Omit<SerializeOptions, 'compact'>,
): OptimizeResult | null {
  const { segments, error } = parsePath(d);
  if (error || segments.length === 0) return null;
  const out = serializePath(segments, { ...options, compact: true });
  return { d: out, before: d.trim().length, after: out.length };
}

/** 1つの引数を書き換えた d を返す。範囲外・パース不能は null */
export function updateSegmentArg(
  d: string,
  segmentIndex: number,
  argIndex: number,
  value: number,
): string | null {
  const { segments, error } = parsePath(d);
  if (error || !Number.isFinite(value)) return null;
  const seg = segments[segmentIndex];
  if (!seg || argIndex < 0 || argIndex >= seg.args.length) return null;
  seg.args[argIndex] =
    seg.type === 'A' && (argIndex === 3 || argIndex === 4)
      ? value
        ? 1
        : 0
      : value;
  return serializePath(segments, { precision: 10 });
}

// ---------------------------------------------------------------------------
// 可視化
// ---------------------------------------------------------------------------

export interface Bounds {
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
}

/** 始終点と制御点を含む境界（円弧は端点のみ） */
export function computeBounds(segments: readonly PathSegment[]): Bounds | null {
  if (segments.length === 0) return null;
  const b: Bounds = {
    minX: Infinity,
    minY: Infinity,
    maxX: -Infinity,
    maxY: -Infinity,
  };
  const add = (p: Point) => {
    b.minX = Math.min(b.minX, p.x);
    b.minY = Math.min(b.minY, p.y);
    b.maxX = Math.max(b.maxX, p.x);
    b.maxY = Math.max(b.maxY, p.y);
  };
  for (const s of segments) {
    add(s.from);
    add(s.to);
    for (const c of s.controls) add(c);
  }
  return b;
}

function num(n: number): string {
  return formatNumber(n, 3);
}

/** セグメント1つ分の path 文字列（始点に M を付ける）。M は空文字 */
export function segmentPathData(seg: PathSegment): string {
  if (seg.type === 'M') return '';
  const head = `M${num(seg.from.x)} ${num(seg.from.y)}`;
  if (seg.type === 'Z') return `${head}L${num(seg.to.x)} ${num(seg.to.y)}`;
  return head + serializePath([seg], { precision: 3, absolute: true });
}

export interface OverlayOptions {
  /** 強調表示するセグメント番号 */
  selected?: number | null;
  /** スクリーンリーダー向けの説明 */
  label: string;
  showControls?: boolean;
}

const COLORS = {
  path: '#2563eb',
  fill: 'rgba(37, 99, 235, 0.08)',
  handle: '#c2410c',
  anchor: '#111827',
  start: '#15803d',
  selected: '#dc2626',
};

function escapeAttr(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

/** パスと制御点・始終点を重ねた SVG 文字列。数値と固定文字列だけで組み立てる。 */
export function buildOverlaySvg(
  segments: readonly PathSegment[],
  options: OverlayOptions,
): string {
  const b = computeBounds(segments);
  if (!b) return '';
  const w = Math.max(b.maxX - b.minX, 1);
  const h = Math.max(b.maxY - b.minY, 1);
  const pad = Math.max(w, h) * 0.1;
  const vx = b.minX - pad;
  const vy = b.minY - pad;
  const vw = w + pad * 2;
  const vh = h + pad * 2;
  const unit = Math.max(vw, vh) / 300; // 画面上の約1px
  const sw = unit * 2;
  const r = unit * 4;
  const showControls = options.showControls !== false;

  const full = serializePath(segments, { precision: 3, absolute: true });
  const parts: string[] = [];
  parts.push(
    `<path d="${escapeAttr(full)}" fill="${COLORS.fill}" stroke="${COLORS.path}" stroke-width="${num(sw)}" stroke-linejoin="round"/>`,
  );

  const sel = options.selected;
  if (sel != null && segments[sel]) {
    const sd = segmentPathData(segments[sel]);
    if (sd) {
      parts.push(
        `<path d="${escapeAttr(sd)}" fill="none" stroke="${COLORS.selected}" stroke-width="${num(sw * 2)}" stroke-linecap="round"/>`,
      );
    }
  }

  if (showControls) {
    for (const s of segments) {
      for (const c of s.controls) {
        const a = c.anchor === 'from' ? s.from : s.to;
        parts.push(
          `<line x1="${num(a.x)}" y1="${num(a.y)}" x2="${num(c.x)}" y2="${num(c.y)}" stroke="${COLORS.handle}" stroke-width="${num(sw * 0.6)}" stroke-dasharray="${num(unit * 4)} ${num(unit * 3)}"/>`,
        );
      }
    }
    for (const s of segments) {
      for (const c of s.controls) {
        parts.push(
          `<circle cx="${num(c.x)}" cy="${num(c.y)}" r="${num(r * 0.8)}" fill="${c.implicit ? 'none' : COLORS.handle}" stroke="${COLORS.handle}" stroke-width="${num(sw * 0.6)}"/>`,
        );
      }
    }
  }

  segments.forEach((s, i) => {
    if (i === 0) {
      parts.push(
        `<circle cx="${num(s.to.x)}" cy="${num(s.to.y)}" r="${num(r * 1.3)}" fill="${COLORS.start}"/>`,
      );
    } else {
      parts.push(
        `<circle cx="${num(s.to.x)}" cy="${num(s.to.y)}" r="${num(r)}" fill="${COLORS.anchor}"/>`,
      );
    }
  });

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${num(vx)} ${num(vy)} ${num(vw)} ${num(vh)}" role="img" aria-label="${escapeAttr(options.label)}">${parts.join('')}</svg>`;
}

/** 引数ごとのラベル（短い記号。言語非依存） */
export function argLabels(type: string): string[] {
  switch (type) {
    case 'M':
    case 'L':
    case 'T':
      return ['x', 'y'];
    case 'H':
      return ['x'];
    case 'V':
      return ['y'];
    case 'C':
      return ['x1', 'y1', 'x2', 'y2', 'x', 'y'];
    case 'S':
      return ['x2', 'y2', 'x', 'y'];
    case 'Q':
      return ['x1', 'y1', 'x', 'y'];
    case 'A':
      return ['rx', 'ry', 'rot', 'large', 'sweep', 'x', 'y'];
    default:
      return [];
  }
}

export const SAMPLE_PATH =
  'M10 80 C 40 10, 65 10, 95 80 S 150 150, 180 80 Q 200 20 230 80 T 280 80 A 20 20 0 0 1 320 80 H 340 V 120 L 300 140 Z';
