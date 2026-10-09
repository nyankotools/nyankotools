/**
 * PDF → Markdown 変換のロジック。
 * pdf.js から取り出したテキスト片（座標・フォントサイズ付き）を受け取り、
 * 行の再構成 → 見出し・段落・リスト・表の推定 → Markdown 出力までを行う。
 * DOM や pdf.js には依存しない。
 */

/** pdf.js のテキスト片。座標はページ左下原点・PDF単位（1/72インチ）に正規化済み */
export interface PdfTextItem {
  str: string;
  x: number;
  y: number;
  width: number;
  fontSize: number;
  bold: boolean;
  italic: boolean;
}

export interface PdfPageInput {
  width: number;
  height: number;
  items: PdfTextItem[];
}

export interface ConvertOptions {
  /** ページ上下の繰り返し行（ヘッダー・フッター・ページ番号）を除去する */
  removeHeaderFooter: boolean;
  /** 桁の揃った行を Markdown の表にする */
  detectTables: boolean;
  /** ページの境目に水平線（---）を入れる */
  pageSeparator: boolean;
  /**
   * 出力形式。'text' は見出し・段落・リストの構造（読み順・折り返しの結合・ヘッダー除去）はそのままに、
   * Markdown の記号（#・**・エスケープ）を付けないプレーンテキストにする。表はタブ区切り。省略時は 'markdown'
   */
  format?: 'markdown' | 'text';
}

export interface ConvertResult {
  markdown: string;
  pageCount: number;
  /** テキストを持たないページ（1始まり）。スキャン画像PDFの検出に使う */
  emptyPages: number[];
  tableCount: number;
  charCount: number;
}

interface Run {
  text: string;
  bold: boolean;
  italic: boolean;
}

/** 行内で大きな空白（列間など）で区切られた塊 */
interface Segment {
  runs: Run[];
  x0: number;
  x1: number;
}

interface Line {
  /** ページ内の領域（段組みの左右など）。表や段落の連結はこの中に限る */
  region: string;
  y: number;
  x0: number;
  x1: number;
  size: number;
  chars: number;
  bold: boolean;
  segments: Segment[];
}

type Block =
  | { type: 'heading'; text: string }
  | { type: 'p'; text: string }
  | { type: 'li'; text: string }
  | { type: 'table'; text: string };

interface RegionMetrics {
  left: number;
  right: number;
}

interface Context {
  body: number;
  pitch: number;
  /** 見出しサイズのクラスタ（大きい順） */
  headingSizes: number[];
  regions: Map<string, RegionMetrics>;
  detectTables: boolean;
  /** Markdown の記号を付けないプレーンテキストで出力する */
  plain: boolean;
}

/** これ以上空くと別セグメント（表の列間など）とみなす間隔（em） */
const SEGMENT_GAP_EM = 1;
/** これ以上空くとスペースを挟む間隔（em） */
const SPACE_GAP_EM = 0.15;
/** 本文より何倍大きければ見出しとみなすか */
const HEADING_RATIO = 1.1;
/** ヘッダー・フッターとみなすページ上下端の割合 */
const MARGIN_ZONE = 0.12;
const MAX_HEADING_LEVEL = 4;

const CJK = /[⺀-鿿豈-﫿＀-￯]/;
const SENTENCE_END = /[。．.!?！？」』）)]$/;
const BULLET_ONLY = /^([・•●○◦▪■□▶▸‣]|[-–—*]|\d{1,3}[.)．）])$/;
const PAGE_NUMBER =
  /^([-–—\s]*\d{1,3}[-–—\s]*|(page|p\.?)\s*\d+(\s*(\/|of)\s*\d+)?|\d+\s*\/\s*\d+|第?\s*\d+\s*(ページ|頁))$/i;

/** 番号付き見出し（第1章 / 1.2 概要 / 1. はじめに）。値は見出しレベルの手がかり */
const NUMBERED_HEADING =
  /^(?:第\s*[0-9０-９一二三四五六七八九十]+\s*[章部編]|(\d{1,2}(?:\.\d{1,2}){1,3})(?=\s|[^\d.])|\d{1,2}[.．]\s*(?=\S))/;

const isCjk = (ch: string | undefined) => !!ch && CJK.test(ch);

const plainOf = (runs: Run[]) => runs.map((r) => r.text).join('');
const segmentText = (s: Segment) => plainOf(s.runs);
const lineRuns = (line: Line): Run[] =>
  line.segments.flatMap((s, i) =>
    i === 0 ? s.runs : [{ text: ' ', bold: false, italic: false }, ...s.runs],
  );
const linePlain = (line: Line) => plainOf(lineRuns(line)).trim();

/** 行送りの代表値。段落間の広い空きに引っ張られないよう下位30%点を使う */
function lowerQuantile(values: number[]): number {
  const sorted = [...values].sort((a, b) => a - b);
  return sorted[Math.floor((sorted.length - 1) * 0.3)];
}

function median(values: number[]): number {
  if (values.length === 0) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const mid = sorted.length >> 1;
  return sorted.length % 2 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
}

// ---------------------------------------------------------------------------
// 行の再構成
// ---------------------------------------------------------------------------

function appendRun(seg: Segment, text: string, bold: boolean, italic: boolean) {
  const last = seg.runs[seg.runs.length - 1];
  if (last && last.bold === bold && last.italic === italic) last.text += text;
  else seg.runs.push({ text, bold, italic });
}

/** 同じ行に属するテキスト片から Line を組み立てる */
function buildLine(items: PdfTextItem[], region: string): Line | null {
  const sorted = items.filter((it) => it.str !== '').sort((a, b) => a.x - b.x);
  const segments: Segment[] = [];
  let cur: Segment | null = null;
  const charsBySize = new Map<number, number>();
  const ys: number[] = [];

  for (const it of sorted) {
    const size = it.fontSize || 1;
    const blank = it.str.trim() === '';
    if (blank && !cur) continue;
    const gap = cur ? it.x - cur.x1 : 0;
    if (!cur || (!blank && gap > SEGMENT_GAP_EM * size)) {
      cur = { runs: [], x0: it.x, x1: it.x };
      segments.push(cur);
    } else {
      const prevText = plainOf(cur.runs);
      const needSpace =
        gap > SPACE_GAP_EM * size &&
        !prevText.endsWith(' ') &&
        !it.str.startsWith(' ') &&
        !(isCjk(prevText.slice(-1)) && isCjk(it.str[0]));
      if (needSpace) {
        const last = cur.runs[cur.runs.length - 1];
        appendRun(cur, ' ', last.bold, last.italic);
      }
    }
    appendRun(cur, it.str, it.bold, it.italic);
    // pdf.js は列間の空白を幅つきの空白片として出すため、文字の右端だけを追う
    if (!blank) cur.x1 = Math.max(cur.x1, it.x + it.width);
    if (!blank) {
      const key = Math.round(size * 2) / 2;
      const n = it.str.trim().length;
      charsBySize.set(key, (charsBySize.get(key) ?? 0) + n);
      ys.push(it.y);
    }
  }
  if (ys.length === 0) return null;

  // 先頭が「・」「1.」だけのセグメントは次のセグメントと結合する（箇条書きの記号）
  // （表の途中にある「-」だけのセルを吸収しないよう、行頭のセグメントに限る）
  if (segments.length > 1) {
    const i = 0;
    if (BULLET_ONLY.test(segmentText(segments[i]).trim())) {
      const next = segments[i + 1];
      const marker = segmentText(segments[i]).trim();
      next.runs.unshift({ text: marker + ' ', bold: false, italic: false });
      next.x0 = segments[i].x0;
      segments.splice(i, 1);
    }
  }
  // 各セグメントの前後の空白を落とす
  for (const seg of segments) {
    const first = seg.runs[0];
    first.text = first.text.trimStart();
    const last = seg.runs[seg.runs.length - 1];
    last.text = last.text.trimEnd();
    seg.runs = seg.runs.filter((r) => r.text !== '');
  }
  const kept = segments.filter((s) => s.runs.length > 0);
  if (kept.length === 0) return null;

  let size = 0;
  let max = -1;
  let chars = 0;
  for (const [s, n] of charsBySize) {
    chars += n;
    if (n > max) {
      max = n;
      size = s;
    }
  }
  const allRuns = kept.flatMap((s) => s.runs).filter((r) => r.text.trim());
  return {
    region,
    y: ys.reduce((a, b) => a + b, 0) / ys.length,
    x0: kept[0].x0,
    x1: kept[kept.length - 1].x1,
    size,
    chars,
    bold: allRuns.length > 0 && allRuns.every((r) => r.bold),
    segments: kept,
  };
}

/** テキスト片をY座標で行にまとめる（上から下の順） */
function groupLines(items: PdfTextItem[], region: string): Line[] {
  const sorted = items
    .filter((it) => it.str !== '')
    .sort((a, b) => b.y - a.y || a.x - b.x);
  const groups: PdfTextItem[][] = [];
  let refY = 0;
  for (const it of sorted) {
    const group = groups[groups.length - 1];
    if (group && Math.abs(refY - it.y) <= 0.4 * Math.max(it.fontSize, 1)) {
      group.push(it);
    } else {
      groups.push([it]);
      refY = it.y;
    }
  }
  return groups
    .map((g) => buildLine(g, region))
    .filter((l): l is Line => l !== null);
}

// ---------------------------------------------------------------------------
// 段組みの検出（2段組みなら左→右の順に読む）
// ---------------------------------------------------------------------------

function detectGutter(items: PdfTextItem[], width: number): number | null {
  const real = items.filter((it) => it.str.trim() !== '');
  if (real.length < 8 || width <= 0) return null;
  const bandW = 0.02 * width;
  let best: { g: number; crossing: number } | null = null;
  for (let g0 = 0.35 * width; g0 <= 0.62 * width; g0 += 0.005 * width) {
    const g1 = g0 + bandW;
    let crossing = 0;
    for (const it of real) {
      if (it.x < g1 && it.x + it.width > g0) crossing++;
    }
    const g = g0 + bandW / 2;
    if (
      !best ||
      crossing < best.crossing ||
      (crossing === best.crossing &&
        Math.abs(g - width / 2) < Math.abs(best.g - width / 2))
    ) {
      best = { g, crossing };
    }
  }
  if (!best || best.crossing > 0.1 * real.length) return null;
  const left = real.filter((it) => it.x + it.width <= best.g);
  const right = real.filter((it) => it.x >= best.g);
  if (left.length < 0.25 * real.length || right.length < 0.25 * real.length) {
    return null;
  }
  // 各段が段落状の長い行を持つこと（短いセルが並ぶ表を段組みと誤認しない）
  const widthOf = (its: PdfTextItem[]) =>
    median(groupLines(its, '').map((l) => l.x1 - l.x0));
  if (widthOf(left) < 0.25 * width || widthOf(right) < 0.25 * width) {
    return null;
  }
  return best.g;
}

/** ページのテキスト片を読み順に並んだ行へ変換する */
function pageToLines(page: PdfPageInput, pageIndex: number): Line[] {
  const items = page.items.filter((it) => it.str !== '');
  const prefix = `${pageIndex}:`;
  const g = detectGutter(items, page.width);
  if (g === null) return groupLines(items, `${prefix}A`);

  // 段をまたぐ行（見出しなど）と、その行の左右に分かれたテキスト片
  const crossYs = items
    .filter((it) => it.str.trim() && it.x < g && it.x + it.width > g)
    .map((it) => it.y);
  const isSpan = (it: PdfTextItem) =>
    crossYs.some((y) => Math.abs(y - it.y) <= 0.4 * Math.max(it.fontSize, 1));
  const spanItems = items.filter(isSpan);
  const spanLines = groupLines(spanItems, '');
  const columnItems = items.filter((it) => !isSpan(it));

  const bands: { left: PdfTextItem[]; right: PdfTextItem[] }[] = spanLines.map(
    () => ({ left: [], right: [] }),
  );
  bands.push({ left: [], right: [] });
  for (const it of columnItems) {
    const band = spanLines.filter((l) => l.y > it.y).length;
    bands[band][it.x + it.width / 2 < g ? 'left' : 'right'].push(it);
  }

  const lines: Line[] = [];
  bands.forEach((band, i) => {
    lines.push(...groupLines(band.left, `${prefix}${i}L`));
    lines.push(...groupLines(band.right, `${prefix}${i}R`));
    const span = spanLines[i];
    if (span) lines.push({ ...span, region: `${prefix}${i}S` });
  });
  return lines;
}

// ---------------------------------------------------------------------------
// ヘッダー・フッターの除去
// ---------------------------------------------------------------------------

function normalizeKey(text: string): string {
  return text.replace(/\d+/g, '#').replace(/\s+/g, ' ').trim();
}

function stripHeaderFooter(pages: { lines: Line[]; height: number }[]) {
  const inMargin = (line: Line, height: number) =>
    line.y >= height * (1 - MARGIN_ZONE) || line.y <= height * MARGIN_ZONE;

  const counts = new Map<string, number>();
  for (const page of pages) {
    const keys = new Set<string>();
    for (const line of page.lines) {
      if (inMargin(line, page.height)) keys.add(normalizeKey(linePlain(line)));
    }
    for (const k of keys) counts.set(k, (counts.get(k) ?? 0) + 1);
  }
  const threshold = Math.max(2, Math.ceil(pages.length * 0.5));
  for (const page of pages) {
    page.lines = page.lines.filter((line) => {
      if (!inMargin(line, page.height)) return true;
      const text = linePlain(line);
      if (PAGE_NUMBER.test(text)) return false;
      return (counts.get(normalizeKey(text)) ?? 0) < threshold;
    });
  }
}

// ---------------------------------------------------------------------------
// 文書全体の統計
// ---------------------------------------------------------------------------

function clusterSizes(sizes: number[]): number[] {
  const sorted = [...new Set(sizes)].sort((a, b) => b - a);
  const clusters: number[] = [];
  for (const s of sorted) {
    if (clusters.length === 0 || clusters[clusters.length - 1] - s > 0.75) {
      clusters.push(s);
    }
  }
  return clusters;
}

function buildContext(
  pages: { lines: Line[] }[],
  detectTables: boolean,
  plain: boolean,
): Context | null {
  const all = pages.flatMap((p) => p.lines);
  if (all.length === 0) return null;

  const weight = new Map<number, number>();
  for (const l of all) weight.set(l.size, (weight.get(l.size) ?? 0) + l.chars);
  let body = all[0].size;
  let max = -1;
  for (const [s, n] of weight) {
    if (n > max) {
      max = n;
      body = s;
    }
  }

  const headingSizes = clusterSizes(
    all.filter((l) => l.size >= body * HEADING_RATIO).map((l) => l.size),
  );

  const isBody = (l: Line) => Math.abs(l.size - body) <= 0.5;
  const regions = new Map<string, RegionMetrics>();
  const gaps: number[] = [];
  const byRegion = new Map<string, Line[]>();
  for (const l of all) {
    const list = byRegion.get(l.region) ?? [];
    list.push(l);
    byRegion.set(l.region, list);
  }
  for (const [key, lines] of byRegion) {
    const bodyLines = lines.filter((l) => isBody(l) && l.segments.length === 1);
    const pool = bodyLines.length > 0 ? bodyLines : lines;
    regions.set(key, {
      left: Math.min(...pool.map((l) => l.x0)),
      right: Math.max(...pool.map((l) => l.x1)),
    });
    for (let i = 1; i < lines.length; i++) {
      const gap = lines[i - 1].y - lines[i].y;
      if (
        isBody(lines[i - 1]) &&
        isBody(lines[i]) &&
        gap > 0 &&
        gap < body * 3
      ) {
        gaps.push(gap);
      }
    }
  }
  return {
    body,
    pitch: gaps.length > 0 ? lowerQuantile(gaps) : body * 1.5,
    headingSizes,
    regions,
    detectTables,
    plain,
  };
}

// ---------------------------------------------------------------------------
// Markdown 描画
// ---------------------------------------------------------------------------

function escapeText(s: string): string {
  return s
    .replace(/[\\*`<~]/g, (c) => `\\${c}`)
    .replace(/(^|\s)_|_(?=\s|$)/g, (m) => m.replace('_', '\\_'))
    .replace(/\]\(/g, '\\](');
}

function renderRuns(
  runs: Run[],
  withStyle: boolean,
  inTable = false,
  plain = false,
): string {
  if (plain) return plainOf(runs);
  let out = '';
  for (const run of runs) {
    let text = escapeText(run.text);
    if (inTable) text = text.replace(/\|/g, '\\|');
    if (withStyle && (run.bold || run.italic) && text.trim()) {
      const lead = text.match(/^\s*/)![0];
      const trail = text.match(/\s*$/)![0];
      const core = text.trim();
      const mark = run.bold && run.italic ? '***' : run.bold ? '**' : '*';
      text = `${lead}${mark}${core}${mark}${trail}`;
    }
    out += text;
  }
  return out;
}

/** 段落の行末の記号で、行頭に来ると Markdown 記法になってしまうものを退避する */
function escapeLineStart(text: string): string {
  return /^(#{1,6}\s|>|\+\s|-{3,}$|={3,}$)/.test(text) ? `\\${text}` : text;
}

interface Piece {
  md: string;
  plain: string;
}

/** 折り返された複数行を1つの文字列につなぐ */
function joinPieces(pieces: Piece[]): string {
  let out = '';
  let prev: Piece | null = null;
  for (const p of pieces) {
    if (prev === null) {
      out = p.md;
    } else if (/[A-Za-z]-$/.test(prev.plain) && /^[a-z]/.test(p.plain)) {
      // 英単語のハイフネーション折り返し
      out = out.replace(/-$/, '') + p.md;
    } else if (isCjk(prev.plain.slice(-1)) || isCjk(p.plain[0])) {
      out += p.md;
    } else {
      out += ` ${p.md}`;
    }
    prev = p;
  }
  return out;
}

function pieceOf(line: Line, withStyle: boolean, plain = false): Piece {
  const runs = lineRuns(line);
  return {
    md: renderRuns(runs, withStyle, false, plain),
    plain: plainOf(runs).trim(),
  };
}

function renderParagraph(lines: Line[], plain: boolean): string {
  if (plain) return joinPieces(lines.map((l) => pieceOf(l, false, true)));
  const allBold = lines.every((l) => l.bold);
  const text = joinPieces(lines.map((l) => pieceOf(l, !allBold)));
  return allBold ? `**${text}**` : escapeLineStart(text);
}

// ---------------------------------------------------------------------------
// ブロック構築
// ---------------------------------------------------------------------------

interface ListMarker {
  ordered: boolean;
  label: string;
  /** 記号部分の文字数（空白含む） */
  length: number;
}

function parseMarker(text: string): ListMarker | null {
  let m = text.match(/^([・•●○◦▪■□▶▸‣])\s*/);
  if (m) return { ordered: false, label: '-', length: m[0].length };
  m = text.match(/^[-–—*]\s+/);
  if (m) return { ordered: false, label: '-', length: m[0].length };
  m = text.match(/^(\d{1,3})(?:[.)]\s+|[．）]\s*)/);
  if (m) return { ordered: true, label: `${m[1]}.`, length: m[0].length };
  m = text.match(/^[（(](\d{1,3})[)）]\s*/);
  if (m) return { ordered: true, label: `${m[1]}.`, length: m[0].length };
  m = text.match(/^([①-⑳])\s*/);
  if (m) {
    const n = m[1].charCodeAt(0) - 0x2460 + 1;
    return { ordered: true, label: `${n}.`, length: m[0].length };
  }
  return null;
}

/** ラン列の先頭から n 文字を取り除く */
function stripPrefix(runs: Run[], n: number): Run[] {
  let rest = n;
  const out: Run[] = [];
  for (const run of runs) {
    if (rest >= run.text.length) {
      rest -= run.text.length;
      continue;
    }
    out.push({ ...run, text: run.text.slice(rest) });
    rest = 0;
  }
  return out;
}

function headingLevel(line: Line, ctx: Context): number {
  if (line.size < ctx.body * HEADING_RATIO) return 0;
  const idx = ctx.headingSizes.findIndex((s) => line.size >= s - 0.75);
  return Math.min(
    (idx < 0 ? ctx.headingSizes.length : idx) + 1,
    MAX_HEADING_LEVEL,
  );
}

/** prev の次の行 cur が同じ段落・項目の続きか */
function continues(
  prev: Line,
  cur: Line,
  ctx: Context,
  checkIndent = true,
): boolean {
  if (
    prev.region !== cur.region &&
    cur.region.split(':')[0] !== prev.region.split(':')[0]
  ) {
    return false;
  }
  if (Math.abs(prev.size - cur.size) > 0.75) return false;
  // 太字だけの行と通常行の境目は段落の切れ目
  if (prev.bold !== cur.bold) return false;
  const metrics = ctx.regions.get(cur.region);
  const text = linePlain(prev);
  // 番号付きの短い1行（第1章・1.2 概要）は見出しなので、次の行とは続けない
  if (
    isShortHeadingLine(prev) &&
    NUMBERED_HEADING.test(text) &&
    !parseMarker(text)
  ) {
    return false;
  }
  const gap = prev.y - cur.y;
  if (gap < 0) {
    // 段が変わって上に戻った場合: 文が終わっていなければ続きとみなす
    return !SENTENCE_END.test(text);
  }
  if (gap > ctx.pitch * 1.4) return false;
  if (metrics) {
    // 字下げで始まる行は新しい段落
    if (
      checkIndent &&
      cur.x0 - metrics.left > 0.8 * cur.size &&
      prev.x0 - metrics.left < 0.3 * cur.size
    ) {
      return false;
    }
    // 文末で終わり、行が右端まで届いていなければ段落の終わり
    if (SENTENCE_END.test(text) && prev.x1 < metrics.right - 2 * prev.size) {
      return false;
    }
  }
  return true;
}

interface Accumulator {
  type: 'p' | 'li';
  lines: Line[];
  marker?: ListMarker;
  level?: number;
}

/** 太字だけ、または番号付きで文が終わらない短い1行は見出し候補 */
function isShortHeadingLine(line: Line): boolean {
  const text = linePlain(line);
  return text.length <= 40 && !SENTENCE_END.test(text) && !/[:：]$/.test(text);
}

function numberedHeadingLevel(text: string, ctx: Context): number {
  const m = text.match(NUMBERED_HEADING);
  const base = Math.max(ctx.headingSizes.length, 1) + 1;
  // 「第1章」「1.」は上位、「1.2」「1.2.3」は番号の深さぶん下げる
  const depth = m?.[1] ? m[1].split('.').length : 1;
  return Math.min(base + depth - 1, MAX_HEADING_LEVEL);
}

/** 見出し行。Markdown では「#」を付け、プレーンテキストでは文字だけにする */
function headingText(level: number, runs: Run[], ctx: Context): string {
  const text = renderRuns(runs, false, false, ctx.plain);
  return ctx.plain ? text : `${'#'.repeat(level)} ${text}`;
}

function flushAccumulator(acc: Accumulator, ctx: Context, blocks: Block[]) {
  if (acc.type === 'p') {
    const first = acc.lines[0];
    const text = linePlain(first);
    if (acc.lines.length === 1 && isShortHeadingLine(first)) {
      // 太字だけの短い1行は小見出し、番号付きの短い1行は番号の深さで見出しとみなす
      const numbered = NUMBERED_HEADING.test(text);
      if (first.bold || numbered) {
        const level = numbered
          ? numberedHeadingLevel(text, ctx)
          : Math.min(
              Math.max(ctx.headingSizes.length, 1) + 1,
              MAX_HEADING_LEVEL,
            );
        blocks.push({
          type: 'heading',
          text: headingText(level, lineRuns(first), ctx),
        });
        return;
      }
    }
    blocks.push({ type: 'p', text: renderParagraph(acc.lines, ctx.plain) });
    return;
  }
  const marker = acc.marker!;
  const [first, ...rest] = acc.lines;
  const firstRuns = stripPrefix(lineRuns(first), marker.length);
  const pieces: Piece[] = [
    {
      md: renderRuns(firstRuns, true, false, ctx.plain),
      plain: plainOf(firstRuns).trim(),
    },
    ...rest.map((l) => pieceOf(l, true, ctx.plain)),
  ];
  const indent = '    '.repeat(acc.level ?? 0);
  blocks.push({
    type: 'li',
    text: `${indent}${marker.label} ${joinPieces(pieces)}`,
  });
}

interface TableRun {
  end: number;
  text: string;
}

/** lines[start] から始まる表の範囲を探し、Markdown の表にして返す */
function findTable(
  lines: Line[],
  start: number,
  ctx: Context,
): TableRun | null {
  const region = lines[start].region;
  const tableLike = (l: Line) =>
    l.segments.length >= 2 && l.size < ctx.body * HEADING_RATIO;
  let end = start + 1;
  let multi = 1;
  while (end < lines.length) {
    const prev = lines[end - 1];
    const l = lines[end];
    const gap = prev.y - l.y;
    if (
      l.region !== region ||
      gap <= 0 ||
      gap > Math.max(prev.size, l.size) * 3
    ) {
      break;
    }
    if (tableLike(l)) {
      multi++;
      end++;
      continue;
    }
    // 空欄のあるデータ行: 前後が表の行で、開始位置が既存の列に揃っていれば含める
    const next = lines[end + 1];
    const aligned = lines
      .slice(start, end)
      .some((r) =>
        r.segments.some((s) => Math.abs(s.x0 - l.x0) <= 0.5 * l.size),
      );
    if (
      l.segments.length === 1 &&
      aligned &&
      next &&
      next.region === region &&
      tableLike(next)
    ) {
      end++;
      continue;
    }
    break;
  }
  if (multi < 2) return null;

  // 全行のセグメントの区間を重ねて、列の範囲を決める
  const intervals = lines
    .slice(start, end)
    .flatMap((l) => l.segments.map((s) => [s.x0, s.x1] as const))
    .sort((a, b) => a[0] - b[0]);
  const columns: [number, number][] = [];
  for (const [a, b] of intervals) {
    const last = columns[columns.length - 1];
    if (last && a <= last[1]) last[1] = Math.max(last[1], b);
    else columns.push([a, b]);
  }
  if (columns.length < 2) return null;

  const rows = lines.slice(start, end).map((l, rowIndex) => {
    const cells: string[] = columns.map(() => '');
    for (const seg of l.segments) {
      let idx = columns.findIndex(([a, b]) => seg.x0 < b && seg.x1 > a);
      if (idx < 0) idx = 0;
      const text = renderRuns(seg.runs, rowIndex > 0, true, ctx.plain).trim();
      cells[idx] = cells[idx] ? `${cells[idx]} ${text}` : text;
    }
    return cells;
  });
  // 2列以上に値が入っている行が2行以上なければ表とみなさない
  const filled = rows.filter((r) => r.filter((c) => c !== '').length >= 2);
  if (filled.length < 2) return null;

  const format = (cells: string[]) => `| ${cells.join(' | ')} |`;
  const text = ctx.plain
    ? rows.map((cells) => cells.join('\t')).join('\n')
    : [
        format(rows[0]),
        format(columns.map(() => '---')),
        ...rows.slice(1).map(format),
      ].join('\n');
  return { end, text };
}

function buildBlocks(
  lines: Line[],
  ctx: Context,
): { blocks: Block[]; tables: number } {
  const blocks: Block[] = [];
  let tables = 0;
  let acc: Accumulator | null = null;
  let listStack: number[] = [];
  let lastHeading: { level: number; line: Line } | null = null;

  const flush = () => {
    if (acc) flushAccumulator(acc, ctx, blocks);
    acc = null;
  };

  for (let i = 0; i < lines.length;) {
    const line = lines[i];

    if (ctx.detectTables && line.segments.length >= 2) {
      const table = findTable(lines, i, ctx);
      if (table) {
        flush();
        listStack = [];
        lastHeading = null;
        blocks.push({ type: 'table', text: table.text });
        tables++;
        i = table.end;
        continue;
      }
    }

    const level = headingLevel(line, ctx);
    if (level > 0) {
      flush();
      listStack = [];
      const text = renderRuns(lineRuns(line), false, false, ctx.plain);
      const last = blocks[blocks.length - 1];
      // 折り返された長い見出しは1つにまとめる
      if (
        lastHeading &&
        last?.type === 'heading' &&
        lastHeading.level === level &&
        lastHeading.line.region === line.region &&
        lastHeading.line.y - line.y > 0 &&
        lastHeading.line.y - line.y <= line.size * 1.6
      ) {
        last.text +=
          isCjk(last.text.slice(-1)) || isCjk(text[0]) ? text : ` ${text}`;
      } else {
        blocks.push({
          type: 'heading',
          text: ctx.plain ? text : `${'#'.repeat(level)} ${text}`,
        });
      }
      lastHeading = { level, line };
      i++;
      continue;
    }
    lastHeading = null;

    const plainText = linePlain(line);
    const marker =
      line.bold && isShortHeadingLine(line) && NUMBERED_HEADING.test(plainText)
        ? null
        : parseMarker(plainText);
    const prev = acc?.lines[acc.lines.length - 1];
    if (marker) {
      flush();
      const x = line.x0;
      while (
        listStack.length > 0 &&
        x < listStack[listStack.length - 1] - 0.5 * line.size
      ) {
        listStack.pop();
      }
      if (
        listStack.length === 0 ||
        x > listStack[listStack.length - 1] + 0.5 * line.size
      ) {
        listStack.push(x);
      }
      acc = { type: 'li', lines: [line], marker, level: listStack.length - 1 };
    } else if (
      acc?.type === 'li' &&
      prev &&
      listContinues(acc, prev, line, ctx)
    ) {
      acc.lines.push(line);
    } else if (acc?.type === 'p' && prev && continues(prev, line, ctx)) {
      acc.lines.push(line);
    } else {
      if (acc?.type === 'p' || !acc) listStack = [];
      flush();
      acc = { type: 'p', lines: [line] };
    }
    i++;
  }
  flush();
  return { blocks, tables };
}

/** 箇条書き項目の折り返し行か */
function listContinues(
  acc: Accumulator,
  prev: Line,
  cur: Line,
  ctx: Context,
): boolean {
  const first = acc.lines[0];
  if (!continues(prev, cur, ctx, false)) return false;
  // ぶら下げインデントされた行
  if (cur.x0 >= first.x0 + 0.5 * cur.size) return true;
  // 記号と同じ位置に折り返された行は、前の行が右端まで届いているときだけ続きとする
  const metrics = ctx.regions.get(cur.region);
  return (
    !!metrics &&
    prev.x1 >= metrics.right - 2 * prev.size &&
    !SENTENCE_END.test(linePlain(prev))
  );
}

// ---------------------------------------------------------------------------
// エントリポイント
// ---------------------------------------------------------------------------

/** ページをまたいで続く段落を結合する */
function mergeAcrossPages(pageBlocks: Block[][]): Block[][] {
  let prevPage: Block[] = pageBlocks[0] ?? [];
  for (let i = 1; i < pageBlocks.length; i++) {
    const cur = pageBlocks[i];
    if (cur.length === 0) continue;
    const last = prevPage[prevPage.length - 1];
    const first = cur[0];
    if (
      last?.type === 'p' &&
      first?.type === 'p' &&
      !SENTENCE_END.test(last.text) &&
      !/[:：]$/.test(last.text) &&
      !/^[A-Z]/.test(first.text)
    ) {
      last.text = joinPieces([
        { md: last.text, plain: last.text },
        { md: first.text, plain: first.text },
      ]);
      cur.shift();
    }
    // 1ページ丸ごと吸収された場合は、その前のページを基準に次のページを判定する
    if (cur.length > 0) prevPage = cur;
  }
  return pageBlocks;
}

function renderBlocks(blocks: Block[]): string {
  let out = '';
  blocks.forEach((b, i) => {
    if (i > 0)
      out += b.type === 'li' && blocks[i - 1].type === 'li' ? '\n' : '\n\n';
    out += b.text;
  });
  return out;
}

export function convertPagesToMarkdown(
  pages: PdfPageInput[],
  options: ConvertOptions,
): ConvertResult {
  const pageLines = pages.map((p, i) => ({
    lines: pageToLines(p, i),
    height: p.height,
  }));
  const emptyPages = pageLines
    .map((p, i) => (p.lines.length === 0 ? i + 1 : 0))
    .filter((n) => n > 0);
  const charCount = pageLines.reduce(
    (sum, p) => sum + p.lines.reduce((s, l) => s + l.chars, 0),
    0,
  );
  const empty: ConvertResult = {
    markdown: '',
    pageCount: pages.length,
    emptyPages,
    tableCount: 0,
    charCount,
  };
  if (charCount === 0) return empty;

  if (options.removeHeaderFooter) stripHeaderFooter(pageLines);
  const ctx = buildContext(
    pageLines,
    options.detectTables,
    options.format === 'text',
  );
  if (!ctx) return { ...empty, charCount };

  let tableCount = 0;
  const pageBlocks = pageLines.map((p) => {
    const { blocks, tables } = buildBlocks(p.lines, ctx);
    tableCount += tables;
    return blocks;
  });
  if (!options.pageSeparator) mergeAcrossPages(pageBlocks);

  const texts = pageBlocks.map(renderBlocks).filter((t) => t !== '');
  const markdown = texts.join(options.pageSeparator ? '\n\n---\n\n' : '\n\n');
  return { ...empty, markdown: markdown ? markdown + '\n' : '', tableCount };
}
