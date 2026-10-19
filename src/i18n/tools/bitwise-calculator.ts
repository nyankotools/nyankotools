import type { Locale } from '../../data/tools';
import type { BitOp } from '../../lib/tools/bitwise-calculator';

interface GlossaryTerm {
  term: string;
  description: string;
}

export interface BitwiseCalculatorPageContent {
  title: string;
  description: string;
  h1: string;
  /** set:html で描画するため、開発者管理の固定リテラルのみを入れること（ユーザー入力を混ぜない） */
  introHtml: string;
  widthLabel: string;
  opLabel: string;
  opNames: Record<BitOp, string>;
  operandALabel: string;
  operandBLabel: string;
  operandBShiftLabel: string;
  operandPlaceholder: string;
  errorInvalid: string;
  errorOutOfRange: string;
  resultHeading: string;
  rowOperandA: string;
  rowOperandB: string;
  rowShiftCount: string;
  rowResult: string;
  valueLabels: {
    unsigned: string;
    signed: string;
    hex: string;
    octal: string;
    binary: string;
    popcount: string;
  };
  bitsNote: string;
  copyResult: string;
  copied: string;
  copyFailed: string;
  notesHeading: string;
  notes: string[];
  glossaryHeading: string;
  glossaryTerms: GlossaryTerm[];
}

export const bitwiseCalculatorContent: Record<
  Locale,
  BitwiseCalculatorPageContent
> = {
  ja: {
    title: 'ビット演算計算機（AND・OR・XOR・NOT・シフト・2の補数）',
    description:
      'AND・OR・XOR・NOT・シフト・ローテートを8/16/32/64bitで計算し、結果を2進・10進・16進で並べて表示。ビットごとの可視化と2の補数に対応。データはブラウザ内で処理され、サーバーには送信されません。',
    h1: 'ビット演算計算機（AND/OR/XOR/NOT/シフト・2の補数）',
    introHtml:
      '2つの値とビット幅、演算を選ぶと、結果を2進・10進・16進で同時に表示し、立っているビットを色で見分けられます。値は10進、0x付きの16進、0b付きの2進、負数（2の補数）で入力でき、64bitでも桁あふれせず計算します。単純な進数変換だけなら <a href="/tools/base-converter/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">進数変換ツール</a> をご利用ください。ブラウザ内で処理され、入力内容がサーバーに送信されることはありません。',
    widthLabel: 'ビット幅',
    opLabel: '演算',
    opNames: {
      and: 'AND（論理積）',
      or: 'OR（論理和）',
      xor: 'XOR（排他的論理和）',
      nand: 'NAND',
      nor: 'NOR',
      xnor: 'XNOR',
      not: 'NOT（ビット反転）',
      shl: '左シフト（<<）',
      shr: '論理右シフト（>>>）',
      sar: '算術右シフト（>>）',
      rol: '左ローテート',
      ror: '右ローテート',
    },
    operandALabel: '値A',
    operandBLabel: '値B',
    operandBShiftLabel: 'シフト・回転するビット数',
    operandPlaceholder: '例: 255 / 0xFF / 0b1010 / -1',
    errorInvalid:
      '数値として読み取れません。10進、0x付き16進、0b付き2進、0o付き8進で入力してください。',
    errorOutOfRange:
      '選んだビット幅に収まらない値です。ビット幅を広げるか、値を小さくしてください。',
    resultHeading: '計算結果',
    rowOperandA: '値A',
    rowOperandB: '値B',
    rowShiftCount: 'ビット数',
    rowResult: '結果',
    valueLabels: {
      unsigned: '10進（符号なし）',
      signed: '10進（符号付き・2の補数）',
      hex: '16進',
      octal: '8進',
      binary: '2進',
      popcount: '立っているビット数',
    },
    bitsNote:
      '青いマスが1、灰色のマスが0です。左端が最上位ビットで、8ビットごとに折り返します。',
    copyResult: '結果をコピー',
    copied: 'コピーしました',
    copyFailed: 'コピーに失敗しました',
    notesHeading: '注意事項',
    notes: [
      '値は選んだビット幅の符号なし範囲（例: 8bitなら0〜255）か、2の補数の符号付き範囲（-128〜127）で入力できます。負数は2の補数のビット列に変換して計算します。',
      'NOT・NAND・NOR・XNORの結果は、選んだビット幅で切り詰めます。幅を変えると上位ビットの0/1が変わります。',
      '左シフトであふれた上位ビットは捨てます。シフト量がビット幅以上のときは、左シフトと論理右シフトは0、算術右シフトは符号ビットで埋めた値になります。',
      'ローテートは、あふれたビットを反対側に回します。回転量はビット幅で割った余りとして扱います。',
      '数値の途中にあるアンダースコアと空白は無視します（例: 0b1111_0000）。',
    ],
    glossaryHeading: '用語解説',
    glossaryTerms: [
      {
        term: '2の補数',
        description:
          '負の整数をビット列で表す方法です。正の値のビットを反転して1を足すと負数になります。8bitなら-1は11111111、-128は10000000です。最上位ビットが1なら負数として読みます。',
      },
      {
        term: '論理右シフトと算術右シフト',
        description:
          '論理右シフトは空いた上位ビットを0で埋めます。算術右シフトは符号ビットのコピーで埋めるため、負数は負数のまま2のべき乗で割った値になります。',
      },
      {
        term: 'ローテート',
        description:
          'シフトであふれたビットを捨てず、反対側から戻す操作です。ハッシュ関数や暗号のアルゴリズムでよく使われます。',
      },
      {
        term: 'XOR（排他的論理和）',
        description:
          '2つのビットが異なるときだけ1になる演算です。同じ値で2回XORすると元に戻るため、簡易的な暗号化やフラグの反転に使われます。',
      },
    ],
  },
  en: {
    title: 'Bitwise Calculator (AND, OR, XOR, NOT, Shift, Rotate)',
    description:
      'Calculate AND, OR, XOR, NOT, shifts and rotates for 8/16/32/64-bit values. See results in binary, decimal and hex with a bit-by-bit view. Runs in your browser.',
    h1: 'Bitwise Calculator (AND/OR/XOR/NOT/Shift, Two’s Complement)',
    introHtml:
      'Pick two values, a bit width and an operation to see the result in binary, decimal and hex at once, with every set bit highlighted. Enter values in decimal, hex ("0xFF"), binary ("0b1010") or as negative numbers (two’s complement). BigInt keeps 64-bit math exact. For plain base conversion, use the <a href="/en/tools/base-converter/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">Base Converter</a>. Everything runs in your browser, so nothing you type is sent to a server.',
    widthLabel: 'Bit width',
    opLabel: 'Operation',
    opNames: {
      and: 'AND',
      or: 'OR',
      xor: 'XOR',
      nand: 'NAND',
      nor: 'NOR',
      xnor: 'XNOR',
      not: 'NOT (bit flip)',
      shl: 'Shift left (<<)',
      shr: 'Logical shift right (>>>)',
      sar: 'Arithmetic shift right (>>)',
      rol: 'Rotate left',
      ror: 'Rotate right',
    },
    operandALabel: 'Value A',
    operandBLabel: 'Value B',
    operandBShiftLabel: 'Number of bits to shift or rotate',
    operandPlaceholder: 'e.g. 255 / 0xFF / 0b1010 / -1',
    errorInvalid:
      'Could not read that number. Use decimal, 0x hex, 0b binary or 0o octal.',
    errorOutOfRange:
      'That value does not fit in the selected bit width. Choose a wider width or a smaller value.',
    resultHeading: 'Result',
    rowOperandA: 'Value A',
    rowOperandB: 'Value B',
    rowShiftCount: 'Bit count',
    rowResult: 'Result',
    valueLabels: {
      unsigned: 'Decimal (unsigned)',
      signed: 'Decimal (signed, two’s complement)',
      hex: 'Hex',
      octal: 'Octal',
      binary: 'Binary',
      popcount: 'Set bits',
    },
    bitsNote:
      'Blue cells are 1 and gray cells are 0. The leftmost cell is the most significant bit, and rows wrap every 8 bits.',
    copyResult: 'Copy result',
    copied: 'Copied',
    copyFailed: 'Copy failed',
    notesHeading: 'Notes',
    notes: [
      'Values must fit the unsigned range of the selected width (0 to 255 for 8 bits) or the signed two’s complement range (-128 to 127). Negative numbers are converted to their two’s complement bits before the operation.',
      'The results of NOT, NAND, NOR and XNOR are truncated to the selected width, so changing the width changes the upper bits.',
      'Bits shifted out on the left are discarded. If the shift count is the bit width or more, shift left and logical shift right give 0, and arithmetic shift right fills with the sign bit.',
      'Rotates wrap the overflowing bits around to the other end. The count is taken modulo the bit width.',
      'Underscores and spaces inside a number are ignored (for example 0b1111_0000).',
    ],
    glossaryHeading: 'Glossary',
    glossaryTerms: [
      {
        term: 'Two’s complement',
        description:
          'The usual way to store negative integers in bits. Flip every bit of the positive value and add 1. In 8 bits, -1 is 11111111 and -128 is 10000000. If the top bit is 1, the value is read as negative.',
      },
      {
        term: 'Logical vs arithmetic shift right',
        description:
          'A logical shift fills the vacated top bits with 0. An arithmetic shift copies the sign bit, so a negative number stays negative and is divided by a power of two.',
      },
      {
        term: 'Rotate',
        description:
          'A shift that feeds the bits falling off one end back in at the other end. It is common in hash functions and ciphers.',
      },
      {
        term: 'XOR (exclusive OR)',
        description:
          'Gives 1 only when the two bits differ. XORing with the same value twice restores the original, which is why it appears in simple ciphers and flag toggling.',
      },
    ],
  },
};
