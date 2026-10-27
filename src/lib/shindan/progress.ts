/**
 * 診断の途中保存（16.9）。sessionStorage に置き、タブを閉じれば消える（共有PCに回答を残さない）。
 * 名前は保存せず、名前から作った variant だけを持つ（結果の再現にはそれで足りる）。
 * ここは純粋関数のみ。storage の読み書き（try/catch）は呼び出し側で行う。
 */
import { parseShareCode } from './codec';
import { VARIANT_MAX } from './normalize';
import type { ThemeSpec } from './types';

export type Progress = {
  /** 回答時の採点表の版（版が変わったら破棄する） */
  version: number;
  /** 答えた分の回答（全問より少ない） */
  answers: number[];
  variant: number;
  /** 診断後に相性を見る相手の共有コード */
  vs?: string;
};

export function progressKey(themeId: string): string {
  return `shindan:${themeId}:progress`;
}

/** 保存された文字列を読む。現行版の途中の回答として正しくなければ null */
export function parseProgress(
  raw: string | null,
  theme: ThemeSpec,
): Progress | null {
  if (!raw) return null;
  let value: unknown;
  try {
    value = JSON.parse(raw);
  } catch {
    return null;
  }
  if (typeof value !== 'object' || value === null) return null;
  const { version, answers, variant, vs } = value as Record<string, unknown>;
  const questions = theme.scoring.questions;
  if (version !== theme.version) return null;
  if (
    !Array.isArray(answers) ||
    answers.length >= questions.length ||
    !answers.every(
      (a, i) =>
        Number.isInteger(a) && a >= 0 && a < questions[i].choices.length,
    )
  ) {
    return null;
  }
  if (
    typeof variant !== 'number' ||
    !Number.isInteger(variant) ||
    variant < 0 ||
    variant > VARIANT_MAX
  ) {
    return null;
  }
  const progress: Progress = {
    version,
    answers: answers as number[],
    variant,
  };
  if (typeof vs === 'string' && parseShareCode(vs)) progress.vs = vs;
  return progress;
}
