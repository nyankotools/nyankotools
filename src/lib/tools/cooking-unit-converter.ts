export type CookingUnit = 'ml' | 'tsp' | 'tbsp' | 'cup' | 'g';
export type CupStandard = 'jp' | 'us' | 'metric';

export const COOKING_UNITS: readonly CookingUnit[] = [
  'tsp',
  'tbsp',
  'cup',
  'ml',
  'g',
];

/** 小さじ・大さじの容量（ml） */
export const TSP_ML = 5;
export const TBSP_ML = 15;

/** 1カップの容量（ml） */
export const CUP_ML: Record<CupStandard, number> = {
  jp: 200,
  us: 240,
  metric: 250,
};

export type IngredientId =
  | 'water'
  | 'flour'
  | 'starch'
  | 'sugar'
  | 'granulated'
  | 'salt'
  | 'oil'
  | 'milk'
  | 'butter'
  | 'honey'
  | 'soy'
  | 'miso'
  | 'rice';

/** 食材ごとの比重（1mlあたりのg）。一般に流通している目安値 */
export const INGREDIENT_DENSITY: Record<IngredientId, number> = {
  water: 1,
  flour: 0.6,
  starch: 0.6,
  sugar: 0.6,
  granulated: 0.8,
  salt: 1.2,
  oil: 0.9,
  milk: 1.03,
  butter: 0.9,
  honey: 1.4,
  soy: 1.2,
  miso: 1.2,
  rice: 0.83,
};

export const INGREDIENT_IDS = Object.keys(INGREDIENT_DENSITY) as IngredientId[];

export const MAX_AMOUNT = 1_000_000;

export interface CookingInput {
  amount: number;
  from: CookingUnit;
  ingredient: IngredientId;
  cup: CupStandard;
}

export type CookingResult = Record<CookingUnit, number>;

/** 1単位あたりのml。g は食材の比重から求めるため別扱い */
function mlPerUnit(unit: Exclude<CookingUnit, 'g'>, cup: CupStandard): number {
  switch (unit) {
    case 'ml':
      return 1;
    case 'tsp':
      return TSP_ML;
    case 'tbsp':
      return TBSP_ML;
    case 'cup':
      return CUP_ML[cup];
  }
}

/** 量を ml に直す。不正な入力は null */
export function toMilliliters(input: CookingInput): number | null {
  const { amount, from, ingredient, cup } = input;
  if (!Number.isFinite(amount) || amount < 0 || amount > MAX_AMOUNT)
    return null;
  const density = INGREDIENT_DENSITY[ingredient];
  if (density === undefined || CUP_ML[cup] === undefined) return null;
  if (from === 'g') return amount / density;
  return amount * mlPerUnit(from, cup);
}

/** すべての単位に換算する。不正な入力は null */
export function convertCooking(input: CookingInput): CookingResult | null {
  const ml = toMilliliters(input);
  if (ml === null) return null;
  const density = INGREDIENT_DENSITY[input.ingredient];
  return {
    tsp: ml / TSP_ML,
    tbsp: ml / TBSP_ML,
    cup: ml / CUP_ML[input.cup],
    ml,
    g: ml * density,
  };
}

/** 表示用に丸める（小数2桁、末尾の0は落とす） */
export function formatAmount(value: number): string {
  if (!Number.isFinite(value)) return '';
  const rounded = Math.round(value * 100) / 100;
  return String(rounded === 0 ? 0 : rounded);
}

export interface IngredientRow {
  id: IngredientId;
  tsp: number;
  tbsp: number;
  cup: number;
}

/** 食材ごとの 小さじ1・大さじ1・1カップ あたりのg */
export function buildIngredientTable(cup: CupStandard = 'jp'): IngredientRow[] {
  return INGREDIENT_IDS.map((id) => ({
    id,
    tsp: TSP_ML * INGREDIENT_DENSITY[id],
    tbsp: TBSP_ML * INGREDIENT_DENSITY[id],
    cup: CUP_ML[cup] * INGREDIENT_DENSITY[id],
  }));
}
