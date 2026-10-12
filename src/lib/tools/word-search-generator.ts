import { secureRandomInt } from '../random';
import type { RandomInt } from '../random';

export type { RandomInt };

export const MIN_SIZE = 8;
export const MAX_SIZE = 25;
export const DEFAULT_SIZE = 12;

/** 1語の最小文字数と、扱う語数の上限 */
export const MIN_WORD_LENGTH = 2;
export const MAX_WORDS = 50;

export const DIFFICULTIES = ['easy', 'normal', 'hard'] as const;
export type Difficulty = (typeof DIFFICULTIES)[number];
export const DEFAULT_DIFFICULTY: Difficulty = 'normal';

type Direction = readonly [dx: number, dy: number];

/** 難易度ごとに言葉を置く向き。かんたん=→↓、ふつう=＋斜め、むずかしい=逆向きを含む8方向 */
const DIRECTIONS: Record<Difficulty, readonly Direction[]> = {
  easy: [
    [1, 0],
    [0, 1],
  ],
  normal: [
    [1, 0],
    [0, 1],
    [1, 1],
    [1, -1],
  ],
  hard: [
    [1, 0],
    [0, 1],
    [1, 1],
    [1, -1],
    [-1, 0],
    [0, -1],
    [-1, -1],
    [-1, 1],
  ],
};

/** 配置のやり直し回数（語の順序・位置が運悪く詰まったときの再試行） */
const PLACE_ATTEMPTS = 10;
/** 余計な出現（意図しない同じ語）を直すための再抽選の上限 */
const FILL_ROUNDS = 60;

const LATIN = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const DIGITS = '0123456789';
const HIRAGANA =
  'あいうえおかきくけこさしすせそたちつてとなにぬねのはひふへほまみむめもやゆよらりるれろわをん';
const KATAKANA =
  'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン';

export interface ParsedWords {
  words: string[];
  /** 文字数不足または上限超過で除外した語の数（重複は数えない） */
  ignored: number;
}

export interface Placement {
  word: string;
  x: number;
  y: number;
  dx: number;
  dy: number;
}

export interface WordSearch {
  size: number;
  /** index = y * size + x。1要素が1マスの文字 */
  grid: string[];
  placements: Placement[];
  /** 置ききれなかった語（長すぎる、または詰まった） */
  unplaced: string[];
}

/** 整数に丸めて MIN_SIZE〜MAX_SIZE に収める。数値でなければ既定値を返す */
export function clampSize(value: number): number {
  if (!Number.isFinite(value)) return DEFAULT_SIZE;
  return Math.min(MAX_SIZE, Math.max(MIN_SIZE, Math.round(value)));
}

/** 全角英数→半角、空白除去、英字は大文字にそろえる */
export function normalizeWord(raw: string): string {
  return raw.normalize('NFKC').replace(/\s+/g, '').toUpperCase();
}

/** 改行・カンマ・読点区切りの入力から語を取り出す（正規化・重複除去・文字数/語数の制限つき） */
export function parseWords(text: string): ParsedWords {
  const seen = new Set<string>();
  const words: string[] = [];
  let ignored = 0;
  for (const raw of text.split(/[\r\n,、，;；]+/)) {
    const word = normalizeWord(raw);
    if (word === '' || seen.has(word)) continue;
    seen.add(word);
    if (
      Array.from(word).length < MIN_WORD_LENGTH ||
      words.length >= MAX_WORDS
    ) {
      ignored++;
      continue;
    }
    words.push(word);
  }
  return { words, ignored };
}

/** 空きマスを埋める文字。語の文字種（英字/ひらがな/カタカナ）に合わせ、それ以外は語に使われた文字から選ぶ */
export function fillAlphabet(words: readonly string[]): string[] {
  const used = Array.from(new Set(words.flatMap((w) => Array.from(w))));
  const count = { latin: 0, digit: 0, hira: 0, kata: 0, other: 0 };
  for (const ch of words.flatMap((w) => Array.from(w))) {
    if (/[A-Z]/.test(ch)) count.latin++;
    else if (/[0-9]/.test(ch)) count.digit++;
    else if (/[ぁ-ゖ]/.test(ch)) count.hira++;
    else if (/[ァ-ヺ]/.test(ch)) count.kata++;
    else count.other++;
  }
  const total =
    count.latin + count.digit + count.hira + count.kata + count.other;
  // 過半数を占める文字種があれば、その文字種の標準的な文字で埋める
  if (count.latin * 2 > total) return Array.from(LATIN);
  if (count.digit * 2 > total) return Array.from(DIGITS);
  if (count.hira * 2 > total) return Array.from(HIRAGANA);
  if (count.kata * 2 > total) return Array.from(KATAKANA);
  return used.length > 0 ? used : Array.from(LATIN);
}

interface Layout {
  cells: (string | null)[];
  placements: Placement[];
  unplaced: string[];
}

function tryLayout(
  chars: readonly (readonly string[])[],
  size: number,
  dirs: readonly Direction[],
  randomInt: RandomInt,
): Layout {
  const cells: (string | null)[] = new Array(size * size).fill(null);
  const placements: Placement[] = [];
  const unplaced: string[] = [];
  // 長い語から置くと詰まりにくい
  const order = chars
    .map((c, i) => ({ c, i }))
    .sort((a, b) => b.c.length - a.c.length || a.i - b.i);
  for (const { c } of order) {
    const len = c.length;
    const candidates: Placement[] = [];
    for (const [dx, dy] of dirs) {
      for (let y = 0; y < size; y++) {
        const ey = y + dy * (len - 1);
        if (ey < 0 || ey >= size) continue;
        for (let x = 0; x < size; x++) {
          const ex = x + dx * (len - 1);
          if (ex < 0 || ex >= size) continue;
          let ok = true;
          for (let k = 0; k < len; k++) {
            const cur = cells[(y + dy * k) * size + (x + dx * k)];
            if (cur !== null && cur !== c[k]) {
              ok = false;
              break;
            }
          }
          if (ok) candidates.push({ word: c.join(''), x, y, dx, dy });
        }
      }
    }
    if (candidates.length === 0) {
      unplaced.push(c.join(''));
      continue;
    }
    const chosen = candidates[randomInt(candidates.length)];
    for (let k = 0; k < len; k++) {
      cells[(chosen.y + chosen.dy * k) * size + (chosen.x + chosen.dx * k)] =
        c[k];
    }
    placements.push(chosen);
  }
  return { cells, placements, unplaced };
}

/** 語 word（文字配列）が grid 上に現れる位置のうち、置いた位置以外を返す（マスの index 配列） */
function findExtraOccurrences(
  grid: readonly string[],
  size: number,
  dirs: readonly Direction[],
  placements: readonly Placement[],
): number[][] {
  const extras: number[][] = [];
  for (const p of placements) {
    const chars = Array.from(p.word);
    const len = chars.length;
    for (const [dx, dy] of dirs) {
      for (let y = 0; y < size; y++) {
        const ey = y + dy * (len - 1);
        if (ey < 0 || ey >= size) continue;
        for (let x = 0; x < size; x++) {
          const ex = x + dx * (len - 1);
          if (ex < 0 || ex >= size) continue;
          if (x === p.x && y === p.y && dx === p.dx && dy === p.dy) continue;
          const indexes: number[] = [];
          let ok = true;
          for (let k = 0; k < len; k++) {
            const index = (y + dy * k) * size + (x + dx * k);
            if (grid[index] !== chars[k]) {
              ok = false;
              break;
            }
            indexes.push(index);
          }
          if (ok) extras.push(indexes);
        }
      }
    }
  }
  return extras;
}

/**
 * ワードサーチを作る。words は parseWords で正規化済みの語。
 * 置けなかった語は unplaced に入る。空きマスは語の文字種に合わせて埋め、
 * 意図しない同じ語が現れないよう（埋めたマスの範囲で）できるだけ再抽選する。
 */
export function generateWordSearch(
  words: readonly string[],
  size: number,
  difficulty: Difficulty = DEFAULT_DIFFICULTY,
  randomInt: RandomInt = secureRandomInt,
): WordSearch {
  const dirs = DIRECTIONS[difficulty];
  const chars = words.map((w) => Array.from(w));

  let best: Layout | null = null;
  for (let attempt = 0; attempt < PLACE_ATTEMPTS; attempt++) {
    const layout = tryLayout(chars, size, dirs, randomInt);
    if (!best || layout.unplaced.length < best.unplaced.length) best = layout;
    if (best.unplaced.length === 0) break;
  }
  const layout = best as Layout;

  const alphabet = fillAlphabet(words);
  const fixed = layout.cells.map((c) => c !== null);
  const grid = layout.cells.map(
    (c) => c ?? alphabet[randomInt(alphabet.length)],
  );

  for (let round = 0; round < FILL_ROUNDS; round++) {
    const fixable = findExtraOccurrences(
      grid,
      size,
      dirs,
      layout.placements,
    ).filter((indexes) => indexes.some((i) => !fixed[i]));
    if (fixable.length === 0) break;
    for (const indexes of fixable) {
      const free = indexes.filter((i) => !fixed[i]);
      const target = free[randomInt(free.length)];
      if (alphabet.length > 1) {
        // 現在と違う文字に変える
        const others = alphabet.filter((ch) => ch !== grid[target]);
        grid[target] = others[randomInt(others.length)];
      }
    }
  }

  return {
    size,
    grid,
    placements: layout.placements,
    unplaced: layout.unplaced,
  };
}
