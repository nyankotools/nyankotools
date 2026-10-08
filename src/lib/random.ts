/**
 * 乱数系ツール共通のヘルパー。
 * 乱数は crypto.getRandomValues（棄却サンプリングで偏りなし）。テストでは randomInt を差し替える。
 */

/** 0以上 max 未満の整数を返す関数 */
export type RandomInt = (max: number) => number;

export const secureRandomInt: RandomInt = (max) => {
  if (!Number.isInteger(max) || max < 1 || max > 0x100000000) {
    throw new RangeError('max must be an integer between 1 and 2^32');
  }
  const limit = Math.floor(0x100000000 / max) * max;
  const buffer = new Uint32Array(1);
  for (;;) {
    crypto.getRandomValues(buffer);
    if (buffer[0] < limit) return buffer[0] % max;
  }
};

/** 改行区切りの入力から項目を取り出す（前後の空白と空行を除く） */
export function parseLines(text: string): string[] {
  return text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line !== '');
}

/** Fisher-Yatesで並びをランダムに入れ替えた新しい配列を返す */
export function shuffle<T>(
  items: readonly T[],
  randomInt: RandomInt = secureRandomInt,
): T[] {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) {
    const j = randomInt(i + 1);
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}
