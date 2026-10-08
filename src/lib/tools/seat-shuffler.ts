import {
  parseLines,
  secureRandomInt,
  shuffle,
  type RandomInt,
} from '../random';

export { parseLines };

export const MAX_NAMES = 100;
export const MAX_ROWS = 10;
export const MAX_COLS = 10;
/** 離したいペアの条件を満たす配置を探す最大試行回数 */
export const MAX_ATTEMPTS = 5000;

export type SeatErrorCode =
  | 'noNames'
  | 'tooManyNames'
  | 'badSize'
  | 'notEnoughSeats'
  | 'duplicateName'
  | 'badFixed'
  | 'unknownFixedName'
  | 'fixedOutOfRange'
  | 'fixedSeatTaken'
  | 'fixedNameTwice'
  | 'badPair'
  | 'unknownPairName'
  | 'samePair'
  | 'unsatisfiable';

export interface SeatError {
  code: SeatErrorCode;
  /** 該当する行・名前などの補足（表示用の文言は呼び出し側で組み立てる） */
  detail?: string;
}

export interface FixedSeat {
  name: string;
  /** 1始まり。1行目が前（教卓側） */
  row: number;
  col: number;
}

export type SeatGrid = (string | null)[][];

export type SeatResult =
  | { ok: true; grid: SeatGrid; attempts: number }
  | { ok: false; error: SeatError };

/** 「名前@行,列」の行を解釈する。名前に @ を含む場合は最後の @ で分ける */
export function parseFixedLine(
  line: string,
): { ok: true; seat: FixedSeat } | { ok: false } {
  const at = line.lastIndexOf('@');
  if (at < 1) return { ok: false };
  const name = line.slice(0, at).trim();
  const m = line
    .slice(at + 1)
    .trim()
    .match(/^(\d+)\s*[,，、]\s*(\d+)$/);
  if (!name || !m) return { ok: false };
  return { ok: true, seat: { name, row: Number(m[1]), col: Number(m[2]) } };
}

/** 「名前A,名前B」の行を解釈する（区切りは , ， 、）。名前にこれらは使えない */
export function parsePairLine(
  line: string,
): { ok: true; pair: [string, string] } | { ok: false } {
  const parts = line.split(/[,，、]/).map((s) => s.trim());
  if (parts.length !== 2 || !parts[0] || !parts[1]) return { ok: false };
  return { ok: true, pair: [parts[0], parts[1]] };
}

export interface SeatInput {
  names: string[];
  rows: number;
  cols: number;
  /** 固定席の行（「名前@行,列」） */
  fixedLines: string[];
  /** 離したいペアの行（「名前A,名前B」） */
  pairLines: string[];
  /** true なら斜めの隣も「近い」とみなす */
  diagonal: boolean;
}

function fail(code: SeatErrorCode, detail?: string): SeatResult {
  return { ok: false, error: { code, detail } };
}

function isNear(
  a: [number, number],
  b: [number, number],
  diagonal: boolean,
): boolean {
  const dr = Math.abs(a[0] - b[0]);
  const dc = Math.abs(a[1] - b[1]);
  if (dr === 0 && dc === 0) return false;
  return diagonal ? dr <= 1 && dc <= 1 : dr + dc === 1;
}

/** 座席表を作る。固定席を先に置き、残りをシャッフルして、離したいペアが近くなければ採用する */
export function shuffleSeats(
  input: SeatInput,
  randomInt: RandomInt = secureRandomInt,
): SeatResult {
  const { names, rows, cols, diagonal } = input;
  if (names.length === 0) return fail('noNames');
  if (names.length > MAX_NAMES) return fail('tooManyNames');
  if (
    !Number.isInteger(rows) ||
    !Number.isInteger(cols) ||
    rows < 1 ||
    cols < 1 ||
    rows > MAX_ROWS ||
    cols > MAX_COLS
  ) {
    return fail('badSize');
  }
  if (names.length > rows * cols) return fail('notEnoughSeats');
  const nameSet = new Set(names);
  if (nameSet.size !== names.length) {
    const seen = new Set<string>();
    const dup = names.find((n) => (seen.has(n) ? true : (seen.add(n), false)));
    return fail('duplicateName', dup);
  }

  const grid: SeatGrid = Array.from({ length: rows }, () =>
    Array<string | null>(cols).fill(null),
  );
  const placed = new Set<string>();
  for (const line of input.fixedLines) {
    const parsed = parseFixedLine(line);
    if (!parsed.ok) return fail('badFixed', line);
    const { name, row, col } = parsed.seat;
    if (!nameSet.has(name)) return fail('unknownFixedName', name);
    if (row < 1 || col < 1 || row > rows || col > cols) {
      return fail('fixedOutOfRange', line);
    }
    if (placed.has(name)) return fail('fixedNameTwice', name);
    if (grid[row - 1][col - 1] !== null) return fail('fixedSeatTaken', line);
    grid[row - 1][col - 1] = name;
    placed.add(name);
  }

  const pairs: [string, string][] = [];
  for (const line of input.pairLines) {
    const parsed = parsePairLine(line);
    if (!parsed.ok) return fail('badPair', line);
    const [a, b] = parsed.pair;
    if (!nameSet.has(a)) return fail('unknownPairName', a);
    if (!nameSet.has(b)) return fail('unknownPairName', b);
    if (a === b) return fail('samePair', line);
    pairs.push([a, b]);
  }

  const freeNames = names.filter((n) => !placed.has(n));
  const freeSeats: [number, number][] = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (grid[r][c] === null) freeSeats.push([r, c]);
    }
  }

  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    const seats = shuffle(freeSeats, randomInt);
    const trial = grid.map((row) => [...row]);
    const pos = new Map<string, [number, number]>();
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const n = grid[r][c];
        if (n !== null) pos.set(n, [r, c]);
      }
    }
    // 席の方が多い場合は、シャッフルした席の先頭から使う（空席の位置もランダム）
    freeNames.forEach((name, i) => {
      const [r, c] = seats[i];
      trial[r][c] = name;
      pos.set(name, [r, c]);
    });
    const ok = pairs.every(
      ([a, b]) => !isNear(pos.get(a)!, pos.get(b)!, diagonal),
    );
    if (ok) return { ok: true, grid: trial, attempts: attempt };
  }
  return fail('unsatisfiable');
}

export type OrderResult =
  { ok: true; order: string[] } | { ok: false; error: SeatError };

/** 発表順（番号付きシャッフル）。同名は区別できないので許可する */
export function shuffleOrder(
  names: string[],
  randomInt: RandomInt = secureRandomInt,
): OrderResult {
  if (names.length === 0) return { ok: false, error: { code: 'noNames' } };
  if (names.length > MAX_NAMES) {
    return { ok: false, error: { code: 'tooManyNames' } };
  }
  return { ok: true, order: shuffle(names, randomInt) };
}

/** コピー用のテキスト。1行目に前（教卓側）を示す見出しを置き、各行はタブ区切り */
export function formatSeatText(
  grid: SeatGrid,
  labels: { front: string; empty: string },
): string {
  return [
    labels.front,
    ...grid.map((row) => row.map((n) => n ?? labels.empty).join('\t')),
  ].join('\n');
}

export function formatOrderText(order: string[]): string {
  return order.map((n, i) => `${i + 1}. ${n}`).join('\n');
}
