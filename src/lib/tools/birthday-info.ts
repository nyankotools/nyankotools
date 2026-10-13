import { calculateFullAge } from './age-calculator';
import { getWeekday, isValidDate, type DateParts } from './date-calculator';

export interface BirthdayInfo {
  /** 十二支のインデックス（0=子〜11=亥） */
  branchIndex: number;
  /** 十干のインデックス（0=甲〜9=癸） */
  stemIndex: number;
  /** 六十干支のインデックス（0=甲子〜59=癸亥） */
  sexagenaryIndex: number;
  /** 星座のインデックス（ZODIAC_SIGNS の順。0=牡羊座〜11=魚座） */
  zodiacIndex: number;
  /** 誕生石・誕生花のインデックス（0=1月〜11=12月） */
  monthIndex: number;
  /** 生まれた曜日（0=日曜〜6=土曜） */
  weekday: number;
  /** 満年齢。基準日が生年月日より前の場合は null */
  fullAge: number | null;
  /** 基準日の年が生まれ年と同じ干支か（年男・年女の年） */
  isEtoYear: boolean;
  /** 基準日の年より後で、同じ干支になる最初の年（12年後） */
  nextEtoYear: number;
  /** nextEtoYear に迎える（誕生日時点の）年齢 */
  ageInNextEtoYear: number;
}

/** 星座の並び（インデックスの意味）。表示名は辞書側で持つ */
export const ZODIAC_SIGNS = [
  'aries',
  'taurus',
  'gemini',
  'cancer',
  'leo',
  'virgo',
  'libra',
  'scorpio',
  'sagittarius',
  'capricorn',
  'aquarius',
  'pisces',
] as const;

/** 各星座の開始日（月・日）。山羊座は12/22〜翌1/19で年をまたぐため別扱い */
const ZODIAC_STARTS: Array<[number, number, number]> = [
  // [開始月, 開始日, 星座インデックス]
  [1, 20, 10], // 水瓶座
  [2, 19, 11], // 魚座
  [3, 21, 0], // 牡羊座
  [4, 20, 1], // 牡牛座
  [5, 21, 2], // 双子座
  [6, 22, 3], // 蟹座
  [7, 23, 4], // 獅子座
  [8, 23, 5], // 乙女座
  [9, 23, 6], // 天秤座
  [10, 24, 7], // 蠍座
  [11, 23, 8], // 射手座
  [12, 22, 9], // 山羊座
];

/** 月日から星座のインデックスを返す（1/1〜1/19は山羊座） */
export function getZodiacIndex(month: number, day: number): number {
  let result = 9; // 1/1〜1/19 は山羊座（前年12/22から続く）
  for (const [m, d, index] of ZODIAC_STARTS) {
    if (month > m || (month === m && day >= d)) result = index;
  }
  return result;
}

/** 西暦年から六十干支のインデックスを返す（西暦4年が甲子）。暦年で数え、立春では切り替えない。 */
export function getSexagenaryIndex(year: number): number {
  return (((year - 4) % 60) + 60) % 60;
}

/**
 * 生年月日から干支・星座・誕生石（月）・誕生花（月）・曜日・満年齢などを求める。
 * 日付が実在しない場合は null。
 */
export function getBirthdayInfo(
  birth: DateParts,
  reference: DateParts,
): BirthdayInfo | null {
  if (birth.year < 1 || birth.year > 9999) return null;
  if (!isValidDate(birth.year, birth.month, birth.day)) return null;
  if (!isValidDate(reference.year, reference.month, reference.day)) {
    return null;
  }
  const weekday = getWeekday(birth.year, birth.month, birth.day)!;
  const sexagenaryIndex = getSexagenaryIndex(birth.year);
  const branchIndex = sexagenaryIndex % 12;
  const stemIndex = sexagenaryIndex % 10;

  const baseYear = Math.max(reference.year, birth.year);
  // baseYear より後で、同じ十二支の最初の年
  let nextEtoYear = baseYear + 1;
  while (getSexagenaryIndex(nextEtoYear) % 12 !== branchIndex) nextEtoYear++;

  return {
    branchIndex,
    stemIndex,
    sexagenaryIndex,
    zodiacIndex: getZodiacIndex(birth.month, birth.day),
    monthIndex: birth.month - 1,
    weekday,
    fullAge: calculateFullAge(birth, reference),
    isEtoYear:
      reference.year >= birth.year &&
      getSexagenaryIndex(reference.year) % 12 === branchIndex,
    nextEtoYear,
    ageInNextEtoYear: nextEtoYear - birth.year,
  };
}
