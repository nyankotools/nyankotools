/**
 * 宅配サイズ判定（縦・横・高さと重さから各社のサイズ区分・利用可否を判定する）。
 * 料金は扱わず、区分表の上限だけを照合する。
 * ヤマト運輸・日本郵便・佐川急便の公式サイトの寸法・重量条件（令和8年時点）に基づく。
 * 各社のサービス改定があったら、下の SERVICES を見直す。
 */

/** 基準年（令和8年 = 2026年）。表示用の文言は辞書側に持つ */
export const PARCEL_BASIS_YEAR = 2026;

export type ParcelGroup = 'yamato' | 'jp' | 'sagawa';

export const SERVICE_IDS = [
  'yamato-takkyubin',
  'yamato-compact',
  'yamato-nekopos',
  'yupack',
  'yupacket',
  'yupacket-plus',
  'letterpack-light',
  'letterpack-plus',
  'teikeigai-standard',
  'teikeigai-irregular',
  'sagawa-hikyaku',
  'sagawa-large',
] as const;

export type ServiceId = (typeof SERVICE_IDS)[number];

/** サイズ区分（3辺合計の上限と重量の上限） */
interface Tier {
  size: number;
  maxSum: number;
  maxKg: number;
}

/** 薄型・専用箱などの上限。null/未指定は制限なし */
interface Limits {
  /** 最長辺（cm） */
  longest?: number;
  /** 中間の辺（cm） */
  middle?: number;
  /** 最短辺 = 厚さ（cm） */
  thickness?: number;
  /** 3辺合計（cm） */
  sum?: number;
  /** 重量（kg） */
  kg?: number;
}

type ServiceDef =
  | { id: ServiceId; group: ParcelGroup; kind: 'tier'; tiers: Tier[] }
  | { id: ServiceId; group: ParcelGroup; kind: 'limits'; limits: Limits };

/** 宅急便（ヤマト運輸）: 3辺合計と重量の両方で区分が決まる。最大200サイズ・30kg */
const YAMATO_TIERS: Tier[] = [
  { size: 60, maxSum: 60, maxKg: 2 },
  { size: 80, maxSum: 80, maxKg: 5 },
  { size: 100, maxSum: 100, maxKg: 10 },
  { size: 120, maxSum: 120, maxKg: 15 },
  { size: 140, maxSum: 140, maxKg: 20 },
  { size: 160, maxSum: 160, maxKg: 25 },
  { size: 180, maxSum: 180, maxKg: 30 },
  { size: 200, maxSum: 200, maxKg: 30 },
];

/** ゆうパック: 区分は3辺合計で決まり、重量は全区分で25kgまで。最大170サイズ */
const YUPACK_TIERS: Tier[] = [60, 80, 100, 120, 140, 160, 170].map((s) => ({
  size: s,
  maxSum: s,
  maxKg: 25,
}));

/** 飛脚宅配便（佐川急便）: 3辺合計と重量の両方で区分が決まる。120サイズは無く、最大160サイズ・30kg */
const SAGAWA_TIERS: Tier[] = [
  { size: 60, maxSum: 60, maxKg: 2 },
  { size: 80, maxSum: 80, maxKg: 5 },
  { size: 100, maxSum: 100, maxKg: 10 },
  { size: 140, maxSum: 140, maxKg: 20 },
  { size: 160, maxSum: 160, maxKg: 30 },
];

export const SERVICES: readonly ServiceDef[] = [
  {
    id: 'yamato-takkyubin',
    group: 'yamato',
    kind: 'tier',
    tiers: YAMATO_TIERS,
  },
  {
    // 専用BOX（外寸 縦25×横20×厚さ5cm）に入ること
    id: 'yamato-compact',
    group: 'yamato',
    kind: 'limits',
    limits: { longest: 25, middle: 20, thickness: 5 },
  },
  {
    // A4サイズ（31.2×22.8cm）、厚さ3.5cm、1kgまで
    id: 'yamato-nekopos',
    group: 'yamato',
    kind: 'limits',
    limits: { longest: 31.2, middle: 22.8, thickness: 3.5, kg: 1 },
  },
  { id: 'yupack', group: 'jp', kind: 'tier', tiers: YUPACK_TIERS },
  {
    id: 'yupacket',
    group: 'jp',
    kind: 'limits',
    limits: { longest: 34, thickness: 3, sum: 60, kg: 1 },
  },
  {
    // 専用箱（外寸 縦24×横17×高さ7.5cm）に入ること、2kgまで
    id: 'yupacket-plus',
    group: 'jp',
    kind: 'limits',
    limits: { longest: 24, middle: 17, thickness: 7.5, kg: 2 },
  },
  {
    id: 'letterpack-light',
    group: 'jp',
    kind: 'limits',
    limits: { longest: 34, middle: 24.8, thickness: 3, kg: 4 },
  },
  {
    // 厚さの制限なし（封がきちんと閉じられること）
    id: 'letterpack-plus',
    group: 'jp',
    kind: 'limits',
    limits: { longest: 34, middle: 24.8, kg: 4 },
  },
  {
    id: 'teikeigai-standard',
    group: 'jp',
    kind: 'limits',
    limits: { longest: 34, middle: 25, thickness: 3, kg: 1 },
  },
  {
    id: 'teikeigai-irregular',
    group: 'jp',
    kind: 'limits',
    limits: { longest: 60, sum: 90, kg: 4 },
  },
  { id: 'sagawa-hikyaku', group: 'sagawa', kind: 'tier', tiers: SAGAWA_TIERS },
  {
    // 飛脚ラージサイズ宅配便: 飛脚宅配便に収まらない（3辺合計160cm超または30kg超）荷物。上限は3辺合計260cm・50kg
    id: 'sagawa-large',
    group: 'sagawa',
    kind: 'limits',
    limits: { sum: 260, kg: 50 },
  },
];

export type LimitKind = 'sum' | 'longest' | 'middle' | 'thickness' | 'weight';

/** 超えた上限（limit は上限値、actual は入力側の値。cm または kg） */
export interface ExceededLimit {
  kind: LimitKind;
  limit: number;
  actual: number;
}

export interface ServiceResult {
  id: ServiceId;
  group: ParcelGroup;
  fits: boolean;
  /** サイズ区分のあるサービスで、収まる最小のサイズ。区分なし・収まらないときは null */
  size: number | null;
  /** 区分が3辺合計と重量のどちらで決まったか。区分なし・収まらないときは null */
  decidedBy: 'sum' | 'weight' | null;
  /** 収まらない理由（収まるときは空） */
  exceeded: ExceededLimit[];
}

export interface ParcelInput {
  lengthCm: number;
  widthCm: number;
  heightCm: number;
  weightKg: number;
}

export interface ParcelCheckResult {
  /** 3辺合計（cm） */
  sum: number;
  longest: number;
  middle: number;
  shortest: number;
  weightKg: number;
  services: ServiceResult[];
}

/** 小数の誤差（22.8 + 3 など）を避けるため、0.01単位の整数にして比較する */
function scaled(value: number): number {
  return Math.round(value * 100);
}

function exceeds(value: number, limit: number): boolean {
  return scaled(value) > scaled(limit);
}

function checkTier(
  def: Extract<ServiceDef, { kind: 'tier' }>,
  sum: number,
  kg: number,
): ServiceResult {
  const { tiers } = def;
  const bySum = tiers.findIndex((t) => !exceeds(sum, t.maxSum));
  const byWeight = tiers.findIndex((t) => !exceeds(kg, t.maxKg));
  if (bySum >= 0 && byWeight >= 0) {
    const index = Math.max(bySum, byWeight);
    return {
      id: def.id,
      group: def.group,
      fits: true,
      size: tiers[index].size,
      decidedBy: byWeight > bySum ? 'weight' : 'sum',
      exceeded: [],
    };
  }
  const top = tiers[tiers.length - 1];
  const exceeded: ExceededLimit[] = [];
  if (bySum < 0) exceeded.push({ kind: 'sum', limit: top.maxSum, actual: sum });
  if (byWeight < 0) {
    exceeded.push({ kind: 'weight', limit: top.maxKg, actual: kg });
  }
  return {
    id: def.id,
    group: def.group,
    fits: false,
    size: null,
    decidedBy: null,
    exceeded,
  };
}

function checkLimits(
  def: Extract<ServiceDef, { kind: 'limits' }>,
  dims: { sum: number; longest: number; middle: number; shortest: number },
  kg: number,
): ServiceResult {
  const { limits } = def;
  const exceeded: ExceededLimit[] = [];
  const test = (kind: LimitKind, actual: number, limit: number | undefined) => {
    if (limit !== undefined && exceeds(actual, limit)) {
      exceeded.push({ kind, limit, actual });
    }
  };
  test('sum', dims.sum, limits.sum);
  test('longest', dims.longest, limits.longest);
  test('middle', dims.middle, limits.middle);
  test('thickness', dims.shortest, limits.thickness);
  test('weight', kg, limits.kg);
  return {
    id: def.id,
    group: def.group,
    fits: exceeded.length === 0,
    size: null,
    decidedBy: null,
    exceeded,
  };
}

function isPositive(value: number): boolean {
  return Number.isFinite(value) && value > 0;
}

/**
 * 縦・横・高さ（cm）と重さ（kg）から、各サービスの利用可否を判定する。
 * 値が正の有限数でなければ null。
 */
export function checkParcel(input: ParcelInput): ParcelCheckResult | null {
  const { lengthCm, widthCm, heightCm, weightKg } = input;
  if (
    !isPositive(lengthCm) ||
    !isPositive(widthCm) ||
    !isPositive(heightCm) ||
    !isPositive(weightKg)
  ) {
    return null;
  }
  const [longest, middle, shortest] = [lengthCm, widthCm, heightCm].sort(
    (a, b) => b - a,
  );
  const sum = Math.round((lengthCm + widthCm + heightCm) * 100) / 100;
  const dims = { sum, longest, middle, shortest };
  const services = SERVICES.map((def) =>
    def.kind === 'tier'
      ? checkTier(def, sum, weightKg)
      : checkLimits(def, dims, weightKg),
  );
  return { sum, longest, middle, shortest, weightKg, services };
}
