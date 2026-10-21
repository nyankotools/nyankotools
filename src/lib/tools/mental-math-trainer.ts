import {
  DIGITS_MAX,
  DIGITS_MIN,
  OP_IDS,
  OP_SYMBOL,
  SEED_MAX,
  generateProblems,
  type OpId,
  type Problem,
} from './math-drill-generator';

export { DIGITS_MAX, DIGITS_MIN, OP_IDS, OP_SYMBOL, SEED_MAX };
export type { OpId, Problem };

export const COUNT_CHOICES = [10, 20, 30, 50] as const;
/** 0 は制限時間なし */
export const LIMIT_CHOICES = [0, 30, 60, 120, 180, 300] as const;

export interface TrainerSettings {
  ops: OpId[];
  digitsA: number;
  digitsB: number;
  count: number;
  /** 制限時間（秒）。0 は制限なし */
  limitSec: number;
}

export const DEFAULT_SETTINGS: TrainerSettings = {
  ops: ['add'],
  digitsA: 1,
  digitsB: 1,
  count: 20,
  limitSec: 0,
};

export type SettingsError = 'ops' | 'digits' | 'count' | 'limit';

export function validateSettings(s: TrainerSettings): SettingsError | null {
  if (s.ops.length === 0 || s.ops.some((o) => !OP_IDS.includes(o)))
    return 'ops';
  const okDigits = (n: number) =>
    Number.isInteger(n) && n >= DIGITS_MIN && n <= DIGITS_MAX;
  if (!okDigits(s.digitsA) || !okDigits(s.digitsB)) return 'digits';
  if (!(COUNT_CHOICES as readonly number[]).includes(s.count)) return 'count';
  if (!(LIMIT_CHOICES as readonly number[]).includes(s.limitSec))
    return 'limit';
  return null;
}

/** 検証済みの設定から問題を作る（引き算は負にならず、割り算は割り切れる） */
export function createSession(s: TrainerSettings, seed: number): Problem[] {
  return generateProblems({
    ops: OP_IDS.filter((o) => s.ops.includes(o)),
    digitsA: s.digitsA,
    digitsB: s.digitsB,
    count: s.count,
    seed,
    allowNegative: false,
  });
}

export function problemLabel(p: Problem): string {
  return `${p.a} ${OP_SYMBOL[p.op]} ${p.b}`;
}

/** 入力を整数に直す。全角数字も受け付け、数字以外が混ざれば null */
export function parseAnswer(raw: string): number | null {
  const half = raw
    .trim()
    .replace(/[０-９]/g, (c) => String.fromCharCode(c.charCodeAt(0) - 0xfee0));
  if (!/^-?\d{1,9}$/.test(half)) return null;
  return Number(half);
}

export function isCorrect(p: Problem, raw: string): boolean {
  const n = parseAnswer(raw);
  return n !== null && n === p.answer;
}

export type Rank = 'S' | 'A' | 'B' | 'C' | 'D';

/** 正解率（未回答は不正解扱い）からランクを決める */
export function rankFor(correct: number, total: number): Rank {
  if (total <= 0) return 'D';
  const acc = (correct / total) * 100;
  if (acc >= 95) return 'S';
  if (acc >= 85) return 'A';
  if (acc >= 70) return 'B';
  if (acc >= 50) return 'C';
  return 'D';
}

export interface SessionStats {
  total: number;
  answered: number;
  correct: number;
  elapsedMs: number;
}

export interface SessionResult extends SessionStats {
  /** 出題数に対する正解率（%、小数第1位まで） */
  accuracy: number;
  /** 1問あたりの平均秒数（回答した問題のみ。未回答のときは 0） */
  avgSec: number;
  rank: Rank;
}

export function summarize(s: SessionStats): SessionResult {
  const accuracy =
    s.total > 0 ? Math.round((s.correct / s.total) * 1000) / 10 : 0;
  const avgSec =
    s.answered > 0 ? Math.round(s.elapsedMs / s.answered / 100) / 10 : 0;
  return { ...s, accuracy, avgSec, rank: rankFor(s.correct, s.total) };
}

export function formatDuration(ms: number): string {
  const total = Math.max(0, Math.round(ms / 100) / 10);
  const m = Math.floor(total / 60);
  const sec = total - m * 60;
  const secText = sec.toFixed(1).padStart(4, '0');
  return `${m}:${secText}`;
}

// ---- ベスト記録（設定ごと） ----

export interface BestRecord {
  correct: number;
  total: number;
  ms: number;
}
export type BestMap = Record<string, BestRecord>;

const MAX_BEST_ENTRIES = 60;

export function settingsKey(s: TrainerSettings): string {
  const ops = OP_IDS.filter((o) => s.ops.includes(o)).join('');
  return `${ops}|${s.digitsA}|${s.digitsB}|${s.count}|${s.limitSec}`;
}

const isNonNegInt = (v: unknown): v is number =>
  typeof v === 'number' && Number.isSafeInteger(v) && v >= 0;

/** 保存された文字列を読む。壊れていれば空にする */
export function parseBests(raw: string | null): BestMap {
  if (!raw) return {};
  let data: unknown;
  try {
    data = JSON.parse(raw);
  } catch {
    return {};
  }
  if (typeof data !== 'object' || data === null || Array.isArray(data))
    return {};
  const out: BestMap = {};
  for (const [key, v] of Object.entries(data)) {
    if (typeof v !== 'object' || v === null) continue;
    const r = v as Record<string, unknown>;
    if (!isNonNegInt(r.correct) || !isNonNegInt(r.total) || !isNonNegInt(r.ms))
      continue;
    if (r.total === 0 || r.correct > r.total) continue;
    out[key] = { correct: r.correct, total: r.total, ms: r.ms };
  }
  return out;
}

export function serializeBests(map: BestMap): string {
  return JSON.stringify(map);
}

/** 正解数が多い方、同じなら時間が短い方がよい記録 */
export function isBetter(next: BestRecord, prev: BestRecord | undefined) {
  if (!prev) return next.correct > 0;
  if (next.correct !== prev.correct) return next.correct > prev.correct;
  return next.ms < prev.ms;
}

/** 記録を更新した新しいマップと、更新したかどうかを返す（元は変更しない） */
export function recordBest(
  map: BestMap,
  key: string,
  next: BestRecord,
): { map: BestMap; updated: boolean } {
  if (!isBetter(next, map[key])) return { map, updated: false };
  const copy: BestMap = { ...map };
  delete copy[key];
  copy[key] = next;
  const keys = Object.keys(copy);
  for (const k of keys.slice(0, Math.max(0, keys.length - MAX_BEST_ENTRIES)))
    delete copy[k];
  return { map: copy, updated: true };
}
