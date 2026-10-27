/**
 * 猫タイプ診断の構造データ（設計書16章）。文言は src/i18n/shindan/neko.ts に部品IDで持つ。
 * 採点表（配点・軸・タイプ対応・出現率）を変えるときは version を上げ、旧版を legacyScoring に残すこと。
 */
import { DEFAULT_RARITY_RATES } from '../../lib/shindan/rarity';
import type {
  Part,
  Pole,
  Question,
  ResultType,
  Slot,
  ThemeSpec,
} from '../../lib/shindan/types';

export const NEKO_AXES = ['energy', 'social', 'curious', 'affection'] as const;
export type NekoAxis = (typeof NEKO_AXES)[number];

/**
 * 12問。各問は1つの軸だけに効き、選択肢は +2 / +1 / −1 / −2 のいずれか。
 * 並びは設問ごとに変え、「先頭の選択肢 = + 極」にならないようにする。
 */
const QUESTION_DEFS: [NekoAxis, number[]][] = [
  ['energy', [2, 1, -1, -2]],
  ['social', [1, 2, -2, -1]],
  ['curious', [-1, 2, 1, -2]],
  ['affection', [2, -1, 1, -2]],
  ['energy', [-2, 1, 2, -1]],
  ['social', [2, -1, 1, -2]],
  ['curious', [2, 1, -2, -1]],
  ['affection', [-1, 2, -2, 1]],
  ['energy', [1, -1, 2, -2]],
  ['social', [-2, 2, -1, 1]],
  ['curious', [1, -1, -2, 2]],
  ['affection', [2, 1, -1, -2]],
];

const questions: Question[] = QUESTION_DEFS.map(([axis, values], i) => ({
  id: `q${i + 1}`,
  choices: values.map((value, c) => ({
    id: `c${c + 1}`,
    effects: { [axis]: value },
  })),
}));

/** 極の組み合わせ（活動性・社交性・好奇心・甘え の順）→ 猫タイプID（16.3） */
const TYPE_TABLE: [string, Pole, Pole, Pole, Pole][] = [
  ['abyssinian', '+', '+', '+', '+'],
  ['somali', '+', '+', '+', '-'],
  ['chatora', '+', '+', '-', '+'],
  ['siberian', '+', '+', '-', '-'],
  ['siamese', '+', '-', '+', '+'],
  ['bengal', '+', '-', '+', '-'],
  ['kijitora', '+', '-', '-', '+'],
  ['american-shorthair', '+', '-', '-', '-'],
  ['maine-coon', '-', '+', '+', '+'],
  ['norwegian-forest', '-', '+', '+', '-'],
  ['ragdoll', '-', '+', '-', '+'],
  ['british-shorthair', '-', '+', '-', '-'],
  ['mike', '-', '-', '+', '+'],
  ['kuroneko', '-', '-', '+', '-'],
  ['persian', '-', '-', '-', '+'],
  ['russian-blue', '-', '-', '-', '-'],
];

export const NEKO_TYPE_IDS = TYPE_TABLE.map(([id]) => id);

const types: ResultType[] = TYPE_TABLE.map(([id, ...poles]) => ({
  id,
  poles: Object.fromEntries(NEKO_AXES.map((axis, i) => [axis, poles[i]])),
}));

const POLE_KEYS: { axis: NekoAxis; pole: Pole; key: string }[] =
  NEKO_AXES.flatMap((axis) =>
    (['+', '-'] as const).map((pole) => ({
      axis,
      pole,
      key: `${axis}${pole === '+' ? 'P' : 'M'}`,
    })),
  );

/** 極ごとに n 個の部品（ID: `<prefix>-<軸><P|M>-<番号>`） */
function polarParts(prefix: string, n: number): Part[] {
  return POLE_KEYS.flatMap(({ axis, pole, key }) =>
    Array.from({ length: n }, (_, i) => ({
      id: `${prefix}-${key}-${i + 1}`,
      when: [{ axis, pole }],
    })),
  );
}

function plainParts(prefix: string, n: number): Part[] {
  return Array.from({ length: n }, (_, i) => ({ id: `${prefix}-${i + 1}` }));
}

const slots: Slot[] = [
  { id: 'titlePrefix', count: 1, parts: plainParts('tp', 12) },
  { id: 'titleSuffix', count: 1, parts: polarParts('ts', 2) },
  { id: 'strength', count: 3, parts: polarParts('st', 2) },
  { id: 'hiddenSide', count: 1, parts: polarParts('hs', 1) },
  { id: 'quote', count: 1, parts: plainParts('qt', 8) },
  { id: 'luckyItem', count: 1, parts: plainParts('li', 8) },
  { id: 'luckyAction', count: 1, parts: plainParts('la', 8) },
  {
    id: 'rarityPrefix',
    count: 1,
    rarityMin: 'SSR',
    parts: [
      ...plainParts('rp-ssr', 3).map((p) => ({
        ...p,
        rarityMin: 'SSR' as const,
      })),
      ...plainParts('rp-ur', 2).map((p) => ({
        ...p,
        rarityMin: 'UR' as const,
      })),
      ...plainParts('rp-lr', 2).map((p) => ({
        ...p,
        rarityMin: 'LR' as const,
        weight: 3,
      })),
    ],
  },
];

export const nekoTheme: ThemeSpec = {
  id: 'neko',
  version: 1,
  scoring: {
    questions,
    // 3問の合計は −6〜+6。一様な回答で ★3（|スコア|≧4）が約22%、★2（2〜3）が約41%（16.4）
    axes: NEKO_AXES.map((id) => ({ id, stars: [2, 4] })),
    types,
    rarityRates: DEFAULT_RARITY_RATES,
  },
  slots,
  compat: {
    bands: [
      [65, 74],
      [70, 79],
      [75, 86],
      [82, 93],
      [90, 99],
    ],
  },
};

export type CatImage = {
  src: string;
  width: number;
  height: number;
  /** 仮画像（本番画像に差し替えるまで true。公開前に1件も残っていないことを確認する。16.13） */
  mock?: true;
};

/** 猫タイプID → 画像。本番化はこの表と画像ファイルの差し替えのみで行う */
export const nekoCatImages: Record<string, CatImage> = Object.fromEntries(
  NEKO_TYPE_IDS.map((id) => [
    id,
    {
      src: `/shindan/neko/cats/${id}.svg`,
      width: 512,
      height: 512,
      mock: true,
    },
  ]),
);
