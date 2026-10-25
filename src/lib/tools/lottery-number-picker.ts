/**
 * ロト・ナンバーズの番号をランダムに選ぶロジック（娯楽用。当せんを保証するものではない）。
 * 乱数は src/lib/random.ts の secureRandomInt。テストでは randomInt を差し替える。
 */
import { secureRandomInt } from '../random';
import type { RandomInt } from '../random';

export type GameId = 'loto6' | 'miniloto' | 'loto7' | 'numbers3' | 'numbers4';

export type GameSpec =
  | { id: GameId; kind: 'loto'; max: number; pick: number }
  | { id: GameId; kind: 'numbers'; digits: number };

export const GAMES: readonly GameSpec[] = [
  { id: 'loto6', kind: 'loto', max: 43, pick: 6 },
  { id: 'miniloto', kind: 'loto', max: 31, pick: 5 },
  { id: 'loto7', kind: 'loto', max: 37, pick: 7 },
  { id: 'numbers3', kind: 'numbers', digits: 3 },
  { id: 'numbers4', kind: 'numbers', digits: 4 },
];

export const MIN_SETS = 1;
export const MAX_SETS = 20;

export function getGame(id: string): GameSpec | undefined {
  return GAMES.find((game) => game.id === id);
}

/** 1口分の番号を選ぶ。ロト系は重複なし・昇順、ナンバーズは各桁0〜9（重複あり・並びは抽選順） */
export function generateTicket(
  game: GameSpec,
  randomInt: RandomInt = secureRandomInt,
): number[] {
  if (game.kind === 'numbers') {
    return Array.from({ length: game.digits }, () => randomInt(10));
  }
  const pool = Array.from({ length: game.max }, (_, i) => i + 1);
  for (let i = 0; i < game.pick; i++) {
    const j = i + randomInt(pool.length - i);
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  return pool.slice(0, game.pick).sort((a, b) => a - b);
}

/** 入力値の検証。問題がなければ true */
export function isValidSetCount(count: number): boolean {
  return Number.isInteger(count) && count >= MIN_SETS && count <= MAX_SETS;
}

/** count 口分を選ぶ。count が範囲外なら RangeError */
export function generateTickets(
  game: GameSpec,
  count: number,
  randomInt: RandomInt = secureRandomInt,
): number[][] {
  if (!isValidSetCount(count)) throw new RangeError('invalid set count');
  return Array.from({ length: count }, () => generateTicket(game, randomInt));
}

/** 1口を文字列にする。ロトは2桁ゼロ埋めを空白区切り、ナンバーズは数字を連結 */
export function formatTicket(
  game: GameSpec,
  ticket: readonly number[],
): string {
  return game.kind === 'numbers'
    ? ticket.join('')
    : ticket.map((n) => String(n).padStart(2, '0')).join(' ');
}

/** コピー用。1口1行 */
export function formatTickets(
  game: GameSpec,
  tickets: readonly (readonly number[])[],
): string {
  return tickets.map((ticket) => formatTicket(game, ticket)).join('\n');
}
