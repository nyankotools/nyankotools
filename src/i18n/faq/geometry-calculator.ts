import type { FaqContent } from '../faq';

export const faq: FaqContent = {
  ja: [
    {
      question: '円周率は何桁で計算されますか？',
      answer:
        '初期設定ではJavaScriptが持つ倍精度の円周率（3.141592653589793）を使います。学校の問題などに合わせて 3.14 や 3.1416 などの桁数を選ぶこともでき、途中式にもその値が表示されます。',
    },
    {
      question: '面積や体積の単位はどう決まりますか？',
      answer:
        '選んだ長さの単位に合わせて自動で切り替わります。cm で入力すれば面積は cm²、体積は cm³ です。単位が混在している場合は、先に同じ単位へ換算してから入力してください。',
    },
    {
      question: '0 や負の数を入力するとどうなりますか？',
      answer:
        '長さが 0 以下の図形は存在しないため、エラーを表示して計算しません。小数は入力できます。',
    },
    {
      question: '円錐の表面積はどう計算していますか？',
      answer:
        '母線の長さ l = √(r² + h²) を求め、底面積 π r² と側面積 π r l を合計した π × r × (r + l) で計算します。',
    },
  ],
  en: [
    {
      question: 'How many digits of pi does it use?',
      answer:
        'By default it uses the double-precision pi built into JavaScript (3.141592653589793). You can choose 3.14, 3.1416 or another rounded value to match a textbook or exam, and the steps show that value.',
    },
    {
      question: 'How are the area and volume units decided?',
      answer:
        'They follow the length unit you pick: enter lengths in cm and areas are in cm² and volumes in cm³. If your lengths use mixed units, convert them to one unit first.',
    },
    {
      question: 'What happens if I enter 0 or a negative number?',
      answer:
        'A shape cannot have a length of 0 or less, so an error is shown and nothing is calculated. Decimal values are fine.',
    },
    {
      question: 'How is the surface area of a cone calculated?',
      answer:
        'It finds the slant height l = √(r² + h²), then adds the base area π r² and the lateral area π r l, giving π × r × (r + l).',
    },
  ],
};
