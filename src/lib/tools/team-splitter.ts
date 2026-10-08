/**
 * チーム分け・グループ分けのロジック。
 * 乱数は src/lib/random.ts（crypto.getRandomValues）。テストでは randomInt を差し替える。
 */
import { secureRandomInt, shuffle, type RandomInt } from '../random';

export { parseLines } from '../random';

export const MAX_NAMES = 200;
export const MAX_TEAMS = 100;

export type SplitMode = 'teams' | 'size';

export type SplitError = 'tooFewNames' | 'tooManyNames' | 'invalidValue';

export interface SplitPlan {
  /** チーム数 */
  teamCount: number;
  /** 各チームの人数（先頭ほど多い。差は高々1） */
  sizes: number[];
}

/**
 * 名簿の人数と分け方から、チーム数と各チームの人数を決める。
 * - teams: value をチーム数とする（2以上、人数以下、MAX_TEAMS以下）
 * - size: value を1チームの人数の目安とし、チーム数は ceil(人数 / value)。
 *   余りは各チームに1人ずつ均等に振り分けるため、目安より小さいチームができることがある。
 */
export function planSplit(
  nameCount: number,
  mode: SplitMode,
  value: number,
): SplitPlan | SplitError {
  if (nameCount < 2) return 'tooFewNames';
  if (nameCount > MAX_NAMES) return 'tooManyNames';
  if (!Number.isInteger(value) || value < 1) return 'invalidValue';
  let teamCount: number;
  if (mode === 'teams') {
    if (value < 2 || value > nameCount || value > MAX_TEAMS) {
      return 'invalidValue';
    }
    teamCount = value;
  } else {
    if (value > nameCount) return 'invalidValue';
    teamCount = Math.ceil(nameCount / value);
    if (teamCount < 2 || teamCount > MAX_TEAMS) return 'invalidValue';
  }
  const base = Math.floor(nameCount / teamCount);
  const extra = nameCount % teamCount;
  return {
    teamCount,
    sizes: Array.from({ length: teamCount }, (_, i) =>
      i < extra ? base + 1 : base,
    ),
  };
}

export function isSplitError(plan: SplitPlan | SplitError): plan is SplitError {
  return typeof plan === 'string';
}

/**
 * 名簿をシャッフルして各チームに振り分ける。同名の人も別々の1人として扱う。
 * 人数が多いチームの位置もランダムになるよう、チームの並びも入れ替える。
 */
export function splitTeams(
  names: readonly string[],
  plan: SplitPlan,
  randomInt: RandomInt = secureRandomInt,
): string[][] {
  const shuffled = shuffle(names, randomInt);
  const sizes = shuffle(plan.sizes, randomInt);
  const teams: string[][] = [];
  let offset = 0;
  for (const size of sizes) {
    teams.push(shuffled.slice(offset, offset + size));
    offset += size;
  }
  return teams;
}

/** コピー用のテキスト。チームごとに見出し行と名前の行を並べ、チーム間は空行で区切る */
export function formatTeamsText(
  teams: readonly (readonly string[])[],
  labels: readonly string[],
): string {
  return teams
    .map((members, i) => [labels[i] ?? `#${i + 1}`, ...members].join('\n'))
    .join('\n\n');
}
