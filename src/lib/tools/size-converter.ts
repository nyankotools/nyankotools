export type SizeCategory =
  'womens-clothing' | 'mens-clothing' | 'womens-shoes' | 'mens-shoes' | 'ring';

export const sizeCategories: SizeCategory[] = [
  'womens-clothing',
  'mens-clothing',
  'womens-shoes',
  'mens-shoes',
  'ring',
];

/** 表の列ID。表示名は辞書側で持つ */
export type SizeColumn =
  | 'jp'
  | 'alpha'
  | 'bust'
  | 'chest'
  | 'cm'
  | 'us'
  | 'uk'
  | 'eu'
  | 'circumference'
  | 'diameter';

export type SizeRow = Partial<Record<SizeColumn, string>>;

const columns: Record<SizeCategory, SizeColumn[]> = {
  'womens-clothing': ['jp', 'alpha', 'bust', 'us', 'uk', 'eu'],
  'mens-clothing': ['alpha', 'chest', 'us', 'uk', 'eu'],
  'womens-shoes': ['cm', 'us', 'uk', 'eu'],
  'mens-shoes': ['cm', 'us', 'uk', 'eu'],
  ring: ['jp', 'circumference', 'diameter', 'us', 'uk', 'eu'],
};

/** 0.5刻みに丸める */
function roundHalf(n: number): number {
  return Math.round(n * 2) / 2;
}

function fmt(n: number): string {
  return Number.isInteger(n) ? String(n) : n.toFixed(1);
}

function buildWomensClothing(): SizeRow[] {
  // [号, 表記, JIS 女子 AR体型のバスト(cm)]
  const base: [number, string, number][] = [
    [5, 'XS', 77],
    [7, 'S', 80],
    [9, 'M', 83],
    [11, 'L', 86],
    [13, 'LL (XL)', 89],
    [15, '3L', 92],
    [17, '4L', 95],
    [19, '5L', 98],
  ];
  return base.map(([jp, alpha, bust]) => ({
    jp: String(jp),
    alpha,
    bust: String(bust),
    us: String(jp - 5),
    uk: String(jp - 1),
    eu: String(jp + 27),
  }));
}

function buildMensClothing(): SizeRow[] {
  // [表記, US/UKのチェスト(inch)]
  const base: [string, number][] = [
    ['S', 34],
    ['M', 36],
    ['L', 38],
    ['LL (XL)', 40],
    ['3L', 42],
    ['4L', 44],
    ['5L', 46],
  ];
  return base.map(([alpha, inch]) => ({
    alpha,
    chest: String(Math.round(inch * 2.54)),
    us: String(inch),
    uk: String(inch),
    eu: String(inch + 10),
  }));
}

function buildShoes(
  fromCm: number,
  toCm: number,
  usOffset: number,
  ukOffset: number,
): SizeRow[] {
  const rows: SizeRow[] = [];
  for (let cm = fromCm; cm <= toCm + 1e-9; cm += 0.5) {
    const us = cm - usOffset;
    rows.push({
      cm: cm.toFixed(1),
      us: fmt(us),
      uk: fmt(us - ukOffset),
      // パリ・ポイント: (足長 + ゆとり1.5cm) × 1.5
      eu: fmt(roundHalf((cm + 1.5) * 1.5)),
    });
  }
  return rows;
}

const UK_LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

function buildRings(): SizeRow[] {
  const rows: SizeRow[] = [];
  for (let jp = 1; jp <= 30; jp++) {
    // JIS: 内周(mm) = 号数 + 40（1号 = 41mm、1号ごとに+1mm）
    const circumference = 40 + jp;
    const diameter = circumference / Math.PI;
    // US: 内径 = 11.63 + 0.8128 × サイズ
    const us = roundHalf((diameter - 11.63) / 0.8128);
    const ukIndex = Math.round(us * 2) - 1;
    rows.push({
      jp: String(jp),
      circumference: circumference.toFixed(1),
      diameter: diameter.toFixed(1),
      us: fmt(us),
      uk: ukIndex >= 0 && ukIndex < 26 ? UK_LETTERS[ukIndex] : '—',
      eu: String(Math.round(circumference)),
    });
  }
  return rows;
}

const rowsByCategory: Record<SizeCategory, SizeRow[]> = {
  'womens-clothing': buildWomensClothing(),
  'mens-clothing': buildMensClothing(),
  // 日本の足長(cm)基準。US = cm − 17（女性）/ cm − 18（男性）
  'womens-shoes': buildShoes(21, 26, 17, 2),
  'mens-shoes': buildShoes(24, 30, 18, 1),
  ring: buildRings(),
};

export function getColumns(category: SizeCategory): SizeColumn[] {
  return columns[category];
}

export function getRows(category: SizeCategory): SizeRow[] {
  return rowsByCategory[category];
}

/** 指定列に現れる値（重複・「—」を除く、表の順） */
export function getValues(
  category: SizeCategory,
  column: SizeColumn,
): string[] {
  const seen = new Set<string>();
  for (const row of rowsByCategory[category]) {
    const v = row[column];
    if (v !== undefined && v !== '—') seen.add(v);
  }
  return [...seen];
}

/** 指定列の値に一致する最初の行。見つからなければ null */
export function findRow(
  category: SizeCategory,
  column: SizeColumn,
  value: string,
): SizeRow | null {
  return rowsByCategory[category].find((r) => r[column] === value) ?? null;
}
