import type { FaqContent } from '../faq';

export const faq: FaqContent = {
  ja: [
    {
      question: '0.1+0.2 が 0.3 にならないのはなぜですか？',
      answer:
        '0.1と0.2は2進数では割り切れず、float64では少しずれた近似値で保存されます。足した結果をさらに丸めると0.30000000000000004になります。このツールで0.1+0.2を入力すると、結果のビット列と正確な10進値を確認できます。',
    },
    {
      question: 'float32とfloat64の違いは何ですか？',
      answer:
        'float32は32bit（符号1・指数部8・仮数部23）で有効桁数は約7桁、float64は64bit（符号1・指数部11・仮数部52）で約15〜17桁です。JavaScriptのNumberはfloat64です。',
    },
    {
      question: 'ビット列や16進から数値に戻すにはどう入力しますか？',
      answer:
        '16進は0x3FB999999999999Aのように0xを付けます。2進は、0bなしならビット幅ぴったり（float32は32桁、float64は64桁）、0b付きなら上位の0を省略できます。ビット幅の選択に合わせて解釈されます。',
    },
    {
      question: 'NaNや-0、非正規化数はどう表示されますか？',
      answer:
        '指数部がすべて1ならInfinityまたはNaN、すべて0で仮数部が0以外なら非正規化数です。-0は符号ビットだけが1のゼロで、0と等しいと比較されますがビットは異なります。「値の種類」で判別できます。',
    },
  ],
  en: [
    {
      question: 'Why is 0.1 + 0.2 not exactly 0.3?',
      answer:
        'Neither 0.1 nor 0.2 can be written exactly in binary, so float64 stores slightly-off approximations. Adding them and rounding again gives 0.30000000000000004. Enter 0.1+0.2 here to see the resulting bits and exact decimal value.',
    },
    {
      question: 'What is the difference between float32 and float64?',
      answer:
        'float32 has 32 bits (1 sign, 8 exponent, 23 mantissa) and about 7 significant digits. float64 has 64 bits (1, 11, 52) and about 15 to 17 digits. A JavaScript Number is a float64.',
    },
    {
      question: 'How do I convert a bit string or hex back to a number?',
      answer:
        'Prefix hex with 0x, as in 0x3FB999999999999A. A binary string must have the full width (32 digits for float32, 64 for float64) unless it starts with 0b, which lets you drop leading zeros. It is read at the selected bit width.',
    },
    {
      question: 'How are NaN, -0 and subnormal numbers shown?',
      answer:
        'An all-ones exponent means Infinity or NaN, and an all-zero exponent with a non-zero mantissa is subnormal. -0 is zero with only the sign bit set; it compares equal to 0 but has different bits. "Kind of value" tells you which one you have.',
    },
  ],
};
