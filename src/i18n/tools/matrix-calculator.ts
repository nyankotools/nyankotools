import type { Locale } from '../../data/tools';

interface GlossaryTerm {
  term: string;
  description: string;
}

export interface MatrixCalculatorPageContent {
  title: string;
  description: string;
  h1: string;
  introHtml: string;

  operationLabel: string;
  operations: {
    add: string;
    sub: string;
    mul: string;
    scalar: string;
    transpose: string;
    inverse: string;
    determinant: string;
  };
  displayLabel: string;
  displayFraction: string;
  displayDecimal: string;
  matrixALabel: string;
  matrixBLabel: string;
  rowsLabel: string;
  colsLabel: string;
  scalarLabel: string;
  scalarPlaceholder: string;
  /** プレースホルダ: {name} {r} {c} */
  cellLabelTemplate: string;
  resultHeading: string;
  determinantResultLabel: string;
  copyButton: string;
  copied: string;
  copyFailed: string;
  /** プレースホルダ: {ar} {ac} {br} {bc} */
  errorSameSize: string;
  errorMulSize: string;
  errorNotSquare: string;
  errorSingular: string;
  /** プレースホルダ: {name} {r} {c} */
  errorInvalidCell: string;
  errorInvalidScalar: string;

  notesHeading: string;
  notes: string[];
  glossaryHeading: string;
  glossaryTerms: GlossaryTerm[];
}

export const matrixCalculatorContent: Record<
  Locale,
  MatrixCalculatorPageContent
> = {
  ja: {
    title: '行列計算機（和・差・積・逆行列・行列式を分数で厳密に計算）',
    description:
      '最大6×6の行列の和・差・積・スカラー倍・転置・逆行列・行列式を計算できる無料ツールです。分数で厳密に計算し、小数表示にも切り替え可能。データはブラウザ内で処理され、サーバーには送信されません。',
    h1: '行列計算機（逆行列・行列式対応）',
    introHtml:
      '最大6×6の行列について、和・差・積・スカラー倍・転置・逆行列・行列式を計算します。要素は整数・小数・分数（例: 1/3）で入力でき、内部では分数のまま厳密に計算するため、逆行列も丸め誤差のない分数で確認できます。学習用の検算にも使えます。計算はブラウザ内で行われ、入力内容がサーバーに送信されることはありません。平均や分散などを求めたい場合は <a href="/tools/statistics-calculator/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">統計計算機</a> もご利用ください。',

    operationLabel: '計算の種類',
    operations: {
      add: '和（A＋B）',
      sub: '差（A－B）',
      mul: '積（A×B）',
      scalar: 'スカラー倍（k×A）',
      transpose: '転置（Aᵀ）',
      inverse: '逆行列（A⁻¹）',
      determinant: '行列式（det A）',
    },
    displayLabel: '表示形式',
    displayFraction: '分数',
    displayDecimal: '小数',
    matrixALabel: '行列A',
    matrixBLabel: '行列B',
    rowsLabel: '行数',
    colsLabel: '列数',
    scalarLabel: 'スカラー k',
    scalarPlaceholder: '例: 2 / 0.5 / 1/3',
    cellLabelTemplate: '行列{name}の{r}行{c}列',
    resultHeading: '計算結果',
    determinantResultLabel: '行列式 det A',
    copyButton: '結果をコピー',
    copied: 'コピーしました',
    copyFailed: 'コピーに失敗しました',
    errorSameSize:
      '和・差は2つの行列の行数と列数が同じときだけ計算できます（A は {ar}×{ac}、B は {br}×{bc}）',
    errorMulSize:
      '積 A×B は A の列数と B の行数が等しいときだけ計算できます（A は {ar}×{ac}、B は {br}×{bc}）',
    errorNotSquare:
      '逆行列と行列式は正方行列（行数と列数が同じ）でのみ求められます',
    errorSingular: '行列式が 0 の特異行列なので、逆行列は存在しません',
    errorInvalidCell:
      '{name}の{r}行{c}列を数値として読み取れません（整数・小数・分数で入力してください）',
    errorInvalidScalar:
      'スカラー k を数値として読み取れません（整数・小数・分数で入力してください）',

    notesHeading: '注意事項',
    notes: [
      '要素には整数・小数（0.25）・分数（3/4）を入力できます。空欄は 0 として扱います。指数表記（1e3）には対応していません。',
      '内部では BigInt による分数で計算するため、足し算・掛け算・逆行列に丸め誤差は出ません。小数表示は小数第6位で四捨五入した値で、割り切れない分数は近似値になります。',
      'サイズは 1×1 から 6×6 までです。逆行列と行列式を求めるには正方行列が必要です。',
      '逆行列の項目は、行列式が 0 の特異行列ではエラーになります。',
      '学習・検算を目的としたツールです。実務で使う場合は別の手段でも結果を確認してください。',
    ],
    glossaryHeading: '用語解説',
    glossaryTerms: [
      {
        term: '行列',
        description:
          '数を長方形に並べたもの。m行n列のものを m×n 行列と呼び、和・差は同じサイズ同士、積 A×B は A の列数と B の行数が等しいときに定義されます。積は交換法則（A×B＝B×A）が一般に成り立ちません。',
      },
      {
        term: '転置行列',
        description:
          '行と列を入れ替えた行列。m×n 行列を転置すると n×m 行列になり、(i, j) 成分が (j, i) 成分に移ります。',
      },
      {
        term: '行列式',
        description:
          '正方行列に対して決まる1つの数。逆行列が存在するかどうかの判定に使われ、0 のときは逆行列がありません。2×2 行列 [[a, b], [c, d]] では ad − bc です。',
      },
      {
        term: '逆行列',
        description:
          '元の行列にかけると単位行列になる行列（A×A⁻¹＝E）。正方行列で行列式が 0 でないときだけ存在し、このツールでは掃き出し法（ガウス・ジョルダン法）で求めています。',
      },
      {
        term: '特異行列',
        description:
          '行列式が 0 で、逆行列を持たない正方行列。ある行が他の行の定数倍や和で表せるときなどに該当します。',
      },
    ],
  },
  en: {
    title: 'Matrix Calculator: Inverse, Determinant, Multiply',
    description:
      'Add, subtract, multiply, transpose and invert matrices up to 6x6, or find the determinant. Exact fractions or decimals. Runs in your browser; nothing is sent.',
    h1: 'Matrix Calculator (Inverse & Determinant)',
    introHtml:
      'Add, subtract, multiply, scale, transpose and invert matrices up to 6×6, or compute a determinant. Enter integers, decimals or fractions such as 1/3. Everything is calculated as exact fractions, so an inverse comes out with no rounding error, which makes it handy for checking homework. All processing happens in your browser, and nothing you enter is sent to a server. For averages and variance, see the <a href="/en/tools/statistics-calculator/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">Statistics Calculator</a>.',

    operationLabel: 'Operation',
    operations: {
      add: 'Add (A + B)',
      sub: 'Subtract (A − B)',
      mul: 'Multiply (A × B)',
      scalar: 'Scalar multiple (k × A)',
      transpose: 'Transpose (Aᵀ)',
      inverse: 'Inverse (A⁻¹)',
      determinant: 'Determinant (det A)',
    },
    displayLabel: 'Display as',
    displayFraction: 'Fractions',
    displayDecimal: 'Decimals',
    matrixALabel: 'Matrix A',
    matrixBLabel: 'Matrix B',
    rowsLabel: 'Rows',
    colsLabel: 'Columns',
    scalarLabel: 'Scalar k',
    scalarPlaceholder: 'e.g. 2 / 0.5 / 1/3',
    cellLabelTemplate: 'Matrix {name}, row {r}, column {c}',
    resultHeading: 'Result',
    determinantResultLabel: 'Determinant det A',
    copyButton: 'Copy result',
    copied: 'Copied',
    copyFailed: 'Copy failed',
    errorSameSize:
      'Addition and subtraction need two matrices of the same size (A is {ar}×{ac}, B is {br}×{bc}).',
    errorMulSize:
      'A × B needs the number of columns in A to equal the number of rows in B (A is {ar}×{ac}, B is {br}×{bc}).',
    errorNotSquare:
      'The inverse and the determinant are only defined for square matrices (same number of rows and columns).',
    errorSingular:
      'This matrix is singular (its determinant is 0), so it has no inverse.',
    errorInvalidCell:
      'Matrix {name}, row {r}, column {c} is not a valid number. Use an integer, decimal or fraction.',
    errorInvalidScalar:
      'The scalar k is not a valid number. Use an integer, decimal or fraction.',

    notesHeading: 'Notes',
    notes: [
      'Entries can be integers, decimals (0.25) or fractions (3/4). Empty cells count as 0. Scientific notation such as 1e3 is not supported.',
      'Calculations use exact BigInt fractions, so addition, multiplication and inversion have no rounding error. Decimal output is rounded to 6 places, so non-terminating fractions are approximations.',
      'Sizes range from 1×1 to 6×6. The inverse and the determinant need a square matrix.',
      'Inverting a singular matrix (determinant 0) shows an error instead of a result.',
      'This tool is meant for learning and checking your work. For anything important, verify the result another way.',
    ],
    glossaryHeading: 'Glossary',
    glossaryTerms: [
      {
        term: 'Matrix',
        description:
          'A rectangular array of numbers. An m×n matrix has m rows and n columns. Sums and differences need matching sizes, and A × B is defined when the columns of A equal the rows of B. Multiplication is generally not commutative (A × B ≠ B × A).',
      },
      {
        term: 'Transpose',
        description:
          'The matrix with rows and columns swapped. Transposing an m×n matrix gives an n×m matrix, moving entry (i, j) to position (j, i).',
      },
      {
        term: 'Determinant',
        description:
          'A single number computed from a square matrix. If it is 0 the matrix has no inverse. For a 2×2 matrix [[a, b], [c, d]] it equals ad − bc.',
      },
      {
        term: 'Inverse matrix',
        description:
          'The matrix that gives the identity when multiplied by the original (A × A⁻¹ = I). It exists only for square matrices with a non-zero determinant. This tool finds it with Gauss-Jordan elimination.',
      },
      {
        term: 'Singular matrix',
        description:
          'A square matrix whose determinant is 0, so it has no inverse. This happens, for example, when one row is a multiple or a sum of other rows.',
      },
    ],
  },
};
