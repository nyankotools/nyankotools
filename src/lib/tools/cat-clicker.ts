export type UpgradeId = 'paw' | 'glove' | 'kitten' | 'yarn' | 'tower' | 'boat';

export interface UpgradeDef {
  id: UpgradeId;
  kind: 'click' | 'auto';
  baseCost: number;
  /** click: 1クリックあたりの加算量 / auto: 毎秒の加算量（1レベルあたり） */
  value: number;
}

export const UPGRADES: readonly UpgradeDef[] = [
  { id: 'paw', kind: 'click', baseCost: 20, value: 1 },
  { id: 'glove', kind: 'click', baseCost: 500, value: 10 },
  { id: 'kitten', kind: 'auto', baseCost: 30, value: 1 },
  { id: 'yarn', kind: 'auto', baseCost: 200, value: 5 },
  { id: 'tower', kind: 'auto', baseCost: 1500, value: 30 },
  { id: 'boat', kind: 'auto', baseCost: 10000, value: 200 },
];

export const COST_GROWTH = 1.15;
/** 放置で加算される最大時間（ミリ秒）。8時間 */
export const MAX_OFFLINE_MS = 8 * 60 * 60 * 1000;
/** 数値が際限なく大きくならないようにする上限 */
export const MAX_VALUE = 1e300;
export const MAX_LEVEL = 10000;

export type Levels = Record<UpgradeId, number>;

export interface GameState {
  /** 現在持っているポイント */
  points: number;
  /** これまでに稼いだ合計 */
  total: number;
  clicks: number;
  levels: Levels;
  /** 最後に経過時間を反映した時刻（epoch ミリ秒） */
  lastAt: number;
}

export function emptyLevels(): Levels {
  return { paw: 0, glove: 0, kitten: 0, yarn: 0, tower: 0, boat: 0 };
}

export function createState(now: number): GameState {
  return { points: 0, total: 0, clicks: 0, levels: emptyLevels(), lastAt: now };
}

function def(id: UpgradeId): UpgradeDef {
  return UPGRADES.find((u) => u.id === id)!;
}

export function upgradeCost(id: UpgradeId, level: number): number {
  const cost = Math.ceil(def(id).baseCost * Math.pow(COST_GROWTH, level));
  return Math.min(cost, MAX_VALUE);
}

export function clickPower(levels: Levels): number {
  let p = 1;
  for (const u of UPGRADES) if (u.kind === 'click') p += u.value * levels[u.id];
  return p;
}

export function perSecond(levels: Levels): number {
  let p = 0;
  for (const u of UPGRADES) if (u.kind === 'auto') p += u.value * levels[u.id];
  return p;
}

function add(state: GameState, amount: number): GameState {
  return {
    ...state,
    points: Math.min(state.points + amount, MAX_VALUE),
    total: Math.min(state.total + amount, MAX_VALUE),
  };
}

export function clickCat(state: GameState): GameState {
  const s = add(state, clickPower(state.levels));
  return { ...s, clicks: s.clicks + 1 };
}

export function canBuy(state: GameState, id: UpgradeId): boolean {
  const level = state.levels[id];
  return level < MAX_LEVEL && state.points >= upgradeCost(id, level);
}

/** 買えない場合は null */
export function buyUpgrade(state: GameState, id: UpgradeId): GameState | null {
  if (!canBuy(state, id)) return null;
  const cost = upgradeCost(id, state.levels[id]);
  return {
    ...state,
    points: state.points - cost,
    levels: { ...state.levels, [id]: state.levels[id] + 1 },
  };
}

export interface TickResult {
  state: GameState;
  /** 今回加算されたポイント */
  gained: number;
  /** 実際に反映した経過ミリ秒（上限適用後） */
  elapsedMs: number;
  /** 上限で切り捨てられたか */
  capped: boolean;
}

/** 経過時間ぶんの放置加算。時計が戻っていた場合は加算せず基準時刻だけ更新する */
export function tick(
  state: GameState,
  now: number,
  maxMs: number = MAX_OFFLINE_MS,
): TickResult {
  const raw = now - state.lastAt;
  if (!Number.isFinite(raw) || raw <= 0) {
    return {
      state: { ...state, lastAt: now },
      gained: 0,
      elapsedMs: 0,
      capped: false,
    };
  }
  const capped = raw > maxMs;
  const elapsedMs = capped ? maxMs : raw;
  const gained = (perSecond(state.levels) * elapsedMs) / 1000;
  const next = add(state, gained);
  return { state: { ...next, lastAt: now }, gained, elapsedMs, capped };
}

export const SAVE_VERSION = 1;

export function serializeState(state: GameState): string {
  return JSON.stringify({
    v: SAVE_VERSION,
    points: state.points,
    total: state.total,
    clicks: state.clicks,
    levels: state.levels,
    savedAt: state.lastAt,
  });
}

function isNonNegNumber(v: unknown, max: number): v is number {
  return typeof v === 'number' && Number.isFinite(v) && v >= 0 && v <= max;
}

/** 壊れた・不正なデータは null */
export function parseState(raw: string | null | undefined): GameState | null {
  if (!raw) return null;
  let data: unknown;
  try {
    data = JSON.parse(raw);
  } catch {
    return null;
  }
  if (typeof data !== 'object' || data === null) return null;
  const o = data as Record<string, unknown>;
  if (o.v !== SAVE_VERSION) return null;
  if (
    !isNonNegNumber(o.points, MAX_VALUE) ||
    !isNonNegNumber(o.total, MAX_VALUE) ||
    !isNonNegNumber(o.clicks, Number.MAX_SAFE_INTEGER) ||
    !isNonNegNumber(o.savedAt, 8.64e15)
  ) {
    return null;
  }
  if (typeof o.levels !== 'object' || o.levels === null) return null;
  const lv = o.levels as Record<string, unknown>;
  const levels = emptyLevels();
  for (const u of UPGRADES) {
    const v = lv[u.id];
    if (v === undefined) continue;
    if (!Number.isInteger(v) || !isNonNegNumber(v, MAX_LEVEL)) return null;
    levels[u.id] = v as number;
  }
  return {
    points: o.points,
    total: o.total,
    clicks: Math.floor(o.clicks),
    levels,
    lastAt: o.savedAt,
  };
}

const SUFFIXES = ['', 'K', 'M', 'B', 'T', 'Qa', 'Qi', 'Sx', 'Sp', 'Oc', 'No'];

/** 読みやすい表記。1,234 / 1.23M / 1.5e+40 */
export function formatNumber(value: number): string {
  if (!Number.isFinite(value) || value < 0) return '0';
  if (value < 1000) {
    const v = Math.floor(value * 10) / 10;
    return Number.isInteger(v) ? String(v) : v.toFixed(1);
  }
  if (value < 1e6) return Math.floor(value).toLocaleString('en-US');
  const exp = Math.floor(Math.log10(value) / 3);
  if (exp >= SUFFIXES.length) return value.toExponential(2).replace('e+', 'e');
  let scaled = value / Math.pow(1000, exp);
  // 桁上がり（999.999M → 1000M）対策
  let e = exp;
  if (Number(scaled.toFixed(2)) >= 1000 && e + 1 < SUFFIXES.length) {
    e += 1;
    scaled = value / Math.pow(1000, e);
  }
  return `${scaled.toFixed(2)}${SUFFIXES[e]}`;
}
