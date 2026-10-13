/** GPA 計算のロジック（文言・DOM に依存しない純粋関数） */

export type ScaleId = 'jp-4' | 'us-4' | 'us-4-plus' | 'us-43';

export interface GradeDef {
  /** 評価記号（尺度内で一意。入力値としても使う） */
  label: string;
  /** グレードポイント（0.1 刻み） */
  point: number;
  /** 単位が取得できる評価か（F・不可は false） */
  earned: boolean;
}

export interface ScalePreset {
  id: ScaleId;
  grades: GradeDef[];
}

const g = (label: string, point: number, earned = true): GradeDef => ({
  label,
  point,
  earned,
});

/** 評価尺度のプリセット。大学・国によって異なるため、あくまで代表的な例 */
export const SCALES: ScalePreset[] = [
  {
    id: 'jp-4',
    grades: [g('S', 4), g('A', 3), g('B', 2), g('C', 1), g('D', 0, false)],
  },
  {
    id: 'us-4',
    grades: [g('A', 4), g('B', 3), g('C', 2), g('D', 1), g('F', 0, false)],
  },
  {
    id: 'us-4-plus',
    grades: [
      g('A+', 4),
      g('A', 4),
      g('A-', 3.7),
      g('B+', 3.3),
      g('B', 3),
      g('B-', 2.7),
      g('C+', 2.3),
      g('C', 2),
      g('C-', 1.7),
      g('D+', 1.3),
      g('D', 1),
      g('D-', 0.7),
      g('F', 0, false),
    ],
  },
  {
    id: 'us-43',
    grades: [
      g('A+', 4.3),
      g('A', 4),
      g('A-', 3.7),
      g('B+', 3.3),
      g('B', 3),
      g('B-', 2.7),
      g('C+', 2.3),
      g('C', 2),
      g('C-', 1.7),
      g('D+', 1.3),
      g('D', 1),
      g('D-', 0.7),
      g('F', 0, false),
    ],
  },
];

export const DEFAULT_SCALE: ScaleId = 'jp-4';
/** 1科目あたりの単位数の上限 */
export const MAX_CREDITS = 999;

export function getScale(id: string): ScalePreset | undefined {
  return SCALES.find((s) => s.id === id);
}

export interface CourseRow {
  name: string;
  /** 入力された単位数の文字列 */
  credits: string;
  /** 評価記号。未選択は空文字 */
  grade: string;
}

export type RowStatus =
  /** GPA に算入された */
  | 'counted'
  /** 何も入力されていない行 */
  | 'empty'
  /** 単位数が 0 または空で、GPA の計算から除外された */
  | 'zero-credits'
  /** 単位数はあるが評価が未選択で、除外された */
  | 'no-grade'
  /** 単位数が数値として読めない／範囲外 */
  | 'invalid-credits'
  /** 選択中の評価が現在の尺度に存在しない */
  | 'unknown-grade';

export interface RowResult {
  index: number;
  status: RowStatus;
  /** counted のときだけ値を持つ */
  credits: number;
  point: number;
  earned: boolean;
}

export interface GpaResult {
  rows: RowResult[];
  /** GPA の分母になる単位数（評価済みの単位の合計。F・不可も含む） */
  totalCredits: number;
  /** 取得した単位数（F・不可を除く） */
  earnedCredits: number;
  /** 単位数 × グレードポイント の合計 */
  gradePoints: number;
  /** 小数点2位に四捨五入した GPA。算入できる科目が無ければ null */
  gpa: number | null;
  countedCount: number;
  /** 評価が未選択のため除外された単位数 */
  ungradedCredits: number;
  /** 評価未選択で除外された行数 */
  ungradedCount: number;
  /** 単位数が不正な行数 */
  invalidCount: number;
}

/** 単位数の文字列を数値化する。空は 'blank'、読めない・範囲外は 'invalid' */
export function parseCredits(input: string): number | 'blank' | 'invalid' {
  const s = input.normalize('NFKC').trim();
  if (s === '') return 'blank';
  if (!/^\d+(\.\d+)?$/.test(s)) return 'invalid';
  const n = Number(s);
  if (!Number.isFinite(n) || n > MAX_CREDITS) return 'invalid';
  return n;
}

/** 科目の一覧と尺度から GPA を計算する。計算は整数で行い、2位への四捨五入を厳密にする */
export function calculateGpa(rows: CourseRow[], scaleId: string): GpaResult {
  const scale = getScale(scaleId) ?? SCALES[0];
  const results: RowResult[] = [];
  // 単位は 1/100 単位、ポイントは 1/10 単位の整数で集計する
  let totalH = 0;
  let earnedH = 0;
  let productSum = 0;
  let ungradedH = 0;
  let countedCount = 0;
  let ungradedCount = 0;
  let invalidCount = 0;

  rows.forEach((row, index) => {
    const base = { index, credits: 0, point: 0, earned: false };
    const parsed = parseCredits(row.credits);
    const hasGrade = row.grade !== '';
    if (parsed === 'invalid') {
      invalidCount++;
      results.push({ ...base, status: 'invalid-credits' });
      return;
    }
    if (parsed === 'blank' && !hasGrade && row.name.trim() === '') {
      results.push({ ...base, status: 'empty' });
      return;
    }
    if (parsed === 'blank' || parsed === 0) {
      results.push({ ...base, status: 'zero-credits' });
      return;
    }
    if (!hasGrade) {
      ungradedCount++;
      ungradedH += Math.round(parsed * 100);
      results.push({ ...base, status: 'no-grade', credits: parsed });
      return;
    }
    const grade = scale.grades.find((x) => x.label === row.grade);
    if (!grade) {
      ungradedCount++;
      ungradedH += Math.round(parsed * 100);
      results.push({ ...base, status: 'unknown-grade', credits: parsed });
      return;
    }
    const creditsH = Math.round(parsed * 100);
    const pointT = Math.round(grade.point * 10);
    totalH += creditsH;
    if (grade.earned) earnedH += creditsH;
    productSum += creditsH * pointT;
    countedCount++;
    results.push({
      ...base,
      status: 'counted',
      credits: parsed,
      point: grade.point,
      earned: grade.earned,
    });
  });

  let gpa: number | null = null;
  if (totalH > 0) {
    // gpa×100 = productSum×10 / totalH を四捨五入（整数演算）
    const hundredths = Math.floor((productSum * 20 + totalH) / (2 * totalH));
    gpa = hundredths / 100;
  }

  return {
    rows: results,
    totalCredits: totalH / 100,
    earnedCredits: earnedH / 100,
    gradePoints: productSum / 1000,
    gpa,
    countedCount,
    ungradedCredits: ungradedH / 100,
    ungradedCount,
    invalidCount,
  };
}

/** 単位数・ポイントの表示（不要な末尾の 0 を省く） */
export function formatNumber(n: number, maxDecimals = 2): string {
  return String(Number(n.toFixed(maxDecimals)));
}

/** GPA を小数点2位で表示する */
export function formatGpa(gpa: number | null): string {
  return gpa === null ? '' : gpa.toFixed(2);
}
