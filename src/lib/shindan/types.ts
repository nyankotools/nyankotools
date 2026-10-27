/**
 * 診断エンジンの型定義。
 * テーマはIDと数値だけを持つ構造データ（文言は別の辞書でIDから引く）。
 * seed も文言を使わないため、言語を追加しても結果は変わらない。
 */

/** レア度（低い順） */
export const RARITIES = ['N', 'R', 'SR', 'SSR', 'UR', 'LR'] as const;
export type Rarity = (typeof RARITIES)[number];

/** 軸の極 */
export type Pole = '+' | '-';

export type PoleCondition = { axis: string; pole: Pole };

export type Choice = {
  id: string;
  /** 軸ID → 加点（負なら − 極側） */
  effects: Record<string, number>;
};

export type Question = {
  id: string;
  /** 2〜4択（共有URLで1問2bitに符号化するため4択まで） */
  choices: Choice[];
};

export type Axis = {
  id: string;
  /** 偏りの強さの閾値 [★2の下限, ★3の下限]（スコアの絶対値） */
  stars: [number, number];
};

/** 極の組み合わせで決まる結果タイプ（猫タイプ診断では猫種） */
export type ResultType = {
  id: string;
  poles: Record<string, Pole>;
};

/**
 * 採点表。ここを変える（配点・軸・タイプ対応・出現率）ときは themeVersion を上げ、
 * 旧版の採点表は legacyScoring に残す（16.5）。
 */
export type ScoringTable = {
  questions: Question[];
  axes: Axis[];
  types: ResultType[];
  /** 出現率（千分率。合計1000） */
  rarityRates: Record<Rarity, number>;
};

export type Part = {
  id: string;
  /** すべて満たすときだけ候補になる */
  when?: PoleCondition[];
  /** 出現重み（既定 1） */
  weight?: number;
  /** このレア度以上でのみ候補になる */
  rarityMin?: Rarity;
};

export type Slot = {
  id: string;
  /** 選ぶ部品の数 */
  count: number;
  /** このレア度未満では選ばない（空になる） */
  rarityMin?: Rarity;
  parts: Part[];
};

export type CompatConfig = {
  /** 一致した軸の数（0〜軸数）ごとの相性%の範囲 [min, max]。100は回答が完全一致した相手専用 */
  bands: [number, number][];
  /** 結果タイプID → ベストパートナーのタイプID（タイプごとに固定。16.9） */
  partners?: Record<string, string>;
};

export type ThemeSpec = {
  /** URLスラッグ兼 seed の一部 */
  id: string;
  /** 現行の採点表の版 */
  version: number;
  scoring: ScoringTable;
  /** 旧版の採点表（版 → 表） */
  legacyScoring?: Record<number, ScoringTable>;
  slots: Slot[];
  compat: CompatConfig;
};

export type AxisResult = {
  score: number;
  pole: Pole;
  stars: 1 | 2 | 3;
};

export type DiagnosisResult = {
  themeId: string;
  themeVersion: number;
  typeId: string;
  rarity: Rarity;
  axes: Record<string, AxisResult>;
  /** スロットID → 選ばれた部品IDの列 */
  parts: Record<string, string[]>;
  /** 各設問で選んだ選択肢の位置（0始まり） */
  answers: number[];
  /** 名前由来のバリエーション値（0 = 名前なし） */
  variant: number;
  /** 共有コード `<engineVer>.<themeVer>.<payload>` */
  code: string;
};
