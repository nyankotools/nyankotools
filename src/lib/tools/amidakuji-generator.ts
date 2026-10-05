/**
 * あみだくじのロジック。
 * 乱数は crypto.getRandomValues（棄却サンプリングで偏りなし）。テストでは randomInt を差し替える。
 */
import { drawLots, secureRandomInt, type RandomInt } from './roulette-dice';

export const MAX_PLAYERS = 20;
export const MIN_PLAYERS = 2;
/** 隣り合う列の間に必ず入れる横線の最小本数 */
export const MIN_BARS = 3;

/** bars[row][col] が true なら、row 段目で col 列と col+1 列の間に横線がある */
export type Ladder = boolean[][];

export interface RoutePoint {
  col: number;
  /** 0 = 上端、1〜rows = 横線の段、rows + 1 = 下端 */
  row: number;
}

/** 改行区切りの入力から項目を取り出す（前後の空白と空行を除く） */
export function parseLines(text: string): string[] {
  return text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line !== '');
}

/** 並びをランダムに入れ替えた新しい配列を返す */
export function shuffle<T>(
  items: readonly T[],
  randomInt: RandomInt = secureRandomInt,
): T[] {
  return drawLots(items, items.length, randomInt);
}

/** 人数に応じた段数 */
export function rowCountFor(players: number): number {
  return Math.max(10, players * 3);
}

/** 横線をランダムに生成する。同じ段で隣り合う横線は作らず、どの隣接列の間にも最低 MIN_BARS 本は入れる */
export function generateLadder(
  players: number,
  randomInt: RandomInt = secureRandomInt,
  rows: number = rowCountFor(players),
): Ladder {
  const gaps = players - 1;
  const ladder: Ladder = [];
  for (let r = 0; r < rows; r++) {
    const row: boolean[] = new Array<boolean>(gaps).fill(false);
    for (let c = 0; c < gaps; c++) {
      if (c > 0 && row[c - 1]) continue;
      row[c] = randomInt(2) === 0;
    }
    ladder.push(row);
  }
  // 各隙間に最低 MIN_BARS 本の横線を入れる。同じ段で隣り合えないため、空きがなければ
  // 本数に余裕のある隣の隙間の横線を外して場所を空ける
  const count = (c: number) => ladder.filter((row) => row[c]).length;
  for (let c = 0; c < gaps; c++) {
    while (count(c) < MIN_BARS) {
      const free: number[] = [];
      const movable: number[] = [];
      for (let r = 0; r < rows; r++) {
        const row = ladder[r];
        if (row[c]) continue;
        const left = c > 0 && row[c - 1];
        const right = c < gaps - 1 && row[c + 1];
        if (!left && !right) free.push(r);
        else if (
          (!left || count(c - 1) > MIN_BARS) &&
          (!right || count(c + 1) > MIN_BARS)
        ) {
          movable.push(r);
        }
      }
      const pool = free.length > 0 ? free : movable;
      if (pool.length === 0) break;
      const r = pool[randomInt(pool.length)];
      if (c > 0) ladder[r][c - 1] = false;
      if (c < gaps - 1) ladder[r][c + 1] = false;
      ladder[r][c] = true;
    }
  }
  return ladder;
}

/** start 列から辿る経路（折れ点のみ）。最後の点が下端 */
export function traceRoute(ladder: Ladder, start: number): RoutePoint[] {
  const rows = ladder.length;
  let col = start;
  const points: RoutePoint[] = [{ col, row: 0 }];
  for (let r = 0; r < rows; r++) {
    const right = ladder[r][col] === true;
    const left = col > 0 && ladder[r][col - 1] === true;
    if (!right && !left) continue;
    points.push({ col, row: r + 1 });
    col += right ? 1 : -1;
    points.push({ col, row: r + 1 });
  }
  points.push({ col, row: rows + 1 });
  return points;
}

/** start 列から辿り着く下端の列 */
export function endColumn(ladder: Ladder, start: number): number {
  const route = traceRoute(ladder, start);
  return route[route.length - 1].col;
}
