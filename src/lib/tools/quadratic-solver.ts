/**
 * 二次方程式・連立一次方程式ソルバー（途中式つき）。
 * 表示用の文言は持たず、途中式は「種類(key) + 数式文字列(math)」の組で返す。
 * key に対応する見出しは i18n 辞書側で解決する。
 */

export type StepKey =
  | 'equation'
  | 'linearEquation'
  | 'discriminant'
  | 'formula'
  | 'solution'
  | 'determinant'
  | 'replacedDeterminant'
  | 'rankCheck';

export interface SolveStep {
  key: StepKey;
  math: string;
}

// ---------- 表示用ヘルパー ----------

/** 有効数字10桁で丸め、末尾の0を除いた文字列にする（-0 は 0）。 */
export function formatNumber(n: number): string {
  if (!Number.isFinite(n)) return String(n);
  if (Math.abs(n) < 1e-12) return '0';
  const v = Number(n.toPrecision(10));
  return Object.is(v, -0) ? '0' : String(v);
}

/** 負数は括弧で囲む（式への代入用）。 */
function paren(n: number): string {
  const s = formatNumber(n);
  return s.startsWith('-') ? `(${s})` : s;
}

function isZero(n: number): boolean {
  return Math.abs(n) < 1e-12;
}

/** 係数と変数名の組から「2x² - 3x + 1」のような多項式文字列を作る。全て0なら「0」。 */
function polynomial(terms: Array<[number, string]>): string {
  const parts: string[] = [];
  for (const [coef, variable] of terms) {
    if (isZero(coef)) continue;
    const abs = Math.abs(coef);
    const body =
      variable !== '' && Math.abs(abs - 1) < 1e-12
        ? variable
        : `${formatNumber(abs)}${variable}`;
    if (parts.length === 0) {
      parts.push(coef < 0 ? `-${body}` : body);
    } else {
      parts.push(coef < 0 ? `- ${body}` : `+ ${body}`);
    }
  }
  return parts.length === 0 ? '0' : parts.join(' ');
}

function gcd(a: number, b: number): number {
  let x = Math.abs(a);
  let y = Math.abs(b);
  while (y !== 0) {
    [x, y] = [y, x % y];
  }
  return x;
}

/** 整数の分子・分母を既約分数の文字列にする。整数になる場合や扱えない場合は null。 */
function fractionText(numerator: number, denominator: number): string | null {
  if (
    !Number.isSafeInteger(numerator) ||
    !Number.isSafeInteger(denominator) ||
    denominator === 0
  ) {
    return null;
  }
  const g = gcd(numerator, denominator) || 1;
  let n = numerator / g;
  let d = denominator / g;
  if (d < 0) {
    n = -n;
    d = -d;
  }
  if (d === 1) return null;
  return `${n}/${d}`;
}

// ---------- 二次方程式 ----------

export type QuadraticKind =
  'two-real' | 'double' | 'complex' | 'linear' | 'linear-none' | 'identity';

export interface QuadraticRoot {
  re: number;
  im: number;
  text: string;
}

export interface QuadraticResult {
  kind: QuadraticKind;
  /** 判別式 D = b² - 4ac（a = 0 のときは null） */
  discriminant: number | null;
  roots: QuadraticRoot[];
  steps: SolveStep[];
}

function complexText(re: number, im: number): string {
  if (isZero(im)) return formatNumber(re);
  const absIm = Math.abs(im);
  const imBody = Math.abs(absIm - 1) < 1e-12 ? 'i' : `${formatNumber(absIm)}i`;
  if (isZero(re)) return im < 0 ? `-${imBody}` : imBody;
  return `${formatNumber(re)} ${im < 0 ? '-' : '+'} ${imBody}`;
}

/** ax² + bx + c = 0 を解く。有限でない入力は null。 */
export function solveQuadratic(
  a: number,
  b: number,
  c: number,
): QuadraticResult | null {
  if (![a, b, c].every(Number.isFinite)) return null;

  const steps: SolveStep[] = [];

  if (isZero(a)) {
    steps.push({
      key: 'linearEquation',
      math: `${polynomial([
        [b, 'x'],
        [c, ''],
      ])} = 0`,
    });
    if (isZero(b)) {
      if (isZero(c)) {
        steps.push({ key: 'solution', math: '0 = 0' });
        return { kind: 'identity', discriminant: null, roots: [], steps };
      }
      steps.push({ key: 'solution', math: `${formatNumber(c)} = 0` });
      return { kind: 'linear-none', discriminant: null, roots: [], steps };
    }
    const x = -c / b;
    steps.push({
      key: 'solution',
      math: `x = -c / b = -${paren(c)} / ${paren(b)} = ${formatNumber(x)}`,
    });
    return {
      kind: 'linear',
      discriminant: null,
      roots: [{ re: x, im: 0, text: formatNumber(x) }],
      steps,
    };
  }

  steps.push({
    key: 'equation',
    math: `${polynomial([
      [a, 'x²'],
      [b, 'x'],
      [c, ''],
    ])} = 0   (a = ${formatNumber(a)}, b = ${formatNumber(b)}, c = ${formatNumber(c)})`,
  });

  const d = b * b - 4 * a * c;
  const dTol = 1e-12 * Math.max(b * b, Math.abs(4 * a * c));
  const dValue = Math.abs(d) <= dTol ? 0 : d;
  steps.push({
    key: 'discriminant',
    math: `D = b² - 4ac = ${paren(b)}² - 4·${paren(a)}·${paren(c)} = ${formatNumber(dValue)}`,
  });

  const denom = 2 * a;
  const minusB = -b;

  if (dValue > 0) {
    const sq = Math.sqrt(dValue);
    const x1 = (minusB + sq) / denom;
    const x2 = (minusB - sq) / denom;
    steps.push({
      key: 'formula',
      math: `x = (-b ± √D) / 2a = (${formatNumber(minusB)} ± √${formatNumber(dValue)}) / ${formatNumber(denom)}   (√D = ${formatNumber(sq)})`,
    });
    steps.push({
      key: 'solution',
      math: `x₁ = ${formatNumber(x1)}, x₂ = ${formatNumber(x2)}`,
    });
    return {
      kind: 'two-real',
      discriminant: dValue,
      roots: [
        { re: x1, im: 0, text: formatNumber(x1) },
        { re: x2, im: 0, text: formatNumber(x2) },
      ],
      steps,
    };
  }

  if (dValue === 0) {
    const x = minusB / denom;
    steps.push({
      key: 'formula',
      math: `x = -b / 2a = ${formatNumber(minusB)} / ${formatNumber(denom)}`,
    });
    steps.push({ key: 'solution', math: `x = ${formatNumber(x)}` });
    return {
      kind: 'double',
      discriminant: 0,
      roots: [{ re: x, im: 0, text: formatNumber(x) }],
      steps,
    };
  }

  const sqAbs = Math.sqrt(-dValue);
  const re = minusB / denom;
  const im = sqAbs / Math.abs(denom);
  steps.push({
    key: 'formula',
    math: `x = (-b ± √|D| i) / 2a = (${formatNumber(minusB)} ± √${formatNumber(-dValue)} i) / ${formatNumber(denom)}   (√|D| = ${formatNumber(sqAbs)})`,
  });
  const text1 = complexText(re, im);
  const text2 = complexText(re, -im);
  steps.push({
    key: 'solution',
    math: `x₁ = ${text1}, x₂ = ${text2}`,
  });
  return {
    kind: 'complex',
    discriminant: dValue,
    roots: [
      { re, im, text: text1 },
      { re, im: -im, text: text2 },
    ],
    steps,
  };
}

// ---------- 連立一次方程式（クラメルの公式） ----------

export type LinearSystemKind = 'unique' | 'none' | 'infinite';

export interface LinearSolution {
  variable: string;
  value: number;
  /** 整数入力で割り切れない場合の既約分数（例: "-1/3"）。それ以外は null */
  fraction: string | null;
  text: string;
}

export interface LinearSystemResult {
  kind: LinearSystemKind;
  size: 2 | 3;
  determinant: number;
  solutions: LinearSolution[];
  steps: SolveStep[];
}

const VARIABLES = ['x', 'y', 'z'];

interface Det {
  value: number;
  expr: string;
}

function det2(m: number[][]): Det {
  const [[a, b], [c, d]] = m;
  return {
    value: a * d - b * c,
    expr: `${paren(a)}·${paren(d)} - ${paren(b)}·${paren(c)}`,
  };
}

function det3(m: number[][]): Det {
  const [[a, b, c], [d, e, f], [g, h, i]] = m;
  const products: Array<[number, string]> = [
    [a * e * i, `${paren(a)}·${paren(e)}·${paren(i)}`],
    [b * f * g, `${paren(b)}·${paren(f)}·${paren(g)}`],
    [c * d * h, `${paren(c)}·${paren(d)}·${paren(h)}`],
    [-(c * e * g), `${paren(c)}·${paren(e)}·${paren(g)}`],
    [-(a * f * h), `${paren(a)}·${paren(f)}·${paren(h)}`],
    [-(b * d * i), `${paren(b)}·${paren(d)}·${paren(i)}`],
  ];
  const value = products.reduce((sum, [v]) => sum + v, 0);
  const expr = products
    .map(([, s], idx) => (idx < 3 ? (idx === 0 ? s : `+ ${s}`) : `- ${s}`))
    .join(' ');
  return { value, expr };
}

function det(m: number[][]): Det {
  return m.length === 2 ? det2(m) : det3(m);
}

/** 部分ピボット付きの掃き出しで階数を求める（許容誤差つき）。 */
function rank(matrix: number[][], tol: number): number {
  const m = matrix.map((row) => [...row]);
  const rows = m.length;
  const cols = m[0].length;
  let r = 0;
  for (let col = 0; col < cols && r < rows; col++) {
    let pivot = r;
    for (let i = r + 1; i < rows; i++) {
      if (Math.abs(m[i][col]) > Math.abs(m[pivot][col])) pivot = i;
    }
    if (Math.abs(m[pivot][col]) <= tol) continue;
    [m[r], m[pivot]] = [m[pivot], m[r]];
    for (let i = r + 1; i < rows; i++) {
      const factor = m[i][col] / m[r][col];
      for (let j = col; j < cols; j++) m[i][j] -= factor * m[r][j];
    }
    r++;
  }
  return r;
}

/**
 * 2元または3元の連立一次方程式を解く。
 * coefficients は n×n、constants は長さ n。サイズ不正・有限でない入力は null。
 */
export function solveLinearSystem(
  coefficients: number[][],
  constants: number[],
): LinearSystemResult | null {
  const n = coefficients.length;
  if (n !== 2 && n !== 3) return null;
  if (constants.length !== n) return null;
  if (coefficients.some((row) => row.length !== n)) return null;
  const all = [...coefficients.flat(), ...constants];
  if (!all.every(Number.isFinite)) return null;

  const size = n as 2 | 3;
  const vars = VARIABLES.slice(0, n);
  const steps: SolveStep[] = [];

  const equations = coefficients.map(
    (row, i) =>
      `${polynomial(row.map((v, j): [number, string] => [v, vars[j]]))} = ${formatNumber(constants[i])}`,
  );
  steps.push({ key: 'equation', math: equations.join('\n') });

  const mainDet = det(coefficients);
  const maxAbs = Math.max(1, ...all.map((v) => Math.abs(v)));
  // 特異判定の許容誤差は係数行列のスケールだけで決める（定数項が大きくても影響させない）
  const maxCoef = Math.max(...coefficients.flat().map((v) => Math.abs(v)));
  const detTol = 1e-10 * Math.pow(maxCoef, n);
  const singular = Math.abs(mainDet.value) <= detTol;
  const dValue = singular ? 0 : mainDet.value;

  steps.push({
    key: 'determinant',
    math: `D = ${mainDet.expr} = ${formatNumber(dValue)}`,
  });

  if (singular) {
    const tol = 1e-9 * maxAbs;
    const rankA = rank(coefficients, tol);
    const rankAug = rank(
      coefficients.map((row, i) => [...row, constants[i]]),
      tol,
    );
    steps.push({
      key: 'rankCheck',
      math: `rank A = ${rankA}, rank [A | b] = ${rankAug}`,
    });
    return {
      kind: rankA < rankAug ? 'none' : 'infinite',
      size,
      determinant: 0,
      solutions: [],
      steps,
    };
  }

  const allInteger = all.every(Number.isInteger);
  const solutions: LinearSolution[] = [];
  for (let k = 0; k < n; k++) {
    const replaced = coefficients.map((row, i) =>
      row.map((v, j) => (j === k ? constants[i] : v)),
    );
    const dk = det(replaced);
    steps.push({
      key: 'replacedDeterminant',
      math: `D${vars[k]} = ${dk.expr} = ${formatNumber(dk.value)}`,
    });
    const value = dk.value / mainDet.value;
    const fraction = allInteger ? fractionText(dk.value, mainDet.value) : null;
    solutions.push({
      variable: vars[k],
      value,
      fraction,
      text: formatNumber(value),
    });
    steps.push({
      key: 'solution',
      math: `${vars[k]} = D${vars[k]} / D = ${formatNumber(dk.value)} / ${formatNumber(mainDet.value)} = ${fraction ? `${fraction} ≈ ` : ''}${formatNumber(value)}`,
    });
  }

  return {
    kind: 'unique',
    size,
    determinant: mainDet.value,
    solutions,
    steps,
  };
}
