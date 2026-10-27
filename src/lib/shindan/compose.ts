import {
  decodePayload,
  encodePayload,
  formatShareCode,
  parseShareCode,
} from './codec';
import { cyrb53, unitHash } from './hash';
import { VARIANT_MAX } from './normalize';
import { rollRarity } from './rarity';
import { findType, isValidAnswers, scoreAxes } from './scoring';
import { selectParts } from './select';
import type { DiagnosisResult, ScoringTable, ThemeSpec } from './types';

/**
 * hash・正規化・符号化を変えたら上げる（旧実装は残す。16.5）。
 * いまの restore は現行版しか復元しないので、上げる前に「版ごとに hash・normalize・codec を
 * 切り替える層」を足すこと（足さずに上げると既存の共有URLがすべて復元できなくなる）。
 */
export const ENGINE_VERSION = 1;

/** 指定した版の採点表（現行か legacyScoring） */
export function scoringFor(
  theme: ThemeSpec,
  version: number,
): ScoringTable | undefined {
  return version === theme.version
    ? theme.scoring
    : theme.legacyScoring?.[version];
}

/** seed は themeId・回答・variant だけから作る（themeVersion と文言は含めない。16.5） */
export function resultSeed(
  themeId: string,
  answers: readonly number[],
  variant: number,
): number {
  return cyrb53(`${themeId}|${answers.join(',')}|${variant}`);
}

/**
 * 回答と variant から結果を作る。入力が不正なら null。
 * タイプと★は指定版の採点表、レア度は指定版の出現率、部品は現行の定義で決める。
 */
export function diagnose(
  theme: ThemeSpec,
  answers: readonly number[],
  variant: number,
  themeVersion = theme.version,
): DiagnosisResult | null {
  const table = scoringFor(theme, themeVersion);
  if (!table || !isValidAnswers(table, answers)) return null;
  if (!Number.isInteger(variant) || variant < 0 || variant > VARIANT_MAX) {
    return null;
  }

  const axes = scoreAxes(table, answers);
  const type = findType(table, axes);
  if (!type) return null;

  const seed = resultSeed(theme.id, answers, variant);
  const rarity = rollRarity(unitHash(seed, 'rarity'), table.rarityRates);
  const parts: Record<string, string[]> = {};
  for (const slot of theme.slots) {
    parts[slot.id] = selectParts(slot, seed, axes, rarity);
  }

  return {
    themeId: theme.id,
    themeVersion,
    typeId: type.id,
    rarity,
    axes,
    parts,
    answers: [...answers],
    variant,
    code: formatShareCode({
      engineVersion: ENGINE_VERSION,
      themeVersion,
      payload: encodePayload(answers, variant),
    }),
  };
}

/** 共有コードから結果を再現する。未知の版・壊れた値は null */
export function restore(
  theme: ThemeSpec,
  codeText: string,
): DiagnosisResult | null {
  const code = parseShareCode(codeText);
  if (!code || code.engineVersion !== ENGINE_VERSION) return null;
  const table = scoringFor(theme, code.themeVersion);
  if (!table) return null;
  const decoded = decodePayload(code.payload, table.questions.length);
  if (!decoded) return null;
  return diagnose(theme, decoded.answers, decoded.variant, code.themeVersion);
}

/** 結果の中身を表すキー（かぶり率の検証用） */
export function resultFingerprint(result: DiagnosisResult): string {
  const parts = Object.keys(result.parts)
    .sort()
    .map((slotId) => `${slotId}=${result.parts[slotId].join('+')}`);
  return [result.typeId, result.rarity, ...parts].join('|');
}
