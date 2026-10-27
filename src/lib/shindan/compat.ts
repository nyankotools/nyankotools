import { cyrb53, unitHash } from './hash';
import type { DiagnosisResult, ThemeSpec } from './types';

export type CompatResult = {
  /** 極が一致した軸の数（関係タイプの決定に使う） */
  matches: number;
  /** 回答が完全一致（双子） */
  twins: boolean;
  /** 相性%（双子のみ100、それ以外は bands の範囲内） */
  percent: number;
};

/**
 * 2人の結果から相性を求める（16.9）。
 * 共有コードをソートしてから seed を作るので compat(a, b) と compat(b, a) は一致する。
 * 版が違う結果同士は、両方にある軸だけを比べる（双子は同じ版のときのみ）。
 */
export function compat(
  theme: ThemeSpec,
  a: DiagnosisResult,
  b: DiagnosisResult,
): CompatResult {
  const matches = Math.min(
    Object.keys(a.axes).filter(
      (axisId) => b.axes[axisId] && a.axes[axisId].pole === b.axes[axisId].pole,
    ).length,
    theme.compat.bands.length - 1,
  );
  const twins =
    a.themeVersion === b.themeVersion &&
    a.answers.length === b.answers.length &&
    a.answers.every((answer, i) => answer === b.answers[i]);
  if (twins) return { matches, twins, percent: 100 };

  const [min, max] = theme.compat.bands[matches];
  const seed = compatSeed(theme.id, a.code, b.code);
  const percent = min + Math.floor(unitHash(seed, 'percent') * (max - min + 1));
  return { matches, twins, percent };
}

/** 2人の共有コードから作る seed（順序に依存しない。相性%・コメントの選択に使う） */
export function compatSeed(
  themeId: string,
  codeA: string,
  codeB: string,
): number {
  return cyrb53(`${themeId}|vs|${[codeA, codeB].sort().join('|')}`);
}
