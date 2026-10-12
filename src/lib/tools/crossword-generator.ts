import { secureRandomInt } from '../random';
import type { RandomInt } from '../random';
import { normalizeWord } from './word-search-generator';

export type { RandomInt };

/** 1語の文字数の範囲と、扱う語数の上限 */
export const MIN_WORD_LENGTH = 2;
export const MAX_WORD_LENGTH = 20;
export const MAX_WORDS = 30;
/** ヒントの最大文字数（超えた分は切り捨てる） */
export const MAX_CLUE_LENGTH = 100;

/** 配置のやり直し回数。語の順序と位置はランダムなので、複数回試して最良のものを選ぶ */
const LAYOUT_ATTEMPTS = 150;
/** 座標を数値キーにするためのずらし幅と行幅（盤面がこの範囲を超えることはない） */
const OFFSET = 1024;
const STRIDE = 2048;

export type Direction = 'across' | 'down';

export interface ClueWord {
  /** 正規化済みの答え（英字は大文字） */
  word: string;
  clue: string;
}

export interface ParsedEntries {
  entries: ClueWord[];
  /** 文字数の範囲外または上限超過で除外した行の数（重複は数えない） */
  ignored: number;
}

export interface CrosswordEntry extends ClueWord {
  /** カギの番号（盤面上の位置の順で、同じ開始マスのタテ・ヨコは同じ番号） */
  number: number;
  direction: Direction;
  /** 開始マスの座標（盤面の左上が 0,0） */
  x: number;
  y: number;
}

export interface Crossword {
  width: number;
  height: number;
  /** index = y * width + x。文字のないマスは null */
  cells: (string | null)[];
  /** index = y * width + x。カギの開始マスなら番号、そうでなければ 0 */
  numbers: number[];
  /** 番号順（同じ番号ではヨコが先）。置けた語だけ */
  entries: CrosswordEntry[];
  /** 置けなかった語（他の語と文字を共有できなかった） */
  unplaced: ClueWord[];
}

/**
 * 「答え:ヒント」形式の入力を取り出す。区切りは最初に現れる : ： , ， 、 またはタブ。
 * 答えは正規化・重複除去し、文字数と語数を制限する。ヒントは前後の空白を除く。
 */
export function parseEntries(text: string): ParsedEntries {
  const seen = new Set<string>();
  const entries: ClueWord[] = [];
  let ignored = 0;
  for (const line of text.split(/\r?\n/)) {
    const sep = line.search(/[:：,，、\t]/);
    const rawWord = sep === -1 ? line : line.slice(0, sep);
    const rawClue = sep === -1 ? '' : line.slice(sep + 1);
    const word = normalizeWord(rawWord);
    if (word === '' || seen.has(word)) continue;
    seen.add(word);
    const length = Array.from(word).length;
    if (
      length < MIN_WORD_LENGTH ||
      length > MAX_WORD_LENGTH ||
      entries.length >= MAX_WORDS
    ) {
      ignored++;
      continue;
    }
    const clue = Array.from(rawClue.trim()).slice(0, MAX_CLUE_LENGTH).join('');
    entries.push({ word, clue });
  }
  return { entries, ignored };
}

interface Cell {
  ch: string;
  across: boolean;
  down: boolean;
  x: number;
  y: number;
}

interface Placed {
  index: number;
  x: number;
  y: number;
  direction: Direction;
}

interface Candidate {
  x: number;
  y: number;
  direction: Direction;
  crossings: number;
}

interface Layout {
  placed: Placed[];
  unplaced: number[];
  cells: Map<number, Cell>;
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
}

const key = (x: number, y: number) => (y + OFFSET) * STRIDE + (x + OFFSET);

/** 置けるなら交差するマスの数、置けないなら -1 を返す */
function checkPlacement(
  cells: ReadonlyMap<number, Cell>,
  chars: readonly string[],
  x: number,
  y: number,
  direction: Direction,
): number {
  const dx = direction === 'across' ? 1 : 0;
  const dy = direction === 'across' ? 0 : 1;
  const len = chars.length;
  // 語の前後に文字が続くと別の語とつながってしまう
  if (cells.has(key(x - dx, y - dy))) return -1;
  if (cells.has(key(x + dx * len, y + dy * len))) return -1;
  let crossings = 0;
  for (let k = 0; k < len; k++) {
    const cx = x + dx * k;
    const cy = y + dy * k;
    const cell = cells.get(key(cx, cy));
    if (cell) {
      // 同じ向きの語と重なる、または文字が合わない
      if (cell.ch !== chars[k] || cell[direction]) return -1;
      crossings++;
    } else if (
      cells.has(key(cx + dy, cy + dx)) ||
      cells.has(key(cx - dy, cy - dx))
    ) {
      // 交差しないマスの隣に文字があると、意図しない2文字以上の並びができる
      return -1;
    }
  }
  return crossings;
}

function commit(
  layout: Layout,
  chars: readonly string[],
  index: number,
  x: number,
  y: number,
  direction: Direction,
): void {
  const dx = direction === 'across' ? 1 : 0;
  const dy = direction === 'across' ? 0 : 1;
  for (let k = 0; k < chars.length; k++) {
    const cx = x + dx * k;
    const cy = y + dy * k;
    const existing = layout.cells.get(key(cx, cy));
    if (existing) {
      existing[direction] = true;
    } else {
      layout.cells.set(key(cx, cy), {
        ch: chars[k],
        across: direction === 'across',
        down: direction === 'down',
        x: cx,
        y: cy,
      });
    }
  }
  layout.minX = Math.min(layout.minX, x);
  layout.minY = Math.min(layout.minY, y);
  layout.maxX = Math.max(layout.maxX, x + dx * (chars.length - 1));
  layout.maxY = Math.max(layout.maxY, y + dy * (chars.length - 1));
  layout.placed.push({ index, x, y, direction });
}

function findCandidates(layout: Layout, chars: readonly string[]): Candidate[] {
  const result: Candidate[] = [];
  for (const cell of layout.cells.values()) {
    for (let k = 0; k < chars.length; k++) {
      if (chars[k] !== cell.ch) continue;
      for (const direction of ['across', 'down'] as const) {
        // 既にその向きの語が通っているマスでは、その向きには交差できない
        if (cell[direction]) continue;
        const x = direction === 'across' ? cell.x - k : cell.x;
        const y = direction === 'down' ? cell.y - k : cell.y;
        const crossings = checkPlacement(layout.cells, chars, x, y, direction);
        if (crossings > 0) result.push({ x, y, direction, crossings });
      }
    }
  }
  return result;
}

function tryLayout(
  chars: readonly (readonly string[])[],
  randomInt: RandomInt,
  randomStart: boolean,
): Layout {
  const layout: Layout = {
    placed: [],
    unplaced: [],
    cells: new Map(),
    minX: 0,
    maxX: -1,
    minY: 0,
    maxY: -1,
  };
  // 長い語ほど先に置く（同じ長さの順はランダム）。先頭の語は盤面の起点にする
  const order = chars
    .map((c, i) => ({ i, len: c.length, r: randomInt(1000) }))
    .sort((a, b) => b.len - a.len || a.r - b.r)
    .map((o) => o.i);
  if (randomStart) {
    // 最長の語が他の語と文字を共有できない場合に備え、別の語を起点にした配置も試す
    const [picked] = order.splice(randomInt(order.length), 1);
    order.unshift(picked);
  }

  commit(layout, chars[order[0]], order[0], 0, 0, 'across');
  let pending = order.slice(1);
  let progressed = true;
  while (pending.length > 0 && progressed) {
    progressed = false;
    const rest: number[] = [];
    for (const index of pending) {
      const word = chars[index];
      const candidates = findCandidates(layout, word);
      if (candidates.length === 0) {
        // 後から置かれた語と交差できるようになるかもしれないので、次の周回に回す
        rest.push(index);
        continue;
      }
      // 交差が多く、盤面が小さく収まる位置を優先する
      const scored = candidates.map((c) => {
        const dx = c.direction === 'across' ? word.length - 1 : 0;
        const dy = c.direction === 'down' ? word.length - 1 : 0;
        const w =
          Math.max(layout.maxX, c.x + dx) - Math.min(layout.minX, c.x) + 1;
        const h =
          Math.max(layout.maxY, c.y + dy) - Math.min(layout.minY, c.y) + 1;
        return { c, score: c.crossings * 100 - Math.max(w, h) * 10 - w * h };
      });
      const top = Math.max(...scored.map((s) => s.score));
      const best = scored.filter((s) => s.score === top);
      const chosen = best[randomInt(best.length)].c;
      commit(layout, word, index, chosen.x, chosen.y, chosen.direction);
      progressed = true;
    }
    pending = rest;
  }
  layout.unplaced = pending;
  return layout;
}

/**
 * クロスワードを作る。entries は parseEntries で取り出した語。
 * 語どうしを文字で交差させて並べ、他の語とつながれなかった語は unplaced に入る。
 */
export function generateCrossword(
  entries: readonly ClueWord[],
  randomInt: RandomInt = secureRandomInt,
): Crossword {
  if (entries.length === 0) {
    return {
      width: 0,
      height: 0,
      cells: [],
      numbers: [],
      entries: [],
      unplaced: [],
    };
  }
  const chars = entries.map((e) => Array.from(e.word));

  let best: Layout | null = null;
  let bestArea = Infinity;
  for (let attempt = 0; attempt < LAYOUT_ATTEMPTS; attempt++) {
    const layout = tryLayout(chars, randomInt, attempt % 2 === 1);
    const w = layout.maxX - layout.minX + 1;
    const h = layout.maxY - layout.minY + 1;
    // 置けた語が多いものを優先し、同数なら盤面が小さい（正方形に近い）ものを選ぶ
    const area = Math.max(w, h) * 1000 + w * h;
    if (
      !best ||
      layout.unplaced.length < best.unplaced.length ||
      (layout.unplaced.length === best.unplaced.length && area < bestArea)
    ) {
      best = layout;
      bestArea = area;
    }
  }
  const layout = best as Layout;

  const width = layout.maxX - layout.minX + 1;
  const height = layout.maxY - layout.minY + 1;
  const cells: (string | null)[] = new Array(width * height).fill(null);
  for (const cell of layout.cells.values()) {
    cells[(cell.y - layout.minY) * width + (cell.x - layout.minX)] = cell.ch;
  }

  // 開始マスに左上から順に番号をふる
  const starts = new Map<number, Partial<Record<Direction, number>>>();
  for (const p of layout.placed) {
    const index = (p.y - layout.minY) * width + (p.x - layout.minX);
    const slot = starts.get(index) ?? {};
    slot[p.direction] = p.index;
    starts.set(index, slot);
  }
  const numbers: number[] = new Array(width * height).fill(0);
  const result: CrosswordEntry[] = [];
  let next = 1;
  for (let index = 0; index < width * height; index++) {
    const slot = starts.get(index);
    if (!slot) continue;
    numbers[index] = next;
    for (const direction of ['across', 'down'] as const) {
      const entryIndex = slot[direction];
      if (entryIndex === undefined) continue;
      result.push({
        ...entries[entryIndex],
        number: next,
        direction,
        x: index % width,
        y: Math.floor(index / width),
      });
    }
    next++;
  }

  return {
    width,
    height,
    cells,
    numbers,
    entries: result,
    unplaced: layout.unplaced.map((i) => entries[i]),
  };
}
