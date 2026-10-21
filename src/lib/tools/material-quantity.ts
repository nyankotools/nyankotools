/** 1畳あたりの面積（㎡）。不動産の表示基準（1畳=1.62㎡以上）に合わせた値 */
export const SQM_PER_TATAMI = 1.62;

export type RoomMode = 'dims' | 'area';

export interface RoomInput {
  mode: RoomMode;
  /** 部屋の幅（m）。dims のとき */
  width: number;
  /** 部屋の奥行（m）。dims のとき */
  depth: number;
  /** 天井高（m）。dims かつ壁面素材のとき */
  height: number;
  /** 面積の直接入力（㎡）。area のとき（壁面素材なら壁の総面積、床材なら床面積） */
  area: number;
  /** ドアの数（0以上の整数） */
  doors: number;
  /** ドア1枚の面積（㎡） */
  doorArea: number;
  /** 窓の数（0以上の整数） */
  windows: number;
  /** 窓1枚の面積（㎡） */
  windowArea: number;
}

export type MaterialSpec =
  | { kind: 'wallpaper'; rollWidthM: number; rollLengthM: number }
  | { kind: 'paint'; coveragePerL: number; coats: number; canLiters: number }
  | {
      kind: 'tile';
      pieceWidthCm: number;
      pieceLengthCm: number;
      piecesPerBox: number;
    };

export interface MaterialInput {
  room: RoomInput;
  /** ロス率（%）。0以上 */
  lossPercent: number;
  material: MaterialSpec;
}

export interface AreaBreakdown {
  /** 壁面（wall）か床面（floor）か */
  surface: 'wall' | 'floor';
  /** 開口部を引く前の面積（㎡） */
  grossArea: number;
  /** 開口部の合計面積（㎡）。床材では 0 */
  openingArea: number;
  /** 施工面積（㎡） */
  netArea: number;
  /** ロスを加えた面積（㎡） */
  areaWithLoss: number;
  /** 施工面積の畳換算 */
  tatami: number;
}

export type MaterialResult =
  | (AreaBreakdown & {
      kind: 'wallpaper';
      rollAreaSqm: number;
      rolls: number;
    })
  | (AreaBreakdown & {
      kind: 'paint';
      litersNeeded: number;
      cans: number;
      /** 缶の購入量の合計（L） */
      litersPurchased: number;
    })
  | (AreaBreakdown & {
      kind: 'tile';
      pieceAreaSqm: number;
      pieces: number;
      boxes: number;
    });

/** 浮動小数点誤差で 10.0000000001 → 11 になるのを避けて切り上げる */
export function ceilSafe(value: number): number {
  return Math.ceil(Math.round(value * 1e6) / 1e6);
}

const isPositive = (n: number) => Number.isFinite(n) && n > 0;
const isNonNegInt = (n: number) => Number.isInteger(n) && n >= 0;
const isNonNeg = (n: number) => Number.isFinite(n) && n >= 0;

/** 畳数に換算する（1畳=1.62㎡） */
export function sqmToTatami(sqm: number): number {
  return sqm / SQM_PER_TATAMI;
}

/**
 * 部屋の入力から施工面積を求める。入力が不正、または施工面積が0以下なら null。
 */
export function calculateArea(
  room: RoomInput,
  surface: 'wall' | 'floor',
  lossPercent: number,
): AreaBreakdown | null {
  if (!isNonNeg(lossPercent)) return null;
  let gross: number;
  if (room.mode === 'dims') {
    if (!isPositive(room.width) || !isPositive(room.depth)) return null;
    if (surface === 'wall') {
      if (!isPositive(room.height)) return null;
      gross = 2 * (room.width + room.depth) * room.height;
    } else {
      gross = room.width * room.depth;
    }
  } else {
    if (!isPositive(room.area)) return null;
    gross = room.area;
  }

  let opening = 0;
  if (surface === 'wall') {
    if (!isNonNegInt(room.doors) || !isNonNegInt(room.windows)) return null;
    if (!isNonNeg(room.doorArea) || !isNonNeg(room.windowArea)) return null;
    opening = room.doors * room.doorArea + room.windows * room.windowArea;
  }

  const net = gross - opening;
  if (!(net > 0)) return null;
  return {
    surface,
    grossArea: gross,
    openingArea: opening,
    netArea: net,
    areaWithLoss: net * (1 + lossPercent / 100),
    tatami: sqmToTatami(net),
  };
}

/**
 * 壁紙のロール数、塗料の缶数、タイル・床材の枚数と箱数を求める。
 * 入力が不正な場合は null。
 */
export function calculateMaterial(input: MaterialInput): MaterialResult | null {
  const { material, room, lossPercent } = input;
  const surface = material.kind === 'tile' ? 'floor' : 'wall';
  const area = calculateArea(room, surface, lossPercent);
  if (area === null) return null;

  if (material.kind === 'wallpaper') {
    if (!isPositive(material.rollWidthM) || !isPositive(material.rollLengthM))
      return null;
    const rollAreaSqm = material.rollWidthM * material.rollLengthM;
    return {
      ...area,
      kind: 'wallpaper',
      rollAreaSqm,
      rolls: ceilSafe(area.areaWithLoss / rollAreaSqm),
    };
  }

  if (material.kind === 'paint') {
    if (
      !isPositive(material.coveragePerL) ||
      !isPositive(material.canLiters) ||
      !Number.isInteger(material.coats) ||
      material.coats < 1
    )
      return null;
    const litersNeeded =
      (area.areaWithLoss * material.coats) / material.coveragePerL;
    const cans = ceilSafe(litersNeeded / material.canLiters);
    return {
      ...area,
      kind: 'paint',
      litersNeeded,
      cans,
      litersPurchased: cans * material.canLiters,
    };
  }

  if (
    !isPositive(material.pieceWidthCm) ||
    !isPositive(material.pieceLengthCm) ||
    !Number.isInteger(material.piecesPerBox) ||
    material.piecesPerBox < 1
  )
    return null;
  const pieceAreaSqm = (material.pieceWidthCm * material.pieceLengthCm) / 1e4;
  const pieces = ceilSafe(area.areaWithLoss / pieceAreaSqm);
  return {
    ...area,
    kind: 'tile',
    pieceAreaSqm,
    pieces,
    boxes: ceilSafe(pieces / material.piecesPerBox),
  };
}
