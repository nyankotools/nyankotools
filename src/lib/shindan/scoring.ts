import type { AxisResult, Pole, ResultType, ScoringTable } from './types';

/** 回答が採点表に対して有効か（問数・選択肢の範囲） */
export function isValidAnswers(
  table: ScoringTable,
  answers: readonly number[],
): boolean {
  return (
    answers.length === table.questions.length &&
    answers.every(
      (a, i) =>
        Number.isInteger(a) && a >= 0 && a < table.questions[i].choices.length,
    )
  );
}

/**
 * スコアが0のときの極。その軸に寄与した最後の回答の向きに倒し、
 * どの回答も寄与していなければ + にする（seed は使わず回答だけで決める）。
 */
function tieBreak(
  table: ScoringTable,
  answers: readonly number[],
  axisId: string,
): Pole {
  for (let i = answers.length - 1; i >= 0; i--) {
    const effect = table.questions[i].choices[answers[i]].effects[axisId] ?? 0;
    if (effect !== 0) return effect > 0 ? '+' : '-';
  }
  return '+';
}

/** 回答から各軸のスコア・極・偏りの強さ（★）を求める。回答は検証済みであること */
export function scoreAxes(
  table: ScoringTable,
  answers: readonly number[],
): Record<string, AxisResult> {
  const scores: Record<string, number> = {};
  for (const axis of table.axes) scores[axis.id] = 0;
  answers.forEach((a, i) => {
    for (const [axisId, value] of Object.entries(
      table.questions[i].choices[a].effects,
    )) {
      scores[axisId] += value;
    }
  });

  const result: Record<string, AxisResult> = {};
  for (const axis of table.axes) {
    const score = scores[axis.id];
    const pole: Pole =
      score === 0 ? tieBreak(table, answers, axis.id) : score > 0 ? '+' : '-';
    const strength = Math.abs(score);
    const stars =
      strength >= axis.stars[1] ? 3 : strength >= axis.stars[0] ? 2 : 1;
    result[axis.id] = { score, pole, stars };
  }
  return result;
}

/** 極の組み合わせに対応する結果タイプ */
export function findType(
  table: ScoringTable,
  axes: Record<string, AxisResult>,
): ResultType | undefined {
  return table.types.find((type) =>
    table.axes.every((axis) => type.poles[axis.id] === axes[axis.id].pole),
  );
}
