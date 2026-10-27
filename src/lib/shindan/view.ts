import type { ShindanThemeTexts } from '../../i18n/shindan/types';
import { compat, compatSeed } from './compat';
import { unitHash } from './hash';
import type { DiagnosisResult, Rarity, ThemeSpec } from './types';

export type AxisView = {
  id: string;
  label: string;
  /** 結果の極の名前（例: 活発） */
  poleLabel: string;
  stars: 1 | 2 | 3;
};

/** 結果画面に出す文言をまとめたもの（部品IDを文言に置き換えた結果） */
export type ResultView = {
  title: string;
  /** 称号の区切り（カード画像で改行してよい位置。連結すると title になる） */
  titleSegments: string[];
  typeId: string;
  typeName: string;
  typeDescription: string;
  rarity: Rarity;
  /** 出現率（%表記の数値。例: 4.5） */
  rarityRate: number;
  axes: AxisView[];
  strengths: string[];
  hiddenSide: string;
  quote: string;
  luckyItem: string;
  luckyAction: string;
};

/** 称号の組み立て順。空のスロット（レア度が足りない rarityPrefix 等）は飛ばす */
const TITLE_SLOTS = ['rarityPrefix', 'titlePrefix', 'titleSuffix'];

/**
 * 診断結果を表示用の文言に変換する。
 * 文言が欠けている部品は空文字になる（テーマのテストで欠けがないことを保証する）。
 */
export function buildResultView(
  theme: ThemeSpec,
  texts: ShindanThemeTexts,
  result: DiagnosisResult,
): ResultView {
  const partText = (slotId: string, partId: string) =>
    texts.parts[slotId]?.[partId] ?? '';
  const pick = (slotId: string) =>
    (result.parts[slotId] ?? []).map((id) => partText(slotId, id));
  const first = (slotId: string) => pick(slotId)[0] ?? '';

  const type = texts.types[result.typeId];
  const table =
    result.themeVersion === theme.version
      ? theme.scoring
      : (theme.legacyScoring?.[result.themeVersion] ?? theme.scoring);

  // 後半（極の名前）と猫の短縮名は1語として扱い、間で改行しない
  const prefixes = TITLE_SLOTS.slice(0, -1).flatMap(pick);
  const last = `${pick(TITLE_SLOTS[TITLE_SLOTS.length - 1]).join('')}${type?.shortName ?? ''}`;
  const titleSegments = [...prefixes, last].filter((s) => s !== '');

  return {
    title: titleSegments.join(''),
    titleSegments,
    typeId: result.typeId,
    typeName: type?.name ?? '',
    typeDescription: type?.description ?? '',
    rarity: result.rarity,
    rarityRate: table.rarityRates[result.rarity] / 10,
    axes: table.axes.map(({ id }) => {
      const axis = result.axes[id];
      const axisTexts = texts.axes[id];
      return {
        id,
        label: axisTexts?.label ?? '',
        poleLabel:
          (axis.pole === '+' ? axisTexts?.plus : axisTexts?.minus) ?? '',
        stars: axis.stars,
      };
    }),
    strengths: pick('strength'),
    hiddenSide: first('hiddenSide'),
    quote: first('quote'),
    luckyItem: first('luckyItem'),
    luckyAction: first('luckyAction'),
  };
}

export type CompatAxisView = {
  label: string;
  selfPole: string;
  otherPole: string;
  same: boolean;
};

/** 相性の表示用の文言（self = 見ている本人、other = 相手） */
export type CompatView = {
  percent: number;
  twins: boolean;
  matches: number;
  relationName: string;
  comment: string;
  /** 現行の採点表の軸のうち、2人とも持っている軸の比較 */
  axes: CompatAxisView[];
  /** 本人のベストパートナー（テーマに定義がなければ undefined） */
  partner?: { typeId: string; typeName: string };
};

export function buildCompatView(
  theme: ThemeSpec,
  texts: ShindanThemeTexts,
  self: DiagnosisResult,
  other: DiagnosisResult,
): CompatView {
  const { matches, twins, percent } = compat(theme, self, other);
  const relation = twins ? texts.compat.twins : texts.compat.relations[matches];
  const comments = relation?.comments ?? [];
  const pick = unitHash(compatSeed(theme.id, self.code, other.code), 'comment');
  const poleLabel = (axisId: string, pole: '+' | '-') =>
    (pole === '+' ? texts.axes[axisId]?.plus : texts.axes[axisId]?.minus) ?? '';
  const partnerId = theme.compat.partners?.[self.typeId];

  return {
    percent,
    twins,
    matches,
    relationName: relation?.name ?? '',
    comment: comments[Math.floor(pick * comments.length)] ?? '',
    axes: theme.scoring.axes
      .filter(({ id }) => self.axes[id] && other.axes[id])
      .map(({ id }) => ({
        label: texts.axes[id]?.label ?? '',
        selfPole: poleLabel(id, self.axes[id].pole),
        otherPole: poleLabel(id, other.axes[id].pole),
        same: self.axes[id].pole === other.axes[id].pole,
      })),
    partner: partnerId
      ? { typeId: partnerId, typeName: texts.types[partnerId]?.name ?? '' }
      : undefined,
  };
}
