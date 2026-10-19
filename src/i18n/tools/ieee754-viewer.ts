import type { Locale } from '../../data/tools';
import type {
  FloatCategory,
  InputKind,
  Precision,
} from '../../lib/tools/ieee754-viewer';

interface GlossaryTerm {
  term: string;
  description: string;
}

interface Sample {
  label: string;
  value: string;
  precision: Precision;
}

export interface Ieee754ViewerPageContent {
  title: string;
  description: string;
  h1: string;
  /** set:html で描画するため、開発者管理の固定リテラルのみを入れること（ユーザー入力を混ぜない） */
  introHtml: string;
  inputLabel: string;
  inputPlaceholder: string;
  defaultInput: string;
  precisionLabel: string;
  precisionOptions: Record<'32' | '64', string>;
  samplesLabel: string;
  samples: Sample[];
  errorMessage: string;
  kindLabel: string;
  kindLabels: Record<InputKind, string>;
  categoryLabel: string;
  categoryLabels: Record<FloatCategory, string>;
  signLegend: string;
  exponentLegend: string;
  mantissaLegend: string;
  rowLabels: {
    value: string;
    exact: string;
    hex: string;
    binary: string;
    sign: string;
    exponentField: string;
    exponent: string;
    leadingBit: string;
    mantissa: string;
  };
  signPositive: string;
  signNegative: string;
  copyResult: string;
  copied: string;
  copyFailed: string;
  howToHeading: string;
  howToSteps: string[];
  notesHeading: string;
  notes: string[];
  glossaryHeading: string;
  glossaryTerms: GlossaryTerm[];
}

export const ieee754ViewerContent: Record<Locale, Ieee754ViewerPageContent> = {
  ja: {
    title: '浮動小数点（IEEE 754）ビット表示・変換 float32/float64',
    description:
      '数値をfloat32・float64のビット列（符号・指数部・仮数部）と16進に変換し、逆変換にも対応。0.1+0.2の誤差、NaN・Infinity・非正規化数も確認できます。データはブラウザ内で処理されます。',
    h1: '浮動小数点（IEEE 754）ビット表示・変換ツール',
    introHtml:
      '10進数を入力すると、IEEE 754のfloat32（単精度）・float64（倍精度）で符号・指数部・仮数部がどうなるかをビット単位で表示します。0x付き16進やビット列を入力して数値に戻すこともでき、NaN・Infinity・-0・非正規化数にも対応します。0.1+0.2 のような式を入れると、計算結果の誤差の理由も確かめられます。ブラウザ内で処理され、入力内容がサーバーに送信されることはありません。整数の基数変換は <a href="/tools/base-converter/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">基数変換ツール</a> をご利用ください。',
    inputLabel: '値またはビット列',
    inputPlaceholder: '0.1 / 0.1+0.2 / 0x3FB999999999999A / NaN',
    defaultInput: '0.1+0.2',
    precisionLabel: 'ビット幅',
    precisionOptions: {
      '32': 'float32（単精度）',
      '64': 'float64（倍精度）',
    },
    samplesLabel: 'サンプル',
    samples: [
      { label: '0.1', value: '0.1', precision: 64 },
      { label: '0.1+0.2', value: '0.1+0.2', precision: 64 },
      { label: '円周率（float32）', value: '3.14159265', precision: 32 },
      { label: '-0', value: '-0', precision: 64 },
      { label: 'Infinity', value: 'Infinity', precision: 64 },
      { label: 'NaN', value: 'NaN', precision: 64 },
    ],
    errorMessage:
      '解釈できません。10進数、0x付き16進、0b付きまたは全桁のビット列、0.1+0.2のような式を入力してください',
    kindLabel: '入力の解釈',
    kindLabels: {
      decimal: '10進数',
      expression: '式（計算結果を丸めて表示）',
      hex: '16進のビット列',
      binary: '2進のビット列',
    },
    categoryLabel: '値の種類',
    categoryLabels: {
      zero: 'ゼロ',
      subnormal: '非正規化数',
      normal: '正規化数',
      infinity: '無限大',
      'nan-quiet': 'NaN（quiet）',
      'nan-signaling': 'NaN（signaling）',
    },
    signLegend: '符号',
    exponentLegend: '指数部',
    mantissaLegend: '仮数部',
    rowLabels: {
      value: '最短の10進表記',
      exact: '正確な10進値',
      hex: '16進',
      binary: '2進（符号 指数部 仮数部）',
      sign: '符号',
      exponentField: '指数部（バイアス付き）',
      exponent: '実効指数',
      leadingBit: '暗黙の先頭ビット',
      mantissa: '仮数部のビット',
    },
    signPositive: '0（正）',
    signNegative: '1（負）',
    copyResult: '結果をコピー',
    copied: 'コピーしました',
    copyFailed: 'コピーに失敗しました',
    howToHeading: '使い方',
    howToSteps: [
      '「ビット幅」でfloat32（単精度）かfloat64（倍精度）を選びます。',
      '「値またはビット列」に10進数、0x付き16進、ビット列、または 0.1+0.2 のような式を入力します。',
      '符号・指数部・仮数部の色分けと、正確な10進値、16進が表示されます。',
      '「結果をコピー」で内容をまとめてコピーできます。',
    ],
    notesHeading: '注意事項',
    notes: [
      '2進のビット列は、0b なしの場合はビット幅ぴったりの桁数（float32は32桁、float64は64桁）が必要です。0b を付けると上位の0を省略できます。空白・アンダースコアは無視します。',
      '16進は0xを付けて入力してください。桁数が足りない場合は上位に0を補います。',
      '式は 数値・演算子・数値 の2項（+ - * /）のみ対応します。float32を選んだときは、各オペランドと結果をfloat32に丸めて計算します。',
      'float32では、範囲外の値はInfinityに、極小の値は非正規化数または0に丸められます。',
      '「正確な10進値」は、ビット列が表す値を2進数から厳密に展開したものです。0.1が正確に0.1にならないのはこの仕組みのためです。',
      'NaNは入力すると代表的なquiet NaN（float64は0x7FF8000000000000）になります。ビット列から入力すれば、他のNaNのビットパターンも確認できます。',
    ],
    glossaryHeading: '用語解説',
    glossaryTerms: [
      {
        term: 'IEEE 754',
        description:
          '浮動小数点数の標準規格です。値を「符号 × 1.仮数部 × 2^指数」の形で表します。float32は符号1bit・指数部8bit・仮数部23bit、float64は符号1bit・指数部11bit・仮数部52bitです。',
      },
      {
        term: 'バイアス付き指数',
        description:
          '指数部に格納される値は、実効指数にバイアス（float32は127、float64は1023）を足したものです。これで負の指数も符号なし整数として保存できます。',
      },
      {
        term: '非正規化数（サブノーマル）',
        description:
          '指数部がすべて0の数です。先頭の暗黙のビットが1ではなく0になり、0に近い非常に小さな値を表現できます。',
      },
      {
        term: 'NaN / Infinity',
        description:
          '指数部がすべて1の特殊値です。仮数部が0なら無限大、0以外ならNaN（Not a Number）です。仮数部の最上位ビットが1ならquiet NaN、0ならsignaling NaNです。',
      },
      {
        term: '0.1+0.2 が 0.3 にならない理由',
        description:
          '0.1も0.2も2進数では循環小数になり、有限のビット数で丸められた近似値として保存されます。その近似値同士の和をさらに丸めるため、0.30000000000000004 になります。',
      },
    ],
  },
  en: {
    title: 'IEEE 754 Float Viewer: float32 / float64 Bits Converter',
    description:
      'See float32 and float64 as sign, exponent and mantissa bits plus hex, and convert bits back to a number. Explains 0.1+0.2; handles NaN, Infinity and subnormals.',
    h1: 'IEEE 754 Floating-Point Bit Viewer & Converter',
    introHtml:
      'Enter a decimal number to see how IEEE 754 float32 (single) and float64 (double) store it, bit by bit: sign, exponent and mantissa. You can also paste hex or a bit string to decode it back into a number, and NaN, Infinity, -0 and subnormal numbers are all supported. Try an expression like 0.1+0.2 to see exactly where the rounding error comes from. Everything runs in your browser, so nothing you type is sent to a server. For integer base conversion, use the <a href="/en/tools/base-converter/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">Base Converter</a>.',
    inputLabel: 'Value or bits',
    inputPlaceholder: '0.1 / 0.1+0.2 / 0x3FB999999999999A / NaN',
    defaultInput: '0.1+0.2',
    precisionLabel: 'Bit width',
    precisionOptions: {
      '32': 'float32 (single)',
      '64': 'float64 (double)',
    },
    samplesLabel: 'Examples',
    samples: [
      { label: '0.1', value: '0.1', precision: 64 },
      { label: '0.1+0.2', value: '0.1+0.2', precision: 64 },
      { label: 'Pi (float32)', value: '3.14159265', precision: 32 },
      { label: '-0', value: '-0', precision: 64 },
      { label: 'Infinity', value: 'Infinity', precision: 64 },
      { label: 'NaN', value: 'NaN', precision: 64 },
    ],
    errorMessage:
      'Could not parse this. Enter a decimal number, 0x hex, a bit string (full length or 0b-prefixed), or an expression like 0.1+0.2',
    kindLabel: 'Input read as',
    kindLabels: {
      decimal: 'Decimal number',
      expression: 'Expression (result is rounded)',
      hex: 'Hex bit pattern',
      binary: 'Binary bit pattern',
    },
    categoryLabel: 'Kind of value',
    categoryLabels: {
      zero: 'Zero',
      subnormal: 'Subnormal',
      normal: 'Normal',
      infinity: 'Infinity',
      'nan-quiet': 'NaN (quiet)',
      'nan-signaling': 'NaN (signaling)',
    },
    signLegend: 'Sign',
    exponentLegend: 'Exponent',
    mantissaLegend: 'Mantissa',
    rowLabels: {
      value: 'Shortest decimal',
      exact: 'Exact decimal value',
      hex: 'Hex',
      binary: 'Binary (sign exponent mantissa)',
      sign: 'Sign',
      exponentField: 'Exponent field (biased)',
      exponent: 'Actual exponent',
      leadingBit: 'Implicit leading bit',
      mantissa: 'Mantissa bits',
    },
    signPositive: '0 (positive)',
    signNegative: '1 (negative)',
    copyResult: 'Copy result',
    copied: 'Copied',
    copyFailed: 'Copy failed',
    howToHeading: 'How to use',
    howToSteps: [
      'Pick float32 (single) or float64 (double) under "Bit width".',
      'Type a decimal number, 0x hex, a bit string or an expression like 0.1+0.2 into "Value or bits".',
      'The sign, exponent and mantissa are color-coded, with the exact decimal value and hex below.',
      'Use "Copy result" to copy everything at once.',
    ],
    notesHeading: 'Notes',
    notes: [
      'Without a 0b prefix, a bit string must be exactly as long as the width (32 digits for float32, 64 for float64). With 0b you can omit leading zeros. Spaces and underscores are ignored.',
      'Add the 0x prefix for hex. Shorter values are padded with zeros on the left.',
      'Expressions support only two operands with + - * / . In float32 mode each operand and the result are rounded to float32.',
      'In float32, out-of-range values become Infinity and tiny values become subnormal or zero.',
      '"Exact decimal value" is the precise value the bits represent, expanded from binary. This is why 0.1 is never exactly 0.1.',
      'Typing NaN gives the usual quiet NaN (0x7FF8000000000000 in float64). Enter a bit pattern to inspect other NaN payloads.',
    ],
    glossaryHeading: 'Glossary',
    glossaryTerms: [
      {
        term: 'IEEE 754',
        description:
          'The standard for floating-point numbers. A value is stored as sign × 1.mantissa × 2^exponent. float32 uses 1 sign bit, 8 exponent bits and 23 mantissa bits; float64 uses 1, 11 and 52.',
      },
      {
        term: 'Biased exponent',
        description:
          'The stored exponent is the actual exponent plus a bias (127 for float32, 1023 for float64), so negative exponents fit in an unsigned field.',
      },
      {
        term: 'Subnormal number',
        description:
          'A number whose exponent bits are all 0. The implicit leading bit is 0 instead of 1, which lets the format represent very small values close to zero.',
      },
      {
        term: 'NaN / Infinity',
        description:
          'Special values with all exponent bits set to 1. A zero mantissa means Infinity; anything else is NaN (Not a Number). If the top mantissa bit is 1 it is a quiet NaN, otherwise a signaling NaN.',
      },
      {
        term: 'Why 0.1 + 0.2 is not 0.3',
        description:
          'Both 0.1 and 0.2 are repeating fractions in binary, so they are stored as rounded approximations. Their sum is rounded again, giving 0.30000000000000004.',
      },
    ],
  },
};
