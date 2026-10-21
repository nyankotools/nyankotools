export type PetSpecies = 'dog' | 'cat';
export type DogSize = 'small' | 'medium' | 'large';
export type ConversionColumn = 'cat' | DogSize;

/** 1歳 = 人間の15歳、2歳 = 人間の24歳 */
const AGE_AT_1 = 15;
const AGE_AT_2 = 24;

/** 2歳以降に1年ごとに加算される人間換算年数 */
export const YEARLY_INCREMENT: Record<ConversionColumn, number> = {
  cat: 4,
  small: 4,
  medium: 5,
  large: 6,
};

export const MAX_PET_YEARS = 40;

export interface PetAgeInput {
  species: PetSpecies;
  /** 犬のときのみ使う。未指定なら中型犬 */
  size?: DogSize;
  years: number;
  months: number;
}

export interface PetAgeResult {
  /** ペットの年齢（月数の合計） */
  totalMonths: number;
  /** 人間換算年齢（小数、年単位） */
  humanAge: number;
  /** 人間換算年齢を年と月に分けたもの（月は四捨五入） */
  humanYears: number;
  humanMonths: number;
}

/**
 * ペットの年齢（年・小数可）を人間換算年齢にする。区分線形で、
 * 0〜1歳は0→15、1〜2歳は15→24、2歳以降は column ごとの増分で加算する。
 */
export function petYearsToHumanAge(
  petYears: number,
  column: ConversionColumn,
): number | null {
  if (!Number.isFinite(petYears) || petYears < 0) return null;
  if (petYears <= 1) return petYears * AGE_AT_1;
  if (petYears <= 2) return AGE_AT_1 + (petYears - 1) * (AGE_AT_2 - AGE_AT_1);
  return AGE_AT_2 + (petYears - 2) * YEARLY_INCREMENT[column];
}

function columnOf(input: PetAgeInput): ConversionColumn {
  return input.species === 'cat' ? 'cat' : (input.size ?? 'medium');
}

/** 年・月の入力から人間換算年齢を求める。不正な入力はnull */
export function convertPetAge(input: PetAgeInput): PetAgeResult | null {
  const { years, months } = input;
  if (!Number.isInteger(years) || !Number.isInteger(months)) return null;
  if (years < 0 || years > MAX_PET_YEARS) return null;
  if (months < 0 || months > 11) return null;
  if (years === MAX_PET_YEARS && months > 0) return null;
  const totalMonths = years * 12 + months;
  const humanAge = petYearsToHumanAge(totalMonths / 12, columnOf(input));
  if (humanAge === null) return null;
  const roundedMonths = Math.round(humanAge * 12);
  return {
    totalMonths,
    humanAge,
    humanYears: Math.floor(roundedMonths / 12),
    humanMonths: roundedMonths % 12,
  };
}

export interface ConversionRow {
  petYears: number;
  cat: number;
  small: number;
  medium: number;
  large: number;
}

/** 1歳から maxYears 歳までの換算表（猫・犬の体格別） */
export function buildConversionTable(maxYears = 20): ConversionRow[] {
  const rows: ConversionRow[] = [];
  for (let y = 1; y <= maxYears; y++) {
    rows.push({
      petYears: y,
      cat: petYearsToHumanAge(y, 'cat')!,
      small: petYearsToHumanAge(y, 'small')!,
      medium: petYearsToHumanAge(y, 'medium')!,
      large: petYearsToHumanAge(y, 'large')!,
    });
  }
  return rows;
}
