/** 用紙サイズ（縦向きの幅×高さ, mm） */
export const PAPER_SIZES = {
  a4: [210, 297],
  b5: [182, 257],
  letter: [215.9, 279.4],
} as const;

export type PaperId = keyof typeof PAPER_SIZES;
export const PAPER_IDS = Object.keys(PAPER_SIZES) as PaperId[];

export type OpId = 'add' | 'sub' | 'mul' | 'div';
export const OP_IDS: OpId[] = ['add', 'sub', 'mul', 'div'];
export const OP_SYMBOL: Record<OpId, string> = {
  add: '+',
  sub: '−',
  mul: '×',
  div: '÷',
};

/** horizontal=横書き（12 + 34 =）, vertical=筆算 */
export type DrillLayout = 'horizontal' | 'vertical';

export const DIGITS_MIN = 1;
export const DIGITS_MAX = 4;
export const COUNT_MIN = 1;
export const COUNT_MAX = 100;
export const COLUMNS_MIN = 1;
export const COLUMNS_MAX = 4;
export const SEED_MAX = 4294967295;

export interface DrillOptions {
  ops: OpId[];
  /** 1つ目の数（わり算ではわられる数）の桁数 */
  digitsA: number;
  /** 2つ目の数（わり算ではわる数）の桁数 */
  digitsB: number;
  count: number;
  seed: number;
  /** false のとき、ひき算の答えが負にならない */
  allowNegative: boolean;
}

export const DEFAULT_OPTIONS: DrillOptions = {
  ops: ['add'],
  digitsA: 2,
  digitsB: 2,
  count: 20,
  seed: 1,
  allowNegative: false,
};

export type OptionsError = 'ops' | 'digits' | 'count' | 'seed';

const isInt = (v: number, min: number, max: number) =>
  Number.isInteger(v) && v >= min && v <= max;

export function validateOptions(o: DrillOptions): OptionsError | null {
  if (o.ops.length === 0) return 'ops';
  if (
    !isInt(o.digitsA, DIGITS_MIN, DIGITS_MAX) ||
    !isInt(o.digitsB, DIGITS_MIN, DIGITS_MAX)
  )
    return 'digits';
  if (!isInt(o.count, COUNT_MIN, COUNT_MAX)) return 'count';
  if (!isInt(o.seed, 0, SEED_MAX)) return 'seed';
  return null;
}

export interface Problem {
  op: OpId;
  a: number;
  b: number;
  answer: number;
}

/** シード付きの乱数（mulberry32）。同じシードなら同じ列になる */
export function createRng(seed: number): () => number {
  let s = seed >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function randomSeed(rand: () => number = Math.random): number {
  return Math.floor(rand() * (SEED_MAX + 1));
}

function randInt(rng: () => number, lo: number, hi: number): number {
  return lo + Math.floor(rng() * (hi - lo + 1));
}

/** n 桁の整数の範囲。1桁は 1〜9、2桁以上は 10^(n-1)〜10^n-1 */
export function digitRange(digits: number): [number, number] {
  return [digits === 1 ? 1 : 10 ** (digits - 1), 10 ** digits - 1];
}

function makeProblem(op: OpId, o: DrillOptions, rng: () => number): Problem {
  const [aLo, aHi] = digitRange(o.digitsA);
  if (op === 'div') {
    // 割り切れる問題だけ作る。わる数は2以上で、わられる数以下にする
    const effB = Math.min(o.digitsB, o.digitsA);
    let [bLo, bHi] = digitRange(effB);
    bLo = Math.max(bLo, 2);
    // 商が1（同じ数÷同じ数）に偏らないよう、商は2以上にできるわる数に絞る
    bHi = Math.max(bLo, Math.min(bHi, Math.floor(aHi / 2)));
    const b = randInt(rng, bLo, bHi);
    const q = randInt(
      rng,
      Math.max(2, Math.ceil(aLo / b)),
      Math.max(2, Math.floor(aHi / b)),
    );
    return { op, a: b * q, b, answer: q };
  }
  const [bLo, bHi] = digitRange(o.digitsB);
  let a = randInt(rng, aLo, aHi);
  let b = randInt(rng, bLo, bHi);
  if (op === 'add') return { op, a, b, answer: a + b };
  if (op === 'mul') return { op, a, b, answer: a * b };
  if (!o.allowNegative && a < b) [a, b] = [b, a];
  return { op, a, b, answer: a - b };
}

/** 問題を作る（検証済みの入力が前提）。同じ問題はできるだけ避ける */
export function generateProblems(o: DrillOptions): Problem[] {
  const rng = createRng(o.seed);
  const seen = new Set<string>();
  const list: Problem[] = [];
  for (let i = 0; i < o.count; i++) {
    let p: Problem | null = null;
    for (let tries = 0; tries < 30; tries++) {
      const op = o.ops[randInt(rng, 0, o.ops.length - 1)];
      p = makeProblem(op, o, rng);
      if (!seen.has(`${p.op}:${p.a}:${p.b}`)) break;
    }
    // 30回試しても重複したら、そのまま使う（桁数が小さいと組み合わせが足りない）
    seen.add(`${p!.op}:${p!.a}:${p!.b}`);
    list.push(p!);
  }
  return list;
}

export interface PageLayout {
  widthMm: number;
  heightMm: number;
  marginMm: number;
  headerMm: number;
  rowMm: number;
  columns: number;
  rows: number;
  perPage: number;
}

const MARGIN_MM = 12;
const HEADER_MM = 18;
const ROW_MM: Record<DrillLayout, number> = { horizontal: 14, vertical: 40 };

export function pageLayout(
  paper: PaperId,
  layout: DrillLayout,
  columns: number,
  header: boolean,
): PageLayout {
  const [widthMm, heightMm] = PAPER_SIZES[paper];
  const headerMm = header ? HEADER_MM : 0;
  const rowMm = ROW_MM[layout];
  const usable = heightMm - MARGIN_MM * 2 - headerMm;
  const rows = Math.max(1, Math.floor(usable / rowMm));
  return {
    widthMm,
    heightMm,
    marginMm: MARGIN_MM,
    headerMm,
    rowMm,
    columns,
    rows,
    perPage: rows * columns,
  };
}

export function paginate<T>(items: T[], perPage: number): T[][] {
  const pages: T[][] = [];
  for (let i = 0; i < items.length; i += perPage) {
    pages.push(items.slice(i, i + perPage));
  }
  return pages;
}

/** 横書きの式（答えなし）。例: 12 + 34 = */
export function problemText(p: Problem): string {
  return `${p.a} ${OP_SYMBOL[p.op]} ${p.b} =`;
}
